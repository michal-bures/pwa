# Progressive Web App Demo

![preview](./doc/screenshot.png)

A simple showcase of a progressive web app. It shows a shared global counter that works correctly even with bad connection or when completely offline.

Whenever connectivity is restored, the counter value is automatically updated in the background.

There are two versions of the app in this repository:
 * *DYI version* in `/minimal` is a "pure" implementation with no external dependencies. No Webpack, no Npm, no Workbox, just html5 and plain javascript. 
     * good for learning and very simple use cases like this 
     * not practical for larger apps
     * not ideal for production environment (only compatible with modern evergreen browsers, no minification).

 * *Modern version* in `/modern` is an implementation, that takes full advantage of existing tools and libraries.

## Service workers

## Exercises

Here are some interesting behaviors to explore with the `/minimal` example app.

Run the example locally by serving the `/minimal` directory with your favourite web server


### Verifying PWA compliance

* Open chrome dev tools and check that the app is PWA using Lighthouse

### The tricky thing about updating your pwa (without workbox)

* change the background color in style.css and reload page
   * nothing happens because the service worker is using the cached version of style.css
* change the `VERSION` number in the service worker (`sw.js`), reload and watch the sequence
    * page loads, still with the old background color
    * new service worker is loaded and the version number in the bottom right changes
    * but the background color still remains unchanged because the style.css was already loaded from cache by the old service worker
* reload the app once more, now the background change will finally take effect, as the new service worker no longer uses the old cached version

### Service worker operates across tabs 

* The client assumes that if the request failed, the counter was not updated on the server, but that may not be true
    * it's variant of the two generals problem - solvable using nonces


### Limitations
 no access to local storage and DOM
