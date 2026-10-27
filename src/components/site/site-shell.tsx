import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { LanguageProvider, useLang } from '../../lib/i18n'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'

/** Entradas ao rolar + parallax discreto. Respeita prefers-reduced-motion. */
function useMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    if (reduce) return

    root.classList.add('js-reveal')
    const reveal = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-visible')
      } else {
        io.observe(el)
      }
    }
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    revealEls.forEach((el) => io.observe(el))
    // Elementos que nascem depois (troca de idioma, galerias reveladas) também são observados
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.hasAttribute('data-reveal')) reveal(n)
            n.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal)
          }
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      for (const el of parallaxEls) {
        const speed = Number(el.dataset.parallax) || 0.1
        const rect = el.getBoundingClientRect()
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed
        el.style.transform = `translate3d(0, ${(-offset).toFixed(1)}px, 0)`
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      root.classList.remove('js-reveal')
    }
  }, [])
}

function ShellInner({ children }: { children: ReactNode }) {
  const { t } = useLang()
  useMotion()
  return (
    <div className="relative min-h-screen bg-night font-body text-ivory">
      <a
        href="#conteudo"
        className="sr-only z-[70] bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skip}
      </a>
      <div className="film-grain" aria-hidden="true" />
      <SiteHeader />
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </div>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ShellInner>{children}</ShellInner>
    </LanguageProvider>
  )
}
