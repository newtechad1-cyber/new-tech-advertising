import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, lead_id, send_immediately } = await req.json();

    if (action === 'generate_sequence') {
      // Generate follow-up email for a specific lead
      const leads = await base44.asServiceRole.entities.AdaLead.filter({ id: lead_id });
      if (leads.length === 0) {
        return Response.json({ error: 'Lead not found' }, { status: 404 });
      }

      const lead = leads[0];
      
      // Get activity history
      const activities = await base44.asServiceRole.entities.LeadActivity.filter({ lead_id }, '-created_date', 10);
      
      // Calculate days since last update
      const daysSinceUpdate = Math.floor((Date.now() - new Date(lead.updated_date || lead.created_date).getTime()) / (1000 * 60 * 60 * 24));
      
      // Format activity summary
      const activitySummary = activities.length > 0 ? 
        activities.map(a => {
          const date = new Date(a.created_date).toLocaleDateString();
          return `- ${date}: ${a.activity_type.replace('_', ' ')} ${a.details ? '(' + a.details + ')' : ''}`;
        }).join('\n') : 'None';

      // Determine email strategy based on status and timing
      let emailContext = '';
      if (lead.status === 'new' && daysSinceUpdate >= 2) {
        emailContext = 'This is a new lead who submitted a form 2+ days ago but hasn\'t been contacted yet. Send a warm welcome email introducing yourself, acknowledging their inquiry, and offering to answer questions. Keep it friendly and low-pressure.';
      } else if (lead.status === 'quoted' && daysSinceUpdate >= 3) {
        emailContext = 'This lead received a quote 3+ days ago but hasn\'t moved forward. Send a gentle follow-up checking if they have questions about the quote, reiterating the value, and offering to hop on a quick call. Address potential concerns proactively.';
      } else if (lead.status === 'quoted' && daysSinceUpdate >= 7) {
        emailContext = 'This lead has had a quote for a week with no response. Send a re-engagement email with a fresh angle - perhaps share a relevant case study, mention a time-sensitive factor (ADA risk), or offer a limited-time consideration. More direct but still friendly.';
      } else if (lead.status === 'new' && daysSinceUpdate >= 7) {
        emailContext = 'This lead is a week old with no engagement. Send a check-in email acknowledging the delay, reaffirming you\'re available, and perhaps sharing a helpful resource about ADA compliance. Give them an easy out if they\'re not interested.';
      } else {
        emailContext = 'Standard follow-up based on lead status and timing.';
      }

      const prompt = `You are Rick from New Tech Advertising, a friendly and professional ADA compliance expert.

Lead Details:
- Name: ${lead.full_name}
- Business: ${lead.business_name}
- Website: ${lead.website_url}
- Package: ${lead.package}
- Status: ${lead.status}
- Setup Price: $${lead.setup_price || 'TBD'}
- Monthly Price: $${lead.monthly_price || 'TBD'}
- Location: ${lead.city}, ${lead.state}
- Industry: ${lead.industry}
- Days Since Last Update: ${daysSinceUpdate}

Recent Activity History:
${activitySummary}

Follow-up Strategy:
${emailContext}

CRITICAL INSTRUCTIONS:
1. Draft a personalized follow-up email based on the strategy above
2. Return response as JSON with TWO fields: "subject_line" and "email_body"
3. Subject line should be:
   - Short (4-8 words max)
   - Personalized with business name if possible
   - Curiosity-inducing or value-focused
   - Professional but conversational
   - Examples: "Quick ADA question, ${lead.full_name.split(' ')[0]}", "${lead.business_name} accessibility update", "Following up on your website review"

Email Requirements:
- Use lead's first name naturally
- Reference their specific situation (business, industry, package)
- Be conversational and warm, not salesy
- Address timing naturally if there's been a delay
- Include a clear, easy next step
- Rick's signature: 641-420-8816 / rick@newtechadvertising.com
- Sign as "— Rick"
- 3-4 short paragraphs max
- Rick's tone: helpful friend who happens to be an expert, not a pushy salesperson

Return ONLY valid JSON:
{
  "subject_line": "Your subject line here",
  "email_body": "Email content here"
}`;

      const emailDraft = await base44.asServiceRole.integrations.Core.InvokeLLM({
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

      // If send_immediately is true, send the email now
      if (send_immediately) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: lead.email,
            subject: emailDraft.subject_line,
            body: emailDraft.email_body
          });

          // Track email sent activity
          await base44.asServiceRole.entities.LeadActivity.create({
            lead_id,
            activity_type: 'email_sent',
            details: `Automated follow-up: ${emailDraft.subject_line}`,
            metadata: {
              subject: emailDraft.subject_line,
              automated: true
            }
          });

          return Response.json({ 
            success: true, 
            email: emailDraft,
            sent: true,
            message: 'Email drafted and sent successfully'
          });
        } catch (emailError) {
          return Response.json({ 
            success: true, 
            email: emailDraft,
            sent: false,
            error: 'Email drafted but failed to send: ' + emailError.message
          });
        }
      }

      return Response.json({ 
        success: true, 
        email: emailDraft,
        sent: false
      });

    } else if (action === 'check_all_leads') {
      // Check all leads and generate follow-up recommendations
      const allLeads = await base44.asServiceRole.entities.AdaLead.list('-updated_date', 100);
      const recommendations = [];

      for (const lead of allLeads) {
        const daysSinceUpdate = Math.floor((Date.now() - new Date(lead.updated_date || lead.created_date).getTime()) / (1000 * 60 * 60 * 24));
        
        let needsFollowUp = false;
        let reason = '';

        if (lead.status === 'new' && daysSinceUpdate >= 2) {
          needsFollowUp = true;
          reason = `New lead, ${daysSinceUpdate} days since submission`;
        } else if (lead.status === 'quoted' && daysSinceUpdate >= 3) {
          needsFollowUp = true;
          reason = `Quoted ${daysSinceUpdate} days ago, no response`;
        } else if (lead.status === 'new' && daysSinceUpdate >= 7) {
          needsFollowUp = true;
          reason = `Cold lead, ${daysSinceUpdate} days with no engagement`;
        }

        if (needsFollowUp) {
          recommendations.push({
            lead_id: lead.id,
            business_name: lead.business_name,
            full_name: lead.full_name,
            email: lead.email,
            status: lead.status,
            days_since_update: daysSinceUpdate,
            reason
          });
        }
      }

      return Response.json({ 
        success: true, 
        recommendations,
        total: recommendations.length
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Automated follow-up error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});