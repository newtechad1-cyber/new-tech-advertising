import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Admin-only Meshy API status check.
 * Verifies authentication and lists recent API rigging/animation tasks.
 * Never returns or logs the Meshy API key.
 */
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  if (!user || user.role !== 'admin') {
    return Response.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const apiKey = Deno.env.get('MESHY_API_KEY');
  if (!apiKey) {
    return Response.json({ ok: false, secret_configured: false, error: 'MESHY_API_KEY is not available.' }, { status: 500 });
  }

  const headers = { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' };

  try {
    const [riggingResponse, animationResponse] = await Promise.all([
      fetch('https://api.meshy.ai/openapi/v1/rigging?page_num=1&page_size=20', { headers }),
      fetch('https://api.meshy.ai/openapi/v1/animations?page_num=1&page_size=20', { headers }),
    ]);

    const parse = async (response: Response) => {
      const text = await response.text();
      let data: unknown = text;
      try { data = JSON.parse(text); } catch { /* keep text */ }
      return { status: response.status, ok: response.ok, data };
    };

    const rigging = await parse(riggingResponse);
    const animations = await parse(animationResponse);
    const authenticated = ![401, 403].includes(rigging.status) && ![401, 403].includes(animations.status);

    return Response.json({
      ok: authenticated,
      secret_configured: true,
      meshy_authenticated: authenticated,
      rigging,
      animations,
    }, { status: authenticated ? 200 : 502 });
  } catch (error) {
    return Response.json({
      ok: false,
      secret_configured: true,
      error: 'Meshy request failed before a response was received.',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 502 });
  }
});