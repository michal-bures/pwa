# Progressive Web App Demo

![preview](./doc/screenshot.png)

## Try it live at [counter-pwa.netlify.app](https://counter-pwa.netlify.app)

A simple showcase of a progressive web app. It shows a shared global counter that is installable as an app and
works correctly even with bad connection or when completely offline.

Whenever connectivity is restored, the counter value is automatically synced to the server in the background.

There are two versions of the app in this repository:
 * *DYI version* in `/minimal` is a "pure" implementation with no external dependencies. No Webpack, no Npm, no Workbox, just html5 and plain javascript. 
     * good for learning and very simple use cases like this 
     * not practical for larger apps
     * not ideal for production environment (only compatible with modern evergreen browsers, no minification).

 * *Modern version* in `/modern` is an implementation, that takes full advantage of existing tools and libraries.
    * Webpack helps us produce a production-ready bundle
    * Workbox and it's webpack plugin automates precaching of all resources in the service worker (no need for manual versioning anymore)
    * React and Typescript help make the codebase maintainable and extensible   

## Exercises

Here are some interesting behaviors to explore with the `/minimal` example app.

For some of these you need to runt the app locally - just run `npx serve .` in the serve the `/minimal` directory, or use your favourite web server.

### Inspect the app in chrome dev tools

* Inspect live how the app works with local storage and cache (Application tab)
* Inspect the application manifest (Application tab)
* Observe the lifecycle of the service worker (Application tab)
* Check that the app passes all PWA compliance checks using Lighthouse (Lighthouse tab)

### The tricky thing about updating your PWA (without workbox)

* change the background color in style.css and reload page
   * nothing happens because the service worker is using the cached version of style.css
* change the `VERSION` number in the service worker (`sw.js`), reload and watch the sequence
    * page loads, still with the old background color
    * new service worker is loaded and the version number in the bottom right changes
    * but the background color still remains unchanged because the style.css was already loaded from cache by the old service worker
* reload the app once more, now the background change will finally take effect, as the new service worker no longer uses the old cached version

### How to make the counter even more robust 

* The client assumes that if the request failed, the counter was not updated on the server, but that may not hold true (request might have reached the server, but the response didn't arrive to the client)
    * it's a variant of the two generals problem - solve using nonces

## Credits

* [Netlify](https://netlify.com) - ridiculously easy way to turn your git repo into website, including auto deploy on push.
* [countapi.xyz](https://countapi.xyz) - "Integer as a Service", awesome free counter API that is used as the backend for this app.
