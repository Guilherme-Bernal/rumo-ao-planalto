<script setup>
import { ref, computed } from 'vue'
import { game, coalition } from '../../game/engine'
import { candName } from '../../game/social'

const emit = defineEmits(['done'])
const PREF = {
  verba: { ico: '💰', hint: 'Pede verba para a base', label: 'Prometer verba' },
  ideia: { ico: '💡', hint: 'Gosta de debater o mérito', label: 'Defender o mérito' },
  povo: { ico: '📣', hint: 'Vive de olho nas redes', label: 'Mostrar apoio popular' },
}
const SIG = ['PAT', 'PCS', 'MRB', 'UNI', 'PDL', 'PFB', 'PVD']
const prefs = ['verba', 'ideia', 'povo']
const total = 9
const co = coalition()
const yes = Math.max(1, Math.min(7, 2 + Math.round(game.stats.cong / 25) + co.votes - (co.angry ? 1 : 0)))
const no = Math.max(1, 3 - Math.floor(co.votes / 2) + (co.angry ? 1 : 0))
const members = ref(
  Array.from({ length: total }, (_, i) => ({
    name: candName(Math.random).replace(/^(Dr\.|Dra\.|Seu|Dona|Tio|Tia|Cabo|Pastor|Prof\.)\s+/, ''),
    sig: SIG[Math.floor(Math.random() * SIG.length)],
    pref: prefs[Math.floor(Math.random() * 3)],
    vote: i < yes ? 'sim' : i < yes + no ? 'nao' : 'ind',
    note: '',
  })).sort(() => Math.random() - 0.5),
)
const moves = ref(3)
const sel = ref(null)
const result = ref(null)
const sim = computed(() => members.value.filter((m) => m.vote === 'sim').length)
const nao = computed(() => members.value.filter((m) => m.vote === 'nao').length)
const office = computed(() => ({ vereador: 'Câmara Municipal', prefeito: 'Câmara Municipal', dep_estadual: 'Assembleia Legislativa', dep_federal: 'Câmara dos Deputados', senador: 'Senado Federal', governador: 'Assembleia Legislativa', presidente: 'Congresso Nacional' })[game.office] || 'plenário')

function argue(p) {
  if (sel.value === null || moves.value <= 0) return
  const m = members.value[sel.value]
  const hit = m.pref === p
  if (m.vote === 'sim') m.note = 'Já estava com você.'
  else if (m.vote === 'ind') {
    if (hit ? Math.random() < 0.9 : Math.random() < 0.2) { m.vote = 'sim'; m.note = '✅ Convencido(a)!' }
    else { m.note = hit ? 'Ficou em dúvida.' : '🤔 Não era isso que queria ouvir.'; if (!hit && Math.random() < 0.3) m.vote = 'nao' }
  } else {
    if (hit && Math.random() < 0.3) { m.vote = 'sim'; m.note = '✅ Mudou de lado!' }
    else m.note = '❌ Seguiu contra.'
  }
  moves.value--
  sel.value = null
}
function vote() {
  const s = sim.value
  result.value = { s, ok: s * 2 > total }
}
</script>

<template>
  <div class="minimodal">
    <div class="plen">
      <h3>🏛️ Votação no {{ office }}</h3>
      <p class="muted">Você precisa de {{ Math.floor(total / 2) + 1 }} votos de {{ total }}. Escolha um parlamentar e um argumento (3 conversas). Dica: cada um tem um perfil.</p>
      <div class="plen-grid">
        <button v-for="(m, i) in members" :key="i" class="pm" :class="[m.vote, { on: sel === i }]" :disabled="!!result || moves <= 0" @click="sel = i">
          <b>{{ m.name }}</b><small>{{ m.sig }}</small>
          <span class="st">{{ m.vote === 'sim' ? '✅ Sim' : m.vote === 'nao' ? '❌ Não' : '❔ Indeciso' }}</span>
          <small class="hint">{{ PREF[m.pref].hint }}</small>
          <small v-if="m.note" class="note">{{ m.note }}</small>
        </button>
      </div>
      <div v-if="!result" class="plen-act">
        <span>Conversas: <b>{{ moves }}</b> · Sim <b>{{ sim }}</b> · Não <b>{{ nao }}</b></span>
        <div>
          <button v-for="(p, k) in PREF" :key="k" :disabled="sel === null || moves <= 0" @click="argue(k)">{{ p.ico }} {{ p.label }}</button>
          <button class="primary" @click="vote">Abrir a votação</button>
        </div>
      </div>
      <div v-else class="plen-res">
        <div class="big">{{ result.s }} x {{ total - result.s }}</div>
        <p>{{ result.ok ? 'Projeto aprovado!' : 'Projeto rejeitado.' }}</p>
        <button class="primary" @click="emit('done', result.s, total)">Continuar</button>
      </div>
    </div>
  </div>
</template>