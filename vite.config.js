import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugins-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/inteligencia-artificial/',
})
