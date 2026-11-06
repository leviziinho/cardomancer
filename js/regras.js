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
    trama: null, rumo: null, fio: 0, dicas: 0, rastro: null, fragmentos: 0, fraquezas: [], destinoRevelado: false, etapaUm: null, reforcos: 0,
    diario: [], melhorias: {}, gastos: [], evolucao: null, mentorVisto: false, emCombate: false,
    tend: { bem: 0, ordem: 0 },
    log: { testes: 0, sucessos: 0, cartasRaras: 0, comprados: 0, dano: 0, noites: 0, pocoes: 0, combates: 0, criticos: 0, onde: 'Prólogo', causa: '', danoEm: {}, etapas: [] },
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
  if (a.ficha) return { id, nome: a.nome, cura: 0, ...a.ficha };
  return {
    id, nome: a.nome, acao,
    pv: 6 + sorte(5) + forte * 2, ca: 10 + sorte(3) + (forte ? 1 : 0), ataque: 2 + sorte(2) + forte,
    dado: forte || sorte(3) === 0 ? 'd8' : 'd6', cura: 3 + sorte(2),
  };
}
function resumoAliado(f) {
  const faz = { cura: `Cura ${f.cura} por ronda`, guarda: 'Protege: +2 na sua CA', olhos: 'Ataca-lhe os olhos: -2 no ataque dele', teia: 'Teia: ele perde a vez, uma vez por combate', veneno: `Morde +${f.ataque}, ${f.dado}, e envenena` }[f.acao] || `Ataca +${f.ataque}, dano ${f.dado}`;
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
// Há classes que somam um atributo à CA; a fúria do Bárbaro tira-lhe 2.
// O que o herói aguenta de cada golpe em combate (o talento Robusto). Nunca fica abaixo de 1.
const golpeNoHeroi = d => Math.max(1, d - talentosAtivos().reduce((s, t) => s + (t.aguenta || 0), 0));
const caJogador = () => COMBATE.caBase + Math.floor(Math.max(0, attr('agilidade')) / 2)
  + itensCorpo().reduce((s, it) => s + (it.ca || 0), 0) + somaMelhorias('ca')
  + (G.cls && CLASSES[G.cls].caDe ? Math.max(0, attr(CLASSES[G.cls].caDe)) : 0) - (G.emFuria ? 2 : 0);
// O Guerreiro soma a Força ao dano da arma.
const danoClasse = () => (G.cls && CLASSES[G.cls].danoDe ? Math.max(0, attr(CLASSES[G.cls].danoDe)) : 0);

function attr(a) {
  let v = 0;
  const soma = o => { if (o && o.attrs && o.attrs[a]) v += o.attrs[a]; };
  soma(CLASSES[G.cls]); soma(ANTECEDENTES[G.bg]); soma(RACAS[G.raca]); soma(evolucao());
  itensCorpo().forEach(soma);
  talentosAtivos().forEach(soma);
  if (a === 'forca' && G.emFuria) v += 3;
  return v;
}

// Quando o máximo desce (um aliado cai, um objeto sai), a Vida desce com ele.
const acertarVida = () => { if (G && G.cls) G.vida = Math.min(G.vida, vidaMax()); };

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

const podeEquipar = id => { const p = ITENS[id].perfil; return !p || !G.cls || (PERFIS[G.cls] || []).includes(p); };
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
// Vantagem: dois d20, fica o melhor. Vem da classe (o Ladino) ou da preparação: o objeto certo na mochila.
// O objeto só se gasta num teste difícil (menos de 80% sem ele), para não se perder no que já ia correr bem.
const PREPARO_DIFICIL = .8;
function fonteVantagem(o) {
  if (!o.roll || G.emCombate || !G.cls) return null;
  if ((CLASSES[G.cls].vantagem || []).includes(atributoDe(o))) return { nome: CLASSES[G.cls].nome };
  const id = G.mochila.find(k => ITENS[k].prepara && ITENS[k].prepara === o.tipo);
  return id && chanceSimples(o) < PREPARO_DIFICIL ? { nome: ITENS[id].nome, item: id } : null;
}
const temVantagem = o => !!fonteVantagem(o);

// Probabilidade de passar: um 1 falha sempre, um 20 passa sempre.
function chanceSimples(o) {
  const precisa = dcDe(o) - bonusDe(o);
  return Math.min(.95, Math.max(.05, (21 - precisa) / 20));
}
function chanceDe(o) {
  const p = chanceSimples(o);
  return repeteTeste(o) || temVantagem(o) ? 1 - (1 - p) * (1 - p) : p;
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
    .replace(/\{vilao\}/g, t.troca ? t.troca.nome : v.nome)
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

// ---------- O fio da história: três etapas, e a última é o próprio objetivo ----------
// Etapa 1: uma cena escolhida no início da partida. Etapa 2: a Reviravolta, disfarçada de tarefa normal.
// Etapa 3: o objetivo da missão, no destino, contra o chefe. Só a missão faz andar o fio; as pistas não.

function avancarFio() {
  G.fio++;
  // Para o simulador: como o herói chega a cada etapa.
  G.log.etapas.push({ dia: G.dia, vida: G.vida, vidaMax: vidaMax() });
  G.dicas = 0;
  if (G.fio >= ETAPAS_DA_MISSAO - 1) {
    G.destinoRevelado = true;
    G.rumo = null;
    return fmt(' Já não há dúvida: tudo acaba em {destino}.');
  }
  G.rumo = sitioPerto(G.rastro, 2);
  // A ponte leva à etapa da Reviravolta sem a revelar: o jogador só vê uma tarefa nova.
  const rev = REVIRAVOLTAS[G.trama.reviravolta];
  return rev.ponte ? ` ${fmt(rev.ponte)}` : fmt(' Agora sabe para onde ir: {proximo}.');
}

// O que fazer em cada etapa, no imperativo. Sem texto próprio (outros mundos), usa a frase geral.
function tarefaDaEtapa(n) {
  if (!G.trama) return '';
  if (n === 0) return fmt((G.etapaUm && G.etapaUm.agora) || ETAPA_AGORA[0]);
  if (n === 1) return fmt(REVIRAVOLTAS[G.trama.reviravolta].agora || ETAPA_AGORA[1]);
  return fmt(OBJETIVOS[G.trama.objetivo].titulo);
}
// A lista da missão: as etapas feitas e a de agora. A seguinte só aparece quando a anterior se cumpre.
function listaDaMissao(html = false) {
  if (!G.trama) return [];
  const destino = VILOES[G.trama.vilao].destino;
  const agora = Math.min(G.fio, ETAPAS_DA_MISSAO - 1);
  return Array.from({ length: agora + 1 }, (_, n) => ({
    feito: n < agora,
    texto: n < agora ? tarefaDaEtapa(n)
      : n === ETAPAS_DA_MISSAO - 1 ? `${tarefaDaEtapa(n)} em ${nomeRealcado(destino, html)}, ${aEstradas(estradasAte(destino))}`
        : `${tarefaDaEtapa(n)} em ${nomeRealcado(G.rumo, html)}, ${aEstradas(estradasAte(G.rumo))}`,
  }));
}

// Com html, o nome da cidade vem realçado: "Interrogue o suspeito em <b>Abiad</b>".
const nomeRealcado = (id, html) => (html ? `<b class="cidade">${LUGARES[id].nome}</b>` : LUGARES[id].nome);
const aEstradas = n => (n === 0 ? 'aqui mesmo' : `a ${n} ${n === 1 ? 'estrada' : 'estradas'}`);

// ---------- A tendência: as escolhas do herói vão-no definindo ----------
// Dois eixos escondidos. Bem: ajudar o povo e os Rebeldes do Opositor. Mal: servir o Império, ou a crueldade.
// Ordem: a palavra dada, a lei, a paciência. Caos: o truque, o roubo, a pressa.
// O jogador só vê o nome (um dos nove); uma carta pode trazer o seu próprio "tend", que manda sobre as palavras.
const TEND_LIMIAR = 3, TEND_MAX = 8;
const PALAVRAS_TEND = [
  [/\b(ajudar|ajudá-l|salvar|salvá-l|proteger|curar|libertar|soltar|poupar|partilhar|abrigar|consolar|socorrer|defender|rebeldes?|opositor|deixar uma moeda|dar-lhe)/, { bem: 1 }],
  [/\b(ameaçar|ameaçá-l|torturar|matar|entregá-l|entregar|denunciar|vendê-l|chantagear|humilhar|assustar|intimidar|extorquir|em nome do império|selo do império|servir o império)/, { bem: -1 }],
  [/\b(roubar|roubá-l|tirar-lh|enganar|enganá-l|mentir|arrombar|subornar|esgueirar|trapacear|fingir|disfarçar|furtar|às escondidas|fugir)/, { ordem: -1 }],
  [/\b(prometer|jurar|pagar|esperar|pedir licença|cumprimentar|respeitar|dizer a verdade|mostrar os papéis|obedecer|cumprir|negociar|apresentar-se)/, { ordem: 1 }],
];
function tendenciaDe(o) {
  if (o.tend) return o.tend;
  if (typeof TEND_CARTAS !== 'undefined' && TEND_CARTAS[o.t]) return TEND_CARTAS[o.t];
  const t = `${o.t || ''} ${o.d || ''}`.toLowerCase();
  const d = { bem: 0, ordem: 0 };
  PALAVRAS_TEND.forEach(([re, v]) => { if (re.test(t)) Object.keys(v).forEach(k => { d[k] += v[k]; }); });
  return { bem: Math.sign(d.bem), ordem: Math.sign(d.ordem) };
}
function nomeTendencia() {
  const b = G.tend.bem >= TEND_LIMIAR ? 'Bom' : G.tend.bem <= -TEND_LIMIAR ? 'Mau' : 'Neutro';
  const o = G.tend.ordem >= TEND_LIMIAR ? 'Leal' : G.tend.ordem <= -TEND_LIMIAR ? 'Caótico' : 'Neutro';
  return b === 'Neutro' && o === 'Neutro' ? 'Neutro' : `${o} ${b}`;
}
// O que a escolha diz de si, numa ficha da página: "Pende para o Bem", "Pende para o Caos"...
function pendeDe(d) {
  const lados = [d.bem > 0 && 'o Bem', d.bem < 0 && 'o Mal', d.ordem > 0 && 'a Ordem', d.ordem < 0 && 'o Caos'].filter(Boolean);
  return lados.length ? `Pende para ${lados.join(' e ')}` : '';
}
// A máscara que a carta leva no fundo: feliz se puxa para o Bem, triste se puxa para o Mal,
// de lábios cerrados se só mexe na Ordem ou no Caos. Sem tendência, nenhuma.
function mascaraDe(o) {
  const d = tendenciaDe(o);
  return d.bem > 0 ? 'bom' : d.bem < 0 ? 'mau' : d.ordem ? 'neutro' : null;
}
// Devolve o nome novo, se a escolha mudou a tendência; senão, nada.
function mexerTendencia(o) {
  const antes = nomeTendencia(), d = tendenciaDe(o);
  G.tend.bem = Math.max(-TEND_MAX, Math.min(TEND_MAX, G.tend.bem + d.bem));
  G.tend.ordem = Math.max(-TEND_MAX, Math.min(TEND_MAX, G.tend.ordem + d.ordem));
  const agora = nomeTendencia();
  return agora !== antes ? agora : null;
}
// Quem serviu o Império até ao fim encontra, na última porta, alguém do outro lado.
function decidirChefe() {
  const t = G.trama;
  if (t.ladoDecidido) return null;
  t.ladoDecidido = true;
  const v = VILOES[t.vilao];
  // Para testar a troca sem ter de jogar do lado do Império: ?tendencia=mau no endereço.
  if (typeof location !== 'undefined' && /[?&]tendencia=mau/.test(location.search)) G.tend.bem = Math.min(G.tend.bem, -TEND_LIMIAR);
  if (G.tend.bem > -TEND_LIMIAR || !v.rival) return null;
  t.troca = { ...v.rival };
  t.motivo = v.rival.motivo || 'Soube de tudo o que fez pelo Império, e veio cobrar em nome de Daraan.';
  const saiu = !!(v.rival.aliado && G.aliados.includes(v.rival.aliado));
  if (saiu) { G.aliados = G.aliados.filter(a => a !== v.rival.aliado); acertarVida(); }
  return { saiu };
}

function objetivoAgora(html = false) {
  if (!G.trama) return '';
  const destino = VILOES[G.trama.vilao].destino;
  if (G.destinoRevelado) return `${tarefaDaEtapa(ETAPAS_DA_MISSAO - 1)} em ${nomeRealcado(destino, html)}, onde tudo acaba`;
  const alvo = G.rumo || destino;
  return `${tarefaDaEtapa(G.fio)} em ${nomeRealcado(alvo, html)}, ${aEstradas(estradasAte(alvo))}`;
}
function pistaAgora(html = false) {
  if (!G.trama || !G.rastro) return '';
  const frag = `${G.fragmentos} de ${FRAGMENTOS_POR_PISTA} fragmentos`;
  if (G.rastro === G.lugar) return `Procure aqui a pista ${G.pistas + 1}, com ${frag}`;
  return `Procure a pista ${G.pistas + 1} em ${nomeRealcado(G.rastro, html)}, ${aEstradas(estradasAte(G.rastro))}, com ${frag}`;
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

// A fraqueza de cada pista: a do próprio vilão (VILOES[...].fraquezas, tirada da história) ou, nos mundos
// que ainda não a têm, uma das gerais. O efeito no combate vem sempre de FRAQUEZAS.
function fraquezaDaPista(n) {
  const propria = (VILOES[G.trama.vilao].fraquezas || [])[n];
  if (propria) return { ...FRAQUEZAS[propria.efeito], nome: propria.nome, lore: propria.lore || '', efeito: propria.efeito };
  return { ...FRAQUEZAS[G.fraquezas[n]], lore: '', efeito: G.fraquezas[n] };
}
const fraquezaDe = d => d.fq || FRAQUEZAS[d.fraqueza];

function ganharFragmento() {
  G.fragmentos++;
  if (G.fragmentos < FRAGMENTOS_POR_PISTA) return { texto: `Mais um pedaço da pista (${G.fragmentos} de ${FRAGMENTOS_POR_PISTA}): "${pedacoDaPista()}"` };
  const completa = fmt(VILOES[G.trama.vilao].pistas[G.pistas]);
  const f = fraquezaDaPista(G.pistas);
  G.diario.push({ lugar: LUGARES[G.lugar].nome, texto: completa, fraqueza: f.efeito, fq: f });
  G.pistas++;
  G.fragmentos = 0;
  escolherPista();
  let texto = `A pista fica inteira: "${completa}" Descobriu ${f.nome}.${f.lore ? ` ${fmt(f.lore)}` : ''} ${f.desc}`;
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
  // A primeira etapa escolhe-se já, para a lista da missão dizer desde o início o que há a fazer.
  G.etapaUm = umDe([...ETAPAS_GERAIS.flat(), ...(ETAPAS_MUNDO[G.mundo] || []).flat()]);
  G.reforcos = 0;
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
const etapaDoMundo = () => Math.min(G.fio, SUBIDA.maisPorEtapa.length - 1);
const subidaNivel = () => SUBIDA.maisPorEtapa[etapaDoMundo()];
const pvDoInimigo = o => Math.ceil(o.roll.pv * COMBATE.escalaPv * (1 + SUBIDA.pvPorEtapa[etapaDoMundo()]));

function opcoesDaCena(cena) {
  // As dicas que ouviu pelo caminho facilitam a etapa seguinte.
  const dica = cena.etapa ? Math.min(G.dicas, 3) : 0;
  // As cenas da missão são mais duras do que as outras: testes e inimigos sobem SUBIDA.cenaDaEtapa.
  const extra = cena.etapa ? SUBIDA.cenaDaEtapa : 0;
  const sobe = o => (o.roll ? { ...o, dcExtra: (o.dcExtra || 0) + subidaNivel() + extra - dica } : o);
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
  let d20 = dado(20), vantagem = null;
  const fonte = fonteVantagem(o);
  if (fonte) {
    vantagem = [d20, dado(20)]; d20 = Math.max(...vantagem);
    // O objeto da mochila gasta-se ao dar a vantagem.
    if (fonte.item) { G.mochila.splice(G.mochila.indexOf(fonte.item), 1); G.log.preparos = (G.log.preparos || 0) + 1; }
  }
  const bonus = bonusDe(o), dc = dcDe(o);
  const passou = v => v === 20 || (v !== 1 && v + bonus >= dc);
  let repetiu = false;
  if (!passou(d20) && repeteTeste(o)) { d20 = dado(20); repetiu = true; }
  const ok = passou(d20);
  const out = { ok, d20, bonus, dc, total: d20 + bonus, repetiu, vantagem, fonte: fonte && fonte.nome, critico: d20 === 20, falhaCritica: d20 === 1 };
  if (out.critico || out.falhaCritica) G.log.criticos++;
  if (o.dadoDano) {
    out.tipoDado = o.dadoDano;
    out.dadoArma = dado(parseInt(o.dadoDano.slice(1), 10));
    out.dano = (out.dadoArma + danoExtra() + (o.usaArma ? danoClasse() : 0) + ((o.m && o.m.mais) || 0)) * (out.critico ? 2 : 1);
    out.pv = o.roll.pv || 0;
  }
  return out;
}

// ---------- Combate ----------

const jeitoDe = nome => Object.keys(JEITOS).find(k => JEITOS[k].busca.test(nome)) || null;

// O inimigo que uma opção de combate põe à frente do jogador.
// O nome do ficheiro do retrato de um inimigo: "Os Goblins da Estrada" dá "goblins-da-estrada".
// Inimigos sem pintura própria que usam a de outro parecido (os que faltam estão em docs/arte-pendente.md).
const RETRATO_IGUAL = { 'soldados-do-imperio': 'soldados-imperiais', vigias: 'tres-soldados', 'simony-a-brincar': 'simony' };
// Tira o "Lendário:", os nomes que mudam ({vilao}) e o artigo do início.
function chaveInimigo(nome) {
  const k = nome.replace(/^Lendário:\s*/, '').replace(/\s*\{[^}]*\}/g, '').replace(/^(os|as|o|a)\s+/i, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return RETRATO_IGUAL[k] || k;
}

function inimigoDe(o, cena) {
  const golpeBase = o.ko && o.ko.fx && o.ko.fx.vida ? -o.ko.fx.vida : 3;
  const pv = pvDoInimigo(o), dc = o.roll.dc + (o.dcExtra || 0);
  return {
    nome: fmt(o.roll.ini || cena.titulo),
    pv, pvMax: pv,
    defesa: dc,
    ataque: dc - COMBATE.ataqueMenos,
    dado: golpeBase >= 6 ? 'd10' : golpeBase >= 5 ? 'd8' : 'd6',
    mais: subidaNivel() + (o.roll.mais || 0),
    agi: dc - 11,
    primeiro: o.roll.primeiro || null,
    treino: !!o.roll.treino,
    jeito: o.roll.jeito || jeitoDe(fmt(o.roll.ini || cena.titulo)),
    retrato: `retratosLivro/inimigo-${chaveInimigo(o.roll.ini || cena.titulo)}`,
  };
}

// O chefe final: tem PV a sério e, em cada ronda, um efeito e um ataque.
function chefeFinal() {
  const v = VILOES[G.trama.vilao];
  const trunfos = Object.keys(TRUNFOS).filter(m => G.marcas.has(m)).length;
  // Cada pista completa é uma fraqueza que se leva para a última porta.
  const sabe = G.diario.map(fraquezaDe);
  const soma = campo => sabe.reduce((t, f) => t + (f[campo] || 0), 0);
  // Cada chefe pode ter o seu ajuste sobre o chefe de base (o Santo é mais difícil de acertar).
  const aj = v.ajuste || {};
  const pv = Math.ceil((COMBATE.vilao.pv + (aj.pv || 0)) * (1 - soma('pv')));
  const ca = Math.max(7, COMBATE.vilao.ca + (aj.ca || 0) + subidaNivel() - trunfos - soma('ca'));
  return {
    nome: fmt('{vilao}').replace(/^./, m => m.toUpperCase()),
    pv, pvMax: pv, defesa: ca, caBase: ca,
    ataque: COMBATE.vilao.ataque + (aj.ataque || 0) + subidaNivel() - soma('ataque'),
    dado: COMBATE.vilao.dado, agi: 3,
    primeiro: sabe.some(f => f.calado) ? 'jogador' : null, calado: sabe.some(f => f.calado), sabe: [...sabe.map(f => f.nome), ...Object.keys(TRUNFOS).filter(m => G.marcas.has(m)).map(m => TRUNFOS[m])].join('  ·  '),
    chefe: true, efeitos: sabe.some(f => f.semEfeito) ? null : v.efeitos, frases: v.ronda, fraqueza: v.fraqueza.includes(G.cls),
    capitulo: 'Capítulo Final', abertura: `${v.finalTexto} ${G.trama.motivo}`, retrato: `retratosLivro/${G.trama.vilao}`,
  };
}

// Os guardas do chefe: os aliados têm de passar por eles antes de lhe chegar.
// Os reforços (de uma Reviravolta que correu mal) juntam-se sempre, mesmo a quem vem sozinho.
function guardasDoChefe(aliados) {
  const g = COMBATE.vilao.guarda, n = Math.min(COMBATE.vilao.guardasMax, aliados) + (G.reforcos || 0);
  const pv = Math.ceil(g.pv * (1 + SUBIDA.pvPorEtapa[etapaDoMundo()]));
  return Array.from({ length: n }, (_, i) => ({ nome: n > 1 ? `Guarda ${i + 1}` : 'O Guarda', pv, pvMax: pv, defesa: g.ca, ataque: g.ataque + subidaNivel(), dado: g.dado, mais: 0 }));
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
    tipo: 'combate', usaArma: true, dadoDano: a.dado, roll: { a: atributoArma(), dc: ini.defesa }, danoMedio: media(a.dado) + danoExtra() + danoClasse(),
    glyph: a.glyph || 'sword',
  };
  const mais = danoExtra() + danoClasse();
  o.ganhoTexto = `Dano ${a.dado}${mais ? `+${mais}` : ''}`;
  return o;
}

function cartaManobra(m, ini) {
  const base = { t: m.t, d: m.d, tipo: 'combate', tema: m.magia ? 'magia' : 'tecnica', etiqueta: m.magia ? 'Magia' : 'Técnica', glyph: m.glyph, m };
  const partes = [];
  if (m.dado) partes.push(`Dano ${m.dado}`);
  if (m.cura) partes.push(`+${m.cura} Vida`);
  if (m.custo) partes.push(`custo: ${m.custo} Vida`);
  if (m.enfraquece) partes.push(`Defesa -${m.enfraquece}`);
  if (m.furia) partes.push('+3 Força', '-2 CA');
  if (m.misseis) { partes.push(`Dano ${G.nivel + 1}d4, sem teste`); base.danoMedio = (G.nivel + 1) * 2.5; }
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
  const evo = evolucao(), sempre = CLASSES[G.cls].curaSempre;
  const fixa = sempre ? (MANOBRAS[G.cls] || []).find(m => m.id === sempre) : null;
  const baralho = [...(evo ? [evo.manobra] : []), ...baralhar(MANOBRAS[G.cls] || [])]
    .filter(m => m !== fixa && !usadas.has(m.id) && !(ini.chefe && (m.vence || m.fuga)) && !(G.emFuria && (m.fuga || m.furia)));
  baralho.slice(0, fixa ? 1 : 2).forEach(m => mao.push(cartaManobra(m, ini)));
  if (fixa) mao.push(cartaManobra(fixa, ini));
  if (G.mochila.includes('pocao')) {
    mao.push({
      t: 'Beber a Poção', d: `Recupera ${ITENS.pocao.uso.vida} de Vida, e a seguir é a vez dele.`, tema: 'equipamento', etiqueta: 'Mochila', glyph: 'drop',
      pocao: true, bloqueada: G.vida >= vidaMax() ? 'Vida cheia' : null, ganhoTexto: `+${ITENS.pocao.uso.vida} Vida`,
    });
  }
  if (ini.chefe) return [...mao, ...cartasDoChefe(ini, usadas)].slice(0, 5);
  if (G.emFuria) return mao;
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
  if (G.vida < antes) {
    G.log.dano += antes - G.vida;
    const onde = G.emCombate ? `${G.log.onde} · combate` : G.log.onde;
    G.log.danoEm[onde] = (G.log.danoEm[onde] || 0) + antes - G.vida;
  }
}

// A segunda oportunidade: uma vez por partida, só na primeira etapa da missão (quem começa mal) e nunca contra o chefe.
// Quem cai a 0 de Vida acorda deixado por morto, com um terço da Vida, sem ouro nenhum e três dias depois.
const SEGUNDA = { vida: 1 / 3, dias: 3, ateEtapa: 0 };
const TEXTO_SEGUNDA = 'Acorda numa vala, sem bolsa e sem saber quanto tempo passou. Alguém lhe pôs um pano na ferida e foi-se embora. Esta sorte não se repete.';
function segundaOportunidade() {
  if (G.vida > 0 || G.segunda || G.emCombate || G.emCombateFinal || G.fio > SEGUNDA.ateEtapa) return false;
  G.segunda = true;
  G.vida = Math.max(1, Math.ceil(vidaMax() * SEGUNDA.vida));
  G.ouro = 0;
  G.dia += SEGUNDA.dias;
  G.log.segunda = 1;
  return true;
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
