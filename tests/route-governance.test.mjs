import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyAppRoute,
  classifyRoute,
  matchesRoutePattern,
  shouldNoIndex,
} from '../src/config/routeGovernance.js';
import { knowledgeQuestions, getKnowledgeQuestionPath } from '../src/data/knowledgeQuestions.js';

test('dynamic route overrides match real parameter values', () => {
  assert.equal(matchesRoutePattern('/approval/abc123', '/approval/:token'), true);
  assert.equal(classifyRoute('/approval/abc123'), 'noindex');
  assert.equal(classifyRoute('/c/client-42/agreement/agreement-9'), 'noindex');
});

test('static public routes remain public and case-insensitive', () => {
  assert.equal(classifyRoute('/books'), 'public');
  assert.equal(classifyRoute('/BOOKS/'), 'public');
  assert.equal(classifyRoute('/growth-guide?source=home'), 'public');
  assert.equal(classifyRoute('/nta-journal'), 'public');
});

test('approved knowledge questions are public while unknown question slugs fail closed', () => {
  assert.equal(classifyRoute('/knowledge/questions'), 'public');
  for (const question of knowledgeQuestions) {
    assert.equal(classifyRoute(getKnowledgeQuestionPath(question)), 'public', question.slug);
  }
  assert.equal(classifyRoute('/knowledge/questions/not-an-approved-question'), 'noindex');
});

test('prefix rules use path boundaries and unknown routes fail closed', () => {
  assert.equal(classifyRoute('/admin/reports'), 'admin_only');
  assert.equal(classifyRoute('/administrator-guide'), 'noindex');
  assert.equal(classifyRoute('/contentqueue'), 'noindex');
  assert.equal(classifyRoute('/SiteMap'), 'noindex');
});

test('auto-generated page keys cannot bypass page access governance', () => {
  const pageKeys = ['Home', 'NtaJournal', 'AdminOptimizer', 'LeadPipelineKanban'];

  assert.equal(classifyAppRoute('/Home', pageKeys), 'public');
  assert.equal(classifyAppRoute('/NtaJournal', pageKeys), 'public');
  assert.equal(classifyAppRoute('/AdminOptimizer', pageKeys), 'admin_only');
  assert.equal(classifyAppRoute('/leadpipelinekanban', pageKeys), 'admin_only');
  assert.equal(shouldNoIndex(classifyAppRoute('/AdminOptimizer', pageKeys)), true);
});

test('top-level client and workspace entry points remain outside the public search boundary', () => {
  for (const route of ['/portal', '/workspace', '/agency', '/admin', '/content-command']) {
    assert.equal(shouldNoIndex(classifyRoute(route)), true, route);
  }
});
