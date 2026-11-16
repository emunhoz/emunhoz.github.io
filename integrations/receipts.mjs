import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const PLACEHOLDER = /(<span data-receipt="home"[^>]*>)—/;
const LOCAL_ASSET = /(?:href|src)="(\/[^"]+\.(?:css|js))"/g;
const SCRIPT_TAG = /<script\b/g;

function gzipBytes(path) {
  return gzipSync(readFileSync(path)).byteLength;
}

// Measures the built home page and writes the result into /system after the build.
export default function receipts() {
  return {
    name: "receipts",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const homePath = join(dist, "index.html");
        const systemPath = join(dist, "system", "index.html");
        const home = readFileSync(homePath, "utf8");

        const assets = [...new Set([...home.matchAll(LOCAL_ASSET)].map(([, path]) => path))];
        const totalBytes = assets.reduce((sum, asset) => sum + gzipBytes(join(dist, asset)), gzipBytes(homePath));
        const scriptCount = home.match(SCRIPT_TAG)?.length ?? 0;
        const kilobytes = (totalBytes / 1024).toFixed(1);
        const receipt = `${kilobytes} KB gzipped (first-party) · ${scriptCount} script${scriptCount === 1 ? "" : "s"} · 0 web fonts`;

        const system = readFileSync(systemPath, "utf8");
        writeFileSync(systemPath, system.replace(PLACEHOLDER, `$1${receipt}`));
        logger.info(`home: ${receipt}`);
      },
    },
  };
}
