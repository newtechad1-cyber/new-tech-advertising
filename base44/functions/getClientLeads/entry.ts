import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (user.role === 'admin' || user.is_service === true) {
      const leads = await base44.asServiceRole.entities.SalesLead.list();
      return Response.json({ leads });
    }

    const memberships = await base44.asServiceRole.entities.ClientPortalUser.filter({
      email: user.email,
      access_status: 'Active',
    });
    const clientIds = [...new Set(memberships.map((membership) => membership.client_id).filter(Boolean))];
    if (!clientIds.length) return Response.json({ leads: [] });

    const groups = await Promise.all(
      clientIds.map((clientId) => base44.asServiceRole.entities.SalesLead.filter({ converted_client_id: clientId })),
    );
    return Response.json({ leads: groups.flat() });
  } catch {
    return Response.json({ error: 'Unable to load leads' }, { status: 500 });
  }
});