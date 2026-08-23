#!/usr/bin/env node
/**
 * Static security preflight for the public NTA Base44 app.
 *
 * This is intentionally source-only: it inventories every entity and backend
 * endpoint before a release, and identifies paths that need an explicit access
 * boundary. It complements, but does not replace, Base44's hosted Security Scan.
 *
 * Usage:
 *   npm run audit:security
 *   npm run audit:security -- --verbose
 *   npm run audit:security -- --strict
 */

import fs from 'node:fs';
import path from 'node:path';

const SOURCE_ROOT = 'src';
const FUNCTIONS_ROOT = 'base44/functions';
const ENTITIES_ROOT = 'base44/entities';
const SOURCE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

const strict = process.argv.includes('--strict');
const verbose = process.argv.includes('--verbose');
const json = process.argv.includes('--json');

const severityRank = { critical: 0, high: 1, medium: 2, info: 3 };

function fileExists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch {
    return false;
  }
}

function listFiles(directory, predicate = () => true) {
  if (!fs.existsSync(directory)) return [];
  const results = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(file, predicate));
    } else if (predicate(file)) {
      results.push(file);
    }
  }

  return results;
}

function resolveImport(fromFile, specifier) {
  const candidateBases = [];

  if (specifier.startsWith('@/')) {
    candidateBases.push(path.join(SOURCE_ROOT, specifier.slice(2)));
  } else if (specifier.startsWith('.')) {
    candidateBases.push(path.resolve(path.dirname(fromFile), specifier));
  } else {
    return null;
  }

  for (const base of candidateBases) {
    for (const candidate of [base, ...SOURCE_EXTENSIONS.map(extension => base + extension)]) {
      if (fileExists(candidate)) return path.normalize(candidate);
    }

    for (const extension of SOURCE_EXTENSIONS) {
      const indexFile = path.join(base, 'index' + extension);
      if (fileExists(indexFile)) return path.normalize(indexFile);
    }
  }

  return null;
}

function importedFiles(sourceFile) {
  const source = fs.readFileSync(sourceFile, 'utf8');
  const imports = new Set();
  const pattern = /(?:\bfrom\s+|\bimport\s*)["']([^"']+)["']/g;

  for (const match of source.matchAll(pattern)) {
    const resolved = resolveImport(sourceFile, match[1]);
    if (resolved) imports.add(resolved);
  }

  return imports;
}

function publicSourceFiles() {
  const roots = [
    path.join(SOURCE_ROOT, 'App.jsx'),
    path.join(SOURCE_ROOT, 'pages.config.js'),
    path.join(SOURCE_ROOT, 'config/publicRoutes.js'),
  ];

  const seen = new Set();
  const pending = [...roots];

  while (pending.length) {
    const current = pending.pop();
    if (!current || seen.has(current) || !fileExists(current)) continue;

    seen.add(current);
    for (const imported of importedFiles(current)) {
      if (!seen.has(imported)) pending.push(imported);
    }
  }

  return seen;
}

function collectBrowserReferences(files) {
  const entityFiles = new Map();
  const functionFiles = new Map();

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');

    for (const match of source.matchAll(/(?:base44|api)\.entities\.([A-Za-z0-9_]+)/g)) {
      const entity = match[1];
      if (!entityFiles.has(entity)) entityFiles.set(entity, new Set());
      entityFiles.get(entity).add(file);
    }

    for (const match of source.matchAll(/(?:base44|api)\.functions\.invoke\(\s*["']([A-Za-z0-9_]+)["']/g)) {
      const fn = match[1];
      if (!functionFiles.has(fn)) functionFiles.set(fn, new Set());
      functionFiles.get(fn).add(file);
    }
  }

  return { entityFiles, functionFiles };
}

function functionProfile(name) {
  const folder = path.join(FUNCTIONS_ROOT, name);
  const source = fs.readFileSync(path.join(folder, 'entry.ts'), 'utf8');
  const configPath = path.join(folder, 'function.jsonc');
  const config = fileExists(configPath) ? fs.readFileSync(configPath, 'utf8') : '';

  const hasAuth = /\.auth\.me\s*\(/.test(source);
  const hasServiceRole = /\.asServiceRole\b/.test(source);
  const hasAdminOrServiceGuard = /(?:role\s*(?:={2,3}|!={2,3})\s*["']admin["']|is_service\s*(?:={2,3}|!={2,3})\s*true|isTrusted(?:Internal)?(?:User|Service)|isAdmin(?:User)?|requireAdmin(?:OrService)?)/i.test(source);
  const hasProviderGuard = /(?:stripe-signature|x-goog-channel-token|verify(?:Webhook|Signature)|verify.*state|signed.*state|hmac|WEBHOOK_(?:SECRET|TOKEN)|isValid(?:Webhook|Signature))/i.test(source);
  const hasOriginGuard = /(?:isTrustedPublicOrigin|isAllowedOrigin|trusted.*origin|allowed.*origin|origin.*(?:allow|trust))/i.test(source);
  const hasRateLimit = /(?:isRateLimited|rateLimit|REQUEST_LIMIT|rate.?limit)/i.test(source);
  const hasSpamCheck = /(?:honeypot|turnstile|captcha|anti[_-]?spam)/i.test(source);
  const usesExpensiveOrExternal = /(?:InvokeLLM|GenerateImage|SendEmail|connectors\.getConnection|await\s+fetch\s*\(|\.fetch\s*\()/i.test(source);
  const providerNamed = /(?:oauthcallback|stripewebhook|webhookhandler|drivewatch|drivesync)/i.test(name);
  const automation = /"automations"\s*:\s*\[/.test(config);
  const isHttpEndpoint = /Deno\.serve\s*\(/.test(source);
  const hasCustomSessionGuard = (
    (/public_session_key/i.test(source) && /public_session_key\s*!?={2,3}/i.test(source))
    || (/session_token_hash/i.test(source) && /StudentSessions\.filter/i.test(source))
    || (/access_code/i.test(source) && /StudentUsers\.filter/i.test(source))
  );
  const hasCustomSecretGuard = (
    /AGENT_WEBHOOK_KEY/i.test(source)
    && /authorization/i.test(source)
    && /Bearer/i.test(source)
  );
  // Explicit user-scoped boundaries that do not use a platform-admin role.
  // Keep these structural checks narrow so the preflight does not hide an
  // endpoint that only happens to mention a user or tenant field.
  const hasSelfScopedCheckoutBoundary = (
    /const\s+checkoutUserId\s*=\s*String\(user\.id\s*\|\|\s*['"]{2}\)/.test(source)
    && /const\s+checkoutUserEmail\s*=\s*String\(user\.email\s*\|\|\s*['"]{2}\)/.test(source)
    && /DIYSubscription\.filter\s*\(\s*\{\s*user_email:\s*checkoutUserEmail,\s*status:\s*\{\s*\$in:\s*\[\s*['"]active['"]\s*,\s*['"]pending['"]\s*\]\s*\}\s*\}\s*\)/s.test(source)
    && /DIYSubscription\.create\s*\(\s*\{\s*user_email:\s*checkoutUserEmail,/s.test(source)
  );
  const hasActiveTenantMembershipBoundary = (
    /TenantUserAssignment\.filter\s*\(\s*\{\s*userId:\s*user\.id,\s*status:\s*['"]active['"]\s*\}\s*\)/s.test(source)
    && /const\s+assignment\s*=\s*assignments\.find\s*\(/.test(source)
    && /candidate\.expiresAt/.test(source)
    && /tenant\.tenantType\s*!==\s*['"]reseller['"]/.test(source)
  );
  const hasCustomBoundary = (
    hasCustomSessionGuard
    || hasCustomSecretGuard
    || hasSelfScopedCheckoutBoundary
    || hasActiveTenantMembershipBoundary
  );

  return {
    name,
    isHttpEndpoint,
    hasAuth,
    hasServiceRole,
    hasAdminOrServiceGuard,
    hasProviderGuard,
    hasOriginGuard,
    hasRateLimit,
    hasSpamCheck,
    hasPublicBoundary: (hasOriginGuard && hasRateLimit) || (hasRateLimit && hasSpamCheck),
    hasCustomBoundary,
    usesExpensiveOrExternal,
    providerNamed,
    automation,
  };
}

function entityProfile(file) {
  const source = fs.readFileSync(path.join(ENTITIES_ROOT, file), 'utf8');
  const name = source.match(/"name"\s*:\s*"([^"]+)"/)?.[1] || path.basename(file, '.jsonc');
  const hasRls = /"rls"\s*:/.test(source);
  const operations = Object.fromEntries(
    ['create', 'read', 'update', 'delete'].map(operation => [
      operation,
      new RegExp('"' + operation + '"\\s*:').test(source),
    ]),
  );

  // Inspect actual schema field names rather than free-text descriptions. That
  // avoids false alarms from ordinary words such as "session" in documentation.
  const fieldNames = [...source.matchAll(/^\s{4}"([^"]+)"\s*:\s*\{/gm)].map(match => match[1]);
  const hasCredentialOrFinanceData = fieldNames.some(field =>
    /(?:token|secret|password|(?:auth|access)[_-]?(?:pin|code)|session|oauth|stripe|freshbooks|payment|billing|payout|finance|expense|receipt|bank|card|tax)/i.test(field),
  );
  const hasPersonalOrOperationalData = fieldNames.some(field =>
    /(?:email|phone|address|lead|contact|admin[_ ]?note|audit[_ ]?log|subscriber|customer|client[_ ]?id|subscription)/i.test(field),
  );

  return {
    name,
    file,
    hasRls,
    operations,
    hasCredentialOrFinanceData,
    hasPersonalOrOperationalData,
  };
}

function displayFiles(files) {
  return [...files]
    .map(file => file.replace(/^src\//, ''))
    .sort()
    .join(', ');
}

function finding(severity, code, subject, detail, files = '') {
  return { severity, code, subject, detail, files };
}

const publicFiles = publicSourceFiles();
const browserReferences = collectBrowserReferences(publicFiles);

const functionNames = fs.readdirSync(FUNCTIONS_ROOT, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fileExists(path.join(FUNCTIONS_ROOT, entry.name, 'entry.ts')))
  .map(entry => entry.name)
  .sort();

const entityFiles = fs.readdirSync(ENTITIES_ROOT)
  .filter(file => file.endsWith('.jsonc'))
  .sort();

const findings = [];

for (const name of functionNames) {
  const profile = functionProfile(name);
  if (!profile.isHttpEndpoint) continue;

  const publicCallers = browserReferences.functionFiles.get(name);
  const publicCallerFiles = publicCallers ? displayFiles(publicCallers) : '';
  const externallyCalled = Boolean(publicCallers);

  if (profile.providerNamed && !profile.hasAuth && !profile.hasProviderGuard && !profile.hasCustomBoundary) {
    findings.push(finding(
      'critical',
      'EXTERNAL_PROVIDER_ENDPOINT_WITHOUT_VERIFICATION',
      name,
      'Provider-named endpoint has neither authenticated caller verification nor a provider signature/state check.',
      publicCallerFiles,
    ));
    continue;
  }

  if (externallyCalled && profile.hasServiceRole && !profile.hasAdminOrServiceGuard && !profile.hasPublicBoundary && !profile.hasCustomBoundary) {
    findings.push(finding(
      'critical',
      'PUBLIC_SERVICE_ROLE_ENDPOINT_WITHOUT_BOUNDARY',
      name,
      'Public browser caller reaches service-role work without an admin/service or public origin/rate/spam boundary.',
      publicCallerFiles,
    ));
    continue;
  }

  if (!externallyCalled && profile.hasServiceRole && !profile.hasAuth && !profile.hasProviderGuard && !profile.hasCustomBoundary) {
    findings.push(finding(
      'critical',
      'SERVICE_ROLE_ENDPOINT_WITHOUT_AUTH',
      name,
      'Service-role operations run without checking the requesting identity.',
      profile.automation ? 'automation configuration present' : '',
    ));
    continue;
  }

  if (!externallyCalled && profile.hasServiceRole && profile.hasAuth && !profile.hasAdminOrServiceGuard && !profile.hasProviderGuard && !profile.hasCustomBoundary) {
    findings.push(finding(
      'high',
      'AUTHENTICATED_SERVICE_ROLE_ENDPOINT_WITHOUT_PRIVILEGED_BOUNDARY',
      name,
      'Any signed-in user may reach service-role work because no admin/service or provider boundary is visible.',
    ));
  }

  if (externallyCalled && profile.usesExpensiveOrExternal && !profile.hasAdminOrServiceGuard && !profile.hasPublicBoundary && !profile.hasProviderGuard && !profile.hasCustomBoundary) {
    findings.push(finding(
      'high',
      'PUBLIC_EXPENSIVE_ENDPOINT_WITHOUT_ABUSE_CONTROLS',
      name,
      'Public caller can trigger AI, email, connector, or external-network work without a visible origin/rate/spam/provider boundary.',
      publicCallerFiles,
    ));
  }
}

for (const file of entityFiles) {
  const profile = entityProfile(file);
  const publicReaders = browserReferences.entityFiles.get(profile.name);
  const publicReaderFiles = publicReaders ? displayFiles(publicReaders) : '';

  if (!profile.hasRls && profile.hasCredentialOrFinanceData) {
    findings.push(finding(
      'critical',
      'CREDENTIAL_OR_FINANCE_ENTITY_WITHOUT_RLS',
      profile.name,
      'Credential, payment, finance, session, or equivalent sensitive data has no explicit RLS rule.',
      publicReaderFiles,
    ));
    continue;
  }

  if (!profile.hasRls && profile.hasPersonalOrOperationalData && !publicReaders) {
    findings.push(finding(
      'high',
      'PRIVATE_ENTITY_WITHOUT_RLS',
      profile.name,
      'Private client, lead, contact, subscription, audit, or operational data has no explicit RLS rule.',
    ));
  }

  if (publicReaders && !profile.hasRls) {
    findings.push(finding(
      'medium',
      'PUBLIC_ENTITY_WITHOUT_EXPLICIT_WRITE_RULE',
      profile.name,
      'Public code reads this entity while the schema has no explicit write protection. Confirm public read is intended and add admin-only writes.',
      publicReaderFiles,
    ));
  }

  if (profile.hasRls && profile.hasCredentialOrFinanceData && !Object.values(profile.operations).every(Boolean)) {
    findings.push(finding(
      'high',
      'SENSITIVE_ENTITY_WITH_INCOMPLETE_RLS',
      profile.name,
      'Sensitive entity has RLS but not all create/read/update/delete operations are explicit.',
    ));
  }
}

findings.sort((a, b) =>
  severityRank[a.severity] - severityRank[b.severity]
  || a.code.localeCompare(b.code)
  || a.subject.localeCompare(b.subject),
);

const summary = {
  publicSourceFiles: publicFiles.size,
  publicFunctionCalls: browserReferences.functionFiles.size,
  publicEntityReads: browserReferences.entityFiles.size,
  functionsScanned: functionNames.length,
  entitiesScanned: entityFiles.length,
  findings: Object.fromEntries(
    Object.keys(severityRank).map(level => [level, findings.filter(item => item.severity === level).length]),
  ),
};

if (json) {
  console.log(JSON.stringify({ summary, findings }, null, 2));
} else {
  console.log('NTA security preflight');
  console.log('='.repeat(72));
  console.log(`Scanned ${summary.functionsScanned} functions and ${summary.entitiesScanned} entities.`);
  console.log(`Public surface: ${summary.publicSourceFiles} source files, ${summary.publicFunctionCalls} function calls, ${summary.publicEntityReads} entity reads.`);
  console.log(`Findings: ${summary.findings.critical} critical, ${summary.findings.high} high, ${summary.findings.medium} medium.`);

  const visible = verbose
    ? findings
    : findings.filter(item => item.severity === 'critical' || item.severity === 'high');

  for (const item of visible) {
    console.log(`\n[${item.severity.toUpperCase()}] ${item.code}`);
    console.log(`  ${item.subject}: ${item.detail}`);
    if (item.files) console.log(`  references: ${item.files}`);
  }

  if (!verbose && findings.some(item => item.severity === 'medium')) {
    console.log(`\nRun with --verbose to list ${summary.findings.medium} medium review item(s).`);
  }
}

if (strict && findings.some(item => item.severity === 'critical' || item.severity === 'high')) {
  process.exitCode = 1;
}
