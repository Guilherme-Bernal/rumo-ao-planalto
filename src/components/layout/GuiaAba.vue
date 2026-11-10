<script setup>
import { computed } from 'vue'
import { game, acaoPendente, inquerito, cstEstado } from '../../game/engine'
import { GUIAS, FASES } from '../../game/avancos'

const props = defineProps({ tab: { type: String, default: 'agenda' } })
const emit = defineEmits(['go'])
const g = computed(() => GUIAS[props.tab])
const fase = computed(() => (props.tab !== 'agenda' && game.phase !== 'actions' && FASES[game.phase] ? FASES[game.phase] : ''))
const tribunal = computed(() => !!(acaoPendente() || inquerito()))
const excecao = computed(() => cstEstado())
</script>

<template>
  <div class="guia">
    <p v-if="tribunal" class="aviso bad">
      ⚖️ Há um caso no tribunal envolvendo você. Para se defender, vá em <b>Governo › Leis</b>, na seção do tribunal.
      <button type="button" class="mini" @click="emit('go', 'leis')">Ir para Leis</button>
    </p>
    <p v-if="excecao" class="aviso warn">🚨 Medida de exceção em vigor: não se vota PEC até ela terminar.</p>
    <p v-if="fase" class="aviso">⏳ Agora é a fase de <b>{{ fase }}</b>. Os botões de ação desta aba ficam apagados até a fase de ações, na aba Agenda.</p>
    <details v-if="g" class="guiabox">
      <summary>📖 Guia rápido: {{ g.t }}</summary>
      <p>{{ g.txt }}</p>
    </details>
  </div>
</template>

<style scoped>
.guia { margin: 6px 0 10px; }
.aviso { margin: 6px 0; padding: 8px 10px; border-radius: 10px; font-size: 0.88rem; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.14); }
.aviso.bad { border-color: var(--bad); }
.aviso.warn { border-color: var(--warn); }
.mini { margin-left: 8px; padding: 3px 8px; font-size: 0.8rem; }
.guiabox { font-size: 0.86rem; opacity: 0.92; }
.guiabox summary { cursor: pointer; }
.guiabox p { margin: 6px 0 0; }
</style>
