import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        
        const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
        
        // Admins see all companies; clients see only their own
        if (isAdmin) {
            const companies = await base44.asServiceRole.entities.Company.list();
            return Response.json({ companies });
        } else {
            if (!user.client_id) {
                return Response.json({ companies: [] });
            }
            const company = await base44.asServiceRole.entities.Company.get(user.client_id);
            return Response.json({ companies: company ? [company] : [] });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});