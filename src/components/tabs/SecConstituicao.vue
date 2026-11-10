<script setup>
import { computed, ref } from 'vue'
import { game, officeId, cstOn, cstInfo, cstDefs, cstWhy, pecChance, propor, editarMP, decretarExcecao, estadoMotivo, prorrogarEstado, convocarConsulta, STATS } from '../../game/engine'

const msg = ref('')
const d = cstDefs()
const info = computed(() => cstInfo())
const pres = computed(() => officeId() === 'presidente')
const chips = (fx) => Object.entries(fx).filter(([, v]) => v).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${(STATS.find((s) => s.k === k) || { short: k }).short}`).join(', ')
const go = (fn, ...a) => {
  const r = fn(...a)
  msg.value = r ? r.txt || 'Feito.' : 'Não foi possível agora.'
}
const why = computed(() => cstWhy('pec'))
const pecAtual = computed(() => (info.value && info.value.pec ? d.PECS.find((x) => x.id === info.value.pec.id) : null))
const estado = computed(() => (info.value && info.value.estado ? { ...info.value.estado, def: d.ESTADOS.find((x) => x.id === info.value.estado.id) } : null))
const mpsAtivas = computed(() => (info.value ? info.value.mps.map((m) => ({ ...m, def: d.MPS.find((x) => x.id === m.id) })) : []))
</script>

<template>
  <div v-if="cstOn() && info">
    <h3 class="sub">🏛️ Constituição e instrumentos de exceção</h3>
    <p class="legend">
      Mudar a Constituição exige <b>3/5 em cada Casa, em dois turnos</b> (art. 60), e nada de PEC durante estado de defesa, de sítio ou intervenção.
      As cláusulas pétreas (voto direto, separação dos Poderes, federação e direitos individuais) não se mexem. Emendas promulgadas: <b>{{ info.emendas }}</b>.
    </p>
    <p v-if="msg" class="sumbox">{{ msg }}</p>
    <p v-if="why" class="legend">🔒 {{ why }}</p>

    <div v-if="pecAtual" class="sumbox">
      📜 PEC em tramitação: <b>{{ pecAtual.name }}</b> · {{ info.pec.step === 0 ? 'aguardando o 1º turno' : 'aprovada no 1º turno, aguardando o 2º' }} · chance por turno {{ Math.round(pecChance(pecAtual, info.pec.step) * 100) }}%
    </div>

    <p class="legend"><b>Propor uma emenda</b> (uma por rodada)</p>
    <div class="acts">
      <button v-for="p in d.PECS" :key="p.id" type="button" :disabled="!!why || !!info.pec || !!info.estado || (p.flag && info.flags[p.flag])" :title="p.desc" @click="go(propor, p.id)">
        <b>{{ p.icon }} {{ p.name }}</b>
        <small>{{ p.desc }}</small>
        <small>{{ chips(p.fx) }} · {{ Math.round(pecChance(p) * 100) }}% por turno</small>
        <small v-if="info.pec" class="why">🔒 Já há uma PEC em tramitação.</small>
        <small v-else-if="info.estado" class="why">🔒 Estado de exceção em vigor.</small>
        <small v-else-if="p.flag && info.flags[p.flag]" class="why">✅ Já aprovada.</small>
      </button>
    </div>
    <p class="legend">Para testar os limites: as propostas abaixo são cláusulas pétreas. O Supremo derruba e você paga em imagem.</p>
    <div class="acts">
      <button v-for="p in d.PETREAS" :key="p.id" type="button" :disabled="!!why || !!info.pec || !!info.estado" :title="p.desc" @click="go(propor, p.id)">
        <b>{{ p.icon }} {{ p.name }}</b><small>{{ p.desc }}</small>
      </button>
    </div>

    <template v-if="pres">
      <h3 class="sub">📜 Medidas provisórias</h3>
      <p class="legend">Valem desde o dia em que você edita, mas o Congresso tem de converter em lei em 3 rodadas, ou elas caducam (art. 62). Máximo de 2 pendentes.</p>
      <p v-for="m in mpsAtivas" :key="m.id" class="sumbox">📜 {{ m.def.name }}: falta(m) {{ m.left }} rodada(s) para o Congresso votar.</p>
      <div class="acts">
        <button v-for="m in d.MPS" :key="m.id" type="button" :disabled="!!why || info.mps.length >= 2" :title="m.desc" @click="go(editarMP, m.id)"><b>{{ m.icon }} {{ m.name }}</b><small>{{ m.desc }}</small><small>{{ chips(m.fx) }}</small></button>
      </div>

      <h3 class="sub">🚨 Estados de exceção</h3>
      <p v-if="estado" class="sumbox" :style="{ borderColor: 'var(--bad)' }">{{ estado.def.icon }} <b>{{ estado.def.name }}</b> em vigor · faltam {{ estado.left }} rodada(s). Pesa na imagem e esquenta os quartéis.
        <button v-if="estado.id === 'defesa'" type="button" :disabled="!!why" @click="go(prorrogarEstado)">Prorrogar (uma vez)</button>
      </p>
      <div class="acts">
        <button v-for="e in d.ESTADOS" :key="e.id" type="button" :disabled="!!estadoMotivo(e.id)" :title="e.desc" @click="go(decretarExcecao, e.id)">
          <b>{{ e.icon }} {{ e.name }}</b>
          <small>{{ e.desc }}</small>
          <small>{{ chips(e.fx) }}</small>
          <small v-if="estadoMotivo(e.id)" class="why">🔒 {{ estadoMotivo(e.id) }}</small>
        </button>
      </div>
    </template>

    <h3 class="sub">🗳️ Plebiscito e referendo</h3>
    <p class="legend">Consulta popular (art. 14). Custa 2 de Caixa. O resultado sai no começo da próxima rodada e depende da sua popularidade.</p>
    <p v-if="info.consulta" class="sumbox">🗳️ Consulta marcada: {{ d.CONSULTAS.find((x) => x.id === info.consulta.id).name }}.</p>
    <div class="acts">
      <button v-for="c in d.CONSULTAS" :key="c.id" type="button" :disabled="!!why || !!info.consulta || game.stats.cash < 2" @click="go(convocarConsulta, c.id)"><b>{{ c.icon }} {{ c.name }}</b><small>Se o sim vencer: {{ chips(c.yes) }}</small><small>Se o não vencer: {{ chips(c.no) }}</small></button>
    </div>
  </div>
</template>

<style scoped>
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
</style>
