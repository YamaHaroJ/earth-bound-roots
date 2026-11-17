import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two pages: the home page and "Meet your practitioners".
// Built for GitHub Pages at https://yamaharoj.github.io/earth-bound-roots/ (dev and capture run at /)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/earth-bound-roots/' : '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        practitioners: resolve(import.meta.dirname, 'practitioners.html'),
      },
    },
  },
}))
