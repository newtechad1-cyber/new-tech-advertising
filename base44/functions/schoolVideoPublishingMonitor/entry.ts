import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Publishing Monitor Service
 * Tracks publishing job progress across platforms
 * Updates project publish_status based on platform outcomes
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { publish_job_id, status, destination_url, error_message } = await req.json();

    if (!publish_job_id) {
      return Response.json({ error: 'Missing publish_job_id' }, { status: 400 });
    }

    // Fetch publish job
    const publishJob = await base44.asServiceRole.entities.SchoolVideoPublishing.list()
      .then(all => all.find(p => p.id === publish_job_id));

    if (!publishJob) {
      return Response.json({ error: 'Publishing job not found' }, { status: 404 });
    }

    // Update publish job
    const updateData = {
      destination_status: status || publishJob.destination_status
    };

    if (status === 'published' && destination_url) {
      updateData.destination_url = destination_url;
      updateData.published_at = new Date().toISOString();
    }

    if (status === 'failed' && error_message) {
      updateData.error_log = error_message;
    }

    await base44.asServiceRole.entities.SchoolVideoPublishing.update(publish_job_id, updateData);

    // Fetch all publishing jobs for this project to determine overall status
    const allPublishJobs = await base44.asServiceRole.entities.SchoolVideoPublishing.filter({
      project_id: publishJob.project_id
    });

    const jobStatuses = allPublishJobs.map(j => j.destination_status);
    let projectPublishStatus = 'partial';

    if (jobStatuses.every(s => s === 'published')) {
      projectPublishStatus = 'published';
    } else if (jobStatuses.every(s => s === 'failed')) {
      projectPublishStatus = 'failed';
    } else if (jobStatuses.some(s => s === 'published')) {
      projectPublishStatus = 'partial';
    } else if (jobStatuses.every(s => s === 'queued' || s === 'publishing')) {
      projectPublishStatus = 'queued';
    }

    // Update project with overall publish status
    await base44.asServiceRole.entities.SchoolVideoProjects.update(publishJob.project_id, {
      publish_status: projectPublishStatus,
      status: projectPublishStatus === 'published' ? 'published' : 'review_ready'
    });

    console.log(`[Publishing Monitor] Updated project ${publishJob.project_id} publish status to ${projectPublishStatus}`);

    return Response.json({
      success: true,
      publish_job_updated: publish_job_id,
      project_publish_status: projectPublishStatus
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});