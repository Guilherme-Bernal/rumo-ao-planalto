// Redes sociais, calendário e rotina de cada cargo. Tudo fictício.
const pick = (R, a) => a[Math.floor(R() * a.length)]
const fill = (t, c) => t.replace(/\{(\w+)\}/g, (_, k) => c[k] ?? '')

export const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export const MONTHS_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
export const START_YEAR = 2027

export const fmtMonth = (abs) => `${MONTHS[abs % 12]}/${START_YEAR + Math.floor(abs / 12)}`
export const monthName = (abs) => MONTHS[abs % 12]

const HOLIDAY = { 0: '🏖️ Recesso', 1: '🎭 Carnaval', 3: '🇧🇷 Tiradentes', 5: '🎆 Festa junina', 6: '🏖️ Recesso', 8: '🇧🇷 Sete de Setembro', 10: '🕯️ Finados', 11: '🎄 Natal' }
export const holidayOf = (abs) => HOLIDAY[abs % 12] || ''

export const ACTION_ICON = { rodar: '🤝', bancada: '☕', social: '🩺', seguranca: '🛡️', economia: '🏗️', midia: '📣', cortar: '✂️', transparencia: '🔍', mutirao: '🧱', audiencia: '🗣️', agendaBr: '🏛️', projeto: '📜', obraestado: '🚧', interior: '🚌', diplomacia: '✈️', comicio: '🎤', ligar: '📞' }

// Rotina dos meses sem compromisso, por cargo
export const DAY_FLAVOR = [
  [
    'Sessão na Câmara Municipal: aprovado o projeto da poda de árvores.',
    'Você visita a escola do bairro e vira personagem de redação.',
    'Audiência pública sobre o transporte de {cidade} termina em bate-boca.',
    'Reunião de comissão: três horas de debate sobre o horário do lixo.',
    'Você inaugura uma lombada e recebe aplausos de quem mora perto.',
    'Sessão solene homenageia o centenário da padaria mais antiga de {cidade}.',
    'Moradores te param no mercado para falar de buraco, esgoto e futebol.',
    'O prefeito liga pedindo apoio. Você pede uma reunião antes.',
  ],
  [
    'Votação no plenário: a sessão vai até as 2 da manhã.',
    'Comissão ouve ministro e a transmissão da TV Câmara bomba por dois minutos.',
    'Viagem a {estado} para ouvir lideranças e comer o pastel local.',
    'Você relata um projeto e a oposição apresenta 40 emendas.',
    'Sessão esvaziada: quarta-feira em Brasília é sinônimo de quórum baixo.',
    'Café da manhã com a bancada e promessa de "vamos construir juntos".',
    'Discurso na tribuna rende corte de 15 segundos nas redes.',
    'CPI convoca depoentes e o cafezinho do corredor ferve de fofoca.',
  ],
  [
    'Você inaugura uma obra em {cidade} com banda, fita e discurso longo.',
    'Reunião de secretariado: o assunto da pauta é o orçamento do próximo ano.',
    'Visita à Assembleia Legislativa: votação apertada de um projeto seu.',
    'Entrevista na rádio de {estado} e uma ouvinte liga pedindo o asfalto da rua dela.',
    'Evento com prefeitos do interior: todo mundo pede verba.',
    'Cerimônia de formatura da Polícia Militar no Palácio.',
    'Safra de {estado} bate recorde e a foto com o trator é obrigatória.',
    'Cúpula de governadores: foto oficial e almoço de três horas.',
  ],
  [
    'Reunião ministerial vai até a madrugada e termina em nota de rodapé.',
    'Viagem oficial ao exterior: o avião é novo, a comitiva é gigante.',
    'Cerimônia no Planalto com presença de ministros e muita bandeira.',
    'Pronunciamento em rede nacional, tela dividida em 40 memes.',
    'Reunião com líderes do Congresso: café, bolo e muita pressão.',
    'Cúpula internacional: apertos de mão e cafezinho diplomático.',
    'Visita a {estado} para entregar moradias, com chuva e muitas selfies.',
    'Briefing de crise às 6 da manhã. O café quase não cabe na mesa.',
  ],
]

// Redes sociais fictícias
const HANDLES = ['@tiaDoZap', '@carlinhos_dev', '@proffaBia', '@motoboyDoBem', '@xerifeDaInternet', '@vovoVitor', '@mari.cozinha', '@fiscalDoPovo', '@jornalista_zeca', '@estudante_fe', '@padaria_do_ze', '@cinefilo_tiago', '@dona_neide_oficial', '@torcedor_roxo', '@zequinha_99', '@analista_politica']
const POSTS = {
  up: [
    '{who} mandou bem hoje, não tem o que reclamar 👏',
    'Finalmente alguém que aparece e resolve. #{tag}',
    'Meu tio que odeia político elogiou {who}. Fim dos tempos.',
    'Em {city}, o povo comenta bem de {who}. Raridade.',
    'Gostei! Agora quero ver manter o ritmo 👀',
    'Votei com o pé atrás, mas {who} está me convencendo.',
  ],
  down: [
    '{who} de novo? Pelo amor de Deus 🙄',
    'Cadê o que prometeu, {who}? #{tag}',
    'Em {city}, ninguém entendeu a decisão de {who}.',
    'Tem coisa errada nessa história e vou contar o que sei.',
    '{who} virou meme, mas não pelos motivos certos 😬',
    'Passei a manhã na fila e lembrei de {who}. Coincidência?',
  ],
  flat: [
    'Alguém explica o que {who} fez hoje?',
    'Debate no busão sobre {who}: metade a favor, metade contra.',
    'Política é tipo futebol: todo mundo opina e ninguém entende a regra.',
    '{rival} diz que vai virar o jogo. Veremos. #{tag}',
    'Acompanhando com pipoca o que rola em {city}. 🍿',
  ],
  meme: [
    'pov: você tentando explicar política pra sua avó 🫠',
    'plano de governo de político: 10 páginas. cumprimento: 1 parágrafo.',
    'o pão subiu, o dólar subiu, só o meu salário ficou de castigo',
    'promessa de campanha é igual dieta de segunda-feira',
  ],
}

export function makePost(R, ctx) {
  const tone = ctx.tone || 'flat'
  const bank = R() < 0.18 ? POSTS.meme : POSTS[tone] || POSTS.flat
  const scale = [60, 800, 6000, 40000][ctx.stage || 0]
  return {
    id: Math.random().toString(36).slice(2),
    user: pick(R, HANDLES),
    text: fill(pick(R, bank), ctx),
    likes: Math.round(8 + R() * R() * scale * (tone === 'flat' ? 0.5 : 1)),
    tone,
  }
}

export const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '')

export const GENERIC_TAGS = [
  ['#OrçamentoDoPovo', 0.7], ['#FilaDoPosto', 0.6], ['#PãoComMortadela', 0.5], ['#CPI', 0.8], ['#BomDiaPolítico', 0.4], ['#Eleições', 0.9], ['#Promessa', 0.5],
]

export const fmtNum = (n) => (n >= 1e6 ? `${(n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi` : n >= 1e3 ? `${(n / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil` : String(Math.round(n)))

// nomes de candidatos com concordância de gênero
const CF = ['Marina', 'Cláudia', 'Luciana', 'Fátima', 'Aline', 'Rosângela', 'Patrícia', 'Joana', 'Neide', 'Valéria']
const CM = ['Zé', 'Ricardo', 'Antônio', 'Bruno', 'Sérgio', 'Toninho', 'Wagner', 'Neto', 'Edson', 'Márcio']
const CN = ['da Padaria', 'do Povo', 'da Saúde', 'da Esperança', 'Silva', 'Souza', 'do Bairro', 'da Escola', 'Motorista', 'da Feira', 'Contador(a)', 'Sorriso']
export function candName(R) {
  const f = R() < 0.5
  const t = f ? ['Dra.', 'Dona', 'Prof.', 'Tia', ''] : ['Dr.', 'Seu', 'Prof.', 'Cabo', 'Pastor', 'Tio', '']
  const n = pick(R, CN).replace('(a)', f ? 'a' : '')
  return `${pick(R, t)} ${pick(R, f ? CF : CM)} ${n}`.trim()
}