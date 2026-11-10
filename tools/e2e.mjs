// Teste de ponta a ponta: abre o jogo no navegador, cria o personagem e joga pela interface,
// visitando todas as abas. Falha se aparecer erro de página, erro de console (incluindo
// "Maximum recursive updates") ou se o jogo travar sem avançar.
//
// Uso (precisa do Playwright: npm i -D playwright && npx playwright install chromium):
//   npm run build && npx vite preview --port 4173 &   (ou: npx vite --port 5173)
//   node tools/e2e.mjs [url=http://localhost:4173/] [passos=250] [semente=1]
let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright não encontrado. Instale com: npm i -D playwright && npx playwright install chromium')
  process.exit(2)
}

const URL_ = process.argv[2] || 'http://localhost:4173/'
const PASSOS = Number(process.argv[3] || 250)
let seed = Number(process.argv[4] || 1)
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const problemas = []
page.on('pageerror', (e) => problemas.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error' || /Maximum recursive|\[Vue warn\]/.test(m.text())) problemas.push('console: ' + m.text().slice(0, 240))
})
await page.addInitScript(() => localStorage.setItem('rumo-tutorial-visto', '1'))
await page.goto(URL_)
await page.waitForTimeout(1500)

const clicaTexto = (t) =>
  page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.offsetParent && !x.disabled && x.textContent.trim().includes(t))
    if (b) b.click()
    return !!b
  }, t)

// assistente de criação
for (const t of ['Nova carreira', 'Sortear tudo', 'Próximo', 'Próximo', 'Pedir filiação', 'Próximo', 'Próximo', 'Começar']) {
  await clicaTexto(t)
  await page.waitForTimeout(250)
}

const passo = (modo, r) =>
  page.evaluate(
    ([modo, r]) => {
      const vis = (b) => b.offsetParent && !b.disabled
      const alvo = (lista) => lista.filter(vis)
      const q = (s) => [...document.querySelectorAll(s)]
      if (modo === 'abas') {
        const abas = alvo(q('[role=tab]'))
        if (!abas.length) return 'sem abas'
        abas[Math.floor(r * abas.length)].click()
        return 'aba'
      }
      // progresso: botões "primary" (continuar, avançar, tomar posse...), depois opções de escolha
      const prim = alvo(q('.hud .primary, .screen .primary, .sucessao .primary, .reu .primary'))
      const esc = alvo(q('.choices button, .reu button, .suc-bg button, .deb-bg button'))
      const campo = alvo(q('.main .card button:not(.act):not([role=tab])'))
      const ordem = Math.floor(r * 3)
      const pool = ordem === 0 && esc.length ? esc : prim.length ? prim : esc.length ? esc : campo
      if (!pool.length) return 'nada'
      const b = pool[Math.floor(r * 997) % pool.length]
      b.click()
      return (b.textContent || '').trim().slice(0, 30)
    },
    [modo, r],
  )

let parado = 0
let ultimo = ''
let passosFeitos = 0
for (let i = 0; i < PASSOS; i++) {
  const fim = await page.evaluate(() => !!document.querySelector('.screen .card, .box.card') && !document.querySelector('.hud'))
  if (fim) break
  const acao = await passo(i % 7 === 3 ? 'abas' : 'jogo', rnd())
  passosFeitos++
  await page.waitForTimeout(60)
  const sig = await page.evaluate(() => document.body.innerText.length + ':' + (document.querySelector('.hud') ? 1 : 0))
  parado = sig === ultimo && acao !== 'aba' ? parado + 1 : 0
  ultimo = sig
  if (parado > 40) {
    problemas.push('travou: a tela parou de mudar (última ação: ' + acao + ')')
    break
  }
  if (problemas.length) break
}
const fimTela = await page.evaluate(() => !document.querySelector('.hud'))
if (problemas.length) await page.screenshot({ path: 'e2e-falha.png' })
await browser.close()

console.log(`passos: ${passosFeitos} | terminou na tela final: ${fimTela ? 'sim' : 'não (limite de passos)'} | problemas: ${problemas.length}`)
if (problemas.length) {
  console.error(problemas.join('\n'))
  process.exit(1)
}
