import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALLBACK_URL = 'https://new-tech-advertising.base44.app/api/functions/channelOAuthCallback';
const APP_BASE = 'https://new-tech-advertising.base44.app';
const RETURN_PAGE = `${APP_BASE}/agency/channel-connections`;

async function log(base44, data) {
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('[channelOAuthCallback] log failed:', e.message);
  }
}

async function exchangeGoogleCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
      redirect_uri: CALLBACK_URL,
      grant_type: 'authorization_code',
    }),
  });
  return res.json();
}

async function exchangeMetaCode(code) {
  const res = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get('META_APP_ID'),
      client_secret: Deno.env.get('META_APP_SECRET'),
      redirect_uri: CALLBACK_URL,
    }),
  });
  return res.json();
}

async function getGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

async function getGBPLocations(accessToken) {
  // Step 1: get account list
  const accountRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountData = await accountRes.json();
  const accounts = accountData.accounts || [];
  if (!accounts.length) return [];

  const allLocations = [];
  for (const account of accounts) {
    const locRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const locData = await locRes.json();
    const locs = locData.locations || [];
    locs.forEach(loc => allLocations.push({
      id: loc.name,
      name: loc.title || loc.storeCode || loc.name,
      account_name: account.accountName,
    }));
  }
  return allLocations;
}

async function getYouTubeChannels(accessToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  const items = data.items || [];
  return items.map(ch => ({
    id: ch.id,
    name: ch.snippet?.title || ch.id,
  }));
}

async function getMetaPages(accessToken) {
  const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${accessToken}`);
  const data = await res.json();
  return (data.data || []).map(p => ({ id: p.id, name: p.name, access_token: p.access_token, category: p.category }));
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Only handle GET (Google/Meta redirect here)
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const code = url.searchParams.get('code');
  const stateRaw = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');

  // Create a service-role client (no user auth cookie on redirect)
  const base44 = createClientFromRequest(req);

  console.log(`[channelOAuthCallback] received — has_code=${!!code} has_state=${!!stateRaw} error=${errorParam || 'none'}`);

  // --- User denied access ---
  if (errorParam) {
    await log(base44, {
      event_type: 'oauth_callback',
      status: 'failed',
      message: `OAuth denied by user: ${errorDesc || errorParam}`,
      error_details: errorParam,
    });
    return new Response(null, {
      status: 302,
      headers: { Location: `${RETURN_PAGE}?oauth_error=${encodeURIComponent(errorDesc || errorParam)}` },
    });
  }

  if (!code || !stateRaw) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${RETURN_PAGE}?oauth_error=missing_code_or_state` },
    });
  }

  // --- Decode state ---
  let stateData = {};
  try {
    stateData = JSON.parse(atob(stateRaw));
  } catch (e) {
    // fallback: treat state as raw provider string (legacy)
    stateData = { provider: stateRaw, client_id: null, client_name: '' };
  }

  const { provider, client_id, client_name } = stateData;

  await log(base44, {
    client_id: client_id || null,
    provider: provider || 'unknown',
    event_type: 'oauth_callback',
    status: 'info',
    message: `OAuth callback received — provider=${provider} client=${client_name || client_id || 'unknown'}`,
    payload: JSON.stringify({ provider, client_id, client_name, has_code: true }),
  });

  try {
    const isGoogle = provider === 'google_business_profile' || provider === 'youtube';
    const isMeta = provider === 'facebook' || provider === 'instagram';

    let accessToken = null;
    let refreshToken = null;
    let expiresAt = null;
    let accountName = '';
    let accountId = '';
    let destinations = [];

    // ---- GOOGLE FLOW ----
    if (isGoogle) {
      const tokenData = await exchangeGoogleCode(code);
      console.log(`[channelOAuthCallback] Google token exchange — has_access_token=${!!tokenData.access_token} has_refresh_token=${!!tokenData.refresh_token} error=${tokenData.error || 'none'}`);

      if (tokenData.error) {
        throw new Error(`Token exchange failed: ${tokenData.error} — ${tokenData.error_description || ''}`);
      }

      await log(base44, {
        client_id: client_id || null,
        provider,
        event_type: 'oauth_callback',
        status: 'success',
        message: `Token exchange success — has_refresh_token=${!!tokenData.refresh_token}`,
        payload: JSON.stringify({ has_access_token: true, has_refresh_token: !!tokenData.refresh_token }),
      });

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || null;
      expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;

      const profile = await getGoogleProfile(accessToken);
      accountName = profile.name || profile.email || 'Google Account';
      accountId = profile.id || '';

      // Fetch destinations
      if (provider === 'google_business_profile') {
        destinations = await getGBPLocations(accessToken);
        console.log(`[channelOAuthCallback] GBP locations found: ${destinations.length}`);
      } else if (provider === 'youtube') {
        destinations = await getYouTubeChannels(accessToken);
        console.log(`[channelOAuthCallback] YouTube channels found: ${destinations.length}`);
      }

    // ---- META FLOW ----
    } else if (isMeta) {
      const tokenData = await exchangeMetaCode(code);
      if (tokenData.error) {
        throw new Error(`Meta token exchange failed: ${JSON.stringify(tokenData.error)}`);
      }

      await log(base44, {
        client_id: client_id || null,
        provider,
        event_type: 'oauth_callback',
        status: 'success',
        message: `Meta token exchange success`,
      });

      accessToken = tokenData.access_token;
      const pages = await getMetaPages(accessToken);
      accountName = pages[0]?.name || 'Meta Account';
      destinations = pages;

    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    await log(base44, {
      client_id: client_id || null,
      provider,
      event_type: 'oauth_callback',
      status: 'info',
      message: `Destinations fetched — count=${destinations.length}`,
      payload: JSON.stringify(destinations.slice(0, 5)),
    });

    // ---- UPSERT ChannelConnection ----
    const autoSelectDest = destinations.length === 1 ? destinations[0] : null;

    const syncAt = new Date().toISOString();
    const connPayload = {
      client_id: client_id || 'unknown',
      client_name: client_name || '',
      provider,
      external_account_id: accountId,
      external_account_name: accountName,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      status: 'connected',
      last_sync_at: syncAt,
      destinations_json: JSON.stringify(destinations),
      dest_sync_at: syncAt,
      dest_sync_count: destinations.length,
      dest_sync_error: destinations.length === 0 && (provider === 'google_business_profile' || provider === 'youtube')
        ? 'Zero destinations returned at OAuth time — use Refresh Locations to retry'
        : null,
      selected_destination_id: autoSelectDest?.id || null,
      selected_destination_name: autoSelectDest?.name || null,
      error_message: null,
    };

    // Find existing connection for this client+provider
    let existingConns = [];
    if (client_id) {
      existingConns = await base44.asServiceRole.entities.ChannelConnection.filter({ client_id, provider });
    }

    let savedConn;
    if (existingConns.length > 0) {
      savedConn = await base44.asServiceRole.entities.ChannelConnection.update(existingConns[0].id, connPayload);
    } else {
      savedConn = await base44.asServiceRole.entities.ChannelConnection.create(connPayload);
    }

    await log(base44, {
      client_id: client_id || null,
      provider,
      event_type: 'oauth_connect',
      status: 'success',
      message: `ChannelConnection upserted — id=${savedConn?.id} account=${accountName} destinations=${destinations.length}`,
      payload: JSON.stringify({ connection_id: savedConn?.id, account_name: accountName, destinations_count: destinations.length }),
    });

    console.log(`[channelOAuthCallback] SUCCESS — provider=${provider} client=${client_id} conn_id=${savedConn?.id}`);

    return new Response(null, {
      status: 302,
      headers: { Location: `${RETURN_PAGE}?oauth_success=${encodeURIComponent(provider)}&account=${encodeURIComponent(accountName)}` },
    });

  } catch (err) {
    console.error(`[channelOAuthCallback] ERROR — provider=${provider} error=${err.message}`);

    await log(base44, {
      client_id: client_id || null,
      provider: provider || 'unknown',
      event_type: 'oauth_callback',
      status: 'failed',
      message: `OAuth callback failed: ${err.message}`,
      error_details: err.message,
    });

    return new Response(null, {
      status: 302,
      headers: { Location: `${RETURN_PAGE}?oauth_error=${encodeURIComponent(err.message)}` },
    });
  }
});