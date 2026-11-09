<script setup>
import { computed } from 'vue'
import { game, STATS, continueBalance, money } from '../game/engine'

const b = computed(() => game.balance)
const rows = computed(() =>
  STATS.map((s) => ({
    ...s,
    from: b.value.start ? Math.round(b.value.start[s.k]) : null,
    to: Math.round(b.value.end[s.k]),
    d: b.value.delta[s.k] || 0,
  })),
)
const name = (k) => STATS.find((s) => s.k === k)?.label || k
const gcolor = computed(() => ({ A: '#22c55e', B: '#84cc16', C: '#eab308', D: '#f97316', E: '#ef4444' })[b.value.grade])
</script>

<template>
  <div v-if="b">
    <h2>📊 Balanço do mandato</h2>
    <p class="muted">{{ b.office }} · {{ b.term }}º mandato<span v-if="b.age != null"> · {{ b.age }} anos</span></p>

    <div class="bal-head">
      <div class="bal-grade" :style="{ borderColor: gcolor, color: gcolor }">{{ b.grade }}</div>
      <div>
        <b>{{ b.gradeText }}</b>
        <div class="muted">
          Melhor área: {{ name(b.best.k) }} ({{ Math.round(b.best.v) }}). Mais frágil: {{ name(b.worst.k) }} ({{ Math.round(b.worst.v) }}).
        </div>
      </div>
    </div>

    <div class="sumbox">
      <b>📈 Seus números neste mandato</b>
      <div v-for="r in rows" :key="r.k" class="stat">
        <div class="row">
          <span>{{ r.icon }} {{ r.label }}</span>
          <span>
            <small v-if="r.from != null" class="muted">{{ r.from }} →</small> {{ r.to }}
            <small v-if="b.start" :class="r.d > 0 ? 'up' : r.d < 0 ? 'down' : 'muted'">{{ r.d > 0 ? '+' : '' }}{{ r.d }}</small>
          </span>
        </div>
        <div class="bar"><i :style="{ width: r.to + '%' }"></i></div>
      </div>
      <div class="muted">💰 Caixa: {{ money(b.end.cash) }}</div>
    </div>

    <div class="sumbox" v-if="b.total">
      <b>📜 Promessas: {{ b.keptN }} de {{ b.total }} cumpridas</b>
      <div v-for="p in b.promises" :key="p.id" class="muted">{{ p.kept ? '✅' : '❌' }} {{ p.icon }} {{ p.name }}</div>
    </div>
    <div class="sumbox" v-else><b>📜 Você não fez promessas neste mandato.</b></div>

    <div class="sumbox bal-flags">
      <span class="chip" :class="b.scandals ? 'down' : 'up'">{{ b.scandals ? `🚨 ${b.scandals} escândalo(s)` : '🧼 Sem escândalos' }}</span>
      <span class="chip">🤝 {{ b.deals }} acordo(s) ativo(s)</span>
      <span v-if="b.power >= 10" class="chip down">⚡ Poder concentrado: {{ Math.round(b.power) }}</span>
    </div>

    <div class="sumbox" v-if="b.log.length">
      <b>🗞️ O que marcou o período</b>
      <div v-for="(l, i) in b.log" :key="i" class="muted">• {{ l }}</div>
    </div>

    <div class="sumbox" v-if="!b.final">
      <b>🎯 Próximo passo</b>
      <p class="muted">Agora é você quem escolhe o caminho: reeleição ou outro cargo, dentro das regras da lei e da sua idade. Seu rival na disputa será {{ b.rival }}.</p>
    </div>

    <button class="primary" style="width: 100%; margin-top: 12px" @click="continueBalance">{{ b.final ? 'Ver o legado' : 'Escolher o caminho' }}</button>
  </div>
</template>