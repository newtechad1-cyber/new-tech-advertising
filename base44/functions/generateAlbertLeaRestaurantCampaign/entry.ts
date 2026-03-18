import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate Albert Lea restaurant-specific visibility campaign
    const restaurantResponse = await base44.integrations.Core.InvokeLLM({
      model: 'gpt_5',
      prompt: `Create a localized Albert Lea Minnesota restaurant visibility campaign focused on weekly specials, community loyalty, and event night visibility. Generate restaurant-specific content, promotional messaging, video scripts, and posting schedules.

Return EXACTLY this JSON structure:

{
  "campaign": {
    "market": "Albert Lea Restaurant Visibility",
    "region": "Albert Lea, Minnesota",
    "industry": "Food Service & Restaurants",
    "territory_focus": "weekly specials promotion, community loyalty marketing, event night visibility",
    "status": "active",
    "posting_cadence": "5-6 posts per week",
    "content_streams": [
      {
        "stream_name": "Weekly Specials Promotion",
        "posts": [
          {
            "headline": "[Albert Lea] Restaurant Special: [Day] Features [Dish Name]",
            "body": "Albert Lea food lovers are searching for what's new this week. Build weekly anticipation with consistent special promotion content.",
            "cta": "Book demo for weekly special promotion templates"
          }
        ]
      },
      {
        "stream_name": "Community Loyalty Marketing",
        "posts": [
          {
            "headline": "[Albert Lea] Restaurant Community: Where Neighbors Become Family",
            "body": "Albert Lea communities are built on local loyalty. Build your restaurant's community presence through consistent visibility.",
            "cta": "Join Albert Lea restaurant founders"
          }
        ]
      },
      {
        "stream_name": "Event Night Visibility",
        "posts": [
          {
            "headline": "[Albert Lea] Event Night: Friday Trivia, Live Music & Good Food",
            "body": "Albert Lea residents plan their entertainment week in advance. Consistent event promotion fills your dining room.",
            "cta": "Get event promotion content strategy"
          }
        ]
      }
    ],
    "video_scripts": [
      {
        "title": "[Albert Lea] Weekly Special Showcase",
        "length": "15-30 seconds",
        "structure": "Dish reveal → Ingredient highlight → CTA",
        "script": "Hook: 'Albert Lea foodies, what are you hungry for?' Feature: 'This week we're featuring [signature dish] with [ingredient focus]' Benefit: 'Made fresh, available [days]' CTA: 'Tag us in your visit'"
      },
      {
        "title": "[Albert Lea] Friday Night Events",
        "length": "30-45 seconds",
        "structure": "Event announcement → Community benefit → CTA",
        "script": "Albert Lea Friday nights feature live entertainment, specials, and community gathering. Promote recurring events to build customer habit"
      }
    ],
    "seasonal_events": [
      {
        "season": "Spring (March-May)",
        "focus": "Patio reopening, outdoor dining visibility, spring ingredient specials",
        "content_themes": ["Seasonal menu launches", "Patio celebration events", "Spring entertaining"]
      },
      {
        "season": "Summer (June-August)",
        "focus": "Festival promotions, catering visibility, summer beverage specials",
        "content_themes": ["Summer menus", "Event sponsorships", "Community gatherings"]
      },
      {
        "season": "Fall (September-November)",
        "focus": "Harvest menus, football watch parties, holiday prep",
        "content_themes": ["Fall menu launches", "Sports events", "Holiday party planning"]
      },
      {
        "season": "Winter (December-February)",
        "focus": "Holiday specials, New Year promotions, comfort food positioning",
        "content_themes": ["Holiday menus", "New Year specials", "Winter warmth"]
      }
    ],
    "weekly_schedule": "Mon-Tue: Weekly special announcement | Wed: Community spotlight | Thu: Event promotion | Fri-Sat: Live event content | Sun: Loyalty/community building",
    "unique_offers": [
      "DIY Growth System for Restaurants - $99/month",
      "Weekly special templates library (52 weeks)",
      "Event promotion content calendar",
      "Community loyalty messaging framework",
      "Albert Lea restaurant founding member discount"
    ]
  },
  "cross_campaign_integration": {
    "aligned_posting": "Same 5-6 posts per week cadence as HVAC campaigns",
    "channel_distribution": "Facebook (local groups), Instagram (food focus), Google Business (discovery), TikTok (trending food), YouTube Shorts (event highlights)",
    "community_focus": "Albert Lea restaurant community - build local visibility ecosystem",
    "geographic_alignment": "Albert Lea serves as both HVAC and Restaurant visibility hub"
  },
  "success_metrics": {
    "monthly_targets": [
      "500-800 restaurant engagement interactions",
      "20-30 event attendance increases",
      "15-25 new regular customers",
      "3-5 demo bookings from restaurant owners"
    ],
    "quarterly_targets": [
      "1500-2400 total restaurant engagement",
      "60-90 event attendees attributed to social visibility",
      "45-75 new customer acquisitions",
      "10-15 restaurant DIY system signups",
      "$15K+ MRR from restaurant vertical"
    ]
  }
}

Generate Albert Lea restaurant-specific, localized content with realistic weekly specials, event promotions, and seasonal variations. Include specific examples of restaurant posts, video scripts, and community engagement strategies.`,
      response_json_schema: {
        type: 'object',
        properties: {
          campaign: { type: 'object' },
          cross_campaign_integration: { type: 'object' },
          success_metrics: { type: 'object' }
        }
      }
    });

    return Response.json({
      success: true,
      campaign: restaurantResponse.campaign,
      integration: restaurantResponse.cross_campaign_integration,
      metrics: restaurantResponse.success_metrics,
      campaign_type: 'restaurant_visibility',
      region: 'Albert Lea, Minnesota',
      activation_status: 'ready_to_deploy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Albert Lea restaurant campaign generation error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});