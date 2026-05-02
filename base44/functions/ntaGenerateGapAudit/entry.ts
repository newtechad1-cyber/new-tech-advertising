import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { audit_id } = await req.json();
  if (!audit_id) return Response.json({ error: 'audit_id required' }, { status: 400 });

  const audits = await base44.asServiceRole.entities.GapAudit.filter({ id: audit_id });
  const audit = audits[0];
  if (!audit) return Response.json({ error: 'Audit not found' }, { status: 404 });

  // Fetch prospect info for context
  let prospectContext = '';
  if (audit.prospect_id) {
    const prospects = await base44.asServiceRole.entities.Prospect.filter({ id: audit.prospect_id });
    const p = prospects[0];
    if (p) {
      prospectContext = `Business: ${p.business_name}, Industry: ${p.industry || 'unknown'}, City: ${p.city || 'unknown'}, Website: ${audit.website_url}`;
    }
  }

  const prompt = `You are an expert local business marketing analyst for NTA (New Tech Advertising) in North Iowa.

Analyze this local service business and generate a Gap Audit report.

Business Info: ${prospectContext || `Website: ${audit.website_url}`}

Generate a comprehensive gap audit with:
1. A compelling executive summary (2-3 sentences) explaining their biggest visibility gap
2. Top 5 specific issues found (be specific to a local service business: missing SEO pages, no Google Business Profile posts, outdated website, no seasonal campaigns, weak CTAs, no video content, etc.)
3. Top 5 missed revenue opportunities (leads they're losing to competitors right now)
4. 5 prioritized recommended next steps
5. A follow-up email draft from Rick at NTA to this business owner, friendly and consultative tone, with CTA "Build My Lead System"

Return as JSON with keys: summary, issues (array of strings), missed_opportunities (array of strings), recommendations (array of strings), follow_up_email (string with subject and body separated by |||)`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        issues: { type: 'array', items: { type: 'string' } },
        missed_opportunities: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        follow_up_email: { type: 'string' },
      },
    },
  });

  // Update the GapAudit record
  await base44.asServiceRole.entities.GapAudit.update(audit_id, {
    summary: result.summary,
    issues_found: result.issues,
    missed_opportunities: result.missed_opportunities,
    recommendations: result.recommendations,
    status: 'completed',
  });

  // Store follow-up email as a ContentAsset draft if client_id or prospect_id exists
  const parts = (result.follow_up_email || '').split('|||');
  const emailSubject = parts[0]?.trim() || `Follow-Up: Gap Audit for ${prospectContext}`;
  const emailBody = parts[1]?.trim() || result.follow_up_email;

  if (audit.client_id || audit.prospect_id) {
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id: audit.client_id || '',
      asset_type: 'email',
      title: emailSubject,
      content: emailBody,
      platform: 'email',
      status: 'draft',
      approval_status: 'not_needed',
      notes: 'Auto-generated follow-up from Gap Audit. CTA: Build My Lead System',
    });
  }

  return Response.json({ success: true, audit: result });
});