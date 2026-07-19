import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',

  // Proxy para API PHP em produção - permite testar localmente com API real
  server: {
    proxy: {
      '/api': {
        target: 'https://casamentokiuryeleticia.com.br',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
