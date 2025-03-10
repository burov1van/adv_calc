import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Если репо называется adv_calc
  base: '/adv_calc/',
  plugins: [react()],
})
