<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { game, STATS, currentApproach, talkChoice, callAsk, effectiveFx } from '../../game/engine'
import { ROLES, ASKS, CHAT, relLabel } from '../../game/contacts'

// mode "in": atender uma ligação/mensagem/abordagem | mode "out": ligar para um contato (usa 1 ação)
const props = defineProps({ mode: { type: String, default: 'in' }, month: { type: Number, default: 0 } })
const emit = defineEmits(['close'])

const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const stage = ref(props.mode === 'out' ? 'pick' : 'chat') // pick | ask | chat | end
const contact = ref(null)
const msgs = ref([])
const choices = ref([])
const typing = ref(false)
const result = ref(null) // chips do que mudou
const body = ref(null)
let alive = true
onBeforeUnmount(() => (alive = false))

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
async function say(who, text, ms = 700) {
  if (who === 'them') {
    typing.value = true
    await wait(ms)
    typing.value = false
  }
  if (!alive) return
  msgs.value.push({ who, text })
}
watch([msgs, typing], async () => {
  await nextTick()
  if (body.value) body.value.scrollTop = body.value.scrollHeight
}, { deep: true })

const role = computed(() => (contact.value ? ROLES[contact.value.role] : null))
const chips = (fx) => {
  const eff = effectiveFx(fx || {})
  return Object.entries(eff).filter(([, v]) => v).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${String(Math.round(v * 10) / 10).replace('.', ',')} ${short[k]}`, good: v > 0 }))
}

/* ----- ligação recebida ----- */
const ap = props.mode === 'in' ? currentApproach() : null
async function startIn() {
  if (!ap) return emit('close')
  contact.value = ap.contact
  await say('sys', `${ap.kind.icon} ${ap.kind.verb} ${ap.contact.name}`, 0)
  await say('them', ap.script.text, 900)
  choices.value = ap.script.ch
}
async function choose(ch) {
  if (!alive) return
  choices.value = []
  msgs.value.push({ who: 'me', text: ch.l })
  talkChoice(ch)
  result.value = [...(result.value || []), ...chips(ch.fx)]
  if (ch.next) {
    await say('them', ch.next.text, 900)
    choices.value = ch.next.ch
  } else {
    if (ch.out) await say('sys', ch.out, 600)
    stage.value = 'end'
  }
}
if (props.mode === 'in') startIn()

/* ----- ligar para alguém ----- */
const asks = computed(() => (contact.value ? [CHAT, ...(ASKS[contact.value.role] || [])] : []))
const chance = (a) => (a === CHAT ? 100 : Math.round(Math.min(0.92, a.base + contact.value.rel / 130) * 100))
const pick = (c) => { contact.value = c; stage.value = 'ask' }
async function ask(a) {
  const res = callAsk(contact.value.id, a.id, props.month)
  if (!res) return emit('close')
  stage.value = 'chat'
  await say('sys', `📞 Ligando para ${contact.value.name}...`, 0)
  await wait(500)
  await say('me', a.you, 0)
  await say('them', res.line, 900)
  await say('sys', res.ok ? (a === CHAT ? 'A relação ficou mais forte.' : 'Deu certo!') : 'Não deu certo desta vez.', 500)
  result.value = chips(res.fx)
  stage.value = 'end'
}
</script>

<template>
  <div class="minimodal">
    <div class="phone">
      <div class="ph-head">
        <span class="ph-ava">{{ role ? role.icon : '📞' }}</span>
        <div v-if="contact"><b>{{ contact.name }}</b><small>{{ role.name }} · {{ relLabel(contact.rel) }}</small></div>
        <div v-else><b>Ligar para um contato</b><small>Gasta 1 ação</small></div>
        <button v-if="stage === 'pick' || stage === 'ask'" class="ph-x" @click="emit('close')">✕</button>
      </div>

      <div v-if="stage === 'pick'" class="ph-list">
        <button v-for="c in game.contacts" :key="c.id" class="ph-contact" @click="pick(c)">
          <span class="ph-ava">{{ ROLES[c.role].icon }}</span>
          <span class="ph-nm"><b>{{ c.name }}</b><small>{{ ROLES[c.role].name }} · {{ relLabel(c.rel) }}</small></span>
          <span class="bar"><i :style="{ width: c.rel + '%', background: c.rel >= 55 ? 'var(--good)' : c.rel >= 30 ? 'var(--warn)' : 'var(--bad)' }"></i></span>
        </button>
      </div>

      <div v-else-if="stage === 'ask'" class="ph-list">
        <p class="muted">O que você quer da conversa? Pedir favor gasta relação. Quanto mais próximo, maior a chance.</p>
        <button v-for="a in asks" :key="a.id" class="ph-ask" @click="ask(a)">
          <b>{{ a.label }}</b>
          <small v-if="a.okFx">{{ chips(a.okFx).map((c) => c.t).join(' · ') || 'fortalece a relação' }}</small>
          <span v-if="a.dirty" class="chip down">⚠️ polêmico</span>
          <span class="chip" :class="chance(a) >= 60 ? 'up' : 'warn'">{{ a === CHAT ? '+12 de relação' : `chance ${chance(a)}%` }}</span>
        </button>
        <button @click="stage = 'pick'">← Escolher outra pessoa</button>
      </div>

      <template v-else>
        <div ref="body" class="ph-body">
          <div v-for="(m, i) in msgs" :key="i" class="bub" :class="m.who">{{ m.text }}</div>
          <div v-if="typing" class="bub them typing"><i></i><i></i><i></i></div>
        </div>
        <div class="ph-foot">
          <button v-for="(c, i) in choices" :key="i" class="ph-choice" @click="choose(c)">
            {{ c.l }}
          </button>
          <template v-if="stage === 'end'">
            <div v-if="result && result.length" class="ph-res"><span v-for="(c, i) in result" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
            <button class="primary" @click="emit('close')">Encerrar</button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>