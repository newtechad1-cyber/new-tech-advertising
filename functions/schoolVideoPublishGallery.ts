import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Gallery Publishing Service
 * Publishes video to internal school gallery
 * Updates project public_video_url and gallery metadata
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { publish_job_id, project_id, video_url, title, description } = await req.json();

    if (!publish_job_id || !project_id || !video_url) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // In production, this would:
    // 1. Store video in cloud storage
    // 2. Generate gallery thumbnail
    // 3. Create gallery entry with metadata
    // 4. Update gallery index

    const galleryUrl = `https://bulldog.tv/gallery/${project_id}`;

    // Update publish job
    await base44.asServiceRole.entities.SchoolVideoPublishing.update(publish_job_id, {
      destination_status: 'published',
      destination_url: galleryUrl,
      published_at: new Date().toISOString()
    });

    // Update project
    await base44.asServiceRole.entities.SchoolVideoProjects.update(project_id, {
      publish_to_gallery: true,
      public_video_url: video_url,
      published_date: new Date().toISOString()
    });

    return Response.json({
      success: true,
      gallery_url: galleryUrl
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});