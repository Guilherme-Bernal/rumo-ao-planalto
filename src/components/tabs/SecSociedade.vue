<script setup>
import { computed, ref } from 'vue'
import {
  socNow, setoresDef, setorAcoes, setorMotivo, setorAgir, setorHumor, movDef, movResp, movMotivo, movAgir,
  veiculos, midiaAcoes, midiaMotivo, midiaAgir, linhaDe, catastDef, catastResp, catastMotivo, catastAgir,
} from '../../game/engine'

const sc = computed(() => socNow())
const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
</script>

<template>
  <div>
    <h3 class="sub">🏛️ Economia e sociedade</h3>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div v-if="sc.catast" class="wcard" role="alert">
      <div class="row"><b>{{ catastDef(sc.catast.id).icon }} {{ catastDef(sc.catast.id).name }}</b><span>{{ sc.catast.left }} rodada(s)</span></div>
      <p class="legend">{{ catastDef(sc.catast.id).desc }} Cada rodada sem resposta custa popularidade.</p>
      <div class="acts">
        <button v-for="r in catastResp()" :key="r.id" type="button" :disabled="!!catastMotivo(r.id)" @click="say(catastAgir(r.id))">
          <b>{{ r.icon }} {{ r.name }}</b><small>{{ r.desc }}</small>
          <small v-if="catastMotivo(r.id)" class="why">🔒 {{ catastMotivo(r.id) }}</small>
          <small v-else-if="r.cash">-{{ r.cash }} Caixa</small>
        </button>
      </div>
    </div>

    <div v-for="(mv, i) in sc.movs" :key="mv.id + i" class="wcard" role="alert">
      <div class="row"><b>{{ movDef(mv.id).icon }} {{ movDef(mv.id).name }}</b><span>{{ mv.left }} rodada(s)</span></div>
      <p class="legend">Liderança: <b>{{ mv.quem }}</b>{{ mv.volta ? ' (voltou mais forte)' : '' }}. Pauta: {{ movDef(mv.id).pauta }}.</p>
      <div class="acts">
        <button v-for="r in movResp()" :key="r.id" type="button" :disabled="!!movMotivo(i, r.id)" @click="say(movAgir(i, r.id))">
          <b>{{ r.icon }} {{ r.name }}</b><small>{{ r.desc }}</small>
          <small v-if="movMotivo(i, r.id)" class="why">🔒 {{ movMotivo(i, r.id) }}</small>
          <small v-else-if="r.cash">-{{ r.cash }} Caixa</small>
        </button>
      </div>
    </div>

    <p class="legend"><b>Setores econômicos</b>: satisfeitos, dão bônus por rodada. Em revolta, a bancada do setor ataca você no Congresso.</p>
    <div v-for="s in setoresDef()" :key="s.id" class="rel">
      <div class="row"><span>{{ s.icon }} <b>{{ s.name }}</b> <small class="muted">{{ s.bancada }}</small></span><span>{{ Math.round(sc.setores[s.id]) }} · {{ setorHumor(sc.setores[s.id]) }}</span></div>
      <div class="bar"><i :style="{ width: sc.setores[s.id] + '%', background: 'var(--accent)' }"></i></div>
      <small class="muted">Pede: {{ s.agrada }}</small>
      <div class="acts">
        <button v-for="a in setorAcoes()" :key="a.id" type="button" :disabled="!!setorMotivo(s.id, a.id)" :title="a.desc" @click="say(setorAgir(s.id, a.id))">
          <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small>
          <small v-if="setorMotivo(s.id, a.id)" class="why">🔒 {{ setorMotivo(s.id, a.id) }}</small>
          <small v-else-if="a.cash">-{{ a.cash }} Caixa</small>
        </button>
      </div>
    </div>

    <p class="legend"><b>Mídia independente</b>: cada veículo tem linha editorial própria e a opinião deles muda com seu desempenho.</p>
    <div v-for="v in veiculos()" :key="v.id" class="rel">
      <div class="row"><span>{{ v.icon }} <b>{{ v.name }}</b> <small class="muted">{{ v.tipo }} · audiência {{ v.aud }}</small></span><span>{{ sc.midia[v.id].calado > 0 ? '🤐 calado' : linhaDe(sc.midia[v.id].rel) }}</span></div>
      <div class="bar"><i :style="{ width: sc.midia[v.id].rel + '%', background: 'var(--accent)' }"></i></div>
      <div class="acts">
        <button v-for="a in midiaAcoes()" :key="a.id" type="button" :disabled="!!midiaMotivo(v.id, a.id)" :title="a.desc" @click="say(midiaAgir(v.id, a.id))">
          <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small>
          <small v-if="midiaMotivo(v.id, a.id)" class="why">🔒 {{ midiaMotivo(v.id, a.id) }}</small>
          <small v-else-if="a.cash">-{{ a.cash }} Caixa</small>
        </button>
      </div>
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
