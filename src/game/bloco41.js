// BLOCO 41: ideias e partidos. Só vale para o partido que o jogador fundou (game.party === 'own').
// O líder define a doutrina, aceita ou expulsa filiados, convoca convenção e enfrenta cisões.
// Doutrinas, pessoas e partidos 100% fictícios. Segmentos citados são os do bloco 40.

export const DOUTRINAS = [
  { id: 'desenvolvimentista', icon: '🏗️', nome: 'Desenvolvimentismo', desc: 'O Estado puxa o crescimento com obras e crédito.', temas: ['economia', 'habitacao', 'trabalho'], gosta: ['trabalhadores', 'interior'], estranha: ['ambientalistas'] },
  { id: 'liberal', icon: '🦅', nome: 'Liberalismo popular', desc: 'Menos imposto e burocracia, mais empreendedor.', temas: ['economia', 'tributos'], gosta: ['classe_media', 'interior'], estranha: ['trabalhadores'] },
  { id: 'trabalhista', icon: '🛠️', nome: 'Trabalhismo cívico', desc: 'Direitos do trabalho e proteção social em primeiro lugar.', temas: ['trabalho', 'social', 'saude'], gosta: ['trabalhadores', 'periferia'], estranha: ['classe_media'] },
  { id: 'tradicao', icon: '🏛️', nome: 'Tradição e ordem', desc: 'Família, segurança e respeito às instituições.', temas: ['seguranca', 'etica', 'social'], gosta: ['fe', 'idosos'], estranha: ['jovens'] },
  { id: 'verde', icon: '🌿', nome: 'Tecnocracia verde', desc: 'Ciência, meio ambiente e decisões baseadas em dados.', temas: ['ambiente', 'ciencia', 'saudemental'], gosta: ['ambientalistas', 'jovens'], estranha: ['interior'] },
  { id: 'municipalista', icon: '🏘️', nome: 'Municipalismo', desc: 'Poder perto do povo: prefeitura, bairro e orçamento participativo.', temas: ['habitacao', 'educacao', 'cultura'], gosta: ['periferia', 'idosos'], estranha: [] },
]
export const DOUT_POR_ID = Object.fromEntries(DOUTRINAS.map((d) => [d.id, d]))

export const PERFIS_PART = [
  { id: 'idealista', icon: '🔥', nome: 'Idealista', desc: 'Acredita na doutrina. Leal, mas cobra coerência.', leal: 75, fx: { img: 0.4 } },
  { id: 'tecnico', icon: '🧮', nome: 'Técnico', desc: 'Traz estudo e gestão. Ajuda a economia.', leal: 60, fx: { eco: 0.5 } },
  { id: 'popular', icon: '📣', nome: 'Liderança popular', desc: 'Tem voz nos bairros e traz seguidores.', leal: 60, fx: { pop: 0.5 }, seg: 4 },
  { id: 'pragmatico', icon: '🤝', nome: 'Pragmático', desc: 'Costura acordos no Congresso.', leal: 50, fx: { cong: 0.6 } },
  { id: 'oportunista', icon: '🎲', nome: 'Oportunista', desc: 'Traz dinheiro, mas some se o partido enfraquecer.', leal: 35, fx: { cash: 2 } },
]
export const PERFIL_PART_POR_ID = Object.fromEntries(PERFIS_PART.map((p) => [p.id, p]))
export const MAX_FILIADOS = 12
export const CUSTO_DOUTRINA = 2

export const PEDIDOS_FILIACAO = [
  (n, p) => `${n} (${p.toLowerCase()}) pede para se filiar ao partido. Diz que concorda com a doutrina.`,
  (n, p) => `${n}, ${p.toLowerCase()}, bateu à porta do diretório querendo entrar.`,
  (n, p) => `Chegou a ficha de filiação de ${n}, que se apresenta como ${p.toLowerCase()}.`,
]

export const OPS_FILIACAO = [
  { id: 'aceitar', name: 'Aceitar', icon: '✅', desc: 'Entra no partido com o perfil mostrado.' },
  { id: 'recusar', name: 'Recusar', icon: '🚪', desc: 'Fica de fora. Pode virar crítico.' },
]
export const OPS_CISAO = [
  { id: 'conceder', name: 'Ceder espaço', icon: '🤝', desc: 'Dá voz ao grupo. Custa caixa e acalma.', fx: { cash: -2 }, leal: 30, seg: 0 },
  { id: 'expulsar', name: 'Expulsar o líder do grupo', icon: '🚫', desc: 'Corta o mal pela raiz e perde parte dos seguidores.', fx: { img: -0.5 }, expulsa: true, seg: -8 },
  { id: 'sair', name: 'Deixar sair', icon: '👋', desc: 'O grupo se desfilia e leva seguidores.', fx: { pop: -1, cong: -1 }, sai: true, seg: -20 },
]
export const PADRAO_CISAO = 'sair'
export const PADRAO_FILIACAO = 'recusar'
