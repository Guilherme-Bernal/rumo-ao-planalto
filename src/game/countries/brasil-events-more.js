// Eventos novos, separados por esfera (mun = municipal, est = estadual, fed = federal).
// Placeholders: {estado} {cidade} {partido} {rival}
const C = (label, fx, out) => ({ label, fx, out })
const G = (label, p, fx, out, altFx, altOut) => ({ label, fx, out, risk: p, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })
const flag = (g, f) => (g.ideas?.flags || []).includes(f)

const rawEvents = [
  /* municipal */
  E('poste', [0], 'mun', 'Rua às escuras em {cidade}', 'Moradores de um bairro denunciam que há três semanas os postes estão apagados. A prefeitura promete resolver "em breve".', [
    C('Ir ao bairro com eletricista e resolver na hora', { pop: 5, img: 2, cash: -3 }, 'Você virou o herói da rua. Os vizinhos fizeram até bolo.'),
    C('Protocolar um requerimento na Câmara', { cong: 2, img: 1, pop: -1 }, 'O requerimento foi aprovado e a luz ainda está apagada.'),
    G('Gravar um vídeo cobrando o prefeito', 0.55, { pop: 5, img: 1, cong: -2 }, 'O vídeo bombou e a prefeitura consertou em 24 horas.', { pop: -2, cong: -4 }, 'O prefeito respondeu que a rua nem era do bairro que você disse.'),
  ]),
  E('ambulantes', [0], 'mun', 'Guerra dos ambulantes', 'Comerciantes pedem a retirada dos camelôs da praça central. Os ambulantes pedem que você os defenda.', [
    C('Defender os ambulantes e propor regularização', { pop: 5, eco: 2, cong: -2, img: -1 }, 'Os ambulantes te levaram de volta de camiseta e salgadinho.'),
    C('Ficar com os comerciantes fixos', { eco: 3, cong: 3, pop: -4 }, 'O comércio agradeceu, a rua te vaiou.'),
    C('Propor uma feira organizada em dia fixo', { pop: 3, img: 3, cash: -2 }, 'Ninguém ficou plenamente satisfeito, o que costuma indicar um bom acordo.'),
  ]),
  E('castracao', [0], 'mun', 'Mutirão de castração de animais', 'Uma ONG pede apoio da Câmara para um mutirão de castração e vacinação de cães e gatos.', [
    C('Bancar o mutirão com verba de emenda', { pop: 5, img: 3, cash: -3, soc: 1 }, 'Fila de gente com cachorro no colo e selfie com um vira-lata chamado Pipoca.'),
    C('Apoiar só com divulgação', { pop: 2, img: 1 }, 'A ONG ficou agradecida e a fila foi curta.'),
    C('Deixar para depois', { pop: -2, img: -1 }, 'A ONG fez uma postagem sobre a sua omissão.'),
  ]),
  E('ciclovia', [0, 2], 'mun', 'Ciclovia em {cidade}', 'Ciclistas pedem uma ciclovia na avenida principal. Os motoristas ameaçam parar o trânsito.', [
    C('Apoiar a ciclovia', { img: 3, pop: -1, soc: 1, cash: -3 }, 'A cidade ganhou ciclovia e um grupo de pedal que te chama de "nosso vereador".'),
    C('Propor teste de 30 dias', { img: 2, pop: 1, cash: -1 }, 'O teste foi tão bem que ninguém quis tirar.'),
    C('Rejeitar o projeto', { pop: 2, img: -2, cong: 1 }, 'Os motoristas aplaudiram e os ciclistas fizeram um passeio protesto.'),
  ], (g) => !flag(g, 'seguranca') || g.stats.seg > 40),
  E('greveLixo', [0, 2], 'mun', 'Greve da coleta de lixo', 'A coleta parou e o lixo se acumula nas esquinas. O cheiro já virou assunto nacional no bairro.', [
    C('Mediar a negociação com os garis', { cong: 3, img: 3, pop: 2, cash: -4 }, 'Greve encerrada e você ganhou fama de mediador.'),
    C('Criticar os grevistas', { pop: -3, cong: -1, img: -2 }, 'Quem não gosta de lixo não gostou da sua fala.'),
    G('Entrar na coleta por um dia', 0.5, { pop: 7, img: 3 }, 'Uniforme, luva e muito aplauso nas redes.', { pop: -3, img: -2 }, 'O vídeo virou meme do político que "fingiu trabalhar".'),
  ]),
  E('feiraLivre', [0, 2], 'mun', 'Reforma da feira livre', 'A feira do bairro funciona há 40 anos em uma rua que alaga. Barraqueiros pedem cobertura.', [
    C('Garantir a cobertura e a drenagem', { pop: 5, eco: 2, cash: -5 }, 'Feira nova, pastel nobre e orgulho do bairro.'),
    C('Propor outro local, mais amplo', { eco: 1, pop: -2, img: 1, cash: -2 }, 'A ideia é boa, mas ninguém queria sair da rua antiga.'),
    C('Adiar o projeto', { pop: -3 }, 'A chuva chegou e o assunto também.'),
  ]),
  /* estadual */
  E('rodoviaDuplicacao', [1, 2], 'est', 'Duplicação da rodovia estadual', 'Prefeitos e empresários cobram a duplicação da principal rodovia de {estado}. O custo é alto e o prazo é longo.', [
    C('Levar o projeto ao governo e brigar pela verba', { eco: 4, cong: 2, cash: -5, pop: 1 }, 'A obra saiu do papel e o outdoor já está pronto.'),
    C('Apoiar uma parceria com a iniciativa privada', { eco: 3, img: -2, cash: 2 }, 'O pedágio está na mesa e o povo já reclama.'),
    C('Prometer sem se comprometer', { pop: 2, img: -2 }, 'Frase bonita, concreto nenhum.'),
  ], (g) => g.stats.eco < 80),
  E('seca', [1, 2], 'est', 'Seca no interior', 'A estiagem castiga produtores de {estado}. Os preços sobem e os silos esvaziam.', [
    C('Liberar crédito emergencial aos produtores', { eco: 3, pop: 3, cash: -6 }, 'A ajuda chegou antes da colheita. O campo respirou.'),
    C('Levar caminhões-pipa e cestas básicas', { pop: 5, img: 2, cash: -5, soc: 1 }, 'Ação rápida e nada glamorosa, mas muita gente ficou grata.'),
    C('Aguardar a chuva e o governo federal', { pop: -5, img: -3, cong: -1 }, 'A chuva atrasou, a paciência acabou.'),
  ], (g) => flag(g, 'agro') || g.stats.eco < 65),
  E('greveProfessores', [1, 2], 'est', 'Greve dos professores', 'A rede estadual para as aulas por reajuste salarial e melhoria das escolas.', [
    C('Abrir negociação e oferecer parte do reajuste', { soc: 3, pop: 2, cash: -5, cong: 1 }, 'Aulas voltaram e a conta ficou para o ano que vem.'),
    C('Endurecer e cortar o ponto', { cash: 3, soc: -4, pop: -4, img: -2 }, 'O Estado economizou, as escolas ficaram vazias.'),
    G('Comparecer ao ato e propor um pacto', 0.5, { soc: 4, pop: 4, img: 2 }, 'O pacto foi assinado diante das câmeras. Todos de mãos dadas.', { soc: -2, pop: -3, img: -2 }, 'Foi vaiado na assembleia e saiu escoltado.'),
  ]),
  E('universidade', [1, 2], 'est', 'Universidade estadual em crise', 'A universidade estadual avisa que não tem verba para fechar o semestre. Estudantes ocuparam a reitoria.', [
    C('Repassar verba extra para a universidade', { soc: 4, pop: 2, cash: -6 }, 'O semestre foi salvo e os estudantes saíram da reitoria.'),
    C('Pedir reforma administrativa na universidade', { cash: 2, soc: -2, pop: -2, img: 1 }, 'Acharam que você não entende a vida acadêmica.'),
    C('Intermediar um fundo com a iniciativa privada', { soc: 2, eco: 2, img: -1, cash: -2 }, 'Apareceu um logotipo novo na entrada do prédio.'),
  ]),
  E('policiaGreve', [2], 'est', 'Operação padrão na polícia', 'Policiais militares reduzem o ritmo de patrulhamento por reajuste. A cidade sente a ausência.', [
    C('Conceder o reajuste', { seg: 5, cash: -6, cong: 1 }, 'A rotina voltou ao normal e o caixa sentiu.'),
    C('Chamar reforço federal', { seg: 2, cong: -2, img: -1, cash: -2 }, 'A situação se acalmou, a relação ficou azeda.'),
    G('Aparecer no quartel e negociar pessoalmente', 0.5, { seg: 4, img: 3, pop: 2 }, 'Saiu do quartel com acordo e aplausos.', { seg: -4, img: -3, pop: -3 }, 'Foi vaiado e a operação padrão virou paralisação.'),
  ]),
  E('turismoEstado', [1, 2], 'est', 'Estado quer virar destino turístico', 'Uma agência propõe lançar uma campanha para atrair turistas a {estado}. Hotéis e comerciantes pedem apoio.', [
    C('Bancar a campanha com recursos do estado', { eco: 4, pop: 2, cash: -5 }, 'O turismo cresceu e os hotéis lotaram.'),
    C('Buscar parceria com o setor privado', { eco: 3, img: 1, cash: -2 }, 'Divisão de custos e de aplausos.'),
    C('Rejeitar e investir na indústria', { eco: 2, pop: -1, cong: 1 }, 'O setor turístico guardou rancor.'),
  ]),
  /* federal */
  E('emendaPix', [1, 3], 'fed', 'Emenda para a sua base', 'Prefeitos da sua base pedem emendas parlamentares para obras locais. É a moeda de troca de Brasília.', [
    C('Distribuir as emendas entre os aliados', { cong: 6, img: -3, cash: -3 }, 'Seus aliados ficaram felizes. A imprensa fiscaliza.'),
    C('Concentrar em obras visíveis na sua região', { pop: 5, cong: 2, img: -1, cash: -3 }, 'Placas com o seu nome em três cidades.'),
    C('Publicar todas as emendas na internet', { img: 5, cong: -2, pop: 1 }, 'Transparência rara e muita gente no seu pé.'),
  ]),
  E('pautaCostumes', [1, 3], 'fed', 'Pauta de costumes no plenário', 'Um projeto polêmico de costumes entra em votação e as galerias estão cheias. Os dois lados te cobram posição.', [
    C('Votar a favor e explicar a posição', { pop: 2, cong: 2, img: -2 }, 'Agradou à sua base e irritou a oposição.'),
    C('Votar contra e explicar a posição', { pop: 1, cong: -1, img: 2 }, 'Foi elogiado por quem o criticava antes.'),
    C('Se ausentar da votação', { img: -3, pop: -1 }, 'A ausência foi comentada mais que o voto.'),
  ]),
  E('reformaTributaria', [1, 3], 'fed', 'Reforma tributária no Congresso', 'A reforma tributária promete simplificar impostos e deixa todo mundo com medo de pagar mais.', [
    C('Defender a reforma', { eco: 3, img: 2, cong: 2, pop: -3 }, 'Os economistas aplaudiram e o povo não entendeu nada.'),
    C('Pedir mais prazo e mais debate', { cong: 1, img: 1 }, 'Posição prudente, daquelas que não rendem manchete.'),
    C('Votar contra, "para proteger o consumidor"', { pop: 4, eco: -2, img: -1, cong: -1 }, 'O consumidor gostou do slogan.'),
  ], (g) => !flag(g, 'contas') || g.stats.cash < 80),
  E('crisePetroleo', [3], 'fed', 'Preço dos combustíveis dispara', 'O petróleo sobe lá fora e a gasolina sobe aqui. Caminhoneiros ameaçam parar o país.', [
    C('Subsidiar o diesel por três meses', { pop: 4, eco: 2, cash: -8 }, 'O preço segurou, o caixa não.'),
    C('Negociar com os caminhoneiros e reduzir tributos', { pop: 2, eco: 1, cash: -4, cong: 1 }, 'Acordo fechado antes da paralisação.'),
    C('Manter a política e pedir paciência', { pop: -5, eco: -2, img: 1 }, 'A paciência acabou antes do combustível.'),
  ]),
  E('desastre', [3], 'fed', 'Desastre natural em {estado}', 'Chuvas e deslizamentos deixam milhares de desabrigados em {estado}. O governo federal é cobrado.', [
    C('Visitar a área e liberar crédito emergencial', { pop: 5, img: 3, cash: -7, soc: 1 }, 'Chegou rápido, abraçou famílias e foi bem avaliado.'),
    C('Mandar o ministro e acompanhar de Brasília', { pop: -1, img: -1, cash: -3 }, 'O ministro fez o que pôde, mas faltou presença.'),
    G('Sobrevoar a área para ver os danos', 0.5, { pop: 2, img: 1 }, 'A cena de helicóptero foi respeitosa e a ajuda chegou.', { pop: -5, img: -4 }, 'A foto do sobrevoo virou símbolo de distância.'),
  ]),
  E('crisDiplomatica', [3], 'fed', 'Atrito diplomático', 'Um país vizinho cancela um acordo comercial depois de uma declaração polêmica de um ministro seu.', [
    C('Pedir desculpas publicamente', { img: 2, eco: 2, pop: -2 }, 'O acordo voltou e alguns te chamaram de fraco.'),
    C('Sustentar a posição e negociar nos bastidores', { cong: 1, eco: -1, img: 1 }, 'A crise esfriou aos poucos.'),
    C('Retaliar e anunciar sanções', { pop: 3, eco: -4, img: -2 }, 'Aplausos na rua, preocupação no mercado.'),
  ]),
  E('copaBrasil', [1, 2, 3], 'fed', 'Candidatura para sediar um grande evento', 'O comitê esportivo pergunta se o país quer sediar uma competição internacional de peso.', [
    C('Apoiar a candidatura', { pop: 4, eco: 3, cash: -5, img: -1 }, 'Prometeram turismo, estádios e legado. Veremos o legado.'),
    C('Pedir um estudo de viabilidade primeiro', { img: 3, pop: -1, cong: 1 }, 'Acharam cauteloso. Outros acharam que era enrolação.'),
    C('Recusar e priorizar saúde e educação', { soc: 3, img: 2, pop: -2 }, 'Posição coerente, mas o torcedor ficou chateado.'),
  ]),
  E('influenciador', [0, 1, 2, 3], 'fed', 'Influenciador te chama para uma entrevista', 'Um influenciador de 2 milhões de seguidores quer te entrevistar ao vivo, sem edição.', [
    G('Aceitar e ir sem roteiro', 0.5, { pop: 6, img: 2 }, 'A entrevista viralizou pelo bom humor e pela franqueza.', { pop: -4, img: -4 }, 'Soltou uma frase inocente e o corte viralizou.'),
    C('Aceitar, com perguntas combinadas', { pop: 3, img: 1 }, 'Saiu sem polêmica e sem graça.'),
    C('Recusar educadamente', { pop: -1 }, 'Disse que preferia ouvir o povo pessoalmente.'),
  ]),
  E('fakeNews', [0, 1, 2, 3], 'fed', 'Um boato circula sobre você', 'Um áudio atribuído a você viraliza em grupos de mensagem. Não é seu, mas parece.', [
    C('Desmentir com vídeo e provas', { img: 3, pop: 1, cash: -1 }, 'O vídeo foi compartilhado mais que o boato.'),
    C('Processar quem espalhou', { img: 1, pop: -1, cash: -3 }, 'O processo andou devagar e o boato mais rápido.'),
    C('Ignorar e deixar passar', { img: -4, pop: -2 }, 'Ninguém esqueceu e muita gente acreditou.'),
  ]),
]

// Ajuste fino de equilíbrio: efeitos positivos um pouco maiores e custos um pouco menores
const tuneFx = (fx = {}) =>
  Object.fromEntries(Object.entries(fx).map(([k, v]) => [k, Math.round((v > 0 ? v * 1.04 : k === 'cash' ? v * 0.95 : v * 0.97) * 10) / 10]))
export const moreEvents = rawEvents.map((e) => ({
  ...e,
  choices: e.choices.map((c) => ({ ...c, fx: tuneFx(c.fx), ...(c.alt ? { alt: { ...c.alt, fx: tuneFx(c.alt.fx) } } : {}) })),
}))