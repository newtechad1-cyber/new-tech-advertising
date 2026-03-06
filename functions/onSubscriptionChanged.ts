/**
 * Automation: Subscription → plan_type or status changed
 * Trigger:    EntityAutomation on Subscription (update)
 * Action:     Activate DFY fulfillment agents when plan_type is dfy_managed or project_retainer
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const DFY_PLAN_TYPES = ['dfy_managed', 'project_retainer'];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const sub    = payload?.data;
  const oldSub = payload?.old_data;

  if (!sub) return Response.json({ skipped: true, reason: 'No subscription data' });

  const companyId = sub.company_id;

  const isDfy    = DFY_PLAN_TYPES.includes(sub.plan_type);
  const wasActive = oldSub?.status === 'active';
  const isNowActive = sub.status === 'active';
  const planChanged = oldSub?.plan_type !== sub.plan_type;
  const justActivated = !wasActive && isNowActive;

  // Only proceed if it's a DFY plan that just became active OR changed to DFY type
  if (!isDfy || (!justActivated && !planChanged)) {
    return Response.json({ skipped: true, reason: 'Not a DFY activation event' });
  }

  // Fetch company + onboarding profile
  const [companies, onboardingProfiles] = await Promise.all([
    companyId ? base44.asServiceRole.entities.Company.filter({ id: companyId }) : Promise.resolve([]),
    companyId ? base44.asServiceRole.entities.OnboardingProfile.filter({ company_id: companyId }) : Promise.resolve([]),
  ]);
  const company   = companies[0] || {};
  const onboarding = onboardingProfiles[0] || {};

  // Determine which DFY agents to activate
  const jobsToQueue = [
    { job_type: 'onboarding_setup',    step_key: 'activate_dfy_account',    agent_key: 'account_agent' },
    { job_type: 'content_generation',  step_key: 'build_content_strategy',  agent_key: 'content_agent' },
    { job_type: 'email_sequence',      step_key: 'send_welcome_sequence',   agent_key: 'email_agent' },
  ];

  const taskIds = [];
  for (const job of jobsToQueue) {
    const task = await base44.asServiceRole.entities.AiTask.create({
      agent_key: job.agent_key,
      step_key: job.step_key,
      status: 'pending',
      step_status: 'pending',
      inputs: {
        company_id: companyId,
        subscription_id: sub.id,
        plan_type: sub.plan_type,
        plan_name: sub.plan_name,
        business_name: company.business_name,
        onboarding_status: onboarding.status,
        artifact_type: 'other',
      },
    });

    await base44.asServiceRole.functions.invoke('agentJobHelper', {
      job_type: job.job_type,
      trigger: 'entity_event',
      company_id: companyId,
      input_params: { task_id: task.id, subscription_id: sub.id },
      function_to_invoke: 'runAiStep',
      function_payload: { task_id: task.id },
    });

    taskIds.push(task.id);
  }

  // Update company service tracks
  if (companyId) {
    await base44.asServiceRole.entities.Company.update(companyId, {
      service_tracks: [...new Set([...(company.service_tracks || []), sub.plan_type])],
    });
  }

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'subscription_started',
    summary: `DFY plan "${sub.plan_name}" activated → fulfillment agents queued`,
    entity_type: 'Subscription',
    entity_id: sub.id,
    metadata: JSON.stringify({ plan_type: sub.plan_type, task_ids: taskIds }),
  });

  return Response.json({ success: true, task_ids: taskIds, plan_type: sub.plan_type });
});