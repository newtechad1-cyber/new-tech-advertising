import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { campaign_id } = await req.json();
  if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });

  const campaigns = await base44.asServiceRole.entities.Campaign.filter({ id: campaign_id });
  const campaign = campaigns[0];
  if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

  // Fetch client for context
  let clientContext = '';
  if (campaign.client_id) {
    const clients = await base44.asServiceRole.entities.Client.filter({ id: campaign.client_id });
    const c = clients[0];
    if (c) {
      clientContext = `Business: ${c.business_name}, Industry: ${c.industry || 'local service'}, Location: ${c.service_area || campaign.location || 'North Iowa'}, Services: ${c.primary_services || campaign.service_focus}, Brand Voice: ${c.brand_voice || 'friendly and professional'}`;
    }
  }

  const prompt = `You are an expert local business marketing strategist for NTA (New Tech Advertising) in North Iowa.

Generate a complete campaign content pack for this local service business.

Campaign Details:
- Name: ${campaign.campaign_name}
- Season: ${campaign.season}
- Service Focus: ${campaign.service_focus}
- Offer: ${campaign.offer || 'Free estimate'}
- Location: ${campaign.location || 'North Iowa'}
- Target Audience: ${campaign.target_audience || 'Local homeowners'}
- Client Info: ${clientContext}

Generate:
1. landing_page_outline: A structured landing page outline with headline, subheadline, problem section, solution section, offer section, social proof section, FAQ section, and CTA
2. facebook_ads: Array of 5 Facebook ad copy sets, each with headline, primary_text, and cta_button
3. social_posts: Array of 5 social media posts (mix of educational, promotional, seasonal, trust-building)
4. image_overlay_ideas: Array of 3 image overlay/graphic ideas with description of visual and text overlay
5. video_script: A 60-90 second HeyGen-ready video script with hook, problem, solution, offer, and CTA
6. faq_block: Array of 5 FAQ questions and answers relevant to this service and season
7. seo_page_suggestions: Array of 3 suggested SEO page titles with target keywords`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        landing_page_outline: { type: 'string' },
        facebook_ads: { type: 'array', items: { type: 'object', properties: { headline: { type: 'string' }, primary_text: { type: 'string' }, cta_button: { type: 'string' } } } },
        social_posts: { type: 'array', items: { type: 'string' } },
        image_overlay_ideas: { type: 'array', items: { type: 'string' } },
        video_script: { type: 'string' },
        faq_block: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, a: { type: 'string' } } } },
        seo_page_suggestions: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, keyword: { type: 'string' } } } },
      },
    },
  });

  // Save landing page as ContentAsset
  await base44.asServiceRole.entities.ContentAsset.create({
    client_id: campaign.client_id,
    campaign_id,
    asset_type: 'landing_page',
    title: `Landing Page — ${campaign.campaign_name}`,
    content: result.landing_page_outline,
    platform: 'website',
    status: 'draft',
    approval_status: 'pending',
  });

  // Save Facebook ads
  for (let i = 0; i < (result.facebook_ads || []).length; i++) {
    const ad = result.facebook_ads[i];
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id: campaign.client_id,
      campaign_id,
      asset_type: 'ad_copy',
      title: `Facebook Ad ${i + 1} — ${ad.headline}`,
      content: `HEADLINE: ${ad.headline}\n\nPRIMARY TEXT: ${ad.primary_text}\n\nCTA: ${ad.cta_button}`,
      platform: 'facebook',
      status: 'draft',
      approval_status: 'pending',
    });
  }

  // Save social posts
  for (let i = 0; i < (result.social_posts || []).length; i++) {
    await base44.asServiceRole.entities.SocialPost.create({
      client_id: campaign.client_id,
      campaign_id,
      platform: 'facebook',
      post_text: result.social_posts[i],
      status: 'draft',
      approval_status: 'pending',
    });
  }

  // Save video script
  await base44.asServiceRole.entities.VideoScript.create({
    client_id: campaign.client_id,
    campaign_id,
    title: `Video Script — ${campaign.campaign_name}`,
    script: result.video_script,
    status: 'draft',
    heygen_status: 'not_submitted',
  });

  // Save FAQ as SEO page content
  const faqJson = JSON.stringify(result.faq_block || []);
  await base44.asServiceRole.entities.SEOPage.create({
    client_id: campaign.client_id,
    campaign_id,
    page_title: `${campaign.service_focus} in ${campaign.location || 'North Iowa'}`,
    url_slug: `${(campaign.service_focus || 'services').toLowerCase().replace(/\s+/g, '-')}-${(campaign.location || 'north-iowa').toLowerCase().replace(/\s+/g, '-')}`,
    target_keyword: `${campaign.service_focus} ${campaign.location || 'North Iowa'}`,
    city: campaign.location || '',
    service: campaign.service_focus || '',
    faq_json: faqJson,
    status: 'draft',
  });

  return Response.json({
    success: true,
    campaign_id,
    assets_created: {
      landing_page: 1,
      facebook_ads: (result.facebook_ads || []).length,
      social_posts: (result.social_posts || []).length,
      video_script: 1,
      seo_page: 1,
    },
    seo_suggestions: result.seo_page_suggestions,
    image_overlay_ideas: result.image_overlay_ideas,
  });
});