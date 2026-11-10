// BLOCO 30: finais múltiplos. A carreira termina de um jeito diferente conforme o que você fez e como terminou.
// Cada final tem um epílogo próprio. A galeria de finais já vistos fica guardada no navegador.

const KEY = 'rumo-finais'
export const loadFinais = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
export function saveFinal(id) {
  const v = loadFinais()
  if (!v.includes(id)) {
    v.push(id)
    try {
      localStorage.setItem(KEY, JSON.stringify(v))
    } catch {}
  }
}

const avg = (s) => (s.pop + s.eco + s.soc + s.seg + s.img) / 5
const casa = (g) => (g.city && g.city.name) || (g.region && g.region.name) || 'sua cidade'
const rv = (g) => (g.poder && g.poder.rv) || null
const rvNome = (g) => (rv(g) && rv(g).nome) || g.rival || 'o antigo rival'
const marcos = (g) => ((g.poder && g.poder.bio && g.poder.bio.marcos) || []).length
const sucesso = (g) => g.poder && g.poder.sucessao && g.poder.sucessao.fim

// ordem = prioridade (o primeiro que servir vale). "dica" aparece na galeria enquanto o final não foi visto.
export const FINAIS = [
  {
    id: 'exilio', icon: '🧳', nome: 'Exílio', dica: 'Seja derrubado(a) e saia do país com a imagem arruinada.',
    test: (g) => g.over && ['Golpe de Estado', 'Impeachment', 'Cassação', 'Crise institucional', 'Guerra civil'].includes(g.over.title) && (g.stats.img < 40 || (rv(g) && rv(g).odio >= 60)),
    linhas: (g) => [
      `Na madrugada seguinte, ${g.name} embarcou num voo sem alarde. O passaporte foi o único documento que ninguém pediu para revisar.`,
      `Do exílio, escreveu cartas que poucos leram e deu entrevistas que muitos distorceram. Em ${casa(g)}, o nome virou assunto de domingo em família.`,
      'Uma década depois, historiadores disputam se foi vítima, culpado(a) ou as duas coisas ao mesmo tempo.',
    ],
  },
  {
    id: 'vingado', icon: '🪞', nome: 'O rival escreveu a história', dica: 'Perca para o mesmo rival duas ou mais vezes ao longo da carreira.',
    test: (g) => g.over && g.over.title !== 'Golpe de Estado' && rv(g) && rv(g).vit >= 2,
    linhas: (g) => [
      `${rvNome(g)} derrotou ${g.name} mais de uma vez e foi quem ficou com a última palavra.`,
      `Nas memórias dele, ${g.name} aparece como "o adversário que me ensinou a ganhar". É o tipo de elogio que dói mais do que um insulto.`,
    ],
  },
  {
    id: 'oposicao', icon: '📢', nome: 'Líder da oposição', dica: 'Chegue à presidência, perca a reeleição e volte como voz da oposição.',
    test: (g) => g.over && g.over.title === 'Derrota nas urnas' && g.history.length >= 3,
    linhas: (g) => [
      `Derrotado(a) na reeleição, ${g.name} não voltou para casa. Montou um gabinete paralelo e virou a voz mais ouvida da oposição.`,
      'A cada medida do novo governo, uma nota, uma entrevista, uma crítica. A política perdoa derrota, mas não perdoa silêncio.',
    ],
  },
  {
    id: 'interior', icon: '🌾', nome: 'Volta ao interior', dica: 'Termine a carreira cedo, ainda nos primeiros cargos.',
    test: (g) => g.over && g.history.length <= 1,
    linhas: (g) => [
      `${g.name} voltou para ${casa(g)} e retomou a vida que tinha antes da política. A porta da casa tem agora um cartaz de campanha desbotado, que ninguém quis tirar.`,
      'Nas rodas de conversa, ainda aparece quem pergunte se vai tentar de novo. A resposta varia conforme o dia e o café.',
    ],
  },
  {
    id: 'ministro', icon: '🎩', nome: 'Ministro(a) do sucessor', dica: 'Transmita a faixa a um sucessor eleito e aceite trabalhar com ele.',
    test: (g) => g.phase === 'end' && sucesso(g) && sucesso(g).won,
    linhas: (g) => [
      `O sucessor, ${g.poder.sucessao.nome}, convidou ${g.name} para uma pasta no novo governo. A transição virou exemplo de continuidade.`,
      'Os dois nem sempre concordavam, mas a conversa nunca acabou em ruptura. Para uma política tão dada a rachaduras, já foi um feito.',
    ],
  },
  {
    id: 'aliado_rival', icon: '🤝', nome: 'Chapa com o antigo rival', dica: 'Transforme o rival em aliado e termine a carreira ao lado dele.',
    test: (g) => g.phase === 'end' && rv(g) && rv(g).estagio === 'aliado',
    linhas: (g) => [
      `${rvNome(g)} e ${g.name} brigaram por votos durante anos. No fim, apareceram juntos na mesma foto, o que desmontou muita teoria de bastidor.`,
      'Nos jantares, os dois repetem a mesma piada: "a gente só se entendeu depois de se odiar direito".',
    ],
  },
  {
    id: 'esquecido', icon: '🗿', nome: 'O Estadista que ninguém lembra', dica: 'Termine com números de estadista, mas com poucos marcos e pouca popularidade.',
    test: (g) => g.phase === 'end' && avg(g.stats) >= 62 && (g.stats.pop < 55 || marcos(g) < 6),
    linhas: (g) => [
      `Os números foram de estadista, mas ${g.name} governou de um jeito tão discreto que quase não deixou histórias.`,
      'Em pesquisa posterior, metade dos entrevistados não soube dizer o nome. A outra metade confundiu com um homônimo.',
      'Dizem que a melhor administração é a que passa despercebida. Para a memória coletiva, porém, é a que some.',
    ],
  },
  {
    id: 'instituto', icon: '🏫', nome: 'Fundador(a) de um instituto', dica: 'Termine com bom governo e legado em educação, ciência ou imagem alta.',
    test: (g) => g.phase === 'end' && avg(g.stats) >= 56 && ((g.poder && (g.poder.edu >= 70 || g.poder.cien >= 3)) || g.stats.img >= 75),
    linhas: (g) => [
      `Fora do poder, ${g.name} abriu um instituto de políticas públicas que levava o nome da cidade natal, ${casa(g)}.`,
      'Os cursos formaram gerações de gestores, e o centro de pesquisa virou referência. É o tipo de herança que o voto não compra.',
    ],
  },
  {
    id: 'apagado', icon: '🌫️', nome: 'Mandato apagado', dica: 'Chegue ao fim da presidência sem brilho nem desastre.',
    test: (g) => g.phase === 'end' && avg(g.stats) < 56,
    linhas: (g) => [
      `${g.name} cumpriu o mandato e saiu pela porta lateral. Sem aplausos, sem vaias, só o relógio da posse do próximo.`,
      'Ninguém falou mal. Ninguém falou nada. Em política, é um tipo de destino mais comum do que se admite.',
    ],
  },
  {
    id: 'carreira', icon: '🏁', nome: 'Fim de carreira', dica: 'Qualquer outro desfecho.',
    test: () => true,
    linhas: (g) => [`A carreira de ${g.name} terminou, e a política seguiu como sempre segue: sem pedir licença.`],
  },
]

export function finalOf(g) {
  return FINAIS.find((f) => f.test(g)) || FINAIS[FINAIS.length - 1]
}
export const finalLinhas = (g) => (g.final && FINAIS.find((f) => f.id === g.final.id) ? FINAIS.find((f) => f.id === g.final.id).linhas(g) : [])
