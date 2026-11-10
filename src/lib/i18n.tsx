
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from './site-content'
import content from '../../content/site.json'

export type Dict = typeof content.pt

export const DICTS: Record<Lang, Dict> = content

export const LANGS: Lang[] = ['pt', 'en', 'es']

const HTML_LANG: Record<Lang, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
}

const STORAGE_KEY = 'carol-alves-lang'

type Ctx = {
  lang: Lang
  t: Dict
  setLang: (l: Lang) => void
}

const LangContext = createContext<Ctx>({
  lang: 'pt',
  t: DICTS.pt,
  setLang: () => {},
})

export function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  // Mantém português no primeiro carregamento.
  const [lang, setLangState] = useState<Lang>('pt')

  // Recupera o idioma escolhido pelo visitante.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (saved === 'en' || saved === 'es' || saved === 'pt') {
      setLangState(saved)
    }
  }, [])

  // Atualiza o idioma do documento.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  // Salva a preferência de idioma.
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    window.localStorage.setItem(STORAGE_KEY, l)
  }, [])

  return (
    <LangContext.Provider
      value={{
        lang,
        t: DICTS[lang],
        setLang,
      }}
    >
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
