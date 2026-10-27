import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { canonicalUrl } from '../lib/canonical-url'
import siteMetadata from '../metadata.json'
import { SiteShell } from '../components/site/site-shell'
import { SectionMark } from '../components/site/ornament'
import { TattooSimulator } from '../components/site/tattoo-simulator'
import { QuoteForm } from '../components/site/quote-form'
import { useLang } from '../lib/i18n'

const meta = siteMetadata['/orcamento']

export const Route = createFileRoute('/orcamento')({
  head: () => {
    const canonical = canonicalUrl('/orcamento')
    return {
      meta: [
        { title: meta.title },
        { name: 'description', content: meta.description },
        { property: 'og:title', content: meta.title },
        { property: 'og:description', content: meta.description },
        { property: 'og:type', content: 'website' },
      ],
      links: canonical ? [{ rel: 'canonical', href: canonical }] : [],
    }
  },
  component: QuotePage,
})

function QuotePage() {
  return (
    <SiteShell>
      <QuoteContent />
    </SiteShell>
  )
}

function QuoteContent() {
  const { t } = useLang()
  return (
    <>
      <section aria-labelledby="orc-title" className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div aria-hidden="true" className="absolute -right-[15%] -top-[20%] -z-0 h-[70vmin] w-[70vmin] rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ivory-dim hover:text-gold">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.quotePage.back}
          </Link>
          <SectionMark index="★" eyebrow={t.quotePage.eyebrow} />
          <h1 id="orc-title" className="mt-6 max-w-4xl font-display text-[clamp(3rem,9vw,7rem)] italic leading-[0.9] text-ivory">
            {t.quotePage.title}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-ivory-dim">{t.quotePage.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <TattooSimulator />
      </div>

      <section aria-labelledby="orc-form-title" className="border-t border-gold/15 bg-night-soft py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 id="orc-form-title" className="mb-10 font-display text-4xl italic text-ivory md:text-5xl">
            {t.quotePage.formTitle}
          </h2>
          <QuoteForm />
        </div>
      </section>
    </>
  )
}
