// Eventos de vice, suplentes, equipe e prefeitura.
const C = (label, fx, out) => ({ label, fx, out })
const D = (label, fx, out, heat = 8) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })

const exec = ['prefeito', 'governador', 'presidente']
const hasVice = (g) => exec.includes(g.office) && g.team && g.team.vice
const picked = (g, ids) => g.team && g.team.slots && Object.values(g.team.slots).some((s) => ids.includes(s.type))

export const teamEvents = [
  E('vice_conspira', [0, 2, 3], 'fed', 'O vice anda articulando', 'Aliados contam que o vice está jantando com partidos da oposição e conversando com a imprensa sobre "um novo momento".', [
    C('Dar ao vice uma pasta importante', { cong: 3, img: -1, cash: -1 }, 'A pasta acalmou o vice por enquanto, e a base achou justo.'),
    G('Tirar o vice das agendas públicas', 0.5, { img: 1, pop: 1 }, 'O vice sumiu dos holofotes e a crise esfriou.', { cong: -5, img: -3 }, 'O vice virou líder da insatisfação e a imprensa abraçou a crise.'),
    D('Confrontar o vice em público', { pop: -2, img: -3, cong: -3 }, 'A briga virou crise institucional e dominou o noticiário.', 6),
  ], (g) => hasVice(g) && g.team.vice.amb >= 0.3),
  E('vice_viagem', [0, 2, 3], 'fed', 'Viagem ao exterior', 'Um convite importante exige que você viaje por alguns dias. Pela lei, o vice assume o cargo enquanto você estiver fora.', [
    C('Viajar e deixar o vice no comando', { img: 2, pop: 1, cong: -1 }, 'A viagem rendeu bons contatos e o vice tocou o expediente sem sustos.'),
    G('Viajar mesmo com o vice em guerra com a base', 0.4, { img: 3, cash: 2 }, 'Tudo correu bem e a viagem trouxe investimentos.', { cong: -4, img: -3 }, 'O vice aproveitou para tomar decisões polêmicas enquanto você estava fora.'),
    C('Cancelar a viagem', { img: -1, pop: -1, cash: 1 }, 'Você ficou em casa e perdeu a chance de aparecer no cenário internacional.'),
  ], (g) => hasVice(g)),
  E('coalizao_cargos', [2, 3], 'fed', 'A base cobra mais cargos', 'Partidos aliados dizem que votaram com você e agora querem espaço no governo. Ameaçam votar contra se ficarem sem nada.', [
    C('Ceder uma pasta importante', { cong: 6, img: -2, cash: -1 }, 'A base garantiu seu apoio. A imprensa cobrou o preço.'),
    C('Negociar cargos de segundo escalão', { cong: 3, img: 0 }, 'A conversa deu certo, e cada um saiu com um pedaço.'),
    G('Recusar e apostar na articulação direta', 0.45, { img: 3, cong: 2 }, 'Você segurou a base sem entregar nada. A fama de bom articulador cresceu.', { cong: -7, pop: -2 }, 'A base se rebelou e derrubou duas votações importantes.'),
  ], (g) => g.office === 'governador' || g.office === 'presidente'),
  E('equipe_escandalo', [0, 1, 2, 3], 'fed', 'Titular de {pasta} aparece em denúncia', 'Uma reportagem liga quem você nomeou para {pasta} a um esquema de contratos. A oposição pede explicações e a demissão.', [
    C('Demitir imediatamente e trocar o titular', { img: 3, cong: -2 }, 'A demissão cortou o assunto, e um técnico assumiu a pasta.'),
    D('Sustentar o nome e atacar a imprensa', { cong: 2, img: -5, pop: -1 }, 'Você bancou o titular, mas a denúncia continuou crescendo e ele segue sob a mira.', 8),
    C('Abrir uma apuração interna', { img: 1, cong: -1, cash: -1 }, 'A apuração ganhou tempo e esfriou a denúncia por enquanto.'),
  ], (g) => !!(g.team && g.team.hot)),
  E('suplente_pede', [0, 1], 'mun', 'O suplente pede a cadeira', 'Seu suplente quer assumir a cadeira por alguns meses enquanto você se licencia. Ele diz que merece a chance e que a lista do partido apoia.', [
    C('Licenciar por 120 dias e dar a vez a ele', { img: 2, cong: 2, pop: -2 }, 'A licença virou gesto de generosidade com o grupo.'),
    C('Recusar e seguir no cargo', { cong: -2, img: 0 }, 'Você ficou com a cadeira e o suplente ficou ressentido.'),
    C('Propor que ele ocupe um cargo no gabinete', { cong: 2, cash: -1 }, 'O suplente aceitou o cargo e a relação ficou tranquila.'),
  ], (g) => g.team && g.team.supl && g.team.supl.length > 0),
  E('camara_veta', [0], 'mun', 'A Câmara de Vereadores trava seu projeto', 'Os vereadores de oposição rejeitaram o seu projeto principal e dizem que ele não passa tão cedo.', [
    C('Negociar emendas com a oposição', { cong: 3, cash: -2, img: -1 }, 'Você cedeu em alguns pontos e o projeto avançou.'),
    G('Ir para a TV e pressionar os vereadores', 0.5, { pop: 4, cong: -2 }, 'A pressão popular funcionou e o projeto foi votado.', { pop: -2, cong: -5 }, 'Os vereadores se sentiram atacados e travaram tudo.'),
    C('Retirar o projeto e reapresentar depois', { img: 1, cong: 1, pop: -1 }, 'Você ganhou tempo, mas perdeu uma vitrine.'),
  ], (g) => g.office === 'prefeito'),
  E('lrf_alerta', [0], 'mun', 'O Tribunal de Contas acende o alerta', 'O Tribunal de Contas avisa que o gasto com pessoal passou do limite da Lei de Responsabilidade Fiscal. Se não ajustar, a prefeitura fica sem repasses.', [
    C('Cortar cargos comissionados', { cash: 3, cong: -3, img: 2, pop: -2 }, 'O ajuste fechou as contas e a oposição apontou o desgaste.'),
    C('Segurar contratações e reajustes', { cash: 2, pop: -3, cong: -1 }, 'Funcionou, mas os servidores reclamaram.'),
    D('Maquiar a contabilidade', { cash: 5, img: -6 }, 'A manobra durou pouco e o Tribunal descobriu.', 10),
  ], (g) => g.office === 'prefeito'),
  E('reajuste_servidores', [0], 'mun', 'Os servidores querem reajuste', 'Os sindicatos municipais pedem reposição da inflação e ameaçam parar a cidade.', [
    C('Conceder o reajuste inteiro', { pop: 4, cash: -5, cong: 1 }, 'A greve foi evitada e o caixa sentiu.'),
    C('Propor reajuste parcelado', { pop: 1, cash: -2, img: 1 }, 'Houve acordo no meio do caminho.'),
    G('Segurar firme e apostar no diálogo', 0.5, { cash: 3, img: 2 }, 'O sindicato aceitou a proposta sem parar a cidade.', { pop: -5, cash: 2, img: -2 }, 'A greve parou escolas e postos por semanas.'),
  ], (g) => g.office === 'prefeito'),
  E('licenca_vice', [0, 2, 3], 'fed', 'Licença médica', 'Um problema de saúde exige que você se afaste por algumas semanas. Pela lei, o vice assume o cargo enquanto você estiver licenciado.', [
    C('Passar o cargo ao vice e se tratar', { pop: -1, img: 1 }, 'Você se afastou, o vice tocou o governo e você voltou melhor.'),
    C('Despachar do hospital mesmo assim', { pop: -2, img: -1, cong: -1 }, 'Os despachos de cama viraram piada nas redes.'),
    G('Voltar antes do tempo', 0.5, { pop: 1, img: 1 }, 'Você voltou firme e a imagem de dedicação rendeu.', { pop: -3, img: -2 }, 'A recaída foi parar nos jornais.'),
  ], (g) => hasVice(g)),
  E('convite_pasta', [1], 'est', 'Convite para assumir uma secretaria', 'O governo convida você para uma secretaria importante. Se aceitar, você se licencia da cadeira e o suplente assume enquanto isso.', [
    C('Aceitar e se licenciar', { eco: 2, img: 1, cash: 2, cong: -1 }, 'Você assumiu a secretaria, e o suplente ocupou a sua cadeira.'),
    C('Recusar e seguir no mandato', { cong: -1, pop: 1 }, 'Você ficou na cadeira e o governo achou desfeita.'),
    C('Indicar um aliado no seu lugar', { cong: 3, cash: -1 }, 'O aliado assumiu a pasta e você ganhou crédito com o governo.'),
  ], (g) => !!(g.team && g.team.supl && g.team.supl.length && !g.team.leave)),
]