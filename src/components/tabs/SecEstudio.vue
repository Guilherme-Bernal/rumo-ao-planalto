<script setup>
import { computed, ref } from 'vue'
import {
  studioCanalNow, studioFormatos, studioEquip, studioGravarMotivo, studioGravar, studioEquipMotivo, studioEquipComprar,
  studioJornalNow, studioLinhas, studioManchetes, studioFundarMotivo, studioFundar, studioEdicaoMotivo, studioEdicao,
  studioPosturas, studioColetivaMotivo, studioColetiva,
} from '../../game/engine'

const msg = ref('')
const nome = ref('')
const linha = ref('serio')
const canal = computed(() => studioCanalNow())
const jornal = computed(() => studioJornalNow())
const say = (r) => { msg.value = r ? r.txt : '' }
const cor = (v) => (v >= 60 ? 'var(--good)' : v <= 35 ? 'var(--bad)' : 'var(--accent)')
const prox = computed(() => (canal.value ? studioEquip()[canal.value.qual] : studioEquip()[0]))
</script>

<template>
  <div class="sn-box">
    <h3>🎬 Estúdio: canal, jornal e imprensa</h3>
    <p class="muted">Faça a sua própria comunicação. Vídeos e edições rendem popularidade e imagem, mas fracassam às vezes. Jornal sem credibilidade vira problema.</p>
    <p v-if="msg" class="sumbox" role="status">{{ msg }}</p>

    <div class="sumbox">
      <b>📹 Seu canal de vídeos</b>
      <small class="muted"> · {{ canal ? canal.insc + ' mil inscritos · ' + canal.vids + ' vídeo(s) · equipamento ' + canal.qual + '/3' : 'ainda sem vídeos' }}</small>
      <div class="acts">
        <button v-for="f in studioFormatos()" :key="f.id" type="button" :disabled="!!studioGravarMotivo(f.id)" :title="f.desc" @click="say(studioGravar(f.id))">
          <b>{{ f.icon }} {{ f.nome }}</b><small>{{ f.desc }}</small><small v-if="studioGravarMotivo(f.id)" class="why">🔒 {{ studioGravarMotivo(f.id) }}</small>
        </button>
        <button v-if="prox" type="button" :disabled="!!studioEquipMotivo()" @click="say(studioEquipComprar())">
          <b>🎥 Melhorar o estúdio</b><small>{{ prox.nome }}. Custa {{ prox.custo }} de caixa e aumenta a chance dos vídeos.</small><small v-if="studioEquipMotivo()" class="why">🔒 {{ studioEquipMotivo() }}</small>
        </button>
      </div>
    </div>

    <div class="sumbox" style="margin-top: 8px">
      <template v-if="jornal">
        <b>📰 {{ jornal.nome }}</b>
        <small class="muted"> · {{ jornal.ed }} edição(ões) · tiragem {{ jornal.tir }} mil · credibilidade {{ jornal.cred }}</small>
        <div class="bar"><i :style="{ width: jornal.cred + '%', background: cor(jornal.cred) }"></i></div>
        <div class="acts">
          <button v-for="m in studioManchetes()" :key="m.id" type="button" :disabled="!!studioEdicaoMotivo(m.id)" :title="m.desc" @click="say(studioEdicao(m.id))">
            <b>{{ m.icon }} {{ m.nome }}</b><small>{{ m.desc }} Custa {{ m.cash }} de caixa.</small><small v-if="studioEdicaoMotivo(m.id)" class="why">🔒 {{ studioEdicaoMotivo(m.id) }}</small>
          </button>
        </div>
      </template>
      <template v-else>
        <b>📰 Fundar um jornal</b>
        <p class="muted">Dê um nome e escolha a linha editorial. Custa 4 de caixa. Jornal crível rende anúncios e blinda contra escândalos.</p>
        <input v-model="nome" type="text" maxlength="28" placeholder="Nome do jornal" aria-label="Nome do jornal" class="in" />
        <div class="acts">
          <button v-for="l in studioLinhas()" :key="l.id" type="button" :class="{ on: linha === l.id }" @click="linha = l.id">
            <b>{{ l.icon }} {{ l.nome }}</b><small>{{ l.desc }}</small>
          </button>
        </div>
        <button type="button" class="primary" :disabled="!!studioFundarMotivo(nome, linha)" @click="say(studioFundar(nome, linha))">📰 Fundar o jornal</button>
        <small v-if="studioFundarMotivo(nome, linha)" class="why"> 🔒 {{ studioFundarMotivo(nome, linha) }}</small>
      </template>
    </div>

    <div class="sumbox" style="margin-top: 8px">
      <b>🎙️ Coletiva de imprensa</b>
      <div class="acts">
        <button v-for="o in studioPosturas()" :key="o.id" type="button" :disabled="!!studioColetivaMotivo(o.id)" :title="o.desc" @click="say(studioColetiva(o.id))">
          <b>{{ o.icon }} {{ o.nome }}</b><small>{{ o.desc }}</small><small v-if="studioColetivaMotivo(o.id)" class="why">🔒 {{ studioColetivaMotivo(o.id) }}</small>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acts { display: grid; gap: 6px; margin-top: 6px; }
.acts button { text-align: left; display: grid; gap: 2px; }
.acts button.on { outline: 2px solid var(--accent); }
.in { width: 100%; margin: 6px 0; padding: 8px; border-radius: 8px; border: 1px solid var(--line, #8884); background: transparent; color: inherit; }
</style>
