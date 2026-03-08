import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { company_id, period_start, period_end } = payload;

    if (!company_id || !period_start || !period_end) {
      return Response.json({ error: 'Missing required parameters: company_id, period_start, period_end' }, { status: 400 });
    }

    // Check if report already exists for this period
    const existing = await base44.asServiceRole.entities.ExecutiveReports.filter({
      company_id,
      period_start,
      period_end
    });

    const reportId = existing.length > 0 ? existing[0].id : null;

    // Collect data from ReportingSnapshots for this period
    const snapshots = await base44.asServiceRole.entities.ReportingSnapshots.filter({
      company_id
    });

    const periodSnapshots = snapshots.filter(s => 
      new Date(s.period_start) >= new Date(period_start) && 
      new Date(s.period_end) <= new Date(period_end)
    );

    // Collect Deliverables for the period
    const allDeliverables = await base44.asServiceRole.entities.Deliverables.filter({
      company_id
    });

    const periodDeliverables = allDeliverables.filter(d =>
      d.published_date && 
      new Date(d.published_date) >= new Date(period_start) && 
      new Date(d.published_date) <= new Date(period_end)
    );

    // Collect FulfillmentTasks completed in period
    const allTasks = await base44.asServiceRole.entities.FulfillmentTasks.filter({
      company_id
    });

    const completedTasks = allTasks.filter(t =>
      t.status === 'completed' &&
      t.completed_date &&
      new Date(t.completed_date) >= new Date(period_start) &&
      new Date(t.completed_date) <= new Date(period_end)
    );

    // Collect ClientRequests in period
    const allRequests = await base44.asServiceRole.entities.ClientRequests.filter({
      company_id
    });

    const periodRequests = allRequests.filter(r =>
      new Date(r.created_date || Date.now()) >= new Date(period_start) &&
      new Date(r.created_date || Date.now()) <= new Date(period_end)
    );

    // Collect Leads for the period
    const allLeads = await base44.asServiceRole.entities.Lead.filter({
      company_id
    });

    const periodLeads = allLeads.filter(l =>
      new Date(l.created_date) >= new Date(period_start) &&
      new Date(l.created_date) <= new Date(period_end)
    );

    // Aggregate KPIs from snapshots
    const aggregatedKPIs = {
      leads_total: periodSnapshots.reduce((sum, s) => sum + (s.leads_total || 0), 0),
      calls_total: periodSnapshots.reduce((sum, s) => sum + (s.calls_total || 0), 0),
      traffic_total: periodSnapshots.reduce((sum, s) => sum + (s.traffic_total || 0), 0),
      ad_impressions_total: periodSnapshots.reduce((sum, s) => sum + (s.ad_impressions || 0), 0),
      ad_clicks_total: periodSnapshots.reduce((sum, s) => sum + (s.ad_clicks || 0), 0),
      videos_created: periodSnapshots.reduce((sum, s) => sum + (s.videos_created || 0), 0),
      posts_published: periodSnapshots.reduce((sum, s) => sum + (s.posts_published || 0), 0),
      pages_published: periodSnapshots.reduce((sum, s) => sum + (s.pages_published || 0), 0),
    };

    // Count deliverables by type
    const deliverablesByType = {};
    periodDeliverables.forEach(d => {
      deliverablesByType[d.deliverable_type] = (deliverablesByType[d.deliverable_type] || 0) + 1;
    });

    // Get previous period for comparison
    const prevPeriodStart = new Date(period_start);
    prevPeriodStart.setMonth(prevPeriodStart.getMonth() - 1);
    const prevPeriodEnd = new Date(period_start);
    prevPeriodEnd.setDate(prevPeriodEnd.getDate() - 1);

    const prevSnapshots = snapshots.filter(s =>
      new Date(s.period_start) >= prevPeriodStart &&
      new Date(s.period_end) <= prevPeriodEnd
    );

    const prevLeads = allLeads.filter(l =>
      new Date(l.created_date) >= prevPeriodStart &&
      new Date(l.created_date) <= prevPeriodEnd
    );

    // Calculate change percentages
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const prevLeadsCount = prevLeads.length;
    const prevTrafficTotal = prevSnapshots.reduce((sum, s) => sum + (s.traffic_total || 0), 0);

    const leads_change_percent = calculateChange(periodLeads.length, prevLeadsCount);
    const traffic_change_percent = calculateChange(aggregatedKPIs.traffic_total, prevTrafficTotal);

    // Generate narrative summaries
    const summaries = generateNarratives(
      aggregatedKPIs,
      periodDeliverables,
      periodRequests,
      periodLeads,
      deliverablesByType,
      leads_change_percent,
      traffic_change_percent
    );

    // Format period label
    const startDate = new Date(period_start);
    const endDate = new Date(period_end);
    const periodLabel = `${startDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;

    // Create or update ExecutiveReport
    const reportData = {
      company_id,
      report_title: `${periodLabel} Results`,
      report_period_label: periodLabel,
      period_start,
      period_end,
      status: 'draft',
      summary_headline: summaries.headline,
      executive_summary: summaries.executive_summary,
      wins_summary: summaries.wins_summary,
      opportunities_summary: summaries.opportunities_summary,
      next_steps_summary: summaries.next_steps_summary,
      generated_date: new Date().toISOString(),
      created_by_user_id: user.id,
      visible_to_client: false,
      leads_total: periodLeads.length,
      calls_total: aggregatedKPIs.calls_total,
      website_visits_total: aggregatedKPIs.traffic_total,
      ad_impressions_total: aggregatedKPIs.ad_impressions_total,
      ad_clicks_total: aggregatedKPIs.ad_clicks_total,
      videos_created_total: aggregatedKPIs.videos_created,
      posts_published_total: aggregatedKPIs.posts_published,
      pages_published_total: aggregatedKPIs.pages_published,
      leads_change_percent,
      traffic_change_percent,
    };

    let report;
    if (reportId) {
      report = await base44.asServiceRole.entities.ExecutiveReports.update(reportId, reportData);
    } else {
      report = await base44.asServiceRole.entities.ExecutiveReports.create(reportData);
    }

    // Create ResultHighlights
    const highlights = generateHighlights(
      company_id,
      report.id,
      aggregatedKPIs,
      periodDeliverables,
      periodLeads,
      leads_change_percent,
      traffic_change_percent,
      deliverablesByType,
      periodRequests
    );

    await base44.asServiceRole.entities.ResultHighlights.bulkCreate(highlights);

    // Create KPIHistory records for trend tracking
    const kpiHistoryRecords = generateKPIHistory(
      company_id,
      report.id,
      aggregatedKPIs,
      periodLabel,
      period_start,
      period_end
    );

    await base44.asServiceRole.entities.KPIHistory.bulkCreate(kpiHistoryRecords);

    return Response.json({
      success: true,
      report_id: report.id,
      status: 'draft',
      period: periodLabel,
      message: 'Executive report generated successfully'
    });

  } catch (error) {
    console.error('Error generating executive report:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateNarratives(kpis, deliverables, requests, leads, deliverablesByType, leadsChange, trafficChange) {
  const hasLeads = leads.length > 0;
  const hasDeliverables = deliverables.length > 0;
  const leadsPositive = leadsChange > 0;
  const trafficPositive = trafficChange > 0;

  // Headline
  const headlineElements = [];
  if (trafficPositive && trafficChange > 10) {
    headlineElements.push(`Website activity is trending up ${trafficChange}%`);
  } else if (leadsPositive && leadsChange > 10) {
    headlineElements.push(`Lead generation increased ${leadsChange}%`);
  } else if (hasDeliverables) {
    headlineElements.push(`Made solid progress with new content and updates`);
  } else {
    headlineElements.push(`Building momentum with ongoing work`);
  }
  const headline = headlineElements[0];

  // Executive summary
  let executive_summary = '';
  const summaryParts = [];

  if (hasDeliverables) {
    const counts = Object.entries(deliverablesByType)
      .map(([type, count]) => `${count} ${type.replace(/_/g, ' ')}`)
      .join(', ');
    summaryParts.push(`This period, we delivered ${counts}.`);
  }

  if (trafficPositive) {
    summaryParts.push(`Website activity grew by ${trafficChange}%, driven by the fresh content and pages we published.`);
  } else if (hasLeads) {
    summaryParts.push(`You received ${leads.length} new lead${leads.length !== 1 ? 's' : ''} this month.`);
  }

  if (kpis.posts_published > 0 || kpis.videos_created > 0) {
    const contentParts = [];
    if (kpis.posts_published > 0) contentParts.push(`${kpis.posts_published} social posts`);
    if (kpis.videos_created > 0) contentParts.push(`${kpis.videos_created} video${kpis.videos_created !== 1 ? 's' : ''}`);
    summaryParts.push(`Content output included ${contentParts.join(' and ')}.`);
  }

  executive_summary = summaryParts.join(' ');

  // Wins summary
  const wins = [];
  if (leadsPositive && leadsChange > 0) {
    wins.push(`• Lead generation increased by ${leadsChange}%`);
  }
  if (trafficPositive && trafficChange > 0) {
    wins.push(`• Website traffic grew by ${trafficChange}%`);
  }
  if (kpis.pages_published > 0) {
    wins.push(`• Published ${kpis.pages_published} new page${kpis.pages_published !== 1 ? 's' : ''} to improve organic visibility`);
  }
  if (kpis.posts_published > 0) {
    wins.push(`• Maintained consistent social presence with ${kpis.posts_published} posts published`);
  }
  if (kpis.videos_created > 0) {
    wins.push(`• Created ${kpis.videos_created} video asset${kpis.videos_created !== 1 ? 's' : ''} to boost engagement`);
  }
  if (wins.length === 0) {
    wins.push(`• Completed all planned deliverables on schedule`);
  }
  const wins_summary = wins.join('\n');

  // Opportunities summary
  const opportunities = [];
  if (!trafficPositive && trafficChange < 0) {
    opportunities.push(`• Website traffic declined ${Math.abs(trafficChange)}%. Next focus: optimize content for search and drive more referral traffic.`);
  } else if (trafficChange > 0 && kpis.calls_total < leads.length * 0.1) {
    opportunities.push(`• Traffic is growing but converting to calls at a low rate. Consider adding more prominent CTAs.`);
  }

  if (!leadsPositive && leadsChange < 0) {
    opportunities.push(`• Lead flow slowed slightly. Review which content or channels are driving best quality leads.`);
  }

  if (requests.filter(r => r.status === 'waiting_on_client').length > 0) {
    opportunities.push(`• Several client approvals are pending. Completing these will unblock next phase of work.`);
  }

  if (opportunities.length === 0) {
    opportunities.push(`• Continue the momentum with expanded content production next month.`);
    opportunities.push(`• Consider testing new social media formats or channels.`);
  }
  const opportunities_summary = opportunities.join('\n');

  // Next steps summary
  const nextSteps = [
    `• Monthly review call to discuss results and priorities`,
    `• Update content strategy based on top-performing topics`,
  ];
  if (requests.filter(r => r.status === 'new').length > 0) {
    nextSteps.push(`• Address ${requests.filter(r => r.status === 'new').length} pending client request${requests.filter(r => r.status === 'new').length !== 1 ? 's' : ''}`);
  }
  nextSteps.push(`• Plan next month's content calendar and campaigns`);

  const next_steps_summary = nextSteps.join('\n');

  return {
    headline,
    executive_summary,
    wins_summary,
    opportunities_summary,
    next_steps_summary
  };
}

function generateHighlights(companyId, reportId, kpis, deliverables, leads, leadsChange, trafficChange, deliverablesByType, requests) {
  const highlights = [];
  let sortOrder = 0;

  // Wins
  if (trafficChange > 10) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'trend',
      title: 'Website Traffic Growing',
      description: `Your website traffic increased by ${trafficChange}% this period.`,
      metric_value: `+${trafficChange}%`,
      comparison_text: 'vs previous month',
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  if (leadsChange > 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'win',
      title: `${leads.length} New Leads Generated`,
      description: `You received ${leads.length} new lead${leads.length !== 1 ? 's' : ''} this period.`,
      metric_value: leads.length.toString(),
      comparison_text: `+${leadsChange}% vs last month`,
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  if (kpis.pages_published > 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'deliverable',
      title: `${kpis.pages_published} Pages Published`,
      description: `Published ${kpis.pages_published} new page${kpis.pages_published !== 1 ? 's' : ''} to strengthen SEO.`,
      metric_value: kpis.pages_published.toString(),
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  if (kpis.posts_published > 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'content',
      title: `${kpis.posts_published} Social Posts Published`,
      description: `Maintained consistent social media presence with regular content updates.`,
      metric_value: kpis.posts_published.toString(),
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  if (kpis.videos_created > 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'video_growth',
      title: `${kpis.videos_created} Video${kpis.videos_created !== 1 ? 's' : ''} Created`,
      description: `Produced video content to boost engagement and time-on-site.`,
      metric_value: kpis.videos_created.toString(),
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  // Opportunities
  if (trafficChange < 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'opportunity',
      title: 'Traffic Declined',
      description: `Website traffic decreased by ${Math.abs(trafficChange)}%. Consider increasing content promotion and reviewing SEO performance.`,
      metric_value: `${trafficChange}%`,
      sort_order: sortOrder++,
      visible_to_client: false
    });
  }

  if (requests.filter(r => r.status === 'waiting_on_client').length > 0) {
    highlights.push({
      company_id: companyId,
      executive_report_id: reportId,
      highlight_type: 'alert',
      title: 'Pending Client Approvals',
      description: `${requests.filter(r => r.status === 'waiting_on_client').length} items awaiting your approval.`,
      sort_order: sortOrder++,
      visible_to_client: true
    });
  }

  return highlights;
}

function generateKPIHistory(companyId, reportId, kpis, periodLabel, periodStart, periodEnd) {
  const records = [];
  const metrics = [
    { name: 'leads_total', label: 'Leads Generated', value: kpis.leads_total, source: 'leads' },
    { name: 'calls_total', label: 'Calls Received', value: kpis.calls_total, source: 'calls' },
    { name: 'website_visits_total', label: 'Website Visits', value: kpis.traffic_total, source: 'website_analytics' },
    { name: 'ad_impressions_total', label: 'Ad Impressions', value: kpis.ad_impressions_total, source: 'ad_performance' },
    { name: 'ad_clicks_total', label: 'Ad Clicks', value: kpis.ad_clicks_total, source: 'ad_performance' },
    { name: 'posts_published_total', label: 'Posts Published', value: kpis.posts_published, source: 'social_metrics' },
    { name: 'videos_created_total', label: 'Videos Created', value: kpis.videos_created, source: 'video_metrics' },
    { name: 'pages_published_total', label: 'Pages Published', value: kpis.pages_published, source: 'content_output' },
  ];

  metrics.forEach(metric => {
    if (metric.value > 0) {
      records.push({
        company_id: companyId,
        metric_name: metric.name,
        metric_label: metric.label,
        metric_value: metric.value,
        period_label: periodLabel,
        period_start: periodStart,
        period_end: periodEnd,
        source_type: metric.source,
        executive_report_id: reportId
      });
    }
  });

  return records;
}