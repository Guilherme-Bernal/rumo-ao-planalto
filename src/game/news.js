// Gerador da capa do jornal: manchetes, subtítulos, notícias laterais e enquetes, tudo sorteado.
const pick = (R, a) => a[Math.floor(R() * a.length)]
// memória curta: evita repetir a mesma manchete ou nota lateral nas rodadas seguintes
const recent = []
const lembrar = (t, max) => { recent.push(t); while (recent.length > max) recent.shift() }
const pickNovo = (R, a, k = (x) => x) => {
  const livres = a.filter((x) => !recent.includes(k(x)))
  const v = pick(R, livres.length ? livres : a)
  lembrar(k(v), 70)
  return v
}
const fill = (t, c) => t.replace(/\{(\w+)\}/g, (_, k) => c[k] ?? '')

const OUTLETS = [
  ['Diário do Planalto', '🗞️'], ['Folha da Tarde', '📰'], ['O Jornal da Esquina', '🗞️'], ['Gazeta Nacional', '📜'],
  ['Correio do Povo Livre', '📰'], ['Estado do Brasil', '🗞️'], ['Tribuna da Capital', '📜'], ['Jornal do Fim de Semana', '📰'],
]

// Manchetes por assunto principal (a stat que mais mudou) e direção
const BY_STAT = {
  pop: {
    up: ['Multidão recebe {who} em {city} e a agenda estoura', '{who} vira assunto no café e no ônibus', '{who} lota praça e vira febre em {state}', 'Povo aprova: {who} dispara nas redes', 'Fila para tirar foto com {who} dá volta no quarteirão'],
    down: ['Moradores de {city} fecham rua para cobrar {who}', 'Pesquisa interna assusta o grupo de {who}', '{who} é vaiado(a) em evento público', 'Panelaço contra {who} ecoa em {city}', 'Aprovação de {who} derrete e preocupa aliados'],
  },
  cong: {
    up: ['{who} reúne líderes e destrava pauta travada', '{who} fecha acordo e garante maioria na Casa', 'Bastidores: {who} costura aliança improvável', 'Base aliada fecha com {who} em votação tranquila'],
    down: ['Líderes ameaçam trancar a pauta de {who}', 'Aliados abandonam {who} na hora da votação', 'Racha na base: {who} perde apoio no plenário', 'Parlamentares batem a porta na cara de {who}'],
  },
  eco: {
    up: ['Comércio de {city} volta a contratar e {who} sorri', 'Economia reage e {who} colhe os frutos', 'Indicadores melhoram e {who} faz festa', 'Empresários elogiam medidas de {who}'],
    down: ['Lojistas de {city} reclamam das vendas e cobram {who}', 'Mercado reage mal à decisão de {who}', 'Bolsa cai e dedo aponta para {who}', 'Preços sobem e {who} vira alvo de críticas'],
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
  flat: ['{who} despacha na manhã e almoça com aliados', 'Semana morna na agenda de {who}', '{who} segue agenda e analistas ficam divididos', 'Sem grandes novidades: {who} mantém o ritmo', 'Dia calmo para {who}, mas ninguém acredita'],
}

const DECK = {
  up: ['Dirigentes do partido elogiam a condução em reunião fechada.', 'O gabinete trabalha para manter o embalo.', 'Aliados já falam em "momento de ouro".', 'Até críticos reconhecem o bom resultado.', 'Assessores comemoram nos bastidores.', 'A oposição tenta minimizar, sem sucesso.'],
  down: ['Dirigentes do partido pedem reunião de emergência.', 'O gabinete admite erro de comunicação.', 'Aliados pedem cautela e um novo discurso.', 'A oposição já prepara o troco.', 'Assessores trabalham para apagar o incêndio.', 'Analistas dizem que o estrago pode ser passageiro.'],
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
  ['🤖', 'Startup de {state} cria assistente de IA para atender no posto de saúde.'],
  ['💻', 'Escolas de {city} ganham laboratório de programação para alunos do fundamental.'],
  ['🔋', 'Ônibus elétricos começam a rodar em {city} e conquistam passageiros.'],
  ['🛰️', 'Satélite brasileiro de monitoramento entra em órbita com sucesso.'],
  ['📡', 'Internet de fibra chega a bairros afastados de {city}.'],
  ['🔐', 'Vazamento de dados em órgão público acende alerta sobre segurança digital.'],
  ['🧬', 'Pesquisadores de {state} anunciam avanço em vacina contra dengue.'],
  ['🚗', 'Carros autônomos fazem teste nas ruas de uma capital e causam curiosidade.'],
  ['📦', 'Entrega por drone começa em bairro de {city} e divide moradores.'],
  ['💳', 'Pix passa de novo recorde de transações em um único dia.'],
  ['🌍', 'Cúpula internacional discute clima e o Brasil leva proposta de cooperação.'],
  ['🚢', 'Porto bate recorde de exportação e anima o setor agrícola.'],
  ['🛢️', 'Preço do petróleo sobe no exterior e pressiona o combustível no posto.'],
  ['💶', 'Acordo comercial entre blocos econômicos preocupa e anima setores diferentes.'],
  ['🕊️', 'Diplomatas se reúnem para tentar negociar fim de conflito no exterior.'],
  ['🌾', 'Seca em outro continente encarece o trigo no mercado internacional.'],
  ['🏭', 'Fábrica nova vai abrir 800 vagas em {state}.'],
  ['🧑‍🌾', 'Feira de agricultura familiar movimenta o centro de {city} no fim de semana.'],
  ['🏊', 'Atleta de {state} conquista medalha em campeonato sul-americano.'],
  ['🏀', 'Jogo de basquete lota o ginásio e emociona a torcida de {city}.'],
  ['🎬', 'Filme brasileiro é aplaudido de pé em festival internacional.'],
  ['📚', 'Biblioteca de {city} amplia horário e vira ponto de encontro dos jovens.'],
  ['🚴', 'Ciclovia nova divide opiniões entre ciclistas e motoristas.'],
  ['🌳', 'Moradores plantam mil árvores em mutirão de fim de semana.'],
  ['🔥', 'Queimadas deixam o ar seco e cobram resposta das autoridades.'],
  ['🌊', 'Maré alta alaga orla e preocupa moradores do litoral.'],
  ['🧯', 'Incêndio em depósito mobiliza bombeiros por horas em {city}.'],
  ['🚑', 'Fila no pronto-socorro de {city} vira tema de debate nas redes.'],
  ['💉', 'Campanha de vacinação contra gripe começa com procura acima do esperado.'],
  ['👵', 'Idosa de {city} completa 100 anos e recebe visita de autoridades.'],
  ['🎓', 'Universidade abre mais vagas e aumenta a procura de vestibulandos.'],
  ['🧑‍⚕️', 'Médicos pedem reajuste e ameaçam paralisação na rede pública.'],
  ['🛒', 'Cesta básica fica mais cara e pesa no bolso de quem ganha menos.'],
  ['🏠', 'Aluguel sobe acima da inflação e vira assunto de roda de conversa.'],
  ['🏗️', 'Mutirão de moradia entrega casas a 120 famílias em {state}.'],
  ['🚆', 'Trem de passageiros volta a circular em trecho abandonado há anos.'],
  ['⛽', 'Posto vende combustível adulterado e fiscalização interdita o local.'],
  ['🎤', 'Candidato de {party} faz comício relâmpago e causa trânsito no centro.'],
  ['📊', 'Instituto divulga pesquisa de opinião e a margem de erro vira polêmica.'],
  ['🗞️', 'Jornalista publica série sobre contratos públicos e agita os bastidores.'],
  ['⚖️', 'Tribunal marca julgamento que pode mudar regra de uma lei importante.'],
  ['🕯️', 'Cidade faz homenagem a vítimas de tragédia ocorrida há dez anos.'],
  ['🎄', 'Comércio de {city} aposta em liquidação para recuperar o fôlego.'],
  ['☔', 'Guarda-chuva vira o item mais vendido da semana em {city}.'],
  ['📞', 'Operadora fica fora do ar e deixa milhares sem sinal por uma tarde.'],
  ['🛴', 'Patinetes elétricos viram problema nas calçadas de {city}.'],
  ['🐝', 'Apicultores de {state} comemoram produção recorde de mel.'],
  ['🍇', 'Colheita antecipada surpreende produtores de uva da região.'],
  ['🎙️', 'Podcast local sobre política vira febre e entrevista até o rival de {party}.'],
  ['🏟️', 'Estádio reformado reabre e promete show de inauguração.'],
]

const CARTOONS = [
  'Charge do dia: o orçamento, o cobertor curto e o pé de fora.',
  'Charge do dia: o assessor jura que o sinal da internet caiu na hora do escândalo.',
  'Charge do dia: reunião de alinhamento que não alinhou nada.',
  'Charge do dia: a urna, o eleitor e o santinho no chão.',
  'Charge do dia: o robô que prometeu resolver tudo e pediu aumento.',
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
  if (!top || Math.abs(top[1]) < 2) head = pickNovo(R, BY_STAT.flat)
  else {
    const dir = top[1] > 0 ? 'up' : 'down'
    // para o caixa, sinal já é o do efeito; para os outros também
    head = pickNovo(R, BY_STAT[top[0]][dir])
  }
  const c = { ...ctx }
  const sideCount = 3
  const pool = [...SIDE]
  const side = []
  for (let i = 0; i < sideCount; i++) {
    const novo = pickNovo(R, pool, (x) => x[1])
    pool.splice(pool.indexOf(novo), 1)
    side.push({ icon: novo[0], text: fill(novo[1], c) })
  }
  const approval = Math.round(ctx.pop ?? 50)
  return {
    outlet,
    icon,
    date: edition(R, ctx.total || 0),
    tone,
    headline: fill(head, c),
    deck: pickNovo(R, DECK[tone]),
    side,
    cartoon: pickNovo(R, CARTOONS),
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