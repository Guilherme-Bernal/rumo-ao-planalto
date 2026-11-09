// Eventos ligados à idade do personagem: saúde para quem tem mais anos e juventude para quem começou cedo.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 8) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })

// Idade atual: idade inicial + meses de carreira (relógio do jogo)
const MPT = { vereador: 12, prefeito: 10, dep_estadual: 12, dep_federal: 12, senador: 16, governador: 8, presidente: 6 }
const age = (g) => (g.traits && g.traits.idade != null ? Number(g.traits.idade) + Math.floor(((g.clock || 0) + g.turn * (MPT[g.office] || 12)) / 12) : 0)

export const healthEvents = [
  E('saude_checkup', [0, 1, 2, 3], 'mun', 'Check-up com notícia ruim', 'O médico olha os exames e fala sério: pressão alta, estresse e agenda de louco. Ele recomenda desacelerar.', [
    C('Seguir o tratamento e cortar compromissos', { img: 2, pop: -1, cash: -1, cong: -1 }, 'Você desacelerou. A saúde agradeceu e os aliados reclamaram da agenda vazia.'),
    G('Fingir que está tudo bem e manter o ritmo', 0.5, { pop: 1, cong: 1 }, 'Você passou batido. Por enquanto, nada aconteceu.', { pop: -4, img: -3 }, 'Você passou mal numa agenda pública. A cena foi filmada e viralizou.'),
    C('Anunciar o tratamento nas redes', { pop: 3, img: 3 }, 'A transparência rendeu mensagens de carinho de gente que você nem conhecia.'),
  ], (g) => age(g) >= 48),
  E('saude_internacao', [1, 2, 3], 'fed', 'Internação de emergência', 'Você passou mal e foi levado(a) ao hospital. A equipe quer segurar a notícia. A imprensa já está na porta.', [
    C('Divulgar um boletim médico completo', { img: 4, pop: 3, cong: -2 }, 'O boletim acalmou o país e a transparência virou assunto positivo.'),
    D('Dizer que foi só um mal-estar passageiro', { img: -4, pop: 1 }, 'A versão colou por uma semana. Depois vazou o prontuário.', 6),
    G('Voltar à agenda no dia seguinte, como se nada fosse', 0.45, { pop: 5, img: 2 }, 'A imagem de força funcionou. Todo mundo comentou sua disposição.', { pop: -5, img: -5 }, 'Você voltou abatido(a) e a cena virou meme de campanha da oposição.'),
  ], (g) => age(g) >= 58),
  E('saude_boatos', [1, 2, 3], 'fed', 'Boatos sobre a sua saúde', 'Um perfil anônimo diz que você está doente e não aguenta o cargo. Políticos já falam em sucessão.', [
    C('Aparecer em público e fazer uma maratona de entrevistas', { pop: 3, img: 2, cong: 1, cash: -2 }, 'O boato morreu quando você apareceu bem disposto(a).'),
    C('Divulgar os exames e encerrar o assunto', { img: 3, pop: 1 }, 'Os exames ficaram em dia e o boato perdeu força.'),
    D('Mandar investigar quem espalhou', { cong: 2, img: -4, pop: -1 }, 'A investigação deu em nada e o episódio virou "perseguição".', 8),
  ], (g) => age(g) >= 55),
  E('saude_cansaco', [0, 1, 2, 3], 'mun', 'O corpo cobrou a conta', 'Noites sem dormir, comício, viagem e reunião. Você acordou sem forças e a agenda do dia estava cheia.', [
    C('Tirar uma semana para descansar', { pop: -2, img: 1, cash: -1 }, 'Você descansou e voltou inteiro(a), mas deixou a agenda vazia por uns dias.'),
    G('Tomar um café forte e tocar o dia', 0.5, { pop: 2, cong: 1 }, 'Você aguentou e ainda rendeu mais que o esperado.', { pop: -3, img: -2 }, 'Você errou o nome da cidade no palanque. O vídeo circulou.'),
    C('Cancelar tudo e delegar para a equipe', { cong: -2, img: -1, pop: -1 }, 'Os aliados estranharam, mas o dia passou.'),
  ], (g) => age(g) >= 45),
  E('saude_sucessao', [2, 3], 'fed', 'Todo mundo fala em sucessão', 'Aliados já conversam sobre quem será o seu sucessor. Dizem que "a hora está chegando".', [
    C('Dizer que ainda tem muito trabalho pela frente', { pop: 2, img: 1, cong: -2 }, 'Você marcou posição, mas deixou alguns aliados contrariados.'),
    C('Apresentar um sucessor de confiança', { cong: 4, img: 2, pop: -2 }, 'A base respirou aliviada e você ganhou fama de estadista.'),
    D('Cortar do grupo quem fala em sucessão', { cong: -4, img: -3, pop: 1 }, 'O recado foi dado, e o grupo ficou com medo de você.', 6),
  ], (g) => age(g) >= 62),
  E('jovem_demais', [0, 1], 'mun', '"É novo demais para isso"', 'Um veterano da câmara diz em entrevista que você é jovem demais para ser levado a sério e sugere que espere a sua vez.', [
    C('Responder com projetos e resultados', { img: 3, pop: 1, cash: -1 }, 'A resposta foi elegante e a crítica virou torcida a seu favor.'),
    G('Fazer um vídeo bem-humorado respondendo', 0.55, { pop: 5, img: 1 }, 'O vídeo viralizou entre os jovens e o veterano ficou sem graça.', { pop: -3, img: -2 }, 'O vídeo foi considerado arrogante e virou prova de que faltava maturidade.'),
    C('Buscar um padrinho político experiente', { cong: 4, pop: -2, img: 1 }, 'O padrinho abriu portas, mas agora você tem alguém para dar satisfação.'),
  ], (g) => age(g) < 30),
  E('jovem_viral', [0, 1, 2], 'est', 'A geração das redes te abraçou', 'Um vídeo seu foi parar na timeline de milhões de jovens. Todo mundo quer saber quem é você.', [
    C('Aproveitar e abrir um canal só para jovens', { pop: 4, cash: -2, cong: -1 }, 'O canal fez sucesso, mas dá trabalho manter.'),
    G('Entrar em todos os memes que surgirem', 0.5, { pop: 6, img: -1 }, 'A internet adorou. Você virou assunto da semana.', { pop: -3, img: -4 }, 'Um meme saiu do controle e virou piada com você.'),
    C('Manter o tom sério e não mudar nada', { img: 2, pop: 1 }, 'Você preservou a imagem. O público jovem sentiu pouca novidade.'),
  ], (g) => age(g) < 33),
  E('veterano_conselho', [1, 2, 3], 'fed', 'Os antigos pedem passagem', 'Lideranças jovens do partido dizem que a velha guarda precisa abrir espaço. Os mais antigos pedem para você segurar a ponta.', [
    C('Abrir espaço para uma ala jovem', { pop: 3, img: 2, cong: -3 }, 'O partido se renovou e a imprensa elogiou a renovação.'),
    C('Reforçar a velha guarda e segurar o poder', { cong: 4, pop: -3, img: -1 }, 'Os antigos ficaram firmes. Os jovens do partido ficaram insatisfeitos.'),
    C('Montar uma chapa que une as duas alas', { cong: 2, pop: 1, img: 2, cash: -2 }, 'A chapa mista agradou. Foi caro, mas acalmou o partido.'),
  ], (g) => age(g) >= 56),
]