import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { task_type, lead_id, question, context, email_content } = await req.json();

    let prompt = '';
    let lead = null;
    let onboarding = null;
    let activities = [];

    // Fetch lead data if needed
    if (lead_id) {
      const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
      if (leads.length > 0) {
        lead = leads[0];
        
        // Try to fetch onboarding data
        try {
          const onboardings = await base44.asServiceRole.entities.AdaOnboarding.filter({ lead_id });
          if (onboardings.length > 0) {
            onboarding = onboardings[0];
          }
        } catch (e) {
          console.log('No onboarding data found');
        }

        // Fetch activity history
        try {
          activities = await base44.asServiceRole.entities.LeadActivity.filter({ lead_id }, '-created_date', 10);
        } catch (e) {
          console.log('No activity data found');
        }
      }
    }

    // Build prompt based on task type
    if (task_type === 'draft_email') {
      const firstName = lead.full_name.split(' ')[0];
      
      // Calculate days since last update for context
      const daysSinceUpdate = Math.floor((Date.now() - new Date(lead.updated_date || lead.created_date).getTime()) / (1000 * 60 * 60 * 24));
      
      // Format activity history
      let activitySummary = 'None';
      if (activities.length > 0) {
        activitySummary = activities.map(a => {
          const date = new Date(a.created_date).toLocaleDateString();
          return `- ${date}: ${a.activity_type.replace('_', ' ')} ${a.details ? '(' + a.details + ')' : ''}`;
        }).join('\n');
      }
      
      prompt = `You are Rick from New Tech Advertising, a friendly and professional ADA compliance expert.

Lead Details:
- Name: ${lead.full_name}
- Business: ${lead.business_name}
- Website: ${lead.website_url}
- Package: ${lead.package}
- Status: ${lead.status}
- Setup Price: $${lead.setup_price}
- Monthly Price: $${lead.monthly_price}
- Location: ${lead.city}, ${lead.state}
- Industry: ${lead.industry}
- Nonprofit: ${lead.nonprofit ? 'Yes' : 'No'}
- Days Since Last Contact: ${daysSinceUpdate}
- Notes: ${lead.notes || 'None'}

Recent Activity History:
${activitySummary}

${context ? `Previous Interaction Context/History: ${context}` : ''}

Draft a personalized follow-up email to ${firstName} based on their current status (${lead.status}). 

CRITICAL INSTRUCTIONS:
1. If "Previous Interaction Context/History" is provided, reference it naturally in the email (e.g., "Following up on our conversation about...", "As we discussed...", "Thanks for mentioning...")
2. Return response as JSON with TWO fields: "subject_line" and "email_body"
3. Subject line should be:
   - Short (4-8 words max)
   - Personalized with business/industry if possible
   - Action-oriented or curiosity-inducing
   - Professional but conversational
   - Examples: "Quick question about [Business Name]", "ADA update for [Industry] businesses", "[FirstName], following up on our chat"

Email Requirements:
- Be friendly, conversational, and brief (3-4 short paragraphs max)
- Address their specific situation and package
- Include a clear next step or call to action
- Use Rick's contact info: 641-420-8816 / rick@newtechadvertising.com
- Sign it as "— Rick" at the end
- If they've been waiting a while, acknowledge the timing
- Rick's tone: helpful, not pushy; knowledgeable, not preachy

Return ONLY valid JSON:
{
  "subject_line": "Your subject line here",
  "email_body": "Email content here"
}`;

    } else if (task_type === 'analyze_lead') {
      prompt = `You are an AI sales analyst for New Tech Advertising's ADA compliance services.

Lead Details:
- Name: ${lead.full_name}
- Business: ${lead.business_name}
- Website: ${lead.website_url}
- Package: ${lead.package}
- Status: ${lead.status}
- Location: ${lead.city}, ${lead.state}
- Industry: ${lead.industry}
- Number of Locations: ${lead.number_of_locations}
- Site Type: ${lead.site_type}
- Approximate Pages: ${lead.approximate_pages}
- Nonprofit: ${lead.nonprofit ? 'Yes' : 'No'}

Available Packages:
- Starter: Basic compliance fixes
- Growth: Compliance + ongoing monitoring
- Authority: Full service + priority support

Additional Services:
- AI Websites ($297/mo)
- AI SEO ($297/mo)
- AI Social Media ($97-197/mo)
- AI Videos (included in marketing packages)

Analyze this lead and provide:
1. Upsell Opportunities (if they should upgrade their ADA package)
2. Cross-sell Opportunities (other services that fit their business)
3. Key Talking Points (specific benefits for their industry/situation)
4. Risk Assessment (likelihood they need quick action due to legal exposure)

Be specific and actionable. Format as bullet points.`;

    } else if (task_type === 'answer_question') {
      prompt = `You are Rick from New Tech Advertising, an expert in ADA website compliance and accessibility.

Common Knowledge Base:
- Starter Package: $297 setup (nonprofit: $197)
- Growth Package: $497 setup + $97/mo monitoring (nonprofit: $347 + $67/mo)
- Authority Package: $797 setup + $147/mo (nonprofit: $547 + $97/mo)
- WCAG 2.1 Level AA compliance is the legal standard
- Common issues: missing alt text, poor contrast, keyboard navigation, form labels
- High-risk industries: Healthcare, Government, Finance, Education, E-commerce
- ADA applies to businesses with 15+ employees or "places of public accommodation"
- Lawsuits typically demand $5,000-$75,000 in settlements

Question: ${question}

Provide a clear, concise answer (2-3 paragraphs max) that Rick can use in conversation with a client. Be specific about pricing, timelines, and process when relevant.`;

    } else if (task_type === 'crm_intelligence') {
      // Format activity history with details
      const activityDetails = activities.length > 0 ? 
        activities.map(a => {
          const date = new Date(a.created_date).toLocaleString();
          return `[${date}] ${a.activity_type.replace('_', ' ')}: ${a.details || 'No additional details'}`;
        }).join('\n') : 'No activity recorded yet';

      const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_date).getTime()) / (1000 * 60 * 60 * 24));
      const daysSinceUpdate = Math.floor((Date.now() - new Date(lead.updated_date || lead.created_date).getTime()) / (1000 * 60 * 60 * 24));

      prompt = `You are an AI CRM analyst for New Tech Advertising's ADA compliance sales team.

Lead Profile:
- Name: ${lead.full_name}
- Business: ${lead.business_name}
- Industry: ${lead.industry}
- Location: ${lead.city}, ${lead.state}
- Website: ${lead.website_url}
- Package: ${lead.package}
- Current Status: ${lead.status}
- Setup Price: $${lead.setup_price || 'TBD'}
- Monthly Price: $${lead.monthly_price || 'TBD'}
- Nonprofit: ${lead.nonprofit ? 'Yes' : 'No'}
- Number of Locations: ${lead.number_of_locations}
- Site Type: ${lead.site_type}
- Approximate Pages: ${lead.approximate_pages}
- Lead Score: ${lead.lead_score || 'Not calculated'}
- Days Since Created: ${daysSinceCreated}
- Days Since Last Update: ${daysSinceUpdate}
- Notes: ${lead.notes || 'None'}

Complete Activity History (${activities.length} events):
${activityDetails}

Onboarding Status: ${onboarding ? 'Completed' : 'Not completed'}
${onboarding ? `Preferred Contact: ${onboarding.best_contact_method}
Preferred Name: ${onboarding.preferred_contact_name}
Hosting: ${onboarding.hosting_provider || 'Not provided'}
CMS: ${onboarding.cms_platform || 'Not provided'}` : ''}

Market Context (2026):
- ADA lawsuits up 15% year-over-year
- Average settlement: $15,000-$25,000
- High-risk sectors: Healthcare, Retail, Food Service, Professional Services
- Midwest markets (Iowa) seeing increased legal activity
- Businesses with outdated websites (pre-2020) at highest risk

TASK: Provide comprehensive CRM intelligence analysis. Return ONLY valid JSON with this exact structure:

{
  "interaction_summary": "2-3 paragraph narrative summary of all lead interactions, current engagement level, and communication patterns. Include specific dates and activity types.",
  
  "conversion_probability": {
    "score": <number 0-100>,
    "confidence": "High/Medium/Low confidence explanation",
    "key_indicators": [
      "List 3-4 positive signals supporting conversion",
      "Examples: engaged with quote, responsive to emails, high-value package, urgent need"
    ],
    "risk_factors": [
      "List 2-3 concerns that might prevent conversion",
      "Examples: slow response time, price sensitivity, competitive offers"
    ]
  },
  
  "outreach_strategy": {
    "recommended_approach": "Detailed paragraph on the best outreach strategy based on lead behavior, status, and market trends",
    "best_time": "Specific timing recommendation (e.g., 'Within next 48 hours', 'End of business week', 'After 7 days')",
    "talking_points": [
      "4-5 specific discussion topics tailored to this lead",
      "Should address industry, location, package, concerns"
    ],
    "market_context": "How current ADA trends/risks apply specifically to this business and location"
  },
  
  "status_recommendation": {
    "suggested_status": "new/quoted/paid/onboarded/active - recommend most appropriate status",
    "reasoning": "2-3 sentence explanation of why this status is recommended based on activity and engagement",
    "next_steps": [
      "3-4 specific action items in priority order",
      "Should be concrete and time-bound"
    ]
  }
}`;

    } else {
      return Response.json({ error: 'Invalid task_type' }, { status: 400 });
    }

    // Call LLM
    let response;
    
    if (task_type === 'draft_email') {
      // Use JSON schema for email drafting
      response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            subject_line: { type: "string" },
            email_body: { type: "string" }
          },
          required: ["subject_line", "email_body"]
        }
      });
    } else if (task_type === 'crm_intelligence') {
      // Use structured JSON for CRM analysis
      response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true, // Use web context for market trends
        response_json_schema: {
          type: "object",
          properties: {
            interaction_summary: { type: "string" },
            conversion_probability: {
              type: "object",
              properties: {
                score: { type: "number" },
                confidence: { type: "string" },
                key_indicators: { type: "array", items: { type: "string" } },
                risk_factors: { type: "array", items: { type: "string" } }
              }
            },
            outreach_strategy: {
              type: "object",
              properties: {
                recommended_approach: { type: "string" },
                best_time: { type: "string" },
                talking_points: { type: "array", items: { type: "string" } },
                market_context: { type: "string" }
              }
            },
            status_recommendation: {
              type: "object",
              properties: {
                suggested_status: { type: "string" },
                reasoning: { type: "string" },
                next_steps: { type: "array", items: { type: "string" } }
              }
            }
          },
          required: ["interaction_summary", "conversion_probability", "outreach_strategy", "status_recommendation"]
        }
      });
    } else {
      // For other tasks, use plain text response
      response = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });
    }

    return Response.json({ 
      success: true, 
      result: response,
      analysis: task_type === 'crm_intelligence' ? response : null,
      lead: lead ? {
        id: lead.id,
        name: lead.full_name,
        business: lead.business_name,
        status: lead.status
      } : null
    });

  } catch (error) {
    console.error('Sales assistant error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});