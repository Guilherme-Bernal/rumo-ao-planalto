// Exportar e importar o progresso (save, hall da fama, conquistas e dicas) em um arquivo .json
const PREFIX = 'rumo'

export function exportSave() {
  const data = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(PREFIX)) data[k] = localStorage.getItem(k)
    }
  } catch {}
  return JSON.stringify({ app: 'rumo-ao-planalto', v: 1, exported: new Date().toISOString(), data })
}

export function downloadSave() {
  const blob = new Blob([exportSave()], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `rumo-ao-planalto-save-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export function importSave(text) {
  let obj
  try {
    obj = JSON.parse(text)
  } catch {
    return { ok: false, msg: 'Arquivo inválido: não é um JSON.' }
  }
  if (!obj || obj.app !== 'rumo-ao-planalto' || typeof obj.data !== 'object' || !obj.data) return { ok: false, msg: 'Esse arquivo não é um save do Rumo ao Planalto.' }
  let n = 0
  try {
    for (const [k, v] of Object.entries(obj.data)) {
      if (!k.startsWith(PREFIX) || typeof v !== 'string') continue
      JSON.parse(v) // cada valor precisa ser um JSON válido
      localStorage.setItem(k, v)
      n++
    }
  } catch {
    return { ok: false, msg: 'O arquivo está corrompido.' }
  }
  return n ? { ok: true, msg: 'Save importado! Recarregando...' } : { ok: false, msg: 'O arquivo não tinha dados do jogo.' }
}