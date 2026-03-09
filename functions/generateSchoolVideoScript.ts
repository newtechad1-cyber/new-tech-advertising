import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { project_id } = await req.json();

    const projects = await base44.asServiceRole.entities.SchoolVideoProjects.filter({ id: project_id });
    if (!projects.length) return Response.json({ error: 'Project not found' }, { status: 404 });
    const project = projects[0];

    const clips = await base44.asServiceRole.entities.SchoolVideoClips.filter({ project_id });

    const clipContext = clips.length > 0
      ? clips.map(c => `- ${c.clip_title || 'Clip'}: ${c.scene_description || ''} | Tags: ${c.ai_tags || ''} | Tone: ${c.emotional_tone || ''} | Activity: ${c.detected_activity || ''}`).join('\n')
      : 'General school footage and activities';

    const prompt = `You are a school video production writer creating a short, uplifting community video for ${project.school || 'Hampton-Dumont Community Schools'}.

Project: "${project.title}"
Type: ${project.project_type}
Activity/Category: ${project.activity_type || 'general'}
Event: ${project.event_name || 'school activities'}
Tone: ${project.tone || 'warm'}
Target Duration: ${project.duration_target || '2-3 minutes'}
Audience: ${project.target_audience || 'students, parents, and community'}
Objective: ${project.objective || 'Celebrate student achievement and school community'}

Available clips/media context:
${clipContext}

Guidelines:
- Keep language positive, school-safe, and community-focused
- Highlight student involvement, learning, teamwork, and pride
- Use clear, warm, human language — not corporate-sounding
- Do NOT use clichés like "amazing journey" or "exciting adventure"
- Structure for a ${project.duration_target || '2-3 minute'} video
- Tone should be: ${project.tone || 'warm and genuine'}

Generate a complete video script as a JSON object:
{
  "title": "compelling, specific video title",
  "hook_line": "opening line that grabs attention in the first 10 seconds",
  "short_description": "2-3 sentence description for the public gallery",
  "story_summary": "one paragraph explaining the story arc and what makes this video meaningful",
  "scene_structure": "numbered scene list, e.g. 1. Opening shot - students arriving... 2. Feature moment...",
  "full_voiceover_script": "complete narration text, written as it would be spoken aloud",
  "on_screen_text": "lower thirds and text overlay suggestions per scene",
  "caption_text": "short social media caption version (2-3 sentences + hashtags)",
  "music_direction": "specific musical mood, tempo, and style guidance (e.g. 'Upbeat acoustic guitar, 110 bpm, building energy mid-video')",
  "outro_line": "memorable closing line",
  "call_to_action": "viewer action encouraged at end"
}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          hook_line: { type: 'string' },
          short_description: { type: 'string' },
          story_summary: { type: 'string' },
          scene_structure: { type: 'string' },
          full_voiceover_script: { type: 'string' },
          on_screen_text: { type: 'string' },
          caption_text: { type: 'string' },
          music_direction: { type: 'string' },
          outro_line: { type: 'string' },
          call_to_action: { type: 'string' }
        }
      }
    });

    const existingScripts = await base44.asServiceRole.entities.SchoolVideoScripts.filter({ project_id });

    let scriptRecord;
    const scriptData = {
      project_id,
      title: result.title,
      hook_line: result.hook_line,
      short_description: result.short_description,
      story_summary: result.story_summary,
      scene_structure: result.scene_structure,
      full_voiceover_script: result.full_voiceover_script,
      on_screen_text: result.on_screen_text,
      caption_text: result.caption_text,
      music_direction: result.music_direction,
      outro_text: result.outro_line,
      call_to_action: result.call_to_action,
      generation_status: 'generated',
    };

    if (existingScripts.length > 0) {
      scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.update(existingScripts[0].id, {
        ...scriptData,
        script_version: (existingScripts[0].script_version || 1) + 1
      });
    } else {
      scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.create({
        ...scriptData,
        script_version: 1
      });
    }

    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'script_generated',
      generated_title: result.title,
      generated_description: result.short_description,
      ai_story_summary: result.story_summary
    });

    return Response.json({ success: true, script: scriptRecord });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});