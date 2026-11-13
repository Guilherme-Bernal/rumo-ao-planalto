<script setup>
import { computed, ref } from 'vue'
import {
  game, isExec, isPresident, sgForca, sgView, gruposSgNow, opsSgNow, sgOpChance, opSgMotivo, opSgAgir, sgReformaMotivo, sgReforma, sgEmendaMotivo, sgEmenda,
  fornecedoresNow, contratosSgNow, modalidadesSg, precoSg, compraSgMotivo, compraSg, pdSgNow, pdSgMotivo, pdSgInvestir, acordosSgNow, acordoSgMotivo, acordoSgFirmar, acordoSgRomper,
} from '../../game/engine'

const msg = ref('')
const alvo = ref('faccao')
const modId = ref('licitacao')
const say = (r) => { msg.value = r ? r.txt : '' }
const exec = computed(() => isExec())
const pres = computed(() => isPresident())
const forca = computed(() => sgForca())
const v = computed(() => { game.total; return sgView() })
const grupos = computed(() => { game.total; return gruposSgNow() })
const alvoOk = computed(() => (grupos.value.some((g) => g.id === alvo.value) ? alvo.value : grupos.value[0].id))
const ops = computed(() => opsSgNow())
const forn = computed(() => fornecedoresNow())
const contratos = computed(() => { game.total; return contratosSgNow() })
const mods = computed(() => modalidadesSg())
const mod = computed(() => mods.value.find((m) => m.id === modId.value))
const pd = computed(() => { game.total; return pdSgNow() })
const acordos = computed(() => { game.total; return acordosSgNow() })
const tone = (x, inv) => (inv ? (x >= 60 ? 'var(--bad)' : x >= 40 ? 'var(--warn)' : 'var(--good)') : x < 35 ? 'var(--bad)' : x < 60 ? 'var(--warn)' : 'var(--good)')
const chance = (o) => Math.round(sgOpChance(o, alvoOk.value) * 100)
</script>

<template>
  <div>
    <h3 class="sub">🚓 Segurança pública e crime organizado</h3>
    <p class="legend">
      {{ exec ? `Você comanda a ${forca}.` : 'Você pode destinar emendas para a segurança.' }} Os grupos crescem quando a segurança cai e a corporação se corrompe,
      e recuam com operações, equipamento e acordos. Guerras e escândalos chegam na Agenda como decisão.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div v-for="g in grupos" :key="g.id" class="slider">
      <div class="row"><span>{{ g.icon }} {{ g.nome }} <small class="muted">{{ g.texto }}</small></span><b>{{ g.v }}</b></div>
      <div class="bar"><i :style="{ width: g.v + '%', background: tone(g.v, true) }"></i></div>
    </div>
    <div class="slider">
      <div class="row"><span>🕳️ Corrupção na corporação</span><b>{{ v.corr }}</b></div>
      <div class="bar"><i :style="{ width: v.corr + '%', background: tone(v.corr, true) }"></i></div>
    </div>
    <div class="slider">
      <div class="row"><span>🚓 Equipamento e viaturas <small class="muted">(envelhece a cada rodada)</small></span><b>{{ v.equip }}</b></div>
      <div class="bar"><i :style="{ width: v.equip + '%', background: tone(v.equip) }"></i></div>
    </div>

    <template v-if="!exec">
      <div class="acts">
        <button type="button" :disabled="!!sgEmendaMotivo()" @click="say(sgEmenda())">
          <b>🚓 Emenda para viaturas</b><small>Custa 1 de caixa. Ajuda a base.</small>
          <small v-if="sgEmendaMotivo()" class="why">🔒 {{ sgEmendaMotivo() }}</small>
        </button>
      </div>
    </template>

    <template v-else>
      <div class="sumbox">
        <b>🎯 Operações</b>
        <p class="muted">Escolha o alvo e a ação. Operação ostensiva e asfixia financeira provocam reação nas rodadas seguintes.</p>
        <label class="muted">Alvo:
          <select v-model="alvo">
            <option v-for="g in grupos" :key="g.id" :value="g.id">{{ g.icon }} {{ g.nome }}</option>
          </select>
        </label>
        <div class="acts">
          <button v-for="o in ops" :key="o.id" type="button" :disabled="!!opSgMotivo(o.id, alvoOk)" @click="say(opSgAgir(o.id, alvoOk))">
            <b>{{ o.icon }} {{ o.nome }}</b>
            <small>{{ o.desc }} Custa {{ o.cash }}. Chance {{ chance(o) }}%.</small>
            <small v-if="opSgMotivo(o.id, alvoOk)" class="why">🔒 {{ opSgMotivo(o.id, alvoOk) }}</small>
          </button>
          <button type="button" :disabled="!!sgReformaMotivo()" @click="say(sgReforma())">
            <b>🧹 Reformar a corregedoria</b><small>Custa 2 de caixa. -12 na corrupção.</small>
            <small v-if="sgReformaMotivo()" class="why">🔒 {{ sgReformaMotivo() }}</small>
          </button>
        </div>
      </div>

      <div class="sumbox">
        <b>🛒 Compra de viaturas e equipamentos</b>
        <p class="muted">Fornecedores nacionais e estrangeiros (empresas fictícias). Estrangeiros dependem da relação e podem sofrer embargo ou atraso. Até 2 contratos ao mesmo tempo.</p>
        <label class="muted">Modalidade:
          <select v-model="modId">
            <option v-for="m in mods" :key="m.id" :value="m.id">{{ m.icon }} {{ m.nome }}</option>
          </select>
        </label>
        <p class="muted">{{ mod.desc }}</p>
        <p v-for="c in contratos" :key="c.id" class="muted">📦 {{ c.f.item }} ({{ c.f.nome }}): entrega em {{ c.left }} rodada(s){{ c.atraso ? ', atrasada' : '' }}.</p>
        <div class="acts">
          <button v-for="f in forn" :key="f.id" type="button" :disabled="!!compraSgMotivo(f.id, modId)" @click="say(compraSg(f.id, modId))">
            <b>{{ f.icon }} {{ f.nome }}</b>
            <small>{{ f.item }}. Custa {{ precoSg(f, mod) }}, equipamento +{{ f.equip }}, entrega {{ Math.max(1, f.ent + mod.ent) }} rodada(s). {{ f.nota }}</small>
            <small v-if="compraSgMotivo(f.id, modId)" class="why">🔒 {{ compraSgMotivo(f.id, modId) }}</small>
          </button>
        </div>
      </div>
    </template>

    <div v-if="pres" class="sumbox">
      <b>🔬 Pesquisa de armamento</b>
      <p class="muted">Cada projeto leva 4 investimentos de 2 de caixa, um projeto por rodada.</p>
      <div class="acts">
        <button v-for="p in pd" :key="p.id" type="button" :disabled="!!pdSgMotivo(p.id)" @click="say(pdSgInvestir(p.id))">
          <b>{{ p.icon }} {{ p.nome }} <small>({{ p.feito ? 'concluída' : p.n + '/' + p.passos }})</small></b>
          <small>{{ p.desc }} Efeito: {{ p.ef }}</small>
          <small v-if="pdSgMotivo(p.id)" class="why">🔒 {{ pdSgMotivo(p.id) }}</small>
        </button>
      </div>
    </div>

    <div v-if="pres" class="sumbox">
      <b>🌍 Acordos internacionais de segurança e armas</b>
      <p class="muted">Até 3 acordos em vigor. Cada um mexe com a relação dos parceiros, e alguns irritam terceiros.</p>
      <div class="acts">
        <template v-for="a in acordos" :key="a.id">
          <button v-if="a.ativo" type="button" @click="say(acordoSgRomper(a.id))">
            <b>{{ a.icon }} {{ a.nome }} <small>(em vigor)</small></b><small>{{ a.ef }} Toque para romper (-1 de imagem, relação cai).</small>
          </button>
          <button v-else type="button" :disabled="!!acordoSgMotivo(a.id)" @click="say(acordoSgFirmar(a.id))">
            <b>{{ a.icon }} {{ a.nome }}</b>
            <small>{{ a.desc }} Custa {{ a.cash }}. Relação {{ a.relNow }}/{{ a.nec }}. Efeito: {{ a.ef }}</small>
            <small v-if="acordoSgMotivo(a.id)" class="why">🔒 {{ acordoSgMotivo(a.id) }}</small>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
