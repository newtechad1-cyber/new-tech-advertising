import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const key = 'ef775e3bbc9749d6a19087978ce28894';
const otherKey = 'ce5c26f9246431cd84399706e3055e7c';
const origin = 'https://newtechadvertising.com';
const keyLocation = `${origin}/${key}.txt`;
const sitemap = urls => `<urlset>${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;

// Exercise the actual CLI in a temporary repository, with every fetch replaced
// before the script loads. No dependencies, credentials or live requests.
function run(t, options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nta-indexnow-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'scripts'));
  fs.mkdirSync(path.join(dir, 'public'));
  fs.copyFileSync(path.join(root, 'scripts/submit-indexnow.mjs'), path.join(dir, 'scripts/submit-indexnow.mjs'));
  if (options.localKey !== null) {
    fs.writeFileSync(path.join(dir, 'public', `${key}.txt`), options.localKey ?? key);
  }
  // Both existing public keys intentionally remain present in normal fixtures.
  fs.writeFileSync(path.join(dir, 'public', `${otherKey}.txt`), otherKey);
  fs.writeFileSync(path.join(dir, 'public/sitemap.xml'), options.xml ?? sitemap([origin, `${origin}/knowledge`]));
  const mockPath = path.join(dir, 'mock-fetch.mjs');
  fs.writeFileSync(mockPath, `
    import fs from 'node:fs';
    globalThis.fetch = async (url, options = {}) => {
      const call = { url: String(url), method: options.method,
        body: options.body ? JSON.parse(options.body) : null,
        redirect: options.redirect, hasSignal: options.signal instanceof AbortSignal };
      fs.appendFileSync(process.env.CALLS, JSON.stringify(call) + '\\n');
      if (process.env.THROW_METHOD === options.method) throw new Error('Mock transport failure');
      const get = options.method === 'GET';
      return { status: Number(get ? process.env.KEY_STATUS : process.env.POST_STATUS),
        text: async () => get ? process.env.LIVE_KEY : 'Mock IndexNow response' };
    };
  `);
  const callsPath = path.join(dir, 'calls.jsonl');
  const result = spawnSync(process.execPath, [
    '--import', mockPath, path.join(dir, 'scripts/submit-indexnow.mjs'), ...(options.args ?? ['--all']),
  ], {
    encoding: 'utf8', timeout: 5000,
    env: { CALLS: callsPath, KEY_STATUS: String(options.keyStatus ?? 200),
      POST_STATUS: String(options.postStatus ?? 200), LIVE_KEY: options.liveKey ?? key,
      THROW_METHOD: options.throwMethod ?? '' },
  });
  assert.ifError(result.error);
  const calls = fs.existsSync(callsPath)
    ? fs.readFileSync(callsPath, 'utf8').trim().split('\n').map(line => JSON.parse(line)) : [];
  return { ...result, calls, dir };
}

function dryRunPayload(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.calls, [], 'dry-run must not fetch even the published key');
  const json = result.stdout.split('\n\nNo URLs were submitted.')[0];
  const output = JSON.parse(json);
  assert.equal(output.mode, 'dry-run');
  return output.payload;
}

test('two hosted keys do not break explicit selection or remove either file', t => {
  const result = run(t);
  const candidates = fs.readdirSync(path.join(result.dir, 'public')).filter(name => name.endsWith('.txt'));
  const matching = candidates.filter(name => fs.readFileSync(path.join(result.dir, 'public', name), 'utf8').trim() === name.slice(0, -4));
  assert.equal(matching.length, 2, 'reproduce the old auto-discovery failure condition');
  assert.deepEqual(dryRunPayload(result), { host: 'newtechadvertising.com', key, keyLocation,
    urlList: [origin, `${origin}/knowledge`] });
});

test('missing configured key never falls back to the other key or sends a request', t => {
  const result = run(t, { localKey: null, args: ['--all', '--submit'] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ENOENT/);
  assert.deepEqual(result.calls, []);
});

test('mismatched configured key fails before any network access', t => {
  const result = run(t, { localKey: otherKey, args: ['--all', '--submit'] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /does not match INDEXNOW_KEY/);
  assert.deepEqual(result.calls, []);
});

test('local key permits a trailing newline', t => {
  assert.equal(dryRunPayload(run(t, { localKey: `${key}\n` })).key, key);
});

test('empty sitemap fails before any network access', t => {
  const result = run(t, { xml: '<urlset/>', args: ['--all', '--submit'] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /between 1 and 10000/);
  assert.deepEqual(result.calls, []);
});

for (const url of ['https://example.com/page', 'https://www.newtechadvertising.com/page', 'http://newtechadvertising.com/page']) {
  test(`reject non-canonical sitemap URL: ${url}`, t => {
    const result = run(t, { xml: sitemap([origin, url]), args: ['--all', '--submit'] });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /only accepts canonical/);
    assert.deepEqual(result.calls, []);
  });
}

test('sitemap whitespace, duplicate URLs and fragments are normalized', t => {
  const result = run(t, { xml: sitemap([` ${origin}/knowledge `, `${origin}/knowledge#section`, `${origin}/knowledge`]) });
  assert.deepEqual(dryRunPayload(result).urlList, [`${origin}/knowledge`]);
});

test('default and explicit-path invocations remain offline without --submit', t => {
  assert.equal(dryRunPayload(run(t, { args: [] })).urlList.length, 6);
  assert.deepEqual(dryRunPayload(run(t, { args: ['/knowledge', '/knowledge#intro'] })).urlList, [`${origin}/knowledge`]);
});

test('oversized sitemap is rejected without sending', t => {
  const result = run(t, { xml: sitemap(Array.from({ length: 10001 }, (_, i) => `${origin}/page-${i}`)), args: ['--all', '--submit'] });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /between 1 and 10000/);
  assert.deepEqual(result.calls, []);
});

for (const status of [200, 202]) {
  test(`explicit submission verifies the published key then accepts HTTP ${status} (mocked)`, t => {
    const result = run(t, { args: ['--all', '--submit'], postStatus: status, liveKey: `${key}\n` });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.calls.length, 2);
    assert.deepEqual(result.calls[0], { url: keyLocation, method: 'GET', body: null, redirect: 'error', hasSignal: true });
    assert.deepEqual(result.calls[1], { url: 'https://api.indexnow.org/indexnow', method: 'POST',
      body: { host: 'newtechadvertising.com', key, keyLocation, urlList: [origin, `${origin}/knowledge`] },
      redirect: 'error', hasSignal: true });
    assert.match(result.stdout, new RegExp(`HTTP ${status}`));
    if (status === 202) assert.match(result.stdout, /validation is pending/);
  });
}

for (const options of [{ keyStatus: 404 }, { keyStatus: 301 }, { liveKey: otherKey }, { liveKey: '<html>Not a key</html>' }]) {
  test(`invalid published key prevents notification: ${JSON.stringify(options)}`, t => {
    const result = run(t, { ...options, args: ['--all', '--submit'] });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Published IndexNow key could not be verified/);
    assert.equal(result.calls.length, 1);
    assert.equal(result.calls[0].method, 'GET');
  });
}

for (const status of [201, 204, 400, 403, 422, 429, 500]) {
  test(`unexpected submission HTTP ${status} is a failure (mocked)`, t => {
    const result = run(t, { args: ['--all', '--submit'], postStatus: status });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(`IndexNow submission failed \\(${status}\\)`));
    assert.equal(result.calls.length, 2);
  });
}

for (const method of ['GET', 'POST']) {
  test(`${method} transport failure is not swallowed or retried (mocked)`, t => {
    const result = run(t, { args: ['--all', '--submit'], throwMethod: method });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Mock transport failure/);
    assert.equal(result.calls.length, method === 'GET' ? 1 : 2);
  });
}

test('both workflows run the offline regression; only main may submit via the shared CLI', () => {
  const notify = fs.readFileSync(path.join(root, '.github/workflows/indexnow.yml'), 'utf8');
  const release = fs.readFileSync(path.join(root, '.github/workflows/release-checks.yml'), 'utf8');
  const testCommand = 'node --test tests/indexnow.test.mjs';
  assert.match(notify, /^on:\\s*\\n\\s+workflow_dispatch:/m, 'IndexNow must be manual-only after Base44 Publish');
  assert.doesNotMatch(notify, /^\\s{2}push:/m, 'IndexNow cannot notify on GitHub merges');
  assert.ok(notify.includes(testCommand));
  assert.ok(release.includes(testCommand));
  assert.ok(notify.includes("if: github.ref == 'refs/heads/main'"));
  assert.ok(notify.includes('run: node scripts/submit-indexnow.mjs --all --submit'));
  assert.doesNotMatch(notify, /readdirSync|keyFiles/);
  assert.ok(notify.indexOf(testCommand) < notify.indexOf('--all --submit'));
  assert.ok(release.includes('npm run check:ci'), 'candidate checks are separate from explicit post-publish checks');
});
