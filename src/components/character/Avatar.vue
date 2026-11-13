<script setup>
import { computed } from 'vue'
import { SKINS, HAIR_COLORS, OUTFIT_COLORS, BGS, EYE_COLORS, INSIGNIAS, HAIR_SHAPES, agingLevel, defaultLook } from '../../game/look'

const props = defineProps({ look: { type: Object, default: null }, size: { type: Number, default: 64 }, round: { type: Boolean, default: true }, cargo: { type: String, default: '' }, idade: { type: Number, default: null }, mood: { type: String, default: '' } })
const L = computed(() => ({ ...defaultLook(), ...(props.look || {}) }))
const skin = computed(() => SKINS[L.value.skin] || SKINS[2])
const shade = computed(() => 'rgba(0,0,0,.12)')
const ag = computed(() => agingLevel(L.value.age, props.idade))
const mix = (a, b, t) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
const hc = computed(() => mix(HAIR_COLORS[L.value.hairColor] || HAIR_COLORS[1], '#d8d8d8', [0, 0.12, 0.45, 0.85][ag.value]))
const ec = computed(() => EYE_COLORS[L.value.eyeColor] || EYE_COLORS[0])
const ins = computed(() => INSIGNIAS[props.cargo] || '')
const browW = computed(() => ({ grossa: 4.6, fina: 1.8 })[L.value.brow] || 3)
const browL = computed(() => (L.value.brow === 'arqueada' ? ['M41 50 Q48 43 55 49', 'M65 49 Q72 43 79 50'] : ['M41 49 Q48 46 55 49', 'M65 49 Q72 46 79 49']))
const nosePath = computed(() => ({ pequeno: 'M60 58 Q57 65 60 66 Q63 66 62 64', largo: 'M60 57 Q52 69 60 70 Q68 69 62 66' })[L.value.nose] || 'M60 58 Q55 68 60 69 Q64 69 62 67')
const oc = computed(() => OUTFIT_COLORS[L.value.outfitColor] || OUTFIT_COLORS[0])
const bg = computed(() => BGS[L.value.bg] || BGS[0])
const fem = computed(() => L.value.sex === 'f')
const fr = computed(() => (({ oval: 26, redondo: 29, quadrado: 28 })[L.value.face] || 26) - (fem.value ? 1.5 : 0))
const shape = computed(() => HAIR_SHAPES[L.value.hair] || {})
const neckW = computed(() => (fem.value ? 14 : 18))
const fh = computed(() => ({ oval: 31, redondo: 28, quadrado: 29 })[L.value.face] || 31)
const jaw = computed(() => (L.value.face === 'quadrado' ? (fem.value ? 'M36 62 L38 82 Q60 92 82 82 L84 62 Z' : 'M34 62 L36 84 Q60 94 84 84 L86 62 Z') : ''))
const bom = computed(() => props.mood === 'bom')
const ruim = computed(() => props.mood === 'ruim')
const lips = computed(() => (fem.value ? '#b4505a' : '#8a3b3b'))
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 120 120" :style="{ borderRadius: round ? '16px' : '0', display: 'block', flex: 'none' }" role="img" aria-label="Rosto do personagem">
    <rect width="120" height="120" :fill="bg" />
    <!-- cabelo atrás -->
    <g :fill="hc">
      <path v-for="(d, k) in shape.back || []" :key="'b' + k" :d="d" />
      <template v-if="L.hair === 'tranca'">
        <ellipse v-for="n in 4" :key="'tl' + n" :cx="34 - n * 0.5" :cy="68 + n * 9" rx="5" ry="5.5" stroke="rgba(0,0,0,.25)" stroke-width="1" />
        <ellipse v-for="n in 4" :key="'tr' + n" :cx="86 + n * 0.5" :cy="68 + n * 9" rx="5" ry="5.5" stroke="rgba(0,0,0,.25)" stroke-width="1" />
      </template>
    </g>
    <!-- roupa -->
    <path d="M10 124 Q10 96 38 92 L82 92 Q110 96 110 124 Z" :fill="oc" />
    <template v-if="L.outfit === 'terno'">
      <path d="M48 92 L60 112 L72 92 Z" fill="#f4f4f4" />
      <path d="M57 97 L63 97 L64 112 L60 118 L56 112 Z" fill="#a31d2c" />
      <path d="M38 92 L52 92 L58 118 L40 124 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
      <path d="M82 92 L68 92 L62 118 L80 124 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
    </template>
    <template v-else-if="L.outfit === 'social'">
      <path d="M46 92 L60 104 L74 92 Z" fill="#f4f4f4" />
      <path d="M46 92 L54 92 L60 104 Z M74 92 L66 92 L60 104 Z" fill="#e0e0e0" />
      <path d="M60 104 L60 124" stroke="rgba(0,0,0,.2)" stroke-width="1.5" />
    </template>
    <template v-else-if="L.outfit === 'colete'">
      <path d="M46 92 L60 104 L74 92 Z" fill="#f4f4f4" />
      <path d="M40 92 L56 92 L60 124 L38 124 Z M80 92 L64 92 L60 124 L82 124 Z" fill="rgba(0,0,0,.35)" />
      <circle cx="60" cy="108" r="1.6" fill="rgba(255,255,255,.55)" /><circle cx="60" cy="116" r="1.6" fill="rgba(255,255,255,.55)" />
    </template>
    <template v-else-if="L.outfit === 'polo'">
      <path d="M46 92 L54 90 L60 100 L66 90 L74 92 L66 98 L60 104 L54 98 Z" fill="rgba(255,255,255,.85)" />
      <path d="M60 100 L60 112" stroke="rgba(0,0,0,.25)" stroke-width="1.5" />
    </template>
    <template v-else-if="L.outfit === 'paleto'">
      <path d="M46 92 L60 100 L74 92 L74 124 L46 124 Z" fill="#efefef" />
      <path d="M38 92 L52 92 L56 124 L36 124 Z M82 92 L68 92 L64 124 L84 124 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
    </template>
    <template v-else-if="L.outfit === 'vestido'">
      <path d="M44 92 Q60 112 76 92 Z" :fill="skin" />
      <path d="M44 92 Q60 112 76 92" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.2" />
      <path d="M30 108 Q60 100 90 108" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" />
    </template>
    <template v-else-if="L.outfit === 'blazer'">
      <path d="M48 92 L60 110 L72 92 Z" fill="#f4efe9" />
      <path d="M52 92 Q60 104 68 92 Z" :fill="skin" />
      <path d="M38 92 L52 92 L58 120 L40 124 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
      <path d="M82 92 L68 92 L62 120 L80 124 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
    </template>
    <template v-else-if="L.outfit === 'blusa'">
      <rect x="48" y="84" width="24" height="14" rx="6" :fill="oc" stroke="rgba(0,0,0,.15)" />
    </template>
    <!-- pescoço -->
    <rect :x="60 - neckW / 2" y="78" :width="neckW" height="18" :fill="skin" />
    <path v-if="L.outfit !== 'blusa' && L.outfit !== 'vestido'" :d="`M${60 - neckW / 2} 90 Q60 98 ${60 + neckW / 2} 90 L${60 + neckW / 2} 82 L${60 - neckW / 2} 82 Z`" :fill="shade" />
    <path v-if="L.outfit === 'camiseta'" d="M46 92 Q60 108 74 92 L70 92 Q60 100 50 92 Z" :fill="skin" />
    <path v-if="L.outfit === 'blusa'" d="M45 90 Q60 100 75 90 L75 98 L45 98 Z" :fill="oc" />
    <!-- orelhas -->
    <ellipse :cx="60 - fr + 1" cy="58" rx="4" ry="6" :fill="skin" />
    <ellipse :cx="60 + fr - 1" cy="58" rx="4" ry="6" :fill="skin" />
    <!-- rosto -->
    <ellipse cx="60" cy="56" :rx="fr" :ry="fh" :fill="skin" />
    <path v-if="jaw" :d="jaw" :fill="skin" />
    <!-- cabelo frente -->
    <g :fill="shape.alpha ? mix(skin, hc, shape.alpha) : hc">
      <path v-for="(d, k) in shape.front || []" :key="'f' + k" :d="d" fill-rule="nonzero" />
    </g>
    <g v-if="shape.fade" :fill="hc" opacity=".35"><path v-for="(d, k) in shape.fade" :key="'fd' + k" :d="d" /></g>
    <g v-if="shape.rows" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="1.4" stroke-linecap="round"><path v-for="(d, k) in shape.rows" :key="'r' + k" :d="d" /></g>
    <circle v-if="shape.tie" :cx="shape.tie[0]" :cy="shape.tie[1]" r="3" fill="#c0392b" />
    <!-- sobrancelhas, olhos, nariz, boca -->
    <g :stroke="hc" :stroke-width="browW" stroke-linecap="round" fill="none" opacity=".9">
      <path :d="browL[0]" />
      <path :d="browL[1]" />
    </g>
    <g :fill="ec">
      <ellipse cx="48" cy="57" rx="3" ry="3.4" />
      <ellipse cx="72" cy="57" rx="3" ry="3.4" />
    </g>
    <g fill="#fff"><circle cx="49" cy="56" r="1" /><circle cx="73" cy="56" r="1" /></g>
    <g v-if="fem" stroke="#1b1512" stroke-width="1.2" stroke-linecap="round" fill="none">
      <path d="M45 54.4 Q48 52.8 51.4 54.2" /><path d="M68.6 54.2 Q72 52.8 75 54.4" />
      <path d="M44.6 55 L42.6 53.6" /><path d="M75.4 55 L77.4 53.6" />
    </g>
    <g v-if="ruim" stroke="rgba(70,40,60,.35)" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M43 63 Q48 66 53 63" /><path d="M67 63 Q72 66 77 63" /></g>
    <g v-if="bom" fill="rgba(230,100,110,.28)"><ellipse cx="42" cy="68" rx="5" ry="3" /><ellipse cx="78" cy="68" rx="5" ry="3" /></g>
    <path :d="nosePath" :stroke="shade" stroke-width="2" fill="none" stroke-linecap="round" />
    <path v-if="(L.mouth === 'sorriso' || !L.mouth) && !ruim" :d="bom ? 'M50 74 Q60 85 70 74' : 'M51 75 Q60 82 69 75'" :stroke="lips" :stroke-width="fem ? 3.2 : 2.6" fill="none" stroke-linecap="round" />
    <path v-else-if="L.mouth === 'serio' || ruim" d="M52 77 L68 77" stroke="#8a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round" />
    <path v-else-if="L.mouth === 'confiante'" d="M51 77 Q60 80 70 74" stroke="#8a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round" />
    <g v-else><path d="M52 75 Q60 87 68 75 Z" fill="#7a2e2e" /><path d="M53.5 75.4 L66.5 75.4 L65 78 L55 78 Z" fill="#f4f4f4" /></g>
    <!-- barba -->
    <g :fill="hc">
      <path v-if="L.beard === 'bigode'" d="M49 70 Q60 64 71 70 Q60 72 49 70 Z" />
      <path v-if="L.beard === 'cavanhaque'" d="M53 80 Q60 92 67 80 Q60 84 53 80 Z M50 70 Q60 65 70 70 Q60 72 50 70 Z" />
      <path v-if="L.beard === 'barba'" d="M34 60 Q34 92 60 92 Q86 92 86 60 Q82 76 70 77 Q60 72 50 77 Q38 76 34 60 Z" />
    </g>
    <path v-if="L.beard === 'barba'" d="M51 75 Q60 80 69 75" stroke="#8a3b3b" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <!-- óculos -->
    <g v-if="L.glasses === 'redondo'" fill="rgba(255,255,255,.12)" stroke="#222" stroke-width="2.4">
      <circle cx="48" cy="57" r="9" /><circle cx="72" cy="57" r="9" /><path d="M57 57 L63 57" fill="none" />
    </g>
    <g v-if="L.glasses === 'quadrado'" fill="rgba(255,255,255,.12)" stroke="#222" stroke-width="2.6">
      <rect x="38" y="49" width="20" height="16" rx="3" /><rect x="62" y="49" width="20" height="16" rx="3" /><path d="M58 56 L62 56" fill="none" />
    </g>
    <g v-if="L.glasses === 'escuros'">
      <rect x="37" y="49" width="22" height="16" rx="5" fill="#15151a" /><rect x="61" y="49" width="22" height="16" rx="5" fill="#15151a" />
      <path d="M59 55 L61 55" stroke="#15151a" stroke-width="3" /><path d="M41 52 L46 52" stroke="rgba(255,255,255,.4)" stroke-width="1.6" />
    </g>
    <!-- marcas, brinco, rugas -->
    <g v-if="L.marks === 'sardas'" fill="rgba(120,70,40,.55)"><circle cx="44" cy="66" r="1.2" /><circle cx="49" cy="68" r="1.2" /><circle cx="42" cy="70" r="1.1" /><circle cx="76" cy="66" r="1.2" /><circle cx="71" cy="68" r="1.2" /><circle cx="78" cy="70" r="1.1" /></g>
    <circle v-if="L.marks === 'pinta'" cx="70" cy="70" r="1.6" fill="rgba(60,30,20,.8)" />
    <path v-if="L.marks === 'cicatriz'" d="M74 42 L80 58" stroke="rgba(150,60,60,.7)" stroke-width="1.8" stroke-linecap="round" />
    <circle v-if="L.earring" :cx="60 - fr + 1" cy="65" r="2" fill="#d9b26b" />
    <g v-if="ag >= 1" stroke="rgba(0,0,0,.22)" stroke-width="1.2" fill="none" stroke-linecap="round">
      <path d="M45 40 Q60 37 75 40" /><path v-if="ag >= 2" d="M47 44 Q60 42 73 44" />
      <path d="M36 56 L40 58" /><path d="M84 56 L80 58" />
      <path v-if="ag >= 2" d="M50 66 Q47 72 50 78" /><path v-if="ag >= 2" d="M70 66 Q73 72 70 78" />
    </g>
    <!-- acessórios de cabeça -->
    <g v-if="L.headwear === 'bone'">
      <path d="M31 46 Q60 6 89 46 Z" :fill="oc" /><path d="M31 46 L10 52 Q34 56 40 47 Z" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
    </g>
    <g v-if="L.headwear === 'chapeu'">
      <ellipse cx="60" cy="38" rx="44" ry="9" :fill="oc" stroke="rgba(0,0,0,.25)" stroke-width="1" />
      <path d="M38 38 Q38 12 60 12 Q82 12 82 38 Z" :fill="oc" /><rect x="38" y="30" width="44" height="6" fill="rgba(0,0,0,.35)" />
    </g>
    <!-- lapela e insígnia do cargo -->
    <g v-if="L.pin === 'bandeira'"><rect x="80" y="100" width="12" height="8" rx="1" fill="#2e8b57" /><path d="M86 101.6 L90 104 L86 106.4 L82 104 Z" fill="#f4d03f" /></g>
    <path v-if="L.pin === 'estrela'" d="M84 99 L86 104 L91 104 L87 107 L88.5 112 L84 109 L79.5 112 L81 107 L77 104 L82 104 Z" fill="#f4d03f" />
    <g v-if="L.pin === 'flor'"><circle cx="84" cy="106" r="2.2" fill="#e84a7a" /><circle cx="84" cy="102.6" r="2" fill="#e84a7a" /><circle cx="87.4" cy="106" r="2" fill="#e84a7a" /><circle cx="84" cy="106" r="1.4" fill="#f4d03f" /></g>
    <g v-if="ins === 'faixa'">
      <path d="M12 124 L86 92 L96 96 L30 124 Z" fill="#1f8f4a" /><path d="M12 124 L86 92 L88 94 L18 124 Z" fill="#f4d03f" opacity=".9" />
      <circle cx="30" cy="112" r="4" fill="#f4d03f" />
    </g>
    <g v-if="ins === 'faixaP'"><path d="M16 124 L84 92 L92 96 L32 124 Z" fill="#2f6db5" /><path d="M16 124 L84 92 L86 94 L22 124 Z" fill="#fff" opacity=".8" /></g>
    <g v-if="ins === 'medalha'"><path d="M52 94 L58 112 L64 94 Z" fill="#c0392b" /><circle cx="58" cy="114" r="5" fill="#f4d03f" stroke="rgba(0,0,0,.3)" /></g>
    <g v-if="ins === 'pin'"><circle cx="82" cy="102" r="3.4" fill="#f4d03f" stroke="rgba(0,0,0,.3)" /></g>
    <g v-if="ins === 'cracha'"><rect x="78" y="100" width="14" height="18" rx="2" fill="#fff" stroke="rgba(0,0,0,.3)" /><rect x="81" y="103" width="8" height="6" fill="#274060" /><rect x="81" y="111" width="8" height="2" fill="#999" /></g>
  </svg>
</template>