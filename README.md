# Venice Virtual Guide

Offline-capable PWA travel guide to Venice. See [docs/DESIGN.md](docs/DESIGN.md) for the full design.

**Current status:** Phase 1 guide — one place (St Mark's Square) fully wired up in both languages, with optimized WebP images and generated MP3 narration.

## Running locally

The site is plain HTML/CSS/JS with no build step. Serve the `site/` folder over HTTP (service workers require a proper origin, not `file://`):

```
npx serve site
```

or

```
python -m http.server --directory site 8080
```

Then open the printed URL (e.g. `http://localhost:3000` / `http://localhost:8080`) in a browser.

## Content pipeline

Author content in `content/places.source.json`, then run (from `tools/`, after `npm install`):

```
node generate-audio.mjs      # requires ELEVENLABS_API_KEY in .env or the environment
node optimize-images.mjs     # requires source photos in content/photos-src/{id}.*
node build-manifest.mjs      # validates + writes site/places.json
```

`generate-audio.mjs` uses ElevenLabs TTS. Set `ELEVENLABS_API_KEY` in `.env` or the process environment. If the account cannot use the default voice through the API, set `ELEVENLABS_VOICE_ID` to an account-owned voice ID.

Generated audio is committed under `site/audio/{pl,en}/`. If narration text changes, rerun `generate-audio.mjs` before `build-manifest.mjs` so `audioDuration` stays current.

## Repository structure

See [docs/DESIGN.md §7](docs/DESIGN.md#7-repository-structure).
