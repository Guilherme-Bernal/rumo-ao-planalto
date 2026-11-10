// BLOCO 33: coalizão partidária (parlamentômetro), alianças de campanha e legado entre mandatos.
// Só dados e textos. A lógica fica no motor.

export const AGENDAS = {
  fiscal: { icon: '🧮', nome: 'Responsabilidade fiscal', stat: 'cash', txt: 'quer caixa em ordem' },
  social: { icon: '🩺', nome: 'Saúde e educação', stat: 'soc', txt: 'cobra investimento social' },
  seguranca: { icon: '🛡️', nome: 'Segurança pública', stat: 'seg', txt: 'quer mão firme na segurança' },
  agro: { icon: '🌾', nome: 'Economia e produção', stat: 'eco', txt: 'quer crescimento e crédito' },
  etica: { icon: '🧼', nome: 'Ética e transparência', stat: 'img', txt: 'cobra integridade' },
  reforma: { icon: '📜', nome: 'Reformas e governabilidade', stat: 'cong', txt: 'quer uma base organizada' },
}
export const STATUS = {
  base: { nome: 'Na base', icon: '🤝' },
  neutro: { nome: 'Independente', icon: '⚖️' },
  oposicao: { nome: 'Oposição', icon: '🥊' },
}
export const COAL_ACOES = [
  { id: 'agradar', icon: '☕', name: 'Agradar a bancada', desc: 'Custa 2 de Caixa. Sobe o humor do partido.', cash: 2, humor: 14, cd: 2 },
  { id: 'cargo', icon: '🪪', name: 'Oferecer um cargo', desc: 'Sobe muito o humor, mas pega mal (-0,6 Imagem).', cash: 0, humor: 24, img: -0.6, cd: 3 },
]
export const COAL_EVENTOS = {
  entrar: {
    icon: '🤝', padrao: 'recusar',
    titulo: (p) => `${p.sigla} quer entrar na base`,
    texto: (p, a) => `O ${p.sigla} (${p.cad}% das cadeiras) se aproxima e ${a.txt}. Querem formalizar o apoio ao governo.`,
    ops: [
      { id: 'aceitar', icon: '✅', name: 'Aceitar', desc: 'Custa 1 de Caixa e 0,5 de Imagem. O partido entra na base.', cash: 1, fx: { img: -0.5 }, status: 'base', humor: 12 },
      { id: 'exigir', icon: '📑', name: 'Aceitar com a agenda no papel', desc: 'Entra na base, mas cobra a agenda deles com mais força.', fx: {}, status: 'base', humor: 4, rigido: true },
      { id: 'recusar', icon: '🚫', name: 'Recusar', desc: 'Sem custo, mas o partido esfria.', fx: {}, humor: -10 },
    ],
  },
  sair: {
    icon: '🚪', padrao: 'deixar',
    titulo: (p) => `${p.sigla} ameaça deixar a base`,
    texto: (p, a) => `O ${p.sigla} (${p.cad}% das cadeiras) está insatisfeito: ${a.txt}. A bancada discute a saída.`,
    ops: [
      { id: 'agradar', icon: '☕', name: 'Atender a agenda', desc: 'Custa 3 de Caixa e acalma a bancada.', cash: 3, fx: {}, humor: 26 },
      { id: 'cargo', icon: '🪪', name: 'Dar um cargo', desc: 'Resolve rápido, mas pega mal.', fx: { img: -1 }, humor: 22 },
      { id: 'deixar', icon: '👋', name: 'Deixar sair', desc: 'Sem custo agora, mas você perde a base deles.', fx: {}, status: 'neutro', humor: -5 },
    ],
  },
  exigencia: {
    icon: '📞', padrao: 'negar',
    titulo: (p) => `${p.sigla} pede espaço no governo`,
    texto: (p) => `O ${p.sigla} quer indicar nomes para cargos de segundo escalão em troca de fidelidade nas votações.`,
    ops: [
      { id: 'atender', icon: '✅', name: 'Atender o pedido', desc: 'Custa 1 de Caixa e 0,5 de Imagem. Garante fidelidade.', cash: 1, fx: { img: -0.5 }, humor: 18 },
      { id: 'negar', icon: '🚫', name: 'Negar', desc: 'Economiza, mas o partido fica ressentido.', fx: {}, humor: -12 },
    ],
  },
  debandada: {
    icon: '💥', padrao: 'segurar',
    titulo: (p) => `Racha no seu partido, o ${p.sigla}`,
    texto: (p) => `A cúpula do ${p.sigla}, o seu partido, ameaça se afastar. Sem a sua legenda a base política vira cacos.`,
    ops: [
      { id: 'segurar', icon: '🧲', name: 'Fazer um grande gesto à legenda', desc: 'Custa 4 de Caixa e recompõe a cúpula.', cash: 4, fx: {}, humor: 32 },
      { id: 'reunir', icon: '🤝', name: 'Chamar uma reunião de pacificação', desc: 'Barato, mas a cúpula pode não se convencer.', fx: {}, humor: 14, risco: { p: 0.4, fx: { cong: -2, img: -1 } } },
      { id: 'enfrentar', icon: '⚔️', name: 'Enfrentar a cúpula', desc: 'Mostra força, mas abre uma briga interna feia.', fx: { cong: -2.5, img: 0.5 }, humor: -15 },
    ],
  },
}

/* ---------- legado entre mandatos ---------- */
export const LEGADO_EVENTOS = {
  marca: {
    icon: '🏛️', padrao: 'orgulho', cond: (l) => l.leis >= 3 && l.img >= 50,
    titulo: () => 'Uma lei sua virou marca',
    texto: (l) => `Entre as ${l.leis} leis do seu governo anterior, uma ganhou nome próprio e é citada em todo debate. Dá para usar isso a seu favor.`,
    ops: [
      { id: 'orgulho', icon: '📣', name: 'Fazer campanha em cima disso', desc: 'Custa 1 de Caixa e rende popularidade.', cash: 1, fx: { pop: 2, img: 0.8 } },
      { id: 'discreto', icon: '🤫', name: 'Deixar o assunto falar por si', desc: 'Sem custo e com ganho pequeno.', fx: { pop: 0.8 } },
    ],
  },
  fantasma: {
    icon: '👻', padrao: 'explicar', cond: (l) => l.sujo >= 2 || l.img < 40,
    titulo: () => 'Um escândalo antigo ressurgiu',
    texto: () => 'Um episódio do seu mandato passado voltou às manchetes, desta vez com documentos novos.',
    ops: [
      { id: 'explicar', icon: '🗣️', name: 'Dar explicações públicas', desc: 'Pode estancar o assunto ou criar nova pauta.', fx: {}, risco: { p: 0.5, fx: { img: -2.5, pop: -1 } }, ganho: { img: 1 } },
      { id: 'contra', icon: '⚔️', name: 'Contra-atacar', desc: 'Desvia o foco, com risco de parecer culpado.', fx: { cong: 1 }, risco: { p: 0.55, fx: { img: -3 } } },
      { id: 'processar', icon: '⚖️', name: 'Processar quem vazou', desc: 'Custa 2 de Caixa e passa uma imagem de firmeza.', cash: 2, fx: { img: 0.5 }, risco: { p: 0.3, fx: { img: -2 } } },
    ],
  },
  saudade: {
    icon: '🥹', padrao: 'acenar', cond: (l) => l.pop >= 62,
    titulo: () => 'Saudade do seu governo',
    texto: () => 'Uma pesquisa mostra que muita gente lembra do seu mandato anterior com carinho.',
    ops: [
      { id: 'acenar', icon: '👋', name: 'Aproveitar o momento', desc: 'Discurso em tom nostálgico. Sem custo.', fx: { pop: 1.5, img: 0.5 } },
      { id: 'prometer', icon: '🎯', name: 'Prometer repetir o feito', desc: 'Ganha mais, mas aumenta a cobrança.', fx: { pop: 2.5, cong: 1 }, risco: { p: 0.35, fx: { pop: -2 } } },
    ],
  },
  rival: {
    icon: '🥊', padrao: 'ignorar', cond: (l) => l.rv === 'inimigo' || l.rv === 'volta',
    titulo: () => 'O rival do seu passado volta a atacar',
    texto: () => 'Quem perdeu para você na eleição anterior ressurge com um dossiê de promessas não cumpridas.',
    ops: [
      { id: 'responder', icon: '📢', name: 'Responder com dados', desc: 'Custa 1 de Caixa. Se acertar, vira aplauso.', cash: 1, fx: {}, risco: { p: 0.4, fx: { img: -2 } }, ganho: { img: 1.5 } },
      { id: 'ignorar', icon: '🙈', name: 'Ignorar', desc: 'Barato, mas as acusações ficam sem resposta.', fx: { img: -1 } },
    ],
  },
  conspira: {
    icon: '🕸️', padrao: 'investigar', cond: (l) => l.mist === 'calada' || l.mist === 'ativa',
    titulo: () => 'A teia do mandato passado volta a se mexer',
    texto: () => 'Quem você deixou solto no mandato anterior voltou a procurar a oposição.',
    ops: [
      { id: 'investigar', icon: '🔎', name: 'Reabrir a investigação', desc: 'Custa 2 de Caixa e reduz o risco.', cash: 2, fx: { img: 0.5 } },
      { id: 'esquecer', icon: '🤐', name: 'Deixar quieto', desc: 'Economiza, mas o rumor cresce.', fx: { img: -1, cong: -0.5 } },
    ],
  },
}
