import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate HVAC industry-specific territorial campaigns
    const hvacResponse = await base44.integrations.Core.InvokeLLM({
      model: 'gpt_5',
      prompt: `Create 4 localized HVAC territorial domination campaigns including Albert Lea, Minnesota. Generate HVAC-specific content, seasonal messaging, video scripts, and posting schedules.

Return EXACTLY this JSON structure:

{
  "campaigns": [
    {
      "market": "Mason City HVAC",
      "region": "Mason City, Iowa",
      "territory_focus": "local authority positioning, seasonal repair urgency, review momentum",
      "status": "active",
      "posting_cadence": "5-6 posts per week",
      "content_streams": [
        {
          "stream_name": "Local Authority Positioning",
          "posts": [
            {
              "headline": "[Mason City] HVAC Company: Here's Why Your Marketing Isn't Working",
              "body": "Most [Mason City] HVAC companies rely on word-of-mouth. Here's why consistent local visibility is your competitive edge.",
              "cta": "Book a demo to see how structured marketing generates leads"
            },
            {
              "headline": "[Mason City] HVAC: Build Community Trust Through Consistent Content",
              "body": "Your [Mason City] neighbors need to know you exist. Weekly visibility builds the authority that converts.",
              "cta": "Join [Mason City] HVAC founders using the DIY system"
            }
          ]
        },
        {
          "stream_name": "Seasonal Repair Urgency",
          "posts": [
            {
              "headline": "[Mason City] HVAC Spring Check? Here's What Your System Needs",
              "body": "Spring is peak repair season in [Mason City]. Promote your maintenance services with consistent weekly visibility.",
              "cta": "Message for demo + seasonal content templates"
            },
            {
              "headline": "Winter Furnace Prep for [Mason City] Homeowners",
              "body": "[Mason City] winters demand reliable HVAC. Position your expertise with consistent pre-season content.",
              "cta": "Learn how to market seasonal services"
            }
          ]
        },
        {
          "stream_name": "Review Momentum Building",
          "posts": [
            {
              "headline": "[Mason City] HVAC: Generating 5-Star Reviews Through Consistency",
              "body": "Customers trust [Mason City] HVAC companies with strong online presence. Build yours weekly.",
              "cta": "Book demo to see review generation strategy"
            }
          ]
        }
      ],
      "video_scripts": [
        {
          "title": "[Mason City] HVAC Problem → Solution",
          "length": "30-45 seconds",
          "structure": "Hook (problem) → Solution (DIY System) → CTA",
          "script": "Hook: '[Mason City] HVAC companies: are your leads coming from word-of-mouth alone?' Problem: 'Inconsistent marketing = inconsistent leads' Solution: 'The DIY Growth System creates predictable lead flow through structured weekly content' CTA: 'Message for a demo'"
        },
        {
          "title": "[Mason City] Seasonal HVAC Authority",
          "length": "30-45 seconds",
          "structure": "Seasonal urgency → Visibility solution → CTA",
          "script": "Spring/summer peak season script emphasizing maintenance service visibility and local review building"
        }
      ],
      "seasonal_focus": "Spring repairs + summer AC maintenance + fall heating prep + winter emergency coverage",
      "weekly_schedule": "Mon-Wed: Authority + education | Thu-Fri: Seasonal urgency | Sat-Sun: Video script distribution"
    },
    {
      "market": "Austin MN HVAC",
      "region": "Austin, Minnesota",
      "territory_focus": "consistent lead flow, preventive maintenance promotions, competitive visibility",
      "status": "active",
      "posting_cadence": "5-6 posts per week",
      "content_streams": [
        {
          "stream_name": "Consistent Lead Generation",
          "posts": [
            {
              "headline": "[Austin] HVAC: Stop Losing Leads to Competitors With Better Content",
              "body": "[Austin] homeowners search for HVAC solutions online. Your consistent weekly presence converts searches into leads.",
              "cta": "Book demo to see lead generation framework"
            },
            {
              "headline": "[Austin] HVAC Leads Don't Come From Luck—They Come From Consistency",
              "body": "Predictable lead flow requires predictable content visibility. Here's how [Austin] HVAC leaders generate 5-10 leads per week.",
              "cta": "Join [Austin] HVAC founders - founding member rate"
            }
          ]
        },
        {
          "stream_name": "Preventive Maintenance Promotions",
          "posts": [
            {
              "headline": "[Austin] HVAC: Your Maintenance Service Revenue Opportunity",
              "body": "Preventive maintenance is your highest-margin service. Promote it consistently to [Austin] homeowners.",
              "cta": "Get maintenance promotion templates"
            },
            {
              "headline": "[Austin] Homeowners: Prevent HVAC Breakdowns With These 5 Steps",
              "body": "Educational content that positions your company as the trusted [Austin] HVAC expert.",
              "cta": "Book demo for educational content strategy"
            }
          ]
        },
        {
          "stream_name": "Competitive Visibility",
          "posts": [
            {
              "headline": "[Austin] HVAC Market Leader: How to Beat Your Local Competitors",
              "body": "Consistent content visibility dominates the [Austin] HVAC conversation. Here's how.",
              "cta": "Book strategy call"
            }
          ]
        }
      ],
      "video_scripts": [
        {
          "title": "[Austin] HVAC Lead Generation System",
          "length": "30-45 seconds",
          "structure": "Problem (lead inconsistency) → Solution (DIY system) → CTA",
          "script": "Hook: 'Austin HVAC companies: where are your leads coming from?' Problem: 'Inconsistent marketing = unpredictable revenue' Solution: 'The DIY Growth System generates 5-10 leads per week through structured content' CTA: 'Message to book your demo'"
        },
        {
          "title": "[Austin] Preventive Maintenance Authority",
          "length": "30-45 seconds",
          "structure": "Maintenance education → Value prop → CTA",
          "script": "Educational script positioning preventive maintenance services and building authority with Austin homeowners"
        }
      ],
      "seasonal_focus": "Spring tune-ups + summer AC overload prep + fall heating inspections + winter emergency readiness",
      "weekly_schedule": "Mon-Tue: Lead generation education | Wed-Thu: Preventive maintenance | Fri-Sat: Competition positioning | Sun: Video scripts"
    },
    {
      "market": "Rochester HVAC Authority",
      "region": "Rochester, Minnesota",
      "territory_focus": "premium installs, smart HVAC systems, professional brand growth",
      "status": "active",
      "posting_cadence": "5-6 posts per week",
      "content_streams": [
        {
          "stream_name": "Premium Install Positioning",
          "posts": [
            {
              "headline": "[Rochester] Premium HVAC Installations: Building Brand Authority in a Premium Market",
              "body": "[Rochester] homeowners expect premium solutions. Build consistent authority through quality-focused content.",
              "cta": "Book strategy call for premium positioning"
            },
            {
              "headline": "[Rochester] HVAC Excellence: How Premium Companies Maintain Market Leadership",
              "body": "Consistent premium brand messaging positions your [Rochester] company as the market leader.",
              "cta": "Join premium [Rochester] HVAC founders"
            }
          ]
        },
        {
          "stream_name": "Smart HVAC Systems Authority",
          "posts": [
            {
              "headline": "[Rochester] Smart Home HVAC: The Future of Comfort and Efficiency",
              "body": "Smart HVAC adoption is growing in [Rochester]. Position your expertise in emerging technology.",
              "cta": "Book demo for tech positioning strategy"
            },
            {
              "headline": "[Rochester] Homeowners: Is Your HVAC System Smart-Ready?",
              "body": "Educational authority content that builds [Rochester] brand reputation.",
              "cta": "Learn smart HVAC marketing strategy"
            }
          ]
        },
        {
          "stream_name": "Professional Brand Growth",
          "posts": [
            {
              "headline": "[Rochester] HVAC Professional: Scale Your Brand Beyond Word-of-Mouth",
              "body": "Consistent professional content builds the scalable brand that attracts premium customers.",
              "cta": "Book strategy consultation"
            }
          ]
        }
      ],
      "video_scripts": [
        {
          "title": "[Rochester] Premium HVAC Authority",
          "length": "45-60 seconds",
          "structure": "Premium positioning → System showcase → Brand growth CTA",
          "script": "Hook: 'Rochester HVAC companies: are you being found by premium customers?' Problem: 'Generic marketing dilutes premium positioning' Solution: 'Structured premium content builds authority and attracts high-value customers' CTA: 'Book strategy call for premium brand growth'"
        },
        {
          "title": "[Rochester] Smart HVAC Innovation",
          "length": "45-60 seconds",
          "structure": "Technology authority → Customer benefit → CTA",
          "script": "Smart HVAC system education positioning company as technology-forward expert in Rochester market"
        }
      ],
      "seasonal_focus": "Premium spring installations + summer smart system upgrades + fall performance optimization + winter comfort positioning",
      "weekly_schedule": "Mon: Premium positioning | Tue-Wed: Smart systems authority | Thu: Brand growth content | Fri-Sat: Professional case studies | Sun: Premium video scripts"
    },
    {
      "market": "Albert Lea HVAC",
      "region": "Albert Lea, Minnesota",
      "territory_focus": "local service authority, seasonal repair urgency, maintenance plan promotion",
      "status": "active",
      "posting_cadence": "5-6 posts per week",
      "content_streams": [
        {
          "stream_name": "Local Service Authority",
          "posts": [
            {
              "headline": "[Albert Lea] HVAC Service Authority: Why Local Homeowners Trust Consistent Companies",
              "body": "Albert Lea families want to know their HVAC company is reliable and local. Build consistent visibility to establish trust.",
              "cta": "Book demo to see how local authority builds leads"
            },
            {
              "headline": "[Albert Lea] HVAC Expertise: The Service Standard Albert Lea Expects",
              "body": "Albert Lea homeowners deserve quality service. Consistent content positioning builds your local service reputation.",
              "cta": "Join Albert Lea HVAC founders"
            }
          ]
        },
        {
          "stream_name": "Seasonal Repair Urgency",
          "posts": [
            {
              "headline": "[Albert Lea] Spring HVAC Maintenance: Prepare Your System Now",
              "body": "Spring weather in Albert Lea demands AC preparation. Position your maintenance services with consistent visibility.",
              "cta": "Get seasonal maintenance content templates"
            },
            {
              "headline": "[Albert Lea] Winter Furnace Emergency? Here's What You Need",
              "body": "Albert Lea winters are harsh. Build pre-season visibility so customers call you first.",
              "cta": "Learn winter HVAC marketing strategy"
            }
          ]
        },
        {
          "stream_name": "Maintenance Plan Promotion",
          "posts": [
            {
              "headline": "[Albert Lea] HVAC Maintenance Plans: Predictable Service, Predictable Costs",
              "body": "Albert Lea homeowners love predictability. Maintenance plans create recurring revenue and customer loyalty.",
              "cta": "Book demo for maintenance plan strategy"
            },
            {
              "headline": "[Albert Lea] HVAC Preventive Care: Stop Emergency Repairs Before They Happen",
              "body": "Smart Albert Lea homeowners invest in preventive maintenance. Promote plans consistently to capture market share.",
              "cta": "Get maintenance plan content templates"
            }
          ]
        }
      ],
      "video_scripts": [
        {
          "title": "[Albert Lea] HVAC Local Authority",
          "length": "30-45 seconds",
          "structure": "Local trust → Service consistency → CTA",
          "script": "Hook: '[Albert Lea] homeowners want a reliable HVAC company they can trust' Problem: 'Most companies don't show up consistently' Solution: 'The DIY Growth System builds the local authority that attracts loyal customers' CTA: 'Message for a demo'"
        },
        {
          "title": "[Albert Lea] Maintenance Plan Authority",
          "length": "30-45 seconds",
          "structure": "Maintenance benefit → Cost savings → CTA",
          "script": "Albert Lea homeowners benefit from maintenance plans that prevent emergencies and save money. Build authority through consistent seasonal content"
        }
      ],
      "seasonal_focus": "Spring AC prep + summer maintenance + fall heating inspection + winter emergency readiness",
      "weekly_schedule": "Mon-Tue: Local authority | Wed-Thu: Seasonal maintenance | Fri: Maintenance plans | Sat-Sun: Video scripts + community"
    }
  ],
  "cross_territory_strategy": {
    "unified_offer": "DIY Growth System for HVAC Companies - $99/month founding rate",
    "industry_focus": "HVAC-specific content templates, seasonal calendars, lead generation metrics",
    "channel_distribution": "Facebook (HVAC groups), Google Business (local), Instagram (before/after), LinkedIn (B2B), YouTube Shorts (educational)",
    "territorial_differentiation": "Mason City = authority building | Austin = lead generation | Rochester = premium positioning | Albert Lea = service authority + maintenance plans",
    "total_posting_volume": "20-24 posts per week across 4 territories (5-6 per territory)"
  },
  "success_metrics": {
    "per_territory_monthly": [
      "15-25 qualified HVAC leads",
      "30-50 demo bookings",
      "8-12% engagement rate on HVAC-specific posts",
      "500-1000 monthly impressions from HVAC targeting"
    ],
    "aggregate_quarterly": [
      "45-75 HVAC leads across 3 territories",
      "90-150 demo bookings",
      "60-90 DIY system signups from HVAC industry",
      "$50K+ projected MRR from HVAC vertical"
    ]
  }
}

Generate HVAC-specific, location-specific content with realistic seasonal patterns, service offerings, and pricing. Include specific examples of posts, headlines, and video scripts for HVAC companies.`,
      response_json_schema: {
        type: 'object',
        properties: {
          campaigns: { type: 'array' },
          cross_territory_strategy: { type: 'object' },
          success_metrics: { type: 'object' }
        }
      }
    });

    return Response.json({
      success: true,
      campaigns: hvacResponse.campaigns,
      strategy: hvacResponse.cross_territory_strategy,
      metrics: hvacResponse.success_metrics,
      total_territories: hvacResponse.campaigns?.length || 0,
      activation_status: 'ready_to_deploy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('HVAC campaign generation error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});