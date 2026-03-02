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

  let item;

  if (!candidates || candidates.length === 0) {
    console.log(`[DailyGenerator] No planned blog found for ${todayStr}. Falling back to earliest planned blog in queue.`);

    const fallbackCandidates = await base44.asServiceRole.entities.ContentQueue.filter(
      { status: 'planned', format: 'blog' },
      'publish_date',
      1
    );

    if (!fallbackCandidates || fallbackCandidates.length === 0) {
      console.log('[DailyGenerator] No planned blog items found in queue at all. Exiting gracefully.');
      return Response.json({ skipped: true, reason: 'No planned blog items found in queue.' });
    }

    item = fallbackCandidates[0];
    console.log(`[DailyGenerator] Fallback selected — id: ${item.id}, publish_date: ${item.publish_date}, topic: ${item.topic}`);
  } else {
    item = candidates[0];
  }

  console.log(`[DailyGenerator] Generating content for: ${item.topic} (${item.id})`);

  const prompt = `
CRITICAL WRITING RULES (Non-Negotiable — enforce before returning output):

1) The first paragraph MUST:
   - Start with a strong opinion, a tension statement, or a specific mistake business owners make.
   - Speak directly to Midwest small business owners using "you" and "your business".
   - Emphasize systems over tools — this is about building something that runs, not chasing trends.
   - NOT use generic corporate language of any kind.

2) The following phrases are STRICTLY FORBIDDEN — if any appear, rewrite that section before returning:
   - "In today's digital landscape"
   - "In today's fast-paced digital landscape"
   - "AI is revolutionizing"
   - "AI has emerged as a powerful tool"
   - "has become increasingly important"
   - Any sentence that defines "What is AI" or explains artificial intelligence at a basic level
   - Any textbook-style or academic explanation of AI, machine learning, or automation

3) Tone MUST sound like:
   - A strategic operator who has built systems, not a marketer selling ideas.
   - Direct and slightly opinionated — takes a point of view.
   - No academic tone. No fluff. No hedging.
   - The reader already knows what AI is. Treat them as a capable business owner, not a beginner.

4) If any output violates these rules, regenerate the offending section before returning the final result.

---

TONE LOCK — CONFIDENT STRATEGIST VOICE (Required):

The article must sound like it was written by the founder of a Midwest AI marketing firm explaining how things actually work — not a consultant summarizing research.

Voice Profile:
- Speaks from implementation experience, not theory.
- Calm, direct, and practical. No hype. No flash.
- Uses shorter, stronger sentences. Punchy when it counts.
- Drops occasional firm statements: "This is where most businesses get it wrong." or "Most agencies won't tell you this, but..."
- Makes clear recommendations — not neutral commentary that hedges both sides.
- Implies authority through specificity and experience, never bragging.

Do NOT:
- Over-explain concepts the reader already understands.
- Use motivational fluff ("You've got this!", "The future is bright!", etc.).
- Use corporate clichés ("synergy", "leverage", "unlock potential", "game-changer").
- Sound like a generic consultant blog or a content farm article.
- Write walls of text — vary sentence length, use white space, respect the reader's time.

Every paragraph should earn its place. If a sentence doesn't move the reader forward, cut it.

---

You are the content voice for ${business_name}, a digital marketing company that helps Midwest small businesses build AI-powered marketing systems — not just run one-off campaigns.

Business: ${business_name}
Website: ${site_url}
Service Areas: ${(service_areas || []).join(', ') || 'Midwest'}
Offers: ${(offers || []).join(', ') || ''}
Brand Voice: ${brand_voice || 'Confident, direct, no-nonsense. Strategic operator, not a marketer.'}
CTA: ${cta || 'Contact us today'}

Today's Content Assignment:
- Topic: ${item.topic}
- Pillar: ${item.pillar || ''}
- Target Keyword: ${item.keyword || item.topic}
- Publish Date: ${item.publish_date}
${authorityMap ? `- Internal Link Strategy: ${JSON.stringify(authorityMap.internal_link_strategy || '')}` : ''}
${authorityMap ? `- Authority Positioning: ${authorityMap.authority_positioning_summary || ''}` : ''}

WRITING RULES — follow these exactly:

TONE & VOICE:
- Write like a strategic operator, not a marketing consultant.
- Confident and direct. No hedging, no filler, no buzzwords.
- The reader already knows what AI is. Skip definitions entirely unless a concept is niche or technical.
- No corporate intros. Never open with phrases like "In today's fast-paced digital landscape", "AI has emerged as a powerful tool", or any variation of those patterns.
- Midwest small business owners are practical people. They want to know what works, what doesn't, and what to do next — not theory.

FIRST PARAGRAPH:
- Must open with a strong opinion, a specific mistake business owners make, or a tension they'll immediately recognize.
- Speak directly to the reader (use "you" and "your business").
- Establish the systems-first mindset early: this is about building something that runs, not chasing trends.
- Weave in DIY vs DFY naturally within the first 2-3 paragraphs — frame it as a real choice with tradeoffs, not a sales pitch.

META TITLE:
- Must include tension, a mistake angle, or a clear benefit.
- Must be commercially aligned with search intent.
- FORBIDDEN title patterns: "A Must for Your Business", "A Complete Guide", "Overview of", "Understanding...", "Introduction to...", "Everything You Need to Know".
- No soft neutral phrasing. If it could describe any article on any blog, rewrite it.
- ≤60 characters.

META DESCRIPTION:
- Must reinforce the hook from the title.
- Include a direct benefit or a reason to click.
- ≤155 characters.

BODY CONTENT:
- 1200–1600 words, markdown with H2 and H3 headings.
- Each section should move the reader forward — no padding, no restating the intro.
- Include 1 clear CTA near the end using this exact text: "${cta || 'Contact us today'}"
- Add a "Next Steps" section near the end with exactly 3 bullet points. Each bullet must be actionable and specific — not generic advice.

Return STRICT JSON only — no markdown wrapper, no explanation, no code blocks.

JSON schema (return exactly this structure):
{
  "meta_title": "string (<=60 chars, benefit or mistake angle, no vague phrasing)",
  "meta_description": "string (<=155 chars, reinforces title hook)",
  "blog_content": "string (1200-1600 words, markdown with H2/H3, strong opening, no generic intros)",
  "faq_schema": "string (3-5 Q&A pairs as clean JSON-LD or plain Q/A list)",
  "internal_link_suggestions": [
    { "anchor_text": "string", "target_slug_hint": "string" }
  ],
  "image_prompts": ["string", "string", "string"],
  "linkedin_post": "string (professional, direct tone, 150-200 words, relevant hashtags)",
  "facebook_post": "string (conversational but confident, 100-150 words)",
  "video_script_60s": "string (spoken word, ~150 words, strong hook + clear value + CTA)"
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