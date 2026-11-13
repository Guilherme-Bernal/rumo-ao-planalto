<script setup>
import { ref, computed } from 'vue'
import Avatar from './Avatar.vue'
import {
  SKINS, HAIR_COLORS, HAIRS, FACES, BEARDS, GLASSES, OUTFITS, OUTFIT_COLORS, BGS, BROWS, EYE_COLORS, MOUTHS, NOSES,
  MARKS, HEADWEAR, PINS, AGES, CARGOS_PREVIA, randomLook, defaultLook, SEXOS, hairsFor, hairOk,
} from '../../game/look'

const props = defineProps({ modelValue: { type: Object, required: true }, cargo: { type: String, default: '' }, idade: { type: Number, default: null } })
const emit = defineEmits(['update:modelValue'])
const set = (k, v) => emit('update:modelValue', { ...props.modelValue, [k]: v })
const aba = ref('rosto')
const todos = ref(false)
const sex = computed(() => (props.modelValue.sex === 'f' ? 'f' : 'm'))
const hairs = computed(() => (todos.value ? HAIRS : hairsFor(sex.value)))
const roupas = computed(() => OUTFITS.filter((o) => sex.value === 'f' || todos.value || !['vestido', 'blazer'].includes(o.id)))
// trocar o perfil ajusta o que não combina (barba, penteado e roupa de outro perfil)
function setSex(v) {
  if (v === sex.value) return
  const nx = { ...props.modelValue, sex: v }
  const d = defaultLook(v)
  if (!hairOk(nx.hair, v)) nx.hair = d.hair
  if (v === 'f') nx.beard = 'nenhuma'
  if (v === 'm' && ['vestido', 'blazer'].includes(nx.outfit)) nx.outfit = 'terno'
  if (v === 'f' && nx.outfit === 'terno') nx.outfit = 'blazer'
  emit('update:modelValue', nx)
}
const previa = ref(props.cargo || 'vereador')
const abas = [['rosto', '🙂 Rosto'], ['cabelo', '💇 Cabelo e barba'], ['roupa', '👔 Roupa'], ['detalhes', '✨ Detalhes']]
</script>

<template>
  <div class="look">
    <div class="look-prev">
      <Avatar :look="modelValue" :size="132" :cargo="previa" :idade="idade" />
      <div class="prev-cargos" role="group" aria-label="Prévia por cargo">
        <button v-for="c in CARGOS_PREVIA" :key="c.id" type="button" :class="{ on: previa === c.id }" :title="'Ver com a insígnia de ' + c.name" @click="previa = c.id">{{ c.name }}</button>
      </div>
      <button type="button" @click="emit('update:modelValue', randomLook(sex))">🎲 Sortear rosto</button>
      <button type="button" @click="emit('update:modelValue', defaultLook(sex))">↺ Padrão</button>
    </div>
    <div class="look-opts">
      <div class="lk-tabs" role="tablist"><button v-for="a in abas" :key="a[0]" type="button" role="tab" :aria-selected="aba === a[0]" :class="{ on: aba === a[0] }" @click="aba = a[0]">{{ a[1] }}</button></div>

      <template v-if="aba === 'rosto'">
        <div class="lk-row"><small>Perfil</small>
          <span class="lk-ch"><button v-for="o in SEXOS" :key="o.id" type="button" :class="{ on: sex === o.id }" @click="setSex(o.id)">{{ o.icon }} {{ o.name }}</button></span></div>
        <div class="lk-row"><small>Tom de pele</small>
          <span class="lk-sw"><i v-for="(c, i) in SKINS" :key="c" :style="{ background: c }" :class="{ on: modelValue.skin === i }" @click="set('skin', i)"></i></span></div>
        <div class="lk-row"><small>Rosto</small>
          <span class="lk-ch"><button v-for="o in FACES" :key="o.id" type="button" :class="{ on: modelValue.face === o.id }" @click="set('face', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Sobrancelha</small>
          <span class="lk-ch"><button v-for="o in BROWS" :key="o.id" type="button" :class="{ on: (modelValue.brow || 'normal') === o.id }" @click="set('brow', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Cor dos olhos</small>
          <span class="lk-sw"><i v-for="(c, i) in EYE_COLORS" :key="c" :style="{ background: c }" :class="{ on: (modelValue.eyeColor || 0) === i }" @click="set('eyeColor', i)"></i></span></div>
        <div class="lk-row"><small>Nariz</small>
          <span class="lk-ch"><button v-for="o in NOSES" :key="o.id" type="button" :class="{ on: (modelValue.nose || 'medio') === o.id }" @click="set('nose', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Expressão</small>
          <span class="lk-ch"><button v-for="o in MOUTHS" :key="o.id" type="button" :class="{ on: (modelValue.mouth || 'sorriso') === o.id }" @click="set('mouth', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Idade visual</small>
          <span class="lk-ch"><button v-for="o in AGES" :key="o.id" type="button" :class="{ on: (modelValue.age || 'auto') === o.id }" @click="set('age', o.id)">{{ o.name }}</button></span></div>
      </template>

      <template v-else-if="aba === 'cabelo'">
        <div class="lk-row"><small>Cabelo</small>
          <span class="lk-ch"><button v-for="o in hairs" :key="o.id" type="button" :class="{ on: modelValue.hair === o.id }" @click="set('hair', o.id)">{{ o.name }}</button>
            <button type="button" class="lk-all" :class="{ on: todos }" @click="todos = !todos">{{ todos ? 'Só os do meu perfil' : 'Ver todos' }}</button></span></div>
        <div class="lk-row"><small>Cor do cabelo</small>
          <span class="lk-sw"><i v-for="(c, i) in HAIR_COLORS" :key="c" :style="{ background: c }" :class="{ on: modelValue.hairColor === i }" @click="set('hairColor', i)"></i></span></div>
        <div v-if="sex === 'm' || todos" class="lk-row"><small>Barba</small>
          <span class="lk-ch"><button v-for="o in BEARDS" :key="o.id" type="button" :class="{ on: modelValue.beard === o.id }" @click="set('beard', o.id)">{{ o.name }}</button></span></div>
      </template>

      <template v-else-if="aba === 'roupa'">
        <div class="lk-row"><small>Roupa</small>
          <span class="lk-ch"><button v-for="o in roupas" :key="o.id" type="button" :class="{ on: modelValue.outfit === o.id }" @click="set('outfit', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Cor da roupa</small>
          <span class="lk-sw"><i v-for="(c, i) in OUTFIT_COLORS" :key="c" :style="{ background: c }" :class="{ on: modelValue.outfitColor === i }" @click="set('outfitColor', i)"></i></span></div>
        <div class="lk-row"><small>Lapela</small>
          <span class="lk-ch"><button v-for="o in PINS" :key="o.id" type="button" :class="{ on: (modelValue.pin || 'nenhum') === o.id }" @click="set('pin', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Fundo</small>
          <span class="lk-sw"><i v-for="(c, i) in BGS" :key="c" :style="{ background: c }" :class="{ on: modelValue.bg === i }" @click="set('bg', i)"></i></span></div>
      </template>

      <template v-else>
        <div class="lk-row"><small>Óculos</small>
          <span class="lk-ch"><button v-for="o in GLASSES" :key="o.id" type="button" :class="{ on: modelValue.glasses === o.id }" @click="set('glasses', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Marcas no rosto</small>
          <span class="lk-ch"><button v-for="o in MARKS" :key="o.id" type="button" :class="{ on: (modelValue.marks || 'nenhuma') === o.id }" @click="set('marks', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Chapéu</small>
          <span class="lk-ch"><button v-for="o in HEADWEAR" :key="o.id" type="button" :class="{ on: (modelValue.headwear || 'nenhum') === o.id }" @click="set('headwear', o.id)">{{ o.name }}</button></span></div>
        <div class="lk-row"><small>Brinco</small>
          <span class="lk-ch"><button type="button" :class="{ on: !modelValue.earring }" @click="set('earring', false)">Sem</button><button type="button" :class="{ on: !!modelValue.earring }" @click="set('earring', true)">Com brinco</button></span></div>
      </template>
      <p class="lk-note">A insígnia muda com o cargo (crachá, faixa, medalha) e o rosto envelhece com a carreira, a menos que você fixe a idade visual.</p>
    </div>
  </div>
</template>

<style scoped>
.lk-tabs { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.lk-tabs button.on { outline: 2px solid var(--accent); }
.prev-cargos { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; margin-top: 4px; }
.prev-cargos button { padding: 2px 6px; font-size: 0.72rem; }
.prev-cargos button.on { outline: 2px solid var(--accent); }
.lk-note { font-size: 0.78rem; opacity: 0.75; margin-top: 8px; }
</style>
