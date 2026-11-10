/**
 * Viagem por dentro da pintura: faixas de pigmento em profundidade.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { PAINT_WORKS, type PaintWorkId } from '../../lib/painting-works'

const PALETTES: [string, string, string][] = [
  ['#b84422', '#e78d43', '#f0d6b0'],
  ['#123e59', '#3180a0', '#e2d3bd'],
  ['#191a19', '#c94a2a', '#d8c5a5'],
  ['#d5c6ae', '#9e4a2c', '#24566b'],
  ['#1d1e1a', '#a86d37', '#e2d1b5'],
  ['#8e321f', '#e0b36e', '#285a70'],
]

type Ribbon = {
  w: number; h: number; x: number; y: number; z: number; rot: number; o: number; blur: number; dur: number
  c: [string, string, string]
}

type Stroke = {
  sw: number; sh: number; sx: number; sy: number; sz: number; sr: number; sc: string; sb: number; sd: number
}

export function PaintingJourney({ workId, onClose }: { workId: PaintWorkId; onClose: () => void }) {
  const [started, setStarted] = useState(false)
  const depthRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })

  const idx = Math.max(0, PAINT_WORKS.findIndex((w) => w.id === workId))
  const palette = PALETTES[idx % PALETTES.length]

  const ribbons = useMemo<Ribbon[]>(() => {
    return Array.from({ length: 38 }, (_, i) => ({
      w: 38 + ((i * 37) % 85),
      h: 8 + ((i * 17) % 35),
      x: ((i * 97) % 180) - 90,
      y: ((i * 53) % 150) - 75,
      z: -1000 + i * 42,
      rot: ((i * 37) % 150) - 75,
      o: 0.28 + (i % 6) * 0.1,
      blur: i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : 0,
      dur: 7 + (i % 9),
      c: [palette[i % 3], palette[(i + 1) % 3], palette[(i + 2) % 3]],
    }))
  }, [palette])

  const strokes = useMemo<Stroke[]>(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      sw: 25 + ((i * 23) % 80),
      sh: 1 + (i % 4) * 0.8,
      sx: ((i * 73) % 160) - 80,
      sy: ((i * 43) % 130) - 65,
      sz: -700 + i * 58,
      sr: ((i * 29) % 160) - 80,
      sc: palette[(i + 1) % 3],
      sb: i % 3,
      sd: 4 + (i % 7),
    }))
  }, [palette])

  const work = PAINT_WORKS[idx]

  function applyTransform() {
    const p = progressRef.current
    const px = pointerRef.current.x
    const py = pointerRef.current.y
    const depth = depthRef.current
    if (!depth) return
    depth.style.transform = `translate3d(${px * -120}px, ${py * -100}px, ${p * 1900}px) scale(${1 + p * 0.45}) rotateZ(${px * 8}deg)`
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (!started) {
        if (['ArrowUp', 'ArrowRight', 'w', 'W', 'd', 'D', ' '].includes(e.key)) {
          e.preventDefault()
          setStarted(true)
        }
        return
      }
      if (['ArrowUp', 'ArrowRight', 'w', 'W', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault()
        progressRef.current = Math.min(1, progressRef.current + 0.12)
        applyTransform()
      }
      if (['ArrowDown', 'ArrowLeft', 'a', 'A', 's', 'S'].includes(e.key)) {
        e.preventDefault()
        progressRef.current = Math.max(0, progressRef.current - 0.06)
        applyTransform()
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
    const onMove = (e: MouseEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
      if (started) applyTransform()
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [started])

  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      if (!started) return
      pointerRef.current = {
        x: (e.touches[0].clientX / window.innerWidth - 0.5) * 2,
        y: (e.touches[0].clientY / window.innerHeight - 0.5) * 2,
      }
      progressRef.current = Math.min(1, progressRef.current + 0.015)
      applyTransform()
    }
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => window.removeEventListener('touchmove', onTouch)
  }, [started])


  return (
    <div className="paint-journey open">
      <div
        className="paint-journey-canvas"
        onClick={(e) => {
          if (!started) { setStarted(true); return }
          if (e.target instanceof Element && e.target.closest('.paint-journey-ribbon')) return
          progressRef.current = Math.min(1, progressRef.current + 0.12)
          applyTransform()
        }}
      >
        <div className="paint-journey-scene">
          <div className="paint-journey-depth" ref={depthRef}>
            {ribbons.map((r, i) => (
              <div
                key={i}
                className="paint-journey-ribbon"
                style={{
                  width: `${r.w}vw`,
                  height: `${r.h}vh`,
                  transform: `translate3d(${r.x}vw, ${r.y}vh, ${r.z}px) rotate(${r.rot}deg)`,
                  opacity: r.o,
                  filter: `blur(${r.blur}px)`,
                  background: `linear-gradient(120deg, ${r.c[0]}, ${r.c[1]} 44%, ${r.c[2]})`,
                  animationDuration: `${r.dur}s`,
                  animationDelay: `${-i * 0.47}s`,
                } as React.CSSProperties}
              />
            ))}
            {strokes.map((s, i) => (
              <div
                key={i}
                className="paint-journey-stroke"
                style={{
                  width: `${s.sw}vw`,
                  height: `${s.sh}vh`,
                  transform: `translate3d(${s.sx}vw, ${s.sy}vh, ${s.sz}px) rotate(${s.sr}deg)`,
                  background: `linear-gradient(90deg, transparent, ${s.sc}, rgba(255,255,255,.55), ${s.sc}, transparent)`,
                  filter: `blur(${s.sb}px)`,
                  animationDuration: `${s.sd}s`,
                  animationDelay: `${-i * 0.38}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        <div className="paint-journey-grain" />
      </div>

      <div className="paint-journey-ui">
        <div className="paint-journey-top">
          <span>CAROL ALVES · DENTRO DA PINTURA</span>
          <button type="button" onClick={onClose}>Voltar à galeria ×</button>
        </div>
        <div className="paint-journey-copy">
          <div className="paint-kicker">{work.title.pt.toUpperCase()} · {work.year}</div>
          <h2>Flutuar por {work.title.pt.toLowerCase()}.</h2>
          <p>{work.desc.pt} Aqui, a pintura deixa de ser uma superfície distante e se transforma em um campo de cor para atravessar.</p>
        </div>
        <div className="paint-journey-instructions">
          MOVA O MOUSE PARA DESLIZAR ENTRE AS CORES<br />
          CLIQUE OU USE AS SETAS PARA AVANÇAR<br />
          ESC PARA VOLTAR À GALERIA
        </div>
      </div>
      {!started && (
        <div className="paint-journey-start">
          <div className="paint-journey-start-inner">
            <div className="paint-kicker">Uma passagem para dentro da matéria</div>
            <h2>Não olhe a pintura.<br /><em>Habite-a.</em></h2>
            <p>A moldura desaparece. As cores ganham escala, as pinceladas se tornam paisagem e você começa a flutuar entre elas.</p>
            <button type="button" className="paint-journey-action" onClick={() => setStarted(true)}>
              Atravessar a superfície ↗
            </button>
            <div className="paint-journey-exit-note">Experiência visual interativa · Somente movimento e imagem</div>
          </div>
        </div>
      )}
    </div>
  )
}
