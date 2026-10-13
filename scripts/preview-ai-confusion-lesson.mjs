// Render the real lesson component for offline layout QA. This never publishes,
// calls an app backend, or changes user data. Shared site shell/media are omitted.
import { build } from 'esbuild';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = process.cwd();
const base = '/tmp/nta-ai-confusion-preview';
const page = 'src/pages/knowledge/ai-foundations/is-using-ai-cheating.jsx';
const stubs = new Set([
  '@/components/nav/MarketingNav', '@/components/marketing/SiteFooter',
  '@/components/shared/SEOHead', '@/components/knowledge/LessonMediaOptions'
]);
await build({
  stdin: {
    contents: `import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { MemoryRouter } from 'react-router-dom'; import Page from './${page}'; process.stdout.write(renderToStaticMarkup(React.createElement(MemoryRouter, {initialEntries:['/knowledge/ai-foundations/is-using-ai-cheating']}, React.createElement(Page))));`,
    resolveDir: root, sourcefile: 'lesson-layout-qa.jsx', loader: 'jsx'
  },
  bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic',
  outfile: base + '.cjs',
  plugins: [{
    name: 'isolated-lesson-layout',
    setup(context) {
      context.onResolve({ filter: /^@\// }, args => {
        if (stubs.has(args.path)) return { path: args.path, namespace: 'qa-shell' };
        const target = path.join(root, 'src', args.path.slice(2));
        const resolved = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js'].map(suffix => target + suffix).find(existsSync);
        return resolved ? { path: resolved } : undefined;
      });
      context.onLoad({ filter: /.*/, namespace: 'qa-shell' }, () => ({ contents: 'export default function OmittedShell(){ return null; }', loader: 'js' }));
    }
  }]
});
const body = execFileSync(process.execPath, [base + '.cjs'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
execFileSync(path.join(root, 'node_modules/.bin/tailwindcss'), [
  '-i', path.join(root, 'src/index.css'), '-o', base + '.css',
  '--content', page + ',src/components/knowledge/LessonArticle.jsx', '--minify'
], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
const css = readFileSync(base + '.css', 'utf8');
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Confusion - actual component layout review</title><style>' + css + '</style></head><body>' + body + '</body></html>';
writeFileSync(base + '.html', html);
const output = { html, source: readFileSync('src/data/aiFoundationsLesson17.js', 'utf8') };
console.log('Offline layout snapshot: actual lesson and article components; site nav/footer, metadata and unavailable media omitted. Interactions are not exercised in this static snapshot.');
console.log('HTML bytes=' + Buffer.byteLength(html));
console.log('SNAPSHOT_GZIP_BASE64=' + gzipSync(JSON.stringify(output)).toString('base64'));
