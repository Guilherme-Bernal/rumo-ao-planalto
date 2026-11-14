<script setup>
import { computed, ref } from 'vue'
import { game, isExec, ambView, ambAcoesNow, ambAcaoMotivo, ambAcaoAgir, ambEmendaMotivo, ambEmenda } from '../../game/engine'

const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
const exec = computed(() => isExec())
const mets = computed(() => { game.total; return ambView() })
const acoes = computed(() => { game.total; return ambAcoesNow() })
const tone = (x) => (x < 35 ? 'var(--bad)' : x < 60 ? 'var(--warn)' : 'var(--good)')
</script>

<template>
  <div>
    <h3 class="sub">🌳 Meio ambiente, clima e Amazônia</h3>
    <p class="legend">
      Floresta e clima respondem à fiscalização, ao setor produtivo e à pressão do mundo. Proteger a floresta pesa no agro, liberar pesa na imagem e nas relações lá fora.
      Queimadas, secas, enchentes e desastres chegam na Agenda como decisão.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="m in mets" :key="m.id" class="slider">
      <div class="row"><span>{{ m.icon }} {{ m.nome }}</span><b>{{ m.v }}</b></div>
      <div class="bar"><i :style="{ width: m.v + '%', background: tone(m.v) }"></i></div>
    </div>
    <div v-if="exec" class="acts">
      <button v-for="a in acoes" :key="a.id" type="button" :disabled="!!ambAcaoMotivo(a.id)" @click="say(ambAcaoAgir(a.id))">
        <b>{{ a.icon }} {{ a.nome }}</b><small>{{ a.desc }} {{ a.cash ? 'Custa ' + a.cash + '.' : '' }}</small>
        <small v-if="ambAcaoMotivo(a.id)" class="why">🔒 {{ ambAcaoMotivo(a.id) }}</small>
      </button>
    </div>
    <div v-else class="acts">
      <button type="button" :disabled="!!ambEmendaMotivo()" @click="say(ambEmenda())">
        <b>🌳 Emenda para áreas verdes e defesa civil</b><small>Custa 1 de caixa.</small>
        <small v-if="ambEmendaMotivo()" class="why">🔒 {{ ambEmendaMotivo() }}</small>
      </button>
    </div>
  </div>
</template>
