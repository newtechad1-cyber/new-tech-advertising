import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * SceneBuilderService
 * Converts story outline into detailed scene structure
 * Defines transitions, effects, timing
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, story_plan } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const inputManifest = JSON.parse(renderJob.input_manifest);

    // Build detailed scenes from story structure
    const scenes = [
      {
        scene_number: 1,
        type: 'intro',
        name: 'Hook',
        duration_seconds: 5,
        assets: [],
        transitions: 'fade_in',
        effects: ['title_overlay'],
        voiceover_needed: true,
        description: story_plan?.narrative_structure?.hook || 'Introduction scene'
      },
      {
        scene_number: 2,
        type: 'setup',
        name: 'Context',
        duration_seconds: 15,
        assets: inputManifest.ranked_by_highlight?.slice(0, 2) || [],
        transitions: 'cross_dissolve',
        effects: ['subtitle'],
        voiceover_needed: true,
        description: story_plan?.narrative_structure?.setup || 'Setup scene'
      },
      {
        scene_number: 3,
        type: 'rising_action',
        name: 'Momentum',
        duration_seconds: 40,
        assets: inputManifest.ranked_by_highlight?.slice(2, 5) || [],
        transitions: 'cut',
        effects: ['dynamic_text', 'music_swell'],
        voiceover_needed: true,
        description: story_plan?.narrative_structure?.rising_action || 'Building momentum'
      },
      {
        scene_number: 4,
        type: 'climax',
        name: 'Peak',
        duration_seconds: 20,
        assets: inputManifest.ranked_by_highlight?.slice(0, 1) || [],
        transitions: 'match_cut',
        effects: ['emphasis_zoom', 'sound_design'],
        voiceover_needed: false,
        description: story_plan?.narrative_structure?.climax || 'Emotional peak'
      },
      {
        scene_number: 5,
        type: 'resolution',
        name: 'Conclusion',
        duration_seconds: 10,
        assets: inputManifest.assets?.slice(0, 1) || [],
        transitions: 'fade_to_black',
        effects: ['closing_text', 'branding'],
        voiceover_needed: true,
        description: story_plan?.narrative_structure?.resolution || 'Inspiring conclusion'
      }
    ];

    const scenePlan = {
      total_scenes: scenes.length,
      estimated_total_duration_seconds: scenes.reduce((sum, s) => sum + s.duration_seconds, 0),
      scenes,
      created_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      stage: `Scene structure created at ${new Date().toISOString()}`
    });

    console.log(`[SceneBuilderService] Built ${scenes.length} scenes for job ${render_job_id}`);

    return Response.json({
      success: true,
      scene_plan: scenePlan,
      scene_count: scenes.length,
      total_duration_seconds: scenePlan.estimated_total_duration_seconds
    });

  } catch (error) {
    console.error('[SceneBuilderService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});