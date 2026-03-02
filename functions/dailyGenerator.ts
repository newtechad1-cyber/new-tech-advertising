import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Load settings
  const settingsList = await base44.asServiceRole.entities.Settings.list();
  if (!settingsList || settingsList.length === 0) {
    console.error('[DailyGenerator] No settings record found. Aborting.');
    return Response.json({ error: 'No settings record found.' }, { status: 400 });
  }
  const settings = settingsList[0];
  const { business_name, site_url, service_areas, cta, brand_voice, offers } = settings;

  // Load most recent AuthorityMap (optional)
  let authorityMap = null;
  const maps = await base44.asServiceRole.entities.AuthorityMap.list('-created_date', 1);
  if (maps && maps.length > 0) authorityMap = maps[0];

  // Get today's date in America/Chicago
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }); // YYYY-MM-DD

  // Find ONE planned blog ContentQueue item for today
  const candidates = await base44.asServiceRole.entities.ContentQueue.filter({
    status: 'planned',
    format: 'blog',
    publish_date: todayStr
  });

  if (!candidates || candidates.length === 0) {
    console.log(`[DailyGenerator] No planned blog found for ${todayStr}. Exiting gracefully.`);
    return Response.json({ skipped: true, reason: 'No planned blog item for today.' });
  }

  const item = candidates[0];
  console.log(`[DailyGenerator] Generating content for: ${item.topic} (${item.id})`);

  const prompt = `
You are a senior content strategist and SEO copywriter for a digital marketing company serving Midwest small businesses.

Business: ${business_name}
Website: ${site_url}
Service Areas: ${(service_areas || []).join(', ') || 'Midwest'}
Offers: ${(offers || []).join(', ') || ''}
Brand Voice: ${brand_voice || 'Friendly, practical, no-nonsense'}
CTA: ${cta || 'Contact us today'}

Today's Content Assignment:
- Topic: ${item.topic}
- Pillar: ${item.pillar || ''}
- Target Keyword: ${item.keyword || item.topic}
- Publish Date: ${item.publish_date}
${authorityMap ? `- Internal Link Strategy: ${authorityMap.internal_link_strategy || ''}` : ''}
${authorityMap ? `- Authority Positioning: ${authorityMap.authority_positioning_summary || ''}` : ''}

Write a complete blog post and all supporting content. Return STRICT JSON only — no markdown wrapper, no explanation, no code blocks.

Content rules:
- Blog must be 1200–1600 words, written in markdown with H2 and H3 headings.
- Make it practical for Midwest small business owners.
- Match the brand voice exactly.
- No fluff. No buzzword stuffing.
- Include 1 clear CTA near the end using this exact text: "${cta || 'Contact us today'}"
- Mention DIY vs DFY options naturally (not salesy).
- Add a short "Next Steps" section near the end with exactly 3 bullet points.
- meta_title must be ≤60 characters.
- meta_description must be ≤155 characters.

JSON schema (return exactly this structure):
{
  "meta_title": "string (<=60 chars)",
  "meta_description": "string (<=155 chars)",
  "blog_content": "string (1200-1600 words, markdown with H2/H3)",
  "faq_schema": "string (3-5 Q&A pairs as clean JSON-LD or plain Q/A list)",
  "internal_link_suggestions": [
    { "anchor_text": "string", "target_slug_hint": "string" }
  ],
  "image_prompts": ["string", "string", "string"],
  "linkedin_post": "string (professional tone, 150-200 words, include relevant hashtags)",
  "facebook_post": "string (conversational tone, 100-150 words)",
  "video_script_60s": "string (spoken word script, ~150 words, hook + value + CTA)"
}
`;

  let aiResult;
  try {
    aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          meta_title: { type: 'string' },
          meta_description: { type: 'string' },
          blog_content: { type: 'string' },
          faq_schema: { type: 'string' },
          internal_link_suggestions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                anchor_text: { type: 'string' },
                target_slug_hint: { type: 'string' }
              }
            }
          },
          image_prompts: { type: 'array', items: { type: 'string' } },
          linkedin_post: { type: 'string' },
          facebook_post: { type: 'string' },
          video_script_60s: { type: 'string' }
        }
      }
    });
  } catch (err) {
    console.error('[DailyGenerator] OpenAI call failed:', err.message);
    await base44.asServiceRole.entities.ContentQueue.update(item.id, {
      status: 'failed',
      last_error: err.message
    });
    return Response.json({ error: err.message, item_id: item.id }, { status: 500 });
  }

  if (!aiResult || !aiResult.blog_content) {
    const msg = 'AI returned empty or invalid response.';
    console.error('[DailyGenerator]', msg);
    await base44.asServiceRole.entities.ContentQueue.update(item.id, {
      status: 'failed',
      last_error: msg
    });
    return Response.json({ error: msg, item_id: item.id }, { status: 500 });
  }

  const { blog_content, ...metaFields } = aiResult;

  await base44.asServiceRole.entities.ContentQueue.update(item.id, {
    content: blog_content,
    meta: metaFields,
    status: 'generated'
  });

  console.log(`[DailyGenerator] Done. Item ${item.id} updated to generated.`);
  return Response.json({ success: true, item_id: item.id, topic: item.topic });
});