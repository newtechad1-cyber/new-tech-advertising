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
  const accountRaw = await accountRes.text();
  console.log(`[getGBPLocations] accounts HTTP=${accountRes.status} raw=${accountRaw.slice(0, 500)}`);
  let accountData;
  try { accountData = JSON.parse(accountRaw); } catch { accountData = {}; }

  const accounts = accountData.accounts || [];
  if (!accounts.length) {
    const errMsg = accountData.error?.message || null;
    throw Object.assign(
      new Error(errMsg || 'No Google Business Profile accounts found for this Google login.'),
      { gbp_step: 'accounts_empty', raw: accountRaw.slice(0, 300) }
    );
  }

  const allLocations = [];
  for (const account of accounts) {
    const locRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress,metadata`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const locRaw = await locRes.text();
    console.log(`[getGBPLocations] locations for ${account.name} HTTP=${locRes.status} raw=${locRaw.slice(0, 500)}`);
    let locData;
    try { locData = JSON.parse(locRaw); } catch { locData = {}; }
    const locs = locData.locations || [];
    locs.forEach(loc => allLocations.push({
      id: loc.name,
      name: loc.title || loc.name,
      account_name: account.accountName || account.name,
      account_id: account.name,
    }));
  }

  if (!allLocations.length) {
    throw Object.assign(
      new Error('Google account found, but no GBP locations are accessible.'),
      { gbp_step: 'locations_empty' }
    );
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

async function getInstagramAccounts(accessToken) {
  // Fetch Facebook pages, then find linked Instagram Business accounts
  const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`);
  const pagesData = await pagesRes.json();
  const pages = pagesData.data || [];
  const igAccounts = [];
  for (const page of pages) {
    if (page.instagram_business_account?.id) {
      // Fetch IG account details
      const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.instagram_business_account.id}?fields=id,name,username,profile_picture_url&access_token=${page.access_token || accessToken}`);
      const igData = await igRes.json();
      if (igData.id) {
        igAccounts.push({
          id: igData.id,
          name: igData.name || igData.username || `@${igData.username}` || page.name,
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
    let grantedScopes = null;
    let accountName = '';
    let accountId = '';
    let destinations = [];

    // ---- GOOGLE FLOW ----
    if (isGoogle) {
      const tokenData = await exchangeGoogleCode(code);
      console.log(`[channelOAuthCallback] Google token exchange — has_access_token=${!!tokenData.access_token} has_refresh_token=${!!tokenData.refresh_token} error=${tokenData.error || 'none'}`);

      if (tokenData.error) {
        await log(base44, { client_id: client_id || null, provider, event_type: 'oauth_callback', status: 'failed', message: `token_exchange_failed — ${tokenData.error}: ${tokenData.error_description || ''}` });
        throw new Error(`Token exchange failed: ${tokenData.error} — ${tokenData.error_description || ''}`);
      }

      await log(base44, {
        client_id: client_id || null,
        provider,
        event_type: 'oauth_callback',
        status: 'success',
        message: `token_exchange_success — has_refresh_token=${!!tokenData.refresh_token} scopes=${tokenData.scope || 'n/a'}`,
        payload: JSON.stringify({ has_access_token: true, has_refresh_token: !!tokenData.refresh_token, scope: tokenData.scope }),
      });

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || null;
      expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;
      // Save scopes — use what Google returned, fall back to what we requested
      const GBP_REQUESTED_SCOPES = 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      const YOUTUBE_REQUESTED_SCOPES = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      grantedScopes = tokenData.scope || (provider === 'youtube' ? YOUTUBE_REQUESTED_SCOPES : GBP_REQUESTED_SCOPES);

      const profile = await getGoogleProfile(accessToken);
      accountName = profile.name || profile.email || 'Google Account';
      accountId = profile.id || '';

      // Fetch destinations
      if (provider === 'google_business_profile') {
        try {
          destinations = await getGBPLocations(accessToken);
          console.log(`[channelOAuthCallback] GBP locations found: ${destinations.length}`);
        } catch (gbpErr) {
          console.error(`[channelOAuthCallback] GBP fetch error: ${gbpErr.message} step=${gbpErr.gbp_step || 'unknown'}`);
          // Save the connection with what we have so the token isn't lost, then re-throw
          const partialPayload = {
            client_id: client_id || 'unknown',
            client_name: client_name || '',
            provider,
            external_account_id: accountId,
            external_account_name: accountName,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            scopes: grantedScopes || null,
            status: 'connected_no_destination',
            error_message: gbpErr.message,
            last_sync_at: new Date().toISOString(),
            destinations_json: JSON.stringify([]),
            dest_sync_at: new Date().toISOString(),
            dest_sync_count: 0,
            dest_sync_error: gbpErr.message,
          };
          const existing = client_id ? await base44.asServiceRole.entities.ChannelConnection.filter({ client_id, provider }) : [];
          if (existing.length > 0) {
            await base44.asServiceRole.entities.ChannelConnection.update(existing[0].id, partialPayload);
          } else {
            await base44.asServiceRole.entities.ChannelConnection.create(partialPayload);
          }
          await log(base44, { client_id: client_id || null, provider, event_type: 'oauth_callback', status: 'warning', message: `gbp_destinations_failed — ${gbpErr.message}`, error_details: gbpErr.raw || null });
          return new Response(null, {
            status: 302,
            headers: { Location: `${RETURN_PAGE}?oauth_success=${encodeURIComponent(provider)}&account=${encodeURIComponent(accountName)}&gbp_error=${encodeURIComponent(gbpErr.message)}` },
          });
        }
      } else if (provider === 'youtube') {
        destinations = await getYouTubeChannels(accessToken);
        console.log(`[channelOAuthCallback] YouTube channels found: ${destinations.length}`);
      }

    // ---- META FLOW ----
    } else if (isMeta) {
      const tokenData = await exchangeMetaCode(code);
      if (tokenData.error) {
        await log(base44, { client_id: client_id || null, provider, event_type: 'oauth_callback', status: 'failed', message: `token_exchange_failed — ${JSON.stringify(tokenData.error)}` });
        throw new Error(`Meta token exchange failed: ${JSON.stringify(tokenData.error)}`);
      }

      await log(base44, {
        client_id: client_id || null,
        provider,
        event_type: 'oauth_callback',
        status: 'success',
        message: `token_exchange_success — provider=${provider}`,
      });

      accessToken = tokenData.access_token;

      if (provider === 'instagram') {
        destinations = await getInstagramAccounts(accessToken);
        accountName = destinations[0]?.name || destinations[0]?.username || 'Instagram Account';
        console.log(`[channelOAuthCallback] Instagram accounts found: ${destinations.length}`);
      } else {
        const pages = await getMetaPages(accessToken);
        accountName = pages[0]?.name || 'Meta Account';
        destinations = pages;
      }

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

    // Log destination fetch result
    await log(base44, {
      client_id: client_id || null,
      provider,
      event_type: destinations.length === 0 ? 'oauth_callback' : 'oauth_callback',
      status: destinations.length === 0 ? 'warning' : 'success',
      message: destinations.length === 0
        ? `destinations_fetch_empty — provider=${provider} count=0`
        : `destinations_fetch_success — provider=${provider} count=${destinations.length}`,
      payload: JSON.stringify(destinations.slice(0, 5)),
    });

    // ---- STATUS LOGIC ----
    const autoSelectDest = destinations.length === 1 ? destinations[0] : null;
    let connStatus;
    let connError = null;
    if (destinations.length === 0) {
      connStatus = 'error';
      connError = `No destinations found for ${provider}. Check your account has pages, channels, or locations.`;
    } else if (destinations.length === 1) {
      connStatus = 'ready';
    } else {
      connStatus = 'connected_no_destination';
    }

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
      scopes: grantedScopes || null,
      status: connStatus,
      error_message: connError,
      last_sync_at: syncAt,
      destinations_json: JSON.stringify(destinations),
      dest_sync_at: syncAt,
      dest_sync_count: destinations.length,
      dest_sync_error: connStatus === 'error' ? connError : null,
      selected_destination_id: autoSelectDest?.id || null,
      selected_destination_name: autoSelectDest?.name || null,
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
      event_type: connStatus === 'ready' ? 'oauth_connect' : 'oauth_callback',
      status: connStatus === 'error' ? 'failed' : 'success',
      message: connStatus === 'ready'
        ? `channel_ready — conn_id=${savedConn?.id} account=${accountName} dest=${autoSelectDest?.name}`
        : connStatus === 'connected_no_destination'
        ? `destination_required — conn_id=${savedConn?.id} account=${accountName} dests=${destinations.length}`
        : `publish_blocked_no_destination — conn_id=${savedConn?.id} error=${connError}`,
      payload: JSON.stringify({ connection_id: savedConn?.id, account_name: accountName, destinations_count: destinations.length, status: connStatus }),
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