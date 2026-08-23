import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin-only Meshy authentication smoke test.
 * Confirms the MESHY_API_KEY secret is available to deployed backend functions
 * and accepted by Meshy. The secret itself is never returned or logged.
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  if (!user || user.role !== 'admin') {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const apiKey = Deno.env.get('MESHY_API_KEY');
  if (!apiKey) {
    return Response.json({
      ok: false,
      secret_configured: false,
      error: 'MESHY_API_KEY is not available to this backend function.',
    }, { status: 500 });
  }

  try {
    // Meshy's documented animation-list endpoint is a safe read-only auth probe.
    const response = await fetch('https://api.meshy.ai/openapi/v1/animations?page_num=1&page_size=1', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    return Response.json({
      ok: response.ok,
      secret_configured: true,
      meshy_status: response.status,
      meshy_authenticated: response.ok,
      note: response.ok
        ? 'Meshy API key is available and the documented animation-list request succeeded.'
        : 'The secret reached Meshy; inspect the status to distinguish authentication from endpoint or permission issues.',
    }, { status: response.ok ? 200 : 502 });
  } catch (error) {
    return Response.json({
      ok: false,
      secret_configured: true,
      error: 'Meshy request failed before a response was received.',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 502 });
  }
});
