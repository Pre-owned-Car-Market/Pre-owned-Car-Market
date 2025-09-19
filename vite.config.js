// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/car/',               
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {                 
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
