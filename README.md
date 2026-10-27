# Site Carol Alves

Portfólio da Carol Alves, tatuadora Old School e artista plástica: home + página de orçamento, em português, inglês e espanhol. O código veio do Macaly (projeto "teste2"), com a base do template recriada.

## Comandos

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # gera o site estático em dist/client
    npm run preview    # serve o build localmente
    npx tsc --noEmit   # checa os tipos

O deploy é estático: basta publicar `dist/client/`. Defina `VITE_SITE_URL` (ex.: `https://carolalves.com.br`) antes do build para gerar o link canônico de SEO; sem ela, o link é omitido.

## Onde editar

| Quero mudar | Arquivo |
| --- | --- |
| WhatsApp, e-mail, Instagram, cidade | `src/lib/site-content.ts` (`SITE_CONFIG`) |
| Fotos de tatuagens, pinturas, retrato, imagem do topo | `src/lib/site-content.ts` |
| Textos da interface (nos 3 idiomas) | `src/lib/i18n.tsx` |
| Título e descrição de cada página | `src/metadata.json` |
| Cores e fontes | `src/styles.css` |

Campo vazio some da página; não invente dados.

## O que foi recriado (não veio do Macaly)

- `package.json`, `vite.config.ts`, `tsconfig.json`, `src/router.tsx`
- `src/lib/canonical-url.ts`: usa `VITE_SITE_URL`
- `src/shims/macaly-bridge.tsx`: substitui o `@macaly/bridge`, que só funciona no editor do Macaly

## Pendências

- [ ] Preencher WhatsApp, e-mail, Instagram e cidade
- [ ] Subir as fotos de tatuagens e pinturas
- [ ] Criar `logo192.png` e `logo512.png`, citados no `public/manifest.json`
- [ ] Definir o domínio final (`VITE_SITE_URL`)

Documentação completa: [Site Carol Alves](https://claude.ai/artifact/V1Q4xt5f7tT4W2eVAoDoM4) (documento no Claude; pede acesso ao Aron).
