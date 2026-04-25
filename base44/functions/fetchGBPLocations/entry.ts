import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const QUOTA_COOLDOWN_MS = 2 * 60 * 1000;

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
  const body = await res.json();
  return { body, http_status: res.status };
}

function classifyApiError(errorObj, httpStatus) {
  if (!errorObj && !httpStatus) return 'unknown_provider_error';
  const status = httpStatus || errorObj?.code || errorObj?.status;
  const msg = (errorObj?.message || '').toLowerCase();

  if (status === 429 || msg.includes('quota') || msg.includes('rate limit')) return 'provider_quota_failure';
  if (msg.includes('disabled') || msg.includes('not enabled') || msg.includes('has not been used')) return 'provider_api_disabled';
  if (status === 401 || msg.includes('unauthenticated') || msg.includes('invalid_grant') || msg.includes('token expired') || msg.includes('invalid credentials')) return 'token_expired';
  if (status === 403 && (msg.includes('permission') || msg.includes('forbidden') || msg.includes('access'))) return 'provider_permission_failure';
  if (status === 403) return 'provider_permission_failure';
  if (status === 404) return 'not_found';
  if (msg.includes('parse') || msg.includes('json') || msg.includes('unexpected')) return 'normalization_failure';
  return 'unknown_provider_error';
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const { connection_id, force = false } = payload;

  if (!connection_id) return Response.json({ error: 'connection_id required' }, { status: 400 });

  const conns = await base44.asServiceRole.entities.ChannelConnection.filter({ id: connection_id });
  const conn = conns[0];
  if (!conn) return Response.json({ error: 'Connection not found' }, { status: 404 });
  if (conn.provider !== 'google_business_profile') return Response.json({ error: 'For google_business_profile only' }, { status: 400 });

  const now = Date.now();

  // ── Cooldown guard ────────────────────────────────────────────────────────
  if (!force && conn.dest_sync_cooldown_until) {
    const cooldownUntil = new Date(conn.dest_sync_cooldown_until).getTime();
    if (cooldownUntil > now) {
      const minutesLeft = Math.ceil((cooldownUntil - now) / 60000);
      return Response.json({
        success: false,
        cooldown: true,
        cooldown_until: conn.dest_sync_cooldown_until,
        error: `Google API rate-limited. Cooldown active for ~${minutesLeft} more minute${minutesLeft !== 1 ? 's' : ''}.`,
      });
    }
  }

  const syncAt = new Date().toISOString();
  const diag = {
    // Step outcome (required — always set to a terminal label before returning)
    step_outcome: 'init',
    // Token
    token_present: !!conn.access_token,
    has_refresh_token: !!conn.refresh_token,
    token_refresh_attempted: false,
    token_refresh_succeeded: false,
    token_refresh_http_status: null,
    token_refresh_error: null,
    token_refresh_raw: null,
    // Accounts
    account_api_attempted: false,
    account_api_http_status: null,
    account_api_error: null,
    account_api_error_class: null,
    account_api_raw_body: null,
    accounts_returned: null,
    account_sample: [],
    // Locations
    location_api_attempted: false,
    location_api_errors: [],
    locations_returned: null,
    location_sample: [],
    // Result
    destinations_saved: null,
    auto_selected: null,
    final_diagnosis: null,
    human_message: null,
    synced_at: syncAt,
    forced: force,
  };

  // ── Step 1: Token present check ──────────────────────────────────────────
  let accessToken = conn.access_token;
  if (!accessToken) {
    diag.step_outcome = 'oauth_token_missing';
    diag.final_diagnosis = 'oauth_token_missing';
    diag.human_message = 'No access token stored — reconnect Google OAuth';
    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  // ── Step 2: Token refresh check ───────────────────────────────────────────
  const expiresAt = conn.expires_at ? new Date(conn.expires_at) : new Date(0);
  const tokenLikelyExpired = expiresAt < new Date(now + 5 * 60 * 1000);

  if (conn.refresh_token) {
    if (tokenLikelyExpired) {
      diag.step_outcome = 'token_refresh_started';
      diag.token_refresh_attempted = true;
      console.log('[fetchGBPLocations] token likely expired, refreshing...');

      const { body: refreshed, http_status: refreshStatus } = await refreshGoogleToken(conn.refresh_token);
      diag.token_refresh_http_status = refreshStatus;

      if (refreshed.access_token) {
        accessToken = refreshed.access_token;
        diag.token_refresh_succeeded = true;
        diag.step_outcome = 'accounts_api_started'; // will proceed
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
          access_token: accessToken,
          expires_at: new Date(now + (refreshed.expires_in || 3600) * 1000).toISOString(),
        });
        console.log('[fetchGBPLocations] token refreshed OK');
      } else {
        diag.step_outcome = 'token_refresh_failed';
        diag.token_refresh_error = `${refreshed.error || 'unknown'}: ${refreshed.error_description || ''}`.trim();
        diag.token_refresh_raw = JSON.stringify(refreshed);
        diag.final_diagnosis = 'token_refresh_failed';
        diag.human_message = `Google token refresh failed: ${diag.token_refresh_error}`;
        console.error('[fetchGBPLocations] token refresh failed:', diag.token_refresh_error);
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, { status: 'expired' });
        await persistDiag(base44, connection_id, conn, diag, diag.human_message);
        return Response.json({ success: false, diag, error: diag.human_message });
      }
    }
    // Token not expired — no refresh needed
  } else if (tokenLikelyExpired) {
    // No refresh token and token looks expired
    diag.step_outcome = 'token_refresh_failed';
    diag.token_refresh_attempted = false;
    diag.token_refresh_error = 'No refresh_token stored — cannot renew expired access token';
    diag.final_diagnosis = 'missing_refresh_token';
    diag.human_message = 'Google connection needs to be refreshed — no refresh token stored';
    await base44.asServiceRole.entities.ChannelConnection.update(connection_id, { status: 'expired' });
    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  // ── Step 3: Accounts API ─────────────────────────────────────────────────
  diag.step_outcome = 'accounts_api_started';
  diag.account_api_attempted = true;
  let accountData;
  let accountHttpStatus;
  try {
    const accountRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    accountHttpStatus = accountRes.status;
    diag.account_api_http_status = accountHttpStatus;
    const rawText = await accountRes.text();
    diag.account_api_raw_body = rawText.slice(0, 800); // truncate for storage
    try { accountData = JSON.parse(rawText); } catch (_) {
      accountData = { _parse_error: true, _raw: rawText.slice(0, 200) };
    }
  } catch (netErr) {
    diag.step_outcome = 'accounts_api_failed';
    diag.account_api_error = netErr.message;
    diag.account_api_error_class = 'network_error';
    diag.final_diagnosis = 'network_error';
    diag.human_message = `Network error reaching Google accounts API: ${netErr.message}`;
    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  console.log('[fetchGBPLocations] accounts http:', accountHttpStatus, '| preview:', JSON.stringify(accountData).slice(0, 300));

  // Handle non-200 or error body
  if (accountData._parse_error) {
    diag.step_outcome = 'accounts_api_failed';
    diag.account_api_error_class = 'normalization_failure';
    diag.account_api_error = `Non-JSON response from Google accounts API (HTTP ${accountHttpStatus})`;
    diag.final_diagnosis = 'normalization_failure';
    diag.human_message = diag.account_api_error;
    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  if (accountData.error || accountHttpStatus >= 400) {
    diag.step_outcome = 'accounts_api_failed';
    const errObj = accountData.error || {};
    diag.account_api_error = errObj.message || `HTTP ${accountHttpStatus}`;
    diag.account_api_error_class = classifyApiError(errObj, accountHttpStatus);
    diag.final_diagnosis = diag.account_api_error_class;

    const isQuota = diag.account_api_error_class === 'provider_quota_failure';
    const isAuth  = diag.account_api_error_class === 'token_expired';

    diag.human_message = {
      provider_quota_failure:    'Google API quota exceeded — this project is being rate-limited. Check Quotas in Google Cloud Console.',
      provider_api_disabled:     'My Business Account Management API is not enabled in Google Cloud Console',
      provider_permission_failure: 'This Google account lacks permission to access the Business Profile API',
      token_expired:             'Google connection needs to be refreshed — access token was rejected (401)',
      token_refresh_failed:      'Google token refresh failed — reconnect Google OAuth',
      missing_refresh_token:     'Google connection needs to be refreshed — no refresh token stored',
      unknown_provider_error:    `Accounts API error (HTTP ${accountHttpStatus}): ${diag.account_api_error}`,
    }[diag.account_api_error_class] || `Accounts API error (HTTP ${accountHttpStatus}): ${diag.account_api_error}`;

    const extraFields = {};
    if (isQuota) {
      extraFields.dest_sync_cooldown_until = new Date(now + QUOTA_COOLDOWN_MS).toISOString();
      extraFields.dest_sync_last_quota_error = syncAt;
    }
    if (isAuth) {
      await base44.asServiceRole.entities.ChannelConnection.update(connection_id, { status: 'expired' });
    }

    await persistDiag(base44, connection_id, conn, diag, diag.human_message, extraFields, isQuota);
    return Response.json({
      success: false, diag, error: diag.human_message,
      cooldown: isQuota,
      cooldown_until: isQuota ? new Date(now + QUOTA_COOLDOWN_MS).toISOString() : null,
      needs_reconnect: isAuth,
    });
  }

  // ── Step 4: Parse accounts ───────────────────────────────────────────────
  const accounts = accountData.accounts || [];
  diag.accounts_returned = accounts.length;
  diag.account_sample = accounts.slice(0, 3).map(a => ({ id: a.name, name: a.accountName || a.displayName || a.name }));

  if (!accounts.length) {
    diag.step_outcome = 'accounts_api_failed';
    diag.locations_returned = 0;
    diag.destinations_saved = 0;
    diag.final_diagnosis = 'no_accounts_returned';
    diag.human_message = 'Connected Google account has no accessible Business Profile accounts';
    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  // ── Step 5: Locations API ─────────────────────────────────────────────────
  diag.step_outcome = 'locations_api_started';
  diag.location_api_attempted = true;
  const allLocations = [];

  for (const account of accounts) {
    let locHttpStatus;
    let locData;
    try {
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode,storefrontAddress`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      locHttpStatus = locRes.status;
      const rawText = await locRes.text();
      try { locData = JSON.parse(rawText); } catch (_) {
        locData = { _parse_error: true, _raw: rawText.slice(0, 200) };
      }
    } catch (netErr) {
      diag.location_api_errors.push({ account: account.name, error: netErr.message, class: 'network_error', http_status: null });
      continue;
    }

    console.log('[fetchGBPLocations] locations for', account.name, 'http:', locHttpStatus, '| preview:', JSON.stringify(locData).slice(0, 300));

    if (locData._parse_error || locData.error || locHttpStatus >= 400) {
      const errObj = locData.error || {};
      const errClass = classifyApiError(errObj, locHttpStatus);
      diag.location_api_errors.push({
        account: account.name,
        http_status: locHttpStatus,
        error: errObj.message || `HTTP ${locHttpStatus}${locData._parse_error ? ' (non-JSON response)' : ''}`,
        class: errClass,
        raw_code: errObj.code,
      });
      continue;
    }

    (locData.locations || []).forEach(loc => allLocations.push({
      id: loc.name,
      name: loc.title || loc.storeCode || loc.name,
      account_name: account.accountName || account.name,
      account_id: account.name,
    }));
  }

  diag.locations_returned = allLocations.length;
  diag.location_sample = allLocations.slice(0, 3).map(l => ({ id: l.id, name: l.name, account: l.account_name }));

  // ── Step 6: Zero-location diagnosis ──────────────────────────────────────
  if (allLocations.length === 0) {
    diag.step_outcome = 'locations_api_failed';
    diag.destinations_saved = 0;
    const locErrors = diag.location_api_errors;

    if (locErrors.some(e => e.class === 'provider_api_disabled'))       diag.final_diagnosis = 'provider_api_disabled';
    else if (locErrors.some(e => e.class === 'provider_permission_failure')) diag.final_diagnosis = 'provider_permission_failure';
    else if (locErrors.some(e => e.class === 'token_expired'))          diag.final_diagnosis = 'token_expired';
    else if (locErrors.some(e => e.class === 'provider_quota_failure')) diag.final_diagnosis = 'provider_quota_failure';
    else if (locErrors.length > 0 && locErrors.length === accounts.length) diag.final_diagnosis = 'locations_api_errors';
    else                                                                  diag.final_diagnosis = 'no_locations_returned';

    diag.human_message = {
      provider_api_disabled:       'My Business Business Information API is not enabled in Google Cloud Console',
      provider_permission_failure: 'Token lacks permission to read locations — re-authenticate with business.manage scope',
      token_expired:               'Google connection needs to be refreshed — locations API rejected the token',
      provider_quota_failure:      'Google API quota exceeded during locations fetch',
      locations_api_errors:        `Locations API returned errors for all ${accounts.length} account(s) — see step trace`,
      no_locations_returned:       `Found ${accounts.length} account(s) but zero locations — account may have no verified listings`,
    }[diag.final_diagnosis] || 'Zero locations returned';

    await persistDiag(base44, connection_id, conn, diag, diag.human_message);
    return Response.json({ success: false, diag, error: diag.human_message });
  }

  // ── Step 7: Save ──────────────────────────────────────────────────────────
  diag.step_outcome = 'success';
  const autoSelect = allLocations.length === 1 ? allLocations[0] : null;
  diag.auto_selected = autoSelect?.name || null;
  diag.destinations_saved = allLocations.length;
  diag.final_diagnosis = 'success';
  diag.human_message = `Sync succeeded — ${allLocations.length} location(s) saved`;

  const updatePayload = {
    destinations_json: JSON.stringify(allLocations),
    dest_sync_at: syncAt,
    dest_sync_count: allLocations.length,
    dest_sync_error: null,
    dest_sync_cooldown_until: null,
    dest_sync_last_quota_error: conn.dest_sync_last_quota_error || null,
    dest_sync_last_success: syncAt,
    last_sync_at: syncAt,
    error_message: null,
    gbp_diag_json: JSON.stringify(diag),
  };
  if (autoSelect) {
    updatePayload.selected_destination_id = autoSelect.id;
    updatePayload.selected_destination_name = autoSelect.name;
  }

  await base44.asServiceRole.entities.ChannelConnection.update(connection_id, updatePayload);
  console.log('[fetchGBPLocations] SUCCESS —', allLocations.length, 'locations saved');
  return Response.json({ success: true, diag, locations: allLocations, auto_selected: autoSelect?.name || null });
});

async function persistDiag(base44, connection_id, conn, diag, errorMessage, extraFields = {}, preserveDests = false) {
  // Determine which API step failed and its HTTP status / raw response
  const failedStep = diag.step_outcome || 'unknown';
  const httpStatus = diag.account_api_http_status ?? diag.token_refresh_http_status ?? null;
  const rawResponse = diag.account_api_raw_body
    ?? diag.token_refresh_raw
    ?? (diag.location_api_errors?.length ? JSON.stringify(diag.location_api_errors) : null)
    ?? null;

  const update = {
    dest_sync_at: diag.synced_at,
    dest_sync_count: preserveDests ? (conn.dest_sync_count ?? 0) : (diag.destinations_saved ?? 0),
    dest_sync_error: errorMessage,
    dest_sync_step: failedStep,
    dest_sync_http_status: httpStatus !== null ? String(httpStatus) : null,
    dest_sync_raw_response: rawResponse ? String(rawResponse).slice(0, 1000) : null,
    error_message: errorMessage,
    gbp_diag_json: JSON.stringify(diag),
    ...extraFields,
  };
  if (!preserveDests) {
    update.destinations_json = JSON.stringify([]);
  }
  await base44.asServiceRole.entities.ChannelConnection.update(connection_id, update);

  // Also write a PostingLog entry so the health check panel picks it up immediately
  try {
    await base44.asServiceRole.entities.PostingLog.create({
      client_id: conn.client_id || null,
      provider: 'google_business_profile',
      event_type: 'oauth_callback',
      event_time: diag.synced_at,
      status: 'failed',
      message: `${failedStep} — ${errorMessage}`,
      error_details: rawResponse ? String(rawResponse).slice(0, 500) : null,
      payload: JSON.stringify({
        step: failedStep,
        http_status: httpStatus,
        final_diagnosis: diag.final_diagnosis,
        token_present: diag.token_present,
        has_refresh_token: diag.has_refresh_token,
        scopes: conn.scopes || null,
      }),
    });
  } catch (_) {
    // Non-fatal — log write failure should not break the main response
  }
}