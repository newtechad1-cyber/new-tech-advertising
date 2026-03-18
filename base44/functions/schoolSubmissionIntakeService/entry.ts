import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * SubmissionIntakeService
 * Validates and ingests raw submission into render pipeline
 * Creates initial render job and input manifest
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id, submission_id } = await req.json();

    if (!project_id || !submission_id) {
      return Response.json({ error: 'Missing project_id or submission_id' }, { status: 400 });
    }

    const project = await base44.entities.SchoolVideoProjects.get(project_id);
    const submission = await base44.entities.SchoolSubmissions.get(submission_id);

    if (!project || !submission) {
      return Response.json({ error: 'Project or submission not found' }, { status: 404 });
    }

    // Parse video files from submission
    const videoFiles = submission.video_files ? JSON.parse(submission.video_files) : [];
    const photoFiles = submission.photo_files ? JSON.parse(submission.photo_files) : [];

    // Create input manifest
    const inputManifest = {
      submission_id,
      source_type: submission.upload_type,
      timestamp: new Date().toISOString(),
      assets: [
        ...videoFiles.map(url => ({ type: 'video', url, status: 'pending_normalization' })),
        ...photoFiles.map(url => ({ type: 'photo', url, status: 'pending_normalization' }))
      ],
      metadata: {
        event_name: submission.event_name,
        team_or_group: submission.team_or_group,
        description: submission.description,
        activity_type: submission.activity_type
      }
    };

    // Create render job
    const renderJob = await base44.entities.SchoolVideoRenderJobs.create({
      project_id,
      status: 'intake',
      render_profile: project.project_type || 'custom',
      input_manifest: JSON.stringify(inputManifest),
      stage: `Intake started at ${new Date().toISOString()}`,
      processing_log: JSON.stringify([
        { event: 'intake_started', timestamp: new Date().toISOString() }
      ]),
      started_at: new Date().toISOString()
    });

    // Update project with render job reference
    await base44.entities.SchoolVideoProjects.update(project_id, {
      status: 'collecting_assets'
    });

    console.log(`[SubmissionIntakeService] Render job ${renderJob.id} created for project ${project_id}`);

    return Response.json({
      success: true,
      render_job_id: renderJob.id,
      input_manifest: inputManifest,
      status: 'intake'
    });

  } catch (error) {
    console.error('[SubmissionIntakeService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});