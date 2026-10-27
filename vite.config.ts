import dns from 'node:dns'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Windows/Node 24: o prerender faz fetch em localhost e, com IPv6-first, tenta ::1
// (timeout) antes de 127.0.0.1. Forçar IPv4-first corrige sem depender de env var.
dns.setDefaultResultOrder('ipv4first')

export default defineConfig({
  resolve: {
    alias: {
      // O pacote do Macaly só existe dentro do editor deles; aqui vira um componente vazio.
      '@macaly/bridge': fileURLToPath(new URL('./src/shims/macaly-bridge.tsx', import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Gera HTML estático de todas as páginas em dist/client.
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
})

