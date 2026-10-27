import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { canonicalUrl } from '../lib/canonical-url'
import siteMetadata from '../metadata.json'
import { SiteShell } from '../components/site/site-shell'
import { FlashMedallion, Diamond, SectionMark } from '../components/site/ornament'
import { EditorialGallery } from '../components/site/gallery'
import { TattooCarousel } from '../components/site/tattoo-carousel'
import { GalleryGate } from '../components/site/gallery-gate'
import { QuoteForm } from '../components/site/quote-form'
import { useLang } from '../lib/i18n'
import { ARTIST_PORTRAIT, HERO_IMAGE, PAINTINGS, SITE_CONFIG, TATTOOS } from '../lib/site-content'

const homepageMeta = siteMetadata['/']

export const Route = createFileRoute('/')({
  head: () => {
    const canonical = canonicalUrl('/')

    return {
      meta: [
        { title: homepageMeta.title },
        { name: 'description', content: homepageMeta.description },
        { property: 'og:title', content: homepageMeta.title },
        { property: 'og:description', content: homepageMeta.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'pt_BR' },
        { property: 'og:locale:alternate', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'es_ES' },
        { name: 'theme-color', content: '#15131e' },
      ],
      links: canonical ? [{ rel: 'canonical', href: canonical }] : [],
    }
  },
  component: App,
})

function App() {
  return (
    <SiteShell>
      <Hero />
      <Artist />
      <Tattoos />
      <Paintings />
      <Vision />
      <Contact />
    </SiteShell>
  )
}

function Hero() {
  const { t, lang } = useLang()
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20">
      {/* fundo: halo dourado + vinheta */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-parallax="0.15" className="absolute -right-[20%] top-[5%] h-[90vmin] w-[90vmin] rounded-full bg-gold/10 blur-3xl" />
        <div data-parallax="0.08" className="absolute -left-[10%] bottom-[-20%] h-[60vmin] w-[60vmin] rounded-full bg-oxblood/15 blur-3xl" />
        <div className="vignette absolute inset-0" />
      </div>
      {/* barras de cinema */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-8 hidden justify-between px-5 text-[0.65rem] uppercase tracking-[0.4em] text-ivory-dim/70 md:flex md:px-8">
        <span>{t.hero.frame}</span>
        <span className="hidden sm:inline">35mm · f/1.4</span>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-24 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="hero-rise text-[0.7rem] uppercase tracking-[0.4em] text-gold sm:text-xs" style={{ ['--d' as string]: '100ms' }}>
            {t.hero.kicker}
          </p>
          <h1 id="hero-title" className="mt-6 leading-[0.82]">
            <span className="hero-rise block font-display text-[clamp(4.5rem,17vw,12rem)] font-medium italic text-ivory" style={{ ['--d' as string]: '250ms' }}>
              Carol
            </span>
            <span className="hero-rise block font-flash text-[clamp(4.5rem,18vw,13rem)] text-gold" style={{ ['--d' as string]: '450ms' }}>
              Alves
            </span>
          </h1>
          <div className="hero-rise mt-8 max-w-xl" style={{ ['--d' as string]: '700ms' }}>
            <p className="font-display text-2xl italic leading-snug text-ivory md:text-3xl">{t.hero.tagline}</p>
            <p className="mt-4 text-base leading-relaxed text-ivory-dim">{t.hero.sub}</p>
          </div>
          <div className="hero-rise mt-10 flex flex-col gap-4 sm:flex-row" style={{ ['--d' as string]: '900ms' }}>
            <Link
              to="/"
              hash="tatuagens"
              className="group inline-flex min-h-12 items-center justify-center gap-3 bg-gold px-8 text-sm font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ivory"
            >
              {t.hero.ctaPortfolio}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/orcamento"
              className="inline-flex min-h-12 items-center justify-center border border-gold/60 px-8 text-sm uppercase tracking-[0.25em] text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              {t.hero.ctaQuote}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          {HERO_IMAGE ? (
            <figure data-parallax="-0.06" className="relative border border-gold/30 bg-ink p-3 shadow-2xl shadow-ink">
              <img
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt[lang]}
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
                fetchPriority="high"
                className="h-auto w-full"
              />
            </figure>
          ) : (
            <div data-parallax="-0.06" className="hero-rise" style={{ ['--d' as string]: '500ms' }}>
              <FlashMedallion label="Old School" className="w-full drop-shadow-[0_30px_60px_hsl(var(--ink))]" />
            </div>
          )}
        </div>
      </div>

      <Link
        to="/"
        hash="artista"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-ivory-dim hover:text-gold"
      >
        {t.hero.scroll}
        <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
      </Link>
    </section>
  )
}

function Artist() {
  const { t, lang } = useLang()
  return (
    <section id="artista" aria-labelledby="artista-title" className="relative border-t border-gold/15 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          {ARTIST_PORTRAIT ? (
            <figure className="border border-gold/30 bg-ink p-3">
              <img
                src={ARTIST_PORTRAIT.src}
                alt={ARTIST_PORTRAIT.alt[lang]}
                width={ARTIST_PORTRAIT.width}
                height={ARTIST_PORTRAIT.height}
                loading="lazy"
                className="h-auto w-full grayscale-[30%]"
              />
            </figure>
          ) : (
            <div className="relative aspect-[4/5] border border-gold/30 bg-ink p-3">
              <div className="flex h-full flex-col items-center justify-center gap-6 border border-gold/15">
                <FlashMedallion className="w-1/2 opacity-80" />
                <p className="font-display text-sm italic text-ivory-dim">{t.artist.portraitPending}</p>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <div data-reveal>
            <SectionMark index="I" eyebrow={t.artist.eyebrow} />
            <h2 id="artista-title" className="mt-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] italic leading-[0.95] text-ivory">
              {t.artist.title}
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-ivory">{t.artist.p1}</p>
            <p className="mt-5 leading-relaxed text-ivory-dim">{t.artist.p2}</p>
            {SITE_CONFIG.location ? <p className="mt-5 text-sm uppercase tracking-[0.25em] text-gold">{SITE_CONFIG.location}</p> : null}
          </div>
          <ul className="mt-12 divide-y divide-gold/15 border-y border-gold/15">
            {t.artist.disciplines.map((d, i) => (
              <li key={`discipline-${i}`} data-reveal style={{ ['--reveal-delay' as string]: `${i * 100}ms` }} className="grid grid-cols-[3rem_1fr] gap-4 py-5 sm:grid-cols-[3rem_9rem_1fr]">
                <span className="font-display italic text-gold">0{i + 1}</span>
                <h3 className="font-flash text-2xl text-ivory">{d.name}</h3>
                <p className="col-start-2 text-sm leading-relaxed text-ivory-dim sm:col-start-3">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function SectionHead({ id, index, eyebrow, title, intro }: { id: string; index: string; eyebrow: string; title: string; intro: string }) {
  return (
    <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end" data-reveal>
      <div className="md:col-span-7">
        <SectionMark index={index} eyebrow={eyebrow} />
        <h2 id={id} className="mt-6 font-display text-[clamp(3rem,9vw,7rem)] italic leading-[0.9] text-ivory">
          {title}
        </h2>
      </div>
      <p className="max-w-md leading-relaxed text-ivory-dim md:col-span-4 md:col-start-9">{intro}</p>
    </div>
  )
}

function Tattoos() {
  const { t } = useLang()
  return (
    <section id="tatuagens" aria-labelledby="tatuagens-title" className="relative overflow-hidden border-t border-gold/15 bg-ink py-24 md:py-36">
      <div aria-hidden="true" data-parallax="0.12" className="pointer-events-none absolute -right-10 top-10 select-none font-flash text-[30vw] leading-none text-gold/[0.04]">
        Flash
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead id="tatuagens-title" index="II" eyebrow={t.tattoos.eyebrow} title={t.tattoos.title} intro={t.tattoos.intro} />
        <GalleryGate>
          <TattooCarousel emptyTitle={t.tattoos.empty} emptyText={t.tattoos.emptyText} />
        </GalleryGate>
      </div>
    </section>
  )
}

function Paintings() {
  const { t } = useLang()
  return (
    <section id="pinturas" aria-labelledby="pinturas-title" className="relative border-t border-gold/15 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead id="pinturas-title" index="III" eyebrow={t.paintings.eyebrow} title={t.paintings.title} intro={t.paintings.intro} />
        <GalleryGate>
          <EditorialGallery items={PAINTINGS} emptyTitle={t.paintings.empty} emptyText={t.paintings.emptyText} />
        </GalleryGate>
      </div>
    </section>
  )
}

function Vision() {
  const { t } = useLang()
  return (
    <section id="visao" aria-labelledby="visao-title" className="relative overflow-hidden border-t border-gold/15 bg-night-soft py-24 md:py-36">
      <div aria-hidden="true" data-parallax="-0.1" className="absolute -left-32 top-1/2 w-[28rem] -translate-y-1/2 opacity-[0.07]">
        <FlashMedallion />
      </div>
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <div data-reveal>
          <SectionMark index="IV" eyebrow={t.about.eyebrow} />
          <h2 id="visao-title" className="mt-6 max-w-3xl font-display text-[clamp(2.5rem,6vw,4.75rem)] italic leading-[0.95] text-ivory">
            {t.about.title}
          </h2>
        </div>
        <blockquote data-reveal className="my-14 md:my-20">
          <div className="rule-double" aria-hidden="true" />
          <p className="py-10 text-center font-flash text-[clamp(1.75rem,4.5vw,3.25rem)] leading-tight text-gold">“{t.about.quote}”</p>
          <div className="rule-double" aria-hidden="true" />
        </blockquote>
        <div className="grid gap-8 md:grid-cols-3">
          {[t.about.p1, t.about.p2, t.about.p3].map((p, i) => (
            <p key={i} data-reveal style={{ ['--reveal-delay' as string]: `${i * 120}ms` }} className="leading-relaxed text-ivory-dim first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:italic first-letter:leading-none first-letter:text-gold">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { t } = useLang()
  return (
    <section id="contato" aria-labelledby="contato-title" className="relative border-t border-gold/15 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <SectionMark index="V" eyebrow={t.contact.eyebrow} />
          <h2 id="contato-title" className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] italic leading-[0.92] text-ivory">
            {t.contact.title}
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-ivory-dim">{t.contact.intro}</p>
          <Link
            to="/orcamento"
            className="group mt-10 flex items-center justify-between gap-4 border border-gold/40 p-5 transition-colors hover:border-gold hover:bg-gold/5"
          >
            <span className="flex items-center gap-3">
              <Diamond className="h-3 w-3 shrink-0" />
              <span className="font-display text-lg italic text-ivory">{t.contact.simulatorCta}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <div className="lg:col-span-6 lg:col-start-7" data-reveal>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
