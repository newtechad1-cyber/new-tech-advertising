import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

// Protect the approved wording without turning the homepage into a new design.
test('homepage preserves its existing section order and advertising identity', async () => {
  const home = await read('src/pages/Home.jsx');
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const sections = ['HeroSection', 'BuildTeamSection', 'ConnectBusinessSection', 'CustomerExperienceSection', 'SeeWhatToWorkOnSection', 'PublicationsSection', 'CombinedReviewsSection', 'FAQSection'];
  let previous = -1;
  for (const section of sections) {
    const position = home.indexOf(`<${section} />`);
    assert.ok(position > previous, `${section} should keep its existing position`);
    previous = position;
  }
  assert.match(hero, /<h1[^>]*>\s*Advertise Better\./);
  assert.match(hero, /advertising, customer experience, and everyday operations/);
  assert.match(hero, /You do not need to know the right question yet/);
});

test('retail and restaurant paths use existing destinations', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const websites = await read('src/pages/AiWebsites.jsx');
  const routes = await read('src/pages.config.js');
  assert.match(hero, /to="\/restaurants"/);
  assert.match(hero, /to="\/ai-websites#retail-and-online-stores"/);
  assert.match(websites, /id="retail-and-online-stores"/);
  assert.match(routes, /restaurants:\s*RestaurantSolutions/);
  assert.match(hero, /shop, dine, order/);
});

test('Pete and Janine remain an in-progress example with a working section target', async () => {
  const home = await read('src/components/home-v3/SeeWhatToWorkOnSection.jsx');
  const restaurants = await read('src/pages/RestaurantSolutions.jsx');
  const caseStudy = await read('src/components/restaurants/case-study/CaseStudyInProgress.jsx');
  assert.match(home, /Pete and Janine/);
  assert.match(home, /to="\/restaurants\?section=cattlemans-case-study"/);
  assert.match(home, /in progress, not a finished success story/);
  assert.match(restaurants, /params\.get\('section'\) !== 'cattlemans-case-study'/);
  assert.match(restaurants, /id="cattlemans-case-study"/);
  assert.match(caseStudy, /not presented as a finished success story/);
});

test('changed visible FAQ answers match the corresponding structured answers', async () => {
  const home = await read('src/pages/Home.jsx');
  const visible = await read('src/components/home-conversion/FAQSection.jsx');
  for (const prefix of ['NTA starts with how your business works', 'NTA works with small retailers']) {
    const structuredAnswer = home.match(new RegExp(`answer: '(${prefix}[^']*)'`))?.[1];
    assert.ok(structuredAnswer, `Missing structured FAQ: ${prefix}`);
    assert.ok(visible.includes(`answer: "${structuredAnswer}"`), `Visible FAQ differs: ${prefix}`);
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

test('built homepage carries the same business message and audience links', async () => {
  const html = await read('dist/index.html');
  for (const phrase of ['Advertise Better.', 'advertising, customer experience, and everyday operations', 'You do not need to know the right question yet', 'href="/restaurants"', 'href="/ai-websites#retail-and-online-stores"', 'section=cattlemans-case-study', 'not a finished success story']) {
    assert.ok(html.includes(phrase), `Built homepage missing: ${phrase}`);
  }
});
