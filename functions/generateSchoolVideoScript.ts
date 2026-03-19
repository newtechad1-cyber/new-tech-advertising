import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// ── Template resolution ──────────────────────────────────────────────────────
// Returns the first active AIPromptTemplates record for this school+type,
// or null if none found (callers fall back to hardcoded defaults).
async function resolveTemplate(base44, school_slug, template_type) {
  if (!school_slug) return null;
  const results = await base44.asServiceRole.entities.AIPromptTemplates.filter({
    school_slug,
    template_type,
    is_active: true,
  });
  return results[0] || null;
}

// ── Hardcoded fallback prompt (used when no school template is active) ────────
const FALLBACK_SCRIPT_PROMPT = (project, clipContext, branding) => `You are a school video production writer creating a short, uplifting community video for ${project.school || 'the school'}.

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
- School branding: "${branding?.intro_text || ''}"

Generate a complete video script as JSON with fields:
title, hook_line, short_description, story_summary, scene_structure, full_voiceover_script, on_screen_text, caption_text, music_direction, outro_line, call_to_action`;

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

    const school_slug = project.school || '';

    const [clips, branding, template] = await Promise.all([
      base44.asServiceRole.entities.SchoolVideoClips.filter({ project_id }),
      base44.asServiceRole.entities.SchoolBranding.filter({ school_slug }).then(r => r[0] || null),
      resolveTemplate(base44, school_slug, 'video_script_generator'),
    ]);

    const clipContext = clips.length > 0
      ? clips.map(c => `- ${c.clip_title || 'Clip'}: ${c.scene_description || ''} | Tags: ${c.ai_tags || ''} | Tone: ${c.emotional_tone || ''} | Activity: ${c.detected_activity || ''}`).join('\n')
      : 'General school footage and activities';

    // Interpolation variables for template placeholders
    const vars = {
      project_title: project.title,
      project_type: project.project_type,
      activity_type: project.activity_type || 'general',
      event_name: project.event_name || 'school activities',
      tone: project.tone || 'warm',
      duration_target: project.duration_target || '2-3 minutes',
      target_audience: project.target_audience || 'students, parents, and community',
      objective: project.objective || 'Celebrate student achievement',
      school_name: branding?.school_name || project.school || 'the school',
      intro_text: branding?.intro_text || '',
      clip_context: clipContext,
    };

    let finalPrompt;
    if (template?.user_prompt_template) {
      // Interpolate school template
      let p = template.user_prompt_template;
      Object.entries(vars).forEach(([k, v]) => {
        p = p.replace(new RegExp(`\\{${k}\\}`, 'g'), v || '');
      });
      finalPrompt = p;
    } else {
      finalPrompt = FALLBACK_SCRIPT_PROMPT(project, clipContext, branding);
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: finalPrompt,
      ...(template?.system_prompt ? { system_prompt: template.system_prompt } : {}),
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

    // Increment template usage_count
    if (template?.id) {
      await base44.asServiceRole.entities.AIPromptTemplates.update(template.id, {
        usage_count: (template.usage_count || 0) + 1,
      });
    }

    const existingScripts = await base44.asServiceRole.entities.SchoolVideoScripts.filter({ project_id });

    const scriptData = {
      school_slug,
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
      prompt_template_id: template?.id || null,
    };

    let scriptRecord;
    if (existingScripts.length > 0) {
      scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.update(existingScripts[0].id, {
        ...scriptData,
        script_version: (existingScripts[0].script_version || 1) + 1,
      });
    } else {
      scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.create({
        ...scriptData,
        script_version: 1,
      });
    }

    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'script_generated',
      generated_title: result.title,
      generated_description: result.short_description,
      ai_story_summary: result.story_summary,
    });

    return Response.json({ success: true, script: scriptRecord, template_used: template?.id || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});