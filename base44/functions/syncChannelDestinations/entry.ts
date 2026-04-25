import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function getYouTubeChannels(accessToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (data.error) throw new Error(`YouTube API error: ${data.error.message}`);
  return (data.items || []).map(ch => ({
    id: ch.id,
    name: ch.snippet?.title || ch.id,
  }));
}

async function getInstagramAccounts(accessToken) {
  const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`);
  const pagesData = await pagesRes.json();
  if (pagesData.error) throw new Error(`Facebook pages error: ${pagesData.error.message}`);
  const pages = pagesData.data || [];
  const igAccounts = [];
  for (const page of pages) {
    if (page.instagram_business_account?.id) {
      const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.instagram_business_account.id}?fields=id,name,username&access_token=${page.access_token || accessToken}`);
      const igData = await igRes.json();
      if (igData.id) {
        igAccounts.push({
          id: igData.id,
          name: igData.name || `@${igData.username}` || page.name,
          username: igData.username || '',
          facebook_page_id: page.id,
          facebook_page_name: page.name,
          access_token: page.access_token,
        });
      }
    }
  }
  return igAccounts;
}

async function refreshGoogleToken(refreshToken) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const { connection_id } = payload;

  if (!connection_id) return Response.json({ error: 'connection_id required' }, { status: 400 });

  const conns = await base44.asServiceRole.entities.ChannelConnection.filter({ id: connection_id });
  const conn = conns[0];
  if (!conn) return Response.json({ error: 'Connection not found' }, { status: 404 });
  if (!['youtube', 'instagram'].includes(conn.provider)) {
    return Response.json({ error: 'For youtube or instagram only' }, { status: 400 });
  }
  if (!conn.access_token) {
    return Response.json({ success: false, error: 'No access token — reconnect OAuth' });
  }

  let accessToken = conn.access_token;
  const syncAt = new Date().toISOString();

  // Refresh Google token if needed (YouTube)
  if (conn.provider === 'youtube' && conn.refresh_token) {
    const expiresAt = conn.expires_at ? new Date(conn.expires_at) : new Date(0);
    if (expiresAt < new Date(Date.now() + 5 * 60 * 1000)) {
      const refreshed = await refreshGoogleToken(conn.refresh_token);
      if (refreshed.access_token) {
        accessToken = refreshed.access_token;
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
          access_token: accessToken,
          expires_at: new Date(Date.now() + (refreshed.expires_in || 3600) * 1000).toISOString(),
        });
      }
    }
  }

  try {
    let destinations = [];
    if (conn.provider === 'youtube') {
      destinations = await getYouTubeChannels(accessToken);
    } else if (conn.provider === 'instagram') {
      destinations = await getInstagramAccounts(accessToken);
    }

    const autoSelect = destinations.length === 1 ? destinations[0] : null;
    const updatePayload = {
      destinations_json: JSON.stringify(destinations),
      dest_sync_at: syncAt,
      dest_sync_count: destinations.length,
      dest_sync_error: destinations.length === 0 ? 'No destinations found — ensure account has pages/channels linked' : null,
      last_sync_at: syncAt,
      error_message: null,
    };
    if (autoSelect && !conn.selected_destination_id) {
      updatePayload.selected_destination_id = autoSelect.id;
      updatePayload.selected_destination_name = autoSelect.name;
    }

    await base44.asServiceRole.entities.ChannelConnection.update(connection_id, updatePayload);

    console.log(`[syncChannelDestinations] ${conn.provider} — ${destinations.length} destinations saved`);
    return Response.json({
      success: true,
      destinations,
      auto_selected: autoSelect?.name || null,
      count: destinations.length,
    });

  } catch (err) {
    console.error(`[syncChannelDestinations] error:`, err.message);
    await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
      dest_sync_at: syncAt,
      dest_sync_error: err.message,
    });
    return Response.json({ success: false, error: err.message });
  }
});