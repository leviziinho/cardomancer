// A história do jogo. Este é o ficheiro onde entra o conteúdo criativo: nomes, lugares e cenas.
// {cidade}, {vilao}, {reliquia}, {refem}, {motivo}, {proximo}, {pista} e {destino} são preenchidos em cada partida.
//
// Cada opção: t (título), d (descrição), tipo (combate, social, habilidade, investigacao),
// req (cls, raca, bg, item), roll { a: atributo, dc, pv: resistência do inimigo }, ok e ko { txt, fx }.
// fx aceita: vida, ouro, xp, dia, item, aliado, marca, mercado.
//
// Aqui fica o que serve a todos os mundos. As peças de cada mundo vêm do ficheiro dele (daraan.js), e ativarMundo põe-nas nestas variáveis.

// ---------- Peças da trama: cada partida sorteia uma de cada ----------

let OBJETIVOS = {};

let RELIQUIAS = [];
let REFENS = [];

let VILOES = {};

// Reviravoltas: acontecem de surpresa depois da segunda pista.
let REVIRAVOLTAS = {};

// ---------- O início ----------

// Cada missão tem mais do que uma forma de começar.
let GANCHOS = {};

// Procurar outra vez, antes de partir.
// ---------- Encontros por terreno ----------

let ENCONTROS = [];

// ---------- Consequências: voltam mais tarde se a marca estiver registada ----------

let CONSEQUENCIAS = [];

// Encontros surpresa: "contra" apanham-no desprevenido, "favor" é você quem os vê primeiro.
let SURPRESAS = [];

// Nem tudo o que se encontra na estrada é mau.
let BONS_ENCONTROS = [];

let MERCADOR_SECRETO = {};

// O mestre aparece uma única vez, se tiver sorte.
const MENTORES = {
  mago: { titulo: 'A Torre Flutuante', texto: 'Uma torre estreita flutua sobre o descampado, e para ao seu lado. Na janela, uma mulher misteriosa olha para o seu cajado e ri-se. "Quem te ensinou foi um idiota, mas trataremos disso. Tens uma tarde, e o meu conhecimento é teu."' },
  barbaro: { titulo: 'O Último da Tribo', texto: 'Um velho enorme bloqueia o caminho, com inúmeras cicatrizes sob a pele. Aproxima-se sem dizer nada: dá-lhe um soco, vê-o ficar de pé, e ri-se. "Há dois caminhos para quem é como nós", rosna. "Na Lua, ou no Sangue."' },
  ladino: { titulo: 'A Mão Sem Rasto', texto: 'Dá pela falta da bolsa, e depois volta a encontrá-la, com mais moedas do que tinha. Atrás de si, uma voz diz: "Bom. Só levei três segundos a perceber o teu estilo. Queres mesmo continuar a ser medíocre?"' },
  patrulheiro: { titulo: 'A Guardiã da Clareira', texto: 'Há um arco pendurado num ramo, e há um lobo sentado por baixo, à espera. A dona sai de trás de uma árvore que não estava ali. "Os bichos dizem que sabes ouvir. Agora escolhe: a flecha certeira, ou o companheiro fiel."' },
  clerigo: { titulo: 'O Eremita da Encruzilhada', texto: 'Um homem de hábito rasgado reza a dois altares ao mesmo tempo. Ao vê-lo, para e sorri, com pena. "Os deuses cansam-se. Alguns de nós foram servir os vivos, em ricas catedrais. Outros foram falar com os mortos. Tu, para que lado vais?"' },
  bardo: { titulo: 'A Canção Sem Autor', texto: 'Um velho de alaúde toca, à beira da estrada, uma música que sabe de cor. Junta à letra uma mensagem para si. "Toda a gente ouve as notas. Poucos ouvem o que está entre elas. Queres aprender a enganá-los, ou a adormecê-los?"' },
};

// Prelúdio: antes da missão, o herói conta quem é, pela sua boca. Serve em qualquer mundo, por isso não tem nomes de lugares.
// Raças e antecedentes podem ter o seu próprio "preludio"; sem ele, usa-se a primeira frase da descrição.
const PRELUDIOS = {
  barbaro: { titulo: 'A Diplomacia da Força', texto: 'A minha tribo media os anos pelos invernos a que sobrevivia. Eu sobrevivi a todos, e a tribo não. Não sei ler, nem preciso: sei que a raiva é um fogo, e que quem a guarda dentro acaba queimado. Eu deixo-a sair.' },
  ladino: { titulo: 'Ninguém Me Viu Chegar', texto: 'Cresci em ruas onde o pão era de quem corria mais depressa. Aprendi cedo que toda a porta tem uma fraqueza, e todo o homem também. Não me chamem ladrão. Eu só encontro o que os outros guardam mal.' },
  bardo: { titulo: 'Uma Canção Por Acabar', texto: 'Já cantei para reis e para bêbados, e, acredite, os bêbados pagavam melhor. Mas há uma canção que ainda não escrevi, porque lhe falta o fim. Dizem que as melhores histórias se vivem antes de se cantarem. Vou à procura da minha, e não vou sozinho.' },
  mago: { titulo: 'O Que os Livros Não Dizem', texto: 'Passei mais anos debruçado sobre páginas do que a olhar o céu. Os livros falam com quem tem paciência, e eu tenho muita. O meu mestre dizia que o mundo é um texto mal traduzido. Vim corrigir os erros.' },
  clerigo: { titulo: 'A Fé Escolheu-me', texto: 'Não fui eu que escolhi a fé: foi ela que me encontrou, numa noite em que devia ter morrido. Desde então, as minhas mãos fecham feridas que não deviam fechar. Há quem me chame santo. Eu só pago uma dívida.' },
  patrulheiro: { titulo: 'O Rasto na Lama', texto: 'O homem mente, mas a terra não. Um ramo partido, uma pegada funda, um silêncio no sítio errado: é assim que leio o mundo. Nunca dormi duas noites no mesmo lugar, e nunca fechei os olhos sem vigília.' },
  feiticeiro: { titulo: 'O Fogo Que Herdei', texto: 'Nunca estudei magia. Ela já cá estava quando nasci, enrolada no meu sangue como uma serpente a dormir. Quando acorda, as coisas ardem. Cada feitiço cobra-me ao corpo, e um dia vou saber a quem devo esta herança.' },
  monge: { titulo: 'O Silêncio Antes do Golpe', texto: 'Disseram-me que as armas são para quem tem medo. No mosteiro aprendi a ouvir o coração de quem tenho à frente, e a saber o que vai fazer antes de ele o saber. Desci da montanha de mãos vazias. É o suficiente.' },
  druida: { titulo: 'A Terra Respira Comigo', texto: 'As cidades fazem barulho demais. Eu cresci entre raízes, a aprender o nome que os bichos dão uns aos outros. A floresta empresta-me a sua força, e em troca peço-lhe pouco. Mas algo está a apodrecer lá fora, e a terra pediu-me que fosse ver.' },
  guerreiro: { titulo: 'Cada Cicatriz, Uma Lição', texto: 'Treinei com todas as armas que me deram, e com algumas que tirei a quem as usava contra mim. Não procuro glória: já a tive, e não me deu de comer. Procuro uma luta que valha a pena. Dizem que há uma à minha espera.' },
};

// Atrasos: o que se passa quando o tempo é contado ao dia.
const ATRASOS_GERAIS = {
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
let ATRASOS = ATRASOS_GERAIS;

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

let FIM_MORTE = {};
let FIM_TARDE = {};

let PRESSAGIOS = [];

// ---------- Textos de contexto: abrem-se ao clicar nos nomes a vermelho no livro ----------

let LORE = {};
