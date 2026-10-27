import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Crosshair, RotateCcw, ImageUp } from 'lucide-react'
import { useLang } from '../../lib/i18n'

type Transform = { x: number; y: number; scale: number; rotation: number; opacity: number }
const DEFAULT: Transform = { x: 0.5, y: 0.5, scale: 0.35, rotation: 0, opacity: 0.85 }
const MAX_W = 1600

/** Marca d'água aplicada apenas na imagem exportada. */
const WATERMARK_TEXT = '@C.ALVESTATTOO'

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fontSize = Math.max(14, Math.round(w / 32))
  const margin = Math.round(fontSize * 0.9)
  ctx.save()
  // Figtree é a fonte sem serifa do site; caixa alta, 50% de opacidade.
  ctx.font = `600 ${fontSize}px "Figtree", "Segoe UI", Arial, sans-serif`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'
  ctx.globalAlpha = 0.5
  const x = w - margin
  const y = h - margin
  ctx.lineWidth = Math.max(1, fontSize / 14)
  ctx.strokeStyle = 'rgba(12, 10, 24, 0.3)'
  ctx.strokeText(WATERMARK_TEXT, x, y)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = fontSize / 6
  ctx.fillStyle = cssColor('--gold')
  ctx.fillText(WATERMARK_TEXT, x, y)
  ctx.restore()
}

function cssColor(name: string, alpha = 1) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return `hsl(${v} / ${alpha})`
}

function loadFile(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('invalid image'))
    }
    img.src = url
  })
}

export function TattooSimulator() {
  const { t } = useLang()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [art, setArt] = useState<HTMLImageElement | null>(null)
  const urls = useRef<{ photo?: string; art?: string }>({})
  const [tf, setTf] = useState<Transform>(DEFAULT)
  const [blend, setBlend] = useState(true)
  const [error, setError] = useState('')
  const [exported, setExported] = useState(false)
  const drag = useRef<{ dx: number; dy: number; id: number } | null>(null)

  useEffect(() => () => {
    if (urls.current.photo) URL.revokeObjectURL(urls.current.photo)
    if (urls.current.art) URL.revokeObjectURL(urls.current.art)
  }, [])

  const size = photo
    ? { w: Math.min(photo.naturalWidth, MAX_W), h: Math.round((Math.min(photo.naturalWidth, MAX_W) / photo.naturalWidth) * photo.naturalHeight) }
    : { w: 1000, h: 1250 }

  const draw = useCallback(
    (guides: boolean) => {
      const c = canvasRef.current
      if (!c) return
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, c.width, c.height)
      if (photo) {
        ctx.drawImage(photo, 0, 0, c.width, c.height)
      } else {
        ctx.fillStyle = cssColor('--ink')
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.strokeStyle = cssColor('--gold', 0.35)
        ctx.setLineDash([8, 10])
        ctx.lineWidth = 2
        ctx.strokeRect(40, 40, c.width - 80, c.height - 80)
        ctx.setLineDash([])
        ctx.fillStyle = cssColor('--ivory-dim')
        ctx.font = 'italic 38px "Bodoni Moda", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText(t.sim.noPhoto, c.width / 2, c.height / 2, c.width - 120)
      }
      if (art) {
        const w = tf.scale * c.width
        const h = (w * art.naturalHeight) / art.naturalWidth
        ctx.save()
        ctx.translate(tf.x * c.width, tf.y * c.height)
        ctx.rotate((tf.rotation * Math.PI) / 180)
        ctx.globalAlpha = tf.opacity
        ctx.globalCompositeOperation = blend && photo ? 'multiply' : 'source-over'
        ctx.drawImage(art, -w / 2, -h / 2, w, h)
        ctx.restore()
        if (guides) {
          ctx.save()
          ctx.translate(tf.x * c.width, tf.y * c.height)
          ctx.rotate((tf.rotation * Math.PI) / 180)
          ctx.strokeStyle = cssColor('--gold', 0.9)
          ctx.lineWidth = Math.max(2, c.width / 600)
          ctx.setLineDash([10, 8])
          ctx.strokeRect(-w / 2, -h / 2, w, h)
          ctx.restore()
        }
      }
    },
    [photo, art, tf, blend, t.sim.noPhoto],
  )

  useEffect(() => {
    draw(true)
  }, [draw, size.w, size.h])

  const pick = (kind: 'photo' | 'art') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError(t.sim.invalid)
      return
    }
    try {
      const { img, url } = await loadFile(file)
      const old = urls.current[kind]
      if (old) URL.revokeObjectURL(old)
      urls.current[kind] = url
      setError('')
      setExported(false)
      if (kind === 'photo') setPhoto(img)
      else {
        setArt(img)
        setTf(DEFAULT)
      }
    } catch (err) {
      console.warn('[simulator] failed to load image', err)
      setError(t.sim.invalid)
    }
  }

  const toCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!art) return
    const p = toCanvas(e)
    drag.current = { dx: p.x - tf.x, dy: p.y - tf.y, id: e.pointerId }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return
    const p = toCanvas(e)
    const d = drag.current
    setTf((s) => ({ ...s, x: clamp(p.x - d.dx, 0, 1), y: clamp(p.y - d.dy, 0, 1) }))
  }
  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!art) return
    const step = e.shiftKey ? 0.05 : 0.01
    const map: Record<string, (s: Transform) => Transform> = {
      ArrowLeft: (s) => ({ ...s, x: clamp(s.x - step, 0, 1) }),
      ArrowRight: (s) => ({ ...s, x: clamp(s.x + step, 0, 1) }),
      ArrowUp: (s) => ({ ...s, y: clamp(s.y - step, 0, 1) }),
      ArrowDown: (s) => ({ ...s, y: clamp(s.y + step, 0, 1) }),
      '+': (s) => ({ ...s, scale: clamp(s.scale + 0.02, 0.05, 1.5) }),
      '=': (s) => ({ ...s, scale: clamp(s.scale + 0.02, 0.05, 1.5) }),
      '-': (s) => ({ ...s, scale: clamp(s.scale - 0.02, 0.05, 1.5) }),
      '[': (s) => ({ ...s, rotation: wrap(s.rotation - (e.shiftKey ? 15 : 2)) }),
      ']': (s) => ({ ...s, rotation: wrap(s.rotation + (e.shiftKey ? 15 : 2)) }),
    }
    const fn = map[e.key]
    if (fn) {
      e.preventDefault()
      setTf(fn)
    }
  }

  const exportPng = () => {
    const c = canvasRef.current
    if (!c || !photo) return
    draw(false)
    const ctx = c.getContext('2d')
    if (ctx) drawWatermark(ctx, c.width, c.height)
    c.toBlob((blob) => {
      draw(true)
      if (!blob) {
        console.warn('[simulator] export failed')
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'simulacao-tatuagem-carol-alves.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      setExported(true)
    }, 'image/png')
  }

  const btn =
    'inline-flex min-h-11 items-center justify-center gap-2 border border-gold/40 px-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ivory'

  const slider = (key: 'scale' | 'rotation' | 'opacity', label: string, min: number, max: number, step: number, fmt: (n: number) => string) => (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={`sim-${key}`} className="text-xs uppercase tracking-[0.25em] text-gold">
          {label}
        </label>
        <output htmlFor={`sim-${key}`} className="font-display text-sm italic text-ivory-dim">
          {fmt(tf[key])}
        </output>
      </div>
      <input
        id={`sim-${key}`}
        data-testid={`sim-${key}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={tf[key]}
        disabled={!art}
        onChange={(e) => setTf((s) => ({ ...s, [key]: Number(e.target.value) }))}
        className="range-gold mt-2 w-full"
      />
    </div>
  )

  return (
    <section aria-labelledby="sim-title" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]" data-testid="simulator" data-state={photo ? 'ready' : 'empty'}>
      <div className="min-w-0">
        <h2 id="sim-title" className="sr-only">{t.sim.title}</h2>
        <div className="border border-gold/25 bg-ink p-2 md:p-3">
          <canvas
            ref={canvasRef}
            width={size.w}
            height={size.h}
            tabIndex={0}
            role="img"
            aria-label={t.sim.canvasLabel}
            data-testid="sim-canvas"
            className={`mx-auto block h-auto max-h-[75vh] w-auto max-w-full touch-none ${art ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          />
        </div>
        <p className="mt-3 text-xs text-ivory-dim">{t.sim.keyboard}</p>
      </div>

      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{t.sim.step1}</p>
          <label className={`${btn} w-full cursor-pointer focus-within:outline-2 focus-within:outline-gold`}>
            <ImageUp className="h-4 w-4" aria-hidden="true" />
            {photo ? t.sim.changePhoto : t.sim.choosePhoto}
            <input type="file" accept="image/*" className="sr-only" onChange={pick('photo')} data-testid="sim-photo-input" />
          </label>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{t.sim.step2}</p>
          <label className={`${btn} w-full cursor-pointer focus-within:outline-2 focus-within:outline-gold`}>
            <ImageUp className="h-4 w-4" aria-hidden="true" />
            {art ? t.sim.changeArt : t.sim.chooseArt}
            <input type="file" accept="image/*" className="sr-only" onChange={pick('art')} data-testid="sim-art-input" />
          </label>
        </div>

        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}

        <div className="space-y-5 border-t border-gold/20 pt-6">
          {slider('scale', t.sim.size, 0.05, 1.5, 0.01, (n) => `${Math.round(n * 100)}%`)}
          {slider('rotation', t.sim.rotation, -180, 180, 1, (n) => `${Math.round(n)}°`)}
          {slider('opacity', t.sim.opacity, 0.1, 1, 0.01, (n) => `${Math.round(n * 100)}%`)}
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ivory">
            <input type="checkbox" checked={blend} onChange={(e) => setBlend(e.target.checked)} className="h-5 w-5 accent-gold" disabled={!art} />
            {t.sim.blend}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className={btn} disabled={!art} onClick={() => setTf((s) => ({ ...s, x: 0.5, y: 0.5 }))}>
            <Crosshair className="h-4 w-4" aria-hidden="true" />
            {t.sim.center}
          </button>
          <button type="button" className={btn} disabled={!art} onClick={() => setTf(DEFAULT)}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t.sim.reset}
          </button>
        </div>

        <button
          type="button"
          data-testid="sim-export"
          disabled={!photo}
          onClick={exportPng}
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-gold px-6 text-sm font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gold"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t.sim.export}
        </button>
        <div role="status" aria-live="polite">
          {exported ? <p className="text-sm text-gold">{t.sim.exported}</p> : null}
        </div>

        <div className="space-y-2 border-l-2 border-oxblood pl-4 text-xs leading-relaxed text-ivory-dim">
          <p>{t.sim.disclaimer}</p>
          <p>{t.sim.privacy}</p>
        </div>
      </div>
    </section>
  )
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}
function wrap(deg: number) {
  return ((((deg + 180) % 360) + 360) % 360) - 180
}
