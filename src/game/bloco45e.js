// BLOCO 45E: corrupção sistêmica. Esquemas, órgãos de controle, delações, operações em fases e blindagem política.
// Tudo fictício. Nenhum nome real de operação ou de pessoa.

export const MET_CR = {
  esquema: { icon: '🕳️', nome: 'Tamanho do esquema ligado ao seu governo', bom: false, ini: 15 },
  integr: { icon: '🛡️', nome: 'Força dos órgãos de controle', bom: true, ini: 50 },
  transp: { icon: '🔦', nome: 'Transparência pública', bom: true, ini: 45 },
  blind: { icon: '🧱', nome: 'Blindagem política', bom: true, ini: 45 },
}
export const PADRAO_CR = 'esperar'

// quem: 'exec', 'leg' ou 'todos'
export const ACOES_CR = [
  { id: 'transparencia', tipo: 'controle', icon: '🔦', nome: 'Portal da transparência e dados abertos', desc: 'Gastos e contratos à vista de todos.', cash: 2, m: { transp: 14, integr: 4 }, fx: { img: 0.4 }, cd: 3, quem: 'exec' },
  { id: 'controladoria', tipo: 'controle', icon: '🧾', nome: 'Fortalecer a controladoria e a auditoria', desc: 'Mais fiscais e autonomia. Reduz esquemas.', cash: 2, m: { integr: 12, esquema: -6 }, fx: {}, cd: 3, quem: 'exec' },
  { id: 'compliance', tipo: 'controle', icon: '📋', nome: 'Programa de integridade e compliance', desc: 'Regras para contratos e nomeações.', cash: 1, m: { esquema: -5, transp: 4 }, fx: { img: 0.2 }, cd: 3, quem: 'exec' },
  { id: 'autonomia', tipo: 'controle', icon: '🕵️', nome: 'Dar autonomia à polícia investigadora', desc: 'Investiga sem pedir licença. Pode atingir aliados.', cash: 1, m: { integr: 12, blind: -8 }, fx: { img: 0.6, cong: -0.6 }, cd: 4, quem: 'exec' },
  { id: 'fiscalizar', tipo: 'controle', icon: '🔍', nome: 'Fiscalizar o governo (requerimentos e audiências)', desc: 'Mandato de fiscalização, sem custo. Dá voz e pode irritar o governo.', cash: 0, m: { transp: 5, integr: 4 }, fx: { img: 0.4, cong: -0.3 }, cd: 3, quem: 'leg' },
  { id: 'emendas', tipo: 'esquema', icon: '📮', nome: 'Orçamento paralelo de emendas', desc: 'Emendas liberadas em troca de apoio. Compra Congresso e engorda o esquema.', cash: 0, m: { esquema: 14, blind: 8 }, fx: { cong: 3, pop: 0.2 }, cd: 4, dirty: true, heat: 3, quem: 'todos' },
  { id: 'cargos', tipo: 'esquema', icon: '🪑', nome: 'Loteamento de cargos em estatais', desc: 'Cargos a aliados. Controle de caixa e votos.', cash: 0, m: { esquema: 8, blind: 6 }, fx: { cong: 2.5, cash: 1 }, cd: 4, dirty: true, heat: 2, quem: 'exec' },
  { id: 'cartel', tipo: 'esquema', icon: '🏗️', nome: 'Fechar os olhos para o cartel de obras', desc: 'Empreiteiras agradecem em caixa. É o pior tipo de esquema.', cash: 0, m: { esquema: 16 }, fx: { cash: 3 }, cd: 5, dirty: true, heat: 5, quem: 'exec' },
  { id: 'rachadinha', tipo: 'esquema', icon: '💼', nome: 'Rachadinha no gabinete', desc: 'Parte do salário dos assessores volta para você.', cash: 0, m: { esquema: 12 }, fx: { cash: 2 }, cd: 5, dirty: true, heat: 4, quem: 'leg' },
]
export const ACAO_CR_POR_ID = Object.fromEntries(ACOES_CR.map((a) => [a.id, a]))

export const CASOS_CR = [
  { id: 'op_aliados', icon: '🚨', nome: 'Operação policial atinge aliados', quem: 'todos', prob: 0.12, when: (m) => m.integr >= 50 && m.esquema >= 25,
    texto: () => 'Uma operação policial cumpriu mandados contra pessoas do seu círculo político e a imprensa já pergunta pelo seu nome.',
    ops: [
      { id: 'apoiar', icon: '🤝', name: 'Apoiar a investigação', desc: 'Sem custo. Deixa investigar e perde aliados.', cash: 0, p: 1, ok: { t: 'Você apoiou a investigação e ganhou crédito junto à opinião pública.', fx: { img: 1.2, cong: -1.2 }, m: { integr: 4, esquema: -4 } } },
      { id: 'distanciar', icon: '✂️', name: 'Demitir e se distanciar', desc: 'Sem custo. Corta laços para proteger a si.', cash: 0, p: 0.75, ok: { t: 'O distanciamento isolou o caso.', fx: { img: 0.3, cong: -0.8 }, m: { esquema: -3 } }, bad: { t: 'O corte soou como tentativa de fuga.', fx: { img: -1.5, cong: -1 } } },
      { id: 'blindar', icon: '🧱', name: 'Acionar a blindagem política', desc: 'Sem custo. Usa a base para frear. Se vazar, é pior.', cash: 0, p: 0.5, ok: { t: 'A blindagem segurou o avanço da investigação.', fx: { cong: 0.5 }, m: { blind: -6, integr: -4 }, sujo: true }, bad: { t: 'A tentativa de frear a investigação virou escândalo.', fx: { img: -4, cong: -1 }, m: { blind: -10 }, sujo: true }, heat: 6 },
      { id: 'esperar', icon: '🙈', name: 'Esperar para ver', desc: 'Sem custo. A imprensa preenche o vazio.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O silêncio foi lido como cumplicidade.', fx: { img: -1.8, pop: -0.4 } } },
    ] },
  { id: 'delacao', icon: '📣', nome: 'Delação premiada cita seu nome', quem: 'todos', prob: 0.12, when: (m) => m.esquema >= 40,
    texto: () => 'Um delator afirma ter repassado valores a uma pessoa próxima de você. Os trechos vazaram.',
    ops: [
      { id: 'negar', icon: '🙅', name: 'Negar tudo', desc: 'Sem custo. Se houver prova, desmorona.', cash: 0, p: 0.5, ok: { t: 'A negativa colou e o caso esfriou.', fx: {}, m: { esquema: -2 } }, bad: { t: 'Apareceram provas e a negativa desmoronou.', fx: { img: -4, pop: -1 }, m: { esquema: 4 } }, heat: 5 },
      { id: 'defesa', icon: '🧑‍⚖️', name: 'Contratar defesa pesada', desc: 'Custa 2 de caixa. Contesta o delator com argumentos.', cash: 2, p: 0.68, ok: { t: 'A defesa desmontou parte da delação.', fx: { img: 0.3 }, m: { esquema: -4 } }, bad: { t: 'A defesa não bastou e a delação seguiu.', fx: { img: -2 } } },
      { id: 'atacar', icon: '🗡️', name: 'Atacar o delator', desc: 'Sem custo. Pode virar o jogo ou piorar.', cash: 0, p: 0.4, ok: { t: 'O ataque tirou a credibilidade do delator.', fx: { pop: 0.4 }, sujo: true }, bad: { t: 'O ataque pareceu intimidação.', fx: { img: -3.5, pop: -0.6 }, m: { integr: 2 }, sujo: true }, heat: 4 },
      { id: 'esperar', icon: '🙈', name: 'Esperar a Justiça', desc: 'Sem custo. A delação circula.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A delação circulou sem resposta.', fx: { img: -2.2, pop: -0.5 }, m: { esquema: 3 } } },
    ] },
  { id: 'tentacao', icon: '🎁', nome: 'Empreiteira oferece "ajuda"', quem: 'todos', prob: 0.14, when: (m) => m.esquema < 70,
    texto: () => 'Um empresário próximo oferece "ajuda" de campanha e contratos futuros, sem papel passado.',
    ops: [
      { id: 'recusar', icon: '🙅', name: 'Recusar', desc: 'Sem custo. Mantém a ficha limpa.', cash: 0, p: 1, ok: { t: 'Você recusou e a conversa morreu ali.', fx: { img: 0.5 } } },
      { id: 'aceitar', icon: '💰', name: 'Aceitar o acerto', desc: 'Sem custo. Dinheiro agora, conta depois.', cash: 0, p: 1, ok: { t: 'O acerto entrou no caixa sem fazer barulho.', fx: { cash: 3, cong: 0.3 }, m: { esquema: 14 }, sujo: true } },
      { id: 'denunciar', icon: '📞', name: 'Denunciar à polícia', desc: 'Sem custo. Vira herói ou alvo de um poderoso.', cash: 0, p: 0.65, ok: { t: 'A denúncia rendeu aplausos e uma investigação.', fx: { img: 2, pop: 0.6 }, m: { integr: 4 } }, bad: { t: 'O empresário contra-atacou nos bastidores.', fx: { img: -1, cong: -0.8 } } },
      { id: 'esperar', icon: '🙈', name: 'Enrolar', desc: 'Sem custo. A oportunidade passa.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'Você enrolou e a oferta foi para outro grupo.', fx: {} } },
    ] },
  { id: 'cgu', icon: '📑', nome: 'Controladoria aponta irregularidades', quem: 'exec', prob: 0.12, when: (m) => m.transp < 45,
    texto: () => 'Um relatório da controladoria aponta contratos sem justificativa e pagamentos fora do prazo.',
    ops: [
      { id: 'corrigir', icon: '🛠️', name: 'Corrigir e publicar', desc: 'Custa 1 de caixa. Responde com transparência.', cash: 1, p: 0.8, ok: { t: 'A correção foi publicada e o caso esfriou.', fx: { img: 0.8 }, m: { transp: 8, esquema: -4 } }, bad: { t: 'A correção apontou novos problemas.', fx: { img: -1 }, m: { transp: 3 } } },
      { id: 'contestar', icon: '⚔️', name: 'Contestar o relatório', desc: 'Sem custo. Briga com o órgão de controle.', cash: 0, p: 0.45, ok: { t: 'A contestação derrubou o relatório.', fx: {}, m: { integr: -4 } }, bad: { t: 'A contestação foi vista como ataque ao controle.', fx: { img: -2.5 }, m: { integr: -3 } } },
      { id: 'esperar', icon: '🙈', name: 'Arquivar sem resposta', desc: 'Sem custo. O relatório vaza.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O relatório vazou e ninguém explicou.', fx: { img: -2 }, m: { transp: -4 } } },
    ] },
  { id: 'lei_abuso', icon: '📜', nome: 'Congresso aprova lei que enfraquece investigações', quem: 'exec', prob: 0.08, when: (m) => m.integr >= 40,
    texto: () => 'O Legislativo aprovou um projeto que limita investigações e dificulta prisões. Chega à sua mesa.',
    ops: [
      { id: 'vetar', icon: '🛑', name: 'Vetar', desc: 'Sem custo. Agrada a opinião pública e irrita o Congresso.', cash: 0, p: 0.75, ok: { t: 'O veto foi mantido.', fx: { img: 1.5, cong: -2 }, m: { integr: 4 } }, bad: { t: 'O Congresso derrubou o veto.', fx: { img: 0.3, cong: -1 }, m: { integr: -8, blind: 4 } } },
      { id: 'sancionar', icon: '✍️', name: 'Sancionar', desc: 'Sem custo. Agrada o Congresso e pesa na imagem.', cash: 0, p: 1, ok: { t: 'A lei foi sancionada e a oposição reagiu.', fx: { img: -2, cong: 1.8 }, m: { integr: -12, blind: 8 } } },
      { id: 'esperar', icon: '🙈', name: 'Deixar o prazo correr', desc: 'Sem custo. A lei sai sozinha.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A lei entrou em vigor sem a sua assinatura.', fx: { img: -1.2, cong: 0.5 }, m: { integr: -8, blind: 4 } } },
    ] },
  { id: 'rachadinha_cs', icon: '💼', nome: 'Denúncia de rachadinha no gabinete', quem: 'leg', prob: 0.13, when: (m) => m.esquema >= 30,
    texto: () => 'Um ex-assessor diz que parte do salário era devolvida ao gabinete. A imprensa pediu esclarecimentos.',
    ops: [
      { id: 'devolver', icon: '💸', name: 'Devolver o dinheiro e se explicar', desc: 'Custa 1 de caixa. Assume o erro.', cash: 1, p: 0.75, ok: { t: 'A devolução encerrou o assunto.', fx: { img: -0.5 }, m: { esquema: -10 } }, bad: { t: 'A devolução soou como confissão.', fx: { img: -2 }, m: { esquema: -6 } } },
      { id: 'negar', icon: '🙅', name: 'Negar e processar o ex-assessor', desc: 'Sem custo. Se houver prova, desmorona.', cash: 0, p: 0.45, ok: { t: 'A negativa colou.', fx: {}, m: { esquema: -2 } }, bad: { t: 'Surgiram provas e o caso explodiu.', fx: { img: -4.5, pop: -1 }, m: { esquema: 4 } }, heat: 5 },
      { id: 'esperar', icon: '🙈', name: 'Esperar', desc: 'Sem custo. A imprensa não larga.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A denúncia seguiu sem resposta.', fx: { img: -2 }, m: { esquema: 2 } } },
    ] },
]
export const CASO_CR_POR_ID = Object.fromEntries(CASOS_CR.map((c) => [c.id, c]))

// ---- operação em fases ----
export const OP_FASES = [
  { n: 1, nome: 'Buscas e apreensões', texto: 'Mandados foram cumpridos e documentos foram levados.' },
  { n: 2, nome: 'Delações e vazamentos', texto: 'Delatores falam e o noticiário não para.' },
  { n: 3, nome: 'Denúncia à Justiça', texto: 'O Ministério Público apresenta a denúncia e o processo começa.' },
]
export const OP_FASE_RODADAS = 2
export const OP_RESP = [
  { id: 'defesa', icon: '🧑‍⚖️', nome: 'Reforçar a defesa', desc: 'Custa 3 de caixa. Enfraquece a operação em 10.', cash: 3, forca: -10 },
  { id: 'colaborar', icon: '🤝', nome: 'Colaborar com as investigações', desc: 'Uma vez por operação. Perde aliados e reduz a pena.', cash: 0, forca: -14, fx: { cong: -1.5, img: 0.5 }, uma: true },
  { id: 'narrativa', icon: '📢', nome: 'Contar a sua versão ao público', desc: 'Com popularidade em alta, funciona melhor. Enfraquece em 3 a 8.', cash: 0, forca: 'narrativa' },
  { id: 'blindar', icon: '🧱', nome: 'Acionar a blindagem política', desc: 'Depende da blindagem. Se falhar, vira escândalo.', cash: 0, forca: 'blindar', sujo: true },
  { id: 'acordo', icon: '📝', nome: 'Acordo de não persecução', desc: 'Custa 2 de caixa. Enfraquece em 12, mas tem custo de imagem.', cash: 2, forca: -12, fx: { img: -1.2 } },
]
export const OP_CD_RODADAS = 20
