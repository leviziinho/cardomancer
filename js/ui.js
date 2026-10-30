// Liga a partida à mesa 3D e ao painel lateral.

const $ = id => document.getElementById(id);
let world;

const SLOT_SCALE = .64;
let slotsUsed = 0;
let cartaSelada = null;
let cartaMissao = null;
let paginaAtual = {};

function slotPos() {
  const i = slotsUsed++;
  return { pos: [AREA.draft.x - 6.2 + i * 2.48, .04 + i * .002, 5.5], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .012], scale: SLOT_SCALE };
}

function termosDe(texto) {
  return Object.keys(LORE).filter(k => texto.includes(LORE[k].nome)).map(k => ({ nome: LORE[k].nome, id: k }));
}

function abrirLore(titulo, texto) {
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

  dados: lista => world.rollDice(lista),
  camara: (nome, dur) => world.shot(nome, dur),

  async livro(p) {
    paginaAtual = p;
    await world.book.turn({ ...p, termos: termosDe(p.texto || '') });
  },

  mapa(destaque, suspeitos) {
    world.updateMap(G.visitados, destaque, suspeitos);
  },

  async andar(trajeto) {
    await world.shot('map', .9);
    await world.movePin(trajeto);
    await wait(.35);
  },

  async draft(titulo, sub, specs) {
    ui.prompt(titulo, sub);
    const xs = [-5.3, 0, 5.3];
    const cards = specs.map(s => world.createCard(s));
    cards.forEach((c, i) => { c.hoverScale = .1; c.hoverLift = 1.1; window.setTimeout(sfx.card, i * 170); });
    await Promise.all(cards.map((c, i) => world.fly(c, { pos: [AREA.draft.x + xs[i], 1.5, -1.4], rot: [TILT, 0, 0], scale: 1.38 }, .8, { delay: i * .17, arc: 3 })));
    const idx = await world.choose(cards);
    await Promise.all(cards.map((c, i) => {
      if (i === idx) return world.fly(c, slotPos(), .7, { arc: 2 });
      return world.fly(c, { pos: [AREA.draft.x + 9.2, .9, -.8], rot: [FACE_DOWN, 0, 0], scale: 1 }, .55, { arc: 2 }).then(() => world.removeCard(c));
    }));
    cards[idx].inspectable = true;
    cards[idx].hoverScale = 1.1; cards[idx].hoverLift = 3;
    ui.prompt('');
    return idx;
  },

  // Dá as cartas para a mão e devolve o índice da escolhida.
  async escolha(specs, { onde } = {}) {
    const noMapa = onde === 'mapa';
    const n = specs.length, gap = 3.82;
    const origem = noMapa ? [AREA.map.x + 11, 1, 10] : [14, 1, 8];
    const cards = specs.map(s => world.createCard(s, { at: origem }));
    cards.forEach((c, i) => { c.hoverScale = noMapa ? .22 : .3; c.hoverLift = 2.2; window.setTimeout(sfx.card, i * 140); });
    await Promise.all(cards.map((c, i) => world.fly(c, {
      pos: noMapa ? [AREA.map.x + (i - (n - 1) / 2) * gap, 1.2, 7.6] : [(i - (n - 1) / 2) * gap, 1.15, 3.4],
      rot: [noMapa ? -1.08 : TILT, 0, 0], scale: noMapa ? .86 : 1.03,
    }, .7, { delay: i * .14, arc: 2 })));
    const idx = await world.choose(cards);
    await Promise.all(cards.map(c => world.fly(c, { pos: origem, rot: [FACE_DOWN, 0, 0], scale: .8 }, .45, { arc: 1 }).then(() => world.removeCard(c))));
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
    await world.fly(cartaMissao, { pos: [AREA.draft.x - 3, 1.6, -1.2], rot: [TILT, 0, 0], scale: 1.38 }, .9, { arc: 3 });

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
    await world.fly(cartaSelada, { pos: [AREA.draft.x + 3, 1.6, -1.2], rot: [FACE_DOWN, 0, 0], scale: 1.38 }, .9, { arc: 3 });
    await wait(.5);

    ui.prompt('A sua missão', 'Há uma parte que continua selada. Clique na missão para a aceitar.');
    cartaMissao.hoverScale = .1; cartaMissao.hoverLift = 1.1;
    await world.choose([cartaMissao]);
    ui.prompt('');
    const vai = world.shot('reading', 1.6);
    await Promise.all([
      world.fly(cartaMissao, { pos: [8.7, .05, -4.2], rot: [FACE_UP, 0, -.05], scale: .56 }, 1.2, { arc: 3 }),
      world.fly(cartaSelada, { pos: [8.7, .05, -.9], rot: [FACE_DOWN, 0, .07], scale: .56 }, 1.2, { arc: 3 }),
    ]);
    cartaMissao.inspectable = true; cartaMissao.hoverScale = 1.4; cartaMissao.hoverLift = 4;
    await vai;
  },

  async revelar() {
    ui.prompt('O selo quebra-se', 'Agora sabe o que esteve sempre em jogo. Clique na carta para continuar.');
    sfx.card();
    await world.fly(cartaSelada, { pos: [0, 3, 1], rot: [TILT, 0, 0], scale: 1.75 }, 1.2, { arc: 2 });
    await wait(.6);
    await world.choose([cartaSelada]);
    ui.prompt('');
    await world.fly(cartaSelada, { pos: [8.7, .05, -.9], rot: [FACE_UP, 0, .07], scale: .56 }, .8, { arc: 2 });
  },

  async fim(titulo, texto, bom, verdade) {
    // A partida pode acabar em viagem, com a câmara ainda sobre o mapa.
    await world.shot('reading', 1);
    if (cartaSelada && cartaSelada.group.rotation.x > 0) await ui.revelar();
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
    $('r-vida').textContent = G.cls ? `${G.vida}/${max}` : '-';
    $('r-ouro').textContent = G.ouro;
    $('r-dia').textContent = G.trama ? `${G.dia}/${G.prazo}` : '-';
    $('r-pistas').textContent = G.trama ? `${G.pistas}/${PISTAS_PRECISAS}` : '-';
    $('r-nivel').textContent = G.nivel;
    $('rail').classList.toggle('pressa', !!G.trama && pressao() > 0);
    world.tokens.sync(G.cls ? G.vida : 0, Math.min(G.ouro, 40), G.pistas);
    desenharPainel();
  },
};

function linhaItem(rotulo, id, extra = '') {
  if (!id) return `<li class="slot vazio"><span class="rotulo">${rotulo}</span><span class="nome">Vazio</span></li>`;
  const it = ITENS[id];
  return `<li class="slot"><span class="rotulo">${rotulo}</span><span class="nome">${it.nome}${extra}</span><span class="desc">${it.desc}</span></li>`;
}

function desenharPainel() {
  if (!G.cls) { $('painel-corpo').innerHTML = '<p class="vazio">Por decidir. O baralho ainda está a escolher.</p>'; return; }
  const pele = [CLASSES[G.cls].nome, G.raca && RACAS[G.raca].nome, G.bg && ANTECEDENTES[G.bg].nome].filter(Boolean).join(' · ');
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
    ? G.aliados.map(id => `<li class="slot"><span class="nome">${ALIADOS[id].nome}</span><span class="desc">${ALIADOS[id].desc}</span></li>`).join('')
    : '<li class="slot vazio"><span class="nome">Viaja sozinho, por agora.</span></li>';

  const missao = G.trama ? `<section><h3>Missão</h3><p class="missao">${fmt(OBJETIVOS[G.trama.objetivo].titulo)}</p><p class="pequeno">Dia ${G.dia} de ${G.prazo}. Pistas: ${G.pistas} de ${PISTAS_PRECISAS}.${pressao() ? ` O tempo aperta: +${pressao()} em todos os testes.` : ''}</p></section>` : '';

  $('painel-corpo').innerHTML = `
    <header><h2>${pele}</h2><p>Nível ${G.nivel}${prox !== null ? ` · ${G.xp}/${prox} XP` : ' · nível máximo'}</p><div class="barra"><i style="width:${barra}%"></i></div></header>
    ${missao}
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

let peeking = null;
let peekReturn = 'reading';
function peek(name) {
  if (peeking === name) {
    peeking = null;
    world.shot(peekReturn, .8);
    return;
  }
  if (!peeking) peekReturn = world.cam.name;
  peeking = name;
  world.shot(name, .8);
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

  world.book.showFirst({
    capitulo: 'Cardomancer', titulo: 'O Livro das Partidas', arte: 'ruina',
    texto: 'Ninguém escolhe o seu destino por inteiro. O baralho dá-lhe três caminhos e você fica com um.\n\nUma carta, porém, fica selada até ao fim.',
  });
  world.updateMap([], []);

  world.handlers.link = l => {
    if (l.id === 'cena') abrirLore(paginaAtual.titulo, paginaAtual.fundo);
    else abrirLore(LORE[l.id].titulo, LORE[l.id].texto);
    sfx.page();
  };

  $('loading').classList.remove('on');
  $('title').classList.add('on');

  $('peek-map').addEventListener('click', () => peek('map'));
  $('peek-mesa').addEventListener('click', () => peek('draft'));
  $('abrir-painel').addEventListener('click', () => $('painel').classList.toggle('on'));
  $('fechar-painel').addEventListener('click', () => $('painel').classList.remove('on'));
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
  sfx.card();
  $('title').classList.remove('on');
  novoEstado();
  ui.sync();
  await partida(ui);
}

main();
