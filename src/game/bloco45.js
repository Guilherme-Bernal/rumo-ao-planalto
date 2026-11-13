// BLOCO 45: justiça e instituições. Processo gradual de impeachment/cassação (ou Conselho de Ética),
// casos de tribunais (contas, Ministério Público, Corte, convocação, vaga no tribunal) e relação com o Judiciário.
// Tudo fictício e com custo político real.

export const CASOS = [
  { id: 'contas', icon: '🧾', quem: ['exec'], nome: 'Tribunal de Contas reprova parte das contas', texto: (e) => `O Tribunal de Contas aponta falhas nas contas de ${e.gov} e pede explicações em poucos dias.`,
    ops: [
      { id: 'defesa', icon: '📑', name: 'Defesa técnica', desc: 'Contratar defesa e apresentar documentos. Custa 1 de caixa.', cash: 1, p: 0.65, ok: { t: 'As contas foram aprovadas com ressalvas.', fx: { img: 0.5 } }, bad: { t: 'A defesa não convenceu e veio multa.', fx: { img: -2, cash: -1 } }, heat: -3, heatBad: 4 },
      { id: 'ressalvas', icon: '✍️', name: 'Aceitar as ressalvas', desc: 'Admite as falhas e promete corrigir.', cash: 0, p: 1, ok: { t: 'Você admitiu as falhas e o assunto esfriou.', fx: { img: -0.8 } }, heat: -4 },
      { id: 'pressionar', icon: '🕴️', name: 'Pressionar os conselheiros', desc: 'Jogo sujo nos bastidores. Se vazar, é desastre.', cash: 0, p: 0.45, ok: { t: 'Os conselheiros amoleceram.', fx: { img: 0.3 } }, bad: { t: 'A pressão vazou e virou escândalo.', fx: { img: -4, cong: -1 } }, heat: -2, heatBad: 8, sujo: true },
      { id: 'esperar', icon: '🙈', name: 'Esperar passar', desc: 'Sem custo. O prazo vence e o parecer sai contra.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O prazo venceu e o parecer saiu contra.', fx: { img: -1.5 } }, heat: 3, heatBad: 3 },
    ] },
  { id: 'mp', icon: '🏛️', quem: ['exec', 'leg'], nome: 'Ministério Público abre ação', texto: (e) => `O Ministério Público abriu uma ação sobre um contrato ligado a ${e.gov}. A imprensa já ligou.`,
    ops: [
      { id: 'acordo', icon: '🤝', name: 'Fazer acordo', desc: 'Termo de ajuste de conduta. Custa 2 de caixa.', cash: 2, p: 1, ok: { t: 'O acordo encerrou a ação com um custo contido.', fx: { img: -0.3 } }, heat: -4 },
      { id: 'contestar', icon: '⚔️', name: 'Contestar na Justiça', desc: 'Encara a ação. Arriscado.', cash: 0, p: 0.5, ok: { t: 'A ação foi arquivada.', fx: { img: 1 } }, bad: { t: 'A Justiça deu razão ao Ministério Público.', fx: { img: -3 } }, heat: -3, heatBad: 6 },
      { id: 'trocar', icon: '✂️', name: 'Trocar o responsável', desc: 'Demite quem assinou o contrato.', cash: 0, p: 1, ok: { t: 'A troca mostrou resposta e esfriou o caso.', fx: { img: -0.6, cong: -0.3 } }, heat: -3 },
      { id: 'esperar', icon: '🙈', name: 'Esperar passar', desc: 'Sem custo. O caso se arrasta.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O caso se arrastou e ganhou manchetes.', fx: { img: -1.2 } }, heat: 3, heatBad: 3 },
    ] },
  { id: 'corte', icon: '⚖️', quem: ['exec', 'leg'], nome: 'Corte decide sobre medida polêmica', texto: (e) => `O ${e.corte} marcou o julgamento de uma medida polêmica de ${e.gov}. O resultado pode sobrar para você.`,
    ops: [
      { id: 'acatar', icon: '🏳️', name: 'Acatar de antemão', desc: 'Declara que vai respeitar a decisão. Agrada o tribunal.', cash: 0, p: 1, ok: { t: 'Você disse que respeitaria a decisão e o tribunal reconheceu.', fx: { img: -0.3 } }, jud: 5 },
      { id: 'recorrer', icon: '📜', name: 'Recorrer com advogados', desc: 'Custa 2 de caixa. Defesa forte, chance média.', cash: 2, p: 0.5, ok: { t: 'A defesa convenceu e a medida foi mantida.', fx: { img: 1 } }, bad: { t: 'A defesa foi derrotada.', fx: { img: -1.5 } }, jud: -1 },
      { id: 'criticar', icon: '🗣️', name: 'Criticar o tribunal em público', desc: 'Agrada a base, mas queima ponte com o Judiciário.', cash: 0, p: 0.6, ok: { t: 'A base gostou de ver você peitar o tribunal.', fx: { pop: 1, img: -0.5 } }, bad: { t: 'A crítica foi lida como ataque às instituições.', fx: { img: -2, pop: -0.5 } }, jud: -6 },
      { id: 'esperar', icon: '🙈', name: 'Esperar o julgamento', desc: 'Sem custo. O tribunal decide sozinho.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O tribunal decidiu sem ouvir o seu lado.', fx: { img: -1 } }, jud: 0 },
    ] },
  { id: 'convoca', icon: '📞', quem: ['exec'], nome: 'O Legislativo convoca você', texto: (e) => `${e.casa} convocou ${e.gov} para dar explicações sobre um caso polêmico.`,
    ops: [
      { id: 'comparecer', icon: '🧑‍💼', name: 'Comparecer e explicar', desc: 'Vai pessoalmente. Pode sair bem ou mal.', cash: 0, p: 0.62, ok: { t: 'A explicação foi sólida e desarmou a oposição.', fx: { img: 0.8, cong: 0.5 } }, bad: { t: 'Você se enrolou nas respostas.', fx: { img: -1.5 } } },
      { id: 'secretario', icon: '📋', name: 'Mandar um secretário', desc: 'Envia um auxiliar. Seguro, mas parece fuga.', cash: 0, p: 1, ok: { t: 'O secretário segurou a sessão sem grandes danos.', fx: { img: -0.6 } } },
      { id: 'esperar', icon: '🙈', name: 'Ignorar a convocação', desc: 'Sem custo. A oposição aproveita.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A ausência foi tratada como desrespeito.', fx: { cong: -1.5, img: -1 } } },
    ] },
  { id: 'vaga', icon: '🪑', quem: ['vaga'], nome: 'Abre uma vaga no tribunal', texto: (e) => `Abriu uma vaga no ${e.corte}. A escolha do nome vai ser lida como um recado.`,
    ops: [
      { id: 'tecnico', icon: '🧑‍🏫', name: 'Indicar um técnico', desc: 'Nome discreto, respeitado pelos pares.', cash: 0, p: 1, ok: { t: 'A indicação técnica foi bem recebida.', fx: { img: 0.5 } }, jud: 6 },
      { id: 'aliado', icon: '🤝', name: 'Indicar um aliado', desc: 'Garante um voto amigo e custa imagem.', cash: 0, p: 1, ok: { t: 'A indicação de um aliado agradou à base e irritou a crítica.', fx: { cong: 1.5, img: -1 } }, jud: -5 },
      { id: 'jurista', icon: '📚', name: 'Indicar jurista de notório saber', desc: 'Nome de prestígio, difícil de contestar.', cash: 0, p: 1, ok: { t: 'O jurista de prestígio foi aplaudido.', fx: { img: 1, cong: -0.5 } }, jud: 4 },
      { id: 'esperar', icon: '🙈', name: 'Deixar a vaga aberta', desc: 'Sem custo. O tribunal fica desfalcado.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A vaga ficou aberta e a Corte se ressentiu.', fx: { img: -0.3 } }, jud: -2 },
    ] },
]
export const CASO_POR_ID = Object.fromEntries(CASOS.map((c) => [c.id, c]))
export const PADRAO_CASO = 'esperar'

// ---- processo de impeachment (exec) ou Conselho de Ética (legislador) ----
export const FASES = [
  { n: 1, nome: 'Pedido aceito', texto: 'O pedido foi aceito e a notícia domina o dia.' },
  { n: 2, nome: 'Comissão', texto: 'A comissão ouve testemunhas e fecha o parecer.' },
  { n: 3, nome: 'Votação em plenário', texto: 'O plenário vota o seu destino.' },
]
export const FASE_RODADAS = 2
export const PROC_ACOES = [
  { id: 'negociar', icon: '🤝', nome: 'Negociar com a base', desc: 'Conversa com líderes. Custa 2 de caixa. +10 votos.', cash: 2, votos: 10 },
  { id: 'cargos', icon: '🎁', nome: 'Oferecer cargos e emendas', desc: 'Compra apoio com cargos. +14 votos, imagem -1.', cash: 0, votos: 14, fx: { img: -1 }, exec: true },
  { id: 'colegas', icon: '🧑‍🤝‍🧑', nome: 'Buscar apoio dos colegas', desc: 'Conversa de corredor. +8 votos, custa 1 de caixa.', cash: 1, votos: 8, leg: true },
  { id: 'rua', icon: '📣', nome: 'Mobilizar a rua', desc: 'Com popularidade, rende. Sem ela, o ato esvazia. +4 a +10 votos.', cash: 0, votos: 'rua' },
  { id: 'defesa', icon: '🧑‍⚖️', nome: 'Reforçar a defesa jurídica', desc: 'Custa 3 de caixa. +6 votos e firma a tese.', cash: 3, votos: 6 },
]
export const PROC_NOME = {
  presidente: { nome: 'Impeachment', casa: 'o Congresso', corpo: 'Câmara e Senado' },
  governador: { nome: 'Impeachment', casa: 'a Assembleia Legislativa', corpo: 'a Assembleia' },
  prefeito: { nome: 'Cassação', casa: 'a Câmara de Vereadores', corpo: 'a Câmara' },
  leg: { nome: 'Conselho de Ética', casa: 'o Conselho de Ética', corpo: 'o Conselho' },
}
