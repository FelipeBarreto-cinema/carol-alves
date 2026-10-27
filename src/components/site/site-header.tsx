import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { LANGS, useLang } from '../../lib/i18n'

export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  return (
    <div role="group" aria-label={t.nav.language} className={`flex items-center gap-1 ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          data-testid={`lang-${l}`}
          className={`min-h-9 min-w-9 px-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
            lang === l ? 'text-gold underline decoration-gold underline-offset-[6px]' : 'text-ivory-dim hover:text-ivory'
          }`}
        >
          <span className="sr-only">{DICT_NAMES[l]}</span>
          <span aria-hidden="true">{l}</span>
        </button>
      ))}
    </div>
  )
}

const DICT_NAMES = { pt: 'Português', en: 'English', es: 'Español' } as const

export function SiteHeader() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const links = [
    { hash: 'tatuagens', label: t.nav.tattoos },
    { hash: 'pinturas', label: t.nav.paintings },
    { hash: 'artista', label: t.nav.artist },
    { hash: 'visao', label: t.nav.about },
    { hash: 'contato', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('a, button'),
        ).concat(toggleRef.current ? [toggleRef.current] : [])
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? 'border-b border-gold/20 bg-night/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" aria-label={t.nav.home} className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-flash text-2xl text-gold transition-colors group-hover:text-ivory md:text-3xl">Carol</span>
          <span className="font-display text-lg italic text-ivory md:text-xl">Alves</span>
        </Link>

        <nav aria-label={t.nav.label} className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.hash}
              to="/"
              hash={l.hash}
              className="relative text-[0.78rem] uppercase tracking-[0.22em] text-ivory-dim transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-ivory hover:after:scale-x-100"
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitch className="border-l border-gold/25 pl-4" />
          <Link
            to="/orcamento"
            className="border border-gold px-4 py-2 text-[0.75rem] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            {t.nav.quote}
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          data-testid="menu-toggle"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gold/20 bg-night px-6 pb-10 pt-8 lg:hidden"
      >
        <nav aria-label={t.nav.label}>
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li key={l.hash} className="border-b border-gold/15">
                <Link
                  to="/"
                  hash={l.hash}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-3xl italic text-ivory transition-colors hover:text-gold"
                >
                  <span className="font-body text-xs not-italic text-gold">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/orcamento"
            onClick={() => setOpen(false)}
            className="mt-8 flex min-h-12 items-center justify-center bg-gold px-5 text-sm uppercase tracking-[0.25em] text-ink"
          >
            {t.nav.quote}
          </Link>
          <LanguageSwitch className="mt-8 justify-center" />
        </nav>
      </div>
    </header>
  )
}
