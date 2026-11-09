import { countries } from './countries'
import { ageMods } from './countries/brasil-traits'

// Junta os efeitos de todas as características escolhidas:
// start = bônus/ônus iniciais, gain = multiplica ganhos, loss = multiplica perdas, camp = custo de campanha, baseP = popularidade de base (carisma que não esvazia)
export function modsFor(countryId, picks = {}) {
  const c = countries[countryId]
  const out = { start: {}, gain: {}, loss: {}, camp: 1, baseP: 0 }
  for (const cat of c.traits || []) {
    const o = cat.options.find((x) => x.id === picks[cat.id])
    if (!o) continue
    for (const k in o.fx || {}) out.start[k] = (out.start[k] || 0) + o.fx[k]
    for (const k in o.gain || {}) out.gain[k] = (out.gain[k] || 1) * o.gain[k]
    for (const k in o.loss || {}) out.loss[k] = (out.loss[k] || 1) * o.loss[k]
    if (o.camp) out.camp *= o.camp
    if (o.baseP) out.baseP += o.baseP
  }
  if (picks.idade != null && countryId === 'brasil') {
    const a = ageMods(Number(picks.idade))
    for (const k in a.fx || {}) out.start[k] = (out.start[k] || 0) + a.fx[k]
    for (const k in a.gain || {}) out.gain[k] = (out.gain[k] || 1) * a.gain[k]
    for (const k in a.loss || {}) out.loss[k] = (out.loss[k] || 1) * a.loss[k]
  }
  return out
}

export const defaultPicks = (c) => Object.fromEntries((c.traits || []).map((cat) => [cat.id, cat.def]))