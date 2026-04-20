import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FACEBOOK_REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/facebookOAuthCallback';
const RETURN_PAGE = 'https://new-tech-advertising.base44.app/agency/channel-connections';

if (FACEBOOK_REDIRECT_URI.split('https://').length - 1 > 1) {
  throw new Error(`[facebookOAuthCallback] FATAL: FACEBOOK_REDIRECT_URI is malformed: ${FACEBOOK_REDIRECT_URI}`);
}

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

async function exchangeCodeForToken(code) {
  console.log(`[facebookOAuthCallback] token_exchange final_redirect_uri=${FACEBOOK_REDIRECT_URI}`);
  const res = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get('META_APP_ID'),
      client_secret: Deno.env.get('META_APP_SECRET'),
      redirect_uri: FACEBOOK_REDIRECT_URI,
    }),
  });
  const body = await res.json();
  console.log(`[facebookOAuthCallback] short_token_status=${res.status} short_token_body=${JSON.stringify(body)}`);
  return { body, http_status: res.status };
}

async function exchangeForLongLivedToken(shortToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${Deno.env.get('META_APP_ID')}&client_secret=${Deno.env.get('META_APP_SECRET')}&fb_exchange_token=${shortToken}`
  );
  const body = await res.json();
  console.log(`[facebookOAuthCallback] long_token_status=${res.status} long_token_body=${JSON.stringify(body)}`);
  return { body, http_status: res.status };
}

async function inspectToken(token) {
  const appToken = `${Deno.env.get('META_APP_ID')}|${Deno.env.get('META_APP_SECRET')}`;
  const res = await fetch(
    `https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${appToken}`
  );
  const body = await res.json();
  console.log(`[facebookOAuthCallback] token_inspection=${JSON.stringify(body)}`);
  return { data: body?.data || {}, raw: body };
}

async function getFacebookUser(accessToken) {
  const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`);
  const body = await res.json();
  console.log(`[facebookOAuthCallback] facebook_user=${JSON.stringify(body)}`);
  return body;
}

// Always called with LONG-LIVED USER token only
async function getFacebookPages(userAccessToken) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category,fan_count,followers_count,picture&access_token=${userAccessToken}`
  );
  const body = await res.json();
  console.log(`[facebookOAuthCallback] me_accounts_status=${res.status} me_accounts_body=${JSON.stringify(body)}`);
  return { body, http_status: res.status };
}

function classifyEmptyPages(tokenInfo) {
  const scopes = tokenInfo.scopes || [];
  const type = tokenInfo.type || '';
  if (!tokenInfo.is_valid) return 'invalid_token';
  if (type && type !== 'USER') return 'wrong_token_type';
  if (!scopes.includes('pages_show_list')) return 'missing_pages_permission';
  return 'no_page_role_access_or_no_pages_selected';
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

  if (errorParam) {
    const errMsg = errorDesc || errorParam;
    await log(base44, {
      provider: 'facebook', event_type: 'oauth_callback', status: 'failed',
      message: `Facebook OAuth denied: ${errMsg} (reason: ${errorReason || 'unknown'})`,
      error_details: JSON.stringify({ errorParam, errorDesc, errorReason }),
    });
    return errorRedirect(errMsg);
  }

  if (!code || !stateRaw) {
    await log(base44, {
      provider: 'facebook', event_type: 'oauth_callback', status: 'failed',
      message: 'Callback missing code or state parameter',
      error_details: JSON.stringify({ has_code: !!code, has_state: !!stateRaw }),
    });
    return errorRedirect('missing_code_or_state');
  }

  let stateData = {};
  try {
    stateData = JSON.parse(atob(stateRaw));
  } catch (e) {
    await log(base44, {
      provider: 'facebook', event_type: 'oauth_callback', status: 'failed',
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
    client_id: client_id || null, provider: 'facebook',
    event_type: 'oauth_callback', status: 'info',
    message: `Facebook OAuth callback received — client=${client_name || client_id || 'unknown'}`,
    payload: JSON.stringify({ client_id, client_name, nonce, has_code: true }),
  });

  try {
    // ── Step 1: Exchange code → short-lived token ─────────────────────────────
    const { body: shortTokenData, http_status: shortHttpStatus } = await exchangeCodeForToken(code);

    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'token_refresh', status: shortTokenData.access_token ? 'success' : 'failed',
      message: `Short-lived token exchange — http=${shortHttpStatus} token_present=${!!shortTokenData.access_token} token_type=${shortTokenData.token_type || 'unknown'}`,
      payload: JSON.stringify({ http_status: shortHttpStatus, token_type: shortTokenData.token_type, expires_in: shortTokenData.expires_in }),
      error_details: shortTokenData.error ? JSON.stringify(shortTokenData.error) : null,
    });

    if (!shortTokenData.access_token || shortTokenData.error) {
      const errDetail = shortTokenData.error || {};
      const errMsg = errDetail.message || `HTTP ${shortHttpStatus}`;
      const errCode = errDetail.code || shortHttpStatus;
      const hint = (errDetail.type === 'OAuthException' && String(errCode) === '100')
        ? ' (redirect_uri_mismatch — check Meta App Dashboard)' : '';
      return errorRedirect(`token_exchange_failed: ${errMsg}${hint}`);
    }

    // ── Step 2: Upgrade → long-lived user token ───────────────────────────────
    const { body: longTokenData, http_status: longHttpStatus } = await exchangeForLongLivedToken(shortTokenData.access_token);

    const hasLongToken = !!(longTokenData.access_token && !longTokenData.error);
    let userAccessToken = shortTokenData.access_token;
    let tokenExpiry = null;

    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'token_refresh', status: hasLongToken ? 'success' : 'warning',
      message: `Long-lived token exchange — http=${longHttpStatus} token_present=${hasLongToken} token_type=${longTokenData.token_type || 'unknown'} expires_in=${longTokenData.expires_in || 'unknown'}`,
      payload: JSON.stringify({ http_status: longHttpStatus, token_type: longTokenData.token_type, expires_in: longTokenData.expires_in }),
      error_details: longTokenData.error ? JSON.stringify(longTokenData.error) : null,
    });

    if (hasLongToken) {
      userAccessToken = longTokenData.access_token;
      tokenExpiry = longTokenData.expires_in
        ? new Date(Date.now() + longTokenData.expires_in * 1000).toISOString()
        : null;
    } else {
      console.warn('[facebookOAuthCallback] long-lived upgrade failed, using short-lived token');
    }

    // ── Step 3: Inspect token (debug_token) ───────────────────────────────────
    let tokenInfo = {};
    let grantedScopes = '';
    let missingScopes = [];
    const REQUIRED_SCOPES = ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'];

    try {
      const { data } = await inspectToken(userAccessToken);
      tokenInfo = data;
      grantedScopes = (tokenInfo.scopes || []).join(',');
      missingScopes = REQUIRED_SCOPES.filter(s => !(tokenInfo.scopes || []).includes(s));

      await log(base44, {
        client_id: client_id || null, provider: 'facebook',
        event_type: 'oauth_callback',
        status: !tokenInfo.is_valid ? 'failed' : missingScopes.length > 0 ? 'warning' : 'info',
        message: `Token inspected — is_valid=${tokenInfo.is_valid} app_id=${tokenInfo.app_id || 'unknown'} user_id=${tokenInfo.user_id || 'unknown'} expires_at=${tokenInfo.expires_at || 'unknown'} scopes=${grantedScopes || 'none'} missing=${missingScopes.join(',') || 'none'}`,
        payload: JSON.stringify({
          is_valid: tokenInfo.is_valid,
          app_id: tokenInfo.app_id,
          user_id: tokenInfo.user_id,
          expires_at: tokenInfo.expires_at,
          scopes: tokenInfo.scopes,
          granular_scopes: tokenInfo.granular_scopes,
          missing_required: missingScopes,
        }),
      });

      if (!tokenInfo.is_valid) {
        return errorRedirect('invalid_token');
      }
    } catch (e) {
      console.warn('[facebookOAuthCallback] token inspection failed (non-fatal):', e.message);
    }

    // ── Step 4: Facebook user profile ────────────────────────────────────────
    const fbUser = await getFacebookUser(userAccessToken);
    const fbUserId = fbUser.id || '';
    const fbUserName = fbUser.name || fbUser.email || 'Facebook User';

    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'oauth_callback', status: fbUser.error ? 'warning' : 'info',
      message: `Facebook user fetched — id=${fbUserId} name=${fbUserName}`,
      payload: JSON.stringify({ id: fbUserId, name: fbUserName, email: fbUser.email }),
      error_details: fbUser.error ? JSON.stringify(fbUser.error) : null,
    });

    // ── Step 5: Fetch pages — LONG-LIVED USER TOKEN ONLY ─────────────────────
    const { body: pagesData, http_status: pagesHttpStatus } = await getFacebookPages(userAccessToken);

    // Log raw /me/accounts response BEFORE any filtering or classification
    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'oauth_callback',
      status: pagesData.error || pagesHttpStatus >= 400 ? 'failed' : 'info',
      message: `Raw /me/accounts response — http=${pagesHttpStatus} data_count=${pagesData.data?.length ?? 'n/a'} token_user_id=${fbUserId} granted_scopes=${grantedScopes}`,
      payload: JSON.stringify({ http_status: pagesHttpStatus, raw_response: pagesData, token_user_id: fbUserId, granted_scopes: grantedScopes }),
      error_details: pagesData.error ? JSON.stringify(pagesData.error) : null,
    });

    if (pagesHttpStatus >= 400 || pagesData.error) {
      return errorRedirect(`graph_api_fetch_failed: ${pagesData.error?.message || `HTTP ${pagesHttpStatus}`}`);
    }

    const pages = (pagesData.data || []).map(p => ({
      id: p.id,
      name: p.name,
      access_token: p.access_token,
      category: p.category || '',
      fan_count: p.fan_count || 0,
      followers_count: p.followers_count || 0,
    }));

    // ── Step 6: Classify empty pages ─────────────────────────────────────────
    let destSyncError = null;
    if (pages.length === 0) {
      const cause = classifyEmptyPages(tokenInfo);
      console.warn(`[facebookOAuthCallback] no pages found — classified as: ${cause}`);
      destSyncError = cause;

      await log(base44, {
        client_id: client_id || null, provider: 'facebook',
        event_type: 'oauth_callback', status: 'warning',
        message: `No Facebook Pages found — classified cause: ${cause}`,
        error_details: JSON.stringify({
          cause,
          is_valid: tokenInfo.is_valid,
          token_type: tokenInfo.type,
          scopes: tokenInfo.scopes,
          granular_scopes: tokenInfo.granular_scopes,
          raw_data_count: pagesData.data?.length ?? 0,
        }),
      });

      // If missing the key scope, flag it in the redirect but don't block — let UI show the message
      if (!grantedScopes.includes('pages_show_list')) {
        const successParams = new URLSearchParams({
          oauth_success: 'facebook',
          account: fbUserName,
          pages_count: '0',
          missing_scopes: 'pages_show_list',
        });
        // Still upsert the connection so it's recorded
        await upsertConnection(base44, client_id, client_name, fbUserId, fbUserName, userAccessToken, tokenExpiry, grantedScopes, pages, destSyncError);
        return redirect(`${RETURN_PAGE}?${successParams}`);
      }
    } else {
      await log(base44, {
        client_id: client_id || null, provider: 'facebook',
        event_type: 'oauth_callback', status: 'success',
        message: `Facebook pages fetched — count=${pages.length}`,
        payload: JSON.stringify({ pages_count: pages.length, pages: pages.slice(0, 5).map(p => ({ id: p.id, name: p.name })) }),
      });
    }

    // ── Step 7: Upsert ChannelConnection ─────────────────────────────────────
    const savedConn = await upsertConnection(base44, client_id, client_name, fbUserId, fbUserName, userAccessToken, tokenExpiry, grantedScopes, pages, destSyncError);

    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'oauth_connect', status: 'success',
      message: `ChannelConnection upserted — conn_id=${savedConn?.id} user=${fbUserName} pages=${pages.length}${pages.length === 1 ? ` auto-selected: ${pages[0].name}` : pages.length === 0 ? ` (no pages — cause: ${destSyncError})` : ' awaiting page selection'}`,
      payload: JSON.stringify({
        connection_id: savedConn?.id,
        facebook_user_id: fbUserId,
        pages_count: pages.length,
        auto_selected: pages.length === 1 ? pages[0].name : null,
        missing_scopes: missingScopes,
        dest_sync_error: destSyncError,
      }),
    });

    console.log(`[facebookOAuthCallback] SUCCESS — conn_id=${savedConn?.id} pages=${pages.length}`);

    const successParams = new URLSearchParams({
      oauth_success: 'facebook',
      account: fbUserName,
      pages_count: String(pages.length),
    });
    if (pages.length === 1) successParams.set('auto_selected', pages[0].name);
    if (missingScopes.length > 0) successParams.set('missing_scopes', missingScopes.join(','));

    return redirect(`${RETURN_PAGE}?${successParams}`);

  } catch (err) {
    console.error(`[facebookOAuthCallback] FATAL ERROR:`, err.message, err.stack);
    await log(base44, {
      client_id: client_id || null, provider: 'facebook',
      event_type: 'oauth_error', status: 'failed',
      message: `Facebook OAuth callback fatal error: ${err.message}`,
      error_details: err.stack || err.message,
    });
    return errorRedirect(`facebook_oauth_failed: ${err.message}`);
  }
});

async function upsertConnection(base44, client_id, client_name, fbUserId, fbUserName, userAccessToken, tokenExpiry, grantedScopes, pages, destSyncError) {
  const syncAt = new Date().toISOString();
  const connPayload = {
    client_id: client_id || 'unknown',
    client_name: client_name || '',
    provider: 'facebook',
    external_account_id: fbUserId,
    external_account_name: fbUserName,
    access_token: userAccessToken,
    refresh_token: null,
    expires_at: tokenExpiry,
    scopes: grantedScopes,
    status: 'connected',
    last_sync_at: syncAt,
    destinations_json: JSON.stringify(pages),
    dest_sync_at: syncAt,
    dest_sync_count: pages.length,
    dest_sync_error: destSyncError,
    selected_destination_id: pages.length === 1 ? pages[0].id : null,
    selected_destination_name: pages.length === 1 ? pages[0].name : null,
    error_message: null,
  };

  let existingConns = [];
  if (client_id) {
    existingConns = await base44.asServiceRole.entities.ChannelConnection.filter({ client_id, provider: 'facebook' });
  }

  if (existingConns.length > 0) {
    return base44.asServiceRole.entities.ChannelConnection.update(existingConns[0].id, connPayload);
  }
  return base44.asServiceRole.entities.ChannelConnection.create(connPayload);
}