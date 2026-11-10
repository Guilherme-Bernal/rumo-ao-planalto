import { brasil } from './brasil'
import { brasilTraits } from './brasil-traits'
import { STATES, CITY_SIZES } from './brasil-geo'
import { PARTIES } from './brasil-parties'
import { PROMISES, MAX_PROMISES, PLAN_NAMES_A, PLAN_NAMES_B } from './brasil-plans'
import { extraEvents } from './brasil-events-extra'
import { moreEvents } from './brasil-events-more'
import { dirtyEvents } from './brasil-events-dirty'
import { novosEventos } from './brasil-events-novos'
import { regionalEvents } from './brasil-events-regional'
import { healthEvents } from './brasil-events-health'
import { teamEvents } from './brasil-events-team'
import { worldEvents } from './brasil-events-world'
import { vidaEvents } from './brasil-events-vida'
import { EXTRA_CITIES } from './brasil-cities'

// Para adicionar outro país: crie arquivos parecidos com brasil*.js e registre aqui.
brasil.traits = brasilTraits
brasil.flag = '🌎'
brasil.regions = STATES.map((s) => ({ ...s, cities: [...s.cities, ...(EXTRA_CITIES[s.mapId] || []).filter((x) => !s.cities.some((y) => y.name === x.name))] }))
brasil.citySizes = CITY_SIZES
brasil.parties = PARTIES
brasil.promises = PROMISES
brasil.maxPromises = MAX_PROMISES
brasil.planNames = [PLAN_NAMES_A, PLAN_NAMES_B]
brasil.events = [...brasil.events, ...extraEvents, ...moreEvents, ...dirtyEvents, ...novosEventos, ...regionalEvents, ...healthEvents, ...teamEvents, ...worldEvents, ...vidaEvents]
// ids repetidos entre arquivos faziam o jogo mostrar o texto do evento errado: o repetido ganha sufixo
{
  const vistos = {}
  brasil.events = brasil.events.map((e) => {
    const n = (vistos[e.id] = (vistos[e.id] || 0) + 1)
    return n === 1 ? e : { ...e, id: `${e.id}__${n}` }
  })
}
// Reais por ponto de caixa em cada cargo (vereador, deputado, governador, presidente)
brasil.money = [30e3, 400e3, 120e6, 8e9]

export const countries = { brasil }