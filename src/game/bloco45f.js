// BLOCO 45F: meio ambiente, clima e Amazônia. Cobertura verde, fiscalização, resiliência climática, agro e reputação internacional.

export const MET_AMB = {
  floresta: { icon: '🌳', nome: 'Cobertura verde e floresta', bom: true, ini: 65 },
  fisc: { icon: '🛰️', nome: 'Fiscalização ambiental', bom: true, ini: 40 },
  clima: { icon: '🌧️', nome: 'Preparo contra eventos extremos', bom: true, ini: 40 },
  agro: { icon: '🌾', nome: 'Relação com o setor produtivo', bom: true, ini: 50 },
  intl: { icon: '🌍', nome: 'Reputação ambiental internacional', bom: true, ini: 45 },
}
export const PADRAO_AMB = 'esperar'

export const ACOES_AMB = [
  { id: 'fiscalizar', icon: '🚔', nome: 'Reforçar a fiscalização ambiental', desc: 'Mais fiscais e multas aplicadas.', cash: 2, m: { fisc: 12, agro: -3 }, fx: { img: 0.2 }, cd: 3, esf: ['mun', 'est', 'fed'] },
  { id: 'satelite', icon: '🛰️', nome: 'Monitoramento por satélite e drones', desc: 'Alertas de desmatamento em tempo real.', cash: 2, m: { fisc: 8, floresta: 4 }, fx: {}, cd: 3, esf: ['est', 'fed'] },
  { id: 'conservacao', icon: '🏞️', nome: 'Criar unidades de conservação', desc: 'Protege a floresta e incomoda o produtor.', cash: 3, m: { floresta: 8, agro: -7, intl: 4 }, fx: { img: 0.4 }, cd: 4, esf: ['est', 'fed'] },
  { id: 'reflorestar', icon: '🌱', nome: 'Reflorestamento e áreas verdes', desc: 'Mudas, parques e arborização.', cash: 2, m: { floresta: 6, clima: 4 }, fx: { pop: 0.3 }, cd: 3, esf: ['mun', 'est', 'fed'] },
  { id: 'bioeconomia', icon: '🌿', nome: 'Bioeconomia e extrativismo sustentável', desc: 'Renda com a floresta em pé.', cash: 2, m: { floresta: 4, agro: 3, intl: 3 }, fx: { eco: 0.4 }, cd: 4, esf: ['est', 'fed'] },
  { id: 'drenagem', icon: '🌊', nome: 'Drenagem, encostas e canais', desc: 'Obra para a chuva forte não virar tragédia.', cash: 3, m: { clima: 14 }, fx: { img: 0.2 }, cd: 3, esf: ['mun', 'est'] },
  { id: 'defesa_civil', icon: '🚨', nome: 'Defesa civil e alertas', desc: 'Sirenes, planos de evacuação e treinamento.', cash: 2, m: { clima: 10 }, fx: {}, cd: 3, esf: ['mun', 'est', 'fed'] },
  { id: 'credito_verde', icon: '💳', nome: 'Crédito rural verde', desc: 'Financia o produtor que respeita as regras.', cash: 1, m: { agro: 8, floresta: 2 }, fx: {}, cd: 3, esf: ['est', 'fed'] },
  { id: 'licenciamento', icon: '📝', nome: 'Agilizar o licenciamento ambiental', desc: 'O setor agradece, a floresta paga.', cash: 0, m: { agro: 10, floresta: -4, intl: -4 }, fx: { eco: 0.5 }, cd: 4, esf: ['est', 'fed'] },
  { id: 'mineracao', icon: '⛏️', nome: 'Liberar mineração em áreas sensíveis', desc: 'Caixa e emprego agora. Cobertura e imagem pagam depois.', cash: 0, m: { floresta: -8, agro: 8, intl: -6 }, fx: { cash: 2, eco: 0.6, img: -0.8 }, cd: 5, esf: ['est', 'fed'] },
  { id: 'cop', icon: '🌐', nome: 'Liderar a agenda climática na COP', desc: 'Presidente. Prestígio lá fora e cobrança por metas aqui.', cash: 2, m: { intl: 14 }, fx: { img: 0.8 }, cd: 5, esf: ['fed'] },
  { id: 'fundo', icon: '🏦', nome: 'Captar fundo internacional de proteção', desc: 'Presidente. Exige boa reputação ambiental. Entra caixa.', cash: 0, m: { intl: 3, fisc: 4 }, fx: { cash: 3 }, cd: 6, esf: ['fed'], needIntl: 55 },
]
export const ACAO_AMB_POR_ID = Object.fromEntries(ACOES_AMB.map((a) => [a.id, a]))

export const CASOS_AMB = [
  { id: 'queimadas', icon: '🔥', nome: 'Onda de queimadas', esf: ['mun', 'est', 'fed'], prob: 0.13, when: (m) => m.floresta < 58 || m.fisc < 38,
    texto: () => 'Focos de incêndio se espalham, a fumaça cobre cidades e a imprensa mostra imagens do fogo.',
    ops: [
      { id: 'brigada', icon: '🚒', name: 'Reforçar as brigadas', desc: 'Custa 2 de caixa. Combate o fogo no chão.', cash: 2, p: 0.7, ok: { t: 'As brigadas controlaram os focos.', fx: { img: 0.6, pop: 0.3 }, m: { floresta: 3, fisc: 3 } }, bad: { t: 'O fogo avançou mais rápido que as brigadas.', fx: { img: -1.2, pop: -0.5 }, m: { floresta: -4 } } },
      { id: 'forcas', icon: '🪖', name: 'Acionar a Força Nacional e o Exército', desc: 'Custa 3 de caixa. Só estado e União.', cash: 3, quem: ['governador', 'presidente'], p: 0.78, ok: { t: 'Aeronaves e tropas conteram o fogo.', fx: { img: 1, pop: 0.4 }, m: { floresta: 4 } }, bad: { t: 'O reforço chegou tarde.', fx: { img: -1 }, m: { floresta: -2 } } },
      { id: 'culpar', icon: '🗣️', name: 'Culpar a seca e os adversários', desc: 'Sem custo. Funciona pouco.', cash: 0, p: 0.4, ok: { t: 'A narrativa distraiu por uns dias.', fx: {} }, bad: { t: 'A narrativa foi desmentida por imagens de satélite.', fx: { img: -2.5 }, m: { intl: -4 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar a chuva', desc: 'Sem custo. A floresta paga.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O fogo seguiu até a chuva chegar.', fx: { img: -2, pop: -0.8 }, m: { floresta: -7, intl: -4 } } },
    ] },
  { id: 'garimpo', icon: '⛏️', nome: 'Garimpo ilegal em área protegida', esf: ['est', 'fed'], prob: 0.12, when: (m) => m.fisc < 45,
    texto: () => 'Imagens de satélite mostram garimpo ilegal avançando sobre uma terra protegida, com rios contaminados.',
    ops: [
      { id: 'operacao', icon: '🚔', name: 'Operação de desintrusão', desc: 'Custa 2 de caixa. Retira os invasores.', cash: 2, p: 0.65, ok: { t: 'A operação retirou os garimpeiros e destruiu equipamentos.', fx: { img: 1, seg: 0.4 }, m: { floresta: 6, fisc: 4, intl: 4 } }, bad: { t: 'A operação terminou em confronto e voltou à estaca zero.', fx: { img: -1.5 }, m: { fisc: -2 } } },
      { id: 'regularizar', icon: '📝', name: 'Regularizar a atividade', desc: 'Sem custo. Agrada o setor e queima a imagem.', cash: 0, p: 0.8, ok: { t: 'A regularização acalmou o setor.', fx: { eco: 0.4, img: -1 }, m: { floresta: -6, agro: 6, intl: -5 } }, bad: { t: 'A regularização foi barrada na Justiça.', fx: { img: -2 }, m: { agro: -2 } } },
      { id: 'esperar', icon: '🙈', name: 'Deixar para depois', desc: 'Sem custo. O rio paga.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O garimpo se alastrou e contaminou mais rios.', fx: { img: -1.8, soc: -0.4 }, m: { floresta: -6, intl: -5 } } },
    ] },
  { id: 'seca', icon: '🏜️', nome: 'Seca severa e crise de água', esf: ['mun', 'est', 'fed'], prob: 0.11, when: (m) => m.clima < 45 || m.floresta < 45,
    texto: () => 'Os reservatórios secam, o racionamento é discutido e a produção rural sofre.',
    ops: [
      { id: 'pipa', icon: '🚚', name: 'Carros-pipa e poços', desc: 'Custa 2 de caixa. Resposta emergencial.', cash: 2, p: 0.8, ok: { t: 'A água chegou a quem mais precisava.', fx: { pop: 0.5, soc: 0.3 }, m: { clima: 3 } }, bad: { t: 'A distribuição foi desorganizada.', fx: { pop: -0.4, img: -0.8 } } },
      { id: 'racionar', icon: '🚰', name: 'Racionamento planejado', desc: 'Sem custo. Impopular, mas evita colapso.', cash: 0, p: 0.7, ok: { t: 'O racionamento organizou o consumo.', fx: { pop: -0.6, img: 0.3 }, m: { clima: 4 } }, bad: { t: 'O racionamento foi mal explicado e gerou protesto.', fx: { pop: -1.5, img: -1 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar a chuva', desc: 'Sem custo. Depende do clima.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A seca avançou sem plano.', fx: { pop: -1.5, soc: -0.8, eco: -0.6, img: -1.5 }, m: { clima: -4 } } },
    ] },
  { id: 'enchente', icon: '🌊', nome: 'Enchente e deslizamentos', esf: ['mun', 'est'], prob: 0.12, when: (m) => m.clima < 42,
    texto: () => 'Chuvas fortes alagam bairros, derrubam encostas e deixam famílias desabrigadas.',
    ops: [
      { id: 'resgate', icon: '🚁', name: 'Resgate e abrigos', desc: 'Custa 2 de caixa. Salva e acolhe.', cash: 2, p: 0.8, ok: { t: 'O resgate foi rápido e organizado.', fx: { pop: 0.8, img: 0.8, soc: 0.3 }, m: { clima: 3 } }, bad: { t: 'O resgate foi lento e as críticas vieram.', fx: { pop: -0.5, img: -1 } } },
      { id: 'obras', icon: '🏗️', name: 'Anunciar obras de contenção', desc: 'Custa 3 de caixa. Resposta de médio prazo.', cash: 3, p: 0.85, ok: { t: 'O plano de obras tranquilizou a população.', fx: { img: 0.8 }, m: { clima: 9 } }, bad: { t: 'O plano foi visto como promessa vazia.', fx: { img: -0.8 }, m: { clima: 3 } } },
      { id: 'esperar', icon: '🙈', name: 'Aguardar a água baixar', desc: 'Sem custo. As pessoas sentem.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A omissão virou o assunto do dia.', fx: { pop: -1.8, img: -2, soc: -0.8 }, m: { clima: -3 } } },
    ] },
  { id: 'desastre', icon: '☣️', nome: 'Desastre ambiental ligado a uma empresa', esf: ['est', 'fed'], prob: 0.09, when: (m) => m.fisc < 45,
    texto: () => 'Uma barragem ou duto de uma empresa vazou e o rio ficou contaminado. A pressão por responsabilização é imediata.',
    ops: [
      { id: 'multar', icon: '⚖️', name: 'Multar e exigir reparação', desc: 'Custa 1 de caixa. Linha dura.', cash: 1, p: 0.72, ok: { t: 'A empresa foi multada e iniciou a reparação.', fx: { img: 1.2, pop: 0.4 }, m: { fisc: 6, agro: -3, intl: 2 } }, bad: { t: 'A empresa recorreu e a reparação travou.', fx: { img: -1 } } },
      { id: 'acordo', icon: '🤝', name: 'Firmar um acordo de reparação', desc: 'Sem custo. Mais rápido, menos rigoroso.', cash: 0, p: 0.8, ok: { t: 'O acordo garantiu reparação com menos conflito.', fx: { img: 0.2, eco: 0.2 }, m: { fisc: -2 } }, bad: { t: 'O acordo foi visto como brando demais.', fx: { img: -2 }, m: { fisc: -3 } } },
      { id: 'esperar', icon: '🙈', name: 'Deixar a empresa agir', desc: 'Sem custo. A responsabilização some.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'Ninguém foi responsabilizado e o rio seguiu contaminado.', fx: { img: -2.5, pop: -0.8, soc: -0.6 }, m: { floresta: -3, fisc: -3 } } },
    ] },
  { id: 'ruralista', icon: '🌾', nome: 'Bancada do agro pressiona para afrouxar regras', esf: ['est', 'fed'], prob: 0.1, when: (m) => m.agro < 52,
    texto: () => 'Lideranças do setor produtivo cobram flexibilização de regras ambientais e ameaçam retaliar na base.',
    ops: [
      { id: 'ceder', icon: '🤝', name: 'Ceder em parte', desc: 'Sem custo. Acalma o setor e abre brecha.', cash: 0, p: 1, ok: { t: 'A cedência acalmou o setor.', fx: { cong: 1.2, eco: 0.3 }, m: { agro: 10, floresta: -4, intl: -4 } } },
      { id: 'negociar', icon: '🧑‍🌾', name: 'Negociar um pacto produtivo', desc: 'Custa 1 de caixa. Regras claras em troca de apoio.', cash: 1, p: 0.62, ok: { t: 'O pacto deu previsibilidade e protegeu a floresta.', fx: { cong: 0.4, eco: 0.2 }, m: { agro: 6, intl: 2 } }, bad: { t: 'A negociação fracassou.', fx: { cong: -0.8 }, m: { agro: -2 } } },
      { id: 'resistir', icon: '🛑', name: 'Resistir', desc: 'Sem custo. Agrada ambientalistas e irrita o setor.', cash: 0, p: 1, ok: { t: 'Você manteve as regras.', fx: { img: 0.8, cong: -1.5 }, m: { agro: -6, floresta: 2, intl: 3 } } },
      { id: 'esperar', icon: '🙈', name: 'Ignorar', desc: 'Sem custo. O setor segue pressionando.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A pressão do setor virou bloqueio no Congresso.', fx: { cong: -1.2 }, m: { agro: -3 } } },
    ] },
  { id: 'pressao_intl', icon: '🌍', nome: 'Pressão internacional sobre o desmatamento', esf: ['fed'], prob: 0.1, when: (m) => m.floresta < 52 || m.intl < 38,
    texto: () => 'Parceiros comerciais ameaçam barreiras a produtos ligados ao desmatamento e cobram metas.',
    ops: [
      { id: 'plano', icon: '📘', name: 'Apresentar um plano de metas', desc: 'Custa 2 de caixa. Resposta séria.', cash: 2, p: 0.7, ok: { t: 'O plano reabriu a negociação comercial.', fx: { img: 0.8, eco: 0.3 }, m: { intl: 10, fisc: 4 } }, bad: { t: 'O plano foi visto como pouco crível.', fx: { img: -0.6 }, m: { intl: 2 } } },
      { id: 'soberania', icon: '🛡️', name: 'Defender a soberania', desc: 'Sem custo. Agrada o público interno e pesa lá fora.', cash: 0, p: 0.75, ok: { t: 'O discurso soberanista mobilizou a base.', fx: { pop: 0.7, img: -0.4 }, m: { intl: -8 } }, bad: { t: 'O discurso piorou o isolamento.', fx: { img: -1.5, eco: -0.5 }, m: { intl: -10 } } },
      { id: 'esperar', icon: '🙈', name: 'Esperar', desc: 'Sem custo. As barreiras avançam.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'Barreiras comerciais foram anunciadas.', fx: { eco: -1.2, img: -1 }, m: { intl: -6 } } },
    ] },
]
export const CASO_AMB_POR_ID = Object.fromEntries(CASOS_AMB.map((c) => [c.id, c]))
