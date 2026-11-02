/* Network first, so new decks show up straight away; falls back to the saved copy when offline. */
const CACHE='ioik-v1';
const CORE=['./','index.html','app.js','decks.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin) return;
  e.respondWith(
    fetch(e.request).then(r=>{ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r; })
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
