/**
 * runFirstContentPack
 * Fast Gratification Mode — called immediately after onboarding completes.
 *
 * Flow:
 * 1. Run social_monthly_content_pack_v1 workflow via runAiStep (waits for result)
 * 2. Create ContentDrafts from the content_pack artifact
 * 3. Immediately generate media for first 5 drafts with image_prompt
 * 4. Background-queue remaining drafts in batches of 10, respecting 50/day limit
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });
const DAILY_LIMIT = 50;
const BATCH_SIZE = 10;

async function getDailyMediaCount(base44, accountId) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = await base44.asServiceRole.entities.AiCostLedger.filter({
    account_id: accountId,
    agent_key: 'media_generation',
  });
  return entries.filter(e => e.created_date?.startsWith(today)).length;
}

async function generateMediaForDraft(base44, draft) {
  if (!draft.image_prompt) return { skipped: true };

  await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
    media_status: 'generating',
    media_type: 'ai_image',
  });

  try {
    // Inject brand colors from memory
    let brandContext = '';
    const memories = await base44.asServiceRole.entities.AiMemory.filter({ account_id: draft.account_id, scope: 'global' });
    const colorMem = memories.find(m => m.key === 'brand_colors');
    if (colorMem?.value?.data) brandContext = ` Use brand colors: ${colorMem.value.data}.`;

    const prompt = draft.image_prompt + brandContext;

    const imgRes = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const mediaUrl = imgRes.data[0].url;

    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_type: 'ai_image',
      media_status: 'ready',
      media_url: mediaUrl,
      media_prompt: prompt,
      media_generated_at: new Date().toISOString(),
      media_generation_error: null,
    });

    await base44.asServiceRole.entities.AiCostLedger.create({
      account_id: draft.account_id,
      task_id: draft.id,
      agent_key: 'media_generation',
      model: 'dall-e-3',
      input_tokens: 0,
      output_tokens: 0,
      cost_cents: 4,
    });

    return { success: true, media_url: mediaUrl };
  } catch (err) {
    await base44.asServiceRole.entities.ContentDraft.update(draft.id, {
      media_status: 'failed',
      media_generation_error: err.message,
    });
    return { error: err.message };
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { accountId, profileId } = await req.json();
  if (!accountId) return Response.json({ error: 'accountId required' }, { status: 400 });

  // Load OnboardingProfile for inputs
  let profile = null;
  if (profileId) {
    const profs = await base44.asServiceRole.entities.OnboardingProfile.filter({ id: profileId });
    profile = profs[0] || null;
  }
  if (!profile) {
    const profs = await base44.asServiceRole.entities.OnboardingProfile.filter({ account_id: accountId });
    profile = profs[0] || null;
  }
  if (!profile) return Response.json({ error: 'OnboardingProfile not found' }, { status: 404 });

  // Determine platforms
  const platforms = [];
  const metaConns = await base44.asServiceRole.entities.MetaConnection.filter({ account_id: accountId });
  const meta = metaConns?.[0];
  if (meta?.status === 'connected') {
    if (meta.facebook_page_id) platforms.push('facebook');
    if (meta.instagram_business_account_id) platforms.push('instagram');
  }
  if (platforms.length === 0) platforms.push('facebook', 'instagram');

  // Verify agent
  const agentKey = 'social_content_pack_agent';
  const agents = await base44.asServiceRole.entities.AiAgent.filter({ key: agentKey });
  if (!agents.length) {
    return Response.json({ error: `Agent '${agentKey}' not found. Configure it in AI Ops.` }, { status: 404 });
  }

  // 1. Create + run AiTask inline (this is synchronous — runAiStep does the OpenAI call)
  const task = await base44.asServiceRole.entities.AiTask.create({
    account_id: accountId,
    workflow_key: 'social_monthly_content_pack_v1',
    step_key: 'generate_content_pack',
    agent_key: agentKey,
    label: 'First Content Pack',
    status: 'pending',
    step_status: 'idle',
    inputs: {
      businessName:  profile.business_name,
      businessType:  profile.business_type,
      tone:          profile.brand_voice,
      platforms,
      pillarFocus:   'mixed',
      goal:          profile.primary_goal,
      quantity:      parseInt(profile.posting_frequency || '10'),
      mediaMix:      'include_image_prompts',
      artifact_type: 'content_pack',
    },
  });

  // Run the AI step (synchronous within this request)
  const stepRes = await base44.asServiceRole.functions.invoke('runAiStep', { task_id: task.id });
  if (!stepRes?.artifact_id) {
    return Response.json({ error: 'Content pack generation failed', task_id: task.id }, { status: 500 });
  }

  const artifactId = stepRes.artifact_id;

  // 2. Create ContentDrafts from artifact
  const artifact = await base44.asServiceRole.entities.AiArtifact.filter({ id: artifactId });
  const artData = artifact[0];
  if (!artData) return Response.json({ error: 'Artifact not found after generation' }, { status: 500 });

  const posts = artData.content?.posts || [];
  const draftIds = [];

  for (const post of posts) {
    const draft = await base44.asServiceRole.entities.ContentDraft.create({
      account_id: accountId,
      source_artifact_id: artifactId,
      platform: post.platform || 'facebook',
      pillar: post.pillar || null,
      goal: post.goal || null,
      hook: post.hook || '',
      caption: post.caption || '',
      hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      cta: post.cta || '',
      image_prompt: post.image_prompt || '',
      video_script: post.video_script || null,
      status: 'draft',
    });
    draftIds.push(draft.id);
  }

  if (!draftIds.length) {
    return Response.json({ success: true, task_id: task.id, artifact_id: artifactId, drafts_created: 0 });
  }

  // Load drafts sorted by created_at asc (creation order)
  const allDrafts = await base44.asServiceRole.entities.ContentDraft.filter(
    { account_id: accountId, source_artifact_id: artifactId },
    'created_date',
    500
  );

  const draftsWithPrompt = allDrafts.filter(d => d.image_prompt);
  const first5 = draftsWithPrompt.slice(0, 5);
  const remaining = draftsWithPrompt.slice(5);

  // 3. Generate media for first 5 immediately (in parallel)
  const first5Results = await Promise.allSettled(
    first5.map(d => generateMediaForDraft(base44, d))
  );

  // 4. Background: batch remaining in groups of 10, respect 50/day
  let limitHit = false;
  const batches = [];
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    batches.push(remaining.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    const dailyCount = await getDailyMediaCount(base44, accountId);
    if (dailyCount >= DAILY_LIMIT) {
      limitHit = true;
      break;
    }
    const available = DAILY_LIMIT - dailyCount;
    const batchToRun = batch.slice(0, available);
    await Promise.allSettled(batchToRun.map(d => generateMediaForDraft(base44, d)));
  }

  return Response.json({
    success: true,
    task_id: task.id,
    artifact_id: artifactId,
    drafts_created: draftIds.length,
    media_first5: first5.length,
    media_remaining_queued: remaining.length,
    daily_limit_hit: limitHit,
  });
});