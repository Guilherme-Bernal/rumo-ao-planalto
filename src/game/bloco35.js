// BLOCO 35: origem familiar, ações e eventos de família por origem, rival mais ativo e pressão do Congresso.
// Tudo aqui é dado: a lógica fica no motor.

// Origem familiar escolhida na criação do personagem. h = harmonia inicial; conjuge/filhos já existem na largada.
export const FAM_ORIGENS = {
  solteiro: { h: 70, conjuge: false, filhos: 0, decai: 0 },
  casado: { h: 68, conjuge: true, filhos: 0, decai: 0.2 },
  filhos: { h: 56, conjuge: true, filhos: 2, decai: 0.7 },
  divorciado: { h: 58, conjuge: false, filhos: 1, decai: 0.4 },
  dinastia: { h: 62, conjuge: false, filhos: 0, decai: 0 },
  humilde: { h: 72, conjuge: false, filhos: 0, decai: 0 },
  empresarial: { h: 60, conjuge: false, filhos: 0, decai: 0 },
}

export const FAM_ORIGEM_NOMES = {
  solteiro: 'Solteiro(a), focado(a) na carreira',
  casado: 'Casado(a), sem filhos',
  filhos: 'Casado(a) com filhos pequenos',
  divorciado: 'Divorciado(a), com filho',
  dinastia: 'Família política tradicional',
  humilde: 'Família humilde, primeira geração',
  empresarial: 'Família empresária',
}

// categoria que entra na criação do personagem (ver brasil-traits.js)
export const TRAIT_FAMILIA = {
  id: 'familia',
  label: 'Família e origem',
  hint: 'Quem espera por você em casa muda seus números iniciais, os eventos familiares e as ações da aba Contatos › Pessoas. A harmonia da casa ainda pesa na eleição.',
  def: 'solteiro',
  options: [
    { id: 'solteiro', icon: '🧍', name: FAM_ORIGEM_NOMES.solteiro, desc: 'Sem cônjuge nem filhos no começo. Agenda livre, mas a imprensa estranha quem "não tem raiz". Pode surgir um relacionamento ao longo da carreira.', fx: { cong: 1, img: -1 } },
    { id: 'casado', icon: '💍', name: FAM_ORIGEM_NOMES.casado, desc: 'Um cônjuge ao seu lado desde a largada. Rende imagem e apoio em campanha, e cobra tempo em casa.', fx: { img: 2, pop: 1 }, gain: { img: 1.05 } },
    { id: 'filhos', icon: '👨‍👩‍👧', name: FAM_ORIGEM_NOMES.filhos, desc: 'Cônjuge e dois filhos. Muita simpatia com o eleitor, pouco dinheiro e uma casa que exige presença o tempo todo.', fx: { pop: 3, img: 2, cash: -2 }, loss: { img: 1.05 } },
    { id: 'divorciado', icon: '💔', name: FAM_ORIGEM_NOMES.divorciado, desc: 'Um filho para criar e um passado que a imprensa gosta de lembrar. Menos amarras, mais exposição.', fx: { pop: 1, img: -1 }, loss: { img: 1.08 } },
    { id: 'dinastia', icon: '🏛️', name: FAM_ORIGEM_NOMES.dinastia, desc: 'Pai, tio ou avó já foram eleitos. Abre portas no Legislativo e no caixa, mas o clã cobra favores e a imprensa fala em nepotismo.', fx: { cong: 6, cash: 3, img: -2 }, loss: { img: 1.1 } },
    { id: 'humilde', icon: '🏘️', name: FAM_ORIGEM_NOMES.humilde, desc: 'Veio de baixo e o povo se vê em você. A vizinhança pede ajuda, o caixa começa curto e ninguém te deve favor.', fx: { pop: 5, img: 2, cash: -3, cong: -1 }, gain: { pop: 1.08 } },
    { id: 'empresarial', icon: '🏢', name: FAM_ORIGEM_NOMES.empresarial, desc: 'O negócio da família ajuda no caixa e nos contatos, e levanta suspeita a cada contrato público.', fx: { cash: 4, cong: 2, img: -2 }, loss: { img: 1.1 } },
  ],
}

// ações de família liberadas por origem (orig) ou por situação (conjuge, filhos). Só uma por rodada.
export const FAM_ACOES_35 = [
  { id: 'pais', icon: '🧓', name: 'Visitar os pais', desc: 'Harmonia +9.', cash: 0, h: 9 },
  { id: 'casal', icon: '❤️', name: 'Noite a dois', desc: 'Harmonia +16. Exige cônjuge.', cash: 0, h: 16, casado: true },
  { id: 'escola', icon: '🎒', name: 'Acompanhar os filhos na escola', desc: 'Harmonia +14 e uma foto simpática (+0,4 popularidade). Exige filhos.', cash: 0, h: 14, fx: { pop: 0.4 }, filhos: true },
  { id: 'sobrenome', icon: '🏛️', name: 'Acionar o sobrenome da família', desc: 'Base política +2, imagem -0,8 e harmonia -3. Só para quem vem de família política.', cash: 0, h: -3, fx: { cong: 2, img: -0.8 }, orig: ['dinastia'] },
  { id: 'raiz', icon: '🏘️', name: 'Voltar ao bairro onde cresceu', desc: 'Popularidade +1,5, serviços sociais +0,3 e harmonia +6.', cash: 0, h: 6, fx: { pop: 1.5, soc: 0.3 }, orig: ['humilde'] },
  { id: 'negocio', icon: '🏢', name: 'Pedir ajuda ao negócio da família', desc: 'Caixa +2, imagem -1 e harmonia -2.', cash: 0, h: -2, fx: { cash: 2, img: -1 }, orig: ['empresarial'] },
  { id: 'guarda', icon: '☎️', name: 'Combinar guarda e pensão', desc: 'Harmonia +12. Custa 1 de Caixa.', cash: 1, h: 12, orig: ['divorciado'] },
  { id: 'namorar', icon: '🌹', name: 'Sair com alguém', desc: 'Harmonia +6 e chance de um noivado aparecer. Para quem não tem cônjuge.', cash: 0, h: 6, solteiro: true },
]

// eventos de família novos (mesmo formato dos de pessoas.js)
export const FAM_EVENTOS_35 = {
  pais_idosos: {
    icon: '🧓', titulo: () => 'Seus pais precisam de cuidados',
    texto: (f) => `A saúde dos pais de ${f.nome === 'Alguém da família' ? 'você' : 'vocês'} piorou e a família espera que você esteja presente.`,
    ops: [
      { id: 'cuidar', icon: '🏡', name: 'Colocar a família em primeiro lugar', desc: 'Custa 2 de Caixa em agenda cancelada.', cash: 2, fx: { img: 0.5 }, h: 16 },
      { id: 'cuidador', icon: '👩‍⚕️', name: 'Contratar um cuidador', desc: 'Custa 1 de Caixa, mas a culpa fica.', cash: 1, fx: {}, h: 6 },
      { id: 'agenda', icon: '📅', name: 'Seguir com a agenda', desc: 'O trabalho vem primeiro.', fx: { cong: 0.5 }, h: -12 },
    ],
  },
  escola: {
    icon: '🎒', titulo: (f) => `${f.filho} sofre na escola por ser filho de político`,
    texto: (f) => `${f.filho} chegou em casa chorando depois de provocações na escola. A diretora pede uma conversa.`,
    ops: [
      { id: 'conversar', icon: '🗣️', name: 'Ir à escola e conversar', desc: 'Presença que vale mais que discurso.', fx: {}, h: 14 },
      { id: 'trocar', icon: '🏫', name: 'Trocar de escola', desc: 'Custa 1 de Caixa e rende uma pergunta incômoda na imprensa.', cash: 1, fx: { img: -0.3 }, h: 8 },
      { id: 'ignorar', icon: '🤷', name: 'Dizer que passa', desc: 'Não tem tempo.', fx: {}, h: -9 },
    ],
  },
  cla: {
    icon: '🏛️', titulo: () => 'O clã cobra um favor',
    texto: () => 'Um tio influente lembra que o sobrenome da família abriu muitas portas e pede um cargo para um afilhado.',
    ops: [
      { id: 'atender', icon: '🤝', name: 'Atender o pedido', desc: 'Base política sobe, a imagem desce e a imprensa fareja.', fx: { cong: 1.8, img: -2.2 }, h: 8, sujo: true },
      { id: 'recusar', icon: '🚫', name: 'Recusar e bancar o desgaste', desc: 'Imagem limpa, parentela furiosa.', fx: { img: 1.2, cong: -1.5 }, h: -10 },
    ],
  },
  ex: {
    icon: '💔', titulo: () => 'A ex-cônjuge fala com a imprensa',
    texto: () => 'Em uma entrevista, a pessoa com quem você foi casado(a) conta a versão dela da separação.',
    ops: [
      { id: 'calar', icon: '🤐', name: 'Não responder', desc: 'Deixa passar e aceita o desgaste.', fx: { img: -1.2 }, h: -3 },
      { id: 'nota', icon: '📝', name: 'Soltar uma nota educada', desc: 'Custa 1 de Caixa em assessoria e acalma o assunto.', cash: 1, fx: { img: -0.3 }, h: 4 },
      { id: 'processar', icon: '⚖️', name: 'Responder à altura', desc: 'Sobe o tom e vira briga de novela.', fx: { img: -2, pop: 0.8 }, h: -8 },
    ],
  },
  negocio: {
    icon: '🏢', titulo: () => 'O negócio da família vira alvo',
    texto: () => 'Um jornal revela que a empresa da sua família assinou contrato com um órgão que você supervisiona.',
    ops: [
      { id: 'afastar', icon: '🔒', name: 'Afastar a família do contrato', desc: 'Custa 2 de Caixa e limpa a imagem.', cash: 2, fx: { img: 1.5 }, h: -5 },
      { id: 'manter', icon: '🧾', name: 'Manter e dizer que é legal', desc: 'A grana entra, a imagem sai.', fx: { cash: 2, img: -2.8 }, h: 4, sujo: true },
    ],
  },
  vizinhanca: {
    icon: '🏘️', titulo: () => 'A vizinhança pede ajuda',
    texto: () => 'Gente do bairro onde você cresceu aparece com um pedido: uma reforma na quadra e um posto de saúde aberto à noite.',
    ops: [
      { id: 'ajudar', icon: '🤲', name: 'Ajudar e aparecer', desc: 'Custa 1 de Caixa e rende carinho do povo.', cash: 1, fx: { pop: 2.4, img: 0.4 }, h: 6 },
      { id: 'ocupado', icon: '📅', name: 'Dizer que está sem agenda', desc: 'A gente do bairro comenta.', fx: { pop: -1.2 }, h: -4 },
    ],
  },
}

// rival mais ativo: eventos e ações novos
export const RV_EVENTOS_35 = [
  {
    id: 'debate', est: ['ascensao', 'firme', 'inimigo', 'volta'], icon: '🎙️', padrao: 'recusar',
    titulo: (r) => `${r.nome} desafia você para um debate`,
    texto: (r) => `${r.nome} (${r.sigla}) convidou a imprensa e marcou data: quer você no palco, cara a cara, falando de resultados.`,
    ops: [
      { id: 'aceitar', icon: '🎤', name: 'Aceitar o debate', desc: 'Sobe o jogo, mas depende de preparo.', fx: { pop: 1.5, img: 0.5 }, rv: { forca: -4, odio: 4 } },
      { id: 'preparar', icon: '📚', name: 'Aceitar e contratar preparação', desc: 'Custa 2 de Caixa e quase garante a vitória.', cash: 2, fx: { pop: 3, img: 1 }, rv: { forca: -7, odio: 5 } },
      { id: 'recusar', icon: '🚪', name: 'Recusar', desc: 'Parece medo e entrega a pauta.', fx: { pop: -1.5, img: -0.5 }, rv: { forca: 3 } },
    ],
  },
  {
    id: 'familia', est: ['inimigo', 'firme', 'volta'], icon: '👪', padrao: 'ignorar',
    titulo: (r) => `Aliados de ${r.nome} expõem sua família`,
    texto: (r) => `Perfis ligados a ${r.nome} espalham fotos e boatos sobre a sua família. A casa inteira viu.`,
    ops: [
      { id: 'proteger', icon: '🛡️', name: 'Proteger a família e responder', desc: 'Custa 2 de Caixa em assessoria e advogado.', cash: 2, fx: { img: 0.5 }, h: 8, rv: { odio: 6 } },
      { id: 'contra', icon: '🔥', name: 'Contra-atacar o rival', desc: 'Briga aberta, a família em segundo plano.', fx: { img: -1.2, pop: 0.8 }, h: -4, rv: { forca: -5, odio: 8 } },
      { id: 'ignorar', icon: '🤐', name: 'Deixar passar', desc: 'A família sofre calada.', fx: { img: -1 }, h: -12, rv: { forca: 2 } },
    ],
  },
  {
    id: 'coalizao', est: ['ascensao', 'firme', 'inimigo', 'volta'], icon: '🧲', padrao: 'deixar',
    titulo: (r) => `${r.nome} assedia um partido da sua base`,
    texto: (r) => `${r.nome} foi visto jantando com a liderança de um partido que vota com você. A conversa é sobre cargos.`,
    ops: [
      { id: 'oferecer', icon: '🎁', name: 'Oferecer espaço no governo', desc: 'Custa 2 de Caixa e segura o partido.', cash: 2, fx: { cong: 1 }, coal: 8, rv: { odio: 2 } },
      { id: 'ligar', icon: '📞', name: 'Ligar e cobrar lealdade', desc: 'Sem custo, resultado incerto.', fx: {}, coal: 2, rv: { odio: 3 } },
      { id: 'deixar', icon: '🤷', name: 'Deixar quieto', desc: 'O partido se sente desprezado.', fx: { cong: -0.8 }, coal: -12, rv: { forca: 3 } },
    ],
  },
  {
    id: 'pesquisa', est: ['ascensao', 'firme', 'inimigo', 'volta'], icon: '📊', padrao: 'ignorar',
    titulo: (r) => `Pesquisa mostra ${r.nome} crescendo`,
    texto: (r) => `Um instituto divulga números em que ${r.nome} encosta em você. A imprensa só fala disso.`,
    ops: [
      { id: 'contestar', icon: '🧮', name: 'Contestar a metodologia', desc: 'Custa 1 de Caixa e esfria o assunto.', cash: 1, fx: { img: 0.3 }, rv: { forca: -2 } },
      { id: 'reagir', icon: '📣', name: 'Reagir com agenda positiva', desc: 'Anuncia entregas e puxa a pauta.', fx: { pop: 1.5, img: -0.3 }, rv: { forca: -3, odio: 2 } },
      { id: 'ignorar', icon: '🙈', name: 'Fingir que não viu', desc: 'A narrativa é dele.', fx: { pop: -1 }, rv: { forca: 4 } },
    ],
  },
  {
    id: 'cooptar', est: ['ascensao', 'queda', 'volta'], icon: '🤲', padrao: 'recusar', min: 'estimaOuQueda',
    titulo: (r) => `${r.nome} oferece apoio em troca de espaço`,
    texto: (r) => `${r.nome} sabe que a maré virou e propõe ficar do seu lado, se tiver uma vaga na mesa.`,
    ops: [
      { id: 'aceitar', icon: '🤝', name: 'Aceitar e dar um cargo', desc: 'Base política sobe, mas ele ganha palanque.', fx: { cong: 2, img: -0.5 }, rv: { estima: 14, odio: -10, forca: 4 } },
      { id: 'recusar', icon: '🚪', name: 'Recusar', desc: 'Sem dívida e sem aliado.', fx: {}, rv: { odio: 3 } },
    ],
  },
]

export const RV_ACOES_35 = [
  { id: 'debate', icon: '🎙️', name: 'Desafiar para um debate', desc: 'Chance de vencer depende do perfil dele e da sua imagem. Se der certo, ele perde força. Se der errado, você paga em popularidade.' },
  { id: 'espionar', icon: '🕵️', name: 'Investigar o rival', desc: 'Custa 1 de Caixa. Pode render um dossiê para usar, ou virar escândalo para você.' },
  { id: 'cooptar', icon: '🎁', name: 'Oferecer um cargo ao rival', desc: 'Custa 2 de Caixa. Só funciona se ele tiver alguma estima por você. Tira um adversário do jogo.' },
]

// pressão do Congresso: eventos recorrentes que cobram da coalizão e do mandato
export const PRESS_EVENTOS = {
  pauta_bomba: {
    grupo: 'exec', icon: '💣', padrao: 'negociar',
    titulo: 'Congresso aprova uma pauta-bomba',
    texto: 'O plenário aprovou reajustes e benefícios que estouram o caixa. A decisão agora é sua.',
    ops: [
      { id: 'vetar', icon: '✋', name: 'Vetar', desc: 'Protege o caixa e queima a base política.', fx: { cong: -3, img: 1 } },
      { id: 'sancionar', icon: '✍️', name: 'Sancionar', desc: 'Agrada o Congresso e custa 4 de Caixa.', fx: { cong: 1.5, pop: 1 }, cash: 4 },
      { id: 'negociar', icon: '🤝', name: 'Negociar um meio-termo', desc: 'Custa 2 de Caixa e desgasta a base.', fx: { cong: -1 }, cash: 2 },
    ],
  },
  convocacao: {
    grupo: 'exec', icon: '📜', padrao: 'blindar',
    titulo: 'A oposição convoca um ministro',
    texto: 'Um ministro do seu governo foi convocado para explicar contratos e nomeações diante do plenário.',
    ops: [
      { id: 'vai', icon: '🏛️', name: 'Mandar o ministro depor', desc: 'Transparência com desgaste de imagem.', fx: { img: -1.5, cong: 0.5 } },
      { id: 'blindar', icon: '🛡️', name: 'Blindar o ministro com a base', desc: 'A base fecha, mas cobra a conta.', fx: { cong: -2.5, img: -0.5 } },
      { id: 'trocar', icon: '🔁', name: 'Trocar o ministro', desc: 'Corta o problema e irrita o partido dele.', fx: { cong: 1, img: 0.5, pop: -0.5 } },
    ],
  },
  orcamento: {
    grupo: 'exec', icon: '✂️', padrao: 'aceitar',
    titulo: 'O relator corta verba de programas seus',
    texto: 'No parecer do orçamento, o relator derrubou recursos de programas do governo para redirecionar para emendas.',
    ops: [
      { id: 'recompor', icon: '🧾', name: 'Recompor com o caixa', desc: 'Custa 3 de Caixa e mantém os programas.', fx: { soc: 0.5 }, cash: 3 },
      { id: 'emendas', icon: '💸', name: 'Liberar emendas para recompor a base', desc: 'Custa 2 de Caixa, ganha base e perde imagem.', fx: { cong: 2, img: -1 }, cash: 2 },
      { id: 'aceitar', icon: '🤷', name: 'Aceitar o corte', desc: 'Os programas sofrem.', fx: { soc: -1.8, pop: -0.8 } },
    ],
  },
  obstrucao: {
    grupo: 'exec', icon: '🧱', padrao: 'esperar',
    titulo: 'A oposição obstrui a pauta do governo',
    texto: 'A bancada contrária trava a votação e segura a pauta com requerimentos e sessões esvaziadas.',
    ops: [
      { id: 'articular', icon: '☎️', name: 'Articular com os líderes', desc: 'Custa 1 de Caixa e destrava parte da pauta.', fx: { cong: 1 }, cash: 1 },
      { id: 'pressao', icon: '📢', name: 'Ir às ruas e às redes', desc: 'Pressiona o Congresso e racha a base.', fx: { pop: 1.2, cong: -1.8 } },
      { id: 'esperar', icon: '⏳', name: 'Esperar a poeira baixar', desc: 'A agenda do governo atrasa.', fx: { pop: -1, cong: -0.8 } },
    ],
  },
  cobranca: {
    grupo: 'leg', icon: '📎', padrao: 'consciencia',
    titulo: 'O líder do partido cobra alinhamento',
    texto: 'Antes de uma votação importante, a liderança lembra quem banca a sua campanha e espera o seu voto fechado.',
    ops: [
      { id: 'alinhar', icon: '🤝', name: 'Alinhar com o partido', desc: 'Garante apoio e arranha a imagem.', fx: { cong: 1.5, img: -1, pop: -0.5 } },
      { id: 'consciencia', icon: '🧭', name: 'Votar de acordo com a consciência', desc: 'Imagem melhor, partido insatisfeito.', fx: { cong: -3, img: 1.5 } },
      { id: 'negociar', icon: '💬', name: 'Negociar em troca de emenda', desc: 'Custa 1 de Caixa e fica uma dívida.', fx: { cong: -0.5 }, cash: 1 },
    ],
  },
  emenda_gaveta: {
    grupo: 'leg', icon: '🗃️', padrao: 'adiar',
    titulo: 'Prefeitos cobram a emenda prometida',
    texto: 'Lideranças das cidades que apoiaram você lembram da emenda prometida na campanha e ameaçam trocar de lado.',
    ops: [
      { id: 'liberar', icon: '💸', name: 'Liberar a emenda', desc: 'Custa 3 de Caixa e fideliza a região.', fx: { pop: 1.5, cong: 0.5 }, cash: 3 },
      { id: 'parcelar', icon: '🧮', name: 'Parcelar a promessa', desc: 'Custa 1 de Caixa e segura por um tempo.', fx: { pop: 0.4 }, cash: 1 },
      { id: 'adiar', icon: '⏳', name: 'Adiar de novo', desc: 'A região esfria com você.', fx: { pop: -2, cong: -1 } },
    ],
  },
  representacao: {
    grupo: 'leg', icon: '🔎', padrao: 'ignorar',
    titulo: 'Representação contra você na Casa',
    texto: 'Um colega protocolou uma representação por quebra de decoro e a imprensa já pediu cópia.',
    ops: [
      { id: 'defesa', icon: '⚖️', name: 'Contratar defesa técnica', desc: 'Custa 2 de Caixa e protege a imagem.', fx: { img: 0.5 }, cash: 2 },
      { id: 'politica', icon: '🏛️', name: 'Resolver na política', desc: 'Pede socorro aos aliados e fica devendo.', fx: { cong: -1.5, img: -0.3 } },
      { id: 'ignorar', icon: '🙈', name: 'Não dar importância', desc: 'O caso cresce.', fx: { img: -2.2 } },
    ],
  },
}
