import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support both direct call with topic data and entity automation payload
    const topic = body.data || body.topic;
    const topicId = topic?.id || body.event?.entity_id;

    if (!topicId) {
      return Response.json({ error: 'No topic ID provided' }, { status: 400 });
    }

    // Fetch full topic if not provided
    let fullTopic = topic;
    if (!fullTopic?.requested_assets) {
      fullTopic = await base44.asServiceRole.entities.ContentTopics.get(topicId);
    }

    // Create ContentWorkflow record for this topic
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
      console.log('[onContentTopicCreated] ContentWorkflow created:', workflow.id);
    } catch (wfErr) {
      console.warn('[onContentTopicCreated] ContentWorkflow creation failed:', wfErr.message);
    }

    const requestedAssets = fullTopic.requested_assets || [];
    if (requestedAssets.length === 0) {
      return Response.json({
        message: 'No assets requested, no jobs created',
        workflow_id: workflow?.id || null,
      });
    }

    // Create one AIJob per requested asset
    const jobs = [];
    for (const assetType of requestedAssets) {
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
    }

    // Update topic status to queued
    await base44.asServiceRole.entities.ContentTopics.update(topicId, { status: 'queued' });

    return Response.json({ created: jobs.length, jobs, workflow_id: workflow?.id || null });
  } catch (error) {
    console.error('[onContentTopicCreated] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});