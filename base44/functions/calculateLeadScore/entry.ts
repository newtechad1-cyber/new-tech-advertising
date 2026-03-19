import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { lead_id } = await req.json();

    const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Get onboarding data if exists
    let onboarding = null;
    try {
      const onboardings = await base44.asServiceRole.entities.AdaOnboarding.filter({ lead_id });
      if (onboardings.length > 0) {
        onboarding = onboardings[0];
      }
    } catch (e) {
      console.log('No onboarding data');
    }

    // Calculate time since creation
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_date).getTime()) / (1000 * 60 * 60 * 24));

    const prompt = `You are an AI lead scoring expert for ADA website compliance services.

Analyze this lead and assign a conversion probability score from 0-100, where:
- 0-30: Low likelihood of conversion
- 31-60: Medium likelihood of conversion
- 61-100: High likelihood of conversion

Lead Data:
- Business: ${lead.business_name}
- Industry: ${lead.industry}
- Package Interest: ${lead.package}
- Status: ${lead.status}
- Location: ${lead.city}, ${lead.state}
- Number of Locations: ${lead.number_of_locations}
- Site Type: ${lead.site_type}
- Approximate Pages: ${lead.approximate_pages}
- Nonprofit: ${lead.nonprofit ? 'Yes' : 'No'}
- Days Since Lead Created: ${daysSinceCreated}
- Has Completed Onboarding: ${onboarding ? 'Yes' : 'No'}
- Notes: ${lead.notes || 'None'}

Scoring Factors to Consider:
1. Industry Risk Level (Healthcare, Finance, Government, Education, Legal = High Risk = Higher Score)
2. Business Size Indicators (Multiple locations, many pages = Higher Score)
3. Package Tier (Authority > Growth > Starter shows commitment)
4. Current Status (paid/onboarded = Very High, quoted = High, new = Medium)
5. Engagement Speed (Fast response/onboarding = Higher Score)
6. Nonprofit Status (May have budget constraints but also legal obligations)
7. Website Complexity (More pages = More urgent need)
8. Notes Analysis - CRITICAL: Scan for urgency and legal concern keywords:
   - HIGH URGENCY (+15-25 points): "lawsuit", "demand letter", "legal notice", "sued", "court", "attorney", "lawyer demand", "ADA lawsuit", "ASAP", "urgent", "immediately", "deadline", "compliance deadline"
   - MEDIUM URGENCY (+10-15 points): "concerned", "worried", "need help", "risk", "vulnerable", "compliance", "accessibility issues", "complaints", "threatened"
   - TIMELINE INDICATORS: Specific dates or deadlines mentioned = Higher urgency
   - AWARENESS LEVEL: Mentions of WCAG, Section 508, DOJ = More educated buyer = Higher score

Status-Specific Recommended Actions:
- NEW leads with high score (61+): "Contact within 4 hours - High conversion potential, strike while hot"
- NEW leads with medium score (31-60): "Follow up within 24 hours with tailored package comparison"
- NEW leads with low score (0-30): "Add to nurture sequence, follow up in 3-5 days"
- QUOTED leads with high score: "Urgent follow-up to address objections and close within 48 hours"
- QUOTED leads waiting 3+ days: "Send case studies and testimonials, offer consultation call"
- PAID leads: "Expedite onboarding process, send welcome package within 2 hours"
- ONBOARDED leads: "Begin remediation immediately, schedule kickoff call"

Return ONLY a valid JSON object with this exact structure:
{
  "score": 75,
  "confidence": "high",
  "key_factors": [
    "High-risk industry (Healthcare)",
    "Multiple locations indicate serious business",
    "Already paid - strong buying signal"
  ],
  "conversion_likelihood": "High - Strong signals of serious buyer with urgent need",
  "recommended_action": "Priority follow-up within 24 hours"
}`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: false,
      response_json_schema: {
        type: "object",
        properties: {
          score: { type: "number" },
          confidence: { type: "string" },
          key_factors: { type: "array", items: { type: "string" } },
          conversion_likelihood: { type: "string" },
          recommended_action: { type: "string" }
        },
        required: ["score", "confidence", "key_factors", "conversion_likelihood", "recommended_action"]
      }
    });

    // Update lead with score
    await base44.asServiceRole.entities.AdaLead.update(lead_id, {
      lead_score: response.score,
      score_factors: JSON.stringify(response)
    });

    return Response.json({ 
      success: true, 
      score: response.score,
      details: response
    });

  } catch (error) {
    console.error('Lead scoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});