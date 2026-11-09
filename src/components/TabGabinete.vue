<script setup>
import { game, DEALS, STUDIES, MAX_DEALS, STUDY_MAX, studyNeed, knowLvl, breakDeal, powerLevel, STATS } from '../game/engine'

const emit = defineEmits(['go'])
const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const dealOf = (id) => DEALS.find((d) => d.id === id)
const fmt = (fx) => Object.entries(fx).map(([k, v]) => `${v > 0 ? '+' : ''}${String(v).replace('.', ',')} ${short[k]}`).join(', ')
</script>

<template>
  <div>
    <h2>🏛️ Gabinete</h2>
    <p class="lead">Aqui ficam seus acordos, seus estudos e o quanto de poder você concentrou. Tudo isso é feito na Agenda, usando suas 2 ações da rodada.</p>

    <div class="sumbox">
      <b>🤝 Acordos ativos ({{ (game.deals || []).length }}/{{ MAX_DEALS }})</b>
      <p v-if="!(game.deals || []).length" class="muted">Nenhum acordo. Na Agenda, marque "Negociar um acordo" no calendário.</p>
      <div v-for="x in game.deals" :key="x.id" class="gab-row">
        <div>
          <b>{{ dealOf(x.id).icon }} {{ dealOf(x.id).name }}</b>
          <small class="muted">{{ dealOf(x.id).scope === 'internacional' ? '🌍 internacional' : '🇧🇷 nacional' }} · faltam {{ x.left }} rodada(s)</small>
          <small>Por rodada: {{ fmt(dealOf(x.id).perk) }}</small>
        </div>
        <button @click="breakDeal(x.id)" title="Romper custa imagem e base">Romper</button>
      </div>
    </div>

    <div class="sumbox" style="margin-top: 10px">
      <b>📚 Conhecimento</b>
      <div v-for="s in STUDIES" :key="s.id" class="gab-row">
        <div>
          <b>{{ s.icon }} {{ s.name }}</b>
          <small class="muted">{{ s.up }}</small>
        </div>
        <div class="gab-side">
          <span class="gab-lv"><i v-for="n in STUDY_MAX" :key="n" :class="{ on: n <= knowLvl(s.id) }"></i></span>
          <small class="muted">{{ knowLvl(s.id) >= STUDY_MAX ? 'máximo' : `${game.xp[s.id] || 0}/${studyNeed(knowLvl(s.id))}` }}</small>
        </div>
      </div>
    </div>

    <div class="sumbox" style="margin-top: 10px">
      <b>👑 Poder concentrado: {{ powerLevel() }} ({{ game.power }}/100)</b>
      <div class="bar"><i :style="{ width: game.power + '%', background: game.power >= 60 ? 'var(--bad)' : game.power >= 30 ? 'var(--warn)' : 'var(--good)' }"></i></div>
      <p class="muted" v-if="game.stage < 2">Ações de poder aparecem a partir do governo do estado e, com mais força, na Presidência.</p>
      <p class="muted" v-else>Ações como governar por decreto, controlar a imprensa e cooptar as Forças Armadas aumentam o poder e liberam jogadas mais ousadas (fechar o Congresso, terceiro mandato e a tomada do poder). Poder alto atrai investigação, e ele cai devagar a cada rodada.</p>
    </div>
    <button class="primary" style="width: 100%; margin-top: 12px" @click="emit('go', 'agenda')">Ir para a Agenda</button>
  </div>
</template>