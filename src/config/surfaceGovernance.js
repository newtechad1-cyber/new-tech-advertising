import { classifyPageKey, requiresAuth } from './routeGovernance.js';

export const PUBLIC_ORIGIN = 'https://newtechadvertising.com';
export const PRIVATE_ORIGIN = 'https://app.newtechadvertising.com';

const PUBLIC_HOSTS = new Set([
  'newtechadvertising.com',
  'www.newtechadvertising.com',
]);

const PRIVATE_HOSTS = new Set([
  'app.newtechadvertising.com',
]);

export function resolveAppSurface(hostname = '', configuredSurface = '') {
  const configured = String(configuredSurface || '').toLowerCase();
  if (configured === 'public' || configured === 'private' || configured === 'combined') {
    return configured;
  }

  const normalizedHost = String(hostname || '').toLowerCase().split(':', 1)[0];
  if (PUBLIC_HOSTS.has(normalizedHost)) return 'public';
  if (PRIVATE_HOSTS.has(normalizedHost)) return 'private';

  // Base44 previews and local development continue to expose the combined
  // registry so maintainers can inspect both surfaces before deployment.
  return 'combined';
}

export function filterPagesForSurface(pages, surface) {
  if (surface === 'combined') return pages;

  const entries = Object.entries(pages).filter(([pageKey]) => {
    const access = classifyPageKey(pageKey);
    const publicSurfacePage = access === 'public' || access === 'noindex';

    if (surface === 'public') {
      return publicSurfacePage;
    }

    return !publicSurfacePage || pageKey === 'Login' || pageKey === 'SignupPage';
  });

  return Object.fromEntries(entries);
}

export function getSurfaceRedirectUrl({
  hostname = '',
  pathname = '/',
  search = '',
  hash = '',
  access,
}) {
  const surface = resolveAppSurface(hostname);

  if (surface === 'public' && requiresAuth(access)) {
    return `${PRIVATE_ORIGIN}${pathname || '/'}${search || ''}${hash || ''}`;
  }

  return null;
}
