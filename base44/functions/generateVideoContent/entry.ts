import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { assetId, title, topic, script, hook, cta, targetAudience, videoType } = await req.json();
    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const prompt = `You are Rick Hesse's marketing assistant at New Tech Advertising, a local digital marketing agency in Mason City, Iowa. 

Rick created a short-form video with the following details:

Title: ${title}
Topic: ${topic || title}
Type: ${videoType || 'Outreach'}
Target Audience: ${targetAudience || 'local small business owners'}
Hook: ${hook || ''}
Script: ${script || ''}
CTA: ${cta || ''}

Generate supporting content for this video in this EXACT JSON format:

{
  "facebook_post": "A conversational, helpful Facebook post that introduces this video. 3-4 short paragraphs. End with a question or soft CTA. Local business owner friendly. No hashtag spam — max 3 hashtags.",
  "linkedin_post": "A professional but warm LinkedIn post about this video topic. Slightly more formal than Facebook but still personable. 3-4 paragraphs. 1-2 relevant hashtags.",
  "short_caption": "A punchy 1-2 sentence caption for Instagram Reels or YouTube Shorts. Under 150 characters. Hook first.",
  "outreach_message": "A short, friendly cold outreach message Rick can send to a prospect via text or DM. 2-3 sentences. Reference the video topic naturally. Not salesy. Sounds like a real person.",
  "followup_message": "A follow-up message to send 2-3 days after the outreach. Acknowledges no response, stays friendly. 2-3 sentences.",
  "email_version": "A short email (subject line + body) sharing this video topic. Subject line first on its own line labeled 'Subject:'. Body is 3-4 short paragraphs. Conversational, local business friendly. Signed by Rick Hesse, New Tech Advertising, 641-420-8816."
}

Tone guidelines:
- Helpful and direct, not corporate
- Sounds like a real local marketing advisor
- Focus on leads, calls, trust, and visibility
- No buzzword overload
- No fake urgency or pushy sales language`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          facebook_post: { type: 'string' },
          linkedin_post: { type: 'string' },
          short_caption: { type: 'string' },
          outreach_message: { type: 'string' },
          followup_message: { type: 'string' },
          email_version: { type: 'string' },
        }
      },
      model: 'gpt_5_4',
    });

    // Save back to the asset if we have an ID
    if (assetId) {
      await base44.asServiceRole.entities.VideoAsset.update(assetId, {
        ...result,
        content_generated: true,
        status: 'Ready',
      });
    }

    return Response.json({ success: true, content: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});