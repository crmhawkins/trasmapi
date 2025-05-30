self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('mi-cache').then((cache) => {
        return cache.addAll([
          '/',

        //   '/script.js'
          // Añade otros recursos aquí
        ]);
      })
    );
});
  
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
});

