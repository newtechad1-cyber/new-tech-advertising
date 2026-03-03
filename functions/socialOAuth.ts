import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/socialOAuth';
const GOOGLE_REDIRECT_URI = 'https://new-tech-advertising.base44.app/oauth/callback';

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
  // Both facebook and instagram need the same broad page + instagram scopes
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
  const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY');
  const redirectUri = REDIRECT_URI;
  
  const params = new URLSearchParams({
    client_key: clientKey,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user.info.basic,video.upload,video.publish',
    state: 'tiktok',
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
}

async function exchangeGoogleCode(code, platform) {
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
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
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

async function getGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

async function getMetaProfile(accessToken, platform) {
  const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,link&access_token=${accessToken}`);
  const pagesData = await pagesRes.json();
  const page = pagesData.data?.[0];
  if (!page) return null;

  if (platform === 'instagram') {
    const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`);
    const igData = await igRes.json();
    const igAccountId = igData.instagram_business_account?.id;
    return {
      name: page.name,
      id: igAccountId || page.id,
      page_id: page.id,
      page_access_token: page.access_token,
      ig_account_id: igAccountId || null,
      profile_url: `https://facebook.com/${page.id}`,
    };
  }

  return {
    name: page.name,
    id: page.id,
    page_id: page.id,
    page_access_token: page.access_token,
    profile_url: page.link || `https://facebook.com/${page.id}`,
  };
}

async function getTikTokProfile(accessToken) {
  const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,profile_deep_link', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data.data?.user;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Handle OAuth callback (GET with ?code=...)
  if (req.method === 'GET') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return new Response(`<html><body><script>window.opener?.postMessage({type:'oauth_error',platform:'${state}',error:'${error}'},'*');window.close();</script></body></html>`, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (code && state) {
      const requestId = crypto.randomUUID();
      console.log(`[socialOAuth] GET callback — state=${state} request_id=${requestId}`);

      // Determine provider label
      let provider;
      if (state === 'google_my_business') provider = 'google_business';
      else if (state === 'youtube') provider = 'youtube';
      else if (state === 'facebook' || state === 'instagram' || state === 'tiktok') provider = state;
      else provider = 'google_generic';

      const isGoogle = provider === 'google_business' || provider === 'youtube' || provider === 'google_generic';

      try {
        const base44 = createClientFromRequest(req);
        let profile = null;
        let tokenData = null;

        if (isGoogle) {
          tokenData = await exchangeGoogleCode(code, state);
          console.log(`[socialOAuth] Google token exchange — has_access_token=${!!tokenData.access_token} has_refresh_token=${!!tokenData.refresh_token} error=${tokenData.error || 'none'}`);

          if (tokenData.error) {
            throw new Error(`Google token error: ${tokenData.error} — ${tokenData.error_description}`);
          }

          profile = await getGoogleProfile(tokenData.access_token);
          const scope = url.searchParams.get('scope') || '';
          const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;

          const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: provider });
          const payload = {
            platform: provider,
            account_name: profile.name || profile.email,
            platform_user_id: profile.id,
            profile_url: profile.link || '',
            profile_image_url: profile.picture || '',
            status: 'connected',
            last_synced_at: new Date().toISOString(),
            metadata: {
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token || null,
              scope,
              expires_at: expiresAt,
              updated_at: new Date().toISOString(),
            },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }

        } else if (state === 'facebook' || state === 'instagram') {
          tokenData = await exchangeMetaCode(code);
          if (tokenData.error) throw new Error(`Meta token error: ${JSON.stringify(tokenData.error)}`);
          profile = await getMetaProfile(tokenData.access_token, state);
          const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: state });
          const payload = {
            platform: state,
            account_name: profile?.name || state,
            platform_user_id: profile?.id || '',
            profile_url: profile?.profile_url || '',
            status: 'connected',
            last_synced_at: new Date().toISOString(),
            metadata: {
              access_token: tokenData.access_token,
              page_access_token: profile?.page_access_token || null,
              page_id: profile?.page_id || null,
              ig_account_id: profile?.ig_account_id || null,
              updated_at: new Date().toISOString(),
            },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }

        } else if (state === 'tiktok') {
          tokenData = await exchangeTikTokCode(code);
          if (tokenData.error) throw new Error(`TikTok token error: ${JSON.stringify(tokenData.error)}`);
          profile = await getTikTokProfile(tokenData.access_token);
          const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: 'tiktok' });
          const payload = {
            platform: 'tiktok',
            account_name: profile?.display_name || 'TikTok Account',
            platform_user_id: profile?.open_id || '',
            profile_url: profile?.profile_deep_link || '',
            profile_image_url: profile?.avatar_url || '',
            status: 'connected',
            last_synced_at: new Date().toISOString(),
            metadata: {
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token || null,
              open_id: profile?.open_id || null,
              updated_at: new Date().toISOString(),
            },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }
        }

        console.log(`[socialOAuth] Success — provider=${provider} redirecting to /admindashboard`);
        return new Response(null, {
          status: 302,
          headers: { Location: `/admindashboard?connected=${provider}` },
        });

      } catch (err) {
        console.error(`[socialOAuth] Error — provider=${provider} request_id=${requestId} error=${err.message}`);
        return new Response(`
          <html><body style="font-family:sans-serif;padding:2rem;">
            <h2>OAuth Connection Error</h2>
            <p><strong>Provider:</strong> ${provider} (state: ${state})</p>
            <p><strong>Error:</strong> ${err.message}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p><a href="/admindashboard">← Back to Dashboard</a></p>
          </body></html>
        `, { status: 500, headers: { 'Content-Type': 'text/html' } });
      }
    }

    // Debug endpoint: GET with ?debug=1 shows current env var status
    if (url.searchParams.get('debug') === '1') {
      return Response.json({
        tiktok_client_key_set: !!Deno.env.get('TIKTOK_CLIENT_KEY'),
        tiktok_client_key_prefix: Deno.env.get('TIKTOK_CLIENT_KEY')?.substring(0, 6) + '...',
        meta_app_id_set: !!Deno.env.get('META_APP_ID'),
        google_client_id_set: !!Deno.env.get('GOOGLE_CLIENT_ID'),
        redirect_uri: REDIRECT_URI,
        tiktok_auth_url: getTikTokAuthUrl(),
      });
    }
  }

  // Handle POST: get auth URL for a platform, OR exchange code from callback page
  if (req.method === 'POST') {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { platform, provider, state: bodyState, code: bodyCode, scope: bodyScope } = body;

    // Handle token exchange from /oauth/callback page
    if (provider === 'google' && bodyCode) {
      const requestId = crypto.randomUUID();
      console.log(`[socialOAuth] POST code exchange — state=${bodyState} request_id=${requestId}`);
      let providerLabel;
      if (bodyState === 'google_my_business') providerLabel = 'google_business';
      else if (bodyState === 'youtube') providerLabel = 'youtube';
      else providerLabel = 'google_generic';

      const tokenData = await exchangeGoogleCode(bodyCode, bodyState);
      console.log(`[socialOAuth] Token exchange result — has_access_token=${!!tokenData.access_token} error=${tokenData.error || 'none'}`);

      if (tokenData.error) {
        return Response.json({ error: `${tokenData.error}: ${tokenData.error_description}` }, { status: 400 });
      }

      const profile = await getGoogleProfile(tokenData.access_token);
      const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null;

      const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: providerLabel });
      const payload = {
        platform: providerLabel,
        account_name: profile.name || profile.email,
        platform_user_id: profile.id,
        profile_url: profile.link || '',
        profile_image_url: profile.picture || '',
        status: 'connected',
        last_synced_at: new Date().toISOString(),
        metadata: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          scope: bodyScope || '',
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
      };
      if (existing.length > 0) {
        await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
      } else {
        await base44.asServiceRole.entities.SocialAccount.create(payload);
      }

      console.log(`[socialOAuth] POST exchange success — provider=${providerLabel}`);
      return Response.json({ success: true, provider: providerLabel });
    }

    let authUrl = '';

    let debugInfo = {};

    if (platform === 'youtube' || platform === 'google_my_business') {
      authUrl = getGoogleAuthUrl(platform);
      debugInfo = { client_id: Deno.env.get('GOOGLE_CLIENT_ID'), redirect_uri: GOOGLE_REDIRECT_URI };
    } else if (platform === 'facebook' || platform === 'instagram') {
      authUrl = getMetaAuthUrl(platform);
      debugInfo = { client_id: Deno.env.get('META_APP_ID'), redirect_uri: REDIRECT_URI };
    } else if (platform === 'tiktok') {
      authUrl = getTikTokAuthUrl();
      debugInfo = { client_id: Deno.env.get('TIKTOK_CLIENT_KEY'), redirect_uri: REDIRECT_URI };
    } else {
      return Response.json({ error: 'Unsupported platform' }, { status: 400 });
    }

    console.log(`[socialOAuth] platform=${platform} client_id=${debugInfo.client_id} redirect_uri=${debugInfo.redirect_uri}`);

    return Response.json({ authUrl, debug: debugInfo });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
});