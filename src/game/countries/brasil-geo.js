// Geografia do Brasil: 27 UFs, tendência política aproximada (-1 esquerda ... +1 direita) e algumas cidades.
// bonus = peso eleitoral do estado nas eleições. size: capital | grande | media | pequena
const c = (name, size) => ({ name, size })

export const CITY_SIZES = {
  capital: { label: 'Capital', desc: 'Mais verba e articulação, mas ninguém te conhece pelo nome.', fx: { cash: 4, cong: 4, pop: -4, img: -1 } },
  grande: { label: 'Cidade grande', desc: 'Boa verba e bastante gente. Disputa dura por atenção.', fx: { cash: 3, cong: 2, pop: -3 } },
  media: { label: 'Cidade média', desc: 'Equilíbrio entre visibilidade e recursos.', fx: {} },
  pequena: { label: 'Cidade pequena', desc: 'Todo mundo te conhece pelo nome, mas o cofre é magro.', fx: { pop: 5, cash: -3 } },
}

export const STATES = [
  { id: 'ac', name: 'Acre', bonus: 0, lean: 0.5, cities: [c('Rio Branco', 'capital'), c('Cruzeiro do Sul', 'media'), c('Sena Madureira', 'pequena')] },
  { id: 'al', name: 'Alagoas', bonus: 0, lean: -0.3, cities: [c('Maceió', 'capital'), c('Arapiraca', 'grande'), c('Penedo', 'pequena')] },
  { id: 'am', name: 'Amazonas', bonus: 0, lean: 0, cities: [c('Manaus', 'capital'), c('Parintins', 'media'), c('Tefé', 'pequena')] },
  { id: 'ap', name: 'Amapá', bonus: 0, lean: 0, cities: [c('Macapá', 'capital'), c('Santana', 'media'), c('Oiapoque', 'pequena')] },
  { id: 'ba', name: 'Bahia', bonus: 2, lean: -0.6, cities: [c('Salvador', 'capital'), c('Feira de Santana', 'grande'), c('Ilhéus', 'media'), c('Lençóis', 'pequena')] },
  { id: 'ce', name: 'Ceará', bonus: 1, lean: -0.7, cities: [c('Fortaleza', 'capital'), c('Juazeiro do Norte', 'grande'), c('Sobral', 'media'), c('Jericoacoara', 'pequena')] },
  { id: 'df', name: 'Distrito Federal', bonus: 0, lean: 0.1, cities: [c('Brasília', 'capital'), c('Ceilândia', 'grande'), c('Planaltina', 'media')] },
  { id: 'es', name: 'Espírito Santo', bonus: 0, lean: 0.3, cities: [c('Vitória', 'capital'), c('Vila Velha', 'grande'), c('Cachoeiro de Itapemirim', 'media'), c('Domingos Martins', 'pequena')] },
  { id: 'go', name: 'Goiás', bonus: 0, lean: 0.6, cities: [c('Goiânia', 'capital'), c('Anápolis', 'grande'), c('Rio Verde', 'media'), c('Pirenópolis', 'pequena')] },
  { id: 'ma', name: 'Maranhão', bonus: 0, lean: -0.6, cities: [c('São Luís', 'capital'), c('Imperatriz', 'grande'), c('Caxias', 'media'), c('Barreirinhas', 'pequena')] },
  { id: 'mg', name: 'Minas Gerais', bonus: 3, lean: 0.1, cities: [c('Belo Horizonte', 'capital'), c('Uberlândia', 'grande'), c('Juiz de Fora', 'grande'), c('Montes Claros', 'media'), c('Tiradentes', 'pequena')] },
  { id: 'ms', name: 'Mato Grosso do Sul', bonus: 0, lean: 0.6, cities: [c('Campo Grande', 'capital'), c('Dourados', 'media'), c('Bonito', 'pequena')] },
  { id: 'mt', name: 'Mato Grosso', bonus: 0, lean: 0.8, cities: [c('Cuiabá', 'capital'), c('Sinop', 'media'), c('Rondonópolis', 'media'), c('Chapada dos Guimarães', 'pequena')] },
  { id: 'pa', name: 'Pará', bonus: 0, lean: 0, cities: [c('Belém', 'capital'), c('Santarém', 'grande'), c('Marabá', 'media'), c('Alter do Chão', 'pequena')] },
  { id: 'pb', name: 'Paraíba', bonus: 0, lean: -0.5, cities: [c('João Pessoa', 'capital'), c('Campina Grande', 'grande'), c('Patos', 'media'), c('Areia', 'pequena')] },
  { id: 'pe', name: 'Pernambuco', bonus: 1, lean: -0.6, cities: [c('Recife', 'capital'), c('Caruaru', 'grande'), c('Petrolina', 'grande'), c('Olinda', 'media'), c('Fernando de Noronha', 'pequena')] },
  { id: 'pi', name: 'Piauí', bonus: 0, lean: -0.7, cities: [c('Teresina', 'capital'), c('Parnaíba', 'media'), c('Picos', 'pequena')] },
  { id: 'pr', name: 'Paraná', bonus: 1, lean: 0.6, cities: [c('Curitiba', 'capital'), c('Londrina', 'grande'), c('Maringá', 'grande'), c('Foz do Iguaçu', 'media'), c('Morretes', 'pequena')] },
  { id: 'rj', name: 'Rio de Janeiro', bonus: 2, lean: 0.2, cities: [c('Rio de Janeiro', 'capital'), c('Niterói', 'grande'), c('Petrópolis', 'media'), c('Búzios', 'pequena')] },
  { id: 'rn', name: 'Rio Grande do Norte', bonus: 0, lean: -0.3, cities: [c('Natal', 'capital'), c('Mossoró', 'media'), c('Pipa', 'pequena')] },
  { id: 'ro', name: 'Rondônia', bonus: 0, lean: 0.8, cities: [c('Porto Velho', 'capital'), c('Ji-Paraná', 'media'), c('Vilhena', 'pequena')] },
  { id: 'rr', name: 'Roraima', bonus: 0, lean: 0.7, cities: [c('Boa Vista', 'capital'), c('Rorainópolis', 'pequena'), c('Caracaraí', 'pequena')] },
  { id: 'rs', name: 'Rio Grande do Sul', bonus: 2, lean: 0.4, cities: [c('Porto Alegre', 'capital'), c('Caxias do Sul', 'grande'), c('Pelotas', 'media'), c('Gramado', 'pequena')] },
  { id: 'sc', name: 'Santa Catarina', bonus: 0, lean: 0.8, cities: [c('Florianópolis', 'capital'), c('Joinville', 'grande'), c('Blumenau', 'grande'), c('Pomerode', 'pequena')] },
  { id: 'se', name: 'Sergipe', bonus: 0, lean: -0.3, cities: [c('Aracaju', 'capital'), c('Lagarto', 'media'), c('Laranjeiras', 'pequena')] },
  { id: 'sp', name: 'São Paulo', bonus: 3, lean: 0.3, cities: [c('São Paulo', 'capital'), c('Campinas', 'grande'), c('Ribeirão Preto', 'grande'), c('Santos', 'media'), c('Holambra', 'pequena')] },
  { id: 'to', name: 'Tocantins', bonus: 0, lean: 0.3, cities: [c('Palmas', 'capital'), c('Araguaína', 'media'), c('Jalapão', 'pequena')] },
].map((s) => ({ ...s, id: s.id.toUpperCase(), mapId: s.id }))

export const stateById = (id) => STATES.find((s) => s.id === id)

// Gera um número estável de 0..1 a partir de um texto (ruído fixo por estado)
export function hash01(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return ((h >>> 0) % 10000) / 10000
}