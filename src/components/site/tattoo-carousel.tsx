import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '../../lib/i18n'
import { FlashMedallion } from './ornament'
import type { Artwork } from '../../lib/site-content'

/**
 * Carrossel de tatuagens.
 * As imagens são lidas automaticamente da pasta img/tattoo via import.meta.glob
 * do Vite: adicionar ou remover arquivos ali atualiza o carrossel no build,
 * sem precisar editar este arquivo.
 */
const tattooFiles = import.meta.glob<{ default: string }>('../../../img/tattoo/*.{jpeg,jpg,png,webp}', {
  eager: true,
})

const TATTOO_IMAGES: Artwork[] = Object.entries(tattooFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, mod]) => {
    const name = path.split('/').pop() ?? 'tatuagem'
    return {
      src: mod.default,
      width: 1200,
      height: 1600,
      alt: { pt: `Tatuagem do arquivo ${name}`, en: `Tattoo from file ${name}`, es: `Tatuaje del archivo ${name}` },
      title: undefined,
    }
  })
export function TattooCarousel({ emptyTitle, emptyText }: { emptyTitle: string; emptyText: string }) {
  const { t } = useLang()
  const [page, setPage] = useState(0)
  const perView = 3
  const pages = Math.max(1, Math.ceil(TATTOO_IMAGES.length / perView))
  const clampedPage = Math.min(page, pages - 1)

  if (TATTOO_IMAGES.length === 0) {
    return (
      <div className="relative border border-gold/25 bg-night-soft/80 px-6 py-14 text-center" data-reveal>
        <p className="font-display text-2xl italic text-ivory">{emptyTitle}</p>
               <p className="mt-2 text-sm text-ivory-dim">{emptyText}</p>
      </div>
    )
  }


  const goTo = (dir: number) => {
    setPage((p) => {
      const next = p + dir
      if (next < 0 || next >= pages) return p
            return next
    })
  }

  return (
    <div data-testid="tattoo-carousel" className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${clampedPage * 100}%)` }}
        >
                    {TATTOO_IMAGES.map((img, i) => (
            <div key={img.src} className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5">
              <CarouselSlide item={img} openLabel={t.lightbox.open} />
            </div>
          ))}
      </div>
      </div>
            <CarouselNav
        pages={pages}
        current={clampedPage}
        onPrev={() => goTo(-1)}
        onNext={() => goTo(1)}
        prevLabel={t.lightbox.prev}
        nextLabel={t.lightbox.next}
      />
    </div>
  )
}

function CarouselSlide({ item, openLabel }: { item: Artwork; openLabel: string }) {
  const [loaded, setLoaded] = useState(false)
  const [elapsed, setElapsed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  useEffect(() => {
    // SSR/cache: se a imagem já terminou antes da hidratação, o onLoad nunca dispara
    if (imgRef.current?.complete) setLoaded(true)
    const timer = setTimeout(() => setElapsed(true), 500)
    return () => clearTimeout(timer)
  }, [])
  const shown = loaded && elapsed
  return (
    <div
      className="art-frame relative block w-full overflow-hidden border border-gold/20 bg-ink aspect-[3/4]"
    >
      <div
        aria-hidden="true"
                className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink transition-opacity duration-500 ${shown ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        <FlashMedallion className="w-1/2 drop-shadow-[0_10px_30px_hsl(var(--ink))]" />
        <span className="font-flash text-sm tracking-[0.35em] text-gold uppercase">Carol Alves</span>
      </div>
      <img
        ref={imgRef}
        src={item.src}
        alt={item.alt.pt}
        width={item.width}
        height={item.height}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
                  <span className="sr-only">{openLabel}</span>
    </div>
  )
}

function CarouselNav({ pages, current, onPrev, onNext, prevLabel, nextLabel }: { pages: number; current: number; onPrev: () => void; onNext: () => void; prevLabel: string; nextLabel: string }) {
  if (pages <= 1) return null
  return (
    <div className="mt-8 flex items-center justify-center gap-6">
      <button type="button" onClick={onPrev} aria-label={prevLabel} className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory hover:border-gold hover:bg-gold hover:text-ink">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-xs uppercase tracking-[0.3em] text-ivory-dim" aria-live="polite">
        {String(current + 1).padStart(2, '0')} / {String(pages).padStart(2, '0')}
      </span>
      <button type="button" onClick={onNext} aria-label={nextLabel} className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory hover:border-gold hover:bg-gold hover:text-ink">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}





 