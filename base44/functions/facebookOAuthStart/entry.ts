import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── CANONICAL REDIRECT URI — never change or concatenate ─────────────────────
const FACEBOOK_REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';

// Validate at module load time — fail fast if URI was accidentally modified
if (FACEBOOK_REDIRECT_URI.split('https://').length - 1 > 1) {
  throw new Error(`[facebookOAuthStart] FATAL: FACEBOOK_REDIRECT_URI contains multiple "https://" — URI is malformed: ${FACEBOOK_REDIRECT_URI}`);
}

const FB_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'publish_video',
  'public_profile',
].join(',');

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

  const { client_id, client_name, enable_video = false } = body;
  if (!client_id) {
    return Response.json({ error: 'client_id is required' }, { status: 400 });
  }

  // Build scopes — add publish_video if video publishing is enabled
  const scopes = enable_video
    ? FB_SCOPES
    : FB_SCOPES.replace(',publish_video', '');

  // State: base64-encoded JSON with client info + nonce for CSRF
  const nonce = crypto.randomUUID();
  const statePayload = JSON.stringify({
    provider: 'facebook',
    client_id,
    client_name: client_name || '',
    nonce,
    initiated_at: new Date().toISOString(),
  });
  const state = btoa(statePayload);

  // Validate redirect URI before building the auth URL
  if (FACEBOOK_REDIRECT_URI !== 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback') {
    console.error(`[facebookOAuthStart] FATAL: redirect_uri mismatch — got: ${FACEBOOK_REDIRECT_URI}`);
    return Response.json({ error: 'redirect_uri_configuration_error' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: Deno.env.get('META_APP_ID'),
    redirect_uri: FACEBOOK_REDIRECT_URI,
    scope: scopes,
    response_type: 'code',
    state,
    auth_type: 'rerequest',
  });

  const auth_url = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;

  // Required diagnostic logging
  console.log(`[facebookOAuthStart] final_redirect_uri=${FACEBOOK_REDIRECT_URI}`);
  console.log(`[facebookOAuthStart] scope_string=${scopes}`);
  console.log(`[facebookOAuthStart] full_auth_url=${auth_url}`);
  console.log(`[facebookOAuthStart] meta_app_id=${Deno.env.get('META_APP_ID')}`);

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
      scope_string: scopes,
      nonce,
    }),
  });

  return Response.json({ auth_url });
});