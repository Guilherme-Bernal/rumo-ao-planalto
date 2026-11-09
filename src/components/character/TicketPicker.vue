<script setup>
import { ref, computed } from 'vue'
import { game, ticketSpec, chooseTicket, viceList, suplList } from '../../game/engine'

const spec = computed(() => ticketSpec())
const vice = ref(null)
const supl = ref([])
const level = (a) => (a >= 0.4 ? 'alto' : a >= 0.15 ? 'médio' : 'baixo')
const effs = (p) =>
  Object.entries(p || {})
    .map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${k}`)
    .join(' ')

function toggle(id) {
  const i = supl.value.indexOf(id)
  if (i >= 0) supl.value.splice(i, 1)
  else if (supl.value.length < spec.value.supl) supl.value.push(id)
}
const ready = computed(() => (!spec.value.vice || vice.value) && supl.value.length === spec.value.supl)
const confirm = () => chooseTicket(vice.value, supl.value)
</script>

<template>
  <div class="sumbox" style="margin-top: 0">
    <b>🤝 Feche a chapa</b>
    <p class="muted" v-if="spec.vice">
      Para {{ spec.office.name }} você disputa em chapa com um vice. Quem tem apetite pelo poder pode conspirar durante o mandato.
    </p>
    <div v-if="spec.vice" class="choices">
      <button v-for="v in viceList()" :key="v.id" class="act" :style="vice === v.id ? 'outline: 2px solid #3a9; outline-offset: -2px' : ''" :disabled="!!v.illegal" @click="vice = v.id">
        <b>{{ v.name }} <span v-if="!v.illegal" class="chip">+{{ v.vote }} voto · apetite {{ level(v.amb) }}</span></b>
        <small v-if="v.illegal">🔒 {{ v.illegal }}</small>
        <small v-else>{{ v.desc }}</small>
      </button>
    </div>
    <p class="muted" v-if="spec.supl">
      {{ spec.supl === 2 ? 'O senador é eleito com dois suplentes que ele escolhe.' : 'Escolha o suplente da sua lista. Ele assume a cadeira nas licenças e afastamentos.' }}
      Selecione {{ spec.supl }}.
    </p>
    <div v-if="spec.supl" class="choices">
      <button v-for="s in suplList()" :key="s.id" class="act" :style="supl.includes(s.id) ? 'outline: 2px solid #3a9; outline-offset: -2px' : ''" @click="toggle(s.id)">
        <b>{{ s.name }} <span class="chip">+{{ s.vote }} voto</span></b>
        <small>{{ s.desc }}</small>
      </button>
    </div>
    <button class="primary" style="width: 100%; margin-top: 8px" :disabled="!ready" @click="confirm">Fechar a chapa</button>
  </div>
</template>