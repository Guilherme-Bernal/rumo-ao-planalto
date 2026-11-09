<script setup>
import { ref } from 'vue'
import { game, devSet, devGod, devOffice, devEndTerm, devEvent, devElection, devTeam, devWorld, devEvents, devOffices, continueBalance, ageNow } from '../game/engine'

const open = ref(false)
const office = ref('presidente')
const ev = ref('')
const evs = devEvents()
const offs = devOffices()
const STATS = [
  ['pop', '❤️ Popularidade'],
  ['cong', '🏛️ Base política'],
  ['eco', '📈 Economia'],
  ['cash', '💰 Caixa'],
  ['soc', '🩺 Serviços'],
  ['seg', '🛡️ Segurança'],
  ['img', '⚖️ Imagem'],
]
const age = ref(ageNow() || 30)
const canGo = () => ['event', 'outcome', 'actions', 'recap', 'rumo', 'plan', 'balance'].includes(game.phase)
const inPlay = () => ['event', 'outcome', 'actions', 'recap'].includes(game.phase)
const toRumo = () => {
  if (inPlay()) devEndTerm()
  if (game.phase === 'balance') continueBalance()
}
</script>

<template>
  <button class="sbx-fab" title="Modo sandbox (testes)" @click="open = !open">🧪</button>
  <div v-if="open" class="sbx panel">
    <div class="sbx-head">
      <b>🧪 Modo sandbox</b>
      <button @click="open = false">Fechar</button>
    </div>
    <p class="muted">Ferramentas para testar. Fase atual: <b>{{ game.phase }}</b> · cargo: <b>{{ game.office }}</b></p>

    <label class="sbx-row"><input type="checkbox" :checked="!!game.god" @change="devGod" /> Modo deus (não perde por popularidade, impeachment ou caixa)</label>

    <h4>Atributos</h4>
    <div v-for="s in STATS" :key="s[0]" class="sbx-row">
      <span style="width: 120px">{{ s[1] }}</span>
      <input type="range" min="0" max="100" :value="game.stats[s[0]]" @input="devSet(s[0], $event.target.value)" />
      <span style="width: 28px; text-align: right">{{ Math.round(game.stats[s[0]]) }}</span>
    </div>
    <div class="sbx-row">
      <span style="width: 120px">🎂 Idade</span>
      <input v-model.number="age" type="number" min="18" max="90" style="width: 70px" />
      <button @click="devSet('age', age)">Aplicar</button>
    </div>

    <h4>Ir para um cargo</h4>
    <div class="sbx-row">
      <select v-model="office">
        <option v-for="o in offs" :key="o.id" :value="o.id">{{ o.name }}</option>
      </select>
      <button :disabled="!canGo()" @click="devOffice(office)">Ir agora</button>
    </div>

    <h4>Pular etapas</h4>
    <div class="sbx-btns">
      <button :disabled="!inPlay()" @click="devEndTerm">Fim do mandato</button>
      <button :disabled="!inPlay() && game.phase !== 'balance'" @click="toRumo">Ir para a escolha de caminho</button>
      <button :disabled="!['campaign', 'runoff'].includes(game.phase)" @click="devElection(true)">Ganhar a eleição</button>
      <button :disabled="!['campaign', 'runoff'].includes(game.phase)" @click="devElection(false)">Perder a eleição</button>
    </div>

    <h4>Disparar evento</h4>
    <div class="sbx-row">
      <select v-model="ev" style="max-width: 230px">
        <option value="">Escolha...</option>
        <option v-for="e in evs" :key="e.id" :value="e.id">{{ e.id }}</option>
      </select>
      <button :disabled="!ev || !canGo()" @click="devEvent(ev)">Disparar</button>
    </div>

    <h4>Equipe e política</h4>
    <div class="sbx-btns">
      <button @click="devTeam('conspire')">Vice conspirando</button>
      <button @click="devTeam('hot')">Escândalo na equipe</button>
      <button @click="devTeam('leave')">Suplente assume</button>
      <button @click="devTeam('angry')">Coalizão irritada</button>
    </div>

    <h4>Mundo</h4>
    <div class="sbx-btns">
      <button @click="devWorld('war')">Começar uma guerra</button>
      <button @click="devWorld('fa')">Quartéis em crise</button>
      <button @click="devWorld('nuc')">Nuclear a 75%</button>
      <button @click="devWorld('rel')">Relações a 85</button>
      <button @click="devWorld('pts')">Pontos de agenda cheios</button>
    </div>
  </div>
</template>

<style scoped>
.sbx-fab {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 50;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 20px;
  padding: 0;
}
.sbx {
  position: fixed;
  left: 12px;
  bottom: 64px;
  z-index: 50;
  width: min(380px, calc(100vw - 24px));
  max-height: 75vh;
  overflow: auto;
  padding: 12px;
}
.sbx-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sbx h4 {
  margin: 12px 0 4px;
}
.sbx-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
}
.sbx-row input[type='range'] {
  flex: 1;
}
.sbx-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>