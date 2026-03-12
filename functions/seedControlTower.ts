import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const s = base44.asServiceRole;

    // Seed Revenue Deals
    await s.entities.RevenueDeal.bulkCreate([
      { company_name: 'Summit Roofing Co.', deal_value: 18000, stage: 'negotiation', close_probability: 78, assigned_rep: 'Jake M.', urgency: 'hot', deal_type: 'new', vertical: 'Roofing', expected_close_date: '2026-03-20', notes: 'Decision maker engaged. Ready to close.' },
      { company_name: 'Metro HVAC Solutions', deal_value: 24000, stage: 'proposal', close_probability: 62, assigned_rep: 'Sarah L.', urgency: 'hot', deal_type: 'new', vertical: 'HVAC', expected_close_date: '2026-03-28' },
      { company_name: 'Bright Dental Group', deal_value: 15000, stage: 'qualified', close_probability: 45, assigned_rep: 'Tom R.', urgency: 'warm', deal_type: 'new', vertical: 'Dental', expected_close_date: '2026-04-10' },
      { company_name: 'Elite Plumbing Services', deal_value: 12000, stage: 'proposal', close_probability: 55, assigned_rep: 'Jake M.', urgency: 'warm', deal_type: 'new', vertical: 'Plumbing', expected_close_date: '2026-04-05' },
      { company_name: 'Apex Law Partners', deal_value: 36000, stage: 'negotiation', close_probability: 82, assigned_rep: 'Sarah L.', urgency: 'hot', deal_type: 'upsell', vertical: 'Legal', expected_close_date: '2026-03-18', notes: 'Annual renewal + AI video upsell.' },
      { company_name: 'CloudFit Gym Network', deal_value: 9600, stage: 'qualified', close_probability: 38, assigned_rep: 'Tom R.', urgency: 'cold', deal_type: 'new', vertical: 'Fitness', expected_close_date: '2026-04-30' },
      { company_name: 'Heritage Home Builders', deal_value: 21000, stage: 'proposal', close_probability: 67, assigned_rep: 'Jake M.', urgency: 'warm', deal_type: 'new', vertical: 'Construction', expected_close_date: '2026-04-08' },
      { company_name: 'Sunrise Med Spa', deal_value: 14400, stage: 'negotiation', close_probability: 71, assigned_rep: 'Sarah L.', urgency: 'hot', deal_type: 'renewal', vertical: 'MedSpa', expected_close_date: '2026-03-22' },
      { company_name: 'Pacific Coast Realty', deal_value: 18500, stage: 'prospect', close_probability: 25, assigned_rep: 'Tom R.', urgency: 'cold', deal_type: 'new', vertical: 'Real Estate', expected_close_date: '2026-05-15' },
      { company_name: 'NextGen Auto Repair', deal_value: 8400, stage: 'qualified', close_probability: 42, assigned_rep: 'Jake M.', urgency: 'warm', deal_type: 'new', vertical: 'Automotive' },
    ]);

    // Seed Client Health Scores
    await s.entities.ClientHealthScore.bulkCreate([
      { company_name: 'Summit Roofing Co.', logo_initial: 'S', health_score: 92, content_output_level: 'high', lead_flow_trend: 'up', roi_confidence: 88, churn_risk: 'low', publishing_activity: 24, ranking_trend: 'improving', video_performance: 78, upsell_signals: 'Ready for social media bundle upgrade.', mrr: 1500, vertical: 'Roofing', account_manager: 'Jake M.' },
      { company_name: 'Metro HVAC Solutions', logo_initial: 'M', health_score: 84, content_output_level: 'high', lead_flow_trend: 'up', roi_confidence: 79, churn_risk: 'low', publishing_activity: 19, ranking_trend: 'improving', video_performance: 65, mrr: 2000, vertical: 'HVAC', account_manager: 'Sarah L.' },
      { company_name: 'Bright Dental Group', logo_initial: 'B', health_score: 56, content_output_level: 'medium', lead_flow_trend: 'stable', roi_confidence: 52, churn_risk: 'medium', publishing_activity: 11, ranking_trend: 'stable', video_performance: 44, upsell_signals: 'Low engagement on review campaign.', mrr: 1200, vertical: 'Dental', account_manager: 'Tom R.' },
      { company_name: 'Apex Law Partners', logo_initial: 'A', health_score: 96, content_output_level: 'high', lead_flow_trend: 'up', roi_confidence: 94, churn_risk: 'low', publishing_activity: 31, ranking_trend: 'improving', video_performance: 88, upsell_signals: 'Top performer — candidate for case study.', mrr: 3000, vertical: 'Legal', account_manager: 'Sarah L.' },
      { company_name: 'Heritage Home Builders', logo_initial: 'H', health_score: 38, content_output_level: 'low', lead_flow_trend: 'down', roi_confidence: 34, churn_risk: 'high', publishing_activity: 4, ranking_trend: 'declining', video_performance: 22, upsell_signals: 'Missed last 3 content reviews.', mrr: 1800, vertical: 'Construction', account_manager: 'Jake M.' },
      { company_name: 'Sunrise Med Spa', logo_initial: 'S', health_score: 78, content_output_level: 'medium', lead_flow_trend: 'up', roi_confidence: 72, churn_risk: 'low', publishing_activity: 16, ranking_trend: 'improving', video_performance: 61, mrr: 1200, vertical: 'MedSpa', account_manager: 'Sarah L.' },
      { company_name: 'NextGen Auto Repair', logo_initial: 'N', health_score: 62, content_output_level: 'medium', lead_flow_trend: 'stable', roi_confidence: 58, churn_risk: 'medium', publishing_activity: 9, ranking_trend: 'stable', video_performance: 39, mrr: 700, vertical: 'Automotive', account_manager: 'Tom R.' },
      { company_name: 'Pacific Coast Realty', logo_initial: 'P', health_score: 71, content_output_level: 'medium', lead_flow_trend: 'up', roi_confidence: 65, churn_risk: 'low', publishing_activity: 14, ranking_trend: 'stable', video_performance: 52, mrr: 1500, vertical: 'Real Estate', account_manager: 'Jake M.' },
    ]);

    // Seed AI Production Jobs
    const jobTypes = ['video_generation', 'content_writing', 'seo_analysis', 'social_post', 'report_generation'];
    const statuses = ['queued', 'queued', 'running', 'running', 'awaiting_approval', 'failed'];
    const clients_list = ['Summit Roofing', 'Metro HVAC', 'Apex Law', 'Bright Dental', 'Sunrise Med Spa'];
    const jobSeeds = Array.from({ length: 28 }, (_, i) => ({
      job_type: jobTypes[i % jobTypes.length],
      status: statuses[i % statuses.length],
      client_name: clients_list[i % clients_list.length],
      processing_time_seconds: Math.floor(Math.random() * 120) + 10,
      priority: i < 5 ? 'urgent' : 'normal',
      error_message: statuses[i % statuses.length] === 'failed' ? 'API timeout after 60s' : null,
    }));
    await s.entities.AIProductionJob.bulkCreate(jobSeeds);

    // Seed Market Expansion Zones
    await s.entities.MarketExpansionZone.bulkCreate([
      { city: 'Dallas', state: 'TX', status: 'dominated', vertical_penetration: 78, lead_demand_index: 92, competitor_density_score: 45, projected_market_value: 380000, active_clients: 22, lat: 32.7767, lng: -96.7970 },
      { city: 'Houston', state: 'TX', status: 'active', vertical_penetration: 52, lead_demand_index: 88, competitor_density_score: 62, projected_market_value: 420000, active_clients: 14, lat: 29.7604, lng: -95.3698 },
      { city: 'Phoenix', state: 'AZ', status: 'dominated', vertical_penetration: 71, lead_demand_index: 85, competitor_density_score: 38, projected_market_value: 290000, active_clients: 18, lat: 33.4484, lng: -112.0740 },
      { city: 'Denver', state: 'CO', status: 'active', vertical_penetration: 44, lead_demand_index: 79, competitor_density_score: 55, projected_market_value: 245000, active_clients: 9, lat: 39.7392, lng: -104.9903 },
      { city: 'Atlanta', state: 'GA', status: 'opportunity', vertical_penetration: 18, lead_demand_index: 94, competitor_density_score: 28, projected_market_value: 510000, active_clients: 3, lat: 33.7490, lng: -84.3880 },
      { city: 'Chicago', state: 'IL', status: 'opportunity', vertical_penetration: 12, lead_demand_index: 96, competitor_density_score: 71, projected_market_value: 680000, active_clients: 2, lat: 41.8781, lng: -87.6298 },
      { city: 'Miami', state: 'FL', status: 'active', vertical_penetration: 38, lead_demand_index: 87, competitor_density_score: 59, projected_market_value: 370000, active_clients: 7, lat: 25.7617, lng: -80.1918 },
      { city: 'Nashville', state: 'TN', status: 'opportunity', vertical_penetration: 9, lead_demand_index: 91, competitor_density_score: 21, projected_market_value: 290000, active_clients: 1, lat: 36.1627, lng: -86.7816 },
      { city: 'Las Vegas', state: 'NV', status: 'dominated', vertical_penetration: 82, lead_demand_index: 81, competitor_density_score: 43, projected_market_value: 215000, active_clients: 15, lat: 36.1699, lng: -115.1398 },
      { city: 'Seattle', state: 'WA', status: 'opportunity', vertical_penetration: 14, lead_demand_index: 88, competitor_density_score: 67, projected_market_value: 460000, active_clients: 1, lat: 47.6062, lng: -122.3321 },
    ]);

    // Seed Founder Insights
    await s.entities.FounderInsight.bulkCreate([
      { insight_type: 'growth_anomaly', headline: 'Dallas market revenue +34% MoM — replicable pattern detected', narrative: 'Summit Roofing and 3 other Dallas clients all hit record publishing velocity this month. The common factor is weekly video + weekly blog + GMB updates. This combination is driving a measurable lead spike.', urgency: 'high', impact_estimate: '+$18k MRR potential if replicated across 5 similar markets', data_points: '4 clients, avg health score +22 pts, lead flow up 3.1x' },
      { insight_type: 'upsell_cluster', headline: '7 mid-tier clients showing video upgrade signals', narrative: 'Seven clients with $1,200 MRR plans have published 10+ blog posts in 90 days but have zero AI videos. Historical data shows video adoption increases retention by 38% and justifies a $600/mo upgrade.', urgency: 'high', impact_estimate: '+$4,200/mo recurring if 7 clients convert', data_points: '7 clients, avg health 74, no video output, high publishing cadence' },
      { insight_type: 'churn_warning', headline: 'Heritage Home Builders showing critical disengagement', narrative: 'Client has missed 3 consecutive content reviews and publishing activity dropped from 18 to 4 pieces/month. Last login was 23 days ago. ROI confidence at 34%. Intervention needed within 7 days.', urgency: 'critical', impact_estimate: 'Risk of $1,800/mo churn in 30 days', data_points: 'Health score 38, declining trend, 3 missed check-ins' },
      { insight_type: 'vertical_demand_spike', headline: 'HVAC vertical search volume +41% entering spring season', narrative: 'Google Trends and local SEO data show HVAC-related searches spiking across all active markets. This is the annual spring demand wave. Clients in HVAC vertical should accelerate publishing immediately.', urgency: 'medium', impact_estimate: '2-4x lead volume available for HVAC clients who publish this week', data_points: 'Search trend data, 5 HVAC clients, avg content gap = 8 pieces' },
      { insight_type: 'pricing_optimization', headline: 'Entry plan is underpriced relative to delivered ROI', narrative: 'Analysis of 15 entry-plan clients shows average client-reported ROI of 6.2x. Industry benchmark for similar services is 3.8x. This is a strong signal that entry pricing can increase by $200-400/mo without churn risk.', urgency: 'medium', impact_estimate: '+$12,000-18,000/mo if 60% of entry clients retain after price increase', data_points: 'N=15 clients, avg ROI 6.2x, churn rate 4.1% entry tier' },
      { insight_type: 'market_opportunity', headline: 'Atlanta market is undersaturated with 94 lead demand index', narrative: 'Atlanta shows highest lead demand index of all unserved markets at 94. Current competitor density is only 28 — far below Chicago and Seattle. First-mover advantage is available now.', urgency: 'high', impact_estimate: 'Capture 8-12 clients in 90 days = +$14,400/mo MRR', data_points: 'Lead demand 94, competitor density 28, projected market $510k' },
    ]);

    // Seed Team Capacity
    await s.entities.TeamCapacityMetric.bulkCreate([
      { team_name: 'sales', current_load: 72, queue_volume: 18, capacity_warning: false, trend: 'stable', avg_resolution_time_hours: 72, team_size: 3 },
      { team_name: 'onboarding', current_load: 91, queue_volume: 7, capacity_warning: true, trend: 'increasing', avg_resolution_time_hours: 48, team_size: 2 },
      { team_name: 'support', current_load: 58, queue_volume: 12, capacity_warning: false, trend: 'stable', avg_resolution_time_hours: 8, team_size: 2 },
      { team_name: 'content', current_load: 84, queue_volume: 34, capacity_warning: false, trend: 'increasing', avg_resolution_time_hours: 24, team_size: 4 },
      { team_name: 'development', current_load: 67, queue_volume: 11, capacity_warning: false, trend: 'decreasing', avg_resolution_time_hours: 96, team_size: 2 },
    ]);

    // Seed Automation Triggers
    await s.entities.AutomationTrigger.bulkCreate([
      { rule_name: 'Daily Content Publisher', trigger_type: 'scheduled', fires_today: 47, status: 'active', error_count: 0, category: 'content', description: 'Auto-publishes approved content daily at 9am' },
      { rule_name: 'Lead Score Updater', trigger_type: 'event_based', fires_today: 124, status: 'active', error_count: 0, category: 'crm', description: 'Recalculates lead score on activity change' },
      { rule_name: 'Churn Risk Monitor', trigger_type: 'threshold', fires_today: 3, status: 'active', error_count: 0, category: 'retention', description: 'Alerts when health score drops below 50' },
      { rule_name: 'Monthly Report Batch', trigger_type: 'scheduled', fires_today: 0, status: 'active', error_count: 0, category: 'reporting' },
      { rule_name: 'Meta Campaign Sync', trigger_type: 'webhook', fires_today: 8, status: 'error', error_count: 3, category: 'campaign', description: 'Syncs Meta ad results — auth token expired' },
      { rule_name: 'AI Video Queue Processor', trigger_type: 'scheduled', fires_today: 12, status: 'active', error_count: 0, category: 'content' },
      { rule_name: 'New Lead Follow-up', trigger_type: 'event_based', fires_today: 6, status: 'active', error_count: 0, category: 'sales' },
      { rule_name: 'Weekly Strategy Review', trigger_type: 'scheduled', fires_today: 1, status: 'active', error_count: 0, category: 'reporting' },
    ]);

    // Seed Revenue Forecasts
    await s.entities.RevenueForecast.bulkCreate([
      { month_label: 'Oct', period: '30_day', projected_revenue: 98000, actual_revenue: 94200, renewal_revenue: 38000, upsell_opportunities: 4, reseller_contribution: 12000, confidence_score: 91, new_client_revenue: 44200 },
      { month_label: 'Nov', period: '30_day', projected_revenue: 108000, actual_revenue: 105400, renewal_revenue: 41000, upsell_opportunities: 6, reseller_contribution: 14000, confidence_score: 89, new_client_revenue: 50400 },
      { month_label: 'Dec', period: '30_day', projected_revenue: 115000, actual_revenue: 112300, renewal_revenue: 44000, upsell_opportunities: 7, reseller_contribution: 15500, confidence_score: 93, new_client_revenue: 52800 },
      { month_label: 'Jan', period: '30_day', projected_revenue: 121000, actual_revenue: 119800, renewal_revenue: 47000, upsell_opportunities: 9, reseller_contribution: 17000, confidence_score: 90, new_client_revenue: 55800 },
      { month_label: 'Feb', period: '30_day', projected_revenue: 128000, actual_revenue: 124800, renewal_revenue: 48000, upsell_opportunities: 12, reseller_contribution: 18500, confidence_score: 88, new_client_revenue: 58300 },
      { month_label: 'Mar', period: '30_day', projected_revenue: 138000, actual_revenue: null, renewal_revenue: 51000, upsell_opportunities: 14, reseller_contribution: 20000, confidence_score: 82, new_client_revenue: 67000 },
      { month_label: 'Apr', period: '30_day', projected_revenue: 149000, actual_revenue: null, renewal_revenue: 54000, upsell_opportunities: 16, reseller_contribution: 22000, confidence_score: 76 },
    ]);

    return Response.json({ success: true, message: 'Control Tower data seeded successfully!' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});