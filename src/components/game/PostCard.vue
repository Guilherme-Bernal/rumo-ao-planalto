<script setup>
import { computed } from 'vue'
import { reactPost, reactsLeft, REACTS } from '../../game/engine'
import { fmtNum } from '../../game/social'

const props = defineProps({ post: Object, compact: Boolean })
const emit = defineEmits(['react'])
const opts = computed(() => REACTS[props.post.tone] || REACTS.flat)
const left = computed(() => reactsLeft())
const can = computed(() => !props.compact && !props.post.mine && !props.post.done && left.value > 0)
function go(k) {
  const r = reactPost(props.post.id, k)
  if (r) emit('react', r)
}
</script>

<template>
  <article class="post" :class="[post.tone, { mine: post.mine }]">
    <div class="post-head">
      <b>{{ post.user }}</b>
      <span v-if="post.mine" class="chip">você</span>
      <span class="post-likes">♥ {{ fmtNum(post.likes) }}</span>
    </div>
    <p>{{ post.text }}</p>
    <div v-if="can" class="post-acts">
      <button v-for="o in opts" :key="o.id" class="chip btn" @click="go(o.id)">{{ o.label }}</button>
    </div>
    <p v-if="post.done" class="post-note">{{ post.note }}</p>
  </article>
</template>