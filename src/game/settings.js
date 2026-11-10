import { reactive, watch } from 'vue'

// Configurações do jogador (guardadas no navegador, valem para todos os saves)
const KEY = 'rumo-config'
const mq = (q) => typeof matchMedia === 'function' && matchMedia(q).matches

const DEFAULTS = {
  music: true,
  sfx: true,
  volume: 0.5, // 0 a 1
  musicStyle: 'auto', // auto | bossa | synth | cinema | jazz | ambiente
  quality: 'auto', // auto | high | low (qualidade do 3D)
  fontScale: 1, // 1 | 1.12 | 1.25
  contrast: false,
  reduceMotion: mq('(prefers-reduced-motion: reduce)'),
  difficulty: 'normal', // facil | normal | real (vale para a próxima carreira)
}

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...DEFAULTS }
  }
}

export const settings = reactive(load())

export const DIFFICULTIES = [
  { id: 'facil', name: 'Tranquilo', desc: 'Ganhos um pouco maiores e perdas menores.', gain: 1.15, loss: 0.8 },
  { id: 'normal', name: 'Normal', desc: 'O equilíbrio padrão do jogo.', gain: 1, loss: 1 },
  { id: 'real', name: 'Realista', desc: 'Ganhos menores e perdas maiores. Política é dura.', gain: 0.9, loss: 1.25 },
]
export const difficultyOf = (id) => DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[1]

export function applyDom() {
  if (typeof document === 'undefined') return
  const r = document.documentElement
  r.style.fontSize = Math.round(settings.fontScale * 100) + '%'
  r.classList.toggle('hc', !!settings.contrast)
  r.classList.toggle('rm', !!settings.reduceMotion)
}

watch(
  settings,
  () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {}
    applyDom()
  },
  { deep: true, immediate: true },
)
