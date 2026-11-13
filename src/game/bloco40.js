// BLOCO 40: população e movimentos. Segmentos fictícios da população, cada um com apoio, pauta e mobilização.
// Leis por tema agradam quem quer aquele tema e irritam quem é contra. Promessas feitas a um segmento viram
// cobrança se não forem cumpridas. Segmento contrariado e mobilizado vai à rua. Texto 100% fictício.

export const SEGMENTOS = [
  { id: 'jovens', icon: '🎒', nome: 'Jovens das cidades', quer: ['trabalho', 'educacao', 'cultura'], contra: ['tributos'], fala: 'Jovens que estudam e buscam o primeiro emprego' },
  { id: 'trabalhadores', icon: '👷', nome: 'Trabalhadores e sindicatos', quer: ['trabalho', 'economia', 'social'], contra: ['tributos'], fala: 'Quem vive de salário e depende do emprego formal' },
  { id: 'idosos', icon: '🧓', nome: 'Aposentados e idosos', quer: ['saude', 'seguranca'], contra: ['economia'], fala: 'Quem vive de aposentadoria e teme perder renda' },
  { id: 'periferia', icon: '🏘️', nome: 'Periferias', quer: ['habitacao', 'social', 'seguranca'], contra: ['ambiente'], fala: 'Bairros distantes que cobram transporte, moradia e segurança' },
  { id: 'classe_media', icon: '🏠', nome: 'Classe média', quer: ['tributos', 'seguranca', 'etica'], contra: ['social'], fala: 'Quem paga imposto e quer serviço de qualidade' },
  { id: 'interior', icon: '🚜', nome: 'Gente do interior', quer: ['economia', 'habitacao'], contra: ['ambiente'], fala: 'Pequenas cidades e produtores longe da capital' },
  { id: 'fe', icon: '⛪', nome: 'Comunidades de fé', quer: ['social', 'saudemental', 'seguranca'], contra: ['cultura'], fala: 'Igrejas, templos e grupos de convivência' },
  { id: 'ambientalistas', icon: '🌱', nome: 'Ambientalistas e ciência', quer: ['ambiente', 'ciencia', 'saudemental'], contra: ['economia'], fala: 'Quem cobra proteção da natureza e investimento em pesquisa' },
]
export const SEG_POR_ID = Object.fromEntries(SEGMENTOS.map((s) => [s.id, s]))

export const PROTESTOS = [
  (n) => `${n} foram às ruas com faixas e carro de som cobrando resposta do governo.`,
  (n) => `Uma grande manifestação de ${n.toLowerCase()} toma a avenida principal e domina o noticiário.`,
  (n) => `${n} ocuparam a frente do prédio do governo e prometem ficar até serem ouvidos.`,
]

// respostas ao protesto
export function opsProtesto(seg) {
  return [
    { id: 'receber', name: 'Receber a pauta', icon: '🤝', desc: 'Custa caixa, acalma o segmento.', fx: { cash: -2, pop: 0.5 }, apoio: 14, mob: -45 },
    { id: 'prometer', name: 'Prometer uma lei', icon: '📝', desc: 'Acalma agora. Se não cumprir em 8 rodadas, a cobrança vem em dobro.', fx: { pop: 0.3 }, apoio: 9, mob: -30, prom: true },
    { id: 'reprimir', name: 'Reprimir o ato', icon: '🛑', desc: 'O ato acaba rápido. A imagem e o segmento pagam.', fx: { seg: 1, img: -1.5, pop: -1 }, apoio: -12, mob: -50 },
    { id: 'ignorar', name: 'Ignorar', icon: '🙈', desc: 'Sem custo. O desgaste cresce.', fx: { pop: -0.8 }, apoio: -6, mob: -10 },
  ]
}
export const PADRAO_PROTESTO = 'ignorar'

export const PAUTA_ACOES = [
  { id: 'ouvir', icon: '👂', nome: 'Ouvir', desc: 'Conversa sem compromisso. Apoio +4.', cd: 3, apoio: 4, fx: {} },
  { id: 'abracar', icon: '📣', nome: 'Abraçar a pauta', desc: 'Apoio +12, mas quem é contra a pauta se irrita (-6). Imagem -0.3.', cd: 5, apoio: 12, fx: { img: -0.3 }, irrita: 6 },
]
