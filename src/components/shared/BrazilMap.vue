<script setup>
import { ref, computed } from 'vue'
import brazil from '@svg-maps/brazil'

// colors: { mapId: '#hex' } pinta estados; info: { mapId: 'texto' } vai no balão; selected destaca um estado
const props = defineProps({ selected: String, home: String, colors: { type: Object, default: () => ({}) }, info: { type: Object, default: () => ({}) }, interactive: Boolean })
const emit = defineEmits(['select'])
const hov = ref(null)
const zoom = ref(1)
const setZoom = (v) => (zoom.value = Math.min(3, Math.max(1, Math.round(v * 10) / 10)))
const pos = ref({ x: 0, y: 0 })

const fill = (id) => props.colors[id] || '#34445f'
// o estado selecionado fica por último para a borda não ser coberta
const locs = computed(() => [...brazil.locations].sort((a, b) => (a.id === props.selected) - (b.id === props.selected)))
function move(e) {
  const r = e.currentTarget.getBoundingClientRect()
  pos.value = { x: Math.min(e.clientX - r.left + 14, r.width - 130), y: e.clientY - r.top + 14 }
}
// toque: mostra o balão do estado tocado e seleciona
function tap(l, e) {
  hov.value = l
  move({ clientX: e.clientX, clientY: e.clientY, currentTarget: e.currentTarget.closest('.mapwrap') })
  if (props.interactive) emit('select', l.id)
}
</script>

<template>
  <div class="mapwrap" @mousemove="move">
    <div class="mapzoom" aria-label="Zoom do mapa">
      <button type="button" aria-label="Aproximar" @click="setZoom(zoom + 0.5)">＋</button>
      <button type="button" aria-label="Afastar" @click="setZoom(zoom - 0.5)">－</button>
    </div>
    <div class="mapscroll">
    <svg :viewBox="brazil.viewBox" role="img" aria-label="Mapa do Brasil" :style="{ width: zoom * 100 + '%' }">
      <path
        v-for="l in locs"
        :key="l.id"
        :d="l.path"
        :fill="fill(l.id)"
        :class="{ sel: l.id === selected, home: l.id === home, click: interactive }"
        :tabindex="interactive ? 0 : -1"
        :role="interactive ? 'button' : undefined"
        :aria-label="l.name + (info[l.id] ? ': ' + info[l.id] : '')"
        @mouseenter="hov = l"
        @mouseleave="hov = null"
        @focus="hov = l"
        @blur="hov = null"
        @keydown.enter.prevent="interactive && emit('select', l.id)"
        @keydown.space.prevent="interactive && emit('select', l.id)"
        @click="tap(l, $event)"
      />
    </svg>
    </div>
    <div v-if="hov" class="maphov" :style="{ left: pos.x + 'px', top: pos.y + 'px' }">
      <b>{{ hov.name }}</b>
      <small v-if="info[hov.id]">{{ info[hov.id] }}</small>
    </div>
  </div>
</template>