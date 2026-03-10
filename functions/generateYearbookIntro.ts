import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      school_slug,
      season_or_category, // e.g., "Fall 2025", "Sports", "Academics"
      summary_notes, // staff notes about what to include
      yearbook_page_id, // optional - link to page directly
    } = await req.json();

    if (!school_slug || !season_or_category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check school settings — respect enable_ai_tools and inject tone default
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug });
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

    // Create AI job for yearbook blurb, passing settings-derived tone and word count
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      school_slug,
      job_type: 'yearbook_generation',
      source_entity_type: 'YearbookPages',
      source_entity_id: yearbook_page_id || null,
      status: 'pending',
      input_data: JSON.stringify({
        school_name: school_slug,
        season_or_category,
        summary_notes: summary_notes || '',
        tone: settings.ai_tone_default,
        word_count_min: settings.ai_story_word_count_min,
        word_count_max: settings.ai_story_word_count_max,
      }),
      requested_by: user.email,
    });

    return Response.json({
      success: true,
      job_id: job.id,
      tone_used: settings.ai_tone_default,
      yearbook_intro_pending: true,
    });
  } catch (error) {
    console.error('Generate yearbook intro error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});