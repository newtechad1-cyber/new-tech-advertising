/**
 * completeOnboarding
 * 1. Sets OnboardingProfile.status = complete
 * 2. Upserts AiMemory keys (scope: global)
 * 3. Determines connected platforms from MetaConnection
 * 4. Creates AiTask for first content pack
 * 5. After task created, invokes createDraftsFromArtifact once the pack is ready
 *    (async — we trigger runAiStep directly so it runs in-band for the trial setup)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

async function upsertMemory(base44, accountId, key, value) {
  if (!value) return;
  const existing = await base44.asServiceRole.entities.AiMemory.filter({ account_id: accountId, scope: 'global', key });
  const payload = { account_id: accountId, scope: 'global', key, value: { data: value }, label: key };
  if (existing.length) {
    await base44.asServiceRole.entities.AiMemory.update(existing[0].id, { value: { data: value } });
  } else {
    await base44.asServiceRole.entities.AiMemory.create(payload);
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { profileId, accountId } = body;
  if (!profileId || !accountId) return Response.json({ error: 'profileId and accountId required' }, { status: 400 });

  // Load profile
  const profiles = await base44.asServiceRole.entities.OnboardingProfile.filter({ id: profileId });
  if (!profiles.length) return Response.json({ error: 'Profile not found' }, { status: 404 });
  const profile = profiles[0];

  // 1. Mark complete
  await base44.asServiceRole.entities.OnboardingProfile.update(profileId, { status: 'complete' });

  // 2. Upsert AiMemory — all keys from the spec
  const serviceArea = [profile.city, profile.state, profile.service_area].filter(Boolean).join(', ');
  await Promise.all([
    upsertMemory(base44, accountId, 'business_name',     profile.business_name),
    upsertMemory(base44, accountId, 'business_type',     profile.business_type),
    upsertMemory(base44, accountId, 'website_url',       profile.website_url),
    upsertMemory(base44, accountId, 'phone',             profile.phone),
    upsertMemory(base44, accountId, 'email',             profile.email),
    upsertMemory(base44, accountId, 'service_area',      serviceArea),
    upsertMemory(base44, accountId, 'primary_goal',      profile.primary_goal),
    upsertMemory(base44, accountId, 'target_audience',   profile.target_audience),
    upsertMemory(base44, accountId, 'brand_voice',       profile.brand_voice),
    upsertMemory(base44, accountId, 'brand_colors',      profile.brand_colors),
    upsertMemory(base44, accountId, 'logo_url',          profile.logo_url),
    upsertMemory(base44, accountId, 'posting_frequency', profile.posting_frequency),
  ]);

  // 3. Determine connected platforms
  const platforms = [];
  const metaConns = await base44.asServiceRole.entities.MetaConnection.filter({ account_id: accountId });
  const meta = metaConns?.[0];
  if (meta?.status === 'connected') {
    if (meta.facebook_page_id) platforms.push('facebook');
    if (meta.instagram_business_account_id) platforms.push('instagram');
  }
  // Default to facebook if nothing connected yet
  if (platforms.length === 0) platforms.push('facebook', 'instagram');

  // 4. Verify agent exists
  const agentKey = 'social_content_pack_agent';
  const agents = await base44.asServiceRole.entities.AiAgent.filter({ key: agentKey });
  if (!agents.length) {
    return Response.json({
      success: true,
      task_id: null,
      memory_saved: true,
      warning: `Agent '${agentKey}' not found — content pack not triggered.`,
    });
  }

  // 5. Create AiTask for first content pack
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

  // 6. Trigger runAiStep (non-blocking fire-and-forget via invoke)
  base44.asServiceRole.functions.invoke('runAiStep', { taskId: task.id }).catch(() => {});

  return Response.json({ success: true, task_id: task.id, memory_saved: true, platforms });
});