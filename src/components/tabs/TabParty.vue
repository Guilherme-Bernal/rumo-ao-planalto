<script setup>
import { ref } from 'vue'
import { game, country, partiesNow, partyObj, partyChanceNow, askJoin, declineInvite, foundParty, foundReasons, ideology } from '../../game/engine'
import { AFF_TEXT, affinity } from '../../game/countries/brasil-parties'
import { perkChips } from '../../game/ideas'
import SecCoalizao from './SecCoalizao.vue'
import PartyFounder from '../character/PartyFounder.vue'

const msg = ref('')
const open = ref(false)
const me = () => partyObj()
const others = () => partiesNow().filter((p) => p.id !== game.party)
const byId = (id) => partiesNow().find((p) => p.id === id)
const COST = [{ t: '💰 −10 caixa', good: false }, { t: '🏛️ −3 base', good: false }, { t: '⚖️ +2 imagem', good: true }]
function join(id) {
  const r = askJoin(id)
  if (r) msg.value = (r.ok ? '✅ ' : '❌ ') + r.text
}
function found(p) {
  if (foundParty(p)) {
    open.value = false
    msg.value = `🎗️ Você fundou o ${p.sigla}!`
  }
}
</script>

<template>
  <div>
    <h2>🎗️ Partido</h2>
    <p v-if="msg" class="notice">{{ msg }}</p>
    <SecCoalizao />

    <div v-if="me()" class="pc sel" :style="{ '--pc': me().color }">
      <div class="pc-head">
        <span class="pc-badge">{{ me().sigla }}</span>
        <div><b>{{ me().name }}</b><small>“{{ me().slogan }}”</small></div>
        <span class="chip">{{ me().ideo }}</span>
      </div>
      <div class="pc-perks"><span v-for="(c, i) in perkChips(me().perks)" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
      <small class="muted">{{ me().own ? 'Você é o(a) fundador(a) deste partido.' : `Afinidade com você: ${AFF_TEXT[affinity(ideology(), me())]}` }}</small>
    </div>
    <p v-else class="muted">Você está sem partido.</p>

    <div v-if="!game.myParty" class="pc-new" :class="{ open }">
      <div class="pc-newhead">
        <span class="pc-star">✨</span>
        <div>
          <b>Fundar o seu próprio partido</b>
          <small>Nome, sigla, cor, slogan e um foco de vantagem. Ele passa a ser o seu partido e entra nas urnas.</small>
        </div>
        <button v-if="!open" class="primary" @click="open = true">Criar partido</button>
        <button v-else @click="open = false">Fechar</button>
      </div>
      <PartyFounder v-if="open" :ideo="ideology()" :cost="COST" :reasons="foundReasons()" @found="found" />
    </div>

    <template v-if="game.invites.length">
      <h3 class="sub">✉️ Convites recebidos</h3>
      <div class="pgrid">
        <div v-for="id in game.invites" :key="id" class="pc" :style="{ '--pc': byId(id).color }">
          <div class="pc-head"><span class="pc-badge">{{ byId(id).sigla }}</span><div><b>{{ byId(id).name }}</b><small>“{{ byId(id).slogan }}”</small></div></div>
          <div class="pc-perks"><span v-for="(c, i) in perkChips(byId(id).perks)" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
          <div class="pfoot">
            <button class="primary" :disabled="game.switched" @click="join(id)">Aceitar (sem sorteio)</button>
            <button @click="declineInvite(id)">Recusar</button>
          </div>
        </div>
      </div>
    </template>

    <h3 class="sub">Outros partidos</h3>
    <p class="legend" style="margin-top: 0">Trocar de partido custa imagem e base política, e só dá para trocar uma vez por mandato.</p>
    <div class="pgrid">
      <div v-for="p in others()" :key="p.id" class="pc" :style="{ '--pc': p.color }">
        <div class="pc-head"><span class="pc-badge">{{ p.sigla }}</span><div><b>{{ p.name }}</b><small>“{{ p.slogan }}”</small></div><span class="chip">{{ p.ideo }}</span></div>
        <div class="pc-perks"><span v-for="(c, i) in perkChips(p.perks)" :key="i" class="chip" :class="c.good ? 'up' : 'down'">{{ c.t }}</span></div>
        <div class="pfoot">
          <span class="chip">chance {{ Math.round(partyChanceNow(p) * 100) }}%</span>
          <span v-if="game.rejected.includes(p.id)" class="chip down">já recusou</span>
          <button :disabled="game.switched || game.invites.includes(p.id)" @click="join(p.id)">{{ game.switched ? 'Já trocou' : 'Pedir filiação' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>