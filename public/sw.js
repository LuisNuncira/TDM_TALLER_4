const VERSION = "modo-nativo-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const API_CACHE = `${VERSION}-api`;
const SHELL_FILES = [
    "./",
    "./index.html",
    "./catalog.html",
    "./css/styles.css",
    "./js/main.js",
    "./js/catalog.js",
    "./js/theme.js",
    "./js/services/api.js",
    "./js/ui/ui.js",
    "./manifest.webmanifest",
    "./icons/icon-192.svg",
    "./icons/icon-512.svg",
    "./icons/icon-maskable.svg",
    "./offline.html"
];

self.addEventListener("install", event => {
    event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES)));
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== SHELL_CACHE && key !== API_CACHE).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/") && request.method === "GET") {
        event.respondWith(networkFirstApi(request));
        return;
    }

    event.respondWith(networkFirstShell(request));
});

async function networkFirstApi(request) {
    const cache = await caches.open(API_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        if (!cached) throw new Error("No hay datos guardados");
        const headers = new Headers(cached.headers);
        headers.set("X-Offline-Cache", "true");
        return new Response(cached.body, {
            status: cached.status,
            statusText: cached.statusText,
            headers
        });
    }
}

async function networkFirstShell(request) {
    const cached = await caches.match(request);
    try {
        const response = await fetch(request);
        if (response.ok && request.method === "GET") {
            const cache = await caches.open(SHELL_CACHE);
            await cache.put(request, response.clone());
        }
        return response;
    } catch {
        return cached || caches.match("./offline.html");
    }
}