<script setup>
import { computed, ref } from 'vue'
import { game, judRelNow, judAudMotivo, judAudiencia, procNow, procMotivo, procAgir } from '../../game/engine'
import { courtShort } from '../../game/engine'

const msg = ref('')
const rel = computed(() => (game.poder && game.poder.inst ? judRelNow() : 50))
const proc = computed(() => procNow())
const say = (r) => { msg.value = r ? r.txt : '' }
</script>

<template>
  <div>
    <h3 class="sub">⚖️ Justiça e instituições</h3>
    <p class="legend">
      A relação com o {{ courtShort() }} pesa nos julgamentos que envolvem você. Tribunais, Ministério Público e o Legislativo
      mandam casos para a Agenda. Imagem no chão, calor político e jogo sujo podem abrir um processo gradual de afastamento.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div class="sumbox">
      <b>Relação com o {{ courtShort() }}: {{ rel }}/100</b>
      <div class="bar"><i :style="{ width: rel + '%' }"></i></div>
      <div class="acts">
        <button type="button" :disabled="!!judAudMotivo()" @click="say(judAudiencia())">
          <b>🧑‍⚖️ Audiência com ministros</b>
          <small>Custa 1 de caixa. +8 na relação.</small>
          <small v-if="judAudMotivo()" class="why">🔒 {{ judAudMotivo() }}</small>
        </button>
      </div>
    </div>
    <div v-if="proc" class="sumbox">
      <b>🔨 {{ proc.nome }} em andamento: fase {{ proc.n }}/3, {{ proc.fase.nome }}</b>
      <p class="muted">{{ proc.fase.texto }} Faltam {{ proc.faltam }} rodada(s) para a próxima etapa. Votos a favor da sua permanência: {{ proc.votos }}% (chance de escapar {{ Math.round(proc.chance * 100) }}%).</p>
      <div class="acts">
        <button v-for="a in proc.acoes" :key="a.id" type="button" :disabled="!!procMotivo(a.id)" @click="say(procAgir(a.id))">
          <b>{{ a.icon }} {{ a.nome }}</b>
          <small>{{ a.desc }}</small>
          <small v-if="procMotivo(a.id)" class="why">🔒 {{ procMotivo(a.id) }}</small>
        </button>
      </div>
    </div>
  </div>
</template>
