<script setup>
import { ref, computed } from 'vue'
import { game, findAction, doAction } from '../../game/engine'

const props = defineProps({ id: { type: String, required: true }, month: { type: Number, default: 0 } })
const emit = defineEmits(['close'])
const a = findAction(props.id)
const odds = computed(() => (a && a.odds ? Math.round(a.odds(game) * 100) : 0))
const res = ref(null)
const confirm = () => {
  const r = doAction(props.id, props.month)
  // se o jogo terminou, o App troca de tela sozinho
  res.value = r || { ok: false, text: 'Nada aconteceu.' }
}
</script>

<template>
  <div class="minimodal">
    <div class="plen gab">
      <template v-if="!res">
        <h3>👑 {{ a.name }}</h3>
        <p class="lead">{{ a.desc }}</p>
        <div class="sumbox">
          <b>Chance de dar certo: {{ odds }}%</b>
          <div class="bar"><i :style="{ width: odds + '%', background: odds >= 60 ? 'var(--good)' : odds >= 35 ? 'var(--warn)' : 'var(--bad)' }"></i></div>
          <small class="muted">Pesa: seu poder concentrado ({{ game.power }}), segurança, popularidade e base. Se falhar, a crise é grande. É uma decisão sem volta.</small>
        </div>
        <div class="plen-act">
          <button @click="emit('close')">Voltar atrás</button>
          <button class="primary" @click="confirm">Seguir em frente</button>
        </div>
      </template>
      <template v-else>
        <div class="plen-res">
          <div class="big">{{ res.ok ? '👑 Deu certo' : '💥 Deu errado' }}</div>
          <p>{{ res.text }}</p>
          <button class="primary" @click="emit('close')">Continuar</button>
        </div>
      </template>
    </div>
  </div>
</template>