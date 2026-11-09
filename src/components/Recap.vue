<script setup>
import { game, STATS, continueRecap } from '../game/engine'
import { fmtMonth } from '../game/social'

const lab = Object.fromEntries(STATS.map((s) => [s.k, s]))
</script>

<template>
  <div v-if="game.recap">
    <h2>⏳ O tempo passa</h2>
    <p class="lead">De {{ fmtMonth(game.recap.from) }} a {{ fmtMonth(game.recap.to) }}.</p>
    <ol class="tl">
      <li v-for="(m, i) in game.recap.months" :key="m.abs" :style="{ animationDelay: i * 0.18 + 's' }">
        <div class="when"><span>{{ fmtMonth(m.abs) }}</span><small v-if="m.holiday"> · {{ m.holiday }}</small></div>
        <div class="what">
          <div v-for="(it, j) in m.items" :key="j" :class="it.kind"><span>{{ it.icon }}</span> {{ it.text }}</div>
        </div>
      </li>
    </ol>
    <div class="sumbox">
      <b>Balanço do período</b>
      <div style="margin-top: 6px">
        <span v-for="(v, k) in game.recap.diff" :key="k" class="chip" :class="v > 0 ? 'up' : 'down'">{{ lab[k].icon }} {{ lab[k].short }} {{ v > 0 ? '+' : '' }}{{ v }}</span>
        <span v-if="!Object.keys(game.recap.diff).length" class="muted">Sem grandes mudanças.</span>
      </div>
    </div>
    <button class="primary" style="width: 100%; margin-top: 12px" @click="continueRecap">Seguir em frente</button>
  </div>
</template>