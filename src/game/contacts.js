// Contatos: pessoas que se aproximam (ligação, mensagem, abordagem) e que você pode procurar.
// Texto 100% fictício. Cada conversa tem até 2 passos; cada escolha mexe nos números e na relação (rel, 0 a 100).
import { candName } from './social'

export const ROLES = {
  empresario: { icon: '💼', name: 'Empresário(a)', hi: { cash: 0.6 }, lo: { img: -0.4 }, hiText: '+0,6 caixa por rodada', loText: '−0,4 imagem por rodada' },
  jornalista: { icon: '📰', name: 'Jornalista', hi: { img: 0.6 }, lo: { img: -0.8 }, hiText: '+0,6 imagem por rodada', loText: '−0,8 imagem por rodada' },
  lider: { icon: '🏘️', name: 'Líder comunitário(a)', hi: { pop: 0.6 }, lo: { pop: -0.4 }, hiText: '+0,6 popularidade por rodada', loText: '−0,4 popularidade por rodada' },
  aliado: { icon: '🤝', name: 'Aliado(a) do partido', hi: { cong: 0.6 }, lo: { cong: -0.6 }, hiText: '+0,6 base por rodada', loText: '−0,6 base por rodada' },
  familiar: { icon: '👪', name: 'Familiar', hi: { img: 0.3 }, lo: { img: -0.3 }, hiText: '+0,3 imagem por rodada', loText: '−0,3 imagem por rodada' },
  religioso: { icon: '🙏', name: 'Líder religioso(a)', hi: { pop: 0.5 }, lo: { pop: -0.3 }, hiText: '+0,5 popularidade por rodada', loText: '−0,3 popularidade por rodada' },
  influenciador: { icon: '📱', name: 'Influenciador(a)', hi: { pop: 0.6 }, lo: { img: -0.4 }, hiText: '+0,6 popularidade por rodada', loText: '−0,4 imagem por rodada' },
  adversario: { icon: '🗡️', name: 'Bastidores da oposição', hi: { img: 0.3 }, lo: { cong: -0.4 }, hiText: '+0,3 imagem por rodada (trégua)', loText: '−0,4 base por rodada' },
}
export const KIND = { call: { icon: '📞', verb: 'Ligação de' }, msg: { icon: '💬', verb: 'Mensagem de' }, street: { icon: '🚶', verb: 'Abordagem de' } }
export const relLabel = (v) => (v >= 75 ? 'Aliado' : v >= 55 ? 'Próximo' : v >= 30 ? 'Neutro' : v >= 15 ? 'Distante' : 'Hostil')

// Elenco inicial: nomes sorteados. rival = nome do adversário principal (para o assessor)
export function makeContacts(R, { religioso = false, rival = '' } = {}) {
  const mk = (role, rel) => ({ id: role, role, name: candName(R), rel })
  const l = [mk('empresario', 40), mk('jornalista', 42), mk('lider', 45), mk('aliado', 50), mk('familiar', 60), mk('religioso', religioso ? 55 : 32), mk('influenciador', 38), mk('adversario', 25)]
  const adv = l.find((x) => x.role === 'adversario')
  if (rival) adv.name = `Assessor(a) de ${rival}`
  return l
}

// ---------- conversas recebidas ----------
const C = (l, fx, rel, out, extra = {}) => ({ l, fx, rel, out, ...extra })
const N = (text, ch) => ({ text, ch })
const S = (id, role, kind, stages, title, text, ch) => ({ id, role, kind, stages, title, text, ch })
const ALL = [0, 1, 2, 3]

export const SCRIPTS = [
  S('doacao', 'empresario', 'call', ALL, 'Quer ajudar a sua campanha', 'Olá, aqui é do grupo que toca metade do comércio local. Admiro seu trabalho e quero ajudar. É sem compromisso. Só queria conversar depois sobre uns alvarás.', [
    C('Aceitar a doação sem perguntar', { cash: 8, img: -3 }, 10, 'O dinheiro entrou e o favor ficou na conta. Quem vê de fora não sabe, mas você sabe.', { dirty: true }),
    C('Aceitar só doação declarada e dentro da lei', { cash: 4, img: 1 }, 4, 'Ele achou formal demais, mas assinou o recibo.'),
    C('Ouvir a proposta inteira', {}, 1, '', {
      next: N('"Seria só facilitar a aprovação de uma obra. Todo mundo sai ganhando."', [
        C('Recusar e encerrar a conversa', { img: 3 }, -6, 'Você encerrou a ligação. Ele não gostou.'),
        C('Aceitar o acordo', { cash: 9, img: -6 }, 12, 'Negócio fechado, consciência não.', { dirty: true }),
      ]),
    }),
  ]),
  S('entrevista', 'jornalista', 'call', ALL, 'Entrevista ao vivo', 'Oi, aqui é da redação. Vamos ao ar daqui a 10 minutos e queria você no estúdio. Aviso: vou perguntar sobre aquela polêmica.', [
    C('Topar e responder tudo', { pop: 3, img: 2 }, 8, 'Você foi sincero e o apresentador respeitou. A frase final viralizou.'),
    C('Topar, mas escolher as perguntas', { pop: 1, img: -1 }, 2, 'A entrevista saiu morna e o jornalista percebeu a combinação.'),
    C('Pedir para remarcar', { img: -1 }, -3, 'Ele disse que ia chamar outro convidado. Chamou o seu rival.'),
  ]),
  S('vazamento', 'jornalista', 'msg', [1, 2, 3], 'Um documento vazado', 'Recebi um documento que cita seu nome. Antes de publicar, quero ouvir você. Tem 1 hora.', [
    C('Responder com transparência', { img: 2, pop: -1 }, 6, 'Você explicou tudo. A matéria saiu equilibrada.'),
    C('Negar tudo e ameaçar processar', { img: -3, pop: 1 }, -10, 'A matéria saiu pior e com a sua ameaça no título.'),
    C('Não responder', { img: -4 }, -6, 'A matéria saiu com a frase "procurado, o político não respondeu".'),
  ]),
  S('asfalto', 'lider', 'street', ALL, 'O bairro sem asfalto', 'Vereador(a), o povo da nossa rua está há 3 anos esperando asfalto. A gente te apoia, mas precisa ver obra, não promessa.', [
    C('Prometer a obra com data', { pop: 4, cash: -2 }, 8, 'A comunidade fez uma faixa com a data. Agora você tem prazo.'),
    C('Levar o engenheiro para ver a rua', { pop: 3, img: 2 }, 6, 'Fotos, croqui e muito café. A rua gostou da atenção.'),
    C('Dizer que não é sua função', { pop: -3, img: -1 }, -8, 'Ele ouviu, agradeceu a franqueza e foi falar mal de você na associação.'),
  ]),
  S('festabairro', 'lider', 'msg', ALL, 'Festa do bairro', 'A gente vai fazer uma festa junina no bairro e queria te chamar. Se puder levar uma ajuda com a barraca de pamonha, melhor.', [
    C('Ir e ajudar na barraca', { pop: 4, img: 1, cash: -1 }, 7, 'Você virou o pamonheiro oficial da festa. Eles pediram bis.'),
    C('Mandar uma doação', { pop: 1, cash: -1 }, 2, 'Agradeceram, mas queriam você, não o dinheiro.'),
    C('Declinar o convite', { pop: -2 }, -4, 'Não foi bem recebido.'),
  ]),
  S('votocontra', 'aliado', 'call', [1, 3], 'Pedido do partido', 'O líder quer fechar votação amanhã e você ficou de fora do acordo. Precisa de mais um voto, e o projeto é meio indigesto.', [
    C('Votar com o partido', { cong: 5, img: -2 }, 10, 'Você virou aliado de confiança. A conta chega depois.'),
    C('Pedir mudanças no texto', {}, 2, '', {
      next: N('"Posso tentar, mas vou precisar de algo em troca: apoio no cargo da comissão."', [
        C('Aceitar a troca', { cong: 4, img: -1 }, 6, 'Troca feita. Cada um com o seu pedaço.'),
        C('Recusar e votar contra', { cong: -3, img: 2 }, -8, 'Votou contra e virou o rebelde da bancada.'),
      ]),
    }),
    C('Votar contra e avisar', { cong: -4, img: 3 }, -10, 'Você ficou com a consciência limpa e o grupo de mensagens com um silêncio incômodo.'),
  ]),
  S('cargos', 'aliado', 'street', [1, 2, 3], 'Cargos na mesa', 'Estão distribuindo as cadeiras e o seu grupo quer indicar três nomes para cargos de confiança. Tem gente boa e gente que é só parente.', [
    C('Indicar só nomes técnicos', { img: 3, cong: -2 }, -2, 'Você indicou gente competente e perdeu alguns afagos.'),
    C('Distribuir para agradar a base', { cong: 5, img: -3 }, 8, 'A base ficou feliz e o jornal anotou os sobrenomes.', { dirty: true }),
    C('Pedir tempo para pensar', {}, -1, 'A reunião terminou sem você e a lista saiu sem seus nomes.'),
  ]),
  S('tio', 'familiar', 'call', ALL, 'O tio com um pedido', 'Sobrinho(a), tô desempregado faz um tempo. Se você arrumasse alguma coisinha aí no gabinete, eu ajudava muito.', [
    C('Contratar para um cargo comissionado', { cong: 1, img: -5 }, 8, 'A matéria "parentes no gabinete" saiu em três dias.', { dirty: true }),
    C('Indicar para um concurso e ajudar a estudar', { img: 1 }, 2, 'Ele passou o mês com apostilas. Passou também o cunhado.'),
    C('Dizer não com carinho', { img: 2 }, -6, 'Ele ficou chateado e a família inteira ficou sabendo antes do almoço de domingo.'),
  ]),
  S('mae', 'familiar', 'call', ALL, 'A ligação da mãe', 'Meu filho, meu filha, você tá comendo direito? Vi você na TV e achei abatido. Passa aqui no domingo.', [
    C('Ir no domingo e desligar o celular', { img: 1, pop: 1 }, 10, 'Almoço, café e fofoca. Você voltou mais leve.'),
    C('Prometer que vai quando der', {}, -2, 'Ela entendeu. Ela sempre entende.'),
    C('Mandar um vídeo rápido e gravar para as redes', { pop: 2, img: -2 }, 2, 'Ela ficou famosa. Você ficou com fama de oportunista.'),
  ]),
  S('culto', 'religioso', 'street', ALL, 'Convite para a celebração', 'A comunidade está reunida neste fim de semana e seria uma honra ter o senhor ou a senhora presente. Muita gente quer ouvir uma palavra sua.', [
    C('Ir e ouvir mais do que falar', { pop: 4, img: 2 }, 8, 'Você ficou a celebração inteira, sem discurso. Foi o melhor discurso.'),
    C('Ir e aproveitar para fazer campanha', { pop: 3, img: -3 }, -4, 'Alguém filmou. O comentário "no altar não" circulou.'),
    C('Pedir desculpas e não ir', { pop: -2 }, -6, 'Entenderam, mas lembraram.'),
  ]),
  S('collab', 'influenciador', 'msg', ALL, 'Parceria de vídeo', 'Mano, cê é bem conhecido por aqui. Bora fazer um vídeo juntos? Tenho 800 mil seguidores. É rápido, só uma trend.', [
    C('Topar a trend', { pop: 5, img: -2 }, 6, 'O vídeo bombou, e os comentários também: metade elogiou, metade zoou.'),
    C('Propor um vídeo sério sobre um problema local', { pop: 2, img: 3 }, 4, 'Menos curtidas, mais respeito.'),
    C('Recusar', { pop: -1 }, -3, 'Ele fez o vídeo com outro político.'),
  ]),
  S('tregua', 'adversario', 'call', [1, 2, 3], 'Proposta de não agressão', 'Aqui é da assessoria do nosso lado. O chefe propõe um pacto: nada de ataque pessoal na campanha. O que acha?', [
    C('Aceitar o pacto', { img: 3, pop: -1 }, 8, 'A campanha ficou mais limpa. A militância reclamou da falta de emoção.'),
    C('Rejeitar e seguir o jogo', { pop: 2, img: -1 }, -8, 'A guerra continua. Os memes também.'),
    C('Aceitar e armar uma armadilha', { pop: 2, img: -4 }, -3, 'O plano vazou e o pacto virou piada nacional.', { dirty: true }),
  ]),
  S('audio', 'adversario', 'call', [1, 2, 3], 'Um áudio comprometedor', 'Número desconhecido: "Tenho um áudio seu falando mal de um aliado. Posso esquecer, se a gente conversar sobre uma ajuda."', [
    C('Pagar para o áudio sumir', { cash: -6, img: -3 }, 4, 'O áudio sumiu. A culpa não.', { dirty: true }),
    C('Desligar e avisar o seu aliado', { img: 2, cong: 1 }, -6, 'O aliado agradeceu e a chantagem virou boletim de ocorrência.'),
    C('Desafiar: "pode divulgar"', { img: -2, pop: 2 }, -10, 'O áudio vazou. Você já tinha pedido desculpas antes.'),
  ]),
  S('obra', 'empresario', 'street', [2, 3], 'A grande obra', 'A construtora quer tocar o projeto da nova avenida. Precisamos de um empurrão com o licenciamento. Tem um agradecimento para você.', [
    C('Pedir a licitação limpa', { eco: 2, img: 3 }, -4, 'Ele não gostou, mas respeitou. A obra saiu depois com outra empresa.'),
    C('Ajudar a acelerar a análise', { eco: 4, cash: 5, img: -5 }, 8, 'A avenida saiu rápido. A auditoria também.', { dirty: true }),
    C('Pedir para entrar com um pedido formal', { eco: 1 }, 1, 'Prazos e papéis. Nada de errado, nada de rápido.'),
  ]),
]

// ---------- ligar para um contato (usa 1 ação) ----------
// base: chance de dar certo = base + rel/130. Dar certo gasta parte da relação (você usou um favor).
export const ASKS = {
  empresario: [
    { id: 'doar', label: 'Pedir uma doação legal', you: 'Preciso de um apoio para a campanha. Dá para ajudar dentro da lei?', ok: 'Claro. Vou mandar o recibo.', fail: 'Agora o caixa está apertado.', okFx: { cash: 7, img: 1 }, base: 0.3, cost: 5 },
  ],
  jornalista: [
    { id: 'pauta', label: 'Sugerir uma pauta positiva', you: 'Tenho uma obra nova para mostrar. Dá para fazer uma matéria?', ok: 'Boa pauta. Mando equipe amanhã.', fail: 'A pauta está cheia. Quem sabe mês que vem.', okFx: { pop: 3, img: 3 }, base: 0.3, cost: 5 },
  ],
  lider: [
    { id: 'apoio', label: 'Pedir apoio na comunidade', you: 'Queria que você falasse comigo no bairro. Topa?', ok: 'Topo. O povo daqui te respeita.', fail: 'Agora não, o pessoal tá cobrando.', okFx: { pop: 5 }, base: 0.35, cost: 5 },
  ],
  aliado: [
    { id: 'voto', label: 'Pedir apoio na bancada', you: 'Preciso articular uns votos. Dá para contar com você?', ok: 'Conta comigo e com mais dois.', fail: 'Essa semana tá difícil. Cada um com seu problema.', okFx: { cong: 6 }, base: 0.35, cost: 5 },
  ],
  familiar: [
    { id: 'conselho', label: 'Pedir um conselho', you: 'Estou numa fase difícil. O que você faria?', ok: 'Respira, faz o que é certo e o resto o tempo arruma.', fail: 'Você sabe que eu não entendo disso, mas tô aqui.', okFx: { img: 2, pop: 1 }, base: 0.8, cost: 0 },
  ],
  religioso: [
    { id: 'beno', label: 'Pedir a presença na comunidade', you: 'Queria pedir a sua palavra aos fiéis sobre o meu trabalho.', ok: 'Será um prazer. A comunidade vai saber.', fail: 'Não costumamos nos envolver nisso.', okFx: { pop: 5, img: 1 }, base: 0.25, cost: 5 },
  ],
  influenciador: [
    { id: 'video', label: 'Pedir um vídeo juntos', you: 'Bora fazer um conteúdo sobre a cidade?', ok: 'Fechou! Posto hoje à noite.', fail: 'Agenda cheia essa semana.', okFx: { pop: 5, img: -1 }, base: 0.3, cost: 5 },
  ],
  adversario: [
    { id: 'tregua', label: 'Propor uma trégua', you: 'Podemos fazer uma campanha sem baixaria?', ok: 'Fechado. Falo com o chefe.', fail: 'Sem chance. Eles querem briga.', okFx: { img: 3 }, base: 0.2, cost: 5 },
  ],
}
// Bate-papo: sem pedir nada, só melhora a relação
export const CHAT = { id: 'papo', label: 'Só bater um papo', you: 'Oi! Passando para saber como você está.', ok: 'Que bom falar contigo. Vamos manter contato.', okFx: { img: 1 }, gain: 12 }

export const LIGAR = { id: 'ligar', special: true, sphere: 'mun', name: 'Ligar para um contato', desc: 'Falar com alguém da sua rede: bater papo para fortalecer a relação ou pedir um favor.', fx: {} }
/* ===== mídia, outros candidatos, Justiça e pedidos polêmicos ===== */
Object.assign(ROLES, {
  emissora: { icon: '📻', name: 'Diretor(a) de rádio e TV', hi: { pop: 0.6 }, lo: { img: -0.5 }, hiText: '+0,6 popularidade por rodada', loText: '−0,5 imagem por rodada' },
  editor: { icon: '🗞️', name: 'Editor(a) de jornal', hi: { img: 0.5, pop: 0.2 }, lo: { pop: -0.5 }, hiText: '+0,5 imagem e +0,2 popularidade por rodada', loText: '−0,5 popularidade por rodada' },
  candidato: { icon: '🎙️', name: 'Outro(a) candidato(a)', hi: { cong: 0.5 }, lo: { pop: -0.3 }, hiText: '+0,5 base por rodada', loText: '−0,3 popularidade por rodada' },
  promotor: { icon: '⚖️', name: 'Promotor(a) / Justiça', hi: { img: 0.4 }, lo: { img: -0.6 }, hiText: '+0,4 imagem por rodada', loText: '−0,6 imagem por rodada' },
})

export const EXTRA_ROLES = { emissora: 42, editor: 40, candidato: 35, promotor: 45 }
// Garante que saves antigos e jogos novos tenham os contatos de mídia, candidatos e Justiça
export function ensureContacts(list, R) {
  const have = new Set(list.map((c) => c.role))
  for (const [role, rel] of Object.entries(EXTRA_ROLES)) if (!have.has(role)) list.push({ id: role, role, name: candName(R), rel })
  return list
}

// pedidos: dirty = polêmico (conta como escolha suja), heat = pressão da Justiça, rival = enfraquece o rival na eleição
const AD = (o) => ({ dirty: true, ...o })
ASKS.emissora = [
  { id: 'entrevista', label: 'Pedir uma entrevista no programa', you: 'Queria participar do seu programa da manhã. Tem espaço na agenda?', ok: 'Tenho um horário na quinta. Vamos nessa.', fail: 'A grade está fechada por semanas, desculpe.', okFx: { pop: 5, img: 1 }, base: 0.3, cost: 5 },
  { id: 'espaco', label: 'Comprar espaço na programação (legal)', you: 'Quero contratar um espaço publicitário dentro da lei, com nota e tudo.', ok: 'Fechado, mando a tabela.', fail: 'A tabela está esgotada até o fim do mês.', okFx: { pop: 6, cash: -3 }, base: 0.5, cost: 2 },
  AD({ id: 'camarada', label: 'Pedir cobertura camarada em troca de verba', you: 'A gente pode combinar uma cobertura mais amigável, com a verba de publicidade sendo bem generosa.', ok: 'Entendi o recado. Vou orientar a redação.', fail: 'Isso não é comigo. Não ligue mais com esse tipo de proposta.', okFx: { pop: 7, img: -7 }, failFx: { img: -5 }, heat: 10, base: 0.35, cost: 8 }),
]
ASKS.editor = [
  { id: 'artigo', label: 'Pedir um artigo de opinião seu', you: 'Gostaria de publicar um artigo sobre o que estamos construindo. Cabe no jornal?', ok: 'Cabe. Manda o texto até quarta.', fail: 'O espaço de opinião está fechado.', okFx: { img: 4, pop: 1 }, base: 0.3, cost: 5 },
  { id: 'direito', label: 'Exigir direito de resposta', you: 'Saiu uma matéria com erro. Peço direito de resposta.', ok: 'Vamos publicar sua nota na mesma página.', fail: 'A matéria está correta, vamos manter.', okFx: { img: 3 }, base: 0.5, cost: 4 },
  AD({ id: 'plantar', label: 'Plantar uma notícia contra o rival', you: 'Tenho uma informação que pode derrubar o nosso adversário. Posso garantir que é só entre nós.', ok: 'Interessante. Posso dar um jeito de sair sem sua digital.', fail: 'Não publico sem checar. E vou contar ao outro lado.', okFx: { pop: 4, cong: 1, img: -6 }, failFx: { img: -7 }, heat: 12, rival: 3, base: 0.3, cost: 8 }),
]
ASKS.candidato = [
  { id: 'alianca', label: 'Propor aliança para o segundo turno', you: 'Se a gente chegar ao segundo turno, podemos caminhar juntos?', ok: 'Conversa boa. Posso apoiar, desde que a gente combine os pontos.', fail: 'Ainda é cedo para falar disso.', okFx: { cong: 5 }, base: 0.25, cost: 6 },
  { id: 'debate', label: 'Combinar um debate civilizado', you: 'Podemos fazer um debate sem baixaria?', ok: 'Topo, desde que seja aberto ao público.', fail: 'Prefiro cada um no seu canto.', okFx: { img: 3, pop: 1 }, base: 0.4, cost: 3 },
  AD({ id: 'retirar', label: 'Oferecer um cargo para ele desistir', you: 'Há espaço para você no governo, se a sua candidatura deixasse de existir.', ok: 'Vou pensar com carinho. Acho que dá para conversar.', fail: 'Está me comprando? Isso vai para a imprensa.', okFx: { cong: 4, cash: -4, img: -7 }, failFx: { img: -8 }, heat: 14, rival: 1, base: 0.3, cost: 8 }),
]
ASKS.promotor = [
  { id: 'consulta', label: 'Pedir uma orientação jurídica', you: 'Queria entender se uma ação está dentro da lei antes de fazer.', ok: 'Posso orientar no que é público. Vamos organizar tudo certinho.', fail: 'Não posso dar orientação informal.', okFx: { img: 2 }, heat: -15, base: 0.6, cost: 2 },
  AD({ id: 'abafar', label: 'Pedir para segurar uma investigação', you: 'Tem um assunto no seu gabinete que talvez possa esperar mais um pouco.', ok: 'Vou ver o que posso fazer. Sem prometer nada.', fail: 'Isso é um crime. Vou anotar a conversa.', okFx: { img: -6 }, failFx: { img: -9 }, heat: -35, base: 0.15, cost: 10 }),
]
ASKS.empresario.push(AD({ id: 'caixa2', label: 'Aceitar um caixa dois', you: 'Se a ajuda for por fora, sem recibo, aceito. Fica entre nós.', ok: 'Fica entre nós. O dinheiro chega amanhã.', fail: 'Por fora eu não faço. Eu tenho a minha empresa.', okFx: { cash: 12, img: -6 }, failFx: { img: -6 }, heat: 14, base: 0.5, cost: 8 }))
ASKS.influenciador.push(AD({ id: 'robos', label: 'Contratar disparo em massa e perfis falsos', you: 'Preciso movimentar a internet por mim. Tem alguém que faz isso?', ok: 'Conheço uma agência. Em dois dias seu nome vai estar em todo lugar.', fail: 'Isso derruba conta e dá processo. Não me chame para isso.', okFx: { pop: 8, img: -6 }, failFx: { img: -6 }, heat: 10, base: 0.5, cost: 6 }))
ASKS.adversario.push(AD({ id: 'dossie', label: 'Comprar um dossiê do rival', you: 'Ouvi dizer que vocês têm informação sobre o meu adversário.', ok: 'Tenho uma pasta. É cara.', fail: 'Não sei do que você está falando.', okFx: { pop: 2, img: -6 }, failFx: { img: -6 }, heat: 12, rival: 3, base: 0.3, cost: 8 }))
ASKS.aliado.push(AD({ id: 'cargos', label: 'Trocar cargos por votos', you: 'Se você me garantir os votos, a gente conversa sobre indicações.', ok: 'Fechado. Eu levo a bancada.', fail: 'Agora não, está tudo muito exposto.', okFx: { cong: 8, img: -6 }, failFx: { img: -6 }, heat: 10, base: 0.45, cost: 7 }))

// conversas que chegam sozinhas (novos contatos)
SCRIPTS.push(
  S('radio_conv', 'emissora', 'call', ALL, 'Convite para o programa', 'Aqui é da rádio. Abriu uma vaga hoje no programa das 7. Você topa vir ao vivo, sem edição? O público anda cobrando.', [
    C('Topar e falar com franqueza', { pop: 5, img: 2 }, 7, 'Você foi sincero e o apresentador gostou. A audiência subiu.'),
    C('Topar, mas escolhendo os temas', { pop: 2, img: -1 }, 2, 'Saiu morno, e o apresentador percebeu.'),
    C('Sugerir um pacote de publicidade para facilitar', { pop: 4, cash: -3, img: -6 }, 6, 'Entrevista tranquila. E os concorrentes comentaram a "coincidência".', { dirty: true, heat: 8 }),
    C('Recusar', { pop: -1 }, -4, 'Ele chamou o seu rival.'),
  ]),
  S('editor_pauta', 'editor', 'msg', ALL, 'Pauta sobre o seu mandato', 'O jornal está preparando uma matéria de balanço. Quer dar sua versão antes de a gente fechar?', [
    C('Mandar números e documentos', { img: 4, pop: 1 }, 6, 'A matéria saiu equilibrada e citou os números.'),
    C('Pedir para ver o texto antes de sair', { img: -2 }, -5, 'Ele não gostou da exigência. A matéria saiu mais dura.'),
    C('Ignorar a mensagem', { img: -2, pop: -1 }, -4, 'A matéria saiu só com a versão dos seus críticos.'),
  ]),
  S('candidato_proposta', 'candidato', 'street', [1, 2, 3], 'Outro candidato quer conversar', 'Estava de passagem e queria trocar uma ideia. Podemos fechar um acordo, tipo não se atacar na reta final. O que acha?', [
    C('Aceitar o pacto de não agressão', { img: 2, pop: -1 }, 7, 'Ficou tudo na base da palavra. Os dois seguiram educados.'),
    C('Propor uma troca: apoio no segundo turno por cargos', { cong: 4, img: -6 }, 8, 'Saiu do papo um acordo que ninguém quer assumir em público.', { dirty: true, heat: 8 }),
    C('Recusar com educação', {}, -3, 'Ele sorriu e disse que "a política é uma longa estrada".'),
  ]),
  S('promotor_aviso', 'promotor', 'call', [1, 2, 3], 'Um aviso informal', 'Aqui é da Promotoria. Só um aviso informal: o nome de um aliado seu apareceu em uma apuração. Se quiser contribuir, a porta está aberta.', [
    C('Oferecer ajuda e entregar documentos', { img: 3, cong: -2 }, 8, 'O promotor agradeceu. O seu aliado, nem tanto.', { heat: -12 }),
    C('Pedir para o aliado se explicar sozinho', { img: 1 }, 1, 'Ficou neutro e todo mundo percebeu.'),
    C('Pedir para tratar o assunto com discrição', { img: -6, cong: 2 }, -6, 'A conversa vazou. Ficou parecendo pressão.', { dirty: true, heat: 10 }),
  ]),
)