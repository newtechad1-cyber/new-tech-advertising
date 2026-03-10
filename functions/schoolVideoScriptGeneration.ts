import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * AI Script Generation Service
 * Generates video scripts based on:
 * - Selected clips and their transcripts
 * - Project type and tone
 * - School branding and messaging
 * - Clip sequence and narrative flow
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id } = await req.json();

    if (!project_id) {
      return Response.json({ error: 'Missing project_id' }, { status: 400 });
    }

    // Fetch project and its clips
    const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
      .then(all => all.find(p => p.id === project_id));

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Fetch school settings for AI defaults
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug: project.school || '' });
    const settings = {
      ai_tone_default: 'warm',
      voiceover_enabled_default: true,
      captions_enabled_default: true,
      video_duration_target: '2-3 minutes',
      ...(settingsArr[0] || {})
    };

    // Fetch selected clips
    const clips = await base44.asServiceRole.entities.SchoolVideoClips.filter({
      project_id,
      is_selected: true
    });

    // Fetch branding
    const branding = await base44.asServiceRole.entities.SchoolBranding.list()
      .then(all => all[0]);

    // Build context for script generation
    const clipContext = clips
      .sort((a, b) => (a.recommended_order || 0) - (b.recommended_order || 0))
      .map(c => ({
        title: c.clip_title,
        transcript: c.transcript || c.scene_description,
        tone: c.emotional_tone,
        activity: c.detected_activity
      }));

    const scriptPrompt = `Generate a compelling video script for a ${project.project_type} video about ${project.activity_type || 'school events'}.

Project Details:
- Title: ${project.title}
- Description: ${project.description}
- Objective: ${project.objective}
- Target Audience: ${project.target_audience}
- Tone: ${project.tone || settings.ai_tone_default}
- School: ${branding?.school_name || 'School'} - ${branding?.network_name || 'Network'}

Clips/Scenes:
${clipContext.map((c, i) => `${i + 1}. "${c.title}" - ${c.transcript}`).join('\n')}

Create a script with:
1. Hook (first 10 seconds) - grab attention immediately
2. Main narrative flow using the clips above
3. On-screen text overlays
4. Voiceover direction
5. Call-to-action
6. School branding integration: "${branding?.intro_text || ''}"

Format as JSON with fields: hook_line, story_summary, full_voiceover_script, scene_structure, on_screen_text, caption_text, music_direction, pacing_direction, call_to_action`;

    const script = await base44.integrations.Core.InvokeLLM({
      prompt: scriptPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          hook_line: { type: 'string' },
          story_summary: { type: 'string' },
          full_voiceover_script: { type: 'string' },
          scene_structure: { type: 'string' },
          on_screen_text: { type: 'string' },
          caption_text: { type: 'string' },
          music_direction: { type: 'string' },
          pacing_direction: { type: 'string' },
          call_to_action: { type: 'string' }
        }
      }
    });

    // Create script record
    const scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.create({
      project_id,
      script_version: 1,
      title: project.title,
      hook_line: script.hook_line,
      short_description: project.description,
      story_summary: script.story_summary,
      full_voiceover_script: script.full_voiceover_script,
      scene_structure: script.scene_structure,
      on_screen_text: script.on_screen_text,
      caption_text: script.caption_text,
      intro_text: branding?.intro_text,
      outro_text: branding?.outro_text,
      music_direction: script.music_direction,
      pacing_direction: script.pacing_direction,
      call_to_action: script.call_to_action,
      generation_status: 'generated'
    });

    // Update project status
    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'script_generated',
      ai_story_summary: script.story_summary,
      generated_title: project.generated_title || project.title,
      generated_description: project.generated_description || project.description
    });

    return Response.json({ success: true, script: scriptRecord });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});