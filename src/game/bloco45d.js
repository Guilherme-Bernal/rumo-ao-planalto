// BLOCO 45D: QG de campanha. Agenda de dias, marqueteiro, financiamento, horário eleitoral, TSE e casos de campanha.

export const DIAS_CAMP = { turno1: 6, turno2: 4 }
export const M_CAMP_INI = { embalo: 50, org: 50, risco: 10 }
export const CAMP_BONUS_MAX = 6

export const MARQUETEIROS = [
  { id: 'tradicional', icon: '📺', nome: 'Marqueteiro tradicional', desc: 'Especialista em TV. O horário eleitoral rende mais.', tv: 1.4, rua: 1, risco: 0 },
  { id: 'digital', icon: '📱', nome: 'Estrategista digital', desc: 'Redes e vídeos curtos. Rende em comício e carreata.', tv: 0.9, rua: 1.25, risco: 0 },
  { id: 'agressivo', icon: '🥊', nome: 'Marqueteiro agressivo', desc: 'Propaganda dura. Rende muito, mas arrasta processo na Justiça Eleitoral.', tv: 1.25, rua: 1.1, risco: 6 },
]
export const MARQUETEIRO_CUSTO = 2

// ---- agenda de campo: cada ação gasta dias ----
export const AGENDA_CAMP = [
  { id: 'carreata', icon: '🚗', nome: 'Carreata', desc: 'Mostra força nas ruas. +6 de embalo.', dias: 1, cash: 2, m: { embalo: 6, org: -2 }, rua: true },
  { id: 'comicio', icon: '🎤', nome: 'Comício em reduto', desc: 'Multidão e energia. +5 de embalo.', dias: 1, cash: 1, m: { embalo: 5 }, rua: true },
  { id: 'caminhada', icon: '🚶', nome: 'Caminhada em bairros', desc: 'Contato direto. +3 de embalo e +3 de estrutura.', dias: 1, cash: 0, m: { embalo: 3, org: 3 } },
  { id: 'sabatina', icon: '🎙️', nome: 'Sabatina em rádio e TV locais', desc: 'Sem custo. Pode render ou virar gafe.', dias: 1, cash: 0, p: 0.6, ok: { t: 'A sabatina foi bem e viralizou.', m: { embalo: 5 } }, bad: { t: 'A sabatina rendeu uma gafe e virou meme.', m: { embalo: -4 } } },
  { id: 'base', icon: '🧑‍🤝‍🧑', nome: 'Reunião com a base e cabos eleitorais', desc: 'Organiza fiscais e voluntários. +8 de estrutura.', dias: 1, cash: 1, m: { org: 8 } },
  { id: 'jurídico', icon: '⚖️', nome: 'Reforçar o jurídico da campanha', desc: 'Custa 1. Reduz o risco com a Justiça Eleitoral em 10.', dias: 1, cash: 1, m: { risco: -10 } },
]
export const AGENDA_POR_ID = Object.fromEntries(AGENDA_CAMP.map((a) => [a.id, a]))

// ---- horário eleitoral ----
export const TV_EST = [
  { id: 'positiva', icon: '😀', nome: 'Propaganda propositiva', desc: 'Apresenta propostas e história. Segura o embalo.', m: { embalo: 5 }, risco: 0 },
  { id: 'comparativa', icon: '⚖️', nome: 'Propaganda comparativa', desc: 'Contrasta com o rival. Mais embalo, mais risco.', m: { embalo: 8 }, risco: 4 },
  { id: 'negativa', icon: '🗡️', nome: 'Propaganda negativa', desc: 'Ataca o rival. Muito embalo e muito risco de direito de resposta.', m: { embalo: 11 }, risco: 12, img: -1.5 },
]
export const TV_DIAS = 1
export const TV_CUSTO = 2
export const TEMPO_TV_BASE = 1

// ---- financiamento ----
export const FINANC = [
  { id: 'fundo', icon: '🏛️', nome: 'Fundo eleitoral e partidário', desc: 'Dinheiro limpo, mas limitado e disputado.', cash: 4, risco: 0, cd: 'fin', max: 1 },
  { id: 'doadores', icon: '🏢', nome: 'Doação de empresários e pessoas físicas', desc: 'Entra dinheiro dentro do limite legal. Doador cobra depois.', cash: 6, risco: 4, dirty: false, cd: 'fin', max: 2 },
  { id: 'vaquinha', icon: '📲', nome: 'Vaquinha digital', desc: 'Pouco dinheiro e muita militância.', cash: 3, m: { embalo: 3 }, risco: 0, cd: 'fin', max: 2 },
  { id: 'caixa2', icon: '💼', nome: 'Caixa dois', desc: 'Muito dinheiro e muito risco. Se descoberto, o registro pode ser impugnado.', cash: 12, risco: 25, dirty: true, cd: 'fin', max: 1 },
]
export const FIN_POR_ID = Object.fromEntries(FINANC.map((f) => [f.id, f]))

// ---- casos que chegam na campanha ----
export const PADRAO_CAMP = 'esperar'
export const CASOS_CAMP = [
  { id: 'tse', icon: '🏛️', nome: 'TSE questiona as contas da campanha', prob: 0.5, when: (m) => m.risco >= 30,
    texto: () => 'A Justiça Eleitoral pediu explicações sobre receitas e despesas da sua campanha.',
    ops: [
      { id: 'documentos', icon: '📑', name: 'Entregar toda a documentação', desc: 'Custa 1 de caixa. Resposta transparente.', cash: 1, p: 0.8, ok: { t: 'As contas foram aprovadas com ressalvas.', fx: {}, m: { risco: -18 } }, bad: { t: 'A documentação revelou falhas e a Justiça Eleitoral multou.', fx: { img: -1.5 }, m: { risco: -5, embalo: -4 } } },
      { id: 'advogados', icon: '🧑‍⚖️', name: 'Contratar advogados de peso', desc: 'Custa 2 de caixa. Contesta com força.', cash: 2, p: 0.6, ok: { t: 'A defesa sustentou a campanha.', fx: {}, m: { risco: -12 } }, bad: { t: 'A defesa perdeu e o dano foi grande.', fx: { img: -2.5 }, m: { risco: 5, embalo: -6 } } },
      { id: 'esperar', icon: '🙈', name: 'Deixar correr', desc: 'Sem custo. O processo anda sem você.', cash: 0, p: 0, ok: { t: '', fx: {}, m: {} }, bad: { t: 'O registro foi questionado e a campanha perdeu o fôlego.', fx: { img: -3 }, m: { embalo: -8, risco: 8 } }, heat: 5 },
    ] },
  { id: 'audio', icon: '🎧', nome: 'Áudio vazado de bastidor', prob: 0.35, when: () => true,
    texto: () => 'Um áudio seu em conversa de bastidor vazou e está circulando nos grupos.',
    ops: [
      { id: 'explicar', icon: '🗣️', name: 'Explicar o contexto', desc: 'Sem custo. Pode desarmar ou piorar.', cash: 0, p: 0.55, ok: { t: 'A explicação desarmou o caso.', fx: {}, m: { embalo: 2 } }, bad: { t: 'A explicação soou pior que o áudio.', fx: { img: -2 }, m: { embalo: -6 } } },
      { id: 'pedir', icon: '🙏', name: 'Pedir desculpas', desc: 'Sem custo. Segura o estrago.', cash: 0, p: 1, ok: { t: 'As desculpas seguraram o estrago.', fx: { img: -0.5 }, m: { embalo: -2 } } },
      { id: 'falso', icon: '🎭', name: 'Dizer que é montagem', desc: 'Sem custo. Se for desmentido, desmoraliza.', cash: 0, p: 0.4, ok: { t: 'A versão da montagem colou.', fx: {}, m: { embalo: 1 } }, bad: { t: 'Uma perícia mostrou que o áudio era verdadeiro.', fx: { img: -4 }, m: { embalo: -10, risco: 6 } } },
      { id: 'esperar', icon: '🙈', name: 'Ignorar', desc: 'Sem custo. O áudio segue circulando.', cash: 0, p: 0, ok: { t: '', fx: {}, m: {} }, bad: { t: 'O áudio se espalhou sem resposta.', fx: { img: -1.5 }, m: { embalo: -7 } } },
    ] },
  { id: 'apoio', icon: '⭐', nome: 'Celebridade oferece apoio', prob: 0.3, when: () => true,
    texto: () => 'Uma figura muito popular se ofereceu para gravar um vídeo de apoio.',
    ops: [
      { id: 'aceitar', icon: '🎬', name: 'Gravar o vídeo juntos', desc: 'Custa 1 de caixa. Rende embalo.', cash: 1, p: 0.75, ok: { t: 'O vídeo bombou nas redes.', fx: { pop: 0.4 }, m: { embalo: 8 } }, bad: { t: 'A celebridade se envolveu numa polêmica logo depois.', fx: { img: -1 }, m: { embalo: -2 } } },
      { id: 'recusar', icon: '🙅', name: 'Agradecer e recusar', desc: 'Sem custo. Não corre risco.', cash: 0, p: 1, ok: { t: 'Você manteve a campanha sem risco.', fx: {}, m: {} } },
      { id: 'esperar', icon: '🙈', name: 'Deixar sem resposta', desc: 'Sem custo. A chance passa.', cash: 0, p: 0, ok: { t: '', fx: {}, m: {} }, bad: { t: 'A celebridade apoiou outro candidato.', fx: {}, m: { embalo: -3 } } },
    ] },
  { id: 'carreata_acidente', icon: '🚨', nome: 'Incidente em ato de campanha', prob: 0.25, when: (m) => m.org < 45,
    texto: () => 'Um ato de campanha desorganizado terminou em tumulto e a imprensa registrou.',
    ops: [
      { id: 'apurar', icon: '🔍', name: 'Assumir e apurar', desc: 'Sem custo. Mostra responsabilidade.', cash: 0, p: 0.7, ok: { t: 'A transparência acalmou os ânimos.', fx: { img: 0.3 }, m: { org: 4 } }, bad: { t: 'A apuração rendeu mais manchetes ruins.', fx: { img: -1.5 }, m: { embalo: -4 } } },
      { id: 'culpar', icon: '👉', name: 'Culpar adversários', desc: 'Sem custo. Arriscado.', cash: 0, p: 0.4, ok: { t: 'A acusação colou.', fx: {}, m: { embalo: 2 } }, bad: { t: 'A acusação foi desmentida por imagens.', fx: { img: -3 }, m: { embalo: -6 } } },
      { id: 'esperar', icon: '🙈', name: 'Seguir a agenda', desc: 'Sem custo. O caso fica por conta da imprensa.', cash: 0, p: 0, ok: { t: '', fx: {}, m: {} }, bad: { t: 'O tumulto virou notícia do dia.', fx: { img: -1.2 }, m: { embalo: -5 } } },
    ] },
  { id: 'lider', icon: '🎙️', nome: 'Liderança local propõe aliança de última hora', prob: 0.3, when: () => true,
    texto: () => 'Uma liderança regional influente oferece apoio em troca de espaço no governo.',
    ops: [
      { id: 'fechar', icon: '🤝', name: 'Fechar o apoio', desc: 'Custa 1 de caixa. Dá votos e compromete cargos.', cash: 1, p: 0.85, ok: { t: 'O apoio ampliou a estrutura da campanha.', fx: { cong: 0.5 }, m: { org: 8, embalo: 3 } }, bad: { t: 'A aliança foi criticada como fisiológica.', fx: { img: -1.5 }, m: { org: 4, embalo: -2 } } },
      { id: 'recusar', icon: '🙅', name: 'Recusar a oferta', desc: 'Sem custo. Mantém o discurso limpo.', cash: 0, p: 1, ok: { t: 'Você manteve o discurso e a imagem limpa.', fx: { img: 0.5 }, m: { org: -2 } } },
      { id: 'esperar', icon: '🙈', name: 'Adiar a resposta', desc: 'Sem custo. A liderança escolhe outro.', cash: 0, p: 0, ok: { t: '', fx: {}, m: {} }, bad: { t: 'A liderança fechou com o rival.', fx: {}, m: { org: -4, embalo: -2 } } },
    ] },
]
export const CASO_CAMP_POR_ID = Object.fromEntries(CASOS_CAMP.map((c) => [c.id, c]))
export const PROB_CASO_DIA = 0.3
