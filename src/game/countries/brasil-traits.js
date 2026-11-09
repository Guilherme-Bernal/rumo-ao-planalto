// Características do personagem (Brasil).
// fx: bônus/ônus iniciais | gain: multiplica o que você ganha | loss: multiplica o que você perde | camp: custo da campanha
// axis (ideologia): em qual linha os partidos te enxergam: esquerda | centro | direita | independente
// Stats: pop, cong (base), eco, cash (caixa), soc (saúde e educação), seg, img

export const brasilTraits = [
  {
    id: 'ideologia',
    label: 'Ideologia',
    hint: 'Define seus números iniciais, o que você ganha mais fácil e com quais partidos você combina.',
    def: 'centro',
    options: [
      { id: 'esquerda', icon: '🌹', axis: 'esquerda', name: 'Esquerda', desc: 'Estado presente, proteção social, saúde e educação. O mercado desconfia.', fx: { soc: 6, pop: 2 }, gain: { soc: 1.25, pop: 1.05, seg: 0.85 }, loss: { eco: 1.15 } },
      { id: 'socialista', icon: '✊', axis: 'esquerda', name: 'Socialista', desc: 'Distribuição de renda e serviços públicos fortes. Militância fiel, mercado em alerta.', fx: { soc: 8, pop: 1, cash: -2 }, gain: { soc: 1.3, pop: 1.05, eco: 0.9 }, loss: { eco: 1.2 } },
      { id: 'socialdem', icon: '🕊️', axis: 'esquerda', name: 'Social-democrata', desc: 'Mercado com rede de proteção. Conversa com todo mundo, agrada pouco os extremos.', fx: { soc: 4, cong: 4 }, gain: { soc: 1.15, cong: 1.1 }, loss: { pop: 1.05 } },
      { id: 'centro', icon: '⚖️', axis: 'centro', name: 'Centro', desc: 'Constrói pontes e evita extremos. Base forte, discurso morno.', fx: { cong: 5 }, gain: { cong: 1.25, pop: 0.9 } },
      { id: 'tecnocrata', icon: '📊', axis: 'centro', name: 'Tecnocrata', desc: 'Decide por dados, não por ideologia. Eficiente, mas frio com o povo.', fx: { eco: 4, cash: 3 }, gain: { eco: 1.15, cash: 1.1, pop: 0.88 } },
      { id: 'liberal', icon: '📈', axis: 'direita', name: 'Liberal', desc: 'Menos Estado, mais mercado e livre iniciativa. A pauta social sofre mais resistência.', fx: { eco: 6, cash: 2 }, gain: { eco: 1.25, cash: 1.1, soc: 0.85 }, loss: { soc: 1.15 } },
      { id: 'direita', icon: '🛡️', axis: 'direita', name: 'Direita', desc: 'Mercado, ordem e segurança. A pauta social sofre mais resistência.', fx: { seg: 7, eco: 3 }, gain: { seg: 1.3, eco: 1.2, soc: 0.85 }, loss: { soc: 1.15 } },
      { id: 'conservador', icon: '🏛️', axis: 'direita', name: 'Conservador', desc: 'Tradição, família e valores. Fiel no interior, ruído nas grandes cidades.', fx: { img: 3, seg: 4, pop: 1 }, gain: { pop: 1.1, seg: 1.15, img: 1.05 }, loss: { soc: 1.1 } },
      { id: 'libertario', icon: '🗽', axis: 'direita', name: 'Libertário(a)', desc: 'Estado mínimo e liberdade total. Caixa enxuto, pouquíssimos aliados.', fx: { eco: 5, cash: 3, cong: -3 }, gain: { eco: 1.2, cash: 1.15, soc: 0.8 }, loss: { cong: 1.2 } },
      { id: 'populista', icon: '📣', axis: 'independente', name: 'Populista', desc: 'Fala direto ao povo, contra "tudo isso que está aí". Dá voto, dá dor de cabeça.', fx: { pop: 8, img: -3 }, gain: { pop: 1.25 }, loss: { img: 1.2, cong: 1.1 }, baseP: 3 },
      { id: 'ecologista', icon: '🌳', axis: 'independente', name: 'Ecologista', desc: 'Meio ambiente e futuro em primeiro lugar. Imagem boa, economia olha torto.', fx: { img: 4, soc: 3 }, gain: { soc: 1.15, img: 1.1, eco: 0.9 } },
      { id: 'anarquista', icon: '🏴', axis: 'independente', name: 'Anarquista', desc: 'Sem chefe, sem cartilha, sem partido que te segure. Povo curioso, política te ignora.', fx: { pop: 3, img: 3, cong: -8 }, gain: { pop: 1.15, img: 1.1 }, loss: { cong: 1.4 } },
      { id: 'independente', icon: '🧭', axis: 'independente', name: 'Independente', desc: 'Sem partido nem cartilha. Imagem limpa, mas ninguém te protege.', fx: { img: 3 }, gain: { img: 1.2 }, loss: { cong: 1.3 } },
    ],
  },
  {
    id: 'religiao',
    label: 'Fé e valores',
    hint: 'Sua relação com a religião muda a recepção do eleitorado e quem se aproxima de você.',
    def: 'sem',
    options: [
      { id: 'sem', icon: '🌐', name: 'Sem religião (Estado laico)', desc: 'Defende o Estado laico. Parte do eleitorado desconfia, outra parte respeita.', fx: { img: 3 }, loss: { pop: 1.08 } },
      { id: 'catolico', icon: '⛪', name: 'Católico(a)', desc: 'Maior comunidade do país. Boa entrada em festas e paróquias.', fx: { pop: 3, img: 1 }, gain: { pop: 1.05 } },
      { id: 'evangelico', icon: '📖', name: 'Evangélico(a)', desc: 'Igrejas organizadas e fiéis engajados. Atrito com pautas progressistas.', fx: { pop: 4, cong: 2 }, gain: { pop: 1.1 }, loss: { img: 1.05 } },
      { id: 'espirita', icon: '🕯️', name: 'Espírita', desc: 'Foco em caridade e trabalho social. Comunidade menor, imagem respeitada.', fx: { soc: 3, img: 2 }, gain: { soc: 1.1 } },
      { id: 'matriz', icon: '🥁', name: 'Religião de matriz africana', desc: 'Comunidade fiel e solidária. Enfrenta preconceito de parte do eleitorado.', fx: { pop: 3, soc: 2 }, gain: { soc: 1.1 }, loss: { img: 1.1 } },
      { id: 'outra', icon: '🕉️', name: 'Outra fé ou espiritualidade', desc: 'Budista, judaica, islâmica, de outro caminho. Comunidade pequena, mas fiel.', fx: { img: 2, cong: 1 }, gain: { img: 1.05 } },
    ],
  },
  {
    id: 'formacao',
    label: 'Formação',
    hint: 'Sua bagagem profissional e o que você sabe fazer melhor.',
    def: 'advogado',
    options: [
      { id: 'economista', icon: '💹', name: 'Economista', desc: 'Entende de número. Fala difícil e o povo não acompanha.', fx: { eco: 5 }, gain: { eco: 1.2, pop: 0.9 } },
      { id: 'medico', icon: '🩺', name: 'Médico(a)', desc: 'Credibilidade na saúde. Gestão e caixa não são seu forte.', fx: { soc: 5, img: 2 }, gain: { soc: 1.2, cash: 0.9 } },
      { id: 'advogado', icon: '⚖️', name: 'Advogado(a)', desc: 'Dominam as leis e as negociações. Fama de "político de gabinete".', fx: { cong: 5 }, gain: { cong: 1.2 }, loss: { img: 1.15 } },
      { id: 'engenheiro', icon: '🏗️', name: 'Engenheiro(a)', desc: 'Obra, orçamento e eficiência. Pouco jogo de cintura político.', fx: { cash: 3 }, gain: { eco: 1.05, cash: 1.1, cong: 0.9 } },
      { id: 'professor', icon: '🎓', name: 'Professor(a)', desc: 'Respeito na educação e boa fala em público. Salário curto, caixa curto.', fx: { soc: 4, img: 3, cash: -2 }, gain: { soc: 1.15, pop: 1.05 } },
      { id: 'comunicador', icon: '🎙️', name: 'Comunicador(a)', desc: 'Câmera e microfone são sua casa. Cada deslize vira manchete.', fx: { pop: 5 }, gain: { pop: 1.3 }, loss: { img: 1.15 }, baseP: 4 },
      { id: 'raiz', icon: '🧱', name: 'Sem faculdade (escola da vida)', desc: 'Fala a língua da rua e o povo se vê em você. Menos preparo técnico.', fx: { pop: 7, img: 3 }, gain: { pop: 1.25, eco: 0.9 }, baseP: 4 },
      { id: 'administrador', icon: '📋', name: 'Administrador(a)', desc: 'Sabe tocar equipe, contrato e orçamento. Discurso burocrático demais.', fx: { cash: 3, cong: 2 }, gain: { cash: 1.1, eco: 1.05, pop: 0.92 } },
      { id: 'contador', icon: '🧮', name: 'Contador(a)', desc: 'Lê um balanço de olhos fechados. Ninguém aguenta ouvir você falar de planilha.', fx: { cash: 5 }, gain: { cash: 1.15, eco: 1.05, pop: 0.88 } },
      { id: 'jornalista', icon: '📰', name: 'Jornalista', desc: 'Conhece a imprensa por dentro e sabe contar uma história. Todo mundo quer te cobrar.', fx: { img: 3, pop: 3 }, gain: { img: 1.1, pop: 1.1 }, loss: { img: 1.1 } },
      { id: 'agronomo', icon: '🌱', name: 'Agrônomo(a)', desc: 'Entende de campo, clima e produção. Força no interior, pouca no asfalto.', fx: { eco: 4, soc: 1 }, gain: { eco: 1.15, cong: 0.95 } },
      { id: 'enfermeiro', icon: '💉', name: 'Enfermeiro(a)', desc: 'Conhece o SUS pelo plantão. Bastante carisma, pouca verba.', fx: { soc: 5, pop: 2, cash: -1 }, gain: { soc: 1.2, pop: 1.05, cash: 0.92 } },
      { id: 'assistente_social', icon: '🤲', name: 'Assistente social', desc: 'Conhece a pobreza de perto e sabe fazer política pública. Pouco jogo de poder.', fx: { soc: 6, img: 2 }, gain: { soc: 1.25, cong: 0.9 } },
      { id: 'cientista', icon: '🔬', name: 'Cientista / pesquisador(a)', desc: 'Decide com evidência. A academia aplaude, o balcão estranha.', fx: { img: 3, eco: 3 }, gain: { eco: 1.1, soc: 1.05, pop: 0.88 }, loss: { cong: 1.1 } },
      { id: 'ti', icon: '💻', name: 'Tecnologia da informação', desc: 'Pensa em sistema e eficiência. Boa nas redes, desajeitado no palanque.', fx: { eco: 3, pop: 2, cash: 1 }, gain: { eco: 1.1, pop: 1.05, cong: 0.9 } },
      { id: 'arquiteto', icon: '📐', name: 'Arquiteto(a) / urbanista', desc: 'Pensa a cidade como um todo. Obra bonita, pouca articulação.', fx: { eco: 3, img: 2 }, gain: { eco: 1.1, soc: 1.05, cong: 0.92 } },
      { id: 'teologo', icon: '✝️', name: 'Teólogo(a)', desc: 'Voz moral respeitada. Atrito com quem não compartilha a fé.', fx: { img: 4, pop: 2 }, gain: { pop: 1.1, img: 1.1, eco: 0.9 }, loss: { cong: 1.1 } },
      { id: 'tecnico', icon: '🔧', name: 'Ensino técnico', desc: 'Mão na massa e senso prático. Pouca pompa, muita credibilidade com o trabalhador.', fx: { pop: 4, eco: 2 }, gain: { pop: 1.1, eco: 1.05 } },
      { id: 'artista', icon: '🎨', name: 'Artista / cultura', desc: 'Criativo e conhecido. Os números não são a sua praia.', fx: { pop: 5, img: 2, cash: -2 }, gain: { pop: 1.2, cash: 0.9 }, baseP: 3 },
      { id: 'cientista_politico', icon: '🏛️', name: 'Cientista político(a)', desc: 'Entende de sistema eleitoral e articulação. Povo acha que você complica tudo.', fx: { cong: 4, img: 1 }, gain: { cong: 1.15, pop: 0.92 } },
      { id: 'historiador', icon: '📚', name: 'Historiador(a)', desc: 'Dá contexto a tudo. Lido como professoral.', fx: { img: 4, soc: 2 }, gain: { img: 1.1, soc: 1.05, cash: 0.92 } },
      { id: 'pedagogo', icon: '🧒', name: 'Pedagogo(a)', desc: 'Conhece a escola pública por dentro. Boa conversa com as famílias.', fx: { soc: 5, pop: 2, cash: -1 }, gain: { soc: 1.2, pop: 1.05 } },
      { id: 'psicologo', icon: '🧠', name: 'Psicólogo(a)', desc: 'Sabe ouvir e acalmar. Credibilidade na saúde mental, pouco peso na economia.', fx: { soc: 4, img: 3 }, gain: { soc: 1.15, img: 1.05, eco: 0.92 } },
    ],
  },
  {
    id: 'carreira',
    label: 'Carreira antes da política',
    hint: 'De onde você vem e quem confia em você.',
    def: 'servidor',
    options: [
      { id: 'servidor', icon: '🗂️', name: 'Servidor(a) público(a)', desc: 'Conhece a máquina por dentro. Pouco carisma.', fx: { cong: 2, soc: 2 }, gain: { soc: 1.05, cash: 1.0, pop: 0.85 } },
      { id: 'militar', icon: '🎖️', name: 'Militar', desc: 'Disciplina e hierarquia. Respeito na segurança, mais atrito com a imprensa.', fx: { seg: 8, cong: 2 }, gain: { seg: 1.25, soc: 0.9 }, loss: { img: 1.1 } },
      { id: 'policial', icon: '🚓', name: 'Policial', desc: 'Conhece a rua e o crime. Ganha na segurança, perde com quem desconfia da farda.', fx: { seg: 7, pop: 2 }, gain: { seg: 1.25, pop: 1.05 }, loss: { img: 1.1, soc: 1.05 } },
      { id: 'empresario', icon: '💼', name: 'Empresário(a)', desc: 'Sabe gerar caixa e emprego. O povo desconfia dos interesses.', fx: { cash: 3, eco: 3 }, gain: { eco: 1.1, cash: 1.05 }, loss: { img: 1.2 } },
      { id: 'agro', icon: '🌾', name: 'Produtor(a) rural', desc: 'Força no interior e no agro. Pouca afinidade com a capital.', fx: { eco: 4, cong: 2, pop: -1 }, gain: { eco: 1.1, cong: 1.05 }, loss: { img: 1.05 } },
      { id: 'sindicalista', icon: '🛠️', name: 'Sindicalista', desc: 'Mobiliza trabalhadores e conhece negociação. Empresariado fecha a cara.', fx: { pop: 5, soc: 3 }, gain: { pop: 1.15, soc: 1.1, eco: 0.9 }, loss: { eco: 1.1 } },
      { id: 'lider', icon: '🏘️', name: 'Líder comunitário(a)', desc: 'Conhece o bairro de porta em porta. Sem experiência com orçamento grande.', fx: { pop: 7, soc: 3 }, gain: { pop: 1.3, cash: 0.9 }, baseP: 4 },
      { id: 'religioso', icon: '🙏', name: 'Líder religioso(a)', desc: 'Rebanho fiel e boa imagem. Atrito com quem pensa diferente.', fx: { pop: 5, img: 3 }, gain: { pop: 1.1, img: 1.1, eco: 0.9 }, loss: { cong: 1.1 } },
      { id: 'influenciador', icon: '📱', name: 'Influenciador(a) digital', desc: 'Milhões de seguidores. Pouca base e muita exposição.', fx: { pop: 10 }, gain: { pop: 1.3, cong: 0.85 }, loss: { img: 1.15 }, baseP: 5 },
      { id: 'professor_rede', icon: '🍎', name: 'Professor(a) da rede pública', desc: 'Educou meia cidade. Salário curto e rede de ex-alunos.', fx: { pop: 4, soc: 3, cash: -2 }, gain: { soc: 1.1, pop: 1.1 }, baseP: 2 },
      { id: 'saude', icon: '🏥', name: 'Profissional de saúde', desc: 'Plantão, fila e hospital. O povo confia em quem cuidou dele.', fx: { soc: 5, pop: 3 }, gain: { soc: 1.15, pop: 1.05, cash: 0.92 } },
      { id: 'atleta', icon: '🏅', name: 'Ex-atleta', desc: 'Rosto conhecido e disciplina de treino. Pouca experiência em gestão.', fx: { pop: 8, img: 2 }, gain: { pop: 1.2, cong: 0.9 }, baseP: 4 },
      { id: 'artista_car', icon: '🎤', name: 'Artista / músico(a)', desc: 'Sabe cativar plateia. Imagem instável, tem muito fã e muito crítico.', fx: { pop: 8, cash: -2 }, gain: { pop: 1.25, cash: 0.9 }, loss: { img: 1.1 }, baseP: 4 },
      { id: 'motorista', icon: '🚕', name: 'Motorista / entregador(a)', desc: 'Conhece a cidade rua a rua e o drama do trabalhador. Sem verba e sem articulação.', fx: { pop: 6, cash: -3 }, gain: { pop: 1.2, cong: 0.9 }, baseP: 3 },
      { id: 'comerciante', icon: '🏪', name: 'Pequeno(a) comerciante', desc: 'Sabe o preço de tudo. Boa voz do comércio local.', fx: { eco: 3, pop: 3 }, gain: { eco: 1.1, pop: 1.05 } },
      { id: 'bancario', icon: '🏦', name: 'Bancário(a)', desc: 'Entende de crédito e de juros. Povo desconfia do banco.', fx: { eco: 4, cash: 2, pop: -2 }, gain: { eco: 1.1, cash: 1.1 }, loss: { img: 1.05 } },
      { id: 'ong', icon: '🌍', name: 'Ativista / ONG', desc: 'Causa clara e militância organizada. A imagem é ótima e a verba é rara.', fx: { img: 4, soc: 3, cash: -3 }, gain: { img: 1.1, soc: 1.1, cong: 0.9 } },
      { id: 'magistrado', icon: '⚖️', name: 'Magistrado(a) / promotor(a) aposentado(a)', desc: 'Fama de rigor e de imparcialidade. Baixo carisma popular.', fx: { img: 6, seg: 3, pop: -2 }, gain: { img: 1.15, seg: 1.1, pop: 0.9 } },
      { id: 'bombeiro', icon: '🚒', name: 'Bombeiro / Defesa Civil', desc: 'Salvou gente em enchente e incêndio. Respeito imediato na crise.', fx: { seg: 4, pop: 4, img: 2 }, gain: { seg: 1.1, pop: 1.1 } },
      { id: 'diplomata', icon: '🛂', name: 'Diplomata', desc: 'Fala com o mundo inteiro. O povo acha você distante.', fx: { img: 5, cong: 3, pop: -3 }, gain: { img: 1.15, cong: 1.1, pop: 0.88 } },
      { id: 'estudante', icon: '🎒', name: 'Liderança estudantil', desc: 'Mobiliza os jovens e fala com as redes. Pouca experiência.', fx: { pop: 6, img: 2, cash: -3 }, gain: { pop: 1.15 }, loss: { cong: 1.1 }, baseP: 3 },
      { id: 'caminhoneiro', icon: '🚛', name: 'Caminhoneiro(a) / transportador(a)', desc: 'Conhece cada estrada do país. Voz da logística e do interior.', fx: { eco: 2, pop: 4, seg: 1 }, gain: { pop: 1.1, eco: 1.05 } },
    ],
  },
  {
    id: 'patrimonio',
    label: 'Patrimônio',
    hint: 'Quanto dinheiro você tem para bancar a campanha, e o que o povo pensa disso.',
    def: 'classe_media',
    options: [
      { id: 'humilde', icon: '🧺', name: 'Origem humilde', desc: 'O povo se identifica com sua história. O caixa de campanha é curto.', fx: { pop: 6, img: 4, cash: -6 }, gain: { pop: 1.25 }, baseP: 3 },
      { id: 'classe_media', icon: '🏠', name: 'Classe média', desc: 'Sem vantagens nem desvantagens especiais.', fx: {} },
      { id: 'rico', icon: '🚗', name: 'Rico(a)', desc: 'Dinheiro para bancar a campanha. Olhar torto de parte do eleitorado.', fx: { cash: 10, img: -3 }, gain: { pop: 0.95 }, camp: 0.8 },
      { id: 'bilionario', icon: '💎', name: 'Bilionário(a)', desc: 'Campanha bem mais barata. Todo erro vira "o rico que não entende o povo".', fx: { cash: 14, img: -10, pop: -4 }, gain: { pop: 0.9 }, loss: { img: 1.3 }, camp: 0.65 },
      { id: 'pobre', icon: '🏚️', name: 'Veio da periferia', desc: 'Nunca teve nada de bandeja. A história comove, o caixa de campanha é mínimo.', fx: { pop: 8, img: 5, cash: -9 }, gain: { pop: 1.3 }, loss: { cong: 1.1 }, baseP: 4 },
      { id: 'endividado', icon: '📉', name: 'Endividado(a)', desc: 'Está no vermelho e a imprensa descobre rápido. Povo se identifica, credor aparece.', fx: { pop: 3, cash: -7, img: -2 }, gain: { pop: 1.1 }, loss: { img: 1.15 } },
      { id: 'aposentado', icon: '🪑', name: 'Aposentado(a) com renda estável', desc: 'Sem pressa e sem sufoco. Caixa pequeno, mas tranquilo.', fx: { cash: 3, img: 1 }, gain: { cash: 1.05 } },
      { id: 'novo_rico', icon: '💼', name: 'Empreendedor(a) que enriqueceu do zero', desc: 'Fez fortuna com trabalho. Admirado por uns, visto como patrão por outros.', fx: { cash: 8, pop: 1, img: -2 }, gain: { eco: 1.05, cash: 1.05 }, loss: { img: 1.1 }, camp: 0.9 },
      { id: 'herdeiro', icon: '🏰', name: 'Herdeiro(a) de família tradicional', desc: 'Sobrenome forte, contatos e caixa. Parte do eleitorado desconfia de privilégio.', fx: { cash: 9, cong: 3, img: -4, pop: -1 }, gain: { cong: 1.1 }, loss: { img: 1.15 }, camp: 0.85 },
      { id: 'fazendeiro', icon: '🐂', name: 'Grande proprietário(a) rural', desc: 'Terra, gado e muita influência no interior. A cidade te enxerga com ressalvas.', fx: { cash: 9, eco: 2, cong: 2, img: -4 }, gain: { eco: 1.05, cong: 1.05 }, loss: { img: 1.15 }, camp: 0.85 },
      { id: 'celebridade', icon: '🌟', name: 'Fortuna de fama', desc: 'Ganhou dinheiro aparecendo. Rosto conhecido, cada deslize vira piada.', fx: { cash: 7, pop: 4, img: -3 }, gain: { pop: 1.1 }, loss: { img: 1.2 }, baseP: 3, camp: 0.9 },
    ],
  },
  {
    id: 'paixao',
    label: 'Paixão (o que te move fora da política)',
    hint: 'Aparece nos grandes eventos do calendário: acertar o gosto do povo rende popularidade extra.',
    def: 'nenhuma',
    options: [
      { id: 'nenhuma', icon: '➖', name: 'Nenhuma em especial', desc: 'Foco total na política. Sem bônus nem ônus.', fx: {} },
      { id: 'futebol', icon: '⚽', name: 'Futebol', desc: 'Torcedor(a) de arquibancada. Bônus em finais, Copa e jogos grandes.', fx: { pop: 1 } },
      { id: 'automobilismo', icon: '🏎️', name: 'Automobilismo', desc: 'Fórmula 1, Fórmula E e kart. Bônus nos grandes prêmios.', fx: { pop: 1 } },
      { id: 'musica', icon: '🎶', name: 'Música e festa', desc: 'Samba, sertanejo e forró. Bônus em Carnaval, festas e Réveillon.', fx: { pop: 1 } },
      { id: 'historia', icon: '📜', name: 'História e civismo', desc: 'Gosta de desfile, bandeira e discurso. Bônus no 7 de Setembro.', fx: { img: 1 } },
      { id: 'motos', icon: '🏍️', name: 'Motociclismo', desc: 'Moto, estrada e encontro de motoclube. Bônus no GP e nas festas de rua.', fx: { pop: 1 } },
      { id: 'danca', icon: '💃', name: 'Dança e quadrilha', desc: 'Forró, quadrilha e escola de samba. Bônus em Carnaval e festas regionais.', fx: { pop: 1 } },
      { id: 'gastronomia', icon: '🍖', name: 'Churrasco e culinária', desc: 'Panela no fogo e mesa cheia. Bônus em festas regionais e no Réveillon.', fx: { pop: 1, img: 1 } },
      { id: 'volei', icon: '🏐', name: 'Vôlei e esportes olímpicos', desc: 'Acompanha o esporte além do futebol. Bônus em finais e na Copa.', fx: { pop: 1, img: 1 } },
      { id: 'lutas', icon: '🥋', name: 'Lutas e artes marciais', desc: 'Tatame, MMA e disciplina. Passa firmeza e segurança.', fx: { seg: 2 } },
      { id: 'corrida', icon: '🏃', name: 'Corrida de rua', desc: 'Treina todo dia e encontra gente na pista. Imagem saudável.', fx: { img: 2 } },
      { id: 'pesca', icon: '🎣', name: 'Pesca e vida no campo', desc: 'Rio, sítio e conversa devagar. Conexão com o interior.', fx: { pop: 1, img: 1 } },
      { id: 'natureza', icon: '🌿', name: 'Natureza e trilhas', desc: 'Parque, trilha e causa ambiental. Boa imagem e olhar para a cidade.', fx: { img: 2, soc: 1 } },
      { id: 'leitura', icon: '📚', name: 'Leitura e literatura', desc: 'Sempre com um livro na mão. Respeito dos mais velhos, pouco apelo nas redes.', fx: { img: 3 }, loss: { pop: 1.03 } },
      { id: 'cinema', icon: '🎬', name: 'Cinema e séries', desc: 'Referência para tudo. Conversa fácil com o público jovem.', fx: { pop: 1, img: 1 } },
      { id: 'games', icon: '🎮', name: 'Games e cultura geek', desc: 'Joga online e entende a internet. Boa leitura das redes.', fx: { pop: 2, cong: -1 } },
      { id: 'tecnologia', icon: '🤖', name: 'Tecnologia e inovação', desc: 'Gosta de testar gadget e app novo. Ajuda a pensar a cidade inteligente.', fx: { eco: 2 } },
      { id: 'xadrez', icon: '♟️', name: 'Xadrez e estratégia', desc: 'Pensa três jogadas à frente. Bom em articulação, frio em palanque.', fx: { cong: 2, img: 1 } },
      { id: 'filantropia', icon: '🤲', name: 'Voluntariado e ação social', desc: 'Mutirão, doação e campanha solidária. A comunidade conhece seu rosto.', fx: { soc: 2, img: 1 } },
      { id: 'pets', icon: '🐶', name: 'Causa animal', desc: 'Resgata bicho e apoia abrigo. Imagem simpática e eleitor engajado.', fx: { pop: 1, img: 1 } },
      { id: 'viagens', icon: '✈️', name: 'Viagens e idiomas', desc: 'Conhece outros países e fala outras línguas. Povo acha meio distante.', fx: { img: 2, cong: 1 }, loss: { pop: 1.03 } },
      { id: 'teatro', icon: '🎭', name: 'Teatro e cultura popular', desc: 'Sobe no palco sem medo. Cultura local ganha voz.', fx: { pop: 1, img: 1 } },
    ],
  },
]
// Idade do personagem: define faixas com bônus e ônus e bloqueia opções que não combinam com a idade.
// Idade mínima de cada cargo (vereador, deputado, governador, presidente). Quem ainda não tem a idade repete o mandato.
export const MIN_AGE_OFFICE = [18, 21, 30, 35]
export const AGE_MIN = 18
export const AGE_MAX = 75
export const AGE_DEF = 35

export function ageMods(age) {
  if (age == null) return { id: 'x', icon: '🙂', name: '', desc: '', fx: {} }
  if (age < 23) return { id: 'prodigio', icon: '🚀', name: 'Prodígio da política', desc: 'Muito novo e muito falado. Viraliza fácil, mas tem pouco apoio e quase nenhum dinheiro.', fx: { pop: 4, cong: -4, cash: -3, img: -1 }, gain: { pop: 1.08 }, loss: { cong: 1.15 } }
  if (age < 30) return { id: 'jovem', icon: '🌱', name: 'Jovem promessa', desc: 'Energia, redes e cara nova. Falta costura política e dinheiro.', fx: { pop: 3, cong: -3, cash: -2 }, gain: { pop: 1.05 }, loss: { cong: 1.1 } }
  if (age < 40) return { id: 'ascensao', icon: '📈', name: 'Em ascensão', desc: 'Já tem estrada e ainda tem fôlego. Faixa equilibrada.', fx: { cong: 1, pop: 1 } }
  if (age < 55) return { id: 'maturo', icon: '🧭', name: 'Maturidade política', desc: 'Contatos, experiência e credibilidade. Pouca novidade para vender.', fx: { cong: 3, img: 1 }, gain: { cong: 1.05 } }
  if (age < 65) return { id: 'veterano', icon: '🏛️', name: 'Veterano(a)', desc: 'Respeito, bastidor e memória longa. O eleitor jovem acha antiquado.', fx: { cong: 4, img: 2, pop: -1 }, gain: { img: 1.05 }, loss: { pop: 1.05 } }
  return { id: 'cacique', icon: '👴', name: 'Cacique', desc: 'Tudo que já viu rende articulação e autoridade. A popularidade cansa e o ritmo pesa.', fx: { cong: 5, img: 3, pop: -3, cash: 2 }, gain: { cong: 1.08 }, loss: { pop: 1.1 } }
}

// Idade mínima (min) ou máxima (max) para cada opção. O que não aparece aqui serve para qualquer idade.
export const AGE_GATES = {
  formacao: { economista: { min: 22 }, engenheiro: { min: 23 }, professor: { min: 22 }, administrador: { min: 22 }, contador: { min: 22 }, jornalista: { min: 22 }, agronomo: { min: 22 }, enfermeiro: { min: 22 }, assistente_social: { min: 22 }, historiador: { min: 22 }, medico: { min: 25 }, advogado: { min: 24 }, cientista: { min: 28 }, teologo: { min: 26 }, arquiteto: { min: 24 }, psicologo: { min: 24 }, cientista_politico: { min: 24 }, pedagogo: { min: 24 } },
  carreira: { magistrado: { min: 50 }, diplomata: { min: 30 }, estudante: { max: 29 }, atleta: { min: 27 }, religioso: { min: 28 }, sindicalista: { min: 28 }, bombeiro: { min: 25 }, bancario: { min: 25 }, lider: { min: 25 }, militar: { min: 25 }, policial: { min: 21 }, servidor: { min: 21 }, empresario: { min: 22 }, agro: { min: 21 }, professor_rede: { min: 22 }, saude: { min: 21 }, ong: { min: 20 } },
  patrimonio: { aposentado: { min: 55 }, bilionario: { min: 38 }, novo_rico: { min: 30 }, rico: { min: 28 }, fazendeiro: { min: 30 }, herdeiro: { min: 25 }, celebridade: { min: 25 } },
}
export function ageGate(cat, opt, age) {
  const g = (AGE_GATES[cat] || {})[opt]
  if (!g || age == null) return null
  if (g.min && age < g.min) return `Exige ${g.min}+ anos`
  if (g.max && age > g.max) return `Só até ${g.max} anos`
  return null
}
