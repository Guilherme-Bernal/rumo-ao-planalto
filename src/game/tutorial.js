import { reactive } from 'vue'
import { dicasReset } from './dicas'

// Tutorial curto: abre sozinho na primeira carreira e pode ser revisto nas configurações.
const KEY = 'rumo-tutorial-visto'
const seen = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
export const tut = reactive({ open: false, step: 0 })
export const TUT_STEPS = [
  { icon: '🏛️', title: 'Bem-vindo(a) ao Rumo ao Planalto', text: 'Você começa como vereador(a) e tenta chegar à presidência. A cada rodada acontece um evento: você decide, e a decisão mexe nos seus números.' },
  { icon: '📊', title: 'Seus números', text: 'No painel ficam Popularidade, Economia, Caixa, Imagem e outros. Se a popularidade ou o caixa zerarem, a carreira acaba. Passe o mouse (ou toque) em um número para ver o que ele significa.' },
  { icon: '⚡', title: 'Ações e agenda', text: 'Em cada rodada você tem até 2 ações. Use a aba Agenda para o que há de mais urgente e as outras abas (Governo, Política, Contatos) quando quiser ir fundo.' },
  { icon: '🤝', title: 'Pessoas importam', text: 'Aliados, família, imprensa e rivais lembram do que você fez. Promessas quebradas e escândalos voltam mais tarde.' },
  { icon: '🗳️', title: 'Eleição', text: 'No fim do mandato há eleição: campanha, pesquisas, debate e boatos. Chegue ao topo e deixe um legado. Dá para revisar este tutorial em ⚙️ Configurações.' },
]
export function tutOpen() {
  dicasReset()
  tut.step = 0
  tut.open = true
}
export function tutClose() {
  tut.open = false
  try {
    localStorage.setItem(KEY, '1')
  } catch {}
}
export const tutAutoOpen = () => {
  if (!seen()) tutOpen()
}
