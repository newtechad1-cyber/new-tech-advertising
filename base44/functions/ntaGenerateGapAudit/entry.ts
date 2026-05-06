import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  // Support being called from automation (payload.data.id) or directly (audit_id)
  const audit_id = body.audit_id || body?.event?.entity_id || body?.data?.id;
  if (!audit_id) return Response.json({ error: 'audit_id required' }, { status: 400 });

  const audits = await base44.asServiceRole.entities.GapAudit.filter({ id: audit_id });
  const audit = audits[0];
  if (!audit) return Response.json({ error: 'Audit not found' }, { status: 404 });

  // If already completed (e.g. came from AI Gap Scanner), skip re-generation
  if (audit.status === 'completed' && audit.quick_summary) {
    return Response.json({ success: true, skipped: true, reason: 'Audit already completed' });
  }

  // Build context from audit record first, then enrich from linked lead/prospect
  let businessName = audit.business_name || audit.website_url || 'Unknown Business';
  let industry = audit.industry || 'service business';
  let city = audit.city || 'North Iowa';
  let contactName = audit.contact_name || '';

  if (audit.lead_id) {
    const leads = await base44.asServiceRole.entities.SalesLead.filter({ id: audit.lead_id }).catch(() => []);
    const l = leads[0];
    if (l) {
      businessName = l.business_name || businessName;
      industry = l.industry || industry;
      city = l.city || city;
      contactName = l.contact_name || contactName;
    }
  } else if (audit.prospect_id) {
    const prospects = await base44.asServiceRole.entities.Prospect.filter({ id: audit.prospect_id }).catch(() => []);
    const p = prospects[0];
    if (p) {
      businessName = p.business_name || businessName;
      industry = p.industry || industry;
      city = p.city || city;
      contactName = p.contact_name || contactName;
    }
  }

  const prompt = `You are an expert local business marketing analyst for NTA (New Tech Advertising) in North Iowa.

Analyze this local service business and generate a Gap Audit report.

Business: ${businessName}
Industry: ${industry}
City: ${city}
Website: ${audit.website_url}

Generate a comprehensive gap audit with:
1. A compelling executive summary (2-3 sentences) explaining their biggest visibility gap
2. Top 5 specific issues found (be specific: missing SEO pages, no Google Business Profile posts, outdated website, no seasonal campaigns, weak CTAs, no video content, etc.)
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

  await base44.asServiceRole.entities.GapAudit.update(audit_id, {
    summary: result.summary,
    quick_summary: result.summary,
    business_name: businessName,
    industry,
    city,
    issues_found: result.issues,
    missed_opportunities: result.missed_opportunities,
    recommendations: result.recommendations,
    status: 'completed',
  });

  // Store follow-up email as a ContentAsset draft
  const parts = (result.follow_up_email || '').split('|||');
  const emailSubject = parts[0]?.trim() || `Follow-Up: Gap Audit for ${businessName}`;
  const emailBody = parts[1]?.trim() || result.follow_up_email;

  if (audit.client_id || audit.lead_id || audit.prospect_id) {
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id: audit.client_id || '',
      asset_type: 'email',
      title: emailSubject,
      content: emailBody,
      platform: 'email',
      status: 'draft',
      approval_status: 'not_needed',
      notes: `Auto-generated follow-up from Gap Audit for ${businessName}. CTA: Build My Lead System`,
    }).catch(() => {});
  }

  return Response.json({ success: true, audit: result });
});