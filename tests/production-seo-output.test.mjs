import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const QUESTION_PATHS = [
  '/knowledge/questions',
  '/knowledge/questions/how-can-a-small-business-use-ai',
  '/knowledge/questions/where-should-i-start-with-ai',
  '/knowledge/questions/what-can-chatgpt-do-for-a-small-business',
  '/knowledge/questions/do-i-need-a-perfect-prompt',
  '/knowledge/questions/why-does-ai-give-bad-answers',
  '/knowledge/questions/what-ai-tools-does-a-small-business-really-need',
  '/knowledge/questions/how-can-employees-use-ai-at-work',
  '/knowledge/questions/how-much-should-a-small-business-spend-on-marketing',
  '/knowledge/questions/what-should-i-do-with-my-first-500-marketing-budget',
  '/knowledge/questions/why-does-marketing-require-ongoing-spending',
  '/knowledge/questions/how-do-i-know-whether-my-marketing-is-working',
  '/knowledge/questions/why-isnt-my-website-generating-leads',
  '/knowledge/questions/how-do-i-build-customer-trust',
  '/knowledge/questions/how-do-i-market-a-local-service-business',
  '/knowledge/questions/is-social-media-enough-for-a-small-business',
  '/knowledge/questions/should-a-small-business-still-advertise-on-tv',
  '/knowledge/questions/how-can-ai-use-knowledge-already-inside-my-company',
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
    assert.equal(aiSitemapPage.lastModified, '2026-09-02', 'Expected an editorial update date for ' + route);
  }

  assert.match(llms, /Start with a business question/);
  assert.match(llms, /How can a small business use AI\?/);

  const answerPage = readOutputForRoute('/knowledge/questions/how-can-a-small-business-use-ai');
  assert.match(answerPage, /<title>How Can a Small Business Use AI\? \| NTA<\/title>/);
  assert.match(answerPage, /<meta name="robots" content="index, follow/);
  assert.match(answerPage, /<link rel="canonical" href="https:\/\/newtechadvertising\.com\/knowledge\/questions\/how-can-a-small-business-use-ai" \/>/);
  assert.match(answerPage, /<h1>How can a small business use AI\?<\/h1>/);
  assert.match(answerPage, /Start by giving AI one useful job that supports real work/);
  assert.match(answerPage, /<time datetime="2026-09-02">Updated 2026-09-02<\/time>/);
  assert.match(answerPage, /\"dateModified\":\"2026-09-02\"/);
  assert.equal((answerPage.match(/data-seo-static-question-schema="true"/g) || []).length, 3);
  assert.match(answerPage, /\"@type\":\"Article\"/);
  assert.match(answerPage, /\"@type\":\"FAQPage\"/);
  assert.match(answerPage, /\"@type\":\"BreadcrumbList\"/);
});

test('historical route variants can never inherit generic indexable metadata', () => {
  for (const route of [
    '/contentqueue',
    '/insights',
    '/Insights',
    '/restaurantsocialmedia',
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
