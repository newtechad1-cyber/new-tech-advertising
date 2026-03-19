import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

const DAILY_LIMIT = 50;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });

  const { draftId } = await req.json();
  if (!draftId) return Response.json({ error: 'draftId required' }, { status: 400 });

  // Load draft
  const drafts = await base44.asServiceRole.entities.ContentDraft.filter({ id: draftId });
  if (!drafts.length) return Response.json({ error: 'Draft not found' }, { status: 404 });
  const draft = drafts[0];

  // Daily limit check via AiCostLedger (count media gen entries today)
  const today = new Date().toISOString().slice(0, 10);
  const ledgerEntries = await base44.asServiceRole.entities.AiCostLedger.filter({
    account_id: draft.account_id,
    agent_key: 'media_generation',
  });
  const todayEntries = ledgerEntries.filter(e => e.created_date?.startsWith(today));
  if (todayEntries.length >= DAILY_LIMIT) {
    return Response.json({ error: 'Daily media generation limit reached.' }, { status: 429 });
  }

  // Mark as generating
  await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
    media_status: 'generating',
    media_type: draft.video_script ? 'video' : 'ai_image',
  });

  // Build prompt — inject brand memory if available
  let brandContext = '';
  try {
    const memories = await base44.asServiceRole.entities.AiMemory.filter({
      account_id: draft.account_id,
      scope: 'global',
    });
    const colorMem = memories.find(m => m.key === 'brand_colors');
    const styleMem = memories.find(m => m.key === 'brand_style');
    if (colorMem?.value?.text || colorMem?.value?.colors) {
      const colors = colorMem.value.text || colorMem.value.colors;
      brandContext += ` Use brand colors: ${colors}.`;
    }
    if (styleMem?.value?.text) {
      brandContext += ` Style: ${styleMem.value.text}.`;
    }
  } catch (_) { /* memory lookup is best-effort */ }

  const pillarDescriptions = {
    social_media: 'social media marketing for small businesses',
    website_development: 'professional website design and local SEO',
    ada_compliance: 'website accessibility and ADA compliance',
    local_streaming_tv_ads: 'local streaming TV advertising',
  };

  const finalPrompt = draft.image_prompt ||
    `Social media promotional image for a ${pillarDescriptions[draft.pillar] || draft.pillar || 'local business'}. Modern, clean, engaging, professional.${brandContext}`;

  try {
    const imgResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const mediaUrl = imgResponse.data[0].url;

    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_type: 'ai_image',
      media_status: 'ready',
      media_url: mediaUrl,
      media_prompt: finalPrompt,
      media_generated_at: new Date().toISOString(),
      media_generation_error: null,
    });

    // Log cost (estimated ~$0.04 per DALL-E 3 standard image)
    await base44.asServiceRole.entities.AiCostLedger.create({
      account_id: draft.account_id,
      task_id: draft.id,
      agent_key: 'media_generation',
      model: 'dall-e-3',
      input_tokens: 0,
      output_tokens: 0,
      cost_cents: 4,
    });

    return Response.json({ success: true, media_url: mediaUrl, media_type: 'ai_image' });
  } catch (err) {
    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_status: 'failed',
      media_generation_error: err.message,
    });
    return Response.json({ error: err.message }, { status: 500 });
  }
});