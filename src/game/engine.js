import { billOutcome, billsOf, billById, statuteFx, billSupport } from './bills'
import { reactive } from 'vue'
import { settings, difficultyOf } from './settings'
import { countries } from './countries'
import { modsFor } from './traits'
import { affinity } from './countries/brasil-parties'
import { checkPromise } from './countries/brasil-plans'
import { hash01 } from './countries/brasil-geo'
import { OFFICES, PATHS, LEGACY_OFFICE } from './offices'
import { VICES, SUPLS, TEAMS, APPOINTEES, lockReason } from './team'
import { makeNews, makeSpecial } from './news'
import { mulberry32, todaySeed, weekSeed, ACHIEVEMENTS, makeRival, loadUnlocked, saveUnlocked, addHall, addWeekly } from './extras'
import { PARTIES } from './countries/brasil-parties'
import { DAY_FLAVOR, ACTION_ICON, holidayOf, makePost, slug, GENERIC_TAGS, candName } from './social'
import { MORE_FLAVOR } from './flavor'
import { BIG, bigWhen, BIG_TAGS } from './bigevents'
import { CRISES, CRISE_RESP, EMB, VIAGEM, SANCAO, ESPIO_ACOES } from './mundo24'
import { SETORES, SETOR_ACOES, MOVIMENTOS, MOV_RESP, VEICULOS, LINHAS, MIDIA_ACOES, CATASTROFES, CATAST_RESP } from './sociedade'
import { INIMIGOS, AMEACAS, GUERRA_ACOES } from './ameacas'
import { FIGURAS, EVENTOS } from './vida'
import { TEMAS_DEBATE, DEB_ABORDAGENS, DEB_FALAS, GRUPOS, BOATOS_FALSOS, BOATOS_REAIS, BOATO_ACOES } from './eleicao27'
import { PERFIS_CONJUGE, FAM_ACOES, FAM_EVENTOS, FIG_ACOES, SUC_PERFIS, SUC_ACOES } from './pessoas'
import { randomLook } from './look'
import { RV_TRAITS, RV_ESTAGIOS, RV_EVENTOS, RV_AUTO, RV_ACOES } from './rival30'
import { finalOf, saveFinal } from './finais'
import { REUNIOES, ABORDAGENS, FALAS, TRAITS, FICTICIOS, CADEIAS } from './reunioes'
import { PECS, PETREAS, MPS, ESTADOS, CONSULTAS, BLOCOS, TRATADOS, OPS, TECHS, TECH_PUSH, CHAIN, VOLTA_RIVAL, VOLTA_EXALIADO, MINISTRO_FASES, HIST_PARTIDOS } from './avancos'
import { makeContacts, ensureContacts, SCRIPTS, ROLES, KIND, ASKS, CHAT, LIGAR } from './contacts'
import { makeReactions } from './reactions'
import { DEALS, STUDIES, POWER_ACTIONS, ESTUDAR, ACORDO, MAX_DEALS, STUDY_MAX, studyNeed, STUDY_FLAVOR } from './gabinete'
export { DEALS, STUDIES, ESTUDAR, ACORDO, MAX_DEALS, STUDY_MAX, studyNeed }
import { MIN_AGE_OFFICE } from './countries/brasil-traits'
import { STAGE_SPHERE, FAME_OFFSETS, BAND_STAT, DEFAULT_FLAGS, randomIdeologyName, makeOwnParty } from './ideas'
import { PARTNERS, PARTNER_PASSIVE, RIVALRY, DIPLO_ACTIONS, WARS, STANCE, DEF_ACTIONS, NUC, FED, FED_ACTIONS, TEMAS, OUSADIA, LAW_PREFIX } from './world'

export const STATS = [
  { k: 'pop', label: 'Popularidade', short: 'Pop', icon: '❤️', tip: 'Quanto o povo gosta de você. Pesa muito na eleição.' },
  { k: 'cong', label: 'Base política', short: 'Base', icon: '🏛️', tip: 'Apoio dos políticos. Cai sozinho a cada rodada.' },
  { k: 'eco', label: 'Economia', short: 'Eco', icon: '📈', tip: 'Emprego e renda. Mexe na popularidade e no caixa.' },
  { k: 'cash', label: 'Caixa', short: 'Caixa', icon: '💰', tip: 'Dinheiro disponível. Se zerar por duas rodadas, o governo colapsa.' },
  { k: 'soc', label: 'Saúde e educação', short: 'Social', icon: '🩺', tip: 'Cai sozinho. Investir mantém o povo contente.' },
  { k: 'seg', label: 'Segurança', short: 'Seg', icon: '🛡️', tip: 'Cai sozinho. Investir mantém a ordem.' },
  { k: 'img', label: 'Imagem e integridade', short: 'Imagem', icon: '⚖️', tip: 'Sua reputação. Escândalos pesam aqui.' },
]

export const CAMPAIGNS = [
  { id: 0, name: 'Campanha enxuta', desc: 'Santinho, boca a boca e fé.', cost: 0, bonus: 0 },
  { id: 1, name: 'Campanha forte', desc: 'TV, rádio e muito trio elétrico.', cost: 10, bonus: 3 },
  { id: 2, name: 'Campanha máxima', desc: 'Marqueteiro caro e carreata em todo o estado.', cost: 25, bonus: 6 },
]

export const BUDGET_KEYS = [
  { k: 'soc', label: 'Saúde e educação', icon: '🩺', hint: 'sobe Social' },
  { k: 'seg', label: 'Segurança', icon: '🛡️', hint: 'sobe Segurança' },
  { k: 'eco', label: 'Obras e economia', icon: '🏗️', hint: 'sobe Economia' },
  { k: 'com', label: 'Comunicação', icon: '📣', hint: 'sobe Popularidade' },
]
export const BUDGET_PRESETS = [
  { id: 'eq', name: 'Equilibrado', desc: 'Divide por igual. Efeito neutro.', b: { soc: 20, seg: 20, eco: 20, com: 20 } },
  { id: 'aus', name: 'Austeridade', desc: 'Guarda dinheiro, mas os serviços sofrem. Só vale com o caixa no vermelho.', b: { soc: 18, seg: 18, eco: 18, com: 12 } },
  { id: 'soc', name: 'Social', desc: 'Foco em saúde e educação. Gasta mais.', b: { soc: 35, seg: 20, eco: 20, com: 15 } },
  { id: 'des', name: 'Desenvolvimento', desc: 'Obras e crédito primeiro.', b: { soc: 20, seg: 15, eco: 35, com: 15 } },
  { id: 'ord', name: 'Ordem', desc: 'Segurança acima de tudo.', b: { soc: 15, seg: 35, eco: 20, com: 15 } },
  { id: 'pop', name: 'Marketing', desc: 'Propaganda para segurar a popularidade.', b: { soc: 20, seg: 20, eco: 20, com: 30 } },
]

const SAVE_KEY = 'rumo-ao-planalto-v2'
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v))

let rng = Math.random
function setRng() {
  if (game.daily) {
    rng = mulberry32(game.seed)
    for (let i = 0; i < game.rngN; i++) rng()
  } else rng = Math.random
}
const R = () => {
  if (game.daily) game.rngN++
  return rng()
}
const rnd = (a, b) => a + R() * (b - a)

function blankWorld() {
  return { rel: { eua: 50, china: 50, ue: 50, arg: 55, rus: 45, ori: 50, india: 50, japao: 50, afr: 52, lat: 52, onu: 50 }, wars: [], pending: null, fa: 55, nuc: { angra: 0, sub: 0, enr: 0 }, nucDone: [], blocos: [], tratados: [], ops: [], pactos: [], ameacas: [], guerraDef: null, tech: { done: [], prog: {}, foco: null }, fed: {}, laws: [], pts: 2, lawUsed: false, last: null }
}

const blank = () => ({
  phase: 'start', // start | event | outcome | actions | campaign | result | plan | over | end
  countryId: 'brasil',
  name: '',
  archetype: null,
  region: null,
  city: null,
  party: null,
  invites: [],
  novosPartidos: [],
  rejected: [],
  invitesTotal: 0,
  switches: 0,
  switched: false,
  rival: '',
  plan: { name: '', ids: [] },
  budget: { soc: 20, seg: 20, eco: 20, com: 20 },
  termDirty: 0,
  keptAll: 0,
  stage: 0,
  term: 1,
  turn: 0,
  total: 0,
  stats: { pop: 50, cong: 50, eco: 50, cash: 50, soc: 50, seg: 50, img: 55 },
  ap: 2,
  eventId: null,
  outcome: null,
  used: [],
  seen: [],
  log: [],
  history: [],
  delta: {},
  election: null,
  over: null,
  legacy: null,
  cashNeg: 0,
  daily: false,
  weekly: false,
  seed: 0,
  rngN: 0,
  dirty: 0,
  toasts: [],
  runUnlocked: [],
  points: 0,
  hallPos: -1,
  weeklyPos: -1,
  traits: {},
  sched: [], // [{ id, m }] ações marcadas no calendário da rodada
  eventMonth: 0,
  recap: null,
  field: [],
  fieldKey: '',
  feed: [],
  trends: [],
  followers: 0,
  fame: { mun: 50, est: 50, fed: 50 },
  ideas: { name: '', flags: [], force: 50 },
  myParty: null,
  mini: { plenario: false },
  poder: { statutes: [], timeline: [], pending: null, press: [], seen: [] },
  bigOffer: null,
  bigDone: [],
  flavorSeen: [],
  contacts: [],
  approach: null,
  talkSeen: [],
  heat: 0,
  rivalMod: 0,
  reactN: 0,
  reactT: -1,
  postT: -1,
  ageYears: 0,
  termStart: null,
  balance: null,
  look: null,
  power: 0,
  extra: 0,
  know: {},
  xp: {},
  deals: [],
  powerRes: null,
  office: 'vereador',
  difficulty: 'normal',
  clock: 0,
  team: { vice: null, supl: [], slots: {} },
  world: blankWorld(),
})

export const game = reactive(blank())

export const country = () => countries[game.countryId]
export const officeId = () => game.office || LEGACY_OFFICE[game.stage] || 'vereador'
export const officeInfo = () => OFFICES[officeId()]
export const stageInfo = () => ({ ...country().stages[game.stage], office: officeInfo().name, place: officeInfo().place, turns: officeInfo().turns })
export const countryList = () => Object.values(countries)
export const baseStats = () => blank().stats
export const ageNow = () => (game.traits && game.traits.idade != null ? Number(game.traits.idade) + Math.floor(roundStart() / 12) : null)
export const mods = () => modsFor(game.countryId, game.traits)
const kn = (k) => (game.know && game.know[k]) || 0
const KNOW_GAIN = (k) => (k === 'eco' ? 1 + 0.05 * kn('eco') : k === 'soc' ? 1 + 0.05 * kn('soc') : k === 'seg' ? 1 + 0.05 * kn('seg') : k === 'pop' ? 1 + 0.04 * kn('com') : 1)
const KNOW_LOSS = (k) => (k === 'img' ? Math.max(0.5, 1 - 0.04 * kn('com') - 0.03 * kn('dir')) : k === 'cash' ? Math.max(0.5, 1 - 0.03 * kn('ges')) : 1)
const modV = (k, v) => {
  const m = mods()
  const dif = difficultyOf(game.difficulty)
  return v > 0 ? v * (m.gain[k] || 1) * KNOW_GAIN(k) * dif.gain : v * (m.loss[k] || 1) * KNOW_LOSS(k) * dif.loss * (k === 'cash' ? 0.8 : 1)
}
export const effectiveFx = (fx) => Object.fromEntries(Object.entries(fx).map(([k, v]) => [k, Math.round(modV(k, v) * 10) / 10]))
export const partiesNow = () => [...country().parties, ...(game.novosPartidos || [])]
export const partyObj = () => (game.party === 'own' ? game.myParty : game.party ? partiesNow().find((p) => p.id === game.party) : null)
export const campaignCost = (c) => Math.round(c.cost * mods().camp * (partyObj()?.perks.camp || 1))
export const traitNames = () =>
  country()
    .traits.map((cat) => cat.options.find((o) => o.id === game.traits[cat.id])?.name)
    .filter(Boolean)
    .join(' · ')
export const ideology = () => {
  const o = country().traits.find((t) => t.id === 'ideologia')?.options.find((x) => x.id === game.traits.ideologia)
  return o?.axis || o?.id || 'independente'
}

// Dinheiro em reais (valor fictício proporcional ao cargo)
export function money(points, stage = game.stage) {
  const v = points * (stage === game.stage ? officeInfo().money : country().money[stage])
  const f = (n, u) => `R$ ${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${u}`
  if (v >= 1e9) return f(v / 1e9, 'bi')
  if (v >= 1e6) return f(v / 1e6, 'mi')
  return f(v / 1e3, 'mil')
}

/* ---------- utilidades ---------- */

function log(text) {
  game.log.unshift(text)
  if (game.log.length > 30) game.log.pop()
}

function toast(icon, msg) {
  game.toasts.push({ id: Math.random().toString(36).slice(2), icon, msg })
}

// Esfera da ação ou evento em andamento (municipal, estadual ou federal)
let curSphere = null
const sphereNow = () => curSphere || STAGE_SPHERE[game.stage]
function shiftFame(dv, sph) {
  for (const k of ['mun', 'est', 'fed']) game.fame[k] = clamp(game.fame[k] + dv * (sph === k ? 1 : sph ? 0.3 : 0.8))
}

function applyFx(fx, mod = false) {
  for (const k in fx) {
    const before = game.stats[k]
    const v = mod ? modV(k, fx[k]) : fx[k]
    game.stats[k] = clamp(before + v)
    const dv = game.stats[k] - before
    game.delta[k] = (game.delta[k] || 0) + dv
    if (k === 'pop') shiftFame(dv, mod ? sphereNow() : null)
    if (mod && dv) {
      const aligned = (game.ideas?.flags || []).filter((f) => BAND_STAT[f] === k).length
      if (aligned) game.ideas.force = clamp(game.ideas.force + dv * 0.5 * aligned)
    }
  }
}

export function hasSave() {
  try {
    return !!localStorage.getItem(SAVE_KEY)
  } catch {
    return false
  }
}

function checkAch() {
  const have = loadUnlocked()
  let changed = false
  for (const a of ACHIEVEMENTS) {
    if (have.includes(a.id) || !a.test(game)) continue
    have.push(a.id)
    changed = true
    game.toasts.push({ id: a.id, icon: a.icon, name: a.name })
    game.runUnlocked.push(a.id)
  }
  if (changed) saveUnlocked(have)
}

function computePoints(ended) {
  const s = game.stats
  const avg = (s.pop + s.eco + s.soc + s.seg + s.img) / 5
  return Math.round(game.history.length * 10 + game.stage * 6 + avg + (game.term >= 2 ? 10 : 0) + (ended ? 15 : 0) + game.keptAll * 5 + (game.poder && game.poder.sucessao && game.poder.sucessao.fim && game.poder.sucessao.fim.won ? 12 : 0))
}

function finalize(ended) {
  game.points = computePoints(ended)
  const fin = finalOf(game)
  game.final = { id: fin.id }
  saveFinal(fin.id)
  checkAch()
  game.hallPos = addHall({
    name: game.name,
    region: game.region.id,
    label: ended ? game.legacy.title : game.over.title,
    points: game.points,
    daily: game.daily,
    weekly: game.weekly,
    date: new Date().toLocaleDateString('pt-BR'),
  })
  if (game.weekly) {
    game.weeklyPos = addWeekly({ name: game.name, region: game.region.id, label: ended ? game.legacy.title : game.over.title, points: game.points, seed: game.seed, date: new Date().toLocaleDateString('pt-BR') })
  }
}

function save() {
  checkAch()
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game))
  } catch {}
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {}
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const saved = JSON.parse(raw)
    Object.assign(game, blank(), saved)
    if (!saved.office) {
      game.office = LEGACY_OFFICE[game.stage] || 'vereador'
      game.clock = game.stage * 48 + (game.ageYears || 0) * 12
      game.ageYears = 0
    }
    if (!game.team || !game.team.slots) game.team = { vice: null, supl: [], slots: {} }
    autoTeam()
    ensureWorld()
    game.toasts = []
    setRng()
    return true
  } catch {
    return false
  }
}

export function resetGame() {
  clearSave()
  Object.assign(game, blank())
  setRng()
}

/* ---------- partidos ---------- */

// Chance de um partido aceitar o pedido de filiação
export function acceptChance(party, ideo, stats, stage = 0) {
  if (party.open) return 1
  const aff = affinity(ideo, party)
  const v = 0.18 + aff * 0.2 + (stats.cong - 50) / 180 + (stats.img - 50) / 260 + (stats.pop - 50) / 300 + stage * 0.06 - (party.hard || 0) + (party.rich ? (stats.cash - 50) / 90 : 0)
  return Math.max(party.hard ? 0.03 : 0.05, Math.min(0.92, v))
}

// Convites iniciais (determinísticos, para o desafio do dia ficar igual para todos)
export function initialInvites(parties, ideo, stats, name) {
  return parties.filter((p) => !p.open && hash01(p.id + name + ideo) < acceptChance(p, ideo, stats) * 0.5).map((p) => p.id)
}

export function partyChanceNow(p) {
  return acceptChance(p, ideology(), game.stats, game.stage)
}

export function askJoin(id) {
  const p = partiesNow().find((x) => x.id === id)
  if (!p || p.id === game.party || game.switched) return null
  const invited = game.invites.includes(id)
  const ok = invited || R() < partyChanceNow(p)
  if (!ok) {
    game.rejected.push(id)
    log(`${p.sigla} recusou sua filiação.`)
    save()
    return { ok: false, text: `O ${p.sigla} recusou o seu pedido. A executiva não se animou com o seu perfil.` }
  }
  const first = !game.party
  game.delta = {}
  if (!first) {
    applyFx({ img: -3, cong: invited ? -3 : -8 })
    game.switches++
    game.switched = true
  }
  game.party = id
  game.invites = game.invites.filter((x) => x !== id)
  game.rejected = game.rejected.filter((x) => x !== id)
  log(first ? `Filiou-se ao ${p.sigla}.` : `Trocou para o ${p.sigla}.`)
  save()
  return { ok: true, text: first ? `Bem-vindo(a) ao ${p.sigla}!` : `Você é do ${p.sigla} agora. Os ex-colegas não gostaram.` }
}

export function declineInvite(id) {
  game.invites = game.invites.filter((x) => x !== id)
  save()
}

function maybeInvite() {
  const chance = 0.14 + (game.stats.pop > 65 ? 0.1 : 0) + game.stage * 0.03
  if (R() > chance) return
  const pool = partiesNow().filter((p) => p.id !== game.party && !game.invites.includes(p.id) && partyChanceNow(p) > 0.3)
  if (!pool.length) return
  const p = pool[Math.floor(R() * pool.length)]
  game.invites.push(p.id)
  game.invitesTotal++
  toast('✉️', `Convite do ${p.sigla} para se filiar`)
  log(`O ${p.sigla} te convidou para se filiar.`)
}

/* ---------- plano de governo e orçamento ---------- */

export function randomPlanName(R2 = Math.random) {
  const [a, b] = country().planNames
  return `${a[Math.floor(R2() * a.length)]} ${b[Math.floor(R2() * b.length)]}`
}

export function promiseValue(p) {
  return p.special === 'dirty' ? Math.max(0, 1 - game.termDirty) * 100 : game.stats[p.stat]
}

export function planStatus() {
  return game.plan.ids
    .map((id) => country().promises.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({ p, kept: checkPromise(p, game.stats, game.termDirty), value: promiseValue(p) }))
}

export function setPlan(name, ids) {
  game.plan = { name: name.trim() || 'Plano de governo', ids: [...ids] }
  game.termDirty = 0
  if (ids.length) applyFx({ pop: ids.length * 1.5 })
  game.termStart = { ...game.stats }
  log(`Plano de governo: "${game.plan.name}" (${ids.length} promessa${ids.length === 1 ? '' : 's'}).`)
}

export function confirmPlan(name, ids) {
  setPlan(name, ids)
  game.delta = {}
  beginTurn()
}

export function budgetRes(b = game.budget) {
  return 100 - (b.soc + b.seg + b.eco + b.com)
}
export function budgetFx(b = game.budget) {
  const res = budgetRes(b)
  const st = game.stats
  // Gastar a mais rende menos, mas rende bem mais quando o número está baixo (a necessidade é maior)
  const f = (x, k) => (x > 20 ? (x - 20) * 0.92 * (1 + Math.max(0, Math.min(1, (58 - st[k]) / 36))) : x - 20)
  return {
    soc: f(b.soc, 'soc') * 0.2,
    seg: f(b.seg, 'seg') * 0.24,
    eco: f(b.eco, 'eco') * 0.16,
    pop: f(b.com, 'pop') * 0.16,
    img: f(b.com, 'img') * 0.02,
    cash: (res - 20) * (res < 20 ? 0.25 : 0.12),
  }
}
export function setBudget(b) {
  game.budget = { ...b }
  save()
}

// Variação prevista no fim da rodada (sem o ruído da economia)
function turnDelta(noise) {
  const s = game.stats
  const fundamentals =
    50 + (s.eco - 50) * 0.4 + (s.soc - 50) * 0.25 + (s.seg - 50) * 0.2 + (s.img - 50) * 0.15 - [0, 2, 5, 8][game.stage] + mods().baseP
  const d = {
    pop: (fundamentals - s.pop) * 0.18,
    eco: (50 - s.eco) * 0.05 + (s.cash < 15 ? -2 : 0) + (noise ? rnd(-2, 2) : 0),
    cash: 4 + (s.eco - 50) * 0.12 + [0, 0.3, 0.6, 1][game.stage],
    soc: -1.5,
    seg: -1.5,
    cong: -2.5,
    img: -1 + (s.cong < 25 ? -1 : 0),
  }
  const ag = ageNow()
  if (ag != null) {
    if (ag < 30) {
      d.pop += 0.2
      d.cong -= 0.2
    } else if (ag >= 60) {
      d.cong += 0.25
      d.pop -= ag >= 70 ? 0.4 : 0.2
    }
  }
  if (s.cash <= 0) {
    d.pop -= 4
    d.img -= 3
  }
  const b = budgetFx()
  for (const k in b) d[k] += b[k]
  const p = partyObj()
  if (p) {
    d.cash += p.perks.cash || 0
    d.cong += p.perks.cong || 0
    d.pop += p.perks.pop || 0
    d.img += p.perks.img || 0
    d.eco += p.perks.eco || 0
  }
  return d
}
export function projectTurn() {
  const d = turnDelta(false)
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, clamp(game.stats[k] + v) - game.stats[k]]))
}

/* ---------- mapa eleitoral ---------- */

const IDEO = { esquerda: -1, centro: 0, direita: 1, independente: 0 }
export function estimatedShare() {
  const rivalBase = [53, 56, 59, 62][game.stage] + (game.stage === 3 && game.term >= 2 ? 2 : 0)
  return toShare(baseScore(), game.election ? game.election.rival : rivalBase)
}
export function stateEstimates() {
  const regions = country().regions
  const me = IDEO[ideology()] ?? 0
  const avg = regions.reduce((a, r) => a + Math.abs((r.lean || 0) - me), 0) / regions.length
  const est = game.election?.result ? game.election.result.share : game.election ? pollShare() : estimatedShare()
  const out = {}
  for (const r of regions) {
    const fit = (avg - Math.abs((r.lean || 0) - me)) * 9
    const home = r.id === game.region.id ? 6 : 0
    out[r.mapId || r.id.toLowerCase()] = clamp(est + fit + home + (hash01(r.id + game.name) - 0.5) * 6, 15, 85)
  }
  return out
}

/* ---------- fluxo do jogo ---------- */

export function startGame({ countryId = 'brasil', name, archetypeId, regionId, cityName, partyId = null, ownParty = null, plan, daily = false, weekly = false, traits = {}, look = null }) {
  daily = daily || weekly
  Object.assign(game, blank(), { countryId, daily, weekly, seed: weekly ? weekSeed() : daily ? todaySeed() : 0, difficulty: daily ? 'normal' : settings.difficulty })
  setRng()
  const c = country()
  game.name = (name || '').trim() || 'Candidato(a)'
  game.archetype = c.archetypes.find((a) => a.id === archetypeId) || c.archetypes[0]
  const r = c.regions.find((x) => x.id === regionId) || c.regions[0]
  game.region = { id: r.id, name: r.name, bonus: r.bonus, lean: r.lean, mapId: r.mapId }
  const city = r.cities.find((x) => x.name === cityName) || r.cities[0]
  game.city = { ...city }
  game.traits = { ...traits }
  game.look = look
  game.rival = makeRival(R)
  game.contacts = makeContacts(R, { religioso: !!traits.religiao && traits.religiao !== 'sem', rival: game.rival, religiao: traits.religiao })
  applyFx(game.archetype.fx)
  applyFx(modsFor(countryId, traits).start)
  applyFx(c.citySizes[city.size].fx)
  if (partyId) game.party = partyId
  if (ownParty) {
    game.myParty = makeOwnParty({ ...ownParty, ideo: ideology() })
    game.party = 'own'
    applyFx({ cash: -5, cong: -4 })
  }
  game.ideas = { name: randomIdeologyName(R), flags: [...(DEFAULT_FLAGS[ideology()] || DEFAULT_FLAGS.centro)], force: 50 }
  resetFame()
  autoTeam()
  ensureWorld()
  game.delta = {}
  log(`Começa a carreira como ${stageInfo().office} em ${game.city.name} (${game.region.id}).`)
  if (ownParty) log(`Fundou o partido ${partyObj().sigla}.`)
  else if (partyId) log(`Filiado(a) ao ${partyObj().sigla}.`)
  setPlan(plan?.name || randomPlanName(R), plan?.ids || [])
  game.delta = {}
  beginTurn()
}

// vereador e prefeito dividem o mesmo nível; estes eventos só fazem sentido para um dos dois
const SO_VEREADOR = ['buraco', 'cargos', 'poste', 'castracao', 'alvara', 'superfat', 'prefeito_cargo', 'jovem_demais', 'camara_veta', 'enchente_bairro']
const SO_PREFEITO = ['lrf_alerta']
const SO_FEDERAL = ['emendaPix', 'reformaTributaria']
export const eventoServe = (e) => {
  const o = officeId()
  if (e.only && !(Array.isArray(e.only) ? e.only : [e.only]).includes(o)) return false
  if (o === 'prefeito' && SO_VEREADOR.includes(e.id)) return false
  if (o === 'vereador' && SO_PREFEITO.includes(e.id)) return false
  if (o === 'dep_estadual' && SO_FEDERAL.includes(e.id)) return false
  return true
}
function drawEvent() {
  const c = country()
  const pool = c.events.filter((e) => e.stages.includes(game.stage) && eventoServe(e) && (!e.cond || e.cond(game)))
  let fresh = pool.filter((e) => !game.seen.includes(e.id))
  if (!fresh.length) {
    game.seen = game.seen.filter((id) => !pool.some((e) => e.id === id))
    fresh = pool
  }
  const e = fresh[Math.floor(R() * fresh.length)]
  game.seen.push(e.id)
  return e.id
}

const subst = (t) =>
  t
    .replaceAll('{estado}', game.region.name)
    .replaceAll('{cidade}', game.city?.name || game.region.name)
    .replaceAll('{partido}', partyObj()?.sigla || 'partido')
    .replaceAll('{rival}', game.rival || 'seu rival')
    .replaceAll('{pasta}', hotName())
    .replaceAll('{guerra}', warLabel())
    .replaceAll('{cargo}', CARGO_TXT[officeId()] || 'Excelência')

const CARGO_TXT = { vereador: 'Vereador(a)', prefeito: 'Prefeito(a)', dep_estadual: 'Deputado(a) Estadual', dep_federal: 'Deputado(a) Federal', senador: 'Senador(a)', governador: 'Governador(a)', presidente: 'Presidente' }

export function currentEvent() {
  const e = country().events.find((x) => x.id === game.eventId)
  if (!e) return null
  return { ...e, title: subst(e.title), text: subst(e.text), choices: e.choices.map((c) => ({ ...c, label: subst(c.label) })) }
}

/* ---------- esferas, ideias e partido próprio ---------- */

export function resetFame() {
  const o = FAME_OFFSETS[game.stage]
  game.fame = { mun: clamp(game.stats.pop + o[0]), est: clamp(game.stats.pop + o[1]), fed: clamp(game.stats.pop + o[2]) }
}
export const targetId = () => (game.election && game.election.target) || officeId()
export const electionSphere = () => OFFICES[targetId()].sphere

export function setIdeas(name, flags) {
  if (flags.length !== 3) return false
  const changed = flags.slice().sort().join() !== game.ideas.flags.slice().sort().join()
  game.ideas.name = (name || '').trim() || game.ideas.name
  game.ideas.flags = [...flags]
  if (changed) {
    game.delta = {}
    applyFx({ img: -2 })
    game.ideas.force = clamp(game.ideas.force - 10)
    log(`Mudou de bandeiras: ${game.ideas.name}.`)
  }
  save()
  return true
}

export function foundReasons() {
  const r = []
  if (game.myParty) r.push('Você já fundou um partido.')
  if (game.stats.cong < 35) r.push('Precisa de base política mínima de 35.')
  if (game.stats.pop < 35) r.push('Precisa de popularidade mínima de 35.')
  if (game.stats.cash < 10) r.push('Precisa de caixa mínimo de 10 para a fundação.')
  return r
}

export function foundParty({ name, sigla, color, slogan, focus }) {
  if (foundReasons().length) return false
  const sg = (sigla || '').toUpperCase().replace(/[^A-Z]/g, '')
  if (sg.length < 2 || sg.length > 6 || (name || '').trim().length < 4) return false
  game.delta = {}
  applyFx({ cash: -10, cong: -3, img: 2 })
  game.myParty = makeOwnParty({ name: name.trim(), sigla: sg, color, slogan: (slogan || '').trim() || 'Pensar no povo primeiro.', ideo: ideology(), focus })
  game.party = 'own'
  game.invites = []
  toast('🎗️', `Você fundou o ${sg}!`)
  log(`Fundou o partido ${sg}.`)
  pushPosts(3, 'up', slug(sg))
  save()
  return true
}

/* ---------- calendário, disputa e redes ---------- */

export const monthsPer = () => Math.round((officeInfo().years * 12) / officeInfo().turns)
export const roundStart = () => (game.clock || 0) + game.turn * monthsPer()
export const careerMonth = () => roundStart() + monthsPer()

function newField() {
  const sig = () => PARTIES[Math.floor(R() * PARTIES.length)].sigla
  const n = [4, 3, 3, 3][game.stage]
  const f = [{ name: game.rival, sigla: sig(), w: 0, rival: true }]
  for (let i = 0; i < n; i++) f.push({ name: candName(R), sigla: sig(), w: 8 + R() * 22, rival: false })
  game.field = f
  game.fieldKey = `${officeId()}-${game.term}`
}

function driftField() {
  if (game.fieldKey !== `${officeId()}-${game.term}`) newField()
  game.field[0].name = game.rival
  for (const f of game.field) if (!f.rival) f.w = clamp(f.w + rnd(-4, 4), 4, 34)
}

// ranking de intenção de voto (inclui o jogador). Mantém a ordem jogador x rival coerente com a eleição real.
export function raceTable() {
  const s = clamp(game.election ? (game.election.result ? game.election.result.share : pollShare()) : estimatedShare(), 20, 80)
  const rows = [{ name: game.name, sigla: partyObj()?.sigla || 'sem partido', me: true, w: s }]
  for (const f of game.field) rows.push({ name: f.name, sigla: f.sigla, rival: f.rival, w: f.rival ? 100 - s : f.w })
  const tot = rows.reduce((a, r) => a + r.w, 0)
  const valid = 92
  for (const r of rows) r.share = (r.w / tot) * valid
  rows.sort((a, b) => b.share - a.share)
  rows.forEach((r, i) => (r.pos = i + 1))
  return { rows, blank: 100 - valid }
}

export const followersFor = () => Math.round((20 + game.stats.pop * 3 + game.stats.img) * [12, 400, 5000, 60000][game.stage] * 0.01 * 10) * 10

function tone(fx) {
  const sc = (fx.pop || 0) + (fx.img || 0) * 0.6
  return sc >= 2 ? 'up' : sc <= -2 ? 'down' : 'flat'
}

function pushPosts(n, tn, extraTag) {
  const ctx = {
    who: game.name,
    city: game.city?.name || game.region.name,
    rival: game.rival,
    tag: extraTag || 'Politica',
    tone: tn,
    stage: game.stage,
  }
  for (let i = 0; i < n; i++) {
    let p
    for (let t = 0; t < 8; t++) {
      p = makePost(R, { ...ctx, tone: R() < 0.2 ? 'flat' : tn })
      if (!game.feed.slice(0, 14).some((x) => x.text === p.text)) break
    }
    game.feed.unshift(p)
  }
  game.feed = game.feed.slice(0, 40)
}

function pushTrend(label, heat) {
  game.trends = [{ label, heat }, ...game.trends.filter((t) => t.label !== label)].slice(0, 12)
}

function pickBig() {
  const mp = monthsPer()
  const start = roundStart()
  const c = []
  for (let i = 0; i < mp; i++) {
    const abs = start + i
    for (const b of BIG) {
      if (!b.stages.includes(game.stage) || !bigWhen(b, abs)) continue
      if (game.bigDone.includes(`${b.id}:${Math.floor(abs / 12)}`)) continue
      c.push({ id: b.id, m: i, icon: b.icon, name: b.name, year: Math.floor(abs / 12) })
    }
  }
  if (!c.length || R() > 0.9) return null
  return c[Math.floor(R() * c.length)]
}

export function currentBig() {
  const o = game.bigOffer
  if (!o || o.done) return null
  const b = BIG.find((x) => x.id === o.id)
  return { ...b, title: subst(b.title), text: subst(b.text), choices: b.choices.map((c) => ({ ...c, label: subst(c.label) })) }
}

export function chooseBig(i) {
  const b = currentBig()
  if (!b) return
  const ch = b.choices[i]
  let res = ch
  let lucky = null
  if (ch.risk) {
    lucky = R() < ch.risk
    if (!lucky) res = { ...ch, ...ch.alt }
  }
  game.delta = {}
  curSphere = b.sphere
  applyFx(res.fx, true)
  curSphere = null
  const loved = (BIG_TAGS[b.id] || []).includes(game.traits.paixao)
  if (loved) applyFx({ pop: 2, img: 1 }, true)
  if ((res.fx.img || 0) <= -6) {
    game.dirty++
    game.termDirty++
  }
  game.bigOffer.done = true
  game.bigOffer.label = ch.label
  game.bigOffer.out = res.out + (loved ? ' Sua paixão ajudou: +pop e +imagem.' : '')
  game.bigOffer.risky = !!ch.risk
  game.bigOffer.lucky = lucky
  game.bigDone.push(`${b.id}:${game.bigOffer.year}`)
  pushPosts(2, tone(res.fx), slug(b.name).slice(0, 16))
  pushTrend('#' + slug(b.name).slice(0, 16), 70)
  log(`${b.title}: ${ch.label}.`)
  if (!checkOver()) save()
}

// série de números por rodada (alimenta os gráficos do resumo de mandato)
function serieAdd() {
  if (!game.poder) return
  const p = game.poder
  p.serie = p.serie || []
  const st = game.stats
  p.serie.push({ st: game.stage, tm: game.term, t: game.turn, pop: Math.round(st.pop), eco: Math.round(st.eco), cash: Math.round(st.cash), soc: Math.round(st.soc), seg: Math.round(st.seg), img: Math.round(st.img), cong: Math.round(st.cong) })
  if (p.serie.length > 120) p.serie.splice(0, p.serie.length - 120)
}
export const serieNow = () => (game.poder && game.poder.serie) || []

function beginTurn() {
  serieAdd()
  game.ap = 2
  game.used = []
  game.sched = []
  game.outcome = null
  game.recap = null
  game.mini = { plenario: false }
  game.bigOffer = pickBig()
  if (game.approach && !game.approach.done) {
    const c0 = contactOf(game.approach.cid)
    if (c0) c0.rel = clampRel(c0.rel - 2)
  }
  game.approach = pickApproach()
  maybeInvite()
  game.heat = Math.max(0, (game.heat || 0) * 0.85 - 2)
  tickWorld()
  roundPoder()
  if (game.phase === 'over') return
  game.eventId = game.team && game.team.hot ? 'equipe_escandalo' : game.world.pending ? 'guerra_posicao' : game.heat >= 25 && R() < Math.min(0.65, game.heat / 110) ? 'operacao' : drawEvent()
  game.eventMonth = Math.floor(R() * monthsPer())
  driftField()
  game.followers = followersFor()
  game.phase = 'event'
  save()
}

export function chooseOption(i) {
  const ev = currentEvent()
  const ch = ev.choices[i]
  let res = ch
  let lucky = null
  if (ch.risk) {
    lucky = R() < ch.risk
    if (!lucky) res = { ...ch, ...ch.alt }
  }
  game.delta = {}
  curSphere = ev.sphere || STAGE_SPHERE[game.stage]
  applyFx(res.fx, true)
  curSphere = null
  if ((res.fx.img || 0) <= -6) {
    game.dirty++
    game.termDirty++
  }
  if (res.heat) game.heat = clamp(game.heat + res.heat)
  evHook(ev.id, i, lucky)
  const news = makeNews(
    { who: game.name, state: game.region.name, city: game.city?.name || game.region.name, party: partyObj()?.sigla || 'MRB', rival: game.rival, office: stageInfo().office, fx: res.fx, total: game.total, pop: game.stats.pop },
    R,
  )
  news.reactions = makeReactions({ who: game.name, tone: news.tone, contacts: game.contacts }, R)
  if (game.poder && game.poder.press.length) news.side = [...game.poder.press.splice(0, 2), ...(news.side || [])].slice(0, 3)
  game.outcome = { label: ch.label, text: subst(res.out), title: ev.title, news, risky: !!ch.risk, lucky }
  const tn = tone(res.fx)
  game.outcome.tone = tn
  pushPosts(3, tn, slug(ev.title).slice(0, 18))
  pushTrend('#' + slug(ev.title).slice(0, 18), 60 + Math.abs((res.fx.pop || 0) + (res.fx.img || 0)) * 4)
  log(`${ev.title}: ${ch.label}.`)
  game.phase = 'outcome'
  if (!checkOver()) save()
}

export function continueOutcome() {
  game.phase = 'actions'
  game.delta = {}
  save()
}

const ACTION_SPHERE = { rodar: 'mun', bancada: 'fed', social: 'mun', seguranca: 'est', economia: 'est', midia: 'fed', cortar: 'est', transparencia: 'fed' }
export const SPHERE_ACTIONS = [
  { id: 'mutirao', stages: [0], sphere: 'mun', name: 'Mutirão no bairro', desc: 'Meter a mão na massa: limpeza, pintura e cadeira na calçada.', fx: { pop: 3, soc: 3, cash: -3 } },
  { id: 'audiencia', stages: [0], sphere: 'mun', name: 'Audiência pública', desc: 'Ouvir o bairro, anotar tudo e dar retorno.', fx: { img: 3, pop: 1, cong: -1 } },
  { id: 'agendaBr', stages: [1], offs: ['dep_federal', 'senador'], sphere: 'fed', name: 'Agenda em Brasília', desc: 'Ministérios, gabinetes e corredores.', fx: { cong: 4, img: 1, cash: -2 } },
  { id: 'projeto', stages: [1, 3], offs: ['dep_federal', 'senador', 'presidente'], sphere: 'fed', name: 'Projeto de lei de impacto', desc: 'Um projeto que dá manchete nacional.', fx: { cong: 3, img: 2, pop: 1, cash: -2 } },
  { id: 'obraestado', stages: [2], sphere: 'est', name: 'Obra estadual', desc: 'Estrada, ponte ou hospital regional.', fx: { eco: 4, pop: 2, cash: -5 } },
  { id: 'interior', stages: [1, 2], sphere: 'est', name: 'Caravana pelo interior', desc: 'Visitar cidades pequenas que nunca recebem político.', fx: { pop: 4, cong: 1, cash: -3 } },
  { id: 'diplomacia', stages: [3], sphere: 'fed', name: 'Agenda internacional', desc: 'Encontros com chefes de Estado e empresários.', fx: { eco: 3, img: 2, cash: -3 } },
  // decisões de cada cargo

  // formas de recuperar o caixa (cada cargo tem as suas)
  { id: 'arrecadacao', stages: [0, 2, 3], offs: ['prefeito', 'governador', 'presidente'], sphere: 'fed', name: 'Reforçar a arrecadação', desc: 'Cobrar dívida ativa e fiscalizar sonegação. Entra dinheiro, mas ninguém gosta de pagar.', fx: { cash: 6, pop: -1.5, eco: -0.5 } },
  { id: 'parceriapriv', stages: [0, 2, 3], offs: ['prefeito', 'governador', 'presidente'], sphere: 'fed', name: 'Parceria com a iniciativa privada', desc: 'Concessões e PPPs: o caixa respira e o investimento chega.', fx: { cash: 5, eco: 1, img: -1, soc: -0.5 } },
  { id: 'captar', stages: [0, 2, 3], offs: ['prefeito', 'governador', 'presidente'], sphere: 'fed', name: 'Captar recursos de fora', desc: 'Prefeito e governador buscam convênios e crédito; presidente negocia com bancos multilaterais.', fx: { cash: 5, cong: -1, img: 0.5 } },
  { id: 'apoiadores', stages: [0, 1], offs: ['vereador', 'dep_estadual', 'dep_federal', 'senador'], sphere: 'mun', name: 'Jantar de arrecadação com apoiadores', desc: 'Doações legais de quem acredita em você. Rende caixa e dá um pouco de fofoca.', fx: { cash: 5, img: -1, cong: 0.5 } },
  { id: 'fundopart', stages: [0, 1], offs: ['vereador', 'dep_estadual', 'dep_federal', 'senador'], sphere: 'mun', name: 'Cobrar o fundo do partido', desc: 'Repasse da legenda para o seu mandato. Quem tem poder no partido recebe mais.', fx: { cash: 4, cong: -0.5 } },
  { id: 'palestra', stages: [0, 1], offs: ['vereador', 'dep_estadual', 'dep_federal', 'senador'], sphere: 'mun', name: 'Palestras, livro e mídia', desc: 'Monetize o nome sem passar da linha. Rende pouco, mas rende imagem.', fx: { cash: 3, img: 1, pop: 0.5 } },
  { id: 'plenarioS', stages: [1], offs: ['senador'], sphere: 'fed', name: 'Discurso de peso no plenário do Senado', desc: 'A tribuna do Senado ainda reverbera. Imagem e voto de opinião.', fx: { img: 3, pop: 1, cong: -0.5 } },
  { id: 'sabatinar', stages: [1], offs: ['senador'], sphere: 'fed', name: 'Sabatinar uma autoridade', desc: 'Perguntas duras a um indicado do governo. Rende imagem, irrita o Planalto.', fx: { img: 3, cong: -1.5 } },
  { id: 'relatoria', stages: [1], offs: ['dep_federal'], sphere: 'fed', name: 'Disputar uma relatoria', desc: 'Quem relata, manda um pouco. Cada relatoria custa articulação.', fx: { cong: 3, img: 1, cash: -1 } },
  { id: 'caravanaE', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Audiência pública na sua região', desc: 'Leve a Assembleia ao interior e anote as demandas.', fx: { pop: 3, img: 1, cash: -1 } },
  // ações próprias do prefeito e do deputado estadual (dividem o nível com vereador e deputado federal)
  { id: 'obracidade', stages: [0], offs: ['prefeito'], sphere: 'mun', name: 'Obra na cidade', desc: 'Pavimentação, praça ou creche inaugurada com placa e fita.', fx: { eco: 3, pop: 2, cash: -4 } },
  { id: 'secretariado', stages: [0], offs: ['prefeito'], sphere: 'mun', name: 'Reunião de secretariado', desc: 'Cobrar metas das secretarias e acertar o rumo da gestão.', fx: { soc: 2, seg: 1, img: 1, cash: -1 } },
  { id: 'camarapref', stages: [0], offs: ['prefeito'], sphere: 'mun', name: 'Negociar com a Câmara', desc: 'Conversar com os vereadores antes de mandar um projeto.', fx: { cong: 4, cash: -1 } },
  { id: 'agendaEst', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Agenda no Palácio e nas secretarias', desc: 'Gabinetes do governo estadual e corredores da Assembleia.', fx: { cong: 4, img: 1, cash: -2 } },
  { id: 'emendaEst', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Emenda para os municípios da base', desc: 'Levar verba estadual para as cidades que te apoiam.', fx: { pop: 3, cong: 3, cash: -3 } },
  { id: 'cpiEst', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Pedir CPI na Assembleia', desc: 'Cobrar investigação sobre o governo estadual. A imprensa gosta, a base nem tanto.', fx: { img: 4, pop: 2, cong: -5 } },
  { id: 'frenteEst', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Criar frente parlamentar estadual', desc: 'Reunir colegas da Assembleia em torno de uma causa.', fx: { cong: 4, img: 2, cash: -2 } },
  { id: 'projetoEst', stages: [1], offs: ['dep_estadual'], sphere: 'est', name: 'Projeto de lei estadual de impacto', desc: 'Um projeto que dá manchete no estado inteiro.', fx: { cong: 3, img: 2, pop: 1, cash: -2 } },
  { id: 'fiscalizar', stages: [0], offs: ['vereador'], sphere: 'mun', name: 'Fiscalizar o prefeito', desc: 'Pedir documentos, visitar obras e cobrar na tribuna.', fx: { img: 4, pop: 1, cong: -3 } },
  { id: 'emendabairro', stages: [0], offs: ['vereador'], sphere: 'mun', name: 'Emenda para o bairro', desc: 'Garantir verba para uma obra pequena que o povo vê.', fx: { pop: 4, soc: 2, cong: -1, cash: -2 } },
  { id: 'emenda', stages: [1], offs: ['dep_federal', 'senador'], sphere: 'fed', name: 'Emenda para a sua base', desc: 'Levar verba federal para os municípios que te apoiam.', fx: { pop: 3, cong: 3, cash: -4 } },
  { id: 'cpi', stages: [1], offs: ['dep_federal', 'senador'], sphere: 'fed', name: 'Assinar pedido de CPI', desc: 'Cobrar investigação. A imprensa gosta, a bancada nem tanto.', fx: { img: 4, pop: 2, cong: -5 } },
  { id: 'frente', stages: [1], offs: ['dep_federal', 'senador'], sphere: 'fed', name: 'Criar frente parlamentar', desc: 'Reunir colegas em torno de uma causa e ganhar espaço.', fx: { cong: 4, img: 2, cash: -2 } },
  { id: 'pacto', stages: [2], sphere: 'est', name: 'Pacto com os prefeitos', desc: 'Dividir obras e metas com os prefeitos do estado.', fx: { cong: 5, pop: 1, cash: -3 } },
  { id: 'concessao', stages: [2], sphere: 'est', name: 'Concessão e parceria privada', desc: 'Passar um serviço para a iniciativa privada. Entra caixa, sai discussão.', fx: { eco: 4, cash: 5, img: -1, soc: -1 } },
  { id: 'forcatarefa', stages: [2], sphere: 'est', name: 'Força-tarefa de segurança', desc: 'Polícias integradas em uma grande operação.', fx: { seg: 6, pop: 1, cash: -6 } },
  { id: 'mp', stages: [3], sphere: 'fed', name: 'Medida provisória', desc: 'Governar por decreto. Rápido e ruidoso.', fx: { eco: 3, pop: 2, cong: -4 } },
  { id: 'reforma', stages: [3], sphere: 'fed', name: 'Reforma ministerial', desc: 'Trocar ministros para agradar a base do Congresso.', fx: { cong: 6, img: -1, cash: -1 } },
  { id: 'cadeia', stages: [3], sphere: 'fed', name: 'Pronunciamento em cadeia nacional', desc: 'Falar ao país no horário nobre.', fx: { pop: 5, img: 1, cash: -2 } },
  // decisões polêmicas: rendem muito, mas podem virar escândalo e esquentam a investigação
  { id: 'caixa2', stages: [0, 1, 2, 3], sphere: 'fed', dirty: true, risk: 0.3, heat: 14, riskFx: { img: -9, pop: -4 }, name: 'Caixa dois de campanha', desc: 'Dinheiro por fora, sem recibo. Resolve o caixa, mas deixa rastro.', fx: { cash: 12, img: -2 } },
  { id: 'disparo', stages: [0, 1, 2, 3], sphere: 'fed', dirty: true, risk: 0.3, heat: 8, riskFx: { img: -8, pop: -4 }, name: 'Disparo em massa e perfis falsos', desc: 'Inflar a sua popularidade na internet. Se descobrirem, vira mensagem contra você.', fx: { pop: 7, img: -3, cash: -3 } },
  { id: 'dossie', stages: [1, 2, 3], sphere: 'fed', dirty: true, risk: 0.35, heat: 10, rival: 3, riskFx: { img: -8 }, name: 'Vazar dossiê do rival', desc: 'Enfraquece o rival na eleição, mas pode voltar contra você.', fx: { pop: 2, cash: -2 } },
  { id: 'licitacao', stages: [2, 3], sphere: 'est', dirty: true, risk: 0.3, heat: 14, riskFx: { img: -9, cong: -4 }, name: 'Direcionar uma licitação', desc: 'Contrato para um amigo que financia a política. Entra dinheiro e apoio.', fx: { cash: 8, cong: 5, img: -3 } },
  { id: 'cargos', stages: [0, 1], sphere: 'fed', dirty: true, risk: 0.25, heat: 10, riskFx: { img: -7, cong: -3 }, name: 'Trocar cargos por apoio', desc: 'Nomeações em troca de votos. Funciona, até virar manchete.', fx: { cong: 7, img: -3, cash: -1 } },
]
export const COMICIO = { id: 'comicio', special: true, sphere: 'mun', name: 'Comício', desc: 'Discurso ao vivo para a multidão. O efeito depende do seu desempenho no mini jogo.', fx: { cash: -3 } }
export const allActions = () => [...country().actions, ...SPHERE_ACTIONS.filter((a) => a.stages.includes(game.stage) && (!a.offs || a.offs.includes(officeId()))), ...POWER_ACTIONS.filter((a) => a.stages.includes(game.stage) && (!a.when || a.when(game)))]
const sphereOf = (a) => a.sphere || ACTION_SPHERE[a.id] || STAGE_SPHERE[game.stage]
export const actionSphere = sphereOf

export function canDo(a) {
  return game.ap > 0 && !game.used.includes(a.id) && game.stats.cash + (effectiveFx(a.fx).cash || 0) >= 0
}

export const freeMonth = () => {
  for (let i = 0; i < monthsPer(); i++) if (!game.sched.some((s) => s.m === i)) return i
  return -1
}

/* ---------- contatos: abordagens e ligações ---------- */

const clampRel = (v) => Math.max(0, Math.min(100, v))
const contactOf = (id) => (game.contacts || []).find((c) => c.id === id)
// memória de cada contato: as últimas conversas aparecem na aba Contatos e no telefone
const remember = (c, t, d) => {
  c.hist = [{ t, d: Math.round(d || 0), r: game.total }, ...(c.hist || [])].slice(0, 4)
}
export const findAction = (id) => [...allActions(), COMICIO, LIGAR, ESTUDAR, ACORDO].find((x) => x.id === id)

function pickApproach() {
  if (!game.contacts.length) game.contacts = makeContacts(R, { religioso: !!game.traits.religiao && game.traits.religiao !== 'sem', rival: game.rival, religiao: game.traits.religiao })
  ensureContacts(game.contacts, R, { religiao: game.traits.religiao })
  if (R() > 0.7) return null
  const cargoOk = (s) => !s.only || s.only.includes(officeId())
  let list = SCRIPTS.filter((s) => s.stages.includes(game.stage) && cargoOk(s) && !game.talkSeen.includes(s.id))
  if (!list.length) {
    game.talkSeen = []
    list = SCRIPTS.filter((s) => s.stages.includes(game.stage) && cargoOk(s))
  }
  const s = list[Math.floor(R() * list.length)]
  game.talkSeen.push(s.id)
  return { sid: s.id, cid: s.role, done: false }
}

export function currentApproach() {
  const a = game.approach
  if (!a || a.done) return null
  const s = SCRIPTS.find((x) => x.id === a.sid)
  const c = contactOf(a.cid)
  if (!s || !c) return null
  return { script: { ...s, text: subst(s.text) }, contact: c, role: ROLES[c.role], kind: KIND[s.kind] }
}

export function talkChoice(ch) {
  const a = game.approach
  const c = a && contactOf(a.cid)
  if (!c) return
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage]
  if (ch.fx && Object.keys(ch.fx).length) applyFx(ch.fx, true)
  curSphere = null
  const rel0 = c.rel
  c.rel = clampRel(c.rel + (ch.rel || 0))
  if (ch.dirty) {
    game.dirty++
    game.termDirty++
    if (R() < 0.6) agendar('dirty')
  }
  if (ch.heat) game.heat = clamp(game.heat + ch.heat)
  if (!ch.next) {
    remember(c, ch.l, c.rel - rel0)
    a.done = true
    log(`Conversa com ${c.name}: ${ch.l}.`)
    pushPosts(1, tone(ch.fx || {}), 'Bastidores')
  }
  save()
}

export function ignoreApproach() {
  const a = game.approach
  const c = a && contactOf(a.cid)
  if (!c) return
  a.done = true
  c.rel = clampRel(c.rel - 3)
  remember(c, 'Você não atendeu', -3)
  log(`Ignorou o contato de ${c.name}.`)
  save()
}

export function callAsk(cid, askId, month) {
  if (!canDo(LIGAR)) return null
  const c = contactOf(cid)
  const ask = askId === 'papo' ? CHAT : (ASKS[c?.role] || []).find((x) => x.id === askId)
  if (!c || !ask) return null
  if (month == null || game.sched.some((s) => s.m === month) || month < 0 || month >= monthsPer()) month = freeMonth()
  if (month < 0) return null
  game.sched.push({ id: 'ligar', m: month })
  const ok = ask === CHAT ? true : R() < Math.min(0.92, ask.base + c.rel / 130)
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage]
  if (ok) applyFx(ask.okFx, true)
  else if (ask.failFx) applyFx(ask.failFx, true)
  curSphere = null
  if (ask.dirty) {
    game.dirty++
    game.termDirty++
  }
  if (ask.heat) game.heat = clamp(game.heat + (ask.heat < 0 ? (ok ? ask.heat : 0) : ok ? ask.heat : Math.ceil(ask.heat / 2)))
  if (ask.rival && ok) (game.rivalMod = (game.rivalMod || 0) + ask.rival), rvOdio(ask.rival)
  const rel0 = c.rel
  c.rel = clampRel(c.rel + (ask === CHAT ? ask.gain : ok ? -ask.cost : -2))
  remember(c, ask === CHAT ? 'Bateu um papo' : `${ask.label}: ${ok ? 'deu certo' : 'não deu certo'}`, c.rel - rel0)
  game.ap--
  game.used.push('ligar')
  log(`Ligou para ${c.name}: ${ok ? ask.label : 'não deu certo'}.`)
  pushPosts(1, ok ? 'up' : 'flat', 'Bastidores')
  save()
  return { ok, ask, fx: ok ? ask.okFx : ask.failFx || {}, line: ok ? ask.ok : ask.fail }
}

function contactPerks() {
  const fx = {}
  for (const c of game.contacts || []) {
    const r = ROLES[c.role]
    const p = c.rel >= 70 ? r.hi : c.rel <= 15 ? r.lo : null
    if (p) for (const k in p) fx[k] = (fx[k] || 0) + p[k]
    c.rel = clampRel(c.rel + (40 - c.rel) * 0.05)
  }
  return fx
}

export function doSpecial(id, month, fx, text) {
  const a = id === 'comicio' ? COMICIO : null
  if (!a || !canDo(a)) return
  if (month == null || game.sched.some((s) => s.m === month) || month < 0 || month >= monthsPer()) month = freeMonth()
  if (month < 0) return
  game.sched.push({ id, m: month })
  game.delta = {}
  curSphere = sphereOf(a)
  applyFx(fx, true)
  curSphere = null
  game.ap--
  game.used.push(id)
  log(text || `${a.name}.`)
  pushPosts(2, tone(fx), slug(a.name).slice(0, 14))
  save()
}

export function doAction(id, month) {
  const a = allActions().find((x) => x.id === id)
  if (!a || !canDo(a)) return
  if (month == null || game.sched.some((s) => s.m === month) || month < 0 || month >= monthsPer()) month = freeMonth()
  if (month < 0) return
  game.sched.push({ id, m: month })
  game.delta = {}
  curSphere = sphereOf(a)
  applyFx(a.fx, true)
  curSphere = null
  cnt('a:' + a.id)
  if ((a.id === 'obracidade' || a.id === 'parceriapriv') && R() < 0.7) agendar('obra')
  let res = null
  if (a.power) game.power = clamp(game.power + a.power)
  if (a.gamble) {
    const ok = R() < a.odds(game)
    const o = ok ? a.ok : a.fail
    game.dirty++
    game.termDirty++
    curSphere = sphereOf(a)
    applyFx(o.fx || {}, true)
    curSphere = null
    game.power = clamp(game.power + (o.power || 0))
    game.heat = clamp(game.heat + (o.heat || 0))
    if (o.extra) game.extra = (game.extra || 0) + o.extra
    res = { id: a.id, name: a.name, ok, text: o.text, end: o.end || null }
    game.powerRes = res
    log(`${a.name}: ${ok ? 'deu certo' : 'deu errado'}.`)
    pushPosts(3, ok ? 'flat' : 'down', slug(a.name).slice(0, 14))
  }
  if (a.dirty) {
    game.dirty++
    game.termDirty++
    game.heat = clamp(game.heat + Math.round((a.heat || 0) * (1 - 0.06 * kn('dir'))))
    if (a.rival) (game.rivalMod = (game.rivalMod || 0) + a.rival), rvOdio(a.rival)
    if (R() < Math.max(0, (a.risk || 0) - 0.04 * kn('dir'))) {
      curSphere = sphereOf(a)
      applyFx(a.riskFx, true)
      curSphere = null
      toast('🚨', `Escândalo! "${a.name}" veio a público.`)
      log(`Escândalo: "${a.name}" veio a público.`)
      pushPosts(3, 'down', 'Escandalo')
      pushTrend('#Escandalo', 90)
    }
  }
  game.ap--
  game.used.push(id)
  if (!a.gamble) log(`${a.name}.`)
  pushPosts(1, tone(a.fx), slug(a.name).slice(0, 14))
  if (res && res.end) return finishPower(res)
  save()
  return res
}

function finishPower(res) {
  if (res.end === 'dictator') {
    game.legacy = { title: 'Ditador(a)', text: `${res.text} Você governou sem eleições, com o poder todo na mão. Para a sua história, isso é glória. Para a do país, é uma ferida.` }
    game.phase = 'end'
    finalize(true)
    clearSave()
  } else {
    game.over = { title: 'Golpe fracassado', text: `${res.text} Você terminou preso(a), e a carreira acabou ali.` }
    game.phase = 'over'
    finalize(false)
    clearSave()
  }
  return res
}

/* ---------- gabinete: estudos, acordos e poder ---------- */
export const knowLvl = kn

export function study(id, month) {
  if (!STUDIES.find((x) => x.id === id) || !canDo(ESTUDAR) || kn(id) >= STUDY_MAX) return null
  if (month == null || game.sched.some((s) => s.m === month) || month < 0 || month >= monthsPer()) month = freeMonth()
  if (month < 0) return null
  game.sched.push({ id: 'estudar', m: month })
  game.know = game.know || {}
  game.xp = game.xp || {}
  game.xp[id] = (game.xp[id] || 0) + 1
  let up = false
  if (game.xp[id] >= studyNeed(kn(id))) {
    game.know[id] = kn(id) + 1
    game.xp[id] = 0
    up = true
  }
  game.delta = {}
  applyFx({ cash: -1 })
  game.ap--
  game.used.push('estudar')
  const fl = STUDY_FLAVOR[id]
  const line = fl[Math.floor(R() * fl.length)]
  const s = STUDIES.find((x) => x.id === id)
  log(`Estudou: ${s.name}${up ? ` (nível ${kn(id)})` : ''}.`)
  if (up) toast('📚', `${s.name}: nível ${kn(id)}!`)
  save()
  return { up, lvl: kn(id), xp: game.xp[id], need: studyNeed(kn(id)), line }
}

export const dealsAvailable = () => DEALS.filter((d) => d.stages.includes(game.stage) && !(game.deals || []).some((x) => x.id === d.id))
export const dealChance = (d) => Math.max(0.15, Math.min(0.92, 0.4 + (game.stats[d.stat] - d.need) / 100 + 0.02 * kn('dir') + 0.02 * kn('com')))

export function negotiateDeal(id, month) {
  const d = DEALS.find((x) => x.id === id)
  game.deals = game.deals || []
  if (!d || !canDo(ACORDO) || game.deals.length >= MAX_DEALS || game.deals.some((x) => x.id === id)) return null
  if (month == null || game.sched.some((s) => s.m === month) || month < 0 || month >= monthsPer()) month = freeMonth()
  if (month < 0) return null
  game.sched.push({ id: 'acordo', m: month })
  const ok = R() < dealChance(d)
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage]
  if (ok) {
    applyFx(d.sign, true)
    game.deals.push({ id, left: d.turns })
  } else applyFx({ img: -1, cash: -1 }, true)
  curSphere = null
  game.ap--
  game.used.push('acordo')
  log(ok ? `Acordo fechado: ${d.name}.` : `A negociação do acordo "${d.name}" não deu em nada.`)
  pushPosts(1, ok ? 'up' : 'flat', slug(d.name).slice(0, 14))
  save()
  return { ok, d }
}

export function breakDeal(id) {
  const i = (game.deals || []).findIndex((x) => x.id === id)
  if (i < 0) return
  const d = DEALS.find((x) => x.id === id)
  game.deals.splice(i, 1)
  game.delta = {}
  applyFx({ img: -3, cong: -2 })
  log(`Rompeu o acordo: ${d.name}.`)
  save()
}

function dealPerks() {
  const fx = {}
  for (const x of game.deals || []) {
    const d = DEALS.find((y) => y.id === x.id)
    if (d) for (const k in d.perk) fx[k] = (fx[k] || 0) + d.perk[k]
  }
  return fx
}
function tickDeals() {
  for (const x of game.deals || []) x.left--
  const gone = (game.deals || []).filter((x) => x.left <= 0)
  for (const x of gone) {
    const d = DEALS.find((y) => y.id === x.id)
    log(`O acordo "${d.name}" chegou ao fim.`)
    toast('🤝', `Acordo encerrado: ${d.name}`)
  }
  game.deals = (game.deals || []).filter((x) => x.left > 0)
}
export const powerLevel = () => (game.power >= 60 ? 'Autocrata' : game.power >= 35 ? 'Mão de ferro' : game.power >= 15 ? 'Poder crescente' : 'Democrático')

export function endTurn() {
  game.delta = {}
  const d = turnDelta(true)
  if (game.stats.cash <= 0) game.cashNeg++
  else game.cashNeg = 0
  const before = { ...game.stats }
  applyFx(d)
  applyFx(contactPerks())
  applyFx(dealPerks())
  applyFx(teamPerks())
  applyFx(statutePassive())
  tickStatutes()
  rollTeamRisk()
  tickTeam()
  tickDeals()
  if (game.power >= 30) game.heat = clamp(game.heat + 3)
  game.power = clamp((game.power || 0) - 1)
  for (const k of ['mun', 'est', 'fed']) game.fame[k] = clamp(game.fame[k] + (game.stats.pop - game.fame[k]) * 0.06)
  game.ideas.force = clamp(game.ideas.force + (50 - game.ideas.force) * 0.05)
  const recap = buildRecap(before)
  game.turn++
  game.total++
  if (checkOver()) return
  game.recap = recap
  game.phase = 'recap'
  save()
}

export function continueRecap() {
  game.recap = null
  game.delta = {}
  if (game.turn >= stageInfo().turns) return finishTerm()
  beginTurn()
}

function buildRecap(before) {
  const mp = monthsPer()
  const start = roundStart()
  const ev = country().events.find((e) => e.id === game.eventId)
  const fl = [...DAY_FLAVOR[game.stage], ...MORE_FLAVOR[game.stage]]
  const pickF = () => {
    let pool = fl.filter((t) => !game.flavorSeen.includes(t))
    if (!pool.length) {
      game.flavorSeen = []
      pool = fl
    }
    const t = pool[Math.floor(R() * pool.length)]
    game.flavorSeen.push(t)
    return subst(t)
  }
  const months = []
  for (let i = 0; i < mp; i++) {
    const abs = start + i
    const act = game.sched.find((x) => x.m === i)
    const a = act && findAction(act.id)
    const m = { abs, holiday: holidayOf(abs), items: [] }
    if (game.bigOffer?.done && game.bigOffer.m === i) m.items.push({ icon: game.bigOffer.icon, text: `${game.bigOffer.name}: ${game.bigOffer.label}`, kind: 'big' })
    if (i === game.eventMonth && ev) m.items.push({ icon: '📰', text: `${subst(ev.title)}: ${game.outcome ? game.outcome.label : ''}`.trim(), kind: 'event' })
    if (a) m.items.push({ icon: ACTION_ICON[a.id] || '✔️', text: a.name, kind: 'action' })
    if (!m.items.length) m.items.push({ icon: '🗓️', text: pickF(), kind: 'day' })
    else if (R() < 0.35) m.items.push({ icon: '🗓️', text: pickF(), kind: 'day' })
    months.push(m)
  }
  const diff = {}
  for (const k of Object.keys(game.stats)) {
    const dv = game.stats[k] - before[k]
    if (Math.abs(dv) >= 0.4) diff[k] = Math.round(dv * 10) / 10
  }
  const t = game.stats.pop - before.pop
  pushPosts(2, t > 1 ? 'up' : t < -1 ? 'down' : 'flat', 'Governo')
  const g = GENERIC_TAGS[Math.floor(R() * GENERIC_TAGS.length)]
  pushTrend(g[0], 40 + g[1] * 50)
  const bastidores = ((game.poder && game.poder.timeline) || []).filter((x) => x.r === game.total).slice(0, 8)
  return { months, diff, from: start, to: start + mp - 1, bastidores }
}

const viceNote = () => {
  const v = game.team && game.team.vice
  return officeInfo().kind === 'exec' && v ? ` O vice (${v.name.toLowerCase()}) assumiu o cargo, como manda a lei.` : ''
}

function checkOver() {
  if (game.god) return false
  const s = game.stats
  const st = game.stage
  const oid = officeId()
  const exec = officeInfo().kind === 'exec'
  const v = game.team && game.team.vice
  const plot = !!(v && (v.conspire || v.amb >= 0.3))
  let o = null
  if (s.pop <= 3) {
    o = {
      title: exec ? 'Renúncia sob pressão' : 'Fim de linha política',
      text: 'A popularidade zerou. Ninguém atende mais o seu telefone.' + viceNote(),
    }
  } else if (oid === 'presidente' && ((s.pop <= 15 && s.cong <= 20) || (plot && s.pop <= (v.conspire ? 24 : 19) && s.cong <= (v.conspire ? 36 : 26)))) {
    o = {
      title: 'Impeachment',
      text: 'Sem povo e sem Congresso, o processo andou em tempo recorde. Você foi afastado(a) do cargo.' + (plot ? ' O vice articulou nos bastidores.' : '') + viceNote(),
    }
  } else if (oid === 'presidente' && game.world && game.world.fa <= 8 && s.pop <= 22) {
    o = {
      title: 'Crise institucional',
      text: 'Os comandantes retiraram o apoio, as ruas estavam cheias e o governo caiu. A história vai julgar.' + viceNote(),
    }
  } else if (oid === 'governador' && ((s.pop <= 12 && s.cong <= 18) || (v && v.conspire && s.pop <= 20 && s.cong <= 28))) {
    o = {
      title: 'Impeachment',
      text: 'A Assembleia Legislativa abriu o processo e afastou você do governo.' + (plot ? ' O vice articulou nos bastidores.' : '') + viceNote(),
    }
  } else if (oid === 'prefeito' && ((s.pop <= 12 && s.cong <= 18) || (v && v.conspire && s.pop <= 20 && s.cong <= 28))) {
    o = {
      title: 'Cassação',
      text: 'A Câmara de Vereadores cassou o seu mandato.' + (plot ? ' O vice articulou nos bastidores.' : '') + viceNote(),
    }
  } else if (exec && ['prefeito', 'governador', 'presidente'].includes(oid) && s.img <= 6 && s.cong <= 40) {
    // escândalo sem base política: o Legislativo abre o processo (a imagem no chão deixa de ser só um número)
    o = {
      title: oid === 'prefeito' ? 'Cassação' : 'Impeachment',
      text: (oid === 'prefeito' ? 'A Câmara de Vereadores' : oid === 'governador' ? 'A Assembleia Legislativa' : 'O Congresso') + ' aproveitou a sequência de escândalos e a falta de base para abrir o processo. Sem reputação, ninguém te defendeu.' + viceNote(),
    }
  } else if ((st >= 2 || oid === 'prefeito') && game.cashNeg >= (st >= 2 ? 2 : 3)) {
    o = {
      title: 'Colapso fiscal',
      text: 'O caixa zerou, os salários atrasaram e o governo parou de funcionar.' + viceNote(),
    }
  }
  if (!o) return false
  game.over = o
  game.phase = 'over'
  finalize(false)
  clearSave()
  return true
}

/* ---------- eleição ---------- */

export function baseScore() {
  const s = game.stats
  const weight = OFFICES[targetId()].tier < 3 ? 1 : 0.4
  const party = partyObj()?.perks.vote || 0
  const plan = game.election?.planBonus || 0
  const tv = game.election?.tv || 0
  const sphere = clamp((game.fame[electionSphere()] - s.pop) * 0.12, -3, 3)
  const ideas = (game.ideas.force - 50) * 0.025
  const ticket = game.election?.ticketBonus || 0
  return ticket + tv + focoBonus() - boatosDano() + sphere + ideas + 0.34 * s.pop + 0.16 * s.img + 0.14 * s.eco + 0.1 * s.cong + 0.08 * s.soc + 0.06 * s.seg + game.region.bonus * weight + party + plan
}

const toShare = (score, rival) => clamp(50 + (score - rival) * 0.9, 30, 70)

export function targetOffice() {
  const t = game.election && game.election.target
  if (!t) return 'Eleição'
  return t === officeId() ? 'Reeleição' : OFFICES[t].name
}

function finishTerm() {
  const st = game.stage
  const results = planStatus()
  const keptN = results.filter((r) => r.kept).length
  const planBonus = results.reduce((a, r) => a + (r.kept ? 2 : -2.5), 0)
  if (results.length && keptN === results.length) game.keptAll++
  if (officeId() === 'presidente' && game.term >= 2 + (game.extra || 0)) {
    game.lastPlan = { kept: keptN, total: results.length }
    game.balance = makeBalance(results, keptN, true)
    game.phase = 'balance'
    save()
    return
  }
  game.election = {
    rival: 0,
    target: null,
    rivalName: game.rival,
    pollNoise: rnd(-2, 2),
    result: null,
    promises: results.map((r) => ({ id: r.p.id, icon: r.p.icon, name: r.p.name, kept: r.kept })),
    planBonus,
  }
  game.balance = makeBalance(results, keptN, false)
  game.phase = 'balance'
  save()
}

export function continueBalance() {
  if (game.phase !== 'balance') return
  const fin = game.balance && game.balance.final
  game.balance = null
  if (fin) return endGame()
  game.phase = 'rumo'
  save()
}

function makeBalance(results, keptN, final) {
  const keys = ['pop', 'cong', 'eco', 'cash', 'soc', 'seg', 'img']
  const start = game.termStart || null
  const end = { ...game.stats }
  const delta = {}
  if (start) for (const k of keys) delta[k] = Math.round((end[k] - start[k]) * 10) / 10
  const avg = (end.pop + end.eco + end.soc + end.seg + end.img) / 5
  const total = results.length
  const dsum = start ? keys.reduce((a, k) => a + delta[k], 0) / keys.length : 0
  const score = avg + (total ? (keptN / total - 0.5) * 20 : 0) - game.termDirty * 4 + dsum
  const grade = score >= 68 ? 'A' : score >= 58 ? 'B' : score >= 48 ? 'C' : score >= 38 ? 'D' : 'E'
  const GT = { A: 'Mandato histórico', B: 'Bom mandato', C: 'Mandato regular', D: 'Mandato difícil', E: 'Mandato desastroso' }
  const ranked = ['pop', 'eco', 'soc', 'seg', 'img'].map((k) => ({ k, v: end[k] })).sort((a, b) => b.v - a.v)
  const st = game.stage
  const next = 'Você escolhe o caminho'
  return {
    final,
    office: stageInfo().office,
    term: game.term,
    stage: st,
    age: ageNow(),
    start,
    end,
    delta,
    grade,
    gradeText: GT[grade],
    best: ranked[0],
    worst: ranked[ranked.length - 1],
    promises: results.map((r) => ({ id: r.p.id, icon: r.p.icon, name: r.p.name, kept: r.kept })),
    keptN,
    total,
    scandals: game.termDirty,
    deals: (game.deals || []).length,
    power: game.power || 0,
    next,
    stay: false,
    minAge: null,
    log: game.log.slice(0, 6),
    rival: game.rival,
  }
}

export function finishTv(score) {
  const e = game.election
  if (!e || e.tvDone) return 0
  e.tvDone = true
  e.tv = Math.round((-2 + score * 6) * 10) / 10
  log(`Debate na TV: ${e.tv > 0 ? '+' : ''}${e.tv} pontos.`)
  pushPosts(3, e.tv > 1 ? 'up' : e.tv < 0 ? 'down' : 'flat', 'DebateNaTV')
  pushTrend('#DebateNaTV', 85)
  save()
  return e.tv
}

export function finishPlenario(votes, total, bill = null, concessions = 0, stance = 'pro') {
  if (game.mini.plenario) return null
  game.mini.plenario = true
  const won = votes * 2 > total
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage] === 'mun' ? 'mun' : 'fed'
  applyFx(bill ? billOutcome(bill, stance === 'pro' ? won : !won, concessions, stance) : won ? { cong: 4, img: 2, pop: 1 } : { cong: -3, img: -1 }, true)
  curSphere = null
  if (bill) plenaryAftermath(bill, won, concessions, stance)
  log(`Votação${bill ? ` do projeto “${bill.title}” (você ${stance === 'pro' ? 'apoiou' : 'combateu'})` : ''}: ${votes}/${total} com você (${won ? 'vitória' : 'derrota'}).`)
  pushPosts(2, won ? 'up' : 'down', 'Votacao')
  save()
  return won
}

export function pollShare() {
  const e = game.election
  return toShare(baseScore(), e.round === 2 ? e.rival2 : e.rival) + e.pollNoise
}
// Segundo turno: governador, presidente e reeleição. Passou de 50% dos votos válidos no 1º turno, ganhou na hora.
const hasRunoff = (id = targetId()) => {
  const r = OFFICES[id].runoff
  return r === true || (r === 'cidade' && ['capital', 'grande'].includes(game.city && game.city.size))
}

function contactSupport() {
  const rel = (id) => (game.contacts.find((c) => c.id === id) || { rel: 40 }).rel
  const out = []
  for (const [id, label] of [['aliado', 'Aliados do partido'], ['lider', 'Lideranças comunitárias'], ['religioso', 'Lideranças religiosas'], ['influenciador', 'Influenciadores']]) {
    if (rel(id) >= 70) out.push({ id, label, v: 1 })
  }
  if (rel('adversario') <= 15) out.push({ id: 'adversario', label: 'Oposição hostil nos bastidores', v: -1 })
  return out
}

export const hasSecondRound = () => hasRunoff()

// Voto proporcional: vereador e deputados disputam vagas, não 50% dos votos
export const isProportional = () => ['vereador', 'dep_estadual', 'dep_federal'].includes(targetId())
export const seatsFor = (id = targetId()) => (id === 'vereador' ? { capital: 21, grande: 15, media: 11, pequena: 9 }[game.city && game.city.size] || 11 : id === 'dep_estadual' ? 70 : id === 'dep_federal' ? 30 : 1)
const candsFor = (seats) => Math.max(seats + 4, Math.round(seats * 2.5))
const gauss = () => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R())
const erf = (x) => {
  const s = x < 0 ? -1 : 1
  const a = Math.abs(x)
  const tt = 1 / (1 + 0.3275911 * a)
  return s * (1 - (((((1.061405429 * tt - 1.453152027) * tt + 1.421413741) * tt - 0.284496736) * tt + 0.254829592) * tt) * Math.exp(-a * a))
}
function propResult(score, rival, camp) {
  const seats = seatsFor()
  const C = candsFor(seats)
  const mu = rival - 1.5
  const st = []
  let rank = 1
  for (let k = 0; k < C - 1; k++) {
    const x = mu + 6 * gauss()
    st.push(x)
    if (x > score) rank++
  }
  const sum = st.reduce((a, x) => a + Math.exp(x / 10), Math.exp(score / 10))
  const share = Math.round((Math.exp(score / 10) / sum) * 1000) / 10
  return { share, h2h: share, won: rank <= seats, campaign: camp, prop: true, rank, seats, cands: C }
}
export function propEstimate() {
  const e = game.election
  const seats = seatsFor()
  const C = candsFor(seats)
  const z = (baseScore() - (e.rival - 1.5)) / 6
  const above = (C - 1) * (1 - 0.5 * (1 + erf(z / Math.SQRT2)))
  return { seats, cands: C, rank: Math.max(1, Math.round(1 + above)) }
}
export const RUNOFF = [
  { id: 'foco', name: 'Manter o foco', desc: 'Repetir o discurso do primeiro turno. Seguro e sem custo.', cost: 0 },
  { id: 'aliancas', name: 'Fechar alianças', desc: 'Negociar o apoio dos candidatos derrotados. Quanto maior a sua base política, maior o ganho.', cost: 5 },
  { id: 'ataque', name: 'Atacar o rival', desc: 'Ofensiva total: rende muito se der certo, mas desgasta a sua imagem e pode sair pela culatra.', cost: 0, risk: true },
]
export const runoffBonus = (id) => (id === 'aliancas' ? Math.round((1 + game.stats.cong / 25) * 10) / 10 : id === 'ataque' ? 5 : 0)

function finishElection(res) {
  const e = game.election
  e.result = res
  e.news = makeSpecial(
    'eleicao',
    { who: game.name, rival: game.rival, office: targetOffice(), won: res.won, share: res.share, total: game.total, state: game.region.name, city: game.city?.name, party: partyObj()?.sigla || 'MRB' },
    R,
  )
  if (res.prop) log(`Eleição (${targetOffice()}): ${res.rank}º lugar entre ${res.cands} candidatos para ${res.seats} vagas (${res.share.toFixed(1)}% dos votos nominais).`)
  else log(`Eleição (${targetOffice()}): ${res.share.toFixed(1)}% dos votos válidos${res.runoff ? ' no segundo turno' : ''}.`)
  game.phase = 'result'
  save()
}
export function chooseCampaign(id) {
  const opt = CAMPAIGNS.find((c) => c.id === id)
  if (!opt || game.stats.cash < campaignCost(opt)) return
  if (needsTicket() && !(game.election && game.election.ticketDone)) return
  game.delta = {}
  applyFx({ cash: -campaignCost(opt) })
  const e = game.election
  const score = baseScore() + opt.bonus + rnd(-3, 3)
  if (isProportional()) return finishElection(propResult(score, e.rival, opt.name))
  const share = toShare(score, e.rival)
  if (hasRunoff()) {
    const mine = Math.round(share * 0.82 * 10) / 10
    const theirs = Math.round((100 - share) * 0.55 * 10) / 10
    if (mine > 50) return finishElection({ share: mine, h2h: share, won: true, campaign: opt.name, outright: true })
    if (share < 38) return finishElection({ share: mine, h2h: share, won: false, campaign: opt.name, out: true })
    e.round = 2
    e.first = { mine, theirs, campaign: opt.name }
    const useB = !!e.labelB && R() < 0.3
    e.rival2 = e.rival + (useB ? -1 : 1)
    if (useB) e.rivalName = e.labelB
    e.pollNoise = rnd(-2, 2)
    e.tvDone = false
    e.tv = 0
    e.debate = null
    e.pesq = null
    e.boatos = [...(e.boatos || []), ...gerarBoatos(1)]
    e.support = contactSupport()
    log(`1º turno (${targetOffice()}): ${mine.toFixed(1)}% x ${theirs.toFixed(1)}%. Vai ao segundo turno.`)
    pushPosts(3, 'up', 'SegundoTurno')
    pushTrend('#SegundoTurno', 90)
    game.phase = 'runoff'
    save()
    return
  }
  finishElection({ share, h2h: share, won: share > 50, campaign: opt.name })
}

export function chooseRunoff(id) {
  const e = game.election
  const opt = RUNOFF.find((o) => o.id === id)
  if (!e || e.round !== 2 || !opt || game.stats.cash < opt.cost) return
  game.delta = {}
  if (opt.cost) applyFx({ cash: -opt.cost })
  let bonus = runoffBonus(id)
  let note = ''
  if (id === 'ataque') {
    if (R() < 0.3) {
      bonus = -3
      note = ' (saiu pela culatra)'
    }
    applyFx({ img: -5 }, true)
  }
  const sup = (e.support || []).reduce((a, s) => a + s.v, 0)
  const share = toShare(baseScore() + bonus + sup + rnd(-3, 3), e.rival2)
  finishElection({ share, h2h: share, won: share > 50, campaign: opt.name + note, runoff: true, first: e.first })
}

export function continueAfterResult() {
  const e = game.election
  rvResultado(e.result.won)
  if (!e.result.won) {
    game.over = {
      title: 'Derrota nas urnas',
      text: e.result.out
        ? `Você teve ${e.result.share.toFixed(1)}% dos votos e ficou fora do segundo turno. A carreira termina por aqui, mas a política sempre dá volta.`
        : e.result.prop
          ? `Você ficou em ${e.result.rank}º lugar entre ${e.result.cands} candidatos e ficou de fora das ${e.result.seats} vagas. A carreira termina por aqui, mas a política sempre dá volta.`
          : `Você teve ${e.result.share.toFixed(1)}% dos votos. A carreira termina por aqui, mas a política sempre dá volta.`,
    }
    game.phase = 'over'
    finalize(false)
    clearSave()
    return
  }
  const tgt = targetId()
  const same = tgt === officeId()
  game.history.push({ office: targetOffice(), share: e.result.h2h ?? e.result.share })
  game.delta = {}
  game.turn = 0
  game.clock = (game.clock || 0) + officeInfo().years * 12
  const tk = e.ticket || null
  game.election = null
  game.switched = false
  game.rival = (game.poder && game.poder.rv && game.poder.rv.nome) || makeRival(R)
  if (same) {
    game.term++
    applyFx({ cong: 50 - game.stats.cong, cash: 10 })
    log(game.term > 2 ? 'Reeleito(a) mais uma vez! Novo mandato começa.' : 'Reeleito(a)! Segundo mandato começa.')
  } else {
    const from = officeInfo()
    if (from.kind === 'exec' && from.id !== tgt) log(`Deixou ${from.name} para disputar outro cargo (desincompatibilização). ${from.vice ? 'O vice assumiu o posto.' : ''}`)
    game.office = tgt
    game.stage = OFFICES[tgt].tier
    game.term = 1
    game.seen = []
    applyFx({ cong: 50 - game.stats.cong, cash: 15, pop: 5 })
    log(`Eleito(a) ${officeInfo().name}!`)
    game.team = { vice: null, supl: [], slots: {} }
  }
  if (tk) {
    game.team.vice = tk.vice ? { ...tk.vice } : null
    game.team.supl = (tk.supl || []).map((s) => ({ ...s }))
  } else {
    game.team.vice = null
    game.team.supl = []
  }
  autoTeam()
  resetFed()
  game.plan = { name: randomPlanName(R), ids: [] }
  game.bigDone = []
  resetFame()
  game.phase = 'plan'
  save()
}
/* ---------- caminho da carreira, chapa e equipe ---------- */

// Opções de cargo para a próxima eleição, com as travas da lei
export function pathOptions() {
  const cur = officeInfo()
  const age = ageNow()
  return (PATHS[cur.id] || [cur.id]).map((id) => {
    const o = OFFICES[id]
    const same = id === cur.id
    const jump = o.rank - cur.rank
    let lock = ''
    if (same && cur.reel === 1 && game.term >= 2) lock = 'Limite de uma reeleição seguida no Executivo (Constituição, art. 14, §5º). Escolha outro cargo.'
    else if (age != null && age < o.minAge) lock = `Idade mínima de ${o.minAge} anos (você tem ${age}).`
    const tag = same ? 'Reeleição: mais fácil' : jump <= 0 ? 'Cargo parecido: favorito' : jump === 1 ? 'Próximo degrau' : 'Salto grande: bem mais difícil'
    return { id, icon: o.icon, name: o.name, place: o.place, law: o.law, same, jump, lock, tag }
  })
}

const jumpDiff = (same, jump) => (same ? -2 : jump <= 0 ? -3 : jump === 1 ? 0 : 3 * (jump - 1))

export function chooseRumo(id) {
  if (game.phase !== 'rumo' || !game.election) return
  const op = pathOptions().find((x) => x.id === id)
  if (!op || op.lock) return
  const e = game.election
  const o = OFFICES[id]
  e.target = id
  const ROLE = { prefeito: 'Prefeito', governador: 'Governador', senador: 'Senador', presidente: 'Presidente' }
  e.rivalName = (!op.same && ROLE[id] ? ROLE[id] + ' ' : '') + game.rival
  e.labelB = makeRival(R)
  e.sigA = PARTIES[Math.floor(R() * PARTIES.length)].sigla
  e.sigB = PARTIES[Math.floor(R() * PARTIES.length)].sigla
  const rvr = rvEnsure()
  e.rivalArc = !['exilio', 'aliado'].includes(rvr.estagio)
  if (e.rivalArc) game.rival = rvr.nome
  else game.rival = candName(R)
  e.rivalName = (!op.same && ROLE[id] ? ROLE[id] + ' ' : '') + game.rival
  e.rival = o.rival + (op.same && id === 'presidente' ? 2 : 0) + jumpDiff(op.same, op.jump) + rnd(-6, 8) - Math.min(8, game.rivalMod || 0) + (e.rivalArc ? rvMod() : 0) - (rvr.estagio === 'aliado' ? 2 : 0)
  game.rivalMod = 0
  e.ticket = null
  e.ticketDone = !needsTicket()
  e.ticketBonus = 0
  e.boatos = gerarBoatos(2)
  e.foco = { g: {}, est: {} }
  log(op.same ? `Decidiu disputar a reeleição para ${o.name}.` : `Decidiu disputar ${o.name}.`)
  game.phase = 'campaign'
  save()
}

export function retireCareer() {
  if (game.phase !== 'rumo') return
  const e = game.election
  const total = e && e.promises ? e.promises.length : 0
  game.lastPlan = { kept: e && e.promises ? e.promises.filter((p) => p.kept).length : 0, total }
  game.election = null
  endGame()
}

// Chapa: vice (Executivo) e suplentes (Legislativo)
export const ticketSpec = () => {
  const o = OFFICES[targetId()]
  return { vice: !!o.vice, supl: o.supl || 0, office: o }
}
export const needsTicket = () => {
  const s = ticketSpec()
  return s.vice || s.supl > 0
}
export const viceList = () => VICES
export const suplList = () => SUPLS

export function chooseTicket(viceId, suplIds) {
  const e = game.election
  if (!e || e.ticketDone) return false
  const s = ticketSpec()
  let vice = null
  let supl = []
  let bonus = 0
  if (s.vice) {
    const v = VICES.find((x) => x.id === viceId)
    if (!v || v.illegal) return false
    vice = { id: v.id, name: v.name, amb: v.amb }
    bonus += v.vote
  }
  if (s.supl) {
    const ids = [...new Set(suplIds || [])]
    if (ids.length !== s.supl) return false
    supl = ids.map((id) => SUPLS.find((x) => x.id === id)).filter(Boolean)
    if (supl.length !== s.supl) return false
    for (const x of supl) bonus += x.vote
    supl = supl.map((x) => ({ id: x.id, name: x.name, amb: x.amb }))
  }
  const cash = supl.reduce((a, x) => a + ((SUPLS.find((y) => y.id === x.id) || {}).cash || 0), 0)
  e.ticket = { vice, supl }
  e.ticketBonus = Math.round(bonus * 10) / 10
  e.ticketDone = true
  game.delta = {}
  if (cash) applyFx({ cash })
  log(`Chapa fechada${vice ? ': vice ' + vice.name.toLowerCase() : ''}${supl.length ? ' e ' + supl.length + ' suplente(s)' : ''}.`)
  save()
  return true
}

// Equipe: secretarias, ministérios ou gabinete, conforme o cargo
export const teamDef = () => TEAMS[officeInfo().team]
export const appointeeList = () => APPOINTEES
export const slotLock = (slot, ap) => lockReason(teamDef(), slot, ap)

function autoTeam() {
  const def = teamDef()
  if (!def) return
  if (!game.team) game.team = { vice: null, supl: [], slots: {} }
  if (!game.team.slots) game.team.slots = {}
  const keep = {}
  for (const s of def.slots) keep[s.id] = game.team.slots[s.id] || { type: 'tecnico' }
  game.team.slots = keep
}

export function appoint(slotId, typeId) {
  const def = teamDef()
  const slot = def.slots.find((s) => s.id === slotId)
  const ap = APPOINTEES.find((a) => a.id === typeId)
  if (!slot || !ap || lockReason(def, slot, ap)) return false
  const old = game.team.slots[slotId] && game.team.slots[slotId].type
  if (old === typeId) return true
  game.delta = {}
  if (old && ['politico', 'parlamentar'].includes(old)) {
    applyFx({ cong: -1.5 })
    toast('😠', 'O partido do titular demitido ficou ressentido.')
  }
  game.team.slots[slotId] = { type: typeId }
  if (typeId === 'parlamentar') log(`Um parlamentar se licenciou para assumir ${slot.name}. O suplente ocupa a vaga dele.`)
  else log(`Nomeou ${ap.name.toLowerCase()} para ${slot.name}.`)
  save()
  return true
}

export function teamPerks() {
  const fx = {}
  const add = (k, v) => (fx[k] = (fx[k] || 0) + v)
  const def = teamDef()
  if (!def || !game.team) return fx
  const k = 4 / def.slots.length
  for (const s of def.slots) {
    const t = game.team.slots[s.id]
    const ap = t && APPOINTEES.find((a) => a.id === t.type)
    if (!ap) continue
    add(s.stat, ap.v * 0.5 * k)
    for (const x in ap.other) add(x, ap.other[x] * 0.5 * k)
  }
  const v = game.team.vice && VICES.find((x) => x.id === game.team.vice.id)
  if (v) for (const x in v.perks) add(x, v.perks[x] * 0.5)
  for (const sp of game.team.supl || []) {
    const d = SUPLS.find((x) => x.id === sp.id)
    if (d) for (const x in d.perks) add(x, d.perks[x] * 0.5)
  }
  if (game.team.leave) {
    add('pop', -0.3)
    add('cong', -0.3)
  }
  for (const x in fx) fx[x] = Math.round(fx[x] * 100) / 100
  return fx
}

const hotName = () => {
  const d = teamDef()
  const s = d && game.team && game.team.hot ? d.slots.find((x) => x.id === game.team.hot) : null
  return s ? s.name : 'uma pasta'
}

function rollTeamRisk() {
  const def = teamDef()
  if (!def || !game.team || game.team.hot) return
  const rows = []
  for (const s of def.slots) {
    const t = game.team.slots[s.id]
    const ap = t && APPOINTEES.find((a) => a.id === t.type)
    if (ap && ap.risk) rows.push({ s, r: ap.risk * (t.burn ? 2 : 1) })
  }
  let p = rows.reduce((a, x) => a + x.r, 0)
  for (const sp of game.team.supl || []) p += (SUPLS.find((x) => x.id === sp.id) || {}).risk || 0
  p = Math.min(0.3, p * 0.6)
  if (!p || R() >= p) return
  let pick = null
  if (rows.length) {
    let x = R() * rows.reduce((a, r) => a + r.r, 0)
    for (const r of rows) {
      x -= r.r
      if (x <= 0) {
        pick = r.s
        break
      }
    }
    pick = pick || rows[0].s
  }
  game.termDirty = (game.termDirty || 0) + 1
  game.heat = clamp(game.heat + 4)
  applyFx({ img: -3, cong: -1, pop: -1 })
  if (pick) {
    game.team.hot = pick.id
    log(`Escândalo: o titular de ${pick.name} virou manchete.`)
  } else log('Escândalo na equipe: um nomeado seu virou manchete.')
  toast('🗞️', 'Escândalo envolvendo alguém da sua equipe.')
  pushPosts(2, 'down', 'EscandaloNaEquipe')
}

function giveBase(n) {
  const def = teamDef()
  if (!def || !def.political) return
  let k = 0
  for (const s of def.slots) {
    if (k >= n) break
    const x = game.team.slots[s.id]
    if (x && ['tecnico', 'especialista', 'confianca'].includes(x.type)) {
      x.type = 'politico'
      x.burn = false
      log(`A pasta ${s.name} passou a um indicado da base aliada.`)
      k++
    }
  }
}

function startLeave(n) {
  if (!game.team) return
  game.team.leave = { left: n }
  log(`Licenciou-se: o suplente assumiu a cadeira por ${n} rodada${n > 1 ? 's' : ''}.`)
}

function tickTeam() {
  const t = game.team
  if (!t) return
  if (t.coalAngry > 0) t.coalAngry--
  if (!t.leave) return
  t.leave.left--
  if (t.leave.left > 0) return
  t.leave = null
  const sp = (t.supl || [])[0]
  if (sp && R() < Math.min(0.5, (sp.amb || 0) * 1.5)) {
    applyFx({ cong: -3, img: -2, pop: -2 })
    game.heat = clamp(game.heat + 3)
    log(`O suplente (${sp.name.toLowerCase()}) não quer devolver a cadeira e a briga foi parar na imprensa.`)
    toast('🪑', 'O suplente não quer devolver a cadeira.')
  } else {
    log('O suplente devolveu a cadeira e você reassumiu o mandato.')
    toast('🪑', 'Você reassumiu a cadeira.')
  }
}

// Apoio da coalizão no plenário: aliados com cargo votam com você
export function coalition() {
  const def = teamDef()
  const t = game.team
  if (!def || !def.political || !t) return { allied: 0, votes: 0, angry: false }
  let allied = 0
  for (const s of def.slots) {
    const x = t.slots[s.id]
    if (x && ['politico', 'parlamentar'].includes(x.type)) allied++
  }
  const vice = t.vice && ['politico', 'centrao'].includes(t.vice.id) ? 1 : 0
  const angry = (t.coalAngry || 0) > 0
  return { allied, angry, votes: angry ? 0 : Math.min(4, Math.round((allied + vice) * 1.2)) }
}

const VICE_GOV = {
  tecnico: { eco: 1.5, img: 1 },
  popular: { pop: 2 },
  politico: { cong: 2 },
  centrao: { cong: 2.5, img: -1 },
  renovacao: { img: 1.5, pop: 1 },
}

function evHook(id, i, lucky) {
  worldHook(id, i, lucky)
  const t = game.team
  if (!t) return
  const def = teamDef()
  const v = t.vice
  if (id === 'suplente_pede' && i === 0) startLeave(2)
  else if (id === 'convite_pasta' && i === 0) startLeave(3)
  else if (id === 'coalizao_cargos') {
    if (i === 0 || i === 1 || (i === 2 && lucky)) t.coalAngry = 0
    if (i === 0) giveBase(2)
    if (i === 1) giveBase(1)
    if (i === 2 && !lucky) t.coalAngry = 4
  } else if (id === 'equipe_escandalo') {
    const sl = t.hot && t.slots[t.hot]
    const slot = def && def.slots.find((s) => s.id === t.hot)
    if (sl && slot) {
      if (i === 0) {
        sl.type = 'tecnico'
        sl.burn = false
        log(`O titular de ${slot.name} foi demitido e um técnico assumiu a pasta.`)
      } else if (i === 1) sl.burn = true
    }
    t.hot = null
  } else if (id === 'vice_conspira' && v) {
    if (i === 0) v.amb = Math.round(v.amb * 50) / 100
    else if (i === 1 && !lucky) v.conspire = true
    else if (i === 2) {
      v.amb = Math.min(1, v.amb + 0.2)
      v.conspire = true
    }
  } else if (id === 'vice_viagem' && v && i === 1 && !lucky) v.conspire = true
  else if (id === 'licenca_vice' && v && i === 0) {
    applyFx(VICE_GOV[v.id] || {})
    log(`O vice (${v.name.toLowerCase()}) governou durante a sua licença.`)
    if (['centrao', 'politico'].includes(v.id) && R() < 0.35) {
      v.conspire = true
      log('O vice gostou do posto e passou a articular.')
    }
  }
}

/* ---------- mundo: diplomacia, guerras, Forças Armadas, nuclear, federação e leis ---------- */

export const worldPartners = () => PARTNERS
export const worldWars = () => WARS
export const worldNuc = () => NUC
export const worldStances = () => STANCE
export const diploActions = () => DIPLO_ACTIONS
export const defActions = () => DEF_ACTIONS
export const fedDefs = () => FED[officeId()] || []
export const fedActions = (dir) => FED_ACTIONS[dir] || []
export const worldTemas = () => TEMAS
export const worldOusadia = () => OUSADIA
export const isPresident = () => officeId() === 'presidente'
export const canDiplo = () => ['presidente', 'governador', 'senador'].includes(officeId())
export const ptsOf = (pool = 'pts') => (game.world && typeof game.world[pool] === 'number' ? game.world[pool] : 2)
export const worldReady = (pool = 'pts') => game.phase === 'actions' && ptsOf(pool) > 0

function ensureWorld() {
  const b = blankWorld()
  const old = game.world || {}
  game.world = { ...b, ...old, rel: { ...b.rel, ...(old.rel || {}) }, nuc: { ...b.nuc, ...(old.nuc || {}) }, tech: { ...b.tech, ...(old.tech || {}), done: [...((old.tech && old.tech.done) || [])], prog: { ...((old.tech && old.tech.prog) || {}) } }, blocos: [...(old.blocos || [])], tratados: [...(old.tratados || [])], ops: [...(old.ops || [])], pactos: [...(old.pactos || [])], ameacas: [...(old.ameacas || [])], guerraDef: old.guerraDef || null, fed: { ...(old.fed || {}) } }
  for (const d of fedDefs()) if (typeof game.world.fed[d.id] !== 'number') game.world.fed[d.id] = 50
}

function resetFed() {
  game.world.fed = {}
  ensureWorld()
}

const shiftRel = (id, d) => {
  if (typeof game.world.rel[id] === 'number') game.world.rel[id] = clamp(game.world.rel[id] + d)
}
const shiftFed = (id, d) => {
  game.world.fed[id] = clamp((typeof game.world.fed[id] === 'number' ? game.world.fed[id] : 50) + d)
}

function warLabel() {
  const w = game.world
  const wr = w.wars.find((x) => x.id === w.pending) || w.wars.find((x) => !x.stance) || w.wars[0]
  const def = wr && WARS.find((x) => x.id === wr.id)
  return def ? def.name : 'Um conflito distante'
}

// Gasta um ponto de agenda e aplica os efeitos
function spendWorld(fx, text, say, pool = 'pts') {
  game.world[pool] = ptsOf(pool) - 1
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage]
  applyFx(fx || {}, true)
  curSphere = null
  game.world.last = { text: say || text, ok: true }
  if (text) log(text)
  save()
}

const canPay = (fx) => !fx || !fx.cash || fx.cash >= 0 || game.stats.cash >= -fx.cash

export function diploChance(partnerId, actionId) {
  const a = DIPLO_ACTIONS.find((x) => x.id === actionId)
  if (!a || !a.need) return 1
  return Math.min(0.95, Math.max(0.1, 0.35 + ((game.world.rel[partnerId] ?? 50) - 35) / 80))
}

export function diplo(partnerId, actionId) {
  if (!canDiplo() || !worldReady()) return false
  const p = PARTNERS.find((x) => x.id === partnerId)
  const a = DIPLO_ACTIONS.find((x) => x.id === actionId)
  if (!p || !a || !canPay(a.fx)) return false
  const ok = !a.need || R() < diploChance(partnerId, actionId)
  if (!ok) {
    spendWorld(a.fail.fx, `${a.name} com ${p.name}: sem resultado.`, a.fail.out)
    game.world.last.ok = false
    shiftRel(partnerId, a.fail.rel)
    return true
  }
  spendWorld(a.fx, `${a.name}: ${p.name}.`, `${a.name} com ${p.name}: deu certo.`)
  shiftRel(partnerId, a.rel)
  if (a.rel > 0) for (const [o, n] of Object.entries(RIVALRY[partnerId] || {})) shiftRel(o, -Math.round(n * (a.rel / 10)))
  return true
}

export function defAct(id) {
  if (!isPresident() || !worldReady('ptsM')) return false
  const a = DEF_ACTIONS.find((x) => x.id === id)
  if (!a || !canPay(a.fx)) return false
  spendWorld(a.fx, `Forças Armadas: ${a.name}.`, `${a.name}: feito.`, 'ptsM')
  game.world.fa = clamp(game.world.fa + a.fa)
  for (const [k, d] of Object.entries(a.rel || {})) shiftRel(k, d)
  return true
}

export function nucInvest(id) {
  if (!isPresident() || !worldReady('ptsM')) return false
  const n = NUC.find((x) => x.id === id)
  const w = game.world
  if (!n || w.nuc[id] >= 100 || !canPay({ cash: -3 })) return false
  spendWorld({ cash: -3 }, `Programa nuclear: investimento em ${n.name}.`, `Mais um passo em: ${n.name}.`, 'ptsM')
  w.nuc[id] = Math.min(100, w.nuc[id] + 25)
  if (w.nuc[id] >= 100 && !w.nucDone.includes(id)) {
    w.nucDone.push(id)
    applyFx(n.done.fx, true)
    for (const [k, d] of Object.entries(n.done.rel || {})) shiftRel(k, d)
    if (n.done.fa) w.fa = clamp(w.fa + n.done.fa)
    w.last = { text: n.done.text, ok: true }
    log(`Projeto concluído: ${n.name}.`)
    toast(n.ico, `Concluído: ${n.name}`)
  }
  return true
}

export function askChance(targetId) {
  const rel = game.world.fed[targetId] ?? 50
  return Math.min(0.92, Math.max(0.08, 0.2 + (rel - 25) / 90))
}

export function fedAct(targetId, actionId) {
  if (!worldReady()) return false
  const d = fedDefs().find((x) => x.id === targetId)
  const a = d && FED_ACTIONS[d.dir].find((x) => x.id === actionId)
  if (!a || !canPay(a.fx)) return false
  if (a.ask) {
    if (R() < askChance(targetId)) {
      spendWorld({ ...a.fx, ...a.ask.ok }, `${d.name}: ${a.name} deu certo.`, `${d.name} liberou: ${a.name.toLowerCase()}.`)
      shiftFed(targetId, a.rel)
    } else {
      spendWorld({ ...a.fx, ...a.ask.fail }, `${d.name}: ${a.name} foi negado.`, `${d.name} negou o pedido.`)
      game.world.last.ok = false
      shiftFed(targetId, a.ask.failRel)
    }
    return true
  }
  spendWorld(a.fx, `${d.name}: ${a.name}.`, `${a.name} (${d.name}): feito.`)
  shiftFed(targetId, a.rel)
  return true
}

// Leis
export const lawName = (temaId, ousId) => {
  const t = TEMAS.find((x) => x.id === temaId)
  return t ? `${LAW_PREFIX[officeId()] || 'Projeto:'} ${t.nomes[ousId - 1]}` : ''
}
export const lawHas = (temaId, ousId) => game.world.laws.some((l) => l.name === lawName(temaId, ousId))
export function lawChance(temaId, ousId) {
  const co = coalition()
  const peer = fedDefs().find((d) => d.dir === 'peer')
  let p = 0.3 + (game.stats.cong - 50) / 130 + co.votes * 0.05 - (co.angry ? 0.12 : 0) - (ousId - 1) * 0.13
  if (peer) p += ((game.world.fed[peer.id] ?? 50) - 50) / 250
  p += comissaoBonus(temaId)
  return Math.min(0.92, Math.max(0.06, p))
}
export function lawsActive() {
  return game.world.laws.filter((l) => l.stage === game.stage)
}
export function proposeLaw(temaId, ousId) {
  const w = game.world
  const t = TEMAS.find((x) => x.id === temaId)
  const o = OUSADIA.find((x) => x.id === ousId)
  if (game.phase !== 'actions' || w.lawUsed || !t || !o || lawHas(temaId, ousId) || game.stats.cash < o.cost) return false
  w.lawN = (w.lawN || 0) + 1
  if (w.lawN >= lawCap()) w.lawUsed = true
  game.delta = {}
  const name = lawName(temaId, ousId)
  if (R() < lawChance(temaId, ousId)) {
    w.laws.unshift({ id: Math.random().toString(36).slice(2), name, tema: t.id, stat: t.stat, ous: o.id, stage: game.stage, office: officeId() })
    if (w.laws.length > 16) w.laws.pop()
    applyFx({ [t.stat]: o.one, pop: o.id * 0.5, cash: -o.cost }, true)
    if (t.id === 'educacao') eduAdd(o.id * 1.5)
    if (t.id === 'ciencia') {
      eduAdd(o.id)
      cienAdd(1)
    }
    w.last = { text: `Aprovada: ${name}`, ok: true }
    log(`Lei aprovada: ${name}.`)
    toast('⚖️', 'Lei aprovada!')
  } else {
    applyFx({ img: -o.failImg, cong: -o.failCong, cash: -o.cost }, true)
    w.last = { text: `Rejeitada: ${name}. A base não segurou os votos.`, ok: false }
    log(`Lei rejeitada: ${name}.`)
  }
  save()
  return true
}

// Efeito das leis em vigor, com teto por atributo
function lawPassive() {
  const fx = {}
  for (const l of lawsActive()) {
    const o = OUSADIA.find((x) => x.id === l.ous)
    fx[l.stat] = Math.min(1.2, (fx[l.stat] || 0) + o.pass)
  }
  return fx
}

function tickWorld() {
  ensureWorld()
  const w = game.world
  const pres = officeId() === 'presidente'
  w.pts = pres ? 4 : 3
  w.ptsM = 2
  w.ptsP = 2
  w.lawUsed = false
  w.lawN = 0
  w.last = null
  for (const k in w.rel) w.rel[k] = clamp(w.rel[k] + (50 - w.rel[k]) * 0.04)
  for (const k in w.fed) w.fed[k] = clamp(w.fed[k] + (50 - w.fed[k]) * 0.06)
  w.fa = clamp(w.fa + (50 - w.fa) * 0.05)
  const fx = {}
  const add = (o, m) => {
    for (const k in o) fx[k] = (fx[k] || 0) + o[k] * m
  }
  if (pres) {
    for (const p of PARTNERS) add(PARTNER_PASSIVE[p.id], (w.rel[p.id] - 50) / 50)
    if (w.fa < 25) add({ seg: -1, cong: -0.5 }, 1)
    else if (w.fa > 70) add({ seg: 0.5, cong: 0.4 }, 1)
    for (const n of NUC) if (w.nucDone.includes(n.id)) add(n.passive, 1)
    for (const b of BLOCOS) if (w.blocos.includes(b.id)) add(b.passive, 1)
    for (const t of TRATADOS) if (w.tratados.includes(t.id)) add(t.pass, 1)
    for (const x of w.pactos) add({ seg: x.tipo === 'defesa' ? 0.25 : 0.1 }, 1)
  }
  for (const t of TECHS) if (w.tech.done.includes(t.id) && (pres || (officeId() === 'governador' && t.civil))) add(t.pass, pres ? 1 : 0.6)
  for (const d of fedDefs()) add(d.pass, ((w.fed[d.id] ?? 50) - 50) / 50)
  const wm = pres ? 1 : officeId() === 'governador' ? 0.6 : 0.4
  for (const wr of w.wars) {
    const def = WARS.find((x) => x.id === wr.id)
    const st = STANCE[wr.stance || 'neutro']
    if (def) add(def.fx, st.mult * wm)
    if (pres) add(st.pass, 1)
    wr.left--
  }
  for (const wr of w.wars.filter((x) => x.left <= 0)) {
    const def = WARS.find((x) => x.id === wr.id)
    if (def) {
      log(`${def.name} chegou ao fim.`)
      toast(def.ico, `${def.name} terminou`)
    }
  }
  w.wars = w.wars.filter((x) => x.left > 0)
  if (w.pending && !w.wars.some((x) => x.id === w.pending)) w.pending = null
  const lp = lawPassive()
  add(lp, 1)
  for (const k in fx) fx[k] = Math.max(-1.6, Math.min(1.6, Math.round(fx[k] * 100) / 100))
  applyFx(fx)
  if (w.wars.length < 2 && game.total > 0 && R() < 0.14) {
    const free = WARS.filter((x) => !w.wars.some((y) => y.id === x.id))
    const def = free[Math.floor(R() * free.length)]
    if (def) {
      w.wars.push({ id: def.id, left: 5 + Math.floor(R() * 6), stance: pres ? null : 'neutro' })
      log(`Notícia do mundo: ${def.name}.`)
      toast(def.ico, def.name)
      if (pres) w.pending = def.id
    }
  }
}

function worldHook(id, i, lucky) {
  const w = game.world
  if (!w) return
  if (id === 'guerra_posicao') {
    const wr = w.wars.find((x) => x.id === w.pending) || w.wars.find((x) => !x.stance)
    const def = wr && WARS.find((x) => x.id === wr.id)
    const st = ['neutro', 'mediar', 'lado', 'ajuda', 'lucrar'][i] || 'neutro'
    if (wr && def) {
      wr.stance = st
      if (st === 'lado') {
        shiftRel(def.who[0], 8)
        shiftRel(def.who[1], -8)
      } else if (st === 'mediar') {
        if (lucky) {
          shiftRel(def.who[0], 3)
          shiftRel(def.who[1], 3)
        } else wr.stance = 'neutro'
      } else if (st === 'lucrar') {
        shiftRel(def.who[0], -3)
        shiftRel(def.who[1], -3)
      }
    }
    w.pending = null
    return
  }
  const PH = {
    tarifa_eua: [[['eua', -10]], [['eua', 6]], [['china', 8], ['eua', -4]]],
    cupula_emergentes: [[['china', 6], ['rus', 4], ['eua', -3]], [['eua', 3], ['ue', 3]], []],
    aiea_inspecao: [[['eua', 4], ['ue', 3]], [['eua', -8], ['ue', -4]], [['china', 3]]],
    acordo_mercosul_ue: [[['ue', 8], ['arg', 3]], [['ue', 3]], [['ue', -6]]],
    incidente_embaixada: [[['eua', -3]], [['eua', 3]], []],
  }
  if (PH[id] && PH[id][i]) for (const [k, d] of PH[id][i]) shiftRel(k, d)
  const FH = {
    prefeitos_cobram: ['prefeitos', [10, 4, -10]],
    governador_condiciona: ['governador', [10, -12, 2]],
    planalto_convenio: ['planalto', [8, 3, -4]],
    prefeito_cargo: ['prefeito', [10, -12]],
    governadores_frente: ['governadores', [8, 12, -10]],
  }
  if (FH[id] && typeof FH[id][1][i] === 'number') shiftFed(FH[id][0], FH[id][1][i])
  if (id === 'quartel_inquieto') {
    if (i === 0) w.fa = clamp(w.fa + 10)
    else if (i === 1) w.fa = clamp(w.fa + 15)
    else w.fa = clamp(w.fa + (lucky ? 5 : -15))
  } else if (id === 'angra_incidente' && i === 0) w.nuc.angra = Math.max(0, w.nuc.angra - 10)
  else if (id === 'aiea_inspecao' && i === 0) w.nuc.enr = Math.max(0, w.nuc.enr - 10)
}

/* ---------- modo sandbox (testes) ---------- */

export const devEvents = () => country().events.map((e) => ({ id: e.id, title: e.title, stages: e.stages }))
export const devOffices = () => Object.values(OFFICES).map((o) => ({ id: o.id, name: o.name }))

export function devSet(k, v) {
  v = Number(v)
  if (Number.isNaN(v)) return
  if (k === 'age') game.traits.idade = String(Math.max(18, v - Math.floor(roundStart() / 12)))
  else if (game.stats[k] !== undefined) game.stats[k] = clamp(v)
  save()
}

export function devWorld(what) {
  const w = game.world
  if (what === 'war') {
    const free = WARS.filter((x) => !w.wars.some((y) => y.id === x.id))
    if (!free.length) return
    const def = free[Math.floor(Math.random() * free.length)]
    w.wars.push({ id: def.id, left: 8, stance: isPresident() ? null : 'neutro' })
    if (isPresident()) w.pending = def.id
  } else if (what === 'fa') w.fa = 10
  else if (what === 'nuc') {
    for (const k of Object.keys(w.nuc)) w.nuc[k] = 75
  } else if (what === 'rel') {
    for (const k of Object.keys(w.rel)) w.rel[k] = 85
    for (const k of Object.keys(w.fed)) w.fed[k] = 85
  } else if (what === 'pts') {
    w.pts = 9
    w.ptsM = 9
    w.ptsP = 9
    w.lawUsed = false
    w.lawN = 0
  }
  save()
}

export function devGod() {
  game.god = !game.god
  save()
}

export function devOffice(id) {
  const o = OFFICES[id]
  if (!o || !['event', 'outcome', 'actions', 'recap', 'rumo', 'plan', 'balance'].includes(game.phase)) return
  game.office = id
  game.stage = o.tier
  game.term = 1
  game.turn = 0
  game.seen = []
  game.election = null
  game.team = { vice: null, supl: [], slots: {} }
  if (o.vice) game.team.vice = { id: 'tecnico', name: 'Técnico respeitado', amb: 0.05 }
  if (o.supl) game.team.supl = Array.from({ length: o.supl }, () => ({ id: 'aliado', name: 'Aliado fiel do partido', amb: 0.05 }))
  autoTeam()
  resetFed()
  resetFame()
  log(`[sandbox] Foi direto para ${o.name}.`)
  beginTurn()
}

export function devEndTerm() {
  if (!['event', 'outcome', 'actions', 'recap'].includes(game.phase)) return
  game.turn = stageInfo().turns
  game.recap = null
  finishTerm()
}

export function devEvent(id) {
  if (!['event', 'outcome', 'actions', 'recap', 'rumo', 'plan', 'balance'].includes(game.phase)) return
  const t = game.team
  if (id === 'equipe_escandalo' && t && !t.hot) {
    const d = teamDef()
    t.hot = d.slots[0].id
  }
  game.eventId = id
  game.phase = 'event'
  save()
}

export function devElection(win) {
  if (!['campaign', 'runoff'].includes(game.phase) || !game.election) return
  const e = game.election
  if (!e.ticketDone) {
    const s = ticketSpec()
    e.ticket = { vice: s.vice ? { id: 'tecnico', name: 'Técnico respeitado', amb: 0.05 } : null, supl: Array.from({ length: s.supl }, () => ({ id: 'aliado', name: 'Aliado fiel do partido', amb: 0.05 })) }
    e.ticketDone = true
  }
  finishElection(win ? { share: 60, h2h: 60, won: true, campaign: 'Teste' } : { share: 30, h2h: 30, won: false, campaign: 'Teste' })
}

export function devTeam(what) {
  const t = game.team
  if (!t) return
  const d = teamDef()
  if (what === 'conspire' && t.vice) {
    t.vice.conspire = true
    t.vice.amb = Math.max(t.vice.amb, 0.6)
  } else if (what === 'hot' && d) {
    t.hot = d.slots[0].id
  } else if (what === 'leave') startLeave(2)
  else if (what === 'angry') t.coalAngry = 4
  save()
}

function endGame() {
  const st = game.stats
  const avg = (st.pop + st.eco + st.soc + st.seg + st.img) / 5
  let title = 'Mandato apagado'
  let text = 'Passou pela história sem fazer barulho.'
  if (avg >= 65) {
    title = 'Estadista'
    text = 'Entrou para os livros de História. Praça, rua e aeroporto ganharam seu nome.'
  } else if (avg >= 56) {
    title = 'Bom governo'
    text = 'Entregou mais do que prometeu e saiu com a cabeça erguida.'
  } else if (avg >= 47) {
    title = 'Governo mediano'
    text = 'Teve acertos e erros. Os historiadores vão brigar por décadas.'
  }
  if (game.lastPlan && game.lastPlan.total) text += ` Promessas cumpridas no último mandato: ${game.lastPlan.kept}/${game.lastPlan.total}.`
  const sc = game.poder && game.poder.sucessao && game.poder.sucessao.fim
  if (sc) text += sc.won ? ` ${game.poder.sucessao.nome} foi eleito(a) seu sucessor(a) e levou o projeto adiante.` : ` ${game.poder.sucessao.nome} tentou a sucessão, mas perdeu a eleição.`
  game.legacy = { title, text }
  game.phase = 'end'
  finalize(true)
  clearSave()
}
/* ---------- redes e jornal: interações ---------- */
const roundId = () => game.total
export const reactsLeft = () => (game.reactT === roundId() ? Math.max(0, 2 - game.reactN) : 2)
export const canPost = () => game.postT !== roundId()

export const REACTS = {
  up: [{ id: 'curtir', label: '❤️ Curtir e agradecer' }, { id: 'compartilhar', label: '📣 Compartilhar' }],
  flat: [{ id: 'curtir', label: '❤️ Curtir' }, { id: 'compartilhar', label: '📣 Compartilhar' }],
  down: [{ id: 'calma', label: '🤝 Responder com calma' }, { id: 'rebater', label: '🔥 Rebater' }, { id: 'bloquear', label: '🚫 Bloquear' }],
}

export function reactPost(id, kind) {
  const p = game.feed.find((x) => x.id === id)
  if (!p || p.done || p.mine || reactsLeft() <= 0) return null
  if (game.reactT !== roundId()) {
    game.reactT = roundId()
    game.reactN = 0
  }
  game.reactN++
  game.delta = {}
  let fx = {}
  let text = ''
  if (kind === 'curtir') {
    fx = { pop: 0.6, img: 0.2 }
    text = 'Você curtiu e agradeceu. Gesto pequeno, efeito grande.'
  } else if (kind === 'compartilhar') {
    fx = { pop: 1.2 }
    p.likes = Math.round(p.likes * 1.6)
    text = 'Você compartilhou e o post bombou ainda mais.'
  } else if (kind === 'calma') {
    const ok = R() < 0.7
    fx = ok ? { img: 1.5, pop: 0.5 } : { img: -0.5 }
    text = ok ? 'A resposta educada desarmou o clima.' : 'Ninguém se convenceu e o post continuou rodando.'
  } else if (kind === 'rebater') {
    const ok = R() < 0.45
    fx = ok ? { pop: 2, img: 0.5 } : { img: -2.5, pop: -1 }
    text = ok ? 'Você rebateu à altura e a sua torcida adorou.' : 'A resposta virou print e piorou a situação.'
    if (!ok) pushTrend('#Treta', 55)
  } else if (kind === 'bloquear') {
    fx = { img: -0.8 }
    text = 'Você bloqueou. Quem viu chamou de censura.'
  } else return null
  p.done = kind
  p.note = text
  applyFx(fx, true)
  save()
  return { text, fx }
}

export const POST_OPTS = [
  { id: 'contas', label: '📊 Prestação de contas', desc: 'Mostrar o que foi entregue. Seguro e útil.' },
  { id: 'humor', label: '😂 Vídeo bem-humorado', desc: 'Pode viralizar ou virar vergonha.' },
  { id: 'rival', label: '🗡️ Responder o rival', desc: 'Atrai atenção e briga.' },
  { id: 'polemica', label: '🔥 Opinião polêmica', desc: 'Engaja muito e cobra imagem.' },
]
export function doPost(kind) {
  if (!canPost() || !POST_OPTS.find((o) => o.id === kind)) return null
  game.postT = roundId()
  game.delta = {}
  let fx = {}
  let text = ''
  let tn = 'up'
  if (kind === 'contas') {
    fx = { img: 2, pop: 0.5 }
    text = `Balanço do trabalho em ${game.city?.name || game.region.name}: o que foi entregue e o que ainda falta. #Transparencia`
  } else if (kind === 'humor') {
    const ok = R() < 0.55
    fx = ok ? { pop: 2.5, img: 0.5 } : { img: -2 }
    text = ok ? 'Gravei um vídeo tentando dançar. Pelo menos tentei. #Humildade' : 'Tentei fazer graça e o vídeo foi parar em todas as páginas de zoeira.'
    tn = ok ? 'up' : 'down'
  } else if (kind === 'rival') {
    const ok = R() < 0.5
    fx = ok ? { pop: 2.5, img: -0.5 } : { pop: -1, img: -1.5 }
    text = `Respondi ${game.rival || 'o adversário'}: quem fala demais entrega pouco.`
    tn = ok ? 'up' : 'down'
    pushTrend('#Treta', 60)
  } else {
    fx = { pop: 4, img: -4 }
    text = 'Falei o que muita gente pensa e poucos têm coragem de dizer. Pode vir pra cima. #SemFiltro'
    tn = 'flat'
    pushTrend('#SemFiltro', 70)
  }
  applyFx(fx, true)
  game.feed.unshift({ id: Math.random().toString(36).slice(2), user: `@${slug(game.name).toLowerCase() || 'voce'}`, mine: true, text, likes: Math.round(30 + R() * [60, 800, 6000, 40000][game.stage]), tone: tn })
  game.feed = game.feed.slice(0, 40)
  log(`Postou nas redes: ${POST_OPTS.find((o) => o.id === kind).label}.`)
  save()
  return { fx, text }
}

export const PAPER_ACTS = [
  { id: 'agradecer', label: '🙏 Agradecer e divulgar a matéria', desc: 'Faz sentido quando a notícia é boa.' },
  { id: 'entrevista', label: '🎙️ Dar uma entrevista exclusiva', desc: 'Atenção garantida, mas o jornalista pergunta o que quiser.' },
  { id: 'resposta', label: '✍️ Pedir direito de resposta', desc: 'A chance depende de como você se dá com o editor.' },
  { id: 'publi', label: '💸 Bancar um publieditorial', desc: 'Custa 4 de caixa e pode ser descoberto.', dirty: true },
  { id: 'plantar', label: '🕵️ Plantar uma nota contra o rival', desc: 'Pode enfraquecer o rival. Se vazar, o escândalo é seu.', dirty: true },
]
export function paperAct(kind) {
  const o = game.outcome
  if (!o || o.paper) return null
  const ed = contactOf('jornalista')
  const rel = ed ? ed.rel : 40
  game.delta = {}
  let fx = {}
  let text = ''
  let dirty = null
  if (kind === 'agradecer') {
    fx = o.tone === 'down' ? { pop: 0.3 } : { pop: 1.5, img: 0.5 }
    text = o.tone === 'down' ? 'Você agradeceu a cobertura. Deu para sentir a ironia.' : 'A divulgação rendeu elogios e novos seguidores.'
  } else if (kind === 'entrevista') {
    const ok = R() < 0.6
    fx = ok ? { pop: 3, img: 1 } : { pop: 1, img: -3 }
    text = ok ? 'A entrevista foi bem e virou assunto nas redes.' : 'Uma pergunta te pegou desprevenido e o trecho circulou o dia todo.'
    if (ed) ed.rel = clampRel(ed.rel + 5)
  } else if (kind === 'resposta') {
    const ok = R() < 0.3 + rel / 150 + (o.tone === 'down' ? 0.1 : 0)
    fx = ok ? { img: 3, pop: 1 } : { img: -1 }
    text = ok ? 'O jornal publicou a sua versão em destaque.' : 'O editor recusou e disse que a matéria está correta.'
    if (ed) ed.rel = clampRel(ed.rel + (ok ? -2 : -4))
  } else if (kind === 'publi') {
    if (game.stats.cash < 4) return null
    fx = { pop: 4, img: 1, cash: -4 }
    dirty = { heat: 4, risk: 0.25, riskFx: { img: -6 }, text: 'Descobriram que o "conteúdo patrocinado" era seu. O escândalo foi grande.' }
    text = 'O publieditorial saiu com cara de reportagem e agradou.'
  } else if (kind === 'plantar') {
    fx = { pop: 2, cong: 1 }
    game.rivalMod = (game.rivalMod || 0) + 2
    rvOdio(2)
    dirty = { heat: 8, risk: 0.35, riskFx: { img: -7 }, text: 'Rastrearam a origem da nota até o seu gabinete.' }
    text = `A nota atingiu ${game.rival || 'o rival'} e a oposição teve de se explicar.`
  } else return null
  curSphere = STAGE_SPHERE[game.stage]
  applyFx(fx, true)
  curSphere = null
  if (dirty) {
    game.dirty++
    game.termDirty++
    game.heat = clamp(game.heat + dirty.heat)
    if (R() < dirty.risk) {
      applyFx(dirty.riskFx, true)
      text += ` ${dirty.text}`
      toast('🚨', 'Escândalo na imprensa!')
      pushPosts(2, 'down', 'Escandalo')
    }
  }
  o.paper = { kind, text, label: PAPER_ACTS.find((x) => x.id === kind).label }
  log(`Jornal: ${o.paper.label}.`)
  save()
  return o.paper
}

/* ---------- poderes: sanção, veto, leis em vigor, linha do tempo ---------- */
const EXEC = ['prefeito', 'governador', 'presidente']
export const isExec = () => EXEC.includes(officeId())
function ensurePoder() {
  const p = game.poder
  if (!p || !p.statutes || !p.timeline || !p.press || !p.seen) game.poder = { statutes: [], timeline: [], pending: null, press: [], seen: [], ...(p || {}) }
}
export function timelineAdd(icon, text, tn = 'flat') {
  ensurePoder()
  game.poder.timeline.unshift({ r: game.total, icon, text, tone: tn })
  game.poder.timeline = game.poder.timeline.slice(0, 40)
  if (!game.poder.bio) game.poder.bio = { marcos: [] }
  game.poder.bio.marcos.push({ r: game.total, icon, text, tone: tn, cargo: officeId() })
  if (game.poder.bio.marcos.length > 80) game.poder.bio.marcos.splice(0, game.poder.bio.marcos.length - 80)
}
function enactStatute(bill, how, k = 1) {
  ensurePoder()
  if (bill.edu) eduAdd(bill.edu * k)
  const fx = statuteFx(bill, k)
  if (!Object.keys(fx).length) return
  game.poder.statutes.unshift({ id: bill.id + ':' + game.total, billId: bill.id, title: bill.title, icon: bill.icon, how, fx, left: 6, stage: game.stage })
  game.poder.statutes = game.poder.statutes.slice(0, 14)
}
export const statutesActive = () => ((game.poder && game.poder.statutes) || []).filter((x) => x.stage === game.stage && x.left > 0)
function statutePassive() {
  const fx = {}
  for (const st of statutesActive()) for (const k in st.fx) fx[k] = Math.max(-1.2, Math.min(1.2, (fx[k] || 0) + st.fx[k]))
  const c = comissaoAtiva()
  if (c) fx[c.stat] = Math.min(1.2, (fx[c.stat] || 0) + 0.4)
  for (const a of nomeados()) for (const k in a.pass) fx[k] = Math.min(1.2, (fx[k] || 0) + a.pass[k])
  const e = eduNow()
  const ef = { eco: clamp((e - 50) / 150, -0.3, 0.5) + Math.min(0.5, cienNow() * 0.1), seg: clamp((e - 50) / 250, -0.2, 0.3), pop: clamp((e - 50) / 300, -0.15, 0.2) }
  for (const k in ef) fx[k] = Math.max(-1.2, Math.min(1.2, (fx[k] || 0) + ef[k]))
  return fx
}
function tickStatutes() {
  for (const st of statutesActive()) st.left--
}
const PRESS = {
  sancao: ['✍️', (w, b) => `${w} sanciona “${b}”`, 'up'],
  parcial: ['✂️', (w, b) => `${w} veta parte de “${b}” e sanciona o resto`, 'flat'],
  veto: ['🛑', (w, b) => `${w} veta “${b}”`, 'down'],
  derrubado: ['💥', (w, b) => `Veto de ${w} a “${b}” é derrubado pelo Legislativo`, 'down'],
  mantido: ['🧱', (w, b) => `Veto de ${w} a “${b}” é mantido`, 'up'],
  aprovada: ['🏛️', (w, b) => `“${b}” é aprovado com a articulação de ${w}`, 'up'],
  passou: ['📜', (w, b) => `“${b}” passa, apesar da oposição de ${w}`, 'down'],
  barrada: ['🚧', (w, b) => `Plenário barra “${b}” com a ajuda de ${w}`, 'up'],
  rejeitada: ['📉', (w, b) => `“${b}” é rejeitado e ${w} perde a votação`, 'down'],
  adiada: ['⏸️', (w, b) => `Pedido de vista de ${w} adia a votação de “${b}”`, 'up'],
  decreto: ['🖋️', (w, b) => `${w} edita o ${b.toLowerCase()}`, 'flat'],
  sustado: ['🧨', (w, b) => `Legislativo susta o ${b.toLowerCase()} de ${w}`, 'down'],
  prazo: ['⏳', (w, b) => `“${b}” vira lei por decurso de prazo; ${w} não decidiu`, 'flat'],
}
function pressLaw(kind, bill) {
  const [icon, fn, tn] = PRESS[kind]
  const text = fn(game.name, bill.title)
  ensurePoder()
  timelineAdd(icon, text, tn)
  game.poder.press.push({ icon, text })
  game.poder.press = game.poder.press.slice(-4)
  toast(icon, text)
  pushPosts(2, tn, 'Lei')
  pushTrend('#' + slug(bill.title).slice(0, 18), 70)
}
function betray(delta, why) {
  const c = (game.contacts || []).find((x) => x.id === 'aliado')
  if (!c) return
  const r0 = c.rel
  c.rel = clampRel(c.rel + delta)
  remember(c, why, c.rel - r0)
}
function plenaryAftermath(bill, won, concessions, stance) {
  const sup = billSupport(bill, game.total)
  const op = {}
  if (sup >= 65 && stance === 'con') op.pop = -1
  if (sup <= 35 && stance === 'pro') op.img = -1
  if (sup >= 65 && stance === 'pro' && won) op.pop = 1
  if (sup <= 35 && stance === 'con' && won) op.img = 1
  if (Object.keys(op).length) applyFx(op, true)
  const k = Math.max(0.25, 1 - 0.25 * concessions)
  if (stance === 'pro') {
    if (won) {
      enactStatute(bill, 'plenario', k)
      pressLaw('aprovada', bill)
      betray(1, `Aprovou “${bill.title}” com você`)
    } else {
      pressLaw('rejeitada', bill)
      betray(-1, `Derrota em “${bill.title}”`)
    }
  } else if (won) {
    pressLaw('barrada', bill)
    betray(1, `Barrou “${bill.title}” com você`)
  } else if (game.poder.obstr && R() < 0.5) {
    pressLaw('adiada', bill)
    betray(0, `Obstruiu “${bill.title}”`)
  } else {
    enactStatute(bill, 'plenario', k * 0.5)
    pressLaw('passou', bill)
    betray(-1, `Perdeu a briga contra “${bill.title}”`)
  }
  game.poder.obstr = false
}

// Executivo: um projeto do Legislativo chega para sanção ou veto
function roundPoder() {
  ensurePoder()
  const p = game.poder
  p.leg = { used: [] }
  p.exe = { used: [] }
  p.eduDone = false
  julgarDecretos()
  riscoNomeados()
  roundJudiciario()
  roundMundo()
  if (game.phase === 'over') return
  if (p.pending) {
    // não decidiu na rodada: vira lei por decurso de prazo
    const b = billById(p.pending.billId)
    p.pending = null
    if (b) {
      enactStatute(b, 'prazo', 0.7)
      pressLaw('prazo', b)
    }
  }
  if (!isExec() || R() > 0.65) return
  const pool = billsOf(officeId()).filter((b) => !p.seen.includes(b.id))
  const list = pool.length ? pool : billsOf(officeId())
  const b = list[Math.floor(R() * list.length)]
  p.pending = { billId: b.id, round: game.total }
  p.seen = [b.id, ...p.seen].slice(0, 3)
  toast('📜', `Um projeto do Legislativo aguarda sua decisão: ${b.title}.`)
}
export const pendingBill = () => (game.poder && game.poder.pending ? billById(game.poder.pending.billId) : null)
export function overrideChance(bill, choice) {
  const round = game.poder && game.poder.pending ? game.poder.pending.round : game.total
  let p = 0.5 - (game.stats.cong - 50) / 120 + (billSupport(bill, round) - 50) / 160
  if (choice === 'parcial') p -= 0.3
  return Math.max(0.05, Math.min(0.9, p))
}
export function decideBill(choice) {
  ensurePoder()
  const bill = pendingBill()
  if (!bill || game.phase === 'over') return null
  game.poder.pending = null
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage] === 'mun' ? 'mun' : 'fed'
  let fx
  let overridden = false
  let passed = true
  if (choice === 'sancionar') {
    fx = billOutcome(bill, true, 0, 'pro')
    enactStatute(bill, 'sancao', 1)
    pressLaw('sancao', bill)
    betray(2, `Você sancionou “${bill.title}”`)
  } else if (choice === 'parcial') {
    fx = billOutcome(bill, true, 2, 'pro')
    fx.cong = 1
    if (R() < overrideChance(bill, 'parcial')) {
      overridden = true
      fx = billOutcome(bill, true, 0, 'con')
      enactStatute(bill, 'derrubado', 1)
      pressLaw('derrubado', bill)
    } else {
      enactStatute(bill, 'parcial', 0.5)
      pressLaw('parcial', bill)
    }
    betray(-1, `Vetou parte de “${bill.title}”`)
  } else if (R() < overrideChance(bill, 'vetar')) {
    overridden = true
    fx = billOutcome(bill, true, 0, 'con')
    enactStatute(bill, 'derrubado', 1)
    pressLaw('derrubado', bill)
    betray(-4, `Veto a “${bill.title}” foi derrubado`)
  } else {
    passed = false
    fx = billOutcome(bill, false, 0, 'con')
    pressLaw('mantido', bill)
    betray(-3, `Você vetou “${bill.title}”`)
  }
  applyFx(fx, true)
  curSphere = null
  log(`${choice === 'sancionar' ? 'Sancionou' : choice === 'parcial' ? 'Vetou parcialmente' : 'Vetou'} “${bill.title}”${overridden ? ' (veto derrubado)' : ''}.`)
  save()
  return { choice, bill, fx, overridden, passed }
}

/* ---------- Legislativo: fiscalização, comissões, CPI, emendas, obstrução ---------- */
export const isLeg = () => !isExec()
export const lawCap = () => (isLeg() ? 3 : 1)
const SCOPE = {
  vereador: { k: 'mun', name: 'da cidade', m: 1 },
  dep_estadual: { k: 'est', name: 'do estado', m: 1.25 },
  dep_federal: { k: 'fed', name: 'do país', m: 1.5 },
  senador: { k: 'fed', name: 'do país', m: 1.5 },
}
export const legScope = () => SCOPE[officeId()] || SCOPE.vereador
export const VISITS = [
  { id: 'hospital', icon: '🏥', name: 'Hospitais e postos de saúde', stat: 'soc', ok: 'Filas, falta de remédio e macas no corredor. Você grava tudo e cobra o Executivo.', fine: 'O hospital está em ordem e a equipe agradece a visita.' },
  { id: 'delegacia', icon: '🚓', name: 'Delegacias e batalhões', stat: 'seg', ok: 'Viaturas paradas e efetivo no limite. A denúncia vira pauta.', fine: 'A polícia mostra resultados e recebe você bem.' },
  { id: 'escola', icon: '🏫', name: 'Escolas públicas', stat: 'soc', ok: 'Telhado caindo e merenda faltando. Os pais te acompanham nas redes.', fine: 'Escola funcionando e alunos felizes na foto.' },
  { id: 'obra', icon: '🚧', name: 'Obras e contratos', stat: 'eco', ok: 'Obra parada e contrato com preço inflado. O Tribunal de Contas é acionado.', fine: 'A obra está no prazo e você ganha um bom registro.' },
]
const legUsed = (id) => !!(game.poder && game.poder.leg && game.poder.leg.used.includes(id))
export const legLeft = () => 2 - ((game.poder && game.poder.leg && game.poder.leg.used.length) || 0)
export const legCan = (id) => isLeg() && game.phase === 'actions' && !legUsed(id) && legLeft() > 0
function legMark(id) {
  ensurePoder()
  if (!game.poder.leg) game.poder.leg = { used: [] }
  game.poder.leg.used.push(id)
}
export function fiscalizar(id) {
  const v = VISITS.find((x) => x.id === id)
  if (!v || !legCan('visita:' + id)) return null
  legMark('visita:' + id)
  const m = legScope().m
  const found = R() < 0.55 + (game.stats.img - 50) / 300
  game.delta = {}
  curSphere = legScope().k
  const fx = found ? { pop: Math.round(2 * m * 10) / 10, img: 1, cong: -1, [v.stat]: 1 } : { img: 1.5, pop: Math.round(1 * m * 10) / 10 }
  applyFx(fx, true)
  curSphere = null
  const text = found ? `${game.name} fiscaliza ${v.name.toLowerCase()} ${legScope().name} e denuncia problemas` : `${game.name} visita ${v.name.toLowerCase()} ${legScope().name}`
  timelineAdd(v.icon, text, found ? 'up' : 'flat')
  toast(v.icon, found ? 'Você encontrou problemas e a denúncia repercutiu.' : 'Visita feita. Bom registro.')
  pushPosts(2, found ? 'up' : 'flat', 'Fiscalizacao')
  cnt('fisc')
  log(`Fiscalizou: ${v.name}.`)
  save()
  return { found, text: found ? v.ok : v.fine, fx, v }
}
export const COMISSOES = [
  { id: 'saude', icon: '🩺', name: 'Comissão de Saúde', stat: 'soc' },
  { id: 'seguranca', icon: '🛡️', name: 'Comissão de Segurança', stat: 'seg' },
  { id: 'economia', icon: '📈', name: 'Comissão de Finanças e Economia', stat: 'eco' },
  { id: 'educacao', icon: '📚', name: 'Comissão de Educação', stat: 'soc' },
]
export const comissaoAtiva = () => {
  const c = game.poder && game.poder.com
  if (!c || c.stage !== game.stage || !isLeg()) return null
  return COMISSOES.find((x) => x.id === c.id) || null
}
function comissaoBonus(temaId) {
  const c = comissaoAtiva()
  const t = TEMAS.find((x) => x.id === temaId)
  return c && t && t.stat === c.stat ? 0.08 : 0
}
export function escolherComissao(id) {
  ensurePoder()
  const c = COMISSOES.find((x) => x.id === id)
  if (!c || !isLeg() || comissaoAtiva()) return false
  game.poder.com = { id, stage: game.stage }
  timelineAdd(c.icon, `${game.name} assume lugar na ${c.name}`, 'up')
  toast(c.icon, `Você entrou na ${c.name}.`)
  applyFx({ cong: 2 }, true)
  save()
  return true
}
export function relatar() {
  const c = comissaoAtiva()
  if (!c || !legCan('relatar')) return null
  legMark('relatar')
  game.delta = {}
  const pool = billsOf(officeId()).filter((b) => statuteFx(b, 1)[c.stat])
  const b = pool.length ? pool[Math.floor(R() * pool.length)] : null
  const fx = { cong: 1.5, img: 0.5, [c.stat]: 1 }
  applyFx(fx, true)
  let enacted = false
  if (b && R() < 0.25 + (game.stats.cong - 50) / 200) {
    enactStatute(b, 'plenario', 0.8)
    pressLaw('aprovada', b)
    enacted = true
  } else {
    timelineAdd(c.icon, `${game.name} relata projetos na ${c.name}`, 'flat')
  }
  cnt('relat')
  log(`Relatoria na ${c.name}.`)
  save()
  return { fx, bill: enacted ? b : null, c }
}
export const cpiDone = () => !!(game.poder && game.poder.cpi === game.stage)
export const CPIS = [
  { id: 'exec', icon: '🏛️', name: 'Gestão do Executivo', hard: 0.12 },
  { id: 'setor', icon: '🏭', name: 'Contratos com empresas', hard: 0 },
  { id: 'crime', icon: '🕵️', name: 'Crime organizado', hard: 0.08 },
]
export function cpiChance(id) {
  const k = CPIS.find((x) => x.id === id)
  const c = comissaoAtiva()
  return Math.max(0.1, Math.min(0.85, 0.4 + (game.stats.cong - 50) / 150 + (game.stats.img - 50) / 250 - (k ? k.hard : 0) + (c ? 0.05 : 0)))
}
export function abrirCPI(id) {
  const k = CPIS.find((x) => x.id === id)
  if (!k || !isLeg() || cpiDone() || game.phase !== 'actions' || game.stats.cash < 2) return null
  ensurePoder()
  game.poder.cpi = game.stage
  game.delta = {}
  curSphere = legScope().k
  const ok = R() < cpiChance(id)
  const fx = ok ? { img: 4, pop: 3, cong: -2, cash: -2 } : { cong: -4, img: -2, cash: -2 }
  applyFx(fx, true)
  curSphere = null
  game.heat = clamp(game.heat + (ok ? 3 : 1))
  const text = ok ? `CPI sobre ${k.name.toLowerCase()} encontra irregularidades; ${game.name} é o autor` : `CPI sobre ${k.name.toLowerCase()} naufraga e ${game.name} sai enfraquecido`
  timelineAdd(k.icon, text, ok ? 'up' : 'down')
  toast(k.icon, ok ? 'A CPI deu resultado!' : 'A CPI não saiu do papel.')
  pushPosts(3, ok ? 'up' : 'down', 'CPI')
  pushTrend('#CPI' + slug(k.name).slice(0, 10), 80)
  if (ok) cnt('cpiok')
  log(`CPI: ${k.name} (${ok ? 'sucesso' : 'fracasso'}).`)
  save()
  return { ok, k, fx }
}
export const EMENDAS = [
  { id: 'saude', icon: '🏥', name: 'Reforma de hospital', stat: 'soc' },
  { id: 'seguranca', icon: '🚓', name: 'Viaturas e equipamentos', stat: 'seg' },
  { id: 'obra', icon: '🛣️', name: 'Obra de infraestrutura', stat: 'eco' },
]
export function emendar(id) {
  const e = EMENDAS.find((x) => x.id === id)
  if (!e || !legCan('emenda')) return null
  legMark('emenda')
  game.delta = {}
  curSphere = legScope().k
  const m = legScope().m
  const fx = { [e.stat]: Math.round(2 * m * 10) / 10, pop: Math.round(1.5 * m * 10) / 10, cong: -1 }
  applyFx(fx, true)
  curSphere = null
  betray(1, `Emenda sua para ${e.name.toLowerCase()}`)
  timelineAdd(e.icon, `${game.name} destina emenda parlamentar: ${e.name.toLowerCase()}`, 'up')
  toast(e.icon, 'Emenda parlamentar destinada.')
  log(`Emenda: ${e.name}.`)
  save()
  return { fx, e }
}
export const obstrucaoAtiva = () => !!(game.poder && game.poder.obstr)
export function obstruir() {
  if (!legCan('obstrucao') || obstrucaoAtiva()) return false
  legMark('obstrucao')
  ensurePoder()
  game.poder.obstr = true
  game.delta = {}
  applyFx({ img: -1, cong: 1 }, true)
  toast('⏸️', 'Obstrução armada: se perder a próxima votação contra um projeto, pode pedir vista.')
  log('Armou obstrução.')
  save()
  return true
}

/* ---------- Executivo: nomeações, emendas, decretos ---------- */
const exeUsed = (id) => !!(game.poder && game.poder.exe && game.poder.exe.used.includes(id))
export const exeLeft = () => 2 - ((game.poder && game.poder.exe && game.poder.exe.used.length) || 0)
export const exeCan = (id) => isExec() && game.phase === 'actions' && !exeUsed(id) && exeLeft() > 0
function exeMark(id) {
  ensurePoder()
  if (!game.poder.exe) game.poder.exe = { used: [] }
  game.poder.exe.used.push(id)
}
export const CARGO = { prefeito: 'Secretário(a)', governador: 'Secretário(a)', presidente: 'Ministro(a)' }
export const cargoName = () => CARGO[officeId()] || 'Secretário(a)'
export const PASTAS = [
  { id: 'economia', icon: '📈', name: 'Fazenda e Economia', stat: 'eco' },
  { id: 'saude', icon: '🩺', name: 'Saúde e Educação', stat: 'soc' },
  { id: 'seguranca', icon: '🛡️', name: 'Segurança Pública', stat: 'seg' },
  { id: 'defesa', icon: '🎖️', name: 'Defesa', stat: 'seg', only: ['presidente'] },
]
export const pastasNow = () => PASTAS.filter((x) => !x.only || x.only.includes(officeId()))
export const PERFIS = [
  { id: 'militar', icon: '🎖️', name: 'Militar de confiança', desc: 'Só na Defesa: as forças ficam tranquilas, mas civis estranham.', pass: (st) => ({ [st]: 0.4 }), risk: 0.03, only: 'defesa' },
  { id: 'tecnico', icon: '🎓', name: 'Técnico(a) de carreira', desc: 'Entrega resultado e dá pouca confusão, mas não traz votos.', pass: (st) => ({ [st]: 0.5 }), risk: 0.02 },
  { id: 'politico', icon: '🗳️', name: 'Indicação política', desc: 'Compra apoio no Congresso. Rende menos na pasta e tem risco médio de escândalo.', pass: (st) => ({ [st]: 0.2, cong: 0.5 }), risk: 0.05 },
  { id: 'amigo', icon: '🍻', name: 'Amigo de confiança', desc: 'Lealdade total e base tranquila, mas é o que mais dá manchete ruim.', pass: (st) => ({ cong: 0.3, [st]: 0.1 }), risk: 0.09 },
]
export const nomeados = () => {
  const c = (game.poder && game.poder.cab) || {}
  return Object.values(c).filter((a) => a && a.stage === game.stage && isExec())
}
export const nomeadoDe = (pasta) => ((game.poder && game.poder.cab) || {})[pasta] || null
export function nomear(pasta, perfil) {
  const pa = PASTAS.find((x) => x.id === pasta)
  const pf = PERFIS.find((x) => x.id === perfil)
  if (!pa || !pf || !exeCan('nomear:' + pasta)) return null
  if (pf.only && pf.only !== pasta) return null
  if (pa.only && !pa.only.includes(officeId())) return null
  ensurePoder()
  const prev = nomeadoDe(pasta)
  game.delta = {}
  if (prev && prev.stage === game.stage) applyFx({ img: -1, cong: prev.perfil === 'politico' ? -1 : 0 }, true)
  exeMark('nomear:' + pasta)
  const nome = candName(R)
  game.poder.cab = { ...(game.poder.cab || {}), [pasta]: { nome, perfil, pasta, stage: game.stage, pass: pf.pass(pa.stat), risk: pf.risk } }
  applyFx({ cong: perfil === 'politico' ? 2 : perfil === 'amigo' ? 1 : 0, img: perfil === 'tecnico' ? 1 : 0 }, true)
  timelineAdd(pa.icon, `${game.name} nomeia ${nome} para ${pa.name}`, 'up')
  toast(pa.icon, `${nome} assume ${pa.name}.`)
  cnt('nome')
  if (pasta === 'defesa') ministroDefesa(perfil)
  log(`Nomeou ${nome} (${pf.name}).`)
  save()
  return { nome, pa, pf }
}
function riscoNomeados() {
  if (!isExec()) return
  const cab = (game.poder && game.poder.cab) || {}
  for (const k of Object.keys(cab)) {
    const a = cab[k]
    if (!a || a.stage !== game.stage) continue
    if (R() < a.risk + (game.heat || 0) / 1500) {
      const pa = PASTAS.find((x) => x.id === k)
      delete game.poder.cab[k]
      applyFx({ img: -5, pop: -1, cong: a.perfil === 'tecnico' ? 0 : -1 }, true)
      game.heat = clamp(game.heat + 4)
      timelineAdd('🚨', `${a.nome} cai da ${pa ? pa.name : 'pasta'} após denúncia`, 'down')
      toast('🚨', `${a.nome} caiu após uma denúncia. A pasta ficou vaga.`)
      pushPosts(2, 'down', 'Ministro')
    }
  }
}
export function liberarEmendas(secreto = false) {
  if (!exeCan(secreto ? 'secreto' : 'emendas') || game.stats.cash < (secreto ? 1 : 3)) return null
  exeMark(secreto ? 'secreto' : 'emendas')
  game.delta = {}
  let fx
  let caught = false
  if (secreto) {
    caught = R() < 0.35
    fx = caught ? { cong: 4, cash: -1, img: -8, pop: -2 } : { cong: 7, cash: -1 }
    game.heat = clamp(game.heat + (caught ? 10 : 5))
  } else {
    fx = { cong: 4, pop: 1, cash: -3 }
  }
  applyFx(fx, true)
  betray(secreto ? 1 : 2, secreto ? 'Verba por fora do radar' : 'Emendas liberadas')
  const text = secreto ? (caught ? `Reportagem expõe orçamento paralelo de ${game.name}` : `${game.name} negocia verbas fora do radar com o Congresso`) : `${game.name} libera emendas parlamentares para aprovar a pauta`
  timelineAdd(secreto ? '🕳️' : '💸', text, caught ? 'down' : secreto ? 'flat' : 'up')
  toast(caught ? '🚨' : '💸', caught ? 'O orçamento paralelo vazou!' : 'Emendas liberadas. A base agradece.')
  if (caught) pushPosts(3, 'down', 'Emendas')
  log(secreto ? 'Orçamento paralelo.' : 'Liberou emendas.')
  save()
  return { fx, caught, secreto }
}
export const DECRETOS = [
  { id: 'd-tarifa', icon: '⚡', title: 'Decreto de redução de tarifas', win: { pop: 3, cash: -3, eco: 1 }, lose: {} },
  { id: 'd-policia', icon: '🚓', title: 'Decreto de reforço policial', win: { seg: 3, cash: -2, pop: 1 }, lose: {} },
  { id: 'd-social', icon: '🍲', title: 'Decreto de programa emergencial', win: { soc: 3, pop: 2, cash: -3 }, lose: {} },
  { id: 'd-corte', icon: '✂️', title: 'Decreto de corte de gastos', win: { cash: 4, pop: -2, eco: 1 }, lose: {} },
]
export const sustarChance = () => Math.max(0.08, Math.min(0.7, 0.35 - (game.stats.cong - 50) / 160 + (game.poder.sus || 0) * 0.05))
export function decretar(id) {
  const d = DECRETOS.find((x) => x.id === id)
  if (!d || !exeCan('decreto') || game.stats.cash + (d.win.cash || 0) < 0) return null
  ensurePoder()
  exeMark('decreto')
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage] === 'mun' ? 'mun' : 'fed'
  const fx = { ...d.win, cong: -2 }
  applyFx(fx, true)
  curSphere = null
  enactStatute(d, 'decreto', 1)
  const st = game.poder.statutes[0]
  if (st && st.billId === d.id) {
    st.fragile = true
    st.judged = false
  }
  pressLaw('decreto', d)
  game.poder.sus = Math.min(6, (game.poder.sus || 0) + 1)
  cnt('decreto')
  log(`Decreto: ${d.title}.`)
  save()
  return { fx, d }
}
function julgarDecretos() {
  if (!game.poder || !game.poder.statutes) return
  for (const st of game.poder.statutes) {
    if (!st.fragile || st.judged) continue
    st.judged = true
    if (R() < sustarChance()) {
      st.left = 0
      applyFx({ img: -2, cong: -1 }, true)
      const d = DECRETOS.find((x) => x.id === st.billId)
      pressLaw('sustado', d || { title: st.title })
    }
  }
  game.poder.sus = Math.max(0, (game.poder.sus || 0) - 1)
}

/* ---------- Judiciário: controle de constitucionalidade e inquéritos ---------- */
export const courtName = () => (['presidente', 'dep_federal', 'senador'].includes(officeId()) ? 'Supremo Tribunal Federal' : 'Tribunal de Justiça')
export const courtShort = () => (courtName().startsWith('Supremo') ? 'STF' : 'TJ')
const polemicOf = (st) => (st.how === 'decreto' ? 2 : st.how === 'derrubado' ? 1 : 0) + (Object.values(st.fx || {}).some((v) => v < 0) ? 1 : 0)
export const acaoPendente = () => (game.poder && game.poder.acao) || null
export const upholdChance = () => {
  const a = acaoPendente()
  const pol = a ? a.pol : 1
  return Math.max(0.15, Math.min(0.9, 0.58 + (game.stats.img - 50) / 300 - pol * 0.1 + 0.04 * ((game.know && game.know.dir) || 0) + (a && a.defended ? 0.15 : 0)))
}
function roundJudiciario() {
  const p = game.poder
  const a = p.acao
  if (a) {
    const st = p.statutes.find((x) => x.id === a.id)
    const chance = Math.max(0.15, Math.min(0.9, 0.58 + (game.stats.img - 50) / 300 - a.pol * 0.1 + 0.04 * ((game.know && game.know.dir) || 0) + (a.defended ? 0.15 : 0)))
    p.acao = null
    if (st && st.left > 0) {
      if (R() < chance) {
        applyFx({ img: 1.5, cong: 1 }, true)
        timelineAdd('⚖️', `${courtShort()} mantém “${st.title}” de ${game.name}`, 'up')
        toast('⚖️', `${courtShort()} manteve a lei.`)
      } else {
        st.left = 0
        applyFx({ img: -3, cong: -1, pop: -1 }, true)
        timelineAdd('🔨', `${courtShort()} derruba “${st.title}” por inconstitucionalidade`, 'down')
        toast('🔨', `${courtShort()} derrubou “${st.title}”.`)
        pushPosts(3, 'down', courtShort())
      }
    }
  }
  if (!p.acao) {
    const el = (p.statutes || []).filter((x) => x.stage === game.stage && x.left > 0 && !x.stf)
    for (const st of el) {
      const pol = polemicOf(st)
      if (R() < 0.03 + 0.07 * pol + (game.heat || 0) / 700) {
        st.stf = true
        p.acao = { id: st.id, title: st.title, pol, round: game.total, defended: false }
        toast('⚖️', `Ação de inconstitucionalidade contra “${st.title}” chegou ao ${courtShort()}.`)
        timelineAdd('📑', `Oposição aciona o ${courtShort()} contra “${st.title}”`, 'down')
        break
      }
    }
  }
  // inquérito
  const q = p.inq
  if (q && q.stage === game.stage) {
    q.round++
    applyFx({ img: -0.5 }, true)
    if (q.round >= 3) {
      const ok = R() < 0.45 + (q.def ? 0.2 : 0) + (q.col ? 0.15 : 0) + (game.stats.img - 50) / 300
      p.inq = null
      game.heat = clamp(game.heat - 15)
      if (ok) {
        applyFx({ img: 3, pop: 1 }, true)
        cnt('arq')
        timelineAdd('✅', `${courtShort()} arquiva o inquérito contra ${game.name}`, 'up')
        toast('✅', 'Inquérito arquivado.')
      } else {
        applyFx({ img: -9, pop: -4, cong: -4 }, true)
        timelineAdd('⛓️', `${game.name} é denunciado(a) após o inquérito`, 'down')
        toast('⛓️', 'Você virou réu. O desgaste foi pesado.')
        pushPosts(3, 'down', 'Reu')
      }
    }
  } else if (!q && (game.heat || 0) >= 35 && R() < Math.min(0.5, (game.heat - 30) / 100)) {
    p.inq = { stage: game.stage, round: 0, def: false, col: false }
    toast('🕵️', `O ${courtShort()} abriu um inquérito sobre você.`)
    timelineAdd('🕵️', `${courtShort()} abre inquérito contra ${game.name}`, 'down')
  }
}
export const inquerito = () => (game.poder && game.poder.inq && game.poder.inq.stage === game.stage ? game.poder.inq : null)
export function defenderAcao() {
  const a = acaoPendente()
  if (!a || a.defended || game.stats.cash < 2) return false
  a.defended = true
  game.delta = {}
  applyFx({ cash: -2 }, true)
  toast('🧑‍⚖️', 'Advocacia do governo entrou com a defesa.')
  save()
  return true
}
export function acatarAcao() {
  const a = acaoPendente()
  if (!a) return false
  const st = game.poder.statutes.find((x) => x.id === a.id)
  game.poder.acao = null
  if (st) st.left = 0
  game.delta = {}
  applyFx({ img: 0.5, cong: -0.5 }, true)
  timelineAdd('🏳️', `${game.name} recua e revoga “${a.title}”`, 'flat')
  save()
  return true
}
export function defesaInquerito(tipo) {
  const q = inquerito()
  if (!q) return false
  game.delta = {}
  if (tipo === 'defesa' && !q.def && game.stats.cash >= 3) {
    q.def = true
    applyFx({ cash: -3 }, true)
  } else if (tipo === 'colaborar' && !q.col) {
    q.col = true
    applyFx({ img: -2 }, true)
    game.heat = clamp(game.heat - 10)
  } else return false
  save()
  return true
}

/* ---------- Mundo: pesquisas, protestos, consulta popular, objetivos, crise ---------- */
export function cnt(k, n = 1) {
  ensurePoder()
  if (!game.poder.cnt) game.poder.cnt = {}
  const key = game.stage + ':' + k
  game.poder.cnt[key] = (game.poder.cnt[key] || 0) + n
}
export const cntOf = (k) => (game.poder && game.poder.cnt && game.poder.cnt[game.stage + ':' + k]) || 0
export const cntAll = (k) => Object.entries((game.poder && game.poder.cnt) || {}).filter(([x]) => x.endsWith(':' + k)).reduce((a, [, v]) => a + v, 0)
export const pesquisas = () => (game.poder && game.poder.polls) || []
export const aprovacao = () => {
  const s = game.stats
  return Math.round(Math.max(0, Math.min(100, 0.6 * s.pop + 0.2 * s.img + 0.2 * s.cong)))
}
export const GOALS = [
  { id: 'fisc', kind: 'leg', offs: ['vereador', 'dep_estadual', 'dep_federal'], icon: '🔎', text: 'Fiscalizar 3 vezes', need: 3, val: () => cntOf('fisc') },
  { id: 'leis', kind: 'all', icon: '📜', text: 'Ter 2 leis ou decretos ativos', need: 2, val: () => statutesActive().length },
  { id: 'cpi', kind: 'leg', offs: ['dep_estadual', 'dep_federal', 'senador'], icon: '🕵️', text: 'Fazer uma CPI dar resultado', need: 1, val: () => cntOf('cpiok') },
  { id: 'nome', kind: 'exec', icon: '🎓', text: 'Preencher as 3 pastas do governo', need: 3, val: () => nomeados().length },
  { id: 'aprov', kind: 'exec', icon: '📊', text: 'Chegar a 55% de aprovação', need: 55, val: () => aprovacao() },
  { id: 'pop', kind: 'all', icon: '❤️', text: 'Manter popularidade acima de 60', need: 60, val: () => Math.round(game.stats.pop) },
  { id: 'audiencia', kind: 'leg', offs: ['dep_estadual'], icon: '🎙️', text: 'Fazer 2 audiências públicas na região', need: 2, val: () => cntOf('a:caravanaE') },
  { id: 'emendaE', kind: 'leg', offs: ['dep_estadual'], icon: '💼', text: 'Levar 2 emendas aos municípios', need: 2, val: () => cntOf('a:emendaEst') },
  { id: 'relat', kind: 'leg', offs: ['dep_federal'], icon: '📑', text: 'Disputar uma relatoria', need: 1, val: () => cntOf('a:relatoria') + cntOf('relat') },
  { id: 'baseF', kind: 'leg', offs: ['dep_federal', 'senador'], icon: '🤝', text: 'Manter a base acima de 60', need: 60, val: () => Math.round(game.stats.cong) },
  { id: 'sabat', kind: 'leg', offs: ['senador'], icon: '🎤', text: 'Sabatinar 2 autoridades', need: 2, val: () => cntOf('a:sabatinar') },
  { id: 'obras', kind: 'exec', offs: ['prefeito'], icon: '🏗️', text: 'Entregar 2 obras na cidade', need: 2, val: () => cntOf('a:obracidade') },
  { id: 'pesqE', kind: 'exec', offs: ['governador'], icon: '🔬', text: 'Dominar uma tecnologia no estado', need: 1, val: () => (game.world.tech ? game.world.tech.done.length : 0) },
  { id: 'emenda', kind: 'exec', offs: ['presidente'], icon: '🏛️', text: 'Promulgar uma emenda constitucional', need: 1, val: () => (game.poder.cst ? game.poder.cst.emendas : 0) },
  { id: 'blocoP', kind: 'exec', offs: ['presidente'], icon: '🌐', text: 'Levar o país a um bloco internacional', need: 1, val: () => (game.world.blocos ? game.world.blocos.length : 0) },
]
export const goalsNow = () => GOALS.filter((g) => (g.kind === 'all' || (g.kind === 'exec') === isExec()) && (!g.offs || g.offs.includes(officeId()))).map((g) => ({ ...g, v: g.val(), done: !!(game.poder.goalsDone || []).includes(game.stage + ':' + g.id) }))
function checkGoals() {
  ensurePoder()
  if (!game.poder.goalsDone) game.poder.goalsDone = []
  for (const g of goalsNow()) {
    if (g.done || g.v < g.need) continue
    game.poder.goalsDone.push(game.stage + ':' + g.id)
    applyFx({ img: 2, pop: 2 }, true)
    timelineAdd('🎯', `Meta cumprida: ${g.text.toLowerCase()}`, 'up')
    toast('🎯', `Meta do mandato: ${g.text}.`)
  }
}
export const protesto = () => (game.poder && game.poder.prot) || null
export const consultaFeita = () => !!(game.poder && game.poder.cons === game.stage)
export const emCrise = () => isExec() && game.stats.pop <= 30 && game.stats.cong <= 30
const NP_A = ['Movimento', 'Aliança', 'Frente', 'Partido', 'União', 'Rede']
const NP_B = ['Cidadania Digital', 'do Interior', 'Verde Urbano', 'da Inovação', 'Nacional Popular', 'pela Transparência', 'dos Empreendedores', 'da Segurança Cidadã', 'Livre e Federalista', 'pelo Clima', 'dos Servidores Públicos', 'da Terceira Idade', 'do Agro Sustentável', 'das Cidades', 'da Educação em Primeiro Lugar', 'Brasil 2030', 'da Reconstrução', 'Pela Família Trabalhadora']
const NP_PERKS = [{ cash: 0.6, vote: 0.4 }, { cong: 0.8 }, { pop: 0.5, vote: 0.5 }, { eco: 0.4, cong: 0.5 }, { img: 0.4, vote: 0.8 }, { cash: 0.4, pop: 0.4 }]
const PERK_LABEL = { cash: 'caixa', cong: 'base', pop: 'popularidade', eco: 'economia', img: 'imagem', vote: 'voto-ponto' }
// de tempos em tempos um partido novo é fundado e passa a poder te convidar
export function novoPartido() {
  if (!game.novosPartidos) game.novosPartidos = []
  if (game.total < 2 || game.novosPartidos.length >= 6 || R() > 0.12) return
  const nome = `${NP_A[Math.floor(R() * NP_A.length)]} ${NP_B[Math.floor(R() * NP_B.length)]}`
  const usados = new Set(partiesNow().map((x) => x.sigla))
  let sigla = nome.split(' ').filter((w) => /^[A-ZÀ-Ú0-9]/.test(w)).map((w) => w[0]).join('').toUpperCase().slice(0, 4)
  if (sigla.length < 3) sigla = (sigla + 'NPR').slice(0, 3)
  while (usados.has(sigla)) sigla += Math.floor(R() * 9)
  const ideo = ['esquerda', 'centro', 'direita', 'independente'][Math.floor(R() * 4)]
  const perks = { ...NP_PERKS[Math.floor(R() * NP_PERKS.length)] }
  const cores = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#84cc16']
  const fundador = candName(R)
  game.novosPartidos.push({
    id: 'np' + game.total + sigla, sigla, name: nome, ideo, color: cores[Math.floor(R() * cores.length)], slogan: 'Um partido novo para um país que muda.',
    perks, nova: true, hard: 0.05, perkText: 'Fundado por ' + fundador + '. ' + Object.entries(perks).map(([k, v]) => `+${String(v).replace('.', ',')} ${PERK_LABEL[k]}`).join(', ') + '.',
  })
  toast('🆕', `Surge um novo partido: ${sigla}, fundado por ${fundador}.`)
  timelineAdd('🆕', `${fundador} funda o ${nome} (${sigla})`, 'flat')
}
function roundMundo() {
  novoPartido()
  partidoHistoria()
  roundAvancos()
  const p = game.poder
  if (!p.polls) p.polls = []
  p.polls.push({ r: game.total, v: Math.max(0, Math.min(100, aprovacao() + Math.round((R() - 0.5) * 5))) })
  p.polls = p.polls.slice(-8)
  if (p.prot) {
    applyFx({ pop: -3, cong: -1 }, true)
    timelineAdd('✊', `${p.prot.name} cresce sem resposta de ${game.name}`, 'down')
    p.prot = null
  }
  const low = Math.min(game.stats.pop, game.stats.soc, game.stats.eco)
  if (low < 40 && R() < 0.1 + (40 - low) / 120) {
    const greve = game.stats.soc < game.stats.pop
    p.prot = { kind: greve ? 'greve' : 'protesto', name: greve ? 'Greve dos servidores' : 'Protestos nas ruas', round: game.total }
    toast('✊', `${p.prot.name}: o país cobra uma resposta.`)
    timelineAdd('✊', `${p.prot.name} contra ${game.name}`, 'down')
    pushTrend('#' + (greve ? 'Greve' : 'Protesto'), 75)
  }
  eduAdd(-0.5)
  greveUniversitaria()
  roundDefesa()
  if (game.phase === 'over') return
  checkGoals()
}
export function responderProtesto(how) {
  const pr = protesto()
  if (!pr || game.phase !== 'actions') return null
  game.delta = {}
  let fx
  if (how === 'dialogar') {
    if (game.stats.cash < 2) return null
    fx = { cash: -2, pop: 1, img: 1 }
    agendar('greve')
  } else if (how === 'reprimir' && isExec()) {
    fx = game.stats.seg >= 50 ? { pop: -1, img: -3 } : { pop: -3, img: -5 }
    game.heat = clamp(game.heat + 4)
  } else if (how === 'apoiar' && !isExec()) fx = { pop: 2, cong: -1, img: -1 }
  else return null
  applyFx(fx, true)
  game.poder.prot = null
  timelineAdd(how === 'dialogar' ? '🤝' : how === 'reprimir' ? '🚔' : '📣', `${game.name} ${how === 'dialogar' ? 'abre negociação com' : how === 'reprimir' ? 'reprime' : 'apoia'} ${pr.name.toLowerCase()}`, how === 'dialogar' || how === 'apoiar' ? 'up' : 'down')
  save()
  return { how, fx }
}
export function consultaChance(bill) {
  return Math.max(0.1, Math.min(0.9, (billSupport(bill, game.total) + (game.stats.pop - 50) / 4) / 100))
}
export function consultar(billId) {
  const b = billById(billId)
  if (!b || consultaFeita() || game.phase !== 'actions' || game.stats.cash < 3) return null
  ensurePoder()
  game.poder.cons = game.stage
  game.delta = {}
  const ok = R() < consultaChance(b)
  applyFx(ok ? { cash: -3, pop: 3, img: 1 } : { cash: -3, pop: -3, cong: -1 }, true)
  if (ok) {
    enactStatute(b, 'plenario', 1)
    cnt('consulta')
  }
  timelineAdd('🗳️', ok ? `Consulta popular aprova “${b.title}”` : `Consulta popular rejeita “${b.title}”`, ok ? 'up' : 'down')
  toast('🗳️', ok ? 'O povo aprovou na consulta.' : 'O povo rejeitou na consulta.')
  save()
  return { ok, b }
}
export function articular() {
  if (!emCrise() || game.phase !== 'actions' || game.stats.cash < 3 || (game.poder.art === game.total)) return false
  game.poder.art = game.total
  game.delta = {}
  applyFx({ cash: -3, cong: 4, img: -1 }, true)
  timelineAdd('🤝', `${game.name} articula com a base para evitar o pior`, 'flat')
  save()
  return true
}

/* ---------- Educação e universidade ---------- */
export const eduNow = () => (game.poder && game.poder.edu != null ? game.poder.edu : 40)
export const cienNow = () => (game.poder && game.poder.cien) || 0
function eduAdd(v) {
  ensurePoder()
  game.poder.edu = clamp((game.poder.edu != null ? game.poder.edu : 40) + v)
}
function cienAdd(v) {
  ensurePoder()
  game.poder.cien = Math.min(8, (game.poder.cien || 0) + v)
}
const UNIV_OFFICES = ['governador', 'dep_estadual', 'presidente', 'dep_federal', 'senador']
export const temUniv = () => UNIV_OFFICES.includes(officeId())
export const EDU_ACTIONS = [
  { id: 'creche', icon: '🧸', name: 'Creches e pré-escola', offices: ['vereador', 'prefeito'], edu: 3, fx: { cash: -2, pop: 1 }, desc: 'A base de tudo: família trabalha e a criança chega melhor à escola.' },
  { id: 'merenda', icon: '🍲', name: 'Merenda e transporte escolar', offices: ['vereador', 'prefeito', 'governador', 'dep_estadual'], edu: 2, fx: { cash: -1, soc: 1 }, desc: 'Aluno alimentado e com condução falta menos.' },
  { id: 'reforco', icon: '📖', name: 'Reforço e formação de professores', offices: ['vereador', 'prefeito', 'governador', 'dep_estadual', 'presidente', 'dep_federal', 'senador'], edu: 2, fx: { cash: -1 }, desc: 'Cursos, material e piso para quem ensina.' },
  { id: 'tecnico', icon: '🛠️', name: 'Ensino médio técnico', offices: ['governador', 'dep_estadual', 'presidente', 'dep_federal', 'senador'], edu: 3, fx: { cash: -2, eco: 0.5 }, desc: 'Jovem formado já sai com emprego na indústria local.' },
  { id: 'univ', icon: '🏫', name: 'Expandir a universidade pública', offices: UNIV_OFFICES, edu: 4, fx: { cash: -3, img: 1 }, desc: 'Novos campi e vagas. Caro, mas rende por muitas rodadas.' },
  { id: 'fies', icon: '💳', name: 'Financiamento estudantil e bolsas', offices: ['presidente', 'dep_federal', 'senador'], edu: 3, fx: { cash: -3, pop: 2 }, desc: 'Abre o ensino superior para quem não tem como pagar.' },
  { id: 'pesquisa', icon: '🔬', name: 'Bolsas de pesquisa e laboratórios', offices: UNIV_OFFICES, edu: 2, fx: { cash: -3, img: 1 }, cien: 1, desc: 'Ciência que, com o tempo, vira indústria e tecnologia.' },
  { id: 'cotas', icon: '🎟️', name: 'Cotas e permanência estudantil', offices: UNIV_OFFICES, edu: 2, fx: { pop: 1.5, cong: -1 }, desc: 'Amplia o acesso e divide opiniões no Congresso.' },
  { id: 'cmil', icon: '🎖️', name: 'Escolas cívico-militares', offices: ['prefeito', 'governador', 'presidente', 'vereador', 'dep_estadual', 'dep_federal', 'senador'], edu: 1, fx: { seg: 2, cong: 1, img: -1 }, polemic: true, desc: 'Disciplina e ordem para uns, militarização do ensino para outros. Parte dos professores protesta.' },
]
export const eduActionsNow = () => EDU_ACTIONS.filter((a) => a.offices.includes(officeId()))
export const eduCan = () => game.phase === 'actions' && !(game.poder && game.poder.eduDone)
export function eduAgir(id) {
  const a = eduActionsNow().find((x) => x.id === id)
  if (!a || !eduCan()) return null
  const m = isExec() ? 1 : 0.6
  const fx = { ...a.fx }
  if (fx.cash) fx.cash = Math.round(fx.cash * (isExec() ? 1 : 0.5) * 10) / 10
  if (game.stats.cash + (fx.cash || 0) < 0) return null
  ensurePoder()
  game.poder.eduDone = true
  game.delta = {}
  curSphere = STAGE_SPHERE[game.stage] === 'mun' ? 'mun' : 'fed'
  applyFx(fx, true)
  curSphere = null
  eduAdd(a.edu * m)
  if (a.cien) cienAdd(a.cien)
  let greve = false
  if (a.id === 'cmil' && R() < 0.3 && !game.poder.prot) {
    game.poder.prot = { kind: 'greve', name: 'Greve de professores', round: game.total }
    greve = true
  }
  cnt('edu')
  timelineAdd(a.icon, `${game.name} investe em educação: ${a.name.toLowerCase()}`, a.polemic ? 'flat' : 'up')
  toast(a.icon, a.polemic ? 'A medida dividiu opiniões.' : 'Educação reforçada. O efeito vem com o tempo.')
  if (greve) toast('✊', 'Professores entraram em greve contra a medida.')
  log(`Educação: ${a.name}.`)
  save()
  return { a, fx, greve, edu: true }
}
export const REITORES = [
  { id: 'lista', icon: '🗳️', name: 'Respeitar a lista tríplice', desc: 'A comunidade acadêmica escolhe. Autonomia e imagem sobem; a base política estranha.', fx: { img: 1, cong: -1 }, greve: 0.02, edu: 1 },
  { id: 'aliado', icon: '🤝', name: 'Nomear um aliado', desc: 'Um reitor de confiança. Base satisfeita, mas a universidade desconfia.', fx: { cong: 2, img: -1 }, greve: 0.12, edu: 0 },
  { id: 'interventor', icon: '🛑', name: 'Nomear um interventor', desc: 'Controle total, ao custo de imagem e de muita chance de greve.', fx: { cong: 3, img: -3 }, greve: 0.3, edu: -1 },
]
export const reitorAtual = () => {
  const r = game.poder && game.poder.reitor
  return r && r.stage === game.stage ? REITORES.find((x) => x.id === r.id) : null
}
export function nomearReitor(id) {
  const r = REITORES.find((x) => x.id === id)
  if (!r || !isExec() || !temUniv() || reitorAtual() || !exeCan('reitor')) return null
  ensurePoder()
  exeMark('reitor')
  game.delta = {}
  game.poder.reitor = { id, stage: game.stage }
  applyFx(r.fx, true)
  if (r.edu) eduAdd(r.edu)
  timelineAdd(r.icon, `${game.name} escolhe o reitor: ${r.name.toLowerCase()}`, id === 'lista' ? 'up' : 'flat')
  save()
  return { r, edu: true }
}
function greveUniversitaria() {
  const p = game.poder
  if (!temUniv() || p.prot) return
  const r = reitorAtual()
  const risk = (r ? r.greve : 0.05) + (eduNow() < 35 ? 0.08 : 0)
  if (R() < risk) {
    p.prot = { kind: 'greve', name: 'Greve nas universidades', round: game.total }
    toast('✊', 'Greve nas universidades: a comunidade acadêmica cobra o governo.')
    timelineAdd('✊', `Greve nas universidades contra ${game.name}`, 'down')
    pushTrend('#GreveUniversitaria', 70)
  }
}

/* ---------- Defesa, polícia, golpes e guerra civil ---------- */
const FORCAS = [
  { id: 'ex', icon: '🪖', name: 'Exército', rank: 'General' },
  { id: 'ma', icon: '⚓', name: 'Marinha', rank: 'Almirante' },
  { id: 'ae', icon: '✈️', name: 'Aeronáutica', rank: 'Brigadeiro' },
]
export const FORCAS_LISTA = FORCAS
const isPres = () => officeId() === 'presidente'
export const fedLeg = () => ['dep_federal', 'senador'].includes(officeId())
const hasPol = () => ['prefeito', 'governador'].includes(officeId())
export const milDev = () => (game.poder && game.poder.mil) || { ex: 0, ma: 0, ae: 0 }
export const humorForca = (id) => Math.round(clamp(((game.world && game.world.fa) || 50) + (milDev()[id] || 0)))
export const humorPolicia = () => Math.round((game.poder && game.poder.pol != null ? game.poder.pol : 50))
export const golpeTemp = () => Math.round((game.poder && game.poder.golpe) || 0)
export const plotAtual = () => (game.poder && game.poder.plot) || null
export const guerraCivil = () => (game.poder && game.poder.civil) || null
function devAdd(id, v) {
  ensurePoder()
  const m = { ex: 0, ma: 0, ae: 0, ...(game.poder.mil || {}) }
  m[id] = Math.max(-40, Math.min(40, m[id] + v))
  game.poder.mil = m
}
function ministroDefesa(perfil) {
  const w = game.world
  if (perfil === 'militar') {
    w.fa = clamp(w.fa + 8)
    applyFx({ cong: -1, img: -1 }, true)
    game.poder.golpe = Math.max(0, (game.poder.golpe || 0) - 6)
  } else if (perfil === 'tecnico') {
    w.fa = clamp(w.fa - 3)
    applyFx({ img: 1 }, true)
  }
}
export const DEF_FORCA = [
  { id: 'ex', icon: '🪖', name: 'Operação de fronteira e Amazônia', desc: 'Exército nas fronteiras contra garimpo e tráfico.', fx: { cash: -2, seg: 1.5 }, dev: 10 },
  { id: 'ma', icon: '⚓', name: 'Renovar a frota da Marinha', desc: 'Navios e proteção da Amazônia Azul.', fx: { cash: -3, eco: 0.5 }, dev: 10 },
  { id: 'ae', icon: '✈️', name: 'Caças e satélites da Aeronáutica', desc: 'Com ciência em dia, o projeto sai mais barato.', fx: { cash: -3, seg: 1 }, dev: 10 },
]
export function agirForca(id) {
  const a = DEF_FORCA.find((x) => x.id === id)
  if (!a || !isPres() || !exeCan('forca:' + id)) return null
  const fx = { ...a.fx }
  if (id === 'ae' && cienNow() >= 2) fx.cash = -2
  if (game.stats.cash + fx.cash < 0) return null
  exeMark('forca:' + id)
  game.delta = {}
  applyFx(fx, true)
  devAdd(id, a.dev)
  timelineAdd(a.icon, `${game.name} reforça a ${FORCAS.find((x) => x.id === id).name}: ${a.name.toLowerCase()}`, 'up')
  cnt('forca')
  save()
  return { a, mil: true }
}
export function industriaDefesa() {
  if (!isPres() || !exeCan('industria')) return null
  exeMark('industria')
  game.delta = {}
  const bonus = cienNow() >= 1 ? 1 : 0
  applyFx({ cash: 3 + bonus, eco: 1, img: -1 }, true)
  timelineAdd('🏭', `${game.name} fecha contrato de exportação de material de defesa`, 'flat')
  save()
  return { mil: true, ind: true }
}
export const poderPolicial = () => (hasPol() ? { nome: officeId() === 'prefeito' ? 'Guarda Municipal' : 'Polícia Militar e Civil' } : null)
export function agirPolicia(tipo) {
  if (!hasPol() || !exeCan('pol:' + tipo)) return null
  const cur = humorPolicia()
  game.delta = {}
  if (tipo === 'reajuste') {
    if (game.stats.cash < 2) return null
    exeMark('pol:reajuste')
    applyFx({ cash: -2 }, true)
    game.poder.pol = clamp(cur + 12)
  } else if (tipo === 'treino') {
    if (game.stats.cash < 1) return null
    exeMark('pol:treino')
    applyFx({ cash: -1, seg: 0.5, img: 0.5 }, true)
    game.poder.pol = clamp(cur + 6)
  } else return null
  save()
  return { mil: true, pol: true }
}
export const gloPossivel = () => (isPres() || officeId() === 'governador') && (!!protesto() || game.stats.seg < 45)
export function glo() {
  if (!gloPossivel() || !exeCan('glo')) return null
  exeMark('glo')
  game.delta = {}
  const excesso = R() < 0.2
  game.poder.prot = null
  applyFx(excesso ? { seg: 2, img: -6, pop: -2 } : { seg: 3, img: -2, pop: -1 }, true)
  if (isPres()) game.world.fa = clamp(game.world.fa + 3)
  if (excesso) {
    game.heat = clamp(game.heat + 6)
    game.poder.golpe = Math.min(100, (game.poder.golpe || 0) + 4)
  }
  timelineAdd('🪖', excesso ? `Operação de GLO termina com excessos e vira escândalo` : `${game.name} aciona as forças de segurança (GLO)`, excesso ? 'down' : 'flat')
  toast('🪖', excesso ? 'A operação teve excessos.' : 'A operação restabeleceu a ordem.')
  save()
  return { mil: true, glo: true, excesso }
}
export function roundDefesa() {
  const p = game.poder
  const m = { ex: 0, ma: 0, ae: 0, ...(p.mil || {}) }
  for (const k of ['ex', 'ma', 'ae']) m[k] *= 0.85
  p.mil = m
  if (hasPol()) {
    const cur = p.pol != null ? p.pol : 50
    p.pol = clamp(cur + (50 - cur) * 0.05 - (game.stats.cash < 25 ? 2 : 0))
    if (p.pol < 30 && !p.prot && R() < 0.2) {
      p.prot = { kind: 'greve', name: officeId() === 'prefeito' ? 'Greve da Guarda Municipal' : 'Greve da Polícia', round: game.total }
      applyFx({ seg: -2 }, true)
      toast('🚨', `${p.prot.name}: a segurança ficou desguarnecida.`)
      timelineAdd('🚨', `${p.prot.name} contra ${game.name}`, 'down')
    }
  }
  if (!isPres() && !fedLeg()) return
  const s = game.stats
  const fa = game.world.fa
  const alvo = clamp((50 - fa) * 1.1 + (48 - s.pop) * 1.0 + (48 - s.cong) * 0.6 + (game.heat || 0) * 0.35 + (inquerito() ? 10 : 0) + cstTemp())
  p.golpe = Math.max(0, (p.golpe || 0) + (alvo - (p.golpe || 0)) * 0.3)
  if (p.civil) return civilRound()
  if (!p.plot && p.golpe >= 50 && R() < 0.4) {
    const f = [...FORCAS].sort((a, b) => humorForca(a.id) - humorForca(b.id))[0]
    p.plot = { force: f.id, leader: `${f.rank} ${candName(R)}`, strength: 25, round: game.total }
    toast('🪖', `Rumores de conspiração no ${f.name}: ${p.plot.leader} articula contra o governo.`)
    timelineAdd('🕵️', `Serviços de inteligência alertam para conspiração liderada por ${p.plot.leader}`, 'down')
    pushTrend('#GolpeNão', 85)
  } else if (p.plot) {
    p.plot.strength += 8 + Math.max(0, (p.golpe - 50) / 6)
    if (p.plot.strength >= 100) resolverGolpe()
    else if (p.plot.strength <= 0) {
      p.plot = null
      cnt('plotok')
      timelineAdd('🛡️', `A conspiração contra ${game.name} foi desarticulada`, 'up')
      toast('🛡️', 'A conspiração foi desarticulada.')
    }
  }
}
function forceOver(title, text) {
  game.over = { title, text }
  game.phase = 'over'
  finalize(false)
  clearSave()
}
function resolverGolpe() {
  const p = game.poder
  const f = p.plot.force
  const outros = FORCAS.filter((x) => x.id !== f)
  const humor = outros.reduce((a, x) => a + humorForca(x.id), 0) / outros.length
  const s = game.stats
  const L = Math.max(0.05, Math.min(0.85, 0.35 + (humor - 50) / 150 + (s.pop - 50) / 200 + (s.cong - 50) / 300 + (s.img - 50) / 300))
  const r = R()
  const lider = p.plot.leader
  p.plot = null
  game.delta = {}
  if (r < L) {
    applyFx({ img: 4, pop: 3, cong: 2 }, true)
    devAdd(f, -15)
    p.golpe = 20
    cnt('golpefail')
    timelineAdd('🛡️', `Tentativa de golpe de ${lider} é frustrada; as instituições resistem`, 'up')
    toast('🛡️', 'A tentativa de golpe foi frustrada!')
  } else if (r < L + 0.35) {
    p.golpe = 50
    if (s.pop < 45 && isPres()) {
      p.civil = { round: 0, peace: 0 }
      timelineAdd('🔥', `Tentativa de golpe de ${lider} racha o país: começa uma guerra civil`, 'down')
      toast('🔥', 'O país se dividiu. Começou um conflito armado.')
      pushTrend('#GuerraCivil', 95)
    } else {
      applyFx({ cong: -5, cash: -3 }, true)
      game.world.fa = clamp(game.world.fa + 8)
      timelineAdd('⚠️', `Tentativa de golpe de ${lider} termina em crise e em concessões às forças`, 'down')
      toast('⚠️', 'A crise terminou em concessões pesadas.')
    }
  } else {
    forceOver('Golpe de Estado', fedLeg() ? `${lider} e as forças que o seguiram tomaram o poder e fecharam o Congresso. Seu mandato acabou ali, e o país entrou em um período de exceção.` : `${lider} e as forças que o seguiram tomaram o poder. Você foi deposto(a) e o país entrou em um período de exceção.`)
  }
}
export const PLOT_ACOES = [
  { id: 'negociar', icon: '🤝', name: 'Negociar com os comandantes', desc: '-3 Caixa. Reduz a força da conspiração e acalma a corporação.' },
  { id: 'afastar', icon: '🚪', name: 'Afastar o líder da conspiração', desc: 'Pode desmontar tudo (60%) ou acelerar o golpe.' },
  { id: 'denunciar', icon: '⚖️', name: 'Denunciar ao STF', desc: 'Via institucional: reduz a conspiração e fortalece a imagem.' },
  { id: 'povo', icon: '📣', name: 'Chamar o povo às ruas em defesa da democracia', desc: 'Funciona melhor com popularidade alta.' },
]
export function enfrentarPlot(id) {
  const pl = plotAtual()
  if (!pl || !exeCan('plot:' + id)) return null
  const p = game.poder
  game.delta = {}
  let txt = ''
  if (id === 'negociar') {
    if (game.stats.cash < 3) return null
    applyFx({ cash: -3 }, true)
    pl.strength -= 15
    devAdd(pl.force, 8)
    txt = 'A conversa com os comandantes esfriou os ânimos.'
  } else if (id === 'afastar') {
    if (R() < 0.6) {
      pl.strength -= 40
      devAdd(pl.force, -6)
      applyFx({ img: -1 }, true)
      txt = 'O líder foi afastado e a conspiração perdeu o comando.'
    } else {
      pl.strength += 15
      applyFx({ cong: -2 }, true)
      game.heat = clamp(game.heat + 3)
      txt = 'O afastamento irritou os quartéis e acelerou os planos.'
    }
  } else if (id === 'denunciar') {
    pl.strength -= 25
    applyFx({ img: 1, cong: -1 }, true)
    txt = 'A denúncia ao tribunal expôs os articuladores.'
  } else if (id === 'povo') {
    if (game.stats.pop >= 50) {
      pl.strength -= 20
      applyFx({ pop: -1 }, true)
      txt = 'Multidões saíram em defesa das instituições.'
    } else {
      pl.strength -= 8
      applyFx({ img: -1 }, true)
      txt = 'As ruas responderam, mas sem a força necessária.'
    }
  } else return null
  exeMark('plot:' + id)
  if (pl.strength <= 0) {
    p.plot = null
    cnt('plotok')
    timelineAdd('🛡️', `A conspiração contra ${game.name} foi desarticulada`, 'up')
    toast('🛡️', 'A conspiração foi desarticulada.')
  }
  save()
  return { mil: true, txt }
}
function civilRound() {
  const c = game.poder.civil
  applyFx({ pop: -2, eco: -2, seg: -2, cash: -1 }, true)
  c.round++
  if (c.peace >= 100) {
    game.poder.civil = null
    game.poder.golpe = 25
    applyFx({ img: 3, pop: 3 }, true)
    cnt('paz')
    timelineAdd('🕊️', `${game.name} conduz o país a um pacto de paz`, 'up')
    toast('🕊️', 'O conflito terminou com um pacto de paz.')
  } else if (c.round >= 5) {
    forceOver('Guerra civil', 'O conflito se alastrou, o Estado perdeu o controle do território e o governo caiu. A história vai julgar.')
  }
}
export const CIVIL_ACOES = [
  { id: 'pacto', icon: '🕊️', name: 'Pacto nacional de paz', desc: '-3 Caixa. O caminho mais firme para encerrar o conflito.' },
  { id: 'leais', icon: '🪖', name: 'Mobilizar as forças leais', desc: '-3 Caixa. Segurança sobe, mas há risco de excessos.' },
  { id: 'apelo', icon: '🌍', name: 'Apelo à comunidade internacional', desc: 'Funciona melhor com boas relações externas.' },
  { id: 'anistia', icon: '📜', name: 'Oferecer anistia', desc: 'Acelera a paz, mas custa imagem e base.' },
]
export function agirCivil(id) {
  const c = guerraCivil()
  if (!c || !exeCan('civil:' + id)) return null
  game.delta = {}
  let txt = ''
  if (id === 'pacto') {
    if (game.stats.cash < 3) return null
    applyFx({ cash: -3 }, true)
    c.peace += 35 + Math.round((game.stats.img - 50) / 5)
    txt = 'As negociações avançaram.'
  } else if (id === 'leais') {
    if (game.stats.cash < 3) return null
    const ex = R() < 0.25
    applyFx(ex ? { cash: -3, seg: 2, img: -4 } : { cash: -3, seg: 3 }, true)
    c.peace += ex ? 15 : 25
    txt = ex ? 'A ofensiva teve excessos.' : 'As forças leais retomaram áreas.'
  } else if (id === 'apelo') {
    const rel = (() => { const v = Object.values(game.world.rel); return v.reduce((a, x) => a + x, 0) / (v.length || 1) })()
    c.peace += Math.max(5, 15 + Math.round((rel - 50) / 3))
    txt = 'A comunidade internacional pressionou por um acordo.'
  } else if (id === 'anistia') {
    applyFx({ img: -4, cong: -2 }, true)
    c.peace += 30
    txt = 'A anistia dividiu o país, mas reduziu o conflito.'
  } else return null
  exeMark('civil:' + id)
  save()
  return { mil: true, txt }
}

export const LEG_GOLPE = [
  { id: 'convocar', icon: '🎙️', name: 'Convocar os comandantes à Comissão de Defesa', desc: 'Expõe o plano. Reduz a conspiração, mas irrita a caserna.' },
  { id: 'lei', icon: '📜', name: 'Projeto de defesa da democracia', desc: 'Baixa a temperatura institucional. Exige base mínima no Congresso.' },
  { id: 'frente', icon: '🤝', name: 'Articular frente parlamentar', desc: 'Só com Congresso forte: derruba a força da conspiração.' },
]
export function agirLegGolpe(id) {
  const pl = plotAtual()
  if (!fedLeg() || !legCan('golpe:' + id)) return null
  const p = game.poder
  game.delta = {}
  let txt = ''
  if (id === 'convocar') {
    if (!pl) return null
    pl.strength -= 18
    devAdd(pl.force, -4)
    applyFx({ img: 1 }, true)
    txt = 'A convocação expôs os articuladores diante do país.'
  } else if (id === 'lei') {
    if (game.stats.cong < 35) return null
    p.golpe = Math.max(0, (p.golpe || 0) - 12)
    applyFx({ cong: -1 }, true)
    txt = 'O projeto avançou e esfriou o ambiente nos quartéis.'
  } else if (id === 'frente') {
    if (!pl || game.stats.cong < 50) return null
    pl.strength -= 30
    applyFx({ cash: -1 }, true)
    txt = 'A frente parlamentar isolou os conspiradores.'
  } else return null
  legMark('golpe:' + id)
  if (pl && pl.strength <= 0) {
    p.plot = null
    cnt('plotok')
    timelineAdd('🛡️', 'A conspiração foi desarticulada com ajuda do Congresso', 'up')
    toast('🛡️', 'A conspiração foi desarticulada.')
  }
  save()
  return { mil: true, txt }
}

/* ---------- BLOCO 20: Constituição, blocos, pesquisa e armas, elenco, consequências ---------- */
function cstState() {
  ensurePoder()
  const c = game.poder.cst
  if (!c || !c.mps || !c.flags) game.poder.cst = { pec: null, mps: [], estado: null, consulta: null, flags: {}, emendas: 0, prorr: false, ...(c || {}) }
  return game.poder.cst
}
export const cstOn = () => isPres() || fedLeg()
export const cstCan = (id) => (isPres() ? exeCan('cst:' + id) : fedLeg() ? legCan('cst:' + id) : false)
function cstMark(id) {
  if (isPres()) exeMark('cst:' + id)
  else legMark('cst:' + id)
}
export const cstInfo = () => (cstOn() ? cstState() : null)
export const cstEstado = () => (game.poder && game.poder.cst && game.poder.cst.estado) || null
function cstTemp() {
  const e = cstEstado()
  const def = e && ESTADOS.find((x) => x.id === e.id)
  return def ? def.golpe * 2 : 0
}
export const cstDefs = () => ({ PECS, PETREAS, MPS, ESTADOS, CONSULTAS })

// Por que um botão está apagado (vazio quando está liberado)
export function cstWhy(id) {
  if (!cstOn()) return 'Disponível só para presidente e parlamentares federais.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (!cstCan(id)) return 'Ação já usada nesta rodada ou sem pontos de ação.'
  return ''
}
export function pecChance(def, step = 0) {
  const c = game.stats.cong
  return Math.max(0.08, Math.min(0.92, 0.3 + (c - 40) / 100 - (def.hard || 0) + step * 0.1))
}
export function propor(id) {
  if (!cstOn() || !cstCan('pec')) return null
  const c = cstState()
  if (c.pec) return { txt: 'Já existe uma PEC em tramitação.' }
  if (c.estado) return { txt: 'Não se vota emenda à Constituição durante estado de defesa, de sítio ou intervenção (art. 60, §1º).' }
  game.delta = {}
  const pet = PETREAS.find((x) => x.id === id)
  if (pet) {
    cstMark('pec')
    applyFx({ img: -4, cong: -2 }, true)
    if (isPres()) game.heat = clamp((game.heat || 0) + 8)
    timelineAdd('⚖️', `Supremo barra a PEC "${pet.name.toLowerCase()}": cláusula pétrea`, 'down')
    toast('⚖️', `O Supremo barrou: ${pet.name.toLowerCase()}.`)
    cnt('petrea')
    save()
    return { txt: 'O STF derrubou a proposta na hora: é cláusula pétrea (art. 60, §4º).', bad: true }
  }
  const def = PECS.find((x) => x.id === id)
  if (!def) return null
  if (def.flag === 'nuclearOk' && c.flags.nuclearOk) return { txt: 'Essa mudança já foi aprovada.' }
  cstMark('pec')
  c.pec = { id, step: 0 }
  timelineAdd('📜', `${game.name} apresenta a PEC: ${def.name.toLowerCase()}`, 'flat')
  toast('📜', `PEC protocolada: ${def.name}. Precisa de 3/5 nas duas Casas, em dois turnos.`)
  cnt('pec')
  save()
  return { txt: 'PEC protocolada. O 1º turno acontece no início da próxima rodada.' }
}
export function editarMP(id) {
  if (!isPres() || !cstCan('mp')) return null
  const c = cstState()
  const def = MPS.find((x) => x.id === id)
  if (!def || c.mps.length >= 2) return def ? { txt: 'Há MPs demais pendentes no Congresso.' } : null
  if (def.fx.cash && def.fx.cash < 0 && game.stats.cash < -def.fx.cash) return { txt: 'Sem caixa para isso.' }
  game.delta = {}
  cstMark('mp')
  applyFx(def.fx, true)
  c.mps.push({ id, left: 3 })
  timelineAdd('📜', `${game.name} edita a ${def.name}`, 'flat')
  toast('📜', `${def.name} em vigor. O Congresso tem de converter em lei.`)
  agendar('mp')
  cnt('mp')
  save()
  return { txt: 'A MP vale desde já, mas perde a validade se o Congresso não votar a tempo.' }
}
function estadoOk(id) {
  const p = game.poder
  const s = game.stats
  const prot = !!p.prot
  if (id === 'defesa') return prot || s.seg < 50
  if (id === 'sitio') return !!(guerraCivil() || plotAtual() || (game.world && game.world.guerraDef) || (prot && s.seg < 40))
  if (id === 'intervencao') return s.seg < 50 || (p.pol != null && p.pol < 35) || prot
  return false
}
export function estadoMotivo(id) {
  const c = cstState()
  if (!isPres()) return 'Só o presidente decreta.'
  if (c.estado) return 'Já existe uma medida de exceção em vigor.'
  if (!estadoOk(id)) return (ESTADOS.find((x) => x.id === id) || {}).dica || ''
  return cstWhy('estado')
}
export function decretarExcecao(id) {
  if (!isPres() || !cstCan('estado')) return null
  const c = cstState()
  const def = ESTADOS.find((x) => x.id === id)
  if (!def || c.estado || !estadoOk(id)) return null
  game.delta = {}
  cstMark('estado')
  if (def.auth) {
    const p = Math.max(0.1, Math.min(0.9, 0.3 + (game.stats.cong - 30) / 90))
    if (R() > p) {
      applyFx({ cong: -2, img: -2 }, true)
      timelineAdd('🚨', 'O Congresso nega a autorização para o estado de sítio', 'down')
      toast('🚨', 'O Congresso negou o estado de sítio.')
      save()
      return { txt: 'O Congresso não autorizou. Desgaste político.', bad: true }
    }
  }
  c.estado = { id, left: def.dur }
  c.prorr = false
  applyFx(def.fx, true)
  cnt('estado')
  timelineAdd(def.icon, `${game.name} decreta ${def.name.toLowerCase()}`, 'down')
  toast(def.icon, `${def.name} decretado.`)
  save()
  return { txt: `${def.name} em vigor por ${def.dur} rodadas. Enquanto durar, não se vota PEC.` }
}
export function prorrogarEstado() {
  const c = cstState()
  if (!isPres() || !c.estado || c.estado.id !== 'defesa' || c.prorr || !cstCan('prorrogar')) return null
  cstMark('prorrogar')
  c.prorr = true
  c.estado.left += 2
  applyFx({ img: -1, pop: -0.5 }, true)
  save()
  return { txt: 'Estado de defesa prorrogado uma única vez, como manda a Constituição.' }
}
export function convocarConsulta(id) {
  if (!cstOn() || !cstCan('consulta')) return null
  const c = cstState()
  const def = CONSULTAS.find((x) => x.id === id)
  if (!def || c.consulta) return def ? { txt: 'Já há uma consulta popular marcada.' } : null
  if (game.stats.cash < 2) return { txt: 'A consulta custa 2 de Caixa.' }
  game.delta = {}
  cstMark('consulta')
  applyFx({ cash: -2, pop: 0.5 }, true)
  c.consulta = { id, left: 1 }
  timelineAdd('🗳️', `${game.name} convoca: ${def.name.toLowerCase()}`, 'flat')
  toast('🗳️', `${def.name} convocado.`)
  save()
  return { txt: 'A população vai às urnas no início da próxima rodada.' }
}

function roundCst() {
  const c = cstState()
  if (c.pec) {
    const def = PECS.find((x) => x.id === c.pec.id)
    if (c.estado) {
      toast('⏸️', 'A PEC ficou parada: não se vota emenda durante estado de exceção.')
    } else if (!def) c.pec = null
    else if (R() < pecChance(def, c.pec.step)) {
      if (c.pec.step === 0) {
        c.pec.step = 1
        toast('📜', `PEC "${def.name}" passou no 1º turno.`)
        timelineAdd('📜', `PEC "${def.name.toLowerCase()}" é aprovada no 1º turno`, 'up')
      } else {
        c.pec = null
        c.emendas++
        applyFx(def.fx, true)
        if (def.flag) c.flags[def.flag] = true
        for (const [k, d] of Object.entries(def.rel || {})) shiftRel(k, d)
        timelineAdd('🏛️', `Promulgada a Emenda Constitucional: ${def.name.toLowerCase()}`, 'up')
        toast('🏛️', `Emenda promulgada: ${def.name}.`)
        cnt('emenda')
      }
    } else {
      c.pec = null
      applyFx({ cong: -1, img: -0.5 }, true)
      timelineAdd('📜', `PEC "${def.name.toLowerCase()}" fica sem os 3/5 e é arquivada`, 'down')
      toast('📜', `A PEC "${def.name}" não teve votos suficientes.`)
    }
  }
  for (const m of c.mps) m.left--
  for (const m of c.mps.filter((x) => x.left <= 0)) {
    const def = MPS.find((x) => x.id === m.id)
    if (R() < Math.max(0.15, Math.min(0.9, 0.3 + (game.stats.cong - 35) / 90))) {
      applyFx({ pop: 1, eco: 0.5 }, true)
      timelineAdd('📜', `Congresso converte em lei a ${def.name}`, 'up')
    } else {
      applyFx({ cong: -2, img: -1, pop: -1 }, true)
      timelineAdd('📜', `A ${def.name} perde a validade no Congresso`, 'down')
      toast('📜', `A ${def.name} caducou.`)
    }
  }
  c.mps = c.mps.filter((x) => x.left > 0)
  if (c.estado) {
    const def = ESTADOS.find((x) => x.id === c.estado.id)
    applyFx({ seg: (def.fx.seg || 0) * 0.3, pop: -0.5 })
    c.estado.left--
    if (game.stats.pop < 35 && c.estado.id !== 'intervencao') game.poder.golpe = (game.poder.golpe || 0) + 3
    if (c.estado.left <= 0) {
      timelineAdd(def.icon, `${def.name} chega ao fim`, 'flat')
      toast(def.icon, `${def.name} terminou.`)
      c.estado = null
      c.prorr = false
    }
  }
  if (c.consulta) {
    const def = CONSULTAS.find((x) => x.id === c.consulta.id)
    c.consulta = null
    const yes = R() < Math.max(0.15, Math.min(0.85, game.stats.pop / 100 + 0.1))
    applyFx(yes ? def.yes : def.no, true)
    timelineAdd('🗳️', `${def.name}: o "${yes ? 'sim' : 'não'}" venceu`, yes ? 'up' : 'flat')
    toast('🗳️', `${def.name}: o ${yes ? 'sim' : 'não'} venceu.`)
  }
}

/* --- internacional: blocos, tratados, operações --- */
export function blocoMotivo(id) {
  const b = BLOCOS.find((x) => x.id === id)
  const w = game.world
  if (!b) return 'Indisponível.'
  if (!isPresident()) return 'Só a presidência negocia blocos.'
  if (w.blocos.includes(id)) return 'O país já faz parte.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (w.pts < 1) return 'Sem pontos de diplomacia nesta rodada.'
  for (const [k, v] of Object.entries(b.need)) if ((w.rel[k] ?? 50) < v) return `Relação insuficiente com ${(PARTNERS.find((x) => x.id === k) || { name: k }).name} (precisa de ${v}).`
  if (game.stats.cash < b.cash) return `Sem caixa (${b.cash}).`
  return ''
}
export function entrarBloco(id) {
  if (blocoMotivo(id)) return false
  const b = BLOCOS.find((x) => x.id === id)
  spendWorld({ cash: -b.cash, img: 1 }, `O Brasil entra: ${b.name}.`, `${b.name}: adesão concluída.`)
  for (const [k, d] of Object.entries(b.rel)) shiftRel(k, d)
  game.world.blocos.push(id)
  timelineAdd(b.icon, `Brasil ingressa em: ${b.name}`, 'up')
  cnt('bloco')
  return true
}
export function tratadoMotivo(id) {
  const t = TRATADOS.find((x) => x.id === id)
  const w = game.world
  if (!t) return 'Indisponível.'
  if (!isPresident()) return 'Só a presidência firma tratados.'
  if (w.tratados.includes(id)) return 'Tratado já em vigor.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (w.pts < 1) return 'Sem pontos de diplomacia nesta rodada.'
  if ((w.rel[t.partner] ?? 50) < t.need) return `Relação com o parceiro precisa de ${t.need}.`
  if (game.stats.cash < t.cost) return `Sem caixa (${t.cost}).`
  return ''
}
export function firmarTratado(id) {
  if (tratadoMotivo(id)) return null
  const t = TRATADOS.find((x) => x.id === id)
  const ok = R() < Math.max(0.2, Math.min(0.92, 0.4 + (game.stats.cong - 35) / 90))
  if (!ok) {
    spendWorld({ cash: -t.cost, cong: -1 }, `O Congresso não referenda: ${t.name}.`, 'O Congresso não referendou o tratado (art. 84, VIII).')
    game.world.last.ok = false
    return { ok: false }
  }
  spendWorld({ ...t.fx, cash: (t.fx.cash || 0) - t.cost }, `Tratado referendado: ${t.name}.`, `${t.name}: assinado e referendado pelo Congresso.`)
  for (const [k, d] of Object.entries(t.rel)) shiftRel(k, d)
  game.world.tratados.push(id)
  timelineAdd(t.icon, `Tratado em vigor: ${t.name}`, 'up')
  cnt('tratado')
  return { ok: true }
}
export const techFeita = (id) => !!(game.world && game.world.tech && game.world.tech.done.includes(id))
export function opMotivo(id) {
  const o = OPS.find((x) => x.id === id)
  const w = game.world
  if (!o) return 'Indisponível.'
  if (!isPresident()) return 'Só a presidência ordena operações externas.'
  if (w.ops.some((x) => x.id === id)) return 'Operação em andamento.'
  if (w.ops.length >= 2) return 'Há operações demais em curso.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (ptsOf('ptsM') < 1) return 'Sem pontos de defesa nesta rodada.'
  if (o.need.fa && w.fa < o.need.fa) return `Relação com as Forças Armadas precisa de ${o.need.fa}.`
  if (o.need.tech && !techFeita('def1')) return 'Exige a indústria nacional de defesa (aba de pesquisa).'
  if (o.war && game.stats.cong < 45) return 'O Congresso precisa autorizar: base acima de 45.'
  if (game.stats.cash < o.cost) return `Sem caixa (${o.cost}).`
  return ''
}
export function iniciarOp(id) {
  if (opMotivo(id)) return false
  const o = OPS.find((x) => x.id === id)
  spendWorld({ cash: -o.cost }, `Operação: ${o.name}.`, `${o.name} começou.`, 'ptsM')
  game.world.ops.push({ id, left: o.left })
  for (const [k, d] of Object.entries(o.rel)) shiftRel(k, d * 0.3)
  timelineAdd(o.icon, `${game.name} ordena: ${o.name}`, 'flat')
  cnt('op')
  return true
}
function roundOps() {
  const w = game.world
  for (const op of w.ops) {
    const o = OPS.find((x) => x.id === op.id)
    if (!o) continue
    applyFx(o.fx)
    op.left--
    if (o.risk && R() < o.risk * 0.5) {
      applyFx({ pop: -2, img: -1.5 })
      toast('🪖', `Baixas em ${o.name}: a opinião pública oscila.`)
    }
    if (op.left <= 0) {
      applyFx(o.end, true)
      for (const [k, d] of Object.entries(o.rel)) shiftRel(k, d)
      if (o.war) w.fa = clamp(w.fa + 5)
      timelineAdd(o.icon, `${o.name} termina`, 'up')
      toast(o.icon, `${o.name} terminou.`)
      cnt('opok')
    }
  }
  w.ops = w.ops.filter((x) => x.left > 0)
}

/* --- pesquisa e armas --- */
export const techOn = () => ['presidente', 'governador'].includes(officeId())
export function techMotivo(id) {
  const t = TECHS.find((x) => x.id === id)
  const w = game.world
  if (!t) return 'Indisponível.'
  if (!techOn()) return 'Só presidência e governos de estado financiam pesquisa.'
  if (!isPresident() && !t.civil) return 'Pesquisa reservada ao governo federal.'
  if (w.tech.done.includes(id)) return 'Tecnologia já dominada.'
  for (const r of t.req) if (!w.tech.done.includes(r)) return `Antes: ${(TECHS.find((x) => x.id === r) || { name: r }).name}.`
  if (t.needFlag && !cstState().flags[t.needFlag]) return 'Exige a PEC que muda a vedação nuclear (art. 21).'
  if (t.needNuc && !w.nucDone.includes(t.needNuc)) return 'Exige concluir o enriquecimento de urânio no programa nuclear.'
  return ''
}
export function techPushMotivo(id) {
  const m = techMotivo(id)
  if (m) return m
  const t = TECHS.find((x) => x.id === id)
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (ptsOf('ptsP') < 1) return 'Sem pontos de pesquisa nesta rodada.'
  if (game.stats.cash < t.cost) return `Sem caixa (${t.cost}).`
  return ''
}
export function techFoco(id) {
  if (techMotivo(id)) return false
  game.world.tech.foco = id
  save()
  return true
}
export function techPush(id) {
  if (techPushMotivo(id)) return false
  const t = TECHS.find((x) => x.id === id)
  spendWorld({ cash: -t.cost }, `Pesquisa: investimento em ${t.name}.`, `${t.name}: mais um passo.`, 'ptsP')
  techAdd(id, TECH_PUSH)
  game.world.tech.foco = game.world.tech.foco || id
  return true
}
function techAdd(id, v) {
  const w = game.world
  const t = TECHS.find((x) => x.id === id)
  if (!t || w.tech.done.includes(id)) return
  w.tech.prog[id] = Math.min(100, (w.tech.prog[id] || 0) + v)
  if (w.tech.prog[id] < 100) return
  w.tech.done.push(id)
  if (w.tech.foco === id) w.tech.foco = null
  const e = {}
  for (const [k, d] of Object.entries(t.rel || {})) shiftRel(k, d)
  void e
  applyFx({ img: t.id === 'def5' ? -3 : 2, eco: 1 }, true)
  timelineAdd(t.icon, `Marco científico: ${t.name}`, t.id === 'def5' ? 'down' : 'up')
  toast(t.icon, `Tecnologia dominada: ${t.name}.`)
  cnt('tech')
  if (t.id === 'def5') cnt('arsenal')
  if (R() < 0.5) agendar('parceria')
}
function roundTech() {
  const w = game.world
  if (!techOn()) return
  const f = w.tech.foco
  if (!f || techMotivo(f)) {
    if (f) w.tech.foco = null
    return
  }
  techAdd(f, 8)
}

/* --- consequências encadeadas --- */
export function agendar(kind) {
  const def = CHAIN[kind]
  if (!def) return
  ensurePoder()
  if (!game.poder.agenda) game.poder.agenda = []
  if (game.poder.agenda.length >= 6) return
  game.poder.agenda.push({ kind, at: game.total + def.delay })
}
function roundAgenda() {
  const p = game.poder
  if (!p.agenda || !p.agenda.length) return
  const due = p.agenda.filter((x) => x.at <= game.total)
  p.agenda = p.agenda.filter((x) => x.at > game.total)
  for (const d of due) {
    const def = CHAIN[d.kind]
    if (!def) continue
    applyFx(def.fx, true)
    if (def.heat) game.heat = clamp((game.heat || 0) + def.heat)
    timelineAdd(def.icon, def.text, def.tone)
    toast(def.icon, def.text)
    p.press.push({ icon: def.icon, text: def.text })
    p.press = p.press.slice(-4)
  }
}
export const agendaPendente = () => ((game.poder && game.poder.agenda) || []).length

/* --- elenco recorrente --- */
export function elencoOf() {
  ensurePoder()
  if (!game.poder.elenco) game.poder.elenco = { rival: game.rival || null, exAliado: null, ministro: null, last: -9, nVoltas: 0 }
  const e = game.poder.elenco
  if (!e.rival) e.rival = game.rival || null
  if (!e.exAliado && game.total >= 4) e.exAliado = candName(R)
  const cab = nomeados()
  if (cab.length && (!e.ministro || e.ministro.stage !== game.stage)) e.ministro = { nome: cab[0].nome, pasta: (PASTAS.find((x) => x.id === cab[0].pasta) || { name: 'ministério' }).name, stage: game.stage }
  return e
}
function roundElenco() {
  const e = elencoOf()
  if (game.total - e.last < 4 || R() > 0.2) return
  const opts = []
  if (e.rival && game.total >= 3 && !(game.poder && game.poder.rv)) opts.push('rival')
  if (e.exAliado) opts.push('exAliado')
  if (e.ministro && isExec()) opts.push('ministro')
  if (!opts.length) return
  const k = opts[Math.floor(R() * opts.length)]
  const pick = (a) => a[Math.floor(R() * a.length)]
  let o
  if (k === 'rival') {
    const v = pick(VOLTA_RIVAL)
    o = { t: v.text(e.rival), fx: v.fx, icon: '🥊', good: false }
  } else if (k === 'exAliado') {
    const v = pick(VOLTA_EXALIADO)
    o = { t: v.text(e.exAliado), fx: v.fx, icon: v.good ? '🤝' : '💔', good: !!v.good }
  } else {
    const v = pick(MINISTRO_FASES)
    o = { t: v.text(e.ministro.nome, e.ministro.pasta), fx: v.fx, icon: '🎩', good: !!v.good, heat: v.heat }
  }
  e.last = game.total
  e.nVoltas++
  applyFx(o.fx, true)
  if (o.heat) game.heat = clamp((game.heat || 0) + o.heat)
  timelineAdd(o.icon, o.t, o.good ? 'up' : 'down')
  toast(o.icon, o.t)
  game.poder.press.push({ icon: o.icon, text: o.t })
  game.poder.press = game.poder.press.slice(-4)
}

/* --- partidos com história --- */
export function partidoHistoria() {
  const np = game.novosPartidos || []
  if (game.total < 4 || R() > 0.1) return
  const meu = game.party
  const kind = ['fusao', 'cisao', 'morte'][Math.floor(R() * 3)]
  const say = (icon, text, tn = 'flat') => {
    timelineAdd(icon, text, tn)
    toast(icon, text)
    game.poder.press.push({ icon, text })
    game.poder.press = game.poder.press.slice(-4)
  }
  if (kind === 'fusao' && np.length >= 2) {
    const livres = np.filter((x) => x.id !== meu)
    if (livres.length < 2) return
    const [a, b] = livres
    const nome = `${a.name.split(' ')[0]} ${b.name.split(' ').slice(1).join(' ') || b.name}`
    const merged = { ...a, id: 'fu' + game.total + a.sigla, sigla: (a.sigla.slice(0, 2) + b.sigla.slice(0, 2)).slice(0, 4), name: nome, perkText: `Fusão de ${a.sigla} e ${b.sigla}. ` + (a.perkText || '').replace(/^Fundado por [^.]*\. /, '') }
    game.novosPartidos = np.filter((x) => x !== a && x !== b).concat(merged)
    say('🔗', HIST_PARTIDOS.fusao(a.sigla, b.sigla, merged.sigla))
  } else if (kind === 'cisao' && np.length < 6) {
    const base = partiesNow().filter((x) => !x.nova && x.id !== meu)
    if (!base.length) return
    const a = base[Math.floor(R() * base.length)]
    const nome = `Movimento ${NP_B[Math.floor(R() * NP_B.length)]}`
    let sigla = ('R' + a.sigla).slice(0, 4)
    const usados = new Set(partiesNow().map((x) => x.sigla))
    while (usados.has(sigla)) sigla += Math.floor(R() * 9)
    const perks = { ...NP_PERKS[Math.floor(R() * NP_PERKS.length)] }
    game.novosPartidos.push({ id: 'ci' + game.total + sigla, sigla, name: nome, ideo: a.ideo, color: a.color, slogan: `Dissidência do ${a.sigla}.`, perks, nova: true, hard: 0.05, perkText: `Racha do ${a.sigla}. ` + Object.entries(perks).map(([k, v]) => `+${String(v).replace('.', ',')} ${PERK_LABEL[k]}`).join(', ') + '.' })
    say('💥', HIST_PARTIDOS.cisao(a.sigla, sigla))
  } else if (kind === 'morte' && np.length) {
    const vit = np.filter((x) => x.id !== meu && game.total - (parseInt(String(x.id).replace(/\D/g, ''), 10) || 0) >= 0)[0]
    if (!vit) return
    game.novosPartidos = np.filter((x) => x !== vit)
    say('⚰️', HIST_PARTIDOS.morte(vit.sigla), 'down')
  }
}

export function roundAvancos() {
  roundCst()
  roundOps()
  roundTech()
  roundAgenda()
  roundElenco()
  roundReunioes()
  roundAmeacas()
  roundSociedade()
  roundMundo24()
  roundVida()
  roundFamilia()
  roundRival()
}

/* ---------- BLOCO 21: reuniões com várias pessoas ---------- */
export const reuniaoDef = (id) => REUNIOES.find((x) => x.id === id)
export const reuniaoAtual = () => (game.poder && game.poder.reuniao) || null
export const convitesNow = () => (game.poder && game.poder.convites) || []
export const industriasNow = () => (game.poder && game.poder.industrias) || []
export const reuniaoAbordagens = () => ABORDAGENS
export const reuniaoTraits = () => TRAITS
const PARCEIROS_PACTO = ['arg', 'lat', 'afr', 'ue', 'eua', 'india', 'japao']
const partnerName = (id) => (PARTNERS.find((x) => x.id === id) || { name: id }).name

function reuOk(d) {
  if (!(d.offs === 'all' || d.offs.includes(officeId()))) return false
  const w = game.world
  const pa = w.pactos || []
  switch (d.cond) {
    case 'blocos': return w.blocos.length > 0
    case 'semblocos': return w.blocos.length === 0
    case 'tech': return w.tech.done.length > 0
    case 'pactoLivre': return pa.length < 2
    case 'pacto': return pa.some((x) => x.tipo === 'defesa')
    case 'exaliado': return !!elencoOf().exAliado
    default: return true
  }
}
function roundReunioes() {
  ensurePoder()
  const p = game.poder
  p.convites = p.convites || []
  p.industrias = p.industrias || []
  p.reuHist = p.reuHist || []
  for (const i of p.industrias) applyFx(i.fx)
  for (const i of p.industrias) i.left--
  p.industrias = p.industrias.filter((i) => i.left > 0)
  for (const c of p.convites) c.left--
  for (const c of p.convites.filter((x) => x.left < 0)) {
    const d = reuniaoDef(c.defId)
    applyFx({ img: -0.5 }, true)
    if (d) toast('📅', `Você deixou passar: ${d.title}.`)
    if (c.cadeia) cadeiaPasso(c.cadeia, c.passo, c.pontos || 0, -1)
  }
  p.convites = p.convites.filter((c) => c.left >= 0)
  p.memoria = (p.memoria || []).filter((m) => game.total - m.r <= 14)
  if (!p.cadeia && !p.convites.length && game.total >= 5 && R() < (game.stats.img < 45 ? 0.1 : game.stats.pop < 40 ? 0.08 : 0.02)) {
    const id = game.stats.img < 45 || R() < 0.5 ? 'escandalo' : 'greve'
    p.cadeia = { id, passo: 0, pontos: 0 }
    p.convites.push({ defId: CADEIAS[id].passos[0], left: 3, cadeia: id, passo: 0, pontos: 0 })
    toast(CADEIAS[id].icon, CADEIAS[id].gatilho)
    timelineAdd(CADEIAS[id].icon, CADEIAS[id].nome, 'down')
    return
  }
  if (p.convites.length >= 2 || R() > 0.45) return
  const pool = REUNIOES.filter((d) => !d.cadeia && reuOk(d) && !p.reuHist.slice(-4).includes(d.id) && !p.convites.some((c) => c.defId === d.id))
  if (!pool.length) return
  const d = pool[Math.floor(R() * pool.length)]
  const w = game.world
  const c = { defId: d.id, left: 2 }
  if (d.id === 's_chamado') c.partner = w.pactos.find((x) => x.tipo === 'defesa').partner
  else if (d.partner) {
    const livre = d.id === 's_pacto' ? PARCEIROS_PACTO.filter((x) => !w.pactos.some((y) => y.partner === x)) : PARTNERS.map((x) => x.id)
    c.partner = livre[Math.floor(R() * livre.length)]
  }
  if (d.fict) c.fict = FICTICIOS[Math.floor(R() * FICTICIOS.length)].id
  p.convites.push(c)
  toast(d.icon, `Convite para reunião: ${d.title}.`)
}
const attBucket = (a) => (a <= -1 ? 'hostil' : a >= 1.5 ? 'favoravel' : 'neutro')
function reuFalas(r) {
  const d = reuniaoDef(r.defId)
  r.falas = r.parts.map((pt) => {
    const arr = FALAS[pt.trait][attBucket(pt.att)]
    return arr[Math.floor(R() * arr.length)].replace('{t}', d.tema)
  })
}
export function reuniaoMotivo(idx) {
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (reuniaoAtual()) return 'Já há uma reunião em andamento.'
  if (!convitesNow()[idx]) return 'Convite indisponível.'
  return ''
}
export function reuniaoAbrir(idx) {
  if (reuniaoMotivo(idx)) return false
  const c = game.poder.convites[idx]
  const d = reuniaoDef(c.defId)
  const parts = d.parts.map((x) => {
    let nome = x.role
    if (x.nome === 'auto') nome = candName(R)
    else if (x.nome === 'exaliado') nome = elencoOf().exAliado || candName(R)
    return { role: x.role, icon: x.icon, trait: x.trait, peso: x.peso || 1, nome, att: Math.max(-3, Math.min(3, x.base + Math.floor(R() * 3) - 1)), d: 0 }
  })
  const mem = game.poder.memoria || []
  for (const pt of parts) {
    const i = mem.findIndex((m) => m.role === pt.role && R() < 0.6)
    if (i < 0) continue
    const m = mem[i]
    mem.splice(i, 1)
    pt.nome = m.nome
    pt.trait = m.trait
    pt.att = Math.max(-3, Math.min(3, pt.att + (m.tipo === 'rancor' ? -1.5 : 1.5)))
    pt.lembra = m.tipo === 'rancor' ? `Lembra de "${m.ref}" e ainda guarda rancor.` : `Lembra de "${m.ref}" e é grato a você.`
  }
  game.poder.memoria = mem
  const fic = c.fict ? FICTICIOS.find((f) => f.id === c.fict) : null
  game.poder.convites.splice(idx, 1)
  game.poder.reuHist = [...(game.poder.reuHist || []), d.id].slice(-8)
  game.poder.reuniao = { defId: d.id, cadeia: c.cadeia ? { id: c.cadeia, passo: c.passo, pontos: c.pontos || 0 } : null, parts, step: d.locais ? 0 : 1, falas: [], reacoes: [], loc: null, partner: c.partner || null, fict: fic ? fic.name : null, resultado: null }
  if (!d.locais) reuFalas(game.poder.reuniao)
  save()
  return true
}
export function reuniaoLocal(id) {
  const r = reuniaoAtual()
  const d = r && reuniaoDef(r.defId)
  if (!r || r.step !== 0 || !d.locais) return false
  const l = d.locais.find((x) => x.id === id)
  if (!l) return false
  r.loc = l.label
  for (const pt of r.parts) pt.att = Math.max(-3, Math.min(3, pt.att + (l.eff[pt.trait] || 0)))
  r.step = 1
  reuFalas(r)
  save()
  return true
}
export function reuniaoCustoOk(abId) {
  const ab = ABORDAGENS.find((x) => x.id === abId)
  return !!ab && (!ab.cost || game.stats.cash >= ab.cost)
}
export function reuniaoAbordar(abId) {
  const r = reuniaoAtual()
  const ab = ABORDAGENS.find((x) => x.id === abId)
  if (!r || !ab || r.resultado || r.step < 1 || r.step > 3 || !reuniaoCustoOk(abId)) return false
  game.delta = {}
  if (ab.cost) applyFx({ cash: -ab.cost }, true)
  if (ab.fx) applyFx(ab.fx, true)
  r.reacoes = []
  for (const pt of r.parts) {
    const d = ab.eff[pt.trait] + (R() < 0.25 ? Math.floor(R() * 3) - 1 : 0)
    const antes = pt.att
    pt.att = Math.max(-3, Math.min(3, pt.att + d))
    pt.d = pt.att - antes
    r.reacoes.push({ nome: pt.nome, d: pt.d })
  }
  r.step++
  if (r.step > 3) return reuniaoFinalizar(r)
  reuFalas(r)
  save()
  return true
}
function reuniaoFinalizar(r) {
  const d = reuniaoDef(r.defId)
  const w = game.world
  const tot = r.parts.reduce((a, x) => a + x.peso, 0)
  const score = r.parts.reduce((a, x) => a + x.att * x.peso, 0) / tot
  const cls = score >= 1 ? 'acordo' : score >= -0.4 ? 'parcial' : 'fracasso'
  const o = d.out[cls]
  game.delta = {}
  applyFx(o.fx, true)
  for (const [k, v] of Object.entries(o.rel || {})) shiftRel(k, v)
  if (o.relP && r.partner) shiftRel(r.partner, o.relP)
  if (o.ind) {
    game.poder.industrias = [...(game.poder.industrias || []), { ...o.ind }].slice(-5)
    cnt('industria')
  }
  if (o.tech) {
    const foco = w.tech.foco && !techMotivo(w.tech.foco) ? w.tech.foco : (TECHS.find((t) => !techMotivo(t.id)) || {}).id
    if (foco && techOn()) techAdd(foco, o.tech)
  }
  if (o.vaza && w.tech.foco) w.tech.prog[w.tech.foco] = Math.max(0, (w.tech.prog[w.tech.foco] || 0) - o.vaza)
  if (o.pacto && r.partner) {
    w.pactos.push({ partner: r.partner, tipo: o.pacto })
    cnt('pacto')
  }
  if (o.quebraPacto) w.pactos = w.pactos.filter((x) => !(x.partner === r.partner && x.tipo === 'defesa'))
  if (o.fa) w.fa = clamp(w.fa + o.fa)
  r.resultado = { cls, text: o.t, score: Math.round(score * 10) / 10 }
  const mem = game.poder.memoria || (game.poder.memoria = [])
  for (const pt of r.parts) {
    const tipo = pt.att <= -1 ? 'rancor' : pt.att >= 2 ? 'gratidao' : null
    if (!tipo || (cls === 'parcial' && Math.abs(pt.att) < 2)) continue
    mem.unshift({ nome: pt.nome, role: pt.role, trait: pt.trait, tipo, ref: d.title, r: game.total })
  }
  game.poder.memoria = mem.slice(0, 10)
  if (r.cadeia) cadeiaPasso(r.cadeia.id, r.cadeia.passo, r.cadeia.pontos, cls === 'acordo' ? 1 : cls === 'fracasso' ? -1 : 0)
  r.step = 4
  timelineAdd(d.icon, `${d.title}: ${o.t}`, cls === 'acordo' ? 'up' : cls === 'fracasso' ? 'down' : 'flat')
  cnt('reuniao')
  if (cls === 'acordo') cnt('reuniaook')
  save()
  return true
}
export function reuniaoFechar() {
  const r = reuniaoAtual()
  if (!r || !r.resultado) return false
  game.poder.reuniao = null
  save()
  return true
}
export const reuniaoTitulo = (r) => {
  const d = reuniaoDef(r.defId)
  let t = d.title
  if (r.partner) t += ` · ${partnerName(r.partner)}`
  if (r.fict) t += ` · ${r.fict}`
  return t
}

/* ---------- BLOCO 22: ameaças externas e guerra defensiva ---------- */
export const ameacasNow = () => (game.world && game.world.ameacas) || []
export const guerraDefNow = () => (game.world && game.world.guerraDef) || null
export const ameacaDef = (tipo) => AMEACAS[tipo]
export const guerraAcoes = () => GUERRA_ACOES
const inimigoNome = (id) => (INIMIGOS.find((x) => x.id === id) || { name: id }).name
export const ameacaTitulo = (a) => AMEACAS[a.tipo].nome(inimigoNome(a.quem))
export const ameacaDesc = (a) => AMEACAS[a.tipo].desc(inimigoNome(a.quem))

function guerraPoder() {
  const w = game.world
  const g = w.guerraDef
  const tf = (id) => (w.tech.done.includes(id) ? 1 : 0)
  return Math.round(20 + w.fa * 0.3 + tf('def1') * 8 + tf('def2') * 8 + tf('def3') * 10 + tf('def4') * 6 + g.aliados * 15 + g.mobil * 8 + (g.estado ? 10 : 0))
}
export const guerraPoderNow = () => (guerraDefNow() ? guerraPoder() : 0)

function ameacaChance() {
  const w = game.world
  let p = 0.09
  if (w.fa < 30) p += 0.05
  p -= w.pactos.filter((x) => x.tipo === 'defesa').length * 0.03
  if (w.tech.done.includes('def4')) p -= 0.04
  if (w.tech.done.includes('def3')) p -= 0.02
  return Math.max(0.02, p)
}
function iniciarInvasao(quem) {
  const w = game.world
  w.ameacas = []
  w.guerraDef = { quem, E: 60, left: 7, aliados: 0, mobil: 0, estado: false, round: 0 }
  w.fa = clamp(w.fa + 4)
  applyFx({ pop: 1, seg: -2.5 }, true)
  timelineAdd('💥', `${inimigoNome(quem)} invade o território brasileiro`, 'down')
  toast('💥', `${inimigoNome(quem)} invadiu o país! Veja a aba Mundo.`)
  cnt('invasao')
}
function roundAmeacas() {
  if (!isPresident()) return
  const w = game.world
  const g = w.guerraDef
  if (g) {
    g.round++
    g.left--
    const mp = guerraPoder()
    g.E = Math.max(0, Math.min(100, g.E - (mp - 35) / 5))
    applyFx({ pop: g.round <= 2 ? 0.4 : -0.6, cash: -0.5, seg: -0.4, eco: -0.3 })
    if (g.E <= 0) return encerrarGuerra('vitoria')
    if (g.left <= 0) return encerrarGuerra(g.E <= 35 ? 'vitoria' : 'armisticio')
    return
  }
  for (const a of w.ameacas) {
    a.left--
    applyFx(AMEACAS[a.tipo].ongoing)
  }
  for (const a of w.ameacas.filter((x) => x.left <= 0)) {
    if (a.tipo === 'ultimato') {
      iniciarInvasao(a.quem)
      return
    }
    applyFx({ eco: -2, img: -1.5 }, true)
    toast('⚠️', `${ameacaTitulo(a)} terminou deixando estragos.`)
  }
  w.ameacas = w.ameacas.filter((x) => x.left > 0)
  if (w.ameacas.length || game.total < 6 || R() > ameacaChance()) return
  const tipo = ['ultimato', 'ultimato', 'ciber', 'bloqueio'][Math.floor(R() * 4)]
  const q = INIMIGOS[Math.floor(R() * INIMIGOS.length)].id
  w.ameacas.push({ tipo, quem: q, left: AMEACAS[tipo].left })
  toast(AMEACAS[tipo].icon, `${ameacaTitulo(w.ameacas[0])}! Responda na aba Mundo.`)
  timelineAdd(AMEACAS[tipo].icon, ameacaTitulo(w.ameacas[0]), 'down')
}
function encerrarGuerra(res) {
  const w = game.world
  const g = w.guerraDef
  w.guerraDef = null
  if (res === 'vitoria') {
    applyFx({ pop: 4, img: 3, seg: 2 }, true)
    w.fa = clamp(w.fa + 6)
    timelineAdd('🏅', `O Brasil repele a invasão de ${inimigoNome(g.quem)}`, 'up')
    toast('🏅', 'A invasão foi repelida. Vitória!')
    cnt('guerravit')
  } else if (res === 'paz') {
    applyFx({ pop: 1, img: 1.5, seg: 0.5 }, true)
    timelineAdd('🕊️', `Cessar-fogo com ${inimigoNome(g.quem)}`, 'flat')
    toast('🕊️', 'Cessar-fogo assinado.')
    cnt('guerravit')
  } else {
    applyFx({ pop: -3, img: -3, seg: -2 }, true)
    timelineAdd('📉', `Armistício desfavorável com ${inimigoNome(g.quem)}`, 'down')
    toast('📉', 'A guerra terminou num armistício desfavorável.')
  }
  game.poder.press.push({ icon: '🪖', text: 'O conflito armado chegou ao fim.' })
  game.poder.press = game.poder.press.slice(-4)
  save()
}
export function ameacaMotivo(idx, respId) {
  const a = ameacasNow()[idx]
  const r = a && AMEACAS[a.tipo].resp.find((x) => x.id === respId)
  const w = game.world
  if (!r) return 'Indisponível.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (ptsOf('ptsM') < 1) return 'Sem pontos de defesa nesta rodada.'
  if (r.cash && game.stats.cash < r.cash) return `Sem caixa (${r.cash}).`
  if (r.need && r.need.fa && w.fa < r.need.fa) return `Relação com as Forças Armadas precisa de ${r.need.fa}.`
  if (r.need && r.need.tech && !w.tech.done.includes(r.need.tech)) return 'Exige a ciberdefesa nacional (aba de pesquisa).'
  return ''
}
export function responderAmeaca(idx, respId) {
  if (ameacaMotivo(idx, respId)) return null
  const w = game.world
  const a = w.ameacas[idx]
  const r = AMEACAS[a.tipo].resp.find((x) => x.id === respId)
  let p = r.p + (r.pFa ? (w.fa - 50) * r.pFa : 0)
  for (const [k, v] of Object.entries(r.pRel || {})) p += (w.rel[k] - 50) * v
  for (const [k, v] of Object.entries(r.pTech || {})) if (w.tech.done.includes(k)) p += v
  p = Math.max(0.1, Math.min(r.p >= 1 ? 1 : 0.95, p))
  const ok = R() < p
  const o = ok ? r.ok : r.bad || r.ok
  spendWorld({ ...o.fx, cash: (o.fx.cash || 0) - (r.cash || 0) }, `${r.name}: ${o.t}`, o.t, 'ptsM')
  w.last.ok = ok
  if (o.fa) w.fa = clamp(w.fa + o.fa)
  if (ok || !r.bad) {
    w.ameacas.splice(idx, 1)
    cnt('ameacaok')
  } else if (r.bad.escalate) {
    if (a.tipo === 'ultimato') iniciarInvasao(a.quem)
    else {
      w.ameacas.splice(idx, 1)
      applyFx({ eco: -1, pop: -1 }, true)
    }
  }
  save()
  return { ok, txt: o.t }
}
export function guerraMotivo(id) {
  const g = guerraDefNow()
  const w = game.world
  const def = GUERRA_ACOES.find((x) => x.id === id)
  if (!g || !def) return 'Indisponível.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (ptsOf('ptsM') < 1) return 'Sem pontos de defesa nesta rodada.'
  if (def.cash && game.stats.cash < def.cash) return `Sem caixa (${def.cash}).`
  if (id === 'mobilizar' && g.mobil >= 3) return 'As reservas já estão todas mobilizadas.'
  if (id === 'aliados' && g.aliados > 0) return 'Os aliados já chegaram.'
  if (id === 'aliados' && g.onu) return 'A ONU já foi acionada.'
  if (id === 'estado' && g.estado) return 'O estado de guerra já está em vigor.'
  if (id === 'contra' && guerraPoder() < g.E + 5) return 'Sem força suficiente para uma contra-ofensiva.'
  void w
  return ''
}
export function agirGuerra(id) {
  if (guerraMotivo(id)) return null
  const g = game.world.guerraDef
  const def = GUERRA_ACOES.find((x) => x.id === id)
  const w = game.world
  let txt = ''
  let fx = { cash: -(def.cash || 0) }
  if (id === 'mobilizar') {
    g.mobil++
    fx = { ...fx, pop: -0.5, eco: -0.3 }
    txt = 'Reservistas mobilizados: a linha de frente ficou mais forte.'
  } else if (id === 'aliados') {
    const al = w.pactos.filter((x) => x.tipo === 'defesa')
    if (al.length) {
      g.aliados = al.length
      for (const x of al) shiftRel(x.partner, 4)
      fx = { ...fx, img: 1.5 }
      txt = `${al.length} aliado(s) do pacto de defesa chegaram para ajudar.`
    } else {
      g.onu = true
      shiftRel('onu', 4)
      if (R() < 0.5) {
        g.E = Math.max(0, g.E - 6)
        txt = 'A ONU enviou observadores e a pressão sobre o agressor aumentou.'
      } else txt = 'Sem aliados formais, a ONU só emitiu notas de preocupação.'
    }
  } else if (id === 'estado') {
    const ok = R() < Math.max(0.15, Math.min(0.92, 0.35 + (game.stats.cong - 30) / 80))
    if (ok) {
      g.estado = true
      fx = { ...fx, pop: 1, cong: -1 }
      txt = 'O Congresso autorizou o estado de guerra. O país inteiro entra em esforço de guerra.'
    } else {
      fx = { ...fx, cong: -2, img: -1 }
      txt = 'O Congresso negou o estado de guerra e a oposição acusou exagero.'
    }
  } else if (id === 'contra') {
    const p = Math.max(0.2, Math.min(0.85, 0.5 + (guerraPoder() - g.E) / 100))
    if (R() < p) {
      g.E = Math.max(0, g.E - 15)
      fx = { ...fx, pop: 1.5, img: 1 }
      txt = 'A contra-ofensiva avançou e tomou a iniciativa.'
    } else {
      fx = { ...fx, pop: -2, seg: -1 }
      w.fa = clamp(w.fa - 3)
      txt = 'A contra-ofensiva falhou e houve muitas baixas.'
    }
  } else if (id === 'paz') {
    const p = Math.max(0.15, Math.min(0.9, 0.9 - g.E / 100))
    if (R() < p) {
      spendWorld(fx, `Cessar-fogo com ${inimigoNome(g.quem)}.`, 'O cessar-fogo foi aceito.', 'ptsM')
      encerrarGuerra(g.E <= 45 ? 'paz' : 'armisticio')
      return { txt: 'O cessar-fogo foi aceito.' }
    }
    fx = { ...fx, img: -0.5 }
    txt = 'O agressor recusou o cessar-fogo: ainda se sente forte.'
  }
  spendWorld(fx, `${def.name}: ${txt}`, txt, 'ptsM')
  save()
  return { txt }
}

/* ---------- BLOCO 23: economia e sociedade ---------- */
const socBase = () => ({
  setores: Object.fromEntries(SETORES.map((x) => [x.id, 50])),
  midia: Object.fromEntries(VEICULOS.map((v, i) => [v.id, { rel: [38, 50, 55, 45, 30][i], verbas: 0, calado: 0 }])),
  movs: [], volta: null, catast: null, used: {},
})
export const socNow = () => (game.poder && game.poder.soc) || socBase()
function socEnsure() {
  ensurePoder()
  if (!game.poder.soc || !game.poder.soc.setores || !game.poder.soc.midia) game.poder.soc = { ...socBase(), ...(game.poder.soc || {}) }
  return game.poder.soc
}
export const setoresDef = () => SETORES
export const setorAcoes = () => SETOR_ACOES
export const movDef = (id) => MOVIMENTOS.find((x) => x.id === id)
export const movResp = () => MOV_RESP
export const veiculos = () => VEICULOS
export const midiaAcoes = () => MIDIA_ACOES
export const catastDef = (id) => CATASTROFES.find((x) => x.id === id)
export const catastResp = () => CATAST_RESP
export const linhaDe = (rel) => (rel < 35 ? LINHAS.oposicao : rel > 65 ? LINHAS.governista : LINHAS.neutra)
export const setorHumor = (v) => (v >= 70 ? 'satisfeito' : v >= 45 ? 'neutro' : v >= 30 ? 'insatisfeito' : 'em revolta')
const pick = (a) => a[Math.floor(R() * a.length)]
function socCusto(cash) {
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (cash && game.stats.cash < cash) return `Sem caixa (${cash}).`
  return ''
}
function roundSociedade() {
  const sc = socEnsure()
  sc.used = {}
  // setores: satisfação e efeitos
  const eco = game.stats.eco
  for (const st of SETORES) {
    let v = sc.setores[st.id]
    v = clamp(v + (eco - 50) / 60 - (v - 50) * 0.05)
    sc.setores[st.id] = v
    if (v >= 65) {
      const k = (v - 50) / 50
      const fx = {}
      for (const a in st.pass) fx[a] = st.pass[a] * k
      applyFx(fx)
    } else if (v <= 30) {
      applyFx({ cong: -0.5, eco: -0.3 })
      if (R() < 0.15) toast('📢', `${st.bancada} ataca o governo no plenário.`)
    }
  }
  // mídia
  for (const vc of VEICULOS) {
    const m = sc.midia[vc.id]
    if (m.calado > 0) { m.calado--; continue }
    m.rel = clamp(m.rel + (game.stats.pop - 50) / 80)
    const k = vc.aud / 60
    if (m.rel < 35) applyFx({ pop: -0.2 * k })
    else if (m.rel > 65) applyFx({ pop: 0.12 * k })
    if (m.verbas > 0 && R() < 0.05 * m.verbas) {
      applyFx({ img: -4, pop: -1.5 }, true)
      m.verbas = 0
      m.rel = clamp(m.rel - 25)
      timelineAdd('🗞️', `Vaza esquema de verbas ao ${vc.name}`, 'down')
      toast('🗞️', `Escândalo: verbas publicitárias ao ${vc.name} vieram à tona.`)
    }
  }
  // movimento social
  if (sc.volta && --sc.volta.in <= 0) {
    const d = movDef(sc.volta.id)
    sc.movs.push({ id: d.id, quem: sc.volta.quem, left: d.left, volta: true })
    toast(d.icon, `${d.name} volta mais forte, liderada por ${sc.volta.quem}.`)
    sc.volta = null
  }
  for (const mv of sc.movs) { mv.left--; applyFx(movDef(mv.id).ongoing) }
  for (const mv of sc.movs.filter((x) => x.left <= 0)) {
    applyFx({ pop: -1.5, img: -1 }, true)
    toast('📉', `${movDef(mv.id).name} se desgastou, mas deixou marcas.`)
  }
  sc.movs = sc.movs.filter((x) => x.left > 0)
  if (!sc.movs.length && game.total >= 4 && R() < 0.1) {
    const d = pick(MOVIMENTOS)
    const quem = pick(d.quem)
    sc.movs.push({ id: d.id, quem, left: d.left })
    toast(d.icon, `${d.name}, liderada por ${quem}. Veja a aba Mundo.`)
    timelineAdd(d.icon, `${d.name} liderada por ${quem}`, 'down')
  }
  // catástrofe
  if (sc.catast) {
    sc.catast.left--
    applyFx(catastDef(sc.catast.id).ongoing)
    if (sc.catast.left <= 0) {
      applyFx({ img: -1, pop: -1 }, true)
      toast('⚠️', `${catastDef(sc.catast.id).name} terminou sem resposta do governo.`)
      sc.catast = null
    }
  } else if (game.total >= 3 && R() < 0.07) {
    const d = pick(CATASTROFES)
    sc.catast = { id: d.id, left: d.left }
    toast(d.icon, `${d.name}! Responda na aba Mundo.`)
    timelineAdd(d.icon, d.name, 'down')
  }
}
export function setorMotivo(id, acao) {
  const a = SETOR_ACOES.find((x) => x.id === acao)
  if (!a) return 'Indisponível.'
  if (socNow().used['s:' + id]) return 'O setor já foi tratado nesta rodada.'
  return socCusto(a.cash)
}
export function setorAgir(id, acao) {
  if (setorMotivo(id, acao)) return null
  const sc = socEnsure()
  const st = SETORES.find((x) => x.id === id)
  const a = SETOR_ACOES.find((x) => x.id === acao)
  sc.used['s:' + id] = 1
  let txt = ''
  const fx = { cash: -(a.cash || 0) }
  if (acao === 'agradar') {
    sc.setores[id] = clamp(sc.setores[id] + 18)
    for (const o of SETORES) if (o.id !== id) sc.setores[o.id] = clamp(sc.setores[o.id] - 3)
    txt = `${st.name}: você atendeu o pedido (${st.agrada.toLowerCase()}).`
  } else if (acao === 'regular') {
    sc.setores[id] = clamp(sc.setores[id] - 15)
    fx.img = 1; fx.cong = -1
    txt = `${st.name}: regras mais duras irritaram o setor.`
  } else {
    sc.setores[id] = clamp(sc.setores[id] + 6)
    fx.cong = 2
    txt = `${st.bancada} saiu da reunião mais próxima do governo.`
  }
  applyFx(fx, true)
  game.poder.press.push({ icon: st.icon, text: txt })
  game.poder.press = game.poder.press.slice(-4)
  cnt('setor')
  save()
  return { txt }
}
export function movMotivo(idx, resp) {
  const r = MOV_RESP.find((x) => x.id === resp)
  if (!r || !socNow().movs[idx]) return 'Indisponível.'
  if (socNow().used['m' + idx]) return 'Você já respondeu a este movimento nesta rodada.'
  return socCusto(r.cash)
}
export function movAgir(idx, resp) {
  if (movMotivo(idx, resp)) return null
  const sc = socEnsure()
  const mv = sc.movs[idx]
  const d = movDef(mv.id)
  const r = MOV_RESP.find((x) => x.id === resp)
  sc.used['m' + idx] = 1
  let ok = true
  if (r.p) ok = R() < r.p
  const o = ok ? r.ok : r.bad
  applyFx({ ...o, cash: -(r.cash || 0) }, true)
  let txt
  if (r.skip) txt = `Você preferiu esperar. ${mv.quem} segue mobilizando.`
  else if (resp === 'dialogar' && !ok) txt = `${mv.quem} saiu da reunião sem acordo.`
  else {
    sc.movs.splice(idx, 1)
    if (r.crescer) { sc.volta = { id: mv.id, quem: mv.quem, in: 2 }; txt = `A repressão encerrou o ato, mas ${mv.quem} promete voltar.` }
    else txt = resp === 'negociar' ? `Acordo com ${mv.quem}: a pauta (${d.pauta.toLowerCase()}) foi atendida em parte.` : `${mv.quem} aceitou desmobilizar após a conversa.`
    if (resp === 'dialogar') agendar('greve')
  }
  timelineAdd(d.icon, txt, ok && !r.crescer ? 'up' : 'flat')
  save()
  return { ok, txt }
}
export function midiaMotivo(id, acao) {
  const a = MIDIA_ACOES.find((x) => x.id === acao)
  if (!a || !VEICULOS.find((v) => v.id === id)) return 'Indisponível.'
  if (socNow().used['v:' + id]) return 'O veículo já foi tratado nesta rodada.'
  return socCusto(a.cash)
}
export function midiaAgir(id, acao) {
  if (midiaMotivo(id, acao)) return null
  const sc = socEnsure()
  const v = VEICULOS.find((x) => x.id === id)
  const m = sc.midia[id]
  sc.used['v:' + id] = 1
  const a = MIDIA_ACOES.find((x) => x.id === acao)
  const fx = { cash: -(a.cash || 0) }
  let txt = ''
  if (acao === 'verba') { m.rel = clamp(m.rel + 18); m.verbas++; txt = `${v.name} recebeu verba publicitária e amaciou a cobertura.` }
  else if (acao === 'entrevista') {
    if (R() < 0.7) { m.rel = clamp(m.rel + 8); fx.pop = 0.8; txt = `A entrevista ao ${v.name} foi bem recebida.` }
    else { m.rel = clamp(m.rel - 6); fx.img = -0.7; txt = `Você escorregou numa pergunta do ${v.name}.` }
  } else { m.calado = 3; m.rel = clamp(m.rel - 10); fx.img = -2; txt = `${v.name} foi processado e ficou calado por 3 rodadas, mas a fama de censor pesa.` }
  applyFx(fx, true)
  cnt('midia')
  save()
  return { txt }
}
export function catastMotivo(resp) {
  const r = CATAST_RESP.find((x) => x.id === resp)
  if (!r || !socNow().catast) return 'Indisponível.'
  if (socNow().used.c) return 'Você já respondeu a esta catástrofe nesta rodada.'
  return socCusto(r.cash)
}
export function catastAgir(resp) {
  if (catastMotivo(resp)) return null
  const sc = socEnsure()
  sc.used.c = 1
  const d = catastDef(sc.catast.id)
  const r = CATAST_RESP.find((x) => x.id === resp)
  const ok = R() < r.p
  applyFx({ ...(ok ? r.ok : r.bad), cash: -(r.cash || 0) }, true)
  const txt = ok ? `${d.name}: ${r.name} deu resultado.` : `${d.name}: ${r.name} não convenceu.`
  if (ok) { sc.catast = null; cnt('catastok') }
  else sc.catast.left = Math.max(1, sc.catast.left)
  timelineAdd(d.icon, txt, ok ? 'up' : 'down')
  save()
  return { ok, txt }
}

/* ---------- BLOCO 24: crises globais, diplomacia avançada, espionagem ---------- */
const m24Base = () => ({ crise: null, emb: {}, sancoes: [], embargo: null, espio: { rede: 0, contra: 20 }, eleicao: null, viagem: {}, used: {}, prox: 8 })
export const m24Now = () => (game.world && game.world.m24) || m24Base()
function m24() {
  const w = game.world
  if (!w.m24 || !w.m24.espio) w.m24 = { ...m24Base(), ...(w.m24 || {}) }
  return w.m24
}
export const criseDef = (id) => CRISES.find((x) => x.id === id)
export const criseResp = () => CRISE_RESP
export const embDefs = () => EMB
export const espioAcoes = () => ESPIO_ACOES
export const viagemInfo = () => VIAGEM
const partnerNome = (id) => (PARTNERS.find((x) => x.id === id) || { name: id }).name
const gate = (pool = 'pts', cash = 0) => {
  if (!isPresident()) return 'Só o presidente conduz a política externa.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (ptsOf(pool) < 1) return pool === 'ptsM' ? 'Sem pontos de defesa nesta rodada.' : 'Sem pontos de diplomacia nesta rodada.'
  if (cash && game.stats.cash < cash) return `Sem caixa (${cash}).`
  return ''
}
function roundMundo24() {
  if (!isPresident()) return
  const w = game.world
  const m = m24()
  m.used = {}
  const p = game.poder
  // embaixadores
  for (const [pid, e] of Object.entries(m.emb)) {
    const d = EMB.find((x) => x.id === e)
    shiftRel(pid, d.rel)
    if (d.gafe && R() < d.gafe) { shiftRel(pid, -4); applyFx({ img: -0.8 }, true); toast('🎙️', `Gafe do embaixador em ${partnerNome(pid)}.`) }
  }
  for (const k in m.viagem) if (m.viagem[k] > 0) m.viagem[k]--
  // sanções impostas
  for (const x of m.sancoes) { x.left--; shiftRel(x.alvo, -1.2); applyFx({ eco: -0.25 }) }
  m.sancoes = m.sancoes.filter((x) => x.left > 0)
  // embargo sofrido
  if (m.embargo) {
    m.embargo.left--
    applyFx({ eco: -0.8, cash: -0.3 })
    if (m.embargo.left <= 0) { toast('🚢', 'O embargo foi levantado.'); m.embargo = null }
  } else if (game.total >= 6 && !m.crise) {
    const cands = PARTNERS.filter((x) => w.rel[x.id] < 28 && x.id !== 'onu')
    if (cands.length && R() < 0.1) {
      const c = cands[Math.floor(R() * cands.length)]
      m.embargo = { quem: c.id, left: 3 }
      toast('🚢', `${c.name} decreta embargo contra o Brasil.`)
      timelineAdd('🚢', `Embargo de ${c.name}`, 'down')
    }
  }
  // espionagem
  m.espio.rede = Math.max(0, m.espio.rede - 2)
  if (game.total >= 5 && R() < 0.08) {
    if (R() * 100 < m.espio.contra + 15) { applyFx({ img: 1.5 }, true); toast('🛡️', 'A contraespionagem pegou um agente estrangeiro.'); timelineAdd('🛡️', 'Espião estrangeiro capturado', 'up') }
    else { applyFx({ img: -2, seg: -1, eco: -0.5 }, true); toast('🕵️', 'Vazamento: segredos do governo foram roubados.'); timelineAdd('🕵️', 'Segredos vazados por espionagem', 'down') }
  }
  // crise global
  if (m.crise) {
    m.crise.left--
    applyFx(criseDef(m.crise.id).ongoing)
    if (m.crise.left <= 0) { applyFx({ img: -1, eco: -1 }, true); toast('⚠️', `${criseDef(m.crise.id).name} passou sem uma resposta do governo.`); m.crise = null }
  } else if (game.total >= 5 && R() < 0.06) {
    const d = CRISES[Math.floor(R() * CRISES.length)]
    m.crise = { id: d.id, left: d.left }
    toast(d.icon, `${d.name}! Responda na aba Mundo.`)
    timelineAdd(d.icon, d.name, 'down')
  }
  // eleição em outro país
  if (m.eleicao) {
    const el = m.eleicao
    if (--el.left <= 0) {
      const aliadoVence = R() < 0.5 + (el.apoio === 'aliado' ? 0.2 : el.apoio === 'oposto' ? -0.2 : 0)
      let d = aliadoVence ? 3 : -3
      if (el.apoio === 'aliado') d = aliadoVence ? 8 : -8
      if (el.apoio === 'oposto') d = aliadoVence ? -6 : 6
      shiftRel(el.pais, d)
      timelineAdd('🗳️', `${aliadoVence ? 'Candidato aliado' : 'Candidato opositor'} vence eleição em ${partnerNome(el.pais)}`, d > 0 ? 'up' : 'down')
      toast('🗳️', `${partnerNome(el.pais)}: ${aliadoVence ? 'candidato amigo do Brasil' : 'candidato crítico ao Brasil'} venceu.`)
      m.eleicao = null
    }
  } else if (--m.prox <= 0 && game.total >= 4) {
    const c = PARTNERS.filter((x) => x.id !== 'onu')
    m.eleicao = { pais: c[Math.floor(R() * c.length)].id, left: 2, apoio: null }
    m.prox = 8
    toast('🗳️', `Eleição em ${partnerNome(m.eleicao.pais)}: você pode apoiar um lado.`)
  }
  void p
}
export function criseMotivo(id) {
  const r = CRISE_RESP.find((x) => x.id === id)
  if (!r || !m24Now().crise) return 'Indisponível.'
  return gate('pts', r.cash)
}
export function criseAgir(id) {
  if (criseMotivo(id)) return null
  const r = CRISE_RESP.find((x) => x.id === id)
  const m = m24()
  const d = criseDef(m.crise.id)
  const p = Math.max(0.15, Math.min(0.92, r.base + (r.rel ? (game.world.rel[r.rel] - 50) / 200 : 0)))
  const ok = R() < p
  const o = ok ? r.ok : r.bad
  spendWorld({ ...o, cash: -(r.cash || 0) }, `${d.name}: ${r.name}`, ok ? `${r.name}: deu resultado.` : `${r.name}: não deu certo.`)
  if (ok) { m.crise = null; cnt('criseok') }
  timelineAdd(d.icon, ok ? `${d.name}: ${r.name} funcionou` : `${d.name}: ${r.name} falhou`, ok ? 'up' : 'down')
  return { ok, txt: game.world.last.text }
}
export function embMotivo(pid, tipo) {
  const d = EMB.find((x) => x.id === tipo)
  if (!d) return 'Indisponível.'
  if (m24Now().emb[pid] === tipo) return 'Já é o embaixador atual.'
  return gate('pts', d.cash)
}
export function nomearEmb(pid, tipo) {
  if (embMotivo(pid, tipo)) return null
  const d = EMB.find((x) => x.id === tipo)
  m24().emb[pid] = tipo
  spendWorld({ cash: -d.cash }, `Embaixada em ${partnerNome(pid)}: ${d.name}`, `${d.name} nomeado para ${partnerNome(pid)}.`)
  return { txt: game.world.last.text }
}
export function viagemMotivo(pid) {
  if ((m24Now().viagem[pid] || 0) > 0) return `Nova viagem em ${m24Now().viagem[pid]} rodada(s).`
  return gate('pts', VIAGEM.cash)
}
export function viajar(pid) {
  if (viagemMotivo(pid)) return null
  const rel = game.world.rel[pid]
  const ok = R() < Math.max(0.2, Math.min(0.92, 0.55 + (rel - 50) / 150))
  m24().viagem[pid] = VIAGEM.cooldown
  if (ok) {
    spendWorld({ img: 1.2, pop: 0.6, eco: 0.5, cash: -VIAGEM.cash }, `Visita oficial a ${partnerNome(pid)}`, `Visita a ${partnerNome(pid)} rendeu acordos e fotos boas.`)
    shiftRel(pid, 8)
  } else {
    spendWorld({ img: -1, cash: -VIAGEM.cash }, `Visita oficial a ${partnerNome(pid)}`, `A visita a ${partnerNome(pid)} terminou em constrangimento.`)
    shiftRel(pid, -3)
  }
  game.world.last.ok = ok
  return { ok, txt: game.world.last.text }
}
export function sancaoMotivo(pid) {
  if (m24Now().sancoes.some((x) => x.alvo === pid)) return 'Já há sanção em vigor.'
  if (pid === 'onu') return 'Não se sanciona o organismo multilateral.'
  return gate('pts', 0)
}
export function sancionar(pid) {
  if (sancaoMotivo(pid)) return null
  m24().sancoes.push({ alvo: pid, left: SANCAO.left })
  spendWorld({ img: 0.8 }, `Sanções a ${partnerNome(pid)}`, `Sanções impostas a ${partnerNome(pid)}: a relação esfria e o comércio sente.`)
  shiftRel(pid, -10)
  return { txt: game.world.last.text }
}
export function embargoMotivo(id) {
  const m = m24Now()
  if (!m.embargo) return 'Indisponível.'
  if (id === 'negociar') return gate('pts', 2)
  return gate('pts', 0)
}
export function resolverEmbargo(id) {
  if (embargoMotivo(id)) return null
  const m = m24()
  const q = m.embargo.quem
  if (id === 'negociar') {
    spendWorld({ cash: -2, eco: 1 }, `Fim do embargo de ${partnerNome(q)}`, 'Você negociou e o embargo caiu.')
    shiftRel(q, 10)
    m.embargo = null
  } else {
    const ok = R() < 0.4 + (game.world.rel.onu - 50) / 200
    spendWorld({ img: ok ? 1.5 : -0.5 }, `Embargo de ${partnerNome(q)} levado à OMC`, ok ? 'A OMC deu razão ao Brasil e o embargo foi suspenso.' : 'A OMC demora e o embargo segue.')
    if (ok) m.embargo = null
  }
  return { txt: game.world.last.text }
}
export function espioMotivo(id, alvo) {
  const a = ESPIO_ACOES.find((x) => x.id === id)
  if (!a) return 'Indisponível.'
  if (id === 'missao' && m24Now().espio.rede < 30) return 'Exige rede de agentes 30+.'
  if (id === 'missao' && !alvo) return 'Escolha um país.'
  return gate('ptsM', a.cash)
}
export function espiar(id, alvo) {
  if (espioMotivo(id, alvo)) return null
  const a = ESPIO_ACOES.find((x) => x.id === id)
  const e = m24().espio
  let say
  if (id === 'rede') { e.rede = clamp(e.rede + 20); say = 'Rede de agentes ampliada.' }
  else if (id === 'contra') { e.contra = clamp(e.contra + 20); say = 'Contraespionagem reforçada.' }
  else {
    const ok = R() < Math.max(0.2, Math.min(0.9, 0.3 + e.rede / 150))
    e.rede = Math.max(0, e.rede - 10)
    if (ok) {
      spendWorld({ eco: 1.2, img: 0.5, cash: -a.cash }, `Missão secreta em ${partnerNome(alvo)}`, `A missão em ${partnerNome(alvo)} trouxe um segredo valioso.`, 'ptsM')
      cnt('espiaok')
    } else {
      spendWorld({ img: -3, cash: -a.cash }, `Missão secreta em ${partnerNome(alvo)}`, `Agente flagrado em ${partnerNome(alvo)}: crise diplomática.`, 'ptsM')
      shiftRel(alvo, -12)
    }
    game.world.last.ok = ok
    return { ok, txt: game.world.last.text }
  }
  spendWorld({ cash: -a.cash }, say, say, 'ptsM')
  return { txt: say }
}
export function eleicaoMotivo() {
  const el = m24Now().eleicao
  if (!el) return 'Indisponível.'
  if (el.apoio) return 'Você já definiu sua posição.'
  return gate('pts', 1)
}
export function apoiarEleicao(lado) {
  if (eleicaoMotivo()) return null
  const m = m24()
  m.eleicao.apoio = lado
  spendWorld({ cash: -1 }, `Posição na eleição de ${partnerNome(m.eleicao.pais)}`, lado === 'neutro' ? 'Você manteve neutralidade.' : `Você apoiou o candidato ${lado === 'aliado' ? 'amigo' : 'da oposição'}.`)
  return { txt: game.world.last.text }
}

/* ---------- BLOCO 25: memória, cadeias de reuniões e vida política ---------- */
export const memoriaNow = () => (game.poder && game.poder.memoria) || []
export const cadeiaNow = () => (game.poder && game.poder.cadeia) || null
export const cadeiaDef = (id) => CADEIAS[id]
function cadeiaPasso(id, passo, pontos, delta) {
  const c = CADEIAS[id]
  const p = game.poder
  const tot = pontos + delta
  if (passo + 1 < c.passos.length) {
    p.cadeia = { id, passo: passo + 1, pontos: tot }
    p.convites = (p.convites || []).filter((x) => !x.cadeia)
    p.convites.push({ defId: c.passos[passo + 1], left: 3, cadeia: id, passo: passo + 1, pontos: tot })
    toast(c.icon, `${c.nome}: próxima etapa, ${reuniaoDef(c.passos[passo + 1]).title}.`)
    return
  }
  const fim = tot >= 1 ? c.fim.bom : tot === 0 ? c.fim.medio : c.fim.ruim
  p.cadeia = null
  applyFx(fim.fx, true)
  timelineAdd(c.icon, `${c.nome}: ${fim.t}`, tot >= 1 ? 'up' : tot === 0 ? 'flat' : 'down')
  toast(c.icon, fim.t)
  cnt(tot >= 1 ? 'cadeiaok' : 'cadeia')
}

export const vidaNow = () => (game.poder && game.poder.vida) || { figuras: [], pend: null }
export const eventoDef = (tipo) => EVENTOS[tipo]
function vidaEnsure() {
  ensurePoder()
  const p = game.poder
  if (!p.vida || !p.vida.figuras) p.vida = { figuras: [], pend: null, ...(p.vida || {}) }
  const v = p.vida
  if (!v.figuras.length) {
    const rv = (game.rival && String(game.rival)) || null
    v.figuras = FIGURAS.map((f) => ({ id: f.id, icon: f.icon, label: f.label, nome: f.id === 'rival' && rv ? rv : candName(R), idade: f.idade[0] + Math.floor(R() * (f.idade[1] - f.idade[0] + 1)), estado: 'ativa', casado: false }))
  }
  return v
}
export const figurasNow = () => vidaNow().figuras
function roundVida() {
  if (!game.world) return
  const v = vidaEnsure()
  if (game.total % 4 === 0) for (const f of v.figuras) if (f.estado !== 'falecida') f.idade++
  const fp = {}
  for (const f of v.figuras) {
    if (f.estado !== 'ativa') continue
    const d = FIGURAS.find((x) => x.id === f.id)
    for (const k in d.pass || {}) fp[k] = (fp[k] || 0) + d.pass[k] * ((f.laco == null ? 55 : f.laco) / 55)
  }
  if (Object.keys(fp).length) applyFx(fp)
  if (v.pend) {
    v.pend.left--
    if (v.pend.left < 0) {
      applyFx({ img: -0.4 }, true)
      v.pend = null
    }
    return
  }
  if (game.total < 3 || R() > 0.12) return
  const ativos = v.figuras.filter((f) => f.estado === 'ativa')
  if (!ativos.length) return
  const f = ativos[Math.floor(R() * ativos.length)]
  const cands = []
  if (f.idade >= 62) cands.push('aposentadoria')
  if (f.idade >= 68) cands.push('morte', 'morte')
  if (f.idade <= 62 && !f.casado) cands.push('casamento')
  if (!cands.length) return
  const tipo = cands[Math.floor(R() * cands.length)]
  v.pend = { tipo, fig: f.id, left: 2 }
  const e = EVENTOS[tipo]
  toast(e.icon, e.titulo(f))
}
export function vidaMotivo(op) {
  const v = vidaNow()
  if (!v.pend) return 'Indisponível.'
  const o = EVENTOS[v.pend.tipo].ops.find((x) => x.id === op)
  if (!o) return 'Indisponível.'
  if (o.cash && game.stats.cash < o.cash) return `Sem caixa (${o.cash}).`
  return ''
}
export function vidaEscolher(op) {
  if (vidaMotivo(op)) return null
  const v = vidaEnsure()
  const f = v.figuras.find((x) => x.id === v.pend.fig)
  const e = EVENTOS[v.pend.tipo]
  const o = e.ops.find((x) => x.id === op)
  const fx = { ...((f.id === 'rival' && o.fxRival) || o.fx) }
  if (o.cash) fx.cash = (fx.cash || 0) - o.cash
  applyFx(fx, true)
  if (v.pend.tipo === 'morte') {
    f.estado = 'falecida'
    if (f.id === 'mentor') applyFx({ cong: -1.5 }, true)
  } else if (v.pend.tipo === 'aposentadoria') f.estado = 'aposentada'
  else if (v.pend.tipo === 'casamento') f.casado = true
  const txt = `${e.titulo(f)}: ${o.name.toLowerCase()}.`
  timelineAdd(e.icon, txt, 'flat')
  cnt('vida')
  v.pend = null
  save()
  return { txt }
}

/* ---------- BLOCO 26: família, biografia, laços e sucessão ---------- */
const famBase = () => ({ harmonia: 65, pais: null, conjuge: null, filhos: [], pend: null, used: false, prox: 0 })
export const familiaNow = () => (game.poder && game.poder.familia) || famBase()
function famEnsure() {
  ensurePoder()
  const p = game.poder
  if (!p.familia || !p.familia.filhos) p.familia = { ...famBase(), ...(p.familia || {}) }
  const f = p.familia
  if (!f.pais) f.pais = { mae: candName(R), pai: candName(R) }
  return f
}
export const famAcoes = () => FAM_ACOES
export const famEventoDef = (tipo) => FAM_EVENTOS[tipo]
export const perfisConjuge = () => PERFIS_CONJUGE
export const famPend = () => {
  const f = familiaNow()
  if (!f.pend) return null
  const e = FAM_EVENTOS[f.pend.tipo]
  const ctx = { nome: (f.conjuge && f.conjuge.nome) || 'Alguém da família', perfilTxt: (f.conjuge && PERFIS_CONJUGE.find((x) => x.id === f.conjuge.perfil).name) || '', filho: (f.filhos[0] && f.filhos[0].nome) || 'Seu filho' }
  return { tipo: f.pend.tipo, left: f.pend.left, e, titulo: e.titulo(ctx), texto: e.texto(ctx) }
}
function roundFamilia() {
  if (!game.world) return
  const f = famEnsure()
  f.used = false
  const cargo = officeId()
  f.harmonia = clamp(f.harmonia - (cargo === 'presidente' ? 2.5 : cargo === 'governador' ? 2 : 1.5))
  if (f.harmonia >= 70) applyFx({ img: 0.15 })
  else if (f.harmonia <= 25) applyFx({ img: -0.3, pop: -0.1 })
  if (f.pend) {
    f.pend.left--
    if (f.pend.left < 0) { f.harmonia = clamp(f.harmonia - 8); applyFx({ img: -0.3 }, true); f.pend = null }
    return
  }
  if (game.total < 3 || --f.prox > 0 || R() > 0.18) return
  f.prox = 3
  const c = f.conjuge
  const pool = []
  if (!c && game.total >= 4) pool.push('noivado')
  if (c && c.casado && !f.filhos.length && game.total >= 6) pool.push('filho')
  if (c && f.harmonia < 45) pool.push('reclama', 'reclama')
  if (f.filhos.length) pool.push('polemica')
  if (game.total >= 5) pool.push('favor')
  if (!pool.length) return
  const tipo = pool[Math.floor(R() * pool.length)]
  if (tipo === 'noivado') {
    const perfil = PERFIS_CONJUGE[Math.floor(R() * PERFIS_CONJUGE.length)].id
    f.conjuge = { nome: candName(R), perfil, look: randomLook(), casado: false, apoio: 60 }
  }
  f.pend = { tipo, left: 2 }
  const info = famPend()
  toast(info.e.icon, info.titulo)
}
export function famEscolhaMotivo(op) {
  const p = famPend()
  if (!p) return 'Indisponível.'
  const o = p.e.ops.find((x) => x.id === op)
  if (!o) return 'Indisponível.'
  if (o.cash && game.stats.cash < o.cash) return `Sem caixa (${o.cash}).`
  return ''
}
export function famEscolher(op) {
  if (famEscolhaMotivo(op)) return null
  const f = famEnsure()
  const p = famPend()
  const o = p.e.ops.find((x) => x.id === op)
  const fx = { ...(o.fx || {}) }
  if (o.cash) fx.cash = (fx.cash || 0) - o.cash
  applyFx(fx, true)
  f.harmonia = clamp(f.harmonia + (o.h || 0))
  if (o.sujo) game.heat = (game.heat || 0) + 4
  let txt = `${p.titulo}: ${o.name.toLowerCase()}.`
  if (p.tipo === 'noivado') {
    if (o.naoCasa) f.conjuge = null
    else { f.conjuge.casado = true; timelineAdd('💍', `Casamento com ${f.conjuge.nome}`, 'up') }
  } else if (p.tipo === 'filho') {
    f.filhos.push({ nome: candName(R).split(' ')[0], look: { ...randomLook(), age: 'jovem', headwear: 'nenhum', beard: 'nenhuma', glasses: 'nenhum' }, nasc: game.total })
    timelineAdd('👶', `Nasce ${f.filhos[f.filhos.length - 1].nome}, filho(a) de ${game.name}`, 'up')
  } else timelineAdd(p.e.icon, txt, 'flat')
  cnt('familia')
  f.pend = null
  save()
  return { txt }
}
export function famAcaoMotivo(id) {
  const a = FAM_ACOES.find((x) => x.id === id)
  const f = familiaNow()
  if (!a) return 'Indisponível.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (f.used) return 'Você já dedicou tempo à família nesta rodada.'
  if (a.req && !(f.conjuge && f.conjuge.casado && f.conjuge.perfil === a.req)) return 'Exige cônjuge atuante.'
  if (a.cash && game.stats.cash < a.cash) return `Sem caixa (${a.cash}).`
  return ''
}
export function famAgir(id) {
  if (famAcaoMotivo(id)) return null
  const f = famEnsure()
  const a = FAM_ACOES.find((x) => x.id === id)
  const fx = { ...(a.fx || {}) }
  if (a.cash) fx.cash = -a.cash
  applyFx(fx, true)
  f.harmonia = clamp(f.harmonia + a.h)
  f.used = true
  cnt('familia')
  save()
  return { txt: `${a.name}: harmonia ${a.h > 0 ? '+' : ''}${a.h}.` }
}

// biografia viva
export const bioNow = () => ((game.poder && game.poder.bio) || { marcos: [] }).marcos
export function bioTitulos() {
  const t = []
  const c = (k) => cntAll(k)
  if (c('guerravit') > 0 || c('pacto') > 0) t.push({ icon: '🕊️', nome: 'Pacificador', txt: 'Venceu ou evitou uma guerra.' })
  if (c('criseok') > 0 || c('cadeiaok') > 0) t.push({ icon: '🧭', nome: 'Estadista de crise', txt: 'Atravessou crises sem perder o rumo.' })
  if (c('reuniaook') >= 3) t.push({ icon: '🤝', nome: 'Negociador', txt: 'Fechou três ou mais acordos em reuniões.' })
  if (c('setor') >= 3) t.push({ icon: '🏭', nome: 'Amigo dos setores', txt: 'Cuidou da relação com os setores econômicos.' })
  if (c('catastok') > 0) t.push({ icon: '🚒', nome: 'Na linha de frente', txt: 'Respondeu a uma catástrofe local.' })
  if (c('cadeia') > 0) t.push({ icon: '🔥', nome: 'Sobrevivente', txt: 'Passou por uma crise que saiu do controle.' })
  if (game.poder && game.poder.familia && game.poder.familia.harmonia >= 70) t.push({ icon: '🏡', nome: 'Família unida', txt: 'Manteve a casa em ordem apesar da agenda.' })
  if (game.poder && game.poder.sucessao && game.poder.sucessao.fim && game.poder.sucessao.fim.won) t.push({ icon: '🎓', nome: 'Criador de sucessores', txt: 'Elegeu o próprio sucessor.' })
  return t
}

// laços com mentor, rival e líder do partido
export const figAcoes = (id) => FIG_ACOES[id] || []
export function figMotivo(figId, acao) {
  const v = vidaNow()
  const f = v.figuras.find((x) => x.id === figId)
  const a = (FIG_ACOES[figId] || []).find((x) => x.id === acao)
  if (!f || !a) return 'Indisponível.'
  if (f.estado !== 'ativa') return 'Esta pessoa já não está em atividade.'
  if (game.phase !== 'actions') return 'Disponível na fase de ações da rodada.'
  if (v.usedR === game.total) return 'Você já conversou com uma figura política nesta rodada.'
  return ''
}
export function figAgir(figId, acao) {
  if (figMotivo(figId, acao)) return null
  const v = vidaEnsure()
  const f = v.figuras.find((x) => x.id === figId)
  const a = FIG_ACOES[figId].find((x) => x.id === acao)
  if (f.laco == null) f.laco = figId === 'rival' ? 40 : 55
  if (!f.hist) f.hist = []
  const p = Math.max(0.1, Math.min(0.92, a.base + (a.k ? (f.laco - 50) / a.k : 0)))
  const ok = R() < p
  const fx = { ...(ok ? a.ok : a.bad) }
  applyFx(fx, true)
  f.laco = clamp(f.laco + (ok ? a.lacoOk : a.lacoBad))
  f.hist.unshift({ r: game.total, t: ok ? a.hOk : a.hBad })
  f.hist = f.hist.slice(0, 5)
  if (a.rivalMod && ok) (game.rivalMod = (game.rivalMod || 0) + a.rivalMod), rvOdio(a.rivalMod)
  v.usedR = game.total
  timelineAdd(f.icon, `${f.nome}: ${ok ? a.hOk : a.hBad}`, ok ? 'up' : 'down')
  cnt('laco')
  save()
  return { ok, txt: `${f.nome}: ${ok ? a.hOk : a.hBad}` }
}

// sucessão jogável
export const sucessaoNow = () => (game.poder && game.poder.sucessao) || null
export const sucPerfis = () => SUC_PERFIS
export const sucAcoes = () => SUC_ACOES
export function sucessaoMotivo() {
  if (game.phase !== 'rumo') return 'Só ao fim de um mandato.'
  if (sucessaoNow()) return 'A sucessão já foi decidida.'
  return ''
}
export function iniciarSucessao() {
  if (sucessaoMotivo()) return false
  ensurePoder()
  const cands = SUC_PERFIS.map((pf) => ({
    perfil: pf.id,
    nome: candName(R),
    look: randomLook(),
    forca: pf.base + (pf.id === 'popular' ? (game.stats.pop - 50) / 5 : pf.id === 'tecnico' ? (game.stats.cong - 50) / 6 : 0),
  }))
  game.poder.sucessao = { etapa: 0, cands, esc: null, nome: '', look: null, forca: 0, rival: 46 + Math.floor(R() * 14), usados: [], log: [], fim: null }
  save()
  return true
}
export function sucEscolher(i) {
  const s = sucessaoNow()
  if (!s || s.etapa !== 0 || !s.cands[i]) return false
  const c = s.cands[i]
  s.esc = c.perfil
  s.nome = c.nome
  s.look = { ...c.look }
  s.forca = c.forca
  s.etapa = 1
  save()
  return true
}
export function sucEditar(nome, look) {
  const s = sucessaoNow()
  if (!s || s.fim || s.etapa < 1) return false
  if (nome != null && String(nome).trim()) s.nome = String(nome).trim().slice(0, 40)
  if (look) s.look = { ...look }
  save()
  return true
}
export function sucAcaoMotivo(id) {
  const s = sucessaoNow()
  const a = SUC_ACOES.find((x) => x.id === id)
  if (!s || s.fim || s.etapa < 1 || s.etapa > 3 || !a) return 'Indisponível.'
  if (s.usados.includes(id)) return 'Já feito nesta etapa.'
  if (a.cash && game.stats.cash < a.cash) return `Sem caixa (${a.cash}).`
  return ''
}
export function sucAgir(id) {
  if (sucAcaoMotivo(id)) return null
  const s = sucessaoNow()
  const a = SUC_ACOES.find((x) => x.id === id)
  const pf = SUC_PERFIS.find((x) => x.id === s.esc)
  if (a.cash) applyFx({ cash: -a.cash }, true)
  let d = 0
  let txt = ''
  if (id === 'comicio') { d = 7; txt = 'O comício encheu a praça.' }
  else if (id === 'debate') {
    const ok = R() < 0.35 + (pf.vol >= 8 ? 0.25 : pf.id === 'tecnico' ? 0.3 : 0.15)
    d = ok ? 10 : -4
    txt = ok ? 'No debate, o sucessor brilhou.' : 'No debate, o sucessor tropeçou.'
  } else if (id === 'agenda') { d = Math.round((game.stats.pop - 50) / 6 + (game.stats.cong - 50) / 10 + 4); txt = 'Seu capital político ajudou na campanha.' }
  else if (id === 'atacar') {
    if (R() < 0.35) { d = -8; txt = 'O ataque virou contra o sucessor.' } else { d = 6; txt = 'O ataque desgastou o adversário.' }
  } else { d = 5; txt = 'Novo visual e discurso renovado.' }
  d += (R() - 0.5) * pf.vol
  s.forca = Math.round((s.forca + d) * 10) / 10
  s.usados.push(id)
  s.log.push(txt)
  if (s.usados.length >= 2) { s.etapa++; s.usados = [] }
  if (s.etapa > 3) sucFinalizar()
  save()
  return { txt }
}
function sucFinalizar() {
  const s = sucessaoNow()
  const margem = Math.round((s.forca - s.rival + (R() - 0.5) * 8) * 10) / 10
  const won = margem > 0
  s.fim = { won, margem }
  s.etapa = 4
  cnt(won ? 'sucessor' : 'sucessorperd')
  timelineAdd(won ? '🎓' : '📉', won ? `${s.nome}, seu sucessor, vence a eleição` : `${s.nome}, seu sucessor, perde a eleição`, won ? 'up' : 'down')
}
export function sucCancelar() {
  const s = sucessaoNow()
  if (!s || s.etapa !== 0) return false
  game.poder.sucessao = null
  save()
  return true
}
export function sucConcluir() {
  const s = sucessaoNow()
  if (!s || !s.fim) return false
  retireCareer()
  return true
}

/* ---------- BLOCO 27: eleição (debate, pesquisas segmentadas, boatos) ---------- */
const eleOn = () => !!game.election && ['campaign', 'runoff'].includes(game.phase)
export const gruposDef = () => GRUPOS
export const debateAbordagens = () => DEB_ABORDAGENS
export const boatoAcoes = () => BOATO_ACOES

function focoBonus() {
  const f = game.election && game.election.foco
  if (!f) return 0
  let b = 0
  for (const g of GRUPOS) b += (f.g[g.id] || 0) * g.peso * 0.055
  b += Object.values(f.est || {}).reduce((a, v) => a + v * 0.6, 0)
  return b
}
function boatosDano() {
  const bs = game.election && game.election.boatos
  return bs ? bs.reduce((a, b) => a + (b.dano || 0), 0) : 0
}
export const boatosNow = () => (game.election && game.election.boatos) || []
export const boatosDanoNow = () => Math.round(boatosDano() * 10) / 10

function gerarBoatos(n) {
  const nome = game.name
  const out = []
  const quebradas = ((game.election && game.election.promises) || []).filter((p) => !p.kept)
  for (let i = 0; i < n; i++) {
    const real = R() < (0.25 + (game.heat || 0) / 120 + (quebradas.length ? 0.1 : 0))
    let texto
    if (real) {
      const pool = BOATOS_REAIS.filter((x) => x.cond === 'any' || (x.cond === 'heat' && (game.heat || 0) > 8) || (x.cond === 'promessa' && quebradas.length))
      const t = pool[Math.floor(R() * pool.length)]
      texto = t.texto.replace('{n}', nome).replace('{p}', quebradas.length ? quebradas[0].name : '')
    } else texto = BOATOS_FALSOS[Math.floor(R() * BOATOS_FALSOS.length)].replace('{n}', nome)
    out.push({ id: 'b' + game.total + '_' + i + '_' + Math.floor(R() * 1000), texto, real, dano: Math.round((0.8 + R() * 1.4) * 10) / 10, estado: 'solto', revelado: false })
  }
  return out
}
export function boatoMotivo(id, acao) {
  const b = boatosNow().find((x) => x.id === id)
  const a = BOATO_ACOES.find((x) => x.id === acao)
  if (!b || !a || !eleOn()) return 'Indisponível.'
  if (acao === 'checar' && b.revelado) return 'Já checado.'
  if (acao !== 'checar' && b.estado !== 'solto') return 'Já tratado.'
  if (a.cash && game.stats.cash < a.cash) return `Sem caixa (${a.cash}).`
  return ''
}
export function boatoAgir(id, acao) {
  if (boatoMotivo(id, acao)) return null
  const b = boatosNow().find((x) => x.id === id)
  const a = BOATO_ACOES.find((x) => x.id === acao)
  if (a.cash) applyFx({ cash: -a.cash }, true)
  let txt = ''
  if (acao === 'checar') {
    b.revelado = true
    txt = b.real ? 'A checagem concluiu que a notícia é verdadeira. Cuidado com a resposta.' : 'A checagem confirmou que é falso.'
  } else if (acao === 'desmentir') {
    b.estado = 'desmentido'
    if (!b.real) {
      if (R() < 0.75) { b.dano = 0; applyFx({ img: 0.5 }, true); txt = 'O desmentido pegou e o boato perdeu força.' } else { b.dano = Math.round(b.dano * 5) / 10; txt = 'O desmentido chegou tarde. O boato perdeu metade da força.' }
    } else { b.dano = Math.round(b.dano * 15) / 10; applyFx({ img: -2 }, true); txt = 'Você desmentiu uma coisa verdadeira. A imprensa mostrou os fatos e o dano aumentou.' }
  } else if (acao === 'explicar') {
    b.estado = 'explicado'
    if (b.real) { b.dano = Math.round(b.dano * 5) / 10; applyFx({ img: 0.5 }, true); txt = 'A explicação transparente reduziu o estrago.' } else { b.dano = Math.round(b.dano * 8) / 10; txt = 'Você explicou o que nem precisava. O boato perdeu pouco.' }
  } else if (acao === 'processar') {
    b.estado = 'processado'
    if (!b.real) {
      if (R() < 0.5) { b.dano = 0; applyFx({ img: 1 }, true); txt = 'O autor foi identificado e o boato caiu.' } else { b.dano = Math.round(b.dano * 7) / 10; txt = 'O processo é lento. O boato perdeu um pouco de força.' }
    } else { applyFx({ img: -3 }, true); txt = 'Processar por algo verdadeiro virou notícia: parece censura.' }
  } else { b.estado = 'ignorado'; txt = 'Você ignorou. O dano continua.' }
  cnt(b.real ? 'boatoreal' : 'boatofalso')
  if (!b.real && b.dano === 0) cnt('boatook')
  save()
  return { txt }
}

// pesquisas segmentadas
function grupoDelta(id) {
  const s = game.stats
  const w = game.world || {}
  const tech = ((w.tech && w.tech.done) || []).length
  const setores = (game.poder && game.poder.soc && game.poder.soc.setores) ? Object.values(game.poder.soc.setores) : []
  const mSet = setores.length ? setores.reduce((a, v) => a + v, 0) / setores.length : 50
  const rel = (game.contacts.find((c) => c.id === 'religioso') || { rel: 40 }).rel
  if (id === 'jovens') return (s.soc - 50) * 0.08 + tech * 0.5 + (s.eco - 50) * 0.03
  if (id === 'evangelicos') return (rel - 40) * 0.1 + (s.img - 50) * 0.05
  if (id === 'empresarios') return (s.eco - 50) * 0.1 + (mSet - 50) * 0.06
  if (id === 'idosos') return (s.soc - 50) * 0.1 + (s.seg - 50) * 0.05
  return (s.eco - 50) * 0.06 + (s.pop - 50) * 0.06
}
export const pesqSegMotivo = () => {
  if (!eleOn() || game.election.target == null) return 'Disponível durante a campanha.'
  if (game.election.pesq && game.election.pesq.round === (game.election.round || 1)) return 'A pesquisa deste turno já foi encomendada.'
  if (game.stats.cash < 1) return 'Sem caixa (1).'
  return ''
}
export function pesqSegEncomendar() {
  if (pesqSegMotivo()) return null
  const e = game.election
  applyFx({ cash: -1 }, true)
  const base = pollShare()
  e.gnoise = e.gnoise || {}
  const grupos = GRUPOS.map((g) => {
    if (e.gnoise[g.id] == null) e.gnoise[g.id] = rnd(-3, 3)
    return { id: g.id, share: Math.round(clamp(base + grupoDelta(g.id) * 1.4 + e.gnoise[g.id], 15, 85) * 10) / 10 }
  })
  const est = stateEstimates()
  const estados = country().regions.map((r) => ({ id: r.id, name: r.name, share: Math.round((est[r.mapId || r.id.toLowerCase()] || 50) * 10) / 10 }))
  e.pesq = { round: e.round || 1, grupos, estados }
  save()
  return e.pesq
}
export const pesqSegNow = () => (game.election && game.election.pesq) || null
export const focoNow = () => (game.election && game.election.foco) || { g: {}, est: {} }
export function focoMotivo(kind, id) {
  if (!eleOn() || game.election.target == null) return 'Disponível durante a campanha.'
  const f = focoNow()
  if (kind === 'g') {
    if ((f.g[id] || 0) >= 2) return 'Foco máximo neste grupo.'
  } else {
    if (!['presidente', 'governador'].includes(game.election.target)) return 'Só em eleições majoritárias de estado e país.'
    if (f.est[id]) return 'Estado já em foco.'
    if (Object.keys(f.est).length >= 3) return 'No máximo 3 estados em foco.'
  }
  if (game.stats.cash < 1) return 'Sem caixa (1).'
  return ''
}
export function focar(kind, id) {
  if (focoMotivo(kind, id)) return null
  const e = game.election
  e.foco = e.foco || { g: {}, est: {} }
  applyFx({ cash: -1 }, true)
  if (kind === 'g') e.foco.g[id] = (e.foco.g[id] || 0) + 1
  else e.foco.est[id] = 1
  save()
  return true
}

// debate com réplica e tréplica
export const debateNow = () => (game.election && game.election.debate) || null
const TRAIT_KEYS = ['pragmatico', 'idealista', 'ganancioso', 'orgulhoso', 'cauteloso']
export function debateMotivo() {
  if (!eleOn()) return 'Disponível durante a campanha.'
  if (game.election.tvDone) return 'O debate já aconteceu.'
  if (game.election.debate) return 'O debate está em andamento.'
  return ''
}
export function debateAbrir() {
  if (debateMotivo()) return false
  const e = game.election
  if (!e.rivalTrait) e.rivalTrait = (e.rivalArc && game.poder && game.poder.rv && game.poder.rv.trait) || TRAIT_KEYS[Math.floor(R() * TRAIT_KEYS.length)]
  const t = TEMAS_DEBATE[Math.floor(R() * TEMAS_DEBATE.length)]
  e.debate = { step: 1, tema: t, aud: 50, riv: 60, ultimo: null, falas: [], reveal: false, res: null }
  save()
  return true
}
export function debateAbordar(id) {
  const d = debateNow()
  const ab = DEB_ABORDAGENS.find((x) => x.id === id)
  if (!d || !ab || d.res) return null
  const trait = game.election.rivalTrait
  const mult = [0, 1, 1.3, 1.6][d.step]
  let [a, r] = ab.eff[trait]
  a = a * mult + kn('com') * 0.4
  r = r * mult
  if (d.ultimo === id) a -= 3
  const punch = Math.max(0, Math.min(6, 2 + (game.election.rival - baseScore()) / 10))
  d.aud = Math.max(0, Math.min(100, d.aud + a - (d.riv < 35 ? punch / 2 : punch)))
  d.riv = Math.max(0, Math.min(100, d.riv - r))
  const forte = a <= 2 * mult && r <= 2 * mult
  const arr = DEB_FALAS[trait][forte ? 'forte' : 'fraco']
  const fala = arr[Math.floor(R() * arr.length)].replace('{t}', d.tema.tema)
  d.falas.push({ passo: d.step, eu: ab.name, rival: fala, a: Math.round(a * 10) / 10, r: Math.round(r * 10) / 10 })
  d.ultimo = id
  d.reveal = true
  d.step++
  if (d.step > 3) {
    const score = Math.max(0, Math.min(1, (d.aud + (d.riv < 40 ? 8 : 0)) / 100))
    const tv = finishTv(score)
    d.res = { tv, aud: Math.round(d.aud), riv: Math.round(d.riv) }
    cnt('debate')
  }
  save()
  return { ok: true }
}
export function debateFechar() {
  const d = debateNow()
  if (!d || !d.res) return false
  game.election.debate = null
  save()
  return true
}

/* ---------- BLOCO 30: o rival recorrente ---------- */
const rvBase = () => ({ nome: '', sigla: '', trait: 'pragmatico', estagio: 'ascensao', forca: 48, odio: 20, estima: 20, vit: 0, der: 0, trocas: 0, voltas: 0, left: 0, last: -9, pend: null, hist: [], acao: -9 })
export const rvNow = () => (game.poder && game.poder.rv) || { ...rvBase(), nome: game.rival || 'O rival' }
export const rvEstagioInfo = (id) => RV_ESTAGIOS[id] || RV_ESTAGIOS.firme
export const rvAcoes = () => RV_ACOES
export const rvEventoDef = (id) => RV_EVENTOS.find((x) => x.id === id)
export function rvEnsure() {
  ensurePoder()
  const p = game.poder
  if (!p.rv || !p.rv.hist) {
    p.rv = { ...rvBase(), ...(p.rv || {}), nome: game.rival || candName(R), sigla: PARTIES[Math.floor(R() * PARTIES.length)].sigla, trait: RV_TRAITS[Math.floor(R() * RV_TRAITS.length)], forca: Math.round(44 + R() * 14) }
    if (!game.rival) game.rival = p.rv.nome
  }
  return p.rv
}
const rvMod = () => {
  const r = game.poder && game.poder.rv
  if (!r) return 0
  return (r.forca - 50) * 0.1 + (r.estagio === 'inimigo' ? 1 : 0) + (r.estagio === 'volta' ? 2 : 0)
}
function rvOdio(n) {
  const r = game.poder && game.poder.rv
  if (r) r.odio = clamp(r.odio + n * 2.5)
}
function rvLog(r, icon, txt, tone = 'flat') {
  r.hist.unshift({ r: game.total, t: txt })
  r.hist = r.hist.slice(0, 12)
  timelineAdd(icon, txt, tone)
  toast(icon, txt.length > 90 ? txt.slice(0, 88) + '…' : txt)
}
function rvDelta(r, d) {
  if (d.forca) r.forca += d.forca
  if (d.odio) r.odio += d.odio
  if (d.estima) r.estima += d.estima
  r.forca = clamp(r.forca)
  r.odio = clamp(r.odio)
  r.estima = clamp(r.estima)
  if (d.queda && r.estagio !== 'exilio') {
    r.estagio = 'queda'
    r.left = 4
    rvLog(r, '📉', RV_AUTO.queda(r), 'up')
  }
  rvRecalc(r)
}
// o estágio acompanha o que você faz: ódio alto vira inimizade, estima alta vira aliança
function rvRecalc(r) {
  if (r.estagio === 'aliado') {
    if (r.estima < 35 && r.odio >= 40) {
      r.estagio = 'inimigo'
      applyFx({ img: -2, cong: -1.5 }, true)
      rvLog(r, '💔', RV_AUTO.traicao(r), 'down')
    }
    return
  }
  if (r.estagio === 'exilio' || r.estagio === 'queda') return
  if (r.estima >= 45 && r.odio < 45) {
    r.estagio = 'aliado'
    rvLog(r, '🤝', RV_AUTO.aliado(r), 'up')
  } else if (r.odio >= 78 && r.estagio !== 'inimigo') {
    r.estagio = 'inimigo'
    rvLog(r, '☠️', RV_AUTO.inimigo(r), 'down')
  } else if (r.estagio === 'inimigo' && r.odio < 60) r.estagio = 'firme'
}
function roundRival() {
  if (game.total < 2) return
  const r = rvEnsure()
  if (r.estagio === 'queda') {
    if (--r.left <= 0) {
      r.estagio = 'exilio'
      r.left = 6
      rvLog(r, '🧳', RV_AUTO.exilio(r))
    }
  } else if (r.estagio === 'exilio') {
    if (--r.left <= 0) {
      r.estagio = 'volta'
      r.forca = clamp(58 + R() * 14)
      r.voltas++
      rvLog(r, '🔥', RV_AUTO.volta(r), 'down')
    }
  } else if (r.estagio === 'volta' && R() < 0.1) r.estagio = 'firme'
  else if (r.estagio === 'ascensao' && !(r.vit || r.der)) r.forca = clamp(r.forca + 0.8)
  if (r.pend) {
    const d = rvEventoDef(r.pend.id)
    r.pend.left--
    if (r.pend.left < 0 && d) {
      rvAplicar(r, d, d.padrao, true)
    }
    return
  }
  if (game.total - r.last < 3) return
  if (r.estagio === 'aliado') {
    if (R() < 0.09) {
      applyFx({ cong: 1.5, img: 0.8 }, true)
      r.last = game.total
      rvLog(r, '🤝', RV_AUTO.ajuda(r), 'up')
    }
    return
  }
  if ((r.estagio === 'firme' || r.estagio === 'ascensao') && R() < 0.03) {
    const outras = PARTIES.filter((x) => x.sigla !== r.sigla)
    const nova = outras[Math.floor(R() * outras.length)].sigla
    rvLog(r, '🔁', RV_AUTO.troca(r, nova))
    r.sigla = nova
    r.trocas++
    r.forca = clamp(r.forca + (R() < 0.5 ? 6 : -6))
    r.last = game.total
    return
  }
  if (R() > 0.14) return
  const elig = RV_EVENTOS.filter((e) => e.est.includes(r.estagio) && (e.id !== 'trégua' || r.odio < 80))
  if (!elig.length) return
  const ev = elig[Math.floor(R() * elig.length)]
  r.pend = { id: ev.id, left: 2 }
  r.last = game.total
  toast(ev.icon, ev.titulo(r))
}
export function rvPendNow() {
  const r = game.poder && game.poder.rv
  if (!r || !r.pend) return null
  const e = rvEventoDef(r.pend.id)
  return e ? { e, r, left: r.pend.left } : null
}
export function rvMotivo(opId) {
  const pn = rvPendNow()
  if (!pn) return 'Nada pendente.'
  const o = pn.e.ops.find((x) => x.id === opId)
  if (!o) return 'Opção inválida.'
  if (o.cash && game.stats.cash < o.cash) return `Sem caixa (${o.cash}).`
  return ''
}
function rvAplicar(r, d, opId, auto) {
  const o = d.ops.find((x) => x.id === opId) || d.ops[d.ops.length - 1]
  const fx = { ...o.fx }
  if (o.cash) fx.cash = (fx.cash || 0) - o.cash
  applyFx(fx, true)
  if (o.sujo) {
    game.dirty++
    game.termDirty++
    game.heat = clamp((game.heat || 0) + 6)
  }
  r.pend = null
  rvLog(r, d.icon, `${d.titulo(r)}${auto ? ' (você deixou passar)' : ''}: ${o.name.toLowerCase()}.`)
  rvDelta(r, o.rv || {})
  cnt('rival')
  return o
}
export function rvEscolher(opId) {
  if (rvMotivo(opId)) return null
  const r = game.poder.rv
  const d = rvEventoDef(r.pend.id)
  const o = rvAplicar(r, d, opId, false)
  save()
  return { txt: `${d.titulo(r)}: ${o.name.toLowerCase()}.` }
}
export function rvAcaoMotivo(id) {
  const r = game.poder && game.poder.rv
  if (!r) return 'Ainda não há rival definido.'
  if (r.estagio === 'exilio') return 'Ele está afastado da política.'
  if (game.total - (r.acao ?? -9) < 3) return 'Espere algumas rodadas.'
  if (id === 'trégua' && r.estagio === 'aliado') return 'Ele já é seu aliado.'
  if (id === 'atacar' && r.estagio === 'aliado') return 'Atacar um aliado? Melhor não.'
  return ''
}
export function rvAcao(id) {
  if (rvAcaoMotivo(id)) return null
  const r = rvEnsure()
  r.acao = game.total
  let txt
  if (id === 'trégua') {
    const ok = R() < clamp(0.25 + r.estima / 100 - r.odio / 150, 0.05, 0.9) 
    if (ok) {
      applyFx({ cong: 1, img: 0.5 }, true)
      rvDelta(r, { estima: 14, odio: -10 })
      txt = `${r.nome} aceitou conversar. A relação esfriou para melhor.`
    } else {
      rvDelta(r, { odio: 3 })
      txt = `${r.nome} não quis conversa. A porta ficou entreaberta, mas por pouco.`
    }
  } else {
    applyFx({ img: -1.5, pop: 0.5 }, true)
    game.rivalMod = (game.rivalMod || 0) + 2
    rvDelta(r, { forca: -4, odio: 10, estima: -6 })
    txt = `Você atacou ${r.nome} em público. As manchetes dividiram o crédito.`
  }
  r.hist.unshift({ r: game.total, t: txt })
  r.hist = r.hist.slice(0, 12)
  cnt('rival')
  save()
  return { txt }
}
// o resultado da eleição muda o rival: quem perde enfraquece, quem ganha cresce
function rvResultado(won) {
  const e = game.election
  const r = game.poder && game.poder.rv
  if (!r || !e || !e.rivalArc) {
    if (r) game.rival = r.nome
    return
  }
  if (won) {
    r.der++
    rvDelta(r, { forca: -12, odio: 8, estima: -4 })
    if (r.forca <= 22 && r.estagio !== 'exilio') {
      r.estagio = 'queda'
      r.left = 4
      rvLog(r, '📉', RV_AUTO.queda(r), 'up')
    }
    r.hist.unshift({ r: game.total, t: `Perdeu a eleição para ${game.name}.` })
  } else {
    r.vit++
    rvDelta(r, { forca: 10, odio: 4 })
    if (r.estagio === 'ascensao') r.estagio = 'firme'
    r.hist.unshift({ r: game.total, t: `Venceu ${game.name} na eleição.` })
  }
  r.hist = r.hist.slice(0, 12)
  game.rival = r.nome
}
