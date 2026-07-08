# Repository Guidelines

## Project Structure & Module Organization

This repository is a static, offline-capable PWA for a Venice travel guide. Runtime files live in `site/`: `index.html`, `css/app.css`, `js/app.js`, `js/player.js`, `sw.js`, `places.json`, images, icons, and future audio assets. Source content is authored in `content/places.source.json`; original photos should go under `content/photos-src/`. Build-time scripts live in `tools/`, and design/architecture notes live in `docs/DESIGN.md`. Track image attributions in `CREDITS.md`.

## Build, Test, and Development Commands

Serve the app over HTTP; do not open `site/index.html` directly because service workers require a proper origin.

```sh
npx serve site
python -m http.server --directory site 8080
```

Known-good local startup for this Windows checkout: use the repo's Node dev server and, when starting it from Codex, run it outside the sandbox so the process persists after the tool call exits.

```powershell
cmd.exe /c start "Venice Guide Server" /MIN "C:\Application Development\VeniceVirtualGuide\tools\start-dev-server.cmd"
```

Then open:

```text
http://127.0.0.1:8080
```

Do not repeat server discovery unless this command fails. Previous attempts with `npx serve`, background `Start-Process`, and the workspace `.venv\Scripts\python.exe` were unreliable here.

Install tool dependencies from `tools/` before running the content pipeline:

```sh
npm install
npm run build-manifest      # validate content and write site/places.json
npm run optimize-images     # create WebP images from content/photos-src/
npm run generate-audio      # generate MP3 narration; requires OPENAI_API_KEY
```

## Coding Style & Naming Conventions

Use vanilla HTML, CSS, and JavaScript. JavaScript is written as ES modules or browser scripts with 2-space indentation, `const`/`let`, semicolons, and strict mode where applicable. Use descriptive camelCase names for functions and variables. Place IDs and generated asset names should use kebab-case, for example `st-marks-square`, with matching paths such as `images/st-marks-square.webp` and `audio/en/st-marks-square.mp3`.

## Testing Guidelines

There is no automated test suite yet. Before submitting changes, run the relevant pipeline script and manually test the app in a browser. Verify list view, place detail routing, language switching, audio unavailable states, service worker registration, and offline behavior after a completed cache. For content changes, ensure `npm run build-manifest` passes.

Whenever app shell files are updated (`site/index.html`, `site/css/app.css`, `site/js/*.js`, `site/sw.js`, icons, manifest, or new static JSON/assets), bump `APP_SHELL_VERSION` in `site/sw.js` or run the relevant manifest build if content versions changed. This forces the browser/service worker cache to refresh instead of serving a stale app.

## Commit & Pull Request Guidelines

No local git history is available in this checkout, so follow clear, imperative commit messages such as `Add Rialto Bridge content` or `Fix offline cache progress`. Pull requests should describe the change, list manual verification steps, link related issues when applicable, and include screenshots or short screen recordings for UI changes. For content or media changes, note licensing sources and update `CREDITS.md`.

## Security & Configuration Tips

Do not commit `.env`, API keys, generated logs, or local virtual environments. `OPENAI_API_KEY` is required only for `tools/generate-audio.mjs` and must never be exposed in `site/`, since the deployed app is fully static.
