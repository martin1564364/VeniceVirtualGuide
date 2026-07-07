import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const HASHES_PATH = path.join(ROOT, "site", "audio", ".hashes.json");

const hashes = JSON.parse(await readFile(HASHES_PATH, "utf8"));
let removed = 0;
for (const key of Object.keys(hashes)) {
  if (!key.startsWith("elevenlabs-")) {
    delete hashes[key];
    removed += 1;
  }
}

await writeFile(HASHES_PATH, JSON.stringify(hashes, null, 2) + "\n");
console.log(`Removed ${removed} legacy audio hash entries.`);
