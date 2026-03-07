import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function getWeekBounds() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { business_profile_id } = await req.json();
    if (!business_profile_id) return Response.json({ error: 'business_profile_id required' }, { status: 400 });

    const bp = await base44.asServiceRole.entities.BusinessProfile.get(business_profile_id);
    if (!bp) return Response.json({ error: 'BusinessProfile not found' }, { status: 404 });

    const bipList = await base44.asServiceRole.entities.BusinessIntelProfile.filter({ business_profile_id });
    const bip = bipList[0];
    if (!bip) return Response.json({ error: 'BusinessIntelProfile not found — run generateBusinessIntelProfile first' }, { status: 400 });

    const intelList = await base44.asServiceRole.entities.IndustryIntel.filter({ industry_slug: bp.industry_slug });
    const intel = intelList[0] || null;

    // Get top opportunity signals
    const signals = await base44.asServiceRole.entities.OpportunitySignal.filter({ business_profile_id, status: 'active' }, '-overall_opportunity_score', 10);

    const { start, end } = getWeekBounds();
    const topSignal = signals[0];

    // Primary theme from top opportunity
    const primaryTheme = topSignal?.title?.split(':')[1]?.trim() || bip.recommended_content_pillars?.[0] || 'Build local authority';
    const primaryOffer = bip.recommended_primary_offer || intel?.recommended_offers?.[0] || 'Free consultation';

    // Content tasks — 1–2 items
    const contentTasks = [];
    if (bip.priority_problem_articles?.length > 0) {
      contentTasks.push(JSON.stringify({
        type: 'article',
        action: 'create_article',
        title: bip.priority_problem_articles[0],
        target_keyword: intel?.top_problem_topics?.[0] || bip.priority_problem_articles[0],
        cta: primaryOffer,
        priority: 'high'
      }));
    }
    if (bip.priority_service_pages?.length > 0 && !bp.has_service_pages) {
      contentTasks.push(JSON.stringify({
        type: 'service_page',
        action: 'create_page',
        title: bip.priority_service_pages[0],
        cta: 'Request Free Estimate',
        priority: 'high'
      }));
    }

    // Video task — 1 item
    const videoTasks = [];
    const videoTopic = bip.recommended_video_pillars?.[0] || intel?.top_video_themes?.[0] || 'Brand explainer video';
    videoTasks.push(JSON.stringify({
      type: 'short_social_video',
      action: 'create_video',
      title: `30-second video: ${videoTopic}`,
      platform: 'instagram,facebook',
      priority: 'medium'
    }));

    // Social tasks — 2–4 items
    const socialTasks = (bip.priority_social_series || intel?.top_social_themes || []).slice(0, 4).map(theme =>
      JSON.stringify({ type: 'social_post', action: 'create_social_series', theme, platforms: ['facebook', 'instagram'], priority: 'medium' })
    );

    // Campaign task — 1 item
    const campaignTasks = [];
    if (signals.find(s => s.opportunity_type === 'streaming_tv_gap')) {
      campaignTasks.push(JSON.stringify({
        type: 'streaming_tv_campaign',
        action: 'create_campaign',
        title: `Streaming TV: ${bip.recommended_streaming_tv_angles?.[0] || primaryTheme}`,
        offer: primaryOffer,
        cta: 'Call Now or Visit Our Website',
        priority: 'high'
      }));
    } else {
      campaignTasks.push(JSON.stringify({
        type: 'social_campaign',
        action: 'create_campaign',
        title: `Social campaign: ${primaryTheme}`,
        offer: primaryOffer,
        priority: 'medium'
      }));
    }

    // Email task
    const emailTasks = [];
    if (bp.has_email_list) {
      emailTasks.push(JSON.stringify({
        type: 'email_campaign',
        action: 'create_email_sequence',
        subject: `${primaryOffer} — Limited Time for ${bp.city} Customers`,
        goal: bp.primary_goal || 'leads',
        priority: 'medium'
      }));
    }

    // SEO tasks — 1–2 items
    const seoTasks = [];
    if (!bp.has_service_pages) {
      seoTasks.push(JSON.stringify({ action: 'create_page', title: `Service page: ${bp.core_services?.[0] || 'Core service'}`, type: 'service_page', priority: 'high' }));
    }
    if (!bp.has_google_business_profile) {
      seoTasks.push(JSON.stringify({ action: 'improve_cta', title: 'Claim and optimize Google Business Profile', type: 'local_seo', priority: 'critical' }));
    } else {
      seoTasks.push(JSON.stringify({ action: 'improve_reviews', title: 'Add 5 new Google reviews this week via email/SMS ask', type: 'local_seo', priority: 'medium' }));
    }

    // Quick wins — 1 item
    const quickWinTasks = [(bip.quick_win_actions?.[0] || 'Post one educational tip to all social channels today')].map(t =>
      JSON.stringify({ action: 'quick_win', title: t, priority: 'immediate' })
    );

    const whyThisPlan = `This plan is generated from ${bip.truth_state !== undefined ? bip.positioning_source_state : 'assumed'} intelligence for ${bp.business_name}. ` +
      `Top opportunity: ${topSignal?.title || 'Build foundational digital presence'}. ` +
      `Primary goal: ${bp.primary_goal || 'leads'}. ` +
      `Confidence: ${bip.overall_confidence_score}/100.`;

    const sourceMixSummary = `Industry intelligence: ${Math.round((bip.industry_weight || 0.35) * 100)}% | ` +
      `Local market: ${Math.round((bip.local_market_weight || 0.25) * 100)}% | ` +
      `Business inputs: ${Math.round((bip.business_input_weight || 0.30) * 100)}% | ` +
      `Performance data: ${Math.round((bip.performance_weight || 0.10) * 100)}%`;

    // Delete existing plan for this week if any
    const existingPlans = await base44.asServiceRole.entities.WeeklyMarketingPlan.filter({ business_profile_id, week_start_date: start });
    for (const plan of existingPlans) {
      await base44.asServiceRole.entities.WeeklyMarketingPlan.delete(plan.id);
    }

    const plan = await base44.asServiceRole.entities.WeeklyMarketingPlan.create({
      business_profile_id,
      business_intel_profile_id: bip.id,
      week_start_date: start,
      week_end_date: end,
      status: 'active',
      generated_at: new Date().toISOString(),
      primary_theme: primaryTheme,
      primary_offer: primaryOffer,
      content_tasks: contentTasks,
      video_tasks: videoTasks,
      social_tasks: socialTasks,
      campaign_tasks: campaignTasks,
      email_tasks: emailTasks,
      seo_tasks: seoTasks,
      quick_win_tasks: quickWinTasks,
      why_this_plan: whyThisPlan,
      source_mix_summary: sourceMixSummary,
      confidence_score: bip.overall_confidence_score || 50
    });

    return Response.json({ success: true, plan_id: plan.id, week_start: start, week_end: end, theme: primaryTheme });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});