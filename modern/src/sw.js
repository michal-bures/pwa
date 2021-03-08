import {precacheAndRoute} from 'workbox-precaching';
import {hashCode} from 'hashcode';

const WEBPACK_MANIFEST = self.__WB_MANIFEST
const SW_VERSION = hashCode().value(WEBPACK_MANIFEST)

precacheAndRoute(WEBPACK_MANIFEST);

console.log('service worker is precaching resources:\n', WEBPACK_MANIFEST, {serviceWorkerVersion: SW_VERSION})

self.addEventListener('message', (event) => {
    if (event.data === 'version') {
        event.source.postMessage({serviceWorkerVersion: SW_VERSION})
    }
})

self.addEventListener('install', function(e) {
    console.log('install event')
    self.skipWaiting()
})

self.addEventListener('activate', function(e) {
    console.log('activate event')
    e.waitUntil(activate())
})

async function activate() {
    await self.clients.claim()
    const clients = await self.clients.matchAll()
    for (const client of clients) {
        client.postMessage({serviceWorkerVersion: SW_VERSION})
    }
}
