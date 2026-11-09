<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { game, coalition, STATS } from '../../game/engine'
import { billFor, billOutcome, billBloc, billSupport, BLOCS } from '../../game/bills'
import { PARTIES } from '../../game/countries/brasil-parties'
import { candName } from '../../game/social'
import { sfx } from '../../game/audio'

const emit = defineEmits(['done'])
const PREF = {
  verba: { ico: '💰', hint: 'Pede verba para a base', label: 'Prometer verba', tag: 'Quer verba' },
  ideia: { ico: '💡', hint: 'Gosta de debater o mérito', label: 'Defender o mérito', tag: 'Quer mérito' },
  povo: { ico: '📣', hint: 'Vive de olho nas redes', label: 'Mostrar apoio popular', tag: 'Olha as redes' },
}
const SIG = PARTIES.filter((p) => !p.tag).map((p) => p.sigla)
const hueOf = (sg) => [...sg].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7)
const prefs = ['verba', 'ideia', 'povo']
const BLOC_KEYS = Object.keys(BLOCS)
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
      bloc: BLOC_KEYS[Math.floor(Math.random() * BLOC_KEYS.length)],
      leader: false,
    }
  }).sort(() => Math.random() - 0.5),
)
// o primeiro de cada bancada é o líder: convencer o líder arrasta os colegas
for (const k of BLOC_KEYS) {
  const f = members.value.find((m) => m.bloc === k)
  if (f) f.leader = true
}

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

const bill = billFor(game.office, game.total)
const concessions = ref(0)
const short = Object.fromEntries(STATS.map((x) => [x.k, x.short]))
const fxChips = (fx) => Object.entries(fx).filter(([, v]) => v).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${v} ${short[k]}`, good: v > 0 }))
const support = billSupport(bill, game.total)
const billBl = BLOCS[billBloc(bill)]
const stance = ref(null) // 'pro' (defender o projeto) | 'con' (derrubar)
const ifPass = computed(() => fxChips(billOutcome(bill, stance.value === 'pro', concessions.value, stance.value || 'pro')))
const ifFail = computed(() => fxChips(billOutcome(bill, stance.value !== 'pro', concessions.value, stance.value || 'pro')))
const side = computed(() => (stance.value === 'con' ? 'contra' : 'a favor'))
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
const hue = (m) => hueOf(m.sig)
const state = (m) => m.shown || m.vote

// líder de bancada convencido arrasta colegas da mesma bancada
function pull(m) {
  if (!m.leader) return ''
  let n = 0
  for (const o of members.value) {
    if (o !== m && o.bloc === m.bloc && o.vote !== 'sim' && n < 2 && Math.random() < 0.6) {
      o.vote = 'sim'
      n++
    }
  }
  return n ? ` 👑 A bancada acompanhou: +${n}.` : ''
}

// negociar: o parlamentar aceita votar com você em troca de uma emenda que enfraquece o projeto
function negotiate() {
  if (sel.value === null || moves.value <= 0 || busy.value) return
  const m = members.value[sel.value]
  let t
  if (m.vote === 'sim') t = '“Já estou com você. Não precisa de emenda.”'
  else if (concessions.value >= 3) t = '“Já mexeram demais nesse projeto. Não dá mais.”'
  else if (Math.random() < (m.vote === 'ind' ? 0.85 : 0.55)) {
    m.vote = 'sim'
    concessions.value++
    t = '🤝 “Fechado, se entrar a minha emenda. Estou com você.”' + pull(m)
    sfx('good')
  } else t = '❌ “Nem com emenda. Fico do outro lado.”'
  m.note = t
  log.value.unshift({ who: m.first, t })
  moves.value--
  sel.value = null
}

function argue(p) {
  if (sel.value === null || moves.value <= 0 || busy.value) return
  const m = members.value[sel.value]
  const hit = m.pref === p
  let t
  if (m.vote === 'sim') t = '“Já estava do seu lado.”'
  else if (m.vote === 'ind') {
    if (hit ? Math.random() < 0.9 : Math.random() < 0.2) {
      m.vote = 'sim'
      t = (hit ? '✅ “É isso que eu queria ouvir. Estou com você.”' : '✅ “Não era o que eu esperava, mas me convenceu.”') + pull(m)
      sfx('good')
    } else {
      t = hit ? '“Estou quase lá, mas ainda tenho dúvida.”' : '🤔 “Não é bem isso que eu queria ouvir.”'
      if (!hit && Math.random() < 0.3) {
        m.vote = 'nao'
        t = '❌ “Isso me afastou. Fico do outro lado.”'
        sfx('bad')
      }
    }
  } else if (hit && Math.random() < 0.3) {
    m.vote = 'sim'
    t = '✅ “Vou repensar... fechado, estou com você.”' + pull(m)
    sfx('good')
  } else t = '❌ “Continuo do outro lado.”'
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
      <div class="hm-bill">
        <span class="hm-bico">{{ bill.icon }}</span>
        <div>
          <small class="muted">Projeto em votação</small>
          <b>{{ bill.title }}</b>
          <p>{{ bill.ementa }}</p>
          <div class="hm-sides"><span>👍 {{ bill.pro }}</span><span>👎 {{ bill.con }}</span></div>
          <div v-if="stance" class="hm-mine">Seu lado: <b>{{ stance === 'pro' ? '👍 defender o projeto' : '👎 derrubar o projeto' }}</b></div>
          <div v-if="stance" class="hm-fx"><span class="muted">Se vencer:</span><span v-for="(c, i) in ifPass" :key="'p' + i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span>
            <span class="muted">Se perder:</span><span v-for="(c, i) in ifFail" :key="'f' + i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
          <small v-if="concessions" class="muted">🤝 {{ concessions }} emenda{{ concessions > 1 ? 's' : '' }} negociada{{ concessions > 1 ? 's' : '' }}: o projeto passa mais fraco.</small>
        </div>
      </div>
      <div v-if="!stance" class="hm-stance">
        <div class="vt-sup"><span>Apoio popular ao projeto</span><span class="vt-bar"><i :style="{ width: support + '%', background: support >= 55 ? 'var(--good)' : support >= 40 ? 'var(--warn)' : 'var(--bad)' }"></i></span><b>{{ support }}%</b></div>
        <small class="muted">{{ support >= 65 ? 'Popular: combater custa popularidade.' : support <= 35 ? 'Impopular: defender custa imagem.' : 'Opinião dividida.' }} · {{ billBl.icon }} Mexe com a {{ billBl.name.toLowerCase() }}.</small>
        <p><b>De que lado você vai ficar?</b> Defender ou derrubar muda o que você ganha. Depois é só convencer os parlamentares a ficar do seu lado.</p>
        <div class="hm-args">
          <button @click="stance = 'pro'"><span>👍</span>Defender o projeto<small>passar traz o benefício</small></button>
          <button @click="stance = 'con'"><span>👎</span>Derrubar o projeto<small>rejeitar economiza o custo</small></button>
        </div>
      </div>
      <template v-else>
      <p class="muted">Precisa de <b>{{ need }}</b> votos de {{ total }}. Escolha um parlamentar, depois um argumento. Você tem <b>{{ moves }}</b> conversa{{ moves === 1 ? '' : 's' }}.</p>

      <div class="hm-hemi" :style="{ aspectRatio: 1 / ASPECT }">
        <button
          v-for="(m, i) in members"
          :key="i"
          class="hm-seat"
          :class="[state(m), { on: sel === i }]"
          :style="{ left: SEATS[i].x + '%', top: SEATS[i].y + '%', '--h': hue(m) }"
          :disabled="!!result || busy || moves <= 0"
          :aria-label="`${m.name}, ${m.sig}: ${state(m) === 'sim' ? 'com você' : state(m) === 'nao' ? 'do outro lado' : 'indeciso'}`"
          @click="sel = sel === i ? null : i"
        >
          <span class="hm-face">{{ m.first[0] }}</span>
          <span class="hm-badge">{{ state(m) === 'sim' ? '✓' : state(m) === 'nao' ? '✕' : state(m) === 'abs' ? '–' : '?' }}</span>
          <span class="hm-name">{{ m.first }}</span>
        </button>
        <div class="hm-mesa">
          <b>{{ sim }}</b><small>com você</small>
        </div>
      </div>

      <div class="hm-tally" :title="`${sim} a favor, ${ind} indecisos, ${nao} contra`">
        <span class="y" :style="{ flex: sim }"></span><span class="i" :style="{ flex: ind }"></span><span class="n" :style="{ flex: nao }"></span>
        <i class="hm-need" :style="{ left: (need / total) * 100 + '%' }"></i>
      </div>
      <div class="hm-legend"><span>✅ {{ sim }} com você</span><span>❔ {{ ind }} indecisos</span><span>❌ {{ nao }} do outro lado</span><span class="muted">maioria: {{ need }}</span></div>

      <template v-if="!result">
        <div v-if="cur" class="hm-card">
          <div class="hm-cava" :style="{ '--h': hue(cur) }">{{ cur.first[0] }}</div>
          <div class="hm-cinfo">
            <b>{{ cur.name }}</b> <span class="chip">{{ cur.sig }}</span><span class="chip">{{ BLOCS[cur.bloc].icon }} {{ BLOCS[cur.bloc].short }}{{ cur.leader ? ' · 👑 líder' : '' }}</span>
            <div class="muted">{{ PREF[cur.pref].ico }} {{ PREF[cur.pref].hint }}</div>
            <div class="hm-st" :class="cur.vote">{{ cur.vote === 'sim' ? '✅ Com você' : cur.vote === 'nao' ? '❌ Do outro lado' : '❔ Indeciso' }}</div>
          </div>
        </div>
        <p v-else class="muted hm-hint">{{ moves > 0 ? 'Toque em um parlamentar para conversar.' : 'Acabaram as conversas. Hora de votar.' }}</p>

        <div class="hm-args">
          <button v-for="(p, k) in PREF" :key="k" :disabled="cur === null || moves <= 0 || busy" @click="argue(k)">
            <span>{{ p.ico }}</span>{{ p.label }}
          </button>
          <button class="hm-neg" :disabled="cur === null || moves <= 0 || busy" @click="negotiate">
            <span>🤝</span>Negociar emenda<small>passa, mas mais fraco</small>
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
        <p>{{ result.ok ? '🎉 Você venceu!' : '😕 Você perdeu.' }} “{{ bill.title }}” foi {{ (stance === 'pro') === result.ok ? 'aprovado' : 'rejeitado' }}.</p>
        <div class="hm-fx"><span v-for="(c, i) in (result.ok ? ifPass : ifFail)" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
        <small class="muted">{{ result.s }} com você · {{ nao }} do outro lado · {{ ind }} abstenç{{ ind === 1 ? 'ão' : 'ões' }}</small>
        <button class="primary" style="margin-top: 10px" @click="emit('done', result.s, total, { bill, concessions, stance })">Continuar</button>
      </div>
      </template>
    </div>
  </div>
</template>
