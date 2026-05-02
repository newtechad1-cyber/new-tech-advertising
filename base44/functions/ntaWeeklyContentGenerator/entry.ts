import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { client_id, campaign_id } = await req.json();
  if (!client_id) return Response.json({ error: 'client_id required' }, { status: 400 });

  const clients = await base44.asServiceRole.entities.Client.filter({ id: client_id });
  const client = clients[0];
  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 });

  const weekLabel = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `You are an expert social media content strategist for NTA (New Tech Advertising), serving local service businesses in North Iowa.

Generate one week of content for this local service business.

Client: ${client.business_name}
Industry: ${client.industry || 'local service business'}
Location: ${client.service_area || 'North Iowa'}
Services: ${client.primary_services || 'general services'}
Brand Voice: ${client.brand_voice || 'friendly, local, trustworthy, helpful'}
Week of: ${weekLabel}

Generate:
1. facebook_posts: Array of 3 Facebook posts (variety: one tip, one story/trust, one local/community)
2. promotional_post: 1 promotional post with a strong offer CTA
3. educational_post: 1 educational post (how-to tip, myth-busting, or FAQ-style)
4. video_script: Short 30-45 second video script for a quick tip or seasonal message
5. ad_refresh: 1 new ad copy idea to test (headline + body + CTA)
6. seo_blog_topic: Object with title, target_keyword, and brief outline for a blog/SEO article`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        facebook_posts: { type: 'array', items: { type: 'string' } },
        promotional_post: { type: 'string' },
        educational_post: { type: 'string' },
        video_script: { type: 'string' },
        ad_refresh: { type: 'object', properties: { headline: { type: 'string' }, body: { type: 'string' }, cta: { type: 'string' } } },
        seo_blog_topic: { type: 'object', properties: { title: { type: 'string' }, target_keyword: { type: 'string' }, outline: { type: 'string' } } },
      },
    },
  });

  const savedPosts = [];

  // Save 3 Facebook posts
  for (let i = 0; i < (result.facebook_posts || []).length; i++) {
    const post = await base44.asServiceRole.entities.SocialPost.create({
      client_id,
      campaign_id: campaign_id || '',
      platform: 'facebook',
      post_text: result.facebook_posts[i],
      status: 'draft',
      approval_status: 'pending',
    });
    savedPosts.push(post.id);
  }

  // Promotional post
  await base44.asServiceRole.entities.SocialPost.create({
    client_id,
    campaign_id: campaign_id || '',
    platform: 'facebook',
    post_text: result.promotional_post,
    status: 'draft',
    approval_status: 'pending',
    image_overlay: 'PROMOTIONAL — add offer graphic',
  });

  // Educational post
  await base44.asServiceRole.entities.SocialPost.create({
    client_id,
    campaign_id: campaign_id || '',
    platform: 'facebook',
    post_text: result.educational_post,
    status: 'draft',
    approval_status: 'pending',
  });

  // Video script
  await base44.asServiceRole.entities.VideoScript.create({
    client_id,
    campaign_id: campaign_id || '',
    title: `Weekly Video — Week of ${weekLabel}`,
    script: result.video_script,
    status: 'draft',
    heygen_status: 'not_submitted',
  });

  // Ad refresh as ContentAsset
  if (result.ad_refresh) {
    await base44.asServiceRole.entities.ContentAsset.create({
      client_id,
      campaign_id: campaign_id || '',
      asset_type: 'ad_copy',
      title: `Ad Refresh — ${result.ad_refresh.headline}`,
      content: `HEADLINE: ${result.ad_refresh.headline}\n\nBODY: ${result.ad_refresh.body}\n\nCTA: ${result.ad_refresh.cta}`,
      platform: 'facebook',
      status: 'draft',
      approval_status: 'pending',
    });
  }

  // SEO blog topic as SEOPage stub
  if (result.seo_blog_topic) {
    await base44.asServiceRole.entities.SEOPage.create({
      client_id,
      campaign_id: campaign_id || '',
      page_title: result.seo_blog_topic.title,
      url_slug: result.seo_blog_topic.target_keyword?.toLowerCase().replace(/\s+/g, '-') || '',
      target_keyword: result.seo_blog_topic.target_keyword,
      city: client.service_area || '',
      service: client.primary_services || '',
      page_content: result.seo_blog_topic.outline,
      status: 'draft',
    });
  }

  return Response.json({
    success: true,
    week: weekLabel,
    assets_created: {
      facebook_posts: 3,
      promotional_post: 1,
      educational_post: 1,
      video_script: 1,
      ad_refresh: 1,
      seo_blog_topic: 1,
    },
  });
});