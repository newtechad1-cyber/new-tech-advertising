import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SEASON_RULES = {
  spring: 'AC checkups, tune-ups, prep for summer heat, HVAC maintenance, spring cleaning services',
  summer: 'AC repair, emergency cooling, 24/7 service calls, energy efficiency upgrades',
  fall: 'Furnace tune-ups, winter prep, heating system checks, air quality, insulation',
  winter: 'No heat emergencies, furnace repair, boiler service, emergency HVAC, pipes and heating',
  year_round: 'General maintenance, all-season service plans, comfort guarantees',
  custom: 'Custom seasonal focus as specified',
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { client_id, season, service_focus, offer, location } = await req.json();
  if (!client_id || !season) return Response.json({ error: 'client_id and season required' }, { status: 400 });

  // Fetch client
  const clients = await base44.asServiceRole.entities.Client.filter({ id: client_id });
  const client = clients[0];
  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 });

  const seasonContext = SEASON_RULES[season] || SEASON_RULES.year_round;
  const focus = service_focus || client.primary_services || 'HVAC';
  const loc = location || client.service_area || 'North Iowa';
  const campaignOffer = offer || 'Free estimate';

  // Create Campaign record first
  const campaign = await base44.asServiceRole.entities.Campaign.create({
    client_id,
    campaign_name: `${client.business_name} — ${season.charAt(0).toUpperCase() + season.slice(1)} ${focus} Campaign`,
    season,
    service_focus: focus,
    offer: campaignOffer,
    location: loc,
    target_audience: `Homeowners in ${loc}`,
    status: 'planning',
    notes: `Auto-generated seasonal campaign. Season context: ${seasonContext}`,
  });

  const prompt = `You are an expert local service business marketing strategist for NTA (New Tech Advertising) in North Iowa.

Generate a complete seasonal campaign content pack for this business.

Client: ${client.business_name}
Industry: ${client.industry || 'HVAC/Home Services'}
Location: ${loc}
Season: ${season}
Season Focus: ${seasonContext}
Service Focus: ${focus}
Offer: ${campaignOffer}
Brand Voice: ${client.brand_voice || 'friendly, local, trustworthy'}

Generate:
1. landing_page_copy: Full landing page copy with headline, hero text, problem section, solution section, offer block, trust signals, and CTA
2. social_posts: Array of 10 social media posts (mix of tips, promotions, testimonial placeholders, seasonal urgency, educational)
3. facebook_ads: Array of 3 Facebook ad copy sets, each with headline, primary_text, description, cta_button
4. google_ad: Single Google Search ad with 3 headlines and 2 descriptions
5. video_script: 60-90 second HeyGen-ready video script with hook, problem, solution, offer, social proof, and CTA
6. faq_questions: Array of 5 frequently asked questions with answers specific to this season and service
7. seo_page_suggestions: Array of 5 suggested local SEO page titles with target keywords for this season/service/location combo`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        landing_page_copy: { type: 'string' },
        social_posts: { type: 'array', items: { type: 'string' } },
        facebook_ads: { type: 'array', items: { type: 'object', properties: { headline: { type: 'string' }, primary_text: { type: 'string' }, description: { type: 'string' }, cta_button: { type: 'string' } } } },
        google_ad: { type: 'object', properties: { headlines: { type: 'array', items: { type: 'string' } }, descriptions: { type: 'array', items: { type: 'string' } } } },
        video_script: { type: 'string' },
        faq_questions: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, a: { type: 'string' } } } },
        seo_page_suggestions: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, keyword: { type: 'string' }, slug: { type: 'string' } } } },
      },
    },
  });

  // Save landing page
  await base44.asServiceRole.entities.ContentAsset.create({
    client_id, campaign_id: campaign.id,
    asset_type: 'landing_page',
    title: `Landing Page — ${campaign.campaign_name}`,
    content: result.landing_page_copy,
    platform: 'website', status: 'draft', approval_status: 'pending',
  });

  // Save 10 social posts
  for (let i = 0; i < (result.social_posts || []).length; i++) {
    await base44.asServiceRole.entities.SocialPost.create({
      client_id, campaign_id: campaign.id,
      platform: 'facebook',
      post_text: result.social_posts[i],
      status: 'draft', approval_status: 'pending',
    });
  }

  // Save Facebook ads
  for (let i = 0; i < (result.facebook_ads || []).length; i++) {
    const ad = result.facebook_ads[i];
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id, campaign_id: campaign.id,
      asset_type: 'ad_copy',
      title: `Facebook Ad ${i + 1} — ${ad.headline}`,
      content: `HEADLINE: ${ad.headline}\n\nPRIMARY TEXT: ${ad.primary_text}\n\nDESCRIPTION: ${ad.description}\n\nCTA: ${ad.cta_button}`,
      platform: 'facebook', status: 'draft', approval_status: 'pending',
    });
  }

  // Save Google ad
  if (result.google_ad) {
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id, campaign_id: campaign.id,
      asset_type: 'ad_copy',
      title: `Google Search Ad — ${campaign.campaign_name}`,
      content: `HEADLINES:\n${(result.google_ad.headlines || []).join('\n')}\n\nDESCRIPTIONS:\n${(result.google_ad.descriptions || []).join('\n')}`,
      platform: 'website', status: 'draft', approval_status: 'pending',
      notes: 'Google Search Ad',
    });
  }

  // Save video script
  await base44.asServiceRole.entities.VideoScript.create({
    client_id, campaign_id: campaign.id,
    title: `${season.charAt(0).toUpperCase() + season.slice(1)} Video Script — ${client.business_name}`,
    script: result.video_script,
    status: 'draft', heygen_status: 'not_submitted',
  });

  // Save SEO page suggestions
  for (const page of (result.seo_page_suggestions || [])) {
    await base44.asServiceRole.entities.SEOPage.create({
      client_id, campaign_id: campaign.id,
      page_title: page.title,
      url_slug: page.slug || page.keyword?.toLowerCase().replace(/\s+/g, '-') || '',
      target_keyword: page.keyword,
      city: loc, service: focus,
      faq_json: JSON.stringify(result.faq_questions || []),
      status: 'draft',
    });
  }

  return Response.json({
    success: true,
    campaign_id: campaign.id,
    campaign_name: campaign.campaign_name,
    assets_created: {
      landing_page: 1,
      social_posts: (result.social_posts || []).length,
      facebook_ads: (result.facebook_ads || []).length,
      google_ad: 1,
      video_script: 1,
      seo_pages: (result.seo_page_suggestions || []).length,
    },
  });
});