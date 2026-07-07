import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");

const data = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
for (const place of data.places) {
  place.image = `images/${place.id}.webp`;
  place.imageThumb = `images/thumbs/${place.id}.webp`;
}

await writeFile(SOURCE_PATH, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated image paths for ${data.places.length} places.`);
