import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accountId, pageId } = await req.json();
    if (!accountId || !pageId) return Response.json({ error: 'accountId and pageId are required' }, { status: 400 });

    const connections = await base44.asServiceRole.entities.MetaConnection.filter({ account_id: accountId });
    if (!connections.length) return Response.json({ error: 'No pending MetaConnection found' }, { status: 404 });

    const conn = connections[0];
    const pages = conn.available_pages || [];
    const page = pages.find(p => p.id === pageId);
    if (!page) return Response.json({ error: 'Page not found in available pages' }, { status: 400 });

    const igAccount = await getIgAccount(page.id, page.access_token);

    await base44.asServiceRole.entities.MetaConnection.update(conn.id, {
      status: 'connected',
      facebook_page_id: page.id,
      facebook_page_name: page.name,
      page_access_token: page.access_token,
      instagram_business_account_id: igAccount?.id || null,
      instagram_username: igAccount?.username || null,
      available_pages: [],
      last_error: null,
    });

    return Response.json({
      success: true,
      facebook_page_name: page.name,
      instagram_username: igAccount?.username || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});