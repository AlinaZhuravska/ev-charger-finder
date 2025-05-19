import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy for Flask API server
      '/stations-nearby': 'http://localhost:5000',
      '/predict-location': 'http://localhost:5000',
      '/predict-area': 'http://localhost:5000',

      // New path for geocoding proxying (via Flask)
      '/geocode': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

