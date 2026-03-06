/**
 * Automation: ScheduledPost → status set to "posted"
 * Trigger:    EntityAutomation on ScheduledPost (update)
 * Action:     analytics_agent.collect_metrics
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const post    = payload?.data;
  const oldPost = payload?.old_data;

  if (!post || post.status !== 'posted') {
    return Response.json({ skipped: true, reason: 'Post not yet published' });
  }
  if (oldPost?.status === 'posted') {
    return Response.json({ skipped: true, reason: 'Already posted' });
  }

  const companyId = post.company_id;

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'analytics_agent',
    step_key: 'collect_metrics',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      scheduled_post_id: post.id,
      content_item_id: post.content_item_id,
      company_id: companyId,
      platform: post.platform,
      platform_post_id: post.platform_post_id,
      posted_at: post.posted_at,
      artifact_type: 'other',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'report_generation',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, scheduled_post_id: post.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'post_published',
    summary: `Post published on ${post.platform} → analytics_agent.collect_metrics triggered`,
    entity_type: 'ScheduledPost',
    entity_id: post.id,
  });

  return Response.json({ success: true, task_id: task.id });
});