# Venice Virtual Guide — Design Document

**Status:** Draft v1.0
**Date:** 2026-07-07
**Author:** Marcin Ściański (with Claude Code)

---

## 1. Overview

A family travel guide to Venice delivered as an **offline-capable Progressive Web App (PWA)**. Each family member opens a single URL on their Android phone before the trip; the app then works fully offline — every photo, description, and audio narration is cached on the device.

### Goals

| # | Goal |
|---|------|
| G1 | One shareable URL, no app-store installation |
| G2 | Works fully offline after first visit (unreliable roaming data in Venice) |
| G3 | ~20 places, each with photo, text, and natural-sounding audio narration |
| G4 | Bilingual: Polish and English, switchable in the UI |
| G5 | Audio pre-generated with AI TTS (OpenAI) — no runtime API calls, no API keys on the client |
| G6 | Zero hosting cost, easy to update (GitHub Pages) |

### Non-Goals

- No user accounts, no backend server, no runtime API calls
- No turn-by-turn navigation (a static map link per place is enough; Google Maps handles routing)
- No iOS-specific optimization (family uses Android), though the PWA will still work on iOS

---

## 2. Architecture

### 2.1 High-Level

A **fully static site** — plain HTML/CSS/JavaScript, no framework, no runtime build step. All dynamic behavior (language toggle, audio player, offline caching) is client-side.

```
┌─────────────────────────────────────────────────────────┐
│                    Android Phone (Chrome)                │
│  ┌───────────────┐   ┌──────────────────────────────┐   │
│  │   PWA Shell   │◄──│  Service Worker              │   │
│  │  (HTML/CSS/JS)│   │  - precaches app shell       │   │
│  └───────┬───────┘   │  - precaches all content:    │   │
│          │           │    places.json, photos, audio│   │
│          ▼           │  - cache-first strategy      │   │
│  ┌───────────────┐   └──────────────┬───────────────┘   │
│  │  Cache API    │◄─────────────────┘                   │
│  │  (~55 MB)     │                                      │
│  └───────────────┘                                      │
└──────────────────────────────┬──────────────────────────┘
                               │ HTTPS (first visit / updates only)
                               ▼
                 ┌──────────────────────────┐
                 │  GitHub Pages (static)   │
                 │  index.html, sw.js,      │
                 │  places.json,            │
                 │  images/*.webp,          │
                 │  audio/{pl,en}/*.mp3     │
                 └──────────────────────────┘

        Build-time only (author's PC, not part of the runtime):
                 ┌──────────────────────────┐
                 │  Content pipeline        │
                 │  - places.json authoring │
                 │  - image optimization    │
                 │  - OpenAI TTS generation │
                 └──────────────────────────┘
```

### 2.2 Why These Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App model | PWA, not native app | One URL to share (G1); Chrome on Android has first-class PWA support incl. "Add to Home screen" |
| Framework | Vanilla JS (no React/Vue) | ~20 places is trivial; no build toolchain to maintain; smallest possible cache footprint (KISS/YAGNI) |
| Offline strategy | Service worker, **precache everything** on first visit | Content set is finite and known (~55 MB); cache-on-demand would risk missing content when offline in Venice |
| Audio | Pre-generated MP3 files committed to the repo | No API key exposure, no runtime cost, works offline (G5) |
| TTS engine | OpenAI TTS (`gpt-4o-mini-tts`, voice e.g. `nova`) | Very natural voice, good Polish + English, ~$2–3 one-time cost for the whole guide |
| Hosting | GitHub Pages | Free, HTTPS by default (service workers **require** HTTPS), `git push` to update |
| Data format | Single `places.json` | One fetch, easy to validate, easy to precache |

---

## 3. Content Model

### 3.1 `places.json` Schema

```json
{
  "version": "2026-07-07-1",
  "places": [
    {
      "id": "st-marks-square",
      "order": 1,
      "coords": { "lat": 45.4341, "lng": 12.3388 },
      "image": "images/st-marks-square.webp",
      "imageThumb": "images/thumbs/st-marks-square.webp",
      "pl": {
        "name": "Plac Świętego Marka",
        "tagline": "Salon Europy",
        "text": "…pełny tekst przewodnika…",
        "audio": "audio/pl/st-marks-square.mp3",
        "audioDuration": 165
      },
      "en": {
        "name": "St Mark's Square",
        "tagline": "The Drawing Room of Europe",
        "text": "…full guide text…",
        "audio": "audio/en/st-marks-square.mp3",
        "audioDuration": 158
      }
    }
  ]
}
```

- `version` doubles as the **cache version**: bumping it triggers the service worker to re-download changed content.
- `coords` power an "Open in Google Maps" link per place (works online; degrades gracefully offline).
- `audioDuration` (seconds) lets the UI show track length without loading the file.

### 3.2 Content Guidelines

- **Text length:** 250–400 words per place per language (≈ 2–3 minutes of audio). Written for listening, not reading: short sentences, no footnote-style asides, one memorable anecdote per place — this is a family guide, keep it engaging for kids too.
- **Images:** one hero photo per place, 1200 px wide WebP (~150–250 KB), plus a 320 px thumbnail (~20 KB) for the list view. Use public-domain / CC-licensed sources (Wikimedia Commons) with attributions recorded in `CREDITS.md`.
- **Audio:** MP3, 64 kbps mono, 24 kHz — speech-optimized; ~1.2 MB per 2.5-minute track.

### 3.3 Size Budget (20 places, 2 languages)

| Asset | Count | Each | Total |
|-------|-------|------|-------|
| Audio MP3 | 40 | ~1.2 MB | ~48 MB |
| Hero images | 20 | ~200 KB | ~4 MB |
| Thumbnails | 20 | ~20 KB | ~0.4 MB |
| App shell + JSON | — | — | ~0.3 MB |
| **Total offline cache** | | | **~53 MB** |

Well within Chrome-on-Android storage quotas and a comfortable one-time download on home Wi-Fi.

### 3.4 Place List (proposed 20)

St Mark's Square · St Mark's Basilica · Doge's Palace · Bridge of Sighs · Campanile di San Marco · Rialto Bridge · Rialto Market · Grand Canal · Ca' d'Oro · Gallerie dell'Accademia · Basilica di Santa Maria della Salute · Teatro La Fenice · Scuola Grande di San Rocco · Basilica dei Frari · Campo Santa Margherita · Libreria Acqua Alta · Murano · Burano · San Giorgio Maggiore · Cannaregio & the Jewish Ghetto

---

## 4. Frontend Design

### 4.1 Screens

1. **Home / list view** — scrollable card list (thumbnail, name, tagline, audio duration). Sticky header with app title, language toggle (PL/EN), and offline-status indicator.
2. **Place detail** — hero photo, name, audio player (play/pause, seek bar, time), full text below. "Open in Google Maps" link. Back navigation.
3. **First-run download screen** — shown while the service worker precaches content: progress bar ("Downloading guide for offline use… 34/81 files"), so the family knows when it's safe to go offline.

Navigation uses URL hash routing (`#/place/st-marks-square`) — no server routing needed, works offline, back button behaves correctly.

### 4.2 Language Toggle

- Single toggle in the header switches `pl` ⇄ `en` for all text and audio.
- Choice persisted in `localStorage`; defaults to `pl` (or the browser language on first run).
- Both languages are always cached — the toggle is instant and offline-safe.

### 4.3 Audio Player

- Custom minimal player wrapping the native `<audio>` element (native controls are inconsistent across Android skins).
- Uses the **Media Session API** so lock-screen / notification controls show place name and artwork — useful while walking with the phone pocketed.
- Only one track plays at a time; switching places stops the previous track.

### 4.4 UI Principles

- Mobile-first, thumb-reachable controls, minimum 48 px touch targets.
- High-contrast text over photos (scrim gradient), readable in Venetian sunlight.
- Works in light and dark mode via `prefers-color-scheme`.
- Semantic HTML + ARIA labels on player controls (accessibility baseline).

---

## 5. Offline Strategy (Service Worker)

### 5.1 Caching Model

**Precache-everything, cache-first.** On install, the service worker:

1. Fetches `places.json`, derives the full asset manifest (shell files + every image + every audio file).
2. Downloads all assets into a versioned cache (`venice-guide-v{version}`), reporting progress to the page via `postMessage` (drives the first-run progress bar).
3. On `activate`, deletes caches from older versions.

All fetches are served **cache-first**; the network is touched only for cache misses (which shouldn't occur after a completed install) and update checks.

### 5.2 Update Flow

- On each online launch, the SW re-fetches `places.json` (network-first for this one file). If `version` changed, it downloads changed assets into a new cache in the background and prompts: "Guide updated — reload to get the latest version."
- The old cache is kept until the new one is complete — an interrupted update never breaks the working offline copy.

### 5.3 Installation UX (Android)

- `manifest.webmanifest` with name, icons (192/512 px), `display: standalone`, theme color → Chrome offers **"Add to Home screen"**; the guide then launches full-screen like a native app.
- In-app hint on first visit explaining how to install, plus explicit confirmation when the offline download is complete ("✓ Ready for offline use").

### 5.4 Edge Cases

| Case | Handling |
|------|----------|
| Download interrupted (Wi-Fi drop) | Install retries on next launch; progress UI shows incomplete state; app remains usable online |
| Storage eviction risk | Call `navigator.storage.persist()` to request persistent storage; surface the result in the UI |
| Partial cache + offline | Detail view shows text (from cached JSON) with a "media unavailable offline" placeholder rather than a broken page |
| Old Android / no SW support | App still works online; banner warns that offline mode is unavailable |

---

## 6. Content Pipeline (Build-Time)

Runs on the author's PC; outputs are committed to the repo. Node.js scripts in `tools/`.

### 6.1 Steps

```
places.source.json ──► validate schema ──► generate-audio.mjs ──► optimize-images.mjs ──► build-manifest.mjs ──► commit & push
```

1. **Author content** in `content/places.source.json` (same schema, `audio`/`audioDuration` fields empty).
2. **`generate-audio.mjs`** — for each place × language, calls OpenAI TTS:
   - Model `gpt-4o-mini-tts`, one consistent voice (e.g. `nova`), with a per-language style instruction: *"Warm, unhurried tour-guide narration"* — so Polish is narrated with native prosody.
   - Writes `audio/{lang}/{id}.mp3`, measures duration, fills `audioDuration`.
   - **Idempotent:** skips files whose source text hash hasn't changed (hashes stored in `audio/.hashes.json`) — re-running after editing one place regenerates only that track.
   - `OPENAI_API_KEY` read from environment; never committed (`.gitignore` + pre-commit secret check).
3. **`optimize-images.mjs`** — converts source photos to WebP hero + thumbnail sizes (via `sharp`).
4. **`build-manifest.mjs`** — validates the final `places.json` against the schema (fail fast on missing files/fields), bumps `version`, emits the precache file list consumed by `sw.js`.

### 6.2 Cost Estimate (one-time)

20 places × 2 languages × ~2,500 characters ≈ 100k characters → **≈ $2–3** with OpenAI TTS. Regenerating a single place after edits: ~$0.08.

---

## 7. Repository Structure

```
VeniceVirtualGuide/
├── docs/
│   └── DESIGN.md              ← this document
├── site/                      ← deployed to GitHub Pages
│   ├── index.html
│   ├── css/app.css
│   ├── js/app.js              ← routing, rendering, language toggle
│   ├── js/player.js           ← audio player + Media Session
│   ├── sw.js                  ← service worker
│   ├── manifest.webmanifest
│   ├── places.json
│   ├── images/  images/thumbs/
│   └── audio/pl/  audio/en/
├── tools/
│   ├── generate-audio.mjs
│   ├── optimize-images.mjs
│   └── build-manifest.mjs
├── content/
│   ├── places.source.json
│   └── photos-src/            ← originals before optimization
├── CREDITS.md                 ← photo attributions
└── README.md
```

Deployment: GitHub Pages serves the `site/` folder (Pages "deploy from branch", or a trivial Actions workflow). Every `git push` is a deploy.

---

## 8. Example Place: St Mark's Square

### English (`en`)

> **St Mark's Square — "The Drawing Room of Europe"**
>
> You are standing in the only *piazza* in Venice — every other square in the city is merely a *campo*. Napoleon is said to have called it "the drawing room of Europe," and for over a thousand years this has been the city's grand stage: coronations, carnivals, and processions all happened right here.
>
> Look east and you'll see the golden mosaics of St Mark's Basilica glittering above five great doorways. Beside it rises the Campanile, the brick bell tower almost 99 metres tall. Here's a secret: what you see is not the original. In 1902 the old tower collapsed into a pile of rubble — astonishingly, the only casualty was the caretaker's cat. The Venetians rebuilt it exactly as it was, "dov'era e com'era" — where it was and how it was.
>
> Now look up at the clock tower to your left. Two bronze figures, nicknamed "the Moors," have been striking the great bell every hour since 1497. And notice the square is slightly tilted — during *acqua alta*, the high tide, water rises through the drains and turns the whole piazza into a shallow mirror reflecting the basilica.
>
> One practical tip: the pigeons here are bold veterans. Hold an ice cream loosely and you may lose it to an aerial raid. Find a spot by the columns of the old procuracies, listen to the competing café orchestras, and watch a thousand years of history simply carry on around you.

### Polish (`pl`)

> **Plac Świętego Marka — „Salon Europy"**
>
> Stoicie na jedynym placu w Wenecji, który nosi nazwę *piazza* — każdy inny plac w mieście to zaledwie *campo*. Napoleon miał nazwać to miejsce „salonem Europy" i od ponad tysiąca lat jest ono wielką sceną miasta: to tutaj odbywały się koronacje, karnawały i uroczyste procesje.
>
> Spójrzcie na wschód — nad pięcioma wielkimi portalami Bazyliki św. Marka błyszczą złote mozaiki. Obok wznosi się Campanile, ceglana dzwonnica licząca prawie 99 metrów. A oto sekret: to, co widzicie, nie jest oryginałem. W 1902 roku stara wieża runęła, zamieniając się w stos gruzu — co zdumiewające, jedyną ofiarą był kot dozorcy. Wenecjanie odbudowali ją dokładnie taką, jaka była: „dov'era e com'era" — tam gdzie była i taka jaka była.
>
> Teraz spójrzcie w górę, na wieżę zegarową po lewej stronie. Dwie brązowe figury, nazywane „Maurami", wybijają godziny na wielkim dzwonie nieprzerwanie od 1497 roku. Zwróćcie też uwagę, że plac jest lekko pochylony — podczas *acqua alta*, czyli wysokiej wody, morze podnosi się przez kanały odpływowe i zamienia cały plac w płytkie lustro, w którym odbija się bazylika.
>
> Na koniec praktyczna rada: tutejsze gołębie to śmiali weterani. Trzymajcie loda niedbale, a możecie go stracić w powietrznym nalocie. Znajdźcie miejsce przy kolumnadzie starych prokuratorii, posłuchajcie konkurujących ze sobą kawiarnianych orkiestr i patrzcie, jak tysiąc lat historii po prostu toczy się dalej wokół was.

Both texts are ~280 words — about 2.5 minutes of narration each — and written for the ear: direct address, one anecdote (the Campanile collapse and the cat), one thing to look at, one practical family tip.

---

## 9. Delivery Plan

| Phase | Deliverable | Effort |
|-------|-------------|--------|
| **1. Skeleton** | Static site with 1 place (St Mark's Square), hash routing, language toggle, audio player. Deployed to GitHub Pages. | ~1 day |
| **2. Offline** | Service worker with precache + progress UI, manifest, install flow, persistent-storage request. Verified offline in airplane mode on an Android phone. | ~1 day |
| **3. Pipeline** | TTS generation, image optimization, and manifest/validation scripts. St Mark's audio generated in both languages. | ~1 day |
| **4. Content** | Write and review 20 places × 2 languages; source and credit photos; generate all audio. | The long pole — content writing dominates |
| **5. Field test** | Full family dry run: install on each phone at home, airplane-mode walk-through, fix issues. | ~½ day |

### Acceptance Criteria

- [ ] Opening the URL once on Wi-Fi, then enabling airplane mode: every place's photo, text, and audio in **both** languages works.
- [ ] "Add to Home screen" produces a standalone full-screen app on Android Chrome.
- [ ] Language toggle switches text and audio instantly, offline.
- [ ] Lock-screen media controls show the current place during playback.
- [ ] Total cache ≤ 120 MB; first download shows progress and a completion confirmation.
- [ ] Pushing a content fix updates phones on their next online launch without breaking the existing offline copy.

### Risks

| Risk | Mitigation |
|------|-----------|
| Family member never opens the page before losing connectivity | Explicit "✓ Ready for offline use" confirmation; dry run at home (Phase 5) |
| Chrome evicts the cache under storage pressure | `navigator.storage.persist()`; total kept ~53 MB, far below quota |
| TTS Polish pronunciation of Italian names (e.g. "Ca' d'Oro") | Spot-check every track; use phonetic respelling in the TTS input where needed (display text stays correct) |
| Photo licensing | Wikimedia Commons CC0/CC-BY only, tracked in `CREDITS.md` |
