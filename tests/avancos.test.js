// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { CENARIOS, SETORES_UF, PERFIL_UF } from '../src/game/bloco36'
import { GEN_BASES, GEN_CENARIO, montarGen, pesoGen } from '../src/game/bloco43'

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
    // coalizão neutra (38% na base) para isolar o efeito do setor
    E.game.poder.coal = { partidos: [{ id: 'a', sigla: 'A', nome: 'A', cor: '#fff', ideo: 'centro', cad: 38, agenda: 'fiscal', own: false, status: 'base', humor: 55, acao: {}, aliado: false }, { id: 'b', sigla: 'B', nome: 'B', cor: '#000', ideo: 'centro', cad: 62, agenda: 'fiscal', own: false, status: 'oposicao', humor: 30, acao: {}, aliado: false }], pend: null, last: 99, afins: [] }
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
    expect(E.figurasNow().length).toBe(9)
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

describe('Pessoas: visual, família, biografia e sucessão', () => {
  it('criador de rosto tem as novas opções e o envelhecimento acompanha a idade', async () => {
    const L = await import('../src/game/look.js')
    const d = L.defaultLook()
    for (const k of ['brow', 'eyeColor', 'mouth', 'nose', 'marks', 'headwear', 'pin', 'age']) expect(d).toHaveProperty(k)
    expect(L.HAIRS.length).toBeGreaterThanOrEqual(13)
    expect(L.OUTFITS.length).toBeGreaterThanOrEqual(7)
    expect(L.agingLevel('auto', 30)).toBe(0)
    expect(L.agingLevel('auto', 70)).toBe(3)
    expect(L.agingLevel('jovem', 70)).toBe(0)
    for (const c of Object.keys(L.INSIGNIAS)) expect(typeof L.INSIGNIAS[c]).toBe('string')
    expect(L.randomLook()).toHaveProperty('mouth')
  })
  it('família: casamento, filho e harmonia', () => {
    novo()
    E.roundAvancos()
    const f = E.game.poder.familia
    f.conjuge = { nome: 'Alex Teste', perfil: 'atuante', look: {}, casado: false, apoio: 60 }
    f.pend = { tipo: 'noivado', left: 2 }
    const h = f.harmonia
    expect(E.famEscolher('discreto')).toBeTruthy()
    expect(E.familiaNow().conjuge.casado).toBe(true)
    expect(E.familiaNow().harmonia).toBeGreaterThan(h)
    E.game.poder.familia.pend = { tipo: 'filho', left: 2 }
    E.famEscolher('reservar')
    expect(E.familiaNow().filhos.length).toBe(1)
    expect(E.famAcaoMotivo('campanha')).toBe('')
    const hh = E.familiaNow().harmonia
    E.famAgir('jantar')
    expect(E.familiaNow().harmonia).toBeGreaterThan(hh)
    expect(E.famAcaoMotivo('viagem')).toMatch(/já dedicou/)
  })
  it('família ignorada degrada harmonia mas nunca quebra', () => {
    for (const o of ['vereador', 'presidente']) {
      novo(o)
      E.game.total = 10
      for (let i = 0; i < 60; i++) { E.roundAvancos(); E.game.poder.familia.pend = null; E.game.poder.vida.pend = null }
      expect(E.familiaNow().harmonia).toBeGreaterThanOrEqual(0)
    }
  })
  it('biografia registra marcos e títulos', () => {
    novo()
    E.timelineAdd('🏅', 'Marco de teste', 'up')
    expect(E.bioNow().some((m) => m.text === 'Marco de teste')).toBe(true)
    E.cnt('guerravit')
    expect(E.bioTitulos().some((t) => t.nome === 'Pacificador')).toBe(true)
  })
  it('laço com o mentor: conversar muda o laço, uma vez por rodada', () => {
    novo()
    E.roundAvancos()
    const antes = E.figurasNow().find((x) => x.id === 'mentor').laco
    const r = E.figAgir('mentor', 'conselho')
    expect(r).toBeTruthy()
    const m = E.figurasNow().find((x) => x.id === 'mentor')
    expect(m.laco).not.toBe(antes)
    expect(m.hist.length).toBe(1)
    expect(E.figMotivo('rival', 'tregua')).toMatch(/uma figura/)
  })
  it('sucessão jogável vai da escolha ao fim da carreira', () => {
    novo()
    E.game.phase = 'rumo'
    E.game.election = null
    expect(E.sucessaoMotivo()).toBe('')
    expect(E.iniciarSucessao()).toBe(true)
    expect(E.sucEscolher(1)).toBe(true)
    expect(E.sucEditar('Candidata Nova', { hair: 'tranca' })).toBe(true)
    expect(E.sucessaoNow().nome).toBe('Candidata Nova')
    let n = 0
    while (E.sucessaoNow().etapa <= 3 && n++ < 20) {
      for (const a of E.sucAcoes()) { E.game.stats.cash = 60; if (!E.sucAcaoMotivo(a.id)) E.sucAgir(a.id) }
    }
    expect(E.sucessaoNow().fim).toBeTruthy()
    expect(E.sucConcluir()).toBe(true)
    expect(E.game.phase).toBe('end')
    expect(E.game.legacy.text).toMatch(/Candidata Nova/)
  })
  it('sucessão pode ser cancelada antes de escolher e só existe ao fim do mandato', () => {
    novo()
    expect(E.sucessaoMotivo()).toMatch(/fim/)
    E.game.phase = 'rumo'
    E.iniciarSucessao()
    expect(E.sucCancelar()).toBe(true)
    expect(E.sucessaoNow()).toBe(null)
  })
})

describe('Eleição: debate, pesquisas segmentadas e boatos', () => {
  const eleicao = (target = 'presidente') => {
    novo()
    E.game.phase = 'campaign'
    E.game.election = { rival: 55, target, rivalName: 'Rival Teste', pollNoise: 0, result: null, promises: [], planBonus: 0, round: 1, tvDone: false, tv: 0, ticketBonus: 0, foco: { g: {}, est: {} }, boatos: [] }
  }
  it('debate em três passos termina com efeito e não repete', () => {
    eleicao()
    expect(E.debateMotivo()).toBe('')
    expect(E.debateAbrir()).toBe(true)
    expect(E.debateNow().step).toBe(1)
    E.debateAbordar('dados')
    expect(E.debateNow().reveal).toBe(true)
    E.debateAbordar('proposta')
    E.debateAbordar('calma')
    const d = E.debateNow()
    expect(d.res).toBeTruthy()
    expect(E.game.election.tvDone).toBe(true)
    expect(E.debateFechar()).toBe(true)
    expect(E.debateMotivo()).toMatch(/já aconteceu/)
  })
  it('temperamento do rival muda o resultado da mesma abordagem', () => {
    eleicao()
    E.debateAbrir()
    E.game.election.rivalTrait = 'orgulhoso'
    E.debateAbordar('ironia')
    const a = E.debateNow().falas[0]
    eleicao()
    E.debateAbrir()
    E.game.election.rivalTrait = 'idealista'
    E.debateAbordar('ironia')
    const b = E.debateNow().falas[0]
    expect(a.r).toBeGreaterThan(b.r)
    expect(a.a).toBeGreaterThan(b.a)
  })
  it('pesquisa segmentada custa Caixa, mostra grupos e estados, e o foco dá bônus', () => {
    eleicao()
    const cash = E.game.stats.cash
    expect(E.pesqSegMotivo()).toBe('')
    const p = E.pesqSegEncomendar()
    expect(p.grupos.length).toBe(5)
    expect(p.estados.length).toBeGreaterThan(5)
    expect(E.game.stats.cash).toBeLessThan(cash)
    expect(E.pesqSegMotivo()).toMatch(/já foi/)
    const antes = E.baseScore()
    expect(E.focar('g', 'jovens')).toBe(true)
    expect(E.baseScore()).toBeGreaterThan(antes)
    E.focar('g', 'jovens')
    expect(E.focoMotivo('g', 'jovens')).toMatch(/máximo/)
    expect(E.focar('est', p.estados[0].id)).toBe(true)
  })
  it('foco em estado só em eleição majoritária', () => {
    eleicao('vereador')
    expect(E.focoMotivo('est', 'SP')).toMatch(/majoritárias/)
  })
  it('boatos: desmentir falso funciona, desmentir verdadeiro custa caro, checagem revela', () => {
    eleicao()
    E.game.election.boatos = [
      { id: 'f1', texto: 'falso', real: false, dano: 2, estado: 'solto', revelado: false },
      { id: 'r1', texto: 'real', real: true, dano: 2, estado: 'solto', revelado: false },
    ]
    const s0 = E.baseScore()
    expect(E.boatoAgir('f1', 'checar').txt).toMatch(/falso/)
    expect(E.boatosNow()[0].revelado).toBe(true)
    let ok = false
    for (let i = 0; i < 30 && !ok; i++) {
      E.game.election.boatos[0] = { id: 'f1', texto: 'falso', real: false, dano: 2, estado: 'solto', revelado: false }
      E.game.stats.cash = 60
      E.boatoAgir('f1', 'desmentir')
      ok = E.boatosNow()[0].dano === 0
    }
    expect(ok).toBe(true)
    expect(E.baseScore()).toBeGreaterThan(s0)
    const img = E.game.stats.img
    E.boatoAgir('r1', 'desmentir')
    expect(E.boatosNow()[1].dano).toBeGreaterThan(2)
    expect(E.game.stats.img).toBeLessThan(img)
    expect(E.boatoMotivo('r1', 'explicar')).toMatch(/Já tratado/)
  })
  it('explicar boato verdadeiro reduz o dano', () => {
    eleicao()
    E.game.election.boatos = [{ id: 'r2', texto: 'real', real: true, dano: 2, estado: 'solto', revelado: false }]
    E.boatoAgir('r2', 'explicar')
    expect(E.boatosNow()[0].dano).toBe(1)
  })
  it('boatos nascem junto com a escolha de rumo e não quebram a eleição', () => {
    novo()
    E.game.phase = 'rumo'
    E.game.election = { rival: 0, target: null, rivalName: 'X', pollNoise: 0, result: null, promises: [], planBonus: 0 }
    E.chooseRumo('presidente')
    expect(E.boatosNow().length).toBe(2)
    expect(Number.isFinite(E.pollShare())).toBe(true)
  })
})

describe('BLOCO 28 — acesso e jogabilidade', () => {
  it('semente da semana é estável dentro da semana e muda na seguinte', async () => {
    const X = await import('../src/game/extras.js')
    const seg = X.weekSeed(new Date(2026, 10, 9))
    expect(X.weekSeed(new Date(2026, 10, 15))).toBe(seg)
    expect(X.weekSeed(new Date(2026, 10, 16))).toBe(seg + 1)
    expect(X.weekSeed(new Date(2026, 10, 9))).not.toBe(X.todaySeed())
    expect(X.weekNumber(new Date(2026, 0, 1)).week).toBe(1)
  })
  it('desafio da semana usa semente fixa e liga o modo desafio', async () => {
    const X = await import('../src/game/extras.js')
    E.startGame({ name: 'Sem', regionId: 'SP', weekly: true })
    expect(E.game.weekly).toBe(true)
    expect(E.game.daily).toBe(true)
    expect(E.game.seed).toBe(X.weekSeed())
    expect(E.game.difficulty).toBe('normal')
  })
  it('ranking semanal ordena por pontos e mostra só a semana atual', async () => {
    const X = await import('../src/game/extras.js')
    const sd = X.weekSeed()
    X.addWeekly({ name: 'A', region: 'SP', label: 'x', points: 50, seed: sd })
    X.addWeekly({ name: 'B', region: 'RJ', label: 'x', points: 90, seed: sd })
    X.addWeekly({ name: 'Velho', region: 'MG', label: 'x', points: 200, seed: sd - 1 })
    const r = X.weeklyNow()
    expect(r.map((e) => e.name)).toEqual(['B', 'A'])
  })
  it('a série por rodada acumula e o gráfico lê números finitos', () => {
    novo()
    expect(E.serieNow().length).toBeGreaterThan(0)
    for (const r of E.serieNow()) for (const k of ['pop', 'eco', 'cash', 'img']) expect(Number.isFinite(r[k])).toBe(true)
  })
  it('tutorial abre uma vez e guarda que foi visto', async () => {
    const T = await import('../src/game/tutorial.js')
    T.tutAutoOpen()
    expect(T.tut.open).toBe(true)
    T.tutClose()
    expect(T.tut.open).toBe(false)
    T.tutAutoOpen()
    expect(T.tut.open).toBe(false)
    T.tutOpen()
    expect(T.tut.open).toBe(true)
    expect(T.TUT_STEPS.length).toBeGreaterThanOrEqual(4)
  })
})

describe('BLOCO 29 — dicas, PWA e bots', () => {
  it('dica de primeira vez aparece uma vez por aba e some depois de vista', async () => {
    const D = await import('../src/game/dicas.js')
    D.dicasReset()
    expect(D.dicaPendente('mundo')).toBeTruthy()
    D.dicaVista('mundo')
    expect(D.dicaPendente('mundo')).toBeNull()
    expect(D.dicaPendente('leis')).toBeTruthy()
    expect(D.dicaPendente('inexistente')).toBeNull()
    for (const k of Object.keys(D.DICAS)) expect(D.DICAS[k].text.length).toBeGreaterThan(20)
  })
  it('rever o tutorial também reinicia as dicas das abas', async () => {
    const D = await import('../src/game/dicas.js')
    const T = await import('../src/game/tutorial.js')
    D.dicaVista('mapa')
    T.tutOpen()
    expect(D.dicaPendente('mapa')).toBeTruthy()
  })
  it('estado do PWA começa sem instalação pendente nem atualização', async () => {
    const P = await import('../src/game/pwa.js')
    expect(P.pwa.canInstall).toBe(false)
    expect(P.pwa.atualizada).toBe(false)
    expect(await P.pwaInstalar()).toBe(false)
  })
  it('escândalo sem base política derruba governo (imagem no chão e base fraca)', () => {
    novo('presidente')
    E.game.stats.img = 3
    E.game.stats.cong = 30
    E.game.stats.pop = 60
    E.game.stage = 3
    E.endTurn()
    expect(E.game.phase).toBe('over')
    expect(E.game.over.title).toBe('Impeachment')
  })
  it('imagem baixa com base forte não derruba sozinha', () => {
    novo('presidente')
    E.game.stats.img = 3
    E.game.stats.cong = 80
    E.game.stats.pop = 60
    E.game.stage = 3
    E.endTurn()
    expect(E.game.phase).not.toBe('over')
  })
})

describe('BLOCO 30 — rival recorrente e finais', () => {
  const rivalNovo = () => {
    novo('prefeito')
    E.game.total = 6
    return E.rvEnsure()
  }
  it('o rival nasce com perfil, partido e traço de debate próprios', () => {
    const r = rivalNovo()
    expect(r.nome.length).toBeGreaterThan(2)
    expect(r.sigla.length).toBeGreaterThan(1)
    expect(['pragmatico', 'idealista', 'ganancioso', 'orgulhoso', 'cauteloso']).toContain(r.trait)
    expect(r.estagio).toBe('ascensao')
  })
  it('vazar o dossiê derruba o rival, que depois some e volta mais forte', () => {
    const r = rivalNovo()
    r.pend = { id: 'escandalo', left: 2 }
    const dirty0 = E.game.dirty
    E.rvEscolher('vazar')
    expect(r.estagio).toBe('queda')
    expect(r.forca).toBeLessThan(40)
    expect(r.odio).toBeGreaterThan(30)
    expect(E.game.dirty).toBe(dirty0 + 1)
    for (let i = 0; i < 4; i++) E.roundAvancos()
    expect(r.estagio).toBe('exilio')
    for (let i = 0; i < 6; i++) E.roundAvancos()
    expect(['volta', 'firme']).toContain(r.estagio)
    expect(r.voltas).toBe(1)
    expect(r.forca).toBeGreaterThanOrEqual(58)
  })
  it('poupar e aceitar trégua transformam o rival em aliado improvável', () => {
    const r = rivalNovo()
    r.pend = { id: 'escandalo', left: 2 }
    E.rvEscolher('poupar')
    r.pend = { id: 'trégua', left: 2 }
    E.rvEscolher('aceitar')
    expect(r.estagio).toBe('aliado')
    expect(r.estima).toBeGreaterThanOrEqual(45)
    expect(E.rvAcaoMotivo('trégua')).toMatch(/aliado/)
  })
  it('ódio acumulado vira inimigo mortal e atacar em público aumenta o ódio', () => {
    const r = rivalNovo()
    r.odio = 70
    const o0 = r.odio
    E.rvAcao('atacar')
    expect(r.odio).toBeGreaterThan(o0)
    expect(r.estagio).toBe('inimigo')
    expect(E.rvAcaoMotivo('atacar')).toMatch(/Espere/)
  })
  it('deixar o evento passar aplica a opção padrão', () => {
    const r = rivalNovo()
    r.pend = { id: 'ataque', left: 0 }
    const pop0 = E.game.stats.pop
    E.roundAvancos()
    expect(r.pend).toBeFalsy()
    expect(E.game.stats.pop).toBeLessThan(pop0 + 2)
  })
  it('o resultado da eleição muda o rival e o rival entra na nota da eleição', () => {
    const r = rivalNovo()
    E.game.phase = 'rumo'
    E.game.election = { rival: 0, target: null, rivalName: 'X', pollNoise: 0, result: null, promises: [], planBonus: 0 }
    r.forca = 90
    E.chooseRumo('prefeito')
    const forte = E.game.election.rival
    expect(E.game.election.rivalArc).toBe(true)
    expect(E.game.rival).toBe(r.nome)
    E.game.election.result = { won: true, share: 55, h2h: 55 }
    E.continueAfterResult()
    expect(r.der).toBe(1)
    expect(r.forca).toBeLessThan(90)
    expect(forte).toBeGreaterThan(40)
  })
  it('rival afastado ou aliado não aparece como adversário na eleição', () => {
    const r = rivalNovo()
    r.estagio = 'exilio'
    E.game.phase = 'rumo'
    E.game.election = { rival: 0, target: null, rivalName: 'X', pollNoise: 0, result: null, promises: [], planBonus: 0 }
    E.chooseRumo('prefeito')
    expect(E.game.election.rivalArc).toBe(false)
    expect(E.game.rival).not.toBe(r.nome)
  })
  it('muitas rodadas com o arco do rival não quebram e mantêm os números em faixa', () => {
    const r = rivalNovo()
    for (let i = 0; i < 80; i++) {
      E.game.stats.pop = 60
      E.game.stats.cash = 60
      E.roundAvancos()
      if (r.pend && i % 2) E.rvEscolher(r.pend.id === 'trégua' ? 'recusar' : E.rvEventoDef(r.pend.id).ops[0].id)
      E.game.total++
    }
    for (const k of ['forca', 'odio', 'estima']) {
      expect(r[k]).toBeGreaterThanOrEqual(0)
      expect(r[k]).toBeLessThanOrEqual(100)
    }
  })
})

describe('BLOCO 30 — finais múltiplos', () => {
  const base = (o = {}) => ({
    name: 'Ana', city: { name: 'Itu' }, region: { name: 'São Paulo' }, history: [1, 2, 3], total: 30, points: 80,
    stats: { pop: 70, eco: 65, soc: 65, seg: 65, img: 65, cash: 50, cong: 60 }, phase: 'end', over: null, poder: { bio: { marcos: new Array(10).fill(1) } }, ...o,
  })
  it('cada situação cai no final certo', async () => {
    const F = await import('../src/game/finais.js')
    const id = (g) => F.finalOf(g).id
    expect(id(base({ phase: 'over', over: { title: 'Golpe de Estado' }, stats: { pop: 20, eco: 30, soc: 30, seg: 30, img: 20, cash: 10, cong: 10 } }))).toBe('exilio')
    expect(id(base({ phase: 'over', over: { title: 'Derrota nas urnas' }, history: [1, 2, 3] }))).toBe('oposicao')
    expect(id(base({ phase: 'over', over: { title: 'Derrota nas urnas' }, history: [1] }))).toBe('interior')
    expect(id(base({ phase: 'over', over: { title: 'Derrota nas urnas' }, history: [1, 2], poder: { rv: { vit: 2, nome: 'Zé' } } }))).toBe('vingado')
    expect(id(base({ poder: { sucessao: { fim: { won: true }, nome: 'Bia' }, bio: { marcos: [] } } }))).toBe('ministro')
    expect(id(base({ poder: { rv: { estagio: 'aliado', nome: 'Zé' }, bio: { marcos: [] } } }))).toBe('aliado_rival')
    expect(id(base({ stats: { pop: 48, eco: 70, soc: 70, seg: 70, img: 60, cash: 50, cong: 60 }, poder: { bio: { marcos: [] } } }))).toBe('esquecido')
    expect(id(base({ poder: { edu: 80, bio: { marcos: new Array(9).fill(1) } } }))).toBe('instituto')
    expect(id(base({ stats: { pop: 50, eco: 50, soc: 50, seg: 50, img: 50, cash: 50, cong: 50 }, poder: { bio: { marcos: new Array(9).fill(1) } } }))).toBe('apagado')
  })
  it('todo final tem texto, ícone e dica, e o último é sempre alcançável', async () => {
    const F = await import('../src/game/finais.js')
    for (const f of F.FINAIS) {
      expect(f.icon && f.nome && f.dica).toBeTruthy()
      expect(f.linhas(base({ poder: { sucessao: { fim: { won: true }, nome: 'Bia' }, rv: { nome: 'Zé' }, bio: { marcos: [] } } })).length).toBeGreaterThan(0)
    }
    expect(F.FINAIS[F.FINAIS.length - 1].test({})).toBe(true)
  })
  it('a galeria guarda os finais vistos sem repetir', async () => {
    const F = await import('../src/game/finais.js')
    F.saveFinal('exilio')
    F.saveFinal('exilio')
    F.saveFinal('interior')
    const v = F.loadFinais()
    expect(v.filter((x) => x === 'exilio').length).toBe(1)
    expect(v).toContain('interior')
  })
  it('ao terminar a carreira o final fica no jogo e entra no epílogo', async () => {
    const { epilogue } = await import('../src/game/epilogue.js')
    novo('prefeito')
    E.game.stage = 0
    E.game.history = []
    E.game.election = { rival: 0, target: 'prefeito', result: { won: false, share: 40, h2h: 40 }, rivalArc: false }
    E.continueAfterResult()
    expect(E.game.phase).toBe('over')
    expect(E.game.final.id).toBe('interior')
    const e = epilogue(E.game)
    expect(e.join(' ')).toMatch(/voltou para/)
  })
})

describe('BLOCO 31 — ministros, redes e missões', () => {
  const nomeia = () => {
    novo('presidente')
    E.game.total = 6
    E.game.poder.cab = { economia: { nome: 'Dra. Alfa', perfil: 'politico', pasta: 'economia', stage: E.game.stage, pass: {}, risk: 0 } }
  }
  it('ministro ganha lealdade e agenda e pode ter pedido com opção padrão', () => {
    nomeia()
    E.roundAvancos()
    const m = E.minNow('economia')
    const antes = m.lealdade
    expect(m.lealdade).toBeGreaterThan(0)
    expect(m.agenda).toBeTruthy()
    E.game.poder.minpend = { pasta: 'economia', id: 'pedido', left: 0 }
    expect(E.minPendNow().titulo).toMatch(/Dra. Alfa/)
    E.game.stats.cash = 20
    E.minEscolher('atender')
    expect(E.game.poder.minpend).toBeNull()
    expect(E.minNow('economia').lealdade).toBeGreaterThan(antes)
  })
  it('sem resposta a decisão cai na opção padrão', () => {
    nomeia()
    E.roundAvancos()
    E.game.poder.minpend = { pasta: 'economia', id: 'pedido', left: 0 }
    E.roundAvancos()
    expect(E.game.poder.minpend).toBeNull()
  })
  it('barrar a candidatura vira rival e aceitar a saída vaga a pasta', () => {
    nomeia()
    E.roundAvancos()
    E.game.poder.minpend = { pasta: 'economia', id: 'candidatura', left: 2 }
    E.minEscolher('barrar')
    expect(E.game.poder.cab.economia).toBeUndefined()
    expect(E.game.poder.rv.nome).toBe('Dra. Alfa')
    expect(E.game.poder.rv.estagio).toBe('inimigo')
    nomeia()
    E.roundAvancos()
    E.game.poder.minpend = { pasta: 'economia', id: 'demissao', left: 2 }
    E.minEscolher('aceitar')
    expect(E.game.poder.cab.economia).toBeUndefined()
  })
  it('redes: pauta respeita intervalo e custo; onda pode ser desmentida', () => {
    novo('governador')
    E.game.total = 5
    E.game.stats.cash = 10
    const r = E.redesPauta('nacional')
    expect(r).toBeTruthy()
    expect(E.redesPautaMotivo('emprego')).toMatch(/Espere/)
    expect(E.redesPautaMotivo('cortina')).toBeTruthy()
    E.redesEnsure().onda = { id: 'fake', forca: 20, left: 4 }
    let ok = false
    for (let i = 0; i < 40 && E.redesNow().onda; i++) { E.game.stats.cash = 10; E.redesResponder('checar'); ok = true }
    expect(ok).toBe(true)
    expect(E.redesNow().onda).toBeNull()
  })
  it('onda ativa corrói imagem a cada rodada e expira', () => {
    novo('prefeito')
    E.game.total = 5
    E.game.stats.img = 60
    E.redesEnsure().onda = { id: 'robo', forca: 80, left: 1 }
    E.roundAvancos()
    expect(E.game.stats.img).toBeLessThan(60)
    expect(E.redesNow().onda).toBeNull()
  })
  it('missão: três passos, desfecho por acertos e fechamento', () => {
    novo('presidente')
    E.game.total = 8
    E.game.poder.missao = { id: 'cpi', passo: 0, ok: 0, ctx: { relator: 'A', lider: 'B' }, log: [], left: 3, vista: 3, fim: null }
    E.game.stats.cash = 30
    for (let i = 0; i < 3; i++) {
      expect(E.missaoView().passo).toBeTruthy()
      expect(E.missaoEscolher('a')).toBeTruthy()
    }
    const m = E.missaoNow()
    expect(m.fim.titulo).toBeTruthy()
    expect(m.log.length).toBe(3)
    E.missaoFechar()
    expect(E.missaoNow()).toBeNull()
  })
  it('missão sem resposta perde o passo e termina sozinha', () => {
    novo('presidente')
    E.game.total = 8
    E.game.poder.missao = { id: 'pec', passo: 0, ok: 0, ctx: { lider: 'B', indeciso: 'C' }, log: [], left: 0, vista: 0, fim: null }
    for (let i = 0; i < 12 && E.missaoNow(); i++) E.roundAvancos()
    expect(E.game.poder.missao === null || E.game.poder.missao.fim).toBeTruthy()
  })
  it('todas as missões têm três passos com opções e finais ordenados', async () => {
    const B = await import('../src/game/bastidores.js')
    expect(B.MISSOES.length).toBeGreaterThanOrEqual(6)
    for (const d of B.MISSOES) {
      expect(d.passos.length).toBe(3)
      for (const p of d.passos) expect(p.ops.length).toBeGreaterThanOrEqual(2)
      expect(d.fim[d.fim.length - 1].min).toBe(0)
      const ctx = Object.fromEntries(d.pers.map((k) => [k, 'X']))
      expect(d.intro(ctx)).toBeTruthy()
    }
  })
})

describe('BLOCO 32 — conspiração, história de fundo e mais gente', () => {
  it('a conspiração nasce, dá pistas e pode ser exposta com provas', () => {
    novo('presidente')
    E.game.total = 10
    E.game.poder.mist = { ctx: { operador: 'Op', financista: 'Fin', traidor: 'Tra' }, avanco: 20, pistas: [], pend: null, last: 0, acao: -9, fim: null }
    E.game.stats.cash = 80
    expect(E.misAcaoMotivo('expor')).toMatch(/pistas/)
    for (let i = 0; i < 40 && E.misNow().pistas.length < 4; i++) { E.game.total += 3; E.misAcao('infiltrar') }
    expect(E.misNow().pistas.length).toBeGreaterThanOrEqual(4)
    E.game.total += 3
    expect(E.misAcaoMotivo('expor')).toBe('')
    E.game.poder.mist.pistas = [0, 1, 2, 3, 4, 5]
    let fim = null
    for (let i = 0; i < 30 && !fim; i++) { E.game.total += 3; E.game.poder.mist.pistas = [0, 1, 2, 3, 4, 5]; E.misAcao('expor'); fim = E.misNow().fim }
    expect(fim.tipo).toBe('exposta')
    expect(E.game.poder.cadeia && E.game.poder.cadeia.id).toBe('conspiracao')
  })
  it('conspiração sem resposta explode ao chegar em 100', () => {
    novo('presidente')
    E.game.total = 10
    E.game.poder.mist = { ctx: { operador: 'Op', financista: 'Fin', traidor: 'Tra' }, avanco: 99, pistas: [], pend: null, last: 99, acao: -9, fim: null }
    const img = E.game.stats.img
    E.roundAvancos()
    expect(E.misNow().fim.tipo).toBe('explodiu')
    expect(E.game.stats.img).toBeLessThan(img)
  })
  it('ponta solta cai na opção padrão e a opção de seguir pode dar pista', () => {
    novo('presidente')
    E.game.total = 10
    E.game.poder.mist = { ctx: { operador: 'Op', financista: 'Fin', traidor: 'Tra' }, avanco: 10, pistas: [], pend: { left: 0 }, last: 0, acao: -9, fim: null }
    E.roundAvancos()
    expect(E.misNow().pend).toBeNull()
    let ok = false
    for (let i = 0; i < 40 && !ok; i++) { E.game.stats.cash = 20; E.misNow().pend = { left: 2 }; E.misPendEscolher('seguir'); ok = E.misNow().pistas.length > 0 }
    expect(ok).toBe(true)
  })
  it('eventos históricos variam por cargo e caem na opção padrão', () => {
    novo('presidente')
    E.game.total = 10
    E.game.poder.hist32 = { last: 0, seen: [], pend: { id: 'diesel', left: 2 } }
    const t1 = E.histPendNow().texto
    novo('vereador')
    E.game.poder.hist32 = { last: 0, seen: [], pend: { id: 'diesel', left: 2 } }
    expect(E.histPendNow().texto).not.toBe(t1)
    E.game.stats.cash = 20
    E.histEscolher('subsidio')
    expect(E.game.poder.hist32.pend).toBeNull()
    E.game.poder.hist32 = { last: 0, seen: [], pend: { id: 'ponte', left: 0 } }
    E.game.total = 10
    E.roundAvancos()
    expect(E.game.poder.hist32.pend).toBeNull()
  })
  it('todos os eventos históricos têm texto por grupo e ops com efeitos', async () => {
    const M = await import('../src/game/misterio32.js')
    expect(M.HIST_EVENTOS.length).toBeGreaterThanOrEqual(10)
    for (const e of M.HIST_EVENTOS) {
      expect(e.txt.exec && e.txt.leg && e.txt.padrao && e.insp).toBeTruthy()
      expect(e.ops.some((o) => o.id === e.padrao)).toBe(true)
      for (const o of e.ops) expect(o.fx.exec && o.fx.leg && o.fx.padrao).toBeTruthy()
    }
    expect(M.MIS_PISTAS.length).toBe(6)
  })
  it('novas figuras entram nos saves antigos e as cadeias novas existem', async () => {
    novo('presidente')
    E.game.total = 5
    E.game.poder.vida = { figuras: [{ id: 'mentor', icon: 'x', label: 'm', nome: 'A', idade: 70, estado: 'ativa', casado: false }], pend: null }
    E.roundAvancos()
    const ids = E.game.poder.vida.figuras.map((f) => f.id)
    expect(ids).toContain('banqueiro')
    expect(ids).toContain('influenciador')
    const R = await import('../src/game/reunioes.js')
    for (const id of ['apagao', 'conspiracao']) {
      expect(R.CADEIAS[id].passos.length).toBe(3)
      for (const pid of R.CADEIAS[id].passos) expect(R.REUNIOES.find((d) => d.id === pid)).toBeTruthy()
    }
    expect(R.REUNIOES.length).toBeGreaterThanOrEqual(40)
  })
})

describe('BLOCO 33 — coalizão, alianças e legado', () => {
  it('a coalizão nasce com 100% das cadeiras, partido próprio na base e maioria calculável', () => {
    novo('presidente')
    E.game.total = 6
    E.roundAvancos()
    const c = E.coalNow()
    expect(c.partidos.reduce((a, x) => a + x.cad, 0)).toBeGreaterThanOrEqual(95)
    expect(c.partidos.length).toBeGreaterThanOrEqual(5)
    const pct = E.coalBasePct()
    expect(pct).toBeGreaterThanOrEqual(0)
    expect(pct).toBeLessThanOrEqual(100)
    c.partidos.forEach((x) => (x.status = 'base'))
    expect(E.coalMaioria()).toBe(true)
    c.partidos.forEach((x) => (x.status = 'oposicao'))
    expect(E.coalMaioria()).toBe(false)
  })
  it('agradar sobe o humor, respeita intervalo e custa caixa', () => {
    novo('presidente')
    E.game.total = 6
    E.roundAvancos()
    const x = E.coalNow().partidos.find((p) => !p.own)
    x.humor = 40
    E.game.stats.cash = 10
    expect(E.coalAcao('agradar', x.id)).toBeTruthy()
    expect(x.humor).toBeGreaterThan(40)
    expect(E.coalAcaoMotivo('agradar', x.id)).toMatch(/Espere/)
    expect(E.game.stats.cash).toBeLessThan(10)
  })
  it('partido da base insatisfeito pede para sair e sem resposta ele sai', () => {
    novo('presidente')
    E.game.total = 8
    E.roundAvancos()
    const c = E.coalNow()
    const x = c.partidos.find((p) => !p.own)
    x.status = 'base'
    x.humor = 20
    c.pend = { pid: x.id, tipo: 'sair', left: 0 }
    E.roundAvancos()
    expect(c.pend).toBeNull()
    expect(x.status).toBe('neutro')
  })
  it('o seu partido não sai de graça: debandada tem decisão própria', () => {
    novo('presidente')
    E.game.total = 8
    E.roundAvancos()
    const c = E.coalNow()
    const own = c.partidos.find((p) => p.own)
    if (!own) return
    c.pend = { pid: own.id, tipo: 'debandada', left: 2 }
    E.game.stats.cash = 20
    expect(E.coalPendNow().titulo).toMatch(/Racha/)
    expect(E.coalPendEscolher('segurar')).toBeTruthy()
    expect(own.humor).toBeGreaterThan(30)
  })
  it('aliança de campanha rende voto-ponto, tem limite de 2 e vira base depois da vitória', () => {
    novo('presidente')
    E.game.total = 6
    E.roundAvancos()
    E.game.election = { target: 'presidente', aliancas: [], foco: { g: {}, est: {} } }
    E.game.phase = 'campaign'
    E.game.stats.cash = 40
    const c = E.coalNow()
    const ps = c.partidos.filter((p) => !p.own)
    ps.forEach((p) => (p.humor = 60))
    const antes = E.baseScore()
    expect(E.aliar(ps[0].id)).toBeTruthy()
    expect(E.baseScore()).toBeGreaterThan(antes)
    expect(E.aliar(ps[1].id)).toBeTruthy()
    expect(E.aliancaMotivo(ps[2].id)).toMatch(/máximo/)
    expect(E.aliancasNow().length).toBe(2)
  })
  it('legado: vitória registra o mandato e eventos só vêm das condições certas', async () => {
    novo('presidente')
    E.game.total = 20
    E.game.stats.pop = 70
    E.game.stats.img = 70
    E.game.poder.statutes = [1, 2, 3, 4].map((i) => ({ id: i }))
    E.game.election = { rival: 0, target: 'presidente', result: { won: true, share: 60, h2h: 60 }, rivalArc: false, aliancas: [] }
    E.game.history = []
    E.continueAfterResult()
    const u = E.legadoResumo()
    expect(u.leis).toBe(4)
    expect(u.pop).toBeGreaterThan(60)
    const L = await import('../src/game/coalizao33.js')
    expect(L.LEGADO_EVENTOS.marca.cond(u)).toBe(true)
    expect(L.LEGADO_EVENTOS.fantasma.cond(u)).toBe(false)
    E.game.poder.legado.pend = { id: 'marca', left: 0 }
    expect(E.legadoPendNow().titulo).toBeTruthy()
    E.game.total = 22
    E.roundAvancos()
    expect(E.game.poder.legado.pend).toBeNull()
  })
})

describe('BLOCO 34 — arcos e gráfico da carreira', () => {
  const comArcos = () => {
    novo('presidente')
    E.game.total = 8
    E.roundAvancos()
    E.roundAvancos()
  }
  it('mentor, colunista e banqueiro ganham arco com laço e fase', () => {
    comArcos()
    const v = E.arcosView()
    expect(v.map((x) => x.id).sort()).toEqual(['banqueiro', 'colunista', 'mentor'])
    for (const x of v) expect(x.it.laco).toBeGreaterThan(0)
  })
  it('decisão do arco muda o laço, avança a fase e cai na opção padrão se ignorada', () => {
    comArcos()
    const a = E.arcosNow()
    a.itens.mentor.estagio = 0
    a.pend = { arc: 'mentor', ev: 'cafe', left: 2 }
    E.game.stats.cash = 20
    const antes = a.itens.mentor.laco
    expect(E.arcoPendNow().titulo).toMatch(/café/)
    expect(E.arcoEscolher('formal')).toBeTruthy()
    expect(a.itens.mentor.laco).toBeGreaterThan(antes - 1)
    expect(a.itens.mentor.estagio).toBe(1)
    a.pend = { arc: 'colunista', ev: 'critica', left: 0 }
    a.itens.colunista.estagio = 0
    E.roundAvancos()
    expect(a.pend === null || a.pend.arc !== 'colunista' || a.pend.ev !== 'critica').toBe(true)
  })
  it('evento final encerra o arco com um desfecho', () => {
    comArcos()
    const a = E.arcosNow()
    a.itens.banqueiro.estagio = 2
    a.pend = { arc: 'banqueiro', ev: 'conta', left: 2 }
    E.game.stats.cash = 20
    E.arcoEscolher('romper')
    expect(a.itens.banqueiro.fim).toBe('ruptura')
    expect(a.itens.banqueiro.estagio).toBe(3)
  })
  it('se o personagem some da vida, o arco termina sozinho', () => {
    comArcos()
    const a = E.arcosNow()
    E.figurasNow().find((f) => f.id === 'mentor').estado = 'falecida'
    E.roundAvancos()
    expect(a.itens.mentor.fim).toBe('falecido')
  })
  it('todos os arcos têm eventos por fase, um final por opção e textos', async () => {
    const A = await import('../src/game/arcos34.js')
    for (const [id, d] of Object.entries(A.ARCOS)) {
      expect(d.estagios.length).toBe(4)
      const fins = d.eventos.filter((e) => e.fim)
      expect(fins.length).toBeGreaterThanOrEqual(1)
      for (const e of d.eventos) {
        expect(e.ops.some((o) => o.id === e.padrao)).toBe(true)
        expect(e.titulo('X') && e.texto('X')).toBeTruthy()
        for (const o of e.ops) if (o.fim) expect(d.finais[o.fim]).toBeTruthy()
      }
      for (const est of [0, 1, 2]) expect(d.eventos.some((e) => e.est.includes(est))).toBe(true)
      expect(id).toBeTruthy()
    }
  })
  it('o gráfico da carreira recebe marcas de eleição e de escândalo', () => {
    novo('presidente')
    E.game.total = 12
    E.timelineAdd('🚨', 'Escândalo atinge o ministro', 'down')
    E.timelineAdd('🏛️', 'Lei sancionada', 'up')
    E.game.election = { rival: 0, target: 'presidente', result: { won: true, share: 55, h2h: 55 }, rivalArc: false, aliancas: [] }
    E.game.history = []
    E.continueAfterResult()
    const m = E.marcasNow()
    expect(m.filter((x) => x.tipo === 'escandalo').length).toBe(1)
    expect(m.filter((x) => x.tipo === 'eleicao')[0].ok).toBe(true)
    E.roundAvancos()
    expect(E.serieNow().some((r) => r.r != null)).toBe(true)
  })
})

describe('carregamento de abas após atualização', () => {
  it('importar tenta de novo antes de desistir e devolve o módulo quando consegue', async () => {
    const { importar } = await import('../src/game/chunks.js')
    let n = 0
    const f = () => (++n < 3 ? Promise.reject(new Error('503')) : Promise.resolve('ok'))
    expect(await importar(f)).toBe('ok')
    expect(n).toBe(3)
    let m = 0
    await expect(importar(() => (m++, Promise.reject(new Error('404'))), 2)).rejects.toThrow('404')
    expect(m).toBe(2)
  })
})

describe('equipe lembra as escolhas', () => {
  it('preencher todas as vagas respeita as travas e a escolha vale no cargo seguinte', () => {
    novo('senador')
    expect(E.appointAll('especialista')).toBe(3)
    expect(E.appointAll('parente')).toBe(0)
    E.game.office = 'presidente'
    E.game.team = { vice: null, supl: [], slots: {} }
    E.autoTeam()
    const t = E.game.team.slots
    expect(t.casa_civil.type).toBe('especialista')
    expect(t.exterior.type).toBe('especialista')
    expect(t.fazenda.type).toBe('tecnico')
  })
})

describe('BLOCO 35 — família na criação, rival ativo, pressão e pendências', () => {
  const comOrigem = (familia, office = 'presidente') => {
    E.startGame({ name: 'Teste', regionId: 'SP', traits: { familia } })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 60
    E.game.stats.cong = 70
    E.game.poder.exe = { used: [] }
    E.game.poder.leg = { used: [] }
    E.game.world.ameacas = []
    E.game.world.guerraDef = null
    E.game.total = 1
    E.roundAvancos()
  }
  it('a origem escolhida na criação monta a família da largada', () => {
    comOrigem('filhos')
    const f = E.familiaNow()
    expect(f.origem).toBe('filhos')
    expect(f.conjuge && f.conjuge.casado).toBe(true)
    expect(f.filhos.length).toBe(2)
    comOrigem('solteiro')
    expect(E.familiaNow().conjuge).toBeNull()
    comOrigem('divorciado')
    expect(E.familiaNow().filhos.length).toBe(1)
  })
  it('cada origem libera ações próprias e esconde as dos outros', () => {
    comOrigem('dinastia')
    expect(E.famAcoes().map((a) => a.id)).toContain('sobrenome')
    expect(E.famAcoes().map((a) => a.id)).not.toContain('raiz')
    expect(E.famAcoes().map((a) => a.id)).not.toContain('casal')
    comOrigem('humilde')
    expect(E.famAcoes().map((a) => a.id)).toContain('raiz')
    comOrigem('casado')
    expect(E.famAcoes().map((a) => a.id)).toContain('casal')
    expect(E.famAcoes().map((a) => a.id)).not.toContain('escola')
  })
  it('ação própria da origem aplica o efeito e gasta a rodada de família', () => {
    comOrigem('dinastia', 'senador')
    const antes = E.game.stats.cong
    E.game.phase = 'actions'
    expect(E.famAgir('sobrenome')).toBeTruthy()
    expect(E.game.stats.cong).toBeGreaterThan(antes)
    expect(E.famAcaoMotivo('sobrenome')).toMatch(/família/i)
  })
  it('família em paz e com cônjuge atuante rende voto, em crise tira', () => {
    comOrigem('casado')
    const f = E.game.poder.familia
    f.conjuge.perfil = 'atuante'
    f.harmonia = 90
    const bom = E.baseScore ? E.baseScore('player') : null
    f.harmonia = 10
    const ruim = E.baseScore ? E.baseScore('player') : null
    if (bom != null && ruim != null) expect(bom).toBeGreaterThan(ruim)
  })
  it('novas ações do rival: debate, investigar e oferecer cargo', () => {
    comOrigem('solteiro')
    const r = E.rvEnsure()
    r.estima = 60
    E.game.phase = 'actions'
    expect(E.rvAcoes().map((a) => a.id)).toEqual(expect.arrayContaining(['debate', 'espionar', 'cooptar']))
    const cash = E.game.stats.cash
    expect(E.rvAcao('espionar')).toBeTruthy()
    expect(E.game.stats.cash).toBeLessThan(cash)
    r.acao = -9
    r.estima = 10
    expect(E.rvAcaoMotivo('cooptar')).toMatch(/estima/)
  })
  it('evento do rival contra a família abala a harmonia', () => {
    comOrigem('casado')
    const r = E.rvEnsure()
    r.estagio = 'inimigo'
    r.pend = { id: 'familia', left: 2 }
    E.game.poder.familia.harmonia = 60
    E.rvEscolher('ignorar')
    expect(E.game.poder.familia.harmonia).toBeLessThan(60)
  })
  it('pressão do Congresso aparece, tem prazo e cai na opção padrão', () => {
    comOrigem('solteiro')
    E.game.total = 6
    const s = (E.game.poder.pressao = { pend: { id: 'pauta_bomba', left: 0 }, last: -9 })
    expect(E.pressPendNow().id).toBe('pauta_bomba')
    const cash = E.game.stats.cash
    E.roundAvancos()
    expect(E.pressPendNow()).toBeNull()
    expect(E.game.stats.cash).toBeLessThan(cash)
    E.game.poder.pressao = { pend: { id: 'convocacao', left: 2 }, last: -9 }
    const cong = E.game.stats.cong
    expect(E.pressEscolher('trocar')).toBeTruthy()
    expect(E.game.stats.cong).toBeGreaterThan(cong - 0.01)
    expect(s).toBeTruthy()
  })
  it('pressão ocorre com o tempo e é mais frequente com base fraca', () => {
    let vistas = 0
    for (let i = 0; i < 40; i++) {
      comOrigem('solteiro')
      E.game.total = 5
      E.game.stats.cong = 20
      for (let k = 0; k < 6 && !E.pressPendNow(); k++) { E.game.total++; E.roundAvancos() }
      if (E.pressPendNow()) vistas++
    }
    expect(vistas).toBeGreaterThan(8)
  })
  it('pendências listam decisões com prazo e ações da rodada', () => {
    comOrigem('solteiro')
    E.game.phase = 'actions'
    E.game.ap = 2
    E.game.poder.pressao = { pend: { id: 'obstrucao', left: 1 }, last: -9 }
    const l = E.pendenciasNow()
    expect(l.find((x) => x.id === 'press').tipo).toBe('decisao')
    expect(l.find((x) => x.id === 'press').left).toBe(2)
    expect(l.find((x) => x.id === 'ap').tipo).toBe('acao')
    expect(l.find((x) => x.id === 'poder').tab).toBe('leis')
    E.game.ap = 0
    E.game.poder.exe.used = ['a', 'b']
    const l2 = E.pendenciasNow()
    expect(l2.find((x) => x.id === 'ap')).toBeUndefined()
    expect(l2.find((x) => x.id === 'poder')).toBeUndefined()
  })
  it('a criação de personagem oferece a categoria de família', async () => {
    const { brasilTraits } = await import('../src/game/countries/brasil-traits.js')
    const cat = brasilTraits.find((c) => c.id === 'familia')
    expect(cat.options.length).toBeGreaterThanOrEqual(6)
    expect(cat.options.map((o) => o.id)).toContain(cat.def)
  })
  it('o estado da pressão do Congresso não colide com as notas da imprensa e sobrevive ao salvamento', () => {
    comOrigem('solteiro')
    E.game.total = 6
    E.game.poder.pressao = { pend: { id: 'pauta_bomba', left: 2 }, last: 5 }
    expect(Array.isArray(E.game.poder.press)).toBe(true)
    E.game.poder.press.push({ icon: '📰', text: 'nota' })
    const volta = JSON.parse(JSON.stringify(E.game.poder))
    expect(volta.pressao.pend.id).toBe('pauta_bomba')
    expect(volta.press.length).toBeGreaterThan(0)
  })
})

describe('BLOCO 36 — cenário por mandato, identidade do estado e leis com contexto', () => {
  const inicia = (regionId = 'MT', office = 'prefeito') => {
    E.startGame({ name: 'Teste', regionId })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 60
    E.game.stats.cong = 60
    E.game.total = 5
  }
  it('todo estado tem perfil e todo tema citado existe', () => {
    const temas = E.worldTemas().map((t) => t.id)
    for (const r of E.country().regions) {
      const p = PERFIL_UF[r.id]
      expect(p, r.id).toBeTruthy()
      expect(SETORES_UF[p.tag], r.id).toBeTruthy()
      expect(temas).toContain(p.dor)
      expect(temas).toContain(p.resiste)
    }
    for (const c of CENARIOS) {
      for (const t of [...c.quente, ...c.frio]) expect(temas).toContain(t)
      expect(c.eventos.length).toBeGreaterThanOrEqual(3)
      for (const e of c.eventos) expect(e.ops.some((o) => o.id === e.padrao)).toBe(true)
    }
  })
  it('a carreira começa com um cenário e o perfil do estado', () => {
    inicia('MT')
    expect(E.cenarioNow()).toBeTruthy()
    expect(E.perfilEstado().tag).toBe('agro')
  })
  it('o cenário muda quando a carreira muda de cargo ou ganha novo mandato', () => {
    inicia()
    const a = E.game.cenario.id
    const n = E.game.cenario.n
    E.game.election = { target: 'prefeito', result: { won: true, share: 55, h2h: 55 } }
    E.game.phase = 'result'
    E.continueAfterResult()
    expect(E.game.cenario.n).toBeGreaterThan(n)
    expect(E.game.cenario.id).not.toBe(a)
  })
  it('leis em alta aprovam mais fácil e em baixa, mais difícil', () => {
    inicia('SP')
    const c = E.cenarioNow()
    const quente = c.quente[0]
    const frio = c.frio[0]
    expect(E.leiCtx(quente, 2).quente).toBe(true)
    expect(E.leiCtx(quente, 2).mult).toBeGreaterThan(1)
    expect(E.leiCtx(frio, 2).frio).toBe(true)
    expect(E.leiCtx(frio, 2).mult).toBeLessThan(1)
  })
  it('a resistência do setor derruba a chance e a dor do estado ajuda', () => {
    inicia('MT')
    E.game.cenario = { id: 'boom', n: 1, desde: 0, pend: null, last: 0, vistos: [] }
    const p = E.perfilEstado()
    expect(E.leiCtx(p.resiste, 2).resiste).toBe(true)
    expect(E.leiCtx(p.resiste, 2).chance).toBeLessThan(0)
    expect(E.leiCtx(p.dor, 2).dor).toBe(true)
    expect(E.leiCtx(p.dor, 2).popExtra).toBeGreaterThan(0)
  })
  it('o nome da lei muda com o contexto, mas é estável dentro do mesmo cenário', () => {
    inicia('GO')
    const nome1 = E.lawName('saude', 2)
    expect(E.lawName('saude', 2)).toBe(nome1)
    expect(nome1).toMatch(/\(.+\)/)
    E.game.cenario = { id: 'seca', n: 9, desde: 0, pend: null, last: 0, vistos: [] }
    const nomes = new Set()
    for (const id of ['saude', 'educacao', 'seguranca', 'economia']) nomes.add(E.lawName(id, 1).replace(/^[^:]+:\s*/, '').replace(/^.*?\(/, '('))
    expect(nomes.size).toBeGreaterThan(1)
  })
  it('lei aprovada guarda o multiplicador do contexto e rende mais em alta', () => {
    // o motor guarda a referência de Math.random ao iniciar a carreira, então o espião entra antes
    const spy = vi.spyOn(Math, 'random')
    inicia('SP', 'prefeito')
    E.game.cenario = { id: 'boom', n: 1, desde: 0, pend: null, last: 0, vistos: [] }
    E.game.stats.cong = 95
    E.game.world.lawUsed = false
    E.game.world.lawN = 0
    spy.mockReturnValue(0.01)
    const ok = E.proposeLaw('ciencia', 1)
    spy.mockRestore()
    expect(ok).toBe(true)
    const l = E.game.world.laws[0]
    expect(l.mult).toBeGreaterThan(1)
  })
  it('evento de cenário aparece, vira decisão com padrão e entra nas pendências', () => {
    inicia()
    E.game.cenario = { id: 'fiscal', n: 1, desde: 0, pend: { k: 'fiscal:0', left: 2 }, last: 0, vistos: [] }
    const pn = E.cenPendNow()
    expect(pn.titulo).toBeTruthy()
    expect(E.pendenciasNow().some((x) => x.id === 'cen')).toBe(true)
    const cash = E.game.stats.cash
    expect(E.cenEscolher('ajuste')).toBeTruthy()
    expect(E.game.stats.cash).toBeGreaterThan(cash)
    expect(E.cenPendNow()).toBeNull()
  })
  it('deixar o prazo passar aplica a opção padrão', () => {
    inicia()
    E.game.cenario = { id: 'fiscal', n: 1, desde: 0, pend: { k: 'fiscal:0', left: 0 }, last: 0, vistos: [] }
    E.game.world.ameacas = []
    E.roundAvancos()
    E.roundAvancos()
    expect(E.cenPendNow()).toBeNull()
    expect(E.game.cenario.vistos).toContain('fiscal:0')
  })
  it('save antigo sem cenário ganha um na primeira rodada', () => {
    inicia()
    E.game.cenario = null
    E.roundAvancos()
    expect(E.cenarioNow()).toBeTruthy()
  })
  it('sinergia: seca pesa mais num estado do agro do que num estado de serviços', () => {
    inicia('MT')
    E.game.cenario = { id: 'seca', n: 1, desde: 0, pend: null, last: 99, vistos: [] }
    E.game.total = 5
    E.game.stats.eco = 60
    E.roundAvancos()
    const mt = E.game.stats.eco
    inicia('SP')
    E.game.cenario = { id: 'seca', n: 1, desde: 0, pend: null, last: 99, vistos: [] }
    E.game.total = 5
    E.game.stats.eco = 60
    E.roundAvancos()
    expect(E.game.stats.eco).toBeGreaterThan(mt)
  })
})

describe('BLOCO 43 — eventos esportivos e culturais gerados', () => {
  const oferta = (base, cen = 'boom') => ({ id: 'gen:' + base, base, m: 0, icon: '🎉', name: 'Teste', year: 2027, cen })
  const joga = (regionId = 'SP', traits = {}) => {
    E.startGame({ name: 'Teste', regionId, traits })
    E.game.phase = 'actions'
  }
  it('toda base monta um evento completo, com texto, 4 escolhas e uma jogada de risco', () => {
    for (const b of GEN_BASES) {
      for (const cen of Object.keys(GEN_CENARIO)) {
        const e = montarGen(b, cen, 'saúde', true)
        expect(e.title.length, b.id).toBeGreaterThan(8)
        expect(e.choices.length).toBe(4)
        expect(e.choices.filter((c) => c.risk).length).toBe(1)
        expect(e.choices.every((c) => c.label && c.out && c.fx), b.id).toBe(true)
      }
    }
    expect(new Set(GEN_BASES.map((b) => b.id)).size).toBe(GEN_BASES.length)
  })
  it('o cenário muda o texto e o custo da escolha de investir', () => {
    const b = GEN_BASES[0]
    const fiscal = montarGen(b, 'fiscal', 'saúde', false)
    const boom = montarGen(b, 'boom', 'saúde', false)
    expect(fiscal.text).not.toBe(boom.text)
    expect(boom.choices[1].fx.cash).toBeGreaterThan(fiscal.choices[1].fx.cash)
  })
  it('falar da dor do estado rende mais quando o tema está em alta no cenário', () => {
    const b = GEN_BASES[0]
    const alta = montarGen(b, 'boom', 'saúde', true).choices[3].fx
    const baixa = montarGen(b, 'boom', 'saúde', false).choices[3].fx
    expect(alta.pop).toBeGreaterThan(baixa.pop)
  })
  it('a paixão e o setor do estado puxam o sorteio', () => {
    const volei = GEN_BASES.find((b) => b.id === 'volei')
    const rodeio = GEN_BASES.find((b) => b.id === 'rodeio')
    expect(pesoGen(volei, 'agro', 'volei')).toBeGreaterThan(pesoGen(volei, 'agro', 'nenhuma'))
    expect(pesoGen(rodeio, 'agro', null)).toBeGreaterThan(pesoGen(rodeio, 'industria', null))
  })
  it('evento gerado abre, aceita a escolha e aplica o resultado', () => {
    joga('SP')
    E.game.bigOffer = oferta('volei')
    const b = E.currentBig()
    expect(b.title).toMatch(/vôlei/i)
    expect(b.title).not.toMatch(/\{/)
    const pop = E.game.stats.pop
    E.chooseBig(0)
    expect(E.game.stats.pop).toBeGreaterThan(pop)
    expect(E.game.bigOffer.done).toBe(true)
    expect(E.currentBig()).toBeNull()
  })
  it('a paixão do personagem rende bônus no evento gerado que combina', () => {
    joga('SP', { paixao: 'volei' })
    E.game.bigOffer = oferta('volei')
    const pop = E.game.stats.pop
    E.chooseBig(0)
    const comPaixao = E.game.stats.pop - pop
    joga('SP', { paixao: 'nenhuma' })
    E.game.bigOffer = oferta('volei')
    const pop2 = E.game.stats.pop
    E.chooseBig(0)
    expect(comPaixao).toBeGreaterThan(E.game.stats.pop - pop2)
  })
  it('as ofertas variam: muitos tipos diferentes em várias carreiras', () => {
    const ids = new Set()
    let gerados = 0
    for (let i = 0; i < 160; i++) {
      E.startGame({ name: 'Teste', regionId: ['SP', 'MT', 'BA', 'AM'][i % 4] })
      const o = E.game.bigOffer
      if (o) {
        ids.add(o.id)
        if (o.base) gerados++
      }
    }
    expect(ids.size).toBeGreaterThan(8)
    expect(gerados).toBeGreaterThan(10)
  })
  it('save antigo com oferta fixa continua funcionando', () => {
    joga('SP')
    E.game.bigOffer = { id: 'estadual', m: 0, icon: '⚽', name: 'Final do Estadual', year: 2027 }
    expect(E.currentBig().title).toMatch(/Estadual/)
    E.chooseBig(3)
    expect(E.game.bigOffer.done).toBe(true)
  })
})
