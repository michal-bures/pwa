console.log('Script loaded!')

const VERSION = 5

const COUNTER_URL = 'https://api.countapi.xyz'
const COUNTER_GET_URL = `${COUNTER_URL}/get`
const COUNTER_UPDATE_URL = `${COUNTER_URL}/update`

const LSKEY_COUNTER = 'counter-value'
const LSKEY_DELTA = 'counter-delta'

const CACHE_STORAGE_KEY = `pwa-counter-v${VERSION}`

const cacheList = [
    "index.html",
    "style.css",
]

self.addEventListener('install', function(e) {
    console.log('install event')
    e.waitUntil(install())
})

self.addEventListener('activate', function(e) {
    console.log('activate event')
    e.waitUntil(activate())
})

self.addEventListener('message', (event) => {
    if (event.data === 'version') {
        event.source.postMessage({serviceWorkerVersion: VERSION})
    }
})

self.addEventListener('fetch', function(e) {
    const req = e.request
    console.log('Fetch event:', req.url)

    if (req.url.startsWith(COUNTER_URL)) {
        try {
            e.respondWith(fetch(req))
        } catch (err) {
            e.respondWith(handleCounterRequestWhileOffline(req))
        }
    } else {
        e.respondWith(
            caches.match(e.request).then((response) => {
                if (response != null) {
                    console.log('Using cache for:', e.request.url)
                    return response
                }
                console.log('Fallback to fetch:', e.request.url)
                return fetch(e.request)
            })
        )
    }
})

async function install() {
    const cache = await caches.open(CACHE_STORAGE_KEY)
    console.log('Adding to Cache:', cacheList)
    await cache.addAll(cacheList)
    await self.skipWaiting()
}


async function activate() {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => {
        if (name !== CACHE_STORAGE_KEY) {
            return caches.delete(name)
        }
    }))
    await self.clients.claim()
    const clients = await self.clients.matchAll()
    for (const client of clients) {
        client.postMessage({serviceWorkerVersion: VERSION})
    }
}

function handleCounterRequestWhileOffline(request) {
    if (request.url.startsWith(COUNTER_GET_URL)) {
        return new Response(getLocalCounterValue(), { headers: { 'Content-Type': 'text/plain' }});
    } else if (request.url.startsWith(COUNTER_UPDATE_URL)) {
        const currentValue = getLocalCounterValue()
        const currentDelta = getLocalDelta()
        const requestUrl = new URL(request.url)
        const newDelta = currentDelta + requestUrl.searchParams.get('value')
        console.log(`current ${currentValue}, delta ${newDelta}`)
        setLocalCounter(currentValue + newDelta)
        setLocalDelta(newDelta)
        return new Response()
    } else {
        throw new Error(`Counter request to url ${request.url} not supported while offline.`)
    }
}

function getLocalCounterValue() {
    let storedValue = localStorage.get(LSKEY_COUNTER)
    let storedDelta = getLocalDelta()
    if (isNaN(storedValue)) storedValue = 0
    return { value: storedValue + storedDelta }
}

function getLocalDelta() {
    let storedDelta = localStorage.get(LSKEY_DELTA)
    if (isNaN(storedDelta)) storedDelta = 0
    return storedDelta
}

function setLocalDelta(newDelta) {
    localStorage.set(LSKEY_DELTA, newDelta.toString())
}

function setLocalCounter(newValue) {
    localStorage.set(LSKEY_COUNTER, newValue.toString())
}
