import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyAppRoute,
  classifyPageKey,
  classifyRoute,
  matchesRoutePattern,
  shouldNoIndex,
} from '../src/config/routeGovernance.js';
import {
  filterPagesForSurface,
  getSurfaceRedirectUrl,
  resolveAppSurface,
} from '../src/config/surfaceGovernance.js';

test('dynamic route overrides match real parameter values', () => {
  assert.equal(matchesRoutePattern('/approval/abc123', '/approval/:token'), true);
  assert.equal(classifyRoute('/approval/abc123'), 'noindex');
  assert.equal(classifyRoute('/c/client-42/agreement/agreement-9'), 'noindex');
});

test('static public routes remain public and case-insensitive', () => {
  assert.equal(classifyRoute('/books'), 'public');
  assert.equal(classifyRoute('/BOOKS/'), 'public');
  assert.equal(classifyRoute('/growth-guide?source=home'), 'public');
});

test('prefix rules use path boundaries', () => {
  assert.equal(classifyRoute('/admin/reports'), 'admin_only');
  assert.equal(classifyRoute('/administrator-guide'), 'admin_only');
  assert.equal(classifyRoute('/books'), 'public');
});

test('auto-generated page keys cannot bypass page access governance', () => {
  const pageKeys = ['Home', 'AdminOptimizer', 'LeadPipelineKanban'];

  assert.equal(classifyAppRoute('/Home', pageKeys), 'public');
  assert.equal(classifyAppRoute('/AdminOptimizer', pageKeys), 'admin_only');
  assert.equal(classifyAppRoute('/leadpipelinekanban', pageKeys), 'admin_only');
  assert.equal(shouldNoIndex(classifyAppRoute('/AdminOptimizer', pageKeys)), true);
});

test('unknown routes and page keys are private by default', () => {
  assert.equal(classifyRoute('/FutureInternalTool'), 'admin_only');
  assert.equal(classifyPageKey('FutureInternalTool'), 'admin_only');
  assert.equal(classifyPageKey('OurWork'), 'public');
  assert.equal(classifyPageKey('AuthorityDashboard'), 'admin_only');
});

test('the public Knowledge Library stays public while internal authoring tools stay private', () => {
  assert.equal(classifyRoute('/knowledge/business-foundations'), 'public');
  assert.equal(
    classifyRoute('/knowledge/business-foundations/how-businesses-really-grow'),
    'public'
  );
  assert.equal(classifyRoute('/knowledge/playbook'), 'admin_only');
  assert.equal(classifyRoute('/knowledge/prompts'), 'admin_only');
  assert.equal(classifyRoute('/knowledge/sales-conversations'), 'admin_only');
});

test('the public host sends protected routes to the private app host', () => {
  assert.equal(
    getSurfaceRedirectUrl({
      hostname: 'newtechadvertising.com',
      pathname: '/AdminOptimizer',
      search: '?tab=queue',
      hash: '#open',
      access: 'admin_only',
    }),
    'https://app.newtechadvertising.com/AdminOptimizer?tab=queue#open'
  );
  assert.equal(
    getSurfaceRedirectUrl({
      hostname: 'newtechadvertising.com',
      pathname: '/books',
      access: 'public',
    }),
    null
  );
  assert.equal(
    getSurfaceRedirectUrl({
      hostname: 'app.newtechadvertising.com',
      pathname: '/AdminOptimizer',
      access: 'admin_only',
    }),
    null
  );
});

test('surface resolution is host-aware and preserves previews', () => {
  assert.equal(resolveAppSurface('newtechadvertising.com'), 'public');
  assert.equal(resolveAppSurface('app.newtechadvertising.com'), 'private');
  assert.equal(resolveAppSurface('preview.base44.app'), 'combined');
  assert.equal(resolveAppSurface('preview.base44.app', 'public'), 'public');
});

test('surface registries separate public and protected pages', () => {
  const registry = {
    Home: {},
    OurWork: {},
    AdminOptimizer: {},
    AuthorityDashboard: {},
    ClientDashboard: {},
  };

  assert.deepEqual(
    Object.keys(filterPagesForSurface(registry, 'public')),
    ['Home', 'OurWork']
  );
  assert.deepEqual(
    Object.keys(filterPagesForSurface(registry, 'private')),
    ['AdminOptimizer', 'AuthorityDashboard', 'ClientDashboard']
  );
  assert.equal(filterPagesForSurface(registry, 'combined'), registry);
});
