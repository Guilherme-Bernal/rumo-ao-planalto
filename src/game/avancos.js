// Dados do BLOCO 20: instrumentos constitucionais, blocos internacionais, pesquisa e armas, elenco recorrente, guias.
// Só dados: a lógica fica no motor (engine.js).

/* ---------- Constituição ---------- */
// PEC: 3/5 em cada Casa, em dois turnos (art. 60). hard = dificuldade extra.
export const PECS = [
  { id: 'tributaria', icon: '🧾', name: 'Reforma tributária', desc: 'Simplifica os impostos. Setores que perdem fazem lobby contra.', fx: { eco: 5, cash: 3, cong: -2 }, hard: 0.05 },
  { id: 'previdencia', icon: '👴', name: 'Reforma da previdência', desc: 'Equilibra as contas no longo prazo, mas é impopular.', fx: { cash: 6, eco: 2, pop: -5 }, hard: 0.15 },
  { id: 'seguranca', icon: '🛡️', name: 'PEC da Segurança Pública', desc: 'Integra as polícias e dá um comando nacional.', fx: { seg: 5, pop: 2, img: -1 }, hard: 0.05 },
  { id: 'educacao', icon: '📚', name: 'PEC do piso da educação', desc: 'Garante um mínimo de investimento em escolas.', fx: { soc: 5, cash: -3, pop: 2 }, hard: 0 },
  { id: 'clima', icon: '🌳', name: 'PEC do Clima e da Amazônia', desc: 'Põe metas ambientais no texto da Constituição.', fx: { img: 4, soc: 2, eco: -1 }, hard: 0.05 },
  { id: 'mandato', icon: '🗓️', name: 'Mandato de cinco anos, sem reeleição', desc: 'Muda as regras do jogo político. Rende imagem de desapego.', fx: { img: 3, pop: 1, cong: -1 }, hard: 0.1 },
  { id: 'municipios', icon: '🏘️', name: 'PEC do pacto federativo', desc: 'Mais recursos para estados e municípios.', fx: { pop: 2, cong: 2, cash: -2 }, hard: 0.05 },
  { id: 'defesa', icon: '☢️', name: 'Fim da vedação à energia nuclear militar', desc: 'A Constituição só permite uso pacífico da energia nuclear (art. 21). Mudar isso abre o programa de armas e custa muito caro no exterior.', fx: { seg: 3, img: -6, cong: -3 }, hard: 0.3, flag: 'nuclearOk', rel: { eua: -10, ue: -8, onu: -8 } },
]
// Cláusulas pétreas (art. 60, §4º): nenhuma emenda pode tender a aboli-las.
export const PETREAS = [
  { id: 'voto', icon: '🗳️', name: 'Acabar com o voto direto', desc: 'Cláusula pétrea: o Supremo derruba na hora.' },
  { id: 'stf', icon: '⚖️', name: 'Esvaziar o Supremo', desc: 'Atenta contra a separação dos Poderes.' },
  { id: 'federacao', icon: '🗺️', name: 'Extinguir a autonomia dos estados', desc: 'A forma federativa é intocável.' },
  { id: 'direitos', icon: '📕', name: 'Cortar direitos individuais', desc: 'Direitos e garantias individuais não saem do texto.' },
]
// Medidas provisórias (art. 62): valem logo, mas o Congresso tem de converter em lei.
export const MPS = [
  { id: 'auxilio', icon: '💸', name: 'MP do auxílio emergencial', desc: 'Dinheiro direto para as famílias.', fx: { pop: 4, soc: 1, cash: -3 } },
  { id: 'combustivel', icon: '⛽', name: 'MP dos combustíveis', desc: 'Segura o preço na bomba.', fx: { pop: 3, eco: 1, cash: -2 } },
  { id: 'emprego', icon: '🧑‍🏭', name: 'MP do primeiro emprego', desc: 'Incentivo para contratar jovens.', fx: { eco: 3, soc: 1, cash: -1 } },
  { id: 'seguranca', icon: '🚓', name: 'MP da segurança nas fronteiras', desc: 'Reforço de policiamento e controle.', fx: { seg: 3, cash: -2, img: -0.5 } },
]
// Estados de exceção (arts. 34-36 e 136-139).
export const ESTADOS = [
  { id: 'defesa', icon: '🛡️', name: 'Estado de defesa', dur: 2, fx: { seg: 2.5, pop: -1, img: -1.5 }, golpe: 4, desc: 'Art. 136: 30 dias, em áreas determinadas, ouvidos os Conselhos da República e de Defesa. Dá para prorrogar uma vez.', dica: 'Só faz sentido com protesto, greve ou segurança em queda.' },
  { id: 'sitio', icon: '🚨', name: 'Estado de sítio', dur: 3, fx: { seg: 4, pop: -2.5, img: -3, cong: -1 }, golpe: 9, auth: true, desc: 'Arts. 137-139: o Congresso precisa autorizar. É a medida mais grave dentro da lei.', dica: 'Exige comoção grave, guerra ou conflito armado no país.' },
  { id: 'intervencao', icon: '🏛️', name: 'Intervenção federal em um estado', dur: 2, fx: { seg: 3.5, pop: -0.5, cong: -1 }, golpe: 3, desc: 'Arts. 34-36: medida excepcional, como no Rio em 2018. Suspende a autonomia local por um tempo.', dica: 'Só com a segurança em crise ou paralisação das polícias.' },
]
// Consultas populares (art. 14): plebiscito antes da lei, referendo depois.
export const CONSULTAS = [
  { id: 'voto', icon: '🗳️', name: 'Plebiscito: voto facultativo', yes: { img: 2, pop: 2, cong: -1 }, no: { img: 1, cong: 1 } },
  { id: 'privat', icon: '🏭', name: 'Plebiscito: privatizar uma estatal', yes: { cash: 5, eco: 2, pop: -3 }, no: { pop: 1, cong: -1 } },
  { id: 'armas', icon: '🔫', name: 'Referendo: comércio de armas', yes: { seg: -2, pop: 1 }, no: { seg: 2, img: 1 } },
  { id: 'clima', icon: '🌎', name: 'Plebiscito: metas do clima', yes: { img: 3, eco: -1, soc: 1 }, no: { img: -1, eco: 1 } },
]

/* ---------- Internacional ---------- */
// Blocos: entrar custa pontos de agenda e dinheiro; rendem passivos por rodada.
export const BLOCOS = [
  { id: 'mercosul', icon: '🤝', name: 'Mercosul', need: { arg: 50 }, cash: 1, rel: { arg: 6, lat: 4 }, passive: { eco: 0.3, cong: 0.1 }, desc: 'Mercado comum com os vizinhos. Tarifa baixa e comércio regional.' },
  { id: 'brics', icon: '🌐', name: 'Bloco dos emergentes (BRICS)', need: { china: 52, india: 50 }, cash: 2, rel: { china: 6, india: 6, rus: 4, eua: -4 }, passive: { eco: 0.3, cash: 0.2 }, desc: 'Banco de desenvolvimento e comércio fora do dólar. Irrita o Ocidente.' },
  { id: 'g20', icon: '🏛️', name: 'Cúpula do G20', need: { ue: 52 }, cash: 1, rel: { eua: 3, ue: 4, japao: 3 }, passive: { img: 0.3 }, desc: 'Assento fixo nas decisões globais da economia.' },
  { id: 'amazonia', icon: '🌳', name: 'Pacto Amazônico', need: { lat: 52 }, cash: 1, rel: { lat: 6, onu: 4 }, passive: { img: 0.2, soc: 0.2 }, desc: 'Cooperação na floresta, com fundo internacional de preservação.' },
  { id: 'conselho', icon: '🕊️', name: 'Assento rotativo no Conselho de Segurança', need: { onu: 60, eua: 50 }, cash: 3, rel: { onu: 8 }, passive: { img: 0.4, seg: 0.2 }, desc: 'Voz nas crises globais. Exige muita costura diplomática.' },
  { id: 'defesaSul', icon: '🛰️', name: 'Aliança de defesa do Atlântico Sul', need: { afr: 55 }, cash: 2, rel: { afr: 7, eua: -2 }, passive: { seg: 0.3 }, desc: 'Patrulha conjunta do oceano com países africanos e vizinhos.' },
]
// Tratados de livre comércio (precisam de referendo do Congresso, art. 84, VIII).
export const TRATADOS = [
  { id: 'tlcUe', partner: 'ue', icon: '🇪🇺', name: 'Acordo comercial com a União Europeia', need: 58, fx: { eco: 3, cash: 1 }, pass: { eco: 0.25, cash: 0.2 }, rel: { ue: 8 }, cost: 2 },
  { id: 'tlcChina', partner: 'china', icon: '🐉', name: 'Parceria comercial com a China', need: 55, fx: { eco: 3, cash: 2 }, pass: { eco: 0.3, cash: 0.25 }, rel: { china: 8, eua: -4 }, cost: 2 },
  { id: 'tlcEua', partner: 'eua', icon: '🦅', name: 'Acordo de tarifas com os EUA', need: 58, fx: { eco: 2, cash: 2, img: 1 }, pass: { eco: 0.2, cash: 0.25 }, rel: { eua: 8, china: -3 }, cost: 2 },
  { id: 'tlcJapao', partner: 'japao', icon: '🇯🇵', name: 'Acordo de tecnologia com o Japão', need: 55, fx: { eco: 2, img: 1 }, pass: { eco: 0.2, img: 0.1 }, rel: { japao: 8 }, cost: 1 },
  { id: 'tlcIndia', partner: 'india', icon: '🇮🇳', name: 'Acordo comercial com a Índia', need: 55, fx: { eco: 2, cash: 1 }, pass: { eco: 0.2 }, rel: { india: 8 }, cost: 1 },
]
// Operações no exterior. Os países são fictícios de propósito.
export const OPS = [
  { id: 'paz', icon: '🕊️', name: 'Missão de paz em Zandora', desc: 'Capacetes azuis brasileiros numa missão da ONU. Custa pouco e rende imagem.', cost: 2, left: 3, need: { fa: 40 }, fx: { img: 1.5, seg: -0.2 }, end: { img: 3, cong: 1 }, rel: { onu: 8 } },
  { id: 'resgate', icon: '🛩️', name: 'Operação de resgate em Valdória', desc: 'Retirar brasileiros de uma região em guerra.', cost: 2, left: 2, need: { fa: 45 }, fx: { pop: 1.2 }, end: { pop: 3, img: 1 }, rel: {} },
  { id: 'ajuda', icon: '🚢', name: 'Ajuda humanitária a Kemeria', desc: 'Navio-hospital e alimentos para um país atingido por desastre.', cost: 3, left: 2, need: {}, fx: { img: 1.2, soc: 0.2 }, end: { img: 3 }, rel: { onu: 4, afr: 4 } },
  { id: 'ofensiva', icon: '⚔️', name: 'Intervenção militar em Karvênia', desc: 'Ação armada contra um regime vizinho fictício que ameaça as fronteiras. Exige força, Congresso e estômago.', cost: 5, left: 4, need: { fa: 60, tech: 'defesa' }, fx: { pop: 1.5, seg: 0.8, cash: -0.8, img: -1 }, end: { pop: 2, img: -4 }, rel: { onu: -10, eua: -4, rus: -3 }, risk: 0.3, war: true },
]

/* ---------- Pesquisa, tecnologia e armas ---------- */
export const RAMOS = [
  { id: 'ia', icon: '🤖', name: 'Inteligência artificial e dados' },
  { id: 'energia', icon: '🔋', name: 'Energia' },
  { id: 'bio', icon: '🧬', name: 'Biotecnologia e saúde' },
  { id: 'espaco', icon: '🛰️', name: 'Espaço' },
  { id: 'chip', icon: '💾', name: 'Semicondutores' },
  { id: 'agro', icon: '🌾', name: 'Agro e alimentos' },
  { id: 'defesa', icon: '🎖️', name: 'Defesa e armas' },
]
// civil: governador também pode pesquisar. req: tecnologias necessárias. cost: caixa por impulso (cada impulso = +34).
export const TECHS = [
  { id: 'ia1', ramo: 'ia', icon: '🤖', name: 'Governo digital e IA nos serviços', desc: 'Atendimento mais rápido e fraudes detectadas.', pass: { soc: 0.3, cash: 0.2 }, cost: 2, civil: true, req: [] },
  { id: 'ia2', ramo: 'ia', icon: '🧠', name: 'Supercomputador nacional', desc: 'Modelos próprios de linguagem e clima.', pass: { eco: 0.3, img: 0.2 }, cost: 3, civil: true, req: ['ia1'] },
  { id: 'ia3', ramo: 'ia', icon: '🕸️', name: 'Ciberdefesa nacional', desc: 'Protege infraestruturas críticas contra ataques.', pass: { seg: 0.3 }, cost: 3, req: ['ia1'], gives: 'ciber' },
  { id: 'en1', ramo: 'energia', icon: '☀️', name: 'Parques solares e eólicos', desc: 'Energia barata e limpa.', pass: { eco: 0.3, img: 0.1 }, cost: 2, civil: true, req: [] },
  { id: 'en2', ramo: 'energia', icon: '💧', name: 'Hidrogênio verde', desc: 'Exportação de energia limpa.', pass: { eco: 0.4, cash: 0.2 }, cost: 3, civil: true, req: ['en1'] },
  { id: 'bio1', ramo: 'bio', icon: '💉', name: 'Fábrica nacional de vacinas', desc: 'Menos dependência de fora em uma pandemia.', pass: { soc: 0.4 }, cost: 2, civil: true, req: [] },
  { id: 'bio2', ramo: 'bio', icon: '🧪', name: 'Biofármacos e genômica', desc: 'Medicamentos nacionais e patentes.', pass: { soc: 0.3, cash: 0.2 }, cost: 3, civil: true, req: ['bio1'] },
  { id: 'esp1', ramo: 'espaco', icon: '🚀', name: 'Base de lançamento comercial', desc: 'Aluga a base para satélites de outros países.', pass: { cash: 0.4, img: 0.2 }, cost: 3, req: [] },
  { id: 'esp2', ramo: 'espaco', icon: '🛰️', name: 'Constelação de satélites', desc: 'Internet no interior e monitoramento da floresta.', pass: { soc: 0.2, seg: 0.2, eco: 0.2 }, cost: 4, req: ['esp1'], gives: 'satelite' },
  { id: 'chip1', ramo: 'chip', icon: '💾', name: 'Fábrica de semicondutores', desc: 'Chips no país, com parceiros estrangeiros.', pass: { eco: 0.5 }, cost: 4, civil: true, req: ['ia1'] },
  { id: 'ag1', ramo: 'agro', icon: '🌾', name: 'Agricultura de precisão', desc: 'Mais produção com menos insumo.', pass: { eco: 0.3, cash: 0.2 }, cost: 2, civil: true, req: [] },
  { id: 'ag2', ramo: 'agro', icon: '🌱', name: 'Alimentos e proteínas do futuro', desc: 'Exporta tecnologia e protege a floresta.', pass: { eco: 0.3, img: 0.3 }, cost: 3, civil: true, req: ['ag1', 'bio1'] },
  { id: 'def1', ramo: 'defesa', icon: '🎖️', name: 'Indústria nacional de defesa', desc: 'Blindados, radares e munição fabricados aqui.', pass: { seg: 0.3, cash: 0.2 }, cost: 3, req: [], gives: 'defesa' },
  { id: 'def2', ramo: 'defesa', icon: '🛩️', name: 'Drones e aeronaves não tripuladas', desc: 'Vigilância de fronteira e apoio às forças.', pass: { seg: 0.3 }, cost: 3, req: ['def1', 'ia1'], gives: 'drones' },
  { id: 'def3', ramo: 'defesa', icon: '✈️', name: 'Caça nacional de nova geração', desc: 'Orgulho militar e exportação de material.', pass: { seg: 0.4, cash: 0.2 }, cost: 5, req: ['def2'], gives: 'caca' },
  { id: 'def4', ramo: 'defesa', icon: '🛡️', name: 'Escudo antimíssil', desc: 'Dissuasão defensiva. Os vizinhos olham de lado.', pass: { seg: 0.5 }, cost: 5, req: ['def3', 'ia3'], gives: 'escudo' },
  { id: 'def5', ramo: 'defesa', icon: '☢️', name: 'Arsenal dissuasor', desc: 'Só é possível depois da PEC que muda o art. 21 e do ciclo do urânio. A conta diplomática é enorme.', pass: { seg: 0.8, img: -0.8 }, cost: 8, req: ['def4'], gives: 'arsenal', needFlag: 'nuclearOk', needNuc: 'enr', rel: { eua: -12, ue: -10, onu: -12, china: -4 } },
]
export const TECH_PUSH = 34

/* ---------- Consequências encadeadas ---------- */
// Uma decisão de hoje volta daqui a algumas rodadas.
export const CHAIN = {
  obra: { delay: 3, icon: '🏗️', text: 'A obra que você acelerou rendeu uma inauguração bonita e uma auditoria pouco depois.', fx: { img: -2, pop: 1 }, tone: 'down' },
  dirty: { delay: 4, icon: '🕵️', text: 'O favor que você aceitou voltou na forma de um jornalista com perguntas incômodas.', fx: { img: -3 }, tone: 'down', heat: 6 },
  aliado: { delay: 3, icon: '🤝', text: 'O aliado a quem você ajudou lembrou do favor e entregou votos numa hora difícil.', fx: { cong: 3 }, tone: 'up' },
  greve: { delay: 3, icon: '✊', text: 'O acordo da greve foi cumprido, e a categoria passou a elogiar a sua gestão.', fx: { soc: 1.5, pop: 1 }, tone: 'up' },
  mp: { delay: 3, icon: '📜', text: 'Os efeitos da medida provisória chegaram ao dia a dia do povo.', fx: { pop: 1, eco: 0.5 }, tone: 'up' },
  guerra: { delay: 3, icon: '🌍', text: 'A sua posição na guerra distante rendeu um convite diplomático inesperado.', fx: { img: 2 }, tone: 'up' },
  parceria: { delay: 4, icon: '🔬', text: 'O investimento em pesquisa gerou uma patente nacional que virou notícia.', fx: { eco: 1.5, img: 1.5 }, tone: 'up' },
}

/* ---------- Elenco recorrente ---------- */
export const ELENCO_ROLES = {
  rival: { icon: '🥊', label: 'rival' },
  exAliado: { icon: '💔', label: 'ex-aliado' },
  ministro: { icon: '🎩', label: 'ministro' },
}
export const VOLTA_RIVAL = [
  { text: (n) => `${n}, seu rival de sempre, voltou a dar entrevistas criticando a sua gestão.`, fx: { img: -1.5, pop: -1 } },
  { text: (n) => `${n} lançou um livro cheio de críticas ao seu mandato. Vendeu bem.`, fx: { img: -1, pop: -1.5 } },
  { text: (n) => `${n} aceitou um debate público e saiu bem na foto. A imprensa comenta.`, fx: { pop: -1.5, cong: -0.5 } },
]
export const VOLTA_EXALIADO = [
  { text: (n) => `${n}, que já foi seu aliado, rompeu publicamente e levou um grupo junto.`, fx: { cong: -2, pop: -0.5 } },
  { text: (n) => `${n} fez as pazes e voltou a apoiar o seu governo. Um alívio na base.`, fx: { cong: 2.5, img: 0.5 }, good: true },
  { text: (n) => `${n} vazou uma conversa de bastidor sobre o seu governo.`, fx: { img: -2 } },
]
export const MINISTRO_FASES = [
  { text: (n, p) => `${n}, ${p}, virou a estrela do governo: entrega resultado e aparece bem nas pesquisas.`, fx: { img: 1.5, cong: 1 }, good: true },
  { text: (n, p) => `${n}, ${p}, entrou em rota de colisão com o Congresso e ameaça pedir demissão.`, fx: { cong: -2, img: -0.5 } },
  { text: (n, p) => `${n}, ${p}, é citado(a) em um caso suspeito. A pressão por demissão cresce.`, fx: { img: -2.5 }, heat: 8 },
]

/* ---------- Partidos com história ---------- */
export const HIST_PARTIDOS = {
  fusao: (a, b, n) => `${a} e ${b} se fundem e criam o ${n}. O jornal fala em "casamento de conveniência".`,
  cisao: (a, n) => `Dissidentes do ${a} rompem com a direção e fundam o ${n}.`,
  morte: (a) => `O ${a} não resistiu aos anos de crise: perde o registro e deixa de existir.`,
}

/* ---------- Guias rápidos de cada aba ---------- */
export const GUIAS = {
  agenda: { t: 'Agenda', txt: 'O centro do jogo. Cada rodada começa com um evento, depois você escolhe ações no calendário e encerra o mês. Botões apagados mostram o motivo.' },
  disputa: { t: 'Disputa', txt: 'Ranking e pesquisas contra seus adversários. É aqui que você vê como está a corrida eleitoral.' },
  redes: { t: 'Redes', txt: 'Publicar rende voto e risco. Veja o que está em alta antes de postar.' },
  contatos: { t: 'Contatos', txt: 'Gente que fala com você por telefone ou na rua. Quem é ouvido e ajudado volta a ajudar depois. As conversas mudam conforme o seu cargo.' },
  mapa: { t: 'Mapa', txt: 'Veja onde você vai bem ou mal no território. Toque num estado para ver detalhes.' },
  orcamento: { t: 'Orçamento', txt: 'Controle de onde vai o dinheiro. Cortar de um lado pode custar voto do outro.' },
  plano: { t: 'Plano de governo', txt: 'Promessas de campanha. Cumprir rende imagem e voto na reeleição.' },
  leis: { t: 'Leis e poderes', txt: 'Leis, vetos, tribunal, metas do mandato e os instrumentos do seu cargo (como PEC e estados de exceção para quem está em Brasília). Ações só valem na fase de ações.' },
  ideias: { t: 'Ideias', txt: 'Defina a linha do seu mandato. Quanto mais você age nela, mais forte ela fica.' },
  partido: { t: 'Partido', txt: 'Troque de legenda ou aceite convites. Partidos novos surgem, se fundem, racham e morrem com o tempo, e o jornal comenta.' },
  mundo: { t: 'Mundo', txt: 'Relações externas, blocos, tratados, pesquisa, armas e Forças Armadas (conforme o cargo). Cada rodada você tem pontos de diplomacia, defesa e pesquisa.' },
}
export const FASES = { event: 'evento', outcome: 'resultado do evento', recap: 'resumo da rodada', campaign: 'campanha', result: 'apuração', runoff: 'segundo turno' }
