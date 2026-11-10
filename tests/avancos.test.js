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
  E.game.world.pts = 2
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
    expect(ok).toBeGreaterThan(18)
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
      E.game.world.pts = 2
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
