import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        
        const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
        
        if (isAdmin) {
            const approvals = await base44.asServiceRole.entities.ApprovalRequest.list('-requested_date', 100);
            return Response.json({ approvals });
        } else {
            if (!user.client_id) return Response.json({ approvals: [] });
            const approvals = await base44.asServiceRole.entities.ApprovalRequest.filter({ client_id: user.client_id }, '-requested_date', 100);
            return Response.json({ approvals });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});