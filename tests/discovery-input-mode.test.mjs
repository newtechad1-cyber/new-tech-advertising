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
