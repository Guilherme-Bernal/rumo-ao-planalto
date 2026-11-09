<script setup>
import { ref, computed } from 'vue'
import { game, DEALS, MAX_DEALS, dealsAvailable, dealChance, negotiateDeal, STATS } from '../../game/engine'

const props = defineProps({ month: { type: Number, default: 0 } })
const emit = defineEmits(['close'])
const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const res = ref(null)
const list = computed(() => dealsAvailable())
const full = computed(() => (game.deals || []).length >= MAX_DEALS)
const chips = (fx) => Object.entries(fx).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${v} ${short[k]}`, good: v > 0 }))
const go = (d) => {
  res.value = negotiateDeal(d.id, props.month)
}
</script>

<template>
  <div class="minimodal">
    <div class="plen gab">
      <h3>🤝 Negociar um acordo</h3>
      <template v-if="!res">
        <p class="muted">Acordos dão um efeito na assinatura e um bônus (ou custo) a cada rodada, por 4 rodadas. Você pode manter {{ MAX_DEALS }} ao mesmo tempo. A chance depende da sua força na área.</p>
        <p v-if="full" class="notice">Você já tem {{ MAX_DEALS }} acordos ativos. Rompa um na aba Gabinete para abrir espaço.</p>
        <div class="gab-list">
          <button v-for="d in list" :key="d.id" class="gab-item" :disabled="full" @click="go(d)">
            <b>{{ d.icon }} {{ d.name }} <small class="chip">{{ d.scope === 'internacional' ? '🌍 internacional' : '🇧🇷 nacional' }}</small></b>
            <small>{{ d.desc }}</small>
            <span>
              <span v-for="c in chips(d.sign)" :key="'s' + c.t" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span>
              <small class="muted"> ao assinar · por rodada: </small>
              <span v-for="c in chips(d.perk)" :key="'p' + c.t" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t.replace(/^([+-])(\d)/, '$1$2') }}</span>
            </span>
            <small :class="dealChance(d) >= 0.6 ? 'up' : 'warn'">Chance de fechar: {{ Math.round(dealChance(d) * 100) }}%</small>
          </button>
          <p v-if="!list.length" class="muted">Não há acordos novos disponíveis para o seu cargo.</p>
        </div>
        <button style="margin-top: 10px" @click="emit('close')">Cancelar</button>
      </template>
      <template v-else>
        <div class="plen-res">
          <div class="big">{{ res.ok ? '🤝 Acordo fechado!' : '😕 Sem acordo' }}</div>
          <p>{{ res.ok ? `${res.d.name}: vale por ${res.d.turns} rodadas.` : `A outra parte não fechou "${res.d.name}". Tente de novo mais tarde.` }}</p>
          <button class="primary" @click="emit('close')">Continuar</button>
        </div>
      </template>
    </div>
  </div>
</template>