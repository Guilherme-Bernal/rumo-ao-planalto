import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' faz o build funcionar em qualquer subpasta (GitHub Pages, etc.)
export default defineConfig({
  base: './',
  plugins: [vue()],
})