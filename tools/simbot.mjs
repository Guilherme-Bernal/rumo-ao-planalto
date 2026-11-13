// Bots de simulação: jogam carreiras inteiras direto no motor (sem interface) e medem o equilíbrio.
// Uso: node tools/simbot.mjs [partidas=200] [estilo=todos|cauteloso|agressivo|aleatorio] [seed=1]
import { createRequire } from 'module'

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

const N = Number(process.argv[2] || 200)
const ESTILO = process.argv[3] || 'todos'
let seed = Number(process.argv[4] || 1)
const CARGO = process.argv[5] || '' // modo governo: começa direto no cargo e joga até o fim do(s) mandato(s)

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const realRandom = Math.random
const E = await import('../src/game/engine.js')
const { DEB_ABORDAGENS } = await import('../src/game/eleicao27.js')
const { OFFICES } = await import('../src/game/offices.js')
const { game } = E

const W = {
  cauteloso: { pop: 1, eco: 1, cash: 1, soc: 1, seg: 1, img: 1.4, cong: 0.6 },
  agressivo: { pop: 1.6, eco: 0.6, cash: 0.7, soc: 0.4, seg: 0.4, img: 0.3, cong: 1.2 },
  estrategista: { pop: 2, eco: 1, cash: 0.9, soc: 0.9, seg: 0.9, img: 0.9, cong: 0.8 },
  equilibrado: { pop: 1.2, eco: 1, cash: 0.6, soc: 1, seg: 1, img: 0.9, cong: 1 },
  aleatorio: null,
}
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const fxScore = (fx, estilo) => {
  if (!fx) return 0
  const w = W[estilo]
  if (!w) return Math.random()
  let s = 0
  for (const k in fx) {
    const need = k in game.stats ? (estilo === 'equilibrado' ? 1 + Math.max(0, (80 - game.stats[k]) / 20) : 1 + Math.max(0, (55 - game.stats[k]) / 40)) : 1
    const pen = (estilo === 'estrategista' || estilo === 'equilibrado') && k === 'img' && fx[k] < 0 ? 3 : 1
    s += (fx[k] || 0) * (w[k] || 0.5) * need * pen
  }
  return s
}

function jogaCarreira(estilo) {
  const regs = ['SP', 'MG', 'RJ', 'BA', 'RS', 'PE', 'GO', 'AM']
  E.startGame({ name: 'Bot', regionId: pick(regs) })
  if (estilo === 'estrategista' || estilo === 'equilibrado') E.setBudget({ soc: 22, seg: 18, eco: 20, com: 25 })
  const out = { estilo, fim: '', ok: false, stage: 0, rodadas: 0, erro: null, stats: null, ev: {}, minCash: 100, minPop: 100, evIds: new Set(), cens: [], uf: '', bigIds: new Set() }
  if (CARGO) {
    const info = OFFICES[CARGO]
    game.office = CARGO
    game.stage = info.tier
    game.total = info.rank * 5 // rodadas já jogadas numa carreira normal até chegar aqui
    game.turn = 0
    game.traits = { ...(game.traits || {}), idade: 50 }
    Object.assign(game.stats, { pop: 62, eco: 55, cash: 60, soc: 55, seg: 55, img: 70, cong: 60 })
    game.phase = 'plan'
  }
  let vistoT = 0
  const prev = { g: false, a: 0, m: 0, c: false, k: false }
  let guard = 0
  while (guard++ < 4000) {
    const ph = game.phase
    try {
      if (ph === 'over') { out.fim = game.over.title; break }
      if (ph === 'end') { out.fim = game.legacy ? game.legacy.title : 'fim'; out.ok = true; break }
      if (ph === 'event') {
        if (game.bigOffer && estilo === 'agressivo' && Math.random() < 0.3 && E.chooseBig) { /* ignora grandes obras: segue evento */ }
        const ev = E.currentEvent()
        out.evIds.add(ev.id)
        let best = 0
        let bs = -1e9
        ev.choices.forEach((c, i) => {
          const s = fxScore(c.fx, estilo) + (c.risk ? (estilo === 'agressivo' ? 1 : -1) : 0)
          if (s > bs) { bs = s; best = i }
        })
        E.chooseOption(best)
      } else if (ph === 'outcome') E.continueOutcome()
      else if (ph === 'actions') {
        let n = 0
        while (game.ap > 0 && n++ < 4) {
          const poss = E.allActions().filter((a) => E.canDo(a) && !a.gamble && !((estilo === 'estrategista' || estilo === 'equilibrado') && a.dirty))
          if (!poss.length) break
          const sorted = poss.map((a) => ({ a, s: fxScore(a.fx, estilo) + (a.dirty && estilo === 'cauteloso' ? -5 : 0) })).sort((x, y) => y.s - x.s)
          const a = estilo === 'aleatorio' ? pick(poss) : sorted[0].a
          E.doAction(a.id)
        }
        if (process.env.LEIS && game.world && !game.world.lawUsed) {
          const tem = E.worldTemas(); const ous = E.worldOusadia()
          let best = null
          for (const t of tem) for (const o of ous) {
            if (E.lawHas(t.id, o.id) || game.stats.cash < o.cost) continue
            const sc = E.lawChance(t.id, o.id) * o.one * E.leiCtx(t.id, o.id).mult
            if (!best || sc > best.sc) best = { t, o, sc }
          }
          if (best) E.proposeLaw(best.t.id, best.o.id)
        }
        if (process.env.OBRAS) {
          const ok = E.obrasDisponiveis().filter((d) => !E.obraMotivo(d.id)).sort((a, b) => b.custo / b.prazo - a.custo / a.prazo)
          if (ok.length) E.obraIniciar(ok[ok.length - 1].id)
          const pn = E.obraPendNow()
          if (pn && !E.obraMotivoOp(pn.d.padrao)) E.obraEscolher(pn.d.padrao)
        }
        E.endTurn()
      } else if (ph === 'recap') E.continueRecap()
      else if (ph === 'balance') E.continueBalance()
      else if (ph === 'rumo') {
        const ops = E.pathOptions().filter((o) => !o.lock)
        const subir = ops.filter((x) => x.jump === 1)
        const o = estilo === 'cauteloso' || estilo === 'estrategista' || estilo === 'equilibrado' ? subir[0] || ops.find((x) => x.same) || ops[0] : estilo === 'agressivo' ? ops[ops.length - 1] : pick(ops)
        E.chooseRumo(o.id)
      } else if (ph === 'campaign' || ph === 'runoff') {
        if (ph === 'campaign' && E.needsTicket() && !(game.election && game.election.ticketDone)) {
          const s = E.ticketSpec()
          const vices = E.viceList().filter((v) => !v.illegal).sort((a, b) => b.vote - a.vote)
          const supls = E.suplList().slice().sort((a, b) => b.vote - a.vote).slice(0, s.supl).map((x) => x.id)
          if (!E.chooseTicket(s.vice ? vices[0].id : null, supls)) throw new Error('chapa recusada')
        } else if (ph === 'campaign') {
          if ((estilo === 'estrategista' || estilo === 'equilibrado') && !game.election.tvDone) {
            if (E.debateAbrir()) {
              for (let k = 0; k < 3; k++) {
                const tr = game.election.rivalTrait
                const best = DEB_ABORDAGENS.slice().sort((a, b) => b.eff[tr][0] - a.eff[tr][0] || b.eff[tr][1] - a.eff[tr][1])
                const pick2 = best.find((b) => b.id !== game.election.debate.ultimo) || best[0]
                E.debateAbordar(pick2.id)
              }
              E.debateFechar()
            }
          }
          if (process.env.DBG) console.log(estilo, 'pre-campanha', game.election.target, 'rival', game.election.rival.toFixed(1), 'score', E.baseScore().toFixed(1), 'tv', game.election.tv, 'pop', game.stats.pop.toFixed(0), 'img', game.stats.img.toFixed(0), 'cong', game.stats.cong.toFixed(0), 'cash', game.stats.cash.toFixed(0))
          const opts = E.CAMPAIGNS.filter((c) => game.stats.cash >= E.campaignCost(c)).sort((a, b) => b.bonus - a.bonus)
          E.chooseCampaign((opts[0] || E.CAMPAIGNS[0]).id)
        } else {
          const ok = E.RUNOFF.filter((o) => game.stats.cash >= o.cost)
          const o = estilo === 'aleatorio' ? pick(ok) : estilo === 'agressivo' ? ok.find((x) => x.id === 'ataque') || ok[0] : ok.find((x) => x.id === 'aliancas') || ok[0]
          E.chooseRunoff(o.id)
        }
      } else if (ph === 'result') {
        out.elec = out.elec || []
        out.elec.push({ de: game.office, alvo: game.election.target, won: game.election.result.won, gap: E.baseScore() - game.election.rival })
        if (process.env.DBG) console.log(estilo, 'cargo', game.election.target, 'rival', game.election.rival.toFixed(1), 'score', E.baseScore().toFixed(1), 'won', game.election.result.won, 'pop', game.stats.pop.toFixed(0), 'img', game.stats.img.toFixed(0), 'tv', game.election.tv)
        E.continueAfterResult()
      }
      else if (ph === 'plan') {
        const ps = E.country().promises
        const ids = estilo === 'cauteloso' ? [] : ps.slice(0, 2).map((p) => p.id)
        E.confirmPlan('Plano', ids)
      } else throw new Error('fase desconhecida ' + ph)
    } catch (e) {
      out.erro = `${ph}: ${e.message}`
      break
    }
    out.rodadas = game.total
    out.stage = game.stage
    if (game.bigOffer && !out.bigIds.has(game.bigOffer.id + ':' + game.bigOffer.year)) { out.bigIds.add(game.bigOffer.id + ':' + game.bigOffer.year); out.bigs = (out.bigs || []).concat(game.bigOffer.id) }
    if (game.cenario && out.cens[out.cens.length - 1] !== game.cenario.id) out.cens.push(game.cenario.id)
    for (const t of game.toasts) {
      if (t.id <= vistoT) continue
      vistoT = t.id
      const k = ((t.icon || '') + ' ' + String(t.msg || t.name || '')).replace(/[0-9R$.,%]+/g, '#').slice(0, 44)
      out.ev[k] = (out.ev[k] || 0) + 1
    }
    out.minCash = Math.min(out.minCash, game.stats.cash)
    out.minPop = Math.min(out.minPop, game.stats.pop)
    if (CARGO) {
      const w = game.world
      const sc = game.poder && game.poder.soc
      const m = game.world && game.world.m24
      const cnt2 = (k) => (out.ev['◆ ' + k] = (out.ev['◆ ' + k] || 0) + 1)
      if (w) {
        if (w.guerraDef && !prev.g) cnt2('invasão')
        if (w.ameacas.length > prev.a) cnt2('ameaça ' + w.ameacas[w.ameacas.length - 1].tipo)
        prev.g = !!w.guerraDef
        prev.a = w.ameacas.length
      }
      if (sc) {
        if (sc.movs.length > prev.m) cnt2('movimento social')
        if (sc.catast && !prev.c) cnt2('catástrofe')
        prev.m = sc.movs.length
        prev.c = !!sc.catast
      }
      if (m) {
        if (m.crise && !prev.k) cnt2('crise externa')
        prev.k = !!m.crise
      }
    }
  }
  if (guard >= 4000) out.erro = 'loop: fase ' + game.phase
  out.stats = { ...game.stats }
  out.uf = game.region && game.region.id
  out.leis = ((game.world && game.world.laws) || []).map((l) => l.tema + l.ous)
  out.pts = game.points
  out.office = game.office
  out.vit = game.history.length
  const c = (game.poder && game.poder.cnt) || {}
  out.blk = { ministro: 0, historia: 0, missao: 0, conspira: 0, redes: 0, rival: 0, pressao: 0, familia: 0, cenario: 0, leictx: 0, obras: 0, obrasprontas: 0, obraprob: 0, eco: 0, ecopend: 0, ecoesc: 0, pop: 0, poppend: 0, popprom: 0, popquebra: 0, part: 0, partpend: 0, partcoer: 0, crise: 0, criseok: 0, criseruim: 0, crisereg: 0, canalok: 0, canalruim: 0, jornalok: 0, jornalruim: 0, coletiva: 0, esc: 0, escok: 0, escruim: 0 }
  for (const [k, v] of Object.entries(c)) { const n = k.split(':')[1]; if (n in out.blk) out.blk[n] += v }
  const ms = game.poder && game.poder.mist
  out.mist = !ms ? 'nenhuma' : ms.fim ? ms.fim.tipo : 'ativa'
  out.missoes = ((game.poder && game.poder.missoes && game.poder.missoes.done) || []).length
  return out
}

const estilos = ESTILO === 'todos' ? ['equilibrado', 'estrategista', 'cauteloso', 'agressivo', 'aleatorio'] : [ESTILO]
const res = []
for (const est of estilos) {
  for (let i = 0; i < N; i++) {
    Math.random = mulberry32(seed++)
    mem.clear()
    for (const t of game.toasts.splice(0)) void t
    res.push(jogaCarreira(est))
  }
}
Math.random = realRandom

const por = (arr, f) => arr.reduce((m, x) => ((m[f(x)] = (m[f(x)] || 0) + 1), m), {})
const media = (arr, f) => (arr.length ? arr.reduce((a, x) => a + f(x), 0) / arr.length : 0)
const pct = (n, t) => ((100 * n) / t).toFixed(1) + '%'
console.log(`\n=== SIMULAÇÃO: ${N} carreiras por estilo ===`)
for (const est of estilos) {
  const r = res.filter((x) => x.estilo === est)
  const tot = r.length
  console.log(`\n--- ${est} ---`)
  console.log('chegou ao fim (presidente concluído):', pct(r.filter((x) => x.ok).length, tot))
  console.log('erros do motor:', r.filter((x) => x.erro).length, [...new Set(r.filter((x) => x.erro).map((x) => x.erro))].slice(0, 5))
  console.log('rodadas médias:', media(r, (x) => x.rodadas).toFixed(1), ' pontos médios:', media(r, (x) => x.pts || 0).toFixed(1))
  console.log('eleições vencidas (0..n):', por(r, (x) => x.vit))
  console.log('desfechos:', Object.entries(por(r, (x) => x.fim)).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${pct(v, tot)}`).join(' | '))
  console.log('estado final médio:', Object.fromEntries(['pop', 'eco', 'cash', 'soc', 'seg', 'img'].map((k) => [k, +media(r, (x) => x.stats[k]).toFixed(1)])))
}
if (CARGO) {
  const tot = res.length
  const ev = {}
  console.log('rodadas até o fim (média):', media(res, (x) => x.rodadas).toFixed(1))
  for (const r of res) for (const [k, v] of Object.entries(r.ev)) ev[k] = (ev[k] || 0) + v
  console.log(`\n=== eventos mais frequentes por carreira (${CARGO}) ===`)
  const rt = res.reduce((a, x) => a + x.rodadas, 0)
  console.log('(valores = ocorrências por 100 rodadas jogadas)')
  Object.entries(ev).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, v]) => console.log(((100 * v) / rt).toFixed(1).padStart(6), k))
  console.log('caixa mínimo médio:', media(res, (x) => x.minCash).toFixed(1), ' popularidade mínima média:', media(res, (x) => x.minPop).toFixed(1))
}
{
  const rt = res.reduce((a, x) => a + x.rodadas, 0) || 1
  const sum = (k) => res.reduce((a, x) => a + ((x.blk || {})[k] || 0), 0)
  console.log('\n=== BLOCOS 31/32: interações por 100 rodadas jogadas ===')
  for (const k of ['ministro', 'historia', 'missao', 'conspira', 'redes', 'rival', 'pressao', 'familia', 'cenario', 'leictx', 'obras', 'obrasprontas', 'obraprob', 'eco', 'ecopend', 'ecoesc', 'pop', 'poppend', 'popprom', 'popquebra', 'part', 'partpend', 'partcoer', 'crise', 'criseok', 'criseruim', 'crisereg', 'canalok', 'canalruim', 'jornalok', 'jornalruim', 'coletiva', 'esc', 'escok', 'escruim']) console.log(k.padEnd(10), ((100 * sum(k)) / rt).toFixed(2))
  console.log('missões concluídas por carreira:', media(res, (x) => x.missoes || 0).toFixed(2))
  console.log('conspiração (fim):', Object.entries(por(res, (x) => x.mist || 'nenhuma')).map(([k, v]) => `${k} ${pct(v, res.length)}`).join(' | '))
}
{
  const el = {}
  for (const r of res) for (const e of r.elec || []) {
    const k = `${e.de} → ${e.alvo === e.de ? 'reeleição' : e.alvo}`
    el[k] = el[k] || { n: 0, w: 0, gap: 0 }
    el[k].n++; el[k].w += e.won ? 1 : 0; el[k].gap += e.gap
  }
  console.log('\n=== eleições por trajeto (vitórias / folga média = nota do bot − nota do rival) ===')
  Object.entries(el).sort((a, b) => b[1].n - a[1].n).forEach(([k, v]) => console.log(k.padEnd(34), String(v.n).padStart(4), pct(v.w, v.n).padStart(7), (v.gap / v.n).toFixed(1).padStart(6)))
}
{
  console.log('\n=== REPETIÇÃO (BLOCO 36) ===')
  const jac = (a, b) => { const i = [...a].filter((x) => b.has(x)).length; return i / (a.size + b.size - i || 1) }
  for (const est of estilos) {
    const r = res.filter((x) => x.estilo === est && x.evIds.size)
    let sj = 0, nj = 0
    for (let i = 0; i + 1 < r.length; i += 2) { sj += jac(r[i].evIds, r[i + 1].evIds); nj++ }
    console.log(est.padEnd(12), 'eventos distintos/carreira:', media(r, (x) => x.evIds.size).toFixed(1), ' sobreposição entre pares:', nj ? ((100 * sj) / nj).toFixed(0) + '%' : '-', ' cenários/carreira:', media(r, (x) => x.cens.length).toFixed(1))
  }
  const dist = por(res.flatMap((x) => x.cens), (c) => c)
  console.log('cenários sorteados:', Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + v).join(' | '))
  const porUF = {}
  for (const r of res) { const k = r.uf || '?'; (porUF[k] = porUF[k] || []).push(r) }
  console.log('por UF (carreiras, vitórias médias, caixa final):', Object.entries(porUF).map(([k, v]) => `${k} n${v.length} v${media(v, (x) => x.vit).toFixed(2)} c${media(v, (x) => x.stats ? x.stats.cash : 0).toFixed(0)}`).join(' | '))
  { const bg = res.flatMap((x) => x.bigs || []); const g = bg.filter((x) => x.startsWith('gen:')); console.log('grandes eventos por carreira:', (bg.length / res.length).toFixed(1), ' gerados:', pct(g.length, bg.length || 1), ' tipos distintos:', new Set(bg).size, ' futebol fixo (estadual+copa do brasil+copa):', pct(bg.filter((x) => ['estadual', 'copadobrasil', 'copa'].includes(x)).length, bg.length || 1)) }
  console.log('leis distintas por carreira:', media(res, (x) => new Set(x.leis || []).size).toFixed(1))
}
const erros = res.filter((x) => x.erro)
if (erros.length) process.exitCode = 1
