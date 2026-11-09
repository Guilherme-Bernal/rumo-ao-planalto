<script setup>
import { ref, computed, watch } from 'vue'
import { PARTY_COLORS, PARTY_FOCUS, randomSlogan } from '../../game/ideas'

// Formulário para fundar um partido. Serve para o início do jogo e para o jogo em andamento.
const props = defineProps({
  ideo: { type: String, default: 'independente' },
  initial: { type: Object, default: null },
  cost: { type: Array, default: () => [] },
  reasons: { type: Array, default: () => [] },
  cta: { type: String, default: 'Fundar partido' },
})
const emit = defineEmits(['found', 'cancel'])

const name = ref(props.initial?.name || '')
const sigla = ref(props.initial?.sigla || '')
const slogan = ref(props.initial?.slogan || randomSlogan())
const color = ref(props.initial?.color || PARTY_COLORS[5])
const focus = ref(props.initial?.focus || 'votos')
let siglaEdited = !!props.initial

const STOP = ['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o']
watch(name, (v) => {
  if (siglaEdited) return
  const w = v.trim().split(/\s+/).filter((x) => x && !STOP.includes(x.toLowerCase()))
  sigla.value = w.map((x) => x[0]).join('').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)
})
const onSigla = () => {
  siglaEdited = true
  sigla.value = sigla.value.toUpperCase().replace(/[^A-Za-z]/g, '').slice(0, 6)
}
const IDEO = { esquerda: 'Esquerda', centro: 'Centro', direita: 'Direita', independente: 'Independente' }
const f = computed(() => PARTY_FOCUS.find((x) => x.id === focus.value))
const ok = computed(() => name.value.trim().length >= 4 && sigla.value.replace(/[^A-Za-z]/g, '').length >= 2 && !props.reasons.length)
const submit = () => ok.value && emit('found', { name: name.value.trim(), sigla: sigla.value.toUpperCase(), color: color.value, slogan: slogan.value.trim(), focus: focus.value })
</script>

<template>
  <div class="fnd">
    <div class="fnd-prev" :style="{ '--pc': color }">
      <div class="fnd-badge">{{ sigla || '???' }}</div>
      <div class="fnd-info">
        <b>{{ name || 'Nome do seu partido' }}</b>
        <small>“{{ slogan || '...' }}”</small>
        <div><span class="chip">{{ IDEO[ideo] }}</span><span class="chip up">{{ f.icon }} {{ f.text }}</span></div>
      </div>
    </div>

    <div class="fnd-grid">
      <label>Nome do partido
        <input v-model="name" maxlength="40" placeholder="Ex.: Movimento Cidadão Unido" />
      </label>
      <label>Sigla
        <input :value="sigla" maxlength="6" placeholder="MCU" @input="(e) => { sigla = e.target.value; onSigla() }" />
      </label>
    </div>
    <label>Slogan
      <span class="namerow"><input v-model="slogan" maxlength="50" /><button type="button" title="Sortear slogan" @click="slogan = randomSlogan()">🎲</button></span>
    </label>

    <label>Cor</label>
    <div class="swatches">
      <button v-for="c in PARTY_COLORS" :key="c" type="button" class="sw" :class="{ on: color === c }" :style="{ background: c }" :aria-label="c" @click="color = c"></button>
    </div>

    <label>Foco do partido (sua vantagem)</label>
    <div class="fnd-focus">
      <button v-for="o in PARTY_FOCUS" :key="o.id" type="button" class="opt" :class="{ sel: focus === o.id }" @click="focus = o.id">
        <b>{{ o.icon }} {{ o.name }}</b><small>{{ o.text }}</small>
      </button>
    </div>

    <div v-if="cost.length" class="fnd-cost"><span class="muted">Custo da fundação:</span><span v-for="(c, i) in cost" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
    <div v-for="r in reasons" :key="r" class="fnd-why">⛔ {{ r }}</div>

    <div class="row-end">
      <button v-if="initial" type="button" @click="emit('cancel')">Cancelar</button>
      <button type="button" class="primary" :disabled="!ok" @click="submit">✨ {{ cta }}</button>
    </div>
    <p v-if="!ok && !reasons.length" class="legend" style="margin-top: 6px">Dê um nome (4+ letras) e uma sigla (2+ letras) para liberar o botão.</p>
  </div>
</template>