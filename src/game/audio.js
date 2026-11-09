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
const mood = { pop: 50, stage: 1, war: 0 }

const midi = (n) => 440 * 2 ** ((n - 69) / 12)
const MAJ = [0, 2, 4, 7, 9]
const MIN = [0, 3, 5, 7, 10]
const CH_MAJ = [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]]
const CH_MIN = [[0, 3, 7], [8, 12, 15], [5, 8, 12], [10, 14, 17]]
const ROOTS = [57, 55, 53, 50] // vereador..presidente: o tom vai ficando mais grave e solene
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const stepDur = () => 60 / (62 + mood.pop * 0.22) / 2

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

function scheduleStep(t, s) {
  const major = mood.pop >= 45
  const root = ROOTS[Math.min(3, Math.max(0, mood.stage))]
  const chord = (major ? CH_MAJ : CH_MIN)[bar % 4]
  const scale = major ? MAJ : MIN
  const sd = stepDur()
  if (s === 0) {
    for (const n of chord) tone(midi(root + n), t, sd * 8, { type: 'triangle', gain: 0.16, attack: 0.9, release: 1.2 })
    tone(midi(root + chord[0] - 12), t, sd * 4, { type: 'sine', gain: 0.28, attack: 0.05, release: 0.6 })
    if (mood.war > 0) tone(midi(root - 24), t, sd * 8, { type: 'sawtooth', gain: 0.07, attack: 1, release: 1.5 })
  }
  if (s % 2 === 0 && Math.random() < 0.7) tone(midi(root + chord[(s / 2) % 3] + 12), t, sd * 2.2, { type: 'triangle', gain: 0.1, release: 0.9 })
  if ((s === 0 || s === 3 || s === 6) && Math.random() < 0.55) {
    tone(midi(root + pick(scale) + (Math.random() < 0.4 ? 24 : 12)), t + Math.random() * 0.03, sd * 3, { type: 'sine', gain: 0.12, attack: 0.02, release: 1.2 })
  }
}

function tick() {
  if (!ctx || ctx.state !== 'running') return
  if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.05
  while (nextT < ctx.currentTime + 0.4) {
    if (settings.music) scheduleStep(nextT, step)
    nextT += stepDur()
    step = (step + 1) % 8
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
