import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { buildCandidate, generatedSourceStatus } from '../scripts/build-candidate.mjs';

import {
  KNOWLEDGE_QUESTION_LAST_UPDATED,
  knowledgeQuestions,
  getKnowledgeQuestionPath,
} from '../src/data/knowledgeQuestions.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const QUESTION_PATHS = [
  '/knowledge/questions',
  ...knowledgeQuestions.map(getKnowledgeQuestionPath),
];

function readOutputForRoute(route) {
  const relative = route.replace(/^\//, '');
  const candidates = [
    path.join(distDir, relative),
    path.join(distDir, relative + '.html'),
    path.join(distDir, relative, 'index.html'),
  ];

  const output = candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  assert.ok(output, 'Expected a production output for ' + route);
  return fs.readFileSync(output, 'utf8');
}

function listRenderedHtml(directory = distDir) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listRenderedHtml(entryPath));
    } else if (entry.isFile()) {
      const content = fs.readFileSync(entryPath, 'utf8');
      if (/<!doctype html/i.test(content)) files.push(content);
    }
  }
  return files;
}

test('question-first knowledge resources are in every intentional discovery surface', () => {
  const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  const aiSitemap = JSON.parse(fs.readFileSync(path.join(root, 'public', 'ai-sitemap.json'), 'utf8'));
  const llms = fs.readFileSync(path.join(root, 'public', 'llms.txt'), 'utf8');

  assert.doesNotMatch(sitemap, /<loc>https:\/\/newtechadvertising\.com\/insights<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/newtechadvertising\.com\/(?:business-journey|restaurant-social-media)<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/newtechadvertising\.com\/restaurants<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/newtechadvertising\.com\/digital-growth-advisor<\/loc>/);
  assert.equal(
    aiSitemap.publicPages.some(page => page.canonicalUrl === 'https://newtechadvertising.com/insights'),
    false
  );
  assert.doesNotMatch(llms, /https:\/\/newtechadvertising\.com\/insights/);

  for (const route of QUESTION_PATHS) {
    assert.match(sitemap, new RegExp('<loc>https://newtechadvertising\\.com' + route + '</loc>'));
    const aiSitemapPage = aiSitemap.publicPages.find(
      page => page.canonicalUrl === 'https://newtechadvertising.com' + route
    );
    assert.ok(aiSitemapPage, 'Expected AI sitemap entry for ' + route);
    const question = knowledgeQuestions.find(item => getKnowledgeQuestionPath(item) === route);
    const editorialDate = question?.updatedDate || KNOWLEDGE_QUESTION_LAST_UPDATED;
    assert.equal(aiSitemapPage.lastModified, editorialDate, 'Expected the answer’s editorial update date for ' + route);
    if (question?.publishedDate) {
      const output = readOutputForRoute(route);
      assert.ok(output.includes('"datePublished":"' + question.publishedDate + '"'), 'Preserve the original publication date for ' + route);
      assert.ok(output.includes('"dateModified":"' + editorialDate + '"'), 'Expose the actual revision date for ' + route);
      assert.ok(output.includes('<time datetime="' + editorialDate + '">Updated ' + editorialDate + '</time>'), 'Show the same revision date to readers for ' + route);
    }
  }

  assert.match(llms, /Start with a business question/);
  assert.match(llms, /How can AI help my small business\?/);

  const homepage = readOutputForRoute('/');
  assert.match(homepage, /<h1>What are you trying to figure out in your business\?<\/h1>/);
  assert.match(homepage, /<a href="\/growth-guide">Your Digital Growth Guide™<\/a>/);

  const answerPage = readOutputForRoute('/knowledge/questions/how-can-a-small-business-use-ai');
  assert.match(answerPage, /<title>How Can AI Help My Small Business\? \| NTA<\/title>/);
  assert.match(answerPage, /<meta name="robots" content="index, follow/);
  assert.match(answerPage, /<link rel="canonical" href="https:\/\/newtechadvertising\.com\/knowledge\/questions\/how-can-a-small-business-use-ai" \/>/);
  assert.match(answerPage, /<h1>How can AI help my small business\?<\/h1>/);
  assert.match(answerPage, /Start by giving AI one useful job that supports real work/);
  assert.match(answerPage, /What AI can and cannot help with/);
  assert.match(answerPage, /Ask Your Digital Growth Guide™/);
  assert.match(answerPage, new RegExp('<time datetime="' + KNOWLEDGE_QUESTION_LAST_UPDATED + '">Updated ' + KNOWLEDGE_QUESTION_LAST_UPDATED + '<\\/time>'));
  assert.match(answerPage, new RegExp('\\\"dateModified\\\":\\\"' + KNOWLEDGE_QUESTION_LAST_UPDATED + '\\\"'));
  assert.equal((answerPage.match(/data-seo-static-question-schema="true"/g) || []).length, 4);
  assert.match(answerPage, /\"@type\":\"Article\"/);
  assert.match(answerPage, /\"@type\":\"FAQPage\"/);
  assert.match(answerPage, /\"@type\":\"BreadcrumbList\"/);
  assert.match(answerPage, /\"@type\":\"LearningResource\"/);
});

test('historical route variants can never inherit generic indexable metadata', () => {
  for (const route of [
    '/contentqueue',
    '/insights',
    '/Insights',
    '/restaurantsocialmedia',
    '/restaurant-social-media',
    '/business-journey',
    '/blogpost',
    '/website-rebuilds',
    '/KnowledgeCaptureWorkspace',
    '/NTAAIWorkforceOrchestrator',
    '/AdminAILab',
    '/admin',
    '/nta',
    '/client',
    '/portal',
    '/ops',
    '/agency',
    '/crm',
  ]) {
    const output = readOutputForRoute(route);
    assert.match(output, /<meta name="robots" content="noindex, nofollow" \/>/, route);
  }

  for (const route of [
    '/admin/retired-page',
    '/nta/retired-page',
    '/client/retired-page',
    '/portal/retired-page',
    '/ops/retired-page',
    '/agency/retired-page',
    '/crm/retired-page',
  ]) {
    const directOutput = path.join(distDir, route.replace(/^\//, ''));
    assert.equal(fs.existsSync(directOutput), false, route + ' must not inherit a public SPA file');
  }

  for (const output of listRenderedHtml()) {
    const visibleShell = output.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    if (/<meta name="robots" content="index, follow/.test(visibleShell)) {
      assert.doesNotMatch(visibleShell, /manages\s+5\s+data\s+types/i);
      assert.doesNotMatch(visibleShell, /<h1[^>]*>\s*Data types\s*<\/h1>/i);
    }
  }
});

test('retired public URLs have canonical cleanup HTML instead of homepage metadata', () => {
  const mappings = {"/services/ai-managed-marketing":"/ai-marketing-platform","/services/ai-marketing-systems":"/ai-marketing-platform","/SocialMediaContentSystem":"/ai-social-media","/social-media":"/ai-social-media","/CommunityPartnerProgram":"/community-partner","/getStarted":"/start","/TheHiddenCostOfOutdatedMarketing":"/hidden-cost-of-outdated-marketing","/SocialMediaRochesterMN":"/ai-social-media","/book-a-call":"/book-call"};
  for (const [oldPath, target] of Object.entries(mappings)) {
    const html = readOutputForRoute(oldPath);
    assert.ok(html.includes('rel="canonical" href="https://newtechadvertising.com' + target + '"'), oldPath);
    assert.match(html, /name="robots" content="noindex, (?:no)?follow"/);
    assert.doesNotMatch(html, /<title>Page Not Found/);
  }
});
test('website rebuild intake has its own preferred URL and metadata', () => {
  const html = readOutputForRoute('/rebuild-intake');
  assert.match(html, /Website Rebuild Request/);
  assert.ok(html.includes('rel="canonical" href="https://newtechadvertising.com/rebuild-intake"'));
});


// The candidate guard is tested with process stubs; no git writes, subprocesses
// or actual SEO regeneration occur inside these unit tests.
function candidateHarness({ before = '', after = '', buildStatus = 0, gitStatus = 0 } = {}) {
  const calls = [];
  let inspections = 0;
  const spawn = (command, args, options) => {
    calls.push({ command, args, options });
    if (command === 'git') {
      const value = inspections++ === 0 ? before : after;
      return { status: gitStatus, stdout: value, stderr: '' };
    }
    assert.equal(command, process.execPath);
    assert.deepEqual(args.slice(-1), ['build']);
    assert.equal(options.env.NTA_PODCAST_BUILD_MODE, 'candidate-offline');
    return { status: buildStatus };
  };
  return { spawn, calls };
}

test('offline candidate build preserves reviewed SEO source state', () => {
  const mock = candidateHarness();
  assert.equal(buildCandidate({ spawn: mock.spawn, gitSpawn: mock.spawn, env: {} }), 0);
  assert.deepEqual(mock.calls.map(call => call.command), ['git', process.execPath, 'git']);
  assert.deepEqual(mock.calls[0].args.slice(-3), ['public/sitemap.xml', 'public/ai-sitemap.json', 'public/llms.txt']);
});

test('candidate build refuses already dirty tracked SEO source files before spawning Vite', () => {
  const mock = candidateHarness({ before: ' M public/sitemap.xml' });
  assert.throws(() => buildCandidate({ spawn: mock.spawn, gitSpawn: mock.spawn, env: {} }), /already modified before the build/);
  assert.deepEqual(mock.calls.map(call => call.command), ['git']);
});

test('candidate build fails closed when SEO generation changes a tracked source', () => {
  const mock = candidateHarness({ after: ' M public/ai-sitemap.json\\n M public/llms.txt' });
  assert.throws(() => buildCandidate({ spawn: mock.spawn, gitSpawn: mock.spawn, env: {} }), /unexpectedly changed tracked SEO source files/);
  assert.deepEqual(mock.calls.map(call => call.command), ['git', process.execPath, 'git']);
});

test('candidate build preserves the Vite failure status when tracked SEO sources are unchanged', () => {
  const mock = candidateHarness({ buildStatus: 23 });
  assert.equal(buildCandidate({ spawn: mock.spawn, gitSpawn: mock.spawn, env: {} }), 23);
});

test('candidate build never assumes SEO state is clean when git inspection fails', () => {
  const mock = candidateHarness({ gitStatus: 128 });
  assert.throws(() => generatedSourceStatus({ spawn: mock.spawn }), /Could not verify generated SEO source/);
  assert.deepEqual(mock.calls.map(call => call.command), ['git']);
});



import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import * as schemaManager from '../src/lib/seoSchema.js';
import { getSeoMetadata } from '../src/config/seoMetadata.js';
import * as socialLinks from '../src/config/socialLinks.js';
import * as videoPublication from '../src/lib/videoPublication.js';
import { VIDEO_WATCH_PAGES } from '../src/data/videoSeo.js';
import * as bookSeo from '../src/data/bookSeo.js';

// A small head-only DOM for executing the actual SEOHead and RouteMeta effects.
// It cannot fetch, submit, invoke a provider, or read a signed-in browser.
function schemaHead(html = '') {
  class HeadElement {
    constructor(tag) { this.tagName = tag; this.attributes = new Map(); this.textContent = ''; this.parentNode = null; }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    set type(value) { this.setAttribute('type', value); }
    set className(value) { this.setAttribute('class', value); }
    set text(value) { this.textContent = value; }
    remove() { this.parentNode?.removeChild(this); }
  }
  const children = [];
  const matches = (node, selector) => {
    const match = selector.match(/^([a-z]+)(?:\[([^=\]]+)(?:="([^"]*)")?\])?$/);
    assert.ok(match, 'Unsupported head selector: ' + selector);
    return node.tagName === match[1] && (!match[2] ||
      (match[3] === undefined ? node.getAttribute(match[2]) !== null : node.getAttribute(match[2]) === match[3]));
  };
  const head = {
    appendChild(node) { children.push(node); node.parentNode = head; return node; },
    removeChild(node) { const index = children.indexOf(node); if (index !== -1) children.splice(index, 1); node.parentNode = null; },
    querySelectorAll(selector) { return children.filter(node => matches(node, selector)); },
    querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; },
  };
  const doc = { head, title: '', createElement: tag => new HeadElement(tag) };
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!match[1].includes('application/ld+json')) continue;
    const node = doc.createElement('script');
    for (const attr of match[1].matchAll(/([\w-]+)="([^"]*)"/g)) node.setAttribute(attr[1], attr[2]);
    node.textContent = match[2];
    head.appendChild(node);
  }
  return doc;
}
const schemaNodes = doc => doc.head.querySelectorAll('script[type="application/ld+json"]')
  .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
const schemasOfType = (doc, type) => schemaNodes(doc).filter(node => [node['@type']].flat().includes(type));

function headEffects(doc, pathname, componentPath = 'src/components/shared/SEOHead.jsx') {
  const effects = [];
  const exports = {};
  const context = {
    exports, URL, document: doc,
    window: { location: { pathname, origin: 'https://preview.example.test' } },
    require(id) {
      if (id === 'react') return { useEffect: effect => effects.push(effect), useLayoutEffect: effect => effects.push(effect) };
      if (id === 'react-router-dom') return { useLocation: () => ({ pathname }) };
      if (id === '@/config/seoMetadata') return { getSeoMetadata };
      if (id === '@/config/socialLinks') return socialLinks;
      if (id === '@/lib/videoPublication') return videoPublication;
      if (id === '@/lib/seoSchema') return schemaManager;
      if (id === '@/data/bookSeo.js') return bookSeo;
      if (id === '@/lib/publicTracking') return { trackPublicPageView() {}, installPublicIntentTracking() {} };
      throw new Error('Unexpected module: ' + id);
    },
  };
  const compiled = ts.transpileModule(fs.readFileSync(path.join(root, componentPath), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  assert.equal(compiled.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  vm.runInNewContext(compiled.outputText, context);
  return props => {
    exports.default(props);
    const cleanups = effects.splice(0).map(effect => effect()).filter(fn => typeof fn === 'function');
    return () => cleanups.forEach(cleanup => cleanup());
  };
}

test('initial production schema has one site graph and no repeated entity IDs on every sitemap page', () => {
  const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const route = new URL(match[1]).pathname;
    const doc = schemaHead(readOutputForRoute(route));
    const ids = schemaNodes(doc).map(node => node['@id']).filter(Boolean);
    assert.equal(ids.length, new Set(ids).size, route + ' contains duplicate entity definitions');
    assert.equal(doc.head.querySelectorAll('script[data-seo-site-schema="true"]').length, 1, route);
    for (const script of doc.head.querySelectorAll('script[data-seo-canonical]')) {
      assert.equal(script.getAttribute('data-seo-canonical'), getSeoMetadata(route).canonical, route);
    }
  }
});

test('the actual homepage SEO effect adopts the site graph without losing the initial logo or founding date', () => {
  const doc = schemaHead(readOutputForRoute('/'));
  const before = schemasOfType(doc, 'Organization')[0];
  const cleanup = headEffects(doc, '/')({});
  for (const type of ['Organization', 'Person', 'WebSite']) assert.equal(schemasOfType(doc, type).length, 1, type);
  const after = schemasOfType(doc, 'Organization')[0];
  assert.equal(after.logo, before.logo);
  assert.equal(after.foundingDate, before.foundingDate);
  cleanup();
  for (const type of ['Organization', 'Person', 'WebSite']) assert.equal(schemasOfType(doc, type).length, 1, type);
});

test('lesson hydration adopts rich static Article and LearningResource nodes and preserves editorial dates', () => {
  const route = '/knowledge/ai-foundations/i-asked-ai-to-seo-my-website-why-wasnt-that-enough';
  const doc = schemaHead(readOutputForRoute(route));
  const before = schemasOfType(doc, 'Article')[0];
  assert.ok(before.dateModified);
  const cleanup = headEffects(doc, route)({
    articleData: { title: before.headline }, learningData: { name: before.headline },
  });
  assert.equal(schemasOfType(doc, 'Article').length, 1);
  assert.equal(schemasOfType(doc, 'LearningResource').length, 1);
  assert.equal(schemasOfType(doc, 'Article')[0].dateModified, before.dateModified);
  cleanup();
  assert.equal(schemasOfType(doc, 'Article')[0].dateModified, before.dateModified);
});

test('actual RouteMeta navigation retires all old page schemas while preserving site and unrelated schema', () => {
  const oldRoute = '/knowledge/ai-foundations/i-asked-ai-to-seo-my-website-why-wasnt-that-enough';
  const doc = schemaHead(readOutputForRoute(oldRoute));
  const unrelated = doc.createElement('script');
  unrelated.type = 'application/ld+json';
  unrelated.textContent = JSON.stringify({ '@type': 'Dataset', name: 'Unrelated owner' });
  doc.head.appendChild(unrelated);
  const cleanup = headEffects(doc, oldRoute)({ articleData: { title: 'Lesson' } });
  headEffects(doc, '/contact', 'src/components/shared/RouteMeta.jsx')();
  cleanup();
  assert.equal(doc.head.querySelectorAll('script[data-seo-canonical]').length, 0);
  assert.equal(schemasOfType(doc, 'Dataset').length, 1);
  assert.equal(schemasOfType(doc, 'Organization').length, 1);
  assert.equal(doc.head.querySelector('link[rel="canonical"]').getAttribute('href'), getSeoMetadata('/contact').canonical);
});

test('canonical breadcrumbs follow the preferred route on preview hosts and legacy aliases', () => {
  const doc = schemaHead(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  headEffects(doc, '/SocialMediaRochesterMN')({});
  const canonical = getSeoMetadata('/SocialMediaRochesterMN').canonical;
  const breadcrumb = schemasOfType(doc, 'BreadcrumbList')[0].itemListElement;
  assert.equal(breadcrumb[0].item, 'https://newtechadvertising.com/');
  assert.equal(breadcrumb.at(-1).item, canonical);
  assert.ok(breadcrumb.every(item => !item.item.includes('preview.example.test')));
  assert.equal(schemaManager.canonicalPageUrl('https://www.newtechadvertising.com/contact/?source=test#part'), 'https://newtechadvertising.com/contact');
});

test('valid video hydration preserves the original upload date and never duplicates the video', () => {
  for (const route of [
    VIDEO_WATCH_PAGES.find(video => video.path.startsWith('/learning-center/videos/')).path,
    VIDEO_WATCH_PAGES.find(video => video.category === 'Growth Show').path,
  ]) {
  const doc = schemaHead(readOutputForRoute(route));
  const video = schemasOfType(doc, 'VideoObject')[0];
  assert.ok(video?.uploadDate);
  headEffects(doc, route)({ videoData: video });
  assert.equal(schemasOfType(doc, 'VideoObject').length, 1);
  assert.equal(schemasOfType(doc, 'VideoObject')[0].uploadDate, video.uploadDate);
  }
});

test('the actual book wrapper adopts Book schema without deleting its learning metadata', () => {
  const book = bookSeo.BOOK_PAGES[0];
  const doc = schemaHead(readOutputForRoute(book.path));
  const before = JSON.stringify(schemasOfType(doc, 'LearningResource'));
  const cleanup = headEffects(doc, book.path, 'src/components/books/BookStructuredData.jsx')({ book });
  assert.equal(schemasOfType(doc, 'Book').length, 1);
  assert.equal(JSON.stringify(schemasOfType(doc, 'LearningResource')), before);
  assert.equal(schemasOfType(doc, 'Book')[0].datePublished, undefined);
  cleanup();
  assert.equal(schemasOfType(doc, 'Book').length, 1);
});

test('native video pages and their generator delegate schema without deleting the static learning records', () => {
  const files = VIDEO_WATCH_PAGES.map(video => path.join(root, 'src/pages', video.path + '.jsx'));
  let native = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes('const VIDEO_SCHEMA')) continue;
    native++;
    assert.match(source, /videoData=\{VIDEO_SCHEMA\}/, file);
    assert.doesNotMatch(source, /querySelectorAll\('script\[data-seo-static-video-schema/, file);
    assert.doesNotMatch(source, /<script type="application\/ld\+json"/, file);
  }
  assert.equal(native, 13);
  const generator = fs.readFileSync(path.join(root, 'scripts/generate-native-video-pages.mjs'), 'utf8');
  assert.ok(generator.includes('videoData={VIDEO_SCHEMA}'));
  assert.equal(generator.includes('data-seo-static-video-schema'), false);
});

test('distinct videos remain separate and schema text cannot break out of its script', () => {
  const canonical = 'https://newtechadvertising.com/example';
  const makeVideo = id => ({ '@type': 'VideoObject', name: '</script><p>text', embedUrl: 'https://www.youtube-nocookie.com/embed/' + id });
  const markup = schemaManager.pageSchemaMarkup([makeVideo('one'), makeVideo('two')].map(video =>
    '<script type="application/ld+json">' + JSON.stringify(video).replace(/</g, '\\u003c') + '</script>').join(''), canonical);
  const doc = schemaHead(markup);
  const cleanup = schemaManager.addPageSchema(doc, { ...makeVideo('one'), embedUrl: 'https://www.youtube.com/embed/one?rel=0' }, canonical);
  assert.equal(schemasOfType(doc, 'VideoObject').length, 2);
  assert.doesNotMatch(markup, /<p>text/);
  cleanup();
  schemaManager.clearStalePageSchemas(doc, 'https://newtechadvertising.com/contact');
  assert.equal(schemasOfType(doc, 'VideoObject').length, 0);
});

test('production text assets do not ship the retired client proposal', () => {
  const assets = path.join(distDir, 'assets');
  const javascript = fs.readdirSync(assets).filter(file => /\.(?:js|map)$/.test(file));
  assert.ok(javascript.length > 0, 'Expected built public JavaScript');
  for (const file of javascript) {
    const body = fs.readFileSync(path.join(assets, file), 'utf8');
    assert.equal(body.includes('Introductory discussion proposal'), false, 'retired proposal prose in ' + file);
    assert.equal(body.includes('ApplianceOutletCampaignProposal'), false, 'retired source module in ' + file);
  }
});
