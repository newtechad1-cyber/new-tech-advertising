import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Daily Unified Recommendation Refresh
 * Regenerates platform-wide and role-based recommendation bundles
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Regenerate all unified recommendations
    const result = await base44.functions.invoke('generateUnifiedRecommendations', {
      scope_type: 'platform-wide'
    });

    // Archive stale recommendations (no activity for 30+ days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const staleRecs = await base44.asServiceRole.entities.UnifiedRecommendations.filter({
      status: { $in: ['new', 'queued'] },
      updated_date: { $lt: thirtyDaysAgo.toISOString() }
    });

    for (const rec of staleRecs) {
      await base44.asServiceRole.entities.UnifiedRecommendations.update(rec.id, {
        status: 'expired'
      });
    }

    // Archive old bundles
    const oldBundles = await base44.asServiceRole.entities.RecommendationBundles.filter({
      status: 'active',
      created_date: { $lt: thirtyDaysAgo.toISOString() }
    });

    for (const bundle of oldBundles) {
      await base44.asServiceRole.entities.RecommendationBundles.update(bundle.id, {
        status: 'archived'
      });
    }

    return Response.json({
      status: 'success',
      refreshed: true,
      stale_archived: staleRecs.length,
      bundles_archived: oldBundles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});