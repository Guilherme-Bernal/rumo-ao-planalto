// @vitest-environment node
import { billsOf } from '../src/game/bills'
import { makeNews } from '../src/game/news'
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
    // combater e derrubar: ganha base; combater e perder: perde base
    expect(billOutcome(b, false, 0, 'con').cong).toBeGreaterThan(0)
    expect(billOutcome(b, true, 0, 'con').cong).toBeLessThan(0)
  })
  it('finishPlenario aplica o projeto e loga o título', () => {
    return import('../src/game/bills.js').then(({ billFor }) => {
      E.startGame({ name: 'Teste', regionId: 'SP' })
      const b = billFor(E.game.office, 0)
      expect(E.finishPlenario(6, 9, b, 1, 'con')).toBe(true)
    })
  })
})

describe('sanção, veto e leis em vigor', () => {
  it('sancionar cria lei com efeito contínuo e registra na linha do tempo', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = 'presidente'
    E.game.poder.pending = { billId: 'f-saude', round: 1 }
    E.game.phase = 'actions'
    const r = E.decideBill('sancionar')
    expect(r.choice).toBe('sancionar')
    expect(E.game.poder.pending).toBe(null)
    expect(E.statutesActive().length).toBe(1)
    expect(E.game.poder.timeline.length).toBeGreaterThan(0)
  })
  it('vetar nunca deixa o jogo num estado quebrado, com ou sem derrubada', () => {
    for (let i = 0; i < 30; i++) {
      E.startGame({ name: 'Teste', regionId: 'SP' })
      E.game.office = 'presidente'
      E.game.poder.pending = { billId: 'f-fake', round: 1 }
      E.game.phase = 'actions'
      const r = E.decideBill('vetar')
      expect(typeof r.overridden).toBe('boolean')
      expect(E.game.poder.pending).toBe(null)
      expect(E.game.stats.cong).toBeGreaterThanOrEqual(0)
    }
  })
  it('chance de derrubar o veto fica entre 5% e 90%', () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.poder.pending = { billId: 'f-saude', round: 1 }
    const b = E.pendingBill()
    for (const c of ['vetar', 'parcial']) {
      const p = E.overrideChance(b, c)
      expect(p).toBeGreaterThanOrEqual(0.05)
      expect(p).toBeLessThanOrEqual(0.9)
    }
  })
})

describe('mandato legislativo', () => {
  const novo = (office = 'dep_federal') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 50
    E.game.poder.leg = { used: [] }
  }
  it('fiscalização gasta uma das 2 ações da rodada e registra na linha do tempo', () => {
    novo()
    const r = E.fiscalizar('hospital')
    expect(r).toBeTruthy()
    expect(E.legLeft()).toBe(1)
    expect(E.fiscalizar('hospital')).toBe(null)
    expect(E.game.poder.timeline.length).toBeGreaterThan(0)
  })
  it('executivo não tem ações legislativas', () => {
    novo('prefeito')
    expect(E.fiscalizar('hospital')).toBe(null)
    expect(E.lawCap()).toBe(1)
  })
  it('comissão reforça o atributo e só pode ser escolhida uma vez', () => {
    novo()
    expect(E.escolherComissao('saude')).toBe(true)
    expect(E.escolherComissao('economia')).toBe(false)
    expect(E.comissaoAtiva().stat).toBe('soc')
    expect(E.relatar()).toBeTruthy()
  })
  it('CPI só uma vez por mandato e nunca quebra os atributos', () => {
    novo('senador')
    const r = E.abrirCPI('exec')
    expect(typeof r.ok).toBe('boolean')
    expect(E.cpiDone()).toBe(true)
    expect(E.abrirCPI('setor')).toBe(null)
    for (const k of Object.keys(E.game.stats)) expect(E.game.stats[k]).toBeGreaterThanOrEqual(0)
  })
  it('emenda e obstrução funcionam e a obstrução é consumida na votação', () => {
    novo('dep_estadual')
    expect(E.emendar('saude')).toBeTruthy()
    expect(E.obstruir()).toBe(true)
    expect(E.obstrucaoAtiva()).toBe(true)
    const b = billsOf('dep_estadual')[0]
    E.finishPlenario(6, 9, b, 0, 'con')
    expect(E.obstrucaoAtiva()).toBe(false)
  })
  it('legislador pode propor até 3 leis por rodada', () => {
    novo()
    const t = E.worldTemas()
    let n = 0
    for (const x of t) if (E.proposeLaw(x.id, 1)) n++
    expect(n).toBe(3)
  })
})

describe('governo: nomeações, emendas e decretos', () => {
  const novo = (office = 'presidente') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 50
    E.game.poder.exe = { used: [] }
  }
  it('nomear cria o ministro e reforça a pasta; legislador não nomeia', () => {
    novo()
    expect(E.nomear('saude', 'tecnico')).toBeTruthy()
    expect(E.nomeados().length).toBe(1)
    novo('dep_federal')
    expect(E.nomear('saude', 'tecnico')).toBe(null)
  })
  it('só 2 ações de governo por rodada', () => {
    novo()
    expect(E.liberarEmendas(false)).toBeTruthy()
    expect(E.decretar('d-tarifa')).toBeTruthy()
    expect(E.decretar('d-policia')).toBe(null)
  })
  it('decreto é frágil e pode ser sustado sem quebrar o jogo', () => {
    for (let i = 0; i < 20; i++) {
      novo()
      E.decretar('d-social')
      expect(E.game.poder.statutes[0].fragile).toBe(true)
      expect(E.sustarChance()).toBeGreaterThan(0)
    }
  })
  it('orçamento paralelo arrisca escândalo mas não quebra os atributos', () => {
    for (let i = 0; i < 20; i++) {
      novo()
      const r = E.liberarEmendas(true)
      expect(typeof r.caught).toBe('boolean')
      for (const k of Object.keys(E.game.stats)) expect(E.game.stats[k]).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('judiciário', () => {
  const novo = () => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = 'presidente'
    E.game.phase = 'actions'
    E.game.stats.cash = 50
    E.game.poder.exe = { used: [] }
  }
  it('o tribunal muda conforme o cargo', () => {
    novo()
    expect(E.courtShort()).toBe('STF')
    E.game.office = 'prefeito'
    expect(E.courtShort()).toBe('TJ')
  })
  it('ação contra decreto pode ser defendida ou acatada', () => {
    novo()
    E.decretar('d-social')
    const st = E.game.poder.statutes[0]
    E.game.poder.acao = { id: st.id, title: st.title, pol: 3, round: 1, defended: false }
    const antes = E.upholdChance()
    expect(E.defenderAcao()).toBe(true)
    expect(E.upholdChance()).toBeGreaterThan(antes)
    expect(E.acatarAcao()).toBe(true)
    expect(st.left).toBe(0)
    expect(E.acaoPendente()).toBe(null)
  })
  it('inquérito aceita defesa e colaboração uma vez cada', () => {
    novo()
    E.game.poder.inq = { stage: E.game.stage, round: 0, def: false, col: false }
    expect(E.defesaInquerito('defesa')).toBe(true)
    expect(E.defesaInquerito('defesa')).toBe(false)
    expect(E.defesaInquerito('colaborar')).toBe(true)
    expect(E.inquerito().def && E.inquerito().col).toBe(true)
  })
})

describe('mundo: pesquisas, protestos, consulta, metas', () => {
  const novo = (office = 'presidente') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 50
  }
  it('aprovação fica entre 0 e 100', () => {
    novo()
    expect(E.aprovacao()).toBeGreaterThanOrEqual(0)
    expect(E.aprovacao()).toBeLessThanOrEqual(100)
  })
  it('protesto pode ser negociado; reprimir só vale para executivo', () => {
    novo()
    E.game.poder.prot = { kind: 'greve', name: 'Greve dos servidores', round: 1 }
    expect(E.responderProtesto('apoiar')).toBe(null)
    expect(E.responderProtesto('dialogar')).toBeTruthy()
    expect(E.protesto()).toBe(null)
    novo('dep_federal')
    E.game.poder.prot = { kind: 'protesto', name: 'Protestos nas ruas', round: 1 }
    expect(E.responderProtesto('reprimir')).toBe(null)
    expect(E.responderProtesto('apoiar')).toBeTruthy()
  })
  it('consulta popular só uma vez por mandato', () => {
    novo()
    const b = billsOf('presidente')[0]
    const r = E.consultar(b.id)
    expect(typeof r.ok).toBe('boolean')
    expect(E.consultaFeita()).toBe(true)
    expect(E.consultar(b.id)).toBe(null)
  })
  it('crise de poderes aparece só com povo e base muito baixos', () => {
    novo()
    E.game.stats.pop = 20
    E.game.stats.cong = 20
    expect(E.emCrise()).toBe(true)
    expect(E.articular()).toBe(true)
    E.game.stats.pop = 60
    expect(E.emCrise()).toBe(false)
  })
  it('metas listam as do cargo', () => {
    novo()
    expect(E.goalsNow().some((g) => g.id === 'nome')).toBe(true)
    novo('vereador')
    expect(E.goalsNow().some((g) => g.id === 'fisc')).toBe(true)
    expect(E.goalsNow().some((g) => g.id === 'nome')).toBe(false)
  })
})

describe('educação e universidade', () => {
  const novo = (office = 'governador') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 50
    E.game.poder.exe = { used: [] }
    E.game.poder.eduDone = false
  }
  it('educação sobe o índice, uma ação por rodada, e respeita o cargo', () => {
    novo()
    const antes = E.eduNow()
    expect(E.eduAgir('univ')).toBeTruthy()
    expect(E.eduNow()).toBeGreaterThan(antes)
    expect(E.eduAgir('merenda')).toBe(null)
    novo('prefeito')
    expect(E.eduAgir('univ')).toBe(null)
    expect(E.eduAgir('creche')).toBeTruthy()
  })
  it('legislador também age, com efeito menor', () => {
    novo('dep_federal')
    const a = E.eduNow()
    expect(E.eduAgir('fies')).toBeTruthy()
    const ganho = E.eduNow() - a
    novo('presidente')
    const b = E.eduNow()
    E.eduAgir('fies')
    expect(E.eduNow() - b).toBeGreaterThan(ganho)
  })
  it('reitor só uma vez por mandato e só quem tem universidade', () => {
    novo()
    expect(E.nomearReitor('lista')).toBeTruthy()
    expect(E.reitorAtual().id).toBe('lista')
    expect(E.nomearReitor('aliado')).toBe(null)
    novo('prefeito')
    expect(E.nomearReitor('lista')).toBe(null)
  })
  it('pesquisa acumula e o índice nunca sai de 0 a 100', () => {
    novo('presidente')
    for (let i = 0; i < 12; i++) {
      E.game.poder.eduDone = false
      E.game.stats.cash = 50
      E.eduAgir('pesquisa')
    }
    expect(E.cienNow()).toBeLessThanOrEqual(8)
    expect(E.eduNow()).toBeLessThanOrEqual(100)
  })
  it('há mais temas de lei e um projeto de educação em cada nível', () => {
    expect(E.worldTemas().length).toBeGreaterThanOrEqual(13)
    for (const o of ['vereador', 'governador', 'presidente']) expect(billsOf(o).some((b) => b.edu)).toBe(true)
  })
})

describe('defesa, golpes e guerra civil', () => {
  const novo = (office = 'presidente') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.phase = 'actions'
    E.game.stats.cash = 50
    E.game.poder.exe = { used: [] }
  }
  it('forças armadas: ação sobe o humor da força e consome ação do governo', () => {
    novo()
    const a = E.humorForca('ex')
    expect(E.agirForca('ex')).toBeTruthy()
    expect(E.humorForca('ex')).toBeGreaterThan(a)
    novo('prefeito')
    expect(E.agirForca('ex')).toBe(null)
  })
  it('polícia só para prefeito e governador', () => {
    novo('prefeito')
    expect(E.agirPolicia('reajuste')).toBeTruthy()
    expect(E.humorPolicia()).toBeGreaterThan(50)
    novo('presidente')
    expect(E.agirPolicia('reajuste')).toBe(null)
  })
  it('ministro da Defesa só no governo federal e perfil militar só na Defesa', () => {
    novo()
    expect(E.pastasNow().some((p) => p.id === 'defesa')).toBe(true)
    expect(E.nomear('saude', 'militar')).toBe(null)
    expect(E.nomear('defesa', 'militar')).toBeTruthy()
    novo('governador')
    expect(E.pastasNow().some((p) => p.id === 'defesa')).toBe(false)
  })
  it('conspiração pode ser enfrentada e desarticulada', () => {
    novo()
    E.game.poder.plot = { force: 'ex', leader: 'General Fulano', strength: 10, round: 1 }
    const antes = E.plotAtual().strength
    expect(E.enfrentarPlot('denunciar')).toBeTruthy()
    expect(E.plotAtual() ? E.plotAtual().strength : 0).toBeLessThan(antes)
  })
  it('golpe consumado encerra o jogo e não recria o save', () => {
    const fins = {}
    for (let i = 0; i < 200; i++) {
      novo()
      E.game.stats.pop = 20
      E.game.stats.cong = 20
      E.game.stats.img = 30
      E.game.world.fa = 10
      E.game.poder.plot = { force: 'ex', leader: 'General Fulano', strength: 99, round: 1 }
      E.game.poder.golpe = 90
      E.roundDefesa()
      const k = E.game.phase === 'over' ? E.game.over.title : E.game.poder.civil ? 'civil' : E.plotAtual() ? 'plot' : 'resolvido'
      fins[k] = (fins[k] || 0) + 1
      if (E.game.phase === 'over') expect(['Golpe de Estado', 'Guerra civil']).toContain(E.game.over.title)
    }
    expect(fins['Golpe de Estado']).toBeGreaterThan(0)
    expect(Object.keys(fins).length).toBeGreaterThan(1)
  })
  it('guerra civil por tempo esgotado encerra o jogo', () => {
    novo()
    E.game.poder.civil = { round: 4, peace: 0 }
    E.roundDefesa()
    expect(E.game.phase).toBe('over')
    expect(E.game.over.title).toBe('Guerra civil')
  })
  it('apelo internacional soma paz usando a média real das relações', () => {
    novo()
    E.game.poder.civil = { round: 0, peace: 0 }
    expect(E.agirCivil('apelo')).toBeTruthy()
    expect(E.guerraCivil().peace).toBeGreaterThanOrEqual(5)
  })
  it('guerra civil: pacto leva à paz e o tempo esgotado encerra o jogo', () => {
    novo()
    E.game.poder.civil = { round: 0, peace: 0 }
    expect(E.agirCivil('pacto')).toBeTruthy()
    expect(E.agirCivil('anistia')).toBeTruthy()
    expect(E.guerraCivil().peace).toBeGreaterThan(50)
  })
  it('GLO resolve protesto e fica indisponível sem motivo', () => {
    novo()
    E.game.stats.seg = 80
    expect(E.gloPossivel()).toBe(false)
    E.game.poder.prot = { kind: 'protesto', name: 'Protestos nas ruas', round: 1 }
    expect(E.gloPossivel()).toBe(true)
    expect(E.glo()).toBeTruthy()
    expect(E.protesto()).toBe(null)
  })
  it('deputado federal enfrenta conspiração com ações de Legislativo', () => {
    novo('dep_federal')
    E.game.phase = 'actions'
    E.game.poder.leg = { used: [] }
    E.game.stats.cong = 60
    E.game.poder.plot = { force: 'ex', leader: 'General Fulano', strength: 50, round: 1 }
    expect(E.agirLegGolpe('convocar')).toBeTruthy()
    expect(E.plotAtual().strength).toBeLessThan(50)
    expect(E.agirLegGolpe('frente')).toBeTruthy()
    expect(E.plotAtual() === null || E.plotAtual().strength < 20).toBe(true)
    novo('presidente')
    expect(E.agirLegGolpe('lei')).toBe(null)
  })
  it('golpe contra deputado fecha o Congresso', () => {
    let achou = false
    for (let i = 0; i < 200 && !achou; i++) {
      novo('dep_federal')
      E.game.stats.pop = 20
      E.game.stats.cong = 20
      E.game.world.fa = 10
      E.game.poder.plot = { force: 'ex', leader: 'General Fulano', strength: 99, round: 1 }
      E.roundDefesa()
      if (E.game.phase === 'over') { achou = true; expect(E.game.over.text).toMatch(/Congresso/) }
    }
    expect(achou).toBe(true)
  })
  it('recap lista os fatos de bastidores da rodada', () => {
    novo()
    E.game.phase = 'actions'
    E.game.poder.plot = { force: 'ex', leader: 'General Fulano', strength: 50, round: 1 }
    E.enfrentarPlot('denunciar')
    E.endTurn()
    expect(E.game.phase === 'recap' || E.game.phase === 'over').toBe(true)
    if (E.game.phase === 'recap') expect(Array.isArray(E.game.recap.bastidores)).toBe(true)
  })
  it('prefeito não recebe eventos de vereador e vice-versa', () => {
    for (const o of ['prefeito', 'vereador']) {
      novo(o)
      E.game.stage = 0
      const evs = E.devEvents().filter((e) => e.stages.includes(0))
      expect(evs.length).toBeGreaterThan(10)
    }
    novo('prefeito')
    expect(E.eventoServe({ id: 'superfat', stages: [0] })).toBe(false)
    expect(E.eventoServe({ id: 'pref_superfat', only: 'prefeito', stages: [0] })).toBe(true)
    novo('vereador')
    expect(E.eventoServe({ id: 'pref_superfat', only: 'prefeito', stages: [0] })).toBe(false)
    expect(E.eventoServe({ id: 'superfat', stages: [0] })).toBe(true)
  })
  it('ações respeitam o cargo dentro do mesmo nível', () => {
    const ids = (o, st) => { novo(o); E.game.stage = st; return E.allActions().map((a) => a.id) }
    expect(ids('prefeito', 0)).not.toContain('fiscalizar')
    expect(ids('prefeito', 0)).toContain('obracidade')
    expect(ids('vereador', 0)).toContain('fiscalizar')
    expect(ids('vereador', 0)).not.toContain('obracidade')
    expect(ids('dep_estadual', 1)).not.toContain('agendaBr')
    expect(ids('dep_estadual', 1)).toContain('agendaEst')
    expect(ids('dep_federal', 1)).toContain('agendaBr')
    expect(ids('presidente', 3)).toContain('projeto')
    novo('dep_estadual')
    expect(E.eventoServe({ id: 'reformaTributaria', stages: [1] })).toBe(false)
    novo('dep_federal')
    expect(E.eventoServe({ id: 'reformaTributaria', stages: [1] })).toBe(true)
  })
})

describe('jornal', () => {
  it('não repete nota lateral nem manchete nas edições seguintes', () => {
    let n = 0
    const vistos = []
    for (let i = 0; i < 20; i++) {
      const j = makeNews({ who: 'Fulano', state: 'SP', city: 'Campinas', party: 'XYZ', rival: 'Beltrano', fx: { pop: 3 }, total: i, pop: 50 }, Math.random)
      for (const s of j.side) { if (vistos.slice(-24).includes(s.text)) n++; vistos.push(s.text) }
    }
    expect(n).toBe(0)
  })
  const novo = (office = 'presidente') => {
    E.startGame({ name: 'Teste', regionId: 'SP' })
    E.game.office = office
    E.game.stage = { vereador: 0, prefeito: 0, dep_estadual: 1, dep_federal: 1, senador: 1, governador: 2, presidente: 3 }[office]
    E.game.phase = 'actions'
    E.game.stats.cash = 50
  }
  it('partidos novos surgem durante o jogo e podem convidar', () => {
    novo('vereador')
    E.game.total = 5
    for (let i = 0; i < 300; i++) E.novoPartido()
    expect(E.game.novosPartidos.length).toBeLessThanOrEqual(6)
    expect(E.game.novosPartidos.length).toBeGreaterThan(0)
    const np = E.game.novosPartidos[0]
    expect(np.sigla.length).toBeGreaterThan(1)
    expect(E.partiesNow().some((x) => x.id === np.id)).toBe(true)
  })
  it('governador e senador podem fazer diplomacia, vereador não', () => {
    novo('governador')
    E.game.phase = 'actions'
    E.game.world.pts = 2
    expect(E.canDiplo()).toBe(true)
    expect(E.diplo('india', 'visita')).toBe(true)
    novo('vereador')
    E.game.phase = 'actions'
    E.game.world.pts = 2
    expect(E.diplo('india', 'visita')).toBe(false)
    expect(E.worldPartners().length).toBeGreaterThanOrEqual(11)
  })
  it('cada cargo tem várias relações', () => {
    for (const o of ['vereador', 'prefeito', 'dep_estadual', 'dep_federal', 'senador', 'governador', 'presidente']) {
      novo(o)
      expect(E.fedDefs().length).toBeGreaterThanOrEqual(4)
    }
  })
})
