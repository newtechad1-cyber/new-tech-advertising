import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
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
  assert.match(homepage, /<h1>Advertise Better\.<\/h1>/);
  assert.match(homepage, /Ask Your Digital Growth Guide™/);

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
  const mappings = {"/services/ai-managed-marketing":"/ai-marketing-platform","/services/ai-marketing-systems":"/ai-marketing-platform","/SocialMediaContentSystem":"/ai-social-media","/social-media":"/ai-social-media","/CommunityPartnerProgram":"/community-partner","/getStarted":"/get-started","/TheHiddenCostOfOutdatedMarketing":"/hidden-cost-of-outdated-marketing","/SocialMediaRochesterMN":"/ai-social-media","/book-a-call":"/book-call"};
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
