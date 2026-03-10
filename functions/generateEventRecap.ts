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

    const { school_slug, submission_ids, event_name, activity_type } = await req.json();

    if (!school_slug || !submission_ids || !event_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch submissions and active event summary template in parallel
    const [submissions, template, settingsArr] = await Promise.all([
      base44.asServiceRole.entities.SchoolSubmissions.filter({ id: { $in: submission_ids } }),
      resolveTemplate(base44, school_slug, 'event_summary_generator'),
      base44.asServiceRole.entities.SchoolSettings.filter({ school_slug }),
    ]);

    if (!submissions || submissions.length === 0) {
      return Response.json({ error: 'No submissions found' }, { status: 404 });
    }

    const settings = {
      enable_ai_tools: true,
      ai_tone_default: 'warm',
      ...(settingsArr[0] || {}),
    };
    if (!settings.enable_ai_tools) {
      return Response.json({ error: 'AI tools are disabled for this school' }, { status: 403 });
    }

    const submissionSummaries = submissions
      .map(s => `${s.contributor_name}: ${s.description || 'No description'}`)
      .join('\n\n');

    // Create AIContentJob with correct field names and resolved template_id
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      school_slug,
      job_type: 'event_recap',                  // matches entity enum
      source_entity_type: 'SchoolSubmissions',
      source_entity_id: submission_ids[0],       // primary source
      status: 'pending',
      prompt_template_id: template?.id || null,  // resolved template stored on job
      input_data: JSON.stringify({               // correct field name
        school_slug,
        event_name,
        activity_type: activity_type || 'Event',
        submission_summaries: submissionSummaries,
        tone: settings.ai_tone_default,
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
      submission_count: submissions.length,
      event_recap_pending: true,
      template_used: template?.id || null,
    });
  } catch (error) {
    console.error('Generate event recap error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});