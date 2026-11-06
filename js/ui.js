// Liga a partida à mesa 3D e ao painel lateral.

const $ = id => document.getElementById(id);
let world;

const SLOT_SCALE = .56;
let cartaSelada = null, costasSelada = null;
// A face da carta selada: quem espera no fim, e porquê.
function especSelada() {
  const t = G.trama, v = VILOES[t.vilao], rev = REVIRAVOLTAS[t.reviravolta];
  return { tema: 'destino', etiqueta: 'A Verdade', titulo: fmt('{vilao}').replace(/^./, m => m.toUpperCase()), glyph: v.glyph, arte: `retratos/${t.vilao}`, desc: fmt(`${t.motivo} ${rev.nome}: ${rev.resumo}`) };
}
let cartaMissao = null;
let paginaAtual = {};
let mapaDestaque = [];
let mapaChave = '';
// As cartas que estão à espera de escolha, para se voltarem a arrumar se a janela mudar.
let maoAtual = null;
let xpVisto = null;
let emDestaque = false;
let guiaPendente = false;

// ---------- A explicação da mesa: acende uma zona de cada vez, e diz para que serve ----------
const cantos = ({ x, z, w, h }) => [[x - w / 2, 0, z - h / 2], [x + w / 2, 0, z - h / 2], [x - w / 2, 0, z + h / 2], [x + w / 2, 0, z + h / 2]];
const juntar = ids => ids.map(i => (typeof i === 'string' ? document.querySelector(i) : i)).filter(Boolean).map(e => e.getBoundingClientRect())
  .reduce((a, b) => ({ left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) }));
function zonaEmPixeis() {
  const r = $('view').getBoundingClientRect(), z = zonaDaMao();
  return { left: r.left + (z.esq + 1) / 2 * r.width, right: r.left + (z.dir + 1) / 2 * r.width, top: r.top + (1 - z.topo) / 2 * r.height, bottom: r.top + (1 - z.base) / 2 * r.height };
}
const PASSOS_GUIA = [
  { titulo: 'O seu herói', alvo: () => world.retangulo(cantos(TABULEIRO)),
    texto: 'Tudo o que é e tudo o que leva. Em cima, a classe, a raça e a origem. Ao meio, o que traz vestido e na mão. Em baixo, a mochila. Passe por cima de uma carta para a ler; num ecrã de toque, toque nela.' },
  { titulo: 'Vida e experiência', alvo: () => juntar(['.r-barras']),
    texto: 'O coração vermelho é a Vida: quando chega a zero, a história acaba. A estrela azul é a experiência: quando se completa, sobe de nível e escolhe um talento.' },
  { titulo: 'Ouro e armadura', alvo: () => juntar([$('r-ouro').parentNode, $('r-ca').parentNode]),
    texto: 'O ouro paga mercados, camas e silêncios. O escudo é a sua CA: quem o quiser ferir tem de chegar a esse número no d20.' },
  { titulo: 'Ficha, Mapa e Ajuda', alvo: () => juntar(['.r-tools']),
    texto: 'A Ficha guarda tudo sobre o herói e a missão. O Mapa fecha o livro para ver o caminho, e o Livro volta a abri-lo. A Ajuda tem as regras, e esta explicação outra vez.' },
  { titulo: 'Os dias', alvo: () => juntar(['#trilha']),
    texto: 'Cada dia acende uma marca. A ampulheta é o fim do prazo. Perto dela, os testes ficam mais difíceis; quatro dias depois, a missão perde-se. À direita, as pistas: cada fragmento acende uma barra, e três barras completam o olho.' },
  { titulo: 'Agora', alvo: () => ($('objetivo').classList.contains('on') ? juntar(['#objetivo']) : null),
    texto: 'O próximo passo da missão, e onde espera a próxima pista. Se se perder, olhe para aqui.' },
  { titulo: 'O mapa', alvo: () => world.retangulo(cantos(AREA.map)),
    texto: 'A miniatura é você. A estrela dourada marca a missão. O olho vermelho marca uma pista: ninguém o obriga a segui-la, mas quem a segue chega mais forte ao fim.' },
  { titulo: 'O que a missão guarda', alvo: () => world.retangulo(cantos({ x: CX + 11.2, z: -2.3, w: 5.2, h: 8.4 })),
    texto: 'A carta da missão e, ao lado, o destino selado, que só se abre no fim. Por baixo juntam-se as pistas, os talentos e os aliados.' },
  { titulo: 'O livro', prepara: abrirLivroDoGuia, alvo: () => (ecraVertical() || !world.book.aberto ? null : world.retanguloLivro()),
    texto: 'O livro conta o que acontece em cada cena, e abre-se sozinho quando há história. As palavras a vermelho escondem mais sobre o mundo: toque ou clique nelas.' },
  { titulo: 'As escolhas', prepara: () => mostrarExemplos(EXEMPLOS_GUIA.escolhas), alvo: () => zonaEmPixeis(),
    texto: 'Aqui aparecem as cartas. Cada uma é uma maneira de agir. A barra de baixo diz o atributo usado, o número a tirar no d20 e a hipótese de correr bem; o selo no canto mostra-a em cor, de vermelho (difícil) a verde (fácil). Por cima da barra, o que ganha e o que perde: a moeda é Ouro, a estrela é XP, o coração é Vida.' },
  { titulo: 'Os quatro atributos', prepara: () => tirarExemplos(), alvo: () => null,
    texto: 'Força: golpes pesados, portas e ameaças. Agilidade: armas leves, fugas e passos sem ruído; decide também quem ataca primeiro. Mente: magia, pistas e armadilhas. Carisma: conversa, mentira e música. Quanto maior o número, mais fácil é o teste. Os seus estão na Ficha.' },
  { titulo: 'Cartas que contam mais', prepara: () => mostrarExemplos(EXEMPLOS_GUIA.especiais), alvo: () => zonaEmPixeis(),
    texto: 'As amarelas são raras: correm sempre bem, e só há uma de cada. As que têm um olho vermelho dão um fragmento de pista. As escuras pedem algo que você não tem. Quando a barra diz 2d20, rola dois dados e fica com o melhor.' },
  { titulo: 'A sua tendência', prepara: () => mostrarExemplos(EXEMPLOS_GUIA.tendencia), alvo: () => zonaEmPixeis(),
    texto: 'Algumas cartas trazem uma máscara no fundo. A que sorri puxa para o Bem, a que chora puxa para o Mal, e a de lábios cerrados mexe só na Ordem ou no Caos. A tendência está na Ficha, e no fim decide quem o espera do outro lado.' },
  { titulo: 'É tudo', prepara: () => tirarExemplos(), alvo: () => juntar(['#ajuda']),
    texto: 'O resto descobre-se a jogar. Para rever esta explicação, use o botão Ajuda.' },
];

// As cartas de exemplo do guia: não contam para nada, só mostram como são as cartas a sério.
const EXEMPLOS_GUIA = {
  escolhas: [
    { tema: 'social', etiqueta: 'Social', titulo: 'Convencer o sargento', desc: 'A culpa foi claramente de outro.', glyph: 'speech', ganho: '+6 Ouro', perde: 'Se falhar: -3 Vida', rodape: 'Carisma +3  ·  12+  ·  60%', rodapeGlyph: 'speech', hipotese: .6 },
    { tema: 'combate', etiqueta: 'Combate', titulo: 'Abrir caminho', desc: 'São lobos. Só lobos.', glyph: 'sword', ganho: 'Combate à vez', perde: 'Se fugir: fica sem o prémio', rodape: 'CA 12  ·  9 PV', rodapeGlyph: 'shield' },
    { tema: 'investigacao', etiqueta: 'Investigação', titulo: 'Ler as cinzas', desc: 'Papel queimado ainda se lê, se souber.', glyph: 'eye', ganho: '+2 XP', perde: 'Se falhar: 1 dia', rodape: 'Mente +1  ·  15+  ·  30%', rodapeGlyph: 'eye', hipotese: .3 },
  ],
  especiais: [
    { tema: 'rara', etiqueta: 'Rara', titulo: 'Fúria Bárbara', desc: 'O obstáculo deixa de ser um obstáculo.', glyph: 'axe', ganho: '+4 Ouro', rodape: 'Sucesso garantido', rodapeGlyph: 'star' },
    { tema: 'pista', etiqueta: 'Pista', titulo: 'Seguir as marcas', desc: 'Enquanto as há.', glyph: 'eye', ganho: 'Fragmento de pista', perde: 'Se falhar: 1 dia', rodape: 'Mente +2  ·  13+  ·  50%', rodapeGlyph: 'eye', hipotese: .5, fragmento: true, rasto: true },
    { tema: 'habilidade', etiqueta: 'Habilidade', titulo: 'Nó de Marinheiro', desc: 'Tudo se resolve com o nó certo.', glyph: 'sign', locked: true, lockText: 'Requer Marinheiro' },
  ],
  tendencia: [
    { tema: 'escolha', etiqueta: 'Escolha', titulo: 'Tratar dos feridos', desc: 'Pelor ouve quem se ajoelha na lama.', glyph: 'heart', ganho: '+2 XP', rodape: 'Sem teste', mascara: 'bom' },
    { tema: 'escolha', etiqueta: 'Escolha', titulo: 'Perguntar à força', desc: 'Há quem só responda de joelhos.', glyph: 'fist', ganho: '+4 Ouro', rodape: 'Sem teste', mascara: 'mau' },
    { tema: 'escolha', etiqueta: 'Escolha', titulo: 'Dizer a verdade', desc: 'Não mentir à floresta.', glyph: 'speech', ganho: '+2 XP', rodape: 'Sem teste', mascara: 'neutro' },
  ],
};
let exemplos = [], guiaAbriuLivro = false;
async function mostrarExemplos(specs) {
  await tirarExemplos();
  const alvos = world.fileira(specs.length, zonaDaMao());
  exemplos = specs.map(s => world.createCard(s, { at: AO_BARALHO() }));
  exemplos.forEach((c, i) => { c.zoom = true; window.setTimeout(sfx.card, i * 120); });
  await Promise.all(exemplos.map((c, i) => world.fly(c, alvos[i], .6, { delay: i * .12, arc: 2 })));
}
async function tirarExemplos() {
  const ir = exemplos;
  exemplos = [];
  await Promise.all(ir.map(c => world.fly(c, { pos: AO_BARALHO(), rot: [FACE_DOWN, 0, 0], scale: .6 }, .4, { arc: 1 }).then(() => world.removeCard(c))));
}
async function abrirLivroDoGuia() {
  if (ecraVertical() || world.book.aberto) return;
  await world.book.abrir();
  guiaAbriuLivro = true;
  atualizaBotaoMapa();
}

async function guia() {
  const g = $('guia'), foco = $('guia-foco'), caixa = $('guia-caixa');
  $('tdica').hidden = true;
  const visivel = r => r && r.right - r.left > 4 && r.bottom - r.top > 4 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
  // Os passos que preparam a mesa (abrem o livro, trazem cartas) contam sempre: o alvo só existe depois.
  const passos = PASSOS_GUIA.filter(p => { if (p.prepara) return true; const r = p.alvo(); return r === null || visivel(r); });
  g.classList.add('on');
  for (let i = 0; i < passos.length; i++) {
    const p = passos[i];
    if (p.prepara) await p.prepara();
    const r0 = p.alvo(), r = r0 && visivel(r0) ? r0 : null;
    $('guia-passo').textContent = `${i + 1} de ${passos.length}`;
    $('guia-titulo').textContent = p.titulo;
    $('guia-texto').textContent = p.texto;
    $('guia-seguinte').textContent = i === passos.length - 1 ? 'Jogar' : 'Seguinte';
    $('guia-saltar').hidden = i === passos.length - 1;
    if (r) {
      const m = 6, l = Math.max(2, r.left - m), t = Math.max(2, r.top - m);
      Object.assign(foco.style, { left: `${l}px`, top: `${t}px`, width: `${Math.min(innerWidth - 2, r.right + m) - l}px`, height: `${Math.min(innerHeight - 2, r.bottom + m) - t}px` });
      foco.classList.remove('sem');
    } else foco.classList.add('sem');
    // A caixa fica do lado com mais espaço, para não tapar o que explica.
    const w = caixa.offsetWidth, h = caixa.offsetHeight;
    let cx, cy;
    if (!r) { cx = (innerWidth - w) / 2; cy = (innerHeight - h) / 2; }
    else {
      const espacos = [
        { k: 'dir', v: innerWidth - r.right }, { k: 'esq', v: r.left }, { k: 'baixo', v: innerHeight - r.bottom }, { k: 'cima', v: r.top },
      ].map(e => ({ ...e, v: e.k === 'dir' || e.k === 'esq' ? e.v / w : e.v / h })).sort((a, b) => b.v - a.v);
      const lado = espacos[0].k;
      cx = lado === 'dir' ? r.right + 14 : lado === 'esq' ? r.left - w - 14 : (r.left + r.right - w) / 2;
      cy = lado === 'baixo' ? r.bottom + 14 : lado === 'cima' ? r.top - h - 14 : (r.top + r.bottom - h) / 2;
    }
    caixa.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, cx))}px`;
    caixa.style.top = `${Math.max(8, Math.min(innerHeight - h - 8, cy))}px`;
    const saltou = await new Promise(resolve => {
      $('guia-seguinte').onclick = () => resolve(false);
      $('guia-saltar').onclick = () => resolve(true);
    });
    if (saltou) break;
  }
  g.classList.remove('on');
  await tirarExemplos();
  if (guiaAbriuLivro) { guiaAbriuLivro = false; await world.book.fechar(); atualizaBotaoMapa(); }
}

// ---------- A partida guiada ----------
// O tutorial acompanha a primeira etapa da partida a sério: cada coisa explica-se quando aparece, uma vez,
// numa dica que não bloqueia nada. As escolhas são sempre do jogador. Sair desliga tudo de uma vez.
let tutorial = false;
const dicasVistas = new Set();
const DICAS_TUTORIAL = {
  classe: ['A sua classe', 'Estas cartas são classes. Cada uma diz o que sabe fazer e com quanta Vida começa. Passe o rato (ou toque) para ler de perto, e escolha a que quiser: as outras voltam ao monte.'],
  antecedente: ['De onde vem', 'O antecedente é a vida antes da aventura. Dá atributos, às vezes ouro ou XP, e uma carta rara que só aparece uma vez.'],
  raca: ['O seu povo', 'A raça dá atributos e abre portas que outros não abrem. Também traz a sua carta rara.'],
  arma: ['A arma', 'O dado da arma é o dano de cada golpe. Cada classe só usa as armas do seu tipo.'],
  levar: ['O que levar', 'Armadura, acessórios ou coisas para a mochila. Uma poção salva-o sozinha se a Vida chegar a zero.'],
  partida: ['De onde parte', 'A cidade onde a história começa. Pode ser longe ou perto da missão.'],
  livro: ['O livro', 'O livro conta o que acontece. As palavras a vermelho escondem mais sobre o mundo: clique nelas. Para seguir, use o botão em baixo.'],
  missao: ['A missão', 'Isto é o que tem de fazer. A carta selada guarda um segredo que só se abre no fim. Clique na missão para a iniciar.'],
  cena: ['Uma escolha', 'Cada carta é uma maneira de agir. O selo no canto é a hipótese de correr bem (verde é fácil, vermelho é difícil). Por cima da barra, o que ganha e o que perde. Não há resposta certa: escolha a que quiser.'],
  mascara: ['Uma máscara', 'Esta carta tem uma máscara no fundo: mexe na sua tendência. A que sorri puxa para o Bem, a que chora para o Mal, a de lábios cerrados para a Ordem ou o Caos.'],
  dado: ['O d20', 'O dado mais o atributo tem de chegar ao número da carta. Um 20 é sempre crítico, um 1 é sempre falha. Com 2d20, fica o melhor dos dois.'],
  cidade: ['Na cidade', 'Aqui escolhe o que fazer: seguir viagem, ir ao mercado, descansar (recupera Vida, mas gasta um dia) ou investigar. A estrela dourada no mapa é a missão; o olho vermelho é uma pista.'],
  estrada: ['A viagem', 'Cada estrada custa um dia. Veja os dias na trilha em baixo: a ampulheta é o fim do prazo.'],
  encontro: ['Alguém na estrada', 'Cada estrada custa um dia. Desta vez, a miniatura parou a meio do caminho: há um encontro. Resolva-o, e só depois chega.'],
  combate: ['Combate', 'Joga-se à vez. A carta de ataque mostra a CA dele: é o número a tirar no d20. Os PV de cada um estão no livro. Pode fugir, mas perde o prémio.'],
  mercado: ['O mercado', 'Só aparece o que a sua classe sabe usar. O preço está no rodapé de cada carta.'],
  pista: ['Uma pista', 'Ganhou um fragmento. Com três, a pista fica completa: poupa uma etapa e revela uma fraqueza do inimigo final.'],
  talento: ['Subiu de nível', 'Escolha um talento. Fica seu até ao fim, e aparece por baixo da missão.'],
  fim: ['Agora é consigo', 'Chegou à segunda etapa: já viu o essencial. O resto descobre-se a jogar, e a Ajuda tem as regras todas. Boa viagem!'],
};
function dica(chave) {
  if (!tutorial || dicasVistas.has(chave) || !DICAS_TUTORIAL[chave]) return;
  dicasVistas.add(chave);
  const [titulo, texto] = DICAS_TUTORIAL[chave];
  $('tdica-titulo').textContent = titulo;
  $('tdica-texto').textContent = texto;
  $('tdica').hidden = false;
  if (chave === 'fim') { $('tdica-ok').textContent = 'Jogar sozinho'; $('tdica-ok').onclick = sairTutorial; }
}
function ligarTutorial() {
  tutorial = true;
  dicasVistas.clear();
  $('tdica-ok').textContent = 'Entendi';
  $('tdica-ok').onclick = null;
  guiaPendente = true;
}
// O contorno e o selo aparecem quando a primeira carta (a classe) chega à mesa.
function mostrarTutorial() { if (tutorial) $('tutorial').hidden = false; }
function sairTutorial() {
  tutorial = false;
  guiaPendente = false;
  $('tutorial').hidden = true;
  $('tdica').hidden = true;
  // Se a visita à mesa estiver aberta, fecha-se como se tivesse carregado em Saltar.
  if ($('guia').classList.contains('on')) $('guia-saltar').click();
}

// Só se pergunta uma vez. Quem já sabe, salta.
async function perguntarPrimeiraVez() {
  let visto = false;
  try { visto = !!localStorage.getItem('cardomancer-primeira'); } catch (e) { /* sem memória do navegador, pergunta-se sempre */ }
  if (visto) return;
  $('pergunta').classList.add('on');
  const sim = await new Promise(resolve => {
    $('guia-sim').onclick = () => resolve(true);
    $('guia-nao').onclick = () => resolve(false);
  });
  if (sim) ligarTutorial();
  $('pergunta').classList.remove('on');
  try { localStorage.setItem('cardomancer-primeira', '1'); } catch (e) { /* idem */ }
}
// O que está em cada lugar do tabuleiro, e as cartas de talentos e aliados.
const cartasHeroi = {};
const cartasExtra = {};

const LUGAR_HEROI = { classe: [0, 0], raca: [1, 0], antecedente: [2, 0], arma: [0, 1], armadura: [1, 1], acessorio: [2, 1], m0: [0, 2], m1: [1, 2], m2: [2, 2] };

// À esquerda fica o herói; à direita, a missão, o destino, as pistas e os talentos.
function lugarNoTabuleiro(nome, virada = false) {
  const [col, lin] = LUGAR_HEROI[nome], l = lugarTabuleiro(col, lin);
  return { pos: [l.x, .06, l.z], rot: [virada ? FACE_DOWN : FACE_UP, 0, 0], scale: SLOT_SCALE };
}
// O que a ficha de combate não diz: o bónus nos testes, ou a última frase. Nos animais a última frase repete o ataque.
const extraAliado = id => ((ALIADOS[id].desc.match(/\+\d+ (em|na|de) [^.]+\./) || ALIADOS[id].desc.match(/[^.]+\.\s*$/) || [''])[0]).trim();
const LUGAR_MISSAO = { pos: [CX + 10.4, .05, -4.9], rot: [FACE_UP, 0, -.02], scale: SLOT_SCALE };
const LUGAR_SELADA = { pos: [CX + 12.55, .05, -4.9], rot: [FACE_DOWN, 0, .02], scale: SLOT_SCALE };
const lugarPista = i => ({ pos: [CX + 9.5 + i * 2.15, .05 + i * .002, -2.05], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .02], scale: SLOT_SCALE });
const lugarExtra = (i, n) => ({ pos: [CX + 9.5 + i * Math.min(2.15, 4.3 / Math.max(1, n - 1)), .05 + i * .004, .8], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .02], scale: SLOT_SCALE });
const AO_BARALHO = () => [BARALHO[0], .7, BARALHO[2]];

const COMO_JOGAR = `Passe o rato por cima de uma carta para a ler de perto, e clique para a jogar. Num ecrã de toque, toque na carta para a ler, e toque de novo para a jogar. As cartas da mesa, à esquerda e à direita, também se podem ler assim. Clique numa poção da mochila para a beber: depois de usada, fica virada.

Testes: o d20 mais o atributo tem de chegar ao número indicado na carta. Um 20 é sempre acerto crítico, e um 1 é sempre falha crítica.

Combate: joga-se à vez, e quem tem mais Agilidade começa. O seu d20 tem de chegar à CA dele, e o d20 negro dele tem de chegar à sua CA. Quem acerta rola o dado da arma.

Jeitos de lutar: cada inimigo tem o seu, dito no início do combate e no rodapé da página. A fera recua depois de acertar, o bruto prepara um golpe a dobrar (bom momento para o escudo), o morto-vivo levanta-se uma vez, a bruxa amaldiçoa, o ladrão rouba Ouro, o duelista castiga as falhas, o soldado apara o primeiro golpe e o bando ataca duas vezes.

Chefe final: tem muitos PV e duas ações por ronda, um efeito e um golpe. Os golpes variam: há os que partem a sua guarda, os que lhe cansam o braço, os que acertam sem dado, e há rondas em que ele só se defende. Os inimigos ficam mais duros a cada etapa da história, não a cada nível que sobe: o que ganha a subir fica seu. Nenhuma ronda o derruba de uma vez: perde no máximo 40% dos PV por ronda, e quando aguenta um golpe a página diz quanto dano lhe foi poupado. E traz um guarda por cada aliado seu, que os aliados têm de derrubar antes de lhe chegar.

Viagem: cada estrada custa um dia. Metade das vezes há alguém nela: a miniatura para a meio do caminho, o aviso diz quem é, e só chega depois de resolver o encontro. Se não houver ninguém, chega em segurança. Um perigo começa logo em combate; o inimigo lendário é mais duro, e paga muito melhor. Nos testes, quer-se um número alto: o 11+ da carta é 11 ou mais.

Tempo e Vida: os falhanços gastam Vida, e recuperá-la gasta tempo. Os aliados lutam a seu lado, com CA e PV próprios, que se veem no livro. No combate final, os guardas do chefe recebem os golpes primeiro. O inimigo também os ataca, e quem cai em combate perde-se. Durma numa estalagem, acampe na estrada ou guarde uma poção. A trilha em baixo mostra os dias, e o fim do prazo.

Classes: cada uma tem uma habilidade sua, escrita na carta do draft. O Bárbaro tem a carta Fúria, o Ladino rola dois d20 em Mente e Agilidade fora de combate, o Bardo, o Patrulheiro e o Druida começam acompanhados (os aliados do Bardo somam o nível dele ao dano), e outras somam um atributo à CA ou ao dano.

Equipamento: cada classe só usa as armas e armaduras do seu tipo. O mercado só mostra o que a sua classe sabe usar. Adagas, cajados, capas, mantos e acessórios servem a todos.

Missão: a estrela dourada no mapa e o aviso no canto dizem sempre para onde ir. São três etapas, e mesmo quem falha fica a saber a seguinte. Ganhar combates e ter êxito em testes também lhe dá dicas, que tornam a etapa seguinte mais fácil.

Pistas: são opcionais, mas muito fortes. Siga o olho vermelho no mapa. Lá, as cartas com o olho dão um fragmento se correrem bem, e até um combate pode ter o olho: há quem saiba perguntar com o machado. Se falhar uma carta com o olho, a pista muda de sítio, mas nada se perde. Com três fragmentos, a pista fica completa: poupa-lhe uma etapa e revela uma fraqueza do inimigo, que conta muito no combate final.

Tendência: as escolhas definem quem é. Uma máscara no fundo da carta avisa: a que sorri puxa para o Bem, a que chora para o Mal, a de lábios cerrados para a Ordem ou o Caos. A página do resultado diz para onde pendeu, e a Ficha mostra o nome (Leal Bom, Neutro, Caótico Mau...). Quem servir o Império até ao fim encontra, na última porta, alguém dos Rebeldes.

Vantagem: quando a carta diz 2d20, rola dois dados e fica com o melhor. A corda prepara-o para testes de habilidade, a lanterna para investigação; gastam-se ao usar.

Segunda oportunidade: uma vez por aventura, no início da missão, quem cai a 0 de Vida não morre. Acorda depois do combate, com um terço da Vida, sem ouro, e uns dias mais tarde.

Cartas raras: as amarelas. Só há uma de classe, uma de raça e uma de antecedente em cada aventura. Se não a usar, volta ao baralho.

Estrada: nem todos os encontros são maus. Um mercador secreto vende mais barato e, com muita sorte, um mestre pode mudar a sua classe.

Partida guiada: o botão Partida Guiada, na abertura, joga a primeira etapa consigo. Cada coisa explica-se quando aparece, as escolhas são suas, e pode sair do tutorial a qualquer momento.

Teclas: 1 a 4 escolhem as cartas. C abre a ficha, M mostra o mapa, B bebe uma poção e H abre esta ajuda. Pode mudá-las em Teclas, nas configurações.`;

const iconeCache = {};
function icone(glyph, cor) {
  const k = glyph + cor;
  if (!iconeCache[k]) {
    const [c, x] = canvas(64, 64);
    drawGlyph(x, glyph, 32, 32, 60, cor);
    iconeCache[k] = c.toDataURL();
  }
  return iconeCache[k];
}

function especClasse() {
  const e = evolucao(), c = CLASSES[G.cls];
  return { chave: G.evolucao || G.cls, spec: e
    ? { tema: 'rara', etiqueta: 'Classe Aprimorada', tarot: G.cls, titulo: e.nome, glyph: e.glyph, desc: `${e.desc} ${e.resumo}.` }
    : { tema: 'classe', etiqueta: ARCANOS[G.cls], tarot: G.cls, titulo: c.nome, glyph: c.glyph, desc: c.desc } };
}

function trocarCarta(guardadas, lugar, novo) {
  const velha = guardadas[lugar];
  if (velha && velha.card) {
    world.fly(velha.card, { pos: AO_BARALHO(), rot: [FACE_DOWN, 0, 0], scale: .6 }, .5, { arc: 2 }).then(() => world.removeCard(velha.card));
  }
  delete guardadas[lugar];
  if (!novo) return;
  const card = world.createCard(novo.spec, { at: AO_BARALHO() });
  sfx.card();
  world.fly(card, novo.alvo, .7, { arc: 2 });
  card.inspectable = true; card.zoom = true;
  guardadas[lugar] = { card, chave: novo.chave };
}

// Mantém o tabuleiro igual ao estado do herói.
function sincronizarTabuleiro() {
  const corpo = l => {
    const id = G.equip[l];
    return id ? { chave: `${id}|${(G.melhorias[id] || []).join()}`, spec: especItem(id) } : null;
  };
  const quer = {
    classe: G.cls ? especClasse() : null,
    raca: G.raca ? { chave: G.raca, spec: { tema: 'raca', titulo: RACAS[G.raca].nome, glyph: RACAS[G.raca].glyph, desc: RACAS[G.raca].desc, arte: `racas/${G.raca}` } } : null,
    antecedente: G.bg ? { chave: G.bg, spec: { tema: 'antecedente', titulo: ANTECEDENTES[G.bg].nome, glyph: ANTECEDENTES[G.bg].glyph, desc: ANTECEDENTES[G.bg].desc, arte: `antecedentes/${G.bg}` } } : null,
    arma: corpo('arma'), armadura: corpo('armadura'), acessorio: corpo('acessorio'),
  };
  Object.keys(quer).forEach(l => {
    const tem = cartasHeroi[l], q = quer[l];
    if (tem && tem.adotar) {
      if (q) { tem.chave = q.chave; tem.adotar = false; tem.card.spec = q.spec; }
      return;
    }
    if ((tem && tem.chave) === (q && q.chave)) return;
    trocarCarta(cartasHeroi, l, q && { ...q, alvo: lugarNoTabuleiro(l) });
  });
  sincronizarMochila();
  sincronizarExtras();
}

// Cada objeto fica onde estava. Um objeto usado vira-se no seu lugar, e sai quando faz falta o espaço.
function sincronizarMochila() {
  const lugares = ['m0', 'm1', 'm2'];
  const falta = [...G.mochila], gastos = [...G.gastos];
  const tira = (lista, id) => { const i = lista.indexOf(id); if (i < 0) return false; lista.splice(i, 1); return true; };
  lugares.forEach(l => {
    const tem = cartasHeroi[l];
    if (!tem) return;
    if (tem.gasta) { if (!tira(gastos, tem.id)) trocarCarta(cartasHeroi, l, null); return; }
    if (tira(falta, tem.id)) return;
    if (tira(gastos, tem.id)) {
      tem.gasta = true; tem.card.inspectable = false; tem.card.hoverTarget = 0;
      sfx.card();
      world.fly(tem.card, lugarNoTabuleiro(l, true), .6, { arc: 1.4 });
      return;
    }
    trocarCarta(cartasHeroi, l, null);
  });
  falta.forEach(id => {
    let l = lugares.find(k => !cartasHeroi[k]);
    if (!l) {
      l = lugares.find(k => cartasHeroi[k].gasta);
      if (!l) return;
      tira(G.gastos, cartasHeroi[l].id);
      trocarCarta(cartasHeroi, l, null);
    }
    trocarCarta(cartasHeroi, l, { chave: id, spec: especItem(id), alvo: lugarNoTabuleiro(l) });
    cartasHeroi[l].id = id;
  });
  G.gastos = G.gastos.filter(id => lugares.some(k => cartasHeroi[k] && cartasHeroi[k].gasta && cartasHeroi[k].id === id));
}

function sincronizarExtras() {
  const quer = [
    ...talentosAtivos().map(t => ({ chave: t.id, spec: { tema: 'talento', titulo: t.nome, glyph: t.glyph || 'star', desc: t.desc } })),
    ...G.aliados.map(id => ({ chave: ALIADOS[id].nome, spec: { tema: 'social', etiqueta: 'Aliado', titulo: ALIADOS[id].nome, glyph: 'person', arte: `aliados/${id}`, desc: `${resumoAliado(fichaAliado(id))}. ${extraAliado(id)}` } })),
  ];
  Object.keys(cartasExtra).forEach(k => { if (!quer.some(q => q.chave === k)) trocarCarta(cartasExtra, k, null); });
  quer.forEach((q, i) => {
    const alvo = lugarExtra(i, quer.length);
    if (cartasExtra[q.chave]) world.fly(cartasExtra[q.chave].card, alvo, .3, { arc: 0 });
    else trocarCarta(cartasExtra, q.chave, { ...q, alvo });
  });
}

function refazerMapa() {
  if (!G) return;
  const rasto = G.rastro ? { key: G.rastro, fragmentos: G.fragmentos } : null;
  const suspeitos = G.trama && G.destinoRevelado ? [VILOES[G.trama.vilao].destino] : [];
  const rumo = G.trama ? (G.destinoRevelado ? VILOES[G.trama.vilao].destino : G.rumo) : null;
  const chave = JSON.stringify([G.mundo, G.visitados, mapaDestaque, suspeitos, rasto, rumo]);
  if (chave === mapaChave) return;
  mapaChave = chave;
  world.updateMap(G.visitados, mapaDestaque, suspeitos, rasto, rumo);
}

function desenharTrilha() {
  const total = G.prazo + 4;
  let html = '';
  for (let d = 1; d <= total; d++) {
    const cls = [d < G.dia ? 'passado' : d === G.dia ? 'atual' : '', d > G.prazo ? 'tarde' : ''].join(' ');
    let marca = '', dica = `Dia ${d}`;
    if (d === total) { marca = icone('seal', '#ff6a5c'); dica += ': tarde demais'; }
    else if (d === G.prazo) { marca = icone('hourglass', '#ffd76a'); dica += ': fim do prazo. Depois disto, cada dia custa Vida'; }
    html += `<div class="pip ${cls}" title="${dica}">${marca ? `<img src="${marca}" alt="">` : ''}</div>`;
  }
  $('pips').innerHTML = html;
}

// As pistas na trilha: cada olho tem três barras, uma por fragmento. A que acaba de chegar acende com brilho.
let fragsVistos = null;
function desenharFragmentos() {
  const total = Math.min(PISTAS_PRECISAS * FRAGMENTOS_POR_PISTA, G.pistas * FRAGMENTOS_POR_PISTA + (G.pistas < PISTAS_PRECISAS ? G.fragmentos : 0));
  // Só se redesenha quando muda, para a barra nova acabar de acender.
  if (G.trama && fragsVistos === total && $('frags').childElementCount) return;
  const antes = fragsVistos === null ? total : fragsVistos;
  fragsVistos = G.trama ? total : null;
  let html = '';
  for (let p = 0; p < PISTAS_PRECISAS; p++) {
    const cheia = p < G.pistas, acabou = cheia && antes < (p + 1) * FRAGMENTOS_POR_PISTA;
    let barras = '';
    for (let f = 0; f < FRAGMENTOS_POR_PISTA; f++) {
      const n = p * FRAGMENTOS_POR_PISTA + f;
      barras += `<i class="${n < total ? 'on' : ''} ${n < total && n >= antes ? 'acende' : ''}"></i>`;
    }
    html += `<div class="frag ${cheia ? 'cheia' : ''} ${acabou ? 'acende' : ''}" title="Pista ${p + 1}"><img src="${icone('eye', cheia ? '#ff6a5c' : '#f2e3bd')}" alt="">${barras}</div>`;
  }
  $('frags').innerHTML = html;
  $('frags').title = `Pistas completas: ${G.pistas} de ${PISTAS_PRECISAS}. Fragmentos da pista em curso: ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}.`;
  if (total > antes) sfx.fragmento();
}

// Com o livro fechado o aviso vai para o canto, para não tapar o mapa nem as cartas.
function posicaoAviso() {
  // De pé, a página começa logo abaixo do aviso.
  const p = $('prompt');
  const topoFolha = p.classList.contains('on') ? p.getBoundingClientRect().bottom + 4 : $('rail').getBoundingClientRect().bottom + 4;
  if (ecraPequeno()) {
    // Deitado, a folha ocupa o lado do livro, de cima até ao aviso ou ao "Agora".
    let fundo = innerHeight - 6;
    for (const id of ['prompt', 'objetivo']) if ($(id).classList.contains('on')) fundo = Math.min(fundo, $(id).getBoundingClientRect().top - 6);
    if (fundo < 160) fundo = innerHeight - 30;
    $('folha').style.top = '6px';
    $('folha').style.maxHeight = `${fundo - 6}px`;
  } else {
    $('folha').style.top = `${topoFolha}px`;
    $('folha').style.maxHeight = `${Math.max(120, innerHeight * .55 - topoFolha)}px`;
  }
  $('prompt').classList.toggle('lado', !!G.trama && !world.book.aberto && !emDestaque);
  // Com o livro aberto, o aviso fica por cima do "Agora": à direita tapava a carta selada.
  const noLivro = !!G.trama && world.book.aberto && !emDestaque;
  $('prompt').classList.toggle('livro', noLivro);
  $('prompt').style.bottom = noLivro ? `${innerHeight - $('objetivo').getBoundingClientRect().top + 8}px` : '';
}

// A mão fica por baixo do livro, sem passar por cima dos avisos dos cantos.
function zonaDaMao() {
  const c = $('view').getBoundingClientRect(), emEcra = px => (px - c.left) / c.width * 2 - 1;
  const aberto = world.book.aberto;
  if (ecraVertical()) {
    const emAltura = py => 1 - (py - c.top) / c.height * 2;
    const acima = aberto ? emAltura($('folha').getBoundingClientRect().bottom + 6) : .02;
    const faixa = $('objetivo').classList.contains('on') ? emAltura($('objetivo').getBoundingClientRect().top - 3) : -.97;
    return { topo: acima, base: faixa, esq: -.97, dir: .97, grelha: true };
  }
  if (ecraPequeno()) {
    const emAltura = py => 1 - (py - c.top) / c.height * 2;
    const aviso = $('prompt').classList.contains('on') ? emAltura($('prompt').getBoundingClientRect().bottom + 4) : .96;
    const faixa = $('objetivo').classList.contains('on') ? emAltura($('objetivo').getBoundingClientRect().top - 3) : -.97;
    return { topo: aviso, base: faixa, esq: aberto ? world.livroDireita() + .02 : .56, dir: .98, grelha: true };
  }
  let esq = -.98, dir = .98;
  if ($('objetivo').classList.contains('on')) esq = emEcra($('objetivo').getBoundingClientRect().right + 8);
  if (!aberto && $('prompt').classList.contains('on') && $('prompt').classList.contains('lado')) dir = emEcra($('prompt').getBoundingClientRect().left - 8);
  return { topo: aberto ? -.19 : -.3, base: -.985, esq, dir };
}

// No telemóvel, ganha a altura das barras do navegador e fica deitado, onde o sistema o permitir.
function pedirEcraInteiro() {
  if (!eTelemovel()) return;
  const raiz = document.documentElement;
  try {
    if (raiz.requestFullscreen) raiz.requestFullscreen().then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape')).catch(() => {});
  } catch (e) { /* há sistemas que não deixam, e o aviso de virar chega */ }
}

// De pé, o livro 3D seria pequeno demais: a página aparece como texto.
const escapar = t => String(t).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function desenharFolha(p) {
  let texto = escapar(p.texto || '');
  termosDe(p.texto || '').sort((a, b) => b.nome.length - a.nome.length).forEach(t => {
    texto = texto.split(escapar(t.nome)).join(`<a data-lore="${t.id}">${escapar(t.nome)}</a>`);
  });
  const c = p.combate;
  const barra = (rot, v, max, cor) => `<div class="f-barra"><span>${rot}</span><b>${v}/${max}</b><i><em style="width:${Math.max(0, v) / Math.max(1, max) * 100}%;background:${cor}"></em></i></div>`;
  $('folha').innerHTML = `<small class="f-cap">${escapar(p.capitulo || '')}</small><h2>${escapar(p.titulo || '')}</h2>`
    + (p.banner ? `<div class="f-banner ${p.bannerBom ? 'bom' : 'mau'}">${escapar(p.banner)}</div>` : '')
    + (c ? `${barra('PV do inimigo', c.pv, c.pvMax, '#7c1f1f')}${barra('A sua Vida', c.vida, c.vidaMax, '#2f5a33')}${(c.lados || []).map(l => barra(l.nome, l.pv, l.pvMax, l.inimigo ? '#9a3a2a' : '#4f7a3a')).join('')}<p class="f-stats">Ele: CA ${c.defesa} · Ataca ${c.ataque >= 0 ? '+' : ''}${c.ataque} · Dano ${c.dado}<br>Você: CA ${c.ca}${c.escudo ? ' · Com escudo' : ''}</p>` : '')
    + texto.split('\n\n').map(par => `<p>${par}</p>`).join('')
    + (p.fundo ? '<p><a data-cena="1">Ler mais sobre esta cena</a></p>' : '')
    + (p.rodape ? `<div class="f-fichas">${p.rodape.split('  ·  ').filter(Boolean).map(f => `<span class="${f[0] === '+' ? 'mais' : f[0] === '-' ? 'menos' : ''}">${escapar(f)}</span>`).join('')}</div>` : '');
  $('folha').scrollTop = 0;
}

function atualizaBotaoMapa() {
  document.body.classList.toggle('livro-aberto', world.book.aberto);
  $('peek-map').textContent = world.book.aberto ? 'Mapa' : 'Livro';
  posicaoAviso();
}

function termosDe(texto) {
  return Object.keys(LORE).filter(k => texto.includes(LORE[k].nome)).map(k => ({ nome: LORE[k].nome, id: k }));
}

function abrirLore(titulo, texto) {
  $('rever-guia').hidden = true;
  $('lore-titulo').textContent = titulo;
  $('lore-texto').textContent = texto;
  $('lore').classList.add('on');
}

const ui = {
  som(nome) {
    if (nome === 'moeda') sfx.coin();
    if (nome === 'golpe') sfx.hit();
  },

  prompt(titulo, sub = '') {
    $('prompt-title').textContent = titulo;
    $('prompt-sub').textContent = sub;
    $('prompt').classList.toggle('on', !!titulo);
    posicaoAviso();
  },

  async aviso(texto) {
    const t = $('aviso');
    t.textContent = texto;
    t.classList.add('on');
    await wait(3.4);
    t.classList.remove('on');
    await wait(.3);
  },

  // Quem vai agir, antes de os dados caírem. O resultado vem por cima, no mesmo sítio.
  async anuncio(texto) {
    const t = $('toast');
    t.textContent = texto;
    t.className = 'on';
    await wait(1.1);
  },

  async resultado(texto, bom) {
    const t = $('toast');
    t.textContent = texto;
    t.className = 'on ' + (bom ? 'good' : 'bad');
    await wait(1.7);
    t.className = '';
    world.hideDice();
  },

  // Dados em cima do mapa: o livro nunca os pode tapar.
  async dados(lista, opcoes = {}) {
    if (lista.some(d => d.tipo === 'd20')) dica('dado');
    if (opcoes.onde === 'mapa') await ui.fecharLivro();
    return world.rollDice(lista, opcoes);
  },

  musica: modo => { if (typeof G !== 'undefined' && G && G.cls) musica.classe(G.cls); musica.modo(modo); },

  async critico(bom) {
    const c = $('critico');
    c.textContent = bom ? 'Acerto Crítico!' : 'Falha Crítica!';
    c.className = 'on ' + (bom ? 'bom' : 'mau');
    (bom ? sfx.critico : sfx.falha)();
    await world.efeitoCritico(bom);
    c.className = '';
  },

  async livro(p) {
    dica('livro');
    paginaAtual = p;
    desenharFolha(p);
    // O lugar onde o herói está escolhe a pintura da página, quando há uma.
    await world.book.turn({ lugar: G && (G.lugar || G.cidade), ...p, termos: termosDe(p.texto || '') });
    atualizaBotaoMapa();
  },

  // A página que está aberta, com os números de agora. Não vira a folha.
  async refrescar(p) {
    const antes = paginaAtual && paginaAtual.combate, c = p.combate;
    paginaAtual = p;
    desenharFolha(p);
    const pag = { ...p, termos: termosDe(p.texto || '') };
    // No combate, as barras não saltam: deslizam do valor de antes até ao novo.
    const lados = c && antes && (c.lados || []).length === (antes.lados || []).length;
    const mudou = c && antes && world.book.aberto && (antes.pv !== c.pv || antes.vida !== c.vida || (lados && c.lados.some((l, i) => l.pv !== antes.lados[i].pv)));
    if (!mudou) { await world.book.refaz(pag); atualizaBotaoMapa(); return; }
    const entre = k => ({ pv: antes.pv + (c.pv - antes.pv) * k, vida: antes.vida + (c.vida - antes.vida) * k,
      lados: lados ? c.lados.map((l, i) => antes.lados[i].pv + (l.pv - antes.lados[i].pv) * k) : null });
    await world.book.refaz({ ...pag, combate: { ...c, mostra: entre(0) } });
    atualizaBotaoMapa();
    const PASSOS = 8;
    for (let i = 1; i <= PASSOS; i++) {
      await new Promise(r => setTimeout(r, 45));
      const k = 1 - Math.pow(1 - i / PASSOS, 2);
      await world.book.refazDireita(i === PASSOS ? pag : { ...pag, combate: { ...c, mostra: entre(k) } });
    }
  },

  async fecharLivro() {
    await world.book.fechar();
    atualizaBotaoMapa();
  },

  pino() {
    world.setPin(CLASSES[G.cls].cor, CLASSES[G.cls].glyph, G.cidade, G.cls);
  },

  // Uma pista encontrada vira carta na mesa, e pode ler-se a qualquer momento.
  async pista(i) {
    dica('pista');
    const d = G.diario[i];
    const f = FRAQUEZAS[d.fraqueza];
    const c = world.createCard({ tema: 'investigacao', etiqueta: `Pista ${i + 1}`, titulo: f.nome, glyph: 'eye', desc: `${f.desc} ${d.texto}` });
    sfx.card();
    await world.fly(c, lugarPista(i), .8, { arc: 2 });
    c.inspectable = true; c.zoom = true;
  },

  mapa(destaque) {
    mapaDestaque = destaque;
    refazerMapa();
  },

  mundo() {
    sfx.card();
    refazerMapa();
  },

  // O d20 muda para sempre, e cai na mesa para se ver bem.
  async evoluir() {
    sfx.critico();
    const tema = D20_TEMAS[D20_DA_EVOLUCAO[G.evolucao]];
    world.tornarD20(tema);
    await ui.fecharLivro();
    await world.rollDice([{ tipo: 'd20', face: 19 }], { onde: 'mapa' });
    await ui.resultado(`O seu d20 nunca mais será o mesmo. ${tema.frase}`, true);
  },

  async andar(trajeto) {
    dica('estrada');
    await ui.fecharLivro();
    await world.movePin(trajeto);
    await wait(.35);
  },

  // A viagem em duas metades: o pino espera na estrada, e só depois chega.
  async meioCaminho(de, para) {
    dica('encontro');
    await ui.fecharLivro();
    await world.movePinTroco(de, para, 0, .5);
  },

  async chegar(de, para) {
    await ui.fecharLivro();
    await world.movePinTroco(de, para, .5, 1);
    await wait(.35);
  },

  // A carta escolhida vai para o seu lugar no tabuleiro. As que não têm lugar voltam ao monte.
  async draft(titulo, sub, specs, { lugar = null } = {}) {
    ui.prompt(titulo, sub);
    mostrarTutorial();
    dica(lugar || { 'Escolha a sua arma': 'arma', 'Escolha o que levar': 'levar', 'Escolha a cidade de partida': 'partida' }[titulo]);
    const zona = () => world.fileira(specs.length, { topo: .66, base: -.8, esq: -.92, dir: .92, y: 4.5, grelha: ecraVertical() });
    const alvos = zona();
    const cards = specs.map(s => world.createCard(s));
    maoAtual = { cards, zona };
    cards.forEach((c, i) => { c.hoverScale = .1; c.hoverLift = 1.1; window.setTimeout(sfx.card, i * 170); });
    await Promise.all(cards.map((c, i) => world.fly(c, alvos[i], .8, { delay: i * .17, arc: 3 })));
    const idx = await world.choose(cards);
    maoAtual = null;
    const itemId = specs[idx].itemId;
    const slot = itemId ? ITENS[itemId].slot : null;
    const destino = lugar || (slot === 'mochila' ? 'm0' : slot);
    await Promise.all(cards.map((c, i) => {
      if (i === idx && destino) return world.fly(c, lugarNoTabuleiro(destino), .7, { arc: 2 });
      return world.fly(c, { pos: AO_BARALHO(), rot: [FACE_DOWN, 0, 0], scale: .6 }, .55, { arc: 2 }).then(() => world.removeCard(c));
    }));
    if (destino) {
      cards[idx].inspectable = true;
      cards[idx].zoom = true;
      cartasHeroi[destino] = slot === 'mochila' ? { card: cards[idx], chave: itemId, id: itemId } : { card: cards[idx], adotar: true };
    }
    ui.prompt('');
    return idx;
  },

  // Dá as cartas para a mão e devolve o índice da escolhida.
  async escolha(specs, { ctx } = {}) {
    dica(ctx);
    if (ctx === 'cena' && specs.some(s => s.mascara)) window.setTimeout(() => dica('mascara'), 200);
    if (ctx === 'talento') return ui.escolhaEmDestaque(specs);
    const zona = () => world.fileira(specs.length, zonaDaMao());
    const alvos = zona();
    const origem = AO_BARALHO();
    const cards = specs.map(s => world.createCard(s, { at: origem }));
    cards.forEach((c, i) => { if (specs[i].unica) world.prepararQueima(c); });
    maoAtual = { cards, zona };
    document.body.classList.add('foco');
    cards.forEach((c, i) => { c.zoom = true; window.setTimeout(sfx.card, i * 140); });
    await Promise.all(cards.map((c, i) => world.fly(c, alvos[i], .7, { delay: i * .14, arc: 2 })));
    const idx = await world.choose(cards);
    maoAtual = null;
    document.body.classList.remove('foco');
    // A carta única da criação não volta ao baralho: desfaz-se em fogo, com as outras ainda ao lado.
    // Só quando acaba de arder é que as outras voltam.
    const arde = specs[idx].unica ? cards[idx] : null;
    if (arde) { await world.desintegrar(arde); world.removeCard(arde); }
    await Promise.all(cards.filter(c => c !== arde).map(c => world.fly(c, { pos: origem, rot: [FACE_DOWN, 0, 0], scale: .6 }, .45, { arc: 1 }).then(() => world.removeCard(c))));
    return idx;
  },

  // Um momento à parte: a mesa escurece, e só restam as cartas por escolher.
  async escolhaEmDestaque(specs) {
    emDestaque = true;
    posicaoAviso();
    document.body.classList.add('veu');
    world.veu(true);
    const zona = () => world.fileira(specs.length, { topo: .7, base: -.92, esq: -.92, dir: .92, perto: true, grelha: ecraVertical() });
    const alvos = zona();
    const origem = AO_BARALHO();
    const cards = specs.map(s => world.createCard(s, { at: origem }));
    cards.forEach((c, i) => { if (specs[i].unica) world.prepararQueima(c); });
    maoAtual = { cards, zona };
    cards.forEach((c, i) => { c.hoverScale = .05; c.hoverLift = .1; world.halo(c); window.setTimeout(sfx.card, i * 170); });
    await Promise.all(cards.map((c, i) => world.fly(c, alvos[i], .75, { delay: i * .17, arc: 1 })));
    const idx = await world.choose(cards);
    maoAtual = null;
    emDestaque = false;
    document.body.classList.remove('veu');
    world.veu(false);
    await Promise.all(cards.map(c => world.fly(c, { pos: origem, rot: [FACE_DOWN, 0, 0], scale: .6 }, .45, { arc: 1 }).then(() => world.removeCard(c))));
    posicaoAviso();
    return idx;
  },

  async seguir(label = 'Continuar', desc = 'Virar a página.') {
    await ui.escolha([{ tema: 'escolha', etiqueta: 'Seguir', titulo: label, desc, glyph: 'sign' }]);
  },

  async missao() {
    dica('missao');
    const t = G.trama, obj = OBJETIVOS[t.objetivo], v = VILOES[t.vilao], rev = REVIRAVOLTAS[t.reviravolta];
    ui.prompt('A sua missão', 'Isto é o que sabe. Há uma parte que continua selada.');
    // As cartas flutuam acima do pino, que está de pé no mapa e não pode ficar à frente delas.
    cartaMissao = world.createCard({ tema: 'classe', etiqueta: 'Missão', titulo: fmt(obj.titulo), glyph: obj.glyph, desc: fmt(obj.desc) });
    sfx.card();
    await world.fly(cartaMissao, { pos: [CX - 3, 3, 1], rot: [TILT, 0, 0], scale: 1.4 }, .9, { arc: 3 });

    const backC = (() => {
      const [c, x] = canvas(world.tex.CARD_W, world.tex.CARD_H);
      x.fillStyle = '#191310'; x.fillRect(0, 0, c.width, c.height);
      // O verso pintado (arte/destino.png), quando existe: o selo e o olho vêm na pintura, e o texto escreve-se por cima.
      const pint = typeof ARTE !== 'undefined' && ARTE.img.destino;
      const temPint = !!(pint && pint.complete && pint.naturalWidth);
      if (temPint) x.drawImage(pint, 0, 0, c.width, c.height);
      else speckle(x, c.width, c.height, 26000, .4);
      x.strokeStyle = '#c9a24a'; x.lineWidth = 10; x.strokeRect(46, 46, c.width - 92, c.height - 92);
      x.lineWidth = 2; x.strokeRect(68, 68, c.width - 136, c.height - 136);
      x.fillStyle = '#c9a24a'; x.textAlign = 'center';
      x.font = `600 62px ${FONT_TITLE}`;
      x.fillText('O DESTINO', c.width / 2, 240);
      x.font = `italic 52px ${FONT_BODY}`;
      x.fillText('Não abrir antes do fim', c.width / 2, c.height - 210);
      if (!temPint) {
        drawGlyph(x, 'seal', c.width / 2, c.height / 2, 460, '#8a1414');
        drawGlyph(x, 'eye', c.width / 2, c.height / 2, 210, '#d99a8a');
      }
      return toTexture(c, world.renderer);
    })();
    costasSelada = backC;
    cartaSelada = world.createCard(especSelada(), { back: backC });
    sfx.card();
    await world.fly(cartaSelada, { pos: [CX + 3, 3, 1], rot: [FACE_DOWN, 0, 0], scale: 1.4 }, .9, { arc: 3 });
    await wait(.5);

    ui.prompt('A sua missão', 'Há uma parte que continua selada. Clique na missão para Iniciar a Missão.');
    cartaMissao.hoverScale = .1; cartaMissao.hoverLift = 1.1;
    await world.choose([cartaMissao]);
    ui.prompt('');
    await Promise.all([
      world.fly(cartaMissao, LUGAR_MISSAO, 1.1, { arc: 3 }),
      world.fly(cartaSelada, LUGAR_SELADA, 1.1, { arc: 3 }),
    ]);
    cartaMissao.inspectable = true; cartaMissao.zoom = true;
    ui.sync();
    if (guiaPendente) { guiaPendente = false; await guia(); }
  },

  // Quando o chefe muda de lado, a carta selada passa a dizer a verdade nova, no mesmo sítio.
  async trocarSelada() {
    if (!cartaSelada) return;
    const velha = cartaSelada;
    cartaSelada = world.createCard(especSelada(), { back: costasSelada });
    await world.fly(cartaSelada, { ...LUGAR_SELADA, rot: [FACE_UP, 0, .02] }, .01);
    cartaSelada.inspectable = true; cartaSelada.zoom = true;
    world.removeCard(velha);
  },

  async revelar() {
    await ui.fecharLivro();
    ui.prompt('O selo quebra-se', 'Agora sabe o que esteve sempre em jogo. Clique na carta para continuar.');
    sfx.card();
    await world.fly(cartaSelada, { pos: [CX, 3, 1], rot: [TILT, 0, 0], scale: 1.6 }, 1.2, { arc: 2 });
    await wait(.6);
    await world.choose([cartaSelada]);
    ui.prompt('');
    await world.fly(cartaSelada, { ...LUGAR_SELADA, rot: [FACE_UP, 0, .02] }, .8, { arc: 2 });
    cartaSelada.inspectable = true; cartaSelada.zoom = true;
  },

  async fim(titulo, texto, bom, verdade) {
    if (cartaSelada && cartaSelada.rot.x > 0) await ui.revelar();
    await ui.livro({
      capitulo: bom ? 'Epílogo' : 'O fim', titulo,
      arte: LUGARES[G.lugar || G.cidade].terreno,
      texto: `${texto}\n\n${verdade}`,
      banner: bom ? 'Missão cumprida' : 'Missão perdida', bannerBom: bom,
    });
    await ui.escolha([{ tema: 'classe', etiqueta: 'Nova Partida', titulo: 'Baralhar de Novo', desc: 'Novas cartas, nova trama, outro herói.', glyph: 'eye' }]);
    location.reload();
  },

  sync() {
    $('rail').classList.add('on');
    world.resize();
    if (!G) return;
    // A partida guiada acaba na segunda etapa.
    if (tutorial && G.fio >= 1) dica('fim');
    const max = G.cls ? vidaMax() : 0;
    const prox = G.cls ? xpParaProximo() : null;
    const base = NIVEIS[G.nivel - 1] || 0;
    $('b-vida').style.height = `${max ? Math.max(0, G.vida) / max * 100 : 0}%`;
    $('b-xp').style.height = `${prox === null ? (G.cls ? 100 : 0) : Math.min(100, (G.xp - base) / (prox - base) * 100)}%`;
    $('t-vida').title = G.cls ? `Vida: ${G.vida} de ${max}` : 'Vida';
    $('t-xp').title = prox === null ? `Nível ${G.nivel}: nível máximo` : `Nível ${G.nivel}: ${G.xp} de ${prox} XP`;
    // No nível máximo a barra fica dourada, e brilha sempre que a experiência sobe.
    const topo = !!G.cls && prox === null;
    $('t-xp').classList.toggle('max', topo);
    if (topo && xpVisto !== null && G.xp > xpVisto) {
      $('t-xp').classList.remove('pulso'); void $('t-xp').offsetWidth; $('t-xp').classList.add('pulso');
    }
    xpVisto = G.cls ? G.xp : null;
    $('r-vida').textContent = G.cls ? G.vida : '-';
    $('r-nivel').textContent = topo ? 'Máx' : G.nivel;
    $('r-ouro').textContent = G.ouro;
    $('r-ca').textContent = G.cls ? caJogador() : '-';
    acertarVida();
    const missaoOn = !!G.trama && !G.emCombate;
    $('objetivo').classList.toggle('on', missaoOn);
    if (missaoOn) {
      // Os nomes vêm dos dados do jogo, nunca do jogador; por isso podem ir em HTML.
      $('objetivo-agora').innerHTML = `${objetivoAgora(true)}.`;
      $('objetivo-pista').innerHTML = pistaAgora(true) ? `${pistaAgora(true)}.` : (G.pistas >= PISTAS_PRECISAS ? 'Tem as três pistas.' : '');
    }
    const trilha = $('trilha');
    if (G.trama) {
      if (!trilha.classList.contains('on')) { trilha.classList.add('on'); world.resize(); }
      desenharTrilha();
    }
    desenharFragmentos();
    refazerMapa();
    sincronizarTabuleiro();
    world.tokens.sync(G.cls ? Object.keys(ATTR).map(a => [ATTR[a].nome, attr(a)]) : null, Math.min(G.ouro, 40));
    desenharPainel();
  },
};

function linhaItem(rotulo, id, extra = '') {
  if (!id) return `<li class="slot vazio"><span class="rotulo">${rotulo}</span><span class="nome">Vazio</span></li>`;
  return `<li class="slot"><span class="rotulo">${rotulo}</span><span class="nome">${nomeItem(id)}${extra}</span><span class="desc">${descItem(id)}</span></li>`;
}

function desenharPainel() {
  if (!G.cls) { $('painel-corpo').innerHTML = '<p class="vazio">Por decidir. O baralho ainda está a escolher.</p>'; return; }
  const pele = [nomeClasse(), G.raca && RACAS[G.raca].nome, G.bg && ANTECEDENTES[G.bg].nome].filter(Boolean).join(' · ');
  const prox = xpParaProximo();
  const base = NIVEIS[G.nivel - 1] || 0;
  const barra = prox === null ? 100 : Math.min(100, Math.round((G.xp - base) / (prox - base) * 100));
  const atributos = Object.keys(ATTR).map(a => `<li><span>${ATTR[a].nome}</span><b>${sinal(attr(a))}</b></li>`).join('');
  const tipos = Object.keys(TIPOS).filter(t => bonusTipo(t)).map(t => `<li><span>${TIPOS[t].nome}</span><b>${sinal(bonusTipo(t))}</b></li>`).join('');

  const mochila = [];
  for (let i = 0; i < MOCHILA_MAX; i++) {
    const id = G.mochila[i];
    if (!id) { mochila.push('<li class="slot vazio"><span class="nome">Espaço livre</span></li>'); continue; }
    const it = ITENS[id];
    const usa = it.uso ? `<button data-usar="${id}" ${G.vida >= vidaMax() ? 'disabled' : ''}>Usar</button>` : '';
    mochila.push(`<li class="slot"><span class="nome">${it.nome}</span><span class="desc">${it.desc}</span>${usa}</li>`);
  }

  const arvore = TALENTOS[G.cls].map(t => {
    const tem = G.talentos.includes(t.id);
    const pode = !t.req || G.talentos.includes(t.req);
    return `<li class="talento ${tem ? 'tem' : pode ? 'pode' : ''} ${t.req ? 'filho' : ''}"><span class="nome">${t.nome}</span><span class="desc">${t.desc}</span></li>`;
  }).join('');
  const gerais = TALENTOS.geral.filter(t => G.talentos.includes(t.id))
    .map(t => `<li class="talento tem"><span class="nome">${t.nome}</span><span class="desc">${t.desc}</span></li>`).join('');

  const aliados = G.aliados.length
    ? G.aliados.map(id => `<li class="slot"><span class="nome">${ALIADOS[id].nome}</span><span class="desc">${resumoAliado(fichaAliado(id))}<br>${ALIADOS[id].desc}</span></li>`).join('')
    : '<li class="slot vazio"><span class="nome">Viaja sozinho, por agora.</span></li>';

  const pistas = G.diario.map((d, i) => `<li class="slot"><span class="rotulo">Pista ${i + 1}: ${FRAQUEZAS[d.fraqueza].nome}</span><span class="desc">${FRAQUEZAS[d.fraqueza].desc} ${d.texto}</span></li>`).join('');
  const rumo = pistaAgora(true) ? `${pistaAgora(true)}.` : '';

  const missao = G.trama ? `<section><h3>Missão</h3><p class="missao">${fmt(OBJETIVOS[G.trama.objetivo].titulo)}</p><p class="pequeno"><b>Agora:</b> ${objetivoAgora(true)}.</p><p class="pequeno">Dia ${G.dia} de ${G.prazo}. Pistas: ${G.pistas} de ${PISTAS_PRECISAS}.${pressao() ? ` O tempo aperta: +${pressao()} em todos os testes.` : ''}</p></section>` : '';

  $('painel-corpo').innerHTML = `
    <header><h2>${pele}</h2><p>${nomeTendencia()} · Nível ${G.nivel}${prox !== null ? ` · ${G.xp}/${prox} XP` : ' · nível máximo'} · CA ${caJogador()}</p><div class="barra"><i style="width:${barra}%"></i></div></header>
    ${missao}
    ${G.trama ? `<section><h3>Pistas</h3><ul>${pistas || '<li class="slot vazio"><span class="nome">Ainda nenhuma.</span></li>'}</ul><p class="pequeno">${rumo}</p></section>` : ''}
    <section><h3>Atributos</h3><ul class="grelha">${atributos}${tipos}</ul></section>
    <section><h3>No corpo</h3><ul>
      ${linhaItem('Arma', G.equip.arma, G.equip.arma ? ` (${ITENS[G.equip.arma].dado})` : '')}
      ${linhaItem('Armadura', G.equip.armadura)}
      ${linhaItem('Acessório', G.equip.acessorio)}
    </ul></section>
    <section><h3>Mochila</h3><ul>${mochila.join('')}</ul></section>
    <section><h3>Talentos</h3><ul>${arvore}${gerais}</ul></section>
    <section><h3>Aliados</h3><ul>${aliados}</ul></section>`;
}

// A letra: a medieval (IM Fell English) é a padrão desde 5 nov.; a legível (Andika) fica para quem a preferir.
const LETRAS = {
  legivel: { titulo: '"Andika Cardo", Verdana, sans-serif', texto: '"Andika Cardo", Verdana, sans-serif', nome: 'legível' },
  // A EB Garamond só traz os algarismos (os da IM Fell descem abaixo da linha); o resto é IM Fell.
  classica: { titulo: '"EB Garamond", "IM Fell English SC", Georgia, serif', texto: '"EB Garamond", "IM Fell English", Georgia, serif', nome: 'medieval' },
};
function usarLetra(nome) {
  const l = LETRAS[nome] || LETRAS.legivel;
  FONT_TITLE = l.titulo;
  FONT_BODY = l.texto;
  document.body.classList.toggle('legivel', l === LETRAS.legivel);
  $('letra-btn').textContent = `Letra: ${l.nome}`;
}
// A chave mudou de nome quando a medieval passou a padrão, para valer também para quem já tinha escolhido.
let letra = 'classica';
try { letra = localStorage.getItem('cardomancer-letra2') || 'classica'; } catch (e) { /* sem memória, fica a medieval */ }

async function main() {
  try {
    await Promise.all(['40px "IM Fell English SC"', '40px "IM Fell English"', 'italic 40px "IM Fell English"', '40px "Andika Cardo"', '700 40px "Andika Cardo"', 'italic 40px "Andika Cardo"'].map(f => document.fonts.load(f, 'Áçã')).concat(['40px "EB Garamond"', '600 40px "EB Garamond"', 'italic 40px "EB Garamond"'].map(f => document.fonts.load(f, '0123456789'))));
  } catch (e) { /* sem fontes, usa Georgia */ }
  // A mesa, o tabuleiro e o mapa desenham-se uma vez ao abrir: as imagens pintadas têm de estar prontas antes.
  // Espera só pelas que ainda não carregaram, e nunca mais de 4 segundos.
  if (typeof ARTE !== 'undefined') {
    const faltam = Object.values(ARTE.img).filter(i => !i.complete);
    await Promise.race([
      Promise.all(faltam.map(i => new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))),
      new Promise(r => setTimeout(r, 4000)),
    ]);
  }
  usarLetra(letra);

  if (typeof THREE === 'undefined') {
    $('title-sub').textContent = 'Não foi possível carregar o motor 3D. Verifique a ligação à Internet e abra de novo.';
    return;
  }

  world = createWorld($('view'));
  window.CARDO = { world, get G() { return G; } };

  world.updateMap([], []);
  $('i-vida').src = icone('heart', '#e8675f');
  $('i-xp').src = icone('star', '#8fc7f0');
  $('i-ouro').src = icone('coin', '#e4bf63');
  $('i-ca').src = icone('shield', '#f2e3bd');
  $('i-trilha').src = icone('hourglass', '#d8b45e');
  window.addEventListener('resize', () => {
    // Ao virar o telemóvel, a folha e os avisos mudam de sítio.
    posicaoAviso();
    if (!maoAtual) return;
    world.resize();
    const alvos = maoAtual.zona();
    maoAtual.cards.forEach((c, i) => world.fly(c, alvos[i], .2, { arc: 0 }));
  });
  world.handlers.carta = c => {
    const id = c.spec.itemId;
    if (!id || !ITENS[id].uso || c.rot.x > 0 || G.emCombate || G.vida <= 0 || G.vida >= vidaMax()) return;
    if (usarItem(id)) { sfx.coin(); ui.sync(); }
  };

  world.handlers.link = l => {
    if (l.id === 'cena') abrirLore(paginaAtual.titulo, paginaAtual.fundo);
    else abrirLore(LORE[l.id].titulo, LORE[l.id].texto);
    sfx.page();
  };

  // O logótipo pintado toma o lugar do título em letra, quando existe.
  if (typeof ARTE !== 'undefined' && ARTE.logo) {
    const h = $('title').querySelector('h1'), logo = new Image();
    logo.src = ARTE.logo; logo.alt = 'Cardomancer';
    h.replaceChildren(logo); h.classList.add('com-logo');
  }
  // A placa pintada dos botões (veludo e moldura dourada), em peças que o CSS estica.
  if (typeof ARTE !== 'undefined' && ARTE.botao) {
    const r = document.documentElement.style;
    r.setProperty('--botao', `url(${ARTE.botao})`);
    r.setProperty('--botao-liso', `url(${ARTE.botaoLiso})`);
    r.setProperty('--botao-orn', `url(${ARTE.botaoOrn})`);
    document.documentElement.classList.add('placas');
  }
  // O papel velho das cartas, por trás dos textos que se leem em janela.
  if (typeof ARTE !== 'undefined' && ARTE.papel) document.documentElement.style.setProperty('--papel', `url(${ARTE.papel})`);
  $('loading').classList.remove('on');
  $('title').classList.add('on');

  $('peek-map').addEventListener('click', async () => {
    await (world.book.aberto ? world.book.fechar() : world.book.abrir());
    atualizaBotaoMapa();
  });
  $('ajuda').addEventListener('click', () => { abrirLore('Como se joga', COMO_JOGAR); $('rever-guia').hidden = !G || !G.trama; });
  $('folha').addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.dataset.cena) abrirLore(paginaAtual.titulo, paginaAtual.fundo);
    else if (LORE[a.dataset.lore]) abrirLore(LORE[a.dataset.lore].titulo, LORE[a.dataset.lore].texto);
    sfx.page();
  });
  // Quem prefere jogar de pé fica com essa escolha.
  try { if (localStorage.getItem('cardomancer-vertical')) document.body.classList.add('vertical'); } catch (e) { /* sem memória, pergunta-se outra vez */ }
  $('vertical-btn').addEventListener('click', () => {
    document.body.classList.add('vertical');
    try { localStorage.setItem('cardomancer-vertical', '1'); } catch (e) { /* idem */ }
    world.resize(); posicaoAviso();
    if (maoAtual) { const alvos = maoAtual.zona(); maoAtual.cards.forEach((c, i) => world.fly(c, alvos[i], .2, { arc: 0 })); }
  });
  // Deitado no telemóvel, o Ler mostra a página em letra grande; fica escolhido para as próximas vezes.
  try { if (localStorage.getItem('cardomancer-ler')) document.body.classList.add('ler'); } catch (e) { /* sem memória */ }
  $('ler-btn').addEventListener('click', () => {
    const ler = document.body.classList.toggle('ler');
    try { ler ? localStorage.setItem('cardomancer-ler', '1') : localStorage.removeItem('cardomancer-ler'); } catch (e) { /* idem */ }
    posicaoAviso(); sfx.page();
  });
  $('rever-guia').addEventListener('click', () => { $('lore').classList.remove('on'); guia(); });
  $('abrir-painel').addEventListener('click', () => $('painel').classList.toggle('on'));
  $('fechar-painel').addEventListener('click', () => $('painel').classList.remove('on'));
  const rotuloImagem = nome => { $('imagem-btn').textContent = `Imagem: ${nome}`; };
  rotuloImagem(world.qualidade);
  world.aoMudarQualidade = rotuloImagem;
  $('imagem-btn').addEventListener('click', () => world.proximaQualidade());
  $('musica-btn').addEventListener('click', e => {
    e.target.textContent = musica.alternar() ? 'Música: sim' : 'Música: não';
  });
  // Muda já o que está à vista: o livro e o mapa. As cartas novas saem com a letra nova.
  $('letra-btn').addEventListener('click', async () => {
    letra = letra === 'legivel' ? 'classica' : 'legivel';
    try { localStorage.setItem('cardomancer-letra2', letra); } catch (e) { /* fica só nesta visita */ }
    usarLetra(letra);
    mapaChave = '';
    refazerMapa();
    if (paginaAtual && world.book.aberto) await ui.refrescar(paginaAtual);
  });
  $('mute').addEventListener('click', e => {
    const m = sfx.toggle();
    e.target.textContent = m ? 'Som: não' : 'Som: sim';
  });
  $('lore').addEventListener('click', () => $('lore').classList.remove('on'));
  // As teclas de atalho: o jogador pode mudá-las em Configurações, e ficam guardadas neste aparelho.
  const TECLAS_BASE = { ficha: 'c', mapa: 'm', pocao: 'b', ajuda: 'h' };
  const NOME_ACAO = { ficha: 'Abrir e fechar a ficha', mapa: 'Ver o mapa', pocao: 'Beber uma poção da mochila', ajuda: 'Como se joga' };
  let teclas = { ...TECLAS_BASE };
  try { Object.assign(teclas, JSON.parse(localStorage.getItem('cardomancer-teclas') || '{}')); } catch (e) { /* fica com as de origem */ }
  const guardarTeclas = () => { try { localStorage.setItem('cardomancer-teclas', JSON.stringify(teclas)); } catch (e) { /* só nesta visita */ } };
  const nomeTecla = k => (k === ' ' ? 'Espaço' : k.length === 1 ? k.toUpperCase() : k);
  let aMudar = null;
  const desenharTeclas = () => {
    $('teclas-lista').innerHTML = Object.keys(NOME_ACAO).map(a => `<li><span>${NOME_ACAO[a]}</span><button data-acao="${a}" class="${aMudar === a ? 'espera' : ''}">${aMudar === a ? 'Carregue numa tecla' : nomeTecla(teclas[a])}</button></li>`).join('');
  };
  const abrirTeclas = () => { aMudar = null; desenharTeclas(); $('teclas').classList.add('on'); };
  const fecharTeclas = () => { aMudar = null; $('teclas').classList.remove('on'); };
  document.querySelectorAll('.abre-teclas').forEach(b => b.addEventListener('click', abrirTeclas));

  // A opinião do jogador: só o texto, a data e a hora, numa issue do GitHub do jogo.
  const textoOpiniao = () => {
    const agora = new Date();
    const quando = `${agora.toLocaleDateString('pt-PT')} ${agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    return { quando, corpo: `${$('opiniao-texto').value.trim()}

---
Enviado do jogo a ${quando}.` };
  };
  const fecharOpiniao = () => $('opiniao').classList.remove('on');
  document.querySelectorAll('.abre-opiniao').forEach(b => b.addEventListener('click', () => { $('opiniao').classList.add('on'); $('opiniao-texto').focus(); }));
  $('opiniao-fechar').addEventListener('click', fecharOpiniao);
  $('opiniao-enviar').addEventListener('click', () => {
    if (!$('opiniao-texto').value.trim()) { $('opiniao-texto').focus(); return; }
    const { quando, corpo } = textoOpiniao();
    const url = `https://github.com/leviziinho/cardomancer/issues/new?labels=opiniao&title=${encodeURIComponent(`Opinião de ${quando}`)}&body=${encodeURIComponent(corpo)}`;
    window.open(url, '_blank', 'noopener');
  });
  $('opiniao-copiar').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(textoOpiniao().corpo); $('opiniao-copiar').textContent = 'Copiado'; } catch (e) { $('opiniao-texto').select(); }
    setTimeout(() => { $('opiniao-copiar').textContent = 'Copiar o texto'; }, 1600);
  });
  $('teclas-fechar').addEventListener('click', fecharTeclas);
  $('teclas-repor').addEventListener('click', () => { teclas = { ...TECLAS_BASE }; guardarTeclas(); aMudar = null; desenharTeclas(); });
  $('teclas-lista').addEventListener('click', e => { const a = e.target.dataset && e.target.dataset.acao; if (a) { aMudar = a; desenharTeclas(); } });
  const ACOES = {
    ficha: () => $('painel').classList.toggle('on'),
    mapa: () => $('peek-map').click(),
    ajuda: () => $('ajuda').click(),
    pocao: () => { if (G && usarItem('pocao')) { sfx.coin(); ui.sync(); } },
  };
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (aMudar) {
      e.preventDefault();
      // Os números ficam para as cartas, e o Esc para fechar.
      if (e.key !== 'Escape' && !/^[0-9]$/.test(e.key) && e.key.length === 1) {
        const k = e.key.toLowerCase();
        Object.keys(teclas).forEach(a => { if (teclas[a] === k) teclas[a] = teclas[aMudar]; });
        teclas[aMudar] = k;
        guardarTeclas();
      }
      aMudar = null; desenharTeclas();
      return;
    }
    if (e.key === 'Escape') { $('lore').classList.remove('on'); $('painel').classList.remove('on'); fecharTeclas(); fecharOpiniao(); return; }
    // A escrever a opinião, as letras são texto e não atalhos.
    if ($('teclas').classList.contains('on') || $('opiniao').classList.contains('on') || !G || !G.cls) return;
    const acao = Object.keys(teclas).find(a => teclas[a] === e.key.toLowerCase());
    if (acao) ACOES[acao]();
  });
  $('painel-corpo').addEventListener('click', e => {
    const id = e.target.dataset && e.target.dataset.usar;
    if (id && usarItem(id)) { sfx.coin(); ui.sync(); }
  });

  // As configurações da abertura são as mesmas do painel da direita.
  const opcoesAbertura = [...$('title-opcoes').children].filter(b => b.dataset.alvo);
  const rotulos = () => opcoesAbertura.forEach(b => { b.textContent = $(b.dataset.alvo).textContent; });
  rotulos();
  opcoesAbertura.forEach(b => b.addEventListener('click', async () => { await $(b.dataset.alvo).click(); setTimeout(rotulos, 50); }));
  $('title-config').addEventListener('click', () => {
    const abre = $('title-opcoes').hidden;
    $('title-opcoes').hidden = !abre;
    $('title-config').setAttribute('aria-expanded', String(abre));
    rotulos();
  });
  $('title-ajuda').addEventListener('click', () => { abrirLore('Como se joga', COMO_JOGAR); $('rever-guia').hidden = true; });
  $('tutorial-sair').addEventListener('click', sairTutorial);
  $('tdica-ok').addEventListener('click', () => { if (tutorial) $('tdica').hidden = true; });

  // A música da abertura (Si menor) entra no primeiro toque: os navegadores não deixam tocar antes disso.
  const tocarAbertura = () => { musica.modo('abertura'); musica.ligar(); };
  ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, tocarAbertura, { once: true }));
  const guiada = await new Promise(resolve => {
    $('start').addEventListener('click', () => resolve(false), { once: true });
    $('start-guiada').addEventListener('click', () => resolve(true), { once: true });
  });
  ['pointerdown', 'keydown'].forEach(ev => window.removeEventListener(ev, tocarAbertura));
  pedirEcraInteiro();
  if (guiada) {
    ligarTutorial();
    try { localStorage.setItem('cardomancer-primeira', '1'); } catch (e) { /* sem memória */ }
  } else await perguntarPrimeiraVez();
  sfx.card();
  musica.ligar();
  musica.modo('calma');
  // O preto desvanece enquanto a câmara desce sobre a mesa.
  $('title').classList.add('sai');
  await world.revelarMesa();
  $('title').classList.remove('on', 'sai');
  novoEstado();
  ui.sync();
  await partida(ui);
}

main();
