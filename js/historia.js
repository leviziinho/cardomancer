// A história do jogo. Este é o ficheiro onde entra o conteúdo criativo: nomes, lugares e cenas.
// {cidade}, {vilao}, {reliquia}, {refem}, {motivo}, {proximo}, {pista} e {destino} são preenchidos em cada partida.
//
// Cada opção: t (título), d (descrição), tipo (combate, social, habilidade, investigacao),
// req (cls, raca, bg, item), roll { a: atributo, dc, pv: resistência do inimigo }, ok e ko { txt, fx }.
// fx aceita: vida, ouro, xp, dia, item, aliado, marca, mercado.

// ---------- Peças da trama: cada partida sorteia uma de cada ----------

let OBJETIVOS = {
  reliquia: { titulo: 'Encontre {reliquia}', glyph: 'star', desc: 'Alguém está a matar para a ter primeiro. Junte as pistas antes de se esgotar o tempo.',
    vitoria: 'Sai dali com {reliquia} nas mãos, ainda quente do que quase aconteceu.' },
  resgate: { titulo: 'Resgate {refem}', glyph: 'person', desc: 'Foi levada e tem pouco tempo. Quem a levou não deixou um único rasto às claras.',
    vitoria: '{refem} sai consigo pelo próprio pé, a tremer, viva e furiosa.' },
  impedir: { titulo: 'Impeça o ritual da lua nova', glyph: 'moon', desc: 'Algo vai acontecer na próxima lua nova. Descubra onde, antes que seja tarde.',
    vitoria: 'A lua nova nasce sobre um céu vulgar, e ninguém chega a saber o que não aconteceu.' },
  cacar: { titulo: 'Encontre quem matou o mensageiro', glyph: 'dagger', desc: 'Foi só o primeiro nome da lista. Siga o sangue até à origem, antes do próximo.',
    vitoria: 'A lista acaba aqui. Queima-a à chama da última vela, e o nome de ninguém volta a ser riscado.' },
};

let RELIQUIAS = ['a Adaga de Azyr', 'o Sino Mudo de Lumiar', 'o Olho de Cárdeo', 'o Códice de Vésper'];
let REFENS = ['a Irmã Maior de Lumiar', 'a Herdeira de Pedra-Alta', 'a Cartógrafa Iseu', 'a Filha do Rei Mineiro'];

let VILOES = {
  afogado: { nome: 'o Rei Afogado', destino: 'torre', glyph: 'crown', fraqueza: ['barbaro', 'clerigo', 'guerreiro'],
    efeitos: [{ t: 'A maré fecha-lhe as feridas.', tipo: 'cura', v: 4 }, { t: 'A água enche-lhe os pulmões.', tipo: 'dreno', v: 2 }],
    motivos: ['Quer de volta o reino que o mar lhe levou, nem que seja debaixo de água.', 'Jurou que a maré voltaria a obedecer-lhe, e um rei não quebra juramentos.', 'Ainda dá ordens a uma frota que só ele consegue ver.'],
    pistas: [
      'Em cada vila se repete a história: as pessoas acordam com a boca a saber a sal, e os poços sobem sem chover.',
      'Soldados de armadura coberta de cracas marcham de noite para leste, e deixam pegadas de água.',
      'Uma insígnia com cem anos traz o nome de um rei que todos julgam morto no mar.',
    ],
    finalTexto: 'A maré vira ao contrário e a torre emerge a pingar. No topo, sobre um trono de coral, {vilao} volta para si a face inchada. "Vieste beijar a mão ao teu soberano", diz, com uma voz cheia de água.',
    ronda: { combate: 'A armadura range e a água jorra das juntas.', social: 'Por um instante ele lembra-se de que já foi homem.', habilidade: 'A água recua e abre-lhe um caminho até ao trono.', investigacao: 'Tudo o que descobriu sobre ele encaixa, peça a peça.' } },
  sacerdotisa: { nome: 'a Sacerdotisa Velada', destino: 'ossario', glyph: 'moon', fraqueza: ['mago', 'bardo', 'feiticeiro'],
    efeitos: [{ t: 'O cântico faz-lhe tremer a mão.', tipo: 'fraco', v: 3 }, { t: 'O círculo de pó fecha-se à volta dela.', tipo: 'ca', v: 1 }],
    motivos: ['Prega que só o fim do mundo põe fim à dor, e já convenceu muitos.', 'Paga uma dívida antiga a algo que não aceita moedas.', 'Viu o futuro uma vez, e decidiu que ninguém o há de viver.'],
    pistas: [
      'Pregada a uma árvore há uma lista de nomes, e metade está riscada a cera negra.',
      'Um altar de pedra, ainda quente, tem marcas de calendário em vez de orações. Há um eclipse marcado.',
      'Um noviço em fuga conta-lhe o nome da sacerdotisa e a hora do ritual, antes que os cães o encontrem.',
    ],
    finalTexto: 'O céu escurece ao meio-dia. Em Ossário, sete figuras formam um círculo em torno de {vilao}, de mãos abertas, enquanto o pó dos mortos sobe à sua volta.',
    ronda: { combate: 'A guarda quebra, e o círculo perde um elo.', social: 'Metade dos cultistas está ali por medo, e a dúvida espalha-se.', habilidade: 'Atravessa o círculo sem que o pó o toque.', investigacao: 'Encontra o erro nas contas do ritual, e o céu hesita.' } },
  luvas: { nome: 'o Homem das Luvas Brancas', destino: 'cardeo', glyph: 'flame', fraqueza: ['bardo', 'ladino', 'monge'],
    efeitos: [{ t: 'Um capanga aponta-lhe uma besta, e custa-lhe a atenção.', tipo: 'fraco', v: 3 }, { t: 'Alguém pago por ele leva-lhe a bolsa.', tipo: 'ouro', v: 4 }],
    motivos: ['Foi pago para acordar o que dorme na montanha, e nunca falhou um contrato.', 'Quer vender o mundo a quem pagar mais, e já tem comprador.', 'Vai fazer arder as cortes que um dia lhe recusaram a mão.'],
    pistas: [
      'Famílias de mineiros descem a serra sem os homens: alguém pagou o triplo para cavar no Monte Cárdeo.',
      'Uma caravana sobe a estrada com correntes da grossura da sua cintura. Ninguém sabe para que servem.',
      'As pedras que eles trazem não são pedra: são escama fossilizada, e enorme. O chão treme como se respirasse.',
    ],
    finalTexto: 'Os túneis terminam numa câmara do tamanho de uma catedral. As correntes já prendem uma asa imensa. {vilao} ergue o braço para o último golpe de martelo, e um olho dourado abre-se no escuro.',
    ronda: { combate: 'O martelo fica mais longe da mão dele.', social: 'Os mineiros olham para o olho, e depois para ele.', habilidade: 'Salta de corrente em corrente, cada vez mais perto.', investigacao: 'Conhece agora o elo que segura todos os outros.' } },
  bruxa: { nome: 'a Bruxa do Junco', destino: 'velas', glyph: 'drop', fraqueza: ['clerigo', 'mago', 'druida'],
    efeitos: [{ t: 'Uma moeda na boca de um sapo, e a ferida dela fecha.', tipo: 'cura', v: 4 }, { t: 'Cobra-lhe um favor que não sabia dever.', tipo: 'dreno', v: 2 }],
    motivos: ['Está a cobrar todos os favores que emprestou em cem anos.', 'Enche a panela para um inverno que só ela sabe que vem.', 'Riram-se dela uma vez, e agora ri-se por último, e devagar.'],
    pistas: [
      'As crianças das aldeias vizinhas cantam uma lengalenga nova, que ninguém lhes ensinou.',
      'Luzes azuis saem do pântano cada noite mais longe, e cada noite alguém as segue.',
      'Num tronco oco há sapos com moedas na boca, e cada moeda tem o rosto de um desaparecido.',
    ],
    finalTexto: 'No coração do pântano, a cabana sobre estacas é agora do tamanho de uma aldeia. As luzes azuis giram à volta de {vilao}, que mexe a tigela sem pressa. "Sopa ou resposta?", pergunta, sem olhar.',
    ronda: { combate: 'As estacas estalam, e a cabana inclina-se.', social: 'Ela ri, mas responde, e cada resposta custa-lhe um pouco.', habilidade: 'Pisa só onde as luzes não apontam.', investigacao: 'Reconhece um rosto nas moedas, e chama-o pelo nome.' } },
  capitao: { nome: 'o Capitão do Casco Negro', destino: 'carpa', glyph: 'seal', fraqueza: ['patrulheiro', 'barbaro'],
    efeitos: [{ t: 'A tripulação fecha o cerco à volta dele.', tipo: 'ca', v: 1 }, { t: 'Uma cláusula em letra pequena leva-lhe o ouro.', tipo: 'ouro', v: 4 }],
    motivos: ['Os contratos dizem que o mar é dele, e vai cobrar cada cláusula.', 'Afundou a própria família por engano, e procura a maré que a devolva.', 'Quer tudo o que flutua, e depois tudo o que não flutua.'],
    pistas: [
      'Nos portos falam de um navio que aparece onde a maré recua mais do que devia.',
      'Um cofre dá à costa com selos de três reinos. Dentro há contratos, todos com a mesma assinatura.',
      'As marcas nos cascos afundados não vêm de rochas. Alguém faz isto de propósito, e cobra por isso.',
    ],
    finalTexto: 'A enseada está seca até ao horizonte. Encalhado na areia, o navio negro aguarda, e {vilao} desce a prancha sem pressa. Atrás dele, ao longe, a água já vem de volta.',
    ronda: { combate: 'A tripulação recua um passo, e depois mais outro.', social: 'Encontra na tripulação quem também foi enganado.', habilidade: 'Sobe pelo cordame enquanto olham para o outro lado.', investigacao: 'Conhece os contratos, e sabe qual o pode destruir.' } },
};

// Reviravoltas: acontecem de surpresa depois da segunda pista.
let REVIRAVOLTAS = {
  traidor: { nome: 'O Traidor', resumo: 'Havia alguém a vender os seus passos.',
    titulo: 'Quem Vendeu os Seus Passos',
    texto: 'Abre a porta e já estão à sua espera. Sabem o seu nome, o caminho que fez e até o que trazia na mochila. Alguém anda a contar tudo a {vilao}, e o seu sangue gela ao perceber quem esteve sempre perto o suficiente.',
    opcoes: [
      { t: 'Confrontar o traidor', d: 'Olhos nos olhos, agora mesmo.', tipo: 'social', roll: { a: 'carisma', dc: 13 },
        ok: { txt: 'A verdade sai aos soluços. Era chantagem, e não maldade. A partir de hoje, quem o vendeu vende {vilao} a si.', fx: { xp: 3, marca: 'traidorvirado' } },
        ko: { txt: 'A faca sai primeiro do que as desculpas. Foge a sangrar, e {vilao} fica a saber para onde.', fx: { vida: -4, perdeAliado: true, dia: 1 } } },
      { t: 'Abrir caminho a golpes', d: 'Depois logo se fala.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Os Capangas' },
        ok: { txt: 'Sai por cima deles, com o coração aos saltos e menos um amigo no mundo.', fx: { xp: 2, perdeAliado: true } },
        ko: { txt: 'São muitos. Só escapa porque a noite é escura e o rio é fundo.', fx: { vida: -4, perdeAliado: true } } },
      { t: 'Fingir que não percebeu', d: 'E alimentar o traidor com mentiras.', tipo: 'habilidade', roll: { a: 'mente', dc: 14 },
        ok: { txt: 'Conta três mentiras bem contadas. {vilao} vai preparar-se para o que nunca vai acontecer.', fx: { marca: 'enganou' , xp: 3 } },
        ko: { txt: 'A mentira não colou. Perde um dia a despistar quem o segue.', fx: { dia: 1, vida: -2 } } },
    ] },
  prazo: { nome: 'A Data Errada', resumo: 'O prazo que lhe deram era mentira.',
    titulo: 'A Data Errada',
    texto: 'Um velho astrónomo olha para as suas contas e empalidece. "Quem lhe disse lua nova mentiu, ou enganou-se. Vai ser antes. Muito antes." Olha para o céu como quem olha para uma conta que já venceu.',
    opcoes: [
      { t: 'Refazer as contas com ele', d: 'Saber exatamente quanto tempo resta.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 },
        ok: { txt: 'Passam a noite às voltas com os astros. São dois dias a menos, mas agora sabe exatamente quais.', fx: { prazo: -2, xp: 3 } },
        ko: { txt: 'Perde a noite e não chega a nenhuma certeza. Nos dias seguintes, olha para o céu a cada hora.', fx: { prazo: -3 } } },
      { t: 'Partir já', d: 'Cada hora conta. Dormir fica para depois.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 },
        ok: { txt: 'Parte a meio da noite, e ganha às estradas parte do que a mentira lhe roubou.', fx: { prazo: -1, xp: 2 } },
        ko: { txt: 'Parte exausto, e cai ao terceiro desfiladeiro.', fx: { prazo: -2, vida: -3 } } },
    ] },
  cliente: { nome: 'O Falso Mensageiro', resumo: 'Foi {vilao} quem lhe pôs a missão nas mãos.',
    titulo: 'A Mesma Letra',
    texto: 'Ao comparar os papéis à luz da vela, o estômago dá-lhe uma volta. A letra do pedido que o trouxe até aqui é a mesma das ordens que anda a encontrar. Foi {vilao} quem o enviou. Porquê? E para fazer o quê?',
    opcoes: [
      { t: 'Virar o jogo', d: 'Fingir que continua a obedecer, e chegar mais perto.', tipo: 'social', roll: { a: 'carisma', dc: 13 },
        ok: { txt: 'Escreve de volta como quem nada sabe. A resposta traz-lhe um salvo-conduto e ouro para a viagem.', fx: { ouro: 8, marca: 'enganou', xp: 3 } },
        ko: { txt: 'A resposta chega numa seta, que por pouco não lhe acerta. Já sabem que você sabe.', fx: { vida: -3 } } },
      { t: 'Queimar os papéis', d: 'E seguir sem que ninguém saiba onde está.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 },
        ok: { txt: 'Muda de caminho, de roupa e de nome. Pela primeira vez em dias, ninguém o segue.', fx: { xp: 2 } },
        ko: { txt: 'Perde um dia a dar voltas, e não tem a certeza de ter despistado alguém.', fx: { dia: 1 } } },
      { t: 'Estudar a armadilha', d: 'Se o queriam aqui, é porque precisam de si para alguma coisa.', tipo: 'investigacao', roll: { a: 'mente', dc: 13 },
        ok: { txt: 'Percebe o que queriam que fizesse, e já não vai fazê-lo. No final, isso vai contar muito.', fx: { marca: 'enganou', xp: 4 } },
        ko: { txt: 'Quanto mais lê, menos entende. Só a dor de cabeça é certa.', fx: { vida: -1 } } },
    ] },
  salvador: { nome: 'A Dívida Paga', resumo: 'Quem você ajudou pelo caminho não se esqueceu.',
    titulo: 'Alguém Ficou a Dever',
    texto: 'Está cercado num beco sem saída quando uma voz conhecida grita lá de cima. Quem o ajuda não devia saber onde está, nem ter motivos para arriscar a pele. "Ficámos a dever-lhe", diz, a estender-lhe a mão. "E aqui, as dívidas pagam-se."',
    opcoes: [
      { t: 'Aceitar a ajuda', d: 'E pedir que venham até ao fim.', tipo: 'social', roll: { a: 'carisma', dc: 9 },
        ok: { txt: 'Vêm consigo, e trazem amigos. Pela primeira vez, não está sozinho nisto.', fx: { aliado: 'sela', xp: 3, marca: 'ajudado' } },
        ko: { txt: 'Salvam-lhe a pele, mas não podem ir mais longe. Deixam-lhe o que trazem.', fx: { ouro: 6, vida: 2 } } },
      { t: 'Pedir só o caminho', d: 'Sem arrastar mais ninguém para isto.', ok: { txt: 'Mostram-lhe uma passagem que nem no mapa vem, e despedem-se com um aceno.', fx: { dia: -1, xp: 1 } } },
    ] },
  sangue: { nome: 'O Mesmo Sangue', resumo: 'O seu passado e o de {vilao} estão ligados.',
    titulo: 'Um Rosto Conhecido',
    texto: 'Entre os documentos encontra um retrato antigo. Reconhece a casa, reconhece a data, e reconhece-se a si mesmo em criança, ao colo de alguém. No verso, com a letra de {vilao}: "Quando chegar a hora, vai perceber."',
    opcoes: [
      { t: 'Ir ao fundo disto', d: 'Mesmo que custe tempo.', tipo: 'investigacao', roll: { a: 'mente', dc: 12 },
        ok: { txt: 'Custa-lhe um dia, mas agora sabe o que {vilao} deseja de si, e o que mais teme.', fx: { dia: 1, marca: 'sangue', xp: 4 } },
        ko: { txt: 'Perde um dia e só fica com mais perguntas.', fx: { dia: 1 } } },
      { t: 'Queimar o retrato', d: 'O passado não decide por si.', ok: { txt: 'A chama consome o papel. O nó na garganta fica, mas continua a andar.', fx: { vida: 2, xp: 1 } } },
    ] },
};

// ---------- O início ----------

// Cada missão tem mais do que uma forma de começar.
let GANCHOS = {
  reliquia: [
    { titulo: 'O Leilão Interrompido', terreno: 'cidade',
      texto: 'Na sala de leilões de {cidade}, o lote seguinte é um mapa antigo que diz levar a {reliquia}. O leiloeiro abre a boca para anunciar o preço e cai para a frente, com os lábios azuis. Quando as pessoas olham, o mapa já não está na mesa.',
      fundo: 'As casas de leilões vendem o que os herdeiros não querem explicar. Toda a gente sabe disso, e por isso ninguém pergunta de onde vêm os lotes. Pagar caro por um objeto é a forma mais respeitável de nunca falar dele.',
      opcoes: [
        { t: 'Cheirar o copo dele', d: 'O veneno diz muito sobre quem o usou.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Raiz de junco, e só um boticário na região a vende. O livro dele tem um nome e uma morada.', fx: { xp: 1 } }, ko: { txt: 'Fica com uma dor de cabeça, e com um bom motivo para não cheirar copos.', fx: { vida: -1 } } },
        { t: 'Correr atrás do comprador velado', d: 'Foi o único a sair antes de o leiloeiro cair.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Apanha-lhe a capa à saída. Fica com a capa, e no forro está cosido um destino.', fx: {} }, ko: { txt: 'Tropeça numa cadeira do século passado, e o dono quer que a pague.', fx: { ouro: -2 } } },
        { t: 'Interrogar o ajudante', d: 'Ele treme mais do que devia.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Bastam duas perguntas. Foi pago para trocar os copos, e diz por quem.', fx: {} }, ko: { txt: 'Ele grita por socorro, e sai de lá empurrado pelos guardas.', fx: { vida: -1 } } },
        { t: 'Aproveitar a confusão', d: 'Os lotes seguintes ficaram sem vigia. O que precisar, compre-o barato.', ok: { txt: 'Enquanto toda a gente grita, um funcionário vende-lhe o que quiser, sem fazer perguntas.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Penhorista de Mãos Trémulas', terreno: 'cidade',
      texto: 'Um penhorista de {cidade} agarra-o pela manga e empurra-lhe para as mãos um desenho a carvão: {reliquia}, em tamanho real. "Ontem vieram matar-me por causa disto. Hoje vêm outra vez. Leve-o." Lá fora, três homens já atravessam a rua.',
      fundo: 'O penhorista herdou a loja e todas as coisas que ninguém voltou a buscar. Nas prateleiras de trás há objetos que os seus avós prometeram nunca vender. Foi o seu erro achar que essa promessa não passava de uma velha mania de família.',
      opcoes: [
        { t: 'Estudar o desenho', d: 'As margens têm notas, em letra muito pequena.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'As notas são um itinerário, e a última paragem ainda está por riscar.', fx: { xp: 1 } }, ko: { txt: 'A letra é impossível. O carvão, esse, fica-lhe nos dedos.', fx: {} } },
        { t: 'Sair pelo telhado', d: 'E seguir os três quando passarem.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'De cima, ouve-os a discutir. Dizem o sítio para onde têm de voltar, em voz alta.', fx: {} }, ko: { txt: 'A telha cede, e a queda é mais curta do que a vergonha.', fx: { vida: -2 } } },
        { t: 'Enfrentar os três à porta', d: 'E perguntar quem os paga.', tipo: 'social', roll: { a: 'forca', dc: 11 }, rasto: true, ok: { txt: 'Um deles repensa a sua carreira e diz-lhe tudo o que sabe.', fx: { xp: 1 } }, ko: { txt: 'Dois murros depois, percebe que eles também sabem fazer perguntas.', fx: { vida: -2 } } },
        { t: 'Ver o que há nas prateleiras', d: 'O dono não vai precisar de tudo.', ok: { txt: 'O penhorista abre a vitrine e faz-lhe um preço de quem tem pressa de sair.', fx: { mercado: true } } },
      ] },
  ],
  resgate: [
    { titulo: 'O Bilhete Trocado', terreno: 'cidade',
      texto: 'Na estalagem de {cidade}, entregam-lhe por engano um bilhete sem assinatura: {refem} está viva, o preço já foi combinado, e depois da lua nova deixa de haver negócio. O rapaz que o trouxe olha para si, percebe o erro e deita a correr.',
      fundo: 'Em {cidade}, os recados vão sempre pelos mesmos três rapazes, e pagam-lhes para não saberem ler. Este é mais novo do que os outros. Trocar de mesa foi o primeiro erro que cometeu, e talvez o último.',
      opcoes: [
        { t: 'Ler o papel à contraluz', d: 'As marcas de água têm dono.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A marca de água é de uma só oficina, e a oficina só vende a um cliente.', fx: { xp: 1 } }, ko: { txt: 'É só papel, e a vela quase o queima.', fx: {} } },
        { t: 'Correr atrás do rapaz', d: 'Ele conhece as ruas. Você tem pernas mais longas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Agarra-o junto ao poço. Sem fôlego, ele diz-lhe de onde vinha o bilhete.', fx: {} }, ko: { txt: 'Ele desaparece por uma fenda onde só cabe uma criança.', fx: {} } },
        { t: 'Perguntar quem conhecia a refém', d: 'Alguém nesta sala já a viu.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma cozinheira chora ao ouvir o nome, e conta-lhe quem a veio buscar.', fx: {} }, ko: { txt: 'A sala cala-se, e o estalajadeiro aumenta-lhe a conta.', fx: { ouro: -2 } } },
        { t: 'Preparar-se primeiro', d: 'Não se resgata ninguém de mãos vazias.', ok: { txt: 'Sai para o mercado com o bilhete dobrado na bota.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Cavalo Sem Cavaleiro', terreno: 'cidade',
      texto: 'Um cavalo entra em {cidade} a passo, de sela vazia e rédeas cortadas. Na sela há sangue seco, e o brasão de {refem}. As pessoas afastam-se, e a mulher do ferrador faz o sinal contra o azar. Ninguém pega nas rédeas, por isso pega você.',
      fundo: 'Um cavalo volta sempre para onde lhe deram de comer. Os criadores de {cidade} dizem que um bom animal é capaz de refazer o caminho de olhos fechados. Este, mesmo cansado, continua a virar a cabeça na mesma direção.',
      opcoes: [
        { t: 'Examinar a sela', d: 'A lama e o sangue têm uma ordem.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'A lama é vermelha, e só há uma estrada com lama desta cor.', fx: { xp: 1 } }, ko: { txt: 'Lama é lama, e o cavalo pisa-lhe o pé.', fx: { vida: -1 } } },
        { t: 'Deixar o cavalo escolher', d: 'Montar e soltar as rédeas.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Ele sai a galope até à última casa, e fica a olhar para uma estrada.', fx: {} }, ko: { txt: 'O cavalo decide que não gosta de si, e fá-lo saber.', fx: { vida: -2 } } },
        { t: 'Falar com a mulher do ferrador', d: 'Quem faz sinais sabe mais do que diz.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Ferrou este cavalo há três dias, e viu quem o levava.', fx: {} }, ko: { txt: 'Fecha-lhe a porta na cara, com o sinal ainda feito.', fx: {} } },
        { t: 'Vender a sela e equipar-se', d: 'A sela vale dinheiro, e a dona há de perdoar.', ok: { txt: 'Com a sela vendida, sobra algum para gastar no mercado.', fx: { ouro: 3, mercado: true } } },
      ] },
  ],
  impedir: [
    { titulo: 'A Lua no Poço', terreno: 'cidade',
      texto: 'Ao meio-dia, em {cidade}, as crianças juntam-se à volta do poço da praça. O céu está limpo e cheio de sol, mas lá em baixo, na água, brilha uma lua negra. A cada hora que passa, a lua fica mais redonda. Os velhos já estão a fechar as portas.',
      fundo: 'O poço da praça é mais antigo do que {cidade}, e foi à volta dele que a primeira rua nasceu. Nas crónicas fala-se de uma única outra vez em que a água mostrou um céu diferente. Não se sabe como acabou: as crónicas acabam nessa página.',
      opcoes: [
        { t: 'Medir a sombra da lua', d: 'Quanto falta, e de onde vem?', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'As contas apontam para um lugar. O reflexo, afinal, tem uma direção.', fx: { xp: 1 } }, ko: { txt: 'Quanto mais olha, mais lhe custa olhar para outro lado.', fx: { vida: -1 } } },
        { t: 'Descer ao poço', d: 'Pela corda, antes que alguém o impeça.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Lá em baixo, gravada na pedra molhada e ainda fresca, há uma marca que não devia estar ali.', fx: {} }, ko: { txt: 'A corda solta-se a meio. A água está mais fria do que devia.', fx: { vida: -2 } } },
        { t: 'Falar com os velhos', d: 'Fecham as portas porque já viram isto.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Uma avó abre a porta um palmo e diz-lhe onde foi que a coisa começou da outra vez.', fx: {} }, ko: { txt: 'Ninguém responde. Só as trancas fazem barulho.', fx: {} } },
        { t: 'Comprar antes que feche tudo', d: 'Daqui a uma hora não há lojas abertas.', ok: { txt: 'Os mercadores já estão a arrumar, e vendem depressa e barato.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Astrónomo no Telhado', terreno: 'cidade',
      texto: 'Um velho astrónomo está sentado na cumeeira mais alta de {cidade}, a gritar números para a rua. Os guardas tentam tirá-lo de lá há duas horas. Ao vê-lo a si, ele para, aponta e diz muito baixo, mas todos ouvem: "Tu. Tu ainda tens tempo de fazer as contas."',
      fundo: 'Passou quarenta anos a corrigir o calendário real, e ninguém leu as correções. A cidade habituou-se a rir dele. Foi só esta manhã que alguém reparou que, na última semana, acertou em tudo o que disse.',
      opcoes: [
        { t: 'Subir e rever as contas com ele', d: 'Os números estão certos? E onde?', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Estão certos, e horríveis. No fim do caderno há um lugar marcado.', fx: { xp: 1 } }, ko: { txt: 'Perde-se ao quarto cálculo, e ele chora de desilusão.', fx: {} } },
        { t: 'Roubar-lhe o caderno', d: 'Enquanto os guardas o seguram.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'O caderno vem consigo pelo telhado fora. A última página traz um nome de lugar, sublinhado três vezes.', fx: {} }, ko: { txt: 'Um guarda vê-o, e leva uma bastonada pelo incómodo.', fx: { vida: -2 } } },
        { t: 'Convencer os guardas a ouvi-lo', d: 'Só precisam de se calar um minuto.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Fazem silêncio, e ele diz o que tinha a dizer. A rua inteira ouve um nome de terra.', fx: {} }, ko: { txt: 'Quem acaba por ser levado por perturbar a ordem é você, e custa-lhe uma multa.', fx: { ouro: -2 } } },
        { t: 'Deixá-lo e preparar-se', d: 'Louco ou não, a lua nova vem aí.', ok: { txt: 'Compra o que pode, com os gritos dele atrás de si, rua abaixo.', fx: { mercado: true } } },
      ] },
  ],
  cacar: [
    { titulo: 'O Selo Partido', terreno: 'cidade',
      texto: 'Em {cidade}, um mensageiro cai à sua frente com uma seta nas costas. Na mão traz metade de um selo de cera, e um papel com uma lista de nomes riscados. O dele é o último, e o seguinte é o de toda uma cidade. Atrás de si, alguém na multidão já se afastou depressa demais.',
      fundo: 'Há anos que ninguém em {cidade} leva a sério os mensageiros do Selo. Eram a guarda postal de um reino que já não existe, e os últimos andam de terra em terra a entregar cartas que ninguém escreveu. Quando um deles chega a morrer para entregar alguma coisa, os mais velhos fecham as portas e benzem-se.',
      opcoes: [
        { t: 'Revistar o corpo', d: 'Os bolsos de um morto ainda têm muito a dizer.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'No forro do casaco há um bilhete cifrado.', fx: { xp: 1 } }, ko: { txt: 'Só encontra moedas ensanguentadas. Pelo menos pagam a próxima refeição.', fx: { ouro: 3 } } },
        { t: 'Perseguir o suspeito', d: 'Ele vira para o beco. Ainda dá tempo.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Encurrala-o entre dois barris. Antes de fugir pela janela, ele deixa cair uma nota com um símbolo.', fx: {} }, ko: { txt: 'Um cotovelo na curva e estrelas à frente dos olhos. Ele desaparece.', fx: { vida: -2 } } },
        { t: 'Levantar a multidão', d: 'Alguém viu alguma coisa, e vai falar.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Três perguntas certas, e uma peixeira conta-lhe de onde veio o homem e quem lhe pagava.', fx: {} }, ko: { txt: 'Ninguém viu nada, como sempre. Alguém lhe tira a bolsa na confusão.', fx: { ouro: -2 } } },
        { t: 'Ir às armas', d: 'Primeiro o equipamento. O resto logo se vê.', ok: { txt: 'Sai para o mercado, enquanto o guarda leva o corpo. Ninguém lhe pergunta nada.', fx: { mercado: true } } },
      ] },
    { titulo: 'O Nome na Porta', terreno: 'cidade',
      texto: 'Amanhece em {cidade} com uma folha pregada em cada porta da Rua Baixa. Em cada uma há um nome, e todos os nomes estão riscados menos o do dono da casa. Na taberna, o dono de uma dessas casas já não vai acordar. Na porta do seu quarto, há também uma folha.',
      fundo: 'A Rua Baixa foi construída para os trabalhadores da antiga casa da moeda. Todos os que lá vivem têm um avô que jurou segredo sobre alguma coisa, e nenhum sabe exatamente qual. Alguém, ao que parece, sabe.',
      opcoes: [
        { t: 'Comparar as folhas', d: 'A mesma letra, o mesmo papel, a mesma pressa.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, rasto: true, ok: { txt: 'Em todas as folhas, o mesmo prego: de um estaleiro que só serve um sítio.', fx: { xp: 1 } }, ko: { txt: 'Só conclui que a letra é feia, e que está na lista.', fx: {} } },
        { t: 'Esperar quem vem à noite', d: 'Quem prega as folhas volta para ver.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, rasto: true, ok: { txt: 'Segue uma sombra pelos telhados até uma carroça, e lê o destino na lona.', fx: {} }, ko: { txt: 'A sombra também o vê a si, e tem uma faca.', fx: { vida: -2 } } },
        { t: 'Reunir a rua na taberna', d: 'Juntos, talvez se lembrem do segredo.', tipo: 'social', roll: { a: 'carisma', dc: 10 }, rasto: true, ok: { txt: 'Entre gritos e copos partidos, sai um nome de sítio que todos os avós repetiam.', fx: {} }, ko: { txt: 'Acabam todos a acusar-se uns aos outros, e a si também.', fx: { vida: -1 } } },
        { t: 'Armar-se antes da noite', d: 'A folha da sua porta não vai esperar.', ok: { txt: 'Pela primeira vez, o armeiro não lhe pede para voltar amanhã.', fx: { mercado: true } } },
      ] },
  ],
};

// Procurar outra vez, antes de partir.
// ---------- Encontros por terreno ----------

let ENCONTROS = [
  { id: 'porta', terreno: 'ruina', titulo: 'A Porta de Ferro',
    texto: 'Uma porta de ferro barra o corredor, com um arame finíssimo esticado à altura do tornozelo. Do outro lado ouve-se alguém a respirar. Nas ombreiras, runas gastas repetem a mesma palavra.',
    fundo: 'Estas portas foram forjadas no tempo em que os mortos de Ossário ainda tinham quem os guardasse. A palavra das runas é "espera", e os eruditos discutem há séculos se é um aviso para quem entra ou uma ordem para quem está lá dentro.',
    opcoes: [
      { t: 'Arrombar a porta', d: 'Só o Bárbaro. Dobradiças são uma sugestão.', tipo: 'combate', req: { cls: 'barbaro' }, ok: { txt: 'A porta salta da parede e leva a armadilha com ela. O guarda lá dentro larga a bolsa e foge.', fx: { ouro: 6 } } },
      { t: 'Desarmar a armadilha', d: 'Só o Ladino. Um arame, duas pinças, nenhum drama.', tipo: 'habilidade', req: { cls: 'ladino' }, ok: { txt: 'Com um estalido suave, o mecanismo morre. Entra sem que ninguém perceba e leva o que encontra.', fx: { ouro: 7 } } },
      { t: 'Ler as runas', d: 'Só o Mago. A palavra é, afinal, uma senha.', tipo: 'investigacao', req: { cls: 'mago' }, ok: { txt: 'Pronuncia a palavra e a porta abre-se sozinha. Lá dentro há armas que alguém queria muito esconder.', fx: { item: 'rapieira' } } },
      { t: 'Forçar com cuidado', d: 'Evitar o arame e empurrar com tudo.', tipo: 'habilidade', roll: { a: 'forca', dc: 12 }, ok: { txt: 'A porta cede de má vontade, e passa sem acordar o mecanismo. Lá dentro há ouro esquecido.', fx: { ouro: 5 } }, ko: { txt: 'O arame rebenta. Uma agulha acerta-lhe no ombro e a dor sobe pelo braço.', fx: { vida: -3 } } },
      { t: 'Procurar outra passagem', d: 'Nenhuma porta merece tanto. Perde um dia, mas é seguro.', tipo: 'investigacao', ok: { txt: 'Uma grelha solta leva-o ao outro lado, sujo mas inteiro, um dia depois.', fx: { dia: 1 } } },
    ] },
  { id: 'cripta', terreno: 'ruina', titulo: 'A Cripta dos Sussurros',
    texto: 'As lajes abrem-se para uma cripta fria. Figuras magras levantam-se devagar dos nichos, a sussurrar nomes, e um deles parece ser o seu.',
    fundo: 'Os nichos foram pagos em vida por famílias que queriam ser lembradas. Com o tempo, as famílias acabaram e os nomes ficaram, e os que aqui dormem repetem-nos para não os perder. Dizem que ouvir o próprio nome numa cripta é só má sorte, a menos que responda.',
    opcoes: [
      { t: 'Expulsar os mortos', d: 'Só o Clérigo. A luz não negocia.', tipo: 'social', req: { cls: 'clerigo' }, ok: { txt: 'A prece enche a cripta de luz e os mortos voltam aos nichos, quase agradecidos. Fica com as oferendas.', fx: { ouro: 6, vida: 2 } } },
      { t: 'Erguer o amuleto', d: 'Requer o Amuleto de Prata.', tipo: 'social', req: { item: 'amuleto' }, ok: { txt: 'A prata arde sem queimar e os mortos abrem-lhe caminho. Num nicho, encontra uma poção ainda selada.', fx: { item: 'pocao', xp: 2 } } },
      { t: 'Correr pela cripta', d: 'Eles são lentos. Espera-se.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Dedos frios raspam-lhe a capa, mas chega ao outro lado de um fôlego só.', fx: { xp: 1 } }, ko: { txt: 'Uma mão prende-lhe o tornozelo e custa-lhe sangue para se soltar.', fx: { vida: -3 } } },
      { t: 'Abrir caminho à força', d: 'Ossos partem-se.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: 7, ini: 'Os Mortos da Cripta' }, ok: { txt: 'Sobra-lhe pó nas mãos e um caminho livre. Entre os ossos, algumas moedas antigas.', fx: { ouro: 6 } }, ko: { txt: 'São mais do que parecia. Sai de lá a arrastar-se.', fx: { vida: -4 } } },
    ] },
  { id: 'ponte', terreno: 'estrada', titulo: 'Emboscada na Ponte',
    texto: 'Três bandidos saem de trás de um carro virado. O maior aponta-lhe uma besta sem pressa. "A portagem é tudo o que levas contigo", diz. Os outros dois não parecem tão convencidos.',
    fundo: 'Desde que o conde de Lumiar deixou de pagar aos guardas, muitos deles arranjaram outra forma de cobrar pelo mesmo trabalho. Conhecem bem a estrada, e sabem quem a usa. Nem todos gostam do que fazem.',
    opcoes: [
      { t: 'Convencê-los de que não é ameaça', d: 'Só o Bardo. Uma boa história vale mais do que uma bolsa.', tipo: 'social', req: { cls: 'bardo' }, ok: { txt: 'Ao fim de dois versos já riem. Ao fim de quatro pagam-lhe uma bebida, e um deles promete não se esquecer de si.', fx: { ouro: 3, marca: 'bandidos' } } },
      { t: 'Intimidar o chefe', d: 'Só o Bárbaro. Basta avançar sem abrandar.', tipo: 'social', req: { cls: 'barbaro' }, ok: { txt: 'Avança sem parar até ele baixar a besta. Os três correm, e deixam para trás o saque do dia.', fx: { ouro: 7 } } },
      { t: 'Passar à frente deles', d: 'Requer Corda e Gancho. Por baixo da ponte ninguém cobra.', tipo: 'habilidade', req: { item: 'corda' }, ok: { txt: 'Desce pelas vigas e reaparece do outro lado, enquanto eles ainda discutem para onde foi.', fx: { xp: 2 } } },
      { t: 'Lutar', d: 'Antes que ele ganhe coragem.', tipo: 'combate', roll: { a: 'forca', dc: 12, pv: 6, ini: 'Os Bandidos da Ponte' }, ok: { txt: 'Derruba o chefe com o primeiro golpe. Os outros decidem que o emprego não compensa.', fx: { ouro: 5 } }, ko: { txt: 'A seta raspa-lhe as costelas antes de conseguir afugentá-los.', fx: { vida: -4 } } },
      { t: 'Pagar e poupá-los', d: 'Perde 3 de Ouro. Às vezes, a bondade volta.', tipo: 'social', ok: { txt: 'Conta as moedas devagar. "Isto dá para o pão", diz um deles, sem conseguir olhá-lo nos olhos.', fx: { ouro: -3, marca: 'bandidos' } } },
    ] },
  { id: 'carroca', terreno: 'estrada', titulo: 'A Carroça Partida',
    texto: 'Uma mercadora sentada na berma olha para uma roda partida como quem olha para um parente falecido. A carga, coberta por lona, range sozinha de vez em quando.',
    fundo: 'Sela anda nestas estradas há trinta anos, e tem uma regra: nunca abrir o que lhe pagam para não abrir. A carga é de um cliente que paga bem e não volta duas vezes. Ela nunca lhe viu as mãos sem luvas.',
    opcoes: [
      { t: 'Levantar a carroça', d: 'Custa um dia, mas ela há de lembrar-se.', tipo: 'habilidade', roll: { a: 'forca', dc: 10 }, ok: { txt: 'A roda volta ao eixo. Agradecida, ela abre a carroça: pode comprar-lhe o que quiser, e diz que não se esquece de quem a ajudou.', fx: { dia: 1, marca: 'sela', mercado: true } }, ko: { txt: 'As costas protestam com um estalo. Ela agradece a intenção, e deixa-o olhar para o que traz.', fx: { vida: -2, mercado: true } } },
      { t: 'Espreitar a lona', d: 'Só o Ladino. Sem que ela repare.', tipo: 'habilidade', req: { cls: 'ladino' }, ok: { txt: 'Lá dentro há gaiolas com símbolos riscados, e uma bolsa mal escondida que agora é sua.', fx: { ouro: 8 } } },
      { t: 'Negociar', d: 'Requer o antecedente Nobre Caído. Ela reconhece o sotaque.', tipo: 'social', req: { bg: 'nobre' }, ok: { txt: 'Ela endireita-se e trata-o por "senhoria". Dá-lhe uma poção por conta da casa, e deixa-o ver o resto.', fx: { item: 'pocao', mercado: true } } },
      { t: 'Ver o que ela vende', d: 'Sem ajudar. Negócio é negócio.', ok: { txt: 'Ela suspira e abre a lona com um único gesto, sem se levantar.', fx: { mercado: true } } },
      { t: 'Seguir viagem', d: 'Cada um com os seus problemas.', ok: { txt: 'Continua sem olhar para trás. Atrás de si, a carga range mais alto.', fx: {} } },
    ] },
  { id: 'cogumelos', terreno: 'floresta', titulo: 'O Círculo de Cogumelos',
    texto: 'O trilho termina num círculo perfeito de cogumelos pálidos. Dentro dele, a chuva não cai. Uma música muito baixa parece chamá-lo pelo nome de infância.',
    fundo: 'Os lenhadores de Vésper deixam pão à entrada destes círculos e nunca os pisam. Quem entra e sai no mesmo dia conta que dançou uma hora. Quem entra e sai no dia seguinte não costuma contar nada. A música, dizem, é sempre a que a sua mãe lhe cantava.',
    opcoes: [
      { t: 'Responder à música', d: 'Só Elfos sabem a resposta.', tipo: 'social', req: { raca: 'elfo' }, ok: { txt: 'Canta a estrofe que falta. O círculo abre-se num atalho, e o dia que ia perder fica para trás.', fx: { dia: -1, vida: 3 } } },
      { t: 'Ler os sinais do terreno', d: 'Só o Patrulheiro. Até as fadas deixam pegadas.', tipo: 'investigacao', req: { cls: 'patrulheiro' }, ok: { txt: 'Dá a volta por onde ninguém olha e encontra as coisas que os enfeitiçados largaram pelo caminho.', fx: { ouro: 8 } } },
      { t: 'Entrar no círculo', d: 'Com a cabeça firme. Pode valer muito.', tipo: 'investigacao', roll: { a: 'mente', dc: 13 }, ok: { txt: 'A música desiste de si. No centro há um cálice que lhe devolve as forças, e até algumas que não sabia que tinha.', fx: { vida: 5, xp: 3 } }, ko: { txt: 'Dança até os pés sangrarem e acorda um dia depois, a quilómetros dali.', fx: { vida: -3, dia: 1 } } },
      { t: 'Contornar pela lama', d: 'Longe, mas seguro.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 8 }, ok: { txt: 'Passa à larga, com lama até aos joelhos e a música a esmorecer atrás de si.', fx: {} }, ko: { txt: 'Escorrega numa ravina escondida pelos fetos.', fx: { vida: -2 } } },
    ] },
  { id: 'besta', terreno: 'floresta', titulo: 'Rastros de Besta',
    texto: 'Marcas de garras rasgam os troncos à altura da sua cabeça. O cheiro é recente, e o silêncio dos pássaros também. Algo grande anda por perto, e talvez já o tenha notado.',
    fundo: 'Os caçadores chamam-lhe a Velha de Vésper. Ninguém a viu duas vezes da mesma forma, e todos juram que é a única. Há quem acredite que vários deles morreram a caçar coisas diferentes com o mesmo nome.',
    opcoes: [
      { t: 'Virar o caçador', d: 'Só o Patrulheiro. A besta nem vai saber o que aconteceu.', tipo: 'combate', req: { cls: 'patrulheiro' }, ok: { txt: 'Segue os rastros em círculo e surpreende-a pelas costas. Na toca há restos de viajantes e os seus pertences.', fx: { ouro: 8, xp: 2 } } },
      { t: 'Encarar a besta', d: 'Só Meio-Orcs a fazem recuar com um rugido.', tipo: 'social', req: { raca: 'meioorc' }, ok: { txt: 'Solta um urro que faz tremer as folhas. A besta mede-o, reconsidera e desaparece.', fx: { vida: 2, xp: 2 } } },
      { t: 'Caçá-la', d: 'Uma pele destas vale muito.', tipo: 'combate', roll: { a: 'forca', dc: 14, pv: 8, ini: 'A Velha de Vésper' }, ok: { txt: 'É a caçada da sua vida. A pele e os dentes vão pagar muitas noites de taberna.', fx: { ouro: 12, xp: 2 } }, ko: { txt: 'As garras chegam primeiro. Foge com as costas em carne viva.', fx: { vida: -5 } } },
      { t: 'Afastar-se em silêncio', d: 'Um passo de cada vez.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 }, ok: { txt: 'Prende a respiração durante uma eternidade, até os pássaros voltarem a cantar.', fx: {} }, ko: { txt: 'Parte um ramo. Sai dali a correr, mas não antes de sentir as garras nas costas.', fx: { vida: -3 } } },
    ] },
  { id: 'abismo', terreno: 'montanha', titulo: 'A Ponte de Corda',
    texto: 'A ponte de corda sobre o abismo perdeu metade das tábuas. O vento uiva lá em baixo, e do outro lado alguém deixou pendurada uma lanterna ainda acesa.',
    fundo: 'A ponte foi feita pelos mineiros de Pedra-Alta para encurtar três dias de viagem. Deixaram de a reparar quando deixaram de voltar. A lanterna, porém, continua a ser acesa todas as noites, e ninguém sabe por quem.',
    opcoes: [
      { t: 'Lançar o gancho', d: 'Requer Corda e Gancho.', tipo: 'habilidade', req: { item: 'corda' }, ok: { txt: 'O gancho morde a rocha ao primeiro lançamento e atravessa em segurança. Junto à lanterna há um saco esquecido.', fx: { ouro: 6 } } },
      { t: 'Encontrar a via dos antigos', d: 'Só Anões veem os degraus escondidos na pedra.', tipo: 'investigacao', req: { raca: 'anao' }, ok: { txt: 'Há degraus talhados na rocha, invisíveis a quem não sabe, e levam-no bem mais depressa ao outro lado.', fx: { dia: -1, xp: 2 } } },
      { t: 'Atravessar a correr', d: 'Quanto menos tempo, melhor.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'As tábuas caem atrás de si, uma a uma. Chega ao outro lado a rir de nervos.', fx: { xp: 1 } }, ko: { txt: 'Uma tábua cede. Fica pendurado pelos braços e sobe com a pele em carne viva.', fx: { vida: -4 } } },
      { t: 'Dar a volta pela serra', d: 'Um dia a mais de frio e fome.', ok: { txt: 'A serra cobra o seu preço em frio. Chega de rastos, mas com todos os ossos no lugar.', fx: { vida: -1, dia: 1 } } },
    ] },
  { id: 'ogro', terreno: 'montanha', titulo: 'O Ogro Portageiro',
    texto: 'Um ogro senta-se no único caminho, a roer um osso de cabra. À sua frente, um cartaz escrito à mão diz: "PASAJEM 5 OIRO". O erro ortográfico parece magoá-lo mais a si do que a ele.',
    fundo: 'Chama-se Grumm e aprendeu a escrever com um padre que tentava convertê-lo. O padre desistiu, mas o gosto pelas letras ficou. Quem lhe corrige o cartaz com jeito costuma sair dali com um amigo muito grande.',
    opcoes: [
      { t: 'Corrigir o cartaz com charme', d: 'Só o Bardo faria disto uma lição de poesia.', tipo: 'social', req: { cls: 'bardo' }, ok: { txt: 'Ensina-lhe a palavra certa em verso. Comovido, ele levanta-se: "Grumm vai contigo. Grumm quer aprender mais."', fx: { aliado: 'grumm' } } },
      { t: 'Falar com ele na sua língua', d: 'Só Meio-Orcs conhecem estes grunhidos.', tipo: 'social', req: { raca: 'meioorc' }, ok: { txt: 'Dois grunhidos depois é um primo distante. Ele junta as suas coisas num saco e decide vir consigo.', fx: { aliado: 'grumm' } } },
      { t: 'Ensinar-lhe a ortografia', d: 'Com paciência. Pode custar um dia.', tipo: 'social', roll: { a: 'carisma', dc: 13 }, ok: { txt: 'Passam a tarde a riscar a terra com um pau. Ao fim, ele chora, abraça-o e pergunta se pode ir consigo.', fx: { aliado: 'grumm', dia: 1 } }, ko: { txt: 'Ele não gosta de ser corrigido. Sai dali com um olho negro e menos cinco de ouro.', fx: { vida: -2, ouro: -5 } } },
      { t: 'Pagar 5 de Ouro', d: 'Honesto e rápido.', ok: { txt: 'Ele morde cada moeda antes de lhe abrir caminho, com solenidade.', fx: { ouro: -5 } } },
      { t: 'Desafiá-lo', d: 'Ele é grande. Você é teimoso.', tipo: 'combate', roll: { a: 'forca', dc: 14, pv: 9, ini: 'Grumm, o Ogro' }, ok: { txt: 'Prende-lhe o braço e ele ri-se, admirado, antes de lhe ceder o caminho e o cofre.', fx: { ouro: 8 } }, ko: { txt: 'Acorda do outro lado da montanha, sem saber bem como, e com uma costela a menos no sítio.', fx: { vida: -5 } } },
    ] },
  { id: 'luzes', terreno: 'pantano', titulo: 'Velas no Pântano',
    texto: 'Ao cair da noite, luzinhas azuis acendem-se sobre a água e parecem desenhar um caminho. O guia que contratou não diz nada: limita-se a recuar, devagar, com os olhos muito abertos.',
    fundo: 'Chamam-lhes as Velas porque os afogados as acendem para encontrar o caminho de casa. Os guias locais têm uma única regra: nunca responder se alguém o chamar lá de dentro, mesmo que seja com a voz da sua mãe.',
    opcoes: [
      { t: 'Abrir a lanterna', d: 'Requer a Lanterna Furta-Fogo. A luz certa desfaz a mentira.', tipo: 'habilidade', req: { item: 'lanterna' }, ok: { txt: 'À luz firme, o caminho falso desaparece e o verdadeiro surge. Num tronco oco, alguém escondeu um embrulho.', fx: { ouro: 5, xp: 2 } } },
      { t: 'Abençoar a água', d: 'Só o Clérigo. As almas só querem descanso.', tipo: 'social', req: { cls: 'clerigo' }, ok: { txt: 'Uma a uma, as luzes apagam-se, em paz. Sente algo aliviar também dentro de si.', fx: { vida: 4, xp: 2 } } },
      { t: 'Seguir as luzes', d: 'Elas devem levar a algum lado, e talvez mais depressa.', tipo: 'investigacao', roll: { a: 'mente', dc: 14 }, ok: { txt: 'Percebe o padrão a tempo e pisa só onde as luzes não apontam. Poupa um dia inteiro.', fx: { dia: -1, xp: 1 } }, ko: { txt: 'Afunda-se até ao peito. Quando sai, a água gelada já lhe levou as forças.', fx: { vida: -5 } } },
      { t: 'Saltar de tronco em tronco', d: 'Ignorar as luzes e confiar nos pés.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Salto a salto, deixa o pântano para trás.', fx: {} }, ko: { txt: 'Um tronco afinal tinha olhos. Fica-lhe a marca dos dentes.', fx: { vida: -3 } } },
    ] },
  { id: 'bruxa', terreno: 'pantano', titulo: 'A Velha da Tigela',
    texto: 'Uma cabana sobre estacas fumega no meio dos juncos. Uma velha sem pressa estende-lhe uma tigela. "Sopa ou resposta", diz. "As duas têm preço."',
    fundo: 'Todos os que passam pelo pântano têm uma história sobre ela, e nenhuma coincide. Uns falam de uma avó bondosa, outros de algo muito mais antigo. Todos concordam num ponto: nunca recuse sem ser educado.',
    opcoes: [
      { t: 'Debater magia', d: 'Só o Mago aguenta esta conversa.', tipo: 'investigacao', req: { cls: 'mago' }, ok: { txt: 'Discutem até de madrugada. Encantada, ela dá-lhe a sopa sem cobrar, e um segredo que vale muitos dias de estudo.', fx: { vida: 4, xp: 5 } } },
      { t: 'Comprar o que ela tem', d: 'A tigela não é a única coisa à venda.', ok: { txt: 'Ela guarda as moedas num sapo e abre um baú que não estava ali.', fx: { mercado: true } } },
      { t: 'Aceitar a sopa', d: 'Está com fome e já provou pior. Custa 2 de Ouro.', tipo: 'habilidade', roll: { a: 'forca', dc: 9 }, ok: { txt: 'Sabe a raiz e a castigo, mas sente as forças a voltar.', fx: { vida: 6, ouro: -2 } }, ko: { txt: 'Passa a noite a arrepender-se. A velha acha muita graça.', fx: { vida: -2, ouro: -2 } } },
      { t: 'Recusar e sair', d: 'Nada de bom vem de tigelas oferecidas.', ok: { txt: 'Ela encolhe os ombros e bebe a sopa ela mesma. Sente-lhe o olhar nas costas durante muito tempo.', fx: {} } },
    ] },
  { id: 'naufragio', terreno: 'costa', titulo: 'O Naufrágio da Maré Baixa',
    texto: 'A maré recuou mais do que devia e deixou a descoberto um navio de casco negro. A carga brilha lá dentro. A água, ao longe, já vem de volta, sem barulho nenhum.',
    fundo: 'Na Enseada da Carpa, as crianças aprendem a contar com as ondas antes de aprenderem a contar com os dedos. O mar aqui recua sem aviso e volta sem barulho. Já levou mais gente do que todas as guerras do reino.',
    opcoes: [
      { t: 'Ler a maré', d: 'Requer o antecedente Marinheiro. Sabe quanto tempo tem.', tipo: 'investigacao', req: { bg: 'marinheiro' }, ok: { txt: 'Conta as ondas e entra quando deve. Sai com o baú e com um machado de bordo em perfeito estado.', fx: { ouro: 8, item: 'machado' } } },
      { t: 'Saquear à pressa', d: 'Agarrar o que der e correr.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Sai com a água pelos joelhos e os bolsos a tilintar.', fx: { ouro: 9 } }, ko: { txt: 'A onda apanha-o no porão e atira-o contra as vigas.', fx: { vida: -4, ouro: 3 } } },
      { t: 'Estudar o casco por fora', d: 'Quem afunda um navio assim, e porquê?', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'As marcas no casco não vêm de rochas. Alguém fez isto de propósito, e deixou contas por pagar.', fx: { xp: 4 } }, ko: { txt: 'Nada faz sentido, e a água já lhe molha as botas.', fx: {} } },
      { t: 'Deixar o navio em paz', d: 'A curiosidade já afogou melhores.', ok: { txt: 'Recua para as dunas. O mar fecha-se sobre o navio como uma boca.', fx: {} } },
    ] },
  { id: 'taberna', terreno: 'cidade', titulo: 'A Taberna do Último Gole',
    texto: 'Lareira, ensopado e uma sala cheia de gente a falar baixo demais. Num canto, uma mesa de dados chama-o, e o taberneiro limpa o mesmo copo há demasiado tempo enquanto o observa.',
    fundo: 'Dizem que o Último Gole tem esse nome porque é a última taberna antes de qualquer sítio, em qualquer cidade onde exista. Ninguém viu dois taberneiros iguais, mas todos limpam o mesmo copo.',
    opcoes: [
      { t: 'Atuar na sala', d: 'Só o Bardo. Em troca de jantar e de boatos.', tipo: 'social', req: { cls: 'bardo' }, ok: { txt: 'Põe a sala a cantar. Ganha uma bolsa, um prato e muita boa vontade.', fx: { ouro: 7, vida: 3 } } },
      { t: 'Procurar os contactos certos', d: 'Requer o antecedente Criminoso. Um gesto, e o copo para.', tipo: 'social', req: { bg: 'criminoso' }, ok: { txt: 'O taberneiro leva-o às traseiras e apresenta-lhe uma ladra que precisa de sair da cidade.', fx: { aliado: 'mira' } } },
      { t: 'Jogar aos dados', d: 'Só um olho bem treinado vê os dados viciados.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Ganha três rondas seguidas e sai antes que se lembrem de contar.', fx: { ouro: 8 } }, ko: { txt: 'Perde a aposta e leva um soco por protestar.', fx: { ouro: -3, vida: -2 } } },
      { t: 'Ouvir as conversas', d: 'Uma noite a beber devagar.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Junta metade de um boato com metade de outro. Fica a saber muito sobre a cidade e os seus medos.', fx: { xp: 4 } }, ko: { txt: 'Só aprende o preço da cerveja.', fx: { ouro: -1 } } },
    ] },
  { id: 'beco', terreno: 'cidade', titulo: 'O Beco das Velas',
    texto: 'Atrás do mercado, um rapaz franzino defende uma trouxa de livros contra dois homens grandes. Tem o nariz a sangrar e o queixo levantado. Ninguém na rua parece estar a ver.',
    fundo: 'O rapaz é noviço num mosteiro que fechou as portas há um mês, sem explicação. Dorme onde pode e carrega os únicos livros que conseguiu salvar. Os homens querem-nos por um preço que ele não imagina.',
    opcoes: [
      { t: 'Afastar os brutamontes', d: 'Dois contra um não é justo. Para eles.', tipo: 'combate', roll: { a: 'forca', dc: 11, pv: 5, ini: 'Os Brutamontes' }, ok: { txt: 'Saem a coxear. O rapaz chama-se Tomé, limpa o nariz, e declara que agora é seu aprendiz, quer queira quer não.', fx: { aliado: 'tome' } }, ko: { txt: 'Levam os livros e parte da sua dignidade.', fx: { vida: -3 } } },
      { t: 'Falar com eles', d: 'Quanto pagaram para isto?', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Paga-lhes o dobro em promessas e sai dali com o rapaz, os livros e uma nova dívida.', fx: { aliado: 'tome', ouro: -2 } }, ko: { txt: 'Não querem conversa e dizem-no com os punhos.', fx: { vida: -2 } } },
      { t: 'Passar à frente', d: 'Hoje não. Há outros assuntos.', ok: { txt: 'Segue pela rua. Ouve-se um grito curto, e depois nada. Daqui a uns dias, já não vai lembrar-se.', fx: { xp: 0 } } },
    ] },
  { id: 'forja', terreno: 'cidade', titulo: 'A Forja da Rua Baixa',
    texto: 'Um ferreiro de braços como troncos olha para a rua com a forja apagada. "Roubaram-me o martelo do meu pai", diz, sem que lhe tenha perguntado nada. "Pago bem a quem o trouxer de volta."',
    fundo: 'Bram foi o melhor ferreiro do reino até a Guilda exigir um terço de tudo o que fazia. Recusou. Agora arranjam-lhe um problema por semana, e o martelo é só o último deles.',
    opcoes: [
      { t: 'Recuperar o martelo', d: 'Custa-lhe um dia, mas ele fica a dever.', tipo: 'investigacao', roll: { a: 'mente', dc: 11 }, ok: { txt: 'O martelo estava na Guilda, e agora está de volta. Ele acende a forja, olha para si e pega no casaco: "Essa gente vai pagar. Vou consigo."', fx: { aliado: 'bram', dia: 1 } }, ko: { txt: 'Perde o dia, e leva uma tareia dos capangas da Guilda.', fx: { vida: -3, dia: 1 } } },
      { t: 'Oferecer-lhe trabalho', d: 'Perde 6 de Ouro para ele voltar a forjar.', tipo: 'social', ok: { txt: 'O ouro chega para comprar um martelo novo. Em troca, oferece-lhe a escolha do que tem em prateleira.', fx: { ouro: -6, mercado: true, marca: 'forja' } } },
      { t: 'Ver o que ele tem', d: 'Com ou sem martelo, tem de vender.', ok: { txt: 'Ele abre as prateleiras sem entusiasmo.', fx: { mercado: true } } },
    ] },
];

// ---------- Consequências: voltam mais tarde se a marca estiver registada ----------

let CONSEQUENCIAS = [
  { id: 'volta_bandidos', marca: 'bandidos', titulo: 'Velhos Conhecidos',
    texto: 'Na curva do caminho, reconhece o carro virado e os mesmos três homens, agora de roupa nova. O mais velho tira o chapéu. "Disse que não me esquecia. Há gente paga para o matar, a meia légua daqui. Quer companhia?"',
    fundo: 'A bondade é rara nestas estradas, e por isso é cara. Estes três não mudaram de vida, mas mudaram de lado, pelo menos enquanto lhes deve bem.',
    opcoes: [
      { t: 'Aceitar a companhia', d: 'Três bestas a mais não fazem mal a ninguém.', tipo: 'social', ok: { txt: 'Passam pela emboscada sem um arranhão e dividem o que os outros traziam.', fx: { ouro: 7, xp: 2 } } },
      { t: 'Desconfiar e esperar', d: 'Sabe o que eles são.', tipo: 'investigacao', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Tinha razão: quem paga é o mesmo que os contratou. Sai de lado, e fica com o nome.', fx: { xp: 5 } }, ko: { txt: 'Ofendidos, seguem sozinhos. A emboscada, afinal, não era mentira.', fx: { vida: -4 } } },
    ] },
  { id: 'volta_sela', marca: 'sela', titulo: 'A Roda Boa',
    texto: 'Uma carroça para ao seu lado, com uma roda visivelmente nova. "Disse que não me esquecia", diz a mercadora, sem sorrir. "Abri a carga. Já não trabalho para aquele homem, e preciso de quem saiba usar uma arma."',
    fundo: 'Trinta anos a nunca abrir o que lhe pagavam para não abrir. A sua ajuda deu-lhe um dia a mais para pensar nisso, e chegou.',
    opcoes: [
      { t: 'Levá-la consigo', d: 'Ela conhece toda a gente.', tipo: 'social', ok: { txt: 'Sela sobe para o seu lado da estrada com as coisas de uma vida numa única mala.', fx: { aliado: 'sela' } } },
      { t: 'Só comprar', d: 'Um bom preço, e cada um segue o seu caminho.', ok: { txt: 'Faz-lhe um preço de amigo e desaparece na próxima curva.', fx: { ouro: 4, mercado: true } } },
    ] },
  { id: 'volta_forja', marca: 'forja', titulo: 'A Forja Acesa',
    texto: 'Um rapaz da rua alcança-o a correr, sem fôlego, com um embrulho. "Do ferreiro. Disse que é para si, que está pago, e que a Guilda já não existe." Lá dentro, o aço ainda cheira a fogo.',
    fundo: 'Bram demorou três noites a fazer isto, e não dormiu em nenhuma delas. Nem sempre as pessoas têm a oportunidade de agradecer.',
    opcoes: [
      { t: 'Abrir o embrulho', d: 'Com cuidado.', ok: { txt: 'Uma cota de malha feita à sua medida, com a sua marca gravada por dentro.', fx: { item: 'cota', xp: 2 } } },
    ] },
];

// Encontros surpresa: "contra" apanham-no desprevenido, "favor" é você quem os vê primeiro.
let SURPRESAS = [
  { inimigo: 'Salteadores', pv: 6,
    contra: 'Uma rede cai sobre o caminho e três vultos saem da erva. Não teve sequer tempo de sacar da arma.',
    favor: 'Graças à sua cautela, vê-os primeiro: três salteadores, deitados na erva, à espera de alguém menos atento. Não o viram.',
    saque: 6 },
  { inimigo: 'Matilha', pv: 7,
    contra: 'Olhos amarelos acendem-se dos dois lados do caminho, ao mesmo tempo. Vêm famintos, e já estavam à sua espera há algum tempo.',
    favor: 'O vento está a seu favor. A matilha dorme junto a uma carcaça fresca, sem dar pela sua presença.',
    saque: 3 },
  { inimigo: 'Enviados de {vilao}', pv: 8,
    contra: 'Quatro figuras com o símbolo do selo cortam-lhe o caminho. Sabem o seu nome. Alguém os mandou aqui de propósito.',
    favor: 'Do alto de um penedo, vê quatro figuras com o símbolo do selo a montar guarda. Estão à sua espera, mas a olhar para o lado errado.',
    saque: 8 },
];

// Nem tudo o que se encontra na estrada é mau.
let BONS_ENCONTROS = [
  { id: 'curandeiro', titulo: 'O Curandeiro Errante',
    texto: 'Um homem de sacola ao ombro está sentado numa pedra, a ver quem passa. Olha para as suas feridas antes de olhar para si. "Isso trata-se", diz. "E eu estava mesmo a precisar de companhia."',
    opcoes: [
      { t: 'Deixar-se tratar', d: 'Sem pressa, e sem pagar nada.', ok: { txt: 'As mãos dele sabem o que fazem. Parte com menos dores, e com um conselho que não pediu.', fx: { vida: 6 } } },
      { t: 'Pedir-lhe um remédio', d: 'Para mais tarde.', ok: { txt: 'Dá-lhe um frasco selado, e não aceita uma única moeda.', fx: { item: 'pocao' } } },
    ] },
  { id: 'boleia', titulo: 'A Boleia do Carroceiro',
    texto: 'Uma carroça de feno abranda ao seu lado, e o carroceiro indica o lugar vazio com o queixo. Não diz nada. Os dois bois também não têm pressa, mas nunca param.',
    opcoes: [
      { t: 'Subir para a carroça', d: 'E dormir em cima do feno.', ok: { txt: 'Acorda muito mais longe do que julgava, e muito mais descansado.', fx: { dia: -1, vida: 2 } } },
      { t: 'Só lhe pedir notícias', d: 'Ele vê tudo, ali de cima.', ok: { txt: 'Fala pouco, mas o que diz vale ouro, e a seguir dá-lhe mesmo algumas moedas para levar a um primo.', fx: { xp: 3, ouro: 3 } } },
    ] },
  { id: 'tesouro', titulo: 'O Esconderijo do Salteador',
    texto: 'Debaixo de uma raiz arrancada pelo temporal, vê um baú pequeno e a ponta de um esqueleto. Quem aqui escondeu as suas coisas nunca mais voltou para as buscar.',
    opcoes: [
      { t: 'Abrir o baú', d: 'Ninguém o vai reclamar.', ok: { txt: 'Moedas de três reinos, um bom punhado de cada.', fx: { ouro: 12 } } },
      { t: 'Revirar os ossos', d: 'Os mortos guardam melhor do que os baús.', tipo: 'investigacao', roll: { a: 'mente', dc: 9 }, ok: { txt: 'No cinto, um diário com tudo o que ele sabia. Aprende muito com os erros dele.', fx: { xp: 6, ouro: 4 } }, ko: { txt: 'Algo mexe-se nas costelas, e morde-lhe a mão.', fx: { vida: -1 } } },
    ] },
];

let MERCADOR_SECRETO = {
  titulo: 'O Mercador Secreto',
  texto: 'Fora da estrada, uma tenda sem insígnia tem uma lanterna acesa em pleno dia. O homem lá dentro nem levanta os olhos. "Sei o que traz, e sei o que lhe falta. Por aqui, os preços são outros, e ninguém pergunta nada."',
  fundo: 'Dizem que a tenda nunca está duas vezes no mesmo sítio, e que o ferreiro que lá trabalha foi expulso da Guilda por fazer aço bom de mais. Ninguém sabe quem são os seus clientes. Ninguém quer ser o primeiro a contar que o é.',
  opcoes: [
    { t: 'Mostrar-lhe o equipamento', d: 'Melhorias com 30% de desconto.', ok: { txt: 'Passa os dedos pelo gume, e estende a mão para o resto.', fx: { forja: 'secreto' } } },
    { t: 'Ver o que traz para vender', d: 'Coisas que não se vendem no mercado.', ok: { txt: 'Abre um estojo de veludo sem dizer nada.', fx: { mercado: true } } },
    { t: 'Seguir caminho', d: 'Quem não faz perguntas também não dá garantias.', ok: { txt: 'Quando olha para trás, já não há lanterna nenhuma.', fx: {} } },
  ],
};

// O mestre aparece uma única vez, se tiver sorte.
const MENTORES = {
  mago: { titulo: 'A Torre que Anda', texto: 'Uma torre estreita caminha pelo descampado em pernas de pedra, e para ao seu lado com um suspiro. Na janela, uma mulher sem idade olha para o seu cajado e ri-se. "Quem te ensinou foi um idiota. Tens uma tarde. Escolhe o que queres aprender."' },
  barbaro: { titulo: 'O Último da Tribo', texto: 'Um velho enorme bloqueia o caminho, com mais cicatrizes do que pele. Não diz nada: dá-lhe um soco, vê-o ficar de pé, e acena. "Há dois caminhos para quem é como nós", rosna. "Na lua, ou no sangue."' },
  ladino: { titulo: 'A Mão Sem Dono', texto: 'Dá pela falta da bolsa, e depois volta a encontrá-la, com mais moedas do que tinha. Atrás de si, uma voz diz: "Bom. Só levei três segundos a perceber o teu estilo. Queres mesmo continuar a ser medíocre?"' },
  patrulheiro: { titulo: 'A Guardiã da Clareira', texto: 'Há um arco pendurado num ramo, e há um lobo sentado por baixo, à espera. A dona sai de trás de uma árvore que não estava ali. "Os bichos dizem que sabes ouvir. Agora escolhe: a seta certa, ou o amigo certo."' },
  clerigo: { titulo: 'O Eremita da Encruzilhada', texto: 'Um homem de hábito rasgado reza a dois altares ao mesmo tempo. Ao vê-lo, para e sorri, com pena. "Os deuses cansam-se. Alguns de nós foram servir os vivos, em ricas catedrais. Outros foram falar com os mortos. Tu, para que lado vais?"' },
  bardo: { titulo: 'A Canção Sem Autor', texto: 'Um velho de alaúde toca, à beira da estrada, uma música que sabe de cor sem nunca a ter ouvido. Não para de tocar para lhe falar. "Toda a gente ouve as notas. Poucos ouvem o que está entre elas. Queres aprender a enganá-los, ou a adormecê-los?"' },
};

// Atrasos: o que se passa quando o tempo é contado ao dia.
let ATRASOS = {
  cidade: [
    { id: 'preso', titulo: 'A Noite na Cela',
      texto: 'Uma discussão de taberna acaba como acabam todas, e por azar é você quem está de pé quando chegam os guardas. O sargento tem pouca paciência, um livro de multas e uma cela vazia.',
      opcoes: [
        { t: 'Cumprir a noite', d: 'Perde um dia inteiro.', ok: { txt: 'A palha pica, e o vizinho de cela canta. Sai de manhã, um dia mais tarde.', fx: { dia: 1 } } },
        { t: 'Pagar a fiança', d: 'Custa 6 de Ouro.', ok: { txt: 'O sargento conta as moedas duas vezes e abre a porta sem olhar para si.', fx: { ouro: -6 } } },
        { t: 'Convencer o sargento', d: 'A culpa foi claramente de outro.', tipo: 'social', roll: { a: 'carisma', dc: 12 }, ok: { txt: 'Sai pela porta da frente, com um pedido de desculpas e sem pagar nada.', fx: {} }, ko: { txt: 'O sargento acha graça, e ri-se até à manhã seguinte, com a chave no bolso.', fx: { dia: 1 } } },
      ] },
    { id: 'portas', titulo: 'As Portas Fechadas',
      texto: 'Toca o sino do recolher antes da hora, e as portas da cidade fecham-se à sua frente. Dizem que há um fugitivo, e que ninguém sai até o apanharem. Ninguém sabe dizer quando será.',
      opcoes: [
        { t: 'Esperar que abram', d: 'Perde um dia.', ok: { txt: 'Abrem de manhã, sem explicações. O fugitivo, afinal, era um cão.', fx: { dia: 1 } } },
        { t: 'Saltar a muralha', d: 'Há um sítio onde a guarda não olha.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Do outro lado, nem olha para trás.', fx: {} }, ko: { txt: 'O fosso é mais fundo do que parecia, e sai só no dia seguinte, a coxear.', fx: { dia: 1, vida: -1 } } },
        { t: 'Subornar o porteiro', d: 'Custa 4 de Ouro.', ok: { txt: 'Há sempre uma portinha pequena para quem paga.', fx: { ouro: -4 } } },
      ] },
    { id: 'pedinte', titulo: 'O Credor',
      texto: 'Um homem de boas maneiras e maus amigos jura que lhe deve dinheiro. Não é verdade, mas tem um papel, um advogado e dois sobrinhos à porta da estalagem.',
      opcoes: [
        { t: 'Ir ao tribunal', d: 'Ganha, mas perde o dia.', ok: { txt: 'O juiz dá-lhe razão ao fim da tarde, depois de bocejar muito.', fx: { dia: 1, xp: 1 } } },
        { t: 'Pagar para o calar', d: 'Custa 5 de Ouro.', ok: { txt: 'Ele guarda o papel com um sorriso. Noutro dia, será outro a pagar.', fx: { ouro: -5 } } },
        { t: 'Assustar os sobrinhos', d: 'Dois não são assim tantos.', tipo: 'social', roll: { a: 'forca', dc: 12 }, ok: { txt: 'O papel, de repente, já não é tão legal.', fx: {} }, ko: { txt: 'Eram mais fortes do que pareciam, e acorda um dia depois.', fx: { dia: 1, vida: -2 } } },
      ] },
  ],
  estrada: [
    { id: 'pontecaida', titulo: 'A Ponte Caída',
      texto: 'A ponte que vinha no mapa é agora um par de pilares e muita água. Um barqueiro cobra caro, e a volta pelo vau leva um dia inteiro.',
      opcoes: [
        { t: 'Dar a volta pelo vau', d: 'Perde um dia.', ok: { txt: 'A volta é longa e molhada, mas é de graça.', fx: { dia: 1 } } },
        { t: 'Pagar ao barqueiro', d: 'Custa 4 de Ouro.', ok: { txt: 'Ele nem olha para a corrente. O preço, afinal, era justo.', fx: { ouro: -4 } } },
        { t: 'Atravessar a nado', d: 'A corrente não parece assim tão forte.', tipo: 'habilidade', roll: { a: 'forca', dc: 12 }, ok: { txt: 'Sai do outro lado a tremer, mas a tempo.', fx: {} }, ko: { txt: 'A água leva-o rio abaixo até muito depois da curva.', fx: { dia: 1, vida: -2 } } },
      ] },
    { id: 'tempestade', titulo: 'O Temporal',
      texto: 'O céu escurece em poucos minutos, e o caminho vira ribeiro. Há uma gruta à vista, e já ouve o trovão mesmo por cima da cabeça.',
      opcoes: [
        { t: 'Abrigar-se na gruta', d: 'Perde um dia, mas descansa.', ok: { txt: 'Passa o temporal e a noite ao abrigo, e até consegue dormir.', fx: { dia: 1, vida: 2 } } },
        { t: 'Seguir à chuva', d: 'Não há tempo a perder.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 10 }, ok: { txt: 'Encharcado e de botas cheias, mas continua a andar.', fx: {} }, ko: { txt: 'A lama leva-lhe o pé e o resto. Fica um dia a recuperar.', fx: { dia: 1, vida: -2 } } },
      ] },
    { id: 'rebanho', titulo: 'O Rebanho',
      texto: 'Mil ovelhas, dois pastores e um cão que não concorda com nenhum deles enchem toda a largura da estrada, até onde os olhos alcançam. Vão no mesmo sentido, muito devagar.',
      opcoes: [
        { t: 'Esperar que passem', d: 'Perde um dia.', ok: { txt: 'Ao fim do dia, ainda consegue ouvi-las.', fx: { dia: 1 } } },
        { t: 'Cortar pelo monte', d: 'Pelo meio dos espinhos.', tipo: 'habilidade', roll: { a: 'mente', dc: 11 }, ok: { txt: 'Encontra o atalho dos pastores, e sai à frente de todas.', fx: { xp: 1 } }, ko: { txt: 'Perde-se, rasga-se todo e acaba, um dia depois, atrás das mesmas ovelhas.', fx: { dia: 1, vida: -1 } } },
      ] },
  ],
};

// ---------- Cartas únicas: sorteadas pelo mapa em cada partida ----------

const CARTAS_UNICAS = {
  cls: {
    barbaro: { t: 'Fúria Bárbara', d: 'Só o Bárbaro. O obstáculo deixa de ser um obstáculo.', tipo: 'combate', ok: { txt: 'Avança sem pensar e sem abrandar. Quando dá por si, já não há ninguém à sua frente, nem nada a barrar o caminho.', fx: { ouro: 5, xp: 3 } } },
    ladino: { t: 'Num Piscar de Olhos', d: 'Só o Ladino. Quando dão por si, você já não está aqui.', tipo: 'habilidade', ok: { txt: 'Passa por onde ninguém passaria, e quando sai traz a bolsa de quem nem chegou a vê-lo.', fx: { ouro: 7, xp: 2 } } },
    bardo: { t: 'A Canção Certa', d: 'Só o Bardo. Toda a gente tem uma canção que a desarma.', tipo: 'social', ok: { txt: 'Uma única estrofe muda o ar. Baixam-se as armas, sobem os copos, e ainda lhe dão de comer.', fx: { ouro: 4, vida: 2, xp: 3 } } },
    mago: { t: 'Palavra de Poder', d: 'Só o Mago. Basta dizê-la baixinho.', tipo: 'investigacao', ok: { txt: 'A palavra dobra o ar à sua volta. Tudo se resolve, e sente que compreendeu algo novo.', fx: { xp: 6 } } },
    clerigo: { t: 'Graça Divina', d: 'Só o Clérigo. Hoje, os deuses estão a ouvir.', tipo: 'social', ok: { txt: 'A luz chega sem ser chamada. O perigo passa-lhe ao lado, e as feridas fecham-se.', fx: { vida: 6, xp: 2 } } },
    patrulheiro: { t: 'Atalho Selvagem', d: 'Só o Patrulheiro. Há sempre outro caminho.', tipo: 'habilidade', ok: { txt: 'Sai do trilho por onde ninguém iria, e ganha à terra um dia inteiro. Ninguém o vê passar.', fx: { dia: -1, xp: 3 } } },
  },
  raca: {
    humano: { t: 'Toda a Gente Conhece Alguém', d: 'Só Humanos. Um primo, um amigo, um vizinho.', tipo: 'social', ok: { txt: 'Alguém conhece alguém que lhe deve um favor, e o favor resolve tudo.', fx: { ouro: 6, xp: 2 } } },
    elfo: { t: 'Olhos no Escuro', d: 'Só Elfos. O que se esconde na sombra não se esconde de si.', tipo: 'investigacao', ok: { txt: 'Vê o que ninguém veria, e evita o que ninguém evitaria.', fx: { vida: 2, xp: 4 } } },
    anao: { t: 'Pedra Nunca Mente', d: 'Só Anões. Toque na parede, e ela conta-lhe.', tipo: 'investigacao', ok: { txt: 'A pedra diz-lhe por onde ir, e onde outros esconderam o seu tesouro.', fx: { ouro: 8 } } },
    halfling: { t: 'Sorte Pequena', d: 'Só Halflings. As coisas correm-lhes bem, sem saberem porquê.', tipo: 'habilidade', ok: { txt: 'O perigo erra por um dedo. Tropeça numa bolsa, e ainda sai a rir.', fx: { ouro: 5, vida: 2 } } },
    meioorc: { t: 'Olhar de Orc', d: 'Só Meio-Orcs. Basta olhar assim.', tipo: 'social', ok: { txt: 'Ninguém quer ser o primeiro a descobrir se você está a falar a sério.', fx: { xp: 5 } } },
    tiefling: { t: 'Pacto Antigo', d: 'Só Tieflings. O seu sangue abre portas fechadas.', tipo: 'social', ok: { txt: 'Algo muito velho reconhece-o e abre-lhe caminho. É melhor não perguntar o preço.', fx: { xp: 4, ouro: 4 } } },
  },
  bg: {
    soldado: { t: 'Ordem de Marcha', d: 'Requer Soldado. Já viu isto tudo, e pior.', tipo: 'combate', ok: { txt: 'O corpo lembra-se antes da cabeça. Em segundos, a situação está sob controlo.', fx: { xp: 3, ouro: 4 } } },
    erudito: { t: 'Li Sobre Isto', d: 'Requer Erudito. Num livro que não devia ter lido.', tipo: 'investigacao', ok: { txt: 'A solução estava na página 212. Felizmente, você lembra-se dela.', fx: { xp: 6 } } },
    criminoso: { t: 'Velhos Contactos', d: 'Requer Criminoso. Alguém lhe deve um favor.', tipo: 'social', ok: { txt: 'Um assobio, e alguém aparece. O favor paga-se a si mesmo, e ainda sobra.', fx: { ouro: 9 } } },
    nobre: { t: 'Sabe Quem Sou?', d: 'Requer Nobre Caído. A voz ainda funciona.', tipo: 'social', ok: { txt: 'Ninguém sabe bem quem é, mas ninguém se atreve a perguntar.', fx: { ouro: 6, xp: 2 } } },
    eremita: { t: 'Silêncio Antigo', d: 'Requer Eremita. Sente-se. Espere. Ouça.', tipo: 'habilidade', ok: { txt: 'No silêncio, a solução vem sozinha, e o corpo descansa como há muito não fazia.', fx: { vida: 5, xp: 2 } } },
    marinheiro: { t: 'Nó de Marinheiro', d: 'Requer Marinheiro. Tudo se resolve com o nó certo.', tipo: 'habilidade', ok: { txt: 'Duas voltas de corda, e o problema fica literalmente preso.', fx: { ouro: 5, xp: 2 } } },
  },
};

// ---------- O mercado e a cidade ----------

let FIM_MORTE = {
  titulo: 'Fim da Linha',
  texto: 'As forças abandonam-no longe de casa, numa estrada sem nome. A missão fica por cumprir, e nas tabernas ainda hão de contar a história ao contrário.',
};
let FIM_TARDE = {
  titulo: 'Tarde Demais',
  texto: 'O céu muda de cor antes de você chegar, e já não há nada a fazer. {vilao} venceu, sem sequer precisar de saber que você existia.',
};

let PRESSAGIOS = [
  'O tempo aperta. Os presságios já se veem em todas as vilas, e tudo vai ser mais difícil a partir de agora.',
  'O prazo chegou ao fim. {vilao} está mais forte a cada dia, e a própria terra adoece à sua passagem.',
];

// ---------- Textos de contexto: abrem-se ao clicar nos nomes a vermelho no livro ----------

let LORE = {
  porto: { nome: 'Porto Salgado', titulo: 'Porto Salgado', texto: 'Cidade de armadores falidos e marinheiros a quem ainda devem dinheiro. Toda a gente em Porto Salgado tem uma dívida, e quase toda a gente a tem com a mesma família. Diz-se que o sal ali tira o gosto a tudo, menos ao ouro.' },
  vale: { nome: 'Vale Cinza', titulo: 'Vale Cinza', texto: 'Os moinhos pararam há doze anos, quando o rio mudou de cor. Quem ficou ficou por teimosia. O vale é conhecido pelos seus silêncios longos e pelas suas ruas onde as pessoas se cumprimentam sem se olhar.' },
  lumiar: { nome: 'Lumiar', titulo: 'Lumiar', texto: 'A cidade dos sinos tem uma torre em cada bairro, e cada torre tem o seu próprio toque. Há gente em Lumiar que sabe dizer as horas, o tempo e quem morreu só de ouvir. Há três noites que nenhum desses toques faz sentido.' },
  pedra: { nome: 'Pedra-Alta', titulo: 'Pedra-Alta', texto: 'Fortaleza construída onde a serra deixou de ser caminho. Os mineiros que a fundaram não pediram licença a ninguém, e os que lá vivem ainda não o fazem. O Rei Mineiro não usa coroa: usa uma picareta.' },
  vesper: { nome: 'Vésper', titulo: 'Floresta de Vésper', texto: 'Ninguém a atravessa pelo mesmo trilho duas vezes. Os lenhadores têm um acordo antigo com o que vive lá dentro, feito de pão deixado em pedras e de árvores nunca cortadas. O acordo tem vindo a ser renegociado, e não por eles.' },
  ponte: { nome: 'Ponte do Enforcado', titulo: 'Ponte do Enforcado', texto: 'Tem este nome por causa de um único homem, e já ninguém sabe quem foi nem o que fez. A corda, essa, é substituída todos os anos pela autarquia de Lumiar, por razões que constam da ata e que ninguém leu.' },
  corvo: { nome: 'Passo do Corvo', titulo: 'Passo do Corvo', texto: 'Única passagem entre o Vale e a serra durante metade do ano. Os corvos são muitos e estranhamente bem-educados, e diz-se que seguem os viajantes que vão morrer, por uma questão de cortesia.' },
  velas: { nome: 'Pântano das Velas', titulo: 'Pântano das Velas', texto: 'Foi uma vila, antes de o rio mudar de ideias. Em noites calmas ainda se veem os telhados debaixo de água, e as luzes azuis acendem-se nas janelas onde outrora havia velas de verdade.' },
  cruz: { nome: 'Encruzilhada Velha', titulo: 'Encruzilhada Velha', texto: 'Quatro estradas, um poço seco e uma estalagem que já ardeu sete vezes. Toda a gente passa por aqui, e por isso os reis antigos mandavam enforcar aqui os traidores: era a forma mais barata de dar notícias.' },
  ossario: { nome: 'Ossário', titulo: 'Ruínas de Ossário', texto: 'Cidade dos mortos construída por um povo que temia ser esquecido. Tinha mais túmulos do que casas, e sacerdotes pagos para repetir os nomes dos defuntos. Os sacerdotes desapareceram. Os nomes, dizem, continuam a ser repetidos.' },
  carpa: { nome: 'Enseada da Carpa', titulo: 'Enseada da Carpa', texto: 'Aldeia de pescadores numa baía onde o mar recua sem aviso e volta sem barulho. Quem nasce aqui sabe contar ondas antes de saber contar os dedos. Há vários navios no fundo da enseada que a maré às vezes mostra, e nunca os mesmos.' },
  cardeo: { nome: 'Monte Cárdeo', titulo: 'Monte Cárdeo', texto: 'Tem a cor de uma ferida antiga. Nada cresce acima da linha das neves, e os mineiros mais velhos recusam-se a cavar lá. Quando lhes perguntam porquê, respondem que uma montanha não devia ter pulso.' },
  torre: { nome: 'Torre Afogada', titulo: 'Torre Afogada', texto: 'Só aparece nas marés mais baixas do ano. Foi o farol de um reino que o mar engoliu numa só noite, e no alto ainda arde uma luz que nenhum marinheiro segue de boa vontade.' },
  afogado: { nome: 'Rei Afogado', titulo: 'O Rei Afogado', texto: 'Os livros chamam-lhe Aurel III e dão-no como morto no naufrágio da frota real, há cem anos. Foi o último soberano de um reino inteiro, e dizem que recusou abandonar o navio. Ninguém escreveu o que aconteceu a seguir.' },
  sacerdotisa: { nome: 'Sacerdotisa Velada', titulo: 'A Sacerdotisa Velada', texto: 'Ninguém lhe viu o rosto, e há três gerações que ninguém a vê envelhecer. Prega aos desesperados que o fim do mundo é misericórdia, e os desesperados têm-lhe dado cada vez mais razão.' },
  luvas: { nome: 'Luvas Brancas', titulo: 'O Homem das Luvas Brancas', texto: 'Nunca dá o nome. Paga sempre em dobro, a horas e em moeda boa, e tem sempre um selo real diferente na pasta. Há quem jure tê-lo visto em duas cortes inimigas no mesmo dia.' },
  bruxa: { nome: 'Bruxa do Junco', titulo: 'A Bruxa do Junco', texto: 'Para uns é uma curandeira, para outros uma velha doida, e ela nunca corrigiu ninguém. Guarda moedas na boca de sapos, e cada moeda vale um favor que ainda não cobrou. Tem muitas moedas, e está a começar a cobrar.' },
  capitao: { nome: 'Casco Negro', titulo: 'O Capitão do Casco Negro', texto: 'Empresta dinheiro a armadores em dificuldades, e o mar fica-lhes com os navios logo a seguir. Todos os contratos são legais, e todos têm a mesma cláusula, em letra muito pequena, sobre as marés.' },
  azyr: { nome: 'Adaga de Azyr', titulo: 'A Adaga de Azyr', texto: 'Forjada para matar um único homem, e nunca usada. Azyr, a sua dona, morreu de velhice a jurar que tinha sido a pior decisão da sua vida. Quem a segura sente sempre que falta muito pouco para saber quem é esse homem.' },
  sino: { nome: 'Sino Mudo de Lumiar', titulo: 'O Sino Mudo de Lumiar', texto: 'O primeiro sino da cidade nunca tocou. Dizem que foi fundido para anunciar o fim de todas as coisas, e que os bispos antigos lhe tiraram o badalo. Quem o encontrar terá de decidir o que fazer com o silêncio.' },
  olho: { nome: 'Olho de Cárdeo', titulo: 'O Olho de Cárdeo', texto: 'Uma pedra do tamanho de um punho, dourada, com uma pupila ao centro. Os mineiros que a retiraram da montanha nunca disseram onde a encontraram, nem porque decidiram pô-la de volta. O olho, dizem, ainda pestaneja.' },
  codice: { nome: 'Códice de Vésper', titulo: 'O Códice de Vésper', texto: 'Um livro sem autor, escrito em muitas letras diferentes, e que se escreve sozinho em noites de eclipse. Os monges que o guardavam queimaram o seu mosteiro em vez de o entregar a alguém. O códice sobreviveu; os monges, não.' },
  selo: { nome: 'selo', titulo: 'Os Mensageiros do Selo', texto: 'Foram os correios de um reino que acabou há gerações. Continuam a entregar cartas, sem que ninguém lhes pague, e sem que ninguém saiba quem as escreve. Quando morre um mensageiro, a carta chega sempre, de uma maneira ou de outra.' },
  guilda: { nome: 'Guilda', titulo: 'A Guilda dos Ferros', texto: 'Controla quem pode forjar o quê em todas as cidades do reino. Cobra um terço e chama-lhe proteção, sem que ninguém saiba exatamente do quê. Os seus capangas usam um anel de ferro no polegar.' },
  mira: { nome: 'Mira', titulo: 'Mira das Sombras', texto: 'Nunca conta duas vezes a mesma história sobre como perdeu o dedo mindinho. É a melhor ladra das quatro cidades, segundo ela própria, e deve dinheiro nas quatro.' },
  grumm: { nome: 'Grumm', titulo: 'Grumm, o Ogro', texto: 'Aprendeu a ler com um padre, e o padre aprendeu a correr com ele. Está a escrever um livro, sobre uma ponte. Já vai no capítulo dois e tem esperança de que o seu amigo o ajude com os acentos.' },
  tome: { nome: 'Tomé', titulo: 'Tomé, o Noviço', texto: 'Órfão de um mosteiro que fechou as portas há um mês. Sabe de cor livros que ninguém devia saber, e fala deles com a calma alarmante dos seus catorze anos.' },
  bram: { nome: 'Bram', titulo: 'Bram, o Ferreiro', texto: 'O melhor ferreiro do reino, até dizer à Guilda onde podia meter o terço. Tem um humor pior do que o aço que trabalha, e um respeito absoluto por quem paga o que deve.' },
  sela: { nome: 'Sela', titulo: 'Sela, a Mercadora', texto: 'Trinta anos a percorrer as mesmas estradas e a nunca abrir o que lhe pagavam para não abrir. Conhece toda a gente. Já ninguém sabe se isso é uma ameaça ou um cumprimento.' },
};
