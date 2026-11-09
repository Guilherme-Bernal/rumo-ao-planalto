// Eventos do mundo: guerras, diplomacia, Forças Armadas, nuclear e relação entre municípios, estados e União.
const C = (label, fx, out) => ({ label, fx, out })
const G = (label, p, fx, out, altFx, altOut) => ({ label, fx, out, risk: p, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })

const pres = (g) => g.office === 'presidente'
const rel = (g, k) => (g.world && g.world.rel[k]) ?? 50
const fed = (g, k) => (g.world && g.world.fed[k]) ?? 50
const wars = (g) => (g.world ? g.world.wars.length : 0)

export const worldEvents = [
  // Sorteado pelo motor quando começa uma guerra (nunca entra no sorteio comum)
  E('guerra_posicao', [3], 'fed', '{guerra}: qual será a posição do Brasil?', 'O conflito domina o noticiário e o Itamaraty pede uma linha. Aliados e adversários esperam um sinal seu.', [
    C('Neutralidade ativa, sem escolher lado', { img: 1, cong: 1 }, 'O Brasil ficou de fora, mas manteve as portas abertas com todos.'),
    G('Propor uma mediação', 0.45, { img: 4, pop: 2 }, 'A proposta de paz ganhou espaço e o Brasil virou protagonista.', { img: -2, pop: -1 }, 'A mediação não pegou, e a imprensa te chamou de ingênuo.'),
    C('Apoiar abertamente um dos lados', { cong: 2, img: -2, pop: 1 }, 'Você escolheu um lado, ganhou um aliado e criou um desafeto.'),
    C('Enviar ajuda humanitária', { img: 3, cash: -3, pop: 1 }, 'Alimentos e remédios partiram em voos da FAB. A imagem do país melhorou.'),
    C('Vender alimentos e combustível para os dois lados', { eco: 3, cash: 3, img: -3 }, 'A balança comercial agradeceu. A opinião pública internacional, nem tanto.'),
  ], () => false),
  E('quartel_inquieto', [3], 'fed', 'Os quartéis estão inquietos', 'Generais reclamam de soldo, de obras paradas e de falta de diálogo. Há conversa nas redes sobre "ordem" e "o papel das Forças".', [
    C('Convocar os comandantes e ouvir', { img: 1, cong: -1 }, 'A reunião baixou a temperatura e rendeu um pacto de respeito mútuo.'),
    C('Prometer reajuste e modernização', { cash: -3, seg: 2, cong: 1 }, 'O anúncio acalmou o ambiente. A conta, porém, chegou.'),
    G('Peitar e reafirmar o comando civil', 0.5, { pop: 4, img: 2 }, 'Você bateu o martelo e foi aplaudido pela Constituição.', { pop: -6, cong: -3, seg: -2 }, 'O discurso azedou, e o clima nos quartéis piorou.'),
  ], (g) => pres(g) && g.world.fa <= 30),
  E('aiea_inspecao', [3], 'fed', 'A AIEA pede para inspecionar o programa nuclear', 'Inspetores internacionais querem visitar as centrífugas. Os militares acham que é invasão, os diplomatas acham que é rotina.', [
    C('Abrir as portas e cooperar', { img: 3, cong: -1 }, 'A inspeção deu tudo certo e o Brasil ganhou crédito.'),
    C('Negar acesso por soberania', { pop: 2, img: -4 }, 'Você peitou o mundo, e os parceiros comerciais torceram o nariz.'),
    C('Negociar um acordo parcial', { img: 1 }, 'Uma visita limitada saiu, e todos fingiram estar satisfeitos.'),
  ], (g) => pres(g) && g.world.nuc.enr >= 40),
  E('angra_incidente', [3], 'fed', 'Alerta em usina nuclear', 'Um sensor acusou falha no resfriamento em uma usina. Ninguém se feriu, mas o susto virou manchete.', [
    C('Parar a usina e divulgar tudo', { eco: -2, img: 3 }, 'A transparência evitou pânico e valorizou a segurança do setor.'),
    G('Minimizar e seguir operando', 0.55, { eco: 1, img: 0 }, 'O alerta passou batido e a usina continuou gerando energia.', { img: -5, pop: -3 }, 'A versão oficial caiu por terra, e a confiança foi junto.'),
    C('Chamar peritos independentes', { cash: -2, img: 2 }, 'O laudo foi tranquilizador e a imprensa acompanhou cada passo.'),
  ], (g) => pres(g) && g.world.nuc.angra >= 25),
  E('tarifa_eua', [3], 'fed', 'Washington ameaça tarifaço', 'O governo americano estuda sobretaxar produtos brasileiros. A indústria pede reação, e os agricultores pedem calma.', [
    C('Retaliar na mesma moeda', { pop: 2, eco: -3, img: -1 }, 'Você retaliou e foi aplaudido, mas os preços internos sentiram.'),
    C('Negociar nos bastidores', { eco: 1, img: 1 }, 'Uma ligação reservada segurou a tarifa por enquanto.'),
    C('Buscar novos mercados na Ásia', { eco: 2, cash: -2 }, 'Os contratos com a Ásia compensam parte do prejuízo.'),
  ], (g) => pres(g) && rel(g, 'eua') <= 40),
  E('cupula_emergentes', [3], 'fed', 'Convite para a cúpula dos emergentes', 'Chineses e russos convidam o Brasil para um bloco de cooperação e de pagamentos fora do dólar. Washington olha com cara feia.', [
    C('Aceitar e liderar a pauta', { eco: 3, img: -2, cong: -1 }, 'A cúpula rendeu contratos e uma foto histórica, e um alerta de Washington.'),
    C('Comparecer como observador', { img: 1, eco: 1 }, 'Presença discreta: nem ganhou, nem perdeu.'),
    C('Recusar o convite', { img: 1, eco: -1 }, 'Você ficou de fora e manteve o alinhamento com o Ocidente.'),
  ], (g) => pres(g) && (rel(g, 'china') >= 55 || rel(g, 'rus') >= 55)),
  E('acordo_mercosul_ue', [3], 'fed', 'Acordo Mercosul e União Europeia na mesa', 'Depois de décadas de negociação, o acordo voltou à pauta. Agricultores querem, ambientalistas e a indústria duvidam.', [
    C('Assinar o acordo', { eco: 4, img: 2, pop: -1 }, 'O acordo abriu mercados e dividiu a indústria nacional.'),
    C('Exigir mudanças nas cláusulas ambientais', { img: 1, eco: 1 }, 'Você ganhou tempo e fama de duro negociador.'),
    C('Deixar para o próximo governo', { img: -2 }, 'A oportunidade esfriou, e os produtores reclamaram.'),
  ], (g) => pres(g) && rel(g, 'ue') >= 55 && rel(g, 'arg') >= 45),
  E('incidente_embaixada', [3], 'fed', 'Incidente diplomático', 'Um embaixador estrangeiro faz um comentário ofensivo sobre a política brasileira. A internet pede uma resposta firme.', [
    C('Convocar o embaixador e dar um puxão de orelha', { pop: 2, img: 0 }, 'O Itamaraty chamou o diplomata, e o assunto morreu em dois dias.'),
    C('Ignorar e seguir o jogo', { img: 1 }, 'Você tratou como assunto menor e ganhou fama de estadista.'),
    G('Expulsar o embaixador', 0.5, { pop: 4, img: 1 }, 'O gesto firme virou orgulho nacional.', { eco: -2, img: -3 }, 'A reação do país vizinho foi dura e as relações azedaram.'),
  ], (g) => pres(g)),
  E('refugiados_guerra', [3], 'fed', 'Chegam refugiados da guerra', 'Centenas de famílias fugidas do conflito pedem abrigo em aeroportos e fronteiras do país.', [
    C('Abrir corredores humanitários', { img: 4, soc: -2, cash: -2 }, 'O país acolheu as famílias e foi elogiado, com custo para os serviços locais.'),
    C('Limitar a entrada e fazer triagem', { seg: 2, img: -2, pop: 1 }, 'A triagem aliviou a pressão, mas gerou críticas de entidades humanitárias.'),
    C('Pedir ajuda da ONU e dividir a conta', { img: 2, cash: -1 }, 'A ONU entrou no jogo, e o custo foi dividido.'),
  ], (g) => pres(g) && wars(g) > 0),
  E('diesel_guerra', [0, 1, 2, 3], 'est', 'O diesel dispara por causa da guerra', 'A guerra lá fora encareceu combustível e frete. Caminhoneiros e feirantes ameaçam parar.', [
    C('Subsidiar o diesel por um tempo', { pop: 3, cash: -4 }, 'O subsídio segurou o preço e a paralisação, mas esvaziou o caixa.'),
    C('Pedir calma e explicar a situação', { pop: -1, img: 1 }, 'A conversa franca esfriou os ânimos, mas o bolso continuou apertado.'),
    G('Negociar com os caminhoneiros', 0.5, { pop: 2, eco: 1 }, 'O acordo evitou a greve e o frete se estabilizou.', { pop: -3, eco: -2 }, 'A negociação travou, e o transporte parou por dois dias.'),
  ], (g) => wars(g) > 0),
  // federação
  E('prefeitos_cobram', [2], 'est', 'Prefeitos cobram repasses e obras', 'Uma comitiva de prefeitos chega ao palácio reclamando de atraso nos repasses e de estradas abandonadas.', [
    C('Liberar um pacote de repasses', { cash: -4, pop: 2 }, 'O pacote acalmou os prefeitos, e o interior elogiou.'),
    C('Reunir todos e prestar contas', { img: 2, cong: 1 }, 'A prestação de contas rendeu respeito e poucas promessas.'),
    C('Ignorar e tocar o calendário', { pop: -1, cong: -2 }, 'Você ignorou o pedido, e os prefeitos foram reclamar na imprensa.'),
  ], (g) => g.office === 'governador'),
  E('governador_condiciona', [0], 'est', 'O governador condiciona a obra ao seu apoio', 'Uma obra importante para a cidade só sai se você declarar apoio público ao governador.', [
    C('Declarar apoio e garantir a obra', { cong: 3, img: -2, cash: 3 }, 'A obra saiu do papel, e a oposição te chamou de cabresto.'),
    G('Recusar e cobrar na imprensa', 0.5, { pop: 3, img: 2 }, 'Você peitou o governador e ganhou a torcida local.', { pop: -2, cash: -2 }, 'A obra travou de vez, e você ficou isolado.'),
    C('Negociar uma obra menor, sem apoio', { soc: 2, cash: 1 }, 'Um acerto menor rendeu uma obra pequena e sem polêmica.'),
  ], (g) => g.office === 'prefeito'),
  E('planalto_convenio', [0, 1, 2], 'fed', 'Convênio federal aberto', 'O governo federal abriu edital para convênios de obras. Quem se organizar primeiro leva a verba.', [
    C('Montar o projeto e correr atrás', { cash: 5, cong: 1 }, 'Você chegou na frente, e a verba entrou no caixa.'),
    C('Pedir ajuda da bancada em Brasília', { cash: 3, cong: -1 }, 'A bancada ajudou, mas cobrou o favor depois.'),
    C('Deixar passar', { img: -1, cash: -1 }, 'Outra cidade levou a verba e a oportunidade passou.'),
  ], (g) => g.office !== 'vereador'),
  E('prefeito_cargo', [0], 'mun', 'O prefeito oferece espaço ao seu grupo', 'O prefeito te chama para uma conversa e sugere cargos na prefeitura em troca de apoio nas votações da Câmara.', [
    C('Aceitar os cargos e apoiar o prefeito', { cong: 3, cash: 2, img: -2 }, 'A base ganhou espaço, e a oposição apontou o dedo.'),
    C('Recusar e fazer oposição', { img: 3, pop: 1, cong: -2 }, 'Você virou o rosto da oposição e ganhou prestígio fora da máquina.'),
  ], (g) => g.office === 'vereador'),
  E('governadores_frente', [3], 'fed', 'Governadores formam frente contra o governo', 'Governadores de vários estados se uniram para cobrar repasses e pressionar o Planalto nas votações.', [
    C('Receber todos e negociar uma pauta', { cong: 2, cash: -2, img: 1 }, 'A frente se desfez em troca de uma pauta de repasses.'),
    C('Oferecer verba e cargos a quem apoiar', { cong: 4, cash: -3, img: -2 }, 'A frente rachou, e metade dos governadores voltou para a base.'),
    G('Ignorar e atacar os governadores', 0.4, { pop: 3 }, 'O ataque cresceu nas pesquisas, e a frente murchou.', { cong: -5, pop: -2 }, 'A frente cresceu e travou duas votações importantes.'),
  ], (g) => pres(g) && fed(g, 'governadores') <= 40),
]