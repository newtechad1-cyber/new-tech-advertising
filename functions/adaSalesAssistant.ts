import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { task_type, lead_id, question, context } = await req.json();

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