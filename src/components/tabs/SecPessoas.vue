<script setup>
import { computed, ref } from 'vue'
import Avatar from '../character/Avatar.vue'
import {
  game, officeId, ageNow, familiaNow, famAcoes, famAcaoMotivo, famAgir, perfisConjuge, bioNow, bioTitulos,
  figurasNow, figAcoes, figMotivo, figAgir,
} from '../../game/engine'

const f = computed(() => familiaNow())
const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
const perfil = (id) => perfisConjuge().find((p) => p.id === id)
const marcos = computed(() => bioNow().slice(-14).reverse())
const titulos = computed(() => bioTitulos())
const figs = computed(() => figurasNow().filter((x) => ['mentor', 'rival', 'lider'].includes(x.id)))
const laco = (x) => Math.round(x.laco == null ? (x.id === 'rival' ? 40 : 55) : x.laco)
const hLabel = computed(() => (f.value.harmonia >= 70 ? 'em paz' : f.value.harmonia >= 40 ? 'estável' : f.value.harmonia >= 25 ? 'tensa' : 'em crise'))
</script>

<template>
  <div class="sumbox" style="margin-top: 12px">
    <b>📖 Biografia viva</b>
    <div class="bio-head">
      <Avatar v-if="game.look" :look="game.look" :cargo="officeId()" :idade="ageNow()" :size="72" />
      <div>
        <div><b>{{ game.name }}</b> <small class="muted">{{ ageNow() != null ? ageNow() + ' anos' : '' }}</small></div>
        <div class="muted"><span v-for="t in titulos" :key="t.nome" class="chip" :title="t.txt">{{ t.icon }} {{ t.nome }}</span><span v-if="!titulos.length">Nenhum título ainda. A carreira escreve os títulos.</span></div>
      </div>
    </div>
    <p v-for="(m, i) in marcos" :key="i" class="bio-l">{{ m.icon }} <small class="muted">r{{ m.r }}</small> {{ m.text }}</p>
    <p v-if="!marcos.length" class="muted">Os marcos da carreira vão aparecendo aqui.</p>
  </div>

  <div class="sumbox" style="margin-top: 12px">
    <b>👨‍👩‍👧 Família e vida pessoal</b>
    <p class="muted">Harmonia familiar: <b>{{ Math.round(f.harmonia) }}</b> ({{ hLabel }}). A agenda corrói a harmonia a cada rodada. Em paz, rende imagem. Em crise, vira escândalo.</p>
    <div class="bar"><i :style="{ width: f.harmonia + '%', background: 'var(--accent)' }"></i></div>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>
    <div class="fam">
      <div v-if="f.conjuge" class="fam-p"><Avatar :look="f.conjuge.look" :size="56" :idade="ageNow()" /><small><b>{{ f.conjuge.nome }}</b><br />{{ f.conjuge.casado ? 'cônjuge' : 'noivado' }} · {{ perfil(f.conjuge.perfil).name }}</small></div>
      <div v-for="c in f.filhos" :key="c.nome" class="fam-p"><Avatar :look="c.look" :size="48" :idade="12" /><small><b>{{ c.nome }}</b><br />filho(a)</small></div>
      <small v-if="f.pais" class="muted">Pais: {{ f.pais.mae }} e {{ f.pais.pai }}</small>
    </div>
    <div class="acts">
      <button v-for="a in famAcoes()" :key="a.id" type="button" :disabled="!!famAcaoMotivo(a.id)" :title="a.desc" @click="say(famAgir(a.id))">
        <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small><small v-if="famAcaoMotivo(a.id)" class="why">🔒 {{ famAcaoMotivo(a.id) }}</small>
      </button>
    </div>
  </div>

  <div v-if="figs.length" class="sumbox" style="margin-top: 12px">
    <b>🤝 Laços políticos</b>
    <p class="muted">Cada pessoa guarda a história que tem com você. Pode ajudar uma conversa por rodada.</p>
    <div v-for="x in figs" :key="x.id" class="fig">
      <div>{{ x.icon }} <b>{{ x.nome }}</b> <small class="muted">{{ x.label }} · {{ x.estado === 'ativa' ? 'laço ' + laco(x) : x.estado }}</small></div>
      <div class="bar"><i :style="{ width: laco(x) + '%', background: x.id === 'rival' ? 'var(--bad)' : 'var(--accent)' }"></i></div>
      <small v-for="(h, i) in (x.hist || []).slice(0, 3)" :key="i" class="muted hl">r{{ h.r }}: {{ h.t }}</small>
      <div v-if="x.estado === 'ativa'" class="acts">
        <button v-for="a in figAcoes(x.id)" :key="a.id" type="button" :disabled="!!figMotivo(x.id, a.id)" :title="a.desc" @click="say(figAgir(x.id, a.id))">
          <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small><small v-if="figMotivo(x.id, a.id)" class="why">🔒 {{ figMotivo(x.id, a.id) }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bio-head { display: flex; gap: 10px; align-items: center; margin: 8px 0; }
.chip { display: inline-block; margin: 2px 4px 2px 0; padding: 1px 7px; border-radius: 10px; background: rgba(255, 255, 255, 0.1); font-size: 0.78rem; }
.bio-l { margin: 3px 0; font-size: 0.86rem; }
.fam { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 8px 0; }
.fam-p { display: flex; gap: 6px; align-items: center; }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
.fig { margin: 10px 0; }
.hl { display: block; }
</style>
