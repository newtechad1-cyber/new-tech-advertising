import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * BrandingAssetService
 * Prepares branding elements (logo, watermark, intro/outro graphics)
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { render_job_id } = await req.json();

    if (!render_job_id) {
      return Response.json({ error: 'Missing render_job_id' }, { status: 400 });
    }

    const renderJob = await base44.entities.SchoolVideoRenderJobs.get(render_job_id);
    if (!renderJob) {
      return Response.json({ error: 'Render job not found' }, { status: 404 });
    }

    const project = await base44.entities.SchoolVideoProjects.get(renderJob.project_id);
    const branding = await base44.entities.SchoolBranding.list().then(items => items[0]);

    // Assemble branding assets
    const brandingAssets = {
      logo: {
        url: branding?.logo || '',
        position: 'top_right',
        scale: 0.15,
        opacity: 0.9,
        duration_seconds: 'full_video'
      },
      watermark: {
        url: branding?.logo || '',
        position: 'bottom_right',
        scale: 0.1,
        opacity: 0.5,
        duration_seconds: 'full_video'
      },
      intro_text: {
        text: branding?.network_name || 'School Video',
        duration_seconds: 3,
        font_size: 72,
        color: branding?.primary_color || '#1e3a5f',
        animation: 'fade_in_bounce'
      },
      outro_text: {
        text: branding?.outro_text || 'Thanks for watching',
        duration_seconds: 3,
        font_size: 48,
        color: branding?.secondary_color || '#f59e0b',
        animation: 'fade_out'
      },
      primary_color: branding?.primary_color || '#1e3a5f',
      secondary_color: branding?.secondary_color || '#f59e0b',
      accent_color: branding?.accent_color || '#ffffff'
    };

    const brandingConfig = {
      assets: brandingAssets,
      intro_enabled: true,
      outro_enabled: true,
      watermark_enabled: true,
      generated_at: new Date().toISOString()
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      branding_config: JSON.stringify(brandingConfig),
      stage: `Branding assets prepared at ${new Date().toISOString()}`
    });

    console.log(`[BrandingAssetService] Prepared branding assets for job ${render_job_id}`);

    return Response.json({
      success: true,
      branding_config: brandingConfig
    });

  } catch (error) {
    console.error('[BrandingAssetService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});