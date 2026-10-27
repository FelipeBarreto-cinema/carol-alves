import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLang } from '../../lib/i18n'
import type { Artwork } from '../../lib/site-content'

/** Lightbox do site (diálogo modal de ampliação). */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: Artwork[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const { t, lang } = useLang()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) d.close()
  }, [index])

  const go = useCallback(
    (dir: number) => {
      if (index === null) return
      onIndex((index + dir + items.length) % items.length)
    },
    [index, items.length, onIndex],
  )

  const item = index !== null ? items[index] : null

  return (
    <dialog
      ref={ref}
      className="lightbox m-auto max-h-[100dvh] max-w-[100vw] overflow-hidden bg-transparent p-0 text-ivory"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-label={item?.title?.[lang] ?? item?.alt[lang]}
    >
      {item ? (
        <figure className="flex max-h-[100dvh] flex-col items-center justify-center gap-3 p-4 md:p-8">
          <img
            src={item.src}
            alt={item.alt[lang]}
            width={item.width}
            height={item.height}
            className="max-h-[min(78dvh,100%)] w-auto max-w-full flex-1 object-contain"
          />
          <figcaption className="flex w-full max-w-3xl flex-none flex-wrap items-center justify-between gap-4 text-sm">
            <span>
              {item.title ? <span className="font-display text-lg italic">{item.title[lang]}</span> : null}
              {item.details ? <span className="ml-3 text-ivory-dim">{item.details[lang]}</span> : null}
              {item.year ? <span className="ml-3 text-ivory-dim">{item.year}</span> : null}
            </span>
            <span className="text-ivory-dim">
              {index! + 1} {t.lightbox.of} {items.length}
            </span>
          </figcaption>
        </figure>
      ) : null}
      <div className="fixed right-4 top-4 flex gap-2">
        {items.length > 1 ? (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t.lightbox.prev} className="flex h-11 w-11 items-center justify-center border border-gold/40 bg-night/80 hover:bg-gold hover:text-ink">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t.lightbox.next} className="flex h-11 w-11 items-center justify-center border border-gold/40 bg-night/80 hover:bg-gold hover:text-ink">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
        <button type="button" onClick={onClose} aria-label={t.lightbox.close} className="flex h-11 w-11 items-center justify-center border border-gold/40 bg-night/80 hover:bg-gold hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>
    </dialog>
  )
}

function EmptyState({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="relative grid gap-4 sm:grid-cols-3" data-reveal>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`relative border border-gold/20 ${i === 1 ? 'aspect-[3/4] sm:translate-y-10' : 'aspect-[4/5]'} hidden sm:block`}
        >
          <div className="absolute inset-3 border border-dashed border-gold/15" />
        </div>
      ))}
      <div className="flex flex-col items-center justify-center gap-3 border border-gold/25 bg-night-soft/80 px-6 py-14 text-center sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[min(28rem,90%)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:backdrop-blur">
        <p className="font-display text-2xl italic text-ivory">{title}</p>
        <p className="text-sm text-ivory-dim">{text}</p>
        {children}
      </div>
    </div>
  )
}

/** Galeria em mosaico (tatuagens). */
export function MasonryGallery({
  items,
  emptyTitle,
  emptyText,
  emptyExtra,
}: {
  items: Artwork[]
  emptyTitle: string
  emptyText: string
  emptyExtra?: React.ReactNode
}) {
  const { t, lang } = useLang()
  const [active, setActive] = useState<number | null>(null)

  if (items.length === 0) return <EmptyState title={emptyTitle} text={emptyText}>{emptyExtra}</EmptyState>

  return (
    <>
      <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <li key={item.src} className="mb-5 break-inside-avoid" data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 90}ms` }}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="art-frame group relative block w-full overflow-hidden border border-gold/20 text-left"
            >
              <img
                src={item.src}
                alt={item.alt[lang]}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
              <span className="sr-only">{t.lightbox.open}</span>
              {item.title ? (
                <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-3 font-display italic text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.title[lang]}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={active} onClose={() => setActive(null)} onIndex={setActive} />
    </>
  )
}

/** Apresentação editorial (pinturas): obras grandes alternadas com legendas. */
export function EditorialGallery({ items, emptyTitle, emptyText }: { items: Artwork[]; emptyTitle: string; emptyText: string }) {
  const { t, lang } = useLang()
  const [active, setActive] = useState<number | null>(null)

  if (items.length === 0) return <EmptyState title={emptyTitle} text={emptyText} />

  return (
    <>
      <ol className="space-y-24 md:space-y-36">
        {items.map((item, i) => (
          <li
            key={item.src}
            data-reveal
            className={`grid items-end gap-6 md:grid-cols-12 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`art-frame relative block overflow-hidden bg-ink p-3 shadow-2xl shadow-ink md:p-5 ${i % 2 ? 'md:col-span-7 md:col-start-6' : 'md:col-span-7'}`}
            >
              <img
                src={item.src}
                alt={item.alt[lang]}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
              <span className="sr-only">{t.lightbox.open}</span>
            </button>
            <div className={`md:col-span-4 ${i % 2 ? 'md:col-start-1 md:text-right' : 'md:col-start-9'}`}>
              <p className="font-display text-sm italic text-gold">Nº {String(i + 1).padStart(2, '0')}</p>
              {item.title ? <h3 className="mt-2 font-display text-3xl italic text-ivory">{item.title[lang]}</h3> : null}
              {item.details ? <p className="mt-2 text-sm text-ivory-dim">{item.details[lang]}</p> : null}
              {item.year ? <p className="mt-1 text-sm text-ivory-dim">{item.year}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <Lightbox items={items} index={active} onClose={() => setActive(null)} onIndex={setActive} />
    </>
  )
}
