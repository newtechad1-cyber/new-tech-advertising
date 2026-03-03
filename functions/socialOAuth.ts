import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const REDIRECT_URI = `https://${Deno.env.get('BASE44_APP_ID')}.base44.app/api/functions/socialOAuth`;

function getGoogleAuthUrl(platform) {
  const scopes = platform === 'youtube'
    ? 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile'
    : 'https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.profile';

  const params = new URLSearchParams({
    client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    state: platform,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function getMetaAuthUrl(platform) {
  const scopes = platform === 'instagram'
    ? 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement'
    : 'pages_show_list,pages_read_engagement,pages_manage_posts,public_profile';

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
  
  // TikTok v2 requires specific parameter format
  const params = new URLSearchParams({
    client_key: clientKey,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user.info.basic',
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
      redirect_uri: REDIRECT_URI,
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
  if (platform === 'instagram') {
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesRes.json();
    const page = pagesData.data?.[0];
    if (page) {
      const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`);
      const igData = await igRes.json();
      return { name: page.name, id: igData.instagram_business_account?.id || page.id, profile_url: `https://facebook.com/${page.id}` };
    }
  }
  const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,link&access_token=${accessToken}`);
  const data = await res.json();
  const page = data.data?.[0];
  return page ? { name: page.name, id: page.id, profile_url: page.link || `https://facebook.com/${page.id}` } : null;
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
      try {
        const base44 = createClientFromRequest(req);
        let profile = null;
        let tokenData = null;

        if (state === 'youtube' || state === 'google_my_business') {
          tokenData = await exchangeGoogleCode(code, state);
          profile = await getGoogleProfile(tokenData.access_token);
          const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: state });
          const payload = {
            platform: state,
            account_name: profile.name || profile.email,
            platform_user_id: profile.id,
            profile_url: profile.link || '',
            profile_image_url: profile.picture || '',
            status: 'connected',
            last_synced_at: new Date().toISOString(),
            metadata: { access_token: tokenData.access_token, refresh_token: tokenData.refresh_token },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }
        } else if (state === 'facebook' || state === 'instagram') {
          tokenData = await exchangeMetaCode(code);
          profile = await getMetaProfile(tokenData.access_token, state);
          const existing = await base44.asServiceRole.entities.SocialAccount.filter({ platform: state });
          const payload = {
            platform: state,
            account_name: profile?.name || state,
            platform_user_id: profile?.id || '',
            profile_url: profile?.profile_url || '',
            status: 'connected',
            last_synced_at: new Date().toISOString(),
            metadata: { access_token: tokenData.access_token },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }
        } else if (state === 'tiktok') {
          tokenData = await exchangeTikTokCode(code);
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
            metadata: { access_token: tokenData.access_token },
          };
          if (existing.length > 0) {
            await base44.asServiceRole.entities.SocialAccount.update(existing[0].id, payload);
          } else {
            await base44.asServiceRole.entities.SocialAccount.create(payload);
          }
        }

        return new Response(`<html><body><script>window.opener?.postMessage({type:'oauth_success',platform:'${state}'},'*');window.close();</script></body></html>`, {
          headers: { 'Content-Type': 'text/html' },
        });
      } catch (err) {
        return new Response(`<html><body><script>window.opener?.postMessage({type:'oauth_error',platform:'${state}',error:${JSON.stringify(err.message)}},'*');window.close();</script></body></html>`, {
          headers: { 'Content-Type': 'text/html' },
        });
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

  // Handle POST: get auth URL for a platform
  if (req.method === 'POST') {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { platform } = await req.json();
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

    return Response.json({ authUrl });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
});