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
  "/knowledge",
  "/knowledge/questions",
  "/knowledge/questions/how-can-a-small-business-use-ai",
  "/restaurants",
  "/digital-growth-advisor",
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
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrl(match[1].trim()));
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

// Select one explicit key; other hosted keys are valid and must not affect it.
const keyPath = path.join(root, "public", INDEXNOW_KEY + ".txt");
if (fs.readFileSync(keyPath, "utf8").trim() !== INDEXNOW_KEY) {
  throw new Error("Configured IndexNow key file does not match INDEXNOW_KEY.");
}
if (urls.length === 0 || urls.length > 10000) {
  throw new Error("IndexNow requires between 1 and 10000 URLs per submission.");
}

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

// Only an explicit --submit may contact the network. Verify the published key
// before notifying IndexNow; a saved repository file is not proof it is live.
const keyResponse = await fetch(KEY_LOCATION, {
  method: "GET",
  redirect: "error",
  signal: AbortSignal.timeout(15000),
});
if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== INDEXNOW_KEY) {
  throw new Error("Published IndexNow key could not be verified; no URLs were submitted.");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
  redirect: "error",
  signal: AbortSignal.timeout(30000),
});

const responseText = await response.text();
if (![200, 202].includes(response.status)) {
  throw new Error("IndexNow submission failed (" + response.status + "): " + responseText);
}

console.log("IndexNow received " + urls.length + " URL(s). HTTP " + response.status + ".");
if (response.status === 202) console.log("IndexNow key validation is pending.");
