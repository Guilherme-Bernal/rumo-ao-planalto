import { reactive } from 'vue'

// Dicas de primeira vez: aparecem uma vez em cada aba e ficam guardadas no navegador.
const KEY = 'rumo-dicas-vistas'
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
export const dicas = reactive({ vistas: load() })

export const DICAS = {
  agenda: { icon: '📋', text: 'Aqui acontece a rodada: leia o evento, decida e marque até 2 ações nos meses. Depois avance o tempo.' },
  disputa: { icon: '📊', text: 'Mostra como você está contra os rivais. Pesquisa, debate e boatos mexem nesse ranking perto da eleição.' },
  redes: { icon: '📱', text: 'As redes reagem ao que você faz. Postar ajuda a popularidade, mas escândalos viram assunto rápido.' },
  ideias: { icon: '💡', text: 'Suas ideias e esferas de influência. Quem domina uma esfera vende melhor as propostas dela.' },
  contatos: { icon: '🤝', text: 'Aliados, família e figuras políticas. Cuide das relações: eles lembram do que você fez e voltam a cobrar.' },
  orcamento: { icon: '💰', text: 'Distribua a verba entre Saúde e educação, Segurança, Economia e Comunicação. Investir onde o número está baixo rende mais.' },
  partido: { icon: '🎗️', text: 'Seu partido dá apoio, fundo e bancada. Trocar de legenda custa imagem, mas pode abrir portas.' },
  plano: { icon: '📜', text: 'O plano de governo vira promessas. Cumprir dá votos no fim do mandato, quebrar tira.' },
  mundo: { icon: '🌍', text: 'Diplomacia, defesa e crises globais. Pontos de ação limitam quantas coisas você resolve por rodada.' },
  leis: { icon: '⚖️', text: 'Projetos e decretos. Precisam de base no Legislativo, e a Justiça pode barrar o que for exagerado.' },
  mapa: { icon: '🗺️', text: 'Seu estado e sua cidade no mapa. Cada região tem peso diferente na eleição.' },
}

export const dicaPendente = (tab) => (DICAS[tab] && !dicas.vistas.includes(tab) ? DICAS[tab] : null)
export function dicaVista(tab) {
  if (dicas.vistas.includes(tab)) return
  dicas.vistas.push(tab)
  try {
    localStorage.setItem(KEY, JSON.stringify(dicas.vistas))
  } catch {}
}
export function dicasReset() {
  dicas.vistas.splice(0)
  try {
    localStorage.removeItem(KEY)
  } catch {}
}
