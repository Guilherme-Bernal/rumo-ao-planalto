<script setup>
import { game, STATS, money } from '../game/engine'
import { SPHERES } from '../game/ideas'

const color = (v) => (v < 30 ? 'var(--bad)' : v < 55 ? 'var(--warn)' : 'var(--good)')
const d = (k) => Math.round(game.delta[k] || 0)
</script>

<template>
  <aside>
    <div v-for="s in STATS" :key="s.k" class="stat" :title="s.tip">
      <div class="row">
        <span>{{ s.icon }} {{ s.label }}</span>
        <span>
          <template v-if="s.k === 'cash'"><small class="muted">{{ money(game.stats.cash) }}</small> </template>
          {{ Math.round(game.stats[s.k]) }}
          <span v-if="d(s.k)" class="delta" :class="d(s.k) > 0 ? 'up' : 'down'">{{ d(s.k) > 0 ? '+' : '' }}{{ d(s.k) }}</span>
        </span>
      </div>
      <div class="bar"><i :style="{ width: game.stats[s.k] + '%', background: color(game.stats[s.k]) }"></i></div>
    </div>
    <div v-if="game.heat > 3" class="stat" title="Pressão da Justiça. Escolhas sujas esquentam a investigação. Quando passa de um ponto, pode vir uma operação.">
      <div class="row"><span>🕵️ Investigação</span><span :class="game.heat >= 55 ? 'down' : game.heat >= 25 ? 'warn' : 'muted'">{{ game.heat >= 55 ? 'alta' : game.heat >= 25 ? 'média' : 'baixa' }}</span></div>
      <div class="bar"><i :style="{ width: game.heat + '%', background: game.heat >= 55 ? 'var(--bad)' : game.heat >= 25 ? 'var(--warn)' : 'var(--good)' }"></i></div>
    </div>
    <div class="stat spheres" title="Sua fama em cada esfera. A esfera da próxima eleição pesa mais.">
      <div class="row"><span>🧭 Esferas</span><span class="muted">fama</span></div>
      <div v-for="sp in SPHERES" :key="sp.k" class="srow">
        <span>{{ sp.icon }}</span>
        <div class="bar"><i :style="{ width: game.fame[sp.k] + '%', background: color(game.fame[sp.k]) }"></i></div>
        <b>{{ Math.round(game.fame[sp.k]) }}</b>
      </div>
      <div class="row" style="margin-top: 4px"><span>💡 Ideias</span><span>{{ Math.round(game.ideas.force) }}</span></div>
      <div class="bar"><i :style="{ width: game.ideas.force + '%', background: color(game.ideas.force) }"></i></div>
    </div>
    <div class="diary">
      <div v-for="(l, i) in game.log.slice(0, 6)" :key="i">· {{ l }}</div>
    </div>
  </aside>
</template>