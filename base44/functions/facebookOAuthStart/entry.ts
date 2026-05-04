import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FACEBOOK_REDIRECT_URI =
  'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';

const META_OAUTH_VERSION = 'v19.0';

async function log(base44, data) {
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('[facebookOAuthStart] log failed:', e.message);
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body = {};
  try {
    body = await req.json();
  } catch (_) {}

  const { client_id, client_name } = body;
  if (!client_id) {
    return Response.json({ error: 'client_id is required' }, { status: 400 });
  }

  const appId = Deno.env.get('META_APP_ID');

  if (!appId) {
    return Response.json({ error: 'missing_meta_app_id' }, { status: 500 });
  }

  if (FACEBOOK_REDIRECT_URI.split('https://').length - 1 > 1) {
    return Response.json({ error: 'redirect_uri_malformed' }, { status: 500 });
  }

  const nonce = crypto.randomUUID();
  const statePayload = {
    provider: 'facebook',
    client_id,
    client_name: client_name || '',
    nonce,
    initiated_at: new Date().toISOString(),
  };
  const state = btoa(JSON.stringify(statePayload));

  // Hardcoded correct Facebook OAuth scopes — NEVER use META_APP_SECRET here.
  // META_OAUTH_SCOPES env var is validated below to ensure it only contains permission names.
  const CORRECT_SCOPES = 'public_profile,email,pages_show_list';

  const envScopes = Deno.env.get('META_OAUTH_SCOPES') || '';
  // Safety guard: if the env var looks like a secret (contains non-permission characters like $ or is very long),
  // ignore it and fall back to the hardcoded correct scopes.
  const scopeIsSafe = envScopes && /^[a-zA-Z0-9_,\s]+$/.test(envScopes) && envScopes.length < 300;
  const SCOPE = scopeIsSafe ? envScopes.trim() : CORRECT_SCOPES;

  if (envScopes && !scopeIsSafe) {
    console.error(`[facebookOAuthStart] SCOPE_GUARD: META_OAUTH_SCOPES contains invalid characters or looks like a secret — ignoring it. Using hardcoded correct scopes instead. Value was: ${envScopes.slice(0, 30)}...`);
  }

  const oauthParams = {
    client_id: appId,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    state,
    response_type: 'code',
    scope: SCOPE,
    auth_type: 'rerequest',
  };

  const params = new URLSearchParams(oauthParams);
  const auth_url = `https://www.facebook.com/${META_OAUTH_VERSION}/dialog/oauth?${params.toString()}`;

  // DEBUG: log all authorize URL parameters (never logs App Secret)
  console.log(`[facebookOAuthStart] === AUTHORIZE URL PARAMS ===`);
  console.log(`[facebookOAuthStart] client_id (app_id)=${appId}`);
  console.log(`[facebookOAuthStart] redirect_uri=${FACEBOOK_REDIRECT_URI}`);
  console.log(`[facebookOAuthStart] scope=${SCOPE}`);
  console.log(`[facebookOAuthStart] scope_source=${scopeIsSafe ? 'META_OAUTH_SCOPES env' : 'hardcoded_correct_scopes'}`);
  console.log(`[facebookOAuthStart] full_auth_url=${auth_url}`);

  await log(base44, {
    client_id,
    provider: 'facebook',
    event_type: 'oauth_connect',
    status: 'info',
    message: `Facebook OAuth flow started for client ${client_name || client_id}`,
    payload: JSON.stringify({
      client_id,
      client_name,
      final_redirect_uri: FACEBOOK_REDIRECT_URI,
      scope: SCOPE,
      nonce,
    }),
  });

  return Response.json({ auth_url });
});