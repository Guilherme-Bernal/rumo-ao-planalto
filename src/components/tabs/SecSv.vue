<script setup>
import { computed, ref } from 'vue'
import { game, isExec, svView, svAcoesNow, svAcaoMotivo, svAcaoAgir, svEmendaMotivo, svEmenda } from '../../game/engine'

const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
const exec = computed(() => isExec())
const v = computed(() => { game.total; return svView() })
const acoes = computed(() => { game.total; return svAcoesNow() })
const tone = (x, bom) => { const y = bom ? x : 100 - x; return y < 35 ? 'var(--bad)' : y < 60 ? 'var(--warn)' : 'var(--good)' }
const grupos = computed(() => [{ k: 'saude', t: '🏥 Saúde', l: v.value.saude }, { k: 'edu', t: '🏫 Escolas', l: v.value.edu }])
</script>

<template>
  <div>
    <h3 class="sub">🏥 Rede de saúde e escolas</h3>
    <p class="legend">
      A rede perde força todo mês e volta com investimento. Rede fraca derruba o social e a popularidade, e abre espaço para surtos, filas e greves na Agenda.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="g in grupos" :key="g.k">
      <div v-for="m in g.l" :key="m.id" class="slider">
        <div class="row"><span>{{ m.icon }} {{ m.nome }}</span><b>{{ m.v }}</b></div>
        <div class="bar"><i :style="{ width: m.v + '%', background: tone(m.v, m.bom) }"></i></div>
      </div>
    </div>
    <div v-if="exec" class="acts">
      <button v-for="a in acoes" :key="a.id" type="button" :disabled="!!svAcaoMotivo(a.id)" @click="say(svAcaoAgir(a.id))">
        <b>{{ a.icon }} {{ a.nome }}</b>
        <small>{{ a.desc }} Custa {{ a.cash }}.</small>
        <small v-if="svAcaoMotivo(a.id)" class="why">🔒 {{ svAcaoMotivo(a.id) }}</small>
      </button>
    </div>
    <div v-else class="acts">
      <button type="button" :disabled="!!svEmendaMotivo('saude')" @click="say(svEmenda('saude'))"><b>🏥 Emenda para a saúde</b><small>Custa 1 de caixa.</small><small v-if="svEmendaMotivo('saude')" class="why">🔒 {{ svEmendaMotivo('saude') }}</small></button>
      <button type="button" :disabled="!!svEmendaMotivo('edu')" @click="say(svEmenda('edu'))"><b>🏫 Emenda para a educação</b><small>Custa 1 de caixa.</small><small v-if="svEmendaMotivo('edu')" class="why">🔒 {{ svEmendaMotivo('edu') }}</small></button>
    </div>
  </div>
</template>
