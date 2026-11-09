<script setup>
import { computed } from 'vue'
import { game, teamDef, appoint, appointeeList, slotLock, officeInfo, coalition } from '../../game/engine'
import { VICES, STAT_NAME } from '../../game/team'

const def = computed(() => teamDef())
const aps = appointeeList()
const typeOf = (id) => (game.team.slots[id] && game.team.slots[id].type) || 'tecnico'
const apOf = (id) => aps.find((a) => a.id === typeOf(id))
const vice = computed(() => (game.team.vice ? VICES.find((v) => v.id === game.team.vice.id) : null))
const amb = computed(() => (game.team.vice ? game.team.vice.amb : 0))
const level = (a) => (a >= 0.4 ? 'alto' : a >= 0.15 ? 'médio' : 'baixo')
const co = computed(() => coalition())
const pick = (slotId, e) => {
  if (!appoint(slotId, e.target.value)) e.target.value = typeOf(slotId)
}
</script>

<template>
  <div class="sumbox" style="margin-top: 12px">
    <b>🧑‍💼 {{ def.title }} · {{ officeInfo().name }}</b>
    <p class="muted">{{ def.law }}</p>

    <div v-if="vice" class="muted" style="margin: 6px 0">
      🤝 <b>Vice:</b> {{ vice.name }} · apetite pelo poder {{ level(amb) }}
      <span v-if="game.team.vice.conspire"> · 🕵️ está conspirando contra você</span>
    </div>
    <div v-if="game.team.supl && game.team.supl.length" class="muted" style="margin: 6px 0">
      🪑 <b>Suplente{{ game.team.supl.length > 1 ? 's' : '' }}:</b>
      <span v-for="(s, i) in game.team.supl" :key="i">{{ i ? ' · ' : ' ' }}{{ s.name }}</span>
      <span v-if="game.team.leave"> · 📤 licenciado, o suplente ocupa a cadeira por mais {{ game.team.leave.left }} rodada(s)</span>
    </div>
    <div v-if="def.political" class="muted" style="margin: 6px 0">
      🏛️ <b>Coalizão:</b> {{ co.allied }} pasta(s) com aliados.
      <span v-if="co.angry">😠 Insatisfeita: não vota com você no plenário.</span>
      <span v-else-if="co.votes">Garante {{ co.votes }} voto(s) no plenário.</span>
      <span v-else>Sem cargos, a base não garante votos no plenário.</span>
    </div>
    <div v-if="game.team.hot" class="muted" style="margin: 6px 0">🗞️ Há um escândalo em andamento em uma das pastas.</div>

    <div v-for="s in def.slots" :key="s.id" style="margin: 8px 0">
      <div>
        {{ s.icon }} <b>{{ s.name }}</b> <small class="muted">(mexe com {{ STAT_NAME[s.stat] }})</small>
        <small v-if="game.team.hot === s.id"> 🔥 sob denúncia</small>
      </div>
      <select :value="typeOf(s.id)" style="width: 100%; margin-top: 4px" @change="pick(s.id, $event)">
        <option v-for="a in aps" :key="a.id" :value="a.id" :disabled="!!slotLock(s, a)">
          {{ a.name }}{{ slotLock(s, a) ? ' (indisponível)' : '' }}
        </option>
      </select>
      <small class="muted" v-if="apOf(s.id)">{{ apOf(s.id).desc }}</small>
      <small class="muted" v-for="a in aps.filter((x) => slotLock(s, x))" :key="a.id" style="display: block">🔒 {{ a.name }}: {{ slotLock(s, a) }}</small>
    </div>
    <p class="legend">Cada nome rende um pouco por rodada na área da pasta e pode causar escândalo. Trocar um indicado político irrita o partido dele. Aliados com pasta garantem votos no plenário.</p>
  </div>
</template>