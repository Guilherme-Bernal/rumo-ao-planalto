// Projetos que vão a votação no plenário. Cada um tem tema, o que muda se passar e o que acontece se cair.
// fx usa as mesmas chaves de STATS (pop, cong, eco, cash, soc, seg, img).
const T = {
  mun: [
    { id: 'm-creche', icon: '🧸', title: 'Creches em tempo integral', ementa: 'Amplia vagas de creche e o horário de atendimento.', pro: 'Famílias que trabalham e professores da rede', con: 'Secretaria da Fazenda (custo alto)', win: { soc: 2, pop: 2, cash: -2 }, lose: {}, edu: 3 },
    { id: 'm-ciclovia', icon: '🚲', title: 'Ciclovia nos bairros', ementa: 'Cria 30 km de ciclovias ligando os bairros ao centro.', pro: 'Moradores, ciclistas e comércio local', con: 'Motoristas e donos de bar com estacionamento', win: { pop: 1, soc: 2, cash: -1 }, lose: {} },
    { id: 'm-ubs', icon: '🩺', title: 'Horário estendido nos postos de saúde', ementa: 'Postos de saúde passam a atender até as 22h.', pro: 'Quem trabalha o dia todo e as famílias', con: 'Sindicato dos servidores (hora extra)', win: { soc: 3, pop: 1, cash: -2 }, lose: {} },
    { id: 'm-iptu', icon: '🏠', title: 'Desconto no IPTU para bom pagador', ementa: 'Quem paga em dia ganha até 10% de desconto.', pro: 'Classe média e proprietários', con: 'Secretaria da Fazenda (menos arrecadação)', win: { pop: 2, cash: -3, img: 1 }, lose: {} },
    { id: 'm-camera', icon: '📹', title: 'Câmeras nas praças e escolas', ementa: 'Instala monitoramento por câmeras em locais públicos.', pro: 'Comerciantes e pais de alunos', con: 'Defensores da privacidade', win: { seg: 3, cash: -2, img: -1 }, lose: {} },
    { id: 'm-feira', icon: '🛍️', title: 'Feira livre aos domingos', ementa: 'Regulariza a feira livre e dá vaga fixa aos feirantes.', pro: 'Feirantes e a vizinhança', con: 'Supermercados da região', win: { eco: 2, pop: 1 }, lose: {} },
  ],
  est: [
    { id: 'e-univ', icon: '🏫', title: 'Interiorização da universidade estadual', ementa: 'Abre campi no interior com cursos técnicos e de graduação.', pro: 'Jovens do interior, reitores e prefeitos', con: 'Fazenda estadual (custo alto)', win: { soc: 2, eco: 1, cash: -3, img: 1 }, lose: {}, edu: 4 },
    { id: 'e-escola', icon: '🎓', title: 'Escolas de tempo integral', ementa: 'Amplia a jornada escolar e a merenda nas escolas estaduais.', pro: 'Professores e pais', con: 'Fazenda estadual (custo alto)', win: { soc: 3, pop: 1, cash: -3 }, lose: {} },
    { id: 'e-pedagio', icon: '🛣️', title: 'Concessão de rodovias', ementa: 'Passa rodovias estaduais para a iniciativa privada, com pedágio.', pro: 'Empresas e o caixa do estado', con: 'Caminhoneiros e quem usa a estrada todo dia', win: { eco: 2, cash: 3, pop: -2 }, lose: {} },
    { id: 'e-policia', icon: '👮', title: 'Reforço da Polícia Militar', ementa: 'Contrata 2 mil policiais e renova as viaturas.', pro: 'Moradores de áreas violentas e a bancada da segurança', con: 'Quem pede mais saúde e educação', win: { seg: 3, cash: -3, pop: 1 }, lose: {} },
    { id: 'e-bonus', icon: '💼', title: 'Incentivo fiscal para indústrias', ementa: 'Reduz ICMS para fábricas que contratarem no estado.', pro: 'Indústria e prefeituras do interior', con: 'Oposição (diz que é renúncia fiscal)', win: { eco: 3, cash: -2, img: -1 }, lose: {} },
  ],
  fed: [
    { id: 'f-ensino', icon: '🎓', title: 'Plano nacional de ensino técnico e superior', ementa: 'Expande institutos federais, bolsas e financiamento estudantil.', pro: 'Estudantes, reitores e a indústria', con: 'Equipe econômica (gasto novo)', win: { eco: 2, soc: 2, cash: -3 }, lose: {}, edu: 4 },
    { id: 'f-reforma', icon: '📑', title: 'Reforma tributária', ementa: 'Simplifica impostos e reduz a burocracia para empresas.', pro: 'Empresários e o mercado', con: 'Estados e prefeituras que temem perder receita', win: { eco: 3, cash: 2, cong: 1 }, lose: {} },
    { id: 'f-saude', icon: '🏥', title: 'Fila zero no SUS', ementa: 'Aumenta o repasse para cirurgias e exames na fila de espera.', pro: 'Médicos, pacientes e prefeitos', con: 'Equipe econômica (gasto novo)', win: { soc: 4, pop: 2, cash: -3 }, lose: {} },
    { id: 'f-fake', icon: '📵', title: 'Lei contra fake news', ementa: 'Obriga plataformas a retirar desinformação comprovada.', pro: 'Imprensa e a academia', con: 'Influenciadores e parte da oposição (alegam censura)', win: { img: 2, pop: -1, cong: -1 }, lose: {} },
    { id: 'f-seg', icon: '🛡️', title: 'Pacote anticrime', ementa: 'Endurece penas para facções e fortalece a inteligência policial.', pro: 'Bancada da segurança e a opinião pública', con: 'Entidades de direitos humanos', win: { seg: 4, pop: 1, img: -1 }, lose: {} },
    { id: 'f-energia', icon: '⚡', title: 'Marco da energia limpa', ementa: 'Incentiva eólica e solar com crédito para novos projetos.', pro: 'Investidores e ambientalistas', con: 'Setor de combustíveis fósseis', win: { eco: 3, img: 2, cash: -2 }, lose: {} },
  ],
}

// Projetos próprios de cada cargo: eles entram na pauta além dos da esfera.
const B = (id, icon, title, ementa, pro, con, win, edu) => ({ id, icon, title, ementa, pro, con, win, lose: {}, ...(edu ? { edu } : {}) })
const X = {
  vereador: [
    B('v-uso', '🏗️', 'Lei de uso do solo do bairro', 'Define o que pode ser construído em cada rua do seu bairro.', 'Moradores e associações', 'Construtoras', { pop: 2, eco: -1, img: 1 }),
    B('v-pracas', '🌳', 'Adoção de praças por empresas', 'Empresas cuidam das praças em troca de placa.', 'Vizinhos e comércio', 'Quem teme privatizar espaço público', { pop: 2, cash: 1 }),
  ],
  prefeito: [
    B('p-transp', '🚌', 'Tarifa zero aos domingos', 'Ônibus gratuito nos domingos e feriados.', 'Trabalhadores e comércio de rua', 'Empresas de ônibus (querem compensação)', { pop: 3, cash: -3, eco: 1 }),
    B('p-habita', '🏘️', 'Programa municipal de moradia', 'Lotes urbanizados para famílias de baixa renda.', 'Famílias sem casa e movimentos sociais', 'Secretaria da Fazenda', { soc: 3, pop: 2, cash: -3 }),
  ],
  dep_estadual: [
    B('de-agua', '💧', 'Plano estadual de saneamento', 'Metas de água e esgoto para os municípios do estado.', 'Prefeitos do interior e a saúde pública', 'Fazenda estadual (custo)', { soc: 3, img: 1, cash: -3 }),
    B('de-tecno', '🔬', 'Fundo estadual de pesquisa', 'Dinheiro fixo para universidades e startups do estado.', 'Reitores e jovens empreendedores', 'Quem quer o dinheiro para obras', { eco: 2, soc: 1, cash: -2, img: 1 }, 2),
  ],
  governador: [
    B('g-polo', '🏭', 'Polo industrial do estado', 'Incentivos para um novo polo industrial no interior.', 'Prefeitos e empresas', 'Ambientalistas', { eco: 4, cash: -3, img: -1 }),
    B('g-seg', '🚓', 'Integração das polícias estaduais', 'Comando único e inteligência compartilhada.', 'Bancada da segurança', 'Corporações que perdem autonomia', { seg: 4, cash: -2, cong: -1 }),
  ],
  dep_federal: [
    B('df-fundo', '🏛️', 'Fundo de desenvolvimento regional', 'Emenda para recursos do governo federal à sua região.', 'Prefeitos e lideranças locais', 'Equipe econômica', { cash: 1, pop: 3, cong: 1, img: -1 }),
    B('df-eleit', '🗳️', 'Reforma política', 'Muda regras de financiamento e coligação.', 'Imprensa e sociedade civil', 'Partidos grandes', { img: 3, cong: -2, pop: 1 }),
  ],
  senador: [
    B('s-federal', '🗺️', 'Pacto federativo e dívida dos estados', 'Renegocia a dívida dos estados com a União.', 'Governadores e a bancada regional', 'Equipe econômica', { cong: 2, pop: 2, cash: -2 }),
    B('s-defesa', '🎖️', 'Marco legal da indústria de defesa', 'Estimula empresas nacionais de material militar.', 'Forças Armadas e indústria', 'Quem teme gasto militar', { eco: 2, seg: 2, cash: -1, img: -1 }),
  ],
  presidente: [
    B('pr-ciencia', '🔬', 'Marco da ciência e inovação', 'Mais verba fixa para pesquisa e para parcerias com empresas.', 'Universidades e empresas de tecnologia', 'Equipe econômica', { eco: 3, img: 2, cash: -3 }, 3),
    B('pr-espaco', '🚀', 'Programa espacial nacional', 'Satélites próprios e base de lançamento.', 'Cientistas e as Forças Armadas', 'Quem prefere gastar com saúde', { eco: 2, img: 2, cash: -3 }),
  ],
}
const TIER = { vereador: 'mun', prefeito: 'mun', dep_estadual: 'est', governador: 'est', dep_federal: 'fed', senador: 'fed', presidente: 'fed' }
export const billTier = (office) => TIER[office] || 'fed'
// Projeto da pauta: varia por rodada, mas é o mesmo se abrir a votação duas vezes na mesma rodada.
export const billFor = (office, round = 0) => {
  const list = billsOf(office)
  return list[Math.abs(round) % list.length]
}
export const ALL_BILLS = [...Object.values(T).flat(), ...Object.values(X).flat()]
// Efeito final. stance 'pro' = você defende o projeto; 'con' = você tenta derrubar.
// passed = o projeto foi aprovado. Cada emenda negociada tira 25% do benefício do projeto.
const scale = (fx, k) => Object.fromEntries(Object.entries(fx).map(([s, v]) => [s, v > 0 ? Math.round(v * k) : v]).filter(([, v]) => v))
export const billOutcome = (bill, passed, concessions = 0, stance = 'pro') => {
  const k = Math.max(0.25, 1 - 0.25 * concessions)
  const out = {}
  const add = (fx) => { for (const [st, v] of Object.entries(fx)) if (v) out[st] = (out[st] || 0) + v }
  if (stance === 'pro') {
    if (passed) { add({ cong: 3, img: 1 }); add(scale(bill.win, k)) } else { add({ cong: -3, img: -1 }); add(bill.lose) }
  } else if (passed) {
    // você combateu e perdeu: o projeto passa mesmo assim, com metade do benefício para você
    add({ cong: -2, img: -1 }); add(scale(bill.win, k * 0.5))
  } else {
    // você derrubou: economiza o custo do projeto, mas perde a simpatia de quem queria
    add({ cong: 3 })
    for (const [st, v] of Object.entries(bill.win)) if (v < 0) add({ [st]: Math.ceil(-v / 2) })
    if (bill.win.pop > 0) add({ pop: -1 })
  }
  return out
}

// ---------- bancadas ----------
// Cada parlamentar pertence a uma bancada. O projeto mexe mais com uma delas.
export const BLOCS = {
  soc: { name: 'Bancada da saúde e educação', short: 'Saúde/Educ.', icon: '🩺' },
  seg: { name: 'Bancada da segurança', short: 'Segurança', icon: '🛡️' },
  eco: { name: 'Bancada econômica', short: 'Economia', icon: '📈' },
  pov: { name: 'Bancada popular', short: 'Popular', icon: '📣' },
}
const STAT_BLOC = { soc: 'soc', seg: 'seg', eco: 'eco', cash: 'eco', pop: 'pov', img: 'pov' }
export const billBloc = (bill) => {
  let best = 'pov'
  let top = -1
  for (const [st, v] of Object.entries(bill.win)) {
    if (Math.abs(v) > top && STAT_BLOC[st]) {
      top = Math.abs(v)
      best = STAT_BLOC[st]
    }
  }
  return best
}
// Apoio popular ao projeto (0 a 100), estável por projeto e rodada
export const billSupport = (bill, round = 0) => {
  const w = bill.win
  let s = 50 + (w.pop || 0) * 12 + (w.soc || 0) * 5 + (w.seg || 0) * 4 + (w.eco || 0) * 3 + (w.img || 0) * 2 + (w.cash < 0 ? 0 : 3)
  const h = [...bill.id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, round + 7)
  s += (h % 13) - 6
  return Math.max(12, Math.min(92, Math.round(s)))
}
// Efeito contínuo de uma lei em vigor: uma fração do benefício, por rodada
export const statuteFx = (bill, k = 1) => {
  const out = {}
  for (const [st, v] of Object.entries(bill.win)) {
    if (st === 'cong') continue
    const per = Math.sign(v) * Math.min(1, Math.abs(v) * 0.22 * k)
    if (Math.abs(per) >= 0.15) out[st] = Math.round(per * 10) / 10
  }
  return out
}
export const billById = (id) => ALL_BILLS.find((b) => b.id === id)
export const billsOf = (office) => [...T[billTier(office)], ...(X[office] || [])]
