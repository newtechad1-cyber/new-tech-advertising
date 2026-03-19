import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * PublishingPreparationService
 * Prepares video outputs for multi-platform distribution
 * Generates thumbnails, metadata, platform-specific formats
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const project = await base44.entities.SchoolVideoProjects.get(renderJob.project_id);
    const outputManifest = JSON.parse(renderJob.output_manifest || '{"outputs":[]}');

    // Generate platform-specific metadata
    const publishingMetadata = {
      youtube: {
        title: project.title,
        description: project.description,
        tags: ['school', 'bulldog', project.activity_type],
        category: 'Education',
        privacy: 'public',
        enable_comments: true,
        enable_likes: true
      },
      facebook: {
        title: project.title,
        description: project.description,
        thumbnail: outputManifest.outputs?.[0]?.thumbnail_url,
        posted_as: 'profile',
        allow_shares: true
      },
      instagram: {
        caption: project.description,
        hashtags: ['#BulldogTV', `#${project.activity_type}`],
        format: 'reel',
        duration_max_seconds: 90
      },
      gallery: {
        title: project.title,
        description: project.description,
        thumbnail: outputManifest.outputs?.[0]?.thumbnail_url,
        collection: project.activity_type,
        accessibility_captions: true
      },
      generic: {
        title: project.title,
        description: project.description,
        duration_seconds: outputManifest.outputs?.[0]?.duration_seconds,
        created_at: new Date().toISOString(),
        created_by: 'SchoolVideoNetwork',
        content_rating: 'G'
      }
    };

    // Prepare delivery manifest
    const deliveryManifest = {
      job_id: render_job_id,
      project_id: renderJob.project_id,
      outputs: outputManifest.outputs || [],
      platform_metadata: publishingMetadata,
      publication_status: 'ready_for_publishing',
      prepared_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      output_manifest: JSON.stringify(deliveryManifest),
      stage: `Publishing preparation completed at ${new Date().toISOString()}`
    });

    console.log(`[PublishingPreparationService] Prepared ${deliveryManifest.outputs.length} outputs for publishing`);

    return Response.json({
      success: true,
      delivery_manifest: deliveryManifest,
      platform_count: Object.keys(publishingMetadata).length
    });

  } catch (error) {
    console.error('[PublishingPreparationService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});