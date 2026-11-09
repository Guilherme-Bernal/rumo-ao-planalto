<script setup>
import { ref, computed } from 'vue'
import { game } from '../game/engine'

// Dicas da primeira jogada: cada uma aparece uma vez, na fase em que faz sentido.
const KEY = 'rumo-dicas'
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}
const seen = ref(load())
const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(seen.value))
  } catch {}
}

const TIPS = {
  event: { icon: '📰', title: 'Toda rodada começa com um evento', text: 'Leia a situação e escolha como reagir. As barras ao lado mostram seus números: se Popularidade ou Caixa zerarem, a carreira acaba. Opções com 🎲 são arriscadas.' },
  outcome: { icon: '🗞️', title: 'A imprensa reage', text: 'Cada escolha vira notícia e mexe nos números. Leia a repercussão e clique em Continuar.' },
  actions: { icon: '📅', title: 'Planeje o calendário', text: 'Você tem 2 ações por rodada. Clique numa ação e depois no mês do calendário em que quer fazê-la. Passe o mouse ou toque nos chips para ver o efeito. Quando acabar, clique em Avançar o tempo.' },
  contato: { icon: '📞', title: 'Alguém quer falar com você', text: 'Ligações, mensagens e abordagens aparecem como um cartão azul. Atender não gasta ação, mas as escolhas têm consequência. Na aba Contatos você vê a relação com cada pessoa.' },
  recap: { icon: '⏳', title: 'O tempo passou', text: 'Aqui você vê o que aconteceu mês a mês e como seus números mudaram. As abas Orçamento, Partido, Plano e Mapa mexem no longo prazo.' },
  runoff: { icon: '🔥', title: 'Segundo turno', text: 'Ninguém passou de 50% no primeiro turno. Agora é só você contra o rival. Alianças custam caixa mas dependem da sua base, e atacar rende muito mas é arriscado. Contatos próximos de você dão pontos extras.' },
  balance: { icon: '📊', title: 'Balanço do mandato', text: 'Aqui você vê o que mudou nos seus números, quais promessas cumpriu e a nota do mandato. Depois segue para a eleição.' },
  rumo: { icon: '🧭', title: 'Você escolhe o caminho', text: 'Pode disputar a reeleição ou subir de cargo. Cada cargo tem idade mínima, limite de reeleição e regras próprias. Saltos grandes deixam a eleição bem mais difícil.' },
  campaign: { icon: '🗳️', title: 'É dia de eleição', text: 'Seus números, o plano cumprido e a campanha decidem o voto. Gaste caixa numa campanha forte se puder, mas não zere o caixa.' },
}

const key = computed(() => {
  const p = game.phase
  let k = null
  if (p === 'actions') k = !seen.value.includes('actions') ? 'actions' : game.approach && !game.approach.done ? 'contato' : null
  else if (TIPS[p]) k = p
  return k && !seen.value.includes(k) ? k : null
})
const tip = computed(() => (key.value ? TIPS[key.value] : null))
function ok() {
  seen.value = [...seen.value, key.value]
  persist()
}
function skipAll() {
  seen.value = Object.keys(TIPS)
  persist()
}
</script>

<template>
  <div v-if="tip" class="tip">
    <span class="tip-ico">{{ tip.icon }}</span>
    <div class="tip-txt"><b>{{ tip.title }}</b><small>{{ tip.text }}</small></div>
    <div class="tip-btn">
      <button class="primary" @click="ok">Entendi</button>
      <button class="tip-skip" @click="skipAll">Pular dicas</button>
    </div>
  </div>
</template>