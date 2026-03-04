import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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

    const crmWebhookUrl = Deno.env.get('CRM_WEBHOOK_URL');
    if (!crmWebhookUrl) {
      console.warn('CRM_WEBHOOK_URL not set — skipping CRM push');
      return Response.json({ success: true, skipped: true, reason: 'CRM_WEBHOOK_URL not configured' });
    }

    const payload = {
      event: 'trial_onboarding_submitted',
      timestamp: new Date().toISOString(),
      account: {
        id: account.id,
        name: account.name,
        slug: account.slug,
        email: account.email,
        phone: account.phone || '',
        industry: account.industry,
        location_city: account.location_city,
        location_state: account.location_state,
        website_url: account.website_url || '',
        involvement_preference: account.involvement_preference,
        trial_status: account.trial_status,
        trial_start_at: account.trial_start_at,
        trial_end_at: account.trial_end_at,
      },
      brand_dna: dna ? {
        audience: dna.audience,
        goals: dna.goals || [],
        offers: dna.offers || [],
        differentiators: dna.differentiators || [],
        voice_tone: dna.voice_tone,
        content_pillars: dna.content_pillars || [],
        do_not_use: dna.do_not_use || [],
        cta_style: dna.cta_style,
        facebook_url: dna.facebook_url || '',
        instagram_url: dna.instagram_url || '',
        linkedin_url: dna.linkedin_url || '',
        tiktok_url: dna.tiktok_url || '',
        notes: dna.notes || '',
      } : null,
    };

    const response = await fetch(crmWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'newtechadvertising-trial-onboarding',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`CRM webhook response: ${response.status} — ${responseText}`);

    if (!response.ok) {
      return Response.json({ error: 'CRM webhook returned error', status: response.status, body: responseText }, { status: 502 });
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

    return Response.json({ success: true, crm_status: response.status });
  } catch (error) {
    console.error('sendTrialToCRM error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});