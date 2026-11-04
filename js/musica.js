// Trilha sonora composta, feita em tempo real e sem ficheiros: harpa e alaúde de cordas beliscadas,
// flauta com sopro, cordas graves e tambor de pele, tudo dentro de uma sala com eco natural.
// As melodias estão escritas à mão. Só a ordem das frases e a interpretação mudam em cada partida.

const musica = (() => {
  // Uma nota é [semitons a partir da raiz, duração em colcheias]. null é silêncio.
  const MODOS = {
    // Uma balada em ré dórico, a seis por oito, para a estrada.
    calma: {
      bpm: 84, compasso: 6, raiz: 50, volume: .95,
      acordes: {
        A: [[0, 7, 12, 15], [10, 17, 22, 26], [5, 12, 17, 21], [0, 7, 12, 15], [3, 10, 15, 19], [10, 17, 22, 26], [5, 12, 17, 21], [7, 14, 19, 24]],
        B: [[3, 10, 15, 19], [10, 17, 22, 26], [0, 7, 12, 15], [5, 12, 17, 21], [3, 10, 15, 19], [5, 12, 17, 21], [7, 14, 19, 22], [0, 7, 12, 15]],
      },
      arpejo: [0, 2, 1, 3, 2, 1],
      frases: {
        A: [[[12, 3], [15, 2], [17, 1], [19, 4], [17, 2], [15, 3], [14, 1], [12, 2], [10, 3], [12, 3], [null, 6]], [[17, 3], [19, 2], [22, 1], [24, 4], [22, 2], [19, 3], [17, 2], [15, 1], [14, 3], [12, 3], [null, 6]]],
        B: [[[19, 2], [22, 1], [24, 3], [26, 2], [24, 1], [22, 3], [19, 3], [17, 2], [19, 1], [15, 6], [null, 6]], [[24, 4], [22, 2], [19, 3], [17, 3], [15, 2], [17, 1], [19, 3], [14, 3], [12, 6], [null, 6]]],
      },
      forma: ['A', 'A', 'B', 'A', null], tambor: null, cordasGraves: true, flauta: true, harpa: 1,
    },
    // Um combate em lá menor: ostinato de cordas, tambor a cavalgar e uma flauta aflita por cima.
    combate: {
      bpm: 132, compasso: 8, raiz: 45, volume: .9,
      acordes: {
        A: [[0, 7, 12, 15], [0, 7, 12, 15], [-4, 3, 8, 12], [-2, 5, 10, 14]],
        B: [[5, 12, 17, 20], [3, 10, 15, 19], [-2, 5, 10, 14], [-5, 2, 7, 10]],
      },
      arpejo: [0, 0, 2, 0, 1, 0, 3, 2],
      frases: {
        A: [[[12, 2], [15, 1], [17, 1], [19, 3], [15, 1], [20, 2], [19, 1], [17, 1], [15, 2], [14, 2], [12, 4], [null, 4]], [[24, 2], [22, 1], [20, 1], [19, 2], [15, 2], [17, 2], [19, 2], [20, 2], [17, 2], [15, 4], [null, 4]]],
        B: [[[17, 2], [20, 2], [24, 3], [22, 1], [19, 2], [22, 2], [24, 2], [26, 2], [22, 4], [19, 4]], [[24, 1], [24, 1], [22, 1], [24, 1], [26, 4], [24, 2], [22, 2], [19, 4], [14, 4]]],
      },
      forma: ['A', 'A', 'B', 'A'], tambor: [1, 0, .45, .6, 1, 0, .7, .5], cordasGraves: true, flauta: true, harpa: .75,
      pele: [0, .55, .3, .7, 0, .6, .35, .9], bombo: [1, 0, 0, 0, .75, 0, 0, 0],
    },
    // O chefe: lento e pesado, em sol menor, com um coro de vozes por baixo.
    chefe: {
      bpm: 72, compasso: 8, raiz: 43, volume: 1,
      acordes: {
        A: [[0, 7, 12, 15], [1, 8, 13, 17], [0, 7, 12, 15], [-2, 5, 10, 13]],
        B: [[3, 10, 15, 19], [1, 8, 13, 17], [-4, 3, 8, 12], [-5, 2, 7, 11]],
      },
      arpejo: [0, 1, 0, 2, 0, 1, 0, 3],
      frases: {
        A: [[[12, 4], [13, 2], [15, 2], [12, 4], [null, 4], [19, 3], [18, 1], [15, 2], [13, 2], [12, 4], [null, 4]]],
        B: [[[24, 4], [25, 2], [24, 2], [20, 4], [19, 4], [22, 3], [20, 1], [19, 2], [15, 2], [18, 4], [19, 4]]],
      },
      forma: ['A', 'B', 'A', 'B'], tambor: [1, 0, 0, 0, .7, 0, .35, .35], cordasGraves: true, flauta: false, harpa: .7, coro: true,
      pele: [0, 0, .4, 0, 0, .5, .3, .6], bombo: [1, 0, 0, 0, 0, 0, .6, 0],
    },
  };

  // O prelúdio: improviso livre sobre um bordão, no modo grego da classe. Ninguém o escreveu: nasce em cada partida.
  MODOS.preludio = { bpm: 76, compasso: 6, raiz: 50, volume: .9, improviso: true, forma: [null], acordes: {}, frases: {} };
  // Os sete modos, em semitons, e a nota que lhes dá a cor (o índice na escala), que o improviso procura mais vezes.
  const ESCALAS = {
    jonio: { notas: [0, 2, 4, 5, 7, 9, 11], cor: 6 },
    dorico: { notas: [0, 2, 3, 5, 7, 9, 10], cor: 5 },
    frigio: { notas: [0, 1, 3, 5, 7, 8, 10], cor: 1 },
    lidio: { notas: [0, 2, 4, 6, 7, 9, 11], cor: 3 },
    mixolidio: { notas: [0, 2, 4, 5, 7, 9, 10], cor: 6 },
    eolio: { notas: [0, 2, 3, 5, 7, 8, 10], cor: 5 },
    locrio: { notas: [0, 1, 3, 5, 6, 8, 10], cor: 4 },
  };
  // Cada classe tem o seu modo; as que o partilham distinguem-se no instrumento, no registo e no andamento.
  const MODO_DA_CLASSE = {
    clerigo: { escala: 'jonio', raiz: 52, flauta: true, bpm: 70 },
    patrulheiro: { escala: 'dorico', raiz: 50, flauta: true, bpm: 80 },
    druida: { escala: 'dorico', raiz: 50, flauta: false, bpm: 72 },
    monge: { escala: 'frigio', raiz: 52, flauta: true, bpm: 64 },
    mago: { escala: 'lidio', raiz: 53, flauta: false, bpm: 72 },
    feiticeiro: { escala: 'lidio', raiz: 53, flauta: true, bpm: 84 },
    bardo: { escala: 'mixolidio', raiz: 50, flauta: false, bpm: 92 },
    barbaro: { escala: 'eolio', raiz: 45, flauta: false, bpm: 88 },
    guerreiro: { escala: 'eolio', raiz: 45, flauta: true, bpm: 76 },
    ladino: { escala: 'locrio', raiz: 47, flauta: false, bpm: 80 },
  };
  // A abertura: Si menor (Eólio em Si), na harpa, devagar, enquanto o jogador ainda não começou.
  MODOS.abertura = { ...MODOS.preludio, bpm: 62 };
  const ABERTURA = { escala: 'eolio', raiz: 47, flauta: false, bpm: 62 };
  let improviso = { ...MODO_DA_CLASSE.clerigo, grau: 7, compassos: 0 };

  let ac = null, saida = null, sala = null, medidor = null, relogio = null, grupos = {};
  let atual = 'calma', ligada = true, proxima = 0, passo = 0, seccao = 0;
  const notasCordas = new Map();

  const hertz = n => 440 * Math.pow(2, (n - 69) / 12);
  const quase = v => v * (1 + (Math.random() - .5) * .16);

  // Uma sala de pedra: um rasto de ruído que vai escurecendo e morrendo devagar.
  function criarSala(segundos = 3.4) {
    const n = Math.floor(ac.sampleRate * segundos), buf = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let baixo = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n, escuro = .08 + .55 * Math.pow(1 - t, 2);
        baixo += (Math.random() * 2 - 1 - baixo) * escuro;
        d[i] = baixo * Math.pow(1 - t, 2.6) * (i < 400 ? i / 400 : 1);
      }
    }
    const conv = ac.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  // Uma corda beliscada a sério (Karplus-Strong): um sopro de ruído a circular numa linha, a perder brilho.
  function amostraCorda(nota, brilho) {
    const chave = `${nota}|${brilho}`;
    if (notasCordas.has(chave)) return notasCordas.get(chave);
    const sr = ac.sampleRate, f = hertz(nota), dur = Math.min(4.2, 1.2 + 260 / f), n = Math.floor(sr * dur);
    const buf = ac.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const P = Math.max(2, Math.round(sr / f)), linha = new Float32Array(P);
    let ultimo = 0;
    for (let i = 0; i < P; i++) {
      // Belisca a corda perto da ponta: o som ganha corpo e perde o ar de campainha.
      ultimo += (Math.random() * 2 - 1 - ultimo) * brilho;
      linha[i] = ultimo;
    }
    const perda = Math.min(.9985, .9925 + f / 90000);
    let i0 = 0, ant = 0;
    for (let i = 0; i < n; i++) {
      const v = linha[i0];
      linha[i0] = perda * .5 * (v + ant);
      ant = v;
      d[i] = v;
      i0 = (i0 + 1) % P;
    }
    let pico = 0;
    for (let i = 0; i < n; i++) pico = Math.max(pico, Math.abs(d[i]));
    for (let i = 0; i < n; i++) d[i] /= pico || 1;
    notasCordas.set(chave, buf);
    return buf;
  }

  function corda(nota, t, vol, destino, { brilho = .6, tom = 2600, pan = 0 } = {}) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), caixa = ac.createBiquadFilter(), g = ac.createGain(), p = ac.createStereoPanner();
    s.buffer = amostraCorda(nota, brilho);
    f.type = 'lowpass'; f.frequency.value = tom;
    // O corpo de madeira do instrumento.
    caixa.type = 'peaking'; caixa.frequency.value = 280; caixa.Q.value = 1; caixa.gain.value = 5;
    g.gain.value = vol;
    p.pan.value = pan;
    s.connect(f); f.connect(caixa); caixa.connect(g); g.connect(p); p.connect(destino);
    s.start(t);
  }

  // Flauta de madeira: nasce devagar, treme um pouco, e leva o ar do sopro consigo.
  function flauta(nota, t, dur, vol, destino) {
    const fim = t + dur;
    const o = ac.createOscillator(), o2 = ac.createOscillator(), g2 = ac.createGain(), g = ac.createGain(), f = ac.createBiquadFilter();
    const trem = ac.createOscillator(), tremG = ac.createGain();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.setValueAtTime(hertz(nota) * .992, t);
    o.frequency.linearRampToValueAtTime(hertz(nota), t + .07);
    o2.frequency.value = hertz(nota) * 2; g2.gain.value = .1;
    trem.frequency.value = 4.6 + Math.random();
    tremG.gain.setValueAtTime(0, t);
    tremG.gain.linearRampToValueAtTime(hertz(nota) * .006, t + Math.min(.6, dur * .6));
    trem.connect(tremG); tremG.connect(o.frequency);
    f.type = 'lowpass'; f.frequency.value = 3200;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .09);
    g.gain.setValueAtTime(vol, Math.max(t + .1, fim - .14));
    g.gain.linearRampToValueAtTime(0, fim);
    o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(destino);
    [o, o2, trem].forEach(x => { x.start(t); x.stop(fim + .05); });
    // O ar.
    const ar = ac.createBufferSource(), arF = ac.createBiquadFilter(), arG = ac.createGain();
    ar.buffer = ruido(); ar.loop = true;
    arF.type = 'bandpass'; arF.frequency.value = hertz(nota) * 2; arF.Q.value = 3;
    arG.gain.setValueAtTime(0, t);
    arG.gain.linearRampToValueAtTime(vol * .35, t + .05);
    arG.gain.linearRampToValueAtTime(vol * .12, t + .22);
    arG.gain.linearRampToValueAtTime(0, fim);
    ar.connect(arF); arF.connect(arG); arG.connect(destino);
    ar.start(t, Math.random()); ar.stop(fim + .05);
  }

  let ruidoBuf = null;
  function ruido() {
    if (ruidoBuf) return ruidoBuf;
    ruidoBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = ruidoBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ruidoBuf;
  }

  // Um tambor de pele: pancada grave, com a palma da mão por cima.
  function tambor(t, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(128, t);
    o.frequency.exponentialRampToValueAtTime(58, t + .13);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.001, t + .42);
    o.connect(g); g.connect(destino);
    o.start(t); o.stop(t + .46);
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
    n.buffer = ruido();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .8;
    gn.gain.setValueAtTime(vol * .32, t);
    gn.gain.exponentialRampToValueAtTime(.001, t + .07);
    n.connect(f); f.connect(gn); gn.connect(destino);
    n.start(t, Math.random()); n.stop(t + .1);
  }

  // Um tambor de mão, mais agudo e seco: o polegar no meio da pele e os dedos na borda.
  function pele(t, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(330, t);
    o.frequency.exponentialRampToValueAtTime(190, t + .06);
    g.gain.setValueAtTime(vol * .7, t);
    g.gain.exponentialRampToValueAtTime(.001, t + .18);
    o.connect(g); g.connect(destino);
    o.start(t); o.stop(t + .2);
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
    n.buffer = ruido();
    f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 1.2;
    gn.gain.setValueAtTime(vol * .45, t);
    gn.gain.exponentialRampToValueAtTime(.001, t + .05);
    n.connect(f); f.connect(gn); gn.connect(destino);
    n.start(t, Math.random()); n.stop(t + .07);
  }

  // Um bombo grande de guerra: pouco ataque e muito corpo, que se sente mais do que se ouve.
  function bombo(t, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(82, t);
    o.frequency.exponentialRampToValueAtTime(38, t + .35);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.001, t + .9);
    o.connect(g); g.connect(destino);
    o.start(t); o.stop(t + .95);
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
    n.buffer = ruido();
    f.type = 'lowpass'; f.frequency.value = 380;
    gn.gain.setValueAtTime(vol * .5, t);
    gn.gain.exponentialRampToValueAtTime(.001, t + .16);
    n.connect(f); f.connect(gn); gn.connect(destino);
    n.start(t, Math.random()); n.stop(t + .2);
  }

  // Violoncelos e coro: várias vozes quase iguais, que respiram devagar, e mudam com o acorde.
  function acordeLongo(notas, t, dur, vol, destino, coro) {
    notas.forEach((n, i) => {
      [-7, 6].forEach(desvio => {
        const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
        o.type = coro ? 'triangle' : 'sawtooth';
        o.frequency.value = hertz(n);
        o.detune.value = desvio + Math.random() * 3;
        f.type = coro ? 'bandpass' : 'lowpass';
        f.frequency.setValueAtTime(coro ? 720 : 420, t);
        f.frequency.linearRampToValueAtTime(coro ? 880 : 760, t + dur * .55);
        f.frequency.linearRampToValueAtTime(coro ? 720 : 400, t + dur);
        if (coro) f.Q.value = 1.4;
        const v = vol / notas.length / (i ? 1.5 : 1);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + dur * .32);
        g.gain.setValueAtTime(v, t + dur * .7);
        g.gain.linearRampToValueAtTime(0, t + dur * 1.06);
        o.connect(f); f.connect(g); g.connect(destino);
        o.start(t); o.stop(t + dur * 1.1);
      });
    });
  }

  // A forma da peça: cada letra é uma estrofe, e null é um compasso só de acorde, para respirar.
  let letra = null, frase = [], fraseI = 0, resto = 0, acordeI = 0;
  function novaSeccao(m) {
    letra = m.forma[seccao % m.forma.length];
    seccao++;
    acordeI = 0; fraseI = 0; resto = 0;
    const frases = letra ? m.frases[letra] : [];
    frase = frases.length ? frases[Math.floor(Math.random() * frases.length)] : [];
  }

  // Um passo do improviso: o bordão no início de cada compasso, e por cima uma melodia que anda quase sempre
  // por graus vizinhos, salta de vez em quando, procura a nota de cor do modo, e volta à raiz no fim de cada frase.
  function improvisar(t, colcheia, m, g) {
    const p = passo % m.compasso, e = ESCALAS[improviso.escala], raiz = improviso.raiz;
    const nota = grau => raiz + 12 * Math.floor(grau / 7) + e.notas[((grau % 7) + 7) % 7];
    if (p === 0) {
      // No Lócrio, o bordão leva a quinta diminuta, que nunca descansa.
      const quinta = improviso.escala === 'locrio' ? 6 : 7;
      acordeLongo([raiz - 12, raiz - 12 + quinta, raiz], t, colcheia * m.compasso * 1.1, .12 * m.volume, g.seco, false);
      improviso.compassos++;
    }
    if (resto > 0) { resto--; passo++; return; }
    const fimDeFrase = improviso.compassos % 4 === 0 && p >= 3;
    if (fimDeFrase) improviso.grau = improviso.grau > 10 ? 14 : 7;
    else if (Math.random() < .14) { resto = 1 + Math.floor(Math.random() * 2); passo++; return; }
    else {
      const r = Math.random();
      const passoG = r < .62 ? (Math.random() < .5 ? -1 : 1) : r < .85 ? (Math.random() < .5 ? -2 : 2) : (Math.random() < .5 ? -4 : 3);
      improviso.grau = Math.max(3, Math.min(17, improviso.grau + passoG));
      // A nota de cor: de vez em quando, a melodia vai lá de propósito.
      if (Math.random() < .18) improviso.grau = 7 + e.cor;
    }
    const dur = fimDeFrase ? 4 : [1, 1, 1, 2, 2, 3][Math.floor(Math.random() * 6)];
    const n = nota(improviso.grau) + 12;
    if (improviso.flauta) flauta(n, t, colcheia * dur * .95, quase(.15 * m.volume), g.flauta);
    else corda(n, t, quase(.4 * m.volume), g.harpa, { brilho: .7, tom: 3400, pan: (Math.random() - .5) * .3 });
    // Por baixo, a harpa marca às vezes a raiz ou a quinta, para o ouvido não perder o centro.
    if (p === 0 || (p === 3 && Math.random() < .5)) corda(raiz + (p === 0 ? 0 : 7), t, quase(.2 * m.volume), g.harpa, { brilho: .4, tom: 1800, pan: -.2 });
    resto = dur - 1;
    passo++;
  }

  function tocarColcheia(t, colcheia) {
    const m = MODOS[atual], g = grupos[atual];
    if (m.improviso) { improvisar(t, colcheia, m, g); return; }
    const p = passo % m.compasso;
    if (p === 0 && (!letra || acordeI >= m.acordes[letra].length)) novaSeccao(m);
    if (!letra) {
      if (p === 0) {
        acordeLongo([m.raiz - 12, m.raiz - 5, m.raiz], t, colcheia * m.compasso * 2, .1 * m.volume, g.seco, false);
        corda(m.raiz + 12, t, .22 * m.volume, g.harpa, { brilho: .45, tom: 2000 });
      }
      passo++;
      return;
    }

    const lista = m.acordes[letra];
    const ac0 = lista[acordeI % lista.length];
    if (p === 0) {
      if (m.cordasGraves) acordeLongo([m.raiz + ac0[0] - 12, m.raiz + ac0[1] - 12, m.raiz + ac0[2]], t, colcheia * m.compasso, .17 * m.volume, g.seco, !!m.coro);
      if (m.coro) acordeLongo([m.raiz + ac0[0] + 12, m.raiz + ac0[1] + 12, m.raiz + ac0[3] + 12], t, colcheia * m.compasso, .09 * m.volume, g.seco, true);
    }
    // O arpejo, com o dedo nunca exatamente no mesmo sítio.
    const graus = ac0, idx = m.arpejo[p % m.arpejo.length];
    const folga = (Math.random() - .5) * .018;
    corda(m.raiz + graus[idx], t + Math.max(0, folga), quase((p === 0 ? .4 : .27) * m.harpa * m.volume), g.harpa, { brilho: .55, tom: p === 0 ? 3000 : 2300, pan: (idx - 1.5) * .22 });
    if (m.tambor && m.tambor[p]) tambor(t + Math.max(0, folga * .5), quase(.5 * m.tambor[p] * m.volume), g.seco);
    if (m.pele && m.pele[p]) pele(t + Math.max(0, folga * .3), quase(.4 * m.pele[p] * m.volume), g.seco);
    if (m.bombo && m.bombo[p]) bombo(t, quase(.75 * m.bombo[p] * m.volume), g.seco);
    // A meio do compasso, a pele dá às vezes duas pancadas rápidas, como um rufo curto.
    if (m.pele && p === m.compasso - 1 && Math.random() < .35) pele(t + colcheia / 2, quase(.3 * m.volume), g.seco);

    // A melodia corre ao seu próprio ritmo, independentemente do compasso.
    if (resto <= 0 && fraseI < frase.length) {
      const [nota, dur] = frase[fraseI];
      fraseI++;
      resto = dur;
      if (nota !== null) {
        const n = m.raiz + nota + 12;
        if (m.flauta) flauta(n, t + Math.max(0, folga), colcheia * dur * .96, quase(.16 * m.volume), g.flauta);
        else corda(n, t, quase(.42 * m.volume), g.harpa, { brilho: .75, tom: 3600, pan: .1 });
      }
    }
    resto--;
    if (p === m.compasso - 1) acordeI++;
    passo++;
  }

  function agendar() {
    if (!ligada || !ac) return;
    const colcheia = 60 / MODOS[atual].bpm / 2;
    if (proxima < ac.currentTime) proxima = ac.currentTime + .05;
    while (proxima < ac.currentTime + .6) {
      tocarColcheia(proxima, colcheia);
      proxima += colcheia;
    }
  }

  function iniciar() {
    if (ac) return;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      saida = ac.createGain();
      saida.gain.value = .5;
      medidor = ac.createAnalyser();
      medidor.fftSize = 2048;
      const compressor = ac.createDynamicsCompressor();
      compressor.threshold.value = -16; compressor.ratio.value = 3; compressor.attack.value = .01; compressor.release.value = .3;
      sala = criarSala();
      const molhado = ac.createGain();
      molhado.gain.value = .9;
      sala.connect(molhado); molhado.connect(compressor);
      saida.connect(compressor);
      compressor.connect(medidor);
      medidor.connect(ac.destination);
      Object.keys(MODOS).forEach(k => {
        const mestre = ac.createGain();
        mestre.gain.value = k === atual ? 1 : 0;
        mestre.connect(saida);
        // Cada instrumento vai à sala em quantidade diferente: a flauta fica longe, o tambor fica perto.
        const via = envio => {
          const g = ac.createGain(), e = ac.createGain();
          e.gain.value = envio;
          g.connect(mestre); g.connect(e); e.connect(sala);
          return g;
        };
        grupos[k] = { mestre, harpa: via(.3), flauta: via(.55), seco: via(.18) };
      });
    } catch (e) { ac = null; }
  }

  function recomecar() {
    passo = 0; seccao = 0; letra = null; acordeI = 0; frase = []; fraseI = 0; resto = 0;
  }

  return {
    // Os navegadores só deixam tocar depois de um clique, por isso começa no botão Nova Partida.
    ligar() {
      iniciar();
      if (!ac) return;
      ac.resume();
      if (ligada && !relogio) relogio = setInterval(agendar, 120);
    },
    // Ao mudar de momento, a música anterior desvanece enquanto a nova entra.
    // "preludio:mago" improvisa no modo da classe; os outros nomes são as músicas escritas.
    modo(pedido) {
      let nome = pedido;
      if (pedido.startsWith('preludio:')) {
        const c = MODO_DA_CLASSE[pedido.slice(9)] || MODO_DA_CLASSE.clerigo;
        improviso = { ...c, grau: 7, compassos: 0 };
        MODOS.preludio.bpm = c.bpm;
        nome = 'preludio';
      }
      if (pedido === 'abertura') improviso = { ...ABERTURA, grau: 7, compassos: 0 };
      if (nome === atual) return;
      const antes = atual;
      atual = nome;
      recomecar();
      if (!ac) return;
      const t = ac.currentTime;
      grupos[antes].mestre.gain.cancelScheduledValues(t);
      grupos[antes].mestre.gain.setTargetAtTime(0, t, .5);
      grupos[nome].mestre.gain.cancelScheduledValues(t);
      grupos[nome].mestre.gain.setTargetAtTime(1, t, .25);
      proxima = t + .1;
    },
    alternar() {
      ligada = !ligada;
      if (ac) {
        saida.gain.setTargetAtTime(ligada ? .5 : 0, ac.currentTime, .15);
        if (ligada) { proxima = 0; if (!relogio) relogio = setInterval(agendar, 120); }
        else { clearInterval(relogio); relogio = null; }
      }
      return ligada;
    },
    // Só para os testes: o volume de pico neste instante, de 0 a 1.
    pico() {
      if (!medidor) return 0;
      const d = new Float32Array(medidor.fftSize);
      medidor.getFloatTimeDomainData(d);
      return Math.max(...d.map(Math.abs));
    },
  };
})();
