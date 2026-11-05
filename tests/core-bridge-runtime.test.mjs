import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const KEY = 'isolated-test-credential-never-used-in-production';
const CORE = '6a7215451eb90dc843a94546';
const RECEIVERS = ['ntaUnifiedIntake', 'submitRecruitingApplication', 'trackBookEvent'];
function setup({ secret = KEY, rejectReceiver = '', wrongResponse = false, hangReceiver = '', user = null } = {}) {
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
      return { auth: { async me() { return user; } },
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
  const request = (body = { connection_check: true }, { method = 'POST', origin = 'https://newtechadvertising.com', ip = '203.0.113.4' } = {}) =>
    handler(new Request('https://example.invalid/ntaUnifiedIntake', {
      method, headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip },
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


test('public connection readiness has a separate quota before Core calls', async () => {
  const fixture = setup();
  for (let i = 0; i < 60; i++) {
    const response = await fixture.request();
    assert.equal(response.status, 200, 'readiness request ' + (i + 1));
  }
  assert.equal(fixture.calls.length, 3, 'cached readiness should not probe Core repeatedly');

  const blocked = await fixture.request();
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).code, 'NTA_STATUS_RATE_LIMITED');
  assert.ok(Number(blocked.headers.get('Retry-After')) >= 1);
  assert.equal(blocked.headers.get('Cache-Control'), 'no-store');
  assert.equal(fixture.calls.length, 3, 'rate-limited request must never reach Core');

  // Health checks must not exhaust the 12 genuine public form attempts.
  const regularRequest = await fixture.request({ name: 'Test Visitor', email: 'visitor@example.invalid' });
  assert.equal(regularRequest.status, 403);
  assert.equal(fixture.calls.length, 3);
});

test('connection readiness quota is per client and protects only status metadata', async () => {
  const fixture = setup();
  for (let i = 0; i < 60; i++) {
    assert.equal((await fixture.request()).status, 200);
  }
  assert.equal((await fixture.request()).status, 429);

  const anotherClient = await fixture.request(undefined, { ip: '203.0.113.5' });
  assert.equal(anotherClient.status, 200);
  assert.equal(fixture.calls.length, 3);
});

test('trusted admins can read no-data connection readiness without public quota', async () => {
  const fixture = setup({ user: { role: 'admin', id: 'verified-admin' } });
  for (let i = 0; i < 62; i++) assert.equal((await fixture.request()).status, 200);
  assert.equal(fixture.calls.length, 3);
});
