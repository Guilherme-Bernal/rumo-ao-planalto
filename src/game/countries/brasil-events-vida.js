// Eventos do dia a dia da política: situações cotidianas, crises regionais e dilemas de imagem.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 8) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })

export const vidaEvents = [
  E('enchente_bairro', [0], 'mun', 'A chuva alagou o bairro', 'Uma chuva forte alagou ruas inteiras. Moradores sobem nos telhados e gravam vídeos pedindo ajuda.', [
    C('Ir pessoalmente ajudar na distribuição de donativos', { pop: 5, img: 3, cash: -2 }, 'As fotos de bota e lama rodaram a cidade. Faltou só resolver o bueiro.'),
    C('Pedir verba de emergência à Câmara', { cong: 3, soc: 2, cash: -3, pop: 1 }, 'O dinheiro saiu, devagar. Pelo menos ninguém acusou você de omissão.'),
    G('Prometer obra de drenagem ainda neste mandato', 0.5, { pop: 6, soc: 3, cash: -4 }, 'A promessa acalmou os ânimos e o cronograma até saiu do papel.', { pop: -4, img: -4 }, 'A obra atrasou e a chuva seguinte voltou a alagar tudo. Jogaram a promessa na sua cara.'),
  ]),
  E('festa_padroeiro', [0, 1], 'mun', 'Festa do padroeiro', 'A paróquia convida você para a festa mais disputada do ano. Todo político da região vai estar lá.', [
    C('Ir, cumprimentar todo mundo e ajudar na barraca', { pop: 4, img: 2, cash: -1 }, 'Você saiu com dor nos pés e com a simpatia de meio bairro.'),
    C('Mandar um representante e ficar com a agenda', { pop: -1, cong: 1 }, 'O representante fez o que pôde. Mas quem foi pessoalmente roubou a cena.'),
    G('Fazer um discurso no palanque da festa', 0.5, { pop: 6, img: 2 }, 'O povo aplaudiu e a banda tocou o seu jingle sem você pedir.', { pop: -3, img: -3 }, 'Vaiaram a sua fala no microfone. O vídeo já está circulando.'),
  ]),
  E('greve_onibus', [0, 1], 'mun', 'Greve do transporte', 'Os motoristas de ônibus cruzaram os braços e a cidade parou. Trabalhadores caminham quilômetros até o serviço.', [
    C('Negociar com o sindicato e a empresa', { pop: 3, cash: -3, img: 2 }, 'Depois de um dia tenso, o acordo saiu e os ônibus voltaram.'),
    D('Acionar a Justiça para declarar a greve abusiva', { pop: -3, cong: 2, img: -3 }, 'A liminar saiu, mas a categoria jurou lembrar de você na eleição.', 4),
    C('Liberar o transporte alternativo por 48 horas', { pop: 2, seg: -2, cash: -1 }, 'Deu certo para a maioria, mas houve confusão nas vans.'),
  ]),
  E('obra_atrasada', [0, 1, 2], 'mun', 'A obra que nunca termina', 'A reforma da avenida principal está parada há meses. Comerciantes reclamam e o jornal local abriu uma contagem de dias.', [
    C('Cobrar a empreiteira e dar prazo final', { img: 3, pop: 1, cash: -1 }, 'A empreiteira prometeu acelerar e, desta vez, foi vista trabalhando.'),
    D('Trocar a empreiteira sem licitação nova', { pop: 3, cash: -3, img: -5 }, 'A obra andou rápido, mas o Tribunal de Contas quer saber o motivo.', 10),
    C('Assumir o atraso e fazer um mutirão', { pop: 2, img: 4, cash: -4 }, 'Admitir o erro caiu bem. A avenida ficou pronta.'),
  ]),
  E('live_polemica', [0, 1, 2, 3], 'fed', 'A live que deu errado', 'No meio de uma transmissão ao vivo, você solta uma frase mal pensada. Em dez minutos o trecho está nos trending topics.', [
    C('Pedir desculpas com humildade', { img: 3, pop: -2 }, 'O pedido de desculpas foi curto e sincero. O assunto morreu em dois dias.'),
    G('Dizer que foi tirado de contexto', 0.45, { img: 2, pop: 1 }, 'A explicação colou. A internet já estava de olho em outro escândalo.', { img: -6, pop: -4 }, 'A explicação soou pior que a gafe. Os memes só cresceram.'),
    C('Rir e fazer piada com o próprio erro', { pop: 3, img: -2 }, 'Funcionou com o seu público. Os críticos reviraram os olhos.'),
  ]),
  E('pesquisa_ruim', [0, 1, 2, 3], 'fed', 'Pesquisa interna preocupa a equipe', 'O instituto traz números ruins: a rejeição subiu e o seu nome caiu entre jovens e mulheres. A equipe pede uma reação.', [
    C('Reforçar a presença nas ruas', { pop: 4, cash: -2 }, 'Semanas de corpo a corpo recuperaram parte do terreno.'),
    C('Contratar um marqueteiro de peso', { pop: 3, img: 2, cash: -5 }, 'A campanha ganhou cara nova e um slogan que pegou.'),
    C('Ignorar: pesquisa é só uma foto do momento', { pop: -2, cong: -1 }, 'Pode até ser. Mas os aliados começaram a ficar ansiosos.'),
  ], (g) => g.stats.pop < 45),
  E('programa_tv', [1, 2, 3], 'fed', 'Convite para um programa de TV', 'Um programa de auditório de alta audiência convida você para uma entrevista descontraída, com quadro de humor e tudo.', [
    G('Aceitar e entrar na brincadeira', 0.55, { pop: 6, img: 1 }, 'Você se mostrou gente como a gente. A audiência amou.', { pop: -2, img: -5 }, 'A brincadeira passou do ponto e virou corte para as redes dos adversários.'),
    C('Aceitar só se for entrevista séria', { img: 3, pop: 2 }, 'A entrevista foi correta e rendeu boas manchetes.'),
    C('Recusar: política não é entretenimento', { img: 2, pop: -2 }, 'Mantém o tom sério, mas perde alcance.'),
  ]),
  E('crise_energia', [2, 3], 'est', 'Risco de apagão', 'Uma onda de calor e a falta de chuva nos reservatórios colocam a energia em alerta. Já se fala em racionamento.', [
    C('Lançar campanha de economia de energia', { eco: -1, img: 3, pop: 1, cash: -2 }, 'A população colaborou e o pior foi evitado.'),
    G('Garantir geração emergencial por termelétricas', 0.55, { eco: 3, pop: 3, cash: -6 }, 'As luzes ficaram acesas, a conta é que ficou salgada.', { eco: -4, pop: -4, img: -3 }, 'A energia emergencial custou caro e não chegou a tempo: o apagão veio mesmo.'),
    D('Fechar contratos de energia sem concorrência', { eco: 2, cash: -3, img: -6 }, 'Resolveu o curto prazo e abriu um flanco com a imprensa.', 10),
  ]),
  E('seca_interior', [2], 'est', 'Seca castiga o interior', 'Produtores rurais perdem a safra e pedem socorro. Caminhões-pipa viraram a rotina em dezenas de cidades.', [
    C('Distribuir cestas e água com o governo estadual', { pop: 4, soc: 2, cash: -4 }, 'O socorro chegou rápido e foi lembrado na região.'),
    C('Negociar renegociação das dívidas rurais', { eco: 3, cong: 2, cash: -3 }, 'Os produtores respiraram, mesmo com a safra perdida.'),
    C('Pedir ajuda ao governo federal e esperar', { cong: 1, pop: -3 }, 'A resposta demorou. A frase "cadê o governador?" virou refrão.'),
  ]),
  E('cupula_internacional', [3], 'fed', 'Convite para uma cúpula internacional', 'Líderes de vários países se reúnem e você recebe um convite para discursar. A pauta é comércio, clima e segurança.', [
    C('Ir e defender a agenda do seu governo', { img: 4, eco: 2, cash: -2 }, 'Seu discurso foi bem recebido lá fora e rendeu manchetes em casa.'),
    G('Aproveitar para fechar acordos comerciais', 0.5, { eco: 5, img: 2, cash: 3 }, 'Dois acordos saíram do papel. Os exportadores agradecem.', { img: -3, eco: -1 }, 'Os acordos travaram e ficou a foto sem resultado.'),
    C('Mandar o chanceler e ficar no país', { pop: 1, img: -2 }, 'Pareceu desinteresse. A imprensa cobrou presença.'),
  ]),
  E('jornalista_investigativo', [0, 1, 2, 3], 'fed', 'Um jornalista bate à porta', 'Um repórter investigativo pergunta sobre contratos antigos do seu gabinete e pede uma entrevista. Ele já tem documentos.', [
    C('Abrir tudo e dar a entrevista', { img: 4, pop: 1 }, 'A transparência desarmou a matéria. Saiu até um elogio.'),
    G('Segurar por nota e advogado', 0.5, { img: 1 }, 'A matéria saiu morna e o assunto esfriou.', { img: -6, pop: -3 }, 'A matéria saiu com a sua omissão em destaque.', 6),
    D('Tentar influenciar a pauta com anunciantes', { img: -4, cong: 1 }, 'O repórter se sentiu pressionado e a história virou outra mais forte.', 12),
  ], (g) => g.stats.img < 60),
  E('doacao_empresario', [0, 1, 2], 'mun', 'Doação generosa de um empresário', 'Um empresário local oferece ajudar na campanha e na estrutura do mandato. Não pede nada em troca, por enquanto.', [
    C('Recusar com educação', { img: 3, cash: -1 }, 'Você perdeu a ajuda, mas ganhou a fama de independente.'),
    D('Aceitar discretamente', { cash: 6, cong: 2, img: -3 }, 'O dinheiro ajudou. A conversa com ele ainda vai voltar.', 10),
    C('Aceitar e declarar tudo oficialmente', { cash: 3, img: 2 }, 'A doação foi registrada e ninguém pôde reclamar.'),
  ]),
  E('ferias_polemicas', [1, 2, 3], 'fed', 'Fotos de férias vazaram', 'Você foi fotografado(a) em um resort caro durante uma crise no seu estado. As redes não perdoam.', [
    C('Admitir o erro e cancelar o restante da viagem', { img: 2, pop: -2 }, 'A volta antecipada foi vista como gesto de respeito.'),
    G('Defender que era dia de folga e custeado do próprio bolso', 0.5, { img: 1, pop: 1 }, 'A defesa colou e as redes seguiram em frente.', { img: -5, pop: -4 }, 'Alguém achou o recibo errado. A defesa desabou.'),
    C('Doar o valor da viagem para uma entidade local', { cash: -2, pop: 2, img: 3 }, 'A doação virou notícia positiva e o assunto sumiu.'),
  ]),
]
