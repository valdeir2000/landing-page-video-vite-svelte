const cacheName = 'cache_assets';

const precachedAssets = [
    'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css',
    'https://vjs.zencdn.net/7.10.2/video-js.min.css',
    '/vite.svg'
];

/* 
 * Salva assets em cache
 */
self.addEventListener('install', (ev) => {
    self.skipWaiting();

    ev.waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(precachedAssets);
    }));
});

/* 
 * Middleware
 */
self.addEventListener('fetch', async (ev) => {
    const url = new URL(ev.request.url);

    if (precachedAssets.includes(url.toString()) || precachedAssets.includes(url.pathname)) {
        const cache = await caches.open(cacheName);
        const cacheResponse = await cache.match(url.toString());

        return cacheResponse ?? fetch(ev.request).then((response) => {
            cache.put(url.toString(), response.clone());
            return response;
        })
    }

    if (url.pathname.startsWith('/progressive/')) {
        const newUrl = url.toString().replace('/progressive/', '/medias/videos/');
        const request = new Request(newUrl, {
            ...ev.request
        });

        return ev.respondWith(fetch(request));
    }

    return;
})