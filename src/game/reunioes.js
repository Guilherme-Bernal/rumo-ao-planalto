// BLOCO 21: reuniões com várias pessoas. Cada participante tem um temperamento e reage ao jeito como você conduz a conversa.
// Só dados: a lógica está no motor (engine.js).

export const TRAITS = {
  pragmatico: { label: 'pragmático', icon: '🧮' },
  idealista: { label: 'idealista', icon: '🕊️' },
  ganancioso: { label: 'interesseiro', icon: '💼' },
  orgulhoso: { label: 'orgulhoso', icon: '🦚' },
  cauteloso: { label: 'cauteloso', icon: '🐢' },
}

// Como cada temperamento reage a cada abordagem (muda a atitude de -3 a +3).
export const ABORDAGENS = [
  { id: 'ouvir', icon: '👂', name: 'Ouvir e conciliar', desc: 'Deixa cada um falar e procura o meio-termo.', eff: { pragmatico: 1, idealista: 1, ganancioso: 0, orgulhoso: 1, cauteloso: 1 } },
  { id: 'pressionar', icon: '💪', name: 'Pressionar', desc: 'Mostra força e cobra uma decisão.', eff: { pragmatico: 0, idealista: -1, ganancioso: -1, orgulhoso: -2, cauteloso: -1 }, fx: { cong: 0.5 } },
  { id: 'ofertar', icon: '🎁', name: 'Oferecer uma vantagem', desc: 'Põe algo na mesa. Custa 1 de Caixa.', eff: { pragmatico: 2, idealista: -1, ganancioso: 2, orgulhoso: 0, cauteloso: 1 }, cost: 1 },
  { id: 'principios', icon: '📖', name: 'Apelar aos princípios', desc: 'Fala de valores, história e interesse público.', eff: { pragmatico: 0, idealista: 2, ganancioso: -1, orgulhoso: 1, cauteloso: 0 }, fx: { img: 0.4 } },
  { id: 'adiar', icon: '⏳', name: 'Pedir mais tempo', desc: 'Propõe uma pausa para pensar.', eff: { pragmatico: -1, idealista: 0, ganancioso: -1, orgulhoso: -1, cauteloso: 2 } },
]

// Falas de cada temperamento conforme o humor (hostil / neutro / favorável). {t} = assunto da reunião.
export const FALAS = {
  pragmatico: {
    hostil: ['Sem número fechado, {t} não anda. Isso está caro e mal explicado.', 'Eu preciso de resultado, e até agora só vi conversa sobre {t}.'],
    neutro: ['Dá para viabilizar {t}, desde que a conta feche.', 'Vamos separar o que é possível do que é discurso sobre {t}.'],
    favoravel: ['Tem um caminho bom aqui para {t}. Eu fecho se o prazo for realista.', 'Gostei: {t} faz sentido e cabe no orçamento.'],
  },
  idealista: {
    hostil: ['Não vou trair os meus princípios por causa de {t}.', 'Isso é conveniência, não é política pública. {t} merece mais.'],
    neutro: ['Preciso ver se {t} respeita quem mais depende disso.', 'Sou a favor, mas com garantias sobre {t}.'],
    favoravel: ['É por isso que eu acredito em {t}. Pode contar comigo.', 'Se for assim, {t} vale a briga. Estou dentro.'],
  },
  ganancioso: {
    hostil: ['O que eu ganho com {t}? Até agora, nada.', 'Outros já me ofereceram mais para {t}.'],
    neutro: ['Podemos conversar sobre {t}, mas tudo tem um preço.', 'Dependendo das condições, {t} sai.'],
    favoravel: ['Agora sim estamos falando a mesma língua sobre {t}.', 'Bom negócio. {t} está fechado do meu lado.'],
  },
  orgulhoso: {
    hostil: ['Eu não fui tratado como devia. {t} fica para depois.', 'Quem vocês pensam que eu sou? {t} não se decide assim.'],
    neutro: ['Eu mereço ser ouvido antes de qualquer decisão sobre {t}.', 'Estou aberto, mas {t} precisa ter a minha marca.'],
    favoravel: ['Fui respeitado. {t} tem o meu apoio e o meu nome.', 'Reconheço a boa-fé. Vamos de {t}.'],
  },
  cauteloso: {
    hostil: ['Isso é precipitado. {t} pode dar muito errado.', 'Não assino nada sobre {t} sem estudar os riscos.'],
    neutro: ['Prefiro ir devagar com {t} e testar antes.', 'Quais são os riscos de {t}? Ainda tenho dúvidas.'],
    favoravel: ['Com essas salvaguardas, {t} é seguro. Podemos avançar.', 'Estou mais tranquilo. {t} pode seguir.'],
  },
}

const P = (role, icon, trait, base = 0, extra = {}) => ({ role, icon, trait, base, ...extra })

// Parceiros e fictícios usados nas reuniões
export const FICTICIOS = [
  { id: 'karv', name: 'Karvênia', ico: '🛡️' },
  { id: 'vald', name: 'Valdória', ico: '⚔️' },
  { id: 'zand', name: 'Zandora', ico: '🏔️' },
]

// offs: cargos que recebem o convite. out: resultados (acordo / parcial / fracasso).
export const REUNIOES = [
  // ---------- partido ----------
  { id: 'p_executiva', icon: '🏢', title: 'Executiva do partido', tema: 'a coligação para a próxima eleição', offs: 'all', parts: [P('Presidente do partido', '🎙️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Tesoureiro', '💰', 'ganancioso', 0, { nome: 'auto' }), P('Ala jovem', '🌱', 'idealista', 0, { nome: 'auto' }), P('Veterano da legenda', '🧓', 'cauteloso', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A executiva fechou a coligação e liberou recursos para a sua campanha.', fx: { cong: 3, pop: 1, cash: 2 } }, parcial: { t: 'Saiu uma aliança tímida, sem dinheiro garantido.', fx: { cong: 1 } }, fracasso: { t: 'A reunião acabou em briga e parte do partido ameaça sair.', fx: { cong: -3, img: -1 } } } },
  { id: 'p_expulsao', icon: '⚖️', title: 'Conselho de ética do partido', tema: 'a expulsão de um filiado enrolado em escândalo', offs: 'all', parts: [P('O filiado acusado', '😬', 'orgulhoso', -1, { nome: 'auto' }), P('Corregedor', '📋', 'idealista', 1, { nome: 'auto' }), P('Líder da bancada', '🤝', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'O partido agiu com firmeza e saiu mais crível.', fx: { img: 3, cong: -1 } }, parcial: { t: 'Ele foi suspenso, mas ninguém ficou satisfeito.', fx: { img: 1 } }, fracasso: { t: 'O caso foi abafado e a imprensa cobrou o partido.', fx: { img: -3, pop: -1 } } } },
  { id: 'p_convencao', icon: '🎪', title: 'Convenção partidária', tema: 'a chapa e o discurso de abertura da campanha', offs: 'all', parts: [P('Presidente do partido', '🎙️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Marqueteiro', '🎬', 'pragmatico', 0, { nome: 'auto' }), P('Militante histórico', '✊', 'idealista', 1, { nome: 'auto' })],
    out: { acordo: { t: 'A convenção foi uma festa e a militância saiu empolgada.', fx: { pop: 3, cong: 2 } }, parcial: { t: 'Convenção morna, mas sem estragos.', fx: { pop: 1 } }, fracasso: { t: 'Vaias e rachas na convenção viraram manchete.', fx: { pop: -2, img: -2 } } } },
  // ---------- ONU e blocos ----------
  { id: 'o_assembleia', icon: '🇺🇳', title: 'Assembleia Geral da ONU', tema: 'uma resolução sobre clima e segurança alimentar', offs: ['presidente'], parts: [P('Secretário-geral', '🎖️', 'idealista', 1), P('Delegação de uma grande potência', '🏛️', 'orgulhoso', -1, { peso: 2 }), P('Delegação europeia', '🏰', 'cauteloso', 0), P('Delegação de um país pequeno', '🌴', 'ganancioso', 0)],
    out: { acordo: { t: 'A resolução passou e o Brasil foi aplaudido no plenário.', fx: { img: 4 }, rel: { onu: 8 } }, parcial: { t: 'Texto aprovado, mas esvaziado.', fx: { img: 1 }, rel: { onu: 3 } }, fracasso: { t: 'A resolução foi barrada e o Brasil saiu isolado.', fx: { img: -2 }, rel: { onu: -4 } } } },
  { id: 'o_cupula', icon: '🌐', title: 'Cúpula do seu bloco', tema: 'a agenda comum de comércio e investimentos', offs: ['presidente'], cond: 'blocos', parts: [P('Anfitrião da cúpula', '🎩', 'orgulhoso', 0, { peso: 2 }), P('Sócio comercial', '📦', 'pragmatico', 0), P('Sócio desconfiado', '🕵️', 'cauteloso', -1), P('Delegado de olho em contratos', '💼', 'ganancioso', 0)],
    out: { acordo: { t: 'A cúpula aprovou metas de comércio e o bloco saiu mais forte.', fx: { eco: 2.5, img: 2 } }, parcial: { t: 'Declaração final genérica, sem metas.', fx: { img: 1 } }, fracasso: { t: 'A cúpula terminou sem declaração conjunta.', fx: { img: -2, eco: -0.5 } } } },
  { id: 'o_observador', icon: '📨', title: 'Convite de um bloco internacional', tema: 'o Brasil entrar como observador do bloco', offs: ['presidente'], cond: 'semblocos', parts: [P('Secretário do bloco', '🗂️', 'pragmatico', 0), P('Embaixador anfitrião', '🎩', 'orgulhoso', 0, { peso: 2 }), P('Nosso chanceler', '🧳', 'cauteloso', 1)],
    out: { acordo: { t: 'O Brasil foi aceito como observador e ganhou novos parceiros.', fx: { img: 2, eco: 1 }, rel: { india: 4, afr: 4, lat: 4 } }, parcial: { t: 'Convite adiado para o próximo ano.', fx: { img: 0.5 } }, fracasso: { t: 'O convite foi retirado depois da reunião.', fx: { img: -1 } } } },
  // ---------- visitas ----------
  { id: 'v_chefe', icon: '🛬', title: 'Visita de chefe de governo', tema: 'um acordo bilateral e o apoio em uma votação internacional', offs: ['presidente', 'governador', 'senador'], parts: [P('Chefe da delegação', '🎩', 'orgulhoso', 0, { peso: 2 }), P('Ministro da economia visitante', '📈', 'ganancioso', 0), P('Nosso chanceler', '🧳', 'pragmatico', 1), P('Empresário da comitiva', '🏭', 'ganancioso', 0)], partner: true,
    out: { acordo: { t: 'A visita terminou com acordo assinado e fotos sorridentes.', fx: { eco: 2, cash: 1, img: 1.5 }, relP: 10 }, parcial: { t: 'A visita foi cordial, mas sem assinatura.', fx: { img: 0.5 }, relP: 4 }, fracasso: { t: 'A visita azedou e o país vai reavaliar a relação.', fx: { img: -1.5 }, relP: -5 } } },
  // ---------- indústrias ----------
  { id: 'i_fabrica', icon: '🏭', title: 'Uma empresa quer se instalar na cidade', tema: 'a instalação da fábrica e o pacote de incentivos', offs: ['vereador', 'prefeito'], locais: [{ id: 'industrial', label: 'Distrito industrial', eff: { pragmatico: 1, cauteloso: 1, idealista: -1 } }, { id: 'centro', label: 'Perto do centro', eff: { ganancioso: 1, cauteloso: -1 } }, { id: 'periferia', label: 'Periferia carente', eff: { idealista: 1, pragmatico: 0, ganancioso: -1 } }], parts: [P('Dono da empresa', '🏭', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Líder sindical', '🔧', 'idealista', 0, { nome: 'auto' }), P('Associação de moradores', '🏘️', 'cauteloso', -1, { nome: 'auto' }), P('Secretário da Fazenda', '🧾', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A fábrica vai abrir na cidade e deve gerar empregos por anos.', fx: { eco: 3, pop: 3, soc: 1, cash: -1 }, ind: { nome: 'Fábrica instalada na cidade', left: 10, fx: { eco: 0.3, pop: 0.2 } } }, parcial: { t: 'Uma unidade menor será instalada.', fx: { eco: 1, pop: 1 }, ind: { nome: 'Unidade pequena na cidade', left: 6, fx: { eco: 0.15 } } }, fracasso: { t: 'A empresa desistiu e levou o investimento para a cidade vizinha.', fx: { pop: -1.5, eco: -0.5 } } } },
  { id: 'i_polo', icon: '🏗️', title: 'Montadora e data center escolhem o estado', tema: 'o polo industrial e o pacote de incentivos fiscais', offs: ['governador', 'dep_estadual'], locais: [{ id: 'litoral', label: 'Litoral (porto e energia)', eff: { pragmatico: 1, idealista: -2 } }, { id: 'interior', label: 'Interior (terra barata)', eff: { cauteloso: 1, ganancioso: 1 } }, { id: 'metropole', label: 'Região metropolitana', eff: { orgulhoso: 1, idealista: -1, cauteloso: -1 } }], parts: [P('Diretor da multinacional', '🏢', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Ambientalista', '🌳', 'idealista', -1, { nome: 'auto' }), P('Prefeito do interior', '🏛️', 'cauteloso', 0, { nome: 'auto' }), P('Sindicalista', '🔧', 'pragmatico', 1, { nome: 'auto' })],
    out: { acordo: { t: 'O polo vai para o estado, com milhares de empregos e obras.', fx: { eco: 4, pop: 2, img: -0.5, cash: -1.5 }, ind: { nome: 'Polo industrial do estado', left: 12, fx: { eco: 0.45, pop: 0.2 } } }, parcial: { t: 'A empresa fica, mas com um projeto reduzido.', fx: { eco: 1.5, pop: 1 }, ind: { nome: 'Projeto industrial reduzido', left: 8, fx: { eco: 0.2 } } }, fracasso: { t: 'O investimento foi para outro estado, e a oposição cobrou.', fx: { eco: -1, pop: -1.5, img: -1 } } } },
  { id: 'i_mega', icon: '🛰️', title: 'Megaprojeto de investimento estrangeiro', tema: 'um complexo de chips, data centers e energia limpa', offs: ['presidente'], parts: [P('Investidor estrangeiro', '💵', 'ganancioso', 0, { peso: 2 }), P('Ministro da economia', '📈', 'pragmatico', 1), P('Governador do estado sede', '🏛️', 'orgulhoso', 0), P('Ambientalista', '🌳', 'idealista', -1)],
    out: { acordo: { t: 'O megaprojeto foi anunciado e o país entrou no mapa dos investimentos.', fx: { eco: 5, img: 2, cash: -2 }, ind: { nome: 'Megaprojeto nacional', left: 14, fx: { eco: 0.6, img: 0.1 } } }, parcial: { t: 'Só a primeira fase do projeto sai do papel.', fx: { eco: 2, img: 0.5 }, ind: { nome: 'Primeira fase do megaprojeto', left: 8, fx: { eco: 0.3 } } }, fracasso: { t: 'O investidor cancelou o anúncio na última hora.', fx: { eco: -1, img: -2 } } } },
  // ---------- tecnologia ----------
  { id: 't_startup', icon: '💡', title: 'Cientistas e startups apresentam um projeto', tema: 'uma tecnologia nova e o financiamento da pesquisa', offs: ['governador', 'presidente'], parts: [P('Pesquisadora', '🔬', 'idealista', 1, { nome: 'auto' }), P('Investidor de risco', '💼', 'ganancioso', 0, { nome: 'auto' }), P('Secretário de ciência', '🎓', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'O projeto foi aprovado e já rende avanço na pesquisa.', fx: { img: 1.5, cash: -1 }, tech: 45 }, parcial: { t: 'Um piloto pequeno foi aprovado.', fx: { img: 0.5 }, tech: 20 }, fracasso: { t: 'O projeto naufragou, e os pesquisadores foram para o exterior.', fx: { img: -1, eco: -0.3 } } } },
  { id: 't_espionagem', icon: '🕵️', title: 'Alerta de espionagem industrial', tema: 'o vazamento de pesquisas e a proteção dos laboratórios', offs: ['presidente', 'governador'], cond: 'tech', parts: [P('Diretor da inteligência', '🕶️', 'cauteloso', 0, { nome: 'auto' }), P('Diretor do laboratório', '🧪', 'orgulhoso', 0, { nome: 'auto' }), P('Diplomata', '🧳', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'Os laboratórios foram blindados e o espião foi preso.', fx: { seg: 2, img: 1.5 } }, parcial: { t: 'Reforçou-se a segurança, mas parte dos dados vazou.', fx: { seg: 1 }, vaza: 8 }, fracasso: { t: 'A pesquisa vazou e um concorrente lançou antes de você.', fx: { img: -1.5, eco: -0.5 }, vaza: 25 } } },
  // ---------- segurança e pactos ----------
  { id: 's_ameaca', icon: '🚨', title: 'Ameaça na fronteira', tema: 'a mobilização de tropas do país vizinho', offs: ['presidente'], fict: true, parts: [P('Embaixador do país vizinho', '🎩', 'orgulhoso', -1, { peso: 2 }), P('General do Estado-Maior', '🎖️', 'cauteloso', 0), P('Nosso chanceler', '🧳', 'pragmatico', 0), P('Representante da ONU', '🇺🇳', 'idealista', 1)],
    out: { acordo: { t: 'A tropa recuou e a crise virou palanque de paz.', fx: { seg: 2, img: 2.5, pop: 1 } }, parcial: { t: 'A tensão baixou, mas os dois lados seguem armados.', fx: { seg: 0.5, cash: -0.5 } }, fracasso: { t: 'A negociação falhou e as tropas ficaram frente a frente.', fx: { seg: -3, pop: -1.5, cash: -1 }, fa: 3 } } },
  { id: 's_pacto', icon: '🛡️', title: 'Pacto de defesa mútua', tema: 'uma aliança em que um ataque a um é um ataque a todos', offs: ['presidente'], cond: 'pactoLivre', partner: true, parts: [P('Embaixador parceiro', '🎩', 'orgulhoso', 0, { peso: 2 }), P('Ministro da Defesa', '🎖️', 'cauteloso', 0), P('Líder da oposição', '📣', 'idealista', -1), P('General de confiança', '⭐', 'cauteloso', 0)],
    out: { acordo: { t: 'O pacto foi assinado: o país ganha proteção, mas assume um compromisso.', fx: { seg: 2, img: 1 }, relP: 8, pacto: 'defesa' }, parcial: { t: 'Fechou-se só um pacto de não agressão.', fx: { seg: 0.8 }, relP: 4, pacto: 'naoagressao' }, fracasso: { t: 'A negociação emperrou e o parceiro esfriou.', fx: { img: -0.5 }, relP: -3 } } },
  { id: 's_chamado', icon: '📞', title: 'Aliado pede ajuda militar', tema: 'o apoio do Brasil a um parceiro sob ataque', offs: ['presidente'], cond: 'pacto', parts: [P('Embaixador do aliado', '🎩', 'orgulhoso', 0, { peso: 2 }), P('Chefe do Estado-Maior', '🎖️', 'cauteloso', -1), P('Líder da oposição', '📣', 'idealista', -1), P('Chanceler', '🧳', 'pragmatico', 0)], partner: true,
    out: { acordo: { t: 'Você enviou apoio logístico e evitou entrar na guerra. O aliado agradeceu.', fx: { img: 2, pop: -0.5, cash: -1 }, relP: 8 }, parcial: { t: 'Apoio simbólico: o aliado entendeu, mas ficou frio.', fx: { img: 0.5 }, relP: 2 }, fracasso: { t: 'O Brasil negou ajuda e o pacto perdeu o valor. Ninguém mais confia na palavra do país.', fx: { img: -3, seg: -1 }, relP: -10, quebraPacto: true } } },
  // ---------- território e política ----------
  { id: 'm_bairro', icon: '🏘️', title: 'Reunião com moradores e construtora', tema: 'um empreendimento que muda a cara do bairro', offs: ['vereador', 'prefeito'], parts: [P('Presidente da associação de moradores', '🏘️', 'idealista', -1, { nome: 'auto' }), P('Dono da construtora', '🏗️', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Comerciante local', '🛍️', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'O projeto foi ajustado: ninguém ganhou tudo, mas todos saíram satisfeitos.', fx: { pop: 3, eco: 1, img: 1 } }, parcial: { t: 'Metade do bairro gostou.', fx: { pop: 1 } }, fracasso: { t: 'Protesto na porta da prefeitura.', fx: { pop: -2, img: -1 } } } },
  { id: 'e_bancada', icon: '🏛️', title: 'Reunião de bancada estadual', tema: 'o pacote do governo estadual e as emendas', offs: ['dep_estadual', 'governador'], parts: [P('Líder do governo', '🎖️', 'pragmatico', 1, { nome: 'auto' }), P('Líder da oposição', '📣', 'orgulhoso', -1, { nome: 'auto' }), P('Prefeito do interior', '🏘️', 'ganancioso', 0, { nome: 'auto' }), P('Deputado independente', '🕊️', 'idealista', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A bancada fechou apoio e as emendas saíram.', fx: { cong: 3, pop: 1 } }, parcial: { t: 'Metade da bancada acompanhou.', fx: { cong: 1 } }, fracasso: { t: 'A votação foi adiada e o clima azedou.', fx: { cong: -2.5, img: -0.5 } } } },
  { id: 'f_lideres', icon: '🤝', title: 'Reunião com os líderes de bancada', tema: 'a pauta prioritária do semestre no Congresso', offs: ['presidente', 'dep_federal', 'senador'], parts: [P('Líder do maior partido', '🎖️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Líder do centrão', '🤝', 'ganancioso', 0, { nome: 'auto' }), P('Líder da oposição', '📣', 'idealista', -1, { nome: 'auto' }), P('Presidente da Casa', '🏛️', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A pauta foi acertada e a base ficou alinhada.', fx: { cong: 3.5, img: 0.5 } }, parcial: { t: 'Acordo parcial, com cobranças por cargos.', fx: { cong: 1.5, cash: -0.5 } }, fracasso: { t: 'Sem acordo, a pauta travou no plenário.', fx: { cong: -3, pop: -0.5 } } } },
  { id: 'g_prefeitos', icon: '🏘️', title: 'Consórcio de prefeitos', tema: 'obras regionais e repasses do estado', offs: ['governador', 'dep_estadual'], parts: [P('Prefeito da capital', '🏙️', 'orgulhoso', 0, { nome: 'auto' }), P('Prefeito do interior', '🌾', 'ganancioso', 0, { nome: 'auto' }), P('Prefeita de cidade pequena', '🏡', 'cauteloso', 0, { nome: 'auto' })],
    out: { acordo: { t: 'O consórcio saiu e as obras regionais ganharam cronograma.', fx: { pop: 2.5, eco: 1, cash: -1 } }, parcial: { t: 'Ficou um compromisso genérico.', fx: { pop: 1 } }, fracasso: { t: 'Os prefeitos saíram reclamando da falta de recursos.', fx: { pop: -1.5, cong: -1 } } } },
  { id: 'x_reconciliar', icon: '🤝', title: 'Conversa com um antigo aliado', tema: 'reconstruir uma aliança que se rompeu', offs: 'all', cond: 'exaliado', parts: [P('Antigo aliado', '💔', 'orgulhoso', -1, { peso: 2, nome: 'exaliado' }), P('Amigo em comum', '🍻', 'pragmatico', 1, { nome: 'auto' }), P('Jornalista que cobre a história', '🎤', 'cauteloso', 0, { nome: 'auto' })],
    out: { acordo: { t: 'Vocês fizeram as pazes e a base agradeceu.', fx: { cong: 3, img: 1 } }, parcial: { t: 'Uma trégua frágil, sem foto juntos.', fx: { cong: 1 } }, fracasso: { t: 'A conversa vazou e piorou o clima entre os dois.', fx: { img: -2, cong: -1.5 } } } },
]

// BLOCO 32: mais reuniões avulsas
REUNIOES.push(
  { id: 'u_universidade', icon: '🎓', title: 'Reitores e pesquisadores', tema: 'o orçamento das universidades e da pesquisa', offs: ['governador', 'presidente', 'dep_federal', 'senador'], parts: [P('Reitora', '🏫', 'idealista', 1, { nome: 'auto' }), P('Pesquisador sênior', '🔬', 'cauteloso', 0, { nome: 'auto' }), P('Secretário da Fazenda', '🧾', 'ganancioso', -1, { peso: 2, nome: 'auto' })],
    out: { acordo: { t: 'O orçamento da pesquisa foi preservado e o meio acadêmico elogiou.', fx: { soc: 1.5, img: 1.5, cash: -1 } }, parcial: { t: 'Houve corte parcial, com promessa de recomposição.', fx: { soc: 0.5 } }, fracasso: { t: 'O corte saiu e as universidades protestaram.', fx: { soc: -1.5, img: -1 } } } },
  { id: 'a_agro', icon: '🌾', title: 'Frente do agro', tema: 'crédito rural e a pauta de exportações', offs: ['governador', 'presidente', 'dep_federal', 'senador'], parts: [P('Presidente da federação rural', '🚜', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Pequeno produtor', '🧑‍🌾', 'cauteloso', 0, { nome: 'auto' }), P('Ambientalista', '🌳', 'idealista', -1, { nome: 'auto' })],
    out: { acordo: { t: 'O pacote do crédito rural saiu com salvaguardas ambientais.', fx: { eco: 2.5, cong: 1.5, img: 0.5 } }, parcial: { t: 'Metade do pacote avançou.', fx: { eco: 1 } }, fracasso: { t: 'A frente rompeu e as exportações ficaram no ar.', fx: { eco: -1, cong: -1.5 } } } },
  { id: 'h_hospital', icon: '🏥', title: 'Diretores de hospitais', tema: 'a fila de cirurgias e os leitos de UTI', offs: ['prefeito', 'governador', 'presidente'], parts: [P('Diretora de hospital', '🏥', 'idealista', 0, { nome: 'auto' }), P('Secretário de Saúde', '🩺', 'pragmatico', 0, { peso: 2, nome: 'auto' }), P('Representante dos médicos', '👨‍⚕️', 'orgulhoso', -1, { nome: 'auto' })],
    out: { acordo: { t: 'O mutirão de cirurgias foi acertado e a fila começou a cair.', fx: { soc: 2.5, pop: 1.5, cash: -1 } }, parcial: { t: 'Um mutirão menor foi aprovado.', fx: { soc: 1, pop: 0.5 } }, fracasso: { t: 'Os médicos ameaçaram paralisação e o diálogo travou.', fx: { soc: -2, pop: -1 } } } },
  { id: 'r_religiosos', icon: '⛪', title: 'Lideranças religiosas', tema: 'ação social e o diálogo com as comunidades de fé', offs: 'all', parts: [P('Padre da paróquia', '⛪', 'cauteloso', 0, { nome: 'auto' }), P('Pastor de grande igreja', '🕊️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Liderança de religião de matriz africana', '🕯️', 'idealista', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A parceria em ações sociais foi bem recebida por todas as comunidades.', fx: { pop: 2.5, soc: 1, img: 1 } }, parcial: { t: 'Cada comunidade saiu com uma promessa diferente.', fx: { pop: 1 } }, fracasso: { t: 'Uma fala mal colocada ofendeu uma das comunidades.', fx: { pop: -1.5, img: -1.5 } } } },
  { id: 'j_juventude', icon: '🎒', title: 'Conselho da juventude', tema: 'emprego, primeiro trabalho e transporte', offs: 'all', parts: [P('Presidente do grêmio estudantil', '🎒', 'idealista', 1, { nome: 'auto' }), P('Jovem empreendedor', '💡', 'pragmatico', 0, { nome: 'auto' }), P('Jovem da periferia', '🏘️', 'cauteloso', -1, { nome: 'auto' })],
    out: { acordo: { t: 'O programa do primeiro emprego saiu com apoio dos jovens.', fx: { pop: 2, eco: 1, soc: 0.5 } }, parcial: { t: 'A conversa foi boa, mas ficou só no papel.', fx: { pop: 0.8 } }, fracasso: { t: 'Os jovens saíram achando que foi só foto.', fx: { pop: -1.5, img: -1 } } } },
  { id: 'c_empreiteiras', icon: '🏗️', title: 'Empreiteiras e licitações', tema: 'as regras de uma grande obra pública', offs: ['prefeito', 'governador', 'presidente'], parts: [P('Dono de empreiteira', '🏗️', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Procurador de contas', '📋', 'idealista', -1, { nome: 'auto' }), P('Secretário de obras', '🧱', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A licitação saiu limpa e com preço abaixo do previsto.', fx: { eco: 1.5, img: 2, cash: 1 } }, parcial: { t: 'A obra saiu, mas com aditivo suspeito.', fx: { eco: 1, img: -0.5 } }, fracasso: { t: 'A obra foi suspensa por suspeita de cartel.', fx: { img: -2.5, eco: -1 } } } },
  { id: 'n_ongs', icon: '🤲', title: 'Organizações da sociedade civil', tema: 'parcerias e fiscalização de repasses', offs: 'all', parts: [P('Diretora de ONG', '🤲', 'idealista', 1, { nome: 'auto' }), P('Fiscal de contas', '🔍', 'cauteloso', 0, { nome: 'auto' }), P('Empresário apoiador', '💼', 'ganancioso', 0, { nome: 'auto' })],
    out: { acordo: { t: 'As parcerias foram transparentes e viraram vitrine.', fx: { soc: 1.5, img: 1.5 } }, parcial: { t: 'Metade das parcerias seguiu.', fx: { soc: 0.5 } }, fracasso: { t: 'Uma ONG foi acusada de desvio e a imagem respingou.', fx: { img: -1.5, soc: -0.5 } } } },
  { id: 'v_vizinho', icon: '🛂', title: 'Vizinhos pedem refúgio', tema: 'a política para refugiados na fronteira', offs: ['presidente', 'governador'], parts: [P('Representante da agência de refugiados', '🇺🇳', 'idealista', 1, { nome: 'auto' }), P('Prefeito de cidade de fronteira', '🏘️', 'cauteloso', -1, { nome: 'auto' }), P('Ministro da Segurança', '🛡️', 'pragmatico', 0, { peso: 2, nome: 'auto' })],
    out: { acordo: { t: 'O acolhimento organizado foi elogiado e não houve caos.', fx: { img: 2, soc: 1, seg: 0.5 } }, parcial: { t: 'Um acolhimento limitado foi acertado.', fx: { img: 0.5 } }, fracasso: { t: 'A falta de plano gerou tensão nas fronteiras.', fx: { seg: -1.5, img: -1.5, pop: -0.5 } } } },
)

// BLOCO 25: crises em cadeia. Cada passo é uma reunião; o saldo de acordos decide o desfecho final.
export const CADEIAS = {
  escandalo: {
    icon: '🗞️', nome: 'Crise do escândalo', gatilho: 'Um escândalo ganhou as manchetes e vai passar pelo partido, pela imprensa e pelo tribunal.',
    passos: ['c_esc_partido', 'c_esc_imprensa', 'c_esc_tribunal'],
    fim: {
      bom: { t: 'Você atravessou o escândalo e saiu com a imagem intacta.', fx: { img: 3, pop: 1 } },
      medio: { t: 'O escândalo foi se arrastando e deixou arranhões.', fx: { img: -1 } },
      ruim: { t: 'O escândalo explodiu e virou a pauta do país.', fx: { img: -4, pop: -2, cong: -2 } },
    },
  },
  greve: {
    icon: '✊', nome: 'Crise da greve geral', gatilho: 'Uma greve geral ameaça parar o país e vai passar pelos sindicatos, pelos empresários e pelo Congresso.',
    passos: ['c_gg_sindicatos', 'c_gg_patroes', 'c_gg_congresso'],
    fim: {
      bom: { t: 'O pacto social encerrou a greve e o país voltou a funcionar.', fx: { pop: 2, eco: 2, img: 1 } },
      medio: { t: 'A greve acabou sem acordo claro e o desgaste ficou.', fx: { eco: -1, pop: -1 } },
      ruim: { t: 'A greve geral paralisou o país e o governo saiu enfraquecido.', fx: { eco: -3, pop: -3, cong: -2 } },
    },
  },
  apagao: {
    icon: '💡', nome: 'Crise do apagão', gatilho: 'Um apagão atingiu várias regiões e vai passar pela empresa de energia, pela indústria e pelo Congresso.',
    passos: ['c_ap_empresa', 'c_ap_industria', 'c_ap_congresso'],
    fim: {
      bom: { t: 'A energia voltou e você assumiu a coordenação da resposta.', fx: { eco: 1.5, img: 2, pop: 1 } },
      medio: { t: 'O apagão foi contornado, mas as perdas ficaram.', fx: { eco: -1, img: -0.5 } },
      ruim: { t: 'O apagão se repetiu e virou símbolo de má gestão.', fx: { eco: -3, img: -3, pop: -2 } },
    },
  },
  conspiracao: {
    icon: '🕸️', nome: 'Desdobramento da conspiração', gatilho: 'A conspiração foi exposta e a inteligência, o partido e o plenário querem explicações.',
    passos: ['c_co_inteligencia', 'c_co_partido', 'c_co_plenario'],
    fim: {
      bom: { t: 'Os envolvidos foram afastados e a teia foi desmontada de vez.', fx: { img: 3, cong: 2 } },
      medio: { t: 'A teia foi cortada, mas parte do grupo escapou.', fx: { img: 0.5 } },
      ruim: { t: 'A defesa dos conspiradores virou o jogo e você foi acusado de perseguição.', fx: { img: -3, cong: -2 } },
    },
  },
}

REUNIOES.push(
  { id: 'c_esc_partido', cadeia: true, icon: '🏢', title: 'Reunião de emergência no partido', tema: 'como o partido vai reagir ao escândalo', offs: 'all',
    parts: [P('Presidente do partido', '🎙️', 'orgulhoso', -1, { peso: 2, nome: 'auto' }), P('Líder da bancada', '🏛️', 'pragmatico', 0, { nome: 'auto' }), P('Ala jovem', '🌱', 'idealista', -1, { nome: 'auto' })],
    out: { acordo: { t: 'O partido fechou questão em sua defesa.', fx: { cong: 2 } }, parcial: { t: 'O partido ficou em cima do muro.', fx: {} }, fracasso: { t: 'O partido deixou você sozinho.', fx: { cong: -2 } } } },
  { id: 'c_esc_imprensa', cadeia: true, icon: '🎤', title: 'Coletiva com a imprensa', tema: 'as respostas sobre o escândalo', offs: 'all',
    parts: [P('Colunista político', '📰', 'orgulhoso', -1, { peso: 2, nome: 'auto' }), P('Repórter investigativo', '🔍', 'idealista', -1, { nome: 'auto' }), P('Âncora de TV', '📺', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A coletiva virou a página e a cobertura esfriou.', fx: { img: 1.5 } }, parcial: { t: 'A imprensa seguiu cobrando, sem novidades.', fx: {} }, fracasso: { t: 'Uma resposta mal dada virou manchete.', fx: { img: -2 } } } },
  { id: 'c_esc_tribunal', cadeia: true, icon: '⚖️', title: 'Audiência no tribunal', tema: 'o inquérito aberto sobre o escândalo', offs: 'all',
    parts: [P('Ministro relator', '👨‍⚖️', 'cauteloso', 0, { peso: 2, nome: 'auto' }), P('Promotor', '📜', 'idealista', -1, { nome: 'auto' }), P('Seu advogado', '🧑‍💼', 'ganancioso', 1, { nome: 'auto' })],
    out: { acordo: { t: 'O relator arquivou a parte mais grave.', fx: { img: 1.5 } }, parcial: { t: 'O caso segue, mas sem prisão.', fx: {} }, fracasso: { t: 'O relator abriu processo formal.', fx: { img: -2, cong: -1 } } } },
  { id: 'c_gg_sindicatos', cadeia: true, icon: '✊', title: 'Mesa com as centrais sindicais', tema: 'a pauta da greve geral', offs: 'all',
    parts: [P('Presidente da central', '📣', 'orgulhoso', -1, { peso: 2, nome: 'auto' }), P('Líder dos metalúrgicos', '🔧', 'pragmatico', 0, { nome: 'auto' }), P('Líder dos professores', '📚', 'idealista', -1, { nome: 'auto' })],
    out: { acordo: { t: 'Os sindicatos aceitaram negociar e suspenderam o bloqueio.', fx: { pop: 1 } }, parcial: { t: 'Saiu uma trégua curta.', fx: {} }, fracasso: { t: 'Os sindicatos endureceram o discurso.', fx: { pop: -1.5 } } } },
  { id: 'c_gg_patroes', cadeia: true, icon: '🏦', title: 'Reunião com os empresários', tema: 'quem paga a conta do acordo', offs: 'all',
    parts: [P('Presidente da federação industrial', '🏭', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Dono de rede de varejo', '🏪', 'pragmatico', 0, { nome: 'auto' }), P('Banqueiro', '💰', 'cauteloso', -1, { nome: 'auto' })],
    out: { acordo: { t: 'Os empresários toparam dividir o custo.', fx: { eco: 1 } }, parcial: { t: 'Aceitaram só uma parte.', fx: {} }, fracasso: { t: 'Os empresários ameaçaram demissões.', fx: { eco: -1.5 } } } },
  { id: 'c_gg_congresso', cadeia: true, icon: '🏛️', title: 'Votação do pacote no Congresso', tema: 'o pacote que encerra a greve', offs: 'all',
    parts: [P('Presidente da Casa', '🎖️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Líder da oposição', '🥊', 'idealista', -1, { nome: 'auto' }), P('Líder do centrão', '🤝', 'ganancioso', 0, { nome: 'auto' })],
    out: { acordo: { t: 'O Congresso aprovou o pacote em votação rápida.', fx: { cong: 1.5 } }, parcial: { t: 'O pacote passou desidratado.', fx: {} }, fracasso: { t: 'O pacote travou no plenário.', fx: { cong: -2 } } } },
)

// BLOCO 32: passos das cadeias do apagão e da conspiração
REUNIOES.push(
  { id: 'c_ap_empresa', cadeia: true, icon: '⚡', title: 'Reunião com a empresa de energia', tema: 'as causas do apagão e o plano de religação', offs: 'all',
    parts: [P('Presidente da empresa de energia', '⚡', 'orgulhoso', -1, { peso: 2, nome: 'auto' }), P('Engenheiro-chefe', '🔧', 'cauteloso', 1, { nome: 'auto' }), P('Diretor de regulação', '📋', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'A empresa assumiu o erro e religou as áreas mais críticas.', fx: { eco: 0.8, img: 1 } }, parcial: { t: 'A religação saiu, mas sem prazo claro.', fx: {} }, fracasso: { t: 'A empresa jogou a culpa no governo.', fx: { img: -1.5 } } } },
  { id: 'c_ap_industria', cadeia: true, icon: '🏭', title: 'Reunião com a indústria', tema: 'as perdas das fábricas e o racionamento', offs: 'all',
    parts: [P('Presidente da federação industrial', '🏭', 'ganancioso', 0, { peso: 2, nome: 'auto' }), P('Dono de siderúrgica', '🔩', 'orgulhoso', 0, { nome: 'auto' }), P('Líder sindical', '🔧', 'idealista', 1, { nome: 'auto' })],
    out: { acordo: { t: 'A indústria aceitou um revezamento sem demissões.', fx: { eco: 1.2, pop: 0.8 } }, parcial: { t: 'O revezamento foi aceito com cobranças.', fx: { eco: 0.4 } }, fracasso: { t: 'As fábricas ameaçaram parar e demitir.', fx: { eco: -1.5, pop: -1 } } } },
  { id: 'c_ap_congresso', cadeia: true, icon: '🏛️', title: 'Votação da medida emergencial', tema: 'o crédito extraordinário para a energia', offs: 'all',
    parts: [P('Presidente da Casa', '🎖️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Relator', '📜', 'pragmatico', 0, { nome: 'auto' }), P('Líder da oposição', '🥊', 'idealista', -1, { nome: 'auto' })],
    out: { acordo: { t: 'A medida foi aprovada em votação rápida.', fx: { cong: 1.5, eco: 0.5 } }, parcial: { t: 'A medida passou desidratada.', fx: { cong: 0.3 } }, fracasso: { t: 'A votação travou e o apagão voltou.', fx: { cong: -1.5, pop: -1 } } } },
  { id: 'c_co_inteligencia', cadeia: true, icon: '🕶️', title: 'Reunião com a inteligência', tema: 'as provas contra a conspiração', offs: 'all',
    parts: [P('Diretor da inteligência', '🕶️', 'cauteloso', 0, { peso: 2, nome: 'auto' }), P('Delegado da Polícia Federal', '🛂', 'idealista', 1, { nome: 'auto' }), P('Seu advogado', '🧑‍💼', 'pragmatico', 0, { nome: 'auto' })],
    out: { acordo: { t: 'As provas foram consolidadas e a perícia confirmou tudo.', fx: { img: 1.5 } }, parcial: { t: 'Parte das provas foi aceita.', fx: {} }, fracasso: { t: 'Parte das provas foi anulada por irregularidade.', fx: { img: -1.5 } } } },
  { id: 'c_co_partido', cadeia: true, icon: '🏢', title: 'Reunião com a cúpula do partido', tema: 'o afastamento dos envolvidos na conspiração', offs: 'all',
    parts: [P('Presidente do partido', '🎙️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Líder da bancada', '🏛️', 'pragmatico', 0, { nome: 'auto' }), P('Ala jovem', '🌱', 'idealista', 1, { nome: 'auto' })],
    out: { acordo: { t: 'O partido afastou os envolvidos e fechou com você.', fx: { cong: 2, img: 1 } }, parcial: { t: 'O partido ficou dividido, mas sem rompimento.', fx: { cong: 0.5 } }, fracasso: { t: 'O partido protegeu os envolvidos.', fx: { cong: -2 } } } },
  { id: 'c_co_plenario', cadeia: true, icon: '🏛️', title: 'Sessão no plenário', tema: 'a votação das medidas contra a conspiração', offs: 'all',
    parts: [P('Presidente da Casa', '🎖️', 'orgulhoso', 0, { peso: 2, nome: 'auto' }), P('Relator', '📜', 'cauteloso', 0, { nome: 'auto' }), P('Líder da oposição', '🥊', 'idealista', -1, { nome: 'auto' })],
    out: { acordo: { t: 'O plenário aprovou as medidas por ampla maioria.', fx: { cong: 2, img: 1.5 } }, parcial: { t: 'As medidas passaram com ressalvas.', fx: { cong: 0.5 } }, fracasso: { t: 'O plenário rejeitou as medidas e o assunto ficou aberto.', fx: { cong: -1.5, img: -1 } } } },
)
