const TRUSTED_APP_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);

/**
 * Validates that an incoming request originates from one of the app's trusted
 * public origins. Used to prevent unauthenticated abuse of server-side LLM and
 * integration endpoints from arbitrary third-party hosts or scripts.
 */
export function isTrustedAppOrigin(req: Request): boolean {
  try {
    const origin = req.headers.get('origin');
    if (origin && TRUSTED_APP_ORIGINS.has(origin)) {
      return true;
    }
    const referer = req.headers.get('referer');
    if (referer) {
      const url = new URL(referer);
      if (TRUSTED_APP_ORIGINS.has(url.origin)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}