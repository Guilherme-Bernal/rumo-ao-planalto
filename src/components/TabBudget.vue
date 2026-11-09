<script setup>
import { computed } from 'vue'
import { game, STATS, BUDGET_KEYS, BUDGET_PRESETS, budgetRes, setBudget, projectTurn, money } from '../game/engine'

const b = computed(() => game.budget)
const res = computed(() => budgetRes())
const proj = computed(() => projectTurn())
// Cada fatia do orçamento em reais (proporcional ao caixa de referência do cargo)
const reais = (pct) => money(pct * 0.5)
const color = (v) => (v < 30 ? 'var(--bad)' : v < 55 ? 'var(--warn)' : 'var(--good)')
function set(k, v) {
  const next = { ...game.budget, [k]: Number(v) }
  const others = Object.entries(next).filter(([kk]) => kk !== k).reduce((a, [, x]) => a + x, 0)
  if (others + next[k] > 100) next[k] = 100 - others
  // Limite de realidade: serviços (saúde, segurança e obras) não passam de 75% juntos
  const svc = next.soc + next.seg + next.eco
  if (k !== 'com' && svc > 75) next[k] -= svc - 75
  setBudget(next)
}
const fmt = (v) => (Math.abs(v) < 0.05 ? '0.0' : `${v > 0 ? '+' : ''}${v.toFixed(1)}`)
</script>

<template>
  <div>
    <h2>Orçamento da rodada</h2>
    <p class="muted">Divida o dinheiro entre as áreas. O efeito é aplicado sozinho no fim de cada rodada, além das suas ações. A fatia que sobra vira reserva de caixa (gastar mais de 80% custa caixa). Saúde, segurança e obras somam no máximo 75%.</p>

    <div class="presets">
      <button v-for="p in BUDGET_PRESETS" :key="p.id" type="button" :title="p.desc" @click="setBudget(p.b)">{{ p.name }}</button>
    </div>

    <div v-for="k in BUDGET_KEYS" :key="k.k" class="slider">
      <div class="row"><span>{{ k.icon }} {{ k.label }} <small class="muted">({{ k.hint }})</small></span><b>{{ b[k.k] }}% · {{ reais(b[k.k]) }}</b></div>
      <input type="range" min="0" max="50" step="1" :value="b[k.k]" @input="set(k.k, $event.target.value)" />
    </div>
    <div class="slider">
      <div class="row"><span>🏦 Reserva (sobra)</span><b>{{ res }}% · {{ reais(res) }}</b></div>
      <div class="bar"><i :style="{ width: res * 2 + '%', background: 'var(--accent)' }"></i></div>
    </div>

    <h3 class="sub">🔮 Simulação: como ficam seus números no fim desta rodada</h3>
    <p class="legend" style="margin-top: 0">Mostra a mudança esperada somando tudo: desgaste natural, orçamento e vantagens do partido. A economia ainda tem um pouco de sorte.</p>
    <div class="projgrid">
      <div v-for="s in STATS" :key="s.k" class="proj">
        <span>{{ s.icon }} {{ s.short }}</span>
        <span>{{ Math.round(game.stats[s.k]) }} → <b :style="{ color: proj[s.k] >= 0 ? 'var(--good)' : 'var(--bad)' }">{{ Math.round(game.stats[s.k] + proj[s.k]) }}</b> <small :style="{ color: proj[s.k] >= 0 ? 'var(--good)' : 'var(--bad)' }">({{ fmt(proj[s.k]) }})</small></span>
      </div>
    </div>
    <p class="legend">Dica: dá para fazer a simulação de qualquer preset antes de aplicar: clique no preset, veja a projeção e volte atrás se não gostar. Nada acontece até você encerrar a rodada.</p>
  </div>
</template>