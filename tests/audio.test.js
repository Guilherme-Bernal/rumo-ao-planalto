// @vitest-environment node
import { it, expect, vi } from 'vitest'
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }
globalThis.matchMedia = () => ({ matches: false })
let notes = 0
const node = () => new Proxy(function () {}, { get: (t, k) => (k === 'value' ? 0 : k === 'currentTime' ? 0 : (k === 'getChannelData' ? () => new Float32Array(10) : node())), set: () => true, apply: () => node() })
class AC { constructor() { globalThis.__ac = this; this.currentTime = 0; this.state = 'running'; this.sampleRate = 100; this.destination = {} }
  createOscillator() { notes++; return node() } createGain() { return node() } createBiquadFilter() { return node() } createDelay() { return node() } createBuffer() { return { getChannelData: () => new Float32Array(100) } } createBufferSource() { notes++; return node() } resume() {} suspend() {} }
globalThis.window = { AudioContext: AC }
it('todas as trilhas e a troca entre elas tocam sem erro', async () => {
  vi.useFakeTimers()
  const A = await import('../src/game/audio.js')
  A.unlock()
  const { settings } = await import('../src/game/settings.js')
  for (const st of Object.keys(A.STYLE_NAMES)) for (const th of A.THEME_NAMES) {
    settings.musicStyle = st
    A.setMood({ theme: th, pop: th === 'gov' ? 30 : 60, stage: 2, war: 1 })
    const b = notes
    for (let i = 0; i < 400; i++) { globalThis.__ac.currentTime += 0.12; vi.advanceTimersByTime(120) }
    expect(notes, st + th).toBeGreaterThan(b)
  }
})
