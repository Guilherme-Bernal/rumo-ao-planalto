<script setup>
import { watch } from 'vue'
import { game, country, stageInfo, resetGame, traitNames, partyObj, officeId } from './game/engine'
import { OFFICES } from './game/offices'
const LADDER = Object.values(OFFICES).sort((a, b) => a.rank - b.rank || a.tier - b.tier)
import Scene3D from './components/Scene3D.vue'
import StartScreen from './components/StartScreen.vue'
import StatsPanel from './components/StatsPanel.vue'
import Hub from './components/Hub.vue'
import Sandbox from './components/Sandbox.vue'
const showSandbox = import.meta.env.DEV || new URLSearchParams(location.search).has('sandbox')
import EndScreen from './components/EndScreen.vue'
import { downloadSave } from './game/savefile'

watch(
  () => game.toasts.length,
  (n, o) => {
    if (n > o) setTimeout(() => game.toasts.shift(), 3800)
  },
)

function restart() {
  if (confirm('Abandonar a carreira atual e voltar ao início?')) resetGame()
}
</script>

<template>
  <Scene3D :pop="game.stats.pop" :eco="game.stats.eco" :stage="game.phase === 'start' ? 1 : game.stage" />

  <div class="toasts">
    <div v-for="t in game.toasts" :key="t.id" class="toast">{{ t.msg ? `${t.icon} ${t.msg}` : `🏆 Conquista: ${t.icon} ${t.name}` }}</div>
  </div>

  <StartScreen v-if="game.phase === 'start'" />
  <EndScreen v-else-if="game.phase === 'over' || game.phase === 'end'" />

  <div v-else class="hud">
    <header class="top panel">
      <div>
        <div class="who">{{ country().flag }} {{ game.name }} · {{ stageInfo().office }}
          <span v-if="partyObj()" class="chip" :style="{ background: partyObj().color + '55' }">{{ partyObj().sigla }}</span>
        </div>
        <div class="meta">
          {{ game.city?.name }} ({{ game.region.id }}) · {{ game.archetype.name }} · {{ traitNames() }} ·
          Rodada {{ Math.min(game.turn + 1, stageInfo().turns) }}/{{ stageInfo().turns }}
          <template v-if="game.stage === 3"> · Mandato {{ game.term }}/2</template>
        </div>
        <div class="trail">
          <span v-for="o in LADDER" :key="o.id" :class="{ on: o.id === officeId(), done: o.rank < OFFICES[officeId()].rank }">{{ o.name }}</span>
        </div>
      </div>
      <div class="topbtns">
        <button title="Baixar um arquivo com o seu progresso" @click="downloadSave">💾 Salvar</button>
        <button @click="restart">Reiniciar</button>
      </div>
    </header>
    <StatsPanel class="stats panel" />
    <Hub class="main panel" />
    <Sandbox v-if="showSandbox" />
  </div>
</template>