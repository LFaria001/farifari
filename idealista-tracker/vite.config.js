import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/idealista-tracker/app/',
  build: {
    outDir: 'app',
    emptyOutDir: true,
  },
  server: {
    host: true,
    proxy: {
      '/api/sheets': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api\/sheets/, ''),
      },
    },
  },
})
