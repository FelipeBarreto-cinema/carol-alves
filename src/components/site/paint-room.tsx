/**
 * Sala de galeria 3D estilizada: entre na obra num espaço virtual.
 */
import { useEffect, useRef, useState } from 'react'
import { PaintArtwork } from './paint-svg'
import { PAINT_WORKS, type PaintWorkId } from '../../lib/painting-works'
import { useLang } from '../../lib/i18n'

type View = { lookX: number; lookY: number; distance: number }

export function ImmersiveRoom({ workId, onClose, onEnterJourney }: { workId: PaintWorkId; onClose: () => void; onEnterJourney: () => void }) {
  const { lang } = useLang()
  const [started, setStarted] = useState(false)
  const [view, setView] = useState<View>({ lookX: 0, lookY: 0, distance: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  const idx = PAINT_WORKS.findIndex((w) => w.id === workId)
  const work = PAINT_WORKS[idx] ?? PAINT_WORKS[0]
  const sideOne = PAINT_WORKS[(idx + 1) % PAINT_WORKS.length]
  const sideTwo = PAINT_WORKS[(idx + 2) % PAINT_WORKS.length]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (!started) return
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault()
        setView((v) => ({ ...v, lookX: Math.min(24, v.lookX + 7) }))
      }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault()
        setView((v) => ({ ...v, lookX: Math.max(-24, v.lookX - 7) }))
      }
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault()
        setView((v) => ({ ...v, distance: Math.min(1, v.distance + 0.18) }))
      }
      if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault()
        setView((v) => ({ ...v, distance: Math.max(0, v.distance - 0.18) }))
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, started])

  useEffect(() => {
    if (!started) return
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      setView((v) => ({ ...v, lookX: nx * -5, lookY: ny * 3 }))
    }
    rootRef.current?.addEventListener('mousemove', onMove)
    return () => rootRef.current?.removeEventListener('mousemove', onMove)
  }, [started])

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (!started) return
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 25) {
        setView((v) => ({ ...v, lookX: Math.max(-24, Math.min(24, v.lookX + (dx < 0 ? -8 : 8))) }))
      }
    }
    const root = rootRef.current
    root?.addEventListener('touchstart', onTouchStart, { passive: true })
    root?.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      root?.removeEventListener('touchstart', onTouchStart)
      root?.removeEventListener('touchend', onTouchEnd)
    }
  }, [started])

  const z = -480 + view.distance * 260
  const sideOpacity = 0.8 - view.distance * 0.45

  return (
    <div className="paint-room open" ref={rootRef}>
      <div className={`paint-room-world ${started ? 'entering' : ''}`}>
        <div
          className="paint-room-shell"
          style={{ '--look-x': `${view.lookX}deg`, '--look-y': `${view.lookY}deg` } as React.CSSProperties}
        >
          <div className="paint-room-ceiling" />
          <div className="paint-room-floor" />
          <div className="paint-room-side left" />
          <div className="paint-room-side right" />
          <div className="paint-room-back" />
          <div className="paint-room-light" />
          <div className="paint-room-art-side one" style={{ opacity: sideOpacity }}>
            <PaintArtwork work={sideOne.id} />
          </div>
          <div className="paint-room-art-side two" style={{ opacity: sideOpacity }}>
            <PaintArtwork work={sideTwo.id} />
          </div>
          <div
            className="paint-room-art-frame"
            style={{ transform: `translate(-50%,-50%) translateZ(${z}px) scale(${1 + view.distance * 0.18})` }}
            onClick={() =>
              started
                ? setView((v) => ({ ...v, distance: v.distance >= 0.9 ? 0 : Math.min(1, v.distance + 0.25) }))
                : setStarted(true)
            }
          >
            <PaintArtwork work={workId} />
          </div>
        </div>
      </div>

      <div className="paint-room-info">
        <div className="paint-kicker">{work.series[lang]} · {work.year}</div>
        <h2>{work.title[lang]}</h2>
        <p>{work.desc[lang]}</p>
        <button type="button" className="paint-room-start-btn" onClick={onEnterJourney}>
          Atravessar a pintura ↗
        </button>
      </div>
      <div className="paint-room-hud">
        <div className="paint-room-top">
          <span>CAROL ALVES / ESPAÇO IMERSIVO</span>
          <button type="button" onClick={onClose}>Sair da obra ×</button>
        </div>
        <div className="paint-room-help">
          MOVA O MOUSE PARA OLHAR AO REDOR<br />
          USE ← → OU A / D PARA CAMINHAR<br />
          CLIQUE NA PINTURA PARA SE APROXIMAR
        </div>
      </div>
      {!started && (
        <div className="paint-room-start-screen">
          <div className="paint-room-start-inner">
            <div className="paint-kicker">Uma experiência de observação</div>
            <h2>Entre na obra.</h2>
            <p>Deixe a galeria para trás e caminhe até a pintura. Olhe ao redor, aproxime-se e descubra a matéria de perto.</p>
            <button type="button" className="paint-room-start-btn" onClick={() => setStarted(true)}>
              Entrar no espaço ↗
            </button>
            <div className="paint-room-controls">
              <button type="button" onClick={() => setStarted(true)} aria-label="Avançar">↑</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
