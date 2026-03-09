import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * HighlightScoringService
 * Scores clips for highlight potential based on multiple factors
 * Returns ranked list for story architecture
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

    const inputManifest = JSON.parse(renderJob.input_manifest);

    // Get render profile for weighting
    const profile = await base44.entities.SchoolRenderProfiles.get(
      renderJob.render_profile
    ).catch(() => null);

    const highlightWeight = profile?.highlight_scoring_weight || 0.5;

    // Score each clip
    const scoredAssets = inputManifest.assets.map(asset => {
      if (asset.analysis) {
        const score =
          (asset.analysis.quality_score || 0) * 0.4 +
          (asset.analysis.energy_level || 0) * highlightWeight * 0.6;

        return {
          ...asset,
          highlight_score: Math.round(score),
          scored_at: new Date().toISOString()
        };
      }
      return asset;
    });

    // Sort by score
    const ranked = [...scoredAssets].sort((a, b) => (b.highlight_score || 0) - (a.highlight_score || 0));

    const updatedManifest = {
      ...inputManifest,
      assets: scoredAssets,
      ranked_by_highlight: ranked
    };

    await base44.entities.SchoolVideoRenderJobs.update(render_job_id, {
      input_manifest: JSON.stringify(updatedManifest),
      stage: `Highlights scored at ${new Date().toISOString()}`
    });

    console.log(`[HighlightScoringService] Scored ${ranked.length} clips for job ${render_job_id}`);

    return Response.json({
      success: true,
      ranked_clips: ranked.slice(0, 5).map(c => ({ url: c.url, score: c.highlight_score }))
    });

  } catch (error) {
    console.error('[HighlightScoringService] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});