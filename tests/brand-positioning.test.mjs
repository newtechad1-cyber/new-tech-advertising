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

// On 2026-11-05, after independent review finding F-B, Rick explicitly approved
// retaining the combined positioning and exact primaryTopic checked below.
// Approval and boundaries: docs/testing/f3-homepage-approved-2026-11-05.md.
// These are content/source tripwires, not proof of rendered or indexed output.
test('public surfaces retain practical AI education and the connected business identity', () => {
  for (const path of primaryPublicFiles.filter(path => !['src/pages/Home.jsx', 'src/pages/About.jsx'].includes(path))) {
    assert.match(read(path), /practical AI education/i, `${path} should retain the education identity`);
  }
  const home = read('src/pages/Home.jsx');
  assert.match(home, /import FAQSection, \{ HOMEPAGE_FAQS \} from ['"]\.\.\/components\/home-conversion\/FAQSection['"]/);
  assert.match(home, /<FAQSection\s*\/>/);
  assert.match(home, /<HeroSection\s*\/>/);
  assert.match(home, /Digital Growth Office/);
  assert.match(read('src/components/home-conversion/FAQSection.jsx'), /practical AI education and Digital Growth Office partner/);
  assert.match(read('src/components/home-conversion/HeroSection.jsx'), /Understand practical AI and business growth/);
  const about = read('src/pages/About.jsx');
  assert.match(about, /Help small-business owners understand AI and use it wisely in the real world/);
  assert.match(about, /Owner in Authority/);
  assert.match(about, /people keep making the decisions/);
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

test('AI sitemap declares the approved education and digital-growth primary topic', () => {
  const sitemap = JSON.parse(read('public/ai-sitemap.json'));
  assert.equal(
    sitemap.organization.primaryTopic,
    'Practical AI education and digital growth systems for small-business owners',
  );
});
