<script setup>
import { computed } from 'vue'
import { reactPost, reactsLeft, REACTS } from '../../game/engine'
import { fmtNum } from '../../game/social'

const props = defineProps({ post: Object, compact: Boolean })
const emit = defineEmits(['react'])
const opts = computed(() => REACTS[props.post.tone] || REACTS.flat)
const left = computed(() => reactsLeft())
const can = computed(() => !props.compact && !props.post.mine && !props.post.done && left.value > 0)
function go(k) {
  const r = reactPost(props.post.id, k)
  if (r) emit('react', r)
}

// número estável por post (para o visual: respostas, compartilhamentos, avatar, horário)
const seed = computed(() => [...(props.post.id || 'x')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7))
const raw = computed(() => String(props.post.user || '').replace(/^@/, ''))
const nice = computed(() =>
  raw.value
    .replace(/[_.]+/g, ' ')
    .replace(/([a-zà-ú])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || 'Anônimo',
)
const name = computed(() => (props.post.mine ? props.post.user.replace(/^@/, '') : nice.value))
const handle = computed(() => '@' + raw.value.replace(/\s+/g, '').toLowerCase())
const hue = computed(() => seed.value % 360)
const initial = computed(() => (name.value[0] || '?').toUpperCase())
const comments = computed(() => Math.max(0, Math.round(props.post.likes * (0.08 + (seed.value % 7) / 60))))
const shares = computed(() => Math.max(0, Math.round(props.post.likes * (0.05 + (seed.value % 5) / 50))))
const when = computed(() => (props.post.mine ? 'agora' : ['agora', '2 min', '12 min', '1 h', '3 h'][seed.value % 5]))
const parts = computed(() => String(props.post.text || '').split(/(#[\p{L}\p{N}_]+)/u).filter(Boolean))
const verified = computed(() => props.post.mine || props.post.likes > 4000)
const toneIcon = computed(() => ({ up: '👍', down: '👎' })[props.post.tone] || '')
</script>

<template>
  <article class="sp" :class="['t-' + post.tone, { mine: post.mine }]">
    <div class="sp-ava" :style="{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 65% 38%))` }">{{ initial }}</div>
    <div class="sp-main">
      <div class="sp-head">
        <b>{{ name }}</b>
        <span v-if="verified" class="sp-ok" title="Perfil verificado">✔</span>
        <span class="sp-handle">{{ handle }} · {{ when }}</span>
        <span v-if="post.mine" class="chip">você</span>
        <span v-if="toneIcon" class="sp-tone">{{ toneIcon }}</span>
      </div>
      <p class="sp-text"><template v-for="(t, i) in parts" :key="i"><span v-if="t[0] === '#'" class="sp-tag">{{ t }}</span><template v-else>{{ t }}</template></template></p>
      <div class="sp-metrics">
        <span title="Respostas">💬 {{ fmtNum(comments) }}</span>
        <span title="Compartilhamentos">🔁 {{ fmtNum(shares) }}</span>
        <span title="Curtidas" class="sp-like">♥ {{ fmtNum(post.likes) }}</span>
      </div>
      <div v-if="can" class="sp-acts">
        <button v-for="o in opts" :key="o.id" class="chip btn" @click="go(o.id)">{{ o.label }}</button>
      </div>
      <p v-if="post.done" class="sp-note">↳ {{ post.note }}</p>
    </div>
  </article>
</template>
