// BLOCO 34: arcos próprios do mentor, do colunista e do banqueiro (como o rival do BLOCO 30).
// Só dados e textos. A lógica fica no motor.

export const ARCOS = {
  mentor: {
    fig: 'mentor', icon: '🧓', titulo: 'O mentor',
    estagios: ['Conselheiro', 'Cobrança', 'Passagem de bastão', 'Encerrado'],
    dica: 'Quem abriu portas para você agora quer ver o que você faz com elas.',
    passivo: { alto: { cong: 0.15 }, baixo: { cong: -0.15 } },
    eventos: [
      { id: 'cafe', est: [0], icon: '☕', titulo: (n) => `${n} chama você para um café`, texto: (n) => `${n} quer conversar sobre o seu rumo e dar conselhos que só quem viu muita eleição dá.`, padrao: 'ignorar',
        ops: [
          { id: 'ouvir', icon: '👂', name: 'Ouvir com atenção', desc: 'Aprende e fortalece o laço.', fx: { cong: 0.5 }, laco: 10 },
          { id: 'formal', icon: '🤝', name: 'Pedir apoio formal', desc: 'Custa 1 de Caixa e rende base. O laço vira compromisso.', cash: 1, fx: { cong: 1.5 }, laco: 4, avanca: true },
          { id: 'ignorar', icon: '🙈', name: 'Dizer que está sem agenda', desc: 'Economiza tempo, mas esfria a relação.', fx: {}, laco: -8 },
        ] },
      { id: 'afilhado', est: [1], icon: '🧑‍🤝‍🧑', titulo: (n) => `${n} pede apoio ao afilhado político`, texto: (n) => `${n} quer que você apoie o candidato que ele vem preparando. É a cobrança do favor antigo.`, padrao: 'negociar',
        ops: [
          { id: 'apoiar', icon: '✅', name: 'Apoiar o afilhado', desc: 'Gesto de lealdade, com algum risco de imagem.', fx: { cong: 1, img: -0.5 }, laco: 12 },
          { id: 'negociar', icon: '🤝', name: 'Apoiar em troca de algo', desc: 'Custa 1 de Caixa e deixa um meio-termo.', cash: 1, fx: { cong: 0.5 }, laco: 3 },
          { id: 'negar', icon: '🚫', name: 'Negar o apoio', desc: 'Independência custa o carinho dele.', fx: { img: 0.5 }, laco: -16, avanca: true },
        ] },
      { id: 'polemica', est: [1, 2], icon: '🗞️', titulo: (n) => `${n} se envolve numa polêmica`, texto: (n) => `${n} apareceu numa reportagem desconfortável e todo mundo lembra que ele é o seu padrinho.`, padrao: 'silencio',
        ops: [
          { id: 'defender', icon: '🛡️', name: 'Defender publicamente', desc: 'Lealdade tem preço na imagem.', fx: { img: -1.5, cong: 1 }, laco: 14 },
          { id: 'distanciar', icon: '↔️', name: 'Marcar distância', desc: 'Protege a imagem e rompe um pouco.', fx: { img: 0.8 }, laco: -14 },
          { id: 'silencio', icon: '🤐', name: 'Não comentar', desc: 'Espera passar.', fx: { img: -0.3 }, laco: -2 },
        ] },
      { id: 'bastao', est: [2], icon: '🏅', titulo: (n) => `${n} propõe passar o bastão`, texto: (n) => `${n} quer fazer uma cerimônia pública e dizer que você é o herdeiro político dele. Ou não.`, padrao: 'respeito', fim: true,
        ops: [
          { id: 'herdeiro', icon: '👑', name: 'Aceitar ser o herdeiro', desc: 'Ganha base e imagem, e leva o peso do legado dele.', fx: { cong: 3, img: 1.5 }, laco: 15, fim: 'herdeiro' },
          { id: 'respeito', icon: '🙏', name: 'Agradecer, sem formalidade', desc: 'Mantém distância respeitosa.', fx: { img: 0.8 }, laco: 0, fim: 'respeito' },
          { id: 'romper', icon: '✂️', name: 'Romper de vez', desc: 'Corta a sombra dele. Custa base.', fx: { cong: -2, img: 0.5 }, laco: -30, fim: 'rompido' },
        ] },
    ],
    finais: { herdeiro: 'Você virou o herdeiro político do mentor e herdou a base dele.', respeito: 'Vocês se despediram com respeito e cada um seguiu o seu caminho.', rompido: 'Você rompeu com o mentor. Ele agora é um crítico de peso.', falecido: 'O mentor se foi e ficou a lembrança do que ele ensinou.', aposentado: 'O mentor se aposentou e passou a acompanhar de longe.' },
  },
  colunista: {
    fig: 'colunista', icon: '🖋️', titulo: 'O colunista',
    estagios: ['Observador', 'Aproximação', 'Veredito', 'Encerrado'],
    dica: 'Quem escreve sobre você pode ser o seu melhor ou o seu pior aliado.',
    passivo: { alto: { img: 0.15 }, baixo: { img: -0.25, pop: -0.1 } },
    eventos: [
      { id: 'critica', est: [0], icon: '📰', titulo: (n) => `${n} desanca o seu governo numa coluna`, texto: (n) => `A coluna de ${n} foi compartilhada milhares de vezes e traz uma crítica dura e bem escrita.`, padrao: 'ignorar',
        ops: [
          { id: 'convidar', icon: '☕', name: 'Convidar para uma entrevista', desc: 'Abre o diálogo e pode mudar o tom.', fx: { img: 0.3 }, laco: 10, avanca: true },
          { id: 'responder', icon: '✍️', name: 'Responder por escrito', desc: 'Defende o governo, mas aumenta o embate.', fx: { img: 0.3 }, laco: -6 },
          { id: 'ignorar', icon: '🙈', name: 'Ignorar', desc: 'A crítica fica sem resposta.', fx: { img: -0.5 }, laco: -3 },
        ] },
      { id: 'acesso', est: [1], icon: '🔑', titulo: (n) => `${n} pede acesso exclusivo`, texto: (n) => `${n} quer acompanhar uma semana de bastidores do seu governo para uma reportagem especial.`, padrao: 'negar',
        ops: [
          { id: 'dar', icon: '✅', name: 'Abrir as portas', desc: 'Risco calculado. Se correr bem, vira vitrine.', fx: {}, laco: 14, risco: { p: 0.3, fx: { img: -2 } }, ganho: { img: 1.5 } },
          { id: 'publica', icon: '📺', name: 'Oferecer entrevista pública', desc: 'Mais seguro e menos íntimo.', fx: { img: 0.5 }, laco: 4 },
          { id: 'negar', icon: '🚪', name: 'Negar', desc: 'Sem risco, mas o colunista fica ressentido.', fx: {}, laco: -10 },
        ] },
      { id: 'denuncia', est: [1, 2], icon: '🔍', titulo: (n) => `${n} publica denúncia sobre um aliado seu`, texto: (n) => `A coluna de ${n} aponta irregularidades de alguém do seu círculo. A pergunta agora é o que você faz.`, padrao: 'dados',
        ops: [
          { id: 'afastar', icon: '✂️', name: 'Afastar o aliado', desc: 'Mostra firmeza e custa base.', fx: { img: 1.5, cong: -1 }, laco: 12 },
          { id: 'atacar', icon: '⚔️', name: 'Atacar o colunista', desc: 'Pega mal e fecha a porta.', fx: { cong: 0.5, img: -1 }, laco: -16 },
          { id: 'dados', icon: '📊', name: 'Responder com dados', desc: 'Pode neutralizar a denúncia.', fx: {}, laco: 3, risco: { p: 0.4, fx: { img: -1.5 } }, ganho: { img: 1 } },
        ] },
      { id: 'livro', est: [2], icon: '📘', titulo: (n) => `${n} vai lançar um livro sobre você`, texto: (n) => `${n} convida você para escrever o prefácio de um livro sobre a sua trajetória. O tom do livro ainda é incerto.`, padrao: 'neutro', fim: true,
        ops: [
          { id: 'prefacio', icon: '🖋️', name: 'Escrever o prefácio', desc: 'Vira parceria literária e rende imagem.', fx: { img: 2 }, laco: 15, fim: 'cronista' },
          { id: 'neutro', icon: '🎙️', name: 'Comparecer ao lançamento', desc: 'Presença educada, sem compromisso.', fx: { img: 0.5 }, laco: 2, fim: 'neutro' },
          { id: 'boicote', icon: '🚫', name: 'Boicotar o livro', desc: 'Faz o livro virar polêmica e vender mais.', fx: { img: -1.5 }, laco: -25, fim: 'inimigo' },
        ] },
    ],
    finais: { cronista: 'O colunista virou o seu cronista oficial e suas colunas passaram a favorecer você.', neutro: 'O livro saiu e o colunista ficou numa distância cordial.', inimigo: 'O colunista virou um inimigo declarado, e o livro virou arma.', falecido: 'O colunista morreu e sua voz fez falta no debate público.', aposentado: 'O colunista se aposentou das colunas.' },
  },
  banqueiro: {
    fig: 'banqueiro', icon: '🏦', titulo: 'O banqueiro',
    estagios: ['Sondagem', 'Parceria', 'Cobrança', 'Encerrado'],
    dica: 'Dinheiro grande nunca vem de graça: cedo ou tarde ele manda a conta.',
    passivo: { alto: { cash: 0.4 }, baixo: { eco: -0.1 } },
    eventos: [
      { id: 'oferta', est: [0], icon: '💼', titulo: (n) => `${n} oferece uma linha de apoio financeiro`, texto: (n) => `${n} se oferece para ajudar a financiar projetos do seu governo. Parece generoso, mas ninguém dá nada de graça.`, padrao: 'legal',
        ops: [
          { id: 'aceitar', icon: '💰', name: 'Aceitar sem perguntar', desc: 'Entra muito dinheiro e deixa rastro.', fx: { cash: 3, img: -0.5 }, laco: 12, avanca: true, sujo: true },
          { id: 'legal', icon: '📑', name: 'Só doação legal e declarada', desc: 'Entra menos, mas sem risco.', fx: { cash: 1.5 }, laco: 4 },
          { id: 'recusar', icon: '🚫', name: 'Recusar', desc: 'Imagem limpa e relação fria.', fx: { img: 0.5 }, laco: -8 },
        ] },
      { id: 'regra', est: [1], icon: '📜', titulo: (n) => `${n} pede mudança numa regra de crédito`, texto: (n) => `${n} quer uma regra de crédito mais favorável ao banco dele. Diz que vai ajudar a economia toda.`, padrao: 'estudar',
        ops: [
          { id: 'atender', icon: '✅', name: 'Atender o pedido', desc: 'Ele fica satisfeito. A imagem sofre.', fx: { img: -1, eco: -0.5 }, laco: 12 },
          { id: 'estudar', icon: '🔬', name: 'Mandar estudar', desc: 'Custa 1 de Caixa e ganha tempo.', cash: 1, fx: {}, laco: 2 },
          { id: 'negar', icon: '🚫', name: 'Negar', desc: 'Mantém a regra e perde um amigo rico.', fx: { img: 0.5 }, laco: -16 },
        ] },
      { id: 'vazamento', est: [1, 2], icon: '📉', titulo: (n) => `Vazam empréstimos entre ${n} e o governo`, texto: (n) => `Uma reportagem liga o banco de ${n} a decisões do seu governo. Em ano ruim, isso vira escândalo.`, padrao: 'calar',
        ops: [
          { id: 'explicar', icon: '🗣️', name: 'Explicar tudo publicamente', desc: 'Pode estancar ou piorar.', fx: {}, laco: -6, risco: { p: 0.45, fx: { img: -2.5 } }, ganho: { img: 0.8 } },
          { id: 'afastar', icon: '↔️', name: 'Afastar-se do banqueiro', desc: 'Protege a imagem e perde a torneira.', fx: { img: 1 }, laco: -20 },
          { id: 'calar', icon: '🤐', name: 'Calar e torcer', desc: 'Pode passar. Pode explodir.', fx: {}, laco: 2, risco: { p: 0.4, fx: { img: -3 } } },
        ] },
      { id: 'conta', est: [2], icon: '🧾', titulo: (n) => `${n} cobra a conta`, texto: (n) => `${n} lembra tudo o que fez por você e pede uma contrapartida pesada. A hora de pagar chegou.`, padrao: 'romper', fim: true,
        ops: [
          { id: 'pagar', icon: '💸', name: 'Pagar a conta', desc: 'Custa 3 de Caixa e imagem, mas encerra o capítulo em paz.', cash: 3, fx: { img: -1 }, laco: 10, fim: 'devedor' },
          { id: 'romper', icon: '✂️', name: 'Romper e assumir o custo', desc: 'Perde a torneira, mas ganha liberdade.', fx: { eco: -1, img: 1.5 }, laco: -30, fim: 'ruptura' },
          { id: 'delatar', icon: '📣', name: 'Denunciar o esquema', desc: 'Faz de você o herói e gera inimigo poderoso.', fx: { img: 2.5, cong: -2 }, laco: -50, fim: 'delator' },
        ] },
    ],
    finais: { devedor: 'Você pagou o banqueiro e a relação terminou em tom amistoso.', ruptura: 'Você rompeu com o banqueiro e perdeu o seu financiador.', delator: 'Você denunciou o esquema e virou o herói da imprensa, mas ganhou um inimigo poderoso.', falecido: 'O banqueiro faleceu e o dinheiro dele ficou sem dono.', aposentado: 'O banqueiro vendeu o banco e saiu do jogo.' },
  },
}
