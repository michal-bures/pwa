console.log('running sw.js')

const VERSION = 16
const CACHE_STORAGE_KEY = `counter-pwa-v${VERSION}`

// list of resources that will be cached client-side and served from the cache instead of server
const cacheFirstList = [
    "/",
    "index.html",
    "style.css",
]

self.addEventListener('install', function(event) {
    console.log('install event')
    event.waitUntil(install())
})

self.addEventListener('activate', function(event) {
    console.log('activate event')
    event.waitUntil(activate())
})

self.addEventListener('message', (event) => {
    if (event.data === 'version') {
        event.source.postMessage({serviceWorkerVersion: VERSION})
    }
})

self.addEventListener('fetch', function(event) {
    event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
    //cache-first
    const cachedResponse = await caches.match(request)
    if (cachedResponse != null) {
        console.log(request.url, ' fetched from cache')
        return cachedResponse
    } else {
        return fetch(request)
    }
}

async function install() {
    const cache = await caches.open(CACHE_STORAGE_KEY)
    console.log('Adding to Cache:', cacheFirstList)
    await cache.addAll(cacheFirstList)
    await self.skipWaiting()
}


async function activate() {
    await clearOldCaches()
    await self.clients.claim()
    const clients = await self.clients.matchAll()
    for (const client of clients) {
        client.postMessage({serviceWorkerVersion: VERSION})
    }
}

async function clearOldCaches() {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => {
        if (name !== CACHE_STORAGE_KEY) {
            return caches.delete(name)
        }
    }))
}

