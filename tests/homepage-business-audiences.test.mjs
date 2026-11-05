import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

// Protect Rick's approved simpler homepage, not retired component placement.
// Source checks do not establish browser accessibility or live behavior.
test('homepage preserves the question-first opening and the approved concise sequence', async () => {
  const home = await read('src/pages/Home.jsx');
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const sections = ['<HeroSection />', 'Why NTA works this way', 'See the work, not just the claims', '<RickMissionStatement />', 'A simple place to begin', '<FAQSection />'];
  let previous = -1;
  for (const section of sections) {
    const position = home.indexOf(section);
    assert.ok(position > previous, `${section} must exist in the approved order`);
    previous = position;
  }
  assert.match(hero, /<h1[^>]*>What are you trying to figure out in your business\?<\/h1>/);
  assert.match(hero, /You do not need to know which tool, service, or technology to ask for first/);
  for (const phrase of ["title: 'Learn'", "title: 'Get Found'", "title: 'Get Things Connected'", 'I don&apos;t know what to fix first']) {
    assert.ok(hero.includes(phrase), `Missing question-first choice: ${phrase}`);
  }
});

test('retail and restaurant paths remain in the active navigation with existing destinations', async () => {
  const nav = await read('src/components/nav/MarketingNav.jsx');
  const websites = await read('src/pages/AiWebsites.jsx');
  const routes = await read('src/pages.config.js');
  const faq = await read('src/components/home-conversion/FAQSection.jsx');
  assert.match(nav, /href: '\/restaurants'/);
  assert.match(nav, /href: '\/ai-websites#retail-and-online-stores'/);
  assert.match(websites, /id="retail-and-online-stores"/);
  assert.match(routes, /restaurants:\s*RestaurantSolutions/);
  assert.match(faq, /shop, dine, order/);
});

test('active case-study entrances preserve the restaurant in-progress qualification and section target', async () => {
  const home = await read('src/pages/Home.jsx');
  const nav = await read('src/components/nav/MarketingNav.jsx');
  const restaurants = await read('src/pages/RestaurantSolutions.jsx');
  const caseStudy = await read('src/components/restaurants/case-study/CaseStudyInProgress.jsx');
  assert.match(home, /to="\/case-studies"/);
  assert.match(home, /what is finished, what is still being built/);
  assert.match(nav, /href: '\/restaurants'/);
  assert.match(restaurants, /params\.get\('section'\) !== 'cattlemans-case-study'/);
  assert.match(restaurants, /id="cattlemans-case-study"/);
  assert.match(restaurants, /<CaseStudyInProgress\b/);
  assert.match(caseStudy, /not presented as a finished success story/);
});

test('visible and structured FAQ wiring uses the same nonempty approved answer data', async () => {
  const home = await read('src/pages/Home.jsx');
  const visible = await read('src/components/home-conversion/FAQSection.jsx');
  const seo = await read('src/components/shared/SEOHead.jsx');
  assert.match(home, /import FAQSection, \{ HOMEPAGE_FAQS \} from ['"]\.\.\/components\/home-conversion\/FAQSection['"]/);
  assert.match(home, /<SEOHead[\s\S]*?faqs=\{HOMEPAGE_FAQS\}/);
  assert.match(home, /<FAQSection\s*\/>/);
  assert.match(visible, /const faqs = HOMEPAGE_FAQS/);
  assert.match(visible, /faqs\.map\(\(faq, index\)/);
  assert.match(visible, /\{faq\.question\}/);
  assert.match(visible, /\{faq\.answer\}/);
  assert.match(seo, /const finalFaqs = Array\.isArray\(faqs\) \? faqs : \[\]/);
  assert.match(seo, /"mainEntity": finalFaqs\.map\(faq =>/);
  assert.match(seo, /"name": faq\.question/);
  assert.match(seo, /"text": faq\.answer/);
  const literal = visible.match(/export const HOMEPAGE_FAQS\s*=\s*(\[[\s\S]*?\n\s*\]);/)?.[1];
  assert.ok(literal, 'The shared FAQ array must be inspectable');
  // Evaluate only the data literal, without imports, process, fetch or document.
  const faqs = vm.runInNewContext('(' + literal + ')', {}, { timeout: 1000 });
  assert.ok(Array.isArray(faqs) && faqs.length > 0);
  assert.equal(new Set(faqs.map(faq => faq.question)).size, faqs.length);
  assert.ok(faqs.every(faq => typeof faq.question === 'string' && faq.question.trim() && typeof faq.answer === 'string' && faq.answer.trim()));
  for (const prefix of ['NTA starts with how your business works', 'NTA works with small retailers']) {
    assert.equal(faqs.filter(faq => faq.answer.startsWith(prefix)).length, 1, `Missing or duplicated approved answer: ${prefix}`);
  }
});

test('retail examples preserve distinct shopping models without requiring ecommerce', async () => {
  const websites = await read('src/pages/AiWebsites.jsx');
  for (const phrase of ['A sewing-machine or specialty shop', 'A variety or neighborhood store', 'An ecommerce business', 'A store that also sells online', 'does not have to be a full online store', 'when your shop offers them']) {
    assert.ok(websites.includes(phrase), `Missing retail distinction: ${phrase}`);
  }
});

test('restaurant copy includes guests and daily operations, not only advertising', async () => {
  const hero = await read('src/components/restaurants/RestaurantHero.jsx');
  assert.match(hero, /more diners, more repeat visits, clearer menu information, or smoother service/);
  assert.match(hero, /advertising, website, guest experience, team knowledge, and daily work/);
  assert.match(hero, /review what is helping/);
  const leadPage = await read('src/pages/LocalLeadSystems.jsx');
  assert.match(leadPage, /We need more leads/);
});

test('page descriptions agree with central route metadata', async () => {
  const metadata = await read('src/config/seoMetadata.js');
  for (const path of ['src/pages/Home.jsx', 'src/pages/Services.jsx', 'src/pages/AiWebsites.jsx']) {
    const content = await read(path);
    const description = content.match(/<SEOHead[\s\S]*?description="([^"]+)"/)?.[1];
    assert.ok(description, `Missing description in ${path}`);
    assert.ok(metadata.includes(`description: "${description}"`), `Route metadata differs for ${path}`);
  }
});

test('real built homepage retains the current question-first message and public next steps', async () => {
  const html = await read('dist/index.html');
  for (const phrase of ['What are you trying to figure out in your business?', 'You do not need to know which tool, service, or technology to ask for first', 'Teach before selling. Keep people in control.', 'href="/knowledge"', 'href="/ai-seo"', 'href="/operating-system"', 'href="/growth-guide"', 'href="/growth-conversation"', 'href="/case-studies"', 'what is finished, what is still being built']) {
    assert.ok(html.includes(phrase), `Built homepage missing: ${phrase}`);
  }
});
