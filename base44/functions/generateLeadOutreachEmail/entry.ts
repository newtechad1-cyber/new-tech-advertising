import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin' && user.is_service !== true) {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { company, auditSummary } = await req.json();
    const co = company || {};

    const prompt = `Write a short, personalized cold outreach email for a digital marketing agency reaching out to this local business.
Business: ${co.company_name || 'Unknown'}
Website: ${co.website || 'their website'}
City: ${co.city || ''}, ${co.state || ''}

Audit findings summary:
${auditSummary || 'Standard local business with room for improvement'}

Email must:
- Be under 150 words
- Sound human, not salesy
- Reference one specific finding from the audit
- Have a clear, low-pressure CTA (free call, free audit review)
- Subject line included at top as "Subject: ..."

Return only the email text.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ email: typeof result === 'string' ? result : result?.text || '' });
  } catch (error) {
    console.error('[generateLeadOutreachEmail] Error:', error?.message || error);
    return Response.json({ error: 'Outreach email generation failed' }, { status: 500 });
  }
});