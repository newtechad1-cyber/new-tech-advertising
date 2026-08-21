import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });
        
        // Use the system invite function to securely create/invite the admin account
        await base44.users.inviteUser("info@newtechadvertising.com", "admin");
        
        return Response.json({ 
            success: true, 
            message: "Successfully seeded info@newtechadvertising.com as an admin user." 
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});