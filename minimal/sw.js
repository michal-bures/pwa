console.log('Script loaded!')
const cacheStorageKey = 'minimal-pwa-8'

const COUNTER_URL = 'https://api.countapi.xyz'
const COUNTER_GET_URL = `${COUNTER_URL}/get`
const COUNTER_UPDATE_URL = `${COUNTER_URL}/update`

const LSKEY_COUNTER = 'counter-value'
const LSKEY_DELTA = 'counter-delta'

const cacheList = [
    "index.html",
    "style.css",
]

self.addEventListener('install', function(e) {
    console.log('install event')
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache) {
            console.log('Adding to Cache:', cacheList)
            return cache.addAll(cacheList)
        }).then(function() {
            console.log('Skip waiting!')
            return self.skipWaiting()
        })
    )
})

self.addEventListener('activate', function(e) {
    console.log('activate event')
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.map(name => {
                if (name !== cacheStorageKey) {
                    return caches.delete(name)
                }
            })
        }).then(() => {
            console.log('Clients claims.')
            return self.clients.claim()
        })
    )
})

self.addEventListener('fetch', async function(e) {
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
            caches.match(e.request).then(function(response) {
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
