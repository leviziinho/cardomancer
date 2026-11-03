// Liga a partida à mesa 3D e ao painel lateral.

const $ = id => document.getElementById(id);
let world;

const SLOT_SCALE = .56;
let cartaSelada = null;
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
  { titulo: 'Ouro, armadura e pistas', alvo: () => juntar([$('r-ouro').parentNode, $('r-ca').parentNode, '.r-olhos']),
    texto: 'O ouro paga mercados, camas e silêncios. O escudo é a sua CA: quem o quiser ferir tem de chegar a esse número no d20. Os olhos acendem-se com cada pista completa.' },
  { titulo: 'Ficha, Mapa e Ajuda', alvo: () => juntar(['.r-tools']),
    texto: 'A Ficha guarda tudo sobre o herói e a missão. O Mapa fecha o livro para ver o caminho, e o Livro volta a abri-lo. A Ajuda tem as regras, e esta explicação outra vez.' },
  { titulo: 'Os dias', alvo: () => juntar(['#trilha']),
    texto: 'Cada dia acende uma marca. A ampulheta é o fim do prazo. Perto dela, os testes ficam mais difíceis; quatro dias depois, a missão perde-se.' },
  { titulo: 'Agora', alvo: () => ($('objetivo').classList.contains('on') ? juntar(['#objetivo']) : null),
    texto: 'O próximo passo da missão, e onde espera a próxima pista. Se se perder, olhe para aqui.' },
  { titulo: 'O mapa', alvo: () => world.retangulo(cantos(AREA.map)),
    texto: 'O pino é você. A estrela dourada marca a missão. O olho vermelho marca uma pista: ninguém o obriga a segui-la, mas quem a segue chega mais forte ao fim.' },
  { titulo: 'O que a missão guarda', alvo: () => world.retangulo(cantos({ x: CX + 11.2, z: -2.3, w: 5.2, h: 8.4 })),
    texto: 'A carta da missão e, ao lado, o destino selado, que só se abre no fim. Por baixo juntam-se as pistas, os talentos e os aliados.' },
  { titulo: 'O livro', alvo: () => (ecraVertical() || !world.book.aberto ? null : world.retanguloLivro()),
    texto: 'O livro conta o que acontece em cada cena, e abre-se sozinho quando há história. As palavras a vermelho escondem mais sobre o mundo: toque ou clique nelas.' },
  { titulo: 'As escolhas', alvo: () => zonaEmPixeis(),
    texto: 'Aqui aparecem as cartas. Cada uma é uma maneira de agir. A barra de baixo diz o atributo usado, o número a tirar no d20 e a hipótese de correr bem.' },
  { titulo: 'Os quatro atributos', alvo: () => null,
    texto: 'Força: golpes pesados, portas e ameaças. Agilidade: armas leves, fugas e passos sem ruído; decide também quem ataca primeiro. Mente: magia, pistas e armadilhas. Carisma: conversa, mentira e música. Quanto maior o número, mais fácil é o teste. Os seus estão na Ficha.' },
  { titulo: 'Cartas que contam mais', alvo: () => zonaEmPixeis(),
    texto: 'As amarelas são raras: correm sempre bem, e só há uma de cada. As que têm um olho vermelho dão um fragmento de pista. As escuras pedem algo que você não tem.' },
  { titulo: 'É tudo', alvo: () => juntar(['#ajuda']),
    texto: 'O resto descobre-se a jogar. Para rever esta explicação, use o botão Ajuda.' },
];

async function guia() {
  const g = $('guia'), foco = $('guia-foco'), caixa = $('guia-caixa');
  const visivel = r => r && r.right - r.left > 4 && r.bottom - r.top > 4 && r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
  const passos = PASSOS_GUIA.filter(p => { const r = p.alvo(); return r === null || visivel(r); });
  g.classList.add('on');
  for (let i = 0; i < passos.length; i++) {
    const p = passos[i], r = p.alvo();
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
}

// Só se pergunta uma vez. Quem já sabe, salta.
async function perguntarPrimeiraVez() {
  let visto = false;
  try { visto = !!localStorage.getItem('cardomancer-primeira'); } catch (e) { /* sem memória do navegador, pergunta-se sempre */ }
  if (visto) return;
  $('pergunta').classList.add('on');
  guiaPendente = await new Promise(resolve => {
    $('guia-sim').onclick = () => resolve(true);
    $('guia-nao').onclick = () => resolve(false);
  });
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
const LUGAR_MISSAO = { pos: [CX + 10.4, .05, -4.9], rot: [FACE_UP, 0, -.02], scale: SLOT_SCALE };
const LUGAR_SELADA = { pos: [CX + 12.55, .05, -4.9], rot: [FACE_DOWN, 0, .02], scale: SLOT_SCALE };
const lugarPista = i => ({ pos: [CX + 9.5 + i * 2.15, .05 + i * .002, -2.05], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .02], scale: SLOT_SCALE });
const lugarExtra = (i, n) => ({ pos: [CX + 9.5 + i * Math.min(2.15, 4.3 / Math.max(1, n - 1)), .05 + i * .004, .8], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .02], scale: SLOT_SCALE });
const AO_BARALHO = () => [BARALHO[0], .7, BARALHO[2]];

const COMO_JOGAR = `Passe o rato por cima de uma carta para a ler de perto, e clique para a jogar. Num ecrã de toque, toque na carta para a ler, e toque de novo para a jogar. As cartas da mesa, à esquerda e à direita, também se podem ler assim. Clique numa poção da mochila para a beber: depois de usada, fica virada.

Testes: o d20 mais o atributo tem de chegar ao número indicado na carta. Um 20 é sempre acerto crítico, e um 1 é sempre falha crítica.

Combate: joga-se à vez, e quem tem mais Agilidade começa. O seu d20 tem de chegar à CA dele, e o d20 negro dele tem de chegar à sua CA. Quem acerta rola o dado da arma.

Jeitos de lutar: cada inimigo tem o seu, dito no início do combate e no rodapé da página. A fera recua depois de acertar, o bruto prepara um golpe a dobrar (bom momento para o escudo), o morto-vivo levanta-se uma vez, a bruxa amaldiçoa, o ladrão rouba Ouro, o duelista castiga as falhas, o soldado apara o primeiro golpe e o bando ataca duas vezes.

Chefe final: tem muitos PV e duas ações por ronda, um efeito e um golpe. Os golpes variam: há os que partem a sua guarda, os que lhe cansam o braço, os que acertam sem dado, e há rondas em que ele só se defende. Os inimigos ficam mais duros a cada etapa da história, não a cada nível que sobe: o que ganha a subir fica seu.

Encontros na estrada: o pino para a meio do caminho, e só chega depois de resolver o que lá houver. A Marcha Forçada (1 dia) dá com um encontro metade das vezes. Pelos Trilhos (2 dias) só um quarto das vezes, e pode escolher passar ao lado. Explorar o Caminho (3 dias) tem sempre encontro. Os dois d10 dão um número de 1 a 100: com a percentagem da carta ou menos, há encontro, e um d10 diz qual. Um perigo começa logo em combate. Nos testes é ao contrário, porque se quer um número alto: o 11+ da carta é 11 ou mais.

Tempo e Vida: os falhanços gastam Vida, e recuperá-la gasta tempo. Os aliados lutam a seu lado, com CA e PV próprios. O inimigo também os ataca, e quem cai em combate perde-se. Durma numa estalagem, acampe na estrada ou guarde uma poção. A trilha em baixo mostra os dias, e o fim do prazo.

Missão: a estrela dourada no mapa e o aviso no canto dizem sempre para onde ir. São três etapas, e mesmo quem falha fica a saber a seguinte. Ganhar combates e ter êxito em testes também lhe dá dicas, que tornam a etapa seguinte mais fácil.

Pistas: são opcionais, mas muito fortes. Siga o olho vermelho no mapa. Lá, as cartas com o olho dão um fragmento se correrem bem, e até um combate pode ter o olho: há quem saiba perguntar com o machado. Se falhar uma carta com o olho, a pista muda de sítio, mas nada se perde. Com três fragmentos, a pista fica completa: poupa-lhe uma etapa e revela uma fraqueza do inimigo, que conta muito no combate final.

Cartas raras: as amarelas. Só há uma de classe, uma de raça e uma de antecedente em cada aventura. Se não a usar, volta ao baralho.

Mercado: com ouro a mais, peça ao ferreiro que aprimore a arma e a armadura.

Estrada: nem todos os encontros são maus. Um mercador secreto vende mais barato e, com muita sorte, um mestre pode mudar a sua classe.`;

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
    raca: G.raca ? { chave: G.raca, spec: { tema: 'raca', titulo: RACAS[G.raca].nome, glyph: RACAS[G.raca].glyph, desc: RACAS[G.raca].desc } } : null,
    antecedente: G.bg ? { chave: G.bg, spec: { tema: 'antecedente', titulo: ANTECEDENTES[G.bg].nome, glyph: ANTECEDENTES[G.bg].glyph, desc: ANTECEDENTES[G.bg].desc } } : null,
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
    ...G.aliados.map(id => ({ chave: ALIADOS[id].nome, spec: { tema: 'social', etiqueta: 'Aliado', titulo: ALIADOS[id].nome, glyph: 'person', desc: `${resumoAliado(fichaAliado(id))}. ${(ALIADOS[id].desc.match(/[^.]+\.\s*$/) || [''])[0].trim()}` } })),
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

// Com o livro fechado o aviso vai para o canto, para não tapar o mapa nem as cartas.
function posicaoAviso() {
  // De pé, a página começa logo abaixo do aviso.
  const p = $('prompt');
  const topoFolha = p.classList.contains('on') ? p.getBoundingClientRect().bottom + 4 : $('rail').getBoundingClientRect().bottom + 4;
  $('folha').style.top = `${topoFolha}px`;
  $('folha').style.maxHeight = `${Math.max(120, innerHeight * .55 - topoFolha)}px`;
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
    + (c ? `${barra('PV do inimigo', c.pv, c.pvMax, '#7c1f1f')}${barra('A sua Vida', c.vida, c.vidaMax, '#2f5a33')}<p class="f-stats">Ele: CA ${c.defesa} · Ataca ${c.ataque >= 0 ? '+' : ''}${c.ataque} · Dano ${c.dado}<br>Você: CA ${c.ca}${c.escudo ? ' · Com escudo' : ''}</p>` : '')
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
    if (opcoes.onde === 'mapa') await ui.fecharLivro();
    return world.rollDice(lista, opcoes);
  },

  musica: modo => musica.modo(modo),

  async critico(bom) {
    const c = $('critico');
    c.textContent = bom ? 'Acerto Crítico!' : 'Falha Crítica!';
    c.className = 'on ' + (bom ? 'bom' : 'mau');
    (bom ? sfx.critico : sfx.falha)();
    await world.efeitoCritico(bom);
    c.className = '';
  },

  async livro(p) {
    paginaAtual = p;
    desenharFolha(p);
    await world.book.turn({ ...p, termos: termosDe(p.texto || '') });
    atualizaBotaoMapa();
  },

  async fecharLivro() {
    await world.book.fechar();
    atualizaBotaoMapa();
  },

  pino() {
    world.setPin(CLASSES[G.cls].cor, CLASSES[G.cls].glyph, G.cidade);
  },

  // Uma pista encontrada vira carta na mesa, e pode ler-se a qualquer momento.
  async pista(i) {
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
    await ui.fecharLivro();
    await world.movePin(trajeto);
    await wait(.35);
  },

  // A viagem em duas metades: o pino espera na estrada, e só depois chega.
  async meioCaminho(de, para) {
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
    if (ctx === 'talento') return ui.escolhaEmDestaque(specs);
    const zona = () => world.fileira(specs.length, zonaDaMao());
    const alvos = zona();
    const origem = AO_BARALHO();
    const cards = specs.map(s => world.createCard(s, { at: origem }));
    maoAtual = { cards, zona };
    cards.forEach((c, i) => { c.zoom = true; window.setTimeout(sfx.card, i * 140); });
    await Promise.all(cards.map((c, i) => world.fly(c, alvos[i], .7, { delay: i * .14, arc: 2 })));
    const idx = await world.choose(cards);
    maoAtual = null;
    await Promise.all(cards.map(c => world.fly(c, { pos: origem, rot: [FACE_DOWN, 0, 0], scale: .6 }, .45, { arc: 1 }).then(() => world.removeCard(c))));
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
    const t = G.trama, obj = OBJETIVOS[t.objetivo], v = VILOES[t.vilao], rev = REVIRAVOLTAS[t.reviravolta];
    ui.prompt('A sua missão', 'Isto é o que sabe. Há uma parte que continua selada.');
    cartaMissao = world.createCard({ tema: 'classe', etiqueta: 'Missão', titulo: fmt(obj.titulo), glyph: obj.glyph, desc: obj.desc });
    sfx.card();
    await world.fly(cartaMissao, { pos: [CX - 3, 1.6, 1], rot: [TILT, 0, 0], scale: 1.4 }, .9, { arc: 3 });

    const backC = (() => {
      const [c, x] = canvas(world.tex.CARD_W, world.tex.CARD_H);
      x.fillStyle = '#191310'; x.fillRect(0, 0, c.width, c.height);
      speckle(x, c.width, c.height, 26000, .4);
      x.strokeStyle = '#c9a24a'; x.lineWidth = 10; x.strokeRect(46, 46, c.width - 92, c.height - 92);
      x.lineWidth = 2; x.strokeRect(68, 68, c.width - 136, c.height - 136);
      x.fillStyle = '#c9a24a'; x.textAlign = 'center';
      x.font = `600 62px ${FONT_TITLE}`;
      x.fillText('O DESTINO', c.width / 2, 240);
      x.font = `italic 52px ${FONT_BODY}`;
      x.fillText('Não abrir antes do fim', c.width / 2, c.height - 210);
      drawGlyph(x, 'seal', c.width / 2, c.height / 2, 460, '#8a1414');
      drawGlyph(x, 'eye', c.width / 2, c.height / 2, 210, '#d99a8a');
      return toTexture(c, world.renderer);
    })();
    cartaSelada = world.createCard({
      tema: 'destino', etiqueta: 'A Verdade', titulo: fmt(v.nome).replace(/^./, m => m.toUpperCase()), glyph: v.glyph,
      desc: fmt(`${t.motivo} ${rev.nome}: ${rev.resumo}`),
    }, { back: backC });
    sfx.card();
    await world.fly(cartaSelada, { pos: [CX + 3, 1.6, 1], rot: [FACE_DOWN, 0, 0], scale: 1.4 }, .9, { arc: 3 });
    await wait(.5);

    ui.prompt('A sua missão', 'Há uma parte que continua selada. Clique na missão para a aceitar.');
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
    let olhos = '';
    for (let i = 0; i < PISTAS_PRECISAS; i++) {
      // O olho da pista em curso vai ganhando cor com os fragmentos.
      const brilho = i < G.pistas ? 1 : i === G.pistas ? .25 + .25 * G.fragmentos : .25;
      olhos += `<img src="${icone('eye', i < G.pistas || (i === G.pistas && G.fragmentos) ? '#ff6a5c' : '#f2e3bd')}" style="opacity:${brilho}" alt="">`;
    }
    $('r-pistas').innerHTML = olhos;
    $('r-pistas').title = `Pistas completas: ${G.pistas} de ${PISTAS_PRECISAS}. Fragmentos da pista em curso: ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}.`;
    const missaoOn = !!G.trama && !G.emCombate;
    $('objetivo').classList.toggle('on', missaoOn);
    if (missaoOn) {
      $('objetivo-agora').textContent = `${objetivoAgora()}.`;
      $('objetivo-pista').textContent = pistaAgora() ? `${pistaAgora()}.` : (G.pistas >= PISTAS_PRECISAS ? 'Tem as três pistas.' : '');
    }
    const trilha = $('trilha');
    if (G.trama) {
      if (!trilha.classList.contains('on')) { trilha.classList.add('on'); world.resize(); }
      desenharTrilha();
    }
    refazerMapa();
    sincronizarTabuleiro();
    world.tokens.sync(G.cls ? Math.max(0, G.vida) : 0, Math.min(G.ouro, 40));
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
  const rumo = pistaAgora() ? `${pistaAgora()}.` : '';

  const missao = G.trama ? `<section><h3>Missão</h3><p class="missao">${fmt(OBJETIVOS[G.trama.objetivo].titulo)}</p><p class="pequeno"><b>Agora:</b> ${objetivoAgora()}.</p><p class="pequeno">Dia ${G.dia} de ${G.prazo}. Pistas: ${G.pistas} de ${PISTAS_PRECISAS}.${pressao() ? ` O tempo aperta: +${pressao()} em todos os testes.` : ''}</p></section>` : '';

  $('painel-corpo').innerHTML = `
    <header><h2>${pele}</h2><p>Nível ${G.nivel}${prox !== null ? ` · ${G.xp}/${prox} XP` : ' · nível máximo'} · CA ${caJogador()}</p><div class="barra"><i style="width:${barra}%"></i></div></header>
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

async function main() {
  try {
    await Promise.all(['40px "Cinzel"', '600 40px "Cinzel"', '700 40px "Cinzel"', '40px "EB Garamond"', 'italic 40px "EB Garamond"'].map(f => document.fonts.load(f, 'Áçã')));
  } catch (e) { /* sem fontes, usa Georgia */ }

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
    world.resize();
    if (maoAtual) { const alvos = maoAtual.zona(); maoAtual.cards.forEach((c, i) => world.fly(c, alvos[i], .2, { arc: 0 })); }
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
  $('mute').addEventListener('click', e => {
    const m = sfx.toggle();
    e.target.textContent = m ? 'Som: não' : 'Som: sim';
  });
  $('lore').addEventListener('click', () => $('lore').classList.remove('on'));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { $('lore').classList.remove('on'); $('painel').classList.remove('on'); }
    if (e.key === 'c' || e.key === 'C') $('painel').classList.toggle('on');
  });
  $('painel-corpo').addEventListener('click', e => {
    const id = e.target.dataset && e.target.dataset.usar;
    if (id && usarItem(id)) { sfx.coin(); ui.sync(); }
  });

  await new Promise(resolve => $('start').addEventListener('click', resolve, { once: true }));
  pedirEcraInteiro();
  await perguntarPrimeiraVez();
  sfx.card();
  musica.ligar();
  $('title').classList.remove('on');
  novoEstado();
  ui.sync();
  await partida(ui);
}

main();
