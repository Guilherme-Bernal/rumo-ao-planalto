<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { game, stageInfo, ageNow, officeId, POST_OPTS, doPost, canPost, reactsLeft } from '../../game/engine'
import PostCard from '../game/PostCard.vue'
import { fmtNum } from '../../game/social'
import Avatar from '../character/Avatar.vue'

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
  <section class="card sn">
    <h2>📱 Redes</h2>

    <div class="sn-profile">
      <div class="sn-cover"></div>
      <div class="sn-pbody">
        <div class="sn-pava"><Avatar v-if="game.look" :look="game.look" :cargo="officeId()" :idade="ageNow()" :size="68" /><div v-else class="avatar">{{ game.name.slice(0, 1) }}</div></div>
        <div class="sn-pid">
          <b>{{ game.name }} <span class="sp-ok">✔</span></b>
          <small class="muted">{{ handle }}</small>
          <div class="muted">{{ stageInfo().office }} · {{ game.city?.name }}<span v-if="ageNow() != null"> · {{ ageNow() }} anos</span></div>
        </div>
      </div>
      <div class="sn-stats">
        <div><b>{{ fmtNum(game.followers || 0) }}</b><small>seguidores</small></div>
        <div><b>{{ mood }}</b><small>clima</small></div>
        <div><b>{{ reactsLeft() }}</b><small>reações hoje</small></div>
      </div>
    </div>

    <div class="sn-box">
      <h3>🔥 Assuntos do momento</h3>
      <div v-if="!trends.length" class="muted">Nada em alta ainda. Tome decisões para o assunto pegar.</div>
      <div v-for="(t, i) in trends" :key="t.label" class="sn-trend">
        <span class="n">{{ i + 1 }}</span>
        <div class="l"><b>{{ t.label }}</b><span class="mbar"><i :style="{ width: (t.heat / top) * 100 + '%' }"></i></span></div>
        <small class="muted">{{ i === 0 ? 'em alta' : '' }}</small>
      </div>
    </div>

    <div class="sn-box sn-compose">
      <h3>✍️ O que está acontecendo?</h3>
      <div v-if="canPost()" class="post-opts">
        <button v-for="o in POST_OPTS" :key="o.id" class="btn ghost" @click="post(o.id)"><b>{{ o.label }}</b><small>{{ o.desc }}</small></button>
      </div>
      <div v-else class="muted">Você já publicou nesta rodada. {{ msg }}</div>
    </div>

    <div class="sn-feedhead">
      <h3>💬 Feed</h3>
      <div class="sn-tabs"><button v-for="f in FILTERS" :key="f[0]" :class="{ on: filter === f[0] }" @click="filter = f[0]">{{ f[1] }}</button></div>
    </div>
    <div v-if="!posts.length" class="muted">Nada por aqui ainda.</div>
    <PostCard v-for="p in posts" :key="p.id" :post="p" />
  </section>
</template>
