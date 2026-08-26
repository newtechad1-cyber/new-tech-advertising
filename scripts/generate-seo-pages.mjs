import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoMetadata } from "../src/config/seoMetadata.js";
import { collectionsOrder } from "../src/data/masterCurriculum.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const sourceSitemap = path.join(root, "public", "sitemap.xml");
const sourceAiSitemap = path.join(root, "public", "ai-sitemap.json");
const sourceLlms = path.join(root, "public", "llms.txt");


const SITE_ORIGIN = "https://newtechadvertising.com";
const TODAY = new Date().toISOString().slice(0, 10);
const KNOWLEDGE_AUTHOR = "Rick Hesse";
const KNOWLEDGE_PUBLISHER = "New Tech Advertising";

const FEATURED_KNOWLEDGE_COLLECTION = {
  title: "AI, Humanity & Responsibility",
  canonicalUrl: SITE_ORIGIN + "/knowledge/ai-humanity",
  contentType: "LearningCollection",
  description: "Artificial intelligence is more than a new business tool. It reflects the knowledge, contradictions, hopes, fears, wisdom, and brokenness of the people who created it. This collection explores how we can understand AI without worshiping it, fearing it blindly, or surrendering our responsibility to think.",
  author: KNOWLEDGE_AUTHOR,
  publisher: KNOWLEDGE_PUBLISHER,
  lastModified: TODAY,
  lessons: [
    {
      title: "AI Is a Mirror, Not a God",
      canonicalUrl: SITE_ORIGIN + "/knowledge/ai-humanity/ai-is-a-mirror-not-a-god",
      contentType: "LearningResource",
      description: "AI did not appear from somewhere outside humanity. We created it from our accumulated knowledge, which means it reflects both our wisdom and our brokenness. The appropriate response is neither blind trust nor automatic fear, but understanding, discernment, and responsibility.",
      author: KNOWLEDGE_AUTHOR,
      publisher: KNOWLEDGE_PUBLISHER,
      publicStatus: "published",
      lastModified: TODAY
    }
  ]
};

function latestDate(values, fallback = TODAY) {
  const dates = values
    .filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value || ""))
    .sort();
  return dates[dates.length - 1] || fallback;
}

function buildKnowledgeCollection(collection, existingCollection) {
  const existingLessons = new Map(
    (existingCollection?.lessons || []).map(lesson => [lesson.canonicalUrl, lesson])
  );

  const lessons = collection.lessons.map(lesson => {
    const canonicalUrl = SITE_ORIGIN + "/knowledge/" + collection.slug + "/" + lesson.slug;
    const existingLesson = existingLessons.get(canonicalUrl) || {};

    return {
      ...existingLesson,
      title: lesson.searchTitle || lesson.title,
      canonicalUrl,
      contentType: "LearningResource",
      description: lesson.searchDescription || lesson.description || lesson.takeaway || existingLesson.description || "",
      author: KNOWLEDGE_AUTHOR,
      publisher: KNOWLEDGE_PUBLISHER,
      publicStatus: "published",
      lastModified: lesson.modifiedDate || lesson.publishedDate || existingLesson.lastModified || TODAY
    };
  });

  return {
    ...existingCollection,
    title: collection.title,
    canonicalUrl: SITE_ORIGIN + "/knowledge/" + collection.slug,
    contentType: "LearningCollection",
    description: collection.description,
    author: KNOWLEDGE_AUTHOR,
    publisher: KNOWLEDGE_PUBLISHER,
    lastModified: latestDate([
      ...lessons.map(lesson => lesson.lastModified),
      existingCollection?.lastModified
    ]),
    lessons
  };
}

function buildFeaturedKnowledgeCollection(existingCollection) {
  const existingLessons = new Map(
    (existingCollection?.lessons || []).map(lesson => [lesson.canonicalUrl, lesson])
  );

  const featuredLesson = FEATURED_KNOWLEDGE_COLLECTION.lessons[0];
  const existingFeaturedLesson = existingLessons.get(featuredLesson.canonicalUrl);

  return {
    ...existingCollection,
    ...FEATURED_KNOWLEDGE_COLLECTION,
    lessons: [
      ...(existingCollection?.lessons || []).filter(lesson => lesson.canonicalUrl !== featuredLesson.canonicalUrl),
      { ...existingFeaturedLesson, ...featuredLesson }
    ]
  };
}

function buildKnowledgeCollections(existingAiSitemap) {
  const existingCollections = existingAiSitemap.knowledgeCollections || [];
  const existingByCanonical = new Map(
    existingCollections.map(collection => [collection.canonicalUrl, collection])
  );

  const managedCollections = [];
  for (const collection of collectionsOrder) {
    managedCollections.push(
      buildKnowledgeCollection(
        collection,
        existingByCanonical.get(SITE_ORIGIN + "/knowledge/" + collection.slug)
      )
    );

    if (collection.slug === "ai-foundations") {
      managedCollections.push(
        buildFeaturedKnowledgeCollection(
          existingByCanonical.get(FEATURED_KNOWLEDGE_COLLECTION.canonicalUrl)
        )
      );
    }
  }

  const managedCanonicals = new Set(managedCollections.map(collection => collection.canonicalUrl));
  const unmanagedCollections = existingCollections.filter(
    collection => !managedCanonicals.has(collection.canonicalUrl)
  );

  return [...managedCollections, ...unmanagedCollections];
}

function renderSitemapUrl(pathname, lastmod, changefreq = "monthly", priority = "0.7") {
  return [
    "  <url>",
    "    <loc>" + SITE_ORIGIN + pathname + "</loc>",
    "    <lastmod>" + lastmod + "</lastmod>",
    "    <changefreq>" + changefreq + "</changefreq>",
    "    <priority>" + priority + "</priority>",
    "  </url>"
  ].join("\n");
}

function getPathFromSitemapBlock(block) {
  const match = block.match(/<loc>([^<]+)<\/loc>/);
  if (!match) return null;

  const url = new URL(match[1]);
  return url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
}


function buildLlmsKnowledgeSection(knowledgeCollections) {
  const lines = [
    "## Knowledge Library",
    "",
    "The NTA Knowledge Library is a connected set of practical lessons about small-business growth, trust, relationships, business knowledge, AI, and digital trust.",
    ""
  ];

  for (const collection of knowledgeCollections) {
    lines.push(
      "### [" + collection.title + "](" + collection.canonicalUrl + ")",
      "",
      collection.description || "",
      ""
    );

    for (const lesson of collection.lessons || []) {
      const title = String(lesson.title || "").replace(" | NTA", "");
      lines.push(
        "- [" + title + "](" + lesson.canonicalUrl + "): " + (lesson.description || ""),
        ""
      );
    }
  }

  return lines.join("\n");
}

function syncLlmsKnowledgeIndex(knowledgeCollections) {
  if (!fs.existsSync(sourceLlms)) return;

  const current = fs.readFileSync(sourceLlms, "utf8");
  const knowledgeMarker = "\n## Knowledge Library";
  const organizationMarker = "\n## Organization";
  const start = current.indexOf(knowledgeMarker);
  const end = current.indexOf(organizationMarker, start + knowledgeMarker.length);

  if (start < 0 || end < 0) return;

  const updated = [
    current.slice(0, start),
    "\n" + buildLlmsKnowledgeSection(knowledgeCollections),
    current.slice(end)
  ].join("");

  fs.writeFileSync(sourceLlms, updated.trimEnd() + "\n");
}

function syncKnowledgeIndexes() {
  const aiSitemap = JSON.parse(fs.readFileSync(sourceAiSitemap, "utf8"));
  const knowledgeCollections = buildKnowledgeCollections(aiSitemap);

  fs.writeFileSync(
    sourceAiSitemap,
    JSON.stringify({ ...aiSitemap, knowledgeCollections }, null, 2) + "\n"
  );

  const generatedRoutes = new Map();
  generatedRoutes.set(
    "/knowledge",
    renderSitemapUrl("/knowledge", TODAY, "weekly", "0.8")
  );

  for (const collection of knowledgeCollections) {
    const collectionPath = new URL(collection.canonicalUrl).pathname.replace(/\/+$/, "");
    generatedRoutes.set(
      collectionPath,
      renderSitemapUrl(collectionPath, collection.lastModified || TODAY, "monthly", "0.8")
    );

    for (const lesson of collection.lessons || []) {
      const lessonPath = new URL(lesson.canonicalUrl).pathname.replace(/\/+$/, "");
      generatedRoutes.set(
        lessonPath,
        renderSitemapUrl(lessonPath, lesson.lastModified || collection.lastModified || TODAY, "monthly", "0.7")
      );
    }
  }

  const existingXml = fs.readFileSync(sourceSitemap, "utf8");
  const existingBlocks = [...existingXml.matchAll(/  <url>[\s\S]*?<\/url>/g)].map(match => match[0]);
  const seenPaths = new Set();

  const updatedBlocks = existingBlocks.map(block => {
    const pathname = getPathFromSitemapBlock(block);
    if (!pathname || !generatedRoutes.has(pathname)) return block;

    seenPaths.add(pathname);
    return generatedRoutes.get(pathname);
  });

  for (const [pathname, block] of generatedRoutes) {
    if (!seenPaths.has(pathname)) updatedBlocks.push(block);
  }

  const urlsetOpen = existingXml.match(/<urlset[^>]*>/)?.[0] || '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const updatedXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    urlsetOpen,
    ...updatedBlocks,
    "</urlset>",
    ""
  ].join("\n");

  fs.writeFileSync(sourceSitemap, updatedXml);
  syncLlmsKnowledgeIndex(knowledgeCollections);
}


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

function regionalAccountManagerStaticBody() {
  return `<main data-prerendered="true" class="seo-shell">
    <article>
      <p class="seo-kicker">Regional Account Manager Opportunity</p>
      <h1>Regional Account Manager Opportunity in North Iowa &amp; Southern Minnesota</h1>
      <p>New Tech Advertising is looking for a relationship-driven Regional Account Manager to help local business owners across North Iowa and Southern Minnesota. NTA is rooted in Mason City, Iowa, and Rochester, Minnesota, is an important early focus.</p>
      <h2>A relationship-driven account-management opportunity</h2>
      <p>This is not a traditional corporate sales job. The work starts with meeting business owners, listening well, and helping the right NTA conversation begin.</p>
      <h2>You do not have to be every kind of expert</h2>
      <p>NTA provides recruiting videos, the Knowledge Library, Your Digital Growth Guide™ and the Digital Growth Office behind the relationship. You can keep learning and use those same resources with business owners.</p>
      <h2>Where the opportunity is focused</h2>
      <p>The territory includes Mason City, Iowa, North Iowa, Clear Lake, Rochester, Minnesota, and Southern Minnesota business communities. Territory details are discussed together as the opportunity develops.</p>
      <h2>Questions candidates often ask</h2>
      <p><strong>Is this a traditional sales job?</strong> No. It is a relationship-driven account-management and business-development opportunity.</p>
      <p><strong>Do I need to be an AI or marketing expert?</strong> No. NTA’s website and systems provide the learning, tools, and support behind the conversation.</p>
      <p><strong>How does compensation work?</strong> This is performance-based work. The complete arrangement is discussed privately before either side makes a commitment.</p>
      <h2>Explore the opportunity</h2>
      <p><a href="https://www.youtube.com/playlist?list=PLbPNsoazKwmw">Watch the eight-video recruiting series on YouTube</a></p>
      <p><a href="/regional-account-manager#start-conversation">Start a private conversation with NTA</a></p>
      <nav aria-label="Related NTA resources">
        <a href="/knowledge">Knowledge Library</a>
        <a href="/growth-guide">Your Digital Growth Guide™</a>
        <a href="/growth-show">NTA Growth Show</a>
        <a href="/community-partner">Community Partners</a>
      </nav>
    </article>
  </main>`;
}

function shellMarkup(metadata, pathname) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = escapeHtml(metadata.canonical);
  const heading = escapeHtml(metadata.title.replace(/\s+\|\s+.*$/, ""));
  const body = pathname === "/regional-account-manager"
    ? regionalAccountManagerStaticBody()
    : `<main data-prerendered="true" class="seo-shell">
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

// These URLs must never be added to the public sitemap, but they still need
// deterministic server-rendered SEO directives. Base44 serves the root SPA
// shell for unknown paths, which can otherwise expose the homepage's indexable
// metadata until JavaScript runs. Pre-rendering these cleanup URLs gives
// crawlers the correct canonical/noindex instruction in the first HTML response.
const LEGACY_SEARCH_CLEANUP_PATHS = [
  "/home",
  "/Home",
  "/HomePage",
  "/index.html",
  "/ContractorMarketingNorthIowa",
  "/SmallBusinessMarketingNorthIowa",
  "/ContentQueue",
  "/contentqueue",
  "/SiteMap",
  "/site-map",
  "/AdminAILab",
  // Top-level private route families also need a clean-URL fallback shell
  // with noindex metadata before the client-side redirect runs.
  "/portal",
  "/workspace",
  "/agency",
  "/admin",
  "/admin/meshy",
  "/client",
  "/ops",
  "/sales",
  "/reseller",
  "/dashboard",
  "/crm",
  "/leads",
  "/content-command",
  "/content-center",
  "/billing",
  "/settings",
  "/executive-dashboard",
  "/nta",
  "/Login",
  "/login",
];

const LEGACY_COMPONENT_DIRECTORIES = [
  path.join(root, "src", "pages"),
  path.join(root, "src", "legacy-page-components"),
];

function collectLegacyComponentPaths(directory) {
  if (!fs.existsSync(directory)) return [];

  const paths = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      paths.push(...collectLegacyComponentPaths(entryPath));
      continue;
    }

    if (!entry.isFile() || /\.(?:jsx?|tsx?)$/.test(entry.name) === false) continue;

    const pageKey = entry.name.replace(/\.(?:jsx?|tsx?)$/, "");
    if (pageKey && pageKey.toLowerCase() !== "index") {
      paths.push("/" + pageKey);
    }
  }

  return paths;
}

function getLegacyComponentPaths() {
  return LEGACY_COMPONENT_DIRECTORIES.flatMap(collectLegacyComponentPaths);
}

// Static aliases are real URLs in the public router, but they are not all
// intentional search destinations. Include them in the generated cleanup set
// so an alias outside the curated sitemap cannot fall back to generic,
// indexable SPA metadata before the client router runs. Dynamic aliases with
// parameters are handled by their concrete sitemap or cleanup paths.
function getStaticPublicAliasPaths() {
  const routesFile = path.join(root, "src", "config", "publicRoutes.js");
  if (!fs.existsSync(routesFile)) return [];

  const source = fs.readFileSync(routesFile, "utf8");
  return [...source.matchAll(/alias[(]['"]([^'"]+)['"]/g)]
    .map(match => match[1])
    .filter(pathname => pathname && !pathname.includes(":"));
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

function getPrerenderMetadata(pathname, publicPathSet) {
  const metadata = routeMetadata(pathname);
  const canonicalPath = cleanPath(metadata.canonical);

  // A route is allowed to stay indexable only when its canonical destination
  // is part of the intentional public sitemap. Everything else receives
  // deterministic noindex HTML, including legacy page keys that still exist
  // in the source tree and unknown SPA fallback paths.
  if (metadata.noIndex || !publicPathSet.has(canonicalPath)) {
    return { ...metadata, noIndex: true };
  }

  return metadata;
}

syncKnowledgeIndexes();

fs.copyFileSync(sourceSitemap, path.join(distDir, "sitemap.xml"));
fs.copyFileSync(sourceAiSitemap, path.join(distDir, "ai-sitemap.json"));
fs.copyFileSync(sourceLlms, path.join(distDir, "llms.txt"));

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const publicPaths = getSitemapPaths();
const publicPathSet = new Set(publicPaths);
const legacyPaths = [...new Set([
  ...LEGACY_SEARCH_CLEANUP_PATHS,
  ...getLegacyComponentPaths(),
  ...getStaticPublicAliasPaths(),
])].filter(pathname => !publicPathSet.has(pathname));
const paths = [...new Set([...publicPaths, ...legacyPaths])];
const pathsWithDescendants = new Set(
  paths.filter(pathname =>
    paths.some(candidate => candidate !== pathname && candidate.startsWith(pathname + "/"))
  )
);
const rootIndexFile = path.join(distDir, "index.html");
const renderedCleanupPaths = [];

for (const pathname of paths) {
  // The production server must receive a file for the exact clean URL.
  // Extensionless files handle leaf routes; parent routes use a sibling
  // .html file so they can coexist with child-route directories. The
  // production Vite appType setting prevents unknown paths from falling back
  // to the root SPA shell before these files are checked.
  const outputFile = pathname === "/" || pathname === "/index.html"
    ? rootIndexFile
    : pathsWithDescendants.has(pathname)
      ? path.join(distDir, pathname.slice(1) + ".html")
      : path.join(distDir, pathname.slice(1));

  if (outputFile === rootIndexFile && pathname !== "/") continue;

  if (outputFile !== rootIndexFile && fs.existsSync(outputFile) && fs.statSync(outputFile).isDirectory()) {
    fs.rmSync(outputFile, { recursive: true, force: true });
  }

  const metadata = getPrerenderMetadata(pathname, publicPathSet);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, renderHtml(template, metadata, pathname));

  if (!publicPathSet.has(pathname)) {
    renderedCleanupPaths.push(pathname);
  }
}

console.log("Generated route-aware SEO HTML for " + publicPaths.length + " public URLs and " + renderedCleanupPaths.length + " legacy cleanup/alias URLs.");