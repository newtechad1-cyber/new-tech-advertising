import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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

    const requestedAssets = fullTopic.requested_assets || [];
    if (requestedAssets.length === 0) {
      return Response.json({ message: 'No assets requested, no jobs created' });
    }

    // Create one AIJob per requested asset
    const jobs = [];
    for (const assetType of requestedAssets) {
      const job = await base44.asServiceRole.entities.AIJobs.create({
        topic_id: topicId,
        topic_title: fullTopic.title,
        client: fullTopic.client,
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

    return Response.json({ created: jobs.length, jobs });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});