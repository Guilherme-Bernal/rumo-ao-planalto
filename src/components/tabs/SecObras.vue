<script setup>
import { computed, ref } from 'vue'
import { obrasNow, obrasDisponiveis, obraCusto, obraNotas, obraMotivo, obraIniciar, obraLimite, obraDef } from '../../game/engine'

const msg = ref('')
const st = computed(() => obrasNow())
const lista = computed(() => obrasDisponiveis())
const fxTxt = (p) => Object.entries(p).map(([k, v]) => `+${v} ${NOME[k] || k}`).join(' · ')
const NOME = { soc: 'Serviços', seg: 'Segurança', eco: 'Economia', cash: 'Caixa', img: 'Imagem', pop: 'Popularidade' }
function go(id) {
  const r = obraIniciar(id)
  msg.value = r ? `Obra iniciada: ${r.def.nome}. Fica pronta em ${r.def.prazo} rodada(s).` : ''
}
const pct = (b) => Math.round((100 * (b.prazo - b.left)) / b.prazo)
</script>

<template>
  <div>
    <h3 class="sub">🏗️ Obras</h3>
    <p class="legend">
      Obras levam rodadas para ficar prontas e podem dar problema no caminho. Depois de prontas, rendem um pouco a cada rodada, com um custo pequeno de manutenção.
      Uma obra nova por rodada, até {{ obraLimite() }} ao mesmo tempo.
    </p>
    <p v-if="msg" class="sumbox">{{ msg }}</p>
    <div v-if="st.andamento.length" class="sumbox">
      <b>Em andamento</b>
      <div v-for="b in st.andamento" :key="b.uid" class="orow">
        <span>{{ obraDef(b.id).icon }}</span>
        <span class="muted"><b>{{ obraDef(b.id).nome }}</b>: {{ b.left }} rodada(s) para ficar pronta{{ b.enxuta ? ' · projeto enxuto' : '' }}</span>
        <div class="bar"><i :style="{ width: pct(b) + '%', background: 'var(--good)' }"></i></div>
      </div>
    </div>
    <p v-if="st.prontas.length" class="legend">✅ Prontas: {{ st.prontas.length }}. Elas rendem a cada rodada (um pouco menos fora da sua esfera de governo).</p>
    <div class="acts">
      <button v-for="o in lista" :key="o.id" type="button" :disabled="!!obraMotivo(o.id)" :title="obraMotivo(o.id) || o.nome" @click="go(o.id)">
        <b>{{ o.icon }} {{ o.nome }}</b>
        <small>{{ o.tipo }} · {{ o.prazo }} rodadas · <span class="dn">-{{ obraCusto(o) }} Caixa</span></small>
        <small>Pronta: {{ fxTxt(o.pass) }} por rodada</small>
        <small v-for="n in obraNotas(o)" :key="n" class="ctxtag">{{ n }}</small>
        <small v-if="obraMotivo(o.id)" class="why">🔒 {{ obraMotivo(o.id) }}</small>
      </button>
    </div>
  </div>
</template>

<style scoped>
.orow { display: grid; grid-template-columns: 24px 1fr; gap: 4px 8px; margin-top: 6px; align-items: center; }
.orow .bar { grid-column: 1 / -1; }
.ctxtag { display: inline-block; margin-top: 2px; padding: 1px 6px; border-radius: 8px; background: color-mix(in srgb, var(--accent, #4a7) 18%, transparent); font-size: 0.72rem; }
</style>
