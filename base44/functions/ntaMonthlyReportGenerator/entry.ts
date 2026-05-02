import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { client_id, report_month, campaign_id } = await req.json();
  if (!client_id || !report_month) return Response.json({ error: 'client_id and report_month required' }, { status: 400 });

  const clients = await base44.asServiceRole.entities.Client.filter({ id: client_id });
  const client = clients[0];
  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 });

  // Count all entity types for this client
  const [leads, contentAssets, campaigns, seoPages, socialPosts, videoScripts] = await Promise.all([
    base44.asServiceRole.entities.Lead.filter({ client_id }),
    base44.asServiceRole.entities.ContentAsset.filter({ client_id }),
    base44.asServiceRole.entities.Campaign.filter({ client_id }),
    base44.asServiceRole.entities.SEOPage.filter({ client_id }),
    base44.asServiceRole.entities.SocialPost.filter({ client_id }),
    base44.asServiceRole.entities.VideoScript.filter({ client_id }),
  ]);

  // Filter by month prefix (YYYY-MM)
  const inMonth = (dateStr) => dateStr && dateStr.startsWith(report_month);

  const monthLeads = leads.filter(l => inMonth(l.created_date));
  const monthPosts = socialPosts.filter(p => p.status === 'published' && inMonth(p.created_date));
  const monthVideos = videoScripts.filter(v => v.status === 'completed' && inMonth(v.created_date));
  const monthPages = seoPages.filter(p => p.status === 'published' && inMonth(p.created_date));
  const monthAssets = contentAssets.filter(a => inMonth(a.created_date));

  const leadsByStatus = monthLeads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const prompt = `You are a local marketing performance analyst for NTA (New Tech Advertising) in North Iowa.

Generate a monthly performance report and next-month recommendations for this client.

Client: ${client.business_name}
Industry: ${client.industry || 'local service business'}
Location: ${client.service_area || 'North Iowa'}
Report Month: ${report_month}

Activity This Month:
- Total Leads: ${monthLeads.length} (breakdown: ${JSON.stringify(leadsByStatus)})
- Social Posts Published: ${monthPosts.length}
- Videos Completed: ${monthVideos.length}
- SEO Pages Published: ${monthPages.length}
- Content Assets Created: ${monthAssets.length}
- Active Campaigns: ${campaigns.filter(c => c.status === 'active').length}
- Total SEO Pages: ${seoPages.length}

Generate:
1. summary: A 3-4 sentence plain-English summary of what was accomplished this month and its business impact
2. highlights: Array of 3-5 specific wins or notable activities from this month
3. recommendations: Array of 5 specific, actionable next-month recommendations (be specific to their industry, season, and location)
4. next_month_focus: The single most important thing to focus on next month and why`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        highlights: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        next_month_focus: { type: 'string' },
      },
    },
  });

  // Save Report record
  const report = await base44.asServiceRole.entities.Report.create({
    client_id,
    campaign_id: campaign_id || '',
    report_month,
    leads_generated: monthLeads.length,
    pages_created: monthPages.length,
    posts_published: monthPosts.length,
    videos_created: monthVideos.length,
    recommendations: result.recommendations,
    summary: result.summary,
  });

  return Response.json({
    success: true,
    report_id: report.id,
    report_month,
    client: client.business_name,
    metrics: {
      leads: monthLeads.length,
      posts_published: monthPosts.length,
      videos_completed: monthVideos.length,
      seo_pages_published: monthPages.length,
      content_assets: monthAssets.length,
      active_campaigns: campaigns.filter(c => c.status === 'active').length,
    },
    summary: result.summary,
    highlights: result.highlights,
    recommendations: result.recommendations,
    next_month_focus: result.next_month_focus,
  });
});