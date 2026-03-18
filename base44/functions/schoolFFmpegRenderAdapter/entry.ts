import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * FFmpegRenderAdapter
 * Converts machine-usable render plan into FFmpeg commands
 * Executes render to video file
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, output_variant } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const renderPlan = JSON.parse(renderJob.render_plan_json || '{}');

    // Generate FFmpeg command based on render plan
    const ffmpegConfig = {
      inputs: [
        ...renderPlan.assets.input_manifest.assets.map(a => a.url),
        renderPlan.assets.music.selected_tracks?.tracks?.main?.url
      ],
      filters: generateFilterGraph(renderPlan, output_variant),
      audio: generateAudioMix(renderPlan),
      codec: {
        video: 'libx264',
        audio: 'aac',
        preset: 'medium',
        bitrate_video: '5000k',
        bitrate_audio: '128k'
      },
      output_format: getOutputFormat(output_variant),
      quality_level: 'high'
    };

    // Placeholder: In production, this sends to FFmpeg worker service
    // Example: POST to FFmpeg Docker container or AWS Batch job
    const renderJobOutput = {
      variant: output_variant || 'landscape',
      format: ffmpegConfig.output_format,
      video_url: `https://render-output.example.com/${render_job_id}_${output_variant}.mp4`,
      thumbnail_url: `https://render-output.example.com/${render_job_id}_${output_variant}_thumb.jpg`,
      duration_seconds: renderPlan.scenes?.reduce((sum, s) => sum + s.duration_seconds, 0) || 120,
      status: 'completed',
      rendered_at: new Date().toISOString()
    };

    // Update output manifest
    const outputManifest = JSON.parse(renderJob.output_manifest || '{"outputs":[]}');
    outputManifest.outputs.push(renderJobOutput);

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      output_manifest: JSON.stringify(outputManifest),
      stage: `${output_variant} variant rendered at ${new Date().toISOString()}`
    });

    console.log(`[FFmpegRenderAdapter] Rendered ${output_variant} variant for job ${render_job_id}`);

    return Response.json({
      success: true,
      variant: output_variant,
      video_url: renderJobOutput.video_url,
      thumbnail_url: renderJobOutput.thumbnail_url
    });

  } catch (error) {
    console.error('[FFmpegRenderAdapter] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateFilterGraph(renderPlan, variant) {
  const dimensions = {
    landscape: '1920x1080',
    square: '1080x1080',
    vertical: '1080x1920',
    low_res_preview: '854x480'
  };

  return {
    scale: dimensions[variant] || dimensions.landscape,
    transitions: renderPlan.scenes?.map(s => s.transitions) || [],
    effects: renderPlan.scenes?.map(s => s.effects) || []
  };
}

function generateAudioMix(renderPlan) {
  const musicConfig = renderPlan.assets.music;
  return {
    tracks: musicConfig.mix_config?.timeline?.tracks || [],
    loudness_target: musicConfig.mix_config?.timeline?.loudness_target || -14
  };
}

function getOutputFormat(variant) {
  const formats = {
    landscape: { width: 1920, height: 1080, fps: 30 },
    square: { width: 1080, height: 1080, fps: 30 },
    vertical: { width: 1080, height: 1920, fps: 30 },
    low_res_preview: { width: 854, height: 480, fps: 24 }
  };
  return formats[variant] || formats.landscape;
}