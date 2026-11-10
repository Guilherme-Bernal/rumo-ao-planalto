<script setup>
import { computed } from 'vue'
import { game, debateNow, debateAbordagens, debateAbordar, debateFechar } from '../../game/engine'
import { TRAITS } from '../../game/reunioes'

const d = computed(() => (game.election ? debateNow() : null))
const trait = computed(() => (d.value && d.value.reveal ? TRAITS[game.election.rivalTrait] : null))
const passoTxt = computed(() => (d.value ? ['', 'Pergunta de abertura', 'Réplica', 'Tréplica (a última palavra)'][d.value.step] || '' : ''))
</script>

<template>
  <div v-if="d" class="deb-bg" role="dialog" aria-modal="true">
    <div class="deb">
      <h2>📺 Debate: {{ d.tema.icon }} {{ d.tema.tema }}</h2>
      <p class="muted">Adversário: <b>{{ game.election.rivalName }}</b> · temperamento: <b>{{ trait ? trait.icon + ' ' + trait.label : '❓ ainda não revelado' }}</b>. Leia as reações dele para escolher bem.</p>
      <div class="meters">
        <div><small>👏 Plateia {{ Math.round(d.aud) }}</small><div class="m"><i :style="{ width: d.aud + '%' }"></i></div></div>
        <div><small>😤 Calma do adversário {{ Math.round(d.riv) }}</small><div class="m r"><i :style="{ width: d.riv + '%' }"></i></div></div>
      </div>
      <div v-for="f in d.falas" :key="f.passo" class="troca">
        <p><b>Você ({{ f.passo === 1 ? 'abertura' : f.passo === 2 ? 'réplica' : 'tréplica' }}):</b> {{ f.eu }} <small class="muted">plateia {{ f.a > 0 ? '+' : '' }}{{ f.a }}, calma dele -{{ f.r }}</small></p>
        <p class="rv"><b>{{ game.election.rivalName }}:</b> {{ f.rival }}</p>
      </div>
      <template v-if="!d.res">
        <h3>🗣️ {{ passoTxt }}: como você responde?</h3>
        <div class="opts">
          <button v-for="a in debateAbordagens()" :key="a.id" type="button" @click="debateAbordar(a.id)"><b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small></button>
        </div>
      </template>
      <template v-else>
        <p class="sumbox"><b>{{ d.res.tv > 1 ? '🏆 Você foi bem no debate.' : d.res.tv > 0 ? '🙂 Debate morno, saldo positivo.' : '😬 O debate não ajudou.' }}</b> Efeito na eleição: {{ d.res.tv > 0 ? '+' : '' }}{{ d.res.tv }} ponto(s). Plateia {{ d.res.aud }} · calma dele {{ d.res.riv }}.</p>
        <button class="primary" type="button" @click="debateFechar">Encerrar o debate</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.deb-bg { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, 0.72); display: flex; align-items: center; justify-content: center; padding: 12px; overflow-y: auto; }
.deb { width: min(680px, 100%); max-height: 94vh; overflow-y: auto; background: var(--panel, #1a2233); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 16px; padding: 16px; }
.meters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0; }
.m { height: 8px; border-radius: 6px; background: rgba(255, 255, 255, 0.14); overflow: hidden; }
.m i { display: block; height: 100%; background: var(--good); }
.m.r i { background: var(--bad); }
.troca { margin: 8px 0; padding: 6px 8px; border-left: 3px solid var(--accent); background: rgba(255, 255, 255, 0.05); border-radius: 6px; }
.troca p { margin: 3px 0; }
.rv { font-style: italic; }
.opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; }
.opts button { text-align: left; padding: 8px 10px; }
.opts small { display: block; margin-top: 3px; opacity: 0.9; }
</style>
