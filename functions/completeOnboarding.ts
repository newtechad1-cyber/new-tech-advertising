/**
 * completeOnboarding
 * Called when onboarding form is submitted as complete.
 * 1. Saves OnboardingProfile with status=complete
 * 2. Upserts AiMemory keys (scope: global)
 * 3. Creates an AiTask and triggers the first content pack workflow
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const MEMORY_KEYS = [
  'brand_voice',
  'target_audience',
  'service_area',
  'brand_colors',
  'website_url',
  'phone',
  'business_name',
  'primary_goal',
];

async function upsertMemory(base44, accountId, key, value) {
  const existing = await base44.asServiceRole.entities.AiMemory.filter({
    account_id: accountId,
    scope: 'global',
    key,
  });
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

  // 2. Save AiMemory
  const memoryMap = {
    brand_voice: profile.brand_voice,
    target_audience: profile.target_audience,
    service_area: `${profile.city}, ${profile.state} — ${profile.service_area || ''}`.trim(),
    brand_colors: profile.brand_colors,
    website_url: profile.website_url,
    phone: profile.phone,
    business_name: profile.business_name,
    primary_goal: profile.primary_goal,
  };

  await Promise.all(
    MEMORY_KEYS.map(k => memoryMap[k] ? upsertMemory(base44, accountId, k, memoryMap[k]) : Promise.resolve())
  );

  // 3. Trigger first content pack — find or create the workflow agent key
  const agentKey = 'social_content_pack_agent';
  const agents = await base44.asServiceRole.entities.AiAgent.filter({ key: agentKey });
  if (!agents.length) {
    // No agent configured yet — still return success
    return Response.json({ success: true, task_id: null, memory_saved: true, warning: `Agent '${agentKey}' not found; content pack not triggered.` });
  }

  const task = await base44.asServiceRole.entities.AiTask.create({
    account_id: accountId,
    workflow_key: 'social_monthly_content_pack_v1',
    step_key: 'generate_content_pack',
    agent_key: agentKey,
    label: 'First Content Pack',
    status: 'pending',
    step_status: 'idle',
    inputs: {
      businessName: profile.business_name,
      businessType: profile.business_type,
      tone: profile.brand_voice,
      platforms: ['facebook', 'instagram'],
      pillarFocus: 'mixed',
      goal: profile.primary_goal,
      quantity: parseInt(profile.posting_frequency || '10'),
      artifact_type: 'content_pack',
    },
  });

  return Response.json({ success: true, task_id: task.id, memory_saved: true });
});