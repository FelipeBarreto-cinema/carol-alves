# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Site de portfólio da Carol Alves (tatuadora e artista plástica): home + página de orçamento, em PT/EN/ES. O código de `src/components`, `src/routes`, `src/lib/i18n.tsx`, `src/lib/site-content.ts`, `src/styles.css`, `src/metadata.json` e `public/` veio do Macaly (gerador de sites por IA). O resto — `package.json`, `vite.config.ts`, `tsconfig.json`, `src/router.tsx`, `src/lib/canonical-url.ts`, `src/shims/` — foi recriado à mão, porque o Macaly só exporta os arquivos alterados em relação ao template dele.

## Comandos

```
npm run dev        # http://localhost:3000
npm run build      # build client + SSR e prerender estático em dist/client
npm run preview
npx tsc --noEmit   # checagem de tipos (não há lint nem testes)
```

O deploy é estático: publicar `dist/client/` (`index.html` e `orcamento/index.html`). `VITE_SITE_URL` (opcional) liga o `<link rel="canonical">`; sem ela, `canonicalUrl()` devolve `undefined` e o link é omitido.

## Arquitetura

- **TanStack Start + file-based routing.** Rotas em `src/routes/`; `src/routeTree.gen.ts` é gerado pelo plugin (fica no `.gitignore`). `__root.tsx` usa `shellComponent` para montar o `<html>` inteiro. O prerender (`crawlLinks`) em `vite.config.ts` é o que gera o HTML estático; rota nova só vira página se for alcançável por link.
- **CSS importado como efeito colateral em `__root.tsx`.** Não trocar por `?url`/`?inline`: os builds client e SSR geram hashes diferentes e o CSS dá 404 (o comentário no arquivo explica).
- **`@macaly/bridge`** só funciona no editor do Macaly. Aqui é um alias em `vite.config.ts` (e `paths` no `tsconfig.json`) para `src/shims/macaly-bridge.tsx`, que só repassa os filhos.
- **SEO por rota:** cada rota lê título/descrição de `src/metadata.json` (chave = path) no `head()`.
- **Conteúdo real fica em `src/lib/site-content.ts`:** `SITE_CONFIG` (WhatsApp, e-mail, Instagram, cidade) e as listas `TATTOOS`, `PAINTINGS`, `ARTIST_PORTRAIT`, `HERO_IMAGE`. Hoje estão vazias, e a regra do arquivo é não inventar dados: campo vazio simplesmente some da página (as galerias mostram o estado "em curadoria").
- **Idiomas (`src/lib/i18n.tsx`):** um dicionário por idioma; `Dict = typeof pt`, então o português define a forma e `en`/`es` precisam ter as mesmas chaves. `LanguageProvider` fica dentro do `SiteShell`, renderiza sempre `pt` no servidor/primeiro render e só depois aplica a escolha salva em `localStorage` (`carol-alves-lang`). Texto novo na UI = chave nos três dicionários, consumida via `useLang().t`.
- **Orçamento:** `quote-form.tsx` monta uma mensagem e abre `wa.me` se `whatsappNumber` estiver preenchido; senão oferece copiar para a área de transferência. Não há backend. `tattoo-simulator.tsx` é um canvas 100% no navegador (foto do corpo + arte de referência, exporta PNG).
- **Estilo:** Tailwind 4 via `@tailwindcss/vite`, configurado só no CSS (`@import 'tailwindcss'`, `@plugin`, tokens HSL em `:root` de `src/styles.css`). Não existe `tailwind.config`.

## Pendências conhecidas

`public/manifest.json` cita `logo192.png` e `logo512.png`, que não existem.
