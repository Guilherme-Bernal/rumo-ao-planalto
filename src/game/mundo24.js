// BLOCO 24: crises globais, embaixadores, viagens, sanções, espionagem e eleições em outros países.
export const CRISES = [
  { id: 'pandemia', icon: '🦠', name: 'Pandemia global', desc: 'Um novo vírus se espalha pelo mundo e chega às fronteiras.', ongoing: { soc: -0.7, eco: -0.6, pop: -0.3 }, left: 4 },
  { id: 'petroleo', icon: '🛢️', name: 'Choque do petróleo', desc: 'O preço do barril dispara e o diesel pesa em tudo.', ongoing: { eco: -0.7, cash: -0.3, pop: -0.3 }, left: 3 },
  { id: 'banco', icon: '🏦', name: 'Crise bancária internacional', desc: 'Um grande banco quebra lá fora e o crédito seca.', ongoing: { eco: -0.8, cash: -0.4 }, left: 3 },
  { id: 'clima', icon: '🌡️', name: 'Emergência climática', desc: 'Ondas de calor e quebras de safra no mundo inteiro.', ongoing: { eco: -0.4, soc: -0.4, img: -0.2 }, left: 4 },
]
export const CRISE_RESP = [
  { id: 'coordenar', icon: '🤝', name: 'Coordenar com os parceiros', desc: 'Resposta multilateral. Quanto melhor a relação com a ONU, mais chance.', cash: 0, base: 0.45, rel: 'onu', ok: { img: 2, pop: 1, eco: 1 }, bad: { img: -0.5 } },
  { id: 'proprio', icon: '🛠️', name: 'Plano nacional de emergência', desc: 'O Brasil banca a resposta sozinho.', cash: 3, base: 0.7, ok: { pop: 2, eco: 1.5, soc: 1 }, bad: { pop: -1 } },
  { id: 'aproveitar', icon: '🎯', name: 'Aproveitar a oportunidade', desc: 'Aposta alta para ganhar espaço. Pode dar muito certo ou muito errado.', cash: 1, base: 0.4, ok: { eco: 3, img: 2.5, pop: 1.5 }, bad: { eco: -1.5, img: -2, pop: -1.5 } },
]

export const EMB = [
  { id: 'carreira', icon: '🎩', name: 'Diplomata de carreira', desc: 'Discreto e competente. Relação +0,3 por rodada.', cash: 1, rel: 0.3, gafe: 0 },
  { id: 'politico', icon: '🎙️', name: 'Político amigo', desc: 'Abre portas, mas gafes são frequentes. Relação +0,6 por rodada, 8% de gafe.', cash: 1, rel: 0.6, gafe: 0.08 },
]

export const VIAGEM = { cash: 2, cooldown: 3 }
export const SANCAO = { left: 4, cash: 0 }
export const ESPIO_ACOES = [
  { id: 'rede', icon: '🕵️', name: 'Montar rede de agentes', desc: 'Rede de informantes +20 (decai com o tempo).', cash: 2 },
  { id: 'contra', icon: '🛡️', name: 'Reforçar a contraespionagem', desc: 'Contrainteligência +20. Ajuda a barrar vazamentos.', cash: 2 },
  { id: 'missao', icon: '🗝️', name: 'Missão secreta num país', desc: 'Requer rede 30+. Obtém um segredo. Se descoberta, é flagrante diplomático.', cash: 1 },
]
