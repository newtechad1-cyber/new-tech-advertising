import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function setup(mode = 'success', options = {}) {
  const requests = [];
  const analytics = [];
  const google = [];
  const dialogs = [];
  const widgets = new Map();
  let sequence = 0;
  class Element {
    constructor(tag) { this.tag = tag; this.style = {}; this.children = []; this.listeners = {}; this.isConnected = true; this.open = false; }
    setAttribute() {}
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    showModal() { this.open = true; dialogs.push(this); }
    close() { this.open = false; }
    remove() { this.isConnected = false; }
    focus() {}
  }
  const document = {
    referrer: options.referrer || '',
    activeElement: new Element('button'), body: new Element('body'), head: new Element('head'),
    createElement(tag) { return new Element(tag); },
  };
  const turnstile = {
    render(holder, options) { const id = String(++sequence); widgets.set(id, options); return id; },
    execute(id) {
      queueMicrotask(() => {
        if (mode === 'cancel') dialogs.at(-1).children.at(-1).listeners.click();
        else if (mode === 'failure') widgets.get(id)['error-callback']();
        else widgets.get(id).callback('single-use-token-' + id);
      });
    },
    remove(id) { widgets.delete(id); },
  };
  const source = readFileSync('src/lib/publicVerification.js', 'utf8')
    .replace(/^import[^\n]*\n/gm, '');
  const exports = {};
  const stored = new Map();
  if (options.attributionRecord) stored.set('nta_public_attribution_v1', JSON.stringify(options.attributionRecord));
  const context = vm.createContext({
    exports: {}, URL, URLSearchParams, document, window: { turnstile, setTimeout, clearTimeout },
    sessionStorage: { getItem: key => stored.get(key) || null, setItem: (key, value) => stored.set(key, value) },
    location: { hostname: options.hostname || 'newtechadvertising.com', href: options.href || 'https://newtechadvertising.com/contact' },
    gtag: (...args) => { google.push(args); if (options.googleThrows) throw new Error('Unavailable'); },
    base44: { analytics: { track(event) {
      analytics.push(event);
      if (options.analyticsThrows) throw new Error('Unavailable');
      if (options.analyticsRejects) return Promise.reject(new Error('Unavailable'));
    } }, functions: { async invoke(name, payload) {
      requests.push({ name, payload });
      if (payload.verification_config) {
        return { data: {
          site_key: '0x-unit-test-public-site-key',
          action: mode === 'wrong_action' ? 'unexpected_action' :
            ({ growthGuideChat: 'growth_guide_chat', publicationSignup: 'publication_signup', ntaUnifiedIntake: 'nta_unified_intake', startDiscoverySession: 'start_discovery_session', submitPublicTrialSignup: 'trial_signup', submitRecruitingApplication: 'recruiting_application' })[name],
        } };
      }
      return { data: options.result ?? (mode === 'not_accepted' ? { success: true, accepted: false } : { success: true }) };
    } } },
  });
  const compile = code => ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInContext(compile(readFileSync('src/lib/visitorAttribution.js', 'utf8')), context);
  context.exports = exports;
  vm.runInContext(compile(source), context);
  return { invoke: exports.invokeVerifiedPublicFunction, requests, dialogs, widgets, analytics, google };
}

test('public client attaches distinct fresh tokens to concurrent submissions', async () => {
  const fixture = setup();
  await Promise.all([
    fixture.invoke('growthGuideChat', { messages: [{ role: 'user', content: 'One' }] }),
    fixture.invoke('growthGuideChat', { messages: [{ role: 'user', content: 'Two' }] }),
  ]);
  const mutations = fixture.requests.filter(r => !r.payload.verification_config);
  assert.equal(mutations.length, 2);
  assert.notEqual(mutations[0].payload.verification_token, mutations[1].payload.verification_token);
  assert.equal(fixture.widgets.size, 0);
  assert.ok(fixture.dialogs.every(d => !d.isConnected));
});

for (const mode of ['cancel', 'failure', 'wrong_action']) {
  test('public client: ' + mode + ' prevents submission', async () => {
    const fixture = setup(mode);
    await assert.rejects(fixture.invoke('publicationSignup', { email: 'unit-test@example.invalid', consent: true }));
    assert.equal(fixture.requests.filter(r => !r.payload.verification_config).length, 0);
    assert.equal(fixture.widgets.size, 0);
    assert.ok(fixture.dialogs.every(d => !d.isConnected));
  });
}

test('public client does not allow arbitrary function names', async () => {
  const fixture = setup();
  await assert.rejects(fixture.invoke('deleteCustomer', {}));
  assert.equal(fixture.requests.length, 0);
});

test('public client preserves payload and never exposes a shared secret', async () => {
  const fixture = setup();
  const payload = { email: 'unit-test@example.invalid', consent: true, publication_tag: 'nta-journal' };
  await fixture.invoke('publicationSignup', payload);
  const sent = fixture.requests.find(r => !r.payload.verification_config).payload;
  assert.equal(sent.email, payload.email);
  assert.equal(sent.consent, true);
  assert.equal(typeof sent.verification_token, 'string');
  assert.equal('secret' in sent, false);
  assert.equal('verification_token' in payload, false);
});

test('public client: intake obtains proof before submitting contact details', async () => {
  const fixture = setup();
  await fixture.invoke('ntaUnifiedIntake', { email: 'unit-test@example.invalid', submission_type: 'contact' });
  assert.equal(fixture.requests.length, 2);
  assert.equal(fixture.requests[0].payload.verification_config, true);
  assert.equal(Object.keys(fixture.requests[0].payload).length, 1);
  const submitted = fixture.requests[1];
  assert.equal(submitted.name, 'ntaUnifiedIntake');
  assert.equal(submitted.payload.submission_type, 'contact');
  assert.equal(submitted.payload.email, 'unit-test@example.invalid');
  assert.equal(typeof submitted.payload.verification_token, 'string');
});

test('public client: intake and publication never reuse the same provider token', async () => {
  const fixture = setup();
  await Promise.all([
    fixture.invoke('ntaUnifiedIntake', { email: 'unit-test@example.invalid' }),
    fixture.invoke('publicationSignup', { email: 'unit-test@example.invalid', consent: true }),
  ]);
  const submissions = fixture.requests.filter(request => !request.payload.verification_config);
  assert.equal(submissions.length, 2);
  assert.notEqual(submissions[0].payload.verification_token, submissions[1].payload.verification_token);
  assert.equal(fixture.widgets.size, 0);
});

for (const name of ['startDiscoverySession', 'submitPublicTrialSignup', 'submitRecruitingApplication']) {
  test('public client verifies ' + name + ' and cancels without a write', async () => {
    const fixture = setup();
    await fixture.invoke(name, { mode: 'mixed' });
    assert.equal(fixture.requests.filter(r => !r.payload.verification_config).length, 1);
    const cancelled = setup('cancel');
    await assert.rejects(cancelled.invoke(name, { mode: 'mixed' }));
    assert.equal(cancelled.requests.filter(r => !r.payload.verification_config).length, 0);
  });
}


test('saved inquiry measurement excludes customer details and deduplicates confirmed IDs', async () => {
  const fixture = setup('success', { result: { success: true, submission_id: 'saved-123' } });
  const payload = { submission_type: 'contact', name: 'Private Name', email: 'private@example.invalid',
    phone: '5551234567', notes: 'Private message', source_url: '/?email=private@example.invalid' };
  await fixture.invoke('ntaUnifiedIntake', payload);
  await fixture.invoke('ntaUnifiedIntake', payload);
  assert.equal(fixture.analytics.length, 1);
  assert.equal(fixture.google.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(fixture.analytics[0])), {
    eventName: 'inquiry_saved', properties: { form_type: 'contact', site_surface: 'public' },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(fixture.google[0])), [
    'event', 'inquiry_saved', { page_location: 'https://newtechadvertising.com/contact', page_referrer: '', form_type: 'contact', site_surface: 'public' },
  ]);
});

for (const result of [{ success: true }, { submission_id: 'saved-1' }, { success: true, submission_id: '' }]) {
  test('uncertain save response is not counted: ' + JSON.stringify(result), async () => {
    const fixture = setup('success', { result });
    await fixture.invoke('ntaUnifiedIntake', {});
    assert.equal(fixture.analytics.length, 0);
    assert.equal(fixture.google.length, 0);
  });
}

test('rejected, non-intake and private or preview requests never count as public inquiries', async () => {
  const rejected = setup('not_accepted');
  await assert.rejects(rejected.invoke('ntaUnifiedIntake', {}));
  assert.equal(rejected.analytics.length, 0);
  for (const hostname of ['app.newtechadvertising.com', 'preview.base44.com']) {
    const fixture = setup('success', { hostname, result: { success: true, submission_id: 'saved-1' } });
    await fixture.invoke('ntaUnifiedIntake', {});
    assert.equal(fixture.analytics.length, 0);
  }
  const other = setup('success', { result: { success: true, submission_id: 'saved-1' } });
  await other.invoke('publicationSignup', {});
  assert.equal(other.analytics.length, 0);
});

test('unknown form types cannot send arbitrary text to measurement', async () => {
  const fixture = setup('success', { result: { success: true, submission_id: 'saved-1' } });
  await fixture.invoke('ntaUnifiedIntake', { submission_type: 'private@example.invalid' });
  assert.equal(fixture.analytics[0].properties.form_type, 'other_inquiry');
});

for (const option of ['analyticsThrows', 'analyticsRejects', 'googleThrows']) {
  test(option + ' does not interrupt a saved inquiry', async () => {
    const fixture = setup('success', { [option]: true, result: { success: true, submission_id: 'saved-1' } });
    const response = await fixture.invoke('ntaUnifiedIntake', { submission_type: 'contact' });
    assert.equal(response.data.submission_id, 'saved-1');
    assert.equal(fixture.analytics.length, 1);
    assert.equal(fixture.google.length, 1);
    await new Promise(resolve => setImmediate(resolve));
  });
}

test('public client never shows success when the server declines a submission', async () => {
  const fixture = setup('not_accepted');
  await assert.rejects(fixture.invoke('ntaUnifiedIntake', {}), /not accepted/);
  assert.equal(fixture.requests.filter(r => !r.payload.verification_config).length, 1);
});

test('Journal subscription counts only a confirmed subscriber once and never includes personal details', async () => {
  const fixture = setup('success', { result: { success: true, subscriber_id: 'subscriber-1' } });
  const payload = { publication_tag: 'nta-journal', consent: true, email: 'private@example.invalid', name: 'Private Name' };
  await fixture.invoke('publicationSignup', payload);
  await fixture.invoke('publicationSignup', payload);
  assert.equal(fixture.google.length, 1);
  assert.equal(fixture.analytics.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(fixture.google[0])), [
    'event', 'journal_subscription_saved', { page_location: 'https://newtechadvertising.com/contact', page_referrer: '', publication: 'nta-journal', site_surface: 'public' },
  ]);
  assert.doesNotMatch(JSON.stringify(fixture.google), /subscriber-1|Private|private@/);
});

test('uncertain, rejected, duplicate and non-Journal publication responses never count a new Journal subscription', async () => {
  for (const result of [
    { success: true }, { subscriber_id: 'subscriber-1' },
    { success: true, subscriber_id: '' }, { success: true, accepted: false, subscriber_id: 'subscriber-1' },
    { success: false, status: 'already_subscribed', subscriber_id: 'subscriber-1' },
  ]) {
    const fixture = setup('success', { result });
    await fixture.invoke('publicationSignup', { publication_tag: 'nta-journal' }).catch(() => {});
    assert.equal(fixture.google.length, 0);
  }
  const book = setup('success', { result: { success: true, subscriber_id: 'subscriber-1' } });
  await book.invoke('publicationSignup', { publication_tag: 'practical-ai' });
  assert.equal(book.google.length, 0);
  const preview = setup('success', { hostname: 'preview.example', result: { success: true, subscriber_id: 'subscriber-1' } });
  await preview.invoke('publicationSignup', { publication_tag: 'nta-journal' });
  assert.equal(preview.google.length, 0);
});

test('shared verified wrapper carries safe source information for both intake and publication requests', async () => {
  for (const name of ['ntaUnifiedIntake', 'publicationSignup']) {
    const fixture = setup('success', { href: 'https://newtechadvertising.com/contact?utm_source=facebook&utm_campaign=november&email=private@example.invalid', referrer: 'https://www.facebook.com/?private=hidden' });
    await fixture.invoke(name, { email: 'private@example.invalid', notes: 'Private inquiry' });
    const sent = fixture.requests.find(request => !request.payload.verification_config).payload;
    assert.equal(sent.source_campaign, 'november');
    assert.equal(sent.raw_payload.utm_source, 'facebook');
    assert.equal(sent.raw_payload.referrer, 'https://www.facebook.com');
    assert.doesNotMatch(sent.source_url, /private|email=/);
    assert.equal(sent.email, 'private@example.invalid', 'Private contact details remain in the actual submission, not analytics');
  }
});

test('Journal analytics failures do not turn a saved subscription into a failed submission', async () => {
  const fixture = setup('success', { analyticsThrows: true, googleThrows: true, result: { success: true, subscriber_id: 'subscriber-1' } });
  const result = await fixture.invoke('publicationSignup', { publication_tag: 'nta-journal' });
  assert.equal(result.data.success, true);
  assert.equal(fixture.analytics.length, 1);
  assert.equal(fixture.google.length, 1);
});

test('saved inquiry and Journal events never fall back to unsanitized page/referrer defaults', async () => {
  for (const [name, payload, result] of [
    ['ntaUnifiedIntake', { submission_type: 'contact' }, { success: true, submission_id: 'submission-privacy' }],
    ['publicationSignup', { publication_tag: 'nta-journal' }, { success: true, subscriber_id: 'subscriber-privacy' }],
  ]) {
    const fixture = setup('success', { result, href: 'https://newtechadvertising.com/contact?email=private@example.invalid', referrer: 'https://search.example/?q=private_message' });
    await fixture.invoke(name, payload);
    assert.equal(fixture.google[0][2].page_location, 'https://newtechadvertising.com/contact');
    assert.equal(fixture.google[0][2].page_referrer, 'https://search.example');
    assert.doesNotMatch(JSON.stringify(fixture.google), /private|email=/);
  }
});

test('a corrupt stored attribution date cannot block an inquiry or Journal subscription', async () => {
  for (const name of ['ntaUnifiedIntake', 'publicationSignup']) {
    const fixture = setup('success', { attributionRecord: { version: 1, updated_at: Date.now(), captured_at: 1e100, landing_page: 'https://newtechadvertising.com/', referrer: '' } });
    const response = await fixture.invoke(name, { email: 'unit-test@example.invalid', consent: true });
    assert.equal(response.data.success, true);
    assert.equal(fixture.requests.filter(request => !request.payload.verification_config).length, 1);
  }
});


// Exercise the real app-params module in a browser-like context. Replacing only
// the build-time import.meta.env syntax lets us test exact URL/storage behavior
// without touching Base44, a browser profile, or production sessions.
function appParamsFixture({
  hostname = 'newtechadvertising.com',
  query = '',
  persisted = {},
  backendUrl = 'https://trusted-base44-api.example',
  configuredAppId = 'editor-build-app',
} = {}) {
  const storage = new Map(Object.entries(persisted));
  const historyCalls = [];
  const location = {
    hostname, pathname: '/contact', hash: '#contact', search: query,
    href: 'https://' + hostname + '/contact' + query + '#contact',
  };
  const window = {
    location,
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, String(value)); },
      removeItem(key) { storage.delete(key); },
    },
    history: {
      replaceState(state, title, next) {
        historyCalls.push(next);
        const url = new URL(next, location.href);
        location.hostname = url.hostname;
        location.pathname = url.pathname;
        location.hash = url.hash;
        location.search = url.search;
        location.href = url.href;
      },
    },
  };
  const context = vm.createContext({
    window,
    document: { title: 'NTA' },
    URL, URLSearchParams,
    testEnv: { VITE_BASE44_APP_ID: configuredAppId, VITE_BASE44_BACKEND_URL: backendUrl },
  });
  const source = readFileSync('src/lib/app-params.js', 'utf8')
    .replaceAll('import.meta.env', 'testEnv')
    .replace('export const appParams =', 'const appParams =')
    + '\nthis.testAppParams = appParams;';
  vm.runInContext(source, context);
  return { params: context.testAppParams, storage, historyCalls, location };
}

for (const hostname of ['newtechadvertising.com', 'www.newtechadvertising.com', 'new-tech-advertising.base44.app']) {
  test('public app config on ' + hostname + ' ignores URL and stored API identity overrides', () => {
    const fixture = appParamsFixture({
      hostname,
      query: '?app_id=evil-app&server_url=https%3A%2F%2Fevil.example&functions_version=evil-v&ctx=valid-handle&utm_source=facebook',
      persisted: {
        base44_app_id: 'stored-evil',
        base44_server_url: 'https://stored-evil.example',
        base44_access_token: 'stored-token',
        base44_functions_version: 'stored-v',
      },
    });
    assert.equal(fixture.params.appId, '691f41a18de4a7f498c8f884');
    assert.equal(fixture.params.serverUrl, 'https://trusted-base44-api.example');
    assert.equal(fixture.params.token, 'stored-token', 'legitimate SDK session retained');
    assert.equal(fixture.params.functionsVersion, null);
    for (const key of ['base44_app_id', 'base44_server_url', 'base44_functions_version']) {
      assert.equal(fixture.storage.has(key), false, 'legacy override not cleared: ' + key);
    }
    for (const key of ['app_id', 'server_url', 'functions_version']) {
      assert.equal(new URLSearchParams(fixture.location.search).has(key), false, 'unsafe public URL param persisted: ' + key);
    }
    assert.equal(new URLSearchParams(fixture.location.search).get('ctx'), 'valid-handle');
    assert.equal(new URLSearchParams(fixture.location.search).get('utm_source'), 'facebook');
    assert.equal(fixture.historyCalls.length, 1);
  });
}

test('public site ignores legacy routing overrides even without suspicious URL fields', () => {
  const fixture = appParamsFixture({
    query: '?utm_campaign=november',
    persisted: {
      base44_app_id: 'bad-app', base44_server_url: 'https://evil.example',
      base44_access_token: 'existing-login-token', base44_functions_version: 'bad-v',
    },
    configuredAppId: undefined,
    backendUrl: '',
  });
  assert.equal(fixture.params.appId, '691f41a18de4a7f498c8f884');
  assert.equal(fixture.params.serverUrl, undefined, 'SDK default is allowed when build URL is absent');
  assert.equal(fixture.params.token, 'existing-login-token', 'legitimate session remains intact');
  assert.equal(fixture.params.functionsVersion, null);
  assert.equal(fixture.historyCalls.length, 0);
  assert.equal(fixture.storage.has('base44_access_token'), true, 'existing SDK login is not deleted');
});


test('public login callback is accepted only for the pinned Base44 app and its URL token is scrubbed', () => {
  const f = appParamsFixture({
    hostname: 'newtechadvertising.com',
    query: '?access_token=returned-by-base44&server_url=https%3A%2F%2Fevil.example&app_id=evil-app&ctx=valid-handle',
  });
  assert.equal(f.params.appId, '691f41a18de4a7f498c8f884');
  assert.equal(f.params.serverUrl, 'https://trusted-base44-api.example');
  assert.equal(f.params.token, 'returned-by-base44', 'existing platform sign-in callback preserved');
  assert.equal(f.storage.get('base44_access_token'), 'returned-by-base44');
  assert.equal(f.params.functionsVersion, null);
  assert.equal(new URLSearchParams(f.location.search).has('access_token'), false, 'bearer removed from address');
  assert.equal(new URLSearchParams(f.location.search).has('server_url'), false);
  assert.equal(new URLSearchParams(f.location.search).get('ctx'), 'valid-handle');
});

test('Base44 editor and sandbox preview preserve intentional version and app parameters', () => {
  const preview = appParamsFixture({
    hostname: 'preview.base44.dev',
    query: '?app_id=preview-id&server_url=https%3A%2F%2Fpreview-api.example&access_token=preview-token&functions_version=branch-v',
  });
  assert.equal(preview.params.appId, 'preview-id');
  assert.equal(preview.params.serverUrl, 'https://preview-api.example');
  assert.equal(preview.params.token, 'preview-token');
  assert.equal(preview.params.functionsVersion, 'branch-v');
  assert.equal(preview.storage.get('base44_access_token'), 'preview-token');
  assert.equal(new URLSearchParams(preview.location.search).has('access_token'), false, 'legacy URL secret stripping preserved');

  const core = appParamsFixture({ hostname: 'app.newtechadvertising.com', query: '?app_id=separate-core-id' });
  assert.equal(core.params.appId, 'separate-core-id', 'never rebind an unrelated Core app');
});

test('the public SDK client still uses the locked app-params module', () => {
  const sdk = readFileSync('src/api/base44Client.js', 'utf8');
  assert.match(sdk, /from ['"]@\/lib\/app-params['"]/);
  assert.match(sdk, /createClient\(\{\s*appId,\s*serverUrl,\s*token,\s*functionsVersion,/);
});


// Exercise the real rebuild form handler with fictional data and a mocked intake.
// The synthetic visitor details must never reach the browser console, even when
// an upstream exception includes one of those details.
function rebuildIntakeFixture(mode = 'success', overrides = {}) {
  const visitor = {
    name: 'Synthetic Privacy Visitor',
    email: 'privacy-check@example.invalid',
    phone: '555-010-9384',
    business_name: 'Synthetic Privacy Company',
    website: 'https://privacy-check.example.invalid',
    city: 'Testville',
    state: 'IA',
    industry: 'Synthetic industry',
    service_type: 'website_rebuild',
    page_count: '11–20',
    notes: 'Synthetic confidential project details',
    ...overrides,
  };
  const requests = [];
  const logs = [];
  const notices = [];
  const changes = [];
  let stateIndex = 0;
  const useState = initial => {
    const index = stateIndex++;
    const value = index === 2 ? visitor : typeof initial === 'function' ? initial() : initial;
    return [value, next => changes.push({ index, value: next })];
  };
  const node = (type, props) => ({ type, props: props || {} });
  const generic = new Proxy({ __esModule: true, default: 'Stub' }, {
    get(target, key) { return key in target ? target[key] : 'Stub'; },
  });
  const requireStub = id => {
    if (id === 'react/jsx-runtime') return { jsx: node, jsxs: node, Fragment: 'Fragment' };
    if (id === 'react') return { useState };
    if (id === 'react-router-dom') return { Link: 'Link' };
    if (id === '@/utils') return { createPageUrl: () => '/' };
    if (id === 'sonner') return { toast: { error: text => notices.push(text) } };
    if (id === '@/lib/publicVerification') return {
      async invokeVerifiedPublicFunction(name, payload) {
        requests.push({ name, payload });
        if (mode === 'exception') throw new Error('Upstream issue for ' + visitor.email);
        if (mode === 'failure') return { data: { success: false, error: 'Failure for ' + visitor.email } };
        return { data: { success: true } };
      },
    };
    return generic;
  };
  const source = readFileSync('src/pages/Rebuild-Intake.jsx', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
    reportDiagnostics: true,
  });
  assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  const exports = {};
  vm.runInNewContext(compiled.outputText, {
    exports, require: requireStub, URLSearchParams,
    window: { location: { search: '?source=synthetic-test', href: 'https://example.invalid/rebuild-intake?source=synthetic-test' } },
    console: Object.fromEntries(['log', 'warn', 'error', 'info', 'debug'].map(level => [
      level, (...args) => logs.push(args),
    ])),
  });
  function findForm(value) {
    if (!value) return null;
    if (Array.isArray(value)) {
      for (const child of value) {
        const found = findForm(child);
        if (found) return found;
      }
      return null;
    }
    if (typeof value !== 'object') return null;
    if (value.type === 'form') return value;
    return findForm(value.props?.children);
  }
  const formElement = findForm(exports.default());
  assert.ok(formElement && typeof formElement.props.onSubmit === 'function');
  const submit = async () => formElement.props.onSubmit({ preventDefault() {} });
  const logText = () => logs.flat().map(value => {
    if (value instanceof Error) return value.message;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }).join(' ');
  return { visitor, requests, logs, notices, changes, submit, logText };
}

function assertRebuildVisitorNotLogged(fixture) {
  const output = fixture.logText();
  for (const field of ['name', 'email', 'phone', 'business_name', 'website', 'notes']) {
    if (fixture.visitor[field]) assert.equal(output.includes(fixture.visitor[field]), false, field + ' reached browser console');
  }
}

test('rebuild form sends the expected request and keeps visitor details out of console on success', async () => {
  const fixture = rebuildIntakeFixture();
  await fixture.submit();
  assert.equal(fixture.requests.length, 1);
  assert.equal(fixture.requests[0].name, 'ntaUnifiedIntake');
  assert.equal(fixture.requests[0].payload.name, fixture.visitor.name);
  assert.equal(fixture.requests[0].payload.email, fixture.visitor.email);
  assert.equal(fixture.requests[0].payload.phone, fixture.visitor.phone);
  assert.equal(fixture.requests[0].payload.business_name, fixture.visitor.business_name);
  assert.ok(fixture.requests[0].payload.notes.includes(fixture.visitor.notes));
  assert.equal(fixture.requests[0].payload.source_page, 'synthetic-test');
  assert.ok(fixture.changes.some(change => change.index === 0 && change.value === 2));
  assert.deepEqual(fixture.changes.filter(change => change.index === 1).map(change => change.value), [true, false]);
  assert.equal(fixture.notices.length, 0);
  assertRebuildVisitorNotLogged(fixture);
});

for (const mode of ['exception', 'failure']) {
  test('rebuild form handles ' + mode + ' without exposing visitor details in console', async () => {
    const fixture = rebuildIntakeFixture(mode);
    await fixture.submit();
    assert.equal(fixture.requests.length, 1);
    assert.equal(fixture.notices.length, 1);
    assert.match(fixture.notices[0], /Something went wrong/);
    assert.equal(fixture.changes.some(change => change.index === 0 && change.value === 2), false);
    assert.deepEqual(fixture.changes.filter(change => change.index === 1).map(change => change.value), [true, false]);
    assertRebuildVisitorNotLogged(fixture);
  });
}

test('rebuild form still rejects an incomplete request before sending', async () => {
  const fixture = rebuildIntakeFixture('success', { phone: '' });
  await fixture.submit();
  assert.equal(fixture.requests.length, 0);
  assert.equal(fixture.notices.length, 1);
  assert.match(fixture.notices[0], /required fields/);
  assertRebuildVisitorNotLogged(fixture);
});
