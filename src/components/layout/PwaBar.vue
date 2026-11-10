<script setup>
import { ref } from 'vue'
import { pwa, pwaInstalar, pwaRecarregar, pwaDispensar } from '../../game/pwa'
const escondeInstalar = ref(false)
</script>

<template>
  <div v-if="pwa.atualizada" class="pwabar panel" role="status">
    <span>🆕 Nova versão do jogo carregada.</span>
    <button class="primary" @click="pwaRecarregar">Atualizar agora</button>
    <button aria-label="Dispensar" @click="pwaDispensar">✕</button>
  </div>
  <div v-else-if="pwa.canInstall && !pwa.instalado && !escondeInstalar" class="pwabar panel" role="region" aria-label="Instalar o app">
    <span>📲 Instale o jogo e jogue offline, em tela cheia.</span>
    <button class="primary" @click="pwaInstalar">Instalar</button>
    <button aria-label="Agora não" @click="escondeInstalar = true">✕</button>
  </div>
</template>

<style scoped>
.pwabar { position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); z-index: 70; display: flex; gap: 10px; align-items: center; padding: 8px 12px; width: max-content; max-width: calc(100vw - 24px); font-size: .92rem; }
.pwabar button { min-height: 0; padding: 5px 12px; }
@media (max-width: 900px) { .pwabar { bottom: 66px; flex-wrap: wrap; justify-content: center; } }
</style>
