import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.json();

    // ── NTA Unified Intake Mirror (non-blocking) ──────────────────────────
    base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'ada',
      source_system: 'ada_funnel',
      source_page: '/ada',
      name: formData.name,
      business_name: formData.business,
      email: formData.email,
      phone: formData.phone,
      website: formData.website_url,
      city: formData.city,
      state: formData.state,
      notes: formData.notes || '',
      priority: 'high',
      is_high_intent: true,
      raw_payload: formData,
    }).catch(err => console.warn('[adaIntake] NTA mirror failed (non-critical):', err.message));
    // ─────────────────────────────────────────────────────────────────────

    // Create lead in database
    const lead = await base44.asServiceRole.entities.AdaLead.create({
      full_name: formData.name,
      business_name: formData.business,
      email: formData.email,
      phone: formData.phone,
      website_url: formData.website_url,
      city: formData.city,
      state: formData.state,
      nonprofit: formData.nonprofit || false,
      number_of_locations: formData.locations,
      site_type: formData.site_type,
      approximate_pages: formData.pages,
      industry: formData.industry,
      notes: formData.notes || '',
      package: formData.selected_package,
      status: 'new'
    });

    // Track activity
    await base44.asServiceRole.entities.LeadActivity.create({
      lead_id: lead.id,
      activity_type: 'form_submission',
      page_url: '/ada',
      details: `ADA intake form submitted for ${formData.selected_package} package`
    });

    // Emit webhook event
    try {
      await base44.asServiceRole.functions.invoke('adaWebhookHandler', {
        event: 'ada_intake_submitted',
        lead_id: lead.id,
        contact: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business
        },
        package: formData.selected_package,
        details: {
          website_url: formData.website_url,
          city: formData.city,
          state: formData.state,
          nonprofit: formData.nonprofit,
          locations: formData.locations,
          site_type: formData.site_type,
          pages: formData.pages,
          industry: formData.industry
        }
      });
    } catch (webhookError) {
      console.log('Webhook notification failed:', webhookError);
    }

    return Response.json({ 
      success: true, 
      lead_id: lead.id
    });

  } catch (error) {
    console.error('ADA intake error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});