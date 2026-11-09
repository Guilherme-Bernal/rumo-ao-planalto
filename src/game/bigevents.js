// Grandes eventos ligados a um mês do calendário. Texto 100% fictício.
const C = (label, fx, out) => ({ label, fx, out })
const G = (label, p, fx, out, altFx, altOut) => ({ label, fx, out, risk: p, alt: { fx: altFx, out: altOut } })
const ANY = [0, 1, 2, 3]
const COPA_YEARS = [2030, 2034, 2038, 2042, 2046]

export const BIG = [
  {
    id: 'f1', icon: '🏎️', name: 'GP de Fórmula 1', months: [10], stages: ANY, sphere: 'est',
    title: 'Grande Prêmio de Fórmula 1 em Interlagos',
    text: 'O autódromo lota, os patrocinadores te oferecem camarote e todo o poder econômico do estado estará lá. A TV vai passar a cena do pódio.',
    choices: [
      C('Ir ao camarote e fechar contatos', { cong: 5, eco: 2, img: -3, pop: -1 }, 'Bons contatos, mas a foto com taça de champanhe rodou na internet.'),
      C('Ficar na arquibancada com o povo', { pop: 6, img: 2, cash: -1 }, 'Bandeira na mão e cerveja quente: você virou torcedor oficial do povo.'),
      G('Entregar o troféu no pódio', 0.55, { pop: 8, img: 3 }, 'Aplaudido de pé, a foto no pódio virou capa.', { pop: -5, img: -3 }, 'A arquibancada vaiou na hora do seu nome. O vídeo viralizou.'),
      C('Mandar um representante', { pop: -1 }, 'Ninguém notou a sua ausência. Ninguém notou o representante.'),
    ],
  },
  {
    id: 'eprix', icon: '⚡', name: 'E-Prix de Fórmula E', months: [2, 3], stages: ANY, sphere: 'est',
    title: 'E-Prix da Fórmula E em {cidade}',
    text: 'A corrida de carros elétricos toma as ruas do centro e a pauta é energia limpa. Ambientalistas e fabricantes querem uma foto com você.',
    choices: [
      C('Anunciar incentivo aos carros elétricos', { eco: 4, img: 2, cash: -5 }, 'Prometeu carregadores pela cidade. O setor aplaudiu, o caixa nem tanto.'),
      G('Pegar o volante de um carro de passeio na pista', 0.5, { pop: 7, img: 2 }, 'Deu uma volta impecável e a torcida adorou.', { pop: -4, img: -3, cash: -2 }, 'Rodou na primeira curva. O meme ficou para sempre.'),
      C('Criticar o gasto público com o evento', { img: 3, pop: -2, eco: -1 }, 'Ganhou fama de fiscal, mas o povo queria o show.'),
      C('Assistir da arquibancada e falar com os fãs', { pop: 4, img: 1 }, 'Selfies, autógrafos e uma camiseta de brinde.'),
    ],
  },
  {
    id: 'estadual', icon: '⚽', name: 'Final do Estadual', months: [3, 4], stages: ANY, sphere: 'est',
    title: 'Final do Campeonato Estadual',
    text: 'Dois clássicos rivais disputam o título e o estádio vai lotar. Todo mundo vai querer saber para quem você torce.',
    choices: [
      G('Torcer abertamente para o time do coração', 0.5, { pop: 6 }, 'A torcida adorou e você virou ídolo por uma semana.', { pop: -6, img: -2 }, 'Torceu para o time errado na frente da torcida errada.'),
      C('Prometer reforma do estádio', { pop: 3, eco: 1, cash: -5 }, 'Promessa de campanha com cheiro de grama molhada.'),
      C('Dizer que torce "pelo futebol"', { img: 1, pop: -1 }, 'Frase segura, ninguém lembra dela depois.'),
      C('Ficar em casa e deixar a TV ligada', {}, 'O estádio lotou sem você.'),
    ],
  },
  {
    id: 'copadobrasil', icon: '🏆', name: 'Final da Copa do Brasil', months: [9], stages: [1, 2, 3], sphere: 'fed',
    title: 'Final da Copa do Brasil',
    text: 'A decisão leva dois estados ao estádio e a transmissão é nacional. Os dirigentes querem uma foto institucional.',
    choices: [
      G('Entregar a taça ao campeão', 0.5, { pop: 6, img: 2 }, 'Sorriso largo e taça no alto. Foto histórica.', { pop: -4, img: -3 }, 'Foi vaiado pelas duas torcidas, o que é raro.'),
      C('Usar o jogo como palanque', { pop: 3, img: -3, cong: 1 }, 'A torcida percebeu e o comentarista também.'),
      C('Assistir com a família', { pop: 1 }, 'Pipoca, sofá e reação de torcedor comum.'),
      C('Prometer investimento no futebol de base', { pop: 3, img: 1, cash: -4 }, 'Projeto bonito no papel, as crianças gostaram.'),
    ],
  },
  {
    id: 'copa', icon: '🌍', name: 'Copa do Mundo',
    when: (abs) => COPA_YEARS.includes(2027 + Math.floor(abs / 12)) && [5, 6].includes(abs % 12), stages: ANY, sphere: 'fed',
    title: 'Copa do Mundo: o país para',
    text: 'O jogo da seleção vai parar o Brasil. As ruas estão pintadas de verde e amarelo e todo político quer aparecer em algum lugar.',
    choices: [
      C('Montar um telão na praça', { pop: 6, img: 1, cash: -5 }, 'A praça lotou, o povo gritou o gol com você.'),
      C('Decretar ponto facultativo nos jogos', { pop: 6, eco: -3, cash: -1 }, 'O povo agradeceu e o comércio fez as contas.'),
      G('Viajar para ver a seleção', 0.4, { pop: 3, img: 1 }, 'Ganhou uns 15 segundos de TV vestindo a camisa.', { pop: -6, img: -5, cash: -4 }, 'Foi flagrado em camarote pago com dinheiro público.'),
      C('Torcer em casa, sem alarde', { img: 1, pop: 1 }, 'Discrição não rende voto, mas também não rende bronca.'),
    ],
  },
  {
    id: 'carnaval', icon: '🎭', name: 'Desfile de Carnaval', months: [1], stages: ANY, sphere: 'mun',
    title: 'Carnaval em {cidade}',
    text: 'Blocos, escolas e multidão nas ruas. A polícia pede reforço e a plateia quer ver o político no meio da folia.',
    choices: [
      G('Sair no carro alegórico', 0.5, { pop: 7, img: 1 }, 'Você sambou no pé e o povo cantou seu nome.', { pop: -5, img: -3 }, 'O vídeo do passinho viralizou pelos motivos errados.'),
      C('Reforçar segurança e saúde nos blocos', { seg: 3, img: 2, cash: -4 }, 'O Carnaval correu tranquilo e o cuidado foi notado.'),
      C('Liberar verba para as escolas de samba', { pop: 4, cash: -4 }, 'Os sambistas ficaram agradecidos até a quarta-feira de cinzas.'),
      C('Passar longe da folia', { img: 1, pop: -2 }, 'Descansou, mas perdeu a foto mais disputada do ano.'),
    ],
  },
  {
    id: 'festa', icon: '🎪', name: 'Festa regional', months: [5, 6], stages: ANY, sphere: 'mun',
    title: 'Festa popular em {cidade}',
    text: 'A festa tradicional da região reúne famílias, quadrilha e muita comida típica. O prefeito te convida para subir no palco.',
    choices: [
      C('Participar da quadrilha', { pop: 5, img: 1 }, 'Chapéu de palha, camisa xadrez e muito aplauso.'),
      C('Ajudar a servir a comida', { pop: 4, img: 2, cash: -1 }, 'Foi para atrás do balcão e virou assunto no bairro.'),
      G('Subir no palco para discursar', 0.5, { pop: 5, img: 1 }, 'Conseguiu fazer a praça inteira cantar junto.', { pop: -4, img: -2 }, 'O microfone falhou e a plateia vaiou o discurso político em plena festa.'),
      C('Só assistir de longe', { pop: -1 }, 'Gostaram da sua educação, mas não lembraram do seu nome.'),
    ],
  },
  {
    id: 'setembro', icon: '🇧🇷', name: 'Desfile de 7 de Setembro', months: [8], stages: ANY, sphere: 'fed',
    title: 'Desfile cívico de 7 de Setembro',
    text: 'Bandas, escolas e militares desfilam. Os cerimonialistas esperam um discurso e os fotógrafos esperam uma gafe.',
    choices: [
      C('Discursar sobre a pátria e o futuro', { pop: 3, img: 2 }, 'Discurso sem polêmica, mas com uma ótima frase para a manchete.'),
      C('Acompanhar o desfile ao lado dos estudantes', { pop: 4, img: 2, cong: -1 }, 'Ganhou simpatia dos professores e das famílias.'),
      G('Aproveitar para criticar a oposição', 0.4, { pop: 4, cong: 2 }, 'A militância aplaudiu e os jornais repercutiram.', { pop: -4, img: -4 }, 'O tom foi mal recebido e virou crítica de oportunismo.'),
      C('Não ir', { pop: -2, img: -1 }, 'A ausência foi notada pelo cerimonial e só.'),
    ],
  },
  {
    id: 'reveillon', icon: '🎆', name: 'Réveillon', months: [11], stages: ANY, sphere: 'mun',
    title: 'Réveillon em {cidade}',
    text: 'A virada de ano reúne milhares na orla ou na praça central. A prefeitura precisa decidir como será a festa.',
    choices: [
      C('Bancar um show gratuito', { pop: 6, cash: -5 }, 'Show lotado e muito aplauso. O orçamento sentiu.'),
      C('Fogos silenciosos e festa familiar', { img: 2, pop: 2, cash: -2 }, 'Inovou e agradou a quem tem pet em casa.'),
      C('Cancelar por falta de verba', { cash: 3, pop: -5, img: -1 }, 'Economizou, mas o povo ficou sem festa.'),
      G('Subir ao palco e dar o discurso de fim de ano', 0.5, { pop: 6, img: 2 }, 'Emocionou meio mundo na contagem regressiva.', { pop: -4, img: -2 }, 'Foi vaiado na contagem regressiva por atrasar o show.'),
    ],
  },
]

export const bigWhen = (b, abs) => (b.when ? b.when(abs) : b.months.includes(abs % 12))

// Paixão do personagem que combina com cada evento (dá bônus de popularidade)
export const BIG_TAGS = { f1: ['automobilismo', 'motos'], eprix: ['automobilismo', 'tecnologia'], estadual: ['futebol'], copadobrasil: ['futebol'], copa: ['futebol', 'volei'], carnaval: ['musica', 'danca', 'teatro'], festa: ['musica', 'danca', 'gastronomia', 'pesca'], reveillon: ['musica', 'gastronomia'], setembro: ['historia'] }