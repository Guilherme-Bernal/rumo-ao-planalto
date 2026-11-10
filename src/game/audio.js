import { watch } from 'vue'
import { settings } from './settings'

// Música e efeitos 100% gerados por código (WebAudio): sem arquivos, sem direitos autorais.
// A trilha muda com o cargo (tom), a popularidade (maior/menor e andamento) e as guerras (drone grave).

let ctx = null
let musicBus = null
let sfxBus = null
let timer = null
let nextT = 0
let step = 0
let bar = 0
const mood = { pop: 50, stage: 1, war: 0, theme: 'gov' }

const midi = (n) => 440 * 2 ** ((n - 69) / 12)
const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const MINOR = [0, 2, 3, 5, 7, 8, 10]
const DORIAN = [0, 2, 3, 5, 7, 9, 10]
const ROOTS = [57, 55, 53, 50] // vereador..presidente: o tom vai ficando mais grave e solene
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const deg = (sc, i) => sc[((i % 7) + 7) % 7] + 12 * Math.floor(i / 7)

// Cada trilha é uma "receita": andamento, escala, progressão de acordes (graus) e quais camadas tocam.
// pad: acordes longos · bass: long | eighth | walk · arp: eighth | sixteenth · lead: densidade 0-1 e timbre
// drums: 0 nada, 1 leve, 2 cheia, 3 marcha, 4 batimento · drone, stab, tick: texturas extras
const THEMES = {
  menu: { bpm: 68, scale: MAJOR, prog: [0, 4, 5, 3], pad: 1, bass: 'long', arp: 'eighth', lead: 0.45, leadType: 'triangle', drums: 0 },
  gov: { bpm: 82, scale: MAJOR, minor: MINOR, prog: [0, 5, 3, 4], progMinor: [0, 3, 6, 4], pad: 1, bass: 'eighth', arp: 'eighth', lead: 0.4, leadType: 'triangle', drums: 1 },
  campanha: { bpm: 112, scale: MAJOR, prog: [0, 4, 5, 3], pad: 0.6, bass: 'walk', arp: 'eighth', lead: 0.7, leadType: 'square', drums: 2, pluck: true },
  crise: { bpm: 94, scale: MINOR, prog: [0, 0, 5, 4], pad: 1, bass: 'long', arp: null, lead: 0.22, leadType: 'sine', drums: 4, stab: true, saw: true },
  guerra: { bpm: 102, scale: MINOR, prog: [0, 6, 5, 6], pad: 0.8, bass: 'eighth', arp: null, lead: 0.4, leadType: 'sawtooth', drums: 3, drone: true },
  tribunal: { bpm: 58, scale: DORIAN, prog: [0, 3, 0, 4], pad: 1, bass: 'long', arp: null, lead: 0.2, leadType: 'sine', drums: 0, bell: true, seventh: true },
  apuracao: { bpm: 104, scale: DORIAN, prog: [0, 3, 0, 4], pad: 0.8, bass: 'eighth', arp: 'sixteenth', lead: 0.25, leadType: 'triangle', drums: 1, tick: true },
  vitoria: { bpm: 98, scale: MAJOR, prog: [0, 3, 4, 0], pad: 1, bass: 'walk', arp: 'sixteenth', lead: 0.75, leadType: 'square', drums: 2, pluck: true },
  derrota: { bpm: 60, scale: MINOR, prog: [0, 5, 3, 4], pad: 1, bass: 'long', arp: null, lead: 0.3, leadType: 'sine', drums: 0 },
}
export const THEME_NAMES = Object.keys(THEMES)
let phrase = null
let phraseTheme = ''
const themeNow = () => THEMES[mood.theme] || THEMES.gov
const stepDur = () => 60 / (themeNow().bpm + (mood.theme === 'gov' ? (mood.pop - 50) * 0.18 : 0)) / 4

function ensure() {
  if (ctx) return ctx
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  if (!AC) return null
  ctx = new AC()
  const master = ctx.createGain()
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2600
  musicBus = ctx.createGain()
  sfxBus = ctx.createGain()
  const dly = ctx.createDelay(1)
  dly.delayTime.value = 0.36
  const fb = ctx.createGain()
  fb.gain.value = 0.35
  const wet = ctx.createGain()
  wet.gain.value = 0.28
  musicBus.connect(lp)
  lp.connect(master)
  lp.connect(dly)
  dly.connect(fb)
  fb.connect(dly)
  dly.connect(wet)
  wet.connect(master)
  sfxBus.connect(master)
  master.connect(ctx.destination)
  applyVolumes()
  return ctx
}

function applyVolumes() {
  if (!ctx) return
  const t = ctx.currentTime
  musicBus.gain.setTargetAtTime(settings.music ? settings.volume * 0.22 : 0, t, 0.15)
  sfxBus.gain.setTargetAtTime(settings.sfx ? settings.volume * 0.5 : 0, t, 0.05)
}

function tone(freq, t, dur, { type = 'sine', gain = 0.3, attack = 0.01, release = 0.3, dest = musicBus } = {}) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(gain, t + attack)
  g.gain.setValueAtTime(gain, Math.max(t + attack, t + dur - release))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(dest)
  o.start(t)
  o.stop(t + dur + 0.05)
}

let noiseBuf = null
function noise(t, dur, { type = 'highpass', freq = 6000, gain = 0.1, q = 0.7 } = {}) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const src = ctx.createBufferSource()
  src.buffer = noiseBuf
  const f = ctx.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f)
  f.connect(g)
  g.connect(musicBus)
  src.start(t)
  src.stop(t + dur + 0.02)
}
function kick(t, gain = 0.5) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.frequency.setValueAtTime(130, t)
  o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
  o.connect(g)
  g.connect(musicBus)
  o.start(t)
  o.stop(t + 0.25)
}
const snare = (t, gain = 0.16) => noise(t, 0.14, { type: 'bandpass', freq: 1800, gain, q: 0.9 })
const hat = (t, gain = 0.05) => noise(t, 0.04, { type: 'highpass', freq: 7000, gain })

// Frase melódica: 4 compassos de 16 passos, com o 1º compasso repetido para a melodia "grudar".
function makePhrase(th) {
  const bars = []
  let last = 7
  for (let b = 0; b < 4; b++) {
    if (b === 2 && bars[0] && Math.random() < 0.6) {
      bars.push([...bars[0]])
      continue
    }
    const line = new Array(16).fill(null)
    for (const pos of [0, 3, 6, 8, 10, 12, 14]) {
      if (Math.random() > th.lead * (pos === 0 || pos === 8 ? 1.4 : 1)) continue
      last = Math.max(2, Math.min(13, last + pick([-2, -1, -1, 0, 1, 1, 2])))
      line[pos] = last
    }
    bars.push(line)
  }
  return bars
}

function scheduleStep(t, s) {
  const th = themeNow()
  const minor = mood.theme === 'gov' && mood.pop < 45
  const scale = minor ? th.minor : th.scale
  const prog = minor ? th.progMinor : th.prog
  const root = ROOTS[Math.min(3, Math.max(0, mood.stage))] + (mood.theme === 'menu' ? 3 : 0)
  const d = prog[bar % prog.length]
  const tri = [deg(scale, d), deg(scale, d + 2), deg(scale, d + 4)]
  const ch = th.seventh ? [...tri, deg(scale, d + 6)] : tri
  const sd = stepDur()
  if (phraseTheme !== mood.theme || !phrase) {
    phrase = makePhrase(th)
    phraseTheme = mood.theme
  }
  if (s === 0) {
    for (const n of ch) tone(midi(root + n), t, sd * 16, { type: th.saw ? 'sawtooth' : 'triangle', gain: (th.saw ? 0.05 : 0.14) * th.pad, attack: 1, release: 1.6 })
    if (th.drone || mood.war > 0) tone(midi(root - 24), t, sd * 16, { type: 'sawtooth', gain: 0.06, attack: 1.2, release: 1.8 })
    if (bar % 16 === 15) phrase = makePhrase(th)
  }
  // baixo
  const b0 = root + deg(scale, d) - 12
  if (th.bass === 'long' && s === 0) tone(midi(b0), t, sd * 8, { type: 'sine', gain: 0.3, attack: 0.04, release: 0.8 })
  if (th.bass === 'eighth' && s % 2 === 0) tone(midi(b0 + (s % 8 === 6 ? 7 : 0)), t, sd * 1.8, { type: 'triangle', gain: 0.24, attack: 0.01, release: 0.12 })
  if (th.bass === 'walk' && s % 4 === 0) tone(midi(b0 + [0, 7, 12, 7][(s / 4) % 4]), t, sd * 3.6, { type: 'triangle', gain: 0.26, attack: 0.01, release: 0.15 })
  // arpejo
  if ((th.arp === 'eighth' && s % 2 === 0) || th.arp === 'sixteenth') {
    const k = th.arp === 'eighth' ? s / 2 : s
    tone(midi(root + ch[k % ch.length] + 12), t, sd * 2, { type: 'triangle', gain: 0.07, attack: 0.005, release: 0.4 })
  }
  // acordes picados (campanha e vitória)
  if (th.pluck && (s === 4 || s === 12)) for (const n of tri) tone(midi(root + n + 12), t, sd * 1.5, { type: 'square', gain: 0.025, attack: 0.005, release: 0.2 })
  // estocadas tensas
  if (th.stab && s === 10 && bar % 2 === 1) for (const n of [tri[0], tri[0] + 6, tri[0] + 12]) tone(midi(root + n + 12), t, sd * 1.2, { type: 'sawtooth', gain: 0.03, attack: 0.01, release: 0.4 })
  // sinos do tribunal
  if (th.bell && (s === 0 || s === 8) && Math.random() < 0.6) tone(midi(root + pick(ch) + 24), t, sd * 6, { type: 'sine', gain: 0.1, attack: 0.005, release: 2 })
  // melodia
  const note = phrase[bar % 4][s]
  if (note != null && th.lead > 0) tone(midi(root + deg(scale, note) + 12), t + Math.random() * 0.015, sd * (s % 8 === 0 ? 5 : 3), { type: th.leadType, gain: th.leadType === 'square' ? 0.05 : th.leadType === 'sawtooth' ? 0.045 : 0.11, attack: 0.02, release: 0.5 })
  // percussão
  if (th.drums === 1) {
    if (s === 0 || s === 8) kick(t, 0.28)
    if (s % 4 === 2) hat(t, 0.03)
  } else if (th.drums === 2) {
    if (s % 4 === 0) kick(t, 0.36)
    if (s === 4 || s === 12) snare(t, 0.12)
    if (s % 2 === 0) hat(t, 0.04)
  } else if (th.drums === 3) {
    if (s === 0 || s === 8) kick(t, 0.5)
    if (s === 4 || s === 12 || s === 14 || s === 15) snare(t, 0.14)
  } else if (th.drums === 4) {
    if (s === 0 || s === 5) kick(t, 0.5)
  }
  if (th.tick && s % 2 === 0) hat(t, 0.045)
}

function tick() {
  if (!ctx || ctx.state !== 'running') return
  if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.05
  while (nextT < ctx.currentTime + 0.4) {
    if (settings.music) scheduleStep(nextT, step)
    nextT += stepDur()
    step = (step + 1) % 16
    if (step === 0) bar++
  }
}

// Navegadores só liberam áudio depois de um toque/clique do jogador.
export function unlock() {
  const c = ensure()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  if (!timer) {
    nextT = c.currentTime + 0.1
    timer = setInterval(tick, 120)
  }
}

export function setMood(m) {
  Object.assign(mood, m)
}


const SFX = {
  click: (t) => tone(660, t, 0.07, { type: 'triangle', gain: 0.22, attack: 0.005, release: 0.05, dest: sfxBus }),
  turn: (t) => {
    tone(392, t, 0.25, { type: 'triangle', gain: 0.25, release: 0.2, dest: sfxBus })
    tone(523, t + 0.12, 0.3, { type: 'triangle', gain: 0.25, release: 0.25, dest: sfxBus })
  },
  good: (t) => [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.09, 0.25, { type: 'triangle', gain: 0.25, release: 0.2, dest: sfxBus })),
  bad: (t) => [233, 196].forEach((f, i) => tone(f, t + i * 0.14, 0.3, { type: 'sawtooth', gain: 0.12, release: 0.25, dest: sfxBus })),
  win: (t) => [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.14, 0.5, { type: 'triangle', gain: 0.25, release: 0.4, dest: sfxBus })),
  ring: (t) => [0, 0.16, 0.5, 0.66].forEach((d, i) => tone(i % 2 ? 880 : 740, t + d, 0.12, { type: 'sine', gain: 0.2, release: 0.08, dest: sfxBus })),
  gavel: (t) => {
    tone(150, t, 0.12, { type: 'square', gain: 0.18, release: 0.1, dest: sfxBus })
    tone(150, t + 0.22, 0.2, { type: 'square', gain: 0.2, release: 0.15, dest: sfxBus })
  },
  alert: (t) => [0, 0.22, 0.44].forEach((d, i) => tone(i % 2 ? 620 : 820, t + d, 0.18, { type: 'sawtooth', gain: 0.1, release: 0.1, dest: sfxBus })),
  coin: (t) => [988, 1319].forEach((f, i) => tone(f, t + i * 0.07, 0.2, { type: 'square', gain: 0.1, release: 0.15, dest: sfxBus })),
  vote: (t) => tone(300, t, 0.12, { type: 'square', gain: 0.1, release: 0.1, dest: sfxBus }),
  lose: (t) => [392, 330, 262, 196].forEach((f, i) => tone(f, t + i * 0.2, 0.55, { type: 'triangle', gain: 0.22, release: 0.45, dest: sfxBus })),
}

export function sfx(name) {
  if (!ctx || ctx.state !== 'running' || !settings.sfx || !SFX[name]) return
  SFX[name](ctx.currentTime)
}

watch(settings, applyVolumes, { deep: true })

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  })
}
