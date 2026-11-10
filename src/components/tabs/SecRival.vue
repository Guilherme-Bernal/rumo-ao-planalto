<script setup>
import { ref, computed } from 'vue'
import { game, rvNow, rvEstagioInfo, rvAcoes, rvAcaoMotivo, rvAcao } from '../../game/engine'
import { TRAIT_NOMES } from '../../game/rival30'

const r = computed(() => rvNow())
const est = computed(() => rvEstagioInfo(r.value.estagio))
const msg = ref('')
const say = (x) => { msg.value = x ? x.txt : '' }
const nivel = (v) => (v >= 70 ? 'alto' : v >= 40 ? 'médio' : 'baixo')
</script>

<template>
  <div v-if="game.total >= 2" class="sumbox" style="margin-top: 12px">
    <b>🥊 O rival da sua carreira</b>
    <p class="lead" style="margin: 6px 0">
      <b>{{ r.nome }}</b> <span v-if="r.sigla" class="chip">{{ r.sigla }}</span>
      <span class="chip" :title="est.txt">{{ est.icon }} {{ est.nome }}</span>
    </p>
    <p class="muted">{{ est.txt }} Perfil de debate: <b>{{ TRAIT_NOMES[r.trait] || r.trait }}</b>. Contra você: {{ r.der }} derrota(s) e {{ r.vit }} vitória(s) dele nas urnas<template v-if="r.trocas">, {{ r.trocas }} troca(s) de partido</template><template v-if="r.voltas">, {{ r.voltas }} volta(s)</template>.</p>
    <div class="rvbars">
      <label>Força <small class="muted">{{ nivel(r.forca) }}</small><div class="bar"><i :style="{ width: r.forca + '%', background: 'var(--bad)' }"></i></div></label>
      <label>Ódio por você <small class="muted">{{ nivel(r.odio) }}</small><div class="bar"><i :style="{ width: r.odio + '%', background: '#fb923c' }"></i></div></label>
      <label>Estima por você <small class="muted">{{ nivel(r.estima) }}</small><div class="bar"><i :style="{ width: r.estima + '%', background: 'var(--good)' }"></i></div></label>
    </div>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div class="acts">
      <button v-for="a in rvAcoes()" :key="a.id" type="button" :disabled="!!rvAcaoMotivo(a.id)" :title="a.desc" @click="say(rvAcao(a.id))">
        <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small><small v-if="rvAcaoMotivo(a.id)" class="why">🔒 {{ rvAcaoMotivo(a.id) }}</small>
      </button>
    </div>
    <small v-for="(h, i) in r.hist.slice(0, 4)" :key="i" class="muted hl">r{{ h.r }}: {{ h.t }}</small>
  </div>
</template>

<style scoped>
.rvbars { display: grid; gap: 6px; margin: 8px 0; }
.rvbars label { font-size: .9rem; }
.hl { display: block; }
.acts { display: grid; gap: 6px; margin-top: 8px; }
.acts button { text-align: left; display: grid; gap: 2px; }
.why { color: var(--muted); }
</style>
