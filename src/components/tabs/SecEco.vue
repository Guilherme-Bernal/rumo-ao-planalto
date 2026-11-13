<script setup>
import { computed, ref } from 'vue'
import { ecoSetoresNow, ecoNow, ecoSetorMotivo, ecoPedirDoacao } from '../../game/engine'

const msg = ref('')
const setores = computed(() => ecoSetoresNow())
const eco = computed(() => ecoNow())
const say = (r) => { msg.value = r ? r.txt : '' }
const cor = (s) => (s >= 65 ? 'var(--good)' : s <= 30 ? 'var(--bad)' : 'var(--accent)')
</script>

<template>
  <div>
    <h3 class="sub">💼 Doações, favores e greves</h3>
    <p class="legend">
      Setores satisfeitos (a satisfação está em Economia e sociedade) podem doar para a campanha, mas depois cobram favor. Os contrariados pedem coisas, cobram caro e chegam à greve.
      Doações demais atraem investigação. Doações recebidas: <b>{{ eco.doacoes }}</b>.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="s in setores" :key="s.id" class="sumbox srow">
      <div>{{ s.icon }} <b>{{ s.nome }}</b> <small class="muted">satisfação {{ s.sat }}{{ s.forte ? ' · forte no seu estado' : '' }}{{ s.divida ? ' · você deve ' + s.divida + ' favor(es)' : '' }}</small></div>
      <div class="bar"><i :style="{ width: s.sat + '%', background: cor(s.sat) }"></i></div>
      <div class="acts">
        <button type="button" :disabled="!!ecoSetorMotivo(s.id, 'doacao')" @click="say(ecoPedirDoacao(s.id))">
          <b>💼 Pedir doação</b><small>Entra caixa, mas fica devendo favor.</small><small v-if="ecoSetorMotivo(s.id, 'doacao')" class="why">🔒 {{ ecoSetorMotivo(s.id, 'doacao') }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.srow { margin-top: 8px; }
</style>
