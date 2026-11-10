// BLOCO 26: família, biografia, laços com mentor e rival, sucessão jogável.
export const PERFIS_CONJUGE = [
  { id: 'discreto', icon: '🤫', name: 'discreto(a)', desc: 'Evita holofotes e protege a vida privada.' },
  { id: 'atuante', icon: '📣', name: 'atuante', desc: 'Gosta de campanha e de causas sociais.' },
  { id: 'empresario', icon: '💼', name: 'empresário(a)', desc: 'Tem negócios próprios, o que gera desconfiança.' },
]

export const FAM_ACOES = [
  { id: 'jantar', icon: '🍝', name: 'Jantar em família', desc: 'Harmonia +10.', cash: 0, h: 10 },
  { id: 'viagem', icon: '🏖️', name: 'Viagem de férias', desc: 'Harmonia +22. Custa 2 de Caixa e rende notícia.', cash: 2, h: 22, fx: { pop: -0.3 } },
  { id: 'campanha', icon: '📣', name: 'Cônjuge na agenda pública', desc: 'Popularidade +1, harmonia -5. Exige cônjuge atuante.', cash: 0, h: -5, fx: { pop: 1 }, req: 'atuante' },
]

// Eventos de família. Cada opção: fx, h (harmonia), cash.
export const FAM_EVENTOS = {
  noivado: {
    icon: '💍', titulo: (f) => `${f.nome} pede você em casamento`,
    texto: (f) => `${f.nome}, ${f.perfilTxt}, quer oficializar a união.`,
    ops: [
      { id: 'publico', icon: '🎉', name: 'Casar em cerimônia pública', desc: 'Custa 1 de Caixa.', cash: 1, fx: { pop: 1.5, img: 0.5 }, h: 12 },
      { id: 'discreto', icon: '🤍', name: 'Casar discretamente', desc: 'Só os mais próximos.', fx: { img: 0.3 }, h: 18 },
      { id: 'adiar', icon: '⏳', name: 'Adiar por causa da agenda', desc: 'O relacionamento esfria.', fx: {}, h: -10, naoCasa: true },
    ],
  },
  filho: {
    icon: '👶', titulo: () => 'A família vai crescer',
    texto: (f) => `${f.nome} espera um bebê.`,
    ops: [
      { id: 'anunciar', icon: '📣', name: 'Comemorar publicamente', desc: 'A notícia rende simpatia.', fx: { pop: 1.5, img: 0.5 }, h: 8 },
      { id: 'reservar', icon: '🔒', name: 'Reservar a família', desc: 'Sem exposição.', fx: {}, h: 12 },
    ],
  },
  reclama: {
    icon: '😔', titulo: (f) => `${f.nome} reclama da sua ausência`,
    texto: () => 'A agenda engoliu o fim de semana de novo.',
    ops: [
      { id: 'folga', icon: '🌅', name: 'Tirar uma folga', desc: 'Custa 1 de Caixa em agenda cancelada.', cash: 1, fx: {}, h: 20 },
      { id: 'prometer', icon: '🤞', name: 'Prometer mudar', desc: 'Ameniza por um tempo.', fx: {}, h: 6 },
      { id: 'seguir', icon: '📅', name: 'Seguir com a agenda', desc: 'O trabalho vem primeiro.', fx: { cong: 0.5 }, h: -10 },
    ],
  },
  polemica: {
    icon: '📸', titulo: (f) => `Polêmica envolve ${f.filho}`,
    texto: (f) => `${f.filho}, seu filho/filha, apareceu em fotos que viraram assunto nas redes.`,
    ops: [
      { id: 'proteger', icon: '🛡️', name: 'Assumir e proteger', desc: 'Defende a família, mesmo com desgaste.', fx: { img: -0.5, pop: 0.3 }, h: 8 },
      { id: 'imprensa', icon: '🗞️', name: 'Culpar a imprensa', desc: 'Joga a culpa fora.', fx: { img: -1.5, pop: 0.5 }, h: 0 },
      { id: 'calar', icon: '🤐', name: 'Não comentar', desc: 'Espera passar.', fx: { img: -0.8 }, h: -4 },
    ],
  },
  favor: {
    icon: '🤝', titulo: () => 'Um parente pede emprego público',
    texto: () => 'Um primo de segundo grau quer um cargo comissionado.',
    ops: [
      { id: 'nomear', icon: '📝', name: 'Nomear o parente', desc: 'Agrada a família, mas parece nepotismo.', fx: { img: -3, cong: 0.5 }, h: 6, sujo: true },
      { id: 'recusar', icon: '🚫', name: 'Recusar', desc: 'Imagem limpa, parentela brava.', fx: { img: 1 }, h: -6 },
    ],
  },
}

export const FIG_ACOES = {
  mentor: [
    { id: 'conselho', icon: '🧓', name: 'Pedir conselho', desc: 'Chance depende do laço. Se der certo, base e imagem sobem.', base: 0.45, k: 200, ok: { cong: 2, img: 1 }, bad: { cong: -0.5 }, lacoOk: 5, lacoBad: -4, hOk: 'Aconselhou você numa decisão difícil.', hBad: 'Achou que você só o procura quando precisa.' },
    { id: 'apoio', icon: '📢', name: 'Pedir apoio público', desc: 'Gasta capital do mentor: o laço cai, mas a popularidade sobe.', base: 0.3, k: 150, ok: { pop: 2.5, cong: 1 }, bad: { img: -1 }, lacoOk: -8, lacoBad: -10, hOk: 'Subiu ao palanque ao seu lado.', hBad: 'Negou o apoio em público e abriu uma ferida.' },
  ],
  rival: [
    { id: 'tregua', icon: '🕊️', name: 'Propor uma trégua', desc: 'Baixa a temperatura da rivalidade.', base: 0.4, k: 0, ok: { img: 1.5 }, bad: { img: -0.5 }, lacoOk: -15, lacoBad: 5, hOk: 'Aceitou uma trégua tensa.', hBad: 'Recusou a trégua e disse que era fraqueza.' },
    { id: 'provocar', icon: '🔥', name: 'Provocar em público', desc: 'Popularidade sobe, o rival se desgasta, a rivalidade esquenta.', base: 0.7, k: 0, ok: { pop: 1.2, img: -0.8 }, bad: { pop: -0.8, img: -1 }, lacoOk: 10, lacoBad: 10, hOk: 'Respondeu a uma provocação sua no jornal.', hBad: 'Revidou e levou a melhor na briga pública.', rivalMod: 1 },
  ],
  lider: [
    { id: 'fundo', icon: '💵', name: 'Pedir recursos ao partido', desc: 'Se o laço for bom, o partido ajuda no caixa.', base: 0.4, k: 200, ok: { cash: 3 }, bad: { cong: -1 }, lacoOk: -4, lacoBad: -3, hOk: 'Liberou verba para o seu mandato.', hBad: 'Disse que o caixa do partido está curto.' },
  ],
}

export const SUC_PERFIS = [
  { id: 'carismatico', icon: '🎤', name: 'Carismático(a)', desc: 'Empolga multidões, mas é imprevisível.', base: 50, vol: 8 },
  { id: 'tecnico', icon: '📊', name: 'Técnico(a)', desc: 'Pouco carisma, muita competência. Rende mais com o apoio da base.', base: 46, vol: 3 },
  { id: 'popular', icon: '❤️', name: 'Popular', desc: 'Herda a sua popularidade, para o bem e para o mal.', base: 48, vol: 5 },
]
export const SUC_ACOES = [
  { id: 'comicio', icon: '🎤', name: 'Grande comício', desc: 'Custa 1 de Caixa. Força +7.', cash: 1 },
  { id: 'debate', icon: '🗣️', name: 'Preparar para o debate', desc: 'Resultado depende do perfil. Pode render +10 ou -4.', cash: 0 },
  { id: 'agenda', icon: '📜', name: 'Usar o seu capital político', desc: 'Sua popularidade e base viram força para o sucessor.', cash: 0 },
  { id: 'atacar', icon: '⚔️', name: 'Atacar o adversário', desc: 'Força +6, mas 35% de chance de virar contra o sucessor (-8).', cash: 0 },
  { id: 'imagem', icon: '🎨', name: 'Reformular a imagem', desc: 'Custa 2 de Caixa. Força +5 e você pode mexer no visual.', cash: 2 },
]
