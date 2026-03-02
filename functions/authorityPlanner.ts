import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const logRun = async (status, message, extra = {}) => {
    try {
      await base44.asServiceRole.entities.AuthorityMapRunLog.create({ status, message, ...extra });
    } catch (logErr) {
      console.error('[AuthorityPlanner] Failed to write run log:', logErr.message);
    }
  };

  try {
    // Load settings
    const settingsList = await base44.asServiceRole.entities.Settings.list();
    if (!settingsList || settingsList.length === 0) {
      const msg = 'No settings record found. Please configure GlobalSettings first.';
      console.error('[AuthorityPlanner]', msg);
      await logRun('failed', msg);
      return Response.json({ error: msg }, { status: 400 });
    }

    const settings = settingsList[0];
    const { business_name, site_url, service_areas, cta, brand_voice, offers } = settings;

    const niche = 'NTA AI marketing for small businesses';
    const location = 'Midwest';

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
- internal_link_strategy: fill the structured JSON object below (no plain text)
- authority_positioning_summary: 2-3 sentence summary of how this plan builds topical authority

JSON schema to follow exactly:
{
  "pillars": [
    { "pillar_title": "string", "cluster_topics": ["string", "string", ...] }
  ],
  "internal_link_strategy": {
    "pillar_linking_rule": "How pillar pages should link to cluster pages",
    "cluster_to_pillar_rule": "How cluster posts link back to pillar",
    "service_page_linking_rule": "How blogs link to DIY/DFY service pages",
    "cta_linking_rule": "Where and how to insert primary CTA",
    "horizontal_linking_rule": "How related blogs cross-link",
    "anchor_style_guidelines": "Rules for anchor text tone and format",
    "max_links_per_post": 5
  },
  "authority_positioning_summary": "string"
}
`;

    let aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
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
          internal_link_strategy: {
          type: 'object',
          properties: {
            pillar_linking_rule: { type: 'string' },
            cluster_to_pillar_rule: { type: 'string' },
            service_page_linking_rule: { type: 'string' },
            cta_linking_rule: { type: 'string' },
            horizontal_linking_rule: { type: 'string' },
            anchor_style_guidelines: { type: 'string' },
            max_links_per_post: { type: 'number' }
          }
        },
          authority_positioning_summary: { type: 'string' }
        }
      }
    });

    // If LLM returned a string instead of an object, parse it
    if (typeof aiResult === 'string') {
      try {
        aiResult = JSON.parse(aiResult);
      } catch (parseErr) {
        const msg = 'AI returned unparseable string: ' + aiResult.substring(0, 200);
        console.error('[AuthorityPlanner]', msg);
        await logRun('failed', msg);
        return Response.json({ error: msg }, { status: 500 });
      }
    }

    if (!aiResult || !Array.isArray(aiResult.pillars) || aiResult.pillars.length === 0) {
      const msg = 'AI returned invalid or empty pillars. Response: ' + JSON.stringify(aiResult).substring(0, 300);
      console.error('[AuthorityPlanner]', msg);
      await logRun('failed', msg);
      return Response.json({ error: msg }, { status: 500 });
    }

    // Ensure pillars is a plain serializable array
    const pillars = aiResult.pillars.map(p => ({
      pillar_title: String(p.pillar_title || ''),
      cluster_topics: (p.cluster_topics || []).map(t => String(t))
    }));

    console.log('[AuthorityPlanner] Saving AuthorityMap with', pillars.length, 'pillars');

    let authorityMap;
    try {
      authorityMap = await base44.asServiceRole.entities.AuthorityMap.create({
        niche,
        location,
        pillars,
        internal_link_strategy: aiResult.internal_link_strategy || {},
        authority_positioning_summary: String(aiResult.authority_positioning_summary || ''),
        is_archived: false
      });
      console.log('[AuthorityPlanner] AuthorityMap created:', authorityMap.id);
    } catch (saveErr) {
      const msg = 'AuthorityMap save failed: ' + saveErr.message;
      console.error('[AuthorityPlanner]', msg);
      await logRun('failed', msg);
      // Fallback: write a failed ContentQueue record so failure is visible
      try {
        await base44.asServiceRole.entities.ContentQueue.create({
          publish_date: new Date().toISOString().split('T')[0],
          topic: 'AUTHORITY PLANNER FAILED',
          format: 'blog',
          status: 'failed',
          last_error: msg
        });
      } catch (_) {}
      return Response.json({ error: msg }, { status: 500 });
    }

    // Flatten first 7 cluster topics across pillars
    const flatTopics = [];
    for (const pillar of pillars) {
      for (const topic of pillar.cluster_topics) {
        flatTopics.push({ topic, pillar_title: pillar.pillar_title });
        if (flatTopics.length === 7) break;
      }
      if (flatTopics.length === 7) break;
    }

    // Compute dates in America/Chicago timezone, tomorrow through +7 days
    const getChicagoDateStr = (daysFromNow) => {
      const d = new Date();
      d.setDate(d.getDate() + daysFromNow);
      // Format as YYYY-MM-DD in America/Chicago
      return d.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }); // en-CA gives YYYY-MM-DD
    };

    const todayStr = getChicagoDateStr(0);

    console.log('[AuthorityPlanner] queue_create_start — topics to schedule:',
      flatTopics.map((t, i) => ({ date: getChicagoDateStr(i + 1), topic: t.topic, pillar: t.pillar_title }))
    );

    // Fetch existing planned blog items to deduplicate by publish_date
    let existingPlanned = [];
    try {
      existingPlanned = await base44.asServiceRole.entities.ContentQueue.filter({ format: 'blog', status: 'planned' });
    } catch (fetchErr) {
      console.warn('[AuthorityPlanner] Could not fetch existing planned items for dedup:', fetchErr.message);
    }
    const existingDates = new Set(existingPlanned.map(item => item.publish_date));
    console.log('[AuthorityPlanner] Existing planned blog dates:', [...existingDates]);

    const created = [];
    try {
      for (let i = 0; i < flatTopics.length; i++) {
        const dateStr = getChicagoDateStr(i + 1);

        if (existingDates.has(dateStr)) {
          console.log(`[AuthorityPlanner] skipped_existing — ${dateStr} already has a planned blog item`);
          continue;
        }

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
      console.log(`[AuthorityPlanner] queue_create_success — ${created.length} items created`);
    } catch (qErr) {
      const qMsg = 'ContentQueue creation failed: ' + qErr.message + ' | stack: ' + (qErr.stack || '');
      console.error('[AuthorityPlanner]', qMsg);
      try {
        await base44.asServiceRole.entities.ContentQueue.create({
          publish_date: todayStr,
          topic: 'Authority Planner queue creation failed',
          format: 'blog',
          status: 'failed',
          last_error: qMsg
        });
      } catch (_) {}
    }

    await logRun('success', `Created AuthorityMap (${pillars.length} pillars, ${created.length} queue items)`, {
      authority_map_id: authorityMap.id,
      pillars_count: pillars.length,
      topics_scheduled: created.length
    });

    return Response.json({
      success: true,
      authority_map_id: authorityMap.id,
      content_queue_ids: created,
      pillars_count: pillars.length,
      topics_scheduled: created.length
    });

  } catch (err) {
    const msg = 'Unexpected error: ' + err.message;
    console.error('[AuthorityPlanner]', msg, err.stack);
    await logRun('failed', msg);
    return Response.json({ error: msg }, { status: 500 });
  }
});