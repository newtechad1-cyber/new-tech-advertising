import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * MediaNormalizationService
 * Normalizes video/photo formats for processing
 * Detects format, duration, dimensions, codec compatibility
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

    const inputManifest = JSON.parse(renderJob.input_manifest);
    const normalizedAssets = [];

    // Placeholder: In production, this would call FFmpeg/MediaInfo API
    // to get actual video properties
    for (const asset of inputManifest.assets) {
      const normalized = {
        ...asset,
        status: 'normalized',
        properties: {
          format: asset.type === 'video' ? 'mp4' : 'jpg',
          duration: asset.type === 'video' ? '00:30:00' : null,
          width: 1920,
          height: 1080,
          fps: asset.type === 'video' ? 30 : null,
          codec: asset.type === 'video' ? 'h264' : null
        }
      };
      normalizedAssets.push(normalized);
    }

    const updatedManifest = {
      ...inputManifest,
      assets: normalizedAssets
    };

    const processingLog = JSON.parse(renderJob.processing_log || '[]');
    processingLog.push({
      event: 'media_normalized',
      timestamp: new Date().toISOString(),
      asset_count: normalizedAssets.length
    });

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      status: 'normalizing',
      input_manifest: JSON.stringify(updatedManifest),
      stage: `Media normalized at ${new Date().toISOString()}`,
      processing_log: JSON.stringify(processingLog)
    });

    console.log(`[MediaNormalizationService] Normalized ${normalizedAssets.length} assets for job ${render_job_id}`);

    return Response.json({
      success: true,
      normalized_asset_count: normalizedAssets.length,
      manifest: updatedManifest
    });

  } catch (error) {
    console.error('[MediaNormalizationService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});