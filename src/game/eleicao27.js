// BLOCO 27: debate com réplica e tréplica, pesquisas por grupo e estado, boatos e checagem.
export const TEMAS_DEBATE = [
  { icon: '🩺', tema: 'a fila da saúde' }, { icon: '🛡️', tema: 'a segurança pública' }, { icon: '📈', tema: 'o desemprego' },
  { icon: '🎓', tema: 'a qualidade das escolas' }, { icon: '🏗️', tema: 'as obras paradas' }, { icon: '💰', tema: 'o corte de gastos' },
  { icon: '🌳', tema: 'o meio ambiente' }, { icon: '🧾', tema: 'a corrupção' },
]
export const DEB_ABORDAGENS = [
  { id: 'dados', icon: '📊', name: 'Apresentar dados', desc: 'Números e fatos. Agrada quem pensa com a cabeça.', eff: { pragmatico: [6, 2], idealista: [3, 1], ganancioso: [4, 3], orgulhoso: [2, 0], cauteloso: [5, 1] } },
  { id: 'emocao', icon: '❤️', name: 'Contar uma história', desc: 'Emoção e exemplo pessoal. Pega o idealista.', eff: { pragmatico: [1, 0], idealista: [7, 3], ganancioso: [2, 0], orgulhoso: [4, 2], cauteloso: [3, 1] } },
  { id: 'ataque', icon: '⚔️', name: 'Atacar o histórico dele', desc: 'Arrisca a plateia, mas tira o orgulhoso do sério.', eff: { pragmatico: [-1, 3], idealista: [-2, 1], ganancioso: [2, 5], orgulhoso: [0, 7], cauteloso: [-3, 2] } },
  { id: 'proposta', icon: '📝', name: 'Fazer uma proposta concreta', desc: 'Plano com prazo. Cai bem com pragmático e cauteloso.', eff: { pragmatico: [7, 2], idealista: [5, 1], ganancioso: [2, 0], orgulhoso: [2, 0], cauteloso: [6, 2] } },
  { id: 'ironia', icon: '😏', name: 'Ironizar', desc: 'Ridiculariza. Funciona com orgulhoso e interesseiro, pega mal com idealista.', eff: { pragmatico: [0, 1], idealista: [-3, -1], ganancioso: [3, 3], orgulhoso: [4, 6], cauteloso: [-2, 1] } },
  { id: 'calma', icon: '🧘', name: 'Manter a calma', desc: 'Firmeza sem briga. Segura o cauteloso.', eff: { pragmatico: [3, 1], idealista: [3, 1], ganancioso: [1, 0], orgulhoso: [1, 1], cauteloso: [6, 3] } },
]
export const DEB_FALAS = {
  pragmatico: { forte: ['"Isso não fecha na planilha. Cadê o dinheiro de {t}?"', '"Discurso é bonito, mas {t} precisa de resultado."'], fraco: ['"Está bem, os números de {t} são esses mesmos."', '"Aceito o ponto sobre {t}, mas falta prazo."'] },
  idealista: { forte: ['"{t} é questão de princípio, e vocês esquecem as pessoas."', '"Quem de fato vive {t} sabe que não é só técnica."'], fraco: ['"Tem razão, {t} pede mais sensibilidade."', '"Concordo com parte do que disse sobre {t}."'] },
  ganancioso: { forte: ['"Todo mundo sabe quem se beneficia com {t}."', '"Fale de {t} sem esquecer quem paga a conta."'], fraco: ['"Está bem, {t} pode render para os dois lados."', '"Esse argumento sobre {t} me pegou."'] },
  orgulhoso: { forte: ['"Eu governei isso antes. Ninguém me ensina sobre {t}."', '"Respeite a minha trajetória quando falar de {t}."'], fraco: ['"Não admito esse tom! {t} não é assunto para ofensa."', '"Isso é desrespeito. Estou perdendo a paciência com {t}."'] },
  cauteloso: { forte: ['"Precisa ir com calma em {t}. Mudar rápido assusta."', '"Vamos com cuidado, {t} já deu problema antes."'], fraco: ['"Hum, sobre {t}, preciso pensar melhor."', '"Admito que não esperava isso em {t}."'] },
}

export const GRUPOS = [
  { id: 'jovens', icon: '🧑‍🎓', name: 'Jovens', peso: 22 },
  { id: 'evangelicos', icon: '⛪', name: 'Evangélicos', peso: 20 },
  { id: 'empresarios', icon: '💼', name: 'Empresários', peso: 8 },
  { id: 'idosos', icon: '🧓', name: 'Idosos', peso: 18 },
  { id: 'trabalhadores', icon: '👷', name: 'Trabalhadores', peso: 32 },
]

export const BOATOS_FALSOS = [
  'Foto montada mostra {n} em festa luxuosa durante a enchente.',
  'Áudio falso atribuído a {n} fala em cortar aposentadorias.',
  'Corrente de WhatsApp diz que {n} vai fechar escolas rurais.',
  'Print falso de mensagem de {n} ofendendo professores.',
  'Vídeo editado mostra {n} dormindo numa sessão importante.',
  'Boato afirma que o partido de {n} vai taxar a poupança.',
  'Post viral diz que {n} mandou prender um jornalista.',
]
export const BOATOS_REAIS = [
  { cond: 'heat', texto: 'Reportagem retoma um contrato suspeito do mandato de {n}.' },
  { cond: 'any', texto: 'Levantamento mostra que {n} viajou mais do que a média dos colegas.' },
  { cond: 'any', texto: 'Jornal lembra uma declaração antiga de {n} que contradiz o discurso de agora.' },
  { cond: 'promessa', texto: 'Adversário cobra promessa quebrada de {n}: "{p}".' },
]
export const BOATO_ACOES = [
  { id: 'checar', icon: '🔎', name: 'Acionar agência de checagem', desc: 'Custa 1 de Caixa. Revela se é falso ou verdadeiro.', cash: 1 },
  { id: 'desmentir', icon: '📣', name: 'Desmentir', desc: 'Custa 1 de Caixa. Funciona contra o falso, mas explode se for verdadeiro.', cash: 1 },
  { id: 'explicar', icon: '🗣️', name: 'Explicar com transparência', desc: 'Sem custo. Reduz o dano do verdadeiro, pouco útil contra o falso.', cash: 0 },
  { id: 'processar', icon: '⚖️', name: 'Processar o autor', desc: 'Custa 2 de Caixa. Bom contra o falso, péssimo se for verdadeiro.', cash: 2 },
  { id: 'ignorar', icon: '🙈', name: 'Ignorar', desc: 'Sem custo. O dano continua.', cash: 0 },
]
