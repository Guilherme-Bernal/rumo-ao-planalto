// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'

// localStorage de mentira para rodar o motor sem navegador
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

describe('dados do jogo', () => {
  it('todo evento tem título, cargos e escolhas válidas', async () => {
    const { countries } = await import('../src/game/countries/index.js')
    const seen = new Set()
    for (const c of Object.values(countries)) {
      for (const e of c.events) {
        expect(e.id, 'evento sem id').toBeTruthy()
        expect(seen.has(e.id), `id repetido: ${e.id}`).toBe(false)
        seen.add(e.id)
        expect(e.title, e.id).toBeTruthy()
        expect(Array.isArray(e.stages) && e.stages.length, `${e.id} sem cargos`).toBeTruthy()
        expect(e.choices.length, `${e.id} sem escolhas`).toBeGreaterThanOrEqual(2)
        for (const ch of e.choices) {
          expect(ch.label, e.id).toBeTruthy()
          expect(typeof ch.out, `${e.id}: sem texto de resultado`).toBe('string')
          expect(ch.fx && typeof ch.fx === 'object', `${e.id}: sem fx`).toBe(true)
        }
      }
    }
  })
})

describe('motor', () => {
  it('começa uma carreira em Brasil/vereador', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    expect(E.game.phase).toBe('event')
    expect(E.officeId()).toBe('vereador')
    for (const s of E.STATS) expect(E.game.stats[s.k]).toBeGreaterThanOrEqual(0)
  })

  it('joga um mandato inteiro sem quebrar e sem estourar os números', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    let guard = 0
    while (guard++ < 60) {
      const p = E.game.phase
      if (p === 'event') E.chooseOption(0)
      else if (p === 'outcome') E.continueOutcome()
      else if (p === 'actions') E.endTurn()
      else if (p === 'recap') E.continueRecap()
      else if (p === 'balance') E.continueBalance()
      else break
      for (const s of E.STATS) {
        expect(E.game.stats[s.k]).toBeGreaterThanOrEqual(0)
        expect(E.game.stats[s.k]).toBeLessThanOrEqual(100)
      }
    }
    // chegou a algum ponto adulto da partida (eleição, fim ou derrota)
    expect(['campaign', 'runoff', 'result', 'plan', 'rumo', 'over', 'end', 'balance', 'event']).toContain(E.game.phase)
    expect(guard).toBeLessThan(60)
  })

  it('a dificuldade muda o ganho dos números', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    const g = E.game
    g.difficulty = 'facil'
    const facil = E.effectiveFx({ pop: 10 }).pop
    g.difficulty = 'real'
    const real = E.effectiveFx({ pop: 10 }).pop
    expect(facil).toBeGreaterThan(real)
  })
})

describe('epílogo e cartão de resultado', () => {
  it('epílogo devolve frases', async () => {
    const { epilogue } = await import('../src/game/epilogue.js')
    E.startGame({ name: 'Teste', regionId: 'SP' })
    const out = epilogue(E.game)
    expect(out.length).toBeGreaterThanOrEqual(2)
    for (const l of out) expect(l.length).toBeGreaterThan(10)
  })
})

describe('contatos e ligações', () => {
  it('conversa recebida muda a relação e fica no histórico do contato', async () => {
    const { SCRIPTS } = await import('../src/game/contacts.js')
    E.startGame({ name: 'Teste', regionId: 'SP' })
    const sc = SCRIPTS.find((x) => x.id === 'tio')
    E.game.approach = { sid: sc.id, cid: sc.role, done: false }
    const c = E.game.contacts.find((x) => x.id === sc.role)
    const antes = c.rel
    E.talkChoice(sc.ch[2])
    expect(c.rel).not.toBe(antes)
    expect(c.rel).toBeGreaterThanOrEqual(0)
    expect(c.rel).toBeLessThanOrEqual(100)
    expect(c.hist.length).toBe(1)
    expect(E.game.approach.done).toBe(true)
  })

  it('ignorar uma ligação custa relação e também fica no histórico', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.approach = { sid: 'doacao', cid: 'empresario', done: false }
    const c = E.game.contacts.find((x) => x.id === 'empresario')
    const antes = c.rel
    E.ignoreApproach()
    expect(c.rel).toBe(antes - 3)
    expect(c.hist[0].t).toMatch(/não atendeu/i)
  })

  it('todo pedido de ligação tem texto de sucesso e de falha', async () => {
    const { ASKS } = await import('../src/game/contacts.js')
    for (const [role, list] of Object.entries(ASKS)) {
      for (const a of list) {
        expect(a.ok, `${role}/${a.id} sem ok`).toBeTruthy()
        expect(a.fail, `${role}/${a.id} sem fail`).toBeTruthy()
        expect(a.base).toBeGreaterThan(0)
        expect(a.base).toBeLessThan(1)
      }
    }
  })
})


describe('projetos em votação', () => {
  it('todo projeto tem texto e a emenda enfraquece o benefício', async () => {
    const { ALL_BILLS, billOutcome, billFor } = await import('../src/game/bills.js')
    for (const b of ALL_BILLS) {
      expect(b.title.length).toBeGreaterThan(5)
      expect(b.pro && b.con && b.ementa).toBeTruthy()
    }
    const b = billFor('presidente', 3)
    expect(b).toBeTruthy()
    const cheio = billOutcome(b, true, 0)
    const fraco = billOutcome(b, true, 2)
    const soma = (o) => Object.values(o).filter((v) => v > 0).reduce((a, v) => a + v, 0)
    expect(soma(fraco)).toBeLessThanOrEqual(soma(cheio))
    expect(billOutcome(b, false).cong).toBeLessThan(0)
  })
  it('finishPlenario aplica o projeto e loga o título', () => {
    return import('../src/game/bills.js').then(({ billFor }) => {
      E.startGame({ name: 'Teste', regionId: 'SP' })
      const b = billFor(E.game.office, 0)
      expect(E.finishPlenario(6, 9, b, 1)).toBe(true)
    })
  })
})
