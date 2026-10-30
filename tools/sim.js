// Simula partidas com o mesmo código do jogo, sem 3D, e mostra as taxas de vitória.
// Uso: node tools/sim.js [partidas por estilo]

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..', 'js');
const ctx = vm.createContext({ console, Math, setTimeout });
['data.js', 'historia.js', 'regras.js', 'partida.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(raiz, f), 'utf8'), ctx, { filename: f }));
vm.runInContext('globalThis.__api = { partida, get G() { return G; }, CLASSES, RACAS, ANTECEDENTES, ITENS, TIPOS };', ctx);
const api = ctx.__api;

const melhor = (specs, nota) => {
  let top = -1, v = -Infinity;
  specs.forEach((s, i) => {
    if (s.locked) return;
    const n = nota(s) + Math.random() * .01;
    if (n > v) { v = n; top = i; }
  });
  return top;
};
const aoAcaso = specs => {
  const livres = specs.map((s, i) => (s.locked ? -1 : i)).filter(i => i >= 0);
  return livres[Math.floor(Math.random() * livres.length)];
};

// Estilos de jogo: "ao acaso" e "sensato", que segue o rasto e escolhe o que tem mais hipóteses.
const ESTILOS = {
  acaso: specs => aoAcaso(specs),
  sensato: (specs, c) => {
    const G = api.G;
    if (c === 'destino') return melhor(specs, s => (s.final ? 3 : s.rasto ? 2 : 1));
    if (c === 'postura') return G.dia < G.prazo - 4 ? 1 : 0;
    if (c === 'cidade') {
      const vidaBaixa = G.vida < 7;
      return melhor(specs, s => (s.acao === 'dormir' && vidaBaixa ? 3 : s.acao === 'mercado' && G.ouro >= 8 && !s.visitou ? 2 : s.acao === 'partir' ? 1 : 0));
    }
    if (c === 'mercado') return melhor(specs, s => (s.sair ? 1 : s.item === 'pocao' ? 3 : s.preco ? 2 : 0));
    if (c === 'cena' || c === 'final') return melhor(specs, s => (s.rara ? 3 : 0) + (s.rasto ? 2 : 0) + s.chance);
    return melhor(specs, () => 1);
  },
};

function uiFalso(estilo) {
  const escolher = (specs, c) => {
    const i = ESTILOS[estilo](specs, c);
    return i < 0 ? specs.length - 1 : i;
  };
  let visitasCidade = 0;
  return {
    som() {}, prompt() {}, async aviso() {}, async resultado() {}, async dados() {}, async camara() {},
    async livro() {}, mapa() {}, async andar() {}, sync() {}, async seguir() {}, async missao() {}, async revelar() {}, async fim() {},
    async draft(t, s, specs) { return Math.floor(Math.random() * specs.length); },
    async escolha(specs, { ctx: c } = {}) {
      if (c === 'cidade' && ++visitasCidade > 6) return specs.length - 1;
      return escolher(specs, c);
    },
  };
}

function nova() { return { n: 0, v: 0, morte: 0, tarde: 0, dias: 0, nivel: 0, testes: 0, sucessos: 0, raras: 0, comprados: 0, ouro: 0, aliados: 0 }; }
function somar(t, r, G) {
  t.n++;
  if (r === 'vitoria') t.v++;
  if (r === 'morte') t.morte++;
  if (r === 'tarde') t.tarde++;
  t.dias += G.dia; t.nivel += G.nivel; t.testes += G.log.testes; t.sucessos += G.log.sucessos;
  t.raras += G.log.cartasRaras; t.comprados += G.log.comprados; t.ouro += G.ouro; t.aliados += G.aliados.length;
}
const p = (a, b) => `${Math.round(a / Math.max(1, b) * 100)}%`.padStart(4);
const m = (a, b) => (a / Math.max(1, b)).toFixed(1).padStart(4);

async function correr(estilo, N) {
  const total = nova(), por = { classe: {}, raca: {}, antecedente: {}, arma: {}, vilao: {}, reviravolta: {} };
  const reg = (grupo, chave, r, G) => { somar(por[grupo][chave] = por[grupo][chave] || nova(), r, G); };
  for (let i = 0; i < N; i++) {
    const r = await api.partida(uiFalso(estilo));
    const G = api.G;
    somar(total, r, G);
    reg('classe', api.CLASSES[G.cls].nome, r, G);
    reg('raca', api.RACAS[G.raca].nome, r, G);
    reg('antecedente', api.ANTECEDENTES[G.bg].nome, r, G);
    reg('vilao', G.trama.vilao, r, G);
    reg('reviravolta', G.trama.reviravolta, r, G);
  }
  console.log(`\n=== Estilo: ${estilo} (${N} partidas) ===`);
  console.log(`Vitória ${p(total.v, total.n)} | Morte ${p(total.morte, total.n)} | Tarde demais ${p(total.tarde, total.n)}`);
  console.log(`Média: dia ${m(total.dias, total.n)} | nível ${m(total.nivel, total.n)} | testes ${m(total.testes, total.n)} (${p(total.sucessos, total.testes)} de êxito) | raras ${m(total.raras, total.n)} | compras ${m(total.comprados, total.n)} | ouro final ${m(total.ouro, total.n)} | aliados ${m(total.aliados, total.n)}`);
  Object.keys(por).forEach(g => {
    const linhas = Object.keys(por[g]).sort();
    if (!linhas.length) return;
    console.log(`  ${g}: ${linhas.map(k => `${k} ${p(por[g][k].v, por[g][k].n).trim()}`).join('  ')}`);
  });
}

(async () => {
  const N = parseInt(process.argv[2], 10) || 3000;
  await correr('acaso', N);
  await correr('sensato', N);
})().catch(e => { console.error(e); process.exit(1); });
