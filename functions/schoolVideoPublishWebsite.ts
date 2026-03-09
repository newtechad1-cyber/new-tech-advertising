import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Website Publishing Service
 * Creates downloadable/embeddable video links for school website
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { publish_job_id, project_id, video_url, title, description } = await req.json();

    if (!publish_job_id || !project_id || !video_url) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // In production, this would:
    // 1. Generate download link with watermark
    // 2. Create embed code for website
    // 3. Generate metadata for SEO
    // 4. Store in CDN with caching headers

    const downloadLink = `https://bulldog.tv/download/${project_id}/video.mp4`;
    const embedCode = `<iframe src="https://bulldog.tv/embed/${project_id}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
    const websiteUrl = `https://bulldog.tv/videos/${project_id}`;

    // Update publish job
    await base44.asServiceRole.entities.SchoolVideoPublishing.update(publish_job_id, {
      destination_status: 'published',
      destination_url: websiteUrl,
      published_at: new Date().toISOString()
    });

    return Response.json({
      success: true,
      website_url: websiteUrl,
      download_link: downloadLink,
      embed_code: embedCode
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});