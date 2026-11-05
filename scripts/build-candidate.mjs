import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
// These tracked public sources are rewritten by generate-seo-pages.mjs. Builds
// must not silently carry unreviewed partial updates into a release.
const GENERATED_SOURCES = ['public/sitemap.xml', 'public/ai-sitemap.json', 'public/llms.txt'];

export function generatedSourceStatus({ spawn = spawnSync } = {}) {
  const result = spawn('git', ['status', '--porcelain', '--untracked-files=no', '--', ...GENERATED_SOURCES], {
    cwd: root, encoding: 'utf8', timeout: 15_000, stdio: 'pipe',
  });
  if (result.error) throw result.error;
  if (result.signal || result.status !== 0) {
    throw new Error('Could not verify generated SEO source files with git status');
  }
  return String(result.stdout || '').trim();
}

// Use the normal Vite production lifecycle, with a child-only offline data
// selection. This does not provide OS-level network isolation; CI does that.
// Guard both sides of the build: changes to tracked SEO source files must be
// reviewed and committed deliberately, never left as a hidden build side effect.
export function buildCandidate({ spawn = spawnSync, env = process.env } = {}) {
  const prior = generatedSourceStatus({ spawn });
  if (prior) {
    throw new Error('Generated SEO source files are already modified before the build. Review and commit these changes first:\n' + prior);
  }

  const result = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: root,
    env: { ...env, NTA_PODCAST_BUILD_MODE: 'candidate-offline' },
    stdio: 'inherit',
    timeout: 8 * 60 * 1000,
  });

  // Check even when the build itself fails. Never silently clean or discard
  // generated files; the developer must inspect them and update source truth.
  const unexpected = generatedSourceStatus({ spawn });
  if (unexpected) {
    throw new Error('The build unexpectedly changed tracked SEO source files. Review the generator and commit approved changes before merging:\n' + unexpected);
  }
  if (result.error) throw result.error;
  if (result.signal) throw new Error('Candidate build terminated: ' + result.signal);
  return Number.isInteger(result.status) ? result.status : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = buildCandidate();
}
