import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * VoiceoverScriptService
 * Generates professional voiceover script from scenes
 * Optimized for pacing and emotional impact
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

    // Generate voiceover for each scene
    const scriptResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional voiceover script for a school ${project.project_type} video.
Project: ${project.title}
Description: ${project.description}
Tone: ${project.tone || 'warm'}

Create voiceover lines for each of these scenes:
${(scene_plan?.scenes || []).map(s => `${s.scene_number}. ${s.name}: ${s.description}`).join('\n')}

Guidelines:
- Each line should fit within the scene duration
- Use conversational, engaging language
- Include emotional beats
- Add strategic pauses for music/effects
- Make it age-appropriate and school-friendly

Format as JSON with one script line per scene.`,
      response_json_schema: {
        type: 'object',
        properties: {
          scenes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                scene_number: { type: 'number' },
                voiceover_text: { type: 'string' },
                estimated_duration_seconds: { type: 'number' },
                emphasis_points: { type: 'array', items: { type: 'string' } },
                pause_positions: { type: 'array', items: { type: 'number' } }
              }
            }
          },
          full_script: { type: 'string' }
        }
      }
    });

    const voiceoverConfig = {
      provider: 'elevenlabs', // Default provider
      voice: 'professional_narrator',
      speed: 1.0,
      emotion_emphasis: 'moderate',
      script_lines: scriptResponse.data.scenes,
      full_script: scriptResponse.data.full_script,
      created_at: new Date().toISOString()
    };

    // Update render job with voiceover config
    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      voiceover_config: JSON.stringify(voiceoverConfig),
      stage: `Voiceover script generated at ${new Date().toISOString()}`
    });

    console.log(`[VoiceoverScriptService] Generated voiceover for job ${render_job_id}`);

    return Response.json({
      success: true,
      voiceover_config,
      full_script: scriptResponse.data.full_script,
      script_line_count: scriptResponse.data.scenes.length
    });

  } catch (error) {
    console.error('[VoiceoverScriptService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});