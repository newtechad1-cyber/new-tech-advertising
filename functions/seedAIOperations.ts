import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const s = base44.asServiceRole;

    await s.entities.AIProductionJob.bulkCreate([
      { job_type: 'video_generation', status: 'running', client_name: 'Arctic Air HVAC', priority: 'urgent', started_at: new Date(Date.now() - 600000).toISOString() },
      { job_type: 'content_writing', status: 'queued', client_name: 'Mesa Grill Group', priority: 'normal' },
      { job_type: 'social_post', status: 'awaiting_approval', client_name: 'Precision Plumbing', priority: 'normal', processing_time_seconds: 65, completed_at: new Date().toISOString() },
      { job_type: 'video_generation', status: 'rendering', client_name: 'ProHeat Systems', priority: 'urgent', processing_time_seconds: 840, started_at: new Date(Date.now() - 840000).toISOString() },
      { job_type: 'content_writing', status: 'publishing_ready', client_name: 'Apex Law Partners', priority: 'normal', processing_time_seconds: 120, completed_at: new Date().toISOString() },
      { job_type: 'seo_analysis', status: 'completed', client_name: 'Blue Ridge Roofing', priority: 'low', processing_time_seconds: 240, completed_at: new Date(Date.now() - 3600000).toISOString() },
      { job_type: 'video_generation', status: 'failed', client_name: 'CoolBreeze HVAC', priority: 'urgent', error_message: 'HeyGen API timeout after 3 retries', processing_time_seconds: 0 },
      { job_type: 'email_campaign', status: 'queued', client_name: 'Taco Loco Franchise', priority: 'normal' },
      { job_type: 'social_post', status: 'running', client_name: 'Sun Valley Landscaping', priority: 'normal', processing_time_seconds: 45, started_at: new Date(Date.now() - 45000).toISOString() },
      { job_type: 'content_writing', status: 'awaiting_approval', client_name: 'Citywide Dental', priority: 'urgent', processing_time_seconds: 90, completed_at: new Date().toISOString() },
      { job_type: 'report_generation', status: 'completed', client_name: 'Arctic Air HVAC', priority: 'low', processing_time_seconds: 180, completed_at: new Date(Date.now() - 7200000).toISOString() },
      { job_type: 'website_audit', status: 'queued', client_name: 'Apex Law Partners', priority: 'normal' },
    ]);

    await s.entities.VideoRenderJob.bulkCreate([
      { project_title: 'Arctic Air — Spring HVAC Service Promo', client_name: 'Arctic Air HVAC', vertical: 'HVAC', format_type: 'social_reel', status: 'rendering', priority: 'urgent', scene_count: 6, voiceover_status: 'generated', branding_status: 'applied', render_progress: 68, avg_render_minutes: 12, started_at: new Date(Date.now() - 720000).toISOString() },
      { project_title: 'Mesa Grill — Happy Hour Campaign', client_name: 'Mesa Grill Group', vertical: 'Restaurant', format_type: 'ad_spot', status: 'review_ready', priority: 'normal', scene_count: 4, voiceover_status: 'approved', branding_status: 'approved', render_progress: 100, avg_render_minutes: 8 },
      { project_title: 'Precision Plumbing — We Fix It Fast', client_name: 'Precision Plumbing', vertical: 'Home Services', format_type: 'short_form', status: 'approved', priority: 'normal', scene_count: 5, voiceover_status: 'approved', branding_status: 'approved', render_progress: 100 },
      { project_title: 'ProHeat — Emergency Heat Repair Spot', client_name: 'ProHeat Systems', vertical: 'HVAC', format_type: 'ad_spot', status: 'failed', priority: 'urgent', scene_count: 3, voiceover_status: 'failed', branding_status: 'pending', render_progress: 22, error_message: 'HeyGen voiceover API timeout', started_at: new Date(Date.now() - 1200000).toISOString() },
      { project_title: 'Citywide Dental — New Patient Welcome', client_name: 'Citywide Dental', vertical: 'Dental', format_type: 'explainer', status: 'queued', priority: 'normal', scene_count: 8, voiceover_status: 'pending', branding_status: 'pending', render_progress: 0 },
      { project_title: 'Apex Law — Brand Intro', client_name: 'Apex Law Partners', vertical: 'Legal', format_type: 'long_form', status: 'published', priority: 'low', scene_count: 10, voiceover_status: 'approved', branding_status: 'approved', render_progress: 100 },
    ]);

    await s.entities.ApprovalQueueItem.bulkCreate([
      { asset_title: 'Arctic Air — 5 Tips for Summer AC Prep', asset_type: 'article', client_name: 'Arctic Air HVAC', vertical: 'HVAC', status: 'awaiting_internal', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-11' },
      { asset_title: 'ProHeat Spring Promo — Facebook Video Ad', asset_type: 'video', client_name: 'ProHeat Systems', vertical: 'HVAC', status: 'awaiting_founder', review_urgency: 'urgent', revision_count: 1, submitted_date: '2026-03-10' },
      { asset_title: 'Precision Plumbing — Social Reel Series', asset_type: 'social_post', client_name: 'Precision Plumbing', vertical: 'Home Services', status: 'awaiting_client', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-09' },
      { asset_title: 'Mesa Grill — Happy Hour Email', asset_type: 'email', client_name: 'Mesa Grill Group', vertical: 'Restaurant', status: 'revision_requested', review_urgency: 'urgent', revision_count: 2, submitted_date: '2026-03-08' },
      { asset_title: 'Citywide Dental — New Patient Landing Page', asset_type: 'landing_page', client_name: 'Citywide Dental', vertical: 'Dental', status: 'awaiting_internal', review_urgency: 'low', revision_count: 0, submitted_date: '2026-03-12' },
      { asset_title: 'Arctic Air — GBP Weekly Post', asset_type: 'gbp_post', client_name: 'Arctic Air HVAC', vertical: 'HVAC', status: 'approved', review_urgency: 'normal', revision_count: 0, submitted_date: '2026-03-10' },
    ]);

    await s.entities.AutomationFailureLog.bulkCreate([
      { failure_type: 'api_error', source_system: 'HeyGen', client_name: 'CoolBreeze HVAC', error_message: 'API timeout after 3 retries — video generation stalled', error_code: 'TIMEOUT_503', severity: 'critical', status: 'open', retry_count: 3, affected_destination: 'Video Generation', auto_recoverable: false, occurred_at: new Date(Date.now() - 3600000).toISOString() },
      { failure_type: 'publish_failure', source_system: 'TikTok API', client_name: 'Mesa Grill Group', error_message: 'OAuth token expired — re-auth required', error_code: 'AUTH_401', severity: 'high', status: 'open', retry_count: 4, affected_destination: 'TikTok', auto_recoverable: false, occurred_at: new Date(Date.now() - 7200000).toISOString() },
      { failure_type: 'render_failure', source_system: 'Render Engine', client_name: 'ProHeat Systems', error_message: 'Branded intro template missing asset ID #1142', error_code: 'ASSET_NOT_FOUND', severity: 'high', status: 'retrying', retry_count: 1, affected_destination: 'Video Pipeline', auto_recoverable: true, occurred_at: new Date(Date.now() - 10800000).toISOString() },
      { failure_type: 'timeout', source_system: 'OpenAI GPT-4o', client_name: 'Blue Ridge Roofing', error_message: 'Request timeout at 30s — article generation incomplete', error_code: 'TIMEOUT_30S', severity: 'medium', status: 'open', retry_count: 2, affected_destination: 'Content Writing', auto_recoverable: true, occurred_at: new Date(Date.now() - 14400000).toISOString() },
    ]);

    await s.entities.ProductionCapacityMetric.bulkCreate([
      { category: 'content_generation', current_load: 78, max_capacity: 100, utilization_pct: 78, queue_depth: 24, avg_processing_time_minutes: 4.1, warning_state: 'nearing_capacity', throughput_per_hour: 14, period: 'March 2026' },
      { category: 'video_rendering', current_load: 96, max_capacity: 100, utilization_pct: 96, queue_depth: 18, avg_processing_time_minutes: 11.4, warning_state: 'bottleneck', throughput_per_hour: 5, period: 'March 2026' },
      { category: 'approvals', current_load: 42, max_capacity: 100, utilization_pct: 42, queue_depth: 11, avg_processing_time_minutes: 28, warning_state: 'normal', throughput_per_hour: 2, period: 'March 2026' },
      { category: 'publishing', current_load: 31, max_capacity: 100, utilization_pct: 31, queue_depth: 8, avg_processing_time_minutes: 2.2, warning_state: 'underutilized', throughput_per_hour: 22, period: 'March 2026' },
    ]);

    await s.entities.PublishingReadyAsset.bulkCreate([
      { asset_title: 'Arctic Air — 5 HVAC Tips Blog Post', content_type: 'article', client_name: 'Arctic Air HVAC', vertical: 'HVAC', destination: 'website', approval_status: 'approved', urgency: 'urgent', status: 'ready', campaign_tie_in: 'Spring Promo 2026', publish_schedule: new Date(Date.now() + 3600000).toISOString() },
      { asset_title: 'ProHeat Spring Reel', content_type: 'video', client_name: 'ProHeat Systems', vertical: 'HVAC', destination: 'instagram', approval_status: 'approved', urgency: 'urgent', status: 'ready', campaign_tie_in: 'Spring Awareness', publish_schedule: new Date(Date.now() + 7200000).toISOString() },
      { asset_title: 'Precision Plumbing — GBP Weekly Update', content_type: 'gbp_post', client_name: 'Precision Plumbing', vertical: 'Home Services', destination: 'gbp', approval_status: 'approved', urgency: 'normal', status: 'scheduled', publish_schedule: new Date(Date.now() + 86400000).toISOString() },
      { asset_title: 'Mesa Grill — Happy Hour Facebook Post', content_type: 'social_post', client_name: 'Mesa Grill Group', vertical: 'Restaurant', destination: 'facebook', approval_status: 'approved', urgency: 'normal', status: 'ready', campaign_tie_in: 'Happy Hour Q1', publish_schedule: new Date(Date.now() + 10800000).toISOString() },
      { asset_title: 'Apex Law — YouTube Explainer', content_type: 'video', client_name: 'Apex Law Partners', vertical: 'Legal', destination: 'youtube', approval_status: 'approved', urgency: 'scheduled', status: 'scheduled', publish_schedule: new Date(Date.now() + 172800000).toISOString() },
    ]);

    await s.entities.OpsInsight.bulkCreate([
      { insight_type: 'performance_spike', headline: 'HVAC video output up 34% this week', narrative: 'Arctic Air and ProHeat combined produced 22 videos this week vs. 16 last week — a significant production surge driven by the Spring promo campaign.', severity: 'info', status: 'new', related_system: 'Video Pipeline', related_client: 'Arctic Air HVAC' },
      { insight_type: 'bottleneck', headline: 'Restaurant content approvals lagging behind schedule', narrative: 'Mesa Grill and Taco Loco have 7 combined assets waiting for client approval for over 72 hours. Risk of delayed campaign launches.', severity: 'high', status: 'new', related_system: 'Approval Queue', related_client: 'Mesa Grill Group' },
      { insight_type: 'failure_trend', headline: 'Render failure trend isolated to branded intro scenes', narrative: 'Asset ID #1142 (branded intro template) causing 5 of 7 render failures this week. Template likely corrupted — recommend re-upload and re-render.', severity: 'critical', status: 'assigned', assigned_to: 'Ops Team', related_system: 'Video Render Engine' },
      { insight_type: 'capacity_alert', headline: 'Video render queue at 96% capacity — approaching limit', narrative: 'Current render queue depth will exceed maximum capacity within 4 hours if intake rate holds steady.', severity: 'high', status: 'new', related_system: 'Render Engine' },
    ]);

    return Response.json({ success: true, message: 'AI Operations Command seeded!' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});