// Partidos 100% fictícios. ideo: esquerda | centro | direita | independente
// perk: cash = caixa por rodada, cong = base política por rodada, camp = multiplicador de custo de campanha, vote = pontos extras na eleição
export const PARTIES = [
  { id: 'pdt', sigla: 'PAT', name: 'Partido da Ação Trabalhista', ideo: 'esquerda', color: '#ef4444', slogan: 'Quem trabalha, manda.', perks: { cong: 0.8, vote: 1 }, perkText: 'Base fiel nas urnas: +1 voto-ponto, +0,8 base por rodada' },
  { id: 'pcs', sigla: 'PCS', name: 'Partido Comunidade Solidária', ideo: 'esquerda', color: '#f97316', slogan: 'Ninguém fica para trás.', perks: { cash: 0.8, camp: 0.9 }, perkText: 'Militância de graça: campanha 10% mais barata, +0,8 caixa por rodada' },
  { id: 'mrb', sigla: 'MRB', name: 'Movimento Renovação Brasileira', ideo: 'centro', color: '#eab308', slogan: 'Do meio é que se governa.', perks: { cong: 1.4 }, perkText: 'Grande bancada: +1,4 base por rodada' },
  { id: 'uni', sigla: 'UNI', name: 'União Nacional Independente', ideo: 'centro', color: '#22c55e', slogan: 'Pontes, não muros.', perks: { cash: 1.4 }, perkText: 'Fundo partidário gordo: +1,4 caixa por rodada' },
  { id: 'pdl', sigla: 'PDL', name: 'Partido Democrático Liberal', ideo: 'direita', color: '#3b82f6', slogan: 'Menos Estado, mais Brasil.', perks: { cash: 0.8, vote: 1 }, perkText: 'Empresários doam: +0,8 caixa por rodada, +1 voto-ponto' },
  { id: 'pfb', sigla: 'PFB', name: 'Partido Família e Brasil', ideo: 'direita', color: '#6366f1', slogan: 'Deus, pátria e família.', perks: { camp: 0.9, cong: 0.6 }, perkText: 'Igrejas e redes: campanha 10% mais barata, +0,6 base por rodada' },
  { id: 'pvd', sigla: 'PVD', name: 'Partido Verde Democrático', ideo: 'independente', color: '#14b8a6', slogan: 'O futuro não espera.', perks: { vote: 1.5 }, perkText: 'Voto de opinião: +1,5 voto-ponto' },
  { id: 'plf', tag: 'rico', rich: true, hard: 0.1, sigla: 'PLF', name: 'Partido da Livre Fortuna', ideo: 'direita', color: '#ca8a04', slogan: 'Quem produz, merece.', perks: { cash: 2.2, camp: 0.8, img: -0.4 }, perkText: 'Clube de milionários: campanha 20% mais barata, +2,2 caixa/rodada, mas a imagem sofre. Aceita melhor quem tem caixa.' },
  { id: 'aep', tag: 'rico', rich: true, hard: 0.05, sigla: 'AEP', name: 'Aliança Empresarial Progresso', ideo: 'centro', color: '#0ea5e9', slogan: 'Crescer é o único caminho.', perks: { cash: 1.8, vote: 0.5 }, perkText: 'Doadores de peso: +1,8 caixa/rodada, +0,5 voto-ponto. Prefere candidatos com caixa.' },
  { id: 'pcn', tag: 'rico', rich: true, hard: 0.15, sigla: 'PCN', name: 'Partido Capital & Nação', ideo: 'direita', color: '#a16207', slogan: 'A nação é uma empresa.', perks: { cash: 2, cong: 0.5, img: -0.3 }, perkText: 'Bancada ligada ao mercado: +2 caixa/rodada, +0,5 base/rodada, mas arranha a imagem.' },
  { id: 'pml', tag: 'maluco', hard: 0.3, sigla: 'PML', name: 'Partido da Moto Livre', ideo: 'independente', color: '#f43f5e', slogan: 'Capacete é opcional.', perks: { pop: 0.6, img: -0.6 }, perkText: 'Motoqueiros em peso: +0,6 popularidade/rodada, mas −0,6 imagem. Raramente aceita alguém.' },
  { id: 'chu', tag: 'maluco', hard: 0.25, sigla: 'CHURRAS', name: 'Partido do Churrasco Nacional', ideo: 'independente', color: '#b45309', slogan: 'Carne para todos, sempre.', perks: { pop: 0.8, vote: 0.6, eco: -0.3 }, perkText: 'Fã-clube gigante: +0,8 popularidade/rodada, +0,6 voto-ponto, mas custa economia.' },
  { id: 'ppc', tag: 'maluco', hard: 0.3, sigla: 'PPC', name: 'Partido Pró-Capivara', ideo: 'independente', color: '#84cc16', slogan: 'Capivara na Constituição.', perks: { vote: 1.4, img: -0.5 }, perkText: 'Voto de simpatia: +1,4 voto-ponto, mas ninguém te leva a sério (−0,5 imagem/rodada).' },
  { id: 'pmr', tag: 'maluco', hard: 0.3, sigla: 'PMR', name: 'Partido Monarquista Restaurador', ideo: 'direita', color: '#7c3aed', slogan: 'Dom Pedro vive.', perks: { vote: 1.0, cong: 0.5, img: -0.4 }, perkText: 'Fiéis à coroa: +1 voto-ponto, +0,5 base/rodada, −0,4 imagem/rodada.' },
  { id: 'fun', tag: 'maluco', hard: 0.35, sigla: 'FUN', name: 'Frente Ufológica Nacional', ideo: 'independente', color: '#22d3ee', slogan: 'Eles já estão aqui.', perks: { vote: 2, img: -0.8 }, perkText: 'Culto devotado: +2 voto-ponto, mas a imprensa ri de você (−0,8 imagem/rodada).' },
  { id: 'psn', tag: 'maluco', hard: 0.25, sigla: 'PSN', name: 'Partido da Soneca Nacional', ideo: 'independente', color: '#64748b', slogan: 'Trabalhar menos, viver mais.', perks: { pop: 0.7, eco: -0.4 }, perkText: 'Pauta que cola: +0,7 popularidade/rodada, mas −0,4 economia/rodada.' },
  { id: 'pna', sigla: 'PNA', name: 'Partido Nacional dos Aposentados', ideo: 'centro', color: '#f59e0b', slogan: 'Quem construiu o país não se esquece.', perks: { cong: 1.0, vote: 0.4 }, perkText: 'Eleitor fiel e idoso: +1 base/rodada, +0,4 voto-ponto.' },
  { id: 'pjd', sigla: 'PJD', name: 'Partido da Juventude Digital', ideo: 'independente', color: '#ec4899', slogan: 'Futuro é agora.', perks: { vote: 1, pop: 0.4 }, hard: 0.05, perkText: 'Voz das redes: +1 voto-ponto, +0,4 popularidade/rodada.' },
  { id: 'nov', open: true, sigla: 'NOVO+', name: 'Novos Rumos', ideo: 'independente', color: '#a855f7', slogan: 'A nova política chegou.', perks: { cash: 0.5, vote: 0.5 }, perkText: 'Aceita qualquer um(a). Pequeno, mas fiel: +0,5 caixa por rodada, +0,5 voto-ponto' },
]

export const partyById = (id) => PARTIES.find((p) => p.id === id)

// Afinidade entre o perfil ideológico do jogador e o partido: 0 (oposto) .. 2 (igual)
export function affinity(playerIdeo, party) {
  if (playerIdeo === party.ideo) return 2
  const opposite = (playerIdeo === 'esquerda' && party.ideo === 'direita') || (playerIdeo === 'direita' && party.ideo === 'esquerda')
  return opposite ? 0 : 1
}

export const AFF_TEXT = ['Ideologia oposta', 'Afinidade média', 'Mesma linha']