import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Generate success highlights from growth metrics
 * Called by admin to create proof points for sales
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const { organizationId, metricSnapshotId } = await req.json();

    if (!organizationId || !metricSnapshotId) {
      return Response.json(
        { error: 'organizationId and metricSnapshotId required' },
        { status: 400 }
      );
    }

    // Fetch the metric snapshot
    const snapshot = await base44.asServiceRole.entities.GrowthMetricsSnapshot.filter(
      { snapshotId: metricSnapshotId },
      '-snapshotDate',
      1
    );

    if (!snapshot || snapshot.length === 0) {
      return Response.json(
        { error: 'Metric snapshot not found' },
        { status: 404 }
      );
    }

    const metrics = snapshot[0];

    // Generate 1-3 highlights based on strongest metrics
    const highlights = generateHighlightsFromMetrics(metrics, organizationId);

    // Save highlights to database
    const savedHighlights = await Promise.all(
      highlights.map(h => 
        base44.asServiceRole.entities.SuccessHighlight.create({
          ...h,
          createdBy: user.email,
          createdAt: new Date().toISOString()
        })
      )
    );

    return Response.json({
      success: true,
      generated: savedHighlights.length,
      highlights: savedHighlights.map(h => ({
        id: h.highlightId,
        type: h.highlightType,
        summary: h.summaryText,
        label: h.highlightLabel
      }))
    });
  } catch (error) {
    console.error('Error generating sales proof:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

const generateHighlightsFromMetrics = (metrics, organizationId) => {
  const highlights = [];

  // Growth Score Highlight
  if (metrics.growthScore && metrics.growthScore > 70) {
    highlights.push({
      highlightId: crypto.randomUUID(),
      organizationId,
      highlightType: 'growth_milestone',
      summaryText: `Achieved ${metrics.growthScore}/100 growth score through consistent content execution and lead capture`,
      metricSnapshotId: metrics.snapshotId,
      metrics: JSON.stringify({
        growthScore: metrics.growthScore,
        period: 'Current'
      }),
      highlightLabel: `${metrics.growthScore}/100 Growth`,
      approvalStatus: 'pending_review',
      taggedForSales: false
    });
  }

  // Revenue/Deals Highlight
  if (metrics.dealsClosedCount && metrics.dealsClosedCount > 0) {
    const revenue = metrics.revenueAttributed || 0;
    highlights.push({
      highlightId: crypto.randomUUID(),
      organizationId,
      highlightType: 'revenue_result',
      summaryText: `Closed ${metrics.dealsClosedCount} revenue deal${metrics.dealsClosedCount > 1 ? 's' : ''} directly from marketing efforts`,
      metricSnapshotId: metrics.snapshotId,
      metrics: JSON.stringify({
        dealsClosedCount: metrics.dealsClosedCount,
        revenueAttributed: revenue
      }),
      highlightLabel: metrics.dealsClosedCount > 1 ? `${metrics.dealsClosedCount} Deals Won` : 'Deal Won',
      approvalStatus: 'pending_review',
      taggedForSales: false
    });
  }

  // Lead Breakthrough Highlight
  if (metrics.leadsLoggedCount && metrics.leadsLoggedCount > 8) {
    highlights.push({
      highlightId: crypto.randomUUID(),
      organizationId,
      highlightType: 'lead_breakthrough',
      summaryText: `Generated ${metrics.leadsLoggedCount} qualified leads through strategic content and visibility initiatives`,
      metricSnapshotId: metrics.snapshotId,
      metrics: JSON.stringify({
        leadsLoggedCount: metrics.leadsLoggedCount
      }),
      highlightLabel: `${metrics.leadsLoggedCount} Leads`,
      approvalStatus: 'pending_review',
      taggedForSales: false
    });
  }

  // Content Win Highlight
  if (metrics.contentPublishedCount && metrics.contentPublishedCount > 5) {
    highlights.push({
      highlightId: crypto.randomUUID(),
      organizationId,
      highlightType: 'content_win',
      summaryText: `Published ${metrics.contentPublishedCount} pieces of strategic content driving visibility and engagement`,
      metricSnapshotId: metrics.snapshotId,
      metrics: JSON.stringify({
        contentPublishedCount: metrics.contentPublishedCount,
        videosCreatedCount: metrics.videosCreatedCount || 0
      }),
      highlightLabel: `${metrics.contentPublishedCount} Content Pieces`,
      approvalStatus: 'pending_review',
      taggedForSales: false
    });
  }

  // Momentum Highlight (week-over-week growth)
  if (metrics.momentumScore && metrics.momentumScore > 70) {
    highlights.push({
      highlightId: crypto.randomUUID(),
      organizationId,
      highlightType: 'efficiency_gain',
      summaryText: `Achieved ${metrics.momentumScore}/100 momentum score with accelerating week-over-week growth`,
      metricSnapshotId: metrics.snapshotId,
      metrics: JSON.stringify({
        momentumScore: metrics.momentumScore
      }),
      highlightLabel: `${metrics.momentumScore}/100 Momentum`,
      approvalStatus: 'pending_review',
      taggedForSales: false
    });
  }

  return highlights.length > 0 ? highlights : [];
};