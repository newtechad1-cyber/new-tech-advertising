import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function fixture(options = {}) {
  const google = [];
  const base = [];
  const values = new Map();
  const listeners = new Map();
  const url = new URL(options.href || 'https://newtechadvertising.com/?utm_source=facebook&utm_medium=social&utm_campaign=november_2026');
  const context = vm.createContext({
    exports: {}, URL, URLSearchParams, Date, console: { warn() {} },
    location: { hostname: url.hostname, href: url.href, pathname: url.pathname },
    document: {
      referrer: options.referrer ?? 'https://www.facebook.com/?private=hidden',
      addEventListener(name, handler) { listeners.set(name, handler); },
      removeEventListener(name, handler) { if (listeners.get(name) === handler) listeners.delete(name); },
    },
    sessionStorage: {
      getItem(key) { if (options.storageBlocked) throw new Error('Storage disabled'); return values.get(key) || null; },
      setItem(key, value) { if (options.storageBlocked) throw new Error('Storage disabled'); values.set(key, value); },
    },
    base44: { analytics: { track(value) { base.push(value); if (options.baseThrows) throw new Error('Unavailable'); } } },
    gtag(...args) { google.push(args); if (options.googleThrows) throw new Error('Unavailable'); },
  });
  function load(path) {
    context.exports = {};
    const source = readFileSync(path, 'utf8').replace(/^import[^\n]*\n/gm, '');
    vm.runInContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
    return context.exports;
  }
  const attribution = load('src/lib/visitorAttribution.js');
  const tracking = load('src/lib/publicTracking.js');
  const journey = load('src/lib/journeyAnalytics.js');
  return {
    attribution, tracking, journey, google, base, values, listeners, context,
    go(href) { const next = new URL(href); context.location.href = next.href; context.location.pathname = next.pathname; context.location.hostname = next.hostname; },
  };
}

test('manual pageviews count once per navigation while internal journey records are preserved', () => {
  const f = fixture();
  const home = { navigationKey: 'home-1', pathname: '/', title: 'NTA' };
  assert.equal(f.tracking.trackPublicPageView(home), true);
  assert.equal(f.tracking.trackPublicPageView(home), false);
  f.journey.trackJourneyEvent('page_view', { route: '/', step: 'homepage' });
  assert.equal(f.google.length, 1);
  assert.equal(f.base.length, 1);
  f.go('https://newtechadvertising.com/regional-account-manager');
  f.tracking.trackPublicPageView({ navigationKey: 'regional-1', pathname: '/regional-account-manager', title: 'Opportunity' });
  f.journey.trackJourneyEvent('page_view', { route: '/regional-account-manager' });
  assert.equal(f.google.length, 2);
  assert.equal(f.base.length, 2);
  f.go('https://newtechadvertising.com/');
  f.tracking.trackPublicPageView({ ...home, navigationKey: 'home-2' });
  assert.equal(f.google.length, 3, 'A genuine return to the homepage is a new page view');
});

test('SPA pageviews report the previous public page and remove arbitrary query text', () => {
  const f = fixture({ href: 'https://newtechadvertising.com/?utm_source=facebook&email=private@example.invalid', referrer: 'https://search.example/results?q=private' });
  f.tracking.trackPublicPageView({ navigationKey: 'a', pathname: '/', title: 'NTA' });
  assert.equal(f.google[0][2].page_referrer, 'https://search.example');
  assert.equal(f.google[0][2].page_location, 'https://newtechadvertising.com/?utm_source=facebook');
  f.go('https://newtechadvertising.com/contact?message=private');
  f.tracking.trackPublicPageView({ navigationKey: 'b', pathname: '/contact', title: 'Contact' });
  assert.equal(f.google[1][2].page_referrer, 'https://newtechadvertising.com/?utm_source=facebook');
  assert.equal(f.google[1][2].page_location, 'https://newtechadvertising.com/contact');
});

test('preview and noindex routes do not produce public pageviews', () => {
  const preview = fixture({ href: 'https://preview-sandbox.example/contact' });
  assert.equal(preview.tracking.trackPublicPageView({ navigationKey: 'a', pathname: '/contact', title: 'Preview' }), false);
  const internal = fixture({ href: 'https://newtechadvertising.com/admin' });
  assert.equal(internal.tracking.trackPublicPageView({ navigationKey: 'a', pathname: '/admin', title: 'Admin', noIndex: true }), false);
  assert.equal(preview.google.length + internal.google.length, 0);
});

test('campaign and referrer survive untagged navigation into an inquiry without mutating the form', () => {
  const f = fixture();
  f.attribution.captureVisitorAttribution();
  f.go('https://newtechadvertising.com/contact');
  const payload = { submission_type: 'contact', notes: 'Private inquiry', raw_payload: { utm_source: '', content_topic: 'Practical AI' } };
  const prepared = f.attribution.withVisitorAttribution(payload);
  assert.equal(prepared.source_campaign, 'november_2026');
  assert.equal(prepared.raw_payload.utm_source, 'facebook');
  assert.equal(prepared.raw_payload.utm_medium, 'social');
  assert.equal(prepared.raw_payload.landing_page, 'https://newtechadvertising.com/');
  assert.equal(prepared.raw_payload.referrer, 'https://www.facebook.com');
  assert.equal(prepared.raw_payload.content_topic, 'Practical AI');
  assert.equal(prepared.notes, payload.notes);
  assert.equal(payload.raw_payload.utm_source, '');
  assert.equal('source_campaign' in payload, false);
});

test('new tagged visits replace the campaign as a unit and idle expiry removes the old campaign', () => {
  const f = fixture({ href: 'https://newtechadvertising.com/?utm_source=facebook&utm_campaign=november&utm_content=video_1' });
  const now = Date.now();
  f.attribution.captureVisitorAttribution(now);
  f.go('https://newtechadvertising.com/knowledge?utm_source=google&utm_medium=cpc');
  const next = f.attribution.captureVisitorAttribution(now + 100);
  assert.equal(next.utm_source, 'google');
  assert.equal(next.utm_campaign, undefined);
  assert.equal(next.utm_content, undefined);
  f.go('https://newtechadvertising.com/contact');
  const expired = f.attribution.captureVisitorAttribution(now + 31 * 60 * 1000);
  assert.equal(expired.utm_source, undefined);
  assert.equal(expired.landing_page, 'https://newtechadvertising.com/contact');
});

test('unsafe campaign labels and arbitrary URL fields are excluded', () => {
  const f = fixture({ href: 'https://newtechadvertising.com/contact?utm_source=private%40example.invalid&utm_medium=https%3A%2F%2Fexample.com&utm_campaign=641-420-8816&utm_content=video_2&email=private%40example.invalid' });
  const record = f.attribution.captureVisitorAttribution();
  assert.equal(record.utm_source, undefined);
  assert.equal(record.utm_medium, undefined);
  assert.equal(record.utm_campaign, undefined);
  assert.equal(record.utm_content, 'video_2');
  assert.equal(f.attribution.safePublicPageUrl(), 'https://newtechadvertising.com/contact?utm_content=video_2');
  assert.equal(f.attribution.safeReferrerOrigin('javascript:alert(1)'), '');
});

test('blocked or malformed session storage does not block forms', () => {
  for (const storageBlocked of [false, true]) {
    const f = fixture({ storageBlocked });
    f.values.set('nta_public_attribution_v1', '{broken JSON');
    assert.doesNotThrow(() => f.attribution.captureVisitorAttribution());
    f.go('https://newtechadvertising.com/contact');
    assert.equal(f.attribution.withVisitorAttribution({}).raw_payload.utm_source, 'facebook');
  }
});

test('contact and booking links count intent without recipient, message or destination details', () => {
  const f = fixture();
  const cleanup = f.tracking.installPublicIntentTracking();
  const links = [
    ['tel:+16414208816', 'contact_click', 'phone'],
    ['sms:+16414208816?body=Private%20question', 'contact_click', 'sms'],
    ['mailto:info@newtechadvertising.com?subject=Private', 'contact_click', 'email'],
    ['https://calendar.app.google/p6ieYanvwhixXxZ67', 'booking_click', undefined],
  ];
  for (const [href, eventName, method] of links) {
    const anchor = { getAttribute() { return href; } };
    f.listeners.get('click')({ target: { closest() { return anchor; } }, button: 0, isTrusted: true });
    const event = f.google.at(-1);
    assert.equal(event[1], eventName);
    assert.equal(event[2].interaction, 'intent');
    assert.equal(event[2].contact_method, method);
  }
  assert.equal(f.base.length, 4);
  assert.equal(f.google.length, 4);
  assert.doesNotMatch(JSON.stringify(f.google), /16414208816|Private|info@|p6ieYan/);
  cleanup();
  assert.equal(f.listeners.size, 0);
});

test('cancelled, synthetic and unrelated link clicks are ignored', () => {
  const f = fixture();
  f.tracking.installPublicIntentTracking();
  for (const extra of [{ defaultPrevented: true }, { isTrusted: false }, { button: 2 }]) {
    f.listeners.get('click')({ target: { closest() { return { getAttribute() { return 'tel:+15555555555'; } }; } }, ...extra });
  }
  assert.equal(f.tracking.contactIntentFromHref('https://calendar.app.google/not-the-booking-link'), null);
  assert.equal(f.tracking.contactIntentFromHref('/knowledge'), null);
  assert.equal(f.google.length, 0);
});

test('analytics failures never prevent navigation or another destination from recording', () => {
  for (const options of [{ baseThrows: true }, { googleThrows: true }]) {
    const f = fixture(options);
    f.tracking.installPublicIntentTracking();
    assert.doesNotThrow(() => f.listeners.get('click')({ target: { closest() { return { getAttribute() { return 'mailto:info@newtechadvertising.com'; } }; } }, button: 0 }));
    assert.equal(f.base.length, 1);
    assert.equal(f.google.length, 1);
    assert.doesNotThrow(() => f.journey.trackJourneyEvent('question_path_opened', { source: 'homepage' }));
  }
});

test('Back to the same public history key after an excluded route records a fresh visit', () => {
  const f = fixture();
  const home = { navigationKey: 'home-1', pathname: '/', title: 'NTA' };
  f.tracking.trackPublicPageView(home);
  f.go('https://newtechadvertising.com/missing-page');
  f.tracking.trackPublicPageView({ navigationKey: 'missing-1', pathname: '/missing-page', title: 'Not found', noIndex: true });
  assert.equal(f.google.length, 1);
  f.go('https://newtechadvertising.com/');
  assert.equal(f.tracking.trackPublicPageView(home), true);
  assert.equal(f.google.length, 2);
});

test('all custom GA event paths receive sanitized location and referrer context', () => {
  const f = fixture({ href: 'https://newtechadvertising.com/contact?email=private@example.invalid&utm_source=facebook', referrer: 'https://search.example/?q=private_message' });
  f.tracking.trackPublicPageView({ navigationKey: 'a', pathname: '/contact', title: 'Contact' });
  f.journey.trackJourneyEvent('question_path_opened', { source: 'homepage' });
  f.tracking.installPublicIntentTracking();
  f.listeners.get('click')({ target: { closest() { return { getAttribute() { return 'mailto:info@newtechadvertising.com?subject=private_message'; } }; } } });
  for (const event of f.google) {
    assert.equal(event[2].page_location, 'https://newtechadvertising.com/contact?utm_source=facebook');
    assert.equal(event[2].page_referrer, 'https://search.example');
  }
  assert.doesNotMatch(JSON.stringify(f.google), /private|email=/);
});

test('direct first visits keep an empty referrer and path normalization never changes the public origin', () => {
  const f = fixture({ href: 'https://newtechadvertising.com/contact', referrer: '' });
  f.tracking.trackPublicPageView({ navigationKey: 'direct', pathname: '/contact', title: 'Contact' });
  assert.equal(f.google[0][2].page_referrer, '');
  assert.equal(f.attribution.safePublicPageUrl(''), '');
  assert.equal(f.attribution.safePublicPageUrl('https://newtechadvertising.com//example.com/path'), 'https://newtechadvertising.com//example.com/path');
});
