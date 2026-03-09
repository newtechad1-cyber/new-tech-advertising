import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * ClipAnalysisService
 * Analyzes visual and audio properties of clips
 * Detects scenes, activity, quality metrics
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
    const videoAsset = inputManifest.assets.find(a => a.type === 'video');

    if (!videoAsset) {
      return Response.json({
        success: true,
        analysis: null,
        message: 'No video asset to analyze'
      });
    }

    // Use OpenAI Vision for analysis
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this video and provide:
1. Scene descriptions at key moments
2. Detected activities and emotions
3. Video quality assessment (lighting, audio, composition)
4. Suggested highlight moments with timestamps
5. Overall energy level (0-10)
6. Recommended clip duration for highlight reel`,
      file_urls: [videoAsset.url],
      response_json_schema: {
        type: 'object',
        properties: {
          scenes: { type: 'array', items: { type: 'object' } },
          detected_activity: { type: 'string' },
          detected_emotion: { type: 'string' },
          quality_score: { type: 'number' },
          energy_level: { type: 'number' },
          highlight_moments: { type: 'array', items: { type: 'string' } },
          recommended_duration: { type: 'string' }
        }
      }
    });

    const updatedManifest = {
      ...inputManifest,
      analysis: analysis.data
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      input_manifest: JSON.stringify(updatedManifest),
      stage: `Clip analysis completed at ${new Date().toISOString()}`
    });

    console.log(`[ClipAnalysisService] Analyzed clip for job ${render_job_id}`);

    return Response.json({
      success: true,
      quality_score: analysis.data.quality_score,
      energy_level: analysis.data.energy_level,
      highlight_moments: analysis.data.highlight_moments
    });

  } catch (error) {
    console.error('[ClipAnalysisService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});