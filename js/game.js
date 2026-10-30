// As regras: o draft inicial, a trama secreta e o ciclo de cena, escolha e viagem.

const ROMANOS = ['Prólogo', 'Capítulo I', 'Capítulo II', 'Capítulo III', 'Capítulo IV', 'Capítulo Final'];
const TERRENOS = {
  cidade: { nome: 'Cidade', glyph: 'tower', desc: 'Ruas cheias, ouvidos atentos.' },
  floresta: { nome: 'Floresta', glyph: 'leaf', desc: 'Sombra densa e trilhos que mudam.' },
  estrada: { nome: 'Estrada', glyph: 'sign', desc: 'Caminho aberto, mas nunca vazio.' },
  montanha: { nome: 'Montanha', glyph: 'crown', desc: 'Ar frio e quedas longas.' },
  pantano: { nome: 'Pântano', glyph: 'flame', desc: 'O chão engana, as luzes também.' },
  ruina: { nome: 'Ruínas', glyph: 'tower', desc: 'O passado ainda tem dentes.' },
  costa: { nome: 'Costa', glyph: 'moon', desc: 'A maré não pede licença.' },
};

const GLYPH_RACA = { humano: 'speech', elfo: 'leaf', anao: 'hammer', halfling: 'feather', meioorc: 'axe', tiefling: 'flame' };
const GLYPH_BG = { soldado: 'dagger', erudito: 'scroll', criminoso: 'lock', nobre: 'crown', eremita: 'moon', marinheiro: 'sign' };
const GLYPH_ITEM = { corda: 'sign', lanterna: 'flame', pocao: 'sun', amuleto: 'seal', mapa: 'scroll', espada: 'dagger', capa: 'feather', diario: 'eye', anel: 'crown' };

const G = {
  cls: null, bg: null, raca: null, itens: [], cidade: null, trama: null,
  vida: 0, vidaMax: 0, ouro: 0, pistas: 0,
  lugar: null, visitados: [], vistos: new Set(), pocaoUsada: false,
};

const $ = id => document.getElementById(id);
const pick = (obj, n) => Object.keys(obj).sort(() => Math.random() - .5).slice(0, n);
const shuffled = arr => [...arr].sort(() => Math.random() - .5);
const roll = () => 1 + Math.floor(Math.random() * 6);
let world;

function attr(a) {
  let v = 0;
  const add = o => { if (o && o.attrs && o.attrs[a]) v += o.attrs[a]; };
  add(CLASSES[G.cls]); add(ANTECEDENTES[G.bg]); add(RACAS[G.raca]);
  G.itens.forEach(i => add(EQUIPAMENTOS[i]));
  return v;
}

function prompt(title, sub = '') {
  $('prompt-title').textContent = title;
  $('prompt-sub').textContent = sub;
  $('prompt').classList.toggle('on', !!title);
}

function toast(text, good) {
  const t = $('toast');
  t.textContent = text;
  t.className = 'on ' + (good ? 'good' : 'bad');
}
const hideToast = () => { $('toast').className = ''; };

function updateHud() {
  $('hud').classList.add('on');
  const parts = [G.cls && CLASSES[G.cls].nome, G.raca && RACAS[G.raca].nome, G.bg && ANTECEDENTES[G.bg].nome].filter(Boolean);
  $('hud-name').textContent = parts.join(' · ') || 'Por decidir';
  $('hud-vida').textContent = `${G.vida}/${G.vidaMax}`;
  $('hud-ouro').textContent = G.ouro;
  $('hud-pistas').textContent = G.pistas;
  $('hud-attrs').textContent = Object.keys(ATTR).map(a => `${ATTR[a].nome} ${attr(a) >= 0 ? '+' : ''}${attr(a)}`).join('  ·  ');
  world.tokens.sync(Math.max(0, G.vida), Math.min(G.ouro, 40), G.pistas);
}

// ---------- Draft ----------

const SLOT_SCALE = .64;
let slotsUsed = 0;

function slotPos() {
  const i = slotsUsed++;
  return { pos: [AREA.draft.x - 6.2 + i * 2.48, .04 + i * .002, 5.5], rot: [FACE_UP, 0, (i % 2 ? -1 : 1) * .012], scale: SLOT_SCALE };
}

async function draftStage(title, sub, keys, makeSpec) {
  prompt(title, sub);
  const xs = keys.length === 3 ? [-5.3, 0, 5.3] : keys.map((_, i) => (i - (keys.length - 1) / 2) * 5.3);
  const cards = keys.map(k => world.createCard(makeSpec(k)));
  cards.forEach(c => { c.hoverScale = .1; c.hoverLift = 1.1; });
  cards.forEach((c, i) => { window.setTimeout(sfx.card, i * 170); });
  await Promise.all(cards.map((c, i) => world.fly(c, { pos: [AREA.draft.x + xs[i], 1.5, -1.4], rot: [TILT, 0, 0], scale: 1.38 }, .8, { delay: i * .17, arc: 3 })));

  const idx = await world.choose(cards);
  const key = keys[idx];
  const chosen = cards[idx];
  await Promise.all(cards.map((c, i) => {
    if (i === idx) return world.fly(c, slotPos(), .7, { arc: 2 });
    return world.fly(c, { pos: [AREA.draft.x + 9.2, .9, -.8], rot: [FACE_DOWN, 0, 0], scale: 1 }, .55, { arc: 2 }).then(() => world.removeCard(c));
  }));
  chosen.inspectable = true;
  chosen.hoverScale = 1.1; chosen.hoverLift = 3;
  return key;
}

const applyPerk = o => {
  G.vidaMax += o.vida || 0;
  G.vida += o.vida || 0;
  G.ouro += o.ouro || 0;
  G.pistas += o.pista || 0;
};

async function runDraft() {
  await world.shot('draft', 1.8);

  const cls = await draftStage('Escolha a sua classe', 'O baralho oferece três. As outras voltam ao monte.', pick(CLASSES, 3), k => ({
    tema: 'classe', titulo: CLASSES[k].nome, glyph: CLASSES[k].glyph, desc: CLASSES[k].desc,
    rodape: `Vida ${CLASSES[k].vida}`, rodapeGlyph: 'sun',
  }));
  G.cls = cls; G.vidaMax = CLASSES[cls].vida; G.vida = G.vidaMax; updateHud();

  G.bg = await draftStage('Escolha o seu antecedente', 'De onde você vem muda o que consegue fazer.', pick(ANTECEDENTES, 3), k => ({
    tema: 'antecedente', titulo: ANTECEDENTES[k].nome, glyph: GLYPH_BG[k], desc: ANTECEDENTES[k].desc,
  }));
  applyPerk(ANTECEDENTES[G.bg]); updateHud();

  G.raca = await draftStage('Escolha a sua raça', 'Algumas portas só se abrem para certos povos.', pick(RACAS, 3), k => ({
    tema: 'raca', titulo: RACAS[k].nome, glyph: GLYPH_RACA[k], desc: RACAS[k].desc,
  }));
  applyPerk(RACAS[G.raca]); updateHud();

  const itens = pick(EQUIPAMENTOS, 6);
  for (let n = 0; n < 2; n++) {
    const it = await draftStage(`Escolha o equipamento (${n + 1} de 2)`, 'Só leva o que couber na mochila.', itens.slice(n * 3, n * 3 + 3), k => ({
      tema: 'equipamento', titulo: EQUIPAMENTOS[k].nome, glyph: GLYPH_ITEM[k], desc: EQUIPAMENTOS[k].desc,
    }));
    G.itens.push(it);
    applyPerk(EQUIPAMENTOS[it]); updateHud();
  }

  const cidades = shuffled(Object.keys(LUGARES).filter(k => LUGARES[k].cidade)).slice(0, 3);
  G.cidade = await draftStage('Escolha a cidade de partida', 'É daqui que a história vai começar.', cidades, k => ({
    tema: 'cidade', titulo: LUGARES[k].nome, glyph: 'tower', desc: LUGARES[k].desc,
  }));
  G.lugar = G.cidade;
  G.visitados = [G.cidade];
  G.ouro += 2;
  updateHud();
}

// ---------- Trama secreta ----------

let fateCard = null;
const FATE_POS = { pos: [8.7, .05, -2.2], rot: [FACE_DOWN, 0, .07], scale: .62 };

async function drawSecretPlot() {
  G.trama = pick(TRAMAS, 1)[0];
  const t = TRAMAS[G.trama];
  prompt('O destino escolhe em segredo', 'Uma carta selada: a sua verdadeira missão. Só será aberta no fim.');
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
  fateCard = world.createCard({
    tema: 'destino', etiqueta: 'Trama Secreta', titulo: t.nome, glyph: t.glyph, desc: t.resumo,
  }, { back: backC });
  sfx.card();
  await world.fly(fateCard, { pos: [AREA.draft.x, 2.2, -1.4], rot: [FACE_DOWN, 0, 0], scale: 1.4 }, .9, { arc: 3 });
  await wait(1.5);
  prompt('');
  const toBook = world.shot('reading', 1.6);
  await world.fly(fateCard, FATE_POS, 1.2, { arc: 3 });
  await toBook;
  fateCard.inspectable = false;
}

// ---------- Cenas ----------

function reqOk(o) {
  const r = o.req;
  if (r) {
    if (r.cls && r.cls !== G.cls) return false;
    if (r.raca && r.raca !== G.raca) return false;
    if (r.bg && r.bg !== G.bg) return false;
    if (r.item && !G.itens.includes(r.item)) return false;
    if (r.pistas && G.pistas < r.pistas) return false;
  }
  const cost = o.ok && o.ok.fx && o.ok.fx.ouro < 0 && !o.roll ? -o.ok.fx.ouro : 0;
  return G.ouro >= cost;
}

function reqLabel(o) {
  const r = o.req;
  if (!r) return { etiqueta: 'Escolha', glyph: o.roll ? ATTR[o.roll.a].glyph : 'sign', lock: 'Ouro insuficiente' };
  if (r.cls) return { etiqueta: `Só ${CLASSES[r.cls].nome}`, glyph: CLASSES[r.cls].glyph, lock: `Só ${CLASSES[r.cls].nome}` };
  if (r.raca) return { etiqueta: `Só ${RACAS[r.raca].nome}`, glyph: GLYPH_RACA[r.raca], lock: `Só ${RACAS[r.raca].nome}` };
  if (r.bg) return { etiqueta: ANTECEDENTES[r.bg].nome, glyph: GLYPH_BG[r.bg], lock: `Só ${ANTECEDENTES[r.bg].nome}` };
  if (r.item) return { etiqueta: EQUIPAMENTOS[r.item].nome, glyph: GLYPH_ITEM[r.item], lock: `Precisa de ${EQUIPAMENTOS[r.item].nome}` };
  return { etiqueta: `${r.pistas} Pistas`, glyph: 'eye', lock: `Precisa de ${r.pistas} Pistas` };
}

function dcOf(o, isFinal) {
  return o.roll.dc - (isFinal ? Math.min(G.pistas, 3) : 0);
}

function optionSpec(o, isFinal) {
  const ok = reqOk(o), lbl = reqLabel(o);
  let rodape, rodapeGlyph;
  if (o.roll) {
    const b = attr(o.roll.a);
    rodape = `${ATTR[o.roll.a].nome} ${b >= 0 ? '+' : ''}${b} · precisa de ${dcOf(o, isFinal)}+`;
    rodapeGlyph = ATTR[o.roll.a].glyph;
  } else {
    rodape = o.req ? 'Sucesso garantido' : 'Sem dados';
  }
  return {
    tema: o.req ? 'especial' : 'escolha', etiqueta: lbl.etiqueta, titulo: o.t, desc: o.d,
    glyph: lbl.glyph, rodape, rodapeGlyph, locked: !ok, lockText: lbl.lock,
  };
}

// Mostra sempre o que pode fazer e até dois vislumbres do que outra pessoa poderia.
function chooseOptions(list) {
  const avail = list.filter(reqOk);
  const locked = list.filter(o => !reqOk(o) && o.req);
  const shown = [...avail.slice(0, 4)];
  for (const o of shuffled(locked)) { if (shown.length < 4 && shown.filter(s => !reqOk(s)).length < 2) shown.push(o); }
  return list.filter(o => shown.includes(o));
}

function dealHand(specs) {
  const n = specs.length;
  const gap = 3.82;
  const cards = specs.map(s => world.createCard(s, { at: [14, 1, 8] }));
  cards.forEach((c, i) => {
    c.hoverScale = .3; c.hoverLift = 2.2;
    window.setTimeout(sfx.card, i * 140);
  });
  const p = Promise.all(cards.map((c, i) => world.fly(c, { pos: [(i - (n - 1) / 2) * gap, 1.15, 3.4], rot: [TILT, 0, 0], scale: 1.03 }, .7, { delay: i * .14, arc: 2 })));
  return { cards, ready: p };
}

function discardHand(cards, keep = -1) {
  return Promise.all(cards.map((c, i) => {
    if (i === keep) return Promise.resolve();
    return world.fly(c, { pos: [14, 1, 8], rot: [FACE_DOWN, 0, 0], scale: .8 }, .45, { arc: 1 }).then(() => world.removeCard(c));
  }));
}

async function continueCard(label = 'Continuar', desc = 'Virar a página.') {
  const { cards, ready } = dealHand([{ tema: 'escolha', etiqueta: 'Seguir', titulo: label, desc, glyph: 'sign' }]);
  await ready;
  await world.choose(cards);
  await discardHand(cards);
}

function fxText(fx = {}) {
  const parts = [];
  const f = (v, n) => { if (v) parts.push(`${v > 0 ? '+' : ''}${v} ${n}`); };
  f(fx.vida, 'Vida'); f(fx.ouro, 'Ouro'); f(fx.pista, fx.pista === 1 ? 'Pista' : 'Pistas');
  return parts.join('  ·  ');
}

function applyFx(fx = {}) {
  G.vida = Math.max(0, Math.min(G.vidaMax, G.vida + (fx.vida || 0)));
  G.ouro = Math.max(0, G.ouro + (fx.ouro || 0));
  G.pistas += fx.pista || 0;
  if ((fx.vida || 0) < 0) sfx.hit();
  if ((fx.ouro || 0) > 0) sfx.coin();
  let extra = '';
  if (G.vida <= 0 && G.itens.includes('pocao') && !G.pocaoUsada) {
    G.pocaoUsada = true;
    G.vida = 5;
    extra = '\n\nA Poção de Cura salva-lhe a vida no último instante.';
  }
  updateHud();
  return extra;
}

// Resolve uma opção, com dados se os houver. Devolve { res, bom }.
async function resolveOption(o, isFinal) {
  if (!o.roll) return { res: o.ok, bom: true };
  const a = roll(), b = roll(), bonus = attr(o.roll.a), dc = dcOf(o, isFinal);
  await world.rollDice(a, b);
  const total = a + b + bonus, good = total >= dc;
  toast(`${a} + ${b} ${bonus >= 0 ? '+' : '-'} ${Math.abs(bonus)} = ${total}, contra ${dc}: ${good ? 'Êxito' : 'Revés'}`, good);
  await wait(1.5);
  world.hideDice();
  hideToast();
  return { res: good ? o.ok : o.ko, bom: good, detalhe: `${a}+${b}${bonus >= 0 ? '+' : ''}${bonus} = ${total} contra ${dc}` };
}

async function playScene(sc, capitulo, arte, isFinal = false) {
  const texto = sc.texto.replace('{cidade}', LUGARES[G.cidade].nome);
  await world.book.turn({ capitulo, titulo: sc.titulo, arte, texto });
  const shown = chooseOptions(sc.opcoes);
  const { cards, ready } = dealHand(shown.map(o => optionSpec(o, isFinal)));
  await ready;
  const idx = await world.choose(cards);
  await discardHand(cards);
  const o = shown[idx];
  const { res, bom, detalhe } = await resolveOption(o, isFinal);
  const extra = applyFx(res.fx);
  await world.book.turn({
    capitulo, titulo: o.t, arte,
    texto: res.txt + extra,
    banner: res.fim ? (res.fim === 'vitoria' ? 'Vitória' : 'Derrota') : (bom ? 'Êxito' : 'Revés'),
    bannerBom: res.fim ? res.fim === 'vitoria' : bom,
    rodape: fxText(res.fx) || detalhe || '',
  });
  return res;
}

function chooseNeighbours() {
  const links = [];
  for (const [a, b] of ESTRADAS) {
    if (a === G.lugar) links.push(b);
    if (b === G.lugar) links.push(a);
  }
  const destino = TRAMAS[G.trama].destino;
  const fresh = links.filter(k => !G.visitados.includes(k) && k !== destino);
  const list = fresh.length ? fresh : links.filter(k => k !== destino);
  return shuffled(list.length ? list : links).slice(0, 3);
}

function pathTo(from, to) {
  const prev = { [from]: null }, queue = [from];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === to) break;
    for (const [a, b] of ESTRADAS) {
      const n = a === cur ? b : b === cur ? a : null;
      if (n && !(n in prev)) { prev[n] = cur; queue.push(n); }
    }
  }
  const path = [];
  for (let k = to; k; k = prev[k]) path.unshift(k);
  return path;
}

async function travelChoice() {
  const options = chooseNeighbours();
  world.updateMap(G.visitados, options);
  await world.shot('mapChoice', 1.3);
  prompt('Para onde seguir?', 'Cada caminho esconde perigos diferentes.');
  const specs = options.map(k => {
    const t = TERRENOS[LUGARES[k].terreno];
    return { tema: 'cidade', etiqueta: t.nome, titulo: LUGARES[k].nome, glyph: t.glyph, desc: t.desc };
  });
  const n = specs.length;
  const cards = specs.map(s => world.createCard(s, { at: [AREA.map.x + 11, 1, 10] }));
  cards.forEach((c, i) => { c.hoverScale = .22; c.hoverLift = 2; window.setTimeout(sfx.card, i * 140); });
  await Promise.all(cards.map((c, i) => world.fly(c, {
    pos: [AREA.map.x + (i - (n - 1) / 2) * 3.8, 1.2, 7.6], rot: [-1.08, 0, 0], scale: .86,
  }, .7, { delay: i * .14, arc: 2 })));
  const idx = await world.choose(cards);
  prompt('');
  await Promise.all(cards.map(c => world.fly(c, { pos: [AREA.map.x + 11, 1, 10], rot: [FACE_DOWN, 0, 0], scale: .7 }, .45, { arc: 1 }).then(() => world.removeCard(c))));
  await walkTo([G.lugar, options[idx]]);
}

async function walkTo(path) {
  await world.shot('map', .9);
  await world.movePin(path);
  path.slice(1).forEach(k => { if (G.visitados[G.visitados.length - 1] !== k) G.visitados.push(k); });
  G.lugar = path[path.length - 1];
  world.updateMap(G.visitados, []);
  await wait(.45);
  await world.shot('reading', 1.1);
}

function nextEncounter(terreno) {
  const pool = ENCONTROS.filter(e => !G.vistos.has(e.id));
  const same = pool.filter(e => e.terreno === terreno);
  const list = same.length ? same : pool;
  const e = list[Math.floor(Math.random() * list.length)];
  G.vistos.add(e.id);
  return e;
}

async function revealFate() {
  prompt('O selo quebra-se', 'Agora sabe o que esteve sempre em jogo. Clique na carta para continuar.');
  sfx.card();
  await world.fly(fateCard, { pos: [0, 3, 1], rot: [TILT, 0, 0], scale: 1.75 }, 1.2, { arc: 2 });
  await wait(.6);
  fateCard.enabled = true;
  await world.choose([fateCard]);
  fateCard.enabled = false;
  prompt('');
  await world.fly(fateCard, { pos: [8.7, .05, -2.2], rot: [FACE_UP, 0, .07], scale: .62 }, .8, { arc: 2 });
}

async function endGame(titulo, texto, bom, sumario) {
  await world.book.turn({
    capitulo: bom ? 'Epílogo' : 'O fim',
    titulo, arte: LUGARES[G.lugar].terreno,
    texto: `${texto}\n\n${sumario}`,
    banner: bom ? 'Missão cumprida' : 'Missão perdida', bannerBom: bom,
  });
  const { cards, ready } = dealHand([{ tema: 'classe', etiqueta: 'Nova Partida', titulo: 'Baralhar de Novo', desc: 'Novas cartas, nova trama, outro herói.', glyph: 'eye' }]);
  await ready;
  await world.choose(cards);
  location.reload();
}

async function deathCheck() {
  if (G.vida > 0) return false;
  prompt('');
  await revealFate();
  await endGame(FIM_MORTE.titulo, FIM_MORTE.texto, false, `A trama por trás de tudo era "${TRAMAS[G.trama].nome}": ${TRAMAS[G.trama].resumo}`);
  return true;
}

// ---------- A aventura ----------

async function runAdventure() {
  const t = TRAMAS[G.trama];
  world.pin.position.copy(world.mapToWorld(G.lugar));
  world.pin.visible = true;
  world.updateMap(G.visitados, []);

  const steps = [
    { tipo: 'gancho' },
    { tipo: 'encontro' },
    { tipo: 'pista', cena: t.pista1 },
    { tipo: 'encontro' },
    { tipo: 'pista', cena: t.pista2 },
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (i > 0) await travelChoice();
    const terreno = LUGARES[G.lugar].terreno;
    const cena = s.tipo === 'gancho' ? GANCHO : s.tipo === 'pista' ? s.cena : nextEncounter(terreno);
    await playScene(cena, ROMANOS[i], cena.terreno || terreno);
    if (await deathCheck()) return;
    await continueCard();
  }

  // Última viagem: o jogo leva o pino até ao verdadeiro destino.
  const caminho = pathTo(G.lugar, t.destino);
  prompt('Os sinais apontam num só sentido', `Tudo leva a ${LUGARES[t.destino].nome}.`);
  await wait(1.2);
  world.updateMap(G.visitados, [t.destino]);
  await walkTo(caminho);
  prompt('');
  await revealFate();

  const fim = await playScene(t.final, ROMANOS[5], LUGARES[t.destino].terreno, true);
  const venceu = fim.fim === 'vitoria';
  await continueCard('O Fim', 'Fechar esta história.');
  await endGame(
    venceu ? 'Vitória' : 'Derrota',
    venceu ? `${t.nome}: a ameaça terminou aqui, e poucos saberão a quem agradecer.` : `${t.nome}: a ameaça venceu, e agora o mundo vai sentir o preço.`,
    venceu,
    `${CLASSES[G.cls].nome} ${RACAS[G.raca].nome}, ${ANTECEDENTES[G.bg].nome}. Terminou com ${G.ouro} de Ouro e ${G.pistas} Pistas.`
  );
}

// ---------- Arranque ----------

async function main() {
  try {
    await Promise.all(['40px "Cinzel"', '600 40px "Cinzel"', '700 40px "Cinzel"', '40px "EB Garamond"', 'italic 40px "EB Garamond"'].map(f => document.fonts.load(f, 'Áçã')));
  } catch (e) { /* sem fontes, usa Georgia */ }

  if (typeof THREE === 'undefined') {
    $('title-sub').textContent = 'Não foi possível carregar o motor 3D. Verifique a ligação à Internet e abra de novo.';
    return;
  }

  world = createWorld($('view'));
  window.CARDO = { G, world };

  world.book.showFirst({
    capitulo: 'Cardomancer', titulo: 'O Livro das Partidas', arte: 'ruina',
    texto: 'Ninguém escolhe o seu destino por inteiro. O baralho dá-lhe três caminhos e você fica com um.\n\nUma carta, porém, fica selada até ao fim.',
  });
  world.updateMap([], []);

  $('loading').classList.remove('on');
  $('title').classList.add('on');

  $('peek-map').addEventListener('click', () => peek('map'));
  $('peek-sheet').addEventListener('click', () => peek('draft'));
  $('mute').addEventListener('click', e => {
    const m = sfx.toggle();
    e.target.textContent = m ? 'Som: não' : 'Som: sim';
  });

  await new Promise(resolve => $('start').addEventListener('click', resolve, { once: true }));
  sfx.card();
  $('title').classList.remove('on');
  updateHud();

  await runDraft();
  await drawSecretPlot();
  await runAdventure();
}

// Espreitar o mapa ou a ficha sem interromper a escolha atual.
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

main();
