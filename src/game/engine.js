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
import { mulberry32, todaySeed, ACHIEVEMENTS, makeRival, loadUnlocked, saveUnlocked, addHall } from './extras'
import { PARTIES } from './countries/brasil-parties'
import { DAY_FLAVOR, ACTION_ICON, holidayOf, makePost, slug, GENERIC_TAGS, candName } from './social'
import { MORE_FLAVOR } from './flavor'
import { BIG, bigWhen, BIG_TAGS } from './bigevents'
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
  return { rel: { eua: 50, china: 50, ue: 50, arg: 55, rus: 45, ori: 50 }, wars: [], pending: null, fa: 55, nuc: { angra: 0, sub: 0, enr: 0 }, nucDone: [], fed: {}, laws: [], pts: 2, lawUsed: false, last: null }
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
  seed: 0,
  rngN: 0,
  dirty: 0,
  toasts: [],
  runUnlocked: [],
  points: 0,
  hallPos: -1,
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
  return v > 0 ? v * (m.gain[k] || 1) * KNOW_GAIN(k) * dif.gain : v * (m.loss[k] || 1) * KNOW_LOSS(k) * dif.loss
}
export const effectiveFx = (fx) => Object.fromEntries(Object.entries(fx).map(([k, v]) => [k, Math.round(modV(k, v) * 10) / 10]))
export const partyObj = () => (game.party === 'own' ? game.myParty : game.party ? country().parties.find((p) => p.id === game.party) : null)
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
  return Math.round(game.history.length * 10 + game.stage * 6 + avg + (game.term >= 2 ? 10 : 0) + (ended ? 15 : 0) + game.keptAll * 5)
}

function finalize(ended) {
  game.points = computePoints(ended)
  checkAch()
  game.hallPos = addHall({
    name: game.name,
    region: game.region.id,
    label: ended ? game.legacy.title : game.over.title,
    points: game.points,
    daily: game.daily,
    date: new Date().toLocaleDateString('pt-BR'),
  })
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
  const p = country().parties.find((x) => x.id === id)
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
  const pool = country().parties.filter((p) => p.id !== game.party && !game.invites.includes(p.id) && partyChanceNow(p) > 0.3)
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
    cash: 2 + (s.eco - 50) * 0.1,
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

export function startGame({ countryId = 'brasil', name, archetypeId, regionId, cityName, partyId = null, ownParty = null, plan, daily = false, traits = {}, look = null }) {
  Object.assign(game, blank(), { countryId, daily, seed: daily ? todaySeed() : 0, difficulty: daily ? 'normal' : settings.difficulty })
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

function drawEvent() {
  const c = country()
  const pool = c.events.filter((e) => e.stages.includes(game.stage) && (!e.cond || e.cond(game)))
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

function beginTurn() {
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
  { id: 'agendaBr', stages: [1], sphere: 'fed', name: 'Agenda em Brasília', desc: 'Ministérios, gabinetes e corredores.', fx: { cong: 4, img: 1, cash: -2 } },
  { id: 'projeto', stages: [1, 3], sphere: 'fed', name: 'Projeto de lei de impacto', desc: 'Um projeto que dá manchete nacional.', fx: { cong: 3, img: 2, pop: 1, cash: -2 } },
  { id: 'obraestado', stages: [2], sphere: 'est', name: 'Obra estadual', desc: 'Estrada, ponte ou hospital regional.', fx: { eco: 4, pop: 2, cash: -5 } },
  { id: 'interior', stages: [1, 2], sphere: 'est', name: 'Caravana pelo interior', desc: 'Visitar cidades pequenas que nunca recebem político.', fx: { pop: 4, cong: 1, cash: -3 } },
  { id: 'diplomacia', stages: [3], sphere: 'fed', name: 'Agenda internacional', desc: 'Encontros com chefes de Estado e empresários.', fx: { eco: 3, img: 2, cash: -3 } },
  // decisões de cada cargo
  { id: 'fiscalizar', stages: [0], sphere: 'mun', name: 'Fiscalizar o prefeito', desc: 'Pedir documentos, visitar obras e cobrar na tribuna.', fx: { img: 4, pop: 1, cong: -3 } },
  { id: 'emendabairro', stages: [0], sphere: 'mun', name: 'Emenda para o bairro', desc: 'Garantir verba para uma obra pequena que o povo vê.', fx: { pop: 4, soc: 2, cong: -1, cash: -2 } },
  { id: 'emenda', stages: [1], sphere: 'fed', name: 'Emenda para a sua base', desc: 'Levar verba federal para os municípios que te apoiam.', fx: { pop: 3, cong: 3, cash: -4 } },
  { id: 'cpi', stages: [1], sphere: 'fed', name: 'Assinar pedido de CPI', desc: 'Cobrar investigação. A imprensa gosta, a bancada nem tanto.', fx: { img: 4, pop: 2, cong: -5 } },
  { id: 'frente', stages: [1], sphere: 'fed', name: 'Criar frente parlamentar', desc: 'Reunir colegas em torno de uma causa e ganhar espaço.', fx: { cong: 4, img: 2, cash: -2 } },
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
export const allActions = () => [...country().actions, ...SPHERE_ACTIONS.filter((a) => a.stages.includes(game.stage)), ...POWER_ACTIONS.filter((a) => a.stages.includes(game.stage) && (!a.when || a.when(game)))]
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
  let list = SCRIPTS.filter((s) => s.stages.includes(game.stage) && !game.talkSeen.includes(s.id))
  if (!list.length) {
    game.talkSeen = []
    list = SCRIPTS.filter((s) => s.stages.includes(game.stage))
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
  if (ask.rival && ok) game.rivalMod = (game.rivalMod || 0) + ask.rival
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
    if (a.rival) game.rivalMod = (game.rivalMod || 0) + a.rival
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
  return { months, diff, from: start, to: start + mp - 1 }
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
  return ticket + tv + sphere + ideas + 0.34 * s.pop + 0.16 * s.img + 0.14 * s.eco + 0.1 * s.cong + 0.08 * s.soc + 0.06 * s.seg + game.region.bonus * weight + party + plan
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
  game.rival = makeRival(R)
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
  e.rival = o.rival + (op.same && id === 'presidente' ? 2 : 0) + jumpDiff(op.same, op.jump) + rnd(-6, 8) - Math.min(8, game.rivalMod || 0)
  game.rivalMod = 0
  e.ticket = null
  e.ticketDone = !needsTicket()
  e.ticketBonus = 0
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
export const worldReady = () => game.phase === 'actions' && game.world.pts > 0

function ensureWorld() {
  const b = blankWorld()
  const old = game.world || {}
  game.world = { ...b, ...old, rel: { ...b.rel, ...(old.rel || {}) }, nuc: { ...b.nuc, ...(old.nuc || {}) }, fed: { ...(old.fed || {}) } }
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
function spendWorld(fx, text, say) {
  game.world.pts--
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
  if (!isPresident() || !worldReady()) return false
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
  if (!isPresident() || !worldReady()) return false
  const a = DEF_ACTIONS.find((x) => x.id === id)
  if (!a || !canPay(a.fx)) return false
  spendWorld(a.fx, `Forças Armadas: ${a.name}.`, `${a.name}: feito.`)
  game.world.fa = clamp(game.world.fa + a.fa)
  for (const [k, d] of Object.entries(a.rel || {})) shiftRel(k, d)
  return true
}

export function nucInvest(id) {
  if (!isPresident() || !worldReady()) return false
  const n = NUC.find((x) => x.id === id)
  const w = game.world
  if (!n || w.nuc[id] >= 100 || !canPay({ cash: -3 })) return false
  spendWorld({ cash: -3 }, `Programa nuclear: investimento em ${n.name}.`, `Mais um passo em: ${n.name}.`)
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
  w.pts = 2
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
  }
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
  game.poder = { statutes: [], timeline: [], pending: null, press: [], seen: [], ...(game.poder || {}) }
}
export function timelineAdd(icon, text, tn = 'flat') {
  ensurePoder()
  game.poder.timeline.unshift({ r: game.total, icon, text, tone: tn })
  game.poder.timeline = game.poder.timeline.slice(0, 40)
}
function enactStatute(bill, how, k = 1) {
  ensurePoder()
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
  julgarDecretos()
  riscoNomeados()
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
]
export const PERFIS = [
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
