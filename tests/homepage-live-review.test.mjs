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

test('Growth Guide uses the surfing robot as its visual identity', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');

  assert.match(hero, /nta-growth-guide-surfer\.webp/);
  assert.match(guide, /nta-growth-guide-surfer\.webp/);
  assert.match(guide, /Open the Digital Growth Guide/);
});

test('public Digital Growth Guide uses the resilient public chat function', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const chatFunction = await read('base44/functions/growthGuideChat/entry.ts');

  assert.match(guide, /functions\.invoke\('growthGuideChat'/);
  assert.doesNotMatch(guide, /agents\.createConversation/);
  assert.match(guide, /The Guide is thinking/);
  assert.match(chatFunction, /asServiceRole\.integrations\.Core\.InvokeLLM/);
  assert.match(chatFunction, /Work with AI without changing how you work/);
});
