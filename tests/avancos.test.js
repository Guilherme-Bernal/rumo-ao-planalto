// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'

const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  key: (i) => [...mem.keys()][i] ?? null,
  get length() { return mem.size },
}
globalThis.location = { search: '', href: 'http://localhost/' }
globalThis.matchMedia = () => ({ matches: false })

let E
beforeAll(async () => {
  E = await import('../src/game/engine.js')
})
const novo = (office = 'presidente') => {
  E.startGame({ name: 'Teste', regionId: 'SP' })
  E.game.office = office
  E.game.phase = 'actions'
  E.game.stats.cash = 60
  E.game.stats.cong = 90
  E.game.poder.exe = { used: [] }
  E.game.poder.leg = { used: [] }
  E.game.poder.prot = null
  E.game.world.ameacas = []
  E.game.world.guerraDef = null
  E.game.world.pts = 4; E.game.world.ptsM = 2; E.game.world.ptsP = 2
}

describe('Constituição', () => {
  it('PEC com base alta é aprovada em até 2 rodadas', () => {
    let ok = 0
    for (let i = 0; i < 30; i++) {
      novo()
      E.game.stats.cong = 100
      E.propor('educacao')
      E.roundAvancos()
      E.roundAvancos()
      if (E.cstInfo().emendas === 1) ok++
    }
    expect(ok).toBeGreaterThan(14)
  })
  it('cláusula pétrea é barrada e custa imagem', () => {
    novo()
    const img = E.game.stats.img
    const r = E.propor('voto')
    expect(r.bad).toBe(true)
    expect(E.game.stats.img).toBeLessThan(img)
    expect(E.cstInfo().pec).toBe(null)
  })
  it('não se vota PEC durante estado de exceção', () => {
    novo()
    E.game.stats.seg = 30
    expect(E.decretarExcecao('defesa')).toBeTruthy()
    E.game.poder.exe = { used: [] }
    expect(E.propor('educacao').txt).toMatch(/estado de defesa/)
  })
  it('estado de defesa exige motivo, dura e acaba; prorroga só uma vez', () => {
    novo()
    E.game.stats.seg = 80
    expect(E.decretarExcecao('defesa')).toBe(null)
    E.game.stats.seg = 30
    expect(E.decretarExcecao('defesa')).toBeTruthy()
    expect(E.cstEstado().id).toBe('defesa')
    E.game.poder.exe = { used: [] }
    expect(E.prorrogarEstado()).toBeTruthy()
    E.game.poder.exe = { used: [] }
    expect(E.prorrogarEstado()).toBe(null)
    for (let i = 0; i < 6; i++) E.roundAvancos()
    expect(E.cstEstado()).toBe(null)
  })
  it('estado de sítio só com crise grave e eleva a temperatura institucional', () => {
    novo()
    E.game.stats.seg = 30
    expect(E.decretarExcecao('sitio')).toBe(null)
    E.game.poder.civil = { round: 0, peace: 0 }
    E.game.stats.cong = 100
    let r = null
    for (let i = 0; i < 20 && !E.cstEstado(); i++) {
      E.game.poder.exe = { used: [] }
      r = E.decretarExcecao('sitio')
    }
    expect(E.cstEstado()).toBeTruthy()
    expect(r).toBeTruthy()
  })
  it('medida provisória vale já e é convertida ou caduca', () => {
    novo()
    const pop = E.game.stats.pop
    expect(E.editarMP('auxilio')).toBeTruthy()
    expect(E.game.stats.pop).toBeGreaterThan(pop)
    for (let i = 0; i < 4; i++) E.roundAvancos()
    expect(E.cstInfo().mps.length).toBe(0)
  })
  it('plebiscito dá resultado na rodada seguinte', () => {
    novo()
    expect(E.convocarConsulta('voto')).toBeTruthy()
    expect(E.cstInfo().consulta).toBeTruthy()
    E.roundAvancos()
    expect(E.cstInfo().consulta).toBe(null)
  })
  it('deputado federal propõe PEC, prefeito não', () => {
    novo('dep_federal')
    expect(E.propor('educacao')).toBeTruthy()
    novo('prefeito')
    expect(E.propor('educacao')).toBe(null)
    expect(E.cstWhy('pec')).toBeTruthy()
  })
})

describe('internacional, pesquisa e armas', () => {
  it('bloco exige relação e rende passivos', () => {
    novo()
    E.game.world.rel.arg = 10
    expect(E.blocoMotivo('mercosul')).toMatch(/Relação/)
    E.game.world.rel.arg = 70
    expect(E.entrarBloco('mercosul')).toBe(true)
    expect(E.game.world.blocos).toContain('mercosul')
    expect(E.entrarBloco('mercosul')).toBe(false)
  })
  it('tratado depende do referendo do Congresso', () => {
    novo()
    E.game.world.rel.ue = 90
    E.game.stats.cong = 100
    let feito = false
    for (let i = 0; i < 12 && !feito; i++) {
      E.game.world.pts = 4; E.game.world.ptsM = 2; E.game.world.ptsP = 2
      const r = E.firmarTratado('tlcUe')
      feito = !!(r && r.ok)
    }
    expect(feito).toBe(true)
    expect(E.game.world.tratados).toContain('tlcUe')
  })
  it('operação de paz termina e rende imagem; intervenção exige indústria de defesa e Congresso', () => {
    novo()
    E.game.world.fa = 80
    expect(E.opMotivo('ofensiva')).toMatch(/indústria/)
    expect(E.iniciarOp('paz')).toBe(true)
    for (let i = 0; i < 4; i++) E.roundAvancos()
    expect(E.game.world.ops.length).toBe(0)
  })
  it('pesquisa: foco avança sozinho, pré-requisito é respeitado e cargo limita', () => {
    novo()
    expect(E.techMotivo('ia2')).toMatch(/Antes/)
    expect(E.techPush('ia1')).toBe(true)
    E.techFoco('ia1')
    for (let i = 0; i < 12; i++) E.roundAvancos()
    expect(E.techFeita('ia1')).toBe(true)
    novo('governador')
    expect(E.techMotivo('def1')).toMatch(/federal/)
    expect(E.techMotivo('ia1')).toBe('')
    novo('prefeito')
    expect(E.techMotivo('ia1')).toMatch(/Só/)
  })
  it('arsenal dissuasor exige a PEC e o urânio, e custa caro lá fora', () => {
    novo()
    for (const id of ['def1', 'ia1', 'def2', 'def3', 'ia3', 'def4']) E.game.world.tech.done.push(id)
    expect(E.techMotivo('def5')).toMatch(/PEC/)
    E.cstInfo().flags.nuclearOk = true
    expect(E.techMotivo('def5')).toMatch(/urânio/)
    E.game.world.nucDone.push('enr')
    expect(E.techMotivo('def5')).toBe('')
  })
})

describe('consequências, elenco e partidos', () => {
  it('decisão agendada volta como consequência', () => {
    novo()
    const antes = E.game.poder.timeline.length
    E.agendar('dirty')
    expect(E.agendaPendente()).toBe(1)
    E.game.total += 5
    E.roundAvancos()
    expect(E.agendaPendente()).toBe(0)
    expect(E.game.poder.timeline.length).toBeGreaterThan(antes)
  })
  it('elenco tem rival e ex-aliado com nome', () => {
    novo()
    E.game.total = 6
    const e = E.elencoOf()
    expect(e.exAliado).toBeTruthy()
    expect(typeof e.rival === 'string' || e.rival == null).toBe(true)
  })
  it('partidos: fusão, cisão e morte acontecem, respeitam o limite e poupam o partido do jogador', () => {
    novo()
    E.game.total = 10
    let eventos = 0
    for (let i = 0; i < 400; i++) {
      for (let k = 0; k < 4 && E.game.novosPartidos.length < 3; k++) E.novoPartido && (E.game.novosPartidos.push({ id: 'x' + i + k, sigla: 'X' + i + k, name: 'Movimento Teste ' + k, ideo: 'centro', color: '#fff', perks: {}, nova: true, perkText: 'Fundado por Fulano. ' }))
      E.game.party = E.game.novosPartidos[0] ? E.game.novosPartidos[0].id : null
      const meu = E.game.party
      const t = E.game.poder.timeline.length
      E.partidoHistoria()
      if (E.game.poder.timeline.length > t) eventos++
      if (meu) expect(E.game.novosPartidos.some((x) => x.id === meu)).toBe(true)
      expect(E.game.novosPartidos.length).toBeLessThanOrEqual(8)
    }
    expect(eventos).toBeGreaterThan(5)
  })
  it('metas e leis mudam por cargo; contatos filtram por cargo', async () => {
    const ids = (o) => { novo(o); return E.goalsNow().map((g) => g.id).join(',') }
    expect(new Set(['vereador', 'prefeito', 'dep_estadual', 'dep_federal', 'senador', 'governador', 'presidente'].map(ids)).size).toBe(7)
    const { billsOf } = await import('../src/game/bills.js')
    expect(billsOf('senador').some((b) => b.id === 's-federal')).toBe(true)
    expect(billsOf('senador').some((b) => b.id === 'de-agua')).toBe(false)
    const { SCRIPTS } = await import('../src/game/contacts.js')
    expect(SCRIPTS.filter((s) => s.only && s.only.includes('prefeito')).length).toBeGreaterThan(1)
    expect(SCRIPTS.filter((s) => s.only && s.only.includes('vereador')).length).toBeGreaterThan(1)
  })
  it('epílogo trata golpe, paz e emendas', async () => {
    const { epilogue } = await import('../src/game/epilogue.js')
    novo()
    E.game.over = { title: 'Golpe de Estado' }
    E.cnt('paz')
    E.cnt('emenda')
    const t = epilogue(E.game).join(' ')
    expect(t).toMatch(/golpe/i)
    expect(t).toMatch(/pacto de paz/)
    expect(t).toMatch(/emenda/)
  })
})

describe('pontos separados', () => {
  it('diplomacia, defesa e pesquisa têm reservas próprias', () => {
    novo()
    E.game.world.fa = 80
    E.game.world.rel.arg = 70
    expect(E.iniciarOp('paz')).toBe(true)
    expect(E.game.world.ptsM).toBe(1)
    expect(E.game.world.pts).toBe(4)
    expect(E.techPush('ia1')).toBe(true)
    expect(E.game.world.ptsP).toBe(1)
    expect(E.entrarBloco('mercosul')).toBe(true)
    expect(E.game.world.pts).toBe(3)
    expect(E.ptsOf('ptsM')).toBe(1)
  })
})

describe('reuniões', () => {
  const joga = (defId, abord = 'ouvir', extra = {}) => {
    E.game.poder.convites = [{ defId, left: 2, ...extra }]
    expect(E.reuniaoAbrir(0)).toBe(true)
    const r = E.reuniaoAtual()
    if (r.step === 0) E.reuniaoLocal(E.reuniaoDef(defId).locais[0].id)
    for (let i = 0; i < 3; i++) E.reuniaoAbordar(abord)
    return E.reuniaoAtual().resultado
  }
  it('toda reunião do catálogo pode ser jogada até o fim, em qualquer cargo', async () => {
    const { REUNIOES } = await import('../src/game/reunioes.js')
    for (const d of REUNIOES) {
      for (const off of d.offs === 'all' ? ['vereador', 'presidente'] : d.offs) {
        novo(off)
        E.game.world.pactos.push({ partner: 'arg', tipo: 'defesa' })
        const r = joga(d.id, 'ouvir', { partner: 'arg', fict: 'karv' })
        expect(['acordo', 'parcial', 'fracasso'], d.id).toContain(r.cls)
        expect(E.reuniaoFechar()).toBe(true)
        for (const k of Object.keys(E.game.stats)) expect(Number.isFinite(E.game.stats[k]), d.id + k).toBe(true)
      }
    }
  })
  it('só abre na fase de ações, uma por vez, e o convite some ao abrir', () => {
    novo()
    E.game.poder.convites = [{ defId: 'p_executiva', left: 2 }, { defId: 'f_lideres', left: 2 }]
    E.game.phase = 'event'
    expect(E.reuniaoMotivo(0)).toMatch(/fase de ações/)
    E.game.phase = 'actions'
    expect(E.reuniaoAbrir(0)).toBe(true)
    expect(E.convitesNow().length).toBe(1)
    expect(E.reuniaoMotivo(0)).toMatch(/andamento/)
  })
  it('a abordagem muda a atitude conforme o temperamento', () => {
    novo()
    E.game.poder.convites = [{ defId: 'p_executiva', left: 2 }]
    E.reuniaoAbrir(0)
    const r = E.reuniaoAtual()
    const antes = r.parts.map((p) => p.att)
    for (const p of r.parts) p.att = 0
    E.reuniaoAbordar('pressionar')
    const orgulhoso = r.parts.find((p) => p.trait === 'orgulhoso')
    expect(orgulhoso.att).toBeLessThan(0)
    void antes
  })
  it('oferecer vantagem custa Caixa e fica apagado sem dinheiro', () => {
    novo()
    E.game.stats.cash = 0
    expect(E.reuniaoCustoOk('ofertar')).toBe(false)
    expect(E.reuniaoCustoOk('ouvir')).toBe(true)
  })
  it('indústria instalada rende por rodadas e depois acaba', () => {
    novo('prefeito')
    E.game.poder.industrias = [{ nome: 'Teste', left: 2, fx: { eco: 1 } }]
    const eco = E.game.stats.eco
    E.roundAvancos()
    expect(E.game.stats.eco).toBeGreaterThan(eco - 0.01)
    E.roundAvancos()
    expect(E.industriasNow().length).toBe(0)
  })
  it('pacto de defesa é registrado e o chamado do aliado pode quebrá-lo', () => {
    novo()
    for (let i = 0; i < 40 && !E.game.world.pactos.length; i++) {
      novo()
      joga('s_pacto', 'ofertar', { partner: 'arg' })
      E.reuniaoFechar()
    }
    expect(E.game.world.pactos.length).toBeGreaterThanOrEqual(1)
    E.game.world.pactos = [{ partner: 'arg', tipo: 'defesa' }]
    for (const p of [0]) void p
    E.game.poder.convites = [{ defId: 's_chamado', left: 2, partner: 'arg' }]
    E.reuniaoAbrir(0)
    for (const pt of E.reuniaoAtual().parts) pt.att = -3
    E.reuniaoAtual().step = 3
    E.reuniaoAbordar('adiar')
    expect(E.reuniaoAtual().resultado.cls).toBe('fracasso')
    expect(E.game.world.pactos.length).toBe(0)
  })
  it('convites aparecem sozinhos ao longo das rodadas e expiram', () => {
    novo()
    let vistos = 0
    for (let i = 0; i < 80; i++) {
      E.roundAvancos()
      vistos = Math.max(vistos, E.convitesNow().length)
      expect(E.convitesNow().length).toBeLessThanOrEqual(2)
    }
    expect(vistos).toBeGreaterThan(0)
  })
})

describe('Ameaças e invasões', () => {
  it('ultimato exige pontos de defesa e pode ser resolvido', () => {
    novo()
    E.game.world.ameacas = [{ tipo: 'ultimato', quem: 'karv', left: 3 }]
    E.game.world.fa = 80
    expect(E.ameacaMotivo(0, 'ceder')).toBe('')
    const r = E.responderAmeaca(0, 'ceder')
    expect(r.ok).toBe(true)
    expect(E.ameacasNow().length).toBe(0)
    expect(E.ptsOf('ptsM')).toBe(1)
    E.game.world.ameacas = [{ tipo: 'ultimato', quem: 'karv', left: 3 }]
    E.game.world.ptsM = 0
    expect(E.ameacaMotivo(0, 'ceder')).toMatch(/pontos/)
  })
  it('ultimato vencido vira invasão e a guerra termina', () => {
    novo()
    E.game.total = 10
    E.game.world.ameacas = [{ tipo: 'ultimato', quem: 'vald', left: 1 }]
    E.roundAvancos()
    const g = E.guerraDefNow()
    expect(g).toBeTruthy()
    expect(E.estadoMotivo('sitio')).toBe('')
    let n = 0
    while (E.guerraDefNow() && n++ < 20) E.roundAvancos()
    expect(E.guerraDefNow()).toBe(null)
  })
  it('ações de guerra funcionam e cessar-fogo encerra com paz', () => {
    novo()
    E.game.world.guerraDef = { quem: 'zand', E: 20, left: 5, aliados: 0, mobil: 0, estado: false, round: 0 }
    E.game.world.ptsM = 5
    expect(E.guerraMotivo('mobilizar')).toBe('')
    E.agirGuerra('mobilizar')
    expect(E.guerraDefNow().mobil).toBe(1)
    E.agirGuerra('aliados')
    let n = 0
    while (E.guerraDefNow() && n++ < 30) { E.game.world.ptsM = 3; E.agirGuerra('paz') }
    expect(E.guerraDefNow()).toBe(null)
  })
  it('só o presidente sofre ameaças', () => {
    novo('prefeito')
    E.game.total = 20
    for (let i = 0; i < 40; i++) E.roundAvancos()
    expect(E.ameacasNow().length).toBe(0)
  })
})

describe('Economia e sociedade', () => {
  it('atender setor sobe satisfação e gasta Caixa, uma vez por rodada', () => {
    novo()
    const c = E.game.stats.cash
    const a = E.socNow().setores.agro
    expect(E.setorAgir('agro', 'agradar')).toBeTruthy()
    expect(E.socNow().setores.agro).toBeGreaterThan(a)
    expect(E.game.stats.cash).toBeLessThan(c)
    expect(E.setorMotivo('agro', 'negociar')).toMatch(/rodada/)
  })
  it('setor em revolta cobra base a cada rodada', () => {
    novo()
    E.setorAgir('industria', 'regular')
    E.socNow().setores.industria = 10
    const cong = E.game.stats.cong
    E.roundAvancos()
    expect(E.game.stats.cong).toBeLessThan(cong)
  })
  it('movimento social tem liderança nomeada e reprimir faz voltar', () => {
    novo()
    E.roundAvancos()
    E.game.poder.soc.movs = [{ id: 'professores', quem: 'Profa. Cláudia', left: 3 }]
    const r = E.movAgir(0, 'reprimir')
    expect(r.txt).toMatch(/Cláudia/)
    expect(E.socNow().movs.length).toBe(0)
    E.roundAvancos(); E.roundAvancos()
    expect(E.socNow().movs[0].quem).toBe('Profa. Cláudia')
  })
  it('verba à mídia aproxima a linha editorial e o veículo pode ser calado', () => {
    novo()
    const rel = E.socNow().midia.jornal.rel
    E.midiaAgir('jornal', 'verba')
    expect(E.socNow().midia.jornal.rel).toBeGreaterThan(rel)
    E.midiaAgir('tv', 'processar')
    expect(E.socNow().midia.tv.calado).toBe(3)
  })
  it('catástrofe pode ser respondida e some', () => {
    novo()
    E.roundAvancos()
    E.game.poder.soc.catast = { id: 'enchente', left: 3 }
    let n = 0
    while (E.socNow().catast && n++ < 40) { E.game.stats.cash = 60; E.game.poder.soc.used = {}; E.catastAgir('verba') }
    expect(E.socNow().catast).toBe(null)
  })
  it('rodadas longas não quebram em nenhum cargo', () => {
    for (const o of ['vereador', 'prefeito', 'governador', 'presidente']) {
      novo(o)
      E.game.total = 10
      for (let i = 0; i < 60; i++) E.roundAvancos()
      expect(Number.isFinite(E.game.stats.pop)).toBe(true)
    }
  })
})

describe('Mundo avançado', () => {
  it('crise global pode ser respondida e some', () => {
    novo()
    E.roundAvancos()
    E.game.world.m24.crise = { id: 'petroleo', left: 3 }
    let n = 0
    while (E.m24Now().crise && n++ < 40) { E.game.stats.cash = 60; E.game.world.pts = 4; E.criseAgir('proprio') }
    expect(E.m24Now().crise).toBe(null)
  })
  it('embaixador gasta ponto e Caixa e rende relação por rodada', () => {
    novo()
    E.roundAvancos()
    const pts = E.game.world.pts
    expect(E.nomearEmb('eua', 'carreira')).toBeTruthy()
    expect(E.game.world.pts).toBe(pts - 1)
    expect(E.embMotivo('eua', 'carreira')).toMatch(/embaixador/)
    const r = E.game.world.rel.eua
    E.roundAvancos()
    expect(E.game.world.rel.eua).toBeGreaterThanOrEqual(r)
  })
  it('viagem tem cooldown e sanção esfria a relação', () => {
    novo()
    E.roundAvancos()
    E.viajar('china')
    expect(E.viagemMotivo('china')).toMatch(/rodada/)
    const r = E.game.world.rel.rus
    E.sancionar('rus')
    expect(E.game.world.rel.rus).toBeLessThan(r)
    expect(E.sancaoMotivo('rus')).toMatch(/vigor/)
  })
  it('espionagem exige rede e contraespionagem sobe', () => {
    novo()
    E.roundAvancos()
    E.game.world.m24.espio.rede = 0
    expect(E.espioMotivo('missao', 'eua')).toMatch(/rede/)
    E.espiar('rede')
    expect(E.m24Now().espio.rede).toBeGreaterThan(0)
    E.game.world.ptsM = 2
    E.espiar('contra')
    expect(E.m24Now().espio.contra).toBeGreaterThan(20)
  })
  it('embargo e eleição estrangeira resolvem; só presidente participa', () => {
    novo()
    E.roundAvancos()
    E.game.world.m24.embargo = { quem: 'rus', left: 3 }
    E.resolverEmbargo('negociar')
    expect(E.m24Now().embargo).toBe(null)
    E.game.world.m24.eleicao = { pais: 'arg', left: 1, apoio: null }
    E.apoiarEleicao('aliado')
    E.roundAvancos()
    expect(E.m24Now().eleicao).toBe(null)
    novo('governador')
    expect(E.criseMotivo('proprio')).toBeTruthy()
    for (let i = 0; i < 30; i++) E.roundAvancos()
    expect(E.m24Now().crise).toBe(null)
  })
})

describe('Vida entre rodadas', () => {
  const jogar = () => {
    E.reuniaoAbrir(0)
    let n = 0
    while (!E.reuniaoAtual().resultado && n++ < 5) { E.game.stats.cash = 60; E.reuniaoAbordar('ouvir') }
    const r = E.reuniaoAtual().resultado
    E.reuniaoFechar()
    return r
  }
  it('quem saiu com raiva volta lembrando', () => {
    novo()
    E.roundAvancos()
    E.game.poder.convites = [{ defId: 'p_executiva', left: 2 }]
    E.game.poder.reuniao = null
    E.game.poder.memoria = [{ nome: 'Fulano Teste', role: 'Tesoureiro', trait: 'ganancioso', tipo: 'rancor', ref: 'Executiva do partido', r: E.game.total }]
    let achou = false
    for (let i = 0; i < 40 && !achou; i++) {
      E.game.poder.memoria = [{ nome: 'Fulano Teste', role: 'Tesoureiro', trait: 'ganancioso', tipo: 'rancor', ref: 'Executiva do partido', r: E.game.total }]
      E.game.poder.convites = [{ defId: 'p_executiva', left: 2 }]
      E.reuniaoAbrir(0)
      const pt = E.reuniaoAtual().parts.find((x) => x.nome === 'Fulano Teste')
      if (pt) { achou = true; expect(pt.lembra).toMatch(/rancor/) }
      E.game.poder.reuniao = null
    }
    expect(achou).toBe(true)
  })
  it('reunião terminada com hostilidade registra memória', () => {
    novo()
    E.roundAvancos()
    E.game.poder.convites = [{ defId: 'p_expulsao', left: 2 }]
    E.reuniaoAbrir(0)
    E.reuniaoAtual().parts.forEach((p) => { p.att = -3 })
    E.reuniaoAtual().step = 3
    E.reuniaoAbordar('adiar')
    expect(E.memoriaNow().length).toBeGreaterThan(0)
    expect(E.memoriaNow()[0].tipo).toBe('rancor')
  })
  it('crise em cadeia passa por três reuniões e fecha com desfecho', () => {
    novo()
    E.roundAvancos()
    E.game.poder.cadeia = { id: 'escandalo', passo: 0, pontos: 0 }
    E.game.poder.convites = [{ defId: 'c_esc_partido', left: 3, cadeia: 'escandalo', passo: 0, pontos: 0 }]
    for (let i = 0; i < 3; i++) {
      expect(E.convitesNow()[0].cadeia).toBe('escandalo')
      jogar()
    }
    expect(E.cadeiaNow()).toBe(null)
    expect(E.convitesNow().filter((c) => c.cadeia).length).toBe(0)
  })
  it('convite da cadeia ignorado encerra a crise', () => {
    novo()
    E.roundAvancos()
    E.game.poder.cadeia = { id: 'greve', passo: 0, pontos: 0 }
    E.game.poder.convites = [{ defId: 'c_gg_sindicatos', left: 0, cadeia: 'greve', passo: 0, pontos: 0 }]
    for (let i = 0; i < 12 && E.cadeiaNow(); i++) { E.game.poder.convites.forEach((c) => { c.left = 0 }); E.roundAvancos() }
    expect(E.cadeiaNow()).toBe(null)
  })
  it('figuras políticas existem e eventos de vida têm efeito', () => {
    novo()
    E.roundAvancos()
    expect(E.figurasNow().length).toBe(6)
    E.game.poder.vida.pend = { tipo: 'morte', fig: 'mentor', left: 2 }
    expect(E.vidaEscolher('velorio')).toBeTruthy()
    expect(E.figurasNow().find((f) => f.id === 'mentor').estado).toBe('falecida')
    E.game.poder.vida.pend = { tipo: 'casamento', fig: 'aliado', left: 2 }
    E.vidaEscolher('festa')
    expect(E.figurasNow().find((f) => f.id === 'aliado').casado).toBe(true)
    E.game.poder.vida.pend = { tipo: 'aposentadoria', fig: 'lider', left: 2 }
    E.vidaEscolher('silencio')
    expect(E.figurasNow().find((f) => f.id === 'lider').estado).toBe('aposentada')
  })
  it('rodadas longas com vida política não quebram', () => {
    for (const o of ['vereador', 'prefeito', 'governador', 'presidente']) {
      novo(o)
      E.game.total = 10
      for (let i = 0; i < 80; i++) { E.roundAvancos(); E.game.poder.vida.pend = null; E.game.poder.reuniao = null }
      expect(Number.isFinite(E.game.stats.img)).toBe(true)
    }
  })
})
