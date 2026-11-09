<script setup>
import { computed, ref } from 'vue'
import { courtName, acaoPendente, upholdChance, defenderAcao, acatarAcao, inquerito, defesaInquerito, game, isExec, exeCan, exeLeft, cargoName, PASTAS, PERFIS, nomear, nomeadoDe, liberarEmendas, DECRETOS, decretar, sustarChance, isLeg, legCan, legLeft, legScope, VISITS, fiscalizar, COMISSOES, comissaoAtiva, escolherComissao, relatar, CPIS, cpiChance, cpiDone, abrirCPI, EMENDAS, emendar, obstruir, obstrucaoAtiva, statutesActive, officeInfo, worldTemas, worldOusadia, lawChance, lawName, lawHas, lawsActive, proposeLaw, coalition } from '../../game/engine'

const w = computed(() => game.world)
const co = computed(() => coalition())
const active = computed(() => lawsActive())
const old = computed(() => w.value.laws.filter((l) => !active.value.includes(l)))
const can = computed(() => game.phase === 'actions' && !w.value.lawUsed)
const why = computed(() => (game.phase !== 'actions' ? 'Disponível na fase de ações da rodada.' : w.value.lawUsed ? 'Você já propôs uma lei nesta rodada.' : ''))
const pct = (t, o) => Math.round(lawChance(t, o) * 100)
const col = (p) => (p < 30 ? 'var(--bad)' : p < 55 ? 'var(--warn)' : 'var(--good)')
const stat = computed(() => statutesActive())
const leg = computed(() => isLeg())
const exe = computed(() => isExec())
const com = computed(() => comissaoAtiva())
const msg = ref('')
const run = (fn, ...a) => {
  const r = fn(...a)
  if (r && r.text) msg.value = r.text
  else if (r && r.ok !== undefined) msg.value = r.ok ? 'A CPI deu resultado: você virou referência no assunto.' : 'A CPI não vingou e a base ficou irritada.'
  else if (r && r.pa) msg.value = `${r.nome} assume ${r.pa.name}.`
  else if (r && r.d) msg.value = 'Decreto editado. O Legislativo pode tentar sustá-lo na próxima rodada.'
  else if (r && r.secreto !== undefined) msg.value = r.caught ? 'O orçamento paralelo vazou e virou escândalo.' : r.secreto ? 'Verba negociada por fora. Ninguém viu, por enquanto.' : 'Emendas liberadas. Sua base vota com você.'
  else if (r && r.e) msg.value = 'Emenda destinada. A população percebe o benefício.'
  else if (r && r.c) msg.value = r.bill ? `Relatoria concluída e o projeto “${r.bill.title}” foi aprovado.` : 'Relatoria concluída. Você ganhou crédito na comissão.'
}
const HOW = { plenario: 'aprovada no plenário', decreto: 'decreto (pode ser sustado)', sancao: 'sancionada', parcial: 'sancionada com veto parcial', derrubado: 'veto derrubado', prazo: 'por decurso de prazo' }
const fxTxt = (fx) => Object.entries(fx).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${statName[k] || k}`).join(' · ')
const tl = computed(() => (game.poder && game.poder.timeline) || [])
const statName = { soc: 'Serviços', seg: 'Segurança', eco: 'Economia', cash: 'Caixa', img: 'Imagem', pop: 'Popularidade' }
</script>

<template>
  <div>
    <h2>⚖️ Propor leis</h2>
    <p class="muted">
      Como {{ officeInfo().name }}, você pode apresentar <b>uma proposta por rodada</b>. Escolha o tema e o tamanho da ideia. A chance depende da sua base
      ({{ Math.round(game.stats.cong) }}), da coalizão ({{ co.votes }} voto(s) garantido(s){{ co.angry ? ', insatisfeita' : '' }}) e da ousadia. Lei aprovada rende na hora e um pouco por rodada, enquanto você estiver neste nível de poder.
      <span v-if="why"> · {{ why }}</span>
    </p>
    <p v-if="w.last && /(Aprovada|Rejeitada)/.test(w.last.text)" class="sumbox" :style="{ marginTop: '8px', borderColor: w.last.ok ? 'var(--good)' : 'var(--bad)' }">{{ w.last.ok ? '✅' : '⚠️' }} {{ w.last.text }}</p>

    <div v-for="t in worldTemas()" :key="t.id" class="tema">
      <div><b>{{ t.ico }} {{ t.name }}</b> <small class="muted">mexe com {{ statName[t.stat] }}</small></div>
      <div class="acts">
        <button v-for="o in worldOusadia()" :key="o.id" type="button" :disabled="!can || lawHas(t.id, o.id) || game.stats.cash < o.cost" :title="lawName(t.id, o.id)" @click="proposeLaw(t.id, o.id)">
          <b>{{ o.name }}</b>
          <small>{{ t.nomes[o.id - 1] }}</small>
          <small v-if="lawHas(t.id, o.id)">✅ já aprovada</small>
          <small v-else>
            <span :style="{ color: col(pct(t.id, o.id)) }">{{ pct(t.id, o.id) }}% de aprovar</span>
            · <span class="u">+{{ o.one }} {{ statName[t.stat] }}</span><span v-if="o.cost" class="dn"> · -{{ o.cost }} Caixa</span>
          </small>
        </button>
      </div>
    </div>

    <h3 class="sub">⚖️ {{ courtName() }}</h3>
    <p v-if="!acaoPendente() && !inquerito()" class="legend">Nada em julgamento. Leis polêmicas e decretos podem ser questionados pela oposição, e escândalos podem virar inquérito.</p>
    <div v-if="acaoPendente()" class="sumbox">
      📑 Ação de inconstitucionalidade contra <b>{{ acaoPendente().title }}</b>. Chance de a lei ser mantida: {{ Math.round(upholdChance() * 100) }}%. Se nada for feito, o tribunal julga na próxima rodada.
      <div class="acts" style="margin-top: 6px">
        <button type="button" :disabled="acaoPendente().defended || game.stats.cash < 2" @click="defenderAcao()"><b>🧑‍⚖️ Reforçar a defesa</b><small>-2 Caixa, +15% de chance</small></button>
        <button type="button" @click="acatarAcao()"><b>🏳️ Recuar e revogar</b><small>A lei cai sem desgaste maior</small></button>
      </div>
    </div>
    <div v-if="inquerito()" class="sumbox" :style="{ marginTop: '8px', borderColor: 'var(--bad)' }">
      🕵️ Inquérito aberto sobre você (fase {{ inquerito().round }}/3). Perde Imagem a cada rodada e é decidido na terceira.
      <div class="acts" style="margin-top: 6px">
        <button type="button" :disabled="inquerito().def || game.stats.cash < 3" @click="defesaInquerito('defesa')"><b>🧑‍⚖️ Contratar defesa</b><small>-3 Caixa, melhora o desfecho</small></button>
        <button type="button" :disabled="inquerito().col" @click="defesaInquerito('colaborar')"><b>🤝 Colaborar com a investigação</b><small>-2 Imagem, esfria o caso</small></button>
      </div>
    </div>

    <template v-if="exe">
      <h3 class="sub">🏛️ Governo <small class="muted">· {{ exeLeft() }} ação(ões) nesta rodada</small></h3>
      <p v-if="msg" class="sumbox">{{ msg }}</p>
      <p class="legend">{{ cargoName() }}s: técnico rende na pasta, indicação política compra base e amigo é leal, mas é arriscado.</p>
      <div v-for="pa in PASTAS" :key="pa.id" class="tema">
        <div><b>{{ pa.icon }} {{ pa.name }}</b> <small class="muted">{{ nomeadoDe(pa.id) && nomeadoDe(pa.id).stage === game.stage ? nomeadoDe(pa.id).nome + ' · ' + nomeadoDe(pa.id).perfil : 'vaga' }}</small></div>
        <div class="acts">
          <button v-for="pf in PERFIS" :key="pf.id" type="button" :disabled="!exeCan('nomear:' + pa.id)" :title="pf.desc" @click="run(nomear, pa.id, pf.id)"><b>{{ pf.icon }} {{ pf.name }}</b><small>{{ pf.desc }}</small></button>
        </div>
      </div>
      <h3 class="sub">💸 Emendas e decretos</h3>
      <div class="acts">
        <button type="button" :disabled="!exeCan('emendas') || game.stats.cash < 3" @click="run(liberarEmendas, false)"><b>💸 Liberar emendas</b><small>+4 Base, +1 Pop, -3 Caixa</small></button>
        <button type="button" :disabled="!exeCan('secreto') || game.stats.cash < 1" @click="run(liberarEmendas, true)"><b>🕳️ Verba por fora do radar</b><small>+7 Base, mas 35% de virar escândalo</small></button>
      </div>
      <div class="acts" style="margin-top: 8px">
        <button v-for="d in DECRETOS" :key="d.id" type="button" :disabled="!exeCan('decreto')" @click="run(decretar, d.id)"><b>{{ d.icon }} {{ d.title.replace('Decreto de ', '') }}</b><small>Vale já, mas {{ Math.round(sustarChance() * 100) }}% de ser sustado</small></button>
      </div>
    </template>

    <template v-if="leg">
      <h3 class="sub">🔎 Mandato legislativo <small class="muted">· {{ legLeft() }} ação(ões) nesta rodada · escopo {{ legScope().name }}</small></h3>
      <p v-if="msg" class="sumbox">{{ msg }}</p>
      <p class="legend">Você pode apresentar até 3 projetos por rodada e fazer até 2 ações abaixo.</p>
      <div class="acts">
        <button v-for="v in VISITS" :key="v.id" type="button" :disabled="!legCan('visita:' + v.id)" @click="run(fiscalizar, v.id)">
          <b>{{ v.icon }} {{ v.name }}</b><small>Visitar e fiscalizar</small>
        </button>
      </div>
      <div class="acts" style="margin-top: 8px">
        <button v-for="e in EMENDAS" :key="e.id" type="button" :disabled="!legCan('emenda')" @click="run(emendar, e.id)">
          <b>{{ e.icon }} {{ e.name }}</b><small>Emenda parlamentar</small>
        </button>
        <button type="button" :disabled="!legCan('obstrucao') || obstrucaoAtiva()" @click="obstruir()">
          <b>⏸️ Obstrução</b><small>{{ obstrucaoAtiva() ? 'Armada para a próxima votação' : 'Pedir vista se perder a próxima' }}</small>
        </button>
      </div>
      <h3 class="sub">🧑‍⚖️ Comissões e CPI</h3>
      <p v-if="com" class="legend">{{ com.icon }} Você integra a <b>{{ com.name }}</b>: reforço contínuo e mais chance nas leis do tema.</p>
      <div class="acts">
        <template v-if="!com"><button v-for="c in COMISSOES" :key="c.id" type="button" @click="escolherComissao(c.id)"><b>{{ c.icon }} {{ c.name }}</b><small>Entrar nesta comissão</small></button></template>
        <button v-else type="button" :disabled="!legCan('relatar')" @click="run(relatar)"><b>📝 Relatar projeto</b><small>Ganha base e pode aprovar uma lei</small></button>
      </div>
      <div class="acts" style="margin-top: 8px">
        <button v-for="k in CPIS" :key="k.id" type="button" :disabled="cpiDone() || game.phase !== 'actions'" @click="run(abrirCPI, k.id)">
          <b>{{ k.icon }} CPI: {{ k.name }}</b><small>{{ cpiDone() ? 'Já aberta neste mandato' : Math.round(cpiChance(k.id) * 100) + '% de dar resultado · -2 Caixa' }}</small>
        </button>
      </div>
    </template>

    <h3 class="sub">📜 Leis do seu mandato ({{ stat.length }})</h3>
    <p v-if="!stat.length" class="legend">Projetos aprovados no plenário ou sancionados por você aparecem aqui e continuam rendendo por algumas rodadas.</p>
    <ul v-else class="laws">
      <li v-for="l in stat" :key="l.id">{{ l.icon }} <b>{{ l.title }}</b> <small class="muted">· {{ HOW[l.how] }} · {{ fxTxt(l.fx) }} por rodada · {{ l.left }} rodada(s)</small></li>
    </ul>

    <h3 class="sub">🕰️ Linha do tempo do mandato</h3>
    <p v-if="!tl.length" class="legend">Sanções, vetos e votações importantes ficam registrados aqui.</p>
    <ol v-else class="tline">
      <li v-for="(t, i) in tl.slice(0, 12)" :key="i" :class="'t-' + t.tone"><span class="tl-r">R{{ t.r }}</span><span>{{ t.icon }} {{ t.text }}</span></li>
    </ol>

    <h3 class="sub">📚 Leis em vigor neste cargo ({{ active.length }})</h3>
    <p v-if="!active.length" class="legend">Nenhuma ainda. Proponha a primeira.</p>
    <ul v-else class="laws">
      <li v-for="l in active" :key="l.id">⚖️ {{ l.name }} <small class="muted">· +{{ statName[l.stat] }} por rodada</small></li>
    </ul>
    <template v-if="old.length">
      <h3 class="sub">🏛️ Legado de cargos anteriores</h3>
      <ul class="laws muted">
        <li v-for="l in old" :key="l.id">{{ l.name }}</li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.tema { margin: 12px 0; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 6px; margin-top: 6px; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; }
.acts small span { margin-right: 6px; }
.u { color: var(--good); }
.dn { color: var(--bad); }
.laws { padding-left: 18px; margin: 6px 0; }
.laws li { margin: 4px 0; }
</style>