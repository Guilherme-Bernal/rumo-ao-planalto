<script setup>
import { computed } from 'vue'
import { game } from '../../game/engine'
import { ROLES, relLabel } from '../../game/contacts'

const emit = defineEmits(['go'])
const col = (v) => (v >= 55 ? 'var(--good)' : v >= 30 ? 'var(--warn)' : 'var(--bad)')
const perk = (c) => (c.rel >= 70 ? { t: ROLES[c.role].hiText, cls: 'up' } : c.rel <= 15 ? { t: ROLES[c.role].loText, cls: 'down' } : null)
const pending = computed(() => game.approach && !game.approach.done)
</script>

<template>
  <div>
    <h2>👥 Contatos</h2>
    <p class="lead">Pessoas que se aproximam de você ao longo do mandato. Conversas e ligações mudam a relação. Perto de 70 a pessoa te ajuda toda rodada, abaixo de 15 ela te atrapalha. Sem contato, a relação volta lentamente para o neutro.</p>
    <div v-if="pending" class="notice">📞 Tem alguém tentando falar com você. Atenda na aba Agenda.</div>
    <div class="ct-list">
      <div v-for="c in game.contacts" :key="c.id" class="ct">
        <span class="ph-ava">{{ ROLES[c.role].icon }}</span>
        <div class="ct-body">
          <div class="ct-top"><b>{{ c.name }}</b><span class="chip">{{ relLabel(c.rel) }}</span></div>
          <small class="muted">{{ ROLES[c.role].name }}</small>
          <div class="bar"><i :style="{ width: c.rel + '%', background: col(c.rel) }"></i></div>
          <small v-if="perk(c)" :class="perk(c).cls">{{ perk(c).t }}</small>
          <small v-else class="muted">Perto de 70: {{ ROLES[c.role].hiText }}</small>
        </div>
      </div>
    </div>
    <div class="sumbox" style="margin-top: 12px">
      <b>📞 Ligar para um contato</b>
      <p class="muted">Na Agenda, marque a ação "Ligar para um contato" no calendário. Bata papo para fortalecer a relação ou peça um favor (chance depende da proximidade).</p>
      <button class="primary" @click="emit('go', 'agenda')">Ir para a Agenda</button>
    </div>
  </div>
</template>