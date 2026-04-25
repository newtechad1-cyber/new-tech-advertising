import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Read-only diagnostic: probes /me/accounts and instagram_business_account for each page.
// Does NOT write to any entity. Returns structured diagnostic data.

Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let body = {};
  try { body = await req.json(); } catch (_) {}

  const { connection_id } = body;
  if (!connection_id) return Response.json({ error: 'connection_id required' }, { status: 400 });

  // Load the connection to get the stored access token
  const conns = await base44.asServiceRole.entities.ChannelConnection.filter({ id: connection_id });
  const conn = conns[0];
  if (!conn) return Response.json({ error: 'Connection not found' }, { status: 404 });

  const token = conn.access_token;
  if (!token) return Response.json({ error: 'No access token stored on this connection', diag: null });

  const diag = {
    connection_id,
    provider: conn.provider,
    token_present: true,
    permissions: [],   // { permission, status }
    permissions_error: null,
    accounts_http_status: null,
    accounts_raw_error: null,
    pages: [],         // { id, name, has_ig_business_account, ig_id, ig_username, ig_error }
    summary: null,
    checked_at: new Date().toISOString(),
  };

  // Step 0: /me/permissions
  try {
    const permRes = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token}`);
    const permData = await permRes.json();
    if (permData.error) {
      diag.permissions_error = `code=${permData.error.code} type=${permData.error.type} message=${permData.error.message}`;
    } else {
      diag.permissions = permData.data || [];
    }
  } catch (e) {
    diag.permissions_error = `Network error: ${e.message}`;
  }

  // Step 1: /me/accounts
  let accountsRaw = '';
  let accountsData = {};
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,category&access_token=${token}`
    );
    diag.accounts_http_status = res.status;
    accountsRaw = await res.text();
    try { accountsData = JSON.parse(accountsRaw); } catch (_) { accountsData = {}; }
  } catch (netErr) {
    diag.accounts_raw_error = `Network error: ${netErr.message}`;
    diag.summary = 'Network error reaching Graph API';
    return Response.json({ diag });
  }

  if (accountsData.error) {
    diag.accounts_raw_error = `code=${accountsData.error.code} type=${accountsData.error.type} message=${accountsData.error.message}`;
    diag.summary = `Graph API error on /me/accounts: ${accountsData.error.message}`;
    return Response.json({ diag });
  }

  const pages = accountsData.data || [];
  if (pages.length === 0) {
    diag.summary = 'No Facebook Pages returned by /me/accounts. Token may lack pages_show_list permission or account manages no pages.';
    return Response.json({ diag });
  }

  // Step 2: For each page, check instagram_business_account
  for (const page of pages) {
    const entry = {
      id: page.id,
      name: page.name,
      category: page.category || '',
      has_ig_business_account: false,
      ig_id: null,
      ig_username: null,
      ig_name: null,
      ig_error: null,
    };

    const pageToken = page.access_token || token;

    try {
      const igCheckRes = await fetch(
        `https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${pageToken}`
      );
      const igCheckData = await igCheckRes.json();

      if (igCheckData.error) {
        entry.ig_error = `code=${igCheckData.error.code} type=${igCheckData.error.type} message=${igCheckData.error.message}`;
      } else if (igCheckData.instagram_business_account?.id) {
        entry.has_ig_business_account = true;
        const igId = igCheckData.instagram_business_account.id;

        // Fetch IG details
        const igDetailRes = await fetch(
          `https://graph.facebook.com/v19.0/${igId}?fields=id,name,username&access_token=${pageToken}`
        );
        const igDetail = await igDetailRes.json();

        if (igDetail.error) {
          entry.ig_id = igId;
          entry.ig_error = `IG detail fetch failed — code=${igDetail.error.code} message=${igDetail.error.message}`;
        } else {
          entry.ig_id = igDetail.id || igId;
          entry.ig_username = igDetail.username || null;
          entry.ig_name = igDetail.name || null;
        }
      }
    } catch (e) {
      entry.ig_error = `Network error: ${e.message}`;
    }

    diag.pages.push(entry);
  }

  const igFound = diag.pages.filter(p => p.has_ig_business_account).length;
  diag.summary = `Found ${pages.length} page${pages.length !== 1 ? 's' : ''}. ${igFound} with linked Instagram Business account${igFound !== 1 ? 's' : ''}.`;

  return Response.json({ diag });
});