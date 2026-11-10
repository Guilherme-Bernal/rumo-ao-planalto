<script setup>
import { computed } from 'vue'
import { game, acaoPendente, inquerito, cstEstado, convitesNow, reuniaoDef, reuniaoMotivo, reuniaoAbrir, industriasNow, vidaNow, eventoDef, figurasNow, vidaMotivo, vidaEscolher, cadeiaNow, cadeiaDef, famPend, famEscolhaMotivo, famEscolher, rvPendNow, rvMotivo, rvEscolher } from '../../game/engine'
import { GUIAS, FASES } from '../../game/avancos'

const props = defineProps({ tab: { type: String, default: 'agenda' } })
const emit = defineEmits(['go'])
const g = computed(() => GUIAS[props.tab])
const fase = computed(() => (props.tab !== 'agenda' && game.phase !== 'actions' && FASES[game.phase] ? FASES[game.phase] : ''))
const tribunal = computed(() => !!(acaoPendente() || inquerito()))
const excecao = computed(() => cstEstado())
const convites = computed(() => convitesNow().map((c, i) => ({ ...c, i, d: reuniaoDef(c.defId) })).filter((c) => c.d))
const inds = computed(() => industriasNow())
const pend = computed(() => {
  const v = vidaNow()
  if (!v.pend) return null
  const f = figurasNow().find((x) => x.id === v.pend.fig)
  const e = eventoDef(v.pend.tipo)
  return f && e ? { e, f, left: v.pend.left } : null
})
const fam = computed(() => famPend())
const rival = computed(() => rvPendNow())
const cadeia = computed(() => {
  const c = cadeiaNow()
  return c ? { ...cadeiaDef(c.id), passo: c.passo } : null
})
</script>

<template>
  <div class="guia">
    <p v-if="tribunal" class="aviso bad">
      ⚖️ Há um caso no tribunal envolvendo você. Para se defender, vá em <b>Governo › Leis</b>, na seção do tribunal.
      <button type="button" class="mini" @click="emit('go', 'leis')">Ir para Leis</button>
    </p>
    <p v-if="excecao" class="aviso warn">🚨 Medida de exceção em vigor: não se vota PEC até ela terminar.</p>
    <p v-if="fase" class="aviso">⏳ Agora é a fase de <b>{{ fase }}</b>. Os botões de ação desta aba ficam apagados até a fase de ações, na aba Agenda.</p>
    <div v-for="c in convites" :key="c.defId + c.i" class="aviso conv">
      {{ c.d.icon }} <b>Convite:</b> {{ c.d.title }} <small>(vale mais {{ c.left + 1 }} rodada(s))</small>
      <button type="button" class="mini" :disabled="!!reuniaoMotivo(c.i)" :title="reuniaoMotivo(c.i)" @click="reuniaoAbrir(c.i)">Participar</button>
      <small v-if="reuniaoMotivo(c.i)" class="why">🔒 {{ reuniaoMotivo(c.i) }}</small>
    </div>
    <p v-if="cadeia" class="aviso warn">{{ cadeia.icon }} <b>{{ cadeia.nome }}</b>: etapa {{ cadeia.passo + 1 }} de {{ cadeia.passos.length }}. O saldo das reuniões decide como a crise termina.</p>
    <div v-if="pend" class="aviso conv">
      {{ pend.e.icon }} <b>{{ pend.e.titulo(pend.f) }}</b> <small>({{ pend.left + 1 }} rodada(s) para decidir)</small>
      <br /><small>{{ pend.e.texto(pend.f) }}</small>
      <span class="ops">
        <button v-for="o in pend.e.ops" :key="o.id" type="button" class="mini" :disabled="!!vidaMotivo(o.id)" :title="o.desc" @click="vidaEscolher(o.id)">{{ o.icon }} {{ o.name }}</button>
      </span>
    </div>
    <div v-if="fam" class="aviso conv">
      {{ fam.e.icon }} <b>{{ fam.titulo }}</b> <small>({{ fam.left + 1 }} rodada(s) para decidir)</small>
      <br /><small>{{ fam.texto }}</small>
      <span class="ops">
        <button v-for="o in fam.e.ops" :key="o.id" type="button" class="mini" :disabled="!!famEscolhaMotivo(o.id)" :title="o.desc" @click="famEscolher(o.id)">{{ o.icon }} {{ o.name }}</button>
      </span>
    </div>
    <div v-if="rival" class="aviso conv">
      {{ rival.e.icon }} <b>{{ rival.e.titulo(rival.r) }}</b> <small>({{ rival.left + 1 }} rodada(s) para decidir)</small>
      <br /><small>{{ rival.e.texto(rival.r) }}</small>
      <span class="ops">
        <button v-for="o in rival.e.ops" :key="o.id" type="button" class="mini" :disabled="!!rvMotivo(o.id)" :title="o.desc" @click="rvEscolher(o.id)">{{ o.icon }} {{ o.name }}</button>
      </span>
    </div>
    <p v-if="inds.length" class="aviso">🏭 Em operação: {{ inds.map((x) => x.nome).join(' · ') }}.</p>
    <details v-if="g" class="guiabox">
      <summary>📖 Guia rápido: {{ g.t }}</summary>
      <p>{{ g.txt }}</p>
    </details>
  </div>
</template>

<style scoped>
.guia { margin: 6px 0 10px; }
.aviso { margin: 6px 0; padding: 8px 10px; border-radius: 10px; font-size: 0.88rem; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.14); }
.aviso.bad { border-color: var(--bad); }
.aviso.warn { border-color: var(--warn); }
.mini { margin-left: 8px; padding: 3px 8px; font-size: 0.8rem; }
.conv { border-color: var(--accent); }
.ops { display: block; margin-top: 6px; }
.why { display: block; opacity: 0.8; }
.guiabox { font-size: 0.86rem; opacity: 0.92; }
.guiabox summary { cursor: pointer; }
.guiabox p { margin: 6px 0 0; }
</style>
