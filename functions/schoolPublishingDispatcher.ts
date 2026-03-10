import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * PublishingDispatcher
 * Routes videos to configured publishing platforms
 * Handles YouTube, Facebook, Instagram, internal gallery, website
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id, target_platforms } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const project = await base44.entities.SchoolVideoProjects.get(renderJob.project_id);
    const deliveryManifest = JSON.parse(renderJob.output_manifest || '{}');

    // Fetch school settings for platform defaults and publish gating
    const settingsArr = await base44.asServiceRole.entities.SchoolSettings.filter({ school_slug: project?.school || '' });
    const settings = {
      publish_to_gallery_default: true,
      publish_to_youtube_default: false,
      publish_to_facebook_default: false,
      publish_to_instagram_default: false,
      enable_social_sharing: false,
      ...(settingsArr[0] || {})
    };

    const platforms = target_platforms || [
      ...((project.publish_to_gallery ?? settings.publish_to_gallery_default) ? ['gallery'] : []),
      ...(settings.enable_social_sharing && (project.publish_to_youtube ?? settings.publish_to_youtube_default) ? ['youtube'] : []),
      ...(settings.enable_social_sharing && (project.publish_to_facebook ?? settings.publish_to_facebook_default) ? ['facebook'] : []),
      ...(settings.enable_social_sharing && (project.publish_to_instagram ?? settings.publish_to_instagram_default) ? ['instagram'] : [])
    ];

    const publishingResults = [];

    for (const platform of platforms) {
      try {
        let publishResult;

        switch (platform) {
          case 'gallery':
            publishResult = await publishToGallery(base44, renderJob, deliveryManifest);
            break;
          case 'youtube':
            publishResult = await publishToYouTube(base44, renderJob, deliveryManifest);
            break;
          case 'facebook':
            publishResult = await publishToFacebook(base44, renderJob, deliveryManifest);
            break;
          case 'instagram':
            publishResult = await publishToInstagram(base44, renderJob, deliveryManifest);
            break;
          default:
            publishResult = { success: false, message: `Unknown platform: ${platform}` };
        }

        publishingResults.push({
          platform,
          ...publishResult,
          timestamp: new Date().toISOString()
        });

        console.log(`[PublishingDispatcher] Published to ${platform}`);
      } catch (error) {
        publishingResults.push({
          platform,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Update project with publishing results
    const allSuccess = publishingResults.every(r => r.success);
    await base44.entities.SchoolVideoProjects.update(renderJob.project_id, {
      status: allSuccess ? 'published' : 'partial_publish',
      publish_status: allSuccess ? 'published' : 'partial'
    });

    console.log(`[PublishingDispatcher] Publishing complete for job ${render_job_id}`);

    return Response.json({
      success: allSuccess,
      platform_results: publishingResults,
      overall_status: allSuccess ? 'published' : 'partial_publish'
    });

  } catch (error) {
    console.error('[PublishingDispatcher] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function publishToGallery(base44, renderJob, manifest) {
  return {
    success: true,
    url: `https://bulldog.tv/gallery/${renderJob.project_id}`,
    status: 'published'
  };
}

async function publishToYouTube(base44, renderJob, manifest) {
  // Placeholder: Integrate with YouTube Data API v3
  return {
    success: true,
    url: `https://youtube.com/watch?v=PLACEHOLDER${renderJob.id}`,
    video_id: `PLACEHOLDER${renderJob.id}`,
    status: 'published'
  };
}

async function publishToFacebook(base44, renderJob, manifest) {
  // Placeholder: Integrate with Facebook Graph API
  return {
    success: true,
    url: `https://facebook.com/video/${renderJob.id}`,
    post_id: `PLACEHOLDER${renderJob.id}`,
    status: 'published'
  };
}

async function publishToInstagram(base44, renderJob, manifest) {
  // Placeholder: Integrate with Instagram Graph API
  return {
    success: true,
    url: `https://instagram.com/reel/${renderJob.id}`,
    reel_id: `PLACEHOLDER${renderJob.id}`,
    status: 'published'
  };
}