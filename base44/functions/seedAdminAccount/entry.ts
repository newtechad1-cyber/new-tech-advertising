import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function isTrustedInternalUser(user) {
  return Boolean(user && (user.is_service === true || user.role === 'admin'));
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me().catch(() => null);
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });
        
        return Response.json(
            { error: 'This retired administrator-seeding endpoint is no longer available.' },
            { status: 410 },
        );
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});