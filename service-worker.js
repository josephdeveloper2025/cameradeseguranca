const CACHE_NAME = 'app-seg-motorista-cache-v1';
const urlsToCache = [
  '/cameradeseguranca/', // A URL raiz do seu app no GitHub Pages
  '/cameradeseguranca/index.html',
  '/cameradeseguranca/manifest.json',
  // Seus ícones (você precisará criar a pasta 'icons' e colocar as imagens lá)
  '/cameradeseguranca/icons/icon-72x72.png',
  '/cameradeseguranca/icons/icon-96x96.png',
  '/cameradeseguranca/icons/icon-128x128.png',
  '/cameradeseguranca/icons/icon-144x144.png',
  '/cameradeseguranca/icons/icon-152x152.png',
  '/cameradeseguranca/icons/icon-192x192.png',
  '/cameradeseguranca/icons/icon-384x384.png',
  '/cameradeseguranca/icons/icon-512x512.png',
  // URLs de CDN (pode ser útil para offline, mas verifique o cache do navegador)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  // Imagem do Google
  'https://img.icons8.com/color/48/000000/google-logo.png'
];

// Instalação do Service Worker e cache de arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

// Intercepta requisições e serve do cache ou da rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrado
        if (response) {
          return response;
        }
        // Tenta buscar da rede
        return fetch(event.request).then(
          response => {
            // Se a resposta for inválida, não armazena em cache
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clona a resposta para que ela possa ser usada pelo cache e pelo navegador
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
      .catch(error => {
        console.error('Fetch failed:', error);
        // Pode servir uma página offline aqui, se tiver uma
        // return caches.match('/offline.html'); 
      })
  );
});

// Limpeza de caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Deleta caches que não estão na whitelist
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

