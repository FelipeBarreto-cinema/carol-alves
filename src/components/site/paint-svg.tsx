/**
 * Desenhos vetoriais autorais das pinturas (mesmos paths do protÃ³tipo original).
 * Cada obra Ã© um componente â€” a pÃ¡gina pode clonar o mesmo desenho em mÃºltiplos contextos
 * (thumb, modal, sala imersiva, viagem) sem duplicar markup.
 */
import type { PaintWorkId } from '../../lib/painting-works'

function PaintingRoot({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 500 620" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" data-work={id}>
      {children}
    </svg>
  )
}

const SHARED_DEFS = (
  <defs>
    <linearGradient id="paint-bg" x2="1" y2="1">
      <stop stopColor="#101110" />
      <stop offset=".5" stopColor="#28231e" />
      <stop offset="1" stopColor="#080a0a" />
    </linearGradient>
    <filter id="paint-texture">
      <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="11" />
      <feDisplacementMap in="SourceGraphic" scale="13" />
    </filter>
  </defs>
)

export function PaintArtwork({ work }: { work: PaintWorkId }) {
  switch (work) {
    case 'materia-em-movimento':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-50 510Q90 350 180 80L260 -30 325 5Q235 210 200 360T60 680Z" fill="#a84820" stroke="#d17b38" strokeWidth="24" />
            <path d="M210 670Q260 450 330 270T490 -30L550 30Q420 250 410 410T360 670Z" fill="#17475f" stroke="#2b7591" strokeWidth="26" />
            <path d="M90 500Q170 350 220 160L300 20 335 45Q280 190 250 330T160 550Z" fill="#e4d5be" stroke="#f4e9d7" strokeWidth="18" />
            <path d="M-10 240Q80 200 155 20" fill="none" stroke="#080909" strokeWidth="40" />
            <path d="M240 620Q290 470 340 380T440 180" fill="none" stroke="#b42d1e" strokeWidth="20" />
            <path d="M40 580Q150 400 210 260" fill="none" stroke="#e6b16b" strokeWidth="12" />
            <path d="M300 620Q360 480 400 370T510 180" fill="none" stroke="#f1e8d8" strokeWidth="10" />
          </g>
          <rect width="500" height="620" fill="#fff" opacity=".05" filter="url(#paint-texture)" />
        </PaintingRoot>
      )
    case 'territorio-intimo':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-40 130L160 -20 270 180 80 360Z" fill="#bb6c2b" />
            <path d="M40 620L180 280 330 40 410 160 260 430 170 650Z" fill="#d8c7aa" stroke="#efe2cd" strokeWidth="20" />
            <path d="M180 620L310 360 500 120 530 240 380 470 300 650Z" fill="#111413" stroke="#050606" strokeWidth="24" />
            <path d="M-20 420Q100 350 210 190T380 10" fill="none" stroke="#9c3e21" strokeWidth="30" />
            <path d="M30 480L140 380 230 260" fill="none" stroke="#e0a44f" strokeWidth="14" />
            <path d="M230 620L310 480 430 340" fill="none" stroke="#245a68" strokeWidth="28" />
          </g>
        </PaintingRoot>
      )
    case 'campo-de-forcas':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-20 170L170 -20 300 130 160 330Z" fill="#a93520" stroke="#d15e2c" strokeWidth="22" />
            <path d="M100 650Q190 420 270 240T440 -30L540 60Q390 300 370 460T250 660Z" fill="#16455f" stroke="#2d7793" strokeWidth="28" />
            <path d="M-20 510Q120 380 200 170L270 60 330 110Q250 260 200 390T50 660Z" fill="#e5d7c1" stroke="#f6e9d6" strokeWidth="22" />
            <path d="M250 620Q320 420 380 290T510 120" fill="none" stroke="#bf792f" strokeWidth="35" />
            <path d="M30 220L160 130 235 50" fill="none" stroke="#0b0c0c" strokeWidth="28" />
            <path d="M260 580L340 430 430 340" fill="none" stroke="#c43c24" strokeWidth="20" />
          </g>
        </PaintingRoot>
      )
    case 'entre-camadas':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-20 90L150 -20 250 160 110 330Z" fill="#d3c3a7" />
            <path d="M60 620L160 400 270 160 330 210 220 450 170 650Z" fill="#bb4b24" stroke="#d77b39" strokeWidth="22" />
            <path d="M220 650L300 400 390 230 520 70 540 180 420 410 350 650Z" fill="#173d51" stroke="#2b6c81" strokeWidth="30" />
            <path d="M-20 380Q90 300 160 180T300 20" fill="none" stroke="#050606" strokeWidth="45" />
            <path d="M120 600Q220 450 260 330T430 120" fill="none" stroke="#e5d7c0" strokeWidth="18" />
          </g>
        </PaintingRoot>
      )
    case 'pausa-mineral':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-20 100L160 -20 250 120 120 300Z" fill="#25251f" />
            <path d="M10 620L120 350 260 120 340 170 210 420 130 650Z" fill="#b55a2c" />
            <path d="M200 650Q250 440 330 260T520 20L540 150Q420 350 390 470T320 650Z" fill="#e8dcc8" stroke="#f6eddf" strokeWidth="25" />
            <path d="M-20 450L130 340 230 230" fill="none" stroke="#19465b" strokeWidth="28" />
          </g>
        </PaintingRoot>
      )
    case 'o-peso-da-luz':
      return (
        <PaintingRoot id={work}>
          {SHARED_DEFS}
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M-40 540Q100 400 190 160T360 -40L430 20Q300 250 270 390T100 660Z" fill="#e4d6c0" stroke="#f4e9d7" strokeWidth="24" />
            <path d="M190 650Q270 420 340 300T520 80L540 220Q410 390 370 510T300 650Z" fill="#a94320" stroke="#ce7135" strokeWidth="28" />
            <path d="M-20 170L130 60 210 140 110 260Z" fill="#174b65" />
            <path d="M260 620Q330 450 410 350T530 220" fill="none" stroke="#245c72" strokeWidth="26" />
            <path d="M20 590L130 450 190 340" fill="none" stroke="#f0e7d8" strokeWidth="13" />
          </g>
        </PaintingRoot>
      )
  }
}
