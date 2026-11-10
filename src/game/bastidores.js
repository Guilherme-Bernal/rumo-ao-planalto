// BLOCO 31: gabinete vivo (ministros com agenda própria), redes e boatos como mini-jogo e missões de bastidor.
// Só dados e textos. A lógica fica no motor.

/* ---------- ministros ---------- */
export const MIN_BASE = {
  tecnico: { lealdade: 62, amb: 0.2 },
  politico: { lealdade: 52, amb: 0.6 },
  amigo: { lealdade: 78, amb: 0.3 },
  militar: { lealdade: 70, amb: 0.3 },
}
export const MIN_AGENDAS = {
  economia: ['ajuste fiscal duro', 'estímulo ao crédito', 'reforma tributária'],
  saude: ['mais verba para o SUS', 'creches e escolas em tempo integral', 'piso para professores'],
  seguranca: ['mais viaturas e inteligência', 'reforma das polícias', 'presídios novos'],
  defesa: ['reequipar as forças', 'indústria de defesa', 'mais presença na fronteira'],
}
export const MIN_EVENTOS = {
  pedido: {
    icon: '📨', padrao: 'negar', min: () => true,
    titulo: (m, p) => `${m.nome} pede apoio na ${p}`,
    texto: (m) => `${m.nome} chegou ao gabinete com um pedido: precisa de respaldo para tocar a agenda "${m.agenda}". Diz que sem isso trava a pasta.`,
    ops: [
      { id: 'atender', icon: '✅', name: 'Atender', desc: 'Custa caixa, rende lealdade e entrega na pasta.', cash: 2, fx: { cong: 0.5 }, leal: 10, stat: 1 },
      { id: 'negociar', icon: '🤝', name: 'Negociar um meio-termo', desc: 'Pode agradar, pode irritar.', fx: {}, leal: 0, sorte: { p: 0.55, ok: { leal: 4 }, fail: { leal: -6 } } },
      { id: 'negar', icon: '🚫', name: 'Negar', desc: 'Economiza, mas o ministro fica ressentido.', fx: {}, leal: -10 },
    ],
  },
  demissao: {
    icon: '🎤', padrao: 'aceitar', min: (m) => m.lealdade < 40,
    titulo: (m, p) => `${m.nome} avisa que vai deixar a ${p}`,
    texto: (m) => `${m.nome} marcou uma coletiva para anunciar a saída e prometeu um discurso. O que você faz antes que isso vire manchete?`,
    ops: [
      { id: 'segurar', icon: '🧲', name: 'Segurar com um agrado', desc: 'Custa caixa e base, mas ele fica.', cash: 3, fx: { cong: -0.5 }, leal: 22 },
      { id: 'aceitar', icon: '👋', name: 'Aceitar a saída', desc: 'Pasta fica vaga. O discurso depende do perfil dele.', fx: {}, sai: 'discurso' },
      { id: 'revidar', icon: '🔥', name: 'Revidar antes do discurso', desc: 'Você sai na frente, mas vira briga pública.', fx: { pop: 1, img: -1.5 }, sai: 'briga' },
    ],
  },
  traicao: {
    icon: '🗡️', padrao: 'enfrentar', min: (m) => m.lealdade < 32 && m.amb >= 0.4,
    titulo: (m) => `${m.nome} conspira contra você`,
    texto: (m) => `Corre nos corredores que ${m.nome} anda conversando com a oposição e passando informação. Ainda dá para reagir.`,
    ops: [
      { id: 'demitir', icon: '✂️', name: 'Demitir já', desc: 'Corta o mal pela raiz, com algum desgaste.', fx: { cong: -1, img: 0.5 }, sai: 'demitido' },
      { id: 'enfrentar', icon: '🗣️', name: 'Enfrentar em conversa franca', desc: 'Pode recuperar a lealdade ou explodir.', fx: {}, leal: 0, sorte: { p: 0.5, ok: { leal: 18 }, fail: { leal: -8, fx: { img: -3 } } } },
      { id: 'comprar', icon: '💰', name: 'Comprar com cargo e verba', desc: 'Compra a calma, mas pega mal se vazar.', cash: 4, fx: { img: -1 }, leal: 22, sujo: true },
    ],
  },
  candidatura: {
    icon: '🗳️', padrao: 'barrar', min: (m) => m.amb >= 0.5,
    titulo: (m) => `${m.nome} quer disputar a eleição`,
    texto: (m) => `${m.nome} acha que chegou a hora de um voo próprio e pediu para deixar a pasta e disputar um cargo. Dependendo do que você fizer, pode virar parceiro ou adversário.`,
    ops: [
      { id: 'apoiar', icon: '🤝', name: 'Apoiar a candidatura', desc: 'Ele sai amigo e deixa gente na sua base.', fx: { cong: 1.5, img: 0.5 }, sai: 'aliado' },
      { id: 'segurar', icon: '🧲', name: 'Pedir que espere', desc: 'Custa caixa e ele fica por ora.', cash: 3, fx: {}, leal: 8 },
      { id: 'barrar', icon: '⛔', name: 'Barrar a saída', desc: 'Ele sai magoado e vira candidato contra você.', fx: { cong: -1 }, sai: 'rival' },
    ],
  },
}
export const MIN_SAIDA = {
  discurso: { tecnico: { fx: { img: -2.5 }, t: (m) => `${m.nome} deixou o governo com um discurso técnico e duro sobre "decisões políticas que travaram a pasta".` }, politico: { fx: { cong: -3 }, t: (m) => `${m.nome} levou o partido junto e deixou a base balançando.` }, amigo: { fx: { img: -1, pop: -0.5 }, t: (m) => `${m.nome} saiu chorando na coletiva e dizendo que foi "traído pelo amigo".` }, militar: { fx: { img: -1.5 }, t: (m) => `${m.nome} deixou o cargo em nota seca e sem uma palavra de despedida.` } },
  briga: { fx: { img: -1 }, t: (m) => `${m.nome} e você trocaram acusações pela imprensa. A saída virou espetáculo.` },
  demitido: { fx: {}, t: (m) => `${m.nome} foi demitido(a) por quebra de confiança.` },
  aliado: { fx: {}, t: (m) => `${m.nome} deixou o governo para se candidatar com seu apoio e promete lealdade.` },
  rival: { fx: {}, t: (m) => `${m.nome} deixou o governo magoado(a) e lançou candidatura contra você.` },
}

/* ---------- redes: pautas e ondas ---------- */
export const PAUTAS = [
  { id: 'emprego', icon: '💼', name: 'Pauta do emprego', desc: 'Vagas, renda e carteira assinada.', cash: 1, p: 0.55, stat: 'eco', ok: { pop: 2.5, eco: 0.8 }, fail: { pop: -1 }, humor: 7 },
  { id: 'seguranca', icon: '🛡️', name: 'Pauta da segurança', desc: 'Ordem nos bairros e apoio à polícia.', cash: 1, p: 0.55, stat: 'seg', ok: { pop: 2, seg: 0.8 }, fail: { pop: -1, img: -0.5 }, humor: 5 },
  { id: 'saude', icon: '🩺', name: 'Pauta da saúde', desc: 'Fila zero e remédio de graça.', cash: 1, p: 0.55, stat: 'soc', ok: { pop: 2.2, soc: 0.8 }, fail: { pop: -1 }, humor: 6 },
  { id: 'moral', icon: '🧼', name: 'Pauta da moralização', desc: 'Transparência e combate à corrupção. Sobe a barra e pode voltar contra você.', cash: 0, p: 0.5, stat: 'img', ok: { img: 3, pop: 1 }, fail: { img: -2.5 }, humor: 4, pesada: true },
  { id: 'nacional', icon: '🇧🇷', name: 'Pauta do orgulho nacional', desc: 'Bandeira na janela e clima de união.', cash: 0, p: 0.6, stat: 'pop', ok: { pop: 3 }, fail: { img: -1 }, humor: 10 },
  { id: 'cortina', icon: '🎭', name: 'Cortina de fumaça', desc: 'Joga outro assunto para o ar e abafa a onda ativa. Gasta o seu crédito.', cash: 1, p: 0.6, stat: 'pop', ok: { img: -1 }, fail: { img: -2, pop: -1 }, humor: -4, abafa: true, sujo: true },
]
export const ONDAS = [
  { id: 'fake', icon: '🕷️', nome: 'Onda de fake news', texto: 'Uma foto adulterada espalhou boato sobre a sua gestão.' },
  { id: 'boicote', icon: '📉', nome: 'Boicote nas redes', texto: 'Uma hashtag pediu boicote às suas decisões.' },
  { id: 'meme', icon: '😂', nome: 'Meme que pegou', texto: 'Um meme ridiculariza uma frase sua e já passou de um milhão de compartilhamentos.' },
  { id: 'robo', icon: '🤖', nome: 'Exército de perfis falsos', texto: 'Perfis falsos coordenados inflam a revolta contra você.' },
]
export const ONDA_RESP = [
  { id: 'checar', icon: '🔎', name: 'Checar e desmentir', desc: 'Material de agências de checagem. Quase sempre funciona.', cash: 2, p: 0.75, ok: { forca: -38, fx: { img: 0.8 } }, fail: { forca: -10 } },
  { id: 'contra', icon: '📢', name: 'Contra-narrativa', desc: 'Só funciona se o clima estiver a seu favor. Senão, vira lenha.', p: 0.5, humor: 50, ok: { forca: -50, fx: { pop: 1 } }, fail: { forca: 8, fx: { img: -2 } } },
  { id: 'processar', icon: '⚖️', name: 'Acionar a Justiça', desc: 'Derruba rápido, mas é lento e caro.', cash: 3, p: 0.5, ok: { forca: -60, fx: { img: 0.5 } }, fail: { forca: -5, fx: { cash: -1 } } },
  { id: 'ignorar', icon: '🤐', name: 'Ignorar', desc: 'Grátis, mas a onda cresce.', p: 1, ok: { forca: 8 }, fail: { forca: 8 } },
]

/* ---------- missões de bastidor ---------- */
// p = chance base; bonus = atributo que ajuda (cada 10 pontos acima de 50 soma 3%)
const O = (id, icon, name, desc, p, bonus, ok, fail, extra = {}) => ({ id, icon, name, desc, p, bonus, ok, fail, ...extra })
export const MISSOES = [
  {
    id: 'cpi', icon: '🕵️', titulo: 'Evitar a CPI', cond: 'heat', pers: ['relator', 'lider'],
    intro: (c) => `Uma CPI está para ser instalada e o relator, ${c.relator}, é do outro lado. O líder ${c.lider} acha que ainda dá para barrar. Você tem três movimentos.`,
    passos: [
      { t: (c) => `Contar as assinaturas. ${c.lider} traz a planilha: faltam poucos nomes para a CPI sair.`, ops: [
        O('a', '📞', 'Ligar para os indecisos', 'Conversa individual, nome a nome.', 0.5, 'cong', 'Dois indecisos recuaram da assinatura.', 'Os indecisos enrolaram e o placar segue apertado.'),
        O('b', '📣', 'Pressionar pela imprensa', 'Pauta o assunto como "perseguição política".', 0.45, 'pop', 'A narrativa pegou e três assinaturas caíram.', 'Virou holofote e atraiu mais gente para a CPI.'),
      ] },
      { t: (c) => `${c.relator} aceita uma conversa reservada. Dá para negociar o escopo da investigação.`, ops: [
        O('a', '🤝', 'Oferecer cargo para o partido dele', 'Gesto político clássico, com risco de vazar.', 0.55, 'cong', 'Ele aceitou reduzir o escopo.', 'Vazou que você ofereceu cargo. A imagem pagou.', { sujo: true, failFx: { img: -2 } }),
        O('b', '📄', 'Entregar documentos por conta própria', 'Mostra que não há o que esconder.', 0.5, 'img', 'Os documentos esvaziaram boa parte da denúncia.', 'Os documentos abriram novas perguntas.', { cash: 1 }),
      ] },
      { t: () => 'A CPI está no plenário. É a votação final: tudo depende de quem comparece.', ops: [
        O('a', '🏃', 'Mobilizar a base para obstruir', 'Quórum baixo derruba a instalação.', 0.5, 'cong', 'Faltou quórum e a CPI caiu.', 'A oposição trouxe todo mundo e a CPI saiu.'),
        O('b', '🗳️', 'Propor uma comissão alternativa mais branda', 'Menos poder de investigação, menos estrago.', 0.55, 'img', 'A comissão alternativa foi aprovada e acalmou os ânimos.', 'A manobra foi vista como tentativa de abafar.', { cash: 1 }),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'CPI arquivada', txt: 'Você barrou a CPI. Alguns acham que foi habilidade, outros que foi acordo.', fx: { img: 1, cong: 1 }, heat: -14 },
      { min: 2, titulo: 'CPI esvaziada', txt: 'A CPI saiu, mas sem poder. O relatório foi para a gaveta.', fx: { img: 0 }, heat: -5 },
      { min: 0, titulo: 'CPI instalada', txt: 'A CPI foi instalada e vai render manchete por meses.', fx: { img: -4, cong: -1 }, heat: 8 },
    ],
  },
  {
    id: 'pec', icon: '🏛️', titulo: 'Salvar a votação da PEC', cond: 'pec', pers: ['lider', 'indeciso'],
    intro: (c) => `A PEC que você defende está no limite. O líder ${c.lider} diz que faltam votos, e o deputado ${c.indeciso} é o fiel da balança.`,
    passos: [
      { t: (c) => `${c.indeciso} marcou uma conversa: quer ser ouvido antes de votar.`, ops: [
        O('a', '👂', 'Ouvir e anotar as demandas', 'Mostra respeito, ganha tempo.', 0.55, 'img', 'Ele saiu satisfeito e sinalizou voto a favor.', 'Ele saiu cobrando mais do que você podia dar.'),
        O('b', '💼', 'Prometer emendas à base eleitoral dele', 'Efetivo, mas caro.', 0.6, 'cong', 'A promessa de emendas comprou o voto.', 'Ele pegou a promessa e votou contra mesmo assim.', { cash: 2 }),
      ] },
      { t: () => 'A véspera da votação. A base está dividida e a oposição faz vigília.', ops: [
        O('a', '🍽️', 'Jantar com a bancada', 'Conversa informal para fechar fileiras.', 0.5, 'cong', 'O jantar uniu a bancada.', 'O jantar virou reclamação coletiva.', { cash: 1 }),
        O('b', '📺', 'Pronunciamento em rede nacional', 'Pressão popular sobre os deputados.', 0.45, 'pop', 'A pressão popular foi notada no plenário.', 'O discurso foi acusado de tentar coagir o Legislativo.', { failFx: { img: -1.5 } }),
      ] },
      { t: (c) => `No plenário, ${c.lider} avisa: a contagem está por um voto. Último lance.`, ops: [
        O('a', '📱', 'Ligar para os faltosos', 'Garante presença de quem sumiu.', 0.55, 'cong', 'Dois faltosos apareceram e o placar virou.', 'Os faltosos não responderam.'),
        O('b', '⏳', 'Pedir adiamento da votação', 'Ganha mais um dia, perde o ímpeto.', 0.5, 'img', 'O adiamento deu fôlego e o voto veio.', 'O adiamento passou recibo de fraqueza.'),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'PEC aprovada', txt: 'Placar apertado, mas passou. Quem estava lá fala em "obra de articulação".', fx: { cong: 3, pop: 1.5, img: 1 } },
      { min: 2, titulo: 'PEC aprovada com cicatrizes', txt: 'Passou por um voto, mas a base saiu rachada.', fx: { cong: 0, pop: 1 } },
      { min: 0, titulo: 'PEC derrubada', txt: 'A PEC caiu no plenário. A oposição comemorou nas redes.', fx: { cong: -3, pop: -1.5, img: -1 } },
    ],
  },
  {
    id: 'centrao', icon: '🎩', titulo: 'Negociar com o centrão', cond: 'cong', pers: ['cacique', 'emissario'],
    intro: (c) => `O governo precisa de base. O cacique ${c.cacique} controla um bloco grande e mandou o emissário ${c.emissario} dizer que "dá para conversar".`,
    passos: [
      { t: (c) => `${c.emissario} traz a lista do que o bloco quer. Tem pasta, verba e uma cadeira numa comissão.`, ops: [
        O('a', '📑', 'Aceitar a lista quase inteira', 'Fecha rápido, cobra caro.', 0.65, 'cong', 'Eles se deram por satisfeitos e abriram a mesa.', 'Eles acharam pouco e pediram mais.', { cash: 3 }),
        O('b', '✂️', 'Cortar a lista pela metade', 'Mais barato, mais arriscado.', 0.4, 'img', 'Eles toparam com cara de paciência.', 'Eles saíram da sala batendo a porta.'),
      ] },
      { t: (c) => `${c.cacique} marca um almoço em casa dele. É a hora de olho no olho.`, ops: [
        O('a', '🍖', 'Ir sozinho e ouvir', 'Gesto de respeito que costuma render.', 0.55, 'img', 'O almoço correu bem e ele relaxou.', 'O almoço foi frio e cheio de indiretas.'),
        O('b', '🤝', 'Levar o líder do governo', 'Mostra força institucional.', 0.5, 'cong', 'Com o líder junto, a conversa foi direto ao ponto.', 'Ele se sentiu cercado e fechou a cara.'),
      ] },
      { t: () => 'Falta selar o acordo por escrito, e a imprensa já fareja.', ops: [
        O('a', '🤫', 'Selar em reservado, sem divulgar', 'Rápido e discreto, mas se vazar, vira escândalo.', 0.5, 'img', 'O acordo foi selado sem barulho.', 'O acordo vazou como "toma lá, dá cá".', { failFx: { img: -3 }, sujo: true }),
        O('b', '📢', 'Anunciar como "coalizão programática"', 'Mais transparência, mais debate.', 0.5, 'pop', 'O anúncio foi bem recebido e legitimou o acordo.', 'A coalizão foi vista como pura distribuição de cargos.'),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'Base fechada', txt: 'O bloco entrou no governo com termo claro e sem escândalo.', fx: { cong: 6, img: 0.5 }, cash: -2 },
      { min: 2, titulo: 'Base entregue a duras penas', txt: 'Fechou, mas com cobrança permanente de cada voto.', fx: { cong: 3, img: -0.5 }, cash: -3 },
      { min: 0, titulo: 'Rompimento', txt: 'O bloco rompeu e foi para a oposição.', fx: { cong: -3, img: -1 } },
    ],
  },
  {
    id: 'dossie', icon: '📂', titulo: 'O dossiê que apareceu', cond: 'tempo', pers: ['jornalista', 'advogado'],
    intro: (c) => `A jornalista ${c.jornalista} ligou: tem um dossiê sobre sua gestão. O advogado ${c.advogado} pede calma e estratégia.`,
    passos: [
      { t: () => 'O primeiro passo é saber se o material é verdadeiro.', ops: [
        O('a', '🔍', 'Contratar uma perícia independente', 'Custa caro, mas dá segurança.', 0.65, 'img', 'A perícia apontou fragilidades no dossiê.', 'A perícia confirmou parte do conteúdo.', { cash: 2 }),
        O('b', '🧑‍⚖️', 'Pedir ao advogado uma análise rápida', 'Mais barato e menos conclusivo.', 0.5, 'img', 'A análise deu munição para contestar.', 'A análise foi inconclusiva.'),
      ] },
      { t: (c) => `${c.jornalista} dá um prazo: publica amanhã, com ou sem resposta.`, ops: [
        O('a', '🎙️', 'Dar entrevista exclusiva', 'Controla a narrativa, se acertar o tom.', 0.5, 'pop', 'A entrevista humanizou a história.', 'A entrevista piorou o cenário.', { failFx: { img: -2 } }),
        O('b', '⚖️', 'Entrar com liminar para barrar a publicação', 'Pode parecer censura.', 0.4, 'img', 'A liminar foi concedida.', 'A liminar foi negada e o gesto virou pauta.', { failFx: { img: -2 } }),
      ] },
      { t: () => 'O texto saiu. Falta decidir a resposta.', ops: [
        O('a', '🧾', 'Divulgar nota oficial com documentos', 'Transparência total.', 0.55, 'img', 'A nota calou boa parte das dúvidas.', 'A nota abriu outras frentes de pergunta.'),
        O('b', '🚪', 'Deixar o assunto morrer', 'Silêncio estratégico.', 0.45, 'pop', 'O assunto esfriou sozinho.', 'O silêncio foi lido como culpa.'),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'Dossiê desmontado', txt: 'O dossiê perdeu força e quem vazou saiu menor do que entrou.', fx: { img: 2, pop: 0.5 } },
      { min: 2, titulo: 'Dossiê neutralizado', txt: 'Arranhou, mas passou.', fx: { img: -0.5 } },
      { min: 0, titulo: 'Dossiê pega', txt: 'A história colou e vai render muita manchete.', fx: { img: -5, pop: -1.5 }, heat: 8 },
    ],
  },
  {
    id: 'greve', icon: '🚛', titulo: 'Fim da greve dos caminhoneiros', cond: 'exec', pers: ['sindicalista', 'ministro'],
    intro: (c) => `As estradas estão paradas. O líder sindical ${c.sindicalista} exige reunião e o ministro ${c.ministro} quer endurecer. Você escolhe como conduzir.`,
    passos: [
      { t: (c) => `${c.sindicalista} impõe uma condição: só conversa com quem tem poder de decisão.`, ops: [
        O('a', '🛬', 'Receber pessoalmente', 'Gesto forte, risco alto.', 0.5, 'pop', 'O encontro abriu o diálogo.', 'O líder aproveitou para fazer discurso.'),
        O('b', '📨', 'Mandar o ministro com carta branca', 'Preserva você, dilui o gesto.', 0.5, 'cong', 'O ministro costurou um começo de acordo.', 'O ministro foi desautorizado pela categoria.'),
      ] },
      { t: () => 'A categoria pede subsídio do diesel. O caixa está sob pressão.', ops: [
        O('a', '⛽', 'Conceder subsídio temporário', 'Resolve rápido, custa caixa.', 0.7, 'eco', 'O subsídio acalmou a categoria.', 'O subsídio não bastou e a greve continua.', { cash: 3 }),
        O('b', '🧮', 'Oferecer renegociação de dívida e frete mínimo', 'Menos caixa, mais conversa.', 0.5, 'img', 'A proposta pareceu justa.', 'Pareceu pouco e acirrou os ânimos.'),
      ] },
      { t: () => 'O abastecimento está comprometido. É preciso desbloquear as rodovias.', ops: [
        O('a', '🪖', 'Chamar a força pública', 'Resolve rápido, mas custa imagem.', 0.7, 'seg', 'As rodovias foram liberadas.', 'A operação acirrou o conflito.', { failFx: { img: -2 }, sujo: true }),
        O('b', '🤝', 'Selar o acordo e pedir o fim do bloqueio', 'Depende da palavra do líder.', 0.5, 'img', 'O líder cumpriu e as estradas foram liberadas.', 'Parte da categoria não aceitou e o bloqueio seguiu.'),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'Greve encerrada', txt: 'As estradas abriram e o país respirou.', fx: { pop: 2, eco: 1 } },
      { min: 2, titulo: 'Greve encerrada pela metade', txt: 'Parte voltou ao trabalho, parte aguarda cumprimento.', fx: { pop: 0.5 } },
      { min: 0, titulo: 'Greve se arrasta', txt: 'O abastecimento sofreu e o clima ficou pesado.', fx: { pop: -3, eco: -2, img: -1 } },
    ],
  },
  {
    id: 'orcamento', icon: '🧮', titulo: 'Fechar o orçamento', cond: 'caixa', pers: ['secretario', 'relator'],
    intro: (c) => `O orçamento não fecha. O secretário ${c.secretario} mostra o rombo e o relator ${c.relator} segura a votação. Há três frentes.`,
    passos: [
      { t: (c) => `${c.secretario} propõe frentes de corte. Cada uma mexe com alguém.`, ops: [
        O('a', '✂️', 'Cortar custeio da máquina', 'Impopular entre servidores, bom para o caixa.', 0.6, 'img', 'O corte foi absorvido sem muito barulho.', 'O corte gerou reação do funcionalismo.'),
        O('b', '🛑', 'Segurar obras novas', 'Poupa caixa e cria fila de reclamação.', 0.6, 'eco', 'As obras foram reprogramadas sem crise.', 'As obras paradas viraram assunto de jornal.'),
      ] },
      { t: () => 'Para fechar a conta, falta receita.', ops: [
        O('a', '🏦', 'Antecipar receitas e vender ativos', 'Alivia agora, cobra no futuro.', 0.6, 'eco', 'A antecipação entrou sem grande reação.', 'A venda de ativos virou crítica de entreguismo.'),
        O('b', '🧾', 'Reforçar arrecadação e cobrar dívida ativa', 'Efeito mais lento.', 0.5, 'img', 'Entrou mais caixa do que o esperado.', 'A arrecadação decepcionou.'),
      ] },
      { t: (c) => `${c.relator} só põe em votação se houver negociação com a base.`, ops: [
        O('a', '🤝', 'Negociar emendas de bancada', 'Garante aprovação, gasta caixa.', 0.65, 'cong', 'O relator liberou a votação.', 'O relator pediu mais e atrasou.', { cash: 2 }),
        O('b', '📺', 'Fazer uma campanha pública de responsabilidade fiscal', 'Pressão popular.', 0.45, 'pop', 'A pressão popular convenceu o relator.', 'A campanha foi lida como oportunismo.'),
      ] },
    ],
    fim: [
      { min: 3, titulo: 'Orçamento fechado', txt: 'As contas fecharam sem sacrificar o essencial.', fx: { img: 1.5, eco: 0.5 }, cash: 6 },
      { min: 2, titulo: 'Orçamento remendado', txt: 'Fechou, com remendos que vão cobrar caro depois.', fx: {}, cash: 3 },
      { min: 0, titulo: 'Orçamento travado', txt: 'O orçamento não passou e o governo ficou no vermelho.', fx: { img: -2, eco: -1 }, cash: -3 },
    ],
  },
]
