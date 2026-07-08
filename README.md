# Venice Virtual Guide

Offline-first PWA travel guide for Venice, built as a static site under `site/`.

## Current status

The runtime is in its final travel-ready shape:

- 30 places with bilingual content (`pl` and `en`)
- 6 suggested routes starting from Via Hermada 44 / Punta Sabbioni
- generated MP3 narration committed under `site/audio/`
- offline SVG atlas map and route maps
- service-worker precache for full offline use after first download

`docs/DESIGN.md` now serves as a mix of historical design notes and an as-built snapshot.

## Running locally

Serve `site/` over HTTP. Do not open `site/index.html` directly because service workers require an origin.

```sh
npx serve site
```

or

```sh
python -m http.server --directory site 8080
```

Known-good startup for this Windows checkout:

```powershell
cmd.exe /c start "Venice Guide Server" /MIN "C:\Application Development\VeniceVirtualGuide\tools\start-dev-server.cmd"
```

Then open `http://127.0.0.1:8080`.

## Content pipeline

Install tool dependencies from `tools/`, then run the relevant pipeline scripts:

```sh
npm install
npm run build-manifest
npm run optimize-images
npm run generate-audio
```

Notes:

- Author source content in `content/places.source.json`.
- `generate-audio.mjs` uses ElevenLabs and requires `ELEVENLABS_API_KEY`.
- Generated audio is committed under `site/audio/{pl,en}/`.
- If app shell files change, bump `APP_SHELL_VERSION` in `site/sw.js` to refresh cached clients.

## Repository structure

- `site/`: deployed runtime files
- `content/`: source place content and original photos
- `tools/`: build and generation scripts
- `docs/`: design notes and as-built references
- `CREDITS.md`: image attribution tracking
