<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { settings } from '../../game/settings'

const props = defineProps({
  pop: { type: Number, default: 50 },
  eco: { type: Number, default: 50 },
  stage: { type: Number, default: 1 },
  office: { type: String, default: '' },
  war: { type: Number, default: 0 },
  cena: { type: String, default: '' },
})

const root = ref(null)
const COUNT = 220
let renderer, scene, camera, sun, people, raf, ro, group, hemi, clouds, smoke, cloudMat
const flags = []
const floaters = []
let frame = 0
// qualidade: ?q=low | ?q=high | automático (aparelho fraco = modo leve)
const qParam = new URLSearchParams(location.search).get('q')
const isMobile = typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches
// qualidade vem do painel de configurações (?q= na URL tem prioridade) e muda ao vivo
const isLow = () => {
  const q = qParam || settings.quality
  return q === 'low' || (q === 'auto' && isMobile && (navigator.deviceMemory || 4) <= 3)
}
const reduced = () => settings.reduceMotion
const rand = []
const home = []
const dummy = new THREE.Object3D()
const sky = new THREE.Color(0x6ab7ff)
const targetSky = new THREE.Color(0x6ab7ff)

// identidade visual de cada cargo
const THEMES = [
  { sky: 0xffcf9e, ground: 0x5a8a3c, sun: 0xfff1d6, cam: { r: 52, h: 16, look: [0, 5, 10] } }, // vereador: fim de tarde na praça
  { sky: 0x6ab7ff, ground: 0x2f5d3a, sun: 0xffffff, cam: { r: 66, h: 22, look: [0, 9, 8] } }, // deputado: Brasília
  { sky: 0xe9c6ff, ground: 0x3f6b46, sun: 0xffe2b8, cam: { r: 58, h: 18, look: [0, 8, 8] } }, // governador: palácio ao entardecer
  { sky: 0x8fd0ff, ground: 0x2c5a3c, sun: 0xffffff, cam: { r: 64, h: 20, look: [0, 7, 6] } }, // presidente: Planalto
]
// ajustes de céu por cargo (quando o cargo tem cara própria)
const THEME_OV = {
  prefeito: { sky: 0xbfe0ff, sun: 0xffffff },
  dep_estadual: { sky: 0xcfe3ff },
  senador: { sky: 0xffd9b8, sun: 0xffe2b8 },
}
// cenas de situação: trocam o cenário enquanto algo especial está acontecendo
const CENA_OV = {
  comicio: { sky: 0xffb86b, sun: 0xffe0b0, ground: 0x5b7f3a, cam: { r: 46, h: 12, look: [0, 6, 8] } },
  tribunal: { sky: 0xcfd8e8, sun: 0xffffff, ground: 0x6b7a63, cam: { r: 56, h: 16, look: [0, 8, 0] } },
  protesto: { sky: 0xb7a99a, sun: 0xffd9b0 },
  apuracao: { sky: 0x1b2347, sun: 0x8fa2d6, ground: 0x1f2c25, cam: { r: 46, h: 12, look: [0, 7, 6] } },
}
const theme = () => ({ ...(THEMES[props.stage] || THEMES[1]), ...(THEME_OV[props.office] || {}), ...(CENA_OV[props.cena] || {}) })
const skyFor = (eco) => new THREE.Color(0x1a2233).lerp(new THREE.Color(theme().sky), Math.min(1, Math.max(0, eco / 100)))
const matCache = new Map()
const mat = (c, extra = {}) => {
  const key = c + JSON.stringify(extra)
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...extra })
    matCache.set(key, m)
  }
  return m
}

function add(geo, material, x, y, z) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
  m.castShadow = !isLow()
  m.receiveShadow = !isLow()
  group.add(m)
  return m
}
const box = (w, h, d, c, x, y, z) => add(new THREE.BoxGeometry(w, h, d), mat(c), x, y, z)
const cyl = (rt, rb, h, c, x, y, z, seg = 16) => add(new THREE.CylinderGeometry(rt, rb, h, seg), mat(c), x, y, z)

function trees(n, zMin, zRange, xMin) {
  const trunk = new THREE.CylinderGeometry(0.2, 0.3, 1.5)
  const leaf = new THREE.ConeGeometry(1.4, 3.5, 8)
  const round = new THREE.SphereGeometry(1.7, 10, 8)
  const trunkM = mat(0x5b3a1e)
  const leafM = mat(0x1f6b3a)
  const roundM = mat(0x3a8a45)
  for (let i = 0; i < n; i++) {
    const x = (Math.random() - 0.5) * 220
    const z = zMin + Math.random() * zRange
    if (Math.abs(x) < xMin) continue
    add(trunk, trunkM, x, 0.75, z)
    if (props.stage === 1) add(leaf, leafM, x, 3, z)
    else add(round, roundM, x, 2.8, z)
  }
}

function flag(x, z, h = 16) {
  cyl(0.12, 0.12, h, 0xdddddd, x, h / 2, z, 8)
  const cloth = new THREE.Group()
  cloth.position.set(x, h - 1.6, z)
  const pano = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 0.1), mat(0x1b8a3c))
  pano.position.x = 2.1
  const d = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.12), mat(0xffd21f))
  d.position.set(2.1, 0, 0.02)
  d.rotation.z = Math.PI / 4
  d.scale.set(0.75, 0.75, 1)
  cloth.add(pano, d)
  group.add(cloth)
  flags.push(cloth)
}

// ---------- cenários ----------
function buildVereador() {
  // praça com fonte, Câmara Municipal modesta e casinhas
  box(34, 0.4, 24, 0xcdbd9a, 0, 0.2, 14) // calçadão
  box(14, 0.5, 14, 0xbfae8a, 0, 0.25, 16)
  cyl(3, 3.2, 0.8, 0xd6d3d1, 0, 0.9, 16, 24)
  cyl(2.5, 2.5, 0.9, 0x3b82c4, 0, 1.0, 16, 24)
  cyl(0.4, 0.5, 3, 0xe7e5e4, 0, 2.3, 16, 12)
  // Câmara Municipal
  box(26, 7, 10, 0xf3e6c8, 0, 3.5, -4)
  box(28, 1, 12, 0xb91c1c, 0, 7.5, -4)
  const roof = add(new THREE.ConeGeometry(9, 4, 4), mat(0xb91c1c), 0, 9.5, -4)
  roof.rotation.y = Math.PI / 4
  roof.scale.set(1.5, 1, 0.7)
  for (let i = -4; i <= 4; i++) cyl(0.5, 0.5, 6, 0xffffff, i * 2.8, 3.2, 1.8, 10)
  box(6, 4.5, 0.4, 0x6b4a2e, 0, 2.3, 1.05)
  // torre da igreja
  box(5, 14, 5, 0xf8f5ee, -26, 7, 4)
  const spire = add(new THREE.ConeGeometry(3.6, 6, 4), mat(0x9a3412), -26, 17, 4)
  spire.rotation.y = Math.PI / 4
  // casinhas coloridas
  const colors = [0xf59e0b, 0x60a5fa, 0xf472b6, 0x34d399, 0xfde68a, 0xfb7185]
  for (let i = 0; i < 14; i++) {
    const side = i % 2 ? 1 : -1
    const z = 30 + Math.floor(i / 2) * 9
    const x = side * (42 + (i % 3) * 4)
    box(6, 4, 6, colors[i % colors.length], x, 2.5, z)
    const r = add(new THREE.ConeGeometry(5, 2.4, 4), mat(0xb45309), x, 5.2, z)
    r.rotation.y = Math.PI / 4
  }
  // bancos e postes
  for (let i = 0; i < 6; i++) {
    const x = -12 + i * 4.8
    box(2, 0.3, 0.7, 0x78350f, x, 0.9, 24)
    cyl(0.1, 0.1, 5, 0x374151, x + 2, 2.5, 21, 8)
    add(new THREE.SphereGeometry(0.35), mat(0xfff7c2, { emissive: 0xffe58a, emissiveIntensity: 0.9 }), x + 2, 5.2, 21)
  }
  trees(60, 26, 100, 20)
}

function buildDeputado() {
  const path = add(new THREE.PlaneGeometry(22, 200), mat(0xbfae8a), 0, 0.02, 110)
  path.rotation.x = -Math.PI / 2
  const pool = add(new THREE.PlaneGeometry(12, 40), mat(0x3b82c4, { roughness: 0.2 }), 0, 0.05, 60)
  pool.rotation.x = -Math.PI / 2
  const white = mat(0xf2f1ee)
  add(new THREE.BoxGeometry(30, 1.2, 11), mat(0xd6d3d1), 0, 0.6, 0)
  add(new THREE.BoxGeometry(3.4, 19, 3.4), white, -2.4, 10.5, -3)
  add(new THREE.BoxGeometry(3.4, 19, 3.4), white, 2.4, 10.5, -3)
  add(new THREE.BoxGeometry(1.6, 1, 3), white, 0, 17, -3)
  add(new THREE.BoxGeometry(1.6, 1, 3), white, 0, 12, -3)
  const dome = add(new THREE.SphereGeometry(5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), white, -9, 1.2, 1)
  dome.scale.y = 0.9
  const bowl = add(new THREE.SphereGeometry(5.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), white, 9, 4.2, 1)
  bowl.rotation.x = Math.PI
  add(new THREE.CylinderGeometry(5.5, 5.5, 3, 28), mat(0xe7e5e4), 9, 2.7, 1)
  const blockMat = mat(0xe5e7eb)
  for (let i = 0; i < 8; i++) for (const side of [-1, 1]) add(new THREE.BoxGeometry(6, 5, 9), blockMat, side * 28, 2.5, 22 + i * 13)
  trees(70, 15, 150, 36)
}

function buildGovernador() {
  // palácio neoclássico, jardim, avenida e prédios ao fundo
  const road = add(new THREE.PlaneGeometry(14, 200), mat(0x4b5563), 0, 0.03, 110)
  road.rotation.x = -Math.PI / 2
  const lawn = add(new THREE.PlaneGeometry(60, 28), mat(0x4f9a53), 0, 0.04, 14)
  lawn.rotation.x = -Math.PI / 2
  box(40, 10, 12, 0xf5e9c9, 0, 5, -6)
  box(44, 1.2, 14, 0xe7d9b0, 0, 10.6, -6)
  box(14, 12, 4, 0xfaf0d6, 0, 6, 1)
  const ped = add(new THREE.ConeGeometry(8.5, 4, 3), mat(0xf5e9c9), 0, 14, 1.2)
  ped.rotation.y = Math.PI / 2
  ped.scale.set(1, 1, 0.3)
  for (let i = -3; i <= 3; i++) cyl(0.55, 0.55, 10, 0xffffff, i * 2.3, 5, 3.4, 12)
  add(new THREE.SphereGeometry(4, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x7ca2a0), 0, 11.2, -6)
  for (let i = 0; i < 5; i++) box(1.4, 3.2, 0.3, 0x5b8dc9, -16 + i * 8, 5, 0.1)
  for (const x of [-26, 26]) flag(x, 6, 18)
  // sebes
  for (let i = 0; i < 10; i++) for (const sx of [-1, 1]) box(4, 1.2, 1.2, 0x2d6a3a, sx * (8 + i * 2.6), 0.6, 12)
  // fonte central
  cyl(4, 4.2, 0.8, 0xd6d3d1, 0, 0.5, 18, 24)
  cyl(3.4, 3.4, 0.9, 0x3b82c4, 0, 0.6, 18, 24)
  // cidade ao fundo (esquerda e direita da avenida)
  for (let i = 0; i < 18; i++) {
    const side = i % 2 ? 1 : -1
    const h = 8 + ((i * 37) % 22)
    box(8, h, 8, [0x94a3b8, 0xcbd5e1, 0x9ca3af, 0xe2e8f0][i % 4], side * (40 + (i % 3) * 5), h / 2, 36 + Math.floor(i / 2) * 11)
  }
  trees(50, 28, 110, 28)
}

function buildPresidente() {
  // Planalto: caixa branca sobre ramada de colunas, espelho d'água, bandeira e Congresso ao fundo
  const white = mat(0xf7f7f5)
  const pool = add(new THREE.PlaneGeometry(40, 12), mat(0x4aa0d9, { roughness: 0.15 }), 0, 0.06, 44)
  pool.rotation.x = -Math.PI / 2
  const ramp = add(new THREE.BoxGeometry(8, 0.4, 22), mat(0xd6d3d1), 0, 0.4, 4)
  ramp.rotation.x = -0.05
  add(new THREE.BoxGeometry(34, 8, 12), white, 0, 7, -6)
  add(new THREE.BoxGeometry(38, 1, 14), white, 0, 11.5, -6)
  box(34, 6, 11, 0x5aa6d8, 0, 3.4, -6) // vidros
  for (let i = -8; i <= 8; i++) add(new THREE.CylinderGeometry(0.25, 0.25, 12, 8), white, i * 2.2, 5.8, 1.6)
  box(40, 0.8, 4.5, 0xf0efec, 0, 0.5, 1)
  flag(-22, 12, 20)
  // Congresso ao fundo
  const back = -45
  box(24, 1, 8, 0xd6d3d1, 30, 0.5, back)
  add(new THREE.BoxGeometry(3, 15, 3), white, 28, 8.5, back - 2)
  add(new THREE.BoxGeometry(3, 15, 3), white, 32, 8.5, back - 2)
  add(new THREE.SphereGeometry(4, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), white, 21, 1, back)
  const bowl = add(new THREE.SphereGeometry(4.2, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), white, 40, 3.5, back)
  bowl.rotation.x = Math.PI
  // guardas de honra
  for (let i = 0; i < 12; i++) {
    box(0.7, 1.9, 0.7, 0x1e3a8a, -10 + i * 1.8, 1.4, 14)
    add(new THREE.SphereGeometry(0.35), mat(0xf1d3b3), -10 + i * 1.8, 2.7, 14)
  }
  trees(40, 20, 120, 42)
}

function car(x, z, c, ry = 0) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 1.7), mat(c))
  body.position.y = 0.7
  const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.7, 1.5), mat(0x1f2937))
  top.position.set(-0.2, 1.4, 0)
  g.add(body, top)
  g.position.set(x, 0, z)
  g.rotation.y = ry
  g.traverse((o) => { o.castShadow = !isLow() })
  group.add(g)
}

function buildPrefeito() {
  // praça + Paço Municipal com torre do relógio, bandeiras e carros oficiais
  buildVereador()
  box(5, 20, 5, 0xf3e6c8, 19, 10, 0)
  box(6, 1, 6, 0xb91c1c, 19, 20.5, 0)
  const spire = add(new THREE.ConeGeometry(3.4, 4.5, 4), mat(0xb91c1c), 19, 23.2, 0)
  spire.rotation.y = Math.PI / 4
  cyl(1.7, 1.7, 0.3, 0xffffff, 19, 16, 2.6, 24).rotation.x = Math.PI / 2
  flag(-22, 8, 15)
  flag(-30, 8, 15)
  car(-8, 27, 0x111827)
  car(8, 28, 0xe5e7eb, Math.PI)
}

function buildAssembleia() {
  // Assembleia Legislativa: rotunda com cúpula, alas laterais, escadaria e avenida
  const road = add(new THREE.PlaneGeometry(14, 200), mat(0x4b5563), 0, 0.03, 110)
  road.rotation.x = -Math.PI / 2
  const lawn = add(new THREE.PlaneGeometry(64, 30), mat(0x4f9a53), 0, 0.04, 16)
  lawn.rotation.x = -Math.PI / 2
  box(18, 1, 12, 0xd6d3d1, 0, 0.5, 4)
  cyl(9, 9, 9, 0xeee8d8, 0, 5, -4, 36)
  const dome = add(new THREE.SphereGeometry(9, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xaab9c4, { roughness: 0.35 }), 0, 9.5, -4)
  dome.scale.y = 0.85
  cyl(1.2, 1.5, 3, 0xeee8d8, 0, 17.4, -4, 16)
  box(18, 6.5, 9, 0xe7dfc9, -17, 3.7, -4)
  box(18, 6.5, 9, 0xe7dfc9, 17, 3.7, -4)
  for (let i = 0; i < 9; i++) {
    const a = -1.25 + (i * 2.5) / 8
    cyl(0.5, 0.5, 8, 0xffffff, Math.sin(a) * 9.8, 5, -4 + Math.cos(a) * 9.8, 10)
  }
  box(14, 0.5, 4, 0xe7e5e4, 0, 0.7, 6.5)
  flag(-14, 9, 15)
  flag(14, 9, 15)
  cyl(3.4, 3.6, 0.7, 0xd6d3d1, 0, 0.5, 20, 24)
  cyl(2.8, 2.8, 0.8, 0x3b82c4, 0, 0.6, 20, 24)
  for (let i = 0; i < 12; i++) {
    const side = i % 2 ? 1 : -1
    const h = 7 + ((i * 29) % 15)
    box(7, h, 7, [0x94a3b8, 0xcbd5e1, 0xe2e8f0][i % 3], side * (38 + (i % 3) * 5), h / 2, 34 + Math.floor(i / 2) * 11)
  }
  car(-4, 60, 0x111827, Math.PI / 2)
  trees(45, 26, 110, 26)
}

function buildSenado() {
  // Congresso Nacional com a cúpula do Senado em destaque e bandeiras
  buildDeputado()
  flag(-19, 9, 18)
  flag(19, 9, 18)
}

const SET_BY_OFFICE = {
  vereador: buildVereador,
  prefeito: buildPrefeito,
  dep_estadual: buildAssembleia,
  dep_federal: buildDeputado,
  senador: buildSenado,
  governador: buildGovernador,
  presidente: buildPresidente,
}
// ---------- cenas de situação ----------
function balloon(x, y, z, c) {
  const b = add(new THREE.SphereGeometry(0.9, 12, 10), mat(c), x, y, z)
  b.scale.y = 1.2
  b.userData = { y0: y, ph: Math.random() * 6.28 }
  floaters.push(b)
}
function buildComicio() {
  // palanque de campanha ao entardecer, com telão, torres de luz, balões e bandeirolas
  box(40, 0.4, 30, 0xcdbd9a, 0, 0.2, 14)
  box(24, 2, 10, 0x7c2d12, 0, 1.2, -2)
  box(22, 0.3, 8, 0xf5e6c8, 0, 2.35, -2)
  box(24, 11, 0.6, 0x1d4ed8, 0, 8, -7)
  box(20, 7, 0.4, 0xfacc15, 0, 8, -6.6)
  box(14, 1.6, 0.3, 0x1d4ed8, 0, 10, -6.3)
  box(10, 1.6, 0.3, 0x16a34a, 0, 7, -6.3)
  const lamp = mat(0xfff7c2, { emissive: 0xffe58a, emissiveIntensity: 1.2 })
  for (const x of [-16, 16]) {
    cyl(0.4, 0.5, 14, 0x374151, x, 7, -2, 8)
    add(new THREE.BoxGeometry(4, 2.4, 1), lamp, x, 14.5, -1.5)
  }
  const cores = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e, 0xf472b6]
  for (let i = 0; i < 16; i++) balloon(-18 + i * 2.4, 5 + (i % 3) * 1.5, 4 + (i % 4) * 0.8, cores[i % cores.length])
  for (let i = 0; i < 18; i++) box(1.2, 0.8, 0.1, cores[i % cores.length], -20 + i * 2.35, 12 + Math.sin(i * 0.7) * 0.5, 22)
  cyl(0.15, 0.15, 12, 0x9ca3af, -20, 6, 22, 8)
  cyl(0.15, 0.15, 12, 0x9ca3af, 22, 6, 22, 8)
  flag(-14, -6, 15)
  flag(14, -6, 15)
  trees(40, 30, 90, 30)
}
function buildTribunal() {
  // fachada de tribunal: escadaria, colunas, frontão e a estátua da Justiça
  const stone = mat(0xe7e2d6)
  box(60, 0.4, 60, 0xd6cfc0, 0, 0.2, 18)
  for (let i = 0; i < 5; i++) box(36 - i * 1.5, 0.6, 5, 0xddd6c5, 0, 0.5 + i * 0.6, 14 - i * 2.2)
  box(34, 1, 18, 0xd6cfc0, 0, 3.7, -4)
  for (let i = -6; i <= 6; i++) cyl(1.1, 1.1, 14, 0xf4f1ea, i * 2.5, 11.2, 3, 16)
  box(36, 2, 18, 0xe7e2d6, 0, 19, -3)
  const tri = new THREE.Shape()
  tri.moveTo(-18, 0)
  tri.lineTo(18, 0)
  tri.lineTo(0, 6)
  tri.closePath()
  add(new THREE.ExtrudeGeometry(tri, { depth: 2, bevelEnabled: false }), stone, 0, 20, 4)
  box(30, 14, 10, 0xcfc8b8, 0, 11, -12)
  box(6, 8, 0.6, 0x3b2a1a, 0, 7.8, 5.8)
  // estátua da Justiça na praça
  cyl(1.6, 1.8, 3, 0xbfb8a8, 0, 1.8, 24, 12)
  cyl(0.6, 0.8, 4, 0x6b7280, 0, 5.2, 24, 12)
  add(new THREE.SphereGeometry(0.6, 12, 10), mat(0x6b7280), 0, 7.6, 24)
  box(5, 0.18, 0.18, 0x9ca3af, 0, 6.9, 24)
  for (const x of [-2.4, 2.4]) {
    add(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 14), mat(0xd4af37), x, 6.2, 24)
  }
  flag(-24, 6, 17)
  flag(24, 6, 17)
  trees(40, 30, 90, 26)
}
function buildApuracao() {
  // noite de apuração: telão gigante com as barras e a multidão olhando
  box(50, 0.4, 36, 0x2a3140, 0, 0.2, 14)
  box(36, 20, 1.2, 0x0f172a, 0, 13, -10)
  const glow = (c) => mat(c, { emissive: c, emissiveIntensity: 1.1 })
  const bars = [[-9, 11, 0x3b82f6], [-3, 8, 0xef4444], [3, 5, 0xfacc15], [9, 3, 0x22c55e]]
  for (const [x, h, c] of bars) add(new THREE.BoxGeometry(4, h, 0.4), glow(c), x, 4.5 + h / 2, -9.2)
  box(30, 0.5, 0.3, 0xf8fafc, 0, 4.2, -9.2)
  const lamp = glow(0xfff1c2)
  for (const x of [-22, 22]) {
    cyl(0.4, 0.5, 16, 0x374151, x, 8, -4, 8)
    add(new THREE.BoxGeometry(4, 2, 1), lamp, x, 16.5, -3.5)
  }
  const cores = [0xef4444, 0x3b82f6, 0xfacc15, 0x22c55e]
  for (let i = 0; i < 14; i++) balloon(-16 + i * 2.5, 4 + (i % 3) * 1.6, 3 + (i % 4), cores[i % 4])
  trees(30, 30, 90, 30)
}
// protesto: o cenário normal do cargo, com cartazes, tambores em chamas e fumaça
function protestOverlay() {
  const sign = [0xffffff, 0xfde68a, 0xfca5a5, 0x93c5fd]
  for (let i = 0; i < 26; i++) {
    const x = -22 + (i % 13) * 3.6 + (i > 12 ? 1.5 : 0)
    const z = 8 + (i > 12 ? 5 : 0)
    cyl(0.07, 0.07, 3.2, 0x78350f, x, 1.6, z, 6)
    box(2, 1.3, 0.1, sign[i % sign.length], x, 3.6, z)
  }
  for (const x of [-10, 10]) {
    cyl(0.8, 0.8, 1.3, 0x374151, x, 0.65, 6, 12)
    const f = add(new THREE.SphereGeometry(0.7, 10, 8), mat(0xf97316, { emissive: 0xea580c, emissiveIntensity: 1.4 }), x, 1.8, 6)
    f.userData = { y0: 1.8, ph: Math.random() * 6.28 }
    floaters.push(f)
  }
}
const CENA_SET = { comicio: buildComicio, tribunal: buildTribunal, apuracao: buildApuracao }
const SETS = [buildVereador, buildDeputado, buildGovernador, buildPresidente]
const setFor = () => SET_BY_OFFICE[props.office] || SETS[props.stage] || buildDeputado

function clearGroup() {
  if (!group) return
  group.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
  })
  matCache.forEach((m) => m.dispose())
  matCache.clear()
  flags.length = 0
  floaters.length = 0
  scene.remove(group)
}

function buildSet() {
  clearGroup()
  group = new THREE.Group()
  scene.add(group)
  const g = add(new THREE.PlaneGeometry(500, 500), mat(theme().ground), 0, 0, 0)
  g.rotation.x = -Math.PI / 2
  ;(CENA_SET[props.cena] || setFor())()
  if (props.cena === 'protesto') protestOverlay()
  if (sun) sun.color.set(theme().sun)
  applyEco()
  sky.copy(targetSky)
  scene.background.copy(sky)
  scene.fog.color.copy(sky)
}

function paintPeople() {
  const c = new THREE.Color()
  for (let i = 0; i < COUNT; i++) {
    c.set(rand[i] < props.pop / 100 ? 0x4ade80 : 0xf87171)
    people.setColorAt(i, c)
  }
  people.instanceColor.needsUpdate = true
}

function applyEco() {
  // economia clareia o céu; popularidade baixa deixa tudo mais cinzento
  const gloom = Math.max(0, 1 - props.pop / 60)
  targetSky.copy(skyFor(props.eco)).lerp(new THREE.Color(0x4a5160), gloom * 0.35)
  if (sun) sun.intensity = (0.5 + (props.eco / 100) * 0.9) * (1 - gloom * 0.25)
  if (hemi) hemi.intensity = 0.75 - gloom * 0.2
  if (cloudMat) cloudMat.color.set(0xffffff).lerp(new THREE.Color(0x8b93a1), Math.max(0, 1 - props.eco / 70) * 0.8)
}

function build() {
  scene = new THREE.Scene()
  scene.background = sky.clone()
  scene.fog = new THREE.Fog(sky.clone(), 80, 220)
  hemi = new THREE.HemisphereLight(0xffffff, 0x334455, 0.75)
  scene.add(hemi)
  sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(30, 50, 30)
  sun.castShadow = !isLow()
  sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048)
  const sc = sun.shadow.camera
  sc.left = -70; sc.right = 70; sc.top = 70; sc.bottom = -70; sc.near = 5; sc.far = 160
  sun.shadow.bias = -0.0005
  sun.shadow.normalBias = 0.05
  scene.add(sun)

  // nuvens que passam devagar
  cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: false })
  clouds = new THREE.Group()
  for (let i = 0; i < 9; i++) {
    const c = new THREE.Group()
    for (let k = 0; k < 4; k++) {
      const part = new THREE.Mesh(new THREE.SphereGeometry(4 + Math.random() * 3, 10, 8), cloudMat)
      part.position.set(k * 5 - 8, Math.random() * 2, Math.random() * 3)
      part.scale.y = 0.55
      c.add(part)
    }
    c.position.set(-150 + i * 38, 62 + (i % 3) * 10, -110 - (i % 4) * 25)
    clouds.add(c)
  }
  scene.add(clouds)

  // fumaça de guerra no horizonte
  smoke = new THREE.Group()
  const smokeMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 1, transparent: true, opacity: 0.6 })
  for (let i = 0; i < 9; i++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 6), smokeMat.clone())
    puff.userData = { ph: Math.random() * 30, x: -70 + (i % 3) * 70 + Math.random() * 10, z: -75 - Math.random() * 15 }
    smoke.add(puff)
  }
  smoke.visible = false
  scene.add(smoke)

  people = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.28, 0.7, 4, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), COUNT)
  people.castShadow = !isLow()
  for (let i = 0; i < COUNT; i++) {
    rand.push(Math.random())
    home.push({ x: (Math.random() - 0.5) * 20, z: 9 + Math.random() * 22, ph: Math.random() * 6.28 })
  }
  scene.add(people)
  paintPeople()
  buildSet()
}

// aplica a qualidade escolhida: sombras, resolução e materiais
function applyQuality() {
  if (!renderer) return
  const low = isLow()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1 : 2))
  renderer.shadowMap.enabled = !low
  if (sun) sun.castShadow = !low
  if (people) people.castShadow = !low
  if (group) group.traverse((o) => { if (o.isMesh) { o.castShadow = !low; o.receiveShadow = !low } })
  scene.traverse((o) => { if (o.material) o.material.needsUpdate = true })
  resize()
}

function resize() {
  if (!root.value || !renderer) return
  const w = root.value.clientWidth
  const h = root.value.clientHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  // no desktop, desloca o enquadramento para o centro da área livre entre os painéis
  lastShift = null
  applyOffset(w, h)
  camera.updateProjectionMatrix()
}

// mede os painéis de verdade (largura muda com a tela) e centraliza a cena no espaço livre
let lastShift = null
function applyOffset(w = root.value.clientWidth, h = root.value.clientHeight) {
  let shift = 0
  if (w > 900) {
    const l = document.querySelector('.hud .stats')
    const r = document.querySelector('.hud .main')
    const lw = l ? l.getBoundingClientRect().width : 0
    const rw = r ? r.getBoundingClientRect().width : 0
    shift = l && r ? Math.round((rw - lw) / 2) : 0
  }
  if (shift === lastShift) return
  lastShift = shift
  if (shift) camera.setViewOffset(w, h, shift, 0, w, h)
  else camera.clearViewOffset()
  camera.updateProjectionMatrix()
}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ antialias: !isLow() })
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  root.value.appendChild(renderer.domElement)
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 600)
  build()
  applyQuality()
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(root.value)

  const clock = new THREE.Clock()
  const loop = () => {
    raf = requestAnimationFrame(loop)
    const t = clock.getElapsedTime()
    const cam = theme().cam
    const a = reduced() ? 0 : Math.sin(t * 0.12) * 0.45
    camera.position.set(Math.sin(a) * cam.r, cam.h + (reduced() ? 0 : Math.sin(t * 0.2) * 1.5), Math.cos(a) * cam.r + 16)
    camera.lookAt(...cam.look)

    if (++frame % 30 === 0) applyOffset()
    sky.lerp(targetSky, 0.03)
    scene.background.copy(sky)
    scene.fog.color.copy(sky)

    if (!reduced()) {
      for (const f of flags) f.rotation.y = Math.sin(t * 2 + f.position.x) * 0.18
      for (const b of floaters) b.position.y = b.userData.y0 + Math.sin(t * 1.4 + b.userData.ph) * 0.5
      for (const c of clouds.children) {
        c.position.x += 0.012
        if (c.position.x > 170) c.position.x = -170
      }
    }
    smoke.visible = props.war > 0
    if (smoke.visible) {
      const n = Math.min(smoke.children.length, 3 + props.war * 3)
      smoke.children.forEach((p, i) => {
        p.visible = i < n
        const k = ((t * 1.5 + p.userData.ph) % 30) / 30
        p.position.set(p.userData.x + k * 6, 2 + k * 28, p.userData.z)
        p.scale.setScalar(1 + k * 2.2)
        p.material.opacity = 0.6 * (1 - k)
      })
    }

    const happy = props.pop / 100
    for (let i = 0; i < COUNT; i++) {
      const p = home[i]
      const joy = rand[i] < happy
      const y = 0.65 + (joy ? Math.abs(Math.sin(t * 3 + p.ph)) * 0.35 : Math.sin(t * 8 + p.ph) * 0.02)
      dummy.position.set(p.x + (joy ? 0 : Math.sin(t * 6 + p.ph) * 0.04), y, p.z)
      dummy.updateMatrix()
      people.setMatrixAt(i, dummy.matrix)
    }
    people.instanceMatrix.needsUpdate = true
    renderer.render(scene, camera)
  }
  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro && ro.disconnect()
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
  }
})

watch(() => props.pop, () => { if (people) paintPeople(); applyEco() })
watch(() => props.eco, applyEco)
watch(() => settings.quality, applyQuality)
watch(() => [props.stage, props.office, props.cena], () => scene && buildSet())
</script>

<template>
  <div ref="root" class="scene"></div>
</template>