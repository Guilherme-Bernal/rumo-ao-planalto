// Dados do "Mundo": diplomacia, guerras, Forças Armadas, programa nuclear,
// relações federativas e propostas de lei.

export const PARTNERS = [
  { id: 'eua', name: 'Estados Unidos', ico: '🦅', note: 'Mercado, tecnologia e investimentos. Cobra alinhamento.' },
  { id: 'china', name: 'China', ico: '🐉', note: 'Maior comprador de soja e minério. Quer parceria longa.' },
  { id: 'ue', name: 'União Europeia', ico: '🏰', note: 'Acordo comercial e pauta ambiental.' },
  { id: 'arg', name: 'Argentina e Mercosul', ico: '🧉', note: 'Vizinhos, fronteira e comércio regional.' },
  { id: 'rus', name: 'Rússia', ico: '🐻', note: 'Fertilizantes, diesel e uma relação delicada.' },
  { id: 'ori', name: 'Oriente Médio', ico: '🛢️', note: 'Petróleo, investimentos e compra de carne.' },
]

// Efeito passivo por rodada de uma boa relação (rel 100) ou má (rel 0), aplicado de forma proporcional.
export const PARTNER_PASSIVE = {
  eua: { eco: 0.5, img: 0.4 },
  china: { eco: 0.8 },
  ue: { img: 0.5, soc: 0.2 },
  arg: { seg: 0.4, eco: 0.3 },
  rus: { eco: 0.4, cash: 0.3 },
  ori: { eco: 0.4, cash: 0.2 },
}

// Alinhar com um parceiro estremece outro (quanto vale em pontos)
export const RIVALRY = { eua: { china: 3, rus: 4 }, china: { eua: 3 }, rus: { eua: 4, ue: 4 }, ue: { rus: 2 } }

export const DIPLO_ACTIONS = [
  { id: 'visita', name: 'Visita oficial', desc: 'Viagem de Estado com comitiva e foto na bandeira.', fx: { img: 1, cash: -2 }, rel: 10 },
  { id: 'acordo', name: 'Acordo comercial', desc: 'Só sai se a relação estiver boa. Rende comércio.', fx: { eco: 3, cash: -1 }, rel: 6, need: 45, fail: { fx: { img: -1 }, rel: -3, out: 'O parceiro enrolou, e o acordo ficou para depois.' } },
  { id: 'duro', name: 'Endurecer o tom', desc: 'Discurso duro. A torcida gosta, o parceiro não.', fx: { pop: 2, img: -1 }, rel: -14 },
]

// Guerras e crises no mundo
export const WARS = [
  { id: 'leste', name: 'Guerra no Leste Europeu', ico: '💥', who: ['rus', 'ue'], fx: { eco: -0.8, cash: -0.3 }, desc: 'Trigo, fertilizante e diesel disparam de preço.' },
  { id: 'golfo', name: 'Conflito no Oriente Médio', ico: '🔥', who: ['ori', 'eua'], fx: { eco: -0.6, pop: -0.5 }, desc: 'O petróleo oscila e a gasolina sobe na bomba.' },
  { id: 'mar', name: 'Tensão no Mar da China', ico: '🚢', who: ['china', 'eua'], fx: { eco: -0.7, img: -0.2 }, desc: 'As rotas de comércio ficam arriscadas.' },
  { id: 'africa', name: 'Guerra civil na África', ico: '🕊️', who: ['ori', 'ue'], fx: { soc: -0.4, img: -0.2 }, desc: 'Refugiados e pressão humanitária.' },
  { id: 'fronteira', name: 'Crise na fronteira sul-americana', ico: '⛔', who: ['arg', 'eua'], fx: { seg: -0.6, eco: -0.3 }, desc: 'Tropas se movem perto das nossas fronteiras.' },
]

// Como cada postura do Brasil muda o efeito da guerra e o que traz de bom
export const STANCE = {
  neutro: { name: 'Neutralidade ativa', mult: 1, pass: {} },
  mediar: { name: 'Mediação', mult: 0.7, pass: { img: 0.3 } },
  lado: { name: 'Apoio a um dos lados', mult: 1.2, pass: { cong: 0.2 } },
  ajuda: { name: 'Ajuda humanitária', mult: 0.8, pass: { img: 0.2, cash: -0.3 } },
  lucrar: { name: 'Vender para os dois lados', mult: 0.6, pass: { eco: 0.7, cash: 0.4, img: -0.3 } },
}

export const DEF_ACTIONS = [
  { id: 'comandantes', name: 'Reunir os comandantes', desc: 'Café com Exército, Marinha e Aeronáutica.', fx: { cong: 1 }, fa: 8 },
  { id: 'reajuste', name: 'Reajuste e modernização', desc: 'Dinheiro para soldo, blindados e radar.', fx: { cash: -4, seg: 2 }, fa: 12 },
  { id: 'exercicio', name: 'Exercício conjunto com aliados', desc: 'Manobras no mar com marinhas amigas.', fx: { seg: 2, cash: -2, img: 1 }, fa: 6, rel: { eua: 3 } },
  { id: 'cortar', name: 'Cortar o orçamento da Defesa', desc: 'Alivia o caixa, mas os quartéis reclamam.', fx: { cash: 4, seg: -2 }, fa: -12 },
]

export const NUC = [
  { id: 'angra', name: 'Usinas nucleares (Angra e novas)', ico: '⚡', desc: 'Energia limpa e firme para a indústria.', done: { fx: { eco: 4, img: 2 }, text: 'A nova usina entrou em operação: energia firme e mais indústria.', rel: {} }, passive: { eco: 0.4 } },
  { id: 'sub', name: 'Submarino de propulsão nuclear', ico: '🛥️', desc: 'Defesa da Amazônia Azul e orgulho militar.', done: { fx: { seg: 4, img: 1 }, text: 'O submarino nuclear foi ao mar: orgulho nacional e respeito dos vizinhos.', rel: { eua: -5 }, fa: 12 }, passive: { seg: 0.3 } },
  { id: 'enr', name: 'Enriquecimento de urânio', ico: '☢️', desc: 'Autonomia do combustível. Atrai a atenção da AIEA.', done: { fx: { eco: 3, img: 0 }, text: 'O ciclo do combustível ficou completo, mas os olhos do mundo estão sobre você.', rel: { eua: -8, china: 3 } }, passive: { cash: 0.3 } },
]

// Relações federativas por cargo. dir: 'up' (quem te ajuda), 'down' (quem você ajuda), 'peer' (par/legislativo)
export const FED = {
  vereador: [
    { id: 'prefeito', name: 'Prefeito', ico: '🏙️', dir: 'up', pass: { cash: 0.6 } },
    { id: 'mesa', name: 'Presidente da Câmara', ico: '🏛️', dir: 'peer', pass: { cong: 0.7 } },
  ],
  prefeito: [
    { id: 'governador', name: 'Governador', ico: '🗺️', dir: 'up', pass: { cash: 0.8 } },
    { id: 'planalto', name: 'Governo federal', ico: '🇧🇷', dir: 'up', pass: { cash: 0.6, eco: 0.2 } },
    { id: 'camara', name: 'Câmara de Vereadores', ico: '🏛️', dir: 'peer', pass: { cong: 0.7 } },
  ],
  dep_estadual: [
    { id: 'governador', name: 'Governador', ico: '🗺️', dir: 'up', pass: { cong: 0.5, cash: 0.4 } },
    { id: 'prefeitos', name: 'Prefeitos da sua base', ico: '🏙️', dir: 'down', pass: { pop: 0.6 } },
    { id: 'mesa', name: 'Mesa da Assembleia', ico: '🏛️', dir: 'peer', pass: { cong: 0.7 } },
  ],
  dep_federal: [
    { id: 'planalto', name: 'Governo federal', ico: '🇧🇷', dir: 'up', pass: { cong: 0.5, cash: 0.4 } },
    { id: 'governador', name: 'Governador', ico: '🗺️', dir: 'up', pass: { pop: 0.4 } },
    { id: 'prefeitos', name: 'Prefeitos da sua base', ico: '🏙️', dir: 'down', pass: { pop: 0.6 } },
  ],
  senador: [
    { id: 'planalto', name: 'Governo federal', ico: '🇧🇷', dir: 'up', pass: { cong: 0.5, cash: 0.4 } },
    { id: 'governador', name: 'Governador', ico: '🗺️', dir: 'up', pass: { pop: 0.4 } },
    { id: 'prefeitos', name: 'Prefeitos do estado', ico: '🏙️', dir: 'down', pass: { pop: 0.5 } },
  ],
  governador: [
    { id: 'prefeitos', name: 'Prefeitos do estado', ico: '🏙️', dir: 'down', pass: { pop: 0.7, soc: 0.2 } },
    { id: 'planalto', name: 'Governo federal', ico: '🇧🇷', dir: 'up', pass: { cash: 0.8 } },
    { id: 'assembleia', name: 'Assembleia Legislativa', ico: '🏛️', dir: 'peer', pass: { cong: 0.8 } },
  ],
  presidente: [
    { id: 'governadores', name: 'Governadores', ico: '🗺️', dir: 'down', pass: { pop: 0.6, cong: 0.3 } },
    { id: 'congresso', name: 'Líderes do Congresso', ico: '🏛️', dir: 'peer', pass: { cong: 0.9 } },
    { id: 'prefeitos', name: 'Prefeitos das capitais', ico: '🏙️', dir: 'down', pass: { pop: 0.5 } },
  ],
}

export const FED_ACTIONS = {
  up: [
    { id: 'visita', name: 'Reunião de alinhamento', desc: 'Visita, café e promessa de parceria.', fx: { cong: 1 }, rel: 8 },
    { id: 'pedir', name: 'Pedir verba e obra', desc: 'Quanto melhor a relação, maior a chance de sair.', fx: {}, rel: 3, ask: { ok: { cash: 6, pop: 1 }, fail: { img: -1 }, failRel: -5 } },
    { id: 'obra', name: 'Obra em parceria', desc: 'Divide a conta e a foto.', fx: { cash: -3, soc: 2, pop: 1 }, rel: 7 },
    { id: 'confronto', name: 'Confrontar em público', desc: 'Cobra na imprensa. Cai a relação e sobe a torcida.', fx: { pop: 2, img: -1 }, rel: -15 },
  ],
  down: [
    { id: 'visita', name: 'Receber e ouvir', desc: 'Audiência com a bancada de prefeitos e governadores.', fx: { pop: 1 }, rel: 8 },
    { id: 'repasse', name: 'Repasse e convênio', desc: 'Manda verba. Compra gratidão e voto.', fx: { cash: -4, pop: 1 }, rel: 12 },
    { id: 'cobrar', name: 'Cobrar contrapartida', desc: 'Exige metas e prestação de contas.', fx: { cash: 3, img: 1 }, rel: -6 },
    { id: 'confronto', name: 'Retaliar a oposição local', desc: 'Corta convênios de quem votou contra.', fx: { cong: 2, img: -2 }, rel: -15 },
  ],
  peer: [
    { id: 'visita', name: 'Articular nos bastidores', desc: 'Café com líderes e acerto de pauta.', fx: { cong: 2 }, rel: 8 },
    { id: 'agrado', name: 'Emendas e agrados', desc: 'Libera emenda para quem ajuda.', fx: { cash: -3, cong: 1 }, rel: 11 },
    { id: 'pressao', name: 'Pressionar pela imprensa', desc: 'Expõe quem trava a pauta.', fx: { pop: 2, img: 1 }, rel: -8 },
    { id: 'confronto', name: 'Romper publicamente', desc: 'Briga aberta. Ninguém sai ileso.', fx: { pop: 1, img: -2 }, rel: -16 },
  ],
}

// Propostas de lei
export const TEMAS = [
  { id: 'saude', name: 'Saúde', ico: '🩺', stat: 'soc', nomes: ['Mutirão de consultas e exames', 'Programa de saúde da família ampliado', 'Rede pública integrada de saúde'] },
  { id: 'educacao', name: 'Educação', ico: '🎓', stat: 'soc', nomes: ['Reforço escolar e merenda de qualidade', 'Escola em tempo integral', 'Piso e plano de carreira dos professores'] },
  { id: 'seguranca', name: 'Segurança', ico: '🛡️', stat: 'seg', nomes: ['Iluminação e câmeras nos bairros', 'Polícia comunitária e inteligência', 'Pacto nacional contra o crime organizado'] },
  { id: 'economia', name: 'Economia', ico: '📈', stat: 'eco', nomes: ['Crédito para o pequeno empreendedor', 'Incentivo à indústria e ao emprego', 'Grande plano de infraestrutura e logística'] },
  { id: 'tributos', name: 'Tributos e contas', ico: '💰', stat: 'cash', nomes: ['Revisão de isenções e cobrança de dívida', 'Simplificação tributária', 'Reforma fiscal e teto de gastos'] },
  { id: 'etica', name: 'Transparência', ico: '⚖️', stat: 'img', nomes: ['Portal da transparência em tempo real', 'Ficha limpa e controle de contratos', 'Pacote anticorrupção'] },
  { id: 'social', name: 'Programa social', ico: '🤝', stat: 'pop', nomes: ['Cesta e auxílio emergencial local', 'Renda mínima para famílias em risco', 'Grande programa de renda e moradia'] },
  { id: 'ambiente', name: 'Meio ambiente', ico: '🌳', stat: 'img', nomes: ['Coleta seletiva e áreas verdes', 'Licenciamento verde e incentivo à energia limpa', 'Plano de metas de clima e Amazônia'] },
]

export const OUSADIA = [
  { id: 1, name: 'Pequena', one: 1.5, pass: 0.15, failImg: 0.5, failCong: 0, cost: 0 },
  { id: 2, name: 'Média', one: 3.5, pass: 0.3, failImg: 1.5, failCong: 1, cost: 0 },
  { id: 3, name: 'Ousada', one: 6, pass: 0.5, failImg: 3, failCong: 2, cost: 2 },
]

export const LAW_PREFIX = {
  vereador: 'Projeto de Lei Municipal:',
  prefeito: 'Projeto do Executivo municipal:',
  dep_estadual: 'Projeto de Lei Estadual:',
  dep_federal: 'PL na Câmara dos Deputados:',
  senador: 'PL no Senado:',
  governador: 'Projeto do Executivo estadual:',
  presidente: 'Projeto do Executivo federal:',
}