<script setup>
import { game, planStatus, STATS } from '../../game/engine'

const status = () => planStatus()
const label = (p) => STATS.find((s) => s.k === p.stat)?.label
</script>

<template>
  <div>
    <h2>📜 {{ game.plan.name }}</h2>
    <p class="muted">Suas promessas para este mandato. No fim, cumprir rende +2 na eleição, quebrar custa -2,5 por promessa.</p>
    <p v-if="!status().length" class="lead" style="margin-top: 10px">Você não fez promessas neste mandato. Menos risco, mas também menos votos.</p>
    <div v-for="s in status()" :key="s.p.id" class="pcard" :class="{ sel: s.kept }">
      <div class="phead"><b>{{ s.p.icon }} {{ s.p.name }}</b><span class="chip" :class="s.kept ? 'up' : 'down'">{{ s.kept ? 'No caminho' : 'Em risco' }}</span></div>
      <small class="muted">{{ s.p.desc }}</small>
      <template v-if="!s.p.special">
        <div class="row" style="margin-top: 6px"><small>{{ label(s.p) }}: {{ Math.round(s.value) }} / meta {{ s.p.goal }}</small></div>
        <div class="bar"><i :style="{ width: Math.min(100, (s.value / s.p.goal) * 100) + '%', background: s.kept ? 'var(--good)' : 'var(--warn)' }"></i></div>
      </template>
      <small v-else class="muted">Escândalos neste mandato: {{ game.termDirty }}</small>
    </div>
  </div>
</template>