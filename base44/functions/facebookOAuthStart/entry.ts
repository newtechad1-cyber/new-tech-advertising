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

  // Use env-driven scopes — default to public_profile until Meta app is approved for page scopes
  const SCOPE = Deno.env.get('META_OAUTH_SCOPES') || 'public_profile';

  const configId = Deno.env.get('META_FACEBOOK_LOGIN_CONFIG_ID');

  const oauthParams = {
    client_id: appId,
    redirect_uri: FACEBOOK_REDIRECT_URI,
    state,
    response_type: 'code',
    scope: SCOPE,
    auth_type: 'rerequest',
  };

  // If a Facebook Login for Business config_id is set, include it
  // (it manages permissions in the Meta app dashboard instead of the scope param)
  if (configId) {
    oauthParams.config_id = configId;
  }

  const params = new URLSearchParams(oauthParams);
  const auth_url = `https://www.facebook.com/${META_OAUTH_VERSION}/dialog/oauth?${params.toString()}`;

  console.log(`[facebookOAuthStart] final_redirect_uri=${FACEBOOK_REDIRECT_URI}`);
  console.log(`[facebookOAuthStart] config_id=${configId || '(none — using scope param)'}`);
  console.log(`[facebookOAuthStart] scope=${SCOPE}`);
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