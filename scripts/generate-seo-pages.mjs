import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoMetadata } from "../src/config/seoMetadata.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const sourceSitemap = path.join(root, "public", "sitemap.xml");
const sourceAiSitemap = path.join(root, "public", "ai-sitemap.json");

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanPath(value) {
  const url = new URL(value);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return pathname || "/";
}

function shellMarkup(metadata, pathname) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = escapeHtml(metadata.canonical);
  const heading = escapeHtml(metadata.title.replace(/\s+\|\s+.*$/, ""));
  const body = `<main data-prerendered="true" class="seo-shell">
    <article>
      <p class="seo-kicker">New Tech Advertising</p>
      <h1>${heading}</h1>
      <p>${description}</p>
      <h2>Practical AI education for small businesses</h2>
      <p>Based in North Iowa, New Tech Advertising helps small-business owners understand and use AI while keeping human judgment in control.</p>
      <h2>Start with a useful next step</h2>
      <p>The free Business Gap Audit identifies visible gaps, immediate priorities, and practical next steps without pressure.</p>
      <p><a href="/free-audit">Start the Free Business Gap Audit</a></p>
      <h2>Continue learning</h2>
      <nav aria-label="Public site links">
        <a href="/">Home</a>
        <a href="/knowledge">AI Lessons</a>
        <a href="/practical-ai-for-small-business">Practical AI Guide</a>
        <a href="/free-audit">Free Gap Audit</a>
        <a href="/nta-journal#subscribe">NTA Journal</a>
        <a href="/contact">Contact NTA</a>
      </nav>
    </article>
  </main>`;
  return {
    title,
    description,
    canonical,
    robots: metadata.noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    body,
    pathname,
  };
}

function renderHtml(template, metadata, pathname) {
  const shell = shellMarkup(metadata, pathname);
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + shell.title + "</title>");
  html = html.replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="' + shell.description + '" />');
  html = html.replace(/<meta name="robots"[^>]*>/i, "");
  html = html.replace(/<link rel="canonical"[^>]*>/i, '<link rel="canonical" href="' + shell.canonical + '" />');
  const criticalStyles = `<style id="seo-shell-critical">
    body:has(#root > .seo-shell) { margin: 0; min-width: 320px; background: #f8fafc; }
    #root:has(> .seo-shell) { min-height: 100vh; }
    .seo-shell { box-sizing: border-box; min-height: 100vh; padding: clamp(1rem, 6vw, 4rem) 1.25rem; display: flex; justify-content: center; background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%); color: #0f172a; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .seo-shell article { box-sizing: border-box; width: min(100%, 760px); padding: clamp(1.25rem, 4vw, 3rem); border: 1px solid #dbeafe; border-top: 4px solid #2563eb; border-radius: 1.5rem; background: #ffffff; box-shadow: 0 20px 50px rgb(15 23 42 / 0.08); }
    .seo-kicker { margin: 0 0 0.75rem; color: #1d4ed8; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .seo-shell h1 { margin: 0; color: #0f172a; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.08; letter-spacing: -0.03em; }
    .seo-shell h2 { margin: 2rem 0 0.5rem; color: #1e293b; font-size: 1.25rem; line-height: 1.2; }
    .seo-shell p { margin: 0.85rem 0; color: #475569; font-size: 1rem; line-height: 1.7; }
    .seo-shell a { color: #1d4ed8; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
    .seo-shell nav { display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; margin-top: 0.75rem; }
    .seo-shell nav a { font-size: 0.95rem; }
    @media (max-width: 640px) {
      .seo-shell { padding: 1rem; }
      .seo-shell article { border-radius: 1rem; }
    }
  </style>`;
  html = html.replace("</head>", criticalStyles + '<meta name="robots" content="' + shell.robots + '" />\n    <meta property="og:title" content="' + shell.title + '" />\n    <meta property="og:description" content="' + shell.description + '" />\n    <meta property="og:url" content="' + shell.canonical + '" />\n  </head>');
  html = html.replace('<div id="root"></div>', '<div id="root">' + shell.body + '</div>');
  return html;
}

function getSitemapPaths() {
  const xml = fs.readFileSync(sourceSitemap, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => cleanPath(match[1]))
    .filter((value, index, values) => values.indexOf(value) === index);
}

function getContentByCanonical() {
  if (!fs.existsSync(sourceAiSitemap)) return new Map();
  const data = JSON.parse(fs.readFileSync(sourceAiSitemap, "utf8"));
  const entries = [
    ...(data.publicPages || []),
    ...(data.knowledgeCollections || []),
    ...(data.knowledgeCollections || []).flatMap(collection => collection.lessons || [])
  ];
  return new Map(entries.filter(entry => entry.canonicalUrl).map(entry => [entry.canonicalUrl, entry]));
}

const contentByCanonical = getContentByCanonical();
function routeMetadata(pathname) {
  const metadata = getSeoMetadata(pathname);
  const content = contentByCanonical.get(metadata.canonical);
  return content && content.description
    ? { ...metadata, description: content.description }
    : metadata;
}

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const paths = getSitemapPaths();
for (const pathname of paths) {
  const metadata = routeMetadata(pathname);
  const outputDir = pathname === "/" ? distDir : path.join(distDir, pathname.slice(1));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), renderHtml(template, metadata, pathname));
}

console.log("Generated route-aware SEO HTML for " + paths.length + " public URLs.");
