// Cartão de resultado: desenha uma imagem 1080x1350 (boa para stories e feed) só com canvas, sem bibliotecas.
const W = 1080
const H = 1350

function wrap(ctx, text, maxW) {
  const lines = []
  let line = ''
  for (const w of text.split(' ')) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line)
      line = w
    } else line = t
  }
  if (line) lines.push(line)
  return lines
}

function round(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// d = { name, region, title, ok, points, path, stats: [{icon,label,v}], epi, trophies, daily, url }
export function drawCard(canvas, d) {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const good = d.ok
  const accent = good ? '#fbbf24' : '#f87171'

  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, good ? '#1e3a8a' : '#3b1d2a')
  bg.addColorStop(0.55, '#0f172a')
  bg.addColorStop(1, '#070b16')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  // brilho suave atrás do título
  const glow = ctx.createRadialGradient(W / 2, 250, 20, W / 2, 250, 520)
  glow.addColorStop(0, good ? 'rgba(251,191,36,.28)' : 'rgba(248,113,113,.2)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 700)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '600 34px system-ui, sans-serif'
  ctx.fillText(`🏛️  RUMO AO PLANALTO${d.weekly ? '  ·  DESAFIO DA SEMANA' : d.daily ? '  ·  DESAFIO DO DIA' : ''}`, W / 2, 96)

  ctx.fillStyle = '#fff'
  ctx.font = '800 76px system-ui, sans-serif'
  const nl = wrap(ctx, d.name, W - 160).slice(0, 2)
  nl.forEach((l, i) => ctx.fillText(l, W / 2, 214 + i * 84))
  const y0 = 214 + (nl.length - 1) * 84

  ctx.fillStyle = '#94a3b8'
  ctx.font = '500 34px system-ui, sans-serif'
  ctx.fillText(d.region, W / 2, y0 + 56)

  ctx.fillStyle = accent
  ctx.font = '800 58px system-ui, sans-serif'
  const tl = wrap(ctx, d.title, W - 140).slice(0, 2)
  tl.forEach((l, i) => ctx.fillText(l, W / 2, y0 + 150 + i * 66))
  const y1 = y0 + 150 + (tl.length - 1) * 66

  ctx.fillStyle = '#fff'
  ctx.font = '900 150px system-ui, sans-serif'
  ctx.fillText(String(d.points), W / 2, y1 + 160)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '600 32px system-ui, sans-serif'
  ctx.fillText('PONTOS', W / 2, y1 + 206)

  // trajetória
  let y = y1 + 276
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '600 34px system-ui, sans-serif'
  const pl = wrap(ctx, d.path, W - 140).slice(0, 3)
  pl.forEach((l, i) => ctx.fillText(l, W / 2, y + i * 46))
  y += pl.length * 46 + 18

  // números finais
  const n = d.stats.length
  const cw = 150
  const gap = 14
  const total = n * cw + (n - 1) * gap
  d.stats.forEach((s, i) => {
    const x = (W - total) / 2 + i * (cw + gap)
    ctx.fillStyle = 'rgba(255,255,255,.08)'
    round(ctx, x, y, cw, 124, 22)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '40px system-ui, sans-serif'
    ctx.fillText(s.icon, x + cw / 2, y + 48)
    ctx.font = '800 38px system-ui, sans-serif'
    ctx.fillText(String(s.v), x + cw / 2, y + 90)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '500 20px system-ui, sans-serif'
    ctx.fillText(s.label, x + cw / 2, y + 114)
  })
  y += 124 + 56

  // epílogo
  if (d.epi) {
    ctx.fillStyle = '#cbd5e1'
    ctx.font = 'italic 500 32px Georgia, serif'
    const el = wrap(ctx, '“' + d.epi + '”', W - 180).slice(0, 4)
    el.forEach((l, i) => ctx.fillText(l, W / 2, y + i * 44))
  }

  if (d.trophies) {
    ctx.font = '44px system-ui, sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(d.trophies, W / 2, H - 150)
  }

  ctx.fillStyle = 'rgba(255,255,255,.12)'
  ctx.fillRect(120, H - 118, W - 240, 2)
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '700 32px system-ui, sans-serif'
  ctx.fillText('Jogue grátis no navegador', W / 2, H - 66)
  ctx.fillStyle = accent
  ctx.font = '600 28px system-ui, sans-serif'
  ctx.fillText(d.url, W / 2, H - 28)
  return canvas
}

export function cardBlob(d) {
  const c = document.createElement('canvas')
  drawCard(c, d)
  return new Promise((res) => c.toBlob(res, 'image/png'))
}

// Compartilha pelo menu do celular quando dá; senão baixa o arquivo.
export async function shareCard(d, filename = 'rumo-ao-planalto.png') {
  const blob = await cardBlob(d)
  const file = new File([blob], filename, { type: 'image/png' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Rumo ao Planalto', text: `${d.name}: ${d.title} (${d.points} pts)\n${d.url}` })
      return 'shared'
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancel'
    }
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 4000)
  return 'download'
}
