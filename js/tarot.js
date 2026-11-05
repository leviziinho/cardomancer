// As cartas de classe são arcanos do tarô, desenhados como gravuras antigas: céu, raios e figura.
// Cada arcano desenha-se num quadro de 1000 por 1000.

const TINTA = '#20130a', OCRE = '#c8934a', CREME = '#f0dcae', OURO_T = '#e8bd55';

function arcanoBase(c) {
  const poli = (pontos, cor) => {
    c.fillStyle = cor; c.beginPath();
    pontos.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath(); c.fill();
  };
  const circ = (x, y, r, cor) => { c.fillStyle = cor; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  const traco = (x1, y1, x2, y2, w, cor) => { c.strokeStyle = cor; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
  const curva = (x1, y1, cx, cy, x2, y2, w, cor) => { c.strokeStyle = cor; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx, cy, x2, y2); c.stroke(); };
  const estrela = (x, y, r, cor, pontas = 8) => {
    c.fillStyle = cor; c.beginPath();
    for (let i = 0; i < pontas * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / pontas, k = i % 2 ? r * .34 : r;
      c.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k);
    }
    c.closePath(); c.fill();
  };
  // Raios de gravura a sair de um ponto.
  const raios = (x, y, r, n, cor) => {
    c.save(); c.translate(x, y); c.fillStyle = cor;
    for (let i = 0; i < n; i++) {
      c.rotate(Math.PI * 2 / n);
      c.beginPath(); c.moveTo(-4, 0); c.lineTo(-r * Math.PI / n * .5, -r); c.lineTo(r * Math.PI / n * .5, -r); c.lineTo(4, 0); c.fill();
    }
    c.restore();
  };
  const sol = (x, y, r) => { raios(x, y, r * 1.9, 18, OURO_T); circ(x, y, r, OURO_T); circ(x, y, r * .78, '#f7dc8a'); };
  const chao = (y, cor) => { c.fillStyle = cor; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(300, y - 34, 650, y + 34, 1000, y - 10); c.lineTo(1000, 1000); c.lineTo(0, 1000); c.closePath(); c.fill(); };
  const manto = (x, topo, base, l1, l2, cor, dobra = 'rgba(0,0,0,.26)') => {
    c.fillStyle = cor; c.beginPath();
    c.moveTo(x - l1, topo); c.quadraticCurveTo(x - l2 * .9, (topo + base) / 2, x - l2, base); c.quadraticCurveTo(x, base + 22, x + l2, base);
    c.quadraticCurveTo(x + l2 * .9, (topo + base) / 2, x + l1, topo); c.quadraticCurveTo(x, topo - 26, x - l1, topo); c.fill();
    [-.45, 0, .45].forEach(k => curva(x + l1 * k, topo + 30, x + l2 * k * 1.1, (topo + base) / 2, x + l2 * k, base, 6, dobra));
  };
  const cabeca = (x, y, r = 46, cor = '#e2b98a') => { circ(x, y, r + 4, TINTA); circ(x, y, r, cor); };
  const lamina = (x1, y1, x2, y2, w = 16) => { traco(x1, y1, x2, y2, w + 6, TINTA); traco(x1, y1, x2, y2, w, '#dfe3e6'); };
  return { poli, circ, traco, curva, estrela, raios, sol, chao, manto, cabeca, lamina };
}

// Cada arcano recebe o contexto e as ferramentas, e desenha a sua cena.
const ARCANOS_DESENHO = {
  // 0, O Louco: quem vai a cantar à beira do precipício, com o alaúde às costas e o cão atrás.
  bardo: {
    ceu: ['#f0c86a', '#d98f45'],
    d(c, t) {
      t.sol(790, 190, 88);
      t.poli([[0, 760], [650, 700], [760, 790], [700, 1000], [0, 1000]], '#5c6b3a');
      t.poli([[760, 790], [1000, 1000], [700, 1000]], '#2c2a24');
      t.manto(400, 400, 700, 62, 118, '#9c2b28');
      t.poli([[338, 690], [462, 690], [478, 742], [322, 742]], '#7a2020');
      t.traco(360, 742, 346, 800, 28, TINTA); t.traco(440, 742, 480, 796, 28, TINTA);
      t.cabeca(400, 340);
      t.poli([[350, 320], [400, 240], [450, 320]], '#2e6b4e');
      t.circ(400, 238, 11, OURO_T);
      // O alaúde
      c.save(); c.translate(310, 520); c.rotate(-.55);
      c.fillStyle = TINTA; c.beginPath(); c.ellipse(0, 0, 66, 88, 0, 0, 7); c.fill();
      c.fillStyle = '#b77a35'; c.beginPath(); c.ellipse(0, 0, 58, 80, 0, 0, 7); c.fill();
      t.circ(0, -10, 18, TINTA); t.traco(0, -80, 0, -230, 20, TINTA); t.traco(-22, -230, 22, -230, 14, TINTA);
      c.restore();
      // O bastão e a trouxa
      t.traco(450, 470, 680, 320, 12, TINTA); t.circ(696, 318, 38, '#6a4a2a');
      // O cão
      t.poli([[160, 760], [270, 748], [282, 800], [246, 800], [240, 780], [190, 786], [186, 816], [156, 816]], TINTA);
      t.circ(282, 738, 30, TINTA); t.poli([[272, 716], [292, 680], [302, 722]], TINTA);
    },
  },
  // I, O Mago: a varinha no ar, a mesa com a taça, a espada, a moeda e o bastão, e o infinito por cima.
  mago: {
    ceu: ['#2b2350', '#7a4b93'],
    d(c, t) {
      t.raios(500, 420, 620, 26, 'rgba(232,189,85,.18)');
      t.chao(830, '#3a2c50');
      c.strokeStyle = OURO_T; c.lineWidth = 15; c.beginPath();
      c.moveTo(500, 150); c.bezierCurveTo(440, 90, 370, 110, 370, 150); c.bezierCurveTo(370, 190, 440, 210, 500, 150); c.bezierCurveTo(560, 90, 630, 110, 630, 150); c.bezierCurveTo(630, 190, 560, 210, 500, 150); c.stroke();
      t.manto(500, 370, 830, 78, 168, '#8f1f24');
      t.poli([[440, 370], [560, 370], [530, 640], [470, 640]], '#efe2c3');
      t.cabeca(500, 300, 52);
      t.traco(560, 400, 720, 230, 34, '#8f1f24'); t.traco(720, 230, 764, 150, 12, CREME); t.estrela(768, 140, 34, OURO_T);
      t.traco(440, 410, 300, 610, 34, '#8f1f24');
      t.poli([[120, 620], [880, 620], [920, 690], [80, 690]], '#6a4424'); t.poli([[80, 690], [920, 690], [900, 720], [100, 720]], TINTA);
      t.traco(170, 620, 170, 500, 16, '#8a5a2a');
      t.lamina(330, 620, 330, 470); t.traco(300, 545, 360, 545, 12, OURO_T);
      t.poli([[640, 540], [720, 540], [700, 590], [660, 590]], OURO_T); t.traco(680, 590, 680, 620, 12, OURO_T);
      t.circ(830, 590, 32, OURO_T); t.estrela(830, 590, 22, TINTA, 5);
    },
  },
  // III, A Imperatriz: sentada entre o trigo e as árvores, com doze estrelas na coroa.
  druida: {
    ceu: ['#b9d38a', '#e7d58e'],
    d(c, t) {
      t.chao(740, '#4f7a2c');
      [[110, 500, 110], [880, 470, 130], [770, 540, 80], [220, 560, 70]].forEach(([x, y, r]) => { t.traco(x, y, x, 780, 22, '#4a2f18'); t.circ(x, y, r, '#2f5a2c'); t.circ(x - r * .3, y - r * .3, r * .6, '#4d8240'); });
      t.poli([[300, 300], [700, 300], [740, 800], [260, 800]], '#7a4a22');
      t.circ(500, 300, 200, '#7a4a22');
      t.manto(500, 410, 880, 88, 220, '#2f7a52');
      t.cabeca(500, 330, 56);
      for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; t.estrela(500 + Math.cos(a) * 96, 318 + Math.sin(a) * 96, 19, OURO_T); }
      t.traco(590, 470, 680, 600, 36, '#2f7a52'); t.traco(680, 600, 720, 380, 12, '#4a2f18');
      c.fillStyle = '#7fc05a'; c.beginPath(); c.ellipse(722, 350, 28, 52, .3, 0, 7); c.fill();
      c.fillStyle = OURO_T; c.beginPath(); c.moveTo(270, 620); c.lineTo(400, 620); c.lineTo(390, 730); c.quadraticCurveTo(335, 800, 280, 730); c.fill();
      c.fillStyle = '#2f5a2c'; c.beginPath(); c.ellipse(335, 680, 28, 52, 0, 0, 7); c.fill();
      for (let i = 0; i < 18; i++) { const x = 40 + i * 54, h = 60 + (i * 37) % 44; t.curva(x, 960, x + 8, 960 - h / 2, x + 14, 960 - h, 7, OURO_T); t.circ(x + 14, 950 - h, 9, '#e8a83a'); }
    },
  },
  // V, O Hierofante: entre duas colunas, de tríplice coroa, com a mão erguida.
  clerigo: {
    ceu: ['#efd9a6', '#c79e5c'],
    d(c, t) {
      t.raios(500, 300, 640, 22, 'rgba(255,245,190,.5)');
      [[170, 150], [830, 150]].forEach(([x, y]) => {
        t.poli([[x - 62, y + 40], [x + 62, y + 40], [x + 62, 860], [x - 62, 860]], '#8c8272');
        [-30, 0, 30].forEach(k => t.traco(x + k, y + 60, x + k, 850, 7, 'rgba(0,0,0,.25)'));
        t.poli([[x - 86, y], [x + 86, y], [x + 62, y + 44], [x - 62, y + 44]], '#5e5546');
      });
      t.chao(860, '#4f4436');
      t.manto(500, 410, 870, 90, 208, '#a8201e');
      t.poli([[456, 410], [544, 410], [550, 870], [450, 870]], '#f0e2bf');
      [500, 590, 680, 770].forEach(y => t.traco(470, y, 530, y, 8, OURO_T));
      t.cabeca(500, 340, 54);
      // A tríplice coroa
      t.poli([[440, 306], [560, 306], [540, 180], [500, 130], [460, 180]], OURO_T);
      [270, 225, 182].forEach(y => t.traco(446, y, 554, y, 9, '#8a5a12'));
      t.estrela(500, 122, 24, CREME);
      t.traco(590, 470, 680, 330, 36, '#a8201e'); t.traco(668, 330, 668, 268, 14, CREME); t.traco(692, 330, 692, 268, 14, CREME); t.circ(680, 342, 22, '#e2b98a');
      t.traco(410, 480, 310, 620, 36, '#a8201e');
      t.traco(310, 200, 310, 880, 16, OURO_T); [240, 280, 320].forEach((y, i) => t.traco(310 - 48 + i * 8, y, 310 + 48 - i * 8, y, 12, OURO_T));
    },
  },
  // VII, O Carro: de frente, de espada erguida, puxado por duas feras, uma clara e outra negra.
  guerreiro: {
    ceu: ['#3b5f85', '#c9b37a'],
    d(c, t) {
      t.chao(790, '#584a34');
      // O dossel de estrelas
      t.traco(280, 170, 280, 560, 16, TINTA); t.traco(720, 170, 720, 560, 16, TINTA);
      t.poli([[230, 130], [770, 130], [730, 196], [270, 196]], '#23345c');
      [320, 410, 500, 590, 680].forEach(x => t.estrela(x, 162, 24, OURO_T));
      // O guerreiro
      t.poli([[420, 340], [580, 340], [600, 600], [400, 600]], '#9aa6ad');
      t.traco(500, 350, 500, 600, 6, TINTA); t.poli([[454, 400], [546, 400], [500, 470]], OURO_T);
      t.cabeca(500, 282, 48); t.poli([[448, 272], [500, 212], [552, 272]], '#7f8b93'); t.traco(500, 214, 500, 170, 12, '#a8201e');
      t.traco(590, 390, 660, 300, 34, '#7f8b93'); t.lamina(664, 300, 700, 90); t.traco(630, 288, 700, 312, 14, OURO_T);
      t.traco(410, 390, 356, 480, 34, '#7f8b93');
      // O carro
      t.poli([[230, 540], [770, 540], [730, 790], [270, 790]], '#6b3d1e');
      t.poli([[250, 556], [750, 556], [722, 770], [278, 770]], '#8a5428');
      t.circ(500, 660, 64, OURO_T); t.estrela(500, 660, 50, '#8a1f1f');
      [[238, 810], [762, 810]].forEach(([x, y]) => { t.circ(x, y, 74, TINTA); t.circ(x, y, 56, '#8a6a3a'); t.circ(x, y, 16, TINTA); });
      // As feras
      [[110, CREME], [890, TINTA]].forEach(([x, cor]) => {
        const lado = x < 500 ? 1 : -1;
        t.poli([[x - 80, 840], [x + 80, 840], [x + 60, 960], [x - 60, 960]], cor);
        t.circ(x, 790, 70, cor); t.poli([[x - 54, 750], [x - 34, 690], [x - 10, 736]], cor); t.poli([[x + 54, 750], [x + 34, 690], [x + 10, 736]], cor);
        const olho = cor === TINTA ? CREME : TINTA;
        t.circ(x - 24, 782, 9, olho); t.circ(x + 24, 782, 9, olho);
        t.traco(x + lado * 60, 860, 500 - lado * 200, 770, 8, OURO_T);
      });
    },
  },
  // VIII, A Força: abre as mandíbulas ao leão com as mãos, e leva o machado às costas.
  barbaro: {
    ceu: ['#d9743a', '#f0c45a'],
    d(c, t) {
      t.sol(180, 170, 80);
      t.chao(820, '#6b4a22');
      t.traco(300, 300, 620, 690, 22, '#4a2f18');
      c.fillStyle = TINTA; c.beginPath(); c.moveTo(300, 300); c.quadraticCurveTo(220, 250, 160, 320); c.quadraticCurveTo(250, 340, 268, 420); c.quadraticCurveTo(290, 350, 340, 340); c.fill();
      c.fillStyle = '#dfe3e6'; c.beginPath(); c.moveTo(296, 316); c.quadraticCurveTo(232, 276, 188, 318); c.quadraticCurveTo(256, 336, 270, 386); c.quadraticCurveTo(286, 340, 320, 330); c.fill();
      t.manto(390, 410, 860, 96, 170, '#5a3a20', 'rgba(0,0,0,.3)');
      t.poli([[300, 420], [480, 420], [464, 620], [316, 620]], '#c88f62');
      t.traco(310, 610, 470, 610, 22, '#2a1a0d');
      t.cabeca(390, 340, 56, '#c88f62');
      for (let i = 0; i < 7; i++) { const a = Math.PI * 1.05 + i * Math.PI / 6.5; t.traco(390 + Math.cos(a) * 44, 330 + Math.sin(a) * 44, 390 + Math.cos(a) * 88, 330 + Math.sin(a) * 88, 18, '#6b2a12'); }
      t.traco(470, 470, 590, 540, 46, '#c88f62'); t.traco(330, 480, 590, 760, 46, '#c88f62');
      // O leão
      t.circ(730, 650, 212, '#8a4f18');
      for (let i = 0; i < 22; i++) { const a = i * Math.PI / 11; t.traco(730 + Math.cos(a) * 170, 650 + Math.sin(a) * 170, 730 + Math.cos(a) * 232, 650 + Math.sin(a) * 232, 24, '#6e3c10'); }
      t.circ(730, 640, 148, '#d6983f');
      t.circ(660, 572, 20, TINTA); t.circ(800, 572, 20, TINTA); t.circ(664, 568, 7, CREME); t.circ(804, 568, 7, CREME);
      t.poli([[700, 610], [760, 610], [730, 646]], TINTA);
      t.poli([[640, 660], [820, 660], [790, 760], [670, 760]], '#5a1410');
      [[660, 660], [720, 660], [780, 660]].forEach(([x, y]) => t.poli([[x, y], [x + 34, y], [x + 17, y + 36]], CREME));
      [[690, 760], [750, 760]].forEach(([x, y]) => t.poli([[x, y], [x + 30, y], [x + 15, y - 30]], CREME));
    },
  },
  // XIV, A Temperança: um pé na água e outro na terra, a verter de uma taça para a outra.
  monge: {
    ceu: ['#a9d0d8', '#f1e2b8'],
    d(c, t) {
      t.sol(740, 260, 56);
      t.poli([[560, 640], [740, 380], [920, 640]], '#7f8f8c'); t.poli([[700, 438], [740, 380], [780, 438], [740, 420]], CREME);
      t.chao(720, '#5f7a44');
      t.poli([[0, 760], [430, 740], [470, 1000], [0, 1000]], '#3f7f93');
      for (let i = 0; i < 6; i++) t.curva(30 + i * 60, 800 + i * 28, 80 + i * 60, 786 + i * 28, 130 + i * 60, 800 + i * 28, 7, 'rgba(240,250,250,.55)');
      t.manto(500, 380, 900, 76, 150, '#5a6a78');
      t.traco(420, 610, 590, 610, 22, '#c8481a');
      t.cabeca(500, 300, 52);
      t.estrela(500, 268, 18, OURO_T);
      c.strokeStyle = OURO_T; c.lineWidth = 8; c.beginPath(); c.arc(500, 300, 78, 0, 7); c.stroke();
      t.traco(430, 420, 320, 500, 34, '#5a6a78'); t.traco(570, 420, 690, 600, 34, '#5a6a78');
      t.poli([[270, 470], [360, 470], [340, 540], [290, 540]], OURO_T); t.poli([[650, 590], [740, 590], [720, 660], [670, 660]], OURO_T);
      c.strokeStyle = '#6fc4dc'; c.lineWidth = 16; c.setLineDash([24, 12]); c.lineCap = 'butt'; c.beginPath(); c.moveTo(355, 486); c.quadraticCurveTo(520, 430, 690, 596); c.stroke(); c.setLineDash([]);
      t.traco(450, 900, 400, 970, 28, '#e2b98a'); t.traco(550, 900, 590, 960, 28, '#e2b98a');
    },
  },
  // XVI, A Torre: o raio parte a coroa, e o fogo sai pelas janelas.
  feiticeiro: {
    ceu: ['#191228', '#5a2230'],
    d(c, t) {
      for (let i = 0; i < 30; i++) t.circ(40 + (i * 311) % 930, 40 + (i * 173) % 420, 3 + i % 4, OURO_T);
      t.chao(880, '#2a1a1a');
      t.poli([[350, 330], [650, 330], [700, 900], [300, 900]], '#6d5c4c');
      [420, 520, 620, 720, 820].forEach((y, i) => { t.traco(330, y, 670, y, 5, 'rgba(0,0,0,.34)'); });
      [[430, 480], [570, 480], [500, 640], [420, 780], [580, 780]].forEach(([x, y]) => {
        t.poli([[x - 30, y + 54], [x + 30, y + 54], [x + 30, y - 10], [x, y - 40], [x - 30, y - 10]], TINTA);
        t.poli([[x - 20, y + 54], [x + 20, y + 54], [x + 28, y - 8], [x + 4, y + 8], [x, y - 62], [x - 10, y + 8], [x - 28, y - 8]], '#f08a28');
        t.poli([[x - 9, y + 54], [x + 9, y + 54], [x + 12, y + 12], [x, y - 12], [x - 12, y + 12]], '#ffd84d');
      });
      // A coroa a cair
      t.poli([[316, 330], [684, 330], [650, 280], [350, 280]], '#57493c');
      c.save(); c.translate(690, 200); c.rotate(.42);
      t.poli([[-100, 50], [100, 50], [128, -40], [58, 4], [0, -62], [-58, 4], [-128, -40]], OURO_T);
      t.traco(-100, 50, 100, 50, 14, '#8a5a12');
      c.restore();
      // O raio
      t.poli([[780, 0], [640, 170], [720, 170], [560, 340], [650, 320], [500, 470], [740, 240], [650, 250], [860, 50], [780, 60], [860, 0]], '#ffe96a');
      t.raios(560, 340, 180, 14, 'rgba(255,233,106,.55)');
      // Quem cai
      [[190, 560, .9, '#2f4f7a'], [830, 640, -1, '#8f1f24']].forEach(([x, y, r, cor]) => {
        c.save(); c.translate(x, y); c.rotate(r);
        t.manto(0, -40, 110, 28, 62, cor); t.cabeca(0, -76, 30); t.traco(-30, -10, -86, 30, 20, cor); t.traco(30, -10, 86, -50, 20, cor);
        c.restore();
      });
    },
  },
  // XVII, A Estrela: oito estrelas sobre o caminho, e quem conhece os trilhos a apontar o arco.
  patrulheiro: {
    ceu: ['#16304a', '#4b7a78'],
    d(c, t) {
      t.raios(500, 200, 520, 16, 'rgba(255,235,160,.14)');
      t.estrela(500, 200, 118, OURO_T); t.estrela(500, 200, 62, '#fff2bc');
      [[150, 120], [300, 90], [720, 80], [860, 130], [120, 310], [870, 330], [770, 240]].forEach(([x, y]) => t.estrela(x, y, 40, CREME));
      t.poli([[0, 700], [240, 440], [430, 700]], '#23404a'); t.poli([[560, 700], [800, 420], [1000, 700]], '#1c3540');
      t.chao(700, '#35592f');
      [[90, 620], [930, 610], [840, 680]].forEach(([x, y], i) => { const h = 150 + i * 16; t.poli([[x - 62, y + 60], [x, y - h], [x + 62, y + 60]], '#183a24'); t.traco(x, y + 60, x, y + 110, 18, '#3c2614'); });
      // A figura ajoelhada
      t.manto(430, 500, 770, 62, 132, '#2f5a33');
      t.poli([[370, 500], [490, 500], [430, 420]], '#254829');
      t.cabeca(430, 450, 42); t.poli([[378, 448], [430, 372], [482, 448], [430, 424]], '#254829');
      t.traco(320, 770, 560, 820, 44, '#2f5a33'); t.traco(560, 820, 580, 900, 34, '#4a2f18'); t.traco(330, 770, 300, 900, 34, '#4a2f18');
      // O arco tenso
      c.strokeStyle = '#6e4420'; c.lineWidth = 15; c.lineCap = 'round'; c.beginPath(); c.moveTo(640, 340); c.quadraticCurveTo(770, 500, 640, 690); c.stroke();
      t.traco(640, 340, 480, 530, 4, CREME); t.traco(480, 530, 640, 690, 4, CREME);
      t.traco(480, 530, 810, 500, 8, CREME); t.poli([[810, 482], [858, 496], [812, 518]], '#dfe3e6');
      t.traco(470, 540, 700, 510, 30, '#2f5a33');
    },
  },
  // XVIII, A Lua: duas torres, dois cães a uivar, e a figura de capuz a passar no meio deles.
  ladino: {
    ceu: ['#10203c', '#3a4f77'],
    d(c, t) {
      t.raios(500, 220, 540, 24, 'rgba(240,230,170,.12)');
      t.circ(500, 220, 136, '#efe0a6');
      c.fillStyle = '#c9b673'; c.beginPath(); c.arc(500, 220, 136, -1.4, 1.4); c.quadraticCurveTo(450, 220, 524, 85); c.fill();
      t.traco(440, 186, 482, 190, 8, TINTA); t.traco(530, 190, 572, 186, 8, TINTA); t.curva(460, 276, 505, 296, 548, 268, 8, TINTA); t.traco(504, 200, 492, 244, 6, TINTA);
      for (let i = 0; i < 14; i++) t.circ(160 + (i * 67) % 680, 370 + (i % 3) * 22, 7, OURO_T);
      [[100, 400], [900, 400]].forEach(([x, y]) => { t.poli([[x - 72, 790], [x - 58, y], [x + 58, y], [x + 72, 790]], '#4d5266'); [-58, -18, 22].forEach(k => t.poli([[x + k, y], [x + k + 26, y], [x + k + 26, y - 40], [x + k, y - 40]], '#4d5266')); t.poli([[x - 14, 560], [x + 14, 560], [x + 14, 500], [x - 14, 500]], '#efd27a'); });
      t.chao(760, '#27354a');
      t.poli([[420, 1000], [460, 740], [540, 740], [600, 1000]], '#46506a');
      // Os cães
      [[210, 1], [790, -1]].forEach(([x, l]) => {
        const k = l * 58;
        t.poli([[x - 78, 830], [x + 78, 830], [x + 62, 930], [x - 62, 930]], TINTA);
        t.poli([[x - 38, 840], [x + 38, 840], [x + k + 14, 700], [x + k - 18, 700]], TINTA);
        t.poli([[x + k - 34, 712], [x + k + 40, 690], [x + k + l * 76, 620], [x + k - 8, 650]], TINTA);
        t.poli([[x + k - 22, 690], [x + k - 40, 636], [x + k, 668]], TINTA);
      });
      // O ladino, de capuz
      t.manto(500, 470, 880, 70, 134, '#1a1a2a', 'rgba(255,255,255,.08)');
      t.poli([[432, 500], [568, 500], [500, 380]], '#1a1a2a');
      t.circ(500, 480, 34, '#0a0a12'); t.circ(486, 476, 5, '#e6c766'); t.circ(514, 476, 5, '#e6c766');
      t.traco(570, 560, 650, 640, 26, '#1a1a2a'); t.lamina(652, 640, 700, 540, 12); t.traco(636, 622, 672, 660, 10, OURO_T);
      t.traco(430, 560, 370, 650, 26, '#1a1a2a'); t.poli([[340, 650], [396, 650], [388, 720], [348, 720]], '#7a5a20');
      // O lagostim a sair da água
      t.poli([[0, 1000], [0, 930], [360, 950], [430, 1000]], '#25506a');
    },
  },
};

// Pinta o arcano no retângulo, com a cabeça em arco como nos baralhos antigos.
// Serve também às outras cartas com ilustração pintada: vem em "pintada", e não há arcano.
function arteDe(chave) {
  const p = typeof ARTE !== 'undefined' && ARTE.img[chave];
  return p && p.complete && p.naturalWidth ? p : null;
}
function desenharArcano(x, chave, X, Y, W, H, moldura, pintada = null) {
  const a = ARCANOS_DESENHO[chave];
  if (!a && !pintada) return;
  x.save();
  x.beginPath(); x.moveTo(X, Y + H); x.lineTo(X, Y + 60); x.quadraticCurveTo(X, Y, X + 60, Y); x.lineTo(X + W - 60, Y); x.quadraticCurveTo(X + W, Y, X + W, Y + 60); x.lineTo(X + W, Y + H); x.closePath();
  x.clip();
  const ceu = x.createLinearGradient(0, Y, 0, Y + H);
  ceu.addColorStop(0, a ? a.ceu[0] : '#3a2a1a'); ceu.addColorStop(1, a ? a.ceu[1] : '#1a120a');
  x.fillStyle = ceu; x.fillRect(X, Y, W, H);
  // Se já há ilustração pintada para esta classe, é ela que ocupa a janela.
  const pintura = pintada || arteDe(`classes/${chave}`);
  if (pintura) x.drawImage(pintura, X, Y, W, H);
  else {
  // A cena faz-se num quadro de 1000x1000, encostada ao fundo da moldura.
  const e = Math.min(W, H) / 1000;
  x.save();
  x.translate(X + (W - 1000 * e) / 2, Y + H - 1000 * e);
  x.scale(e, e);
  a.d(x, arcanoBase(x));
  x.restore();
  // Traços de gravura e papel velho por cima, para tudo parecer impresso à mão.
  x.globalAlpha = .07; x.strokeStyle = '#201008'; x.lineWidth = 1.5;
  for (let i = Y; i < Y + H; i += 7) { x.beginPath(); x.moveTo(X, i); x.lineTo(X + W, i); x.stroke(); }
  x.globalAlpha = 1;
  }
  const papel = x.createRadialGradient(X + W / 2, Y + H / 2, H * .2, X + W / 2, Y + H / 2, H * .8);
  papel.addColorStop(0, 'rgba(240,210,150,0)'); papel.addColorStop(1, pintura ? 'rgba(50,28,10,.3)' : 'rgba(70,40,15,.42)');
  x.fillStyle = papel; x.fillRect(X, Y, W, H);
  x.restore();
  x.strokeStyle = moldura; x.lineWidth = 10;
  x.beginPath(); x.moveTo(X, Y + H); x.lineTo(X, Y + 60); x.quadraticCurveTo(X, Y, X + 60, Y); x.lineTo(X + W - 60, Y); x.quadraticCurveTo(X + W, Y, X + W, Y + 60); x.lineTo(X + W, Y + H); x.closePath(); x.stroke();
}
