import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { collectTestFiles, runTests, TEST_ROOTS } from '../scripts/run-ci-tests.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
const workflow = fs.readFileSync(path.join(root, '.github/workflows/release-checks.yml'), 'utf8');

function fixture(t, names = ['tests/a.test.mjs']) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nta-ci-inventory-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of TEST_ROOTS) fs.mkdirSync(path.join(dir, name), { recursive: true });
  for (const name of names) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), '// fixture, never executed\n');
  }
  return dir;
}

// Structural check only. The workflow's network namespace is the runtime
// boundary; these assertions prevent accidentally reconnecting the live alias.
function expanded(name, active = new Set()) {
  assert.ok(scripts[name], `Missing script: ${name}`);
  assert.ok(!active.has(name), `Script cycle: ${name}`);
  const next = new Set([...active, name]);
  const value = scripts[name];
  return value + '\n' + [...value.matchAll(/npm run ([\w:-]+)/g)]
    .map(match => expanded(match[1], next)).join('\n');
}

test('CI and compatibility release commands never include live checks or submissions', () => {
  for (const name of ['check:ci', 'check:release']) {
    const chain = expanded(name);
    assert.doesNotMatch(chain, /check:core-bridge-live|check:release-live|--submit|https?:\/\//);
    assert.match(chain, /npm run audit:security -- --strict/);
    assert.match(chain, /security-audit\.mjs/);
    assert.match(chain, /vite build/);
    assert.match(chain, /run-ci-tests\.mjs/);
    assert.match(chain, /check-core-bridge-readiness\.mjs/);
  }
});

test('live verification remains explicit and separate, not deleted', () => {
  assert.equal(scripts['check:release'], 'npm run check:ci');
  assert.equal(scripts['check:release-live'], 'npm run check:core-bridge-live');
  assert.equal(scripts['check:core-bridge-live'], 'node scripts/check-core-bridge-live.mjs');
  assert.doesNotMatch(workflow, /npm run check:release-live|npm run check:core-bridge-live/);
});

test('workflow enforces no-network candidate checks and does not hide failures', () => {
  assert.match(workflow, /sudo unshare --net -- setpriv/);
  assert.match(workflow, /env -i PATH="\$PATH" HOME="\$HOME" CI=true npm run check:ci/);
  assert.match(workflow, /persist-credentials: false/);
  assert.doesNotMatch(workflow, /continue-on-error|\|\| true/);
  assert.match(scripts.typecheck, /--noEmit/);
});

test('inventory includes nested test files in both maintained roots, sorted', t => {
  const dir = fixture(t, ['tests/z.test.mjs', 'tests/nested/a.test.cjs', 'src/lib/growth-guide/b.test.js', 'tests/helper.mjs', 'README.test.js']);
  assert.deepEqual(collectTestFiles(dir), ['src/lib/growth-guide/b.test.js', 'tests/nested/a.test.cjs', 'tests/z.test.mjs']);
});

test('missing test root fails instead of silently shrinking coverage', t => {
  const dir = fixture(t);
  fs.rmSync(path.join(dir, 'src'), { recursive: true });
  assert.throws(() => collectTestFiles(dir), /ENOENT/);
});

test('empty inventory fails rather than reporting a green run', t => {
  assert.throws(() => collectTestFiles(fixture(t, [])), /No CI test files/);
});

test('symlinks cannot escape the reviewed test roots', t => {
  const dir = fixture(t);
  fs.symlinkSync('../package.json', path.join(dir, 'tests/link.test.mjs'));
  assert.throws(() => collectTestFiles(dir), /Symlink is not allowed/);
});

test('list-only inventory does not execute tests', t => {
  assert.equal(runTests({ root: fixture(t), listOnly: true, spawn: () => assert.fail('must not spawn') }), 0);
});

test('runner passes every discovered file and the existing resolver to Node', t => {
  const dir = fixture(t, ['tests/a.test.mjs', 'src/lib/growth-guide/b.test.js']);
  assert.equal(runTests({ root: dir, spawn: (command, args, options) => {
    assert.equal(command, process.execPath);
    assert.deepEqual(args, ['--experimental-loader=./scripts/resolve-extensionless-modules.mjs', '--test', 'src/lib/growth-guide/b.test.js', 'tests/a.test.mjs']);
    assert.equal(options.cwd, dir);
    return { status: 0 };
  } }), 0);
});

test('test failures propagate without being converted to success', t => {
  assert.equal(runTests({ root: fixture(t), spawn: () => ({ status: 1 }) }), 1);
});

test('spawn failures and timeouts fail closed', t => {
  const dir = fixture(t);
  assert.throws(() => runTests({ root: dir, spawn: () => ({ error: new Error('timeout') }) }), /timeout/);
  assert.throws(() => runTests({ root: dir, spawn: () => ({ signal: 'SIGTERM', status: null }) }), /SIGTERM/);
  assert.equal(runTests({ root: dir, spawn: () => ({ status: null }) }), 1);
});
