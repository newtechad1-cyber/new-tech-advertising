import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * MusicPlanningService
 * Plans music strategy including selection and mixing points
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, scene_plan } = await req.json();

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

    // Generate music plan
    const musicResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Create a music plan for a school ${project.project_type} video.
Tone: ${project.tone || 'warm'}
Preferred style: ${profile?.music_style_preference || 'uplifting orchestral'}

For each scene:
${(scene_plan?.scenes || []).map(s => `${s.scene_number}. ${s.name} (${s.duration_seconds}s): ${s.description}`).join('\n')}

Recommend:
1. Music style per scene
2. Mixing strategy (fade in/out, crossfade)
3. Volume levels for voiceover compatibility
4. Emotional peaks and builds
5. Intro and outro music

Return as JSON with detailed mixing instructions.`,
      response_json_schema: {
        type: 'object',
        properties: {
          music_style: { type: 'string' },
          scenes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                scene_number: { type: 'number' },
                music_cue: { type: 'string' },
                volume_level: { type: 'number' },
                fade_type: { type: 'string' },
                duration: { type: 'number' }
              }
            }
          },
          intro_duration: { type: 'number' },
          outro_duration: { type: 'number' },
          mixing_strategy: { type: 'string' }
        }
      }
    });

    const musicConfig = {
      style: musicResponse.data.music_style,
      provider: 'elevenlabs', // Will be updated during selection
      scene_cues: musicResponse.data.scenes,
      intro_duration_seconds: musicResponse.data.intro_duration,
      outro_duration_seconds: musicResponse.data.outro_duration,
      mixing_strategy: musicResponse.data.mixing_strategy,
      voiceover_ducking: true,
      master_volume: 0.8,
      created_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      music_config: JSON.stringify(musicConfig),
      stage: `Music plan created at ${new Date().toISOString()}`
    });

    console.log(`[MusicPlanningService] Created music plan for job ${render_job_id}`);

    return Response.json({
      success: true,
      music_config,
      music_style: musicResponse.data.music_style
    });

  } catch (error) {
    console.error('[MusicPlanningService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});