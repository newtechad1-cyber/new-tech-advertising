import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { classifyRoute, classifyPageKey } from '../src/config/routeGovernance.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = readFileSync(resolve(root, 'src/App.jsx'), 'utf8');
const pagesConfig = readFileSync(resolve(root, 'src/pages.config.js'), 'utf8');

const authPatterns = [/^\/(login|signup)$/i, /oauth/i, /callback/i];

function migrationClass(route, access) {
  if (authPatterns.some((pattern) => pattern.test(route))) return 'AUTH';
  if (access === 'admin_only' || access === 'ops_only') return 'AGENCY';
  if (access === 'client_only') return 'CLIENT';
  if (access === 'auth_required') return 'AUTH';
  return 'PUBLIC';
}

const rows = [];
const seen = new Set();

function add(route, page, source, access) {
  const key = `${route}\u0000${page}`;
  if (seen.has(key)) return;
  seen.add(key);
  rows.push({
    route,
    page,
    classification: migrationClass(route, access),
    access,
    source,
    destination: migrationClass(route, access) === 'PUBLIC'
      ? 'new-tech-advertising'
      : 'nta-core-adminhub',
    status: 'PLANNED',
  });
}

for (const match of app.matchAll(/<Route\s+path=["']([^"']+)["'][^>]*?(?:currentPageName=["']([^"']+)["'])?/g)) {
  const route = match[1];
  const nearby = app.slice(match.index, match.index + 500);
  const page = match[2]
    || nearby.match(/currentPageName=["']([^"']+)["']/)?.[1]
    || nearby.match(/<([A-Z][A-Za-z0-9_]*)\b/)?.[1]
    || 'Unknown';
  add(route, page, 'App.jsx', classifyRoute(route));
}

const pagesObject = pagesConfig.match(/export const PAGES\s*=\s*\{([\s\S]*?)\n\};/);
if (pagesObject) {
  for (const match of pagesObject[1].matchAll(/["']?([A-Za-z0-9_-]+)["']?\s*:/g)) {
    const page = match[1];
    add(`/${page}`, page, 'pages.config.js', classifyPageKey(page));
  }
}

rows.sort((a, b) => a.classification.localeCompare(b.classification) || a.route.localeCompare(b.route));

const counts = rows.reduce((result, row) => {
  result[row.classification] = (result[row.classification] || 0) + 1;
  return result;
}, {});

const csv = [
  ['route', 'page', 'classification', 'access', 'source', 'destination', 'status'],
  ...rows.map((row) => Object.values(row)),
].map((values) => values.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');

const summary = `# NTA application-separation migration manifest\n\nGenerated from \`src/App.jsx\`, \`src/pages.config.js\`, and \`src/config/routeGovernance.js\`. The CSV is the complete route-level working manifest.\n\n## Classification contract\n\n| Class | Intended host | Meaning |\n|---|---|---|\n| PUBLIC | \`newtechadvertising.com\` | Education, publishing, marketing, books, Journal, Growth Show, knowledge library, public demos and lead generation |\n| AGENCY | \`app.newtechadvertising.com\` | NTA staff operations, CRM, sales, publishing operations, automation, reporting, governance and AI workforce |\n| CLIENT | \`app.newtechadvertising.com\` | Authenticated client portals, approvals, results, billing and account operations |\n| AUTH | \`app.newtechadvertising.com\` | Authentication or role-neutral authenticated workflows |\n| SHARED | both builds | Non-route SDK configuration, authentication infrastructure, entity access, UI primitives and data contracts; tracked at the file/module level rather than as a routable page |\n\n## Inventory summary\n\n${['PUBLIC', 'AGENCY', 'CLIENT', 'AUTH', 'SHARED'].map((key) => `- ${key}: ${counts[key] || 0} routes`).join('\n')}\n\n## Migration safeguards\n\n- The public source remains intact until the admin application is migrated, built and verified.\n- Base44 configuration, SDK access, authentication providers, entity access and shared contracts are copied without semantic changes during the foundation migration.\n- Hostname-aware route policy is required in both applications before public removal begins.\n- Every migrated batch must build in the admin repository before the corresponding source cleanup is proposed.\n\nSee [\`route-migration-manifest.csv\`](./route-migration-manifest.csv) for every route.\n`;

writeFileSync(resolve(root, 'docs/route-migration-manifest.csv'), `${csv}\n`);
writeFileSync(resolve(root, 'docs/route-migration-manifest.md'), summary);

console.log(`Wrote ${rows.length} routes: ${JSON.stringify(counts)}`);
