import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectionsOrder, getConnectedLessonResources } from "../src/data/masterCurriculum.js";
import { getLessonSearchMetadata } from "../src/config/seoMetadata.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagesRoot = path.join(root, "src/pages/knowledge");
const configPath = path.join(root, "src/pages.config.js");
const canaryPath = path.join(pagesRoot, "ai-foundations/start-with-the-work-not-the-tool.jsx");
const canaryKey = "ai-foundations/start-with-the-work-not-the-tool";
const marker = "// Generated native lesson page. Source content: src/data/masterCurriculum.js.\n";
const q = JSON.stringify;

function replaceExact(text, before, after) {
  if (!text.includes(before)) throw new Error("Native lesson template anchor missing: " + before.slice(0, 100));
  return text.replace(before, after);
}

function replaceConst(text, name, value) {
  const expression = new RegExp("^const " + name + " = .*;$", "m");
  if (!expression.test(text)) throw new Error("Native lesson template constant missing: " + name);
  return text.replace(expression, "const " + name + " = " + q(value) + ";");
}

function renderPage(template, collection, lesson, name) {
  const slugPath = "/knowledge/" + collection.slug + "/" + lesson.slug;
  const index = collection.lessons.findIndex(item => item.slug === lesson.slug);
  const previous = index > 0 ? collection.lessons[index - 1] : null;
  const next = index < collection.lessons.length - 1 ? collection.lessons[index + 1] : null;
  const isLifetime = collection.slug === "what-a-lifetime-in-business-taught-me";
  const nextPath = next
    ? "/knowledge/" + collection.slug + "/" + next.slug
    : isLifetime
      ? "/knowledge/turning-what-a-business-knows-into-an-asset"
      : collection.nextCollectionSlug
        ? "/knowledge/" + collection.nextCollectionSlug
        : "/knowledge/" + collection.slug;
  const nextLabel = next ? "Next Lesson: " + next.title : "Continue Learning";
  const previousPath = previous ? "/knowledge/" + collection.slug + "/" + previous.slug : "/knowledge/" + collection.slug;
  const previousLabel = previous ? "Previous Lesson: " + previous.title : "Series overview: " + collection.title;
  const seo = getLessonSearchMetadata(collection.slug, lesson);
  const resources = getConnectedLessonResources(collection.slug, lesson.slug).map(resource => ({
    title: resource.title,
    description: resource.description,
    path: resource.path
  }));

  let page = marker + template;
  for (const [key, value] of Object.entries({
    TITLE: lesson.title,
    DESCRIPTION: lesson.description,
    CONTENT: lesson.content,
    TAKEAWAY: lesson.takeaway,
    SEO_TITLE: seo.title,
    CANONICAL: seo.canonical,
    LESSON_ID: lesson.id,
    PREVIOUS_PATH: previousPath,
    NEXT_PATH: nextPath
  })) page = replaceConst(page, key, value);
  page = replaceExact(page, "export default function StartWithTheWorkNotTheToolLessonPage() {",
    "export default function " + name + "() {");
  page = page.replace(/const RELATED_LESSONS = \[[\s\S]*?\];\n/,
    "const RELATED_LESSONS = " + q(resources, null, 2) + ";\n");
  if (!page.includes("const RELATED_LESSONS = " + q(resources, null, 2))) {
    throw new Error("Could not update related lessons for " + slugPath);
  }

  const extraConstants = [
    "const LESSON_PATH = " + q(slugPath) + ";",
    "const COLLECTION_PATH = " + q("/knowledge/" + collection.slug) + ";",
    "const COLLECTION_TITLE = " + q(collection.title) + ";",
    "const LESSON_NUMBER = " + q(index + 1) + ";",
    "const READING_TIME = " + q(lesson.readingTime) + ";",
    "const LEVEL = " + q(lesson.level || "Beginner") + ";",
    "const AUTHOR_LABEL = " + q(isLifetime ? "NTA Point of View" : "Your Digital Growth Guide™") + ";",
    "const PREVIOUS_LABEL = " + q(previousLabel) + ";",
    "const NEXT_LABEL = " + q(nextLabel) + ";",
    "const PUBLISHED_DATE = " + q(isLifetime ? null : (lesson.publishedDate || "2026-07-15")) + ";",
    "const MODIFIED_DATE = " + q(isLifetime ? null : (lesson.modifiedDate || "2026-07-23")) + ";",
    "const READER_RESPONSE = " + q(lesson.readerResponse || null) + ";"
  ].join("\n") + "\n";
  page = page.replace(/^(const TITLE = .*;\n)/m, (line) => line + extraConstants);

  page = replaceExact(page,
    "<Link to=\"/knowledge/ai-foundations\" className=\"hover:text-white\">AI Foundations</Link>",
    "<Link to={COLLECTION_PATH} className=\"hover:text-white\">{COLLECTION_TITLE}</Link>");
  page = replaceExact(page, "<span className=\"text-white\">Lesson 2</span>",
    "<span className=\"text-white\">Lesson {LESSON_NUMBER}</span>");
  page = replaceExact(page,
    "<p className=\"mb-5 text-xs font-bold uppercase tracking-widest text-blue-400\">Lesson 2 · 9–10 min read · Beginner</p>",
    "<p className=\"mb-5 text-xs font-bold uppercase tracking-widest text-blue-400\">{['Lesson ', LESSON_NUMBER, ' · ', READING_TIME, ' · ', LEVEL].join('')}</p>");
  page = replaceExact(page,
    "<span className=\"font-normal text-slate-500\">· Your Digital Growth Guide™</span>",
    "<span className=\"font-normal text-slate-500\">· {AUTHOR_LABEL}</span>");
  page = replaceExact(page, "datePublished: '2026-07-15'", "datePublished: PUBLISHED_DATE");
  page = replaceExact(page, "dateModified: '2026-07-23'", "dateModified: MODIFIED_DATE");
  page = replaceExact(page,
    "slug: '/knowledge/ai-foundations/start-with-the-work-not-the-tool'",
    "slug: LESSON_PATH");
  page = replaceExact(page, "educationalLevel: 'Beginner'", "educationalLevel: LEVEL");
  page = replaceExact(page,
    "path=\"/knowledge/ai-foundations/start-with-the-work-not-the-tool\"",
    "path={LESSON_PATH}");
  page = replaceExact(page,
    "<ArrowLeft className=\"h-5 w-5\" />Previous Lesson: AI Isn't Magic Either</Link>",
    "<ArrowLeft className=\"h-5 w-5\" />{PREVIOUS_LABEL}</Link>");
  page = replaceExact(page,
    "Next Lesson: AI Needs Context Before It Can Be Helpful<ArrowRight className=\"h-5 w-5\" />",
    "{NEXT_LABEL}<ArrowRight className=\"h-5 w-5\" />");

  page = replaceExact(page, "          <LessonArticle content={CONTENT} />",
    "          <LessonArticle content={CONTENT} />\n" +
    "          {READER_RESPONSE && <section className=\"mt-12 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6 md:p-8\">\n" +
    "            <p className=\"mb-4 text-xs font-bold uppercase tracking-widest text-blue-300\">{READER_RESPONSE.label || 'A reader’s response'}</p>\n" +
    "            <blockquote className=\"text-2xl font-medium leading-relaxed text-white\">“{READER_RESPONSE.quote}”</blockquote>\n" +
    "            <p className=\"mt-5 text-sm font-bold text-slate-200\">— {READER_RESPONSE.attribution}</p>\n" +
    "            {READER_RESPONSE.context && <p className=\"mt-5 text-sm leading-6 text-slate-400\">{READER_RESPONSE.context}</p>}\n" +
    "          </section>}");
  if (isLifetime && !next) {
    page = replaceExact(page,
      "        <section className=\"px-6 py-12\"><div className=\"mx-auto max-w-3xl\"><ContentNextSteps",
      "        <section className=\"border-t border-slate-800 px-6 py-12\"><div className=\"mx-auto max-w-3xl\"><h2 className=\"mb-4 text-2xl font-black text-white\">Continue the idea</h2><p className=\"mb-6 text-slate-400\">A lifetime of experience becomes more useful when a business can keep learning from it.</p><Link to=\"/knowledge/turning-what-a-business-knows-into-an-asset\" className=\"font-bold text-blue-400\">Explore business knowledge <ArrowRight className=\"inline h-4 w-4\" /></Link></div></section>\n" +
      "        <section className=\"px-6 py-12\"><div className=\"mx-auto max-w-3xl\"><ContentNextSteps");
  }
  if (!page.includes("const CONTENT = " + q(lesson.content) + ";") ||
      !page.includes("const CANONICAL = " + q(seo.canonical) + ";")) {
    throw new Error("Native page source validation failed for " + slugPath);
  }
  return page;
}

const template = fs.readFileSync(canaryPath, "utf8");
const canaryLesson = collectionsOrder.find(c => c.slug === "ai-foundations")
  ?.lessons.find(l => l.slug === "start-with-the-work-not-the-tool");
if (!template.includes("const CONTENT = " + q(canaryLesson.content) + ";")) {
  throw new Error("The native-page template lesson is out of sync with its source content.");
}

const imports = [];
const routes = [];
let count = 0;
for (const collection of collectionsOrder) {
  for (const lesson of collection.lessons) {
    const key = collection.slug + "/" + lesson.slug;
    if (key === canaryKey) continue;
    const name = "NativeLessonPage" + String(++count).padStart(3, "0");
    const relative = path.join(collection.slug, lesson.slug + ".jsx");
    const output = path.join(pagesRoot, relative);
    const page = renderPage(template, collection, lesson, name);
    if (fs.existsSync(output) && !fs.readFileSync(output, "utf8").startsWith(marker)) {
      throw new Error("Refusing to overwrite a hand-edited page: " + output);
    }
    fs.mkdirSync(path.dirname(output), { recursive: true });
    if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== page) {
      fs.writeFileSync(output, page);
    }
    imports.push("import " + name + " from './pages/knowledge/" + collection.slug + "/" + lesson.slug + "';");
    routes.push("  'knowledge/" + key + "': " + name + ",");
  }
}

const importStart = "// BEGIN GENERATED NATIVE LESSON IMPORTS";
const importEnd = "// END GENERATED NATIVE LESSON IMPORTS";
const routeStart = "  // BEGIN GENERATED NATIVE LESSON ROUTES";
const routeEnd = "  // END GENERATED NATIVE LESSON ROUTES";
const importBlock = importStart + "\n" + imports.join("\n") + "\n" + importEnd + "\n";
const routeBlock = routeStart + "\n" + routes.join("\n") + "\n" + routeEnd + "\n";
let config = fs.readFileSync(configPath, "utf8");
const importPattern = /\/\/ BEGIN GENERATED NATIVE LESSON IMPORTS[\s\S]*?\/\/ END GENERATED NATIVE LESSON IMPORTS\n/;
const routePattern = /  \/\/ BEGIN GENERATED NATIVE LESSON ROUTES[\s\S]*?  \/\/ END GENERATED NATIVE LESSON ROUTES\n/;
if (importPattern.test(config)) config = config.replace(importPattern, importBlock);
else config = replaceExact(config,
  "import StartWithTheWorkNotTheToolLessonPage from './pages/knowledge/ai-foundations/start-with-the-work-not-the-tool';\n",
  "import StartWithTheWorkNotTheToolLessonPage from './pages/knowledge/ai-foundations/start-with-the-work-not-the-tool';\n" + importBlock);
if (routePattern.test(config)) config = config.replace(routePattern, routeBlock);
else config = replaceExact(config,
  "  'knowledge/ai-foundations/start-with-the-work-not-the-tool': StartWithTheWorkNotTheToolLessonPage,\n",
  "  'knowledge/ai-foundations/start-with-the-work-not-the-tool': StartWithTheWorkNotTheToolLessonPage,\n" + routeBlock);
fs.writeFileSync(configPath, config);
console.log("Created or verified " + count + " native lesson pages and registered them in pages.config.js.");
