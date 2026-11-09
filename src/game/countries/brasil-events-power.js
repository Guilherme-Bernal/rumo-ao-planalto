// Eventos que aparecem quando o poder está concentrado demais, e a pressão dos militares e da rua.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 10) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })

export const powerEvents = [
  E('militares', [3], 'fed', 'O recado dos quartéis', 'Generais pedem uma audiência reservada. Dizem que "o país precisa de ordem" e perguntam até onde você pretende ir.', [
    C('Garantir que respeita a Constituição', { img: 5, pop: 1, seg: -2 }, 'A reunião foi fria, mas o recado foi dado. A imprensa elogiou.'),
    D('Oferecer cargos e reajuste em troca de lealdade', { seg: 5, cash: -4, cong: 2, img: -5 }, 'Os generais saíram sorrindo. O preço vai aparecer mais tarde.', 8),
    G('Pedir apoio para endurecer o regime', 0.45, { seg: 8, cong: 4, img: -7 }, 'Eles toparam, desde que ninguém pergunte como.', { img: -9, cong: -5, pop: -4 }, 'A conversa vazou. O país inteiro quer saber o que foi combinado.', 12),
  ], (g) => g.power >= 25),
  E('constituinte', [3], 'fed', 'A rua pede uma nova Constituição', 'Grupos organizados dizem que a Constituição está velha e pedem uma Assembleia Constituinte. A oposição desconfia que é uma jogada sua.', [
    C('Recusar e defender a Constituição atual', { img: 4, cong: 1, pop: -1 }, 'Você saiu como defensor das regras. Alguns aliados ficaram frustrados.'),
    G('Convocar a Constituinte e controlar a pauta', 0.5, { cong: 6, pop: 3, img: -3 }, 'A Constituinte nasceu com a sua cara. Os adversários reclamam, mas perderam a votação.', { cong: -6, img: -6, pop: -3 }, 'A Constituinte escapou do controle e virou palanque da oposição.', 8),
    C('Propor um plebiscito simples', { pop: 3, img: 2, cash: -3 }, 'O povo foi chamado a decidir. Ninguém pode dizer que você não perguntou.'),
  ], (g) => g.power >= 10),
  E('protesto_autoritario', [2, 3], 'fed', 'Milhares nas ruas contra o seu estilo', 'Estudantes, sindicatos e artistas ocupam avenidas. Dizem que o seu governo está passando dos limites.', [
    C('Receber os líderes e ceder em um ponto', { pop: 3, img: 3, cong: -1 }, 'A negociação esfriou a rua e mostrou que existe diálogo.'),
    D('Mandar a tropa de choque limpar a avenida', { seg: 4, pop: -6, img: -8 }, 'A avenida ficou vazia e as imagens rodaram o mundo.', 10),
    C('Ignorar e esperar o cansaço', { pop: -3, img: -2 }, 'A rua cansou, mas o ressentimento ficou.'),
  ], (g) => g.power >= 20),
]