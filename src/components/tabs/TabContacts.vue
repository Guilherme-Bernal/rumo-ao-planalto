<script setup>
import { computed, ref } from 'vue'
import { game } from '../../game/engine'
import { ROLES, relLabel } from '../../game/contacts'

const emit = defineEmits(['go'])
const col = (v) => (v >= 55 ? 'var(--good)' : v >= 30 ? 'var(--warn)' : 'var(--bad)')
const perk = (c) => (c.rel >= 70 ? { t: ROLES[c.role].hiText, cls: 'up' } : c.rel <= 15 ? { t: ROLES[c.role].loText, cls: 'down' } : null)
const pending = computed(() => game.approach && !game.approach.done)
const filter = ref('todos')
const FILTERS = [['todos', 'Todos'], ['ajuda', '🟢 Ajudam'], ['neutro', 'Neutros'], ['atrapalha', '🔴 Atrapalham']]
const tier = (c) => (c.rel >= 70 ? 'ajuda' : c.rel <= 15 ? 'atrapalha' : 'neutro')
const list = computed(() => [...game.contacts].sort((a, b) => b.rel - a.rel).filter((c) => filter.value === 'todos' || tier(c) === filter.value))
const count = (t) => game.contacts.filter((c) => tier(c) === t).length
const mean = computed(() => (game.contacts.length ? Math.round(game.contacts.reduce((a, c) => a + c.rel, 0) / game.contacts.length) : 0))
const sign = (d) => (d > 0 ? `+${d}` : d < 0 ? `${d}` : '0')
</script>

<template>
  <div class="ctab">
    <h2>👥 Contatos</h2>
    <p class="lead">Pessoas que se aproximam ao longo do mandato. Perto de <b>70</b> a pessoa te ajuda toda rodada; abaixo de <b>15</b> ela te atrapalha. Sem contato, a relação volta devagar para o neutro.</p>

    <div v-if="pending" class="ct-call">
      <span class="ct-ring">📞</span>
      <div><b>Tem alguém tentando falar com você.</b><small class="muted">Atenda na aba Agenda.</small></div>
      <button class="primary" @click="emit('go', 'agenda')">Atender</button>
    </div>

    <div class="ct-sum">
      <div><b>{{ mean }}</b><small>relação média</small></div>
      <div><b class="up">{{ count('ajuda') }}</b><small>te ajudam</small></div>
      <div><b>{{ count('neutro') }}</b><small>neutros</small></div>
      <div><b class="down">{{ count('atrapalha') }}</b><small>te atrapalham</small></div>
    </div>

    <div class="sn-tabs ct-filter"><button v-for="f in FILTERS" :key="f[0]" :class="{ on: filter === f[0] }" @click="filter = f[0]">{{ f[1] }}</button></div>

    <div class="ct-list">
      <div v-for="c in list" :key="c.id" class="ct2" :class="tier(c)">
        <span class="ct2-ava" :style="{ '--c': col(c.rel) }">{{ ROLES[c.role].icon }}</span>
        <div class="ct2-body">
          <div class="ct-top"><b>{{ c.name }}</b><span class="chip">{{ relLabel(c.rel) }} · {{ Math.round(c.rel) }}</span></div>
          <small class="muted">{{ ROLES[c.role].name }}</small>
          <div class="ct2-bar">
            <i :style="{ width: c.rel + '%', background: col(c.rel) }"></i>
            <u style="left: 15%"></u><u style="left: 70%"></u>
          </div>
          <small v-if="perk(c)" :class="perk(c).cls">{{ perk(c).cls === 'up' ? '🟢' : '🔴' }} {{ perk(c).t }}</small>
          <small v-else class="muted">Perto de 70: {{ ROLES[c.role].hiText }}</small>
          <div v-if="c.hist && c.hist.length" class="ct2-hist">
            <div v-for="(h, i) in c.hist.slice(0, 2)" :key="i"><span>{{ h.t }}</span><b :class="h.d > 0 ? 'up' : h.d < 0 ? 'down' : 'muted'">{{ sign(h.d) }}</b></div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="!list.length" class="muted">Ninguém nessa faixa agora.</p>

    <div class="sumbox" style="margin-top: 12px">
      <b>📞 Ligar para um contato</b>
      <p class="muted">Na Agenda, marque a ação "Ligar para um contato" no calendário. Bata papo para fortalecer a relação ou peça um favor. Pedidos polêmicos rendem mais, mas contam como escolha suja.</p>
      <button class="primary" @click="emit('go', 'agenda')">Ir para a Agenda</button>
    </div>
  </div>
</template>
