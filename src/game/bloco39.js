// BLOCO 39: indústria e economia. Setores com humor próprio, lobbies que pedem favores, doações de campanha
// com dívida e risco de escândalo, e greves. Texto 100% fictício. Efeitos em pontos de atributo.
// sat = satisfação do setor (0 a 100, começa em 50). divida = favores devidos a quem doou.

// os setores e a satisfação deles vêm de sociedade.js (agro, industria, servicos, tecnologia, mineracao).
// aqui ficam o vínculo com o perfil do estado e o que o bloco 39 acrescenta.
export const ECO_IDS = ['agro', 'industria', 'servicos', 'tecnologia', 'mineracao']
export const TAG_SETOR = { agro: 'agro', pecuaria: 'agro', industria: 'industria', servicos: 'servicos', turismo: 'servicos', tecnologia: 'tecnologia', mineracao: 'mineracao', petroleo: 'mineracao' }

// pedidos de lobby: atender agrada o setor e cobra de outro lado; negar azeda o setor
export const PEDIDOS = {
  agro: [
    { titulo: 'Ruralistas pedem prazo maior para pagar dívidas', texto: 'A bancada do campo quer alongar as dívidas dos produtores depois da safra ruim.', ok: { cash: -2, pop: 0.5 }, no: { pop: -0.3 } },
    { titulo: 'Produtores querem afrouxar licença ambiental', texto: 'Uma associação rural pede licenças mais rápidas para abrir área de plantio.', ok: { img: -1, eco: 1 }, no: { eco: -0.3 } },
    { titulo: 'Cooperativas pedem estrada para escoar a safra', texto: 'As cooperativas dizem que a safra apodrece na porteira sem estrada boa.', ok: { cash: -3, eco: 1 }, no: { eco: -0.5 } },
  ],
  industria: [
    { titulo: 'Federação industrial pede redução de impostos', texto: 'A federação das indústrias ameaça cortar vagas se o imposto sobre a produção não cair.', ok: { cash: -3, eco: 1 }, no: { eco: -0.5 } },
    { titulo: 'Fábricas pedem proteção contra importados', texto: 'Um grupo de fábricas quer barreiras para o produto importado mais barato.', ok: { pop: -0.8, eco: 0.5 }, no: { eco: -0.4 } },
    { titulo: 'Polo industrial quer crédito para modernizar', texto: 'O polo pede linha de crédito barata para trocar máquinas antigas.', ok: { cash: -2, eco: 0.8 }, no: {} },
  ],
  tecnologia: [
    { titulo: 'Startups pedem incentivo fiscal para contratar', texto: 'Fundadores de startups pedem desconto no imposto de quem contrata programador.', ok: { cash: -2, eco: 0.8, img: 0.3 }, no: { img: -0.2 } },
    { titulo: 'Polo de tecnologia quer banda larga melhor', texto: 'O polo diz que a internet lenta afasta empresas e talentos.', ok: { cash: -2, eco: 0.5 }, no: { eco: -0.3 } },
    { titulo: 'Big techs pedem regra mais frouxa sobre dados', texto: 'Empresas de tecnologia pedem regras mais leves sobre dados dos usuários.', ok: { img: -1, eco: 0.5 }, no: { eco: -0.2 } },
  ],
  mineracao: [
    { titulo: 'Mineradoras pedem licença rápida para nova mina', texto: 'Uma mineradora promete mil empregos se a licença sair este ano.', ok: { img: -0.8, eco: 1.2 }, no: { eco: -0.4 } },
    { titulo: 'Empresas de energia pedem reajuste da tarifa', texto: 'As distribuidoras dizem que a tarifa não cobre mais os custos.', ok: { pop: -1, cash: 1 }, no: { cong: -0.3 } },
    { titulo: 'Petroleiras querem leilão de nova área', texto: 'O setor pede um leilão de áreas de exploração no litoral.', ok: { cash: 2, img: -0.5 }, no: { eco: -0.3 } },
  ],
  servicos: [
    { titulo: 'Lojistas pedem horário estendido e menos multa', texto: 'Associações de lojistas pedem regras mais leves para abrir aos domingos.', ok: { eco: 0.6, soc: -0.2 }, no: { pop: -0.2 } },
    { titulo: 'Shoppings e hotéis pedem ajuda após queda de movimento', texto: 'Hotéis, bares e shoppings pedem alívio de impostos por alguns meses.', ok: { cash: -2, pop: 0.5 }, no: { pop: -0.4 } },
    { titulo: 'Camelôs e comerciantes brigam por espaço', texto: 'Comerciantes formais e informais pedem que a prefeitura escolha um lado.', ok: { pop: 0.5, cong: -0.3 }, no: { pop: -0.3 } },
  ],
}

// efeitos de cada tipo de decisão, montados com o pedido ou com o setor
export function opsPara(tipo, setor, ped, cobranca) {
  if (tipo === 'lobby') {
    const p = PEDIDOS[setor][ped]
    return [
      { id: 'atender', name: 'Atender o pedido', icon: '🤝', desc: 'O setor fica satisfeito. Pode custar caixa ou imagem.', fx: { ...p.ok }, sat: 12, div: cobranca ? -9 : 0 },
      { id: 'negociar', name: 'Negociar metade', icon: '⚖️', desc: 'Custa um pouco e acalma parte do setor.', fx: { cash: -1 }, sat: 4, div: cobranca ? -1 : 0 },
      { id: 'negar', name: 'Negar', icon: '🚫', desc: cobranca ? 'Quem doou cobra caro: imagem cai.' : 'O setor fica contrariado.', fx: { ...p.no, ...(cobranca ? { img: -1.5 } : {}) }, sat: cobranca ? -14 : -9, div: cobranca ? -9 : 0 },
    ]
  }
  if (tipo === 'doacao') {
    return [
      { id: 'aceitar', name: 'Aceitar a doação', icon: '💰', desc: 'Entra caixa agora e o setor passa a esperar um favor.', fx: { cash: 3 }, sat: 4, div: 1, doa: 1 },
      { id: 'recusar', name: 'Recusar', icon: '🙅', desc: 'Mantém as mãos limpas e a imagem.', fx: { img: 0.5 }, sat: -3, div: 0 },
    ]
  }
  // greve
  return [
    { id: 'negociar', name: 'Abrir negociação', icon: '🤝', desc: 'Custa caixa, o setor volta ao trabalho.', fx: { cash: -2 }, sat: 16, div: 0 },
    { id: 'reprimir', name: 'Endurecer', icon: '🛑', desc: 'A greve acaba, a rua reclama.', fx: { pop: -2, cong: -1, img: -0.5 }, sat: -4, div: 0 },
    { id: 'esperar', name: 'Esperar passar', icon: '⏳', desc: 'A economia sente a paralisação.', fx: { eco: -1, pop: -0.5 }, sat: -2, div: 0 },
  ]
}
export const PEND_INFO = {
  lobby: { icon: '🕴️', padrao: 'negar' },
  doacao: { icon: '💼', padrao: 'recusar' },
  greve: { icon: '🪧', padrao: 'esperar' },
}
export const DOACOES = [
  (n) => `Empresários de ${n} oferecem uma doação generosa de campanha, sem pedir nada. Por enquanto.`,
  (n) => `Uma associação de ${n} quer apoiar o seu mandato com dinheiro e um jantar.`,
  (n) => `O presidente de uma federação de ${n} liga: "conte com a gente, e a gente conta com você".`,
]
export const GREVES = [
  (n) => `Trabalhadores de ${n} cruzaram os braços por salário e condições.`,
  (n) => `Uma paralisação em ${n} trava entregas e enche a pauta da imprensa.`,
  (n) => `Sindicatos de ${n} marcam greve geral da categoria.`,
]
export const ESCANDALO_DOACAO = 'Doações de campanha viram investigação: a imprensa liga o seu mandato a favores para empresas.'
