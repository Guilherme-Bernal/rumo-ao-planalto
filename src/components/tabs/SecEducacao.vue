<script setup>
import { computed, ref } from 'vue'
import { game, eduNow, cienNow, eduActionsNow, eduCan, eduAgir, temUniv, isExec, REITORES, reitorAtual, nomearReitor, exeCan } from '../../game/engine'

const msg = ref('')
const edu = computed(() => Math.round(eduNow()))
const acts = computed(() => eduActionsNow())
const reitor = computed(() => reitorAtual())
const uni = computed(() => temUniv())
const exe = computed(() => isExec())
const tone = computed(() => (edu.value < 35 ? 'var(--bad)' : edu.value < 60 ? 'var(--warn)' : 'var(--good)'))
function go(fn, ...a) {
  const r = fn(...a)
  if (!r) return
  msg.value = r.a ? (r.a.polemic ? 'A medida dividiu opiniões.' + (r.greve ? ' Professores entraram em greve.' : '') : 'Educação reforçada. O efeito vem com o tempo.') : `Reitoria definida: ${r.r.name.toLowerCase()}.`
}
</script>

<template>
  <div>
    <h3 class="sub">🎓 Educação e universidade</h3>
    <p class="legend">
      Índice de educação: <b>{{ edu }}</b>/100 · pesquisa: {{ cienNow() }}/8. Sobe devagar, cai um pouco a cada rodada e rende economia, segurança e popularidade nas rodadas seguintes, inclusive nos próximos cargos.
    </p>
    <div class="bar" style="margin-bottom: 8px"><i :style="{ width: edu + '%', background: tone }"></i></div>
    <p v-if="msg" class="sumbox">{{ msg }}</p>
    <p class="legend">Uma ação de educação por rodada{{ exe ? '' : ' (como legislador, o efeito é menor e o custo também)' }}.</p>
    <div class="acts">
      <button v-for="a in acts" :key="a.id" type="button" :disabled="!eduCan()" :title="a.desc" @click="go(eduAgir, a.id)">
        <b>{{ a.icon }} {{ a.name }}</b>
        <small>{{ a.desc }}</small>
      </button>
    </div>
    <template v-if="uni && exe">
      <h3 class="sub">🏛️ Reitoria <small class="muted">{{ reitor ? '· ' + reitor.name : '· sem definição neste mandato' }}</small></h3>
      <div v-if="!reitor" class="acts">
        <button v-for="r in REITORES" :key="r.id" type="button" :disabled="!exeCan('reitor')" :title="r.desc" @click="go(nomearReitor, r.id)">
          <b>{{ r.icon }} {{ r.name }}</b><small>{{ r.desc }}</small>
        </button>
      </div>
    </template>
  </div>
</template>
