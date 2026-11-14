<script setup>
import { computed, ref } from 'vue'
import { game, crView, crAcoesNow, crAcaoMotivo, crAcaoAgir, crOpNow, crOpRespMotivo, crOpResp } from '../../game/engine'

const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
const mets = computed(() => { game.total; return crView() })
const acoes = computed(() => { game.total; return crAcoesNow() })
const controle = computed(() => acoes.value.filter((a) => a.tipo === 'controle'))
const esquema = computed(() => acoes.value.filter((a) => a.tipo === 'esquema'))
const op = computed(() => { game.total; return crOpNow() })
const tone = (x, bom) => { const y = bom ? x : 100 - x; return y < 35 ? 'var(--bad)' : y < 60 ? 'var(--warn)' : 'var(--good)' }
</script>

<template>
  <div>
    <h3 class="sub">🕳️ Corrupção e controle</h3>
    <p class="legend">
      Esquemas crescem com o tempo e com os atalhos que você aceita, e os órgãos de controle reagem. Esquema grande e calor político podem
      atrair uma operação em fases. Atalhos rendem votos e dinheiro agora, mas a conta costuma chegar.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="m in mets" :key="m.id" class="slider">
      <div class="row"><span>{{ m.icon }} {{ m.nome }}</span><b>{{ m.v }}</b></div>
      <div class="bar"><i :style="{ width: m.v + '%', background: tone(m.v, m.bom) }"></i></div>
    </div>

    <div v-if="op" class="sumbox">
      <b>🚨 Operação em andamento: fase {{ op.n }}/3, {{ op.fase.nome }}</b>
      <p class="muted">{{ op.fase.texto }} Faltam {{ op.faltam }} rodada(s) para a próxima etapa. Força da operação: {{ op.forca }}/100. Chance de absolvição no fim: {{ op.chance }}%.</p>
      <div class="acts">
        <button v-for="r in op.resp" :key="r.id" type="button" :disabled="!!crOpRespMotivo(r.id)" @click="say(crOpResp(r.id))">
          <b>{{ r.icon }} {{ r.nome }}</b><small>{{ r.desc }}</small>
          <small v-if="crOpRespMotivo(r.id)" class="why">🔒 {{ crOpRespMotivo(r.id) }}</small>
        </button>
      </div>
    </div>

    <p class="muted"><b>🛡️ Fortalecer o controle</b></p>
    <div class="acts">
      <button v-for="a in controle" :key="a.id" type="button" :disabled="!!crAcaoMotivo(a.id)" @click="say(crAcaoAgir(a.id))">
        <b>{{ a.icon }} {{ a.nome }}</b><small>{{ a.desc }} {{ a.cash ? 'Custa ' + a.cash + '.' : '' }}</small>
        <small v-if="crAcaoMotivo(a.id)" class="why">🔒 {{ crAcaoMotivo(a.id) }}</small>
      </button>
    </div>
    <p class="muted"><b>🕳️ Atalhos arriscados</b></p>
    <div class="acts">
      <button v-for="a in esquema" :key="a.id" type="button" :disabled="!!crAcaoMotivo(a.id)" @click="say(crAcaoAgir(a.id))">
        <b>{{ a.icon }} {{ a.nome }}</b><small>{{ a.desc }}</small>
        <small v-if="crAcaoMotivo(a.id)" class="why">🔒 {{ crAcaoMotivo(a.id) }}</small>
      </button>
    </div>
  </div>
</template>
