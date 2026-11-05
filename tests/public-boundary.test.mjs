import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runTvCommercialScriptRequest, tvScriptErrorMessage } from '../src/lib/tv-commercial-script-request.mjs';


const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('public router is fail-closed and does not import private page registries', async () => {
  const app = await read('src/App.jsx');
  const registry = await read('src/pages.config.js');
  const discovery = await read('base44/functions/listPages/entry.ts');
  const clientDeals = await read('base44/functions/getClientDeals/entry.ts');

  assert.match(app, /const PublicPages = Pages;/);
  assert.match(app, /LegacyPrivateRouteRedirect/);
  assert.ok(app.includes('path="*" element={<LegacyPrivateRouteRedirect />}'));
  assert.match(registry, /"Home": Home/);
  assert.doesNotMatch(registry, /AdminDashboard|ClientDashboard|OpsDashboard|PortalDashboard/);
  assert.doesNotMatch(registry, /SchoolStudentDashboard|SchoolStudentProfile|SchoolStudentUpload/);
  assert.match(discovery, /PUBLIC_PAGE_FILES/);
  assert.doesNotMatch(discovery, /Deno\.readDir/);
  assert.match(discovery, /createClientFromRequest\(req\)/);
  assert.match(discovery, /base44\.auth\.me\(\)/);
  assert.match(discovery, /status: 401/);
  assert.match(discovery, /status: 403/);

  assert.match(clientDeals, /base44\.auth\.me\(\)/);
  assert.match(clientDeals, /company_id: user\.client_id/);
  assert.doesNotMatch(clientDeals, /Admin access required/);
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
    '/tools',
    '/services',
    '/communitypartnerprogram',
    '/ourwork',
    '/marketing-plan-generator',
  ]) {
    assert.match(routes, new RegExp(`alias\\(['"]${route.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&')}`));
  }

  assert.ok(!routes.includes("alias('/admin/") && !routes.includes("alias('/agency/") && !routes.includes("alias('/client/") && !routes.includes("alias('/portal/") && !routes.includes("alias('/ops/") && !routes.includes("alias('/crm/") && !routes.includes("alias('/billing/"));

  for (const retiredRoute of ["'/insights'", "'/insights/:slug'", "'/blog'", "'/blogpost'"]) {
    assert.ok(!routes.includes(`alias(${retiredRoute}`), retiredRoute);
  }
});

test('canonical helpers and public demo/article links stay on public routes', async () => {
  const utils = await read('src/utils/index.ts');
  const registry = await read('src/pages.config.js');
  const demo = await read('src/pages/DemoOverview.jsx');

  for (const mapping of [
    "tools: '/free-audit'",
    "services: '/services'",
    "communityPartnerProgram: '/community-partner'",
    "ourWork: '/our-work'",
    "marketingPlanGenerator: '/marketing-plan-generator'",
  ]) {
    assert.ok(utils.includes(mapping), mapping);
  }

  assert.doesNotMatch(registry, /import Blog(?:Post)? from/);
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
  const seoHead = await read('src/components/shared/SEOHead.jsx');

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
  assert.match(generator, /data-seo-static-question-schema/);
  assert.match(seoHead, /data-seo-static-question-schema/);
  assert.match(generator, /\.\.\.getStaticPublicAliasPaths\(\)/);
  assert.match(await read('dist/knowledge.html'), /<meta name="robots" content="index, follow/);
  assert.match(await read('dist/knowledge/questions.html'), /Small Business Questions About AI/);
  assert.match(generator, /pathname\.slice\(1\) \+ ".html"/);
  assert.match(generator, /fs\.rmSync\(outputFile/);
  assert.match(generator, /function homeStaticBody\(pathname\)/);
  assert.match(generator, /function knowledgeQuestionHubStaticBody\(pathname\)/);
  assert.match(generator, /function knowledgeQuestionStaticBody\(pathname\)/);
  assert.match(generator, /function knowledgeQuestionSchemaMarkup\(pathname, metadata\)/);
  assert.match(generator, /pathname\.toLowerCase\(\)/);
  assert.match(seo, /getKnowledgeQuestionBySlug/);

  const vite = await read('vite.config.js');
  assert.match(vite, /appType: process\.env\.NODE_ENV === 'production' \? 'mpa' : 'spa'/);
});

test('question-first Knowledge Library routes are specific and fail closed', async () => {
  const { getSeoMetadata } = await import('../src/config/seoMetadata.js');

  const answer = getSeoMetadata('/knowledge/questions/how-can-a-small-business-use-ai');
  assert.equal(answer.title, 'How Can AI Help My Small Business? | NTA');
  assert.equal(answer.canonical, 'https://newtechadvertising.com/knowledge/questions/how-can-a-small-business-use-ai');
  assert.equal(answer.noIndex, false);

  const unknown = getSeoMetadata('/knowledge/questions/not-a-real-question');
  assert.equal(unknown.noIndex, true);
  assert.match(unknown.title, /Page Not Found/);

  const retiredBlogHub = getSeoMetadata('/insights');
  const retiredBlogArticle = getSeoMetadata('/insights/retired-article');
  assert.equal(retiredBlogHub.noIndex, true);
  assert.equal(retiredBlogArticle.noIndex, true);
});


test('public channel help does not fetch private channel credentials or invent status counts', async () => {
  const source = await read('src/pages/ChannelHelpCenter.jsx');
  assert.doesNotMatch(source, /base44\.entities\.ChannelConnection\.(list|filter|get)\s*\(/);
  assert.doesNotMatch(source, /useQuery|channel-connections-help|connectedCount|attentionCount|notConnectedCount|statusIcon/);
  assert.match(source, /Check your connection status/);
  assert.match(source, /Open Channel Hub/);
});

const validTvScriptForm = {
  businessName: 'Example Heating',
  industry: 'HVAC',
  serviceArea: 'Northern Iowa',
  offer: '',
  duration: '30 seconds',
  tone: 'Professional',
};

function scriptRequestProbe(invoke, form = validTvScriptForm) {
  const loading = [];
  const scripts = [];
  const errors = [];
  return {
    loading,
    scripts,
    errors,
    run: () => runTvCommercialScriptRequest({
      form,
      invoke,
      onLoading: value => loading.push(value),
      onScript: value => scripts.push(value),
      onError: value => errors.push(value),
    }),
  };
}

test('public TV script generator succeeds and exits loading state', async () => {
  let called;
  const probe = scriptRequestProbe(async (name, payload) => {
    called = { name, payload };
    return { data: { script: 'A 30-second script' } };
  });
  assert.equal(await probe.run(), true);
  assert.deepEqual(probe.loading, [true, false]);
  assert.deepEqual(probe.scripts, ['', 'A 30-second script']);
  assert.deepEqual(probe.errors, ['']);
  assert.equal(called.name, 'generateTvCommercialScript');
  assert.equal(called.payload.businessName, 'Example Heating');
});

test('public TV script generator handles authentication rejection without spinning forever', async () => {
  const probe = scriptRequestProbe(async () => {
    const error = new Error('Backend details should not be shown');
    error.response = { status: 401 };
    throw error;
  });
  assert.equal(await probe.run(), false);
  assert.deepEqual(probe.loading, [true, false]);
  assert.match(probe.errors.at(-1), /Please sign in/);
  assert.doesNotMatch(probe.errors.at(-1), /Backend details/);
  assert.equal(tvScriptErrorMessage({ status: 429 }).includes('try again later'), true);
});

test('public TV script generator recovers from empty responses and allows retry', async () => {
  let requests = 0;
  const probe = scriptRequestProbe(async () => {
    requests += 1;
    return requests === 1 ? { data: {} } : { data: { script: 'Recovered script' } };
  });
  assert.equal(await probe.run(), false);
  assert.deepEqual(probe.loading, [true, false]);
  assert.match(probe.errors.at(-1), /could not generate/);
  assert.equal(await probe.run(), true);
  assert.deepEqual(probe.loading, [true, false, true, false]);
  assert.deepEqual(probe.scripts.slice(-2), ['', 'Recovered script']);
  assert.equal(requests, 2);
});

test('public TV script generator skips incomplete input without an API request', async () => {
  const probe = scriptRequestProbe(async () => { throw new Error('Unexpected call'); }, { ...validTvScriptForm, businessName: '  ' });
  assert.equal(await probe.run(), false);
  assert.deepEqual(probe.loading, []);
});

test('public TV script form displays a user-facing error message', async () => {
  const source = await read('src/pages/TvCommercialScriptGenerator.jsx');
  assert.match(source, /runTvCommercialScriptRequest/);
  assert.match(source, /role="alert"/);
  assert.match(source, /generationError/);
});
