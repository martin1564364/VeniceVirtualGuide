// Build-time script: validates content/places.source.json against the
// DESIGN.md §3.1 schema, bumps `version`, and writes site/places.json.
// Not run automatically — invoke manually:
//   node tools/build-manifest.mjs
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE_PATH = path.join(ROOT, "content", "places.source.json");
const OUTPUT_PATH = path.join(ROOT, "site", "places.json");
const ROUTES_SOURCE_PATH = path.join(ROOT, "content", "routes.source.json");
const ROUTES_OUTPUT_PATH = path.join(ROOT, "site", "routes.json");
const SITE_DIR = path.join(ROOT, "site");

const REQUIRED_LANG_FIELDS = ["name", "tagline", "text", "audio", "audioDuration"];
const REQUIRED_PLACE_FIELDS = ["id", "order", "coords", "image", "imageThumb", "pl", "en"];

async function fileExists(relativePath) {
  try {
    await access(path.join(SITE_DIR, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function validate(data) {
  const errors = [];

  if (!data.version) errors.push("Missing top-level `version`.");
  if (!Array.isArray(data.places) || data.places.length === 0) {
    errors.push("`places` must be a non-empty array.");
    return errors;
  }

  const seenIds = new Set();
  const seenOrders = new Set();

  for (const place of data.places) {
    for (const field of REQUIRED_PLACE_FIELDS) {
      if (place[field] === undefined) errors.push(`${place.id || "?"}: missing field "${field}"`);
    }
    if (typeof place.id === "string") {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(place.id)) {
        errors.push(`${place.id}: id must be kebab-case using lowercase letters and numbers.`);
      }
      if (seenIds.has(place.id)) errors.push(`${place.id}: duplicate id.`);
      seenIds.add(place.id);
    }
    if (!Number.isInteger(place.order) || place.order < 1) {
      errors.push(`${place.id || "?"}: order must be a positive integer.`);
    } else {
      if (seenOrders.has(place.order)) errors.push(`${place.id}: duplicate order ${place.order}.`);
      seenOrders.add(place.order);
    }
    if (
      !place.coords ||
      typeof place.coords.lat !== "number" ||
      typeof place.coords.lng !== "number" ||
      place.coords.lat < -90 ||
      place.coords.lat > 90 ||
      place.coords.lng < -180 ||
      place.coords.lng > 180
    ) {
      errors.push(`${place.id || "?"}: coords must include numeric lat/lng in valid ranges.`);
    }
    for (const lang of ["pl", "en"]) {
      const local = place[lang];
      if (!local) continue;
      for (const field of REQUIRED_LANG_FIELDS) {
        if (!local[field] && local[field] !== 0) {
          errors.push(`${place.id}.${lang}: missing field "${field}"`);
        }
      }
      if (!(Number(local.audioDuration) > 0)) {
        errors.push(`${place.id}.${lang}: audioDuration must be a positive number of seconds.`);
      }
      if (local.audio && !(await fileExists(local.audio))) {
        errors.push(`${place.id}.${lang}: audio file not found at site/${local.audio}`);
      }
    }
    if (place.image && !(await fileExists(place.image))) {
      errors.push(`${place.id}: image not found at site/${place.image}`);
    }
    if (place.imageThumb && !(await fileExists(place.imageThumb))) {
      errors.push(`${place.id}: imageThumb not found at site/${place.imageThumb}`);
    }
  }

  return errors;
}

function validateRoutes(routesData, placesData) {
  const errors = [];
  if (!routesData.version) errors.push("routes: missing top-level `version`.");
  if (!routesData.base || typeof routesData.base.address !== "string") {
    errors.push("routes: missing base.address.");
  }
  if (!Array.isArray(routesData.routes) || routesData.routes.length === 0) {
    errors.push("routes: `routes` must be a non-empty array.");
    return errors;
  }

  const placeIds = new Set(placesData.places.map((place) => place.id));
  const routeIds = new Set();
  for (const route of routesData.routes) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(route.id || "")) {
      errors.push(`routes.${route.id || "?"}: id must be kebab-case.`);
    }
    if (routeIds.has(route.id)) errors.push(`routes.${route.id}: duplicate id.`);
    routeIds.add(route.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(route.day || "")) {
      errors.push(`routes.${route.id}: day must use YYYY-MM-DD.`);
    }
    if (!["short", "medium", "full"].includes(route.variant)) {
      errors.push(`routes.${route.id}: variant must be short, medium, or full.`);
    }
    if (!(Number(route.durationHours) > 0)) {
      errors.push(`routes.${route.id}: durationHours must be positive.`);
    }
    if (!Array.isArray(route.steps) || route.steps.length === 0) {
      errors.push(`routes.${route.id}: steps must be a non-empty array.`);
    }
    for (const lang of ["pl", "en"]) {
      const local = route[lang];
      if (!local || !local.name || !local.summary || !local.intensity) {
        errors.push(`routes.${route.id}.${lang}: missing name, summary, or intensity.`);
      }
    }
    for (const step of route.steps || []) {
      if (!["place", "transfer", "walk", "break"].includes(step.kind)) {
        errors.push(`routes.${route.id}: unknown step kind "${step.kind}".`);
      }
      if (step.kind === "place" && !placeIds.has(step.placeId)) {
        errors.push(`routes.${route.id}: unknown placeId "${step.placeId}".`);
      }
      if (step.kind !== "place" && (!step.pl || !step.en)) {
        errors.push(`routes.${route.id}: ${step.kind} step missing pl/en label.`);
      }
    }
  }
  return errors;
}

function bumpVersion(currentVersion) {
  const today = new Date().toISOString().slice(0, 10);
  const match = /^(\d{4}-\d{2}-\d{2})-(\d+)$/.exec(currentVersion || "");
  if (match && match[1] === today) {
    return `${today}-${Number(match[2]) + 1}`;
  }
  return `${today}-1`;
}

async function main() {
  const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
  const routesSource = JSON.parse(await readFile(ROUTES_SOURCE_PATH, "utf8"));
  const errors = await validate(source);
  errors.push(...validateRoutes(routesSource, source));

  if (errors.length > 0) {
    console.error("Validation failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }

  source.version = bumpVersion(source.version);
  routesSource.version = bumpVersion(routesSource.version);
  await writeFile(OUTPUT_PATH, JSON.stringify(source, null, 2) + "\n");
  await writeFile(ROUTES_OUTPUT_PATH, JSON.stringify(routesSource, null, 2) + "\n");
  console.log(`site/places.json written (version ${source.version}).`);
  console.log(`site/routes.json written (version ${routesSource.version}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
