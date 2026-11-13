// BLOCO 44: mídia e redes. Estúdio próprio: canal de vídeos, jornal próprio e coletivas de imprensa.
// Escândalos nascem do histórico de jogo sujo e do calor do momento. Tudo fictício.

// ---- canal de vídeos ----
export const FORMATOS_EST = [
  { id: 'bastidores', icon: '🎬', nome: 'Bastidores do gabinete', desc: 'Mostra o dia a dia. Seguro, rende pouco.', cash: 0, cd: 3, p: 0.85, ok: { img: 0.8, pop: 0.4 }, bad: { img: -0.3 }, insc: 2, okT: 'O vídeo humanizou o gabinete.', badT: 'O vídeo passou batido.' },
  { id: 'explica', icon: '🧑‍🏫', nome: 'Explicando uma lei', desc: 'Precisa de lei vigente. Agrada quem quer aquele tema.', cash: 0, cd: 4, p: 0.75, ok: { img: 1, pop: 0.5 }, bad: { img: -0.5 }, insc: 3, okT: 'A explicação clara viralizou entre quem acompanha o tema.', badT: 'O vídeo ficou técnico demais e ninguém terminou.', lei: true },
  { id: 'povo', icon: '🎤', nome: 'Conversa com o povo na rua', desc: 'Gravar na rua rende simpatia. E gafe.', cash: 0, cd: 3, p: 0.65, ok: { pop: 1.5, img: 0.3 }, bad: { img: -1.5, pop: -0.3 }, insc: 4, okT: 'O povo gostou de ser ouvido e o vídeo bombou.', badT: 'Cortaram uma fala sua fora de contexto.' },
  { id: 'humor', icon: '😂', nome: 'Vídeo de humor', desc: 'Pode viralizar de verdade ou virar vergonha.', cash: 0, cd: 4, p: 0.5, ok: { pop: 2.5, img: 0.3 }, bad: { img: -1.8 }, insc: 10, okT: 'O vídeo virou meme e o canal explodiu.', badT: 'O vídeo virou piada, mas contra você.' },
  { id: 'live', icon: '🔴', nome: 'Live de perguntas', desc: 'Responde ao vivo, sem edição.', cash: 0, cd: 4, p: 0.55, ok: { pop: 2, img: 1 }, bad: { img: -2, pop: -0.5 }, insc: 5, okT: 'A live foi calorosa e cheia de gente.', badT: 'Uma pergunta te pegou e o trecho circulou.' },
  { id: 'mutirao', icon: '🤲', nome: 'Mutirão filmado', desc: 'Custa 1 de caixa. Ação social com câmera.', cash: 1, cd: 4, p: 0.8, ok: { img: 1.5, pop: 1 }, bad: { img: -1, pop: -0.3 }, insc: 3, okT: 'O mutirão rendeu imagens fortes.', badT: 'Chamaram de propaganda, e a crítica pegou.' },
]
export const EQUIP_EST = [
  { nivel: 1, nome: 'Microfone e iluminação', custo: 3, bonus: 0.05 },
  { nivel: 2, nome: 'Câmera e edição profissional', custo: 5, bonus: 0.1 },
  { nivel: 3, nome: 'Estúdio completo', custo: 8, bonus: 0.15 },
]

// ---- jornal próprio ----
export const LINHAS_EST = [
  { id: 'serio', icon: '🏛️', nome: 'Sério e institucional', desc: 'Credibilidade alta, tiragem menor.', cred: 70, tir: 8 },
  { id: 'popular', icon: '🗞️', nome: 'Popular e de bairro', desc: 'Chega a mais gente, credibilidade mediana.', cred: 55, tir: 14 },
  { id: 'combativo', icon: '⚔️', nome: 'Combativo', desc: 'Bate forte, mas cobra credibilidade.', cred: 45, tir: 12 },
]
export const MANCHETES_EST = [
  { id: 'entregas', icon: '🏗️', nome: 'Entregas do governo', desc: 'Mostra o que foi feito.', cash: 1, p: 0.85, ok: { img: 1, pop: 0.6 }, bad: { img: -0.3 }, cred: 1, okT: 'A edição mostrou entregas e foi bem lida.', badT: 'A edição foi lida como propaganda.' },
  { id: 'coluna', icon: '✍️', nome: 'Coluna de opinião', desc: 'Dá voz à sua leitura do momento.', cash: 1, p: 0.7, ok: { pop: 0.8, img: 0.3 }, bad: { img: -0.6 }, cred: 0, okT: 'A coluna pautou conversa nos bairros.', badT: 'A coluna foi lida como puxa-saco.' },
  { id: 'reportagem', icon: '🔎', nome: 'Reportagem investigativa', desc: 'Apura um problema local. Sobe a credibilidade.', cash: 1, p: 0.7, ok: { pop: 0.4, img: 0.6 }, bad: { img: -0.3 }, cred: 3, okT: 'A reportagem apurou algo importante e rendeu respeito.', badT: 'A reportagem não achou nada novo.' },
  { id: 'denuncia', icon: '📌', nome: 'Denúncia contra o rival', desc: 'Matéria apurada contra o adversário. Com credibilidade baixa, é arriscada.', cash: 1, p: 0.6, ok: { pop: 1, cong: 0.5 }, bad: { img: -2 }, cred: -1, rival: 2, heat: 6, dirty: false, okT: 'A denúncia atingiu o rival e ele teve de se explicar.', badT: 'A denúncia foi derrubada e você virou alvo.' },
  { id: 'boato', icon: '🧨', nome: 'Matéria sem apuração (desinformação)', desc: 'Atinge o rival sem prova. Se descobrirem, o estrago é seu.', cash: 1, p: 0.5, ok: { pop: 1.5 }, bad: { img: -4, pop: -1 }, cred: -6, rival: 3, heat: 10, dirty: true, okT: 'O boato colou, e a oposição foi à defensiva.', badT: 'Descobriram que a matéria era inventada. A credibilidade do jornal ruiu.' },
]

// ---- coletiva de imprensa ----
export const POSTURAS_EST = [
  { id: 'transparente', icon: '🔓', nome: 'Transparência total', desc: 'Responde tudo. Seguro, mas expõe.', cash: 0, p: 0.7, ok: { img: 1.2, pop: 0.5 }, bad: { img: -1 }, okT: 'A coletiva transparente foi bem avaliada.', badT: 'Uma resposta honesta demais rendeu manchete ruim.' },
  { id: 'preparada', icon: '📋', nome: 'Coletiva preparada', desc: 'Custa 1 de caixa. Treinada com a equipe.', cash: 1, p: 0.8, ok: { img: 1, pop: 0.3 }, bad: { img: -0.5 }, okT: 'Tudo saiu ensaiado e sem tropeço.', badT: 'O ensaio ficou na cara e virou meme.' },
  { id: 'dura', icon: '🛑', nome: 'Postura dura', desc: 'Corta perguntas incômodas. Agrada a base e irrita a imprensa.', cash: 0, p: 0.45, ok: { pop: 1, img: 0.5 }, bad: { img: -2.5 }, okT: 'A base gostou de ver você peitar a imprensa.', badT: 'Cortar jornalistas virou o assunto do dia.' },
]

// ---- escândalos ----
export const ESCANDALOS_EST = [
  { id: 'foto', icon: '📸', nome: 'Foto em festa vaza', texto: 'Fotos suas em uma festa privada circulam nas redes e nos grupos de mensagem.' },
  { id: 'nota', icon: '🧾', nome: 'Nota fiscal suspeita', texto: 'Um portal publica uma nota fiscal estranha ligada ao seu gabinete.' },
  { id: 'assessor', icon: '🗣️', nome: 'Ex-assessor abre o jogo', texto: 'Um ex-assessor dá entrevista e conta bastidores que você preferia manter em segredo.' },
  { id: 'mensagem', icon: '💬', nome: 'Mensagem vazada', texto: 'Uma troca de mensagens suas vaza e é tirada de contexto.' },
  { id: 'patrimonio', icon: '🏠', nome: 'Patrimônio em questão', texto: 'Jornalistas comparam o seu patrimônio com a renda declarada.' },
  { id: 'processo', icon: '📂', nome: 'Processo antigo reaparece', texto: 'Um processo arquivado há anos volta à tona na véspera de decisões importantes.' },
]
export const ESC_EST_POR_ID = Object.fromEntries(ESCANDALOS_EST.map((e) => [e.id, e]))
export function opsEscandalo(ctx) {
  const { sujo, midia } = ctx
  const cl = (v) => Math.max(0.1, Math.min(0.9, v))
  return [
    { id: 'assumir', icon: '🙇', name: 'Assumir e pedir desculpas', desc: 'Dói agora, esfria rápido.', cash: 0, p: 1, ok: { t: 'Você assumiu e o assunto esfriou.', fx: { img: -1, pop: -0.3 } }, heat: -5 },
    { id: 'desmentir', icon: '📣', name: 'Desmentir', desc: sujo ? 'Com o seu histórico, desmentir é arriscado.' : 'Sem rastro contra você, desmentir tem boa chance.', cash: 0, p: cl((sujo ? 0.35 : 0.65) + (midia ? 0.05 : 0)), ok: { t: 'O desmentido colou e o caso murchou.', fx: { img: 0.5 } }, bad: { t: 'A mentira foi exposta e o caso cresceu.', fx: { img: -3, pop: -1 } }, heat: -2, heatBad: 4 },
    { id: 'demitir', icon: '✂️', name: 'Demitir o responsável', desc: 'Corta alguém da equipe e entrega a cabeça.', cash: 0, p: 1, ok: { t: 'A demissão deu uma resposta ao caso.', fx: { img: -0.8, cong: -0.3 } }, heat: -3 },
    { id: 'midia', icon: '📺', name: 'Contra-atacar nos seus canais', desc: midia ? 'Usa o seu canal ou jornal para dar a versão.' : 'Precisa de canal ou jornal próprio.', cash: 0, p: cl(0.55 + (midia ? midia : 0)), ok: { t: 'A sua versão circulou e virou o jogo.', fx: { img: 0.3, pop: 0.5 } }, bad: { t: 'A sua versão foi lida como defesa de interesse.', fx: { img: -2 } }, heat: -3, heatBad: 2, need: 'midia' },
    { id: 'esperar', icon: '🙈', name: 'Esperar passar', desc: 'Sem custo. O desgaste cresce.', cash: 0, p: 0, ok: { t: '', fx: {} }, bad: { t: 'O caso ficou sem resposta e se arrastou.', fx: { img: -1.5, pop: -0.5 } }, heat: 2, heatBad: 2 },
  ]
}
export const PADRAO_ESC = 'esperar'
