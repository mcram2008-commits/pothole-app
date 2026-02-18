import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Explicitly set port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Proxy API calls to backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
