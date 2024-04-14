const myCache = "cache-version1";

console.log("Hello from service worker");

self.addEventListener("install", (e) => {
  // console.log("Service Worker has been installed  ." , e)
  e.waitUntil(
    caches
      .open(myCache)
      .then((cache) => {
        cache.add("/");
        cache.add("/index.html");
        // cache.addAll([
        //     '/Scripts/homepage.js',
        //     '/Scripts/index.js',
        //     '/Scripts/login-process.js',
        //     '/Scripts/login.js',
        //     '/Scripts/signup-onboard.js',
        //     '/Scripts/signup.js',
        //     '/Styles/homepage.css',
        //     '/Styles/index.css',
        //     '/Styles/login-process.css',
        //     '/Styles/login.css',
        //     '/Styles/signup-onboarding.css',
        //     '/Styles/signup.css',
        //     '/homepage.html',
        //     '/index.html',
        //     '/login-process.html',
        //     '/login.html',
        //     '/maifest.json',
        //     '/signup-onboarding.html',
        //     '/signup.html',
        //     '/Icons/android-chrome-36x36.png',
        //     '/Icons/android-chrome-48x48.png',
        //     '/Icons/android-chrome-72x72.png',
        //     '/Icons/android-chrome-96x96.png'
        // ])
      })
      .catch((error) => {
        console.log("Error during creating cache", error);
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // console.log("Service worker has been activated..", e)
  e.waitUntil(
    caches.keys().then((caches) => {
      // console.log(caches)
      return Promise.all(
        caches
          .filter((cacheName) => {
            cacheName !== myCache;
          })
          .map((cacheName) => {
            caches.delete(cacheName);
          })
      );
    })
  );
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  // console.log("Fetching the data from the server or Network..", e)

  if (e.request.method !== "GET") {
    // Do not cache POST requests
    return;
  }

  e.respondWith(
    caches.open(myCache).then((cache) => {
      return cache.match(e.request).then((cResponse) => {
        if (cResponse) {
          return cResponse;
        }
        const fResonse = fetch(e.request).then((nResponse) => {
          cache.put(e.request, nResponse.clone());
          return nResponse;
        });
        return cResponse || fResonse;
      });
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  switch (e.action) {
    case "agree":
      pushMsg("So we both agree on that!");
      break;

    case "notAgree":
      pushMsg("Let's agree to disagree");
      break;

    default:
      pushMsg("Please select any of the option");
      break;
  }
});

function pushMsg(message) {
  self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}
