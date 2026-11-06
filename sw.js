// O jogo guarda-se no telemóvel para abrir sem Internet.
// Com rede, vai sempre buscar a versão nova; sem rede (ou se a rede demorar), usa a que guardou.
const CACHE = 'cardomancer-1';
const ESSENCIAL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/data.js', 'js/historia.js', 'js/daraan.js', 'js/etapas.js', 'js/regras.js', 'js/partida.js',
  'js/tarot.js', 'js/arte.js', 'js/textures.js', 'js/musica.js', 'js/imagem.js', 'js/scene.js', 'js/ui.js',
  'fonts/andika-400.woff2', 'fonts/andika-400i.woff2', 'fonts/andika-700.woff2', 'fonts/andika-700i.woff2',
  'app/icone-192.png', 'app/icone-512.png',
  'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js'
];
// Quanto tempo se espera pela rede antes de usar o que está guardado.
const ESPERA = 5000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ESSENCIAL.map(u =>
    c.add(new Request(u, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    // Os ficheiros do jogo confirmam-se sempre com o servidor (se não mudaram, a resposta é curta).
    const proprio = new URL(req.url).origin === location.origin;
    const rede = (proprio ? fetch(req.url, { cache: 'no-cache' }) : fetch(req)).then(r => {
      if (r.ok || r.type === 'opaque') cache.put(req, r.clone()).catch(() => {});
      return r;
    });
    if (!guardado) return rede.catch(() => req.mode === 'navigate' ? cache.match('index.html') : Response.error());
    rede.catch(() => {});
    const tempo = new Promise(ok => setTimeout(() => ok(guardado), ESPERA));
    return Promise.race([rede.catch(() => guardado), tempo]);
  })());
});
