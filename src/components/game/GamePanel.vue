<script setup>
import { computed, ref } from 'vue'
import Calendar from './Calendar.vue'
import Recap from './Recap.vue'
import MiniDebate from '../minigames/MiniDebate.vue'
import MiniPlenario from '../minigames/MiniPlenario.vue'
import MiniComicio from '../minigames/MiniComicio.vue'
import MiniContato from '../minigames/MiniContato.vue'
import MiniVeto from '../minigames/MiniVeto.vue'
import { LIGAR } from '../../game/contacts'
import { SPHERES } from '../../game/ideas'
import { fmtNum } from '../../game/social'
import {
  game, country, STATS, CAMPAIGNS, currentEvent, stageInfo, targetOffice,
  chooseOption, continueOutcome, canDo, doAction, endTurn,
  pollShare, chooseCampaign, continueAfterResult, effectiveFx, campaignCost, money,
  stateEstimates, confirmPlan, monthsPer, allActions, COMICIO, actionSphere, currentBig, chooseBig, doSpecial,
  finishTv, finishPlenario, currentApproach, ignoreApproach, RUNOFF, runoffBonus, chooseRunoff, PAPER_ACTS, paperAct, hasSecondRound, needsTicket, isProportional, propEstimate,
} from '../../game/engine'
import Newspaper from './Newspaper.vue'
import PostCard from './PostCard.vue'
import Balance from './Balance.vue'
import BrazilMap from '../shared/BrazilMap.vue'
import PlanEditor from '../character/PlanEditor.vue'
import Rumo from './Rumo.vue'
import TicketPicker from '../character/TicketPicker.vue'
import TabEquipe from '../tabs/TabEquipe.vue'

const ev = computed(() => (game.phase === 'event' ? currentEvent() : null))
const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const num = (v) => Number(v.toFixed(1))
const chips = (fx) => {
  const eff = effectiveFx(fx)
  return Object.entries(fx).map(([k, v]) => ({
    k,
    label: short[k],
    v: num(eff[k]),
    cls: eff[k] > 0 ? 'up' : 'down',
    tip: eff[k] !== v ? `base ${v > 0 ? '+' : ''}${v}, ajustado pelo seu perfil` : '',
    mod: eff[k] !== v,
  }))
}
const poll = computed(() => (['campaign', 'runoff'].includes(game.phase) && !(game.phase === 'campaign' && isProportional()) ? pollShare() : 0))
const est = computed(() => (game.phase === 'campaign' && isProportional() ? propEstimate() : null))
const colors = computed(() => {
  if (!['campaign', 'runoff'].includes(game.phase)) return {}
  const o = {}
  for (const [k, v] of Object.entries(stateEstimates())) o[k] = v < 45 ? '#b4474d' : v < 50 ? '#c98a3d' : v < 55 ? '#9aa84a' : '#3f9d66'
  return o
})
const armed = ref(null)
const mini = ref(null) // 'debate' | 'plenario' | 'comicio'
const miniMonth = ref(0)
const miniMsg = ref('')
const sph = Object.fromEntries(SPHERES.map((s) => [s.k, s]))
const actions = computed(() => [...allActions(), COMICIO, LIGAR])
const approach = computed(() => (game.phase === 'actions' ? currentApproach() : null))
const big = computed(() => (game.phase === 'actions' ? currentBig() : null))
const arm = (a) => {
  if (!canDo(a)) return
  armed.value = armed.value === a.id ? null : a.id
}
const place = (m) => {
  if (!armed.value) return
  if (armed.value === 'comicio') {
    miniMonth.value = m
    mini.value = 'comicio'
    return
  }
  if (armed.value === 'ligar') {
    miniMonth.value = m
    mini.value = 'ligar'
    return
  }
  doAction(armed.value, m)
  armed.value = null
}
const miniDone = (a, b, c) => {
  const k = mini.value
  mini.value = null
  if (k === 'comicio') {
    const sc = a
    const fx = { pop: Math.round(-2 + sc * 8), img: Math.round(-1 + sc * 3), cash: -3 }
    doSpecial('comicio', miniMonth.value, fx, `Comício: ${sc >= 0.7 ? 'multidão em êxtase' : sc >= 0.4 ? 'recepção morna' : 'comício esvaziado'}.`)
    armed.value = null
  } else if (k === 'plenario') {
    const ok = finishPlenario(a, b, c && c.bill, c ? c.concessions : 0, c ? c.stance : 'pro')
    const passed = c.stance === 'pro' ? ok : !ok
    miniMsg.value = `🏛️ “${c.bill.title}” ${passed ? 'aprovado' : 'rejeitado'}. ${ok ? 'Você venceu a votação.' : 'Você perdeu a votação.'}`
  } else if (k === 'debate') {
    const tv = finishTv(a)
    miniMsg.value = `📺 Debate encerrado: ${tv > 0 ? '+' : ''}${tv} ponto(s) na eleição.`
  }
}
const PLEN_TXT = { vereador: 'na Câmara Municipal', prefeito: 'na Câmara Municipal', dep_estadual: 'na Assembleia Legislativa', dep_federal: 'na Câmara dos Deputados', senador: 'no Senado Federal', governador: 'na Assembleia Legislativa', presidente: 'no Congresso Nacional' }
const plenLabel = computed(() => `Votação ${PLEN_TXT[game.office] || 'no plenário'}`)
const planName = ref(game.plan.name)
const planIds = ref([])
</script>

<template>
  <section class="card">
    <!-- EVENTO -->
    <template v-if="ev">
      <h2>{{ ev.title }}</h2>
      <p class="lead">{{ ev.text }}</p>
      <div class="choices">
        <button v-for="(c, i) in ev.choices" :key="i" @click="chooseOption(i)">
          {{ c.label }}<span v-if="c.risk" class="chip warn"> 🎲 arriscado: {{ Math.round(c.risk * 100) }}% de dar certo</span>
        </button>
      </div>
      <p class="muted" style="margin-top: 12px">Seu perfil muda o resultado: o que combina com você rende mais, o que foge do seu perfil rende menos.</p>
    </template>

    <!-- RESULTADO DA ESCOLHA: capa do jornal -->
    <template v-else-if="game.phase === 'outcome'">
      <p class="muted" style="margin-bottom: 8px">{{ game.outcome.title }}: você escolheu <b>{{ game.outcome.label }}</b><span v-if="game.outcome.risky"> · {{ game.outcome.lucky ? '🎲 deu certo!' : '🎲 deu errado...' }}</span></p>
      <Newspaper :news="game.outcome.news">{{ game.outcome.text }}</Newspaper>
      <div class="sumbox paper-acts">
        <b>🗞️ E agora, com o jornal?</b>
        <div v-if="!game.outcome.paper" class="post-opts">
          <button v-for="a in PAPER_ACTS" :key="a.id" class="btn ghost" :class="{ dirty: a.dirty }" @click="paperAct(a.id)"><b>{{ a.label }}</b><small>{{ a.desc }}</small></button>
        </div>
        <p v-else class="post-note"><b>{{ game.outcome.paper.label }}:</b> {{ game.outcome.paper.text }}</p>
      </div>
      <div class="sumbox" v-if="game.feed.length"><b>📱 Nas redes</b>
        <PostCard v-for="p in game.feed.slice(0, 3)" :key="p.id" :post="p" />
      </div>
      <button class="primary" style="width: 100%; margin-top: 12px" @click="continueOutcome">Continuar</button>
    </template>

    <!-- AÇÕES -->
    <template v-else-if="game.phase === 'actions'">
      <h2>Planeje a rodada</h2>
      <p class="lead">Você tem <span class="ap">{{ game.ap }}/2</span> ações. Clique numa ação e depois no mês do calendário em que quer fazê-la.</p>
      <Calendar :armed="armed" @place="place" />
      <div v-if="approach" class="callcard">
        <span class="call-ico">{{ approach.kind.icon }}</span>
        <div class="call-txt"><b>{{ approach.kind.verb }} {{ approach.contact.name }}</b><small>{{ approach.role.icon }} {{ approach.role.name }} · {{ approach.script.title }}</small></div>
        <button class="primary" @click="mini = 'conversa'">Atender</button>
        <button @click="ignoreApproach">Ignorar</button>
      </div>
      <div v-if="big" class="bigcard">
        <h3>{{ big.icon }} {{ big.title }} <small class="muted">· {{ sph[big.sphere].icon }} {{ sph[big.sphere].name }}</small></h3>
        <p class="lead">{{ big.text }}</p>
        <div class="choices">
          <button v-for="(c, i) in big.choices" :key="i" @click="chooseBig(i)">
            {{ c.label }}<span v-if="c.risk" class="chip warn"> 🎲 arriscado: {{ Math.round(c.risk * 100) }}%</span>
          </button>
        </div>
        <p class="muted">Opcional: não gasta ação. Ignorar também é uma escolha, e o evento passa.</p>
      </div>
      <div v-else-if="game.bigOffer && game.bigOffer.done" class="sumbox bigres">
        <b>{{ game.bigOffer.icon }} {{ game.bigOffer.name }}</b>: {{ game.bigOffer.label }}
        <span v-if="game.bigOffer.risky"> · {{ game.bigOffer.lucky ? '🎲 deu certo!' : '🎲 deu errado...' }}</span>
        <div class="muted">{{ game.bigOffer.out }}</div>
      </div>
      <div v-if="game.poder && game.poder.pending" class="sumbox vt-banner">
        <span>📜</span>
        <div><b>Um projeto do Legislativo aguarda a sua decisão.</b><small class="muted">Sancione ou vete. Se deixar passar, vira lei sozinho.</small></div>
        <button class="primary" @click="mini = 'veto'">Decidir</button>
      </div>
      <div class="sumbox minirow">
        <button :disabled="game.mini.plenario" @click="mini = 'plenario'">🏛️ {{ plenLabel }} <small>(grátis, 1 vez por rodada)</small></button>
        <span v-if="miniMsg" class="muted">{{ miniMsg }}</span>
      </div>
      <div class="acts">
        <button v-for="a in actions" :key="a.id" class="act" :class="{ armed: armed === a.id }" :disabled="!canDo(a)" @click="arm(a)">
          <b>{{ a.name }} <small class="sphtag" :title="sph[actionSphere(a)].name">{{ sph[actionSphere(a)].icon }}</small></b>
          <small>{{ a.desc }}</small>
          <div>
            <span v-if="a.special" class="chip">{{ a.id === 'ligar' ? '💬 conversa' : '🎮 mini jogo' }}</span>
            <span v-if="a.dirty" class="chip down">⚠️ polêmico: {{ Math.round(a.risk * 100) }}% de escândalo</span>
            <span v-for="c in chips(a.fx)" :key="c.k" class="chip" :class="[c.cls, { boost: c.mod }]" :title="c.tip">{{ c.v > 0 ? '+' : '' }}{{ c.v }} {{ c.label }}{{ c.mod ? '*' : '' }}</span>
          </div>
        </button>
      </div>
      <p class="muted" style="margin-top: 10px">* valor ajustado pelo seu perfil.</p>
      <div class="advbar">
        <span class="advap"><i v-for="n in 2" :key="n" :class="{ on: n <= game.ap }"></i>{{ game.ap }}/2 ações</span>
        <button class="primary" @click="armed = null; endTurn()">Avançar o tempo ⏩</button>
      </div>
    </template>

    <Recap v-else-if="game.phase === 'recap'" />

    <!-- BALANÇO DO MANDATO -->
    <Balance v-else-if="game.phase === 'balance'" />

    <!-- RUMO DA CARREIRA -->
    <Rumo v-else-if="game.phase === 'rumo'" />

    <!-- CAMPANHA -->
    <template v-else-if="game.phase === 'campaign'">
      <h2>Hora da eleição: {{ targetOffice() }}</h2>
      <p class="lead">O mandato de {{ stageInfo().office }} acabou. Seu adversário: <b>{{ game.election.rivalName }}</b> ({{ game.election.sigA }}).<span v-if="game.election.labelB && !isProportional()"> Também na disputa: <b>{{ game.election.labelB }}</b> ({{ game.election.sigB }}).</span> Última pesquisa:</p>
      <TicketPicker v-if="needsTicket() && !game.election.ticketDone" />
      <template v-if="est">
        <div class="big">{{ est.rank }}º</div>
        <p class="muted" style="margin-bottom: 12px">posição estimada entre {{ est.cands }} candidatos. São {{ est.seats }} vagas e elege quem ficar entre os {{ est.seats }} mais votados (voto proporcional).</p>
      </template>
      <template v-else>
        <div class="big">{{ poll.toFixed(1) }}%</div>
        <p class="muted" style="margin-bottom: 12px">intenção de voto, margem de erro de 3 pontos</p>
      </template>
      <p v-if="hasSecondRound()" class="legend" style="margin-top: -4px">Nesta eleição quem não passar de 50% dos votos válidos no 1º turno disputa o segundo turno. Ficar bem abaixo da pesquisa pode te eliminar.</p>
      <div v-if="game.election.promises.length" class="sumbox" style="margin-top: 0">
        <b>📜 Suas promessas</b>
        <div v-for="p in game.election.promises" :key="p.id" class="muted">{{ p.kept ? '✅ Cumprida' : '❌ Quebrada' }}: {{ p.icon }} {{ p.name }}</div>
        <div class="muted">Efeito nas urnas: {{ game.election.planBonus > 0 ? '+' : '' }}{{ game.election.planBonus.toFixed(1) }} pontos</div>
      </div>
      <BrazilMap :home="game.region.mapId" :colors="colors" />
      <p class="legend">Estimativa por estado (verde forte, vermelho fraco).</p>
      <div class="sumbox minirow">
        <button :disabled="game.election.tvDone" @click="mini = 'debate'">📺 Participar do debate na TV <small>(opcional, 1 vez)</small></button>
        <span v-if="game.election.tvDone" class="muted">Efeito do debate: {{ game.election.tv > 0 ? '+' : '' }}{{ game.election.tv }} ponto(s)</span>
      </div>
      <div class="choices">
        <button v-for="c in CAMPAIGNS" :key="c.id" class="act" :disabled="game.stats.cash < campaignCost(c) || (needsTicket() && !game.election.ticketDone)" @click="chooseCampaign(c.id)">
          <b>{{ c.name }} <span v-if="campaignCost(c)" class="chip">custa {{ campaignCost(c) }} de caixa ({{ money(campaignCost(c)) }})</span></b>
          <small>{{ c.desc }}</small>
        </button>
      </div>
    </template>

    <!-- SEGUNDO TURNO -->
    <template v-else-if="game.phase === 'runoff'">
      <h2>🔥 Segundo turno: {{ targetOffice() }}</h2>
      <p class="lead">Ninguém levou no primeiro turno. Agora é você contra <b>{{ game.election.rivalName }}</b>.</p>
      <div class="sumbox runoffbox">
        <div class="rf"><b>{{ game.election.first.mine.toFixed(1).replace('.', ',') }}%</b><small>você</small></div>
        <span class="vs">x</span>
        <div class="rf"><b>{{ game.election.first.theirs.toFixed(1).replace('.', ',') }}%</b><small>{{ game.election.rivalName }}</small></div>
      </div>
      <p class="muted">1º turno, votos válidos. O restante foi para outros candidatos e agora está em disputa.</p>
      <div class="big">{{ poll.toFixed(1) }}%</div>
      <p class="muted" style="margin-bottom: 12px">pesquisa do segundo turno, margem de erro de 3 pontos</p>
      <div v-if="game.election.support.length" class="sumbox" style="margin-top: 0">
        <b>🤝 Apoios dos seus contatos</b>
        <div v-for="s in game.election.support" :key="s.id" class="muted">{{ s.v > 0 ? '✅ +1 ponto' : '⚠️ −1 ponto' }}: {{ s.label }}</div>
      </div>
      <BrazilMap :home="game.region.mapId" :colors="colors" />
      <div class="sumbox minirow">
        <button :disabled="game.election.tvDone" @click="mini = 'debate'">📺 Debate decisivo na TV <small>(opcional, 1 vez)</small></button>
        <span v-if="game.election.tvDone" class="muted">Efeito do debate: {{ game.election.tv > 0 ? '+' : '' }}{{ game.election.tv }} ponto(s)</span>
      </div>
      <div class="choices">
        <button v-for="o in RUNOFF" :key="o.id" class="act" :disabled="game.stats.cash < o.cost" @click="chooseRunoff(o.id)">
          <b>{{ o.name }}
            <span v-if="o.cost" class="chip">custa {{ o.cost }} de caixa ({{ money(o.cost) }})</span>
            <span v-if="o.id === 'aliancas'" class="chip up">+{{ String(runoffBonus(o.id)).replace('.', ',') }} pontos</span>
            <span v-if="o.risk" class="chip warn">🎲 70%: +5 pontos · 30%: −3 · −5 imagem</span>
          </b>
          <small>{{ o.desc }}</small>
        </button>
      </div>
    </template>

    <!-- RESULTADO DA ELEIÇÃO -->
    <template v-else-if="game.phase === 'result'">
      <h2>{{ game.election.result.won ? 'Vitória!' : 'Derrota' }}</h2>
      <Newspaper :news="game.election.news">{{ game.election.result.campaign }}: eleição para {{ targetOffice() }}. <template v-if="game.election.result.prop">Você ficou em {{ game.election.result.rank }}º lugar entre {{ game.election.result.cands }} candidatos, para {{ game.election.result.seats }} vagas, com {{ game.election.result.share.toFixed(1) }}% dos votos nominais.</template><template v-else>Você teve {{ game.election.result.share.toFixed(1) }}% dos votos válidos contra {{ game.election.rivalName }}.</template></Newspaper>
      <button class="primary" style="width: 100%; margin-top: 12px" @click="continueAfterResult">
        {{ game.election.result.won ? 'Tomar posse' : 'Ver o balanço' }}
      </button>
      <p v-if="game.election.result.first" class="muted" style="margin-top: 8px">1º turno: você {{ game.election.result.first.mine.toFixed(1).replace('.', ',') }}% x {{ game.election.result.first.theirs.toFixed(1).replace('.', ',') }}% {{ game.election.rivalName }}. Segundo turno decidido.</p>
      <p v-else-if="game.election.result.outright" class="muted" style="margin-top: 8px">Eleito(a) já no primeiro turno.</p>
      <p v-else-if="game.election.result.out" class="muted" style="margin-top: 8px">Você ficou fora do segundo turno.</p>
    </template>

    <!-- NOVO PLANO DE GOVERNO -->
    <template v-else-if="game.phase === 'plan'">
      <h2>Tomou posse: {{ stageInfo().office }}</h2>
      <p class="lead">Hora de apresentar o plano de governo deste mandato. Você pode não prometer nada, mas aí ganha menos votos.</p>
      <PlanEditor v-model:name="planName" v-model:ids="planIds" :stats="game.stats" />
      <TabEquipe />
      <button class="primary" style="width: 100%; margin-top: 12px" @click="confirmPlan(planName, planIds)">Começar o mandato</button>
    </template>
    <Teleport to="body">
      <MiniDebate v-if="mini === 'debate'" @done="miniDone" />
      <MiniPlenario v-if="mini === 'plenario'" @done="miniDone" />
      <MiniComicio v-if="mini === 'comicio'" @done="miniDone" />
      <MiniVeto v-if="mini === 'veto'" @close="(r) => { mini = null; if (r) miniMsg = `📜 “${r.bill.title}”: ${r.choice === 'sancionar' ? 'sancionado' : r.overridden ? 'veto derrubado' : 'veto mantido'}.` }" />
      <MiniContato v-if="mini === 'conversa'" mode="in" @close="mini = null" />
      <MiniContato v-if="mini === 'ligar'" mode="out" :month="miniMonth" @close="mini = null; armed = null" />
    </Teleport>
  </section>
</template>