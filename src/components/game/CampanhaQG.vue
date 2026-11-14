<script setup>
import { computed, ref } from 'vue'
import {
  game, campView, campPendNow, campMotivoCaso, campEscolher, marqueteirosNow, agendaCampNow, tvEstNow, financNow, tempoTvNow,
  campMarqueteiroMotivo, campMarqueteiro, campAgendaMotivo, campAgenda, campTvMotivo, campTv, campFinMotivo, campFin,
} from '../../game/engine'

const msg = ref('')
const say = (r) => { msg.value = r ? r.txt : '' }
const v = computed(() => { game.election && game.election.camp && game.election.camp.acoes; return campView() })
const pend = computed(() => { game.election && game.election.camp && game.election.camp.pend; return campPendNow() })
const mk = computed(() => marqueteirosNow().find((m) => m.id === v.value.mark))
const mostra = computed(() => !!game.election && ['campaign', 'runoff'].includes(game.phase))
const tone = (x, inv) => { const y = inv ? 100 - x : x; return y < 35 ? 'var(--bad)' : y < 60 ? 'var(--warn)' : 'var(--good)' }
</script>

<template>
  <div v-if="mostra" class="sumbox">
    <b>🏁 QG da campanha</b>
    <p class="muted">
      Você tem <b>{{ v.dias }}</b> dia(s) de campanha. Embalo, estrutura e risco jurídico entram na conta das urnas (efeito atual:
      <b>{{ v.bonus > 0 ? '+' : '' }}{{ v.bonus }}</b> ponto(s)). Tudo isto é opcional: quem não faz nada começa do zero.
    </p>
    <div class="slider"><div class="row"><span>🔥 Embalo</span><b>{{ v.m.embalo }}</b></div><div class="bar"><i :style="{ width: v.m.embalo + '%', background: tone(v.m.embalo) }"></i></div></div>
    <div class="slider"><div class="row"><span>🧑‍🤝‍🧑 Estrutura e voluntários</span><b>{{ v.m.org }}</b></div><div class="bar"><i :style="{ width: v.m.org + '%', background: tone(v.m.org) }"></i></div></div>
    <div class="slider"><div class="row"><span>⚖️ Risco com a Justiça Eleitoral</span><b>{{ v.m.risco }}</b></div><div class="bar"><i :style="{ width: v.m.risco + '%', background: tone(v.m.risco, true) }"></i></div></div>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div v-if="pend" class="aviso conv">
      {{ pend.icon }} <b>{{ pend.titulo }}</b>
      <br /><small>{{ pend.texto }}</small>
      <span class="ops">
        <button v-for="o in pend.ops" :key="o.id" type="button" class="mini" :disabled="!!campMotivoCaso(o.id)" :title="o.desc + (o.p && o.p < 1 ? ' Chance ' + Math.round(o.p * 100) + '%.' : '')" @click="say(campEscolher(o.id))">{{ o.icon }} {{ o.name }}</button>
      </span>
    </div>

    <p class="muted"><b>🎬 Marqueteiro:</b> {{ mk ? mk.icon + ' ' + mk.nome : 'ainda não contratado (custa 2)' }}</p>
    <div v-if="!mk" class="acts">
      <button v-for="m in marqueteirosNow()" :key="m.id" type="button" :disabled="!!campMarqueteiroMotivo(m.id)" @click="say(campMarqueteiro(m.id))">
        <b>{{ m.icon }} {{ m.nome }}</b><small>{{ m.desc }}</small>
        <small v-if="campMarqueteiroMotivo(m.id)" class="why">🔒 {{ campMarqueteiroMotivo(m.id) }}</small>
      </button>
    </div>

    <p class="muted"><b>📅 Agenda de campo</b></p>
    <div class="acts">
      <button v-for="a in agendaCampNow()" :key="a.id" type="button" :disabled="!!campAgendaMotivo(a.id)" @click="say(campAgenda(a.id))">
        <b>{{ a.icon }} {{ a.nome }}</b><small>{{ a.desc }} {{ a.cash ? 'Custa ' + a.cash + '.' : '' }}</small>
        <small v-if="campAgendaMotivo(a.id)" class="why">🔒 {{ campAgendaMotivo(a.id) }}</small>
      </button>
    </div>

    <p class="muted"><b>📺 Horário eleitoral</b> (tempo de TV: {{ tempoTvNow() }}x, cresce com as alianças fechadas)</p>
    <div class="acts">
      <button v-for="t in tvEstNow()" :key="t.id" type="button" :disabled="!!campTvMotivo(t.id)" @click="say(campTv(t.id))">
        <b>{{ t.icon }} {{ t.nome }}</b><small>{{ t.desc }} Custa 2.</small>
        <small v-if="campTvMotivo(t.id)" class="why">🔒 {{ campTvMotivo(t.id) }}</small>
      </button>
    </div>

    <p class="muted"><b>💰 Financiamento</b></p>
    <div class="acts">
      <button v-for="f in financNow()" :key="f.id" type="button" :disabled="!!campFinMotivo(f.id)" @click="say(campFin(f.id))">
        <b>{{ f.icon }} {{ f.nome }} <small>(+{{ f.cash }} de caixa)</small></b><small>{{ f.desc }}</small>
        <small v-if="campFinMotivo(f.id)" class="why">🔒 {{ campFinMotivo(f.id) }}</small>
      </button>
    </div>
  </div>
</template>
