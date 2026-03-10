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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { school_slug, season_or_category, summary_notes, yearbook_page_id } = await req.json();

    if (!school_slug || !season_or_category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch school settings and active yearbook blurb template in parallel
    const [settingsArr, template] = await Promise.all([
      base44.asServiceRole.entities.SchoolSettings.filter({ school_slug }),
      resolveTemplate(base44, school_slug, 'yearbook_blurb_generator'),
    ]);

    const settings = {
      enable_ai_tools: true,
      ai_tone_default: 'warm',
      ai_story_word_count_min: 120,
      ai_story_word_count_max: 200,
      ...(settingsArr[0] || {}),
    };

    if (!settings.enable_ai_tools) {
      return Response.json({ error: 'AI tools are disabled for this school' }, { status: 403 });
    }

    // Create AIContentJob with resolved template_id so the downstream processor can use it
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      school_slug,
      job_type: 'yearbook_generation',
      source_entity_type: 'YearbookPages',
      source_entity_id: yearbook_page_id || null,
      status: 'pending',
      prompt_template_id: template?.id || null,   // stored so processor can apply school template
      input_data: JSON.stringify({
        school_slug,
        season_or_category,
        summary_notes: summary_notes || '',
        tone: settings.ai_tone_default,
        word_count_min: settings.ai_story_word_count_min,
        word_count_max: settings.ai_story_word_count_max,
      }),
      requested_by: user.email,
      requested_at: new Date().toISOString(),
    });

    // Increment template usage_count
    if (template?.id) {
      await base44.asServiceRole.entities.AIPromptTemplates.update(template.id, {
        usage_count: (template.usage_count || 0) + 1,
      });
    }

    return Response.json({
      success: true,
      job_id: job.id,
      tone_used: settings.ai_tone_default,
      yearbook_intro_pending: true,
      template_used: template?.id || null,
    });
  } catch (error) {
    console.error('Generate yearbook intro error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});