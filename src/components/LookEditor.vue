<script setup>
import Avatar from './Avatar.vue'
import { SKINS, HAIR_COLORS, HAIRS, FACES, BEARDS, GLASSES, OUTFITS, OUTFIT_COLORS, BGS, randomLook, defaultLook } from '../game/look'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])
const set = (k, v) => emit('update:modelValue', { ...props.modelValue, [k]: v })
</script>

<template>
  <div class="look">
    <div class="look-prev">
      <Avatar :look="modelValue" :size="132" />
      <button type="button" @click="emit('update:modelValue', randomLook())">🎲 Sortear rosto</button>
      <button type="button" @click="emit('update:modelValue', defaultLook())">↺ Padrão</button>
    </div>
    <div class="look-opts">
      <div class="lk-row"><small>Tom de pele</small>
        <span class="lk-sw"><i v-for="(c, i) in SKINS" :key="c" :style="{ background: c }" :class="{ on: modelValue.skin === i }" @click="set('skin', i)"></i></span></div>
      <div class="lk-row"><small>Rosto</small>
        <span class="lk-ch"><button v-for="o in FACES" :key="o.id" type="button" :class="{ on: modelValue.face === o.id }" @click="set('face', o.id)">{{ o.name }}</button></span></div>
      <div class="lk-row"><small>Cabelo</small>
        <span class="lk-ch"><button v-for="o in HAIRS" :key="o.id" type="button" :class="{ on: modelValue.hair === o.id }" @click="set('hair', o.id)">{{ o.name }}</button></span></div>
      <div class="lk-row"><small>Cor do cabelo</small>
        <span class="lk-sw"><i v-for="(c, i) in HAIR_COLORS" :key="c" :style="{ background: c }" :class="{ on: modelValue.hairColor === i }" @click="set('hairColor', i)"></i></span></div>
      <div class="lk-row"><small>Barba</small>
        <span class="lk-ch"><button v-for="o in BEARDS" :key="o.id" type="button" :class="{ on: modelValue.beard === o.id }" @click="set('beard', o.id)">{{ o.name }}</button></span></div>
      <div class="lk-row"><small>Óculos</small>
        <span class="lk-ch"><button v-for="o in GLASSES" :key="o.id" type="button" :class="{ on: modelValue.glasses === o.id }" @click="set('glasses', o.id)">{{ o.name }}</button></span></div>
      <div class="lk-row"><small>Roupa</small>
        <span class="lk-ch"><button v-for="o in OUTFITS" :key="o.id" type="button" :class="{ on: modelValue.outfit === o.id }" @click="set('outfit', o.id)">{{ o.name }}</button></span></div>
      <div class="lk-row"><small>Cor da roupa</small>
        <span class="lk-sw"><i v-for="(c, i) in OUTFIT_COLORS" :key="c" :style="{ background: c }" :class="{ on: modelValue.outfitColor === i }" @click="set('outfitColor', i)"></i></span></div>
      <div class="lk-row"><small>Fundo</small>
        <span class="lk-sw"><i v-for="(c, i) in BGS" :key="c" :style="{ background: c }" :class="{ on: modelValue.bg === i }" @click="set('bg', i)"></i></span></div>
    </div>
  </div>
</template>