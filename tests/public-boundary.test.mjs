import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('public router is fail-closed and does not import private page registries', async () => {
  const app = await read('src/App.jsx');
  const registry = await read('src/pages.config.js');

  assert.match(app, /const PublicPages = Pages;/);
  assert.match(app, /LegacyPrivateRouteRedirect/);
  assert.match(app, /path="\\*" element={<LegacyPrivateRouteRedirect \/>}/);
  assert.doesNotMatch(registry, /AdminDashboard|ClientDashboard|OpsDashboard|PortalDashboard/);
  assert.doesNotMatch(registry, /SchoolStudentDashboard|SchoolStudentProfile|SchoolStudentUpload/);
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
  ]) {
    assert.match(routes, new RegExp(`alias\\(['"]${route.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&')}`));
  }

  assert.ok(!routes.includes("alias('/admin/") && !routes.includes("alias('/agency/") && !routes.includes("alias('/client/") && !routes.includes("alias('/portal/") && !routes.includes("alias('/ops/") && !routes.includes("alias('/crm/") && !routes.includes("alias('/billing/"));
});

test('the public Journal page does not advertise an unimplemented RSS endpoint', async () => {
  const journal = await read('src/pages/JournalLanding.jsx');
  assert.doesNotMatch(journal, /href=["']\\/rss["']/);
  assert.match(journal, /to=["']\\/journal["']/);
});
