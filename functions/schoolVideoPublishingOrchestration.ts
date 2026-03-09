import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { publishingJobId, destinationUrl, destinationId } = await req.json();

    if (!publishingJobId) {
      return Response.json({ error: 'Missing publishingJobId' }, { status: 400 });
    }

    const jobs = await base44.asServiceRole.entities.VideoPublishingJobs.filter({
      id: publishingJobId,
    });

    if (jobs.length === 0) {
      return Response.json({ error: 'Publishing job not found' }, { status: 404 });
    }

    const job = jobs[0];

    // Update publishing job status
    await base44.asServiceRole.entities.VideoPublishingJobs.update(publishingJobId, {
      destination_status: 'published',
      destination_url: destinationUrl,
      destination_id: destinationId,
      published_at: new Date().toISOString(),
    });

    // Update project visibility if Bulldog TV publish
    if (job.destination === 'bulldog_tv') {
      const projects = await base44.asServiceRole.entities.VideoProjects.filter({
        id: job.project_id,
      });

      if (projects.length > 0) {
        const project = projects[0];
        await base44.asServiceRole.entities.VideoProjects.update(job.project_id, {
          status: 'published',
          publish_status: 'published',
          published_date: new Date().toISOString(),
          public_video_url: destinationUrl || project.public_video_url,
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Publishing job completed',
      jobId: publishingJobId,
      destination: job.destination,
    });
  } catch (error) {
    console.error('Error processing publishing:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});