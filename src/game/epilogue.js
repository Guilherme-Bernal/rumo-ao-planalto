// Epílogo: um pequeno texto de fechamento escrito a partir do que aconteceu na carreira.
const pick = (arr, seed) => arr[Math.abs(seed) % arr.length]

export function epilogue(g) {
  const s = g.stats
  const n = g.history.length
  const last = n ? g.history[n - 1].office : null
  const home = g.city?.name || g.region?.name || 'sua cidade'
  const seed = (g.points || 0) + (g.total || 0) * 7 + (g.name || '').length * 3
  const out = []

  out.push(
    n
      ? `${g.name} saiu de ${home} e venceu ${n} ${n > 1 ? 'eleições' : 'eleição'}, chegando a ${last}.`
      : `${g.name} tentou a vida política em ${home}, mas nunca chegou a vencer uma eleição.`,
  )

  const marks = []
  if (s.pop >= 70) marks.push('Era querido(a) nas ruas, dessas pessoas que param para tirar foto na feira.')
  if (s.pop < 30) marks.push('No fim, a popularidade tinha virado assunto de piada nas rodas de conversa.')
  if (s.img < 35 || g.heat >= 40) marks.push('O nome ficou associado a escândalos e a investigações que nunca terminaram de vez.')
  if (s.img >= 70) marks.push('Até os adversários reconheciam a reputação limpa.')
  if (s.cash < 25) marks.push('Os cofres ficaram no osso, e a conta chegou para quem veio depois.')
  if (s.eco >= 65) marks.push('A economia andou no seu tempo, e muita gente guarda isso na memória.')
  if (s.soc >= 65) marks.push('Escolas e postos de saúde melhoraram, coisa que o povo percebe no dia a dia.')
  if (s.seg >= 65) marks.push('A sensação de segurança nos bairros foi uma das marcas do período.')
  if (s.cong >= 70) marks.push('Sabia negociar como poucos, e a base nunca faltou na hora do voto.')
  if (!marks.length) marks.push('Foi uma carreira de altos e baixos, sem grandes heroísmos nem grandes vexames.')
  out.push(...marks.slice(0, 2))

  const cn = (k) => Object.entries((g.poder && g.poder.cnt) || {}).filter(([x]) => x.endsWith(':' + k)).reduce((a, [, v]) => a + v, 0)
  const ot = g.over && g.over.title
  if (ot === 'Golpe de Estado') out.push('A noite do golpe virou capítulo obrigatório nos livros. Quem tentou defender as instituições é lembrado; quem as derrubou, também, mas por outro motivo.')
  else if (ot === 'Guerra civil') out.push('O país dividido deixou cicatrizes que levaram gerações para fechar. Nos museus, a data do início do conflito ganhou uma sala inteira.')
  if (cn('paz') > 0 && ot !== 'Guerra civil') out.push('O pacto de paz que encerrou o conflito interno ficou conhecido como o dia em que o país escolheu conversar em vez de lutar.')
  if (g.poder && g.poder.sucessao && g.poder.sucessao.fim) out.push(g.poder.sucessao.fim.won ? `O bastão passou para ${g.poder.sucessao.nome}, e a transição de poder foi lembrada como um raro exemplo de continuidade.` : `${g.poder.sucessao.nome} não conseguiu herdar o capital político e a sucessão virou assunto de seminário.`)
  if (g.poder && g.poder.familia && g.poder.familia.conjuge && g.poder.familia.conjuge.casado) out.push(`${g.poder.familia.conjuge.nome} esteve ao seu lado em boa parte da jornada${g.poder.familia.filhos.length ? ', e os filhos cresceram vendo a política de perto' : ''}.`)
  if (cn('golpefail') > 0 || cn('plotok') > 0) out.push('Houve quem tentasse romper a ordem, e as instituições seguraram. Esse capítulo costuma ser citado como prova de que a democracia resistiu.')
  if (cn('emenda') > 0) out.push(`A sua assinatura ficou numa emenda à Constituição${cn('emenda') > 1 ? ' (e em outras)' : ''}, daquelas que professores citam em sala de aula.`)
  if (cn('petrea') > 0) out.push('O Supremo teve de lembrar que algumas cláusulas da Constituição não se mexem, e o episódio ficou na sua biografia.')
  if (cn('tech') >= 3) out.push('O investimento em pesquisa criou laboratórios, patentes e uma geração de cientistas que lembram o seu nome.')
  if (cn('arsenal') > 0) out.push('O arsenal dissuasor mudou o lugar do país no tabuleiro do mundo, junto com sanções e uma desconfiança que durou décadas.')
  else if (cn('bloco') >= 2) out.push('As alianças que o país firmou no seu tempo deram assento a mesas onde antes só se ouvia de longe.')
  const el = g.poder && g.poder.elenco
  if (el && el.rival && el.nVoltas >= 2) out.push(`${el.rival} nunca saiu de cena: voltou a aparecer a cada crise, e os dois acabaram ligados na memória do país.`)
  out.push(
    pick(
      [
        'Os livros de história vão discutir o saldo por muito tempo. Nos bares, a discussão já começou.',
        'Quem viveu a época conta a história de um jeito. Quem estudou depois, de outro.',
        'No fim das contas, o país seguiu em frente, como sempre segue.',
        'Alguns vão lembrar com saudade, outros com alívio. É assim com todo mundo que passa pelo poder.',
      ],
      seed,
    ),
  )
  return out
}
