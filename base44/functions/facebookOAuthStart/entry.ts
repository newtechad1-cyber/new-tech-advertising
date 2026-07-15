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

  // Use the platform facebook_pages connector
  let pages = [];
  try {
    const fbConn = await base44.asServiceRole.connectors.getConnection('facebook_pages');
    if (fbConn && fbConn.accessToken) {
      const pagesRes = await fetch("https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token", {
        headers: { "Authorization": `Bearer ${fbConn.accessToken}` }
      });
      const data = await pagesRes.json();
      if (data.data) {
        pages = data.data.map(p => ({
          id: p.id,
          name: p.name,
          access_token: p.access_token
        }));
      }
    } else {
      throw new Error("Facebook Pages connector not authorized");
    }
  } catch(e) {
    return Response.json({ error: "Failed to connect to Facebook. Please ensure Facebook Pages is connected in the chat. " + e.message }, { status: 400 });
  }

  // Create ChannelConnection
  const autoSelect = pages.length === 1 ? pages[0] : null;
  await base44.asServiceRole.entities.ChannelConnection.create({
    client_id,
    provider: 'facebook',
    status: autoSelect ? 'connected' : 'connected_no_destination',
    external_account_name: 'Platform Shared Facebook',
    external_account_id: 'platform_shared',
    destinations_json: JSON.stringify(pages),
    selected_destination_id: autoSelect ? autoSelect.id : undefined,
    selected_destination_name: autoSelect ? autoSelect.name : undefined,
    dest_sync_count: pages.length,
    dest_sync_at: new Date().toISOString(),
    last_sync_at: new Date().toISOString(),
    access_token: 'platform_managed' // Marker, actual token fetched via connector at runtime
  });

  await log(base44, {
    client_id,
    provider: 'facebook',
    event_type: 'oauth_connect',
    status: 'info',
    message: `[facebookOAuthStart] Platform Connector synced ${pages.length} pages`,
  });

  // Return a success response that simulates the OAuth callback return params
  return Response.json({ 
    success: true, 
    redirect_url: `?oauth_success=facebook&pages_count=${pages.length}${autoSelect ? '&auto_selected='+encodeURIComponent(autoSelect.name) : ''}`
  });
});