<script setup>
import { computed, ref, onMounted, onUpdated } from 'vue'
import { game } from '../../game/engine'
import Avatar from '../character/Avatar.vue'

const props = defineProps({ news: Object })
const bodyEl = ref(null)
const long = ref(false)
const measure = () => (long.value = (bodyEl.value?.textContent || '').trim().length > 150)
onMounted(measure)
onUpdated(measure)
const cartoon = computed(() => String(props.news.cartoon || '').replace(/^charge do dia:\s*/i, ''))

const tone = computed(() => props.news.tone || 'flat')
const flash = computed(() => ({ up: 'EM ALTA', down: 'POLÊMICA', flat: '' })[tone.value] || '')
const pct = computed(() => {
  const m = /(\d+(?:[.,]\d+)?)\s*%/.exec(props.news.pollLine || '')
  return m ? Math.min(100, parseFloat(m[1].replace(',', '.'))) : null
})
const pollLabel = computed(() => (props.news.pollLine || '').split(':')[0])
const lean = (l) => (/favor/i.test(l) ? 'fav' : /cr[ií]tic/i.test(l) ? 'cri' : 'neu')
const initial = (n) => (n || '?').replace(/^(Dr\.|Dra\.|Seu|Dona|Tio|Tia|Prof\.|Cabo|Pastor)\s+/, '').slice(0, 1)
</script>

<template>
  <article class="np" :class="tone">
    <div class="np-top"><span>{{ news.date }}</span><span>Edição da manhã · R$ 4,00</span></div>
    <header class="np-mast">
      <span class="np-ico">{{ news.icon }}</span>
      <h3>{{ news.outlet }}</h3>
    </header>
    <div class="np-rule"></div>

    <div v-if="flash" class="np-flash">{{ flash }}</div>
    <h2 class="np-head">{{ news.headline }}</h2>
    <p class="np-deck">{{ news.deck }}</p>

    <div class="np-grid">
      <figure class="np-photo">
        <div class="np-frame"><Avatar v-if="game.look" :look="game.look" :size="108" :round="false" /><div v-else class="np-ph">{{ (game.name || '?')[0] }}</div></div>
        <figcaption>{{ game.name }}</figcaption>
      </figure>
      <div ref="bodyEl" class="np-body" :class="{ drop: long }"><slot /></div>
    </div>

    <div v-if="news.side && news.side.length" class="np-side">
      <div v-for="(s, i) in news.side" :key="i" class="np-note"><span>{{ s.icon }}</span><p>{{ s.text }}</p></div>
    </div>

    <section v-if="news.reactions" class="np-react">
      <h4>🗣️ Repercussão</h4>
      <div class="np-voices">
        <div v-for="(v, i) in news.reactions.voices" :key="i" class="np-voice">
          <span class="np-vava">{{ v.icon || initial(v.name) }}</span>
          <div><b>{{ v.name }}</b> <small>{{ v.role }}</small><p>{{ v.text }}</p></div>
        </div>
      </div>
      <h4>📰 Nos outros jornais</h4>
      <div class="np-press">
        <div v-for="(p, i) in news.reactions.press" :key="i" class="np-clip" :class="lean(p.lean)">
          <b>{{ p.outlet }}</b>
          <p>{{ p.text }}</p>
          <small>{{ p.lean }}</small>
        </div>
      </div>
    </section>

    <footer class="np-foot">
      <div class="np-cartoon"><small>Charge do dia</small>🖋️ {{ cartoon }}</div>
      <div class="np-poll">
        <small>{{ pollLabel }}</small>
        <b>{{ (news.pollLine || '').split(':')[1] }}</b>
        <span v-if="pct != null" class="np-gauge"><i :style="{ width: pct + '%' }"></i></span>
      </div>
    </footer>
  </article>
</template>
