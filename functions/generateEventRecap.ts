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
      submission_ids, // array of SchoolSubmissions IDs
      event_name,
      activity_type,
    } = await req.json();

    if (!school_slug || !submission_ids || !event_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch submissions
    const submissions = await base44.asServiceRole.entities.SchoolSubmissions.filter({
      id: { $in: submission_ids },
    });

    if (!submissions || submissions.length === 0) {
      return Response.json({ error: 'No submissions found' }, { status: 404 });
    }

    // Build submission summaries
    const summaries = submissions
      .map((s) => `${s.contributor_name}: ${s.description}`)
      .join('\n\n');

    // Create AI job for event summary
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      job_type: 'summarize_event',
      source_entity_type: 'SchoolSubmissions',
      status: 'queued',
      prompt_template_id: 'event-summary-gen',
      input_payload_json: JSON.stringify({
        school_name: school_slug,
        event_name,
        activity_type: activity_type || 'Event',
        submission_summaries: summaries,
      }),
    });

    return Response.json({
      success: true,
      job_id: job.id,
      submission_count: submissions.length,
      event_recap_pending: true,
    });
  } catch (error) {
    console.error('Generate event recap error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});