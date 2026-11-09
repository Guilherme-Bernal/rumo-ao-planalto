<script setup>
import { computed } from 'vue'
import { SKINS, HAIR_COLORS, OUTFIT_COLORS, BGS, defaultLook } from '../game/look'

const props = defineProps({ look: { type: Object, default: null }, size: { type: Number, default: 64 }, round: { type: Boolean, default: true } })
const L = computed(() => ({ ...defaultLook(), ...(props.look || {}) }))
const skin = computed(() => SKINS[L.value.skin] || SKINS[2])
const shade = computed(() => 'rgba(0,0,0,.12)')
const hc = computed(() => HAIR_COLORS[L.value.hairColor] || HAIR_COLORS[1])
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
    </g>
    <!-- sobrancelhas, olhos, nariz, boca -->
    <g :stroke="hc" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9">
      <path d="M41 49 Q48 46 55 49" />
      <path d="M65 49 Q72 46 79 49" />
    </g>
    <g fill="#1e1a18">
      <ellipse cx="48" cy="57" rx="3" ry="3.4" />
      <ellipse cx="72" cy="57" rx="3" ry="3.4" />
    </g>
    <g fill="#fff"><circle cx="49" cy="56" r="1" /><circle cx="73" cy="56" r="1" /></g>
    <path d="M60 58 Q55 68 60 69 Q64 69 62 67" :stroke="shade" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M51 75 Q60 82 69 75" stroke="#8a3b3b" stroke-width="2.6" fill="none" stroke-linecap="round" />
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
  </svg>
</template>