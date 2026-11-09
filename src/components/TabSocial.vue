<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { game, stageInfo, ageNow, POST_OPTS, doPost, canPost, reactsLeft } from '../game/engine'
import PostCard from './PostCard.vue'
import { fmtNum } from '../game/social'
import Avatar from './Avatar.vue'

const handle = computed(() => '@' + game.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').toLowerCase())
const mood = computed(() => (game.stats.pop >= 65 ? '😍 Em alta' : game.stats.pop >= 40 ? '🙂 Morno' : '😡 Em crise'))
const msg = ref('')
const filter = ref('todos')
const FILTERS = [['todos', 'Todos'], ['up', '👍 Apoio'], ['down', '👎 Críticas']]
const posts = computed(() => game.feed.filter((p) => filter.value === 'todos' || (filter.value === 'up' ? p.tone !== 'down' : p.tone === 'down')).slice(0, 14))
function post(k) {
  const r = doPost(k)
  if (r) msg.value = r.text
}
const trends = computed(() => game.trends.slice(0, 6))
const top = computed(() => Math.max(1, ...trends.value.map((t) => t.heat)))
</script>

<template>
  <section class="card">
    <h2>📱 Redes</h2>
    <div class="prof">
      <Avatar v-if="game.look" :look="game.look" :size="52" />
      <div v-else class="avatar">{{ game.name.slice(0, 1) }}</div>
      <div>
        <b>{{ game.name }}</b> <small class="muted">{{ handle }}</small>
        <div class="muted">{{ stageInfo().office }} · {{ game.city?.name }}<span v-if="ageNow() != null"> · {{ ageNow() }} anos</span></div>
      </div>
      <div class="fol"><b>{{ fmtNum(game.followers || 0) }}</b><small>seguidores</small></div>
      <div class="fol"><b>{{ mood }}</b><small>clima</small></div>
    </div>

    <h3>🔥 Assuntos do momento</h3>
    <div v-if="!trends.length" class="muted">Nada em alta ainda. Tome decisões para o assunto pegar.</div>
    <div v-for="(t, i) in trends" :key="t.label" class="trend">
      <span class="n">{{ i + 1 }}</span>
      <span class="l">{{ t.label }}</span>
      <span class="mbar"><i :style="{ width: (t.heat / top) * 100 + '%' }"></i></span>
    </div>

    <h3>✍️ Publicar</h3>
    <div v-if="canPost()" class="post-opts">
      <button v-for="o in POST_OPTS" :key="o.id" class="btn ghost" @click="post(o.id)"><b>{{ o.label }}</b><small>{{ o.desc }}</small></button>
    </div>
    <div v-else class="muted">Você já publicou nesta rodada. {{ msg }}</div>

    <h3>💬 Feed <small class="muted">· {{ reactsLeft() }} reações restantes</small></h3>
    <div class="pfilters"><button v-for="f in FILTERS" :key="f[0]" class="chip btn" :class="{ on: filter === f[0] }" @click="filter = f[0]">{{ f[1] }}</button></div>
    <div v-if="!posts.length" class="muted">Nada por aqui ainda.</div>
    <PostCard v-for="p in posts" :key="p.id" :post="p" />
  </section>
</template>