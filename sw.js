// ⚠️ Версияро иваз кунед ҳар вақт файлро update мекунед → кеш тоза мешавад
const CACHE_VERSION = 'hr-v4-birthday';
const CACHE_FILES = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_VERSION).then(cache => {
            return cache.addAll(CACHE_FILES);
        })
    );
    // Фавран activate мешавад — кеши кӯҳна намемонад
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            // Аввал шабака, агар нашуд кеш
            return fetch(e.request)
                .then(res => {
                    const resClone = res.clone();
                    caches.open(CACHE_VERSION).then(cache => cache.put(e.request, resClone));
                    return res;
                })
                .catch(() => cached);
        })
    );
});
