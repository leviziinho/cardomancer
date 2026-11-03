// Regras puras, sem nada de 3D: estado da partida, atributos, testes e probabilidades.
// O simulador em tools/sim.js usa exatamente este código.

let G = null;

const baralhar = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const umDe = arr => arr[Math.floor(Math.random() * arr.length)];
const tirar = (obj, n) => baralhar(Object.keys(obj)).slice(0, n);
const dado = lados => 1 + Math.floor(Math.random() * lados);

// O que este mundo tem: uma entrada pode ser só de um mundo, ou não existir noutro.
function doMundo(catalogo) {
  const out = {};
  Object.keys(catalogo).forEach(k => {
    const o = catalogo[k];
    if ((!o.mundo || o.mundo === G.mundo) && !(o.foraDe || []).includes(G.mundo)) out[k] = o;
  });
  return out;
}

function novoEstado() {
  G = {
    mundo: null, naEstrada: false,
    cls: null, bg: null, raca: null, cidade: null, lugar: null,
    equip: { arma: null, armadura: null, acessorio: null }, mochila: [],
    talentos: [], aliados: [], marcas: new Set(),
    vida: 0, ouro: 6, xp: 0, nivel: 1, pistas: 0,
    dia: 1, prazo: PRAZO_DIAS, avisos: 0,
    visitados: [], vistos: new Set(), unicas: [],
    trama: null, rumo: null, fio: 0, dicas: 0, rastro: null, fragmentos: 0, fraquezas: [], destinoRevelado: false, reviravoltaPendente: false,
    diario: [], melhorias: {}, gastos: [], evolucao: null, mentorVisto: false, emCombate: false,
    log: { testes: 0, sucessos: 0, cartasRaras: 0, comprados: 0, dano: 0, noites: 0, pocoes: 0, combates: 0, criticos: 0 },
  };
  return G;
}

function talentosAtivos() {
  const lista = [...TALENTOS[G.cls] || [], ...TALENTOS.geral];
  return G.talentos.map(id => lista.find(t => t.id === id));
}
const aliadosAtivos = () => G.aliados.map(id => ALIADOS[id]);

// Os aliados também lutam. Os números saem do nome, para serem sempre os mesmos.
function fichaAliado(id) {
  const a = ALIADOS[id];
  let h = 7;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const sorte = n => { h = (h * 17 + 11) % 9973; return h % n; };
  const forte = (a.tipo && a.tipo.combate) || 0;
  const acao = a.vidaMax ? 'cura' : a.tipo && a.tipo.social ? 'guarda' : 'golpe';
  return {
    id, nome: a.nome, acao,
    pv: 6 + sorte(5) + forte * 2, ca: 10 + sorte(3) + (forte ? 1 : 0), ataque: 2 + sorte(2) + forte,
    dado: forte || sorte(3) === 0 ? 'd8' : 'd6', cura: 3 + sorte(2),
  };
}
function resumoAliado(f) {
  const faz = f.acao === 'cura' ? `Cura ${f.cura} por ronda` : f.acao === 'guarda' ? 'Protege: +2 na sua CA' : `Ataca +${f.ataque}, dano ${f.dado}`;
  return `CA ${f.ca}  ·  ${f.pv} PV  ·  ${faz}`;
}

// Os aliados também lutam. Os números saem do nome, para serem sempre os mesmos.
function fichaAliado(id) {
  const a = ALIADOS[id];
  let h = 7;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const sorte = n => { h = (h * 17 + 11) % 9973; return h % n; };
  const forte = (a.tipo && a.tipo.combate) || 0;
  const acao = a.vidaMax ? 'cura' : a.tipo && a.tipo.social ? 'guarda' : 'golpe';
  return {
    id, nome: a.nome, acao,
    pv: 6 + sorte(5) + forte * 2, ca: 10 + sorte(3) + (forte ? 1 : 0), ataque: 2 + sorte(2) + forte,
    dado: forte || sorte(3) === 0 ? 'd8' : 'd6', cura: 3 + sorte(2),
  };
}
function resumoAliado(f) {
  const faz = f.acao === 'cura' ? `Cura ${f.cura} por ronda` : f.acao === 'guarda' ? 'Protege: +2 na sua CA' : `Ataca +${f.ataque}, dano ${f.dado}`;
  return `CA ${f.ca}  ·  ${f.pv} PV  ·  ${faz}`;
}
const itensCorpo = () => Object.values(G.equip).filter(Boolean).map(id => ITENS[id]);

const evolucao = () => (G.evolucao ? EVOLUCOES[G.cls].find(e => e.id === G.evolucao) : null);
const nomeClasse = () => (evolucao() || CLASSES[G.cls]).nome;

// As melhorias de um objeto, e o seu nome com elas.
function melhoriasDe(id) {
  const lista = MELHORIAS[ITENS[id].slot] || [];
  return (G.melhorias[id] || []).map(m => lista.find(x => x.id === m));
}
const melhoriasCorpo = () => Object.values(G.equip).filter(Boolean).flatMap(melhoriasDe);
const somaMelhorias = campo => melhoriasCorpo().reduce((s, m) => s + (m[campo] || 0), 0);
function nomeItem(id) {
  const m = melhoriasDe(id);
  return m.length ? `${ITENS[id].nome} ${m.map(x => x.nome).join(' e ')}` : ITENS[id].nome;
}
function descItem(id) {
  return [ITENS[id].desc, ...melhoriasDe(id).map(m => m.desc)].join(' ');
}

// O que o ferreiro pode fazer ao equipamento que traz no corpo.
function melhoriasDisponiveis() {
  const out = [];
  Object.values(G.equip).filter(Boolean).forEach(id => {
    const tem = G.melhorias[id] || [];
    if (tem.length >= MELHORIAS_MAX) return;
    (MELHORIAS[ITENS[id].slot] || []).filter(m => !tem.includes(m.id)).forEach(m => out.push({ item: id, m }));
  });
  return out;
}

// Classe de Armadura: o número que o inimigo tem de alcançar para lhe acertar.
const caJogador = () => COMBATE.caBase + Math.floor(Math.max(0, attr('agilidade')) / 2)
  + itensCorpo().reduce((s, it) => s + (it.ca || 0), 0) + somaMelhorias('ca');

function attr(a) {
  let v = 0;
  const soma = o => { if (o && o.attrs && o.attrs[a]) v += o.attrs[a]; };
  soma(CLASSES[G.cls]); soma(ANTECEDENTES[G.bg]); soma(RACAS[G.raca]); soma(evolucao());
  itensCorpo().forEach(soma);
  talentosAtivos().forEach(soma);
  return v;
}

function vidaMax() {
  let v = 0;
  [CLASSES[G.cls], ANTECEDENTES[G.bg], RACAS[G.raca]].forEach(o => { if (o) v += o.vida || 0; });
  [...itensCorpo(), ...talentosAtivos(), ...aliadosAtivos()].forEach(o => { v += o.vidaMax || 0; });
  if (G.cls) v += somaMelhorias('vidaMax') + ((evolucao() || {}).vida || 0);
  return v;
}

function bonusTipo(tipo) {
  let v = 0;
  [...talentosAtivos(), ...aliadosAtivos()].forEach(o => {
    if (o.tipo && o.tipo[tipo]) v += o.tipo[tipo];
    if (o.tudo) v += o.tudo;
  });
  return v + somaMelhorias('tudo');
}

const arma = () => (G.equip.arma ? ITENS[G.equip.arma] : ARMA_NUA);
const danoExtra = () => talentosAtivos().reduce((s, t) => s + (t.dano || 0), 0) + somaMelhorias('dano') + ((evolucao() || {}).dano || 0);
const atributoArma = () => arma().a || 'forca';
const temTalento = chave => talentosAtivos().some(t => t[chave]);

// A pressão do tempo: quanto mais perto do fim do prazo, mais difícil fica tudo.
function pressao() {
  const passou = G.dia - G.prazo;
  if (passou > 0) return 2 + passou;
  if (G.dia > G.prazo - 3) return 1;
  return 0;
}

function atributoDe(o) {
  // Um ataque com arma usa o atributo da arma. As magias e técnicas usam o seu.
  const base = o.roll.pv || o.usaArma ? atributoArma() : o.roll.a;
  if (o.dobra || o.m) return o.roll.a;
  if (o.tipo === 'combate' && temTalento('combateMente') && attr('mente') > attr(base)) return 'mente';
  return base;
}
const bonusDe = o => attr(atributoDe(o)) + (o.tipo ? bonusTipo(o.tipo) : 0) + (o.usaArma ? somaMelhorias('acerto') : 0);
// Contra o chefe, o atraso já não pesa: esse preço paga-se pelo caminho, em Vida.
const dcDe = o => o.roll.dc + (G.emCombateFinal ? 0 : pressao()) + (o.dcExtra || 0);

function repeteTeste(o) {
  return talentosAtivos().some(t => t.repete && t.repete === o.tipo);
}

// Probabilidade de passar: um 1 falha sempre, um 20 passa sempre.
function chanceDe(o) {
  const precisa = dcDe(o) - bonusDe(o);
  const p = Math.min(.95, Math.max(.05, (21 - precisa) / 20));
  return repeteTeste(o) ? 1 - (1 - p) * (1 - p) : p;
}

// "de o Homem" passa a "do Homem", quando um nome entra numa frase.
const contrai = texto => texto.replace(/\bde (O|A|Os|As|o|a|os|as) (?=[A-ZÀ-Ú])/g, (_, art) => `d${art.toLowerCase()} `);

function fmt(texto) {
  return texto ? contrai(preencher(texto)) : texto;
}

function preencher(texto) {
  if (!G.trama) return texto;
  const t = G.trama;
  const v = VILOES[t.vilao];
  return texto
    .replace(/\{cidade\}/g, LUGARES[G.cidade].nome)
    .replace(/\{vilao\}/g, v.nome)
    .replace(/\{reliquia\}/g, t.reliquia)
    .replace(/\{refem\}/g, t.refem)
    .replace(/\{motivo\}/g, t.motivo)
    .replace(/\{destino\}/g, LUGARES[v.destino].nome)
    .replace(/\{proximo\}/g, G.rumo ? LUGARES[G.rumo].nome : LUGARES[v.destino].nome)
    .replace(/\{pista\}/g, G.rastro ? LUGARES[G.rastro].nome : '')
    .replace(/^(\w)/, m => m.toUpperCase())
    .replace(/([.!?"] )(o|a) (?=[A-ZÀ-Ú])/g, (m, p, art) => `${p}${art.toUpperCase()} `);
}

// O terreno onde o herói está agora: a meio de uma viagem, é a estrada.
const terrenoAqui = () => (G.naEstrada ? 'estrada' : LUGARES[G.lugar].terreno);

// A estrada desenha-se em curva, e o pino anda por cima dela.
function controloDaEstrada(A, B) {
  return { x: (A.x + B.x) / 2 + (A.y - B.y) * .05, y: (A.y + B.y) / 2 + (B.x - A.x) * .05 };
}
function pontoDaEstrada(a, b, t) {
  // A curva depende do sentido em que a estrada foi escrita.
  const direta = ESTRADAS.some(([x, y]) => x === a && y === b);
  const A = LUGARES[direta ? a : b], B = LUGARES[direta ? b : a], u = direta ? t : 1 - t;
  const C = controloDaEstrada(A, B);
  const curva = k => (1 - u) * (1 - u) * A[k] + 2 * u * (1 - u) * C[k] + u * u * B[k];
  return { x: curva('x'), y: curva('y') };
}

function vizinhos(lugar) {
  const v = [];
  for (const [a, b] of ESTRADAS) {
    if (a === lugar) v.push(b);
    if (b === lugar) v.push(a);
  }
  return v;
}

function caminho(de, para) {
  const prev = { [de]: null }, fila = [de];
  while (fila.length) {
    const atual = fila.shift();
    if (atual === para) break;
    vizinhos(atual).forEach(n => { if (!(n in prev)) { prev[n] = atual; fila.push(n); } });
  }
  const c = [];
  for (let k = para; k; k = prev[k]) c.unshift(k);
  return c;
}

// O caminho mais curto, sem passar pelo destino final enquanto for segredo.
function rota(de, para) {
  const destino = VILOES[G.trama.vilao].destino;
  const prev = { [de]: null }, fila = [de];
  while (fila.length) {
    const atual = fila.shift();
    if (atual === para) break;
    vizinhos(atual).forEach(n => {
      if (n in prev || (n === destino && n !== para && !G.destinoRevelado)) return;
      prev[n] = atual; fila.push(n);
    });
  }
  if (!(para in prev)) return caminho(de, para);
  const c = [];
  for (let k = para; k; k = prev[k]) c.unshift(k);
  return c;
}
const estradasAte = k => rota(G.lugar, k).length - 1;
const passoPara = k => (k && k !== G.lugar ? rota(G.lugar, k)[1] : null);

// Um sítio perto daqui, de preferência onde ainda não esteve.
function sitioPerto(evitar, alcance) {
  const destino = VILOES[G.trama.vilao].destino;
  const todos = Object.keys(LUGARES).filter(k => k !== destino && k !== G.lugar && k !== evitar);
  const novos = todos.filter(k => !G.visitados.includes(k));
  const perto = l => l.filter(k => estradasAte(k) <= alcance);
  return umDe([perto(novos), perto(todos), novos, todos].find(l => l.length));
}

// ---------- O fio da história: três etapas, e depois o fim ----------

function avancarFio() {
  G.fio++;
  G.dicas = 0;
  if (G.fio === 2) G.reviravoltaPendente = true;
  if (G.fio >= ETAPAS_DA_MISSAO) {
    G.destinoRevelado = true;
    G.rumo = null;
    return fmt(' Já não há dúvida: tudo acaba em {destino}.');
  }
  G.rumo = sitioPerto(G.rastro, 2);
  return fmt(' Agora sabe para onde ir: {proximo}.');
}

function objetivoAgora() {
  if (!G.trama) return '';
  if (G.destinoRevelado) return fmt('Marchar para {destino}, onde tudo acaba');
  const n = estradasAte(G.rumo);
  return fmt(`${ETAPA_AGORA[G.fio]} em {proximo}, a ${n} ${n === 1 ? 'estrada' : 'estradas'}`);
}
function pistaAgora() {
  if (!G.trama || !G.rastro) return '';
  if (G.rastro === G.lugar) return `Pista ${G.pistas + 1} aqui, com ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA} fragmentos`;
  const n = estradasAte(G.rastro);
  return fmt(`Pista ${G.pistas + 1} em {pista}, a ${n} ${n === 1 ? 'estrada' : 'estradas'}, com ${G.fragmentos} de ${FRAGMENTOS_POR_PISTA} fragmentos`);
}

// ---------- As pistas: três fragmentos cada uma ----------

function escolherPista() {
  G.rastro = G.pistas < PISTAS_PRECISAS ? sitioPerto(G.rumo, 2) : null;
}

// A pista lê-se aos poucos: cada fragmento mostra mais um pedaço da frase.
// Corta-se nas vírgulas e nos pontos, para que cada pedaço se entenda sozinho.
function pedacoDaPista() {
  const frase = fmt(VILOES[G.trama.vilao].pistas[G.pistas]);
  let partes = frase.split(/(?<=[,:;.])\s+/);
  if (partes.length < FRAGMENTOS_POR_PISTA) partes = frase.split(' ');
  const visto = partes.slice(0, Math.ceil(partes.length * G.fragmentos / FRAGMENTOS_POR_PISTA)).join(' ').replace(/[,:;.]$/, '');
  return `${visto}...`;
}

function ganharFragmento() {
  G.fragmentos++;
  if (G.fragmentos < FRAGMENTOS_POR_PISTA) return { texto: `Mais um pedaço da pista (${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}): "${pedacoDaPista()}"` };
  const completa = fmt(VILOES[G.trama.vilao].pistas[G.pistas]);
  const f = FRAQUEZAS[G.fraquezas[G.pistas]];
  G.diario.push({ lugar: LUGARES[G.lugar].nome, texto: completa, fraqueza: G.fraquezas[G.pistas] });
  G.pistas++;
  G.fragmentos = 0;
  escolherPista();
  let texto = `A pista fica inteira: "${completa}" Descobriu ${f.nome}. ${f.desc}`;
  if (!G.destinoRevelado) texto += ` Poupa-lhe também uma etapa da missão.${avancarFio()}`;
  if (G.rastro) texto += fmt(' Há outra pista em {pista}.');
  return { texto, completa: true };
}

// Quem falha assusta quem sabia: a pista muda de sítio, mas o que já se descobriu fica.
function migrarPista() {
  G.rastro = sitioPerto(G.rumo, 2);
  return fmt(` O rasto muda-se para {pista}. O que já descobriu continua consigo.`);
}

function montarTrama() {
  const vilao = umDe(Object.keys(VILOES));
  G.trama = {
    objetivo: umDe(Object.keys(OBJETIVOS)),
    vilao,
    motivo: umDe(VILOES[vilao].motivos),
    reviravolta: umDe(Object.keys(REVIRAVOLTAS)),
    reliquia: umDe(RELIQUIAS),
    refem: umDe(REFENS),
  };
  G.fraquezas = tirar(FRAQUEZAS, PISTAS_PRECISAS);
  G.rumo = sitioPerto(null, 2);
  escolherPista();
  G.unicas = [{ cls: G.cls }, { raca: G.raca }, { bg: G.bg }];
}

function reqCumprido(req) {
  if (!req) return true;
  if (req.cls && req.cls !== G.cls) return false;
  if (req.raca && req.raca !== G.raca) return false;
  if (req.bg && req.bg !== G.bg) return false;
  if (req.item && !temItem(req.item)) return false;
  if (req.pistas && G.pistas < req.pistas) return false;
  return true;
}
const temItem = id => G.mochila.includes(id) || Object.values(G.equip).includes(id);

function custoDe(o) {
  const fx = o.ok && o.ok.fx;
  return fx && fx.ouro < 0 && !o.roll ? -fx.ouro : 0;
}
const podeUsar = o => reqCumprido(o.req) && G.ouro >= custoDe(o);

const mesmaReq = (a, b) => a && b && a.cls === b.cls && a.raca === b.raca && a.bg === b.bg;

function cartaRara(req) {
  if (req.cls) return CARTAS_UNICAS.cls[req.cls];
  if (req.raca) return CARTAS_UNICAS.raca[req.raca];
  return CARTAS_UNICAS.bg[req.bg];
}

// Monta a mão de cartas de uma cena.
// Quanto o mundo apertou com o nível do herói.
const subidaNivel = () => Math.floor((G.nivel - 1) / SUBIDA.niveisPorPonto);
const pvDoInimigo = o => Math.ceil(o.roll.pv * COMBATE.escalaPv * (1 + SUBIDA.pvPorNivel * (G.nivel - 1)));

function opcoesDaCena(cena) {
  // As dicas que ouviu pelo caminho facilitam a etapa seguinte.
  const dica = cena.etapa ? Math.min(G.dicas, 3) : 0;
  const sobe = o => (o.roll ? { ...o, dcExtra: (o.dcExtra || 0) + subidaNivel() - dica } : o);
  return maoDaCena(cena).map(sobe);
}

// Tira uma carta única do baralho da aventura. Se não for jogada, volta para lá.
function tirarUnica(especiais) {
  if (!G.unicas.length) return null;
  const nestaCena = G.unicas.find(r => especiais.some(o => mesmaReq(o.req, r)));
  if (nestaCena && Math.random() < UNICA_NA_CENA) return nestaCena;
  return Math.random() < UNICA_CHANCE ? umDe(G.unicas) : null;
}

// Nesta cena, as cartas com teste levam o olho: dão um fragmento da pista a quem as fizer bem.
function marcarFragmentos(mao) {
  const comTeste = baralhar(mao.filter(o => o.roll && podeUsar(o) && !o.fugir));
  const marcadas = new Set(comTeste.slice(0, 2));
  return mao.map(o => (marcadas.has(o) || (o.rara && o.tokenReq) ? { ...o, rasto: true } : o));
}

function maoDaCena(cena) {
  if (cena.fechada) return cena.opcoes.filter(podeUsar);
  const base = cena.opcoes.filter(o => !o.req);
  const especiais = cena.opcoes.filter(o => o.req);

  const raras = [];
  const req = cena.prologo ? null : tirarUnica(especiais);
  if (req) {
    const escrita = especiais.find(o => mesmaReq(o.req, req));
    raras.push({ ...(escrita || cartaRara(req)), req, tokenReq: req, rara: true });
  }

  const porItem = especiais.filter(o => o.req.item && temItem(o.req.item)).map(o => ({ ...o, rara: true }));

  // Por vezes, a classe tem uma magia ou técnica própria para a situação.
  const taticas = Math.random() < .5 && TATICAS[G.cls] && !cena.etapa ? [umDe(TATICAS[G.cls])] : [];

  const fixas = [...raras, ...porItem, ...taticas];
  const lugares = Math.max(1, 4 - fixas.length);
  // Sem teste só passa uma por mão: o que resolve sem dados são as cartas especiais.
  let semTeste = 0;
  const usaveis = baralhar(base.filter(podeUsar)).filter(o => o.roll || semTeste++ < 1);
  const escolhidas = usaveis.slice(0, lugares);
  if (!escolhidas.length && !fixas.length) escolhidas.push(...base.slice(0, lugares));
  const mao = [...fixas, ...escolhidas];

  // Um vislumbre do que outra personagem poderia fazer aqui.
  if (mao.length < 4 && Math.random() < .5) {
    const fora = especiais.filter(o => !reqCumprido(o.req) && !o.req.item);
    if (fora.length) mao.push(umDe(fora));
  }
  return !G.naEstrada && G.rastro === G.lugar && !cena.prologo ? marcarFragmentos(mao) : mao;
}

function resolverTeste(o) {
  let d20 = dado(20);
  const bonus = bonusDe(o), dc = dcDe(o);
  const passou = v => v === 20 || (v !== 1 && v + bonus >= dc);
  let repetiu = false;
  if (!passou(d20) && repeteTeste(o)) { d20 = dado(20); repetiu = true; }
  const ok = passou(d20);
  const out = { ok, d20, bonus, dc, total: d20 + bonus, repetiu, critico: d20 === 20, falhaCritica: d20 === 1 };
  if (out.critico || out.falhaCritica) G.log.criticos++;
  if (o.dadoDano) {
    out.tipoDado = o.dadoDano;
    out.dadoArma = dado(parseInt(o.dadoDano.slice(1), 10));
    out.dano = (out.dadoArma + danoExtra() + ((o.m && o.m.mais) || 0)) * (out.critico ? 2 : 1);
    out.pv = o.roll.pv || 0;
  }
  return out;
}

// ---------- Combate ----------

// O inimigo que uma opção de combate põe à frente do jogador.
function inimigoDe(o, cena) {
  const golpeBase = o.ko && o.ko.fx && o.ko.fx.vida ? -o.ko.fx.vida : 3;
  const pv = pvDoInimigo(o), dc = o.roll.dc + (o.dcExtra || 0);
  return {
    nome: fmt(o.roll.ini || cena.titulo),
    pv, pvMax: pv,
    defesa: dc,
    ataque: dc - COMBATE.ataqueMenos,
    dado: golpeBase >= 6 ? 'd10' : golpeBase >= 5 ? 'd8' : 'd6',
    mais: subidaNivel(),
    agi: dc - 11,
    primeiro: o.roll.primeiro || null,
  };
}

// O chefe final: tem PV a sério e, em cada ronda, um efeito e um ataque.
function chefeFinal() {
  const v = VILOES[G.trama.vilao];
  const trunfos = ['enganou', 'traidorvirado', 'ajudado', 'sangue'].filter(m => G.marcas.has(m)).length;
  // Cada pista completa é uma fraqueza que se leva para a última porta.
  const sabe = G.diario.map(d => FRAQUEZAS[d.fraqueza]);
  const soma = campo => sabe.reduce((t, f) => t + (f[campo] || 0), 0);
  const pv = Math.ceil((COMBATE.vilao.pvBase + COMBATE.vilao.pvNivel * G.nivel) * (1 - soma('pv')));
  const ca = Math.max(7, COMBATE.vilao.ca + subidaNivel() - trunfos - soma('ca'));
  return {
    nome: fmt('{vilao}').replace(/^./, m => m.toUpperCase()),
    pv, pvMax: pv, defesa: ca, caBase: ca,
    ataque: COMBATE.vilao.ataque + subidaNivel() - soma('ataque'),
    dado: COMBATE.vilao.dado, agi: 3,
    primeiro: sabe.some(f => f.calado) ? 'jogador' : null, calado: sabe.some(f => f.calado), sabe: sabe.map(f => f.nome).join('  ·  '),
    chefe: true, efeitos: sabe.some(f => f.semEfeito) ? null : v.efeitos, frases: v.ronda, fraqueza: v.fraqueza.includes(G.cls),
    capitulo: 'Capítulo Final', abertura: `${v.finalTexto} ${G.trama.motivo}`,
  };
}

const dadoDoInimigo = ini => `${ini.dado}${ini.mais ? `+${ini.mais}` : ''}`;

// O d20 do inimigo contra a sua CA. Depois de uma falha crítica sua, acerta sempre.
function ataqueDoInimigo(ini, exposto = false, ca = caJogador()) {
  const d20 = dado(20), total = d20 + ini.ataque;
  const critico = d20 === 20;
  const acerta = exposto || critico || (d20 !== 1 && total >= ca);
  const rolado = acerta ? dado(parseInt(ini.dado.slice(1), 10)) : 0;
  const dano = acerta ? Math.max(1, rolado + (ini.mais || 0) - COMBATE.danoMenos) * (critico ? 2 : 1) : 0;
  return { d20, ca, total, critico, acerta, rolado, dano };
}

const media = d => (parseInt(d.slice(1), 10) + 1) / 2;

function cartaAtaque(ini) {
  const a = arma();
  const o = {
    t: `Atacar: ${G.equip.arma ? nomeItem(G.equip.arma) : a.nome}`, d: `Se chegar à CA ${ini.defesa}, tira-lhe PV. Depois, é a vez dele.`,
    tipo: 'combate', usaArma: true, dadoDano: a.dado, roll: { a: atributoArma(), dc: ini.defesa }, danoMedio: media(a.dado) + danoExtra(),
    glyph: a.glyph || 'sword',
  };
  o.ganhoTexto = `Dano ${a.dado}${danoExtra() ? `+${danoExtra()}` : ''}`;
  return o;
}

function cartaManobra(m, ini) {
  const base = { t: m.t, d: m.d, tipo: 'combate', tema: m.magia ? 'magia' : 'tecnica', etiqueta: m.magia ? 'Magia' : 'Técnica', glyph: m.glyph, m };
  const partes = [];
  if (m.dado) partes.push(`Dano ${m.dado}`);
  if (m.cura) partes.push(`+${m.cura} Vida`);
  if (m.custo) partes.push(`custo: ${m.custo} Vida`);
  if (m.enfraquece) partes.push(`Defesa -${m.enfraquece}`);
  base.ganhoTexto = partes.join('  ·  ');
  if (m.a) {
    base.roll = { a: m.a, dc: ini.defesa + (m.dificil || 0) - (m.facil || 0) };
    if (m.dado) { base.dadoDano = m.dado; base.danoMedio = media(m.dado) + danoExtra(); }
  }
  if (m.custo && G.vida <= m.custo) { base.bloqueada = 'Vida a menos'; }
  if (m.cura && G.vida >= vidaMax()) { base.bloqueada = 'Vida cheia'; }
  return base;
}

// O que só se pode fazer contra o chefe, uma vez cada.
function cartasDoChefe(ini, usadas) {
  const carta = (id, t, d, tipo, a, extra = {}) => {
    const c = { t, d, tipo, roll: { a, dc: ini.defesa + (extra.facil ? -3 : 0) }, m: { id, a, calar: !!extra.calar } };
    if (extra.dado) { c.dadoDano = extra.dado; c.danoMedio = media(extra.dado) + danoExtra(); c.ganhoTexto = `Dano ${extra.dado}`; }
    else c.ganhoTexto = 'Ele perde a próxima ronda';
    return c;
  };
  const melhor = Object.keys(CLASSES[G.cls].attrs).reduce((m, a) => (attr(a) > attr(m) ? a : m));
  const lista = [
    carta('f_passar', 'Passar à frente', 'Chegar onde ninguém o espera.', 'habilidade', 'agilidade', { dado: 'd10' }),
    carta('f_falar', 'Falar-lhe ao que resta', 'Toda a gente tem uma fenda.', 'social', 'carisma', { calar: true }),
  ];
  const base = baralhar(lista);
  if (ini.fraqueza) {
    base.unshift({ ...carta('f_classe', `Golpe de ${nomeClasse()}`, 'Foi para isto que treinou. Mais fácil de acertar.', 'combate', melhor, { dado: 'd12', facil: true }), rara: true, req: { cls: G.cls } });
  }
  return base.filter(c => !usadas.has(c.m.id));
}

function maoDeCombate(ini, usadas) {
  const mao = [cartaAtaque(ini)];
  // A manobra da classe aprimorada aparece sempre.
  const evo = evolucao();
  const baralho = [...(evo ? [evo.manobra] : []), ...baralhar(MANOBRAS[G.cls] || [])].filter(m => !usadas.has(m.id) && !(ini.chefe && (m.vence || m.fuga)));
  baralho.slice(0, 2).forEach(m => mao.push(cartaManobra(m, ini)));
  if (G.mochila.includes('pocao')) {
    mao.push({
      t: 'Beber a Poção', d: `Recupera ${ITENS.pocao.uso.vida} de Vida, e a seguir é a vez dele.`, tema: 'equipamento', etiqueta: 'Mochila', glyph: 'drop',
      pocao: true, bloqueada: G.vida >= vidaMax() ? 'Vida cheia' : null, ganhoTexto: `+${ITENS.pocao.uso.vida} Vida`,
    });
  }
  if (ini.chefe) return [...mao, ...cartasDoChefe(ini, usadas)].slice(0, 5);
  mao.push({
    t: 'Fugir', d: 'Sai sem recompensa. Se falhar, ele ataca na mesma.', tipo: 'habilidade', etiqueta: 'Fuga', glyph: 'feather',
    fugir: true, roll: { a: 'agilidade', dc: Math.max(6, ini.defesa - 2) },
  });
  return mao;
}

const precoVenda = id => Math.floor(ITENS[id].preco / 4);

function aplicarVida(delta) {
  const antes = G.vida;
  G.vida = Math.max(0, Math.min(vidaMax(), G.vida + delta));
  if (G.vida < antes) G.log.dano += antes - G.vida;
}

// A poção da mochila salva sozinha quem cair a 0 de Vida.
function salvarComPocao() {
  if (G.vida > 0) return false;
  const i = G.mochila.indexOf('pocao');
  if (i < 0) return false;
  G.mochila.splice(i, 1);
  G.gastos.push('pocao');
  G.log.pocoes++;
  G.vida = Math.min(vidaMax(), ITENS.pocao.uso.vida);
  return true;
}

function usarItem(id) {
  const i = G.mochila.indexOf(id);
  const it = ITENS[id];
  if (i < 0 || !it.uso || G.vida >= vidaMax()) return false;
  G.mochila.splice(i, 1);
  G.gastos.push(id);
  G.log.pocoes++;
  aplicarVida(it.uso.vida || 0);
  return true;
}

function xpParaProximo() {
  return G.nivel < NIVEIS.length ? NIVEIS[G.nivel] : null;
}

function talentosDisponiveis() {
  const livre = t => !G.talentos.includes(t.id) && (!t.req || G.talentos.includes(t.req));
  const daClasse = baralhar((TALENTOS[G.cls] || []).filter(livre));
  const gerais = baralhar(TALENTOS.geral.filter(livre));
  return [...daClasse.slice(0, 2), ...gerais].slice(0, 3);
}

function presagioAtual() {
  const passou = G.dia > G.prazo;
  const quase = G.dia > G.prazo - 3;
  const nivel = passou ? 2 : quase ? 1 : 0;
  if (nivel > G.avisos) {
    G.avisos = nivel;
    return fmt(PRESSAGIOS[nivel - 1]);
  }
  return null;
}
