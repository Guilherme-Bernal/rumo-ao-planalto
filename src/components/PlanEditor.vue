<script setup>
import { computed } from 'vue'
import { country, randomPlanName, STATS } from '../game/engine'

// stats (opcional): números atuais para mostrar a dificuldade de cada promessa
const props = defineProps({ stats: { type: Object, default: null } })
const name = defineModel('name', { type: String, default: '' })
const ids = defineModel('ids', { type: Array, default: () => [] })
const c = country()

const chosen = computed(() => ids.value.map((id) => c.promises.find((p) => p.id === id)).filter(Boolean))
const full = computed(() => ids.value.length >= c.maxPromises)
const label = (p) => STATS.find((s) => s.k === p.stat)?.label
const cur = (p) => (props.stats && p.stat ? Math.round(props.stats[p.stat]) : null)
const gap = (p) => (p.special ? 6 : props.stats ? p.goal - props.stats[p.stat] : null)
const level = (p) => {
  const g = gap(p)
  if (g === null) return null
  return g <= 0 ? { t: 'Fácil', cls: 'up' } : g <= 8 ? { t: 'Viável', cls: 'warn' } : { t: 'Difícil', cls: 'down' }
}
const sorted = computed(() => [...c.promises])

function toggle(id) {
  if (ids.value.includes(id)) ids.value = ids.value.filter((x) => x !== id)
  else if (!full.value) ids.value = [...ids.value, id]
}
function suggest() {
  const ok = c.promises.filter((p) => !p.special).sort((a, b) => gap(a) - gap(b))
  ids.value = ok.slice(0, c.maxPromises).map((p) => p.id)
}
const fmt = (v) => String(v).replace('.', ',')
const best = computed(() => fmt(2 * ids.value.length))
const worst = computed(() => fmt(-2.5 * ids.value.length).replace('-', '−'))
const now = computed(() => fmt(1.5 * ids.value.length))
</script>

<template>
  <div class="pln">
    <label>Nome do seu plano de governo</label>
    <div class="namerow">
      <input v-model="name" maxlength="36" placeholder="Ex.: Brasil de Mãos Dadas" />
      <button type="button" title="Sortear nome" @click="name = randomPlanName()">🎲</button>
    </div>

    <div class="pln-top">
      <label style="margin: 0">Bandeiras do plano <b>{{ ids.length }}/{{ c.maxPromises }}</b></label>
      <button v-if="stats" type="button" class="pln-sug" @click="suggest">⚡ Sugerir as 3 mais fáceis</button>
    </div>

    <div class="pln-slots">
      <div v-for="i in c.maxPromises" :key="i" class="pln-slot" :class="{ on: chosen[i - 1] }">
        <template v-if="chosen[i - 1]">
          <span class="pln-ico">{{ chosen[i - 1].icon }}</span>
          <span class="pln-nm">{{ chosen[i - 1].name }}</span>
          <button type="button" class="pln-x" title="Remover" @click="toggle(chosen[i - 1].id)">✕</button>
        </template>
        <template v-else><span class="pln-empty">＋ Bandeira {{ i }}</span></template>
      </div>
    </div>

    <div class="pln-rules">
      <div><b class="up">+1,5 pop</b><small>por bandeira, na hora<template v-if="ids.length"> (+{{ now }} agora)</template></small></div>
      <div><b class="up">+2 votos</b><small>por promessa cumprida no fim do mandato</small></div>
      <div><b class="down">−2,5 votos</b><small>por promessa quebrada. Prometa só o que entrega.</small></div>
    </div>
    <p v-if="ids.length" class="pln-proj">Se cumprir tudo: <b class="up">+{{ best }}</b> na eleição · se quebrar tudo: <b class="down">{{ worst }}</b></p>

    <div class="pln-grid">
      <button v-for="p in sorted" :key="p.id" type="button" class="pln-card" :class="{ sel: ids.includes(p.id) }" :disabled="!ids.includes(p.id) && full" @click="toggle(p.id)">
        <span class="pln-check">{{ ids.includes(p.id) ? '✔' : '' }}</span>
        <span class="pln-big">{{ p.icon }}</span>
        <b>{{ p.name }}</b>
        <small>{{ p.desc }}</small>
        <template v-if="!p.special">
          <div class="pln-meter" :title="`Meta: ${label(p)} ${p.goal}`">
            <i v-if="cur(p) !== null" :style="{ width: Math.min(100, cur(p)) + '%' }"></i>
            <u :style="{ left: p.goal + '%' }"></u>
          </div>
          <span class="pln-meta">{{ label(p) }}: <template v-if="cur(p) !== null">hoje {{ cur(p) }} → </template>meta {{ p.goal }}</span>
        </template>
        <span v-else class="pln-meta">Meta: nenhuma decisão com −6 de imagem</span>
        <span v-if="level(p)" class="chip pln-lv" :class="level(p).cls">{{ level(p).t }}</span>
      </button>
    </div>
  </div>
</template>