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

function novoEstado() {
  G = {
    cls: null, bg: null, raca: null, cidade: null, lugar: null,
    equip: { arma: null, armadura: null, acessorio: null }, mochila: [],
    talentos: [], aliados: [], marcas: new Set(),
    vida: 0, ouro: 6, xp: 0, nivel: 1, pistas: 0,
    dia: 1, prazo: PRAZO_DIAS, avisos: 0,
    visitados: [], vistos: new Set(), tokens: {},
    trama: null, rastro: null, destinoRevelado: false, reviravoltaPendente: false,
    log: { testes: 0, sucessos: 0, cartasRaras: 0, comprados: 0 },
  };
  return G;
}

function talentosAtivos() {
  const lista = [...TALENTOS[G.cls] || [], ...TALENTOS.geral];
  return G.talentos.map(id => lista.find(t => t.id === id));
}
const aliadosAtivos = () => G.aliados.map(id => ALIADOS[id]);
const itensCorpo = () => Object.values(G.equip).filter(Boolean).map(id => ITENS[id]);

function attr(a) {
  let v = 0;
  const soma = o => { if (o && o.attrs && o.attrs[a]) v += o.attrs[a]; };
  soma(CLASSES[G.cls]); soma(ANTECEDENTES[G.bg]); soma(RACAS[G.raca]);
  itensCorpo().forEach(soma);
  talentosAtivos().forEach(soma);
  return v;
}

function vidaMax() {
  let v = 0;
  [CLASSES[G.cls], ANTECEDENTES[G.bg], RACAS[G.raca]].forEach(o => { if (o) v += o.vida || 0; });
  [...itensCorpo(), ...talentosAtivos(), ...aliadosAtivos()].forEach(o => { v += o.vidaMax || 0; });
  return v;
}

function bonusTipo(tipo) {
  let v = 0;
  [...talentosAtivos(), ...aliadosAtivos()].forEach(o => {
    if (o.tipo && o.tipo[tipo]) v += o.tipo[tipo];
    if (o.tudo) v += o.tudo;
  });
  return v;
}

const arma = () => (G.equip.arma ? ITENS[G.equip.arma] : ARMA_NUA);
const danoExtra = () => talentosAtivos().reduce((s, t) => s + (t.dano || 0), 0);
const temTalento = chave => talentosAtivos().some(t => t[chave]);

// A pressão do tempo: quanto mais perto do fim do prazo, mais difícil fica tudo.
function pressao() {
  const passou = G.dia - G.prazo;
  if (passou > 0) return 2 + passou;
  if (G.dia > G.prazo - 3) return 1;
  return 0;
}

function atributoDe(o) {
  if (o.tipo === 'combate' && temTalento('combateMente') && attr('mente') > attr(o.roll.a)) return 'mente';
  return o.roll.a;
}
const bonusDe = o => attr(atributoDe(o)) + (o.tipo ? bonusTipo(o.tipo) : 0);
const dcDe = o => o.roll.dc + pressao() + (o.dcExtra || 0);

function repeteTeste(o) {
  return talentosAtivos().some(t => t.repete && t.repete === o.tipo);
}

// Probabilidade de passar: um 1 falha sempre, um 20 passa sempre.
function chanceDe(o) {
  const precisa = dcDe(o) - bonusDe(o);
  const p = Math.min(.95, Math.max(.05, (21 - precisa) / 20));
  return repeteTeste(o) ? 1 - (1 - p) * (1 - p) : p;
}

function fmt(texto) {
  if (!texto || !G.trama) return texto;
  const t = G.trama;
  const v = VILOES[t.vilao];
  return texto
    .replace(/\{gancho\}/g, OBJETIVOS[t.objetivo].gancho)
    .replace(/\{cidade\}/g, LUGARES[G.cidade].nome)
    .replace(/\{vilao\}/g, v.nome)
    .replace(/\{reliquia\}/g, t.reliquia)
    .replace(/\{refem\}/g, t.refem)
    .replace(/\{motivo\}/g, t.motivo)
    .replace(/\{destino\}/g, LUGARES[v.destino].nome)
    .replace(/\{proximo\}/g, G.rastro ? LUGARES[G.rastro].nome : LUGARES[v.destino].nome)
    .replace(/^(\w)/, m => m.toUpperCase())
    .replace(/([.!?"] )(o|a) (Rei|Sacerdotisa|Homem|Bruxa|Capitão|Adaga|Sino|Olho|Códice|Irmã|Herdeira|Cartógrafa|Filha)/g, (m, p, art, nome) => p + art.toUpperCase() + ' ' + nome);
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

// O próximo sítio com rasto fica a uma ou duas estradas de onde o jogador está.
function escolherRasto() {
  const destino = VILOES[G.trama.vilao].destino;
  const livres = Object.keys(LUGARES).filter(k => k !== destino && k !== G.lugar && !G.visitados.includes(k));
  const perto = livres.filter(k => caminho(G.lugar, k).length <= 3);
  G.rastro = umDe(perto.length ? perto : livres.length ? livres : Object.keys(LUGARES).filter(k => k !== destino && k !== G.lugar));
}

function montarTrama() {
  G.trama = {
    objetivo: umDe(Object.keys(OBJETIVOS)),
    vilao: umDe(Object.keys(VILOES)),
    motivo: umDe(MOTIVOS),
    reviravolta: umDe(Object.keys(REVIRAVOLTAS)),
    reliquia: umDe(RELIQUIAS),
    refem: umDe(REFENS),
  };
  escolherRasto();
}

// Distribui as cartas raras do jogador pelo mapa. Só as encontra quem passar pelo sítio certo.
function sortearCartasRaras() {
  const nos = baralhar(Object.keys(LUGARES));
  const pedidos = [];
  for (let i = 0; i < 2; i++) pedidos.push({ cls: G.cls });
  pedidos.push({ raca: G.raca });
  if (Math.random() < .5) pedidos.push({ raca: G.raca });
  pedidos.push({ bg: G.bg });
  if (Math.random() < .5) pedidos.push({ bg: G.bg });
  pedidos.forEach((req, i) => {
    const no = nos[i % nos.length];
    (G.tokens[no] = G.tokens[no] || []).push(req);
  });
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
function opcoesDaCena(cena) {
  const base = cena.opcoes.filter(o => !o.req);
  const especiais = cena.opcoes.filter(o => o.req);

  const raras = [];
  (G.tokens[G.lugar] || []).forEach(req => {
    const escrita = especiais.find(o => mesmaReq(o.req, req));
    raras.push({ ...(escrita || cartaRara(req)), req, tokenReq: req, rara: true });
  });

  const porItem = especiais.filter(o => o.req.item && temItem(o.req.item)).map(o => ({ ...o, rara: true }));

  const rasto = G.rastro === G.lugar && G.pistas < PISTAS_PRECISAS ? [cartaDeRasto()] : [];

  const fixas = [...raras, ...porItem, ...rasto];
  const lugares = Math.max(1, 4 - fixas.length);
  const usaveis = baralhar(base.filter(podeUsar));
  const escolhidas = usaveis.slice(0, lugares);
  if (!escolhidas.length && !fixas.length) escolhidas.push(...base.slice(0, lugares));
  const mao = [...fixas, ...escolhidas];

  // Um vislumbre do que outra personagem poderia fazer aqui.
  if (mao.length < 4 && Math.random() < .5) {
    const fora = especiais.filter(o => !reqCumprido(o.req) && !o.req.item);
    if (fora.length) mao.push(umDe(fora));
  }
  return mao;
}

function cartaDeRasto() {
  // Cada personagem investiga à sua maneira, com o atributo em que é melhor.
  const formas = [
    { a: 'mente', t: 'Examinar os sinais', tipo: 'investigacao' },
    { a: 'carisma', t: 'Perguntar aos locais', tipo: 'social' },
    { a: 'agilidade', t: 'Seguir o rasto', tipo: 'habilidade' },
    { a: 'forca', t: 'Arrancar a verdade a alguém', tipo: 'social' },
  ];
  const f = formas.reduce((m, x) => (attr(x.a) > attr(m.a) ? x : m));
  return {
    t: f.t,
    d: 'Deixar o resto por resolver e ir atrás do que o trouxe aqui.',
    tipo: f.tipo,
    roll: { a: f.a, dc: 11 },
    rasto: true,
    ok: { txt: '', fx: { xp: 1 } },
    ko: { txt: 'Era uma pista falsa, e custa-lhe tempo perceber isso.', fx: { dia: 1 }, falsaPista: true },
  };
}

// Devolve o texto da pista que acabou de ser encontrada.
function encontrarPista() {
  const v = VILOES[G.trama.vilao];
  const texto = v.pistas[Math.min(G.pistas, v.pistas.length - 1)];
  G.pistas++;
  if (G.pistas === 2) G.reviravoltaPendente = true;
  if (G.pistas >= PISTAS_PRECISAS) {
    G.destinoRevelado = true;
    G.rastro = null;
    return fmt(`${texto} Já não há dúvida: tudo aponta para {destino}.`);
  }
  escolherRasto();
  return fmt(`${texto} Os sinais seguintes apontam para {proximo}.`);
}

function resolverTeste(o) {
  let d20 = dado(20);
  const bonus = bonusDe(o), dc = dcDe(o);
  const passou = v => v === 20 || (v !== 1 && v + bonus >= dc);
  let repetiu = false;
  if (!passou(d20) && repeteTeste(o)) { d20 = dado(20); repetiu = true; }
  const ok = passou(d20);
  const out = { ok, d20, bonus, dc, total: d20 + bonus, repetiu };
  if (o.tipo === 'combate') {
    const a = arma();
    out.tipoDado = a.dado;
    out.dadoArma = dado(parseInt(a.dado.slice(1), 10));
    out.dano = out.dadoArma + danoExtra();
    out.pv = o.roll.pv || 0;
    out.parcial = ok && out.dano < out.pv;
  }
  return out;
}

const precoVenda = id => Math.floor(ITENS[id].preco / 4);

function aplicarVida(delta) {
  G.vida = Math.max(0, Math.min(vidaMax(), G.vida + delta));
}

// A poção da mochila salva sozinha quem cair a 0 de Vida.
function salvarComPocao() {
  if (G.vida > 0) return false;
  const i = G.mochila.indexOf('pocao');
  if (i < 0) return false;
  G.mochila.splice(i, 1);
  G.vida = Math.min(vidaMax(), ITENS.pocao.uso.vida);
  return true;
}

function usarItem(id) {
  const i = G.mochila.indexOf(id);
  const it = ITENS[id];
  if (i < 0 || !it.uso || G.vida >= vidaMax()) return false;
  G.mochila.splice(i, 1);
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
