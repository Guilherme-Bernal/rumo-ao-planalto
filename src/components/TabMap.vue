<script setup>
import { ref, computed } from 'vue'
import { game, country, stateEstimates, stageInfo } from '../game/engine'
import BrazilMap from './BrazilMap.vue'

const est = computed(() => stateEstimates())
const sel = ref(null)
const colors = computed(() => {
  const o = {}
  for (const [k, v] of Object.entries(est.value)) o[k] = v < 45 ? '#b4474d' : v < 50 ? '#c98a3d' : v < 55 ? '#9aa84a' : '#3f9d66'
  return o
})
const info = computed(() => {
  const r = country().regions.find((x) => x.mapId === (sel.value || game.region.mapId))
  return r ? { r, share: est.value[r.mapId] } : null
})
const leanText = (l) => (l < -0.4 ? 'tende à esquerda' : l > 0.4 ? 'tende à direita' : 'dividido')
</script>

<template>
  <div>
    <h2>Mapa eleitoral</h2>
    <p class="muted">Você começou em <b>{{ game.city.name }}</b> ({{ game.region.name }}). Cargo atual: {{ stageInfo().office }}. As cores mostram uma <b>estimativa de votos por estado</b> se a eleição fosse hoje: seu perfil agrada mais em alguns lugares do que em outros.</p>
    <BrazilMap interactive :selected="sel || game.region.mapId" :home="game.region.mapId" :colors="colors" @select="sel = $event" />
    <div class="legendmap">
      <span><i style="background: #b4474d"></i>abaixo de 45%</span>
      <span><i style="background: #c98a3d"></i>45-50%</span>
      <span><i style="background: #9aa84a"></i>50-55%</span>
      <span><i style="background: #3f9d66"></i>55% ou mais</span>
    </div>
    <div v-if="info" class="sumbox">
      <b>{{ info.r.name }}<template v-if="info.r.id === game.region.id"> (seu estado)</template></b>
      <p class="muted">Estimativa: {{ info.share.toFixed(1) }}% · eleitorado {{ leanText(info.r.lean || 0) }} · peso eleitoral +{{ info.r.bonus }}</p>
    </div>
    <p class="legend">Mapa: <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener">svg-maps</a> (CC BY 4.0). A estimativa é aproximada e serve para orientar a estratégia.</p>
  </div>
</template>