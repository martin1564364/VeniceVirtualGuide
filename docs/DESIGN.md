# Venice Virtual Guide Design Notes

Status: as-built snapshot plus historical notes
Last updated: 2026-07-08

## Purpose

This file no longer describes only the original prototype plan. The app has moved beyond the one-place draft, so this document now serves two purposes:

- capture the current shipped runtime shape at a high level
- preserve the original planning assumptions as historical context

When this file disagrees with the runtime under `site/`, treat the runtime as authoritative.

## As-Built Snapshot

### Runtime

- Static PWA served from `site/`
- Vanilla HTML, CSS, and JavaScript
- Hash-route navigation for list, place details, route details, and offline maps
- Custom audio player with Media Session integration
- Service worker driven offline install and cache refresh

### Content

- 30 places in `site/places.json`
- 6 route plans in `site/routes.json`
- Bilingual `pl` and `en` text for every place
- Generated MP3 narration committed under `site/audio/pl/` and `site/audio/en/`
- WebP hero images and thumbnails under `site/images/`

### Offline behavior

- First-run download screen backed by service-worker progress events
- Versioned app-shell cache plus content-aware cache names
- Offline atlas map for Venice and route-specific map views
- Network-first checks for `places.json` and `routes.json`, with background cache refresh when versions change

### Build pipeline

- Source content authored in `content/places.source.json`
- `tools/build-manifest.mjs` validates content and writes `site/places.json`
- `tools/optimize-images.mjs` generates WebP derivatives from `content/photos-src/`
- `tools/generate-audio.mjs` uses ElevenLabs, not OpenAI TTS

### Repository structure

```text
VeniceVirtualGuide/
|- site/
|- content/
|- tools/
|- docs/
|- CREDITS.md
`- README.md
```

## Historical Notes

The original plan assumed a smaller guide of roughly 20 places, with the first milestone focused on a single fully wired St Mark's Square entry. That phase is complete and superseded by the current runtime.

The original TTS choice also changed. Early design notes referenced OpenAI TTS, but the implemented pipeline uses ElevenLabs through `tools/generate-audio.mjs`. Any documentation or operational notes should reflect the implemented pipeline, not the earlier option analysis.

The original design intent still broadly holds:

- one shareable URL instead of a native app
- full offline use after first install
- Android-first ergonomics for walking use
- static hosting with no runtime backend

## Source Of Truth

For operational work, use these files instead of this summary:

- `site/sw.js` for caching and offline-install behavior
- `site/js/app.js` for routing, maps, and UI state
- `site/js/player.js` for audio behavior
- `site/places.json` and `site/routes.json` for shipped content
- `tools/*.mjs` for the content pipeline
