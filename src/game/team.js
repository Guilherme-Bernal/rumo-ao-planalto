// Chapa (vice e suplentes) e equipe (secretarias, ministérios e assessores) conforme a lei brasileira.
// perks: efeito por rodada | vote: pontos extras na eleição | amb: ambição de poder (0 a 1) | risk: chance de denúncia por rodada

// Quem pode ser vice (cargos do Executivo). Parentes são inelegíveis (Constituição, art. 14, §7º).
export const VICES = [
  { id: 'politico', name: 'Político experiente de partido aliado', desc: 'Amarra apoio no Legislativo e traz tempo de TV. Vai querer espaço no governo.', vote: 1.2, perks: { cong: 0.4 }, amb: 0.35, party: true },
  { id: 'tecnico', name: 'Técnico respeitado', desc: 'Dá credibilidade e conhece a gestão. Não puxa voto.', vote: 0.5, perks: { eco: 0.25, img: 0.25 }, amb: 0.05 },
  { id: 'popular', name: 'Nome popular do povo', desc: 'Comunicador, atleta ou líder comunitário. Puxa muito voto e entende pouco de gestão.', vote: 1.8, perks: { pop: 0.4 }, amb: 0.15 },
  { id: 'centrao', name: 'Indicação do centrão', desc: 'Maior tempo de TV e base garantida, mas cobra cargos e tem apetite pelo poder.', vote: 1.4, perks: { cong: 0.8, img: -0.3 }, amb: 0.5, party: true },
  { id: 'renovacao', name: 'Nome de renovação', desc: 'Jovem liderança, mulher de peso ou líder regional. Imagem fresca.', vote: 1.0, perks: { img: 0.4, pop: 0.2 }, amb: 0.1 },
  { id: 'familiar', name: 'Cônjuge ou parente', desc: 'Total confiança, mas a lei não deixa.', vote: 0, perks: {}, amb: 0, illegal: 'Cônjuge e parentes até o 2º grau do titular são inelegíveis na mesma jurisdição (Constituição, art. 14, §7º).' },
]

// Suplentes: do Legislativo. Senador escolhe 2. Vereador e deputado escolhem 1 nome para reforçar a lista.
export const SUPLS = [
  { id: 'puxador', name: 'Puxador de votos', desc: 'Nome popular que ajuda a lista do partido.', vote: 1.0, perks: { pop: 0.2 }, amb: 0.1 },
  { id: 'aliado', name: 'Aliado fiel do partido', desc: 'Garante a cadeira para o grupo e dá pouca dor de cabeça.', vote: 0.5, perks: { cong: 0.3 }, amb: 0.05 },
  { id: 'financiador', name: 'Empresário financiador', desc: 'Ajuda no caixa de campanha (+3 de caixa agora). A imprensa fareja o interesse.', vote: 0.3, perks: { cash: 0.4, img: -0.3 }, amb: 0.2, risk: 0.05, cash: 3 },
  { id: 'tecnico', name: 'Nome técnico e acadêmico', desc: 'Boa imagem e pouco voto.', vote: 0.3, perks: { img: 0.3 }, amb: 0.05 },
]

// Quem pode ocupar cada cadeira da equipe
export const APPOINTEES = [
  { id: 'tecnico', name: 'Técnico de carreira', desc: 'Conhece a máquina e trabalha sem barulho. Pouco apoio político.', v: 0.5, other: { img: 0.1, cong: -0.1 }, risk: 0 },
  { id: 'especialista', name: 'Especialista renomado', desc: 'Nome de peso do mercado ou da academia. Custa caro.', v: 0.8, other: { img: 0.2, cash: -0.3 }, risk: 0 },
  { id: 'politico', name: 'Indicado de partido aliado', desc: 'Traz apoio no Legislativo. Pode dar dor de cabeça.', v: 0.2, other: { cong: 0.6 }, risk: 0.05, only: 'politica' },
  { id: 'parlamentar', name: 'Parlamentar licenciado', desc: 'Deixa a cadeira para ser seu secretário ou ministro (o suplente assume a vaga). Muito apoio no plenário.', v: 0.3, other: { cong: 0.8 }, risk: 0.04, only: 'politica' },
  { id: 'confianca', name: 'Pessoa de sua confiança', desc: 'Fiel a você. Rende menos e não rouba a cena.', v: 0.3, other: { cong: 0.1 }, risk: 0.01 },
  { id: 'militar', name: 'Militar da reserva', desc: 'Disciplina e hierarquia. A imprensa estranha.', v: 0.6, other: { img: -0.15, cong: 0.1 }, risk: 0.02, only: 'seg' },
  { id: 'parente', name: 'Parente próximo', desc: 'Total confiança, mas polêmica na certa.', v: 0.1, other: { cong: 0.2, img: -0.2 }, risk: 0.12, nepot: true },
]

const T = (id, name, icon, stat) => ({ id, name, icon, stat })

export const TEAMS = {
  assessores: {
    id: 'assessores', title: 'Gabinete parlamentar', political: false,
    law: 'Parlamentares montam o gabinete com cargos em comissão. Nomear parentes para esses cargos é proibido (Súmula Vinculante 13 do STF).',
    slots: [T('chefe', 'Chefia de gabinete', '🗂️', 'cong'), T('juridico', 'Assessoria jurídica', '⚖️', 'img'), T('imprensa', 'Assessoria de imprensa', '📣', 'pop')],
  },
  secretarias_mun: {
    id: 'secretarias_mun', title: 'Secretarias municipais', political: true,
    law: 'O prefeito nomeia e demite os secretários livremente. Para cargos políticos como secretário, o STF não trata parentesco como nepotismo automático, mas o escândalo é certo.',
    slots: [T('saude', 'Secretaria de Saúde', '🩺', 'soc'), T('educacao', 'Secretaria de Educação', '🎓', 'soc'), T('fazenda', 'Secretaria de Fazenda', '💰', 'cash'), T('obras', 'Secretaria de Obras', '🏗️', 'eco'), T('seguranca', 'Guarda e Segurança', '🛡️', 'seg'), T('assistencia', 'Assistência Social', '🤲', 'pop')],
  },
  secretarias_est: {
    id: 'secretarias_est', title: 'Secretarias de Estado', political: true,
    law: 'O governador nomeia e demite os secretários de Estado. Deputados estaduais podem se licenciar para assumir uma secretaria.',
    slots: [T('casa_civil', 'Casa Civil', '🏛️', 'cong'), T('saude', 'Secretaria de Saúde', '🩺', 'soc'), T('educacao', 'Secretaria de Educação', '🎓', 'soc'), T('fazenda', 'Secretaria da Fazenda', '💰', 'cash'), T('seguranca', 'Segurança Pública', '🛡️', 'seg'), T('infra', 'Infraestrutura', '🏗️', 'eco')],
  },
  ministerios: {
    id: 'ministerios', title: 'Ministérios', political: true,
    law: 'O presidente nomeia e demite os ministros de Estado (Constituição, art. 84). Parlamentares podem assumir a pasta licenciados. Para a coalizão, partidos aliados costumam indicar ministros.',
    slots: [T('casa_civil', 'Casa Civil', '🏛️', 'cong'), T('fazenda', 'Ministério da Fazenda', '💰', 'eco'), T('saude', 'Ministério da Saúde', '🩺', 'soc'), T('educacao', 'Ministério da Educação', '🎓', 'soc'), T('justica', 'Justiça e Segurança', '⚖️', 'seg'), T('defesa', 'Ministério da Defesa', '🪖', 'seg'), T('infra', 'Infraestrutura', '🏗️', 'eco'), T('exterior', 'Relações Exteriores', '🌍', 'img')],
  },
}

export const STAT_NAME = { pop: 'popularidade', cong: 'base política', eco: 'economia', cash: 'caixa', soc: 'serviços sociais', seg: 'segurança', img: 'imagem' }

// Motivo pelo qual o nome não pode ocupar a cadeira (ou vazio se pode)
export function lockReason(team, slot, ap) {
  if (ap.nepot && !team.political) return 'Proibido pela Súmula Vinculante 13 do STF (nepotismo em cargo em comissão).'
  if (ap.only === 'politica' && !team.political) return 'Cargo técnico de gabinete, não é indicação política.'
  if (ap.only === 'seg' && slot.stat !== 'seg') return 'Só para áreas de segurança e defesa.'
  return ''
}