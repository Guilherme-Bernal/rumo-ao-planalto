<script setup>
import { computed, ref } from 'vue'
import {
  game, isPresident, ameacasNow, guerraDefNow, ameacaDef, ameacaTitulo, ameacaDesc, ameacaMotivo, responderAmeaca,
  guerraAcoes, guerraMotivo, agirGuerra, guerraPoderNow,
} from '../../game/engine'

const pres = computed(() => isPresident())
const ams = computed(() => ameacasNow())
const g = computed(() => guerraDefNow())
const msg = ref('')
const resp = (i, id) => {
  const r = responderAmeaca(i, id)
  msg.value = r ? r.txt : ''
}
const agir = (id) => {
  const r = agirGuerra(id)
  msg.value = r ? r.txt : ''
}
void game
</script>

<template>
  <div v-if="pres && (ams.length || g)">
    <h3 class="sub">🚨 Ameaças e defesa nacional</h3>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div v-if="g" class="wcard" role="alert">
      <div class="row"><b>💥 Invasão em curso</b><span>faltam {{ g.left }} rodada(s)</span></div>
      <p class="legend">Os países agressores são fictícios. Sua força: <b>{{ guerraPoderNow() }}</b> · Força do inimigo: <b>{{ Math.round(g.E) }}</b>. A cada rodada o inimigo perde terreno se a sua força passar de 35. Aliados: {{ g.aliados }} · reservas: {{ g.mobil }}/3 · estado de guerra: {{ g.estado ? 'sim' : 'não' }}.</p>
      <div class="bar"><i :style="{ width: g.E + '%', background: 'var(--bad, #d9534f)' }"></i></div>
      <div class="acts">
        <button v-for="a in guerraAcoes()" :key="a.id" type="button" :disabled="!!guerraMotivo(a.id)" @click="agir(a.id)">
          <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small>
          <small v-if="guerraMotivo(a.id)" class="why">🔒 {{ guerraMotivo(a.id) }}</small>
          <small v-else-if="a.cash">-{{ a.cash }} Caixa · 1 ponto de defesa</small>
          <small v-else>1 ponto de defesa</small>
        </button>
      </div>
    </div>

    <div v-for="(a, i) in ams" :key="i" class="wcard" role="alert">
      <div class="row"><b>{{ ameacaDef(a.tipo).icon }} {{ ameacaTitulo(a) }}</b><span>{{ a.left }} rodada(s)</span></div>
      <p class="legend">{{ ameacaDesc(a) }}</p>
      <div class="acts">
        <button v-for="r in ameacaDef(a.tipo).resp" :key="r.id" type="button" :disabled="!!ameacaMotivo(i, r.id)" @click="resp(i, r.id)">
          <b>{{ r.icon }} {{ r.name }}</b><small>{{ r.desc }}</small>
          <small v-if="ameacaMotivo(i, r.id)" class="why">🔒 {{ ameacaMotivo(i, r.id) }}</small>
          <small v-else>{{ r.cash ? `-${r.cash} Caixa · ` : '' }}1 ponto de defesa</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wcard { padding: 10px 12px; margin: 8px 0; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 12px; background: rgba(255, 90, 90, 0.07); }
.row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
</style>
