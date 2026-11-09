<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { settings, DIFFICULTIES } from '../../game/settings'
import { unlock, sfx } from '../../game/audio'

const open = ref(false)
const toggle = () => {
  unlock()
  open.value = !open.value
}
const onKey = (e) => {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
const testSfx = () => sfx('good')
const FONTS = [
  { v: 1, l: 'A' },
  { v: 1.12, l: 'A+' },
  { v: 1.25, l: 'A++' },
]
</script>

<template>
  <button class="cfg-fab" :aria-expanded="open" aria-label="Configurações" title="Configurações" @click="toggle">⚙️</button>
  <div v-if="open" class="cfg panel" role="dialog" aria-label="Configurações">
    <div class="cfg-head"><b>⚙️ Configurações</b><button class="cfg-x" aria-label="Fechar" @click="open = false">✕</button></div>

    <div class="cfg-grp">Som</div>
    <label class="cfg-row"><span>🎵 Música</span><input v-model="settings.music" type="checkbox" /></label>
    <label class="cfg-row"><span>🔔 Efeitos</span><input v-model="settings.sfx" type="checkbox" @change="testSfx" /></label>
    <label class="cfg-row"><span>🔊 Volume</span><input v-model.number="settings.volume" type="range" min="0" max="1" step="0.05" /></label>

    <div class="cfg-grp">Tela</div>
    <label class="cfg-row">
      <span>🎮 Qualidade do 3D</span>
      <select v-model="settings.quality">
        <option value="auto">Automática</option>
        <option value="high">Alta</option>
        <option value="low">Leve (celular fraco)</option>
      </select>
    </label>
    <div class="cfg-row">
      <span>🔤 Tamanho do texto</span>
      <span class="cfg-seg"><button v-for="f in FONTS" :key="f.v" :class="{ on: settings.fontScale === f.v }" @click="settings.fontScale = f.v">{{ f.l }}</button></span>
    </div>
    <label class="cfg-row"><span>🌗 Alto contraste</span><input v-model="settings.contrast" type="checkbox" /></label>
    <label class="cfg-row"><span>🌀 Reduzir movimento</span><input v-model="settings.reduceMotion" type="checkbox" /></label>

    <div class="cfg-grp">Dificuldade <small class="muted">(vale para a próxima carreira)</small></div>
    <div class="cfg-seg cfg-dif">
      <button v-for="d in DIFFICULTIES" :key="d.id" :class="{ on: settings.difficulty === d.id }" :title="d.desc" @click="settings.difficulty = d.id">{{ d.name }}</button>
    </div>
    <small class="muted">{{ DIFFICULTIES.find((d) => d.id === settings.difficulty).desc }} O desafio do dia sempre usa Normal.</small>
  </div>
</template>

<style scoped>
.cfg-fab { position: fixed; left: 12px; bottom: 12px; z-index: 60; width: 44px; height: 44px; padding: 0; border-radius: 50%; text-align: center; font-size: 1.2rem; }
.cfg { position: fixed; left: 12px; bottom: 64px; z-index: 60; width: min(340px, calc(100vw - 24px)); max-height: calc(100vh - 90px); overflow: auto; padding: 12px 14px; }
.cfg-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.cfg-x { padding: 2px 9px; min-height: 0; }
.cfg-grp { margin: 12px 0 4px; font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); }
.cfg-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 0; padding: 7px 0; font-size: .92rem; color: var(--text); }
.cfg-row input[type='checkbox'] { width: 20px; height: 20px; accent-color: var(--accent); }
.cfg-row input[type='range'] { width: 130px; padding: 0; accent-color: var(--accent); }
.cfg-row select { width: auto; padding: 6px 8px; }
.cfg-seg { display: inline-flex; gap: 4px; }
.cfg-seg button { padding: 5px 10px; min-height: 0; text-align: center; }
.cfg-seg button.on { background: var(--accent); color: #1a1405; border-color: var(--accent); font-weight: 700; }
.cfg-dif { display: flex; }
.cfg-dif button { flex: 1; }
@media (max-width: 900px) { .cfg-fab { bottom: 10px; left: 10px; } .cfg { bottom: 62px; left: 10px; } }
</style>
