import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { buildCandidate } from '../scripts/build-candidate.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
const workflow = fs.readFileSync(path.join(root, '.github/workflows/release-checks.yml'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-podcast-feed.mjs'), 'utf8');

// Exact pre-106 gate at 9ddda50, minus its live check and using build:ci.
// F3 may append a reviewed batch, but must not shrink or reorder this baseline.
const baseline = 'npm run audit:security -- --strict && npm run test:backend-auth && npm run test:growth-guide && npm run test:route-governance && npm run build:ci && node --experimental-loader=./scripts/resolve-extensionless-modules.mjs --test tests/public-boundary.test.mjs tests/production-seo-output.test.mjs tests/search-delivery.test.mjs tests/video-publication.test.mjs tests/visitor-journey.test.mjs tests/public-tracking.test.mjs tests/analytics-reporting.test.mjs && npm run test:core-bridge && npm run check:core-bridge';

function expanded(name, active = new Set()) {
  assert.ok(scripts[name], 'Missing script: ' + name);
  assert.ok(!active.has(name), 'Script cycle: ' + name);
  const value = scripts[name];
  return value + '\n' + [...value.matchAll(/npm run ([\w:-]+)/g)]
    .map(match => expanded(match[1], new Set([...active, name]))).join('\n');
}

test('F2 preserves every previously gated test command and its order', () => {
  assert.equal(scripts['check:ci'], baseline + ' && npm run test:discovery && npm run test:content-follow-up && npm run test:video-library && npm run test:podcast');
  assert.equal(scripts['test:backend-auth'], 'node --test tests/backend-auth-boundaries.test.mjs tests/public-verification-candidates.test.mjs tests/public-verification-client.test.mjs');
  assert.equal(scripts['test:growth-guide'], 'node --test src/lib/growth-guide/*.test.js');
  assert.equal(scripts['test:route-governance'], 'node --experimental-loader=./scripts/resolve-extensionless-modules.mjs --test tests/route-governance.test.mjs');
  assert.equal(scripts['test:core-bridge'], 'node --test tests/core-bridge-boundaries.test.mjs tests/core-bridge-runtime.test.mjs');
});

test('F3 discovery batch runs all three existing suites without suppressing failures', () => {
  assert.equal(scripts['test:discovery'], 'node --test tests/discovery-input-mode.test.mjs tests/discovery-question-selection.test.mjs tests/discovery-trigger-routing.test.mjs');
});

test('F3 content follow-up batch runs both existing suites without suppressing failures', () => {
  assert.equal(scripts['test:content-follow-up'], 'node --test tests/content-journey.test.mjs tests/content-follow-up-form.test.mjs');
});

test('F3 video library batch runs all three existing suites without suppressing failures', () => {
  assert.equal(scripts['test:video-library'], 'node --test tests/growth-show.test.mjs tests/video-gallery.test.mjs tests/youtube-learning-identity.test.mjs');
});

test('F3 podcast batch runs the existing suite without suppressing failures', () => {
  assert.equal(scripts['test:podcast'], 'node --test tests/growth-show-podcast.test.mjs');
});

test('CI and compatibility aliases exclude live diagnostics and submissions', () => {
  assert.equal(scripts['check:release'], 'npm run check:ci');
  for (const name of ['check:ci', 'check:release']) {
    const chain = expanded(name);
    assert.doesNotMatch(chain, /check:core-bridge-live|check:release-live|--submit|https?:\/\//);
    assert.match(chain, /security-audit\.mjs/);
    assert.match(chain, /build-candidate\.mjs/);
    assert.match(chain, /check-core-bridge-readiness\.mjs/);
  }
});

test('normal publishing and the explicit live diagnostic remain available', () => {
  assert.equal(scripts.build, 'vite build');
  assert.equal(scripts['build:ci'], 'node scripts/build-candidate.mjs');
  assert.equal(scripts['check:release-live'], 'npm run check:core-bridge-live');
  assert.equal(scripts['check:core-bridge-live'], 'node scripts/check-core-bridge-live.mjs');
  assert.doesNotMatch(workflow, /npm run check:release-live|npm run check:core-bridge-live/);
});

test('workflow retains isolation, locked install, safeguards and fail-closed results', () => {
  assert.match(workflow, /sudo unshare --net -- setpriv/);
  assert.match(workflow, /env -i PATH="\$PATH" HOME="\$HOME" CI=true npm run check:ci/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /npm ci --ignore-scripts --no-audit --no-fund/);
  assert.match(workflow, /node --test tests\/indexnow\.test\.mjs/);
  assert.match(workflow, /node --test tests\/release-checks\.test\.mjs/);
  assert.doesNotMatch(workflow, /continue-on-error|\|\| true|npm run lint|npm run typecheck/);
  assert.equal(scripts.typecheck, 'tsc --noEmit -p ./jsconfig.json');
  assert.equal(scripts['test:ci'], undefined);
});

test('candidate wrapper selects offline records only in its child environment', () => {
  const env = { PATH: '/test/bin', NTA_PODCAST_BUILD_MODE: 'live' };
  let calls = 0;
  const result = buildCandidate({ env, spawn(command, args, options) {
    calls++;
    assert.equal(command, process.execPath);
    assert.deepEqual(args, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build']);
    assert.equal(options.cwd, root);
    assert.equal(options.stdio, 'inherit');
    assert.ok(options.timeout > 0);
    assert.deepEqual(options.env, { PATH: '/test/bin', NTA_PODCAST_BUILD_MODE: 'candidate-offline' });
    return { status: 0 };
  } });
  assert.equal(result, 0);
  assert.equal(calls, 1);
  assert.equal(env.NTA_PODCAST_BUILD_MODE, 'live');
});

test('candidate wrapper propagates failure, spawn error, timeout and signal', () => {
  assert.equal(buildCandidate({ spawn: () => ({ status: 7 }) }), 7);
  assert.equal(buildCandidate({ spawn: () => ({ status: null }) }), 1);
  assert.throws(() => buildCandidate({ spawn: () => ({ error: new Error('timeout') }) }), /timeout/);
  assert.throws(() => buildCandidate({ spawn: () => ({ signal: 'SIGTERM', status: null }) }), /SIGTERM/);
});

// Execute the actual generator body with isolated dependencies. No real files,
// production environment or network functions are exposed by this harness.
assert.equal((generator.match(/^import .*;$/gm) || []).length, 5);
const generatorBody = generator.replace(/^import .*;\r?\n/gm, '');
function harness({ mode, ci = 'true', response, failure } = {}) {
  const calls = [], writes = [], rendered = [], messages = [];
  const seed = [{ id: 'seed', youtube_video_id: 'seed-video', title: 'Seed title' }];
  const context = {
    process: { env: { CI: ci, ...(mode === undefined ? {} : { NTA_PODCAST_BUILD_MODE: mode }) } },
    fs: { existsSync: () => false, readFileSync: () => assert.fail('unexpected read'), writeFileSync: (...args) => writes.push(args) },
    createHash, URL, AbortSignal,
    SEED_GROWTH_SHOW_EPISODES: seed,
    GROWTH_SHOW_AUDIO: {},
    isPodcastAudioReady: () => false,
    createPodcastRss: rows => { rendered.push(JSON.parse(JSON.stringify(rows))); return '<rss><item>fixture</item></rss>'; },
    console: { log: value => messages.push(value) },
    fetch: async (...args) => {
      calls.push(args);
      if (failure) throw failure;
      if (!response) throw new Error('Unexpected network attempt');
      return response;
    },
  };
  return { calls, writes, rendered, messages, run: () => vm.runInNewContext('(async () => {' + generatorBody + '\n})()', context) };
}

test('explicit offline mode never fetches and renders the checked-in identities', async () => {
  const h = harness({ mode: 'candidate-offline' });
  await h.run();
  assert.equal(h.calls.length, 0);
  assert.deepEqual(h.rendered[0], [{ id: 'seed', youtube_video_id: 'seed-video', title: 'Seed title' }]);
  assert.equal(h.writes.length, 1);
  assert.equal(h.writes[0][0], 'public/growth-show.xml');
  assert.ok(h.messages.some(value => value.includes('not a publication artifact')));
});

for (const mode of [undefined, 'live']) {
  test('normal publishing refreshes live records even with CI=true: ' + mode, async () => {
    const h = harness({ mode, response: { ok: true, json: async () => [{ youtube_video_id: 'seed-video', title: 'Refreshed title' }] } });
    await h.run();
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0][0], 'https://base44.app/api/apps/691f41a18de4a7f498c8f884/entities/GrowthShowEpisode');
    assert.ok(h.calls[0][1].signal);
    assert.equal(h.rendered[0].length, 1);
    assert.equal(h.rendered[0][0].title, 'Refreshed title');
  });
}

for (const field of ['items', 'entities']) {
  test('normal publishing retains the existing response envelope: ' + field, async () => {
    const h = harness({ response: { ok: true, json: async () => ({ [field]: [{ id: 'new', title: 'New record' }] }) } });
    await h.run();
    assert.equal(h.rendered[0].length, 2);
  });
}

for (const [label, options, error] of [
  ['HTTP error', { response: { ok: false, status: 503 } }, /Cannot refresh/],
  ['bad payload', { response: { ok: true, json: async () => ({ unexpected: [] }) } }, /Unexpected episode/],
  ['transport failure', { failure: new Error('offline') }, /offline/],
  ['invalid JSON', { response: { ok: true, json: async () => { throw new Error('bad JSON'); } } }, /bad JSON/],
  ['unknown mode', { mode: 'typo' }, /Invalid NTA_PODCAST_BUILD_MODE/],
]) {
  test('no silent fallback or feed overwrite after ' + label, async () => {
    const h = harness(options);
    await assert.rejects(h.run(), error);
    assert.equal(h.writes.length, 0);
    assert.equal(h.rendered.length, 0);
    if (label === 'unknown mode') assert.equal(h.calls.length, 0);
  });
}
