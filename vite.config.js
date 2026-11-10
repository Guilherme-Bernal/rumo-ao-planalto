import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' faz o build funcionar em qualquer subpasta (GitHub Pages, etc.)
// three.js (a parte mais pesada) vai num arquivo próprio, carregado em paralelo e guardado em cache
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 950,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined),
      },
    },
  },
  // testes em sequência e com folga de tempo (o teste dos bots abre outros processos e disputa CPU)
  test: { fileParallelism: false, testTimeout: 30000 },
})
