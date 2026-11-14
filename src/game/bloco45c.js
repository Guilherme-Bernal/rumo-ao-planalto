// BLOCO 45C: saúde e educação como sistema de gestão (rede, estoque, evasão, alfabetização) com casos e crises.

export const PADRAO_GC = 'esperar'
export const MET_SV = {
  aten: { icon: '🏥', nome: 'Atenção básica e postos', bom: true, ini: 45 },
  hosp: { icon: '🛏️', nome: 'Hospitais e leitos', bom: true, ini: 45 },
  estoq: { icon: '💊', nome: 'Remédios e vacinas', bom: true, ini: 50 },
  evas: { icon: '🚪', nome: 'Evasão escolar', bom: false, ini: 35 },
  alfa: { icon: '🔤', nome: 'Alfabetização', bom: true, ini: 50 },
  infra: { icon: '🏫', nome: 'Estrutura das escolas', bom: true, ini: 45 },
}
export const SAUDE_MET = ['aten', 'hosp', 'estoq']
export const EDU_MET = ['evas', 'alfa', 'infra']

export const ACOES_SV = [
  { id: 'ubs', area: 'saude', icon: '🏥', nome: 'Postos e atenção básica', desc: 'Mais postos e equipes de saúde da família.', cash: 2, m: { aten: 12 }, fx: { pop: 0.3 }, cd: 3 },
  { id: 'hospital', area: 'saude', icon: '🛏️', nome: 'Hospitais e leitos de UTI', desc: 'Obra e equipamento. Caro e demorado.', cash: 3, m: { hosp: 14 }, fx: { img: 0.3 }, cd: 3 },
  { id: 'remedios', area: 'saude', icon: '💊', nome: 'Farmácia popular e estoque estratégico', desc: 'Garante remédio e insumo no posto.', cash: 2, m: { estoq: 14 }, fx: { pop: 0.3 }, cd: 3 },
  { id: 'mutirao', area: 'saude', icon: '🩺', nome: 'Mutirão de cirurgias e exames', desc: 'Zera parte da fila e rende voto na hora.', cash: 2, m: { aten: 4, hosp: 6 }, fx: { pop: 0.9, soc: 0.4 }, cd: 4 },
  { id: 'vacina', area: 'saude', icon: '💉', nome: 'Campanha de vacinação', desc: 'Barata e protege contra surtos.', cash: 1, m: { estoq: 6, aten: 6 }, fx: { soc: 0.3 }, cd: 4 },
  { id: 'medicos', area: 'saude', icon: '🧑‍⚕️', nome: 'Contratar e interiorizar médicos', desc: 'Leva profissionais a lugares que nunca tiveram. Irrita parte das entidades.', cash: 2, m: { aten: 8, hosp: 4 }, fx: { cong: -0.3, pop: 0.3 }, cd: 4, esf: ['est', 'fed'] },
  { id: 'escolas', area: 'edu', icon: '🏫', nome: 'Reformar e construir escolas', desc: 'Prédios, quadras, bibliotecas.', cash: 3, m: { infra: 14 }, fx: { img: 0.3 }, cd: 3 },
  { id: 'alfab', area: 'edu', icon: '🔤', nome: 'Alfabetização na idade certa', desc: 'Programa de metas até o fim do ciclo.', cash: 2, m: { alfa: 12 }, fx: { soc: 0.3 }, cd: 3 },
  { id: 'busca', area: 'edu', icon: '🔎', nome: 'Busca ativa contra a evasão', desc: 'Vai atrás de cada aluno que sumiu.', cash: 1, m: { evas: -12 }, fx: { soc: 0.3 }, cd: 3 },
  { id: 'integral', area: 'edu', icon: '🕒', nome: 'Escola em tempo integral', desc: 'Mais horas e merenda reforçada. Custa caro.', cash: 3, m: { alfa: 6, evas: -6 }, fx: { pop: 0.5 }, cd: 4 },
  { id: 'conecta', area: 'edu', icon: '📶', nome: 'Conectividade e equipamentos', desc: 'Internet e computadores nas escolas.', cash: 2, m: { infra: 8, alfa: 4 }, fx: { eco: 0.2 }, cd: 3, esf: ['mun', 'est', 'fed'] },
]
export const ACAO_SV_POR_ID = Object.fromEntries(ACOES_SV.map((a) => [a.id, a]))
export const EMENDAS_SV = {
  saude: { cash: 1, fx: { soc: 0.4, pop: 0.3 }, cd: 4, nome: 'Emenda para a saúde' },
  edu: { cash: 1, fx: { soc: 0.4, pop: 0.3 }, cd: 4, nome: 'Emenda para a educação' },
}

export const CASOS_SV = [
  { id: 'surto', icon: '🦟', nome: 'Surto de doença', esf: ['mun', 'est', 'fed'], prob: 0.13, when: (m) => m.aten < 48 || m.estoq < 42,
    texto: () => 'Um surto de doença infecciosa lota os postos e as notícias não falam de outra coisa.',
    ops: [
      { id: 'campanha', icon: '💉', name: 'Campanha e bloqueio', desc: 'Custa 2 de caixa. Vacina, fumacê e orientação.', cash: 2, p: 0.72, ok: { t: 'A campanha segurou o surto.', fx: { soc: 0.6, pop: 0.5 }, m: { estoq: 6, aten: 4 } }, bad: { t: 'A campanha chegou tarde e o surto se espalhou.', fx: { soc: -0.8, pop: -0.7 }, m: { aten: -4 } } },
      { id: 'hospitais', icon: '🛏️', name: 'Abrir leitos de retaguarda', desc: 'Custa 3 de caixa. Segura os casos graves.', cash: 3, p: 0.8, ok: { t: 'Os leitos de retaguarda evitaram o colapso.', fx: { soc: 0.5, img: 0.6 }, m: { hosp: 8 } }, bad: { t: 'Os leitos abriram sem equipe suficiente.', fx: { img: -1 }, m: { hosp: 2 } } },
      { id: 'minimizar', icon: '🤐', name: 'Minimizar os números', desc: 'Sem custo. Se vazar, pega muito mal.', cash: 0, p: 0.45, ok: { t: 'A imprensa perdeu o interesse.', fx: {}, sujo: true }, bad: { t: 'Os números reais vazaram e o caso virou escândalo.', fx: { img: -4, pop: -1 }, sujo: true }, heat: 5 },
      { id: 'esperar', icon: '🙈', name: 'Esperar o surto passar', desc: 'Sem custo. A população sente.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O surto avançou sem resposta e custou vidas.', fx: { soc: -1.5, pop: -1.2, img: -1.5 }, m: { aten: -5, hosp: -4 } } },
    ] },
  { id: 'uti', icon: '🚑', nome: 'Hospitais lotados', esf: ['mun', 'est', 'fed'], prob: 0.12, when: (m) => m.hosp < 42,
    texto: () => 'Os hospitais estão sem vaga de UTI e pacientes esperam em corredores.',
    ops: [
      { id: 'leitos', icon: '🛏️', name: 'Leitos emergenciais', desc: 'Custa 3 de caixa. Abre vagas rápido.', cash: 3, p: 0.75, ok: { t: 'Os leitos emergenciais aliviaram a fila.', fx: { soc: 0.5, pop: 0.4 }, m: { hosp: 10 } }, bad: { t: 'Os leitos abriram, mas faltou equipe.', fx: { img: -0.8 }, m: { hosp: 3 } } },
      { id: 'privados', icon: '🏨', name: 'Comprar vagas na rede privada', desc: 'Custa 2 de caixa. Alívio imediato, de custo alto.', cash: 2, p: 0.85, ok: { t: 'As vagas privadas aliviaram o sistema.', fx: { soc: 0.3, cong: -0.3 }, m: { hosp: 4 } }, bad: { t: 'A compra foi questionada pela fiscalização.', fx: { img: -1.5 } } },
      { id: 'transferir', icon: '🚁', name: 'Transferir pacientes', desc: 'Sem custo. Pacientes vão para outras cidades.', cash: 0, p: 0.55, ok: { t: 'A transferência esvaziou os corredores.', fx: { soc: 0.2 } }, bad: { t: 'A transferência deu errado e virou notícia.', fx: { img: -2, soc: -0.5 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar a demanda cair', desc: 'Sem custo. Pessoas sofrem na fila.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A fila nos corredores ganhou manchete.', fx: { soc: -1, pop: -0.8, img: -1 }, m: { hosp: -3 } } },
    ] },
  { id: 'remedio', icon: '📦', nome: 'Falta de remédios', esf: ['mun', 'est', 'fed'], prob: 0.11, when: (m) => m.estoq < 42,
    texto: () => 'Faltam remédios essenciais nos postos e as filas de reclamação crescem.',
    ops: [
      { id: 'emergencial', icon: '🚚', name: 'Compra emergencial', desc: 'Custa 2 de caixa. Rápida e cara.', cash: 2, p: 0.8, ok: { t: 'A compra emergencial repôs o estoque.', fx: { soc: 0.3 }, m: { estoq: 12 } }, bad: { t: 'A compra atrasou e a falta continuou.', fx: { img: -1 }, m: { estoq: 4 } } },
      { id: 'dispensa', icon: '⚡', name: 'Dispensa por urgência', desc: 'Custa 1 de caixa. Rápida, mas dá margem a abuso.', cash: 1, p: 0.6, ok: { t: 'O estoque voltou rápido.', fx: { soc: 0.3 }, m: { estoq: 10 }, sujo: true }, bad: { t: 'A dispensa foi acusada de superfaturamento.', fx: { img: -3.5 }, m: { estoq: 6 }, sujo: true }, heat: 4 },
      { id: 'esperar', icon: '🙈', name: 'Aguardar a licitação normal', desc: 'Sem custo. Demora semanas.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A espera foi paga pelos pacientes.', fx: { soc: -1, pop: -0.8 }, m: { estoq: -4 } } },
    ] },
  { id: 'greve_med', icon: '🩹', nome: 'Greve na saúde', esf: ['mun', 'est'], prob: 0.1, when: (m) => m.hosp < 48 && m.aten < 48,
    texto: () => 'Médicos e enfermeiros cruzaram os braços por salário e condições de trabalho.',
    ops: [
      { id: 'reajuste', icon: '💵', name: 'Conceder reajuste', desc: 'Custa 2 de caixa. Encerra a greve.', cash: 2, p: 1, ok: { t: 'A greve foi encerrada com reajuste.', fx: { soc: 0.2, pop: 0.2 }, m: { hosp: 3 } } },
      { id: 'negociar', icon: '🤝', name: 'Negociar condições', desc: 'Sem custo. Pode dar certo ou prolongar.', cash: 0, p: 0.55, ok: { t: 'A negociação deu um acordo.', fx: { soc: 0.2 } }, bad: { t: 'A negociação fracassou e a greve continua.', fx: { soc: -0.8, pop: -0.5 }, m: { hosp: -3 } } },
      { id: 'ponto', icon: '✂️', name: 'Cortar o ponto', desc: 'Sem custo. Duro e impopular.', cash: 0, p: 0.4, ok: { t: 'A greve foi desmobilizada.', fx: { img: -0.5 }, m: { hosp: -2 } }, bad: { t: 'O corte do ponto radicalizou a categoria.', fx: { soc: -1.2, pop: -1, img: -1.5 }, m: { hosp: -5 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar', desc: 'Sem custo. A greve se arrasta.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A greve se arrastou e os postos fecharam.', fx: { soc: -1.2, pop: -0.8 }, m: { aten: -4, hosp: -4 } } },
    ] },
  { id: 'evasao', icon: '🚪', nome: 'Alerta de evasão escolar', esf: ['mun', 'est'], prob: 0.12, when: (m) => m.evas > 48,
    texto: () => 'Um levantamento mostra alunos abandonando a escola em ritmo crescente.',
    ops: [
      { id: 'busca', icon: '🔎', name: 'Busca ativa', desc: 'Custa 1 de caixa. Visita casa por casa.', cash: 1, p: 0.75, ok: { t: 'Muitos alunos voltaram para a sala.', fx: { soc: 0.4 }, m: { evas: -10 } }, bad: { t: 'A busca achou poucos alunos.', fx: {}, m: { evas: -3 } } },
      { id: 'bolsa', icon: '🎒', name: 'Bolsa permanência', desc: 'Custa 2 de caixa. Paga famílias para manter o aluno.', cash: 2, p: 0.8, ok: { t: 'A bolsa segurou os alunos.', fx: { soc: 0.5, pop: 0.4 }, m: { evas: -12 } }, bad: { t: 'A bolsa atrasou e o efeito foi pequeno.', fx: { pop: -0.2 }, m: { evas: -3 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar o ano letivo acabar', desc: 'Sem custo. A evasão cresce.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A evasão seguiu e o futuro paga.', fx: { soc: -0.8 }, m: { evas: 6, alfa: -3 } } },
    ] },
  { id: 'merenda', icon: '🍲', nome: 'Denúncia na merenda escolar', esf: ['mun', 'est'], prob: 0.1, when: (m) => m.infra < 45,
    texto: () => 'Uma denúncia aponta merenda estragada e contrato suspeito no fornecimento.',
    ops: [
      { id: 'investigar', icon: '🔍', name: 'Investigar e trocar o fornecedor', desc: 'Custa 1 de caixa. Resposta firme.', cash: 1, p: 0.8, ok: { t: 'A troca do fornecedor deu resposta às famílias.', fx: { img: 0.8, soc: 0.2 } }, bad: { t: 'A troca demorou e a merenda faltou.', fx: { img: -1, soc: -0.4 } } },
      { id: 'abafar', icon: '🤐', name: 'Abafar a denúncia', desc: 'Sem custo. Se vazar, é escândalo.', cash: 0, p: 0.45, ok: { t: 'A denúncia morreu.', fx: {}, sujo: true }, bad: { t: 'A tentativa de abafar vazou.', fx: { img: -4, pop: -0.8 }, sujo: true }, heat: 5 },
      { id: 'esperar', icon: '🙈', name: 'Deixar apurar', desc: 'Sem custo. A apuração anda sozinha.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A apuração andou devagar e as famílias cobraram.', fx: { img: -1.5, soc: -0.5 } } },
    ] },
  { id: 'avaliacao', icon: '📉', nome: 'Resultado ruim em avaliação nacional', esf: ['mun', 'est', 'fed'], prob: 0.1, when: (m) => m.alfa < 45,
    texto: () => 'A avaliação nacional mostra queda no aprendizado e a oposição aproveita.',
    ops: [
      { id: 'plano', icon: '📘', name: 'Plano de recuperação', desc: 'Custa 2 de caixa. Reforço e metas.', cash: 2, p: 0.75, ok: { t: 'O plano de recuperação reorganizou as escolas.', fx: { img: 0.8, soc: 0.3 }, m: { alfa: 8 } }, bad: { t: 'O plano foi criticado como improviso.', fx: { img: -0.8 }, m: { alfa: 2 } } },
      { id: 'culpar', icon: '🗣️', name: 'Culpar o governo anterior', desc: 'Sem custo. Funciona no início e perde força.', cash: 0, p: 0.5, ok: { t: 'A culpa recaiu no passado.', fx: {} }, bad: { t: 'O argumento soou como desculpa.', fx: { img: -1.8 } } },
      { id: 'esperar', icon: '🙈', name: 'Ignorar os números', desc: 'Sem custo. Os números ficam.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O resultado ruim virou arma da oposição.', fx: { img: -1.5, soc: -0.4 } } },
    ] },
  { id: 'epidemia', icon: '🦠', nome: 'Epidemia de grandes proporções', esf: ['est', 'fed'], prob: 0.06, when: (m) => m.estoq < 38 && m.aten < 42,
    texto: () => 'Uma epidemia avança em várias regiões e o sistema está no limite.',
    ops: [
      { id: 'vacinacao', icon: '💉', name: 'Vacinação em massa', desc: 'Custa 3 de caixa. Resposta forte e organizada.', cash: 3, p: 0.7, ok: { t: 'A vacinação em massa conteve a epidemia.', fx: { soc: 1, pop: 1, img: 1.2 }, m: { estoq: 10, aten: 8 } }, bad: { t: 'A vacinação foi desorganizada e tardia.', fx: { soc: -0.5, pop: -0.8, img: -1 }, m: { estoq: 3 } } },
      { id: 'restricoes', icon: '🚧', name: 'Restrições de circulação', desc: 'Custa 1 de caixa. Eficaz, mas pesa na economia.', cash: 1, p: 0.65, ok: { t: 'As restrições seguraram o avanço.', fx: { soc: 0.5, eco: -1.2, pop: -0.6 } }, bad: { t: 'As restrições foram contestadas e perdidas.', fx: { eco: -1.5, pop: -1.2, img: -1.5 } } },
      { id: 'minimizar', icon: '🤐', name: 'Minimizar a gravidade', desc: 'Sem custo. Arrisca a pagar com vidas.', cash: 0, p: 0.3, ok: { t: 'A epidemia perdeu força sozinha.', fx: { pop: 0.3 } }, bad: { t: 'Minimizar a gravidade custou vidas e credibilidade.', fx: { soc: -2.5, pop: -2, img: -4 }, m: { hosp: -8 } }, heat: 6 },
      { id: 'esperar', icon: '🙈', name: 'Esperar', desc: 'Sem custo. A epidemia avança.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A epidemia avançou sem resposta.', fx: { soc: -2, pop: -1.5, img: -2.5 }, m: { hosp: -6, aten: -4 } } },
    ] },
]
export const CASO_SV_POR_ID = Object.fromEntries(CASOS_SV.map((c) => [c.id, c]))
