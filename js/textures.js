// Tudo o que se vê é desenhado em código: madeira, pergaminho, mapa, cartas e páginas.
// Assim as cartas têm alta resolução sem precisar de nenhum ficheiro de imagem.

const FONT_TITLE = '"Cinzel", Georgia, serif';
const FONT_BODY = '"EB Garamond", Georgia, serif';

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
  rara: { band: '#8a6414', accent: '#f4d675', label: 'Rara' },
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

  function wood() {
    const [c, x] = canvas(2048, 2048);
    const [b, bx] = canvas(2048, 2048);
    bx.fillStyle = '#808080'; bx.fillRect(0, 0, 2048, 2048);
    const planks = 5, ph = 2048 / planks;
    for (let p = 0; p < planks; p++) {
      const hue = 22 + Math.random() * 6, l = 17 + Math.random() * 6;
      x.fillStyle = `hsl(${hue},48%,${l}%)`;
      x.fillRect(0, p * ph, 2048, ph);
      for (let i = 0; i < 420; i++) {
        const y0 = p * ph + Math.random() * ph;
        const amp = 2 + Math.random() * 16, freq = 0.002 + Math.random() * 0.004, phase = Math.random() * 9;
        const dark = Math.random() < 0.66;
        const stroke = dark ? `rgba(18,8,3,${0.05 + Math.random() * 0.2})` : `rgba(190,125,70,${0.02 + Math.random() * 0.07})`;
        x.strokeStyle = stroke; x.lineWidth = 0.5 + Math.random() * 1.8;
        bx.strokeStyle = dark ? 'rgba(40,40,40,.25)' : 'rgba(190,190,190,.1)'; bx.lineWidth = x.lineWidth;
        x.beginPath(); bx.beginPath();
        for (let px = 0; px <= 2048; px += 24) {
          const yy = y0 + Math.sin(px * freq + phase) * amp;
          if (px === 0) { x.moveTo(px, yy); bx.moveTo(px, yy); } else { x.lineTo(px, yy); bx.lineTo(px, yy); }
        }
        x.stroke(); bx.stroke();
      }
      // junta entre tábuas
      x.fillStyle = 'rgba(0,0,0,.75)'; x.fillRect(0, p * ph - 2, 2048, 5);
      bx.fillStyle = '#101010'; bx.fillRect(0, p * ph - 3, 2048, 7);
    }
    const map = toTexture(c, renderer);
    const bump = toTexture(b, renderer, { linear: true });
    [map, bump].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2.2); });
    return { map, bump };
  }

  function leather(hex) {
    const [c, x] = canvas(512, 512);
    x.fillStyle = hex; x.fillRect(0, 0, 512, 512);
    speckle(x, 512, 512, 9000, 0.3);
    speckle(x, 512, 512, 3000, 0.05, false);
    return toTexture(c, renderer);
  }

  function cardBack(band = '#3a1414') {
    const [c, x] = canvas(CARD_W, CARD_H);
    x.fillStyle = band; x.fillRect(0, 0, CARD_W, CARD_H);
    speckle(x, CARD_W, CARD_H, 22000, 0.25);
    x.strokeStyle = '#c9a24a';
    x.lineWidth = 8; x.strokeRect(46, 46, CARD_W - 92, CARD_H - 92);
    x.lineWidth = 2; x.strokeRect(66, 66, CARD_W - 132, CARD_H - 132);
    // losangos do padrão
    x.lineWidth = 1.6; x.strokeStyle = 'rgba(201,162,74,.35)';
    for (let i = -14; i < 24; i++) {
      x.beginPath(); x.moveTo(66, 66 + i * 90); x.lineTo(CARD_W - 66, 66 + i * 90 + (CARD_W - 132)); x.stroke();
      x.beginPath(); x.moveTo(CARD_W - 66, 66 + i * 90); x.lineTo(66, 66 + i * 90 + (CARD_W - 132)); x.stroke();
    }
    x.fillStyle = band;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 250, 0, 7); x.fill();
    x.strokeStyle = '#c9a24a'; x.lineWidth = 6;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 250, 0, 7); x.stroke();
    x.lineWidth = 2;
    x.beginPath(); x.arc(CARD_W / 2, CARD_H / 2, 228, 0, 7); x.stroke();
    drawGlyph(x, 'eye', CARD_W / 2, CARD_H / 2 - 30, 220, '#c9a24a');
    x.fillStyle = '#c9a24a'; x.textAlign = 'center';
    x.font = `600 44px ${FONT_TITLE}`;
    x.fillText('CARDOMANCER', CARD_W / 2, CARD_H / 2 + 150);
    return toTexture(c, renderer);
  }

  // spec: { tema, titulo, desc, glyph, rodape, rodapeGlyph, locked, lockText }
  function cardFace(spec) {
    const [c, x] = canvas(CARD_W, CARD_H);
    const th = CARD_THEMES[spec.tema] || CARD_THEMES.escolha;
    paintParchment(x, CARD_W, CARD_H);

    // moldura
    x.strokeStyle = th.band; x.lineWidth = 16; x.strokeRect(30, 30, CARD_W - 60, CARD_H - 60);
    x.strokeStyle = th.accent; x.lineWidth = 4; x.strokeRect(50, 50, CARD_W - 100, CARD_H - 100);

    // faixa do tipo
    x.fillStyle = th.band; x.fillRect(50, 50, CARD_W - 100, spec.tema === 'pista' ? 124 : 96);
    x.fillStyle = '#f2e3bd'; x.textAlign = 'center';
    x.font = `${spec.tema === 'pista' ? 700 : 600} ${spec.tema === 'pista' ? 92 : 44}px ${FONT_TITLE}`;
    const label = (spec.etiqueta || th.label).toUpperCase();
    x.fillText(label, CARD_W / 2, spec.tema === 'pista' ? 145 : 114);

    // medalhão com o símbolo
    const my = 450, mr = 262;
    const glow = x.createRadialGradient(CARD_W / 2, my, 30, CARD_W / 2, my, mr);
    glow.addColorStop(0, 'rgba(255,240,195,.95)');
    glow.addColorStop(1, 'rgba(160,110,50,.15)');
    x.fillStyle = glow;
    x.beginPath(); x.arc(CARD_W / 2, my, mr, 0, 7); x.fill();
    x.save();
    x.translate(CARD_W / 2, my);
    x.strokeStyle = th.band; x.globalAlpha = 0.5;
    for (let i = 0; i < 72; i++) {
      x.rotate(Math.PI / 36);
      x.lineWidth = i % 2 ? 2 : 5;
      x.beginPath(); x.moveTo(0, -(mr - 46)); x.lineTo(0, -(mr - (i % 2 ? 28 : 14))); x.stroke();
    }
    x.restore();
    x.strokeStyle = th.band; x.lineWidth = 9;
    x.beginPath(); x.arc(CARD_W / 2, my, mr, 0, 7); x.stroke();
    x.strokeStyle = th.accent; x.lineWidth = 4;
    x.beginPath(); x.arc(CARD_W / 2, my, mr - 12, 0, 7); x.stroke();
    x.save();
    x.shadowColor = 'rgba(255,240,200,.8)'; x.shadowBlur = 6; x.shadowOffsetY = 3;
    drawGlyph(x, spec.glyph, CARD_W / 2, my, 280, th.band);
    x.restore();

    // título
    fitText(x, spec.titulo, CARD_W / 2, 722, CARD_W - 150, 150, 74, 44, FONT_TITLE, '#2a1a0d');
    x.strokeStyle = th.band; x.lineWidth = 3;
    x.beginPath(); x.moveTo(170, 878); x.lineTo(CARD_W - 170, 878); x.stroke();
    drawGlyph(x, 'star', CARD_W / 2, 878, 44, th.band);

    // brilho dourado das cartas raras
    if (spec.tema === 'rara' || spec.tema === 'pista') {
      x.save();
      x.strokeStyle = spec.tema === 'pista' ? '#ffd76a' : '#f4d675'; x.lineWidth = 10; x.strokeRect(30, 30, CARD_W - 60, CARD_H - 60);
      const foil = x.createLinearGradient(0, 0, CARD_W, CARD_H);
      foil.addColorStop(0, 'rgba(255,225,130,.2)');
      foil.addColorStop(.5, 'rgba(255,255,255,0)');
      foil.addColorStop(1, 'rgba(255,205,90,.24)');
      x.fillStyle = foil; x.fillRect(0, 0, CARD_W, CARD_H);
      x.restore();
    }

    // descrição
    fitText(x, spec.desc || '', CARD_W / 2, 898, CARD_W - 170, spec.ganho ? 250 : 330, 56, 32, FONT_BODY, '#33230f');

    // o que a escolha pode render
    if (spec.ganho) {
      x.textAlign = 'center'; x.fillStyle = th.band;
      x.font = `italic 42px ${FONT_BODY}`;
      x.fillText(spec.ganho, CARD_W / 2, CARD_H - 192);
    }

    // rodapé
    if (spec.rodape) {
      x.fillStyle = th.band;
      x.fillRect(50, CARD_H - 170, CARD_W - 100, 120);
      if (spec.rodapeGlyph) drawGlyph(x, spec.rodapeGlyph, 122, CARD_H - 110, 72, '#f2e3bd');
      fitText(x, spec.rodape, CARD_W / 2 + (spec.rodapeGlyph ? 36 : 0), CARD_H - 160, CARD_W - 240, 104, 46, 28, FONT_TITLE, '#f2e3bd');
    }

    // carta bloqueada: escurece e carimba o símbolo de quem a pode usar
    if (spec.locked) {
      x.fillStyle = 'rgba(16,10,6,.68)';
      x.fillRect(0, 0, CARD_W, CARD_H);
      drawGlyph(x, 'lock', CARD_W / 2, 450, 180, 'rgba(240,215,160,.95)');
      fitText(x, spec.lockText || 'Bloqueada', CARD_W / 2, 590, CARD_W - 200, 110, 54, 34, FONT_TITLE, '#f0d7a0');
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
        x.fillStyle = '#3a2412';
        x.beginPath(); x.moveTo(px - 5, ground - bh); x.lineTo(px + bw / 2, ground - bh - bw * .55); x.lineTo(px + bw + 5, ground - bh); x.closePath(); x.fill();
        x.fillRect(px + bw * .4, ground - bh * .5, bw * .18, bh * .24);
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

  const PAGE_W = 1024, PAGE_H = 1300;

  // Página esquerda: capítulo, título e desenho.
  function leftPage(p) {
    const [c, x] = canvas(PAGE_W, PAGE_H);
    paintParchment(x, PAGE_W, PAGE_H, '#e9dbb8');
    gutter(x, PAGE_W, PAGE_H, 'right');
    x.textAlign = 'center';
    x.fillStyle = '#6d1f1a';
    x.font = `600 40px ${FONT_TITLE}`;
    x.fillText((p.capitulo || '').toUpperCase(), PAGE_W / 2 - 20, 130);
    fitText(x, p.titulo || '', PAGE_W / 2 - 20, 160, PAGE_W - 200, 240, 80, 48, FONT_TITLE, '#2a1a0d');
    x.strokeStyle = '#6d1f1a'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(230, 410); x.lineTo(PAGE_W - 270, 410); x.stroke();
    if (p.arte) inkScene(x, p.arte, PAGE_W / 2 - 20, 750, PAGE_W - 230, 560);
    x.strokeStyle = '#3a2412'; x.lineWidth = 3;
    x.strokeRect(102, 464, PAGE_W - 244, 620);
    x.lineWidth = 1; x.strokeRect(112, 474, PAGE_W - 264, 600);
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
    const fichas = (p.rodape || '').split('  ·  ').filter(Boolean).map(t => ({ t, w: x.measureText(t).width + 56 }));
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
      const barra = (rot, val, max, cor, yy) => {
        x.textAlign = 'left'; x.fillStyle = '#2a1a0d';
        x.font = `600 42px ${FONT_TITLE}`;
        x.fillText(rot, marginL, yy);
        x.textAlign = 'right';
        x.font = `700 46px ${FONT_TITLE}`;
        x.fillText(`${val}/${max}`, marginL + maxW, yy);
        x.fillStyle = 'rgba(60,35,12,.3)'; x.fillRect(marginL, yy + 12, maxW, 26);
        x.fillStyle = cor; x.fillRect(marginL, yy + 12, maxW * Math.max(0, val) / Math.max(1, max), 26);
      };
      barra(`PV do inimigo`, c.pv, c.pvMax, '#7c1f1f', y);
      barra('A sua Vida', c.vida, c.vidaMax, '#2f5a33', y + 96);
      x.textAlign = 'left'; x.fillStyle = '#6d1f1a';
      x.font = `italic 44px ${FONT_BODY}`;
      x.fillText(`Ele: CA ${c.defesa}  ·  Ataca ${c.ataque >= 0 ? '+' : ''}${c.ataque}  ·  Dano ${c.dado}`, marginL, y + 192);
      x.fillStyle = '#2f5a33';
      x.fillText(`Você: CA ${c.ca}${c.escudo ? '  ·  Com escudo' : ''}`, marginL, y + 244);
      y += 274;
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
      x.font = `italic 44px ${FONT_BODY}`;
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
        x.fillText(f.t, fx + f.w / 2, fy + 60);
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

  function buildMapBase() {
    const [c, x] = canvas(MAP_W, MAP_H);
    paintParchment(x, MAP_W, MAP_H, '#dcc899');
    const W = MAP_W, H = MAP_H;

    const azul = 'rgba(70,110,120,.42)';

    // O mar. Só os pontos na costa tremem: os da moldura ficam onde estão.
    x.beginPath();
    MAPA.mar.forEach(([a, b], i) => {
      const borda = a === 0 || a === 1 || b === 0 || b === 1;
      const px = W * a + (borda ? 0 : (Math.random() - .5) * 18), py = H * b + (borda ? 0 : (Math.random() - .5) * 18);
      if (i) x.lineTo(px, py); else x.moveTo(px, py);
    });
    x.closePath();
    x.fillStyle = azul; x.fill();
    x.lineWidth = 7; x.strokeStyle = '#3a2412'; x.stroke();
    x.save(); x.clip();
    x.strokeStyle = 'rgba(30,60,70,.42)'; x.lineWidth = 3;
    for (let r = 0; r < 640; r++) {
      const px = Math.random() * W, py = Math.random() * H;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + 22, py - 12, px + 44, py); x.quadraticCurveTo(px + 66, py + 12, px + 88, py); x.stroke();
    }
    x.restore();

    // Ilhas e lagos
    (MAPA.ilhas || []).forEach(i => {
      x.beginPath(); x.ellipse(W * i.x, H * i.y, W * i.rx, H * i.ry, .3, 0, 7);
      x.fillStyle = i.cor; x.fill();
      x.lineWidth = 7; x.strokeStyle = '#3a2412'; x.stroke();
    });
    (MAPA.lagos || []).forEach(l => {
      x.beginPath(); x.ellipse(W * l.x, H * l.y, W * l.rx, H * l.ry, 0, 0, 7);
      x.fillStyle = 'rgba(70,110,120,.6)'; x.fill();
      x.lineWidth = 5; x.strokeStyle = '#3a2412'; x.stroke();
    });
    (MAPA.rios || []).forEach(rio => {
      x.beginPath();
      rio.forEach(([a, b], i) => (i ? x.lineTo(W * a, H * b) : x.moveTo(W * a, H * b)));
      x.lineCap = 'round'; x.lineJoin = 'round';
      x.lineWidth = 17; x.strokeStyle = '#3a2412'; x.stroke();
      x.lineWidth = 10; x.strokeStyle = '#7c9ca2'; x.stroke();
    });

    // Serras
    const mountain = (mx, my, s) => {
      x.fillStyle = '#d6c08f';
      x.beginPath(); x.moveTo(mx - s, my); x.lineTo(mx, my - s * 1.25); x.lineTo(mx + s, my); x.closePath(); x.fill();
      x.strokeStyle = '#3a2412'; x.lineWidth = 5; x.stroke();
      x.lineWidth = 2.6;
      for (let i = 1; i < s / 9; i++) { x.beginPath(); x.moveTo(mx + i * 4, my - s * 1.25 + i * 10); x.lineTo(mx + i * 7.4, my - 3); x.stroke(); }
    };
    MAPA.serras.forEach(z => {
      const ridge = [];
      for (let i = 0; i < z.n; i++) ridge.push([W * (z.x + Math.random() * z.w), H * (z.y + Math.random() * z.h)]);
      ridge.sort((a, b) => a[1] - b[1]).forEach(([a, b]) => mountain(a, b + 60, 46 + Math.random() * 44));
    });

    // Florestas
    const tree = (tx, ty, s) => {
      x.fillStyle = '#4e6b3c';
      x.beginPath(); x.moveTo(tx, ty - s); x.lineTo(tx - s * .46, ty); x.lineTo(tx + s * .46, ty); x.closePath(); x.fill();
      x.strokeStyle = '#26361e'; x.lineWidth = 3; x.stroke();
    };
    MAPA.florestas.forEach(z => {
      const forest = [];
      for (let i = 0; i < z.n; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random());
        forest.push([W * (z.x + Math.cos(a) * r * z.rx), H * (z.y + Math.sin(a) * r * z.ry)]);
      }
      forest.sort((a, b) => a[1] - b[1]).forEach(([a, b]) => tree(a, b, 34 + Math.random() * 22));
    });

    // Pântanos
    x.strokeStyle = '#34452c'; x.lineWidth = 3;
    MAPA.pantanos.forEach(z => {
      for (let i = 0; i < z.n; i++) {
        const a = Math.random() * 6.28, r = Math.sqrt(Math.random());
        const px = W * (z.x + Math.cos(a) * r * z.rx), py = H * (z.y + Math.sin(a) * r * z.ry);
        x.beginPath(); x.moveTo(px - 14, py); x.lineTo(px + 14, py); x.moveTo(px - 5, py); x.lineTo(px - 9, py - 16); x.moveTo(px + 4, py); x.lineTo(px + 8, py - 18); x.stroke();
      }
    });

    // Estradas
    x.strokeStyle = '#6b3f1d'; x.lineWidth = 7; x.setLineDash([22, 16]); x.lineCap = 'round';
    for (const [a, b] of ESTRADAS) {
      const A = LUGARES[a], B = LUGARES[b];
      const C = controloDaEstrada(A, B);
      x.beginPath(); x.moveTo(A.x * W, A.y * H); x.quadraticCurveTo(C.x * W, C.y * H, B.x * W, B.y * H); x.stroke();
    }
    x.setLineDash([]);

    // Moldura e rosa dos ventos
    x.strokeStyle = '#3a2412'; x.lineWidth = 14; x.strokeRect(40, 40, W - 80, H - 80);
    x.lineWidth = 4; x.strokeRect(68, 68, W - 136, H - 136);
    drawGlyph(x, 'star', W * .92, H * .18, 240, '#6d1f1a');
    x.fillStyle = '#3a2412'; x.textAlign = 'center';
    x.font = `700 58px ${FONT_TITLE}`;
    x.fillText('N', W * .92, H * .18 - 134);
    x.font = `700 72px ${FONT_TITLE}`;
    x.fillText(MAPA.titulo, W * MAPA.tituloX, H * .94);
    mapBases[MAPA.titulo] = c;
  }

  // visitados: lista ordenada de chaves de LUGARES; destaque: chaves a realçar.
  function mapTexture(tex, visitados = [], destaque = [], suspeitos = [], rasto = null) {
    if (!mapBases[MAPA.titulo]) buildMapBase();
    const [c, x] = tex ? [tex.image, tex.image.getContext('2d')] : canvas(MAP_W, MAP_H);
    x.drawImage(mapBases[MAPA.titulo], 0, 0);

    // Trilho percorrido
    x.strokeStyle = '#a4161a'; x.lineWidth = 15; x.lineCap = 'round'; x.lineJoin = 'round';
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
      if (p.cidade) drawGlyph(x, 'tower', px, py - 12, 92, '#2a1a0d');
      else {
        x.fillStyle = visitados.includes(key) ? '#a4161a' : '#2a1a0d';
        x.beginPath(); x.arc(px, py, 19, 0, 7); x.fill();
        x.strokeStyle = '#e9dbb8'; x.lineWidth = 5; x.stroke();
      }
      if (rasto && rasto.key === key) {
        // Cada ponto é um dia: os cheios ainda faltam, os vazios já passaram.
        const n = Math.max(rasto.total, rasto.dias), raio = 118;
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / n, cheio = i < rasto.dias;
          x.beginPath(); x.arc(px + Math.cos(a) * raio, py + Math.sin(a) * raio, 26, 0, 7);
          x.fillStyle = cheio ? '#a4161a' : 'rgba(233,219,184,.75)'; x.fill();
          x.strokeStyle = cheio ? '#f2e3bd' : '#a4161a'; x.lineWidth = 5; x.stroke();
        }
        drawGlyph(x, 'eye', px, py - 196, 104, '#a4161a');
      } else if (suspeitos.includes(key)) {
        x.strokeStyle = '#a4161a'; x.lineWidth = 9;
        x.beginPath(); x.arc(px, py, 58, 0, 7); x.stroke();
        drawGlyph(x, 'eye', px, py - 96, 64, '#a4161a');
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
    speckle(x, c.width, c.height, 1800, .1);
    x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle';
    labels.forEach((l, i) => {
      const px = (i % cols + .5) * cell, py = (Math.floor(i / cols) + .5) * cell;
      x.font = `700 ${l.length > 1 ? 66 : 82}px ${FONT_TITLE}`;
      x.fillText(l, px, py);
      if (l === '6' || l === '9') x.fillRect(px - 20, py + 36, 40, 7);
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
    x.fillStyle = '#efe2bd';
    x.beginPath(); x.arc(128, 128, 118, 0, 7); x.fill();
    x.strokeStyle = cor; x.lineWidth = 16;
    x.beginPath(); x.arc(128, 128, 112, 0, 7); x.stroke();
    x.strokeStyle = '#2a1a0d'; x.lineWidth = 4;
    x.beginPath(); x.arc(128, 128, 122, 0, 7); x.stroke();
    drawGlyph(x, glyph, 128, 128, 150, cor === '#d8c27a' ? '#8a6414' : cor);
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
  function characterBoard(lugares, escala, ox, oz, w, h) {
    const [c, x] = canvas(Math.round(w * escala), Math.round(h * escala));
    x.fillStyle = '#21140b'; x.fillRect(0, 0, c.width, c.height);
    speckle(x, c.width, c.height, 26000, .35);
    x.strokeStyle = '#c9a24a'; x.lineWidth = 12; x.strokeRect(14, 14, c.width - 28, c.height - 28);
    x.lineWidth = 3; x.strokeRect(32, 32, c.width - 64, c.height - 64);
    const cw = CARTA_TAB.w * escala, ch = CARTA_TAB.h * escala;
    lugares.forEach(l => {
      const px = (l.x - ox) * escala, py = (l.z - oz) * escala;
      x.fillStyle = 'rgba(0,0,0,.42)'; x.fillRect(px - cw / 2, py - ch / 2, cw, ch);
      x.strokeStyle = 'rgba(216,180,94,.6)'; x.lineWidth = 4; x.setLineDash([16, 12]);
      x.strokeRect(px - cw / 2, py - ch / 2, cw, ch);
      x.setLineDash([]);
      drawGlyph(x, l.glyph, px, py - 34, 170, 'rgba(216,180,94,.42)');
      x.fillStyle = 'rgba(242,227,189,.82)'; x.textAlign = 'center';
      x.font = `600 40px ${FONT_TITLE}`;
      x.fillText(l.nome, px, py + 128);
    });
    return toTexture(c, renderer);
  }

  function pageEdge() {
    const [c, x] = canvas(256, 64);
    x.fillStyle = '#d9c9a2'; x.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 64; i += 2) { x.fillStyle = `rgba(90,60,30,${Math.random() * .4})`; x.fillRect(0, i, 256, 1); }
    return toTexture(c, renderer);
  }

  return { characterBoard, wood, leather, cardBack, cardFace, leftPage, rightPage, mapTexture, diceAtlas, diceAtlasTema, glowSprite, pinFace, pageEdge, CARD_W, CARD_H };
}
