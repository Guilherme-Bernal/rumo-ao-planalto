<script setup>
import { ref } from 'vue'
const PIX = '00020101021126580014br.gov.bcb.pix0136125d2f95-fdca-4fbf-bec6-a5810d302aa75204000053039865802BR5924GUILHERME SAVASSA BERNAL6009SAO PAULO62070503***63042004'
const KOFI = 'https://ko-fi.com/netnonebernal'
const open = ref(false)
const copied = ref(false)
const copy = async () => {
  try { await navigator.clipboard.writeText(PIX); copied.value = true; setTimeout(() => (copied.value = false), 2000) } catch (e) {}
}
</script>

<template>
  <button class="apoie-fab" @click="open = !open">☕ Apoie</button>
  <div v-if="open" class="apoie panel">
    <b>Curtiu o jogo?</b>
    <p class="muted">Rumo ao Planalto é gratuito e de código aberto. Se quiser ajudar a mantê-lo e a criar novidades, qualquer valor ajuda.</p>
    <p v-if="KOFI"><a :href="KOFI" target="_blank" rel="noopener"><button type="button">☕ Apoiar no Ko-fi</button></a></p>
    <div v-if="PIX" class="apoie-row">
      <button @click="copy">{{ copied ? 'Copiado! Cole no app do banco' : '📋 Copiar Pix (copia e cola)' }}</button>
      <small class="muted">No app do banco: Pix → Pagar → Pix copia e cola.</small>
    </div>
    <button @click="open = false">Fechar</button>
  </div>
</template>

<style scoped>
.apoie-fab { position: fixed; left: 64px; bottom: 12px; z-index: 50; height: 44px; padding: 0 14px; border-radius: 22px; }
@media (max-width: 900px) { .apoie-fab { left: auto; right: 10px; } }
.apoie { position: fixed; left: 64px; bottom: 64px; z-index: 50; width: min(340px, calc(100vw - 24px)); padding: 12px; }
.apoie-row { display: flex; flex-direction: column; gap: 6px; margin: 8px 0; }
@media (max-width: 900px) { .apoie { left: auto; right: 10px; } }
</style>