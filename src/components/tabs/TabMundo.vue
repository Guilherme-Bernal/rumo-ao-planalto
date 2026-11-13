<script setup>
import { computed } from 'vue'
import SecTecnologia from './SecTecnologia.vue'
import SecAmeacas from './SecAmeacas.vue'
import SecSociedade from './SecSociedade.vue'
import SecEco from './SecEco.vue'
import SecPop from './SecPop.vue'
import SecCrise from './SecCrise.vue'
import SecMundo24 from './SecMundo24.vue'
import { game, ptsOf, STATS, officeInfo, worldPartners, worldWars, worldNuc, worldStances, diploActions, defActions, fedDefs, fedActions, isPresident, canDiplo, worldReady, diplo, defAct, nucInvest, fedAct, diploChance, askChance } from '../../game/engine'

const w = computed(() => game.world)
const ready = computed(() => worldReady())
const readyM = computed(() => worldReady('ptsM'))
const whyM = computed(() => (game.phase === 'actions' ? (ptsOf('ptsM') > 0 ? '' : 'Sem pontos de defesa nesta rodada.') : 'Disponível na fase de ações da rodada.'))
const maxPts = computed(() => (pres.value ? 4 : 3))
const pres = computed(() => isPresident())
const diploOk = computed(() => canDiplo())
const color = (v) => (v < 30 ? 'var(--bad)' : v < 55 ? 'var(--warn)' : 'var(--good)')
const mood = (v) => (v >= 75 ? 'aliado' : v >= 55 ? 'amigável' : v >= 40 ? 'neutro' : v >= 25 ? 'frio' : 'hostil')
const short = (k) => (STATS.find((s) => s.k === k) || { short: k }).short
const chips = (fx) =>
  Object.entries(fx || {})
    .filter(([, v]) => v)
    .map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${v} ${short(k)}`, up: v > 0 }))
const wars = computed(() => w.value.wars.map((x) => ({ ...x, def: worldWars().find((d) => d.id === x.id) })).filter((x) => x.def))
const targets = computed(() => fedDefs())
const afford = (fx) => !fx || !fx.cash || fx.cash >= 0 || game.stats.cash >= -fx.cash
const fedVal = (id) => w.value.fed[id] ?? 50
const why = computed(() => (game.phase === 'actions' ? (w.value.pts > 0 ? '' : 'Sem pontos de agenda nesta rodada.') : 'Disponível na fase de ações da rodada.'))
</script>

<template>
  <div>
    <h2>🌍 Mundo e relações</h2>
    <p class="muted">
      Cada rodada você tem 3 tipos de ponto: <b>diplomacia</b> ({{ maxPts }}: relações, blocos, tratados), <b>defesa</b> (2: Forças Armadas, programa nuclear, operações) e <b>pesquisa</b> (2: tecnologia). As boas relações rendem um pouco por rodada, e as ruins cobram a conta.
      <br />Diplomacia: <b class="pts">{{ '●'.repeat(Math.max(0, w.pts)) }}{{ '○'.repeat(Math.max(0, maxPts - w.pts)) }}</b>
      · Defesa: <b class="pts">{{ '●'.repeat(Math.max(0, ptsOf('ptsM'))) }}{{ '○'.repeat(Math.max(0, 2 - ptsOf('ptsM'))) }}</b>
      · Pesquisa: <b class="pts">{{ '●'.repeat(Math.max(0, ptsOf('ptsP'))) }}{{ '○'.repeat(Math.max(0, 2 - ptsOf('ptsP'))) }}</b>
      <span v-if="why"> · {{ why }}</span>
    </p>
    <p v-if="w.last" class="sumbox" :style="{ marginTop: '8px', borderColor: w.last.ok ? 'var(--good)' : 'var(--bad)' }">{{ w.last.ok ? '✅' : '⚠️' }} {{ w.last.text }}</p>

    <template v-if="wars.length">
      <h3 class="sub">⚔️ Guerras e crises no mundo</h3>
      <div v-for="x in wars" :key="x.id" class="wcard">
        <b>{{ x.def.ico }} {{ x.def.name }}</b>
        <small class="muted"> · mais {{ x.left }} rodada(s)</small>
        <div class="muted">{{ x.def.desc }}</div>
        <div class="muted"><template v-if="pres">Posição do Brasil: <b>{{ x.stance ? worldStances()[x.stance].name : 'ainda indefinida' }}</b></template><template v-else>Reflexo na sua gestão: preços e economia sentem o impacto.</template></div>
        <span v-for="c in chips(x.def.fx)" :key="c.t" class="chip" :class="c.up ? 'up' : 'down'">{{ c.t }}/rodada</span>
      </div>
    </template>
    <p v-else class="legend">Nenhuma guerra relevante no mundo agora. Elas surgem de tempos em tempos e mudam preço, economia e relações.</p>

    <h3 class="sub">🧭 Relações do cargo ({{ officeInfo().name }})</h3>
    <div v-for="d in targets" :key="d.id" class="rel">
      <div class="row">
        <span>{{ d.ico }} <b>{{ d.name }}</b></span>
        <span :style="{ color: color(fedVal(d.id)) }">{{ Math.round(fedVal(d.id)) }} · {{ mood(fedVal(d.id)) }}</span>
      </div>
      <div class="bar"><i :style="{ width: fedVal(d.id) + '%', background: color(fedVal(d.id)) }"></i></div>
      <div class="acts">
        <button v-for="a in fedActions(d.dir)" :key="a.id" type="button" :disabled="!ready || !afford(a.fx)" :title="!ready ? why : !afford(a.fx) ? 'Sem Caixa para isso.' : a.desc" @click="fedAct(d.id, a.id)">
          {{ a.name }}
          <small v-if="a.ask">{{ Math.round(askChance(d.id) * 100) }}% de chance</small>
          <small v-else>
            <span v-for="c in chips(a.fx)" :key="c.t" :class="c.up ? 'u' : 'dn'">{{ c.t }} </span>
            <span :class="a.rel > 0 ? 'u' : 'dn'">{{ a.rel > 0 ? '+' : '' }}{{ a.rel }} relação</span>
          </small>
        </button>
      </div>
    </div>

    <template v-if="diploOk">
      <h3 class="sub">🌐 Diplomacia</h3>
      <div v-for="p in worldPartners()" :key="p.id" class="rel">
        <div class="row">
          <span>{{ p.ico }} <b>{{ p.name }}</b> <small class="muted">{{ p.note }}</small></span>
          <span :style="{ color: color(w.rel[p.id]) }">{{ Math.round(w.rel[p.id]) }} · {{ mood(w.rel[p.id]) }}</span>
        </div>
        <div class="bar"><i :style="{ width: w.rel[p.id] + '%', background: color(w.rel[p.id]) }"></i></div>
        <div class="acts">
          <button v-for="a in diploActions()" :key="a.id" type="button" :disabled="!ready || !afford(a.fx)" :title="!ready ? why : !afford(a.fx) ? 'Sem Caixa para isso.' : a.desc" @click="diplo(p.id, a.id)">
            {{ a.name }}
            <small v-if="a.need">{{ Math.round(diploChance(p.id, a.id) * 100) }}% de chance</small>
            <small v-else>
              <span v-for="c in chips(a.fx)" :key="c.t" :class="c.up ? 'u' : 'dn'">{{ c.t }} </span>
              <span :class="a.rel > 0 ? 'u' : 'dn'">{{ a.rel > 0 ? '+' : '' }}{{ a.rel }} relação</span>
            </small>
          </button>
        </div>
      </div>
      <p class="legend">Aproximar-se de um parceiro esfria a relação com os rivais dele (EUA e China, Rússia e Europa, Índia e China).<template v-if="!pres"> Governador e senador conduzem a diplomacia do estado e da Comissão de Relações Exteriores.</template></p>
    </template>

    <template v-if="pres">

      <h3 class="sub">🎖️ Forças Armadas</h3>
      <div class="rel">
        <div class="row">
          <span>Apoio dos quartéis ao governo</span>
          <span :style="{ color: color(w.fa) }">{{ Math.round(w.fa) }} · {{ mood(w.fa) }}</span>
        </div>
        <div class="bar"><i :style="{ width: w.fa + '%', background: color(w.fa) }"></i></div>
        <p v-if="w.fa < 25" class="legend" style="color: var(--bad)">⚠️ Os quartéis estão insatisfeitos: segurança e base caem a cada rodada. Com popularidade baixa, isso pode derrubar o governo.</p>
        <div class="acts">
          <button v-for="a in defActions()" :key="a.id" type="button" :disabled="!readyM || !afford(a.fx)" :title="!readyM ? whyM : !afford(a.fx) ? 'Sem Caixa para isso.' : a.desc" @click="defAct(a.id)">
            {{ a.name }}
            <small>
              <span v-for="c in chips(a.fx)" :key="c.t" :class="c.up ? 'u' : 'dn'">{{ c.t }} </span>
              <span :class="a.fa > 0 ? 'u' : 'dn'">{{ a.fa > 0 ? '+' : '' }}{{ a.fa }} apoio</span>
            </small>
          </button>
        </div>
      </div>

      <h3 class="sub">☢️ Programa nuclear</h3>
      <p class="muted">Cada investimento custa 3 de caixa e 1 ponto de agenda, e avança 25% do projeto. Ao concluir, vem um bônus permanente.</p>
      <div v-for="n in worldNuc()" :key="n.id" class="rel">
        <div class="row">
          <span>{{ n.ico }} <b>{{ n.name }}</b> <small class="muted">{{ n.desc }}</small></span>
          <span>{{ w.nuc[n.id] }}%<template v-if="w.nucDone.includes(n.id)"> · ✅ concluído</template></span>
        </div>
        <div class="bar"><i :style="{ width: w.nuc[n.id] + '%', background: 'var(--accent)' }"></i></div>
        <div class="acts">
          <button type="button" :disabled="!readyM || w.nuc[n.id] >= 100 || game.stats.cash < 3" @click="nucInvest(n.id)">Investir <small><span class="dn">-3 Caixa</span></small></button>
        </div>
      </div>
    </template>
    <p v-else class="legend">Diplomacia, Forças Armadas e energia nuclear ficam com o cargo de Presidente da República.</p>

    <SecAmeacas />
    <SecTecnologia />
    <SecMundo24 />
    <SecSociedade />
    <SecEco />
    <SecPop />
    <SecCrise />
  </div>
</template>

<style scoped>
.wcard { padding: 10px 12px; margin: 8px 0; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 12px; background: rgba(255, 90, 90, 0.07); }
.rel { margin: 12px 0; }
.row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 6px; margin-top: 8px; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.acts small span { margin-right: 6px; }
.u { color: var(--good); }
.dn { color: var(--bad); }
.pts { letter-spacing: 3px; color: var(--accent); }
</style>