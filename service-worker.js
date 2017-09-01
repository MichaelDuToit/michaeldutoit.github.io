const CACHE_NAME = 'MDT-v2-';
const coreCacheName = CACHE_NAME + 'core';
const pagesCacheName = CACHE_NAME + 'pages';
const assetsCacheName = CACHE_NAME + 'assets';

const coreCacheUrls = [
    '/js/scripts.js',
    '/css/main.css',
    '/images/woodland.jpg',
    '/offline/',
];

function updateCoreCache(){
    return caches.open(coreCacheName).then(
        cache => {
            return cache.addAll(coreCacheUrls);
        }
    );
};

function addToCache(cacheName, request, response){
    caches.open(cacheName).then(cache => cache.put(request, response));
};

function clearCaches(){
    return caches.keys().then(function(keys){
        return Promise.all(keys.filter(function(key){
            return key.indexOf(version) !== 0;
        }).map(function(key){
            return caches.delete(key);
        })
    );
    })
}
self.addEventListener('install', event => {
    event.waitUntil(updateCoreCache().then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        clearCaches().then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    let request = event.request;
    let acceptHeader = request.headers.get('Accept');
    if(acceptHeader.indexOf('text/html') !== -1){
        event.respondWith(
            fetch(request).then(response => {
                addToCache(pagesCacheName, request, response.clone());
                return response;
            })
            .catch(()=>{
                return caches.match(request).then(response => {
                    return response || caches.match('/offline/');
                })
            })
        );
    }
    else if (acceptHeader.indexOf('text/html') == -1){
        event.respondWith(
            caches.match(request)
            .then(response => {
                return response || fetch(request)
                    .then( response => {
                        addToCache(assetsCacheName, request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        return new Response('<div style="background:grey;color:white;font-weight:bold;display:block">Offline</div>');
                    })
            })
        );
    }
});


