// Catálogo de regras: atributos, tipos de carta, classes, objetos, talentos, aliados e lugares.
// A história (cenas, tramas e textos de contexto) está em historia.js.

const ATTR = {
  forca: { nome: 'Força', glyph: 'hammer' },
  agilidade: { nome: 'Agilidade', glyph: 'feather' },
  mente: { nome: 'Mente', glyph: 'eye' },
  carisma: { nome: 'Carisma', glyph: 'speech' },
};

const TIPOS = {
  combate: { nome: 'Combate', glyph: 'sword' },
  social: { nome: 'Social', glyph: 'speech' },
  habilidade: { nome: 'Habilidade', glyph: 'feather' },
  investigacao: { nome: 'Investigação', glyph: 'eye' },
};

const CLASSES = {
  barbaro: { nome: 'Bárbaro', glyph: 'axe', vida: 16, attrs: { forca: 3, agilidade: 1 }, desc: 'Resolve portas, grilhões e discussões da mesma maneira: com força.' },
  ladino: { nome: 'Ladino', glyph: 'dagger', vida: 11, attrs: { agilidade: 3, mente: 1 }, desc: 'Vê a armadilha antes de a pisar e a saída antes de precisar dela.' },
  bardo: { nome: 'Bardo', glyph: 'note', vida: 11, attrs: { carisma: 3, agilidade: 1 }, desc: 'Convence um inimigo de que nunca houve motivo para lutar.' },
  mago: { nome: 'Mago', glyph: 'star', vida: 10, attrs: { mente: 3, carisma: 1 }, desc: 'Lê as runas que os outros tomam por riscos na pedra.' },
  clerigo: { nome: 'Clérigo', glyph: 'sun', vida: 13, attrs: { mente: 2, carisma: 2 }, desc: 'Sara feridas e manda de volta o que devia continuar morto.' },
  patrulheiro: { nome: 'Patrulheiro', glyph: 'bow', vida: 13, attrs: { agilidade: 2, forca: 2 }, desc: 'Lê a terra como quem lê um livro aberto.' },
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
  tiefling: { nome: 'Tiefling', glyph: 'flame', attrs: { carisma: 1, mente: 1 }, desc: 'Sangue antigo, olhar incómodo. +1 Carisma, +1 Mente.' },
};

// slot: arma, armadura, acessorio ou mochila. Só cabe um objeto por slot do corpo.
// O que se larga converte-se em 1/4 do preço.
const ITENS = {
  adaga: { nome: 'Adaga Curva', slot: 'arma', preco: 8, dado: 'd6', attrs: { agilidade: 1 }, glyph: 'dagger', desc: 'Rápida e fácil de esconder. Dado d6, +1 Agilidade.' },
  cajado: { nome: 'Cajado de Freixo', slot: 'arma', preco: 8, dado: 'd6', attrs: { mente: 1 }, glyph: 'star', desc: 'Apoio para o corpo e para o pensamento. Dado d6, +1 Mente.' },
  espada: { nome: 'Espada de Família', slot: 'arma', preco: 12, dado: 'd8', glyph: 'sword', desc: 'Velha, mas de confiança. Dado d8.' },
  rapieira: { nome: 'Rapieira de Duelo', slot: 'arma', preco: 16, dado: 'd8', attrs: { carisma: 1 }, glyph: 'sword', desc: 'Ganha discussões antes de sair da bainha. Dado d8, +1 Carisma.' },
  arco: { nome: 'Arco de Teixo', slot: 'arma', preco: 16, dado: 'd8', attrs: { agilidade: 1 }, glyph: 'bow', desc: 'Resolve os problemas à distância. Dado d8, +1 Agilidade.' },
  machado: { nome: 'Machado de Guerra', slot: 'arma', preco: 18, dado: 'd10', glyph: 'axe', desc: 'Pesado e pouco diplomático. Dado d10.' },
  montante: { nome: 'Montante', slot: 'arma', preco: 26, dado: 'd12', attrs: { agilidade: -1 }, glyph: 'sword', desc: 'Quase da sua altura. Dado d12, -1 Agilidade.' },
  gibao: { nome: 'Gibão de Couro', slot: 'armadura', preco: 8, vidaMax: 3, glyph: 'shield', desc: 'Protege o suficiente. +3 Vida máxima.' },
  cota: { nome: 'Cota de Malha', slot: 'armadura', preco: 18, vidaMax: 6, attrs: { agilidade: -1 }, glyph: 'shield', desc: 'Pesa, mas segura. +6 Vida máxima, -1 Agilidade.' },
  capa: { nome: 'Capa Cinzenta', slot: 'armadura', preco: 12, attrs: { agilidade: 1 }, glyph: 'feather', desc: 'Confunde-se com a noite. +1 Agilidade.' },
  manto: { nome: 'Manto do Escriba', slot: 'armadura', preco: 12, attrs: { mente: 1 }, glyph: 'scroll', desc: 'Bolsos para tudo e cheiro a tinta. +1 Mente.' },
  amuleto: { nome: 'Amuleto de Prata', slot: 'acessorio', preco: 10, glyph: 'seal', desc: 'Os mortos-vivos hesitam diante dele.' },
  anel: { nome: 'Anel de Sinete', slot: 'acessorio', preco: 12, attrs: { carisma: 1 }, glyph: 'crown', desc: 'Abre portas e calou muita gente. +1 Carisma.' },
  diario: { nome: 'Diário Cifrado', slot: 'acessorio', preco: 12, attrs: { mente: 1 }, glyph: 'eye', desc: 'As notas de um sábio desaparecido. +1 Mente.' },
  bracal: { nome: 'Braçal de Ferro', slot: 'acessorio', preco: 12, attrs: { forca: 1 }, glyph: 'hammer', desc: 'Dá peso a cada golpe. +1 Força.' },
  pocao: { nome: 'Poção de Cura', slot: 'mochila', preco: 7, uso: { vida: 7 }, glyph: 'drop', desc: 'Use no painel para recuperar 7 de Vida. Salva-o sozinha se a Vida chegar a 0.' },
  corda: { nome: 'Corda e Gancho', slot: 'mochila', preco: 5, glyph: 'sign', desc: 'Abre caminhos onde não há caminho.' },
  lanterna: { nome: 'Lanterna Furta-Fogo', slot: 'mochila', preco: 5, glyph: 'flame', desc: 'Luz que só aponta para onde você quer.' },
};
const MOCHILA_MAX = 3;
const ARMA_NUA = { nome: 'Punhos', dado: 'd6' };

// Sobe-se de nível ao chegar a estes valores de XP.
const NIVEIS = [0, 6, 14, 24, 36, 50];
const XP_GANHO = { sucesso: 3, falha: 1, certeza: 2 };

// Árvore simples: "req" é o talento que tem de vir antes.
const TALENTOS = {
  barbaro: [
    { id: 'furia', nome: 'Fúria', desc: '+2 em testes de Combate.', tipo: { combate: 2 } },
    { id: 'couro', nome: 'Couro Duro', desc: '+4 Vida máxima.', vidaMax: 4 },
    { id: 'brutal', nome: 'Golpe Brutal', req: 'furia', desc: '+2 no dado da arma.', dano: 2 },
    { id: 'sangue', nome: 'Sede de Sangue', req: 'couro', desc: 'Recupera 2 de Vida ao vencer um Combate.', curaCombate: 2 },
  ],
  ladino: [
    { id: 'sombra', nome: 'Passo de Sombra', desc: '+2 em testes de Habilidade.', tipo: { habilidade: 2 } },
    { id: 'maoleve', nome: 'Mão Leve', desc: '+1 Ouro sempre que ganha Ouro.', ouroExtra: 1 },
    { id: 'alerta', nome: 'Sempre Alerta', req: 'sombra', desc: 'Menos 20% de encontros surpresa contra si.', alerta: 20 },
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
    { id: 'trilho', nome: 'Trilhos Antigos', desc: 'Viajar sorrateiro só custa 1 dia.', trilho: true },
    { id: 'tiro', nome: 'Tiro Certeiro', req: 'rastreador', desc: '+2 no dado da arma.', dano: 2 },
    { id: 'sentinela', nome: 'Sentinela', req: 'trilho', desc: 'Menos 20% de encontros surpresa contra si.', alerta: 20 },
  ],
  geral: [
    { id: 'robusto', nome: 'Robusto', desc: '+3 Vida máxima.', vidaMax: 3 },
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
};

// Coordenadas normalizadas sobre o mapa (0–1).
const LUGARES = {
  porto: { nome: 'Porto Salgado', x: 0.13, y: 0.72, terreno: 'cidade', cidade: true, desc: 'Cheiro a sal e dívidas. Começa na costa do sudoeste.' },
  vale: { nome: 'Vale Cinza', x: 0.17, y: 0.30, terreno: 'cidade', cidade: true, desc: 'Moinhos parados e gente de poucas falas. Começa no noroeste.' },
  lumiar: { nome: 'Lumiar', x: 0.47, y: 0.86, terreno: 'cidade', cidade: true, desc: 'Os sinos tocam sem razão há três noites. Começa no sul.' },
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

const TERRENOS = {
  cidade: { nome: 'Cidade', glyph: 'tower', desc: 'Ruas cheias, mercado e ouvidos atentos.' },
  floresta: { nome: 'Floresta', glyph: 'leaf', desc: 'Sombra densa e trilhos que mudam.' },
  estrada: { nome: 'Estrada', glyph: 'sign', desc: 'Caminho aberto, mas nunca vazio.' },
  montanha: { nome: 'Montanha', glyph: 'peak', desc: 'Ar frio e quedas longas.' },
  pantano: { nome: 'Pântano', glyph: 'drop', desc: 'O chão engana, as luzes também.' },
  ruina: { nome: 'Ruínas', glyph: 'rune', desc: 'O passado ainda tem dentes.' },
  costa: { nome: 'Costa', glyph: 'moon', desc: 'A maré não pede licença.' },
};

// O relógio da missão, em dias.
const PRAZO_DIAS = 12;
const PISTAS_PRECISAS = 3;
const SURPRESA_CHANCE = 30;
