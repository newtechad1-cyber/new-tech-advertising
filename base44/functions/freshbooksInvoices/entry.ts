import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const { _method, ...payload } = body;
    const method = _method || "GET";

    const connectorId = "6a5803ed18a980baf5370db9";
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(connectorId);

    const meRes = await fetch("https://api.freshbooks.com/auth/api/v1/users/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Api-Version": "alpha"
      }
    });
    
    if (!meRes.ok) {
      const err = await meRes.text();
      throw new Error("Failed to fetch FreshBooks identity: " + err);
    }
    
    const meData = await meRes.json();
    const membership = meData.response?.business_memberships?.[0];
    if (!membership) {
        throw new Error("No business membership found.");
    }
    const accountId = membership.business.account_id;

    let url = `https://api.freshbooks.com/accounting/account/${accountId}/invoices/invoices`;
    if (payload.invoiceid) {
        url += `/${payload.invoiceid}`;
    }

    const options: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Api-Version": "alpha",
        "Content-Type": "application/json"
      }
    };

    if (method === "POST" || method === "PUT") {
        options.body = JSON.stringify({ invoice: payload });
    }

    const fbRes = await fetch(url, options);
    
    if (fbRes.status === 204) {
        return new Response(null, { status: 204 });
    }

    const fbData = await fbRes.json();
    let result = fbData.response?.result || fbData.response?.errors || fbData;
    if (method === "GET" && result.invoices === undefined && Array.isArray(result.invoice)) {
       result = { invoices: result.invoice };
    }
    return Response.json(result);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});