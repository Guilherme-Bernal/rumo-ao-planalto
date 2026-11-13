<script setup>
import { computed, ref } from 'vue'
import { segmentosNow, promessasNow, popAcaoMotivo, popAgir } from '../../game/engine'
import { PAUTA_ACOES } from '../../game/bloco40'

const msg = ref('')
const segs = computed(() => segmentosNow())
const proms = computed(() => promessasNow())
const say = (r) => { msg.value = r ? r.txt : '' }
const cor = (v) => (v >= 65 ? 'var(--good)' : v <= 30 ? 'var(--bad)' : 'var(--accent)')
</script>

<template>
  <div>
    <h3 class="sub">📢 População e pautas</h3>
    <p class="legend">
      A população se divide em segmentos, cada um com sua pauta. Leis por tema agradam quem quer aquele tema e irritam quem é contra.
      Segmento contrariado vai se mobilizando e acaba indo à rua. Promessa feita e não cumprida em 8 rodadas volta em dobro.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <p v-for="m in proms" :key="m.seg + m.tema" class="aviso">📝 Você prometeu a {{ m.segNome.toLowerCase() }}: lei de {{ m.temaNome.toLowerCase() }}. Prazo: {{ Math.max(0, m.resta) }} rodada(s).</p>
    <div v-for="s in segs" :key="s.id" class="sumbox srow">
      <div>{{ s.icon }} <b>{{ s.nome }}</b> <small class="muted">apoio {{ s.apoio }} · mobilização {{ s.mob }}</small></div>
      <small class="muted">{{ s.fala }}. Pauta agora: <b>{{ s.pautaNome }}</b>. Contra: {{ s.contra.join(', ') }}.</small>
      <div class="bar"><i :style="{ width: s.apoio + '%', background: cor(s.apoio) }"></i></div>
      <div class="acts">
        <button v-for="a in PAUTA_ACOES" :key="a.id" type="button" :disabled="!!popAcaoMotivo(s.id, a.id)" :title="a.desc" @click="say(popAgir(s.id, a.id))">
          <b>{{ a.icon }} {{ a.nome }}</b><small>{{ a.desc }}</small><small v-if="popAcaoMotivo(s.id, a.id)" class="why">🔒 {{ popAcaoMotivo(s.id, a.id) }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.srow { margin-top: 8px; }
</style>
