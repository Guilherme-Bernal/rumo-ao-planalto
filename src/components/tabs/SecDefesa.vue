<script setup>
import { computed, ref } from 'vue'
import {
  game, officeId, exeCan, golpeTemp, humorForca, humorPolicia, FORCAS_LISTA, DEF_FORCA, agirForca, industriaDefesa, poderPolicial, agirPolicia,
  gloPossivel, glo, plotAtual, fedLeg, LEG_GOLPE, agirLegGolpe, legCan, PLOT_ACOES, enfrentarPlot, guerraCivil, CIVIL_ACOES, agirCivil,
} from '../../game/engine'

const msg = ref('')
const pres = computed(() => officeId() === 'presidente')
const pol = computed(() => poderPolicial())
const temp = computed(() => golpeTemp())
const plot = computed(() => plotAtual())
const civil = computed(() => guerraCivil())
const tone = (v) => (v < 35 ? 'var(--bad)' : v < 60 ? 'var(--warn)' : 'var(--good)')
const tempTone = computed(() => (temp.value >= 50 ? 'var(--bad)' : temp.value >= 35 ? 'var(--warn)' : 'var(--good)'))
const tempLabel = computed(() => (temp.value >= 50 ? 'conspiração no ar' : temp.value >= 35 ? 'rumores nos quartéis' : 'estável'))
const fl = computed(() => fedLeg())
const show = computed(() => pres.value || pol.value || fl.value || officeId() === 'governador')
function go(fn, ...a) {
  const r = fn(...a)
  if (!r) return
  msg.value = r.txt || (r.glo ? (r.excesso ? 'A operação teve excessos e virou problema.' : 'A ordem foi restabelecida.') : r.ind ? 'Contrato fechado. O dinheiro entrou, e a polêmica também.' : 'Feito.')
}
</script>

<template>
  <div v-if="show">
    <h3 class="sub">🎖️ Defesa e segurança</h3>
    <p v-if="msg" class="sumbox">{{ msg }}</p>

    <template v-if="pol">
      <p class="legend">{{ pol.nome }}: humor <b>{{ humorPolicia() }}</b>/100. Se cair abaixo de 30 com o caixa apertado, a corporação pode parar.</p>
      <div class="bar" style="margin-bottom: 8px"><i :style="{ width: humorPolicia() + '%', background: tone(humorPolicia()) }"></i></div>
      <div class="acts">
        <button type="button" :disabled="!exeCan('pol:reajuste') || game.stats.cash < 2" @click="go(agirPolicia, 'reajuste')"><b>💵 Reajuste da corporação</b><small>-2 Caixa, +12 no humor</small></button>
        <button type="button" :disabled="!exeCan('pol:treino') || game.stats.cash < 1" @click="go(agirPolicia, 'treino')"><b>🎯 Treinamento e equipamento</b><small>-1 Caixa, +6 no humor, +Segurança</small></button>
      </div>
    </template>

    <template v-if="pres || fl">
      <p class="legend">Humor das Forças Armadas. A temperatura institucional sobe com Forças descontentes, povo e Congresso contra você e escândalos.</p>
      <div v-for="f in FORCAS_LISTA" :key="f.id" class="slider">
        <div class="row"><span>{{ f.icon }} {{ f.name }}</span><b>{{ humorForca(f.id) }}</b></div>
        <div class="bar"><i :style="{ width: humorForca(f.id) + '%', background: tone(humorForca(f.id)) }"></i></div>
      </div>
      <div class="slider">
        <div class="row"><span>🌡️ Temperatura institucional <small class="muted">({{ tempLabel }})</small></span><b>{{ temp }}</b></div>
        <div class="bar"><i :style="{ width: temp + '%', background: tempTone }"></i></div>
      </div>
      <div v-if="pres" class="acts" style="margin-top: 8px">
        <button v-for="a in DEF_FORCA" :key="a.id" type="button" :disabled="!exeCan('forca:' + a.id)" :title="a.desc" @click="go(agirForca, a.id)"><b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small></button>
        <button type="button" :disabled="!exeCan('industria')" @click="go(industriaDefesa)"><b>🏭 Exportar material de defesa</b><small>+Caixa e emprego, mas polêmica</small></button>
      </div>
    </template>

    <div v-if="fl" class="acts" style="margin-top: 8px">
      <button v-for="a in LEG_GOLPE" :key="a.id" type="button" :disabled="!legCan('golpe:' + a.id) || (a.id !== 'lei' && !plot)" :title="a.desc" @click="go(agirLegGolpe, a.id)"><b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small></button>
    </div>

    <div v-if="(pres || fl) && plot" class="sumbox" :style="{ marginTop: '8px', borderColor: 'var(--bad)' }">
      🕵️ <b>Conspiração em curso</b>: {{ plot.leader }}. Força do plano: {{ Math.round(plot.strength) }}/100. Ao chegar a 100, tentam o golpe.
      <div class="bar" style="margin: 6px 0"><i :style="{ width: Math.min(100, plot.strength) + '%', background: 'var(--bad)' }"></i></div>
      <div v-if="pres" class="acts">
        <button v-for="a in PLOT_ACOES" :key="a.id" type="button" :disabled="!exeCan('plot:' + a.id)" :title="a.desc" @click="go(enfrentarPlot, a.id)"><b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small></button>
      </div>
    </div>

    <div v-if="pres && civil" class="sumbox" :style="{ marginTop: '8px', borderColor: 'var(--bad)' }">
      🔥 <b>Guerra civil</b> · rodada {{ civil.round }}/5 · paz {{ Math.min(100, Math.round(civil.peace)) }}/100. A cada rodada o país perde popularidade, economia e segurança.
      <div class="bar" style="margin: 6px 0"><i :style="{ width: Math.min(100, civil.peace) + '%', background: 'var(--good)' }"></i></div>
      <div class="acts">
        <button v-for="a in CIVIL_ACOES" :key="a.id" type="button" :disabled="!exeCan('civil:' + a.id)" :title="a.desc" @click="go(agirCivil, a.id)"><b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small></button>
      </div>
    </div>

    <div v-if="gloPossivel()" class="acts" style="margin-top: 8px">
      <button type="button" :disabled="!exeCan('glo')" @click="go(glo)"><b>🪖 Acionar as forças (GLO)</b><small>Resolve protestos e crises de segurança, com risco de excessos</small></button>
    </div>
  </div>
</template>
