// Ideias (bandeiras), esferas de influência e partido próprio
export const SPHERES = [
  { k: 'mun', icon: '🏘️', name: 'Municipal', desc: 'Bairro, prefeitura, Câmara Municipal.' },
  { k: 'est', icon: '🗺️', name: 'Estadual', desc: 'Governo do estado, assembleia, interior.' },
  { k: 'fed', icon: '🇧🇷', name: 'Federal', desc: 'Brasília, Congresso, Planalto.' },
]
export const STAGE_SPHERE = ['mun', 'est', 'est', 'fed']
export const FAME_OFFSETS = [[10, -3, -8], [4, 6, 0], [2, 8, 0], [0, 2, 6]]

export const BANDEIRAS = [
  { id: 'saude', icon: '🩺', name: 'Saúde pública', stat: 'soc' },
  { id: 'educacao', icon: '🎓', name: 'Educação', stat: 'soc' },
  { id: 'ambiente', icon: '🌳', name: 'Meio ambiente', stat: 'soc' },
  { id: 'seguranca', icon: '🛡️', name: 'Segurança', stat: 'seg' },
  { id: 'mercado', icon: '📈', name: 'Livre mercado', stat: 'eco' },
  { id: 'emprego', icon: '🏭', name: 'Emprego e indústria', stat: 'eco' },
  { id: 'agro', icon: '🌾', name: 'Agro e interior', stat: 'eco' },
  { id: 'tecnologia', icon: '💻', name: 'Tecnologia e inovação', stat: 'eco' },
  { id: 'etica', icon: '⚖️', name: 'Ética e transparência', stat: 'img' },
  { id: 'contas', icon: '🧮', name: 'Contas públicas', stat: 'cash' },
  { id: 'familia', icon: '🏡', name: 'Família e tradição', stat: 'pop' },
  { id: 'direitos', icon: '✊', name: 'Direitos e inclusão', stat: 'pop' },
]
export const BAND_STAT = Object.fromEntries(BANDEIRAS.map((b) => [b.id, b.stat]))
export const DEFAULT_FLAGS = {
  esquerda: ['saude', 'educacao', 'direitos'],
  centro: ['contas', 'educacao', 'emprego'],
  direita: ['seguranca', 'mercado', 'familia'],
  independente: ['etica', 'tecnologia', 'educacao'],
}

const IA = ['Pragmatismo', 'Humanismo', 'Desenvolvimentismo', 'Solidarismo', 'Liberalismo', 'Conservadorismo', 'Municipalismo', 'Progressismo', 'Trabalhismo', 'Republicanismo']
const IB = ['Cidadão', 'Responsável', 'Popular', 'de Resultados', 'Social', 'Renovado', 'do Interior', 'Moderno', 'Pé no Chão', 'Solidário']
export const randomIdeologyName = (R = Math.random) => `${IA[Math.floor(R() * IA.length)]} ${IB[Math.floor(R() * IB.length)]}`

const SL = ['Pensar no povo primeiro.', 'Gente que faz.', 'O futuro começa agora.', 'Menos conversa, mais resultado.', 'Juntos, sem esquecer ninguém.', 'Com pé no chão e olho no futuro.']
export const randomSlogan = (R = Math.random) => SL[Math.floor(R() * SL.length)]
export const PARTY_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899']

export const PARTY_FOCUS = [
  { id: 'votos', icon: '🗳️', name: 'Voto de opinião', perks: { vote: 1.3 }, text: '+1,3 voto-ponto na eleição' },
  { id: 'caixa', icon: '💰', name: 'Fundo e doações', perks: { cash: 1.1 }, text: '+1,1 caixa por rodada' },
  { id: 'base', icon: '🏛️', name: 'Bancada fiel', perks: { cong: 1.1 }, text: '+1,1 base por rodada' },
  { id: 'militancia', icon: '📣', name: 'Militância voluntária', perks: { camp: 0.88, vote: 0.4 }, text: 'campanha 12% mais barata, +0,4 voto-ponto' },
]

export function makeOwnParty({ name, sigla, color, slogan, ideo, focus = 'votos' }) {
  const f = PARTY_FOCUS.find((x) => x.id === focus) || PARTY_FOCUS[0]
  return {
    id: 'own', own: true, sigla, name, ideo, color, slogan, focus: f.id,
    perks: { ...f.perks },
    perkText: `Partido fundado por você (${f.name}): ${f.text}.`,
  }
}

// Vantagens de um partido em chips curtos
export function perkChips(perks = {}) {
  const o = []
  const sg = (v) => `${v > 0 ? '+' : '−'}${String(Math.abs(v)).replace('.', ',')}`
  if (perks.pop) o.push({ t: `❤️ ${sg(perks.pop)} popularidade/rodada`, good: perks.pop > 0 })
  if (perks.img) o.push({ t: `⚖️ ${sg(perks.img)} imagem/rodada`, good: perks.img > 0 })
  if (perks.eco) o.push({ t: `📈 ${sg(perks.eco)} economia/rodada`, good: perks.eco > 0 })
  if (perks.vote) o.push({ t: `🗳️ +${String(perks.vote).replace('.', ',')} voto-ponto`, good: true })
  if (perks.cash) o.push({ t: `💰 +${String(perks.cash).replace('.', ',')} caixa/rodada`, good: true })
  if (perks.cong) o.push({ t: `🏛️ +${String(perks.cong).replace('.', ',')} base/rodada`, good: true })
  if (perks.camp) o.push({ t: `🎫 campanha ${Math.round((1 - perks.camp) * 100)}% mais barata`, good: true })
  return o
}