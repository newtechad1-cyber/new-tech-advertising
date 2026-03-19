/**
 * Automation: ContentCampaign → total_items_planned updated (campaign ready to launch)
 * Trigger:    EntityAutomation on ContentCampaign (update)
 * Action:     campaign_agent.launch_campaign  (when status transitions to "active")
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const campaign    = payload?.data;
  const oldCampaign = payload?.old_data;

  // Fire when campaign becomes active
  if (!campaign || campaign.status !== 'active') {
    return Response.json({ skipped: true, reason: 'Campaign not active' });
  }
  if (oldCampaign?.status === 'active') {
    return Response.json({ skipped: true, reason: 'Already active' });
  }

  const companyId = campaign.company_id;

  // Pull associated ContentItems for this campaign
  const items = await base44.asServiceRole.entities.ContentItem.filter({
    company_id: companyId,
    campaign_id: campaign.id,
  });

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'campaign_agent',
    step_key: 'launch_campaign',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      campaign_id: campaign.id,
      company_id: companyId,
      campaign_name: campaign.name,
      goal: campaign.goal,
      channels: campaign.channels,
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      total_items_planned: campaign.total_items_planned,
      approved_content_count: items.filter(i => i.status === 'approved' || i.status === 'scheduled').length,
      artifact_type: 'other',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'content_generation',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, campaign_id: campaign.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'content_approved',
    summary: `Campaign "${campaign.name}" activated → campaign_agent.launch_campaign triggered`,
    entity_type: 'ContentCampaign',
    entity_id: campaign.id,
  });

  return Response.json({ success: true, task_id: task.id });
});