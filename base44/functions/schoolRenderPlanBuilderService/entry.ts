import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * RenderPlanBuilderService
 * Assembles all planning data into machine-readable render plan JSON
 * This is the master config file FFmpeg/render engines will use
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { 
      render_job_id, 
      scene_plan, 
      voiceover_config, 
      caption_config, 
      music_config 
    } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const project = await base44.entities.SchoolVideoProjects.get(renderJob.project_id);
    const profile = await base44.entities.SchoolRenderProfiles.get(
      renderJob.render_profile
    ).catch(() => null);

    // Assemble machine-usable render plan
    const renderPlan = {
      version: '1.0',
      project_id: renderJob.project_id,
      render_job_id: renderJob.id,
      render_profile: renderJob.render_profile,
      created_at: new Date().toISOString(),
      
      // Metadata
      metadata: {
        title: project.title,
        description: project.description,
        tone: project.tone || 'warm',
        target_duration_minutes: project.duration_target || '2-3'
      },

      // Scene timeline
      scenes: scene_plan?.scenes || [],

      // Asset references
      assets: {
        input_manifest: JSON.parse(renderJob.input_manifest || '{}'),
        voiceover: voiceover_config || {},
        captions: caption_config || {},
        music: music_config || {},
        branding: JSON.parse(renderJob.branding_config || '{}')
      },

      // Output configuration
      output: {
        variants: renderJob.output_variants ? renderJob.output_variants.split(',') : ['landscape'],
        render_config: JSON.parse(renderJob.render_config || '{}'),
        quality_target: 'high'
      },

      // Processing instructions for render engine
      render_instructions: {
        engine: 'ffmpeg', // Can be ffmpeg, pika, runway, heygen
        sequence_order: 'scene_order',
        transitions_enabled: true,
        effects_enabled: true,
        color_grading: 'auto',
        frame_interpolation: false
      },

      // Retry and monitoring
      monitoring: {
        retry_count: 0,
        max_retries: 3,
        webhook_url: `${Deno.env.get('BASE_URL')}/functions/schoolRenderMonitor`,
        status_update_interval_seconds: 60
      }
    };

    // Store as machine-usable JSON
    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      render_plan_json: JSON.stringify(renderPlan),
      status: 'ready_for_render',
      stage: `Render plan finalized at ${new Date().toISOString()}`
    });

    console.log(`[RenderPlanBuilderService] Built render plan for job ${render_job_id}`);

    return Response.json({
      success: true,
      render_plan_id: renderJob.id,
      status: 'ready_for_render',
      render_plan: renderPlan
    });

  } catch (error) {
    console.error('[RenderPlanBuilderService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});