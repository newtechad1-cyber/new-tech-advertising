/**
 * Automation: ContentItem → status set to "approved"
 * Trigger:    EntityAutomation on ContentItem (update)
 * Action:     scheduling_agent.schedule_content
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const item    = payload?.data;
  const oldItem = payload?.old_data;

  if (!item || item.status !== 'approved') {
    return Response.json({ skipped: true, reason: 'Not an approval transition' });
  }
  if (oldItem?.status === 'approved') {
    return Response.json({ skipped: true, reason: 'Already approved' });
  }

  const companyId = item.company_id;

  // Pull the active marketing plan to determine posting schedule
  const plans = companyId
    ? await base44.asServiceRole.entities.MarketingPlan.filter({ company_id: companyId, status: 'active' })
    : [];
  const plan = plans[0] || {};

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'scheduling_agent',
    step_key: 'schedule_content',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      content_item_id: item.id,
      company_id: companyId,
      channels: item.channels,
      content_type: item.content_type,
      caption: item.caption,
      media_urls: item.media_urls,
      hashtags: item.hashtags,
      posting_frequency: plan.posting_frequency,
      active_channels: plan.active_channels,
      artifact_type: 'other',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'content_generation',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, content_item_id: item.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  // Mark ContentItem as scheduled
  await base44.asServiceRole.entities.ContentItem.update(item.id, { status: 'scheduled' });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'content_approved',
    summary: `ContentItem approved → scheduling_agent.schedule_content triggered`,
    entity_type: 'ContentItem',
    entity_id: item.id,
  });

  return Response.json({ success: true, task_id: task.id });
});