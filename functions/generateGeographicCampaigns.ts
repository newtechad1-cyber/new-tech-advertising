import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate localized campaigns for 3 geographic markets
    const geoResponse = await base44.integrations.Core.InvokeLLM({
      model: 'gpt_5',
      prompt: `Create 3 localized geographic dominance campaigns for the NTA DIY Growth System. Generate localized content variations, messaging themes, and posting schedules for each market.

Return EXACTLY this JSON structure:

{
  "campaigns": [
    {
      "market_name": "Mason City Market",
      "region": "Mason City, Iowa",
      "target_audience": "local small businesses and service companies",
      "messaging_core": "local visibility, community authority, consistent marketing presence",
      "status": "active",
      "launch_date": "2026-03-15",
      "content_themes": [
        {
          "theme": "Local Visibility Authority",
          "posts": [
            "Hook about [Mason City] small businesses struggling with visibility",
            "Why [Mason City] service companies need consistent local presence",
            "Local business success story in [Mason City] using structured marketing"
          ],
          "localization": "References Mason City landmarks, community events, local challenges"
        },
        {
          "theme": "Community Authority Building",
          "posts": [
            "How to become the go-to authority in [Mason City] for your service",
            "[Mason City] business owners: here's your competitive advantage",
            "Local marketing momentum: why consistency matters in [Mason City]"
          ],
          "localization": "Emphasizes Mason City community, local networks, regional reputation"
        },
        {
          "theme": "Consistent Marketing Presence",
          "posts": [
            "[Mason City] prospects expect consistent local visibility from trusted providers",
            "The compound effect of showing up consistently in [Mason City]",
            "Weekly marketing momentum for [Mason City] service businesses"
          ],
          "localization": "Highlights seasonal patterns, local events, community calendar"
        }
      ],
      "offer_positioning": "$99/month DIY Growth System + early access for [Mason City] founders",
      "channel_schedule": {
        "facebook": "Daily posts + 3-4 community group shares per week",
        "google_business": "3x weekly posts highlighting [Mason City] specific content",
        "instagram": "4-5x weekly with Mason City location tags",
        "linkedin": "3x weekly authority content for local professionals",
        "youtube_shorts": "2x weekly community-focused video scripts"
      },
      "posting_cadence": "1-2 posts per day across channels",
      "duration_days": 30,
      "cta": "Message for demo + [Mason City]-specific booking link",
      "unique_offers": [
        "30-day free trial for Mason City founding members",
        "Local business community discount (5+ users)"
      ]
    },
    {
      "market_name": "Austin Minnesota Market",
      "region": "Austin, Minnesota",
      "target_audience": "service trades, restaurants, retail",
      "messaging_core": "lead generation consistency, structured marketing, seasonal promotion visibility",
      "status": "active",
      "launch_date": "2026-03-22",
      "content_themes": [
        {
          "theme": "Lead Generation Consistency",
          "posts": [
            "[Austin] service trades: stop losing leads to inconsistent marketing",
            "Why [Austin] restaurants need weekly content visibility",
            "[Austin] retail owners: generate predictable leads with consistency"
          ],
          "localization": "Focuses on Austin's service industry strength, restaurant scene, retail districts"
        },
        {
          "theme": "Structured Marketing Strategy",
          "posts": [
            "[Austin] businesses failing at marketing usually lack this one thing",
            "How [Austin] service companies scale with structured content",
            "The marketing framework [Austin] trades need but don't teach"
          ],
          "localization": "References Austin's economic drivers: hospitality, manufacturing, services"
        },
        {
          "theme": "Seasonal Promotion Visibility",
          "posts": [
            "[Austin] seasonal business? Here's your marketing visibility playbook",
            "Capitalize on [Austin] summer/winter business cycles with consistent content",
            "[Austin] restaurants: promote seasonal specials + build year-round visibility"
          ],
          "localization": "Emphasizes Minnesota seasonal patterns, local promotions, tourism cycles"
        }
      ],
      "offer_positioning": "DIY Growth System for [Austin] - structured lead generation at $99/month",
      "channel_schedule": {
        "facebook": "Daily posts + Austin business groups (3 groups, 2x per week each)",
        "google_business": "4x weekly with seasonal focus",
        "instagram": "4x weekly - restaurant/retail visual focus",
        "linkedin": "3x weekly B2B service trade content",
        "youtube_shorts": "2x weekly lead generation focused scripts"
      },
      "posting_cadence": "1-2 posts per day across channels",
      "duration_days": 30,
      "cta": "Message for demo + [Austin]-specific booking link",
      "unique_offers": [
        "Restaurant/retail owner bundle ($149/month)",
        "Service trade discount (structural content templates)"
      ]
    },
    {
      "market_name": "Rochester Minnesota Expansion Campaign",
      "region": "Rochester, Minnesota",
      "target_audience": "growth-focused businesses and professional services",
      "messaging_core": "brand authority, marketing scale, premium growth positioning",
      "status": "active",
      "launch_date": "2026-03-29",
      "content_themes": [
        {
          "theme": "Brand Authority Development",
          "posts": [
            "[Rochester] business leaders: building authentic brand authority in 2026",
            "Why [Rochester] companies are winning through consistent thought leadership",
            "[Rochester] professional services: authority positioning that converts"
          ],
          "localization": "Targets Rochester's healthcare, professional services, emerging tech scene"
        },
        {
          "theme": "Marketing Scale Strategy",
          "posts": [
            "[Rochester] growing businesses: scaling marketing without scaling costs",
            "How [Rochester] leaders use AI-driven consistency for market dominance",
            "[Rochester] expansion playbook: structured marketing for multi-location growth"
          ],
          "localization": "Emphasizes Rochester growth trajectory, Mayo influence, regional expansion"
        },
        {
          "theme": "Premium Growth Positioning",
          "posts": [
            "[Rochester] premium brands build authority through consistency, not noise",
            "The [Rochester] difference: brands that lead vs brands that follow",
            "[Rochester] competitive edge: structured marketing systems for market leaders"
          ],
          "localization": "References Rochester's premium market positioning, Mayo ecosystem, professional services density"
        }
      ],
      "offer_positioning": "Premium DIY Growth System for [Rochester] market leaders - $99/month founding rate",
      "channel_schedule": {
        "facebook": "Daily posts + Rochester professional groups (4 groups, 3x per week each)",
        "google_business": "4x weekly premium positioning",
        "instagram": "3-4x weekly - professional/brand-focused visuals",
        "linkedin": "4x weekly - premium authority content targeting executives",
        "youtube_shorts": "3x weekly - C-level positioning and strategy"
      },
      "posting_cadence": "1-2 posts per day across channels",
      "duration_days": 30,
      "cta": "Book strategy call + [Rochester]-specific premium booking link",
      "unique_offers": [
        "Strategy review call ($297 value, free for founding members)",
        "Multi-location package discount"
      ]
    }
  ],
  "cross_campaign_strategy": {
    "unified_offer": "DIY Growth System at $99/month across all markets",
    "brand_consistency": "Local positioning + national system credibility",
    "regional_differentiation": "City-specific content + shared platform benefits",
    "posting_coordination": "Staggered launches (Day 0, Day 7, Day 14) to manage capacity",
    "lead_routing": "Market-specific demo calendars and follow-up sequences"
  },
  "success_metrics": {
    "per_market": [
      "20+ demo bookings per market",
      "50+ early access signups per market",
      "3-5% average engagement rate",
      "2-3 qualified leads per week"
    ],
    "aggregate": [
      "60+ total demo bookings across 3 markets",
      "150+ total signups",
      "9-15 qualified leads per week",
      "$30K+ projected MRR at 50% conversion"
    ]
  }
}

Make localized content specific to each city with realistic business focus. Include actual channel strategies and unique positioning per market.`,
      response_json_schema: {
        type: 'object',
        properties: {
          campaigns: { type: 'array' },
          cross_campaign_strategy: { type: 'object' },
          success_metrics: { type: 'object' }
        }
      }
    });

    return Response.json({
      success: true,
      campaigns: geoResponse.campaigns,
      strategy: geoResponse.cross_campaign_strategy,
      metrics: geoResponse.success_metrics,
      total_campaigns: geoResponse.campaigns?.length || 0
    });
  } catch (error) {
    console.error('Geographic campaign generation error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});