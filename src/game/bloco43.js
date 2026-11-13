// BLOCO 43: eventos esportivos e culturais gerados.
// Os grandes eventos fixos (F1, Estadual, Copa...) continuam, mas deixam de ocupar todo o calendário:
// as rodadas livres sorteiam eventos montados a partir destas bases, do cenário e do estado.
// Texto 100% fictício. Sem times, marcas ou pessoas reais.

const ANY = [0, 1, 2, 3]

// coisa: no que se promete investir. presenca: ir e ficar com o povo. arrisca: o lance de risco.
export const GEN_BASES = [
  { id: 'volei', icon: '🏐', nome: 'Final de vôlei', titulo: 'Final do campeonato de vôlei em {cidade}', texto: 'O ginásio vai lotar para ver a decisão e as seleções de base assistem das primeiras filas.', coisa: 'ginásios e escolinhas de vôlei', presenca: 'Torcer no meio da arquibancada', arrisca: 'Dar o saque inicial', ok: 'O saque caiu na quadra e o ginásio inteiro vibrou.', err: 'A bola foi parar na arquibancada. O vídeo corre solto.', sphere: 'mun', tags: ['volei', 'futebol'] },
  { id: 'maratona', icon: '🏃', nome: 'Maratona da cidade', titulo: 'Maratona de {cidade}', texto: 'Milhares de corredores tomam as ruas ao amanhecer e as ruas ficam fechadas por horas.', coisa: 'pistas e ciclovias', presenca: 'Distribuir água no percurso', arrisca: 'Dar a largada e correr os primeiros quilômetros', ok: 'Você completou o trecho e ganhou aplausos pelo caminho.', err: 'Passou mal no segundo quilômetro e a ambulância virou notícia.', sphere: 'mun', tags: ['corrida'] },
  { id: 'jogosreg', icon: '🥇', nome: 'Jogos Regionais', titulo: 'Jogos Regionais em {estado}', texto: 'Atletas de várias cidades disputam medalhas e cada prefeitura quer fazer bonito.', coisa: 'o esporte de base', presenca: 'Acompanhar a delegação da sua cidade', arrisca: 'Entregar as medalhas no pódio', ok: 'Medalhas no pescoço e fotos com os campeões.', err: 'Trocou o nome da cidade campeã. A gafe foi gravada.', sphere: 'est', tags: ['futebol', 'volei', 'corrida'] },
  { id: 'lutas', icon: '🥋', nome: 'Noite de lutas', titulo: 'Noite de lutas em {cidade}', texto: 'O ginásio vende todos os ingressos e a disciplina do tatame vira assunto no bairro.', coisa: 'projetos sociais com artes marciais', presenca: 'Assistir da beira do ringue', arrisca: 'Subir ao tatame para um cumprimento ao vencedor', ok: 'O vencedor te levantou o braço e o ginásio aplaudiu.', err: 'Escorregou na lona e o replay passou a noite toda.', sphere: 'mun', tags: ['lutas'] },
  { id: 'esports', icon: '🎮', nome: 'Campeonato de e-sports', titulo: 'Campeonato de e-sports em {cidade}', texto: 'Jovens lotam a arena para ver as finais e a cidade quer atrair a indústria dos jogos.', coisa: 'um polo de games e tecnologia', presenca: 'Assistir à final com os jogadores', arrisca: 'Jogar uma partida de exibição ao vivo', ok: 'Você ganhou a partida e a plateia gritou o seu nome.', err: 'Perdeu em dois minutos para uma criança de 12 anos.', sphere: 'est', tags: ['games', 'tecnologia'], peso: { tecnologia: 3 } },
  { id: 'regata', icon: '⛵', nome: 'Regata e esportes náuticos', titulo: 'Regata em {cidade}', texto: 'Barcos coloridos tomam a baía e os hotéis estão cheios. O turismo local acompanha tudo.', coisa: 'a orla e os pontos turísticos', presenca: 'Acompanhar do cais', arrisca: 'Subir a bordo na largada', ok: 'Você embarcou, acenou e fez uma foto linda.', err: 'Enjoou antes de sair do cais e a foto não foi bonita.', sphere: 'mun', tags: ['pesca', 'natureza', 'viagens'], peso: { turismo: 3 } },
  { id: 'rodeio', icon: '🤠', nome: 'Festa do peão e rodeio', titulo: 'Festa do peão em {cidade}', texto: 'Show sertanejo, rodeio e muita gente do interior. É onde o agronegócio mostra a sua força.', coisa: 'o parque de exposições', presenca: 'Ficar no meio do povo com chapéu e bota', arrisca: 'Montar na sela de exibição', ok: 'Aguentou os oito segundos e o público foi ao delírio.', err: 'Caiu de bunda na areia e o vídeo viralizou.', sphere: 'est', tags: ['musica', 'gastronomia'], peso: { agro: 4, pecuaria: 4 } },
  { id: 'pesca', icon: '🎣', nome: 'Torneio de pesca', titulo: 'Torneio de pesca em {estado}', texto: 'Pescadores esportivos e ribeirinhos se encontram no rio, com sorteio de prêmios e barraquinhas.', coisa: 'a pesca artesanal', presenca: 'Tomar café com os pescadores', arrisca: 'Entrar na disputa com a vara', ok: 'Pegou o maior peixe do dia, e a foto está em todo canto.', err: 'Voltou sem nada e deu o peixe do vizinho como seu.', sphere: 'est', tags: ['pesca', 'natureza'], peso: { turismo: 2 } },
  { id: 'basquete', icon: '🏀', nome: 'Decisão de basquete', titulo: 'Decisão do basquete em {cidade}', texto: 'O ginásio está cheio e a cidade se divide entre as duas equipes.', coisa: 'quadras públicas nos bairros', presenca: 'Assistir sentado entre os torcedores', arrisca: 'Dar a bola ao alto na abertura', ok: 'A bola subiu perfeita e a torcida cantou.', err: 'A bola não subiu e você virou piada nas redes.', sphere: 'mun', tags: ['volei', 'futebol'] },
  { id: 'festmusica', icon: '🎶', nome: 'Festival de música', titulo: 'Festival de música em {cidade}', texto: 'Três noites de shows, barracas de comida e a cidade lotada de turistas.', coisa: 'a cena musical local', presenca: 'Curtir os shows com o povo', arrisca: 'Subir ao palco para abrir o festival', ok: 'Falou curto, bem e agradou a todo mundo.', err: 'O discurso passou do tempo e o público vaiou.', sphere: 'mun', tags: ['musica', 'danca'], peso: { turismo: 2 } },
  { id: 'cinema', icon: '🎬', nome: 'Mostra de cinema', titulo: 'Mostra de cinema em {cidade}', texto: 'Filmes independentes, debates e tapete vermelho. A imprensa cultural está de olho.', coisa: 'salas e o audiovisual local', presenca: 'Assistir às sessões com o público', arrisca: 'Entregar o prêmio principal', ok: 'Entregou o prêmio com graça e emocionou a plateia.', err: 'Leu o nome do filme errado. A plateia riu.', sphere: 'mun', tags: ['cinema', 'teatro'] },
  { id: 'livro', icon: '📚', nome: 'Feira do livro', titulo: 'Feira do livro em {cidade}', texto: 'Escolas levam as turmas, autores locais dão palestras e as editoras fazem promoção.', coisa: 'bibliotecas e compra de livros', presenca: 'Passear entre os estandes e ler para as crianças', arrisca: 'Lançar o seu próprio livro na feira', ok: 'Fila para autógrafo e jornal elogiando a ideia.', err: 'Poucos compraram e o estande ficou vazio.', sphere: 'mun', tags: ['leitura', 'historia'] },
  { id: 'teatro', icon: '🎭', nome: 'Temporada de teatro', titulo: 'Temporada de teatro em {cidade}', texto: 'Grupos locais ocupam os teatros e pedem apoio para continuar.', coisa: 'a lei de incentivo à cultura', presenca: 'Prestigiar a estreia', arrisca: 'Participar de uma cena na abertura', ok: 'Fez uma ponta divertida e a plateia aplaudiu.', err: 'Esqueceu a fala e a cena virou meme.', sphere: 'mun', tags: ['teatro', 'cinema'] },
  { id: 'gastro', icon: '🍲', nome: 'Festival gastronômico', titulo: 'Festival gastronômico em {cidade}', texto: 'Chefs, barracas e comida de rua ocupam a praça central por três dias.', coisa: 'a feira e os pequenos restaurantes', presenca: 'Provar a comida de cada barraca', arrisca: 'Cozinhar ao vivo no palco', ok: 'Seu prato saiu bom e o público pediu bis.', err: 'Queimou tudo. O som do alarme ficou famoso.', sphere: 'mun', tags: ['gastronomia'], peso: { turismo: 2 } },
  { id: 'xadrez', icon: '♟️', nome: 'Torneio escolar de xadrez', titulo: 'Torneio de xadrez nas escolas', texto: 'Centenas de alunos disputam o título estadual e os professores pedem apoio.', coisa: 'o xadrez nas escolas', presenca: 'Acompanhar as partidas e conversar com os alunos', arrisca: 'Jogar uma partida simultânea contra os alunos', ok: 'Ganhou de todos menos de um garoto. E a foto ficou ótima.', err: 'Perdeu para o terceiro aluno e foi comentado por semanas.', sphere: 'est', tags: ['xadrez'] },
  { id: 'adocao', icon: '🐶', nome: 'Feira de adoção de animais', titulo: 'Feira de adoção em {cidade}', texto: 'Protetoras e voluntários levam cães e gatos para a praça e pedem apoio da prefeitura.', coisa: 'castração e abrigo de animais', presenca: 'Passear entre os animais e conversar com voluntários', arrisca: 'Adotar um animal na frente das câmeras', ok: 'A adoção emocionou a cidade inteira.', err: 'O animal fugiu e a cena foi gravada.', sphere: 'mun', tags: ['pets', 'filantropia'] },
  { id: 'danca', icon: '💃', nome: 'Festival de dança', titulo: 'Festival de dança em {cidade}', texto: 'Grupos de dança tradicional e urbana se apresentam no palco central.', coisa: 'os grupos culturais da periferia', presenca: 'Assistir às apresentações', arrisca: 'Dançar com um grupo no palco', ok: 'Acompanhou o ritmo e a praça aplaudiu de pé.', err: 'Pisou no pé da dançarina principal, ao vivo.', sphere: 'mun', tags: ['danca', 'musica'] },
  { id: 'moto', icon: '🏍️', nome: 'Encontro de motoclubes', titulo: 'Encontro de motoclubes em {cidade}', texto: 'Centenas de motos tomam a rodovia e a cidade se enche de visitantes.', coisa: 'o trânsito e a segurança nas rodovias', presenca: 'Receber os motoclubes na entrada da cidade', arrisca: 'Pilotar na abertura do desfile', ok: 'Liderou o desfile e a estrada foi toda sua.', err: 'A moto falhou na saída e o desfile ficou parado.', sphere: 'est', tags: ['motos', 'automobilismo'] },
  { id: 'feiraind', icon: '🏭', nome: 'Feira da indústria', titulo: 'Feira da indústria em {estado}', texto: 'Empresários do setor mostram novidades e esperam saber o que o poder público pensa fazer por eles.', coisa: 'o distrito industrial', presenca: 'Visitar os estandes e ouvir os empresários', arrisca: 'Fazer o discurso de abertura', ok: 'O discurso agradou e rendeu intenções de investimento.', err: 'Prometeu o que não podia cumprir e foi cobrado na hora.', sphere: 'est', tags: ['tecnologia'], peso: { industria: 4, tecnologia: 2 } },
  { id: 'feiraciencia', icon: '🔬', nome: 'Feira de ciências', titulo: 'Feira de ciências e tecnologia', texto: 'Estudantes, universidades e startups mostram projetos. A imprensa quer saber o que você vai prometer.', coisa: 'laboratórios e bolsas de pesquisa', presenca: 'Conversar com os estudantes', arrisca: 'Fazer uma demonstração ao vivo', ok: 'A demonstração funcionou e foi parar no noticiário.', err: 'O experimento deu errado em cima da camisa.', sphere: 'est', tags: ['tecnologia', 'leitura'], peso: { tecnologia: 3 } },
  { id: 'aniversario', icon: '🎂', nome: 'Aniversário da cidade', titulo: 'Aniversário de {cidade}', texto: 'A cidade comemora mais um ano com desfile, bolo gigante e história contada em praça pública.', coisa: 'o patrimônio histórico', presenca: 'Cortar o bolo com os moradores mais antigos', arrisca: 'Fazer o discurso de aniversário', ok: 'Citou a história da cidade e emocionou os moradores.', err: 'Errou o ano de fundação, e o historiador local corrigiu em voz alta.', sphere: 'mun', tags: ['historia'] },
]

// o cenário muda o tom do evento e o custo de cada escolha
export const GEN_CENARIO = {
  fiscal: { nota: 'Com o caixa apertado, qualquer gasto vai ser cobrado.', investir: { cash: -1, pop: -1 }, presenca: {} },
  boom: { nota: 'Com a economia aquecida, patrocinadores aparecem de todos os lados.', investir: { cash: 2 }, presenca: { eco: 1 } },
  seca: { nota: 'Com a seca, há quem ache que não é hora de festa.', investir: { pop: -1 }, presenca: { pop: -1 } },
  violencia: { nota: 'Com a violência em alta, a segurança do evento virou assunto.', investir: { seg: 1, cash: -1 }, presenca: { seg: -1 } },
  polar: { nota: 'No clima de polarização, tudo o que você disser vai virar briga.', investir: {}, presenca: { img: -1 } },
  escandalos: { nota: 'Com os escândalos recentes, a imprensa vai ler cada gesto.', investir: { img: -1 }, presenca: { img: 1 } },
  saude: { nota: 'Com a pressão na saúde, o público espera cuidado e sensatez.', investir: { soc: 1, cash: -1 }, presenca: {} },
  jovem: { nota: 'A geração conectada vai filmar tudo e comentar em tempo real.', investir: { pop: 1 }, presenca: { pop: 1 } },
  commodities: { nota: 'Com dinheiro entrando, a plateia espera generosidade.', investir: { cash: 1, pop: 1 }, presenca: {} },
}

const soma = (a, b) => {
  const o = { ...a }
  for (const k in b) o[k] = (o[k] || 0) + b[k]
  return o
}

// Monta o evento a partir da base, do cenário e da dor do estado. `dorNome` é o nome do tema crônico.
export function montarGen(base, cen, dorNome, dorQuente) {
  const c = GEN_CENARIO[cen] || { nota: '', investir: {}, presenca: {} }
  const pol = dorQuente
    ? { label: `Aproveitar a plateia para falar de ${dorNome}`, fx: { pop: 2, img: 2 }, out: `Falou do assunto certo na hora certa: ${dorNome} está na cabeça de todo mundo.` }
    : { label: `Aproveitar a plateia para falar de ${dorNome}`, fx: { img: 1, pop: -1 }, out: 'Foi um discurso sério demais para o clima, mas gente atenta anotou.' }
  return {
    id: 'gen:' + base.id, icon: base.icon, name: base.nome, stages: ANY, sphere: base.sphere, tags: base.tags,
    title: base.titulo,
    text: `${base.texto}${c.nota ? ' ' + c.nota : ''}`,
    choices: [
      { label: base.presenca, fx: soma({ pop: 4, img: 1 }, c.presenca), out: 'Você ficou entre o povo, e a foto circulou com simpatia.' },
      { label: `Prometer verba para ${base.coisa}`, fx: soma({ pop: 3, eco: 1, cash: -4 }, c.investir), out: `O anúncio sobre ${base.coisa} saiu bem nas redes. O caixa sentiu.` },
      { label: base.arrisca, risk: 0.5, fx: { pop: 7, img: 2 }, out: base.ok, alt: { fx: { pop: -5, img: -3 }, out: base.err } },
      { label: pol.label, fx: pol.fx, out: pol.out },
    ],
  }
}

// peso do evento no sorteio: padrão 1, maior se combina com o setor forte do estado ou com a paixão do personagem
export function pesoGen(base, tagSetor, paixao) {
  let w = (base.peso && tagSetor && base.peso[tagSetor]) || 1
  if (paixao && paixao !== 'nenhuma' && base.tags.includes(paixao)) w *= 1.6
  return w
}
