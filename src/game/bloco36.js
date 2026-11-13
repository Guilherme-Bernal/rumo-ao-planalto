// BLOCO 36: fundação contra a repetição.
// 1) cenários sorteados por mandato, 2) identidade de cada UF, 3) contexto que muda as leis.
// Só dados: a lógica fica no engine.js.

// quente: temas em alta (lei mais fácil e mais forte). frio: temas em baixa.
// fx: efeito leve por rodada. sin: efeito por rodada conforme o setor forte do estado.
export const CENARIOS = [
  {
    id: 'fiscal', nome: 'Crise fiscal', ico: '📉', desc: 'O caixa do país está apertado e todo mundo cobra corte.',
    quente: ['tributos', 'economia'], frio: ['social', 'cultura', 'habitacao'],
    fx: { cash: -0.15 }, sin: { publico: { pop: -0.2 }, industria: { eco: -0.15 } },
    focos: ['em tempos de aperto', 'com responsabilidade fiscal'],
    eventos: [
      { titulo: 'Credores batem à porta', texto: 'Os bancos querem renegociar a dívida e exigem um plano de ajuste.', padrao: 'adiar',
        ops: [{ id: 'ajuste', name: 'Anunciar o ajuste', icon: '✂️', desc: 'Corta gastos agora.', fx: { cash: 5, pop: -2, img: 1 } }, { id: 'adiar', name: 'Empurrar com a barriga', icon: '⏳', desc: 'Ganha tempo e perde confiança.', fx: { cash: -2, img: -1 } }] },
      { titulo: 'Servidores ameaçam greve', texto: 'Sem reajuste há anos, as categorias do setor público cobram uma resposta em {estado}.', padrao: 'negociar',
        ops: [{ id: 'negociar', name: 'Negociar parcelado', icon: '🤝', desc: 'Divide a conta no tempo.', fx: { cash: -2, soc: 1 } }, { id: 'recusar', name: 'Bater o pé', icon: '🛑', desc: 'Segura o caixa e perde a rua.', fx: { cash: 2, pop: -3, soc: -1 } }] },
      { titulo: 'Investidor ensaia sair', texto: 'Uma grande empresa do setor de {setor} ameaça cortar investimento se não houver previsibilidade.', padrao: 'garantir',
        ops: [{ id: 'garantir', name: 'Oferecer garantias', icon: '📜', desc: 'Segura o investimento.', fx: { eco: 2, cash: -2 } }, { id: 'deixar', name: 'Deixar ir', icon: '🚪', desc: 'Poupa o caixa e esfria a economia.', fx: { eco: -2, cash: 1 } }] },
    ],
  },
  {
    id: 'boom', nome: 'Onda de crescimento', ico: '🚀', desc: 'A economia aquece e os empresários querem investir.',
    quente: ['ciencia', 'trabalho', 'economia'], frio: ['tributos'],
    fx: { eco: 0.3, cash: 0.2 }, sin: { tecnologia: { eco: 0.4 }, industria: { eco: 0.3, pop: 0.1 } },
    focos: ['aproveitando a boa fase', 'para sustentar o crescimento'],
    eventos: [
      { titulo: 'Fábrica quer se instalar', texto: 'Uma multinacional escolhe entre {estado} e o vizinho para abrir uma planta.', padrao: 'incentivo',
        ops: [{ id: 'incentivo', name: 'Dar incentivo fiscal', icon: '🎁', desc: 'Atrai empregos e abre mão de receita.', fx: { eco: 3, cash: -3, pop: 1 } }, { id: 'sem', name: 'Sem benefício', icon: '🧾', desc: 'Mantém o caixa e arrisca perder.', fx: { cash: 1, eco: -1 } }] },
      { titulo: 'Falta mão de obra', texto: 'As empresas reclamam que não acham gente qualificada para as vagas abertas.', padrao: 'curso',
        ops: [{ id: 'curso', name: 'Cursos técnicos com a indústria', icon: '🛠️', desc: 'Investe em qualificação.', fx: { eco: 2, soc: 1, cash: -2 } }, { id: 'imigracao', name: 'Deixar o mercado resolver', icon: '📈', desc: 'Sem custo, resultado lento.', fx: { eco: 0.5 } }] },
      { titulo: 'Preços sobem junto', texto: 'O aquecimento pesa no aluguel e na comida. A oposição fala em carestia.', padrao: 'subsidio',
        ops: [{ id: 'subsidio', name: 'Aliviar o bolso', icon: '🛒', desc: 'Um subsídio pontual.', fx: { pop: 2, cash: -3 } }, { id: 'esperar', name: 'Confiar no mercado', icon: '⌛', desc: 'Não gasta, não agrada.', fx: { pop: -2, cash: 1 } }] },
    ],
  },
  {
    id: 'seca', nome: 'Seca e crise hídrica', ico: '🏜️', desc: 'Falta chuva, os reservatórios baixam e o campo sente primeiro.',
    quente: ['ambiente', 'saude', 'social'], frio: ['cultura'],
    fx: { soc: -0.1 }, sin: { agro: { eco: -0.4 }, pecuaria: { eco: -0.35 }, turismo: { eco: -0.1 } },
    focos: ['diante da seca', 'com plano de água e clima'],
    eventos: [
      { titulo: 'Racionamento à vista', texto: 'Os reservatórios de {estado} estão no limite e a concessionária pede medidas.', padrao: 'racionar',
        ops: [{ id: 'racionar', name: 'Decretar racionamento', icon: '🚰', desc: 'Impopular, mas evita colapso.', fx: { pop: -2, soc: 2, img: 1 } }, { id: 'campanha', name: 'Só campanha de economia', icon: '📣', desc: 'Barato e arriscado.', fx: { cash: -1, soc: -1 } }] },
      { titulo: 'Produtores pedem socorro', texto: 'O setor de {setor} perdeu safra e quer renegociar dívidas e crédito.', padrao: 'credito',
        ops: [{ id: 'credito', name: 'Crédito emergencial', icon: '💳', desc: 'Salva a safra seguinte.', fx: { eco: 2, cash: -3, pop: 1 } }, { id: 'negar', name: 'Negar socorro', icon: '🙅', desc: 'Poupa o caixa e irrita o campo.', fx: { cash: 1, eco: -1, pop: -2 } }] },
      { titulo: 'Poços e carros-pipa', texto: 'Bairros inteiros dependem de carro-pipa. Há quem explore a situação politicamente.', padrao: 'pipa',
        ops: [{ id: 'pipa', name: 'Reforçar o abastecimento', icon: '🚚', desc: 'Atende já.', fx: { soc: 2, cash: -2, pop: 1 } }, { id: 'obras', name: 'Prometer obra grande', icon: '🏗️', desc: 'Resolve no futuro, não agora.', fx: { img: 1, soc: -1 } }] },
    ],
  },
  {
    id: 'violencia', nome: 'Onda de violência', ico: '🚨', desc: 'Os índices de crime sobem e a segurança domina o debate.',
    quente: ['seguranca', 'etica'], frio: ['cultura', 'ambiente'],
    fx: { seg: -0.15 }, sin: { turismo: { eco: -0.2 }, servicos: { pop: -0.1 } },
    focos: ['contra a violência', 'com resposta de segurança'],
    eventos: [
      { titulo: 'Chacina na periferia', texto: 'O caso virou manchete nacional e {estado} cobra uma resposta firme.', padrao: 'forca',
        ops: [{ id: 'forca', name: 'Força-tarefa e presença policial', icon: '🚓', desc: 'Resposta visível.', fx: { seg: 3, cash: -2, img: -1 } }, { id: 'inteligencia', name: 'Investigação e inteligência', icon: '🕵️', desc: 'Mais lenta e mais duradoura.', fx: { seg: 2, img: 1, pop: -1 } }] },
      { titulo: 'Polícia em greve', texto: 'Sem reposição e com salário atrasado, a tropa ameaça cruzar os braços.', padrao: 'pagar',
        ops: [{ id: 'pagar', name: 'Pagar o atrasado', icon: '💵', desc: 'Evita o caos.', fx: { cash: -3, seg: 2 } }, { id: 'punir', name: 'Endurecer com a tropa', icon: '⚖️', desc: 'Arrisca a ordem nas ruas.', fx: { seg: -3, cong: 1 } }] },
      { titulo: 'Facção intimida o comércio', texto: 'Comerciantes denunciam cobrança de taxa por criminosos em bairros inteiros.', padrao: 'operacao',
        ops: [{ id: 'operacao', name: 'Grande operação', icon: '🛡️', desc: 'Mostra serviço, com risco.', fx: { seg: 3, pop: 1, img: -1 } }, { id: 'dialogo', name: 'Proteger quem denuncia', icon: '🔒', desc: 'Mais discreto.', fx: { seg: 1, soc: 1 } }] },
    ],
  },
  {
    id: 'polar', nome: 'Polarização nas ruas', ico: '⚡', desc: 'O país está dividido e cada decisão vira briga de torcida.',
    quente: ['etica', 'cultura', 'saudemental'], frio: ['tributos'],
    fx: { pop: -0.08, cong: -0.08 }, sin: { publico: { cong: -0.15 }, tecnologia: { img: -0.15 } },
    focos: ['em meio à polarização', 'com diálogo entre os lados'],
    eventos: [
      { titulo: 'Manifestação dos dois lados', texto: 'Dois atos opostos foram marcados para o mesmo dia em {estado}.', padrao: 'separar',
        ops: [{ id: 'separar', name: 'Separar os atos e reforçar a segurança', icon: '🚧', desc: 'Evita o confronto.', fx: { seg: 1, cash: -1 } }, { id: 'discurso', name: 'Fazer discurso de unidade', icon: '🕊️', desc: 'Pode agradar ou irritar.', fx: { img: 2, pop: -1 } }] },
      { titulo: 'Seu nome vira bandeira', texto: 'Um grupo adota você como símbolo, e o outro passa a te atacar nas redes.', padrao: 'moderar',
        ops: [{ id: 'abracar', name: 'Abraçar o apoio', icon: '🔥', desc: 'Cresce a torcida, cresce a rejeição.', fx: { pop: 3, img: -2, cong: -1 } }, { id: 'moderar', name: 'Marcar distância', icon: '🧊', desc: 'Perde empolgação, ganha respeito.', fx: { img: 1, pop: -1 } }] },
      { titulo: 'Boato de ruptura', texto: 'Circulam boatos de que aliados vão romper com o seu grupo por causa do clima político.', padrao: 'reuniao',
        ops: [{ id: 'reuniao', name: 'Reunir a base', icon: '🍽️', desc: 'Acalma os ânimos.', fx: { cong: 2, cash: -1 } }, { id: 'ignorar', name: 'Ignorar', icon: '🙈', desc: 'Pode esfriar sozinho, ou não.', fx: { cong: -2 } }] },
    ],
  },
  {
    id: 'escandalos', nome: 'Ressaca de escândalos', ico: '🕵️', desc: 'Operações e denúncias mantêm o país desconfiado de político.',
    quente: ['etica'], frio: ['economia'],
    fx: { img: -0.1 }, sin: { publico: { img: -0.2 } },
    focos: ['sob olhar da imprensa', 'com transparência total'],
    eventos: [
      { titulo: 'Vazamento envolve um aliado', texto: 'Mensagens de um aliado próximo caíram na imprensa e todos olham para você.', padrao: 'afastar',
        ops: [{ id: 'afastar', name: 'Afastar o aliado', icon: '🚪', desc: 'Custa a amizade e protege a imagem.', fx: { img: 2, cong: -2 } }, { id: 'defender', name: 'Defender até provarem', icon: '🛡️', desc: 'Lealdade com risco.', fx: { cong: 1, img: -3 } }] },
      { titulo: 'Auditoria nos contratos', texto: 'O tribunal de contas pediu todos os contratos recentes em {estado}.', padrao: 'abrir',
        ops: [{ id: 'abrir', name: 'Abrir tudo', icon: '📂', desc: 'Transparência com sustos.', fx: { img: 2, cong: -1 } }, { id: 'burocracia', name: 'Atrasar a entrega', icon: '🗃️', desc: 'Ganha tempo e desconfiança.', fx: { img: -2 } }] },
      { titulo: 'Convite para a pauta do ano', texto: 'Um movimento cobra que todos os políticos assinem um compromisso anticorrupção.', padrao: 'assinar',
        ops: [{ id: 'assinar', name: 'Assinar', icon: '✍️', desc: 'Vira cobrança futura.', fx: { img: 2, pop: 1 } }, { id: 'recusar', name: 'Recusar', icon: '✋', desc: 'Vira munição para a oposição.', fx: { img: -2 } }] },
    ],
  },
  {
    id: 'saude', nome: 'Pressão na saúde', ico: '🏥', desc: 'Surtos e filas pesam nos hospitais e nos postos.',
    quente: ['saude', 'saudemental', 'ciencia'], frio: ['economia'],
    fx: { soc: -0.15 }, sin: { servicos: { eco: -0.2 }, turismo: { eco: -0.3 } },
    focos: ['para reforçar a saúde', 'com foco na rede pública'],
    eventos: [
      { titulo: 'Surto de uma doença', texto: 'Os casos disparam em {estado} e os postos já não dão conta.', padrao: 'campanha',
        ops: [{ id: 'campanha', name: 'Campanha e vacinação', icon: '💉', desc: 'Contém e custa.', fx: { soc: 2, cash: -2, img: 1 } }, { id: 'leitos', name: 'Abrir leitos extras', icon: '🛏️', desc: 'Alivia a fila.', fx: { soc: 2, cash: -3 } }] },
      { titulo: 'Médicos em falta', texto: 'Postos do interior estão sem médico e a população reclama.', padrao: 'contratar',
        ops: [{ id: 'contratar', name: 'Contratar com bônus', icon: '👩‍⚕️', desc: 'Resolve a um custo alto.', fx: { soc: 2, cash: -3, pop: 1 } }, { id: 'telemedicina', name: 'Apostar em telemedicina', icon: '📡', desc: 'Barato e imperfeito.', fx: { soc: 1, cash: -1 } }] },
      { titulo: 'Hospital universitário em apuros', texto: 'A unidade de referência pede socorro para não fechar.', padrao: 'socorrer',
        ops: [{ id: 'socorrer', name: 'Socorrer com verba', icon: '💊', desc: 'Salva o serviço.', fx: { soc: 2, cash: -3, img: 1 } }, { id: 'parceria', name: 'Buscar parceria privada', icon: '🏢', desc: 'Menos caixa, mais crítica.', fx: { soc: 1, cash: -1, pop: -1 } }] },
    ],
  },
  {
    id: 'jovem', nome: 'Geração conectada', ico: '📱', desc: 'Os jovens ocupam as redes, cobram futuro e votam diferente.',
    quente: ['educacao', 'trabalho', 'cultura', 'ciencia'], frio: ['seguranca'],
    fx: { pop: 0.1 }, sin: { tecnologia: { eco: 0.3, pop: 0.1 } },
    focos: ['para a nova geração', 'pensando no futuro dos jovens'],
    eventos: [
      { titulo: 'Estudantes ocupam as redes', texto: 'Uma hashtag sobre educação em {estado} viralizou e pede resposta.', padrao: 'dialogar',
        ops: [{ id: 'dialogar', name: 'Receber os estudantes', icon: '🎤', desc: 'Ganha simpatia.', fx: { pop: 2, img: 1 } }, { id: 'ignorar', name: 'Deixar passar', icon: '😶', desc: 'A onda cresce sem você.', fx: { pop: -2 } }] },
      { titulo: 'Startups pedem regra clara', texto: 'Empreendedores digitais de {estado} querem segurança jurídica para crescer.', padrao: 'marco',
        ops: [{ id: 'marco', name: 'Apoiar um marco legal', icon: '📜', desc: 'Atrai empresas.', fx: { eco: 2, cong: 1 } }, { id: 'fundo', name: 'Criar fundo de apoio', icon: '💰', desc: 'Custa, atrai e dá retorno.', fx: { eco: 2, cash: -2, img: 1 } }] },
      { titulo: 'Fuga de talentos', texto: 'Jovens qualificados estão deixando o estado em busca de oportunidade.', padrao: 'reter',
        ops: [{ id: 'reter', name: 'Programa de retenção', icon: '🧲', desc: 'Bolsas e primeiro emprego.', fx: { eco: 1, soc: 1, cash: -2 } }, { id: 'deixar', name: 'Deixar o mercado agir', icon: '🛫', desc: 'Sem custo, com perda lenta.', fx: { eco: -1 } }] },
    ],
  },
  {
    id: 'commodities', nome: 'Boom das commodities', ico: '🌾', desc: 'Grãos, minério e petróleo estão valorizados lá fora.',
    quente: ['economia', 'ambiente'], frio: ['ciencia'],
    fx: { cash: 0.2 }, sin: { agro: { eco: 0.5, cash: 0.2 }, mineracao: { eco: 0.5, cash: 0.2 }, petroleo: { eco: 0.5, cash: 0.3 }, pecuaria: { eco: 0.3 } },
    focos: ['aproveitando os preços altos', 'com olho no setor exportador'],
    eventos: [
      { titulo: 'Dinheiro sobrando no caixa', texto: 'A arrecadação surpreendeu em {estado}. Todo mundo quer um pedaço.', padrao: 'reserva',
        ops: [{ id: 'reserva', name: 'Fazer reserva', icon: '🏦', desc: 'Guarda para a vaca magra.', fx: { cash: 3, img: 1 } }, { id: 'gastar', name: 'Gastar em obras e programas', icon: '🏗️', desc: 'Agrada agora.', fx: { pop: 2, soc: 1, cash: -2 } }] },
      { titulo: 'Setor exportador quer mais', texto: 'Quem trabalha com {setor} pede menos regra e mais infraestrutura de escoamento.', padrao: 'infra',
        ops: [{ id: 'infra', name: 'Priorizar logística', icon: '🚛', desc: 'Ajuda o escoamento.', fx: { eco: 2, cash: -2 } }, { id: 'regras', name: 'Manter as regras', icon: '📏', desc: 'Pesa nas relações com o setor.', fx: { eco: -1, img: 1 } }] },
      { titulo: 'Cobrança ambiental', texto: 'Com tanta expansão, entidades cobram fiscalização e metas.', padrao: 'fiscalizar',
        ops: [{ id: 'fiscalizar', name: 'Reforçar fiscalização', icon: '🌳', desc: 'Protege a imagem.', fx: { img: 2, eco: -1 } }, { id: 'afrouxar', name: 'Afrouxar para crescer', icon: '📈', desc: 'Dinheiro agora, crítica depois.', fx: { eco: 2, img: -2 } }] },
    ],
  },
]

export const CEN_POR_ID = Object.fromEntries(CENARIOS.map((c) => [c.id, c]))

// Setores: tag usada nas sinergias e nos focos das leis.
export const SETORES_UF = {
  agro: { nome: 'agronegócio', focos: ['com regras para o campo', 'ouvindo os produtores rurais', 'com apoio ao agronegócio'] },
  pecuaria: { nome: 'pecuária e fronteira agrícola', focos: ['com foco no produtor rural', 'olhando para o interior', 'para a pecuária local'] },
  industria: { nome: 'indústria', focos: ['com foco na indústria local', 'ouvindo o chão de fábrica', 'para os polos industriais'] },
  servicos: { nome: 'serviços e comércio', focos: ['com olhar para o comércio', 'para as grandes cidades', 'pensando nos serviços'] },
  turismo: { nome: 'turismo', focos: ['com foco no turismo', 'pensando nas cidades turísticas', 'ouvindo hotéis e guias'] },
  mineracao: { nome: 'mineração e logística', focos: ['com regras para a mineração', 'olhando para os portos', 'para as cidades mineiras'] },
  petroleo: { nome: 'petróleo e gás', focos: ['com royalties no centro', 'olhando para o petróleo', 'para o litoral produtor'] },
  tecnologia: { nome: 'tecnologia e inovação', focos: ['com foco em inovação', 'ouvindo startups e universidades', 'para os polos de tecnologia'] },
  publico: { nome: 'serviço público', focos: ['ouvindo os servidores', 'com foco na máquina pública', 'para os órgãos do estado'] },
}

// dor: problema crônico do estado (tema mais cobrado). resiste: tema que um setor forte tenta travar.
export const PERFIL_UF = {
  AC: { tag: 'pecuaria', dor: 'saude', resiste: 'ambiente' },
  AL: { tag: 'turismo', dor: 'educacao', resiste: 'tributos' },
  AM: { tag: 'industria', dor: 'economia', resiste: 'tributos' },
  AP: { tag: 'publico', dor: 'habitacao', resiste: 'ambiente' },
  BA: { tag: 'turismo', dor: 'seguranca', resiste: 'tributos' },
  CE: { tag: 'turismo', dor: 'trabalho', resiste: 'tributos' },
  DF: { tag: 'publico', dor: 'habitacao', resiste: 'tributos' },
  ES: { tag: 'mineracao', dor: 'seguranca', resiste: 'ambiente' },
  GO: { tag: 'agro', dor: 'saude', resiste: 'ambiente' },
  MA: { tag: 'agro', dor: 'educacao', resiste: 'ambiente' },
  MG: { tag: 'mineracao', dor: 'saude', resiste: 'ambiente' },
  MS: { tag: 'pecuaria', dor: 'seguranca', resiste: 'ambiente' },
  MT: { tag: 'agro', dor: 'habitacao', resiste: 'ambiente' },
  PA: { tag: 'mineracao', dor: 'seguranca', resiste: 'ambiente' },
  PB: { tag: 'tecnologia', dor: 'educacao', resiste: 'tributos' },
  PE: { tag: 'tecnologia', dor: 'seguranca', resiste: 'tributos' },
  PI: { tag: 'agro', dor: 'saude', resiste: 'tributos' },
  PR: { tag: 'agro', dor: 'seguranca', resiste: 'ambiente' },
  RJ: { tag: 'petroleo', dor: 'seguranca', resiste: 'ambiente' },
  RN: { tag: 'turismo', dor: 'trabalho', resiste: 'ambiente' },
  RO: { tag: 'pecuaria', dor: 'saude', resiste: 'ambiente' },
  RR: { tag: 'publico', dor: 'saude', resiste: 'ambiente' },
  RS: { tag: 'industria', dor: 'seguranca', resiste: 'tributos' },
  SC: { tag: 'industria', dor: 'habitacao', resiste: 'tributos' },
  SE: { tag: 'petroleo', dor: 'educacao', resiste: 'tributos' },
  SP: { tag: 'servicos', dor: 'habitacao', resiste: 'tributos' },
  TO: { tag: 'agro', dor: 'saude', resiste: 'ambiente' },
}

// Ajustes das leis conforme o contexto
export const CTX = {
  quenteChance: 0.08, quenteMult: 1.35,
  frioChance: -0.06, frioMult: 0.8,
  dorChance: 0.05, dorPop: 1, // pop extra por nível de ousadia
  resisteChance: -0.1, resisteEco: 0.5, // perda de economia por nível, se passar
}
