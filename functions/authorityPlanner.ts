import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Load settings
  const settingsList = await base44.asServiceRole.entities.Settings.list();
  if (!settingsList || settingsList.length === 0) {
    console.error('[AuthorityPlanner] No settings record found. Aborting.');
    return Response.json({ error: 'No settings record found. Please configure GlobalSettings first.' }, { status: 400 });
  }

  const settings = settingsList[0];
  const { business_name, site_url, service_areas, cta, brand_voice, offers } = settings;

  const niche = 'NTA AI marketing for small businesses';
  const location = 'Midwest';

  // Build AI prompt
  const prompt = `
You are a senior SEO and content strategist building a topical authority map for a digital marketing company.

Business: ${business_name}
Website: ${site_url}
Niche: ${niche}
Location: ${location}
Service Areas: ${(service_areas || []).join(', ') || 'Midwest'}
CTA: ${cta || ''}
Brand Voice: ${brand_voice || ''}
Current Offers: ${(offers || []).join(', ') || ''}

Generate a weekly topical authority plan. Return STRICT JSON only — no markdown, no explanation, no code blocks.

Requirements:
- Exactly 5 pillars
- Each pillar must have exactly 8-10 cluster topics
- Topics must be practical, small-business focused, Midwest-leaning, and search-intent driven
- Include: how-to, mistakes, cost, comparison, templates, checklists, case-study angles
- No vague titles — every topic must be specific and actionable
- internal_link_strategy: describe how these pillars interconnect with internal links
- authority_positioning_summary: 2-3 sentence summary of how this plan builds topical authority

JSON schema to follow exactly:
{
  "pillars": [
    { "pillar_title": "string", "cluster_topics": ["string", "string", ...] }
  ],
  "internal_link_strategy": "string",
  "authority_positioning_summary": "string"
}
`;

  const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        pillars: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pillar_title: { type: 'string' },
              cluster_topics: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        internal_link_strategy: { type: 'string' },
        authority_positioning_summary: { type: 'string' }
      }
    }
  });

  if (!aiResult || !aiResult.pillars || aiResult.pillars.length === 0) {
    console.error('[AuthorityPlanner] AI returned invalid or empty response.');
    return Response.json({ error: 'AI returned invalid response. No authority map created.' }, { status: 500 });
  }

  // Save AuthorityMap
  const authorityMap = await base44.asServiceRole.entities.AuthorityMap.create({
    niche,
    location,
    pillars: aiResult.pillars,
    internal_link_strategy: aiResult.internal_link_strategy,
    authority_positioning_summary: aiResult.authority_positioning_summary,
    is_archived: false
  });

  console.log('[AuthorityPlanner] AuthorityMap created:', authorityMap.id);

  // Flatten first 7 cluster topics across pillars in order
  const flatTopics = [];
  for (const pillar of aiResult.pillars) {
    for (const topic of pillar.cluster_topics || []) {
      flatTopics.push({ topic, pillar_title: pillar.pillar_title });
      if (flatTopics.length === 7) break;
    }
    if (flatTopics.length === 7) break;
  }

  // Create 7 ContentQueue records (today+1 through today+7)
  const today = new Date();
  const created = [];
  for (let i = 0; i < flatTopics.length; i++) {
    const publishDate = new Date(today);
    publishDate.setDate(today.getDate() + i + 1);
    const dateStr = publishDate.toISOString().split('T')[0];

    const item = await base44.asServiceRole.entities.ContentQueue.create({
      publish_date: dateStr,
      topic: flatTopics[i].topic,
      pillar: flatTopics[i].pillar_title,
      format: 'blog',
      status: 'planned'
    });
    created.push(item.id);
    console.log(`[AuthorityPlanner] ContentQueue item created for ${dateStr}: ${flatTopics[i].topic}`);
  }

  return Response.json({
    success: true,
    authority_map_id: authorityMap.id,
    content_queue_ids: created,
    pillars_count: aiResult.pillars.length,
    topics_scheduled: created.length
  });
});