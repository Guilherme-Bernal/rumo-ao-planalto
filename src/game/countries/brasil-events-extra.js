// Eventos extras: alguns só aparecem para certos perfis ou situações (cond) e alguns têm escolhas de risco (🎲).
// Placeholders: {estado} {cidade} {partido} {rival}
const C = (label, fx, out) => ({ label, fx, out })
// Escolha arriscada: com chance p dá certo (fx/out), senão acontece alt
const G = (label, p, fx, out, altFx, altOut) => ({ label, fx, out, risk: p, alt: { fx: altFx, out: altOut } })
const E = (id, stages, title, text, choices, cond) => ({ id, stages, title, text, choices, cond })
const ANY = [0, 1, 2, 3]
const has = (g, cat, ...ids) => ids.includes(g.traits[cat])

export const extraEvents = [
  E('convencao', ANY, 'Convenção do {partido}', 'O {partido} faz sua convenção e quer saber de que lado você está na briga pela direção.', [
    C('Apoiar a ala majoritária', { cong: 6, img: -1 }, 'Você ficou com quem manda. Cargos e favores chegam.'),
    C('Lançar uma chapa própria', { cong: -4, pop: 4, img: 3 }, 'Perdeu a votação, mas virou símbolo da renovação.'),
    C('Ficar neutro e comer salgadinho', { cong: -1 }, 'Ninguém te culpa. Ninguém te agradece.'),
  ], (g) => !!g.party),
  E('fundo', ANY, 'Dinheiro do fundo partidário', 'O {partido} vai repartir parte do fundo e sua parcela depende do quanto você ajudou a legenda.', [
    C('Pedir a maior fatia possível', { cash: 10, cong: -3, img: -2 }, 'Levou bastante, mas criou desafeto no diretório.'),
    C('Aceitar a divisão padrão', { cash: 5 }, 'Tudo dentro do combinado.'),
    C('Abrir mão em nome da legenda', { cong: 5, img: 3, cash: -2 }, 'Virou herói de convenção.'),
  ], (g) => !!g.party),
  E('chuvas', ANY, 'Chuvas castigam {cidade}', 'Temporal derruba casas e bloqueia estradas. A Defesa Civil pede ajuda.', [
    C('Ir ao local e coordenar o resgate', { pop: 6, img: 3, cash: -6 }, 'Pé na lama, capa amarela e olhos marejados. Povo gostou.'),
    G('Mandar um drone e gravar um vídeo', 0.5, { pop: 4, img: 2 }, 'O vídeo bombou, mas o povo sentiu falta da presença.', { pop: -4, img: -3 }, 'Chamaram de "político de gabinete" e o termo grudou.'),
    C('Culpar o governo anterior', { img: -4, pop: -2 }, 'A água baixou. A desculpa não.'),
  ]),
  E('greve', [1, 2, 3], 'Greve geral do funcionalismo', 'Servidores cruzam os braços exigindo reajuste. Hospitais e escolas ficam no vazio.', [
    C('Conceder o reajuste', { pop: 4, soc: 4, cash: -9, eco: -1 }, 'A greve acabou. O caixa também sentiu.'),
    C('Negociar um meio-termo', { cong: 3, soc: -1, cash: -3 }, 'Ninguém saiu feliz, mas todos voltaram ao trabalho.'),
    C('Endurecer e cortar o ponto', { cash: 4, pop: -6, soc: -4, cong: -3 }, 'Economizou, mas virou vilão nos sindicatos.'),
  ]),
  E('debate', [1, 2, 3], 'Debate na TV', 'O debate é ao vivo e todo mundo vai assistir. {rival} já treinou as frases de efeito.', [
    G('Atacar sem dó', 0.5, { pop: 6, img: -2 }, 'A plateia vibrou. Viralizou o corte do ataque.', { pop: -5, img: -5 }, 'Passou do ponto e virou o maior meme do ano.'),
    C('Falar de propostas', { img: 4, pop: 1 }, 'Maduro e técnico. Poucos aplausos, muito respeito.'),
    G('Improvisar com humor', 0.6, { pop: 7, img: 2 }, 'A piada pegou e o auditório riu junto.', { pop: -3, img: -3 }, 'A piada não pegou. O silêncio durou uma eternidade.'),
  ]),
  E('fakenews', ANY, 'Boato nas redes', 'Circula um áudio falso com a sua voz dizendo coisas horríveis. A base está dividida.', [
    G('Processar e desmentir ao vivo', 0.65, { img: 5, pop: 2, cash: -3 }, 'A perícia provou o golpe. A narrativa virou a seu favor.', { img: -4, pop: -2, cash: -3 }, 'Atrasou a resposta e o boato já tinha pegado.'),
    C('Ignorar até passar', { img: -3, pop: -3 }, 'A internet não esquece.'),
    C('Contratar equipe de resposta rápida', { img: 3, cash: -5 }, 'Controlou os danos com custo alto.'),
  ]),
  E('dolar', [2, 3], 'Dólar dispara', 'O dólar sobe de repente e o preço do pão e do combustível vai junto.', [
    C('Anunciar pacote de estímulo', { pop: 3, eco: 3, cash: -9 }, 'Acalmou os ânimos por um tempo. A conta virá.'),
    C('Manter a calma e esperar', { eco: -4, pop: -3 }, 'O mercado não perdoa a hesitação.'),
    C('Cortar gastos para dar sinal ao mercado', { eco: 2, cash: 6, soc: -3, pop: -3 }, 'O mercado aplaudiu. O povo nem tanto.'),
  ]),
  E('pesquisa', ANY, 'Pesquisa vazada', 'Uma pesquisa interna cai na imprensa antes da hora: você está pior do que dizia.', [
    C('Admitir e mudar a estratégia', { img: 4, pop: -1 }, 'Sinceridade rende pontos entre os analistas.'),
    C('Dizer que o instituto é inimigo', { cong: 2, img: -4 }, 'A base gostou. Os fatos, nem tanto.'),
    G('Encomendar uma pesquisa melhor', 0.5, { pop: 3, cash: -4 }, 'A nova pesquisa saiu a seu favor. Ninguém acreditou, mas gostaram.', { img: -6, cash: -4 }, 'Descobriram a encomenda. Virou escândalo de verdade.'),
  ]),
  E('operacao', [1, 2, 3], 'Operação da Polícia Federal', 'Agentes batem na porta de um aliado seu logo cedo. Os jornais já estão no quarteirão.', [
    C('Defender o aliado até o fim', { cong: 4, img: -8 }, 'Ficou ao lado do amigo. A imagem pagou a conta.'),
    C('Afastar o aliado imediatamente', { img: 5, cong: -5 }, 'Cortou a carne. Ficou com cara de líder.'),
    C('Dizer que não comenta investigação', { img: -2 }, 'A resposta neutra não mudou nada.'),
  ]),
  E('rival_ataque', ANY, '{rival} te ataca', '{rival} diz em entrevista que você "não sabe o que está fazendo". Os repórteres querem resposta.', [
    C('Responder na lata', { pop: 3, img: -3 }, 'Viralizou. Dividiu opiniões.'),
    C('Subir o tom com humor', { pop: 4, img: 1 }, 'Rindo, desarmou o adversário.'),
    C('Ignorar e trabalhar', { img: 2 }, 'Ficou acima da briga. Rendeu pouco, mas seguro.'),
  ]),
  E('festa', [0, 1], 'Festa popular em {cidade}', 'A cidade inteira vai para a rua e todo político quer aparecer.', [
    C('Subir no palco e dançar', { pop: 6, img: -1, cash: -2 }, 'Passou vergonha, ganhou cabelo de purpurina e muita simpatia.'),
    C('Pagar uma atração famosa', { pop: 5, cash: -6 }, 'A festa foi inesquecível. O cofre lembrará.'),
    C('Ficar nos bastidores', { cong: 2 }, 'Aproveitou para conversar com lideranças.'),
  ]),
  E('quartel', ANY, 'Pedido do quartel', 'Oficiais da região pedem apoio a um projeto de segurança e orçamento da corporação.', [
    C('Apoiar integralmente', { seg: 5, cash: -5, cong: 2 }, 'Alinhamento total. A farda ficou satisfeita.'),
    C('Negociar com condições', { seg: 2, img: 2 }, 'Aprovaram sem animação.'),
    C('Recusar', { seg: -3, img: 1, cong: -2 }, 'Cara fechada nos corredores.'),
  ], (g) => has(g, 'carreira', 'militar')),
  E('culto', ANY, 'Culto de domingo', 'A igreja onde você é conhecido(a) pede que dê uma palavra aos fiéis antes de eleição.', [
    C('Falar de valores e comunidade', { pop: 5, img: 1 }, 'Aplausos e abraços. Sua base cresceu.'),
    C('Misturar fé e campanha', { pop: 6, img: -4, cong: 1 }, 'Rendeu votos. E rendeu uma representação por abuso.'),
    C('Agradecer e sair antes do sermão', { pop: 1 }, 'Sem estresse, sem ganhos.'),
  ], (g) => has(g, 'carreira', 'religioso')),
  E('video_viral', ANY, 'Vídeo seu viraliza', 'Um vídeo seu num momento desastrado virou meme nacional. Dez milhões de views.', [
    C('Entrar na brincadeira', { pop: 7, img: 1 }, 'O meme virou camiseta. A internet adotou você.'),
    G('Fazer um vídeo-resposta sério', 0.5, { img: 5, pop: 2 }, 'Deu certo. A internet respeitou.', { pop: -3, img: -2 }, 'Soou artificial e virou outro meme.'),
    C('Apagar tudo e sumir', { pop: -2 }, 'A internet não perdoa quem foge.'),
  ], (g) => has(g, 'carreira', 'influenciador')),
  E('setor', [1, 2, 3], 'Associação empresarial no seu gabinete', 'Grandes empresários pedem incentivos fiscais para investir na região.', [
    C('Conceder os incentivos', { eco: 6, cash: -6, img: -2 }, 'Empregos novos e questionamentos antigos.'),
    C('Condicionar à geração de empregos', { eco: 3, img: 3, cash: -2 }, 'Todo mundo saiu meio satisfeito, meio irritado.'),
    C('Recusar', { eco: -3, img: 2, cash: 2 }, 'Sustentou a posição e colheu críticas dos setores.'),
  ], (g) => has(g, 'carreira', 'empresario') || has(g, 'patrimonio', 'rico', 'bilionario')),
  E('doacao_pessoal', ANY, 'Dinheiro do próprio bolso', 'Sua conta pessoal está gorda e a campanha está curta. Um assessor sugere botar dinheiro do próprio bolso.', [
    C('Bancar a campanha do próprio bolso', { cash: 12, pop: -3, img: -1 }, 'Caixa cheio. A oposição ficou repetindo "filho de quem?" por semanas.'),
    C('Fazer uma vaquinha online', { cash: 5, pop: 3 }, 'Pouco dinheiro, muita simpatia.'),
    C('Não mexer no patrimônio', { img: 1 }, 'Prudente.'),
  ], (g) => has(g, 'patrimonio', 'rico', 'bilionario')),
  E('comunidade', [0, 1], 'Líder comunitário pede audiência', 'Uma liderança de {cidade} reúne o bairro e quer ouvir suas promessas.', [
    C('Prometer o céu', { pop: 6, img: -3 }, 'O público vibrou. A promessa ficou gravada.'),
    C('Ouvir com atenção e anotar', { pop: 3, img: 3 }, 'Cada pedido virou lista. Rendeu confiança.'),
    C('Delegar para um assessor', { pop: -2, cong: 1 }, 'O recado foi dado: você não estava lá.'),
  ]),
  E('mudar_partido', ANY, 'Janela partidária', 'Está aberta a janela para trocar de partido. Convites chovem no seu WhatsApp.', [
    C('Ficar onde está', { cong: 2, img: 1 }, 'Lealdade tem seu valor.'),
    C('Sondar outros partidos', { cong: -2, pop: 1 }, 'Conversou com todo mundo. Algumas portas se abriram (veja a aba Partido).'),
    C('Escrever carta aberta ao partido', { img: 3, cong: -3 }, 'Franqueza gera aplausos fora e dor de cabeça dentro.'),
  ], (g) => !!g.party),
]