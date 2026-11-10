import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { canonicalUrl } from '../lib/canonical-url'
import { LanguageProvider, useLang } from '../lib/i18n'
import { PaintArtwork } from '../components/site/paint-svg'
import { ArtworkModal } from '../components/site/paint-modal'
import { ImmersiveRoom } from '../components/site/paint-room'
import { PaintingJourney } from '../components/site/paint-journey'
import { PAINT_WORKS, type PaintWorkId } from '../lib/painting-works'
import { SITE_CONFIG } from '../lib/site-content'
import '../paint.css'

export const Route = createFileRoute('/pintura')({
  head: () => {
    const canonical = canonicalUrl('/pintura')
    return {
      meta: [
        { title: 'Carol Alves Â· Pintura abstrata' },
        { name: 'description', content: 'Artista visual brasileira. Pintura abstrata, gesto, cor e matÃ©ria â€” explore as obras de perto.' },
        { property: 'og:title', content: 'Carol Alves Â· Pintura abstrata' },
        { property: 'og:description', content: 'Artista visual brasileira. Pintura abstrata, gesto, cor e matÃ©ria â€” explore as obras de perto.' },
        { property: 'og:type', content: 'website' },
      ],
      links: canonical ? [{ rel: 'canonical', href: canonical }] : [],
    }
  },
  component: PaintPage,
})

function PaintPage() {
  return (
    <LanguageProvider>
      <PaintContent />
    </LanguageProvider>
  )
}

type Mode = 'modal' | 'room' | 'journey'
type ExpState = { workId: PaintWorkId; mode: Mode } | null

function PaintContent() {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState<'todas' | 'abstratas' | 'estudos' | 'contrastes'>('todas')
  const [exp, setExp] = useState<ExpState>(null)

  const visibleWorks = useMemo(
    () => (filter === 'todas' ? PAINT_WORKS : PAINT_WORKS.filter((w) => w.category === filter)),
    [filter],
  )

  return (
    <div className="paint-root">
      <header className="paint-topbar">
        <Link to="/" className="paint-brand">CAROL ALVES</Link>
        <nav className="paint-nav">
          <a href="#obras">{t.paintPage.navWorks}</a>
          <a href="#sobre">{t.paintPage.navAbout}</a>
          <a href="#processo">{t.paintPage.navProcess}</a>
          <a href="#contato">{t.paintPage.navContact}</a>
        </nav>
      </header>

      <section className="paint-hero">
        <div className="paint-hero-copy">
          <div className="paint-kicker">{t.paintPage.kicker}</div>
          <h1>{t.paintPage.heroTitle}</h1>
          <p>{t.paintPage.heroSub}</p>
          <a className="paint-text-link" href="#obras">{t.paintPage.heroCta} <span>â†—</span></a>
        </div>
        <div className="paint-hero-art" aria-label="Pintura abstrata em tons de azul, ferrugem e marfim">
          <PaintArtwork work="materia-em-movimento" />
          <div className="paint-vertical-note">MatÃ©ria em movimento Â· 2025</div>
        </div>
      </section>

      <section className="paint-section paint-gallery" id="obras">
        <div className="paint-section-head">
          <div>
            <div className="paint-kicker">{t.paintPage.worksEyebrow}</div>
            <h2>{t.paintPage.worksTitle}</h2>
          </div>
          <p className="paint-section-intro">{t.paintPage.worksIntro}</p>
        </div>
        <div className="paint-filters" role="group" aria-label={t.paintPage.filterAll}>
          {(['todas', 'abstratas', 'estudos', 'contrastes'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`paint-filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'todas' ? t.paintPage.filterAll : f === 'abstratas' ? t.paintPage.filterAbstract : f === 'estudos' ? t.paintPage.filterStudies : t.paintPage.filterContrasts}
            </button>
          ))}
        </div>
        <div className="paint-grid">
          {visibleWorks.map((work) => (
            <button
              key={work.id}
              type="button"
              className="paint-card"
              onClick={() => setExp({ workId: work.id, mode: 'modal' })}
            >
              <div className="paint-thumb">
                <PaintArtwork work={work.id} />
                <span className="paint-view-hint">{t.paintPage.viewHint} â†—</span>
              </div>
              <div className="paint-meta">
                <div>
                  {work.series[lang]}
                  <small>{work.title[lang]} Â· {work.year}</small>
                </div>
                <span className="number">{String(PAINT_WORKS.indexOf(work) + 1).padStart(2, '0')}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="paint-section paint-statement">
        <div>
          <div className="paint-kicker">{t.paintPage.statementEyebrow}</div>
          <h2>{t.paintPage.statementTitle1}<em>{t.paintPage.statementTitle2}</em></h2>
        </div>
        <div className="paint-statement-copy">
          <p>{t.paintPage.statementP1}</p>
          <p>{t.paintPage.statementP2}</p>
          <a className="paint-text-link" href="#processo">{t.paintPage.statementCta} <span>â†—</span></a>
        </div>
      </section>

      <section className="paint-about" id="sobre">
        <div className="paint-about-photo" aria-label="RepresentaÃ§Ã£o artÃ­stica de um ateliÃª de pintura">
          <svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="paint-studio" x2="1" y2="1">
                <stop stopColor="#7d6b55" />
                <stop offset="1" stopColor="#211d18" />
              </linearGradient>
            </defs>
            <rect width="600" height="760" fill="url(#paint-studio)" />
            <rect x="35" y="40" width="220" height="290" fill="#d1b99a" />
            <rect x="55" y="60" width="180" height="250" fill="#24231f" />
            <path d="M55 220L130 80 180 180 235 100V310H55Z" fill="#a94d26" />
            <path d="M55 250L115 170 160 235 235 150V310H55Z" fill="#1c5064" />
            <rect x="310" y="75" width="250" height="360" fill="#0f1110" />
            <path d="M320 370Q390 250 420 150T540 90L560 430H320Z" fill="#c17a37" />
            <path d="M350 420Q430 310 480 200T560 130" fill="none" stroke="#e4d4b8" strokeWidth="24" />
            <path d="M80 500L530 470 600 760H0Z" fill="#6d5039" />
            <path d="M160 570L420 525 500 640 180 675Z" fill="#d1bfa7" />
            <path d="M200 575L260 555 280 620 220 638Z" fill="#bf4526" />
            <path d="M300 570L380 540 400 610 330 630Z" fill="#174e65" />
            <g fill="none" stroke="#d9c6a9" strokeWidth="7">
              <path d="M120 420L210 570" />
              <path d="M145 410L235 560" />
              <path d="M170 405L260 550" />
            </g>
            <rect width="600" height="760" fill="#000" opacity=".15" />
          </svg>
        </div>
        <div className="paint-about-copy">
          <div className="paint-kicker">{t.paintPage.aboutEyebrow}</div>
          <h2>{t.paintPage.aboutTitle}</h2>
          <p>{t.paintPage.aboutP1}</p>
          <p>{t.paintPage.aboutP2}</p>
          <a className="paint-text-link" href="#contato">{t.paintPage.aboutCta} <span>â†—</span></a>
        </div>
      </section>

      <section className="paint-section paint-process" id="processo">
        <div className="paint-process-copy">
          <div className="paint-kicker">{t.paintPage.processEyebrow}</div>
          <h2>{t.paintPage.processTitle1}<em>{t.paintPage.processTitle2}</em></h2>
          <p>{t.paintPage.processP}</p>
          <div className="paint-process-list">
            {t.paintPage.processList.map((item, i) => (
              <div key={i}>
                <span className="num">0{i + 1}</span>
                {item.label}
                <span>â†—</span>
              </div>
            ))}
          </div>
        </div>
        <div className="paint-process-visual" aria-label="Detalhe de pinceladas e tinta abstrata">
          <PaintArtwork work="campo-de-forcas" />
        </div>
      </section>

      <section className="paint-section paint-space">
        <div className="paint-space-panel">
          <PaintArtwork work="materia-em-movimento" />
          <div className="paint-space-content">
            <div className="paint-kicker">{t.paintPage.spaceEyebrow}</div>
            <h2>{t.paintPage.spaceTitle}</h2>
            <p>{t.paintPage.spaceP}</p>
            <a className="paint-text-link" href="#obras">{t.paintPage.spaceCta} <span>â†—</span></a>
          </div>
        </div>
      </section>

      <section className="paint-contact" id="contato">
        <div>
          <div className="paint-kicker">{t.paintPage.contactEyebrow}</div>
          <h2>{t.paintPage.contactTitle1}<em>{t.paintPage.contactTitle2}</em></h2>
          <p>{t.paintPage.contactP}</p>
          <p className="paint-tiny">{t.paintPage.contactTags}</p>
          {SITE_CONFIG.instagramUrl ? (
            <a
              href={SITE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="paint-text-link"
            >
              {t.paintPage.contactCta} â€” Instagram <span>â†—</span>
            </a>
          ) : null}
        </div>
        <div className="paint-contact-cta">
          <Link to="/orcamento" className="paint-text-link">{t.paintPage.contactCta} <span>â†—</span></Link>
        </div>
      </section>

      <footer className="paint-footer">
        <Link to="/" className="paint-footer-brand">CAROL ALVES</Link>
        <div className="paint-footer-links">
          <a href="#obras">{t.paintPage.navWorks}</a>
          <a href="#sobre">{t.paintPage.navAbout}</a>
          <a href="#processo">{t.paintPage.navProcess}</a>
          <a href="#contato">{t.paintPage.navContact}</a>
        </div>
        <div>{t.paintPage.footerLine} Â· Â© {new Date().getFullYear()}</div>
      </footer>

      {exp === null ? null : exp.mode === 'modal' ? (
        <ArtworkModal
          workId={exp.workId}
          onClose={() => setExp(null)}
          onEnterRoom={() => setExp({ workId: exp.workId, mode: 'room' })}
        />
      ) : exp.mode === 'room' ? (
        <ImmersiveRoom
          workId={exp.workId}
          onClose={() => setExp(null)}
          onEnterJourney={() => setExp({ workId: exp.workId, mode: 'journey' })}
        />
      ) : (
        <PaintingJourney workId={exp.workId} onClose={() => setExp(null)} />
      )}
    </div>
  )
}
