import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    if (user.role === 'admin' || user.is_service === true) {
      const approvals = await base44.asServiceRole.entities.ApprovalRequest.list('-requested_date', 100);
      return Response.json({ approvals });
    }

    const memberships = await base44.asServiceRole.entities.ClientPortalUser.filter({
      email: user.email,
      access_status: 'Active',
    });
    const clientIds = [...new Set(memberships.map((membership) => membership.client_id).filter(Boolean))];
    if (!clientIds.length) return Response.json({ approvals: [] });

    const groups = await Promise.all(
      clientIds.map((clientId) => base44.asServiceRole.entities.ApprovalRequest.filter(
        { client_id: clientId },
        '-requested_date',
        100,
      )),
    );
    const approvals = groups.flat().sort((a, b) => String(b.requested_date || '').localeCompare(String(a.requested_date || '')));
    return Response.json({ approvals });
  } catch {
    return Response.json({ error: 'Unable to load approvals' }, { status: 500 });
  }
});