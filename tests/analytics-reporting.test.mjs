import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const ADMIN = { id: 'verified-admin', role: 'admin' };
const CREDENTIAL = JSON.stringify({ type: 'service_account', client_email: 'reporter@example.invalid', private_key: '-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----' });
const NOW = Date.parse('2026-11-02T15:00:00Z');
class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : [NOW])); } static now() { return NOW; } }

function gaReport(body, values = {}, rows = null) {
  const metrics = body.metrics.map(item => item.name);
  const dimensions = body.dimensions.map(item => item.name);
  const totals = { screenPageViews: 360, totalUsers: 120, activeUsers: 110, sessions: 180, bounceRate: 0.13, keyEvents: 7 };
  const defaultRows = dimensions.length === 0 ? [{}] : dimensions[0] === 'date' ? [{ date: '20261030', totalUsers: 100, screenPageViews: 180, sessions: 90, keyEvents: 3 }, { date: '20261101', totalUsers: 100, screenPageViews: 180, sessions: 90, keyEvents: 4 }] : dimensions[0] === 'eventName' ? [{ eventName: 'generate_lead', eventCount: 7, keyEvents: 7 }] : [{ sessionSourceMedium: body.dimensionFilter ? 'chatgpt.com / referral' : 'google / organic', sessionCampaignName: 'november_teaching', sessions: 12, keyEvents: 2 }];
  return { dimensionHeaders: dimensions.map(name => ({ name })), metricHeaders: metrics.map(name => ({ name, type: 'TYPE_FLOAT' })), metadata: { timeZone: 'America/Chicago' }, rowCount: (rows || defaultRows).length, rows: (rows || defaultRows).map(row => ({ dimensionValues: dimensions.map(name => ({ value: row[name] || '(not set)' })), metricValues: metrics.map(name => ({ value: String(row[name] ?? values[name] ?? totals[name] ?? 0) })) })) };
}

function fixture(name, { user = ADMIN, authError = false, env = {}, fetcher } = {}) {
  let handler;
  const effects = [];
  const requests = [];
  const context = {
    exports: {}, Request, Response, Headers, URL, URLSearchParams, AbortSignal, TextEncoder, TextDecoder, btoa, atob, Intl, Date: FixedDate,
    console: { log() { throw new Error('Provider details must not be logged'); }, warn() {}, error() { throw new Error('Provider details must not be logged'); } },
    crypto: { subtle: { async importKey() { return {}; }, async sign() { return new Uint8Array([1, 2, 3]).buffer; } } },
    Deno: { serve(fn) { handler = fn; }, env: { get(key) { effects.push({ env: key }); return Object.hasOwn(env, key) ? env[key] : key === 'GA_PROPERTY_ID' ? '537967742' : key === 'GA_SERVICE_ACCOUNT_JSON' ? CREDENTIAL : undefined; } } },
    createClientFromRequest() { return { auth: { async me() { if (authError) throw new Error('invalid authentication'); return user; } } }; },
    async fetch(url, options) {
      effects.push({ network: true });
      const body = options.headers?.['Content-Type'] === 'application/json' ? JSON.parse(options.body || '{}') : null;
      requests.push({ url, method: options.method, body });
      if (fetcher) { const custom = await fetcher(url, options, body); if (custom) return custom; }
      if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'isolated-test-token' });
      if (url.includes('analyticsdata.googleapis.com')) return Response.json(gaReport(body));
      if (url.endsWith('/searchAnalytics/query')) return Response.json({ responseAggregationType: body.aggregationType, rows: [{ keys: body.dimensions.map(key => key === 'date' ? '20261030'.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : key === 'page' ? 'https://newtechadvertising.com/' : 'nta'), clicks: 15, impressions: 150, ctr: 0.1, position: 4.5 }] });
      if (url.includes('webmasters/v3/sites/')) return Response.json({ siteUrl: 'sc-domain:newtechadvertising.com', permissionLevel: 'siteFullUser' });
      throw new Error('Unexpected external request');
    },
  };
  const path = `base44/functions/${name}/entry.ts`;
  const code = readFileSync(path, 'utf8').replace(/^import[^\n]*\n/gm, '');
  vm.runInNewContext(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context);
  return { effects, requests, async run(body = {}, headers = {}, method = 'POST', rawBody) {
    const request = new Request('https://reporting.invalid/function', { method, headers: { 'Content-Type': 'application/json', ...headers }, ...(method === 'GET' ? {} : { body: rawBody ?? JSON.stringify(body) }) });
    const response = await handler(request);
    return { status: response.status, data: await response.json(), headers: response.headers };
  } };
}

for (const name of ['getGoogleAnalytics']) {
  for (const [label, config, status] of [
    ['anonymous', { user: null }, 401],
    ['ordinary member', { user: { role: 'client' } }, 403],
    ['disabled administrator', { user: { ...ADMIN, disabled: true } }, 403],
    ['inactive administrator', { user: { ...ADMIN, is_active: false } }, 403],
    ['authentication failure', { authError: true }, 401],
  ]) test(`${name}: ${label} cannot read credentials or call Google`, async () => {
    const f = fixture(name, config);
    const result = await f.run({ role: 'admin', propertyId: 'victim' }, { Origin: 'https://newtechadvertising.com', Authorization: 'Bearer forged', 'X-Is-Service': 'true' });
    assert.equal(result.status, status);
    assert.equal(result.data.summary, null);
    assert.deepEqual(f.effects, []);
  });
  test(`${name}: malformed requests fail before credential access`, async () => {
    for (const [body, method, rawBody, status] of [[{ days: 10000 }, 'POST', undefined, 400], [{ days: '30' }, 'POST', undefined, 400], [{}, 'GET', undefined, 405], [{}, 'POST', '{broken', 400]]) {
      const f = fixture(name);
      assert.equal((await f.run(body, {}, method, rawBody)).status, status);
      assert.deepEqual(f.effects, []);
    }
  });
  test(`${name}: missing credentials are unavailable, never zero`, async () => {
    const f = fixture(name, { env: { GA_SERVICE_ACCOUNT_JSON: undefined } });
    const result = await f.run();
    assert.equal(result.status, 503);
    assert.equal(result.data.status, 'unavailable');
    assert.equal(result.data.summary, null);
    assert.equal(f.requests.length, 0);
  });
  test(`${name}: invalid credential JSON stays private`, async () => {
    const f = fixture(name, { env: { GA_SERVICE_ACCOUNT_JSON: 'sensitive-invalid-configuration' } });
    const result = await f.run();
    assert.equal(result.status, 503);
    assert(!JSON.stringify(result).includes('sensitive-invalid-configuration'));
    assert.equal(f.requests.length, 0);
  });
  test(`${name}: token failures do not leak provider response or credentials`, async () => {
    const f = fixture(name, { fetcher: url => url.includes('oauth2') ? Response.json({ error: 'private-provider-error', private_key: 'DO-NOT-LEAK' }, { status: 401 }) : null });
    const result = await f.run();
    assert.equal(result.status, 502);
    assert.equal(result.data.summary, null);
    assert(!JSON.stringify(result).includes('DO-NOT-LEAK'));
    assert(!JSON.stringify(result).includes('private-provider-error'));
    assert.equal(f.requests.length, 1);
  });
}

test('GA: Google period users and bounce rate are not derived from daily rows', async () => {
  const f = fixture('getGoogleAnalytics');
  const result = await f.run({ days: 30, propertyId: '999', site: 'https://victim.invalid' });
  assert.equal(result.status, 200);
  assert.equal(result.data.summary.totalUsers, 120);
  assert.equal(result.data.summary.uniqueVisitors, 120);
  assert.equal(result.data.sections.daily.rows.reduce((sum, row) => sum + row.totalUsers, 0), 200);
  assert.equal(result.data.summary.bounceRate, 13);
  assert.equal(result.data.summary.keyEvents, 7);
  assert.equal(result.data.period.startDate, '2026-10-03');
  assert.equal(result.data.period.endDate, '2026-11-01');
  assert.equal(result.data.period.timeZone, 'America/Chicago');
  assert.equal(result.data.latestDataDate, '2026-11-01');
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert(f.requests.filter(row => row.url.includes('analyticsdata')).every(row => row.url.includes('537967742') && row.body.dateRanges[0].endDate === 'yesterday'));
  assert(f.requests.some(row => row.body?.dimensionFilter?.filter?.fieldName === 'sessionSource'));
});

test('GA: provider failure cannot become a successful zero report', async () => {
  const f = fixture('getGoogleAnalytics', { fetcher: url => url.includes('analyticsdata') ? Response.json({ error: { message: 'private upstream details' } }, { status: 403 }) : null });
  const result = await f.run();
  assert.equal(result.status, 502);
  assert.equal(result.data.status, 'unavailable');
  assert.equal(result.data.summary, null);
  assert.equal(result.data.error.code, 'GOOGLE_ACCESS_NEEDED');
  assert(!JSON.stringify(result).includes('private upstream details'));
});

test('GA: malformed successful provider data is unavailable, not zero', async () => {
  const f = fixture('getGoogleAnalytics', { fetcher: url => url.includes('analyticsdata') ? Response.json({}) : null });
  const result = await f.run();
  assert.equal(result.status, 502);
  assert.equal(result.data.summary, null);
});

test('GA: valid empty reports are explicitly empty', async () => {
  const f = fixture('getGoogleAnalytics', { fetcher: (url, options, body) => url.includes('analyticsdata') ? Response.json(gaReport(body, {}, [])) : null });
  const result = await f.run();
  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'empty');
  assert.equal(result.data.summary, null);
  assert.equal(result.data.latestDataDate, null);
  assert.equal(result.data.sections.events.status, 'empty');
});

test('GA: genuine zero metrics remain zero', async () => {
  const zero = { screenPageViews: 0, totalUsers: 0, activeUsers: 0, sessions: 0, bounceRate: 0, keyEvents: 0 };
  const f = fixture('getGoogleAnalytics', { fetcher: (url, options, body) => url.includes('analyticsdata') && !body.dimensions.length ? Response.json(gaReport(body, zero)) : null });
  const result = await f.run();
  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'ready');
  assert.equal(result.data.summary.sessions, 0);
  assert.equal(result.data.summary.keyEvents, 0);
});

test('GA: failed optional section preserves valid totals and marks missing data', async () => {
  const f = fixture('getGoogleAnalytics', { fetcher: (url, options, body) => url.includes('analyticsdata') && body.dimensions?.[0]?.name === 'sessionSourceMedium' && !body.dimensionFilter ? Response.json({ error: 'failed' }, { status: 503 }) : null });
  const result = await f.run();
  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'partial');
  assert.equal(result.data.summary.totalUsers, 120);
  assert.equal(result.data.sections.sources.status, 'unavailable');
  assert.equal(result.data.sections.sources.rows, null);
  assert(result.data.warnings.length > 0);
});

test('GA: invalid negative metric is rejected', async () => {
  const f = fixture('getGoogleAnalytics', { fetcher: (url, options, body) => url.includes('analyticsdata') && !body.dimensions.length ? Response.json(gaReport(body, { totalUsers: -1 })) : null });
  assert.equal((await f.run()).status, 502);
});





