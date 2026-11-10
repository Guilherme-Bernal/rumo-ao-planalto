<script setup>
import { computed } from 'vue'
import { game, serieNow, marcasNow } from '../../game/engine'

const W = 340
const H = 170
const X0 = 26
const Y0 = 14
const Y1 = H - 22

const pontos = computed(() => {
  const s = serieNow().filter((r) => r.r != null)
  const fim = { r: game.total, st: game.stage, tm: game.term, pop: game.stats.pop, img: game.stats.img }
  return [...s, fim].sort((a, b) => a.r - b.r)
})
const rmin = computed(() => (pontos.value.length ? pontos.value[0].r : 0))
const rmax = computed(() => (pontos.value.length ? pontos.value[pontos.value.length - 1].r : 1))
const px = (r) => X0 + ((r - rmin.value) / Math.max(1, rmax.value - rmin.value)) * (W - X0 - 8)
const py = (v) => Y0 + (1 - Math.max(0, Math.min(100, v)) / 100) * (Y1 - Y0)
const linha = (k) => pontos.value.map((p, i) => `${i ? 'L' : 'M'}${px(p.r).toFixed(1)},${py(p[k]).toFixed(1)}`).join(' ')
const popEm = (r) => {
  const ps = pontos.value
  let b = ps[0]
  for (const p of ps) if (Math.abs(p.r - r) < Math.abs(b.r - r)) b = p
  return b.pop
}
const marcas = computed(() => marcasNow().filter((m) => m.r >= rmin.value && m.r <= rmax.value + 1))
const eleicoes = computed(() => marcas.value.filter((m) => m.tipo === 'eleicao'))
const escandalos = computed(() => marcas.value.filter((m) => m.tipo === 'escandalo'))
// faixas por mandato (troca de cargo ou de termo)
const faixas = computed(() => {
  const ps = pontos.value
  const out = []
  let ini = 0
  for (let i = 1; i <= ps.length; i++) {
    if (i === ps.length || ps[i].st !== ps[ini].st || ps[i].tm !== ps[ini].tm) {
      out.push({ a: ps[ini].r, b: ps[i - 1].r, n: out.length + 1 })
      ini = i
    }
  }
  return out
})
const pico = computed(() => pontos.value.reduce((b, p) => (p.pop > b.pop ? p : b), pontos.value[0]))
const fundo = computed(() => pontos.value.reduce((b, p) => (p.pop < b.pop ? p : b), pontos.value[0]))
const queda = computed(() => {
  let m = { d: 0, r: 0 }
  for (let i = 1; i < pontos.value.length; i++) {
    const d = pontos.value[i].pop - pontos.value[i - 1].pop
    if (d < m.d) m = { d, r: pontos.value[i].r }
  }
  return m
})
const vit = computed(() => eleicoes.value.filter((m) => m.ok).length)
const alt = computed(() => `Linha do tempo da carreira: popularidade de ${Math.round(pontos.value[0].pop)} a ${Math.round(pontos.value[pontos.value.length - 1].pop)}, ${eleicoes.value.length} eleição(ões) e ${escandalos.value.length} escândalo(s).`)
</script>

<template>
  <section v-if="pontos.length > 3" class="sumbox cl">
    <b>🧭 Linha do tempo da carreira</b>
    <svg :viewBox="`0 0 ${W} ${H}`" class="cl-svg" role="img" :aria-label="alt">
      <rect v-for="f in faixas" :key="'f' + f.n" :x="px(f.a)" :y="Y0" :width="Math.max(2, px(f.b) - px(f.a))" :height="Y1 - Y0" :class="f.n % 2 ? 'fa' : 'fb'" />
      <text v-for="f in faixas" :key="'t' + f.n" :x="px(f.a) + 3" :y="Y0 + 9" class="ax">M{{ f.n }}</text>
      <g class="grid">
        <template v-for="v in [0, 50, 100]" :key="v">
          <line :x1="X0" :x2="W - 8" :y1="py(v)" :y2="py(v)" />
          <text :x="X0 - 4" :y="py(v) + 3" text-anchor="end">{{ v }}</text>
        </template>
      </g>
      <path :d="linha('img')" fill="none" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="4 3" />
      <path :d="linha('pop')" fill="none" stroke="#f472b6" stroke-width="2.2" stroke-linejoin="round" />
      <g v-for="(m, i) in eleicoes" :key="'e' + i">
        <line :x1="px(m.r)" :x2="px(m.r)" :y1="Y0" :y2="Y1" :stroke="m.ok ? '#4ade80' : '#f87171'" stroke-width="1.5" />
        <text :x="px(m.r)" :y="Y1 + 11" text-anchor="middle" :fill="m.ok ? '#4ade80' : '#f87171'" font-size="10">{{ m.ok ? '✔' : '✘' }}</text>
      </g>
      <polygon v-for="(m, i) in escandalos" :key="'s' + i" :points="`${px(m.r)},${py(popEm(m.r)) - 9} ${px(m.r) - 4},${py(popEm(m.r)) - 2} ${px(m.r) + 4},${py(popEm(m.r)) - 2}`" fill="#ef4444" stroke="#0b1020" stroke-width="0.5" />
      <text :x="X0" :y="H - 2" class="ax">início</text>
      <text :x="W - 8" :y="H - 2" text-anchor="end" class="ax">fim</text>
    </svg>
    <p class="legend">Rosa: popularidade · laranja tracejado: imagem · ✔/✘: eleições · 🔺 escândalos · faixas: M1, M2... são os mandatos</p>
    <div class="cl-res">
      <span class="chip up">🗳️ {{ vit }} vitória(s) em {{ eleicoes.length }} eleição(ões)</span>
      <span class="chip" :class="escandalos.length ? 'down' : 'up'">🔺 {{ escandalos.length }} escândalo(s)</span>
      <span class="chip up">📈 pico {{ Math.round(pico.pop) }} (rodada {{ pico.r }})</span>
      <span class="chip down">📉 fundo {{ Math.round(fundo.pop) }} (rodada {{ fundo.r }})</span>
      <span v-if="queda.d < -2" class="chip down">⚠️ maior queda: {{ Math.round(queda.d) }} na rodada {{ queda.r }}</span>
    </div>
    <details v-if="marcas.length" class="cl-tab">
      <summary>Ver os momentos como lista</summary>
      <ul>
        <li v-for="(m, i) in marcas" :key="i">Rodada {{ m.r }}: {{ m.tipo === 'eleicao' ? '🗳️' : '🔺' }} {{ m.txt }}</li>
      </ul>
    </details>
  </section>
</template>

<style scoped>
.cl-svg { width: 100%; height: auto; display: block; margin-top: 6px; }
.fa { fill: currentColor; opacity: 0.05; }
.fb { fill: currentColor; opacity: 0.1; }
.grid line { stroke: currentColor; opacity: 0.14; }
.grid text, .ax { fill: currentColor; opacity: 0.6; font-size: 8px; }
.cl-res { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.cl-tab { margin-top: 8px; font-size: 0.85em; }
</style>
