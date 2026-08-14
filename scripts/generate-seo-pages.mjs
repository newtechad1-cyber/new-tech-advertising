import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoMetadata } from "../src/config/seoMetadata.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const sourceSitemap = path.join(root, "public", "sitemap.xml");

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
  const body = '<main data-prerendered="true" class="seo-shell"><article><p class="seo-kicker">New Tech Advertising</p><h1>' +
    heading + '</h1><p>' + description + '</p><p>Practical AI education and small-business growth guidance from Rick Hesse and NTA.</p><nav aria-label="Public site links"><a href="/">Home</a><a href="/knowledge">AI Lessons</a><a href="/practical-ai-for-small-business">Practical AI Guide</a><a href="/free-audit">Free Gap Audit</a><a href="/contact">Contact NTA</a></nav></article></main>';
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
  html = html.replace("</head>", '<meta name="robots" content="' + shell.robots + '" />\n    <meta property="og:title" content="' + shell.title + '" />\n    <meta property="og:description" content="' + shell.description + '" />\n    <meta property="og:url" content="' + shell.canonical + '" />\n  </head>');
  html = html.replace('<div id="root"></div>', '<div id="root">' + shell.body + '</div>');
  return html;
}

function getSitemapPaths() {
  const xml = fs.readFileSync(sourceSitemap, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => cleanPath(match[1]))
    .filter((value, index, values) => values.indexOf(value) === index);
}

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const paths = getSitemapPaths();
for (const pathname of paths) {
  const metadata = getSeoMetadata(pathname);
  const outputDir = pathname === "/" ? distDir : path.join(distDir, pathname.slice(1));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.html"), renderHtml(template, metadata, pathname));
}

console.log("Generated route-aware SEO HTML for " + paths.length + " public URLs.");
