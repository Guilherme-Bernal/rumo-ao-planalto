// BLOCO 23: economia e sociedade (setores, movimentos sociais, mídia independente, catástrofes locais).
export const SETORES = [
  { id: 'agro', icon: '🌾', name: 'Agronegócio', bancada: 'Bancada ruralista', agrada: 'Crédito rural e isenção de impostos', pass: { eco: 0.35, cash: 0.2 } },
  { id: 'industria', icon: '🏭', name: 'Indústria', bancada: 'Frente da indústria', agrada: 'Proteção tarifária e redução de encargos', pass: { eco: 0.3, soc: 0.1 } },
  { id: 'servicos', icon: '🏪', name: 'Comércio e serviços', bancada: 'Frente empresarial', agrada: 'Menos burocracia e crédito ao consumo', pass: { eco: 0.25, pop: 0.15 } },
  { id: 'tecnologia', icon: '💡', name: 'Tecnologia', bancada: 'Frente digital', agrada: 'Incentivo à inovação e marco regulatório leve', pass: { eco: 0.2, img: 0.15 } },
  { id: 'mineracao', icon: '⛏️', name: 'Mineração e energia', bancada: 'Bancada da mineração', agrada: 'Licenças rápidas e concessões', pass: { cash: 0.35, eco: 0.15 } },
]

// Agradar setor custa Caixa e irrita os outros um pouco; enfrentar o lobby custa base, mas dá imagem.
export const SETOR_ACOES = [
  { id: 'agradar', icon: '🤝', name: 'Atender o setor', desc: 'Medida que o setor pediu. Satisfação +18, os outros -3.', cash: 2 },
  { id: 'regular', icon: '⚖️', name: 'Regular o setor', desc: 'Fiscalização e regras duras. Imagem +1, satisfação -15, base -1.', cash: 0 },
  { id: 'negociar', icon: '☕', name: 'Negociar com a bancada', desc: 'Conversa com a bancada do setor. Base +2, satisfação +6.', cash: 0 },
]

export const MOVIMENTOS = [
  { id: 'caminhoneiros', icon: '🚚', name: 'Greve dos caminhoneiros', quem: ['Zé Carreteiro', 'Dona Marlene', 'Seu Valdir'], ongoing: { eco: -0.9, pop: -0.4 }, left: 3, pauta: 'Preço do diesel e do frete mínimo' },
  { id: 'professores', icon: '📚', name: 'Greve dos professores', quem: ['Profa. Cláudia', 'Prof. Marcos', 'Profa. Sueli'], ongoing: { soc: -0.8, pop: -0.3 }, left: 3, pauta: 'Piso salarial e condições das escolas' },
  { id: 'saude', icon: '🩺', name: 'Greve da saúde', quem: ['Dra. Helena', 'Enf. Rodrigo', 'Téc. Paulinho'], ongoing: { soc: -1, pop: -0.3 }, left: 3, pauta: 'Plantões e falta de insumos' },
  { id: 'sem_teto', icon: '🏚️', name: 'Ocupação por moradia', quem: ['Cida da Ocupação', 'Seu Raimundo', 'Léo Coordenador'], ongoing: { seg: -0.5, img: -0.2 }, left: 3, pauta: 'Moradia popular e prédios abandonados' },
  { id: 'estudantes', icon: '🎓', name: 'Marcha dos estudantes', quem: ['Bia do DCE', 'Gabriel Presidente do Grêmio', 'Nathália'], ongoing: { pop: -0.5, img: -0.3 }, left: 2, pauta: 'Corte de verbas e passe livre' },
]
export const MOV_RESP = [
  { id: 'negociar', icon: '🤝', name: 'Negociar a pauta', desc: 'Cede parte e encerra o movimento. Custa Caixa.', cash: 2, ok: { pop: 1.5, soc: 0.5 } },
  { id: 'dialogar', icon: '☕', name: 'Receber a liderança', desc: 'Recebe a liderança nomeada. Pode acalmar, pode não resolver.', cash: 0, p: 0.55, ok: { pop: 1, img: 1 }, bad: { pop: -0.5 } },
  { id: 'reprimir', icon: '🛡️', name: 'Reprimir', desc: 'Encerra rápido, mas a imagem sofre e o movimento cresce depois.', cash: 0, ok: { seg: 1, img: -2.5, pop: -1.5 }, crescer: true },
  { id: 'ignorar', icon: '🙈', name: 'Esperar passar', desc: 'Sem custo, mas o desgaste continua.', cash: 0, ok: {}, skip: true },
]

export const VEICULOS = [
  { id: 'jornal', icon: '📰', name: 'Jornal da Capital', tipo: 'jornal', aud: 55 },
  { id: 'tv', icon: '📺', name: 'Rede Nacional de TV', tipo: 'TV', aud: 80 },
  { id: 'radio', icon: '📻', name: 'Rádio Povo', tipo: 'rádio', aud: 45 },
  { id: 'influ', icon: '📱', name: 'Canal do Influencer Dudu', tipo: 'influenciador', aud: 65 },
  { id: 'blog', icon: '💻', name: 'Portal Contraponto', tipo: 'portal', aud: 40 },
]
export const LINHAS = { oposicao: 'Opositora', neutra: 'Independente', governista: 'Governista' }
export const MIDIA_ACOES = [
  { id: 'verba', icon: '💵', name: 'Verba publicitária', desc: 'Aproxima a linha editorial do governo, mas se descoberto, vira escândalo.', cash: 2 },
  { id: 'entrevista', icon: '🎙️', name: 'Dar entrevista exclusiva', desc: 'Melhora a relação com o veículo. Pode escorregar na pergunta.', cash: 0 },
  { id: 'processar', icon: '⚖️', name: 'Processar o veículo', desc: 'Silencia a crítica por um tempo, mas parece censura.', cash: 1 },
]

export const CATASTROFES = [
  { id: 'enchente', icon: '🌊', name: 'Enchente', desc: 'Chuvas fortes alagam bairros inteiros.', ongoing: { pop: -0.6, soc: -0.6 }, left: 3 },
  { id: 'seca', icon: '🏜️', name: 'Seca severa', desc: 'Falta de água para o campo e a cidade.', ongoing: { eco: -0.6, pop: -0.3 }, left: 4 },
  { id: 'incendio', icon: '🔥', name: 'Incêndio florestal', desc: 'Queimadas fora de controle ameaçam a região.', ongoing: { seg: -0.5, img: -0.3 }, left: 3 },
  { id: 'barragem', icon: '🧱', name: 'Rompimento de barragem', desc: 'Uma barragem cedeu e a lama atingiu comunidades.', ongoing: { pop: -0.8, img: -0.6, soc: -0.5 }, left: 4 },
]
export const CATAST_RESP = [
  { id: 'socorro', icon: '🚒', name: 'Operação de resgate', desc: 'Bombeiros, Defesa Civil e abrigos.', cash: 2, p: 0.75, ok: { pop: 2, img: 1.5 }, bad: { pop: -1 } },
  { id: 'verba', icon: '🏗️', name: 'Verba de reconstrução', desc: 'Dinheiro para reconstruir e indenizar.', cash: 3, p: 0.85, ok: { pop: 2.5, soc: 1.5, img: 1 }, bad: { pop: 0 } },
  { id: 'culpar', icon: '👉', name: 'Culpar a gestão anterior', desc: 'Sem custo, mas só convence parte do público.', cash: 0, p: 0.35, ok: { pop: 1 }, bad: { pop: -1.5, img: -1.5 } },
  { id: 'visita', icon: '🥾', name: 'Visitar a área atingida', desc: 'Presença pessoal. Risco de gafe e de gerar notícia.', cash: 0, p: 0.6, ok: { pop: 1.8, img: 1 }, bad: { pop: -1, img: -1 } },
]
