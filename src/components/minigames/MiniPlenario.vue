<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { game, coalition } from '../../game/engine'
import { candName } from '../../game/social'
import { sfx } from '../../game/audio'

const emit = defineEmits(['done'])
const PREF = {
  verba: { ico: '💰', hint: 'Pede verba para a base', label: 'Prometer verba', tag: 'Quer verba' },
  ideia: { ico: '💡', hint: 'Gosta de debater o mérito', label: 'Defender o mérito', tag: 'Quer mérito' },
  povo: { ico: '📣', hint: 'Vive de olho nas redes', label: 'Mostrar apoio popular', tag: 'Olha as redes' },
}
const SIG = ['PAT', 'PCS', 'MRB', 'UNI', 'PDL', 'PFB', 'PVD']
const SIGCOL = { PAT: 210, PCS: 160, MRB: 30, UNI: 280, PDL: 350, PFB: 100, PVD: 55 }
const prefs = ['verba', 'ideia', 'povo']
const total = 9
const need = Math.floor(total / 2) + 1
const co = coalition()
const yes = Math.max(1, Math.min(7, 2 + Math.round(game.stats.cong / 25) + co.votes - (co.angry ? 1 : 0)))
const no = Math.max(1, 3 - Math.floor(co.votes / 2) + (co.angry ? 1 : 0))
const clean = (n) => n.replace(/^(Dr\.|Dra\.|Seu|Dona|Tio|Tia|Cabo|Pastor|Prof\.)\s+/, '')
const members = ref(
  Array.from({ length: total }, (_, i) => {
    const name = clean(candName(Math.random))
    return {
      name,
      first: name.split(' ')[0],
      sig: SIG[Math.floor(Math.random() * SIG.length)],
      pref: prefs[Math.floor(Math.random() * 3)],
      vote: i < yes ? 'sim' : i < yes + no ? 'nao' : 'ind',
      note: '',
      shown: null,
    }
  }).sort(() => Math.random() - 0.5),
)

// assentos em semicírculo: fila de fora com 5 e de dentro com 4
const ASPECT = 0.62
const SEATS = (() => {
  const out = []
  for (const [n, r] of [[5, 1], [4, 0.57]]) {
    for (let i = 0; i < n; i++) {
      const a = Math.PI - ((i + 0.5) * Math.PI) / n
      out.push({ x: 50 + 41 * r * Math.cos(a), y: 90 - (41 / ASPECT) * r * Math.sin(a), a })
    }
  }
  return out.sort((p, q) => q.a - p.a)
})()

const moves = ref(3)
const sel = ref(null)
const result = ref(null)
const busy = ref(false)
const log = ref([])
let alive = true
onBeforeUnmount(() => (alive = false))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const sim = computed(() => members.value.filter((m) => m.vote === 'sim').length)
const nao = computed(() => members.value.filter((m) => m.vote === 'nao').length)
const ind = computed(() => total - sim.value - nao.value)
const cur = computed(() => (sel.value === null ? null : members.value[sel.value]))
const office = computed(() => ({ vereador: 'na Câmara Municipal', prefeito: 'na Câmara Municipal', dep_estadual: 'na Assembleia Legislativa', dep_federal: 'na Câmara dos Deputados', senador: 'no Senado Federal', governador: 'na Assembleia Legislativa', presidente: 'no Congresso Nacional' })[game.office] || 'no plenário')
const hue = (m) => SIGCOL[m.sig] ?? 200
const state = (m) => m.shown || m.vote

function argue(p) {
  if (sel.value === null || moves.value <= 0 || busy.value) return
  const m = members.value[sel.value]
  const hit = m.pref === p
  let t
  if (m.vote === 'sim') t = '“Já estava com você.”'
  else if (m.vote === 'ind') {
    if (hit ? Math.random() < 0.9 : Math.random() < 0.2) {
      m.vote = 'sim'
      t = hit ? '✅ “É isso que eu queria ouvir. Conte comigo.”' : '✅ “Não era o que eu esperava, mas me convenceu.”'
      sfx('good')
    } else {
      t = hit ? '“Estou quase lá, mas ainda tenho dúvida.”' : '🤔 “Não é bem isso que eu queria ouvir.”'
      if (!hit && Math.random() < 0.3) {
        m.vote = 'nao'
        t = '❌ “Isso me afastou. Voto contra.”'
        sfx('bad')
      }
    }
  } else if (hit && Math.random() < 0.3) {
    m.vote = 'sim'
    t = '✅ “Vou repensar... fechado, estou com você.”'
    sfx('good')
  } else t = '❌ “Meu voto continua contra.”'
  m.note = t
  log.value.unshift({ who: m.first, t })
  moves.value--
  sel.value = null
}

async function vote() {
  if (busy.value || result.value) return
  busy.value = true
  sel.value = null
  // revela voto a voto; indeciso que chega no painel se abstém e não conta a favor
  for (const m of members.value) {
    await wait(260)
    if (!alive) return
    m.shown = m.vote === 'ind' ? 'abs' : m.vote
    sfx('vote')
  }
  await wait(500)
  const s = sim.value
  result.value = { s, ok: s >= need }
  sfx(s >= need ? 'win' : 'lose')
  busy.value = false
}
</script>

<template>
  <div class="minimodal">
    <div class="plen hm">
      <h3>🏛️ Votação {{ office }}</h3>
      <p class="muted">Precisa de <b>{{ need }}</b> votos de {{ total }}. Escolha um parlamentar, depois um argumento. Você tem <b>{{ moves }}</b> conversa{{ moves === 1 ? '' : 's' }}.</p>

      <div class="hm-hemi" :style="{ aspectRatio: 1 / ASPECT }">
        <button
          v-for="(m, i) in members"
          :key="i"
          class="hm-seat"
          :class="[state(m), { on: sel === i }]"
          :style="{ left: SEATS[i].x + '%', top: SEATS[i].y + '%', '--h': hue(m) }"
          :disabled="!!result || busy || moves <= 0"
          :aria-label="`${m.name}, ${m.sig}: ${state(m) === 'sim' ? 'a favor' : state(m) === 'nao' ? 'contra' : 'indeciso'}`"
          @click="sel = sel === i ? null : i"
        >
          <span class="hm-face">{{ m.first[0] }}</span>
          <span class="hm-badge">{{ state(m) === 'sim' ? '✓' : state(m) === 'nao' ? '✕' : state(m) === 'abs' ? '–' : '?' }}</span>
          <span class="hm-name">{{ m.first }}</span>
        </button>
        <div class="hm-mesa">
          <b>{{ sim }}</b><small>a favor</small>
        </div>
      </div>

      <div class="hm-tally" :title="`${sim} a favor, ${ind} indecisos, ${nao} contra`">
        <span class="y" :style="{ flex: sim }"></span><span class="i" :style="{ flex: ind }"></span><span class="n" :style="{ flex: nao }"></span>
        <i class="hm-need" :style="{ left: (need / total) * 100 + '%' }"></i>
      </div>
      <div class="hm-legend"><span>✅ {{ sim }} sim</span><span>❔ {{ ind }} indecisos</span><span>❌ {{ nao }} não</span><span class="muted">maioria: {{ need }}</span></div>

      <template v-if="!result">
        <div v-if="cur" class="hm-card">
          <div class="hm-cava" :style="{ '--h': hue(cur) }">{{ cur.first[0] }}</div>
          <div class="hm-cinfo">
            <b>{{ cur.name }}</b> <span class="chip">{{ cur.sig }}</span>
            <div class="muted">{{ PREF[cur.pref].ico }} {{ PREF[cur.pref].hint }}</div>
            <div class="hm-st" :class="cur.vote">{{ cur.vote === 'sim' ? '✅ A favor' : cur.vote === 'nao' ? '❌ Contra' : '❔ Indeciso' }}</div>
          </div>
        </div>
        <p v-else class="muted hm-hint">{{ moves > 0 ? 'Toque em um parlamentar para conversar.' : 'Acabaram as conversas. Hora de votar.' }}</p>

        <div class="hm-args">
          <button v-for="(p, k) in PREF" :key="k" :disabled="cur === null || moves <= 0 || busy" @click="argue(k)">
            <span>{{ p.ico }}</span>{{ p.label }}
          </button>
        </div>

        <div v-if="log.length" class="hm-log">
          <div v-for="(l, i) in log.slice(0, 3)" :key="i"><b>{{ l.who }}:</b> {{ l.t }}</div>
        </div>

        <div class="hm-go">
          <span class="hm-pips"><i v-for="n in 3" :key="n" :class="{ on: n <= moves }"></i></span>
          <button class="primary" :disabled="busy" @click="vote">{{ busy ? 'Contando os votos…' : 'Abrir a votação' }}</button>
        </div>
      </template>

      <div v-else class="plen-res hm-res" :class="result.ok ? 'ok' : 'no'">
        <div class="big">{{ result.s }} x {{ total - result.s }}</div>
        <p>{{ result.ok ? '🎉 Projeto aprovado!' : '😕 Projeto rejeitado.' }}</p>
        <small class="muted">{{ result.s }} a favor · {{ nao }} contra · {{ ind }} abstenç{{ ind === 1 ? 'ão' : 'ões' }}</small>
        <button class="primary" style="margin-top: 10px" @click="emit('done', result.s, total)">Continuar</button>
      </div>
    </div>
  </div>
</template>
