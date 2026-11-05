import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

// Historical filename only: these are source checks and an extracted sanitizer
// test, NOT a request to the published website or a browser review.
test('the concise homepage retains learning and publication entrances in active navigation', async () => {
  const home = await read('src/pages/Home.jsx');
  const nav = await read('src/components/nav/MarketingNav.jsx');
  assert.match(home, /<MarketingNav\s*\/>/);
  for (const path of ['/books', '/journal', '/growth-show', '/knowledge', '/learning-center/videos', '/podcasts']) {
    assert.ok(nav.includes(`href: '${path}'`), `Missing learning entrance: ${path}`);
  }
  assert.doesNotMatch(home, /FounderSection/);
  assert.doesNotMatch(home, /point_of_view_secondary/);
});

test('retained Growth Show card artwork and active navigation keep the correct destination', async () => {
  const publications = await read('src/components/home-v3/PublicationsSection.jsx');
  const nav = await read('src/components/nav/MarketingNav.jsx');
  // This component still has its own invariant; it is not currently on Home.
  assert.match(publications, /nta-growth-show-cover\.webp/);
  assert.match(publications, /to="\/growth-show"/);
  assert.doesNotMatch(publications, /featuredShow/);
  assert.match(publications, /New Tech Advertising/);
  assert.match(publications, /Watch · Learn · Continue/);
  assert.match(nav, /href: '\/growth-show'/);
});

test('public Guide retains its current identity and assets with both approved navigation labels', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const nav = await read('src/components/nav/MarketingNav.jsx');
  assert.match(hero, /What would you like to talk through\?/);
  assert.match(hero, /Your Digital Growth Guide™/);
  assert.match(guide, /const RICK_WELCOME_VIDEO_URL = '\/brand\/rick-digital-growth-guide-welcome\.webm'/);
  assert.match(guide, /src=\{RICK_WELCOME_VIDEO_URL\}/);
  assert.match(guide, /<RickGrowthGuideAvatar\b/);
  assert.match(guide, /<h3[^>]*>Your Digital Growth Guide™<\/h3>/);
  assert.match(guide, /Open Your Digital Growth Guide/);
  assert.equal((nav.match(/>\s*Ask the Guide\s*<\/button>/g) || []).length, 2);
  assert.equal((nav.match(/aria-label="Ask the Guide: open Your Digital Growth Guide"/g) || []).length, 2);
  // Check each actual Guide-opening button, not two unrelated string counts.
  // This is a source contract, not a browser accessible-name computation.
  const buttonBlocks = nav.match(/<button\b[\s\S]*?<\/button>/g) || [];
  for (const source of ['main_navigation', 'mobile_navigation']) {
    const buttons = buttonBlocks.filter(button => button.includes(`openGrowthGuide('${source}')`));
    assert.equal(buttons.length, 1, `${source} must have exactly one Guide button`);
    const button = buttons[0];
    const visibleLabel = button.match(/>\s*([^<>]+?)\s*<\/button>$/)?.[1]?.trim();
    const accessibleLabel = button.match(/\baria-label="([^"]+)"/)?.[1];
    assert.equal(visibleLabel, 'Ask the Guide', `${source} visible label`);
    assert.equal(accessibleLabel, 'Ask the Guide: open Your Digital Growth Guide', `${source} accessible label`);
    assert.ok(accessibleLabel.startsWith(visibleLabel), `${source} accessible name must start with its visible label`);
    assert.doesNotMatch(button, /\baria-labelledby\s*=/, `${source} must not override the approved accessible name`);
  }
  assert.doesNotMatch(nav, /Talk to My Office/);
});

test('public Guide source uses the verified chat wrapper and retains published-knowledge and safe-link paths', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const chatFunction = await read('base44/functions/growthGuideChat/entry.ts');
  const publicKnowledge = await read('src/lib/growth-guide/publicKnowledge.js');

  assert.match(guide, /import \{ invokeVerifiedPublicFunction, getVisitorVerificationToken \} from '@\/lib\/publicVerification'/);
  assert.match(guide, /await invokeVerifiedPublicFunction\('growthGuideChat',/);
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

test('extracted public Guide sanitizer allows only approved NTA links in model replies', async () => {
  const chatFunction = await read('base44/functions/growthGuideChat/entry.ts');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const start = chatFunction.indexOf('const GUIDE_PUBLIC_ORIGIN');
  const end = chatFunction.indexOf('const SYSTEM_PROMPT');
  assert.ok(start >= 0 && end > start, 'Sanitizer source boundaries must exist');
  const linkSafety = chatFunction.slice(start, end);
  const sanitizeGuideReply = vm.runInNewContext(linkSafety + '\nsanitizeGuideReply;', { URL }, { timeout: 1000 });
  const origin = 'https://www.newtechadvertising.com';

  assert.equal(sanitizeGuideReply('[Free Gap Audit](https://www.n-t-a.com/free-audit)'), '[Free Gap Audit](' + origin + '/free-audit)');
  assert.equal(sanitizeGuideReply('<https://www.n-t-a.com/free-audit>'), '<' + origin + '/free-audit>');
  assert.equal(sanitizeGuideReply('[Outside](https://example.com/not-approved)'), 'Outside');
  assert.match(guide, /getApprovedGuideHref/);
  assert.match(guide, /img: \(\{ alt \}\)/);
});
