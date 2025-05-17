import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Прокси для API Flask-сервера
      '/stations-nearby': 'http://localhost:5000',
      '/predict-location': 'http://localhost:5000',
      '/predict-area': 'http://localhost:5000',
    }
  }
})

