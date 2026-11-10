/**
 * Obras da página de pintura abstrata (/pintura).
 * Cada obra é um desenho vetorial autoral (veja paint-svg.tsx).
 */
import type { Localized } from './site-content'

export type PaintCategory = 'abstratas' | 'estudos' | 'contrastes'
export type PaintWorkId = 'materia-em-movimento' | 'territorio-intimo' | 'campo-de-forcas' | 'entre-camadas' | 'pausa-mineral' | 'o-peso-da-luz'

export type PaintWork = {
  id: PaintWorkId
  category: PaintCategory
  year: string
  series: Localized
  title: Localized
  desc: Localized
}

export const PAINT_WORKS: PaintWork[] = [
  {
    id: 'materia-em-movimento',
    category: 'abstratas',
    year: '2025',
    series: { pt: 'Série 01', en: 'Series 01', es: 'Serie 01' },
    title: {
      pt: 'Matéria em movimento',
      en: 'Matter in motion',
      es: 'Materia en movimiento',
    },
    desc: {
      pt: 'Camadas de pigmento e gestos intensos exploram a tensão entre controle e acaso. Uma pintura sobre o instante em que a matéria ganha vida.',
      en: 'Layers of pigment and intense gestures explore the tension between control and chance. A painting about the instant matter comes alive.',
      es: 'Capas de pigmento y gestos intensos exploran la tensión entre control y azar. Una pintura sobre el instante en que la materia cobra vida.',
    },
  },
  {
    id: 'territorio-intimo',
    category: 'estudos',
    year: '2024',
    series: { pt: 'Série 02', en: 'Series 02', es: 'Serie 02' },
    title: {
      pt: 'Território íntimo',
      en: 'Intimate territory',
      es: 'Territorio íntimo',
    },
    desc: {
      pt: 'Um estudo de ritmos terrosos, intervalos escuros e pequenos pontos de luz. A superfície guarda marcas do gesto e do tempo.',
      en: 'A study of earthy rhythms, dark intervals and small points of light. The surface keeps marks of gesture and time.',
      es: 'Un estudio de ritmos terrosos, intervalos oscuros y pequeños puntos de luz. La superficie guarda marcas del gesto y del tiempo.',
    },
  },
  {
    id: 'campo-de-forcas',
    category: 'contrastes',
    year: '2025',
    series: { pt: 'Série 03', en: 'Series 03', es: 'Serie 03' },
    title: {
      pt: 'Campo de forças',
      en: 'Field of forces',
      es: 'Campo de fuerzas',
    },
    desc: {
      pt: 'Azul profundo e vermelho queimado se encontram em uma composição de tensão e equilíbrio. O olhar percorre a pintura como quem atravessa uma paisagem.',
      en: 'Deep blue and burnt red meet in a composition of tension and balance. The eye crosses the painting like walking through a landscape.',
      es: 'Azul profundo y rojo quemado se encuentran en una composición de tensión y equilibrio. La mirada recorre la pintura como quien atraviesa un paisaje.',
    },
  },
  {
    id: 'entre-camadas',
    category: 'abstratas',
    year: '2024',
    series: { pt: 'Série 04', en: 'Series 04', es: 'Serie 04' },
    title: {
      pt: 'Entre camadas',
      en: 'Between layers',
      es: 'Entre capas',
    },
    desc: {
      pt: 'Uma composição construída por sobreposições, raspagens e transparências. Cada marca revela algo e esconde outra coisa.',
      en: 'A composition built from overlaps, scrapings and transparencies. Each mark reveals something and hides something else.',
      es: 'Una composición construida por superposiciones, raspados y transparencias. Cada marca revela algo y esconde otra cosa.',
    },
  },
  {
    id: 'pausa-mineral',
    category: 'estudos',
    year: '2023',
    series: { pt: 'Estudo 05', en: 'Study 05', es: 'Estudio 05' },
    title: {
      pt: 'Pausa mineral',
      en: 'Mineral pause',
      es: 'Pausa mineral',
    },
    desc: {
      pt: 'Um estudo de matéria e silêncio, com pigmentos minerais e áreas de respiro. A textura muda conforme a luz e a distância.',
      en: 'A study of matter and silence, with mineral pigments and breathing areas. The texture changes with light and distance.',
      es: 'Un estudio de materia y silencio, con pigmentos minerales y zonas de respiro. La textura cambia según la luz y la distancia.',
    },
  },
  {
    id: 'o-peso-da-luz',
    category: 'contrastes',
    year: '2025',
    series: { pt: 'Série 06', en: 'Series 06', es: 'Serie 06' },
    title: {
      pt: 'O peso da luz',
      en: 'The weight of light',
      es: 'El peso de la luz',
    },
    desc: {
      pt: 'Uma pesquisa sobre luz e densidade. O branco não é vazio: ele carrega as marcas daquilo que foi retirado.',
      en: 'A study on light and density. White is not emptiness: it carries the marks of what was removed.',
      es: 'Una investigación sobre luz y densidad. El blanco no es vacío: lleva las marcas de lo que fue retirado.',
    },
  },
]
