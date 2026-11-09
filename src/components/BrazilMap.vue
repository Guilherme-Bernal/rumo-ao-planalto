<script setup>
import { ref, computed } from 'vue'
import brazil from '@svg-maps/brazil'

// colors: { mapId: '#hex' } pinta estados; info: { mapId: 'texto' } vai no balão; selected destaca um estado
const props = defineProps({ selected: String, home: String, colors: { type: Object, default: () => ({}) }, info: { type: Object, default: () => ({}) }, interactive: Boolean })
const emit = defineEmits(['select'])
const hov = ref(null)
const pos = ref({ x: 0, y: 0 })

const fill = (id) => props.colors[id] || '#34445f'
// o estado selecionado fica por último para a borda não ser coberta
const locs = computed(() => [...brazil.locations].sort((a, b) => (a.id === props.selected) - (b.id === props.selected)))
function move(e) {
  const r = e.currentTarget.getBoundingClientRect()
  pos.value = { x: Math.min(e.clientX - r.left + 14, r.width - 130), y: e.clientY - r.top + 14 }
}
</script>

<template>
  <div class="mapwrap" @mousemove="move">
    <svg :viewBox="brazil.viewBox" role="img" aria-label="Mapa do Brasil">
      <path
        v-for="l in locs"
        :key="l.id"
        :d="l.path"
        :fill="fill(l.id)"
        :class="{ sel: l.id === selected, home: l.id === home, click: interactive }"
        @mouseenter="hov = l"
        @mouseleave="hov = null"
        @click="interactive && emit('select', l.id)"
      />
    </svg>
    <div v-if="hov" class="maphov" :style="{ left: pos.x + 'px', top: pos.y + 'px' }">
      <b>{{ hov.name }}</b>
      <small v-if="info[hov.id]">{{ info[hov.id] }}</small>
    </div>
  </div>
</template>