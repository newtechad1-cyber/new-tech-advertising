/**
 * Automation: OnboardingProfile → Completed
 * Trigger:    EntityAutomation on OnboardingProfile (update)
 * Action:     buildAuthorityPlan — generates 90-day strategy
 *             → AuthorityPlan → ContentCampaign → ContentItem (x60) → ScheduledPost (x60)
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

  // --- Pull full context: BrandProfile + Company ---
  const [brandProfiles, companies] = await Promise.all([
    companyId
      ? base44.asServiceRole.entities.BrandProfile.filter({ company_id: companyId })
      : Promise.resolve([]),
    companyId
      ? base44.asServiceRole.entities.Company.filter({ id: companyId })
      : Promise.resolve([]),
  ]);

  const brand   = brandProfiles[0] || {};
  const company = companies[0] || {};

  // --- Queue AgentJob + invoke buildAuthorityPlan ---
  const job = await base44.asServiceRole.entities.AgentJob.create({
    company_id: companyId || null,
    job_type: 'onboarding_setup',
    trigger: 'entity_event',
    status: 'queued',
    input_params: JSON.stringify({
      onboarding_profile_id: profile.id,
      company_id: companyId,
    }),
    started_at: new Date().toISOString(),
  });

  // Fire buildAuthorityPlan asynchronously (don't await — let it run in background)
  base44.asServiceRole.functions.invoke('buildAuthorityPlan', {
    company_id:                  companyId,
    onboarding_profile_id:       profile.id,
    business_name:               company.business_name || '',
    industry:                    company.industry || '',
    brand_voice:                 brand.brand_voice || '',
    target_audience:             brand.target_audience || '',
    content_pillars:             brand.content_pillars || [],
    unique_selling_propositions: brand.unique_selling_propositions || '',
    active_channels:             brand.approved_hashtags
                                   ? ['facebook', 'instagram']
                                   : ['facebook', 'instagram'],
    agent_job_id:                job.id,
  }).catch((err) => {
    console.error('[onOnboardingSubmitted] buildAuthorityPlan invoke failed:', err.message);
  });

  // Log the trigger event
  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'onboarding_completed',
    summary: `Onboarding completed → 90-day Authority Plan generation queued (AgentJob: ${job.id})`,
    entity_type: 'OnboardingProfile',
    entity_id: profile.id,
    metadata: JSON.stringify({ agent_job_id: job.id }),
  });

  return Response.json({ success: true, agent_job_id: job.id });
});