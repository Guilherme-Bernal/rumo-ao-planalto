// Eventos novos: tecnologia, relações internacionais e conflitos próprios de cada cargo.
// `only` limita o evento a um cargo (texto) ou a uma lista de cargos, já que vários cargos dividem o mesmo nível.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 8) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, only) => ({ id, stages, sphere, title, text, choices, ...(only ? { only } : {}) })
const ANY = [0, 1, 2, 3]

export const novosEventos = [
  /* ---------- tecnologia ---------- */
  E('tec_ia', ANY, 'fed', 'Inteligência artificial no serviço público', 'Uma empresa oferece um sistema de IA para atender o cidadão, triar processos e responder dúvidas. Dizem que corta a fila pela metade, e os críticos temem erros e vigilância.', [
    C('Criar um projeto piloto com transparência', { eco: 1, img: 3, cash: -2 }, 'O piloto funcionou em duas áreas e virou notícia de modernização.'),
    C('Contratar o sistema pronto', { cash: -4, soc: 1, pop: 1 }, 'A fila diminuiu, mas o contrato caro rendeu perguntas.'),
    C('Proibir o uso por enquanto', { img: -1, pop: 0 }, 'Você ficou no lado seguro e na lanterna da inovação.'),
    C('Abrir debate com especialistas e sociedade', { img: 2, cong: 1, cash: -1 }, 'O debate foi longo, mas rendeu uma regra clara para os próximos anos.'),
  ]),
  E('tec_dados', ANY, 'fed', 'A lei de proteção de dados cobra a sua gestão', 'Um órgão avisou que a sua administração guarda dados de cidadãos sem proteção adequada. Multa e vazamento são riscos reais.', [
    C('Investir em segurança e treinar a equipe', { img: 3, cash: -3 }, 'Os sistemas foram blindados e um possível escândalo nunca chegou a existir.'),
    G('Fazer o mínimo e torcer', 0.5, { cash: 1 }, 'Nada aconteceu, por enquanto.', { img: -6, pop: -2, cash: -2 }, 'Houve vazamento, e os dados de milhares de pessoas foram parar na internet.'),
    C('Contratar uma empresa especializada', { img: 2, cash: -4, eco: 1 }, 'A auditoria apontou problemas e a empresa os resolveu.'),
  ]),
  E('tec_fibra', ANY, 'mun', 'Internet para os bairros sem sinal', 'Moradores de bairros afastados estão sem internet decente. Alunos não conseguem fazer lição e pequenos comércios perdem vendas.', [
    C('Fazer parceria com uma operadora', { eco: 2, pop: 2, cash: -1 }, 'A operadora levou fibra aos bairros e a prefeitura emprestou os postes.'),
    C('Investir direto em uma rede pública', { cash: -5, pop: 3, eco: 2, soc: 1 }, 'A rede pública saiu cara, mas virou vitrine de inclusão digital.'),
    C('Esperar que o mercado resolva', { pop: -2, eco: -1 }, 'O mercado não foi para onde não dava lucro. A cobrança continuou.'),
  ]),
  E('tec_robo', ANY, 'fed', 'Automação ameaça empregos', 'Uma grande fábrica anuncia que vai automatizar a linha de produção. Centenas de empregos estão em risco, e o sindicato pede resposta.', [
    C('Programa de qualificação com a indústria', { cash: -2, eco: 1, pop: 1, soc: 1 }, 'Parte dos trabalhadores foi recolocada em funções técnicas.'),
    C('Negociar prazo e compensação com a empresa', { eco: -1, pop: 2, cong: 1 }, 'A empresa aceitou escalonar as demissões e pagar mais do que o previsto.'),
    C('Apoiar a modernização sem condições', { eco: 3, pop: -3, img: -1 }, 'A produtividade subiu, e o impacto social virou crítica.'),
  ]),
  E('tec_pagamento', ANY, 'fed', 'Pagamento digital nos serviços públicos', 'A população pede para pagar taxas e tarifas pelo celular. Um banco público oferece uma plataforma, mas cobra por transação.', [
    C('Adotar a plataforma e subsidiar a taxa', { cash: -2, pop: 2, img: 1, eco: 1 }, 'O pagamento digital reduziu filas e a inadimplência.'),
    C('Montar uma solução própria, mais barata', { cash: -3, img: 2, soc: 1 }, 'Demorou mais, mas o sistema era do governo e a taxa zero.'),
    C('Manter o atendimento no balcão', { pop: -2, img: -1 }, 'A fila continuou grande e o assunto virou piada nas redes.'),
  ]),
  E('tec_startups', ANY, 'fed', 'Polo de startups quer se instalar', 'Um grupo de jovens empreendedores quer montar um polo de tecnologia na região e pede terreno, internet e incentivo fiscal por três anos.', [
    C('Ceder o espaço e dar incentivo moderado', { eco: 3, cash: -2, img: 2 }, 'O polo atraiu investidores e jovens talentos para a região.'),
    C('Só ceder o terreno', { eco: 1, cash: -1 }, 'O polo foi pequeno, mas começou.'),
    C('Recusar: o caixa não permite', { eco: -1, img: -1, cash: 1 }, 'Eles foram para a cidade vizinha e a notícia pegou mal.'),
  ]),

  /* ---------- relações internacionais ---------- */
  E('int_cupula', [3], 'fed', 'Convite para uma cúpula internacional', 'Um bloco de países convida você para uma cúpula sobre clima, comércio e segurança. A foto é boa, mas a pauta pode trazer compromissos pesados.', [
    C('Ir e liderar uma proposta brasileira', { img: 4, eco: 2, cash: -2 }, 'O discurso chamou atenção e abriu portas para acordos novos.'),
    C('Ir e ouvir, sem assumir compromisso', { img: 1, cash: -1 }, 'A participação foi discreta e sem grandes ganhos.'),
    C('Enviar o chanceler no seu lugar', { img: -1, cong: 1 }, 'O chanceler foi bem, mas a ausência foi notada.'),
  ], 'presidente'),
  E('int_missao', [2], 'est', 'Missão comercial do estado', 'Uma comitiva de empresários do estado quer ir à Ásia procurar compradores para os produtos locais. Eles querem o governador na foto.', [
    C('Liderar a missão pessoalmente', { eco: 3, img: 1, cash: -2 }, 'A missão fechou contratos e deu manchete positiva.'),
    C('Mandar o secretário de desenvolvimento', { eco: 2, cash: -1 }, 'A missão deu certo e você poupou a agenda.'),
    C('Cancelar: o momento não é bom para viajar', { img: 1, eco: -1 }, 'Você evitou a crítica da viagem, mas perdeu a janela.'),
  ], 'governador'),
  E('int_sabatina', [1], 'fed', 'Sabatina de embaixador no Senado', 'O governo indicou um novo embaixador para um país estratégico. Cabe ao Senado sabatinar e aprovar o nome. Há críticas ao currículo do indicado.', [
    C('Aprovar sem muito barulho', { cong: 3, img: -1 }, 'O governo agradeceu e o nome passou na votação.'),
    C('Sabatinar com rigor e exigir compromissos', { img: 3, cong: -1 }, 'A sabatina rendeu manchete e o indicado fez promessas por escrito.'),
    D('Negociar o voto em troca de uma emenda', { cong: 4, cash: 3, img: -4 }, 'A emenda saiu e a negociação também apareceu no noticiário.', 8),
  ], 'senador'),
  E('int_embargo', [2, 3], 'fed', 'Embargo ameaça as exportações', 'Um grande comprador ameaça restringir importações do Brasil por causa de uma disputa ambiental e sanitária. Produtores pedem resposta rápida.', [
    C('Negociar com o país e mostrar dados', { eco: 2, img: 2, cash: -1 }, 'A negociação evitou o pior e rendeu um acordo de verificação.'),
    C('Acionar a OMC e endurecer o tom', { pop: 2, img: 1, eco: -2 }, 'A torcida gostou e o comércio sofreu por semanas.'),
    C('Diversificar: abrir novos mercados', { eco: 1, cash: -2, img: 1 }, 'Os novos compradores levaram tempo, mas apareceram.'),
  ]),
  E('int_intercambio', [1, 2, 3], 'fed', 'Intercâmbio de estudantes e pesquisadores', 'Uma universidade estrangeira propõe um programa de intercâmbio com bolsas parciais. Os alunos adoram, mas a verba é limitada.', [
    C('Bancar um número maior de bolsas', { cash: -3, img: 3, eco: 1 }, 'Os alunos voltaram com ideias e contatos que ajudaram a região.'),
    C('Fechar o programa em escala menor', { cash: -1, img: 1 }, 'O programa ficou pequeno, mas começou.'),
    C('Recusar por falta de verba', { img: -1 }, 'Os estudantes reclamaram e a universidade procurou outro parceiro.'),
  ]),

  /* ---------- deputado estadual ---------- */
  E('depe_orcamento', [1], 'est', 'O orçamento estadual chega à Assembleia', 'O governo enviou a proposta de orçamento. Há pouco para a sua base, e o líder do governo pede votos sem emendas.', [
    C('Votar com o governo e pedir contrapartida', { cong: 3, cash: 1, pop: 1 }, 'Você entrou no acordo e levou uma obra pequena para a região.'),
    C('Apresentar emendas para a sua base', { pop: 3, cong: -2, cash: -1 }, 'Algumas emendas passaram e o resto virou promessa.'),
    C('Votar contra e fazer barulho', { img: 3, cong: -4, pop: 1 }, 'Você ficou conhecido como fiscal, e a base do governo anotou.'),
  ], 'dep_estadual'),
  E('depe_prefeitos', [1], 'est', 'Prefeitos da região cobram emendas', 'Três prefeitos da sua base pedem emendas para obras que prometeram. Sem elas, o apoio na eleição pode ir para outro lado.', [
    C('Dividir a verba entre os três', { pop: 3, cong: 2, cash: -3 }, 'Todos receberam um pouco e ficaram agradecidos.'),
    C('Concentrar em uma obra grande', { pop: 4, cong: -1, cash: -3 }, 'A obra grande virou símbolo, mas dois prefeitos ficaram sentidos.'),
    C('Recusar e orientar a buscar o governo', { pop: -2, img: 1 }, 'Eles reclamaram de você nos bastidores.'),
  ], 'dep_estadual'),

  /* ---------- deputado federal ---------- */
  E('depf_relator', [1], 'fed', 'Você é escolhido relator de um projeto polêmico', 'O líder do seu partido te indica relator de um projeto que divide o Congresso. A visibilidade é grande, e o risco também.', [
    C('Aceitar e fazer um relatório técnico', { img: 3, cong: 2, pop: 1 }, 'O relatório foi elogiado até pela oposição.'),
    C('Aceitar e alinhar com o governo', { cong: 4, img: -2 }, 'O governo agradeceu e a imprensa chamou de relatório chapa-branca.'),
    C('Recusar a relatoria', { cong: -2, img: 1 }, 'O partido ficou sentido e o projeto foi para outro.'),
  ], 'dep_federal'),
  E('depf_fundo', [1], 'fed', 'O partido cobra a sua parte do fundo', 'A direção do partido quer que você devolva uma parte do fundo e apoie o candidato dela na eleição local.', [
    C('Pagar a cota e apoiar o candidato', { cong: 3, cash: -2, pop: -1 }, 'O partido gostou, mas parte da sua base achou ruim.'),
    C('Negociar um valor menor', { cong: 1, cash: -1 }, 'A direção cedeu, mas você ficou na lista de observação.'),
    C('Recusar e seguir sozinho', { cong: -4, img: 2, pop: 1 }, 'Você afirmou independência, e a direção cortou a sua verba.'),
  ], 'dep_federal'),

  /* ---------- senador ---------- */
  E('sen_sabatina', [1], 'fed', 'Sabatina de indicado ao tribunal superior', 'O governo indicou um nome para um tribunal superior. O Senado vai sabatinar, e a opinião pública está dividida.', [
    C('Votar a favor do indicado', { cong: 3, img: -1 }, 'Você acompanhou a base do governo e foi poupado de críticas pelo lado dele.'),
    C('Votar contra e liderar a oposição ao nome', { img: 3, cong: -4, pop: 1 }, 'O nome foi aprovado por pouco e você virou a voz da oposição.'),
    C('Condicionar o voto a um compromisso público', { img: 2, cong: 1 }, 'O indicado fez um compromisso que ajudou a pacificar o plenário.'),
  ], 'senador'),
  E('sen_pec', [1], 'fed', 'Uma PEC polêmica chega ao Senado', 'Uma proposta de emenda constitucional chegou do outro lado do Congresso. Mexe em regras que afetam a todos, e os dois lados pedem seu voto.', [
    C('Defender a PEC e ajudar a aprovar', { cong: 3, eco: 1, pop: -1 }, 'A PEC passou e a sua conta política subiu.'),
    C('Pedir mais tempo de debate com especialistas', { img: 3, cong: -1 }, 'Você ganhou fama de cauteloso, e o governo ficou impaciente.'),
    C('Votar contra e liderar a resistência', { pop: 2, cong: -4, img: 1 }, 'A PEC foi barrada e você virou líder de oposição.'),
  ], 'senador'),

  /* ---------- prefeito ---------- */
  E('pref_orcamento_part', [0], 'mun', 'Orçamento participativo', 'Moradores pedem que parte do orçamento seja decidida em assembleias dos bairros. Os vereadores desconfiam.', [
    C('Adotar o orçamento participativo', { pop: 4, img: 2, cong: -2, cash: -1 }, 'As assembleias lotaram, e a prefeitura decidiu junto com o povo.'),
    C('Fazer um teste em dois bairros', { pop: 2, img: 1 }, 'O teste deu certo e abriu caminho para ampliar depois.'),
    C('Manter a decisão com a prefeitura', { pop: -2, cong: 1 }, 'Os moradores reclamaram, mas a base da Câmara ficou tranquila.'),
  ], 'prefeito'),
  E('pref_upa', [0], 'mun', 'A UPA da cidade está lotada', 'Pacientes esperam até 6 horas na unidade de pronto atendimento. A imprensa fez reportagem, e as famílias cobram solução.', [
    C('Contratar médicos e reforçar a UPA', { soc: 3, cash: -4, pop: 2 }, 'A fila caiu pela metade em um mês.'),
    C('Abrir um segundo posto 24 horas', { soc: 3, cash: -5, pop: 3, img: 1 }, 'O segundo posto virou referência na região.'),
    C('Culpar o governo estadual', { img: -2, pop: 1 }, 'A troca de acusações não resolveu a fila.'),
  ], 'prefeito'),
  E('pref_lixo', [0], 'mun', 'Crise na coleta de lixo', 'A empresa que cuida da coleta ameaça parar porque a prefeitura atrasou o pagamento. O lixo se acumula em alguns bairros.', [
    C('Pagar o atrasado e renegociar o contrato', { cash: -4, img: 1, pop: 1 }, 'A coleta voltou e o contrato foi renegociado.'),
    C('Trocar de empresa por licitação emergencial', { cash: -2, img: -1, pop: 1 }, 'A troca foi rápida, mas gerou dúvidas sobre a empresa nova.'),
    C('Pressionar a empresa pelo contrato', { pop: -2, img: 1 }, 'O lixo acumulou e a imprensa registrou tudo.'),
  ], 'prefeito'),

  /* ---------- governador ---------- */
  E('gov_pm_greve', [2], 'est', 'A polícia ameaça parar', 'As associações de policiais anunciam paralisação por falta de reajuste. A população está assustada e o comércio fecha mais cedo.', [
    C('Negociar um reajuste escalonado', { seg: 2, cash: -4, pop: 1 }, 'A greve foi evitada, mas a conta pesou.'),
    C('Endurecer e punir quem parar', { seg: -3, pop: -2, img: 1 }, 'A greve começou e a segurança ficou comprometida por dias.'),
    C('Pedir apoio ao governo federal para reforçar a segurança', { seg: 1, cong: 1, img: -1, cash: -1 }, 'O reforço federal segurou a situação enquanto a negociação seguia.'),
  ], 'governador'),
  E('gov_concessao', [2], 'est', 'Concessão de rodovia estadual', 'Uma empresa quer assumir uma rodovia estadual com pedágio e promete duplicá-la em três anos. Entra caixa, mas o pedágio divide a população.', [
    C('Conceder com tarifa regulada e metas rígidas', { cash: 5, eco: 2, pop: -2, img: 1 }, 'A rodovia foi duplicada e o pedágio gerou protestos pontuais.'),
    C('Recusar e manter a rodovia pública', { pop: 1, cash: -1, eco: -1 }, 'Você evitou o pedágio, mas a rodovia continuou ruim.'),
    D('Fechar uma concessão rápida com uma empresa amiga', { cash: 7, eco: 1, img: -6 }, 'O caixa recebeu a outorga, e o contrato virou matéria de domingo.', 10),
  ], 'governador'),
]
