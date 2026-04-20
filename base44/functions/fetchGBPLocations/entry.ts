import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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

async function getGBPLocations(accessToken) {
  // Step 1: list GBP accounts
  const accountRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountData = await accountRes.json();
  console.log('[fetchGBPLocations] accounts response:', JSON.stringify(accountData).slice(0, 300));

  if (accountData.error) {
    throw new Error(`Accounts API error: ${accountData.error.message || JSON.stringify(accountData.error)}`);
  }

  const accounts = accountData.accounts || [];
  if (!accounts.length) {
    return { locations: [], accounts_found: 0, detail: 'No GBP accounts found for this Google user. The account may not manage any Business Profiles.' };
  }

  // Step 2: fetch locations for each account
  const allLocations = [];
  for (const account of accounts) {
    const locRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode,storefrontAddress`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const locData = await locRes.json();
    console.log('[fetchGBPLocations] locations for', account.name, ':', JSON.stringify(locData).slice(0, 300));

    if (locData.error) {
      console.warn('[fetchGBPLocations] location fetch error for', account.name, ':', locData.error.message);
      continue;
    }
    const locs = locData.locations || [];
    locs.forEach(loc => allLocations.push({
      id: loc.name,       // e.g. "accounts/123/locations/456"
      name: loc.title || loc.storeCode || loc.name,
      account_name: account.accountName || account.name,
      account_id: account.name,
    }));
  }

  return {
    locations: allLocations,
    accounts_found: accounts.length,
    detail: allLocations.length === 0
      ? `Found ${accounts.length} GBP account(s) but zero locations. The account may exist but have no published locations.`
      : null,
  };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const { connection_id } = payload;

  if (!connection_id) {
    return Response.json({ error: 'connection_id required' }, { status: 400 });
  }

  // Load the connection
  const conns = await base44.asServiceRole.entities.ChannelConnection.filter({ id: connection_id });
  const conn = conns[0];
  if (!conn) return Response.json({ error: 'Connection not found' }, { status: 404 });
  if (conn.provider !== 'google_business_profile') {
    return Response.json({ error: 'This function is for google_business_profile only' }, { status: 400 });
  }

  let accessToken = conn.access_token;

  // Refresh token if expired or close to expiry
  if (conn.refresh_token) {
    const expiresAt = conn.expires_at ? new Date(conn.expires_at) : new Date(0);
    const shouldRefresh = expiresAt < new Date(Date.now() + 5 * 60 * 1000);
    if (shouldRefresh) {
      console.log('[fetchGBPLocations] refreshing token for conn:', connection_id);
      const refreshed = await refreshGoogleToken(conn.refresh_token);
      if (refreshed.access_token) {
        accessToken = refreshed.access_token;
        const newExpiry = new Date(Date.now() + (refreshed.expires_in || 3600) * 1000).toISOString();
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
          access_token: accessToken,
          expires_at: newExpiry,
        });
      } else {
        const errMsg = `Token refresh failed: ${refreshed.error} — ${refreshed.error_description || ''}`;
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
          status: 'expired',
          error_message: errMsg,
          dest_sync_error: errMsg,
          dest_sync_at: new Date().toISOString(),
        });
        return Response.json({ success: false, error: errMsg, locations: [] });
      }
    }
  }

  try {
    const { locations, accounts_found, detail } = await getGBPLocations(accessToken);

    // Auto-select if only 1 location
    const autoSelect = locations.length === 1 ? locations[0] : null;

    const updatePayload = {
      destinations_json: JSON.stringify(locations),
      dest_sync_at: new Date().toISOString(),
      dest_sync_count: locations.length,
      dest_sync_error: null,
      last_sync_at: new Date().toISOString(),
      error_message: locations.length === 0 ? (detail || 'No GBP locations found') : null,
    };
    if (autoSelect) {
      updatePayload.selected_destination_id = autoSelect.id;
      updatePayload.selected_destination_name = autoSelect.name;
    }

    await base44.asServiceRole.entities.ChannelConnection.update(connection_id, updatePayload);

    console.log(`[fetchGBPLocations] done — accounts=${accounts_found} locations=${locations.length}`);
    return Response.json({
      success: true,
      locations,
      accounts_found,
      detail,
      auto_selected: autoSelect?.name || null,
    });

  } catch (err) {
    console.error('[fetchGBPLocations] error:', err.message);
    await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
      dest_sync_at: new Date().toISOString(),
      dest_sync_error: err.message,
      error_message: `Destination sync failed: ${err.message}`,
    });
    return Response.json({ success: false, error: err.message, locations: [] });
  }
});