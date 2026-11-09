<script setup>
import { ref } from 'vue'
import { game, STUDIES, STUDY_MAX, studyNeed, knowLvl, study } from '../../game/engine'

const props = defineProps({ month: { type: Number, default: 0 } })
const emit = defineEmits(['close'])
const res = ref(null)
const picked = ref(null)
const go = (s) => {
  picked.value = s
  res.value = study(s.id, props.month)
}
</script>

<template>
  <div class="minimodal">
    <div class="plen gab">
      <h3>📚 Estudar e se preparar</h3>
      <template v-if="!res">
        <p class="muted">Escolha uma área. Cada sessão custa 1 ação e um pouco de caixa. Ao completar as sessões do nível, você ganha um bônus permanente. Máximo: nível {{ STUDY_MAX }}.</p>
        <div class="gab-list">
          <button v-for="s in STUDIES" :key="s.id" class="gab-item" :disabled="knowLvl(s.id) >= STUDY_MAX || game.stats.cash < 1" @click="go(s)">
            <b>{{ s.icon }} {{ s.name }}</b>
            <small>{{ s.up }}</small>
            <span class="gab-lv"><i v-for="n in STUDY_MAX" :key="n" :class="{ on: n <= knowLvl(s.id) }"></i></span>
            <small class="muted">{{ knowLvl(s.id) >= STUDY_MAX ? 'Nível máximo' : `Nível ${knowLvl(s.id)} · sessão ${(game.xp[s.id] || 0) + 1} de ${studyNeed(knowLvl(s.id))}` }}</small>
          </button>
        </div>
        <button style="margin-top: 10px" @click="emit('close')">Cancelar</button>
      </template>
      <template v-else>
        <p class="lead">{{ res.line }}</p>
        <div class="plen-res">
          <div class="big">{{ picked.icon }} {{ res.up ? `Nível ${res.lvl}!` : `Sessão ${res.xp} de ${res.need}` }}</div>
          <p>{{ res.up ? `Novo bônus: ${picked.up}` : 'Mais um passo para o próximo nível.' }}</p>
          <button class="primary" @click="emit('close')">Continuar</button>
        </div>
      </template>
    </div>
  </div>
</template>