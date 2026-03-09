import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { projectId, renderJobId, videoUrl, schoolSlug } = await req.json();

    if (!projectId || !renderJobId || !videoUrl) {
      return Response.json({
        error: 'Missing required fields: projectId, renderJobId, videoUrl',
      }, { status: 400 });
    }

    // Fetch project for metadata
    const projects = await base44.asServiceRole.entities.VideoProjects.filter({
      id: projectId,
    });

    if (projects.length === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projects[0];

    // Create publishing jobs for each enabled destination
    const destinations = [];

    if (project.publish_to_gallery) {
      destinations.push('bulldog_tv');
    }
    if (project.publish_to_youtube) {
      destinations.push('youtube');
    }
    if (project.publish_to_facebook) {
      destinations.push('facebook');
    }
    if (project.publish_to_instagram) {
      destinations.push('instagram');
    }

    const publishingJobs = [];

    for (const destination of destinations) {
      const job = await base44.asServiceRole.entities.VideoPublishingJobs.create({
        school_slug: schoolSlug || project.school_slug,
        project_id: projectId,
        render_job_id: renderJobId,
        video_url: videoUrl,
        destination,
        destination_status: 'queued',
        video_title: project.title,
        video_description: project.description,
        visibility: project.visibility || 'public',
      });
      publishingJobs.push(job);
    }

    // Update project status
    await base44.asServiceRole.entities.VideoProjects.update(projectId, {
      status: 'review_ready',
      publish_status: 'queued',
    });

    return Response.json({
      success: true,
      message: `Created ${publishingJobs.length} publishing jobs`,
      destinations,
      jobs: publishingJobs,
    });
  } catch (error) {
    console.error('Error dispatching publishing jobs:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});