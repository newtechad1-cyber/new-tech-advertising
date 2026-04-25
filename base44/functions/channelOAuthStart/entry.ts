import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This is the BACKEND callback URL registered in Google Cloud Console
const CALLBACK_URL = 'https://new-tech-advertising.base44.app/api/functions/channelOAuthCallback';
const APP_BASE = 'https://new-tech-advertising.base44.app';

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

  // Encode client_id and client_name in state so callback can upsert the right connection
  const statePayload = JSON.stringify({ provider, client_id, client_name: client_name || '' });
  const state = btoa(statePayload);

  // Log oauth_start
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
    const scopes = 'pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish';
    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: CALLBACK_URL,
      scope: scopes,
      response_type: 'code',
      auth_type: 'rerequest',
      state,
    });
    auth_url = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;

  } else if (provider === 'facebook') {
    const scopes = 'pages_show_list,pages_read_engagement,pages_manage_posts,business_management,instagram_basic,instagram_content_publish';
    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: `${APP_BASE}/api/functions/facebookOAuthCallback`,
      scope: scopes,
      response_type: 'code',
      auth_type: 'rerequest',
      state,
    });
    auth_url = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;

  } else {
    return Response.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
  }

  console.log(`[channelOAuthStart] provider=${provider} client_id=${client_id} auth_url_prefix=${auth_url.substring(0, 80)}`);
  return Response.json({ auth_url });
});