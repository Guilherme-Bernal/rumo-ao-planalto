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
]
export const FACES = [{ id: 'oval', name: 'Oval' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }]
export const BEARDS = [{ id: 'nenhuma', name: 'Sem barba' }, { id: 'bigode', name: 'Bigode' }, { id: 'cavanhaque', name: 'Cavanhaque' }, { id: 'barba', name: 'Barba' }]
export const GLASSES = [{ id: 'nenhum', name: 'Sem óculos' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }, { id: 'escuros', name: 'Escuros' }]
export const OUTFITS = [{ id: 'terno', name: 'Terno e gravata' }, { id: 'social', name: 'Camisa social' }, { id: 'camiseta', name: 'Camiseta' }, { id: 'blusa', name: 'Gola alta' }]
export const OUTFIT_COLORS = ['#1f2a44', '#2f3a4a', '#7b1e2b', '#1f6f4a', '#b8860b', '#6b3fa0', '#d9d9d9', '#c2410c']
export const BGS = ['#274060', '#3a5a40', '#5a3e6b', '#7a4a2a', '#2f4f5f', '#5c2a36']
export const BROWS = ['thin', 'thick']

export const defaultLook = () => ({ skin: 2, hair: 'curto', hairColor: 1, face: 'oval', beard: 'nenhuma', glasses: 'nenhum', outfit: 'terno', outfitColor: 0, bg: 0 })
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
})