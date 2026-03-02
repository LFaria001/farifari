import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/idealistatracker/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
})
