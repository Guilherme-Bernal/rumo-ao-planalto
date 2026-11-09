<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { game, stageInfo, targetOffice } from '../game/engine'
import GamePanel from './GamePanel.vue'
import TabMap from './TabMap.vue'
import TabParty from './TabParty.vue'
import TabPlan from './TabPlan.vue'
import TabBudget from './TabBudget.vue'
import TabRace from './TabRace.vue'
import TabSocial from './TabSocial.vue'
import TabIdeas from './TabIdeas.vue'
import TabContacts from './TabContacts.vue'
import TabMundo from './TabMundo.vue'
import TabLeis from './TabLeis.vue'
import Tips from './Tips.vue'

const tab = ref('agenda')
const root = ref(null)
watch(() => [game.phase, game.turn, tab.value], async () => {
  await nextTick()
  let el = root.value
  while (el && el.scrollHeight <= el.clientHeight + 1) el = el.parentElement
  if (el) el.scrollTop = 0
})
const locked = computed(() => ['balance', 'rumo', 'campaign', 'runoff', 'result', 'plan'].includes(game.phase))
const cur = computed(() => (locked.value ? 'agenda' : tab.value))
const pending = computed(() => game.phase === 'event' || game.phase === 'outcome')

const tabs = computed(() => [
  { id: 'agenda', label: '📋 Agenda', dot: pending.value && tab.value !== 'agenda' },
  { id: 'disputa', label: '🗳️ Disputa' },
  { id: 'redes', label: '📱 Redes' },
  { id: 'ideias', label: '💡 Ideias' },
  { id: 'contatos', label: '👥 Contatos', badge: game.approach && !game.approach.done ? 1 : 0 },
  { id: 'orcamento', label: '💰 Orçamento' },
  { id: 'partido', label: '🎗️ Partido', badge: game.invites.length },
  { id: 'plano', label: '📜 Plano' },
  { id: 'mundo', label: '🌍 Mundo', badge: game.world && game.world.wars.length ? game.world.wars.length : 0 },
  { id: 'leis', label: '⚖️ Leis' },
  { id: 'mapa', label: '🗺️ Mapa' },
])

const left = computed(() => stageInfo().turns - game.turn)
const todo = computed(() => {
  switch (game.phase) {
    case 'event': return '1/3 · Um evento aconteceu. Leia e escolha como reagir.'
    case 'outcome': return '2/3 · Veja a repercussão na imprensa e clique em Continuar.'
    case 'actions': return `3/3 · Marque até 2 ações no calendário (${game.ap} restantes). Depois clique em Avançar o tempo.`
    case 'recap': return 'O tempo passou. Veja o que aconteceu e siga em frente.'
    case 'balance': return 'O mandato acabou. Veja o balanço antes da eleição.'
    case 'rumo': return 'Escolha o próximo passo da carreira.'
    case 'campaign': return 'Eleição! Feche a chapa (se o cargo exigir) e escolha o tamanho da campanha.'
    case 'runoff': return 'Segundo turno! Escolha como decidir a disputa.'
    case 'result': return 'O resultado saiu.'
    case 'plan': return 'Monte o plano de governo do novo mandato.'
    default: return ''
  }
})
</script>

<template>
  <div ref="root" class="hub">
    <div class="goal">
      <div>
        🎯 <b>Meta:</b> <template v-if="game.election && game.election.target">ser eleito(a) {{ targetOffice() === 'Reeleição' ? 'para a reeleição' : targetOffice() }}.</template><template v-else>terminar o mandato de {{ stageInfo().office }} e escolher o próximo passo da carreira.</template>
        <span v-if="!locked">Faltam <b>{{ left }}</b> rodada{{ left === 1 ? '' : 's' }} neste mandato.</span>
      </div>
      <div class="todo">👉 {{ todo }}</div>
    </div>
    <details v-if="game.total === 0 && game.phase === 'event'" open class="howto">
      <summary>Como jogar (fechar)</summary>
      <ul>
        <li>Cada <b>rodada</b> é um período do calendário: 1 evento + até 2 ações marcadas nos meses. As barras à esquerda são seus números.</li>
        <li>Se <b>Popularidade</b> ou <b>Caixa</b> zerarem, a carreira acaba.</li>
        <li>No fim do mandato há <b>eleição</b>. Quem tem mais popularidade, imagem, economia e promessas cumpridas ganha.</li>
        <li>As abas servem para <b>Disputa</b> (ranking), <b>Redes</b>, <b>Orçamento</b>, <b>Partido</b>, <b>Plano</b> e <b>Mapa</b>.</li>
      </ul>
    </details>
    <nav v-if="!locked" class="tabs">
      <button v-for="t in tabs" :key="t.id" :class="{ on: cur === t.id }" @click="tab = t.id">
        {{ t.label }}<span v-if="t.badge" class="badge">{{ t.badge }}</span><span v-if="t.dot" class="badge">!</span>
      </button>
    </nav>
    <div class="tabbody">
      <GamePanel v-if="cur === 'agenda'" />
      <TabRace v-else-if="cur === 'disputa'" />
      <TabSocial v-else-if="cur === 'redes'" />
      <TabIdeas v-else-if="cur === 'ideias'" @go="tab = $event" />
      <TabContacts v-else-if="cur === 'contatos'" @go="tab = $event" />
      <TabBudget v-else-if="cur === 'orcamento'" />
      <TabParty v-else-if="cur === 'partido'" />
      <TabPlan v-else-if="cur === 'plano'" />
      <TabMundo v-else-if="cur === 'mundo'" />
      <TabLeis v-else-if="cur === 'leis'" />
      <TabMap v-else-if="cur === 'mapa'" />
    </div>
  </div>
</template>