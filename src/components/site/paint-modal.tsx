/**
 * Modal de obra: visualização ampliada com zoom.
 */
import { useEffect, useState } from 'react'
import { PaintArtwork } from './paint-svg'
import { PAINT_WORKS, type PaintWorkId } from '../../lib/painting-works'
import { useLang } from '../../lib/i18n'

export function ArtworkModal({ workId, onClose, onEnterRoom }: { workId: PaintWorkId; onClose: () => void; onEnterRoom: () => void }) {
  const { lang } = useLang()
  const [zoomed, setZoomed] = useState(false)
  const work = PAINT_WORKS.find((w) => w.id === workId)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="paint-modal open" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button type="button" className="paint-modal-close" aria-label="Fechar" onClick={onClose}>×</button>
      <div
        className={`paint-modal-stage ${zoomed ? 'zoomed' : ''}`}
        onClick={() => setZoomed((z) => !z)}
      >
        <PaintArtwork work={workId} />
      </div>
      <div className="paint-modal-side">
        <div className="paint-kicker">{work.series[lang]}</div>
        <h2>{work.title[lang]}</h2>
        <div className="paint-kicker">{work.year}</div>
        <p>{work.desc[lang]}</p>
        <div className="paint-modal-controls">
          <button type="button" onClick={() => setZoomed((z) => !z)}>
            {zoomed ? 'Afastar −' : 'Aproximar +'}
          </button>
          <button type="button" onClick={() => setZoomed(false)}>Ver obra inteira</button>
          <button type="button" onClick={onEnterRoom}>Entrar na obra ↗</button>
        </div>
      </div>
    </div>
  )
}
