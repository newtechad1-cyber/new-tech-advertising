import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function cleanText(value, maxLength = 300) {
  return String(value || '').trim().slice(0, maxLength);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json().catch(() => null);
    const accountId = cleanText(payload?.accountId, 160);
    if (!accountId) {
      return Response.json({ error: 'accountId is required' }, { status: 400 });
    }

    const connections = await base44.asServiceRole.entities.MetaConnection.filter({
      account_id: accountId,
    });
    const connection = connections?.[0];

    if (!connection) {
      return Response.json({ success: true, disconnected: false });
    }

    await base44.asServiceRole.entities.MetaConnection.update(connection.id, {
      status: 'not_connected',
      facebook_page_id: null,
      facebook_page_name: null,
      instagram_business_account_id: null,
      instagram_username: null,
      page_access_token: null,
      available_pages: [],
      last_error: null,
    });

    return Response.json({ success: true, disconnected: true });
  } catch (error) {
    console.error('[disconnectMetaConnection] failed:', error?.message || error);
    return Response.json({ error: 'Unable to disconnect Meta account' }, { status: 500 });
  }
});
