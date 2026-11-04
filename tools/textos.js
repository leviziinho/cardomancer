// Tira do jogo todos os textos de um mundo, com o caminho de cada um, para o Livro das Histórias.
// Uso: node tools/textos.js [mundo] > textos.json   (por omissão, daraan)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..', 'js');
const ctx = vm.createContext({ console, Math, setTimeout });
// vesper.js e madeira.js só existem no computador do Levi; sem eles, joga-se só Daraan.
['data.js', 'historia.js', 'daraan.js', 'etapas.js', 'vesper.js', 'madeira.js', 'regras.js', 'partida.js'].filter(f => fs.existsSync(path.join(raiz, f))).forEach(f => vm.runInContext(fs.readFileSync(path.join(raiz, f), 'utf8'), ctx, { filename: f }));
const mundo = process.argv[2] || 'daraan';
const J = nome => vm.runInContext(nome, ctx);

// Campos que nunca são texto para ler: identificadores, símbolos e regras.
const FORA = new Set(['id', 'glyph', 'tipo', 'a', 'dado', 'acao', 'slot', 'mundo', 'raridade', 'cls', 'raca', 'tema', 'terreno', 'de', 'fraqueza', 'cor', 'req', 'caDe', 'danoDe', 'curaSempre', 'vantagem', 'companheiros', 'foraDe', 'repete', 'objetivo', 'vilao', 'icone', 'som', 'arte', 'lugar', 'para', 'onde', 'cidade']);
const eTexto = (k, v) => typeof v === 'string' && !FORA.has(k) && v.length > 2 && !/^[a-z0-9_.-]+$/.test(v);

function recolher(obj, base, out) {
  const anda = (o, p, k) => {
    if (eTexto(k, o)) { out.push({ k: p, v: o }); return; }
    if (Array.isArray(o)) o.forEach((x, i) => anda(x, `${p}[${i}]`, k));
    else if (o && typeof o === 'object') Object.keys(o).forEach(c => anda(o[c], `${p}.${c}`, c));
  };
  anda(obj, base, '');
  return out;
}
// Do catálogo comum, só o que existe neste mundo.
const doMundo = cat => Object.fromEntries(Object.entries(cat).filter(([, o]) => (!o.mundo || o.mundo === mundo) && !(o.foraDe || []).includes(mundo)));

const M = J('MUNDOS')[mundo];
const seccoes = [
  ['abertura', 'Prelúdios e mentores', { PRELUDIOS: J('PRELUDIOS'), MENTORES: J('MENTORES') }],
  ['missao', 'Missões, vilões e reviravoltas', { OBJETIVOS: M.OBJETIVOS, VILOES: M.VILOES, REVIRAVOLTAS: M.REVIRAVOLTAS, RELIQUIAS: M.RELIQUIAS, REFENS: M.REFENS }],
  ['ganchos', 'Prólogos (ganchos)', { GANCHOS: M.GANCHOS }],
  ['etapas', 'Etapas da missão', { ETAPAS_MUNDO: J('ETAPAS_MUNDO')[mundo], ETAPAS_GERAIS: J('ETAPAS_GERAIS'), ETAPA_AGORA: J('ETAPA_AGORA') }],
  ['encontros', 'Encontros na estrada', { ENCONTROS: M.ENCONTROS, BONS_ENCONTROS: M.BONS_ENCONTROS, SURPRESAS: M.SURPRESAS, CONSEQUENCIAS: M.CONSEQUENCIAS }],
  ['busca', 'Busca de pistas', { CENAS_BUSCA: J('CENAS_BUSCA'), DICAS: J('DICAS'), FRAQUEZAS: J('FRAQUEZAS'), PRESSAGIOS: M.PRESSAGIOS }],
  ['tempo', 'Atrasos e fins', { ATRASOS: M.ATRASOS, FIM_MORTE: M.FIM_MORTE, FIM_TARDE: M.FIM_TARDE, MERCADOR_SECRETO: M.MERCADOR_SECRETO }],
  ['lugares', 'Lugares e lore', { LUGARES: M.LUGARES, MAPA: { titulo: M.MAPA.titulo }, LORE: M.LORE }],
  ['herois', 'Classes, raças e antecedentes', { CLASSES: doMundo(J('CLASSES')), RACAS: doMundo(J('RACAS')), ANTECEDENTES: doMundo(J('ANTECEDENTES')), EVOLUCOES: J('EVOLUCOES'), CARTAS_UNICAS: J('CARTAS_UNICAS') }],
  ['cartas', 'Objetos, talentos, manobras e aliados', { ITENS: doMundo(J('ITENS')), TALENTOS: doMundo(J('TALENTOS')), MANOBRAS: J('MANOBRAS'), ALIADOS: doMundo(J('ALIADOS')), JEITOS: J('JEITOS'), TATICAS: J('TATICAS') }],
];

const vistos = new Set();
const out = { mundo, titulo: M.MAPA.titulo, gerado: new Date().toISOString().slice(0, 10), seccoes: seccoes.map(([id, nome, grupos]) => {
  const itens = [];
  Object.entries(grupos).forEach(([g, o]) => o && recolher(o, g, itens));
  return { id, nome, itens: itens.filter(i => !vistos.has(i.k) && vistos.add(i.k)) };
}) };
process.stdout.write(JSON.stringify(out));
