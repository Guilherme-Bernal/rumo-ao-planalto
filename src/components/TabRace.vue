<script setup>
import { computed } from 'vue'
import { game, targetOffice, raceTable } from '../game/engine'

const t = computed(() => raceTable())
const me = computed(() => t.value.rows.find((r) => r.me))
const lead = computed(() => t.value.rows[0].share)
const hint = computed(() => {
  if (me.value.pos === 1) return 'Você lidera. Mantenha popularidade e imagem para não perder o ritmo.'
  if (me.value.pos <= 2) return 'Está na briga. Popularidade e imagem são o que mais pesa na urna.'
  return 'Você está atrás. Invista em Popularidade, aja para o povo e proteja sua imagem.'
})
</script>

<template>
  <section class="card">
    <h2>🗳️ {{ game.election && game.election.target ? 'Disputa por ' + targetOffice() : 'Disputa e pesquisas' }}</h2>
    <p class="lead">Pesquisa de intenção de voto hoje, para quem você vai enfrentar. Seu principal adversário é <b>{{ game.rival }}</b>.</p>
    <div class="rank">
      <div v-for="r in t.rows" :key="r.name" class="rk" :class="{ me: r.me, rv: r.rival }">
        <div class="pos">{{ r.pos }}º</div>
        <div class="nm">
          <b>{{ r.me ? r.name + ' (você)' : r.name }}</b>
          <small>{{ r.sigla }}<template v-if="r.rival"> · adversário direto</template></small>
          <div class="mbar"><i :style="{ width: (r.share / lead) * 100 + '%' }"></i></div>
        </div>
        <div class="pc">{{ r.share.toFixed(1) }}%</div>
      </div>
      <div class="rk muted"><div class="pos">–</div><div class="nm"><b>Brancos, nulos e indecisos</b></div><div class="pc">{{ t.blank }}%</div></div>
    </div>
    <div class="sumbox"><b>💡 Leitura</b><div class="muted">{{ hint }}</div></div>
  </section>
</template>