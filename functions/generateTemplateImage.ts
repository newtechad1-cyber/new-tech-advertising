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

  const drafts = await base44.asServiceRole.entities.ContentDraft.filter({ id: draftId });
  if (!drafts.length) return Response.json({ error: 'Draft not found' }, { status: 404 });
  const draft = drafts[0];

  // Daily limit check
  const today = new Date().toISOString().slice(0, 10);
  const ledgerEntries = await base44.asServiceRole.entities.AiCostLedger.filter({
    account_id: draft.account_id,
    agent_key: 'media_generation',
  });
  const todayEntries = ledgerEntries.filter(e => e.created_date?.startsWith(today));
  if (todayEntries.length >= DAILY_LIMIT) {
    return Response.json({ error: 'Daily media generation limit reached.' }, { status: 429 });
  }

  // Load brand memory
  let brandColors = '#6366f1, #8b5cf6';
  let businessName = 'Our Business';
  let logoUrl = null;

  try {
    const memories = await base44.asServiceRole.entities.AiMemory.filter({ account_id: draft.account_id });
    const colorMem = memories.find(m => m.key === 'brand_colors');
    const nameMem = memories.find(m => m.key === 'business_name');
    const logoMem = memories.find(m => m.key === 'logo_url');
    if (colorMem?.value?.text) brandColors = colorMem.value.text;
    else if (colorMem?.value?.colors) brandColors = colorMem.value.colors;
    if (nameMem?.value?.text) businessName = nameMem.value.text;
    if (logoMem?.value?.url) logoUrl = logoMem.value.url;
  } catch (_) { /* best-effort */ }

  // Also check TrialAccount for business name
  if (draft.account_id) {
    try {
      const accounts = await base44.asServiceRole.entities.TrialAccount.filter({ id: draft.account_id });
      if (accounts[0]?.name) businessName = accounts[0].name;
    } catch (_) { /* best-effort */ }
  }

  // Mark as generating
  await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
    media_status: 'generating',
    media_type: 'template_image',
  });

  // Build structured brand graphic prompt
  const shortCta = draft.cta ? draft.cta.slice(0, 60) : 'Contact Us Today';
  const hook = draft.hook ? draft.hook.slice(0, 80) : '';

  const prompt = `Create a professional social media branded graphic template design.
Layout: clean rectangular social media post (1:1 ratio).
Top section: large bold headline text: "${hook}"
Middle section: subtle gradient background using colors inspired by: ${brandColors}
Bottom section: CTA bar with text: "${shortCta}"
Brand name watermark: "${businessName}"
Style: modern, minimal, corporate, no photography, vector-style flat design.
Color palette: derived from ${brandColors}.
No faces, no people, no logos with text inside the image — only shapes and the provided text elements.
High contrast, easy to read.`;

  try {
    const imgResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const mediaUrl = imgResponse.data[0].url;

    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_type: 'template_image',
      media_status: 'ready',
      media_url: mediaUrl,
      media_prompt: prompt,
      media_generated_at: new Date().toISOString(),
      media_generation_error: null,
    });

    // Log cost
    await base44.asServiceRole.entities.AiCostLedger.create({
      account_id: draft.account_id,
      task_id: draft.id,
      agent_key: 'media_generation',
      model: 'dall-e-3',
      input_tokens: 0,
      output_tokens: 0,
      cost_cents: 4,
    });

    return Response.json({ success: true, media_url: mediaUrl, media_type: 'template_image' });
  } catch (err) {
    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_status: 'failed',
      media_generation_error: err.message,
    });
    return Response.json({ error: err.message }, { status: 500 });
  }
});