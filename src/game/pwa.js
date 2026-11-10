import { reactive } from 'vue'

// PWA: botão "Instalar o app" e aviso de nova versão disponível.
export const pwa = reactive({ canInstall: false, atualizada: false, instalado: false })
let adiado = null

export function pwaInit() {
  if (typeof window === 'undefined') return
  pwa.instalado = (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    adiado = e
    pwa.canInstall = true
  })
  window.addEventListener('appinstalled', () => {
    pwa.canInstall = false
    pwa.instalado = true
    adiado = null
  })
  if ('serviceWorker' in navigator) {
    // se já havia um service worker controlando a página, uma troca de controlador significa versão nova
    const tinha = !!navigator.serviceWorker.controller
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (tinha) pwa.atualizada = true
    })
  }
}

export async function pwaInstalar() {
  if (!adiado) return false
  adiado.prompt()
  const r = await adiado.userChoice.catch(() => null)
  adiado = null
  pwa.canInstall = false
  return !!(r && r.outcome === 'accepted')
}
export const pwaRecarregar = () => location.reload()
export const pwaDispensar = () => (pwa.atualizada = false)
