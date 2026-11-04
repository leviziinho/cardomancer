// O fio da história: três etapas que levam sempre ao fim, mesmo a quem falha.
// Cada etapa diz para onde ir a seguir. As pistas e as dicas só tornam o caminho mais fácil.

// O que fazer em cada etapa, no imperativo, para a frase do painel Agora.
const ETAPA_AGORA = ['Procure quem sabe', 'Interrogue o suspeito', 'Ouça a última testemunha'];

const op = (t, d, tipo, a, dc, ok, ko, koFx = { vida: -2 }, okFx = { xp: 2 }) => ({ t, d, tipo, roll: { a, dc }, ok: { txt: ok, fx: okFx }, ko: { txt: ko, fx: koFx } });
const luta = (t, d, dc, pv, ini, ok, ko) => ({ t, d, tipo: 'combate', roll: { a: 'forca', dc, pv, ini }, ok: { txt: ok, fx: { ouro: 3 } }, ko: { txt: ko, fx: { vida: -3 } } });

// Servem para qualquer mundo.
const ETAPAS_GERAIS = [
  [
    { titulo: 'A Mesa do Canto', texto: 'Disseram-lhe para procurar uma mulher que nunca se senta de costas para a porta. Está ali, com dois copos à frente, e um deles era para si. "Demorou", diz. "Sei o que procura, e sei quem mais o procura. Quanto vale?"',
      opcoes: [
        op('Conquistá-la', 'Ela gosta de quem não tem medo.', 'social', 'carisma', 11, 'Ela ri-se pela primeira vez em muito tempo, e diz-lhe tudo de graça.', 'Ela cobra-lhe a bebida, a conversa e a resposta.', { ouro: -3 }),
        op('Ler o que ela não diz', 'Os olhos dela vão sempre para o mesmo lado.', 'investigacao', 'mente', 11, 'Ela percebe que já sabe, e não tem outro remédio senão confirmar.', 'Olha demasiado tempo, e alguém lá fora dá por isso.'),
        luta('Tirar os que a vigiam', 'Dois homens à porta não estão ali pela cerveja.', 10, 5, 'Os Vigias', 'Quando volta, ela já pediu outro copo, e fala.', 'Ela fala-lhe depressa, enquanto lhe limpa o sangue.'),
      ] },
    { titulo: 'O Livro de Contas', texto: 'O escrivão do posto tem um livro onde se anota quem passa, e o que paga. Fecha-o assim que o vê entrar, e põe-lhe a mão em cima. "Isto não é para qualquer um", diz, mas a mão treme-lhe um pouco.',
      opcoes: [
        op('Mostrar que está do lado dele', 'Ele tem medo de alguém.', 'social', 'carisma', 11, 'Abre o livro, e aponta com a unha sem dizer uma palavra.', 'Chama a guarda, e passa o dia a dar explicações.', { dia: 1 }),
        op('Ler de pernas para o ar', 'Basta ele distrair-se.', 'investigacao', 'mente', 11, 'Lê duas páginas enquanto lhe pergunta pelas horas.', 'Só apanha as somas, e gasta o dia a fazer contas.', { dia: 1 }),
        op('Tirar-lho das mãos', 'Num só gesto.', 'habilidade', 'agilidade', 11, 'Quando ele grita, já sabe o que precisava.', 'O escrivão morde. Ninguém diria.'),
      ] },
  ],
  [
    { titulo: 'O Homem da Cicatriz Nova', texto: 'Foi aqui que lhe disseram para procurar, e não é difícil de encontrar: é o único que se levanta quando o vê. A cicatriz ainda está aberta. Tem pressa, e tem os olhos de quem já contou a alguém o que não devia.',
      opcoes: [
        op('Dar-lhe uma saída', 'Ele quer falar. Só tem medo.', 'social', 'carisma', 12, 'Conta-lhe tudo, sentado no chão, e pede-lhe que nunca mais volte.', 'Grita por ajuda, e a ajuda vem armada.', { vida: -3 }),
        op('Apanhá-lo numa mentira', 'A história dele não bate certo.', 'investigacao', 'mente', 12, 'À terceira contradição, desiste, e diz-lhe o nome do sítio.', 'É ele quem acaba a fazer as perguntas.', { vida: -1, dia: 1 }),
        luta('Apertá-lo', 'Sem tempo para gentilezas.', 11, 6, 'O Homem da Cicatriz', 'Já no chão, diz o que tinha a dizer.', 'Foge a coxear, e o que deixa cair diz-lhe o suficiente.'),
      ] },
    { titulo: 'A Porta das Traseiras', texto: 'A casa está de janelas tapadas em pleno dia. Na porta de trás há marcas novas de botas, e lá dentro alguém queima papéis com muito método. Se chegar um minuto mais tarde, não sobra nada.',
      opcoes: [
        op('Entrar sem barulho', 'Antes que a última folha arda.', 'habilidade', 'agilidade', 12, 'Tira-lhe o papel da mão, e ele fica a olhar para os dedos vazios.', 'O soalho range. Sai com queimaduras, e meia folha.', { vida: -3 }),
        op('Ler as cinzas', 'Papel queimado ainda se lê, se souber.', 'investigacao', 'mente', 12, 'As letras ficam mais escuras do que o resto. Lê-as à luz da vela.', 'Desfazem-se todas menos uma palavra, e é tudo o que tem.', { dia: 1 }),
        luta('Arrombar a porta', 'Depressa, e sem pedir licença.', 11, 6, 'O Queimador de Papéis', 'Agarra-o a tempo, e ele prefere falar.', 'Ele foge pela janela, mas deixa uma folha por queimar.'),
      ] },
  ],
  [
    { titulo: 'A Última a Sair', texto: 'A velha mora sozinha, numa casa que já foi de muita gente. Viu tudo, e tem contado a quem lhe traz lenha. Olha-o de cima a baixo, e continua a descascar batatas. "Sei para onde foi", diz. "Sei também o que acontece a quem vai atrás."',
      opcoes: [
        op('Ouvir tudo, sem pressa', 'Mesmo a parte das batatas.', 'social', 'carisma', 12, 'Ao fim de duas horas, diz-lhe o sítio, como quem fala do tempo.', 'Adormece a meio. Espera até de manhã.', { dia: 1 }),
        op('Reparar no que ela guarda', 'Há uma coisa na prateleira que não é dela.', 'investigacao', 'mente', 12, 'Pega no objeto, e ela deixa de fingir.', 'Ela bate-lhe na mão com a faca de cabo. Dói mais do que parece.'),
        op('Trazer a lenha', 'Toda. Sozinho.', 'habilidade', 'forca', 12, 'Quando acaba, tem um prato à frente e a resposta.', 'As costas deixam de lhe obedecer, e ela conta-lhe na mesma, com pena.', { vida: -3 }),
      ] },
    { titulo: 'O Sobrevivente', texto: 'Dizem que há um único que voltou de lá. Está na enfermaria, com as mãos atadas para não se arranhar. Abre os olhos quando o ouve, e começa a falar sem parar, sempre a mesma frase e sempre mais baixo.',
      opcoes: [
        op('Acalmá-lo', 'Sentar-se, e dar-lhe a mão.', 'social', 'carisma', 12, 'A frase muda, e passa a ser uma direção.', 'Ele começa a gritar. Tiram-no de lá à força.', { vida: -2 }),
        op('Decifrar o que repete', 'Tem de significar alguma coisa.', 'investigacao', 'mente', 12, 'É um caminho, dito ao contrário.', 'Passa o dia a ouvi-lo, e sai com a frase na cabeça.', { dia: 1 }),
        op('Procurar nas roupas dele', 'As botas têm terra de outro sítio.', 'habilidade', 'agilidade', 11, 'Terra, sal e um bocado de mapa, cosido por dentro.', 'A enfermeira apanha-o, e o braço dela é pesado.'),
      ] },
  ],
];

// As mesmas etapas, com a gente de cada mundo.
const ETAPAS_MUNDO = {
  daraan: [
    [{ titulo: 'O Recado de Simony', texto: 'Simony Lumiel encosta-se à parede ao seu lado, a afiar a adaga mais curta, e não olha para si. "O Opositor tem olhos aqui. Não muitos. Quer saber o que eles viram, ou vai continuar a perguntar nas tabernas até o Império vir ter consigo?"',
      opcoes: [
        op('Provar de que lado está', 'Ela não aceita palavras.', 'social', 'carisma', 11, 'Põe-lhe um papel na mão, e já não está lá.', 'Ela vai-se embora, e deixa-o a explicar-se a um sentinela.', { ouro: -3 }),
        op('Reparar no que ela já sabe', 'Vem de algum lado, com lama nas botas.', 'investigacao', 'mente', 11, 'Diz-lhe de onde veio. Ela quase sorri, e confirma.', 'Ela já tinha reparado em si há dois dias.'),
        luta('Treinar com ela', 'É a única forma de a ouvir.', 11, 6, 'Simony, a brincar', 'Toca-lhe uma vez. Ela guarda a adaga, e fala.', 'Fala-lhe enquanto o ajuda a levantar-se.'),
      ] }],
    [{ titulo: 'O Coletor do Império', texto: 'O coletor de impostos conta moedas numa mesa dobrável, com dois soldados de armadura imperial a bocejar. Tem o selo do General, e um livro de quem deve. O homem que procura está nesse livro, e o seu nome também.',
      opcoes: [
        op('Pagar-lhe um copo', 'Coletores nunca são convidados.', 'social', 'carisma', 12, 'Fica de lágrimas nos olhos, e conta-lhe a rota inteira.', 'Regista-o como suspeito. Passa o dia na fila.', { dia: 1 }),
        op('Ler o livro de lado', 'Enquanto ele conta.', 'investigacao', 'mente', 12, 'Encontra a linha, e a morada da dívida.', 'Um dos soldados deixa de bocejar.', { vida: -3 }),
        luta('Rebentar com a mesa', 'Pelo Pacto de Aramon.', 12, 7, 'Os Soldados do Império', 'Fica com o livro, e o povo fica com as moedas.', 'Foge com uma só página, e é a certa.'),
      ] }],
    [{ titulo: 'O Monge Vê', texto: 'Geyser Punho Cego está à sua espera a meio do caminho, de pé, sem que ninguém lhe tenha dito que você vinha. Inclina a cabeça, a escutar qualquer coisa ao longe. "Oiça", diz. "Não com os ouvidos. Depois diga-me para onde está a ir."',
      opcoes: [
        op('Ficar em silêncio', 'Mais tempo do que é confortável.', 'social', 'carisma', 12, 'Ele acena, e aponta sem hesitar, como se a mão soubesse sozinha.', 'Ao fim de um dia, ele diz-lhe na mesma, com pena.', { dia: 1 }),
        op('Ler o que ele ouve', 'O vento vem de um só lado.', 'investigacao', 'mente', 12, 'Diz-lho antes de ele o dizer. Faz-lhe uma vénia pequena.', 'Dá a resposta errada, e ele bate-lhe na testa com um dedo.', { vida: -2 }),
        op('Tentar tocar-lhe', 'É o preço da resposta.', 'habilidade', 'agilidade', 13, 'Um dedo, numa manga. Ele parece contente, e diz-lhe tudo.', 'Acorda a olhar para o céu, e ele já lhe deixou o caminho riscado na terra.', { vida: -3 }),
      ] }],
  ],
};

// Para quem fica mais um dia à procura, depois de gastar os encontros do lugar.
const CENAS_BUSCA = [
  { titulo: 'Mais um Dia', texto: 'Volta aos mesmos sítios e às mesmas perguntas. Agora já o conhecem, e nem todos gostam disso. O rasto está aqui, em algum lado, e alguém sabe.',
    opcoes: [
      op('Perguntar outra vez', 'De outra maneira.', 'social', 'carisma', 11, 'Alguém se cansa de lhe dizer que não.', 'Fecham-lhe três portas na cara, e uma delas em cheio.'),
      op('Revirar o sítio', 'Com método.', 'investigacao', 'mente', 11, 'Estava debaixo do que toda a gente pisa.', 'Passa o dia a pisar o mesmo que toda a gente.'),
      luta('Perguntar à força', 'Há quem só responda de joelhos.', 10, 5, 'O Capataz', 'Quando o levanta do chão, já lhe disse tudo.', 'Ele tinha mais amigos do que parecia.'),
      op('Vigiar de longe', 'Ver quem vem buscar o que deixou.', 'habilidade', 'agilidade', 11, 'Alguém vem. Sabe agora quem, e o quê.', 'Quem vem vê-o primeiro.'),
    ] },
  { titulo: 'À Procura', texto: 'Levanta-se antes de todos e sai sem comer. Há marcas de uma visita recente, e estão a ser apagadas devagar por alguém que não tem pressa nenhuma. Se se despachar, ainda chega antes.',
    opcoes: [
      op('Seguir as marcas', 'Enquanto as há.', 'habilidade', 'agilidade', 11, 'Chega ao fim delas com tempo de sobra.', 'Perde-as, e encontra um buraco.'),
      op('Falar com quem as apaga', 'Alguém lhe paga para isso.', 'social', 'carisma', 11, 'Fica contente por lhe pagarem duas vezes.', 'Tem amigos, e os amigos têm paus.'),
      luta('Agarrar quem as apaga', 'Com o machado, a conversa é mais curta.', 10, 5, 'O Apagador', 'Deixa cair o pano, e conta para quem trabalha.', 'Sabia lutar, e isso ninguém lhe disse.'),
      op('Pensar antes de andar', 'Só há um sítio que faz sentido.', 'investigacao', 'mente', 11, 'Vai direto a ele, e tinha razão.', 'Havia dois.'),
    ] },
];

// O que se ouve ao fazer bem as coisas, mesmo longe da missão.
const DICAS = {
  combate: ['Antes de desmaiar, o vencido deixa escapar um nome: {proximo}.', 'Nos bolsos dele há um salvo-conduto para {proximo}. Alguém o esperava lá.'],
  social: ['No meio da conversa, ouve o que precisava: é em {proximo} que deve procurar.', 'Alguém baixa a voz para lhe dizer que há gente a fazer as mesmas perguntas em {proximo}.'],
  investigacao: ['Entre o que encontra, há um nome riscado com força: {proximo}.', 'Tudo o que vê aqui veio de um só sítio: {proximo}.'],
  outro: ['Ao sair, ouve os carroceiros falar de {proximo}, e é exatamente o que precisava de ouvir.'],
};
