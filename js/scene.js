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
  return {
    card: () => noise(.13, 2600, .22),
    page: () => noise(.32, 1500, .2, .6),
    dice: () => noise(.07, 4200, .4, 3),
    coin: () => noise(.1, 6500, .13, 6),
    hit: () => noise(.25, 240, .6),
    toggle: () => (muted = !muted),
  };
})();

const CARD = { w: 3.3, h: 4.62 };
const TILT = -1.15;
const FACE_DOWN = Math.PI / 2;
const FACE_UP = -Math.PI / 2;

const AREA = {
  book: { x: 0, z: -3.6, pageW: 6.2, pageH: 8 },
  map: { x: -20, z: -1, w: 15, h: 10.7 },
  draft: { x: 18 },
};

const SHOTS = {
  title: { pos: [-1, 7, 20], look: [-5.5, 0.6, -2] },
  reading: { pos: [0, 24, 10], look: [0, 0, -0.7] },
  draft: { pos: [AREA.draft.x, 24, 10.5], look: [AREA.draft.x, 0, 0.2] },
  map: { pos: [AREA.map.x, 17.5, 7.2], look: [AREA.map.x, 0, -0.9] },
  mapChoice: { pos: [AREA.map.x, 23, 10], look: [AREA.map.x, 0, 1.1] },
};

function roundedRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function createWorld(canvasEl) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070403);
  scene.fog = new THREE.Fog(0x070403, 42, 90);

  const camera = new THREE.PerspectiveCamera(32, 1, 2, 150);
  const tex = textures(renderer);

  // Ambiente para os metais e o vidro terem o que refletir.
  (function environment() {
    const env = new THREE.Scene();
    env.background = new THREE.Color(0x120a06);
    const glow = (color, x, y, z, s) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 12), new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, z); env.add(m);
    };
    glow(0xffb066, 6, 8, 4, 3.4);
    glow(0xff8a3c, -8, 3, -5, 2.2);
    glow(0x6688aa, -3, 9, 8, 1.6);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.03).texture;
    pm.dispose();
  })();

  // Luz
  scene.add(new THREE.HemisphereLight(0xffe2bd, 0x1c0e05, 0.32));
  const key = new THREE.SpotLight(0xffdcae, 3.1, 0, 0.95, 0.4, 0);
  key.position.set(-1, 38, 12);
  key.target.position.set(-1, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.camera.near = 10; key.shadow.camera.far = 60;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 5;
  scene.add(key, key.target);

  // Mesa
  const wood = tex.wood();
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(130, 90),
    new THREE.MeshStandardMaterial({ map: wood.map, bumpMap: wood.bump, bumpScale: 0.9, roughness: 0.62, metalness: 0.02, envMapIntensity: 0.35 })
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  scene.add(table);

  const shadowed = m => { m.castShadow = true; m.receiveShadow = true; return m; };
  const leatherRed = tex.leather('#4a1712');
  const leatherGreen = tex.leather('#1f3a2c');
  const leatherBlue = tex.leather('#1d2642');
  const brass = new THREE.MeshStandardMaterial({ color: 0xb98a3e, metalness: 1, roughness: 0.34 });

  // ---- Livro aberto ----
  const book = (() => {
    const g = new THREE.Group();
    const { pageW: W, pageH: H } = AREA.book;
    const base = 0.42, bulge = 0.3;
    const curve = u => base + bulge * Math.sin(Math.PI * Math.pow(Math.min(1, u), 0.62));

    const cover = shadowed(new THREE.Mesh(new THREE.BoxGeometry(W * 2 + 0.55, 0.16, H + 0.42),
      new THREE.MeshStandardMaterial({ map: leatherRed, roughness: 0.68 })));
    cover.position.y = 0.08;
    g.add(cover);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const corner = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.62), brass);
      corner.position.set(a * (W + 0.03), 0.08, b * (H / 2 - 0.1));
      corner.castShadow = true;
      g.add(corner);
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
      return shadowed(new THREE.Mesh(geo, edgeMat));
    };
    g.add(profile(1), profile(-1));

    const surface = sign => {
      const geo = new THREE.PlaneGeometry(W, H, 36, 1);
      geo.rotateX(-Math.PI / 2);
      geo.translate(sign * W / 2, 0, 0);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = Math.abs(pos.getX(i)) / W;
        pos.setY(i, 0.165 + curve(u));
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.9, envMapIntensity: 0.15 }));
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    const left = surface(-1), right = surface(1);

    // Fita marcadora
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 1.4), new THREE.MeshStandardMaterial({ color: 0x8f1616, roughness: 0.6 }));
    ribbon.position.set(0.28, 0.06, H / 2 + 0.75);
    ribbon.rotation.y = -0.16;
    ribbon.castShadow = true;
    g.add(ribbon);

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
    const fFront = new THREE.Mesh(fGeoF, new THREE.MeshStandardMaterial({ roughness: 0.9 }));
    const fBack = new THREE.Mesh(fGeoB, new THREE.MeshStandardMaterial({ roughness: 0.9 }));
    fFront.castShadow = true;
    flip.add(fFront, fBack);
    g.add(flip);

    g.position.set(AREA.book.x, 0, AREA.book.z);
    scene.add(g);

    function showFirst(pages) {
      left.material.map = tex.leftPage(pages); left.material.needsUpdate = true;
      right.material.map = tex.rightPage(pages); right.material.needsUpdate = true;
    }

    async function turn(pages) {
      const oldL = left.material.map, oldR = right.material.map;
      const newL = tex.leftPage(pages), newR = tex.rightPage(pages);
      fFront.material.map = oldR; fFront.material.needsUpdate = true;
      fBack.material.map = newL; fBack.material.needsUpdate = true;
      right.material.map = newR; right.material.needsUpdate = true;
      flip.rotation.z = 0; flip.visible = true;
      sfx.page();
      await tween(0.7, e => {
        flip.rotation.z = e * Math.PI;
        flip.position.y = 0.62 + Math.sin(e * Math.PI) * 0.15;
      });
      left.material.map = newL; left.material.needsUpdate = true;
      flip.visible = false;
      oldL && oldL.dispose(); oldR && oldR.dispose();
    }
    return { group: g, showFirst, turn };
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
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: texMap, roughness: 0.88, envMapIntensity: 0.15, side: THREE.DoubleSide }));
    m.receiveShadow = true; m.castShadow = true;
    m.position.set(AREA.map.x, 0, AREA.map.z);
    scene.add(m);
    return m;
  })();
  const mapToWorld = key => {
    const p = LUGARES[key];
    return new THREE.Vector3(AREA.map.x + (p.x - .5) * AREA.map.w, 0.05, AREA.map.z + (p.y - .5) * AREA.map.h);
  };
  const updateMap = (visitados, destaque) => tex.mapTexture(mapPlane.material.map, visitados, destaque);

  // Pino de viagem
  const pin = (() => {
    const g = new THREE.Group();
    const pts = [[0, 0], [.34, 0], [.36, .07], [.24, .14], [.13, .3], [.1, .74], [.2, .84], [.09, .9]].map(p => new THREE.Vector2(p[0], p[1]));
    const lac = new THREE.MeshStandardMaterial({ color: 0x9c1414, roughness: 0.26, metalness: 0.15 });
    g.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 32), lac)));
    const head = shadowed(new THREE.Mesh(new THREE.SphereGeometry(.22, 32, 24), brass));
    head.position.y = 1.05;
    g.add(head);
    g.scale.setScalar(.9);
    g.visible = false;
    scene.add(g);
    return g;
  })();
  async function movePin(path) {
    for (let i = 1; i < path.length; i++) {
      const a = mapToWorld(path[i - 1]), b = mapToWorld(path[i]);
      const dur = Math.max(.5, a.distanceTo(b) * .17);
      await tween(dur, e => {
        pin.position.lerpVectors(a, b, e);
        pin.position.y = a.y + Math.abs(Math.sin(e * Math.PI * 3)) * .3;
      });
      sfx.coin();
    }
  }

  // ---- Adereços ----
  const candles = [];
  function candle(x, z, h = 2.7) {
    const g = new THREE.Group();
    const dish = [[0, 0], [.72, 0], [.78, .05], [.74, .13], [.28, .16], [.2, .32], [.26, .38], [0, .38]].map(p => new THREE.Vector2(p[0], p[1]));
    g.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(dish, 36), brass)));
    const wax = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(.2, .23, h, 24),
      new THREE.MeshStandardMaterial({ color: 0xe8d8b5, roughness: .55, emissive: 0x4a2206, emissiveIntensity: .35 })));
    wax.position.y = .36 + h / 2;
    g.add(wax);
    const flameY = .36 + h + .24;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex.glowSprite(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    sprite.position.y = flameY; sprite.scale.set(1.5, 2.1, 1);
    g.add(sprite);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(.09, .42, 12), new THREE.MeshBasicMaterial({ color: 0xffe6b0 }));
    flame.position.y = flameY;
    g.add(flame);
    const light = new THREE.PointLight(0xffa458, 38, 26, 2);
    light.position.y = flameY + .2;
    g.add(light);
    g.position.set(x, 0, z);
    scene.add(g);
    candles.push({ sprite, light, flame, seed: Math.random() * 40 });
  }
  candle(9.3, -6.6, 3.1);
  candle(-10.4, -7.4, 2.2);
  candle(9.4, 10, 1.5);
  candle(-29.6, -6.8, 2.6);

  function bookStack(x, z, rot) {
    const g = new THREE.Group();
    let y = 0;
    [[5.2, .62, 3.6, leatherGreen, .06], [4.6, .5, 3.3, leatherBlue, -.13], [3.9, .7, 2.9, leatherRed, .2]].forEach(([w, h, d, map, r]) => {
      const cover = shadowed(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ map, roughness: .68 })));
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
  bookStack(9.8, -11.2, .32);
  bookStack(-31.5, 3, -.5);

  // Cálice
  (function goblet() {
    const pts = [[0, 0], [.55, 0], [.6, .05], [.2, .16], [.12, .6], [.14, .9], [.44, 1.15], [.56, 1.72], [.52, 1.74], [.4, 1.2], [0, 1.0]].map(p => new THREE.Vector2(p[0], p[1]));
    const m = shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), brass));
    m.position.set(-11, 0, 4.8);
    m.scale.setScalar(1.25);
    scene.add(m);
  })();

  // Pergaminho enrolado
  (function scroll() {
    const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, 5.2, 28), new THREE.MeshStandardMaterial({ color: 0xcdb98a, roughness: .9 })));
    m.rotation.set(0, 0.5, Math.PI / 2);
    m.position.set(-3, .34, 9.6);
    scene.add(m);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.36, .05, 10, 24), new THREE.MeshStandardMaterial({ color: 0x7c1f1f, roughness: .6 }));
    tie.rotation.set(0, Math.PI / 2 + .5, 0);
    tie.position.set(-3, .34, 9.6);
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
  const backTex = tex.cardBack();
  const backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: .5, envMapIntensity: .6 });

  const cards = new Set();

  function createCard(spec, { at = [AREA.draft.x + 9.2, .9, -.8], back = null } = {}) {
    const g = new THREE.Group();
    const map = tex.cardFace(spec);
    const frontMat = new THREE.MeshStandardMaterial({ map, roughness: .66, envMapIntensity: .25 });
    const front = new THREE.Mesh(faceGeo, frontMat);
    front.position.z = .012;
    const backMesh = new THREE.Mesh(faceGeo, back ? new THREE.MeshStandardMaterial({ map: back, roughness: .5 }) : backMat);
    backMesh.rotation.set(0, Math.PI, Math.PI);
    backMesh.position.z = -.012;
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    [front, backMesh, body].forEach(m => { m.castShadow = true; m.receiveShadow = true; });
    g.add(body, front, backMesh);
    g.rotation.x = FACE_DOWN;
    scene.add(g);
    const card = {
      group: g, spec, front, backMesh,
      pos: new THREE.Vector3(...at), scale: 1,
      hover: 0, hoverTarget: 0, hoverScale: .32, hoverLift: 1.6, enabled: false, shake: 0,
    };
    g.userData.card = card;
    cards.add(card);
    return card;
  }

  function removeCard(card) {
    scene.remove(card.group);
    card.front.material.map.dispose();
    card.front.material.dispose();
    cards.delete(card);
  }

  // Move uma carta em arco até um destino: {pos:[x,y,z], rot:[x,y,z], scale}.
  function fly(card, { pos, rot = [TILT, 0, 0], scale = 1 }, dur = .65, { delay = 0, arc = 1.6 } = {}) {
    const p0 = card.pos.clone(), p1 = new THREE.Vector3(...pos);
    const r0 = card.group.rotation.clone(), s0 = card.scale;
    return tween(dur, (e, raw) => {
      card.pos.lerpVectors(p0, p1, e);
      card.pos.y += Math.sin(raw * Math.PI) * arc;
      card.group.rotation.x = r0.x + (rot[0] - r0.x) * e;
      card.group.rotation.y = r0.y + (rot[1] - r0.y) * e;
      card.group.rotation.z = r0.z + (rot[2] - r0.z) * e;
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
    g.position.set(AREA.draft.x + 9.2, 0, -.8);
    g.rotation.y = .06;
    scene.add(g);
    return g;
  })();

  // ---- Dados ----
  const dice = (() => {
    const s = .86, r = .15;
    const geo = new THREE.BoxGeometry(s, s, s, 10, 10, 10);
    const pos = geo.attributes.position, nor = geo.attributes.normal, v = new THREE.Vector3(), inner = s / 2 - r;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const c = new THREE.Vector3(THREE.MathUtils.clamp(v.x, -inner, inner), THREE.MathUtils.clamp(v.y, -inner, inner), THREE.MathUtils.clamp(v.z, -inner, inner));
      const n = v.clone().sub(c).normalize();
      pos.setXYZ(i, c.x + n.x * r, c.y + n.y * r, c.z + n.z * r);
      nor.setXYZ(i, n.x, n.y, n.z);
    }
    const faces = [3, 4, 1, 6, 2, 5].map(n => new THREE.MeshStandardMaterial({ map: tex.diceFace(n), roughness: .32, envMapIntensity: .6 }));
    const make = () => {
      const m = shadowed(new THREE.Mesh(geo, faces));
      m.rotation.order = 'YXZ';
      m.visible = false;
      scene.add(m);
      return m;
    };
    return [make(), make()];
  })();
  const FACE_ROT = { 1: [0, 0], 6: [Math.PI, 0], 3: [0, Math.PI / 2], 4: [0, -Math.PI / 2], 2: [-Math.PI / 2, 0], 5: [Math.PI / 2, 0] };

  function rollDice(a, b) {
    const targets = [[-1, .43, 2.6], [1.05, .43, 2.9]];
    return Promise.all([a, b].map((val, i) => {
      const m = dice[i], [tx, ty, tz] = targets[i], [rx, rz] = FACE_ROT[val];
      const yaw = Math.random() * 6.28, spinX = (4 + i) * Math.PI * 2, spinZ = (3 + i) * Math.PI * 2;
      m.visible = true;
      let last = 0;
      return tween(1.15, (e, raw) => {
        m.position.set(tx + (1 - e) * (7 + i), ty, tz + (1 - e) * 5);
        // saltos decrescentes
        const bounce = Math.abs(Math.cos(raw * Math.PI * 3.5)) * Math.pow(1 - raw, 1.7) * 3.2;
        m.position.y = ty + bounce;
        m.rotation.x = rx + spinX * (1 - e);
        m.rotation.z = rz + spinZ * (1 - e);
        m.rotation.y = yaw + 3 * (1 - e);
        const hit = Math.floor(raw * 3.5 + .5);
        if (hit !== last && raw < .92) { last = hit; sfx.dice(); }
      }, { ease: easeOut });
    }));
  }
  const hideDice = () => dice.forEach(d => (d.visible = false));

  // ---- Fichas de Vida, Ouro e Pistas sobre a mesa ----
  const tokens = (() => {
    const gemGeo = new THREE.IcosahedronGeometry(.27, 0);
    const gemMat = new THREE.MeshStandardMaterial({ color: 0xc01622, roughness: .13, metalness: .1, flatShading: true, emissive: 0x4a0408, emissiveIntensity: .5, envMapIntensity: 1.6 });
    const coinGeo = new THREE.CylinderGeometry(.3, .3, .07, 28);
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xd9a93e, metalness: 1, roughness: .32 });
    const noteGeo = new THREE.BoxGeometry(1.05, .012, .72);
    const noteMat = new THREE.MeshStandardMaterial({ color: 0xe0cfa2, roughness: .9 });
    const gems = [], coins = [], notes = [];

    function pop(mesh, target = 1) {
      mesh.scale.setScalar(.01);
      return tween(.3, e => mesh.scale.setScalar(.01 + (target - .01) * e), { ease: easeOut });
    }
    function drop(list, mesh) {
      const s = mesh.scale.x;
      tween(.3, e => { mesh.scale.setScalar(Math.max(.001, s * (1 - e))); mesh.position.y += .02; }, { ease: easeOut })
        .then(() => scene.remove(mesh));
    }
    function sync(vida, ouro, pistas) {
      while (gems.length > vida) drop(gems, gems.pop());
      while (gems.length < vida) {
        const i = gems.length;
        const m = shadowed(new THREE.Mesh(gemGeo, gemMat));
        m.position.set(-9.1 + (i % 2) * .7 + (Math.floor(i / 2) % 2) * .1, .26, -6.4 + Math.floor(i / 2) * .66);
        m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
        scene.add(m); pop(m); gems.push(m);
      }
      while (coins.length > ouro) drop(coins, coins.pop());
      while (coins.length < ouro) {
        const i = coins.length, per = 5, pile = Math.floor(i / per), h = i % per;
        const m = shadowed(new THREE.Mesh(coinGeo, coinMat));
        const cx = -8.9 + (pile % 2) * .68, cz = -.95 + Math.floor(pile / 2) * .68;
        m.position.set(cx + (Math.random() - .5) * .06, .04 + h * .075, cz + (Math.random() - .5) * .06);
        m.rotation.y = Math.random() * 3;
        scene.add(m); pop(m); coins.push(m);
      }
      while (notes.length > pistas) drop(notes, notes.pop());
      while (notes.length < pistas) {
        const i = notes.length;
        const m = shadowed(new THREE.Mesh(noteGeo, noteMat));
        m.position.set(8.7 + (Math.random() - .5) * .2, .015 + i * .014, 1.9 + i * .28);
        m.rotation.y = (Math.random() - .5) * .55;
        scene.add(m); pop(m); notes.push(m);
      }
    }
    return { sync };
  })();

  // ---- Câmara ----
  const cam = { pos: new THREE.Vector3(...SHOTS.title.pos), look: new THREE.Vector3(...SHOTS.title.look), name: 'title' };
  const mouse = { x: 0, y: 0, ndc: new THREE.Vector2(-5, -5) };

  function shot(name, dur = 1.15) {
    const s = SHOTS[name];
    cam.name = name;
    const p0 = cam.pos.clone(), l0 = cam.look.clone(), p1 = new THREE.Vector3(...s.pos), l1 = new THREE.Vector3(...s.look);
    return tween(dur, e => { cam.pos.lerpVectors(p0, p1, e); cam.look.lerpVectors(l0, l1, e); });
  }

  function applyCamera(t) {
    // Em janelas mais estreitas do que 16:9 a câmara recua para caber tudo.
    const aspect = camera.aspect, widen = Math.max(1, (16 / 9) / aspect);
    const dir = cam.pos.clone().sub(cam.look).multiplyScalar(widen);
    camera.position.copy(cam.look).add(dir);
    const drift = cam.name === 'title' ? .5 : .16;
    camera.position.x += mouse.x * drift * 2 + Math.sin(t * .23) * drift * .5;
    camera.position.y += -mouse.y * drift + Math.sin(t * .31) * drift * .25;
    camera.lookAt(cam.look);
  }

  // ---- Interação ----
  const ray = new THREE.Raycaster();
  let choice = null, hovered = null;

  function pickCardAtMouse() {
    ray.setFromCamera(mouse.ndc, camera);
    const groups = [...cards].filter(c => c.enabled || c.inspectable).map(c => c.group);
    const hit = ray.intersectObjects(groups, true)[0];
    if (!hit) return null;
    let o = hit.object;
    while (o && !o.userData.card) o = o.parent;
    return o ? o.userData.card : null;
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
    list.forEach(c => { c.enabled = false; c.hoverTarget = 0; });
    sfx.card();
    resolve(list.indexOf(card));
  }

  const trackMouse = e => {
    mouse.ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    mouse.x = mouse.ndc.x; mouse.y = mouse.ndc.y;
  };
  window.addEventListener('pointermove', trackMouse);
  canvasEl.addEventListener('click', e => {
    trackMouse(e);
    const c = pickCardAtMouse();
    if (c) select(c);
  });
  window.addEventListener('keydown', e => {
    if (!choice) return;
    const i = parseInt(e.key, 10) - 1;
    if (i >= 0 && i < choice.list.length) select(choice.list[i]);
  });

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Ciclo ----
  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    runTweens(dt);

    for (const c of candles) {
      const f = Math.sin(t * 11 + c.seed) * .06 + Math.sin(t * 23 + c.seed * 2) * .04 + Math.sin(t * 3.1 + c.seed) * .09;
      c.light.intensity = 38 * (1 + f * 1.4);
      c.sprite.scale.set(1.5 + f, 2.1 + f * 2, 1);
      c.flame.scale.set(1 + f, 1 + f * 2, 1);
      c.flame.rotation.z = f * .5;
    }
    dust.rotation.y = t * .004;
    dust.position.y = Math.sin(t * .13) * .5;

    applyCamera(t);

    const over = pickCardAtMouse();
    if (over !== hovered) {
      hovered && (hovered.hoverTarget = 0);
      hovered = over;
      if (hovered) { hovered.hoverTarget = 1; if (!hovered.spec.locked) sfx.card(); }
    }
    canvasEl.style.cursor = over && over.enabled && !over.spec.locked ? 'pointer' : 'default';

    for (const c of cards) {
      c.hover += (c.hoverTarget - c.hover) * Math.min(1, dt * 11);
      c.shake = Math.max(0, c.shake - dt * 2.6);
      const g = c.group;
      g.position.copy(c.pos);
      g.position.y += c.hover * c.hoverLift;
      g.position.z -= c.hover * .5;
      g.position.x += Math.sin(c.shake * 26) * c.shake * .18;
      g.scale.setScalar(c.scale * (1 + c.hover * c.hoverScale));
    }
    renderer.render(scene, camera);
  }
  loop();

  return { scene, camera, renderer, tex, book, updateMap, pin, movePin, mapToWorld, tokens, shot, cam, createCard, removeCard, fly, choose, rollDice, hideDice, cards };
}
