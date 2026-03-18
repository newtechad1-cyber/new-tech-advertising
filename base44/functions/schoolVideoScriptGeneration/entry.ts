import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// ── Template resolution ──────────────────────────────────────────────────────
async function resolveTemplate(base44, school_slug, template_type) {
  if (!school_slug) return null;
  const results = await base44.asServiceRole.entities.AIPromptTemplates.filter({
    school_slug,
    template_type,
    is_active: true,
  });
  return results[0] || null;
}

function interpolate(template, vars) {
  let p = template;
  Object.entries(vars).forEach(([k, v]) => {
    p = p.replace(new RegExp(`\\{${k}\\}`, 'g'), v || '');
  });
  return p;
}

const FALLBACK_PROMPT = (project, clipContext, branding, settings) =>
`Generate a compelling video script for a ${project.project_type} video about ${project.activity_type || 'school events'}.

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

/**
 * AI Script Generation Service
 * Generates video scripts based on selected clips, project context, and school settings.
 * Loads active AIPromptTemplates for video_script_generator; falls back to hardcoded default.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id } = await req.json();

    if (!project_id) {
      return Response.json({ error: 'Missing project_id' }, { status: 400 });
    }

    const allProjects = await base44.asServiceRole.entities.SchoolVideoProjects.list();
    const project = allProjects.find(p => p.id === project_id);
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const school_slug = project.school || '';

    const [settingsArr, clips, brandingArr, template] = await Promise.all([
      base44.asServiceRole.entities.SchoolSettings.filter({ school_slug }),
      base44.asServiceRole.entities.SchoolVideoClips.filter({ project_id, is_selected: true }),
      base44.asServiceRole.entities.SchoolBranding.filter({ school_slug }),
      resolveTemplate(base44, school_slug, 'video_script_generator'),
    ]);

    const settings = {
      ai_tone_default: 'warm',
      voiceover_enabled_default: true,
      captions_enabled_default: true,
      video_duration_target: '2-3 minutes',
      ...(settingsArr[0] || {}),
    };
    const branding = brandingArr[0] || null;

    const clipContext = clips
      .sort((a, b) => (a.recommended_order || 0) - (b.recommended_order || 0))
      .map(c => ({
        title: c.clip_title,
        transcript: c.transcript || c.scene_description,
        tone: c.emotional_tone,
        activity: c.detected_activity,
      }));

    const vars = {
      project_title: project.title,
      project_type: project.project_type,
      activity_type: project.activity_type || 'general',
      event_name: project.event_name || 'school activities',
      tone: project.tone || settings.ai_tone_default,
      duration_target: project.duration_target || settings.video_duration_target,
      target_audience: project.target_audience || 'students, parents, and community',
      objective: project.objective || '',
      school_name: branding?.school_name || 'School',
      network_name: branding?.network_name || '',
      intro_text: branding?.intro_text || '',
      clips_summary: clipContext.map((c, i) => `${i + 1}. "${c.title}" - ${c.transcript}`).join('\n'),
    };

    let finalPrompt;
    if (template?.user_prompt_template) {
      finalPrompt = interpolate(template.user_prompt_template, vars);
    } else {
      finalPrompt = FALLBACK_PROMPT(project, clipContext, branding, settings);
    }

    const script = await base44.integrations.Core.InvokeLLM({
      prompt: finalPrompt,
      ...(template?.system_prompt ? { system_prompt: template.system_prompt } : {}),
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
          call_to_action: { type: 'string' },
        },
      },
    });

    // Increment template usage_count
    if (template?.id) {
      await base44.asServiceRole.entities.AIPromptTemplates.update(template.id, {
        usage_count: (template.usage_count || 0) + 1,
      });
    }

    const scriptRecord = await base44.asServiceRole.entities.SchoolVideoScripts.create({
      school_slug,
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
      generation_status: 'generated',
      prompt_template_id: template?.id || null,
    });

    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'script_generated',
      ai_story_summary: script.story_summary,
      generated_title: project.generated_title || project.title,
      generated_description: project.generated_description || project.description,
    });

    return Response.json({ success: true, script: scriptRecord, template_used: template?.id || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});