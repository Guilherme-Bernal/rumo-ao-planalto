// Plano de governo: nome sorteável + até 3 bandeiras (promessas). Cumprir rende votos, descumprir cobra caro.
export const PLAN_NAMES_A = ['Brasil', 'Futuro', 'Novo Tempo', 'Pátria', 'Esperança', 'Virada', 'Compromisso', 'Reconstrução', 'Caminho', 'Aliança']
export const PLAN_NAMES_B = ['para Todos', 'de Verdade', 'em Primeiro Lugar', 'que Funciona', 'de Mãos Dadas', 'sem Desculpa', 'do Povo', 'Pra Valer', 'Já', 'em Movimento']

export const PROMISES = [
  { id: 'saude', icon: '🩺', name: 'Saúde que funciona', desc: 'Fila zero no posto de saúde.', stat: 'soc', goal: 58 },
  { id: 'escola', icon: '🎒', name: 'Escola em tempo integral', desc: 'Mais educação, menos evasão.', stat: 'soc', goal: 62 },
  { id: 'seguranca', icon: '🛡️', name: 'Segurança nas ruas', desc: 'Reduzir a violência no mandato.', stat: 'seg', goal: 58 },
  { id: 'emprego', icon: '💼', name: 'Emprego e renda', desc: 'Economia crescendo e vagas abertas.', stat: 'eco', goal: 58 },
  { id: 'contas', icon: '🧾', name: 'Contas em ordem', desc: 'Fechar o mandato com caixa saudável.', stat: 'cash', goal: 50 },
  { id: 'etica', icon: '🧼', name: 'Ética e transparência', desc: 'Governo de vidro, imagem limpa.', stat: 'img', goal: 66 },
  { id: 'dialogo', icon: '🤝', name: 'Governar com diálogo', desc: 'Maioria sólida no Legislativo.', stat: 'cong', goal: 55 },
  { id: 'povo', icon: '❤️', name: 'Governo popular', desc: 'Terminar o mandato com o povo ao seu lado.', stat: 'pop', goal: 62 },
  { id: 'fichalimpa', icon: '🕊️', name: 'Zero escândalos', desc: 'Nenhuma decisão que arranhe sua imagem.', special: 'dirty' },
]

export const MAX_PROMISES = 3

export function checkPromise(p, stats, dirtyInTerm) {
  if (p.special === 'dirty') return dirtyInTerm === 0
  return stats[p.stat] >= p.goal
}