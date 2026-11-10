<script setup>
import { computed } from 'vue'
import { SKINS, HAIR_COLORS, OUTFIT_COLORS, BGS, EYE_COLORS, INSIGNIAS, agingLevel, defaultLook } from '../../game/look'

const props = defineProps({ look: { type: Object, default: null }, size: { type: Number, default: 64 }, round: { type: Boolean, default: true }, cargo: { type: String, default: '' }, idade: { type: Number, default: null } })
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
const fr = computed(() => ({ oval: 26, redondo: 29, quadrado: 28 })[L.value.face] || 26)
const fh = computed(() => ({ oval: 31, redondo: 28, quadrado: 29 })[L.value.face] || 31)
const jaw = computed(() => (L.value.face === 'quadrado' ? 'M34 62 L36 84 Q60 94 84 84 L86 62 Z' : ''))
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 120 120" :style="{ borderRadius: round ? '16px' : '0', display: 'block', flex: 'none' }" role="img" aria-label="Rosto do personagem">
    <rect width="120" height="120" :fill="bg" />
    <!-- cabelo atrás -->
    <g :fill="hc">
      <path v-if="L.hair === 'longo'" d="M28 58 Q24 22 60 20 Q96 22 92 58 L96 104 Q76 104 74 84 L46 84 Q44 104 24 104 Z" />
      <path v-if="L.hair === 'bob'" d="M31 58 Q28 24 60 22 Q92 24 89 58 L90 82 Q80 86 78 74 L42 74 Q40 86 30 82 Z" />
      <ellipse v-if="L.hair === 'cacheado'" cx="60" cy="44" rx="33" ry="28" />
      <ellipse v-if="L.hair === 'black'" cx="60" cy="42" rx="40" ry="34" />
      <circle v-if="L.hair === 'coque'" cx="60" cy="16" r="10" />
      <path v-if="L.hair === 'tranca'" d="M30 58 Q26 22 60 20 Q94 22 90 58 L94 100 L84 100 L82 66 L38 66 L36 100 L26 100 Z" />
      <path v-if="L.hair === 'rabo'" d="M82 40 Q108 44 100 78 Q96 56 84 52 Z" />
      <ellipse v-if="L.hair === 'ondulado'" cx="60" cy="43" rx="35" ry="29" />
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
    <template v-else-if="L.outfit === 'blusa'">
      <rect x="48" y="84" width="24" height="14" rx="6" :fill="oc" stroke="rgba(0,0,0,.15)" />
    </template>
    <!-- pescoço -->
    <rect x="51" y="78" width="18" height="18" :fill="skin" />
    <path v-if="L.outfit !== 'blusa'" d="M51 90 Q60 98 69 90 L69 82 L51 82 Z" :fill="shade" />
    <path v-if="L.outfit === 'camiseta'" d="M46 92 Q60 108 74 92 L70 92 Q60 100 50 92 Z" :fill="skin" />
    <path v-if="L.outfit === 'blusa'" d="M45 90 Q60 100 75 90 L75 98 L45 98 Z" :fill="oc" />
    <!-- orelhas -->
    <ellipse :cx="60 - fr + 1" cy="58" rx="4" ry="6" :fill="skin" />
    <ellipse :cx="60 + fr - 1" cy="58" rx="4" ry="6" :fill="skin" />
    <!-- rosto -->
    <ellipse cx="60" cy="56" :rx="fr" :ry="fh" :fill="skin" />
    <path v-if="jaw" :d="jaw" :fill="skin" />
    <!-- cabelo frente -->
    <g :fill="hc">
      <path v-if="L.hair === 'curto'" d="M33 54 Q31 24 60 23 Q89 24 87 54 Q82 40 60 38 Q38 40 33 54 Z" />
      <path v-if="L.hair === 'social'" d="M32 56 Q28 22 62 22 Q92 25 88 56 Q86 42 74 36 Q54 42 38 40 Q33 46 32 56 Z" />
      <path v-if="L.hair === 'topete'" d="M32 54 Q26 20 62 17 Q96 20 88 54 Q86 36 70 32 Q50 26 38 40 Q33 44 32 54 Z" />
      <path v-if="L.hair === 'cacheado'" d="M32 56 Q30 30 60 28 Q90 30 88 56 Q84 42 60 40 Q36 42 32 56 Z" />
      <path v-if="L.hair === 'black'" d="M30 56 Q28 26 60 24 Q92 26 90 56 Q84 40 60 38 Q36 40 30 56 Z" />
      <path v-if="L.hair === 'bob'" d="M31 58 Q30 28 60 26 Q90 28 89 58 Q86 40 66 36 Q44 42 38 44 Q32 48 31 58 Z" />
      <path v-if="L.hair === 'longo'" d="M30 60 Q28 26 60 24 Q92 26 90 60 Q86 42 60 38 Q34 42 30 60 Z" />
      <path v-if="L.hair === 'coque'" d="M33 54 Q31 26 60 25 Q89 26 87 54 Q82 40 60 38 Q38 40 33 54 Z" />
      <path v-if="L.hair === 'ondulado'" d="M32 56 Q28 26 60 25 Q92 26 88 56 Q84 42 72 40 Q64 36 56 40 Q44 38 36 44 Q33 48 32 56 Z" />
      <path v-if="L.hair === 'tranca'" d="M31 58 Q29 26 60 24 Q91 26 89 58 Q84 40 60 37 Q36 40 31 58 Z" />
      <path v-if="L.hair === 'raspado'" d="M35 52 Q34 30 60 29 Q86 30 85 52 Q80 40 60 38 Q40 40 35 52 Z" opacity=".75" />
      <path v-if="L.hair === 'rabo'" d="M33 54 Q31 24 60 23 Q89 24 87 54 Q82 40 60 38 Q38 40 33 54 Z" />
    </g>
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
    <path :d="nosePath" :stroke="shade" stroke-width="2" fill="none" stroke-linecap="round" />
    <path v-if="L.mouth === 'sorriso' || !L.mouth" d="M51 75 Q60 82 69 75" stroke="#8a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round" />
    <path v-else-if="L.mouth === 'serio'" d="M52 77 L68 77" stroke="#8a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round" />
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