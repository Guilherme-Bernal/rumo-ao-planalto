<script setup>
import { ref, computed } from 'vue'
import { game, electionSphere, setIdeas } from '../../game/engine'
import { SPHERES, BANDEIRAS, randomIdeologyName } from '../../game/ideas'

const emit = defineEmits(['go'])

const ideo = ref(game.ideas.name)
const flags = ref([...game.ideas.flags])
const msg = ref('')
const toggle = (id) => {
  const i = flags.value.indexOf(id)
  if (i >= 0) flags.value.splice(i, 1)
  else if (flags.value.length < 3) flags.value.push(id)
}
const changed = computed(() => flags.value.slice().sort().join() !== game.ideas.flags.slice().sort().join() || ideo.value.trim() !== game.ideas.name)
const save = () => {
  if (setIdeas(ideo.value, flags.value)) msg.value = 'Ideias salvas.'
}
const fl = (v) => (v < 30 ? 'var(--bad)' : v < 55 ? 'var(--warn)' : 'var(--good)')
const target = computed(() => electionSphere())
</script>

<template>
  <section class="card">
    <h2>🧭 Esferas de influência</h2>
    <p class="lead">Sua fama é diferente na cidade, no estado e no país. Cada ação e cada evento mexe mais numa dessas esferas.</p>
    <div v-for="s in SPHERES" :key="s.k" class="sph" :class="{ tgt: target === s.k }">
      <div class="row"><span>{{ s.icon }} <b>{{ s.name }}</b> <small class="muted">{{ s.desc }}</small></span><span>{{ Math.round(game.fame[s.k]) }}</span></div>
      <div class="bar"><i :style="{ width: game.fame[s.k] + '%', background: fl(game.fame[s.k]) }"></i></div>
      <small v-if="target === s.k" class="muted">⭐ Esta é a esfera que mais pesa na sua próxima eleição.</small>
    </div>

    <h2 style="margin-top: 18px">💡 Suas ideias</h2>
    <p class="lead">Escolha 3 bandeiras. Ações que melhoram o que você defende aumentam a <b>força das ideias</b>, que ajuda nas urnas.</p>
    <div class="sph">
      <div class="row"><span><b>Força das ideias</b></span><span>{{ Math.round(game.ideas.force) }}</span></div>
      <div class="bar"><i :style="{ width: game.ideas.force + '%', background: fl(game.ideas.force) }"></i></div>
    </div>
    <label class="lbl">Nome da sua ideologia
      <span class="inl"><input v-model="ideo" maxlength="40" /><button @click="ideo = randomIdeologyName()">🎲</button></span>
    </label>
    <div class="flags">
      <button v-for="b in BANDEIRAS" :key="b.id" class="opt" :class="{ sel: flags.includes(b.id) }" @click="toggle(b.id)">
        <b>{{ b.icon }} {{ b.name }}</b>
      </button>
    </div>
    <div class="row-end">
      <small class="muted" style="margin-right: auto">{{ flags.length }}/3 bandeiras{{ changed && flags.length === 3 && flags.slice().sort().join() !== game.ideas.flags.slice().sort().join() ? ' · trocar de bandeira custa -2 de imagem' : '' }}</small>
      <button class="primary" :disabled="flags.length !== 3 || !changed" @click="save">Salvar ideias</button>
    </div>
    <p v-if="msg" class="muted">{{ msg }}</p>

    <h2 style="margin-top: 18px">🎗️ Seu partido</h2>
    <div class="pc-new" style="margin-top: 6px">
      <div class="pc-newhead">
        <span class="pc-star">{{ game.myParty ? '🎗️' : '✨' }}</span>
        <div>
          <b>{{ game.myParty ? `${game.myParty.sigla} · ${game.myParty.name}` : 'Fundar o seu próprio partido' }}</b>
          <small>{{ game.myParty ? 'Veja as vantagens do seu partido na aba Partido.' : 'Crie nome, sigla, cor, slogan e foco na aba Partido.' }}</small>
        </div>
        <button class="primary" @click="emit('go', 'partido')">{{ game.myParty ? 'Ver partido' : 'Criar partido' }}</button>
      </div>
    </div>
  </section>
</template>