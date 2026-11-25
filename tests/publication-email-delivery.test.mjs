import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

// Execute both production handlers with in-memory entities and a mocked mail
// integration. These tests never contact Base44, Turnstile, Core, or an inbox.
const books = [
  ['ai-curious', 'AI Curious?', 'https://media.base44.com/files/public/691f41a18de4a7f498c8f884/15cf65799ba4e51e72e96bca7e607761_AI_Curious_Rick_Hesse_Reader_Edition.pdf'],
  ['better-business-book', 'The Better Business Building Book', 'https://drive.usercontent.google.com/download?id=1SSpBnObRHrt0SGtVmHhOAdzazmLql-M9&export=download'],
  ['practical-ai-for-small-business', 'Practical AI for Small Business', 'https://drive.usercontent.google.com/download?id=11nq430-bcstci_fuOP8Fm9g2xTk2n0yl&export=download'],
];
const settings = {
  NTA_CORE_BRIDGE_SECRET: 'isolated-book-email-test-bridge-secret-only',
  NTA_TURNSTILE_SITE_KEY: '0x-isolated-book-email-test-site-key',
  NTA_TURNSTILE_SECRET_KEY: 'isolated-book-email-test-provider-secret',
};
const plain = value => JSON.parse(JSON.stringify(value));
function payload(book = books[0]) {
  return {
    name: 'Test Reader', email: 'BOOK-READER@example.invalid',
    publication_tag: book[0], publication_title: book[1], delivery_url: book[2],
    consent: true, create_delivery_request: true, record_intake: true,
    verification_token: 'isolated-reader-proof',
    source: 'book-email-regression', source_page: '/ai-curious',
    source_url: 'https://newtechadvertising.com/ai-curious',
  };
}

function fixture(options = {}) {
  const subscribers = [];
  const requests = [];
  const stats = { serviceCalls: [], mail: [], tracking: [], writes: [], reads: 0, proofs: 0, warnings: [] };
  const usedProofs = new Set();
  const entity = (records, name) => ({
    async filter(query) {
      stats.reads++;
      return records.filter(record => Object.entries(query).every(([key, value]) => record[key] === value));
    },
    async create(value) {
      const record = { ...plain(value), id: 'server-' + name + '-' + (records.length + 1) };
      records.push(record);
      stats.writes.push({ name, action: 'create', value: plain(record) });
      return record;
    },
    async update(id, value) {
      const record = records.find(item => item.id === id);
      assert.ok(record, 'Update must target a saved ' + name);
      Object.assign(record, plain(value));
      stats.writes.push({ name, action: 'update', id, value: plain(value) });
      return record;
    },
  });
  let emailHandler;
  const service = {
    entities: {
      Subscriber: entity(subscribers, 'subscriber'),
      PublicationDeliveryRequest: entity(requests, 'delivery'),
    },
    integrations: { Core: { async SendEmail(message) {
      stats.mail.push(plain(message));
      if (options.mailError) throw new Error('Private provider diagnostic example.invalid');
      return { accepted: true };
    } } },
    functions: { async invoke(name, data) {
      stats.serviceCalls.push({ name, data: plain(data) });
      if (name === 'sendPublicationDeliveryEmail') {
        if (options.invokeError) throw new Error('Private invocation diagnostic example.invalid');
        if (Object.hasOwn(options, 'deliveryResult')) return { data: options.deliveryResult };
        const response = await emailHandler(new Request('https://internal.example.invalid/email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
        }));
        const result = await response.json();
        if (!response.ok) throw Object.assign(new Error('Internal delivery helper failed'), {
          response: { status: response.status, data: result },
        });
        return { data: result };
      }
      if (name === 'ntaUnifiedIntake') {
        if (options.intakeError) throw new Error('Mock intake unavailable');
        return { data: { success: true } };
      }
      assert.equal(name, 'syncJournalSubscriber');
      return { data: { status: 'synced' } };
    } },
  };
  function load(name, user) {
    const file = path.join(process.cwd(), 'base44/functions', name, 'entry.ts');
    const source = readFileSync(file, 'utf8').replace(/^import[^\n]*\n/gm, '');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
      reportDiagnostics: true,
    });
    assert.equal((compiled.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error).length, 0);
    let handler;
    vm.runInNewContext(compiled.outputText, {
      exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder, TextDecoder,
      btoa, atob, crypto: webcrypto,
      console: { log() {}, error() {}, warn(...values) { stats.warnings.push(values.map(String).join(' ')); } },
      Deno: { serve(fn) { handler = fn; }, env: { get(key) { return settings[key]; } } },
      createClientFromRequest() {
        return {
          auth: { async me() { if (user instanceof Error) throw user; return user; } },
          asServiceRole: service,
        };
      },
      createClient(config) {
        assert.equal(config.appId, '6a7215451eb90dc843a94546');
        assert.equal(config.headers['x-nta-core-bridge-secret'], settings.NTA_CORE_BRIDGE_SECRET);
        return { functions: { async invoke(name, data) {
          assert.equal(name, 'trackBookEvent');
          stats.tracking.push(plain(data));
          return { data: { success: true } };
        } } };
      },
      async fetch(url, init) {
        assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify', 'No other network request is allowed');
        const body = JSON.parse(init.body);
        assert.equal(body.secret, settings.NTA_TURNSTILE_SECRET_KEY);
        stats.proofs++;
        const repeated = usedProofs.has(body.response);
        usedProofs.add(body.response);
        return Response.json({
          success: options.invalidProof !== true && !repeated,
          action: 'publication_signup', hostname: 'newtechadvertising.com',
          challenge_ts: new Date().toISOString(),
        });
      },
    }, { filename: file });
    return handler;
  }
  emailHandler = load('sendPublicationDeliveryEmail',
    Object.hasOwn(options, 'helperUser') ? options.helperUser : { id: 'verified-service', is_service: true });
  const signupHandler = load('publicationSignup', null);
  return {
    stats, subscribers, requests, emailHandler,
    request(data = payload()) {
      return signupHandler(new Request('https://newtechadvertising.com/api/test', {
        method: 'POST',
        headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }));
    },
  };
}

for (const book of books) {
  test('book email: ' + book[0] + ' dispatches one canonical request through the guarded helper', async () => {
    const f = fixture();
    const data = { ...payload(book), request_id: 'forged-request', delivery_request_id: 'forged-request',
      to: 'wrong-person@example.invalid', role: 'admin', is_service: true, tags: ['nta-journal'] };
    const response = await f.request(data);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.email_delivery_status, 'accepted');
    assert.equal(body.intake_status, 'saved');
    assert.equal(body.journal_sync_status, null);
    assert.equal(body.delivery_request_id, f.requests[0].id);
    assert.equal(body.book_tracking_token.split('.').length, 2);
    assert.equal(f.stats.proofs, 1);
    assert.deepEqual(f.stats.serviceCalls.filter(call => call.name === 'sendPublicationDeliveryEmail'), [{
      name: 'sendPublicationDeliveryEmail',
      data: { request_id: f.requests[0].id, delivery_url: book[2] },
    }]);
    assert.equal(f.stats.mail.length, 1);
    assert.equal(f.stats.mail[0].to, 'book-reader@example.invalid');
    assert.equal(f.stats.mail[0].subject, 'Your copy of ' + book[1]);
    assert.ok(f.stats.mail[0].body.includes(book[2]));
    assert.equal(f.requests[0].status, 'sent');
    assert.equal(f.requests[0].attempt_count, 1);
    assert.ok(f.requests[0].sent_date);
    assert.equal(f.subscribers[0].consent_scope, 'publication');
    assert.equal(f.subscribers[0].journal_consent_status, 'none');
    assert.equal(f.subscribers[0].tags.includes('nta-journal'), false);
    assert.equal(f.stats.serviceCalls.some(call => call.name === 'syncJournalSubscriber'), false);
    assert.deepEqual(f.stats.tracking, [{ book_key: book[0], event_type: 'access_request' }]);
    assert.equal('error' in body, false);
    assert.equal('delivered' in body, false);
  });
}

test('book email: omitted browser delivery URL still uses the server-approved reader PDF', async () => {
  const f = fixture();
  const response = await f.request({ ...payload(), delivery_url: undefined });
  assert.equal((await response.json()).email_delivery_status, 'accepted');
  assert.ok(f.stats.mail[0].body.includes(books[0][2]));
});

for (const [label, changes, options, expectedStatus] of [
  ['missing visitor proof', { verification_token: undefined, role: 'admin', is_service: true }, {}, 403],
  ['invalid visitor proof', {}, { invalidProof: true }, 403],
  ['missing consent', { consent: false }, {}, 400],
  ['unrecognized publication', { publication_tag: 'other-book' }, {}, 400],
  ['mismatched title', { publication_title: 'Other book' }, {}, 400],
  ['substituted URL', { delivery_url: 'https://example.invalid/other.pdf' }, {}, 400],
]) {
  test('book email: ' + label + ' cannot create a request or send email', async () => {
    const f = fixture(options);
    const response = await f.request({ ...payload(), ...changes });
    assert.equal(response.status, expectedStatus);
    assert.equal(f.stats.writes.length, 0);
    assert.equal(f.stats.serviceCalls.length, 0);
    assert.equal(f.stats.mail.length, 0);
  });
}

test('book email: honeypot submission never dispatches', async () => {
  const f = fixture();
  const response = await f.request({ ...payload(), anti_spam: { honeypot: 'bot' } });
  assert.deepEqual(await response.json(), { success: true, accepted: false });
  assert.equal(f.stats.writes.length, 0);
  assert.equal(f.stats.mail.length, 0);
});

test('book email: replay and an existing subscription do not send another copy', async () => {
  const f = fixture();
  assert.equal((await f.request()).status, 200);
  assert.equal((await f.request()).status, 403);
  const duplicate = await f.request({ ...payload(), verification_token: 'new-valid-proof' });
  assert.equal(duplicate.status, 409);
  assert.equal((await duplicate.json()).status, 'already_subscribed');
  assert.equal(f.subscribers.length, 1);
  assert.equal(f.requests.length, 1);
  assert.equal(f.stats.mail.length, 1);
  assert.equal(f.stats.serviceCalls.filter(call => call.name === 'sendPublicationDeliveryEmail').length, 1);
});

for (const [label, options] of [
  ['provider rejection', { mailError: true }],
  ['helper invocation failure', { invokeError: true }],
  ['helper service authentication failure', { helperUser: null }],
  ['ignored helper response', { deliveryResult: { status: 'ignored' } }],
  ['unconfirmed helper response', { deliveryResult: {} }],
  ['error in a successful transport response', { deliveryResult: { error: 'Private provider diagnostic example.invalid' } }],
]) {
  test('book email: ' + label + ' preserves access, intake and tracking without a delivery claim', async () => {
    const f = fixture(options);
    const response = await f.request();
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.email_delivery_status, 'needs_attention');
    assert.equal(body.intake_status, 'saved');
    assert.equal(body.delivery_request_id, f.requests[0].id);
    assert.equal(body.book_tracking_token.split('.').length, 2);
    assert.equal('error' in body, false);
    assert.doesNotMatch(JSON.stringify(body), /Private|provider diagnostic|example\.invalid/);
    assert.doesNotMatch(f.stats.warnings.join(' '), /Private|provider diagnostic|example\.invalid/);
    assert.equal(f.stats.serviceCalls.filter(call => call.name === 'sendPublicationDeliveryEmail').length, 1);
    assert.deepEqual(f.stats.tracking, [{ book_key: 'ai-curious', event_type: 'access_request' }]);
    if (options.mailError) {
      assert.equal(f.requests[0].status, 'failed');
      assert.equal(f.requests[0].attempt_count, 1);
      assert.equal(f.stats.mail.length, 1);
    } else {
      assert.equal(f.requests[0].status, 'pending');
      assert.equal(f.stats.mail.length, 0);
    }
  });
}

test('book email: a separate intake failure does not erase provider acceptance or book access', async () => {
  const f = fixture({ intakeError: true });
  const response = await f.request();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.email_delivery_status, 'accepted');
  assert.equal(body.intake_status, 'needs_attention');
  assert.equal(body.book_tracking_token.split('.').length, 2);
  assert.equal(f.stats.mail.length, 1);
});

for (const [label, data] of [
  ['no requested delivery', { ...payload(), create_delivery_request: false }],
  ['Journal signup', { ...payload(), publication_tag: 'nta-journal', publication_title: 'The NTA Journal',
    delivery_url: '', create_delivery_request: false }],
]) {
  test('book email: ' + label + ' does not call the book delivery helper', async () => {
    const f = fixture();
    const response = await f.request(data);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.email_delivery_status, null);
    assert.equal(body.delivery_request_id, null);
    assert.equal(f.stats.mail.length, 0);
    assert.equal(f.stats.serviceCalls.some(call => call.name === 'sendPublicationDeliveryEmail'), false);
    if (label === 'Journal signup') assert.equal(body.journal_sync_status, 'synced');
  });
}

for (const [label, helperUser, expectedStatus] of [
  ['anonymous', null, 401],
  ['invalid session', new Error('invalid session'), 401],
  ['ordinary member', { role: 'user', is_service: false }, 403],
]) {
  test('book email helper: ' + label + ' is blocked despite forged privilege claims', async () => {
    const f = fixture({ helperUser });
    const response = await f.emailHandler(new Request('https://newtechadvertising.com/api/test', {
      method: 'POST',
      headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json', 'X-Is-Service': 'true' },
      body: JSON.stringify({ request_id: 'known-request', delivery_url: books[0][2], role: 'admin', is_service: true }),
    }));
    assert.equal(response.status, expectedStatus);
    assert.equal(f.stats.reads, 0);
    assert.equal(f.stats.writes.length, 0);
    assert.equal(f.stats.mail.length, 0);
  });
}

test('book email helper: an already accepted request is not sent again', async () => {
  const f = fixture();
  assert.equal((await f.request()).status, 200);
  const repeat = await f.emailHandler(new Request('https://internal.example.invalid/email', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: f.requests[0].id, delivery_url: books[0][2] }),
  }));
  assert.equal((await repeat.json()).status, 'ignored');
  assert.equal(f.stats.mail.length, 1);
  assert.equal(f.requests[0].attempt_count, 1);
});
