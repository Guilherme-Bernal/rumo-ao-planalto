// Eventos regionais: dependem do estado em que você faz carreira.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 10) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })
const ANY = [0, 1, 2, 3]
const inUF = (...ufs) => (g) => ufs.includes(g.region.id)

export const regionalEvents = [
  E('seca', ANY, 'mun', 'A seca aperta o sertão', 'Os reservatórios estão secando e as lavouras morrem. Produtores e prefeitos pedem socorro urgente.', [
    C('Mandar caminhões-pipa e cestas básicas', { soc: 4, pop: 3, cash: -5 }, 'A ajuda chegou rápido. A conta também.'),
    C('Cobrar obras de adutoras do governo federal', { cong: 3, img: 2, eco: 1 }, 'Você virou voz da região em Brasília. As obras vão levar tempo.'),
    G('Fechar parceria com uma empresa de dessalinização', 0.5, { eco: 4, soc: 3, img: 2 }, 'A tecnologia funcionou e virou vitrine.', { cash: -5, img: -4 }, 'O projeto atrasou e a oposição chamou de propaganda.'),
  ], inUF('ce', 'pe', 'pb', 'rn', 'pi', 'ba', 'al', 'se', 'ma')),
  E('safra', ANY, 'est', 'Safra recorde e fila no porto', 'A colheita bateu recorde, mas as estradas e o porto não dão conta. Produtores ameaçam parar.', [
    C('Priorizar obras de logística', { eco: 4, cash: -5, cong: 2 }, 'As obras começaram e o setor agradeceu.'),
    C('Negociar com os produtores uma trégua', { eco: 2, pop: 1 }, 'A fila andou, mas o problema voltará na próxima safra.'),
    D('Liberar benefícios fiscais em troca de apoio de campanha', { eco: 4, cash: 5, img: -6 }, 'O agro apoiou. O Ministério Público abriu um procedimento.', 9),
  ], inUF('mt', 'go', 'ms', 'pr', 'rs', 'sp', 'mg', 'ba', 'to')),
  E('industria_demissoes', ANY, 'est', 'Fábrica anuncia demissões em massa', 'Uma grande indústria da região quer fechar a planta e demitir centenas. Sindicato e prefeitos correm até você.', [
    C('Negociar incentivos para manter os empregos', { eco: 3, pop: 3, cash: -5 }, 'A fábrica ficou. Os incentivos pesaram no caixa.'),
    C('Montar um programa de requalificação', { soc: 4, pop: 2, cash: -3 }, 'Parte dos trabalhadores foi realocada e a cidade respirou.'),
    C('Dizer que é decisão da empresa', { img: -3, eco: -2, pop: -3 }, 'Parecia sinceridade. Foi lido como indiferença.'),
  ], inUF('sp', 'mg', 'rj', 'rs', 'pr', 'sc', 'am', 'es')),
  E('litoral_ressaca', ANY, 'mun', 'Ressaca destrói orla', 'Uma ressaca forte derrubou quiosques e avançou sobre a orla. O turismo da alta temporada está em risco.', [
    C('Reconstruir a orla com recursos próprios', { eco: 3, pop: 3, cash: -6 }, 'A orla reabriu antes do feriado.'),
    C('Pedir recursos de emergência à União', { cong: 2, img: 1, cash: 3 }, 'A verba saiu, mas demorou.'),
    C('Aproveitar para remodelar o projeto da orla', { eco: 2, img: 3, cash: -4, cong: -1 }, 'Os moradores gostaram do plano. Alguns comerciantes, nem tanto.'),
  ], inUF('rj', 'es', 'ba', 'pe', 'ce', 'rn', 'pb', 'al', 'se', 'sc', 'sp', 'pr', 'ma', 'pa', 'ap')),
  E('floresta_queimada', ANY, 'est', 'Queimadas cobrem a região de fumaça', 'A fumaça fechou aeroportos e lotou hospitais. A imprensa internacional já filma tudo.', [
    C('Reforçar fiscalização e brigadas', { img: 4, soc: 2, cash: -5 }, 'As equipes apagaram os focos e a situação melhorou.'),
    C('Culpar o governo vizinho', { pop: 2, img: -3, cong: -2 }, 'Funcionou como discurso, mas não apagou foco algum.'),
    D('Fechar os olhos para os grandes produtores', { eco: 2, cash: 2, img: -9 }, 'Os grandes ficaram quietos. Os satélites, não.', 10),
  ], inUF('am', 'pa', 'ac', 'ro', 'rr', 'ap', 'mt', 'to', 'ma', 'ms')),
  E('fronteira', ANY, 'est', 'Pressão na fronteira', 'Contrabando e tráfico crescem na divisa. A população está assustada e pede mais polícia.', [
    C('Reforçar o policiamento de fronteira', { seg: 5, cash: -5, pop: 2 }, 'Apreensões bateram recorde. O orçamento sentiu.'),
    C('Fazer operação integrada com outros estados', { seg: 4, cong: 2, img: 2 }, 'A cooperação rendeu bons resultados.'),
    C('Pedir apoio das Forças Armadas', { seg: 4, img: -2, cong: 1 }, 'A tropa ajudou, mas a medida foi criticada por especialistas.'),
  ], inUF('ms', 'pr', 'rs', 'sc', 'ac', 'ro', 'rr', 'ap', 'am', 'mt', 'pa')),
  E('metropole_transito', ANY, 'mun', 'Caos no transporte da metrópole', 'Greve de ônibus e metrô deixa milhões a pé. O prefeito e o governo trocam acusações.', [
    C('Mediar a negociação entre a categoria e a empresa', { pop: 3, img: 3, cong: 1 }, 'O acordo saiu em 24 horas. Você ganhou prestígio.'),
    C('Defender a punição dos grevistas', { cong: 1, pop: -3, img: -2 }, 'A greve endureceu e a cidade parou mais um dia.'),
    C('Anunciar um bilhete único mais barato', { pop: 4, cash: -5, soc: 2 }, 'A medida foi popular, mas o rombo no caixa apareceu logo.'),
  ], inUF('sp', 'rj', 'mg', 'df', 'ba', 'pe', 'ce', 'rs', 'pr', 'go')),
]