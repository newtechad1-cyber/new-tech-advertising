import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/metaOAuthCallback';
const APP_BASE = 'https://new-tech-advertising.base44.app';

async function exchangeCodeForToken(code) {
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

async function getLongLivedToken(shortToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${Deno.env.get('META_APP_ID')}&client_secret=${Deno.env.get('META_APP_SECRET')}&fb_exchange_token=${shortToken}`
  );
  return res.json();
}

async function getUserPages(accessToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${accessToken}`
  );
  return res.json();
}

async function getIgAccount(pageId, pageToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
  );
  const data = await res.json();
  const igId = data.instagram_business_account?.id;
  if (!igId) return null;

  const igRes = await fetch(
    `https://graph.facebook.com/v19.0/${igId}?fields=username&access_token=${pageToken}`
  );
  const igData = await igRes.json();
  return { id: igId, username: igData.username || null };
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // accountId
  const error = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');

  if (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${APP_BASE}/meta-connect?error=${encodeURIComponent(errorDesc || error)}&account_id=${state}` },
    });
  }

  if (!code || !state) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${APP_BASE}/meta-connect?error=missing_params` },
    });
  }

  try {
    const base44 = createClientFromRequest(req);

    // Exchange code for short-lived token
    const tokenData = await exchangeCodeForToken(code);
    if (tokenData.error) throw new Error(`Token exchange failed: ${JSON.stringify(tokenData.error)}`);

    // Try to get long-lived token
    let accessToken = tokenData.access_token;
    const longLived = await getLongLivedToken(accessToken);
    if (longLived.access_token) accessToken = longLived.access_token;

    // Fetch pages the user manages
    const pagesData = await getUserPages(accessToken);
    if (pagesData.error) throw new Error(`Pages fetch failed: ${JSON.stringify(pagesData.error)}`);

    const pages = pagesData.data || [];
    if (!pages.length) throw new Error('No Facebook Pages found. Make sure you manage at least one Facebook Page.');

    // Store temporarily with available_pages for selection step
    const existing = await base44.asServiceRole.entities.MetaConnection.filter({ account_id: state });

    const payload = {
      account_id: state,
      status: 'not_connected', // will become connected after page selection
      fb_user_id: null,
      available_pages: pages.map(p => ({ id: p.id, name: p.name, access_token: p.access_token, category: p.category })),
      page_access_token: accessToken, // temp: user token until page selected
      last_error: null,
    };

    if (existing.length > 0) {
      await base44.asServiceRole.entities.MetaConnection.update(existing[0].id, payload);
    } else {
      await base44.asServiceRole.entities.MetaConnection.create(payload);
    }

    // If only one page, auto-select it
    if (pages.length === 1) {
      const page = pages[0];
      const igAccount = await getIgAccount(page.id, page.access_token);

      const finalPayload = {
        status: 'connected',
        facebook_page_id: page.id,
        facebook_page_name: page.name,
        page_access_token: page.access_token,
        instagram_business_account_id: igAccount?.id || null,
        instagram_username: igAccount?.username || null,
        available_pages: [],
        last_error: null,
      };

      const conn = existing.length > 0 ? existing[0] : (await base44.asServiceRole.entities.MetaConnection.filter({ account_id: state }))[0];
      await base44.asServiceRole.entities.MetaConnection.update(conn.id, finalPayload);

      return new Response(null, {
        status: 302,
        headers: { Location: `${APP_BASE}/meta-connect?success=1&account_id=${state}&page=${encodeURIComponent(page.name)}` },
      });
    }

    // Multiple pages: redirect to selector
    return new Response(null, {
      status: 302,
      headers: { Location: `${APP_BASE}/meta-connect?select=1&account_id=${state}` },
    });

  } catch (err) {
    console.error('[metaOAuthCallback] error:', err.message);
    return new Response(null, {
      status: 302,
      headers: { Location: `${APP_BASE}/meta-connect?error=${encodeURIComponent(err.message)}&account_id=${state}` },
    });
  }
});