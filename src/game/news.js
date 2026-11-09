// Gerador da capa do jornal: manchetes, subtítulos, notícias laterais e enquetes, tudo sorteado.
const pick = (R, a) => a[Math.floor(R() * a.length)]
const fill = (t, c) => t.replace(/\{(\w+)\}/g, (_, k) => c[k] ?? '')

const OUTLETS = [
  ['Diário do Planalto', '🗞️'], ['Folha da Tarde', '📰'], ['O Jornal da Esquina', '🗞️'], ['Gazeta Nacional', '📜'],
  ['Correio do Povo Livre', '📰'], ['Estado do Brasil', '🗞️'], ['Tribuna da Capital', '📜'], ['Jornal do Fim de Semana', '📰'],
]

// Manchetes por assunto principal (a stat que mais mudou) e direção
const BY_STAT = {
  pop: {
    up: ['{who} lota praça e vira febre em {state}', 'Povo aprova: {who} dispara nas redes', 'Fila para tirar foto com {who} dá volta no quarteirão'],
    down: ['{who} é vaiado(a) em evento público', 'Panelaço contra {who} ecoa em {city}', 'Aprovação de {who} derrete e preocupa aliados'],
  },
  cong: {
    up: ['{who} fecha acordo e garante maioria na Casa', 'Bastidores: {who} costura aliança improvável', 'Base aliada fecha com {who} em votação tranquila'],
    down: ['Aliados abandonam {who} na hora da votação', 'Racha na base: {who} perde apoio no plenário', 'Parlamentares batem a porta na cara de {who}'],
  },
  eco: {
    up: ['Economia reage e {who} colhe os frutos', 'Indicadores melhoram e {who} faz festa', 'Empresários elogiam medidas de {who}'],
    down: ['Mercado reage mal à decisão de {who}', 'Bolsa cai e dedo aponta para {who}', 'Preços sobem e {who} vira alvo de críticas'],
  },
  cash: {
    up: ['Cofres cheios: gestão de {who} surpreende', 'Superávit inesperado alivia governo de {who}'],
    down: ['Rombo no caixa preocupa equipe de {who}', 'Contas apertadas: {who} vai ter que cortar', 'Tesouraria acende alerta vermelho'],
  },
  soc: {
    up: ['Posto de saúde novo vira vitrine de {who}', 'Escolas melhoram e {who} leva os aplausos', 'Filas no hospital diminuem sob {who}'],
    down: ['Falta de médicos expõe falha de {who}', 'Escola sem merenda: pais cobram {who}', 'Saúde em crise: {who} é pressionado(a)'],
  },
  seg: {
    up: ['Crimes caem e {who} comemora', 'Segurança reforçada anima moradores de {city}', 'Polícia nas ruas: {who} promete manter o ritmo'],
    down: ['Onda de crimes assusta {city} e cobra {who}', 'Insegurança vira tema número 1 contra {who}', 'Moradores pedem socorro e criticam {who}'],
  },
  img: {
    up: ['{who} bate recorde de credibilidade', 'Transparência rende elogios a {who}', 'Pesquisa: {who} é o(a) mais confiável da praça'],
    down: ['Denúncia coloca {who} na berlinda', 'Escândalo na porta de {who}: "tudo mentira", diz assessoria', 'Oposição pede CPI e mira {who}'],
  },
  flat: ['{who} segue agenda e analistas ficam divididos', 'Sem grandes novidades: {who} mantém o ritmo', 'Dia calmo para {who}, mas ninguém acredita'],
}

const DECK = {
  up: ['Aliados já falam em "momento de ouro".', 'Até críticos reconhecem o bom resultado.', 'Assessores comemoram nos bastidores.', 'A oposição tenta minimizar, sem sucesso.'],
  down: ['Aliados pedem cautela e um novo discurso.', 'A oposição já prepara o troco.', 'Assessores trabalham para apagar o incêndio.', 'Analistas dizem que o estrago pode ser passageiro.'],
  flat: ['Bastidores seguem tensos, mas sem novidade oficial.', 'Cientistas políticos pedem calma.'],
}

const SIDE = [
  ['⚽', 'Time local vence clássico e a cidade fecha o comércio mais cedo.'],
  ['🌧️', 'Previsão: semana de chuva forte em boa parte do país.'],
  ['📺', 'Novela das nove bate recorde de audiência com final polêmico.'],
  ['🥖', 'Preço do pãozinho vira assunto de roda de conversa.'],
  ['🚌', 'Greve de ônibus deixa trabalhadores a pé em {city}.'],
  ['🎤', 'Festival de música lota o estádio e agita o comércio.'],
  ['🏥', 'Mutirão de vacinação passa da meta em {state}.'],
  ['💸', 'Dólar oscila e analistas não chegam a acordo.'],
  ['🌽', 'Safra recorde anima produtores do interior.'],
  ['🏛️', '{rival} diz que "o povo está acordando" e promete surpresas.'],
  ['🗳️', 'Partido {party} realiza convenção com muitos discursos e pouca novidade.'],
  ['🔦', 'Apagão deixa bairros no escuro por duas horas em {city}.'],
  ['🐶', 'Cachorro caramelo vira prefeito honorário de cidade vizinha.'],
  ['🎓', 'Alunos de {state} vão bem em olimpíada de matemática.'],
  ['🚧', 'Obra que prometia acabar "em seis meses" completa três anos.'],
  ['🍕', 'Pizzaria de {city} é eleita a melhor do estado pelo quinto ano seguido.'],
  ['📱', 'Aplicativo do governo sai do ar durante o horário de pico.'],
  ['🌡️', 'Onda de calor bate recorde histórico no verão.'],
  ['🛫', 'Voos atrasam e aeroportos viram dormitório improvisado.'],
  ['🎭', 'Teatro municipal reabre depois de reforma de dez anos.'],
]

const CARTOONS = [
  'Charge do dia: o eleitor, a promessa e o troco de R$ 0,05.',
  'Charge do dia: político tenta explicar o inexplicável.',
  'Charge do dia: o gabinete, a cafeteira e a CPI.',
  'Charge do dia: a fila do posto, só que gigante.',
  'Charge do dia: "promessa é dívida" - e o devedor sumiu.',
]

function edition(R, total) {
  const year = 2027 + Math.floor(total / 2)
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const m = (total % 2) * 6 + Math.floor(R() * 6)
  return `${1 + Math.floor(R() * 28)} de ${months[m]} de ${year}`
}

// ctx: { who, state, city, party, rival, office, fx, total }
export function makeNews(ctx, R) {
  const [outlet, icon] = pick(R, OUTLETS)
  const fx = ctx.fx || {}
  const entries = Object.entries(fx).filter(([k]) => k !== 'cash' || Math.abs(fx.cash) >= 6)
  const sorted = entries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const top = sorted[0]
  const score = (fx.pop || 0) + (fx.img || 0) * 0.6 + (fx.eco || 0) * 0.3
  const tone = score >= 2 ? 'up' : score <= -2 ? 'down' : 'flat'
  let head
  if (!top || Math.abs(top[1]) < 2) head = pick(R, BY_STAT.flat)
  else {
    const dir = top[1] > 0 ? 'up' : 'down'
    // para o caixa, sinal já é o do efeito; para os outros também
    head = pick(R, BY_STAT[top[0]][dir])
  }
  const c = { ...ctx }
  const sideCount = 3
  const pool = [...SIDE]
  const side = []
  for (let i = 0; i < sideCount; i++) {
    const [ic, t] = pool.splice(Math.floor(R() * pool.length), 1)[0]
    side.push({ icon: ic, text: fill(t, c) })
  }
  const approval = Math.round(ctx.pop ?? 50)
  return {
    outlet,
    icon,
    date: edition(R, ctx.total || 0),
    tone,
    headline: fill(head, c),
    deck: pick(R, DECK[tone]),
    side,
    cartoon: pick(R, CARTOONS),
    pollLine: `Aprovação: ${approval}%`,
  }
}

// Capa especial para eleições e fim de mandato
export function makeSpecial(kind, ctx, R) {
  const [outlet, icon] = pick(R, OUTLETS)
  const c = { ...ctx }
  const H = {
    win: ['{who} é eleito(a) {office}!', 'Urnas decidem: {who} será {office}', 'Vitória de {who} muda o mapa político', '{who} vence {rival} e conquista {office}'],
    winTight: ['{who} vence na foto e é eleito(a) {office}', 'Apuração emocionante: {who} passa {rival} no final'],
    winBig: ['Lavada: {who} atropela {rival} e é {office}', 'Avalanche de votos leva {who} a {office}'],
    lose: ['{rival} vence e {who} fica pelo caminho', 'Derrota: {who} não consegue ser {office}', 'Urnas dizem não: fim da linha para {who}?'],
  }
  const w = ctx.won
  const key = w ? (ctx.share >= 62 ? 'winBig' : ctx.share < 52 ? 'winTight' : 'win') : 'lose'
  return {
    outlet,
    icon,
    date: edition(R, ctx.total || 0),
    tone: w ? 'up' : 'down',
    headline: fill(pick(R, H[key]), c),
    deck: w ? `${ctx.share.toFixed(1)}% dos votos válidos. ${pick(R, DECK.up)}` : `${ctx.share.toFixed(1)}% dos votos válidos. ${pick(R, DECK.down)}`,
    side: [...SIDE].sort(() => R() - 0.5).slice(0, 3).map(([ic, t]) => ({ icon: ic, text: fill(t, c) })),
    cartoon: pick(R, CARTOONS),
    pollLine: `Resultado: ${ctx.share.toFixed(1)}%`,
  }
}