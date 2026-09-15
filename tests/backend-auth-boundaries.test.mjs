import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const functionNames = ['adaIntake', 'auditWebsiteAccessibility', 'chatbotChat', 'chatbotLeadCapture', 'demoAiChat'];
const candidateRoot = process.env.NTA_AUTH_CANDIDATE_ROOT || process.cwd();

function loadHandler(name, authMode) {
  const file = path.join(candidateRoot, 'base44/functions', name, 'entry.ts');
  let source = readFileSync(file, 'utf8').replace(/^import[^\n]*\n/gm, '');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
  });
  assert.equal((compiled.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, name + ' syntax');
  let handler;
  let effects = 0;
  const context = {
    exports: {}, Request, Response, Headers, URL, AbortSignal, TextEncoder,
    console: { log() {}, warn() {}, error() {} },
    Deno: { serve(fn) { handler = fn; }, env: { get() { return undefined; } } },
    createClientFromRequest() {
      return {
        auth: { async me() {
          if (authMode instanceof Error) throw authMode;
          return authMode;
        } },
        get asServiceRole() { effects++; throw new Error('Unexpected privileged side effect'); },
      };
    },
    OpenAI: class { constructor() { effects++; throw new Error('Unexpected AI construction'); } },
    fetch() { effects++; throw new Error('Unexpected outbound network call'); },
    fetchPublicUrl() { effects++; throw new Error('Unexpected website scan'); },
    validatePublicHttpUrl() { effects++; throw new Error('Unexpected scan preparation'); },
  };
  vm.runInNewContext(compiled.outputText, context, { filename: file });
  assert.equal(typeof handler, 'function');
  return { handler, effectCount: () => effects };
}

for (const name of functionNames) {
  for (const [label, authMode, expected] of [
    ['anonymous', null, 401],
    ['invalid or expired credentials', new Error('invalid token'), 401],
    ['ordinary member', { id: 'member', role: 'user', is_service: false }, 403],
  ]) {
    test(name + ': rejects ' + label + ' even with forged website and privilege headers', async () => {
      const fixture = loadHandler(name, authMode);
      const response = await fixture.handler(new Request('https://newtechadvertising.com/api/test', {
        method: 'POST',
        headers: {
          Origin: 'https://newtechadvertising.com',
          Referer: 'https://newtechadvertising.com/',
          Authorization: 'Bearer attacker-supplied-value',
          'Base44-Service-Authorization': 'Bearer attacker-supplied-value',
          'X-Is-Service': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'admin', is_service: true, chatbot_id: 'existing-guide',
          name: 'Blocked request', business: 'Test', email: 'nobody@example.invalid',
          phone: '555-0100', city: 'Test', state: 'IA', selected_package: 'Starter',
          website_url: 'https://example.com', question: 'This must not reach AI',
        }),
      }));
      assert.equal(response.status, expected);
      assert.equal(fixture.effectCount(), 0);
    });
  }

  for (const [label, authMode] of [
    ['administrator', { id: 'admin', role: 'admin', is_service: false }],
    ['Base44 service identity', { is_service: true }],
  ]) {
    test(name + ': admits verified ' + label + ' to input validation without Origin', async () => {
      const fixture = loadHandler(name, authMode);
      const response = await fixture.handler(new Request('https://newtechadvertising.com/api/test', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
      }));
      assert.equal(response.status, name === 'chatbotLeadCapture' ? 200 : 400);
      if (name === 'chatbotLeadCapture') assert.equal((await response.json()).accepted, false);
      assert.equal(fixture.effectCount(), 0);
    });
  }

  test(name + ': method restriction never reaches privileged work', async () => {
    const fixture = loadHandler(name, null);
    const response = await fixture.handler(new Request('https://newtechadvertising.com/api/test'));
    assert.equal(response.status, 405);
    assert.equal(fixture.effectCount(), 0);
  });
}

function loadAccessibilityScanner(fetchImpl) {
  const file = path.join(candidateRoot, 'base44/functions/auditWebsiteAccessibility/entry.ts');
  const source = readFileSync(file, 'utf8').replace(/^import[^\n]*\n/gm, '');
  const context = {
    exports: {}, URL, Response, AbortSignal,
    console: { warn() {}, error() {} },
    Deno: { serve() {}, async resolveDns() { return ['93.184.216.34']; } },
    fetch: fetchImpl,
  };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return context;
}

test('accessibility scan keeps form label counts in scope', async () => {
  const context = loadAccessibilityScanner(async () => new Response('<html lang="en"><head><meta name="viewport"></head><body><main><h1>Test</h1><form><label for="name">Name</label><input id="name"></form><style>:focus{outline:1px solid}</style></main></body></html>'));
  const result = await context.performAccessibilityScan('https://example.com');
  assert.equal(result.formLabelIssues, false);
  assert.doesNotMatch(result.report, /could not be completed/);
});

test('accessibility scan rejects private targets before fetching', async () => {
  let fetches = 0;
  const context = loadAccessibilityScanner(async () => { fetches++; return new Response(''); });
  await assert.rejects(context.fetchPublicUrl('http://127.0.0.1/'));
  await assert.rejects(context.fetchPublicUrl('http://[::1]/'));
  assert.equal(fetches, 0);
});

test('accessibility scan rejects redirects to a private target', async () => {
  let fetches = 0;
  const context = loadAccessibilityScanner(async () => {
    fetches++;
    return new Response(null, { status: 302, headers: { Location: 'http://169.254.169.254/' } });
  });
  await assert.rejects(context.fetchPublicUrl('https://example.com'));
  assert.equal(fetches, 1);
});
