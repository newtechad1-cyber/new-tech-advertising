import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Music Selection Service
 * Recommends and selects appropriate music based on:
 * - Project tone and style
 * - Pacing and energy levels
 * - School branding preferences
 * - Music library metadata
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id } = await req.json();

    if (!project_id) {
      return Response.json({ error: 'Missing project_id' }, { status: 400 });
    }

    // Fetch project
    const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
      .then(all => all.find(p => p.id === project_id));

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch branding defaults
    const branding = await base44.asServiceRole.entities.SchoolBranding.list()
      .then(all => all[0]);

    // Fetch available music profiles
    const musicProfiles = await base44.asServiceRole.entities.SchoolMusicProfiles.list();

    // Recommend music based on project characteristics
    const musicPrompt = `Recommend the best music style for this school video project:

Project Type: ${project.project_type}
Tone: ${project.tone}
Activity: ${project.activity_type}
Duration: ${project.duration_target}
Target Audience: ${project.target_audience}

Available Music Styles:
${musicProfiles.map(m => `- ${m.name}: ${m.style_description} (Mood: ${m.mood}, BPM: ${m.bpm_range})`).join('\n')}

Select the best matching music style and explain why it's appropriate for this video.`;

    const musicRecommendation = await base44.integrations.Core.InvokeLLM({
      prompt: musicPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          recommended_style: { type: 'string' },
          reasoning: { type: 'string' },
          energy_level: { type: 'string' },
          timing_notes: { type: 'string' }
        }
      }
    });

    // Update project with music selection
    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      selected_music_style: musicRecommendation.recommended_style
    });

    return Response.json({
      success: true,
      recommendation: musicRecommendation
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});