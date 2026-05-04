// OAUTH_SCOPE_VERSION=2026-05-04-reduced-scopes
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FACEBOOK_REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';
const META_OAUTH_VERSION = 'v21.0';
const OAUTH_SCOPE_VERSION = '2026-05-04-reduced-scopes';

// HARDCODED — META_OAUTH_SCOPES env var is intentionally NOT read here.
const SCOPE = 'public_profile,email,pages_show_list';

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
  try { body = await req.json(); } catch (_) {}

  const { client_id, client_name } = body;
  if (!client_id) {
    return Response.json({ error: 'client_id is required' }, { status: 400 });
  }

  const appId = Deno.env.get('META_APP_ID');
  if (!appId) {
    return Response.json({ error: 'missing_meta_app_id' }, { status: 500 });
  }

  const nonce = crypto.randomUUID();
  const statePayload = { provider: 'facebook', client_id, client_name: client_name || '', nonce, initiated_at: new Date().toISOString() };
  const state = btoa(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    state,
    response_type: 'code',
    scope: SCOPE,
    auth_type: 'rerequest',
    oauth_scope_version: OAUTH_SCOPE_VERSION,
  });

  const auth_url = `https://www.facebook.com/${META_OAUTH_VERSION}/dialog/oauth?${params.toString()}`;

  console.log(`[facebookOAuthStart] ===== DEBUG =====`);
  console.log(`[facebookOAuthStart] FUNCTION_NAME=facebookOAuthStart`);
  console.log(`[facebookOAuthStart] OAUTH_SCOPE_VERSION=${OAUTH_SCOPE_VERSION}`);
  console.log(`[facebookOAuthStart] SCOPE=${SCOPE}`);
  console.log(`[facebookOAuthStart] AUTH_URL=${auth_url}`);
  console.log(`[facebookOAuthStart] =================`);

  await log(base44, {
    client_id,
    provider: 'facebook',
    event_type: 'oauth_connect',
    status: 'info',
    message: `[facebookOAuthStart] FUNCTION_NAME=facebookOAuthStart OAUTH_SCOPE_VERSION=${OAUTH_SCOPE_VERSION} SCOPE=${SCOPE}`,
    payload: JSON.stringify({ auth_url, scope: SCOPE, nonce }),
  });

  return Response.json({ auth_url });
});