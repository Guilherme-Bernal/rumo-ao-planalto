// BLOCO 45B: segurança pública e crime organizado. Facções, milícias e redes transnacionais,
// compra de viaturas e equipamentos (nacionais ou estrangeiros), pesquisa de armamento e acordos internacionais.
// Todos os grupos e empresas são fictícios.

export const GRUPOS_SG = [
  { id: 'faccao', icon: '🕶️', nome: 'Facções do tráfico', esf: ['mun', 'est', 'fed'], texto: 'Controlam territórios e o varejo de drogas.' },
  { id: 'milicia', icon: '🧨', nome: 'Milícias', esf: ['mun', 'est'], texto: 'Grupos armados que cobram taxas e se infiltram na política.' },
  { id: 'transnac', icon: '🌐', nome: 'Rede transnacional de armas e drogas', esf: ['est', 'fed'], texto: 'Abastece as facções com armas e escoa a droga pelas fronteiras.' },
]
export const FORCA_NOME_SG = { mun: 'Guarda Municipal', est: 'Polícia Militar e Civil', fed: 'Polícia Federal e Forças de Segurança' }

// ---- operações planejadas (você escolhe o alvo) ----
export const OPS_SG = [
  { id: 'inteligencia', icon: '🕵️', nome: 'Inteligência e investigação', desc: 'Mapeia lideranças e rotas. Seguro, mas lento: -6 no grupo.', cash: 1, base: 0.62, dfac: 6, bad: { img: -0.5 }, cd: 3 },
  { id: 'ostensiva', icon: '🚓', nome: 'Operação ostensiva', desc: 'Entra no território. -12 no grupo, risco de excesso.', cash: 2, base: 0.52, dfac: 12, bad: { img: -3, pop: -0.6 }, cd: 4, letal: true },
  { id: 'asfixia', icon: '💰', nome: 'Asfixia financeira', desc: 'Bloqueia contas e lava-jatos. -10 no grupo. Só estado e União.', cash: 2, base: 0.5, dfac: 10, bad: { img: -1 }, cd: 5, esf: ['est', 'fed'] },
  { id: 'prevencao', icon: '🎓', nome: 'Prevenção nos bairros', desc: 'Programa social de longo prazo. -4 no grupo e agrada o povo.', cash: 2, base: 1, dfac: 4, ok: { pop: 0.6, seg: 0.4 }, cd: 4 },
]
export const OP_POR_ID_SG = Object.fromEntries(OPS_SG.map((o) => [o.id, o]))
export const REFORMA_SG = { cash: 2, dcorr: 12, cd: 5, bad: { cong: -0.5 }, p: 0.75 }
export const EMENDA_SG = { cash: 1, cd: 4 }

// ---- casos que chegam na Agenda ----
export const CASOS_SG = [
  { id: 'guerra', icon: '🔥', nome: 'Guerra entre facções', esf: ['mun', 'est', 'fed'], prob: 0.14,
    when: (s) => (s.fac.faccao >= 50 && s.fac.milicia >= 35) || s.fac.faccao >= 66,
    texto: (e) => `Duas facções disputam território e ${e.forca} registra tiroteios, ônibus queimados e moradores em fuga.`,
    ops: [
      { id: 'operacao', icon: '🚓', name: 'Operação de contenção', desc: 'Custa 2 de caixa. Contém a guerra, com risco de excesso.', cash: 2, p: 0.55, ok: { t: 'A operação conteve os confrontos.', fx: { seg: 1.5, pop: 0.6 }, fac: { faccao: -12 } }, bad: { t: 'A operação deixou mortos e virou escândalo.', fx: { img: -4, pop: -1 }, fac: { faccao: -4 } }, heat: 5 },
      { id: 'inteligencia', icon: '🕵️', name: 'Inteligência e prisões', desc: 'Custa 1 de caixa. Derruba lideranças.', cash: 1, p: 0.6, ok: { t: 'Lideranças presas e a guerra esfriou.', fx: { seg: 1 }, fac: { faccao: -8, milicia: -4 } }, bad: { t: 'A investigação vazou e as lideranças fugiram.', fx: { img: -1 }, fac: {} } },
      { id: 'mediar', icon: '🕴️', name: 'Mediar nos bastidores', desc: 'Um acordo tácito. Funciona, mas o preço é político.', cash: 0, p: 0.5, ok: { t: 'A paz foi comprada, e a conta virá depois.', fx: { seg: 1.2 }, fac: { faccao: 3 }, sujo: true }, bad: { t: 'O acordo vazou e a imprensa pegou.', fx: { img: -4, cong: -1 }, fac: {}, sujo: true }, corr: 6 },
      { id: 'forca', icon: '🪖', name: 'Acionar reforço federal (GLO)', desc: 'Só governador e presidente. Eficaz, mas caro em imagem.', cash: 1, p: 0.72, quem: ['governador', 'presidente'], ok: { t: 'As forças federais retomaram o controle.', fx: { seg: 2.5, img: -1.5 }, fac: { faccao: -14 } }, bad: { t: 'A GLO teve excessos.', fx: { seg: 1, img: -5, pop: -1.5 }, fac: { faccao: -6 } }, heat: 4 },
      { id: 'pedir', icon: '🙏', name: 'Pedir ajuda da União', desc: 'Só prefeito. Sem custo, mas depende de boa vontade.', cash: 0, p: 0.55, quem: ['prefeito'], ok: { t: 'A Força Nacional reforçou a cidade.', fx: { seg: 1.5 }, fac: { faccao: -8 } }, bad: { t: 'A resposta demorou e a cidade ficou exposta.', fx: { img: -1.5, pop: -0.5 }, fac: {} } },
      { id: 'esperar', icon: '🙈', name: 'Esperar acalmar', desc: 'Sem custo. A guerra segue e a população paga.', cash: 0, p: 0, ok: { t: '', fx: {}, fac: {} }, bad: { t: 'A guerra se arrastou e o medo tomou os bairros.', fx: { seg: -2, pop: -1, img: -1 }, fac: { faccao: 3 } } },
    ] },
  { id: 'corrupcao', icon: '🕳️', nome: 'Policiais ligados ao crime', esf: ['mun', 'est', 'fed'], prob: 0.12,
    when: (s) => s.corr >= 42,
    texto: (e) => `Uma investigação liga agentes de ${e.forca} a um esquema de proteção ao crime organizado.`,
    ops: [
      { id: 'afastar', icon: '✂️', name: 'Afastar e investigar', desc: 'Custa 1 de caixa. Limpa a casa e irrita a corporação.', cash: 1, p: 0.8, ok: { t: 'Os agentes foram afastados e a corregedoria assumiu.', fx: { img: 0.8 }, corr: -10, pol: -4 }, bad: { t: 'A limpeza gerou revolta interna.', fx: { img: -0.5 }, corr: -4, pol: -8 } },
      { id: 'reformar', icon: '🧹', name: 'Reformar a corregedoria', desc: 'Custa 2 de caixa. Mudança estrutural e demorada.', cash: 2, p: 0.7, ok: { t: 'A reforma deu mais independência à corregedoria.', fx: { img: 1, cong: -0.3 }, corr: -14 }, bad: { t: 'A reforma travou no Legislativo.', fx: { cong: -1 }, corr: -5 } },
      { id: 'abafar', icon: '🤐', name: 'Abafar o caso', desc: 'Sem custo. Se o caso vazar, vira escândalo.', cash: 0, p: 0.45, ok: { t: 'O caso morreu na imprensa.', fx: {}, corr: 4, sujo: true }, bad: { t: 'O abafamento vazou e virou escândalo nacional.', fx: { img: -5, pop: -1 }, corr: 6, sujo: true }, heat: 6 },
      { id: 'esperar', icon: '🙈', name: 'Deixar correr', desc: 'Sem custo. O caso segue na imprensa.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O caso seguiu nas manchetes e ninguém explicou nada.', fx: { img: -1.5 }, corr: 3 } },
    ] },
  { id: 'chacina', icon: '🕯️', nome: 'Chacina e comoção', esf: ['mun', 'est'], prob: 0.1,
    when: (s) => s.fac.faccao >= 55 || s.fac.milicia >= 55,
    texto: (e) => `Uma chacina numa comunidade comoveu o país. Há suspeita de envolvimento de agentes de ${e.forca}.`,
    ops: [
      { id: 'investigar', icon: '🔍', name: 'Investigação independente', desc: 'Custa 1 de caixa. Apura sem poupar ninguém.', cash: 1, p: 0.75, ok: { t: 'A investigação independente deu resposta às famílias.', fx: { img: 1.2, pop: 0.5 }, corr: -5 }, bad: { t: 'A apuração foi lenta e as famílias foram às ruas.', fx: { img: -1.5, pop: -0.5 } } },
      { id: 'apoio', icon: '🎗️', name: 'Apoio às famílias e vigilância', desc: 'Custa 1 de caixa. Resposta humana, sem enfrentar a corporação.', cash: 1, p: 1, ok: { t: 'O apoio às famílias acalmou a comoção.', fx: { img: 0.4, pop: 0.3 } } },
      { id: 'defender', icon: '🛡️', name: 'Defender a corporação', desc: 'Sem custo. Agrada a polícia e queima com a sociedade.', cash: 0, p: 0.6, ok: { t: 'A corporação gostou do apoio.', fx: { img: -1, seg: 0.3 }, pol: 8 }, bad: { t: 'A defesa foi vista como acobertamento.', fx: { img: -3.5, pop: -1 }, pol: 4 } },
      { id: 'esperar', icon: '🙈', name: 'Esperar a poeira baixar', desc: 'Sem custo. A comoção escala.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O silêncio foi cobrado na imprensa.', fx: { img: -2, pop: -0.6 } } },
    ] },
  { id: 'fuga', icon: '⛓️', nome: 'Fuga em massa de presídio', esf: ['est', 'fed'], prob: 0.09,
    when: (s) => s.fac.faccao >= 45,
    texto: () => 'Presos ligados a uma facção fugiram de um presídio e a polícia faz buscas.',
    ops: [
      { id: 'cerco', icon: '🚔', name: 'Cerco e recaptura', desc: 'Custa 2 de caixa. Resposta rápida.', cash: 2, p: 0.62, ok: { t: 'Quase todos foram recapturados.', fx: { seg: 1.2, img: 0.5 }, fac: { faccao: -5 } }, bad: { t: 'Muitos continuam foragidos e o caso virou piada.', fx: { img: -2.5, seg: -0.5 }, fac: { faccao: 3 } } },
      { id: 'demitir', icon: '✂️', name: 'Demitir a direção do presídio', desc: 'Sem custo. Mostra pulso, mas não recaptura ninguém.', cash: 0, p: 1, ok: { t: 'A demissão da direção respondeu à imprensa.', fx: { img: 0.2 } } },
      { id: 'esperar', icon: '🙈', name: 'Deixar a polícia resolver', desc: 'Sem custo. Se falhar, a conta chega.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'A fuga virou símbolo de descontrole.', fx: { img: -2, seg: -1 }, fac: { faccao: 2 } } },
    ] },
  { id: 'ataques', icon: '💥', nome: 'Onda de ataques em resposta', esf: ['mun', 'est'], prob: 0.35, reacao: true,
    when: (s) => s.reacao > 0 && s.fac.faccao >= 40,
    texto: (e) => `Depois das últimas operações, a facção respondeu com ataques a bases de ${e.forca} e ônibus incendiados.`,
    ops: [
      { id: 'reforco', icon: '🛡️', name: 'Reforçar o policiamento', desc: 'Custa 2 de caixa. Cobre a cidade e cansa a tropa.', cash: 2, p: 0.7, ok: { t: 'O reforço segurou a onda de ataques.', fx: { seg: 1, pop: 0.3 }, pol: -2 }, bad: { t: 'O reforço não foi suficiente e os ataques continuaram.', fx: { seg: -1, pop: -0.6 } } },
      { id: 'dialogo', icon: '🕴️', name: 'Negociar nos bastidores', desc: 'Sem custo. Cessam os ataques, com preço político.', cash: 0, p: 0.5, ok: { t: 'Os ataques cessaram do dia para a noite.', fx: { seg: 0.8 }, sujo: true, corr: 4 }, bad: { t: 'A negociação vazou.', fx: { img: -3.5 }, sujo: true } },
      { id: 'esperar', icon: '🙈', name: 'Aguardar', desc: 'Sem custo. O medo tomou a cidade.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'Os ataques pararam sozinhos, mas deixaram marcas.', fx: { seg: -1.2, pop: -0.7 } } },
    ] },
]
export const CASO_SG_POR_ID = Object.fromEntries(CASOS_SG.map((c) => [c.id, c]))
export const PADRAO_SG = 'esperar'

// ---- compras: viaturas e equipamentos ----
export const FORNECEDORES_SG = [
  { id: 'br_viat', pais: 'br', icon: '🚓', nome: 'Carrocerias Planalto', item: 'Viaturas leves', preco: 3, equip: 10, ent: 2, nec: 0, nota: 'Fabricante nacional. Gera emprego e entrega previsível.' },
  { id: 'br_blind', pais: 'br', icon: '🛻', nome: 'Blindados Serra Azul', item: 'Blindados leves', preco: 5, equip: 16, ent: 3, nec: 0, esf: ['est', 'fed'], nota: 'Blindado nacional. Mais barato com a indústria de defesa em dia.' },
  { id: 'br_nl', pais: 'br', icon: '🪖', nome: 'Brasil Menos Letal', item: 'Armamento de menor potencial ofensivo', preco: 2, equip: 6, ent: 2, nec: 0, naoletal: true, nota: 'Reduz o risco de excessos em operações.' },
  { id: 'eua_viat', pais: 'eua', icon: '🚔', nome: 'Patriot Motors (EUA)', item: 'Viaturas táticas', preco: 4, equip: 14, ent: 2, nec: 50, nota: 'Boa tecnologia. Entrega depende de relação com o fornecedor.' },
  { id: 'ue_cam', pais: 'ue', icon: '📹', nome: 'EuroSight (UE)', item: 'Câmeras corporais e monitoramento', preco: 4, equip: 12, ent: 3, nec: 50, corr: -6, nota: 'Transparência: ajuda a segurar a corrupção.' },
  { id: 'china_dr', pais: 'china', icon: '🛸', nome: 'Dragão Azul Drones (China)', item: 'Drones de vigilância', preco: 3, equip: 12, ent: 2, nec: 45, esf: ['est', 'fed'], nota: 'Barato e em escala. A relação com os EUA pode sofrer.' },
  { id: 'japao_rad', pais: 'japao', icon: '📡', nome: 'Sakura Comunicações (Japão e Coreia)', item: 'Rádios e comando integrado', preco: 3, equip: 10, ent: 2, nec: 45, nota: 'Integra as forças. Entrega confiável.' },
  { id: 'rus_heli', pais: 'rus', icon: '🚁', nome: 'Taiga Aviação (Rússia)', item: 'Helicópteros de patrulha', preco: 6, equip: 20, ent: 4, nec: 45, esf: ['fed'], nota: 'Muito equipamento, risco alto de embargo e atraso.' },
  { id: 'arg_equ', pais: 'arg', icon: '🧉', nome: 'Cuyo Equipamentos (Mercosul)', item: 'Equipamento de patrulha de fronteira', preco: 2, equip: 8, ent: 2, nec: 45, nota: 'Compra regional e simples.' },
]
export const FORNECEDOR_POR_ID_SG = Object.fromEntries(FORNECEDORES_SG.map((f) => [f.id, f]))
export const MODALIDADES_SG = [
  { id: 'licitacao', icon: '📑', nome: 'Licitação', desc: 'Lenta e segura. Entrega +1 rodada.', mult: 1, ent: 1 },
  { id: 'dispensa', icon: '⚡', nome: 'Dispensa por urgência', desc: 'Rápida (-1 rodada), com risco de ser pega em superfaturamento.', mult: 1, ent: -1, sujo: 0.35 },
  { id: 'g2g', icon: '🤝', nome: 'Acordo governo a governo', desc: 'Só estrangeiros. Preço 10% menor e relação +2, mas exige mais relação.', mult: 0.9, ent: 0, so: 'ext', nec: 10, rel: 2 },
  { id: 'offset', icon: '🧬', nome: 'Compra com transferência de tecnologia', desc: 'Só estrangeiros. 20% mais caro, mas rende pesquisa e emprego.', mult: 1.2, ent: 1, so: 'ext', offset: true },
]
export const MAX_CONTRATOS_SG = 2
export const ATRASO_SG = 0.15
export const EMBARGO_SG = { relMin: 40, chance: 0.4, devolve: 0.5 }

// ---- pesquisa de armamento (presidente) ----
export const PD_SG = [
  { id: 'naoletal', icon: '🧯', nome: 'Armas de menor potencial ofensivo', desc: 'Reduz o impacto de excessos e a chance de erro letal.', ef: 'Metade da perda de imagem por excesso.' },
  { id: 'blindagem', icon: '🛡️', nome: 'Blindagem nacional', desc: 'Veículos e coletes fabricados aqui.', need: 'def1', ef: '+5% nas operações e equipamento envelhece mais devagar.' },
  { id: 'cameras', icon: '📹', nome: 'Monitoramento e reconhecimento', desc: 'Câmeras e análise de imagem.', ef: '-10 na corrupção e +3% nas operações.' },
  { id: 'municao', icon: '🔫', nome: 'Munição e armas leves nacionais', desc: 'Indústria própria barateia o equipamento.', need: 'def1', ef: 'Compras nacionais 1 de caixa mais baratas.' },
  { id: 'ciber', icon: '💻', nome: 'Inteligência cibernética', desc: 'Rastreia dinheiro e comunicações do crime.', ef: '+10% contra a rede transnacional e mais força na asfixia financeira.' },
]
export const PD_POR_ID_SG = Object.fromEntries(PD_SG.map((p) => [p.id, p]))
export const PD_PASSOS_SG = 4
export const PD_CUSTO_SG = 2

// ---- acordos internacionais (presidente) ----
export const ACORDOS_SG = [
  { id: 'intel_eua', partner: 'eua', icon: '🦅', nome: 'Cooperação de inteligência com os EUA', desc: 'Rastreia a rede transnacional. Parte da base critica a soberania.', cash: 2, nec: 55, fx: { img: -0.5 }, rel: 4, ef: 'Rede transnacional -15 no alvo.' },
  { id: 'intel_ue', partner: 'ue', icon: '🏰', nome: 'Cooperação policial com a União Europeia', desc: 'Intercâmbio de inteligência e treinamento.', cash: 2, nec: 50, fx: {}, rel: 3, ef: 'Rede transnacional -12, corrupção -5.' },
  { id: 'tec_china', partner: 'china', icon: '🐉', nome: 'Transferência de tecnologia com a China', desc: 'Parcerias de pesquisa. Os EUA reparam.', cash: 3, nec: 55, fx: {}, rel: 3, outro: { eua: -2 }, ef: 'Avanço de pesquisa a cada 3 rodadas.' },
  { id: 'tec_japao', partner: 'japao', icon: '🗾', nome: 'Parceria tecnológica com Japão e Coreia', desc: 'Comunicação integrada e manutenção de equipamento.', cash: 2, nec: 50, fx: {}, rel: 3, ef: 'Equipamento rende +0,3 por rodada e a pesquisa avança.' },
  { id: 'controle_onu', partner: 'onu', icon: '🏛️', nome: 'Tratado de controle do tráfico de armas (ONU)', desc: 'Fecha rotas de armas ilegais.', cash: 1, nec: 50, fx: { img: 1 }, rel: 4, ef: 'Rede transnacional -15.' },
  { id: 'conj_arg', partner: 'arg', icon: '🧉', nome: 'Compra conjunta e patrulha com o Mercosul', desc: 'Compras em bloco e fronteira vigiada.', cash: 1, nec: 50, fx: {}, rel: 3, ef: 'Compras 1 de caixa mais baratas e rede transnacional -5.' },
  { id: 'export_ori', partner: 'ori', icon: '🛢️', nome: 'Exportação de material de defesa ao Oriente Médio', desc: 'Entra dinheiro, mas há polêmica.', cash: 1, nec: 55, fx: {}, rel: 3, need: 'def1', ef: '+1 de caixa a cada 3 rodadas e -0,3 de imagem.' },
  { id: 'rus_arm', partner: 'rus', icon: '🐻', nome: 'Compra de equipamento pesado da Rússia', desc: 'Muito equipamento, muito ruído diplomático.', cash: 2, nec: 45, fx: { img: -0.5 }, rel: 4, outro: { eua: -3, ue: -2 }, ef: 'Equipamento rende +0,4 por rodada.' },
]
export const ACORDO_POR_ID_SG = Object.fromEntries(ACORDOS_SG.map((a) => [a.id, a]))
export const MAX_ACORDOS_SG = 3
