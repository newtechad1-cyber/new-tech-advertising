/**
 * Automation: OnboardingProfile → Completed
 * Trigger:    EntityAutomation on OnboardingProfile (update)
 * Action:     content_agent.build_authority_plan
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const profile    = payload?.data;
  const oldProfile = payload?.old_data;

  // Only fire when status transitions TO "completed"
  if (!profile || profile.status !== 'completed') {
    return Response.json({ skipped: true, reason: 'Not a completion transition' });
  }
  if (oldProfile?.status === 'completed') {
    return Response.json({ skipped: true, reason: 'Already completed' });
  }

  const companyId = profile.company_id;

  // Pull BrandProfile for context
  const brandProfiles = companyId
    ? await base44.asServiceRole.entities.BrandProfile.filter({ company_id: companyId })
    : [];
  const brand = brandProfiles[0] || {};

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'content_agent',
    step_key: 'build_authority_plan',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      onboarding_profile_id: profile.id,
      company_id: companyId,
      cms_platform: profile.cms_platform,
      hosting_provider: profile.hosting_provider,
      priority_pages: profile.priority_pages,
      brand_voice: brand.brand_voice,
      target_audience: brand.target_audience,
      content_pillars: brand.content_pillars,
      unique_selling_propositions: brand.unique_selling_propositions,
      artifact_type: 'brand_profile',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'onboarding_setup',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, onboarding_profile_id: profile.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'onboarding_completed',
    summary: `Onboarding completed → content_agent.build_authority_plan triggered`,
    entity_type: 'OnboardingProfile',
    entity_id: profile.id,
  });

  return Response.json({ success: true, task_id: task.id });
});