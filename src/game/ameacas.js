// BLOCO 22: ameaças externas (ultimato, ciberataque, bloqueio) e guerra defensiva. Os agressores são países fictícios.
export const INIMIGOS = [
  { id: 'karv', name: 'Karvênia', ico: '🛡️' },
  { id: 'vald', name: 'Valdória', ico: '⚔️' },
  { id: 'zand', name: 'Zandora', ico: '🏔️' },
]

// Cada resposta tem chance base (p), custo e dois desfechos. need: exigência para o botão ficar ativo.
export const AMEACAS = {
  ultimato: {
    icon: '📜', nome: (q) => `Ultimato de ${q}`, left: 3, ongoing: { seg: -0.3, img: -0.1 },
    desc: (q) => `${q} exige concessões na fronteira e dá poucos dias para responder. Se o prazo vencer sem resposta, a crise pode virar invasão.`,
    resp: [
      { id: 'ceder', icon: '🤝', name: 'Ceder em parte', desc: 'Aceita parte das exigências para evitar a guerra.', p: 1, ok: { t: 'Você cedeu em parte e a crise esfriou, ao custo de imagem.', fx: { img: -2.5, pop: -1.5, seg: 0.5 } } },
      { id: 'mobilizar', icon: '🪖', name: 'Mobilizar as tropas', desc: 'Mostra força na fronteira.', cash: 2, need: { fa: 45 }, p: 0.6, pFa: 0.004, ok: { t: 'A demonstração de força funcionou e o vizinho recuou.', fx: { seg: 1.5, img: 1, pop: 1 }, fa: 3 }, bad: { t: 'O blefe falhou e o vizinho endureceu.', fx: { seg: -1, cash: -0.5 }, escalate: true } },
      { id: 'onu', icon: '🇺🇳', name: 'Levar o caso à ONU', desc: 'Busca mediação internacional.', p: 0.55, pRel: { onu: 0.004 }, ok: { t: 'A ONU mediou e o ultimato foi retirado.', fx: { img: 2, seg: 0.8 } }, bad: { t: 'A ONU demorou e o prazo seguiu correndo.', fx: { img: -0.5 } } },
      { id: 'recusar', icon: '✋', name: 'Recusar e esperar', desc: 'Não cede e aposta que é blefe.', p: 0.35, ok: { t: 'Era blefe. Você saiu fortalecido.', fx: { img: 2, pop: 1.5 } }, bad: { t: 'Não era blefe. A invasão começou.', fx: { seg: -2, pop: -1 }, escalate: true } },
    ],
  },
  ciber: {
    icon: '💻', nome: (q) => `Ciberataque de ${q}`, left: 2, ongoing: { eco: -0.6, seg: -0.5, img: -0.3 },
    desc: (q) => `Hackers ligados a ${q} derrubam sistemas de bancos, energia e governo. Cada rodada de apagão custa caro.`,
    resp: [
      { id: 'reforcar', icon: '🛡️', name: 'Reforçar a defesa cibernética', desc: 'Equipes de resposta e backups.', cash: 2, p: 0.65, pTech: { ia3: 0.2, esp2: 0.05 }, ok: { t: 'Os sistemas foram restaurados e o ataque barrado.', fx: { seg: 1.5, img: 1 } }, bad: { t: 'A restauração demorou mais do que o previsto.', fx: { eco: -0.5 } } },
      { id: 'contra', icon: '⚡', name: 'Contra-atacar', desc: 'Resposta cibernética direta.', cash: 1, need: { tech: 'ia3' }, p: 0.55, ok: { t: 'O contra-ataque calou os hackers e rendeu respeito.', fx: { seg: 1, img: 0.5, pop: 1 } }, bad: { t: 'O contra-ataque escalou a crise.', fx: { img: -1.5, eco: -0.4 } } },
      { id: 'publico', icon: '📣', name: 'Denunciar publicamente', desc: 'Culpa o país agressor diante do mundo.', p: 0.6, ok: { t: 'A denúncia isolou o agressor.', fx: { img: 2 } }, bad: { t: 'Sem provas, a denúncia virou constrangimento.', fx: { img: -1.5 } } },
    ],
  },
  bloqueio: {
    icon: '🚢', nome: (q) => `Bloqueio naval de ${q}`, left: 4, ongoing: { eco: -0.9, cash: -0.4 },
    desc: (q) => `Navios de ${q} fecham portos e rotas de exportação. A economia sente a cada rodada.`,
    resp: [
      { id: 'escolta', icon: '⚓', name: 'Escoltar os navios', desc: 'A Marinha abre passagem.', cash: 2, need: { fa: 50 }, p: 0.55, pFa: 0.003, ok: { t: 'A escolta rompeu o bloqueio.', fx: { eco: 1.5, img: 1, seg: 1 }, fa: 3 }, bad: { t: 'Houve confronto no mar e baixas.', fx: { pop: -1.5, seg: -1 }, escalate: true } },
      { id: 'negociar', icon: '🧳', name: 'Negociar a abertura', desc: 'Concede algo e reabre as rotas.', cash: 1, p: 0.7, ok: { t: 'As rotas foram reabertas em troca de concessões.', fx: { eco: 1, img: -1 } }, bad: { t: 'A conversa não avançou.', fx: { img: -0.5 } } },
      { id: 'ponte', icon: '✈️', name: 'Ponte aérea e portos alternativos', desc: 'Contorna o bloqueio com custo alto.', cash: 3, p: 0.8, ok: { t: 'A logística alternativa segurou a economia até o fim do bloqueio.', fx: { eco: 1.2, pop: 0.5 } }, bad: { t: 'O custo da operação pesou no caixa.', fx: { cash: -1 } } },
    ],
  },
}

// Ações durante a guerra defensiva (usam pontos de defesa)
export const GUERRA_ACOES = [
  { id: 'mobilizar', icon: '🪖', name: 'Mobilizar reservistas', desc: 'Mais soldados na linha de frente (até 3 vezes).', cash: 2 },
  { id: 'aliados', icon: '🤝', name: 'Chamar os aliados', desc: 'Aliados de pacto de defesa chegam. Sem pacto, a ONU tenta mediar.', cash: 0 },
  { id: 'estado', icon: '🏛️', name: 'Pedir ao Congresso o estado de guerra', desc: 'Precisa de autorização do Congresso (art. 49, II e 84, XIX). Dá mais força, mas esquenta a política.', cash: 0 },
  { id: 'contra', icon: '🎯', name: 'Contra-ofensiva', desc: 'Ataque para tomar a iniciativa. Arriscado.', cash: 2 },
  { id: 'paz', icon: '🕊️', name: 'Propor cessar-fogo', desc: 'Quanto mais fraco o inimigo, melhores os termos.', cash: 0 },
]
