// BLOCO 25: vida das figuras políticas (aposentadorias, mortes, casamentos).
export const FIGURAS = [
  { id: 'mentor', icon: '🧓', label: 'Seu mentor, senador veterano', idade: [68, 78], pass: { cong: 0.15 } },
  { id: 'rival', icon: '🥊', label: 'Seu principal rival', idade: [48, 62] },
  { id: 'lider', icon: '🎙️', label: 'Presidente do partido', idade: [58, 70], pass: { cong: 0.1 } },
  { id: 'aliado', icon: '🤝', label: 'Governador aliado', idade: [50, 64], pass: { pop: 0.05, cong: 0.1 } },
  { id: 'ministro', icon: '👨‍⚖️', label: 'Ministro do Supremo', idade: [60, 72] },
  { id: 'colunista', icon: '🖋️', label: 'Colunista político', idade: [52, 66] },
]

// Cada evento tem opções. cash/fx por opção; "rival" muda o texto e o efeito.
export const EVENTOS = {
  aposentadoria: {
    icon: '🎓', titulo: (f) => `${f.nome} anuncia a aposentadoria`,
    texto: (f) => `${f.nome} (${f.label.toLowerCase()}) deixa a vida pública depois de décadas.`,
    ops: [
      { id: 'homenagem', icon: '🏅', name: 'Prestar homenagem', desc: 'Sessão solene e discurso. Custa 1 de Caixa.', cash: 1, fx: { img: 1.5, pop: 0.5 }, fxRival: { img: 0.5 } },
      { id: 'vaga', icon: '🪑', name: 'Aproveitar a vaga', desc: 'Negocia a herança política da saída.', fx: { cong: 2, img: -0.8 }, fxRival: { cong: 2.5, pop: 1 } },
      { id: 'silencio', icon: '🤐', name: 'Não se manifestar', desc: 'Deixa passar.', fx: {} },
    ],
  },
  morte: {
    icon: '🕯️', titulo: (f) => `Morre ${f.nome}`,
    texto: (f) => `${f.nome} (${f.label.toLowerCase()}) morreu aos ${f.idade} anos.`,
    ops: [
      { id: 'velorio', icon: '⚰️', name: 'Ir ao velório', desc: 'Presença pessoal e fotos sóbrias.', fx: { pop: 1, img: 1 }, fxRival: { img: 0.8 } },
      { id: 'luto', icon: '🏴', name: 'Decretar luto oficial', desc: 'Três dias de luto. Custa 1 de Caixa.', cash: 1, fx: { pop: 1.5, img: 1.2 }, fxRival: { img: 0.8 } },
      { id: 'nota', icon: '📝', name: 'Mandar nota de pêsames', desc: 'Discreto e barato.', fx: { img: 0.3 } },
    ],
  },
  casamento: {
    icon: '💍', titulo: (f) => `${f.nome} vai se casar`,
    texto: (f) => `${f.nome} (${f.label.toLowerCase()}) convida você para a cerimônia.`,
    ops: [
      { id: 'festa', icon: '🥂', name: 'Comparecer à festa', desc: 'Aproveita para conversar com a base.', fx: { cong: 1.5, img: 0.5 }, fxRival: { img: 1, cong: 0.5 } },
      { id: 'presente', icon: '🎁', name: 'Mandar um presente', desc: 'Gesto simples.', fx: { img: 0.2 } },
      { id: 'ausente', icon: '🚪', name: 'Não ir', desc: 'Pega mal com quem convidou.', fx: { cong: -1 }, fxRival: {} },
    ],
  },
}
