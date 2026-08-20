import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

function isTrustedInternalUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isTrustedInternalUser(user)) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const connectorId = "6a5803ed18a980baf5370db9";
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(connectorId);
      
      if (!accessToken) {
         return Response.json({ connected: false });
      }

      const meRes = await fetch("https://api.freshbooks.com/auth/api/v1/users/me", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
          "Api-Version": "alpha"
        }
      });
      
      if (!meRes.ok) {
        return Response.json({ connected: false, error: await meRes.text() });
      }
      
      const meData = await meRes.json();
      const membership = meData.response?.business_memberships?.[0];
      if (!membership) {
          return Response.json({ connected: true, error: "No business membership found." });
      }
      
      return Response.json({
         connected: true,
         business_name: membership.business.name,
         business_id: membership.business.id,
         account_id: membership.business.account_id,
         last_sync: new Date().toISOString()
      });
      
    } catch (e) {
      return Response.json({ connected: false, error: e.message });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});