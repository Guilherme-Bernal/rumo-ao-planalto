<script setup>
defineProps({ news: Object })
</script>

<template>
  <article class="paper" :class="news.tone">
    <header class="mast">
      <span class="mname">{{ news.icon }} {{ news.outlet }}</span>
      <small>{{ news.date }}</small>
    </header>
    <h2 class="headline">{{ news.headline }}</h2>
    <p class="deck">{{ news.deck }}</p>
    <div class="body"><slot /></div>
    <div class="cols">
      <div v-for="(s, i) in news.side" :key="i" class="side"><span>{{ s.icon }}</span> {{ s.text }}</div>
    </div>
    <div v-if="news.reactions" class="react">
      <h4>🗣️ Repercussão</h4>
      <div v-for="(v, i) in news.reactions.voices" :key="i" class="voice"><b>{{ v.icon }} {{ v.name }}</b> <small>{{ v.role }}</small><p>{{ v.text }}</p></div>
      <h4>📰 Nos outros jornais</h4>
      <div v-for="(p, i) in news.reactions.press" :key="i" class="press"><b>{{ p.outlet }}:</b> {{ p.text }} <small>({{ p.lean }})</small></div>
    </div>
    <footer>
      <span>🖋️ {{ news.cartoon }}</span>
      <b>{{ news.pollLine }}</b>
    </footer>
  </article>
</template>