// Cargos do Brasil: cada um tem as regras da lei (idade mínima, reeleição, vice, suplentes e equipe).
// tier: bloco de conteúdo do jogo (0 municipal, 1 legislativo estadual e federal, 2 governo estadual, 3 presidência)
// rank: peso na carreira. Pular degraus deixa a eleição mais difícil.
export const OFFICES = {
  vereador: {
    id: 'vereador', icon: '🏛️', tier: 0, rank: 0, kind: 'leg', name: 'Vereador(a)', place: 'Câmara Municipal', turns: 4, years: 4, minAge: 18, reel: null,
    money: 30e3, sphere: 'mun', rival: 53, runoff: false, vice: false, supl: 1, team: 'assessores',
    law: 'Mandato de 4 anos, sem limite de reeleições. Idade mínima de 18 anos. O suplente é o próximo mais votado da lista do partido.',
  },
  prefeito: {
    id: 'prefeito', icon: '🏙️', tier: 0, rank: 1, kind: 'exec', name: 'Prefeito(a)', place: 'Prefeitura', turns: 5, years: 4, minAge: 21, reel: 1,
    money: 3e6, sphere: 'mun', rival: 55, runoff: 'cidade', vice: true, supl: 0, team: 'secretarias_mun',
    law: 'Mandato de 4 anos e uma reeleição seguida. Idade mínima de 21 anos. Eleito em chapa com vice. Nomeia secretários municipais. Para disputar outro cargo precisa renunciar 6 meses antes.',
  },
  dep_estadual: {
    id: 'dep_estadual', icon: '🏢', tier: 1, rank: 1, kind: 'leg', name: 'Deputado(a) Estadual', place: 'Assembleia Legislativa', turns: 4, years: 4, minAge: 21, reel: null,
    money: 150e3, sphere: 'est', rival: 55, runoff: false, vice: false, supl: 1, team: 'assessores',
    law: 'Mandato de 4 anos, sem limite de reeleições. Idade mínima de 21 anos. Eleito pelo voto proporcional e com suplentes.',
  },
  dep_federal: {
    id: 'dep_federal', icon: '🏛️', tier: 1, rank: 2, kind: 'leg', name: 'Deputado(a) Federal', place: 'Câmara dos Deputados', turns: 4, years: 4, minAge: 21, reel: null,
    money: 400e3, sphere: 'est', rival: 56, runoff: false, vice: false, supl: 1, team: 'assessores',
    law: 'Mandato de 4 anos, sem limite de reeleições. Idade mínima de 21 anos. Voto proporcional, com suplentes na lista do partido.',
  },
  senador: {
    id: 'senador', icon: '⚖️', tier: 1, rank: 3, kind: 'leg', name: 'Senador(a)', place: 'Senado Federal', turns: 6, years: 8, minAge: 35, reel: null,
    money: 2e6, sphere: 'est', rival: 58, runoff: false, vice: false, supl: 2, team: 'assessores',
    law: 'Mandato de 8 anos. Idade mínima de 35 anos. Cada senador é eleito com dois suplentes escolhidos por ele.',
  },
  governador: {
    id: 'governador', icon: '🏰', tier: 2, rank: 3, kind: 'exec', name: 'Governador(a)', place: 'Palácio do Governo', turns: 6, years: 4, minAge: 30, reel: 1,
    money: 120e6, sphere: 'est', rival: 59, runoff: true, vice: true, supl: 0, team: 'secretarias_est',
    law: 'Mandato de 4 anos e uma reeleição seguida. Idade mínima de 30 anos. Eleito em chapa com vice. Nomeia os secretários de Estado.',
  },
  presidente: {
    id: 'presidente', icon: '🇧🇷', tier: 3, rank: 4, kind: 'exec', name: 'Presidente da República', place: 'Palácio do Planalto', turns: 8, years: 4, minAge: 35, reel: 1,
    money: 8e9, sphere: 'fed', rival: 62, runoff: true, vice: true, supl: 0, team: 'ministerios',
    law: 'Mandato de 4 anos e uma reeleição seguida. Idade mínima de 35 anos. Eleito em chapa com vice. Nomeia os ministros de Estado.',
  },
}

// Para onde cada cargo pode ir na próxima eleição (o próprio cargo é a reeleição)
export const PATHS = {
  vereador: ['vereador', 'prefeito', 'dep_estadual', 'dep_federal'],
  prefeito: ['prefeito', 'dep_estadual', 'dep_federal', 'senador', 'governador'],
  dep_estadual: ['dep_estadual', 'dep_federal', 'prefeito', 'senador', 'governador'],
  dep_federal: ['dep_federal', 'prefeito', 'senador', 'governador', 'presidente'],
  senador: ['senador', 'governador', 'presidente'],
  governador: ['governador', 'senador', 'presidente'],
  presidente: ['presidente'],
}

// Saves antigos: cargo deduzido do estágio
export const LEGACY_OFFICE = ['vereador', 'dep_federal', 'governador', 'presidente']