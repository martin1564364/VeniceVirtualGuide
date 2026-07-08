(function () {
  "use strict";

  const LANG_KEY = "venice-guide-lang";
  const DEFAULT_LANG = "pl";
  const SUPPORTED_LANGS = ["pl", "en"];
  const VENICE_CENTER = { lat: 45.4341, lng: 12.3388 };
  const MAX_MAP_LOCATION_DISTANCE_METERS = 20000;
  const MAP_VIEWBOX = { width: 1000, height: 720, padding: 72 };

  const I18N = {
    back: { pl: "Wstecz", en: "Back" },
    openMaps: { pl: "Otwórz w Mapach Google", en: "Open in Google Maps" },
    offlineReady: { pl: "✓ Gotowe offline", en: "✓ Ready for offline use" },
    offlineUnavailable: { pl: "Offline niedostępne", en: "Offline unavailable" },
    offlinePreparing: { pl: "Przygotowanie offline", en: "Preparing offline" },
    downloading: { pl: "Pobieranie…", en: "Downloading…" },
  };

  I18N.offlineIncomplete = { pl: "Offline incomplete", en: "Offline incomplete" };
  I18N.nearest = { pl: "Najblizej", en: "Nearest" };
  I18N.guideOrder = { pl: "Kolejnosc", en: "Guide order" };
  I18N.locationUnavailable = { pl: "Lokalizacja niedostepna", en: "Location unavailable" };
  I18N.map = { pl: "Mapa", en: "Map" };
  I18N.list = { pl: "Lista", en: "List" };
  I18N.routes = { pl: "Trasy", en: "Routes" };
  I18N.routesTitle = { pl: "Propozycje tras", en: "Suggested routes" };
  I18N.routesIntro = {
    pl: "Warianty na 13 i 14 lipca 2026 ze startem i powrotem przy Via Hermada 44.",
    en: "Options for July 13 and 14, 2026 starting and finishing at Via Hermada 44.",
  };
  I18N.hours = { pl: "godz.", en: "h" };
  I18N.walking = { pl: "pieszo", en: "walking" };
  I18N.lines = { pl: "linie", en: "lines" };
  I18N.openStop = { pl: "Otwórz w przewodniku", en: "Open in guide" };
  I18N.viewRouteMap = { pl: "Pokaz na mapie", en: "View on map" };
  I18N.routeMapHint = { pl: "Dotknij punktu trasy, aby podejrzec miejsce i otworzyc przewodnik.", en: "Tap a route stop to preview the place and open the guide." };
  I18N.timeline = { pl: "Plan", en: "Timeline" };
  I18N.short = { pl: "Krótka", en: "Short" };
  I18N.medium = { pl: "Średnia", en: "Medium" };
  I18N.full = { pl: "Pełna", en: "Full" };
  I18N.mapHint = { pl: "Dotknij pinezki, aby podejrzec miejsce i otworzyc przewodnik.", en: "Tap a marker to preview the place and open the guide." };
  I18N.mapLocationFar = { pl: "Jestes dalej niz 20 km od Wenecji, dlatego mapa pokazuje samo miasto.", en: "You are more than 20 km from Venice, so the map is centered on Venice only." };
  I18N.mapLocationOutside = {
    pl: "Twoja lokalizacja jest poza zakresem tej mapy offline, dlatego pokazujemy tylko miejsca z przewodnika.",
    en: "Your location is outside this offline map area, so only guide places are shown.",
  };
  I18N.mapOffline = { pl: "Mapa dziala w pelni offline.", en: "This map works fully offline." };
  I18N.youAreHere = { pl: "Jestes tutaj", en: "You are here" };

  const state = {
    places: null,
    routes: null,
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
  const viewRoutesBtn = document.getElementById("view-routes");
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

  function updateViewButtons(view) {
    viewListBtn.textContent = t("list");
    viewRoutesBtn.textContent = t("routes");
    viewMapBtn.textContent = t("map");
    viewListBtn.setAttribute("aria-pressed", String(view === "list"));
    viewRoutesBtn.setAttribute("aria-pressed", String(view === "routes" || view === "route-detail" || view === "route-map"));
    viewMapBtn.setAttribute("aria-pressed", String(view === "map" || view === "route-map"));
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

  viewRoutesBtn.addEventListener("click", () => {
    location.hash = "#/routes";
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
    if (typeof state.map.destroy === "function") state.map.destroy();
    state.map = null;
  }

  function findPlace(id) {
    return state.places.places.find((p) => p.id === id);
  }

  function findRoute(id) {
    return state.routes.routes.find((route) => route.id === id);
  }

  function parseRoute() {
    const hash = location.hash.replace(/^#/, "") || "/";
    if (hash === "/map") return { view: "map" };
    if (hash === "/routes") return { view: "routes" };
    const routeMapMatch = hash.match(/^\/route\/([^/]+)\/map/);
    if (routeMapMatch) return { view: "route-map", id: routeMapMatch[1] };
    const routeMatch = hash.match(/^\/route\/([^/]+)/);
    if (routeMatch) return { view: "route-detail", id: routeMatch[1] };
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
    if (!state.places || !state.routes) return;
    stopCurrentPlayer();
    destroyCurrentMap();
    updateSortButton();
    const route = parseRoute();
    updateViewButtons(route.view);
    sortNearestBtn.hidden = route.view !== "list";
    if (route.view === "detail") {
      const place = findPlace(route.id);
      if (place) renderDetail(place);
      else renderList();
    } else if (route.view === "route-detail") {
      const routePlan = findRoute(route.id);
      if (routePlan) renderRouteDetail(routePlan);
      else renderRoutes();
    } else if (route.view === "route-map") {
      const routePlan = findRoute(route.id);
      if (routePlan) renderMap(routePlan);
      else renderRoutes();
    } else if (route.view === "map") {
      renderMap();
    } else if (route.view === "routes") {
      renderRoutes();
    } else {
      renderList();
    }
  }

  function formatRouteDate(value) {
    const date = new Date(value + "T12:00:00");
    return new Intl.DateTimeFormat(state.lang === "pl" ? "pl-PL" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function routeMeta(route) {
    const parts = [
      t(route.variant),
      "~" + route.durationHours + " " + t("hours"),
      route.walkingKm.toFixed(1) + " km " + t("walking"),
    ];
    if (route.transitLines && route.transitLines.length) {
      parts.push(t("lines") + ": " + route.transitLines.join(", "));
    }
    return parts.join(" · ");
  }

  function renderRoutes() {
    const tpl = document.getElementById("tpl-routes").content.cloneNode(true);
    tpl.querySelector(".section-intro__title").textContent = t("routesTitle");
    tpl.querySelector(".section-intro__text").textContent = t("routesIntro");

    const listEl = tpl.querySelector(".route-list");
    const cardTpl = document.getElementById("tpl-route-card");
    for (const route of state.routes.routes) {
      const local = route[state.lang];
      const card = cardTpl.content.cloneNode(true);
      card.querySelector(".route-card__link").href = "#/route/" + route.id;
      card.querySelector(".route-card__eyebrow").textContent = formatRouteDate(route.day) + " · " + local.intensity;
      card.querySelector(".route-card__name").textContent = local.name;
      card.querySelector(".route-card__summary").textContent = local.summary;
      card.querySelector(".route-card__meta").textContent = routeMeta(route);
      listEl.appendChild(card);
    }
    appEl.replaceChildren(tpl);
  }

  function stepLabel(step) {
    if (step.kind === "place") {
      const place = findPlace(step.placeId);
      return place ? place[state.lang].name : step.placeId;
    }
    return step[state.lang] || step.en || step.pl || "";
  }

  function stepKindLabel(kind) {
    const labels = {
      place: { pl: "Miejsce", en: "Place" },
      transfer: { pl: "Transport", en: "Transfer" },
      walk: { pl: "Spacer", en: "Walk" },
      break: { pl: "Przerwa", en: "Break" },
    };
    return labels[kind] ? labels[kind][state.lang] : kind;
  }

  function renderRouteDetail(route) {
    const tpl = document.getElementById("tpl-route-detail").content.cloneNode(true);
    const local = route[state.lang];
    tpl.querySelector(".back-link [data-i18n='back']").textContent = t("back");
    tpl.querySelector(".route-detail__eyebrow").textContent = formatRouteDate(route.day) + " · " + local.intensity;
    tpl.querySelector(".route-detail__name").textContent = local.name;
    tpl.querySelector(".route-detail__summary").textContent = local.summary;
    tpl.querySelector(".route-detail__meta").textContent = routeMeta(route);
    const routeMapLink = tpl.querySelector(".route-map-link");
    routeMapLink.href = "#/route/" + route.id + "/map";
    routeMapLink.textContent = t("viewRouteMap");

    const notesEl = tpl.querySelector(".route-notes");
    const notes = [...((state.routes.base && state.routes.base.notes) || []), ...((local && local.notes) || [])];
    for (const note of notes) {
      const p = document.createElement("p");
      p.textContent = typeof note === "string" ? note : note[state.lang];
      notesEl.appendChild(p);
    }

    const timelineEl = tpl.querySelector(".route-timeline");
    for (const step of route.steps) {
      const li = document.createElement("li");
      li.className = "route-step route-step--" + step.kind;

      const time = document.createElement("div");
      time.className = "route-step__time";
      time.textContent = step.time || "";
      li.appendChild(time);

      const body = document.createElement("div");
      body.className = "route-step__body";
      const meta = document.createElement("p");
      meta.className = "route-step__meta";
      meta.textContent = stepKindLabel(step.kind) + (step.durationMinutes ? " · " + step.durationMinutes + " min" : "");
      const title = document.createElement("h2");
      title.className = "route-step__title";
      title.textContent = stepLabel(step);
      body.appendChild(meta);
      body.appendChild(title);

      if (step.kind === "place") {
        const place = findPlace(step.placeId);
        if (place) {
          const tag = document.createElement("p");
          tag.className = "route-step__tagline";
          tag.textContent = place[state.lang].tagline;
          const link = document.createElement("a");
          link.className = "route-step__link";
          link.href = "#/place/" + place.id;
          link.textContent = t("openStop");
          body.appendChild(tag);
          body.appendChild(link);
        }
      }

      li.appendChild(body);
      timelineEl.appendChild(li);
    }

    appEl.replaceChildren(tpl);
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

  function placesForRoute(route) {
    const places = [];
    const seen = new Set();
    for (const step of route.steps) {
      if (step.kind !== "place" || seen.has(step.placeId)) continue;
      const place = findPlace(step.placeId);
      if (!place) continue;
      seen.add(place.id);
      places.push(place);
    }
    return places;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function buildMapGeometry(places, extraCoords) {
    const coords = places.map((place) => place.coords).concat(extraCoords || []);
    let minLat = coords[0].lat;
    let maxLat = coords[0].lat;
    let minLng = coords[0].lng;
    let maxLng = coords[0].lng;

    coords.forEach((coord) => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });

    const latSpan = Math.max(maxLat - minLat, 0.01);
    const lngSpan = Math.max(maxLng - minLng, 0.01);
    const drawWidth = MAP_VIEWBOX.width - MAP_VIEWBOX.padding * 2;
    const drawHeight = MAP_VIEWBOX.height - MAP_VIEWBOX.padding * 2;
    const scale = Math.min(drawWidth / lngSpan, drawHeight / latSpan);
    const contentWidth = lngSpan * scale;
    const contentHeight = latSpan * scale;

    return {
      minLat,
      maxLat,
      minLng,
      maxLng,
      scale,
      offsetX: (MAP_VIEWBOX.width - contentWidth) / 2,
      offsetY: (MAP_VIEWBOX.height - contentHeight) / 2,
    };
  }

  function isCoordInsideGeometryBounds(coords, geometry) {
    return (
      coords.lat >= geometry.minLat &&
      coords.lat <= geometry.maxLat &&
      coords.lng >= geometry.minLng &&
      coords.lng <= geometry.maxLng
    );
  }

  function projectCoords(coords, geometry) {
    return {
      x: geometry.offsetX + (coords.lng - geometry.minLng) * geometry.scale,
      y: geometry.offsetY + (geometry.maxLat - coords.lat) * geometry.scale,
    };
  }

  function buildLandMasses(projectedPlaces) {
    const masses = [];
    const remaining = projectedPlaces.slice();
    const clusterRadius = 120;

    while (remaining.length) {
      const seed = remaining.shift();
      const cluster = [seed];
      let changed = true;

      while (changed) {
        changed = false;
        for (let i = remaining.length - 1; i >= 0; i -= 1) {
          const candidate = remaining[i];
          const isNearCluster = cluster.some((point) => {
            const dx = point.point.x - candidate.point.x;
            const dy = point.point.y - candidate.point.y;
            return Math.sqrt(dx * dx + dy * dy) <= clusterRadius;
          });
          if (!isNearCluster) continue;
          cluster.push(candidate);
          remaining.splice(i, 1);
          changed = true;
        }
      }

      const xs = cluster.map((item) => item.point.x);
      const ys = cluster.map((item) => item.point.y);
      const minX = Math.min.apply(null, xs);
      const maxX = Math.max.apply(null, xs);
      const minY = Math.min.apply(null, ys);
      const maxY = Math.max.apply(null, ys);
      masses.push({
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        rx: Math.max(64, (maxX - minX) / 2 + 56),
        ry: Math.max(42, (maxY - minY) / 2 + 44),
      });
    }

    return masses;
  }

  function createSvgElement(name, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs || {}).forEach((key) => {
      el.setAttribute(key, String(attrs[key]));
    });
    return el;
  }

  function renderMapBackground(svg, landMasses, routePoints) {
    svg.appendChild(createSvgElement("rect", {
      x: 0,
      y: 0,
      width: MAP_VIEWBOX.width,
      height: MAP_VIEWBOX.height,
      class: "map-water",
      rx: 28,
      ry: 28,
    }));

    for (let i = 1; i < 5; i += 1) {
      const y = (MAP_VIEWBOX.height / 5) * i;
      svg.appendChild(createSvgElement("path", {
        d: "M 0 " + y + " C 180 " + (y - 24) + ", 320 " + (y + 18) + ", 520 " + y + " S 840 " + (y - 20) + ", 1000 " + y,
        class: "map-current",
      }));
    }

    landMasses.forEach((mass) => {
      svg.appendChild(createSvgElement("ellipse", {
        cx: mass.cx,
        cy: mass.cy,
        rx: mass.rx,
        ry: mass.ry,
        class: "map-land",
      }));
      svg.appendChild(createSvgElement("ellipse", {
        cx: mass.cx,
        cy: mass.cy,
        rx: Math.max(24, mass.rx - 18),
        ry: Math.max(18, mass.ry - 14),
        class: "map-land map-land--inner",
      }));
    });

    if (routePoints && routePoints.length > 1) {
      svg.appendChild(createSvgElement("polyline", {
        points: routePoints.map((point) => point.x + "," + point.y).join(" "),
        class: "map-route-line",
      }));
    }
  }

  function createMapPanel(canvas) {
    const panel = document.createElement("section");
    panel.className = "map-panel";
    panel.hidden = true;
    canvas.appendChild(panel);
    return panel;
  }

  function openMapPanel(panel, place, markerIndex) {
    const local = place[state.lang];
    panel.hidden = false;
    panel.innerHTML = "";

    if (typeof markerIndex === "number") {
      const step = document.createElement("p");
      step.className = "map-popup__step";
      step.textContent = String(markerIndex + 1);
      panel.appendChild(step);
    }

    const title = document.createElement("h3");
    title.className = "map-popup__name";
    title.textContent = local.name;
    panel.appendChild(title);

    const tagline = document.createElement("p");
    tagline.className = "map-popup__tagline";
    tagline.textContent = local.tagline;
    panel.appendChild(tagline);

    const link = document.createElement("a");
    link.className = "map-popup__link";
    link.href = "#/place/" + place.id;
    link.textContent = t("openStop");
    panel.appendChild(link);
  }

  function buildMarkerButton(place, point, markerIndex, panel, buttons) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-marker" + (typeof markerIndex === "number" ? " map-marker--route" : "");
    button.style.left = clamp((point.x / MAP_VIEWBOX.width) * 100, 4, 96) + "%";
    button.style.top = clamp((point.y / MAP_VIEWBOX.height) * 100, 6, 94) + "%";
    button.setAttribute("aria-label", place[state.lang].name);

    if (typeof markerIndex === "number") {
      button.textContent = String(markerIndex + 1);
    } else {
      const dot = document.createElement("span");
      dot.className = "map-marker__dot";
      button.appendChild(dot);
    }

    button.addEventListener("click", () => {
      buttons.forEach((otherButton) => otherButton.classList.remove("is-active"));
      button.classList.add("is-active");
      openMapPanel(panel, place, markerIndex);
    });

    return button;
  }

  function buildUserMarker(point) {
    const marker = document.createElement("div");
    marker.className = "map-user";
    marker.style.left = clamp((point.x / MAP_VIEWBOX.width) * 100, 4, 96) + "%";
    marker.style.top = clamp((point.y / MAP_VIEWBOX.height) * 100, 6, 94) + "%";
    marker.setAttribute("aria-label", t("youAreHere"));
    return marker;
  }

  function renderMap(routePlan) {
    const tpl = document.getElementById("tpl-map").content.cloneNode(true);
    appEl.replaceChildren(tpl);

    const canvas = document.getElementById("map-canvas");
    const mapStatusEl = document.getElementById("map-status");
    const baseHint = routePlan ? t("routeMapHint") : t("mapHint");
    mapStatusEl.textContent = baseHint;

    const mappedPlaces = routePlan ? placesForRoute(routePlan) : state.places.places;
    if (!mappedPlaces.length) {
      mapStatusEl.textContent = "No mappable stops for this route.";
      return;
    }

    const geometry = buildMapGeometry(mappedPlaces);
    const projectedPlaces = mappedPlaces.map((place, index) => ({
      place,
      index,
      point: projectCoords(place.coords, geometry),
    }));
    const landMasses = buildLandMasses(projectedPlaces);

    canvas.innerHTML = "";
    const atlas = document.createElement("div");
    atlas.className = "map-atlas";
    canvas.appendChild(atlas);

    const svg = createSvgElement("svg", {
      viewBox: "0 0 " + MAP_VIEWBOX.width + " " + MAP_VIEWBOX.height,
      class: "map-svg",
      role: "img",
      "aria-label": routePlan ? routePlan[state.lang].name : "Venice offline map",
    });
    renderMapBackground(svg, landMasses, routePlan ? projectedPlaces.map((item) => item.point) : null);
    atlas.appendChild(svg);

    const panel = createMapPanel(atlas);
    const markerButtons = [];
    projectedPlaces.forEach((entry) => {
      const markerIndex = routePlan ? entry.index : undefined;
      const button = buildMarkerButton(entry.place, entry.point, markerIndex, panel, markerButtons);
      markerButtons.push(button);
      atlas.appendChild(button);
    });

    if (projectedPlaces.length) {
      markerButtons[0].classList.add("is-active");
      openMapPanel(panel, projectedPlaces[0].place, routePlan ? projectedPlaces[0].index : undefined);
    }

    state.map = {
      destroy() {
        canvas.innerHTML = "";
      },
    };

    if (routePlan) {
      mapStatusEl.textContent = baseHint + " " + t("mapOffline");
      return;
    }

    getUserLocation()
      .then((coords) => {
        if (distanceMeters(coords, VENICE_CENTER) > MAX_MAP_LOCATION_DISTANCE_METERS) {
          mapStatusEl.textContent = t("mapLocationFar") + " " + t("mapOffline");
          return;
        }
        state.userLocation = coords;
        if (!isCoordInsideGeometryBounds(coords, geometry)) {
          mapStatusEl.textContent = t("mapLocationOutside") + " " + t("mapOffline");
          return;
        }
        atlas.appendChild(buildUserMarker(projectCoords(coords, geometry)));
        mapStatusEl.textContent = baseHint + " " + t("mapOffline");
      })
      .catch(() => {
        mapStatusEl.textContent = baseHint + " " + t("mapOffline");
      });
  }

  window.addEventListener("hashchange", render);

  Promise.all([
    fetch("places.json").then((res) => res.json()),
    fetch("routes.json").then((res) => res.json()),
  ])
    .then(([placesData, routesData]) => {
      state.places = placesData;
      state.routes = routesData;
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
  let activePrecacheCacheName = null;

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
    let refreshingAfterUpdate = false;

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
        if (!activePrecacheCacheName) activePrecacheCacheName = msg.cacheName || null;
        if (activePrecacheCacheName && msg.cacheName && msg.cacheName !== activePrecacheCacheName) return;
        showDownloadScreen();
        const pct = msg.total ? Math.round((msg.done / msg.total) * 100) : 0;
        downloadFill.style.width = pct + "%";
        downloadCount.textContent = msg.done + " / " + msg.total + " files";
        downloadStatus.textContent = t("downloading");
        offlineStatusEl.textContent = t("offlinePreparing");
      } else if (msg.type === "precache-complete") {
        if (activePrecacheCacheName && msg.cacheName && msg.cacheName !== activePrecacheCacheName) return;
        activePrecacheCacheName = null;
        downloadStatus.textContent = t("offlineReady");
        offlineStatusEl.textContent = t("offlineReady");
        setTimeout(() => {
          hideDownloadScreen();
        }, 800);
      } else if (msg.type === "precache-incomplete") {
        if (activePrecacheCacheName && msg.cacheName && msg.cacheName !== activePrecacheCacheName) return;
        activePrecacheCacheName = null;
        downloadStatus.textContent = t("offlineIncomplete");
        offlineStatusEl.textContent = t("offlineIncomplete");
      } else if (msg.type === "cache-status") {
        if (msg.ready) {
          activePrecacheCacheName = null;
          offlineStatusEl.textContent = t("offlineReady");
        } else {
          offlineStatusEl.textContent = t("offlinePreparing");
        }
      }
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshingAfterUpdate) return;
      refreshingAfterUpdate = true;
      window.location.reload();
      requestCacheStatus();
    });

    window.addEventListener("load", () => {
      offlineStatusEl.textContent = t("offlinePreparing");
      navigator.serviceWorker
        .register("sw.js")
        .then((registration) => {
          if ("storage" in navigator && "persist" in navigator.storage) {
            navigator.storage.persist();
          }
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "skip-waiting" });
          }
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                worker.postMessage({ type: "skip-waiting" });
              }
            });
          });
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
