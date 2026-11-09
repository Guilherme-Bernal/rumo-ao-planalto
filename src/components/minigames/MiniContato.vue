<script setup>
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import { game, STATS, currentApproach, talkChoice, ignoreApproach, callAsk, effectiveFx } from '../../game/engine'
import { ROLES, ASKS, CHAT, relLabel, relTier, greeting } from '../../game/contacts'
import { sfx } from '../../game/audio'

// mode "in": atender uma ligação/mensagem/abordagem | mode "out": ligar para um contato (usa 1 ação)
const props = defineProps({ mode: { type: String, default: 'in' }, month: { type: Number, default: 0 } })
const emit = defineEmits(['close'])

const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const stage = ref(props.mode === 'out' ? 'pick' : 'ring') // ring | pick | ask | dial | chat | end
const contact = ref(null)
const msgs = ref([])
const choices = ref([])
const typing = ref(false)
const result = ref(null) // chips do que mudou
const body = ref(null)
const relStart = ref(0)
const secs = ref(0)
const sortBy = ref('rel')
let alive = true
let tmr = null
let ringT = null
onBeforeUnmount(() => {
  alive = false
  clearInterval(tmr)
  clearInterval(ringT)
  window.removeEventListener('keydown', onKey)
})

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function say(who, text, ms = 700) {
  if (who === 'them') {
    typing.value = true
    await wait(ms)
    typing.value = false
  }
  if (!alive) return
  msgs.value.push({ who, text, at: secs.value })
}
watch([msgs, typing], async () => {
  await nextTick()
  if (body.value) body.value.scrollTop = body.value.scrollHeight
}, { deep: true })

const role = computed(() => (contact.value ? ROLES[contact.value.role] : null))
const rel = computed(() => (contact.value ? Math.round(contact.value.rel) : 0))
const mmss = computed(() => `${String(Math.floor(secs.value / 60)).padStart(2, '0')}:${String(secs.value % 60).padStart(2, '0')}`)
const chips = (fx) => {
  const eff = effectiveFx(fx || {})
  return Object.entries(eff).filter(([, v]) => v).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${String(Math.round(v * 10) / 10).replace('.', ',')} ${short[k]}`, good: v > 0 }))
}
const relCol = (v) => (v >= 55 ? 'var(--good)' : v >= 30 ? 'var(--warn)' : 'var(--bad)')
const startTimer = () => {
  clearInterval(tmr)
  secs.value = 0
  tmr = setInterval(() => secs.value++, 1000)
}

/* ----- ligação recebida ----- */
const ap = props.mode === 'in' ? currentApproach() : null
if (props.mode === 'in') {
  if (!ap) emit('close')
  else {
    contact.value = ap.contact
    relStart.value = ap.contact.rel
  }
}
const isCall = computed(() => (ap ? ap.kind.verb.startsWith('Ligação') : true))
onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (props.mode === 'in' && ap) {
    sfx('ring')
    ringT = setInterval(() => stage.value === 'ring' && sfx('ring'), 2200)
  }
})
function onKey(e) {
  if (stage.value === 'ring' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault()
    answer()
    return
  }
  const n = parseInt(e.key, 10)
  if (stage.value === 'chat' && n >= 1 && n <= choices.value.length) choose(choices.value[n - 1])
}
async function answer() {
  clearInterval(ringT)
  stage.value = 'chat'
  startTimer()
  await say('sys', `${ap.kind.icon} ${ap.kind.verb} ${ap.contact.name}`, 0)
  await say('them', greeting(ap.contact.rel), 700)
  await say('them', ap.script.text, 1100)
  choices.value = ap.script.ch
}
function decline() {
  clearInterval(ringT)
  ignoreApproach()
  emit('close')
}
async function choose(ch) {
  if (!alive || !choices.value.length) return
  choices.value = []
  msgs.value.push({ who: 'me', text: ch.l, at: secs.value })
  talkChoice(ch)
  result.value = [...(result.value || []), ...chips(ch.fx)]
  if (ch.next) {
    await say('them', ch.next.text, 1000)
    choices.value = ch.next.ch
  } else {
    if (ch.out) await say('sys', ch.out, 700)
    finish()
  }
}
function finish() {
  clearInterval(tmr)
  stage.value = 'end'
}

/* ----- ligar para alguém ----- */
const asks = computed(() => (contact.value ? [CHAT, ...(ASKS[contact.value.role] || [])] : []))
const normal = computed(() => asks.value.filter((a) => !a.dirty))
const shady = computed(() => asks.value.filter((a) => a.dirty))
const chance = (a) => (a === CHAT ? 100 : Math.round(Math.min(0.92, a.base + contact.value.rel / 130) * 100))
const list = computed(() => {
  const l = [...game.contacts]
  return sortBy.value === 'rel' ? l.sort((a, b) => b.rel - a.rel) : l
})
const pick = (c) => {
  contact.value = c
  relStart.value = c.rel
  stage.value = 'ask'
}
async function ask(a) {
  const res = callAsk(contact.value.id, a.id, props.month)
  if (!res) return emit('close')
  stage.value = 'dial'
  sfx('ring')
  await wait(1700)
  if (!alive) return
  stage.value = 'chat'
  startTimer()
  await say('sys', `📞 Chamada com ${contact.value.name}`, 0)
  await wait(400)
  await say('them', greeting(contact.value.rel), 700)
  await say('me', a.you, 400)
  await say('them', res.line, 1100)
  await say('sys', res.ok ? (a === CHAT ? 'A relação ficou mais forte.' : 'Deu certo!') : 'Não deu certo desta vez.', 500)
  sfx(res.ok ? 'good' : 'bad')
  result.value = chips(res.fx)
  finish()
}

// resumo da relação ao fim da conversa
const delta = computed(() => Math.round(rel.value - relStart.value))
const crossed = computed(() => {
  if (!contact.value) return null
  const a = relTier(relStart.value)
  const b = relTier(contact.value.rel)
  if (a === b) return null
  return b === 'ajuda' ? { cls: 'up', t: `🎉 Agora ele(a) ajuda toda rodada: ${role.value.hiText}.` } : b === 'atrapalha' ? { cls: 'down', t: `⚠️ Agora ele(a) atrapalha: ${role.value.loText}.` } : { cls: 'muted', t: 'Voltou ao meio-termo.' }
})
const last = (c) => (c.hist && c.hist[0] ? c.hist[0].t : null)
</script>

<template>
  <div class="minimodal">
    <div class="phone cl">
      <!-- cabeçalho -->
      <div class="cl-head">
        <span class="cl-ava" :class="{ ring: stage === 'ring' || stage === 'dial' }">{{ role ? role.icon : '📞' }}</span>
        <div v-if="contact" class="cl-who">
          <b>{{ contact.name }}</b>
          <small>{{ role.name }} · {{ relLabel(rel) }}</small>
          <span class="cl-rel"><i :style="{ width: rel + '%', background: relCol(rel) }"></i></span>
        </div>
        <div v-else class="cl-who"><b>Ligar para um contato</b><small>Gasta 1 ação do calendário</small></div>
        <span v-if="stage === 'chat'" class="cl-time"><i class="cl-dot"></i>{{ isCall ? mmss : 'online' }}</span>
        <button v-if="stage === 'pick' || stage === 'ask'" class="ph-x" aria-label="Fechar" @click="emit('close')">✕</button>
      </div>

      <!-- tocando -->
      <div v-if="stage === 'ring'" class="cl-ring">
        <div class="cl-pulse"><span class="cl-big">{{ role.icon }}</span></div>
        <small class="muted">{{ ap.kind.icon }} {{ ap.kind.verb }}</small>
        <h3>{{ contact.name }}</h3>
        <p class="muted">{{ role.name }} · {{ relLabel(rel) }}</p>
        <p class="cl-title">“{{ ap.script.title }}”</p>
        <div v-if="last(contact)" class="cl-last">Última vez: {{ last(contact) }}</div>
        <div class="cl-btns">
          <button class="cl-no" @click="decline"><span>✕</span>Ignorar<small>−3 de relação</small></button>
          <button class="cl-yes" @click="answer"><span>📞</span>Atender<small>Enter</small></button>
        </div>
      </div>

      <!-- lista de contatos -->
      <div v-else-if="stage === 'pick'" class="ph-list">
        <div class="cl-sort"><span class="muted">Ordenar:</span>
          <button :class="{ on: sortBy === 'rel' }" @click="sortBy = 'rel'">Mais próximos</button>
          <button :class="{ on: sortBy === 'ord' }" @click="sortBy = 'ord'">Padrão</button>
        </div>
        <button v-for="c in list" :key="c.id" class="cl-contact" @click="pick(c)">
          <span class="cl-ava sm">{{ ROLES[c.role].icon }}</span>
          <span class="ph-nm"><b>{{ c.name }}</b><small>{{ ROLES[c.role].name }} · {{ relLabel(c.rel) }}</small><small v-if="last(c)" class="cl-lastline">↳ {{ last(c) }}</small></span>
          <span class="cl-rel"><i :style="{ width: c.rel + '%', background: relCol(c.rel) }"></i></span>
        </button>
      </div>

      <!-- o que pedir -->
      <div v-else-if="stage === 'ask'" class="ph-list">
        <p class="muted">Bater papo fortalece a relação. Pedir um favor gasta relação, e quanto mais próximo, maior a chance.</p>
        <button v-for="a in normal" :key="a.id" class="cl-ask" @click="ask(a)">
          <span class="cl-askhead"><b>{{ a.label }}</b>
            <span class="chip" :class="a === CHAT ? 'up' : chance(a) >= 60 ? 'up' : 'warn'">{{ a === CHAT ? '+12 relação' : `${chance(a)}%` }}</span>
          </span>
          <small v-if="a.okFx">{{ chips(a.okFx).map((c) => c.t).join(' · ') || 'fortalece a relação' }}<template v-if="a !== CHAT && a.cost"> · custa {{ a.cost }} de relação</template></small>
          <span v-if="a !== CHAT" class="cl-chance"><i :style="{ width: chance(a) + '%', background: chance(a) >= 60 ? 'var(--good)' : 'var(--warn)' }"></i></span>
        </button>
        <template v-if="shady.length">
          <div class="cl-sub">⚠️ Pedidos polêmicos <small class="muted">(contam como escolha suja)</small></div>
          <button v-for="a in shady" :key="a.id" class="cl-ask dirty" @click="ask(a)">
            <span class="cl-askhead"><b>{{ a.label }}</b><span class="chip" :class="chance(a) >= 60 ? 'up' : 'warn'">{{ chance(a) }}%</span></span>
            <small>{{ chips(a.okFx).map((c) => c.t).join(' · ') }}<template v-if="a.heat"> · 🕵️ investigação {{ a.heat > 0 ? '+' : '' }}{{ a.heat }}</template><template v-if="a.rival"> · enfraquece o rival</template></small>
            <span class="cl-chance"><i :style="{ width: chance(a) + '%', background: chance(a) >= 60 ? 'var(--good)' : 'var(--warn)' }"></i></span>
          </button>
        </template>
        <button @click="stage = 'pick'">← Escolher outra pessoa</button>
      </div>

      <!-- chamando -->
      <div v-else-if="stage === 'dial'" class="cl-ring">
        <div class="cl-pulse"><span class="cl-big">{{ role.icon }}</span></div>
        <h3>{{ contact.name }}</h3>
        <p class="muted">Chamando<span class="cl-dots"><i>.</i><i>.</i><i>.</i></span></p>
      </div>

      <!-- conversa -->
      <template v-else>
        <div ref="body" class="ph-body">
          <div v-for="(m, i) in msgs" :key="i" class="bub" :class="m.who">{{ m.text }}</div>
          <div v-if="typing" class="bub them typing"><i></i><i></i><i></i></div>
        </div>
        <div class="ph-foot">
          <button v-for="(c, i) in choices" :key="i" class="ph-choice cl-choice" :class="{ dirty: c.dirty }" @click="choose(c)">
            <span class="cl-n">{{ i + 1 }}</span><span>{{ c.l }}</span><small v-if="c.dirty" class="cl-warn">⚠️</small>
          </button>
          <template v-if="stage === 'end'">
            <div class="cl-sum">
              <div class="cl-sumrel">
                <span>Relação</span>
                <span class="cl-track"><i class="from" :style="{ width: Math.min(relStart, rel) + '%' }"></i><i class="to" :class="delta >= 0 ? 'up' : 'down'" :style="{ left: Math.min(relStart, rel) + '%', width: Math.abs(delta) + '%' }"></i></span>
                <b :class="delta >= 0 ? 'up' : 'down'">{{ delta > 0 ? '+' : '' }}{{ delta }}</b>
              </div>
              <small class="muted">{{ relLabel(relStart) }} → <b>{{ relLabel(rel) }}</b></small>
              <div v-if="crossed" class="cl-cross" :class="crossed.cls">{{ crossed.t }}</div>
              <div v-if="result && result.length" class="ph-res"><span v-for="(c, i) in result" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
            </div>
            <button class="primary" @click="emit('close')">Encerrar</button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
