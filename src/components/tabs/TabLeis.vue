<script setup>
import { computed } from 'vue'
import { game, statutesActive, officeInfo, worldTemas, worldOusadia, lawChance, lawName, lawHas, lawsActive, proposeLaw, coalition } from '../../game/engine'

const w = computed(() => game.world)
const co = computed(() => coalition())
const active = computed(() => lawsActive())
const old = computed(() => w.value.laws.filter((l) => !active.value.includes(l)))
const can = computed(() => game.phase === 'actions' && !w.value.lawUsed)
const why = computed(() => (game.phase !== 'actions' ? 'Disponível na fase de ações da rodada.' : w.value.lawUsed ? 'Você já propôs uma lei nesta rodada.' : ''))
const pct = (t, o) => Math.round(lawChance(t, o) * 100)
const col = (p) => (p < 30 ? 'var(--bad)' : p < 55 ? 'var(--warn)' : 'var(--good)')
const stat = computed(() => statutesActive())
const HOW = { plenario: 'aprovada no plenário', sancao: 'sancionada', parcial: 'sancionada com veto parcial', derrubado: 'veto derrubado', prazo: 'por decurso de prazo' }
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