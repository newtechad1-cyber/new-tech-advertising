import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { business_profile_id } = payload;

    if (!business_profile_id) {
      return Response.json({ error: 'business_profile_id required' }, { status: 400 });
    }

    // Fetch business profile
    const businessProfile = await base44.entities.BusinessProfile.get(business_profile_id);
    if (!businessProfile) {
      return Response.json({ error: 'Business profile not found' }, { status: 404 });
    }

    // Check if business has a website
    if (!businessProfile.website_url) {
      return Response.json({ success: true, signal_created: false, reason: 'No website URL provided' });
    }

    // Check if ADA accessibility opportunity already exists
    const existing = await base44.entities.OpportunitySignal.filter({
      business_profile_id,
      opportunity_type: 'website_accessibility',
    });

    if (existing.length > 0) {
      return Response.json({ success: true, signal_created: false, reason: 'Signal already exists' });
    }

    // Create ADA accessibility opportunity signal
    const signal = await base44.entities.OpportunitySignal.create({
      business_profile_id,
      industry_slug: businessProfile.industry_slug,
      city: businessProfile.city,
      state: businessProfile.state,
      opportunity_type: 'website_accessibility',
      title: 'Your Website May Not Be ADA Compliant',
      description: `Your website may have accessibility compliance issues that could expose ${businessProfile.business_name} to ADA lawsuits. Get a free audit to identify risks.`,
      priority: 75,
      demand_score: 85,
      competition_score: 30,
      readiness_score: 90,
      revenue_potential_score: 80,
      confidence_score: 70,
      overall_opportunity_score: 81,
      recommended_action_type: 'improve_cta',
      recommended_content_type: 'landing_page',
      recommended_video_type: 'avatar_video',
      recommended_offer: 'Free ADA Website Audit',
      recommended_cta: 'Check Your Website',
      truth_state: 'observed',
      status: 'active',
    });

    return Response.json({
      success: true,
      signal_created: true,
      signal_id: signal.id,
      message: 'ADA accessibility opportunity signal created',
    });
  } catch (error) {
    console.error('[generateAdaOpportunitySignals] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});