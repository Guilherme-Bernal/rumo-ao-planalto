<script setup>
import { computed, ref } from 'vue'
import {
  game, gruposDef, pesqSegMotivo, pesqSegEncomendar, pesqSegNow, focoNow, focoMotivo, focar, boatosNow, boatosDanoNow,
  boatoAcoes, boatoMotivo, boatoAgir, debateMotivo, debateAbrir, country,
} from '../../game/engine'

const e = computed(() => game.election)
const pesq = computed(() => pesqSegNow())
const foco = computed(() => focoNow())
const boatos = computed(() => boatosNow())
const msg = ref('')
const aberto = ref(false)
const gShare = (id) => (pesq.value ? pesq.value.grupos.find((g) => g.id === id) : null)
const cor = (v) => (v < 45 ? 'var(--bad)' : v < 50 ? 'var(--warn)' : 'var(--good)')
const majoritaria = computed(() => ['presidente', 'governador'].includes(e.value && e.value.target))
const estados = computed(() => (pesq.value ? [...pesq.value.estados].sort((a, b) => a.share - b.share) : []))
const estadoNome = (id) => (country().regions.find((r) => r.id === id) || { name: id }).name
void estadoNome
const say = (r) => { msg.value = r ? r.txt || '' : '' }
const statusTxt = (b) => ({ solto: 'circulando', desmentido: 'desmentido', explicado: 'explicado', processado: 'processado', ignorado: 'ignorado' })[b.estado]
</script>

<template>
  <div v-if="e" class="ele27">
    <div class="sumbox minirow">
      <button type="button" :disabled="!!debateMotivo()" :title="debateMotivo()" @click="debateAbrir">📺 Debate na TV com réplica e tréplica <small>(opcional, 1 vez)</small></button>
      <span v-if="e.tvDone" class="muted">Efeito do debate: {{ e.tv > 0 ? '+' : '' }}{{ e.tv }} ponto(s)</span>
    </div>

    <details class="sumbox" :open="aberto" @toggle="aberto = $event.target.open">
      <summary><b>📊 Pesquisa por grupo e estado</b> <small class="muted">(1 de Caixa por turno)</small></summary>
      <p class="muted">Mostra como cada grupo vê você e onde focar. Cada foco custa 1 de Caixa e dá um bônus pequeno na eleição.</p>
      <button type="button" :disabled="!!pesqSegMotivo()" :title="pesqSegMotivo()" @click="pesqSegEncomendar">📋 Encomendar pesquisa segmentada</button>
      <small v-if="pesqSegMotivo()" class="why">🔒 {{ pesqSegMotivo() }}</small>
      <template v-if="pesq">
        <div v-for="g in gruposDef()" :key="g.id" class="grp">
          <div class="row"><span>{{ g.icon }} <b>{{ g.name }}</b> <small class="muted">{{ g.peso }}% do eleitorado</small></span><b :style="{ color: cor(gShare(g.id).share) }">{{ gShare(g.id).share }}%</b></div>
          <div class="bar"><i :style="{ width: gShare(g.id).share + '%', background: cor(gShare(g.id).share) }"></i></div>
          <button type="button" class="mini" :disabled="!!focoMotivo('g', g.id)" :title="focoMotivo('g', g.id)" @click="focar('g', g.id)">🎯 Focar ({{ foco.g[g.id] || 0 }}/2)</button>
        </div>
        <template v-if="majoritaria">
          <p class="legend"><b>Estados</b>: do mais fraco ao mais forte. Foque até 3.</p>
          <div v-for="r in estados" :key="r.id" class="row est">
            <span>{{ r.name }}</span>
            <span><b :style="{ color: cor(r.share) }">{{ r.share }}%</b>
              <button type="button" class="mini" :disabled="!!focoMotivo('est', r.id)" :title="focoMotivo('est', r.id)" @click="focar('est', r.id)">{{ foco.est[r.id] ? '🎯 em foco' : '🎯 Focar' }}</button></span>
          </div>
        </template>
      </template>
    </details>

    <div v-if="boatos.length" class="sumbox">
      <b>📵 Boatos e checagem</b> <small class="muted">dano atual na eleição: -{{ boatosDanoNow() }} ponto(s)</small>
      <p class="muted">Nem todo boato é falso. Antes de reagir, vale conferir: desmentir uma verdade sai caro.</p>
      <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
      <div v-for="b in boatos" :key="b.id" class="bt">
        <div>{{ b.revelado ? (b.real ? '✅ VERDADEIRO' : '🚫 FALSO') : '❓' }} · <small class="muted">{{ statusTxt(b) }} · dano -{{ b.dano }}</small></div>
        <p>“{{ b.texto }}”</p>
        <div class="acts">
          <button v-for="a in boatoAcoes()" :key="a.id" type="button" class="mini" :disabled="!!boatoMotivo(b.id, a.id)" :title="boatoMotivo(b.id, a.id) || a.desc" @click="say(boatoAgir(b.id, a.id))">{{ a.icon }} {{ a.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ele27 { margin: 8px 0; }
.grp { margin: 8px 0; }
.row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.est { font-size: 0.86rem; }
.bt { margin: 8px 0; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.12); }
.bt p { margin: 3px 0; }
.acts { display: flex; flex-wrap: wrap; gap: 5px; }
.mini { padding: 3px 8px; font-size: 0.8rem; }
.why { display: block; color: var(--warn); }
</style>
