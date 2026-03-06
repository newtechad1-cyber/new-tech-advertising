/**
 * buildAuthorityPlan
 * 
 * AI Authority Plan Engine — generates a full 90-day marketing strategy.
 * 
 * Triggered by: onOnboardingSubmitted (entity automation on OnboardingProfile)
 * 
 * Output pipeline:
 *   ContentCampaign → ContentItem (x60) → ScheduledPost (x60)
 * 
 * Plan structure:
 *   - 4 content pillars: education, trust, promotions, community
 *   - 12 weekly themes (one per week, 90 days)
 *   - 3 social posts/week  = 36 total
 *   - 1 video script/week  = 12 total
 *   - 1 promo post/week    = 12 total
 *   Total: 60 ContentItems → 60 ScheduledPosts
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

// The 4 fixed content pillars
const CONTENT_PILLARS = ['education', 'trust', 'promotions', 'community'];

// Pillar rotation for the 3 social posts per week (week-based cycling)
const PILLAR_ROTATION = ['education', 'trust', 'community'];

// Post scheduling: Mon / Wed / Fri each week, video on Thu, promo on Tue
const WEEKLY_SCHEDULE = [
  { dayOffset: 0, type: 'social' },   // Monday
  { dayOffset: 1, type: 'promo' },    // Tuesday
  { dayOffset: 2, type: 'social' },   // Wednesday
  { dayOffset: 3, type: 'video' },    // Thursday
  { dayOffset: 4, type: 'social' },   // Friday
];

function getDateStr(startDate, weekIndex, dayOffset) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + weekIndex * 7 + dayOffset);
  return d.toISOString().split('T')[0];
}

function nextMonday() {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  d.setHours(9, 0, 0, 0);
  return d;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const {
    company_id,
    onboarding_profile_id,
    brand_voice,
    target_audience,
    content_pillars: clientPillars,
    unique_selling_propositions,
    business_name,
    industry,
    active_channels,
    agent_job_id,
  } = await req.json();

  if (!company_id) {
    return Response.json({ error: 'company_id required' }, { status: 400 });
  }

  const channels = active_channels?.length ? active_channels : ['facebook', 'instagram'];

  try {
    // --- 2. AI: Generate 12 weekly themes ---
    const themePrompt = `You are a senior content strategist building a 90-day social media authority plan for a local business.

Business: ${business_name || 'Local Business'}
Industry: ${industry || 'Service Business'}
Brand Voice: ${brand_voice || 'Professional and friendly'}
Target Audience: ${target_audience || 'Local small business owners'}
Unique Selling Propositions: ${unique_selling_propositions || 'Quality service, local expertise'}

Generate exactly 12 weekly themes for a 90-day plan. Each theme maps to one of these 4 content pillars: education, trust, promotions, community.

Distribute themes across pillars: ~4 education, ~3 trust, ~3 promotions, ~2 community.

For each week also provide:
- 3 social post captions (short, platform-ready, with 3-5 hashtags each)
  - Post 1: Education angle
  - Post 2: Trust/Social Proof angle  
  - Post 3: Community/Engagement angle
- 1 video script (60-90 second talking-head script with hook, body, CTA)
- 1 promotional post caption (offer or service highlight, with CTA)

Return ONLY valid JSON — no markdown, no explanation.

JSON schema:
{
  "plan_summary": "string — 3-4 sentence overview of the 90-day strategy",
  "weeks": [
    {
      "week_number": 1,
      "theme": "string",
      "pillar": "education|trust|promotions|community",
      "social_posts": [
        { "pillar": "education|trust|community", "caption": "string", "hashtags": ["string"] },
        { "pillar": "education|trust|community", "caption": "string", "hashtags": ["string"] },
        { "pillar": "education|trust|community", "caption": "string", "hashtags": ["string"] }
      ],
      "video_script": {
        "title": "string",
        "hook": "string",
        "body": "string",
        "cta": "string",
        "duration_seconds": 75
      },
      "promo_post": {
        "caption": "string",
        "offer": "string",
        "hashtags": ["string"]
      }
    }
  ]
}`;

    console.log('[buildAuthorityPlan] Calling OpenAI for 12-week plan...');

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional content strategist. Always return valid JSON only.' },
        { role: 'user', content: themePrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 8000,
    });

    let plan;
    try {
      plan = JSON.parse(aiResponse.choices[0].message.content);
    } catch (e) {
      throw new Error('AI returned invalid JSON: ' + aiResponse.choices[0].message.content.slice(0, 300));
    }

    if (!plan.weeks || plan.weeks.length < 12) {
      throw new Error(`AI returned ${plan.weeks?.length || 0} weeks instead of 12`);
    }

    console.log('[buildAuthorityPlan] AI plan received:', plan.weeks.length, 'weeks');

    // --- 3. Create MarketingPlan record ---
    const marketingPlan = await base44.asServiceRole.entities.MarketingPlan.create({
      company_id,
      plan_name: `90-Day Authority Plan — ${business_name || company_id}`,
      status: 'active',
      posting_frequency: '5x per week',
      active_channels: channels,
      content_mix: '60% social (education/trust/community), 20% video, 20% promotional',
      monthly_video_count: 4,
      monthly_image_count: 8,
      monthly_text_count: 4,
      campaign_themes: plan.weeks.map(w => w.theme).join(', '),
      effective_date: getDateStr(nextMonday(), 0, 0),
    });

    // --- 4. Create ContentCampaign for the full 90-day plan ---
    const startDate = nextMonday();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 89);

    const campaign = await base44.asServiceRole.entities.ContentCampaign.create({
      company_id,
      marketing_plan_id: marketingPlan.id,
      name: `90-Day Authority Campaign — ${business_name || company_id}`,
      goal: '90-day authority building: establish brand voice, grow audience, drive leads through consistent multi-channel content',
      status: 'active',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      channels,
      total_items_planned: 60,
    });

    console.log('[buildAuthorityPlan] ContentCampaign created:', campaign.id);

    // --- 5. Generate all ContentItems + ScheduledPosts ---
    const contentItemIds = [];
    const scheduledPostIds = [];
    let socialCount = 0;
    let videoCount = 0;
    let promoCount = 0;

    for (let weekIdx = 0; weekIdx < 12; weekIdx++) {
      const week = plan.weeks[weekIdx];

      for (const slot of WEEKLY_SCHEDULE) {
        const scheduledDate = getDateStr(startDate, weekIdx, slot.dayOffset);
        const scheduledAt = `${scheduledDate}T09:00:00.000Z`;

        let contentItem;

        if (slot.type === 'social') {
          const postData = week.social_posts?.[socialCount % 3] || week.social_posts?.[0];
          contentItem = await base44.asServiceRole.entities.ContentItem.create({
            company_id,
            campaign_id: campaign.id,
            content_type: 'text_only',
            caption: postData?.caption || `Week ${week.week_number} — ${week.theme}`,
            hashtags: (postData?.hashtags || []).join(' '),
            channels,
            status: 'approved',
            generated_by: 'ai',
            admin_notes: `Week ${week.week_number} | Theme: ${week.theme} | Pillar: ${postData?.pillar || week.pillar}`,
          });
          socialCount++;

        } else if (slot.type === 'video') {
          const script = week.video_script;
          const fullScript = `TITLE: ${script?.title || week.theme}\n\nHOOK:\n${script?.hook || ''}\n\nBODY:\n${script?.body || ''}\n\nCTA:\n${script?.cta || ''}`;
          contentItem = await base44.asServiceRole.entities.ContentItem.create({
            company_id,
            campaign_id: campaign.id,
            content_type: 'video_post',
            caption: fullScript,
            hashtags: '',
            channels: channels.filter(c => ['instagram', 'facebook', 'tiktok', 'youtube'].includes(c)),
            status: 'approved',
            generated_by: 'ai',
            admin_notes: `Week ${week.week_number} | VIDEO SCRIPT | Theme: ${week.theme} | ~${script?.duration_seconds || 75}s`,
          });
          videoCount++;

        } else if (slot.type === 'promo') {
          const promo = week.promo_post;
          contentItem = await base44.asServiceRole.entities.ContentItem.create({
            company_id,
            campaign_id: campaign.id,
            content_type: 'image_post',
            caption: promo?.caption || `Check out our offer this week — ${week.theme}`,
            hashtags: (promo?.hashtags || []).join(' '),
            channels,
            status: 'approved',
            generated_by: 'ai',
            admin_notes: `Week ${week.week_number} | PROMO | Offer: ${promo?.offer || week.theme}`,
          });
          promoCount++;
        }

        contentItemIds.push(contentItem.id);

        // Create a ScheduledPost for each channel
        for (const platform of channels) {
          const scheduledPost = await base44.asServiceRole.entities.ScheduledPost.create({
            company_id,
            content_item_id: contentItem.id,
            platform,
            scheduled_at: scheduledAt,
            status: 'scheduled',
          });
          scheduledPostIds.push(scheduledPost.id);
        }
      }

      console.log(`[buildAuthorityPlan] Week ${weekIdx + 1}/12 complete — ${contentItemIds.length} items so far`);
    }

    // --- 6. Update AgentJob status if provided ---
    if (agent_job_id) {
      await base44.asServiceRole.entities.AgentJob.update(agent_job_id, {
        status: 'completed',
        output_summary: `90-day authority plan generated: 12 weeks, ${socialCount} social posts, ${videoCount} video scripts, ${promoCount} promo posts. Campaign ID: ${campaign.id}`,
        output_refs: [authorityPlan.id, campaign.id],
        completed_at: new Date().toISOString(),
      });
    }

    // --- 8. Log activity ---
    await base44.asServiceRole.entities.ActivityLog.create({
      company_id,
      event_type: 'agent_job_completed',
      summary: `90-Day Authority Plan generated: ${socialCount} social posts, ${videoCount} video scripts, ${promoCount} promo posts — all scheduled and ready.`,
      entity_type: 'AuthorityPlan',
      entity_id: authorityPlan.id,
      metadata: JSON.stringify({
        authority_plan_id: authorityPlan.id,
        campaign_id: campaign.id,
        marketing_plan_id: marketingPlan.id,
        content_items: contentItemIds.length,
        scheduled_posts: scheduledPostIds.length,
      }),
    });

    console.log('[buildAuthorityPlan] DONE —', {
      authority_plan_id: authorityPlan.id,
      campaign_id: campaign.id,
      content_items: contentItemIds.length,
      scheduled_posts: scheduledPostIds.length,
    });

    return Response.json({
      success: true,
      authority_plan_id: authorityPlan.id,
      campaign_id: campaign.id,
      marketing_plan_id: marketingPlan.id,
      social_posts: socialCount,
      video_scripts: videoCount,
      promo_posts: promoCount,
      content_items_created: contentItemIds.length,
      scheduled_posts_created: scheduledPostIds.length,
    });

  } catch (error) {
    console.error('[buildAuthorityPlan] FAILED:', error.message);

    // Mark AuthorityPlan as failed
    await base44.asServiceRole.entities.AuthorityPlan.update(authorityPlan.id, {
      status: 'draft',
      error_message: error.message,
    });

    if (agent_job_id) {
      await base44.asServiceRole.entities.AgentJob.update(agent_job_id, {
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString(),
      });
    }

    return Response.json({ error: error.message, authority_plan_id: authorityPlan.id }, { status: 500 });
  }
});