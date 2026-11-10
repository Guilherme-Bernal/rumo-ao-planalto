<script setup>
import { ref, computed } from 'vue'
import { misView, misAcoes, misAcaoMotivo, misAcao } from '../../game/engine'

const v = computed(() => misView())
const msg = ref('')
const say = (x) => { msg.value = x ? x.txt : '' }
const nivel = computed(() => (v.value ? (v.value.m.avanco >= 75 ? 'quase explodindo' : v.value.m.avanco >= 45 ? 'avançando' : 'incubando') : ''))
</script>

<template>
  <div v-if="v" class="sumbox" style="margin-top: 12px">
    <b>🕸️ A teia por trás do governo</b>
    <template v-if="v.fim">
      <p class="muted" style="margin: 6px 0">{{ v.fim.icon }} {{ v.fim.txt }}</p>
    </template>
    <template v-else>
      <p class="muted" style="margin: 6px 0">{{ v.intro }}</p>
      <label style="font-size: .9rem">Avanço da conspiração <small class="muted">{{ nivel }}</small>
        <div class="bar" role="img" :aria-label="'Avanço da conspiração ' + Math.round(v.m.avanco) + ' de 100'"><i :style="{ width: v.m.avanco + '%', background: v.m.avanco >= 75 ? 'var(--bad)' : '#fb923c' }"></i></div>
      </label>
      <p style="margin: 8px 0"><b>Pistas ({{ v.pistas.length }}/{{ v.total }})</b></p>
      <small v-for="(p, i) in v.pistas" :key="i" class="muted" style="display: block">🔎 {{ p }}</small>
      <small v-if="!v.pistas.length" class="muted">Nada ainda. Investigue, ou espere as pontas soltas aparecerem.</small>
      <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
      <div class="acts">
        <button v-for="a in misAcoes()" :key="a.id" type="button" :disabled="!!misAcaoMotivo(a.id)" :title="a.desc" @click="say(misAcao(a.id))">
          <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small><small v-if="misAcaoMotivo(a.id)" class="muted">🔒 {{ misAcaoMotivo(a.id) }}</small>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.acts { display: grid; gap: 6px; margin-top: 8px; }
.acts button { text-align: left; display: grid; gap: 2px; }
</style>
