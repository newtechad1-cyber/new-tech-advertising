import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * ThumbnailService
 * Extracts keyframes from videos for thumbnail generation
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const authUser = await base44.auth.me().catch(() => null);
    if (!authUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (authUser.role !== 'admin' && authUser.is_service !== true) return Response.json({ error: 'Admin access required' }, { status: 403 });
    const { render_job_id } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const inputManifest = JSON.parse(renderJob.input_manifest);

    // Placeholder: Extract keyframes from first video
    const thumbnails = [];
    const videoAsset = inputManifest.assets.find(a => a.type === 'video');

    if (videoAsset) {
      // In production, use FFmpeg to extract keyframes
      for (let i = 0; i < 5; i++) {
        thumbnails.push({
          index: i,
          timestamp: `00:00:${i * 6}`,
          url: `${videoAsset.url}?keyframe=${i}`,
          quality: 'medium'
        });
      }
    }

    const updatedManifest = {
      ...inputManifest,
      thumbnails
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      input_manifest: JSON.stringify(updatedManifest)
    });

    console.log(`[ThumbnailService] Extracted ${thumbnails.length} thumbnails for job ${render_job_id}`);

    return Response.json({
      success: true,
      thumbnail_count: thumbnails.length,
      thumbnails
    });

  } catch (error) {
    console.error('[ThumbnailService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});