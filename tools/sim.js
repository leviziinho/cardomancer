// Simula partidas com o mesmo código do jogo, sem 3D, e mostra as taxas de vitória.
// Uso: node tools/sim.js [partidas por estilo]

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..', 'js');
const ctx = vm.createContext({ console, Math, setTimeout });
['data.js', 'historia.js', 'daraan.js', 'madeira.js', 'etapas.js', 'regras.js', 'partida.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(raiz, f), 'utf8'), ctx, { filename: f }));
vm.runInContext('globalThis.__api = { partida, vidaMax, get G() { return G; }, CLASSES, RACAS, ANTECEDENTES, ITENS, TIPOS };', ctx);
const api = ctx.__api;

let aprimorou = 0;
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
  // Só vai ao fim depois de ter as três pistas, ou quando o tempo aperta.
  cacador: (specs, c) => {
    const G = api.G;
    if (c === 'destino' && G.pistas < 3 && G.dia < G.prazo - 3) return melhor(specs, s => (s.acampar ? (G.vida / api.vidaMax() < .4 ? 7 : 0) : s.procurar ? 6 : s.viaPista ? 5 : s.final ? 0 : s.missao ? 3 : 1));
    return ESTILOS.sensato(specs, c);
  },
  guerreiro: (specs, c) => {
    if (c === 'cena') {
      const i = specs.findIndex(s => s.entraCombate && !s.locked);
      if (i >= 0) return i;
    }
    return ESTILOS.sensato(specs, c);
  },
  sensato: (specs, c) => {
    const G = api.G;
    if (c === 'destino') return melhor(specs, s => (s.acampar ? (G.vida / api.vidaMax() < .4 ? 5 : 0) : s.final ? 4 : s.missao ? 3 : s.procurar ? 2 : s.rasto ? 1.5 : 1));
    if (c === 'postura') return G.dia < G.prazo - 4 ? 1 : 0;
    if (c === 'cidade') {
      const vidaBaixa = G.vida < 7;
      return melhor(specs, s => (s.acao === 'dormir' && vidaBaixa ? 3 : s.acao === 'mercado' && G.ouro >= 8 && !s.visitou ? 2 : s.acao === 'partir' ? 1 : 0));
    }
    if (c === 'mercado') return melhor(specs, s => (s.sair ? 1 : s.item === 'pocao' ? 3 : s.preco ? 2 : s.aprimorar ? (G.ouro >= 16 && !aprimorou++ ? 2.5 : 0) : 0));
    if (c === 'forja') return melhor(specs, s => (s.sair ? 1 : 2));
    if (c === 'combate') {
      const frac = G.vida / api.vidaMax();
      return melhor(specs, s => {
        if (s.locked) return -9;
        if (s.fuga) return frac < .25 ? 6 : -1;
        if (s.cura) return frac < .5 ? 5 : 0;
        if (s.vence) return s.chance * 6;
        if (s.apoio) return frac < .4 ? 3 : 1;
        return s.chance * (s.danoMedio || 1) - (s.custo || 0) * .5;
      });
    }
    if (c === 'cena' || c === 'final') return melhor(specs, s => (s.rara ? 3 : 0) + (s.rasto ? 4 : 0) + s.chance);
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
    som() {}, prompt() {}, async aviso() {}, async resultado() {}, async dados() {}, async critico() {}, async pista() {}, pino() {}, async fecharLivro() {}, async evoluir() {}, mundo() {}, async meioCaminho() {}, async chegar() {},
    async livro() {}, mapa() {}, async andar() {}, sync() {}, async seguir() {}, async missao() {}, async revelar() {}, async fim() {}, musica() {},
    async draft(t, s, specs) { return Math.floor(Math.random() * specs.length); },
    async escolha(specs, { ctx: c } = {}) {
      if (c === 'cidade' && ++visitasCidade > 6) return specs.length - 1;
      return escolher(specs, c);
    },
  };
}

function nova() { return { n: 0, v: 0, morte: 0, tarde: 0, dias: 0, nivel: 0, testes: 0, sucessos: 0, raras: 0, comprados: 0, ouro: 0, aliados: 0, dano: 0, noites: 0, pocoes: 0, combates: 0, vidaMax: 0, pistas: 0, evolucoes: 0, melhorias: 0, chefes: 0, rondas: 0, ganhos: 0 }; }
function somar(t, r, G) {
  t.n++;
  if (r === 'vitoria') t.v++;
  if (r === 'morte') t.morte++;
  if (r === 'tarde') t.tarde++;
  t.dias += G.dia; t.nivel += G.nivel; t.testes += G.log.testes; t.sucessos += G.log.sucessos;
  t.raras += G.log.cartasRaras; t.comprados += G.log.comprados; t.ouro += G.ouro; t.aliados += G.aliados.length;
  t.dano += G.log.dano; t.noites += G.log.noites; t.pocoes += G.log.pocoes; t.combates += G.log.combates; t.vidaMax += api.vidaMax(); t.pistas += G.pistas; t.evolucoes += G.evolucao ? 1 : 0; t.melhorias += G.log.melhorias || 0; t.chefes += G.log.chefes || 0; t.rondas += G.log.rondasChefe || 0; t.ganhos += r === 'vitoria' ? 1 : 0;
}
const p = (a, b) => `${Math.round(a / Math.max(1, b) * 100)}%`.padStart(4);
const m = (a, b) => (a / Math.max(1, b)).toFixed(1).padStart(4);

async function correr(estilo, N) {
  const total = nova(), por = { pistasFeitas: {}, mundo: {}, classe: {}, raca: {}, antecedente: {}, arma: {}, vilao: {}, reviravolta: {} };
  const reg = (grupo, chave, r, G) => { somar(por[grupo][chave] = por[grupo][chave] || nova(), r, G); };
  for (let i = 0; i < N; i++) {
    aprimorou = 0;
    const r = await api.partida(uiFalso(estilo));
    const G = api.G;
    somar(total, r, G);
    reg('pistasFeitas', String(G.pistas), r, G);
    por.pistasFeitas[String(G.pistas)].chefes += 0;
    reg('mundo', G.mundo, r, G);
    reg('classe', api.CLASSES[G.cls].nome, r, G);
    reg('raca', api.RACAS[G.raca].nome, r, G);
    reg('antecedente', api.ANTECEDENTES[G.bg].nome, r, G);
    reg('vilao', G.trama.vilao, r, G);
    reg('reviravolta', G.trama.reviravolta, r, G);
  }
  console.log(`\n=== Estilo: ${estilo} (${N} partidas) ===`);
  console.log(`Vitória ${p(total.v, total.n)} | Morte ${p(total.morte, total.n)} | Tarde demais ${p(total.tarde, total.n)}`);
  console.log(`Média: dia ${m(total.dias, total.n)} | nível ${m(total.nivel, total.n)} | testes ${m(total.testes, total.n)} (${p(total.sucessos, total.testes)} de êxito) | raras ${m(total.raras, total.n)} | compras ${m(total.comprados, total.n)} | ouro final ${m(total.ouro, total.n)} | aliados ${m(total.aliados, total.n)}`);
  console.log(`Vida: dano total ${m(total.dano, total.n)} (Vida máxima ${m(total.vidaMax, total.n)}) | combates ${m(total.combates, total.n)} | noites ${m(total.noites, total.n)} | poções ${m(total.pocoes, total.n)}`);
  console.log(`Pistas ${m(total.pistas, total.n)} | melhorias ${m(total.melhorias, total.n)} | evoluções ${p(total.evolucoes, total.n)} das partidas`);
  console.log(`Chefe: enfrentado em ${p(total.chefes, total.n)} das partidas, ganho em ${p(total.ganhos, total.chefes)} desses, ${m(total.rondas, total.chefes)} rondas em média`);
  Object.keys(por).forEach(g => {
    const linhas = Object.keys(por[g]).sort();
    if (!linhas.length) return;
    console.log(`  ${g}: ${linhas.map(k => `${k} ${p(por[g][k].v, por[g][k].n).trim()}${g === 'pistasFeitas' ? ` (${p(por[g][k].ganhos, por[g][k].chefes).trim()} do chefe, n=${por[g][k].n})` : ''}`).join('  ')}`);
  });
}

(async () => {
  const N = parseInt(process.argv[2], 10) || 3000;
  await correr('acaso', N);
  await correr('sensato', N);
  await correr('cacador', N);
  await correr('guerreiro', N);
})().catch(e => { console.error(e); process.exit(1); });
