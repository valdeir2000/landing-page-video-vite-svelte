const cacheName = 'cache_assets';

const precachedAssets = [
    'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css',
    'https://vjs.zencdn.net/7.10.2/video-js.min.css',
    '/vite.svg'
];

const proxy_plausible = 'https://aplauso.valdeir-webdesign.workers.dev';

/**
 * 
 * @param {ReadableStream} value 
 */
async function readerStream(value) {
    if (!value) {
        return null;
    }

    const reader = value.getReader();
    let body = [];

    return new Promise((resolve) => {
        const read = async () => {
            const { done, value } = await reader.read();

            if (done) {
                resolve( new TextDecoder().decode(new Uint8Array(body)) );
                return;
            }

            body = [...body, ...value];

            read();
        }

        read();
    })
}

/**
 * Salva assets em cache
 * 
 * @module
 */
self.addEventListener('install', (ev) => {
    // @ts-ignore
    self.skipWaiting();

    ev.waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(precachedAssets);
    }));
});

self.addEventListener("activate", (event) => {
    // @ts-ignore
    event.waitUntil(clients.claim());
});

/**
 * Middleware
 * 
 * @module
 * @param {FetchEvent} ev
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

    if (url.hostname === 'analytics.realitybr.app') {
        console.log(ev.request.method)

        const request = new Request(`${proxy_plausible}${url.pathname}`, {
            method: 'POST',
            body: await readerStream(ev.request.body)
        });

        return ev.respondWith(fetch(request));
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