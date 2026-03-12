import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const s = base44.asServiceRole;

    await s.entities.ClientLifecycleStage.bulkCreate([
      { company_name: 'Arctic Air HVAC', vertical: 'HVAC', stage: 'performance_optimization', onboarding_completion: 100, content_output_score: 82, satisfaction_signal: 'positive', lifecycle_urgency: 'on_track', assigned_manager: 'Jake M.', mrr: 1497, deal_close_date: '2026-01-12', days_in_stage: 12, upsell_probability: 78, churn_risk_score: 8, roi_confidence: 88, city: 'Dallas', state: 'TX' },
      { company_name: 'Precision Plumbing', vertical: 'Home Services', stage: 'publishing_active', onboarding_completion: 100, content_output_score: 76, satisfaction_signal: 'positive', lifecycle_urgency: 'on_track', assigned_manager: 'Tom R.', mrr: 2497, deal_close_date: '2026-01-18', days_in_stage: 8, upsell_probability: 62, churn_risk_score: 12, roi_confidence: 81, city: 'Denver', state: 'CO' },
      { company_name: 'Mesa Grill Group', vertical: 'Restaurant', stage: 'content_production', onboarding_completion: 100, content_output_score: 41, satisfaction_signal: 'at_risk', lifecycle_urgency: 'urgent', assigned_manager: 'Maria C.', mrr: 997, deal_close_date: '2026-02-02', days_in_stage: 22, upsell_probability: 28, churn_risk_score: 54, roi_confidence: 44, city: 'Phoenix', state: 'AZ' },
      { company_name: 'Blue Ridge Roofing', vertical: 'Roofing', stage: 'content_production', onboarding_completion: 80, content_output_score: 22, satisfaction_signal: 'negative', lifecycle_urgency: 'stalled', assigned_manager: 'Jake M.', mrr: 1497, deal_close_date: '2026-02-10', days_in_stage: 28, upsell_probability: 15, churn_risk_score: 78, roi_confidence: 32, city: 'Atlanta', state: 'GA' },
      { company_name: 'ProHeat Systems', vertical: 'HVAC', stage: 'publishing_active', onboarding_completion: 100, content_output_score: 74, satisfaction_signal: 'positive', lifecycle_urgency: 'on_track', assigned_manager: 'Sarah L.', mrr: 1497, deal_close_date: '2026-02-18', days_in_stage: 6, upsell_probability: 71, churn_risk_score: 14, roi_confidence: 77, city: 'Houston', state: 'TX' },
      { company_name: 'Taco Loco Franchise', vertical: 'Restaurant', stage: 'strategy_approved', onboarding_completion: 100, content_output_score: 38, satisfaction_signal: 'neutral', lifecycle_urgency: 'normal', assigned_manager: 'Maria C.', mrr: 997, deal_close_date: '2026-02-24', days_in_stage: 14, upsell_probability: 34, churn_risk_score: 31, roi_confidence: 52, city: 'Los Angeles', state: 'CA' },
      { company_name: 'CoolBreeze HVAC', vertical: 'HVAC', stage: 'onboarding_initiated', onboarding_completion: 40, content_output_score: 0, satisfaction_signal: 'neutral', lifecycle_urgency: 'normal', assigned_manager: 'Jake M.', mrr: 1497, deal_close_date: '2026-03-05', days_in_stage: 7, upsell_probability: 20, churn_risk_score: 5, roi_confidence: 0, city: 'Chicago', state: 'IL' },
      { company_name: 'Sun Valley Landscaping', vertical: 'Home Services', stage: 'assets_collected', onboarding_completion: 60, content_output_score: 0, satisfaction_signal: 'neutral', lifecycle_urgency: 'normal', assigned_manager: 'Tom R.', mrr: 1497, deal_close_date: '2026-03-01', days_in_stage: 11, upsell_probability: 22, churn_risk_score: 18, roi_confidence: 0, city: 'Phoenix', state: 'AZ' },
      { company_name: 'Apex Law Partners', vertical: 'Legal', stage: 'expansion_opportunity', onboarding_completion: 100, content_output_score: 88, satisfaction_signal: 'positive', lifecycle_urgency: 'on_track', assigned_manager: 'Sarah L.', mrr: 3997, deal_close_date: '2025-12-01', days_in_stage: 4, upsell_probability: 91, churn_risk_score: 6, roi_confidence: 94, city: 'New York', state: 'NY' },
      { company_name: 'Citywide Dental', vertical: 'Dental', stage: 'deal_closed', onboarding_completion: 0, content_output_score: 0, satisfaction_signal: 'neutral', lifecycle_urgency: 'normal', assigned_manager: 'Tom R.', mrr: 2497, deal_close_date: '2026-03-10', days_in_stage: 2, upsell_probability: 0, churn_risk_score: 0, roi_confidence: 0, city: 'Seattle', state: 'WA' },
    ]);

    await s.entities.OnboardingTask.bulkCreate([
      { client_name: 'CoolBreeze HVAC', category: 'brand_assets', task_name: 'Upload logo & brand colors', status: 'completed', assigned_to: 'Jake M.', auto_triggered: true },
      { client_name: 'CoolBreeze HVAC', category: 'brand_assets', task_name: 'Submit hero photo assets', status: 'in_progress', assigned_to: 'Client', auto_triggered: true },
      { client_name: 'CoolBreeze HVAC', category: 'login_integrations', task_name: 'Connect Google Business Profile', status: 'pending', assigned_to: 'Jake M.', auto_triggered: true },
      { client_name: 'CoolBreeze HVAC', category: 'content_voice', task_name: 'Complete brand voice questionnaire', status: 'pending', assigned_to: 'Client', auto_triggered: true },
      { client_name: 'Sun Valley Landscaping', category: 'brand_assets', task_name: 'Upload logo & brand colors', status: 'completed', assigned_to: 'Tom R.', auto_triggered: true },
      { client_name: 'Sun Valley Landscaping', category: 'login_integrations', task_name: 'Connect Google Business Profile', status: 'completed', assigned_to: 'Tom R.', auto_triggered: true },
      { client_name: 'Sun Valley Landscaping', category: 'content_voice', task_name: 'Complete brand voice questionnaire', status: 'in_progress', assigned_to: 'Client', auto_triggered: true },
      { client_name: 'Sun Valley Landscaping', category: 'video_style', task_name: 'Select video template style', status: 'pending', assigned_to: 'Client', auto_triggered: true },
      { client_name: 'Sun Valley Landscaping', category: 'market_targeting', task_name: 'Define target zip codes', status: 'overdue', assigned_to: 'Tom R.', due_date: '2026-03-08', auto_triggered: true },
    ]);

    await s.entities.ProductionActivationMetric.bulkCreate([
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', content_jobs_triggered: 18, publishing_frequency_per_week: 4, videos_produced_month: 6, approvals_pending: 2, low_activity_flag: false, stalled_automation_flag: false, last_content_published: '2026-03-11', period: 'March 2026' },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', content_jobs_triggered: 11, publishing_frequency_per_week: 2, videos_produced_month: 3, approvals_pending: 5, low_activity_flag: true, stalled_automation_flag: false, last_content_published: '2026-03-08', period: 'March 2026' },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', content_jobs_triggered: 22, publishing_frequency_per_week: 5, videos_produced_month: 8, approvals_pending: 0, low_activity_flag: false, stalled_automation_flag: false, last_content_published: '2026-03-12', period: 'March 2026' },
      { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', content_jobs_triggered: 4, publishing_frequency_per_week: 1, videos_produced_month: 1, approvals_pending: 3, low_activity_flag: true, stalled_automation_flag: true, last_content_published: '2026-02-22', period: 'March 2026' },
      { client_name: 'ProHeat Systems', vertical: 'HVAC', content_jobs_triggered: 16, publishing_frequency_per_week: 3, videos_produced_month: 5, approvals_pending: 1, low_activity_flag: false, stalled_automation_flag: false, last_content_published: '2026-03-11', period: 'March 2026' },
    ]);

    await s.entities.ClientPerformanceSignal.bulkCreate([
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', ranking_trend: 'improving', ranking_keywords_moved: 14, social_reach_growth: 28, lead_flow_signal: 'strong', engagement_velocity: 82, insight_type: 'performance_surge', insight_narrative: '14 keywords moved up in 30 days, lead form completions +38%', period: 'March 2026' },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', ranking_trend: 'improving', ranking_keywords_moved: 9, social_reach_growth: 17, lead_flow_signal: 'moderate', engagement_velocity: 71, insight_type: 'opportunity_cluster', insight_narrative: 'Cluster of high-intent local keywords showing strong indexing signals', period: 'March 2026' },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', ranking_trend: 'stable', ranking_keywords_moved: 2, social_reach_growth: 4, lead_flow_signal: 'weak', engagement_velocity: 38, insight_type: 'stagnation_detected', insight_narrative: 'Low posting frequency causing engagement decay', period: 'March 2026' },
      { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', ranking_trend: 'declining', ranking_keywords_moved: -3, social_reach_growth: -8, lead_flow_signal: 'weak', engagement_velocity: 22, insight_type: 'stagnation_detected', insight_narrative: 'Rankings declining — stalled automation and no new content in 18 days', period: 'March 2026' },
      { client_name: 'ProHeat Systems', vertical: 'HVAC', ranking_trend: 'improving', ranking_keywords_moved: 11, social_reach_growth: 22, lead_flow_signal: 'strong', engagement_velocity: 78, insight_type: 'performance_surge', insight_narrative: 'Rapid gains after video launch campaign — upsell window active', period: 'March 2026' },
    ]);

    await s.entities.UpsellOpportunity.bulkCreate([
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', opportunity_type: 'expansion_ready', status: 'detected', projected_added_mrr: 1500, confidence_score: 88, recommended_offer: 'Growth → Professional upgrade with AI video pack', current_mrr: 1497, assigned_rep: 'Sarah L.', detected_date: '2026-03-10' },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', opportunity_type: 'premium_video', status: 'outreach_sent', projected_added_mrr: 800, confidence_score: 74, recommended_offer: 'Add AI Video ×4/mo + YouTube distribution', current_mrr: 2497, assigned_rep: 'Jake M.', detected_date: '2026-03-08' },
      { client_name: 'ProHeat Systems', vertical: 'HVAC', opportunity_type: 'annual_conversion', status: 'in_discussion', projected_added_mrr: 299, confidence_score: 91, recommended_offer: 'Lock in annual contract — save 2 months', current_mrr: 1497, assigned_rep: 'Tom R.', detected_date: '2026-03-07' },
      { client_name: 'Apex Law Partners', vertical: 'Legal', opportunity_type: 'multi_location', status: 'detected', projected_added_mrr: 3997, confidence_score: 85, recommended_offer: 'Add second office location package', current_mrr: 3997, assigned_rep: 'Sarah L.', detected_date: '2026-03-09' },
    ]);

    await s.entities.RetentionRiskFlag.bulkCreate([
      { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', churn_probability: 78, risk_level: 'critical', primary_signal: 'No content in 18 days, automation stalled, low engagement', satisfaction_trend: 'declining', low_production_activity: true, negative_engagement: true, intervention_status: 'none', assigned_manager: 'Jake M.', days_until_renewal: 22, mrr: 1497 },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', churn_probability: 54, risk_level: 'high', primary_signal: 'Posting frequency dropped 60%, owner unresponsive to check-ins', satisfaction_trend: 'declining', low_production_activity: true, negative_engagement: false, intervention_status: 'triggered', assigned_manager: 'Maria C.', days_until_renewal: 48, mrr: 997 },
      { client_name: 'Sun Valley Landscaping', vertical: 'Home Services', churn_probability: 38, risk_level: 'medium', primary_signal: 'Questions about ROI, comparing to competitor', satisfaction_trend: 'stable', low_production_activity: false, negative_engagement: false, intervention_status: 'in_progress', assigned_manager: 'Tom R.', days_until_renewal: 15, mrr: 1497 },
    ]);

    await s.entities.LifecycleTimelineEvent.bulkCreate([
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'deal_closed', event_date: '2026-01-12', description: 'Closed Growth plan at $1,497/mo', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'onboarding_started', event_date: '2026-01-13', description: 'Onboarding workflow initiated automatically', milestone: false, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'first_content_published', event_date: '2026-01-25', description: 'First blog post and social video published', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'first_ranking_improvement', event_date: '2026-02-14', description: '6 keywords moved to page 1', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Arctic Air HVAC', vertical: 'HVAC', event_type: 'upsell_converted', event_date: '2026-03-08', description: 'Upgraded to Professional — AI Video added', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'deal_closed', event_date: '2026-01-18', description: 'Closed Professional plan at $2,497/mo', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'strategy_approved', event_date: '2026-02-05', description: 'Content strategy and voice approved', milestone: false, revenue_tier: 'professional', mrr_at_event: 2497 },
      { client_name: 'Precision Plumbing', vertical: 'Home Services', event_type: 'first_ranking_improvement', event_date: '2026-03-11', description: '9 keywords moved up, lead volume increased', milestone: true, revenue_tier: 'professional', mrr_at_event: 2497 },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', event_type: 'deal_closed', event_date: '2026-02-02', description: 'Closed Starter plan at $997/mo', milestone: true, revenue_tier: 'starter', mrr_at_event: 997 },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', event_type: 'risk_flagged', event_date: '2026-03-05', description: 'Low activity and churn signals detected', milestone: false, revenue_tier: 'starter', mrr_at_event: 997 },
      { client_name: 'Mesa Grill Group', vertical: 'Restaurant', event_type: 'intervention_triggered', event_date: '2026-03-10', description: 'Retention intervention activated by manager', milestone: false, revenue_tier: 'starter', mrr_at_event: 997 },
      { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', event_type: 'deal_closed', event_date: '2026-02-10', description: 'Closed Growth plan at $1,497/mo', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Blue Ridge Roofing', vertical: 'Roofing', event_type: 'risk_flagged', event_date: '2026-03-05', description: 'Stalled automation, no content published in 18 days', milestone: false, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'ProHeat Systems', vertical: 'HVAC', event_type: 'deal_closed', event_date: '2026-02-18', description: 'Closed Growth plan at $1,497/mo', milestone: true, revenue_tier: 'growth', mrr_at_event: 1497 },
      { client_name: 'Apex Law Partners', vertical: 'Legal', event_type: 'deal_closed', event_date: '2025-12-01', description: 'Closed Enterprise plan at $3,997/mo', milestone: true, revenue_tier: 'enterprise', mrr_at_event: 3997 },
      { client_name: 'Apex Law Partners', vertical: 'Legal', event_type: 'renewal_checkpoint', event_date: '2026-03-01', description: '3-month renewal review — client extremely satisfied', milestone: true, revenue_tier: 'enterprise', mrr_at_event: 3997 },
    ]);

    return Response.json({ success: true, message: 'Client Lifecycle Engine seeded successfully!' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});