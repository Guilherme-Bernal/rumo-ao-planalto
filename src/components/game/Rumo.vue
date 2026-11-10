<script setup>
import { computed } from 'vue'
import { game, officeInfo, pathOptions, chooseRumo, retireCareer, ageNow, sucessaoMotivo, iniciarSucessao } from '../../game/engine'

const opts = computed(() => pathOptions())
const cur = computed(() => officeInfo())
</script>

<template>
  <div>
    <h2>🧭 Para onde vai a sua carreira?</h2>
    <p class="lead">
      O mandato de {{ cur.name }} terminou<span v-if="ageNow() != null">, você tem {{ ageNow() }} anos</span>. Escolha o próximo passo. Quem tenta um cargo muito acima do atual enfrenta uma disputa bem mais dura.
    </p>
    <div class="choices">
      <button v-for="o in opts" :key="o.id" class="act" :disabled="!!o.lock" @click="chooseRumo(o.id)">
        <b>{{ o.icon }} {{ o.same ? 'Reeleição: ' : '' }}{{ o.name }} <span class="chip">{{ o.tag }}</span></b>
        <small v-if="o.lock">🔒 {{ o.lock }}</small>
        <small v-else>{{ o.law }}</small>
      </button>
    </div>
    <div class="sumbox" style="margin-top: 12px">
      <b>⚖️ Regras que valem aqui</b>
      <div class="muted">Cargos do Executivo (prefeito, governador, presidente) têm uma reeleição seguida e, para disputar outro cargo, o titular renuncia seis meses antes (desincompatibilização).</div>
      <div class="muted">Legislativo (vereador, deputado) não tem limite de reeleições.</div>
    </div>
    <button style="width: 100%; margin-top: 12px" :disabled="!!sucessaoMotivo()" :title="sucessaoMotivo()" @click="iniciarSucessao">🎓 Passar o bastão: apoiar um sucessor na eleição</button>
    <button style="width: 100%; margin-top: 8px" @click="retireCareer">🏁 Encerrar a carreira por aqui</button>
  </div>
</template>