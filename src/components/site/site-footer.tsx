import { Link } from '@tanstack/react-router'
import { useLang } from '../../lib/i18n'
import { SITE_CONFIG } from '../../lib/site-content'
import { Diamond } from './ornament'

export function SiteFooter() {
  const { t } = useLang()
  const year = new Date().getFullYear()
  const wa = SITE_CONFIG.whatsappNumber.replace(/\D/g, '')
  const hasContact = Boolean(wa || SITE_CONFIG.email || SITE_CONFIG.instagramUrl || SITE_CONFIG.location)

  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-ink">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 md:px-8">
        <p
          aria-hidden="true"
          className="pointer-events-none select-none font-flash text-[22vw] leading-[0.8] text-gold/10 md:text-[14rem]"
        >
          Carol Alves
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl italic text-ivory">Carol Alves</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory-dim">{t.footer.line}</p>
          </div>

          <nav aria-label={t.footer.nav}>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gold">{t.footer.nav}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[
                ['tatuagens', t.nav.tattoos],
                ['pinturas', t.nav.paintings],
                ['artista', t.nav.artist],
                ['visao', t.nav.about],
                ['contato', t.nav.contact],
              ].map(([hash, label]) => (
                <li key={hash}>
                  <Link to="/" hash={hash} className="text-ivory-dim transition-colors hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/orcamento" className="text-ivory-dim transition-colors hover:text-gold">
                  {t.footer.quoteLink}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gold">{t.footer.contact}</h2>
            <ul className="mt-4 space-y-2 text-sm text-ivory-dim">
              {wa ? (
                <li>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {SITE_CONFIG.email ? (
                <li>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold">
                    {SITE_CONFIG.email}
                  </a>
                </li>
              ) : null}
              {SITE_CONFIG.instagramUrl ? (
                <li>
                  <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    Instagram
                  </a>
                </li>
              ) : null}
              {SITE_CONFIG.location ? <li>{SITE_CONFIG.location}</li> : null}
              {!hasContact ? (
                <li>
                  <Link to="/orcamento" className="hover:text-gold">
                    {t.footer.noContact}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-gold/15 pt-6 text-xs text-ivory-dim sm:flex-row sm:items-center">
          <p>
            © {year} Carol Alves. {t.footer.rights}
          </p>
          <div className="flex items-center gap-2" aria-hidden="true">
            <Diamond className="h-2 w-2" />
            <Diamond className="h-2 w-2 opacity-60" />
            <Diamond className="h-2 w-2 opacity-30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
