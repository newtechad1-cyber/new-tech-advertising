import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const NTA_KEY = 'e762e17c5dafa164dcae394bb01324ed2eef644edd45e621389666be4fbb4910';

async function callTwin(webhookUrl, payload) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-NTA-KEY': NTA_KEY,
    },
    body: JSON.stringify(payload),
  });
  return response.json().catch(() => ({}));
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { business_name, contact_name, website, phone, email } = body;

  if (!business_name) {
    return Response.json({ error: 'business_name is required' }, { status: 400 });
  }

  const submitted = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

  // 1. Create Prospect record
  const prospect = await base44.asServiceRole.entities.Prospect.create({
    business_name,
    contact_name: contact_name || '',
    phone: phone || '',
    website: website || '',
    email: email || '',
    status: 'new',
    audit_status: 'requested',
    notes: `Gap Audit form submission — ${submitted}\nSource: Gap Audit form`,
  });

  // 2. Create linked GapAudit record
  const audit = await base44.asServiceRole.entities.GapAudit.create({
    prospect_id: prospect.id,
    website_url: website || '',
    status: 'draft',
  });

  // 3. Twin: Generate Gap Audit
  const agentWebhookUrl = Deno.env.get('AGENT_WEBHOOK_URL');
  if (agentWebhookUrl) {
    const auditPrompt =
      `CLIENT:\n${business_name}\n\n` +
      `WEBSITE:\n${website || 'Not provided'}\n\n` +
      `CONTACT:\n${contact_name || 'Not provided'}\n\n` +
      `PHONE:\n${phone || 'Not provided'}\n\n` +
      `REQUEST:\nGenerate a Gap Audit summary, top website/SEO/message gaps, recommended next steps, and a short follow-up text/email Rick can send manually.`;

    callTwin(agentWebhookUrl, {
      task: 'gap_audit',
      prospect_id: prospect.id,
      audit_id: audit.id,
      input: auditPrompt,
    }).catch(err => console.error('[Twin gap_audit] failed:', err.message));

    // 4. Twin: Generate Follow-Up Sequence
    const followUpPrompt =
      `CLIENT:\n${business_name}\n\n` +
      `WEBSITE:\n${website || 'Not provided'}\n\n` +
      `CONTACT:\n${contact_name || 'Not provided'}\n\n` +
      `PHONE:\n${phone || 'Not provided'}\n\n` +
      `REQUEST:\nGenerate a follow-up sequence Rick will send manually:\n` +
      `1. First response text message\n` +
      `2. First follow-up email\n` +
      `3. Second follow-up email\n` +
      `4. Soft value-add message`;

    callTwin(agentWebhookUrl, {
      task: 'followup_sequence',
      prospect_id: prospect.id,
      input: followUpPrompt,
    }).catch(err => console.error('[Twin followup_sequence] failed:', err.message));
  }

  // 5. Email Rick
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: 'rick@newtechadvertising.com',
    subject: `New Gap Audit Request — ${business_name}`,
    body:
      `New Gap Audit request from ${business_name}.\n\n` +
      `Contact: ${contact_name || 'N/A'}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Email: ${email || 'N/A'}\n` +
      `Website: ${website || 'N/A'}\n` +
      `Submitted: ${submitted}\n\n` +
      `Review at: https://newtechadvertising.com/ops/audits`,
  });

  return Response.json({ success: true, prospect_id: prospect.id });
});