import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const KEY = 'isolated-test-credential-never-used-in-production';
const CORE = '6a7215451eb90dc843a94546';
const RECEIVERS = ['ntaUnifiedIntake', 'submitRecruitingApplication', 'trackBookEvent'];
function setup({ secret = KEY, rejectReceiver = '', wrongResponse = false, hangReceiver = '' } = {}) {
  let handler;
  const calls = [];
  const source = readFileSync('base44/functions/ntaUnifiedIntake/entry.ts', 'utf8');
  const compiled = ts.transpileModule(source.replace(/^import[^\n]*\n/gm, ''), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
  });
  assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  vm.runInNewContext(compiled.outputText, {
    exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder,
    setTimeout: (fn) => setTimeout(fn, 10), clearTimeout,
    console: { log() {}, error() {}, warn() {} },
    Deno: { serve(fn) { handler = fn; }, env: { get(name) { return name === 'NTA_CORE_BRIDGE_SECRET' ? secret : undefined; } } },
    createClientFromRequest() {
      return { auth: { async me() { return null; } },
        get asServiceRole() { assert.fail('Readiness must not use local service-role data'); } };
    },
    createClient(options) {
      assert.equal(options.appId, CORE);
      assert.equal(options.headers['x-nta-core-bridge-secret'], KEY);
      return { functions: { async invoke(name, payload) {
        calls.push({ name, payload: JSON.parse(JSON.stringify(payload)) });
        assert.ok(RECEIVERS.includes(name));
        assert.deepEqual(JSON.parse(JSON.stringify(payload)), { connection_check: true });
        if (name === rejectReceiver) {
          throw Object.assign(new Error('Unauthorized ' + KEY), { response: { status: 401, data: { error: KEY } } });
        }
        if (name === hangReceiver) return new Promise(() => {});
        return { data: wrongResponse ? { success: true } : { connection_ready: true, function: name } };
      } } };
    },
    fetch() { assert.fail('Readiness must not call Turnstile, email or LLM providers'); },
  });
  const request = (body = { connection_check: true }, { method = 'POST', origin = 'https://newtechadvertising.com' } = {}) =>
    handler(new Request('https://example.invalid/ntaUnifiedIntake', {
      method, headers: { 'Content-Type': 'application/json', Origin: origin },
      ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
    }));
  return { request, calls };
}

test('readiness verifies all three Core receivers using only authenticated no-data requests', async () => {
  const fixture = setup();
  const response = await fixture.request();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    connection_ready: true, connections: Object.fromEntries(RECEIVERS.map(name => [name, true])),
  });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(fixture.calls.map(call => call.name).sort(), [...RECEIVERS].sort());
});

test('readiness caches and coalesces requests instead of repeating backend calls', async () => {
  const fixture = setup();
  const responses = await Promise.all(Array.from({ length: 8 }, () => fixture.request()));
  assert.ok(responses.every(response => response.status === 200));
  assert.equal((await fixture.request()).status, 200);
  assert.equal(fixture.calls.length, 3);
});

test('mismatched credentials fail readiness without exposing secrets or upstream messages', async () => {
  const fixture = setup({ rejectReceiver: 'ntaUnifiedIntake' });
  const response = await fixture.request();
  assert.equal(response.status, 503);
  const text = await response.text();
  assert.doesNotMatch(text, /Unauthorized|isolated-test-credential/);
  const result = JSON.parse(text);
  assert.equal(result.connection_ready, false);
  assert.equal(result.connections.ntaUnifiedIntake, false);
});

test('missing credentials fail readiness before an outbound call', async () => {
  const fixture = setup({ secret: '' });
  const response = await fixture.request();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { connection_ready: false });
  assert.equal(fixture.calls.length, 0);
});

test('a generic success response cannot impersonate the authenticated Core handshake', async () => {
  const fixture = setup({ wrongResponse: true });
  const response = await fixture.request();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).connection_ready, false);
});

test('an unresponsive receiver fails readiness within the configured deadline', async () => {
  const fixture = setup({ hangReceiver: 'trackBookEvent' });
  const response = await fixture.request();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).connections.trackBookEvent, false);
});

test('readiness flags cannot authorize or forward a visitor submission', async () => {
  for (const body of [
    { connection_check: true, email: 'never-forward@example.invalid' },
    { connection_check: true, function: 'sendEmail' },
    { connection_check: true, role: 'admin' },
    { connection_check: true, payload: { connection_check: true } },
    { connection_check: 'true' },
  ]) {
    const fixture = setup();
    assert.equal((await fixture.request(body)).status, 403);
    assert.equal(fixture.calls.length, 0);
  }
});

test('readiness requires POST and a permitted origin', async () => {
  const fixture = setup();
  assert.equal((await fixture.request({}, { method: 'GET' })).status, 405);
  assert.equal((await fixture.request(undefined, { origin: 'https://example.invalid' })).status, 403);
  assert.equal(fixture.calls.length, 0);
});
