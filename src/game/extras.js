// Extras de retenção: sorteio com semente (desafio do dia), conquistas, hall da fama, manchetes e rivais.

export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const todaySeed = () => {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

const store = {
  get(k, def) {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? def
    } catch {
      return def
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v))
    } catch {}
  },
}

export const loadUnlocked = () => store.get('rumo-trofeus', [])
export const saveUnlocked = (v) => store.set('rumo-trofeus', v)
export const loadHall = () => store.get('rumo-hall', [])

export function addHall(entry) {
  const h = loadHall()
  h.push(entry)
  h.sort((a, b) => b.points - a.points)
  const top = h.slice(0, 10)
  store.set('rumo-hall', top)
  return top.indexOf(entry)
}

const last = (g) => g.history[g.history.length - 1]

export const ACHIEVEMENTS = [
  { id: 'primeiro_voto', icon: '🗳️', name: 'Primeira vitória', desc: 'Vença uma eleição.', test: (g) => g.history.length >= 1 },
  { id: 'governo', icon: '🏰', name: 'Dono do Palácio', desc: 'Chegue a governador(a).', test: (g) => g.history.length >= 2 },
  { id: 'planalto', icon: '🇧🇷', name: 'Rumo ao Planalto', desc: 'Seja eleito(a) presidente.', test: (g) => g.history.length >= 3 },
  { id: 'reeleito', icon: '🔁', name: 'Mais quatro anos', desc: 'Vença a reeleição.', test: (g) => g.history.length >= 4 },
  { id: 'estadista', icon: '⭐', name: 'Estadista', desc: 'Termine o governo com o título de Estadista.', test: (g) => g.legacy && g.legacy.title === 'Estadista' },
  { id: 'limpo', icon: '🧼', name: 'Ficha limpa', desc: 'Termine os dois mandatos com imagem 70 ou mais.', test: (g) => g.phase === 'end' && g.stats.img >= 70 },
  { id: 'popstar', icon: '🎤', name: 'Popstar', desc: 'Chegue a 90 de popularidade.', test: (g) => g.stats.pop >= 90 },
  { id: 'cofre', icon: '🐷', name: 'Cofre cheio', desc: 'Chegue a 90 de caixa.', test: (g) => g.stats.cash >= 90 },
  { id: 'sufoco', icon: '😅', name: 'No sufoco', desc: 'Vença uma eleição com menos de 52%.', test: (g) => last(g) && last(g).share < 52 },
  { id: 'lavada', icon: '🔥', name: 'Lavada nas urnas', desc: 'Vença uma eleição com 65% ou mais.', test: (g) => last(g) && last(g).share >= 65 },
  { id: 'fiscal', icon: '🔎', name: 'Olho vivo', desc: 'Fiscalize 8 vezes na carreira.', test: (g) => g.poder && g.poder.cnt && Object.entries(g.poder.cnt).filter(([k]) => k.endsWith(':fisc')).reduce((a, [, v]) => a + v, 0) >= 8 },
  { id: 'cpi_ok', icon: '🕵️', name: 'Comissão que deu certo', desc: 'Faça uma CPI encontrar irregularidades.', test: (g) => g.poder && g.poder.cnt && Object.keys(g.poder.cnt).some((k) => k.endsWith(':cpiok')) },
  { id: 'consulta', icon: '🗳️', name: 'A voz do povo', desc: 'Vença uma consulta popular.', test: (g) => g.poder && g.poder.cnt && Object.keys(g.poder.cnt).some((k) => k.endsWith(':consulta')) },
  { id: 'arquivado', icon: '🧯', name: 'Arquivado', desc: 'Veja um inquérito contra você ser arquivado.', test: (g) => g.poder && g.poder.cnt && Object.keys(g.poder.cnt).some((k) => k.endsWith(':arq')) },
  { id: 'educador', icon: '🎓', name: 'Pátria educadora', desc: 'Leve o índice de educação a 75.', test: (g) => g.poder && g.poder.edu >= 75 },
  { id: 'cientista', icon: '🧪', name: 'País da ciência', desc: 'Chegue a 4 de investimento em pesquisa.', test: (g) => g.poder && g.poder.cien >= 4 },
  { id: 'democracia', icon: '🛡️', name: 'A democracia resiste', desc: 'Desarme uma conspiração ou frustre um golpe.', test: (g) => g.poder && g.poder.cnt && Object.keys(g.poder.cnt).some((k) => k.endsWith(':plotok') || k.endsWith(':golpefail')) },
  { id: 'pazcivil', icon: '🕊️', name: 'Pacto de paz', desc: 'Encerre uma guerra civil com um pacto.', test: (g) => g.poder && g.poder.cnt && Object.keys(g.poder.cnt).some((k) => k.endsWith(':paz')) },
  { id: 'golpe', icon: '🪖', name: 'Fim da linha', desc: 'Seja deposto(a) por um golpe de Estado.', test: (g) => g.over && g.over.title === 'Golpe de Estado' },
  { id: 'impeach', icon: '📉', name: 'Tchau, querida', desc: 'Sofra um impeachment.', test: (g) => g.over && g.over.title === 'Impeachment' },
  { id: 'maquiavel', icon: '🦊', name: 'Maquiavel de plantão', desc: 'Faça 5 escolhas que arranham sua imagem.', test: (g) => g.dirty >= 5 },
  { id: 'convidado', icon: '✉️', name: 'Muito requisitado(a)', desc: 'Receba 3 convites de partidos na mesma carreira.', test: (g) => g.invitesTotal >= 3 },
  { id: 'palavra', icon: '🤝', name: 'Palavra cumprida', desc: 'Cumpra todas as promessas do plano de governo em um mandato.', test: (g) => g.keptAll >= 1 },
  { id: 'casaca', icon: '🧥', name: 'Vira-casaca', desc: 'Troque de partido 2 vezes ou mais.', test: (g) => g.switches >= 2 },
  { id: 'interior', icon: '🌾', name: 'Do interior ao Planalto', desc: 'Seja eleito(a) presidente começando em cidade pequena.', test: (g) => g.city && g.city.size === 'pequena' && g.history.length >= 3 },
  { id: 'diario', icon: '📅', name: 'Desafio do dia', desc: 'Complete o desafio do dia até o fim.', test: (g) => g.daily && g.phase === 'end' },
]

const RIVALS = [
  'Dr. Wellington "Tio Wel" Ferraz',
  'Osvaldo "o Engenheiro" Prado',
  'Mariângela "a Guerreira" Lopes',
  'Clóvis "Seu Clóvis" Menezes',
  'Dayane "a Professora" Cardoso',
  'Raimundo "Xerife" Albuquerque',
  'Valdirene "Dona Val" Siqueira',
  'Hélio "o Doutor" Bastos',
  'Cleide "a Faxineira" Moura',
  'Edson "Mestre" Tavares',
]

export const makeRival = (R) => RIVALS[Math.floor(R() * RIVALS.length)]

const OUTLETS = ['Diário do Planalto', 'Portal Fato Real', 'Rádio Capital AM', 'O Jornal da Esquina', 'Folha da Tarde', 'Canal Notícia 24h']

export function makeHeadline(who, state, fx, R) {
  const pick = (a) => a[Math.floor(R() * a.length)]
  const score = (fx.pop || 0) + (fx.img || 0) * 0.6
  let list, icon
  if (score >= 6) {
    icon = '📈'
    list = [`${who} dispara nas redes após decisão`, `Decisão de ${who} vira assunto no país e agrada`, `${who} sobe nas pesquisas em ${state}`]
  } else if (score >= 2) {
    icon = '📰'
    list = [`${who} agrada e ganha pontos em ${state}`, `Decisão de ${who} é bem recebida nos bastidores`]
  } else if (score > -2) {
    icon = '📰'
    list = [`${who} segue agenda sem grandes novidades`, `${who} toma decisão e analistas ficam divididos`]
  } else if (score > -6) {
    icon = '📉'
    list = [`${who} divide opiniões em ${state}`, `Decisão de ${who} gera críticas nos bastidores`]
  } else {
    icon = '🔥'
    list = [`${who} vira alvo de panelaço virtual`, `Oposição pede explicações a ${who}`, `${who} enfrenta onda de críticas após decisão`]
  }
  return `${icon} ${pick(OUTLETS)}: ${pick(list)}`
}
const T = ['Dr.', 'Dra.', 'Seu', 'Dona', 'Prof.', 'Cabo', 'Pastor', 'Mestre', 'Tia', 'Tio', '']
const F = ['Marina', 'Zé', 'Ricardo', 'Cláudia', 'Antônio', 'Luciana', 'Bruno', 'Fátima', 'Sérgio', 'Aline', 'Toninho', 'Rosângela', 'Wagner', 'Patrícia', 'Neto', 'Joana']
const N = ['do Pastel', 'da Feira', 'do Bairro', 'da Saúde', 'Contador', 'Motoboy', 'da Padaria', 'do Povo', 'Faz-Tudo', 'da Escola', 'do Caminhão', 'Xerife', 'Sorriso', 'da Esperança', 'Silva', 'Souza']
export function randomName(r = Math.random) {
  const p = (a) => a[Math.floor(r() * a.length)]
  return `${p(T)} ${p(F)} ${p(N)}`.trim()
}