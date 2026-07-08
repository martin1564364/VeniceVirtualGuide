"use strict";

const APP_SHELL_VERSION = "2026-07-08-6";
const CACHE_PREFIX = "venice-guide-v";
const META_CACHE = CACHE_PREFIX + "meta";
const ACTIVE_CACHE_KEY = "active-cache";
const PRECACHE_CONCURRENCY = 5;
const SHELL_FILES = [
  "./",
  "index.html",
  "css/app.css",
  "js/app.js",
  "js/player.js",
  "manifest.webmanifest",
  "icons/icon-192.svg",
  "icons/icon-512.svg",
];

function deriveAssetList(placesData) {
  const assets = new Set(SHELL_FILES);
  for (const place of placesData.places) {
    if (place.image) assets.add(place.image);
    if (place.imageThumb) assets.add(place.imageThumb);
    for (const lang of ["pl", "en"]) {
      const local = place[lang];
      if (local && local.audio) assets.add(local.audio);
    }
  }
  return [...assets];
}

async function broadcast(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) client.postMessage(message);
}

function cacheNameForVersion(placesVersion, routesVersion) {
  return CACHE_PREFIX + APP_SHELL_VERSION + "-" + placesVersion + "-" + routesVersion;
}

async function getActiveCacheName() {
  try {
    const cache = await caches.open(META_CACHE);
    const res = await cache.match(ACTIVE_CACHE_KEY);
    if (!res) return null;
    const data = await res.json();
    return data.cacheName || null;
  } catch {
    return null;
  }
}

async function setActiveCacheName(cacheName) {
  const cache = await caches.open(META_CACHE);
  await cache.put(ACTIVE_CACHE_KEY, new Response(JSON.stringify({ cacheName })));
}

// Fetches each asset individually (rather than cache.addAll, which is
// atomic) so a single missing file — e.g. audio not yet recorded for a
// place — doesn't abort the whole precache install.
async function precacheAll(cacheName, assets) {
  const cache = await caches.open(cacheName);
  let done = 0;
  let nextIndex = 0;
  const failed = [];
  await broadcast({ type: "precache-progress", cacheName, done, total: assets.length });

  async function runWorker() {
    while (nextIndex < assets.length) {
      const url = assets[nextIndex];
      nextIndex += 1;
      try {
        const response = await fetch(url, { cache: "no-cache" });
        if (response.ok) await cache.put(url, response);
        else failed.push(url);
      } catch {
        failed.push(url);
      } finally {
        done += 1;
        await broadcast({ type: "precache-progress", cacheName, done, total: assets.length });
      }
    }
  }

  const workerCount = Math.min(PRECACHE_CONCURRENCY, assets.length);
  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));

  if (failed.length > 0) {
    await broadcast({ type: "precache-incomplete", cacheName, failed, total: assets.length });
  } else {
    await broadcast({ type: "precache-complete", cacheName, total: assets.length });
  }
  return failed;
}

async function fetchRoutesData() {
  const routesRes = await fetch("routes.json", { cache: "no-cache" });
  return routesRes.json();
}

async function installCacheFromContent(placesData, routesData) {
  const cacheName = cacheNameForVersion(placesData.version, routesData.version);
  const assets = deriveAssetList(placesData);
  assets.push("places.json");
  assets.push("routes.json");
  const failed = await precacheAll(cacheName, assets);
  if (failed.length > 0) {
    await caches.delete(cacheName);
    throw new Error("Precache incomplete: " + failed.join(", "));
  }
  await setActiveCacheName(cacheName);
  return cacheName;
}

async function updateCacheIfNeeded(placesResponse) {
  const placesData = await placesResponse.clone().json();
  const routesData = await fetchRoutesData();
  const cacheName = cacheNameForVersion(placesData.version, routesData.version);
  const activeCacheName = await getActiveCacheName();
  if (activeCacheName !== cacheName) {
    await installCacheFromContent(placesData, routesData);
    await deleteOldCaches(cacheName);
  }
}

async function deleteOldCaches(activeCacheName) {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== META_CACHE && key !== activeCacheName)
      .map((key) => caches.delete(key))
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const placesRes = await fetch("places.json", { cache: "no-cache" });
      const placesData = await placesRes.json();
      const routesData = await fetchRoutesData();
      await installCacheFromContent(placesData, routesData);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const active = await getActiveCacheName();
      await deleteOldCaches(active);
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.pathname.endsWith("/places.json") || url.pathname.endsWith("/routes.json")) {
    // Network-first for content manifests so version bumps are detected promptly.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && url.pathname.endsWith("/places.json")) {
            updateCacheIfNeeded(res.clone()).catch((err) => {
              console.error("Service worker content update failed", err);
            });
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "skip-waiting") {
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (msg.type !== "get-cache-status") return;

  event.waitUntil(
    (async () => {
      const activeCacheName = await getActiveCacheName();
      const ready = activeCacheName ? await caches.has(activeCacheName) : false;
      if (event.source) {
        event.source.postMessage({
          type: "cache-status",
          ready,
          cacheName: activeCacheName,
        });
      }
    })()
  );
});
