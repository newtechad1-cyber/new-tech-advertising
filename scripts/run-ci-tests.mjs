import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
export const TEST_ROOTS = ['tests', 'src/lib/growth-guide'];

// Discover all existing tests in the two maintained test roots, including
// nested files. No hand-maintained list can silently leave a new test unwired.
export function collectTestFiles(root = repositoryRoot) {
  const files = [];
  function visit(relative) {
    for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Symlink is not allowed in a CI test root: ${child}`);
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile() && /\.test\.(?:mjs|cjs|js)$/.test(entry.name)) files.push(child);
    }
  }
  for (const directory of TEST_ROOTS) visit(directory);
  if (!files.length) throw new Error('No CI test files found. Refusing an empty successful run.');
  return files.sort();
}

export function runTests({ root = repositoryRoot, listOnly = false, spawn = spawnSync } = {}) {
  const files = collectTestFiles(root);
  console.log(`CI test inventory: ${files.length} files`);
  for (const file of files) console.log(`  ${file}`);
  if (listOnly) return 0;
  const result = spawn(process.execPath, [
    '--experimental-loader=./scripts/resolve-extensionless-modules.mjs',
    '--test', ...files,
  ], { cwd: root, stdio: 'inherit', timeout: 10 * 60 * 1000 });
  if (result.error) throw result.error;
  if (result.signal) throw new Error(`CI test process stopped by ${result.signal}`);
  return result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--list')) throw new Error('Only --list is supported.');
    process.exitCode = runTests({ listOnly: args.includes('--list') });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
