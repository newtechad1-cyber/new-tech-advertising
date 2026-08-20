import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('public router is fail-closed and does not import private page registries', async () => {
  const app = await read('src/App.jsx');
  const registry = await read('src/pages.config.js');
  const discovery = await read('base44/functions/listPages/entry.ts');

  assert.match(app, /const PublicPages = Pages;/);
  assert.match(app, /LegacyPrivateRouteRedirect/);
  assert.ok(app.includes('path="*" element={<LegacyPrivateRouteRedirect />}'));
  assert.match(registry, /"Home": Home/);
  assert.doesNotMatch(registry, /AdminDashboard|ClientDashboard|OpsDashboard|PortalDashboard/);
  assert.doesNotMatch(registry, /SchoolStudentDashboard|SchoolStudentProfile|SchoolStudentUpload/);
  assert.match(discovery, /PUBLIC_PAGE_FILES/);
  assert.doesNotMatch(discovery, /Deno\.readDir/);
});

test('public compatibility aliases cover legacy links without exposing private prefixes', async () => {
  const routes = await read('src/config/publicRoutes.js');

  for (const route of [
    '/book-a-call',
    '/canon',
    '/canon/collection/:slug',
    '/digital-growth-office-preview',
    '/demo-school-channel',
    '/schooltv-deal-room',
    '/schooltv-demo',
    '/local-visibility',
    '/onboard/thank-you',
    '/home',
    '/insights',
    '/insights/:slug',
    '/tools',
    '/services',
    '/communitypartnerprogram',
    '/ourwork',
    '/marketing-plan-generator',
    '/blogpost',
  ]) {
    assert.match(routes, new RegExp(`alias\\(['"]${route.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&')}`));
  }

  assert.ok(!routes.includes("alias('/admin/") && !routes.includes("alias('/agency/") && !routes.includes("alias('/client/") && !routes.includes("alias('/portal/") && !routes.includes("alias('/ops/") && !routes.includes("alias('/crm/") && !routes.includes("alias('/billing/"));
});

test('canonical helpers and public demo/article links stay on public routes', async () => {
  const utils = await read('src/utils/index.ts');
  const blogPost = await read('src/pages/BlogPost.jsx');
  const demo = await read('src/pages/DemoOverview.jsx');

  for (const mapping of [
    "tools: '/free-audit'",
    "services: '/services'",
    "blogPost: '/blogpost'",
    "communityPartnerProgram: '/community-partner'",
    "ourWork: '/our-work'",
    "marketingPlanGenerator: '/marketing-plan-generator'",
  ]) {
    assert.ok(utils.includes(mapping), mapping);
  }

  assert.match(blogPost, /pathSlug/);
  assert.doesNotMatch(demo, /createPageUrl\('SalesRoom'\)/);
  assert.match(demo, /<Link to="\/">/);
});

test('the public Journal page does not advertise an unimplemented RSS endpoint', async () => {
  const journal = await read('src/pages/JournalLanding.jsx');
  assert.ok(!journal.includes('href="/rss"') && !journal.includes("href='/rss'"));
  assert.ok(journal.includes('to="/journal"') || journal.includes("to='/journal'"));
});

test('SEO cleanup prerendering covers private SPA fallbacks and public legacy equity', async () => {
  const generator = await read('scripts/generate-seo-pages.mjs');
  const seo = await read('src/config/seoMetadata.js');

  for (const route of ['/portal', '/workspace', '/agency', '/admin', '/content-command']) {
    assert.match(generator, new RegExp(`"${route}"`));
  }

  for (const mapping of [
    '"/contractormarketingnorthiowa": "/contractor-marketing-north-iowa"',
    '"/growthshowepisode": "/growth-show"',
    '"/aifoundationscollection": "/knowledge/ai-foundations"',
  ]) {
    assert.ok(seo.includes(mapping), mapping);
  }

  assert.match(generator, /function getStaticPublicAliasPaths\(\)/);
  assert.match(generator, /\.\.\.getStaticPublicAliasPaths\(\)/);
  assert.match(generator, /pathsWithDescendants/);
});
