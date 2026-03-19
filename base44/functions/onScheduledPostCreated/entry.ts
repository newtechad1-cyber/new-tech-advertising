/**
 * Automation: ScheduledPost → Created (status = "scheduled")
 * Trigger:    EntityAutomation on ScheduledPost (create)
 * Action:     scheduling_agent.publish_post  (delegates to existing processScheduledPosts)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const post = payload?.data;
  if (!post) {
    return Response.json({ error: 'No post data in payload' }, { status: 400 });
  }

  // Only queue if scheduled (not already posted/failed)
  if (post.status !== 'scheduled') {
    return Response.json({ skipped: true, reason: `Post status is ${post.status}` });
  }

  const companyId = post.company_id;

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'content_generation',
    trigger: 'entity_event',
    company_id: companyId,
    input_params: {
      scheduled_post_id: post.id,
      content_item_id: post.content_item_id,
      platform: post.platform,
      scheduled_at: post.scheduled_at,
    },
    // The existing processScheduledPosts function handles actual publishing
    function_to_invoke: 'processScheduledPosts',
    function_payload: { scheduled_post_id: post.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'post_published',
    summary: `ScheduledPost created for ${post.platform} → scheduling_agent.publish_post queued`,
    entity_type: 'ScheduledPost',
    entity_id: post.id,
  });

  return Response.json({ success: true });
});