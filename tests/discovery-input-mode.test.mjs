import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('visitor is offered explicit voice and text answer modes', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  assert.match(source, /Talk it through/);
  assert.match(source, /Type my answers/);
  assert.match(source, /raw_audio_retention/);
  assert.match(source, /voice_transcript/);
});

test('voice capture verifies the microphone and recovers from unintended browser stops', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  assert.match(source, /getUserMedia\(\{ audio: true \}\)/);
  assert.match(source, /shouldListenRef/);
  assert.match(source, /recognition\.continuous = false/);
  assert.match(source, /recognition\.start\(\)/);
  assert.match(source, /event\.error === 'no-speech'/);
  assert.match(source, /microphone is blocked/i);
});

test('voice transcripts require processing, microphone, and transcription consent', async () => {
  const source = await read('base44/functions/appendDiscoveryEntry/entry.ts');
  assert.match(source, /granted\.has\('discovery_processing'\)/);
  assert.match(source, /granted\.has\('microphone'\)/);
  assert.match(source, /granted\.has\('transcription'\)/);
  assert.match(source, /source_mode: 'voice_transcript'|source_mode,/);
});

test('a dictated answer advances immediately after save while interpretation refreshes in the background', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  const submitAnswer = source.slice(source.indexOf('const submitAnswer'), source.indexOf('if (busy && !snapshot)'));
  assert.match(source, /answerRef\.current\.trim\(\)/);
  assert.match(submitAnswer, /stopListening\(\)/);
  assert.match(submitAnswer, /setAskedCategories\(nextAsked\)/);
  assert.doesNotMatch(submitAnswer, /await refresh\(\)/);
  assert.match(submitAnswer, /refresh\(\)\.catch/);
  assert.match(source, /Answer saved\. Here is the next question\./);
  assert.match(source, /role="status"/);
});

test('browser storage cannot block the next question after an answer is saved', async () => {
  const source = await read('src/components/nta-guide/DiscoveryWalkthrough.jsx');
  const submitAnswer = source.slice(source.indexOf('const submitAnswer'), source.indexOf('if (busy && !snapshot)'));
  assert.ok(submitAnswer.indexOf('setAskedCategories(nextAsked)') < submitAnswer.indexOf('sessionStorage.setItem'));
  assert.match(submitAnswer, /try \{\s*sessionStorage\.setItem/);
});


// Gemini F9: run the actual summary handler inside a network-free test
// context. These fixtures cannot access real DiscoverySessions or accounts.
const createConfirmedSummarySource = await read('base44/functions/createConfirmedSummary/entry.ts');
function consentSummaryFixture({
  consent = { state: 'granted', affirmative_action: true, withdrawn_at: null },
  sessionStatus = 'started',
  summaryState = 'draft',
  wrongSessionKey = false,
  consentLookupFails = false,
} = {}) {
  let handler;
  const effects = [];
  const lookups = [];
  const sessionKey = 'a'.repeat(64);
  const session = {
    id: 'fictional-discovery-session',
    public_session_key: sessionKey,
    expires_at: '2099-01-01T00:00:00.000Z',
    status: sessionStatus,
  };
  const summary = {
    id: 'fictional-summary',
    session_id: session.id,
    confirmation_state: summaryState,
    version: 1,
    owner_goal: 'Understand business growth options',
    created_at: '2026-11-05T00:00:00.000Z',
  };
  const sessionEntity = {
    async get(id) { lookups.push('session.get'); assert.equal(id, session.id); return session; },
    async update(id, data) {
      effects.push('session.update');
      assert.equal(id, session.id);
      Object.assign(session, data);
      return { ...session };
    },
  };
  const summaryEntity = {
    async filter({ session_id }) { lookups.push('summary.filter'); assert.equal(session_id, session.id); return []; },
    async get(id) { lookups.push('summary.get'); assert.equal(id, summary.id); return summary; },
    async create(data) { effects.push('summary.create'); return { ...data, id: summary.id }; },
    async update(id, data) {
      effects.push('summary.update');
      assert.equal(id, summary.id);
      return { ...summary, ...data };
    },
  };
  const context = {
    exports: {}, Request, Response, Headers, URL,
    console: { error() {}, warn() {}, log() {} },
    Deno: { serve(fn) { handler = fn; } },
    createClientFromRequest() {
      return {
        auth: { async me() { return null; } },
        asServiceRole: { entities: {
          DiscoverySession: sessionEntity,
          DiscoveryConsent: {
            async filter(args) {
              lookups.push('consent.filter');
              assert.equal(args.session_id, session.id);
              assert.equal(args.consent_type, 'discovery_processing');
              if (consentLookupFails) throw new Error('Fake database error');
              return consent ? [{ id: 'fictional-consent', ...consent }] : [];
            },
          },
          DiscoveryConfirmedSummary: summaryEntity,
          DiscoveryAuditEvent: { async create(data) { effects.push('audit.create'); return { id: 'fake-audit', ...data }; } },
        } },
      };
    },
  };
  const source = createConfirmedSummarySource.replace(/^import[^\n]*\n/gm, '');
  vm.runInNewContext(ts.transpileModule(source, {
    fileName: 'base44/functions/createConfirmedSummary/entry.ts',
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  assert.equal(typeof handler, 'function');
  const request = (action, payload = {}) => handler(new Request('https://newtechadvertising.com/api/summary', {
    method: 'POST',
    headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: session.id,
      public_session_key: wrongSessionKey ? 'b'.repeat(64) : sessionKey,
      action,
      ...(action === 'create_draft'
        ? { summary_data: { owner_goal: 'Understand business growth options' } }
        : { summary_id: summary.id }),
      ...payload,
    }),
  }));
  return { request, effects, lookups };
}

test('summary drafts require granted affirmative active discovery_processing consent', async () => {
  const invalidConsents = [
    null,
    { state: 'declined', affirmative_action: false },
    { state: 'withdrawn', affirmative_action: false, withdrawn_at: '2026-11-05T00:00:00.000Z' },
    { state: 'granted', affirmative_action: false },
    { state: 'granted', affirmative_action: true, withdrawn_at: '2026-11-05T00:00:00.000Z' },
  ];
  for (const consent of invalidConsents) {
    const fixture = consentSummaryFixture({ consent });
    const res = await fixture.request('create_draft');
    assert.equal(res.status, 403);
    assert.equal((await res.json()).code, 'DISCOVERY_CONSENT_REQUIRED');
    assert.deepEqual(fixture.effects, [], 'no summary, session or audit writes without consent');
    assert.ok(!fixture.lookups.includes('summary.filter'));
  }
});

test('summary confirmation rechecks consent so a withdrawn owner cannot confirm an earlier draft', async () => {
  for (const consent of [null, { state: 'declined', affirmative_action: false }, { state: 'withdrawn', affirmative_action: false, withdrawn_at: '2026-11-05' }]) {
    const fixture = consentSummaryFixture({ consent, sessionStatus: 'summary_ready' });
    const res = await fixture.request('confirm_draft');
    assert.equal(res.status, 403);
    assert.equal((await res.json()).code, 'DISCOVERY_CONSENT_REQUIRED');
    assert.deepEqual(fixture.effects, []);
    assert.ok(!fixture.lookups.includes('summary.get'));
  }
});

test('active processing consent keeps legitimate summary draft and confirmation behavior', async () => {
  const consent = { state: 'granted', affirmative_action: true, withdrawn_at: null };
  const draftFixture = consentSummaryFixture({ consent });
  const draftResponse = await draftFixture.request('create_draft');
  const draft = await draftResponse.json();
  assert.equal(draftResponse.status, 200);
  assert.equal(draft.confirmation_state, 'draft');
  assert.equal(draft.id, 'fictional-summary');
  assert.deepEqual(draftFixture.effects, ['summary.create', 'session.update']);

  const confirmationFixture = consentSummaryFixture({ consent, sessionStatus: 'summary_ready' });
  const confirmationResponse = await confirmationFixture.request('confirm_draft');
  const confirmed = await confirmationResponse.json();
  assert.equal(confirmationResponse.status, 200);
  assert.equal(confirmed.confirmation_state, 'confirmed');
  assert.deepEqual(confirmationFixture.effects, ['summary.update', 'session.update', 'audit.create']);
});

test('invalid session credentials and consent-store outages fail closed without creating summaries', async () => {
  const badCredential = consentSummaryFixture({ wrongSessionKey: true });
  const invalidResponse = await badCredential.request('create_draft');
  assert.equal(invalidResponse.status, 401);
  assert.deepEqual(badCredential.effects, []);
  assert.equal(badCredential.lookups.includes('consent.filter'), false);

  const unavailable = consentSummaryFixture({ consentLookupFails: true });
  const failedResponse = await unavailable.request('create_draft');
  assert.equal(failedResponse.status, 500);
  assert.deepEqual(unavailable.effects, []);
});

test('summary consent check does not replace separate save-and-return and Journal permissions', async () => {
  const retention = await read('base44/functions/setDiscoveryRetention/entry.ts');
  const journal = await read('base44/functions/subscribeDiscoveryJournal/entry.ts');
  assert.match(retention, /consent_type: 'save_and_return'/);
  assert.match(retention, /saveConsent\.affirmative_action !== true/);
  assert.match(journal, /consent_type: 'journal'/);
  assert.match(journal, /consent\.affirmative_action !== true/);
});

// The retention and optional Journal actions are tiny JSON RPCs. Run their
// actual handlers with fake entities and streams; no live accounts or writes.
const discoveryActionSources = Object.fromEntries(await Promise.all(
  ['setDiscoveryRetention', 'subscribeDiscoveryJournal'].map(async name => [
    name, await read(`base44/functions/${name}/entry.ts`),
  ]),
));
const DISCOVERY_REQUEST_LIMIT = 64 * 1024;
function discoveryActionFixture(name, {
  consent = { state: 'granted', affirmative_action: true },
  wrongSessionKey = false,
  sessionStatus = 'started',
  expiresAt = '2099-01-01T00:00:00.000Z',
  existingSubscriber = false,
  trustedService = false,
} = {}) {
  let handler;
  let jsonParses = 0;
  const lookups = [];
  const effects = [];
  const session = {
    id: 'fictional-discovery-session',
    public_session_key: 'a'.repeat(64),
    expires_at: expiresAt,
    status: sessionStatus,
  };
  const context = {
    exports: {}, Request, Response, Headers, URL, Uint8Array, TextDecoder,
    JSON: { parse(value) { jsonParses += 1; return JSON.parse(value); } },
    Deno: { serve(fn) { handler = fn; } },
    createClientFromRequest() {
      return {
        auth: { async me() { return trustedService ? { role: 'admin' } : null; } },
        asServiceRole: { entities: {
          DiscoverySession: {
            async get(id) { lookups.push('session.get'); assert.equal(id, session.id); return session; },
            async update(id, data) { effects.push('session.update'); assert.equal(id, session.id); return { ...session, ...data }; },
          },
          DiscoveryConsent: {
            async filter(args) {
              lookups.push('consent.filter');
              assert.equal(args.session_id, session.id);
              assert.equal(args.consent_type, name === 'setDiscoveryRetention' ? 'save_and_return' : 'journal');
              return consent ? [{ id: 'fictional-consent', ...consent }] : [];
            },
          },
          DiscoveryRetentionInstruction: {
            async create(data) { effects.push('retention.create'); return { id: 'fictional-instruction', ...data }; },
          },
          Subscriber: {
            async filter() { lookups.push('subscriber.filter'); return existingSubscriber ? [{ id: 'fictional-subscriber', first_name: 'Reader' }] : []; },
            async create(data) { effects.push('subscriber.create'); return { id: 'fictional-subscriber', ...data }; },
            async update(id, data) { effects.push('subscriber.update'); return { id, ...data }; },
          },
          DiscoveryAuditEvent: {
            async create(data) { effects.push('audit.create'); return { id: 'fictional-audit', ...data }; },
          },
        } },
      };
    },
  };
  vm.runInNewContext(ts.transpileModule(discoveryActionSources[name].replace(/^import[^\n]*\n/gm, ''), {
    fileName: `base44/functions/${name}/entry.ts`,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  assert.equal(typeof handler, 'function');
  const payload = {
    session_id: session.id,
    public_session_key: wrongSessionKey ? 'b'.repeat(64) : session.public_session_key,
    ...(name === 'setDiscoveryRetention'
      ? { target: 'working_discovery', action: 'save' }
      : { email: 'reader@example.test', first_name: 'Reader' }),
  };
  const request = (body = JSON.stringify(payload), headers = {}) => handler(new Request('https://newtechadvertising.com/api/discovery', {
    method: 'POST',
    headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json', ...headers },
    body,
    ...(body instanceof ReadableStream ? { duplex: 'half' } : {}),
  }));
  return { request, payload, effects, lookups, jsonParses: () => jsonParses };
}
function discoveryBodyStream(chunks) {
  let reads = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) {
      reads += 1;
      if (chunks.length) controller.enqueue(chunks.shift());
      else controller.close();
    },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  return { stream, reads: () => reads, cancelled: () => cancelled };
}

for (const name of Object.keys(discoveryActionSources)) {
  test(`${name}: rejects oversized Content-Length before reading or entity access`, async () => {
    for (const trustedService of [false, true]) {
      const fixture = discoveryActionFixture(name, { trustedService });
      const body = discoveryBodyStream([new TextEncoder().encode(JSON.stringify(fixture.payload))]);
      const response = await fixture.request(body.stream, { 'Content-Length': String(DISCOVERY_REQUEST_LIMIT + 1) });
      assert.equal(response.status, 413);
      assert.equal(body.reads(), 0);
      assert.equal(fixture.jsonParses(), 0);
      assert.deepEqual(fixture.lookups, []);
      assert.deepEqual(fixture.effects, []);
    }
  });

  test(`${name}: stops oversized streams by bytes even without an honest length header`, async () => {
    for (const headers of [{}, { 'Content-Length': '1' }]) {
      const fixture = discoveryActionFixture(name);
      // The first chunk fits; the second crosses the limit. Never read the tail.
      const body = discoveryBodyStream([
        new Uint8Array(40_000),
        new Uint8Array(DISCOVERY_REQUEST_LIMIT - 40_000 + 1),
        new TextEncoder().encode('PRIVATE-TAIL-SHOULD-NOT-BE-READ'),
      ]);
      const response = await fixture.request(body.stream, headers);
      assert.equal(response.status, 413);
      assert.equal(body.reads(), 2);
      assert.equal(body.cancelled(), true);
      assert.equal(fixture.jsonParses(), 0);
      assert.deepEqual(fixture.lookups, []);
      assert.deepEqual(fixture.effects, []);
      assert.doesNotMatch(await response.text(), /PRIVATE-TAIL/);
    }
    const fixture = discoveryActionFixture(name);
    const multibyte = JSON.stringify({ ...fixture.payload, padding: 'é'.repeat(33_000) });
    assert.ok(multibyte.length < DISCOVERY_REQUEST_LIMIT, 'character count alone would incorrectly allow this');
    assert.ok(Buffer.byteLength(multibyte) > DISCOVERY_REQUEST_LIMIT);
    const response = await fixture.request(multibyte);
    assert.equal(response.status, 413);
    assert.equal(fixture.jsonParses(), 0);
    assert.deepEqual(fixture.lookups, []);
    assert.deepEqual(fixture.effects, []);
  });

  test(`${name}: accepts a valid request exactly at the byte limit across UTF-8 chunks`, async () => {
    const fixture = discoveryActionFixture(name);
    const unpadded = JSON.stringify({ ...fixture.payload, marker: 'é', padding: '' });
    const text = JSON.stringify({ ...fixture.payload, marker: 'é', padding: 'x'.repeat(DISCOVERY_REQUEST_LIMIT - Buffer.byteLength(unpadded)) });
    const bytes = new TextEncoder().encode(text);
    assert.equal(bytes.byteLength, DISCOVERY_REQUEST_LIMIT);
    const split = bytes.indexOf(0xc3) + 1;
    const body = discoveryBodyStream([bytes.slice(0, split), bytes.slice(split)]);
    const response = await fixture.request(body.stream, { 'Content-Length': String(bytes.byteLength) });
    assert.equal(response.status, 200);
    assert.deepEqual(fixture.lookups.slice(0, 2), ['session.get', 'consent.filter']);
    assert.deepEqual(fixture.effects, name === 'setDiscoveryRetention'
      ? ['retention.create', 'session.update', 'audit.create']
      : ['subscriber.create', 'audit.create']);
    const result = await response.json();
    if (name === 'setDiscoveryRetention') assert.equal(result.session_updates.status, 'saved');
    else assert.equal(result.subscribed, true);
  });

  test(`${name}: preserves consent and session checks for small requests`, async () => {
    for (const consent of [null, { state: 'declined', affirmative_action: false }, { state: 'granted', affirmative_action: false }]) {
      const fixture = discoveryActionFixture(name, { consent });
      assert.equal((await fixture.request()).status, 403);
      assert.deepEqual(fixture.effects, []);
    }
    for (const options of [{ wrongSessionKey: true }, { sessionStatus: 'deleted' }, { expiresAt: '2000-01-01T00:00:00.000Z' }]) {
      const fixture = discoveryActionFixture(name, options);
      assert.equal((await fixture.request()).status, 401);
      assert.deepEqual(fixture.effects, []);
      assert.equal(fixture.lookups.includes('consent.filter'), false);
    }
    const fixture = discoveryActionFixture(name);
    assert.equal((await fixture.request(undefined, { Origin: 'https://untrusted.example.test' })).status, 403);
    assert.deepEqual(fixture.lookups, []);
    assert.deepEqual(fixture.effects, []);
  });

  test(`${name}: malformed or failed request streams keep a safe error and no writes`, async () => {
    for (const body of ['PRIVATE-BROKEN-JSON', 'null']) {
      const fixture = discoveryActionFixture(name);
      const response = await fixture.request(body);
      assert.equal(response.status, 401);
      assert.doesNotMatch(await response.text(), /PRIVATE-BROKEN-JSON/);
      assert.deepEqual(fixture.lookups, []);
      assert.deepEqual(fixture.effects, []);
    }
    const fixture = discoveryActionFixture(name);
    const body = new ReadableStream({
      pull(controller) { controller.error(new Error('PRIVATE-STREAM-DETAILS')); },
    }, { highWaterMark: 0 });
    const response = await fixture.request(body);
    assert.equal(response.status, 401);
    assert.doesNotMatch(await response.text(), /PRIVATE-STREAM-DETAILS/);
    assert.deepEqual(fixture.effects, []);
  });
}

test('bounded Journal requests still update an existing subscriber rather than duplicating it', async () => {
  const fixture = discoveryActionFixture('subscribeDiscoveryJournal', { existingSubscriber: true });
  const response = await fixture.request();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).subscriber_id, 'fictional-subscriber');
  assert.deepEqual(fixture.effects, ['subscriber.update', 'audit.create']);
});
