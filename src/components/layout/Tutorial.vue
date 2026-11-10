<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { tut, TUT_STEPS, tutClose } from '../../game/tutorial'

const btn = ref(null)
const last = () => tut.step >= TUT_STEPS.length - 1
const next = () => (last() ? tutClose() : tut.step++)
const prev = () => tut.step > 0 && tut.step--
const onKey = (e) => {
  if (!tut.open) return
  if (e.key === 'Escape') tutClose()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
watch(() => [tut.open, tut.step], () => tut.open && nextTick(() => btn.value && btn.value.focus()))
</script>

<template>
  <div v-if="tut.open" class="tut-bg" role="dialog" aria-modal="true" aria-labelledby="tut-t">
    <div class="tut panel">
      <div class="tut-ico" aria-hidden="true">{{ TUT_STEPS[tut.step].icon }}</div>
      <h2 id="tut-t">{{ TUT_STEPS[tut.step].title }}</h2>
      <p class="lead">{{ TUT_STEPS[tut.step].text }}</p>
      <div class="tut-dots" aria-hidden="true"><i v-for="(s, i) in TUT_STEPS" :key="i" :class="{ on: i === tut.step }"></i></div>
      <div class="row-end">
        <button v-if="!last()" @click="tutClose">Pular</button>
        <button v-if="tut.step > 0" @click="prev">Voltar</button>
        <button ref="btn" class="primary" @click="next">{{ last() ? 'Começar!' : 'Próximo' }}</button>
      </div>
      <p class="legend" style="margin-top: 8px">Passo {{ tut.step + 1 }} de {{ TUT_STEPS.length }}</p>
    </div>
  </div>
</template>

<style scoped>
.tut-bg { position: fixed; inset: 0; z-index: 90; background: rgba(5, 8, 16, 0.72); display: grid; place-items: center; padding: 14px; }
.tut { width: min(440px, 100%); padding: 20px; text-align: center; }
.tut-ico { font-size: 2.6rem; }
.tut-dots { display: flex; gap: 6px; justify-content: center; margin: 12px 0; }
.tut-dots i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.25; }
.tut-dots i.on { opacity: 1; background: var(--accent); }
</style>
