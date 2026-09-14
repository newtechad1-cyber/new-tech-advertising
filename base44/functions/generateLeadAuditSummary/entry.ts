import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { company } = await req.json();
    const co = company || {};

    const prompt = `You are a marketing analyst. Generate a concise website and online presence audit for this local business:
Business: ${co.company_name || 'Unknown business'}
Website: ${co.website || 'unknown'}
Industry: ${co.industry || 'local business'}
City: ${co.city || ''}, ${co.state || ''}

Cover:
1. Website quality (speed, mobile, design) - estimated issues
2. Google Business Profile presence
3. Social media presence
4. Local SEO visibility
5. Top 3 improvement opportunities
6. Overall grade (A-F)

Be specific and actionable. Format as clear sections.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ summary: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateLeadAuditSummary] Error:', error?.message || error);
    return Response.json({ error: 'Audit generation failed' }, { status: 500 });
  }
});