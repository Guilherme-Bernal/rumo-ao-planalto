// Service worker: o jogo abre mesmo sem internet depois da primeira visita.
// Estratégia: rede primeiro (sempre pega a versão nova) e cai para o cache se estiver offline.
const CACHE = 'rap-v2'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './icon-192.png'])).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  // a página principal nunca vem do cache do navegador: assim ela sempre aponta para os arquivos da versão atual
  const net = req.mode === 'navigate' ? fetch(req, { cache: 'no-store' }) : fetch(req)
  e.respondWith(
    net
      .then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
          return res
        }
        // 404/503 num arquivo do jogo: se houver cópia guardada, usa a cópia
        return caches.match(req).then((r) => r || res)
      })
      .catch(() => caches.match(req).then((r) => r || (req.mode === 'navigate' ? caches.match('./') : Response.error()))),
  )
})
