import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/socialOAuth';
const GOOGLE_REDIRECT_URI = 'https://new-tech-advertising.base44.app/OauthCallback';

// ─── Auth URL builders ────────────────────────────────────────────────────────

function getGoogleAuthUrl(platform) {
  const scopes = platform === 'youtube'
    ? 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly openid email profile'
    : 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.profile';
  const params = new URLSearchParams({
    client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state: platform,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function getMetaAuthUrl(platform) {
  const scopes = 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish,public_profile';
  const params = new URLSearchParams({
    client_id: Deno.env.get('META_APP_ID'),
    redirect_uri: REDIRECT_URI,
    scope: scopes,
    response_type: 'code',
    state: platform,
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
}

function getTikTokAuthUrl() {
  const params = new URLSearchParams({
    client_key: Deno.env.get('TIKTOK_CLIENT_KEY'),
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'user.info.basic,video.upload,video.publish',
    state: 'tiktok',
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
}

// ─── Token exchange ───────────────────────────────────────────────────────────

async function exchangeGoogleCode(code) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
      redirect_uri: GOOGLE_REDIRECT_URI,
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
      redirect_uri: REDIRECT_URI,
    }),
  });
  return res.json();
}

async function exchangeTikTokCode(code) {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body: new URLSearchParams({
      code,
      client_key: Deno.env.get('TIKTOK_CLIENT_KEY'),
      client_secret: Deno.env.get('TIKTOK_CLIENT_SECRET'),
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  return res.json();
}

// ─── Profile / destination fetchers ──────────────────────────────────────────

async function getGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

async function getTikTokProfile(accessToken) {
  const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data.data?.user;
}

/**
 * Fetch Facebook pages as destinations.
 * Returns array of { id, name, access_token }
 */
async function fetchFacebookDestinations(accessToken) {
  const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,link&access_token=${accessToken}`);
  const data = await res.json();
  console.log(`[socialOAuth] FB pages API response: error=${data.error?.message || 'none'} count=${data.data?.length || 0}`);
  if (data.error) throw new Error(`FB pages error: ${data.error.message}`);
  return (data.data || []).map(p => ({ id: p.id, name: p.name, access_token: p.access_token }));
}

/**
 * Fetch Instagram Business accounts linked to FB pages.
 * Returns array of { id, name, page_id, page_access_token }
 */
async function fetchInstagramDestinations(accessToken) {
  const pages = await fetchFacebookDestinations(accessToken);
  const destinations = [];
  for (const page of pages) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account{id,name,username}&access_token=${page.access_token}`);
    const data = await res.json();
    const ig = data.instagram_business_account;
    if (ig?.id) {
      destinations.push({
        id: ig.id,
        name: ig.name || ig.username || page.name,
        page_id: page.id,
        page_access_token: page.access_token,
      });
    }
  }
  console.log(`[socialOAuth] Instagram destinations found: ${destinations.length}`);
  return destinations;
}

/**
 * Fetch GBP locations as destinations.
 */
async function fetchGBPDestinations(accessToken) {
  const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountsData = await accountsRes.json();
  console.log(`[socialOAuth] GBP accounts API: error=${accountsData.error?.message || 'none'} count=${accountsData.accounts?.length || 0}`);
  if (accountsData.error) throw new Error(`GBP accounts error: ${accountsData.error.message}`);

  const destinations = [];
  for (const acct of (accountsData.accounts || [])) {
    const locRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${acct.name}/locations?readMask=name,title`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const locData = await locRes.json();
    for (const loc of (locData.locations || [])) {
      destinations.push({ id: loc.name, name: loc.title || loc.name });
    }
  }
  console.log(`[socialOAuth] GBP locations found: ${destinations.length}`);
  return destinations;
}

/**
 * Fetch YouTube channels as destinations.
 */
async function fetchYouTubeDestinations(accessToken) {
  const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  console.log(`[socialOAuth] YouTube channels API: error=${data.error?.message || 'none'} count=${data.items?.length || 0}`);
  if (data.error) throw new Error(`YouTube channels error: ${data.error.message}`);
  return (data.items || []).map(ch => ({ id: ch.id, name: ch.snippet?.title || ch.id }));
}

// ─── Upsert helper ────────────────────────────────────────────────────────────

async function upsertSocialAccount(base44, platform, payload) {
  const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform });
  if (existing.length > 0) {
    await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
    return existing[0].id;
  } else {
    const created = await base44.asServiceRole.entities.SocialAccount.create(payload);
    return created.id;
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // ── GET: OAuth callback from provider ──────────────────────────────────────
  if (req.method === 'GET') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return new Response(
        `<html><body><script>window.opener?.postMessage({type:'oauth_error',platform:'${state}',error:'${error}'},'*');window.close();</script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (url.searchParams.get('debug') === '1') {
      return Response.json({
        tiktok_client_key_set: !!Deno.env.get('TIKTOK_CLIENT_KEY'),
        meta_app_id_set: !!Deno.env.get('META_APP_ID'),
        google_client_id_set: !!Deno.env.get('GOOGLE_CLIENT_ID'),
        redirect_uri: REDIRECT_URI,
      });
    }

    if (!code || !state) {
      return Response.json({ error: 'Missing code or state' }, { status: 400 });
    }

    const requestId = crypto.randomUUID();
    console.log(`[socialOAuth] GET callback — state=${state} request_id=${requestId}`);

    let provider = state;
    if (state === 'google_my_business') provider = 'google_my_business';
    const isGoogle = provider === 'google_my_business' || provider === 'youtube';
    const isMeta = provider === 'facebook' || provider === 'instagram';

    try {
      const base44 = createClientFromRequest(req);
      let destinations = [];
      let accountName = provider;
      let platformUserId = '';
      let metadata = {};

      if (isGoogle) {
        const tokenData = await exchangeGoogleCode(code);
        console.log(`[socialOAuth] Google token — has_access_token=${!!tokenData.access_token} has_refresh_token=${!!tokenData.refresh_token} scopes=${tokenData.scope || 'n/a'} error=${tokenData.error || 'none'}`);
        if (tokenData.error) throw new Error(`Google token error: ${tokenData.error} — ${tokenData.error_description}`);

        const profile = await getGoogleProfile(tokenData.access_token);
        accountName = profile.name || profile.email || provider;
        platformUserId = profile.id || '';
        const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;

        metadata = {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          scope: tokenData.scope || '',
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        };

        if (provider === 'google_my_business') {
          destinations = await fetchGBPDestinations(tokenData.access_token).catch(e => {
            console.error(`[socialOAuth] GBP destinations fetch failed: ${e.message}`);
            return [];
          });
        } else if (provider === 'youtube') {
          destinations = await fetchYouTubeDestinations(tokenData.access_token).catch(e => {
            console.error(`[socialOAuth] YouTube destinations fetch failed: ${e.message}`);
            return [];
          });
        }

      } else if (isMeta) {
        const tokenData = await exchangeMetaCode(code);
        console.log(`[socialOAuth] Meta token — has_access_token=${!!tokenData.access_token} error=${tokenData.error?.message || 'none'}`);
        if (tokenData.error) throw new Error(`Meta token error: ${JSON.stringify(tokenData.error)}`);

        metadata = {
          access_token: tokenData.access_token,
          updated_at: new Date().toISOString(),
        };

        if (provider === 'facebook') {
          destinations = await fetchFacebookDestinations(tokenData.access_token).catch(e => {
            console.error(`[socialOAuth] Facebook destinations fetch failed: ${e.message}`);
            return [];
          });
          if (destinations.length > 0) {
            accountName = destinations[0].name;
            platformUserId = destinations[0].id;
            metadata.page_id = destinations[0].id;
            metadata.page_access_token = destinations[0].access_token;
          }
        } else if (provider === 'instagram') {
          destinations = await fetchInstagramDestinations(tokenData.access_token).catch(e => {
            console.error(`[socialOAuth] Instagram destinations fetch failed: ${e.message}`);
            return [];
          });
          if (destinations.length > 0) {
            accountName = destinations[0].name;
            platformUserId = destinations[0].id;
            metadata.ig_account_id = destinations[0].id;
            metadata.page_id = destinations[0].page_id;
            metadata.page_access_token = destinations[0].page_access_token;
          }
        }

        // Get FB user profile for name fallback
        const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${tokenData.access_token}`);
        const meData = await meRes.json();
        if (!accountName || accountName === provider) accountName = meData.name || provider;
        if (!platformUserId) platformUserId = meData.id || '';

      } else if (provider === 'tiktok') {
        const tokenData = await exchangeTikTokCode(code);
        console.log(`[socialOAuth] TikTok token — has_access_token=${!!tokenData.access_token} error=${tokenData.error || 'none'}`);
        if (tokenData.error) throw new Error(`TikTok token error: ${JSON.stringify(tokenData.error)}`);

        const profile = await getTikTokProfile(tokenData.access_token);
        accountName = profile?.display_name || 'TikTok Account';
        platformUserId = profile?.open_id || '';
        metadata = {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          open_id: profile?.open_id || null,
          updated_at: new Date().toISOString(),
        };
        // TikTok: the account itself is the destination
        destinations = [{ id: platformUserId, name: accountName }];
      }

      const destCount = destinations.length;
      console.log(`[socialOAuth] Destinations found for ${provider}: ${destCount}`);

      const payload = {
        platform: provider,
        account_name: accountName || provider,
        platform_user_id: platformUserId,
        destinations_json: JSON.stringify(destinations),
        status: destCount === 0 ? 'error' : 'connected_no_destination',
        error_message: destCount === 0 ? 'No destinations found. Please check your account has pages/channels/locations.' : null,
        last_synced_at: new Date().toISOString(),
        metadata,
        // Auto-select if exactly one destination
        selected_destination_id: destCount === 1 ? destinations[0].id : null,
        selected_destination_name: destCount === 1 ? destinations[0].name : null,
      };

      // If exactly one destination, mark as ready immediately
      if (destCount === 1) {
        payload.status = 'ready';
      }

      await upsertSocialAccount(base44, provider, payload);

      console.log(`[socialOAuth] Saved — provider=${provider} status=${payload.status} dest_count=${destCount}`);
      return new Response(null, {
        status: 302,
        headers: { Location: `/admindashboard?connected=${provider}` },
      });

    } catch (err) {
      console.error(`[socialOAuth] Error — provider=${provider} request_id=${requestId} error=${err.message}`);
      return new Response(`
        <html><body style="font-family:sans-serif;padding:2rem;">
          <h2>OAuth Connection Error</h2>
          <p><strong>Provider:</strong> ${provider}</p>
          <p><strong>Error:</strong> ${err.message}</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><a href="/admindashboard">← Back to Dashboard</a></p>
        </body></html>
      `, { status: 500, headers: { 'Content-Type': 'text/html' } });
    }
  }

  // ── POST: get auth URL, exchange Google code, or sync destinations ──────────
  if (req.method === 'POST') {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { platform, provider, state: bodyState, code: bodyCode, scope: bodyScope, action, account_id } = body;

    // ── POST: exchange Google code from /OauthCallback page ─────────────────
    if (provider === 'google' && bodyCode) {
      const requestId = crypto.randomUUID();
      console.log(`[socialOAuth] POST code exchange — state=${bodyState} request_id=${requestId}`);
      let providerLabel = bodyState === 'youtube' ? 'youtube' : 'google_my_business';

      const tokenData = await exchangeGoogleCode(bodyCode);
      console.log(`[socialOAuth] POST token exchange — has_access_token=${!!tokenData.access_token} error=${tokenData.error || 'none'}`);
      if (tokenData.error) return Response.json({ error: `${tokenData.error}: ${tokenData.error_description}` }, { status: 400 });

      const profile = await getGoogleProfile(tokenData.access_token);
      const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;

      let destinations = [];
      if (providerLabel === 'google_my_business') {
        destinations = await fetchGBPDestinations(tokenData.access_token).catch(() => []);
      } else if (providerLabel === 'youtube') {
        destinations = await fetchYouTubeDestinations(tokenData.access_token).catch(() => []);
      }

      const destCount = destinations.length;
      const payload = {
        platform: providerLabel,
        account_name: profile.name || profile.email,
        platform_user_id: profile.id,
        destinations_json: JSON.stringify(destinations),
        status: destCount === 0 ? 'error' : destCount === 1 ? 'ready' : 'connected_no_destination',
        error_message: destCount === 0 ? 'No destinations found.' : null,
        selected_destination_id: destCount === 1 ? destinations[0].id : null,
        selected_destination_name: destCount === 1 ? destinations[0].name : null,
        last_synced_at: new Date().toISOString(),
        metadata: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          scope: bodyScope || '',
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
      };
      await upsertSocialAccount(base44.asServiceRole, providerLabel, payload);
      return Response.json({ success: true, provider: providerLabel, dest_count: destCount, status: payload.status });
    }

    // ── POST: sync destinations for existing account ─────────────────────────
    if (action === 'sync_destinations' && account_id) {
      const accounts = await base44.asServiceRole.entities.SocialAccount.filter({ id: account_id });
      if (!accounts.length) return Response.json({ error: 'Account not found' }, { status: 404 });
      const acct = accounts[0];
      const token = acct.metadata?.access_token;
      if (!token) return Response.json({ error: 'No access token stored' }, { status: 400 });

      let destinations = [];
      if (acct.platform === 'facebook') {
        destinations = await fetchFacebookDestinations(token).catch(e => { throw new Error(e.message); });
      } else if (acct.platform === 'instagram') {
        destinations = await fetchInstagramDestinations(token).catch(e => { throw new Error(e.message); });
      } else if (acct.platform === 'google_my_business') {
        destinations = await fetchGBPDestinations(token).catch(e => { throw new Error(e.message); });
      } else if (acct.platform === 'youtube') {
        destinations = await fetchYouTubeDestinations(token).catch(e => { throw new Error(e.message); });
      }

      const destCount = destinations.length;
      const update = {
        destinations_json: JSON.stringify(destinations),
        status: destCount === 0 ? 'error' : acct.selected_destination_id ? 'ready' : 'connected_no_destination',
        error_message: destCount === 0 ? 'No destinations found after sync.' : null,
        last_synced_at: new Date().toISOString(),
      };
      if (destCount === 1 && !acct.selected_destination_id) {
        update.selected_destination_id = destinations[0].id;
        update.selected_destination_name = destinations[0].name;
        update.status = 'ready';
      }
      await base44.asServiceRole.entities.SocialAccount.update(account_id, update);
      return Response.json({ success: true, dest_count: destCount, status: update.status, destinations });
    }

    // ── POST: select a destination ───────────────────────────────────────────
    if (action === 'select_destination' && account_id) {
      const { destination_id, destination_name } = body;
      if (!destination_id) return Response.json({ error: 'destination_id required' }, { status: 400 });
      await base44.asServiceRole.entities.SocialAccount.update(account_id, {
        selected_destination_id: destination_id,
        selected_destination_name: destination_name || destination_id,
        status: 'ready',
        error_message: null,
      });
      return Response.json({ success: true, status: 'ready' });
    }

    // ── POST: get auth URL for a platform ────────────────────────────────────
    let authUrl = '';
    if (platform === 'youtube' || platform === 'google_my_business') {
      authUrl = getGoogleAuthUrl(platform);
    } else if (platform === 'facebook' || platform === 'instagram') {
      authUrl = getMetaAuthUrl(platform);
    } else if (platform === 'tiktok') {
      authUrl = getTikTokAuthUrl();
    } else {
      return Response.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    console.log(`[socialOAuth] auth URL requested for platform=${platform}`);
    return Response.json({ authUrl });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
});