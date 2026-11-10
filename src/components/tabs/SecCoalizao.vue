<script setup>
import { ref, computed } from 'vue'
import { game, coalNow, coalBasePct, coalMaioria, agendaDe, statusDe, coalAcoes, coalAcaoMotivo, coalAcao } from '../../game/engine'

const c = computed(() => coalNow())
const pct = computed(() => coalBasePct())
const msg = ref('')
const say = (x) => { msg.value = x ? x.txt : '' }

// parlamentômetro: 100 cadeiras em 5 fileiras semicirculares, agrupadas por partido (da esquerda para a direita)
const pontos = computed(() => {
  if (!c.value) return []
  const lista = [...c.value.partidos].sort((a, b) => (a.status === 'base' ? 0 : a.status === 'neutro' ? 1 : 2) - (b.status === 'base' ? 0 : b.status === 'neutro' ? 1 : 2))
  const total = lista.reduce((a, x) => a + x.cad, 0)
  const rows = [8, 12, 16, 20, 24]
  const n = rows.reduce((a, x) => a + x, 0)
  const pts = []
  rows.forEach((cnt, ri) => {
    const r = 60 + ri * 22
    for (let i = 0; i < cnt; i++) {
      const ang = Math.PI - (Math.PI * (i + 0.5)) / cnt
      pts.push({ ang, x: 150 + r * Math.cos(ang), y: 140 - r * Math.sin(ang) })
    }
  })
  pts.sort((a, b) => b.ang - a.ang)
  const out = []
  let k = 0
  for (const x of lista) {
    const q = Math.round((x.cad / total) * n)
    for (let j = 0; j < q && k < pts.length; j++, k++) out.push({ ...pts[k], cor: x.cor, st: x.status, sigla: x.sigla })
  }
  while (k < pts.length) { out.push({ ...pts[k], cor: '#888', st: 'neutro', sigla: '' }); k++ }
  return out
})
const resumo = computed(() => (c.value ? c.value.partidos.map((x) => `${x.sigla} ${x.cad}% ${statusDe(x.status).nome}`).join(', ') : ''))
</script>

<template>
  <div v-if="c" class="sumbox" style="margin: 10px 0">
    <b>🗳️ Coalizão no Legislativo</b>
    <p class="muted" style="margin: 4px 0">Sua base cobre <b>{{ pct }}%</b> das cadeiras ponderadas (o seu partido pesa mais). <b :style="{ color: coalMaioria() ? 'var(--good)' : 'var(--bad)' }">{{ coalMaioria() ? 'Você tem maioria.' : 'Você está sem maioria.' }}</b></p>
    <svg viewBox="0 0 300 150" class="pm" role="img" :aria-label="'Parlamentômetro. ' + resumo">
      <circle v-for="(p, i) in pontos" :key="i" :cx="p.x" :cy="p.y" r="6" :fill="p.cor" :opacity="p.st === 'oposicao' ? 0.35 : 1" :stroke="p.st === 'base' ? '#fff' : 'none'" stroke-width="1.5" />
      <text x="150" y="132" text-anchor="middle" font-size="22" fill="currentColor" font-weight="700">{{ pct }}%</text>
    </svg>
    <small class="muted">Contorno branco = na base · opaco = independente · apagado = oposição</small>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="x in c.partidos" :key="x.id" class="prow">
      <div class="phead">
        <span class="sw" :style="{ background: x.cor }"></span>
        <b>{{ x.sigla }}</b> <span class="chip">{{ x.cad }}%</span>
        <span class="chip">{{ statusDe(x.status).icon }} {{ statusDe(x.status).nome }}</span>
        <span v-if="x.own" class="chip up">seu partido</span>
        <span v-if="x.aliado" class="chip up">aliado de campanha</span>
      </div>
      <small class="muted">{{ agendaDe(x.agenda).icon }} Agenda: {{ agendaDe(x.agenda).nome }} ({{ agendaDe(x.agenda).txt }})</small>
      <div class="bar" role="img" :aria-label="'Humor do ' + x.sigla + ' ' + Math.round(x.humor) + ' de 100'"><i :style="{ width: x.humor + '%', background: x.humor < 30 ? 'var(--bad)' : 'var(--good)' }"></i></div>
      <div class="pbtn">
        <button v-for="a in coalAcoes()" :key="a.id" type="button" class="mini" :disabled="!!coalAcaoMotivo(a.id, x.id)" :title="coalAcaoMotivo(a.id, x.id) || a.desc" @click="say(coalAcao(a.id, x.id))">{{ a.icon }} {{ a.name }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pm { width: 100%; max-width: 420px; display: block; margin: 6px auto 0; }
.prow { margin: 10px 0; display: grid; gap: 3px; }
.phead { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.sw { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
.pbtn { display: flex; gap: 6px; flex-wrap: wrap; }
</style>
