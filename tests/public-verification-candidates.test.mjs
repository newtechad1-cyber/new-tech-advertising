import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

// Exercise the active handlers that will be published, not the old staged snapshots.
const root = path.resolve('.');
const bridgeSettings = { NTA_CORE_BRIDGE_SECRET: 'unit-test-core-bridge-secret-not-for-production' };
const settings = {
  ...bridgeSettings,
  NTA_TURNSTILE_SITE_KEY: '0x-stub-site-key-for-isolated-unit-tests',
  NTA_TURNSTILE_SECRET_KEY: 'stub-secret-for-isolated-unit-tests-only',
};
const actions = { growthGuideChat: 'growth_guide_chat', publicationSignup: 'publication_signup', ntaUnifiedIntake: 'nta_unified_intake', startDiscoverySession: 'start_discovery_session', submitPublicTrialSignup: 'trial_signup', submitRecruitingApplication: 'recruiting_application' };
const validPayloads = {
  submitRecruitingApplication: { full_name: 'Test Visitor', email: 'unit-test@example.invalid', interest_reason: 'Test interest', business_observation: 'Test observation' },
  startDiscoverySession: { mode: 'mixed' },
  submitPublicTrialSignup: { business_name: 'Test Business', full_name: 'Test Visitor', email: 'unit-test@example.invalid', industry: 'HVAC', city: 'Test', state: 'IA', primary_goal: 'leads' },
  growthGuideChat: { messages: [{ role: 'user', content: 'How can I grow my business?' }] },
  publicationSignup: {
    email: 'unit-test@example.invalid', publication_title: 'The NTA Journal',
    publication_tag: 'nta-journal', create_delivery_request: false, consent: true,
  },
  ntaUnifiedIntake: { email: 'unit-test@example.invalid', name: 'Test Visitor', submission_type: 'contact' },
};
function setup(name, { env = settings, user = null, result = {}, networkError = false, authError = false, intakeError = false, crossAppError = null, crossAppErrorData = null, crossAppErrorMessage = 'Unauthorized', crossAppResult = { success: true } } = {}) {
  const source = readFileSync(path.join(root, 'base44/functions', name, 'entry.ts'), 'utf8')
    .replace(/^import[^\n]*\n/gm, '');
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
  });
  assert.equal((output.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  let handler;
  const stats = { effects: 0, provider: 0, serviceCalls: [], crossAppCalls: [], errorLogs: [] };
  const used = new Set();
  let discovery = {};
  let categories = [];
  const counted = value => async () => { stats.effects++; return value; };
  const service = {
    integrations: { Core: { InvokeLLM: counted('Choose one useful task and review the result.') } },
    functions: { async invoke(name, payload) {
      stats.effects++;
      stats.serviceCalls.push({ name, payload });
      if (intakeError && name === 'ntaUnifiedIntake') throw new Error('Downstream intake unavailable');
      return { data: { status: 'synced', success: true } };
    } },
    entities: {
      DiscoverySession: {
        async create(value) { stats.effects++; discovery = { id: 'test-session', ...value }; return discovery; },
        async update(id, value) { stats.effects++; discovery = { ...discovery, ...value }; return discovery; },
      },
      DiscoveryCategory: {
        async bulkCreate(values) { stats.effects++; categories = values; return values; },
        async filter() { stats.effects++; return categories; },
      },
      DiscoveryAuditEvent: { create: counted({ id: 'test-event' }) },
      TrialAccount: { create: counted({ id: 'test-trial' }), update: counted({ id: 'test-trial' }) },
      BusinessProfile: { create: counted({ id: 'test-profile' }) },
      Subscriber: { filter: counted([]), create: counted({ id: 'test-subscriber' }) },
      PublicationDeliveryRequest: { create: counted({ id: 'test-delivery' }) },
    },
  };
  vm.runInNewContext(output.outputText, {
    exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder, TextDecoder, crypto: webcrypto,
    console: { log() {}, warn() {}, error(...args) { stats.errorLogs.push(args.map(String).join(' ')); } },
    Deno: { serve(fn) { handler = fn; }, env: { get(key) { return env[key]; } } },
    createClientFromRequest() { return { auth: { async me() { if (authError) throw new Error('Invalid caller session'); return user; } }, asServiceRole: service }; },
    createClient(options) {
      assert.equal(options.headers?.['x-nta-core-bridge-secret'], env.NTA_CORE_BRIDGE_SECRET);
      return { functions: { async invoke(name, payload) {
      stats.effects++;
      stats.crossAppCalls.push({ appId: options.appId, name, payload });
      if (crossAppError) throw Object.assign(new Error(crossAppErrorMessage), { response: { status: crossAppError, data: crossAppErrorData ?? { error: 'Unauthorized.' } } });
      return { data: crossAppResult };
    } } }; },
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
  return { request, stats, handler };
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
    const fixture = setup(name, { env: bridgeSettings, user: { role: 'admin', id: 'verified-admin' } });
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

  test(name + ': verified service identity retains internal access without visitor proof', async () => {
    const fixture = setup(name, { env: bridgeSettings, user: { id: 'verified-service', is_service: true } });
    assert.equal((await fixture.request()).status, 200);
    assert.equal(fixture.stats.provider, 0);
  });

  test(name + ': ordinary signed-in member still needs visitor proof', async () => {
    const fixture = setup(name, { user: { id: 'ordinary-member', role: 'user' } });
    assert.equal((await fixture.request()).status, 403);
    assert.equal(fixture.stats.effects, 0);
  });

  test(name + ': invalid caller session does not bypass visitor proof', async () => {
    const fixture = setup(name, { authError: true });
    assert.equal((await fixture.request()).status, 403);
    assert.equal(fixture.stats.effects, 0);
  });

  test(name + ': metadata flag cannot authorize a submission', async () => {
    const fixture = setup(name);
    assert.equal((await fixture.request({ ...validPayloads[name], verification_config: true })).status, 403);
    assert.equal(fixture.stats.effects, 0);
  });

  test(name + ': non-POST request cannot run provider or privileged work', async () => {
    const fixture = setup(name);
    assert.equal((await fixture.handler(new Request('https://newtechadvertising.com/api/test'))).status, 405);
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

test('ntaUnifiedIntake: verified proof forwards only the normalized public intake', async () => {
  const fixture = setup('ntaUnifiedIntake');
  const response = await fixture.request({
    ...validPayloads.ntaUnifiedIntake,
    verification_token: 'one-time-intake-proof',
    source_system: 'crm_manual', skip_webhook: false, priority: 'low', role: 'admin',
    source_page: '/contact', source_url: 'https://untrusted.example/redirect',
    name: '  Test Visitor  ',
  });
  assert.equal(response.status, 200);
  assert.equal(fixture.stats.provider, 1);
  assert.equal(fixture.stats.crossAppCalls.length, 1);
  const call = fixture.stats.crossAppCalls[0];
  assert.equal(call.appId, '6a7215451eb90dc843a94546');
  assert.equal(call.name, 'ntaUnifiedIntake');
  assert.equal(call.payload.name, 'Test Visitor');
  assert.equal(call.payload.source_system, 'website');
  assert.equal(call.payload.source_url, '/contact');
  assert.equal(call.payload.skip_webhook, true);
  assert.equal(call.payload.priority, 'high');
  assert.equal('verification_token' in call.payload, false);
  assert.equal('role' in call.payload, false);
});

test('publicationSignup: one visitor proof sends its optional intake as an authenticated service', async () => {
  const fixture = setup('publicationSignup');
  const response = await fixture.request({
    ...validPayloads.publicationSignup, verification_token: 'one-publication-proof',
    record_intake: true, source_page: '/journal', submission_type: 'crm_manual',
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).intake_status, 'saved');
  assert.equal(fixture.stats.provider, 1);
  const calls = fixture.stats.serviceCalls.filter(call => call.name === 'ntaUnifiedIntake');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].payload.submission_type, 'publication_request');
  assert.equal(calls[0].payload.email, validPayloads.publicationSignup.email);
  assert.equal(calls[0].payload.consent, true);
  assert.equal('verification_token' in calls[0].payload, false);
});

test('publicationSignup: a failed CRM follow-up preserves the saved publication response', async () => {
  const fixture = setup('publicationSignup', { intakeError: true });
  const response = await fixture.request({
    ...validPayloads.publicationSignup, verification_token: 'one-publication-proof', record_intake: true,
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.subscriber_id, 'test-subscriber');
  assert.equal(body.intake_status, 'needs_attention');
});

test('ntaUnifiedIntake: authenticated service forwarding does not share a visitor quota', async () => {
  const fixture = setup('ntaUnifiedIntake', { user: { id: 'verified-service', is_service: true } });
  for (let index = 0; index < 20; index++) {
    assert.equal((await fixture.request()).status, 200);
  }
  assert.equal(fixture.stats.provider, 0);
  assert.equal(fixture.stats.crossAppCalls.length, 20);
});

test('ntaUnifiedIntake: visitor quota still stops excess verified submissions', async () => {
  const fixture = setup('ntaUnifiedIntake');
  for (let index = 0; index < 12; index++) {
    const response = await fixture.request({ ...validPayloads.ntaUnifiedIntake, verification_token: 'quota-proof-' + index });
    assert.equal(response.status, 200);
  }
  const limited = await fixture.request({ ...validPayloads.ntaUnifiedIntake, verification_token: 'quota-proof-excess' });
  assert.equal(limited.status, 429);
  assert.equal(fixture.stats.provider, 12);
  assert.equal(fixture.stats.crossAppCalls.length, 12);
});


test('guided setup: one proof covers the fixed CRM handoff without sharing visitor credentials', async () => {
  const fixture = setup('submitPublicTrialSignup');
  const response = await fixture.request({ ...validPayloads.submitPublicTrialSignup, verification_token: 'one-setup-proof', submission_type: 'crm_manual' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).intake_status, 'saved');
  assert.equal(fixture.stats.provider, 1);
  const calls = fixture.stats.serviceCalls.filter(call => call.name === 'ntaUnifiedIntake');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].payload.submission_type, 'trial_signup');
  assert.equal('verification_token' in calls[0].payload, false);
});

test('guided setup: a failed CRM handoff retains the saved request and exposes its review status', async () => {
  const fixture = setup('submitPublicTrialSignup', { intakeError: true });
  const response = await fixture.request({ ...validPayloads.submitPublicTrialSignup, verification_token: 'one-setup-proof' });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.trial_id, 'test-trial');
  assert.equal(body.intake_status, 'needs_attention');
  assert.equal(body.provisioning_status, 'pending');
});

for (const name of ['ntaUnifiedIntake', 'submitRecruitingApplication']) {
  for (const status of [401, 403]) {
    test(name + ': Core ' + status + ' becomes a clear unavailable-connection message', async () => {
      const fixture = setup(name, { crossAppError: status });
      const response = await fixture.request({ ...validPayloads[name], verification_token: 'one-time-proof' });
      assert.equal(response.status, 503);
      const body = await response.json();
      assert.equal(body.code, 'NTA_CONNECTION_UNAVAILABLE');
      assert.match(body.error, /could not save your request/);
      assert.match(body.error, /641-420-8816/);
      assert.doesNotMatch(body.error, /Unauthorized/);
      assert.equal(fixture.stats.crossAppCalls.length, 1);
    });
  }
}


test('ntaUnifiedIntake: Core 4xx errors expose only allowlisted visitor messages, never upstream details', async () => {
  const sensitive = {
    error: 'Internal CRM URL https://internal.example/api/v1, database password & customer 555-0188',
    trace_id: 'internal-correlation-id-0001',
    debug: { bearer: 'test-secret-value-must-not-leak' },
  };
  const statusCases = [
    [400, 400, 'NTA_INPUT_INVALID'],
    [409, 409, 'NTA_REQUEST_CONFLICT'],
    [413, 413, 'NTA_REQUEST_TOO_LARGE'],
    [422, 422, 'NTA_INPUT_INVALID'],
    [429, 429, 'NTA_REQUEST_LIMITED'],
    [404, 502, 'NTA_INTAKE_UNAVAILABLE'],
    [418, 502, 'NTA_INTAKE_UNAVAILABLE'],
    [500, 502, 'NTA_INTAKE_UNAVAILABLE'],
  ];

  for (const [coreStatus, expectedHttp, expectedCode] of statusCases) {
    const fixture = setup('ntaUnifiedIntake', {
      crossAppError: coreStatus,
      crossAppErrorData: sensitive,
      crossAppErrorMessage: 'Internal database failure test-secret-value-must-not-leak',
    });
    const response = await fixture.request({
      ...validPayloads.ntaUnifiedIntake,
      verification_token: 'isolated-proof-' + coreStatus,
    });
    assert.equal(response.status, expectedHttp, 'Core status ' + coreStatus);
    const body = await response.json();
    assert.equal(body.code, expectedCode);
    assert.equal(typeof body.error, 'string');
    assert.deepEqual(Object.keys(body).sort(), ['code', 'error']);
    const publicBody = JSON.stringify(body);
    for (const forbidden of ['internal.example', 'database', '555-0188', 'test-secret-value', 'trace_id', 'debug']) {
      assert.ok(!publicBody.includes(forbidden), 'public Core ' + coreStatus + ' leaked ' + forbidden);
      assert.ok(!fixture.stats.errorLogs.join(' ').includes(forbidden), 'log Core ' + coreStatus + ' leaked ' + forbidden);
    }
    assert.equal(fixture.stats.crossAppCalls.length, 1);
    assert.equal(fixture.stats.provider, 1);
  }
});

test('ntaUnifiedIntake: local form validation and accepted Core responses remain intact', async () => {
  const fixture = setup('ntaUnifiedIntake');
  const invalid = await fixture.request({
    name: 'No contact method',
    verification_token: 'isolated-no-contact',
    submission_type: 'contact',
  });
  assert.equal(invalid.status, 400);
  assert.match((await invalid.json()).error, /email address or phone number/);
  assert.equal(fixture.stats.crossAppCalls.length, 0);

  const successful = await fixture.request({
    ...validPayloads.ntaUnifiedIntake,
    verification_token: 'isolated-success',
  });
  assert.equal(successful.status, 200);
  assert.equal((await successful.json()).success, true);
  assert.equal(fixture.stats.crossAppCalls.length, 1);
});


test('Gemini F5: recruiting Core 4xx/5xx errors never expose upstream diagnostics', async () => {
  const secrets = { error: 'Secret at https://core.internal.invalid', trace_id: 'private-trace-id', debug: { token: 'fake-unit-secret' } };
  const samples = [[400,400,'NTA_INPUT_INVALID'],[409,409,'NTA_REQUEST_CONFLICT'],[413,413,'NTA_REQUEST_TOO_LARGE'],[422,422,'NTA_INPUT_INVALID'],[429,429,'NTA_REQUEST_LIMITED'],[404,502,'NTA_RECRUITING_UNAVAILABLE'],[500,502,'NTA_RECRUITING_UNAVAILABLE']];
  for (const [upstream,http,code] of samples) {
    const f = setup('submitRecruitingApplication', {
      crossAppError: upstream, crossAppErrorData: secrets, crossAppErrorMessage: 'Core fake-unit-secret',
    });
    const r = await f.request({ ...validPayloads.submitRecruitingApplication, verification_token: 'recruit-proof-'+upstream });
    const data = await r.json();
    assert.equal(r.status,http);assert.equal(data.code,code);
    assert.deepEqual(Object.keys(data).sort(),['code','error']);
    for (const hidden of ['core.internal','fake-unit-secret','private-trace-id','debug']) {
      assert.ok(!JSON.stringify(data).includes(hidden));
      assert.ok(!f.stats.errorLogs.join(' ').includes(hidden));
    }
    assert.equal(f.stats.crossAppCalls.length,1);
    assert.equal(f.stats.provider,1);
  }
});

test('Gemini F5: recruiting unsuccessful body is masked and accepted application response survives', async () => {
  const f = setup('submitRecruitingApplication', { crossAppResult: { success: false, error:'private database credential' } });
  const declined = await f.request({ ...validPayloads.submitRecruitingApplication,verification_token:'declined-core' });
  assert.equal(declined.status,502);
  assert.equal((await declined.json()).code,'NTA_RECRUITING_UNAVAILABLE');
  const ok = setup('submitRecruitingApplication', { crossAppResult: {
    success:true,accepted:true,candidate_id:'test-applicant-123',duplicate:false,
    email_delivery:{internal:'queued',applicant:'queued'},
  }});
  const saved = await ok.request({ ...validPayloads.submitRecruitingApplication, verification_token:'accepted-core' });
  assert.equal(saved.status,200);
  assert.equal((await saved.json()).candidate_id,'test-applicant-123');
});

test('Gemini F5: trackBookEvent masks Core diagnostic content and preserves safe HTTP outcomes', async () => {
  const secrets = { error:'Secret at https://core.internal.invalid',trace_id:'private-trace-id', token:'fake-unit-secret' };
  const req = { book_key:'better-business-book',event_type:'download_click' };
  const samples = [[400,400,'NTA_INPUT_INVALID'],[409,409,'NTA_REQUEST_CONFLICT'],[413,413,'NTA_REQUEST_TOO_LARGE'],[422,422,'NTA_INPUT_INVALID'],[429,429,'NTA_REQUEST_LIMITED'],[401,503,'NTA_CONNECTION_UNAVAILABLE'],[403,503,'NTA_CONNECTION_UNAVAILABLE'],[404,502,'NTA_BOOK_EVENT_UNAVAILABLE'],[500,502,'NTA_BOOK_EVENT_UNAVAILABLE']];
  for (const [upstream,http,code] of samples) {
    const f = setup('trackBookEvent', { user:{role:'admin',id:'unit-test-admin'},crossAppError:upstream,crossAppErrorData:secrets,crossAppErrorMessage:'Core fake-unit-secret' });
    const r = await f.request(req);const data = await r.json();
    assert.equal(r.status,http);assert.equal(data.code,code);
    assert.deepEqual(Object.keys(data).sort(),['code','error']);
    for(const hidden of ['core.internal','fake-unit-secret','private-trace-id']) {
      assert.ok(!JSON.stringify(data).includes(hidden));
      assert.ok(!f.stats.errorLogs.join(' ').includes(hidden));
    }
    assert.equal(f.stats.crossAppCalls.length,1);
    assert.equal(f.stats.provider,0);
  }
});

test('Gemini F5: trackBookEvent masks error in a success envelope but retains a valid tracking result', async () => {
  const payload = { book_key:'practical-ai-for-small-business',event_type:'read_online_click' };
  const bad=setup('trackBookEvent',{ user:{role:'admin'},crossAppResult:{error:'Private Core DB secret'} });
  const res=await bad.request(payload);
  assert.equal(res.status,502);assert.equal((await res.json()).code,'NTA_BOOK_EVENT_UNAVAILABLE');
  const ok=setup('trackBookEvent',{user:{role:'admin'},crossAppResult:{success:true,recorded:true}});
  const saved=await ok.request(payload);
  assert.equal(saved.status,200);assert.equal((await saved.json()).recorded,true);
});
