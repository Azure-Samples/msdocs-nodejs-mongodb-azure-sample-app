// sw.js

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open('cache-name')
      .then(() => self.registration.register()) 
  );
});
