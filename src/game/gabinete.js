// Acordos, estudos e poder. Tudo fictício.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/* ---------- estudos ---------- */
export const STUDIES = [
  { id: 'eco', icon: '📈', name: 'Economia e finanças', up: '+5% nos ganhos de Economia por nível' },
  { id: 'soc', icon: '🩺', name: 'Saúde e educação', up: '+5% nos ganhos de Social por nível' },
  { id: 'seg', icon: '🛡️', name: 'Segurança pública', up: '+5% nos ganhos de Segurança por nível' },
  { id: 'com', icon: '🎙️', name: 'Comunicação e oratória', up: '+4% nos ganhos de Popularidade e −4% nas perdas de Imagem por nível' },
  { id: 'dir', icon: '⚖️', name: 'Direito e ética', up: '−4 pontos no risco de escândalo, −6% de investigação nas ações polêmicas e −3% nas perdas de Imagem por nível' },
  { id: 'ges', icon: '🗂️', name: 'Gestão pública', up: '−3% nos custos de caixa por nível' },
]
export const STUDY_MAX = 5
export const studyNeed = (lvl) => Math.ceil((lvl + 1) / 2) // sessões para subir de nível
export const STUDY_FLAVOR = {
  eco: ['Você leu um manual de orçamento público até tarde.', 'Passou a noite numa aula de macroeconomia.', 'Tomou um café com um economista da universidade.'],
  soc: ['Visitou um hospital de referência e anotou tudo.', 'Passou a manhã numa escola que deu certo.', 'Leu um relatório sobre filas do SUS.'],
  seg: ['Acompanhou uma ronda de madrugada com a polícia.', 'Leu um estudo sobre policiamento inteligente.', 'Conversou com um delegado experiente.'],
  com: ['Fez um curso de oratória e ensaiou diante do espelho.', 'Gravou 20 vezes o mesmo discurso.', 'Passou o dia com um marqueteiro veterano.'],
  dir: ['Releu a Constituição com um professor de direito.', 'Assistiu a um curso sobre improbidade administrativa.', 'Almoçou com um ministro aposentado do Tribunal.'],
  ges: ['Fez um curso rápido de gestão de contratos.', 'Aprendeu a ler um balanço sem se perder.', 'Visitou uma prefeitura modelo em outro estado.'],
}

/* ---------- acordos ---------- */
export const MAX_DEALS = 3
// sign: efeito imediato | perk: efeito a cada rodada | turns: duração | stat/need: o que pesa na chance de fechar
export const DEALS = [
  // nacionais
  { id: 'conv_mun', scope: 'nacional', icon: '🏘️', name: 'Convênio com a prefeitura', stages: [0], desc: 'Obras e serviços em parceria com o prefeito.', sign: { soc: 3, cong: 2, cash: -2 }, perk: { pop: 0.5, soc: 0.3 }, turns: 4, stat: 'cong', need: 40 },
  { id: 'pacto_educ', scope: 'nacional', icon: '📚', name: 'Pacto pela educação', stages: [0, 1, 2, 3], desc: 'Metas e verba conjuntas para a rede de ensino.', sign: { soc: 3, cash: -3 }, perk: { soc: 0.8, cash: -0.4 }, turns: 4, stat: 'soc', need: 45 },
  { id: 'centrao', scope: 'nacional', icon: '🤝', name: 'Acordo com o bloco da maioria', stages: [1, 3], desc: 'Apoio fiel no plenário em troca de cargos e emendas.', sign: { cong: 8, img: -3 }, perk: { cong: 1, img: -0.4 }, turns: 4, stat: 'cong', need: 40 },
  { id: 'concertacao', scope: 'nacional', icon: '🏭', name: 'Concertação com empresários e sindicatos', stages: [1, 2, 3], desc: 'Salário, emprego e investimento na mesma mesa.', sign: { eco: 3, pop: 1 }, perk: { eco: 0.6, pop: 0.3 }, turns: 4, stat: 'eco', need: 45 },
  { id: 'pacto_fed', scope: 'nacional', icon: '🏛️', name: 'Pacto federativo', stages: [2, 3], desc: 'Divide receitas e metas entre União, estados e municípios.', sign: { cong: 4, img: 1, cash: -3 }, perk: { cong: 0.6, pop: 0.2 }, turns: 4, stat: 'cong', need: 45 },
  { id: 'pacto_seg', scope: 'nacional', icon: '🛡️', name: 'Pacto nacional de segurança', stages: [2, 3], desc: 'Polícias, justiça e inteligência trabalhando juntas.', sign: { seg: 3, cash: -3 }, perk: { seg: 0.8, cash: -0.4 }, turns: 4, stat: 'seg', need: 45 },
  // internacionais
  { id: 'cidades_irmas', scope: 'internacional', icon: '🌍', name: 'Cidades-irmãs', stages: [0, 1], desc: 'Intercâmbio com cidades de outros países.', sign: { img: 2, pop: 1 }, perk: { img: 0.3, pop: 0.2 }, turns: 4, stat: 'img', need: 40 },
  { id: 'invest_estr', scope: 'internacional', icon: '💼', name: 'Investimento estrangeiro no estado', stages: [2], desc: 'Uma multinacional promete fábrica e empregos.', sign: { eco: 3, cash: 4 }, perk: { eco: 0.6 }, turns: 4, stat: 'eco', need: 45 },
  { id: 'mercosul', scope: 'internacional', icon: '🌎', name: 'Acordo comercial regional', stages: [2, 3], desc: 'Menos taxas para vender e comprar dos vizinhos.', sign: { eco: 4, pop: 1 }, perk: { eco: 0.8, soc: -0.1 }, turns: 4, stat: 'eco', need: 45 },
  { id: 'clima', scope: 'internacional', icon: '🌳', name: 'Acordo climático', stages: [2, 3], desc: 'Metas ambientais com fundo internacional.', sign: { img: 4, cash: 3 }, perk: { img: 0.6, cash: 0.3, eco: -0.2 }, turns: 4, stat: 'img', need: 50 },
  { id: 'emprestimo', scope: 'internacional', icon: '🏦', name: 'Empréstimo internacional', stages: [2, 3], desc: 'Entra dinheiro agora, mas com exigências de ajuste.', sign: { cash: 15, img: -2 }, perk: { soc: -0.5, pop: -0.3 }, turns: 4, stat: 'eco', need: 30 },
  { id: 'defesa', scope: 'internacional', icon: '🛰️', name: 'Aliança de defesa', stages: [3], desc: 'Cooperação militar e de inteligência com outros países.', sign: { seg: 4, img: -1 }, perk: { seg: 0.8, img: -0.2 }, turns: 4, stat: 'cong', need: 45 },
  { id: 'potencia', scope: 'internacional', icon: '🌐', name: 'Parceria com uma grande potência', stages: [3], desc: 'Dinheiro e comércio, com um preço de dependência.', sign: { eco: 5, cash: 4, img: -2 }, perk: { eco: 1, img: -0.3 }, turns: 4, stat: 'img', need: 45 },
]

/* ---------- ações especiais do cargo: concentrar poder ---------- */
// power: quanto aumenta o "poder concentrado". gamble: decisão arriscada com resultado sorteado (abre uma janela)
export const POWER_ACTIONS = [
  { id: 'decretos', stages: [3], sphere: 'fed', power: 8, name: 'Governar por decreto', desc: 'Passar por cima do Congresso nos temas que importam. Concentra poder.', fx: { pop: 3, cong: -6, cash: -1 } },
  { id: 'imprensa', stages: [2, 3], sphere: 'fed', power: 10, dirty: true, risk: 0.3, heat: 12, riskFx: { img: -8, pop: -5 }, name: 'Controlar a imprensa', desc: 'Pressão em donos de veículos, verba só para quem elogia. Concentra poder.', fx: { pop: 3, img: -10, cong: 1 } },
  { id: 'judiciario', stages: [3], sphere: 'fed', power: 10, dirty: true, risk: 0.3, heat: 14, riskFx: { img: -8, cong: -4 }, name: 'Aparelhar o Judiciário', desc: 'Nomear aliados para os tribunais. Concentra poder.', fx: { cong: 4, img: -8 } },
  { id: 'sitio', stages: [3], when: (g) => g.power >= 20, sphere: 'fed', power: 14, dirty: true, risk: 0.35, heat: 12, riskFx: { pop: -8, img: -6 }, name: 'Decretar estado de sítio', desc: 'Direitos suspensos "por segurança". Concentra muito poder.', fx: { seg: 8, pop: -5, img: -9, cong: 3 } },
  { id: 'militar', stages: [3], when: (g) => g.power >= 30, sphere: 'fed', power: 12, dirty: true, risk: 0.25, heat: 10, riskFx: { img: -8, cong: -3 }, name: 'Cooptar as Forças Armadas', desc: 'Cargos, soldo e favores para quem tem armas. Concentra poder.', fx: { seg: 6, cong: 3, cash: -4, img: -6 } },
  {
    id: 'dissolver', stages: [3], when: (g) => g.power >= 35, gamble: true, sphere: 'fed', name: 'Fechar o Congresso', desc: 'Dissolver o Legislativo e governar com uma casa de fachada. Se falhar, a crise é enorme.', fx: {},
    odds: (g) => clamp(0.25 + g.power * 0.003 + (g.stats.seg - 40) * 0.004 + (g.stats.pop - 40) * 0.002, 0.1, 0.8),
    ok: { fx: { cong: 45, img: -15, pop: -4 }, power: 25, heat: 20, text: 'As portas do Congresso foram lacradas de madrugada. Os parlamentares que sobraram aplaudem de pé.' },
    fail: { fx: { cong: -25, img: -15, pop: -10 }, power: -10, heat: 25, text: 'A tentativa vazou antes da hora. O país parou, a imprensa gritou e o seu próprio partido pediu explicações.' },
  },
  {
    id: 'emenda3', stages: [3], when: (g) => g.term === 2 && !g.extra, gamble: true, sphere: 'fed', name: 'Emenda do terceiro mandato', desc: 'Mudar a Constituição para poder disputar mais uma vez. Exige maioria no Congresso.', fx: {},
    odds: (g) => clamp(0.3 + g.stats.cong * 0.004 + g.power * 0.002, 0.1, 0.8),
    ok: { fx: { img: -5, pop: -2 }, power: 10, extra: 1, text: 'A emenda passou no limite do prazo. Você ganhou mais um mandato no horizonte e muita gente ficou assustada.' },
    fail: { fx: { cong: -8, img: -6, pop: -3 }, text: 'A emenda empacou na comissão. A oposição fez a festa e a base ficou com medo de se queimar.' },
  },
  {
    id: 'golpe', stages: [3], when: (g) => g.power >= 60, gamble: true, sphere: 'fed', name: 'Tomar o poder', desc: 'O passo final: suspender a Constituição e governar sem eleições. É tudo ou nada.', fx: {},
    odds: (g) => clamp(0.2 + g.power * 0.003 + (g.stats.seg - 40) * 0.004 + (g.stats.pop - 40) * 0.002 + (g.stats.cong - 40) * 0.002, 0.1, 0.85),
    ok: { end: 'dictator', text: 'Os tanques ocuparam a praça, a rádio tocou o hino e o decreto foi lido ao país. A democracia acabou naquela noite.' },
    fail: { end: 'fail', text: 'Parte das tropas não aderiu. Em poucas horas, o seu governo acabou cercado pelos próprios aliados.' },
  },
]

export const ESTUDAR = { id: 'estudar', special: true, sphere: 'mun', name: 'Estudar e se preparar', desc: 'Cursos, livros e conversas com especialistas. Cada nível dá um bônus permanente em uma área.', fx: {} }
export const ACORDO = { id: 'acordo', special: true, sphere: 'fed', name: 'Negociar um acordo', desc: 'Acordos nacionais e internacionais dão bônus a cada rodada enquanto durarem (até 3 ao mesmo tempo).', fx: {} }