import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function cleanText(value, maxLength = 300) {
  return String(value || '').trim().slice(0, maxLength);
}

function sanitizePages(pages) {
  if (!Array.isArray(pages)) return [];

  return pages
    .slice(0, 100)
    .map((page) => ({
      id: cleanText(page?.id, 160),
      name: cleanText(page?.name, 300),
      category: cleanText(page?.category, 160),
    }))
    .filter((page) => page.id && page.name);
}

function toPublicSummary(connection) {
  if (!connection) return null;

  return {
    id: connection.id,
    account_id: connection.account_id,
    status: connection.status,
    facebook_page_id: connection.facebook_page_id || null,
    facebook_page_name: connection.facebook_page_name || null,
    instagram_business_account_id: connection.instagram_business_account_id || null,
    instagram_username: connection.instagram_username || null,
    available_pages: sanitizePages(connection.available_pages),
    last_error: cleanText(connection.last_error, 1000) || null,
    expires_at: connection.expires_at || null,
  };
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

    return Response.json({
      connection: toPublicSummary(connections?.[0] || null),
    });
  } catch (error) {
    console.error('[getMetaConnectionSummary] failed:', error?.message || error);
    return Response.json({ error: 'Unable to load Meta connection' }, { status: 500 });
  }
});
