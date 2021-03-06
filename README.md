# Progressive Web App Demo



## Minimal progressive web app

A minimal example (`./minimal`)
 * no Webpack, no Npm, no Workbox, just html5 and plain javascript

A shared global counter that works correctly is usable even with bad connection or when completely offline.
When connectivity is restored, counter is automatically updated in the background.


### Exercises

### Exercise 1: The tricky thing about updating your pwa

* change the background color in style.css and reload page
   * nothing happens because the service worker is using the cached version of style.css
* change the VERSION in the service worker, reload and watch the sequence
    * page loads, still with the old background color
    * new service worker is loaded and the version number in the bottom right changes
    * but the background color still remains unchanged because the style.css was already loaded
* reload the app once more, now the background change will finaly take effect

### Exercise 2: Service worker operates across tabs 

* The client assumes that if the request failed, the counter was not updated on the server, but that may not be true
    * it's variant of the two generals problem - solvable using nonces


## Service workers

### Limitations
 no access to local storage and DOM
