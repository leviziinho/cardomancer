// Catálogo de regras: atributos, tipos de carta, classes, objetos, talentos, aliados e lugares.
// A história (cenas, tramas e textos de contexto) está em historia.js.

const ATTR = {
  forca: { nome: 'Força', glyph: 'punho' },
  agilidade: { nome: 'Agilidade', glyph: 'pesAlados' },
  mente: { nome: 'Mente', glyph: 'cerebro' },
  carisma: { nome: 'Carisma', glyph: 'labios' },
};

const TIPOS = {
  combate: { nome: 'Combate', glyph: 'sword' },
  social: { nome: 'Social', glyph: 'speech' },
  habilidade: { nome: 'Habilidade', glyph: 'feather' },
  investigacao: { nome: 'Investigação', glyph: 'eye' },
  magia: { nome: 'Magia', glyph: 'star' },
  tecnica: { nome: 'Técnica', glyph: 'sword' },
};

const CLASSES = {
  barbaro: { nome: 'Bárbaro', glyph: 'axe', cor: 0x9c1414, vida: 12, attrs: { forca: 2, agilidade: 2, carisma: -1, mente: -1 }, raridade: 'lendaria', habilidade: 'Fúria: +3 Força, um ataque a mais por ronda, -2 CA, e não foge.', desc: 'Resolve portas, grilhões e discussões da mesma maneira: com força.' },
  ladino: { nome: 'Ladino', glyph: 'dagger', cor: 0x2b2b33, vida: 8, attrs: { agilidade: 4, mente: 2, carisma: 1, forca: -1 }, raridade: 'rara', vantagem: ['mente', 'agilidade'], vePrimeiro: true, habilidade: 'Fora de combate, testes de Agilidade e Mente com dois d20: fica o melhor. Vê sempre os perigos da estrada, e pode passar à larga.', desc: 'Vê a armadilha antes de a pisar e a saída antes de precisar dela.' },
  bardo: { nome: 'Bardo', glyph: 'note', cor: 0xb0701c, vida: 7, attrs: { carisma: 4, mente: 1 }, raridade: 'rara', aliadoInicial: true, aliadosNivel: true, habilidade: 'Começa com um aliado, e os aliados somam o seu nível ao dano.', desc: 'Convence um inimigo de que nunca houve motivo para lutar.' },
  mago: { nome: 'Mago', glyph: 'star', cor: 0x3a2a8c, vida: 12, attrs: { mente: 3, carisma: 1 }, raridade: 'incomum', caDe: 'mente', habilidade: 'Soma a Mente à CA.', desc: 'Lê as runas que os outros tomam por riscos na pedra.' },
  clerigo: { nome: 'Clérigo', glyph: 'sun', cor: 0xd8c27a, vida: 10, attrs: { mente: 3, carisma: 2 }, raridade: 'incomum', curaSempre: 'curar', habilidade: 'Em combate, tem sempre à mão Curar Feridas.', desc: 'Sara feridas e manda de volta o que devia continuar morto.' },
  patrulheiro: { nome: 'Patrulheiro', glyph: 'bow', cor: 0x2f6b3a, vida: 10, attrs: { agilidade: 1, forca: 1, mente: 1 }, raridade: 'comum', companheiros: ['lobo', 'urso', 'aguia'], habilidade: 'Começa com um companheiro: Lobo, Urso ou Águia.', desc: 'Lê a terra como quem lê um livro aberto.' },
};

const ANTECEDENTES = {
  soldado: { nome: 'Soldado', glyph: 'dagger', attrs: { forca: 1 }, vida: 1, desc: 'Sobreviveu a uma guerra que já ninguém recorda. +1 Força, +1 Vida.' },
  erudito: { nome: 'Erudito', glyph: 'scroll', attrs: { mente: 1 }, xp: 3, desc: 'Leu o que não devia. +1 Mente e começa com 3 XP.' },
  criminoso: { nome: 'Criminoso', glyph: 'lock', attrs: { agilidade: 1 }, ouro: 4, desc: 'Conhece quem vende e quem cala. +1 Agilidade, +4 Ouro.' },
  nobre: { nome: 'Nobre Caído', glyph: 'crown', attrs: { carisma: 1 }, ouro: 8, desc: 'Perdeu as terras, mas não as maneiras. +1 Carisma, +8 Ouro.' },
  eremita: { nome: 'Eremita', glyph: 'moon', attrs: { mente: 1 }, vida: 2, desc: 'Anos de silêncio ensinaram-lhe a resistir. +1 Mente, +2 Vida.' },
  marinheiro: { nome: 'Marinheiro', glyph: 'sign', attrs: { agilidade: 1 }, vida: 1, desc: 'Nós, marés e estrelas não têm segredos. +1 Agilidade, +1 Vida.' },
};

const RACAS = {
  humano: { nome: 'Humano', glyph: 'speech', attrs: { carisma: 1 }, ouro: 3, desc: 'Adapta-se a tudo e fala com todos. +1 Carisma, +3 Ouro.' },
  elfo: { nome: 'Elfo', glyph: 'leaf', attrs: { agilidade: 1, mente: 1 }, desc: 'Vê no escuro e ouve a floresta. +1 Agilidade, +1 Mente.' },
  anao: { nome: 'Anão', glyph: 'hammer', attrs: { forca: 1 }, vida: 3, desc: 'Teimoso como a pedra que conhece bem. +1 Força, +3 Vida.' },
  halfling: { nome: 'Halfling', glyph: 'feather', attrs: { agilidade: 1 }, vida: 1, ouro: 2, desc: 'Pequeno, discreto e sortudo. +1 Agilidade, +1 Vida, +2 Ouro.' },
  meioorc: { nome: 'Meio-Orc', glyph: 'axe', attrs: { forca: 2 }, desc: 'Ninguém lhe cobra portagem duas vezes. +2 Força.' },
};

// slot: arma, armadura, acessorio ou mochila. Só cabe um objeto por slot do corpo.
// O que se larga converte-se em 1/4 do preço.
const ITENS = {
  adaga: { nome: 'Adaga Curva', slot: 'arma', preco: 8, dado: 'd6', a: 'agilidade', attrs: { agilidade: 1 }, glyph: 'dagger', desc: 'Ataca com Agilidade. Dado d6, +1 Agilidade.' },
  cajado: { nome: 'Cajado de Freixo', slot: 'arma', preco: 8, dado: 'd6', a: 'mente', attrs: { mente: 1 }, glyph: 'star', desc: 'Ataca com Mente. Dado d6, +1 Mente.' },
  // Focos mágicos: só quem lança magia sabe tirar deles mais do que um pau ou uma pedra.
  vara: { nome: 'Vara de Sabugueiro', slot: 'arma', perfil: 'magica', preco: 14, dado: 'd8', a: 'mente', attrs: { mente: 1 }, glyph: 'leaf', desc: 'Foco mágico, só para quem lança magia. Ataca com Mente. Dado d8, +1 Mente.' },
  orbe: { nome: 'Orbe de Cristal', slot: 'arma', perfil: 'magica', preco: 16, dado: 'd8', a: 'carisma', attrs: { carisma: 1 }, glyph: 'sun', desc: 'Foco mágico, só para quem lança magia. Ataca com Carisma. Dado d8, +1 Carisma.' },
  simbolo: { nome: 'Símbolo Sagrado', slot: 'arma', perfil: 'magica', preco: 16, dado: 'd8', a: 'mente', attrs: { carisma: 1 }, glyph: 'seal', desc: 'Foco mágico, só para quem lança magia. Ataca com Mente. Dado d8, +1 Carisma.' },
  grimorio: { nome: 'Grimório Proibido', slot: 'arma', perfil: 'magica', preco: 22, dado: 'd10', a: 'mente', attrs: { carisma: -1 }, glyph: 'rune', desc: 'Foco mágico, só para quem lança magia. Ataca com Mente. Dado d10, -1 Carisma: há páginas que não se leem em voz alta.' },
  espada: { nome: 'Espada de Família', slot: 'arma', perfil: 'marcial', preco: 12, dado: 'd8', a: 'forca', ca: 1, glyph: 'sword', desc: 'Ataca com Força. Velha, mas sabe aparar. Dado d8, +1 CA.' },
  rapieira: { nome: 'Rapieira de Duelo', slot: 'arma', perfil: 'fina', preco: 16, dado: 'd8', a: 'agilidade', attrs: { carisma: 1 }, glyph: 'sword', desc: 'Ataca com Agilidade. Dado d8, +1 Carisma.' },
  arco: { nome: 'Arco de Teixo', slot: 'arma', perfil: 'arco', preco: 16, dado: 'd8', a: 'agilidade', attrs: { agilidade: 1 }, glyph: 'bow', desc: 'Ataca com Agilidade. Dado d8, +1 Agilidade.' },
  machado: { nome: 'Machado de Guerra', slot: 'arma', perfil: 'pesada', preco: 18, dado: 'd10', a: 'forca', glyph: 'axe', desc: 'Ataca com Força. Pesado e pouco diplomático. Dado d10.' },
  montante: { nome: 'Montante', slot: 'arma', perfil: 'pesada', preco: 26, dado: 'd12', a: 'forca', attrs: { agilidade: -1 }, glyph: 'sword', desc: 'Ataca com Força. Dado d12, -1 Agilidade.' },
  gibao: { nome: 'Gibão de Couro', slot: 'armadura', perfil: 'couro', preco: 8, ca: 2, glyph: 'shield', desc: 'Protege o suficiente. +2 CA.' },
  cota: { nome: 'Cota de Malha', slot: 'armadura', perfil: 'malha', preco: 18, ca: 4, attrs: { agilidade: -1 }, glyph: 'shield', desc: 'Pesa, mas segura. +4 CA, -1 Agilidade.' },
  capa: { nome: 'Capa Cinzenta', slot: 'armadura', preco: 12, ca: 1, attrs: { agilidade: 1 }, glyph: 'feather', desc: 'Confunde-se com a noite. +1 CA, +1 Agilidade.' },
  manto: { nome: 'Manto do Escriba', slot: 'armadura', preco: 12, ca: 1, attrs: { mente: 1 }, glyph: 'scroll', desc: 'Bolsos para tudo e cheiro a tinta. +1 CA, +1 Mente.' },
  amuleto: { nome: 'Amuleto de Prata', slot: 'acessorio', preco: 10, glyph: 'seal', desc: 'Os mortos-vivos hesitam diante dele.' },
  anel: { nome: 'Anel de Sinete', slot: 'acessorio', preco: 12, attrs: { carisma: 1 }, glyph: 'crown', desc: 'Abre portas e calou muita gente. +1 Carisma.' },
  diario: { nome: 'Diário Cifrado', slot: 'acessorio', preco: 12, attrs: { mente: 1 }, glyph: 'eye', desc: 'As notas de um sábio desaparecido. +1 Mente.' },
  bracal: { nome: 'Braçal de Ferro', slot: 'acessorio', preco: 12, attrs: { forca: 1 }, glyph: 'hammer', desc: 'Dá peso a cada golpe. +1 Força.' },
  pocao: { nome: 'Poção de Cura', slot: 'mochila', preco: 7, uso: { vida: 7 }, glyph: 'drop', desc: 'Clique nela na mesa para recuperar 7 de Vida. Salva-o sozinha se a Vida chegar a 0. Usada, fica virada.' },
  corda: { nome: 'Corda e Gancho', slot: 'mochila', preco: 5, glyph: 'sign', prepara: 'habilidade', desc: 'Abre caminhos onde não há caminho. Dá vantagem num teste difícil de Habilidade: dois d20, fica o melhor. Gasta-se.' },
  lanterna: { nome: 'Lanterna Furta-Fogo', slot: 'mochila', preco: 5, glyph: 'flame', prepara: 'investigacao', desc: 'Luz que só aponta para onde você quer. Dá vantagem num teste difícil de Investigação: dois d20, fica o melhor. Gasta-se.' },
};
const MOCHILA_MAX = 3;
// Que armas e armaduras cada classe sabe usar. O que não tem 'perfil' (adaga, cajado, capas, mantos, acessórios) serve a todos.
const PERFIS = {
  barbaro: ['marcial', 'pesada', 'couro', 'malha'],
  guerreiro: ['marcial', 'fina', 'arco', 'pesada', 'couro', 'malha', 'placas'],
  patrulheiro: ['marcial', 'fina', 'arco', 'couro', 'malha'],
  ladino: ['fina', 'arco', 'couro'],
  bardo: ['fina', 'magica', 'couro'],
  clerigo: ['marcial', 'magica', 'couro', 'malha', 'placas'],
  druida: ['magica', 'couro'],
  mago: ['magica'],
  feiticeiro: ['magica'],
  monge: [],
};

const ARMA_NUA = { nome: 'Punhos', dado: 'd6', a: 'forca' };

// Melhorias que o ferreiro ou o mercador secreto fazem. Cada objeto leva duas, no máximo.
const MELHORIAS = {
  arma: [
    { id: 'flamejante', nome: 'Flamejante', glyph: 'flame', preco: 14, dano: 2, desc: 'Flamejante: +2 de dano em cada golpe.' },
    { id: 'implacavel', nome: 'Implacável', glyph: 'star', preco: 12, acerto: 2, desc: 'Implacável: +2 para acertar.' },
    { id: 'voraz', nome: 'Voraz', glyph: 'drop', preco: 16, sede: 1, desc: 'Voraz: recupera 1 de Vida em cada golpe que acerta.' },
  ],
  armadura: [
    { id: 'resistente', nome: 'Resistente', glyph: 'shield', preco: 12, ca: 1, desc: 'Resistente: +1 CA.' },
    { id: 'vital', nome: 'Vital', glyph: 'heart', preco: 10, vidaMax: 3, desc: 'Vital: +3 Vida máxima.' },
  ],
  acessorio: [
    { id: 'brilhante', nome: 'Brilhante', glyph: 'sun', preco: 18, tudo: 1, desc: 'Brilhante: +1 em todos os testes.' },
    { id: 'vital', nome: 'Vital', glyph: 'heart', preco: 10, vidaMax: 3, desc: 'Vital: +3 Vida máxima.' },
  ],
};
const MELHORIAS_MAX = 2;
const DESCONTO_SECRETO = .7;

// Combate: à vez. O seu d20 contra a CA dele, e o d20 dele contra a sua CA.
// CA do herói: base + metade da Agilidade + armadura. Ataque do inimigo: CA dele - ataqueMenos.
const COMBATE = { escalaPv: 1, caBase: 10, ataqueMenos: 10, danoMenos: 0, xpVitoria: 3, vilao: { ca: 12, ataque: 3, dado: 'd8', pv: 22, folego: .5,
  // Nunca perde mais do que esta parte dos PV numa só ronda, e traz um guarda por cada aliado seu.
  tetoRonda: .4, guarda: { pv: 7, ca: 11, ataque: 2, dado: 'd6' }, guardasMax: 3 } };
// O jeito de lutar de cada inimigo comum. Sai do nome dele: o primeiro jeito cuja busca servir é o que conta
// (uma opção de combate pode escolher outro com roll.jeito). Quem não servir em nenhum luta sem truques.
const JEITOS = {
  fera: { nome: 'Fera', curto: 'recua ao acertar', d: 'ataca e recua: depois de acertar, tem CA +2 até à vez seguinte dele', busca: /lob|pantera|urso|javali|fera/i },
  bruto: { nome: 'Bruto', curto: 'golpe a dobrar', d: 'prepara o golpe uma ronda antes, e esse golpe fere a dobrar', busca: /ogro|brutamontes|krusk|grumm|gigante|troll/i },
  morto: { nome: 'Morto-vivo', curto: 'levanta-se uma vez', d: 'a primeira vez que cai, levanta-se com um quarto dos PV', busca: /mort|esquelet|cripta|demónio/i },
  bruxa: { nome: 'Feitiço', curto: 'amaldiçoa', d: 'ronda sim, ronda não, amaldiçoa em vez de atacar: -2 Vida e -2 no seu próximo teste', busca: /velha|bruxa|feiticeir|profet/i },
  ladrao: { nome: 'Ladrão', curto: 'rouba Ouro', d: 'quando acerta, rouba 2 de Ouro', busca: /goblin|bandid|capanga|ladr|cicatriz/i },
  duelista: { nome: 'Duelista', curto: 'castiga as falhas', d: 'quando o seu ataque falha, responde logo com um golpe rápido (-2 no ataque)', busca: /simony|desertor|duel|espadachim/i },
  soldado: { nome: 'Soldado', curto: 'apara o 1.º golpe', d: 'escudo erguido: o primeiro golpe seu que acertar tira só metade', busca: /soldad|patrulha|vigia|guarda|imperia/i },
  bando: { nome: 'Bando', curto: 'ataca duas vezes', d: 'são muitos: atacam duas vezes por ronda até perderem metade dos PV', busca: /^(os|as) /i },
};

// O mundo aperta a cada etapa da história, não a cada nível do herói: assim, subir de nível sente-se.
// Por etapa (0 a 3, a última é a do chefe): PV a mais nos inimigos, e +1 nos testes, na CA, no ataque e no dano.
const SUBIDA = { pvPorEtapa: [0, .15, .3], maisPorEtapa: [0, 0, 1], cenaDaEtapa: 1 }; // um degrau por etapa: 1, 2 (a Reviravolta) e o destino

// A Vida é o outro relógio do jogo: poupar tempo gasta Vida, e recuperar Vida gasta tempo.
const VIDA = { falha: 1.5, marcha: 2, acampar: .35, emboscadaAcampar: 20 };

// Cartas de combate de cada classe. Em cada ronda saem duas ao acaso, e cada uma só serve uma vez por combate.
// a: atributo do teste (sem "a" resulta sempre); dado: dano ao acertar; custo: Vida que paga para a usar;
// cura: Vida recuperada; escudo: anula o próximo golpe; enfraquece: baixa a Defesa do inimigo;
// fuga: sai do combate sem recompensa; vence: termina o combate como vitória.
const MANOBRAS = {
  mago: [
    { id: 'fogo', t: 'Bola de Fogo', d: 'O fogo não distingue. Também o queima a si.', magia: true, a: 'mente', dado: 'd12', custo: 2, glyph: 'flame' },
    { id: 'raio', t: 'Raio Arcano', d: 'Um risco de luz, direto ao peito.', magia: true, a: 'mente', dado: 'd8', glyph: 'star' },
    { id: 'invis', t: 'Invisibilidade', d: 'Deixa de estar ali. Sai do combate sem recompensa.', magia: true, a: 'mente', fuga: true, facil: 3, glyph: 'eye' },
    { id: 'escudo', t: 'Escudo Arcano', d: 'O próximo golpe dele não lhe acerta.', magia: true, escudo: true, glyph: 'shield' },
  ],
  clerigo: [
    { id: 'chama', t: 'Chama Sagrada', d: 'A luz queima o que não devia estar de pé.', magia: true, a: 'mente', dado: 'd8', glyph: 'sun' },
    { id: 'curar', t: 'Curar Feridas', d: 'A carne fecha-se debaixo da mão.', magia: true, cura: 5, glyph: 'drop' },
    { id: 'fe', t: 'Escudo da Fé', d: 'O próximo golpe dele não lhe acerta.', magia: true, escudo: true, glyph: 'shield' },
    { id: 'palavra', t: 'Palavra Sagrada', d: 'Uma ordem, em voz baixa. Baixa-lhe a Defesa em 3.', magia: true, a: 'carisma', enfraquece: 3, glyph: 'speech' },
  ],
  bardo: [
    { id: 'cortante', t: 'Palavra Cortante', d: 'Há versos que ferem de verdade.', magia: true, a: 'carisma', dado: 'd8', glyph: 'note' },
    { id: 'embalar', t: 'Canção de Embalar', d: 'Se resultar, adormece-o e vence o combate.', magia: true, a: 'carisma', vence: true, dificil: 4, glyph: 'moon' },
    { id: 'provocar', t: 'Provocação', d: 'Tira-o do sério. Baixa-lhe a Defesa em 3.', magia: true, a: 'carisma', enfraquece: 3, glyph: 'speech' },
    { id: 'alento', t: 'Canção de Alento', d: 'Uma estrofe, e as forças voltam.', magia: true, cura: 4, glyph: 'drop' },
  ],
  ladino: [
    { id: 'costas', t: 'Golpe pelas Costas', d: 'Mais difícil de acertar, mas não perdoa.', a: 'agilidade', dado: 'd12', dificil: 2, glyph: 'dagger' },
    { id: 'fumo', t: 'Bomba de Fumo', d: 'Sai do combate sem recompensa. Mais fácil do que fugir a correr.', a: 'agilidade', facil: 3, fuga: true, glyph: 'flame' },
    { id: 'sujo', t: 'Truque Sujo', d: 'Areia nos olhos. Baixa-lhe a Defesa em 3.', a: 'agilidade', enfraquece: 3, glyph: 'lock' },
    { id: 'veneno', t: 'Lâmina Envenenada', d: 'Pequeno corte, grande problema.', a: 'agilidade', dado: 'd10', custo: 1, glyph: 'drop' },
  ],
  barbaro: [
    { id: 'selvagem', t: 'Golpe Selvagem', d: 'Com tudo o que tem. Abre-lhe as próprias feridas.', a: 'forca', dado: 'd12', custo: 2, glyph: 'axe' },
    { id: 'rugido', t: 'Rugido', d: 'Ele hesita. Baixa-lhe a Defesa em 3.', a: 'forca', enfraquece: 3, glyph: 'speech' },
    { id: 'folego', t: 'Segundo Fôlego', d: 'Ainda não é hoje.', cura: 5, glyph: 'drop' },
    { id: 'investida', t: 'Investida', d: 'Mais difícil de acertar, mas derruba.', a: 'forca', dado: 'd10', dificil: 2, glyph: 'hammer' },
    { id: 'furia', t: 'Fúria', d: 'Gasta a vez. Até ao fim do combate: +3 Força, um ataque a mais por ronda, -2 CA, e já não foge.', furia: true, glyph: 'flame' },
  ],
  patrulheiro: [
    { id: 'duplo', t: 'Tiro Duplo', d: 'Duas setas, um único gesto.', a: 'agilidade', dado: 'd10', dificil: 1, glyph: 'bow' },
    { id: 'armadilha', t: 'Armadilha', d: 'Já a tinha preparado. Baixa-lhe a Defesa em 3.', a: 'mente', enfraquece: 3, glyph: 'sign' },
    { id: 'camuflar', t: 'Camuflagem', d: 'Funde-se com o terreno. Sai do combate sem recompensa.', a: 'agilidade', fuga: true, facil: 3, glyph: 'leaf' },
    { id: 'ervas', t: 'Ervas do Caminho', d: 'Mastigar e aguentar.', cura: 4, glyph: 'leaf' },
  ],
};

// Fora de combate, cada classe pode ver surgir uma destas opções numa cena qualquer.
const TATICAS = {
  mago: [
    { t: 'Invisibilidade', d: 'Passar sem que ninguém o veja. Sai caro à cabeça.', tipo: 'magia', glyph: 'eye', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Deixa de estar ali, e passa por entre eles a prender a respiração.', fx: { xp: 2 } }, ko: { txt: 'A magia falha a meio do passo, e alguém repara em si.', fx: { vida: -3 } } },
    { t: 'Ler Pensamentos', d: 'Ouvir o que ninguém disse.', tipo: 'magia', glyph: 'star', roll: { a: 'mente', dc: 12 }, ok: { txt: 'Sabe quem mente, e quem paga. Pagam-lhe também a si, para não dizer.', fx: { ouro: 6, xp: 2 } }, ko: { txt: 'Há uma coisa à escuta do outro lado. A dor de cabeça dura o dia todo.', fx: { vida: -3 } } },
  ],
  clerigo: [
    { t: 'Bênção do Caminho', d: 'Pedir força para seguir.', tipo: 'magia', glyph: 'sun', roll: { a: 'carisma', dc: 10 }, ok: { txt: 'Um calor sobe-lhe pelo peito, e o cansaço fica para trás.', fx: { vida: 4, xp: 1 } }, ko: { txt: 'Ninguém respondeu, hoje.', fx: {} } },
    { t: 'Afastar o Mal', d: 'Erguer o símbolo e não ceder um passo.', tipo: 'magia', glyph: 'seal', roll: { a: 'mente', dc: 11 }, ok: { txt: 'O que estava à sua frente recua sem perceber porquê.', fx: { xp: 3 } }, ko: { txt: 'Não recuou, e sabe bem o que você tentou.', fx: { vida: -3 } } },
  ],
  bardo: [
    { t: 'Encantar', d: 'Um sorriso e meia dúzia de palavras certas.', tipo: 'magia', glyph: 'note', roll: { a: 'carisma', dc: 11 }, ok: { txt: 'Dentro de minutos, querem pagar-lhe uma bebida, e pagam.', fx: { ouro: 5, xp: 2 } }, ko: { txt: 'Perceberam o truque, e ninguém gosta de ser feito de parvo.', fx: { vida: -2, ouro: -1 } } },
  ],
  ladino: [
    { t: 'Aliviar a Bolsa', d: 'Enquanto todos olham para o outro lado.', tipo: 'tecnica', glyph: 'lock', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Sai dali mais leve de consciência, e mais pesado de ouro.', fx: { ouro: 6, xp: 1 } }, ko: { txt: 'Uma mão fecha-se no seu pulso, e a outra no seu nariz.', fx: { vida: -3 } } },
  ],
  barbaro: [
    { t: 'Só Passar', d: 'Andar em frente, e quem estiver lá que se desvie.', tipo: 'tecnica', glyph: 'axe', roll: { a: 'forca', dc: 11 }, ok: { txt: 'Há quem se desvie. Quem não se desviou também já não está no caminho.', fx: { xp: 3 } }, ko: { txt: 'Às vezes, o que está à frente é mais duro do que parece.', fx: { vida: -4 } } },
  ],
  patrulheiro: [
    { t: 'Ler o Terreno', d: 'Antes de dar um passo, ver onde os outros pisaram.', tipo: 'tecnica', glyph: 'leaf', roll: { a: 'mente', dc: 10 }, ok: { txt: 'Encontra um trilho que poupa as pernas, e um esconderijo que alguém esqueceu.', fx: { ouro: 4, xp: 2 } }, ko: { txt: 'Os sinais enganam-no, e os espinhos não.', fx: { vida: -2 } } },
  ],
};

// Encontro raríssimo na estrada: um mestre oferece a evolução da classe.
// attrs, vida e dano somam-se ao herói; manobra junta-se às cartas de combate.
const EVOLUCOES = {
  mago: [
    { id: 'arquimago', nome: 'Arquimago', glyph: 'star', attrs: { mente: 2 }, vida: 2, resumo: '+2 Mente  ·  +2 Vida', desc: 'Já não estuda a magia: ela é que o estuda a si.',
      manobra: { id: 'meteoro', t: 'Chuva de Meteoros', d: 'O céu responde quando chamado. Dano d12+4.', magia: true, a: 'mente', dado: 'd12', mais: 4, custo: 1, glyph: 'flame' } },
    { id: 'invocador', nome: 'Invocador', glyph: 'seal', attrs: { mente: 1 }, vida: 4, resumo: '+1 Mente  ·  +4 Vida', desc: 'Nunca mais luta sozinho, e os outros nunca o veem a lutar.',
      manobra: { id: 'servo', t: 'Invocar Servo', d: 'Algo sai do círculo e agarra-o. Dano d10, e baixa-lhe a Defesa em 3.', magia: true, a: 'mente', dado: 'd10', enfraqueceJunto: 3, glyph: 'seal' } },
  ],
  barbaro: [
    { id: 'berserker', nome: 'Berserker', glyph: 'axe', attrs: { forca: 2 }, dano: 1, resumo: '+2 Força  ·  +1 dano', desc: 'Quando a fúria vem, nem os amigos ficam por perto.',
      manobra: { id: 'carnificina', t: 'Carnificina', d: 'Sem pensar em nada. Dano d12+3, e custa-lhe 2 de Vida.', a: 'forca', dado: 'd12', mais: 3, custo: 2, glyph: 'axe' } },
    { id: 'lobisomem', nome: 'Lobisomem', glyph: 'moon', attrs: { forca: 1, agilidade: 1 }, vida: 4, resumo: '+1 Força  ·  +1 Agilidade  ·  +4 Vida', desc: 'A lua cobra caro, mas a carne fecha-se sozinha.',
      manobra: { id: 'uivo', t: 'Regenerar', d: 'A besta lambe as feridas, e elas fecham.', cura: 8, glyph: 'moon' } },
  ],
  ladino: [
    { id: 'lamina', nome: 'Lâmina Invisível', glyph: 'dagger', attrs: { agilidade: 2 }, dano: 1, resumo: '+2 Agilidade  ·  +1 dano', desc: 'Nunca ninguém viu a sua cara, e os que a viram não contam.',
      manobra: { id: 'sombra_golpe', t: 'Golpe da Sombra', d: 'Sai de onde não estava. Fácil de acertar. Dano d12.', a: 'agilidade', dado: 'd12', facil: 3, glyph: 'dagger' } },
    { id: 'arcano', nome: 'Trapaceiro Arcano', glyph: 'rune', attrs: { agilidade: 1, mente: 1 }, vida: 2, resumo: '+1 Agilidade  ·  +1 Mente  ·  +2 Vida', desc: 'Aprendeu magia para roubar melhor, e rouba magia também.',
      manobra: { id: 'ilusao', t: 'Duplo Ilusório', d: 'Ataca o duplo, e não a si. O próximo golpe dele falha.', magia: true, escudo: true, glyph: 'rune' } },
  ],
  patrulheiro: [
    { id: 'arqueiro', nome: 'Arqueiro Arcano', glyph: 'bow', attrs: { agilidade: 2 }, dano: 1, resumo: '+2 Agilidade  ·  +1 dano', desc: 'As suas setas fazem curvas, e chegam a horas.',
      manobra: { id: 'seta', t: 'Seta Encantada', d: 'Não há onde se esconder. Fácil de acertar. Dano d12.', magia: true, a: 'agilidade', dado: 'd12', facil: 3, glyph: 'bow' } },
    { id: 'feras', nome: 'Mestre das Feras', glyph: 'leaf', attrs: { forca: 1, mente: 1 }, vida: 3, resumo: '+1 Força  ·  +1 Mente  ·  +3 Vida', desc: 'Nunca mais dorme sozinho, e nada se aproxima sem aviso.',
      manobra: { id: 'lobo', t: 'Atacar, Lobo!', d: 'O companheiro salta primeiro. Dano d10+2.', a: 'mente', dado: 'd10', mais: 2, glyph: 'leaf' } },
  ],
  clerigo: [
    { id: 'necromante', nome: 'Necromante', glyph: 'moon', attrs: { mente: 2 }, vida: 1, resumo: '+2 Mente  ·  +1 Vida', desc: 'Os deuses calaram-se. Os mortos, porém, têm muito a dizer.',
      manobra: { id: 'drenar', t: 'Drenar a Vida', d: 'O que lhe tira a ele, fica para si. Dano d10, e recupera 4 de Vida.', magia: true, a: 'mente', dado: 'd10', curaJunto: 4, glyph: 'moon' } },
    { id: 'bispo', nome: 'Bispo', glyph: 'sun', attrs: { carisma: 2 }, vida: 3, resumo: '+2 Carisma  ·  +3 Vida', desc: 'A sua palavra tem peso, e por trás dela há um exército de fiéis.',
      manobra: { id: 'milagre', t: 'Milagre', d: 'Uma prece, e a dor desaparece.', magia: true, cura: 10, glyph: 'sun' } },
  ],
  bardo: [
    { id: 'melodico', nome: 'Trapaceiro Melódico', glyph: 'note', attrs: { carisma: 1, agilidade: 1 }, vida: 2, dano: 1, resumo: '+1 Carisma  ·  +1 Agilidade  ·  +1 dano', desc: 'A melodia distrai, e a mão faz o resto.',
      manobra: { id: 'dissonancia', t: 'Nota Dissonante', d: 'Uma nota errada, de propósito. Dano d12.', magia: true, a: 'carisma', dado: 'd12', glyph: 'note' } },
    { id: 'hipnotizador', nome: 'Hipnotizador Musical', glyph: 'eye', attrs: { carisma: 2 }, vida: 2, resumo: '+2 Carisma  ·  +2 Vida', desc: 'Quem o ouve até ao fim já não se lembra do motivo da luta.',
      manobra: { id: 'transe', t: 'Transe', d: 'Se resultar, ele deixa cair a arma, e o combate acaba.', magia: true, a: 'carisma', vence: true, glyph: 'eye' } },
  ],
};

// Sobe-se de nível ao chegar a estes valores de XP.
const NIVEIS = [0, 9, 21, 36, 54, 75];
// Só os testes ensinam. As cartas especiais, sem teste, ainda dão um pouco.
const XP_GANHO = { sucesso: 3, falha: 1, certeza: 1 };

// Árvore simples: "req" é o talento que tem de vir antes.
const TALENTOS = {
  barbaro: [
    { id: 'furia', nome: 'Sangue Quente', desc: '+2 em testes de Combate.', tipo: { combate: 2 } },
    { id: 'couro', nome: 'Couro Duro', desc: '+4 Vida máxima.', vidaMax: 4 },
    { id: 'brutal', nome: 'Golpe Brutal', req: 'furia', desc: '+2 no dado da arma.', dano: 2 },
    { id: 'sangue', nome: 'Sede de Sangue', req: 'couro', desc: 'Recupera 2 de Vida ao vencer um Combate.', curaCombate: 2 },
  ],
  ladino: [
    { id: 'sombra', nome: 'Passo de Sombra', desc: '+2 em testes de Habilidade.', tipo: { habilidade: 2 } },
    { id: 'maoleve', nome: 'Mão Leve', desc: '+1 Ouro sempre que ganha Ouro.', ouroExtra: 1 },
    { id: 'alerta', nome: 'Sempre Alerta', req: 'sombra', desc: 'Menos 20% de emboscadas: quase sempre os vê primeiro.', alerta: 20 },
    { id: 'sorte', nome: 'Sorte de Ladrão', req: 'maoleve', desc: 'Repete um teste falhado de Habilidade.', repete: 'habilidade' },
  ],
  bardo: [
    { id: 'lingua', nome: 'Língua de Prata', desc: '+2 em testes Sociais.', tipo: { social: 2 } },
    { id: 'publico', nome: 'Boa Plateia', desc: '+1 XP em cada teste.', xpExtra: 1 },
    { id: 'encore', nome: 'Encore', req: 'lingua', desc: 'Repete um teste Social falhado.', repete: 'social' },
    { id: 'balada', nome: 'Balada Heroica', req: 'publico', desc: '+1 Carisma e +1 Força.', attrs: { carisma: 1, forca: 1 } },
  ],
  mago: [
    { id: 'erudicao', nome: 'Erudição', desc: '+2 em Investigação.', tipo: { investigacao: 2 } },
    { id: 'foco', nome: 'Foco Arcano', desc: '+1 Mente.', attrs: { mente: 1 } },
    { id: 'clarividencia', nome: 'Clarividência', req: 'erudicao', desc: 'Repete uma Investigação falhada.', repete: 'investigacao' },
    { id: 'raio', nome: 'Raio Arcano', req: 'foco', desc: 'Usa Mente em vez de Força nos Combates.', combateMente: true },
  ],
  clerigo: [
    { id: 'fe', nome: 'Fé Inabalável', desc: '+3 Vida máxima.', vidaMax: 3 },
    { id: 'prece', nome: 'Prece Serena', desc: '+2 em testes Sociais.', tipo: { social: 2 } },
    { id: 'bencao', nome: 'Bênção', req: 'fe', desc: 'Recupera 1 de Vida em cada cena.', curaCena: 1 },
    { id: 'julgamento', nome: 'Julgamento', req: 'prece', desc: '+3 em testes de Combate.', tipo: { combate: 3 } },
  ],
  patrulheiro: [
    { id: 'rastreador', nome: 'Rastreador', desc: '+2 em Investigação.', tipo: { investigacao: 2 } },
    { id: 'trilho', nome: 'Trilhos Antigos', desc: 'Na estrada, vê primeiro quem lá está, e pode passar à larga.', trilho: true },
    { id: 'tiro', nome: 'Tiro Certeiro', req: 'rastreador', desc: '+2 no dado da arma.', dano: 2 },
    { id: 'sentinela', nome: 'Sentinela', req: 'trilho', desc: 'Menos 20% de emboscadas: quase sempre os vê primeiro.', alerta: 20 },
  ],
  geral: [
    { id: 'robusto', nome: 'Robusto', desc: 'Em combate, cada golpe que leva tira menos 1 de Vida.', aguenta: 1 },
    { id: 'forte', nome: 'Treino de Força', desc: '+1 Força.', attrs: { forca: 1 } },
    { id: 'agil', nome: 'Treino de Agilidade', desc: '+1 Agilidade.', attrs: { agilidade: 1 } },
    { id: 'astuto', nome: 'Estudo Tardio', desc: '+1 Mente.', attrs: { mente: 1 } },
    { id: 'lingua2', nome: 'Boa Conversa', desc: '+1 Carisma.', attrs: { carisma: 1 } },
    { id: 'veterano', nome: 'Veterano', desc: '+1 em todos os testes.', tudo: 1 },
  ],
};

const ALIADOS = {
  mira: { nome: 'Mira das Sombras', desc: 'Ladra de poucas palavras. +1 em Habilidade.', tipo: { habilidade: 1 } },
  bram: { nome: 'Bram, o Ferreiro', desc: 'Parte correntes e costelas. +1 em Combate.', tipo: { combate: 1 } },
  odel: { nome: 'Irmã Odel', desc: 'Sara o que pode. +3 Vida máxima.', vidaMax: 3 },
  tome: { nome: 'Tomé, o Noviço', desc: 'Sabe demasiado para a idade. +1 em Investigação.', tipo: { investigacao: 1 } },
  grumm: { nome: 'Grumm, o Ogro', desc: 'Aprendeu a escrever "passagem". +2 em Combate.', tipo: { combate: 2 } },
  sela: { nome: 'Sela, a Mercadora', desc: 'Conhece toda a gente. +1 em Social.', tipo: { social: 1 } },
  // Os companheiros do Patrulheiro e do Druida. Não se recrutam pelo caminho.
  lobo: { nome: 'Lobo', animal: true, desc: 'Fareja o perigo antes de si. +1 em Habilidade. Morde forte.', tipo: { habilidade: 1 }, ficha: { acao: 'golpe', pv: 7, ca: 12, ataque: 3, dado: 'd6' } },
  urso: { nome: 'Urso', animal: true, desc: 'Ninguém discute com ele. +1 em Combate. Aguenta muito.', tipo: { combate: 1 }, ficha: { acao: 'golpe', pv: 12, ca: 10, ataque: 2, dado: 'd8' } },
  aguia: { nome: 'Águia', animal: true, desc: 'Vê tudo lá de cima. +1 em Investigação. Ataca os olhos: -2 no ataque do inimigo.', tipo: { investigacao: 1 }, ficha: { acao: 'olhos', pv: 6, ca: 14, ataque: 3, dado: 'd6' } },
  cobra: { nome: 'Cobra', animal: true, desc: 'Silenciosa e paciente. +1 em Habilidade. O veneno tira 1 PV por ronda.', tipo: { habilidade: 1 }, ficha: { acao: 'veneno', pv: 6, ca: 13, ataque: 4, dado: 'd6' } },
  aranha: { nome: 'Aranha', animal: true, desc: 'Tece onde ninguém olha. +1 em Habilidade. A teia prende o inimigo: perde a vez, uma vez por combate.', tipo: { habilidade: 1 }, ficha: { acao: 'teia', pv: 6, ca: 13, ataque: 3, dado: 'd6' } },
  corvo: { nome: 'Corvo', animal: true, desc: 'Traz notícias de longe. +2 em Investigação. Distrai: +2 na sua CA.', tipo: { investigacao: 2 }, ficha: { acao: 'guarda', pv: 5, ca: 14, ataque: 2, dado: 'd6' } },
};

// Coordenadas normalizadas sobre o mapa (0–1).
let LUGARES = {};

let ESTRADAS = [];

const TERRENOS = {
  cidade: { nome: 'Cidade', glyph: 'tower', desc: 'Ruas cheias, mercado e ouvidos atentos.' },
  floresta: { nome: 'Floresta', glyph: 'leaf', desc: 'Sombra densa e trilhos que mudam.' },
  estrada: { nome: 'Estrada', glyph: 'sign', desc: 'Caminho aberto, mas nunca vazio.' },
  montanha: { nome: 'Montanha', glyph: 'peak', desc: 'Ar frio e quedas longas.' },
  pantano: { nome: 'Pântano', glyph: 'drop', desc: 'O chão engana, as luzes também.' },
  ruina: { nome: 'Ruínas', glyph: 'rune', desc: 'O passado ainda tem dentes.' },
  costa: { nome: 'Costa', glyph: 'moon', desc: 'A maré não pede licença.' },
};

// Como se desenha o mapa deste mundo. Tudo em frações do tamanho do mapa.
let MAPA = {};

// O relógio da missão, em dias.
const PRAZO_DIAS = 24;
const PISTAS_PRECISAS = 3;
const FRAGMENTOS_POR_PISTA = 3;
const ETAPAS_DA_MISSAO = 3;
// O baralho da aventura guarda uma única carta de classe, de raça e de antecedente.
const UNICA_CHANCE = .22, UNICA_NA_CENA = .7;

// O que cada pista completa ensina sobre o inimigo. Em cada partida saem três, e pesam no combate final.
const FRAQUEZAS = {
  guarda: { nome: 'A Falha na Guarda', desc: 'No combate final, a CA dele desce 3.', ca: 3 },
  ferida: { nome: 'A Ferida Antiga', desc: 'No combate final, ele começa com menos 35% dos PV.', pv: .35 },
  poder: { nome: 'O Poder Exposto', desc: 'No combate final, ele perde o efeito de cada ronda, e só ataca.', semEfeito: true },
  medo: { nome: 'O Medo Dele', desc: 'No combate final, joga primeiro, e ele perde a primeira ronda.', calado: true },
  ritmo: { nome: 'O Ritmo Dele', desc: 'No combate final, o ataque dele desce 3.', ataque: 3 },
};

// Os trunfos: marcas que algumas escolhas deixam (sobretudo na Reviravolta). Cada uma baixa 1 à CA do chefe.
const TRUNFOS = { enganou: 'A pista falsa', traidorvirado: 'O nobre arrependido', ajudado: 'A dívida paga', sangue: 'O nome da família' };

// Cada classe é um arcano do tarô.
const ARCANOS = {
  bardo: '0 · O Louco', mago: 'I · O Mago', druida: 'III · A Imperatriz', clerigo: 'V · O Hierofante', guerreiro: 'VII · O Carro',
  barbaro: 'VIII · A Força', monge: 'XIV · A Temperança', feiticeiro: 'XVI · A Torre', patrulheiro: 'XVII · A Estrela', ladino: 'XVIII · A Lua',
};
// Viajar custa um dia. Metade das vezes há alguém na estrada; os dados rolam escondidos.
const ENCONTRO_CHANCE = .5;
// Num encontro perigoso, a chance de ser apanhado de surpresa (os talentos de alerta descem-na).
const EMBOSCADA_CHANCE = 50;
// Dos encontros, uma parte são contratempos: um atraso, uma ponte caída, uma noite na cela.
const ATRASO_NA_ESTRADA = .25;
const ATRASO_CHANCE = .15;
// O ferreiro fica de fora por agora; o código das melhorias continua, para voltar um dia.
const FERREIRO = false;

// O d20 de quem chega a uma classe aprimorada: fundo perolado e números acesos.
const D20_TEMAS = {
  fogo: { frase: 'Os números ardem em fogo.', perola: ['#3a0d05', '#8a2408', '#c9571a', '#2a0a08'], veia: '#ffb03a', brilho: '#ff7a1a', nucleo: '#fff0b0', halo: '255,130,40', metal: .25, pulso: 'fogo' },
  gelo: { frase: 'Os números acendem-se em gelo.', perola: ['#cfe8f5', '#8fc3de', '#eaf6ff', '#6ea4c8'], veia: '#ffffff', brilho: '#1e9cf0', nucleo: '#eafaff', halo: '130,210,255', metal: .1, pulso: 'lento' },
  raio: { frase: 'Os números estalam em eletricidade.', perola: ['#1a1f52', '#2c3aa0', '#7f8fe8', '#101338'], veia: '#bcd0ff', brilho: '#6fb4ff', nucleo: '#ffffff', halo: '140,190,255', metal: .35, pulso: 'raio' },
  metal: { frase: 'Os números correm em metal derretido.', perola: ['#8a8f96', '#c8ccd2', '#5c6168', '#e6e8ec'], veia: '#2a2d31', brilho: '#ff8a2a', nucleo: '#fff0d0', halo: '255,180,110', metal: .95, pulso: 'lento' },
  lua: { frase: 'Os números brilham em prata de lua.', perola: ['#d9d6e6', '#b4b1cc', '#f2f0fa', '#8e8bb0'], veia: '#6a6790', brilho: '#7f9cff', nucleo: '#f4f6ff', halo: '190,205,255', metal: .6, pulso: 'lento' },
  sombra: { frase: 'Os números acendem-se na sombra.', perola: ['#17141c', '#2a2433', '#0c0a10', '#3d3450'], veia: '#6a5a88', brilho: '#a66bff', nucleo: '#f0e4ff', halo: '160,110,255', metal: .5, pulso: 'lento' },
  arcano: { frase: 'Os números giram em luz arcana.', perola: ['#3a1a6e', '#6a33b8', '#2a8fa8', '#1c0f40'], veia: '#8ff0ff', brilho: '#c86bff', nucleo: '#ffffff', halo: '190,120,255', metal: .3, pulso: 'lento' },
  veneno: { frase: 'Os números crescem em seiva viva.', perola: ['#12301c', '#2c6a38', '#89b84a', '#0c2014'], veia: '#d6ff7a', brilho: '#7aff5a', nucleo: '#f4ffd0', halo: '130,255,110', metal: .15, pulso: 'lento' },
  espectro: { frase: 'Os números ardem em fogo-fátuo.', perola: ['#0c1a18', '#1c3a34', '#3f7a6a', '#08100f'], veia: '#9fffe0', brilho: '#4dffc0', nucleo: '#e8fff6', halo: '90,255,200', metal: .2, pulso: 'lento' },
  ouro: { frase: 'Os números resplandecem em ouro.', perola: ['#b8892a', '#e8c866', '#fff1b8', '#8a6414'], veia: '#fff7d0', brilho: '#ff9d1a', nucleo: '#fffbe0', halo: '255,215,120', metal: .9, pulso: 'lento' },
  som: { frase: 'Os números vibram como uma corda.', perola: ['#6e2a52', '#c0527f', '#f0b070', '#3c1530'], veia: '#ffd9a8', brilho: '#ff8ac0', nucleo: '#fff0f6', halo: '255,150,200', metal: .3, pulso: 'lento' },
  transe: { frase: 'Os números ondulam, e custa desviar os olhos.', perola: ['#45106a', '#b01a8c', '#1a8cb0', '#d8b0ff'], veia: '#ffffff', brilho: '#ff5ae0', nucleo: '#ffffff', halo: '255,100,230', metal: .25, pulso: 'lento' },
  dragao: { frase: 'Os números ardem em sangue de dragão.', perola: ['#5a1010', '#b8861e', '#2a0808', '#e0a030'], veia: '#ffd24a', brilho: '#ff9a1a', nucleo: '#fff4b0', halo: '255,170,60', metal: .7, pulso: 'fogo' },
};
const D20_DA_EVOLUCAO = {
  arquimago: 'raio', invocador: 'sombra', berserker: 'fogo', lobisomem: 'lua', lamina: 'metal', arcano: 'arcano',
  arqueiro: 'gelo', feras: 'veneno', necromante: 'espectro', bispo: 'ouro', melodico: 'som', hipnotizador: 'transe',
};
