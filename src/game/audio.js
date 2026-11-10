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
  wet.gain.value = 0.14
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

function tone(freq, t, dur, { type = 'sine', gain = 0.3, attack = 0.01, release = 0.3, dest = musicBus, lp = 0, detune = 0 } = {}) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  if (detune) o.detune.value = detune
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(gain, t + attack)
  g.gain.setValueAtTime(gain, Math.max(t + attack, t + dur - release))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  if (lp) {
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = lp
    o.connect(f)
    f.connect(g)
  } else o.connect(g)
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

// ---------- estilos: cada um toca a mesma harmonia (escala + progressão da trilha) com outros instrumentos ----------
export const STYLE_NAMES = { auto: 'Automático (muda com a situação)', bossa: 'Bossa e samba', synth: 'Synthwave', cinema: 'Cinematográfico', jazz: 'Jazz de salão', ambiente: 'Ambiente (calmo)' }
const AUTO_STYLE = { menu: 'ambiente', gov: 'bossa', campanha: 'synth', apuracao: 'synth', crise: 'cinema', guerra: 'cinema', tribunal: 'jazz', vitoria: 'bossa', derrota: 'ambiente' }
const styleNow = () => (settings.musicStyle && settings.musicStyle !== 'auto' ? settings.musicStyle : AUTO_STYLE[mood.theme] || 'bossa')

function harmony(th) {
  const minor = mood.theme === 'gov' && mood.pop < 45
  const scale = minor ? th.minor : th.scale
  const prog = minor ? th.progMinor : th.prog
  const root = ROOTS[Math.min(3, Math.max(0, mood.stage))] + (mood.theme === 'menu' ? 3 : 0)
  const d = prog[bar % prog.length]
  return { scale, root, d, c7: [deg(scale, d), deg(scale, d + 2), deg(scale, d + 4), deg(scale, d + 6)] }
}
function lead(th, h, t, s, sd, opts) {
  const note = phrase[bar % 4][s]
  if (note == null || th.lead <= 0) return
  tone(midi(h.root + deg(h.scale, note) + 12), t + Math.random() * 0.012, sd * (s % 8 === 0 ? 5 : 3), opts)
}

const STYLE = {
  // violão de bossa, baixo sincopado, chocalho e aro: leve e brasileiro
  bossa(th, h, t, s, sd) {
    const bs = [0, 6, 8, 14]
    if (bs.includes(s)) tone(midi(h.root + h.c7[s === 6 || s === 14 ? 2 : 0] - 12), t, sd * 3.2, { type: 'triangle', gain: 0.26, release: 0.2 })
    if ([0, 3, 6, 10, 12].includes(s)) for (const n of h.c7.slice(1)) tone(midi(h.root + n), t + (n % 3) * 0.006, sd * 2.4, { type: 'triangle', gain: 0.045, attack: 0.004, release: 0.3 })
    if (th.drums) {
      if (s % 2 === 0) noise(t, 0.035, { type: 'highpass', freq: 8000, gain: s % 4 === 2 ? 0.035 : 0.02 })
      if ([3, 6, 10, 12].includes(s)) noise(t, 0.05, { type: 'bandpass', freq: 2600, gain: 0.05, q: 1.2 })
      if (s === 0 || s === 8) kick(t, 0.22)
    }
    lead(th, h, t, s, sd, { type: 'sine', gain: 0.1, attack: 0.04, release: 0.6 })
  },
  // synthwave: baixo serrilhado em colcheias, arpejo quadrado, caixa grande
  synth(th, h, t, s, sd) {
    if (s === 0) for (const n of h.c7.slice(0, 3)) { tone(midi(h.root + n), t, sd * 16, { type: 'sawtooth', gain: 0.05, attack: 0.3, release: 1.2, lp: 900 }); tone(midi(h.root + n), t, sd * 16, { type: 'sawtooth', gain: 0.04, attack: 0.3, release: 1.2, lp: 900, detune: 9 }) }
    if (s % 2 === 0) tone(midi(h.root + h.c7[0] - 12 + (s % 8 === 6 ? 12 : 0)), t, sd * 1.8, { type: 'sawtooth', gain: 0.16, attack: 0.005, release: 0.1, lp: 500 })
    tone(midi(h.root + h.c7[(s >> 1) % 4] + 12), t, sd * 1.4, { type: 'square', gain: 0.025, attack: 0.003, release: 0.15, lp: 3200 })
    if (th.drums) {
      if (s % 4 === 0) kick(t, 0.42)
      if (s === 4 || s === 12) { snare(t, 0.2); noise(t, 0.3, { type: 'highpass', freq: 3000, gain: 0.05 }) }
      if (s % 4 === 2) hat(t, 0.05)
    }
    lead(th, h, t, s, sd, { type: 'sawtooth', gain: 0.045, attack: 0.01, release: 0.4, lp: 2200 })
  },
  // cordas lentas, tímpanos graves, metais na guerra: trilha de filme
  cinema(th, h, t, s, sd) {
    if (s === 0) {
      for (const n of h.c7.slice(0, 3)) {
        tone(midi(h.root + n - 12), t, sd * 16, { type: 'sawtooth', gain: 0.05, attack: 2, release: 2, lp: 600 })
        tone(midi(h.root + n), t, sd * 16, { type: 'sawtooth', gain: 0.03, attack: 2.4, release: 2, lp: 800, detune: 7 })
      }
      tone(midi(h.root + h.c7[0] - 24), t, sd * 16, { type: 'sine', gain: 0.3, attack: 0.6, release: 2 })
    }
    if ((mood.theme === 'guerra' || mood.theme === 'crise') && (s === 0 || s === 8 || (mood.theme === 'guerra' && s === 14))) kick(t, 0.65)
    if (mood.theme === 'guerra' && s % 4 === 0) tone(midi(h.root + h.c7[s % 8 ? 2 : 0]), t, sd * 3, { type: 'sawtooth', gain: 0.05, attack: 0.05, release: 0.4, lp: 1100 })
    if (mood.theme === 'vitoria' && s % 8 === 0) tone(midi(h.root + h.c7[s ? 2 : 0] + 12), t, sd * 6, { type: 'sawtooth', gain: 0.05, attack: 0.06, release: 0.8, lp: 1600 })
    if (th.drums === 3 && (s === 4 || s === 12 || s === 15)) snare(t, 0.13)
    lead(th, h, t, s, sd, { type: 'triangle', gain: 0.07, attack: 0.05, release: 1.4 })
  },
  // contrabaixo andando, vassourinha, acordes com nonas: bar de jazz
  jazz(th, h, t, s, sd) {
    if (s % 4 === 0) tone(midi(h.root + deg(h.scale, h.d + [0, 2, 4, 5][(s / 4) % 4]) - 12), t, sd * 3.6, { type: 'triangle', gain: 0.3, attack: 0.01, release: 0.18 })
    if (s === 3 || s === 10) for (const n of [...h.c7.slice(1), deg(h.scale, h.d + 8)]) tone(midi(h.root + n), t, sd * 2.2, { type: 'triangle', gain: 0.05, attack: 0.004, release: 0.35 })
    if (th.drums) {
      if ([0, 4, 6, 8, 12, 14].includes(s)) noise(t, 0.06, { type: 'highpass', freq: 6500, gain: s % 4 === 0 ? 0.045 : 0.03 })
      if (s === 4 || s === 12) noise(t, 0.12, { type: 'bandpass', freq: 1500, gain: 0.05, q: 0.7 })
    }
    lead(th, h, t, s, sd, { type: 'triangle', gain: 0.1, attack: 0.006, release: 0.7 })
  },
  // quase só textura: notas longas e sinos esparsos
  ambiente(th, h, t, s, sd) {
    if (s === 0) {
      for (const n of [h.c7[0], h.c7[2]]) tone(midi(h.root + n), t, sd * 16, { type: 'sine', gain: 0.09, attack: 2.2, release: 2.4 })
      tone(midi(h.root + h.c7[0] - 24), t, sd * 16, { type: 'sine', gain: 0.18, attack: 1.5, release: 2.4 })
    }
    if ((s === 0 || s === 6 || s === 10) && Math.random() < 0.35) tone(midi(h.root + deg(h.scale, h.d + [0, 2, 4, 7][Math.floor(Math.random() * 4)]) + 24), t, sd * 6, { type: 'sine', gain: 0.07, attack: 0.01, release: 2.2 })
  },
}

function scheduleStep(t, s) {
  const th = themeNow()
  const h = harmony(th)
  const sd = stepDur()
  if (phraseTheme !== mood.theme || !phrase) {
    phrase = makePhrase(th)
    phraseTheme = mood.theme
  }
  if (s === 0 && bar % 16 === 15) phrase = makePhrase(th)
  if (s === 0 && (th.drone || mood.war > 0)) tone(midi(h.root - 24), t, sd * 16, { type: 'sawtooth', gain: 0.05, attack: 1.2, release: 1.8, lp: 400 })
  if (th.tick && s % 2 === 0) hat(t, 0.04)
  ;(STYLE[styleNow()] || STYLE.bossa)(th, h, t, s, sd)
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
