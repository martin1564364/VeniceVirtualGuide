import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_DIR = path.join(ROOT, "site");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8080);

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const target = path.resolve(SITE_DIR, relative);
  return target.startsWith(SITE_DIR + path.sep) || target === SITE_DIR ? target : null;
}

const server = createServer(async (req, res) => {
  const target = safePath(req.url || "/");
  if (!target) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const info = await stat(target);
    const filePath = info.isDirectory() ? path.join(target, "index.html") : target;
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Venice guide running at http://${HOST}:${PORT}`);
});
