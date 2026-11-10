<script setup>
import { computed } from 'vue'
import { game, STATS, reuniaoAtual, reuniaoDef, reuniaoTitulo, reuniaoAbordagens, reuniaoTraits, reuniaoLocal, reuniaoAbordar, reuniaoCustoOk, reuniaoFechar } from '../../game/engine'

const r = computed(() => reuniaoAtual())
const d = computed(() => (r.value ? reuniaoDef(r.value.defId) : null))
const ab = reuniaoAbordagens()
const tr = reuniaoTraits()
const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const humor = (a) => (a <= -2 ? '😡' : a < 0 ? '😠' : a < 1 ? '😐' : a < 2 ? '🙂' : '😄')
const chips = (fx) => Object.entries(fx || {}).filter(([, v]) => v).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${short[k] || k}`).join(' · ')
const resultTitle = computed(() => ({ acordo: '✅ Acordo fechado', parcial: '🤏 Acordo parcial', fracasso: '❌ Sem acordo' })[r.value.resultado.cls])
const rodada = computed(() => Math.min(3, Math.max(1, r.value.step)))
const out = computed(() => (r.value && r.value.resultado ? d.value.out[r.value.resultado.cls] : null))
</script>

<template>
  <div v-if="r && d" class="reu-bg" role="dialog" aria-modal="true">
    <div class="reu">
      <h2>{{ d.icon }} {{ reuniaoTitulo(r) }}</h2>
      <p class="muted">Em pauta: {{ d.tema }}.</p>

      <div class="parts">
        <div v-for="(p, i) in r.parts" :key="i" class="part">
          <div class="who"><span class="ic">{{ p.icon }}</span> <b>{{ p.nome }}</b> <small class="muted">{{ p.nome === p.role ? '' : p.role }} · {{ tr[p.trait].icon }} {{ tr[p.trait].label }}</small>
            <span class="mood" :title="'Atitude: ' + p.att">{{ humor(p.att) }}</span></div>
          <p v-if="p.lembra" class="lembra">🧠 {{ p.lembra }}</p>
          <div class="meter"><i :style="{ width: ((p.att + 3) / 6) * 100 + '%' }"></i></div>
          <p v-if="r.step >= 1 && r.step <= 3 && r.falas[i]" class="fala">“{{ r.falas[i] }}”</p>
        </div>
      </div>

      <template v-if="r.step === 0">
        <h3>📍 Onde vai ser?</h3>
        <div class="opts">
          <button v-for="l in d.locais" :key="l.id" type="button" @click="reuniaoLocal(l.id)"><b>{{ l.label }}</b></button>
        </div>
      </template>

      <template v-else-if="r.step <= 3">
        <h3>🗣️ Rodada {{ rodada }} de 3{{ r.loc ? ' · ' + r.loc : '' }}: como você conduz?</h3>
        <p v-if="r.reacoes.length" class="muted">Última rodada: <span v-for="x in r.reacoes" :key="x.nome" class="rx" :class="{ up: x.d > 0, dn: x.d < 0 }">{{ x.nome.split(' ')[0] }} {{ x.d > 0 ? '👍' : x.d < 0 ? '👎' : '·' }}</span></p>
        <div class="opts">
          <button v-for="a in ab" :key="a.id" type="button" :disabled="!reuniaoCustoOk(a.id)" :title="a.desc" @click="reuniaoAbordar(a.id)">
            <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small>
            <small v-if="a.cost && game.stats.cash < a.cost" class="why">🔒 Sem Caixa.</small>
          </button>
        </div>
      </template>

      <template v-else-if="r.resultado">
        <h3>{{ resultTitle }}</h3>
        <p>{{ r.resultado.text }}</p>
        <p class="muted">{{ chips(out.fx) }}</p>
        <button type="button" class="ok" @click="reuniaoFechar">Encerrar reunião</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.reu-bg { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 60; padding: 10px; overflow: auto; }
.reu { background: var(--panel, #131a2b); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 14px; padding: 14px; max-width: 560px; width: 100%; max-height: 94vh; overflow: auto; }
h2 { margin: 0 0 4px; font-size: 1.1rem; }
h3 { margin: 12px 0 6px; font-size: 0.98rem; }
.lembra { margin: 2px 0; font-size: 0.82rem; opacity: 0.85; font-style: italic; }
.parts { display: grid; gap: 8px; margin-top: 8px; }
.part { background: rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 8px 10px; }
.who { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.mood { margin-left: auto; font-size: 1.2rem; line-height: 1.4; flex-shrink: 0; }
.meter { height: 5px; border-radius: 4px; background: rgba(255, 255, 255, 0.12); margin: 6px 0; overflow: hidden; }
.meter i { display: block; height: 100%; background: var(--accent, #fbbf24); transition: width 0.4s; }
.fala { margin: 4px 0 0; font-style: italic; font-size: 0.9rem; }
.opts { display: grid; gap: 6px; }
.opts button { text-align: left; padding: 8px 10px; }
.opts small { display: block; opacity: 0.85; margin-top: 2px; }
.rx { margin-right: 8px; }
.rx.up { color: var(--good); }
.rx.dn { color: var(--bad); }
.why { color: var(--warn); }
.ok { margin-top: 8px; padding: 10px 14px; }
</style>
