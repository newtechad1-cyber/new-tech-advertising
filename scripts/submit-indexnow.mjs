import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ORIGIN = "https://newtechadvertising.com";
const INDEXNOW_KEY = "ef775e3bbc9749d6a19087978ce28894";
const KEY_LOCATION = SITE_ORIGIN + "/" + INDEXNOW_KEY + ".txt";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitemapPath = path.join(root, "public", "sitemap.xml");

const DEFAULT_CHANGED_PATHS = [
  "/",
  "/account-manager",
  "/community-partner",
  "/community-growth-conversation",
];

function normalizeUrl(value) {
  const url = new URL(value.startsWith("http") ? value : SITE_ORIGIN + value);

  if (url.origin !== SITE_ORIGIN) {
    throw new Error("IndexNow only accepts canonical newtechadvertising.com URLs: " + value);
  }

  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function sitemapUrls() {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrl(match[1]));
}

const args = process.argv.slice(2);
const submit = args.includes("--submit");
const all = args.includes("--all");
const requestedUrls = args.filter((arg) => !arg.startsWith("--"));

const urls = [...new Set(
  requestedUrls.length
    ? requestedUrls.map(normalizeUrl)
    : all
      ? sitemapUrls()
      : DEFAULT_CHANGED_PATHS.map(normalizeUrl)
)];

const payload = {
  host: new URL(SITE_ORIGIN).host,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

if (!submit) {
  console.log(JSON.stringify({ mode: "dry-run", payload }, null, 2));
  console.log("\nNo URLs were submitted. After the site is published, run:");
  console.log("  npm run seo:indexnow -- --submit");
  console.log("Use --all only when you intentionally want to submit every sitemap URL.");
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const responseText = await response.text();
if (!response.ok) {
  throw new Error("IndexNow submission failed (" + response.status + "): " + responseText);
}

console.log("IndexNow accepted " + urls.length + " URL(s). HTTP " + response.status + ".");
