import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AH-website/', // ✅ FIXED
  build: {
    chunkSizeWarningLimit: 800
  }
})