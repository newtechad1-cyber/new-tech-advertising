/**
 * Automation: MarketingPlan → status set to "active"
 * Trigger:    EntityAutomation on MarketingPlan (update)
 * Action:     content_agent.generate_posts (one task per active channel)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const plan    = payload?.data;
  const oldPlan = payload?.old_data;

  if (!plan || plan.status !== 'active') {
    return Response.json({ skipped: true, reason: 'Not an activation transition' });
  }
  if (oldPlan?.status === 'active') {
    return Response.json({ skipped: true, reason: 'Already active' });
  }

  const companyId = plan.company_id;

  // Pull BrandProfile + BrandDNA for context
  const [brandProfiles, companies] = await Promise.all([
    companyId ? base44.asServiceRole.entities.BrandProfile.filter({ company_id: companyId }) : Promise.resolve([]),
    companyId ? base44.asServiceRole.entities.Company.filter({ id: companyId }) : Promise.resolve([]),
  ]);
  const brand   = brandProfiles[0] || {};
  const company = companies[0] || {};

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'content_agent',
    step_key: 'generate_posts',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      marketing_plan_id: plan.id,
      company_id: companyId,
      business_name: company.business_name,
      active_channels: plan.active_channels,
      posting_frequency: plan.posting_frequency,
      content_mix: plan.content_mix,
      monthly_video_count: plan.monthly_video_count,
      monthly_image_count: plan.monthly_image_count,
      monthly_text_count: plan.monthly_text_count,
      campaign_themes: plan.campaign_themes,
      brand_voice: brand.brand_voice,
      target_audience: brand.target_audience,
      content_pillars: brand.content_pillars,
      approved_hashtags: brand.approved_hashtags,
      artifact_type: 'content_pack',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'content_generation',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, marketing_plan_id: plan.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'content_approved',
    summary: `MarketingPlan "${plan.plan_name}" activated → content_agent.generate_posts triggered`,
    entity_type: 'MarketingPlan',
    entity_id: plan.id,
  });

  return Response.json({ success: true, task_id: task.id });
});