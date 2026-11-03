// Madeira Negra: o terceiro mundo, adaptado da Linha do Tempo de "Sobre Espadas e Dragões".
// Passa-se no ano em que os Cruzados de Agalor se tornam Andarilhos Fantasmas e os cinco ovos da Lâmina voltam a ser procurados.
// Os nomes do livro "O Império da Espada" têm precedência: Szar e Raizobak.

// ---------- Só na Madeira Negra ----------

RACAS.tiefling.foraDe.push('madeira');
Object.assign(RACAS, {
  orc: { nome: 'Orc', mundo: 'madeira', glyph: 'axe', attrs: { forca: 2 }, desc: 'De Trunfisk, e fala com a voz dos Mão-de-Aço. +2 Força.' },
});
Object.assign(CARTAS_UNICAS.raca, {
  orc: { t: 'Os Mestres da Brutalidade', d: 'Só Orcs. Basta dizer quem o ensinou.', tipo: 'social', ok: { txt: 'Fala nos velhos Korlash e Krusk, e os ombros à sua volta descem um pouco. Ninguém em Trunfisk quer explicar-lhes uma desfeita. Oferecem-lhe caminho e carne.', fx: { ouro: 5, vida: 2, xp: 2 } } },
});

Object.assign(ANTECEDENTES, {
  punhos: { nome: 'Noviço dos Punhos Flamejantes', mundo: 'madeira', glyph: 'fist', attrs: { agilidade: 1 }, vida: 1, desc: 'Foi treinado por Altrair Szar, e conheceu os três filhos. +1 Agilidade, +1 Vida.' },
  soldado_agalor: { nome: 'Soldado de Agalor', mundo: 'madeira', glyph: 'shield', attrs: { forca: 1 }, ouro: 3, desc: 'A sua avó nasceu debaixo da redoma do escudo. +1 Força, +3 Ouro.' },
  batedor_elfo: { nome: 'Batedor de Karpulsa', mundo: 'madeira', glyph: 'eye', attrs: { mente: 1 }, xp: 3, desc: 'Os Salazar pagam-lhe para olhar, e para não comentar. +1 Mente e começa com 3 XP.' },
});
Object.assign(CARTAS_UNICAS.bg, {
  punhos: { t: 'A Paz e o Punho', d: 'Requer Noviço dos Punhos Flamejantes. Respira, e fecha a mão.', tipo: 'habilidade', ok: { txt: 'O gesto é o primeiro que Altrair ensina, e o único que nunca acaba de se aprender. Tudo à sua volta fica mais lento.', fx: { vida: 3, xp: 3 } } },
  soldado_agalor: { t: 'Pelo Norte!', d: 'Requer Soldado de Agalor. Ainda há quem responda.', tipo: 'social', ok: { txt: 'O grito sai-lhe sem querer, e dois homens que não conhece põem-se a seu lado. Quem vinha para o roubar decide que hoje não.', fx: { ouro: 6, xp: 2 } } },
  batedor_elfo: { t: 'Já Tinha Visto', d: 'Requer Batedor de Karpulsa. Viu primeiro, como sempre.', tipo: 'investigacao', ok: { txt: 'Deixa cair o que estava a fazer, e aponta para o ramo certo. Ninguém ali sabia que estava a ser observado, até agora.', fx: { xp: 5, ouro: 2 } } },
});

Object.assign(ITENS, {
  mn_machado: { nome: 'Machado de Trunfisk', mundo: 'madeira', slot: 'arma', perfil: 'pesada', preco: 20, dado: 'd10', a: 'forca', attrs: { agilidade: -1 }, glyph: 'axe', desc: 'Ataca com Força. Foi feito para um braço maior do que o seu. Dado d10, -1 Agilidade.' },
  mn_arco: { nome: 'Arco de Karpulsa', mundo: 'madeira', slot: 'arma', perfil: 'arco', preco: 18, dado: 'd8', a: 'agilidade', attrs: { mente: 1 }, glyph: 'bow', desc: 'Ataca com Agilidade. Madeira que ainda cresce quando chove. Dado d8, +1 Mente.' },
  mn_faixa: { nome: 'Faixa dos Punhos', mundo: 'madeira', slot: 'armadura', preco: 15, ca: 1, attrs: { agilidade: 1, forca: 1 }, glyph: 'fist', desc: 'Vermelha, e dada só a quem passou o Santuário. +1 CA, +1 Agilidade, +1 Força.' },
  mn_peitoral: { nome: 'Peitoral de Agalor', mundo: 'madeira', slot: 'armadura', perfil: 'malha', preco: 24, ca: 4, attrs: { agilidade: -1 }, glyph: 'shield', desc: 'Com o sol dos Raizobak gravado no peito. +4 CA, -1 Agilidade.' },
  mn_folha: { nome: 'Folha da Uillyh', mundo: 'madeira', slot: 'acessorio', preco: 15, attrs: { mente: 1, carisma: 1 }, glyph: 'leaf', desc: 'Negra, e nunca seca. Os halflings dão-nas a quem nasce. +1 Mente, +1 Carisma.' },
});

Object.assign(ALIADOS, {
  olares: { nome: 'Olares Salazar', desc: 'Feiticeira, e lidera quem procura os ovos. +2 em Investigação.', tipo: { investigacao: 2 } },
  tiago: { nome: 'Tiago Raizobak', desc: 'O último Cruzado de Agalor. +2 em Combate, +2 Vida máxima.', tipo: { combate: 2 }, vidaMax: 2 },
  ziul: { nome: 'Ziul Leng Thran', desc: 'Elfo druida de Karpulsa. +1 em Investigação, +3 Vida máxima.', tipo: { investigacao: 1 }, vidaMax: 3 },
  william: { nome: 'William Wallace', desc: 'Paladino de Agalor, e nunca foge. +1 em Combate e Social.', tipo: { combate: 1, social: 1 } },
  robert: { nome: 'Robert', desc: 'Guerreiro de Agalor, que se põe sempre à frente dos outros. +2 Vida máxima, +1 em Combate.', tipo: { combate: 1 }, vidaMax: 2 },
  strider: { nome: 'Strider', desc: 'Monge dos Punhos Flamejantes. +2 em Habilidade.', tipo: { habilidade: 2 } },
  adarkar: { nome: 'Adarkar Szar', desc: 'Cego pelo próprio irmão, e o melhor dos três. +2 em Habilidade, +2 Vida máxima.', tipo: { habilidade: 2 }, vidaMax: 2 },
});

// ---------- O mapa ----------

const LUGARES_MADEIRA = {
  agalor: { nome: 'Agalor', x: .50, y: .13, terreno: 'cidade', cidade: true, desc: 'O planalto dos humanos, reconstruído pela rainha Thereza. Começa no norte.' },
  trunfisk: { nome: 'Trunfisk', x: .84, y: .42, terreno: 'cidade', cidade: true, desc: 'As planícies dos orcs, e o castelo dos Mão-de-Aço. Começa no leste.' },
  karpulsa: { nome: 'Karpulsa', x: .46, y: .85, terreno: 'cidade', cidade: true, desc: 'A cidade élfica dos Salazar, dentro da floresta. Começa no sul.' },
  bosques: { nome: 'Bosques da Uillyh', x: .35, y: .58, terreno: 'cidade', cidade: true, desc: 'Os halflings vivem à sombra da grande árvore. Começa no centro.' },
  marnorte: { nome: 'Mar Revolto', x: .73, y: .13, terreno: 'costa', desc: 'Foi aqui que a rainha atirou o escudo aos deuses.' },
  mancha: { nome: 'A Mancha Negra', x: .64, y: .29, terreno: 'estrada', desc: 'A terra que os exércitos de Garkum queimaram, e onde pouco voltou a crescer.' },
  yavimaya: { nome: 'Floresta de Yavimaya', x: .28, y: .19, terreno: 'floresta', desc: 'A primeira guerra do continente foi por estas árvores.' },
  monasterio: { nome: 'Punhos Flamejantes', x: .34, y: .37, terreno: 'ruina', desc: 'O monastério de Altrair Szar, a sul de Yavimaya.' },
  refugio: { nome: 'Refúgio das Chamas', x: .12, y: .29, terreno: 'montanha', desc: 'Nas montanhas de Erubor, o covil dos kobolds e gnolls.' },
  erubor: { nome: 'Salões de Erubor', x: .11, y: .57, terreno: 'ruina', desc: 'As casas dos anões, vazias desde que os Sedrix partiram pelo mar.' },
  uillyh: { nome: 'Uillyh', x: .51, y: .47, terreno: 'floresta', desc: 'A Árvore da Vida, onde acabam todas as linhas do mundo.' },
  planicies: { nome: 'Planícies de Trunfisk', x: .72, y: .59, terreno: 'estrada', desc: 'Erva alta, e a poeira de quem marcha para norte.' },
  lodacal: { nome: 'Lodaçal dos Trolls', x: .72, y: .78, terreno: 'pantano', desc: 'Os trolls aliaram-se aos orcs, e ainda ninguém lhes disse que a guerra acabou.' },
  orla: { nome: 'Orla de Karpulsa', x: .22, y: .78, terreno: 'floresta', desc: 'A proteção élfica começa aqui, e não avisa ninguém.' },
  cais: { nome: 'Cais de Aramon', x: .63, y: .90, terreno: 'costa', desc: 'Daqui partem os poucos que ainda se atrevem a cruzar o mar.' },
};

const ESTRADAS_MADEIRA = [
  ['agalor', 'yavimaya'], ['agalor', 'mancha'], ['agalor', 'marnorte'], ['marnorte', 'mancha'], ['marnorte', 'trunfisk'], ['yavimaya', 'refugio'], ['yavimaya', 'monasterio'],
  ['monasterio', 'uillyh'], ['monasterio', 'refugio'], ['monasterio', 'bosques'], ['refugio', 'erubor'], ['erubor', 'bosques'], ['erubor', 'orla'], ['mancha', 'trunfisk'], ['mancha', 'uillyh'],
  ['trunfisk', 'planicies'], ['planicies', 'uillyh'], ['planicies', 'lodacal'], ['planicies', 'bosques'], ['lodacal', 'cais'], ['lodacal', 'karpulsa'], ['uillyh', 'bosques'],
  ['bosques', 'karpulsa'], ['bosques', 'orla'], ['orla', 'karpulsa'], ['karpulsa', 'cais'],
];

const MAPA_MADEIRA = {
  titulo: 'Madeira Negra', tituloX: .2,
  mar: [[0, 0], [1, 0], [1, 1], [0, 1], [0, .94], [.12, .91], [.26, .94], [.42, .96], [.56, .95], [.66, .92], [.78, .89], [.86, .78], [.91, .66], [.93, .52], [.93, .38], [.90, .26], [.84, .17], [.76, .10], [.64, .06], [.50, .05], [.36, .04], [.20, .05], [.08, .04], [0, .04]],
  ilhas: [],
  lagos: [],
  // As veias do mundo: a Linha de Força sai da árvore para os quatro cantos.
  rios: [[[.51, .47], [.47, .30], [.42, .16], [.44, .05]], [[.51, .47], [.66, .45], [.78, .50], [.93, .52]], [[.51, .47], [.56, .66], [.54, .82], [.56, .95]]],
  serras: [{ x: .02, w: .19, y: .10, h: .42, n: 66 }, { x: .03, w: .12, y: .62, h: .10, n: 12 }],
  florestas: [{ x: .28, y: .19, rx: .09, ry: .08, n: 95 }, { x: .37, y: .76, rx: .15, ry: .08, n: 150 }, { x: .41, y: .53, rx: .06, ry: .08, n: 45 }],
  pantanos: [{ x: .73, y: .76, rx: .08, ry: .05, n: 130 }],
  arvore: { x: .51, y: .47 },
};

// ---------- A trama ----------

const OBJETIVOS_MADEIRA = {
  reliquia: { titulo: 'Encontre {reliquia}', glyph: 'star', desc: 'Aramil escondeu a Lâmina dos Cinco Sóis em cinco ovos de pedra. Quem os juntar manda em Madeira Negra, e este já está em movimento.',
    vitoria: 'Sente-lhe o peso na mochila, morno como se estivesse vivo: {reliquia}. Falta muito para os cinco, e enquanto este estiver consigo, a Lâmina não volta a existir.' },
  resgate: { titulo: 'Salve {refem}', glyph: 'seal', desc: 'Os Andarilhos Fantasmas levam quem sabe alguma coisa dos ovos, e ninguém volta para contar. Encontre o paradeiro antes de lhe arrancarem o que sabe.',
    vitoria: '{refem} sai dali com a sua ajuda, e a primeira coisa que faz é contar-lhe quem esteve a perguntar. O nome não lhe sai da cabeça o resto do caminho.' },
  aviso: { titulo: 'Leve o aviso a Tiago Raizobak', glyph: 'scroll', desc: 'O exército de Trunfisk vai subir para norte, e o último Cruzado de Agalor ainda não sabe por onde. O papel que leva vale mais do que você.',
    vitoria: 'Tiago lê o papel duas vezes, sem mudar de cara. "Ele já foi meu amigo", diz, e manda acender as fogueiras. Quando os orcs chegarem, o planalto vai estar à espera deles.' },
  monges: { titulo: 'Salve os pergaminhos dos Punhos', glyph: 'fist', desc: 'Tevish Szar jurou voltar ao monastério, e Altrair recusa-se a fugir. Os anciões querem salvar pelo menos o que resta dos pergaminhos.',
    vitoria: 'Sobra pouco, mas o suficiente: uma caixa de pergaminhos, e três crianças que já sabem respirar. Altrair não quis sair. Os Punhos Flamejantes vão durar mais do que o monastério.' },
};
const RELIQUIAS_MADEIRA = ['o ovo Darkwater', 'o ovo Mossfire', 'o ovo Skycloud', 'o ovo Sungrass', 'o ovo Shadowblood'];
const REFENS_MADEIRA = ['Olares Salazar', 'Artamin York Namy', 'Adarkar Szar', 'a rainha Thereza', 'William Wallace'];

const VILOES_MADEIRA = {
  profeta: { nome: 'o Profeta', destino: 'karpulsa', glyph: 'eye', fraqueza: ['clerigo', 'druida', 'mago'],
    efeitos: [{ t: 'Uma gota do seu sangue sobe-lhe à boca, e o corpo deixa de lhe obedecer por um instante.', tipo: 'fraco', v: 3 }, { t: 'Traça um sinal com o sangue de alguém, e a ferida dele fecha-se.', tipo: 'cura', v: 4 }],
    motivos: ['Nasceu numa casa humilde de Karpulsa, e nenhum Salazar lhe perguntou o nome até ele saber mais do que todos.', 'Era o vizir dos pais de Ezuri e Olares, e tem a idade de Ezuri. Já enterrou quase todos os que lhe davam ordens.', 'Não quer empunhar a Lâmina. Quer quem a empunha, e a árvore a seguir.'],
    pistas: [
      'Em cada castelo onde houve um ovo, houve antes um velho sábio de capuz, a oferecer ajuda sem pedir nada.',
      'Soveliss Salazar morreu de velhice, diz toda a gente. O curandeiro que lhe lavou o corpo fala de sangue que não coagulava, e fala em voz baixa.',
      'O capuz é um disfarce. O Profeta que anda com os Cruzados e o vizir de Karpulsa são o mesmo elfo: Veitan das Sombras Profundas. Voltou agora para casa.',
    ],
    finalTexto: 'O salão dos Salazar está vazio, e alguém acendeu todas as velas. {vilao} tira o capuz sem pressa, sentado no lugar que nunca foi dele. Tem a cara de um jovem, e os olhos de quem já leu tudo. "Veitan", diz. "De uma família de que nunca ouviu falar. Isso foi o erro de toda a gente."',
    ronda: { combate: 'Tem de cortar antes de ele acabar o sinal, e desta vez consegue.', social: 'Pergunta-lhe se Ivan ainda se lembra de quem o criou. O sinal treme-lhe na mão.', habilidade: 'Passa-lhe por cima da mesa, e fica fora do alcance do seu olhar.', investigacao: 'A magia dele precisa de sangue seu. Limpa a ferida, e o feitiço perde o fio.' } },
  tevish: { nome: 'Tevish Szar', destino: 'monasterio', glyph: 'fist', fraqueza: ['barbaro', 'monge', 'mago'],
    efeitos: [{ t: 'O metal fecha-se sobre a ferida com um estalido, e ele nem olha.', tipo: 'cura', v: 4 }, { t: 'A sua magia e as suas lâminas escorregam pela resistência dele.', tipo: 'ca', v: 1 }],
    motivos: ['Cegou o irmão Adarkar num golpe covarde, e o pai expulsou-o. Nunca lhes perdoou terem razão.', 'Ivan prometeu-lhe o monastério, e ele cobra sempre as promessas.', 'O Profeta cortou-o em dois e voltou a coser, com a armadura dos Cinco Sóis. Agora quer saber se ainda sente alguma coisa.'],
    pistas: [
      'Há árvores de Yavimaya partidas à altura do peito, sempre com a marca de uma mão lisa.',
      'Quem sobreviveu diz que o monge fala com a irmã por sinais, e que ela nunca lhe responde em voz alta.',
      'Os anciões já contaram os dias. Ele vem pela porta da frente do monastério, porque é onde o pai vai estar.',
    ],
    finalTexto: 'O pátio dos Punhos Flamejantes está coberto de faixas vermelhas. Ao fundo, a porta do Santuário foi arrancada, e há uma figura de pé no meio do círculo de treino, onde aprendeu a respirar. O metal brilha-lhe nos braços. {vilao} levanta os olhos incandescentes. "Isso é inútil", diz, antes de você ter feito alguma coisa.',
    ronda: { combate: 'Encontra a junta entre o metal e o que ainda é carne.', social: 'Fala-lhe de Adarkar, e do golpe. Pela primeira vez, ele para.', habilidade: 'Usa o primeiro gesto que Altrair ensina, e ele reconhece-o tarde de mais.', investigacao: 'A resistência tem um limite, e foi o próprio monastério que o escreveu.' } },
  trotark: { nome: 'Trotark, o Incendiário', destino: 'refugio', glyph: 'flame', fraqueza: ['patrulheiro', 'guerreiro', 'ladino'],
    efeitos: [{ t: 'Um jarro de óleo rebenta-lhe aos pés, e a roupa pega fogo.', tipo: 'dreno', v: 2 }, { t: 'Os kobolds fecham-se à volta dele, com escudos de lata.', tipo: 'ca', v: 1 }],
    motivos: ['Os viajantes de Agalor pagam-lhe em ouro, ou em cinzas.', 'Encontrou uma pedra oval num carregamento roubado, e já percebeu que há gente disposta a tudo por ela.', 'Quer ver Agalor a arder de perto. Das montanhas, diz ele, não tem graça.'],
    pistas: [
      'As caravanas de Agalor aparecem queimadas, com os cavalos vivos e soltos. O Clã das Chamas gosta de ser reconhecido.',
      'Um gnoll capturado jura que o chefe nunca sai sem uma tocha, e que dorme ao lado do óleo.',
      'As pegadas sobem as montanhas de Erubor. O Refúgio das Chamas está onde um dragão verde costumava caçar.',
    ],
    finalTexto: 'Há fumo a sair de cada fenda da montanha. O teto da caverna está preto, e os kobolds calam-se todos ao mesmo tempo. {vilao} sai do escuro com uma tocha em cada mão, e os dentes muito brancos na cara queimada. "Já estava à espera dos Cruzados", diz. "Serve-me você, para aquecer."',
    ronda: { combate: 'Corta a alça dos jarros, e o óleo cai para o lado dele.', social: 'Diz aos kobolds quanto ele lhes paga, e vários deixam de lhe tapar as costas.', habilidade: 'Mergulha por baixo da chama, e sai do outro lado a respirar fumo.', investigacao: 'Vê para onde o ar corre na caverna, e faz o fogo mudar de lado.' } },
  groskel: { nome: 'o Rei Groskel Mão-de-Aço', destino: 'trunfisk', glyph: 'axe', fraqueza: ['bardo', 'clerigo', 'feiticeiro'],
    efeitos: [{ t: 'O machado de duas mãos passa-lhe tão perto que perde o equilíbrio.', tipo: 'fraco', v: 3 }, { t: 'Os mestres da brutalidade batem nos escudos, e ele cresce com o barulho.', tipo: 'ca', v: 1 }],
    motivos: ['Tem o trono do avô de um povo que quase venceu o continente, e sabe o que dizem dele nas tavernas.', 'A armadura dos Cinco Sóis saiu da família, e ele não perdoa a Ivan esse dia.', 'Guarda um ovo vermelho e preto na sala do trono, e ainda não decidiu a quem o vender.'],
    pistas: [
      'Nas tavernas de Trunfisk, os orcs mais velhos falam de Gorkum com saudade, e do neto com cuidado.',
      'Korlash e Krusk treinam dia e noite. Dizem que o rei vai precisar de todos, e não dizem contra quem.',
      'O ovo Shadowblood está à vista de toda a gente, na sala do trono. É o único sítio onde o rei o consegue olhar de frente.',
    ],
    finalTexto: 'O salão de Trunfisk cheira a fumo, a couro e a carne. Há crânios de todas as raças nas paredes, e os orcs abrem caminho à sua passagem, a bater com os punhos no peito. {vilao} levanta-se do trono, e continua a levantar-se. "Pequeno", diz, a apanhar o machado do chão. "Mas veio pelo seu pé. Isso respeito."',
    ronda: { combate: 'Ele levantou o machado a mais uma vez, e o flanco fica-lhe aberto.', social: 'Grita o nome de Ivan à frente da corte inteira, e o rei perde o ritmo.', habilidade: 'Corre pelo cabo do machado, e obriga-o a largá-lo.', investigacao: 'Reparou no joelho que Korlash lhe partiu em criança.' } },
  ivan: { nome: 'Ivan Galonadel', destino: 'uillyh', glyph: 'crown', fraqueza: ['monge', 'clerigo', 'guerreiro'],
    efeitos: [{ t: 'O frenesi sobe-lhe aos olhos, e o golpe que vem a seguir já não é de elfo.', tipo: 'dreno', v: 2 }, { t: 'Nem repara na ferida. Em frenesi, só repara em si.', tipo: 'cura', v: 4 }],
    motivos: ['Destruiu um castelo inteiro de halflings numa única noite, e não se lembra de metade.', 'Alguém lhe disse que nasceu para a Lâmina, e ele acreditou. Desde então, deixou de decidir sozinho.', 'Foi herói, e ainda se ouve o que os Cruzados de Agalor fizeram. É o que torna isto tão difícil.'],
    pistas: [
      'Os orcs chamam-lhe irmão, e ele é um elfo. Gorkum encontrou-o numa floresta a arder, e deu-lhe um nome por não saber o verdadeiro.',
      'Tiago Raizobak diz que ele ia concordar, naquele dia. Que abriu a boca para concordar, e saiu outra pessoa.',
      'Uma velha de Karpulsa reconhece-lhe a cara num desenho, e benze-se: é o filho de Sianodel, Ezuri Salazar. E já vai a caminho da árvore, com uma fruta à espera.',
    ],
    finalTexto: 'A Uillyh enche o céu, negra e enorme, e todas as linhas do mundo acabam aqui. Há um elfo com uma armadura de orc junto à raiz, com uma fruta na mão. Vira-se para si e, por um momento, é só alguém muito cansado. "Ezuri", tenta você. Os olhos mudam de cor. {vilao} larga a fruta, e sorri com a cara de outra pessoa.',
    ronda: { combate: 'Aguenta o frenesi até ele abrir a guarda, como Tiago lhe ensinou.', social: 'Chama-o Ezuri, e lembra-lhe a mãe que saiu da proteção para o procurar. Ele hesita.', habilidade: 'Fala-lhe em sinais, com as mãos, como Ester lhe falava. O ataque não vem.', investigacao: 'Há um fio que não é dele a controlar-lhe a mente, e sabe agora onde cortar.' } },
};

const REVIRAVOLTAS_MADEIRA = {
  conselheiro: { nome: 'O Sábio da Corte', resumo: 'O sábio que o ajudou trabalhava para {vilao}.',
    titulo: 'O Mesmo Capuz',
    texto: 'O velho sábio que lhe deu indicações em troca de nada está à sua espera, numa encruzilhada onde nunca lhe disse que ia passar. Traz o capuz baixo, e fala com a voz de quem está cansado de ter razão. "Está a fazer um trabalho excelente", diz. "{vilao} agradece."',
    opcoes: [
      { t: 'Fingir que não percebeu', d: 'E dar-lhe uma história que lhe sirva.', tipo: 'social', roll: { a: 'carisma', dc: 13 }, ok: { txt: 'Ele acena devagar, e o olhar dele fica um bocadinho mais curioso. Por agora, chega para ganhar distância.', fx: { xp: 3, marca: 'enganou' } }, ko: { txt: 'Ele limita-se a tocar-lhe no braço. A dor chega um dia depois, e vem de dentro.', fx: { vida: -4 } } },
      { t: 'Revê tudo o que ele lhe disse', d: 'Ver o que é mentira.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Há um único caminho que ele nunca recomendou. É por lá que segue.', fx: { xp: 4 } }, ko: { txt: 'Perde o dia a duvidar de tudo, até dos que estavam certos.', fx: { dia: 1 } } },
      { t: 'Sair dali a correr', d: 'Conversas destas não acabam bem.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Quando olha para trás, a encruzilhada está vazia. O que é pior, mas está vivo.', fx: { xp: 2 } }, ko: { txt: 'Tropeça no que não estava lá. Ouve uma risada, e nada mais.', fx: { vida: -3 } } },
    ] },
  frenesi: { nome: 'Antes do Previsto', resumo: 'A notícia da destruição dos Bosques adiantou o exército.',
    titulo: 'O Castelo Caiu',
    texto: 'Chegam halflings pela estrada, de pés descalços e com as caras pretas de fumo. Um deles leva um estandarte queimado, e ninguém lhe consegue tirar da mão. O castelo dos York Namy caiu numa noite, e foi um só homem. O exército de Trunfisk vai partir mais cedo.',
    opcoes: [
      { t: 'Refazer as contas', d: 'Ouvir quem viu, e calcular as marchas.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'São dois dias a menos, mas agora sabe quais.', fx: { prazo: -2, xp: 3 } }, ko: { txt: 'Cada um conta uma coisa diferente, e todos têm razão para ter medo.', fx: { prazo: -3 } } },
      { t: 'Partir já', d: 'Dormir fica para depois.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 }, ok: { txt: 'Sai a meio da noite, e ganha às estradas parte do que perdeu.', fx: { prazo: -1, xp: 2 } }, ko: { txt: 'Parte exausto, e o cavalo cai antes do cansaço.', fx: { prazo: -2, vida: -3 } } },
    ] },
  ovofalso: { nome: 'A Pedra Errada', resumo: 'O ovo que todos perseguem é um engodo de {vilao}.',
    titulo: 'Pedra e Tinta',
    texto: 'Alguém lhe mostra o ovo de que todos falam. A cor sai-lhe no dedo. Quem pintou uma pedra de rio e a pôs a correr o continente quer ver quem vai atrás dela, e até onde. Em algum lugar, {vilao} está a tomar notas.',
    opcoes: [
      { t: 'Fazer-se de tolo', d: 'E continuar a persegui-lo às claras.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Espalha que está quase a apanhá-lo. {vilao} vai olhar para si, e para o lado errado.', fx: { xp: 3, marca: 'enganou' } }, ko: { txt: 'Quem o ouve ri-se, e não é o tipo de riso que se ignora.', fx: { vida: -2 } } },
      { t: 'Vender a pedra', d: 'Há quem pague sem olhar para os dedos.', ok: { txt: 'Sente-se mal durante uns minutos. O ouro ajuda.', fx: { ouro: 9 } } },
    ] },
  debito: { nome: 'A Filha dos Salazar', resumo: 'Olares Salazar andou sempre a um passo de si.',
    titulo: 'Mísseis no Escuro',
    texto: 'Cinco riscos de luz atravessam a clareira, e os homens que o seguiam caem. A elfa que sai do mato é mais nova do que devia ser, e tem cara de quem não dorme. "Não sei de que lado está", diz. "Mas eles têm medo de si, e é tudo o que me interessa hoje."',
    opcoes: [
      { t: 'Contar-lhe o que sabe', d: 'E pedir-lhe o mesmo.', tipo: 'social', roll: { a: 'carisma', dc: 9 }, ok: { txt: 'Ela escuta até ao fim, e acaba por ir consigo, enquanto os caminhos coincidirem.', fx: { aliado: 'olares', xp: 3, marca: 'ajudado' } }, ko: { txt: 'Não confia em si, mas atira-lhe uma bolsa antes de desaparecer.', fx: { ouro: 6, vida: 2 } } },
      { t: 'Só pedir o caminho', d: 'Sem arrastar mais ninguém.', ok: { txt: 'Mostra-lhe um atalho élfico com dois dedos, e volta-se para os corpos.', fx: { dia: -1, xp: 1 } } },
    ] },
  sangue: { nome: 'O Nome Sabido', resumo: 'O seu nome chegou aos ouvidos de {vilao}.',
    titulo: 'Sangue no Papel',
    texto: 'Encontra o seu nome escrito num papel, numa caligrafia antiga e perfeita. A tinta é castanha, e cheira a ferro. Por baixo, há a descrição do seu cavalo, e o que comeu ontem. No fim do papel, em cima de um pequeno círculo, está o sinal de {vilao}.',
    opcoes: [
      { t: 'Descobrir de quem é o sangue', d: 'Mesmo que custe tempo.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Custa-lhe um dia, mas sabe agora o que {vilao} teme de si.', fx: { dia: 1, marca: 'sangue', xp: 4 } }, ko: { txt: 'Perde o dia, e só fica com mais medo.', fx: { dia: 1 } } },
      { t: 'Queimar o papel', d: 'E continuar a andar.', ok: { txt: 'A chama fica vermelha por um instante, e depois é só um papel a arder.', fx: { vida: 2, xp: 1 } } },
    ] },
};

const GANCHOS_MADEIRA = {
  reliquia: [
    { titulo: 'O Enigma de Aramil', terreno: 'cidade',
      texto: 'Numa taberna de {cidade}, um elfo de roupa fina abre um pano em cima da mesa e mostra um desenho: uma pedra oval, de duas cores. "Foi guardada numa destas estradas, e não por acaso", diz, baixinho. "Olares Salazar paga bem. E outros pagam melhor, por isso apresse-se."',
      fundo: 'Quando os orcs de Garkum invadiram Karpulsa, Aramil Salazar transformou a Lâmina dos Cinco Sóis em espírito e guardou-a em cinco ovos de pedra, que se espalharam pelo continente. Quase ninguém que os encontrou soube do que se tratava.',
      opcoes: [
        { t: 'Estudar o desenho', d: 'As cores dizem de onde veio.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A cor da pedra é a de uma terra só, e o resto faz-se com o mapa à frente.', fx: { xp: 1 } }, ko: { txt: 'Fica a saber que é oval, e isso já sabia.', fx: {} } },
        { t: 'Segui-lo até à saída', d: 'Quem paga também sabe alguma coisa.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Fala com um batedor à porta, e diz o sítio em voz alta.', fx: {} }, ko: { txt: 'O batedor apanha-o, e tem os cotovelos bem treinados.', fx: { vida: -2 } } },
        { t: 'Perguntar aos carroceiros', d: 'Alguém viu uma pedra estranha numa carga.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma rodada depois, sai o nome da estrada onde a carga foi roubada.', fx: {} }, ko: { txt: 'Fica sem resposta, e com a conta da rodada.', fx: { ouro: -2 } } },
        { t: 'Preparar-se primeiro', d: 'Não será o único à procura.', ok: { txt: 'O elfo adianta-lhe umas moedas, e diz-lhe onde gastá-las.', fx: { mercado: true } } },
      ] },
    { titulo: 'A Pedra do Lavrador', terreno: 'cidade',
      texto: 'Um lavrador de {cidade} chega à praça com a cara partida e um saco vazio. "Era só uma pedra bonita, encontrei-a na lavoura!", grita para quem o quiser ouvir. Atrás dele, um anão velho olha-o de lado e, baixinho, diz-lhe a cor da pedra.',
      fundo: 'Os ovos mudaram de mãos muitas vezes em cinquenta anos. Thereza guardou um sem saber o que era, e os halflings pensaram que o seu era um enfeite. Quem está agora atrás deles já não é tão ingénuo.',
      opcoes: [
        { t: 'Levar o lavrador a beber', d: 'A pedra pode ter deixado rasto.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Lembra-se de quem lhe bateu, e para onde foi.', fx: {} }, ko: { txt: 'Só quer falar da lavoura. Paga-lhe a bebida à mesma.', fx: { ouro: -2 } } },
        { t: 'Ler as pegadas na lavoura', d: 'Eram botas de soldado.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Foram para o mesmo lado, e com pressa.', fx: { xp: 1 } }, ko: { txt: 'Passou uma manada em cima de tudo.', fx: {} } },
        { t: 'Apertar o anão velho', d: 'Sabe de mais para quem não diz nada.', tipo: 'habilidade', roll: { a: 'forca', dc: 11 }, rasto: true, ok: { txt: 'Os Sedrix ainda têm quem fique para trás a vigiar, e este está cansado de esperar.', fx: {} }, ko: { txt: 'A cabeça dele é muito mais dura do que a sua.', fx: { vida: -2 } } },
        { t: 'Ver o que vendem na praça', d: 'Toda a gente anda armada agora.', ok: { txt: 'Os preços subiram, mas ainda há o que comprar.', fx: { mercado: true } } },
      ] },
  ],
  resgate: [
    { titulo: 'O Lugar Vazio', terreno: 'cidade',
      texto: 'Em {cidade}, a mesa de {refem} continua posta. O copo está cheio e a cadeira caída. Ninguém viu nada, e toda a gente repete isso depressa de mais. Uma criança puxa-lhe a manga, e diz que viu uma mulher de faixa vermelha sair pela janela, com alguém às costas.',
      fundo: 'Desde que os Cruzados se separaram, quem sabe alguma coisa dos ovos desaparece. Nem sempre é violento. Às vezes, é uma senhora que nunca fala, e olha para si como se já soubesse o que lhe ia responder.',
      opcoes: [
        { t: 'Revistar o quarto', d: 'Quem sai à pressa deixa coisas.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Debaixo da cama está um mapa dobrado, com um único sinal.', fx: { xp: 1 } }, ko: { txt: 'Só pó, e uma ratazana com muitas opiniões.', fx: {} } },
        { t: 'Trepar pela janela', d: 'Seguir o caminho que ela fez.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Há fios vermelhos nas telhas, e uma direção.', fx: {} }, ko: { txt: 'As telhas de {cidade} não aguentam tanta confiança.', fx: { vida: -2 } } },
        { t: 'Falar com a criança', d: 'Ninguém mais lhe perguntou nada.', tipo: 'social', roll: { a: 'carisma', dc: 9 }, rasto: true, ok: { txt: 'Ela desenha-lhe o caminho no chão, com um pau.', fx: {} }, ko: { txt: 'A mãe leva-a dali, e olha para si com ódio.', fx: {} } },
        { t: 'Reabastecer antes', d: 'Quem levou {refem} não vai estar sozinho.', ok: { txt: 'Faz as contas ao que tem no bolso, e vai ao mercado.', fx: { mercado: true } } },
      ] },
    { titulo: 'Dois Dias e Uma Carta', terreno: 'cidade',
      texto: 'Entregam-lhe uma carta em {cidade}, escrita à pressa, na letra de {refem}. "Se isto lhe chegar, é porque não fui a tempo. Não confie no velho do capuz." A última linha está borrada, e há um dedo marcado a sangue no canto do papel.',
      fundo: 'Toda a gente ouviu falar do velho conselheiro que apareceu nas cortes de Madeira Negra e deu conselhos excelentes. O problema é que todos os que os seguiram estão agora mortos, desaparecidos ou bastante pior.',
      opcoes: [
        { t: 'Analisar o papel', d: 'Papel, tinta e cheiro dizem de onde veio.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'O papel é de um só lugar, e só há uma estrada para lá.', fx: { xp: 1 } }, ko: { txt: 'É só papel.', fx: {} } },
        { t: 'Apanhar o mensageiro', d: 'Foi-se embora depressa.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Ele confessa quem lhe pagou, e onde.', fx: {} }, ko: { txt: 'Ele conhece a cidade melhor do que você, e o muro também.', fx: { vida: -2 } } },
        { t: 'Mostrar a carta a quem o conhece', d: 'Alguém sabe por onde andava.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma velha amiga diz-lhe onde ia, e chora um pouco.', fx: {} }, ko: { txt: 'Ninguém quer ver aquele papel, e chamam-lhe azarento.', fx: {} } },
        { t: 'Comprar o que vai precisar', d: 'A carta não diz tudo.', ok: { txt: 'A carta fica no bolso, e o ouro fica no balcão.', fx: { mercado: true } } },
      ] },
  ],
  aviso: [
    { titulo: 'O Papel do Desertor', terreno: 'cidade',
      texto: 'Um orc novo, com o ombro aberto, agarra-lhe o braço numa viela de {cidade}. "Vão subir. Todos. Passam pelo monastério, e depois vão ao planalto", diz, e empurra-lhe um papel para a mão. "Tiago Raizobak. Só ele. Fui eu quem lho salvou uma vez." Quando olha de novo, já não respira.',
      fundo: 'Tiago foi o líder dos Cruzados de Agalor, até que Ivan disse que iria buscar os ovos a qualquer custo. Saiu do grupo nesse dia. Desde aí, anda à procura de provas de que aquele não era o seu amigo a falar.',
      opcoes: [
        { t: 'Ler o papel com calma', d: 'As marchas estão anotadas.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'As marchas dizem por onde Tiago vai ter de passar para chegar antes deles.', fx: { xp: 1 } }, ko: { txt: 'Sangue em cima de metade das palavras.', fx: {} } },
        { t: 'Sair pelos telhados', d: 'Quem o feriu ainda anda aqui.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'De cima, vê quem revista a viela, e para onde se dirige.', fx: {} }, ko: { txt: 'Veem-no, e sai a sangrar.', fx: { vida: -2 } } },
        { t: 'Procurar quem conhece Tiago', d: 'Ele deixa sempre amigos.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Um estalajadeiro de Agalor sabe por onde ele anda, e não cobra nada.', fx: {} }, ko: { txt: 'Toda a gente conhece, e ninguém sabe.', fx: {} } },
        { t: 'Enterrá-lo e aprontar-se', d: 'O caminho é longo.', ok: { txt: 'Fica com o que ele tinha nos bolsos, e vai ao mercado.', fx: { mercado: true } } },
      ] },
    { titulo: 'As Fogueiras do Norte', terreno: 'cidade',
      texto: 'Um emissário de Agalor bate na mesa de todas as tabernas de {cidade}. "A rainha Thereza paga a quem levar isto a Tiago Raizobak." Mostra um selo com um sol, e ninguém se mexe. Toda a gente sabe o que aconteceu ao último que aceitou, e o emissário olha para si.',
      fundo: 'Agalor já foi destruída uma vez, com o castelo a resistir debaixo da redoma do escudo. Agora, o Escudo dos Cinco Sóis está no fundo do mar. Thereza achou que os humanos não precisavam mais dele, e tem pensado nisso todas as noites.',
      opcoes: [
        { t: 'Ver o selo de perto', d: 'Tem o carimbo de um posto.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A cera ainda diz de que posto saiu, e é daí que parte o rasto.', fx: { xp: 1 } }, ko: { txt: 'É um sol. Agalor gosta de sóis.', fx: {} } },
        { t: 'Perguntar pelo último mensageiro', d: 'Alguém sabe o que lhe aconteceu.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Sabem onde ele foi visto, e de que lado da estrada.', fx: {} }, ko: { txt: 'Falam-lhe muito de azar, e pouco de estradas.', fx: {} } },
        { t: 'Ouvir o emissário sem ele saber', d: 'Ele vai contar mais a outro.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Da janela do lado, ouve o caminho inteiro.', fx: {} }, ko: { txt: 'Quem o ouve a si é a guarda dele.', fx: { vida: -2 } } },
        { t: 'Aceitar o adiantamento', d: 'E gastá-lo com juízo.', ok: { txt: 'O emissário conta as moedas com cara de quem já fez isto antes.', fx: { mercado: true } } },
      ] },
  ],
  monges: [
    { titulo: 'A Faixa Vermelha', terreno: 'cidade',
      texto: 'Em {cidade}, um rapaz de cabeça rapada senta-se à sua frente, muito direito, com as mãos a tremer. "O mestre Altrair diz que não foge", conta. "Os anciões pedem que alguém venha buscar os pergaminhos. Eu vim porque corro depressa. Não sei lutar ainda."',
      fundo: 'Altrair Szar fundou os Punhos Flamejantes para aliar a paz interior à força dos punhos. Teve três filhos. Ester roubou quatro pergaminhos proibidos do Santuário e perdeu quase todos os sentidos; Tevish cegou Adarkar. Só Adarkar ficou.',
      opcoes: [
        { t: 'Pedir-lhe o caminho exato', d: 'Os noviços sabem os atalhos.', tipo: 'social', roll: { a: 'carisma', dc: 9 }, rasto: true, ok: { txt: 'Respira fundo, e consegue dizer tudo por ordem.', fx: {} }, ko: { txt: 'Começa a chorar. Dá-lhe água, e tenta depois.', fx: {} } },
        { t: 'Olhar para os pés dele', d: 'Traz a terra de onde veio.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A terra preta é só de um sítio, e há rasto para o caminho.', fx: { xp: 1 } }, ko: { txt: 'São pés. Sujos.', fx: {} } },
        { t: 'Ver se ele vem seguido', d: 'Não veio sozinho, de certeza.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Um gnoll à porta foge-lhe, e deixa a direção de onde vieram os outros.', fx: {} }, ko: { txt: 'O gnoll não foge.', fx: { vida: -2 } } },
        { t: 'Comer e aprontar-se', d: 'Os dois precisam.', ok: { txt: 'O rapaz come como se fosse a última vez. Vai ao mercado.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Monge Cego', terreno: 'cidade',
      texto: 'Um homem de olhos enfaixados está de pé no meio da rua de {cidade}, a beber chá, com as carroças a desviarem-se dele. Vira a cara para si antes de chegar perto. "Tem os passos de quem não sabe para onde vai", diz. "O meu irmão já sabe. Ajude-me a salvar o que ele vem partir."',
      fundo: 'Adarkar Szar perdeu os olhos num desafio contra o irmão mais novo, que lhe bateu depois de perder. Nunca lhe pediu desculpa. E Adarkar nunca deixou de lhe guardar um lugar à mesa.',
      opcoes: [
        { t: 'Perguntar-lhe o que sente', d: 'Ele ouve mais do que os outros.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Ouviu os orcs a conversar, e sabe quantos dias faltam, e por onde.', fx: {} }, ko: { txt: 'Sorri, e bebe o chá.', fx: {} } },
        { t: 'Ver as marcas no chá', d: 'Há ervas de um sítio só.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A erva cresce apenas junto ao caminho que procura.', fx: { xp: 1 } }, ko: { txt: 'É bom chá. E só.', fx: {} } },
        { t: 'Seguir-lhe o passo', d: 'Ele nunca espera ninguém.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, rasto: true, ok: { txt: 'Fica sem fôlego, e fica a saber o caminho.', fx: {} }, ko: { txt: 'Choca com uma carroça que ele evitou de olhos fechados.', fx: { vida: -2 } } },
        { t: 'Ir buscar o que falta', d: 'Antes de ir ao encontro de quem parte portas.', ok: { txt: 'Ele nem pergunta, e está à sua espera quando volta.', fx: { mercado: true } } },
      ] },
  ],
};

const ENCONTROS_MADEIRA = [
  { id: 'm_estandarte', terreno: 'cidade', titulo: 'A Cabeça à Entrada',
    texto: 'Há uma festa na praça: orcs e humanos a discutir, muito bêbados, sobre quem tinha razão na guerra de Yavimaya. Passaram-se quase duzentos anos, e ainda há gente disposta a sangrar por causa da cabeça de Edeysa. Alguém pede-lhe para decidir.',
    fundo: 'Gerkar Mão-de-Aço cortou a cabeça da duelista Edeysa Raizobak, e pô-la à entrada da floresta. Cinco anos depois, o filho dela tirou-lhe o braço esquerdo. Foi assim que os orcs e os humanos começaram a contar os anos.',
    opcoes: [
      { t: 'Falar em orc', d: 'Só Orcs. Sabe o que lhes dizer.', tipo: 'social', req: { raca: 'orc' }, ok: { txt: 'Fala com os seus, sem pressa. Riem-se, e um humano acaba a pagar a rodada a toda a gente.', fx: { ouro: 4, xp: 3 } } },
      { t: 'Contar a história como deve ser', d: 'Só o Bardo. Com todos a chorar no fim.', tipo: 'social', req: { cls: 'bardo' }, ok: { txt: 'Não diz quem tinha razão, e isso é a parte que eles lhe pagam.', fx: { ouro: 8, xp: 2 } } },
      { t: 'Fazê-los rir', d: 'Antes que saquem das armas.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Bastam duas piadas sobre braços. Pagam-lhe uma bebida, e esquecem-se do assunto.', fx: { ouro: 3, xp: 2 } }, ko: { txt: 'Passam a estar de acordo, sobre si.', fx: { vida: -3 } } },
      { t: 'Separá-los à força', d: 'É mais rápido.', tipo: 'combate', roll: { a: 'forca', dc: 12, pv: 6, ini: 'Os Bêbados de Agalor' }, ok: { txt: 'Saem dois dentes da conversa. Quem ainda está de pé paga-lhe uma rodada.', fx: { ouro: 5, xp: 2 } }, ko: { txt: 'Acorda com uma cadeira em cima de si, e com menos moedas.', fx: { vida: -3, ouro: -2 } } },
      { t: 'Continuar a andar', d: 'Não é a sua guerra.', ok: { txt: 'Atrás de si, alguém parte uma mesa. Ninguém o chama.', fx: {} } },
    ] },
  { id: 'm_redoma', terreno: 'cidade', titulo: 'Os Netos da Redoma',
    texto: 'Junto às muralhas, um velho vende bilhetes para ver a marca onde a redoma do escudo tocou no chão. Há um círculo perfeito de pedra derretida, e crianças a saltar lá dentro. "Do lado de dentro, sobrevivemos", diz. "Do lado de fora, não ficou nada."',
    fundo: 'Herald Raizobak acionou o Escudo dos Cinco Sóis, e o castelo ficou sob uma redoma impenetrável. Os orcs destruíram tudo o resto. Durante oitenta anos, Agalor foi duas cidades. Os que nasceram lá dentro ainda falam com as mãos muito perto do corpo.',
    opcoes: [
      { t: 'É a minha terra', d: 'Requer Soldado de Agalor. Conhece estes velhos.', tipo: 'social', req: { bg: 'soldado_agalor' }, ok: { txt: 'Ele reconhece-lhe o sotaque, e passa a falar com o seu pai. No fim, dá-lhe o que tem no bolso, e o peitoral do filho.', fx: { item: 'mn_peitoral', xp: 2 } } },
      { t: 'Ler o círculo', d: 'Magia assim deixa marcas.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'O poder do Escudo era igual ao de outra coisa, e essa coisa ainda aqui está. Aprende muito.', fx: { xp: 5 } }, ko: { txt: 'Um dos miúdos faz-lhe uma rasteira, e o velho cobra-lhe o bilhete.', fx: { vida: -1, ouro: -1 } } },
      { t: 'Pagar o bilhete', d: 'Custa 2 de Ouro.', ok: { txt: 'O velho conta-lhe a história de graça, e é uma boa história.', fx: { ouro: -2, xp: 3 } } },
      { t: 'Ver o mercado', d: 'Os mercadores vêm cá por causa dos turistas.', ok: { txt: 'É o mercado mais barato do norte.', fx: { mercado: true } } },
    ] },
  { id: 'm_mestres', terreno: 'cidade', titulo: 'Korlash e Krusk',
    texto: 'Dois orcs enormes, muito velhos, partem troncos à mão à frente de um círculo de jovens. Um olha para si e aponta para o centro. "Mão-de-Aço guarda aqui a sua força", diz, a bater no peito. "O que traz tu?"',
    fundo: 'Os mestres da brutalidade guardaram a Armadura dos Cinco Sóis enquanto Garkum não tinha idade para a usar. Não respeitam títulos. Foram eles que treinaram os últimos três reis e, quando estão sozinhos, dizem que nenhum valeu o trabalho.',
    opcoes: [
      { t: 'Partir o tronco', d: 'Só o Bárbaro. É um tronco.', tipo: 'combate', req: { cls: 'barbaro' }, ok: { txt: 'Os dois velhos fazem um som que pode ser riso. Dão-lhe um machado, e um conselho que não é preciso repetir.', fx: { item: 'mn_machado', xp: 2 } } },
      { t: 'Entrar no círculo', d: 'Tocar antes de ser tocado.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Krusk' }, ok: { txt: 'Sai com o nariz partido e a mão de Krusk no ombro. "Pequeno", diz. Em Trunfisk, é um elogio.', fx: { xp: 5, ouro: 4 } }, ko: { txt: 'Ninguém viu o golpe. Só o chão.', fx: { vida: -5 } } },
      { t: 'Ver onde estão a falhar', d: 'Olhar para os pés do mais novo.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Aponta o erro, e ele acerta o tronco à primeira. Korlash fica a olhar para si, e paga-lhe.', fx: { ouro: 6, xp: 2 } }, ko: { txt: 'O mais novo prova-lhe que estava errado, com a cara.', fx: { vida: -2 } } },
      { t: 'Baixar a cabeça, e sair', d: 'Há combates melhores.', ok: { txt: 'Fazem-lhe um aceno, sem lhe voltarem a olhar.', fx: {} } },
    ] },
  { id: 'm_halflings', terreno: 'cidade', titulo: 'Debaixo da Sombra',
    texto: 'Toda a vila anda de pés descalços, por respeito. Uma família de halflings serve-lhe uma sopa sem lhe perguntar nada, e a avó põe-lhe uma folha negra no prato. "Se a Árvore a largou", diz, "é porque era para si. Mas agora quem manda no castelo tem medo de tudo."',
    fundo: 'Os deuses deixaram os York Namy viver à sombra da Uillyh porque achavam que eram os mais nobres de espírito, e os mais ingénuos. Os halflings encontraram um ovo verde e branco, e passaram meio século a usá-lo para segurar uma porta.',
    opcoes: [
      { t: 'Um dos nossos', d: 'Só Halflings. Já sabe tirar os sapatos.', tipo: 'social', req: { raca: 'halfling' }, ok: { txt: 'Fica para o almoço, e para o lanche. Ao sair, tem a folha numa fita, e o estômago cheio.', fx: { item: 'mn_folha', vida: 4 } } },
      { t: 'Avisá-los', d: 'O que vem aí não respeita sapatos.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'A avó fica muito quieta. Nessa noite, várias famílias partem para o sul, e sabem quem lhes disse.', fx: { xp: 4, marca: 'halflings' } }, ko: { txt: 'Riem-se muito, e dão-lhe mais sopa.', fx: { vida: 2 } } },
      { t: 'Levar a folha', d: 'E agradecer.', ok: { txt: 'A folha é fria, e pesa pouco. Sente-se melhor sem saber porquê.', fx: { vida: 4, xp: 1 } } },
      { t: 'Ver o que vendem', d: 'A aldeia inteira faz alguma coisa.', ok: { txt: 'Compotas, fitas, e uma espada muito pequena.', fx: { mercado: true } } },
    ] },

  { id: 'm_caravana', terreno: 'estrada', titulo: 'A Caravana Queimada',
    texto: 'Uma caravana de Agalor arde devagar, com os cavalos vivos e soltos à volta, a comer. Há marcas de pés pequenos por todo o lado, e um kobold a tentar carregar um saco maior do que ele. Olha para si. Olha para o saco.',
    fundo: 'O Clã das Chamas ataca viajantes há anos, e os orcs nunca se importaram. Foi por isso que Tiago Raizobak recebeu a missão de os destruir, e foi nessa missão que conheceu Ivan Galonadel, num dia bom para os dois.',
    opcoes: [
      { t: 'Seguir o rasto até eles', d: 'Só o Patrulheiro. Pés pequenos, muito juntos.', tipo: 'investigacao', req: { cls: 'patrulheiro' }, ok: { txt: 'Encontra o saco e as duas tocas. Devolve o que é de alguém, e fica com o que já não é de ninguém.', fx: { ouro: 7, xp: 3 } } },
      { t: 'Apanhar o kobold', d: 'Tem pernas curtas e muita vontade.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 }, ok: { txt: 'Solta o saco e vários insultos. Dentro está o suficiente para o resto da semana.', fx: { ouro: 6 } }, ko: { txt: 'Levava um jarro de óleo, e sabia para que servia.', fx: { vida: -3 } } },
      { t: 'Procurar sobrevivente', d: 'Há um carroceiro debaixo da carroça.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Puxa-o a tempo. É de boas famílias, e os Raizobak hão de saber o seu nome.', fx: { xp: 4, marca: 'cruzados' } }, ko: { txt: 'Chega tarde, e queima as mãos a tentar.', fx: { vida: -2 } } },
      { t: 'Levar um cavalo', d: 'Afinal, estavam soltos.', ok: { txt: 'O cavalo tem mais pressa do que você. Ganha tempo.', fx: { dia: -1 } } },
    ] },
  { id: 'm_coluna', terreno: 'estrada', titulo: 'A Marcha para Norte',
    texto: 'A coluna não acaba. Orcs, meio-orcs, ogros e até trolls a tossir ao sol, com a poeira a subir até ao fim da vista. Um sargento de dentes de ferro tira-lhe o olho de cima por um instante, depois volta a olhar. "Vais para o norte?", pergunta. "Estamos todos."',
    fundo: 'Nem todos os que marcham são orcs de Trunfisk. O exército conta com os goblins, os bugbears, os ogros e os trolls que Gerkaria domesticou. Muitos nunca souberam o que ficava para lá da próxima colina, e vão para descobrir.',
    opcoes: [
      { t: 'Fazer-se passar por batedor', d: 'De queixo levantado.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Ninguém gosta dos batedores, e ninguém os pára. Sai do outro lado com uma lista de quantos são.', fx: { xp: 4 } }, ko: { txt: 'O sargento conhece os batedores todos. Leva a lição, e um bastão.', fx: { vida: -3 } } },
      { t: 'Cortar pelas colinas', d: 'Longe da poeira.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Passa-lhes à frente sem que ninguém o veja.', fx: { xp: 2 } }, ko: { txt: 'Veem-no, e perde o dia a fugir de um ogro entediado.', fx: { dia: 1, vida: -1 } } },
      { t: 'Esperar que passem', d: 'Perde um dia.', ok: { txt: 'Passa um dia a contar lanças, e pensa nas coisas.', fx: { dia: 1, xp: 2 } } },
    ] },
  { id: 'm_linhas', terreno: 'estrada', titulo: 'A Veia do Mundo',
    texto: 'Há um risco na terra, tão fino como um cabelo, e nada cresce em volta dele. Se fechar os olhos, consegue senti-lo pulsar debaixo dos pés. Um velho senta-se em cima dele, de sapatos tirados, a pôr as mãos no chão.',
    fundo: 'Para haver vida no Plano Material, os deuses traçaram linhas que correm por todo o mundo, como veias, e terminam numa árvore. A cada ser dão uma Linha de Força Vital, e todas elas têm um fim. Quase todos preferem não pensar nisso.',
    opcoes: [
      { t: 'Pôr as mãos no chão', d: 'Só o Druida. A terra fala-lhe.', tipo: 'magia', req: { cls: 'druida' }, ok: { txt: 'Sente onde a vida corre, e onde foi cortada. Nada lhe dói durante muito tempo.', fx: { vida: 8, xp: 3 } } },
      { t: 'Rezar junto dele', d: 'Só o Clérigo. Ele também reza.', tipo: 'magia', req: { cls: 'clerigo' }, ok: { txt: 'O velho faz silêncio consigo. Quando abre os olhos, as feridas fecharam, e ele já cá não está.', fx: { vida: 8, xp: 3 } } },
      { t: 'Seguir o risco um bocado', d: 'Vai para algum lado.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Nem todos os caminhos estão nos mapas. Este poupa-lhe muito.', fx: { dia: -1, xp: 2 } }, ko: { txt: 'Dá voltas, e encontra o mesmo velho, a rir-se.', fx: { dia: 1 } } },
      { t: 'Deixar-lhe uma moeda', d: 'Custa 1 de Ouro.', ok: { txt: 'Ele nem olha. Sente-se melhor sem saber porquê.', fx: { ouro: -1, vida: 3 } } },
    ] },

  { id: 'm_tumba', terreno: 'floresta', titulo: 'A Tumba do Maneta',
    texto: 'Uma caverna em Yavimaya, tapada com uma pedra que muitos tentaram mover. Dentro, há um cheiro a ferro velho, e a sombra de um trono. Um machado enorme está encostado à parede, com o cabo gasto apenas de um lado.',
    fundo: 'Gerkar Mão-de-Aço perdeu o braço esquerdo para Herald Raizobak, e viveu trinta anos sem lhe perdoar. Foi enterrado aqui, numa floresta que tinha conquistado duas vezes, com tudo o que tinha, e os orcs ainda deixam oferendas à porta.',
    opcoes: [
      { t: 'Pedir licença ao morto', d: 'Só Meio-Orcs. Aprendeu-o da pior maneira.', tipo: 'social', req: { raca: 'meioorc' }, ok: { txt: 'Diz as palavras certas, e leva o que ele não precisa. Lá fora, ninguém o toca.', fx: { item: 'mn_machado', xp: 2 } } },
      { t: 'Filho de Trunfisk', d: 'Só Orcs. Ele conhecia-lhe a família.', tipo: 'social', req: { raca: 'orc' }, ok: { txt: 'Deixa uma oferenda, e tem a certeza de que alguém lhe agradece. O machado sai da parede com facilidade.', fx: { item: 'mn_machado', xp: 2 } } },
      { t: 'Revistar a tumba', d: 'Com muito cuidado.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Moedas de um tempo em que ainda havia um só reino, e nenhuma armadilha que o tenha apanhado.', fx: { ouro: 9 } }, ko: { txt: 'Os orcs nunca confiaram em portas, e tinham razão.', fx: { vida: -4 } } },
      { t: 'Ler o que está na parede', d: 'Riscado com uma única mão.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Escreveu contra quem o enterrou, e sobre ela. Passa a saber muito acerca de Trunfisk.', fx: { xp: 5 } }, ko: { txt: 'Só insultos, e muito bem escritos.', fx: { xp: 1 } } },
      { t: 'Deixar estar', d: 'Ele já perdeu o suficiente.', ok: { txt: 'Coloca a pedra no lugar, e continua o caminho.', fx: {} } },
    ] },
  { id: 'm_ziul', terreno: 'floresta', titulo: 'O Druida de Costas',
    texto: 'Um elfo está de costas para si, com as mãos num tronco e a falar baixinho. Um lobo a dormir levanta uma orelha. Sem se virar, ele diz: "Esta árvore está doente, e não é de velhice. Tem qualquer coisa no sangue. Tem tempo para isto?"',
    fundo: 'Ziul Leng Thran faz parte do grupo de Olares, e não confia em quem nunca sujou as mãos. Tem andado a seguir uma doença que aparece em castelos e em árvores, sempre um pouco antes de alguém poderoso morrer.',
    opcoes: [
      { t: 'Curar a árvore com ele', d: 'Só o Druida. Ele chega-se para o lado.', tipo: 'magia', req: { cls: 'druida' }, ok: { txt: 'Passam a tarde nisto. Depois, ele levanta-se e pergunta-lhe para onde vão.', fx: { aliado: 'ziul', xp: 3 } } },
      { t: 'Ajudá-lo a descobrir', d: 'Ver onde a doença começa.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Encontra um sinal castanho, escondido na casca. Ele olha-o muito tempo, e decide ir consigo.', fx: { aliado: 'ziul', xp: 1 } }, ko: { txt: 'O que quer que seja, também não gosta de ser apanhado. Fica com uma febre.', fx: { vida: -2 } } },
      { t: 'Oferecer-lhe de comer', d: 'Parece não dormir há muito.', ok: { txt: 'Aceita, sem a menor cerimónia, e dá-lhe em troca um unguento para o caminho.', fx: { vida: 3, xp: 1 } } },
    ] },
  { id: 'm_protecao', terreno: 'floresta', titulo: 'A Mesma Clareira',
    texto: 'Passa pela mesma clareira pela terceira vez. Há um esquilo que já o reconhece. Alguém, entre as árvores, canta uma canção em que cada verso é a sua cara. Karpulsa não gosta de visitas que não pediu.',
    fundo: 'Quando os orcs invadiram Karpulsa, um pequeno número de elfos escondeu-se atrás de uma proteção mágica. Sianodel saiu dela para procurar o filho, e foi morta. A proteção nunca foi retirada, e os Salazar desde então fazem isto a toda a gente.',
    opcoes: [
      { t: 'Dar o sinal', d: 'Requer Batedor de Karpulsa. Sabe o que dizer.', tipo: 'social', req: { bg: 'batedor_elfo' }, ok: { txt: 'A canção para, e uma elfa sai de trás de um tronco, aborrecida. Ainda lhe dá um arco, e não lhe pergunta nada.', fx: { item: 'mn_arco', xp: 2 } } },
      { t: 'Cantar também', d: 'Só Elfos. A canção tem resposta.', tipo: 'social', req: { raca: 'elfo' }, ok: { txt: 'Responde ao verso, e o caminho abre-se. Lá dentro, ainda lhe enchem os bolsos.', fx: { ouro: 5, marca: 'elfos', xp: 2 } } },
      { t: 'Desfazer o feitiço', d: 'Só o Mago. Tem de ter um fio solto.', tipo: 'magia', req: { cls: 'mago' }, ok: { txt: 'Encontra o fio e, em vez de o puxar, atira-o a alguém que estava a rir-se. Saem-lhe a pedir desculpa.', fx: { ouro: 4, xp: 4, marca: 'elfos' } } },
      { t: 'Marcar as árvores', d: 'E andar sempre em frente.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Sai ao fim de umas horas, um pouco mais sábio, com a sensação de ter sido avaliado.', fx: { xp: 4 } }, ko: { txt: 'Perde o dia inteiro, e o esquilo acaba por ter pena de si.', fx: { dia: 1 } } },
      { t: 'Sentar-se, e esperar', d: 'Quem manda vai cansar-se.', ok: { txt: 'Passa uma noite estranha, e sai com fome, mas sem feridas.', fx: { dia: 1, vida: 3 } } },
    ] },

  { id: 'm_dragao', terreno: 'montanha', titulo: 'O Dragão Verde',
    texto: 'O vento traz um cheiro a ácido e a cabra. Há ossos em círculo à frente da caverna, e uma árvore derretida ao meio. Do alto chega um som, como uma casa a respirar. Alguém deixou aqui um escudo inteiro, derretido, em forma de mão.',
    fundo: 'Há quatro anos, Tiago e Ivan estiveram encurralados por um dragão verde adolescente nestas montanhas, à procura do Clã das Chamas. Foi a Mestra e Tevish que os salvaram. Foi aí que os quatro começaram. O dragão tinha irmãos.',
    opcoes: [
      { t: 'Deixar passar o vento', d: 'Só o Ladino. Silêncio e paciência.', tipo: 'habilidade', req: { cls: 'ladino' }, ok: { txt: 'Passa-lhe por baixo do queixo e rouba-lhe uma coisa de estimação. Saiu-lhe bem.', fx: { ouro: 12, xp: 2 } } },
      { t: 'Atravessar a correr', d: 'Enquanto ele respira.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 13 }, ok: { txt: 'Sente o ácido na nuca, e chega lá acima a rir-se sozinho.', fx: { xp: 4 } }, ko: { txt: 'Só uma gota, e o manto, e parte das costas.', fx: { vida: -5 } } },
      { t: 'Procurar o caminho dos pastores', d: 'Mais longe, mas com cabras vivas.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Os anões deixaram passagens, e ainda funcionam.', fx: { xp: 2, ouro: 2 } }, ko: { txt: 'Perde um dia, e o caminho acaba em cabras mortas.', fx: { dia: 1 } } },
      { t: 'Voltar para trás', d: 'Há dias assim.', ok: { txt: 'Atrasa-se, e fica com todas as partes.', fx: { dia: 1 } } },
    ] },
  { id: 'm_ogro', terreno: 'montanha', titulo: 'O Portageiro',
    texto: 'Um ogro está sentado numa ponte de pedra, com um bloco de notas minúsculo na mão. "Portagem", diz, a ler devagar. "Três. Moedas. Ou uma perna." Fecha o bloco, e olha para as suas pernas. Parece genuinamente indeciso.',
    fundo: 'Depois da guerra, Gerkaria deixou muitos ogros de uniforme, sem lhes dizer que tinha acabado. Muitos continuam a cumprir as últimas ordens. Este recebeu-as de um oficial que lhe ensinou a escrever, e tem muito orgulho nisso.',
    opcoes: [
      { t: 'Pagar a portagem', d: 'Custa 3 de Ouro.', ok: { txt: 'Passa-lhe um recibo, e escreveu bem o seu nome.', fx: { ouro: -3, xp: 1 } } },
      { t: 'Elogiar-lhe a caligrafia', d: 'É mesmo muito boa.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Fica vermelho. Dá-lhe passagem, e um papel com os nomes de quem passou esta semana.', fx: { xp: 4 } }, ko: { txt: 'Acha que está a gozar com ele, e não está longe da verdade.', fx: { vida: -3 } } },
      { t: 'Passar à força', d: 'Ele é só um.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'O Ogro da Ponte' }, ok: { txt: 'Cai para trás, com um grande estrondo, e o saco das portagens fica ali.', fx: { ouro: 8, xp: 2 } }, ko: { txt: 'Fica-lhe com uma bota, e quase com o resto.', fx: { vida: -5 } } },
      { t: 'Saltar por baixo', d: 'A ponte tem traves.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Passa pelas traves, enquanto ele conta as próprias moedas.', fx: { xp: 3 } }, ko: { txt: 'A trave não era tão sólida como parecia. Ele aponta a queda no bloco.', fx: { vida: -3 } } },
    ] },

  { id: 'm_troll', terreno: 'pantano', titulo: 'A Casa dos Trolls',
    texto: 'O lodo chega-lhe à cintura, e há fumo a sair de um monte de troncos e de lama. Uma voz canta muito mal, lá dentro. Dois olhos grandes abrem-se à superfície, e um troll de chapéu de lata pergunta-lhe se trouxe a encomenda.',
    fundo: 'Os trolls aliaram-se aos orcs por vontade própria, porque os orcs traziam comida. Quando deixaram de trazer, os trolls ficaram com a parte da guerra que mais gostavam: esperar à beira de um caminho, e ver quem passa.',
    opcoes: [
      { t: 'Dizer que sim', d: 'Sem fazer a menor ideia.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Vai buscar a encomenda para si. Era uma caixa de moedas, para outra pessoa.', fx: { ouro: 8, xp: 2 } }, ko: { txt: 'Quer ver a encomenda. Trata-se de si, afinal.', fx: { vida: -4 } } },
      { t: 'Atirar-lhe fogo', d: 'Só o Feiticeiro. Eles não gostam nada.', tipo: 'magia', req: { cls: 'feiticeiro' }, ok: { txt: 'Foge pelo lodo, e deixa o chapéu e a casa. Lá dentro, há o que sobrou de muitas caravanas.', fx: { ouro: 9, xp: 2 } } },
      { t: 'Sair sem barulho', d: 'Ainda não o viu bem.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'O lodo tapa-lhe tudo, até o cheiro. Passa.', fx: { xp: 2 } }, ko: { txt: 'Um braço comprido apanha-o pela perna, e larga-o por pouco.', fx: { vida: -3 } } },
      { t: 'Dar a volta', d: 'Perde um dia.', ok: { txt: 'Atrás de si, a canção continua, e não melhora.', fx: { dia: 1 } } },
    ] },
  { id: 'm_lodo', terreno: 'pantano', titulo: 'O Estandarte no Lodo',
    texto: 'Há estacas a apontar para fora do pântano, e um estandarte de Agalor a sair da água, ainda de pé. Alguém continua a substituir-lhe a corda, e um velho meio-orc de barba muito limpa está a pescar ali, com uma caneca ao lado.',
    fundo: 'Os meio-orcs nunca foram bem-vindos em Agalor nem em Trunfisk, e muitos vieram viver para os lugares onde ninguém queria estar. O velho guarda a memória de um soldado que uma vez lhe deu de beber. Nunca lhe soube o nome.',
    opcoes: [
      { t: 'Sentar-se a pescar', d: 'Ele tem outra cana.', ok: { txt: 'Não falam muito. Sai com um peixe e o caminho seguro até ao outro lado.', fx: { vida: 5, xp: 2 } } },
      { t: 'Perguntar pelo estandarte', d: 'Ele deve querer contar.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Fala durante horas, e no fim dá-lhe um mapa de Karpulsa e umas moedas, para beber em nome do soldado.', fx: { xp: 4, ouro: 3 } }, ko: { txt: 'Olha-o de lado, e deixa de falar.', fx: {} } },
      { t: 'Prestar homenagem', d: 'Só o Soldado de Agalor.', tipo: 'social', req: { bg: 'soldado_agalor' }, ok: { txt: 'Levanta o estandarte como lhe ensinaram. O velho levanta-se, e faz a saudação de um exército onde nunca o deixaram entrar.', fx: { xp: 6, vida: 2 } } },
    ] },

  { id: 'm_santuario', terreno: 'ruina', titulo: 'O Santuário Aberto',
    texto: 'A porta do Santuário Sagrado está aberta, e já ninguém a guarda. Há quatro prateleiras vazias, e nas paredes estão pintados quatro poderes em letras grandes. Debaixo, numa letra mais tremida, está escrito o que cada um deles custou.',
    fundo: 'Ester Szar roubou os quatro pergaminhos: a Força Suprema, a Soberania dos Ventos, a Proteção de Gaia e a Transmigração da Alma. Em troca, perdeu a fala, a audição, o tato e o paladar. Ficou-lhe a visão. O pai, quando teve a sua oportunidade de a parar, não conseguiu.',
    opcoes: [
      { t: 'Praticar o primeiro gesto', d: 'Só o Monge. Antes de tudo o resto.', tipo: 'habilidade', req: { cls: 'monge' }, ok: { txt: 'Fica ali até anoitecer. Quando sai, o corpo já não se queixa, e na porta há uma faixa à sua espera.', fx: { item: 'mn_faixa', xp: 3 } } },
      { t: 'Estou em casa', d: 'Requer Noviço dos Punhos Flamejantes.', tipo: 'social', req: { bg: 'punhos' }, ok: { txt: 'Sabe onde o velho Strider guardava as coisas. Ele está lá, e reconhece-lhe o andar.', fx: { aliado: 'strider', xp: 2, marca: 'monges' } } },
      { t: 'Copiar as palavras', d: 'Quem sabe o custo já está um passo à frente.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Sai com notas que nem os anciões sabem que existem, e que nunca vai poder usar.', fx: { xp: 6 } }, ko: { txt: 'O ar aqui dentro não gosta de quem lê sem pedir. Sangra-lhe o nariz.', fx: { vida: -3 } } },
      { t: 'Fechar a porta', d: 'Alguém tinha de o fazer.', ok: { txt: 'Fecha-a com cuidado. Nunca vai saber se serviu de alguma coisa.', fx: { xp: 1, marca: 'monges' } } },
    ] },
  { id: 'm_sedrix', terreno: 'ruina', titulo: 'A Mesa Posta de Erubor',
    texto: 'As portas dos anões continuam de pé, e ninguém as sabe fazer assim. Lá dentro há uma mesa posta para cem, com a louça coberta de pó. Partiram com tudo o que conseguiam carregar, e não estavam com pressa de lavar pratos.',
    fundo: 'Edgard Sedrix entregou o Elmo aos orcs, voltou a roubá-lo, e fugiu com o seu povo pelos mares que todas as raças temiam. Ninguém sabe bem o que lhes aconteceu. A montanha ficou, e os orcs nunca a conseguiram habitar.',
    opcoes: [
      { t: 'Sentar-se à cabeceira', d: 'Só Anões. Ainda há um lugar seu.', tipo: 'social', req: { raca: 'anao' }, ok: { txt: 'Roda a cadeira, e abre-se uma gaveta que só um anão ia procurar. O ouro já estava à sua espera, com um recado: "Para quem ficou."', fx: { ouro: 12, xp: 2 } } },
      { t: 'Procurar a despensa', d: 'Anões nunca passam fome.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Cerveja com cinquenta anos, e uma poção na prateleira de cima. A cerveja continua boa.', fx: { vida: 4, item: 'pocao' } }, ko: { txt: 'A cerveja com cinquenta anos não estava boa.', fx: { vida: -2 } } },
      { t: 'Abrir a câmara do tesouro', d: 'Está mesmo ali.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 13 }, ok: { txt: 'O mecanismo ainda trabalha, mas você é mais rápido.', fx: { ouro: 10 } }, ko: { txt: 'O mecanismo ainda trabalha.', fx: { vida: -5 } } },
      { t: 'Lavar um prato', d: 'Em sinal de respeito.', ok: { txt: 'Não serve de nada. Sente-se melhor.', fx: { xp: 1, vida: 1 } } },
    ] },

  { id: 'm_escudo', terreno: 'costa', titulo: 'O Que o Mar Devolve',
    texto: 'Pescadores puxam uma rede que não vem. Dizem que há qualquer coisa enorme lá em baixo, e redondo, a brilhar quando há tempestade. Toda a gente sabe o que a rainha atirou aqui. Ninguém se atreve a ir lá ver.',
    fundo: 'Thereza Raizobak lançou o Escudo dos Cinco Sóis ao mar revolto do norte, alegando que os humanos já não precisavam dele. Foi a decisão mais generosa que um rei tomou em Madeira Negra, e pode bem ter sido a pior.',
    opcoes: [
      { t: 'Mergulhar', d: 'Só o Marinheiro. Sabe quanto dura o fôlego.', tipo: 'habilidade', req: { bg: 'marinheiro' }, ok: { txt: 'Vê-o. É maior do que julgava, e não o consegue mover. Volta à tona com moedas antigas, e alguns anos de sorte.', fx: { ouro: 8, xp: 4 } } },
      { t: 'Puxar com eles', d: 'Precisam de mais braços.', tipo: 'habilidade', roll: { a: 'forca', dc: 11 }, ok: { txt: 'Sai um esqueleto de baleia, e uma arca. Eles ficam com a baleia.', fx: { ouro: 8, xp: 1 } }, ko: { txt: 'A corda salta, e leva parte das suas mãos.', fx: { vida: -3 } } },
      { t: 'Fazer perguntas', d: 'Quem mais tem vindo aqui.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Um velho de capuz veio cá, três vezes. Passa a noite a pensar nisso, e aprende alguma coisa.', fx: { xp: 4 } }, ko: { txt: 'Não querem falar, e cobram-lhe o peixe.', fx: { ouro: -1 } } },
      { t: 'Ver a tempestade', d: 'Isso, ninguém paga.', ok: { txt: 'Por um instante, pareceu-lhe mesmo ver um sol debaixo de água.', fx: { xp: 1 } } },
    ] },
  { id: 'm_barco', terreno: 'costa', titulo: 'Os Que Partem',
    texto: 'Uma família de halflings espera no cais, com uma mala por pessoa. Um capitão de um olho só conta as moedas, e olha para o mar sem nenhuma confiança. "Aramon", diz. "Se lá chegarmos. Toda a gente quer ir, desde que começou a cheirar a queimado."',
    fundo: 'Os Sedrix foram os primeiros a atravessar, e nunca voltaram para o dizer. Dizem que do outro lado há um continente onde os deuses de cá não podem pôr os pés. Por isso, os que têm pior consciência foram sempre os que quiseram ir primeiro.',
    opcoes: [
      { t: 'Pagar a passagem de quem não tem', d: 'Custa 5 de Ouro.', ok: { txt: 'A menina mais nova dá-lhe uma folha negra. Alguém, algures, vai lembrar-se disto.', fx: { ouro: -5, xp: 4, marca: 'halflings' } } },
      { t: 'Regatear pelo cais', d: 'As pessoas que partem vendem tudo.', ok: { txt: 'O que não cabe nas malas fica aqui, muito barato.', fx: { mercado: true } } },
      { t: 'Ajudar a carregar', d: 'Em troca de notícias.', tipo: 'habilidade', roll: { a: 'forca', dc: 10 }, ok: { txt: 'O capitão diz-lhe o que traz a bordo, e o que lhe pagaram para não trazer.', fx: { xp: 3, ouro: 3 } }, ko: { txt: 'Uma das malas pesava muito mais do que parecia, e aterrou no seu pé.', fx: { vida: -2 } } },
    ] },
];

const CONSEQUENCIAS_MADEIRA = [
  { id: 'volta_monges', marca: 'monges', titulo: 'Um Monge na Estrada',
    texto: 'Um homem de faixa vermelha caminha ao seu lado durante meia hora antes de dizer alguma coisa. "O mestre soube o que fez no Santuário", diz. "Não agradece. Mas mandou-me."',
    fundo: 'Strider saiu do monastério para seguir Olares Salazar, e voltou sempre que podia. É dos poucos que conseguem falar com Adarkar sem perderem a paciência, e com o velho Altrair sem perderem a calma.',
    opcoes: [
      { t: 'Levá-lo consigo', d: 'Não vai dizer que não.', ok: { txt: 'Não traz nada, e não faz ruído nenhum. Às vezes, esquece-se que ele lá está.', fx: { aliado: 'strider' } } },
      { t: 'Pedir-lhe uma lição', d: 'Só uma.', ok: { txt: 'A lição é ficar parado. Dói mais do que parece.', fx: { xp: 5, vida: 2 } } },
    ] },
  { id: 'volta_halflings', marca: 'halflings', titulo: 'Sopa de Quem Ficou',
    texto: 'Uma carroça para ao seu lado, e reconhece a avó da sopa. Vão a caminho de Karpulsa, e cabe sempre mais um. "Disseram-nos que tinha razão", diz, e já lhe está a pôr um prato no colo. "Coma."',
    fundo: 'Os halflings foram os únicos a quem os deuses deram lugar à sombra da árvore. Pela primeira vez desde a criação, a maior parte vive noutro sítio qualquer. Nenhum deles deixou de olhar para trás.',
    opcoes: [
      { t: 'Comer', d: 'Não se discute.', ok: { txt: 'Sai dali mais cheio do que entrou, e mais forte, e com uma folha nova no bolso.', fx: { vida: 7, xp: 2 } } },
    ] },
  { id: 'volta_cruzados', marca: 'cruzados', titulo: 'O Último Cruzado',
    texto: 'O homem à sua frente traz uma armadura muito usada, sem brasão, e olha para si como quem conta quantos consegue vencer antes do almoço. "Salvou um dos meus homens na estrada", diz. "Sou Tiago Raizobak. Para onde vai?"',
    fundo: 'Tiago nunca matou Ivan, mesmo quando pôde. É algo que lhe custa explicar aos soldados e, durante as noites, a si próprio. Diz a toda a gente que está a seguir uma pista.',
    opcoes: [
      { t: 'Convidá-lo a ir consigo', d: 'Vai ser pouco tempo, diz ele.', ok: { txt: 'Vai consigo até ver como isto acaba, e passa a noite de costas para o fogo.', fx: { aliado: 'tiago' } } },
      { t: 'Pedir-lhe equipamento', d: 'Agalor tem muito disso.', ok: { txt: 'Ele nem pestaneja, e tira da carroça um peitoral com o sol dos Raizobak.', fx: { item: 'mn_peitoral' } } },
    ] },
  { id: 'volta_elfos', marca: 'elfos', titulo: 'A Elfa do Arco',
    texto: 'Uma flecha crava-se à frente do seu pé. Traz uma nota enrolada: "Não vão dizer-lhe obrigado, em Karpulsa. Isto é o mais perto disso que há." No fundo da estrada, alguém faz-lhe um aceno muito pequeno, e desaparece.',
    fundo: 'Os elfos de Karpulsa perderam quase todos os seus Salazar em menos de cinquenta anos, e sabem cada vez menos a quem obedecer. Têm um novo regente que nunca dorme, e já há batedores a guardar segredos dele.',
    opcoes: [
      { t: 'Ler o resto', d: 'Há mais do que parece.', ok: { txt: 'No verso, há um caminho que já não vem nos mapas e uma quantia.', fx: { ouro: 5, xp: 4 } } },
    ] },
];

const SURPRESAS_MADEIRA = [
  { inimigo: 'O Clã das Chamas', pv: 6,
    contra: 'Um jarro rebenta contra a sua bota, e o fogo sobe depressa. Atrás dele, vêm os risinhos de uma dúzia de kobolds.',
    favor: 'O cheiro a óleo chega antes deles. Graças à sua cautela, encontra uma fila de kobolds a tentar carregar um barril, a discutir sobre quem manda.',
    saque: 5 },
  { inimigo: 'Batedores de Trunfisk', pv: 8,
    contra: 'Os cavalos saem do meio da erva alta, e já lhe estão a pôr um laço. "Vai para norte?", pergunta o maior. "Já não."',
    favor: 'Do alto de uma elevação, vê três batedores orcs a descansar, com os cavalos presos e as armas longe da mão.',
    saque: 7 },
  { inimigo: 'O Bugbear', pv: 8,
    contra: 'Não ouviu nada até lhe tocar no ombro. Era muito maior do que qualquer coisa tão silenciosa tinha o direito de ser.',
    favor: 'Vê-lhe as costas enormes, debruçadas sobre uma panela. Nunca ninguém apanhou um bugbear distraído, e talvez nunca volte a acontecer.',
    saque: 4 },
  { inimigo: 'Enviados de {vilao}', pv: 8,
    contra: 'Cortam-lhe o caminho, sem nenhuma pressa. Sabem o seu nome. Alguém os mandou aqui de propósito.',
    favor: 'Encontra-os a montar guarda numa ponte. Estão à sua espera, mas a olhar para o lado errado.',
    saque: 8 },
  { inimigo: 'Salteadores da Mancha', pv: 7,
    contra: 'Saem da terra queimada, com as caras pintadas de cinza. Não querem nada de especial. Só tudo.',
    favor: 'Fumo pouco cuidado. Um grupo de salteadores assa qualquer coisa, e está a discutir por causa de um saco.',
    saque: 6 },
];

const BONS_ENCONTROS_MADEIRA = [
  { id: 'm_fruto', titulo: 'A Sombra da Árvore',
    texto: 'Sem aviso, a luz muda. Lá ao longe, acima de tudo, vê-se a copa negra da Uillyh, e por um momento nada lhe dói. Uma velha elfa está parada no caminho, a olhar para o mesmo. "Ninguém a vê assim duas vezes", diz. "Aproveite."',
    opcoes: [
      { t: 'Ficar a olhar', d: 'Por um instante.', ok: { txt: 'Respira fundo. É como se lhe tivessem devolvido alguns anos.', fx: { vida: 7 } } },
      { t: 'Perguntar-lhe o que sabe', d: 'Ela já viu muita coisa.', ok: { txt: 'Fala-lhe da primeira família, e dá-lhe umas moedas, sem que perceba porquê.', fx: { xp: 3, ouro: 3 } } },
    ] },
  { id: 'm_robert', titulo: 'O Homem à Frente',
    texto: 'Um guerreiro de Agalor senta-se numa pedra, a afiar a espada, e olha para a sua guarda com ar crítico. "Tem de estar sempre à frente de quem está a proteger", diz. "Parece simples. Mostro-lhe, se pagar o almoço."',
    opcoes: [
      { t: 'Pagar o almoço', d: 'Custa 2 de Ouro.', ok: { txt: 'Passa a tarde consigo. No fim, parece-lhe que aprendeu uma coisa, e que ele não vai esquecer o almoço.', fx: { ouro: -2, xp: 5 } } },
      { t: 'Convidá-lo a ir consigo', d: 'Não há almoço melhor do que a estrada.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Levanta-se. "Olares vai matar-me", diz, muito contente.', fx: { aliado: 'robert' } }, ko: { txt: 'Ri-se, e continua a afiar.', fx: { xp: 1 } } },
    ] },
  { id: 'm_carga', titulo: 'O Carregamento Perdido',
    texto: 'Uma carroça do Clã das Chamas virou-se numa vala, e os kobolds fugiram de alguma coisa que já lá não está. Debaixo da lona há sacos de muitas caravanas, e um jarro de óleo muito bem tapado.',
    opcoes: [
      { t: 'Levar os sacos', d: 'É o dinheiro de quem já não precisa.', ok: { txt: 'Moedas de três reinos. Ninguém as vai reclamar.', fx: { ouro: 12 } } },
      { t: 'Procurar as encomendas', d: 'Vale mais do que o ouro.', tipo: 'investigacao', roll: { a: 'mente', dc: 9 }, ok: { txt: 'Lista de nomes, datas e rotas. Aprende muito, e ainda fica com a caixa do cabo.', fx: { xp: 6, ouro: 4 } }, ko: { txt: 'O jarro não estava assim tão bem tapado.', fx: { vida: -1 } } },
    ] },
];

const MERCADOR_SECRETO_MADEIRA = {
  titulo: 'O Último Sedrix',
  texto: 'Fora das estradas, há uma carroça sem brasão, e um anão muito velho a martelar debaixo de um toldo. Não o olha nos olhos: olha para a sua arma. "Os meus foram-se embora pelo mar", diz. "Eu fiquei a acabar um trabalho. Quer ver o que sei fazer?"',
  fundo: 'Quando Edgard Sedrix partiu com o Elmo, nem todos couberam nos barcos. Os que ficaram são os únicos anões de Madeira Negra, e nenhum deles diz de onde é. Trabalham para quem pagar, e fazem o melhor aço do continente.',
  opcoes: [
    { t: 'Mostrar-lhe o equipamento', d: 'Melhorias com 30% de desconto.', ok: { txt: 'Passa o polegar pelo gume, e estende a mão para o resto.', fx: { forja: 'secreto' } } },
    { t: 'Ver o que traz para vender', d: 'Coisas que não se vendem no mercado.', ok: { txt: 'Abre a carroça sem dizer nada.', fx: { mercado: true } } },
    { t: 'Seguir caminho', d: 'Quem não faz perguntas também não dá garantias.', ok: { txt: 'Quando olha para trás, já só se ouve o martelo, ao longe.', fx: {} } },
  ],
};

const ATRASOS_MADEIRA = {
  cidade: [...ATRASOS.cidade, { id: 'm_tributo', titulo: 'A Contagem de Cabeças',
    texto: 'Fecharam as portas da cidade, e estão a contar quem entra e quem sai. Um escriba com a pena na boca pergunta-lhe de que raça é, e já tem a resposta escrita. Há uma fila enorme atrás de si.',
    opcoes: [
      { t: 'Esperar na fila', d: 'Perde um dia.', ok: { txt: 'Ao fim do dia, é um número num livro.', fx: { dia: 1 } } },
      { t: 'Pagar a quem conta', d: 'Custa 4 de Ouro.', ok: { txt: 'O escriba conta-o sem o ver.', fx: { ouro: -4 } } },
      { t: 'Fingir uma doença', d: 'Com muita tosse.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Abrem caminho, e pedem-lhe para sair depressa.', fx: {} }, ko: { txt: 'Põem-no em quarentena. Demora um dia a sair disto.', fx: { dia: 1, vida: -1 } } },
    ] }],
  estrada: [...ATRASOS.estrada, { id: 'm_manada', titulo: 'Os Javalis de Guerra',
    texto: 'Um rebanho de javalis enormes, com restos de arreios, enche o caminho, e os pastores goblins gritam em todas as direções. Ninguém tem nenhum controlo sobre nada, e os javalis têm os seus próprios planos.',
    opcoes: [
      { t: 'Esperar que passem', d: 'Perde um dia.', ok: { txt: 'Ao fim do dia, a estrada está toda revolvida, mas é sua.', fx: { dia: 1 } } },
      { t: 'Passar pelo meio', d: 'Sem nenhum movimento brusco.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Sai do outro lado, e um goblin aplaude.', fx: { xp: 2 } }, ko: { txt: 'Um javali discorda da sua estratégia, com as presas.', fx: { dia: 1, vida: -2 } } },
    ] }],
};

const FIM_MORTE_MADEIRA = {
  titulo: 'A Sua Linha de Força',
  texto: 'Os deuses deram a cada ser uma linha, e a sua acaba numa estrada de Madeira Negra, longe de casa. Ninguém a vai medir. Mas, na Uillyh, uma folha negra cai sem vento, e os halflings tiram os sapatos sem saber porquê.',
};
const FIM_TARDE_MADEIRA = {
  titulo: 'Tarde de Mais',
  texto: 'Quando chega, a poeira já assentou, e a erva nem está queimada. {vilao} passou por aqui há dias, e levou o que veio buscar. Os cinco ovos estão um passo mais perto uns dos outros, e em Madeira Negra já ninguém dorme descansado.',
};
const PRESSAGIOS_MADEIRA = [
  'O tempo aperta. O céu do norte tem cor de fumo, os exércitos partiram, e tudo vai ser mais difícil a partir de agora.',
  'O prazo chegou ao fim. {vilao} está mais forte a cada dia, e a própria Uillyh parece mais escura, vista de longe.',
];

const LORE_MADEIRA = {
  agalor: { nome: 'Agalor', titulo: 'Agalor', texto: 'O planalto dos humanos do norte, terra dos Raizobak. Foi destruída pelos orcs, à exceção do castelo, que resistiu sob a redoma do Escudo. Durante oitenta anos, chamou-se Agalor Devastada e Agalor Protegida. A rainha Thereza voltou a torná-la uma só.' },
  trunfisk: { nome: 'Trunfisk', titulo: 'Trunfisk', texto: 'As planícies dos orcs, governadas pelos Mão-de-Aço, os protetores do leste. Os seus mestres da brutalidade ensinam que a força guarda-se no peito, e que se usa com as mãos.' },
  erubor: { nome: 'Erubor', titulo: 'Erubor', texto: 'As montanhas do oeste, casa dos anões Sedrix. Depois da invasão de Garkum, ficaram sem habitantes das raças principais. Hoje, são kobolds, gnolls e pelo menos um dragão verde.' },
  karpulsa: { nome: 'Karpulsa', titulo: 'Karpulsa', texto: 'A floresta dos elfos, e a cidade dos Salazar, protetores do sul. Ainda há nela uma proteção mágica que ninguém sabe bem como retirar, e que faz andar em círculos quem não foi convidado.' },
  uillyh: { nome: 'Uillyh', titulo: 'A Uillyh', texto: 'A Árvore da Vida, onde terminam as veias que os deuses traçaram por todo o mundo. É por causa da cor do seu tronco que o continente se chama Madeira Negra. Dizem que quem comer o seu fruto se torna imortal, e os deuses preferem que ninguém o experimente.' },
  yavimaya: { nome: 'Yavimaya', titulo: 'A Floresta de Yavimaya', texto: 'Os humanos quiseram apropriar-se de uma floresta onde os orcs tiravam recursos. Foi a primeira guerra entre as raças. Passou de mãos muitas vezes, e está cheia de gente enterrada com as suas armas.' },
  lamina: { nome: 'Lâmina dos Cinco Sóis', titulo: 'A Lâmina dos Cinco Sóis', texto: 'A espada entregue a Aramil Salazar, o primeiro dos protetores. Quando os orcs invadiram Karpulsa, ele transformou-a em espírito e guardou-a em cinco ovos de pedra. Disse que o herdeiro seria o mais novo dos rapazes de Salazar, depois da sua morte.' },
  cinco: { nome: 'Cinco Sóis', titulo: 'Os Artefactos dos Cinco Sóis', texto: 'Os deuses deram a cada família protetora um presente: uma Espada aos Salazar, um Elmo aos Sedrix, uma Armadura aos Mão-de-Aço, um Escudo aos Raizobak e um par de Grevas aos York Namy. Hoje, nenhum deles está onde os deuses o deixaram.' },
  ovos: { nome: 'ovo', titulo: 'Os Cinco Ovos', texto: 'Darkwater é azul e preto. Mossfire é vermelho e verde. Skycloud é azul e branco. Sungrass é verde e branco. Shadowblood é vermelho e preto. Foi Soveliss Salazar quem lhes deu os nomes, e foi quase por acaso que chegaram às mãos de cada um.' },
  profeta: { nome: 'Profeta', titulo: 'O Profeta', texto: 'Um velho sábio de capuz que se junta aos Cruzados de Agalor, e os ajuda em várias missões. É ele quem diz a Ivan que nasceu para a Lâmina. O nome, ele próprio o escolheu.' },
  veitan: { nome: 'Veitan', titulo: 'Veitan das Sombras Profundas', texto: 'Um elfo de família humilde de Karpulsa, com a idade de Ezuri, que aprendeu mais do que devia sobre poderes ocultos. Tornou-se vizir dos pais de Ezuri e Olares. Usa magia de sangue, sem nunca fazer barulho.' },
  ivan: { nome: 'Ivan', titulo: 'Ivan Galonadel', texto: 'Um elfo criado pelos orcs de Trunfisk. Gorkum Mão-de-Aço encontrou-o em criança, durante a invasão de Karpulsa, e deu-lhe um nome por não saber o verdadeiro. Foi um dos Cruzados de Agalor, e o melhor amigo de Tiago. O frenesi dele é o de um bárbaro. O que veio depois, ninguém sabe bem de quem é.' },
  ezuri: { nome: 'Ezuri', titulo: 'Ezuri Salazar', texto: 'O mais novo dos rapazes de Salazar, e por isso o herdeiro da Lâmina. Irmão de Olares. Ficou de fora da proteção élfica durante a invasão, e foi dado como morto. Sianodel saiu para o procurar, e não voltou. Hoje tem outro nome, e não sabe.' },
  olares: { nome: 'Olares', titulo: 'Olares Salazar', texto: 'Feiticeira da família protetora. Foi o vizir Veitan que lhe pediu para reunir um grupo e procurar os ovos, e ela pediu-lhe os conselhos que ele sabia que iria pedir. Tem um irmão que não sabe que está vivo.' },
  tiago: { nome: 'Tiago', titulo: 'Tiago Raizobak', texto: 'Líder dos Cruzados de Agalor, e o último a merecer o nome. Podia ter morto Ivan, e não o fez. Heironeus tem andado a olhar para ele, e os deuses nunca olham para ninguém por acaso.' },
  cruzados: { nome: 'Cruzados', titulo: 'Os Cruzados de Agalor', texto: 'Tiago, Ivan, a Mestra e Tevish derrotaram juntos Trotark e o Clã das Chamas, e foram aclamados por humanos, elfos e halflings. Pouco depois, um velho de capuz foi ter com eles.' },
  andarilhos: { nome: 'Andarilhos', titulo: 'Os Andarilhos Fantasmas', texto: 'O que restou dos Cruzados, sem Tiago. Ninguém se lembra de quem começou a chamar-lhes assim, mas todos concordam que não era elogio.' },
  mestra: { nome: 'Mestra', titulo: 'A Mestra', texto: 'Ester Szar, filha de Altrair. Roubou os quatro pergaminhos proibidos, e perdeu a fala, a audição, o tato e o paladar. Parte metal como se fosse vidro, e os elementos não lhe tocam. Comunica por sinais, e Ivan foi aprender para lhe falar.' },
  tevish: { nome: 'Tevish', titulo: 'Tevish Szar', texto: 'O filho do meio de Altrair. Perdeu um desafio contra o irmão Adarkar, e cegou-o com um golpe covarde. O pai expulsou-o dos Punhos Flamejantes. Segue a irmã, e cobra sempre as promessas que lhe fazem.' },
  adarkar: { nome: 'Adarkar', titulo: 'Adarkar Szar', texto: 'O mais velho dos filhos de Altrair, e o melhor dos três. Ficou cego por causa do irmão, e não deixou o monastério. Dizem que nunca falhou um golpe, desde então.' },
  altrair: { nome: 'Altrair', titulo: 'Altrair Szar', texto: 'Humano de família respeitada, fundou o clã dos Punhos Flamejantes para aliar a paz interior à força dos punhos. Teve a oportunidade de deter a filha, e não a aproveitou. É a única coisa que ainda o tira da meditação.' },
  punhos: { nome: 'Punhos Flamejantes', titulo: 'Os Punhos Flamejantes', texto: 'O monastério a sul de Yavimaya, onde se aprende a lutar sem pressa. No Santuário Sagrado, guardavam-se quatro técnicas proibidas. Agora, guarda-se apenas o lugar onde elas estavam.' },
  trotark: { nome: 'Trotark', titulo: 'Trotark, o Incendiário', texto: 'Chefe do Clã das Chamas, um grupo de emboscadores kobolds e gnolls. Rouba viajantes de Agalor, e nunca foi visto sem uma tocha.' },
  groskel: { nome: 'Groskel', titulo: 'Groskel Mão-de-Aço', texto: 'Rei de Trunfisk, o último de uma família que quase venceu o continente. A Armadura dos Cinco Sóis não está com ele: Gorkum entregou-a a um elfo, e ele nunca compreendeu porquê.' },
  maodeaco: { nome: 'Mão-de-Aço', titulo: 'Os Mão-de-Aço', texto: 'A família protetora dos orcs. Grakutar recebeu a armadura, Gerkar perdeu um braço, Gerkaria conquistou o norte, Garkum quis o continente inteiro. Foi Thereza Raizobak quem o destruiu.' },
  thereza: { nome: 'Thereza', titulo: 'A Rainha Thereza', texto: 'Libertou os humanos da redoma, destruiu Garkum, e reconstruiu Agalor. Depois, atirou o Escudo dos Cinco Sóis ao mar, porque os humanos não iam precisar dele. É amada, e é difícil não concordar com ela.' },
  artamin: { nome: 'Artamin', titulo: 'Artamin York Namy', texto: 'Senhor dos halflings da Uillyh. Tem uma filha pequena, Mona Lisa, e uma porta que ficou segura durante anos graças a uma pedra muito bonita.' },
  sedrix: { nome: 'Sedrix', titulo: 'Os Sedrix', texto: 'A família protetora dos anões. Edgard entregou o Elmo aos orcs, voltou a roubá-lo, e fugiu com o seu povo pelo mar. Ninguém os voltou a ver.' },
  heironeus: { nome: 'Heironeus', titulo: 'Heironeus', texto: 'O deus da justiça. Quando os deuses pararam de se intrometer, prometeram não voltar a pôr os pés no mundo. Há quem diga que este será o primeiro a quebrar a promessa.' },
  corellon: { nome: 'Corellon', titulo: 'Corellon', texto: 'O deus a quem os elfos agradecem as suas dádivas, sobretudo as que mais tarde se revelam ser outra coisa.' },
  linha: { nome: 'Linha de Força', titulo: 'A Linha de Força', texto: 'As veias do mundo, traçadas pelos deuses, terminam na Uillyh. Cada ser tem a sua própria linha, e a duração é decidida conforme a raridade e o carácter de cada um.' },
};

// ---------- O mundo ----------

MUNDOS.madeira = {
  glyph: 'leaf', desc: 'Cinco ovos, uma lâmina, e a Árvore da Vida. Antes de haver Império, houve um amigo a mudar de cara.',
  LUGARES: LUGARES_MADEIRA, ESTRADAS: ESTRADAS_MADEIRA, MAPA: MAPA_MADEIRA, OBJETIVOS: OBJETIVOS_MADEIRA, RELIQUIAS: RELIQUIAS_MADEIRA, REFENS: REFENS_MADEIRA, VILOES: VILOES_MADEIRA,
  REVIRAVOLTAS: REVIRAVOLTAS_MADEIRA, GANCHOS: GANCHOS_MADEIRA, ENCONTROS: ENCONTROS_MADEIRA, CONSEQUENCIAS: CONSEQUENCIAS_MADEIRA, SURPRESAS: SURPRESAS_MADEIRA, BONS_ENCONTROS: BONS_ENCONTROS_MADEIRA,
  MERCADOR_SECRETO: MERCADOR_SECRETO_MADEIRA, ATRASOS: ATRASOS_MADEIRA, FIM_MORTE: FIM_MORTE_MADEIRA, FIM_TARDE: FIM_TARDE_MADEIRA, PRESSAGIOS: PRESSAGIOS_MADEIRA, LORE: LORE_MADEIRA,
};

// A Mestra entra também como vilã de Daraan, no fim do Império, nas planícies de M'hari.
VILOES_DARAAN.mestra = { nome: 'a Mestra', destino: 'mhari', glyph: 'fist', fraqueza: ['bardo', 'ladino', 'patrulheiro'],
  efeitos: [{ t: 'Um vento só dela encosta-o à pedra, e deixa-o sem ar.', tipo: 'fraco', v: 3 }, { t: 'Passa os dedos pela sua arma, e o metal racha como vidro.', tipo: 'dreno', v: 2 }],
  motivos: ['A última dos Andarilhos Fantasmas de quem ainda se conta alguma coisa. Vive por um elfo que já não é quem ela amou.', 'Não ouve, não fala, não sente. Só vê, e vê tudo.', 'Muda de corpo quando este se gasta. Quem a matou uma vez já não sabe se a reconheceria.'],
  pistas: [
    'Há espadas partidas em cacos pelas estradas, e os donos juram que ela só lhes tocou com um dedo.',
    'Os pastores falam de uma mulher a quem o fogo não queima, a atravessar um incêndio sem pressa, e sem olhar para o chão.',
    "Em M'hari, há quem a veja a fazer sinais para o vento, sozinha, ao fim da tarde. Parece estar a dizer sempre a mesma coisa.",
  ],
  finalTexto: 'As planícies de M\'hari não têm uma árvore, e o vento para de repente. Uma mulher de pé no meio da erva olha para si, e continua a olhar. {vilao} não diz nada, porque nunca diz. Levanta uma mão e faz um sinal, devagar, para ter a certeza de que você viu. Só muito depois lhe explicam o que quer dizer: "Desculpa."',
  ronda: { combate: 'Ela não sente a dor, mas o corpo sente, e o joelho falha.', social: 'Faz-lhe em sinais o nome de Ezuri. É a única vez que ela pestaneja.', habilidade: 'Ela só tem os olhos. Sai-lhe do campo de visão, e o vento perde o alvo.', investigacao: 'A Transmigração tem um preço, e este corpo já lhe está a acabar.' } };
LORE_DARAAN.mestra = { nome: 'Mestra', titulo: 'A Mestra', texto: 'Uma dos quatro Andarilhos Fantasmas, e a única de quem ninguém ouviu a voz. Perdeu a fala, a audição, o tato e o paladar a troco de quatro técnicas proibidas. Parte metal como se fosse vidro, e não há elemento que lhe faça mal.' };
