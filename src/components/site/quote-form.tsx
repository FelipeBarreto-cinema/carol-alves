import { useId, useMemo, useState } from 'react'
import { useLang } from '../../lib/i18n'
import { SITE_CONFIG } from '../../lib/site-content'

type Status = 'idle' | 'missing' | 'opened' | 'copied' | 'copyError'

const fieldCls =
  'mt-2 w-full border border-gold/30 bg-ink/60 px-4 py-3 text-base text-ivory placeholder:text-ivory-dim/60 transition-colors focus:border-gold focus:outline-none focus-visible:outline-2 focus-visible:outline-gold aria-invalid:border-destructive aria-invalid:bg-destructive/5'
const labelCls = 'block text-xs uppercase tracking-[0.25em] text-gold'

export function QuoteForm() {
  const { t } = useLang()
  const uid = useId()
  const [v, setV] = useState({ name: '', idea: '', size: '', placement: '', references: '', notes: '' })
  const [status, setStatus] = useState<Status>('idle')

  const wa = SITE_CONFIG.whatsappNumber.replace(/\D/g, '')
  const email = SITE_CONFIG.email

  const message = useMemo(() => {
    const lines = [
      t.form.greeting,
      '',
      `${t.form.name}: ${v.name}`,
      `${t.form.idea}: ${v.idea}`,
      v.size && `${t.form.size}: ${v.size}`,
      v.placement && `${t.form.placement}: ${v.placement}`,
      v.references && `${t.form.references}: ${v.references}`,
      v.notes && `${t.form.notes}: ${v.notes}`,
    ].filter((l): l is string => Boolean(l))
    return [lines[0], '', ...lines.slice(1)].join('\n')
  }, [v, t])

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }))
    if (status !== 'idle') setStatus('idle')
  }

  const valid =
    v.name.trim() !== '' &&
    v.idea.trim() !== '' &&
    v.size !== '' &&
    v.placement.trim() !== '' &&
    v.references.trim() !== '' &&
    v.notes.trim() !== ''

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!valid) {
      setStatus('missing')
      return
    }
    if (wa) {
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
      setStatus('opened')
      return
    }
    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(t.nav.quote)}&body=${encodeURIComponent(message)}`
      setStatus('opened')
      return
    }
    try {
      await navigator.clipboard.writeText(message)
      setStatus('copied')
    } catch (err) {
      console.warn('[quote-form] clipboard failed', err)
      setStatus('copyError')
    }
  }

  const id = (k: string) => `${uid}-${k}`

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" data-testid="quote-form">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className={labelCls}>
            {t.form.name}
          </label>
          <input id={id('name')} data-testid="field-name" className={fieldCls} value={v.name} onChange={set('name')} required autoComplete="name" aria-invalid={status === 'missing' && !v.name.trim()} />
        </div>
        <div>
          <label htmlFor={id('size')} className={labelCls}>
            {t.form.size}
          </label>
          <select id={id('size')} className={fieldCls} value={v.size} onChange={set('size')} required aria-invalid={status === 'missing' && !v.size}>
            <option value="">{t.form.choose}</option>
            {t.form.sizeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={id('idea')} className={labelCls}>
          {t.form.idea}
        </label>
        <textarea id={id('idea')} data-testid="field-idea" rows={4} className={fieldCls} value={v.idea} onChange={set('idea')} required aria-describedby={id('idea-h')} aria-invalid={status === 'missing' && !v.idea.trim()} />
        <p id={id('idea-h')} className="mt-1 text-xs text-ivory-dim">{t.form.ideaHint}</p>
      </div>

      <div>
        <label htmlFor={id('placement')} className={labelCls}>{t.form.placement}</label>
        <input id={id('placement')} className={fieldCls} value={v.placement} onChange={set('placement')} required aria-describedby={id('pl-h')} aria-invalid={status === 'missing' && !v.placement.trim()} />
        <p id={id('pl-h')} className="mt-1 text-xs text-ivory-dim">{t.form.placementHint}</p>
      </div>

      <div>
        <label htmlFor={id('refs')} className={labelCls}>{t.form.references}</label>
        <textarea id={id('refs')} rows={2} className={fieldCls} value={v.references} onChange={set('references')} required aria-describedby={id('refs-h')} aria-invalid={status === 'missing' && !v.references.trim()} />
        <p id={id('refs-h')} className="mt-1 text-xs text-ivory-dim">{t.form.referencesHint}</p>
      </div>

      <div>
        <label htmlFor={id('notes')} className={labelCls}>{t.form.notes}</label>
        <textarea id={id('notes')} rows={3} className={fieldCls} value={v.notes} onChange={set('notes')} required aria-describedby={id('notes-h')} aria-invalid={status === 'missing' && !v.notes.trim()} />
        <p id={id('notes-h')} className="mt-1 text-xs text-ivory-dim">{t.form.notesHint}</p>
      </div>

      {!wa && !email ? <p className="border-l-2 border-gold/60 pl-4 text-sm text-ivory-dim">{t.form.notConfigured}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          data-testid="quote-submit"
          className="group inline-flex min-h-12 items-center justify-center gap-3 bg-gold px-8 text-sm font-semibold uppercase tracking-[0.25em] text-ink transition-all hover:bg-ivory hover:tracking-[0.3em]"
        >
          {wa ? t.form.sendWhatsapp : email ? t.form.sendEmail : t.form.copy}
        </button>
        <p className="text-xs text-ivory-dim">
          <span className="text-gold">{t.form.allRequired}</span> {t.form.attachNote}
        </p>
      </div>

      <div role="status" aria-live="polite" data-testid="quote-status" data-state={status}>
        {status === 'missing' ? <p className="text-sm text-destructive">{t.form.missing}</p> : null}
        {status === 'opened' ? <p className="text-sm text-gold">{t.form.opened}</p> : null}
        {status === 'copied' ? <p className="text-sm text-gold">{t.form.copied}</p> : null}
        {status === 'copyError' ? <p className="text-sm text-destructive">{t.form.copyError}</p> : null}
      </div>

      {status === 'copyError' || status === 'copied' ? (
        <div>
          <label htmlFor={id('preview')} className={labelCls}>{t.form.preview}</label>
          <textarea id={id('preview')} readOnly rows={8} className={fieldCls} value={message} onFocus={(e) => e.currentTarget.select()} />
        </div>
      ) : null}
    </form>
  )
}
