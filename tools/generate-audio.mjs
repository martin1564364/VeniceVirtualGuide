// Build-time script: generates MP3 narration for each place x language using
// ElevenLabs TTS, and fills in `audio` / `audioDuration` on the source content.
// Not run automatically. Put ELEVENLABS_API_KEY in the repository .env file or
// in the process environment, then run:
//   node tools/generate-audio.mjs
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { parseFile } from "music-metadata";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");
const ENV_PATH = path.join(ROOT, ".env");
const AUDIO_DIR = path.join(ROOT, "site", "audio");
const HASHES_PATH = path.join(AUDIO_DIR, ".hashes.json");

const PROVIDER = "elevenlabs";
const MODEL_ID = "eleven_multilingual_v2";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const OUTPUT_FORMAT = "mp3_44100_128";
const API_BASE = "https://api.elevenlabs.io/v1";

function parseArgs(argv) {
  const args = { placeId: null, lang: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--place") args.placeId = argv[++i];
    else if (arg === "--lang") args.lang = argv[++i];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.lang && !["pl", "en"].includes(args.lang)) {
    throw new Error("--lang must be either pl or en.");
  }
  return args;
}

function loadDotEnv(text) {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

async function loadEnvFile() {
  try {
    loadDotEnv(await readFile(ENV_PATH, "utf8"));
  } catch {
    // .env is optional when the key is already present in the environment.
  }
}

function hashText(text) {
  return createHash("sha256")
    .update([PROVIDER, MODEL_ID, VOICE_ID, OUTPUT_FORMAT, text].join("\n"))
    .digest("hex");
}

async function loadHashes() {
  try {
    return JSON.parse(await readFile(HASHES_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function apiKey() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not set in .env or the environment.");
  }
  return process.env.ELEVENLABS_API_KEY;
}

async function synthesizeSpeech(text) {
  const url = `${API_BASE}/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey(),
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.1,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`ElevenLabs TTS failed (${response.status}): ${body}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await loadEnvFile();
  const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
  const hashes = await loadHashes();

  for (const lang of ["pl", "en"]) {
    await mkdir(path.join(AUDIO_DIR, lang), { recursive: true });
  }

  const selectedPlaces = args.placeId
    ? source.places.filter((place) => place.id === args.placeId)
    : source.places;
  if (args.placeId && selectedPlaces.length === 0) {
    throw new Error(`Place not found: ${args.placeId}`);
  }
  const selectedLangs = args.lang ? [args.lang] : ["pl", "en"];

  for (const place of selectedPlaces) {
    for (const lang of selectedLangs) {
      const local = place[lang];
      const key = `${PROVIDER}-${MODEL_ID}-${VOICE_ID}-${place.id}-${lang}`;
      const textHash = hashText(local.text);
      const audioRelPath = `audio/${lang}/${place.id}.mp3`;
      const outPath = path.join(AUDIO_DIR, lang, `${place.id}.mp3`);

      if (hashes[key] === textHash && (await fileExists(outPath))) {
        if (local.audio !== audioRelPath || !(Number(local.audioDuration) > 0)) {
          const metadata = await parseFile(outPath);
          local.audio = audioRelPath;
          local.audioDuration = Math.round(metadata.format.duration || 0);
        }
        console.log(`skip (unchanged): ${place.id}-${lang}`);
        continue;
      }

      console.log(`generating: ${place.id}-${lang}`);
      await writeFile(outPath, await synthesizeSpeech(local.text));

      const metadata = await parseFile(outPath);
      local.audio = audioRelPath;
      local.audioDuration = Math.round(metadata.format.duration || 0);
      hashes[key] = textHash;
    }
  }

  await writeFile(SOURCE_PATH, JSON.stringify(source, null, 2) + "\n");
  await writeFile(HASHES_PATH, JSON.stringify(hashes, null, 2) + "\n");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
