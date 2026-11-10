<script setup>
import { computed, ref } from 'vue'
import Avatar from '../character/Avatar.vue'
import LookEditor from '../character/LookEditor.vue'
import { game, sucessaoNow, sucPerfis, sucAcoes, sucEscolher, sucEditar, sucAcaoMotivo, sucAgir, sucConcluir, sucCancelar } from '../../game/engine'

const s = computed(() => (game.phase === 'rumo' ? sucessaoNow() : null))
const perfil = (id) => sucPerfis().find((p) => p.id === id)
const editando = ref(false)
const nome = ref('')
const look = ref(null)
const abrirEdicao = () => { nome.value = s.value.nome; look.value = { ...s.value.look }; editando.value = true }
const salvar = () => { sucEditar(nome.value, look.value); editando.value = false }
const ultimo = computed(() => (s.value && s.value.log.length ? s.value.log[s.value.log.length - 1] : ''))
const barra = computed(() => (s.value ? Math.max(0, Math.min(100, (s.value.forca / (s.value.forca + s.value.rival)) * 100)) : 50))
</script>

<template>
  <div v-if="s" class="suc-bg" role="dialog" aria-modal="true">
    <div class="suc">
      <h2>🎓 Sucessão: passando o bastão</h2>

      <template v-if="s.etapa === 0">
        <p class="muted">Escolha quem vai disputar o seu lugar. Cada perfil tem um jeito de fazer campanha. Depois você pode mudar o nome e o visual.</p>
        <div class="cands">
          <button v-for="(c, i) in s.cands" :key="i" type="button" class="cand" @click="sucEscolher(i)">
            <Avatar :look="c.look" :size="84" cargo="presidente" :idade="45" />
            <b>{{ c.nome }}</b>
            <small>{{ perfil(c.perfil).icon }} {{ perfil(c.perfil).name }}</small>
            <small class="muted">{{ perfil(c.perfil).desc }}</small>
          </button>
        </div>
        <button type="button" @click="sucCancelar">↩ Voltar sem escolher</button>
      </template>

      <template v-else-if="s.etapa <= 3">
        <div class="head">
          <Avatar :look="s.look" :size="96" cargo="presidente" :idade="45" />
          <div>
            <b>{{ s.nome }}</b> <small class="muted">{{ perfil(s.esc).icon }} {{ perfil(s.esc).name }}</small>
            <div class="muted">Campanha, etapa {{ s.etapa }} de 3 · faça 2 ações por etapa</div>
            <div class="meter"><i :style="{ width: barra + '%' }"></i></div>
            <small class="muted">Força do sucessor {{ Math.round(s.forca) }} contra {{ s.rival }} do adversário (sorte pode mudar a conta)</small>
            <div><button type="button" class="mini" @click="abrirEdicao">🎨 Editar nome e visual</button></div>
          </div>
        </div>
        <p v-if="ultimo" class="sumbox">{{ ultimo }}</p>
        <div class="acts">
          <button v-for="a in sucAcoes()" :key="a.id" type="button" :disabled="!!sucAcaoMotivo(a.id)" @click="sucAgir(a.id)">
            <b>{{ a.icon }} {{ a.name }}</b><small>{{ a.desc }}</small><small v-if="sucAcaoMotivo(a.id)" class="why">🔒 {{ sucAcaoMotivo(a.id) }}</small>
          </button>
        </div>
      </template>

      <template v-else>
        <div class="head">
          <Avatar :look="s.look" :size="110" cargo="presidente" :idade="45" />
          <div>
            <h3>{{ s.fim.won ? '🏆 ' + s.nome + ' foi eleito(a)!' : '📉 ' + s.nome + ' perdeu a eleição' }}</h3>
            <p class="muted">{{ s.fim.won ? 'O seu projeto continua. Você entra para a história como quem soube passar o bastão.' : 'A transição não deu certo. O capital político foi mais difícil de transferir do que parecia.' }}</p>
            <p class="muted">Margem: {{ s.fim.margem > 0 ? '+' : '' }}{{ s.fim.margem }}</p>
          </div>
        </div>
        <button class="primary" type="button" @click="sucConcluir">Encerrar a carreira</button>
      </template>

      <div v-if="editando" class="edit">
        <h3>🎨 Visual do sucessor</h3>
        <label class="muted">Nome <input v-model="nome" maxlength="40" /></label>
        <LookEditor v-model="look" cargo="presidente" :idade="45" />
        <button type="button" class="primary" @click="salvar">Salvar</button>
        <button type="button" @click="editando = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.suc-bg { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; padding: 12px; overflow-y: auto; }
.suc { width: min(720px, 100%); max-height: 94vh; overflow-y: auto; background: var(--panel, #1a2233); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 16px; padding: 16px; }
.cands { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; margin: 10px 0; }
.cand { display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center; padding: 10px; }
.head { display: flex; gap: 12px; align-items: center; margin: 8px 0; flex-wrap: wrap; }
.meter { height: 8px; border-radius: 6px; background: rgba(255, 255, 255, 0.14); overflow: hidden; margin: 6px 0 2px; }
.meter i { display: block; height: 100%; background: var(--accent); }
.acts { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; margin: 8px 0; }
.acts button { text-align: left; padding: 8px 10px; }
.acts small { display: block; margin-top: 3px; opacity: 0.9; }
.why { color: var(--warn); }
.edit { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.18); display: grid; gap: 8px; }
</style>
