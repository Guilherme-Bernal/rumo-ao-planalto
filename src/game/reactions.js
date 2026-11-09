// Repercussão da notícia: vozes de contatos e do rival, e como outros jornais tratam o assunto.
import { ROLES } from './contacts'

const pick = (R, a) => a[Math.floor(R() * a.length)]
const fill = (t, c) => t.replace(/\{(\w+)\}/g, (_, k) => c[k] ?? '')

// o que cada contato diz quando está a favor (up), contra (down) ou neutro (flat)
const Q = {
  aliado: {
    up: ['"Foi a decisão certa. Estamos juntos até o fim."', '"A bancada fecha com {who}. Sem dúvida."'],
    down: ['"Preciso de explicações antes da próxima votação."', '"Fui pego de surpresa. Não vou defender isso."'],
    flat: ['"Vamos esperar a poeira baixar para opinar."'],
  },
  jornalista: {
    up: ['"Não é todo dia que um político acerta assim."', '"Boa jogada, e dá para defender com números."'],
    down: ['"Difícil de explicar, e vamos cobrar."', '"A reportagem de amanhã vai ser dura."'],
    flat: ['"Um dia como outro qualquer no gabinete."'],
  },
  lider: {
    up: ['"O pessoal do bairro gostou. Pode contar com a gente."', '"Isso é o que a gente pede há anos."'],
    down: ['"A rua tá reclamando. Vai ter que explicar."', '"O povo se sentiu esquecido."'],
    flat: ['"Aqui na comunidade ninguém comentou muita coisa."'],
  },
  empresario: {
    up: ['"O setor respira aliviado. Boa decisão."', '"Ambiente de negócios agradece."'],
    down: ['"Isso espanta investidor. Preocupante."', '"Não é assim que se atrai capital."'],
    flat: ['"Mercado sem reação relevante."'],
  },
  religioso: {
    up: ['"A comunidade está em oração por você."', '"Isso agrada quem tem fé e valores."'],
    down: ['"Muitos fiéis ficaram decepcionados."', '"Uma decisão difícil de entender."'],
    flat: ['"Estamos em silêncio e observação."'],
  },
  familiar: {
    up: ['"Estou orgulhosa(o). Mas come direito, viu?"', '"Falei lá em casa: você ia acertar."'],
    down: ['"Meu filho, minha filha, será que era isso mesmo?"', '"Vi no jornal. Estou preocupada(o)."'],
    flat: ['"Liguei só para saber se você está bem."'],
  },
  emissora: {
    up: ['"Entrou na grade do telejornal de hoje, com destaque."', '"A audiência respondeu bem ao assunto."'],
    down: ['"Vai ser tema do nosso debate hoje à noite."', '"O telespectador não gostou, e liga pra reclamar."'],
    flat: ['"Material de segunda página, por enquanto."'],
  },
  editor: {
    up: ['"Editorial de amanhã vai ser favorável. Surpresa até para nós."', '"A pauta rendeu, e o leitor aprovou."'],
    down: ['"O editorial vai pesar. Estamos reunindo os documentos."', '"A pauta nos obriga a cobrar."'],
    flat: ['"Nota pequena, canto de página."'],
  },
}
const RIVAL = {
  up: ['"Jogada de marketing. O povo vai perceber."', '"Foi sorte. A conta chega depois."'],
  down: ['"Eu avisei: falta preparo."', '"O povo está vendo quem é {who}."'],
  flat: ['"Sem comentários. Por enquanto."'],
}
const OUTLETS = ['Folha da Tarde', 'Correio do Povo Livre', 'Gazeta Nacional', 'Tribuna da Capital', 'O Jornal da Esquina', 'Diário do Planalto']
const PRESS = {
  up: { fav: ['Decisão de {who} é elogiada por analistas.', '{who} acerta o passo e ganha respiro.'], crit: ['Para críticos, decisão de {who} tem cara de "jogada eleitoral".', 'Aplauso é barulhento, mas o custo ainda não foi apresentado.'] },
  down: { fav: ['Sem desespero: {who} diz que vai reverter o quadro.', 'Aliados pedem calma e dizem que "o jogo é longo".'], crit: ['Fiasco: decisão de {who} expõe fragilidade.', 'Erro de cálculo: {who} terá de explicar a conta.'] },
  flat: { fav: ['Gestão de {who} segue firme, dizem aliados.'], crit: ['Para analistas, {who} "empurra com a barriga".'] },
}

export function makeReactions({ who, tone, contacts = [] }, R) {
  const t = tone || 'flat'
  const ctx = { who }
  const flip = t === 'up' ? 'down' : t === 'down' ? 'up' : 'flat'
  const voices = [{ icon: '🗡️', name: 'Rival', role: 'Oposição', text: fill(pick(R, RIVAL[flip === 'flat' ? 'flat' : flip]), ctx) }]
  const pool = contacts.filter((c) => Q[c.role])
  const chosen = []
  while (chosen.length < 2 && pool.length) chosen.push(pool.splice(Math.floor(R() * pool.length), 1)[0])
  for (const c of chosen) {
    const v = c.rel >= 55 ? 'up' : c.rel <= 30 ? 'down' : t
    voices.push({ icon: ROLES[c.role].icon, name: c.name, role: ROLES[c.role].name, text: fill(pick(R, Q[c.role][v]), ctx) })
  }
  const outs = [...OUTLETS]
  const press = []
  for (const lean of ['fav', 'crit']) {
    const o = outs.splice(Math.floor(R() * outs.length), 1)[0]
    press.push({ outlet: o, lean: lean === 'fav' ? 'linha favorável' : 'linha crítica', text: fill(pick(R, PRESS[t][lean]), ctx) })
  }
  return { voices, press }
}