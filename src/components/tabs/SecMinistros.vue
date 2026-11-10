<script setup>
import { computed } from 'vue'
import { game, pastasNow, minNow, isExec } from '../../game/engine'

const lista = computed(() => (isExec() ? pastasNow().map((p) => ({ p, m: minNow(p.id) })).filter((x) => x.m) : []))
const nivel = (v) => (v >= 70 ? 'leal' : v >= 45 ? 'estável' : v >= 30 ? 'insatisfeito' : 'rompendo')
</script>

<template>
  <div v-if="lista.length" class="sumbox" style="margin-top: 10px">
    <b>🗂️ Humor do gabinete</b>
    <p class="muted" style="margin: 4px 0">Cada ministro tem agenda própria. Lealdade baixa leva a pedidos, saídas com discurso, traição ou candidatura rival.</p>
    <div v-for="x in lista" :key="x.p.id" class="mrow">
      <div><b>{{ x.p.icon }} {{ x.m.nome }}</b> <small class="muted">{{ x.p.name }} · {{ x.m.perfil }}</small></div>
      <small class="muted">Agenda: {{ x.m.agenda }}</small>
      <label class="bar-l">Lealdade <small class="muted">{{ nivel(x.m.lealdade) }}</small>
        <div class="bar"><i :style="{ width: x.m.lealdade + '%', background: x.m.lealdade < 35 ? 'var(--bad)' : 'var(--good)' }"></i></div>
      </label>
    </div>
  </div>
</template>

<style scoped>
.mrow { margin: 8px 0; display: grid; gap: 2px; }
.bar-l { font-size: .85rem; }
</style>
