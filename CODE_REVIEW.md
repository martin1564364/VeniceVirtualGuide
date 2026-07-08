# Code Review: Venice Virtual Guide

Review date: 2026-07-08

Scope: current static runtime in `site/`, generated content manifests, service worker offline behavior, and final-stage documentation. App code was not changed during this review.

## Summary

The app is in a usable final-stage shape: JavaScript syntax checks pass, all referenced place media exists, and all route `placeId` references resolve. The main fixes worth doing are reliability and polish fixes around first-run offline caching, the new offline map, Media Session cleanup, and stale documentation.

## Findings

### High: First-run precache downloads every asset concurrently

References: `site/sw.js:64`, `site/sw.js:66`, `site/sw.js:76`, `site/sw.js:84`, `site/sw.js:99`

`precacheAll()` starts a fetch for every shell file, image, thumbnail, JSON file, and audio file at once via `Promise.all(assets.map(...))`. With 30 places and two audio tracks per place, this can create a large burst of simultaneous MP3 downloads on first install. On mobile Chrome or weaker Wi-Fi, this increases the chance of throttling, transient failures, or an aborted install.

Because `installCacheFromContent()` deletes the whole new cache when any asset fails, a few overloaded requests can leave the app without a complete offline bundle even though the files themselves are valid.

Needed fix: download the precache manifest with a small concurrency limit, for example 4-6 assets at a time, while keeping the existing progress messages and failure reporting.

### Medium: Offline map user marker can be placed inaccurately near Venice

References: `site/js/app.js:438`, `site/js/app.js:652`, `site/js/app.js:658`, `site/js/app.js:707`, `site/js/app.js:712`

`buildMapGeometry()` supports `extraCoords`, but `renderMap()` builds the map projection from guide places only. The current user location is projected afterward using that existing place-only geometry.

For someone within `MAX_MAP_LOCATION_DISTANCE_METERS` of Venice but outside the place bounding box, such as near the Cavallino-Treporti base, the marker can be clamped onto the edge of the atlas and look like a real map position even though the atlas was not scaled to include that point.

Needed fix: either include the accepted user coordinates when computing map geometry, or only show the user marker when the location falls inside the rendered place bounds. The second option is simpler if the offline map is meant to represent Venice only.

### Medium: Media Session handlers and metadata survive after leaving a detail view

References: `site/js/app.js:138`, `site/js/app.js:212`, `site/js/player.js:123`, `site/js/player.js:124`, `site/js/player.js:128`

The app now stops the audio player on every route render, but `AudioPlayer.stop()` does not clear Media Session metadata or action handlers. After navigating back to the list, Android lock-screen controls can still show the previous place, and the stale `play` handler can call `this.audio.play()` on an audio element whose source was removed.

Needed fix: in `stop()`, clear `navigator.mediaSession.metadata`, set playback state to `none` or `paused`, and remove `play` / `pause` handlers with `setActionHandler(action, null)` inside a browser-support-safe `try` block. Also catch the `audio.play()` promise in the Media Session play handler.

### Medium: Map markers are below recommended mobile touch size

References: `site/css/app.css:447`, `site/css/app.css:448`, `site/css/app.css:449`, `site/css/app.css:476`, `site/css/app.css:477`

General map markers are 28 x 28 px and route markers are 34 x 34 px. This is smaller than the 44-48 px touch target normally expected on mobile, and the map is intended for walking use on Android.

Needed fix: keep the visible marker design if desired, but give `.map-marker` a 44-48 px hit area using width/height or a pseudo-element. Preserve the visual center so marker positions do not shift.

### Low: Final-stage documentation is stale

References: `README.md:5`, `README.md:28`, `README.md:33`, `docs/DESIGN.md:19`, `docs/DESIGN.md:79`, `docs/DESIGN.md:128`

The runtime now has 30 places, routes, generated audio, and an offline SVG atlas map. `README.md` still describes the app as a Phase 1 one-place guide, while `docs/DESIGN.md` still describes a 20-place plan and OpenAI TTS even though `tools/generate-audio.mjs` uses ElevenLabs.

Needed fix: update the README status and development notes to match the final app. Either update `docs/DESIGN.md` to an as-built document or clearly mark it as historical design notes.

## Verification Performed

- `node --check site/js/app.js`
- `node --check site/js/player.js`
- `node --check site/sw.js`
- Parsed `site/places.json` and `site/routes.json`.
- Verified all place images, thumbnails, and PL/EN audio paths referenced by `site/places.json` exist under `site/`.
- Verified all route `placeId` references resolve to known places.

Validation result:

```json
{
  "places": 30,
  "routes": 6,
  "missing": [],
  "badRefs": []
}
```

## Residual Risk

No browser-based offline install test was run during this review. Before final deployment, manually test in Chrome with a fresh profile: first load, wait for offline-ready state, switch to airplane mode, reload, open list, routes, map, detail pages, and play audio in both languages.
