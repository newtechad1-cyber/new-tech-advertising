import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic_id } = await req.json();
    if (!topic_id) return Response.json({ error: 'topic_id required' }, { status: 400 });

    // Fetch the topic
    const topics = await base44.asServiceRole.entities.ContentTopics.filter({ id: topic_id });
    const topic = topics[0];
    if (!topic) return Response.json({ error: 'Topic not found' }, { status: 404 });

    // Mark as generating
    await base44.asServiceRole.entities.ContentTopics.update(topic_id, { status: 'generating' });

    const geo = [topic.city, topic.industry].filter(Boolean).join(' ');
    const keyword = topic.keyword || topic.title;
    const results = [];

    // Generate based on content_type
    const TYPES = topic.content_type === 'video_script'
      ? ['video_script']
      : topic.content_type === 'social_series'
      ? ['social_series']
      : topic.content_type === 'email_sequence'
      ? ['email_sequence']
      : ['blog', 'landing_page', 'video_script', 'social_series'];

    for (const type of TYPES) {
      let prompt = '';

      if (type === 'blog') {
        prompt = `Write a high-quality, SEO-optimized blog article for a digital marketing agency.
Topic: "${topic.title}"
Keyword: "${keyword}"
Industry: ${topic.industry || 'small business'}
Location: ${topic.city || 'United States'}

Write a complete 800-1000 word blog article with:
- Compelling H1 title
- Introduction that hooks the reader
- 3-4 H2 sections with practical content
- Conclusion with a CTA to get a free marketing audit

Format as clean markdown.`;
      } else if (type === 'landing_page') {
        prompt = `Write conversion-optimized landing page copy for a digital marketing agency.
Topic: "${topic.title}"
Keyword: "${keyword}"
Target Audience: ${topic.industry || 'small business owners'} in ${topic.city || 'the US'}

Write full landing page copy including:
- Hero headline + subheadline
- Pain points section (3 bullets)
- Solution section
- Features/benefits (4 items)
- Social proof placeholder
- Strong CTA section

Format as structured markdown with section headers.`;
      } else if (type === 'video_script') {
        prompt = `Write a compelling 60-90 second video script for a digital marketing agency.
Topic: "${topic.title}"
Target: ${topic.industry || 'small business owners'} in ${topic.city || 'the US'}

Structure:
HOOK: (10 seconds) - attention-grabbing opening
PROBLEM: (20 seconds) - the pain they feel
SOLUTION: (30 seconds) - how we solve it
CTA: (10 seconds) - clear next step

Write natural, conversational language. Output as JSON with keys: hook, problem, solution, call_to_action, full_script`;
      } else if (type === 'social_series') {
        prompt = `Write a 5-post social media series for LinkedIn and Facebook.
Topic: "${topic.title}"
Industry: ${topic.industry || 'small business'}
Keyword: "${keyword}"

Write 5 short posts (100-150 words each) labeled Post 1-5.
Each post should stand alone but build on the theme.
Include relevant hashtags on each post.
Format as markdown with "## Post N" headers.`;
      } else if (type === 'email_sequence') {
        prompt = `Write a 3-email nurture sequence for a digital marketing agency prospect.
Topic: "${topic.title}"
Industry: ${topic.industry || 'small business'}

Email 1: Welcome / value intro (day 0)
Email 2: Educational / case study (day 3)
Email 3: Offer / CTA to book call (day 7)

Each email: subject line, preview text, body (200-250 words).
Format as markdown with "## Email N" headers.`;
      }

      let contentText = '';
      let videoScriptData = null;

      if (type === 'video_script') {
        const raw = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              hook: { type: 'string' },
              problem: { type: 'string' },
              solution: { type: 'string' },
              call_to_action: { type: 'string' },
              full_script: { type: 'string' },
            }
          }
        });
        videoScriptData = raw;
        contentText = raw.full_script || '';
      } else {
        contentText = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
      }

      // Save to GeneratedContent
      const gc = await base44.asServiceRole.entities.GeneratedContent.create({
        title: `${topic.title} — ${type.replace('_', ' ')}`,
        content_type: type,
        topic_id,
        industry: topic.industry || '',
        target_city: topic.city || '',
        keyword: keyword,
        content_text: contentText,
        word_count: contentText.split(/\s+/).length,
        status: 'draft',
      });

      results.push({ type, generated_content_id: gc.id });

      // If video script, also save to VideoScripts
      if (type === 'video_script' && videoScriptData) {
        await base44.asServiceRole.entities.VideoScripts.create({
          title: `${topic.title} — Video Script`,
          topic_id,
          generated_content_id: gc.id,
          hook: videoScriptData.hook || '',
          problem: videoScriptData.problem || '',
          solution: videoScriptData.solution || '',
          call_to_action: videoScriptData.call_to_action || '',
          script_text: videoScriptData.full_script || contentText,
          video_type: 'explainer',
          status: 'draft',
          estimated_duration_sec: 75,
        });
      }
    }

    // Mark topic complete
    await base44.asServiceRole.entities.ContentTopics.update(topic_id, { status: 'complete' });

    return Response.json({ success: true, topic_id, generated: results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});