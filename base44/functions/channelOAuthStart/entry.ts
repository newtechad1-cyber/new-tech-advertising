// OAUTH_SCOPE_VERSION=2026-05-04-reduced-scopes
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALLBACK_URL = 'https://new-tech-advertising.base44.app/api/functions/channelOAuthCallback';
const APP_BASE = 'https://new-tech-advertising.base44.app';
const OAUTH_SCOPE_VERSION = '2026-05-04-reduced-scopes';

// HARDCODED — META_OAUTH_SCOPES env var is intentionally NOT read here.
const META_SCOPES_FACEBOOK = 'public_profile,email,pages_show_list';
const META_SCOPES_INSTAGRAM = 'public_profile,email,pages_show_list,instagram_basic,instagram_content_publish';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { provider, client_id, client_name } = body;

  if (!provider || !client_id) {
    return Response.json({ error: 'provider and client_id are required' }, { status: 400 });
  }

  const statePayload = JSON.stringify({ provider, client_id, client_name: client_name || '' });
  const state = btoa(statePayload);

  await base44.asServiceRole.entities.PostingLog.create({
    client_id,
    provider,
    event_type: 'oauth_connect',
    event_time: new Date().toISOString(),
    status: 'info',
    message: `oauth_start — provider=${provider} client=${client_name || client_id}`,
    payload: JSON.stringify({ provider, client_id, client_name, callback_url: CALLBACK_URL }),
  });

  let auth_url = '';

  if (provider === 'google_business_profile') {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const params = new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      redirect_uri: CALLBACK_URL,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    });
    auth_url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  } else if (provider === 'youtube') {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const params = new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      redirect_uri: CALLBACK_URL,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      state,
    });
    auth_url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  } else if (provider === 'instagram') {
    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: CALLBACK_URL,
      scope: META_SCOPES_INSTAGRAM,
      response_type: 'code',
      auth_type: 'rerequest',
      oauth_scope_version: OAUTH_SCOPE_VERSION,
      state,
    });
    auth_url = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;

  } else if (provider === 'facebook') {
    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: `${APP_BASE}/api/functions/facebookOAuthCallback`,
      scope: META_SCOPES_FACEBOOK,
      response_type: 'code',
      auth_type: 'rerequest',
      oauth_scope_version: OAUTH_SCOPE_VERSION,
      state,
    });
    auth_url = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;

  } else {
    return Response.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
  }

  const isMeta = provider === 'facebook' || provider === 'instagram';
  const scope = provider === 'facebook' ? META_SCOPES_FACEBOOK : provider === 'instagram' ? META_SCOPES_INSTAGRAM : 'google-scopes';

  console.log(`[channelOAuthStart] ===== DEBUG =====`);
  console.log(`[channelOAuthStart] FUNCTION_NAME=channelOAuthStart`);
  console.log(`[channelOAuthStart] OAUTH_SCOPE_VERSION=${OAUTH_SCOPE_VERSION}`);
  console.log(`[channelOAuthStart] provider=${provider}`);
  console.log(`[channelOAuthStart] SCOPE=${scope}`);
  console.log(`[channelOAuthStart] AUTH_URL=${auth_url}`);
  console.log(`[channelOAuthStart] =================`);

  return Response.json({ auth_url });
});