<script setup>
import { computed, ref } from 'vue'
import {
  game, isPresident, worldPartners, m24Now, criseDef, criseResp, criseMotivo, criseAgir, embDefs, embMotivo, nomearEmb,
  viagemMotivo, viajar, viagemInfo, sancaoMotivo, sancionar, embargoMotivo, resolverEmbargo, espioAcoes, espioMotivo, espiar,
  eleicaoMotivo, apoiarEleicao,
} from '../../game/engine'

const pres = computed(() => isPresident())
const m = computed(() => m24Now())
const msg = ref('')
const alvo = ref('eua')
const say = (r) => { msg.value = r ? r.txt : '' }
const nome = (id) => (worldPartners().find((x) => x.id === id) || { name: id }).name
const paises = computed(() => worldPartners().filter((p) => p.id !== 'onu'))
void game
</script>

<template>
  <div v-if="pres">
    <h3 class="sub">🌐 Crises globais e política externa avançada</h3>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div v-if="m.crise" class="wcard" role="alert">
      <div class="row"><b>{{ criseDef(m.crise.id).icon }} {{ criseDef(m.crise.id).name }}</b><span>{{ m.crise.left }} rodada(s)</span></div>
      <p class="legend">{{ criseDef(m.crise.id).desc }}</p>
      <div class="acts">
        <button v-for="r in criseResp()" :key="r.id" type="button" :disabled="!!criseMotivo(r.id)" @click="say(criseAgir(r.id))">
          <b>{{ r.icon }} {{ r.name }}</b><small>{{ r.desc }}</small>
          <small v-if="criseMotivo(r.id)" class="why">🔒 {{ criseMotivo(r.id) }}</small>
          <small v-else>{{ r.cash ? `-${r.cash} Caixa · ` : '' }}1 ponto de diplomacia</small>
        </button>
      </div>
    </div>

    <div v-if="m.embargo" class="wcard" role="alert">
      <div class="row"><b>🚢 Embargo de {{ nome(m.embargo.quem) }}</b><span>{{ m.embargo.left }} rodada(s)</span></div>
      <p class="legend">As exportações sofrem a cada rodada.</p>
      <div class="acts">
        <button type="button" :disabled="!!embargoMotivo('negociar')" @click="say(resolverEmbargo('negociar'))"><b>🤝 Negociar o fim</b><small>-2 Caixa, relação +10</small><small v-if="embargoMotivo('negociar')" class="why">🔒 {{ embargoMotivo('negociar') }}</small></button>
        <button type="button" :disabled="!!embargoMotivo('omc')" @click="say(resolverEmbargo('omc'))"><b>⚖️ Recorrer à OMC</b><small>Depende da relação com a ONU</small><small v-if="embargoMotivo('omc')" class="why">🔒 {{ embargoMotivo('omc') }}</small></button>
      </div>
    </div>

    <div v-if="m.eleicao" class="wcard">
      <div class="row"><b>🗳️ Eleição em {{ nome(m.eleicao.pais) }}</b><span>{{ m.eleicao.left }} rodada(s)</span></div>
      <p class="legend">Quem vencer mudará a relação com o Brasil. Apoiar um lado dá mais ganho, mas se ele perder, a conta vem.</p>
      <p v-if="m.eleicao.apoio" class="legend">Sua posição: <b>{{ m.eleicao.apoio === 'aliado' ? 'apoio ao candidato amigo' : m.eleicao.apoio === 'oposto' ? 'apoio à oposição' : 'neutralidade' }}</b>.</p>
      <div v-else class="acts">
        <button type="button" :disabled="!!eleicaoMotivo()" @click="say(apoiarEleicao('aliado'))"><b>🤝 Apoiar o candidato amigo</b><small>-1 Caixa</small></button>
        <button type="button" :disabled="!!eleicaoMotivo()" @click="say(apoiarEleicao('oposto'))"><b>🥊 Apoiar a oposição</b><small>-1 Caixa</small></button>
        <button type="button" :disabled="!!eleicaoMotivo()" @click="say(apoiarEleicao('neutro'))"><b>🕊️ Ficar neutro</b><small>-1 Caixa</small></button>
        <small v-if="eleicaoMotivo()" class="why">🔒 {{ eleicaoMotivo() }}</small>
      </div>
    </div>

    <p class="legend"><b>Embaixadores, viagens e sanções</b>: um embaixador rende relação a cada rodada. A viagem oficial dá um empurrão (volta a ser possível em {{ viagemInfo().cooldown }} rodadas). Sanções esfriam a relação e machucam o comércio por 4 rodadas.</p>
    <div v-for="p in paises" :key="p.id" class="rel">
      <div class="row"><span>{{ p.ico }} <b>{{ p.name }}</b></span><span>
        {{ m.emb[p.id] ? '👔 ' + embDefs().find((e) => e.id === m.emb[p.id]).name : 'sem embaixador' }}
        <template v-if="m.sancoes.some((s) => s.alvo === p.id)"> · 🚫 sancionado</template></span></div>
      <div class="acts">
        <button v-for="e in embDefs()" :key="e.id" type="button" :disabled="!!embMotivo(p.id, e.id)" :title="e.desc" @click="say(nomearEmb(p.id, e.id))">
          <b>{{ e.icon }} {{ e.name }}</b><small v-if="embMotivo(p.id, e.id)" class="why">🔒 {{ embMotivo(p.id, e.id) }}</small><small v-else>{{ e.desc }}</small>
        </button>
        <button type="button" :disabled="!!viagemMotivo(p.id)" @click="say(viajar(p.id))"><b>✈️ Viagem oficial</b><small v-if="viagemMotivo(p.id)" class="why">🔒 {{ viagemMotivo(p.id) }}</small><small v-else>-{{ viagemInfo().cash }} Caixa</small></button>
        <button type="button" :disabled="!!sancaoMotivo(p.id)" @click="say(sancionar(p.id))"><b>🚫 Impor sanções</b><small v-if="sancaoMotivo(p.id)" class="why">🔒 {{ sancaoMotivo(p.id) }}</small><small v-else>Relação -10, comércio sofre</small></button>
      </div>
    </div>

    <p class="legend"><b>Espionagem e contraespionagem</b> (pontos de defesa). Rede de agentes: <b>{{ Math.round(m.espio.rede) }}</b> · Contrainteligência: <b>{{ Math.round(m.espio.contra) }}</b>.</p>
    <label class="legend">País-alvo da missão:
      <select v-model="alvo"><option v-for="p in paises" :key="p.id" :value="p.id">{{ p.name }}</option></select>
    </label>
    <div class="acts">
      <button v-for="a in espioAcoes()" :key="a.id" type="button" :disabled="!!espioMotivo(a.id, alvo)" :title="a.desc" @click="say(espiar(a.id, alvo))">
        <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small>
        <small v-if="espioMotivo(a.id, alvo)" class="why">🔒 {{ espioMotivo(a.id, alvo) }}</small><small v-else>-{{ a.cash }} Caixa</small>
      </button>
    </div>
  </div>
</template>

<style scoped>
.wcard { padding: 10px 12px; margin: 8px 0; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 12px; background: rgba(255, 90, 90, 0.07); }
.rel { margin: 10px 0; }
.row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
</style>
