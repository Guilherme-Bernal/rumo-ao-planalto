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
