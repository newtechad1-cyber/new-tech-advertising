import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CALLBACK_URL = 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';
const APP_BASE = 'https://new-tech-advertising.base44.app';
const RETURN_PAGE = `${APP_BASE}/agency/channel-connections`;

async function log(base44, data) {
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      event_time: new Date().toISOString(),
      ...data,
    });
  } catch (e) {
    console.error('[facebookOAuthCallback] log failed:', e.message);
  }
}

// Exchange short-lived code for short-lived user access token
async function exchangeCodeForToken(code) {
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
  const body = await res.json();
  return { body, http_status: res.status };
}

// Exchange short-lived user token for long-lived user token (~60 days)
async function exchangeForLongLivedToken(shortToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${Deno.env.get('META_APP_ID')}&client_secret=${Deno.env.get('META_APP_SECRET')}&fb_exchange_token=${shortToken}`
  );
  const body = await res.json();
  return { body, http_status: res.status };
}

// Get Facebook user profile
async function getFacebookUser(accessToken) {
  const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`);
  return res.json();
}

// Get all Facebook Pages the user manages
async function getFacebookPages(userAccessToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category,fan_count,picture&access_token=${userAccessToken}`
  );
  const body = await res.json();
  return { body, http_status: res.status };
}

// Inspect token to get granted scopes
async function inspectToken(token) {
  const appToken = `${Deno.env.get('META_APP_ID')}|${Deno.env.get('META_APP_SECRET')}`;
  const res = await fetch(
    `https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${appToken}`
  );
  const body = await res.json();
  return body?.data || {};
}

function redirect(url) {
  return new Response(null, { status: 302, headers: { Location: url } });
}

function errorRedirect(msg) {
  return redirect(`${RETURN_PAGE}?oauth_error=${encodeURIComponent(msg)}&provider=facebook`);
}

Deno.serve(async (req) => {
  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const stateRaw = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');
  const errorReason = url.searchParams.get('error_reason');

  const base44 = createClientFromRequest(req);

  console.log(`[facebookOAuthCallback] received — has_code=${!!code} has_state=${!!stateRaw} error=${errorParam || 'none'}`);

  // ── User denied access ────────────────────────────────────────────────────
  if (errorParam) {
    const errMsg = errorDesc || errorParam;
    await log(base44, {
      provider: 'facebook',
      event_type: 'oauth_callback',
      status: 'failed',
      message: `Facebook OAuth denied: ${errMsg} (reason: ${errorReason || 'unknown'})`,
      error_details: JSON.stringify({ errorParam, errorDesc, errorReason }),
    });
    return errorRedirect(errMsg);
  }

  // ── Missing params ────────────────────────────────────────────────────────
  if (!code || !stateRaw) {
    await log(base44, {
      provider: 'facebook',
      event_type: 'oauth_callback',
      status: 'failed',
      message: 'Callback missing code or state parameter',
      error_details: JSON.stringify({ has_code: !!code, has_state: !!stateRaw }),
    });
    return errorRedirect('missing_code_or_state');
  }

  // ── Decode + validate state ───────────────────────────────────────────────
  let stateData = {};
  try {
    stateData = JSON.parse(atob(stateRaw));
  } catch (e) {
    await log(base44, {
      provider: 'facebook',
      event_type: 'oauth_callback',
      status: 'failed',
      message: 'State decode failed — invalid base64 or JSON',
      error_details: e.message,
    });
    return errorRedirect('invalid_state_parameter');
  }

  const { provider, client_id, client_name, nonce } = stateData;

  if (provider !== 'facebook') {
    return errorRedirect(`unexpected_provider_in_state: ${provider}`);
  }

  await log(base44, {
    client_id: client_id || null,
    provider: 'facebook',
    event_type: 'oauth_callback',
    status: 'info',
    message: `Facebook OAuth callback received — client=${client_name || client_id || 'unknown'}`,
    payload: JSON.stringify({ client_id, client_name, nonce, has_code: true }),
  });

  try {
    // ── Step 1: Exchange code for short-lived token ───────────────────────
    console.log('[facebookOAuthCallback] exchanging code for token...');
    const { body: shortTokenData, http_status: shortHttpStatus } = await exchangeCodeForToken(code);

    if (shortTokenData.error || shortHttpStatus >= 400) {
      const errDetail = shortTokenData.error;
      const errMsg = errDetail?.message || `HTTP ${shortHttpStatus}`;
      const errType = errDetail?.type || '';
      const errCode = errDetail?.code || shortHttpStatus;

      await log(base44, {
        client_id: client_id || null,
        provider: 'facebook',
        event_type: 'oauth_callback',
        status: 'failed',
        message: `Token exchange failed: ${errMsg}`,
        error_details: JSON.stringify({ errMsg, errType, errCode, http_status: shortHttpStatus,
          hint: errType === 'OAuthException' && String(errCode) === '100'
            ? 'Redirect URI mismatch — verify the callback URL matches exactly what is registered in the Meta App Dashboard'
            : null
        }),
      });

      const hint = (errType === 'OAuthException' && String(errCode) === '100')
        ? ' (redirect_uri_mismatch — check Meta App Dashboard)'
        : '';
      return errorRedirect(`token_exchange_failed: ${errMsg}${hint}`);
    }

    console.log('[facebookOAuthCallback] short-lived token received');

    await log(base44, {
      client_id: client_id || null,
      provider: 'facebook',
      event_type: 'token_refresh',
      status: 'success',
      message: 'Short-lived user token exchanged successfully',
    });

    // ── Step 2: Upgrade to long-lived user token ──────────────────────────
    console.log('[facebookOAuthCallback] upgrading to long-lived token...');
    const { body: longTokenData, http_status: longHttpStatus } = await exchangeForLongLivedToken(shortTokenData.access_token);

    let userAccessToken = shortTokenData.access_token;
    let tokenExpiry = null;

    if (longTokenData.access_token && !longTokenData.error) {
      userAccessToken = longTokenData.access_token;
      tokenExpiry = longTokenData.expires_in
        ? new Date(Date.now() + longTokenData.expires_in * 1000).toISOString()
        : null;
      console.log('[facebookOAuthCallback] long-lived token acquired');
      await log(base44, {
        client_id: client_id || null,
        provider: 'facebook',
        event_type: 'token_refresh',
        status: 'success',
        message: 'Long-lived user token acquired',
        payload: JSON.stringify({ expires_in: longTokenData.expires_in }),
      });
    } else {
      // Non-fatal — use short-lived token, log warning
      console.warn('[facebookOAuthCallback] long-lived token upgrade failed, using short-lived token');
      await log(base44, {
        client_id: client_id || null,
        provider: 'facebook',
        event_type: 'token_refresh',
        status: 'warning',
        message: `Long-lived token upgrade failed: ${longTokenData.error?.message || 'unknown'}`,
        error_details: JSON.stringify(longTokenData.error || {}),
      });
    }

    // ── Step 3: Get Facebook user profile ────────────────────────────────
    const fbUser = await getFacebookUser(userAccessToken);
    const fbUserId = fbUser.id || '';
    const fbUserName = fbUser.name || fbUser.email || 'Facebook User';
    console.log(`[facebookOAuthCallback] user profile: id=${fbUserId} name=${fbUserName}`);

    // ── Step 4: Inspect token for granted scopes ──────────────────────────
    let grantedScopes = '';
    let missingScopes = [];
    const REQUIRED_SCOPES = ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'];

    try {
      const tokenInfo = await inspectToken(userAccessToken);
      grantedScopes = (tokenInfo.scopes || []).join(',');
      missingScopes = REQUIRED_SCOPES.filter(s => !(tokenInfo.scopes || []).includes(s));
      console.log(`[facebookOAuthCallback] granted scopes: ${grantedScopes}`);

      await log(base44, {
        client_id: client_id || null,
        provider: 'facebook',
        event_type: 'oauth_callback',
        status: missingScopes.length > 0 ? 'warning' : 'info',
        message: `Token scopes inspected — granted=${grantedScopes} missing=${missingScopes.join(',') || 'none'}`,
        payload: JSON.stringify({ granted: grantedScopes, missing: missingScopes }),
      });
    } catch (e) {
      console.warn('[facebookOAuthCallback] token inspection failed (non-fatal):', e.message);
    }

    // ── Step 5: Fetch Facebook Pages ──────────────────────────────────────
    console.log('[facebookOAuthCallback] fetching pages...');
    const { body: pagesData, http_status: pagesHttpStatus } = await getFacebookPages(userAccessToken);

    if (pagesData.error || pagesHttpStatus >= 400) {
      const errMsg = pagesData.error?.message || `HTTP ${pagesHttpStatus}`;
      await log(base44, {
        client_id: client_id || null,
        provider: 'facebook',
        event_type: 'oauth_callback',
        status: 'failed',
        message: `Pages fetch failed: ${errMsg}`,
        error_details: JSON.stringify(pagesData.error || { http_status: pagesHttpStatus }),
      });
      return errorRedirect(`pages_fetch_failed: ${errMsg}`);
    }

    const pages = (pagesData.data || []).map(p => ({
      id: p.id,
      name: p.name,
      access_token: p.access_token,
      category: p.category || '',
      fan_count: p.fan_count || 0,
    }));

    console.log(`[facebookOAuthCallback] pages found: ${pages.length}`);

    await log(base44, {
      client_id: client_id || null,
      provider: 'facebook',
      event_type: 'oauth_callback',
      status: 'success',
      message: `Facebook pages fetched — count=${pages.length}`,
      payload: JSON.stringify({ pages_count: pages.length, pages: pages.slice(0, 5).map(p => ({ id: p.id, name: p.name })) }),
    });

    // ── Step 6: Upsert ChannelConnection (NOT yet fully connected — needs page selection) ──
    // We save the connection with status='connected' but without a selected_destination_id
    // so the UI knows to prompt for page selection before treating it as usable.
    const syncAt = new Date().toISOString();

    const connPayload = {
      client_id: client_id || 'unknown',
      client_name: client_name || '',
      provider: 'facebook',
      external_account_id: fbUserId,
      external_account_name: fbUserName,
      access_token: userAccessToken,
      refresh_token: null, // Facebook doesn't use refresh tokens; use long-lived token
      expires_at: tokenExpiry,
      scopes: grantedScopes,
      status: 'connected',
      last_sync_at: syncAt,
      destinations_json: JSON.stringify(pages),
      dest_sync_at: syncAt,
      dest_sync_count: pages.length,
      dest_sync_error: pages.length === 0 ? 'No Facebook Pages found for this account' : null,
      // No selected_destination_id — must be set by user selecting a Page
      selected_destination_id: pages.length === 1 ? pages[0].id : null,
      selected_destination_name: pages.length === 1 ? pages[0].name : null,
      error_message: null,
    };

    // Find or create connection record
    let existingConns = [];
    if (client_id) {
      existingConns = await base44.asServiceRole.entities.ChannelConnection.filter({ client_id, provider: 'facebook' });
    }

    let savedConn;
    if (existingConns.length > 0) {
      savedConn = await base44.asServiceRole.entities.ChannelConnection.update(existingConns[0].id, connPayload);
    } else {
      savedConn = await base44.asServiceRole.entities.ChannelConnection.create(connPayload);
    }

    await log(base44, {
      client_id: client_id || null,
      provider: 'facebook',
      event_type: 'oauth_connect',
      status: 'success',
      message: `Facebook ChannelConnection upserted — conn_id=${savedConn?.id} user=${fbUserName} pages=${pages.length}${pages.length === 1 ? ` auto-selected: ${pages[0].name}` : ' awaiting page selection'}`,
      payload: JSON.stringify({
        connection_id: savedConn?.id,
        facebook_user_id: fbUserId,
        pages_count: pages.length,
        auto_selected: pages.length === 1 ? pages[0].name : null,
        missing_scopes: missingScopes,
      }),
    });

    console.log(`[facebookOAuthCallback] SUCCESS — conn_id=${savedConn?.id} pages=${pages.length}`);

    // ── Redirect back to Channel Connections ──────────────────────────────
    // Pass pages as URL param so UI can show the selection modal
    const successParams = new URLSearchParams({
      oauth_success: 'facebook',
      account: fbUserName,
      pages_count: String(pages.length),
    });
    if (pages.length === 1) {
      successParams.set('auto_selected', pages[0].name);
    }
    if (missingScopes.length > 0) {
      successParams.set('missing_scopes', missingScopes.join(','));
    }

    return redirect(`${RETURN_PAGE}?${successParams}`);

  } catch (err) {
    console.error(`[facebookOAuthCallback] FATAL ERROR:`, err.message);
    await log(base44, {
      client_id: client_id || null,
      provider: 'facebook',
      event_type: 'oauth_error',
      status: 'failed',
      message: `Facebook OAuth callback fatal error: ${err.message}`,
      error_details: err.stack || err.message,
    });
    return errorRedirect(`facebook_oauth_failed: ${err.message}`);
  }
});