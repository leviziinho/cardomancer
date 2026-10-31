// Trilha sonora feita em tempo real, sem ficheiros: um bordão baixo, uma corda dedilhada e tambores.
// Cada momento do jogo tem o seu modo, com outro compasso e outra escala.

const musica = (() => {
  const MODOS = {
    calma: { bpm: 58, raiz: 50, escala: [0, 2, 3, 5, 7, 9, 10], acordes: [0, -2, 3, -2], tambor: [], silencio: .55, volume: .9 },
    combate: { bpm: 104, raiz: 45, escala: [0, 1, 3, 5, 7, 8, 10], acordes: [0, 0, 1, 0], tambor: [1, 0, 0, 1, 0, 0, 1, 0], silencio: .6, volume: .85 },
    chefe: { bpm: 82, raiz: 43, escala: [0, 1, 3, 4, 7, 8, 10], acordes: [0, 1, 0, -1], tambor: [1, 0, 1, 0, 1, 0, 0, 1], silencio: .4, volume: 1 },
  };
  let ac = null, saida = null, medidor = null, relogio = null, bordao = [];
  let atual = 'calma', ligada = true, proxima = 0, passo = 0, grau = 4;

  const hertz = n => 440 * Math.pow(2, (n - 69) / 12);

  function corda(n, t, dur, vol) {
    [[1, 'triangle', 1], [2, 'sine', .22]].forEach(([mult, tipo, peso]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = tipo;
      o.frequency.value = hertz(n) * mult;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * peso, t + .012);
      g.gain.exponentialRampToValueAtTime(.0008, t + dur);
      o.connect(g); g.connect(saida);
      o.start(t); o.stop(t + dur + .05);
    });
  }

  function tambor(t, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(95, t);
    o.frequency.exponentialRampToValueAtTime(42, t + .2);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.001, t + .32);
    o.connect(g); g.connect(saida);
    o.start(t); o.stop(t + .36);
  }

  function pararBordao(fade = 1.2) {
    const t = ac.currentTime;
    bordao.forEach(({ o, g }) => {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + fade);
      o.stop(t + fade + .05);
    });
    bordao = [];
  }

  function comecarBordao() {
    const m = MODOS[atual], t = ac.currentTime;
    pararBordao();
    [m.raiz - 12, m.raiz - 5].forEach(n => {
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'sawtooth';
      o.frequency.value = hertz(n);
      f.type = 'lowpass'; f.frequency.value = 340;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.055 * m.volume, t + 2);
      o.connect(f); f.connect(g); g.connect(saida);
      o.start(t);
      bordao.push({ o, g });
    });
  }

  // Um compasso são oito passos. A melodia anda aos poucos pela escala, e muitas vezes cala-se.
  function tocarPasso(t, dur) {
    const m = MODOS[atual], p = passo % 8, compasso = Math.floor(passo / 8);
    const acorde = m.raiz + m.acordes[compasso % m.acordes.length];
    if (p === 0) corda(acorde, t, dur * 7, .17 * m.volume);
    if (p === 4) corda(acorde + 7, t, dur * 5, .1 * m.volume);
    if (m.tambor[p]) tambor(t, (p === 0 ? .42 : .28) * m.volume);
    if (Math.random() < m.silencio) return;
    grau = Math.max(0, Math.min(m.escala.length * 2 - 1, grau + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
    const oitava = Math.floor(grau / m.escala.length);
    corda(m.raiz + 12 + m.escala[grau % m.escala.length] + oitava * 12, t, dur * 5, .1 * m.volume);
  }

  function agendar() {
    if (!ligada || !ac) return;
    const dur = 60 / MODOS[atual].bpm / 2;
    if (proxima < ac.currentTime) proxima = ac.currentTime + .05;
    while (proxima < ac.currentTime + .5) {
      tocarPasso(proxima, dur);
      proxima += dur;
      passo++;
    }
  }

  function iniciar() {
    if (ac) return;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      const filtro = ac.createBiquadFilter(), eco = ac.createDelay(1), volta = ac.createGain();
      saida = ac.createGain();
      medidor = ac.createAnalyser();
      medidor.fftSize = 2048;
      filtro.type = 'lowpass'; filtro.frequency.value = 2400;
      eco.delayTime.value = .34; volta.gain.value = .26;
      saida.gain.value = .42;
      saida.connect(filtro);
      filtro.connect(medidor);
      filtro.connect(eco); eco.connect(volta); volta.connect(eco); volta.connect(medidor);
      medidor.connect(ac.destination);
    } catch (e) { ac = null; }
  }

  return {
    // Os navegadores só deixam tocar depois de um clique, por isso começa no botão Nova Partida.
    ligar() {
      iniciar();
      if (!ac) return;
      ac.resume();
      if (ligada && !relogio) { comecarBordao(); relogio = setInterval(agendar, 120); }
    },
    modo(nome) {
      if (nome === atual) return;
      atual = nome;
      passo = 0;
      if (ac && ligada) comecarBordao();
    },
    alternar() {
      ligada = !ligada;
      if (ac) {
        if (ligada) { comecarBordao(); if (!relogio) relogio = setInterval(agendar, 120); }
        else { pararBordao(.4); clearInterval(relogio); relogio = null; }
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
