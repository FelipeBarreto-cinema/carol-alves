import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { FlashMedallion } from './ornament'

/**
 * Portão de revelação: a galeria só é montada quando a seção entra na viewport.
 * Antes disso, exibe a tela de loading personalizada (logo girando + nome).
 */
export function GalleryGate({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Após montar a galeria, revela os [data-reveal] internos:
  // o observer global do shell não viu esses nós nascerem.
  useEffect(() => {
    if (!revealed) return
    const frame = requestAnimationFrame(() => {
      ref.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
    })
    return () => cancelAnimationFrame(frame)
  }, [revealed])

  return (
    <div ref={ref} className="relative">
      {revealed ? (
        <div className="gallery-fade-in">{children}</div>
      ) : (
        <div className="flex min-h-[420px] items-center justify-center border border-gold/15 bg-night-soft/50 sm:min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <FlashMedallion className="w-40 sm:w-48" />
            <span className="font-flash text-sm uppercase tracking-[0.35em] text-gold">Carol Alves</span>
          </div>
        </div>
      )}
    </div>
  )
}
