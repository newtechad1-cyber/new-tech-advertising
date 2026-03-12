import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const s = base44.asServiceRole;

    await s.entities.SalesLead.bulkCreate([
      { company_name: 'Arctic Air HVAC', contact_name: 'Dave Torres', email: 'dave@arcticair.com', vertical: 'HVAC', source: 'organic_search', engagement_score: 82, status: 'demo_scheduled', assigned_owner: 'Jake M.', next_action: 'Run demo', next_action_date: '2026-03-13', city: 'Dallas', state: 'TX', demo_booked: true },
      { company_name: 'Mesa Grill Group', contact_name: 'Rosa Mendez', email: 'rosa@mesagrill.com', vertical: 'Restaurant', source: 'paid_ads', engagement_score: 65, status: 'contacted', assigned_owner: 'Sarah L.', next_action: 'Follow-up call', city: 'Phoenix', state: 'AZ', demo_booked: false },
      { company_name: 'Precision Plumbing', contact_name: 'Bill Granger', email: 'bill@precisionplumb.com', vertical: 'Home Services', source: 'referral', engagement_score: 91, status: 'demo_completed', assigned_owner: 'Tom R.', next_action: 'Send proposal', demo_booked: true },
      { company_name: 'Blue Ridge Roofing', contact_name: 'Carl Hughes', email: 'carl@blueridge.com', vertical: 'Roofing', source: 'cold_outreach', engagement_score: 47, status: 'contacted', assigned_owner: 'Jake M.', next_action: 'Re-engage email', city: 'Atlanta', state: 'GA', demo_booked: false },
      { company_name: 'CoolBreeze HVAC', contact_name: 'Linda Park', email: 'linda@coolbreeze.com', vertical: 'HVAC', source: 'website_demo', engagement_score: 88, status: 'new', assigned_owner: 'Sarah L.', next_action: 'Book demo ASAP', demo_booked: false },
      { company_name: 'The Burger Lab', contact_name: 'Josh Kim', email: 'josh@burgerlab.com', vertical: 'Restaurant', source: 'social_media', engagement_score: 73, status: 'demo_scheduled', assigned_owner: 'Maria C.', next_action: 'Run demo', demo_booked: true },
      { company_name: 'Spotless Cleaning Co.', contact_name: 'Amy Walsh', email: 'amy@spotless.com', vertical: 'Home Services', source: 'referral', engagement_score: 79, status: 'new', assigned_owner: 'Tom R.', next_action: 'Initial call', demo_booked: false },
      { company_name: 'Sun Valley Landscaping', contact_name: 'Pete Ortega', email: 'pete@sunvalley.com', vertical: 'Home Services', source: 'event', engagement_score: 58, status: 'new', assigned_owner: 'Jake M.', next_action: 'Send intro email', demo_booked: false },
      { company_name: 'ProHeat Systems', contact_name: 'Wendy Cole', email: 'wendy@proheat.com', vertical: 'HVAC', source: 'partner', engagement_score: 84, status: 'demo_completed', assigned_owner: 'Sarah L.', next_action: 'Proposal ready', demo_booked: true },
      { company_name: 'Taco Loco Franchise', contact_name: 'Marco Ruiz', email: 'marco@tacoloco.com', vertical: 'Restaurant', source: 'paid_ads', engagement_score: 61, status: 'contacted', assigned_owner: 'Maria C.', next_action: 'Schedule demo', demo_booked: false },
    ]);

    await s.entities.SalesActivity.bulkCreate([
      { activity_type: 'deal_closed', rep_name: 'Sarah L.', company_name: 'Metro HVAC Solutions', deal_value: 24000, vertical: 'HVAC', outcome: 'positive', notes: 'Signed annual contract with AI video package.' },
      { activity_type: 'demo_completed', rep_name: 'Jake M.', company_name: 'Precision Plumbing', vertical: 'Home Services', outcome: 'positive', notes: 'Strong interest — moving to proposal stage.' },
      { activity_type: 'follow_up', rep_name: 'Tom R.', company_name: 'Blue Ridge Roofing', vertical: 'Roofing', follow_up_required: true, overdue: true, notes: 'No response after 5 days. Needs re-engagement.' },
      { activity_type: 'proposal_sent', rep_name: 'Sarah L.', company_name: 'Sunrise Med Spa', deal_value: 14400, vertical: 'MedSpa', outcome: 'neutral' },
      { activity_type: 'call_logged', rep_name: 'Jake M.', company_name: 'Arctic Air HVAC', vertical: 'HVAC', notes: 'Interested in AI video — send pricing sheet', outcome: 'positive' },
      { activity_type: 'email_sent', rep_name: 'Maria C.', company_name: 'Mesa Grill Group', vertical: 'Restaurant', outcome: 'neutral' },
      { activity_type: 'meeting_scheduled', rep_name: 'Tom R.', company_name: 'Citywide Dental', vertical: 'Dental', outcome: 'positive' },
      { activity_type: 'follow_up', rep_name: 'Maria C.', company_name: 'Heritage Builders', vertical: 'Construction', follow_up_required: true, overdue: true, notes: 'Promised to decide this week — no reply.' },
      { activity_type: 'demo_completed', rep_name: 'Sarah L.', company_name: 'ProHeat Systems', vertical: 'HVAC', outcome: 'positive', notes: 'Decision by end of week.' },
      { activity_type: 'deal_closed', rep_name: 'Jake M.', company_name: 'Summit Roofing Co.', deal_value: 18000, vertical: 'Roofing', outcome: 'positive' },
    ]);

    await s.entities.SalesProposal.bulkCreate([
      { company_name: 'Arctic Air HVAC', package_type: 'growth', status: 'viewed', base_price: 1497, expected_mrr: 1497, setup_fee: 1497, addons: 'AI Video (×2/mo)', roi_projection: 'Est. $7,186/mo client revenue impact', sent_date: '2026-03-05', viewed_date: '2026-03-06', expiry_date: '2026-03-20', assigned_rep: 'Jake M.', vertical: 'HVAC' },
      { company_name: 'Precision Plumbing', package_type: 'professional', status: 'negotiating', base_price: 2497, expected_mrr: 2497, setup_fee: 2497, addons: 'Reputation Management, Social Media', roi_projection: 'Est. $11,986/mo client revenue impact', assigned_rep: 'Tom R.', vertical: 'Home Services' },
      { company_name: 'Apex Law Partners', package_type: 'enterprise', status: 'accepted', base_price: 3997, expected_mrr: 3997, setup_fee: 4997, addons: 'AI Video (×2/mo), Authority Blog Pack', assigned_rep: 'Sarah L.', vertical: 'Legal' },
      { company_name: 'Sunrise Med Spa', package_type: 'growth', status: 'sent', base_price: 1497, expected_mrr: 1200, setup_fee: 997, assigned_rep: 'Sarah L.', vertical: 'MedSpa', sent_date: '2026-03-10', expiry_date: '2026-03-24' },
      { company_name: 'Mesa Grill Group', package_type: 'starter', status: 'draft', base_price: 997, expected_mrr: 997, setup_fee: 997, assigned_rep: 'Maria C.', vertical: 'Restaurant' },
      { company_name: 'ProHeat Systems', package_type: 'growth', status: 'sent', base_price: 1497, expected_mrr: 1497, setup_fee: 1497, assigned_rep: 'Sarah L.', vertical: 'HVAC', sent_date: '2026-03-11', expiry_date: '2026-03-25' },
      { company_name: 'Blue Ridge Roofing', package_type: 'starter', status: 'expired', base_price: 997, expected_mrr: 997, setup_fee: 997, assigned_rep: 'Jake M.', vertical: 'Roofing', sent_date: '2026-02-15', expiry_date: '2026-03-01' },
    ]);

    await s.entities.SalesRepProfile.bulkCreate([
      { rep_name: 'Sarah L.', avatar_initial: 'S', deals_closed_month: 8, revenue_generated_month: 112400, demos_completed_month: 18, close_ratio: 44, avg_deal_size: 14050, pipeline_value: 86000, quota: 110000, quota_attainment: 102, trend: 'improving', active: true },
      { rep_name: 'Jake M.', avatar_initial: 'J', deals_closed_month: 6, revenue_generated_month: 91200, demos_completed_month: 14, close_ratio: 43, avg_deal_size: 15200, pipeline_value: 72000, quota: 100000, quota_attainment: 91, trend: 'improving', active: true },
      { rep_name: 'Tom R.', avatar_initial: 'T', deals_closed_month: 4, revenue_generated_month: 58600, demos_completed_month: 11, close_ratio: 36, avg_deal_size: 14650, pipeline_value: 54000, quota: 80000, quota_attainment: 73, trend: 'stable', active: true },
      { rep_name: 'Maria C.', avatar_initial: 'M', deals_closed_month: 3, revenue_generated_month: 39800, demos_completed_month: 9, close_ratio: 33, avg_deal_size: 13267, pipeline_value: 38000, quota: 70000, quota_attainment: 57, trend: 'declining', active: true },
    ]);

    await s.entities.LeadSourceMetric.bulkCreate([
      { source: 'organic_search', leads_count: 42, demo_rate: 48, close_rate: 34, avg_deal_value: 16200, cost_per_acquisition: 120, period: 'March 2026', trend: 'up' },
      { source: 'paid_ads', leads_count: 31, demo_rate: 35, close_rate: 28, avg_deal_value: 14800, cost_per_acquisition: 380, period: 'March 2026', trend: 'stable' },
      { source: 'referral', leads_count: 18, demo_rate: 72, close_rate: 58, avg_deal_value: 19400, cost_per_acquisition: 55, period: 'March 2026', trend: 'up' },
      { source: 'cold_outreach', leads_count: 24, demo_rate: 22, close_rate: 14, avg_deal_value: 12600, cost_per_acquisition: 210, period: 'March 2026', trend: 'down' },
      { source: 'social_media', leads_count: 14, demo_rate: 41, close_rate: 26, avg_deal_value: 13200, cost_per_acquisition: 290, period: 'March 2026', trend: 'up' },
      { source: 'partner', leads_count: 9, demo_rate: 67, close_rate: 52, avg_deal_value: 21800, cost_per_acquisition: 85, period: 'March 2026', trend: 'stable' },
    ]);

    await s.entities.DealForecast.bulkCreate([
      { month_label: 'Oct', projected_revenue: 38000, actual_revenue: 35200, projected_closed: 4, actual_closed: 4, win_rate: 31, period: 'monthly' },
      { month_label: 'Nov', projected_revenue: 42000, actual_revenue: 41100, projected_closed: 5, actual_closed: 5, win_rate: 33, period: 'monthly' },
      { month_label: 'Dec', projected_revenue: 45000, actual_revenue: 44600, projected_closed: 5, actual_closed: 6, win_rate: 36, period: 'monthly' },
      { month_label: 'Jan', projected_revenue: 49000, actual_revenue: 47800, projected_closed: 6, actual_closed: 5, win_rate: 34, period: 'monthly' },
      { month_label: 'Feb', projected_revenue: 52000, actual_revenue: 48200, projected_closed: 6, actual_closed: 6, win_rate: 38, period: 'monthly' },
      { month_label: 'Mar', projected_revenue: 58000, actual_revenue: null, projected_closed: 7, win_rate: 40, period: 'monthly' },
      { month_label: 'Apr', projected_revenue: 64000, actual_revenue: null, projected_closed: 8, win_rate: 42, period: 'monthly' },
    ]);

    return Response.json({ success: true, message: 'Sales Command Center data seeded!' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});