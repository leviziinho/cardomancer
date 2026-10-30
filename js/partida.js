// O desenrolar de uma partida. Só fala com o jogador através do objeto "ui",
// para poder correr no navegador (ui.js) ou em milhares de simulações (tools/sim.js).

const pct = v => `${Math.round(v * 100)}%`;
const sinal = v => `${v >= 0 ? '+' : ''}${v}`;

function especItem(id, extra = {}) {
  const it = ITENS[id];
  const nomes = { arma: 'Arma', armadura: 'Armadura', acessorio: 'Acessório', mochila: 'Mochila' };
  return { tema: 'equipamento', etiqueta: nomes[it.slot], titulo: it.nome, glyph: it.glyph, desc: it.desc, ...extra };
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
  const bom = [];
  if (o.rasto) bom.push('Pista');
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
  if (o.roll) {
    const a = atributoDe(o);
    rodape = `${ATTR[a].nome} ${sinal(bonusDe(o))}  ·  ${dcDe(o)}+  ·  ${pct(chanceDe(o))}`;
    if (o.tipo === 'combate') rodape += `  ·  ${arma().dado}`;
    rodapeGlyph = ATTR[a].glyph;
  } else {
    rodape = 'Sucesso garantido';
  }
  return {
    tema: !ok ? (o.tipo || 'escolha') : o.rara ? 'rara' : (o.tipo || 'escolha'),
    etiqueta: r ? r.etiqueta : tipo ? tipo.nome : 'Escolha',
    titulo: fmt(o.t), desc: fmt(o.d),
    glyph: r ? r.glyph : tipo ? tipo.glyph : 'sign',
    rodape, rodapeGlyph,
    ganho: ok ? textoGanho(o) : '',
    locked: !ok,
    lockText: o.req ? r.etiqueta : 'Ouro insuficiente',
    chance: o.roll ? chanceDe(o) : 1,
    rasto: !!o.rasto,
    rara: !!o.rara,
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
  if (salvarComPocao()) notas.push('A Poção de Cura salva-lhe a vida no último instante.');
  aplicarVida(0);
  ui.sync();
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
  let stock = baralhar(Object.keys(ITENS).filter(k => !temItem(k))).slice(0, 3);
  for (;;) {
    ui.prompt(titulo, `Tem ${G.ouro} de Ouro. Só leva um objeto de cada slot.`);
    const specs = stock.map(k => especItem(k, {
      rodape: `${ITENS[k].preco} Ouro`, rodapeGlyph: 'coin',
      locked: G.ouro < ITENS[k].preco, lockText: 'Ouro insuficiente', preco: ITENS[k].preco, item: k,
    }));
    specs.push({ tema: 'escolha', etiqueta: 'Seguir', titulo: 'Sair do Mercado', desc: 'Guardar o que resta na bolsa.', glyph: 'sign', sair: true });
    const i = await ui.escolha(specs, { ctx: 'mercado' });
    if (i === stock.length) break;
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
  let texto = `d20: ${r.d20} ${sinal(r.bonus)} = ${r.total}, contra ${r.dc}: ${r.ok ? 'Êxito' : 'Revés'}`;
  if (r.repetiu) texto = `Repetido. ${texto}`;
  if (r.dadoArma && r.ok) texto += `  |  ${arma().nome}: ${r.dano} contra ${r.pv}`;
  await ui.resultado(texto, r.ok);
  G.log.testes++;
  if (r.ok) G.log.sucessos++;
  return r;
}

async function jogarCena(ui, cena, capitulo = null) {
  const arte = cena.terreno || LUGARES[G.lugar].terreno;
  const cap = capitulo || `Dia ${G.dia}`;
  await ui.livro({ capitulo: cap, titulo: fmt(cena.titulo), arte, texto: fmt(cena.texto), fundo: fmt(cena.fundo) });

  const mao = opcoesDaCena(cena);
  if (mao.some(o => o.rara && o.tokenReq)) ui.prompt('Uma carta rara!', 'O baralho guardou esta para si.');
  const i = await ui.escolha(mao.map(especOpcao), { ctx: 'cena' });
  ui.prompt('');
  const o = mao[i];
  if (o.tokenReq) {
    G.tokens[G.lugar] = G.tokens[G.lugar].filter(r => r !== o.tokenReq);
    G.log.cartasRaras++;
  }

  const r = await fazerTeste(ui, o);
  const res = r.ok ? o.ok : o.ko;
  const fx = { ...(res.fx || {}) };
  let texto = fmt(res.txt || '');

  G.xp += r.certo ? XP_GANHO.certeza : r.ok ? XP_GANHO.sucesso : XP_GANHO.falha;
  if (!r.certo) G.xp += talentosAtivos().reduce((s, t) => s + (t.xpExtra || 0), 0);

  if (o.rasto && r.ok) {
    const pista = encontrarPista();
    texto = texto ? `${texto} ${pista}` : pista;
  }
  if (o.rasto && !r.ok && res.falsaPista) {
    escolherRasto();
    texto += fmt(' Há outro sinal, agora em {proximo}.');
  }
  if (r.parcial) {
    fx.vida = (fx.vida || 0) - 2;
    texto += ' Vence, mas não sem levar um golpe de volta.';
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
    banner: r.certo ? 'Feito' : r.ok ? 'Êxito' : 'Revés',
    bannerBom: r.ok,
    rodape: resumoFx(fx),
  });
  if (G.vida <= 0) return false;

  await subirDeNivel(ui);
  if (fx.item) await receberItem(ui, fx.item);
  if (fx.mercado) await mercado(ui, 'À Venda');
  return true;
}

// ---------- Viagem ----------

async function escolherDestino(ui) {
  const destino = VILOES[G.trama.vilao].destino;
  let opcoes = baralhar(vizinhos(G.lugar).filter(k => k !== destino || G.destinoRevelado));
  // Quem vai atrás do rasto tem sempre um caminho para lá.
  if (G.rastro) {
    const passo = caminho(G.lugar, G.rastro)[1];
    if (passo) opcoes = [passo, ...opcoes.filter(k => k !== passo)];
  }
  opcoes = opcoes.slice(0, 3);

  const suspeitos = G.destinoRevelado ? [destino] : G.rastro ? [G.rastro] : [];
  ui.mapa(opcoes, suspeitos);
  await ui.camara('mapChoice');
  ui.prompt('Para onde seguir?', `Dia ${G.dia} de ${G.prazo}. ${G.destinoRevelado ? fmt('Já sabe: {destino}.') : G.rastro ? fmt('O rasto aponta para {proximo}.') : ''}`);

  const specs = opcoes.map(k => {
    const t = TERRENOS[LUGARES[k].terreno];
    const sinalRasto = k === G.rastro || (G.rastro && caminho(G.lugar, G.rastro)[1] === k);
    return {
      tema: 'cidade', etiqueta: t.nome, titulo: LUGARES[k].nome, glyph: t.glyph,
      desc: t.desc,
      rodape: k === G.rastro ? 'O rasto está aqui' : sinalRasto ? 'Na direção do rasto' : '',
      rasto: !!sinalRasto, lugar: k,
    };
  });
  let finalIdx = -1;
  if (G.destinoRevelado && !opcoes.includes(destino)) {
    const dias = caminho(G.lugar, destino).length - 1;
    finalIdx = specs.length;
    specs.push({
      tema: 'rara', etiqueta: 'A Missão', titulo: `Marchar para ${LUGARES[destino].nome}`, glyph: VILOES[G.trama.vilao].glyph,
      desc: 'Sem desvios. É aqui que tudo acaba.', rodape: `${dias} ${dias === 1 ? 'dia' : 'dias'} de viagem`, rasto: true, final: true,
    });
  }
  const i = await ui.escolha(specs, { ctx: 'destino', onde: 'mapa' });
  ui.prompt('');
  if (i === finalIdx) return { final: true, para: destino };
  return { final: opcoes[i] === destino && G.destinoRevelado, para: opcoes[i] };
}

async function escolherPostura(ui) {
  const lento = temTalento('trilho') ? 1 : 2;
  const contra = Math.max(5, SURPRESA_CHANCE - talentosAtivos().reduce((s, t) => s + (t.alerta || 0), 0));
  ui.prompt('Como quer viajar?', 'O tempo corre contra si, mas a estrada também.');
  const i = await ui.escolha([
    { tema: 'combate', etiqueta: 'Depressa', titulo: 'Marcha Forçada', glyph: 'hourglass', desc: 'Chega mais cedo, mas não olha para os lados. Podem apanhá-lo de surpresa.', rodape: `1 dia  ·  ${contra}% de emboscada`, postura: 'depressa' },
    { tema: 'habilidade', etiqueta: 'Sorrateiro', titulo: 'Pelos Trilhos', glyph: 'feather', desc: 'Mais lento, mas é você quem vê os outros primeiro, e decide o que fazer.', rodape: `${lento} ${lento === 1 ? 'dia' : 'dias'}  ·  ${SURPRESA_CHANCE + 10}% de os surpreender`, postura: 'sorrateiro' },
  ], { ctx: 'postura', onde: 'mapa' });
  ui.prompt('');
  return i === 0 ? { dias: 1, tipo: 'contra', chance: contra } : { dias: lento, tipo: 'favor', chance: SURPRESA_CHANCE + 10 };
}

async function passarDias(ui, dias) {
  for (let d = 0; d < dias; d++) {
    G.dia++;
    if (G.dia > G.prazo) aplicarVida(-1);
    const aviso = presagioAtual();
    ui.sync();
    if (aviso) await ui.aviso(aviso);
  }
}

function cenaSurpresa(tipo) {
  const s = umDe(SURPRESAS);
  if (tipo === 'contra') {
    return {
      titulo: `Emboscada: ${s.inimigo}`, texto: s.contra,
      opcoes: [
        { t: 'Lutar para sair', d: 'Sem tempo para mais nada.', tipo: 'combate', roll: { a: 'forca', dc: 13, pv: s.pv }, ok: { txt: 'Abre caminho entre eles, e ainda fica com o que deixam cair.', fx: { ouro: Math.ceil(s.saque / 2) } }, ko: { txt: 'Foi apanhado desprevenido, e paga por isso.', fx: { vida: -5 } } },
        { t: 'Fugir', d: 'Largar tudo e correr.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 12 }, ok: { txt: 'Salta a vedação e corre até lhe faltar o ar. Ninguém o segue.', fx: {} }, ko: { txt: 'Apanham-no pelas costas antes de conseguir fugir.', fx: { vida: -4 } } },
        { t: 'Falar depressa', d: 'Muito depressa.', tipo: 'social', roll: { a: 'carisma', dc: 14 }, ok: { txt: 'Não sabe bem o que disse, mas eles param, olham uns para os outros e deixam-no ir.', fx: { xp: 2 } }, ko: { txt: 'Ninguém quis ouvir.', fx: { vida: -4 } } },
      ],
    };
  }
  return {
    titulo: `À Espreita: ${s.inimigo}`, texto: s.favor,
    opcoes: [
      { t: 'Atacar primeiro', d: 'Eles nem vão perceber de onde veio.', tipo: 'combate', roll: { a: 'forca', dc: 8, pv: s.pv - 2 }, ok: { txt: 'Acaba tudo antes que se levantem. Fica com o que traziam.', fx: { ouro: s.saque, xp: 2 } }, ko: { txt: 'Falha o primeiro golpe, e a vantagem foi-se.', fx: { vida: -2 } } },
      { t: 'Roubar-lhes as coisas', d: 'Sem acordar ninguém.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 11 }, ok: { txt: 'Sai com as bolsas todas e sem um único arranhão. Só darão por isso de manhã.', fx: { ouro: s.saque + 3 } }, ko: { txt: 'Um ramo parte-se. Sai a correr, com uma ferida a lembrar-lhe a asneira.', fx: { vida: -3 } } },
      { t: 'Passar sem ser visto', d: 'Não precisa desta luta.', ok: { txt: 'Passa à larga, em silêncio. Nunca chegarão a saber.', fx: { xp: 1 } } },
    ],
  };
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

function proximaCena(postura) {
  // 1. A reviravolta, depois da segunda pista.
  if (G.reviravoltaPendente) {
    G.reviravoltaPendente = false;
    return REVIRAVOLTAS[G.trama.reviravolta];
  }
  // 2. As consequências do que fez, se as houver.
  const volta = CONSEQUENCIAS.filter(c => G.marcas.has(c.marca) && !G.vistos.has(c.id));
  if (volta.length && Math.random() < .6) {
    const c = umDe(volta);
    G.vistos.add(c.id);
    return c;
  }
  // 3. Um encontro do terreno.
  const terreno = LUGARES[G.lugar].terreno;
  const livres = ENCONTROS.filter(e => !G.vistos.has(e.id));
  const iguais = livres.filter(e => e.terreno === terreno);
  if (!iguais.length && !livres.length) return cenaTranquila();
  const lista = iguais.length ? iguais : livres;
  const e = umDe(lista);
  G.vistos.add(e.id);
  return e;
}

async function rolarSurpresa(ui, postura) {
  const dez = dado(10) - 1, uni = dado(10) - 1;
  const v = dez * 10 + uni || 100;
  await ui.dados([{ tipo: 'dez', face: dez }, { tipo: 'uni', face: uni }]);
  const houve = v <= postura.chance;
  const titulo = postura.tipo === 'contra' ? 'Emboscada' : 'À espreita';
  await ui.resultado(`Sorte da estrada: ${v}, precisa de ${postura.chance} ou menos: ${houve ? titulo : 'Nada'}`, postura.tipo === 'favor' ? houve : !houve);
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
    if (i === 0) await mercado(ui, `Mercado de ${LUGARES[G.lugar].nome}`);
    else if (i === 1) {
      G.ouro -= 3;
      aplicarVida(cura);
      await passarDias(ui, 1);
      ui.sync();
    } else break;
  }
}

// ---------- Final ----------

function opcoesFinais() {
  const v = VILOES[G.trama.vilao];
  const trunfos = ['enganou', 'traidorvirado', 'ajudado', 'sangue'].filter(m => G.marcas.has(m)).length;
  const extra = -trunfos;
  const mao = [
    { t: 'Enfrentar de frente', d: 'Sem truques. Um golpe forte conta a dobrar.', tipo: 'combate', roll: { a: 'forca', dc: 14, pv: 9 }, dcExtra: extra },
    { t: 'Falar-lhe ao que resta', d: 'Toda a gente tem uma fenda.', tipo: 'social', roll: { a: 'carisma', dc: 14 }, dcExtra: extra },
    { t: 'Passar à frente', d: 'Chegar onde ninguém o espera.', tipo: 'habilidade', roll: { a: 'agilidade', dc: 14 }, dcExtra: extra },
    { t: 'Usar o que descobriu', d: 'As pistas tinham um propósito.', tipo: 'investigacao', roll: { a: 'mente', dc: 14 }, dcExtra: extra },
  ];
  if (v.fraqueza.includes(G.cls)) {
    mao[1] = { t: `Golpe de ${CLASSES[G.cls].nome}`, d: 'Foi para isto que treinou. Conta a dobrar.', tipo: 'combate', roll: { a: umDe(Object.keys(CLASSES[G.cls].attrs)), dc: 11, pv: 1 }, rara: true, req: { cls: G.cls }, dcExtra: extra, dobra: true };
  }
  return mao;
}

async function jogarFinal(ui) {
  const t = G.trama, v = VILOES[t.vilao], obj = OBJETIVOS[t.objetivo], rev = REVIRAVOLTAS[t.reviravolta];
  await ui.revelar();
  let progresso = 0, ronda = 1;
  let texto = fmt(`${v.finalTexto} ${t.motivo}`);
  const sucessos = 2;
  while (progresso < sucessos && G.vida > 0) {
    await ui.livro({ capitulo: 'Capítulo Final', titulo: LUGARES[v.destino].nome, arte: LUGARES[v.destino].terreno, texto, rodape: `Golpes decisivos: ${progresso} de ${sucessos}` });
    ui.prompt(`Ronda ${ronda}`, 'Precisa de dois sucessos antes de cair.');
    const mao = opcoesFinais();
    const i = await ui.escolha(mao.map(especOpcao), { ctx: 'final' });
    ui.prompt('');
    const o = mao[i];
    const r = await fazerTeste(ui, o);
    G.xp += r.ok ? XP_GANHO.sucesso : XP_GANHO.falha;
    if (r.ok) {
      const dobro = o.dobra || (o.tipo === 'combate' && r.dano >= r.pv);
      progresso += dobro ? 2 : 1;
      texto = fmt(`${v.ronda[o.tipo]} ${dobro ? 'O golpe é decisivo.' : 'Ainda não acabou.'}`);
    } else {
      const dano = 3 + Math.min(4, pressao());
      await aplicar(ui, { vida: -dano });
      texto = fmt(`O contra-ataque é brutal, e custa-lhe ${dano} de Vida. {vilao} parece mais forte do que nunca.`);
    }
    ronda++;
    ui.sync();
  }
  return { venceu: progresso >= sucessos, obj, rev };
}

// ---------- A partida inteira ----------

async function fazerDraft(ui) {
  await ui.camara('draft', 1.8);

  const cls = tirar(CLASSES, 3);
  G.cls = cls[await ui.draft('Escolha a sua classe', 'O baralho oferece três. As outras voltam ao monte.', cls.map(k => ({
    tema: 'classe', titulo: CLASSES[k].nome, glyph: CLASSES[k].glyph, desc: CLASSES[k].desc, rodape: `Vida ${CLASSES[k].vida}`, rodapeGlyph: 'sun', cls: k,
  })))];
  ui.sync();

  const bgs = tirar(ANTECEDENTES, 3);
  G.bg = bgs[await ui.draft('Escolha o seu antecedente', 'De onde você vem muda o que consegue fazer.', bgs.map(k => ({
    tema: 'antecedente', titulo: ANTECEDENTES[k].nome, glyph: ANTECEDENTES[k].glyph, desc: ANTECEDENTES[k].desc,
  })))];
  ui.sync();

  const racas = tirar(RACAS, 3);
  G.raca = racas[await ui.draft('Escolha a sua raça', 'Algumas portas só se abrem para certos povos.', racas.map(k => ({
    tema: 'raca', titulo: RACAS[k].nome, glyph: RACAS[k].glyph, desc: RACAS[k].desc,
  })))];
  ui.sync();

  G.ouro += (ANTECEDENTES[G.bg].ouro || 0) + (RACAS[G.raca].ouro || 0);
  G.xp += ANTECEDENTES[G.bg].xp || 0;
  G.vida = vidaMax();
  ui.sync();

  const armas = baralhar(Object.keys(ITENS).filter(k => ITENS[k].slot === 'arma' && ITENS[k].preco <= 18)).slice(0, 3);
  const a = armas[await ui.draft('Escolha a sua arma', 'O dado da arma decide a força de cada golpe.', armas.map(k => especItem(k)))];
  G.equip.arma = a;
  ui.sync();

  const outros = baralhar(Object.keys(ITENS).filter(k => ITENS[k].slot !== 'arma' && ITENS[k].preco <= 12)).slice(0, 3);
  const b = outros[await ui.draft('Escolha o que levar', 'Só leva o que couber no corpo e na mochila.', outros.map(k => especItem(k)))];
  await receberItem(ui, b);
  G.vida = vidaMax();
  ui.sync();

  const cidades = baralhar(Object.keys(LUGARES).filter(k => LUGARES[k].cidade)).slice(0, 3);
  G.cidade = cidades[await ui.draft('Escolha a cidade de partida', 'É daqui que a história vai começar.', cidades.map(k => ({
    tema: 'cidade', titulo: LUGARES[k].nome, glyph: 'tower', desc: LUGARES[k].desc,
  })))];
  G.lugar = G.cidade;
  G.visitados = [G.cidade];
}

async function fimDaPartida(ui, tipo) {
  const t = G.trama, v = VILOES[t.vilao], obj = OBJETIVOS[t.objetivo], rev = REVIRAVOLTAS[t.reviravolta];
  const quem = `${CLASSES[G.cls].nome} ${RACAS[G.raca].nome}, ${ANTECEDENTES[G.bg].nome}, nível ${G.nivel}.`;
  const verdade = fmt(`A verdade: {vilao}. ${t.motivo} ${rev.nome}: ${rev.resumo}`);
  if (tipo === 'vitoria') {
    await ui.fim('Vitória', fmt(`${obj.vitoria} ${quem} Dia ${G.dia}.`), true, verdade);
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
  sortearCartasRaras();
  await ui.missao();
  ui.sync();

  if (!await jogarCena(ui, GANCHO, 'Prólogo')) return fimDaPartida(ui, 'morte');
  await ui.seguir();

  for (;;) {
    if (LUGARES[G.lugar].cidade && !G.destinoRevelado) await menuCidade(ui);
    if (G.vida <= 0) return fimDaPartida(ui, 'morte');
    if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');

    // Quem passou do prazo fica a saber onde tudo vai acabar.
    if (G.dia > G.prazo && !G.destinoRevelado) {
      G.destinoRevelado = true;
      G.rastro = null;
      await ui.aviso(fmt('Já se vê a coluna de fumo no horizonte. Tudo acontece em {destino}.'));
    }

    const rumo = await escolherDestino(ui);
    let postura = null;
    let trajeto = [G.lugar, rumo.para];
    if (rumo.final) {
      trajeto = caminho(G.lugar, rumo.para);
    } else {
      postura = await escolherPostura(ui);
    }
    await ui.andar(trajeto);
    await passarDias(ui, postura ? postura.dias : trajeto.length - 1);
    G.lugar = rumo.para;
    trajeto.slice(1).forEach(k => G.visitados.push(k));
    ui.mapa([], []);
    ui.sync();
    if (G.vida <= 0) return fimDaPartida(ui, 'morte');
    if (G.dia >= G.prazo + 4) return fimDaPartida(ui, 'tarde');

    if (rumo.final) {
      await ui.camara('reading');
      const { venceu } = await jogarFinal(ui);
      return fimDaPartida(ui, venceu ? 'vitoria' : 'morte');
    }

    await ui.camara('reading');
    let cena = null;
    if (!G.reviravoltaPendente && await rolarSurpresa(ui, postura)) cena = cenaSurpresa(postura.tipo);
    if (!cena) cena = proximaCena(postura);
    if (!await jogarCena(ui, cena)) return fimDaPartida(ui, 'morte');
    await ui.seguir();
  }
}
