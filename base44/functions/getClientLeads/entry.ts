import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        
        const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
        
        // Admins see all leads; clients see only leads linked to their client_id
        if (isAdmin) {
            const leads = await base44.asServiceRole.entities.SalesLead.list();
            return Response.json({ leads });
        } else {
            if (!user.client_id) {
                return Response.json({ leads: [] });
            }
            const leads = await base44.asServiceRole.entities.SalesLead.filter({ converted_client_id: user.client_id });
            return Response.json({ leads });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});