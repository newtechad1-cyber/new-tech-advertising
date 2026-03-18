import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate all campaign content via OpenAI
    const campaignContent = await base44.integrations.Core.InvokeLLM({
      model: 'gpt_5',
      prompt: `You are a social media strategist creating a 14-day launch campaign for "NTA DIY Growth System" - an AI marketing platform for small businesses at $99/month.

Generate EXACTLY the following content in JSON format:

{
  "authority_posts": [
    {
      "title": "Problem Post",
      "content": "Post explaining small business marketing struggles with consistency",
      "angle": "pain_point"
    },
    {
      "title": "Agency Problem Post",
      "content": "Post about why agencies are expensive and unpredictable",
      "angle": "alternative_comparison"
    },
    {
      "title": "AI Confusion Post",
      "content": "Post about how AI tools alone are confusing without structure",
      "angle": "education"
    },
    {
      "title": "Control Post",
      "content": "Post about NTA providing structured marketing control",
      "angle": "solution"
    }
  ],
  "offer_announcement_posts": [
    {
      "title": "System Intro",
      "content": "Post introducing the DIY Growth System with focus on $99/month entry point and early access positioning",
      "cta": "Book a demo or message for early access"
    },
    {
      "title": "Value Prop",
      "content": "Post emphasizing what's included at launch pricing",
      "cta": "Join as founding member"
    }
  ],
  "educational_posts": [
    {
      "title": "Consistency Benefits",
      "content": "Post about benefits of consistent content publishing for small businesses",
      "topic": "marketing_fundamentals"
    },
    {
      "title": "Momentum Post",
      "content": "Post about importance of marketing momentum and compound effect",
      "topic": "strategy"
    },
    {
      "title": "AI Workflow Post",
      "content": "Post about how AI simplifies marketing workflows for busy owners",
      "topic": "efficiency"
    },
    {
      "title": "Strategy Post",
      "content": "Post contrasting visibility through consistent strategy vs random posting",
      "topic": "planning"
    }
  ],
  "video_scripts": [
    {
      "length": "30-60 seconds",
      "tone": "local_business_friendly",
      "structure": "problem → solution → offer",
      "script": "Hook (2s): [Attention-grabbing statement about marketing struggle] Problem (8s): [Describe small business owner's challenge] Solution (10s): [Introduce NTA DIY System] Offer (5s): [CTA - book demo or message] Closing (2s): [Final hook]"
    },
    {
      "length": "30-60 seconds",
      "tone": "local_business_friendly",
      "structure": "problem → solution → offer",
      "script": "Alternative angle focusing on ROI and early access positioning"
    }
  ],
  "proof_posts": [
    {
      "title": "Early Traction",
      "content": "Post describing early platform traction, number of users, results being seen",
      "angle": "social_proof"
    },
    {
      "title": "Command Center",
      "content": "Post positioning system as marketing command center for small business owners",
      "angle": "vision"
    }
  ],
  "channel_variations": {
    "facebook": {
      "example_post": "Story-driven, conversational post that feels like advice from a friend",
      "tone": "friendly_conversational",
      "length": "150-200 words"
    },
    "linkedin": {
      "example_post": "Authority-focused post about business growth, scaling, and marketing strategy",
      "tone": "professional_insights",
      "length": "100-150 words"
    },
    "instagram": {
      "example_post": "Short punchy caption with emojis, hook-driven, value-focused",
      "tone": "punchy_visual",
      "length": "50-80 words"
    },
    "google_business": {
      "example_post": "Local growth focused, community-oriented, actionable advice",
      "tone": "local_growth",
      "length": "80-120 words"
    },
    "youtube_shorts": {
      "example_post": "Script format with strong hook, pattern interrupts, clear CTA",
      "tone": "hook_driven",
      "format": "video_script_breakdown"
    }
  },
  "posting_schedule": {
    "days_1_2": ["authority_post_1", "offer_announcement_1"],
    "days_3_4": ["educational_post_1", "offer_announcement_2"],
    "days_5_6": ["authority_post_2", "educational_post_2"],
    "days_7_8": ["proof_post_1", "educational_post_3"],
    "days_9_10": ["authority_post_3", "video_script_1"],
    "days_11_12": ["educational_post_4", "proof_post_2"],
    "days_13_14": ["offer_announcement_reframe", "authority_post_4"]
  }
}

Make content specific, actionable, and compelling. Include actual example variations for at least 2 content types across 2 channels.`,
      response_json_schema: {
        type: 'object',
        properties: {
          authority_posts: { type: 'array' },
          offer_announcement_posts: { type: 'array' },
          educational_posts: { type: 'array' },
          video_scripts: { type: 'array' },
          proof_posts: { type: 'array' },
          channel_variations: { type: 'object' },
          posting_schedule: { type: 'object' }
        }
      }
    });

    // Create campaign record
    const campaignData = {
      campaign_name: 'NTA DIY Growth System Launch',
      campaign_theme: 'AI Marketing System for Small Businesses',
      status: 'draft',
      generated_at: new Date().toISOString(),
      content_library: campaignContent,
      channel_strategy: {
        facebook: { posts_per_week: 3, tone: 'conversational' },
        linkedin: { posts_per_week: 4, tone: 'authority' },
        instagram: { posts_per_week: 4, tone: 'punchy' },
        google_business: { posts_per_week: 2, tone: 'local' },
        youtube_shorts: { posts_per_week: 2, tone: 'hook_driven' }
      },
      posting_cadence: '1-2 posts per day',
      duration_days: 14,
      cta_unified: 'Message us for a demo or visit booking link'
    };

    return Response.json({
      success: true,
      campaign: campaignData,
      content_count: {
        authority_posts: campaignContent.authority_posts?.length || 0,
        offer_posts: campaignContent.offer_announcement_posts?.length || 0,
        educational_posts: campaignContent.educational_posts?.length || 0,
        video_scripts: campaignContent.video_scripts?.length || 0,
        proof_posts: campaignContent.proof_posts?.length || 0
      }
    });
  } catch (error) {
    console.error('Campaign generation error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});