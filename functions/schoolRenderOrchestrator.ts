import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * RenderOrchestrator
 * Orchestrates entire render pipeline and dispatches to render engines
 * Handles job queuing, priority, retry logic
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, skip_stages } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const pipelineStages = [
      { name: 'intake', service: 'schoolSubmissionIntakeService', skip: skip_stages?.includes('intake') },
      { name: 'normalizing', service: 'schoolMediaNormalizationService', skip: skip_stages?.includes('normalizing') },
      { name: 'analyzing', service: 'schoolClipAnalysisService', skip: skip_stages?.includes('analyzing') },
      { name: 'scoring', service: 'schoolHighlightScoringService', skip: skip_stages?.includes('scoring') },
      { name: 'story_arch', service: 'schoolStoryArchitectService', skip: skip_stages?.includes('story_arch') },
      { name: 'scene_build', service: 'schoolSceneBuilderService', skip: skip_stages?.includes('scene_build') },
      { name: 'voiceover_script', service: 'schoolVoiceoverScriptService', skip: skip_stages?.includes('voiceover_script') },
      { name: 'caption_plan', service: 'schoolCaptionPlanningService', skip: skip_stages?.includes('caption_plan') },
      { name: 'music_plan', service: 'schoolMusicPlanningService', skip: skip_stages?.includes('music_plan') },
      { name: 'render_plan', service: 'schoolRenderPlanBuilderService', skip: skip_stages?.includes('render_plan') },
      { name: 'voiceover_gen', service: 'schoolVoiceoverGenerationService', skip: skip_stages?.includes('voiceover_gen') },
      { name: 'caption_render', service: 'schoolCaptionRenderService', skip: skip_stages?.includes('caption_render') },
      { name: 'branding_assets', service: 'schoolBrandingAssetService', skip: skip_stages?.includes('branding_assets') },
      { name: 'music_select', service: 'schoolMusicSelectionService', skip: skip_stages?.includes('music_select') },
      { name: 'music_mix', service: 'schoolMusicMixPrepService', skip: skip_stages?.includes('music_mix') }
    ];

    const processingLog = JSON.parse(renderJob.processing_log || '[]');

    // Execute pipeline stages in order
    for (const stage of pipelineStages) {
      if (stage.skip) {
        console.log(`[RenderOrchestrator] Skipping stage: ${stage.name}`);
        continue;
      }

      try {
        console.log(`[RenderOrchestrator] Executing stage: ${stage.name}`);
        
        // Call stage service
        const stageResult = await base44.asServiceRole.functions.invoke(stage.service, {
          render_job_id
        });

        processingLog.push({
          event: `stage_completed`,
          stage: stage.name,
          timestamp: new Date().toISOString(),
          success: stageResult.data.success
        });

        if (!stageResult.data.success) {
          throw new Error(`Stage ${stage.name} failed: ${stageResult.data.error}`);
        }
      } catch (error) {
        processingLog.push({
          event: 'stage_failed',
          stage: stage.name,
          error: error.message,
          timestamp: new Date().toISOString()
        });

        // Check retry logic
        const newRetryCount = renderJob.retry_count + 1;
        if (newRetryCount <= renderJob.max_retries) {
          await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
            status: 'failed',
            failure_reason: error.message,
            failure_stage: stage.name,
            retry_count: newRetryCount,
            processing_log: JSON.stringify(processingLog)
          });
          return Response.json({
            success: false,
            message: `Stage ${stage.name} failed, will retry (attempt ${newRetryCount}/${renderJob.max_retries})`,
            failure_stage: stage.name,
            retry_count: newRetryCount
          });
        } else {
          await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
            status: 'failed',
            failure_reason: error.message,
            failure_stage: stage.name,
            processing_log: JSON.stringify(processingLog)
          });
          return Response.json({
            success: false,
            message: `Stage ${stage.name} failed after ${renderJob.max_retries} retries`,
            failure_stage: stage.name
          }, { status: 500 });
        }
      }
    }

    // All stages completed - dispatch to render engine
    processingLog.push({
      event: 'all_stages_completed',
      timestamp: new Date().toISOString()
    });

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      status: 'rendering',
      processing_log: JSON.stringify(processingLog),
      stage: `Dispatching to render engine at ${new Date().toISOString()}`
    });

    console.log(`[RenderOrchestrator] All stages completed for job ${render_job_id}, dispatching to render engine`);

    return Response.json({
      success: true,
      message: 'All pipeline stages completed, job ready for rendering',
      job_id: render_job_id,
      status: 'rendering'
    });

  } catch (error) {
    console.error('[RenderOrchestrator] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});