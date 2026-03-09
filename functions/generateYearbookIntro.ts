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

    // Create AI job for yearbook blurb
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      job_type: 'yearbook_blurb',
      source_entity_type: 'YearbookPages',
      source_entity_id: yearbook_page_id || null,
      status: 'queued',
      prompt_template_id: 'yearbook-blurb-gen',
      input_payload_json: JSON.stringify({
        school_name: school_slug,
        season_or_category,
        summary_notes: summary_notes || '',
      }),
    });

    return Response.json({
      success: true,
      job_id: job.id,
      yearbook_intro_pending: true,
    });
  } catch (error) {
    console.error('Generate yearbook intro error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});