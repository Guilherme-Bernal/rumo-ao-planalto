<script setup>
import { ref, computed } from 'vue'
import { game, missaoView, missaoMotivo, missaoEscolher, missaoChanceOf, missaoFechar } from '../../game/engine'

const v = computed(() => missaoView())
const msg = ref('')
const go = (id) => { const x = missaoEscolher(id); msg.value = x ? x.txt : '' }
</script>

<template>
  <div v-if="v" class="sumbox" style="margin-top: 12px">
    <b>{{ v.d.icon }} Missão de bastidor: {{ v.d.titulo }}</b>
    <p class="muted" style="margin: 6px 0">{{ v.intro }}</p>
    <div v-if="v.m.log.length">
      <small v-for="(l, i) in v.m.log" :key="i" class="muted" style="display: block">{{ l.ok ? '✅' : '❌' }} {{ l.icon }} {{ l.name }}: {{ l.t }}</small>
    </div>
    <template v-if="v.passo">
      <p style="margin: 8px 0"><b>Passo {{ v.m.passo + 1 }}/{{ v.total }}.</b> {{ v.texto }} <small class="muted">({{ v.m.left + 1 }} rodada(s) para decidir)</small></p>
      <div class="acts">
        <button v-for="o in v.passo.ops" :key="o.id" type="button" :disabled="!!missaoMotivo(o.id)" :title="o.desc" @click="go(o.id)">
          <b>{{ o.icon }} {{ o.name }}</b><small>{{ o.desc }} Chance ~{{ missaoChanceOf(o) }}%<template v-if="o.cash"> · custa {{ o.cash }} Caixa</template></small>
        </button>
      </div>
    </template>
    <div v-else-if="v.m.fim" class="sumbox" role="status">
      <b>{{ v.m.fim.titulo }}</b> ({{ v.m.fim.ok }}/{{ v.m.fim.total }}). {{ v.m.fim.txt }}
      <button type="button" class="mini" @click="missaoFechar()">Fechar</button>
    </div>
    <p v-if="msg" class="muted" role="status">{{ msg }}</p>
  </div>
</template>

<style scoped>
.acts { display: grid; gap: 6px; }
.acts button { text-align: left; display: grid; gap: 2px; }
</style>
