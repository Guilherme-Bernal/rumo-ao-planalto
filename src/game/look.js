// Visual do personagem: opções do criador de rosto.
export const SKINS = ['#fbe3cf', '#f3cfae', '#e5b48a', '#cf9567', '#a9714a', '#85533a', '#5f3a29', '#3f261c']
export const HAIR_COLORS = ['#1b1512', '#3b2a1e', '#6a4428', '#a8743a', '#d9b26b', '#b4452a', '#8d8d8d', '#e9e9e9']
export const HAIRS = [
  { id: 'careca', name: 'Careca' },
  { id: 'curto', name: 'Curto' },
  { id: 'social', name: 'Lado' },
  { id: 'topete', name: 'Topete' },
  { id: 'cacheado', name: 'Cacheado' },
  { id: 'black', name: 'Black power' },
  { id: 'bob', name: 'Chanel' },
  { id: 'longo', name: 'Longo' },
  { id: 'coque', name: 'Coque' },
  { id: 'ondulado', name: 'Ondulado' },
  { id: 'tranca', name: 'Tranças' },
  { id: 'raspado', name: 'Raspado' },
  { id: 'rabo', name: 'Rabo de cavalo' },
]
export const FACES = [{ id: 'oval', name: 'Oval' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }]
export const BEARDS = [{ id: 'nenhuma', name: 'Sem barba' }, { id: 'bigode', name: 'Bigode' }, { id: 'cavanhaque', name: 'Cavanhaque' }, { id: 'barba', name: 'Barba' }]
export const GLASSES = [{ id: 'nenhum', name: 'Sem óculos' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }, { id: 'escuros', name: 'Escuros' }]
export const OUTFITS = [{ id: 'terno', name: 'Terno e gravata' }, { id: 'social', name: 'Camisa social' }, { id: 'camiseta', name: 'Camiseta' }, { id: 'blusa', name: 'Gola alta' }, { id: 'colete', name: 'Colete' }, { id: 'polo', name: 'Polo' }, { id: 'paleto', name: 'Paletó aberto' }]
export const OUTFIT_COLORS = ['#1f2a44', '#2f3a4a', '#7b1e2b', '#1f6f4a', '#b8860b', '#6b3fa0', '#d9d9d9', '#c2410c']
export const BGS = ['#274060', '#3a5a40', '#5a3e6b', '#7a4a2a', '#2f4f5f', '#5c2a36']
export const BROWS = [{ id: 'normal', name: 'Normal' }, { id: 'grossa', name: 'Grossa' }, { id: 'arqueada', name: 'Arqueada' }, { id: 'fina', name: 'Fina' }]
export const EYE_COLORS = ['#1e1a18', '#4a2f1b', '#2f5d8a', '#3f7d4f', '#7a7a3a']
export const MOUTHS = [{ id: 'sorriso', name: 'Sorriso' }, { id: 'serio', name: 'Sério' }, { id: 'confiante', name: 'Confiante' }, { id: 'aberto', name: 'Falando' }]
export const NOSES = [{ id: 'pequeno', name: 'Pequeno' }, { id: 'medio', name: 'Médio' }, { id: 'largo', name: 'Largo' }]
export const MARKS = [{ id: 'nenhuma', name: 'Nenhuma' }, { id: 'sardas', name: 'Sardas' }, { id: 'pinta', name: 'Pinta' }, { id: 'cicatriz', name: 'Cicatriz' }]
export const HEADWEAR = [{ id: 'nenhum', name: 'Nenhum' }, { id: 'bone', name: 'Boné' }, { id: 'chapeu', name: 'Chapéu' }]
export const PINS = [{ id: 'nenhum', name: 'Nenhum' }, { id: 'bandeira', name: 'Bandeira' }, { id: 'estrela', name: 'Estrela' }, { id: 'flor', name: 'Flor' }]
export const AGES = [{ id: 'auto', name: 'Acompanha a carreira' }, { id: 'jovem', name: 'Jovem' }, { id: 'maduro', name: 'Maduro' }, { id: 'veterano', name: 'Veterano' }]
// Insígnia por cargo: o retrato ganha um detalhe a cada degrau da carreira.
export const INSIGNIAS = { vereador: 'cracha', dep_estadual: 'pin', dep_federal: 'pin', prefeito: 'faixaP', governador: 'medalha', senador: 'pin', presidente: 'faixa' }
export const CARGOS_PREVIA = [{ id: 'vereador', name: 'Vereador' }, { id: 'prefeito', name: 'Prefeito' }, { id: 'governador', name: 'Governador' }, { id: 'presidente', name: 'Presidente' }]
// Nível de envelhecimento visual (0 a 3) a partir da idade em anos ou da escolha do jogador.
export const agingLevel = (age, idade) => {
  if (age === 'jovem') return 0
  if (age === 'maduro') return 1
  if (age === 'veterano') return 3
  if (idade == null) return 0
  return idade < 35 ? 0 : idade < 50 ? 1 : idade < 65 ? 2 : 3
}

export const defaultLook = () => ({ skin: 2, hair: 'curto', hairColor: 1, face: 'oval', beard: 'nenhuma', glasses: 'nenhum', outfit: 'terno', outfitColor: 0, bg: 0, brow: 'normal', eyeColor: 0, mouth: 'sorriso', nose: 'medio', marks: 'nenhuma', earring: false, headwear: 'nenhum', pin: 'nenhum', age: 'auto' })
const pick = (a) => a[Math.floor(Math.random() * a.length)]
export const randomLook = () => ({
  skin: Math.floor(Math.random() * SKINS.length),
  hair: pick(HAIRS).id,
  hairColor: Math.floor(Math.random() * HAIR_COLORS.length),
  face: pick(FACES).id,
  beard: Math.random() < 0.7 ? 'nenhuma' : pick(BEARDS).id,
  glasses: Math.random() < 0.65 ? 'nenhum' : pick(GLASSES).id,
  outfit: pick(OUTFITS).id,
  outfitColor: Math.floor(Math.random() * OUTFIT_COLORS.length),
  bg: Math.floor(Math.random() * BGS.length),
  brow: pick(BROWS).id,
  eyeColor: Math.floor(Math.random() * EYE_COLORS.length),
  mouth: pick(MOUTHS).id,
  nose: pick(NOSES).id,
  marks: Math.random() < 0.7 ? 'nenhuma' : pick(MARKS).id,
  earring: Math.random() < 0.12,
  headwear: Math.random() < 0.9 ? 'nenhum' : pick(HEADWEAR).id,
  pin: Math.random() < 0.6 ? 'nenhum' : pick(PINS).id,
  age: 'auto',
})