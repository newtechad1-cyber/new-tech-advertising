import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Render Orchestration Service
 * Manages video rendering pipeline:
 * - Queue management
 * - Job prioritization
 * - Integration with FFmpeg, Pika, Runway, etc.
 * - Status tracking and error handling
 * - Output format optimization
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { project_id, render_config } = await req.json();

    if (!project_id) {
      return Response.json({ error: 'Missing project_id' }, { status: 400 });
    }

    // Fetch project and script
    const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
      .then(all => all.find(p => p.id === project_id));

    const script = await base44.asServiceRole.entities.SchoolVideoScripts.filter({
      project_id,
      approved_version: true
    }).then(all => all[0] || all[0]);

    if (!project || !script) {
      return Response.json({ error: 'Project or script not found' }, { status: 404 });
    }

    // Fetch school settings for render defaults
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug: project.school || '' });
    const settings = {
      video_format_default: 'landscape',
      video_resolution_default: '1920x1080',
      video_duration_target: '2-3 minutes',
      ...(settingsArr[0] || {})
    };
    const aspectRatioMap = { landscape: '16:9', square: '1:1', vertical: '9:16' };

    // Create render job record
    const renderJob = await base44.asServiceRole.entities.SchoolVideoRenders.create({
      project_id,
      script_id: script.id,
      render_name: `${project.title} - ${new Date().toISOString().split('T')[0]}`,
      render_engine: render_config?.engine || 'internal',
      output_format: render_config?.format || 'mp4',
      resolution: render_config?.resolution || settings.video_resolution_default,
      aspect_ratio: render_config?.aspect_ratio || aspectRatioMap[settings.video_format_default] || '16:9',
      estimated_duration: project.duration_target || settings.video_duration_target,
      status: 'queued',
      queue_position: 999 // Will be reordered by priority system
    });

    // Reorder queue based on project priority
    const allRenders = await base44.asServiceRole.entities.SchoolVideoRenders.filter({
      status: 'queued'
    });

    const priorityMap = { high: 1, normal: 2, low: 3 };
    const projectPriority = priorityMap[project.priority] || 2;

    let queuePosition = 0;
    for (const render of allRenders) {
      const renderProject = await base44.asServiceRole.entities.SchoolVideoProjects.list()
        .then(all => all.find(p => p.id === render.project_id));
      const renderPriority = priorityMap[renderProject?.priority] || 2;

      if (renderPriority < projectPriority || (renderPriority === projectPriority && render.created_date < renderJob.created_date)) {
        queuePosition++;
      }
    }

    // Update render job with correct queue position
    await base44.asServiceRole.entities.SchoolVideoRenders.update(renderJob.id, {
      queue_position: queuePosition,
      status: 'preparing'
    });

    // Update project status
    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      status: 'queued_for_render'
    });

    return Response.json({
      success: true,
      render_job: renderJob,
      queue_position: queuePosition,
      estimated_wait_time: `${Math.ceil(queuePosition * 5)} minutes`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});