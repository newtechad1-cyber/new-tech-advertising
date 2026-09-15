import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function setup(mode = 'success') {
  const requests = [];
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
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports, document, window: { turnstile, setTimeout, clearTimeout },
    base44: { functions: { async invoke(name, payload) {
      requests.push({ name, payload });
      if (payload.verification_config) {
        return { data: {
          site_key: '0x-unit-test-public-site-key',
          action: mode === 'wrong_action' ? 'unexpected_action' :
            ({ growthGuideChat: 'growth_guide_chat', publicationSignup: 'publication_signup', ntaUnifiedIntake: 'nta_unified_intake' })[name],
        } };
      }
      return { data: { success: true } };
    } } },
  });
  return { invoke: exports.invokeVerifiedPublicFunction, requests, dialogs, widgets };
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
