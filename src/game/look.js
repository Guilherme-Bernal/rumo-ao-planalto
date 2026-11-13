// Visual do personagem: opções do criador de rosto.
export const SKINS = ['#fbe3cf', '#f3cfae', '#e5b48a', '#cf9567', '#a9714a', '#85533a', '#5f3a29', '#3f261c']
export const HAIR_COLORS = ['#1b1512', '#3b2a1e', '#6a4428', '#a8743a', '#d9b26b', '#b4452a', '#8d8d8d', '#e9e9e9']
// sex: 'u' serve para qualquer pessoa, 'm' e 'f' aparecem primeiro para quem escolheu aquele perfil.
export const HAIRS = [
  { id: 'careca', name: 'Careca', sex: 'u' },
  { id: 'curto', name: 'Curto', sex: 'u' },
  { id: 'social', name: 'Lado', sex: 'm' },
  { id: 'topete', name: 'Topete', sex: 'm' },
  { id: 'degrade', name: 'Degradê', sex: 'm' },
  { id: 'entradas', name: 'Entradas', sex: 'm' },
  { id: 'cacheado', name: 'Cacheado', sex: 'u' },
  { id: 'black', name: 'Black power', sex: 'u' },
  { id: 'ondulado', name: 'Ondulado', sex: 'u' },
  { id: 'raspado', name: 'Raspado', sex: 'u' },
  { id: 'rabo', name: 'Rabo de cavalo', sex: 'u' },
  { id: 'coque', name: 'Coque', sex: 'f' },
  { id: 'tranca', name: 'Tranças', sex: 'u' },
  { id: 'bob', name: 'Chanel', sex: 'f' },
  { id: 'curtinho', name: 'Curtinho', sex: 'f' },
  { id: 'longo', name: 'Longo', sex: 'f' },
  { id: 'franja', name: 'Longo com franja', sex: 'f' },
  { id: 'lateral', name: 'Longo de lado', sex: 'f' },
  { id: 'cachelongo', name: 'Cacheado longo', sex: 'f' },
]
export const SEXOS = [{ id: 'm', name: 'Homem', icon: '👨' }, { id: 'f', name: 'Mulher', icon: '👩' }]
// penteados por perfil: os do perfil e os unissex
export const hairsFor = (sex) => HAIRS.filter((h) => h.sex === 'u' || h.sex === (sex === 'f' ? 'f' : 'm'))
export const hairOk = (id, sex) => hairsFor(sex).some((h) => h.id === id)

// Formas dos cabelos (viewBox 120). back = atrás do corpo e do rosto, front = por cima do rosto.
// Todo "front" cobre o topo do crânio (y 17 a 22) para não deixar fresta de pele.
const CAP = 'M30 58 C27 28 40 19 60 19 C80 19 93 28 90 58 L86 50 C82 42 72 37 60 37 C48 37 38 42 34 50 Z'
const CIRC = [[38, 32, 10], [50, 24, 11], [64, 22, 11], [77, 27, 11], [85, 39, 8], [35, 42, 8]]
const CIRCS = CIRC.map(([x, y, r]) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`).join(' ')
const LONG_BACK = 'M28 58 C24 24 42 17 60 17 C78 17 96 24 92 58 L98 108 C84 108 80 92 78 84 L42 84 C40 92 36 108 22 108 Z'
export const HAIR_SHAPES = {
  curto: { front: [CAP] },
  social: { front: ['M30 58 C26 26 42 17 62 17 C84 17 94 32 90 58 L86 49 C84 40 78 35 72 34 C66 40 50 42 40 42 C36 44 35 48 34 52 Z'] },
  topete: { front: ['M30 58 C24 20 44 9 66 10 C90 11 96 32 90 58 L86 46 C84 34 76 28 66 28 C54 28 44 32 38 42 C35 46 34 50 34 52 Z'] },
  degrade: { front: ['M34 52 C33 30 44 20 60 20 C76 20 87 30 86 52 L83 44 C79 38 70 35 60 35 C50 35 41 38 37 44 Z'], fade: ['M30 58 L34 50 L38 44 L36 58 Z', 'M90 58 L86 50 L82 44 L84 58 Z'] },
  entradas: { front: ['M33 56 C30 30 42 20 60 20 C78 20 90 30 87 56 L84 46 C82 38 78 30 74 29 C70 33 66 37 60 37 C54 37 50 33 46 29 C42 30 38 38 36 46 Z'] },
  cacheado: { front: [CIRCS, 'M32 50 C32 28 46 20 60 20 C76 20 88 28 88 50 L84 44 C78 38 70 36 60 36 C50 36 42 38 36 44 Z'] },
  black: { back: ['M19 42 C19 10 40 5 60 5 C80 5 101 10 101 42 C101 62 90 74 60 74 C30 74 19 62 19 42 Z'], front: ['M28 58 C25 30 40 21 60 21 C80 21 95 30 92 58 L87 48 C82 40 72 36 60 36 C48 36 38 40 33 48 Z'] },
  ondulado: { back: ['M27 60 C22 78 30 88 26 96 C34 98 38 90 36 70 Z', 'M93 60 C98 78 90 88 94 96 C86 98 82 90 84 70 Z'], front: ['M29 60 C24 30 40 17 60 17 C80 17 96 30 91 60 C88 48 82 40 74 38 C68 34 64 38 60 36 C56 38 50 34 44 38 C38 40 32 48 29 60 Z'] },
  raspado: { front: ['M32 54 C30 30 42 22 60 22 C78 22 90 30 88 54 L84 46 C80 40 70 37 60 37 C50 37 40 40 36 46 Z'], alpha: 0.5 },
  rabo: { back: ['M84 38 C110 40 110 72 98 90 C98 70 92 56 84 52 Z'], front: [CAP], tie: [88, 44] },
  coque: { back: ['M49 14 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z'], front: [CAP] },
  tranca: { back: ['M26 62 C22 80 24 100 30 106 L40 106 C42 94 42 78 40 62 Z', 'M94 62 C98 80 96 100 90 106 L80 106 C78 94 78 78 80 62 Z'], front: [CAP], rows: ['M44 24 C42 30 40 36 38 42', 'M52 21 C51 28 50 34 49 38', 'M60 20 L60 36', 'M68 21 C69 28 70 34 71 38', 'M76 24 C78 30 80 36 82 42'] },
  bob: { back: ['M29 60 C26 24 42 18 60 18 C78 18 94 24 91 60 L92 86 C86 90 80 88 78 80 L42 80 C40 88 34 90 28 86 Z'], front: ['M29 62 C27 28 42 19 60 19 C80 19 93 28 91 62 L88 52 C84 42 74 37 60 37 C46 37 36 42 32 52 Z', 'M30 50 L31 62 L33 80 C38 76 41 70 41 56 Z', 'M90 50 L89 62 L87 80 C82 76 79 70 79 56 Z'] },
  curtinho: { front: ['M31 56 C27 28 42 18 60 18 C80 18 94 28 89 56 L87 48 C80 36 70 32 60 33 C52 32 44 38 36 46 L34 54 Z'] },
  longo: { back: [LONG_BACK], front: ['M29 60 C26 28 42 19 60 19 C78 19 94 28 91 60 L88 50 C82 40 70 36 60 38 C50 36 38 40 32 50 Z'] },
  franja: { back: [LONG_BACK], front: ['M29 62 C26 26 42 17 60 17 C78 17 94 26 91 62 L89 48 C84 43 70 43 60 43 C50 43 36 43 31 48 Z'] },
  lateral: { back: [LONG_BACK], front: ['M28 62 C24 26 42 16 62 16 C84 16 96 30 90 62 L87 50 C84 40 78 36 70 35 C62 42 48 44 38 42 C34 46 33 54 32 62 Z'] },
  cachelongo: { back: ['M24 60 C18 26 40 12 60 12 C80 12 102 26 96 60 C102 80 96 100 100 112 L82 112 L78 80 L42 80 L38 112 L20 112 C24 100 18 80 24 60 Z'], front: [CIRCS, 'M32 50 C32 28 46 20 60 20 C76 20 88 28 88 50 L84 44 C78 38 70 36 60 36 C50 36 42 38 36 44 Z'] },
}
export const FACES = [{ id: 'oval', name: 'Oval' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }]
export const BEARDS = [{ id: 'nenhuma', name: 'Sem barba' }, { id: 'bigode', name: 'Bigode' }, { id: 'cavanhaque', name: 'Cavanhaque' }, { id: 'barba', name: 'Barba' }]
export const GLASSES = [{ id: 'nenhum', name: 'Sem óculos' }, { id: 'redondo', name: 'Redondo' }, { id: 'quadrado', name: 'Quadrado' }, { id: 'escuros', name: 'Escuros' }]
export const OUTFITS = [{ id: 'terno', name: 'Terno e gravata' }, { id: 'social', name: 'Camisa social' }, { id: 'camiseta', name: 'Camiseta' }, { id: 'blusa', name: 'Gola alta' }, { id: 'colete', name: 'Colete' }, { id: 'polo', name: 'Polo' }, { id: 'paleto', name: 'Paletó aberto' }, { id: 'vestido', name: 'Vestido' }, { id: 'blazer', name: 'Blazer e blusa' }]
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

const BASE_LOOK = () => ({ skin: 2, hair: 'curto', hairColor: 1, face: 'oval', beard: 'nenhuma', glasses: 'nenhum', outfit: 'terno', outfitColor: 0, bg: 0, brow: 'normal', eyeColor: 0, mouth: 'sorriso', nose: 'medio', marks: 'nenhuma', earring: false, headwear: 'nenhum', pin: 'nenhum', age: 'auto' })
export const defaultLook = (sex = 'm') => (sex === 'f' ? { ...BASE_LOOK(), sex: 'f', hair: 'longo', hairColor: 1, face: 'oval', outfit: 'blazer', outfitColor: 2, earring: true, brow: 'fina' } : { ...BASE_LOOK(), sex: 'm' })
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const OUTFITS_F = ['vestido', 'blazer']
export const randomLook = (sex) => {
  const sx = sex === 'f' || sex === 'm' ? sex : Math.random() < 0.5 ? 'm' : 'f'
  const f = sx === 'f'
  return {
    sex: sx,
    skin: Math.floor(Math.random() * SKINS.length),
    hair: pick(hairsFor(sx)).id,
    hairColor: Math.floor(Math.random() * HAIR_COLORS.length),
    face: pick(FACES).id,
    beard: f || Math.random() < 0.7 ? 'nenhuma' : pick(BEARDS).id,
    glasses: Math.random() < 0.65 ? 'nenhum' : pick(GLASSES).id,
    outfit: pick(OUTFITS.filter((o) => f || !OUTFITS_F.includes(o.id))).id,
    outfitColor: Math.floor(Math.random() * OUTFIT_COLORS.length),
    bg: Math.floor(Math.random() * BGS.length),
    brow: pick(BROWS).id,
    eyeColor: Math.floor(Math.random() * EYE_COLORS.length),
    mouth: pick(MOUTHS).id,
    nose: pick(NOSES).id,
    marks: Math.random() < 0.7 ? 'nenhuma' : pick(MARKS).id,
    earring: Math.random() < (f ? 0.5 : 0.12),
    headwear: Math.random() < 0.9 ? 'nenhum' : pick(HEADWEAR).id,
    pin: Math.random() < 0.6 ? 'nenhum' : pick(PINS).id,
    age: 'auto',
  }
}
