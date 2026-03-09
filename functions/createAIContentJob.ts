import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { submissionId, jobType, schoolSlug } = await req.json();

    if (!submissionId || !jobType || !schoolSlug) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Verify submission exists
    const submissions = await base44.asServiceRole.entities.StudentVideoSubmissions.filter({
      id: submissionId,
    });

    if (submissions.length === 0) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = submissions[0];

    // Create AI content job
    const job = await base44.asServiceRole.entities.AIContentJobs.create({
      school_slug: schoolSlug,
      job_type: jobType,
      status: 'pending',
      source_entity_type: 'StudentVideoSubmissions',
      source_entity_id: submissionId,
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
    });
  } catch (error) {
    console.error('Error creating AI job:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});