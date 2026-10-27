/** Ornamentos vetoriais inspirados no flash tradicional (sem imagens externas). */

function starPoints(cx: number, cy: number, outer: number, inner: number, n: number) {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (Math.PI / n) * i - Math.PI / 2
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const RAYS = Array.from({ length: 36 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 36
  const r1 = i % 2 === 0 ? 70 : 95
  const r2 = 150
  return {
    x1: (200 + r1 * Math.cos(a)).toFixed(2),
    y1: (200 + r1 * Math.sin(a)).toFixed(2),
    x2: (200 + r2 * Math.cos(a)).toFixed(2),
    y2: (200 + r2 * Math.sin(a)).toFixed(2),
  }
})

export function FlashMedallion({ className = '', label }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <g className="slow-spin">
        <circle cx="200" cy="200" r="186" fill="none" className="stroke-gold/60" strokeWidth="1" />
        <circle cx="200" cy="200" r="176" fill="none" className="stroke-gold/40" strokeWidth="1" strokeDasharray="2 6" />
        {RAYS.map((r, i) => (
          <line key={i} {...r} className="stroke-gold/50" strokeWidth={i % 2 === 0 ? 1.4 : 0.8} />
        ))}
      </g>
      <polygon points={starPoints(200, 200, 132, 46, 8)} className="fill-night stroke-gold" strokeWidth="2" />
      <polygon points={starPoints(200, 200, 96, 34, 8)} className="fill-gold/90" />
      <circle cx="200" cy="200" r="38" className="fill-ink stroke-gold" strokeWidth="2" />
      <text
        x="200"
        y="214"
        textAnchor="middle"
        className="fill-ivory font-flash"
        style={{ fontSize: 40 }}
      >
        CA
      </text>
      {label ? (
        <g>
          <path
            d="M44 300 L356 300 L338 322 L356 344 L44 344 L62 322 Z"
            className="fill-oxblood stroke-ink"
            strokeWidth="3"
          />
          <path d="M44 300 L62 322 L44 344" fill="none" className="stroke-gold/70" strokeWidth="1" />
          <path d="M356 300 L338 322 L356 344" fill="none" className="stroke-gold/70" strokeWidth="1" />
          <text x="200" y="331" textAnchor="middle" className="fill-ivory font-flash" style={{ fontSize: 26, letterSpacing: 2 }}>
            {label}
          </text>
        </g>
      ) : null}
    </svg>
  )
}

export function Diamond({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M6 0 L12 6 L6 12 L0 6 Z" className="fill-gold" />
    </svg>
  )
}

export function SectionMark({ eyebrow, index }: { eyebrow: string; index: string }) {
  return (
    <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-gold">
      <span className="font-display text-sm italic tracking-normal text-gold/80">{index}</span>
      <span className="h-px w-10 bg-gold/50" />
      <span>{eyebrow}</span>
    </div>
  )
}
