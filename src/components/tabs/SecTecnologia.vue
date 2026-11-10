<script setup>
import { computed, ref } from 'vue'
import {
  game, officeId, isPresident, techOn, techMotivo, techPushMotivo, techPush, techFoco, techFeita, cstInfo,
  blocoMotivo, entrarBloco, tratadoMotivo, firmarTratado, opMotivo, iniciarOp, STATS,
} from '../../game/engine'
import { BLOCOS, TRATADOS, OPS, RAMOS, TECHS } from '../../game/avancos'

const w = computed(() => game.world)
const pres = computed(() => isPresident())
const msg = ref('')
const chips = (fx) => Object.entries(fx || {}).filter(([, v]) => v).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${(STATS.find((s) => s.k === k) || { short: k }).short}`).join(', ')
const prog = (id) => Math.round(w.value.tech.prog[id] || 0)
const ramos = computed(() => RAMOS.map((r) => ({ ...r, techs: TECHS.filter((t) => t.ramo === r.id && (pres.value || t.civil)) })).filter((r) => r.techs.length))
const tratar = (id) => {
  const r = firmarTratado(id)
  msg.value = r ? (r.ok ? 'Tratado referendado pelo Congresso.' : 'O Congresso não referendou o tratado.') : ''
}
const dica = (id) => techMotivo(id)
void cstInfo
void officeId
</script>

<template>
  <div v-if="techOn()">
    <h3 class="sub">🔬 Pesquisa, tecnologia e armas</h3>
    <p class="legend">
      Escolha um <b>foco</b>: ele avança sozinho um pouco a cada rodada. Para acelerar, financie com 1 ponto de agenda e Caixa (+34%).
      Cada tecnologia dá um bônus permanente por rodada. <template v-if="!pres">Governos de estado só pesquisam as áreas civis.</template>
    </p>
    <div v-for="r in ramos" :key="r.id" class="ramo">
      <p class="legend"><b>{{ r.icon }} {{ r.name }}</b></p>
      <div v-for="t in r.techs" :key="t.id" class="rel">
        <div class="row">
          <span>{{ t.icon }} <b>{{ t.name }}</b> <small class="muted">{{ t.desc }}</small></span>
          <span>{{ techFeita(t.id) ? '✅ concluída' : prog(t.id) + '%' }}</span>
        </div>
        <div class="bar"><i :style="{ width: (techFeita(t.id) ? 100 : prog(t.id)) + '%', background: 'var(--accent)' }"></i></div>
        <small class="muted">Bônus por rodada: {{ chips(t.pass) }} · custo por impulso: {{ t.cost }} Caixa</small>
        <div v-if="!techFeita(t.id)" class="acts">
          <button type="button" :disabled="!!techPushMotivo(t.id)" @click="techPush(t.id)"><b>Financiar</b><small v-if="techPushMotivo(t.id)" class="why">🔒 {{ techPushMotivo(t.id) }}</small><small v-else>-{{ t.cost }} Caixa, +34%</small></button>
          <button type="button" :disabled="!!dica(t.id) || w.tech.foco === t.id" @click="techFoco(t.id)"><b>{{ w.tech.foco === t.id ? '🎯 É o foco atual' : 'Definir como foco' }}</b><small v-if="dica(t.id)" class="why">🔒 {{ dica(t.id) }}</small></button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="pres">
    <h3 class="sub">🌐 Blocos internacionais</h3>
    <p class="legend">Entrar custa 1 ponto de agenda e Caixa, exige boa relação com os parceiros e rende um bônus por rodada. Algumas adesões irritam outros países.</p>
    <div v-for="b in BLOCOS" :key="b.id" class="rel">
      <div class="row"><span>{{ b.icon }} <b>{{ b.name }}</b> <small class="muted">{{ b.desc }}</small></span><span>{{ w.blocos.includes(b.id) ? '✅ membro' : '' }}</span></div>
      <small class="muted">Bônus: {{ chips(b.passive) }}</small>
      <div v-if="!w.blocos.includes(b.id)" class="acts">
        <button type="button" :disabled="!!blocoMotivo(b.id)" @click="entrarBloco(b.id)"><b>Pleitear adesão</b><small v-if="blocoMotivo(b.id)" class="why">🔒 {{ blocoMotivo(b.id) }}</small><small v-else>-{{ b.cash }} Caixa</small></button>
      </div>
    </div>

    <h3 class="sub">📑 Tratados e acordos comerciais</h3>
    <p class="legend">O tratado é assinado pelo presidente, mas precisa do referendo do Congresso (art. 84, VIII). Com base fraca, pode ser barrado.</p>
    <p v-if="msg" class="sumbox">{{ msg }}</p>
    <div v-for="t in TRATADOS" :key="t.id" class="rel">
      <div class="row"><span>{{ t.icon }} <b>{{ t.name }}</b></span><span>{{ w.tratados.includes(t.id) ? '✅ em vigor' : '' }}</span></div>
      <small class="muted">Bônus: {{ chips(t.pass) }} por rodada</small>
      <div v-if="!w.tratados.includes(t.id)" class="acts">
        <button type="button" :disabled="!!tratadoMotivo(t.id)" @click="tratar(t.id)"><b>Negociar e assinar</b><small v-if="tratadoMotivo(t.id)" class="why">🔒 {{ tratadoMotivo(t.id) }}</small><small v-else>-{{ t.cost }} Caixa</small></button>
      </div>
    </div>

    <h3 class="sub">🪖 Operações no exterior</h3>
    <p class="legend">Os países citados são fictícios. Missões duram algumas rodadas e entregam um resultado no fim. A intervenção armada precisa de indústria de defesa, Forças Armadas fiéis e Congresso favorável.</p>
    <p v-for="o in w.ops" :key="o.id" class="sumbox">{{ OPS.find((x) => x.id === o.id).icon }} {{ OPS.find((x) => x.id === o.id).name }} em andamento · faltam {{ o.left }} rodada(s).</p>
    <div class="acts">
      <button v-for="o in OPS" :key="o.id" type="button" :disabled="!!opMotivo(o.id)" :title="o.desc" @click="iniciarOp(o.id)">
        <b>{{ o.icon }} {{ o.name }}</b><small>{{ o.desc }}</small><small>-{{ o.cost }} Caixa · {{ o.left }} rodadas</small>
        <small v-if="opMotivo(o.id)" class="why">🔒 {{ opMotivo(o.id) }}</small>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rel { margin: 10px 0; }
.row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
.ramo { margin-top: 8px; }
</style>
