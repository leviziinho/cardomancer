// Todo o conteúdo do jogo está aqui: para acrescentar cartas ou cenas, basta editar este ficheiro.
// Atributos: forca, agilidade, mente, carisma.
// Requisitos de uma opção (req): cls (classe), raca, bg (antecedente), item, pistas (mínimo).
// Efeitos (fx): vida, ouro, pista. Uma opção sem "roll" tem sucesso automático.

const ATTR = {
  forca: { nome: 'Força', glyph: 'hammer' },
  agilidade: { nome: 'Agilidade', glyph: 'feather' },
  mente: { nome: 'Mente', glyph: 'eye' },
  carisma: { nome: 'Carisma', glyph: 'speech' },
};

const CLASSES = {
  barbaro: { nome: 'Bárbaro', glyph: 'axe', vida: 12, attrs: { forca: 3, agilidade: 1 }, desc: 'Resolve portas, grilhões e discussões da mesma maneira: com força.' },
  ladino: { nome: 'Ladino', glyph: 'dagger', vida: 8, attrs: { agilidade: 3, mente: 1 }, desc: 'Vê a armadilha antes de a pisar e a saída antes de precisar dela.' },
  bardo: { nome: 'Bardo', glyph: 'note', vida: 8, attrs: { carisma: 3, agilidade: 1 }, desc: 'Convence um inimigo de que nunca houve motivo para lutar.' },
  mago: { nome: 'Mago', glyph: 'star', vida: 7, attrs: { mente: 3, carisma: 1 }, desc: 'Lê as runas que os outros tomam por riscos na pedra.' },
  clerigo: { nome: 'Clérigo', glyph: 'sun', vida: 10, attrs: { mente: 2, carisma: 2 }, desc: 'Sara feridas e manda de volta o que devia continuar morto.' },
  patrulheiro: { nome: 'Patrulheiro', glyph: 'bow', vida: 10, attrs: { agilidade: 2, forca: 2 }, desc: 'Lê a terra como quem lê um livro aberto.' },
};

const ANTECEDENTES = {
  soldado: { nome: 'Soldado', attrs: { forca: 1 }, vida: 1, desc: 'Sobreviveu a uma guerra que já ninguém recorda. +1 Força, +1 Vida.' },
  erudito: { nome: 'Erudito', attrs: { mente: 1 }, pista: 1, desc: 'Leu o que não devia. +1 Mente e começa com 1 Pista.' },
  criminoso: { nome: 'Criminoso', attrs: { agilidade: 1 }, ouro: 3, desc: 'Conhece quem vende e quem cala. +1 Agilidade, +3 Ouro.' },
  nobre: { nome: 'Nobre Caído', attrs: { carisma: 1 }, ouro: 6, desc: 'Perdeu as terras, mas não as maneiras. +1 Carisma, +6 Ouro.' },
  eremita: { nome: 'Eremita', attrs: { mente: 1 }, vida: 2, desc: 'Anos de silêncio ensinaram-lhe a resistir. +1 Mente, +2 Vida.' },
  marinheiro: { nome: 'Marinheiro', attrs: { agilidade: 1 }, vida: 1, desc: 'Nós, marés e estrelas não têm segredos. +1 Agilidade, +1 Vida.' },
};

const RACAS = {
  humano: { nome: 'Humano', attrs: { carisma: 1 }, ouro: 2, desc: 'Adapta-se a tudo e fala com todos. +1 Carisma, +2 Ouro.' },
  elfo: { nome: 'Elfo', attrs: { agilidade: 1 }, desc: 'Vê no escuro e ouve a floresta. +1 Agilidade.' },
  anao: { nome: 'Anão', attrs: { forca: 1 }, vida: 2, desc: 'Teimoso como a pedra que conhece bem. +1 Força, +2 Vida.' },
  halfling: { nome: 'Halfling', attrs: { agilidade: 1 }, vida: 1, desc: 'Pequeno, discreto e estranhamente sortudo. +1 Agilidade, +1 Vida.' },
  meioorc: { nome: 'Meio-Orc', attrs: { forca: 2 }, desc: 'Ninguém lhe cobra portagem duas vezes. +2 Força.' },
  tiefling: { nome: 'Tiefling', attrs: { carisma: 1, mente: 1 }, desc: 'Sangue antigo, olhar incómodo. +1 Carisma, +1 Mente.' },
};

const EQUIPAMENTOS = {
  corda: { nome: 'Corda e Gancho', desc: 'Abre caminhos onde não há caminho.' },
  lanterna: { nome: 'Lanterna Furta-Fogo', desc: 'Luz que só aponta para onde você quer.' },
  pocao: { nome: 'Poção de Cura', desc: 'Se a sua Vida chegar a 0, recupera 5. Uma única vez.' },
  amuleto: { nome: 'Amuleto de Prata', desc: 'Os mortos-vivos hesitam diante dele.' },
  mapa: { nome: 'Mapa Rasgado', pista: 1, desc: 'Marcas de alguém que já andou nisto. Começa com +1 Pista.' },
  espada: { nome: 'Espada de Família', attrs: { forca: 1 }, desc: 'Velha, mas de confiança. +1 Força.' },
  capa: { nome: 'Capa Cinzenta', attrs: { agilidade: 1 }, desc: 'Confunde-se com a noite. +1 Agilidade.' },
  diario: { nome: 'Diário Cifrado', attrs: { mente: 1 }, desc: 'As notas de um sábio desaparecido. +1 Mente.' },
  anel: { nome: 'Anel de Sinete', attrs: { carisma: 1 }, desc: 'Abre portas e calou muita gente. +1 Carisma.' },
};

// Coordenadas normalizadas sobre o mapa (0–1).
const LUGARES = {
  porto: { nome: 'Porto Salgado', x: 0.13, y: 0.72, terreno: 'cidade', cidade: true, desc: 'Cheiro a sal e dívidas. Começa na costa do sudoeste.' },
  vale: { nome: 'Vale Cinza', x: 0.17, y: 0.30, terreno: 'cidade', cidade: true, desc: 'Moinhos parados e gente de poucas falas. Começa no noroeste.' },
  lumiar: { nome: 'Lumiar', x: 0.47, y: 0.86, terreno: 'cidade', cidade: true, desc: 'A cidade dos sinos, que tocam sem razão há três noites. Começa no sul.' },
  pedra: { nome: 'Pedra-Alta', x: 0.50, y: 0.16, terreno: 'cidade', cidade: true, desc: 'Fortaleza de mineiros agarrada à serra. Começa no norte.' },
  vesper: { nome: 'Floresta de Vésper', x: 0.30, y: 0.50, terreno: 'floresta' },
  ponte: { nome: 'Ponte do Enforcado', x: 0.34, y: 0.76, terreno: 'estrada' },
  corvo: { nome: 'Passo do Corvo', x: 0.36, y: 0.22, terreno: 'montanha' },
  velas: { nome: 'Pântano das Velas', x: 0.58, y: 0.64, terreno: 'pantano' },
  cruz: { nome: 'Encruzilhada Velha', x: 0.50, y: 0.44, terreno: 'estrada' },
  ossario: { nome: 'Ruínas de Ossário', x: 0.70, y: 0.40, terreno: 'ruina' },
  carpa: { nome: 'Enseada da Carpa', x: 0.73, y: 0.80, terreno: 'costa' },
  cardeo: { nome: 'Monte Cárdeo', x: 0.72, y: 0.14, terreno: 'montanha' },
  torre: { nome: 'Torre Afogada', x: 0.90, y: 0.62, terreno: 'costa' },
};

const ESTRADAS = [
  ['porto', 'ponte'], ['porto', 'vesper'], ['vale', 'vesper'], ['vale', 'corvo'],
  ['corvo', 'pedra'], ['pedra', 'cruz'], ['pedra', 'cardeo'], ['corvo', 'cruz'],
  ['vesper', 'cruz'], ['vesper', 'ponte'], ['ponte', 'lumiar'], ['lumiar', 'velas'],
  ['lumiar', 'carpa'], ['cruz', 'velas'], ['cruz', 'ossario'], ['velas', 'ossario'],
  ['velas', 'carpa'], ['ossario', 'cardeo'], ['ossario', 'torre'], ['carpa', 'torre'],
];

const GANCHO = {
  titulo: 'O Selo Partido',
  terreno: 'cidade',
  texto: 'Em {cidade}, um mensageiro cai à sua frente com uma seta nas costas. Na mão traz metade de um selo de cera e, com o último fôlego, murmura: "Antes da lua nova... ninguém mais vai acreditar." Atrás de si, alguém na multidão já se afastou depressa demais.',
  opcoes: [
    { t: 'Revistar o corpo', d: 'Os bolsos de um morto ainda têm muito a dizer.', roll: { a: 'mente', dc: 7 },
      ok: { txt: 'No forro do casaco há um bilhete cifrado com um destino parcial. Agora tem por onde começar.', fx: { pista: 1 } },
      ko: { txt: 'Só encontra moedas ensanguentadas. Pelo menos pagam a próxima refeição.', fx: { ouro: 2 } } },
    { t: 'Perseguir o suspeito', d: 'Ele vira para o beco. Ainda dá tempo.', roll: { a: 'agilidade', dc: 8 },
      ok: { txt: 'Encurrala-o entre dois barris. Antes de fugir pela janela, ele deixa cair uma nota com uma data e um símbolo.', fx: { pista: 1 } },
      ko: { txt: 'Um cotovelo na curva e estrelas à frente dos olhos. Ele desaparece.', fx: { vida: -1 } } },
    { t: 'Consolar o moribundo', d: 'Só o Clérigo pode segurá-lo neste mundo por mais um minuto.', req: { cls: 'clerigo' },
      ok: { txt: 'Uma prece e um fio de luz. O mensageiro recobra a voz por instantes, e diz-lhe tudo o que pode antes de partir em paz.', fx: { pista: 1, vida: 1 } } },
    { t: 'Interrogar a multidão', d: 'Só o Bardo faz um mercado inteiro falar sem dar por isso.', req: { cls: 'bardo' },
      ok: { txt: 'Três piadas, duas canções e uma peixeira contam-lhe tudo: de onde veio o homem e quem lhe pagava.', fx: { pista: 1, ouro: 1 } } },
  ],
};

const ENCONTROS = [
  { id: 'porta', terreno: 'ruina', titulo: 'A Porta de Ferro',
    texto: 'Uma porta de ferro barra o corredor, com um arame finíssimo esticado à altura do tornozelo. Do outro lado ouve-se alguém a respirar. Nas ombreiras, runas gastas repetem a mesma palavra.',
    opcoes: [
      { t: 'Arrombar a porta', d: 'Só o Bárbaro. Dobradiças são uma sugestão.', req: { cls: 'barbaro' }, ok: { txt: 'A porta salta da parede e leva a armadilha com ela. O guarda lá dentro larga a bolsa e foge.', fx: { ouro: 4 } } },
      { t: 'Desarmar a armadilha', d: 'Só o Ladino. Um arame, duas pinças, nenhum drama.', req: { cls: 'ladino' }, ok: { txt: 'Com um estalido suave, o mecanismo morre. Entra sem que ninguém perceba e leva o que encontra.', fx: { ouro: 5 } } },
      { t: 'Ler as runas', d: 'Só o Mago. A palavra é, afinal, uma senha.', req: { cls: 'mago' }, ok: { txt: 'Pronuncia a palavra e a porta abre-se sozinha. Lá dentro há papéis que alguém queria muito esconder.', fx: { pista: 1 } } },
      { t: 'Forçar com cuidado', d: 'Evitar o arame e empurrar com tudo.', roll: { a: 'forca', dc: 8 }, ok: { txt: 'A porta cede de má vontade, e passa sem acordar o mecanismo.', fx: { ouro: 2 } }, ko: { txt: 'O arame rebenta. Uma agulha acerta-lhe no ombro e a dor sobe pelo braço.', fx: { vida: -2 } } },
      { t: 'Procurar outra passagem', d: 'Nenhuma porta merece tanto.', roll: { a: 'mente', dc: 7 }, ok: { txt: 'Uma grelha solta leva-o ao outro lado, sujo mas inteiro.', fx: {} }, ko: { txt: 'Perde horas nos corredores e acaba por sair onde começou, e ferido numa queda.', fx: { vida: -1 } } },
    ] },
  { id: 'cripta', terreno: 'ruina', titulo: 'A Cripta dos Sussurros',
    texto: 'As lajes abrem-se para uma cripta fria. Figuras magras levantam-se devagar dos nichos, a sussurrar nomes, e um deles parece ser o seu.',
    opcoes: [
      { t: 'Expulsar os mortos', d: 'Só o Clérigo. A luz não negocia.', req: { cls: 'clerigo' }, ok: { txt: 'A prece enche a cripta de luz e os mortos voltam aos nichos, quase agradecidos. Fica com as oferendas.', fx: { ouro: 4, vida: 1 } } },
      { t: 'Erguer o amuleto', d: 'Requer o Amuleto de Prata.', req: { item: 'amuleto' }, ok: { txt: 'A prata arde sem queimar e os mortos abrem-lhe caminho. Num nicho, um velho registo fala de coisas recentes.', fx: { pista: 1 } } },
      { t: 'Correr pela cripta', d: 'Eles são lentos. Espera-se.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Dedos frios raspam-lhe a capa, mas chega ao outro lado de um fôlego só.', fx: {} }, ko: { txt: 'Uma mão prende-lhe o tornozelo e custa-lhe sangue para se soltar.', fx: { vida: -2 } } },
      { t: 'Abrir caminho à força', d: 'Ossos partem-se.', roll: { a: 'forca', dc: 9 }, ok: { txt: 'Sobra-lhe pó nas mãos e um caminho livre. Entre os ossos, algumas moedas antigas.', fx: { ouro: 3 } }, ko: { txt: 'São mais do que parecia. Sai de lá a arrastar-se.', fx: { vida: -3 } } },
    ] },
  { id: 'ponte', terreno: 'estrada', titulo: 'Emboscada na Ponte',
    texto: 'Três bandidos saem de trás de um carro virado. O maior aponta-lhe uma besta sem pressa. "A portagem é tudo o que levas contigo", diz. Os outros dois não parecem tão convencidos.',
    opcoes: [
      { t: 'Convencê-los de que não é ameaça', d: 'Só o Bardo. Uma boa história vale mais do que uma bolsa.', req: { cls: 'bardo' }, ok: { txt: 'Ao fim de dois versos já riem. Ao fim de quatro pagam-lhe uma bebida e contam-lhe quem os contratou para vigiar a estrada.', fx: { pista: 1, ouro: 2 } } },
      { t: 'Intimidar o chefe', d: 'Só o Bárbaro. Basta avançar sem abrandar.', req: { cls: 'barbaro' }, ok: { txt: 'Avança sem parar até ele baixar a besta. Os três correm, e deixam para trás o saque do dia.', fx: { ouro: 5 } } },
      { t: 'Passar à frente deles', d: 'Requer Corda e Gancho. Por baixo da ponte ninguém cobra.', req: { item: 'corda' }, ok: { txt: 'Desce pelas vigas e reaparece do outro lado, enquanto eles ainda discutem para onde foi.', fx: {} } },
      { t: 'Lutar', d: 'Antes que ele ganhe coragem.', roll: { a: 'forca', dc: 8 }, ok: { txt: 'Derruba o chefe com o primeiro golpe. Os outros decidem que o emprego não compensa.', fx: { ouro: 3 } }, ko: { txt: 'A seta raspa-lhe as costelas antes de conseguir afugentá-los.', fx: { vida: -2 } } },
      { t: 'Pagar a portagem', d: 'Perde 3 de Ouro, mas segue inteiro.', ok: { txt: 'Contam as moedas devagar, à sua frente, e deixam-no passar com um sorriso.', fx: { ouro: -3 } } },
    ] },
  { id: 'carroca', terreno: 'estrada', titulo: 'A Carroça Partida',
    texto: 'Um mercador sentado na berma olha para uma roda partida como quem olha para um parente falecido. A carga, coberta por lona, range sozinha de vez em quando.',
    opcoes: [
      { t: 'Levantar a carroça', d: 'É só uma carroça cheia.', roll: { a: 'forca', dc: 7 }, ok: { txt: 'A roda volta ao eixo. Agradecido, o mercador paga-lhe e conta-lhe um boato estranho que ouviu na última vila.', fx: { ouro: 3, pista: 1 } }, ko: { txt: 'As costas protestam com um estalo. Ele agradece a intenção.', fx: { vida: -1 } } },
      { t: 'Espreitar a lona', d: 'Só o Ladino. Sem que ele repare.', req: { cls: 'ladino' }, ok: { txt: 'Lá dentro há gaiolas com símbolos riscados e uma bolsa mal escondida, que agora é sua.', fx: { ouro: 5, pista: 1 } } },
      { t: 'Regatear com ele', d: 'Requer o antecedente Nobre Caído. Ele reconhece o sotaque.', req: { bg: 'nobre' }, ok: { txt: 'Ele endireita-se e trata-o por "senhoria". Dá-lhe um desconto no que traz e um conselho sobre o caminho.', fx: { vida: 2, pista: 1 } } },
      { t: 'Seguir viagem', d: 'Cada um com os seus problemas.', ok: { txt: 'Continua sem olhar para trás. Atrás de si, a carga range mais alto.', fx: {} } },
    ] },
  { id: 'cogumelos', terreno: 'floresta', titulo: 'O Círculo de Cogumelos',
    texto: 'O trilho termina num círculo perfeito de cogumelos pálidos. Dentro dele, a chuva não cai. Uma música muito baixa parece chamá-lo pelo nome de infância.',
    opcoes: [
      { t: 'Responder à música', d: 'Só Elfos sabem a resposta.', req: { raca: 'elfo' }, ok: { txt: 'Canta a estrofe que falta. O círculo abre-se num atalho e uma voz sopra-lhe um segredo.', fx: { pista: 1, vida: 2 } } },
      { t: 'Ler os sinais do terreno', d: 'Só o Patrulheiro. Até as fadas deixam pegadas.', req: { cls: 'patrulheiro' }, ok: { txt: 'Dá a volta por onde ninguém olha e encontra as coisas que os enfeitiçados largaram pelo caminho.', fx: { ouro: 6 } } },
      { t: 'Entrar no círculo', d: 'Com a cabeça firme.', roll: { a: 'mente', dc: 8 }, ok: { txt: 'A música desiste de si. No centro há um cálice que lhe devolve as forças.', fx: { vida: 2 } }, ko: { txt: 'Dança até os pés sangrarem e acorda horas depois, a quilómetros dali.', fx: { vida: -2 } } },
      { t: 'Contornar pela lama', d: 'Longe, mas seguro.', roll: { a: 'agilidade', dc: 6 }, ok: { txt: 'Passa à larga, com lama até aos joelhos e a música a esmorecer atrás de si.', fx: {} }, ko: { txt: 'Escorrega numa ravina escondida pelos fetos.', fx: { vida: -1 } } },
    ] },
  { id: 'besta', terreno: 'floresta', titulo: 'Rastros de Besta',
    texto: 'Marcas de garras rasgam os troncos à altura da sua cabeça. O cheiro é recente, e o silêncio dos pássaros também. Algo grande anda por perto, e talvez já o tenha notado.',
    opcoes: [
      { t: 'Virar o caçador', d: 'Só o Patrulheiro. A besta nem vai saber o que aconteceu.', req: { cls: 'patrulheiro' }, ok: { txt: 'Segue os rastros em círculo e surpreende-a pelas costas. Na toca há restos de viajantes e os seus pertences.', fx: { ouro: 5, pista: 1 } } },
      { t: 'Encarar a besta', d: 'Só Meio-Orcs a fazem recuar com um rugido.', req: { raca: 'meioorc' }, ok: { txt: 'Solta um urro que faz tremer as folhas. A besta mede-o, reconsidera e desaparece.', fx: { vida: 1 } } },
      { t: 'Afastar-se em silêncio', d: 'Um passo de cada vez.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Prende a respiração durante uma eternidade, até os pássaros voltarem a cantar.', fx: {} }, ko: { txt: 'Parte um ramo. Sai dali a correr, mas não antes de sentir as garras nas costas.', fx: { vida: -3 } } },
      { t: 'Acender uma fogueira', d: 'Bestas não gostam de fogo. Quase todas.', roll: { a: 'mente', dc: 7 }, ok: { txt: 'A chama afasta-a. Passa a noite em vigília, mas descansa.', fx: { vida: 1 } }, ko: { txt: 'A lenha está húmida e a fumaça só a atrai.', fx: { vida: -2 } } },
    ] },
  { id: 'abismo', terreno: 'montanha', titulo: 'A Ponte de Corda',
    texto: 'A ponte de corda sobre o abismo perdeu metade das tábuas. O vento uiva lá em baixo, e do outro lado alguém deixou pendurada uma lanterna ainda acesa.',
    opcoes: [
      { t: 'Lançar o gancho', d: 'Requer Corda e Gancho.', req: { item: 'corda' }, ok: { txt: 'O gancho morde a rocha ao primeiro lançamento e atravessa em segurança. Junto à lanterna há um saco esquecido.', fx: { ouro: 4 } } },
      { t: 'Encontrar a via dos antigos', d: 'Só Anões veem os degraus escondidos na pedra.', req: { raca: 'anao' }, ok: { txt: 'Há degraus talhados na rocha, invisíveis a quem não sabe. No fundo, uma inscrição recente chama-lhe a atenção.', fx: { pista: 1 } } },
      { t: 'Atravessar a correr', d: 'Quanto menos tempo, melhor.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'As tábuas caem atrás de si, uma a uma. Chega ao outro lado a rir de nervos.', fx: {} }, ko: { txt: 'Uma tábua cede. Fica pendurado pelos braços e sobe com a pele em carne viva.', fx: { vida: -3 } } },
      { t: 'Dar a volta pela serra', d: 'Um dia a mais de frio e fome.', ok: { txt: 'A serra cobra o seu preço em frio. Chega exausto, mas com todos os ossos no lugar.', fx: { vida: -1 } } },
    ] },
  { id: 'ogro', terreno: 'montanha', titulo: 'O Ogro Portageiro',
    texto: 'Um ogro senta-se no único caminho, a roer um osso de cabra. À sua frente, um cartaz escrito à mão diz: "PASAJEM 5 OIRO". O erro ortográfico parece magoá-lo mais a si do que a ele.',
    opcoes: [
      { t: 'Corrigir o cartaz com charme', d: 'Só o Bardo faria disto uma lição de poesia.', req: { cls: 'bardo' }, ok: { txt: 'Ensina-lhe a palavra certa em verso. Comovido, ele deixa-o passar e dá-lhe tudo o que cobrou nesse dia.', fx: { ouro: 6 } } },
      { t: 'Falar com ele na sua língua', d: 'Só Meio-Orcs conhecem estes grunhidos.', req: { raca: 'meioorc' }, ok: { txt: 'Dois grunhidos depois é um primo distante. Ele conta-lhe quem passou ali de noite, e com que carga.', fx: { pista: 1 } } },
      { t: 'Pagar 5 de Ouro', d: 'Honesto e rápido.', ok: { txt: 'Ele morde cada moeda antes de lhe abrir caminho, com solenidade.', fx: { ouro: -5 } } },
      { t: 'Desafiá-lo', d: 'Ele é grande. Você é teimoso.', roll: { a: 'forca', dc: 9 }, ok: { txt: 'Prende-lhe o braço e ele ri-se, admirado, antes de lhe ceder o caminho e o cofre.', fx: { ouro: 5 } }, ko: { txt: 'Acorda do outro lado da montanha, sem saber bem como, e com uma costela a menos no sítio.', fx: { vida: -3 } } },
    ] },
  { id: 'luzes', terreno: 'pantano', titulo: 'Velas no Pântano',
    texto: 'Ao cair da noite, luzinhas azuis acendem-se sobre a água e parecem desenhar um caminho. O guia que contratou não diz nada: limita-se a recuar, devagar, com os olhos muito abertos.',
    opcoes: [
      { t: 'Abrir a lanterna', d: 'Requer a Lanterna Furta-Fogo. A luz certa desfaz a mentira.', req: { item: 'lanterna' }, ok: { txt: 'À luz firme, o caminho falso desaparece e o verdadeiro surge. Num tronco oco, alguém escondeu um embrulho.', fx: { ouro: 3, pista: 1 } } },
      { t: 'Abençoar a água', d: 'Só o Clérigo. As almas só querem descanso.', req: { cls: 'clerigo' }, ok: { txt: 'Uma a uma, as luzes apagam-se, em paz. Uma delas pisca duas vezes e aponta para leste.', fx: { pista: 1, vida: 1 } } },
      { t: 'Seguir as luzes', d: 'Elas devem levar a algum lado.', roll: { a: 'mente', dc: 9 }, ok: { txt: 'Percebe o padrão a tempo e pisa só onde as luzes não apontam.', fx: {} }, ko: { txt: 'Afunda-se até ao peito. Quando sai, a água gelada já lhe levou as forças.', fx: { vida: -3 } } },
      { t: 'Saltar de tronco em tronco', d: 'Ignorar as luzes e confiar nos pés.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Salto a salto, deixa o pântano para trás.', fx: {} }, ko: { txt: 'Um tronco afinal tinha olhos. Fica-lhe a marca dos dentes.', fx: { vida: -2 } } },
    ] },
  { id: 'bruxa', terreno: 'pantano', titulo: 'A Bruxa do Junco',
    texto: 'Uma cabana sobre estacas fumega no meio dos juncos. Uma velha sem pressa estende-lhe uma tigela. "Sopa ou resposta", diz. "As duas têm preço."',
    opcoes: [
      { t: 'Debater magia', d: 'Só o Mago aguenta esta conversa.', req: { cls: 'mago' }, ok: { txt: 'Discutem até de madrugada. Encantada, ela dá-lhe a resposta e ainda a sopa, sem cobrar.', fx: { pista: 1, vida: 3 } } },
      { t: 'Pagar a resposta', d: 'Perde 4 de Ouro.', ok: { txt: 'Ela guarda as moedas num sapo e diz-lhe uma única frase, que só mais tarde fará sentido.', fx: { ouro: -4, pista: 1 } } },
      { t: 'Aceitar a sopa', d: 'Está com fome e já provou pior.', roll: { a: 'forca', dc: 6 }, ok: { txt: 'Sabe a raiz e a castigo, mas sente as forças a voltar.', fx: { vida: 3 } }, ko: { txt: 'Passa a noite a arrepender-se. A velha acha muita graça.', fx: { vida: -1 } } },
      { t: 'Recusar e sair', d: 'Nada de bom vem de tigelas oferecidas.', ok: { txt: 'Ela encolhe os ombros e bebe a sopa ela mesma. Sente-lhe o olhar nas costas durante muito tempo.', fx: {} } },
    ] },
  { id: 'naufragio', terreno: 'costa', titulo: 'O Naufrágio da Maré Baixa',
    texto: 'A maré recuou mais do que devia e deixou a descoberto um navio de casco negro. A carga brilha lá dentro. A água, ao longe, já vem de volta, sem barulho nenhum.',
    opcoes: [
      { t: 'Ler a maré', d: 'Requer o antecedente Marinheiro. Sabe quanto tempo tem.', req: { bg: 'marinheiro' }, ok: { txt: 'Conta as ondas e entra quando deve. Sai com o baú e com o diário do capitão, seco por milagre.', fx: { ouro: 6, pista: 1 } } },
      { t: 'Saquear à pressa', d: 'Agarrar o que der e correr.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Sai com a água pelos joelhos e os bolsos a tilintar.', fx: { ouro: 5 } }, ko: { txt: 'A onda apanha-o no porão e atira-o contra as vigas.', fx: { vida: -3, ouro: 2 } } },
      { t: 'Estudar o casco por fora', d: 'Quem afunda um navio assim, e porquê?', roll: { a: 'mente', dc: 7 }, ok: { txt: 'As marcas no casco não vêm de rochas. Alguém fez isto de propósito.', fx: { pista: 1 } }, ko: { txt: 'Nada faz sentido, e a água já lhe molha as botas.', fx: {} } },
      { t: 'Deixar o navio em paz', d: 'A curiosidade já afogou melhores.', ok: { txt: 'Recua para as dunas. O mar fecha-se sobre o navio como uma boca.', fx: {} } },
    ] },
  { id: 'taberna', terreno: 'cidade', titulo: 'A Taberna do Último Gole',
    texto: 'Lareira, ensopado e uma sala cheia de gente a falar baixo demais. Num canto, uma mesa de dados chama-o, e o taberneiro limpa o mesmo copo há demasiado tempo enquanto o observa.',
    opcoes: [
      { t: 'Atuar na sala', d: 'Só o Bardo. Em troca de jantar e de boatos.', req: { cls: 'bardo' }, ok: { txt: 'Põe a sala a cantar. Ganha uma bolsa, um prato e o nome que toda a gente evitava dizer.', fx: { ouro: 4, vida: 2, pista: 1 } } },
      { t: 'Procurar os contactos certos', d: 'Requer o antecedente Criminoso. Um gesto, e o copo para.', req: { bg: 'criminoso' }, ok: { txt: 'O taberneiro leva-o às traseiras. Vende-lhe uma informação a preço de amigo.', fx: { pista: 1, ouro: -1 } } },
      { t: 'Jogar aos dados', d: 'Só um olho bem treinado vê os dados viciados.', roll: { a: 'agilidade', dc: 7 }, ok: { txt: 'Ganha três rondas seguidas e sai antes que se lembrem de contar.', fx: { ouro: 5 } }, ko: { txt: 'Perde a aposta e leva um soco por protestar.', fx: { ouro: -2, vida: -1 } } },
      { t: 'Descansar', d: 'Um ensopado e uma cama: 2 de Ouro.', ok: { txt: 'Dorme como não dormia há semanas. De manhã, tudo pesa um pouco menos.', fx: { ouro: -2, vida: 4 } } },
    ] },
];

// As tramas secretas: o jogo escolhe uma ao início, e só no fim é revelada.
const TRAMAS = {
  coroa: {
    nome: 'A Coroa Afogada', destino: 'torre', glyph: 'crown',
    resumo: 'O rei que o mar levou há cem anos quer o seu trono de volta, e a lua nova vai trazê-lo.',
    pista1: { titulo: 'A Maré nos Sonhos', terreno: 'estrada',
      texto: 'Em todas as aldeias a mesma história: as pessoas acordam a meio da noite com a boca a saber a sal, e os poços sobem sem chover. Uma velha desenha-lhe no chão uma coroa com ondas por baixo.',
      opcoes: [
        { t: 'Ouvir os sonhadores', d: 'Comparar o que cada um viu.', roll: { a: 'carisma', dc: 7 }, ok: { txt: 'Os sonhos coincidem: uma torre a leste, sobre a água, e alguém a subir devagar as escadas.', fx: { pista: 1 } }, ko: { txt: 'Fecham-lhe as portas na cara. Não querem falar disto a estranhos.', fx: {} } },
        { t: 'Provar a água do poço', d: 'Só o Mago sabe o que procurar nela.', req: { cls: 'mago' }, ok: { txt: 'É água do mar, com um rasto de magia antiga e real. Agora sabe o que procura, e de onde vem.', fx: { pista: 1, vida: 1 } } },
        { t: 'Seguir viagem', d: 'Sonhos são só sonhos.', ok: { txt: 'Segue em frente. Nessa noite, acorda com a boca a saber a sal.', fx: { vida: -1 } } },
      ] },
    pista2: { titulo: 'Os Guardas Molhados', terreno: 'estrada',
      texto: 'Na estrada cruza-se com soldados em armaduras cobertas de cracas, que marcham para leste sem olhar para ninguém. Deixam pegadas de água. Um deles traz uma insígnia com cem anos.',
      opcoes: [
        { t: 'Roubar a insígnia', d: 'Só o Ladino passa entre eles.', req: { cls: 'ladino' }, ok: { txt: 'A insígnia solta-se sem um som. Traz o nome de um rei que todos julgam morto.', fx: { pista: 1, ouro: 3 } } },
        { t: 'Enfrentar um deles', d: 'Para ver o que há debaixo do elmo.', roll: { a: 'forca', dc: 9 }, ok: { txt: 'O elmo salta e só sai água. Mas há um nome gravado por dentro, e agora conhece-o.', fx: { pista: 1 } }, ko: { txt: 'Aquela mão fria parte-lhe duas costelas antes de voltar à marcha.', fx: { vida: -3 } } },
        { t: 'Seguir à distância', d: 'Para onde vão eles?', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Seguem sempre para a mesma torre. O caminho está traçado.', fx: { pista: 1 } }, ko: { txt: 'Perde-os no nevoeiro, e pisa algo que não devia.', fx: { vida: -1 } } },
      ] },
    final: { titulo: 'A Torre Afogada',
      texto: 'A maré vira ao contrário e a torre emerge a pingar. No topo, sobre um trono de coral, o rei afogado volta para si a face inchada. "Vieste beijar a mão ao teu soberano", diz, com uma voz cheia de água.',
      opcoes: [
        { t: 'Partir-lhe a coroa', d: 'Só o Bárbaro. Um golpe, com tudo.', req: { cls: 'barbaro' }, roll: { a: 'forca', dc: 8 }, ok: { txt: 'O machado parte a coroa e o trono racha ao meio. O mar recolhe o que é seu, e os poços voltam a ser só poços.', fim: 'vitoria' }, ko: { txt: 'O golpe resvala e a onda arrasta-o. Sobrevive, mas a lua nova sobe sobre um reino com um rei novo e antigo.', fim: 'derrota' } },
        { t: 'Dizer o seu verdadeiro nome', d: 'Requer 2 Pistas. Um rei não resiste ao próprio nome.', req: { pistas: 2 }, roll: { a: 'mente', dc: 7 }, ok: { txt: 'O nome dele ecoa pela torre e ele lembra-se de que morreu. Larga a coroa, sem luta, e o mar leva-o para sempre.', fim: 'vitoria' }, ko: { txt: 'A sua voz falha na última sílaba. Ele sorri, e a água sobe.', fim: 'derrota' } },
        { t: 'Enganá-lo', d: 'Jurar-lhe lealdade e roubar-lhe a coroa.', roll: { a: 'carisma', dc: 9 }, ok: { txt: 'Ajoelha-se, beija-lhe a mão e, ao levantar-se, leva a coroa consigo. Sem ela, ele é só um afogado.', fim: 'vitoria' }, ko: { txt: 'Ele vê-lhe a mentira nos olhos. Passa a fazer parte da guarda, com armadura e tudo.', fim: 'derrota' } },
        { t: 'Lutar contra o rei', d: 'O último recurso.', roll: { a: 'forca', dc: 10 }, ok: { txt: 'É a luta da sua vida. Quando o rei cai, a torre afunda-se e mal consegue nadar para terra.', fim: 'vitoria' }, ko: { txt: 'Ele nem precisa de se levantar. A água faz o resto.', fim: 'derrota' } },
      ] },
  },
  eclipse: {
    nome: 'O Eclipse de Vésper', destino: 'ossario', glyph: 'moon',
    resumo: 'Um culto prepara um ritual em Ossário: quando a lua cobrir o sol, a cidade mais próxima deixa de existir.',
    pista1: { titulo: 'As Velas Negras', terreno: 'floresta',
      texto: 'Pregada a uma árvore, encontra uma lista de nomes, e metade está riscada a cera negra. Mais à frente, um altar de pedra ainda quente. Alguém acabou de sair daqui.',
      opcoes: [
        { t: 'Decifrar o altar', d: 'Marcas de calendário, e não de oração.', roll: { a: 'mente', dc: 7 }, ok: { txt: 'São contas de astrónomo. Há um eclipse marcado, e um lugar antigo a nordeste.', fx: { pista: 1 } }, ko: { txt: 'Só percebe que lhe arde a mão quando toca na pedra.', fx: { vida: -1 } } },
        { t: 'Seguir o rasto', d: 'Só o Patrulheiro lê pegadas de há uma hora.', req: { cls: 'patrulheiro' }, ok: { txt: 'Sete pessoas e um carro pesado, todos em direção às ruínas. E um deles coxeia.', fx: { pista: 1, ouro: 1 } } },
        { t: 'Destruir o altar', d: 'Pelo menos este não se usa mais.', roll: { a: 'forca', dc: 7 }, ok: { txt: 'A pedra racha com um gemido. Algo, muito longe, sente a falta dela.', fx: { pista: 1 } }, ko: { txt: 'O altar devolve-lhe o golpe, como um trovão.', fx: { vida: -2 } } },
      ] },
    pista2: { titulo: 'O Noviço em Fuga', terreno: 'estrada',
      texto: 'Um rapaz de túnica rasgada sai a correr dos arbustos e agarra-se a si. "Eles vão fazê-lo quando o sol ficar preto. Todos! Todos!" Atrás dele ouvem-se cães, e já não vêm longe.',
      opcoes: [
        { t: 'Acalmá-lo', d: 'Só o Clérigo lhe devolve a fala.', req: { cls: 'clerigo' }, ok: { txt: 'Uma mão na testa e o rapaz respira. Conta-lhe a hora, o lugar e o nome da sacerdotisa.', fx: { pista: 1, vida: 1 } } },
        { t: 'Enfrentar os perseguidores', d: 'Ganha-lhe tempo para falar.', roll: { a: 'forca', dc: 8 }, ok: { txt: 'Dois cães e um cultista depois, o rapaz conta-lhe tudo o que sabe.', fx: { pista: 1, ouro: 2 } }, ko: { txt: 'Os dentes dos cães chegam primeiro. O rapaz foge sem dizer mais nada.', fx: { vida: -3 } } },
        { t: 'Escondê-lo', d: 'Apagar o rasto e ouvir depois.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Os cães passam ao lado. Em sussurros, ele desenha-lhe o templo na terra.', fx: { pista: 1 } }, ko: { txt: 'Encontram-nos. Consegue escapar, mas o rapaz não.', fx: { vida: -1 } } },
      ] },
    final: { titulo: 'As Ruínas de Ossário',
      texto: 'O céu escurece ao meio-dia. Em Ossário, sete figuras formam um círculo em torno de uma sacerdotisa de mãos abertas, enquanto o pó dos mortos sobe à sua volta. Falta pouco para a lua cobrir o sol.',
      opcoes: [
        { t: 'Virar o ritual ao contrário', d: 'Só o Mago. Basta trocar uma palavra.', req: { cls: 'mago' }, roll: { a: 'mente', dc: 7 }, ok: { txt: 'Com uma palavra trocada, o poder volta-se contra quem o chamou. Quando o sol regressa, só resta pó e silêncio.', fim: 'vitoria' }, ko: { txt: 'A palavra sai errada de outra forma. O eclipse abre-se e a cidade cala-se para sempre.', fim: 'derrota' } },
        { t: 'Interromper a hora', d: 'Requer 2 Pistas. Sabe exatamente qual é a pedra-chave.', req: { pistas: 2 }, roll: { a: 'agilidade', dc: 7 }, ok: { txt: 'Atravessa o círculo e arranca a pedra-chave no último instante. O ritual desaba sobre si próprio.', fim: 'vitoria' }, ko: { txt: 'Chega um batimento tarde demais. A pedra já não é pedra.', fim: 'derrota' } },
        { t: 'Virar os cultistas', d: 'Metade está ali por medo. Basta lembrar-lhes disso.', roll: { a: 'carisma', dc: 9 }, ok: { txt: 'Uma voz de cada vez, o círculo quebra-se. A sacerdotisa fica a gritar sozinha para um céu que já não a ouve.', fim: 'vitoria' }, ko: { txt: 'Ninguém o ouve. Agora há oito figuras naquele círculo.', fim: 'derrota' } },
        { t: 'Atacar a sacerdotisa', d: 'Sem hesitar.', roll: { a: 'forca', dc: 10 }, ok: { txt: 'Atravessa a guarda e cala-a a meio da frase. A escuridão recolhe-se, envergonhada.', fim: 'vitoria' }, ko: { txt: 'Cai a dois passos dela, a ver o sol desaparecer.', fim: 'derrota' } },
      ] },
  },
  dragao: {
    nome: 'O Sono do Dragão', destino: 'cardeo', glyph: 'flame',
    resumo: 'Sob o Monte Cárdeo dorme um dragão, e alguém está a cavar até ele para o acordar e o vender a um rei.',
    pista1: { titulo: 'Os Mineiros Desaparecidos', terreno: 'montanha',
      texto: 'Uma coluna de famílias desce a serra, sem os homens. "Pagaram o triplo para cavar em Cárdeo", diz uma mulher. "Depois deixaram de escrever." O chão treme de leve, como se respirasse.',
      opcoes: [
        { t: 'Examinar o minério', d: 'Só Anões percebem o que estas pedras contam.', req: { raca: 'anao' }, ok: { txt: 'Isto não é pedra: é escama fossilizada, e enorme. Fica pálido só de fazer as contas ao tamanho.', fx: { pista: 1, ouro: 2 } } },
        { t: 'Perguntar pelo contratador', d: 'Quem paga o triplo a mineiros?', roll: { a: 'carisma', dc: 7 }, ok: { txt: 'Um homem de luvas brancas, com um selo real. E muita pressa.', fx: { pista: 1 } }, ko: { txt: 'Estão cansados de perguntas, e alguém lhe atira uma pedra.', fx: { vida: -1 } } },
        { t: 'Sentir o tremor', d: 'De onde vem, e de que profundidade?', roll: { a: 'mente', dc: 8 }, ok: { txt: 'Ritmo certo, lento, vindo de nordeste. Não é sismo. É respiração.', fx: { pista: 1 } }, ko: { txt: 'A terra não lhe diz nada, e uma pedra solta quase lhe acerta.', fx: {} } },
      ] },
    pista2: { titulo: 'A Caravana de Correntes', terreno: 'estrada',
      texto: 'Uma caravana sobe a estrada sob forte guarda, e carrega correntes da grossura da sua cintura. Um carregador tropeça, e ouve-o murmurar: "Para que é que alguém precisa disto?" Ninguém lhe responde.',
      opcoes: [
        { t: 'Infiltrar-se na caravana', d: 'Requer o antecedente Soldado. Sabe andar em formação.', req: { bg: 'soldado' }, ok: { txt: 'Marcha entre eles sem que ninguém repare. Ouve o plano inteiro à fogueira, e parte antes do amanhecer.', fx: { pista: 1, ouro: 3 } } },
        { t: 'Sabotar as correntes', d: 'Um elo fraco basta.', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Lima um elo de noite e, na cera do lacre, encontra o selo de quem as encomendou.', fx: { pista: 1 } }, ko: { txt: 'Um guarda apanha-o e tratam de lhe ensinar boas maneiras.', fx: { vida: -2 } } },
        { t: 'Subornar o carregador', d: 'Perde 3 de Ouro.', ok: { txt: 'Ele conta tudo o que sabe: o monte, a câmara funda e o dia em que tudo se soltará.', fx: { ouro: -3, pista: 1 } } },
      ] },
    final: { titulo: 'O Coração do Monte Cárdeo',
      texto: 'Os túneis terminam numa câmara do tamanho de uma catedral. As correntes já prendem uma asa imensa. O homem das luvas brancas ergue o braço para o último golpe de martelo, e um olho dourado abre-se devagar no escuro.',
      opcoes: [
        { t: 'Cantar-lhe o sono de volta', d: 'Só o Bardo. Até os dragões têm canções de embalar.', req: { cls: 'bardo' }, roll: { a: 'carisma', dc: 7 }, ok: { txt: 'A sua voz enche a câmara. O olho fecha-se devagar, e os homens largam as armas sem saber porquê. O monte volta a dormir.', fim: 'vitoria' }, ko: { txt: 'Uma nota falha. O olho foca-se em si, e depois deixa de haver câmara.', fim: 'derrota' } },
        { t: 'Soltar as correntes', d: 'Requer 2 Pistas. Conhece o elo que segura tudo.', req: { pistas: 2 }, roll: { a: 'agilidade', dc: 7 }, ok: { txt: 'O elo salta e as correntes caem sobre os mineiros do rei. O dragão suspira, e volta ao seu sono de séculos.', fim: 'vitoria' }, ko: { txt: 'O elo não cede. O martelo cai, e a montanha acorda.', fim: 'derrota' } },
        { t: 'Desmascarar o contratador', d: 'Os mineiros ainda não sabem o que estão a acordar.', roll: { a: 'carisma', dc: 9 }, ok: { txt: 'Os mineiros olham para o olho, depois para ele. As picaretas viram-se. Ninguém volta a ouvir falar das luvas brancas.', fim: 'vitoria' }, ko: { txt: 'A voz perde-se no eco. Os homens continuam a cavar, até deixarem de poder.', fim: 'derrota' } },
        { t: 'Atacar antes do golpe', d: 'Basta chegar ao martelo.', roll: { a: 'forca', dc: 10 }, ok: { txt: 'Salta-lhe em cima e o martelo cai no abismo. Lá muito ao fundo, o dragão resmunga e vira-se para o outro lado.', fim: 'vitoria' }, ko: { txt: 'Fica a meio caminho quando o martelo desce.', fim: 'derrota' } },
      ] },
  },
};

const FIM_MORTE = {
  titulo: 'Fim da Linha',
  texto: 'As forças abandonam-no longe de casa, numa estrada sem nome. A missão fica por cumprir, e ninguém saberá o que trazia na mão. Nas tabernas, ainda hão de contar a história ao contrário.',
};
