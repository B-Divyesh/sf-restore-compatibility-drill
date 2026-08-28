import { readdir, writeFile } from 'node:fs/promises';

const root = new URL('../dist/site/', import.meta.url);
const assets = await readdir(new URL('assets/', root));
const precache = [
  '/', '/demo', '/team-kit', '/privacy', '/terms', '/index.html', '/favicon.svg',
  '/restore-press.webp', '/og.webp', '/apple-touch-icon.png',
  ...assets.filter(name => !name.endsWith('.map')).map(name => `/assets/${name}`),
];
const source = `const CACHE = 'restore-drill-v1';
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/index.html') : undefined)));
});\n`;
await writeFile(new URL('sw.js', root), source);
