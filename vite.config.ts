import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',

  server: {
    proxy: {
      '/api': {
        target: 'https://casamentokiuryeleticia.com.br',
        changeOrigin: true,
        secure: true,
        // O backend marca o cookie de sessão como Secure (HTTPS em produção),
        // mas o dev local roda em http://localhost — navegador recusaria cookie
        // Secure em página HTTP e o login cairia de volta pro home.
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie'];
            if (!cookies) return;
            proxyRes.headers['set-cookie'] = cookies.map((c) =>
              c.replace(/;\s*secure/i, '')
            );
          });
        }
      },
      '/imagens-presentes': {
        target: 'https://casamentokiuryeleticia.com.br',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
