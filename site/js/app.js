(function () {
  "use strict";

  const LANG_KEY = "venice-guide-lang";
  const DEFAULT_LANG = "pl";
  const SUPPORTED_LANGS = ["pl", "en"];
  const VENICE_CENTER = { lat: 45.4341, lng: 12.3388 };
  const MAX_MAP_LOCATION_DISTANCE_METERS = 20000;

  const I18N = {
    back: { pl: "Wstecz", en: "Back" },
    openMaps: { pl: "Otwórz w Mapach Google", en: "Open in Google Maps" },
    offlineReady: { pl: "✓ Gotowe offline", en: "✓ Ready for offline use" },
    offlineUnavailable: { pl: "Offline niedostępne", en: "Offline unavailable" },
    downloading: { pl: "Pobieranie…", en: "Downloading…" },
  };

  I18N.offlineIncomplete = { pl: "Offline incomplete", en: "Offline incomplete" };
  I18N.nearest = { pl: "Najblizej", en: "Nearest" };
  I18N.guideOrder = { pl: "Kolejnosc", en: "Guide order" };
  I18N.locationUnavailable = { pl: "Lokalizacja niedostepna", en: "Location unavailable" };
  I18N.map = { pl: "Mapa", en: "Map" };
  I18N.list = { pl: "Lista", en: "List" };
  I18N.mapHint = { pl: "Dotknij pinezki, aby otworzyc szczegoly miejsca.", en: "Tap a marker to open place details." };
  I18N.mapLocationFar = { pl: "Jestes dalej niz 20 km od Wenecji, dlatego mapa pokazuje samo miasto.", en: "You are more than 20 km from Venice, so the map is centered on Venice only." };

  const state = {
    places: null,
    lang: getInitialLang(),
    player: null,
    map: null,
    sortMode: "guide",
    userLocation: null,
  };

  const appEl = document.getElementById("app");
  const offlineStatusEl = document.getElementById("offline-status");
  const langButtons = document.querySelectorAll(".lang-toggle__btn");
  const viewListBtn = document.getElementById("view-list");
  const viewMapBtn = document.getElementById("view-map");
  const sortNearestBtn = document.getElementById("sort-nearest");

  function getInitialLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const browserLang = (navigator.language || "").slice(0, 2);
    return SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG;
  }

  function setLang(lang, options = {}) {
    const changed = state.lang !== lang;
    state.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    langButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    if (changed || options.forceRender) render();
  }

  function updateSortButton() {
    sortNearestBtn.textContent = state.sortMode === "nearest" ? t("guideOrder") : t("nearest");
    sortNearestBtn.setAttribute("aria-pressed", String(state.sortMode === "nearest"));
  }

  function updateViewMapButton(isMapView) {
    viewListBtn.setAttribute("aria-pressed", String(!isMapView));
    viewMapBtn.setAttribute("aria-pressed", String(isMapView));
  }

  function t(key) {
    return (I18N[key] && I18N[key][state.lang]) || key;
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  sortNearestBtn.addEventListener("click", () => {
    if (state.sortMode === "nearest") {
      state.sortMode = "guide";
      updateSortButton();
      render();
      return;
    }

    getUserLocation()
      .then((coords) => {
        state.userLocation = coords;
        state.sortMode = "nearest";
        updateSortButton();
        render();
      })
      .catch((err) => {
        console.error("Location unavailable", err);
        offlineStatusEl.textContent = t("locationUnavailable");
      });
  });

  viewListBtn.addEventListener("click", () => {
    location.hash = "#/";
  });

  viewMapBtn.addEventListener("click", () => {
    location.hash = "#/map";
  });

  function stopCurrentPlayer() {
    if (!state.player) return;
    state.player.stop();
    state.player = null;
  }

  function destroyCurrentMap() {
    if (!state.map) return;
    state.map.remove();
    state.map = null;
  }

  function findPlace(id) {
    return state.places.places.find((p) => p.id === id);
  }

  function parseRoute() {
    const hash = location.hash.replace(/^#/, "") || "/";
    if (hash === "/map") return { view: "map" };
    const match = hash.match(/^\/place\/([^/]+)/);
    return match ? { view: "detail", id: match[1] } : { view: "list" };
  }

  function getUserLocation() {
    if (state.userLocation) return Promise.resolve(state.userLocation);
    if (!("geolocation" in navigator)) return Promise.reject(new Error("Geolocation is not supported."));

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        reject,
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 10000,
        }
      );
    });
  }

  function distanceMeters(from, to) {
    const earthRadius = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const lat1 = toRad(from.lat);
    const lat2 = toRad(to.lat);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function formatDistance(meters) {
    if (meters < 1000) return Math.round(meters / 10) * 10 + " m";
    return (meters / 1000).toFixed(meters < 10000 ? 1 : 0) + " km";
  }

  function render() {
    if (!state.places) return;
    stopCurrentPlayer();
    destroyCurrentMap();
    updateSortButton();
    const route = parseRoute();
    updateViewMapButton(route.view === "map");
    sortNearestBtn.hidden = route.view !== "list";
    if (route.view === "detail") {
      const place = findPlace(route.id);
      if (place) renderDetail(place);
      else renderList();
    } else if (route.view === "map") {
      renderMap();
    } else {
      renderList();
    }
  }

  function renderList() {
    const tplList = document.getElementById("tpl-list").content.cloneNode(true);
    const listEl = tplList.querySelector(".place-list");
    const itemTpl = document.getElementById("tpl-list-item");

    const places = [...state.places.places].sort((a, b) => {
      if (state.sortMode === "nearest" && state.userLocation) {
        return distanceMeters(state.userLocation, a.coords) - distanceMeters(state.userLocation, b.coords);
      }
      return a.order - b.order;
    });
    for (const place of places) {
      const node = itemTpl.content.cloneNode(true);
      const local = place[state.lang];
      node.querySelector(".place-card__link").href = "#/place/" + place.id;
      const img = node.querySelector(".place-card__thumb");
      img.src = place.imageThumb;
      img.alt = local.name;
      node.querySelector(".place-card__name").textContent = local.name;
      node.querySelector(".place-card__tagline").textContent = local.tagline;
      const minutes = Math.round(local.audioDuration / 60);
      const meta = ["▶ ~" + minutes + " min"];
      if (state.sortMode === "nearest" && state.userLocation) {
        meta.push(formatDistance(distanceMeters(state.userLocation, place.coords)));
      }
      node.querySelector(".place-card__duration").textContent = meta.join(" · ");
      listEl.appendChild(node);
    }

    appEl.replaceChildren(tplList);
  }

  function renderDetail(place) {
    const tpl = document.getElementById("tpl-detail").content.cloneNode(true);
    const local = place[state.lang];

    tpl.querySelector(".back-link [data-i18n='back']").textContent = t("back");
    const img = tpl.querySelector(".place-detail__image");
    img.src = place.image;
    img.alt = local.name;
    tpl.querySelector(".place-detail__name").textContent = local.name;
    tpl.querySelector(".place-detail__tagline").textContent = local.tagline;
    tpl.querySelector(".place-detail__text").textContent = local.text;

    const mapsLink = tpl.querySelector(".maps-link");
    mapsLink.href = "https://www.google.com/maps/search/?api=1&query=" + place.coords.lat + "," + place.coords.lng;
    mapsLink.textContent = t("openMaps");

    appEl.replaceChildren(tpl);

    const playerRoot = appEl.querySelector(".audio-player");
    state.player = new window.AudioPlayer(playerRoot);
    state.player.load({
      src: local.audio,
      title: local.name,
      artist: "Venice Virtual Guide",
      artwork: place.image,
    });
  }

  function createPopupHtml(place) {
    const local = place[state.lang];
    return (
      '<div class="map-popup" data-place-id="' + place.id + '">' +
      '<h3 class="map-popup__name">' + escapeHtml(local.name) + "</h3>" +
      '<p class="map-popup__tagline">' + escapeHtml(local.tagline) + "</p>" +
      "</div>"
    );
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderMap() {
    const tpl = document.getElementById("tpl-map").content.cloneNode(true);
    appEl.replaceChildren(tpl);

    const mapStatusEl = document.getElementById("map-status");
    mapStatusEl.textContent = t("mapHint");

    if (!window.L) {
      mapStatusEl.textContent = "Map library failed to load.";
      return;
    }

    const map = window.L.map("map-canvas", {
      zoomControl: true,
    });
    state.map = map;

    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const placeBounds = [];
    for (const place of state.places.places) {
      const local = place[state.lang];
      const marker = window.L.circleMarker([place.coords.lat, place.coords.lng], {
        radius: 7,
        color: "#8a4a6b",
        weight: 2,
        fillColor: "#f7d6a3",
        fillOpacity: 0.95,
      }).addTo(map);

      marker.bindPopup(createPopupHtml(place), {
        closeButton: false,
        offset: [0, -4],
      });
      marker.bindTooltip(local.name, {
        direction: "top",
        opacity: 0.9,
      });
      marker.on("popupopen", (event) => {
        const popupEl = event.popup.getElement();
        if (!popupEl) return;
        popupEl.addEventListener("click", () => {
          location.hash = "#/place/" + place.id;
        }, { once: true });
      });
      placeBounds.push([place.coords.lat, place.coords.lng]);
    }

    map.fitBounds(placeBounds, {
      padding: [24, 24],
      maxZoom: 14,
    });

    getUserLocation()
      .then((coords) => {
        if (state.map !== map) return;
        state.userLocation = coords;
        if (distanceMeters(coords, VENICE_CENTER) > MAX_MAP_LOCATION_DISTANCE_METERS) {
          mapStatusEl.textContent = t("mapLocationFar");
          map.fitBounds(placeBounds, {
            padding: [24, 24],
            maxZoom: 14,
          });
          return;
        }

        window.L.circleMarker([coords.lat, coords.lng], {
          radius: 8,
          color: "#155eef",
          weight: 2,
          fillColor: "#7dd3fc",
          fillOpacity: 1,
        })
          .bindPopup("You are here")
          .addTo(map);

        const boundsWithUser = placeBounds.concat([[coords.lat, coords.lng]]);
        map.fitBounds(boundsWithUser, {
          padding: [24, 24],
          maxZoom: 14,
        });
      })
      .catch(() => {
        if (state.map !== map) return;
        map.fitBounds(placeBounds, {
          padding: [24, 24],
          maxZoom: 14,
        });
      });
  }

  window.addEventListener("hashchange", render);

  fetch("places.json")
    .then((res) => res.json())
    .then((data) => {
      state.places = data;
      setLang(state.lang, { forceRender: true });
    })
    .catch((err) => {
      appEl.textContent = "Failed to load guide content.";
      console.error(err);
    });

  // --- Service worker registration + first-run download progress ---
  const downloadScreen = document.getElementById("download-screen");
  const downloadStatus = document.getElementById("download-status");
  const downloadFill = document.getElementById("download-progress-fill");
  const downloadCount = document.getElementById("download-count");
  const downloadSkip = document.getElementById("download-skip");

  function hideDownloadScreen() {
    downloadScreen.hidden = true;
    downloadScreen.style.display = "none";
  }

  function showDownloadScreen() {
    downloadScreen.style.display = "";
    downloadScreen.hidden = false;
  }

  downloadSkip.addEventListener("click", () => {
    hideDownloadScreen();
  });

  if ("serviceWorker" in navigator) {
    function requestCacheStatus(registration) {
      const worker =
        navigator.serviceWorker.controller ||
        (registration && (registration.active || registration.waiting || registration.installing));
      if (worker) worker.postMessage({ type: "get-cache-status" });
    }

    navigator.serviceWorker.addEventListener("message", (event) => {
      const msg = event.data || {};
      if (msg.type === "precache-progress") {
        if (!msg.total) return;
        showDownloadScreen();
        const pct = msg.total ? Math.round((msg.done / msg.total) * 100) : 0;
        downloadFill.style.width = pct + "%";
        downloadCount.textContent = msg.done + " / " + msg.total + " files";
        downloadStatus.textContent = t("downloading");
      } else if (msg.type === "precache-complete") {
        downloadStatus.textContent = t("offlineReady");
        offlineStatusEl.textContent = t("offlineReady");
        setTimeout(() => {
          hideDownloadScreen();
        }, 800);
      } else if (msg.type === "precache-incomplete") {
        downloadStatus.textContent = t("offlineIncomplete");
        offlineStatusEl.textContent = t("offlineIncomplete");
      } else if (msg.type === "cache-status") {
        offlineStatusEl.textContent = msg.ready ? t("offlineReady") : t("offlineUnavailable");
      }
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      requestCacheStatus();
    });

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then((registration) => {
          if ("storage" in navigator && "persist" in navigator.storage) {
            navigator.storage.persist();
          }
          navigator.serviceWorker.ready.then(() => requestCacheStatus(registration));
        })
        .catch((err) => {
          console.error("Service worker registration failed", err);
          offlineStatusEl.textContent = t("offlineUnavailable");
        });
    });
  } else {
    offlineStatusEl.textContent = t("offlineUnavailable");
  }
})();
