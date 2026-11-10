import { RV_EVENTOS_35, RV_ACOES_35 } from './bloco35'
// BLOCO 30: o rival recorrente. Ele aparece desde o começo da carreira, sobe, cai, some, volta, vira aliado
// improvável ou inimigo mortal, e se lembra de como você o tratou. Tudo aqui é dado: a lógica fica no motor.

export const RV_TRAITS = ['pragmatico', 'idealista', 'ganancioso', 'orgulhoso', 'cauteloso']
export const RV_ESTAGIOS = {
  ascensao: { icon: '📈', nome: 'Em ascensão', txt: 'Ainda é um nome novo, mas cresce rápido.' },
  firme: { icon: '🥊', nome: 'Firme na disputa', txt: 'Já derrotou você ou se firmou como o grande adversário.' },
  queda: { icon: '📉', nome: 'Em queda', txt: 'Perdeu prestígio e luta para não sumir.' },
  exilio: { icon: '🧳', nome: 'Afastado da política', txt: 'Sumiu do mapa. A política, porém, tem memória curta com quem volta.' },
  volta: { icon: '🔥', nome: 'De volta, mais forte', txt: 'Reapareceu com discurso novo e gente nova.' },
  aliado: { icon: '🤝', nome: 'Aliado improvável', txt: 'O antigo rival hoje senta do seu lado da mesa.' },
  inimigo: { icon: '☠️', nome: 'Inimigo mortal', txt: 'O ódio virou projeto de vida. Ele não perde chance de te atingir.' },
}
export const TRAIT_NOMES = { pragmatico: 'pragmático', idealista: 'idealista', ganancioso: 'interesseiro', orgulhoso: 'orgulhoso', cauteloso: 'cauteloso' }

// um evento tem: estágios em que pode acontecer, texto, opções (efeito em você: fx; efeito nele: rv) e a opção padrão se você deixar passar
export const RV_EVENTOS = [
  {
    id: 'ataque', est: ['ascensao', 'firme', 'inimigo', 'volta'], icon: '🥊', padrao: 'ignorar',
    titulo: (r) => `${r.nome} ataca você`,
    texto: (r) => `${r.nome} (${r.sigla}) foi à rádio dizer que seu mandato é de fachada e que o povo merece coisa melhor. Como responder?`,
    ops: [
      { id: 'responder', icon: '🗣️', name: 'Responder à altura', desc: 'Sobe o tom e ganha as manchetes, mas esquenta a briga.', fx: { pop: 2, img: -1 }, rv: { forca: -2, odio: 8 } },
      { id: 'ignorar', icon: '🤐', name: 'Deixar passar', desc: 'Não dá palco, mas o ataque pega.', fx: { pop: -1.5 }, rv: { forca: 3 } },
      { id: 'processar', icon: '⚖️', name: 'Processar por difamação', desc: 'Custa caixa, mas passa seriedade.', fx: { img: 1.5 }, cash: 2, rv: { odio: 4 } },
    ],
  },
  {
    id: 'escandalo', est: ['ascensao', 'firme', 'volta'], icon: '🧨', padrao: 'quieto',
    titulo: (r) => `Escândalo atinge ${r.nome}`,
    texto: (r) => `Um dossiê sobre ${r.nome} caiu na sua mão. É verdadeiro, e pode destruir a carreira dele. O que fazer?`,
    ops: [
      { id: 'vazar', icon: '📂', name: 'Vazar para a imprensa', desc: 'Derruba o rival. O ódio dele vira jogo pesado.', fx: { pop: 1, img: -2 }, rv: { forca: -22, odio: 18, queda: true }, sujo: true },
      { id: 'poupar', icon: '🕊️', name: 'Guardar e não usar', desc: 'Um gesto que ele não esquece.', fx: { img: 2 }, rv: { estima: 12, odio: -4 } },
      { id: 'quieto', icon: '🤷', name: 'Deixar o caso seguir sozinho', desc: 'A imprensa decide.', fx: {}, rv: { forca: -8 } },
    ],
  },
  {
    id: 'trégua', est: ['firme', 'queda', 'ascensao', 'volta'], icon: '🤝', padrao: 'recusar', min: 'estimaOuQueda',
    titulo: (r) => `${r.nome} propõe uma trégua`,
    texto: (r) => `${r.nome} pede uma conversa reservada para baixar a temperatura. Dá para virar parceiro, ou pelo menos parar de se ferir.`,
    ops: [
      { id: 'aceitar', icon: '🤝', name: 'Aceitar a conversa', desc: 'Menos briga, mais pontes.', fx: { cong: 2, img: 0.5 }, rv: { estima: 16, odio: -12 } },
      { id: 'recusar', icon: '🚪', name: 'Recusar', desc: 'Mantém a distância e a rixa.', fx: {}, rv: { odio: 4 } },
    ],
  },
  {
    id: 'sabotagem', est: ['inimigo'], icon: '☠️', padrao: 'ignorar',
    titulo: (r) => `${r.nome} trama contra você`,
    texto: (r) => `Os aliados de ${r.nome} espalharam um boato sobre sua gestão. Se pegar, derruba a sua imagem.`,
    ops: [
      { id: 'blindar', icon: '🛡️', name: 'Pagar assessoria e desmentir', desc: 'Custa caixa, protege a imagem.', fx: { img: 1 }, cash: 3, rv: { odio: 2 } },
      { id: 'contra', icon: '🔥', name: 'Contra-atacar', desc: 'Enfraquece ele, mas vira guerra aberta.', fx: { img: -1.5, pop: 1 }, rv: { forca: -6, odio: 6 } },
      { id: 'ignorar', icon: '🤐', name: 'Ignorar', desc: 'O boato corre solto.', fx: { img: -3.5 }, rv: { forca: 2 } },
    ],
  },
  ...RV_EVENTOS_35,
]

// eventos automáticos (sem escolha): trocar de partido, defender você, trair, voltar do exílio
export const RV_AUTO = {
  troca: (r, sigla) => `${r.nome} trocou de ${r.sigla} para ${sigla}, dizendo que "o partido não o representava mais". Os analistas desconfiam de cálculo eleitoral.`,
  ajuda: (r) => `${r.nome}, seu antigo rival, defendeu você no plenário. A cena rendeu manchete e muita confusão nas redes.`,
  traicao: (r) => `${r.nome} saiu da aliança e acusou você de ter quebrado combinados. A ex-parceria virou inimizade.`,
  queda: (r) => `${r.nome} perdeu o prestígio e a base. Nos corredores, já falam dele no passado.`,
  exilio: (r) => `${r.nome} deixou a política. Foi cuidar da vida, dizem uns. Outros, que ele só espera.`,
  volta: (r) => `${r.nome} está de volta, com discurso novo e financiadores novos. Quem o dava como fim de carreira se enganou.`,
  inimigo: (r) => `A rixa com ${r.nome} passou de qualquer limite razoável. Ele agora é, sem rodeios, seu inimigo político número um.`,
  aliado: (r) => `${r.nome} e você viraram aliados. Quem diria, depois de tudo o que foi dito em campanha.`,
}

export const RV_ACOES = [
  { id: 'trégua', icon: '🤝', name: 'Propor trégua', desc: 'Oferecer uma conversa reservada. Funciona melhor se ele ainda não te odeia.' },
  { id: 'atacar', icon: '📣', name: 'Atacar em público', desc: 'Desgasta o rival na eleição, mas arranha sua imagem e aumenta o ódio.' },
  ...RV_ACOES_35,
]
