import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

// Keep this historical filename so the original coverage inventory is traceable.
// Most cases inspect source; one executes the actual scroll effect in a stub DOM.
// None proves real browser focus, microphone, consent, delivery or retry behavior.
test('homepage source preserves both visitor-chosen Guide entrances and their context', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const home = await read('src/pages/Home.jsx');
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  assert.match(home, /<HeroSection\s*\/>/);
  assert.match(hero, /to="\/growth-guide\?start=fresh"/);
  assert.match(hero, /What would you like to talk through\?/);
  assert.match(hero, /to="\/growth-conversation"/);
  assert.match(hero, /onClick=\{\(\) => openGrowthGuide\('homepage_question_paths'\)\}/);
  assert.match(hero, /dispatchEvent\(new CustomEvent\('nta:open-growth-guide'/);
  assert.match(hero, /detail: \{ source, question: 'I do not know what to fix first\.' \}/);
  assert.match(hero, /trackJourneyEvent\('question_growth_guide_opened'/);
  assert.match(guide, /addEventListener\('nta:open-growth-guide', openGuide\)/);
});

test('Guide source stays visitor-opened and preserves reachable named close and minimize controls', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  assert.doesNotMatch(guide, /nta_rick_welcome_seen/);
  assert.doesNotMatch(guide, /WELCOME_SEEN_KEY/);
  assert.match(guide, /\[isOpen, setIsOpen\] = useState\(false\)/);
  assert.match(guide, /\[showHomeWelcome, setShowHomeWelcome\] = useState\(false\)/);
  assert.match(guide, /setShowHomeWelcome\(false\)/);
  assert.match(guide, /sm:w-\[min\(680px,calc\(100vw-2\.5rem\)\)\]/);
  assert.match(guide, /onClick=\{\(\) => \{ stopGuideVoice\(\); cancelVoiceInput\(\); setIsOpen\(false\); \}\}[\s\S]*?aria-label="Close Your Digital Growth Guide"/);
  assert.match(guide, /onClick=\{\(\) => \{ stopGuideVoice\(\); cancelVoiceInput\(\); setIsAvatarMinimized\(true\); setIsOpen\(false\); \}\}[\s\S]*?aria-label="Minimize Your Digital Growth Guide"/);
});

test('mobile menu source retains keyboard exits and its actual scroll effect releases the lock', async () => {
  const nav = await read('src/components/nav/MarketingNav.jsx');
  assert.match(nav, /id="mobile-main-menu" role="dialog" aria-label="Website menu" aria-modal="true" onKeyDown=\{keepFocusInMobileMenu\}/);
  assert.match(nav, /if \(event\.key === 'Escape'\) \{\s*setMobileOpen\(false\);\s*setMobileExpanded\(null\);\s*mobileToggleRef\.current\?\.focus\(\)/);
  assert.match(nav, /const closeMobile = \(\) => \{\s*setMobileOpen\(false\);\s*setMobileExpanded\(null\);\s*mobileToggleRef\.current\?\.focus\(\)/);
  assert.match(nav, /onClick=\{closeMobile\}/);
  assert.match(nav, /event\.shiftKey && document\.activeElement === first/);
  assert.match(nav, /!event\.shiftKey && document\.activeElement === last/);
  assert.match(nav, /event\.preventDefault\(\);\s*last\.focus\(\)/);
  assert.match(nav, /event\.preventDefault\(\);\s*first\.focus\(\)/);
  const body = nav.match(/useEffect\(\(\) => \{\n(    if \(mobileOpen\) \{[\s\S]*?)\n  \}, \[mobileOpen\]\);/)?.[1];
  assert.ok(body, 'The actual mobile scroll effect must be located');
  const effect = vm.runInNewContext('(mobileOpen, document) => {\n' + body + '\n}', {}, { timeout: 1000 });
  const classes = new Set();
  const document = { body: { style: { overflow: '' }, classList: { add: value => classes.add(value), remove: value => classes.delete(value) } } };
  const cleanup = effect(true, document);
  assert.equal(document.body.style.overflow, 'hidden');
  assert.ok(classes.has('mobile-nav-open'));
  assert.equal(typeof cleanup, 'function');
  cleanup();
  assert.equal(document.body.style.overflow, '');
  assert.ok(!classes.has('mobile-nav-open'));
  document.body.style.overflow = 'hidden';
  classes.add('mobile-nav-open');
  effect(false, document);
  assert.equal(document.body.style.overflow, '');
  assert.ok(!classes.has('mobile-nav-open'));
});

test('Guide source retains verified response, visible fallback and retry affordances without a silent connect gate', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  assert.match(guide, /await invokeVerifiedPublicFunction\('growthGuideChat',/);
  assert.match(guide, /content: buildPublicKnowledgeFallback\(text\)/);
  assert.match(guide, /Retry AI response/);
  assert.match(guide, /const retryAIResponse = async/);
  assert.doesNotMatch(guide, /setAuthStep\('connect'\)/);
  // Presence is not retry correctness. The previously reported repeated-failure
  // concern remains open and needs a separate runtime test and repair decision.
});

test('public guide records and transcribes voice without silently sending it', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  const transcriber = await read('base44/functions/transcribeGrowthGuideVoice/entry.ts');
  assert.match(guide, /new MediaRecorder/);
  assert.match(guide, /siteFunctionUrl[\s\S]*transcribeGrowthGuideVoice/);
  assert.match(guide, /directFunctionUrl[\s\S]*transcribeGrowthGuideVoice/);
  assert.match(guide, /method: 'POST'/);
  assert.match(guide, /audio_base64/);
  assert.match(guide, /setInput\(nextInput\)/);
  assert.match(guide, /Ask about growth, websites, AI, trust, or your next step/);
  assert.doesNotMatch(guide, /onstop[\s\S]{0,2000}sendToAgent/);
  assert.match(transcriber, /api\.openai\.com/);
  assert.match(transcriber, /whisper-1/);
  assert.match(transcriber, /MAX_BASE64_LENGTH/);
});

test('public guide makes recording and fresh-session state visible', async () => {
  const guide = await read('src/components/nta-guide/YourDigitalGrowthGuide.jsx');
  assert.match(guide, /Start fresh/);
  assert.match(guide, /Recording ·/);
  assert.match(guide, /audioLevel/);
  assert.match(guide, /Transcript ready below/);
  assert.match(guide, /I’m not detecting sound/);
  assert.doesNotMatch(guide, /scrollQuickActions/);
});

test('the approved confirmation reminder appears beside the primary Guide entrance and preserves human authority', async () => {
  const hero = await read('src/components/home-conversion/HeroSection.jsx');
  const home = await read('src/pages/Home.jsx');
  const faq = await read('src/components/home-conversion/FAQSection.jsx');
  const reminder = 'We’ll confirm what we heard before recommending a next step. You stay in control of important decisions.';
  const position = hero.indexOf(reminder);
  assert.ok(position > hero.indexOf('to="/growth-guide?start=fresh"'));
  assert.ok(position >= 0 && position < hero.indexOf('Or choose a simple direction.'));
  assert.equal(hero.split(reminder).length - 1, 1);
  assert.match(home, /Owners and responsible people still approve important decisions and promises/);
  assert.match(faq, /We confirm what we heard before recommending a next step/);
});


// Exercise the actual voice handler in a network-free VM. Admin identity here is
// simulated so these checks never use a live Turnstile token or provider account.
function voiceFixture({ providerStatus = 200, providerBody = { text: 'A clear recorded thought.' }, configured = true } = {}) {
  const file = 'base44/functions/transcribeGrowthGuideVoice/entry.ts';
  const script = ts.transpileModule(voiceSource, {
    fileName: file,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  let handler;
  let providerCalls = 0;
  class VoiceTestFile extends Blob {
    constructor(parts, name, options) { super(parts, options); this.name = name; }
  }
  const context = {
    exports: {}, Request, Response, Headers, URL, AbortSignal, Blob, File: VoiceTestFile,
    FormData, Uint8Array, TextDecoder, ReadableStream, atob,
    console: { error() {}, log() {} },
    createClientFromRequest() { return { auth: { async me() { return { role: 'admin' }; } } }; },
    Deno: {
      serve(fn) { handler = fn; },
      env: { get(name) { return name === 'OPENAI_API_KEY' && configured ? 'unit-test-provider-key-not-real' : undefined; } },
    },
    async fetch(url) {
      assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions');
      providerCalls += 1;
      return Response.json(providerBody, { status: providerStatus });
    },
  };
  vm.runInNewContext(script, context);
  assert.equal(typeof handler, 'function');
  const audio = Buffer.alloc(1300, 7).toString('base64');
  const request = (payload = { audio_base64: audio, mime_type: 'audio/webm' }, headers = {}) =>
    new Request('https://newtechadvertising.com/api/voice', {
      method: 'POST',
      headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
    });
  return { handler, request, providerCalls: () => providerCalls };
}
const voiceSource = await read('base44/functions/transcribeGrowthGuideVoice/entry.ts');

test('voice handler rejects oversized declared request before reading or provider use', async () => {
  const fixture = voiceFixture();
  const response = await fixture.handler(fixture.request({}, { 'Content-Length': '9000000' }));
  const payload = await response.json();
  assert.equal(payload.diagnostic_code, 'AUDIO_TOO_LARGE');
  assert.equal(fixture.providerCalls(), 0);
  assert.ok(!('provider_message' in payload));
});

test('voice handler rejects a headerless streamed over-limit body before JSON parsing', async () => {
  const fixture = voiceFixture();
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(8_016_385)); controller.close(); },
  });
  const request = new Request('https://newtechadvertising.com/api/voice', {
    method: 'POST',
    headers: { Origin: 'https://newtechadvertising.com', 'Content-Type': 'application/json' },
    body: stream, duplex: 'half',
  });
  const response = await fixture.handler(request);
  assert.equal((await response.json()).diagnostic_code, 'AUDIO_TOO_LARGE');
  assert.equal(fixture.providerCalls(), 0);
});

test('voice handler never reveals provider errors, account state or internal messages', async () => {
  const sensitive = 'Internal provider debug sk-unit-test-only SECRET TRACE; Bearer not-for-public';
  for (const [status, expectedCode] of [[400, 'OPENAI_AUDIO_REJECTED'], [401, 'OPENAI_AUTH_FAILED'], [429, 'OPENAI_RATE_LIMITED'], [500, 'OPENAI_HTTP_500']]) {
    const fixture = voiceFixture({ providerStatus: status, providerBody: { error: { message: sensitive }, trace: sensitive } });
    const response = await fixture.handler(fixture.request());
    assert.equal(response.status, 200, 'existing voice envelope should remain stable');
    const body = await response.json();
    assert.equal(body.diagnostic_code, expectedCode);
    assert.equal(typeof body.error, 'string');
    assert.ok(!('provider_message' in body));
    assert.doesNotMatch(JSON.stringify(body), /Internal provider debug|TRACE|Bearer|SECRET|Base44 secret|sk-unit/);
    assert.equal(fixture.providerCalls(), 1);
  }
});

test('voice handler keeps transcript success and public-safe unconfigured response', async () => {
  const normal = voiceFixture();
  const response = await normal.handler(normal.request());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.transcript, 'A clear recorded thought.');
  assert.equal(normal.providerCalls(), 1);

  const missing = voiceFixture({ configured: false });
  const missingResponse = await missing.handler(missing.request());
  const unavailable = await missingResponse.json();
  assert.equal(unavailable.diagnostic_code, 'OPENAI_KEY_MISSING');
  assert.doesNotMatch(JSON.stringify(unavailable), /OPENAI_API_KEY|Add the|Base44 secret/);
  assert.equal(missing.providerCalls(), 0);
});

test('voice handler responds safely to invalid JSON and unsupported audio', async () => {
  const fixture = voiceFixture();
  const raw = new Request('https://newtechadvertising.com/api/voice', {
    method: 'POST',
    headers: { Origin: 'https://newtechadvertising.com' },
    body: 'not-json',
  });
  const invalid = await fixture.handler(raw);
  assert.equal((await invalid.json()).diagnostic_code, 'REQUEST_DECODING_FAILED');
  const unsupported = await fixture.handler(fixture.request({ audio_base64: '1234', mime_type: 'application/octet-stream' }));
  assert.equal((await unsupported.json()).diagnostic_code, 'AUDIO_FORMAT_UNSUPPORTED');
  assert.equal(fixture.providerCalls(), 0);
});
