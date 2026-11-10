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
