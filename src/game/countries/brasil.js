// Dados do Brasil. Tudo fictício: nenhum político ou partido real.
// Stats: pop (popularidade), cong (base política), eco (economia), cash (caixa),
//        soc (saúde e educação), seg (segurança), img (imagem/integridade)

const C = (label, fx, out) => ({ label, fx, out })
const E = (id, stages, title, text, choices) => ({ id, stages, title, text, choices })
const ANY = [0, 1, 2, 3]

export const brasil = {
  id: 'brasil',
  name: 'Brasil',
  flag: '🇧🇷',

  stages: [
    { id: 'vereador', office: 'Vereador(a)', place: 'Câmara Municipal', turns: 4 },
    { id: 'deputado', office: 'Deputado(a) Federal', place: 'Câmara dos Deputados', turns: 4 },
    { id: 'governador', office: 'Governador(a)', place: 'Palácio do Governo', turns: 6 },
    { id: 'presidente', office: 'Presidente da República', place: 'Palácio do Planalto', turns: 8 },
  ],

  archetypes: [
    { id: 'tecnico', name: 'Técnico(a)', desc: 'Planilha na mão, pouco carisma. Economia e imagem fortes.', fx: { eco: 5, img: 4, pop: -6, cong: -3 } },
    { id: 'populista', name: 'Popular', desc: 'Fala a língua do povo e lota praça. Gasta mais que devia.', fx: { pop: 14, eco: -2, img: -2 } },
    { id: 'negociador', name: 'Articulador(a)', desc: 'Conhece todo mundo em Brasília. Base forte, povo morno.', fx: { cong: 14, pop: -3, img: -3 } },
    { id: 'outsider', name: 'Outsider', desc: 'Veio de fora da política. Imagem limpa, zero base.', fx: { img: 10, pop: 6, cong: -14, cash: -3 } },
  ],

  regions: [
    { id: 'SP', name: 'São Paulo', bonus: 3 },
    { id: 'MG', name: 'Minas Gerais', bonus: 3 },
    { id: 'RJ', name: 'Rio de Janeiro', bonus: 2 },
    { id: 'BA', name: 'Bahia', bonus: 2 },
    { id: 'RS', name: 'Rio Grande do Sul', bonus: 2 },
    { id: 'PR', name: 'Paraná', bonus: 1 },
    { id: 'PE', name: 'Pernambuco', bonus: 1 },
    { id: 'CE', name: 'Ceará', bonus: 1 },
    { id: 'GO', name: 'Goiás', bonus: 0 },
    { id: 'PA', name: 'Pará', bonus: 0 },
    { id: 'AM', name: 'Amazonas', bonus: 0 },
    { id: 'DF', name: 'Distrito Federal', bonus: 0 },
  ],

  actions: [
    { id: 'rodar', name: 'Agenda nos bairros', desc: 'Apertar mão, tirar foto, comer pastel na feira.', fx: { pop: 4, img: 1, cash: -2 } },
    { id: 'bancada', name: 'Articular com a bancada', desc: 'Café, almoço e jantar com quem vota.', fx: { cong: 6, img: -1, cash: -2 } },
    { id: 'social', name: 'Investir em saúde e educação', desc: 'Posto de saúde, merenda, escola.', fx: { soc: 6, pop: 1, cash: -6 } },
    { id: 'seguranca', name: 'Reforçar a segurança', desc: 'Viaturas, câmeras, inteligência.', fx: { seg: 6, cash: -5 } },
    { id: 'economia', name: 'Estimular a economia', desc: 'Crédito, obras, desburocratização.', fx: { eco: 5, cash: -6 } },
    { id: 'midia', name: 'Campanha de comunicação', desc: 'TV, rádio, redes, influenciador.', fx: { pop: 4, img: 3, cash: -4 } },
    { id: 'cortar', name: 'Cortar gastos', desc: 'Apertar o cinto. Dói, mas o caixa agradece.', fx: { cash: 8, soc: -3, pop: -2, eco: -1 } },
    { id: 'transparencia', name: 'Ação de transparência', desc: 'Abrir as contas e mostrar tudo.', fx: { img: 6, cong: -2 } },
  ],

  events: [
    // ---------- Vereador ----------
    E('buraco', [0], 'A cratera da rua principal', 'Um buraco enorme no bairro virou meme. Moradores te marcaram em 400 vídeos.', [
      C('Fazer mutirão com a verba do gabinete', { pop: 6, img: 3, cash: -5 }, 'O mutirão viralizou. O prefeito ficou com ciúme.'),
      C('Cobrar a prefeitura em plenário', { pop: 3, cong: -4, img: 2 }, 'Aplaudido na galeria, criticado nos corredores.'),
      C('Ignorar, não é sua competência', { pop: -6, img: -2 }, 'A cratera ganhou nome próprio e página de fãs.'),
    ]),
    E('creche', [0], 'A fila da creche', 'Mil famílias esperando vaga. Uma mãe aparece no gabinete com o bebê no colo e o celular gravando.', [
      C('Propor lei para ampliar as vagas', { soc: 6, cong: -3, cash: -3, pop: 3 }, 'A lei passou apertado. A fila encolheu de verdade.'),
      C('Fechar parceria com ONGs e empresas', { soc: 4, img: 3, cong: 2 }, 'Solução criativa, e sem gastar o orçamento todo.'),
      C('Prometer e empurrar com a barriga', { pop: 2, img: -5 }, 'A mãe voltou, com mais gente e mais vídeo.'),
    ]),
    E('cargos', [0], 'Oferta que você não devia aceitar', 'O prefeito oferece cargos para seus aliados em troca do seu voto num projeto duvidoso.', [
      C('Aceitar e garantir a base', { cong: 10, img: -8, cash: 3 }, 'Base garantida. A reputação, nem tanto.'),
      C('Recusar publicamente', { img: 8, cong: -8, pop: 2 }, 'Virou herói nas redes e inimigo no plenário.'),
      C('Negociar o projeto, não os cargos', { cong: 3, img: 2, pop: -1 }, 'Saída honrosa. Ninguém ficou 100% feliz.'),
    ]),
    E('enchente', [0], 'Temporal no bairro', 'A chuva alagou três ruas em {estado}. As pessoas estão na porta de casa, com água na canela.', [
      C('Ir de bota ajudar na lama', { pop: 7, img: 3, cash: -3, soc: 2 }, 'A foto de bota virou símbolo do seu mandato.'),
      C('Acionar a Defesa Civil à distância', { soc: 3, pop: 1 }, 'Funcionou, mas ninguém viu você por lá.'),
      C('Culpar a gestão anterior', { pop: -3, img: -3, cong: -2 }, 'Ninguém quer saber de culpado, quer saber de solução.'),
    ]),
    E('fakenews', [0, 1], 'Ataque nas redes', 'Um perfil anônimo diz que você "sumiu com dinheiro da merenda". Mentira, mas já tem 20 mil compartilhamentos.', [
      C('Processar na Justiça', { img: 3, cash: -4, pop: 1 }, 'O processo andou. A mentira correu bem mais rápido.'),
      C('Responder com vídeo transparente', { img: 5, pop: 3 }, 'O vídeo explicando tudo foi o mais visto da sua carreira.'),
      C('Revidar na mesma moeda', { pop: 4, img: -7 }, 'Cada vez mais gente comentando, quase ninguém acreditando em ninguém.'),
    ]),

    // ---------- Deputado ----------
    E('emenda', [1], 'Emendas parlamentares', 'Você tem R$ 10 milhões em emendas para destinar. Todo mundo de repente é seu amigo.', [
      C('Obra visível na sua base', { pop: 8, cong: 2, img: -3, cash: -4 }, 'Placa com seu nome em tudo que é esquina.'),
      C('Hospital regional', { soc: 8, pop: 3, cash: -5 }, 'Obra demorada, mas vida salva não é meme.'),
      C('Trocar emendas por apoio na votação', { cong: 10, img: -6 }, 'A base cresceu. O jornal da noite também.'),
    ]),
    E('cpi', [1], 'A CPI da vez', 'Uma CPI vai investigar contratos suspeitos. Câmeras, holofotes e muita gente querendo aparecer.', [
      C('Pegar a relatoria e brilhar', { pop: 6, img: 3, cong: -6 }, 'Seu nome virou trending topic. Seus colegas anotaram.'),
      C('Ficar discreto', { cong: 2 }, 'Sem ganhos, sem danos. Seguro, mas morno.'),
      C('Votar pelo arquivamento em acordo', { cong: 7, img: -8 }, 'O acordo fechou. A imagem, rachou.'),
    ]),
    E('tributaria', [1], 'Reforma tributária', 'O texto chegou ao plenário. Empresários, sindicatos e prefeitos pressionam por todos os lados.', [
      C('Apoiar a reforma', { eco: 6, cong: -4, pop: -2 }, 'Reforma aprovada. Ninguém comemorou, mas a economia agradeceu.'),
      C('Votar contra, com discurso popular', { pop: 6, eco: -5, cong: 2 }, 'Aplausos nas redes e um buraco no longo prazo.'),
      C('Propor emenda de consenso', { cong: 5, eco: 2, img: 2, cash: -2 }, 'Saiu um meio-termo. Foi chamado de "estadista" por dois dias.'),
    ]),
    E('pacote', [1], 'Pacote de segurança', 'A bancada pede apoio num pacote duro contra o crime. A mídia está de olho no seu voto.', [
      C('Votar a favor', { seg: 7, pop: 4, soc: -3 }, 'Aprovado. Ficou conhecido como "linha dura".'),
      C('Votar contra e propor prevenção', { soc: 5, seg: -2, pop: -2, img: 2 }, 'Voto vencido, mas com discurso coerente.'),
      C('Faltar à sessão', { img: -5, cong: -3 }, 'Sumiu na hora H. Ninguém esqueceu.'),
    ]),
    E('audio', [1, 2], 'Áudio vazado', 'Um áudio do seu assessor falando em "resolver com o pessoal do partido" caiu na internet.', [
      C('Demitir na hora', { img: 3, cong: -3 }, 'Cabeça rolou rápido. O assessor jurou vingança.'),
      C('Defender o assessor', { img: -9, cong: 4 }, 'Lealdade é bonita, mas a manchete foi cruel.'),
      C('Abrir sindicância interna', { img: 1, cash: -3, pop: -1 }, 'Prometeu apurar. Vai ter que apurar mesmo.'),
    ]),

    // ---------- Governador ----------
    E('greve_pm', [2], 'Greve da polícia', 'A PM cruzou os braços em {estado}. O crime percebeu antes da imprensa.', [
      C('Negociar o aumento', { seg: 5, cash: -10, pop: 2 }, 'Fim da greve. Cofres bem mais leves.'),
      C('Linha dura: cortar o ponto', { seg: -10, pop: -6, cash: 4 }, 'Um fim de semana caótico. Os efeitos duram mais.'),
      C('Pedir a Força Nacional', { seg: 2, cong: -5, img: -3 }, 'Ordem restabelecida, mas o clima azedou com o governo federal.'),
    ]),
    E('seca', [2], 'Seca castiga o interior', 'Municípios do interior de {estado} estão sem água. Prefeitos ligam de hora em hora.', [
      C('Plano emergencial de caminhões-pipa', { soc: 5, cash: -8, pop: 4 }, 'Ninguém ficou sem água, mas o gasto foi alto.'),
      C('Obra de adutora a longo prazo', { eco: 5, cash: -10, soc: 3 }, 'Aposta de futuro. O retorno aparece só depois.'),
      C('Pedir ajuda federal', { cash: 5, cong: -4, img: -2 }, 'Chegou verba, junto com uma conta política.'),
    ]),
    E('fabrica', [2], 'Fábrica quer se instalar', 'Uma multinacional quer abrir uma fábrica no seu estado e exige incentivo fiscal. Outros estados estão no páreo.', [
      C('Incentivo fiscal gordo', { eco: 9, cash: -7, img: -2 }, 'Fábrica fechada. Promessa de milhares de empregos.'),
      C('Negociar contrapartidas', { eco: 5, soc: 3, cash: -2 }, 'Menos empregos que o prometido, mas com treinamento local.'),
      C('Recusar e priorizar empresas locais', { pop: 3, eco: -3, img: 2 }, 'O pequeno empresário gostou. O mercado achou arriscado.'),
    ]),
    E('rombo', [2], 'Rombo na previdência estadual', 'As contas não fecham mais. O secretário de Fazenda trouxe uma planilha vermelha.', [
      C('Reformar e enfrentar os sindicatos', { cash: 10, pop: -8, cong: -4, eco: 2 }, 'Reforma aprovada sob vaia. Contas respiram.'),
      C('Maquiar as contas', { cash: 6, img: -10 }, 'Funcionou até o Tribunal de Contas olhar.'),
      C('Pedir empréstimo', { cash: 12, eco: -4, img: -3 }, 'Dinheiro entrou. A dívida também.'),
    ]),
    E('planalto_liga', [2], 'O Planalto liga', 'O governo federal oferece verbas em troca de alinhamento no Congresso.', [
      C('Aceitar o alinhamento', { cash: 10, cong: 6, pop: -3 }, 'Verba liberada. Ficou conhecido como governador "chapa-branca".'),
      C('Manter a independência', { img: 5, pop: 3, cash: -3 }, 'Banca a independência. O dinheiro fez falta.'),
      C('Aceitar parte e negociar o resto', { cash: 5, cong: 2 }, 'Acordo meia-boca, mas funcional.'),
    ]),

    // ---------- Presidente ----------
    E('dolar', [3], 'Dólar dispara', 'O câmbio descontrolou na abertura do mercado. O ministro da Fazenda quer uma reunião agora.', [
      C('Subir os juros', { eco: -4, cash: 4, pop: -4, img: 2 }, 'O dólar recuou. O crédito encareceu.'),
      C('Vender reservas', { eco: 3, cash: -8 }, 'Segurou o dólar. Reserva menor, preocupação maior.'),
      C('Manter o curso e culpar o mercado', { pop: 1, eco: -7, img: -3 }, 'O mercado reagiu mal ao discurso. A inflação também.'),
    ]),
    E('caminhoneiros', [3], 'Greve dos caminhoneiros', 'Rodovias bloqueadas. Supermercado vazio. Posto de gasolina com fila.', [
      C('Ceder ao subsídio do diesel', { eco: 2, cash: -10, pop: 4 }, 'Greve encerrada, caixa bem mais magro.'),
      C('Acionar as Forças Armadas', { eco: 1, pop: -5, cong: -3, seg: 2 }, 'Estradas liberadas. Imagem arranhada.'),
      C('Negociar com lideranças', { eco: -1, cash: -4, img: 3, pop: 1 }, 'Demorou, mas saiu acordo sem confronto.'),
    ]),
    E('previdencia', [3], 'Reforma da Previdência', 'Sem mexer na previdência, o rombo não fecha. Mexer significa enfrentar o país inteiro.', [
      C('Enviar proposta dura', { cash: 14, pop: -9, cong: -4, eco: 4 }, 'Aprovada na raça. Você assumiu o ônus sozinho(a).'),
      C('Versão enxuta e negociada', { cash: 7, cong: 3, pop: -3, eco: 2 }, 'Saiu um texto médio. Todo mundo reclamou, ninguém virou inimigo.'),
      C('Engavetar o projeto', { pop: 3, cash: -5, eco: -3 }, 'Alívio hoje. Boleto amanhã.'),
    ]),
    E('escandalo', [3], 'Escândalo no ministério', 'Uma reportagem liga um dos seus ministros a contratos superfaturados.', [
      C('Demitir o ministro', { img: 5, cong: -5 }, 'Rápido e limpo. O partido dele não gostou.'),
      C('Blindar o ministro', { img: -10, cong: 6 }, 'Lealdade no Congresso. Rejeição na rua.'),
      C('Pedir investigação independente', { img: 8, cong: -3, pop: 2, cash: -2 }, 'Atitude de estadista, ainda que dolorosa.'),
    ]),
    E('surto', [3], 'Surto sanitário', 'Uma doença se espalha por várias capitais. Hospitais lotando.', [
      C('Vacinação em massa', { soc: 9, cash: -10, pop: 3 }, 'Cobertura alta. O sistema de saúde respirou.'),
      C('Medidas leves para não parar a economia', { eco: 3, soc: -8, pop: -3 }, 'A economia seguiu. As filas nos hospitais também.'),
      C('Lockdown regional', { soc: 4, eco: -7, pop: -3 }, 'Contágio contido, comércio de cara fechada.'),
    ]),
    E('copa', [3], 'A Seleção vai bem na Copa', 'O país parou. Todo mundo de amarelo. O que faz o presidente?', [
      C('Ponto facultativo nos jogos', { pop: 7, eco: -3, img: 1 }, 'Povo feliz. Fábrica vazia.'),
      C('Viajar para assistir no estádio', { pop: 3, img: -4, cash: -3 }, 'Foto no estádio, crítica pelos gastos.'),
      C('Aprovar medidas impopulares na surdina', { cash: 6, img: -6, cong: 3 }, 'Passou despercebido... por uma semana.'),
    ]),
    E('ambiental', [3], 'Pressão internacional por desmatamento', 'Imagens de satélite estão no jornal do mundo todo. Acordos comerciais estão em risco.', [
      C('Endurecer a fiscalização', { img: 6, eco: -3, cong: -4, cash: -4 }, 'Os números caíram. A bancada ruralista, não.'),
      C('Acordo de financiamento verde', { cash: 8, img: 4, soc: 2 }, 'Dinheiro lá de fora, e uma conta de cobrança.'),
      C('Discursar contra "ingerência"', { pop: 4, img: -6, eco: -2 }, 'O discurso foi popular dentro, desastroso fora.'),
    ]),
    E('centrao', [3], 'O Centrão cobra a fatura', 'A base aliada quer ministérios e emendas. Ou não tem votação.', [
      C('Ceder ministérios', { cong: 12, img: -6, cash: -3 }, 'Ministério cheio, governo estável, reputação pior.'),
      C('Resistir', { cong: -10, img: 4, pop: 2 }, 'Sem base, mas com coluna reta.'),
      C('Dividir as emendas', { cong: 6, cash: -8, img: -2 }, 'Todo mundo saiu um pouco satisfeito e o orçamento um pouco vazio.'),
    ]),
    E('estimulo', [3], 'Pacote de estímulo econômico', 'A economia desacelerou. Há três caminhos possíveis, todos caros.', [
      C('Crédito barato para empresas', { eco: 8, cash: -9 }, 'Empresário feliz, funcionário esperando o efeito.'),
      C('Ampliar transferência de renda', { soc: 5, pop: 6, cash: -10 }, 'Consumo subiu na ponta. Caixa desceu.'),
      C('Obras de infraestrutura', { eco: 6, seg: 1, cash: -8, pop: 2 }, 'Máquinas nas ruas e empregos. O resultado vem em um ano.'),
    ]),
    E('protestos', [3], 'Multidões nas ruas', 'Protestos em todas as capitais, com pautas misturadas e ninguém ouvindo ninguém.', [
      C('Ouvir e propor plebiscito', { pop: 5, cong: -4, img: 3 }, 'Gesto inesperado. Segurou a panela de pressão.'),
      C('Reforçar o policiamento', { seg: 3, pop: -6, img: -4 }, 'Ordem mantida, ânimos exaltados.'),
      C('Pronunciamento em rede nacional', { pop: 2, img: 1 }, 'Falou bonito. Ninguém mudou de lado.'),
    ]),
    E('tarifa', [3], 'Guerra comercial', 'Um grande parceiro impôs tarifa alta sobre os produtos exportados.', [
      C('Retaliar na mesma moeda', { pop: 3, eco: -6, img: 1 }, 'Vitória simbólica e prejuízo bem real.'),
      C('Buscar novos mercados', { eco: 3, img: 3, cash: -5 }, 'Diplomacia de viagem longa, resultado só no ano seguinte.'),
      C('Negociar nos bastidores', { eco: 1, img: 2, cong: 1 }, 'Sem foguetório, mas o tarifaço foi suavizado.'),
    ]),
    E('apagao', [3], 'Apagão nacional', 'Metade do país no escuro por seis horas. Hospitais no gerador.', [
      C('Térmicas a pleno', { eco: 2, cash: -9, img: -1 }, 'Luz de volta, conta de luz subindo.'),
      C('Racionamento', { eco: -5, soc: -3, pop: -4 }, 'Medida dura, mas evitou o pior.'),
      C('Culpar o clima', { img: -6, pop: -2 }, 'A explicação não aqueceu ninguém.'),
    ]),

    // ---------- Qualquer cargo ----------
    E('podcast', ANY, 'Convite para um podcast gigante', 'O maior podcast do país te chamou. São três horas de conversa ao vivo, sem edição.', [
      C('Ir e ser você mesmo(a)', { pop: 5, img: 4 }, 'Foi humano e engraçado. Virou corte viral.'),
      C('Ir com falas ensaiadas', { pop: 2, img: 1 }, 'Seguro. Mas a internet percebeu o roteiro.'),
      C('Recusar o convite', { pop: -1, img: -1 }, 'Seu concorrente foi no seu lugar.'),
    ]),
    E('empresario', ANY, 'Doação milionária', 'Um empresário oferece uma doação grande, "sem pedir nada em troca". Por enquanto.', [
      C('Aceitar sem pensar muito', { cash: 12, img: -7 }, 'Caixa cheio. Dívida moral também.'),
      C('Recusar', { img: 5, pop: 1 }, 'Postou a recusa, ganhou likes e perdeu verba.'),
      C('Aceitar só o que é legal e declarado', { cash: 5, img: 2 }, 'Transparência rendeu pouco, mas tranquilo.'),
    ]),
    E('imprensa', ANY, 'Entrevista difícil', 'Uma jornalista famosa quer te entrevistar ao vivo. Todo mundo sabe que ela não alivia.', [
      C('Encarar de frente', { img: 5, pop: 2 }, 'Saiu bem. Muita gente respeitou.'),
      C('Responder por escrito', { img: -2 }, 'Cara de quem está fugindo.'),
      C('Mandar o porta-voz', { img: -3, cong: 1 }, 'O porta-voz tropeçou. A manchete foi pior.'),
    ]),
  ],
}