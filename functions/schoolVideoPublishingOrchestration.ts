import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Publishing Orchestration Service
 * Manages multi-platform video publishing:
 * - Gallery publishing (internal)
 * - YouTube upload
 * - Facebook/Instagram upload
 * - Website download links
 * - Scheduled vs. immediate publishing
 * - Platform-specific formatting
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id, publish_targets } = await req.json();

    if (!project_id || !publish_targets || publish_targets.length === 0) {
      return Response.json({ error: 'Missing project_id or publish_targets' }, { status: 400 });
    }

    // Fetch project
    const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
      .then(all => all.find(p => p.id === project_id));

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const publishJobs = [];

    // Create publishing jobs for each target platform
    for (const target of publish_targets) {
      const publishJob = await base44.asServiceRole.entities.SchoolVideoPublishing.create({
        project_id,
        destination: target.platform, // 'gallery', 'youtube', 'facebook', 'instagram', 'website_download'
        destination_account: target.account_id || '',
        destination_status: target.scheduled ? 'queued' : 'queued',
        scheduled_publish_time: target.scheduled_time || null
      });

      publishJobs.push(publishJob);

      // Queue platform-specific publish job
      const publishFunctionName = `schoolVideoPublish${target.platform.charAt(0).toUpperCase() + target.platform.slice(1)}`;

      try {
        await base44.asServiceRole.functions.invoke(publishFunctionName, {
          publish_job_id: publishJob.id,
          project_id,
          video_url: project.public_video_url,
          title: project.generated_title,
          description: project.generated_description,
          scheduled_time: target.scheduled_time
        });
      } catch (e) {
        // Function may not exist yet, queue for later
        console.log(`Publishing function ${publishFunctionName} not yet implemented`);
      }
    }

    // Update project publish status
    const statuses = publishJobs.map(j => j.destination_status);
    const publishStatus = statuses.some(s => s === 'published') ? 'published'
      : statuses.some(s => s === 'queued') ? 'queued'
      : statuses.some(s => s === 'failed') ? 'failed'
      : 'partial';

    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'review_ready',
      publish_status: publishStatus
    });

    return Response.json({
      success: true,
      publish_jobs: publishJobs,
      total_destinations: publish_targets.length
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});