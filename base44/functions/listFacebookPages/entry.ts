import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("facebook_pages");
    if (!accessToken) {
      return Response.json({ error: 'Facebook Pages connector is not authorized. Please connect it in the chat.' }, { status: 400 });
    }

    // List pages
    const response = await fetch("https://graph.facebook.com/v25.0/me/accounts?fields=id,name,access_token", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 400 });
    }

    return Response.json({ pages: data.data || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});