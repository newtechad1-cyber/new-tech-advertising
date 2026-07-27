import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyAppRoute,
  classifyRoute,
  matchesRoutePattern,
  shouldNoIndex,
} from '../src/config/routeGovernance.js';

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
  assert.equal(classifyRoute('/administrator-guide'), 'public');
});

test('auto-generated page keys cannot bypass page access governance', () => {
  const pageKeys = ['Home', 'AdminOptimizer', 'LeadPipelineKanban'];

  assert.equal(classifyAppRoute('/Home', pageKeys), 'public');
  assert.equal(classifyAppRoute('/AdminOptimizer', pageKeys), 'admin_only');
  assert.equal(classifyAppRoute('/leadpipelinekanban', pageKeys), 'admin_only');
  assert.equal(shouldNoIndex(classifyAppRoute('/AdminOptimizer', pageKeys)), true);
});
