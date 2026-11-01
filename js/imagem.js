// O acabamento da imagem: as luzes brilham de verdade, os tons são de filme e os cantos escurecem.
// A mesa é desenhada para uma imagem à parte, tratada aqui antes de chegar ao ecrã.

const QUALIDADES = {
  alto: { nome: 'alta', acabamento: true, folga: 1.5, sombra: 4096, raio: 3.4, maxPixeis: 9e6 },
  medio: { nome: 'média', acabamento: true, folga: 1.15, sombra: 2048, raio: 2.4, maxPixeis: 5e6 },
  baixo: { nome: 'baixa', acabamento: false, folga: 1, sombra: 1024, raio: 1.6, maxPixeis: 3e6 },
};
const ORDEM_QUALIDADE = ['alto', 'medio', 'baixo'];

const VERTICE_ECRA = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

function criarImagem(renderer) {
  const gl = renderer.extensions;
  const possivel = renderer.capabilities.isWebGL2 && (gl.has('EXT_color_buffer_float') || gl.has('EXT_color_buffer_half_float'));

  const opcoes = { type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  const cena = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 2 });
  const niveis = Array.from({ length: 5 }, () => new THREE.WebGLRenderTarget(4, 4, opcoes));

  const peca = (fragmentShader, uniforms, extra = {}) => new THREE.ShaderMaterial({ vertexShader: VERTICE_ECRA, fragmentShader, uniforms, depthTest: false, depthWrite: false, toneMapped: false, ...extra });

  // Só o que é mais forte do que o papel iluminado é que brilha, para o texto continuar limpo.
  const limiar = peca(`
    uniform sampler2D mapa; uniform float corte; varying vec2 vUv;
    void main() {
      vec3 c = min(texture2D(mapa, vUv).rgb, vec3(30.0));
      float l = max(c.r, max(c.g, c.b));
      float k = clamp((l - corte) / (corte * 0.6 + 0.0001), 0.0, 1.0);
      gl_FragColor = vec4(c * k * k, 1.0);
    }`, { mapa: { value: null }, corte: { value: 1.7 } });

  const descer = peca(`
    uniform sampler2D mapa; uniform vec2 passo; varying vec2 vUv;
    void main() {
      vec3 c = texture2D(mapa, vUv).rgb * 4.0;
      c += texture2D(mapa, vUv + passo * vec2(-1.0, -1.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2( 1.0, -1.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2(-1.0,  1.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2( 1.0,  1.0)).rgb;
      gl_FragColor = vec4(c / 8.0, 1.0);
    }`, { mapa: { value: null }, passo: { value: new THREE.Vector2() } });

  const subir = peca(`
    uniform sampler2D mapa; uniform vec2 passo; varying vec2 vUv;
    void main() {
      vec3 c = texture2D(mapa, vUv + passo * vec2(-2.0, 0.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2(2.0, 0.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2(0.0, -2.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2(0.0, 2.0)).rgb;
      c += texture2D(mapa, vUv + passo * vec2(-1.0, -1.0)).rgb * 2.0;
      c += texture2D(mapa, vUv + passo * vec2(1.0, -1.0)).rgb * 2.0;
      c += texture2D(mapa, vUv + passo * vec2(-1.0, 1.0)).rgb * 2.0;
      c += texture2D(mapa, vUv + passo * vec2(1.0, 1.0)).rgb * 2.0;
      gl_FragColor = vec4(c / 12.0, 1.0);
    }`, { mapa: { value: null }, passo: { value: new THREE.Vector2() } }, { blending: THREE.AdditiveBlending, transparent: true });

  const final = peca(`
    uniform sampler2D mapa, brilho; uniform float exposicao, tempo, forcaBrilho; varying vec2 vUv;
    vec3 rrt(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }
    vec3 filme(vec3 c) {
      const mat3 entra = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
      const mat3 sai = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
      return clamp(sai * rrt(entra * (c * exposicao / 0.6)), 0.0, 1.0);
    }
    vec3 ecra(vec3 c) { return mix(1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308)))); }
    float grao(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + tempo) * 43758.5453) - 0.5; }
    void main() {
      vec3 c = texture2D(mapa, vUv).rgb + texture2D(brilho, vUv).rgb * forcaBrilho;
      c = filme(c);
      // As sombras puxam para o castanho das velas, sem perder o preto.
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, 1.07);
      c += vec3(0.012, 0.005, -0.002) * (1.0 - l) * (1.0 - l);
      vec2 d = (vUv - 0.5) * vec2(1.12, 1.0);
      c *= 1.0 - smoothstep(0.42, 0.86, length(d)) * 0.62;
      c = ecra(clamp(c, 0.0, 1.0));
      c += grao(gl_FragCoord.xy) * 0.012;
      gl_FragColor = vec4(c, 1.0);
    }`, { mapa: { value: cena.texture }, brilho: { value: niveis[0].texture }, exposicao: { value: 1.05 }, tempo: { value: 0 }, forcaBrilho: { value: .32 } });

  const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadro = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), limiar);
  quadro.frustumCulled = false;
  const palco = new THREE.Scene();
  palco.add(quadro);

  function passa(material, destino, limpar = true) {
    quadro.material = material;
    renderer.setRenderTarget(destino);
    if (limpar) renderer.clear();
    renderer.render(palco, camara);
  }

  function tamanho(w, h, densidade) {
    const amostras = densidade >= 1.4 ? 2 : 4;
    if (cena.samples !== amostras) { cena.samples = amostras; cena.dispose(); }
    cena.setSize(w, h);
    niveis.forEach((n, i) => n.setSize(Math.max(2, w >> (i + 1)), Math.max(2, h >> (i + 1))));
  }

  function desenha(scene, camera, t) {
    renderer.setRenderTarget(cena);
    renderer.render(scene, camera);

    const limpezaAuto = renderer.autoClear;
    renderer.autoClear = false;
    limiar.uniforms.mapa.value = cena.texture;
    passa(limiar, niveis[0]);
    for (let i = 1; i < niveis.length; i++) {
      descer.uniforms.mapa.value = niveis[i - 1].texture;
      descer.uniforms.passo.value.set(1 / niveis[i - 1].width, 1 / niveis[i - 1].height);
      passa(descer, niveis[i]);
    }
    for (let i = niveis.length - 1; i > 0; i--) {
      subir.uniforms.mapa.value = niveis[i].texture;
      subir.uniforms.passo.value.set(.5 / niveis[i].width, .5 / niveis[i].height);
      passa(subir, niveis[i - 1], false);
    }
    final.uniforms.tempo.value = t % 7;
    passa(final, null);
    renderer.autoClear = limpezaAuto;
  }

  return { possivel, desenha, tamanho };
}
