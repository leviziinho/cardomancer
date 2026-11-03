// A mesa 3D: adereços, luz, câmara, cartas, dados e animações.

const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const wait = s => new Promise(r => setTimeout(r, s * 1000));

const tweens = [];
function tween(dur, onUpdate, { delay = 0, ease = easeInOut } = {}) {
  return new Promise(resolve => tweens.push({ t: -delay, dur, onUpdate, ease, resolve }));
}
function runTweens(dt) {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt;
    if (tw.t < 0) continue;
    const p = Math.min(1, tw.t / tw.dur);
    tw.onUpdate(tw.ease(p), p);
    if (p >= 1) { tweens.splice(i, 1); tw.resolve(); }
  }
}

const sfx = (() => {
  let ac = null, muted = false;
  function noise(dur, freq, gain, q = 1) {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      const src = ac.createBufferSource(); src.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
      const g = ac.createGain(); g.gain.value = gain;
      src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
    } catch (e) { /* som é opcional */ }
  }
  function tone(freq, dur, gain, delay = 0, type = 'triangle') {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + delay;
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + .02);
      g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* som é opcional */ }
  }
  // Papel a deslizar: entra e sai devagar, sem os estalidos de um ruído seco.
  function swish(dur, de, ate, gain) {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      let suave = 0;
      for (let i = 0; i < len; i++) { suave += ((Math.random() * 2 - 1) - suave) * .35; d[i] = suave * Math.sin(Math.PI * i / len); }
      const src = ac.createBufferSource(); src.buffer = buf;
      const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = .4;
      f.frequency.setValueAtTime(de, ac.currentTime);
      f.frequency.exponentialRampToValueAtTime(ate, ac.currentTime + dur);
      const g = ac.createGain(); g.gain.value = gain;
      src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
    } catch (e) { /* som é opcional */ }
  }
  return {
    card: () => swish(.2, 1500, 500, .3),
    hover: () => swish(.09, 700, 350, .1),
    page: () => noise(.32, 1500, .2, .6),
    dice: () => noise(.07, 4200, .4, 3),
    coin: () => noise(.1, 6500, .13, 6),
    hit: () => noise(.25, 240, .6),
    critico: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, .5, .13, i * .09)); noise(.5, 5200, .18, 2); },
    falha: () => { [196, 147, 98].forEach((f, i) => tone(f, .6, .2, i * .13, 'sawtooth')); noise(.6, 140, .8); },
    toggle: () => (muted = !muted),
  };
})();

const CARD = { w: 3.3, h: 4.62 };
const NITIDEZ = { fpsMinimo: 24 };
const TILT = -1.15;
const FACE_DOWN = Math.PI / 2;
const FACE_UP = -Math.PI / 2;

// Tudo acontece à volta do mapa, com a câmara sempre no mesmo sítio.
const CX = -20;
const AREA = {
  book: { pageW: 6.2, pageH: 8 },
  map: { x: CX, z: -1, w: 15, h: 10.7 },
};
const VISTA = { pos: [CX, 25, 11.5], look: [CX, 0, 2.2] };
// O livro flutua à frente da câmara, e as cartas aproximam-se ainda mais para se lerem.
const LIVRO = { d: 14, y: 1.62, s: .54 };
const ZOOM = { d: 9.5, s: .85 };
// As cartas viradas para os olhos, para não ficarem achatadas.
const DE_FRENTE = -Math.atan2(VISTA.pos[1] - VISTA.look[1], VISTA.pos[2] - VISTA.look[2]);
const BARALHO = [CX + 11.4, 0, 4.7];
// Num ecrã baixo o livro e a mão ficam lado a lado, porque um por cima do outro não se liam.
const ecraPequeno = () => innerHeight < 500 && innerWidth > innerHeight;
// De pé, só para quem o pediu: a página lê-se como texto e a mesa mostra só o mapa.
const ecraVertical = () => document.body.classList.contains('vertical') && innerHeight > innerWidth;
const eTelemovel = () => matchMedia('(pointer: coarse)').matches && Math.min(innerWidth, innerHeight) < 500;

// O tabuleiro da personagem, à esquerda do mapa.
const TABULEIRO = { x: CX - 11, z: -.7, w: 6.3, h: 11.2 };
const lugarTabuleiro = (col, lin) => ({ x: CX - 13.05 + col * 2.05, z: -4.75 + lin * 2.7 });

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function createWorld(canvasEl) {
  // No telemóvel o jogo aquecia e chegava a bloquear: menos píxeis, menos luzes e menos imagens por segundo.
  const LEVE = eTelemovel();
  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !LEVE });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  // Parada, a mesa não precisa de refazer as sombras a cada imagem.
  if (LEVE) renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070403);
  scene.fog = new THREE.Fog(0x070403, 42, 90);

  const camera = new THREE.PerspectiveCamera(32, 1, 2, 150);
  scene.add(camera);
  const tex = textures(renderer);

  // Ambiente para os metais e o vidro terem o que refletir.
  (function environment() {
    const env = new THREE.Scene();
    env.background = new THREE.Color(0x2a1a10);
    const glow = (color, x, y, z, s) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 12), new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, z); env.add(m);
    };
    glow(0xffc488, 6, 9, 4, 4.6);
    glow(0xff9a4c, -8, 4, -5, 3.2);
    glow(0xffe0b0, 0, 12, -3, 3.4);
    glow(0x7a98c0, -4, 8, 8, 2);
    glow(0x3a2212, 0, -8, 0, 7);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.03).texture;
    pm.dispose();
  })();

  // Luz
  scene.add(new THREE.HemisphereLight(0xffe2bd, 0x1c0e05, 0.2));
  const key = new THREE.SpotLight(0xffdcae, 3.3, 0, 0.95, 0.72, 0);
  key.position.set(CX, 38, 12);
  key.target.position.set(CX, 0, 0);
  key.castShadow = true;
  key.shadow.camera.near = 10; key.shadow.camera.far = 60;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = .02;
  scene.add(key, key.target);
  // Um fio de luz fria por trás, para o metal e o vidro ganharem contorno.
  const contraluz = new THREE.DirectionalLight(0x8fb0d8, .32);
  contraluz.position.set(CX - 22, 12, -24);
  contraluz.target.position.set(CX, 0, 0);
  scene.add(contraluz, contraluz.target);

  // Mesa
  const wood = tex.wood();
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(130, 90),
    new THREE.MeshStandardMaterial({ map: wood.map, normalMap: wood.normal, normalScale: new THREE.Vector2(.5, .5), roughnessMap: wood.rough, roughness: 1, metalness: 0.02, envMapIntensity: 0.5 })
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  scene.add(table);

  const shadowed = m => { m.castShadow = true; m.receiveShadow = true; return m; };
  const leatherRed = tex.leather('#4a1712');
  const leatherGreen = tex.leather('#1f3a2c');
  const leatherBlue = tex.leather('#1d2642');
  const grao = tex.relevoCouro();
  const couro = map => new THREE.MeshStandardMaterial({ map, normalMap: grao, normalScale: new THREE.Vector2(.7, .7), roughness: .6 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9994a, metalness: 1, roughness: 0.3 });

  // Sombra de contacto: onde um objeto toca na mesa, a luz não chega.
  const texSombra = tex.sombraSuave();
  function sombraDe(x, z, w, h = w) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false, toneMapped: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, .006, z);
    scene.add(m);
    return m;
  }

  // Pasta de couro cosida, onde o mapa assenta.
  (function pasta() {
    const W = 16.4, H = 12, z = AREA.map.z;
    const m = new THREE.Mesh(new THREE.BoxGeometry(W, .06, H), couro(leatherGreen));
    m.position.set(CX, -.015, z);
    m.receiveShadow = true;
    scene.add(m);
    const pontos = [], passo = .26, folga = .22;
    for (let a = -W / 2 + folga; a < W / 2 - folga; a += passo) pontos.push([a, -H / 2 + folga, 0], [a, H / 2 - folga, 0]);
    for (let b = -H / 2 + folga; b < H / 2 - folga; b += passo) pontos.push([-W / 2 + folga, b, 1], [W / 2 - folga, b, 1]);
    const cosido = new THREE.InstancedMesh(new THREE.BoxGeometry(.16, .012, .035), new THREE.MeshStandardMaterial({ color: 0xc9a25a, roughness: .7 }), pontos.length);
    const d = new THREE.Object3D();
    pontos.forEach(([a, b, vira], i) => {
      d.position.set(CX + a, .018, z + b); d.rotation.y = vira * Math.PI / 2; d.updateMatrix();
      cosido.setMatrixAt(i, d.matrix);
    });
    scene.add(cosido);
  })();

  // ---- Livro flutuante ----
  const book = (() => {
    const g = new THREE.Group();
    const { pageW: W, pageH: H } = AREA.book;
    const base = 0.42, bulge = 0.3;
    const curve = u => base + bulge * Math.sin(Math.PI * Math.pow(Math.min(1, u), 0.62));

    // A metade esquerda roda sobre a lombada para o livro fechar.
    const hinge = new THREE.Group();
    g.add(hinge);
    const coverMat = couro(leatherRed);
    const coverHalf = sign => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(W + 0.28, 0.16, H + 0.42), coverMat);
      m.position.set(sign * (W + 0.28) / 2, 0.08, 0);
      return m;
    };
    g.add(coverHalf(1));
    hinge.add(coverHalf(-1));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.62), brass);
      corner.position.set(a * (W + 0.03), 0.08, b * (H / 2 - 0.1));
      (a < 0 ? hinge : g).add(corner);
    });

    const edge = tex.pageEdge();
    edge.wrapS = edge.wrapT = THREE.RepeatWrapping;
    const edgeMat = new THREE.MeshStandardMaterial({ map: edge, roughness: 0.92, side: THREE.DoubleSide });
    const profile = sign => {
      const s = new THREE.Shape();
      s.moveTo(0, 0); s.lineTo(sign * W, 0);
      for (let i = 24; i >= 0; i--) { const u = i / 24; s.lineTo(sign * u * W, curve(u)); }
      s.lineTo(0, 0);
      const geo = new THREE.ExtrudeGeometry(s, { depth: H, bevelEnabled: false, curveSegments: 1 });
      geo.translate(0, 0.16, -H / 2);
      return new THREE.Mesh(geo, edgeMat);
    };
    g.add(profile(1));
    hinge.add(profile(-1));

    // As páginas têm luz própria: o livro está longe das velas.
    const paginas = [];
    const pageMat = () => {
      const m = new THREE.MeshBasicMaterial({ color: 0xf4ecd8, toneMapped: false });
      paginas.push(m);
      return m;
    };
    const luzDasPaginas = k => paginas.forEach(m => m.color.set(0xf4ecd8).multiplyScalar(k));
    const surface = (sign, parent) => {
      const geo = new THREE.PlaneGeometry(W, H, 36, 1);
      geo.rotateX(-Math.PI / 2);
      geo.translate(sign * W / 2, 0, 0);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = Math.abs(pos.getX(i)) / W;
        pos.setY(i, 0.165 + curve(u));
      }
      const m = new THREE.Mesh(geo, pageMat());
      parent.add(m);
      return m;
    };
    const left = surface(-1, hinge), right = surface(1, g);

    // Folha que vira
    const flip = new THREE.Group();
    flip.position.y = 0.62;
    flip.visible = false;
    const fGeoF = new THREE.PlaneGeometry(W, H);
    fGeoF.rotateX(-Math.PI / 2); fGeoF.translate(W / 2, 0, 0);
    const fGeoB = new THREE.PlaneGeometry(W, H);
    const uv = fGeoB.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, 1 - uv.getX(i), 1 - uv.getY(i));
    fGeoB.rotateX(Math.PI / 2); fGeoB.translate(W / 2, -0.004, 0);
    const fFront = new THREE.Mesh(fGeoF, pageMat());
    const fBack = new THREE.Mesh(fGeoB, pageMat());
    flip.add(fFront, fBack);
    g.add(flip);

    // Fita a marcar a página, a sair por baixo do livro.
    const fita = new THREE.Mesh(new THREE.BoxGeometry(.3, .02, .7), new THREE.MeshStandardMaterial({ color: 0x8f1d1a, roughness: .55 }));
    fita.position.set(.5, .2, H / 2 + .3);
    g.add(fita);

    g.rotation.x = Math.PI / 2;
    g.position.set(0, LIVRO.y, -LIVRO.d);
    g.scale.setScalar(.001);
    g.visible = false;
    camera.add(g);
    const luz = new THREE.PointLight(0xffe2bd, 30, 10, 2);
    luz.position.set(0, LIVRO.y + 1, -LIVRO.d + 5);
    camera.add(luz);

    let aberto = false, fila = Promise.resolve();
    const emFila = fn => (fila = fila.then(fn));
    const dobra = e => { hinge.rotation.z = -Math.PI * e; hinge.position.y = 1.2 * e; };
    dobra(1);

    const mostra = t => g.scale.setScalar(.001 + (LIVRO.s - .001) * t);
    async function fechar() {
      if (!aberto) return;
      aberto = false;
      await tween(.22, dobra);
      await tween(.14, e => { mostra(1 - e); g.position.y = LIVRO.y - 1.2 * e; });
      g.visible = false;
    }
    async function abrir() {
      if (aberto || !right.material.map) return;
      g.visible = !LIVRO.oculto;
      await tween(.14, e => { mostra(e); g.position.y = LIVRO.y - 1.2 * (1 - e); });
      await tween(.22, e => dobra(1 - e));
      aberto = true;
    }

    // Procura uma palavra clicável na página direita a partir do ponto tocado.
    function linkAt(uv) {
      const map = right.material.map;
      const links = map && map.userData.links;
      if (!aberto || !links || flip.visible) return null;
      const x = uv.x * map.image.width, y = (1 - uv.y) * map.image.height;
      return links.find(l => x >= l.x && x <= l.x + l.w && y >= l.y && y <= l.y + l.h) || null;
    }

    const poe = (m, t) => { m.material.map = t; m.material.needsUpdate = true; };
    async function vira(pages) {
      const oldL = left.material.map, oldR = right.material.map;
      const newL = tex.leftPage(pages), newR = tex.rightPage(pages);
      if (!aberto) {
        poe(left, newL); poe(right, newR);
        oldL && oldL.dispose(); oldR && oldR.dispose();
        await abrir();
        return;
      }
      poe(fFront, oldR); poe(fBack, newL); poe(right, newR);
      flip.rotation.z = 0; flip.visible = true;
      sfx.page();
      await tween(0.45, e => {
        flip.rotation.z = e * Math.PI;
        flip.position.y = 0.62 + Math.sin(e * Math.PI) * 0.15;
      });
      poe(left, newL);
      flip.visible = false;
      oldL && oldL.dispose(); oldR && oldR.dispose();
    }
    return {
      group: g, linkAt, rightSurface: right, luzDasPaginas, luz,
      turn: pages => emFila(() => vira(pages)),
      fechar: () => emFila(fechar),
      abrir: () => emFila(abrir),
      get aberto() { return aberto; },
    };
  })();

  // ---- Mapa ----
  const mapPlane = (() => {
    const { w: W, h: H } = AREA.map;
    const geo = new THREE.PlaneGeometry(W, H, 60, 44);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const dx = Math.abs(pos.getX(i)) / (W / 2), dz = Math.abs(pos.getZ(i)) / (H / 2);
      const curl = Math.pow(Math.max(0, dx - .86) / .14, 2) * .24 + Math.pow(Math.max(0, dz - .9) / .1, 2) * .07;
      const wob = Math.sin(pos.getX(i) * 1.1) * Math.cos(pos.getZ(i) * .9) * .012;
      pos.setY(i, 0.03 + curl + wob);
    }
    geo.computeVertexNormals();
    const texMap = tex.mapTexture(null);
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: texMap, normalMap: tex.relevoMapa(), normalScale: new THREE.Vector2(.55, .55), alphaTest: .5, roughness: 0.88, envMapIntensity: 0.15, side: THREE.DoubleSide }));
    m.receiveShadow = true; m.castShadow = true;
    m.position.set(AREA.map.x, 0, AREA.map.z);
    scene.add(m);
    // Tachas de latão nos cantos.
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const tacha = shadowed(new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 10), brass));
      tacha.scale.y = .5;
      tacha.position.set(AREA.map.x + a * (W / 2 - .4), .15, AREA.map.z + b * (H / 2 - .34));
      scene.add(tacha);
    });
    return m;
  })();
  const pontoNoMapa = p => new THREE.Vector3(AREA.map.x + (p.x - .5) * AREA.map.w, 0.05, AREA.map.z + (p.y - .5) * AREA.map.h);
  const mapToWorld = key => pontoNoMapa(LUGARES[key]);
  const updateMap = (visitados, destaque, suspeitos, rasto, rumo) => tex.mapTexture(mapPlane.material.map, visitados, destaque, suspeitos, rasto, rumo);

  // ---- Tabuleiro da personagem ----
  (function tabuleiro() {
    const { x, z, w, h } = TABULEIRO;
    const nomes = [
      ['Classe', 'star'], ['Raça', 'person'], ['Origem', 'scroll'],
      ['Arma', 'sword'], ['Armadura', 'shield'], ['Acessório', 'seal'],
      ['Mochila', 'bag'], ['Mochila', 'bag'], ['Mochila', 'bag'],
    ];
    const lugares = nomes.map(([nome, glyph], i) => ({ nome, glyph, ...lugarTabuleiro(i % 3, Math.floor(i / 3)) }));
    const covas = [
      { x: CX - 12.52, z: 3.55, w: 2.75, h: 2.1 },
      { x: CX - 9.42, z: 3.55, w: 2.75, h: 2.1 },
    ];
    const { map, normal } = tex.characterBoard(lugares, covas, 200, x - w / 2, z - h / 2, w, h);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, normalMap: normal, roughness: .74, envMapIntensity: .25 }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, .02, z);
    m.receiveShadow = true;
    scene.add(m);

    // Moldura de madeira com cantos de latão, à volta das covas.
    const e = .3, fora = roundedRect(w + e * 2, h + e * 2, .12), buraco = new THREE.Path();
    buraco.moveTo(-w / 2, -h / 2); buraco.lineTo(-w / 2, h / 2); buraco.lineTo(w / 2, h / 2); buraco.lineTo(w / 2, -h / 2); buraco.closePath();
    fora.holes.push(buraco);
    const geo = new THREE.ExtrudeGeometry(fora, { depth: .2, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2, curveSegments: 6 });
    geo.rotateX(-Math.PI / 2);
    const veios = wood.map.clone();
    veios.needsUpdate = true;
    veios.repeat.set(.05, .05);
    const normaisVeios = wood.normal.clone();
    normaisVeios.needsUpdate = true;
    normaisVeios.repeat.set(.05, .05);
    const moldura = shadowed(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: veios, normalMap: normaisVeios, color: 0xa88c6c, roughness: .46, envMapIntensity: .55 })));
    moldura.position.set(x, .05, z);
    scene.add(moldura);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const canto = shadowed(new THREE.Mesh(new THREE.BoxGeometry(.56, .3, .56), brass));
      canto.position.set(x + a * (w / 2 + e - .14), .16, z + b * (h / 2 + e - .14));
      scene.add(canto);
    });
    sombraDe(x, z, w + 3, h + 3);
  })();

  // Pino de viagem: a cor e o símbolo são os da classe.
  const pinLac = new THREE.MeshPhysicalMaterial({ color: 0x9c1414, roughness: 0.3, metalness: 0.1, clearcoat: .8, clearcoatRoughness: .12 });
  const pinFace = new THREE.SpriteMaterial({ transparent: true, depthWrite: false });
  const pin = (() => {
    const g = new THREE.Group();
    const pts = [[0, 0], [.34, 0], [.36, .07], [.24, .14], [.13, .3], [.1, .74], [.2, .84], [.09, .9]].map(p => new THREE.Vector2(p[0], p[1]));
    g.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 32), pinLac)));
    const colar = new THREE.Mesh(new THREE.TorusGeometry(.13, .035, 10, 26), brass);
    colar.rotation.x = Math.PI / 2;
    colar.position.y = .74;
    g.add(colar);
    const face = new THREE.Sprite(pinFace);
    face.position.y = 1.35;
    face.scale.set(.95, .95, 1);
    g.add(face);
    g.scale.setScalar(1.25);
    g.visible = false;
    scene.add(g);
    return g;
  })();
  function setPin(cor, glyph, lugar) {
    pinLac.color.set(cor);
    pinFace.map = tex.pinFace(glyph, '#' + cor.toString(16).padStart(6, '0'));
    pinFace.needsUpdate = true;
    pin.position.copy(mapToWorld(lugar));
    pin.visible = true;
  }
  // Um troço de estrada, de t0 a t1: 0 é a origem, 1 é o destino, .5 é o meio do caminho.
  async function movePinTroco(a, b, t0 = 0, t1 = 1) {
    const dur = Math.max(.4, mapToWorld(a).distanceTo(mapToWorld(b)) * .17 * (t1 - t0));
    await tween(dur, e => {
      pin.position.copy(pontoNoMapa(pontoDaEstrada(a, b, t0 + (t1 - t0) * e)));
      pin.position.y += Math.abs(Math.sin(e * Math.PI * 3 * (t1 - t0))) * .3;
    });
    sfx.coin();
  }
  async function movePin(path) {
    for (let i = 1; i < path.length; i++) await movePinTroco(path[i - 1], path[i]);
  }

  // ---- Adereços ----
  const candles = [];
  const texChama = tex.chama();
  function candle(x, z, h = 2.7) {
    sombraDe(x, z, 3.2);
    const g = new THREE.Group();
    const dish = [[0, 0], [.72, 0], [.78, .05], [.74, .13], [.28, .16], [.2, .32], [.26, .38], [0, .38]].map(p => new THREE.Vector2(p[0], p[1]));
    g.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(dish, 36), brass)));
    // Cera escorrida: o cilindro incha em gotas que ficam mais grossas em baixo.
    const fase = Math.random() * 6;
    const geoCera = new THREE.CylinderGeometry(.2, .24, h, 32, 14);
    {
      const p = geoCera.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const a = Math.atan2(p.getZ(i), p.getX(i)), v = p.getY(i) / h + .5;
        const gota = Math.pow(Math.max(0, Math.sin(a * 5 + fase) * Math.sin(a * 2 - fase)), 2);
        const k = 1 + gota * .34 * Math.max(0, 1 - v * 1.25) + Math.sin(a * 11 + fase) * .012;
        p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k);
      }
      geoCera.computeVertexNormals();
    }
    const wax = shadowed(new THREE.Mesh(geoCera, new THREE.MeshStandardMaterial({ color: 0xe8d8b5, roughness: .42, emissive: 0x7a3a0c, emissiveIntensity: .3, envMapIntensity: .6 })));
    wax.position.y = .36 + h / 2;
    g.add(wax);
    const poca = new THREE.Mesh(new THREE.CircleGeometry(.17, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.3, .55) }));
    poca.rotation.x = -Math.PI / 2;
    poca.position.y = .36 + h + .004;
    g.add(poca);
    const pavio = new THREE.Mesh(new THREE.CylinderGeometry(.014, .018, .16, 6), new THREE.MeshBasicMaterial({ color: 0x140b06 }));
    pavio.position.y = .36 + h + .07;
    g.add(pavio);
    const flameY = .36 + h + .24;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.glowSprite(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .75 }));
    sprite.position.y = flameY; sprite.scale.set(1.5, 2.1, 1);
    g.add(sprite);
    const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: texChama, color: new THREE.Color(5, 3.4, 1.9), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    flame.position.y = flameY + .08;
    g.add(flame);
    const light = new THREE.PointLight(0xffa458, 38, 26, 2);
    light.position.y = flameY + .2;
    if (!LEVE) g.add(light);
    g.position.set(x, 0, z);
    scene.add(g);
    candles.push({ sprite, light, flame, seed: Math.random() * 40 });
  }
  candle(CX + 14.4, -6.9, 2.6);
  candle(CX - 15.8, -7.4, 2.6);
  candle(CX + 11.8, 8.2, 1.5);

  function bookStack(x, z, rot) {
    const g = new THREE.Group();
    let y = 0;
    [[5.2, .62, 3.6, leatherGreen, .06], [4.6, .5, 3.3, leatherBlue, -.13], [3.9, .7, 2.9, leatherRed, .2]].forEach(([w, h, d, map, r]) => {
      const cover = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), couro(map)));
      cover.position.y = y + h / 2; cover.rotation.y = r;
      g.add(cover);
      const pages = new THREE.Mesh(new THREE.BoxGeometry(w - .18, h - .13, d + .02), new THREE.MeshStandardMaterial({ color: 0xd9c9a2, roughness: .9 }));
      pages.position.set(.12, y + h / 2, 0); pages.rotation.y = r;
      g.add(pages);
      const band = new THREE.Mesh(new THREE.BoxGeometry(.1, h + .01, d + .01), brass);
      band.position.set(-w / 2 + .4, y + h / 2, 0); band.rotation.y = r;
      g.add(band);
      y += h;
    });
    g.position.set(x, 0, z); g.rotation.y = rot;
    scene.add(g);
  }
  sombraDe(CX + 13.5, -11.5, 8, 6.5);
  bookStack(CX + 13.5, -11.5, .32);

  // Cálice
  (function goblet() {
    const pts = [[0, 0], [.55, 0], [.6, .05], [.2, .16], [.12, .6], [.14, .9], [.44, 1.15], [.56, 1.72], [.52, 1.74], [.4, 1.2], [0, 1.0]].map(p => new THREE.Vector2(p[0], p[1]));
    const m = shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), brass.clone()));
    m.material.side = THREE.DoubleSide;
    m.position.set(CX - 11.6, 0, 8.3);
    m.scale.setScalar(1.25);
    scene.add(m);
    const vinho = new THREE.Mesh(new THREE.CircleGeometry(.46, 32), new THREE.MeshStandardMaterial({ color: 0x7a0e16, roughness: .07, metalness: 0, envMapIntensity: 1.8 }));
    vinho.rotation.x = -Math.PI / 2;
    vinho.position.y = 1.46;
    m.add(vinho);
    const bordo = new THREE.Mesh(new THREE.TorusGeometry(.545, .028, 10, 44), brass);
    bordo.rotation.x = Math.PI / 2;
    bordo.position.y = 1.73;
    m.add(bordo);
    sombraDe(CX - 11.6, 8.3, 3);
  })();

  // Tinteiro e pena
  (function tinteiro() {
    const x = CX - 13.4, z = 6.4;
    sombraDe(x, z, 2.1);
    const pts = [[0, 0], [.46, 0], [.5, .05], [.5, .42], [.42, .54], [.2, .6], [.2, .72], [.26, .75], [.15, .76], [.12, .6], [0, .58]].map(p => new THREE.Vector2(p[0], p[1]));
    const vidro = shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 28), new THREE.MeshPhysicalMaterial({ color: 0x14202c, roughness: .1, metalness: .1, clearcoat: 1, envMapIntensity: 1.6 })));
    vidro.position.set(x, 0, z);
    scene.add(vidro);
    const contorno = new THREE.Shape();
    contorno.moveTo(0, 0);
    contorno.bezierCurveTo(.3, .5, .34, 1.7, .05, 2.9);
    contorno.bezierCurveTo(-.2, 1.9, -.2, .7, 0, 0);
    const geoPena = new THREE.ShapeGeometry(contorno, 14);
    {
      const p = geoPena.attributes.position, uv = geoPena.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i);
        uv.setXY(i, p.getX(i) / .7 + .5, y / 2.9);
        p.setX(i, p.getX(i) + y * y * .05);
      }
    }
    const pluma = new THREE.Mesh(geoPena, new THREE.MeshStandardMaterial({ map: tex.pena(), roughness: .85, side: THREE.DoubleSide }));
    pluma.castShadow = true;
    pluma.position.set(x, .62, z);
    pluma.rotation.set(-.95, .5, -.85);
    scene.add(pluma);
  })();

  // Selo de lacre
  (function selo() {
    const x = CX + 15.9, z = 3.2;
    const lacre = new THREE.MeshPhysicalMaterial({ color: 0x8f1612, roughness: .32, clearcoat: .6 });
    const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(.5, .56, .1, 12), lacre));
    m.position.set(x, .05, z); m.rotation.y = .4;
    scene.add(m);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(.33, .035, 8, 26), lacre);
    aro.rotation.x = Math.PI / 2;
    aro.position.set(x, .105, z);
    scene.add(aro);
    sombraDe(x, z, 1.7);
  })();

  // Pergaminho enrolado
  (function scroll() {
    const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, 5.2, 28), new THREE.MeshStandardMaterial({ color: 0xcdb98a, roughness: .9 })));
    m.rotation.set(0, 0.5, Math.PI / 2);
    m.position.set(CX + 19, .34, 9.6);
    scene.add(m);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.36, .05, 10, 24), new THREE.MeshStandardMaterial({ color: 0x7c1f1f, roughness: .6 }));
    tie.rotation.set(0, Math.PI / 2 + .5, 0);
    tie.position.set(CX + 19, .34, 9.6);
    scene.add(tie);
  })();

  // Pó a flutuar na luz
  const dust = (() => {
    const n = 260, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 60; pos[i * 3 + 1] = Math.random() * 14 + .5; pos[i * 3 + 2] = (Math.random() - .5) * 30; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(geo, new THREE.PointsMaterial({ map: tex.glowSprite('255,225,180'), size: .09, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(p);
    return p;
  })();

  // ---- Cartas ----
  const cardShape = roundedRect(CARD.w, CARD.h, .17);
  const faceGeo = new THREE.ShapeGeometry(cardShape, 8);
  {
    const p = faceGeo.attributes.position, uv = faceGeo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / CARD.w + .5, p.getY(i) / CARD.h + .5);
  }
  const bodyGeo = new THREE.ExtrudeGeometry(cardShape, { depth: .01, bevelEnabled: false, curveSegments: 8 });
  bodyGeo.translate(0, 0, -.005);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcdbb92, roughness: .8 });
  const superficieNormal = tex.superficieCarta(), superficieTarot = tex.superficieCarta(true);
  const backTex = tex.cardBack();
  const backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: .5, envMapIntensity: .6 });

  const hitMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const cards = new Set();

  function createCard(spec, { at = [BARALHO[0], .7, BARALHO[2]], back = null } = {}) {
    const g = new THREE.Group();
    const map = tex.cardFace(spec);
    // Onde há folha de ouro a luz reflete, e as cartas raras mudam de cor conforme o ângulo.
    const superficie = spec.tarot ? superficieTarot : superficieNormal;
    const base = { map, normalMap: superficie.normal, normalScale: new THREE.Vector2(.35, .35), roughnessMap: superficie.brilho, metalnessMap: superficie.brilho, roughness: 1, metalness: 1, envMapIntensity: .85 };
    const frontMat = (spec.tema === 'pista' || spec.tema === 'rara') && !LEVE
      ? new THREE.MeshPhysicalMaterial({ ...base, iridescence: .55, iridescenceIOR: 1.4, iridescenceThicknessRange: [180, 420] })
      : new THREE.MeshStandardMaterial(base);
    const front = new THREE.Mesh(faceGeo, frontMat);
    front.position.z = .012;
    const backMesh = new THREE.Mesh(faceGeo, back ? new THREE.MeshStandardMaterial({ map: back, roughness: .5 }) : backMat);
    backMesh.rotation.set(0, Math.PI, Math.PI);
    backMesh.position.z = -.012;
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    [front, backMesh, body].forEach(m => { m.castShadow = true; m.receiveShadow = true; });
    g.add(body, front, backMesh);
    scene.add(g);
    // Área de clique que não se mexe com o hover, para a carta não fugir do rato.
    const hit = new THREE.Mesh(faceGeo, hitMat);
    hit.visible = false;
    scene.add(hit);
    g.userData.hit = hit;
    const card = {
      group: g, spec, front, backMesh, body, hit,
      pos: new THREE.Vector3(...at), rot: new THREE.Euler(FACE_DOWN, 0, 0), scale: 1, zoom: false,
      hover: 0, hoverTarget: 0, hoverScale: .32, hoverLift: 1.6, enabled: false, shake: 0,
    };
    g.userData.card = card;
    hit.userData.hitOf = card;
    cards.add(card);
    return card;
  }

  function removeCard(card) {
    scene.remove(card.group);
    scene.remove(card.hit);
    card.front.material.map.dispose();
    card.front.material.dispose();
    cards.delete(card);
  }

  // Move uma carta em arco até um destino: {pos:[x,y,z], rot:[x,y,z], scale}.
  function fly(card, { pos, rot = [TILT, 0, 0], scale = 1 }, dur = .65, { delay = 0, arc = 1.6 } = {}) {
    const p0 = card.pos.clone(), p1 = new THREE.Vector3(...pos);
    const r0 = card.rot.clone(), s0 = card.scale;
    return tween(dur, (e, raw) => {
      card.pos.lerpVectors(p0, p1, e);
      card.pos.y += Math.sin(raw * Math.PI) * arc;
      card.rot.x = r0.x + (rot[0] - r0.x) * e;
      card.rot.y = r0.y + (rot[1] - r0.y) * e;
      card.rot.z = r0.z + (rot[2] - r0.z) * e;
      card.scale = s0 + (scale - s0) * e;
    }, { delay });
  }

  // Baralho visível
  const deck = (() => {
    const g = new THREE.Group();
    const body = new THREE.ExtrudeGeometry(cardShape, { depth: .85, bevelEnabled: false, curveSegments: 8 });
    const m = shadowed(new THREE.Mesh(body, new THREE.MeshStandardMaterial({ color: 0xd9c9a2, roughness: .9 })));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0;
    g.add(m);
    const top = new THREE.Mesh(faceGeo, backMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = .856;
    g.add(top);
    sombraDe(BARALHO[0], BARALHO[2], 3.2, 4.2);
    g.position.set(...BARALHO);
    g.rotation.y = .06;
    g.scale.setScalar(.6);
    scene.add(g);
    return g;
  })();

  // ---- Dados: d6, d8, d10, d12, d20 e o par de d10 das percentagens ----
  // Cada face é um polígono com a sua célula numa textura com os números.
  function dieFromPolygons(polys, labels, color, ink) {
    const cols = 5, rows = 4;
    const atlas = tex.diceAtlas(labels, color, ink, cols, rows);
    const positions = [], normals = [], uvs = [], faces = [];
    polys.forEach((poly, f) => {
      const c = new THREE.Vector3();
      poly.forEach(p => c.add(p));
      c.divideScalar(poly.length);
      const n = new THREE.Vector3().crossVectors(poly[1].clone().sub(poly[0]), poly[2].clone().sub(poly[0])).normalize();
      if (n.dot(c) < 0) { n.negate(); poly = [...poly].reverse(); }
      // O "cima" do número aponta para o primeiro vértice do polígono.
      const up = poly[0].clone().sub(c).projectOnPlane(n).normalize();
      const right = new THREE.Vector3().crossVectors(up, n).normalize();
      const radius = Math.max(...poly.map(p => p.distanceTo(c)));
      const cu = ((f % cols) + .5) / cols, cv = 1 - (Math.floor(f / cols) + .5) / rows;
      const uvOf = p => {
        const d = p.clone().sub(c);
        return [cu + d.dot(right) / radius * .46 / cols, cv + d.dot(up) / radius * .46 / rows];
      };
      // A face fica plana e as arestas ganham um chanfro, que é onde a luz brilha nos dados a sério.
      const poe = (p, normal) => {
        positions.push(p.x, p.y, p.z);
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(...uvOf(p));
      };
      const dentro = poly.map(p => p.clone().sub(c).multiplyScalar(.87).add(c));
      const fora = poly.map(p => n.clone().multiplyScalar(.72).add(p.clone().sub(c).normalize().multiplyScalar(.7)).normalize());
      for (let i = 1; i < dentro.length - 1; i++) [dentro[0], dentro[i], dentro[i + 1]].forEach(p => poe(p, n));
      poly.forEach((p, i) => {
        const j = (i + 1) % poly.length;
        poe(p, fora[i]); poe(poly[j], fora[j]); poe(dentro[j], n);
        poe(p, fora[i]); poe(dentro[j], n); poe(dentro[i], n);
      });
      faces.push({ n, up, right, height: c.dot(n), value: f });
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    const mesh = shadowed(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: atlas, roughness: .3, metalness: .05, clearcoat: .7, clearcoatRoughness: .14, envMapIntensity: 1 })));
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, faces };
  }

  // Junta os triângulos de um poliedro regular nas suas faces.
  function polysOf(geometry) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const pos = g.attributes.position, groups = [];
    for (let i = 0; i < pos.count; i += 3) {
      const tri = [0, 1, 2].map(k => new THREE.Vector3().fromBufferAttribute(pos, i + k));
      const n = new THREE.Vector3().crossVectors(tri[1].clone().sub(tri[0]), tri[2].clone().sub(tri[0])).normalize();
      const group = groups.find(q => q.n.dot(n) > .99);
      if (group) group.verts.push(...tri); else groups.push({ n, verts: tri });
    }
    return groups.map(({ n, verts }) => {
      const unique = verts.filter((v, i) => verts.findIndex(o => o.distanceTo(v) < 1e-3) === i);
      const c = unique.reduce((a, v) => a.add(v), new THREE.Vector3()).divideScalar(unique.length);
      const a = unique[0].clone().sub(c).normalize(), b = new THREE.Vector3().crossVectors(n, a);
      return unique.sort((p, q) => {
        const ang = v => { const d = v.clone().sub(c); return Math.atan2(d.dot(b), d.dot(a)); };
        return ang(p) - ang(q);
      });
    });
  }

  function d10Polys() {
    const belt = [];
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5;
      belt.push(new THREE.Vector3(Math.cos(a), i % 2 ? .105 : -.105, Math.sin(a)));
    }
    const top = new THREE.Vector3(0, 1, 0), bottom = new THREE.Vector3(0, -1, 0), polys = [];
    for (let i = 0; i < 10; i += 2) {
      polys.push([top, belt[i + 1], belt[i], belt[(i + 9) % 10]].map(v => v.clone()));
      polys.push([bottom, belt[i], belt[i + 1], belt[(i + 2) % 10]].map(v => v.clone()));
    }
    return polys;
  }

  const seq = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
  const DICE = {
    d20: dieFromPolygons(polysOf(new THREE.IcosahedronGeometry(1, 0)), seq(1, 20), '#7c1f1f', '#f2d48a'),
    // O dado do inimigo é negro, para nunca se confundir com o seu.
    d20i: dieFromPolygons(polysOf(new THREE.IcosahedronGeometry(1, 0)), seq(1, 20), '#15100e', '#ff6a5c'),
    d12: dieFromPolygons(polysOf(new THREE.DodecahedronGeometry(.92, 0)), seq(1, 12), '#23304f', '#f0e2bd'),
    d10: dieFromPolygons(d10Polys().map(p => p.map(v => v.multiplyScalar(.86))), seq(1, 10), '#2c4a35', '#f0e2bd'),
    d8: dieFromPolygons(polysOf(new THREE.OctahedronGeometry(.92, 0)), seq(1, 8), '#4f2f73', '#f0e2bd'),
    d6: dieFromPolygons(polysOf(new THREE.BoxGeometry(1.12, 1.12, 1.12)), seq(1, 6), '#efe5cc', '#7c1f1f'),
    dez: dieFromPolygons(d10Polys().map(p => p.map(v => v.multiplyScalar(.86))), ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'], '#191310', '#f2d48a'),
    uni: dieFromPolygons(d10Polys().map(p => p.map(v => v.multiplyScalar(.86))), seq(0, 9), '#efe5cc', '#191310'),
  };
  const worldFrame = new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0));

  // lista: [{ tipo: 'd20', face: 0–n }]. A face é o índice do número, a contar de 0.
  // Os dados caem à frente das cartas ou, em viagem, em cima do mapa.
  const ultimoDado = new THREE.Vector3();
  function rollDice(lista, { onde = 'mesa' } = {}) {
    const n = lista.length, escala = 1.1;
    // Com o livro aberto, a caixa vai para onde ele não tapa: por baixo dele, ou ao lado no ecrã pequeno.
    const sitio = onde === 'mapa' || !book.aberto ? [CX, 0, 1.4] : naVista(ecraPequeno() ? .62 : 0, ecraPequeno() ? .3 : -.6, 0).pos;
    caixa.position.set(sitio[0], .03, sitio[2]);
    caixa.visible = true;
    return Promise.all(lista.map(({ tipo, face }, i) => {
      const die = DICE[tipo], f = die.faces[face], m = die.mesh;
      const frame = new THREE.Matrix4().makeBasis(f.right, f.up, f.n);
      const rest = new THREE.Quaternion().setFromRotationMatrix(worldFrame.clone().multiply(frame.invert()));
      const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - .5) * .7);
      const final = yaw.multiply(rest);
      const axis = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize();
      const spin = (5 + i) * Math.PI * 2;
      const q = new THREE.Quaternion();
      const tx = caixa.position.x + (i - (n - 1) / 2) * 2.3, tz = caixa.position.z - .25 + (i % 2) * .5;
      if (i === 0) ultimoDado.set(tx, 1.2, tz);
      m.visible = true;
      m.scale.setScalar(escala);
      let last = 0;
      return tween(1.15, (e, raw) => {
        m.position.x = tx + (1 - e) * 1.6;
        m.position.z = tz + (1 - e) * 1.1;
        // saltos decrescentes
        m.position.y = f.height * escala + Math.abs(Math.cos(raw * Math.PI * 3.5)) * Math.pow(1 - raw, 1.7) * 2.2;
        q.setFromAxisAngle(axis, spin * (1 - e));
        m.quaternion.copy(q).multiply(final);
        const hit = Math.floor(raw * 3.5 + .5);
        if (hit !== last && raw < .92) { last = hit; sfx.dice(); }
      }, { ease: easeOut });
    }));
  }
  // A caixa onde os dados rolam: fica sempre à vista, e nada lhe sai por cima das bordas.
  const CAIXA = { w: 7.4, d: 4.8, borda: .55 };
  const caixa = (() => {
    const g = new THREE.Group();
    const fundo = new THREE.Mesh(new THREE.BoxGeometry(CAIXA.w, .06, CAIXA.d), new THREE.MeshStandardMaterial({ color: 0x5c1616, roughness: 1 }));
    fundo.receiveShadow = true;
    g.add(fundo);
    const madeira = new THREE.MeshStandardMaterial({ color: 0x4a2a14, roughness: .62 });
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([a, b]) => {
      const largo = a ? .32 : CAIXA.w + .32, fundoL = a ? CAIXA.d : .32;
      const m = new THREE.Mesh(new THREE.BoxGeometry(largo, CAIXA.borda, fundoL), madeira);
      m.position.set(a * CAIXA.w / 2, CAIXA.borda / 2, b * CAIXA.d / 2);
      m.castShadow = true; m.receiveShadow = true;
      g.add(m);
    });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(.42, CAIXA.borda + .06, .42), brass);
      m.position.set(a * CAIXA.w / 2, (CAIXA.borda + .06) / 2, b * CAIXA.d / 2);
      g.add(m);
    });
    g.visible = false;
    scene.add(g);
    return g;
  })();
  const hideDice = () => { Object.values(DICE).forEach(d => (d.mesh.visible = false)); caixa.visible = false; };

  // O d20 de quem chega a uma classe aprimorada: perolado, com os números acesos.
  let d20Tema = null, d20Halo = null;
  function tornarD20(tema) {
    const { map, brilho } = tex.diceAtlasTema(seq(1, 20), tema, 5, 4);
    DICE.d20.mesh.material = new THREE.MeshPhysicalMaterial({
      map, emissive: 0xffffff, emissiveMap: brilho, emissiveIntensity: 1.2,
      roughness: .2, metalness: tema.metal, clearcoat: 1, clearcoatRoughness: .08,
      iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 480], envMapIntensity: 1.3,
    });
    if (d20Halo) DICE.d20.mesh.remove(d20Halo);
    d20Halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.glowSprite(tema.halo), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: .4 }));
    d20Halo.scale.set(4.2, 4.2, 1);
    DICE.d20.mesh.add(d20Halo);
    d20Tema = tema;
  }
  function pulsarD20(t) {
    const p = d20Tema.pulso;
    const v = p === 'fogo' ? .35 * Math.sin(t * 7) * Math.sin(t * 3.1) : p === 'raio' ? (Math.random() < .07 ? 1.1 : 0) : .2 * Math.sin(t * 1.6);
    DICE.d20.mesh.material.emissiveIntensity = 1.2 + v;
    d20Halo.material.opacity = .4 + v * .35;
  }

  // Crítico: a mesa treme, o dado acende e saltam faíscas.
  function efeitoCritico(bom) {
    const cor = bom ? 0xffd778 : 0xff3a2a;
    const luz = new THREE.PointLight(cor, 0, 34, 1.6);
    luz.position.copy(ultimoDado).setY(3);
    scene.add(luz);
    const n = 90, pos = new Float32Array(n * 3), vel = [];
    for (let i = 0; i < n; i++) {
      pos.set([ultimoDado.x, ultimoDado.y, ultimoDado.z], i * 3);
      const a = Math.random() * 6.28, r = 2 + Math.random() * 7;
      vel.push([Math.cos(a) * r, 5 + Math.random() * 9, Math.sin(a) * r]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ map: tex.glowSprite(bom ? '255,220,130' : '255,70,40'), size: .55, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const faiscas = new THREE.Points(geo, mat);
    scene.add(faiscas);
    cam.shake = bom ? .35 : .7;
    return tween(1.3, (e, raw) => {
      luz.intensity = 260 * (1 - raw);
      mat.opacity = 1 - raw;
      for (let i = 0; i < n; i++) {
        pos[i * 3] = ultimoDado.x + vel[i][0] * raw;
        pos[i * 3 + 1] = ultimoDado.y + vel[i][1] * raw - 11 * raw * raw;
        pos[i * 3 + 2] = ultimoDado.z + vel[i][2] * raw;
      }
      geo.attributes.position.needsUpdate = true;
    }, { ease: t => t }).then(() => {
      scene.remove(luz); scene.remove(faiscas); geo.dispose(); mat.map.dispose(); mat.dispose();
    });
  }

  // ---- Fichas de Vida, Ouro e Pistas sobre a mesa ----
  const tokens = (() => {
    const gemGeo = new THREE.IcosahedronGeometry(.27, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({ color: 0xd01a28, roughness: .1, metalness: .1, flatShading: true, emissive: 0x4a0408, emissiveIntensity: .35, envMapIntensity: 2, clearcoat: 1, clearcoatRoughness: .05 });
    const coinGeo = new THREE.CylinderGeometry(.3, .3, .07, 28);
    const cunho = tex.moeda();
    const coinSide = new THREE.MeshStandardMaterial({ color: 0xd8a640, metalness: 1, roughness: .4, envMapIntensity: 1.3 });
    const coinFace = new THREE.MeshStandardMaterial({ map: cunho.map, normalMap: cunho.normal, metalness: 1, roughness: .36, envMapIntensity: 1.3 });
    const coinMat = [coinSide, coinFace, coinFace];
    const gems = [], coins = [];

    function pop(mesh, target = 1) {
      mesh.scale.setScalar(.01);
      return tween(.3, e => mesh.scale.setScalar(.01 + (target - .01) * e), { ease: easeOut });
    }
    function drop(list, mesh) {
      const s = mesh.scale.x;
      tween(.3, e => { mesh.scale.setScalar(Math.max(.001, s * (1 - e))); mesh.position.y += .02; }, { ease: easeOut })
        .then(() => scene.remove(mesh));
    }
    function sync(vida, ouro) {
      while (gems.length > vida) drop(gems, gems.pop());
      while (gems.length < vida) {
        const i = gems.length;
        const m = shadowed(new THREE.Mesh(gemGeo, gemMat));
        m.position.set(CX - 13.55 + (i % 6) * .46, .24, 2.85 + Math.floor(i / 6) * .46);
        m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
        scene.add(m); pop(m, .78); gems.push(m);
      }
      while (coins.length > ouro) drop(coins, coins.pop());
      while (coins.length < ouro) {
        const i = coins.length, per = 5, pile = Math.floor(i / per), h = i % per;
        const m = shadowed(new THREE.Mesh(coinGeo, coinMat));
        const cx = CX - 10.45 + (pile % 4) * .62, cz = 3 + Math.floor(pile / 4) * .7;
        m.position.set(cx + (Math.random() - .5) * .06, .04 + h * .075, cz + (Math.random() - .5) * .06);
        m.rotation.y = Math.random() * 3;
        scene.add(m); pop(m, .9); coins.push(m);
      }
    }
    return { sync };
  })();

  // ---- Câmara: fixa, para a mesa não se mexer enquanto se escolhe ----
  const cam = { pos: new THREE.Vector3(...VISTA.pos), look: new THREE.Vector3(...VISTA.look), shake: 0 };
  const mouse = { x: 0, y: 0, ndc: new THREE.Vector2(-5, -5) };
  const alvoCamera = new THREE.Vector3(), pontoEcra = new THREE.Vector2(), frenteCamera = new THREE.Vector3();

  function posicaoCamera() {
    if (ecraVertical()) {
      // De pé, a câmara recua até o mapa caber de lado a lado, e sobe-o para o topo.
      const recua = Math.max(1, 1.05 / camera.aspect), D = cam.pos.distanceTo(cam.look) * recua;
      alvoCamera.set(cam.look.x, 0, AREA.map.z + .12 * D);
      camera.position.copy(cam.pos).sub(cam.look).multiplyScalar(recua).add(alvoCamera);
      camera.lookAt(alvoCamera);
      camera.updateMatrixWorld();
      return;
    }
    // Em janelas estreitas a câmara recua, para caberem as cartas dos lados da mesa.
    // A mesa fica encostada ao topo, e o que sobra fica em baixo para a mão.
    const widen = Math.max(1, 1.95 / camera.aspect);
    camera.position.copy(cam.pos).sub(cam.look).multiplyScalar(widen).add(cam.look);
    alvoCamera.copy(cam.look);
    const desce = 9.1 * (widen - 1);
    camera.position.z += desce; alvoCamera.z += desce;
    camera.lookAt(alvoCamera);
    camera.updateMatrixWorld();
  }

  function applyCamera(dt) {
    posicaoCamera();
    if (cam.shake > 0) {
      camera.position.x += (Math.random() - .5) * cam.shake;
      camera.position.y += (Math.random() - .5) * cam.shake;
      cam.shake = Math.max(0, cam.shake - dt * .9);
    }
    camera.lookAt(alvoCamera);
    camera.updateMatrixWorld();
  }

  // Um ponto do ecrã (de -1 a 1) à altura y da mesa, e quanto mundo cabe na vertical a essa distância.
  function naVista(nx, ny, y) {
    ray.setFromCamera(pontoEcra.set(nx, ny), camera);
    const { origin: o, direction: d } = ray.ray;
    const p = o.clone().addScaledVector(d, (y - o.y) / d.y);
    const altura = 2 * p.clone().sub(o).dot(camera.getWorldDirection(frenteCamera)) * Math.tan(camera.fov * Math.PI / 360);
    return { pos: [p.x, p.y, p.z], altura };
  }

  // Dispõe n cartas numa zona do ecrã. Crescem até encher a altura, ou até se tocarem.
  // Ficam acima da chama das velas, para o brilho não lhes passar por cima.
  // Com grelha, podem ocupar até três filas.
  function fileira(n, { topo, base, esq = -.98, dir = .98, y = 4, perto = false, grelha = false }) {
    posicaoCamera();
    if (perto) y = camera.position.y - 9.5;
    const altura0 = naVista(0, (topo + base) / 2, y).altura;
    const larguraEcra = altura0 * camera.aspect;
    const vao = .05;
    const medida = l => {
      const c = Math.ceil(n / l);
      return Math.min((topo - base) / 2 * altura0 / (CARD.h * (l + (l - 1) * vao)), (dir - esq) / 2 * larguraEcra / (CARD.w * (c + (c - 1) * vao)));
    };
    let linhas = 1;
    if (grelha) for (let l = 2; l <= 3; l++) if (medida(l) > medida(linhas)) linhas = l;
    const k = medida(linhas), colunas = Math.ceil(n / linhas);
    const passoX = k * CARD.w * (1 + vao) / (larguraEcra / 2), passoY = k * CARD.h * (1 + vao) / (altura0 / 2);
    // O mais perto do centro que os avisos dos cantos deixarem.
    const metade = (colunas * passoX - k * CARD.w * vao / (larguraEcra / 2)) / 2;
    const meioX = Math.max(esq + metade, Math.min(dir - metade, grelha ? (esq + dir) / 2 : 0));
    const primeiroY = grelha ? (topo + base) / 2 + (linhas - 1) * passoY / 2 : base + k * CARD.h / altura0;
    return Array.from({ length: n }, (_, i) => {
      const l = Math.floor(i / colunas), naLinha = l < linhas - 1 ? colunas : n - l * colunas;
      const { pos, altura } = naVista(meioX + (i - l * colunas - (naLinha - 1) / 2) * passoX, primeiroY - l * passoY, y);
      return { pos, rot: [DE_FRENTE, 0, 0], scale: k * altura / altura0 };
    });
  }

  // O véu escurece tudo o que está atrás das cartas em destaque.
  const veuMesh = new THREE.Mesh(new THREE.PlaneGeometry(90, 60), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  veuMesh.position.z = -13;
  veuMesh.visible = false;
  camera.add(veuMesh);
  function veu(ligado) {
    veuMesh.visible = true;
    // A luz do livro fica mesmo ao pé das cartas em destaque, e queimava-as.
    const de = veuMesh.material.opacity, para = ligado ? .82 : 0, luzDe = book.luz.intensity, luzPara = ligado ? 0 : 30;
    return tween(.4, e => {
      veuMesh.material.opacity = de + (para - de) * e;
      book.luz.intensity = luzDe + (luzPara - luzDe) * e;
    }).then(() => { veuMesh.visible = ligado; });
  }

  const brilho = (() => {
    const [c, x] = canvas(256, 340);
    x.shadowColor = '#ffc95e'; x.shadowBlur = 44;
    x.fillStyle = '#ffd98a'; x.fillRect(48, 48, 160, 244);
    x.fillRect(48, 48, 160, 244);
    return new THREE.CanvasTexture(c);
  })();
  function halo(card) {
    card.halo = new THREE.Mesh(new THREE.PlaneGeometry(CARD.w * 1.28, CARD.h * 1.22), new THREE.MeshBasicMaterial({ map: brilho, transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }));
    card.halo.position.z = -.05;
    card.group.add(card.halo);
  }

  // ---- Interação ----
  const ray = new THREE.Raycaster();
  let choice = null, hovered = null;
  // Sem rato não há passar por cima: o primeiro toque aproxima a carta, e o segundo joga-a.
  let armada = null, tipoPonteiro = 'mouse';
  function armar(card) {
    armada = card;
    const dica = document.getElementById('dica-toque');
    dica.textContent = card && card.enabled && !card.spec.locked ? 'Toque de novo na carta para a jogar. Toque fora para fechar.' : 'Toque fora para fechar.';
    dica.classList.toggle('on', !!card);
    document.body.classList.toggle('carta-perto', !!card);
  }

  // A área fixa decide quem é apanhado. Uma carta já levantada continua apanhada
  // enquanto o rato estiver sobre ela ou sobre o sítio de onde saiu.
  function pickCardAtMouse() {
    ray.setFromCamera(mouse.ndc, camera);
    const live = [...cards].filter(c => c.enabled || c.inspectable);
    const targets = live.map(c => c.hit);
    if (armada && live.includes(armada)) targets.push(armada.group);
    if (hovered && live.includes(hovered) && !hovered.zoom) targets.push(hovered.group);
    const hits = ray.intersectObjects(targets, true);
    if (!hits.length) return null;
    const owner = o => {
      if (o.userData.hitOf) return o.userData.hitOf;
      while (o && !o.userData.card) o = o.parent;
      return o ? o.userData.card : null;
    };
    const owners = hits.map(h => owner(h.object));
    return hovered && owners.includes(hovered) ? hovered : owners[0];
  }

  function bookLinkAtMouse() {
    if (LIVRO.oculto) return null;
    ray.setFromCamera(mouse.ndc, camera);
    const hit = ray.intersectObject(book.rightSurface, false)[0];
    return hit ? book.linkAt(hit.uv) : null;
  }

  function choose(list) {
    list.forEach(c => { c.enabled = true; });
    return new Promise(resolve => {
      choice = { list, resolve };
    });
  }

  function select(card) {
    if (!choice || !choice.list.includes(card)) return;
    if (card.spec.locked) { card.shake = 1; sfx.hit(); return; }
    const { list, resolve } = choice;
    choice = null;
    armar(null);
    list.forEach(c => { c.enabled = false; c.hoverTarget = 0; });
    sfx.card();
    resolve(list.indexOf(card));
  }

  const trackMouse = e => {
    const r = canvasEl.getBoundingClientRect();
    mouse.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    mouse.x = mouse.ndc.x; mouse.y = mouse.ndc.y;
    ultimoToque = performance.now();
  };
  window.addEventListener('pointermove', trackMouse);
  canvasEl.addEventListener('pointerleave', () => mouse.ndc.set(-5, -5));
  const handlers = { link: null, carta: null };
  canvasEl.addEventListener('pointerdown', e => { tipoPonteiro = e.pointerType; });
  canvasEl.addEventListener('click', e => {
    trackMouse(e);
    const c = pickCardAtMouse(), link = !c && bookLinkAtMouse();
    // Depois de um toque não fica nenhum dedo por cima de nada.
    if (tipoPonteiro === 'touch') {
      mouse.ndc.set(-5, -5);
      const tinha = armada;
      if (c && c.zoom && c !== armada) { armar(c); return; }
      if (tinha && c !== tinha) { armar(null); return; }
      if (tinha && !tinha.enabled) armar(null);
    }
    if (c && !(choice && choice.list.includes(c)) && handlers.carta) handlers.carta(c);
    if (c) { select(c); return; }
    if (link && handlers.link) handlers.link(link);
  });
  window.addEventListener('keydown', e => {
    if (!choice) return;
    const i = parseInt(e.key, 10) - 1;
    if (i >= 0 && i < choice.list.length) select(choice.list[i]);
  });

  // ---- Qualidade da imagem: a escolha do jogador manda; sem escolha, ajusta-se à máquina ----
  const imagem = criarImagem(renderer);
  const lerEscolha = () => {
    const url = new URLSearchParams(location.search).get('q');
    if (QUALIDADES[url]) return url;
    try { const g = localStorage.getItem('cardomancer-imagem'); return QUALIDADES[g] ? g : null; } catch (e) { return null; }
  };
  let escolhida = lerEscolha(), qualidade = escolhida || (eTelemovel() ? 'baixo' : 'alto');
  let nitidez = QUALIDADES[qualidade].folga, acabamento = false, ultimoTamanho = '', aoMudar = null;
  function aplicarQualidade(nome) {
    qualidade = nome;
    const q = QUALIDADES[nome];
    nitidez = q.folga;
    acabamento = q.acabamento && imagem.possivel;
    key.shadow.mapSize.set(q.sombra, q.sombra);
    key.shadow.radius = q.raio;
    if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
    // O papel passa pelos tons de filme, por isso leva mais luz para continuar a ler-se bem.
    book.luzDasPaginas(acabamento ? 1.32 : 1);
    ultimoTamanho = '';
    resize();
    if (aoMudar) aoMudar(q.nome);
  }
  function ajustarLivro() {
    const pequeno = ecraPequeno();
    const alto = 2 * LIVRO.d * Math.tan(camera.fov * Math.PI / 360), largo = alto * camera.aspect, inteiro = 12.96;
    LIVRO.s = pequeno ? Math.min(.88, .62 * largo / inteiro) : .54;
    LIVRO.y = pequeno ? .25 : 1.62;
    LIVRO.x = pequeno ? -largo / 2 + inteiro * LIVRO.s / 2 + largo * .012 : 0;
    ZOOM.s = pequeno ? 1.08 : ecraVertical() ? .78 : .85;
    LIVRO.oculto = ecraVertical();
    book.group.visible = book.aberto && !LIVRO.oculto;
    book.group.position.set(LIVRO.x, LIVRO.y, -LIVRO.d);
    book.luz.position.x = LIVRO.x;
    if (book.aberto) book.group.scale.setScalar(LIVRO.s);
  }
  // Onde ficam no ecrã uns pontos da mesa, em píxeis: serve para a explicação acender cada zona.
  function retangulo(pontos) {
    posicaoCamera();
    const r = canvasEl.getBoundingClientRect(), v = new THREE.Vector3();
    let esq = Infinity, topo = Infinity, dir = -Infinity, base = -Infinity;
    pontos.forEach(p => {
      v.set(...p).project(camera);
      const x = r.left + (v.x + 1) / 2 * r.width, y = r.top + (1 - v.y) / 2 * r.height;
      esq = Math.min(esq, x); dir = Math.max(dir, x); topo = Math.min(topo, y); base = Math.max(base, y);
    });
    return { left: esq, top: topo, right: dir, bottom: base };
  }
  function retanguloLivro() {
    const r = canvasEl.getBoundingClientRect();
    const alto = 2 * LIVRO.d * Math.tan(camera.fov * Math.PI / 360), largo = alto * camera.aspect;
    const meioX = r.left + (LIVRO.x / largo + .5) * r.width, meioY = r.top + (.5 - LIVRO.y / alto) * r.height;
    const w = 12.96 * LIVRO.s / largo * r.width / 2, h = 8.42 * LIVRO.s / alto * r.height / 2;
    return { left: meioX - w, right: meioX + w, top: meioY - h, bottom: meioY + h };
  }
  // A beira direita do livro, de -1 a 1 no ecrã.
  function livroDireita() {
    const largo = 2 * LIVRO.d * Math.tan(camera.fov * Math.PI / 360) * camera.aspect;
    return (LIVRO.x + 12.96 * LIVRO.s / 2) / (largo / 2);
  }
  function resize() {
    const rail = document.getElementById('rail');
    const trilha = document.getElementById('trilha');
    // De pé, o painel passa para cima, e a mesa começa por baixo dele.
    const vertical = ecraVertical(), topo = vertical && rail ? rail.offsetHeight : 0;
    const w = innerWidth - (rail && !vertical ? rail.offsetWidth : 0);
    const h = innerHeight - topo - (trilha ? trilha.offsetHeight : 0);
    canvasEl.style.top = `${topo}px`;
    // Desenha com folga e encolhe: as letras pequenas das cartas ficam nítidas. A densidade do ecrã lê-se sempre de novo, porque muda com o zoom.
    const densidade = Math.min((window.devicePixelRatio || 1) * nitidez, Math.sqrt(QUALIDADES[qualidade].maxPixeis / (w * h)), LEVE ? 1.5 : 9);
    const chave = `${w}x${h}@${densidade}`;
    if (chave === ultimoTamanho) return;
    ultimoTamanho = chave;
    renderer.setPixelRatio(densidade);
    renderer.setSize(w, h);
    if (acabamento) imagem.tamanho(Math.floor(w * densidade), Math.floor(h * densidade), densidade);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    ajustarLivro();
  }
  window.addEventListener('resize', resize);
  aplicarQualidade(qualidade);

  // ---- Ciclo ----
  const clock = new THREE.Clock();
  let lastHoverSound = 0;
  const medida = { tempo: 0, frames: 0, mas: 0, lentos: 0 };
  document.addEventListener('visibilitychange', () => { medida.tempo = 0; medida.frames = 0; medida.mas = 0; medida.lentos = 0; clock.getDelta(); });
  const zoomAlvo = new THREE.Vector3();
  let espera = 0, ultimoToque = 0, havia = false;
  function loop() {
    requestAnimationFrame(loop);
    let bruto = clock.getDelta();
    if (LEVE) {
      // 30 imagens por segundo, e só 12 quando nada se mexe.
      espera += bruto;
      const parado = !tweens.length && performance.now() - ultimoToque > 2500;
      if (espera < (parado ? 1 / 12 : 1 / 30)) return;
      bruto = espera; espera = 0;
      renderer.shadowMap.needsUpdate = tweens.length > 0 || havia;
      havia = tweens.length > 0;
    }
    const dt = Math.min(bruto, .05), t = clock.elapsedTime;
    if (d20Tema) pulsarD20(t);
    // Se a máquina não aguentar, desce um degrau. Os soluços ao criar cartas não contam.
    medida.lentos = bruto >= 2 ? medida.lentos + 1 : 0;
    if (!escolhida && qualidade !== 'baixo' && medida.lentos >= 3) { medida.lentos = 0; aplicarQualidade('baixo'); }
    if (!LEVE && !escolhida && qualidade !== 'baixo' && !document.hidden && bruto < 2) {
      medida.tempo += bruto; medida.frames++;
      if (medida.tempo > 3) {
        medida.mas = medida.frames / medida.tempo < NITIDEZ.fpsMinimo ? medida.mas + 1 : 0;
        medida.tempo = 0; medida.frames = 0;
        if (medida.mas >= 2) { medida.mas = 0; aplicarQualidade(ORDEM_QUALIDADE[ORDEM_QUALIDADE.indexOf(qualidade) + 1]); }
      }
    }
    runTweens(dt);

    for (const c of candles) {
      const f = Math.sin(t * 11 + c.seed) * .06 + Math.sin(t * 23 + c.seed * 2) * .04 + Math.sin(t * 3.1 + c.seed) * .09;
      c.light.intensity = 38 * (1 + f * 1.4);
      c.sprite.scale.set(1.5 + f, 2.1 + f * 2, 1);
      c.flame.scale.set(.34 + f * .1, .74 + f * .34, 1);
      c.flame.material.rotation = f * .22;
    }
    key.intensity = 3.3 * (1 + Math.sin(t * 2.3) * Math.sin(t * .9) * .018);
    dust.rotation.y = t * .004;
    dust.position.y = Math.sin(t * .13) * .5;

    applyCamera(dt);

    for (const c of cards) {
      c.hover += (c.hoverTarget - c.hover) * Math.min(1, dt * 11);
      c.shake = Math.max(0, c.shake - dt * 2.6);
      const g = c.group;
      if (c.halo) c.halo.material.opacity = .34 + Math.sin(t * 2.6) * .12;
      g.position.copy(c.pos);
      g.rotation.copy(c.rot);
      g.position.x += Math.sin(c.shake * 26) * c.shake * .18;
      c.hit.position.copy(c.pos);
      c.hit.rotation.copy(c.rot);
      c.hit.scale.setScalar(c.scale);
      c.hit.updateMatrixWorld(true);
      if (c.zoom) {
        g.scale.setScalar(c.scale);
        if (c.hover > .002) {
          // A carta sai do seu lugar e vem até perto dos olhos, à frente do livro.
          const vh = 2 * ZOOM.d * Math.tan(camera.fov * Math.PI / 360), vw = vh * camera.aspect;
          const w = CARD.w * ZOOM.s, h = CARD.h * ZOOM.s;
          zoomAlvo.copy(c.pos).project(camera);
          const lx = Math.max(-vw / 2 + w / 2 + .05, Math.min(vw / 2 - w / 2 - .05, zoomAlvo.x * vw / 2));
          const ly = Math.max(-vh / 2 + h / 2 + .05, Math.min(vh / 2 - h / 2 - .05, zoomAlvo.y * vh / 2));
          zoomAlvo.set(lx, ly, -ZOOM.d).applyMatrix4(camera.matrixWorld);
          g.position.lerp(zoomAlvo, c.hover);
          g.quaternion.slerp(camera.quaternion, c.hover);
          g.scale.setScalar(c.scale + (ZOOM.s - c.scale) * c.hover);
        }
        const sombra = c.hover < .05;
        c.front.castShadow = sombra; c.backMesh.castShadow = sombra; c.body.castShadow = sombra;
      } else {
        g.position.y += c.hover * c.hoverLift;
        g.position.z -= c.hover * .5;
        g.scale.setScalar(c.scale * (1 + c.hover * c.hoverScale));
      }
      g.updateMatrixWorld(true);
    }

    if (armada && !cards.has(armada)) armar(null);
    const over = armada || pickCardAtMouse();
    if (over !== hovered) {
      hovered && (hovered.hoverTarget = 0);
      hovered = over;
      if (hovered) {
        hovered.hoverTarget = 1;
        if (!hovered.spec.locked && t - lastHoverSound > .12) { lastHoverSound = t; sfx.hover(); }
      }
    }
    const link = !over && bookLinkAtMouse();
    canvasEl.style.cursor = (over && over.enabled && !over.spec.locked) || link ? 'pointer' : 'default';

    if (acabamento) imagem.desenha(scene, camera, t);
    else renderer.render(scene, camera);
  }
  loop();

  return { scene, camera, renderer, tex, book, updateMap, pin, setPin, movePin, movePinTroco, mapToWorld, tornarD20, tokens, cam, createCard, removeCard, fly, choose, rollDice, hideDice, efeitoCritico, cards, resize, handlers, fileira, veu, halo, livroDireita, retangulo, retanguloLivro,
    get qualidade() { return QUALIDADES[qualidade].nome; },
    set aoMudarQualidade(f) { aoMudar = f; },
    proximaQualidade() {
      escolhida = ORDEM_QUALIDADE[(ORDEM_QUALIDADE.indexOf(qualidade) + 1) % ORDEM_QUALIDADE.length];
      try { localStorage.setItem('cardomancer-imagem', escolhida); } catch (e) { /* a escolha só dura esta sessão */ }
      aplicarQualidade(escolhida);
    },
  };
}
