import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Render Monitor Service
 * Monitors render job progress and updates project status
 * Can be triggered via webhook from render engine (FFmpeg, Pika, etc.)
 * Or run as a scheduled job to check status
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, status, progress, output_url, error_message } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    // Fetch render job
    const renderJob = await base44.asServiceRole.entities.SchoolVideoRenders.list()
      .then(all => all.find(r => r.id === render_job_id));

    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    // Update render job with status
    const updateData = {
      status: status || renderJob.status
    };

    if (status === 'completed' && output_url) {
      updateData.output_url = output_url;
      updateData.render_end = new Date().toISOString();
    }

    if (status === 'failed' && error_message) {
      updateData.error_log = error_message;
      updateData.retry_count = (renderJob.retry_count || 0) + 1;
    }

    await base44.asServiceRole.entities.SchoolVideoRenders.update(render_job_id, updateData);

    // If render completed successfully, update project
    if (status === 'completed' && output_url) {
      const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
        .then(all => all.find(p => p.id === renderJob.project_id));

      if (project) {
        await base44.asServiceRole.entities.SchoolVideoProjects.update(project.id, {
          status: 'review_ready',
          public_video_url: output_url
        });

        console.log(`[Render Monitor] Render completed for project: ${project.id}`);
      }
    }

    // If render failed and retries available, requeue
    if (status === 'failed' && renderJob.retry_count < 3) {
      console.log(`[Render Monitor] Retrying render job (attempt ${renderJob.retry_count + 1})`);

      await base44.asServiceRole.entities.SchoolVideoRenders.update(render_job_id, {
        status: 'queued'
      });
    }

    return Response.json({
      success: true,
      render_job_updated: render_job_id,
      new_status: updateData.status
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});