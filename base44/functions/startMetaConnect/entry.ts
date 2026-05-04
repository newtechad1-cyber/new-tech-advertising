import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/metaOAuthCallback';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accountId } = await req.json();
    if (!accountId) return Response.json({ error: 'accountId is required' }, { status: 400 });

    // Verify user can act for this account (admin or account member)
    if (user.role !== 'admin') {
      const account = await base44.entities.TrialAccount.filter({ id: accountId });
      if (!account?.length) return Response.json({ error: 'Account not found or access denied' }, { status: 403 });
    }

    const scopes = [
      'public_profile',
      'email',
      'pages_show_list',
    ].join(',');

    const state = accountId;

    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: REDIRECT_URI,
      scope: scopes,
      response_type: 'code',
      state,
    });

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
    return Response.json({ authUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});