/* Service Worker der Lern-App: Inhalte mit ?v= sind unveränderlich (Cache zuerst), alles andere Netz zuerst. */
const C = 'lernapp-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  if(u.search.includes('v=')){
    e.respondWith(caches.open(C).then(async c => { const hit = await c.match(e.request); if(hit) return hit; const r = await fetch(e.request); if(r.ok) c.put(e.request, r.clone()); return r; }));
  } else {
    e.respondWith(fetch(e.request).then(r => { if(r.ok){ const cl = r.clone(); caches.open(C).then(c => c.put(e.request, cl)); } return r; }).catch(() => caches.match(e.request)));
  }
});
