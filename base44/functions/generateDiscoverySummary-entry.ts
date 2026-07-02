// generateDiscoverySummary — Base44 server function
// Generates an AI summary of a completed discovery call
// Inputs: discovery_call_id, lead_id, audit_id (optional)
// Output: { summary, suggested_services, suggested_follow_up, recommended_proposal }

import { AI } from "@base44/sdk";
import { DiscoveryCall, SalesLead, GapAudit } from "@base44/entities";

export default async function generateDiscoverySummary(params: {
  discovery_call_id: string;
  lead_id: string;
  audit_id?: string;
}) {
  // 1. Load the discovery call data
  const call = await DiscoveryCall.get(params.discovery_call_id);
  if (!call) throw new Error("Discovery call not found");

  // 2. Load lead data
  const lead = await SalesLead.get(params.lead_id);

  // 3. Load audit data (if available)
  let audit = null;
  if (params.audit_id) {
    try {
      audit = await GapAudit.get(params.audit_id);
    } catch {
      // audit may not exist
    }
  }

  // 4. Build context for AI
  const callContext = `
DISCOVERY CALL DATA
===================
Business: ${call.business_name || lead?.business_name || 'Unknown'}
Contact: ${call.contact_name || ''}
Date: ${call.call_date || 'Unknown'}
Status: ${call.status}

STAGE 2 — THEIR STORY
Business Story: ${call.s2_business_story || 'Not discussed'}
Ideal Customer: ${call.s2_ideal_customer || 'Not discussed'}
Current Marketing: ${call.s2_current_marketing || 'Not discussed'}
Frustrations: ${call.s2_current_frustrations || 'Not discussed'}
Strengths: ${call.s2_current_strengths || 'Not discussed'}

STAGE 3 — BUSINESS GOALS
Where They Want to Be: ${call.s3_where_want_to_be || 'Not discussed'}
Growth Goals: ${call.s3_growth_goals || 'Not discussed'}
Hiring Plans: ${call.s3_hiring_plans || 'Not discussed'}
Revenue Goals: ${call.s3_revenue_goals || 'Not discussed'}
Personal Goals: ${call.s3_personal_goals || 'Not discussed'}

STAGE 5 — CONNECTING THE DOTS
Notes: ${call.s5_notes || 'Not captured'}

STAGE 6 — FUTURE VISION
${call.s6_future_vision || 'Not discussed'}

STAGE 7 — RECOMMENDATION
Selected: ${call.s7_recommendation || 'None selected'}
Reason: ${call.s7_recommendation_reason || ''}

STAGE 8 — OBJECTIONS & CONCERNS
Objections: ${call.s8_objections || 'None'}
Concerns: ${call.s8_concerns || 'None'}
Opportunities: ${call.s8_opportunities || 'None'}

STAGE 9 — OUTCOME
${call.s9_outcome || 'Not yet closed'}

LIVE NOTES
${call.ai_live_notes || 'None'}

${audit ? `
AI VISIBILITY AUDIT RESULTS
Overall Score: ${audit.overall_score || '—'}/100
Website Visibility: ${audit.website_visibility_rating || '—'}
Trust Signals: ${audit.trust_signals_rating || '—'}
Local Search: ${audit.local_search_readiness_rating || '—'}
AI Search: ${audit.ai_search_readiness_rating || '—'}
Customer Journey: ${audit.customer_journey_clarity_rating || '—'}
Content Depth: ${audit.content_depth_rating || '—'}
Follow-Up System: ${audit.follow_up_system_rating || '—'}
Recommended Step: ${audit.recommended_system_step || '—'}
` : 'No audit data available'}
`.trim();

  // 5. Generate AI summary
  const result = await AI.chat({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the NTA (New Tech Advertising) Discovery Call Analyst. Generate a comprehensive summary of a completed sales discovery call.

Your output MUST be a valid JSON object with exactly these 4 fields:
- "summary": A 3-5 paragraph executive summary of the call covering who they are, what they need, key pain points, goals, and the recommended path forward. Write in third person.
- "suggested_services": Based on the conversation, list the specific NTA services that would help this business. Be specific to their situation.
- "suggested_follow_up": Concrete next steps — what should happen next, by when, and who does it.
- "recommended_proposal": What type of proposal should be generated, what it should include, pricing tier suggestion, and why.

Be specific, actionable, and reference real details from the call. This is for Rick Hesse (NTA founder) to use internally.`
      },
      {
        role: "user",
        content: callContext
      }
    ],
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(result.choices[0].message.content);

  // 6. Save back to the discovery call
  await DiscoveryCall.update(params.discovery_call_id, {
    ai_summary: parsed.summary,
    ai_suggested_services: parsed.suggested_services,
    ai_suggested_follow_up: parsed.suggested_follow_up,
    ai_recommended_proposal: parsed.recommended_proposal,
  });

  return parsed;
}
