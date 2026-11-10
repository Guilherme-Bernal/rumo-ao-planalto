<script setup>
import { computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent, ref } from 'vue'
import { game, country, stageInfo, resetGame, traitNames, partyObj, officeId, industriasNow } from './game/engine'
import { settings } from './game/settings'
import { tutAutoOpen } from './game/tutorial'
import Tutorial from './components/layout/Tutorial.vue'
import PwaBar from './components/layout/PwaBar.vue'
import { OFFICES } from './game/offices'
const LADDER = Object.values(OFFICES).sort((a, b) => a.rank - b.rank || a.tier - b.tier)
// o 3D (three.js) é o trecho mais pesado: carrega em paralelo, sem travar a tela inicial
const Scene3D = defineAsyncComponent(() => import('./components/scene/Scene3D.vue'))
import StartScreen from './components/screens/StartScreen.vue'
import StatsPanel from './components/layout/StatsPanel.vue'
import Hub from './components/layout/Hub.vue'
import Sandbox from './components/layout/Sandbox.vue'
import Apoie from './components/layout/Apoie.vue'
import Settings from './components/layout/Settings.vue'
import Reuniao from './components/game/Reuniao.vue'
import Sucessao from './components/game/Sucessao.vue'
import { unlock, sfx, setMood } from './game/audio'
const showSandbox = import.meta.env.DEV || new URLSearchParams(location.search).has('sandbox')
import EndScreen from './components/screens/EndScreen.vue'
import { downloadSave } from './game/savefile'

// cada aviso some sozinho depois de ~10 s (agenda um timer por aviso, mesmo quando vários chegam juntos)
const toastAgendado = new Set()
watch(
  () => game.toasts.map((t) => t.id).join(','),
  () => {
    let novo = false
    for (const t of game.toasts) {
      if (toastAgendado.has(t.id)) continue
      toastAgendado.add(t.id)
      novo = true
      setTimeout(() => {
        const k = game.toasts.findIndex((x) => x.id === t.id)
        if (k >= 0) game.toasts.splice(k, 1)
        toastAgendado.delete(t.id)
      }, 10000)
    }
    while (game.toasts.length > 5) game.toasts.shift()
    if (novo) sfx('good')
  },
)

// som: o navegador só libera áudio depois do primeiro toque/tecla
const onFirst = () => unlock()
const onClick = (e) => {
  const b = e.target.closest && e.target.closest('button')
  if (b && !b.disabled) sfx('click')
}
onMounted(() => {
  window.addEventListener('pointerdown', onFirst, { once: true })
  window.addEventListener('keydown', onFirst, { once: true })
  document.addEventListener('click', onClick)
})
onBeforeUnmount(() => document.removeEventListener('click', onClick))
watch(() => game.phase, (p) => {
  if (p === 'recap') sfx('turn')
  else if (p === 'end') sfx('win')
  else if (p === 'over') sfx('lose')
})

// cena 3D de situação: muda o cenário conforme o que está acontecendo no jogo
const cena = computed(() => {
  if (game.phase === 'start') return ''
  if (game.phase === 'result' || game.phase === 'runoff') return 'apuracao'
  if (game.phase === 'campaign') return 'comicio'
  if (game.phase === 'plan') return 'posse'
  if (game.poder && game.poder.reuniao) return 'reuniao'
  const p = game.poder
  if (p && p.civil) return 'guerra'
  if (p && p.plot) return 'crise'
  if (p && (p.acao || (p.inq && p.inq.stage === game.stage))) return 'tribunal'
  if (p && p.cst && p.cst.estado) return 'crise'
  if (p && p.prot) return 'protesto'
  return ''
})

const tema = computed(() => {
  if (game.phase === 'start') return 'menu'
  if (game.phase === 'end') return 'vitoria'
  if (game.phase === 'over') return 'derrota'
  if (game.phase === 'campaign' || game.phase === 'runoff') return 'campanha'
  if (game.phase === 'result') return 'apuracao'
  const c = cena.value
  if (c === 'guerra') return 'guerra'
  if (c === 'crise' || c === 'protesto') return 'crise'
  if (c === 'tribunal') return 'tribunal'
  if (c === 'posse') return 'campanha'
  return 'gov'
})
watch(
  () => [game.stats.pop, game.phase === 'start' ? 1 : game.stage, game.world && game.phase !== 'start' ? game.world.wars.length : 0, tema.value],
  ([pop, stage, war, theme]) => setMood({ pop, stage, war, theme }),
  { immediate: true },
)
watch(tema, (t, o) => {
  if (t === 'tribunal') sfx('gavel')
  else if ((t === 'crise' || t === 'guerra') && o === 'gov') sfx('alert')
})

// tutorial: abre sozinho na primeira carreira
watch(() => game.phase, (p, o) => { if (o === 'start' && p !== 'start') tutAutoOpen() })

// anúncios para leitor de tela (região aria-live educada)
const aviso = ref('')
watch(
  () => [game.phase, game.turn, game.stage],
  () => {
    if (!settings.announce || game.phase === 'start') return
    const nomes = { event: 'Novo evento. Decida o que fazer.', actions: 'Escolha suas ações da rodada.', campaign: 'Campanha eleitoral.', result: 'Resultado da eleição.', plan: 'Posse. Monte o plano de governo.', recap: 'Resumo do período.', over: 'Fim de jogo.', end: 'Fim da carreira.' }
    aviso.value = `Rodada ${game.turn + 1}. ${nomes[game.phase] || ''}`
  },
)

function restart() {
  if (confirm('Abandonar a carreira atual e voltar ao início?')) resetGame()
}
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <Scene3D
    aria-hidden="true"
    :pop="game.stats.pop"
    :eco="game.stats.eco"
    :stage="game.phase === 'start' ? 1 : game.stage"
    :office="game.phase === 'start' ? '' : officeId()"
    :war="game.phase === 'start' || !game.world ? 0 : game.world.wars.length"
    :ind="game.phase === 'start' ? 0 : industriasNow().length"
    :cena="cena"
  />
  <div class="sr-only" role="status" aria-live="polite">{{ aviso }}</div>

  <div class="toasts" role="status" aria-live="polite" aria-atomic="false">
    <div v-for="t in game.toasts" :key="t.id" class="toast">{{ t.msg ? `${t.icon} ${t.msg}` : `🏆 Conquista: ${t.icon} ${t.name}` }}</div>
  </div>

  <Settings />
  <Reuniao />
  <Tutorial />
  <PwaBar />
  <Sucessao />
  <StartScreen v-if="game.phase === 'start'" id="conteudo" role="main" tabindex="-1" />
  <EndScreen v-else-if="game.phase === 'over' || game.phase === 'end'" id="conteudo" role="main" tabindex="-1" />

  <div v-else class="hud">
    <header class="top panel">
      <h1 class="sr-only">Rumo ao Planalto</h1>
      <div>
        <div class="who">{{ country().flag }} {{ game.name }} · {{ stageInfo().office }}
          <span v-if="partyObj()" class="chip" :style="{ background: partyObj().color + '55' }">{{ partyObj().sigla }}</span>
        </div>
        <div class="meta" :title="`${game.archetype.name} · ${traitNames()}`">
          {{ game.city?.name }} ({{ game.region.id }}) · {{ game.archetype.name }} ·
          Rodada {{ Math.min(game.turn + 1, stageInfo().turns) }}/{{ stageInfo().turns }}
          <template v-if="game.stage === 3"> · Mandato {{ game.term }}/2</template>
        </div>
        <div class="trail">
          <span v-for="o in LADDER" :key="o.id" :class="{ on: o.id === officeId(), done: o.rank < OFFICES[officeId()].rank }">{{ o.name }}</span>
        </div>
      </div>
      <div class="topbtns">
        <button title="Baixar um arquivo com o seu progresso" aria-label="Salvar" @click="downloadSave">💾<span class="btn-lbl"> Salvar</span></button>
        <button aria-label="Reiniciar" @click="restart"><span class="ico-m">↺</span><span class="btn-lbl">Reiniciar</span></button>
      </div>
    </header>
    <StatsPanel class="stats panel" />
    <Hub id="conteudo" role="main" tabindex="-1" class="main panel" />
    <Sandbox v-if="showSandbox" />
    <Apoie />
  </div>
</template>