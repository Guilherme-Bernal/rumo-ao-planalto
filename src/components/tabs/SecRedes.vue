<script setup>
import { ref, computed } from 'vue'
import { game, redesNow, redesPautas, redesPautaMotivo, redesPauta, redesOndaResps, redesRespMotivo, redesResponder, redesOndaDef } from '../../game/engine'

const r = computed(() => redesNow())
const onda = computed(() => (r.value.onda ? { ...r.value.onda, def: redesOndaDef(r.value.onda.id) } : null))
const msg = ref('')
const say = (x) => { msg.value = x ? x.txt : '' }
const humorTxt = computed(() => (r.value.humor >= 70 ? '😍 Povo animado' : r.value.humor >= 45 ? '🙂 Neutro' : r.value.humor >= 28 ? '😠 Azedo' : '🤬 Revoltado'))
</script>

<template>
  <div v-if="game.total >= 2" class="sn-box">
    <h3>🌡️ Humor do povo e boatos</h3>
    <p class="muted">{{ humorTxt }}. Lance pautas para mover o clima e responda às ondas de desinformação antes que elas cresçam.</p>
    <div class="bar" role="img" :aria-label="'Humor do povo ' + Math.round(r.humor) + ' de 100'"><i :style="{ width: r.humor + '%', background: r.humor < 35 ? 'var(--bad)' : 'var(--good)' }"></i></div>
    <div v-if="onda" class="aviso bad" role="alert" style="margin: 8px 0">
      {{ onda.def.icon }} <b>{{ onda.def.nome }}</b> <small>(força {{ Math.round(onda.forca) }}, some em {{ onda.left }} rodada(s))</small><br />
      <small>{{ onda.def.texto }}</small>
      <div class="acts" style="margin-top: 6px">
        <button v-for="o in redesOndaResps()" :key="o.id" type="button" :disabled="!!redesRespMotivo(o.id)" :title="o.desc" @click="say(redesResponder(o.id))"><b>{{ o.icon }} {{ o.name }}</b><small>{{ o.desc }}</small></button>
      </div>
    </div>
    <p v-else class="muted">Nenhuma onda ativa agora.</p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <h4 style="margin: 8px 0 4px">📣 Lançar uma pauta</h4>
    <div class="acts">
      <button v-for="p in redesPautas()" :key="p.id" type="button" :disabled="!!redesPautaMotivo(p.id)" :title="p.desc" @click="say(redesPauta(p.id))"><b>{{ p.icon }} {{ p.name }}</b><small>{{ p.desc }}</small><small v-if="redesPautaMotivo(p.id)" class="muted">🔒 {{ redesPautaMotivo(p.id) }}</small></button>
    </div>
    <small v-for="(h, i) in r.hist.slice(0, 3)" :key="i" class="muted" style="display: block">r{{ h.r }}: {{ h.t }}</small>
  </div>
</template>

<style scoped>
.acts { display: grid; gap: 6px; }
.acts button { text-align: left; display: grid; gap: 2px; }
.aviso { padding: 8px 10px; border-radius: 10px; border: 1px solid var(--bad); }
</style>
