import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * CaptionRenderService
 * Prepares captions for integration into video
 * Handles SRT format, style, positioning
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

    const captionConfig = JSON.parse(renderJob.caption_config || '{}');
    const srtContent = captionConfig.srt_content || '';

    // Convert SRT to multiple formats for different use cases
    const captionFormats = {
      srt: srtContent,
      vtt: srtContent.replace(/\r\n|\r|\n/g, '\n').split('\n').filter(line => !line.match(/^\d+$/)).join('\n'),
      json: JSON.stringify(captionConfig.captions || [])
    };

    // Store caption files
    const captionData = {
      formats: captionFormats,
      style: captionConfig.style,
      caption_count: captionConfig.captions?.length || 0,
      burn_in: captionConfig.burn_in,
      generated_at: new Date().toISOString(),
      srt_url: `https://caption-service.example.com/output/${render_job_id}_captions.srt`
    };

    const updatedCaptionConfig = {
      ...captionConfig,
      rendered_data: captionData
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      caption_config: JSON.stringify(updatedCaptionConfig),
      stage: `Captions prepared at ${new Date().toISOString()}`
    });

    console.log(`[CaptionRenderService] Prepared ${captionConfig.captions?.length || 0} captions for job ${render_job_id}`);

    return Response.json({
      success: true,
      caption_count: captionConfig.captions?.length || 0,
      caption_data: captionData
    });

  } catch (error) {
    console.error('[CaptionRenderService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});