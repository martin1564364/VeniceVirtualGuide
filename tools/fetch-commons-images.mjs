// Downloads one Wikimedia/Wikipedia lead JPEG per place into content/photos-src/
// and writes photo attributions to CREDITS.md.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "content", "photos-src");
const CREDITS_PATH = path.join(ROOT, "CREDITS.md");
const SELECTION_PATH = path.join(PHOTOS_DIR, "commons-selection.json");

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "VeniceVirtualGuide/1.0 (offline family travel guide image sourcing)";

const PAGES = {
  "st-marks-square": "Piazza San Marco",
  "st-marks-basilica": "St Mark's Basilica",
  "doges-palace": "Doge's Palace",
  "bridge-of-sighs": "Bridge of Sighs",
  "campanile-di-san-marco": "St Mark's Campanile",
  "st-marks-clock-tower": "St Mark's Clocktower",
  "museo-correr": "Museo Correr",
  "rialto-bridge": "Rialto Bridge",
  "rialto-market": "Rialto Market",
  "grand-canal": "Grand Canal (Venice)",
  "ca-doro": "Ca' d'Oro",
  "frari-basilica": "Santa Maria Gloriosa dei Frari",
  "scuola-grande-di-san-rocco": "Scuola Grande di San Rocco",
  "ca-rezzonico": "Ca' Rezzonico",
  "gallerie-accademia": "Gallerie dell'Accademia",
  "peggy-guggenheim-collection": "Peggy Guggenheim Collection",
  "santa-maria-della-salute": "Santa Maria della Salute",
  "teatro-la-fenice": "La Fenice",
  "libreria-acqua-alta": "Libreria Acqua Alta",
  "venetian-arsenal": "Venetian Arsenal",
  "jewish-ghetto-cannaregio": "Venetian Ghetto",
  "san-giorgio-maggiore": "San Giorgio Maggiore",
  "giudecca-redentore": "Il Redentore",
  "murano-glass-museum": "Murano Glass Museum",
  "santa-maria-san-donato-murano": "Santa Maria e San Donato",
  "burano-colored-houses": "Burano",
  "burano-lace-museum": "Museo del Merletto",
  "torcello-basilica": "Torcello Cathedral",
  "mazzorbo-venissa": "Mazzorbo",
  "lido-di-venezia": "Lido di Venezia",
};

const FALLBACK_QUERIES = {
  "rialto-market": "Rialto Market Venice fish market",
  "museo-correr": "Museo Correr Venice museum",
  "burano-lace-museum": "Museo del Merletto Burano lace museum",
  "mazzorbo-venissa": "Mazzorbo Venissa vineyard",
};

const FILE_OVERRIDES = {
  "museo-correr": "File:(Venice) Museo Correr - Rooms - Library view.jpg",
  "rialto-market": "File:Pescaria Rialto Venice.jpg",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function metaValue(extmetadata, key) {
  return extmetadata && extmetadata[key] ? extmetadata[key].value : "";
}

function commonsUrl(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

async function api(url, params) {
  const requestUrl = new URL(url);
  for (const [key, value] of Object.entries(params)) requestUrl.searchParams.set(key, value);
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    const response = await fetch(requestUrl, {
      headers: { "user-agent": USER_AGENT },
    });
    if (response.ok) return response.json();
    const body = await response.text();
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 10) {
      throw new Error(`API failed ${response.status}: ${body}`);
    }
    await sleep(5000 * attempt);
  }
}

async function leadImageTitle(pageTitle) {
  const data = await api(WIKI_API, {
    action: "query",
    format: "json",
    titles: pageTitle,
    prop: "pageimages",
    piprop: "name",
    pithumbsize: "1200",
    redirects: "1",
    origin: "*",
  });
  const page = Object.values(data.query?.pages || {})[0];
  if (!page?.pageimage) throw new Error(`No lead image for ${pageTitle}`);
  return `File:${page.pageimage}`;
}

async function imageInfo(fileTitle) {
  const data = await api(COMMONS_API, {
    action: "query",
    format: "json",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1200",
    origin: "*",
  });
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`No imageinfo for ${fileTitle}`);
  if (info.mime !== "image/jpeg") throw new Error(`Lead image is not JPEG: ${fileTitle} (${info.mime})`);
  return { title: page.title, info };
}

async function searchImageInfo(query) {
  const data = await api(COMMONS_API, {
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: "10",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1200",
    origin: "*",
  });
  const candidates = Object.values(data.query?.pages || {})
    .filter((page) => page.title && page.imageinfo?.[0])
    .map((page) => ({ title: page.title, info: page.imageinfo[0] }));
  const selected = candidates.find((candidate) => {
    if (candidate.info.mime !== "image/jpeg") return false;
    if ((candidate.info.width || 0) < 800 || (candidate.info.height || 0) < 500) return false;
    if (/map|logo|icon|svg|plan|coat|diagram|portrait/i.test(candidate.title)) return false;
    return Boolean(metaValue(candidate.info.extmetadata, "LicenseShortName"));
  });
  if (!selected) throw new Error(`No fallback Commons JPEG for ${query}`);
  return selected;
}

async function downloadWithRetry(url, filePath) {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT },
    });
    if (response.ok) {
      await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
      return;
    }
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 10) {
      throw new Error(`Download failed ${response.status}: ${url}`);
    }
    await sleep(5000 * attempt);
  }
}

function creditRow(placeId, file) {
  const { title, info } = file;
  const meta = info.extmetadata || {};
  const source = commonsUrl(title);
  const license = stripHtml(metaValue(meta, "LicenseShortName"));
  const licenseUrl = stripHtml(metaValue(meta, "LicenseUrl"));
  const artist = stripHtml(metaValue(meta, "Artist")) || "Unknown";
  const attribution = stripHtml(metaValue(meta, "Attribution"));
  const objectName = stripHtml(metaValue(meta, "ObjectName")) || stripHtml(title.replace(/^File:/, ""));
  const author = attribution || artist;
  const licenseCell = licenseUrl ? `[${license}](${licenseUrl})` : license;
  return `| ${placeId} | \`content/photos-src/${placeId}.jpg\`, \`site/images/${placeId}.webp\`, \`site/images/thumbs/${placeId}.webp\` | [${objectName}](${source}) | ${licenseCell} | ${author} |`;
}

async function main() {
  await mkdir(PHOTOS_DIR, { recursive: true });
  const rows = [];
  const chosen = [];

  for (const [placeId, pageTitle] of Object.entries(PAGES)) {
    let file;
    if (FILE_OVERRIDES[placeId]) {
      file = await imageInfo(FILE_OVERRIDES[placeId]);
    } else {
      try {
      const fileTitle = await leadImageTitle(pageTitle);
      file = await imageInfo(fileTitle);
      } catch (err) {
        const query = FALLBACK_QUERIES[placeId] || pageTitle;
        console.warn(`${placeId}: falling back to Commons search (${err.message})`);
        file = await searchImageInfo(query);
      }
    }
    await downloadWithRetry(file.info.thumburl || file.info.url, path.join(PHOTOS_DIR, `${placeId}.jpg`));
    rows.push(creditRow(placeId, file));
    chosen.push({
      placeId,
      pageTitle,
      fileTitle: file.title,
      source: commonsUrl(file.title),
      license: stripHtml(metaValue(file.info.extmetadata, "LicenseShortName")),
      author: stripHtml(metaValue(file.info.extmetadata, "Artist")) || "Unknown",
    });
    console.log(`${placeId}: ${file.title}`);
    await sleep(2500);
  }

  await writeFile(
    CREDITS_PATH,
    [
      "# Photo Credits",
      "",
      "| Place | Photo | Source | License | Author |",
      "|-------|-------|--------|---------|--------|",
      ...rows,
      "",
      "Images were sourced from Wikipedia/Wikimedia Commons lead images. License and author fields are copied from Commons file metadata at download time.",
      "",
    ].join("\n")
  );

  await writeFile(SELECTION_PATH, JSON.stringify(chosen, null, 2) + "\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
