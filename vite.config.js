import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // для Vercel сайт в корне домена
  plugins: [react()],
})
