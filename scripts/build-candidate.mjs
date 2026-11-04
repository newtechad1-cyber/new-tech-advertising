import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

// Use the normal Vite production lifecycle, with a child-only offline data
// selection. This does not provide OS-level network isolation; CI does that.
export function buildCandidate({ spawn = spawnSync, env = process.env } = {}) {
  const result = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: root,
    env: { ...env, NTA_PODCAST_BUILD_MODE: 'candidate-offline' },
    stdio: 'inherit',
    timeout: 8 * 60 * 1000,
  });
  if (result.error) throw result.error;
  if (result.signal) throw new Error('Candidate build terminated: ' + result.signal);
  return Number.isInteger(result.status) ? result.status : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = buildCandidate();
}
