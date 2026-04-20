import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Cooldown duration after a quota error: 2 minutes (Google's per-minute quota window)
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
  return res.json();
}

function classifyApiError(errorObj) {
  if (!errorObj) return null;
  const status = errorObj.code || errorObj.status;
  const msg = (errorObj.message || '').toLowerCase();
  if (status === 429 || msg.includes('quota') || msg.includes('rate limit')) return 'quota_exceeded';
  if (msg.includes('disabled') || msg.includes('not enabled') || msg.includes('has not been used')) return 'api_disabled';
  if (status === 403 && (msg.includes('permission') || msg.includes('forbidden'))) return 'no_permission';
  if (status === 401 || msg.includes('unauthenticated') || msg.includes('invalid_grant')) return 'auth_failed';
  if (status === 404) return 'not_found';
  return 'api_error';
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let payload = {};
  try { payload = await req.json(); } catch (_) {}
  const { connection_id, force = false } = payload;

  if (!connection_id) return Response.json({ error: 'connection_id required' }, { status: 400 });

  // Load connection
  const conns = await base44.asServiceRole.entities.ChannelConnection.filter({ id: connection_id });
  const conn = conns[0];
  if (!conn) return Response.json({ error: 'Connection not found' }, { status: 404 });
  if (conn.provider !== 'google_business_profile') return Response.json({ error: 'For google_business_profile only' }, { status: 400 });

  const now = Date.now();

  // ── Cooldown guard ───────────────────────────────────────────────────────
  if (!force && conn.dest_sync_cooldown_until) {
    const cooldownUntil = new Date(conn.dest_sync_cooldown_until).getTime();
    if (cooldownUntil > now) {
      const secsLeft = Math.ceil((cooldownUntil - now) / 1000);
      const minutesLeft = Math.ceil(secsLeft / 60);
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
    step: 'init',
    token_present: !!conn.access_token,
    token_refreshed: false,
    token_refresh_error: null,
    account_api_attempted: false,
    account_api_http_status: null,
    account_api_error: null,
    account_api_error_class: null,
    accounts_returned: null,
    account_sample: [],
    location_api_attempted: false,
    location_api_errors: [],
    locations_returned: null,
    location_sample: [],
    destinations_saved: null,
    auto_selected: null,
    final_diagnosis: null,
    synced_at: syncAt,
    forced: force,
  };

  // ── Step 1: Token ────────────────────────────────────────────────────────
  let accessToken = conn.access_token;
  if (!accessToken) {
    diag.step = 'token_missing';
    diag.final_diagnosis = 'no_token';
    await persistDiag(base44, connection_id, conn, diag, 'No access token — reconnect OAuth');
    return Response.json({ success: false, diag, error: 'No access token' });
  }

  if (conn.refresh_token) {
    const expiresAt = conn.expires_at ? new Date(conn.expires_at) : new Date(0);
    if (expiresAt < new Date(now + 5 * 60 * 1000)) {
      const refreshed = await refreshGoogleToken(conn.refresh_token);
      if (refreshed.access_token) {
        accessToken = refreshed.access_token;
        diag.token_refreshed = true;
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, {
          access_token: accessToken,
          expires_at: new Date(now + (refreshed.expires_in || 3600) * 1000).toISOString(),
        });
      } else {
        diag.step = 'token_refresh_failed';
        diag.token_refresh_error = `${refreshed.error}: ${refreshed.error_description || ''}`;
        diag.final_diagnosis = 'auth_failed';
        await base44.asServiceRole.entities.ChannelConnection.update(connection_id, { status: 'expired' });
        await persistDiag(base44, connection_id, conn, diag, `Token refresh failed: ${diag.token_refresh_error}`);
        return Response.json({ success: false, diag, error: diag.token_refresh_error });
      }
    }
  }

  diag.step = 'accounts_api';

  // ── Step 2: Accounts API ─────────────────────────────────────────────────
  diag.account_api_attempted = true;
  let accountData;
  try {
    const accountRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    diag.account_api_http_status = accountRes.status;
    accountData = await accountRes.json();
  } catch (netErr) {
    diag.step = 'accounts_network_error';
    diag.account_api_error = netErr.message;
    diag.final_diagnosis = 'network_error';
    await persistDiag(base44, connection_id, conn, diag, `Network error: ${netErr.message}`);
    return Response.json({ success: false, diag, error: netErr.message });
  }

  console.log('[fetchGBPLocations] accounts http:', diag.account_api_http_status, '| preview:', JSON.stringify(accountData).slice(0, 300));

  if (accountData.error) {
    diag.account_api_error = accountData.error.message || JSON.stringify(accountData.error);
    diag.account_api_error_class = classifyApiError(accountData.error);
    diag.final_diagnosis = diag.account_api_error_class;

    const isQuota = diag.account_api_error_class === 'quota_exceeded';

    const humanMsg = {
      quota_exceeded:  'Google API quota exceeded — this project is being rate-limited',
      api_disabled:    'My Business Account Management API is not enabled in Google Cloud Console',
      no_permission:   'This Google user lacks permission to access the Business Profile API',
      auth_failed:     'OAuth token rejected — token may be expired or revoked',
      api_error:       `Accounts API error (${accountData.error.code}): ${accountData.error.message}`,
    }[diag.account_api_error_class] || diag.account_api_error;

    // Set cooldown on quota errors; preserve existing destinations
    const extraFields = {};
    if (isQuota) {
      extraFields.dest_sync_cooldown_until = new Date(now + QUOTA_COOLDOWN_MS).toISOString();
      extraFields.dest_sync_last_quota_error = syncAt;
      // Preserve existing destinations — do NOT wipe them
    }

    await persistDiag(base44, connection_id, conn, diag, humanMsg, extraFields, /* preserveDests */ isQuota);
    return Response.json({
      success: false,
      diag,
      error: humanMsg,
      cooldown: isQuota,
      cooldown_until: isQuota ? new Date(now + QUOTA_COOLDOWN_MS).toISOString() : null,
    });
  }

  // ── Step 3: Parse accounts ───────────────────────────────────────────────
  const accounts = accountData.accounts || [];
  diag.accounts_returned = accounts.length;
  diag.account_sample = accounts.slice(0, 3).map(a => ({ id: a.name, name: a.accountName || a.displayName || a.name }));

  if (!accounts.length) {
    diag.step = 'no_accounts';
    diag.locations_returned = 0;
    diag.destinations_saved = 0;
    diag.final_diagnosis = 'no_accounts';
    await persistDiag(base44, connection_id, conn, diag, 'Connected Google user has no accessible Business Profile accounts');
    return Response.json({ success: false, diag, error: 'This Google account has no Business Profile accounts.' });
  }

  diag.step = 'locations_api';
  diag.location_api_attempted = true;
  const allLocations = [];

  // ── Step 4: Locations API ────────────────────────────────────────────────
  for (const account of accounts) {
    let locRes, locData;
    try {
      locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storeCode,storefrontAddress`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      locData = await locRes.json();
    } catch (netErr) {
      diag.location_api_errors.push({ account: account.name, error: netErr.message, class: 'network_error' });
      continue;
    }

    console.log('[fetchGBPLocations] locations for', account.name, 'http:', locRes.status, '| preview:', JSON.stringify(locData).slice(0, 300));

    if (locData.error) {
      const errClass = classifyApiError(locData.error);
      diag.location_api_errors.push({
        account: account.name,
        http_status: locRes.status,
        error: locData.error.message || JSON.stringify(locData.error),
        class: errClass,
        raw_code: locData.error.code,
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

  // ── Step 5: Zero-location diagnosis ─────────────────────────────────────
  if (allLocations.length === 0) {
    diag.destinations_saved = 0;
    const locErrors = diag.location_api_errors;
    if (locErrors.some(e => e.class === 'api_disabled'))      diag.final_diagnosis = 'locations_api_disabled';
    else if (locErrors.some(e => e.class === 'no_permission')) diag.final_diagnosis = 'locations_no_permission';
    else if (locErrors.length === accounts.length)             diag.final_diagnosis = 'locations_api_errors';
    else                                                       diag.final_diagnosis = 'accounts_exist_no_locations';

    const humanMsg = {
      locations_api_disabled:      'My Business Business Information API is not enabled in Google Cloud Console',
      locations_no_permission:     'Token lacks permission to read locations — re-authenticate with business.manage scope',
      locations_api_errors:        `Locations API errors on all ${accounts.length} account(s) — see step trace`,
      accounts_exist_no_locations: `Found ${accounts.length} account(s) but zero locations — may have no verified listings`,
    }[diag.final_diagnosis] || 'Zero locations returned';

    await persistDiag(base44, connection_id, conn, diag, humanMsg);
    return Response.json({ success: false, diag, error: humanMsg });
  }

  // ── Step 6: Save successfully ────────────────────────────────────────────
  diag.step = 'saving';
  const autoSelect = allLocations.length === 1 ? allLocations[0] : null;
  diag.auto_selected = autoSelect?.name || null;
  diag.destinations_saved = allLocations.length;
  diag.final_diagnosis = 'success';

  const updatePayload = {
    destinations_json: JSON.stringify(allLocations),
    dest_sync_at: syncAt,
    dest_sync_count: allLocations.length,
    dest_sync_error: null,
    dest_sync_cooldown_until: null,           // clear cooldown on success
    dest_sync_last_quota_error: conn.dest_sync_last_quota_error || null,
    dest_sync_last_success: syncAt,           // track last successful sync
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

// Persist diagnostic fields without wiping stored destinations when preserveDests=true
async function persistDiag(base44, connection_id, conn, diag, errorMessage, extraFields = {}, preserveDests = false) {
  const update = {
    dest_sync_at: diag.synced_at,
    dest_sync_count: preserveDests ? (conn.dest_sync_count ?? 0) : (diag.destinations_saved ?? 0),
    dest_sync_error: errorMessage,
    error_message: errorMessage,
    gbp_diag_json: JSON.stringify(diag),
    ...extraFields,
  };
  // When preserving, explicitly keep existing destinations_json intact (don't set it)
  if (!preserveDests) {
    update.destinations_json = JSON.stringify([]);
  }
  await base44.asServiceRole.entities.ChannelConnection.update(connection_id, update);
}