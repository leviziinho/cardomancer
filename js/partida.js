// O desenrolar de uma partida. Só fala com o jogador através do objeto "ui",
// para poder correr no navegador (ui.js) ou em milhares de simulações (tools/sim.js).

const pct = v => `${Math.round(v * 100)}%`;
const sinal = v => `${v >= 0 ? '+' : ''}${v}`;

function especItem(id, extra = {}) {
  const it = ITENS[id];
  const nomes = { arma: 'Arma', armadura: 'Armadura', acessorio: 'Acessório', mochila: 'Mochila' };
  return { tema: G.melhorias[id] ? 'rara' : 'equipamento', etiqueta: nomes[it.slot], titulo: nomeItem(id), glyph: it.glyph, desc: descItem(id), itemId: id, ...extra };
}

function rotuloReq(req) {
  if (req.cls) return { etiqueta: `Só ${CLASSES[req.cls].nome}`, glyph: CLASSES[req.cls].glyph };
  if (req.raca) return { etiqueta: `Só ${RACAS[req.raca].nome}`, glyph: RACAS[req.raca].glyph };
  if (req.bg) return { etiqueta: ANTECEDENTES[req.bg].nome, glyph: ANTECEDENTES[req.bg].glyph };
  if (req.item) return { etiqueta: ITENS[req.item].nome, glyph: ITENS[req.item].glyph };
  return { etiqueta: 'Especial', glyph: 'eye' };
}

function textoGanho(o) {
  const fx = (o.ok && o.ok.fx) || {}, ko = (o.ko && o.ko.fx) || {};
  if (o.roll && o.roll.pv && o.tipo === 'combate') {
    return G.rastro ? 'Combate à vez  ·  Fragmento de pista' : 'Combate à vez';
  }
  const bom = [];
  if (o.rasto) bom.push('Fragmento de pista');
  if (fx.aliado) bom.push('Aliado');
  if (fx.item) bom.push('Objeto');
  if (fx.mercado) bom.push('Mercado');
  if (fx.ouro > 0) bom.push('Ouro');
  if (fx.vida > 0) bom.push('Vida');
  if (fx.xp > 2) bom.push('XP');
  if (fx.dia < 0) bom.push('Tempo');
  const mau = [];
  if (fx.ouro < 0) mau.push(`${-fx.ouro} Ouro`);
  if (fx.dia > 0) mau.push(`${fx.dia} dia`);
  if (ko.vida < 0) mau.push('Vida');
  if (ko.dia > 0 && !fx.dia) mau.push('tempo');
  const partes = [];
  if (bom.length) partes.push(bom.join(', '));
  if (mau.length) partes.push(`custo: ${mau.join(', ')}`);
  return partes.join('  ·  ');
}

function especOpcao(o) {
  const ok = podeUsar(o);
  const tipo = o.tipo && TIPOS[o.tipo];
  const r = o.req ? rotuloReq(o.req) : null;
  let rodape, rodapeGlyph;
  if (o.tipo === 'combate' && o.roll && o.roll.pv) {
    rodape = `CA ${o.roll.dc + (o.dcExtra || 0)}  ·  ${pvDoInimigo(o)} PV`;
    rodapeGlyph = 'shield';
  } else if (o.roll) {
    const a = atributoDe(o);
    rodape = `${ATTR[a].nome} ${sinal(bonusDe(o))}  ·  ${dcDe(o)}+  ·  ${pct(chanceDe(o))}`;
    rodapeGlyph = ATTR[a].glyph;
  } else {
    // Sucesso garantido é coisa das cartas especiais. O resto é uma escolha, com o seu preço.
    rodape = o.rara || o.req ? 'Sucesso garantido' : 'Sem teste';
  }
  const preso = !ok || !!o.bloqueada;
  return {
    tema: o.tema || (!ok ? (o.tipo || 'escolha') : o.rara ? 'rara' : (o.tipo || 'escolha')),
    etiqueta: o.etiqueta || (r ? r.etiqueta : tipo ? tipo.nome : 'Escolha'),
    titulo: fmt(o.t), desc: fmt(o.d),
    glyph: o.glyph || (r ? r.glyph : tipo ? tipo.glyph : 'sign'),
    rodape, rodapeGlyph,
    ganho: ok ? (o.ganhoTexto !== undefined ? o.ganhoTexto : textoGanho(o)) : '',
    locked: preso,
    lockText: o.bloqueada || (o.req ? r.etiqueta : 'Ouro insuficiente'),
    chance: o.roll ? chanceDe(o) : 1,
    rasto: !!o.rasto,
    fragmento: !!o.rasto,
    rara: !!o.rara,
    danoMedio: o.danoMedio || 0,
    cura: (o.m && o.m.cura) || (o.pocao ? ITENS.pocao.uso.vida : 0),
    fuga: !!(o.fugir || (o.m && o.m.fuga)),
    custo: (o.m && o.m.custo) || 0,
    apoio: !!(o.m && (o.m.escudo || o.m.enfraquece || o.m.calar)),
    entraCombate: !!(o.tipo === 'combate' && o.roll && o.roll.pv),
    vence: !!(o.m && o.m.vence),
  };
}

function resumoFx(fx = {}) {
  const partes = [];
  const add = (v, n) => { if (v) partes.push(`${sinal(v)} ${n}`); };
  add(fx.vida, 'Vida'); add(fx.ouro, 'Ouro'); add(fx.xp, 'XP');
  if (fx.dia) partes.push(`${sinal(fx.dia)} dia`);
  if (fx.prazo) partes.push(`${sinal(fx.prazo)} dias de prazo`);
  return partes.join('  ·  ');
}

// ---------- Efeitos ----------

async function aplicar(ui, fx = {}) {
  const notas = [];
  if (fx.vida) aplicarVida(fx.vida);
  if (fx.ouro) {
    const extra = fx.ouro > 0 ? talentosAtivos().reduce((s, t) => s + (t.ouroExtra || 0), 0) : 0;
    G.ouro = Math.max(0, G.ouro + fx.ouro + extra);
    if (fx.ouro > 0) ui.som('moeda');
  }
  if (fx.xp) G.xp += fx.xp;
  if (fx.dia) G.dia = Math.max(1, G.dia + fx.dia);
  if (fx.prazo) G.prazo += fx.prazo;
  if (fx.marca) G.marcas.add(fx.marca);
  if (fx.aliado && !G.aliados.includes(fx.aliado)) {
    G.aliados.push(fx.aliado);
    notas.push(`${ALIADOS[fx.aliado].nome} junta-se a si.`);
  }
  if (fx.perdeAliado && G.aliados.length) {
    const perdido = G.aliados.pop();
    notas.push(`${ALIADOS[perdido].nome} deixa de estar do seu lado.`);
  }
  if (fx.vida < 0) ui.som('golpe');
  aplicarVida(0);
  ui.sync();
  if (salvarComPocao()) {
    ui.sync();
    await ui.aviso('Ia cair, mas a Poção de Cura salva-lhe a vida no último instante. A carta fica virada na mochila.');
  }
  return notas;
}

async function receberItem(ui, id) {
  const it = ITENS[id];
  if (temItem(id)) {
    G.ouro += precoVenda(id);
    ui.sync();
    return;
  }
  if (it.slot === 'mochila') {
    if (G.mochila.length < MOCHILA_MAX) {
      G.mochila.push(id);
    } else {
      ui.prompt('A mochila está cheia', `Só cabem ${MOCHILA_MAX} objetos. O que largar vale 1/4 do preço.`);
      const opcoes = [...G.mochila, id];
      const i = await ui.escolha(opcoes.map(k => especItem(k, { rodape: `Largar: +${precoVenda(k)} Ouro` })), { ctx: 'troca' });
      ui.prompt('');
      G.ouro += precoVenda(opcoes[i]);
      if (opcoes[i] !== id) { G.mochila.splice(G.mochila.indexOf(opcoes[i]), 1); G.mochila.push(id); }
    }
  } else if (!G.equip[it.slot]) {
    G.equip[it.slot] = id;
  } else {
    const velho = G.equip[it.slot];
    ui.prompt('Só pode levar um', 'O que deixar converte-se em 1/4 do preço.');
    const i = await ui.escolha([
      especItem(velho, { etiqueta: 'Ficar com este', rodape: `Largar o outro: +${precoVenda(id)} Ouro` }),
      especItem(id, { etiqueta: 'Trocar por este', rodape: `Largar o atual: +${precoVenda(velho)} Ouro` }),
    ], { ctx: 'troca' });
    ui.prompt('');
    if (i === 0) {
      G.ouro += precoVenda(id);
    } else {
      G.ouro += precoVenda(velho);
      G.equip[it.slot] = id;
    }
  }
  aplicarVida(0);
  ui.sync();
}

async function mercado(ui, titulo = 'O Mercado') {
  let stock = baralhar(Object.keys(doMundo(ITENS)).filter(k => !temItem(k))).slice(0, 3);
  for (;;) {
    ui.prompt(titulo, `Tem ${G.ouro} de Ouro. Só leva um objeto de cada slot.`);
    const specs = stock.map(k => especItem(k, {
      rodape: `${ITENS[k].preco} Ouro`, rodapeGlyph: 'coin',
      locked: G.ouro < ITENS[k].preco, lockText: 'Ouro insuficiente', preco: ITENS[k].preco, item: k,
    }));
    const pode = melhoriasDisponiveis().length > 0;
    if (pode) specs.push({ tema: 'rara', etiqueta: 'Ferreiro', titulo: 'Aprimorar o Equipamento', desc: 'Pôr fogo na lâmina, reforçar o couro, ou o que o ouro pagar.', glyph: 'hammer', aprimorar: true });
    specs.push({ tema: 'escolha', etiqueta: 'Seguir', titulo: 'Sair do Mercado', desc: 'Guardar o que resta na bolsa.', glyph: 'sign', sair: true });
    const i = await ui.escolha(specs, { ctx: 'mercado' });
    if (specs[i].sair) break;
    if (specs[i].aprimorar) { await forja(ui); continue; }
    const id = stock[i];
    G.ouro -= ITENS[id].preco;
    G.log.comprados++;
    ui.som('moeda');
    stock = stock.filter(k => k !== id);
    ui.prompt('');
    await receberItem(ui, id);
    ui.sync();
    if (!stock.length) break;
  }
  ui.prompt('');
}

// O ferreiro: paga-se para melhorar o que já se traz no corpo.
async function forja(ui, { titulo = 'O Ferreiro', desconto = 1 } = {}) {
  const ofertas = baralhar(melhoriasDisponiveis()).slice(0, 3);
  for (;;) {
    ui.prompt(titulo, `Tem ${G.ouro} de Ouro. Cada objeto leva duas melhorias, no máximo.`);
    const livres = ofertas.filter(x => (G.melhorias[x.item] || []).length < MELHORIAS_MAX && !(G.melhorias[x.item] || []).includes(x.m.id) && G.equip[ITENS[x.item].slot] === x.item);
    const specs = livres.map(x => {
      const preco = Math.ceil(x.m.preco * desconto);
      return {
        tema: 'rara', etiqueta: `Aprimorar ${ITENS[x.item].nome}`, titulo: `${x.m.nome}`, glyph: x.m.glyph,
        desc: x.m.desc, rodape: `${preco} Ouro`, rodapeGlyph: 'coin', preco,
        locked: G.ouro < preco, lockText: 'Ouro insuficiente',
      };
    });
    specs.push({ tema: 'escolha', etiqueta: 'Seguir', titulo: 'Sair da Forja', desc: 'Já chega de faíscas.', glyph: 'sign', sair: true });
    const i = await ui.escolha(specs, { ctx: 'forja' });
    if (specs[i].sair) break;
    const x = livres[i];
    G.ouro -= specs[i].preco;
    G.melhorias[x.item] = [...(G.melhorias[x.item] || []), x.m.id];
    G.log.melhorias = (G.log.melhorias || 0) + 1;
    ui.som('moeda');
    aplicarVida(x.m.vidaMax || 0);
    ui.sync();
  }
  ui.prompt('');
}

async function subirDeNivel(ui) {
  while (xpParaProximo() !== null && G.xp >= xpParaProximo()) {
    G.nivel++;
    const opcoes = talentosDisponiveis();
    if (!opcoes.length) { ui.sync(); continue; }
    ui.prompt(`Subiu ao nível ${G.nivel}!`, 'Escolha um talento. Os outros voltam ao baralho.');
    ui.som('moeda');
    const i = await ui.escolha(opcoes.map(t => ({
      tema: 'talento', etiqueta: 'Talento', titulo: t.nome, desc: t.desc, glyph: 'star', talento: t.id,
    })), { ctx: 'talento' });
    G.talentos.push(opcoes[i].id);
    aplicarVida(opcoes[i].vidaMax || 0);
    ui.prompt('');
    ui.sync();
  }
}

// ---------- Cenas ----------

async function fazerTeste(ui, o) {
  if (!o.roll) return { ok: true, certo: true };
  const r = resolverTeste(o);
  const lista = [{ tipo: 'd20', face: r.d20 - 1 }];
  if (r.dadoArma) lista.push({ tipo: r.tipoDado, face: r.dadoArma - 1 });
  await ui.dados(lista);
  if (r.critico) await ui.critico(true);
  if (r.falhaCritica) await ui.critico(false);
  let texto = `d20: ${r.d20} ${sinal(r.bonus)} = ${r.total}, contra ${r.dc}: ${r.critico ? 'Acerto crítico' : r.falhaCritica ? 'Falha crítica' : r.ok ? 'Êxito' : 'Revés'}`;
  if (r.repetiu) texto = `Repetido. ${texto}`;
  if (r.dadoArma && r.ok) texto += `  |  Dano: ${r.dano}`;
  await ui.resultado(texto, r.ok);
  G.log.testes++;
  if (r.ok) G.log.sucessos++;
  return r;
}

const caEmCombate = est => Math.max(5, caJogador() - est.caMenos + (est.guarda ? 2 : 0));
const vivos = est => est.aliados.filter(a => a.pv > 0);
const notaAliados = est => est.aliados.map(a => `${a.nome.split(',')[0]}: ${Math.max(0, a.pv)}/${a.pvMax} PV`).join('  ·  ');

// O que o chefe faz com a sua segunda ação: nem sempre é o mesmo golpe.
const GOLPES_DO_CHEFE = [
  { id: 'golpe', t: 'ataca' },
  { id: 'golpe', t: 'ataca' },
  { id: 'quebra', t: 'ataca para lhe partir a guarda', nota: 'se acertar, a sua CA desce 2' },
  { id: 'corta', t: 'ataca-lhe o braço da arma', nota: 'se acertar, o seu dano desce 2 por duas rondas' },
  { id: 'guarda', t: 'fecha-se na defesa', nota: 'CA +3 até à próxima vez dele' },
  { id: 'certeiro', t: 'atinge-o sem falhar', nota: 'dano menor, mas sem teste' },
];

// Um aliado atingido pode cair, e quem cai em combate não volta.
async function feridoAliado(ui, ini, est, a) {
  const r = ataqueDoInimigo(ini, false, a.ca);
  await ui.dados([{ tipo: 'd20i', face: r.d20 - 1 }, ...(r.rolado ? [{ tipo: ini.dado, face: r.rolado - 1 }] : [])]);
  await ui.resultado(`${ini.nome} vira-se para ${a.nome}: ${r.total} contra CA ${a.ca}: ${r.acerta ? `acerta, -${r.dano} PV` : 'falha'}`, !r.acerta);
  if (!r.acerta) return `${ini.nome} tenta atingir ${a.nome}, e falha.`;
  a.pv -= r.dano;
  ui.som('golpe');
  if (a.pv > 0) return `${ini.nome} fere ${a.nome}, que perde ${r.dano} PV.`;
  G.aliados = G.aliados.filter(id => id !== a.id);
  G.aliadosPerdidos = (G.aliadosPerdidos || 0) + 1;
  ui.sync();
  return `${a.nome} cai, e não se volta a levantar. A carta perde-se.`;
}

// O inimigo joga: d20 contra a sua CA e, se acertar, o dado dele. Devolve o texto do que aconteceu.
async function ataqueInimigo(ui, ini, est) {
  const golpe = ini.chefe ? umDe(GOLPES_DO_CHEFE) : GOLPES_DO_CHEFE[0];
  if (golpe.id === 'guarda') {
    ini.defesa += 3;
    est.guardaChefe = 3;
    await ui.resultado(`${ini.nome} ${golpe.t}: ${golpe.nota}`, false);
    est.rodape = [est.rodape, `CA dele ${ini.defesa}`].filter(Boolean).join('  ·  ');
    return `${ini.nome} recua e fecha-se na defesa.`;
  }
  // Com aliados ao lado, nem sempre é o herói o alvo.
  // O golpe preparado do bruto vai sempre para o herói.
  const lado = vivos(est);
  if (golpe.id !== 'certeiro' && !est.preparado && lado.length && Math.random() < .35) return feridoAliado(ui, ini, est, umDe(lado));
  if (est.escudo) {
    est.escudo = false;
    const eraPreparado = est.preparado;
    est.preparado = false;
    return fmt(eraPreparado ? `O escudo aguenta o golpe terrível de ${ini.nome}.` : `O escudo aguenta o golpe de ${ini.nome}.`);
  }
  if (golpe.id === 'certeiro') {
    const dano = Math.max(1, Math.ceil(dado(parseInt(ini.dado.slice(1), 10)) / 2) + (ini.mais || 0));
    await ui.resultado(`${ini.nome} ${golpe.t}: -${dano} Vida`, false);
    await aplicar(ui, { vida: -dano });
    ui.som('golpe');
    est.rodape = [est.rodape, `-${dano} Vida`].filter(Boolean).join('  ·  ');
    return `${ini.nome} atinge-o sem falhar, e tira-lhe ${dano} de Vida.`;
  }
  const r = ataqueDoInimigo(ini, est.exposto, caEmCombate(est));
  const pesado = est.preparado;
  est.preparado = false;
  if (pesado && r.acerta) r.dano *= 2;
  est.guarda = false;
  const estava = est.exposto;
  est.exposto = false;
  const lista = [{ tipo: 'd20i', face: r.d20 - 1 }];
  if (r.rolado) lista.push({ tipo: ini.dado, face: r.rolado - 1 });
  await ui.dados(lista);
  await ui.resultado(`${ini.nome}${golpe.nota ? ` ${golpe.t}` : pesado ? ', golpe a dobrar' : ''}: d20 ${r.d20} ${sinal(ini.ataque)} = ${r.total}, contra a sua CA ${r.ca}: ${r.acerta ? `acerta, -${r.dano} Vida` : 'falha'}`, !r.acerta);
  if (!r.acerta) return pesado ? `${ini.nome} descarrega o golpe preparado, e falha.` : `${ini.nome} ataca, e falha.`;
  await aplicar(ui, { vida: -r.dano });
  ui.som('golpe');
  est.rodape = [est.rodape, `-${r.dano} Vida`].filter(Boolean).join('  ·  ');
  let extra = '';
  if (golpe.id === 'quebra') { est.caMenos = Math.min(4, est.caMenos + 2); extra = ` A sua guarda abre-se: CA ${caEmCombate(est)}.`; }
  if (golpe.id === 'corta') { est.danoMenos = 2; extra = ' O braço da arma fica dormente: o seu dano desce 2 por duas rondas.'; }
  if (ini.jeito === 'fera' && !est.recuo) { est.recuo = 2; ini.defesa += 2; extra += ` Recua logo, fora de alcance: CA ${ini.defesa}.`; }
  if (ini.jeito === 'ladrao' && G.ouro > 0) {
    const leva = Math.min(2, G.ouro);
    G.ouro -= leva;
    ui.sync();
    est.rodape = [est.rodape, `-${leva} Ouro`].filter(Boolean).join('  ·  ');
    extra += ` E leva-lhe ${leva} de Ouro da bolsa.`;
  }
  return `${r.critico ? 'Um golpe terrível! ' : estava ? 'Apanha-o exposto. ' : ''}${ini.nome} acerta-lhe, e tira-lhe ${r.dano} de Vida.${extra}`;
}

// O efeito do chefe, antes do ataque. Não precisa de dado, mas o escudo não o trava.
async function efeitoDoChefe(ui, ini, est) {
  const e = umDe(ini.efeitos);
  if (e.tipo === 'cura') ini.pv = Math.min(ini.pvMax, ini.pv + e.v);
  if (e.tipo === 'ca') ini.defesa = Math.min(ini.caBase + 3, ini.defesa + e.v);
  if (e.tipo === 'fraco') est.fraco = e.v;
  if (e.tipo === 'ouro') { G.ouro = Math.max(0, G.ouro - e.v); ui.sync(); }
  await ui.resultado(`${ini.nome}: ${e.t}`, false);
  if (e.tipo === 'dreno') await aplicar(ui, { vida: -e.v });
  const efeito = { cura: `+${e.v} PV para ele`, ca: `CA dele ${ini.defesa}`, fraco: `-${e.v} no seu próximo teste`, ouro: `-${e.v} Ouro`, dreno: `-${e.v} Vida` }[e.tipo];
  est.rodape = [est.rodape, efeito].filter(Boolean).join('  ·  ');
  return e.t;
}

// A vez do inimigo. O chefe tem duas ações: primeiro o efeito, depois o ataque.
async function turnoInimigo(ui, ini, est) {
  if (est.guardaChefe) { ini.defesa -= est.guardaChefe; est.guardaChefe = 0; }
  if (est.recuo) { ini.defesa -= est.recuo; est.recuo = 0; }
  if (est.calado) { est.calado = false; return `${ini.nome} hesita, e perde a vez.`; }
  est.vez = (est.vez || 0) + 1;
  // O bruto prepara o golpe na primeira vez dele, e depois a cada três.
  if (ini.jeito === 'bruto' && est.vez % 3 === 1) {
    est.preparado = true;
    await ui.resultado(`${ini.nome} ergue a arma devagar: o próximo golpe dele fere a dobrar`, false);
    est.rodape = [est.rodape, 'Golpe a dobrar na vez seguinte'].filter(Boolean).join('  ·  ');
    return `${ini.nome} ergue a arma devagar, e prepara um golpe terrível. É agora ou nunca para se proteger.`;
  }
  // A bruxa amaldiçoa ronda sim, ronda não.
  if (ini.jeito === 'bruxa' && est.vez % 2 === 0) {
    est.fraco = 2;
    await ui.resultado(`${ini.nome} amaldiçoa-o: -2 Vida e -2 no seu próximo teste`, false);
    await aplicar(ui, { vida: -2 });
    est.rodape = [est.rodape, '-2 Vida', '-2 no próximo teste'].filter(Boolean).join('  ·  ');
    return `${ini.nome} murmura uma maldição, e o seu braço fica pesado.`;
  }
  const frases = [];
  if (ini.efeitos) frases.push(await efeitoDoChefe(ui, ini, est));
  if (G.vida > 0) frases.push(await ataqueInimigo(ui, ini, est));
  // O bando ataca outra vez, mais fraco, enquanto tiver mais de metade dos PV.
  if (ini.jeito === 'bando' && ini.pv > ini.pvMax / 2 && G.vida > 0) {
    ini.ataque -= 2;
    frases.push(`E outro, ao lado: ${await ataqueInimigo(ui, ini, est)}`);
    ini.ataque += 2;
  }
  return frases.join(' ');
}

// Cada aliado de pé faz a sua parte, à vez, depois do herói.
async function turnoAliados(ui, ini, est) {
  const frases = [];
  for (const a of vivos(est)) {
    if (ini.pv <= 0) break;
    if (a.acao === 'cura' && G.vida < vidaMax()) {
      await aplicar(ui, { vida: a.cura });
      await ui.resultado(`${a.nome} trata-lhe das feridas: +${a.cura} Vida`, true);
      frases.push(`${a.nome} fecha-lhe uma ferida.`);
      continue;
    }
    if (a.acao === 'guarda') {
      est.guarda = true;
      await ui.resultado(`${a.nome} distrai ${ini.nome}: +2 na sua CA`, true);
      frases.push(`${a.nome} põe-se entre os dois.`);
      continue;
    }
    const d20 = dado(20), acerta = d20 === 20 || (d20 !== 1 && d20 + a.ataque >= ini.defesa);
    const rolado = acerta ? dado(parseInt(a.dado.slice(1), 10)) : 0;
    const dano = acerta ? rolado * (d20 === 20 ? 2 : 1) : 0;
    await ui.dados([{ tipo: 'd20', face: d20 - 1 }, ...(acerta ? [{ tipo: a.dado, face: rolado - 1 }] : [])]);
    await ui.resultado(`${a.nome}: d20 ${d20} +${a.ataque} = ${d20 + a.ataque}, contra ${ini.defesa}: ${acerta ? `acerta, ${dano} de dano` : 'falha'}`, acerta);
    ini.pv -= dano;
    frases.push(acerta ? `${a.nome} acerta, e tira-lhe ${dano} de PV.` : `${a.nome} ataca, e falha.`);
  }
  return frases.join(' ');
}

// Combate à vez, com um d20 para cada lado. Devolve 'vitoria', 'fuga' ou 'morte'.
async function combate(ui, ini, arte) {
  const usadas = new Set(), est = { escudo: false, exposto: false, rodape: ini.sabe || '', fraco: 0, calado: !!ini.calado, caMenos: 0, danoMenos: 0, guarda: false, guardaChefe: 0,
    recuo: 0, preparado: false, escudoIni: ini.jeito === 'soldado', levantou: false };
  const jeito = ini.jeito ? JEITOS[ini.jeito] : null;
  // Os aliados entram de Vida cheia em cada combate.
  est.aliados = G.aliados.map(id => ({ ...fichaAliado(id), pvMax: fichaAliado(id).pv }));
  let ronda = 1;
  G.log.combates++;
  G.emCombate = true;
  G.emCombateFinal = !!ini.chefe;
  ui.sync();
  ui.musica(ini.chefe ? 'chefe' : 'combate');
  const fim = r => {
    if (ini.chefe && est.guardaChefe) ini.defesa -= est.guardaChefe;
    G.emCombate = false;
    G.emCombateFinal = false;
    if (ini.chefe) G.log.rondasChefe = ronda;
    ui.sync();
    ui.musica('calma');
    return r;
  };
  const primeiro = ini.primeiro ? ini.primeiro === 'jogador' : attr('agilidade') >= ini.agi;
  const plural = /^(Os|As) /.test(ini.nome);
  const quemComeca = primeiro ? 'É mais rápido, e joga primeiro.' : `É mais lento, e ${plural ? 'eles jogam' : 'ele joga'} primeiro.`;
  let texto = ini.abertura ? fmt(`${ini.abertura} ${quemComeca}`) : `${ini.nome} não o ${plural ? 'deixam' : 'deixa'} passar. Joga-se à vez: cada um rola o d20 contra a armadura do outro. ${quemComeca}`;
  if (jeito) texto += ` ${jeito.nome}: ${jeito.d}.`;
  // Um morto-vivo cai a primeira vez, e levanta-se.
  const levanta = () => {
    if (ini.jeito !== 'morto' || est.levantou) return false;
    est.levantou = true;
    ini.pv = Math.ceil(ini.pvMax / 4);
    texto += ` ${ini.nome} cai, mas volta a levantar-se com ${ini.pv} PV.`;
    return true;
  };
  const pagina = () => ui.livro({
    capitulo: `${ini.capitulo || 'Combate'}  ·  Ronda ${ronda}`, titulo: ini.nome, arte, texto,
    rodape: [jeito ? `${jeito.nome}: ${jeito.curto}` : '', est.rodape, notaAliados(est)].filter(Boolean).join('  ·  '),
    combate: { nome: ini.nome, pv: Math.max(0, ini.pv), pvMax: ini.pvMax, ataque: ini.ataque, dado: dadoDoInimigo(ini), defesa: ini.defesa, vida: G.vida, vidaMax: vidaMax(), ca: caEmCombate(est), escudo: est.escudo },
  });
  if (!primeiro) {
    await pagina();
    texto = await turnoInimigo(ui, ini, est);
    if (G.vida <= 0) return fim('morte');
  }
  for (;;) {
    await pagina();
    const mao = maoDeCombate(ini, usadas).map(c => (est.fraco && c.roll ? { ...c, dcExtra: (c.dcExtra || 0) + est.fraco } : c));
    const o = mao[await ui.escolha(mao.map(especOpcao), { ctx: 'combate' })];
    if (o.m) usadas.add(o.m.id);
    est.rodape = '';
    est.fraco = 0;

    if (o.pocao) {
      usarItem('pocao');
      ui.sync();
      texto = 'Bebe a poção de um trago, sem tirar os olhos do inimigo.';
      est.rodape = `+${ITENS.pocao.uso.vida} Vida`;
    } else {
      const m = o.m || {};
      if (m.custo) {
        await aplicar(ui, { vida: -m.custo });
        est.rodape = `-${m.custo} Vida`;
        if (G.vida <= 0) return fim('morte');
      }
      const r = o.roll ? await fazerTeste(ui, o) : { ok: true };
      if (r.ok && r.dano && est.danoMenos) r.dano = Math.max(1, r.dano - 2);
      if (est.danoMenos) est.danoMenos--;
      if (r.ok) {
        if (o.fugir || m.fuga) return fim('fuga');
        if (m.vence) { ini.pv = 0; ini.ultimoGolpe = `${o.t}: ${ini.nome} cai, sem saber o que o atingiu.`; return fim('vitoria'); }
        if (m.calar) {
          est.calado = true;
          texto = fmt(ini.frases[o.tipo]);
        } else if (m.cura) {
          await aplicar(ui, { vida: m.cura });
          texto = `${o.t}: as feridas fecham-se.`;
          est.rodape = `+${m.cura} Vida`;
        } else if (m.escudo) {
          est.escudo = true;
          texto = fmt(`${o.t}: o próximo golpe de ${ini.nome} não lhe vai acertar.`);
        } else if (m.enfraquece) {
          ini.defesa = Math.max(6, ini.defesa - m.enfraquece);
          texto = `${o.t}: a CA de ${ini.nome} desce para ${ini.defesa}.`;
        } else {
          let dano = r.dano, aparou = '';
          if (est.escudoIni) { est.escudoIni = false; dano = Math.ceil(dano / 2); aparou = ' O escudo dele apara metade.'; }
          ini.pv -= dano;
          const frase = ini.frases && m.id && m.id.startsWith('f_') ? `${fmt(ini.frases[o.tipo])} ` : '';
          const vaiLevantar = ini.jeito === 'morto' && !est.levantou;
          texto = `${r.critico ? 'Um golpe perfeito! ' : ''}${frase}${o.t}: tira ${dano} de PV.${aparou}${ini.pv > 0 || vaiLevantar ? '' : ' Não volta a levantar-se.'}`;
          if (m.enfraqueceJunto) ini.defesa = Math.max(6, ini.defesa - m.enfraqueceJunto);
          const cura = (m.curaJunto || 0) + (o.usaArma ? somaMelhorias('sede') : 0);
          if (cura) {
            await aplicar(ui, { vida: cura });
            est.rodape = [est.rodape, `+${cura} Vida`].filter(Boolean).join('  ·  ');
          }
        }
      } else {
        est.exposto = !!r.falhaCritica;
        texto = o.fugir || m.fuga ? 'Tenta fugir, e não consegue.' : r.falhaCritica ? 'Um erro terrível, e fica exposto: o próximo ataque dele acerta de certeza.' : `${o.t}: falha.`;
        // O duelista castiga um ataque falhado com um golpe logo a seguir.
        if (ini.jeito === 'duelista' && o.roll && !o.fugir && !m.fuga) {
          ini.ataque -= 2;
          texto += ` ${ini.nome} vê a abertura e responde logo: ${await ataqueInimigo(ui, ini, est)}`;
          ini.ataque += 2;
          if (G.vida <= 0) return fim('morte');
        }
      }
    }
    // Quem cai não responde, e o golpe final conta-se na página do resultado.
    if (ini.pv <= 0 && !levanta()) { ini.ultimoGolpe = texto; return fim('vitoria'); }
    if (vivos(est).length) {
      texto = `${texto} ${await turnoAliados(ui, ini, est)}`;
      if (ini.pv <= 0 && !levanta()) { ini.ultimoGolpe = texto; return fim('vitoria'); }
    }
    {
      const resposta = await turnoInimigo(ui, ini, est);
      texto = `${texto} ${resposta}`;
      if (G.vida <= 0) return fim('morte');
    }
    ronda++;
  }
}

async function jogarCena(ui, cena, capitulo = null) {
  const arte = cena.terreno || terrenoAqui();
  const cap = capitulo || `Dia ${G.dia}`;
  await ui.livro({ capitulo: cap, titulo: fmt(cena.titulo), arte, texto: fmt(cena.texto), fundo: fmt(cena.fundo) });

  const mao = opcoesDaCena(cena);
  if (cena.etapa) ui.prompt(`Etapa ${G.fio + 1} de ${ETAPAS_DA_MISSAO} da missão`, `Mesmo falhando, fica a saber para onde ir, mas falhar custa caro.${G.dicas ? ` As dicas que ouviu tornam os testes ${Math.min(G.dicas, 3)} mais fáceis.` : ''}`);
  else if (mao.some(o => o.fragmento || o.rasto)) ui.prompt(cena.prologo ? 'O primeiro fragmento' : 'A pista está aqui!', cena.prologo ? 'As cartas com o olho vermelho dão um fragmento de pista.' : `As cartas com o olho vermelho dão um fragmento (tem ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}). Se falhar, a pista muda de sítio, mas nada se perde.`);
  else if (mao.some(o => o.rara && o.tokenReq)) ui.prompt('Uma carta rara!', 'Só há uma destas na aventura. Se não a usar agora, volta ao baralho.');
  const i = cena.direto ? 0 : await ui.escolha(mao.map(especOpcao), { ctx: 'cena' });
  ui.prompt('');
  const o = mao[i];
  if (o.tokenReq) {
    G.unicas = G.unicas.filter(u => !mesmaReq(u, o.tokenReq));
    G.log.cartasRaras++;
  }

  // Uma opção de combate abre rondas até alguém cair ou fugir.
  let r, res, golpe = '';
  if (o.tipo === 'combate' && o.roll && o.roll.pv) {
    const ini = inimigoDe(o, { titulo: fmt(cena.titulo) });
    const fim = await combate(ui, ini, arte);
    golpe = ini.ultimoGolpe || '';
    if (fim === 'morte') {
      await ui.livro({ capitulo: cap, titulo: fmt(o.t), arte, texto: 'O último golpe tira-lhe as forças.', banner: 'Revés', bannerBom: false });
      return false;
    }
    r = { ok: fim === 'vitoria' };
    if (r.ok) { res = o.ok; G.xp += COMBATE.xpVitoria; }
    else {
      const resto = { ...((o.ko && o.ko.fx) || {}) };
      delete resto.vida;
      res = { txt: 'Foge do combate, a arfar, e deixa para trás o que podia ter ganho.', fx: resto };
    }
  } else {
    r = await fazerTeste(ui, o);
    res = r.ok ? o.ok : o.ko;
  }
  const fx = { ...(res.fx || {}) };
  if (!r.ok && fx.vida < 0) fx.vida = Math.round(fx.vida * VIDA.falha);
  const especial = !!(o.req || o.rara);
  if (r.certo && !especial) delete fx.xp;
  let texto = [golpe, fmt(res.txt || '')].filter(Boolean).join(' ');

  G.xp += r.certo ? (especial ? XP_GANHO.certeza : 0) : r.ok ? XP_GANHO.sucesso : XP_GANHO.falha;
  if (!r.certo) G.xp += talentosAtivos().reduce((s, t) => s + (t.xpExtra || 0), 0);

  if (r.critico) {
    fx.xp = (fx.xp || 0) + 3;
    fx.ouro = (fx.ouro || 0) + 3;
    texto = `${texto} Um acerto perfeito, e isso rende mais do que esperava.`;
  }
  if (r.falhaCritica) {
    fx.vida = (fx.vida || 0) - 2;
    texto = `${texto} E ainda corre pior do que podia.`;
  }

  // O fragmento vem da carta com o olho, seja ela uma conversa ou um combate.
  const aqui = G.rastro === G.lugar && !G.naEstrada;
  if (G.rastro && r.ok && o.rasto) {
    const g = ganharFragmento();
    texto = [texto, g.texto].filter(Boolean).join(' ');
    if (g.completa) await ui.pista(G.diario.length - 1);
  } else if (o.rasto && !r.ok && aqui && !cena.prologo) {
    texto += migrarPista();
  }
  if (cena.etapa) {
    texto += avancarFio();
  } else if (cena.prologo) {
    texto += fmt(' Tudo aponta para {proximo}: é para lá que deve seguir.');
  } else if (r.ok && !r.certo && !cena.fechada && G.rumo && G.dicas < 3) {
    // Fazer bem as coisas também ensina o caminho.
    G.dicas++;
    texto += ` ${fmt(umDe(DICAS[o.tipo] || DICAS.outro))}`;
  }
  if (r.ok && o.tipo === 'combate') {
    const cura = talentosAtivos().reduce((s, t) => s + (t.curaCombate || 0), 0);
    if (cura) fx.vida = (fx.vida || 0) + cura;
  }
  const cena1 = talentosAtivos().reduce((s, t) => s + (t.curaCena || 0), 0);
  if (cena1) fx.vida = (fx.vida || 0) + cena1;

  const notas = await aplicar(ui, fx);
  const paginaTexto = [texto, ...notas].filter(Boolean).join(' ');
  await ui.livro({
    capitulo: cap, titulo: fmt(o.t), arte,
    texto: paginaTexto || 'Segue em frente.',
    banner: r.critico ? 'Acerto Crítico' : r.falhaCritica ? 'Falha Crítica' : r.certo ? 'Feito' : r.ok ? 'Êxito' : 'Revés',
    bannerBom: r.ok,
    rodape: resumoFx(fx),
  });
  if (G.vida <= 0) return false;

  await subirDeNivel(ui);
  if (fx.item) await receberItem(ui, fx.item);
  if (fx.mercado) await mercado(ui, 'À Venda');
  if (fx.forja) await forja(ui, { titulo: 'O Mercador Secreto', desconto: DESCONTO_SECRETO });
  return true;
}

// ---------- Viagem ----------

async function escolherDestino(ui) {
  const destino = VILOES[G.trama.vilao].destino;
  let opcoes = baralhar(vizinhos(G.lugar).filter(k => k !== destino || G.destinoRevelado));
  // O caminho da missão vem sempre primeiro, e a seguir o da pista.
  const passoMissao = G.destinoRevelado ? passoPara(destino) : passoPara(G.rumo);
  const passoPista = passoPara(G.rastro);
  opcoes = [...new Set([passoMissao, passoPista, ...opcoes].filter(Boolean))].slice(0, 3);

  ui.mapa(opcoes);
  await ui.fecharLivro();
  ui.prompt('Para onde seguir?', `Dia ${G.dia} de ${G.prazo}. A estrela dourada é a missão. O olho vermelho é uma pista, se tiver tempo.`);

  const specs = opcoes.map(k => {
    const t = TERRENOS[LUGARES[k].terreno];
    const eMissao = k === passoMissao, ePista = k === passoPista;
    const rodape = k === G.rumo || (G.destinoRevelado && k === destino) ? 'A missão está aqui' : k === G.rastro ? 'A pista está aqui' : eMissao ? 'Caminho da missão' : ePista ? 'Caminho da pista' : '';
    return {
      tema: 'cidade', etiqueta: t.nome, titulo: LUGARES[k].nome, glyph: t.glyph,
      desc: t.desc, rodape, rodapeGlyph: rodape ? (eMissao ? 'star' : 'eye') : undefined,
      rasto: eMissao || ePista, missao: eMissao, viaPista: ePista, lugar: k,
    };
  });
  // Já aqui: pode ficar mais um dia atrás de outro fragmento.
  let procurarIdx = -1;
  if (G.rastro === G.lugar) {
    procurarIdx = specs.length;
    specs.push({ tema: 'investigacao', etiqueta: 'A Pista', titulo: 'Ficar e Procurar', glyph: 'eye', desc: 'Mais um dia aqui, atrás de outro fragmento. Se a cena correr mal, a pista muda de sítio.', rodape: `+1 dia  ·  ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}`, rodapeGlyph: 'eye', procurar: true });
  }
  let finalIdx = -1;
  if (G.destinoRevelado && !opcoes.includes(destino)) {
    const dias = caminho(G.lugar, destino).length - 1;
    finalIdx = specs.length;
    specs.push({
      tema: 'combate', etiqueta: 'A Missão', titulo: `Marchar para ${LUGARES[destino].nome}`, glyph: VILOES[G.trama.vilao].glyph,
      desc: 'Sem desvios. É aqui que tudo acaba.', rodape: `${dias} ${dias === 1 ? 'dia' : 'dias'} de viagem`, rasto: true, final: true,
    });
  }
  // Fora das cidades também se pode descansar, mas custa um dia e pode correr mal.
  const curaAcampar = Math.ceil(vidaMax() * VIDA.acampar);
  let acamparIdx = -1;
  if (G.vida < vidaMax() && !LUGARES[G.lugar].cidade) {
    acamparIdx = specs.length;
    specs.push({
      tema: 'social', etiqueta: 'Descanso', titulo: 'Acampar', glyph: 'moon',
      desc: 'Ficar aqui até recuperar forças. Pode haver quem o encontre a dormir.',
      rodape: `+1 dia  ·  +${curaAcampar} Vida`, acampar: true,
    });
  }
  const i = await ui.escolha(specs, { ctx: 'destino' });
  ui.prompt('');
  if (i === procurarIdx) return { procurar: true };
  if (i === acamparIdx) return { acampar: true, cura: curaAcampar };
  if (i === finalIdx) return { final: true, para: destino };
  return { final: opcoes[i] === destino && G.destinoRevelado, para: opcoes[i] };
}

async function escolherPostura(ui) {
  await ui.fecharLivro();
  const lento = temTalento('trilho') ? 1 : 2;
  const contra = Math.max(5, SURPRESA_CHANCE - talentosAtivos().reduce((s, t) => s + (t.alerta || 0), 0));
  ui.prompt('Como quer viajar?', `Dia ${G.dia} de ${G.prazo}. O dado decide o que há na estrada; a maneira de viajar decide quantas vezes o encontra.`);
  const i = await ui.escolha([
    { tema: 'combate', etiqueta: 'Depressa', titulo: 'Marcha Forçada', glyph: 'hourglass', desc: 'Chega mais cedo, sem olhar para os lados. O que houver na estrada dá de caras consigo.', rodape: `1 dia  ·  Encontro ${contra}%`, postura: 'depressa' },
    { tema: 'habilidade', etiqueta: 'Sorrateiro', titulo: 'Pelos Trilhos', glyph: 'feather', desc: 'Mais lento, mas raramente o veem. Se der com alguém, decide se vai ver ou se segue.', rodape: `${lento} ${lento === 1 ? 'dia' : 'dias'}  ·  Encontro ${TRILHOS_CHANCE}%`, postura: 'sorrateiro' },
    { tema: 'investigacao', etiqueta: 'Explorar', titulo: 'Explorar o Caminho', glyph: 'eye', desc: 'Sair da estrada e procurar o que ela esconde. Há sempre um encontro, para o bem ou para o mal.', rodape: `${EXPLORAR_DIAS} dias  ·  Encontro sempre`, postura: 'explorar' },
  ], { ctx: 'postura' });
  ui.prompt('');
  if (i === 0) return { dias: 1, tipo: 'contra', chance: contra };
  if (i === 1) return { dias: lento, tipo: 'favor', chance: TRILHOS_CHANCE, decide: true };
  return { dias: EXPLORAR_DIAS, tipo: 'favor', chance: 100, explorar: true };
}

async function passarDias(ui, dias) {
  for (let d = 0; d < dias; d++) {
    G.dia++;
    if (G.dia > G.prazo) await aplicar(ui, { vida: -1 });
    const aviso = presagioAtual();
    ui.sync();
    if (aviso) await ui.aviso(aviso);
  }
}

// Um perigo na estrada: o combate começa logo. Quem é apanhado leva o primeiro golpe; quem vê primeiro, dá-o.
function cenaSurpresa(tipo) {
  const s = umDe(SURPRESAS);
  if (tipo === 'contra') {
    return {
      titulo: `Emboscada: ${s.inimigo}`, texto: s.contra, direto: true,
      opcoes: [{ t: 'Lutar para sair', d: 'Sem tempo para mais nada.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: s.pv, ini: s.inimigo, primeiro: 'inimigo' }, ok: { txt: 'Abre caminho entre eles, e ainda fica com o que deixam cair.', fx: { ouro: Math.ceil(s.saque / 2) } }, ko: { txt: 'Foi apanhado desprevenido, e paga por isso.', fx: { vida: -5 } } }],
    };
  }
  return {
    titulo: `À Espreita: ${s.inimigo}`, texto: s.favor, direto: true,
    opcoes: [{ t: 'Atacar primeiro', d: 'Eles nem vão perceber de onde veio.', tipo: 'combate', roll: { a: 'forca', dc: 10, pv: s.pv - 2, ini: s.inimigo, primeiro: 'jogador' }, ok: { txt: 'Acaba tudo antes que se levantem. Fica com o que traziam.', fx: { ouro: s.saque } }, ko: { txt: 'Falha o primeiro golpe, e a vantagem foi-se.', fx: { vida: -2 } } }],
  };
}

// O que há numa estrada: um d10 decide. O mestre só aparece uma vez em cada dez encontros.
async function encontroDaEstrada(ui, postura) {
  const n = dado(10);
  await ui.dados([{ tipo: 'd10', face: n - 1 }], { onde: 'mapa' });
  const mestre = n === 1 && !G.mentorVisto;
  const secreto = n <= 3 && !mestre;
  const bom = !mestre && !secreto && n <= 5;
  await ui.resultado(`O que há na estrada: ${n}: ${mestre ? 'um encontro raríssimo' : secreto ? 'um mercador' : bom ? 'boa sorte' : 'perigo'}`, n <= 5);
  if (mestre) { await encontroMestre(ui); return null; }
  if (secreto) return MERCADOR_SECRETO;
  if (bom) {
    const livres = BONS_ENCONTROS.filter(e => !G.vistos.has(e.id));
    if (livres.length) { const e = umDe(livres); G.vistos.add(e.id); return e; }
  }
  return cenaSurpresa(postura.tipo);
}

// O mestre oferece as duas evoluções da classe, uma vez em toda a partida.
async function encontroMestre(ui) {
  G.mentorVisto = true;
  const m = MENTORES[G.cls], ops = EVOLUCOES[G.cls];
  const arte = terrenoAqui();
  await ui.livro({ capitulo: 'Encontro raríssimo', titulo: m.titulo, arte, texto: m.texto });
  ui.prompt('Um encontro raríssimo', 'A sua classe pode mudar para sempre. Só acontece uma vez.');
  const specs = ops.map(e => ({ tema: 'rara', etiqueta: 'Nova Classe', titulo: e.nome, glyph: e.glyph, desc: `${e.desc} Nova carta: ${e.manobra.t}.`, rodape: e.resumo }));
  // Quem recusa não sai de mãos vazias: o que o mestre mostrou leva-o ao nível máximo.
  const noTopo = xpParaProximo() === null;
  specs.push({ tema: 'escolha', etiqueta: 'Recusar', titulo: 'Seguir Como Está', glyph: 'sign',
    desc: noTopo ? 'Agradece, e continua o seu caminho.' : 'Recusa o caminho que lhe oferecem, mas não o que aprendeu.', rodape: noTopo ? '' : 'Sobe ao nível máximo' });
  const i = await ui.escolha(specs, { ctx: 'evolucao' });
  ui.prompt('');
  if (i >= ops.length) {
    if (noTopo) await ui.livro({ capitulo: 'Encontro raríssimo', titulo: m.titulo, arte, texto: 'Quando olha para trás, já não vê ninguém. Fica a dúvida, e fica para sempre.' });
    else {
      G.xp = Math.max(G.xp, NIVEIS[NIVEIS.length - 1]);
      ui.sync();
      await ui.livro({ capitulo: 'Encontro raríssimo', titulo: m.titulo, arte, texto: 'Quando olha para trás, já não vê ninguém. Mas o que viu ali fica consigo: nunca se sentiu tão capaz.', banner: 'Nível máximo', bannerBom: true });
      await subirDeNivel(ui);
    }
  } else {
    G.evolucao = ops[i].id;
    aplicarVida(ops[i].vida || 0);
    await ui.evoluir();
    ui.sync();
    await ui.livro({ capitulo: 'Encontro raríssimo', titulo: ops[i].nome, arte, texto: `${ops[i].desc} Aprende ${ops[i].manobra.t}, que passa a estar sempre à mão em combate.`, banner: 'Classe Aprimorada', bannerBom: true, rodape: ops[i].resumo });
  }
  await ui.seguir();
}

// Um contratempo: pode custar um dia, ou o que pagar para o evitar.
function cenaDeAtraso(onde) {
  const livres = ATRASOS[onde].filter(e => !G.vistos.has(e.id));
  if (!livres.length || Math.random() >= ATRASO_CHANCE) return null;
  const e = umDe(livres);
  G.vistos.add(e.id);
  return { ...e, fechada: true };
}

function cenaTranquila() {
  return {
    titulo: 'Caminho Tranquilo',
    texto: 'Nada se mexe, além do vento. Por uma vez, a estrada não pede nada. Mesmo assim, olha para trás duas vezes antes de continuar.',
    opcoes: [
      { t: 'Descansar um pouco', d: 'Sente-se. Respire.', ok: { txt: 'Uma hora sem fazer nada faz-lhe mais bem do que qualquer poção.', fx: { vida: 2 } } },
      { t: 'Seguir sem parar', d: 'O tempo não espera.', ok: { txt: 'Continua, e já está a pensar no próximo passo.', fx: { xp: 1 } } },
    ],
  };
}

const temTeste = e => e.opcoes.some(o => o.roll && !o.req);

// Uma cena em que se pode fazer alguma coisa, para quem anda atrás de um fragmento.
function cenaDeBusca() {
  const livres = ENCONTROS.filter(e => !G.vistos.has(e.id) && temTeste(e));
  const terreno = LUGARES[G.lugar].terreno;
  const iguais = livres.filter(e => e.terreno === terreno);
  const lista = iguais.length ? iguais : livres;
  if (!lista.length) return umDe(CENAS_BUSCA);
  const e = umDe(lista);
  G.vistos.add(e.id);
  return e;
}

function cenaDaEtapa() {
  return { ...umDe([...ETAPAS_GERAIS[G.fio], ...(ETAPAS_MUNDO[G.mundo] || [])[G.fio]]), etapa: true };
}

function proximaCena() {
  // 1. A missão: é aqui que a história anda.
  if (G.rumo === G.lugar) return cenaDaEtapa();
  // 2. A reviravolta, depois da segunda etapa.
  if (G.reviravoltaPendente) {
    G.reviravoltaPendente = false;
    return REVIRAVOLTAS[G.trama.reviravolta];
  }
  // 3. Onde está a pista, há sempre uma cena com testes.
  if (G.rastro === G.lugar) return cenaDeBusca();
  // 4. As consequências do que fez, se as houver.
  const volta = CONSEQUENCIAS.filter(c => G.marcas.has(c.marca) && !G.vistos.has(c.id));
  if (volta.length && Math.random() < .6) {
    const c = umDe(volta);
    G.vistos.add(c.id);
    return c;
  }
  // 5. Um encontro do terreno.
  const terreno = LUGARES[G.lugar].terreno;
  const livres = ENCONTROS.filter(e => !G.vistos.has(e.id));
  const iguais = livres.filter(e => e.terreno === terreno);
  if (!iguais.length && !livres.length) return cenaTranquila();
  const lista = iguais.length ? iguais : livres;
  const e = umDe(lista);
  G.vistos.add(e.id);
  return e;
}

// Pelos trilhos, quem vê primeiro decide se vai ver o que é.
async function querVer(ui, postura) {
  if (!postura.decide) return true;
  ui.prompt('Há alguém na estrada', 'Ainda não o viram. Vai ver quem é, ou segue sem fazer barulho?');
  const i = await ui.escolha([
    { tema: 'investigacao', etiqueta: 'Aproximar-se', titulo: 'Ir Ver', glyph: 'eye', desc: 'Pode ser um perigo, um mercador, ou coisa mais rara.', rodape: 'O d10 decide' },
    { tema: 'escolha', etiqueta: 'Seguir', titulo: 'Seguir Caminho', glyph: 'feather', desc: 'Passa à larga, e chega ao destino como se nada fosse.', rodape: 'Sem encontro' },
  ], { ctx: 'interagir' });
  ui.prompt('');
  return i === 0;
}

async function rolarSurpresa(ui, postura) {
  const dez = dado(10) - 1, uni = dado(10) - 1;
  const v = dez * 10 + uni || 100;
  await ui.dados([{ tipo: 'dez', face: dez }, { tipo: 'uni', face: uni }], { onde: 'mapa' });
  const houve = v <= postura.chance;
  const nome = postura.nome || 'Encontro';
  await ui.resultado(`${nome} com ${postura.chance} ou menos. Saiu ${v}: ${houve ? (postura.tipo === 'contra' ? 'apanham-no!' : 'vê-os primeiro!') : 'estrada livre'}`, postura.tipo === 'favor' ? houve : !houve);
  return houve;
}

async function menuCidade(ui) {
  for (;;) {
    const cura = Math.ceil(vidaMax() / 2);
    ui.prompt(LUGARES[G.lugar].nome, `Dia ${G.dia} de ${G.prazo}. O que fazer antes de partir?`);
    const specs = [
      { tema: 'equipamento', etiqueta: 'Mercado', titulo: 'Ir ao Mercado', glyph: 'coin', desc: 'Armas, armaduras e o que cabe na mochila.', rodape: `${G.ouro} Ouro`, acao: 'mercado' },
      { tema: 'social', etiqueta: 'Estalagem', titulo: 'Passar a Noite', glyph: 'moon', desc: 'Uma cama e um banho. Paga com o tempo que não tem.', rodape: `3 Ouro  ·  +1 dia  ·  +${cura} Vida`, locked: G.ouro < 3, lockText: 'Ouro insuficiente', acao: 'dormir' },
      { tema: 'escolha', etiqueta: 'Seguir', titulo: 'Partir', glyph: 'sign', desc: 'Há estrada à espera.', acao: 'partir' },
    ];
    const i = await ui.escolha(specs, { ctx: 'cidade' });
    ui.prompt('');
    if (i === 2) break;
    if (i === 0) await mercado(ui, `Mercado de ${LUGARES[G.lugar].nome}`);
    else {
      G.ouro -= 3;
      G.log.noites++;
      aplicarVida(cura);
      await passarDias(ui, 1);
      ui.sync();
    }
    const atraso = cenaDeAtraso('cidade');
    if (atraso) {
      if (!await jogarCena(ui, atraso)) return;
      await ui.seguir();
    }
  }
}

// ---------- Final ----------

async function jogarFinal(ui) {
  const v = VILOES[G.trama.vilao];
  await ui.revelar();
  G.log.chefes = 1;
  // Antes da última porta há sempre um momento para respirar.
  aplicarVida(Math.ceil(vidaMax() * COMBATE.vilao.folego));
  ui.sync();
  const ini = chefeFinal();
  return { venceu: await combate(ui, ini, LUGARES[v.destino].terreno) === 'vitoria', golpe: ini.ultimoGolpe };
}

// ---------- A partida inteira ----------

async function fazerDraft(ui) {
  const mundos = Object.keys(MUNDOS);
  ativarMundo(mundos[await ui.draft('Escolha o seu mundo', 'Cada um tem o seu mapa, as suas missões e os seus vilões.', mundos.map(k => ({
    tema: 'cidade', etiqueta: 'Mundo', titulo: MUNDOS[k].MAPA.titulo, glyph: MUNDOS[k].glyph, desc: MUNDOS[k].desc,
  })))]);
  ui.mundo();

  const cls = tirar(doMundo(CLASSES), 3);
  G.cls = cls[await ui.draft('Escolha a sua classe', 'O baralho oferece três. As outras voltam ao monte.', cls.map(k => ({
    tema: 'classe', etiqueta: ARCANOS[k], tarot: k, titulo: CLASSES[k].nome, glyph: CLASSES[k].glyph, desc: CLASSES[k].desc, rodape: `Vida ${CLASSES[k].vida}`, rodapeGlyph: 'heart', cls: k,
  })), { lugar: 'classe' })];
  ui.sync();

  const bgs = tirar(doMundo(ANTECEDENTES), 3);
  G.bg = bgs[await ui.draft('Escolha o seu antecedente', 'De onde você vem muda o que consegue fazer.', bgs.map(k => ({
    tema: 'antecedente', titulo: ANTECEDENTES[k].nome, glyph: ANTECEDENTES[k].glyph, desc: ANTECEDENTES[k].desc,
  })), { lugar: 'antecedente' })];
  ui.sync();

  const racas = tirar(doMundo(RACAS), 3);
  G.raca = racas[await ui.draft('Escolha a sua raça', 'Algumas portas só se abrem para certos povos.', racas.map(k => ({
    tema: 'raca', titulo: RACAS[k].nome, glyph: RACAS[k].glyph, desc: RACAS[k].desc,
  })), { lugar: 'raca' })];
  ui.sync();

  G.ouro += (ANTECEDENTES[G.bg].ouro || 0) + (RACAS[G.raca].ouro || 0);
  G.xp += ANTECEDENTES[G.bg].xp || 0;
  G.vida = vidaMax();
  ui.sync();

  const armas = baralhar(Object.keys(doMundo(ITENS)).filter(k => ITENS[k].slot === 'arma' && ITENS[k].preco <= 18)).slice(0, 3);
  const a = armas[await ui.draft('Escolha a sua arma', 'O dado da arma decide a força de cada golpe.', armas.map(k => especItem(k)))];
  G.equip.arma = a;
  ui.sync();

  const outros = baralhar(Object.keys(doMundo(ITENS)).filter(k => ITENS[k].slot !== 'arma' && ITENS[k].preco <= 12)).slice(0, 3);
  const b = outros[await ui.draft('Escolha o que levar', 'Só leva o que couber no corpo e na mochila.', outros.map(k => especItem(k)))];
  await receberItem(ui, b);
  G.vida = vidaMax();
  ui.sync();

  const cidades = baralhar(Object.keys(LUGARES).filter(k => LUGARES[k].cidade && !LUGARES[k].semInicio)).slice(0, 3);
  G.cidade = cidades[await ui.draft('Escolha a cidade de partida', 'É daqui que a história vai começar.', cidades.map(k => ({
    tema: 'cidade', titulo: LUGARES[k].nome, glyph: 'tower', desc: LUGARES[k].desc,
  })))];
  G.lugar = G.cidade;
  G.visitados = [G.cidade];
  ui.pino();
}

async function fimDaPartida(ui, tipo, golpe = '') {
  const t = G.trama, v = VILOES[t.vilao], obj = OBJETIVOS[t.objetivo], rev = REVIRAVOLTAS[t.reviravolta];
  const quem = `${nomeClasse()} ${RACAS[G.raca].nome}, ${ANTECEDENTES[G.bg].nome}, nível ${G.nivel}.`;
  const verdade = fmt(`A verdade: {vilao}. ${t.motivo} ${rev.nome}: ${rev.resumo}`);
  if (tipo === 'vitoria') {
    await ui.fim('Vitória', fmt(`${golpe ? `${golpe} ` : ''}${obj.vitoria} ${quem} Dia ${G.dia}.`), true, verdade);
  } else if (tipo === 'tarde') {
    await ui.fim(FIM_TARDE.titulo, fmt(FIM_TARDE.texto), false, verdade);
  } else {
    await ui.fim(FIM_MORTE.titulo, FIM_MORTE.texto, false, verdade);
  }
  return tipo;
}

async function partida(ui) {
  novoEstado();
  await fazerDraft(ui);

  montarTrama();
  await ui.missao();
  ui.sync();

  if (!await jogarCena(ui, { ...umDe(GANCHOS[G.trama.objetivo]), prologo: true }, 'Prólogo')) return fimDaPartida(ui, 'morte');
  await ui.seguir();

  for (;;) {
    if (LUGARES[G.lugar].cidade) await menuCidade(ui);
    if (G.vida <= 0) return fimDaPartida(ui, 'morte');
    if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');

    // Quem passou do prazo fica a saber onde tudo vai acabar.
    if (G.dia > G.prazo && !G.destinoRevelado) {
      G.destinoRevelado = true;
      G.rumo = null;
      await ui.aviso(fmt('Já se vê a coluna de fumo no horizonte. Tudo acontece em {destino}.'));
    }

    const rumo = await escolherDestino(ui);
    if (rumo.procurar) {
      await passarDias(ui, 1);
      if (G.vida <= 0) return fimDaPartida(ui, 'morte');
      if (!await jogarCena(ui, cenaDeBusca())) return fimDaPartida(ui, 'morte');
      await ui.seguir();
      continue;
    }
    if (rumo.acampar) {
      await passarDias(ui, 1);
      await aplicar(ui, { vida: rumo.cura });
      G.log.noites++;
      if (G.vida > 0 && await rolarSurpresa(ui, { tipo: 'contra', chance: VIDA.emboscadaAcampar, nome: 'Emboscada' })) {
        // Uma emboscada não é altura de procurar pistas, mas quem a vence fica com o fragmento.
        G.naEstrada = true;
        const vivo = await jogarCena(ui, { ...cenaSurpresa('contra'), terreno: LUGARES[G.lugar].terreno });
        G.naEstrada = false;
        if (!vivo) return fimDaPartida(ui, 'morte');
        await ui.seguir();
      }
      if (G.vida <= 0) return fimDaPartida(ui, 'morte');
      continue;
    }
    if (rumo.final) {
      const trajeto = caminho(G.lugar, rumo.para);
      await ui.andar(trajeto);
      await passarDias(ui, trajeto.length - 1);
      G.lugar = rumo.para;
      trajeto.slice(1).forEach(k => G.visitados.push(k));
      ui.mapa([]);
      ui.sync();
      if (G.vida <= 0) return fimDaPartida(ui, 'morte');
      if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');
      const { venceu, golpe } = await jogarFinal(ui);
      return fimDaPartida(ui, venceu ? 'vitoria' : 'morte', golpe);
    }

    // Faz-se a meio caminho: o pino fica na estrada até resolver o que lá houver, e só depois chega.
    ui.mapa([rumo.para]);
    await ui.meioCaminho(G.lugar, rumo.para);
    const postura = await escolherPostura(ui);
    G.naEstrada = true;
    await passarDias(ui, postura.dias);
    if (G.vida <= 0) return fimDaPartida(ui, 'morte');
    if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');

    const atraso = cenaDeAtraso('estrada');
    if (atraso) {
      if (!await jogarCena(ui, atraso)) return fimDaPartida(ui, 'morte');
      await ui.seguir();
      if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');
    }
    if (!G.reviravoltaPendente && (postura.explorar || await rolarSurpresa(ui, postura)) && await querVer(ui, postura)) {
      const encontro = await encontroDaEstrada(ui, postura);
      if (encontro) {
        if (!await jogarCena(ui, encontro)) return fimDaPartida(ui, 'morte');
        await ui.seguir();
        if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');
      }
    }

    G.naEstrada = false;
    await ui.chegar(G.lugar, rumo.para);
    G.lugar = rumo.para;
    G.visitados.push(rumo.para);
    ui.mapa([]);
    ui.sync();
    if (!await jogarCena(ui, proximaCena())) return fimDaPartida(ui, 'morte');
    await ui.seguir();
  }
}
