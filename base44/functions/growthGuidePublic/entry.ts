import { createClientFromRequest } from 'npm:@base44/sdk@0.8.41';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);

function isTrustedPublicOrigin(req) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  const trustedService = user?.role === 'admin' || user?.is_service === true;

  if (!trustedService && !isTrustedPublicOrigin(req)) {
    return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
  }

  return Response.json({ error: 'Guide setup in progress' }, { status: 503 });
});
