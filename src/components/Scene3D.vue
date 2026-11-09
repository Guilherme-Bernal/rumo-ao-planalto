<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  pop: { type: Number, default: 50 },
  eco: { type: Number, default: 50 },
  stage: { type: Number, default: 1 },
})

const root = ref(null)
const COUNT = 220
let renderer, scene, camera, sun, people, raf, ro, group, hemi
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
const theme = () => THEMES[props.stage] || THEMES[1]
const skyFor = (eco) => new THREE.Color(0x1a2233).lerp(new THREE.Color(theme().sky), Math.min(1, Math.max(0, eco / 100)))
const mat = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, ...extra })

function add(geo, material, x, y, z) {
  const m = new THREE.Mesh(geo, material)
  m.position.set(x, y, z)
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
  box(4.2, 2.8, 0.1, 0x1b8a3c, x + 2.2, h - 1.6, z)
  const d = add(new THREE.BoxGeometry(2, 2, 0.12), mat(0xffd21f), x + 2.2, h - 1.6, z + 0.02)
  d.rotation.z = Math.PI / 4
  d.scale.set(0.75, 0.75, 1)
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

const SETS = [buildVereador, buildDeputado, buildGovernador, buildPresidente]

function clearGroup() {
  if (!group) return
  group.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
    if (o.material) o.material.dispose()
  })
  scene.remove(group)
}

function buildSet() {
  clearGroup()
  group = new THREE.Group()
  scene.add(group)
  const g = add(new THREE.PlaneGeometry(500, 500), mat(theme().ground), 0, 0, 0)
  g.rotation.x = -Math.PI / 2
  ;(SETS[props.stage] || buildDeputado)()
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
  targetSky.copy(skyFor(props.eco))
  if (sun) sun.intensity = 0.5 + (props.eco / 100) * 0.9
}

function build() {
  scene = new THREE.Scene()
  scene.background = sky.clone()
  scene.fog = new THREE.Fog(sky.clone(), 80, 220)
  hemi = new THREE.HemisphereLight(0xffffff, 0x334455, 0.75)
  scene.add(hemi)
  sun = new THREE.DirectionalLight(0xffffff, 1.1)
  sun.position.set(30, 50, 30)
  scene.add(sun)

  people = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.28, 0.7, 4, 8), mat(0xffffff), COUNT)
  for (let i = 0; i < COUNT; i++) {
    rand.push(Math.random())
    home.push({ x: (Math.random() - 0.5) * 20, z: 9 + Math.random() * 22, ph: Math.random() * 6.28 })
  }
  scene.add(people)
  paintPeople()
  buildSet()
}

function resize() {
  if (!root.value || !renderer) return
  const w = root.value.clientWidth
  const h = root.value.clientHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  root.value.appendChild(renderer.domElement)
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 600)
  build()
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(root.value)

  const clock = new THREE.Clock()
  const loop = () => {
    raf = requestAnimationFrame(loop)
    const t = clock.getElapsedTime()
    const cam = theme().cam
    const a = Math.sin(t * 0.12) * 0.45
    camera.position.set(Math.sin(a) * cam.r, cam.h + Math.sin(t * 0.2) * 1.5, Math.cos(a) * cam.r + 16)
    camera.lookAt(...cam.look)

    sky.lerp(targetSky, 0.03)
    scene.background.copy(sky)
    scene.fog.color.copy(sky)

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

watch(() => props.pop, () => people && paintPeople())
watch(() => props.eco, applyEco)
watch(() => props.stage, () => scene && buildSet())
</script>

<template>
  <div ref="root" class="scene"></div>
</template>