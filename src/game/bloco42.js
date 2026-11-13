// BLOCO 42: revoltas e crises em quatro escalas (municipal, estadual, nacional, internacional).
// A escala depende do cargo. A crise pode escalar para revolta. O jogador também pode lançar uma mobilização.
// Segmentos citados são os do bloco 40; cenários os do bloco 36. Tudo fictício.

export const ESCALAS = {
  municipal: { nome: 'Municipal', icon: '🏙️', alvo: 'a cidade' },
  estadual: { nome: 'Estadual', icon: '🗺️', alvo: 'o estado' },
  nacional: { nome: 'Nacional', icon: '🇧🇷', alvo: 'o país' },
  internacional: { nome: 'Internacional', icon: '🌍', alvo: 'o mundo' },
}
// quais escalas cada cargo enfrenta, com o peso de cada uma
export const ESCALAS_CARGO = {
  vereador: { municipal: 3, internacional: 1 },
  prefeito: { municipal: 3, internacional: 1 },
  dep_estadual: { estadual: 3, internacional: 1 },
  governador: { estadual: 3, internacional: 1.2 },
  dep_federal: { estadual: 1.5, nacional: 2, internacional: 1.5 },
  senador: { estadual: 1.5, nacional: 2, internacional: 1.5 },
  presidente: { nacional: 3, internacional: 2 },
}

// t(a) devolve o texto com o alvo do cargo ("a cidade", "o estado", "o país"). seg = segmento envolvido. cen = cenários que a favorecem.
export const CRISES_ESC = [
  { id: 'alagamento', esc: 'municipal', icon: '🌧️', seg: 'periferia', cen: ['seca'], nome: 'Chuva forte alaga os bairros', t: () => 'Uma chuva de verão alagou ruas e casas. Moradores pedem abrigo e resposta rápida.', esp: { icon: '⛺', name: 'Abrigos e mutirão', desc: 'Abre ginásios, entrega cestas e coloca o governo na rua.', cash: 2, p: 0.75, ok: { t: 'O mutirão virou exemplo de gestão.', fx: { pop: 1.5, soc: 0.8 } }, bad: { t: 'Faltou estrutura e a ajuda chegou tarde.', fx: { pop: -0.5, img: -0.5 } } } },
  { id: 'tarifa', esc: 'municipal', icon: '🚌', seg: 'jovens', cen: ['jovem', 'fiscal'], nome: 'Quebra-quebra por causa da tarifa', t: () => 'Estudantes e trabalhadores bloqueiam avenidas contra o aumento da passagem do ônibus.', esp: { icon: '🧾', name: 'Congelar a tarifa', desc: 'Segura a passagem e banca a diferença.', cash: 3, p: 0.8, ok: { t: 'A tarifa foi congelada e as ruas esvaziaram.', fx: { pop: 1.5, img: 0.5 } }, bad: { t: 'O congelamento estourou o caixa do transporte.', fx: { eco: -0.5 } } } },
  { id: 'ocupacao', esc: 'municipal', icon: '🏚️', seg: 'periferia', cen: ['fiscal'], nome: 'Ocupação de prédio público', t: () => 'Famílias sem teto ocuparam um prédio da prefeitura e pedem moradia.', esp: { icon: '🏠', name: 'Mesa de moradia', desc: 'Abre uma mesa com cadastro e prazo para unidades populares.', cash: 1, p: 0.65, ok: { t: 'A mesa destravou um acordo de moradia.', fx: { soc: 1, pop: 1 } }, bad: { t: 'A mesa empacou e a ocupação ficou.', fx: { pop: -0.5 } } } },
  { id: 'lixo', esc: 'municipal', icon: '🗑️', seg: 'classe_media', cen: ['fiscal'], nome: 'Greve da coleta e lixo nas ruas', t: () => 'Os garis cruzaram os braços e o lixo se acumula nas esquinas.', esp: { icon: '🧹', name: 'Mutirão de limpeza', desc: 'Contrata equipe emergencial e paga o atrasado.', cash: 2, p: 0.7, ok: { t: 'As ruas foram limpas e a greve acabou.', fx: { pop: 1, img: 0.5 } }, bad: { t: 'O mutirão não deu conta e a imprensa cobrou.', fx: { img: -1 } } } },
  { id: 'pm', esc: 'estadual', icon: '🚓', seg: 'classe_media', cen: ['violencia'], nome: 'Greve da polícia', t: () => 'A tropa da polícia cruzou os braços por salário. O crime sente a brecha.', esp: { icon: '💵', name: 'Reajuste negociado', desc: 'Reabre o salário com escalonamento.', cash: 3, p: 0.75, ok: { t: 'A negociação encerrou a greve.', fx: { seg: 1.2, pop: 0.5 } }, bad: { t: 'A proposta foi rejeitada e a greve continuou.', fx: { seg: -1, img: -0.5 } } } },
  { id: 'presidio', esc: 'estadual', icon: '⛓️', seg: 'fe', cen: ['violencia'], nome: 'Rebelião em presídio', t: () => 'Presos tomaram uma ala e fizeram reféns. A imprensa transmite ao vivo.', esp: { icon: '🕊️', name: 'Negociador e mediação', desc: 'Manda negociador treinado e a Defensoria.', cash: 1, p: 0.6, ok: { t: 'Os reféns foram soltos sem mortes.', fx: { seg: 1, img: 1.2 } }, bad: { t: 'A negociação falhou e houve feridos.', fx: { img: -1.5, seg: -0.8 } } } },
  { id: 'hidrica', esc: 'estadual', icon: '🚰', seg: 'interior', cen: ['seca'], nome: 'Crise hídrica no interior', t: () => 'Os reservatórios do interior secaram e cidades inteiras ficam sem água.', esp: { icon: '🚚', name: 'Obras emergenciais', desc: 'Poços, adutora e caminhão-pipa.', cash: 3, p: 0.7, ok: { t: 'A água voltou a chegar e o interior respirou.', fx: { pop: 1, soc: 0.8 } }, bad: { t: 'As obras atrasaram e a falta de água continuou.', fx: { pop: -0.8, img: -0.5 } } } },
  { id: 'vazamento', esc: 'estadual', icon: '🛢️', seg: 'ambientalistas', cen: ['commodities'], nome: 'Vazamento químico em rio', t: () => 'Um vazamento contaminou um rio que abastece cidades. Há peixes mortos e comunidades sem pesca.', esp: { icon: '⚖️', name: 'Responsabilizar a empresa', desc: 'Multa pesada e fundo de reparação pago pela empresa.', cash: 0, p: 0.6, ok: { t: 'A empresa pagou e o governo mostrou firmeza.', fx: { img: 1.5, cash: 2 } }, bad: { t: 'A empresa recorreu e o dano ficou sem reparo.', fx: { img: -1 } } } },
  { id: 'greve_geral', esc: 'nacional', icon: '🪧', seg: 'trabalhadores', cen: ['fiscal'], nome: 'Greve geral', t: () => 'Centrais sindicais convocaram greve geral contra o pacote econômico.', esp: { icon: '📜', name: 'Revogar parte do pacote', desc: 'Recua em itens que mais incomodam.', cash: 1, p: 0.7, ok: { t: 'O recuo desmobilizou os sindicatos.', fx: { pop: 1.2, eco: 0.3 } }, bad: { t: 'O recuo foi lido como fraqueza.', fx: { img: -1, cong: -0.5 } } } },
  { id: 'estradas', esc: 'nacional', icon: '🚚', seg: 'interior', cen: ['commodities', 'fiscal'], nome: 'Paralisação nas estradas', t: () => 'Caminhoneiros bloquearam rodovias e o abastecimento começa a falhar.', esp: { icon: '⛽', name: 'Teto para o diesel', desc: 'Segura o preço do combustível por algumas semanas.', cash: 3, p: 0.75, ok: { t: 'O teto do diesel liberou as estradas.', fx: { eco: 0.8, pop: 0.8 } }, bad: { t: 'O teto não bastou e as prateleiras esvaziaram.', fx: { eco: -1, pop: -0.8 } } } },
  { id: 'protestos', esc: 'nacional', icon: '📢', seg: 'jovens', cen: ['escandalos', 'polar'], nome: 'Protestos nas capitais', t: () => 'Multidões tomam as ruas das capitais cobrando respostas sobre corrupção e custo de vida.', esp: { icon: '🎙️', name: 'Pronunciamento em rede', desc: 'Fala ao país, anuncia medidas e abre diálogo.', cash: 0, p: 0.55, ok: { t: 'O discurso acalmou as ruas.', fx: { pop: 1.5, img: 1 } }, bad: { t: 'O discurso foi lido como mais do mesmo.', fx: { pop: -1, img: -1 } } } },
  { id: 'institucional', esc: 'nacional', icon: '⚖️', seg: 'classe_media', cen: ['polar'], nome: 'Embate entre poderes', t: () => 'Uma decisão da Justiça e uma reação do Congresso abriram uma crise entre os poderes.', esp: { icon: '🕊️', name: 'Pacto institucional', desc: 'Costura um acordo entre os poderes.', cash: 0, p: 0.6, ok: { t: 'O pacto baixou a temperatura entre os poderes.', fx: { img: 1.5, cong: 1 } }, bad: { t: 'O pacto não saiu e o embate continuou.', fx: { img: -1, cong: -1 } } } },
  { id: 'refugiados', esc: 'internacional', icon: '🧳', seg: 'fe', cen: [], nome: 'Chegada de refugiados', t: (a) => `Uma crise em um país distante empurrou milhares de refugiados para ${a}. Faltam abrigo e atendimento.`, esp: { icon: '🤲', name: 'Acolhida com parceiros', desc: 'Faz parceria com ONGs, igrejas e organismos internacionais.', cash: 2, p: 0.7, ok: { t: 'A acolhida organizada foi elogiada lá fora.', fx: { img: 1.5, soc: 0.5 } }, bad: { t: 'A acolhida virou tensão nos bairros.', fx: { pop: -0.8, seg: -0.5 } } } },
  { id: 'boicote', esc: 'internacional', icon: '🚫', seg: 'interior', cen: ['commodities'], nome: 'Boicote a produtos', t: (a) => `Compradores estrangeiros ameaçam boicotar produtos de ${a} por causa de uma polêmica ambiental.`, esp: { icon: '🌿', name: 'Selo de origem e auditoria', desc: 'Auditoria independente e selo de origem.', cash: 2, p: 0.65, ok: { t: 'A auditoria reabriu os mercados.', fx: { eco: 1, img: 0.8 } }, bad: { t: 'A auditoria apontou falhas e o boicote cresceu.', fx: { eco: -1, img: -0.8 } } } },
  { id: 'investidor', esc: 'internacional', icon: '📉', seg: 'trabalhadores', cen: ['fiscal'], nome: 'Fuga de investimento estrangeiro', t: (a) => `Fundos estrangeiros dizem que vão tirar dinheiro de ${a} se não houver sinal de estabilidade.`, esp: { icon: '🛡️', name: 'Garantias e regra clara', desc: 'Anuncia regras estáveis e segurança jurídica.', cash: 1, p: 0.65, ok: { t: 'O mercado acreditou e o dinheiro ficou.', fx: { eco: 1.2, img: 0.5 } }, bad: { t: 'O mercado não acreditou e o dinheiro saiu.', fx: { eco: -1.2 } } } },
  { id: 'surto', esc: 'internacional', icon: '🦠', seg: 'idosos', cen: ['saude'], nome: 'Alerta sanitário vindo de fora', t: (a) => `Um surto no exterior acende o alerta sanitário em ${a}. Há medo e fila nos postos.`, esp: { icon: '💉', name: 'Campanha e barreira sanitária', desc: 'Vacinação, triagem e comunicação clara.', cash: 2, p: 0.7, ok: { t: 'A resposta rápida segurou o surto.', fx: { soc: 1, pop: 0.8 } }, bad: { t: 'A resposta foi lenta e o medo cresceu.', fx: { soc: -1, pop: -0.8 } } } },
]
export const CRISE_ESC_POR_ID = Object.fromEntries(CRISES_ESC.map((c) => [c.id, c]))

// respostas padrão, ajustadas por cargo (executivo usa força, legislador cobra o governo)
export function opsCrise(def, ctx) {
  const { exec, stage, pop, seg, apoioSeg } = ctx
  const k = stage === 2 ? 1.5 : 1
  const pen = stage === 2 ? -0.12 : 0
  const cl = (v) => Math.max(0.1, Math.min(0.92, v))
  const ops = [
    { id: 'negociar', icon: '🤝', name: 'Negociar', desc: 'Abre mesa com os líderes. Custa 2 de caixa.', cash: 2, p: cl(0.62 + (pop - 50) / 250 + (apoioSeg >= 50 ? 0.05 : 0) + pen), ok: { t: 'A mesa de negociação desarmou a crise.', fx: { pop: 1 * k, img: 0.5 * k } }, bad: { t: 'A negociação não avançou e o clima azedou.', fx: { pop: -0.5 * k } }, apoio: [10, 0] },
    exec
      ? { id: 'forca', icon: '🛡️', name: 'Usar a força', desc: 'Resposta dura. Rápida, mas cobra caro se der errado.', cash: 0, p: cl(0.48 + (seg - 50) / 150 - (apoioSeg > 60 ? 0.1 : 0) + pen), ok: { t: 'A resposta dura encerrou a crise.', fx: { seg: 1 * k, img: -0.5 * k } }, bad: { t: 'A resposta dura saiu do controle.', fx: { img: -2 * k, pop: -1.5 * k } }, apoio: [-10, -18] }
      : { id: 'cobrar', icon: '📣', name: 'Cobrar o governo', desc: 'Usa a tribuna e pressiona o executivo.', cash: 0, p: cl(0.6 + pen), ok: { t: 'A cobrança rendeu espaço e voz.', fx: { img: 1.5 * k, pop: 1 * k, cong: -1 } }, bad: { t: 'A cobrança foi lida como oportunismo.', fx: { img: -1 * k } }, apoio: [6, 0] },
    { id: 'investir', icon: exec ? '🏗️' : '📋', name: exec ? 'Investir na causa' : 'Emenda de emergência', desc: 'Dinheiro para a raiz do problema. Custa 3 de caixa.', cash: 3, p: cl(0.78 + pen), ok: { t: 'O investimento atacou a causa da crise.', fx: { eco: 0.8 * k, soc: 0.8 * k, pop: 0.8 * k } }, bad: { t: 'O dinheiro não chegou a tempo.', fx: { pop: -0.3 * k } }, apoio: [12, 4] },
    { id: 'especial', icon: def.esp.icon, name: def.esp.name, desc: `${def.esp.desc}${def.esp.cash ? ` Custa ${def.esp.cash} de caixa.` : ''}`, cash: def.esp.cash, p: cl(def.esp.p + pen), ok: { t: def.esp.ok.t, fx: scale(def.esp.ok.fx, k) }, bad: { t: def.esp.bad.t, fx: scale(def.esp.bad.fx, k) }, apoio: [10, -5] },
    { id: 'esperar', icon: '🙈', name: 'Esperar passar', desc: 'Sem custo. O desgaste cresce e pode virar revolta.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A crise ficou sem resposta.', fx: { pop: -0.8 * k, img: -0.5 * k } }, apoio: [0, -6], escala: true },
  ]
  return ops
}
function scale(fx, k) { const o = {}; for (const a in fx) o[a] = fx[a] * k; return o }
export const PADRAO_CRISE = 'esperar'
export const CHANCE_ESCALA = 0.4
export const REVOLTA = { custo: 2, cd: 8, minMob: 50 }
