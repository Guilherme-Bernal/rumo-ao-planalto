// Eventos com decisões sujas e polêmicas, e conflitos de cada cargo.
// Escolhas com "heat" mexem na pressão da Justiça (investigação): sujou, esquenta.
// Placeholders: {estado} {cidade} {partido} {rival}
const C = (label, fx, out) => ({ label, fx, out })
const K = (label, fx, out, heat) => ({ label, fx, out, heat })
const D = (label, fx, out, heat = 10) => ({ label, fx, out, heat })
const G = (label, p, fx, out, altFx, altOut, heat = 0) => ({ label, fx, out, risk: p, heat, alt: { fx: altFx, out: altOut } })
const E = (id, stages, sphere, title, text, choices, cond) => ({ id, stages, sphere, title, text, choices, cond })
const ANY = [0, 1, 2, 3]

export const dirtyEvents = [
  /* ---------- vereador ---------- */
  E('alvara', [0], 'mun', 'O envelope do alvará', 'O dono de uma casa noturna quer o alvará liberado antes do carnaval. Ele deixa um envelope grosso na sua mesa e diz que "é só uma ajuda de custo".', [
    C('Devolver o envelope e fiscalizar o local', { img: 4, pop: -1, eco: -1 }, 'Ele ficou furioso. O jornal local gostou da história.'),
    C('Liberar o alvará dentro da lei, sem envelope', { eco: 3, pop: 1 }, 'Tudo certo e tudo limpo, e o dono ficou devendo um favor legal.'),
    D('Ficar com o envelope e liberar', { cash: 9, eco: 2, img: -7 }, 'O dinheiro entrou fácil. Só que a casa noturna tem câmera, e o dono tem boca.', 12),
    C('Denunciar o empresário na tribuna', { img: 6, pop: 3, cong: -4 }, 'Virou assunto no bairro inteiro. A bancada do empresário não te cumprimenta mais.'),
  ]),
  E('superfat', [0], 'mun', 'Obra superfaturada na prefeitura', 'Um contador amigo mostra que a obra da praça custou o triplo do preço de mercado. A empreiteira é de um aliado do prefeito.', [
    C('Denunciar na tribuna com os documentos', { img: 6, pop: 3, cong: -5 }, 'O prefeito te chamou de "irresponsável" no rádio. A população aplaudiu.'),
    D('Negociar o silêncio em troca de cargos', { cong: 6, cash: 3, img: -7 }, 'Seus indicados assumiram na semana seguinte. A planilha continua guardada na gaveta de um terceiro.', 10),
    G('Pedir uma CPI', 0.5, { img: 6, pop: 3 }, 'A CPI foi criada e você virou o rosto da fiscalização.', { img: -3, cong: -6 }, 'Faltou apoio e a CPI foi arquivada. Você ficou com fama de oportunista.'),
    C('Guardar a informação para outra hora', { img: -1 }, 'Informação é moeda. Mas moeda parada perde valor.'),
  ]),
  E('parente', [0], 'mun', 'Emprego para o cabo eleitoral', 'Um líder de bairro que carrega votos pede emprego na prefeitura para o sobrinho dele. "Quem não ajuda, não ganha voto", avisa.', [
    D('Arrumar o cargo comissionado', { pop: 5, cong: 2, img: -6 }, 'O bairro inteiro sabe quem arrumou. O Ministério Público também.', 8),
    C('Orientar o rapaz para o concurso', { pop: -1, img: 2 }, 'Ele não gostou e disse que "político bom é político que resolve".'),
    C('Recusar sem rodeio', { pop: -3, img: 3 }, 'Os votos do bairro ficaram mais caros na próxima eleição.'),
  ]),

  /* ---------- prefeito (só aparecem para prefeito) ---------- */
  { ...E('pref_superfat', [0], 'mun', 'Obra superfaturada na sua gestão', 'Um auditor interno mostra que a obra da praça custou o triplo do preço de mercado. A empreiteira é de um aliado seu.', [
    C('Cancelar o contrato e abrir sindicância', { img: 6, pop: 2, cong: -4, cash: 2 }, 'O aliado virou inimigo e a Câmara reclamou. Mas o dinheiro voltou para o cofre.'),
    D('Abafar o caso e tocar a obra', { cong: 3, cash: 4, img: -8 }, 'O auditor foi transferido, mas o relatório vazou para a imprensa.', 12),
    C('Renegociar o valor com a empreiteira', { img: 1, cash: 1, cong: -1 }, 'A empresa baixou o preço pela metade e todo mundo fingiu que nada aconteceu.'),
    C('Entregar tudo ao Ministério Público', { img: 5, pop: 3, cong: -6 }, 'Você ganhou fama de gestor limpo, e a base da Câmara ficou com raiva.'),
  ]), only: 'prefeito' },
  { ...E('pref_camara_trava', [0], 'mun', 'A Câmara trava o seu projeto', 'Os vereadores de oposição rejeitaram o principal projeto da sua gestão e dizem que ele não passa tão cedo.', [
    C('Negociar emendas com a oposição', { cong: 4, cash: -2, pop: 1 }, 'O projeto foi aprovado com mudanças, e a oposição comemorou.'),
    C('Ir para a TV e pressionar os vereadores', { pop: 3, cong: -4, img: 1 }, 'A pressão funcionou em parte, mas a relação azedou.'),
    D('Liberar cargos para os vereadores indecisos', { cong: 7, img: -5, cash: -1 }, 'O projeto passou. A fatura saiu em cargos e em manchetes.', 8),
    C('Retirar o projeto e reapresentar depois', { cong: 1, pop: -1 }, 'Você ganhou tempo, mas perdeu a iniciativa por uns meses.'),
  ]), only: 'prefeito' },
  { ...E('pref_vereadores_cargos', [0], 'mun', 'A bancada governista cobra cargos', 'Vereadores da sua base pedem cargos na prefeitura em troca de apoio nas votações da Câmara.', [
    C('Dar cargos técnicos e manter a base', { cong: 4, soc: 1, cash: -1 }, 'A base ficou satisfeita e a máquina funcionou melhor.'),
    D('Distribuir cargos políticos sem critério', { cong: 8, img: -6, cash: -2 }, 'A base ficou fiel, mas o jornal contou os cargos um a um.', 8),
    C('Recusar e governar sem a barganha', { cong: -5, img: 4, pop: 1 }, 'Você ficou com a imagem limpa e a Câmara cada vez mais difícil.'),
  ]), only: 'prefeito' },

  /* ---------- deputado ---------- */
  E('emendaRelator', [1], 'fed', 'A emenda do relator', 'O líder do governo oferece uma verba extra para a sua base em troca do seu voto num projeto que você acha ruim. Ninguém vai saber de onde veio o dinheiro.', [
    D('Aceitar a verba e votar com o governo', { cong: 6, pop: 4, img: -7, cash: 3 }, 'Seu reduto ganhou uma obra. O orçamento secreto ganhou uma manchete.', 12),
    C('Votar contra e abrir mão da verba', { cong: -5, img: 4 }, 'Os colegas fecharam a cara. Os eleitores que acompanham, aplaudiram.'),
    G('Pegar a verba mas votar com a consciência', 0.5, { cong: 2, pop: 3, img: 1 }, 'Deu para sair da sinuca. Por enquanto, ninguém reclamou.', { cong: -6, img: -5 }, 'O líder percebeu a manobra e te expôs ao plenário.'),
  ]),
  E('delator', [1, 2, 3], 'fed', 'O delator cita o seu nome', 'Um empresário preso em uma operação fala seu nome na delação. Pode ser mentira, pode ser verdade pela metade. A imprensa já está na porta.', [
    C('Pedir para depor e abrir todas as contas', { img: 3, pop: -2, cash: -3 }, 'Depôs por seis horas e saiu limpo. Pelo menos por enquanto.'),
    D('Atacar o delator e a imprensa', { pop: 3, img: -7, cong: 2 }, 'A base gostou da briga. Os investigadores também anotaram.', 10),
    C('Sumir da imprensa por duas semanas', { img: -3, pop: -2 }, 'Sumir é uma resposta, e ninguém gostou dela.'),
    C('Entrar com ação por calúnia', { cash: -5, img: 1 }, 'O processo vai demorar anos. O desgaste, nem tanto.'),
  ]),
  E('janela', [1], 'fed', 'Janela partidária', 'Duas siglas grandes querem você. Oferecem fundo eleitoral, espaço na TV e estrutura. Você sabe que um dia isso aparece em uma matéria.', [
    D('Trocar de partido pelo melhor pacote', { cong: 5, cash: 8, img: -7, pop: -2 }, 'Foi o melhor negócio da sua carreira. E a pior fama.', 5),
    C('Ficar e cobrar mais espaço dentro do seu partido', { cong: 2, img: 2 }, 'Cobrou, ganhou um pouco e continua na mesma casa.'),
    C('Ficar e não prometer nada a ninguém', { img: 3, cong: -2 }, 'Lealdade é bonita no papel. Na prática, saiu caro.'),
  ]),
  E('cpiAliado', [1, 3], 'fed', 'CPI contra um aliado', 'Pedem a CPI contra um aliado seu. Se você assinar, ganha a imprensa. Se não assinar, ganha o aliado.', [
    C('Assinar o pedido', { img: 5, pop: 2, cong: -6 }, 'A imprensa te chamou de coerente. O aliado te chamou de outro nome.'),
    C('Não assinar e blindar o aliado', { cong: 6, img: -3 }, 'Ele agradeceu. A oposição anotou o seu nome.'),
    D('Negociar a CPI em troca de cargos', { cong: 5, cash: 4, img: -6, pop: -1 }, 'A CPI foi arquivada, e os cargos saíram no Diário Oficial.', 10),
  ]),

  /* ---------- governador ---------- */
  E('greveBM', [2], 'est', 'A greve da polícia', 'A polícia cruzou os braços exigindo reajuste. A cidade está com medo e o crime começou a subir.', [
    C('Negociar um reajuste parcelado', { cash: -8, seg: 3, img: 1, pop: 2 }, 'A greve acabou em três dias. O caixa chiou, a rua agradeceu.'),
    D('Cortar o ponto e ameaçar demitir', { seg: -4, cong: 2, pop: -3, img: -6 }, 'A categoria te chamou de inimigo. A greve acabou em vingança lenta.', 6),
    C('Pedir ajuda ao governo federal', { seg: 2, cong: -2, img: -1, pop: -1 }, 'Ajuda veio, mas com cobrança política junto.'),
    G('Pagar o reajuste "por fora", fora do orçamento', 0.5, { seg: 4, pop: 3, cash: -3 }, 'Ninguém viu o pagamento. A greve acabou.', { img: -9, pop: -3, cash: -6 }, 'O Tribunal de Contas descobriu o pagamento. Foi um estrago.', 14),
  ]),
  E('enchente', [2], 'est', 'Enchente na região metropolitana', 'Milhares de desabrigados. A verba de emergência pode ser liberada sem licitação.', [
    C('Liberar o decreto e prestar contas ao vivo', { soc: 5, pop: 5, img: 3, cash: -8 }, 'Você apareceu de bota de borracha todos os dias. O povo viu.'),
    D('Liberar sem licitação e favorecer uns amigos', { soc: 3, pop: 3, cash: 8, img: -8 }, 'Os abrigos saíram rápido e as notas também. O auditor está lendo.', 14),
    C('Pedir ajuda ao governo federal e esperar', { soc: 1, pop: -4, cong: 2 }, 'A ajuda demorou. A imprensa mostrou uma criança sem colchão.'),
  ]),
  E('empreiteira', [2], 'est', 'A empreiteira amiga', 'A maior construtora do estado financiou a sua campanha e agora quer a obra do novo hospital regional. A concorrência tem preço melhor.', [
    D('Direcionar a licitação para a amiga', { eco: 4, cash: 8, cong: 3, img: -8 }, 'O hospital sai rápido. O promotor também chega rápido.', 14),
    C('Licitação aberta e transparente', { eco: 2, img: 3, cash: -2 }, 'A construtora ficou sem a obra e sem gratidão.'),
    G('Dividir a obra entre as duas', 0.55, { eco: 3, img: 1, cong: 2 }, 'Todo mundo foi atendido e ninguém reclamou.', { img: -5, cong: -2 }, 'A imprensa viu favorecimento nas duas.'),
  ]),

  /* ---------- presidente ---------- */
  E('ministro', [3], 'fed', 'Ministro enrolado', 'Um ministro importante é flagrado em um caso grave de corrupção. Ele é do partido que garante a sua maioria no Congresso.', [
    C('Demitir na hora', { img: 5, pop: 3, cong: -6 }, 'O partido ameaçou deixar o governo. O povo respirou.'),
    D('Blindar o ministro', { cong: 6, img: -8, pop: -3 }, 'A maioria segurou. A imagem do governo, não.', 12),
    C('Afastar "temporariamente" até a poeira baixar', { img: 1, cong: 1, pop: -1 }, 'A saída diplomática irritou todo mundo um pouco.'),
  ]),
  E('mercado', [3], 'fed', 'O mercado cobra', 'O dólar disparou e o mercado cobra um ajuste fiscal. O Congresso quer mais gastos. A inflação já aparece nas prateleiras.', [
    C('Cortar gastos de forma dura', { eco: 4, cash: 10, soc: -6, pop: -6 }, 'O mercado respirou. A popularidade ficou sem fôlego.'),
    C('Ampliar o gasto social e aguentar o mercado', { pop: 6, soc: 5, cash: -9, eco: -4 }, 'O povo comemorou. O dólar também.'),
    D('Fazer uma "pedalada" para fechar as contas', { cash: 10, eco: 2, img: -8, cong: 2 }, 'As contas fecharam no papel. O Tribunal de Contas vai abrir.', 12),
  ]),
  E('pfPresidente', [3], 'fed', 'Aparelhar a Polícia Federal?', 'Um aliado sugere trocar o comando da Polícia Federal por alguém "mais alinhado". Isso protegeria o governo de algumas investigações.', [
    D('Trocar o comando', { cong: 4, seg: -2, img: -9, pop: -2 }, 'O novo diretor tomou posse. O antigo falou com a imprensa.', 18),
    C('Manter a autonomia da PF', { img: 5, pop: 2, cong: -3 }, 'O aliado ficou desconfiado. A imprensa elogiou.'),
    C('Pedir a lista de investigações e acompanhar de perto', { img: -1, cong: 1 }, 'Ficou no meio do caminho, e todo mundo sabia.'),
  ]),

  /* ---------- qualquer cargo ---------- */
  E('dossie', ANY, 'fed', 'Um dossiê cai no seu colo', 'Alguém deixa na sua mesa uma pasta com "tudo sobre {rival}". Parece sólida, mas a origem é duvidosa.', [
    G('Vazar para a imprensa sem checar', 0.5, { pop: 5, img: -3 }, 'A matéria saiu, o rival se queimou e você ficou com cara de quem sabia.', { img: -10, pop: -4 }, 'Era falso. Você virou o autor do boato.', 8),
    C('Entregar ao Ministério Público', { img: 3 }, 'A coisa seguiu o caminho certo, devagar, como sempre.'),
    C('Guardar na gaveta, nunca se sabe', { cong: 2, img: -1 }, 'A gaveta cresce. A memória do povo, não.'),
    C('Devolver e dizer que não quer saber', { img: 2 }, 'Foi corajoso. E isso vai ficar guardado.'),
  ]),
  E('pesquisaEncomenda', ANY, 'fed', 'Pesquisa sob encomenda', 'Um instituto oferece uma pesquisa "ajustada" mostrando você na frente. Basta pagar a tabela.', [
    D('Pagar e divulgar a pesquisa', { pop: 5, img: -7, cash: -3, cong: 2 }, 'O número saiu em todos os telejornais. O ponto de vista dos analistas também.', 8),
    C('Divulgar sua pesquisa real, mesmo ruim', { pop: -3, img: 3 }, 'Ninguém gosta de má notícia. Mas dá para confiar em você.'),
    C('Não divulgar nada', { img: 0 }, 'A campanha segue no escuro.'),
  ]),
  E('rivalAcordo', ANY, 'fed', 'Acordo de bastidores com outro candidato', 'Outro candidato, que não é o seu maior rival, propõe um acordo reservado. Ele ajuda você com o eleitorado dele e você ajuda com a estrutura.', [
    C('Aceitar um acordo de não agressão', { img: 2, pop: -1 }, 'Ficou tudo combinado. Os dois ficaram mais educados em público.'),
    D('Dividir cargos e verba do futuro governo', { cong: 5, cash: 3, img: -7 }, 'O pacto foi fechado em um jantar discreto. O garçom tem celular.', 8),
    C('Recusar, sem briga', { cong: -1, img: 1 }, 'Educado e sozinho.'),
  ]),
  E('radioSabatina', ANY, 'fed', 'A rádio mais ouvida quer te sabatinar', 'A rádio de maior audiência da região te convida para uma sabatina ao vivo. O apresentador é conhecido por ser duro.', [
    G('Aceitar e encarar as perguntas', 0.55, { pop: 6, img: 3 }, 'Você aguentou a pressão e saiu aplaudido.', { pop: -4, img: -5 }, 'Perdeu a linha e o trecho virou meme.'),
    C('Aceitar, mas só com as perguntas combinadas', { pop: 2, img: -1 }, 'O apresentador percebeu e disse no ar. Constrangedor.'),
    D('Oferecer verba de publicidade para suavizar', { pop: 4, img: -6, cash: -3 }, 'A entrevista foi mansa, e todo mundo notou.', 8),
    C('Recusar o convite', { pop: -2 }, 'O apresentador falou do assunto por vinte minutos.'),
  ]),
  E('jornalDenuncia', ANY, 'fed', 'O jornal prepara uma matéria contra você', 'O editor liga avisando que sai amanhã uma matéria sobre um negócio do seu passado. Dá tempo de se mexer.', [
    C('Abrir o jogo e dar sua versão', { img: 2, pop: -1 }, 'A matéria saiu menos agressiva. O editor reconheceu a sua transparência.'),
    D('Ligar para o dono do jornal e pressionar', { img: -7, cong: 2 }, 'A matéria foi adiada. A pressão virou outra matéria, bem pior.', 10),
    C('Entrar na Justiça para impedir a publicação', { cash: -4, img: -3 }, 'Censura prévia nunca cai bem. Saiu em todos os outros jornais.'),
    C('Deixar publicar e responder depois', { img: -3, pop: -2 }, 'A matéria saiu forte, e você respondeu com calma.'),
  ]),
  E('operacao', ANY, 'fed', 'Operação na sua porta', 'Amanhecer com viaturas na rua: mandado de busca e apreensão em um assessor seu e na casa de um aliado. A imprensa já está na calçada.', [
    K('Colaborar e entregar tudo à investigação', { img: 3, pop: -2, cash: -3 }, 'Colaborar cansa, mas o processo ficou mais leve.', -30),
    K('Contratar o melhor advogado do país', { cash: -8, img: -1 }, 'O caixa sentiu. O processo anda mais devagar.', -20),
    D('Atacar a imprensa e o juiz', { pop: 3, cong: 2, img: -7 }, 'A base gostou do ataque. O juiz anotou cada palavra.', 10),
    G('Pedir ajuda a um amigo no tribunal', 0.5, { img: -8, cong: 3 }, 'O caso foi esfriando em uma gaveta. Mas todo mundo sabe de onde veio o favor.', { img: -14, pop: -5 }, 'O pedido vazou. A confusão virou escândalo por obstrução.', -15),
  ], () => false),
]