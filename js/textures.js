// Tudo o que se vê é desenhado em código: madeira, pergaminho, mapa, cartas e páginas.
// Assim as cartas têm alta resolução sem precisar de nenhum ficheiro de imagem.

let FONT_TITLE = '"Cinzel", Georgia, serif';
let FONT_BODY = '"EB Garamond", Georgia, serif';

const GLYPHS = {
  fist: 'M20 44h12V24h11v20h5V16h11v28h5V24h11v20h5c4 0 6 3 6 7v9c0 22-14 36-34 36S20 82 20 60z',
  axe: 'M40 4h10v92H40z M50 18l10 4c5-9 13-15 24-18 12 15 12 43 0 60-11-3-19-9-24-18l-10 4z M40 22L24 30l16 8z',
  heart: 'M50 92C20 68 5 51 5 32 5 18 16 8 29 8c9 0 17 5 21 14C54 13 62 8 71 8c13 0 24 10 24 24 0 19-15 36-45 60z',
  dagger: 'M50 4l10 52H40z M28 56h44v8H28z M44 64h12v22H44z M40 86h20v9H40z',
  note: 'M38 18l42-10v58a14 11 0 1 1-8-10V24l-26 6v46a14 11 0 1 1-8-10z',
  star: 'M50 3l10 37 37 10-37 10-10 37-10-37L3 50l37-10z',
  sun: 'M50 30a20 20 0 1 0 .01 0z M46 3h8v20h-8z M46 77h8v20h-8z M3 46h20v8H3z M77 46h20v8H77z M17 12l15 15-6 6-15-15z M83 12l6 6-15 15-6-6z M11 83l15-15 6 6-15 15z M89 83l-6 6-15-15 6-6z',
  bow: 'M24 5c44 8 60 46 48 90l-8-2c10-40-4-70-41-80z M22 6l6-2 40 90-6 2z M8 50h70l-10-8 3-4 18 14-18 14-3-4 10-8H8z',
  leaf: 'M20 86C12 40 44 10 90 10c2 48-26 76-62 68l-6 12z',
  scroll: 'M24 10h58v12H72v60a8 8 0 0 1-8 8H14V78h44V20a8 8 0 0 0-8-8z',
  bag: 'M38 10h24l-6 18H44z M36 32h28c16 12 24 28 24 40 0 12-12 20-38 20s-38-8-38-20c0-12 8-28 24-40z',
  sign: 'M46 5h8v90h-8z M54 12h28l12 11-12 11H54z M46 40H20L8 51l12 11h26z',
  hammer: 'M16 10h68v30H58v52H42V40H16z',
  feather: 'M86 8C50 10 24 36 22 66L10 90l6 3 12-22c32-2 56-28 58-63z',
  eye: 'M3 50C24 16 76 16 97 50 76 84 24 84 3 50z M50 33a17 17 0 1 0 .01 0z',
  speech: 'M10 14h80v54H44L22 90V68H10z',
  tower: 'M24 92V32h-7V10h13v9h8v-9h24v9h8v-9h13v22h-7v60H58V68a8 8 0 0 0-16 0v24z',
  lock: 'M30 44V30a20 20 0 0 1 40 0v14h8v48H22V44z M41 44h18V30a9 9 0 0 0-18 0z',
  crown: 'M10 76L4 26l24 20L50 12l22 34 24-20-6 50z M12 82h76v9H12z',
  peak: 'M3 90L36 22l17 30 12-20 32 58z',
  drop: 'M50 5C62 30 84 46 84 64a34 34 0 0 1-68 0C16 46 38 30 50 5z',
  sword: 'M50 3l8 12v52h15v8H57v12l5 9H38l5-9V75H27v-8h15V15z',
  shield: 'M50 5l36 12v30c0 24-16 40-36 48-20-8-36-24-36-48V17z',
  coin: 'M50 8a42 42 0 1 0 .01 0z M50 24a26 26 0 1 1-.01 0z',
  rune: 'M28 6h10v36l24-36h12L50 42l26 52H64L40 48l-2 2v44H28z',
  person: 'M50 8a19 19 0 1 0 .01 0z M50 50c24 0 36 14 36 42H14c0-28 12-42 36-42z',
  hourglass: 'M20 6h60v9h-6c0 16-8 26-18 35 10 9 18 19 18 35h6v9H20v-9h6c0-16 8-26 18-35-10-9-18-19-18-35h-6z',
  moon: 'M62 6a44 44 0 1 0 32 74A38 38 0 0 1 62 6z',
  flame: 'M50 4c6 22 30 30 30 58 0 20-14 34-30 34S20 82 20 62c0-14 8-22 12-30 2 10 8 14 12 14 4-14-2-28 6-42z',
  seal: 'M50 8l11 8 14-1 5 13 12 8-4 14 4 14-12 8-5 13-14-1-11 8-11-8-14 1-5-13-12-8 4-14-4-14 12-8 5-13 14 1z',
};

const CARTA_TAB = { w: 3.3 * .56, h: 4.62 * .56 };

const CARD_THEMES = {
  classe: { band: '#7c1f1f', accent: '#c9a24a', label: 'Classe' },
  antecedente: { band: '#2b2f6b', accent: '#c9a24a', label: 'Antecedente' },
  raca: { band: '#2f5a33', accent: '#c9a24a', label: 'Raça' },
  equipamento: { band: '#6e4a1e', accent: '#d8b45e', label: 'Equipamento' },
  cidade: { band: '#27505f', accent: '#c9a24a', label: 'Cidade' },
  escolha: { band: '#4a3a28', accent: '#b8914a', label: 'Escolha' },
  combate: { band: '#7c1f1f', accent: '#c9a24a', label: 'Combate' },
  social: { band: '#234a7a', accent: '#c9a24a', label: 'Social' },
  habilidade: { band: '#2f5a33', accent: '#c9a24a', label: 'Habilidade' },
  investigacao: { band: '#4f2f73', accent: '#c9a24a', label: 'Investigação' },
  talento: { band: '#14535a', accent: '#d8b45e', label: 'Talento' },
  rara: { band: '#e0ae1c', accent: '#fff0a8', label: 'Rara', texto: '#2a1a0d', tinta: '#7a5508' },
  pista: { band: '#a3201a', accent: '#ffd76a', label: 'A Pista' },
  magia: { band: '#7a2a78', accent: '#e8c4f0', label: 'Magia' },
  tecnica: { band: '#a2481a', accent: '#f0c98a', label: 'Técnica' },
  destino: { band: '#191310', accent: '#c9a24a', label: 'Trama Secreta' },
};

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, renderer, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

function drawGlyph(ctx, name, x, y, size, color) {
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(size / 100, size / 100);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(GLYPHS[name] || GLYPHS.star), 'evenodd');
  ctx.restore();
}

// Texto com símbolos: "+8 Ouro" desenha-se "+8" e uma moeda, "+2 XP" com uma estrela, "-3 Vida" com um coração. A letra já vem posta em ctx.font.
// Devolve a largura, e só desenha quando recebe uma posição (o centro do texto).
const ICONES_TEXTO = { Ouro: 'coin', XP: 'star', Vida: 'heart' };
function textoIcones(ctx, t, tam, cores, cx, y) {
  const partes = t.split(/(\d+ (?:Ouro|XP|Vida)\b)/).filter(Boolean).map(s => {
    const m = s.match(/^(\d+) (Ouro|XP|Vida)$/);
    return m ? { txt: m[1], icone: ICONES_TEXTO[m[2]] } : { txt: s };
  });
  const lado = tam * .92, folga = tam * .1;
  const largura = partes.reduce((a, p) => a + ctx.measureText(p.txt).width + (p.icone ? folga + lado : 0), 0);
  if (cx === undefined) return largura;
  ctx.save();
  ctx.textAlign = 'left';
  let px = cx - largura / 2;
  partes.forEach(p => {
    ctx.fillText(p.txt, px, y);
    px += ctx.measureText(p.txt).width;
    if (p.icone) { drawGlyph(ctx, p.icone, px + folga + lado / 2, y - tam * .34, lado, cores[p.icone] || ctx.fillStyle); px += folga + lado; }
  });
  ctx.restore();
  return largura;
}

// A máscara de teatro em marca d'água, atrás do texto da carta: 'bom' sorri, 'mau' chora, 'neutro' cerra os lábios.
function desenharMascara(x, tipo, cx, cy, s) {
  const tinta = a => `rgba(92, 58, 24, ${a})`;
  x.save();
  x.lineCap = 'round'; x.lineJoin = 'round';
  // O rosto: testa larga, maçãs altas e queixo estreito.
  x.beginPath();
  x.moveTo(cx, cy - .52 * s);
  x.bezierCurveTo(cx + .36 * s, cy - .54 * s, cx + .5 * s, cy - .34 * s, cx + .47 * s, cy - .06 * s);
  x.bezierCurveTo(cx + .44 * s, cy + .26 * s, cx + .22 * s, cy + .5 * s, cx, cy + .55 * s);
  x.bezierCurveTo(cx - .22 * s, cy + .5 * s, cx - .44 * s, cy + .26 * s, cx - .47 * s, cy - .06 * s);
  x.bezierCurveTo(cx - .5 * s, cy - .34 * s, cx - .36 * s, cy - .54 * s, cx, cy - .52 * s);
  x.closePath();
  x.fillStyle = tinta(.14); x.fill();
  x.lineWidth = s * .018; x.strokeStyle = tinta(.36); x.stroke();
  // As fitas de atar, dos dois lados.
  [-1, 1].forEach(l => {
    x.beginPath();
    x.moveTo(cx + l * .47 * s, cy - .12 * s);
    x.bezierCurveTo(cx + l * .6 * s, cy - .1 * s, cx + l * .56 * s, cy + .12 * s, cx + l * .66 * s, cy + .22 * s);
    x.lineWidth = s * .022; x.strokeStyle = tinta(.22); x.stroke();
  });
  x.fillStyle = tinta(.4); x.strokeStyle = tinta(.4);
  [-1, 1].forEach(l => {
    const ex = cx + l * .19 * s, ey = cy - .12 * s;
    // Os olhos: arcos fechados de riso, gotas caídas de tristeza, ou rasgos direitos.
    x.beginPath();
    if (tipo === 'bom') {
      x.lineWidth = s * .035;
      x.arc(ex, ey + .03 * s, .08 * s, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
    } else {
      // Na triste, os cantos de fora descaem.
      x.ellipse(ex, ey, .1 * s, .045 * s, l * (tipo === 'mau' ? .3 : 0), 0, Math.PI * 2);
      x.fill();
    }
    // As sobrancelhas.
    x.beginPath();
    x.lineWidth = s * .025;
    if (tipo === 'bom') { x.arc(ex, ey - .04 * s, .13 * s, Math.PI * 1.2, Math.PI * 1.8); }
    else if (tipo === 'mau') { x.moveTo(ex - l * .12 * s, ey - .1 * s); x.lineTo(ex + l * .1 * s, ey - .2 * s); }
    else { x.moveTo(ex - .12 * s, ey - .15 * s); x.lineTo(ex + .12 * s, ey - .15 * s); }
    x.stroke();
  });
  // A lágrima, só na triste.
  if (tipo === 'mau') {
    const tx = cx - .2 * s, ty = cy + .02 * s;
    x.beginPath(); x.moveTo(tx, ty); x.quadraticCurveTo(tx + .04 * s, ty + .08 * s, tx, ty + .1 * s); x.quadraticCurveTo(tx - .04 * s, ty + .08 * s, tx, ty); x.fill();
  }
  // A boca.
  x.beginPath(); x.lineWidth = s * .04;
  const my = cy + .26 * s;
  if (tipo === 'bom') { x.moveTo(cx - .2 * s, my - .05 * s); x.quadraticCurveTo(cx, my + .18 * s, cx + .2 * s, my - .05 * s); }
  else if (tipo === 'mau') { x.moveTo(cx - .18 * s, my + .08 * s); x.quadraticCurveTo(cx, my - .12 * s, cx + .18 * s, my + .08 * s); }
  else { x.moveTo(cx - .15 * s, my); x.lineTo(cx + .15 * s, my); }
  x.stroke();
  x.restore();
}

// Símbolo com volume: sombra por baixo, cor em degradé e um fio de luz por cima.
function drawGlyphRico(ctx, name, x, y, size, escuro, claro) {
  const caminho = new Path2D(GLYPHS[name] || GLYPHS.star);
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(size / 100, size / 100);
  ctx.save();
  ctx.translate(1.1, 1.6);
  ctx.fillStyle = 'rgba(30,15,5,.55)';
  ctx.fill(caminho, 'evenodd');
  ctx.restore();
  const g = ctx.createLinearGradient(0, 0, 0, 100);
  g.addColorStop(0, claro); g.addColorStop(.55, escuro); g.addColorStop(1, escuro);
  ctx.fillStyle = g;
  ctx.fill(caminho, 'evenodd');
  ctx.lineWidth = .7; ctx.strokeStyle = 'rgba(255,240,200,.55)';
  ctx.stroke(caminho);
  ctx.restore();
}

// Folha de ouro: um degradé com vários reflexos.
function ouroEm(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  [[0, '#7a5a1c'], [.18, '#f4d986'], [.36, '#b0822e'], [.52, '#fff0b4'], [.7, '#a87c2a'], [.86, '#ecca74'], [1, '#6e4f18']].forEach(([a, b]) => g.addColorStop(a, b));
  return g;
}

function losango(ctx, x, y, r) {
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill();
}

// Relevo: transforma uma imagem de alturas em cinzento num mapa de normais.
function normaisDe(altura, renderer, forca = 2) {
  const w = altura.width, h = altura.height, src = altura.getContext('2d').getImageData(0, 0, w, h).data;
  const [c, x] = canvas(w, h);
  const img = x.createImageData(w, h), d = img.data;
  for (let j = 0; j < h; j++) {
    const cima = (j + h - 1) % h, baixo = (j + 1) % h;
    for (let i = 0; i < w; i++) {
      const esq = (i + w - 1) % w, dir = (i + 1) % w;
      const nx = -(src[(j * w + dir) * 4] - src[(j * w + esq) * 4]) / 255 * forca;
      const ny = (src[(baixo * w + i) * 4] - src[(cima * w + i) * 4]) / 255 * forca;
      const l = 1 / Math.sqrt(nx * nx + ny * ny + 1), k = (j * w + i) * 4;
      d[k] = (nx * l * .5 + .5) * 255; d[k + 1] = (ny * l * .5 + .5) * 255; d[k + 2] = (l * .5 + .5) * 255; d[k + 3] = 255;
    }
  }
  x.putImageData(img, 0, 0);
  return toTexture(c, renderer, { linear: true });
}

function speckle(ctx, w, h, count, alpha, dark = true) {
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 2.2 + 0.3;
    ctx.fillStyle = dark ? `rgba(70,45,20,${Math.random() * alpha})` : `rgba(255,240,210,${Math.random() * alpha})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, r, r);
  }
}

function paintParchment(ctx, w, h, base = '#e4d3a9') {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = (0.06 + Math.random() * 0.2) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const tone = Math.random() < 0.55 ? '120,85,40' : '255,240,205';
    g.addColorStop(0, `rgba(${tone},${0.03 + Math.random() * 0.05})`);
    g.addColorStop(1, `rgba(${tone},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  speckle(ctx, w, h, Math.floor(w * h / 260), 0.13);
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
  v.addColorStop(0, 'rgba(90,55,20,0)');
  v.addColorStop(1, 'rgba(90,55,20,0.38)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

function wrapLines(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = word; }
      else line = test;
    }
    out.push(line);
  }
  return out;
}

// Escreve texto centrado e diminui a letra até caber na altura disponível.
function fitText(ctx, text, x, y, maxW, maxH, size, minSize, family, color, align = 'center') {
  let lines, lh;
  for (; size >= minSize; size -= 2) {
    ctx.font = `${family === FONT_TITLE ? '700 ' : ''}${size}px ${family}`;
    lines = wrapLines(ctx, text, maxW);
    lh = size * 1.22;
    if (lines.length * lh <= maxH) break;
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  lines.forEach((l, i) => ctx.fillText(l, x, y + size + i * lh));
  return lines.length * lh;
}

function textures(renderer) {
  const CARD_W = 1024, CARD_H = 1434;
  // No telemóvel as cartas desenham-se mais pequenas: são muitas, e a memória da placa é pouca.
  const RES_CARTA = eTelemovel() ? .85 : 1;
  // O medalhão é pequeno para a letra poder ser grande: as cartas têm de se ler sem as aproximar.
  const MEDALHAO = { y: 355, r: 170 };

  function wood() {
    const S = 2048;
    const [c, x] = canvas(S, S);
    const [b, bx] = canvas(S, S);
    const [r, rx] = canvas(1024, 1024);
    bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S);
    rx.fillStyle = 'rgb(0,120,0)'; rx.fillRect(0, 0, 1024, 1024);
    const planks = 5, ph = S / planks;
    for (let p = 0; p < planks; p++) {
      const y0p = p * ph;
      const hue = 21 + Math.random() * 7, sat = 36 + Math.random() * 9, l = 13 + Math.random() * 7;
      x.fillStyle = `hsl(${hue},${sat}%,${l}%)`;
      x.fillRect(0, y0p, S, ph);
      // Cada tábua tem o seu desgaste, e os nós dobram os veios à volta.
      rx.fillStyle = `rgb(0,${90 + Math.random() * 70},0)`; rx.fillRect(0, y0p / 2, 1024, ph / 2);
      const nos = Array.from({ length: Math.random() < .6 ? 1 : 0 }, () => ({ x: Math.random() * S, y: y0p + ph * (.25 + Math.random() * .5), r: 7 + Math.random() * 11 }));
      for (let i = 0; i < 90; i++) {
        const px = Math.random() * S, py = y0p + Math.random() * ph, w = 200 + Math.random() * 600, hh = 14 + Math.random() * 50;
        const g = x.createRadialGradient(px, py, 0, px, py, w);
        const tom = Math.random() < .5 ? '10,4,1' : '150,88,40';
        g.addColorStop(0, `rgba(${tom},${.02 + Math.random() * .05})`); g.addColorStop(1, `rgba(${tom},0)`);
        x.save(); x.beginPath(); x.rect(0, y0p, S, ph); x.clip();
        x.translate(px, py); x.scale(1, hh / w); x.translate(-px, -py);
        x.fillStyle = g; x.beginPath(); x.arc(px, py, w, 0, 7); x.fill(); x.restore();
      }
      x.save(); x.beginPath(); x.rect(0, y0p, S, ph); x.clip();
      bx.save(); bx.beginPath(); bx.rect(0, y0p, S, ph); bx.clip();
      for (let i = 0; i < 460; i++) {
        const y0 = y0p + Math.random() * ph;
        const amp = 2 + Math.random() * 12, freq = 0.002 + Math.random() * 0.004, phase = Math.random() * 9;
        const dark = Math.random() < 0.68;
        x.strokeStyle = dark ? `rgba(14,6,2,${0.06 + Math.random() * 0.24})` : `rgba(196,130,74,${0.02 + Math.random() * 0.08})`;
        x.lineWidth = bx.lineWidth = 0.5 + Math.random() * 1.9;
        bx.strokeStyle = dark ? 'rgba(30,30,30,.3)' : 'rgba(200,200,200,.12)';
        x.beginPath(); bx.beginPath();
        for (let px = 0; px <= S; px += 22) {
          let yy = y0 + Math.sin(px * freq + phase) * amp;
          for (const n of nos) {
            const dy = y0 - n.y, dx = px - n.x, sobe = Math.exp(-dx * dx / (2 * 4200));
            yy += (dy >= 0 ? 1 : -1) * sobe * n.r * 1.5 / (1 + Math.abs(dy) / 34);
          }
          if (px === 0) { x.moveTo(px, yy); bx.moveTo(px, yy); } else { x.lineTo(px, yy); bx.lineTo(px, yy); }
        }
        x.stroke(); bx.stroke();
      }
      nos.forEach(n => {
        for (let k = 6; k > 0; k--) {
          x.fillStyle = `rgba(${10 + k * 4},${5 + k * 2},2,.42)`;
          x.beginPath(); x.ellipse(n.x, n.y, n.r * k / 3.2, n.r * k / 6, 0, 0, 7); x.fill();
        }
        bx.fillStyle = 'rgba(40,40,40,.6)'; bx.beginPath(); bx.ellipse(n.x, n.y, n.r * 1.2, n.r * .6, 0, 0, 7); bx.fill();
      });
      x.restore(); bx.restore();
      // Junta entre tábuas, e um corte com pregos.
      x.fillStyle = 'rgba(0,0,0,.8)'; x.fillRect(0, y0p - 2, S, 5);
      x.fillStyle = 'rgba(255,190,120,.09)'; x.fillRect(0, y0p + 3, S, 2);
      bx.fillStyle = '#080808'; bx.fillRect(0, y0p - 3, S, 7);
      const corte = Math.random() * S;
      x.fillStyle = 'rgba(0,0,0,.72)'; x.fillRect(corte, y0p, 4, ph);
      bx.fillStyle = '#101010'; bx.fillRect(corte - 1, y0p, 6, ph);
      [[-26, .2], [-26, .8], [30, .2], [30, .8]].forEach(([dx, f]) => {
        const nx = corte + dx, ny = y0p + ph * f;
        x.fillStyle = '#0c0705'; x.beginPath(); x.arc(nx, ny, 8, 0, 7); x.fill();
        x.fillStyle = 'rgba(190,170,140,.35)'; x.beginPath(); x.arc(nx - 2, ny - 2, 3, 0, 7); x.fill();
        bx.fillStyle = '#e8e8e8'; bx.beginPath(); bx.arc(nx, ny, 7, 0, 7); bx.fill();
      });
    }
    // A vida da mesa: riscos, nódoas de copos, cera e tinta.
    for (let i = 0; i < 70; i++) {
      const px = Math.random() * S, py = Math.random() * S, a = Math.random() * 6.28, l = 40 + Math.random() * 260;
      x.strokeStyle = `rgba(210,160,110,${.04 + Math.random() * .1})`; x.lineWidth = .8 + Math.random();
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
      bx.strokeStyle = 'rgba(20,20,20,.55)'; bx.lineWidth = 1.2;
      bx.beginPath(); bx.moveTo(px, py); bx.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); bx.stroke();
      rx.strokeStyle = 'rgba(0,210,0,.5)'; rx.lineWidth = 1;
      rx.beginPath(); rx.moveTo(px / 2, py / 2); rx.lineTo((px + Math.cos(a) * l) / 2, (py + Math.sin(a) * l) / 2); rx.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const px = Math.random() * S, py = Math.random() * S, rr = 58 + Math.random() * 36;
      x.strokeStyle = `rgba(8,3,1,${.16 + Math.random() * .16})`; x.lineWidth = 3 + Math.random() * 4;
      x.beginPath(); x.arc(px, py, rr, Math.random() * 3, Math.random() * 3 + 4.4); x.stroke();
      rx.strokeStyle = 'rgba(0,200,0,.45)'; rx.lineWidth = 3;
      rx.beginPath(); rx.arc(px / 2, py / 2, rr / 2, 0, 7); rx.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const px = Math.random() * S, py = Math.random() * S, rr = 4 + Math.random() * 16;
      x.fillStyle = Math.random() < .4 ? 'rgba(4,4,10,.55)' : 'rgba(216,196,150,.32)';
      x.beginPath(); x.ellipse(px, py, rr, rr * (.6 + Math.random() * .5), Math.random() * 3, 0, 7); x.fill();
      bx.fillStyle = 'rgba(225,225,225,.45)'; bx.beginPath(); bx.arc(px, py, rr * .8, 0, 7); bx.fill();
    }
    const [m, mx] = canvas(1024, 1024);
    mx.drawImage(b, 0, 0, 1024, 1024);
    const map = toTexture(c, renderer);
    const normal = normaisDe(m, renderer, 1.5);
    const rough = toTexture(r, renderer, { linear: true });
    [map, normal, rough].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2.2); });
    return { map, normal, rough };
  }

  // Grão do couro, partilhado por tudo o que é coberto a couro.
  let graoCouro = null;
  function relevoCouro() {
    if (graoCouro) return graoCouro;
    const [c, x] = canvas(512, 512);
    x.fillStyle = '#808080'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5200; i++) {
      const px = Math.random() * 512, py = Math.random() * 512, r = 1.6 + Math.random() * 3.6, v = Math.random() < .55 ? 170 : 90;
      x.fillStyle = `rgba(${v},${v},${v},.34)`;
      x.beginPath(); x.ellipse(px, py, r, r * (.6 + Math.random() * .5), Math.random() * 3, 0, 7); x.fill();
    }
    graoCouro = normaisDe(c, renderer, 1.5);
    graoCouro.wrapS = graoCouro.wrapT = THREE.RepeatWrapping;
    return graoCouro;
  }

  function leather(hex) {
    const [c, x] = canvas(512, 512);
    x.fillStyle = hex; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 46; i++) {
      const px = Math.random() * 512, py = Math.random() * 512, r = 40 + Math.random() * 120;
      const g = x.createRadialGradient(px, py, 0, px, py, r), tom = Math.random() < .6 ? '0,0,0' : '255,210,170';
      g.addColorStop(0, `rgba(${tom},${.03 + Math.random() * .08})`); g.addColorStop(1, `rgba(${tom},0)`);
      x.fillStyle = g; x.fillRect(0, 0, 512, 512);
    }
    speckle(x, 512, 512, 9000, 0.26);
    speckle(x, 512, 512, 3000, 0.05, false);
    const t = toTexture(c, renderer);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  // Relevo do pergaminho do mapa: fibras e as dobras de quem o guardou no bolso.
  function relevoMapa() {
    const [c, x] = canvas(1400, 1000);
    x.fillStyle = '#808080'; x.fillRect(0, 0, 1400, 1000);
    for (let i = 0; i < 9000; i++) {
      const v = Math.random() < .5 ? 165 : 95, a = Math.random() * 6.28, l = 3 + Math.random() * 12;
      const px = Math.random() * 1400, py = Math.random() * 1000;
      x.strokeStyle = `rgba(${v},${v},${v},.22)`; x.lineWidth = 1;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    const dobra = (x0, y0, x1, y1) => {
      x.strokeStyle = 'rgba(40,40,40,.75)'; x.lineWidth = 3;
      x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
      x.strokeStyle = 'rgba(190,190,190,.5)'; x.lineWidth = 5;
      x.beginPath(); x.moveTo(x0 + 4, y0 + 4); x.lineTo(x1 + 4, y1 + 4); x.stroke();
    };
    [350, 700, 1050].forEach(a => dobra(a + (Math.random() - .5) * 8, 0, a + (Math.random() - .5) * 8, 1000));
    [333, 666].forEach(a => dobra(0, a + (Math.random() - .5) * 8, 1400, a + (Math.random() - .5) * 8));
    return normaisDe(c, renderer, 2.2);
  }

  // Superfície das cartas: onde há folha de ouro a luz reflete, e o papel fica mate.
  // No tarô não há medalhão, por isso também não há anel de ouro.
  const cartaBase = {};
  function superficieCarta(semAnel = false) {
    if (cartaBase[semAnel]) return cartaBase[semAnel];
    const W = 512, H = 717, k = 512 / CARD_W;
    const [a, ax] = canvas(W, H);
    const [o, ox] = canvas(W, H);
    ax.fillStyle = '#808080'; ax.fillRect(0, 0, W, H);
    for (let i = 0; i < 3800; i++) {
      const v = Math.random() < .5 ? 150 : 106;
      ax.fillStyle = `rgba(${v},${v},${v},.5)`;
      ax.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1 + Math.random());
    }
    ox.fillStyle = 'rgb(0,240,0)'; ox.fillRect(0, 0, W, H);
    const traco = (ctx, cor, l, f) => { ctx.strokeStyle = cor; ctx.lineWidth = l * k; f(ctx); };
    const moldura = ctx => { ctx.strokeRect(50 * k, 50 * k, (CARD_W - 100) * k, (CARD_H - 100) * k); };
    const anel = ctx => { ctx.beginPath(); ctx.arc(CARD_W / 2 * k, MEDALHAO.y * k, MEDALHAO.r * k, 0, 7); ctx.stroke(); };
    traco(ax, '#f0f0f0', 12, moldura);
    traco(ox, 'rgb(0,115,255)', 9, moldura);
    if (!semAnel) { traco(ax, '#f0f0f0', 22, anel); traco(ox, 'rgb(0,115,255)', 18, anel); }
    cartaBase[semAnel] = { normal: normaisDe(a, renderer, 1.8), brilho: toTexture(o, renderer, { linear: true }) };
    return cartaBase[semAnel];
  }

  function cardBack(band = '#3a1414') {
    const [c, x] = canvas(CARD_W, CARD_H);
    const fundo = x.createRadialGradient(CARD_W / 2, CARD_H / 2, 80, CARD_W / 2, CARD_H / 2, CARD_H * .7);
    fundo.addColorStop(0, '#6a2019'); fundo.addColorStop(.55, band); fundo.addColorStop(1, '#180806');
    x.fillStyle = fundo; x.fillRect(0, 0, CARD_W, CARD_H);
    speckle(x, CARD_W, CARD_H, 22000, 0.2);
    // losangos do padrão, com um ponto de ouro em cada cruzamento
    x.save();
    x.beginPath(); x.rect(70, 70, CARD_W - 140, CARD_H - 140); x.clip();
    x.lineWidth = 2; x.strokeStyle = 'rgba(216,180,94,.3)';
    const passo = 92;
    for (let i = -16; i < 26; i++) {
      x.beginPath(); x.moveTo(0, i * passo); x.lineTo(CARD_W, i * passo + CARD_W); x.stroke();
      x.beginPath(); x.moveTo(CARD_W, i * passo); x.lineTo(0, i * passo + CARD_W); x.stroke();
    }
    x.fillStyle = 'rgba(232,196,110,.5)';
    for (let i = 0; i < 12; i++) for (let j = 0; j < 17; j++) losango(x, (i + (j % 2) * .5) * passo, j * passo / 2 + 2, 7);
    x.restore();
    x.lineWidth = 12; x.strokeStyle = ouroEm(x, 0, 0, CARD_W, CARD_H); x.strokeRect(46, 46, CARD_W - 92, CARD_H - 92);
    x.lineWidth = 3; x.strokeRect(70, 70, CARD_W - 140, CARD_H - 140);
    [[70, 70], [CARD_W - 70, 70], [70, CARD_H - 70], [CARD_W - 70, CARD_H - 70]].forEach(([a, b]) => {
      x.fillStyle = ouroEm(x, a - 30, b - 30, a + 30, b + 30); losango(x, a, b, 30);
      x.fillStyle = band; losango(x, a, b, 13);
    });
    const halo = x.createRadialGradient(CARD_W / 2, CARD_H / 2, 0, CARD_W / 2, CARD_H / 2, 262);
    halo.addColorStop(0, '#5a1a15'); halo.addColorStop(1, '#260c09');
    x.fillStyle = halo;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 262, 0, 7); x.fill();
    x.strokeStyle = ouroEm(x, CARD_W / 2 - 260, CARD_H / 2 - 260, CARD_W / 2 + 260, CARD_H / 2 + 260); x.lineWidth = 12;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 256, 0, 7); x.stroke();
    x.lineWidth = 3;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 228, 0, 7); x.stroke();
    drawGlyphRico(x, 'eye', CARD_W / 2, CARD_H / 2 - 30, 230, '#b98a3a', '#ffeeb0');
    x.fillStyle = ouroEm(x, CARD_W / 2 - 200, 0, CARD_W / 2 + 200, 0); x.textAlign = 'center';
    x.font = `600 44px ${FONT_TITLE}`;
    x.fillText('CARDOMANCER', CARD_W / 2, CARD_H / 2 + 150);
    return toTexture(c, renderer);
  }

  // O papel das cartas desenha-se uma vez, e cada carta vira-o à sua maneira.
  let papelCarta = null;
  function pintaPapelCarta(x) {
    if (!papelCarta) {
      const [p, px] = canvas(CARD_W, CARD_H);
      paintParchment(px, CARD_W, CARD_H);
      papelCarta = p;
    }
    x.save();
    if (Math.random() < .5) { x.translate(CARD_W, 0); x.scale(-1, 1); }
    if (Math.random() < .5) { x.translate(0, CARD_H); x.scale(1, -1); }
    x.drawImage(papelCarta, 0, 0);
    x.restore();
  }

  // spec: { tema, titulo, desc, glyph, rodape, rodapeGlyph, locked, lockText }
  function cardFace(spec) {
    const [c, x] = canvas(Math.round(CARD_W * RES_CARTA), Math.round(CARD_H * RES_CARTA));
    x.scale(RES_CARTA, RES_CARTA);
    const th = CARD_THEMES[spec.tema] || CARD_THEMES.escolha;
    pintaPapelCarta(x);
    const ouro = ouroEm(x, 0, 0, CARD_W, CARD_H);

    // A máscara da tendência: enorme e inclinada, como se a carta fosse uma janela e ela estivesse do outro lado.
    // A moldura, a faixa e o medalhão pintam-se por cima. A inclinação sai do título, para cada carta ter a sua.
    if (spec.mascara && !spec.tarot) {
      const semente = [...(spec.titulo || '')].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 9973, 7);
      const lado = semente % 2 ? 1 : -1, giro = lado * (.28 + (semente % 17) / 17 * .22);
      x.save();
      x.beginPath(); x.rect(60, 60, CARD_W - 120, CARD_H - 120); x.clip();
      x.translate(CARD_W * (.5 + lado * .1), CARD_H * .55);
      x.rotate(giro);
      desenharMascara(x, spec.mascara, 0, 0, 1050);
      x.restore();
    }

    // moldura: uma faixa da cor do tipo, um filete de ouro e cantos trabalhados
    const bandaCor = x.createLinearGradient(0, 0, 0, CARD_H);
    bandaCor.addColorStop(0, th.band); bandaCor.addColorStop(.5, th.band); bandaCor.addColorStop(1, 'rgba(20,10,5,.92)');
    x.strokeStyle = th.band; x.lineWidth = 34; x.strokeRect(17, 17, CARD_W - 34, CARD_H - 34);
    x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 3; x.strokeRect(34, 34, CARD_W - 68, CARD_H - 68);
    x.strokeStyle = ouro; x.lineWidth = 7; x.strokeRect(50, 50, CARD_W - 100, CARD_H - 100);
    x.strokeStyle = 'rgba(60,35,12,.4)'; x.lineWidth = 2; x.strokeRect(60, 60, CARD_W - 120, CARD_H - 120);
    [[50, 50], [CARD_W - 50, 50], [50, CARD_H - 50], [CARD_W - 50, CARD_H - 50]].forEach(([a, b]) => {
      x.fillStyle = ouro; losango(x, a, b, 24);
      x.fillStyle = th.band; losango(x, a, b, 12);
    });

    // faixa do tipo
    const pista = spec.tema === 'pista', alturaFaixa = pista ? 124 : 104;
    const faixa = x.createLinearGradient(0, 50, 0, 50 + alturaFaixa);
    faixa.addColorStop(0, th.band); faixa.addColorStop(1, 'rgba(10,5,2,.5)');
    x.fillStyle = th.band; x.fillRect(53, 53, CARD_W - 106, alturaFaixa);
    x.fillStyle = faixa; x.fillRect(53, 53, CARD_W - 106, alturaFaixa);
    x.fillStyle = ouro; x.fillRect(53, 53 + alturaFaixa, CARD_W - 106, 6);
    x.textAlign = 'center';
    const label = (spec.etiqueta || th.label).toUpperCase();
    let tamanhoFaixa = pista ? 92 : 64;
    do { x.font = `${pista ? 700 : 600} ${tamanhoFaixa}px ${FONT_TITLE}`; tamanhoFaixa -= 2; } while (x.measureText(label).width > CARD_W - 170 && tamanhoFaixa > 34);
    const yFaixa = pista ? 145 : 127;
    x.fillStyle = th.texto ? 'rgba(255,245,200,.5)' : 'rgba(0,0,0,.5)'; x.fillText(label, CARD_W / 2, yFaixa + 3);
    x.fillStyle = th.texto || '#fbeec8'; x.fillText(label, CARD_W / 2, yFaixa);

    // medalhão com o símbolo
    const cx0 = CARD_W / 2, my = MEDALHAO.y, mr = MEDALHAO.r;
    if (spec.tarot) desenharArcano(x, spec.tarot, 92, 176, CARD_W - 184, 700, ouro);
    else {
    x.save();
    x.shadowColor = 'rgba(40,20,5,.55)'; x.shadowBlur = 26; x.shadowOffsetY = 8;
    x.fillStyle = th.band; x.beginPath(); x.arc(cx0, my, mr, 0, 7); x.fill();
    x.restore();
    x.save();
    x.beginPath(); x.arc(cx0, my, mr - 34, 0, 7); x.clip();
    const disco = x.createRadialGradient(cx0, my - 40, 20, cx0, my, mr);
    disco.addColorStop(0, '#fff6dc'); disco.addColorStop(.62, '#ecd8a6'); disco.addColorStop(1, '#b58f55');
    x.fillStyle = disco; x.fillRect(cx0 - mr, my - mr, mr * 2, mr * 2);
    // raios que saem do símbolo, como numa gravura
    x.translate(cx0, my);
    x.fillStyle = th.band; x.globalAlpha = .13;
    for (let i = 0; i < 28; i++) {
      x.rotate(Math.PI * 2 / 28);
      x.beginPath(); x.moveTo(0, 0); x.lineTo(-22, -mr); x.lineTo(22, -mr); x.closePath(); x.fill();
    }
    x.restore();
    // coroa de marcas douradas
    x.save();
    x.translate(cx0, my);
    x.fillStyle = '#f4d986';
    for (let i = 0; i < 48; i++) {
      x.rotate(Math.PI / 24);
      x.fillRect(-(i % 2 ? 1.5 : 3), -(mr - 7), i % 2 ? 3 : 6, i % 2 ? 12 : 22);
    }
    x.restore();
    x.strokeStyle = ouroEm(x, cx0 - mr, my - mr, cx0 + mr, my + mr);
    x.lineWidth = 14; x.beginPath(); x.arc(cx0, my, mr - 2, 0, 7); x.stroke();
    x.lineWidth = 6; x.beginPath(); x.arc(cx0, my, mr - 34, 0, 7); x.stroke();
    drawGlyphRico(x, spec.glyph, cx0, my, 185, th.tinta || th.band, '#d9b878');
    }

    // O olho vermelho: esta carta rende um fragmento de pista.
    if (spec.fragmento) {
      x.save();
      x.shadowColor = 'rgba(40,10,5,.7)'; x.shadowBlur = 18;
      x.fillStyle = '#8f1610'; x.beginPath(); x.arc(cx0 + 252, my - 92, 80, 0, 7); x.fill();
      x.restore();
      x.strokeStyle = ouro; x.lineWidth = 9; x.beginPath(); x.arc(cx0 + 252, my - 92, 80, 0, 7); x.stroke();
      drawGlyph(x, 'eye', cx0 + 252, my - 92, 108, '#ffe3a0');
    }

    // A hipótese de acertar: um selo à esquerda do medalhão, e o papel a puxar para a mesma cor.
    // Vermelho é difícil, âmbar é meio por meio, verde é quase certo.
    if (spec.hipotese != null) {
      const h = Math.max(0, Math.min(1, (spec.hipotese - .25) / .6)) * 120;
      const cor = `hsl(${h}, 62%, 34%)`;
      const banho = x.createRadialGradient(CARD_W / 2, CARD_H * .55, 120, CARD_W / 2, CARD_H * .55, CARD_W);
      banho.addColorStop(0, `hsla(${h}, 70%, 45%, 0)`); banho.addColorStop(1, `hsla(${h}, 70%, 40%, .2)`);
      x.fillStyle = banho; x.fillRect(53, 53, CARD_W - 106, CARD_H - 106);
      const sx = cx0 - 252, sy = my - 92;
      x.save();
      x.shadowColor = 'rgba(40,10,5,.6)'; x.shadowBlur = 18;
      x.fillStyle = cor; x.beginPath(); x.arc(sx, sy, 80, 0, 7); x.fill();
      x.restore();
      x.strokeStyle = ouro; x.lineWidth = 9; x.beginPath(); x.arc(sx, sy, 80, 0, 7); x.stroke();
      x.textAlign = 'center'; x.fillStyle = '#fff3d0'; x.font = `700 60px ${FONT_TITLE}`;
      x.fillText(`${Math.round(spec.hipotese * 100)}%`, sx, sy + 21);
    }

    // título
    x.save();
    x.shadowColor = 'rgba(255,245,215,.85)'; x.shadowBlur = 0; x.shadowOffsetY = 2;
    // No tarô, a gravura ocupa mais da carta, e o texto fica por baixo.
    const yTitulo = spec.tarot ? 882 : 535, yFilete = spec.tarot ? 980 : 668;
    fitText(x, spec.titulo, CARD_W / 2, yTitulo, CARD_W - 150, spec.tarot ? 92 : 128, spec.tarot ? 76 : 86, 48, FONT_TITLE, '#2a1a0d');
    x.restore();
    const filete = x.createLinearGradient(150, 0, CARD_W - 150, 0);
    filete.addColorStop(0, 'rgba(150,110,40,0)'); filete.addColorStop(.25, '#a87c2a'); filete.addColorStop(.5, '#f4d986'); filete.addColorStop(.75, '#a87c2a'); filete.addColorStop(1, 'rgba(150,110,40,0)');
    x.fillStyle = filete; x.fillRect(150, yFilete, CARD_W - 300, 4);
    x.fillStyle = ouro; losango(x, CARD_W / 2, yFilete + 2, 15);
    x.fillStyle = th.band; losango(x, CARD_W / 2, yFilete + 2, 7);

    // brilho dourado das cartas raras
    if (spec.tema === 'rara' || spec.tema === 'pista') {
      x.save();
      const estrelas = spec.tarot ? 0 : 40;
      x.strokeStyle = ouroEm(x, 0, CARD_H, CARD_W, 0); x.lineWidth = 12; x.strokeRect(24, 24, CARD_W - 48, CARD_H - 48);
      for (let i = 0; i < estrelas; i++) {
        const a = Math.random() * 6.28, d = mr + 18 + Math.random() * 110;
        drawGlyph(x, 'star', cx0 + Math.cos(a) * d, my + Math.sin(a) * d * .55, 10 + Math.random() * 18, 'rgba(216,160,50,.7)');
      }
      const foil = x.createLinearGradient(0, 0, CARD_W, CARD_H);
      foil.addColorStop(0, 'rgba(255,225,130,.2)');
      foil.addColorStop(.5, 'rgba(255,255,255,0)');
      foil.addColorStop(1, 'rgba(255,205,90,.24)');
      x.fillStyle = foil; x.fillRect(0, 0, CARD_W, CARD_H);
      x.restore();
    }

    // descrição
    if (spec.tarot) fitText(x, spec.desc || '', CARD_W / 2, 994, CARD_W - 150, spec.rodape ? 250 : 350, 72, 44, FONT_BODY, '#33230f');
    else fitText(x, spec.desc || '', CARD_W / 2, 684, CARD_W - 170, spec.ganho && spec.perde ? 430 : spec.ganho || spec.perde ? 500 : spec.rodape ? 560 : 660, 96, 56, FONT_BODY, '#33230f');

    // o que a escolha rende, e por baixo o que custa falhar: sempre nesta ordem
    const linha = (t, y, cor) => {
      x.textAlign = 'center'; x.fillStyle = cor;
      let tam = 60;
      do { tam -= 2; x.font = `italic ${tam}px ${FONT_BODY}`; } while (tam > 38 && textoIcones(x, t, tam, {}) > CARD_W - 170);
      textoIcones(x, t, tam, { coin: '#b8861f', star: '#2f6a9a', heart: '#b3261e' }, CARD_W / 2, y);
    };
    if (spec.ganho) linha(spec.ganho, CARD_H - (spec.perde ? 262 : 192), '#2f4a1c');
    if (spec.perde) linha(spec.perde, CARD_H - 192, '#7a1f12');

    // rodapé
    if (spec.rodape) {
      const pe = x.createLinearGradient(0, CARD_H - 170, 0, CARD_H - 50);
      pe.addColorStop(0, 'rgba(10,5,2,.45)'); pe.addColorStop(.5, 'rgba(10,5,2,0)');
      x.fillStyle = th.band; x.fillRect(53, CARD_H - 170, CARD_W - 106, 117);
      x.fillStyle = pe; x.fillRect(53, CARD_H - 170, CARD_W - 106, 117);
      x.fillStyle = ouro; x.fillRect(53, CARD_H - 176, CARD_W - 106, 6);
      if (spec.rodapeGlyph) drawGlyph(x, spec.rodapeGlyph, 118, CARD_H - 110, 80, th.texto || '#f6dc8c');
      fitText(x, spec.rodape, CARD_W / 2 + (spec.rodapeGlyph ? 36 : 0), CARD_H - 156, CARD_W - 226, 104, 66, 38, FONT_TITLE, th.texto || '#f2e3bd');
    }

    // carta bloqueada: escurece e carimba o símbolo de quem a pode usar
    if (spec.locked) {
      x.fillStyle = 'rgba(16,10,6,.68)';
      x.fillRect(0, 0, CARD_W, CARD_H);
      drawGlyph(x, 'lock', CARD_W / 2, MEDALHAO.y - 75, 150, 'rgba(240,215,160,.95)');
      fitText(x, spec.lockText || 'Bloqueada', CARD_W / 2, MEDALHAO.y, CARD_W - 180, 170, 72, 40, FONT_TITLE, '#f0d7a0');
    }
    return toTexture(c, renderer);
  }

  // Desenhos a tinta para as páginas do livro, conforme o terreno.
  function inkScene(x, kind, cx, cy, w, h) {
    x.save();
    x.translate(cx - w / 2, cy - h / 2);
    x.strokeStyle = '#3a2412'; x.fillStyle = '#3a2412'; x.lineWidth = 3; x.lineCap = 'round';
    const ground = h * 0.78;
    const line = (a, b, c, d) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
    const tree = (tx, ty, s) => {
      x.beginPath(); x.moveTo(tx, ty - s); x.lineTo(tx - s * 0.36, ty - s * 0.35); x.lineTo(tx + s * 0.36, ty - s * 0.35); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(tx, ty - s * 0.7); x.lineTo(tx - s * 0.46, ty - s * 0.06); x.lineTo(tx + s * 0.46, ty - s * 0.06); x.closePath(); x.fill();
      line(tx, ty - s * 0.06, tx, ty);
    };
    const peak = (px, py, s) => {
      x.fillStyle = '#e8d8b0';
      x.beginPath(); x.moveTo(px - s, py); x.lineTo(px, py - s * 1.3); x.lineTo(px + s, py); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = '#3a2412';
      for (let i = 0; i < s / 7; i++) line(px + i * 7, py - s * 1.3 + i * 9.2, px + i * 4, py - 2);
    };
    const hatch = (y0, n) => { for (let i = 0; i < n; i++) { const a = Math.random() * w; line(a, y0 + Math.random() * 6, a + 24 + Math.random() * 80, y0 + Math.random() * 6); } };

    if (kind === 'floresta') {
      x.save(); x.globalAlpha = .4;
      for (let i = 0; i < 26; i++) tree(w * (i + 0.5) / 26 + (Math.random() - .5) * 16, ground - 48 + Math.random() * 12, 50 + Math.random() * 54);
      x.restore();
      for (let i = 0; i < 18; i++) tree(w * (i + 0.5) / 18 + (Math.random() - .5) * 20, ground - 18 + Math.random() * 26, 80 + Math.random() * 110);
      hatch(ground + 14, 14);
    } else if (kind === 'montanha') {
      peak(w * .24, ground, 118); peak(w * .74, ground, 134); peak(w * .5, ground, 176);
      hatch(ground + 10, 12);
    } else if (kind === 'pantano') {
      for (let i = 0; i < 12; i++) { const a = Math.random() * w, b = ground - 6; line(a, b, a + (Math.random() - .5) * 20, b - 40 - Math.random() * 70); }
      for (let i = 0; i < 6; i++) { const a = 60 + i * (w - 120) / 5, b = ground - 60 - Math.random() * 90; x.beginPath(); x.arc(a, b, 5, 0, 7); x.fill(); x.save(); x.globalAlpha = .18; x.beginPath(); x.arc(a, b, 18, 0, 7); x.fill(); x.restore(); }
      for (let i = 0; i < 26; i++) hatch(ground + 4 + i * 2.4, 1);
    } else if (kind === 'ruina') {
      const arch = (ax, s) => {
        x.fillRect(ax - s * .34, ground - s * .95, s * .12, s * .95);
        x.fillRect(ax + s * .22, ground - s * .95, s * .12, s * .95);
        x.lineWidth = s * .11; x.beginPath(); x.arc(ax, ground - s * .95, s * .28, Math.PI, 0); x.stroke(); x.lineWidth = 3;
      };
      arch(w * .28, 210); arch(w * .5, 280); arch(w * .75, 180);
      x.fillRect(w * .88, ground - 74, 16, 74); x.fillRect(w * .1, ground - 44, 18, 44);
      hatch(ground + 8, 16);
    } else if (kind === 'costa') {
      x.beginPath(); x.moveTo(0, ground - 30); x.lineTo(w * .3, ground - 60); x.lineTo(w * .46, ground); x.stroke();
      for (let r = 0; r < 7; r++) {
        x.beginPath();
        for (let px = 0; px <= w; px += 8) { const yy = ground + r * 13 + Math.sin(px * .045 + r) * 4; if (px === 0) x.moveTo(px, yy); else x.lineTo(px, yy); }
        x.stroke();
      }
      x.fillRect(w * .72, ground - 150, 44, 150);
      x.fillRect(w * .70, ground - 170, 12, 22); x.fillRect(w * .735, ground - 170, 12, 22); x.fillRect(w * .77, ground - 170, 12, 22);
    } else if (kind === 'cidade') {
      let px = 20;
      while (px < w - 40) {
        const bw = 40 + Math.random() * 44, bh = 70 + Math.random() * 110;
        x.fillStyle = '#e8d8b0'; x.fillRect(px, ground - bh, bw, bh); x.strokeRect(px, ground - bh, bw, bh);
        x.fillStyle = ['#7c2f20', '#8f4a28', '#5e3a2a'][Math.floor(Math.random() * 3)];
        x.beginPath(); x.moveTo(px - 5, ground - bh); x.lineTo(px + bw / 2, ground - bh - bw * .55); x.lineTo(px + bw + 5, ground - bh); x.closePath(); x.fill(); x.stroke();
        x.fillStyle = '#e8a93c';
        x.fillRect(px + bw * .4, ground - bh * .5, bw * .18, bh * .2);
        x.fillStyle = '#3a2412';
        px += bw + 4;
      }
      hatch(ground + 8, 12);
    } else { // estrada
      x.beginPath(); x.moveTo(w * .1, ground + 40); x.quadraticCurveTo(w * .45, ground - 16, w * .5, ground - 60); x.stroke();
      x.beginPath(); x.moveTo(w * .9, ground + 40); x.quadraticCurveTo(w * .55, ground - 16, w * .5, ground - 60); x.stroke();
      x.beginPath(); x.moveTo(0, ground - 60); x.quadraticCurveTo(w * .3, ground - 110, w * .5, ground - 62); x.quadraticCurveTo(w * .7, ground - 120, w, ground - 70); x.stroke();
      tree(w * .14, ground - 44, 110); tree(w * .82, ground - 50, 130); tree(w * .9, ground - 40, 90);
      x.fillRect(w * .62, ground - 90, 7, 66); x.fillRect(w * .62 - 24, ground - 86, 54, 13);
    }
    x.restore();
  }

  // Aguarela por baixo do desenho a tinta: céu, luz e montes ao longe, conforme o terreno.
  const AGUADAS = {
    floresta: { ceu: ['#c9d8a8', '#efe4b4'], chao: '#5f7a42', monte: 'rgba(78,110,70,.5)', astro: 'rgba(255,240,180,.85)' },
    montanha: { ceu: ['#9fb4c0', '#e6e0cc'], chao: '#8d8468', monte: 'rgba(96,112,130,.5)', astro: 'rgba(255,250,225,.9)' },
    pantano: { ceu: ['#8c9672', '#c6c294'], chao: '#4c5c3e', monte: 'rgba(60,74,54,.55)', astro: 'rgba(235,235,170,.7)' },
    ruina: { ceu: ['#c98d7c', '#efd2a2'], chao: '#94795a', monte: 'rgba(112,72,76,.42)', astro: 'rgba(255,214,150,.95)' },
    costa: { ceu: ['#97bcc4', '#ecdfbd'], chao: '#5f8c98', monte: 'rgba(84,122,134,.45)', astro: 'rgba(255,240,195,.9)' },
    cidade: { ceu: ['#e0b27c', '#f4e2b6'], chao: '#a08a62', monte: 'rgba(146,104,70,.38)', astro: 'rgba(255,226,160,.95)' },
    estrada: { ceu: ['#b9c6ae', '#f2e6bc'], chao: '#a89562', monte: 'rgba(110,126,90,.42)', astro: 'rgba(255,240,180,.9)' },
  };
  function aguarela(x, kind, rx, ry, rw, rh) {
    const a = AGUADAS[kind] || AGUADAS.estrada, solo = ry + rh * .72;
    const ceu = x.createLinearGradient(0, ry, 0, solo);
    ceu.addColorStop(0, a.ceu[0]); ceu.addColorStop(1, a.ceu[1]);
    x.fillStyle = ceu; x.fillRect(rx, ry, rw, rh);
    const sx = rx + rw * (.2 + Math.random() * .6), sy = ry + rh * .24;
    const astro = x.createRadialGradient(sx, sy, 6, sx, sy, 190);
    astro.addColorStop(0, a.astro); astro.addColorStop(.18, a.astro); astro.addColorStop(.22, 'rgba(255,240,190,.3)'); astro.addColorStop(1, 'rgba(255,240,190,0)');
    x.fillStyle = astro; x.fillRect(rx, ry, rw, rh);
    x.fillStyle = 'rgba(255,250,235,.28)';
    for (let i = 0; i < 5; i++) { x.beginPath(); x.ellipse(rx + Math.random() * rw, ry + rh * (.08 + Math.random() * .28), 60 + Math.random() * 110, 8 + Math.random() * 14, 0, 0, 7); x.fill(); }
    [[.5, 38], [.6, 26]].forEach(([f, amp]) => {
      x.fillStyle = a.monte;
      x.beginPath(); x.moveTo(rx, solo);
      const fase = Math.random() * 6;
      for (let px = 0; px <= rw; px += 14) x.lineTo(rx + px, ry + rh * f + Math.sin(px * .012 + fase) * amp + Math.sin(px * .04 + fase) * amp * .35);
      x.lineTo(rx + rw, solo); x.closePath(); x.fill();
    });
    const chao = x.createLinearGradient(0, solo - 20, 0, ry + rh);
    chao.addColorStop(0, a.chao); chao.addColorStop(1, 'rgba(50,34,18,.85)');
    x.fillStyle = chao; x.fillRect(rx, solo - 6, rw, ry + rh - solo + 6);
  }

  const PAGE_W = 1024, PAGE_H = 1300;

  // Página esquerda: capítulo, título e desenho.
  function leftPage(p) {
    const [c, x] = canvas(PAGE_W, PAGE_H);
    paintParchment(x, PAGE_W, PAGE_H, '#e9dbb8');
    gutter(x, PAGE_W, PAGE_H, 'right');
    x.textAlign = 'center';
    x.fillStyle = '#6d1f1a';
    x.font = `600 46px ${FONT_TITLE}`;
    x.fillText((p.capitulo || '').toUpperCase(), PAGE_W / 2 - 20, 130);
    fitText(x, p.titulo || '', PAGE_W / 2 - 20, 160, PAGE_W - 200, 240, 80, 48, FONT_TITLE, '#2a1a0d');
    const risco = x.createLinearGradient(190, 0, PAGE_W - 230, 0);
    risco.addColorStop(0, 'rgba(109,31,26,0)'); risco.addColorStop(.5, '#6d1f1a'); risco.addColorStop(1, 'rgba(109,31,26,0)');
    x.fillStyle = risco; x.fillRect(190, 409, PAGE_W - 420, 3);
    x.fillStyle = '#6d1f1a'; losango(x, PAGE_W / 2 - 20, 410, 11);
    if (p.arte) {
      x.save();
      x.beginPath(); x.rect(112, 474, PAGE_W - 264, 600); x.clip();
      aguarela(x, p.arte, 112, 474, PAGE_W - 264, 600);
      inkScene(x, p.arte, PAGE_W / 2 - 20, 750, PAGE_W - 230, 560);
      const sombra = x.createRadialGradient(PAGE_W / 2 - 20, 774, 210, PAGE_W / 2 - 20, 774, 520);
      sombra.addColorStop(0, 'rgba(50,28,8,0)'); sombra.addColorStop(1, 'rgba(50,28,8,.42)');
      x.fillStyle = sombra; x.fillRect(112, 474, PAGE_W - 264, 600);
      speckle(x, PAGE_W, PAGE_H, 4000, .12);
      x.restore();
    }
    x.strokeStyle = ouroEm(x, 102, 464, PAGE_W - 142, 1084); x.lineWidth = 7;
    x.strokeRect(104, 466, PAGE_W - 248, 616);
    x.strokeStyle = '#3a2412'; x.lineWidth = 1.5; x.strokeRect(113, 475, PAGE_W - 266, 598);
    [[104, 466], [PAGE_W - 144, 466], [104, 1082], [PAGE_W - 144, 1082]].forEach(([a, b]) => {
      x.fillStyle = ouroEm(x, a - 20, b - 20, a + 20, b + 20); losango(x, a, b, 19);
      x.fillStyle = '#6d1f1a'; losango(x, a, b, 9);
    });
    return toTexture(c, renderer);
  }

  // Página direita: narração e, depois de uma escolha, o resultado.
  function rightPage(p) {
    const [c, x] = canvas(PAGE_W, PAGE_H);
    paintParchment(x, PAGE_W, PAGE_H, '#e9dbb8');
    gutter(x, PAGE_W, PAGE_H, 'left');
    const marginL = 120, marginR = 90, maxW = PAGE_W - marginL - marginR;
    let y = 100;

    if (p.banner) {
      x.fillStyle = p.bannerBom ? '#2f5a33' : '#7c1f1f';
      x.fillRect(marginL, y - 44, maxW, 84);
      x.fillStyle = '#f2e3bd'; x.textAlign = 'center';
      x.font = `600 44px ${FONT_TITLE}`;
      x.fillText(p.banner, marginL + maxW / 2, y + 12);
      y += 76;
    }

    // Os termos clicáveis ficam presos por espaços inseparáveis, para não partirem na linha.
    const termos = (p.termos || []).slice().sort((a, b) => b.nome.length - a.nome.length);
    let texto = p.texto || '';
    termos.forEach(t => { texto = texto.split(t.nome).join(t.nome.replace(/ /g, ' ')); });
    const presos = termos.map(t => ({ nome: t.nome.replace(/ /g, ' '), id: t.id }));

    // Escolhe o maior tamanho de letra que cabe na página.
    let size = 62, lines, lh;
    // Ganhos e perdas: fichas grandes, verdes ou vermelhas, por cima da margem de baixo.
    x.font = `700 58px ${FONT_TITLE}`;
    const fichas = (p.rodape || '').split('  ·  ').filter(Boolean).map(t => ({ t, w: textoIcones(x, t, 58, {}) + 56 }));
    const linhasFichas = [];
    fichas.forEach(f => {
      const l = linhasFichas[linhasFichas.length - 1];
      if (l && l.reduce((a, b) => a + b.w + 18, 0) + f.w <= maxW) l.push(f);
      else linhasFichas.push([f]);
    });
    const alturaFichas = linhasFichas.length * 96;
    const footerH = alturaFichas + (p.fundo ? 80 : 0);

    if (p.combate) {
      const c = p.combate;
      // c.mostra traz a largura das barras a meio da animação (o número já é o novo; a barra desliza até lá).
      const m = c.mostra || {};
      const barra = (rot, val, max, cor, yy, larg = val) => {
        x.textAlign = 'left'; x.fillStyle = '#2a1a0d';
        x.font = `600 42px ${FONT_TITLE}`;
        x.fillText(rot, marginL, yy);
        x.textAlign = 'right';
        x.font = `700 46px ${FONT_TITLE}`;
        x.fillText(`${val}/${max}`, marginL + maxW, yy);
        x.fillStyle = 'rgba(60,35,12,.3)'; x.fillRect(marginL, yy + 12, maxW, 26);
        x.fillStyle = cor; x.fillRect(marginL, yy + 12, maxW * Math.max(0, Math.min(max, larg)) / Math.max(1, max), 26);
      };
      barra(`PV do inimigo`, c.pv, c.pvMax, '#7c1f1f', y, m.pv ?? c.pv);
      barra('A sua Vida', c.vida, c.vidaMax, '#2f5a33', y + 96, m.vida ?? c.vida);
      x.textAlign = 'left'; x.fillStyle = '#6d1f1a';
      x.font = `italic 52px ${FONT_BODY}`;
      x.fillText(`Ele: CA ${c.defesa}  ·  Ataca ${c.ataque >= 0 ? '+' : ''}${c.ataque}  ·  Dano ${c.dado}`, marginL, y + 192);
      x.fillStyle = '#2f5a33';
      x.fillText(`Você: CA ${c.ca}${c.escudo ? '  ·  Com escudo' : ''}`, marginL, y + 254);
      y += 286;
      // Os guardas dele e os seus aliados, dois por linha, com a Vida em barra.
      const lados = c.lados || [], colW = (maxW - 40) / 2;
      lados.forEach((l, i) => {
        const cx0 = marginL + (i % 2) * (colW + 40), yy = y + Math.floor(i / 2) * 90 + 24;
        x.textAlign = 'left'; x.fillStyle = l.inimigo ? '#6d1f1a' : '#2f4a2a';
        x.font = `600 40px ${FONT_TITLE}`;
        x.fillText(l.nome, cx0, yy, colW - 160);
        x.textAlign = 'right'; x.font = `700 40px ${FONT_TITLE}`;
        x.fillText(l.pv > 0 ? `${l.pv}/${l.pvMax}` : 'caído', cx0 + colW, yy);
        x.fillStyle = 'rgba(60,35,12,.3)'; x.fillRect(cx0, yy + 12, colW, 20);
        x.fillStyle = l.inimigo ? '#9a3a2a' : '#4f7a3a'; x.fillRect(cx0, yy + 12, colW * Math.max(0, (m.lados && m.lados[i] != null ? m.lados[i] : l.pv)) / Math.max(1, l.pvMax), 20);
      });
      if (lados.length) y += Math.ceil(lados.length / 2) * 90 + 10;
    }
    for (; size >= 34; size -= 2) {
      x.font = `${size}px ${FONT_BODY}`;
      lines = wrapLines(x, texto, maxW);
      lh = size * 1.3;
      if (y + lines.length * lh + footerH < PAGE_H - 80) break;
    }
    x.textAlign = 'left';
    x.font = `${size}px ${FONT_BODY}`;
    y += size;
    const links = [];
    lines.forEach((l, i) => {
      const by = y + i * lh;
      let cursor = marginL, rest = l;
      while (rest) {
        let best = null;
        presos.forEach(t => {
          const at = rest.indexOf(t.nome);
          if (at >= 0 && (!best || at < best.at)) best = { at, t };
        });
        const plain = best ? rest.slice(0, best.at) : rest;
        x.fillStyle = '#26170a';
        x.fillText(plain, cursor, by);
        cursor += x.measureText(plain).width;
        if (!best) break;
        const w = x.measureText(best.t.nome).width;
        x.fillStyle = '#8a1d16';
        x.fillText(best.t.nome, cursor, by);
        x.fillRect(cursor, by + 6, w, 3);
        links.push({ x: cursor, y: by - size, w, h: size * 1.3, id: best.t.id });
        cursor += w;
        rest = rest.slice(best.at + best.t.nome.length);
      }
    });

    if (p.fundo) {
      const label = 'Ler mais sobre esta cena';
      x.font = `italic 50px ${FONT_BODY}`;
      x.textAlign = 'left';
      const w = x.measureText(label).width, lx = marginL, ly = PAGE_H - 70 - alturaFichas - 30;
      x.fillStyle = '#8a1d16';
      x.fillText(label, lx, ly);
      x.fillRect(lx, ly + 7, w, 3);
      links.push({ x: lx, y: ly - 44, w, h: 62, id: 'cena' });
    }

    linhasFichas.forEach((l, i) => {
      const total = l.reduce((a, b) => a + b.w + 18, -18);
      let fx = marginL + (maxW - total) / 2;
      const fy = PAGE_H - 70 - (linhasFichas.length - i) * 96 + 10;
      l.forEach(f => {
        const mais = f.t[0] === '+', menos = f.t[0] === '-';
        x.fillStyle = mais ? '#2f5a33' : menos ? '#7c1f1f' : '#4a3a28';
        x.fillRect(fx, fy, f.w, 82);
        x.fillStyle = '#f7ecd0'; x.textAlign = 'center';
        x.font = `700 58px ${FONT_TITLE}`;
        textoIcones(x, f.t, 58, { coin: '#f4d470', star: '#bfe0ff', heart: '#ffb0a8' }, fx + f.w / 2, fy + 60);
        fx += f.w + 18;
      });
    });
    const tex = toTexture(c, renderer);
    tex.userData.links = links;
    return tex;
  }

  function gutter(x, w, h, side) {
    const g = side === 'right'
      ? x.createLinearGradient(w - 170, 0, w, 0)
      : x.createLinearGradient(170, 0, 0, 0);
    g.addColorStop(0, 'rgba(60,35,12,0)');
    g.addColorStop(1, 'rgba(60,35,12,.42)');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
  }

  // Mapa: desenha a base uma vez e volta a desenhar o trilho percorrido em cima.
  const MAP_W = 2800, MAP_H = 2000;
  const mapBases = {};

  // A borda do pergaminho: rasgada e queimada, nunca um retângulo perfeito.
  function bordaRasgada(x, W, H) {
    const pontos = [], lado = (ax, ay, bx, by, n) => {
      for (let i = 0; i < n; i++) {
        const t = i / n, j = Math.random() * 15 + (Math.random() < .08 ? 10 : 0);
        pontos.push([ax + (bx - ax) * t + (ax === bx ? (ax === 0 ? j : -j) : 0), ay + (by - ay) * t + (ay === by ? (ay === 0 ? j : -j) : 0)]);
      }
    };
    lado(0, 0, W, 0, 170); lado(W, 0, W, H, 120); lado(W, H, 0, H, 170); lado(0, H, 0, 0, 120);
    const caminho = new Path2D();
    pontos.forEach(([a, b], i) => (i ? caminho.lineTo(a, b) : caminho.moveTo(a, b)));
    caminho.closePath();
    x.save();
    x.globalCompositeOperation = 'source-atop';
    [[46, .1], [28, .16], [14, .24], [6, .5]].forEach(([l, a]) => { x.lineWidth = l; x.strokeStyle = `rgba(52,26,8,${a})`; x.stroke(caminho); });
    x.restore();
    x.save();
    x.globalCompositeOperation = 'destination-in';
    x.fill(caminho);
    x.restore();
  }

  function rosaDosVentos(x, cx, cy, r) {
    x.save();
    x.translate(cx, cy);
    x.fillStyle = 'rgba(232,216,176,.45)';
    x.beginPath(); x.arc(0, 0, r * .98, 0, 7); x.fill();
    x.strokeStyle = '#3a2412'; x.lineWidth = 5;
    x.beginPath(); x.arc(0, 0, r * .98, 0, 7); x.stroke();
    x.lineWidth = 2;
    x.beginPath(); x.arc(0, 0, r * .86, 0, 7); x.stroke();
    for (let i = 0; i < 32; i++) {
      x.save(); x.rotate(i * Math.PI / 16); x.lineWidth = i % 4 ? 2 : 4;
      x.beginPath(); x.moveTo(0, -r * .86); x.lineTo(0, -r * .98); x.stroke();
      x.restore();
    }
    const ponta = (rot, comp, larg, claro, escuro) => {
      x.save(); x.rotate(rot);
      x.fillStyle = claro; x.beginPath(); x.moveTo(0, -comp); x.lineTo(larg, 0); x.lineTo(0, 0); x.closePath(); x.fill();
      x.fillStyle = escuro; x.beginPath(); x.moveTo(0, -comp); x.lineTo(-larg, 0); x.lineTo(0, 0); x.closePath(); x.fill();
      x.lineWidth = 2; x.strokeStyle = '#2a1a0d';
      x.beginPath(); x.moveTo(0, -comp); x.lineTo(larg, 0); x.lineTo(-larg, 0); x.closePath(); x.stroke();
      x.restore();
    };
    for (let i = 0; i < 4; i++) ponta(Math.PI / 4 + i * Math.PI / 2, r * .62, r * .1, '#e8d8b0', '#3a2412');
    for (let i = 0; i < 4; i++) ponta(i * Math.PI / 2, r * .94, r * .15, i ? '#f0dfb4' : '#c33b2c', i ? '#3a2412' : '#6d1f1a');
    x.fillStyle = ouroEm(x, -18, -18, 18, 18); x.beginPath(); x.arc(0, 0, r * .09, 0, 7); x.fill(); x.stroke();
    x.restore();
  }

  function barco(x, px, py, s) {
    x.save();
    x.translate(px, py); x.scale(s, s);
    x.strokeStyle = '#2a1a0d'; x.lineWidth = 2.6;
    x.fillStyle = '#6b4023';
    x.beginPath(); x.moveTo(-44, 0); x.quadraticCurveTo(0, 26, 44, -2); x.lineTo(36, 16); x.quadraticCurveTo(0, 28, -34, 16); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(0, 8); x.lineTo(0, -60); x.stroke();
    x.fillStyle = '#efe2bd';
    x.beginPath(); x.moveTo(2, -56); x.quadraticCurveTo(38, -38, 4, -8); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(-2, -50); x.quadraticCurveTo(-30, -36, -2, -14); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#a4161a'; x.beginPath(); x.moveTo(0, -60); x.lineTo(16, -68); x.lineTo(0, -74); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(30,60,70,.6)';
    x.beginPath(); x.moveTo(-58, 24); x.quadraticCurveTo(-30, 30, 0, 24); x.quadraticCurveTo(30, 18, 58, 24); x.stroke();
    x.restore();
  }

  function buildMapBase() {
    const [c, x] = canvas(MAP_W, MAP_H);
    paintParchment(x, MAP_W, MAP_H, '#dcc899');
    const W = MAP_W, H = MAP_H;

    // Manchas de aguarela na terra, para o papel não parecer vazio.
    [['rgba(120,136,70,.12)', 26], ['rgba(170,120,60,.1)', 22], ['rgba(95,120,80,.1)', 16]].forEach(([cor, n]) => {
      for (let i = 0; i < n; i++) {
        const px = Math.random() * W, py = Math.random() * H, r = 120 + Math.random() * 300;
        const g = x.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, cor); g.addColorStop(.7, cor); g.addColorStop(1, 'rgba(120,136,70,0)');
        x.fillStyle = g; x.beginPath(); x.ellipse(px, py, r, r * .7, Math.random() * 3, 0, 7); x.fill();
      }
    });

    // O mar. Só os pontos na costa tremem: os da moldura ficam onde estão.
    const costa = new Path2D();
    const contorno = [];
    MAPA.mar.forEach(([a, b]) => {
      const borda = a === 0 || a === 1 || b === 0 || b === 1;
      contorno.push([W * a + (borda ? 0 : (Math.random() - .5) * 16), H * b + (borda ? 0 : (Math.random() - .5) * 16), borda]);
    });
    // A costa ganha reentrâncias entre os pontos dados, para não parecer uma régua.
    contorno.forEach(([a, b, borda], i) => {
      if (!i) { costa.moveTo(a, b); return; }
      const [pa, pb, pborda] = contorno[i - 1];
      if (!borda && !pborda) {
        for (let k = 1; k < 7; k++) {
          const t = k / 7, d = Math.hypot(a - pa, b - pb);
          costa.lineTo(pa + (a - pa) * t + (Math.random() - .5) * d * .05, pb + (b - pb) * t + (Math.random() - .5) * d * .05);
        }
      }
      costa.lineTo(a, b);
    });
    costa.closePath();
    const fundoMar = x.createLinearGradient(0, 0, W, H);
    fundoMar.addColorStop(0, 'rgba(62,108,118,.62)'); fundoMar.addColorStop(1, 'rgba(38,84,104,.72)');
    x.fillStyle = fundoMar; x.fill(costa);
    x.save(); x.clip(costa);
    // Linhas de água junto à costa, como nas cartas antigas.
    [[120, .08], [86, .1], [56, .13], [30, .18]].forEach(([l, a]) => { x.lineWidth = l; x.strokeStyle = `rgba(214,226,206,${a})`; x.stroke(costa); });
    x.strokeStyle = 'rgba(20,50,62,.36)'; x.lineWidth = 2.6;
    for (let r = 0; r < 260; r++) {
      const px = Math.random() * W, py = Math.random() * H;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 18, py - 10, px + 36, py); x.quadraticCurveTo(px + 54, py + 10, px + 72, py); x.stroke();
    }
    x.restore();
    x.lineWidth = 7; x.strokeStyle = '#2f1c0e'; x.lineJoin = 'round'; x.stroke(costa);
    // Barcos onde houver mar aberto.
    let barcos = 0;
    for (let i = 0; i < 400 && barcos < 2; i++) {
      const px = W * (.05 + Math.random() * .9), py = H * (.08 + Math.random() * .84);
      const longe = Object.values(LUGARES).every(l => Math.hypot(l.x * W - px, l.y * H - py) > 260);
      const fundo = [[-90, 0], [90, 0], [0, -90], [0, 60]].every(([a, b]) => x.isPointInPath(costa, px + a, py + b));
      if (longe && fundo) { barco(x, px, py, 1.15 + Math.random() * .4); barcos++; }
    }

    // Ilhas e lagos
    (MAPA.ilhas || []).forEach(i => {
      x.beginPath(); x.ellipse(W * i.x, H * i.y, W * i.rx, H * i.ry, .3, 0, 7);
      x.fillStyle = i.cor; x.fill();
      x.lineWidth = 7; x.strokeStyle = '#2f1c0e'; x.stroke();
    });
    (MAPA.lagos || []).forEach(l => {
      x.beginPath(); x.ellipse(W * l.x, H * l.y, W * l.rx, H * l.ry, 0, 0, 7);
      x.fillStyle = 'rgba(62,108,118,.7)'; x.fill();
      x.lineWidth = 5; x.strokeStyle = '#2f1c0e'; x.stroke();
      x.lineWidth = 2; x.strokeStyle = 'rgba(214,226,206,.5)';
      x.beginPath(); x.ellipse(W * l.x, H * l.y, W * l.rx * .7, H * l.ry * .62, 0, 0, 7); x.stroke();
    });
    (MAPA.rios || []).forEach(rio => {
      x.beginPath();
      rio.forEach(([a, b], i) => (i ? x.lineTo(W * a, H * b) : x.moveTo(W * a, H * b)));
      x.lineCap = 'round'; x.lineJoin = 'round';
      x.lineWidth = 15; x.strokeStyle = '#2f1c0e'; x.stroke();
      x.lineWidth = 9; x.strokeStyle = '#6f99a2'; x.stroke();
    });

    // Serras: o lado da luz é claro, o da sombra é tracejado, e os picos altos têm neve.
    const mountain = (mx, my, s) => {
      const topo = my - s * 1.25, dx = s * (.05 + Math.random() * .12);
      x.fillStyle = 'rgba(40,24,10,.16)';
      x.beginPath(); x.ellipse(mx + s * .3, my + 3, s * 1.05, s * .2, 0, 0, 7); x.fill();
      x.fillStyle = '#e2cfa0';
      x.beginPath(); x.moveTo(mx - s, my); x.lineTo(mx + dx, topo); x.lineTo(mx + s, my); x.closePath(); x.fill();
      x.fillStyle = '#9b8259';
      x.beginPath(); x.moveTo(mx + dx, topo); x.lineTo(mx + s, my); x.lineTo(mx + s * .12, my); x.lineTo(mx + dx - s * .08, my - s * .62); x.closePath(); x.fill();
      if (s > 66) {
        x.fillStyle = '#f7f2e4';
        x.beginPath(); x.moveTo(mx + dx, topo); x.lineTo(mx + dx + s * .26, topo + s * .34); x.lineTo(mx + dx + s * .06, topo + s * .26); x.lineTo(mx + dx - s * .08, topo + s * .4); x.lineTo(mx + dx - s * .25, topo + s * .32); x.closePath(); x.fill();
      }
      x.strokeStyle = '#2f1c0e'; x.lineWidth = 4.6; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(mx - s, my); x.lineTo(mx + dx, topo); x.lineTo(mx + s, my); x.stroke();
      x.lineWidth = 2;
      for (let i = 1; i < s / 8; i++) { x.beginPath(); x.moveTo(mx + dx + i * 3.6, topo + i * 9); x.lineTo(mx + dx + i * 6.8, my - 4); x.stroke(); }
    };
    MAPA.serras.forEach(z => {
      const ridge = [];
      for (let i = 0; i < z.n; i++) ridge.push([W * (z.x + Math.random() * z.w), H * (z.y + Math.random() * z.h)]);
      ridge.sort((a, b) => a[1] - b[1]).forEach(([a, b]) => mountain(a, b + 60, 46 + Math.random() * 44));
    });

    // Florestas: um chão verde, e árvores com lado de luz e de sombra.
    const tree = (tx, ty, s) => {
      x.fillStyle = 'rgba(25,30,12,.3)';
      x.beginPath(); x.ellipse(tx + s * .2, ty + 2, s * .5, s * .13, 0, 0, 7); x.fill();
      const verde = ['#567a3d', '#4a6c37', '#60823f'][Math.floor(Math.random() * 3)];
      x.fillStyle = '#3b2412'; x.fillRect(tx - 2.5, ty - s * .12, 5, s * .14);
      [[1, 0, .48], [.72, -.3, .38], [.46, -.56, .27]].forEach(([k, sobe, larg]) => {
        const by = ty + s * sobe * .55 - s * .06;
        x.fillStyle = verde;
        x.beginPath(); x.moveTo(tx, by - s * k * .68); x.lineTo(tx - s * larg, by); x.lineTo(tx + s * larg, by); x.closePath(); x.fill();
        x.fillStyle = 'rgba(20,34,14,.42)';
        x.beginPath(); x.moveTo(tx, by - s * k * .68); x.lineTo(tx + s * larg, by); x.lineTo(tx + s * larg * .1, by); x.closePath(); x.fill();
        x.strokeStyle = '#1f2e18'; x.lineWidth = 2.2;
        x.beginPath(); x.moveTo(tx - s * larg, by); x.lineTo(tx, by - s * k * .68); x.lineTo(tx + s * larg, by); x.stroke();
      });
    };
    MAPA.florestas.forEach(z => {
      const chao = x.createRadialGradient(W * z.x, H * z.y, 0, W * z.x, H * z.y, W * z.rx * 1.25);
      chao.addColorStop(0, 'rgba(80,110,50,.42)'); chao.addColorStop(.75, 'rgba(80,110,50,.26)'); chao.addColorStop(1, 'rgba(80,110,50,0)');
      x.fillStyle = chao;
      x.save(); x.translate(W * z.x, H * z.y); x.scale(1, (H * z.ry) / (W * z.rx)); x.translate(-W * z.x, -H * z.y);
      x.beginPath(); x.arc(W * z.x, H * z.y, W * z.rx * 1.25, 0, 7); x.fill(); x.restore();
      const forest = [];
      for (let i = 0; i < z.n; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random());
        forest.push([W * (z.x + Math.cos(a) * r * z.rx), H * (z.y + Math.sin(a) * r * z.ry)]);
      }
      forest.sort((a, b) => a[1] - b[1]).forEach(([a, b]) => tree(a, b, 40 + Math.random() * 24));
    });

    // Pântanos
    MAPA.pantanos.forEach(z => {
      x.save(); x.translate(W * z.x, H * z.y); x.scale(1, (H * z.ry) / (W * z.rx));
      const g = x.createRadialGradient(0, 0, 0, 0, 0, W * z.rx);
      g.addColorStop(0, 'rgba(50,70,44,.5)'); g.addColorStop(.7, 'rgba(50,70,44,.3)'); g.addColorStop(1, 'rgba(50,70,44,0)');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, W * z.rx, 0, 7); x.fill(); x.restore();
      x.strokeStyle = '#27341f'; x.lineWidth = 3;
      for (let i = 0; i < z.n; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random());
        const px = W * (z.x + Math.cos(a) * r * z.rx), py = H * (z.y + Math.sin(a) * r * z.ry);
        x.beginPath(); x.moveTo(px - 14, py); x.lineTo(px + 14, py); x.moveTo(px - 5, py); x.lineTo(px - 9, py - 16); x.moveTo(px + 4, py); x.lineTo(px + 8, py - 18); x.stroke();
      }
    });

    // Uma árvore enorme, quando o mapa do mundo a tem.
    if (MAPA.arvore) {
      const ax = W * MAPA.arvore.x, ay = H * MAPA.arvore.y;
      const brilho = x.createRadialGradient(ax, ay - 90, 20, ax, ay - 90, 300);
      brilho.addColorStop(0, 'rgba(238,214,120,.55)'); brilho.addColorStop(1, 'rgba(238,214,120,0)');
      x.fillStyle = brilho; x.beginPath(); x.arc(ax, ay - 90, 300, 0, 7); x.fill();
      x.fillStyle = 'rgba(25,14,6,.3)'; x.beginPath(); x.ellipse(ax + 26, ay + 8, 150, 26, 0, 0, 7); x.fill();
      x.strokeStyle = '#17100a'; x.lineCap = 'round'; x.lineJoin = 'round';
      const pontas = [];
      const galho = (px, py, ang, comp, grossura, n) => {
        const fx = px + Math.cos(ang) * comp, fy = py + Math.sin(ang) * comp;
        x.lineWidth = grossura;
        x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo((px + fx) / 2 + (Math.random() - .5) * comp * .3, (py + fy) / 2, fx, fy); x.stroke();
        if (n <= 0) { pontas.push([fx, fy]); return; }
        const filhos = 2 + (Math.random() < .35 ? 1 : 0);
        for (let i = 0; i < filhos; i++) galho(fx, fy, ang + (i - (filhos - 1) / 2) * .62 + (Math.random() - .5) * .2, comp * (.68 + Math.random() * .1), grossura * .62, n - 1);
      };
      [[-1.2, 18], [1.1, -14], [-.5, 8], [.6, -6]].forEach(([d, k]) => {
        x.lineWidth = 12;
        x.beginPath(); x.moveTo(ax + k, ay - 40); x.quadraticCurveTo(ax + k * 2, ay - 2, ax + k + d * 56, ay + 8); x.stroke();
      });
      galho(ax, ay + 6, -Math.PI / 2, 92, 36, 5);
      pontas.forEach(([a, b]) => {
        x.fillStyle = ['rgba(23,16,10,.92)', 'rgba(36,28,14,.88)', 'rgba(14,10,6,.95)'][Math.floor(Math.random() * 3)];
        x.beginPath(); x.ellipse(a, b, 17 + Math.random() * 15, 12 + Math.random() * 11, Math.random() * 3, 0, 7); x.fill();
      });
    }

    // Estradas, com um fio claro por baixo para se destacarem do fundo.
    x.lineCap = 'round';
    for (const [a, b] of ESTRADAS) {
      const A = LUGARES[a], B = LUGARES[b];
      const C = controloDaEstrada(A, B);
      const linha = () => { x.beginPath(); x.moveTo(A.x * W, A.y * H); x.quadraticCurveTo(C.x * W, C.y * H, B.x * W, B.y * H); x.stroke(); };
      x.setLineDash([]); x.strokeStyle = 'rgba(240,226,190,.5)'; x.lineWidth = 13; linha();
      x.setLineDash([24, 16]); x.strokeStyle = '#5d3417'; x.lineWidth = 7; linha();
    }
    x.setLineDash([]);

    // Moldura de carta antiga: filetes e uma faixa aos quadrados.
    x.strokeStyle = '#2f1c0e'; x.lineWidth = 10; x.strokeRect(44, 44, W - 88, H - 88);
    x.lineWidth = 3; x.strokeRect(84, 84, W - 168, H - 168);
    const quadrados = (ax, ay, bx, by) => {
      const d = Math.hypot(bx - ax, by - ay), n = Math.round(d / 76), ux = (bx - ax) / n, uy = (by - ay) / n;
      for (let i = 0; i < n; i++) {
        x.fillStyle = i % 2 ? '#2f1c0e' : '#ecdcb4';
        x.fillRect(ax + ux * i + (uy ? -13 : 0), ay + uy * i + (ux ? -13 : 0), ux || 26, uy || 26);
      }
    };
    quadrados(84, 64, W - 84, 64); quadrados(84, H - 64, W - 84, H - 64);
    quadrados(64, 84, 64, H - 84); quadrados(W - 64, 84, W - 64, H - 84);
    [[64, 64], [W - 64, 64], [64, H - 64], [W - 64, H - 64]].forEach(([a, b]) => {
      x.fillStyle = '#ecdcb4'; x.fillRect(a - 24, b - 24, 48, 48);
      x.strokeStyle = '#2f1c0e'; x.lineWidth = 3; x.strokeRect(a - 24, b - 24, 48, 48);
      x.fillStyle = '#6d1f1a'; losango(x, a, b, 18);
    });

    // Rosa dos ventos
    rosaDosVentos(x, W * .92, H * .19, 160);
    x.fillStyle = '#2a1a0d'; x.textAlign = 'center';
    x.font = `700 58px ${FONT_TITLE}`;
    x.fillText('N', W * .92, H * .19 - 172);

    // Título numa fita
    x.font = `700 70px ${FONT_TITLE}`;
    const tw = x.measureText(MAPA.titulo).width, tx = W * MAPA.tituloX, ty = H * .935, fw = tw / 2 + 70;
    const fita = (d, cor) => {
      x.fillStyle = cor;
      x.beginPath(); x.moveTo(tx + d * fw, ty - 62); x.lineTo(tx + d * (fw + 74), ty - 44); x.lineTo(tx + d * (fw + 40), ty - 2); x.lineTo(tx + d * (fw + 80), ty + 34); x.lineTo(tx + d * fw, ty + 18); x.closePath(); x.fill();
      x.strokeStyle = '#2f1c0e'; x.lineWidth = 3; x.stroke();
    };
    fita(-1, '#8a2c22'); fita(1, '#8a2c22');
    const faixa = x.createLinearGradient(0, ty - 66, 0, ty + 22);
    faixa.addColorStop(0, '#efe2bd'); faixa.addColorStop(.5, '#fbf1d4'); faixa.addColorStop(1, '#cdb988');
    x.fillStyle = faixa; x.fillRect(tx - fw, ty - 68, fw * 2, 88);
    x.strokeStyle = '#2f1c0e'; x.lineWidth = 4; x.strokeRect(tx - fw, ty - 68, fw * 2, 88);
    x.fillStyle = '#2a1a0d';
    x.fillText(MAPA.titulo, tx, ty);

    bordaRasgada(x, W, H);
    mapBases[MAPA.titulo] = c;
  }

  // Castelo de cidade: muralha, duas torres e uma bandeira.
  function castelo(x, px, py, s, visitada) {
    x.save();
    x.translate(px, py); x.scale(s, s);
    x.lineWidth = 3; x.strokeStyle = '#1f130a'; x.lineJoin = 'round';
    x.fillStyle = 'rgba(30,18,8,.3)'; x.beginPath(); x.ellipse(5, 16, 46, 9, 0, 0, 7); x.fill();
    const parede = (a, b, c, d) => {
      x.fillStyle = '#efe3c2'; x.fillRect(a, b, c, d); x.strokeRect(a, b, c, d);
      x.fillStyle = 'rgba(70,45,20,.3)'; x.fillRect(a + c * .55, b, c * .45, d);
    };
    parede(-28, -18, 56, 32);
    for (let i = 0; i < 5; i++) { x.fillStyle = '#efe3c2'; x.fillRect(-28 + i * 12.5, -25, 7, 7); x.strokeRect(-28 + i * 12.5, -25, 7, 7); }
    [[-30, 13, 40], [30, 13, 40]].forEach(([a, l, h]) => {
      parede(a - l / 2, 14 - h, l, h);
      x.fillStyle = visitada ? '#b0261f' : '#8a3324';
      x.beginPath(); x.moveTo(a - l / 2 - 3, 14 - h); x.lineTo(a, 14 - h - 26); x.lineTo(a + l / 2 + 3, 14 - h); x.closePath(); x.fill(); x.stroke();
    });
    parede(-9, -38, 18, 52);
    x.fillStyle = visitada ? '#b0261f' : '#8a3324';
    x.beginPath(); x.moveTo(-12, -38); x.lineTo(0, -66); x.lineTo(12, -38); x.closePath(); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(0, -66); x.lineTo(0, -82); x.stroke();
    x.fillStyle = '#a4161a'; x.beginPath(); x.moveTo(0, -82); x.lineTo(15, -77); x.lineTo(0, -72); x.closePath(); x.fill();
    x.fillStyle = '#2a1a0d';
    x.beginPath(); x.arc(0, 6, 7, Math.PI, 0); x.lineTo(7, 14); x.lineTo(-7, 14); x.closePath(); x.fill();
    x.restore();
  }

  // visitados: lista ordenada de chaves de LUGARES; destaque: chaves a realçar.
  function mapTexture(tex, visitados = [], destaque = [], suspeitos = [], rasto = null, rumo = null) {
    if (!mapBases[MAPA.titulo]) buildMapBase();
    const [c, x] = tex ? [tex.image, tex.image.getContext('2d')] : canvas(MAP_W, MAP_H);
    x.clearRect(0, 0, MAP_W, MAP_H);
    x.drawImage(mapBases[MAPA.titulo], 0, 0);

    // Trilho percorrido
    x.strokeStyle = 'rgba(164,22,26,.88)'; x.lineWidth = 13; x.lineCap = 'round'; x.lineJoin = 'round';
    if (visitados.length > 1) {
      x.beginPath();
      visitados.forEach((k, i) => {
        const p = LUGARES[k];
        if (i === 0) x.moveTo(p.x * MAP_W, p.y * MAP_H); else x.lineTo(p.x * MAP_W, p.y * MAP_H);
      });
      x.stroke();
    }

    for (const key in LUGARES) {
      const p = LUGARES[key], px = p.x * MAP_W, py = p.y * MAP_H;
      const on = destaque.includes(key);
      if (on) {
        const g = x.createRadialGradient(px, py, 8, px, py, 110);
        g.addColorStop(0, 'rgba(255,214,120,.95)'); g.addColorStop(1, 'rgba(255,214,120,0)');
        x.fillStyle = g; x.beginPath(); x.arc(px, py, 110, 0, 7); x.fill();
      }
      if (p.cidade) castelo(x, px, py - 6, .98, visitados.includes(key));
      else {
        x.fillStyle = visitados.includes(key) ? '#a4161a' : '#2a1a0d';
        x.beginPath(); x.arc(px, py, 19, 0, 7); x.fill();
        x.strokeStyle = '#e9dbb8'; x.lineWidth = 5; x.stroke();
      }
      if (rasto && rasto.key === key) {
        // Cada ponto é um fragmento: os cheios já são seus.
        const raio = 118;
        for (let i = 0; i < FRAGMENTOS_POR_PISTA; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / FRAGMENTOS_POR_PISTA, cheio = i < rasto.fragmentos;
          x.beginPath(); x.arc(px + Math.cos(a) * raio, py + Math.sin(a) * raio, 26, 0, 7);
          x.fillStyle = cheio ? '#a4161a' : 'rgba(233,219,184,.75)'; x.fill();
          x.strokeStyle = cheio ? '#f2e3bd' : '#a4161a'; x.lineWidth = 5; x.stroke();
        }
        drawGlyph(x, 'eye', px, py - 196, 104, '#a4161a');
      }
      // A estrela dourada: é para aqui que a missão manda.
      if (rumo === key) {
        const brilho = x.createRadialGradient(px, py - 130, 6, px, py - 130, 120);
        brilho.addColorStop(0, 'rgba(255,214,90,.9)'); brilho.addColorStop(1, 'rgba(255,214,90,0)');
        x.fillStyle = brilho; x.beginPath(); x.arc(px, py - 130, 120, 0, 7); x.fill();
        drawGlyph(x, 'star', px, py - 130, 132, '#7a4a06');
        drawGlyph(x, 'star', px, py - 130, 102, '#ffd34d');
        x.strokeStyle = '#b07a12'; x.lineWidth = 9;
        x.beginPath(); x.arc(px, py, 58, 0, 7); x.stroke();
      }
      x.font = `700 ${p.cidade ? 58 : 48}px ${FONT_TITLE}`;
      x.textAlign = 'center';
      x.lineWidth = 11; x.strokeStyle = 'rgba(232,216,176,.92)'; x.lineJoin = 'round';
      x.strokeText(p.nome, px, py + 86);
      x.fillStyle = '#231509';
      x.fillText(p.nome, px, py + 86);
    }
    if (tex) { tex.needsUpdate = true; return tex; }
    return toTexture(c, renderer);
  }

  // Textura com os números de um dado, uma célula por face.
  function diceAtlas(labels, color, ink, cols, rows) {
    const cell = 200;
    const [c, x] = canvas(cols * cell, rows * cell);
    x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    // Resina com veios, como os dados de verdade.
    for (let i = 0; i < 120; i++) {
      const px = Math.random() * c.width, py = Math.random() * c.height, r = 20 + Math.random() * 70;
      const tom = Math.random() < .5 ? '255,255,255' : '0,0,0';
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, `rgba(${tom},${.03 + Math.random() * .08})`); g.addColorStop(1, `rgba(${tom},0)`);
      x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    speckle(x, c.width, c.height, 1800, .1);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    labels.forEach((l, i) => {
      const px = (i % cols + .5) * cell, py = (Math.floor(i / cols) + .5) * cell;
      x.font = `700 ${l.length > 1 ? 70 : 86}px ${FONT_TITLE}`;
      x.fillStyle = 'rgba(0,0,0,.55)'; x.fillText(l, px + 2, py + 3);
      x.fillStyle = ink; x.fillText(l, px, py);
      if (l === '6' || l === '9') x.fillRect(px - 20, py + 38, 40, 7);
    });
    return toTexture(c, renderer);
  }

  // O dado de uma classe aprimorada: fundo perolado com veios, e os números à parte, numa textura que brilha.
  function diceAtlasTema(labels, tema, cols, rows) {
    const cell = 200, w = cols * cell, h = rows * cell;
    const [c, x] = canvas(w, h);
    const [cb, b] = canvas(w, h);
    x.fillStyle = tema.perola[0]; x.fillRect(0, 0, w, h);
    b.fillStyle = '#000'; b.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const px = Math.random() * w, py = Math.random() * h, r = 30 + Math.random() * 110;
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, tema.perola[i % tema.perola.length]); g.addColorStop(1, `${tema.perola[i % tema.perola.length]}00`);
      x.fillStyle = g; x.globalAlpha = .55;
      x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    }
    x.globalAlpha = 1;
    // Os veios passam pelo fundo e também brilham, muito ao de leve.
    const veio = ctx => {
      ctx.beginPath();
      let px = Math.random() * w, py = Math.random() * h;
      ctx.moveTo(px, py);
      for (let k = 0; k < 5; k++) {
        const qx = px + (Math.random() - .5) * 240, qy = py + (Math.random() - .5) * 240;
        px += (Math.random() - .5) * 300; py += (Math.random() - .5) * 300;
        ctx.quadraticCurveTo(qx, qy, px, py);
      }
      ctx.stroke();
    };
    x.strokeStyle = tema.veia; b.strokeStyle = tema.brilho; b.globalAlpha = .28;
    for (let i = 0; i < 46; i++) {
      x.lineWidth = b.lineWidth = .8 + Math.random() * 2;
      x.globalAlpha = .55; veio(x); veio(b);
    }
    x.globalAlpha = 1; b.globalAlpha = 1;
    [x, b].forEach(ctx => { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; });
    labels.forEach((l, i) => {
      const px = (i % cols + .5) * cell, py = (Math.floor(i / cols) + .5) * cell;
      const fonte = `700 ${l.length > 1 ? 72 : 88}px ${FONT_TITLE}`;
      x.font = b.font = fonte;
      x.lineWidth = 7; x.strokeStyle = 'rgba(10,6,4,.85)'; x.strokeText(l, px, py);
      x.fillStyle = tema.brilho; x.fillText(l, px, py);
      b.shadowColor = tema.brilho; b.shadowBlur = 34; b.fillStyle = tema.brilho;
      b.fillText(l, px, py); b.fillText(l, px, py);
      b.shadowBlur = 8; b.fillStyle = tema.nucleo; b.fillText(l, px, py);
      b.shadowBlur = 0;
      if (l === '6' || l === '9') { [x, b].forEach(ctx => { ctx.fillStyle = tema.brilho; ctx.fillRect(px - 20, py + 38, 40, 7); }); }
    });
    return { map: toTexture(c, renderer), brilho: toTexture(cb, renderer) };
  }

  // Medalhão do pino: o símbolo da classe, para se ver de longe no mapa.
  function pinFace(glyph, cor) {
    const [c, x] = canvas(256, 256);
    x.fillStyle = 'rgba(20,10,4,.55)';
    x.beginPath(); x.arc(128, 132, 124, 0, 7); x.fill();
    const disco = x.createRadialGradient(118, 96, 10, 128, 128, 118);
    disco.addColorStop(0, '#fff6dc'); disco.addColorStop(1, '#d9c28c');
    x.fillStyle = disco;
    x.beginPath(); x.arc(128, 128, 116, 0, 7); x.fill();
    x.strokeStyle = cor; x.lineWidth = 11;
    x.beginPath(); x.arc(128, 128, 100, 0, 7); x.stroke();
    x.strokeStyle = ouroEm(x, 0, 0, 256, 256); x.lineWidth = 13;
    x.beginPath(); x.arc(128, 128, 116, 0, 7); x.stroke();
    drawGlyphRico(x, glyph, 128, 128, 140, cor === '#d8c27a' ? '#8a6414' : cor, '#e8c78a');
    return toTexture(c, renderer);
  }

  // Chama de vela: uma gota, branca por dentro e laranja por fora.
  function chama() {
    const [c, x] = canvas(128, 256);
    x.save();
    x.translate(64, 190); x.scale(1, 3.2);
    const g = x.createRadialGradient(0, -6, 2, 0, -6, 56);
    g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(.25, 'rgba(255,226,150,.95)'); g.addColorStop(.55, 'rgba(255,140,50,.55)'); g.addColorStop(1, 'rgba(255,70,10,0)');
    x.fillStyle = g; x.fillRect(-64, -60, 128, 100);
    x.restore();
    x.globalCompositeOperation = 'destination-in';
    const corte = new Path2D('M64 2C76 60 112 122 112 170a48 56 0 0 1-96 0C16 122 52 60 64 2z');
    x.fill(corte);
    return toTexture(c, renderer);
  }

  function pena() {
    const [c, x] = canvas(96, 384);
    const g = x.createLinearGradient(0, 0, 0, 384);
    g.addColorStop(0, '#2e2620'); g.addColorStop(.32, '#8d7f6c'); g.addColorStop(.7, '#e8dfca'); g.addColorStop(1, '#f6f0e0');
    x.fillStyle = g; x.fillRect(0, 0, 96, 384);
    x.lineWidth = 1;
    for (let i = 0; i < 150; i++) {
      const py = Math.random() * 384, lado = Math.random() < .5 ? -1 : 1;
      x.strokeStyle = `rgba(40,30,20,${.1 + Math.random() * .24})`;
      x.beginPath(); x.moveTo(48, py + 16); x.lineTo(48 + lado * 48, py); x.stroke();
    }
    x.strokeStyle = '#efe6d2'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(48, 0); x.lineTo(48, 384); x.stroke();
    return toTexture(c, renderer);
  }

  function moeda() {
    const [c, x] = canvas(128, 128);
    const [a, ax] = canvas(128, 128);
    x.fillStyle = ouroEm(x, 0, 0, 128, 128); x.fillRect(0, 0, 128, 128);
    x.strokeStyle = 'rgba(90,60,15,.7)'; x.lineWidth = 4; x.beginPath(); x.arc(64, 64, 54, 0, 7); x.stroke();
    drawGlyph(x, 'crown', 64, 64, 66, 'rgba(90,60,15,.7)');
    ax.fillStyle = '#808080'; ax.fillRect(0, 0, 128, 128);
    ax.strokeStyle = '#e0e0e0'; ax.lineWidth = 5; ax.beginPath(); ax.arc(64, 64, 54, 0, 7); ax.stroke();
    drawGlyph(ax, 'crown', 64, 64, 66, '#e8e8e8');
    return { map: toTexture(c, renderer), normal: normaisDe(a, renderer, 3) };
  }

  // Sombra macia por baixo dos objetos, onde a luz quase não chega.
  function sombraSuave() {
    const [c, x] = canvas(128, 128);
    const g = x.createRadialGradient(64, 64, 6, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,.8)'); g.addColorStop(.5, 'rgba(0,0,0,.42)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return toTexture(c, renderer);
  }

  function glowSprite(rgb = '255,190,110') {
    const [c, x] = canvas(256, 256);
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, `rgba(${rgb},1)`);
    g.addColorStop(.25, `rgba(${rgb},.55)`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return toTexture(c, renderer);
  }

  // O tabuleiro da personagem: um lugar marcado para cada carta.
  function characterBoard(lugares, covas, escala, ox, oz, w, h) {
    const [c, x] = canvas(Math.round(w * escala), Math.round(h * escala));
    const [a, ax] = canvas(c.width, c.height);
    const fundo = x.createLinearGradient(0, 0, c.width, c.height);
    fundo.addColorStop(0, '#2e1c10'); fundo.addColorStop(1, '#1d110a');
    x.fillStyle = fundo; x.fillRect(0, 0, c.width, c.height);
    speckle(x, c.width, c.height, 26000, .3);
    ax.fillStyle = '#a0a0a0'; ax.fillRect(0, 0, c.width, c.height);
    x.strokeStyle = ouroEm(x, 0, 0, c.width, c.height); x.lineWidth = 7; x.strokeRect(26, 26, c.width - 52, c.height - 52);
    // Cada lugar é uma cova escavada na tábua, mais funda e mais escura.
    const cova = (px, py, cw, ch, raio) => {
      const fim = new Path2D();
      fim.roundRect(px - cw / 2, py - ch / 2, cw, ch, raio);
      x.save();
      const g = x.createLinearGradient(0, py - ch / 2, 0, py + ch / 2);
      g.addColorStop(0, '#0c0604'); g.addColorStop(1, '#1b0f08');
      x.fillStyle = g; x.fill(fim);
      x.clip(fim);
      x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = 26; x.shadowOffsetY = 12;
      x.lineWidth = 10; x.strokeStyle = 'rgba(0,0,0,.8)'; x.stroke(fim);
      x.restore();
      x.lineWidth = 3; x.strokeStyle = 'rgba(216,180,94,.55)'; x.stroke(fim);
      ax.save();
      ax.shadowColor = '#000'; ax.shadowBlur = 6;
      ax.fillStyle = '#505050'; ax.fill(fim);
      ax.restore();
    };
    const cw = CARTA_TAB.w * escala, ch = CARTA_TAB.h * escala;
    covas.forEach(k => cova((k.x - ox) * escala, (k.z - oz) * escala, k.w * escala, k.h * escala, 18));
    lugares.forEach(l => {
      const px = (l.x - ox) * escala, py = (l.z - oz) * escala;
      cova(px, py, cw, ch, 16);
      drawGlyphRico(x, l.glyph, px, py - 34, 170, '#8a6a2e', '#d8b45e');
      x.fillStyle = 'rgba(242,227,189,.86)'; x.textAlign = 'center';
      x.font = `600 40px ${FONT_TITLE}`;
      x.fillText(l.nome, px, py + 128);
    });
    return { map: toTexture(c, renderer), normal: normaisDe(a, renderer, 3) };
  }

  function pageEdge() {
    const [c, x] = canvas(256, 64);
    x.fillStyle = '#d9c9a2'; x.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 64; i += 2) { x.fillStyle = `rgba(90,60,30,${Math.random() * .4})`; x.fillRect(0, i, 256, 1); }
    return toTexture(c, renderer);
  }

  return { characterBoard, wood, leather, relevoCouro, relevoMapa, superficieCarta, cardBack, cardFace, leftPage, rightPage, mapTexture, diceAtlas, diceAtlasTema, glowSprite, chama, pena, moeda, sombraSuave, pinFace, pageEdge, CARD_W, CARD_H };
}
