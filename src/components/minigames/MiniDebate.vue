<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { game } from '../../game/engine'

const emit = defineEmits(['done'])

// Cada pergunta tem 3 respostas com notas (0 a 1). A ordem é embaralhada.
const POOL = [
  { ico: '🩺', q: 'A fila do posto de saúde dobrou nos últimos meses. O que o senhor faz?', a: [['Apresento um plano com metas, prazos e relatório público.', 1], ['Prometo zerar a fila em 30 dias.', 0.4], ['A culpa é da gestão anterior.', 0.1]] },
  { ico: '🛡️', q: 'A violência aumentou no bairro. Qual é a sua prioridade?', a: [['Mais policiamento e iluminação nas áreas críticas, com dados abertos.', 1], ['Mão dura e punição para todos.', 0.35], ['Isso é problema do governo federal.', 0.1]] },
  { ico: '📈', q: 'O desemprego está alto. Como gerar vagas?', a: [['Crédito ao pequeno negócio e qualificação, com meta de vagas.', 1], ['Atrair uma grande fábrica com isenção total.', 0.5], ['Esperar a economia melhorar sozinha.', 0.05]] },
  { ico: '🎓', q: 'As escolas estão com salas lotadas. E agora?', a: [['Reformar prédios e contratar professores com um cronograma claro.', 1], ['Distribuir tablets para todo mundo.', 0.4], ['Aumentar o número de alunos por sala.', 0.1]] },
  { ico: '⚖️', q: 'O adversário diz que o senhor prometeu e não cumpriu. Responda.', a: [['Mostro as promessas cumpridas, uma a uma, com números.', 1], ['Ataco o histórico do adversário.', 0.45], ['Digo que isso é mentira e mudo de assunto.', 0.1]] },
  { ico: '🏗️', q: 'Uma obra atrasou dois anos. O que aconteceu?', a: [['Assumo o atraso, explico a causa e apresento um novo prazo.', 1], ['Foi a chuva.', 0.2], ['A culpa é da empreiteira.', 0.35]] },
  { ico: '💰', q: 'O orçamento está apertado. Onde o senhor corta?', a: [['Em contratos e cargos comissionados, sem mexer em saúde e escola.', 1], ['Nos serviços públicos que menos dão voto.', 0.1], ['Aumentando impostos.', 0.3]] },
  { ico: '🌳', q: 'Moradores querem preservar uma área verde, empresários querem construir. De que lado o senhor está?', a: [['Proponho um projeto que preserve e gere empregos.', 1], ['Ficar com os moradores.', 0.55], ['Ficar com os empresários.', 0.4]] },
  { ico: '🚌', q: 'A tarifa do transporte vai subir. O senhor aceita?', a: [['Abro as planilhas e negocio um reajuste menor com contrapartidas.', 1], ['Congelo a tarifa para sempre.', 0.3], ['Aceito o reajuste, isso é técnico.', 0.2]] },
  { ico: '🧾', q: 'Há denúncia de corrupção no seu partido. O que diz?', a: [['Peço investigação, afasto os envolvidos e abro tudo.', 1], ['Digo que não conheço ninguém.', 0.1], ['Acuso a imprensa de perseguição.', 0.2]] },
]
const rival = game.rival
const qs = (() => {
  const idx = POOL.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 5)
  return idx.map((i) => ({ ...POOL[i], a: [...POOL[i].a].sort(() => Math.random() - 0.5) }))
})()
const n = ref(0)
const left = ref(10)
const feedback = ref('')
const scores = []
let timer = setInterval(() => {
  if (feedback.value) return
  left.value -= 0.1
  if (left.value <= 0) answer(null)
}, 100)
onBeforeUnmount(() => clearInterval(timer))

const crowd = computed(() => {
  const m = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0.5
  return m > 0.7 ? '😀👏😍🙌' : m > 0.4 ? '🙂😐🙂🤔' : '😒🙄😠🤨'
})
function answer(i) {
  if (feedback.value) return
  const a = i === null ? null : qs[n.value].a[i]
  const base = a ? a[1] : 0
  const speed = a ? Math.max(0, left.value / 10) * 0.1 : 0
  const sc = Math.min(1, base + (base >= 0.9 ? speed : 0))
  scores.push(sc)
  feedback.value = !a ? `⏱️ Tempo esgotado! ${rival} aproveita para falar.` : sc >= 0.9 ? '👏 A plateia reage bem!' : sc >= 0.4 ? '😐 Resposta morna. Dá para melhorar.' : '😬 A plateia vaia.'
  setTimeout(() => {
    feedback.value = ''
    if (n.value + 1 >= qs.length) {
      clearInterval(timer)
      emit('done', scores.reduce((a, b) => a + b, 0) / scores.length)
    } else {
      n.value++
      left.value = 10
    }
  }, 1200)
}
</script>

<template>
  <div class="minimodal">
    <div class="tv">
      <div class="tvbar"><span class="live">● AO VIVO</span><b>Debate: {{ game.rival }} x {{ game.name }}</b><span>{{ n + 1 }}/{{ qs.length }}</span></div>
      <div class="tvscreen">
        <div class="tvq"><span class="big-ico">{{ qs[n].ico }}</span>{{ qs[n].q }}</div>
        <div class="timer"><i :style="{ width: left * 10 + '%' }"></i></div>
        <div class="tva">
          <button v-for="(a, i) in qs[n].a" :key="i" :disabled="!!feedback" @click="answer(i)">{{ a[0] }}</button>
        </div>
        <div class="tvfb">{{ feedback || ' ' }}</div>
        <div class="tvcrowd">Plateia: {{ crowd }}</div>
      </div>
    </div>
  </div>
</template>