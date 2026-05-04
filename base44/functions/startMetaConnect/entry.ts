// OAUTH_SCOPE_VERSION=2026-05-04-reduced-scopes
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const REDIRECT_URI = 'https://new-tech-advertising.base44.app/api/functions/metaOAuthCallback';
const OAUTH_SCOPE_VERSION = '2026-05-04-reduced-scopes';

// HARDCODED — META_OAUTH_SCOPES env var is intentionally NOT read here.
const SCOPE = 'public_profile,email,pages_show_list';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accountId } = await req.json();
    if (!accountId) return Response.json({ error: 'accountId is required' }, { status: 400 });

    if (user.role !== 'admin') {
      const account = await base44.entities.TrialAccount.filter({ id: accountId });
      if (!account?.length) return Response.json({ error: 'Account not found or access denied' }, { status: 403 });
    }

    const state = accountId;

    const params = new URLSearchParams({
      client_id: Deno.env.get('META_APP_ID'),
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      response_type: 'code',
      oauth_scope_version: OAUTH_SCOPE_VERSION,
      state,
    });

    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?${params}`;

    console.log(`[startMetaConnect] ===== DEBUG =====`);
    console.log(`[startMetaConnect] FUNCTION_NAME=startMetaConnect`);
    console.log(`[startMetaConnect] OAUTH_SCOPE_VERSION=${OAUTH_SCOPE_VERSION}`);
    console.log(`[startMetaConnect] SCOPE=${SCOPE}`);
    console.log(`[startMetaConnect] AUTH_URL=${authUrl}`);
    console.log(`[startMetaConnect] =================`);

    return Response.json({ authUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});