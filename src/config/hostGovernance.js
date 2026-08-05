import { classifyAppRoute, requiresAuth } from './routeGovernance.js';

export const PUBLIC_HOST = 'newtechadvertising.com';
export const APP_HOST = 'app.newtechadvertising.com';

const APP_ENTRY_ROUTES = [/^\/login\/?$/i, /^\/signup\/?$/i];
const APP_WORKFLOW_PREFIXES = ['/approval/', '/c/', '/client/'];

export function routeSurface(pathname, registeredPageKeys = []) {
  const normalized = String(pathname || '/').toLowerCase();
  if (APP_ENTRY_ROUTES.some((pattern) => pattern.test(normalized))) return 'app';
  if (APP_WORKFLOW_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return 'app';

  const access = classifyAppRoute(pathname, registeredPageKeys);
  return requiresAuth(access) ? 'app' : 'public';
}

export function canonicalHostForRoute(pathname, registeredPageKeys = []) {
  return routeSurface(pathname, registeredPageKeys) === 'app' ? APP_HOST : PUBLIC_HOST;
}

export function wrongHostRedirect({ hostname, pathname, search = '', hash = '' }, registeredPageKeys = []) {
  const knownProductionHost = hostname === PUBLIC_HOST || hostname === APP_HOST;
  if (!knownProductionHost) return null;

  const canonicalHost = canonicalHostForRoute(pathname, registeredPageKeys);
  if (hostname === canonicalHost) return null;

  const destinationPath = hostname === APP_HOST && pathname === '/' ? '/agency' : pathname;
  return `https://${canonicalHost}${destinationPath}${search}${hash}`;
}
