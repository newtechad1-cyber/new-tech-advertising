import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// ── Template resolution ──────────────────────────────────────────────────────
async function resolveTemplate(base44, school_slug, template_type) {
  if (!school_slug || !template_type) return null;
  const results = await base44.asServiceRole.entities.AIPromptTemplates.filter({
    school_slug,
    template_type,
    is_active: true,
  });
  return results[0] || null;
}

// Map AIContentJob job_type → AIPromptTemplates template_type
const JOB_TYPE_TO_TEMPLATE_TYPE = {
  story_generation:    'story_generator',
  yearbook_generation: 'yearbook_blurb_generator',
  event_recap:         'event_summary_generator',
  spotlight_summary:   'spotlight_summary',
  video_script:        'video_script_generator',
  caption_generation:  'caption_generator',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { submissionId, jobType, schoolSlug } = await req.json();

    if (!submissionId || !jobType || !schoolSlug) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Resolve matching template for this job type and school
    const templateType = JOB_TYPE_TO_TEMPLATE_TYPE[jobType] || null;
    const [submissions, template] = await Promise.all([
      base44.asServiceRole.entities.StudentVideoSubmissions.filter({ id: submissionId }),
      resolveTemplate(base44, schoolSlug, templateType),
    ]);

    if (submissions.length === 0) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }
    const submission = submissions[0];

    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      school_slug: schoolSlug,
      job_type: jobType,
      status: 'pending',
      source_entity_type: 'StudentVideoSubmissions',
      source_entity_id: submissionId,
      prompt_template_id: template?.id || null,   // resolved template stored on job
      requested_by: 'admin',
      requested_at: new Date().toISOString(),
      input_data: JSON.stringify({
        submissionTitle: submission.submission_title,
        description: submission.description,
        activityType: submission.activity_type,
        mediaCount: submission.media_urls ? JSON.parse(submission.media_urls).length : 0,
      }),
    });

    return Response.json({
      success: true,
      jobId: job.id,
      message: `${jobType.replace(/_/g, ' ')} job created and queued`,
      template_used: template?.id || null,
    });
  } catch (error) {
    console.error('Error creating AI job:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});