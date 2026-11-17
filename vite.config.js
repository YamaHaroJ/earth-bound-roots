import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two pages: the home page and "Meet your practitioners".
export default defineConfig({
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
})
