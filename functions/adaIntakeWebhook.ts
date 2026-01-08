import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const timestamp = new Date().toISOString();
    const webhookPayload = {
      event: 'ada_intake_submitted',
      timestamp,
      source: 'newtechadvertising.com',
      page: 'AdaIntake',
      package: payload.package,
      pricing: {
        setup: 0,
        monthly: 0,
        multiplier: 1.0,
        adjustments: []
      },
      contact: {
        name: payload.full_name,
        business: payload.business_name,
        email: payload.email,
        phone: payload.phone,
        website: payload.website_url,
        city: payload.city,
        state: payload.state
      },
      details: {
        locations: payload.number_of_locations,
        site_type: payload.site_type,
        pages: payload.approximate_pages,
        industry: payload.industry,
        notes: payload.notes || ''
      }
    };

    // Send confirmation email/SMS to customer
    try {
      await base44.asServiceRole.functions.invoke('sendAdaIntakeConfirmation', {
        lead_id: payload.lead_id
      });
    } catch (confirmError) {
      console.error('Confirmation send failed:', confirmError);
    }

    // Send email notification to Rick
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'rick@newtechadvertising.com',
        subject: `New ADA Request: ${payload.business_name}`,
        body: `New ADA Intake Submission

Package: ${payload.package}${payload.nonprofit ? ' (Nonprofit)' : ''}

Contact Information:
- Name: ${payload.full_name}
- Business: ${payload.business_name}
- Email: ${payload.email}
- Phone: ${payload.phone}
- Website: ${payload.website_url}
- Location: ${payload.city}, ${payload.state}

Website Details:
- Type: ${payload.site_type}
- Pages: ${payload.approximate_pages}
- Locations: ${payload.number_of_locations}
- Industry: ${payload.industry}

Notes: ${payload.notes || 'None'}

Lead ID: ${payload.lead_id}

---
View in Dashboard: https://newtechadvertising.com${payload.lead_id ? '?lead=' + payload.lead_id : ''}`
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    // Note: CRM and Agent webhook URLs should be configured as environment variables
    // For now, we'll return success
    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    const agentWebhookUrl = Deno.env.get('AGENT_WEBHOOK_URL');

    const webhookPromises = [];
    
    if (crmWebhookUrl) {
      webhookPromises.push(
        fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        })
      );
    }

    if (agentWebhookUrl) {
      webhookPromises.push(
        fetch(agentWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        })
      );
    }

    if (webhookPromises.length > 0) {
      await Promise.all(webhookPromises);
    }

    return Response.json({ 
      success: true,
      message: 'Intake submitted successfully',
      webhooks_sent: webhookPromises.length
    });

  } catch (error) {
    console.error('ADA Intake Webhook Error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});