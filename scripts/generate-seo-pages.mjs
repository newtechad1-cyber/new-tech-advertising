import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSeoMetadata } from "../src/config/seoMetadata.js";
import { collectionsOrder } from "../src/data/masterCurriculum.js";
import { knowledgeQuestions, getKnowledgeQuestionBySlug, getKnowledgeQuestionPath } from "../src/data/knowledgeQuestions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const sourceSitemap = path.join(root, "public", "sitemap.xml");
const sourceAiSitemap = path.join(root, "public", "ai-sitemap.json");
const sourceLlms = path.join(root, "public", "llms.txt");


const SITE_ORIGIN = "https://newtechadvertising.com";
const TODAY = new Date().toISOString().slice(0, 10);
const KNOWLEDGE_AUTHOR = "Rick Hesse";
const KNOWLEDGE_PUBLISHER = "New Tech Advertising";

function getPublishedJournalIssues() {
  if (!fs.existsSync(sourceAiSitemap)) return [];

  const data = JSON.parse(fs.readFileSync(sourceAiSitemap, "utf8"));
  return (data.journalIssues || [])
    .filter(issue =>
      issue?.publicStatus === "published" &&
      issue?.canonicalUrl &&
      issue?.title
    )
    .map(issue => ({
      ...issue,
      pathname: new URL(issue.canonicalUrl).pathname.replace(/\/+$/, "")
    }));
}

const PUBLISHED_JOURNAL_ISSUES = getPublishedJournalIssues();
const JOURNAL_ISSUES_BY_PATH = new Map(
  PUBLISHED_JOURNAL_ISSUES.map(issue => [issue.pathname, issue])
);
const JOURNAL_METADATA_BY_PATH = new Map(
  PUBLISHED_JOURNAL_ISSUES.map(issue => [issue.pathname, {
    title: issue.title,
    description: issue.description || "The latest practical update from New Tech Advertising.",
    canonical: issue.canonicalUrl,
    noIndex: false,
  }])
);

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

function buildKnowledgeQuestionPages(existingPublicPages = []) {
  const existingByCanonical = new Map(
    existingPublicPages.map(page => [page.canonicalUrl, page])
  );

  const hubCanonicalUrl = SITE_ORIGIN + "/knowledge/questions";
  const hub = {
    ...existingByCanonical.get(hubCanonicalUrl),
    title: "Small Business Questions About AI and Marketing",
    canonicalUrl: hubCanonicalUrl,
    contentType: "CollectionPage",
    description: "Plainspoken answers to practical small-business questions about AI, marketing, customer trust, websites, and local visibility—plus the NTA teaching behind each answer.",
    author: KNOWLEDGE_AUTHOR,
    publisher: KNOWLEDGE_PUBLISHER,
    publicStatus: "published",
    lastModified: TODAY,
  };

  const questions = knowledgeQuestions.map(question => {
    const canonicalUrl = SITE_ORIGIN + getKnowledgeQuestionPath(question);
    return {
      ...existingByCanonical.get(canonicalUrl),
      title: question.question,
      canonicalUrl,
      contentType: "Article",
      description: question.description,
      author: KNOWLEDGE_AUTHOR,
      publisher: KNOWLEDGE_PUBLISHER,
      publicStatus: "published",
      lastModified: TODAY,
    };
  });

  return [hub, ...questions];
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


function buildLlmsKnowledgeSection(knowledgeCollections, questions) {
  const lines = [
    "## Knowledge Library",
    "",
    "The NTA Knowledge Library is a connected set of practical lessons about small-business growth, trust, relationships, business knowledge, AI, and digital trust.",
    "",
    "### [Start with a business question](" + SITE_ORIGIN + "/knowledge/questions)",
    "",
    "Plainspoken answers to common questions about AI, marketing, customer trust, websites, and local visibility. Each answer points to the NTA teaching that explains the connected idea.",
    ""
  ];

  for (const question of questions) {
    lines.push(
      "- [" + question.question + "](" + SITE_ORIGIN + getKnowledgeQuestionPath(question) + "): " + question.answer,
      ""
    );
  }

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

function syncLlmsKnowledgeIndex(knowledgeCollections, questions) {
  if (!fs.existsSync(sourceLlms)) return;

  const current = fs.readFileSync(sourceLlms, "utf8");
  const knowledgeMarker = "\n## Knowledge Library";
  const organizationMarker = "\n## Organization";
  const start = current.indexOf(knowledgeMarker);
  const end = current.indexOf(organizationMarker, start + knowledgeMarker.length);

  if (start < 0 || end < 0) return;

  const updated = [
    current.slice(0, start),
    "\n" + buildLlmsKnowledgeSection(knowledgeCollections, questions),
    current.slice(end)
  ].join("");

  fs.writeFileSync(sourceLlms, updated.trimEnd() + "\n");
}

function syncKnowledgeIndexes() {
  const aiSitemap = JSON.parse(fs.readFileSync(sourceAiSitemap, "utf8"));
  const knowledgeCollections = buildKnowledgeCollections(aiSitemap);
  const questionPages = buildKnowledgeQuestionPages(aiSitemap.publicPages || []);
  const managedQuestionCanonicals = new Set(questionPages.map(page => page.canonicalUrl));
  const publicPages = [
    ...(aiSitemap.publicPages || []).filter(page => !managedQuestionCanonicals.has(page.canonicalUrl)),
    ...questionPages,
  ];

  fs.writeFileSync(
    sourceAiSitemap,
    JSON.stringify({ ...aiSitemap, publicPages, knowledgeCollections }, null, 2) + "\n"
  );

  const generatedRoutes = new Map();
  generatedRoutes.set(
    "/knowledge",
    renderSitemapUrl("/knowledge", TODAY, "weekly", "0.8")
  );
  generatedRoutes.set(
    "/knowledge/questions",
    renderSitemapUrl("/knowledge/questions", TODAY, "weekly", "0.8")
  );

  for (const question of knowledgeQuestions) {
    const questionPath = getKnowledgeQuestionPath(question);
    generatedRoutes.set(
      questionPath,
      renderSitemapUrl(questionPath, TODAY, "monthly", "0.7")
    );
  }

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
  syncLlmsKnowledgeIndex(knowledgeCollections, knowledgeQuestions);
}

function syncJournalIssueRoutes() {
  const generatedRoutes = new Map(
    PUBLISHED_JOURNAL_ISSUES.map(issue => [
      issue.pathname,
      renderSitemapUrl(issue.pathname, issue.lastModified || TODAY, "weekly", "0.7")
    ])
  );

  if (!generatedRoutes.size) return;

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
      <p>New Tech Advertising is looking for a relationship-driven Regional Account Manager to help local business owners across North Iowa and Southern Minnesota. NTA is rooted in Mason City, Iowa, with Rochester, Minnesota, as an important early focus.</p>
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

const OPPORTUNITY_PAGE_DATA = {
  "/account-manager": {
    learning: {
      name: "NTA Account Manager Learning Path",
      description: "Free practical AI education and guided business-conversation resources for people building relationship-based client work with NTA.",
    },
    faqs: [
      {
        question: "Do I need to buy a course, training, or system to begin?",
        answer: "No. NTA's Knowledge Library, videos, Free AI Guy, and Your Digital Growth Guide are free to explore. You bring curiosity and honest effort.",
      },
      {
        question: "Do I need to be an AI, advertising, or marketing expert?",
        answer: "No. NTA provides learning resources and support behind the conversation. The work begins with listening well and helping a business owner find a useful next step.",
      },
      {
        question: "Can I build residual income with NTA?",
        answer: "The goal is to build active client relationships over time. Under a written NTA agreement, ongoing residual compensation can apply while clients you introduced remain active. Earnings are performance-based and not guaranteed.",
      },
      {
        question: "Who can explore this opportunity?",
        answer: "It can fit curious people at different stages of life, including working professionals and retired or semi-retired people with strong business relationships.",
      },
    ],
  },
  "/community-partner": {
    learning: {
      name: "NTA Community Partner Learning Path",
      description: "Free practical AI education for trusted people, Chambers, and organizations helping local business owners understand technology and digital growth.",
    },
    faqs: [
      {
        question: "Does a Community Partner have to buy a program or a course?",
        answer: "No. NTA gives people a place to learn first through free practical AI resources. A partner is not asked to pressure people into a purchase.",
      },
      {
        question: "How does a Community Partner earn income?",
        answer: "The work is relationship-based. Under a written NTA agreement, a partner can be compensated for eligible client relationships they help introduce. Compensation is performance-based and not guaranteed.",
      },
      {
        question: "Can a representative and an organization participate together?",
        answer: "Yes. When a person represents a Chamber or other organization, the written NTA agreement can provide for both the representative and the organization to participate in eligible compensation.",
      },
      {
        question: "Does this only fit a Chamber of Commerce?",
        answer: "No. It can be explored by trusted people, professional groups, associations, local organizations, and community-minded business connectors.",
      },
    ],
  },
  "/community-growth-conversation": {
    learning: {
      name: "Community Growth Conversation",
      description: "A guided conversation for trusted people and organizations exploring how free practical AI education can help local business owners learn.",
    },
    faqs: [],
  },
};

function opportunityDataForPath(pathname) {
  if (pathname === "/regional-account-manager") {
    return OPPORTUNITY_PAGE_DATA["/account-manager"];
  }

  return OPPORTUNITY_PAGE_DATA[pathname] || null;
}

function accountManagerStaticBody() {
  return [
    '<main data-prerendered="true" class="seo-shell">',
    '  <article>',
    '    <p class="seo-kicker">Free AI Education &bull; NTA Account Manager Opportunity</p>',
    '    <h1>Learn practical AI. Help business owners understand it. Build relationship-based residual income.</h1>',
    '    <p>NTA is for curious people who enjoy talking with business owners and want a better way to learn than buying another course. The Knowledge Library, Free AI Guy, videos, and Your Digital Growth Guide&trade; are free to explore.</p>',
    '    <h2>Start the conversation, not the sales pitch</h2>',
    '    <p>You do not need to arrive as the expert. Listen to what a business owner is trying to accomplish, use NTA&rsquo;s resources to learn together, and help bring the right next conversation forward.</p>',
    '    <h2>What you are building toward</h2>',
    '    <p>This is relationship-based work. Under a written NTA agreement, ongoing residual compensation can apply while clients you introduce remain active. It is performance-based work, and earnings are not guaranteed.</p>',
    '    <h2>Who it can fit</h2>',
    '    <p>It can fit people at different stages of life, including working professionals and retired or semi-retired people who have real business relationships and want to keep learning.</p>',
    '    <h2>Questions people ask</h2>',
    '    <p><strong>Do I have to buy training?</strong> No. The practical-AI learning resources are free.</p>',
    '    <p><strong>Do I need to be an AI expert?</strong> No. NTA supplies the learning and support behind the conversation.</p>',
    '    <p><strong>Can I build residual income?</strong> Under the written agreement, it can apply to active client relationships you introduced. It is not guaranteed.</p>',
    '    <p><a href="/account-manager#start-conversation">Start a private opportunity conversation</a></p>',
    '    <nav aria-label="Related NTA resources">',
    '      <a href="/knowledge">Knowledge Library</a>',
    '      <a href="/growth-guide">Your Digital Growth Guide&trade;</a>',
    '      <a href="/growth-show">NTA Growth Show</a>',
    '      <a href="/community-partner">Community Partner opportunity</a>',
    '    </nav>',
    '  </article>',
    '</main>',
  ].join("\n");
}

function communityPartnerStaticBody() {
  return [
    '<main data-prerendered="true" class="seo-shell">',
    '  <article>',
    '    <p class="seo-kicker">Free AI Education &bull; NTA Community Partner Opportunity</p>',
    '    <h1>Help your community learn practical AI &mdash; and build relationship-based income together.</h1>',
    '    <p>New Tech Advertising helps trusted people, Chambers, and organizations give local business owners a place to understand AI, technology, and digital growth without a hard sell. The knowledge is free to explore.</p>',
    '    <h2>Give away the understanding first</h2>',
    '    <p>There is no course to buy, script to memorize, or decision required before people learn what they are looking at. NTA was built as a different answer to the shiny-object programs that leave people alone after the sale.</p>',
    '    <h2>Build value for yourself and your organization</h2>',
    '    <p>When a representative brings an organization to NTA, the relationship can build value for both the representative and the organization. Under a written NTA agreement, both can participate in eligible compensation. It is performance-based and not guaranteed.</p>',
    '    <h2>Who can help</h2>',
    '    <p>Chambers, associations, professional groups, trusted connectors, and community-minded people can begin with the relationships they already have.</p>',
    '    <p><a href="/community-partner#start-conversation">Start a community partnership conversation</a></p>',
    '    <nav aria-label="Related NTA resources">',
    '      <a href="/community-growth-conversation">Community Growth Conversation</a>',
    '      <a href="/knowledge">Knowledge Library</a>',
    '      <a href="/growth-guide">Your Digital Growth Guide&trade;</a>',
    '      <a href="/account-manager">Account Manager opportunity</a>',
    '    </nav>',
    '  </article>',
    '</main>',
  ].join("\n");
}

function communityGrowthConversationStaticBody() {
  return [
    '<main data-prerendered="true" class="seo-shell">',
    '  <article>',
    '    <p class="seo-kicker">Free AI Education &bull; Community Growth Conversation</p>',
    '    <h1>See how free practical-AI learning can strengthen local business relationships.</h1>',
    '    <p>This guided NTA conversation helps trusted people, Chambers, and organizations explore how they can help local business owners understand AI, technology, and digital growth without a hard sell.</p>',
    '    <h2>Explore before you commit</h2>',
    '    <p>The purpose is understanding, not pressure. Use the conversation to see what local owners are trying, where they are stuck, and what free NTA learning resources could help.</p>',
    '    <h2>Build community value together</h2>',
    '    <p>When the partnership is a fit, NTA can help a representative and their organization build relationships around useful education. Any compensation is governed by a written NTA agreement and is performance-based.</p>',
    '    <p><a href="/community-partner#start-conversation">Talk with NTA about a community partnership</a></p>',
    '    <nav aria-label="Related NTA resources">',
    '      <a href="/community-partner">Community Partner opportunity</a>',
    '      <a href="/knowledge">Knowledge Library</a>',
    '      <a href="/account-manager">Account Manager opportunity</a>',
    '    </nav>',
    '  </article>',
    '</main>',
  ].join("\n");
}

function opportunityStaticBody(pathname) {
  if (pathname === "/account-manager" || pathname === "/regional-account-manager") {
    return accountManagerStaticBody();
  }

  if (pathname === "/community-partner") {
    return communityPartnerStaticBody();
  }

  if (pathname === "/community-growth-conversation") {
    return communityGrowthConversationStaticBody();
  }

  return "";
}

function journalInline(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function journalContentHtml(value) {
  return String(value || "")
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map(block => {
      const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
      const isList = lines.every(line => /^[-*]\s+|^\d+\.\s+/.test(line));

      if (isList) {
        return "<ul>" + lines
          .map(line => "<li>" + journalInline(line.replace(/^[-*]\s+|^\d+\.\s+/, "")) + "</li>")
          .join("") + "</ul>";
      }

      return "<p>" + journalInline(lines.join(" ")) + "</p>";
    })
    .join("");
}

function journalStaticBody(pathname) {
  const issue = JOURNAL_ISSUES_BY_PATH.get(pathname);
  if (!issue?.sections?.length) return "";

  const article = issue.primaryArticle || {};
  const video = issue.featuredVideo || {};
  const articleCard = article.url && article.title
    ? `<section class="journal-static-card">
        <p class="seo-kicker">Continue reading</p>
        <h2>${escapeHtml(article.title)}</h2>
        <p>${escapeHtml(article.excerpt || "")}</p>
        <p><a href="${escapeHtml(article.url)}">Read this article on NTA's website</a></p>
      </section>`
    : "";
  const videoCard = video.url && video.title
    ? `<section class="journal-static-card">
        <p class="seo-kicker">This week's video</p>
        <h2>${escapeHtml(video.title)}</h2>
        <p>${escapeHtml(video.description || "")}</p>
        <p><a href="${escapeHtml(video.url)}">Watch the video on YouTube</a></p>
      </section>`
    : "";

  return `<main data-prerendered="true" data-static-journal="true" class="seo-shell journal-static">
    <article>
      <nav aria-label="NTA Journal navigation">
        <a href="/">New Tech Advertising</a>
        <a href="/journal">Journal archive</a>
        <a href="/nta-journal#subscribe">Subscribe</a>
      </nav>
      <p class="seo-kicker">The NTA Journal · Issue #${escapeHtml(issue.issueNumber)}</p>
      <h1>${escapeHtml(issue.title)}</h1>
      ${issue.subtitle ? `<p class="journal-static-subtitle">${escapeHtml(issue.subtitle)}</p>` : ""}
      <p class="journal-static-byline">${escapeHtml(issue.author || "Rick Hesse")} · ${escapeHtml(issue.lastModified || "")} · ${escapeHtml(issue.estimatedReadingTime || "")}</p>
      ${issue.introductoryMessage ? `<div class="journal-static-intro">${journalContentHtml(issue.introductoryMessage)}</div>` : ""}
      ${issue.sections.map(section => `<section class="journal-static-section">
        <h2>${escapeHtml(section.heading)}</h2>
        ${journalContentHtml(section.body)}
      </section>`).join("")}
      ${articleCard}
      ${videoCard}
      ${issue.closingMessage ? `<div class="journal-static-closing">${journalContentHtml(issue.closingMessage)}</div>` : ""}
      <nav aria-label="Continue with NTA">
        <a href="/journal">Read the Journal archive</a>
        <a href="/nta-journal#subscribe">Subscribe to the NTA Journal</a>
        <a href="/contact">Contact NTA</a>
      </nav>
    </article>
  </main>`;
}

function knowledgeQuestionStaticBody(pathname) {
  const prefix = "/knowledge/questions/";
  if (!pathname.startsWith(prefix)) return "";

  const question = getKnowledgeQuestionBySlug(pathname.slice(prefix.length));
  if (!question || pathname !== getKnowledgeQuestionPath(question)) return "";

  const resourceLinks = (question.resources || [])
    .map(resource => '<a href="' + escapeHtml(resource.path) + '">' + escapeHtml(resource.title) + '</a>')
    .join("");
  const relatedLinks = (question.relatedQuestionSlugs || [])
    .map(slug => getKnowledgeQuestionBySlug(slug))
    .filter(Boolean)
    .slice(0, 3)
    .map(related => '<a href="' + escapeHtml(getKnowledgeQuestionPath(related)) + '">' + escapeHtml(related.question) + '</a>')
    .join("");

  return `<main data-prerendered="true" data-static-question="true" class="seo-shell">
    <article>
      <nav aria-label="NTA Knowledge Library navigation">
        <a href="/knowledge">Knowledge Library</a>
        <a href="/knowledge/questions">Small-business questions</a>
      </nav>
      <p class="seo-kicker">Small-business question</p>
      <h1>${escapeHtml(question.question)}</h1>
      <p>By Rick Hesse &middot; <time datetime="${TODAY}">Updated ${TODAY}</time></p>
      <h2>Short answer</h2>
      <p class="speakable">${escapeHtml(question.answer)}</p>
      <h2>Where this fits in a real small business</h2>
      <p>${escapeHtml(question.context)}</p>
      <h2>One useful next step</h2>
      <p>${escapeHtml(question.nextStep)}</p>
      <h2>Explore the teaching behind this answer</h2>
      <nav aria-label="Related NTA resources">${resourceLinks}</nav>
      <h2>Related questions</h2>
      <nav aria-label="Related small-business questions">${relatedLinks}</nav>
    </article>
  </main>`;
}

function knowledgeQuestionSchemaMarkup(pathname, metadata) {
  const prefix = "/knowledge/questions/";
  if (!pathname.startsWith(prefix)) return "";

  const question = getKnowledgeQuestionBySlug(pathname.slice(prefix.length));
  if (!question || pathname !== getKnowledgeQuestionPath(question)) return "";

  const canonical = metadata.canonical;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": canonical + "#article",
      "headline": question.question,
      "description": question.description,
      "author": {
        "@type": "Person",
        "@id": SITE_ORIGIN + "/#rick-hesse",
        "name": KNOWLEDGE_AUTHOR,
      },
      "publisher": {
        "@type": "Organization",
        "@id": SITE_ORIGIN + "/#organization",
        "name": KNOWLEDGE_PUBLISHER,
      },
      "datePublished": TODAY,
      "dateModified": TODAY,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical,
      },
      "url": canonical,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": question.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": question.answer,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_ORIGIN + "/" },
        { "@type": "ListItem", "position": 2, "name": "Knowledge Library", "item": SITE_ORIGIN + "/knowledge" },
        { "@type": "ListItem", "position": 3, "name": "Small-business questions", "item": SITE_ORIGIN + "/knowledge/questions" },
        { "@type": "ListItem", "position": 4, "name": question.question, "item": canonical },
      ],
    },
  ];

  return schemas
    .map(schema => '<script type="application/ld+json">' + JSON.stringify(schema).replace(/</g, "\\u003c") + '</script>')
    .join("\n");
}

function opportunitySchemaMarkup(pathname, metadata) {
  const opportunity = opportunityDataForPath(pathname);
  if (!opportunity) return "";

  const canonical = metadata.canonical;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": canonical + "#webpage",
      "url": canonical,
      "name": metadata.title,
      "description": metadata.description,
      "isPartOf": { "@id": SITE_ORIGIN + "/#website" },
      "publisher": { "@id": SITE_ORIGIN + "/#organization" },
      "inLanguage": "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "@id": canonical + "#learning-resource",
      "name": opportunity.learning.name,
      "description": opportunity.learning.description,
      "url": canonical,
      "learningResourceType": "Guided learning",
      "educationalLevel": "Beginner",
      "isAccessibleForFree": true,
      "inLanguage": "en-US",
      "provider": { "@id": SITE_ORIGIN + "/#organization" },
    },
  ];

  if (opportunity.faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": opportunity.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  return schemas
    .map((schema) => '<script type="application/ld+json">' + JSON.stringify(schema).replace(/</g, "\\u003c") + '</script>')
    .join("\n");
}

function shellMarkup(metadata, pathname) {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonical = escapeHtml(metadata.canonical);
  const heading = escapeHtml(metadata.title.replace(/\s+\|\s+.*$/, ""));
  const body = knowledgeQuestionStaticBody(pathname)
    || journalStaticBody(pathname)
    || opportunityStaticBody(pathname)
    || `<main data-prerendered="true" class="seo-shell">
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
    body:has(#root > .seo-shell) { margin: 0; min-width: 0; max-width: 100%; background: #020617; overflow-x: hidden; }
    #root:has(> .seo-shell) { min-height: 100vh; max-width: 100%; overflow-x: hidden; }
    .seo-shell { box-sizing: border-box; min-height: 100vh; padding: clamp(1rem, 6vw, 4rem) 1.25rem; display: flex; justify-content: center; background: radial-gradient(ellipse at top right, rgb(37 99 235 / 0.25), transparent 52%), linear-gradient(135deg, #0f172a, #020617); color: #e2e8f0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .seo-shell article { box-sizing: border-box; width: min(100%, 760px); padding: clamp(1.25rem, 4vw, 3rem); border: 1px solid rgb(103 232 249 / 0.2); border-top: 4px solid #22d3ee; border-radius: 1.5rem; background: rgb(15 23 42 / 0.94); box-shadow: 0 20px 50px rgb(2 6 23 / 0.45); }
    .seo-kicker { margin: 0 0 0.75rem; color: #67e8f9; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .seo-shell h1 { margin: 0; color: #f8fafc; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.08; letter-spacing: -0.03em; }
    .seo-shell h2 { margin: 2rem 0 0.5rem; color: #f1f5f9; font-size: 1.25rem; line-height: 1.2; }
    .seo-shell p { margin: 0.85rem 0; color: #cbd5e1; font-size: 1rem; line-height: 1.7; }
    .seo-shell a { color: #67e8f9; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
    .seo-shell nav { display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; margin-top: 0.75rem; }
    .seo-shell nav a { font-size: 0.95rem; }
    .journal-static article { max-width: 760px; }
    .journal-static nav:first-child { margin: 0 0 2rem; }
    .journal-static-subtitle { color: #cbd5e1; font-size: 1.15rem; }
    .journal-static-byline { color: #94a3b8; font-size: 0.9rem; }
    .journal-static-intro { margin: 2rem 0; padding: 1.25rem; border-left: 3px solid #22d3ee; background: rgb(8 47 73 / 0.35); }
    .journal-static-section, .journal-static-card, .journal-static-closing { margin: 1.5rem 0; padding: 1.25rem; border: 1px solid rgb(148 163 184 / 0.18); border-radius: 1rem; background: rgb(15 23 42 / 0.65); }
    .journal-static-section h2, .journal-static-card h2 { margin-top: 0; }
    .journal-static ul { margin: 0.85rem 0; padding-left: 1.35rem; color: #cbd5e1; line-height: 1.7; }
    .journal-static li { margin: 0.45rem 0; }
    @media (max-width: 640px) {
      .seo-shell { padding: 1rem; }
      .seo-shell article { border-radius: 1rem; }
    }
  </style>`;
  html = html.replace("</head>", criticalStyles + opportunitySchemaMarkup(pathname, metadata) + knowledgeQuestionSchemaMarkup(pathname, metadata) + '<meta name="robots" content="' + shell.robots + '" />\n    <meta property="og:title" content="' + shell.title + '" />\n    <meta property="og:description" content="' + shell.description + '" />\n    <meta property="og:url" content="' + shell.canonical + '" />\n  </head>');
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
  const journalMetadata = JOURNAL_METADATA_BY_PATH.get(pathname);
  if (journalMetadata) return journalMetadata;

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
syncJournalIssueRoutes();

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