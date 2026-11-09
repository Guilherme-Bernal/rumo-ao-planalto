<script setup>
import { computed } from 'vue'
import { game, findAction, monthsPer, roundStart } from '../../game/engine'
import { monthName, holidayOf, ACTION_ICON, START_YEAR } from '../../game/social'

const props = defineProps({ armed: { type: String, default: null } })
const emit = defineEmits(['place'])

const cells = computed(() => {
  const mp = monthsPer()
  const start = roundStart()
  return Array.from({ length: mp }, (_, i) => {
    const abs = start + i
    const s = game.sched.find((x) => x.m === i)
    const a = s && findAction(s.id)
    return {
      i,
      name: monthName(abs),
      year: START_YEAR + Math.floor(abs / 12),
      jan: abs % 12 === 0,
      holiday: holidayOf(abs),
      event: i === game.eventMonth,
      big: game.bigOffer && game.bigOffer.m === i ? game.bigOffer : null,
      action: a,
      free: !a,
    }
  })
})
const title = computed(() => `${cells.value[0].name}/${cells.value[0].year} a ${cells.value.at(-1).name}/${cells.value.at(-1).year}`)
const click = (c) => {
  if (props.armed && c.free) emit('place', c.i)
}
</script>

<template>
  <div class="cal">
    <div class="cal-head">
      <b>📅 {{ title }}</b>
      <span class="muted">Rodada {{ game.turn + 1 }} · {{ cells.length }} meses</span>
    </div>
    <div class="cal-grid" :class="{ arming: armed }">
      <button
        v-for="c in cells"
        :key="c.i"
        class="cell"
        :class="{ free: c.free, has: !!c.action, ev: c.event, pick: armed && c.free }"
        :disabled="!armed || !c.free"
        @click="click(c)"
      >
        <small class="mn">{{ c.name }}<template v-if="c.jan || c.i === 0"> '{{ String(c.year).slice(2) }}</template></small>
        <span class="ico">
          <template v-if="c.action">{{ ACTION_ICON[c.action.id] }}</template>
          <template v-else-if="armed">＋</template>
          <template v-else>·</template>
        </span>
        <small v-if="c.action" class="lb">{{ c.action.name }}</small>
        <small v-else-if="c.big" class="hol">{{ c.big.name }}</small>
        <small v-else-if="c.holiday" class="hol">{{ c.holiday }}</small>
        <span v-if="c.event" class="evtag" title="Um evento acontece neste mês">📰</span>
        <span v-if="c.big" class="bigtag" :title="c.big.name">{{ c.big.icon }}</span>
      </button>
    </div>
    <p v-if="armed" class="muted" style="margin-top: 6px">Escolha o mês em que quer fazer esta ação.</p>
  </div>
</template>