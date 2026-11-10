// Carregamento das abas sob demanda sem travar quando o site é atualizado.
// Depois de um deploy, a página antiga pode pedir um arquivo que já não existe (404) ou o servidor pode
// estar trocando de versão (503). Tentamos de novo e, se persistir, recarregamos a página uma vez.
export function importar(f, tentativas = 3) {
  return f().catch((e) => {
    if (tentativas <= 1) throw e
    return new Promise((r) => setTimeout(r, 700 * (4 - tentativas))).then(() => importar(f, tentativas - 1))
  })
}

export function recarregarSeNovaVersao() {
  if (typeof window === 'undefined') return false
  try {
    const k = 'rap-reload'
    const t = Number(sessionStorage.getItem(k) || 0)
    if (Date.now() - t < 60000) return false
    sessionStorage.setItem(k, String(Date.now()))
  } catch {
    /* sem sessionStorage: recarrega mesmo assim, no máximo uma vez por abertura */
  }
  location.reload()
  return true
}

export function chunksInit() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', (ev) => {
    ev.preventDefault()
    recarregarSeNovaVersao()
  })
}
