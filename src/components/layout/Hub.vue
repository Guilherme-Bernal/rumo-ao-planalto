<script setup>
import { ref, computed, watch, nextTick, defineAsyncComponent, h } from 'vue'
import { game, stageInfo, targetOffice, pendenciasNow } from '../../game/engine'
import GamePanel from '../game/GamePanel.vue'
import GuiaAba from './GuiaAba.vue'
import Tips from './Tips.vue'
import { importar, recarregarSeNovaVersao } from '../../game/chunks'
import { dicaPendente, dicaVista } from '../../game/dicas'
// abas pesadas carregam só quando abertas (a tela inicial fica bem mais leve)
const aba = (f) =>
  defineAsyncComponent({
    loader: () => importar(f).catch((e) => { recarregarSeNovaVersao(); throw e }),
    delay: 150,
    timeout: 30000,
    loadingComponent: { render: () => h('p', { class: 'muted' }, 'Carregando…') },
    errorComponent: { render: () => h('p', { class: 'aviso bad', role: 'alert' }, ['Não deu para carregar esta aba. Pode ser uma versão nova do jogo. ', h('button', { type: 'button', class: 'mini', onClick: () => location.reload() }, 'Recarregar')]) },
  })
const TabMap = aba(() => import('../tabs/TabMap.vue'))
const TabParty = aba(() => import('../tabs/TabParty.vue'))
const TabPlan = aba(() => import('../tabs/TabPlan.vue'))
const TabBudget = aba(() => import('../tabs/TabBudget.vue'))
const TabRace = aba(() => import('../tabs/TabRace.vue'))
const TabSocial = aba(() => import('../tabs/TabSocial.vue'))
const TabIdeas = aba(() => import('../tabs/TabIdeas.vue'))
const TabContacts = aba(() => import('../tabs/TabContacts.vue'))
const TabMundo = aba(() => import('../tabs/TabMundo.vue'))
const TabLeis = aba(() => import('../tabs/TabLeis.vue'))

const tab = ref('agenda')
const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches
const root = ref(null)
watch(() => [game.phase, game.turn, tab.value], async () => {
  await nextTick()
  let el = root.value
  while (el && el.scrollHeight <= el.clientHeight + 1) el = el.parentElement
  if (el) el.scrollTop = 0
})
const locked = computed(() => ['balance', 'rumo', 'campaign', 'runoff', 'result', 'plan'].includes(game.phase))
const cur = computed(() => (locked.value ? 'agenda' : tab.value))
const dica = computed(() => (locked.value ? null : dicaPendente(cur.value)))
const pending = computed(() => game.phase === 'event' || game.phase === 'outcome')

const pend = computed(() => (locked.value ? [] : pendenciasNow()))
const pendTab = (id) => pend.value.filter((x) => x.tab === id && x.tipo === 'acao').reduce((a, x) => a + (x.n || 1), 0)
const nDec = computed(() => pend.value.filter((x) => x.tipo === 'decisao').length)
const pendAberto = ref(false)
const tabs = computed(() => [
  { id: 'agenda', label: '📋 Agenda', dot: (pending.value || nDec.value > 0) && tab.value !== 'agenda' },
  { id: 'disputa', label: '🗳️ Disputa' },
  { id: 'redes', label: '📱 Redes' },
  { id: 'ideias', label: '💡 Ideias' },
  { id: 'contatos', label: '👥 Contatos', badge: pendTab('contatos') },
  { id: 'orcamento', label: '💰 Orçamento' },
  { id: 'partido', label: '🎗️ Partido', badge: pendTab('partido') },
  { id: 'plano', label: '📜 Plano' },
  { id: 'mundo', label: '🌍 Mundo', badge: game.world && game.world.wars.length ? game.world.wars.length : 0 },
  { id: 'leis', label: '⚖️ Leis', badge: pendTab('leis') },
  { id: 'mapa', label: '🗺️ Mapa' },
])

// abas agrupadas: 4 botões principais + sub-abas só do grupo ativo (ids das abas não mudam)
const GROUPS = [
  { id: 'jogo', label: '📋 Agenda', tabs: ['agenda'] },
  { id: 'campanha', label: '🗳️ Campanha', tabs: ['disputa', 'redes', 'contatos', 'mapa'] },
  { id: 'governo', label: '🏛️ Governo', tabs: ['orcamento', 'plano', 'leis', 'ideias'] },
  { id: 'politica', label: '🌍 Política', tabs: ['partido', 'mundo'] },
]
const byId = computed(() => Object.fromEntries(tabs.value.map((t) => [t.id, t])))
const curGroup = computed(() => GROUPS.find((g) => g.tabs.includes(cur.value)) || GROUPS[0])
const subTabs = computed(() => curGroup.value.tabs.map((id) => byId.value[id]))
const groups = computed(() =>
  GROUPS.map((g) => {
    const ts = g.tabs.map((id) => byId.value[id])
    return { ...g, badge: ts.reduce((n, t) => n + (t.badge || 0), 0), dot: ts.some((t) => t.dot) }
  }),
)
const lastIn = {}
watch(cur, (id) => { lastIn[curGroup.value.id] = id })
const goGroup = (g) => { tab.value = lastIn[g.id] || g.tabs[0] }

const left = computed(() => stageInfo().turns - game.turn)
const step = computed(() => ({ event: 1, outcome: 2, actions: 3 })[game.phase] || 0)
const todo = computed(() => {
  switch (game.phase) {
    case 'event': return 'Um evento aconteceu. Leia e escolha como reagir.'
    case 'outcome': return 'Veja a repercussão na imprensa e clique em Continuar.'
    case 'actions': return `Marque até 2 ações no calendário (${game.ap} restantes). Depois clique em Avançar o tempo.`
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
      <div class="meta-line">
        <span>🎯 <b>Meta:</b> <template v-if="game.election && game.election.target">ser eleito(a) {{ targetOffice() === 'Reeleição' ? 'para a reeleição' : targetOffice() }}.</template><template v-else>terminar o mandato de {{ stageInfo().office }} e escolher o próximo passo da carreira.</template></span>
        <span v-if="!locked" class="left">⏳ {{ left }} rodada{{ left === 1 ? '' : 's' }} restante{{ left === 1 ? '' : 's' }}</span>
      </div>
      <div class="todo">
        <span v-if="step" class="pips" :title="`Passo ${step} de 3`"><i v-for="n in 3" :key="n" :class="{ on: n <= step, cur: n === step }"></i></span>
        <span v-else>👉</span>
        <span>{{ todo }}</span>
      </div>
    </div>
    <details v-if="pend.length && game.total > 0" class="pendbox" :open="pendAberto" @toggle="pendAberto = $event.target.open">
      <summary>📌 Pendências ({{ pend.length }}){{ nDec ? ` · ${nDec} decisão(ões) com prazo` : '' }}</summary>
      <ul>
        <li v-for="x in pend" :key="x.id" :class="x.tipo">
          <span>{{ x.icon }} {{ x.txt }}<small v-if="x.tipo === 'decisao' && x.left"> · {{ x.left }} rodada(s)</small></span>
          <button v-if="x.tab && x.tab !== cur" type="button" class="mini" @click="tab = x.tab">Ir</button>
        </li>
      </ul>
    </details>
    <details v-if="game.total === 0 && game.phase === 'event'" :open="!narrow" class="howto">
      <summary>Como jogar (fechar)</summary>
      <ul>
        <li>Cada <b>rodada</b> é um período do calendário: 1 evento + até 2 ações marcadas nos meses. As barras à esquerda são seus números.</li>
        <li>Se <b>Popularidade</b> ou <b>Caixa</b> zerarem, a carreira acaba.</li>
        <li>No fim do mandato há <b>eleição</b>. Quem tem mais popularidade, imagem, economia e promessas cumpridas ganha.</li>
        <li>As abas servem para <b>Disputa</b> (ranking), <b>Redes</b>, <b>Orçamento</b>, <b>Partido</b>, <b>Plano</b> e <b>Mapa</b>.</li>
      </ul>
    </details>
    <div v-if="!locked" class="navwrap">
      <nav class="tabs" role="tablist" aria-label="Seções do jogo">
        <button v-for="g in groups" :key="g.id" role="tab" :aria-selected="curGroup.id === g.id" :class="{ on: curGroup.id === g.id }" @click="goGroup(g)">
          {{ g.label }}<span v-if="g.badge" class="badge">{{ g.badge }}</span><span v-if="g.dot" class="badge">!</span>
        </button>
      </nav>
      <nav v-if="subTabs.length > 1" class="subtabs" role="tablist" :aria-label="`Abas de ${curGroup.label}`">
        <button v-for="t in subTabs" :key="t.id" role="tab" :aria-selected="cur === t.id" :class="{ on: cur === t.id }" @click="tab = t.id">
          {{ t.label }}<span v-if="t.badge" class="badge">{{ t.badge }}</span><span v-if="t.dot" class="badge">!</span>
        </button>
      </nav>
    </div>
    <div class="tabbody">
      <div v-if="dica" class="dica" role="note">
        <span aria-hidden="true">{{ dica.icon }}</span>
        <span><b>Primeira vez aqui:</b> {{ dica.text }}</span>
        <button type="button" @click="dicaVista(cur)">Entendi</button>
      </div>
      <GuiaAba v-if="!locked" :tab="cur" @go="tab = $event" />
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

<style scoped>
.pendbox { margin: 6px 0; padding: 6px 10px; border-radius: 10px; font-size: 0.88rem; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.14); }
.pendbox summary { cursor: pointer; font-weight: 600; }
.pendbox ul { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 4px; }
.pendbox li { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
.pendbox li.decisao { color: var(--warn); }
.pendbox .mini { padding: 2px 8px; font-size: 0.8rem; }
</style>
