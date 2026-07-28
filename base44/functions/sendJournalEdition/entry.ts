import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SECTION_ORDER = [
  ['from_ricks_desk', "From Rick's Desk"],
  ['what_we_built', 'What We Built'],
  ['what_we_learned', 'What We Learned'],
  ['what_it_means_for_your_business', 'What It Means For Your Business'],
  ['this_weeks_challenge', "This Week's Challenge"],
];

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function plainText(value, maxLength = 10000) {
  return String(value || '').trim().slice(0, maxLength);
}

function paragraphs(markdown) {
  return plainText(markdown)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const isList = lines.every((line) => /^[-*]\s+|^\d+\.\s+/.test(line));
      if (isList) {
        return `<ul style="padding-left:22px;margin:0 0 20px;">${lines
          .map((line) => `<li style="margin:0 0 8px;">${escapeHtml(line.replace(/^[-*]\s+|^\d+\.\s+/, ''))}</li>`)
          .join('')}</ul>`;
      }
      return `<p style="margin:0 0 18px;line-height:1.7;">${escapeHtml(lines.join(' '))}</p>`;
    })
    .join('');
}

function buildEmail(issue) {
  const publicBaseUrl = (Deno.env.get('NTA_PUBLIC_URL') || 'https://newtechadvertising.com').replace(/\/$/, '');
  const issueUrl = `${publicBaseUrl}/journal/${encodeURIComponent(issue.slug)}`;
  const sections = SECTION_ORDER
    .filter(([key]) => plainText(issue[key]))
    .map(([key, label]) => `
      <section style="margin:0 0 34px;">
        <h2 style="color:#172554;font-size:22px;line-height:1.25;margin:0 0 14px;">${escapeHtml(label)}</h2>
        ${paragraphs(issue[key])}
      </section>`)
    .join('');

  const htmlContent = `<!doctype html>
<html>
  <body style="margin:0;background:#f1f5f9;color:#334155;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(issue.summary || `The NTA Journal, Issue #${issue.issue_number}`)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;">
      <tr><td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#172554;color:#ffffff;padding:34px 34px 30px;text-align:center;">
            <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#93c5fd;">The NTA Journal · Issue #${Number(issue.issue_number)}</div>
            <h1 style="font-size:34px;line-height:1.15;margin:14px 0 8px;">${escapeHtml(issue.title)}</h1>
            ${issue.subtitle ? `<p style="margin:0;color:#cbd5e1;font-size:17px;">${escapeHtml(issue.subtitle)}</p>` : ''}
          </td></tr>
          <tr><td style="padding:36px 34px 20px;">
            ${sections}
            ${issue.closing_message ? `<div style="border-top:1px solid #e2e8f0;padding-top:24px;">${paragraphs(issue.closing_message)}</div>` : ''}
            <p style="margin:26px 0;text-align:center;">
              <a href="${escapeHtml(issueUrl)}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:9px;">Read this edition on the NTA website</a>
            </p>
            <p style="margin:26px 0 0;line-height:1.6;">Rick Hesse<br>New Tech Advertising<br><em>Your Digital Growth Guide™</em></p>
          </td></tr>
          <tr><td style="background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6;padding:22px 34px;text-align:center;">
            You are receiving this because you subscribed to The NTA Journal.<br>
            {{ unsubscribe }}<br>
            New Tech Advertising · Mason City, Iowa
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return {
    issueUrl,
    htmlContent,
    subject: plainText(issue.newsletter_subject, 200) || `The NTA Journal #${issue.issue_number} — ${plainText(issue.title, 140)}`,
    previewText: plainText(issue.summary, 255) || `Issue #${issue.issue_number} of The NTA Journal`,
  };
}

async function brevoRequest(path, options = {}) {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) throw new Error('BREVO_API_KEY is not configured.');

  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo returned ${response.status}: ${detail.slice(0, 300)}`);
  }

  if (response.status === 204) return {};
  return response.json();
}

function validateIssue(issue) {
  if (!issue || !Number.isInteger(Number(issue.issue_number))) return 'A valid issue number is required.';
  if (!plainText(issue.title, 200)) return 'The issue title is required.';
  if (!plainText(issue.slug, 300)) return 'The issue slug is required.';
  if (issue.status !== 'Published') return 'Only a published Journal edition can be emailed.';
  if (!SECTION_ORDER.some(([key]) => plainText(issue[key]))) return 'The Journal edition has no publishable sections.';
  return '';
}

Deno.serve(async (req) => {
  let delivery;
  let base44;

  try {
    base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json();
    const action = payload?.action;
    const issue = payload?.issue;
    const validationError = validateIssue(issue);

    if (!['test', 'send'].includes(action)) {
      return Response.json({ error: 'Action must be test or send.' }, { status: 400 });
    }
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }

    const listId = Number(Deno.env.get('BREVO_JOURNAL_LIST_ID'));
    const senderEmail = Deno.env.get('BREVO_FROM_EMAIL');
    const senderName = Deno.env.get('BREVO_FROM_NAME') || 'New Tech Advertising';
    const replyTo = Deno.env.get('LEAD_REPLY_TO_EMAIL') || senderEmail;
    const testRecipient = Deno.env.get('JOURNAL_TEST_TO') || replyTo;

    if (!Number.isInteger(listId) || listId <= 0 || !senderEmail || !testRecipient) {
      return Response.json({ error: 'Journal email settings are incomplete.' }, { status: 503 });
    }

    if (action === 'test' && Deno.env.get('BREVO_JOURNAL_TEST_ENABLED') !== 'true') {
      return Response.json({ error: 'Journal test sending is disabled.' }, { status: 403 });
    }
    if (action === 'send') {
      if (Deno.env.get('BREVO_JOURNAL_SEND_ENABLED') !== 'true') {
        return Response.json({ error: 'Journal subscriber sending is disabled.' }, { status: 403 });
      }
      if (payload?.confirm_send !== true || payload?.confirm_issue_slug !== issue.slug) {
        return Response.json({ error: 'The subscriber send confirmation did not match this issue.' }, { status: 400 });
      }

      const prior = await base44.asServiceRole.entities.JournalDelivery.filter({
        issue_slug: issue.slug,
        delivery_mode: 'subscribers',
        status: 'sent',
      });
      if ((prior || []).length > 0) {
        return Response.json({ error: 'This Journal edition has already been sent to subscribers.' }, { status: 409 });
      }
    }

    delivery = await base44.asServiceRole.entities.JournalDelivery.create({
      issue_id: String(issue.id || ''),
      issue_slug: issue.slug,
      issue_number: Number(issue.issue_number),
      issue_title: issue.title,
      delivery_mode: action === 'test' ? 'test' : 'subscribers',
      status: 'preparing',
      test_recipient: action === 'test' ? testRecipient : '',
      started_at: new Date().toISOString(),
    });

    const email = buildEmail(issue);
    const campaign = await brevoRequest('/emailCampaigns', {
      method: 'POST',
      body: JSON.stringify({
        type: 'classic',
        name: `NTA Journal #${issue.issue_number} — ${issue.title}${action === 'test' ? ' — TEST' : ''}`,
        subject: email.subject,
        sender: { email: senderEmail, name: senderName },
        replyTo,
        recipients: { listIds: [listId] },
        htmlContent: email.htmlContent,
        previewText: email.previewText,
        mirrorActive: true,
        tag: 'nta-journal',
        utmCampaign: `NTA Journal ${issue.issue_number}`,
      }),
    });

    if (action === 'test') {
      await brevoRequest(`/emailCampaigns/${campaign.id}/sendTest`, {
        method: 'POST',
        body: JSON.stringify({ emailTo: [testRecipient] }),
      });
    } else {
      await brevoRequest(`/emailCampaigns/${campaign.id}/sendNow`, {
        method: 'POST',
        body: '{}',
      });
    }

    await base44.asServiceRole.entities.JournalDelivery.update(delivery.id, {
      status: 'sent',
      brevo_campaign_id: String(campaign.id),
      completed_at: new Date().toISOString(),
    });

    if (action === 'send' && issue.id && !String(issue.id).startsWith('seed-')) {
      await base44.asServiceRole.entities.JournalIssue.update(issue.id, {
        newsletter_sent: true,
        newsletter_subject: email.subject,
      });
    }

    return Response.json({
      success: true,
      status: action === 'test' ? 'test_sent' : 'subscriber_send_started',
      campaign_id: campaign.id,
      recipient: action === 'test' ? testRecipient : undefined,
    });
  } catch (error) {
    console.error('[sendJournalEdition] Delivery failed:', error.message);
    if (delivery?.id && base44) {
      try {
        await base44.asServiceRole.entities.JournalDelivery.update(delivery.id, {
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: plainText(error.message, 1000),
        });
      } catch {
        // Preserve the original delivery error.
      }
    }
    return Response.json({ error: 'The Journal email was not sent. Review the delivery log before retrying.' }, { status: 500 });
  }
});
