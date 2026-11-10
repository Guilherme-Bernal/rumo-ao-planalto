<script setup>
import { computed } from 'vue'
import { arcosView } from '../../game/engine'

const lista = computed(() => arcosView())
const nivel = (v) => (v >= 70 ? 'muito próximo' : v >= 45 ? 'cordial' : v >= 30 ? 'frio' : 'rompendo')
</script>

<template>
  <div v-if="lista.length" class="sumbox" style="margin-top: 12px">
    <b>🎭 Personagens com história própria</b>
    <div v-for="x in lista" :key="x.id" class="arco">
      <div><b>{{ x.d.icon }} {{ x.f.nome }}</b> <small class="muted">{{ x.d.titulo }} · fase: {{ x.estagio }}</small></div>
      <small class="muted">{{ x.d.dica }}</small>
      <label v-if="!x.it.fim" class="lb">Laço <small class="muted">{{ nivel(x.it.laco) }}</small>
        <div class="bar" role="img" :aria-label="'Laço com ' + x.f.nome + ' ' + Math.round(x.it.laco) + ' de 100'"><i :style="{ width: x.it.laco + '%', background: x.it.laco < 30 ? 'var(--bad)' : 'var(--good)' }"></i></div>
      </label>
      <p v-else class="muted" style="margin: 2px 0">📜 {{ x.fim }}</p>
      <small v-for="(h, i) in x.it.hist.slice(0, 2)" :key="i" class="muted" style="display: block">r{{ h.r }}: {{ h.t }}</small>
    </div>
  </div>
</template>

<style scoped>
.arco { margin: 10px 0; display: grid; gap: 3px; }
.lb { font-size: .85rem; }
</style>
