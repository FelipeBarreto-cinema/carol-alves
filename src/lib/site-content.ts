/**
 * CONTEÚDO REAL DO SITE: edite este arquivo.
 *
 * Nada aqui é inventado: campos vazios simplesmente não aparecem no site.
 * Preencha com os dados reais da Carol Alves.
 */

export type Lang = 'pt' | 'en' | 'es'
export type Localized = Record<Lang, string>

export const SITE_CONFIG = {
  artistName: 'Carol Alves',

  /**
   * WHATSAPP (obrigatório para enviar o pedido de orçamento direto pelo WhatsApp).
   * Formato internacional, somente dígitos. Ex.: '5511999999999'
   * Enquanto estiver vazio, o formulário oferece "copiar mensagem".
   */
  whatsappNumber: '5521999031987',

  /** E-mail de contato (opcional). Ex.: 'contato@exemplo.com' */
  email: '',

  /** Perfil do Instagram (opcional). Ex.: 'https://instagram.com/usuario' */
  instagramUrl: 'https://www.instagram.com/c.alvestattoo/',

  /** Cidade / estúdio (opcional). Ex.: 'São Paulo, SP' */
  location: 'Arraial do Cabo · Macaé · Búzios',
}

export type Artwork = {
  /** URL da imagem (envie em Assets e cole a URL aqui) */
  src: string
  /** Dimensões reais em pixels, evitam saltos de layout */
  width: number
  height: number
  /** Descrição acessível da imagem */
  alt: Localized
  title?: Localized
  /** Ex.: 'Óleo sobre tela, 60 × 80 cm' */
  details?: Localized
  year?: string
}

/** Fotos do projeto ficam em /img na raiz; importar garante hash + otimização no build. */
import carolPortrait from '../../img/carol-alves.jpeg'
import pintura1 from '../../img/pintura-1.jpeg'
import pintura2 from '../../img/pintura-2.jpeg'
import pintura3 from '../../img/pintura-3.jpeg'

/**
 * TATUAGENS: adicione aqui as fotos reais de trabalhos da artista.
 * Exemplo:
 * {
 *   src: 'https://.../andorinha.jpg', width: 1200, height: 1500,
 *   alt: { pt: 'Andorinha tradicional no antebraço', en: 'Traditional swallow on forearm', es: 'Golondrina tradicional en el antebrazo' },
 *   title: { pt: 'Andorinha', en: 'Swallow', es: 'Golondrina' },
 * }
 */
export const TATTOOS: Artwork[] = []

/** PINTURAS E OBRAS: mesma estrutura das tatuagens. */
export const PAINTINGS: Artwork[] = [
  {
    src: pintura1,
    width: 1200,
    height: 1600,
    alt: {
      pt: 'Pintura autoral de Carol Alves sobre tela',
      en: 'Original painting by Carol Alves on canvas',
      es: 'Pintura autoral de Carol Alves sobre lienzo',
    },
    title: {
      pt: 'Pintura I',
      en: 'Painting I',
      es: 'Pintura I',
    },
  },
  {
    src: pintura2,
    width: 739,
    height: 1600,
    alt: {
      pt: 'Pintura autoral de Carol Alves sobre tela',
      en: 'Original painting by Carol Alves on canvas',
      es: 'Pintura autoral de Carol Alves sobre lienzo',
    },
    title: {
      pt: 'Pintura II',
      en: 'Painting II',
      es: 'Pintura II',
    },
  },
  {
    src: pintura3,
    width: 1200,
    height: 1600,
    alt: {
      pt: 'Pintura autoral de Carol Alves sobre tela',
      en: 'Original painting by Carol Alves on canvas',
      es: 'Pintura autoral de Carol Alves sobre lienzo',
    },
    title: {
      pt: 'Pintura III',
      en: 'Painting III',
      es: 'Pintura III',
    },
  },
]

/** Retrato da artista. Foto real em /img na raiz do projeto. */
export const ARTIST_PORTRAIT: Artwork = {
  src: carolPortrait,
  width: 3024,
  height: 4032,
  alt: {
    pt: 'Retrato de Carol Alves, tatuadora e artista plástica',
    en: 'Portrait of Carol Alves, tattoo artist and visual artist',
    es: 'Retrato de Carol Alves, tatuadora y artista plástica',
  },
}

/** Imagem do hero (opcional): uma obra ou foto real da artista. */
export const HERO_IMAGE: Artwork | null = null

