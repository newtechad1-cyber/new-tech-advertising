import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Debug endpoint — returns which Meta App ID, redirect URIs, and scopes are loaded.
 * Accessible only to authenticated admin users.
 * Call: base44.functions.invoke('metaOAuthDebug', {})
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const appId = Deno.env.get('META_APP_ID') || '(not set)';
  const appSecretSet = !!(Deno.env.get('META_APP_SECRET'));
  const scopes = Deno.env.get('META_OAUTH_SCOPES') || '(not set — fallback: public_profile)';
  const configId = Deno.env.get('META_FACEBOOK_LOGIN_CONFIG_ID') || '(not set)';

  const facebookCallbackUri = 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';
  const channelCallbackUri = 'https://new-tech-advertising.base44.app/api/functions/channelOAuthCallback';

  return Response.json({
    meta_app_id: appId,
    meta_app_secret_set: appSecretSet,
    meta_oauth_scopes: scopes,
    meta_facebook_login_config_id: configId,
    facebook_redirect_uri: facebookCallbackUri,
    channel_callback_uri: channelCallbackUri,
    note: 'To switch to NTA Connections app: update META_APP_ID and META_APP_SECRET secrets in dashboard settings.',
  });
});