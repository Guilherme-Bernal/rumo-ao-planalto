<script setup>
import { ref, computed } from 'vue'
import { countryList, hasSave, loadGame, startGame, STATS, baseStats, acceptChance, initialInvites, randomPlanName } from '../../game/engine'
import { ACHIEVEMENTS, loadHall, loadUnlocked, randomName } from '../../game/extras'
import { modsFor, defaultPicks } from '../../game/traits'
import { AGE_MIN, AGE_MAX, AGE_DEF, ageMods, ageGate } from '../../game/countries/brasil-traits'
import { PRESETS } from '../../game/presets'
import { AFF_TEXT, affinity } from '../../game/countries/brasil-parties'
import { perkChips } from '../../game/ideas'
import { downloadSave, importSave } from '../../game/savefile'
import BrazilMap from '../shared/BrazilMap.vue'
import PlanEditor from '../character/PlanEditor.vue'
import PartyFounder from '../character/PartyFounder.vue'
import Avatar from '../character/Avatar.vue'
import LookEditor from '../character/LookEditor.vue'
import { defaultLook, randomLook } from '../../game/look'

const country = ref(countryList()[0])
const c = country.value
const step = ref(0) // 0 = início, 1..4 = assistente
const daily = ref(false)
const name = ref('')
const look = ref(defaultLook())
const archetype = ref(c.archetypes[0].id)
const picks = ref({ ...defaultPicks(c), idade: AGE_DEF })
const ageBand = computed(() => ageMods(Number(picks.value.idade)))
const gateOf = (cat, o) => (c.id === 'brasil' ? ageGate(cat.id, o.id, Number(picks.value.idade)) : null)
function fixAge() {
  for (const cat of c.traits) {
    const cur = cat.options.find((o) => o.id === picks.value[cat.id])
    if (cur && gateOf(cat, cur)) picks.value[cat.id] = (cat.options.find((o) => o.id === cat.def && !gateOf(cat, o)) || cat.options.find((o) => !gateOf(cat, o))).id
  }
}
const regionId = ref('SP')
const cityName = ref('')
const partyId = ref(null)
const tried = ref({}) // partido -> 'recusou'
const ownP = ref(null) // partido fundado por você
const founding = ref(false)
const pFilter = ref('todos')
const cFilter = ref('todas')
const partyMsg = ref('')
const planName = ref(randomPlanName())
const planIds = ref([])
const saved = hasSave()
const fileIn = ref(null)
const impMsg = ref('')
function onImport(e) {
  const f = e.target.files[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => {
    const res = importSave(String(r.result))
    impMsg.value = res.msg
    if (res.ok) setTimeout(() => location.reload(), 800)
  }
  r.readAsText(f)
  e.target.value = ''
}
const hall = loadHall().slice(0, 5)
const unlocked = loadUnlocked()

const STEPS = ['Personagem', 'Origem', 'Partido', 'Plano']
const short = Object.fromEntries(STATS.map((s) => [s.k, s.short]))
const pct = (m) => `${m > 1 ? '+' : ''}${Math.round((m - 1) * 100)}%`

function lines(o) {
  const out = []
  for (const [k, v] of Object.entries(o.fx || {})) out.push({ t: `${v > 0 ? '+' : ''}${v} ${short[k]} no início`, good: v > 0 })
  for (const [k, m] of Object.entries(o.gain || {})) out.push({ t: `${m > 1 ? '▲' : '▼'} ganha ${pct(m)} em ${short[k]}`, good: m > 1 })
  for (const [k, m] of Object.entries(o.loss || {})) out.push({ t: `⚠ perde ${pct(m)} a mais em ${short[k]}`, good: false })
  if (o.camp) out.push({ t: `🎫 campanha ${Math.round((1 - o.camp) * 100)}% mais barata`, good: true })
  if (o.baseP) out.push({ t: `🎤 carisma: popularidade se mantém +${o.baseP}`, good: true })
  return out
}
const fxLines = (fx) => Object.entries(fx || {}).map(([k, v]) => ({ t: `${v > 0 ? '+' : ''}${v} ${short[k]}`, good: v > 0 }))

const arch = computed(() => c.archetypes.find((a) => a.id === archetype.value))
const state = computed(() => c.regions.find((r) => r.id === regionId.value))
const city = computed(() => state.value.cities.find((x) => x.name === cityName.value) || state.value.cities[0])
const ideoOpt = computed(() => c.traits.find((t) => t.id === 'ideologia').options.find((o) => o.id === picks.value.ideologia))
const ideo = computed(() => ideoOpt.value.axis || ideoOpt.value.id) // linha política usada pelos partidos
const ARCH_ICON = { tecnico: '🧮', populista: '📢', negociador: '🤝', outsider: '🚪' }
const charStats = computed(() => {
  const m = modsFor(c.id, picks.value)
  const s = { ...baseStats() }
  const add = (fx) => { for (const [k, v] of Object.entries(fx)) s[k] = Math.max(0, Math.min(100, s[k] + v)) }
  add(arch.value.fx)
  add(m.start)
  return s
})
const charBars = computed(() => STATS.map((s) => ({ ...s, v: Math.round(charStats.value[s.k]), d: Math.round(charStats.value[s.k] - baseStats()[s.k]) })))
const chosen = computed(() => c.traits.map((t) => ({ label: t.label, o: t.options.find((o) => o.id === picks.value[t.id]) })))

const stats = computed(() => {
  const m = modsFor(c.id, picks.value)
  const s = { ...baseStats() }
  const add = (fx) => { for (const [k, v] of Object.entries(fx)) s[k] = Math.max(0, Math.min(100, s[k] + v)) }
  add(arch.value.fx)
  add(m.start)
  add(c.citySizes[city.value.size].fx)
  return s
})
const mods = computed(() => {
  const m = modsFor(c.id, picks.value)
  const gains = Object.entries(m.gain).filter(([, v]) => Math.abs(v - 1) > 0.01).map(([k, v]) => ({ t: `${v > 1 ? '▲' : '▼'} ${short[k]} ${pct(v)}`, good: v > 1 }))
  const losses = Object.entries(m.loss).filter(([, v]) => Math.abs(v - 1) > 0.01).map(([k, v]) => ({ t: `⚠ ${short[k]} perdas ${pct(v)}`, good: false }))
  return [...gains, ...losses]
})
const invites = computed(() => initialInvites(c.parties, ideo.value, stats.value, name.value))
const chance = (p) => acceptChance(p, ideo.value, stats.value, 0)
const party = computed(() => (partyId.value === 'own' ? ownP.value : c.parties.find((p) => p.id === partyId.value)))
const IDEO = { esquerda: 'Esquerda', centro: 'Centro', direita: 'Direita', independente: 'Independente' }
const PFILTERS = [['todos', 'Todos'], ['convites', '✉️ Convites'], ['esquerda', 'Esquerda'], ['centro', 'Centro'], ['direita', 'Direita'], ['independente', 'Independente'], ['rico', '💰 Ricos'], ['maluco', '🤪 Esquisitos']]
const shownParties = computed(() => {
  const f = pFilter.value
  const l = c.parties.filter((p) => f === 'todos' || (f === 'convites' ? invites.value.includes(p.id) : f === 'rico' || f === 'maluco' ? p.tag === f : p.ideo === f))
  return l.sort((a, b) => invites.value.includes(b.id) - invites.value.includes(a.id) || chance(b) - chance(a))
})
const OWN_COST = [{ t: '💰 −5 caixa', good: false }, { t: '🏛️ −4 base', good: false }]
function found(p) {
  ownP.value = { ...p, ideo: ideo.value }
  partyId.value = 'own'
  founding.value = false
  partyMsg.value = `🎗️ Você fundou o ${p.sigla}!`
}
const useOwn = () => { partyId.value = 'own'; partyMsg.value = '' }
const color = (v) => (v < 30 ? 'var(--bad)' : v < 55 ? 'var(--warn)' : 'var(--good)')

const SIZE_ICON = { capital: '🏛️', grande: '🌆', media: '🏙️', pequena: '🏡' }
const SIZE_ORDER = ['capital', 'grande', 'media', 'pequena']
const CFILTERS = [['todas', 'Todas'], ['capital', 'Capital'], ['grande', 'Grandes'], ['media', 'Médias'], ['pequena', 'Pequenas']]
const HEAT = ['#3a4c6b', '#4b6a9e', '#5a8ad1', '#7db0ff']
const mapColors = computed(() => {
  const o = {}
  for (const r of c.regions) o[r.mapId] = HEAT[Math.min(3, r.bonus)]
  o[state.value.mapId] = '#fbbf24'
  return o
})
const mapInfo = computed(() => Object.fromEntries(c.regions.map((r) => [r.mapId, `Peso eleitoral ${['baixo', 'médio', 'alto', 'muito alto'][Math.min(3, r.bonus)]} · ${r.cities.length} cidades`])))
const cities = computed(() => [...state.value.cities].sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)).filter((x) => cFilter.value === 'todas' || x.size === cFilter.value))
const leanText = computed(() => { const l = state.value.lean; return l < -0.25 ? 'tende à esquerda' : l > 0.25 ? 'tende à direita' : 'eleitorado dividido' })
const leanFit = computed(() => {
  const l = state.value.lean
  const i = ideo.value
  if (i === 'esquerda') return l < -0.25 ? 1 : l > 0.25 ? -1 : 0
  if (i === 'direita') return l > 0.25 ? 1 : l < -0.25 ? -1 : 0
  return 0
})
const miniStats = computed(() => STATS.map((s) => ({ ...s, v: Math.round(stats.value[s.k]) })))
function pickState(mapId) {
  const r = c.regions.find((x) => x.mapId === mapId)
  if (!r) return
  regionId.value = r.id
  cityName.value = (r.cities.find((x) => x.size === 'capital') || r.cities[0]).name
  cFilter.value = 'todas'
}
pickState('sp')

function join(p) {
  if (invites.value.includes(p.id) || Math.random() < chance(p)) {
    partyId.value = p.id
    partyMsg.value = `✅ ${p.sigla} aceitou você!`
  } else {
    tried.value = { ...tried.value, [p.id]: true }
    partyMsg.value = `❌ ${p.sigla} recusou o seu pedido. Tente outro partido.`
  }
}

function applyPreset(p) {
  name.value = p.name
  look.value = { ...p.look }
  archetype.value = p.arch
  picks.value = { ...defaultPicks(c), ...p.picks, idade: p.age }
}
function randomPreset() {
  applyPreset(PRESETS[Math.floor(Math.random() * PRESETS.length)])
}
function rollCat(cat) {
  const ok = cat.options.filter((o) => !gateOf(cat, o))
  picks.value[cat.id] = ok[Math.floor(Math.random() * ok.length)].id
}
function rollAge() {
  picks.value.idade = AGE_MIN + Math.floor(Math.random() * 43)
  fixAge()
}

function randomChar() {
  name.value = randomName()
  look.value = randomLook()
  archetype.value = c.archetypes[Math.floor(Math.random() * c.archetypes.length)].id
  picks.value.idade = AGE_MIN + Math.floor(Math.random() * 43)
  for (const cat of c.traits) {
    const ok = cat.options.filter((o) => !gateOf(cat, o))
    picks.value[cat.id] = ok[Math.floor(Math.random() * ok.length)].id
  }
}
function randomOrigin() {
  const r = c.regions[Math.floor(Math.random() * c.regions.length)]
  regionId.value = r.id
  cityName.value = r.cities[Math.floor(Math.random() * r.cities.length)].name
  cFilter.value = 'todas'
}

function go(n) {
  step.value = n
  partyMsg.value = ''
}
function begin() {
  startGame({
    countryId: c.id, name: name.value, archetypeId: archetype.value, regionId: regionId.value, cityName: city.value.name,
    partyId: partyId.value === 'own' ? null : partyId.value, ownParty: partyId.value === 'own' ? ownP.value : null, plan: { name: planName.value, ids: planIds.value }, daily: daily.value, traits: { ...picks.value }, look: { ...look.value },
  })
}
function newCareer(isDaily) {
  daily.value = isDaily
  go(1)
}
const canNext = computed(() => (step.value === 3 ? !!partyId.value : true))
</script>

<template>
  <div class="screen">
    <div class="box panel wide">
      <!-- INÍCIO -->
      <template v-if="step === 0">
        <h1>🏛️ Rumo ao Planalto</h1>
        <p class="lead" style="margin: 8px 0 16px">Simulador de carreira política. Comece como vereador(a) e tente chegar à presidência. Escolha seu perfil, sua cidade no mapa, seu partido e monte o plano de governo.</p>
        <ul class="how">
          <li><b>1.</b> Crie o personagem, escolha o estado e a cidade no mapa e filie-se a um partido.</li>
          <li><b>2.</b> Cada rodada tem um evento (você decide) e até 2 ações para melhorar seus números.</li>
          <li><b>3.</b> No fim do mandato tem eleição. Chegue ao topo sem zerar a popularidade nem o caixa.</li>
        </ul>
        <div class="row-end" style="margin-top: 18px">
          <button class="primary" @click="newCareer(false)">Nova carreira</button>
          <button @click="newCareer(true)">📅 Desafio do dia</button>
          <button v-if="saved" @click="loadGame">Continuar jogo salvo</button>
        </div>
        <p class="legend">Desafio do dia: todo mundo joga hoje com os mesmos eventos. Dá para comparar o resultado com os amigos.</p>
        <div class="savebar">
          <button @click="downloadSave">💾 Exportar save</button>
          <button @click="fileIn.click()">📂 Importar save</button>
          <input ref="fileIn" type="file" accept=".json,application/json" hidden @change="onImport" />
          <span v-if="impMsg" class="muted">{{ impMsg }}</span>
        </div>

        <details v-if="hall.length">
          <summary>🏅 Hall da fama (neste navegador)</summary>
          <div class="hall">
            <div v-for="(h, i) in hall" :key="i">
              <span>{{ i + 1 }}. {{ h.name }} ({{ h.region }}) · {{ h.label }}<template v-if="h.daily"> 📅</template></span>
              <span>{{ h.points }} pts</span>
            </div>
          </div>
        </details>
        <details>
          <summary>🏆 Conquistas ({{ unlocked.length }}/{{ ACHIEVEMENTS.length }})</summary>
          <div class="trophies">
            <span v-for="a in ACHIEVEMENTS" :key="a.id" class="trophy" :class="{ locked: !unlocked.includes(a.id) }" :title="a.desc">{{ a.icon }} {{ a.name }}</span>
          </div>
        </details>
      </template>

      <!-- ASSISTENTE -->
      <template v-else>
        <div class="stepper">
          <span v-for="(s, i) in STEPS" :key="s" :class="{ on: step === i + 1, done: step > i + 1 }" @click="step > i + 1 && go(i + 1)"><em>{{ step > i + 1 ? '✓' : i + 1 }}</em>{{ s }}</span>
        </div>
        <p v-if="daily" class="legend" style="margin: 0 0 8px">📅 Desafio do dia</p>

        <!-- 1. PERSONAGEM -->
        <template v-if="step === 1">
          <h2>Quem é você?</h2>
          <p class="muted">Cada escolha muda seus números iniciais e como o jogo trata você. O resumo ao lado mostra o resultado na hora.</p>
          <div class="char">
            <div class="char-main">
              <div class="namerow">
                <input v-model="name" maxlength="28" placeholder="Seu nome político (Ex.: Dra. Marina, Zé do Pastel)" />
                <button type="button" title="Sortear nome e perfil" @click="randomChar">🎲 Sortear tudo</button>
                <button type="button" title="Escolher um personagem pronto ao acaso" @click="randomPreset">🎴 Personagem pronto</button>
              </div>

              <section class="tsec">
                <h3>🎴 Personagens prontos</h3>
                <p class="hint">Escolha um personagem pronto e depois mude o que quiser.</p>
                <div class="presets">
                  <button v-for="p in PRESETS" :key="p.id" type="button" class="tcard preset" @click="applyPreset(p)">
                    <Avatar :look="p.look" :size="44" />
                    <b>{{ p.name }}</b>
                    <small>{{ p.tag }} · {{ p.age }} anos</small>
                    <small>{{ p.desc }}</small>
                  </button>
                </div>
              </section>
              <p class="legend">▲ ganha mais · ▼ ganha menos · ⚠ perde mais quando dá errado · "no início" é bônus ou ônus de partida</p>

              <section class="tsec">
                <h3>🧑 Seu visual</h3>
                <p class="hint">Monte o rosto do seu personagem. Ele aparece nas redes, no painel e no fim da carreira.</p>
                <LookEditor v-model="look" />
              </section>

              <section class="tsec">
                <h3>🎭 Seu estilo</h3>
                <div class="tgrid">
                  <button v-for="a in c.archetypes" :key="a.id" class="tcard" :class="{ sel: archetype === a.id }" @click="archetype = a.id">
                    <span class="tc-ico">{{ ARCH_ICON[a.id] || '🙂' }}</span>
                    <span class="tc-body"><b>{{ a.name }}</b><small>{{ a.desc }}</small>
                      <span><span v-for="(l, i) in lines({ fx: a.fx })" :key="i" class="chip" :class="l.good ? 'up' : 'down'">{{ l.t }}</span></span></span>
                  </button>
                </div>
              </section>

              <section v-if="c.id === 'brasil'" class="tsec">
                <h3>🎂 Idade <button type="button" class="cat-dice" title="Sortear idade" @click="rollAge">🎲</button></h3>
                <p class="hint">A idade muda seus números iniciais e libera ou bloqueia formação, carreira e patrimônio. Cada cargo tem idade mínima: deputado 21, governador 30 e presidente 35. Se você chegar à eleição sem a idade, repete o mandato até ter. O tempo passa durante a carreira e a saúde pode pesar depois dos 45.</p>
                <div class="agebox">
                  <input v-model.number="picks.idade" type="range" :min="AGE_MIN" :max="AGE_MAX" @input="fixAge" />
                  <b class="agenum">{{ picks.idade }} anos</b>
                </div>
                <div class="tcard sel agecard">
                  <span class="tc-ico">{{ ageBand.icon }}</span>
                  <span class="tc-body"><b>{{ ageBand.name }}</b><small>{{ ageBand.desc }}</small>
                    <span><span v-for="(l, i) in lines(ageBand)" :key="i" class="chip" :class="l.good ? 'up' : 'down'">{{ l.t }}</span></span></span>
                </div>
              </section>

              <section v-for="cat in c.traits" :key="cat.id" class="tsec">
                <h3>{{ cat.label }} <button type="button" class="cat-dice" title="Sortear esta categoria" @click="rollCat(cat)">🎲</button></h3>
                <p v-if="cat.hint" class="hint">{{ cat.hint }}</p>
                <div class="tgrid">
                  <button v-for="o in cat.options" :key="o.id" class="tcard" :class="{ sel: picks[cat.id] === o.id, locked: gateOf(cat, o) }" :disabled="!!gateOf(cat, o)" @click="picks[cat.id] = o.id">
                    <span class="tc-ico">{{ o.icon || '•' }}</span>
                    <span class="tc-body"><b>{{ o.name }}</b><small>{{ o.desc }}</small>
                      <span>
                        <span v-if="o.axis && o.axis !== o.id" class="chip">🧲 linha: {{ o.axis }}</span>
                        <span v-if="gateOf(cat, o)" class="chip warn">🔒 {{ gateOf(cat, o) }}</span>
                        <span v-for="(l, i) in lines(o)" :key="i" class="chip" :class="l.good ? 'up' : 'down'">{{ l.t }}</span>
                      </span></span>
                  </button>
                </div>
              </section>
            </div>

            <aside class="char-side">
              <div class="cs-head">
                <Avatar :look="look" :size="56" />
                <div><b>{{ name || 'Seu nome político' }}</b><small>{{ picks.idade }} anos · {{ arch.name }} · {{ ideoOpt.name }}</small></div>
              </div>
              <ul class="cs-list">
                <li v-for="x in chosen" :key="x.label"><span>{{ x.o.icon }}</span><span><small>{{ x.label }}</small><b>{{ x.o.name }}</b></span></li>
              </ul>
              <h4>Números iniciais</h4>
              <div v-for="s in charBars" :key="s.k" class="stat">
                <div class="row"><span>{{ s.icon }} {{ s.short }}</span><span>{{ s.v }} <small :class="s.d > 0 ? 'up' : s.d < 0 ? 'down' : 'muted'">{{ s.d > 0 ? '+' : '' }}{{ s.d }}</small></span></div>
                <div class="bar"><i :style="{ width: s.v + '%', background: color(s.v) }"></i></div>
              </div>
              <h4 v-if="mods.length">Efeitos ao longo do jogo</h4>
              <div><span v-for="(m, i) in mods" :key="i" class="chip" :class="m.good ? 'up' : 'down'">{{ m.t }}</span></div>
              <p class="legend">Partidos te veem como <b>{{ IDEO[ideo] }}</b>.</p>
            </aside>
          </div>
        </template>

        <!-- 2. ORIGEM -->
        <template v-if="step === 2">
          <h2>De onde você vem?</h2>
          <p class="muted">Escolha o estado no mapa e depois a cidade onde vai disputar a vaga de vereador(a). Estados mais claros pesam mais na eleição.</p>
          <div class="orig">
            <div class="orig-map">
              <BrazilMap interactive :selected="state.mapId" :colors="mapColors" :info="mapInfo" @select="pickState" />
              <div class="legendmap">
                <span><i style="background: #3a4c6b"></i>peso baixo</span><span><i style="background: #4b6a9e"></i>médio</span><span><i style="background: #5a8ad1"></i>alto</span><span><i style="background: #7db0ff"></i>muito alto</span><span><i style="background: #fbbf24"></i>seu estado</span>
              </div>
            </div>
            <div class="orig-side">
              <div class="orig-state">
                <div class="orig-title"><b>{{ state.name }}</b><span class="chip">{{ state.id }}</span><button type="button" class="orig-dice" title="Sortear estado e cidade" @click="randomOrigin">🎲 Sortear</button></div>
                <div class="orig-facts">
                  <div><small>Peso eleitoral</small><span class="pips"><i v-for="n in 4" :key="n" :class="{ on: n <= state.bonus + 1 }"></i></span><b>{{ ['baixo', 'médio', 'alto', 'muito alto'][Math.min(3, state.bonus)] }}</b></div>
                  <div><small>Eleitorado</small><b>{{ leanText }}</b>
                    <span v-if="leanFit > 0" class="chip up">combina com o seu perfil</span><span v-else-if="leanFit < 0" class="chip down">de outra linha política</span></div>
                </div>
              </div>
              <div class="seg">
                <button v-for="f in CFILTERS" :key="f[0]" type="button" :class="{ on: cFilter === f[0] }" @click="cFilter = f[0]">{{ f[1] }}</button>
              </div>
              <div class="citygrid">
                <button v-for="ct in cities" :key="ct.name" class="city" :class="{ sel: city.name === ct.name }" @click="cityName = ct.name">
                  <span class="city-ico">{{ SIZE_ICON[ct.size] }}</span>
                  <span class="city-nm"><b>{{ ct.name }}</b><small>{{ c.citySizes[ct.size].label }}</small></span>
                  <span class="city-fx"><span v-for="(l, i) in fxLines(c.citySizes[ct.size].fx)" :key="i" class="chip" :class="l.good ? 'up' : 'down'">{{ l.t }}</span><span v-if="!Object.keys(c.citySizes[ct.size].fx).length" class="chip">equilibrada</span></span>
                </button>
                <p v-if="!cities.length" class="muted">Nenhuma cidade desse tamanho neste estado.</p>
              </div>
            </div>
          </div>
          <div class="sumbox orig-sum">
            <div><b>🏁 Largada:</b> vereador(a) em <b>{{ city.name }}</b> ({{ state.id }}). <span class="muted">{{ c.citySizes[city.size].desc }}</span></div>
            <div class="minibars">
              <div v-for="s in miniStats" :key="s.k" :title="s.label"><span>{{ s.icon }}</span><div class="bar"><i :style="{ width: s.v + '%', background: color(s.v) }"></i></div><b>{{ s.v }}</b></div>
            </div>
          </div>
        </template>

        <!-- 3. PARTIDO -->
        <template v-if="step === 3">
          <h2>Escolha seu partido</h2>
          <p class="muted">Sem partido não há candidatura. Quem já te convidou entra direto; nos outros você pede filiação e pode ser recusado(a). Ideologia parecida aumenta a chance.</p>
          <div class="pintro">
            <span class="chip">Seu perfil: <b>{{ IDEO[ideo] }}</b></span>
            <span class="chip up">✉️ {{ invites.length }} convite{{ invites.length === 1 ? '' : 's' }}</span>
          </div>
          <p v-if="partyMsg" class="notice">{{ partyMsg }}</p>

          <div class="pc-new" :class="{ open: founding, chosen: partyId === 'own' }">
            <div class="pc-newhead">
              <span class="pc-star">✨</span>
              <div v-if="ownP">
                <b>{{ ownP.sigla }} · {{ ownP.name }}</b>
                <small>Seu partido. Começa sem estrutura: −5 caixa e −4 base no início.</small>
              </div>
              <div v-else>
                <b>Prefere fundar o seu próprio partido?</b>
                <small>Escolha nome, sigla, cor, slogan e foco. Sem chance de recusa, mas você começa com −5 caixa e −4 base.</small>
              </div>
              <template v-if="!founding">
                <button v-if="ownP && partyId !== 'own'" class="primary" @click="useOwn">Usar este</button>
                <button v-if="ownP" @click="founding = true">Editar</button>
                <button v-else class="primary" @click="founding = true">Criar partido</button>
              </template>
              <button v-else @click="founding = false">Fechar</button>
            </div>
            <PartyFounder v-if="founding" :ideo="ideo" :initial="ownP" :cost="OWN_COST" cta="Fundar e usar" @found="found" @cancel="founding = false" />
          </div>

          <div class="seg" style="margin-top: 14px">
            <button v-for="f in PFILTERS" :key="f[0]" type="button" :class="{ on: pFilter === f[0] }" @click="pFilter = f[0]">{{ f[1] }}</button>
          </div>
          <div class="pgrid">
            <div v-for="p in shownParties" :key="p.id" class="pc" :class="{ sel: partyId === p.id }" :style="{ '--pc': p.color }">
              <span v-if="partyId === p.id" class="pc-ribbon">✔ seu partido</span>
              <div class="pc-head">
                <span class="pc-badge">{{ p.sigla }}</span>
                <div><b>{{ p.name }}</b><small>“{{ p.slogan }}”</small></div>
              </div>
              <div class="pc-perks"><span class="chip">{{ IDEO[p.ideo] }}</span><span v-if="p.tag" class="chip warn">{{ p.tag === 'rico' ? '💰 elite' : '🤪 esquisito' }}</span><span v-for="(k, i) in perkChips(p.perks)" :key="i" class="chip" :class="k.good ? 'up' : 'down'">{{ k.t }}</span></div>
              <div class="pfoot">
                <div class="aff" :title="AFF_TEXT[affinity(ideo, p)]">
                  <span class="pips"><i v-for="n in 3" :key="n" :class="{ on: n <= affinity(ideo, p) + 1 }"></i></span>
                  <small v-if="invites.includes(p.id)" class="up">✉️ convidou você</small>
                  <small v-else>{{ AFF_TEXT[affinity(ideo, p)] }} · {{ Math.round(chance(p) * 100) }}%</small>
                </div>
                <button v-if="partyId === p.id" disabled>Selecionado</button>
                <button v-else-if="tried[p.id]" disabled>Recusou</button>
                <button v-else-if="invites.includes(p.id)" class="primary" @click="join(p)">Aceitar convite</button>
                <button v-else @click="join(p)">Pedir filiação</button>
              </div>
            </div>
            <p v-if="!shownParties.length" class="muted">Nenhum partido neste filtro.</p>
          </div>
        </template>

        <!-- 4. PLANO -->
        <template v-if="step === 4">
          <h2>Monte seu plano de governo</h2>
          <p class="muted">Bandeiras são promessas de campanha. Prometer anima o povo agora, cumprir rende votos e quebrar cobra caro.</p>
          <PlanEditor v-model:name="planName" v-model:ids="planIds" :stats="stats" />
          <div class="sumbox">
            <div class="sumhead">
              <span v-if="party" class="pc-badge" :style="{ '--pc': party.color }">{{ party.sigla }}</span>
              <div>
                <b>{{ name || 'Candidato(a)' }}</b>
                <p class="muted">{{ arch.name }}, {{ c.traits.map((t) => t.options.find((o) => o.id === picks[t.id]).name).join(', ') }}. Candidato(a) a vereador(a) em {{ city.name }} ({{ state.id }}).</p>
              </div>
            </div>
            <div class="sumgrid">
              <div v-for="s in STATS" :key="s.k" class="stat">
                <div class="row"><span>{{ s.icon }} {{ s.short }}</span><span>{{ Math.round(stats[s.k]) }}</span></div>
                <div class="bar"><i :style="{ width: stats[s.k] + '%', background: color(stats[s.k]) }"></i></div>
              </div>
            </div>
            <span v-for="(m, i) in mods" :key="i" class="chip" :class="m.good ? 'up' : 'down'">{{ m.t }}</span>
          </div>
        </template>

        <div class="row-end wizfoot">
          <button @click="go(step - 1)">← Voltar</button>
          <button v-if="step < 4" class="primary" :disabled="!canNext" @click="go(step + 1)">{{ step === 3 && !partyId ? 'Escolha ou funde um partido' : 'Próximo →' }}</button>
          <button v-else class="primary" @click="begin">Começar carreira</button>
        </div>
      </template>
    </div>
  </div>
</template>