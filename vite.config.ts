import { fileURLToPath, URL } from 'node:url'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Copy content/ (markdown + generated index.json) into dist/ after bundling,
// so the SPA can fetch it at runtime. Public-dir copies would diverge from
// the single source of truth in content/.
function copyContent() {
  return {
    name: 'copy-content',
    closeBundle() {
      const src = fileURLToPath(new URL('content', import.meta.url))
      const dest = fileURLToPath(new URL('dist/content', import.meta.url))
      if (existsSync(dest)) rmSync(dest, { recursive: true, force: true })
      mkdirSync(dest, { recursive: true })
      cpSync(src, dest, { recursive: true })
    },
  }
}

export default defineConfig({
  base: './',
  // 98.css ships `@media (not(hover))`, which Lightning CSS rejects as an
  // invalid media query. Skip CSS minification (98.css is pre-minified).
  build: { cssMinify: false },
  plugins: [vue(), tailwindcss(), copyContent()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
