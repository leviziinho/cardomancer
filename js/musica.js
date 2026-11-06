// Trilha sonora composta, feita em tempo real e sem ficheiros, dentro de uma sala com eco natural.
// A melodia está escrita à mão e é a mesma para todos; cada classe toca-a com os seus próprios instrumentos.
// Só as notas de passagem e a interpretação mudam de uma vez para a outra.

const musica = (() => {
  // Cada momento tem o seu andamento e a sua escala. A música em si está em PECAS, mais abaixo.
  const MODOS = {
    // Uma balada a seis por oito, para a estrada. Com classe, toca no modo grego dela.
    calma: { bpm: 84, compasso: 6, raiz: 50, escala: 'dorico', volume: .95, arpejo: [0, 2, 1, 3, 2, 1], flauta: true, harpa: 1, tambor: null },
    // O combate em lá menor: ostinato de cordas, tambor a cavalgar e uma flauta aflita por cima.
    combate: {
      bpm: 132, compasso: 8, raiz: 45, escala: 'eolio', volume: .9, arpejo: [0, 0, 2, 0, 1, 0, 3, 2], flauta: true, harpa: .75,
      tambor: [1, 0, .45, .6, 1, 0, .7, .5], pele: [0, .55, .3, .7, 0, .6, .35, .9], bombo: [1, 0, 0, 0, .75, 0, 0, 0],
    },
    // O chefe: lento e pesado, em sol frígio, com um coro de vozes por baixo.
    chefe: {
      bpm: 72, compasso: 8, raiz: 43, escala: 'frigio', volume: 1, arpejo: [0, 1, 0, 2, 0, 1, 0, 3], flauta: false, harpa: .7, coro: true,
      tambor: [1, 0, 0, 0, .7, 0, .35, .35], pele: [0, 0, .4, 0, 0, .5, .3, .6], bombo: [1, 0, 0, 0, 0, 0, .6, 0],
    },
  };

  // A música escrita, em graus da escala (0 é a tónica, 7 a oitava), para soar em qualquer modo.
  // Cada secção tem um acorde por compasso e a melodia, nota a nota: [grau, duração em colcheias]; null é pausa.
  // "energia" diz aos instrumentos quanto devem tocar: pouco na introdução, tudo no clímax.
  const PECAS = {
    calma: {
      seccoes: {
        I: { energia: .3, acordes: [0, 0], melodia: [[null, 12]] },
        A: {
          energia: .7, acordes: [0, 6, 3, 0, 2, 6, 3, 4],
          melodia: [[7, 3], [9, 2], [10, 1], [11, 4], [10, 2], [9, 3], [8, 1], [6, 2], [7, 4], [null, 2],
            [9, 2], [11, 1], [13, 3], [13, 2], [12, 1], [10, 3], [9, 2], [10, 1], [12, 2], [10, 1], [11, 4], [null, 2]],
        },
        A2: {
          energia: .7, acordes: [0, 6, 3, 0, 2, 6, 3, 0],
          melodia: [[7, 3], [9, 2], [10, 1], [11, 4], [10, 2], [9, 3], [8, 1], [6, 2], [7, 4], [null, 2],
            [9, 2], [11, 1], [13, 3], [13, 2], [12, 1], [10, 3], [12, 2], [10, 1], [8, 2], [6, 1], [7, 4], [null, 2]],
        },
        B: {
          energia: .85, acordes: [2, 6, 0, 3, 2, 3, 4, 0],
          melodia: [[11, 2], [13, 1], [14, 3], [15, 2], [14, 1], [13, 3], [11, 3], [10, 1], [11, 2], [12, 4], [null, 2],
            [9, 1], [11, 1], [13, 1], [14, 3], [14, 2], [12, 1], [10, 3], [11, 2], [13, 1], [12, 2], [10, 1], [9, 2], [8, 1], [7, 3]],
        },
        C: {
          energia: 1, acordes: [3, 4, 6, 2, 3, 6, 4, 4],
          melodia: [[14, 3], [12, 1], [14, 2], [15, 3], [13, 1], [11, 2], [13, 2], [12, 1], [13, 2], [15, 1], [16, 4], [null, 2],
            [14, 2], [13, 1], [12, 2], [10, 1], [13, 3], [12, 1], [10, 2], [11, 2], [12, 1], [13, 2], [11, 1], [11, 5], [null, 1]],
        },
        F: { energia: .5, acordes: [6, 3, 0, 0], melodia: [[10, 3], [9, 3], [8, 3], [6, 3], [7, 6], [null, 6]] },
      },
      forma: ['I', 'A', 'A2', 'B', 'A2', 'C', 'B', 'D', 'A2', 'F'],
    },
    combate: {
      seccoes: {
        A: {
          energia: .8, acordes: [0, 0, -2, -1, 0, -2, 2, 4],
          melodia: [[7, 2], [9, 1], [10, 1], [11, 3], [9, 1], [12, 2], [11, 1], [10, 1], [9, 2], [8, 2], [7, 4], [null, 2], [9, 1], [10, 1], [11, 2], [10, 1], [8, 1], [10, 4],
            [7, 2], [9, 1], [10, 1], [11, 3], [12, 1], [14, 2], [12, 1], [11, 1], [12, 2], [9, 2], [11, 2], [13, 2], [11, 2], [9, 2], [8, 3], [6, 1], [8, 4]],
        },
        A2: {
          energia: .8, acordes: [0, 0, -2, -1, 0, -2, 2, 0],
          melodia: [[7, 2], [9, 1], [10, 1], [11, 3], [9, 1], [12, 2], [11, 1], [10, 1], [9, 2], [8, 2], [7, 4], [null, 2], [9, 1], [10, 1], [11, 2], [10, 1], [8, 1], [10, 4],
            [7, 2], [9, 1], [10, 1], [11, 3], [12, 1], [14, 2], [12, 1], [11, 1], [12, 2], [9, 2], [11, 2], [13, 2], [11, 2], [9, 2], [7, 6], [null, 2]],
        },
        B: {
          energia: .9, acordes: [3, 2, 6, 4, 3, 2, 5, 4],
          melodia: [[10, 2], [12, 2], [14, 3], [13, 1], [11, 2], [13, 2], [14, 2], [15, 2], [13, 4], [11, 2], [10, 2], [11, 6], [null, 2],
            [14, 1], [14, 1], [13, 1], [14, 1], [15, 4], [14, 2], [13, 2], [11, 4], [12, 2], [14, 2], [16, 2], [14, 2], [15, 4], [11, 4]],
        },
        C: {
          energia: 1, acordes: [0, -2, 0, -1, 0, -2, -1, 4],
          melodia: [[7, 1], [7, 1], [8, 1], [9, 1], [7, 2], [4, 2], [5, 1], [5, 1], [7, 1], [9, 1], [7, 4], [7, 1], [7, 1], [8, 1], [9, 1], [10, 2], [11, 2], [10, 4], [8, 2], [6, 2],
            [11, 1], [11, 1], [12, 1], [11, 1], [9, 2], [7, 2], [12, 2], [11, 1], [9, 1], [7, 4], [8, 2], [10, 2], [11, 2], [13, 2], [11, 4], [null, 4]],
        },
      },
      forma: ['A', 'A2', 'B', 'C', 'A2'],
    },
    chefe: {
      seccoes: {
        A: {
          energia: .7, acordes: [0, 1, 0, -1, 2, 1, -2, 4],
          melodia: [[7, 4], [8, 2], [9, 2], [10, 4], [8, 4], [7, 6], [null, 2], [11, 3], [10, 1], [9, 2], [8, 2],
            [9, 4], [11, 2], [13, 2], [12, 4], [10, 2], [8, 2], [9, 3], [8, 1], [7, 4], [8, 4], [11, 4]],
        },
        A2: {
          energia: .8, acordes: [0, 1, 0, -1, 2, 1, -2, 0],
          melodia: [[7, 4], [8, 2], [9, 2], [10, 4], [8, 4], [7, 6], [null, 2], [11, 3], [10, 1], [9, 2], [8, 2],
            [9, 4], [11, 2], [13, 2], [12, 4], [10, 2], [8, 2], [9, 3], [8, 1], [10, 4], [7, 6], [null, 2]],
        },
        B: {
          energia: 1, acordes: [-2, 1, 2, 4, -2, 1, -1, 0],
          melodia: [[14, 4], [15, 2], [14, 2], [12, 4], [15, 4], [13, 3], [12, 1], [11, 4], [11, 6], [null, 2],
            [12, 2], [14, 2], [16, 4], [15, 3], [14, 1], [12, 4], [13, 4], [11, 2], [8, 2], [7, 6], [null, 2]],
        },
      },
      forma: ['A', 'B', 'D', 'A2'],
    },
  };
  // A secção D é a melodia de A uma oitava abaixo, em voz baixa, como uma lembrança.
  PECAS.calma.seccoes.D = { ...PECAS.calma.seccoes.A, energia: .45, oitava: -1 };
  PECAS.chefe.seccoes.D = { ...PECAS.chefe.seccoes.A, energia: .5, oitava: -1 };

  // O prelúdio: improviso livre sobre um bordão, no modo grego da classe. Ninguém o escreveu: nasce em cada partida.
  MODOS.preludio = { bpm: 76, compasso: 6, raiz: 50, volume: .9, improviso: true };
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
  let atual = 'calma', ligada = true, proxima = 0, passo = 0;
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


  // ===== O motor =====
  // A melodia é a mesma para todos. Quem a toca é o arranjo: o da classe, ou o do narrador antes de haver classe.
  let bardoVoz = null;
  let classe = null, barra = 0, acordeAgora = [50, 53, 57], grauAcorde = 0;
  let soParte = null;
  let sec = null, secNome = null, secI = 0, barI = 0, mel = [], melI = 0, resto = 0;
  const vezes = {};

  // Se for true, a melodia da estrada toca no modo grego de cada classe (a mesma linha, noutra cor).
  // Fica desligado: por agora, o modo da classe só se ouve no prelúdio.
  const MODO_NA_ESTRADA = false;
  // A escala do momento: a da peça escrita, ou a do improviso no prelúdio.
  function escalaAgora() {
    if (MODOS[atual].improviso) return { raiz: improviso.raiz, notas: ESCALAS[improviso.escala].notas };
    if (MODO_NA_ESTRADA && atual === 'calma' && classe && MODO_DA_CLASSE[classe]) { const c = MODO_DA_CLASSE[classe]; return { raiz: c.raiz, notas: ESCALAS[c.escala].notas }; }
    return { raiz: MODOS[atual].raiz, notas: ESCALAS[MODOS[atual].escala].notas };
  }
  // A nota do grau "g" da escala atual, a partir da oitava "oit" (0 é a raiz da música).
  function grauNota(g, oit = 0) {
    const e = escalaAgora();
    return e.raiz + 12 * (oit + Math.floor(g / 7)) + e.notas[((g % 7) + 7) % 7];
  }
  const umDe = l => l[Math.floor(Math.random() * l.length)];
  const acaso = p => Math.random() < p;
  // Sobe a nota às oitavas até ficar num registo que se ouve.
  const grave = (n, min = 38) => { while (n < min) n += 12; return n; };

  // Da segunda vez que uma secção passa, a melodia ganha notas de passagem entre as terças, como quem já a sabe de cor.
  function variar(lista, vez) {
    if (!vez) return lista;
    const out = [];
    lista.forEach(([g, du], i) => {
      const prox = lista[i + 1];
      if (g !== null && du >= 3 && prox && prox[0] !== null && Math.abs(prox[0] - g) === 2 && acaso(.45)) out.push([g, du - 1], [g + Math.sign(prox[0] - g), 1]);
      else out.push([g, du]);
    });
    return out;
  }
  function proximaSeccao(P) {
    secNome = P.forma[secI % P.forma.length];
    secI++;
    sec = P.seccoes[secNome];
    const chave = `${atual}|${secNome}`;
    vezes[chave] = (vezes[chave] || 0) + 1;
    mel = variar(sec.melodia, vezes[chave] - 1);
    barI = 0; melI = 0; resto = 0;
  }

  // O arranjo que está a tocar, e as vias de som dele (com o volume próprio de cada classe).
  const arranjo = () => ARRANJOS[(atual !== 'abertura' && classe && ARRANJOS[classe]) ? classe : 'narrador'];
  const viasCamada = {};
  function vias() {
    if (atual === 'abertura' || !classe || !ARRANJOS[classe]) return grupos[atual];
    const chave = `${atual}|${classe}`;
    if (viasCamada[chave]) return viasCamada[chave];
    const g = grupos[atual], v = {};
    ['harpa', 'flauta', 'seco'].forEach(k => { const n = ac.createGain(); n.gain.value = VOLUME_CLASSE[classe] || 1; n.connect(g[k]); v[k] = n; });
    return (viasCamada[chave] = v);
  }

  // Tudo o que um instrumento precisa de saber para tocar esta colcheia.
  function contexto(t, d, p) {
    const m = MODOS[atual];
    const x = {
      d, c: m.compasso, p, modo: atual, luta: atual === 'combate' || atual === 'chefe', chefe: atual === 'chefe',
      improviso: !!m.improviso, energia: m.improviso ? .6 : sec ? sec.energia : .6, seccao: m.improviso ? null : secNome,
      barI, ultima: !m.improviso && !!sec && barI === sec.acordes.length - 1, barra,
      acorde: acordeAgora, grau: grauAcorde, g: vias(), vol: m.volume, tonica: escalaAgora().raiz,
      gm: 0, om: 0, du: 1, pausaDepois: false,
    };
    // A nota da melodia "d" graus acima ou abaixo da que está a tocar, no mesmo registo.
    x.vizinho = dd => grauNota(x.gm + dd, 1 + x.om);
    return x;
  }

  // Um passo do improviso: o bordão no início de cada compasso, e por cima uma melodia que anda quase sempre
  // por graus vizinhos, salta de vez em quando, procura a nota de cor do modo, e volta à raiz no fim de cada frase.
  function improvisar(t, colcheia, m) {
    const p = passo % m.compasso, e = ESCALAS[improviso.escala], raiz = improviso.raiz, A = arranjo();
    acordeAgora = [raiz, raiz + e.notas[2], raiz + e.notas[4]]; grauAcorde = 0;
    if (p === 0) { improviso.compassos++; barra++; }
    const x = contexto(t, colcheia, p);
    if (soParte !== 'melodia') { if (p === 0) A.compasso(t, x); A.colcheia(t, x); }
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
    x.gm = improviso.grau; x.du = dur;
    if (soParte !== 'acompanhamento') A.nota(grauNota(improviso.grau, 1), t, colcheia * dur * .96, x);
    resto = dur - 1;
    passo++;
  }

  // Um passo da música escrita: o acorde muda no início do compasso, e a melodia corre ao seu próprio ritmo.
  function tocarColcheia(t, d) {
    const m = MODOS[atual];
    if (m.improviso) { improvisar(t, d, m); return; }
    const P = PECAS[atual], c = m.compasso, p = passo % c, A = arranjo();
    if (p === 0) {
      if (!sec || barI >= sec.acordes.length) proximaSeccao(P);
      let k = ((sec.acordes[barI] % 7) + 7) % 7;
      if (k >= 5) k -= 7;
      grauAcorde = k;
      acordeAgora = [grauNota(k), grauNota(k + 2), grauNota(k + 4)];
      barra++;
    }
    const x = contexto(t, d, p);
    if (soParte !== 'melodia') { if (p === 0) A.compasso(t, x); A.colcheia(t, x); }
    if (resto <= 0 && melI < mel.length) {
      const [gr, du] = mel[melI++];
      resto = du;
      if (gr !== null && soParte !== 'acompanhamento') {
        x.gm = gr; x.om = sec.oitava || 0; x.du = du; x.pausaDepois = !mel[melI] || mel[melI][0] === null;
        A.nota(grauNota(gr, 1 + x.om), t, d * du * .96, x);
      }
    }
    resto--;
    if (p === c - 1) barI++;
    passo++;
  }

  // --- Peças de som ---

  // Ruído filtrado com envelope: serve para vento, ondas, folhas, caixa, palhas.
  function sopro(t, dur, vol, destino, { tipo = 'bandpass', f0 = 1000, f1 = f0, Q = 1, ataque = .01, pan = 0 } = {}) {
    const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), pn = ac.createStereoPanner();
    n.buffer = ruido(); n.loop = true;
    f.type = tipo; f.Q.value = Q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.linearRampToValueAtTime(f1, t + dur * .5);
    f.frequency.linearRampToValueAtTime(f0, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(ataque, dur * .5));
    g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    pn.pan.value = pan;
    n.connect(f); f.connect(g); g.connect(pn); pn.connect(destino);
    n.start(t, Math.random() * 1.5); n.stop(t + dur + .05);
  }

  // Uma voz humana sem palavras: uma fonte com cordas vocais e as formantes da vogal por cima.
  const VOGAIS = { a: [800, 1150, 2900], o: [450, 800, 2830], u: [325, 700, 2530], e: [400, 1700, 2600], h: [640, 1190, 2390], m: [260, 900, 2200] };
  // Com "de", a boca começa noutra vogal e abre para a pedida: "m" para "o" dá o "hum" de quem cantarola.
  function voz(nota, t, dur, vol, destino, { vogal = 'a', vibrato = .006, queda = 0, pan = 0, ataque = .08, de = null } = {}) {
    const fim = t + dur, f = hertz(nota);
    const o = ac.createOscillator(), vib = ac.createOscillator(), vibG = ac.createGain(), g = ac.createGain(), pn = ac.createStereoPanner();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f, t);
    if (queda) o.frequency.exponentialRampToValueAtTime(f * queda, fim);
    vib.frequency.value = 5 + Math.random() * .8;
    vibG.gain.setValueAtTime(0, t);
    vibG.gain.linearRampToValueAtTime(f * vibrato, t + Math.min(.5, dur * .5));
    vib.connect(vibG); vibG.connect(o.frequency);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + ataque);
    g.gain.setValueAtTime(vol, Math.max(t + ataque, fim - .12));
    g.gain.linearRampToValueAtTime(0, fim);
    pn.pan.value = pan;
    const [f1, f2, f3] = VOGAIS[vogal];
    [[f1, 1, 6], [f2, .5, 8], [f3, .22, 10]].forEach(([fr, ganho, q], j) => {
      const bp = ac.createBiquadFilter(), bg = ac.createGain();
      bp.type = 'bandpass'; bp.Q.value = q;
      bp.frequency.setValueAtTime(de ? VOGAIS[de][j] : fr, t);
      if (de) bp.frequency.linearRampToValueAtTime(fr, t + Math.min(.12, dur * .4));
      bg.gain.value = ganho * 3;
      o.connect(bp); bp.connect(bg); bg.connect(g);
    });
    g.connect(pn); pn.connect(destino);
    [o, vib].forEach(x => { x.start(t); x.stop(fim + .05); });
  }

  // Metais (trompeta de guerra): dente de serra que abre o filtro ao soprar.
  function metal(nota, t, dur, vol, destino, pan = 0) {
    const fim = t + dur, f = ac.createBiquadFilter(), g = ac.createGain(), pn = ac.createStereoPanner();
    f.type = 'lowpass'; f.Q.value = 2;
    f.frequency.setValueAtTime(400, t);
    f.frequency.linearRampToValueAtTime(2600, t + .06);
    f.frequency.linearRampToValueAtTime(1500, t + Math.min(.3, dur));
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .035);
    g.gain.setValueAtTime(vol * .8, Math.max(t + .05, fim - .08));
    g.gain.linearRampToValueAtTime(0, fim);
    pn.pan.value = pan;
    [-6, 5].forEach(d => {
      const o = ac.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = hertz(nota); o.detune.value = d;
      o.frequency.setValueAtTime(hertz(nota) * .97, t); o.frequency.linearRampToValueAtTime(hertz(nota), t + .04);
      o.connect(f); o.start(t); o.stop(fim + .05);
    });
    f.connect(g); g.connect(pn); pn.connect(destino);
  }

  // Órgão de tubos: fundamental, oitava e dupla oitava, com o assobio do ar no início.
  function orgao(notas, t, dur, vol, destino) {
    const fim = t + dur, g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .12);
    g.gain.setValueAtTime(vol, Math.max(t + .13, fim - .25));
    g.gain.linearRampToValueAtTime(0, fim);
    g.connect(destino);
    notas.forEach(n => [[1, 1, 'sine'], [2, .45, 'sine'], [4, .18, 'sine'], [1, .12, 'square']].forEach(([mult, ganho, tipo]) => {
      const o = ac.createOscillator(), og = ac.createGain();
      o.type = tipo; o.frequency.value = hertz(n) * mult; o.detune.value = (Math.random() - .5) * 4;
      og.gain.value = ganho / notas.length;
      o.connect(og); og.connect(g); o.start(t); o.stop(fim + .05);
    }));
    sopro(t, .12, vol * .25, destino, { f0: 2400, Q: 2 });
  }

  // Clarinete: só harmónicos ímpares (onda quadrada), doce e redondo.
  function clarinete(nota, t, dur, vol, destino) {
    const fim = t + dur, o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    const vib = ac.createOscillator(), vibG = ac.createGain();
    o.type = 'square'; o.frequency.value = hertz(nota);
    vib.frequency.value = 5.2; vibG.gain.setValueAtTime(0, t); vibG.gain.linearRampToValueAtTime(hertz(nota) * .004, t + Math.min(.5, dur * .6));
    vib.connect(vibG); vibG.connect(o.frequency);
    f.type = 'lowpass'; f.frequency.value = 1500; f.Q.value = .7;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .06);
    g.gain.setValueAtTime(vol, Math.max(t + .07, fim - .1)); g.gain.linearRampToValueAtTime(0, fim);
    o.connect(f); f.connect(g); g.connect(destino);
    [o, vib].forEach(x => { x.start(t); x.stop(fim + .05); });
  }

  // Sino ou taça tibetana: parciais que não são harmónicos, e um fim muito longo.
  function sino(nota, t, vol, destino, longo = 5) {
    [[1, 1], [2.76, .5], [5.4, .25], [8.93, .12]].forEach(([r, gv], i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = hertz(nota) * r; o.detune.value = (Math.random() - .5) * 6;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * gv, t + .01);
      g.gain.exponentialRampToValueAtTime(.0005, t + longo / (1 + i * .6));
      o.connect(g); g.connect(destino); o.start(t); o.stop(t + longo + .1);
    });
  }

  // Bloco de madeira, coco oco: um tom curto e seco.
  function madeiraSeca(freq, t, vol, destino, pan = 0, dur = .09) {
    const o = ac.createOscillator(), g = ac.createGain(), pn = ac.createStereoPanner();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq * 1.15, t); o.frequency.exponentialRampToValueAtTime(freq, t + .02);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    pn.pan.value = pan;
    o.connect(g); g.connect(pn); pn.connect(destino); o.start(t); o.stop(t + dur + .02);
    sopro(t, .025, vol * .5, destino, { f0: freq * 3, Q: 4, ataque: .002, pan });
  }

  // Passarinho: uma subida rápida, repetida duas ou três vezes.
  function piado(t, vol, destino, afinado = 0) {
    const base = afinado ? Math.min(5200, Math.max(2200, afinado)) : 2600 + Math.random() * 1800, vezes = 2 + Math.floor(Math.random() * 3), pan = (Math.random() - .5) * 1.4;
    for (let i = 0; i < vezes; i++) {
      const t0 = t + i * (.09 + Math.random() * .04), o = ac.createOscillator(), g = ac.createGain(), pn = ac.createStereoPanner();
      o.frequency.setValueAtTime(base, t0); o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * .4), t0 + .05);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .008); g.gain.exponentialRampToValueAtTime(.0005, t0 + .07);
      pn.pan.value = pan;
      o.connect(g); g.connect(pn); pn.connect(destino); o.start(t0); o.stop(t0 + .08);
    }
  }

  // Assobio humano: uma nota aguda e pura, que escorrega até ao sítio.
  function assobio(nota, t, dur, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain(), f = hertz(nota);
    o.frequency.setValueAtTime(f * .94, t); o.frequency.exponentialRampToValueAtTime(f, t + .08);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .05);
    g.gain.setValueAtTime(vol, Math.max(t + .06, t + dur - .08)); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(destino); o.start(t); o.stop(t + dur + .05);
    sopro(t, dur, vol * .15, destino, { f0: f, Q: 6 });
  }

  // Estalidos: graveto a partir, brasas na fogueira.
  function estalos(t, vol, destino, n = 3, f0 = 2500) {
    for (let i = 0; i < n; i++) sopro(t + i * (.012 + Math.random() * .05), .02 + Math.random() * .02, vol * (.5 + Math.random() * .5), destino, { tipo: 'highpass', f0: f0 + Math.random() * 2000, ataque: .001, pan: (Math.random() - .5) * .8 });
  }

  // Corda em vez de sintetizador, para os instrumentos dedilhados: cravo, violão, koto.
  const cravo = (nota, t, vol, destino, pan = .25) => { corda(nota, t, vol, destino, { brilho: .97, tom: 7000, pan }); corda(nota + 12, t, vol * .3, destino, { brilho: .97, tom: 8000, pan }); };
  // Violão de nylon: uma corda que se belisca com a polpa do dedo, perto da boca do instrumento.
  // Há três gravações de cada nota, para duas pancadas seguidas nunca soarem iguais,
  // e a afinação é acertada pela velocidade de leitura, para não desafinar nos agudos.
  const notasNylon = new Map();
  function amostraNylon(nota, v) {
    const chave = `${nota}|${v}`;
    if (notasNylon.has(chave)) return notasNylon.get(chave);
    const sr = ac.sampleRate, f = hertz(nota), P = Math.max(2, Math.floor(sr / f)), dur = Math.min(4, 1.6 + 200 / f), n = Math.floor(sr * dur);
    const buf = ac.createBuffer(1, n, sr), d = buf.getChannelData(0), linha = new Float32Array(P);
    // O dedo: um empurrão macio (ruído escurecido), tirado do sítio onde a corda é beliscada.
    let suave = 0;
    for (let i = 0; i < P; i++) { suave += (Math.random() * 2 - 1 - suave) * .35; linha[i] = suave; }
    const sitio = Math.max(1, Math.round(P * (.16 + Math.random() * .06))), copia = Float32Array.from(linha);
    for (let i = 0; i < P; i++) linha[i] = copia[i] - copia[(i + sitio) % P];
    // O nylon perde os agudos depressa e os graves devagar.
    const perda = Math.min(.9988, .9955 + f / 160000);
    let i0 = 0, ant = 0;
    for (let i = 0; i < n; i++) {
      const val = linha[i0];
      linha[i0] = perda * (.42 * val + .58 * ant);
      ant = val; d[i] = val; i0 = (i0 + 1) % P;
    }
    let pico = 0;
    for (let i = 0; i < n; i++) pico = Math.max(pico, Math.abs(d[i]));
    for (let i = 0; i < n; i++) d[i] /= pico || 1;
    const r = { buf, taxa: f / (sr / P) };
    notasNylon.set(chave, r);
    return r;
  }
  function violao(nota, t, vol, destino, pan = -.15) {
    const a = amostraNylon(nota, Math.floor(Math.random() * 3));
    const s = ac.createBufferSource(), lp = ac.createBiquadFilter(), ar = ac.createBiquadFilter(), tampo = ac.createBiquadFilter(), g = ac.createGain(), pn = ac.createStereoPanner();
    s.buffer = a.buf; s.playbackRate.value = a.taxa;
    lp.type = 'lowpass'; lp.frequency.value = 2400 + Math.random() * 600; lp.Q.value = .4;
    // O corpo de madeira: a ressonância do ar (perto de 100 Hz) e a do tampo (perto de 220 Hz).
    ar.type = 'peaking'; ar.frequency.value = 105; ar.Q.value = 1.8; ar.gain.value = 6;
    tampo.type = 'peaking'; tampo.frequency.value = 225; tampo.Q.value = 1.4; tampo.gain.value = 4;
    g.gain.value = vol; pn.pan.value = pan;
    s.connect(lp); lp.connect(ar); ar.connect(tampo); tampo.connect(g); g.connect(pn); pn.connect(destino);
    s.start(t);
    // A polpa do dedo a largar a corda.
    sopro(t, .025, vol * .05, destino, { f0: 1800, Q: 1, ataque: .002, pan });
  }

  // Um homem a cantarolar de boca fechada. Uma só fonte com os harmónicos da garganta, já macios,
  // e a boca fechada a deixar passar só os graves. A voz escorrega da nota anterior, oscila um pouco
  // como qualquer voz, e só ganha vibrato nas notas longas. "aberta" de 0 a 1 vai do "hum" ao "lá".
  let ondaGarganta = null;
  function cantarolar(nota, t, dur, vol, destino, { aberta = 0, de = null, pan = -.05, la = false } = {}) {
    if (!ondaGarganta) {
      const N = 40, re = new Float32Array(N), im = new Float32Array(N);
      for (let k = 1; k < N; k++) im[k] = Math.pow(k, -1.5) * (k % 2 ? 1 : .85);
      ondaGarganta = ac.createPeriodicWave(re, im);
    }
    const fim = t + dur, f = hertz(nota), o = ac.createOscillator(), g = ac.createGain(), pn = ac.createStereoPanner();
    o.setPeriodicWave(ondaGarganta);
    if (de !== null) { o.frequency.setValueAtTime(hertz(de), t); o.frequency.exponentialRampToValueAtTime(f, t + .09); }
    else { o.frequency.setValueAtTime(f * .975, t); o.frequency.exponentialRampToValueAtTime(f, t + .1); }
    // A afinação nunca está parada: uma deriva lenta, e o vibrato que nasce tarde.
    const deriva = ac.createOscillator(), derivaG = ac.createGain();
    deriva.frequency.value = .3 + Math.random() * .5; derivaG.gain.value = f * .004;
    deriva.connect(derivaG); derivaG.connect(o.frequency);
    if (dur > .6) {
      const vib = ac.createOscillator(), vibG = ac.createGain();
      vib.frequency.value = 4.6 + Math.random() * .8;
      vibG.gain.setValueAtTime(0, t); vibG.gain.setValueAtTime(0, t + .3); vibG.gain.linearRampToValueAtTime(f * (.005 + Math.random() * .004), t + Math.min(dur, .9));
      vib.connect(vibG); vibG.connect(o.frequency); vib.start(t); vib.stop(fim + .1);
    }
    // A boca: fechada, só passam os graves e o zumbido do nariz; aberta, aparecem as formantes do "a".
    const boca = ac.createBiquadFilter(), nariz = ac.createBiquadFilter(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter();
    boca.type = 'lowpass'; boca.Q.value = .5; boca.frequency.value = 700 + aberta * 1900;
    // Com "la", cada nota começa no "l" (a língua no céu da boca, o som abafado) e abre para o "á".
    if (la) { boca.frequency.setValueAtTime(1000, t); boca.frequency.linearRampToValueAtTime(700 + aberta * 1900, t + .07); }
    nariz.type = 'peaking'; nariz.frequency.value = 270; nariz.Q.value = 2; nariz.gain.value = 7 * (1 - aberta * .6);
    f1.type = 'peaking'; f1.frequency.value = 750; f1.Q.value = 2.5; f1.gain.value = aberta * 9;
    if (la) { f1.frequency.setValueAtTime(360, t); f1.frequency.linearRampToValueAtTime(750, t + .07); }
    f2.type = 'peaking'; f2.frequency.value = 1200; f2.Q.value = 3; f2.gain.value = aberta * 6;
    const ataque = la ? .07 : de !== null ? .03 : .07;
    g.gain.setValueAtTime(0, t);
    if (la) g.gain.linearRampToValueAtTime(vol * .35, t + .025);
    g.gain.linearRampToValueAtTime(vol, t + ataque);
    g.gain.linearRampToValueAtTime(vol * (.85 + Math.random() * .2), t + dur * .6);
    g.gain.setValueAtTime(vol * .9, Math.max(t + ataque + .01, fim - .09)); g.gain.linearRampToValueAtTime(0, fim);
    pn.pan.value = pan;
    o.connect(boca); boca.connect(nariz); nariz.connect(f1); f1.connect(f2); f2.connect(g); g.connect(pn); pn.connect(destino);
    [o, deriva].forEach(x => { x.start(t); x.stop(fim + .1); });
    // O ar que se toma antes de começar uma frase.
    if (de === null) sopro(Math.max(0, t - .22), .2, vol * .12, destino, { f0: 1400, Q: .7, ataque: .1, pan });
  }
  const koto = (nota, t, vol, destino, pan = .2) => corda(nota, t, vol, destino, { brilho: .92, tom: 5200, pan });

  // Berimbau grave e sério: o arame bate, a cabaça abre o som devagar e deixa-o morrer longe.
  function berimbau(nota, t, vol, destino, pedra = false) {
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain(), fq = hertz(nota + (pedra ? 2 : 0));
    o.type = 'sawtooth'; o.frequency.setValueAtTime(fq * 1.01, t); o.frequency.exponentialRampToValueAtTime(fq, t + .03);
    f.type = 'bandpass'; f.Q.value = 1.6;
    f.frequency.setValueAtTime(fq * 1.5, t); f.frequency.linearRampToValueAtTime(fq * 2.6, t + .2); f.frequency.linearRampToValueAtTime(fq * 1.6, t + .9);
    lp.type = 'lowpass'; lp.frequency.value = 1800;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0005, t + 1.1);
    o.connect(f); f.connect(lp); lp.connect(g); g.connect(destino); o.start(t); o.stop(t + 1.15);
  }

  // Shakuhachi: flauta de bambu, com muito sopro e a nota a subir de baixo.
  function shakuhachi(nota, t, dur, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain(), f = hertz(nota), fim = t + dur;
    o.type = 'sine';
    o.frequency.setValueAtTime(f * .89, t); o.frequency.exponentialRampToValueAtTime(f, t + .25);
    o.frequency.setValueAtTime(f, fim - .3); o.frequency.exponentialRampToValueAtTime(f * .96, fim);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .2);
    g.gain.setValueAtTime(vol, Math.max(t + .2, fim - .3)); g.gain.linearRampToValueAtTime(0, fim);
    o.connect(g); g.connect(destino); o.start(t); o.stop(fim + .05);
    sopro(t, dur, vol * .45, destino, { f0: f * 2, f1: f * 2.4, Q: 2.5, ataque: .15 });
  }

  // Caixa de guerra: pele esticada e bordão de arame.
  function caixaGuerra(t, vol, destino) {
    sopro(t, .14, vol, destino, { tipo: 'highpass', f0: 1800, ataque: .001 });
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(160, t + .05);
    g.gain.setValueAtTime(vol * .6, t); g.gain.exponentialRampToValueAtTime(.0005, t + .08);
    o.connect(g); g.connect(destino); o.start(t); o.stop(t + .1);
  }

  // "HUH!": várias gargantas ao mesmo tempo, curto e a cair.
  function huh(t, vol, destino) {
    for (let i = 0; i < 5; i++) voz(43 + Math.random() * 5, t + Math.random() * .03, .26, vol / 3, destino, { vogal: 'h', vibrato: 0, queda: .7, pan: (i - 2) * .25, ataque: .015 });
    sopro(t, .2, vol * .4, destino, { f0: 900, Q: .8, ataque: .005 });
  }

  // Tambor afinado (timbalão): a pele dá a nota da melodia, e cai um pouco depois da pancada.
  function tomTom(nota, t, vol, destino, pan = 0) {
    const o = ac.createOscillator(), g = ac.createGain(), pn = ac.createStereoPanner(), f = hertz(nota);
    o.type = 'triangle';
    o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + .03); o.frequency.exponentialRampToValueAtTime(f * .85, t + .4);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .004); g.gain.exponentialRampToValueAtTime(.0005, t + .55);
    pn.pan.value = pan;
    o.connect(g); g.connect(pn); pn.connect(destino); o.start(t); o.stop(t + .6);
    sopro(t, .06, vol * .5, destino, { f0: f * 4, Q: 1.2, ataque: .002, pan });
  }

  // Tímpano: a pancada redonda e afinada da orquestra.
  function timpano(nota, t, vol, destino) {
    const f = hertz(nota);
    [[1, 1], [1.5, .4], [1.99, .25]].forEach(([r, gv]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(f * r * 1.03, t); o.frequency.exponentialRampToValueAtTime(f * r, t + .08);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol * gv, t + .006); g.gain.exponentialRampToValueAtTime(.0005, t + 1.4);
      o.connect(g); g.connect(destino); o.start(t); o.stop(t + 1.5);
    });
    sopro(t, .08, vol * .4, destino, { tipo: 'lowpass', f0: 600, ataque: .003 });
  }

  // Violoncelo a solo: duas cordas quase iguais com arco, vibrato que nasce devagar.
  function violoncelo(nota, t, dur, vol, destino, pan = -.1) {
    const fim = t + dur, f = hertz(nota), fl = ac.createBiquadFilter(), corpo = ac.createBiquadFilter(), g = ac.createGain(), pn = ac.createStereoPanner();
    const vib = ac.createOscillator(), vibG = ac.createGain();
    vib.frequency.value = 5.3; vibG.gain.setValueAtTime(0, t); vibG.gain.linearRampToValueAtTime(f * .007, t + Math.min(.6, dur * .6));
    vib.connect(vibG);
    fl.type = 'lowpass'; fl.Q.value = .8;
    fl.frequency.setValueAtTime(700, t); fl.frequency.linearRampToValueAtTime(1500, t + .15); fl.frequency.linearRampToValueAtTime(1100, fim);
    corpo.type = 'peaking'; corpo.frequency.value = 400; corpo.Q.value = 1.2; corpo.gain.value = 6;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .09);
    g.gain.setValueAtTime(vol * .85, Math.max(t + .1, fim - .12)); g.gain.linearRampToValueAtTime(0, fim);
    pn.pan.value = pan;
    [-4, 4].forEach(dt => {
      const o = ac.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt;
      vibG.connect(o.frequency); o.connect(fl); o.start(t); o.stop(fim + .05);
    });
    vib.start(t); vib.stop(fim + .05);
    fl.connect(corpo); corpo.connect(g); g.connect(pn); pn.connect(destino);
    // O arco a morder a corda.
    sopro(t, .12, vol * .3, destino, { f0: f * 3, Q: 2, ataque: .01, pan });
  }

  // Didjeridu: um bordão grave de lábios, com a boca a abrir e fechar a vogal devagar.
  function didjeridu(nota, t, dur, vol, destino) {
    const fim = t + dur, o = ac.createOscillator(), bp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain();
    const lfo = ac.createOscillator(), lfoG = ac.createGain();
    o.type = 'sawtooth'; o.frequency.value = hertz(nota);
    bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.value = 420;
    lfo.frequency.value = .9 + Math.random() * .6; lfoG.gain.value = 180;
    lfo.connect(lfoG); lfoG.connect(bp.frequency);
    lp.type = 'lowpass'; lp.frequency.value = 1400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .15);
    g.gain.setValueAtTime(vol, Math.max(t + .16, fim - .2)); g.gain.linearRampToValueAtTime(0, fim);
    const seco = ac.createGain(); seco.gain.value = .5;
    o.connect(bp); o.connect(seco); seco.connect(lp); bp.connect(lp); lp.connect(g); g.connect(destino);
    [o, lfo].forEach(x => { x.start(t); x.stop(fim + .05); });
  }

  // Uma gota de água: um tom que sobe depressa e se apaga.
  function gota(nota, t, vol, destino) {
    const o = ac.createOscillator(), g = ac.createGain(), f = hertz(nota);
    o.frequency.setValueAtTime(f * .5, t); o.frequency.exponentialRampToValueAtTime(f, t + .04);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .005); g.gain.exponentialRampToValueAtTime(.0005, t + .12);
    o.connect(g); g.connect(destino); o.start(t); o.stop(t + .14);
  }

  // Um tocador de mão nunca bate exatamente no tempo: uns milissegundos para a frente ou para trás.
  const humano = () => Math.random() * .022;

  // Tambor tribal grave, afinado na nota: dois tocadores quase juntos, a pele a cair de altura e a palma por cima.
  function peleTribal(nota, t, vol, destino) {
    const f = hertz(grave(nota, 36));
    [[0, 1, -.25], [.008 + Math.random() * .018, .6, .25]].forEach(([atraso, gv, pan]) => {
      const t0 = t + atraso + humano(), v = quase(vol * gv), o = ac.createOscillator(), g = ac.createGain(), pn = ac.createStereoPanner();
      o.frequency.setValueAtTime(f * 1.35, t0); o.frequency.exponentialRampToValueAtTime(f, t0 + .05); o.frequency.exponentialRampToValueAtTime(f * .82, t0 + .3);
      g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + .38);
      pn.pan.value = pan;
      o.connect(g); g.connect(pn); pn.connect(destino); o.start(t0); o.stop(t0 + .42);
      sopro(t0, .07, v * .45, destino, { f0: 700 + Math.random() * 400, Q: .8, ataque: .002, pan });
    });
  }

  // O grito da tribo numa nota: várias gargantas, cada uma no seu tempo e na sua afinação, a abrir "HA!" e a cair.
  function grito(nota, t, destino) {
    for (let i = 0; i < 6; i++) voz(nota + (Math.random() - .5) * .5 + (i % 3 === 2 ? -12 : 0), t + Math.random() * .05, .34 + Math.random() * .1, .07, destino, { vogal: 'a', de: 'h', vibrato: 0, queda: .82, pan: (i - 2.5) * .22, ataque: .02 });
    sopro(t, .25, .14, destino, { f0: 1000, Q: .7, ataque: .01 });
  }

  // ===== Os arranjos =====
  // Cada classe toca a mesma melodia com os seus instrumentos. "compasso" corre no início de cada compasso
  // (o baixo, o acorde), "colcheia" em todas (o ritmo, o ambiente) e "nota" em cada nota da melodia.
  const ARRANJOS = {
    // Antes de haver classe: harpa, flauta e violoncelos, com os tambores no combate.
    narrador: {
      compasso(t, x) {
        const m = MODOS[x.modo], [r, te, q] = x.acorde, bar = x.d * x.c;
        if (x.improviso) {
          // No Lócrio, o bordão leva a quinta diminuta, que nunca descansa.
          const quinta = improviso.escala === 'locrio' ? 6 : 7;
          acordeLongo([r - 12, r - 12 + quinta, r], t, bar * 1.1, .12 * x.vol, x.g.seco, false);
          return;
        }
        acordeLongo([r - 12, q - 12, r], t, bar, .17 * x.vol, x.g.seco, !!m.coro);
        if (m.coro) acordeLongo([r + 12, q + 12, te + 24], t, bar, .09 * x.vol, x.g.seco, true);
      },
      colcheia(t, x) {
        const m = MODOS[x.modo], p = x.p, [r, te, q] = x.acorde;
        if (x.improviso) {
          // A harpa marca às vezes a raiz ou a quinta, para o ouvido não perder o centro.
          if (p === 0 || (p === 3 && acaso(.5))) corda(r + (p === 0 ? 0 : 7), t, quase(.2 * x.vol), x.g.harpa, { brilho: .4, tom: 1800, pan: -.2 });
          return;
        }
        // O arpejo, com o dedo nunca exatamente no mesmo sítio.
        const voz4 = [r, q, r + 12, te + 12], idx = m.arpejo[p % m.arpejo.length], folga = Math.max(0, (Math.random() - .5) * .018);
        corda(voz4[idx], t + folga, quase((p === 0 ? .4 : .27) * m.harpa * x.vol), x.g.harpa, { brilho: .55, tom: p === 0 ? 3000 : 2300, pan: (idx - 1.5) * .22 });
        if (m.tambor && m.tambor[p]) tambor(t, quase(.5 * m.tambor[p] * x.vol), x.g.seco);
        if (m.pele && m.pele[p]) pele(t, quase(.4 * m.pele[p] * x.vol), x.g.seco);
        if (m.bombo && m.bombo[p]) bombo(t, quase(.75 * m.bombo[p] * x.vol), x.g.seco);
        if (m.pele && p === x.c - 1 && acaso(.35)) pele(t + x.d / 2, quase(.3 * x.vol), x.g.seco);
      },
      nota(n, t, dur, x) {
        const flautaSim = x.improviso ? improviso.flauta : MODOS[x.modo].flauta;
        if (flautaSim) flauta(n, t, dur, quase(.16 * x.vol), x.g.flauta);
        else corda(n, t, quase(.42 * x.vol), x.g.harpa, { brilho: .75, tom: 3600, pan: .1 });
      },
    },

    // Mago: um prelúdio de cravo, como Bach. O acorde partido em semicolcheias sem parar,
    // o baixo a descer por graus em cada compasso, como numa fuga, e a melodia com mordentes.
    mago: {
      compasso(t, x) {
        const passos = x.c === 6 ? [0, 2, 4] : [0, 2, 4, 6], n = x.energia < .5 ? 1 : passos.length;
        for (let i = 0; i < n; i++) cravo(grauNota(x.grau - i, -1), t + passos[i] * x.d, quase(i ? .17 : .22), x.g.harpa, -.35);
      },
      colcheia(t, x) {
        if (x.energia < .35 && x.p % 2) return;
        const [r, te, q] = x.acorde, v = [r + 12, te + 12, q + 12, r + 24], seq = [0, 1, 2, 3, 2, 1, 2, 1];
        [0, 1].forEach(j => cravo(v[seq[(x.p * 2 + j) % 8]], t + j * x.d / 2, quase(j ? .05 : .07), x.g.harpa, .3));
      },
      nota(n, t, dur, x) {
        cravo(n, t, quase(.62), x.g.harpa, 0);
        if (x.du >= 3 && acaso(.5)) {
          const s = Math.min(.07, x.d / 4);
          cravo(x.vizinho(1), t + s, .36, x.g.harpa, 0);
          cravo(n, t + 2 * s, .42, x.g.harpa, 0);
        }
        // No clímax, a mão esquerda dobra a melodia uma oitava abaixo.
        if (x.energia >= 1) cravo(n - 12, t, .3, x.g.harpa, -.1);
      },
    },

    // Feiticeiro: os elementos cantam a melodia. Um sino em cada nota, e por cima o elemento da secção:
    // água (gotas e ondas), ar (o vento afinado na própria nota), fogo (brasas) e terra (o sino uma oitava abaixo).
    // Por baixo, o vento canta a raiz e a quinta do acorde.
    feiticeiro: {
      elemento(x) { return x.luta ? 'fogo' : ({ B: 'ar', C: 'fogo', D: 'terra' })[x.seccao] || 'agua'; },
      compasso(t, x) {
        const [r, , q] = x.acorde, bar = x.d * x.c, el = this.elemento(x);
        [r, q].forEach((n, i) => sopro(t, bar * 1.15, 2.4, x.g.flauta, { f0: hertz(n), Q: 22, ataque: bar * .4, pan: i ? .35 : -.35 }));
        if (el === 'agua' && x.barra % 2 === 0) sopro(t, bar * 2.2, .2, x.g.flauta, { tipo: 'lowpass', f0: 250, f1: 1100, ataque: bar * .9, pan: -.3 });
        if (el === 'terra' || el === 'fogo') sopro(t, bar, .3, x.g.seco, { tipo: 'lowpass', f0: 110, f1: 240, ataque: .3 });
        if (x.barI === 0) sino(grave(r), t, .1, x.g.flauta, 6);
      },
      colcheia(t, x) {
        const el = this.elemento(x);
        if (el === 'fogo' && acaso(.35)) estalos(t + Math.random() * x.d, .14, x.g.seco, 1 + Math.floor(Math.random() * 3), 2000);
        if (x.luta && x.p % 2 === 0) tambor(t, x.p ? .15 : .28, x.g.seco);
      },
      nota(n, t, dur, x) {
        const el = this.elemento(x);
        sino(el === 'terra' ? n - 12 : n, t, .12, x.g.flauta, Math.min(4, dur * 1.5 + .8));
        if (el === 'ar') sopro(t, dur * 1.05, 4, x.g.flauta, { f0: hertz(n), Q: 35, ataque: Math.min(.25, dur * .3) });
        if (el === 'agua') gota(n + 12, t, .05, x.g.flauta);
        if (el === 'fogo') estalos(t, .12, x.g.seco, 2, 2400);
      },
    },

    // Guerreiro: as trompetas levam a melodia, com o trombone no baixo e o bombo a pisar o chão.
    // Nas secções fortes, uma segunda trompeta faz a terça e a caixa bate no ritmo das notas.
    guerreiro: {
      compasso(t, x) {
        const [r] = x.acorde, bar = x.d * x.c;
        metal(grave(r, 40), t, bar * .95, .055, x.g.flauta, -.3);
        bombo(t, .4, x.g.seco);
        bombo(t + (x.c / 2) * x.d, .26, x.g.seco);
      },
      colcheia(t, x) {
        const marcha = x.c === 6 ? [1, 0, .45, .8, 0, .5] : [1, 0, .45, .6, .9, 0, .5, .7];
        if (x.energia < .5) { if (x.p === 0) caixaGuerra(t, .08, x.g.seco); return; }
        if (marcha[x.p] && x.energia < .8) caixaGuerra(t, quase(.1 * marcha[x.p]), x.g.seco);
        if (x.ultima && x.p >= x.c - 2) [0, 1, 2, 3].forEach(k => caixaGuerra(t + k * x.d / 4, .05 + k * .015, x.g.seco));
      },
      nota(n, t, dur, x) {
        metal(n - 12, t, dur * .92, .18, x.g.flauta, .2);
        if (x.energia >= .8) { metal(x.vizinho(-2) - 12, t, dur * .92, .1, x.g.flauta, -.2); caixaGuerra(t, .12, x.g.seco); }
      },
    },

    // Bardo: um violão de nylon dedilhado (polegar no baixo, indicador, médio e anelar nas cordas de cima)
    // e o próprio bardo a cantarolar a melodia, "lá... lá lá lá", como quem canta pelo caminho.
    // Na secção B, o violão toca a melodia com ele.
    bardo: {
      compasso() {},
      colcheia(t, x) {
        const [r, te, q] = x.acorde, baixo = grave(r - 12, 40), quinta = grave(q - 12, 40);
        const dedo = x.c === 6 ? [baixo, te, q, r + 12, q, te] : [baixo, te, q, r + 12, quinta, te, q, r + 12];
        const t0 = t + Math.random() * .015;
        if (x.luta) {
          if (x.p % 2) return;
          // No combate, rasgado: as cordas uma a uma, muito depressa, para baixo e para cima.
          const cordas = x.p % 4 === 0 ? [baixo, q, r + 12, te + 12] : [te + 12, r + 12, q];
          cordas.forEach((n, i) => violao(n, t0 + i * .014, quase(i ? .09 : .13), x.g.harpa, (i - 1.5) * .15));
          return;
        }
        const polegar = x.p === 0 || x.p === x.c / 2;
        violao(dedo[x.p], t0, quase(polegar ? .21 : .11), x.g.harpa, polegar ? -.2 : .2);
      },
      nota(n, t, dur, x) {
        // "Lá... lá lá lá": a boca abre mais no clímax e fica a meio nas partes calmas.
        const aberta = x.energia >= 1 ? .9 : x.energia < .5 ? .55 : .75;
        const de = bardoVoz && t - bardoVoz.fim < .25 ? bardoVoz.n : null;
        cantarolar(n - 24, t, dur * .98, .09, x.g.flauta, { aberta, de, la: true });
        bardoVoz = { n: n - 24, fim: t + dur };
        if (x.seccao === 'B') violao(n - 12, t, .21, x.g.harpa, -.1);
      },
    },

    // Druida: o clarinete leva a melodia e, nas secções B e C, passa a ser assobiada.
    // Os passarinhos respondem nas pausas, as folhas mexem-se e os gravetos estalam.
    druida: {
      compasso(t, x) {
        const [r, , q] = x.acorde, bar = x.d * x.c;
        clarinete(grave(r - 12), t, bar * .98, .05, x.g.flauta);
        if (x.energia >= .7) clarinete(grave(q - 12), t, bar * .98, .03, x.g.flauta);
        sopro(t, .5, .05, x.g.seco, { f0: 3000, Q: .6, ataque: .15, pan: umDe([-.5, .5]) });
        if (acaso(.25)) estalos(t + Math.random() * bar, .07, x.g.seco, 2, 1200);
      },
      colcheia(t, x) {
        if (x.luta) {
          if (x.p % 2 === 0) madeiraSeca(x.p ? 260 : 200, t, .18, x.g.seco, -.2, .12);
          if (acaso(.2)) estalos(t, .08, x.g.seco, 2, 1400);
          return;
        }
        if (acaso(.03)) piado(t + Math.random() * x.d, .04, x.g.flauta);
      },
      nota(n, t, dur, x) {
        if (x.seccao === 'B' || x.seccao === 'C') assobio(n, t, dur * .95, .09, x.g.flauta);
        else clarinete(n - 12, t, dur * .95, .1, x.g.flauta);
        if (x.pausaDepois && acaso(.7)) piado(t + dur + .1, .06, x.g.flauta, hertz(n) * 4);
      },
    },

    // Bárbaro: vários tambores de pele tocados à mão, nunca exatamente juntos. Os tambores graves seguem
    // o ritmo e a altura da melodia; nas notas longas, a tribo grita-a. O bombo, o "HUH!" e um rufo no fim de cada secção.
    barbaro: {
      compasso(t, x) {
        bombo(t + humano(), .6, x.g.seco);
        if (x.energia >= .8 && x.barra % 2 === 0) { huh(t + (x.c / 2) * x.d, .34, x.g.seco); if (acaso(.4)) huh(t + (x.c - 1) * x.d, .26, x.g.seco); }
        if (x.ultima) for (let k = 0; k < 8; k++) tambor(t + (x.c - 2) * x.d + k * x.d / 4 + humano(), quase(.16 + k * .045), x.g.seco);
      },
      colcheia(t, x) {
        const ritmo = x.c === 6 ? [0, .3, .5, .8, .3, .5] : [0, .3, .6, .3, .9, .4, .7, .5];
        const v = ritmo[x.p] * (x.luta ? 1.3 : x.energia < .5 ? .5 : 1);
        if (v) tambor(t + humano(), quase(.3 * v), x.g.seco);
        // Às vezes, um dos tocadores dá uma pancada a mais pelo meio.
        if (x.energia >= .7 && acaso(.18)) pele(t + x.d / 2 + humano(), quase(.22), x.g.seco);
      },
      nota(n, t, dur, x) {
        peleTribal(n - 36, t, .55, x.g.seco);
        if (x.du >= 4 && x.energia >= .7) grito(n - 24, t + .03, x.g.seco);
      },
    },

    // Ladino: a noite vazia. Um alaúde abafado belisca a melodia, e nas notas longas o vento sibila a mesma nota.
    // Por baixo, uma corda grave, um sino ao longe e os grilos.
    ladino: {
      compasso(t, x) {
        const [r] = x.acorde, bar = x.d * x.c;
        corda(grave(r - 12), t, .4, x.g.harpa, { brilho: .3, tom: 700, pan: -.2 });
        if (x.barra % 2 === 0 && !x.luta) sopro(t, bar * 2.4, .06, x.g.flauta, { f0: 1800, f1: 3800, Q: 9, ataque: bar, pan: (Math.random() - .5) * 1.2 });
        if (x.barI === 0) sino(grave(r - 12), t, .05, x.g.flauta, 5);
      },
      colcheia(t, x) {
        if (x.luta) {
          corda(grave(x.acorde[0] - 12), t, x.p % 2 ? .18 : .28, x.g.harpa, { brilho: .3, tom: 800 });
          if (x.p % 4 === 2) madeiraSeca(1800, t, .05, x.g.seco, .4, .04);
          return;
        }
        if (acaso(.05)) for (let i = 0; i < 3; i++) sopro(t + i * .07, .04, .015, x.g.flauta, { f0: 4300, Q: 30, ataque: .005, pan: .6 });
      },
      nota(n, t, dur, x) {
        corda(n - 12, t, .68, x.g.harpa, { brilho: .42, tom: 1600, pan: .15 });
        if (x.du >= 3) sopro(t, dur, 3, x.g.flauta, { f0: hertz(n), Q: 40, ataque: dur * .4, pan: -.2 });
      },
    },

    // Clérigo: a catedral. Uma soprano canta a melodia, como na ópera; na secção B é o coro inteiro.
    // O órgão faz os acordes e o pedal, e no clímax dobra a melodia. No combate, os tímpanos.
    clerigo: {
      compasso(t, x) {
        const [r, te, q] = x.acorde, bar = x.d * x.c;
        orgao([r - 12, r, te, q], t, bar * 1.02, .055, x.g.flauta);
        if (x.energia >= .7) orgao([grave(r - 24, 30)], t, bar * 1.02, .05, x.g.flauta);
        if (x.energia >= .7) [r, te, q].forEach((n, i) => voz(n, t, bar * .98, .025, x.g.flauta, { vogal: 'o', vibrato: .004, pan: (i - 1) * .4, ataque: .4 }));
      },
      colcheia(t, x) { if (x.luta && x.p % (x.c / 2) === 0) timpano(grave(x.acorde[0] - 12), t, x.p ? .25 : .4, x.g.seco); },
      nota(n, t, dur, x) {
        if (x.seccao === 'B') [0, -12].forEach((o, i) => voz(n + o, t, dur * .97, .11, x.g.flauta, { vogal: 'o', vibrato: .008, pan: i ? -.25 : .25, ataque: .1 }));
        else voz(n, t, dur * .97, .16, x.g.flauta, { vogal: 'a', vibrato: .02, ataque: .1 });
        if (x.energia >= 1) orgao([n], t, dur * .97, .05, x.g.flauta);
      },
    },

    // Patrulheiro: o caçador nos ermos. Um violoncelo grave leva a melodia, com o berimbau a marcar cada nota,
    // o didjeridu a respirar a tónica por baixo, troncos ocos a fazer o ritmo tribal e o caxixi baixinho.
    patrulheiro: {
      compasso(t, x) {
        didjeridu(grave(x.tonica - 12, 36), t, x.d * x.c * 1.02, .12, x.g.seco);
      },
      colcheia(t, x) {
        const pad = x.c === 6 ? [1, 0, .5, .8, 0, .4] : [1, 0, .5, 0, .8, .3, .5, 0];
        const v = pad[x.p] * (x.energia < .5 ? .5 : 1);
        if (v) madeiraSeca(x.p === 0 ? 150 : x.p % 3 === 0 ? 190 : 230, t, .36 * v, x.g.seco, x.p % 2 ? .3 : -.3, .25);
        if (x.p % 2 === 1 && x.energia >= .6) sopro(t, .06, .03, x.g.seco, { tipo: 'highpass', f0: 6000, ataque: .01, pan: .3 });
        if (x.luta && x.p % 2 === 0) tambor(t, .25, x.g.seco);
      },
      nota(n, t, dur, x) {
        berimbau(n - 12, t, .16, x.g.seco);
        violoncelo(n - 24, t, dur * .98, .09, x.g.flauta);
      },
    },

    // Monge: o templo. O shakuhachi leva a melodia e, nas secções B e C, passa para o koto, com trémulo nas notas longas.
    // O bloco de madeira dos monges, o taiko nas entradas e a taça tibetana.
    monge: {
      compasso(t, x) {
        const [r] = x.acorde;
        if (x.barI === 0 || (x.energia >= .8 && x.barI % 2 === 0)) bombo(t, .55, x.g.seco);
        if (x.barra % 4 === 0) sino(grave(r), t, .08, x.g.flauta, 7);
      },
      colcheia(t, x) {
        if (x.p === 0 || x.p === x.c / 2) madeiraSeca(x.p ? 440 : 520, t, .16, x.g.seco, 0, .07);
        if (x.luta && x.p % 2 === 1) tambor(t, .2, x.g.seco);
      },
      nota(n, t, dur, x) {
        if (!(x.seccao === 'B' || x.seccao === 'C' || x.luta)) { shakuhachi(n - 12, t, dur * .97, .13, x.g.flauta); return; }
        koto(n, t, quase(.4), x.g.harpa);
        if (x.du >= 3) for (let k = 1; k < x.du * 2 - 1; k++) koto(n, t + k * x.d / 2, .18 * (1 - k / (x.du * 2)), x.g.harpa);
      },
    },
  };

  // O volume de cada classe, afinado pelo medidor para ficar ao nível da música do narrador.
  const VOLUME_CLASSE = { mago: 1.9, feiticeiro: 2.1, guerreiro: 1.25, bardo: 1.55, druida: 1.25, barbaro: 1.15, ladino: 1.55, clerigo: 1.2, patrulheiro: 1.8, monge: 1.4 };

  function agendar() {
    if (!ligada || !ac) return;
    const colcheia = 60 / MODOS[atual].bpm / 2;
    if (proxima < ac.currentTime) proxima = ac.currentTime + .05;
    while (proxima < ac.currentTime + .6) {
      try { tocarColcheia(proxima, colcheia); } catch (e) { passo++; if (!agendar.erro) { agendar.erro = e; console.warn('musica', e); } }
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
    passo = 0; sec = null; secNome = null; secI = 0; barI = 0; mel = []; melI = 0; resto = 0;
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
    // A classe escolhe o arranjo: a mesma melodia, com os instrumentos dela.
    // Só para os testes: 'melodia' ou 'acompanhamento' toca só essa parte; null volta a tocar tudo.
    parte(nome) { soParte = nome || null; },
    classe(c) { if (c === null || (ARRANJOS[c] && c !== classe)) { classe = c; barra = 0; } },
    alternar() {
      ligada = !ligada;
      if (ac) {
        saida.gain.setTargetAtTime(ligada ? .5 : 0, ac.currentTime, .15);
        if (ligada) { proxima = 0; if (!relogio) relogio = setInterval(agendar, 120); }
        else { clearInterval(relogio); relogio = null; }
      }
      return ligada;
    },
    // Só para os testes: grava o que está a tocar durante uns segundos (devolve um Blob de áudio).
    gravar(segundos) {
      if (!ac || !window.MediaRecorder) return Promise.resolve(null);
      const dest = ac.createMediaStreamDestination(), rec = new MediaRecorder(dest.stream), partes = [];
      medidor.connect(dest);
      rec.ondataavailable = e => partes.push(e.data);
      return new Promise(res => {
        rec.onstop = () => { medidor.disconnect(dest); res(new Blob(partes, { type: rec.mimeType })); };
        rec.start(); setTimeout(() => rec.stop(), segundos * 1000);
      });
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
