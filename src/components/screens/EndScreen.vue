<script setup>
import { ref } from 'vue'
import { game, STATS, resetGame, country } from '../../game/engine'
import { ACHIEVEMENTS, loadHall } from '../../game/extras'
import Avatar from '../character/Avatar.vue'
import { epilogue } from '../../game/epilogue'
import { shareCard } from '../../game/sharecard'

const epi = epilogue(game)

const copied = ref(false)
const imgMsg = ref('')
const hall = loadHall().slice(0, 5)
const earned = ACHIEVEMENTS.filter((a) => game.runUnlocked.includes(a.id))
const title = game.phase === 'end' ? game.legacy.title : game.over.title

async function shareImage() {
  const path = game.history.map((h) => h.office).join(' → ') || 'Nenhuma eleição vencida'
  const keys = ['pop', 'eco', 'cash', 'img']
  const stats = STATS.filter((s) => keys.includes(s.k)).map((s) => ({ icon: s.icon, label: s.short, v: Math.round(game.stats[s.k]) }))
  const r = await shareCard({
    name: game.name,
    region: `${game.city?.name || game.region.name} (${game.region.id})`,
    title,
    ok: game.phase === 'end',
    points: game.points,
    path,
    stats,
    epi: epi[0],
    trophies: earned.slice(0, 8).map((a) => a.icon).join(' '),
    daily: game.daily,
    url: location.host + location.pathname.replace(/\/$/, ''),
  })
  if (r === 'download') {
    imgMsg.value = 'Imagem salva!'
    setTimeout(() => (imgMsg.value = ''), 2500)
  }
}

async function share() {
  const c = country()
  const path = game.history.map((h) => h.office).join(' → ') || 'Sem vitórias'
  const text = [
    `🏛️ Rumo ao Planalto${game.daily ? ' (desafio do dia)' : ''}`,
    `${game.name} (${game.region.id}): ${title}, ${game.points} pts`,
    `Carreira: ${path}`,
    earned.length ? `🏆 ${earned.map((a) => a.icon).join(' ')}` : '',
    location.href,
  ]
    .filter(Boolean)
    .join('\n')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2500)
  } catch {
    prompt('Copie o resultado:', text)
  }
}
</script>

<template>
  <div class="screen">
    <div class="box panel card">
      <div v-if="game.look" style="display: flex; justify-content: center; margin-bottom: 10px"><Avatar :look="game.look" :size="96" /></div>
      <template v-if="game.phase === 'over'">
        <h1 style="color: var(--bad)">{{ game.over.title }}</h1>
        <p class="lead" style="margin-top: 8px">{{ game.over.text }}</p>
      </template>
      <template v-else>
        <h1 style="color: var(--good)">{{ game.legacy.title }}</h1>
        <p class="lead" style="margin-top: 8px">{{ game.legacy.text }}</p>
      </template>
      <p class="big">{{ game.points }} pts</p>

      <h3 style="margin: 12px 0 6px">📖 Epílogo</h3>
      <p v-for="(l, i) in epi" :key="i" class="lead" style="margin-bottom: 6px">{{ l }}</p>

      <h3 style="margin: 12px 0 6px">Sua carreira</h3>
      <p v-if="!game.history.length" class="muted">Nenhuma eleição vencida.</p>
      <p v-for="(h, i) in game.history" :key="i" class="muted">✔ {{ h.office }} ({{ h.share.toFixed(1) }}% dos votos)</p>

      <h3 style="margin: 12px 0 6px">Estado final</h3>
      <div>
        <span v-for="s in STATS" :key="s.k" class="chip">{{ s.icon }} {{ s.short }} {{ Math.round(game.stats[s.k]) }}</span>
      </div>

      <template v-if="earned.length">
        <h3 style="margin: 12px 0 6px">Conquistas desta carreira</h3>
        <div class="trophies">
          <span v-for="a in earned" :key="a.id" class="trophy" :title="a.desc">{{ a.icon }} {{ a.name }}</span>
        </div>
      </template>

      <h3 style="margin: 12px 0 6px">🏅 Hall da fama</h3>
      <div class="hall">
        <div v-for="(h, i) in hall" :key="i" :class="{ me: i === game.hallPos }">
          <span>{{ i + 1 }}. {{ h.name }} ({{ h.region }}) · {{ h.label }}<template v-if="h.daily"> 📅</template></span>
          <span>{{ h.points }} pts</span>
        </div>
      </div>

      <div class="row-end" style="margin-top: 18px">
        <button @click="shareImage">{{ imgMsg || '🖼️ Imagem para compartilhar' }}</button>
        <button @click="share">{{ copied ? 'Copiado!' : 'Copiar texto' }}</button>
        <button class="primary" @click="resetGame">Jogar de novo</button>
      </div>
    </div>
  </div>
</template>