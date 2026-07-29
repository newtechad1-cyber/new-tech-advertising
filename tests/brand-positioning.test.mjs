import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const primaryPublicFiles = [
  'index.html',
  'public/llms.txt',
  'public/ai-sitemap.json',
  'src/pages/Home.jsx',
  'src/pages/Contact.jsx',
  'src/pages/About.jsx',
  'src/pages/OurStory.jsx',
  'src/components/shared/SEOHead.jsx',
];

test('primary search and AI-readable surfaces use the practical AI education identity', () => {
  for (const path of primaryPublicFiles) {
    const content = read(path);
    assert.match(
      content,
      /practical AI education/i,
      `${path} should describe NTA through practical AI education`,
    );
  }
});

test('primary public identity no longer describes NTA as an AI marketing agency', () => {
  for (const path of primaryPublicFiles) {
    const content = read(path);
    assert.doesNotMatch(
      content,
      /\bAI[- ]powered marketing agency\b|\bAI marketing agency\b/i,
      `${path} still contains the retired agency identity`,
    );
  }
});

test('AI sitemap declares one unambiguous primary topic', () => {
  const sitemap = JSON.parse(read('public/ai-sitemap.json'));
  assert.equal(
    sitemap.organization.primaryTopic,
    'Practical AI education for small-business owners',
  );
});
