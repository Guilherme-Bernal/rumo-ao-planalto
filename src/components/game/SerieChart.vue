<script setup>
import { computed, ref } from 'vue'
import { game, STATS, serieNow } from '../../game/engine'

// escopo: 'mandato' = só o mandato atual; 'carreira' = tudo
const props = defineProps({ escopo: { type: String, default: 'mandato' }, titulo: { type: String, default: '📊 Seu mandato em números' } })

const COR = { pop: '#f472b6', eco: '#4ade80', cash: '#facc15', soc: '#38bdf8', seg: '#a78bfa', img: '#fb923c', cong: '#94a3b8' }
const on = ref(['pop', 'eco', 'cash', 'img'])
const toggle = (k) => {
  const i = on.value.indexOf(k)
  if (i >= 0) on.value.length > 1 && on.value.splice(i, 1)
  else on.value.push(k)
}

const rows = computed(() => {
  const all = serieNow()
  const fim = { t: game.turn, st: game.stage, tm: game.term, pop: game.stats.pop, eco: game.stats.eco, cash: game.stats.cash, soc: game.stats.soc, seg: game.stats.seg, img: game.stats.img, cong: game.stats.cong }
  const base = props.escopo === 'carreira' ? all : all.filter((r) => r.st === game.stage && r.tm === game.term)
  return [...base, fim]
})
const W = 320
const H = 130
const X0 = 26
const px = (i) => X0 + (rows.value.length <= 1 ? 0 : (i / (rows.value.length - 1)) * (W - X0 - 6))
const py = (v) => 8 + (1 - Math.max(0, Math.min(100, v)) / 100) * (H - 22)
const path = (k) => rows.value.map((r, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(r[k]).toFixed(1)}`).join(' ')
// marcas de troca de cargo/mandato (só na carreira)
const marcas = computed(() => {
  const m = []
  rows.value.forEach((r, i) => {
    const a = rows.value[i - 1]
    if (a && (a.st !== r.st || a.tm !== r.tm)) m.push(i)
  })
  return m
})
const resumo = computed(() => {
  const r = rows.value
  if (r.length < 2) return []
  const a = r[0]
  const z = r[r.length - 1]
  return STATS.filter((s) => s.k !== 'cong').map((s) => ({ ...s, de: Math.round(a[s.k]), para: Math.round(z[s.k]), d: Math.round(z[s.k] - a[s.k]) }))
})
const melhor = computed(() => (rows.value.length > 1 ? rows.value.reduce((b, r, i) => (r.pop > rows.value[b].pop ? i : b), 0) : -1))
const pior = computed(() => (rows.value.length > 1 ? rows.value.reduce((b, r, i) => (r.pop < rows.value[b].pop ? i : b), 0) : -1))
const alt = computed(() => `Gráfico de linhas com ${rows.value.length} pontos. ` + resumo.value.map((s) => `${s.short} foi de ${s.de} para ${s.para}`).join('; '))
</script>

<template>
  <section v-if="rows.length > 2" class="serie sumbox">
    <b>{{ titulo }}</b>
    <div class="serie-chips" role="group" aria-label="Escolher números no gráfico">
      <button v-for="s in STATS" :key="s.k" type="button" class="chip" :class="{ off: !on.includes(s.k) }" :aria-pressed="on.includes(s.k)" :style="on.includes(s.k) ? { borderColor: COR[s.k] } : {}" @click="toggle(s.k)">
        <i :style="{ background: COR[s.k] }"></i>{{ s.short }}
      </button>
    </div>
    <svg :viewBox="`0 0 ${W} ${H}`" class="serie-svg" role="img" :aria-label="alt">
      <g class="grid">
        <template v-for="v in [0, 25, 50, 75, 100]" :key="v">
          <line :x1="X0" :x2="W - 6" :y1="py(v)" :y2="py(v)" />
          <text :x="X0 - 4" :y="py(v) + 3" text-anchor="end">{{ v }}</text>
        </template>
      </g>
      <line v-for="i in marcas" :key="'m' + i" :x1="px(i)" :x2="px(i)" y1="6" :y2="H - 14" class="marca" />
      <path v-for="k in on" :key="k" :d="path(k)" fill="none" :stroke="COR[k]" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      <circle v-if="melhor >= 0" :cx="px(melhor)" :cy="py(rows[melhor].pop)" r="3.5" fill="#4ade80" stroke="#0b1020" />
      <circle v-if="pior >= 0 && pior !== melhor" :cx="px(pior)" :cy="py(rows[pior].pop)" r="3.5" fill="#f87171" stroke="#0b1020" />
      <text :x="X0" :y="H - 2" class="ax">início</text>
      <text :x="W - 6" :y="H - 2" text-anchor="end" class="ax">agora</text>
    </svg>
    <p v-if="melhor >= 0" class="legend">🟢 pico de popularidade ({{ Math.round(rows[melhor].pop) }}) · 🔴 pior momento ({{ Math.round(rows[pior].pop) }})</p>
    <div class="serie-res">
      <span v-for="s in resumo" :key="s.k" class="chip" :class="s.d > 0 ? 'up' : s.d < 0 ? 'down' : ''">{{ s.icon }} {{ s.short }} {{ s.de }}→{{ s.para }} ({{ s.d > 0 ? '+' : '' }}{{ s.d }})</span>
    </div>
    <details class="serie-tab">
      <summary>Ver como tabela</summary>
      <table>
        <thead><tr><th>Rodada</th><th v-for="s in STATS" :key="s.k">{{ s.short }}</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i"><td>{{ i + 1 }}</td><td v-for="s in STATS" :key="s.k">{{ Math.round(r[s.k]) }}</td></tr>
        </tbody>
      </table>
    </details>
  </section>
</template>

<style scoped>
.serie-chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0 4px; }
.serie-chips .chip { cursor: pointer; display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--line, #334); background: transparent; color: inherit; min-height: 0; padding: 2px 8px; }
.serie-chips .chip.off { opacity: 0.45; }
.serie-chips i { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
.serie-svg { width: 100%; height: auto; display: block; }
.grid line { stroke: currentColor; opacity: 0.14; }
.grid text, .ax { fill: currentColor; opacity: 0.6; font-size: 8px; }
.marca { stroke: currentColor; opacity: 0.3; stroke-dasharray: 3 3; }
.serie-res { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
.serie-tab { margin-top: 8px; font-size: 0.85em; }
.serie-tab table { width: 100%; border-collapse: collapse; margin-top: 6px; text-align: center; }
.serie-tab th, .serie-tab td { padding: 2px 4px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
</style>
