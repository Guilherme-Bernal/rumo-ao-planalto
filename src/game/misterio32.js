// BLOCO 32: conspiração de longo prazo e eventos de fundo inspirados na história (nomes fictícios).
// Só dados e textos. A lógica fica no motor.

/* ---------- a conspiração ---------- */
export const MIS_TITULO = 'A teia por trás do governo'
export const MIS_INTRO = (c) => `Começaram os rumores: alguém está montando uma operação para derrubar a sua carreira. Você ainda não sabe quem. Os primeiros nomes que aparecem em conversas soltas são ${c.operador} e ${c.financista}.`
// pistas encontradas na ordem; cada uma revela uma ponta
export const MIS_PISTAS = [
  (c) => `Um garçom de um jantar reservado conta que ${c.operador} esteve numa mesa com gente da oposição.`,
  (c) => `Registros de viagem mostram ${c.operador} em três capitais na mesma semana de cada vazamento contra você.`,
  (c) => `Uma planilha apagada cita repasses mensais a perfis que atacam o governo. O pagador é uma empresa de fachada.`,
  (c) => `A empresa de fachada pertence a ${c.financista}, que sempre posou como seu apoiador.`,
  (c) => `Mensagens recuperadas ligam ${c.financista} a ${c.traidor}, alguém de dentro do seu círculo.`,
  (c) => `Uma gravação confirma o plano: ${c.traidor} entrega informações, ${c.financista} banca e ${c.operador} executa.`,
]
export const MIS_PEND = {
  titulo: (c) => `Uma ponta solta na teia de ${c.operador}`,
  texto: () => 'Uma fonte reapareceu com um detalhe novo. Se você não agir logo, ela pode sumir.',
  padrao: 'ignorar',
  ops: [
    { id: 'seguir', icon: '🔍', name: 'Seguir a pista', desc: 'Custa 2 de Caixa. Boa chance de achar uma peça nova.', cash: 2, p: 0.7 },
    { id: 'pf', icon: '🛂', name: 'Passar para a Polícia Federal', desc: 'Grátis, mas chance menor e vazam menos detalhes.', p: 0.45 },
    { id: 'ignorar', icon: '🤐', name: 'Deixar passar', desc: 'A teia avança sem ser incomodada.', p: 0 },
  ],
}
export const MIS_ACOES = [
  { id: 'investigar', icon: '🕵️', name: 'Investigar com discrição', desc: 'Custa 2 de Caixa. Pode revelar uma nova pista.', cash: 2, p: 0.5, bonus: 'img' },
  { id: 'infiltrar', icon: '🥷', name: 'Infiltrar um informante', desc: 'Custa 3 de Caixa, rende mais, mas é ilegal e deixa rastro.', cash: 3, p: 0.7, bonus: 'cong', sujo: true },
  { id: 'negociar', icon: '🤫', name: 'Negociar silêncio com o financista', desc: 'Exige 3 pistas. Custa 4 de Caixa, derruba a teia por um tempo, mas é sujo.', cash: 4, need: 3, sujo: true },
  { id: 'expor', icon: '📣', name: 'Expor a conspiração', desc: 'Exige 4 pistas. Sem provas suficientes, volta contra você.', need: 4 },
]
export const MIS_FIM = {
  exposta: { icon: '📣', t: (c) => `A conspiração foi exposta: ${c.traidor}, ${c.financista} e ${c.operador} viraram notícia no país inteiro.`, fx: { img: 4, cong: 2, pop: 1.5 } },
  explodiu: { icon: '💥', t: (c) => `A operação de ${c.operador} explodiu em público: vazamentos em série, boatos e uma pressão que você não esperava.`, fx: { img: -8, cong: -4, pop: -2 } },
  calada: { icon: '🤝', t: (c) => `Você fechou um acordo discreto com ${c.financista}. A teia ficou parada, mas não acabou.`, fx: { img: -1.5 } },
}

/* ---------- eventos de fundo inspirados na história ---------- */
const E = (exec, leg, padrao) => ({ exec, leg, padrao })
export const HIST_EVENTOS = [
  {
    id: 'ancora', icon: '💱', nome: 'O Plano Âncora', insp: 'Inspirado em planos de estabilização monetária.',
    txt: { exec: 'O ministro Aurélio Barca lançou o Plano Âncora para derrubar a inflação com uma moeda nova. Você precisa dizer de que lado está.', leg: 'O ministro Aurélio Barca lançou o Plano Âncora e o plenário se dividiu entre apoiadores e cautelosos.', padrao: 'Um plano de estabilização da moeda mexeu com o bolso de todo mundo.' },
    padrao: 'distancia',
    ops: [
      { id: 'apoiar', icon: '🤝', name: 'Abraçar o plano', desc: 'Vira o rosto do plano, para o bem ou para o mal.', fx: E({ eco: 2.5, pop: 2, img: -0.5 }, { eco: 1, cong: 1 }, { eco: 1, pop: 1 }), risco: { p: 0.3, fx: { pop: -3, eco: -2 } } },
      { id: 'distancia', icon: '🧊', name: 'Manter distância', desc: 'Deixa o ministro ficar com o crédito e a culpa.', fx: E({ eco: 1 }, { cong: 0.5 }, { eco: 0.5 }) },
      { id: 'criticar', icon: '📣', name: 'Criticar o plano', desc: 'Ganha voz, mas se der certo, fica ruim para você.', fx: E({ img: 0.5, pop: -0.5 }, { cong: -0.5, img: 1 }, { img: 0.5 }), risco: { p: 0.5, fx: { img: -2.5, pop: -1.5 } } },
    ],
  },
  {
    id: 'impeach', icon: '⚖️', nome: 'Crise do impeachment da presidente Lúcia Montes', insp: 'Inspirada em crises de impeachment de outros países.',
    txt: { exec: 'Em um país vizinho, a presidente Lúcia Montes enfrenta um processo de impeachment. A imprensa pergunta se isso poderia acontecer com você.', leg: 'Em um país vizinho, a presidente Lúcia Montes enfrenta um impeachment. O Congresso discute os limites do poder dos parlamentares.', padrao: 'O processo de impeachment de uma presidente vizinha virou assunto nacional.' },
    padrao: 'neutro',
    ops: [
      { id: 'firmeza', icon: '🛡️', name: 'Defender a institucionalidade', desc: 'Posição firme, de quem respeita os ritos.', fx: E({ img: 1.5 }, { img: 1, cong: 0.5 }, { img: 1 }) },
      { id: 'blindar', icon: '🧱', name: 'Blindar a base', desc: 'Reforça alianças, mas parece medo.', cash: 1, fx: E({ cong: 2.5, img: -0.5 }, { cong: 1.5 }, { cong: 1 }) },
      { id: 'neutro', icon: '🤐', name: 'Não comentar', desc: 'Silêncio para evitar comparação.', fx: E({}, {}, {}) },
    ],
  },
  {
    id: 'diesel', icon: '🚛', nome: 'A Parada do Diesel', insp: 'Inspirada em greves de transportadores.',
    txt: { exec: 'Caminhoneiros pararam as estradas por causa do diesel e prateleiras começaram a esvaziar. Todo mundo olha para você.', leg: 'Os caminhoneiros pararam as estradas e o Congresso corre para votar um alívio.', padrao: 'Os caminhoneiros pararam as estradas e a cidade sente o desabastecimento.' },
    padrao: 'esperar',
    ops: [
      { id: 'subsidio', icon: '⛽', name: 'Dar subsídio', desc: 'Custa 2 de Caixa, mas desmobiliza a greve.', cash: 2, fx: E({ pop: 2, eco: 0.5 }, { pop: 1, cong: 0.5 }, { pop: 1 }) },
      { id: 'negociar', icon: '🤝', name: 'Negociar com a categoria', desc: 'Conversa longa, resultado incerto.', fx: E({ pop: 0.5, img: 0.5 }, { pop: 0.5 }, { pop: 0.3 }), risco: { p: 0.4, fx: { pop: -2, eco: -1 } } },
      { id: 'esperar', icon: '⏳', name: 'Esperar a greve passar', desc: 'Barato, mas o desabastecimento cobra.', fx: E({ pop: -2, eco: -1.5 }, { pop: -0.5 }, { pop: -1 }) },
    ],
  },
  {
    id: 'ponte', icon: '🌉', nome: 'Operação Ponte Limpa', insp: 'Inspirada em operações anticorrupção de grande porte.',
    txt: { exec: 'A Operação Ponte Limpa prendeu empreiteiros e atingiu gente de vários partidos. Você precisa decidir como se posicionar.', leg: 'A Operação Ponte Limpa chegou aos corredores do Legislativo e todo mundo lê as listas.', padrao: 'Uma operação anticorrupção virou a pauta do dia no país.' },
    padrao: 'neutra',
    ops: [
      { id: 'apoiar', icon: '🧼', name: 'Apoiar a operação', desc: 'Ganha imagem, mas pode afastar parte da base.', fx: E({ img: 3, cong: -2 }, { img: 2, cong: -1.5 }, { img: 2, cong: -1 }) },
      { id: 'neutra', icon: '🕊️', name: 'Posição neutra', desc: 'Nem ajuda, nem atrapalha.', fx: E({ img: 0.5 }, { img: 0.3 }, { img: 0.3 }) },
      { id: 'abafar', icon: '🫥', name: 'Articular para esfriar', desc: 'Protege aliados e arrisca vazamento.', cash: 1, fx: E({ cong: 2.5 }, { cong: 2 }, { cong: 1.5 }), risco: { p: 0.4, fx: { img: -4 } }, sujo: true },
    ],
  },
  {
    id: 'ruas', icon: '📢', nome: 'Os protestos da Tarifa', insp: 'Inspirada em ondas de manifestações de rua.',
    txt: { exec: 'Estudantes saíram às ruas contra o aumento da tarifa e o movimento cresceu em todas as capitais.', leg: 'As ruas lotaram contra o aumento da tarifa e as galerias do Legislativo estão cheias.', padrao: 'Manifestações contra o aumento da tarifa tomaram a cidade.' },
    padrao: 'ignorar',
    ops: [
      { id: 'recuar', icon: '↩️', name: 'Recuar do aumento', desc: 'Custa 2 de Caixa, mas esfria as ruas.', cash: 2, fx: E({ pop: 3, img: 1 }, { pop: 2 }, { pop: 2 }) },
      { id: 'dialogo', icon: '🗣️', name: 'Abrir diálogo com os líderes', desc: 'Pode acalmar ou virar palanque para eles.', fx: E({ pop: 1, img: 0.5 }, { pop: 1 }, { pop: 0.5 }), risco: { p: 0.35, fx: { pop: -1.5, img: -1 } } },
      { id: 'ignorar', icon: '🚪', name: 'Ignorar as ruas', desc: 'Economiza, mas o protesto pode crescer.', fx: E({ pop: -3, img: -1 }, { pop: -1 }, { pop: -1.5 }) },
    ],
  },
  {
    id: 'racionamento', icon: '💡', nome: 'O racionamento de energia', insp: 'Inspirado em crises hídricas e energéticas.',
    txt: { exec: 'Os reservatórios secaram e o governo estuda racionar energia. A população olha para você.', leg: 'Os reservatórios secaram e o Legislativo cobra explicações sobre o racionamento.', padrao: 'Os reservatórios secaram e há risco de racionamento de energia.' },
    padrao: 'racionar',
    ops: [
      { id: 'campanha', icon: '📣', name: 'Campanha de economia', desc: 'Pede colaboração voluntária e custa 1 de Caixa.', cash: 1, fx: E({ pop: 1, eco: -0.5 }, { pop: 0.5 }, { pop: 0.5 }) },
      { id: 'racionar', icon: '🔌', name: 'Impor racionamento', desc: 'Resolve rápido, mas desagrada.', fx: E({ pop: -2, eco: -1.5, img: 0.5 }, { pop: -0.5 }, { pop: -1 }) },
      { id: 'usinas', icon: '⚡', name: 'Anunciar usinas emergenciais', desc: 'Custa 3 de Caixa e dá fôlego depois.', cash: 3, fx: E({ eco: 1, pop: 1, img: 1 }, { eco: 0.5 }, { eco: 0.5 }) },
    ],
  },
  {
    id: 'caixa', icon: '💼', nome: 'O escândalo do Caixa Pequeno', insp: 'Inspirado em escândalos de pagamentos a parlamentares.',
    txt: { exec: 'Um ex-assessor contou que partidos recebiam pagamentos mensais para votar com o governo. Seu nome ainda não apareceu.', leg: 'Um ex-assessor contou que partidos recebiam pagamentos mensais para votar com o governo. Seu partido está citado.', padrao: 'Um escândalo de pagamentos a parlamentares dominou os noticiários.' },
    padrao: 'calar',
    ops: [
      { id: 'cooperar', icon: '📂', name: 'Abrir tudo e cooperar', desc: 'Ganha confiança, pode machucar aliados.', fx: E({ img: 2.5, cong: -2 }, { img: 2, cong: -1.5 }, { img: 1.5 }) },
      { id: 'calar', icon: '🤐', name: 'Calar e torcer', desc: 'Silêncio pode valer ou virar prova.', fx: E({}, {}, {}), risco: { p: 0.4, fx: { img: -3.5, cong: -1 } } },
      { id: 'atacar', icon: '🔥', name: 'Contra-atacar a fonte', desc: 'Você tenta desacreditar quem denunciou.', fx: E({ cong: 1.5, img: -1.5 }, { cong: 1, img: -1 }, { img: -1 }), sujo: true },
    ],
  },
  {
    id: 'gripe', icon: '🦠', nome: 'A Gripe Alvorada', insp: 'Inspirada em surtos e pandemias.',
    txt: { exec: 'Um surto de gripe forte lotou hospitais. Pedem medidas de saúde pública e ninguém sabe o quanto vai piorar.', leg: 'Um surto de gripe lotou hospitais e o Legislativo discute verbas emergenciais para a saúde.', padrao: 'Um surto de gripe lotou hospitais e preocupa a população.' },
    padrao: 'minimo',
    ops: [
      { id: 'campanha', icon: '💉', name: 'Campanha de vacinação e prevenção', desc: 'Custa 3 de Caixa e protege bastante.', cash: 3, fx: E({ soc: 2, pop: 1.5, img: 1 }, { soc: 1, img: 1 }, { soc: 1, pop: 1 }) },
      { id: 'minimo', icon: '📋', name: 'Orientações básicas', desc: 'Barato e pouco efetivo.', fx: E({ soc: 0.3 }, { soc: 0.2 }, { soc: 0.2 }), risco: { p: 0.4, fx: { soc: -2, pop: -1.5 } } },
      { id: 'negar', icon: '🙈', name: 'Minimizar o problema', desc: 'Economiza e arrisca muito.', fx: E({ img: -1 }, { img: -0.5 }, { img: -0.5 }), risco: { p: 0.6, fx: { soc: -3, pop: -3, img: -2 } } },
    ],
  },
  {
    id: 'copa', icon: '🏟️', nome: 'O megaevento esportivo', insp: 'Inspirado em Copas e Olimpíadas sediadas no país.',
    txt: { exec: 'O país foi escolhido para sediar um megaevento esportivo. Há obra, orgulho e muita polêmica sobre os gastos.', leg: 'O país vai sediar um megaevento esportivo e o plenário vota o orçamento das obras.', padrao: 'Um megaevento esportivo vem aí e a cidade debate obras e gastos.' },
    padrao: 'moderado',
    ops: [
      { id: 'grandioso', icon: '🏆', name: 'Apostar alto no evento', desc: 'Custa 3 de Caixa, rende orgulho e pode virar elefante branco.', cash: 3, fx: E({ pop: 3, img: 1.5 }, { pop: 1.5 }, { pop: 2 }), risco: { p: 0.35, fx: { img: -3, eco: -1 } } },
      { id: 'moderado', icon: '⚖️', name: 'Orçamento moderado', desc: 'Evita exageros, deixa menos aplauso.', fx: E({ pop: 1, img: 0.5 }, { pop: 0.5 }, { pop: 0.5 }) },
      { id: 'recusar', icon: '✋', name: 'Questionar os gastos', desc: 'Ganha quem acha que há prioridades melhores.', fx: E({ img: 1, pop: -1.5 }, { img: 1 }, { img: 0.5, pop: -1 }) },
    ],
  },
  {
    id: 'constituinte', icon: '📜', nome: 'A Assembleia dos Cem Dias', insp: 'Inspirada em processos constituintes.',
    txt: { exec: 'Uma assembleia especial foi convocada para rever regras importantes do país. Dá tempo de influenciar o texto.', leg: 'Uma assembleia especial vai rever regras importantes do país e todo parlamentar quer deixar marca.', padrao: 'Uma assembleia especial revê as regras do país e a população acompanha de perto.' },
    padrao: 'neutro',
    ops: [
      { id: 'liderar', icon: '🖋️', name: 'Liderar uma frente', desc: 'Dá trabalho e visibilidade.', fx: E({ cong: 2, img: 1 }, { cong: 2.5, img: 1.5 }, { cong: 1.5, img: 1 }) },
      { id: 'acompanhar', icon: '👀', name: 'Acompanhar de perto', desc: 'Sem riscos, sem ganho grande.', fx: E({ cong: 0.5 }, { cong: 0.5 }, { cong: 0.3 }) },
      { id: 'neutro', icon: '🕊️', name: 'Ficar de fora', desc: 'Foco em outras pautas.', fx: E({}, {}, {}) },
    ],
  },
]
