// BLOCO 38: vida pessoal 2. Visual do personagem durante o jogo, rotina (forma e estresse),
// humor no rosto e falas. Texto 100% fictício. cd = rodadas de espera entre usos. custo = pontos de caixa.

export const ESTILOS = [
  { id: 'institucional', icon: '🏛️', nome: 'Institucional', desc: 'Sóbrio, de gabinete. Rende imagem no Executivo e no plano federal.' },
  { id: 'popular', icon: '🤝', nome: 'Popular', desc: 'Roupa simples, de rua. Rende popularidade em cidades e bairros.' },
  { id: 'jovem', icon: '🎧', nome: 'Jovem', desc: 'Casual e conectado. Rende com cenário jovem e nas redes.' },
]

// quanto o estilo combina com o momento: devolve o efeito passivo por rodada
export function estiloFx(id, ctx) {
  const { exec, fed, mun, jovem } = ctx
  if (id === 'institucional') return exec || fed ? { img: 0.12 } : { pop: -0.05 }
  if (id === 'popular') return mun || !fed ? { pop: 0.12 } : { img: -0.05 }
  if (id === 'jovem') return jovem ? { pop: 0.12, img: 0.05 } : { pop: 0.04 }
  return {}
}

export const EU_ACOES = [
  { id: 'treinar', icon: '🏃', nome: 'Treinar', desc: 'Melhora a forma e alivia o estresse.', custo: 0, cd: 2, d: { forma: 8, estresse: -6 }, fx: {} },
  { id: 'descansar', icon: '🛌', nome: 'Descansar um dia', desc: 'Baixa bem o estresse e ajuda a família.', custo: 0, cd: 3, d: { estresse: -16, forma: 2 }, fam: 3, fx: {} },
  { id: 'paixao', icon: '🎯', nome: 'Praticar a sua paixão', desc: 'Um tempo para o que você gosta. Humaniza.', custo: 1, cd: 4, d: { estresse: -9 }, fx: { pop: 0.3, img: 0.4 } },
  { id: 'foto', icon: '📸', nome: 'Foto oficial nova', desc: 'Retrato novo para material e redes.', custo: 2, cd: 6, d: {}, fx: { img: 1 } },
  { id: 'selfie', icon: '🤳', nome: 'Selfies com eleitores', desc: 'Contato de rua. Pode dar certo ou virar meme.', custo: 0, cd: 3, d: { estresse: 3 }, risco: { p: 0.62, ok: { pop: 2 }, mal: { img: -1.2 } } },
]
export const EU_POR_ID = Object.fromEntries(EU_ACOES.map((a) => [a.id, a]))

export const VISUAL_CUSTO = 2
export const VISUAL_CD = 3

export const EU_PEND = {
  malestar: {
    icon: '🤒', titulo: 'Seu corpo pediu arrego', texto: 'Dormiu pouco, comeu mal e a pressão subiu. O médico mandou parar um pouco.', padrao: 'parar',
    ops: [
      { id: 'parar', name: 'Parar e se cuidar', icon: '🛌', desc: 'Perde um dia de agenda, o estresse cai.', fx: { img: -0.3 }, d: { estresse: -35, forma: 6 } },
      { id: 'seguir', name: 'Seguir no gás', icon: '⚡', desc: 'A agenda não para. O desgaste cobra depois.', fx: { pop: -1 }, d: { estresse: -8, forma: -6 } },
    ],
  },
}

// falas curtas do personagem ao clicar no rosto
export const FALAS_EU = {
  bom: ['Hoje está tudo nos eixos.', 'Dormi bem, a cabeça está leve.', 'Dá gosto de trabalhar assim.'],
  ruim: ['Preciso de um café. E de férias.', 'Estou no limite, não vou mentir.', 'Se aparecer mais uma reunião, eu viro lenda.'],
  normal: ['Vamos tocando.', 'Cada rodada, uma batalha.', 'O povo cobra e a gente entrega.', 'Respira fundo e segue.'],
  campanha: ['Tem eleição chegando, bora pra rua.', 'Voto se ganha na conversa.'],
}
