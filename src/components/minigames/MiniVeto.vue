<script setup>
import { ref, computed } from 'vue'
import { STATS, pendingBill, overrideChance, decideBill, officeInfo } from '../../game/engine'
import { billSupport, billOutcome, billBloc, BLOCS } from '../../game/bills'
import { game } from '../../game/engine'
import { sfx } from '../../game/audio'

const emit = defineEmits(['close'])
const bill = pendingBill()
const res = ref(null)
const short = Object.fromEntries(STATS.map((x) => [x.k, x.short]))
const chips = (fx) => Object.entries(fx).filter(([, v]) => v).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${v} ${short[k]}`, good: v > 0 }))
const support = bill ? billSupport(bill, game.poder.pending.round) : 50
const bloc = bill ? BLOCS[billBloc(bill)] : null
const pct = (c) => Math.round(overrideChance(bill, c) * 100)
const opts = computed(() =>
  bill
    ? [
        { k: 'sancionar', ico: '✍️', label: 'Sancionar', desc: 'Vira lei e você leva o crédito.', fx: chips(billOutcome(bill, true, 0, 'pro')), risk: null },
        { k: 'parcial', ico: '✂️', label: 'Vetar em parte', desc: 'Aprova a lei mais fraca e agrada os dois lados.', fx: chips({ ...billOutcome(bill, true, 2, 'pro'), cong: 1 }), risk: pct('parcial') },
        { k: 'vetar', ico: '🛑', label: 'Vetar tudo', desc: 'Derruba o projeto, se o Legislativo não reagir.', fx: chips(billOutcome(bill, false, 0, 'con')), risk: pct('vetar') },
      ]
    : [],
)
const pickOpt = (k) => {
  sfx('vote')
  res.value = decideBill(k)
  sfx(res.value && (k === 'sancionar' || !res.value.overridden) ? 'good' : 'bad')
}
const verdict = computed(() => {
  const r = res.value
  if (!r) return ''
  if (r.choice === 'sancionar') return '✍️ Sancionado: vira lei.'
  if (r.overridden) return '💥 O Legislativo derrubou o seu veto: a lei passa mesmo assim.'
  return r.choice === 'parcial' ? '✂️ Veto parcial mantido: a lei passa mais enxuta.' : '🧱 Veto mantido: o projeto morre.'
})
</script>

<template>
  <div class="minimodal">
    <div class="plen hm" v-if="bill">
      <h3>📜 Sanção ou veto · {{ officeInfo().name }}</h3>
      <p class="muted">O Legislativo aprovou um projeto e ele chegou à sua mesa. Se não decidir até o fim da rodada, vira lei por decurso de prazo.</p>
      <div class="hm-bill">
        <span class="hm-bico">{{ bill.icon }}</span>
        <div>
          <small class="muted">Projeto aprovado pelo Legislativo</small>
          <b>{{ bill.title }}</b>
          <p>{{ bill.ementa }}</p>
          <div class="hm-sides"><span>👍 {{ bill.pro }}</span><span>👎 {{ bill.con }}</span></div>
          <div class="vt-sup"><span>Apoio popular</span><span class="vt-bar"><i :style="{ width: support + '%', background: support >= 55 ? 'var(--good)' : support >= 40 ? 'var(--warn)' : 'var(--bad)' }"></i></span><b>{{ support }}%</b></div>
          <small class="muted">{{ bloc.icon }} Mexe com a {{ bloc.name.toLowerCase() }}</small>
        </div>
      </div>

      <template v-if="!res">
        <div class="vt-opts">
          <button v-for="o in opts" :key="o.k" class="vt-opt" @click="pickOpt(o.k)">
            <span class="vt-ico">{{ o.ico }}</span>
            <span class="vt-body">
              <b>{{ o.label }}</b><small>{{ o.desc }}</small>
              <span class="hm-fx"><span v-for="(c, i) in o.fx" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></span>
              <small v-if="o.risk != null" class="muted">🎲 {{ o.risk }}% de chance de o Legislativo derrubar o veto</small>
            </span>
          </button>
        </div>
        <p class="muted vt-hint">Vetar é mais fácil quando a sua base é grande e quando o projeto é pouco popular.</p>
      </template>
      <div v-else class="plen-res hm-res" :class="res.passed || res.choice === 'sancionar' ? 'ok' : 'no'">
        <p><b>{{ verdict }}</b></p>
        <div class="hm-fx"><span v-for="(c, i) in chips(res.fx)" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
        <small v-if="res.passed" class="muted">A lei continua rendendo um pouco a cada rodada. Veja em Leis.</small>
        <button class="primary" style="margin-top: 10px" @click="emit('close', res)">Continuar</button>
      </div>
    </div>
  </div>
</template>
