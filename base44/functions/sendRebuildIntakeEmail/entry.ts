import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const NOTIFY_EMAIL = 'rick@newtechadvertising.com';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { name, email, phone, business_name, website, service_type, page_count, city, state, industry, notes, source } = body;

    if (!name || !email || !business_name) {
      return Response.json({ error: 'Missing required fields: name, email, business_name' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

    console.log('[sendRebuildIntakeEmail] Processing submission:', business_name, email, '| source:', source || 'unknown');

    let leadId = null;
    let crmFailed = false;
    let emailFailed = false;

    // ── STEP 1: Save Lead to CRM ──────────────────────────────────────────
    try {
      console.log('[sendRebuildIntakeEmail] CRM save started...');
      const lead = await base44.asServiceRole.entities.Lead.create({
        name,
        email,
        phone: phone || '',
        business_name,
        website: website || '',
        industry: industry || '',
        service_interest: service_type || 'website_rebuild',
        message: `Rebuild Intake | Service: ${service_type} | Pages: ${page_count} | City: ${city || ''}, ${state || ''} | Source: ${source || 'unknown'} | Notes: ${notes || 'none'}`,
        status: 'new',
        source: source || 'rebuild_intake',
        lead_source_page: source || 'rebuild_intake',
      });
      leadId = lead.id;
      console.log('[sendRebuildIntakeEmail] CRM save SUCCESS — lead ID:', leadId);
    } catch (crmErr) {
      crmFailed = true;
      console.error('[sendRebuildIntakeEmail] CRM save FAILED:', crmErr.message);
      // Do NOT return — continue to send email regardless
    }

    // ── STEP 2: Send email notification to Rick ───────────────────────────
    try {
      console.log('[sendRebuildIntakeEmail] Email send started to:', NOTIFY_EMAIL);
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'NTA Website Intake',
        to: NOTIFY_EMAIL,
        subject: `New Website Audit Lead: ${business_name}`,
        body: [
          `New website audit request received!`,
          ``,
          `Name:         ${name}`,
          `Email:        ${email}`,
          `Phone:        ${phone || 'Not provided'}`,
          `Business:     ${business_name}`,
          `Website:      ${website || 'Not provided'}`,
          `Service:      ${service_type || 'Not specified'}`,
          `Pages:        ${page_count || 'Not specified'}`,
          `Location:     ${city || ''}, ${state || ''}`,
          `Industry:     ${industry || 'Not specified'}`,
          `Source Page:  ${source || 'unknown'}`,
          ``,
          `Notes:`,
          notes || 'None',
          ``,
          `Submitted: ${submittedAt} CT`,
          `Lead ID: ${leadId || (crmFailed ? 'CRM SAVE FAILED' : 'unknown')}`,
        ].join('\n'),
      });
      console.log('[sendRebuildIntakeEmail] Email send SUCCESS to:', NOTIFY_EMAIL);
    } catch (emailErr) {
      emailFailed = true;
      console.error('[sendRebuildIntakeEmail] Email send FAILED:', emailErr.message);
      // Do NOT return — still report success if CRM saved
    }

    // ── STEP 3: Send visitor confirmation (non-critical, best-effort) ─────
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising',
        to: email,
        subject: `We received your website audit request — ${business_name}`,
        body: `Hi ${name},\n\nThanks for reaching out! We received your website rebuild and audit request for ${business_name}.\n\nOur team will review your site and get back to you within 1–2 business days.\n\nWhat you submitted:\n- Service: ${service_type}\n- Website: ${website}\n- Pages: ${page_count}\n- Location: ${city}, ${state}\n\nQuestions? Call us: 641-420-8816\n\n— New Tech Advertising Team\nnewtechadvertising.com`,
      });
      console.log('[sendRebuildIntakeEmail] Visitor confirmation sent to:', email);
    } catch (_) {
      // Non-critical — visitor may not be a registered app user
      console.log('[sendRebuildIntakeEmail] Visitor confirmation skipped (not a registered user)');
    }

    // ── STEP 4: CRM webhook (optional, non-blocking) ──────────────────────
    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (crmWebhookUrl) {
      try {
        await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'rebuild_intake', name, email, phone, business_name, website, service_type, page_count, city, state, industry, notes, source, lead_id: leadId }),
        });
        console.log('[sendRebuildIntakeEmail] CRM webhook triggered');
      } catch (webhookErr) {
        console.warn('[sendRebuildIntakeEmail] CRM webhook failed (non-critical):', webhookErr.message);
      }
    }

    // ── FINAL: Determine overall success ─────────────────────────────────
    // Success if at least CRM or email succeeded
    const overallSuccess = !crmFailed || !emailFailed;

    if (!overallSuccess) {
      // Both failed — return error so the frontend shows the error state
      return Response.json({
        success: false,
        error: 'Both CRM save and email notification failed. Please contact us directly.',
        crm_failed: true,
        email_failed: true,
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      lead_id: leadId,
      crm_failed: crmFailed,
      email_failed: emailFailed,
    });

  } catch (err) {
    console.error('[sendRebuildIntakeEmail] Fatal error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});