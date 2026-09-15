import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

const candidates = JSON.parse(readFileSync('docs/security/core-bridge/candidates.json', 'utf8'));
const CORE = '6a7215451eb90dc843a94546';
const PUBLIC = '691f41a18de4a7f498c8f884';
const KEY = 'unit-test-core-bridge-secret-not-for-production';
const HEADER = 'x-nta-core-bridge-secret';
function setup(file, { user = null, secret = KEY, authError = false } = {}) {
  let handler;
  const stats = { effects: 0, clients: [] };
  const context = { exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder, TextDecoder, crypto: webcrypto,
    console: { log() {}, warn() {}, error() {} },
    Deno: { serve(fn) { handler = fn; }, env: { get(name) { return name === 'NTA_CORE_BRIDGE_SECRET' ? secret : undefined; } } },
    createClient(options) { stats.clients.push(options); return {}; },
    createClientFromRequest() { return {
      auth: { async me() { if (authError) throw new Error('invalid session'); return user; } },
      get asServiceRole() { stats.effects++; throw new Error('Isolated test reached privileged work'); },
    }; },
    fetch() { stats.effects++; throw new Error('No external request in an isolated test'); },
  };
  vm.runInNewContext(ts.transpileModule(file.content.replace(/^import[^\n]*\n/gm, ''), {
    fileName: file.path, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  const request = (payload = {}, headers = {}, method = 'POST') => handler(new Request('https://example.invalid/test', {
    method, headers: { 'Content-Type': 'application/json', Origin: 'https://newtechadvertising.com', ...headers },
    ...(method === 'GET' ? {} : { body: JSON.stringify(payload) }),
  }));
  return { request, stats, context };
}

for (const file of candidates.filter(f => f.appId === CORE && f.path.startsWith('base44/functions/'))) {
  const name = file.path.split('/')[2];
  for (const [label, options, headers] of [
    ['missing credentials', {}, {}],
    ['forged website and role', {}, { 'X-Is-Service': 'true', Authorization: 'Bearer forged' }],
    ['ordinary member', { user: { id: 'member', role: 'user' } }, {}],
    ['invalid account credentials', { authError: true }, {}],
    ['wrong server secret', {}, { [HEADER]: 'x'.repeat(KEY.length) }],
    ['missing server configuration', { secret: '' }, { [HEADER]: KEY }],
  ]) {
    test(name + ': ' + label + ' is rejected before any read/write/email/AI', async () => {
      const fixture = setup(file, options);
      const response = await fixture.request({ connection_check: true, role: 'admin', is_service: true, secret: KEY }, headers);
      assert.equal(response.status, 401);
      assert.equal(fixture.stats.effects, 0);
    });
  }
  for (const [label, options, headers] of [
    ['verified server', {}, { [HEADER]: KEY }],
    ['verified admin', { secret: '', user: { id: 'admin', role: 'admin' } }, {}],
    ['verified service', { secret: '', user: { is_service: true } }, {}],
  ]) {
    test(name + ': ' + label + ' can check connection without creating records', async () => {
      const fixture = setup(file, options);
      const response = await fixture.request({ connection_check: true }, headers);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { connection_ready: true, function: name });
      assert.equal(fixture.stats.effects, 0);
      assert.equal((await fixture.request({}, headers)).status, 400);
      assert.equal(fixture.stats.effects, 0);
    });
  }
  test(name + ': GET cannot trigger work', async () => {
    const fixture = setup(file);
    assert.equal((await fixture.request({}, {}, 'GET')).status, 405);
    assert.equal(fixture.stats.effects, 0);
  });
  test(name + ': authorized oversized input stops before privileged work', async () => {
    const fixture = setup(file);
    assert.equal((await fixture.request({ value: 'x'.repeat(48001) }, { [HEADER]: KEY })).status, 400);
    assert.equal(fixture.stats.effects, 0);
  });
}

for (const file of candidates.filter(f => f.appId === PUBLIC && f.path.startsWith('base44/functions/'))) {
  test(file.path + ': sender supplies the matching server credential only in headers', () => {
    const fixture = setup(file);
    fixture.context.createCoreClient();
    const client = fixture.stats.clients[0];
    assert.equal(client.appId, CORE);
    assert.equal(client.headers[HEADER], KEY);
    assert.equal(Object.keys(client.headers).length, 1);
    assert.throws(() => setup(file, { secret: '' }).context.createCoreClient(), /not configured/);
  });
}

test('staged Core forms use the verified public gateway and meet the recruiting contract', () => {
  const helper = candidates.find(f => f.appId === CORE && f.path === 'src/lib/publicVerification.js').content;
  assert.ok(helper.includes(PUBLIC));
  assert.doesNotMatch(helper, /NTA_CORE_BRIDGE_SECRET|x-nta-core-bridge-secret/);
  for (const file of candidates.filter(f => f.appId === CORE && f.path.startsWith('src/'))) {
    assert.doesNotMatch(file.content, /base44\.functions\.invoke\(['"](?:ntaUnifiedIntake|submitRecruitingApplication)['"]/);
    if (/OpportunityConversationForm|JoinNTA/.test(file.path)) {
      assert.match(file.content, /name="business_observation" required/);
      assert.match(file.content, /name="interest_reason" required/);
    }
  }
});

test('all staged files parse without changing active Core code', () => {
  for (const file of candidates) {
    const result = ts.transpileModule(file.content, { fileName: file.path,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
    const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
    assert.equal(errors.length, 0, file.path);
  }
});
