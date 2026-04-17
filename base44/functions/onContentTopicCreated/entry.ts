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

function buildPrompt(assetType, topic) {
  const keyword = topic.primary_keyword || topic.title;
  const market = topic.market || topic.city || 'US';
  const client = topic.client || 'local business';
  const notes = topic.notes ? `\nExtra notes: ${topic.notes}` : '';

  switch (assetType) {
    case 'blog':
      return `Write a high-quality, SEO-optimized blog article for a local business marketing agency.
Topic: "${topic.title}"
Client: ${client}
Keyword: "${keyword}"
Market: ${market}${notes}

Write a complete 600-800 word blog with intro, 3 sections, and a CTA. Format as clean markdown.`;

    case 'landing_page':
      return `Write conversion-optimized landing page copy for: "${topic.title}"
Client: ${client}, Market: ${market}${notes}
Include: hero headline, pain points, solution, benefits (4 items), and a CTA. Format as markdown.`;

    case 'video_script':
      return `Write a 60-second video script for: "${topic.title}"
Client: ${client}, Market: ${market}${notes}

Return JSON with:
- hook: opening 10 seconds
- full_script: complete conversational script (Hook → Problem → Solution → CTA)
- caption: social media caption for this video
- hashtags: 5-8 relevant hashtags`;

    case 'social_series':
      return `Write social media content for: "${topic.title}"
Client: ${client}, Market: ${market}${notes}

Return JSON with:
- caption: primary post caption (2-3 sentences + CTA)
- content: 3-post series (labeled Post 1, Post 2, Post 3, each 100-150 words)
- hashtags: 5-8 relevant hashtags`;

    case 'gbp_post':
      return `Write a Google Business Profile post for: "${topic.title}"
Client: ${client}, Market: ${market}${notes}
Write 1 short post (150-200 words) with a clear CTA. Professional, local, friendly tone.`;

    case 'email':
      return `Write a marketing email for: "${topic.title}"
Client: ${client}, Market: ${market}${notes}
Include: subject line, preview text, body (200-250 words), CTA. Format as markdown.`;

    default:
      return `Write marketing content for: "${topic.title}" by ${client} in ${market}.${notes}`;
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

    // Generate content for each requested asset type and save to ContentAssets
    const createdAssets = [];
    const failedAssets = [];

    for (const assetType of requestedAssets) {
      try {
        await logEvent(base44, {
          event_type: 'content_generation_started',
          entity_type: 'ContentTopics', entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'generating_asset', status: 'started',
          message: `Generating ${assetType} for "${fullTopic.title}"`,
        });

        const prompt = buildPrompt(assetType, fullTopic);
        let contentText = '';
        let captionText = '';

        if (assetType === 'video_script') {
          const raw = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
              type: 'object',
              properties: {
                hook: { type: 'string' },
                full_script: { type: 'string' },
                caption: { type: 'string' },
                hashtags: { type: 'string' },
              }
            }
          });
          contentText = raw?.full_script || raw?.hook || '';
          captionText = raw?.caption || '';
        } else if (assetType === 'social_series') {
          const raw = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema: {
              type: 'object',
              properties: {
                caption: { type: 'string' },
                content: { type: 'string' },
                hashtags: { type: 'string' },
              }
            }
          });
          contentText = raw?.content || raw?.caption || '';
          captionText = raw?.caption || '';
        } else {
          contentText = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
          if (typeof contentText !== 'string') contentText = JSON.stringify(contentText);
        }

        // Save directly to ContentAssets with status needs_review
        const asset = await base44.asServiceRole.entities.ContentAssets.create({
          topic_id: topicId,
          topic_title: fullTopic.title,
          client_id: fullTopic.client_id,
          client: fullTopic.client,
          asset_type: assetType,
          title: `${fullTopic.title} — ${assetType.replace(/_/g, ' ')}`,
          content: contentText,
          caption: captionText,
          status: 'needs_review',
          review_notes: `Auto-generated from topic: ${fullTopic.title}`,
        });

        createdAssets.push({ asset_id: asset.id, asset_type: assetType });

        await logEvent(base44, {
          event_type: 'content_asset_created',
          entity_type: 'ContentAssets', entity_id: asset.id,
          related_entity_type: 'ContentTopics', related_entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'asset_saved_to_review', status: 'success',
          message: `ContentAsset saved with status "needs_review": ${assetType} for "${fullTopic.title}"`,
          payload_snapshot: JSON.stringify({ asset_id: asset.id, asset_type: assetType, client: fullTopic.client }),
        });

        await logEvent(base44, {
          event_type: 'content_asset_saved_to_review',
          entity_type: 'ContentAssets', entity_id: asset.id,
          related_entity_type: 'ContentTopics', related_entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'needs_review', status: 'success',
          message: `Asset ID ${asset.id} is now visible in /agency/content?tab=review`,
        });
      } catch (genErr) {
        failedAssets.push({ asset_type: assetType, error: genErr.message });
        await logEvent(base44, {
          event_type: 'content_asset_creation_failed',
          entity_type: 'ContentTopics', entity_id: topicId,
          workflow_type: 'content', workflow_stage: 'asset_generation_failed',
          status: 'failed', log_level: 'error',
          message: `Failed to generate/save ${assetType} for "${fullTopic.title}": ${genErr.message}`,
          error_details: genErr.message,
        });
      }
    }

    await base44.asServiceRole.entities.ContentTopics.update(topicId, {
      status: createdAssets.length > 0 ? 'ready_for_review' : 'error',
    });

    return Response.json({
      created: createdAssets.length,
      failed: failedAssets.length,
      assets: createdAssets,
      failed_assets: failedAssets,
      workflow_id: workflow?.id || null,
    });
  } catch (error) {
    console.error('[onContentTopicCreated] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});