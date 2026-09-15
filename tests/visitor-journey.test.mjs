import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const read = name => readFileSync(name, 'utf8');
const endpoints = ['growthGuideChat', 'publicationSignup', 'ntaUnifiedIntake', 'startDiscoverySession', 'submitPublicTrialSignup', 'submitRecruitingApplication'];

test('every public write entry uses the same reviewed visitor verification implementation', () => {
  function implementation(name) {
    const file = ts.createSourceFile('entry.ts', read(`base44/functions/${name}/entry.ts`), ts.ScriptTarget.Latest, true);
    return file.statements.filter(node => ts.isFunctionDeclaration(node) && ['verificationSettings', 'publicVerificationConfig', 'verifyPublicRequest'].includes(node.name?.text)).map(node => node.getText(file).replace(/\s+/g, ' ').trim());
  }
  const expected = implementation(endpoints[0]);
  assert.equal(expected.length, 3);
  for (const name of endpoints) assert.deepEqual(implementation(name), expected, name);
});

test('important visitor links resolve to an explicit public route', () => {
  const routeSources = read('src/config/publicRoutes.js') + read('src/App.jsx');
  const aliases = new Set([...routeSources.matchAll(/(?:alias\(|path=)["'](\/[^"']*)/g)].map(m => m[1]));
  aliases.add('/');
  for (const file of ['src/pages/Free-Audit.jsx', 'src/pages/NTAGrowthConversation.jsx', 'src/pages/Contact.jsx', 'src/components/start/StartSuccess.jsx', 'src/components/book-call/BCBookingSection.jsx']) {
    for (const match of read(file).matchAll(/(?:to|href)=["'](\/[^"']*)["']/g)) {
      const target = match[1].split(/[?#]/)[0];
      assert.ok(aliases.has(target), `${file}: ${target} must have a public route`);
    }
  }
});

test('visitor measurement cannot reach a privileged function or interrupt a journey', () => {
  const source = read('src/lib/journeyAnalytics.js').replace(/^import[^\n]*\n/gm, '');
  for (const throws of [false, true]) {
    const events = [];
    const context = { exports: {}, console: { warn() {} }, sessionStorage: { getItem() { return 'test-session'; } }, location: { pathname: '/free-audit' },
      base44: { analytics: { track(event) { if (throws) throw new Error('unavailable'); events.push(event); } }, functions: { invoke() { assert.fail('No custom backend write for page measurement'); } } },
      gtag(...args) { events.push(args); },
    };
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
    assert.doesNotThrow(() => context.exports.trackJourneyEvent('page_view'));
    assert.ok(events.length > 0);
  }
});

test('guided setup is one verified submission with visible failure and accurate pending confirmation', () => {
  const form = read('src/components/start/StartForm.jsx');
  assert.equal([...form.matchAll(/invokeVerifiedPublicFunction\(/g)].length, 1);
  assert.match(form, /invokeVerifiedPublicFunction\('submitPublicTrialSignup'/);
  assert.match(form, /role="alert"/);
  const success = read('src/components/start/StartSuccess.jsx');
  assert.match(success, /Setup Request Is Saved/);
  assert.doesNotMatch(success, /to="\/Login"|tools, and campaign builder are ready|email your login details shortly/);
});

test('all main visitor destinations have a production page', () => {
  for (const route of ['free-audit', 'growth-guide', 'growth-conversation', 'book-call', 'contact', 'better-business-book', 'practical-ai', 'journal', 'work-with-nta', 'start']) {
    assert.ok([`dist/${route}`, `dist/${route}.html`, `dist/${route}/index.html`].some(existsSync), route);
  }
});

test('the public opportunity entrance cannot lead to the Core sign-in page', () => {
  assert.match(read('src/components/nav/MarketingNav.jsx'), /const OPPORTUNITY_HREF = '\/account-manager'/);
});
