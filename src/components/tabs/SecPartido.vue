<script setup>
import { computed, ref } from 'vue'
import {
  game, partidoProprio, partidoNow, doutrinaAtual, doutrinasNow, filiadosNow, partidoMotivo,
  escolherDoutrina, partidoConvidar, partidoExpulsar, partidoConvencao,
} from '../../game/engine'
import { PERFIS_PART, MAX_FILIADOS, CUSTO_DOUTRINA } from '../../game/bloco41'

const msg = ref('')
const proprio = computed(() => partidoProprio())
const st = computed(() => partidoNow())
const dout = computed(() => doutrinaAtual())
const filiados = computed(() => filiadosNow())
const say = (r) => { msg.value = r ? r.txt : '' }
const cor = (v) => (v >= 60 ? 'var(--good)' : v <= 30 ? 'var(--bad)' : 'var(--accent)')
const convites = PERFIS_PART.filter((p) => p.id !== 'oportunista')
</script>

<template>
  <div v-if="proprio">
    <h3 class="sub">🧭 Doutrina e filiados</h3>
    <p class="legend">
      O partido é seu: você define a doutrina, escolhe quem entra e quem sai e convoca a convenção. Doutrina coerente com as leis
      fortalece a base. Filiado desleal rompe e leva gente junto. Seguidores: <b>{{ st.seg }}</b> · Filiados: <b>{{ st.n }}/{{ MAX_FILIADOS }}</b>.
    </p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div class="sumbox">
      <b>{{ dout ? dout.icon + ' ' + dout.nome : 'Sem doutrina definida' }}</b>
      <small v-if="dout" class="muted"> · {{ dout.desc }} Temas: {{ dout.temas.join(', ') }}.</small>
      <small v-else class="muted"> · Escolha uma doutrina (a primeira é de graça). Trocar depois custa {{ CUSTO_DOUTRINA }} de caixa, imagem e lealdade.</small>
      <div class="acts">
        <button v-for="d in doutrinasNow()" :key="d.id" type="button" :class="{ on: dout && dout.id === d.id }" :disabled="!!partidoMotivo('doutrina', d.id)" :title="d.desc" @click="say(escolherDoutrina(d.id))">
          <b>{{ d.icon }} {{ d.nome }}</b><small>{{ d.desc }}</small>
        </button>
      </div>
    </div>

    <div class="sumbox" style="margin-top: 8px">
      <b>👥 Filiados</b>
      <p v-if="!filiados.length" class="muted">Ninguém filiado ainda. Convide quem você quer ou espere os pedidos chegarem.</p>
      <div v-for="f in filiados" :key="f.id" class="frow">
        <span>{{ f.icon }} <b>{{ f.nome }}</b> <small class="muted">{{ f.perfilNome }} · lealdade {{ Math.round(f.leal) }}</small></span>
        <span class="bar"><i :style="{ width: f.leal + '%', background: cor(f.leal) }"></i></span>
        <button type="button" class="mini" @click="say(partidoExpulsar(f.id))">🚫 Expulsar</button>
      </div>
      <div class="acts">
        <button v-for="p in convites" :key="p.id" type="button" :disabled="!!partidoMotivo('convidar', p.id)" :title="p.desc" @click="say(partidoConvidar(p.id))">
          <b>{{ p.icon }} Convidar {{ p.nome.toLowerCase() }}</b><small>{{ p.desc }} Custa 1 de caixa.</small><small v-if="partidoMotivo('convidar', p.id)" class="why">🔒 {{ partidoMotivo('convidar', p.id) }}</small>
        </button>
        <button type="button" :disabled="!!partidoMotivo('convencao')" @click="say(partidoConvencao())">
          <b>🎤 Convenção</b><small>Custa 2 de caixa. Sobe lealdade e seguidores.</small><small v-if="partidoMotivo('convencao')" class="why">🔒 {{ partidoMotivo('convencao') }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frow { display: grid; grid-template-columns: 1fr 90px auto; gap: 8px; align-items: center; margin: 4px 0; }
.acts button.on { outline: 2px solid var(--accent); }
</style>
