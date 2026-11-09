import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './extras.css'
import './ui.css'

createApp(App).mount('#app')

// PWA: registra o service worker só no site publicado (no modo dev atrapalharia o recarregamento)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}))
}
