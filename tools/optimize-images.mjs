// Build-time script: converts source photos in content/photos-src/{id}.*
// into a 1200px-wide hero WebP and a 320px-wide thumbnail WebP.
// Not run automatically — invoke manually:
//   node tools/optimize-images.mjs
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { globSync } from "node:fs";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");
const PHOTOS_SRC_DIR = path.join(ROOT, "content", "photos-src");
const IMAGES_DIR = path.join(ROOT, "site", "images");
const THUMBS_DIR = path.join(IMAGES_DIR, "thumbs");

const HERO_WIDTH = 1200;
const THUMB_WIDTH = 320;

async function findSourcePhoto(id) {
  const matches = globSync(path.join(PHOTOS_SRC_DIR, `${id}.*`));
  if (matches.length === 0) {
    throw new Error(`No source photo found for "${id}" in content/photos-src/`);
  }
  return matches[0];
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });
  await mkdir(THUMBS_DIR, { recursive: true });

  const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));

  for (const place of source.places) {
    const srcPath = await findSourcePhoto(place.id);
    console.log(`optimizing: ${place.id} (${path.basename(srcPath)})`);

    await sharp(srcPath)
      .resize({ width: HERO_WIDTH })
      .webp({ quality: 80 })
      .toFile(path.join(IMAGES_DIR, `${place.id}.webp`));

    await sharp(srcPath)
      .resize({ width: THUMB_WIDTH })
      .webp({ quality: 75 })
      .toFile(path.join(THUMBS_DIR, `${place.id}.webp`));
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
