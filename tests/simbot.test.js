// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'

// Os bots jogam carreiras inteiras direto no motor. Se qualquer fase do jogo quebrar, o script sai com erro.
describe('bots de simulação', () => {
  it('jogam carreiras completas com todos os estilos sem erro do motor', () => {
    const r = spawnSync('npx', ['vite-node', 'tools/simbot.mjs', '2', 'todos', '11'], { encoding: 'utf8', timeout: 150000, shell: process.platform === 'win32' })
    expect(r.stdout).toContain('erros do motor: 0')
    expect(r.status).toBe(0)
  }, 160000)
  it('modo governo (começa direto no cargo) também roda limpo', () => {
    const r = spawnSync('npx', ['vite-node', 'tools/simbot.mjs', '2', 'equilibrado', '3', 'presidente'], { encoding: 'utf8', timeout: 150000, shell: process.platform === 'win32' })
    expect(r.stdout).toContain('erros do motor: 0')
    expect(r.status).toBe(0)
  }, 160000)
})

