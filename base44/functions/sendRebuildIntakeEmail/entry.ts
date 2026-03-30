import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { name, email, phone, business_name, website, service_type, page_count, city, state, industry, notes } = body;

    if (!name || !email || !business_name) {
      return Response.json({ error: 'Missing required fields: name, email, business_name' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    console.log('[sendRebuildIntakeEmail] Processing submission for:', business_name, email);

    // Step 1: Save lead to DB
    let leadId = null;
    try {
      const lead = await base44.asServiceRole.entities.Lead.create({
        name,
        email,
        phone: phone || '',
        business_name,
        website: website || '',
        industry: industry || '',
        service_interest: service_type || 'website_rebuild',
        message: `Rebuild Intake | Service: ${service_type} | Pages: ${page_count} | City: ${city}, ${state} | Notes: ${notes}`,
        status: 'new',
        source: 'rebuild_intake',
      });
      leadId = lead.id;
      console.log('[sendRebuildIntakeEmail] Lead saved to DB:', leadId);
    } catch (dbErr) {
      console.error('[sendRebuildIntakeEmail] Lead DB save failed:', dbErr.message);
    }

    // Step 2: Send notification TO RICK (registered user — this works)
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'NTA Website Intake',
        to: 'rick@newtechadvertising.com',
        subject: `🔔 New Intake: ${business_name} — ${service_type || 'Website Rebuild'}`,
        body: `New website rebuild inquiry received!\n\n` +
          `Name:       ${name}\n` +
          `Email:      ${email}\n` +
          `Phone:      ${phone || 'Not provided'}\n` +
          `Business:   ${business_name}\n` +
          `Website:    ${website || 'Not provided'}\n` +
          `Service:    ${service_type || 'Not specified'}\n` +
          `Pages:      ${page_count || 'Not specified'}\n` +
          `Location:   ${city || ''}, ${state || ''}\n` +
          `Industry:   ${industry || 'Not specified'}\n\n` +
          `Notes:\n${notes || 'None'}\n\n` +
          `Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} CT\n` +
          `Lead ID: ${leadId || 'DB save failed'}`,
      });
      console.log('[sendRebuildIntakeEmail] Notification sent to rick@newtechadvertising.com');
    } catch (notifyErr) {
      console.error('[sendRebuildIntakeEmail] Rick notification failed:', notifyErr.message);
      // Don't fail the whole request — lead is saved, CRM webhook will follow
    }

    // Step 3: Send confirmation to the visitor (only works if they are a registered user)
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising',
        to: email,
        subject: `We received your website audit request — ${business_name}`,
        body: `Hi ${name},\n\nThanks for reaching out! We received your website rebuild / audit request for ${business_name}.\n\nOur team will review your site and get back to you within 1–2 business days.\n\nWhat you submitted:\n- Service: ${service_type}\n- Website: ${website}\n- Pages: ${page_count}\n- Location: ${city}, ${state}\n\nQuestions? Call us: 641-420-8816\n\n— New Tech Advertising Team\nnewtechadvertising.com`,
      });
      console.log('[sendRebuildIntakeEmail] Confirmation sent to visitor:', email);
    } catch (visitorEmailErr) {
      // Non-critical — visitor may not be a registered user
      console.log('[sendRebuildIntakeEmail] Visitor confirmation skipped (not a registered user):', visitorEmailErr.message);
    }

    // Step 4: CRM webhook (if configured)
    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (crmWebhookUrl) {
      try {
        await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rebuild_intake', name, email, phone, business_name, website, service_type, page_count, city, state, industry, notes, lead_id: leadId }),
        });
        console.log('[sendRebuildIntakeEmail] CRM webhook triggered');
      } catch (webhookErr) {
        console.warn('[sendRebuildIntakeEmail] CRM webhook failed:', webhookErr.message);
      }
    }

    return Response.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error('[sendRebuildIntakeEmail] Fatal error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});