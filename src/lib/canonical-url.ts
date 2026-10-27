// Defina VITE_SITE_URL (ex.: https://carolalves.com.br) para gerar <link rel="canonical">.
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')

export function canonicalUrl(path: string): string | undefined {
  if (!SITE_URL) return undefined
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`)
}
