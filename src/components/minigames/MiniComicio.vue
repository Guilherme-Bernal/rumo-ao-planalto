<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['done'])
const TONES = [
  { k: 'emocao', ico: '❤️', name: 'Emoção' },
  { k: 'dados', ico: '📊', name: 'Dados' },
  { k: 'humor', ico: '😄', name: 'Humor' },
  { k: 'ataque', ico: '🗡️', name: 'Ataque' },
]
const AUD = [
  { ico: '👵', name: 'Idosos do bairro', fav: 'emocao', ok: 'dados', bad: 'ataque' },
  { ico: '🧑‍🎓', name: 'Estudantes', fav: 'humor', ok: 'emocao', bad: 'dados' },
  { ico: '👷', name: 'Trabalhadores da fábrica', fav: 'dados', ok: 'ataque', bad: 'humor' },
  { ico: '🧑‍💼', name: 'Empresários', fav: 'dados', ok: 'emocao', bad: 'ataque' },
  { ico: '👨‍👩‍👧', name: 'Famílias da periferia', fav: 'emocao', ok: 'humor', bad: 'dados' },
  { ico: '🧑‍🌾', name: 'Produtores rurais', fav: 'ataque', ok: 'dados', bad: 'humor' },
]
const rounds = AUD.slice().sort(() => Math.random() - 0.5).slice(0, 5)
const n = ref(0)
const mood = ref(50)
const log = ref([])
const last = ref('')
const used = []
let over = false
const crowd = computed(() => {
  const m = mood.value
  return Array.from({ length: 12 }, (_, i) => (i / 12 < m / 100 ? (m > 66 ? '😍' : m > 33 ? '🙂' : '😐') : m < 25 ? '😡' : '😶')).join('')
})
function pick(t) {
  if (over) return
  const a = rounds[n.value]
  let d = t === a.fav ? 22 : t === a.ok ? 8 : t === a.bad ? -16 : -4
  const rep = used.slice(-2).every((x) => x === t) && used.length >= 2
  if (rep) d -= 8
  used.push(t)
  if (Math.random() < 0.18) {
    const heck = t === 'ataque'
    d += heck ? -10 : 6
    last.value = heck ? '🤬 Um provocador responde ao seu ataque e a plateia ri dele... e de você.' : '👏 Alguém grita "É isso!" e a praça aplaude.'
  } else last.value = d >= 20 ? 'A plateia vibra!' : d >= 6 ? 'Boa reação.' : d >= -5 ? 'Ficou morno.' : 'A plateia não gostou.'
  if (rep) last.value += ' (repetir o mesmo tom cansa)'
  mood.value = Math.max(0, Math.min(100, mood.value + d))
  log.value.push(d)
  if (n.value + 1 >= rounds.length) {
    over = true
    setTimeout(() => emit('done', mood.value / 100), 900)
  } else n.value++
}
</script>

<template>
  <div class="minimodal">
    <div class="com">
      <h3>🎤 Comício ({{ Math.min(n + 1, rounds.length) }}/{{ rounds.length }})</h3>
      <div class="aud"><span class="big-ico">{{ rounds[n].ico }}</span> A plateia agora: <b>{{ rounds[n].name }}</b></div>
      <div class="crowd">{{ crowd }}</div>
      <div class="mood"><i :style="{ width: mood + '%' }"></i></div>
      <p class="muted">Escolha o tom do discurso. Cada plateia reage de um jeito.</p>
      <div class="tones">
        <button v-for="t in TONES" :key="t.k" @click="pick(t.k)"><span>{{ t.ico }}</span> {{ t.name }}</button>
      </div>
      <p class="tvfb">{{ last || ' ' }}</p>
    </div>
  </div>
</template>