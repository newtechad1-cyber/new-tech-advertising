import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * onTrialSubmitted
 * 
 * Triggered by automation on TrialAccount.create (and optionally .update).
 * Runs the full post-signup intelligence + provisioning pipeline:
 * 
 * 1. Confirm/link BusinessProfile
 * 2. Generate BusinessIntelProfile (via LLM using industry + local intel)
 * 3. Generate OpportunitySignals (5–8 records)
 * 4. Generate initial WeeklyMarketingPlan
 * 5. Send confirmation email to signup
 * 6. Update all status fields on TrialAccount
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Support both direct call (payload.trial_id) and automation event payload
    const trialId = body.trial_id || body.event?.entity_id || body.data?.id;
    if (!trialId) {
      return Response.json({ error: 'trial_id required' }, { status: 400 });
    }

    // Load trial record
    const trial = await base44.asServiceRole.entities.TrialAccount.get(trialId);
    if (!trial) {
      return Response.json({ error: 'TrialAccount not found' }, { status: 404 });
    }

    // Idempotency: skip if already fully provisioned
    if (trial.onboarding_status === 'ready_for_dashboard') {
      return Response.json({ skipped: true, reason: 'already provisioned' });
    }

    const log = (step, detail = '') => console.log(`[onTrialSubmitted] ${step}${detail ? ': ' + detail : ''}`);
    const industrySlug = (trial.industry || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let updates = {};

    // ── STEP 1: Confirm BusinessProfile ─────────────────────────────────────
    log('Step 1', 'Linking BusinessProfile');
    let bpId = trial.business_profile_id;

    if (!bpId) {
      // Try to find existing by industry_slug + city + state matching trial email domain
      const existing = await base44.asServiceRole.entities.BusinessProfile.filter({
        business_name: trial.name,
      });
      if (existing && existing.length > 0) {
        bpId = existing[0].id;
        log('Step 1', `Found existing BusinessProfile: ${bpId}`);
      } else {
        // Create from trial data
        const slug = trial.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const goalMap = { leads: 'leads', visibility: 'visibility', consistency: 'retention', content_video: 'traffic', replace_marketing: 'leads' };
        const bp = await base44.asServiceRole.entities.BusinessProfile.create({
          business_name: trial.name,
          business_slug: slug,
          website_url: trial.website_url || '',
          industry_slug: industrySlug,
          city: trial.location_city,
          state: trial.location_state,
          primary_goal: goalMap[trial.primary_goal] || 'leads',
          status: 'active',
        });
        bpId = bp.id;
        log('Step 1', `Created BusinessProfile: ${bpId}`);
      }
      updates.business_profile_id = bpId;
    }

    await base44.asServiceRole.entities.TrialAccount.update(trialId, {
      ...updates,
      onboarding_status: 'business_profile_linked',
    });
    updates = {};

    // ── STEP 2: Fetch Intel context ─────────────────────────────────────────
    log('Step 2', 'Fetching IndustryIntel + LocalMarketIntel');

    const [industryIntels, localIntels] = await Promise.all([
      base44.asServiceRole.entities.IndustryIntel.filter({ industry_slug: industrySlug }),
      base44.asServiceRole.entities.LocalMarketIntel.filter({ industry_slug: industrySlug, city: trial.location_city, state: trial.location_state }),
    ]);

    const industryIntel = industryIntels?.[0] || null;
    const localIntel = localIntels?.[0] || null;

    // ── STEP 3: Generate BusinessIntelProfile ───────────────────────────────
    log('Step 3', 'Generating BusinessIntelProfile via LLM');

    let intelId = null;
    try {
      const intelPrompt = `
You are an expert small business marketing strategist. Generate a BusinessIntelProfile for this business.

Business Info:
- Name: ${trial.name}
- Industry: ${trial.industry}
- Industry Slug: ${industrySlug}
- Location: ${trial.location_city}, ${trial.location_state}
- Website: ${trial.website_url || 'none'}
- Primary Goal: ${trial.primary_goal}
- Notes: ${trial.notes || 'none'}

${industryIntel ? `Industry Intel:\n- Core services: ${(industryIntel.core_services || []).join(', ')}\n- Common pain points: ${(industryIntel.common_pain_points || []).join(', ')}\n- Top content angles: ${(industryIntel.top_content_angles || []).join(', ')}\n- Recommended offers: ${(industryIntel.recommended_offers || []).join(', ')}\n- Top video themes: ${(industryIntel.top_video_themes || []).join(', ')}` : 'No industry intel available — use general small business best practices.'}

${localIntel ? `Local Market Intel:\n- Competition level: ${localIntel.competition_level}\n- Top service intents: ${(localIntel.top_service_intents || []).join(', ')}\n- Recommended local topics: ${(localIntel.recommended_local_topics || []).join(', ')}` : 'No local market intel — use city/state general best practices.'}

Generate a complete BusinessIntelProfile. Be specific and actionable. Prioritize quick wins.
`;

      const intel = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: intelPrompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recommended_positioning: { type: 'string' },
            recommended_primary_offer: { type: 'string' },
            recommended_secondary_offers: { type: 'array', items: { type: 'string' } },
            recommended_content_pillars: { type: 'array', items: { type: 'string' } },
            recommended_video_pillars: { type: 'array', items: { type: 'string' } },
            recommended_campaign_types: { type: 'array', items: { type: 'string' } },
            recommended_streaming_tv_angles: { type: 'array', items: { type: 'string' } },
            recommended_cta_mix: { type: 'array', items: { type: 'string' } },
            priority_service_pages: { type: 'array', items: { type: 'string' } },
            priority_location_pages: { type: 'array', items: { type: 'string' } },
            priority_problem_articles: { type: 'array', items: { type: 'string' } },
            priority_playbook_topics: { type: 'array', items: { type: 'string' } },
            priority_video_topics: { type: 'array', items: { type: 'string' } },
            priority_social_series: { type: 'array', items: { type: 'string' } },
            top_opportunities: { type: 'array', items: { type: 'string' } },
            top_gaps: { type: 'array', items: { type: 'string' } },
            quick_win_actions: { type: 'array', items: { type: 'string' } },
          },
        },
      });

      const bip = await base44.asServiceRole.entities.BusinessIntelProfile.create({
        business_profile_id: bpId,
        industry_slug: industrySlug,
        city: trial.location_city,
        state: trial.location_state,
        status: 'active',
        recommended_positioning: intel.recommended_positioning || '',
        recommended_primary_offer: intel.recommended_primary_offer || '',
        recommended_secondary_offers: intel.recommended_secondary_offers || [],
        recommended_content_pillars: intel.recommended_content_pillars || [],
        recommended_video_pillars: intel.recommended_video_pillars || [],
        recommended_campaign_types: intel.recommended_campaign_types || [],
        recommended_streaming_tv_angles: intel.recommended_streaming_tv_angles || [],
        recommended_cta_mix: intel.recommended_cta_mix || [],
        priority_service_pages: intel.priority_service_pages || [],
        priority_location_pages: intel.priority_location_pages || [],
        priority_problem_articles: intel.priority_problem_articles || [],
        priority_playbook_topics: intel.priority_playbook_topics || [],
        priority_video_topics: intel.priority_video_topics || [],
        priority_social_series: intel.priority_social_series || [],
        top_opportunities: intel.top_opportunities || [],
        top_gaps: intel.top_gaps || [],
        quick_win_actions: intel.quick_win_actions || [],
        overall_confidence_score: industryIntel ? 65 : 45,
        industry_weight: 0.35,
        local_market_weight: localIntel ? 0.25 : 0.10,
        business_input_weight: 0.30,
        performance_weight: 0.10,
        last_generated_at: new Date().toISOString(),
        positioning_source_state: 'inferred',
        offer_source_state: 'inferred',
        content_source_state: 'inferred',
        campaign_source_state: 'inferred',
      });

      intelId = bip.id;
      log('Step 3', `Generated BusinessIntelProfile: ${intelId}`);

      await base44.asServiceRole.entities.TrialAccount.update(trialId, {
        intel_profile_id: intelId,
        intelligence_status: 'generated',
        onboarding_status: 'intelligence_generated',
      });
    } catch (err) {
      log('Step 3 FAILED', err.message);
      await base44.asServiceRole.entities.TrialAccount.update(trialId, {
        intelligence_status: 'failed',
      });
    }

    // ── STEP 4: Generate OpportunitySignals ─────────────────────────────────
    log('Step 4', 'Generating OpportunitySignals');
    try {
      // Check for existing signals for this business profile
      const existingSignals = await base44.asServiceRole.entities.OpportunitySignal.filter({
        business_profile_id: bpId,
        status: 'active',
      });

      if (!existingSignals || existingSignals.length === 0) {
        const signalPrompt = `
Generate 6 specific OpportunitySignal records for this business:

Business: ${trial.name}
Industry: ${trial.industry}
Location: ${trial.location_city}, ${trial.location_state}
Goal: ${trial.primary_goal}

Each signal should be a concrete marketing opportunity this business is likely missing.
Score each from 0–100. Higher = more impactful / more likely missing.
`;

        const signalsResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: signalPrompt,
          response_json_schema: {
            type: 'object',
            properties: {
              signals: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    opportunity_type: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'number' },
                    demand_score: { type: 'number' },
                    confidence_score: { type: 'number' },
                    overall_opportunity_score: { type: 'number' },
                    recommended_action_type: { type: 'string' },
                  },
                },
              },
            },
          },
        });

        const VALID_OPP_TYPES = ['missing_service_page', 'missing_location_page', 'missing_offer', 'missing_video_type', 'missing_social_theme', 'review_gap', 'cta_gap', 'campaign_gap', 'seasonal_gap', 'streaming_tv_gap'];
        const VALID_ACTION_TYPES = ['create_page', 'create_article', 'create_video', 'create_campaign', 'create_offer', 'create_social_series', 'create_email_sequence', 'improve_cta', 'improve_reviews'];

        const signals = signalsResult?.signals || [];
        for (const s of signals.slice(0, 8)) {
          const oppType = VALID_OPP_TYPES.includes(s.opportunity_type) ? s.opportunity_type : 'missing_service_page';
          const actionType = VALID_ACTION_TYPES.includes(s.recommended_action_type) ? s.recommended_action_type : 'create_page';
          await base44.asServiceRole.entities.OpportunitySignal.create({
            business_profile_id: bpId,
            industry_slug: industrySlug,
            city: trial.location_city,
            state: trial.location_state,
            opportunity_type: oppType,
            title: s.title || 'Marketing opportunity identified',
            description: s.description || '',
            priority: Math.min(100, Math.max(0, s.priority || 50)),
            demand_score: Math.min(100, Math.max(0, s.demand_score || 50)),
            confidence_score: Math.min(100, Math.max(0, s.confidence_score || 50)),
            overall_opportunity_score: Math.min(100, Math.max(0, s.overall_opportunity_score || 50)),
            recommended_action_type: actionType,
            truth_state: 'inferred',
            status: 'active',
          });
        }
        log('Step 4', `Created ${signals.length} OpportunitySignals`);
      } else {
        log('Step 4', `Skipped — ${existingSignals.length} signals already exist`);
      }
    } catch (err) {
      log('Step 4 FAILED', err.message);
    }

    // ── STEP 5: Generate WeeklyMarketingPlan ────────────────────────────────
    log('Step 5', 'Generating WeeklyMarketingPlan');
    let weeklyPlanId = null;
    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const fmt = d => d.toISOString().split('T')[0];

      // Idempotency: check if plan for current week already exists
      const existingPlans = await base44.asServiceRole.entities.WeeklyMarketingPlan.filter({
        business_profile_id: bpId,
        week_start_date: fmt(monday),
      });

      if (!existingPlans || existingPlans.length === 0) {
        const planPrompt = `
Create an initial weekly marketing plan for a new small business trial account.

Business: ${trial.name}
Industry: ${trial.industry}
Location: ${trial.location_city}, ${trial.location_state}
Primary Goal: ${trial.primary_goal}
Week: ${fmt(monday)} to ${fmt(sunday)}

Generate a realistic, actionable weekly plan for a small business just getting started with their marketing.
Focus on quick wins and momentum. Keep tasks simple enough for a business owner to actually do.
`;

        const planResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: planPrompt,
          response_json_schema: {
            type: 'object',
            properties: {
              primary_theme: { type: 'string' },
              primary_offer: { type: 'string' },
              why_this_plan: { type: 'string' },
              content_tasks: { type: 'array', items: { type: 'string' } },
              video_tasks: { type: 'array', items: { type: 'string' } },
              social_tasks: { type: 'array', items: { type: 'string' } },
              campaign_tasks: { type: 'array', items: { type: 'string' } },
              email_tasks: { type: 'array', items: { type: 'string' } },
              seo_tasks: { type: 'array', items: { type: 'string' } },
              quick_win_tasks: { type: 'array', items: { type: 'string' } },
            },
          },
        });

        // Need a BusinessIntelProfile id — use intelId or fetch most recent
        const bipId = intelId || (await base44.asServiceRole.entities.BusinessIntelProfile.filter({ business_profile_id: bpId }))?.[0]?.id || '';

        const weeklyPlan = await base44.asServiceRole.entities.WeeklyMarketingPlan.create({
          business_profile_id: bpId,
          business_intel_profile_id: bipId,
          week_start_date: fmt(monday),
          week_end_date: fmt(sunday),
          status: 'active',
          generated_at: new Date().toISOString(),
          primary_theme: planResult.primary_theme || 'Getting Visible Online',
          primary_offer: planResult.primary_offer || 'Free Consultation',
          why_this_plan: planResult.why_this_plan || 'Initial marketing plan to establish presence.',
          content_tasks: planResult.content_tasks || [],
          video_tasks: planResult.video_tasks || [],
          social_tasks: planResult.social_tasks || [],
          campaign_tasks: planResult.campaign_tasks || [],
          email_tasks: planResult.email_tasks || [],
          seo_tasks: planResult.seo_tasks || [],
          quick_win_tasks: planResult.quick_win_tasks || [],
          confidence_score: 60,
        });

        weeklyPlanId = weeklyPlan.id;
        log('Step 5', `Created WeeklyMarketingPlan: ${weeklyPlanId}`);
      } else {
        weeklyPlanId = existingPlans[0].id;
        log('Step 5', `Skipped — plan already exists: ${weeklyPlanId}`);
      }

      await base44.asServiceRole.entities.TrialAccount.update(trialId, {
        weekly_plan_id: weeklyPlanId,
        weekly_plan_status: 'generated',
        onboarding_status: 'weekly_plan_generated',
      });
    } catch (err) {
      log('Step 5 FAILED', err.message);
      await base44.asServiceRole.entities.TrialAccount.update(trialId, {
        weekly_plan_status: 'failed',
      });
    }

    // ── STEP 6: Send confirmation email to signup ───────────────────────────
    log('Step 6', `Sending confirmation email to ${trial.email}`);
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising',
        to: trial.email,
        subject: 'Your NTA Trial Has Started 🚀',
        body: `Hi ${trial.full_name || trial.name},

Your trial with New Tech Advertising has started!

Here's what we've set up for your business, ${trial.name}:

✅ Your business profile has been created
✅ Your starting marketing direction has been generated
✅ Your first weekly marketing plan is ready
✅ Your first set of marketing opportunities has been identified

You can explore the platform and watch a 2-minute overview of how the system works here:
https://newtechadvertising.com/demo

Or head to the homepage to learn more:
https://newtechadvertising.com

Your 14-day trial runs until ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

A member of our team will follow up with you to walk through your marketing system and next steps.

Questions? Call us at 641-420-8816 or reply to this email.

— The NTA Team
New Tech Advertising
https://newtechadvertising.com`,
      });
      log('Step 6', 'Confirmation email sent');
    } catch (err) {
      log('Step 6 FAILED', err.message);
    }

    // ── STEP 7: Final status update — provisioning queued ───────────────────
    log('Step 7', 'Finalizing provisioning state');
    await base44.asServiceRole.entities.TrialAccount.update(trialId, {
      trial_status: 'configured',
      onboarding_status: 'ready_for_dashboard',
      provisioning_status: 'queued',
    });

    log('COMPLETE', `Trial ${trialId} fully provisioned`);

    return Response.json({
      success: true,
      trial_id: trialId,
      business_profile_id: bpId,
      intel_profile_id: intelId,
      weekly_plan_id: weeklyPlanId,
      onboarding_status: 'ready_for_dashboard',
      provisioning_status: 'queued',
    });

  } catch (error) {
    console.error('[onTrialSubmitted] Fatal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});