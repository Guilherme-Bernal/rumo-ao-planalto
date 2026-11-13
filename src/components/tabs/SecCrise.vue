<script setup>
import { computed, ref } from 'vue'
import { criseInfoNow, criseEscalasNow, segmentosNow, revoltaMotivo, revoltaLancar, revoltaChance, revoltaAlvo } from '../../game/engine'
import { ESCALAS, REVOLTA } from '../../game/bloco42'

const msg = ref('')
const info = computed(() => criseInfoNow())
const escalas = computed(() => criseEscalasNow().map((k) => ESCALAS[k]))
const segs = computed(() => segmentosNow())
const say = (r) => { msg.value = r ? r.txt : '' }
</script>

<template>
  <div>
    <h3 class="sub">🔥 Crises e revoltas</h3>
    <p class="legend">
      Pelo seu cargo, você enfrenta crises de escala {{ escalas.map((e) => e.icon + ' ' + e.nome.toLowerCase()).join(', ') }}. Elas chegam na Agenda como decisão.
      Crise ignorada ou mal resolvida pode virar revolta. Crises vistas: <b>{{ info.vistas }}/{{ info.total }}</b> · Revoltas: <b>{{ info.rev }}</b> · Resolvidas: <b>{{ info.resolvidas }}</b>.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div class="sumbox">
      <b>📢 Lançar mobilização contra {{ revoltaAlvo() }}</b>
      <p class="muted">Leve um segmento já esquentado às ruas. Custa {{ REVOLTA.custo }} de caixa e só funciona com mobilização de {{ REVOLTA.minMob }} ou mais. Se der certo, a pauta ganha voz; se falhar, a conta é sua.</p>
      <div class="acts">
        <button v-for="s in segs" :key="s.id" type="button" :disabled="!!revoltaMotivo(s.id)" @click="say(revoltaLancar(s.id))">
          <b>{{ s.icon }} {{ s.nome }}</b>
          <small>Mobilização {{ s.mob }} · chance de dar certo {{ Math.round(revoltaChance(s.id) * 100) }}%</small>
          <small v-if="revoltaMotivo(s.id)" class="why">🔒 {{ revoltaMotivo(s.id) }}</small>
        </button>
      </div>
    </div>
  </div>
</template>
