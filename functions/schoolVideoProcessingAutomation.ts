import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Video Processing Automation
 * Event-driven workflow that orchestrates the entire video pipeline
 * Triggered by SchoolSubmissions and SchoolVideoProjects entity changes
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event } = await req.json();

    // SUBMISSION WORKFLOW
    if (event.entity_name === 'SchoolSubmissions' && event.type === 'update') {
      const submission = await base44.asServiceRole.entities.SchoolSubmissions.list()
        .then(all => all.find(s => s.id === event.entity_id));

      if (!submission) return Response.json({ error: 'Submission not found' }, { status: 404 });

      // When submission is approved, ingest clips for analysis
      if (submission.status === 'approved') {
        // MODERATION SAFETY CHECK: Block ingestion if submission is flagged/requires_review/rejected
        if (submission.moderation_status === 'flagged' || submission.moderation_status === 'requires_review' || submission.status === 'rejected') {
          console.error(`[MODERATION_BLOCK] Cannot ingest submission ${submission.id}: moderation_status='${submission.moderation_status}', status='${submission.status}'`);
          return Response.json({ 
            error: `Submission blocked by moderation`,
            submission_id: submission.id,
            moderation_status: submission.moderation_status,
            reason: 'Must be marked safe before clip ingestion'
          }, { status: 403 });
        }
        
        console.log(`[Automation] Ingesting clips from approved submission: ${submission.id}`);
        
        await base44.asServiceRole.functions.invoke('schoolVideoClipIngestion', {
          submission_id: submission.id,
          submission: submission
        });

        // Update submission to processing
        await base44.asServiceRole.entities.SchoolSubmissions.update(submission.id, {
          status: 'processing'
        });
      }
    }

    // PROJECT WORKFLOW
    if (event.entity_name === 'SchoolVideoProjects' && event.type === 'update') {
      const project = await base44.asServiceRole.entities.SchoolVideoProjects.list()
        .then(all => all.find(p => p.id === event.entity_id));

      if (!project) return Response.json({ error: 'Project not found' }, { status: 404 });

      // When project status changes to ready_for_ai, generate script
      if (project.status === 'ready_for_ai') {
        console.log(`[Automation] Generating script for project: ${project.id}`);

        await base44.asServiceRole.functions.invoke('schoolVideoScriptGeneration', {
          project_id: project.id
        });

        // Generate captions
        const scripts = await base44.asServiceRole.entities.SchoolVideoScripts.filter({
          project_id: project.id
        });

        if (scripts.length > 0) {
          await base44.asServiceRole.functions.invoke('schoolVideoCaptionGeneration', {
            script_id: scripts[0].id,
            project_id: project.id
          });
        }

        // Select music
        await base44.asServiceRole.functions.invoke('schoolVideoMusicSelection', {
          project_id: project.id
        });
      }

      // When project status changes to queued_for_render, orchestrate render job
      if (project.status === 'queued_for_render') {
        console.log(`[Automation] Orchestrating render job for project: ${project.id}`);

        await base44.asServiceRole.functions.invoke('schoolVideoRenderOrchestration', {
          project_id: project.id,
          render_config: {
            engine: 'internal',
            format: 'mp4',
            resolution: '1920x1080',
            aspect_ratio: project.format_type === 'landscape' ? '16:9' : project.format_type === 'square' ? '1:1' : '9:16'
          }
        });
      }

      // When project is approved, queue publishing
      if (project.status === 'approved') {
        console.log(`[Automation] Queueing publishing for project: ${project.id}`);

        const publish_targets = [];
        if (project.publish_to_gallery) publish_targets.push({ platform: 'gallery' });
        if (project.publish_to_youtube) publish_targets.push({ platform: 'youtube' });
        if (project.publish_to_facebook) publish_targets.push({ platform: 'facebook' });
        if (project.publish_to_instagram) publish_targets.push({ platform: 'instagram' });

        if (publish_targets.length > 0) {
          await base44.asServiceRole.functions.invoke('schoolVideoPublishingOrchestration', {
            project_id: project.id,
            publish_targets: publish_targets
          });
        }
      }
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('[Automation Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});