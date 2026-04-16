import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Inline log helper ─────────────────────────────────────────────────────────
async function logEvent(base44, params) {
  try {
    const {
      event_type, source_system = 'base44_function', source_route = '',
      source_component = 'onContentTopicCreated', entity_type = '', entity_id = '',
      related_entity_type = '', related_entity_id = '', workflow_type = 'content',
      workflow_stage = '', status = 'success', message = '', error_details = '',
      payload_snapshot = '', log_level,
    } = params;
    const resolvedLevel = log_level || (status === 'failed' ? 'error' : status === 'warning' ? 'warning' : 'info');
    await base44.asServiceRole.entities.SystemLog.create({
      event_type, source_system, source_route, source_component,
      entity_type, entity_id: entity_id ? String(entity_id) : '',
      related_entity_type, related_entity_id: related_entity_id ? String(related_entity_id) : '',
      workflow_type, workflow_stage, status, message,
      error_details: String(error_details || ''),
      payload_snapshot: typeof payload_snapshot === 'string' ? payload_snapshot.slice(0, 2000) : JSON.stringify(payload_snapshot || {}).slice(0, 2000),
      log_level: resolvedLevel,
    });
  } catch (e) {
    console.warn('[onContentTopicCreated] SystemLog write failed:', e.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const topic = body.data || body.topic;
    const topicId = topic?.id || body.event?.entity_id;

    if (!topicId) {
      return Response.json({ error: 'No topic ID provided' }, { status: 400 });
    }

    let fullTopic = topic;
    if (!fullTopic?.requested_assets) {
      fullTopic = await base44.asServiceRole.entities.ContentTopics.get(topicId);
    }

    // Log: topic received
    await logEvent(base44, {
      event_type: 'content_topic_created',
      source_component: 'onContentTopicCreated',
      entity_type: 'ContentTopics', entity_id: topicId,
      workflow_type: 'content', workflow_stage: 'topic_received', status: 'success',
      message: `Content topic received for processing: "${fullTopic?.title}" (${fullTopic?.client || 'unknown client'})`,
      payload_snapshot: JSON.stringify({ title: fullTopic?.title, client: fullTopic?.client, requested_assets: fullTopic?.requested_assets }),
    });

    // Create ContentWorkflow record
    let workflow = null;
    try {
      workflow = await base44.asServiceRole.entities.ContentWorkflow.create({
        title: fullTopic.title,
        client_id: fullTopic.client_id,
        client: fullTopic.client,
        content_topic_id: topicId,
        current_stage: 'topic_created',
        script_status: 'not_started',
        heygen_status: 'not_sent',
        caption_status: 'not_created',
        publishing_status: 'not_started',
        priority: fullTopic.priority || 'medium',
      });

      await logEvent(base44, {
        event_type: 'content_workflow_stage_changed',
        entity_type: 'ContentWorkflow', entity_id: workflow.id,
        related_entity_type: 'ContentTopics', related_entity_id: topicId,
        workflow_type: 'content', workflow_stage: 'topic_created', status: 'success',
        message: `ContentWorkflow created at stage "topic_created" for "${fullTopic.title}"`,
      });
    } catch (wfErr) {
      console.warn('[onContentTopicCreated] ContentWorkflow creation failed:', wfErr.message);
      await logEvent(base44, {
        event_type: 'content_topic_create_failed',
        entity_type: 'ContentTopics', entity_id: topicId,
        workflow_type: 'content', workflow_stage: 'workflow_create', status: 'failed',
        message: `ContentWorkflow creation failed for "${fullTopic.title}": ${wfErr.message}`,
        error_details: wfErr.message,
      });
    }

    const requestedAssets = fullTopic.requested_assets || [];
    if (requestedAssets.length === 0) {
      await logEvent(base44, {
        event_type: 'content_generation_requested',
        entity_type: 'ContentTopics', entity_id: topicId,
        workflow_type: 'content', workflow_stage: 'no_assets_requested', status: 'skipped',
        message: `No assets requested for topic "${fullTopic.title}" — no AI jobs created`,
      });
      return Response.json({ message: 'No assets requested, no jobs created', workflow_id: workflow?.id || null });
    }

    await logEvent(base44, {
      event_type: 'content_generation_requested',
      entity_type: 'ContentTopics', entity_id: topicId,
      workflow_type: 'content', workflow_stage: 'jobs_starting', status: 'started',
      message: `Requesting content generation for ${requestedAssets.length} asset types: ${requestedAssets.join(', ')}`,
      payload_snapshot: JSON.stringify({ requestedAssets, title: fullTopic.title }),
    });

    const jobs = [];
    for (const assetType of requestedAssets) {
      try {
        const job = await base44.asServiceRole.entities.AIJobs.create({
          topic_id: topicId,
          topic_title: fullTopic.title,
          client: fullTopic.client,
          client_id: fullTopic.client_id,
          job_type: assetType,
          status: 'pending',
          prompt_input: JSON.stringify({
            title: fullTopic.title,
            primary_keyword: fullTopic.primary_keyword,
            market: fullTopic.market,
            service_type: fullTopic.service_type,
            notes: fullTopic.notes,
            brand_voice: fullTopic.brand_voice,
          }),
        });
        jobs.push(job);

        await logEvent(base44, {
          event_type: 'content_generation_started',
          entity_type: 'AIJobs', entity_id: job.id,
          related_entity_type: 'ContentTopics', related_entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'job_queued', status: 'success',
          message: `AI job queued: ${assetType} for "${fullTopic.title}" (${fullTopic.client || 'unknown client'})`,
        });
      } catch (jobErr) {
        await logEvent(base44, {
          event_type: 'content_generation_failed',
          entity_type: 'ContentTopics', entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'job_create_failed',
          status: 'failed', log_level: 'error',
          message: `Failed to create AI job for ${assetType} on topic "${fullTopic.title}": ${jobErr.message}`,
          error_details: jobErr.message,
        });
      }
    }

    await base44.asServiceRole.entities.ContentTopics.update(topicId, { status: 'queued' });

    return Response.json({ created: jobs.length, jobs, workflow_id: workflow?.id || null });
  } catch (error) {
    console.error('[onContentTopicCreated] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});