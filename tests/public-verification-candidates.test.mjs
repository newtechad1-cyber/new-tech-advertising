import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

const root = path.resolve('docs/security/visitor-verification');
const settings = {
  NTA_TURNSTILE_SITE_KEY: '0x-stub-site-key-for-isolated-unit-tests',
  NTA_TURNSTILE_SECRET_KEY: 'stub-secret-for-isolated-unit-tests-only',
};
const actions = { growthGuideChat: 'growth_guide_chat', publicationSignup: 'publication_signup' };
const validPayloads = {
  growthGuideChat: { messages: [{ role: 'user', content: 'How can I grow my business?' }] },
  publicationSignup: {
    email: 'unit-test@example.invalid', publication_title: 'The NTA Journal',
    publication_tag: 'nta-journal', create_delivery_request: false, consent: true,
  },
};
function setup(name, { env = settings, user = null, result = {}, networkError = false } = {}) {
  const source = readFileSync(path.join(root, 'base44/functions', name, 'entry.ts'), 'utf8')
    .replace(/^import[^\n]*\n/gm, '');
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
  });
  assert.equal((output.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  let handler;
  const stats = { effects: 0, provider: 0 };
  const used = new Set();
  const counted = value => async () => { stats.effects++; return value; };
  const service = {
    integrations: { Core: { InvokeLLM: counted('Choose one useful task and review the result.') } },
    functions: { invoke: counted({ data: { status: 'synced' } }) },
    entities: {
      Subscriber: { filter: counted([]), create: counted({ id: 'test-subscriber' }) },
      PublicationDeliveryRequest: { create: counted({ id: 'test-delivery' }) },
    },
  };
  vm.runInNewContext(output.outputText, {
    exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder,
    console: { log() {}, warn() {}, error() {} },
    Deno: { serve(fn) { handler = fn; }, env: { get(key) { return env[key]; } } },
    createClientFromRequest() { return { auth: { async me() { return user; } }, asServiceRole: service }; },
    createClient() { return { functions: { invoke: counted({}) } }; },
    async fetch(url, options) {
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      assert.equal(options.method, 'POST');
      const body = JSON.parse(options.body);
      assert.equal(body.secret, env.NTA_TURNSTILE_SECRET_KEY);
      stats.provider++;
      if (networkError) throw new Error('provider offline');
      const repeated = used.has(body.response);
      used.add(body.response);
      return Response.json({
        success: !repeated,
        action: actions[name], hostname: 'newtechadvertising.com',
        challenge_ts: new Date().toISOString(),
        ...result,
      });
    },
  });
  function request(payload = validPayloads[name], headers = {}) {
    return handler(new Request('https://newtechadvertising.com/api/test', {
      method: 'POST',
      headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    }));
  }
  return { request, stats };
}

for (const name of Object.keys(actions)) {
  test(name + ': metadata reveals only the site key and action', async () => {
    const fixture = setup(name);
    const response = await fixture.request({ verification_config: true });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { site_key: settings.NTA_TURNSTILE_SITE_KEY, action: actions[name] });
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(fixture.stats.effects, 0);
    assert.equal(fixture.stats.provider, 0);
  });

  test(name + ': forged website/role claims without a verification token are rejected', async () => {
    const fixture = setup(name);
    const response = await fixture.request({ ...validPayloads[name], role: 'admin', is_service: true });
    assert.equal(response.status, 403);
    assert.equal(fixture.stats.effects, 0);
    assert.equal(fixture.stats.provider, 0);
  });

  for (const [label, options, status] of [
    ['invalid provider proof', { result: { success: false } }, 403],
    ['wrong hostname', { result: { hostname: 'attacker.example' } }, 403],
    ['wrong action', { result: { action: 'different_function' } }, 403],
    ['expired proof', { result: { challenge_ts: '2020-01-01T00:00:00Z' } }, 403],
    ['future proof', { result: { challenge_ts: '2099-01-01T00:00:00Z' } }, 403],
    ['missing configuration', { env: {} }, 503],
    ['public test keys', { env: { NTA_TURNSTILE_SITE_KEY: '1x00000000000000000000AA', NTA_TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA' } }, 503],
    ['provider outage', { networkError: true }, 503],
  ]) {
    test(name + ': ' + label + ' fails closed before privileged work', async () => {
      const fixture = setup(name, options);
      const response = await fixture.request({ ...validPayloads[name], verification_token: 'one-time-proof' });
      assert.equal(response.status, status);
      assert.equal(fixture.stats.effects, 0);
    });
  }

  test(name + ': accepts verified visitor proof; replay never repeats side effects', async () => {
    const fixture = setup(name);
    const payload = { ...validPayloads[name], verification_token: 'single-use-proof' };
    const first = await fixture.request(payload);
    assert.equal(first.status, 200);
    const effects = fixture.stats.effects;
    assert.ok(effects > 0);
    const second = await fixture.request(payload);
    assert.equal(second.status, 403);
    assert.equal(fixture.stats.effects, effects);
  });

  test(name + ': privileged identity retains internal access without visitor proof', async () => {
    const fixture = setup(name, { env: {}, user: { role: 'admin', id: 'verified-admin' } });
    const response = await fixture.request();
    assert.equal(response.status, 200);
    assert.equal(fixture.stats.provider, 0);
  });

  test(name + ': oversized tokens never reach provider or privileged work', async () => {
    const fixture = setup(name);
    const response = await fixture.request({ ...validPayloads[name], verification_token: 'x'.repeat(2049) });
    assert.equal(response.status, 403);
    assert.equal(fixture.stats.effects, 0);
    assert.equal(fixture.stats.provider, 0);
  });
}

test('publicationSignup: server requires explicit publication consent', async () => {
  const fixture = setup('publicationSignup');
  const response = await fixture.request({ ...validPayloads.publicationSignup, consent: false, verification_token: 'valid-proof' });
  assert.equal(response.status, 400);
  assert.equal(fixture.stats.effects, 0);
});
