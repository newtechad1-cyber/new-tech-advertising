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
      // ── BACKUP ALERT: log the failure without creating a second lead ────
      try {
        await base44.asServiceRole.entities.SystemLog.create({
          event_type: 'Rebuild Intake Email Failure',
          status: 'warning',
          source_system: 'rebuild_intake',
          source_route: source || '/rebuild-intake',
          workflow_type: 'email',
          message: `Email notification failed for ${business_name}. Manual follow-up required.`,
          payload_snapshot: JSON.stringify({
            name, email, phone, business_name, website, service_type, page_count,
            city, state, source, submittedAt, sales_lead_id: leadId,
            error: emailErr.message,
          }),
        });
        console.log('[sendRebuildIntakeEmail] BACKUP: failure logged; SalesLead ID:', leadId || 'none');
      } catch (logErr) {
        console.error('[sendRebuildIntakeEmail] BACKUP: failed to log email failure:', logErr.message);
      }
    }

    // Visitor confirmations are intentionally omitted here. This public endpoint
    // must never dispatch email to an arbitrary caller-supplied address. The
    // canonical intake record and fixed internal notification remain the source
    // of truth for follow-up.

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
