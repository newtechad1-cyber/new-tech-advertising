// OAUTH_SCOPE_VERSION=2026-05-04-reduced-scopes
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/metaOAuthCallback';
const OAUTH_SCOPE_VERSION = '2026-05-04-reduced-scopes';

// HARDCODED — META_OAUTH_SCOPES env var is intentionally NOT read here.
const SCOPE = 'public_profile,email,pages_show_list';
const encoder = new TextEncoder();

function stateSigningSecret() {
  return Deno.env.get('OAUTH_STATE_SECRET')
    || Deno.env.get('GOOGLE_CLIENT_SECRET')
    || Deno.env.get('META_APP_SECRET');
}

async function createSignedState(payload) {
  const secret = stateSigningSecret();
  if (!secret) throw new Error('OAuth state signing is not configured');

  const encoded = btoa(JSON.stringify({
    ...payload,
    nonce: crypto.randomUUID(),
    issued_at: Date.now(),
  }));
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(encoded));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return encoded + '.' + signatureB64;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { accountId } = await req.json();
    if (!accountId || typeof accountId !== 'string' || accountId.length > 128) {
      return Response.json({ error: 'A valid accountId is required' }, { status: 400 });
    }

    const state = await createSignedState({
      provider: 'meta',
      account_id: accountId,
      initiated_by: user.id,
    });

    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      response_type: 'code',
      oauth_scope_version: OAUTH_SCOPE_VERSION,
      state,
    });

    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;

    console.log(`[startMetaConnect] ===== DEBUG =====`);
    console.log(`[startMetaConnect] FUNCTION_NAME=startMetaConnect`);
    console.log(`[startMetaConnect] OAUTH_SCOPE_VERSION=${OAUTH_SCOPE_VERSION}`);
    console.log(`[startMetaConnect] SCOPE=${SCOPE}`);
    console.log(`[startMetaConnect] AUTH_URL=${authUrl}`);
    console.log(`[startMetaConnect] =================`);

    return Response.json({ authUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});