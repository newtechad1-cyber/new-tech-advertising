import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const NOTIFY_EMAIL = 'rick@newtechadvertising.com';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { name, email, phone, business_name, website, service_type, page_count, city, state, industry, notes, source, anti_spam } = body;
    const honeypot = String(anti_spam?.honeypot || '').trim();
    const formStartedAt = Number(anti_spam?.form_started_at || 0);
    const elapsedMs = formStartedAt ? Date.now() - formStartedAt : null;

    if (honeypot || (elapsedMs !== null && (elapsedMs < 1500 || elapsedMs > 24 * 60 * 60 * 1000))) {
      return Response.json({ success: true, accepted: false });
    }

    if (!name || !email || !business_name) {
      return Response.json({ error: 'Missing required fields: name, email, business_name' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

    console.log('[sendRebuildIntakeEmail] Processing submission:', business_name, email, '| source:', source || 'unknown');

    let leadId = null;
    let crmFailed = false;
    let emailFailed = false;

    // ── Canonical office intake ────────────────────────────────────────────
    const rebuildOfferMap = {
      ada_rebuild: 'ada_compliance',
      website_rebuild: 'website_rebuild',
      both: 'website_rebuild',
    };
    const rebuildOfferType = rebuildOfferMap[service_type] || 'website_rebuild';
    let intakeResult = null;

    try {
      const intakeResponse = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'website_rebuild_intake',
        offer_type: rebuildOfferType,
        mapping_confidence: 'hardcoded',
        mapping_notes: `sendRebuildIntakeEmail; service_type=${service_type}`,
        detected_route: '/rebuild-intake',
        detected_component: 'RebuildIntake',
        source_system: 'rebuild_intake',
        source_page: source || '/rebuild-intake',
        name,
        business_name,
        email,
        phone: phone || '',
        website: website || '',
        city: city || '',
        state: state || '',
        notes: `Service: ${service_type} | Pages: ${page_count}${notes ? ' | ' + notes : ''}`,
        priority: 'high',
        is_high_intent: true,
        skip_webhook: true,
        anti_spam,
      });
      intakeResult = intakeResponse?.data ?? intakeResponse;
      leadId = intakeResult?.sales_lead_id || null;
      console.log('[sendRebuildIntakeEmail] Canonical CRM save SUCCESS — SalesLead ID:', leadId);
    } catch (crmErr) {
      crmFailed = true;
      console.error('[sendRebuildIntakeEmail] Canonical CRM save FAILED:', crmErr.message);
      // Do NOT return — continue to send email regardless.
    }

    // ── STEP 2: Send email notification to Rick via Resend ─────────────────
    try {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      console.log('[sendRebuildIntakeEmail] Email send started to:', NOTIFY_EMAIL, '| resend key present:', !!resendKey);
      if (!resendKey) throw new Error('RESEND_API_KEY not set');
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'NTA Intake <onboarding@resend.dev>',
          to: [NOTIFY_EMAIL],
          subject: `New Website Audit Lead: ${business_name}`,
          text: [
            'New website audit request received!',
            '',
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
            '',
            'Notes:',
            notes || 'None',
            '',
            `Submitted: ${submittedAt} CT`,
            `Lead ID: ${leadId || (crmFailed ? 'CRM SAVE FAILED' : 'unknown')}`,
          ].join('\n'),
        }),
      });
      const resendBody = await resendRes.json();
      if (!resendRes.ok) {
        console.error('[sendRebuildIntakeEmail] Resend error body:', JSON.stringify(resendBody));
        throw new Error(`Resend ${resendRes.status}: ${resendBody.message || resendBody.name || JSON.stringify(resendBody)}`);
      }
      console.log('[sendRebuildIntakeEmail] Resend response:', JSON.stringify(resendBody));
      console.log('[sendRebuildIntakeEmail] Email send SUCCESS to:', NOTIFY_EMAIL);
    } catch (emailErr) {
      emailFailed = true;
      console.error('[sendRebuildIntakeEmail] Email send FAILED:', emailErr.message);

      // ── BACKUP ALERT: flag lead + create activity record ──────────────────
      if (leadId) {
        const alertNote = `ALERT: Email notification failed for this lead. Source: ${source || 'unknown'}. Business: ${business_name}. Contact: ${name} | ${email} | ${phone || 'no phone'}. Submitted: ${submittedAt} CT. Reason: ${emailErr.message}`;
        try {
          await base44.asServiceRole.entities.Lead.update(leadId, {
            internal_notes: alertNote,
            status: 'new',
          });
          console.log('[sendRebuildIntakeEmail] BACKUP: Lead flagged with email failure note, lead ID:', leadId);
        } catch (flagErr) {
          console.error('[sendRebuildIntakeEmail] BACKUP: Failed to flag lead:', flagErr.message);
        }

        try {
          await base44.asServiceRole.entities.LeadActivity.create({
            lead_id: leadId,
            company_name: business_name,
            activity_type: 'form_submission',
            page_url: source || 'rebuild-intake',
            page_visited: `Rebuild Intake — ${source || 'unknown'}`,
            details: `BACKUP ALERT — Email notification failed. Manual follow-up required.\n\nLead Details:\n- Business: ${business_name}\n- Contact: ${name}\n- Email: ${email}\n- Phone: ${phone || 'not provided'}\n- Website: ${website || 'not provided'}\n- Source: ${source || 'unknown'}\n- Submitted: ${submittedAt} CT\n- Error: ${emailErr.message}`,
          });
          console.log('[sendRebuildIntakeEmail] BACKUP: LeadActivity alert record created for lead ID:', leadId);
        } catch (actErr) {
          console.error('[sendRebuildIntakeEmail] BACKUP: Failed to create LeadActivity alert:', actErr.message);
        }
      } else {
        console.error('[sendRebuildIntakeEmail] BACKUP: Cannot create alert — no lead ID (CRM also failed). Full details:', { name, email, business_name, phone, source, submittedAt });
      }
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
      sales_lead_id: leadId,
      crm_failed: crmFailed,
      email_failed: emailFailed,
    });

  } catch (err) {
    console.error('[sendRebuildIntakeEmail] Fatal error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
});
