# Code Review: Venice Virtual Guide

Review date: 2026-07-07

Scope: static runtime in `site/`, content manifest, service worker behavior, build-time scripts in `tools/`, and repository documentation. No app code was changed.

## Summary

The current app is syntactically valid and the deployed `site/places.json` references files that exist. The biggest risks are lifecycle bugs: audio can continue playing after the UI changes, and content-only updates do not reliably refresh the offline cache. These are important for the stated goal of a fully offline family travel guide.

## Implementation Status

- Fixed: old audio can keep playing after navigation or language changes.
- Fixed: content-only updates do not trigger a new offline precache.
- Fixed: cache cleanup can delete the newly installed cache during service-worker activation.
- Fixed: download progress/completion is not a durable offline-readiness indicator.
- Partially fixed: documentation now matches deployed assets; image source/license/author still need to be supplied in `CREDITS.md`.
- Fixed: `generate-audio.mjs` can leave missing or stale metadata when text is unchanged.
- Fixed: Media Session artwork metadata uses the wrong MIME type for WebP images.
- Fixed: build validation does not catch duplicate IDs, invalid IDs, or duplicate ordering.

## Findings

### High: Old audio can keep playing after navigation or language changes

References: `site/js/app.js:61`, `site/js/app.js:73`, `site/js/app.js:96`, `site/js/app.js:115`, `site/js/player.js:113`

`renderDetail()` creates a fresh `AudioPlayer` every time a detail view is rendered, but the previous `state.player` is not stopped before the DOM is replaced. This can happen when:

- the user starts audio, then taps Back to the list;
- the user switches PL/EN while audio is playing;
- the user navigates from one place detail to another once more places are added.

Because each `AudioPlayer` owns a detached `new Audio()` instance, removing the player DOM does not stop playback. This violates the design goal that only one track plays at a time and can leave invisible audio running with stale Media Session handlers.

Needed improvement: stop and clear the existing player before every render that replaces the app view, or reuse a single shared player instance.

### High: Content-only updates do not trigger a new offline precache

References: `site/sw.js:3`, `site/sw.js:60`, `site/sw.js:63`, `site/sw.js:65`, `site/sw.js:105`, `site/sw.js:108`

The service worker only builds the full offline cache during its `install` event. A new `install` only happens when the browser sees `sw.js` change. However, the content pipeline updates `site/places.json` and asset files without necessarily changing `site/sw.js`.

The fetch handler does fetch the latest `places.json` from the network, but it does not derive and precache the new asset list after a manifest version change. Result: after adding a place, users may see updated JSON while online, but the new images/audio are not guaranteed to be cached for offline use. This conflicts with the design expectation that bumping `places.json.version` refreshes the offline bundle.

Needed improvement: either update `sw.js` on every content release, or implement a runtime update flow where the active service worker detects a new `places.json.version`, creates a new versioned cache, downloads the derived asset list, and only then promotes it.

### High: Cache cleanup can delete the newly installed cache during service-worker activation

References: `site/sw.js:74`, `site/sw.js:78`, `site/sw.js:81`, `site/sw.js:89`, `site/sw.js:91`

`activate` calls `currentCacheName()`, which uses `caches.match("places.json")` to infer the active version. When both an old and newly installed cache contain `places.json`, `caches.match()` can return the old cached response depending on cache search order. If that happens, the activation cleanup keeps the old cache and deletes the newly installed cache.

Needed improvement: persist the just-installed cache name explicitly, or compute the active cache name from the service worker's own install-time manifest data rather than from a global `caches.match()` lookup.

### Medium: Download progress/completion is not a durable offline-readiness indicator

References: `site/js/app.js:158`, `site/js/app.js:161`, `site/js/app.js:168`, `site/js/app.js:178`, `site/sw.js:34`, `site/sw.js:45`, `site/sw.js:46`

The first-run screen is driven only by transient service-worker messages. On a revisit after a completed cache, the app does not inspect Cache Storage to set the offline status, so the header can remain at the initial ellipsis. Also, `precacheAll()` increments progress for failed fetches and still broadcasts `precache-complete`, even when some assets were skipped.

This means users can be told the guide is ready even if one or more files failed to cache. The current manifest references all files correctly, but the failure mode matters during flaky Wi-Fi, which is one of the app's core use cases.

Needed improvement: track failed asset URLs during precache and surface partial/offline-incomplete state. On startup, have the page ask the service worker or Cache Storage for current readiness instead of relying only on install-time messages.

### Medium: Documentation and credits are stale relative to deployed assets

References: `README.md:5`, `README.md:33`, `CREDITS.md:5`, `site/places.json`

`README.md` says St Mark's Square has a placeholder image and no audio, but `site/places.json` points to WebP images and both `audio/pl/st-marks-square.mp3` and `audio/en/st-marks-square.mp3`, and those files exist. `CREDITS.md` credits the SVG placeholder, while the deployed content uses `site/images/st-marks-square.webp` and `site/images/thumbs/st-marks-square.webp`.

Needed improvement: update README status and record the actual image source/license/author for the deployed WebP source photo before launch.

### Medium: `generate-audio.mjs` can leave missing or stale metadata when text is unchanged

References: `tools/generate-audio.mjs:52`, `tools/generate-audio.mjs:54`, `tools/generate-audio.mjs:69`, `tools/generate-audio.mjs:70`, `tools/generate-audio.mjs:71`

When the stored text hash matches, the script skips the language entirely. It does not verify that the MP3 still exists, nor does it refill `local.audio` / `local.audioDuration` if those fields are missing or stale. If `content/places.source.json` is edited manually or generated audio is deleted, the script can report "skip (unchanged)" while leaving the manifest incomplete.

Needed improvement: on hash match, still verify the expected MP3 exists and metadata fields are present. If not, either regenerate or parse the existing file and rewrite the missing fields.

### Low: Media Session artwork metadata uses the wrong MIME type for WebP images

References: `site/js/player.js:103`, `site/js/player.js:106`, `site/places.json`

`track.artwork` is `images/st-marks-square.webp`, but Media Session metadata declares it as `type: "image/svg+xml"` and `sizes: "512x512"`. Lock-screen artwork may fail or behave inconsistently.

Needed improvement: set Media Session artwork metadata to match the actual asset type and dimensions, or provide a dedicated PNG/WebP icon/artwork asset with accurate metadata.

### Low: Build validation does not catch duplicate IDs, invalid IDs, or duplicate ordering

References: `tools/build-manifest.mjs:25`, `tools/build-manifest.mjs:45`, `tools/build-manifest.mjs:50`

The manifest validator checks required fields and file existence, but it does not check that place IDs are unique, ID strings are URL-safe kebab-case, order values are unique numbers, coordinates are numeric, or each language payload is structurally valid beyond field presence. With 20 planned places, these mistakes would create broken routing or unstable list ordering.

Needed improvement: extend validation to cover uniqueness, ID format, coordinate ranges, numeric positive `audioDuration`, and supported language completeness.

## Verification Performed

- `node --check site/js/app.js`
- `node --check site/js/player.js`
- `node --check site/sw.js`
- Parsed `site/manifest.webmanifest`, `content/places.source.json`, and `site/places.json` as JSON.
- Checked that all current manifest asset references exist under `site/`.
- Compared `content/places.source.json` and `site/places.json`; they match except for the expected version value.
- Confirmed local Node version is `v22.21.0` and supports `fs.globSync`, which `tools/optimize-images.mjs` uses.

I did not run `npm run build-manifest` because it writes `site/places.json` and bumps the version; that would be a behavior-affecting repo change outside this review request.
