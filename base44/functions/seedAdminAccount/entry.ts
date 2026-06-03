import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
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