// BLOCO 37: obras vivas. Escolas, hospitais, estradas, trens e universidades levam rodadas para ficar prontas,
// podem dar problema no caminho e, depois de prontas, rendem um pouco a cada rodada.
// Texto 100% fictício. custo = pontos de caixa. prazo = rodadas. pass = efeito por rodada depois de pronta.
// tema liga a obra aos temas das leis (para casar com a dor do estado). leg: legislador consegue via emenda.

export const OBRAS = [
  // municipais
  { id: 'escola_mun', sphere: 'mun', icon: '🏫', nome: 'Nova escola municipal', tipo: 'educação', tema: 'educacao', custo: 7, prazo: 3, pass: { soc: 0.25, pop: 0.1 }, fim: { pop: 3, img: 1 }, edu: 4, leg: true },
  { id: 'ubs', sphere: 'mun', icon: '🩺', nome: 'Posto de saúde', tipo: 'saúde', tema: 'saude', custo: 6, prazo: 3, pass: { soc: 0.3 }, fim: { pop: 3 }, leg: true },
  { id: 'brt', sphere: 'mun', icon: '🚌', nome: 'Corredor de ônibus', tipo: 'mobilidade', tema: 'habitacao', custo: 10, prazo: 5, pass: { eco: 0.25, pop: 0.2 }, fim: { pop: 4, eco: 1 } },
  { id: 'saneamento', sphere: 'mun', icon: '🚰', nome: 'Rede de água e esgoto', tipo: 'saneamento', tema: 'saude', custo: 9, prazo: 5, pass: { soc: 0.3, img: 0.1 }, fim: { soc: 2, img: 1 } },
  { id: 'praca', sphere: 'mun', icon: '🌳', nome: 'Praça e ciclovia', tipo: 'lazer', tema: 'cultura', custo: 4, prazo: 2, pass: { pop: 0.2 }, fim: { pop: 2, img: 1 }, leg: true },
  { id: 'creche_obra', sphere: 'mun', icon: '🧸', nome: 'Creche em tempo integral', tipo: 'educação', tema: 'educacao', custo: 6, prazo: 3, pass: { soc: 0.2, pop: 0.15 }, fim: { pop: 3 }, edu: 3, leg: true },
  // estaduais
  { id: 'escola_tec', sphere: 'est', icon: '🏭', nome: 'Escola técnica', tipo: 'educação', tema: 'educacao', custo: 8, prazo: 4, pass: { eco: 0.25, soc: 0.15 }, fim: { pop: 2, eco: 1 }, edu: 4, leg: true },
  { id: 'hosp_reg', sphere: 'est', icon: '🏥', nome: 'Hospital regional', tipo: 'saúde', tema: 'saude', custo: 11, prazo: 5, pass: { soc: 0.4 }, fim: { pop: 4, soc: 1 } },
  { id: 'estrada', sphere: 'est', icon: '🛣️', nome: 'Duplicação de estrada', tipo: 'logística', tema: 'economia', custo: 12, prazo: 6, pass: { eco: 0.45 }, fim: { eco: 2, pop: 2 } },
  { id: 'campus', sphere: 'est', icon: '🎓', nome: 'Campus de universidade', tipo: 'ciência', tema: 'ciencia', custo: 12, prazo: 6, pass: { eco: 0.3, img: 0.2 }, fim: { img: 2, pop: 1 }, edu: 5, cien: 1 },
  { id: 'trem_reg', sphere: 'est', icon: '🚆', nome: 'Trem regional', tipo: 'mobilidade', tema: 'habitacao', custo: 15, prazo: 8, pass: { eco: 0.4, pop: 0.2 }, fim: { pop: 4, eco: 2 } },
  { id: 'batalhao', sphere: 'est', icon: '🛡️', nome: 'Batalhão e delegacia integrada', tipo: 'segurança', tema: 'seguranca', custo: 8, prazo: 4, pass: { seg: 0.4 }, fim: { seg: 2, pop: 1 }, leg: true },
  // federais
  { id: 'uni_fed', sphere: 'fed', icon: '🎓', nome: 'Universidade federal', tipo: 'ciência', tema: 'ciencia', custo: 14, prazo: 7, pass: { eco: 0.4, img: 0.2 }, fim: { img: 3, pop: 1 }, edu: 6, cien: 1 },
  { id: 'ferrovia', sphere: 'fed', icon: '🚂', nome: 'Ferrovia de carga', tipo: 'logística', tema: 'economia', custo: 18, prazo: 9, pass: { eco: 0.6 }, fim: { eco: 3, img: 1 } },
  { id: 'rodovia', sphere: 'fed', icon: '🛣️', nome: 'Rodovia federal', tipo: 'logística', tema: 'economia', custo: 14, prazo: 7, pass: { eco: 0.45 }, fim: { eco: 2, pop: 2 } },
  { id: 'hidro', sphere: 'fed', icon: '⚡', nome: 'Usina de energia', tipo: 'energia', tema: 'economia', custo: 16, prazo: 8, pass: { eco: 0.5, cash: 0.2 }, fim: { eco: 3 } },
  { id: 'internet', sphere: 'fed', icon: '📡', nome: 'Internet nas escolas e vilas', tipo: 'ciência', tema: 'ciencia', custo: 9, prazo: 5, pass: { soc: 0.2, eco: 0.2 }, fim: { pop: 3, img: 1 }, edu: 3 },
  { id: 'porto', sphere: 'fed', icon: '🚢', nome: 'Modernização de porto', tipo: 'logística', tema: 'economia', custo: 14, prazo: 7, pass: { eco: 0.5, cash: 0.2 }, fim: { eco: 3 } },
  { id: 'hosp_univ', sphere: 'fed', icon: '🏥', nome: 'Hospital universitário', tipo: 'saúde', tema: 'saude', custo: 12, prazo: 6, pass: { soc: 0.4, img: 0.1 }, fim: { soc: 2, pop: 2 }, edu: 2 },
]

export const OBRA_POR_ID = Object.fromEntries(OBRAS.map((o) => [o.id, o]))

// o cenário encarece/barateia ou valoriza certos tipos de obra
export const OBRA_CEN = {
  fiscal: { custo: 1.2 },
  boom: { custo: 0.9 },
  seca: { tipo: ['saneamento'], mult: 1.3 },
  saude: { tipo: ['saúde'], mult: 1.25 },
  violencia: { tipo: ['segurança'], mult: 1.25 },
  jovem: { tipo: ['educação', 'ciência'], mult: 1.2 },
  commodities: { tipo: ['logística', 'energia'], mult: 1.25 },
}

// problemas no caminho: cada um vira uma decisão com prazo
export const OBRA_PROBLEMAS = {
  atraso: { icon: '🌧️', titulo: (n) => `${n}: obra atrasada`, texto: (n) => `Chuvas e licença travada: a obra de ${n} vai atrasar se nada for feito.`, padrao: 'esperar',
    ops: [{ id: 'acelerar', name: 'Acelerar com mais gente', icon: '👷', desc: 'Custa caixa, mantém o prazo.', fx: { cash: -2 } }, { id: 'esperar', name: 'Aceitar o atraso', icon: '⏳', desc: 'Mais duas rodadas e uma crítica.', fx: { img: -0.5 }, atraso: 2 }] },
  estouro: { icon: '🧾', titulo: (n) => `${n}: custo estourou`, texto: (n) => `A empreiteira pediu aditivo e a obra de ${n} saiu mais cara do que o previsto.`, padrao: 'enxugar',
    ops: [{ id: 'pagar', name: 'Pagar o aditivo', icon: '💵', desc: 'Obra completa, caixa menor.', fx: { cash: -3 } }, { id: 'enxugar', name: 'Enxugar o projeto', icon: '✂️', desc: 'A obra rende menos depois de pronta.', fx: {}, enxuta: true }] },
  auditoria: { icon: '🔍', titulo: (n) => `${n}: auditoria no contrato`, texto: (n) => `O tribunal de contas quer ver os papéis da obra de ${n}.`, padrao: 'abrir',
    ops: [{ id: 'abrir', name: 'Abrir tudo e colaborar', icon: '📂', desc: 'Segura a imagem, atrasa um pouco.', fx: { img: 1 }, atraso: 1 }, { id: 'barrar', name: 'Resistir e recorrer', icon: '🛑', desc: 'Mantém o prazo e arrisca a imagem.', fx: { img: -2, cong: -1 } }] },
  moradores: { icon: '🏘️', titulo: (n) => `${n}: moradores protestam`, texto: (n) => `Famílias afetadas pela obra de ${n} reclamam de desapropriação e barulho.`, padrao: 'ouvir',
    ops: [{ id: 'ouvir', name: 'Indenizar e ouvir', icon: '🤝', desc: 'Resolve e custa.', fx: { cash: -2, pop: 1 } }, { id: 'manter', name: 'Manter o plano', icon: '🏗️', desc: 'A obra segue, a rua reclama.', fx: { pop: -2 } }] },
}
