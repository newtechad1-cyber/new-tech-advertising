import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        
        const isAdmin = user.role === 'admin' || user.email === 'info@newtechadvertising.com';
        
        // Admins see all deals; clients see only deals linked to their client_id
        if (isAdmin) {
            const deals = await base44.asServiceRole.entities.SalesDeal.list();
            return Response.json({ deals });
        } else {
            if (!user.client_id) {
                return Response.json({ deals: [] });
            }
            const deals = await base44.asServiceRole.entities.SalesDeal.filter({ company_id: user.client_id });
            return Response.json({ deals });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});