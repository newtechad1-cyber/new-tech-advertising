import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Supports both direct invocation and entity automation payload
    const account_id = body.account_id || body.data?.account_id;

    if (!account_id) {
      return Response.json({ error: 'Missing account_id' }, { status: 400 });
    }

    // Fetch TrialAccount
    const account = await base44.asServiceRole.entities.TrialAccount.get(account_id);
    if (!account) {
      return Response.json({ error: 'TrialAccount not found' }, { status: 404 });
    }

    // Fetch BrandDNA
    const dnaList = await base44.asServiceRole.entities.BrandDNA.filter({ account_id });
    const dna = dnaList[0] || null;

    // ── NTA Unified Intake Mirror (non-blocking) ──────────────────────────
    base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'trial',
      source_system: 'website',
      source_page: '/trial',
      name: account.full_name || account.name,
      business_name: account.name,
      email: account.email,
      phone: account.phone || '',
      website: account.website_url || '',
      city: account.location_city,
      state: account.location_state,
      notes: `Trial signup. Goal: ${account.primary_goal || 'N/A'}`,
      priority: 'medium',
      raw_payload: { account_id: account.id, ...account },
    }).catch(err => console.warn('[sendTrialToCRM] NTA mirror failed (non-critical):', err.message));
    // ─────────────────────────────────────────────────────────────────────

    // Upsert Lead record into the internal CRM (Base44 Lead entity)
    // Check if a lead with this email already exists to avoid duplicates
    const existingLeads = await base44.asServiceRole.entities.Lead.filter({ email: account.email });
    if (!existingLeads.length) {
      await base44.asServiceRole.entities.Lead.create({
        name: account.full_name || account.name,
        email: account.email,
        phone: account.phone || '',
        business_name: account.name,
        website: account.website_url || '',
        industry: account.industry,
        city: account.location_city,
        state: account.location_state,
        service_interest: 'diy_saas',
        message: `Trial signup. Involvement: ${account.involvement_preference || 'undecided'}. Notes: ${dna?.notes || ''}`,
        status: 'new',
        source: 'website',
      });
      console.log(`[sendTrialToCRM] Lead created in internal CRM for ${account.email}`);
    } else {
      console.log(`[sendTrialToCRM] Lead already exists for ${account.email}, skipping duplicate`);
    }

    // Also fire external CRM webhook if configured (best-effort, non-blocking)
    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (crmWebhookUrl) {
      try {
        await fetch(crmWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Webhook-Source': 'newtechadvertising-trial-onboarding' },
          body: JSON.stringify({ event: 'trial_onboarding_submitted', timestamp: new Date().toISOString(), account: { id: account.id, name: account.name, email: account.email, phone: account.phone || '', industry: account.industry, location_city: account.location_city, location_state: account.location_state } }),
        });
      } catch (webhookErr) {
        console.warn('[sendTrialToCRM] External CRM webhook failed (non-critical):', webhookErr.message);
      }
    }

    // Send internal notification email
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'New Tech Platform',
        to: 'newtechad1@gmail.com',
        subject: `🆕 Trial Onboarding Submitted: ${account.name}`,
        body: `A new trial account has completed onboarding.

Business: ${account.name}
Email: ${account.email}
Phone: ${account.phone || 'N/A'}
Industry: ${account.industry}
Location: ${account.location_city}, ${account.location_state}
Website: ${account.website_url || 'N/A'}
Involvement Preference: ${account.involvement_preference}

Brand DNA:
- Audience: ${dna?.audience || 'N/A'}
- Goals: ${(dna?.goals || []).join(', ') || 'N/A'}
- Offers: ${(dna?.offers || []).join(', ') || 'N/A'}
- Differentiators: ${(dna?.differentiators || []).join(', ') || 'N/A'}
- Voice/Tone: ${dna?.voice_tone || 'N/A'}
- Content Pillars: ${(dna?.content_pillars || []).join(', ') || 'N/A'}
- CTA Style: ${dna?.cta_style || 'N/A'}
- Notes: ${dna?.notes || 'None'}

Social Links:
- Facebook: ${dna?.facebook_url || 'N/A'}
- Instagram: ${dna?.instagram_url || 'N/A'}
- LinkedIn: ${dna?.linkedin_url || 'N/A'}
- TikTok: ${dna?.tiktok_url || 'N/A'}

Data has been sent to CRM automatically.
`,
      });
    } catch (emailErr) {
      console.error('Admin email failed (non-critical):', emailErr);
    }

    return Response.json({ success: true, crm: 'internal_lead_saved' });
  } catch (error) {
    console.error('sendTrialToCRM error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});