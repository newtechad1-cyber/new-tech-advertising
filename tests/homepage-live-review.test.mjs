import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('books, Journal, and Growth Show appear before testimonials without the founder block', async () => {
  const home = await read('src/pages/Home.jsx');

  assert.ok(home.indexOf('<PublicationsSection />') < home.indexOf('<CombinedReviewsSection />'));
  assert.doesNotMatch(home, /FounderSection/);
  assert.doesNotMatch(home, /point_of_view_secondary/);
});

test('Growth Show card uses permanent branded show artwork and one correct destination', async () => {
  const publications = await read('src/components/home-v3/PublicationsSection.jsx');

  assert.match(publications, /nta-growth-show-cover\.webp/);
  assert.match(publications, /to="\/growth-show"/);
  assert.doesNotMatch(publications, /featuredShow/);
  assert.match(publications, /New Tech Advertising/);
  assert.match(publications, /Watch · Learn · Continue/);
});

test('public guide keeps its branded identity while the hero uses the current Free AI Guy experience', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(hero, /free-ai-guy-video/);
  assert.match(hero, /youtube-nocookie\.com\/embed/);
  assert.match(guide, /nta-growth-guide-surfer\.webp/);
  assert.match(guide, /Open the Digital Growth Guide/);
  assert.match(hero, /Talk to My Office™/);
  assert.match(guide, /Talk to My Office™/);
  assert.doesNotMatch(hero, /src="\/brand\//);
  assert.doesNotMatch(guide, /src="\/brand\//);
});

test('public Digital Growth Guide uses the resilient public chat function', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const chatFunction = await read('base44/functions/growthGuideChat/entry.ts');
  const publicKnowledge = await read('src/lib/growth-guide/publicKnowledge.js');

  assert.match(guide, /functions\.invoke\('growthGuideChat'/);
  assert.match(guide, /buildPublicKnowledgeFallback/);
  assert.match(guide, /knowledge_context: buildPublicKnowledgeContext/);
  assert.doesNotMatch(guide, /agents\.createConversation/);
  assert.match(guide, /The Guide is thinking/);
  assert.match(chatFunction, /asServiceRole\.integrations\.Core\.InvokeLLM/);
  assert.match(chatFunction, /Relevant published NTA lessons/);
  assert.match(chatFunction, /Work with AI without changing how you work/);
  assert.match(chatFunction, /sanitizeGuideReply/);
  assert.match(chatFunction, /const GUIDE_PUBLIC_ORIGIN = 'https:\/\/www\.newtechadvertising\.com'/);
  assert.match(chatFunction, /'\/free-audit'/);
  assert.match(guide, /getApprovedGuideHref/);
  assert.match(guide, /const GUIDE_PUBLIC_ORIGIN = 'https:\/\/www\.newtechadvertising\.com'/);
  assert.match(guide, /'\/free-audit'/);
  assert.match(publicKnowledge, /collectionsOrder/);
  assert.match(publicKnowledge, /relevantExcerpt/);
  assert.match(publicKnowledge, /buildPublicKnowledgeFallback/);
});

test('public Guide allows only verified NTA links in model replies', async () => {
  const chatFunction = await read('base44/functions/growthGuideChat/entry.ts');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const linkSafety = chatFunction.slice(
    chatFunction.indexOf('const GUIDE_PUBLIC_ORIGIN'),
    chatFunction.indexOf('const SYSTEM_PROMPT'),
  );
  const sanitizeGuideReply = new Function(linkSafety + '\nreturn sanitizeGuideReply;')();
  const origin = 'https://www.newtechadvertising.com';

  assert.equal(
    sanitizeGuideReply('[Free Gap Audit](https://www.n-t-a.com/free-audit)'),
    '[Free Gap Audit](' + origin + '/free-audit)',
  );
  assert.equal(
    sanitizeGuideReply('<https://www.n-t-a.com/free-audit>'),
    '<' + origin + '/free-audit>',
  );
  assert.equal(
    sanitizeGuideReply('[Outside](https://example.com/not-approved)'),
    'Outside',
  );
  assert.match(guide, /getApprovedGuideHref/);
  assert.match(guide, /img: \(\{ alt \}\)/);
});
