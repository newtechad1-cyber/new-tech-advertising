import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const MAX_WEBSITE_TEXT = 5000;
const AUDIT_NOTE_PREFIX = '[AUTO GAP AUDIT]';

function normalizeWebsite(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function isPlausibleEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function asText(value) {
  return String(value || '').trim();
}

function asList(value) {
  if (Array.isArray(value)) {
    return value.map(item => asText(item)).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(/\n+/).map(item => item.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
  }
  return [];
}

function scoreValue(...values) {
  const candidate = values.find(value => value !== null && value !== undefined && value !== '');
  const number = Number(candidate);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function firstName(contactName) {
  return asText(contactName).split(/\s+/)[0] || 'there';
}

function appendNote(existing, note) {
  return [asText(existing), `${AUDIT_NOTE_PREFIX} ${note}`].filter(Boolean).join('\n');
}

function extractWebsiteText(rawHtml) {
  return rawHtml
    .slice(0, 120000)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_WEBSITE_TEXT);
}

async function inspectWebsite(websiteUrl) {
  try {
    const response = await fetch(websiteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NTA-AuditBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { content: '', accessible: false, signals: [`The website returned HTTP ${response.status}.`] };
    }

    const rawHtml = await response.text();
    const content = extractWebsiteText(rawHtml);
    const signals = [];

    const imagesMissingAlt = (rawHtml.match(/<img(?![^>]*\balt\s*=)[^>]*>/gi) || []).length;
    if (imagesMissingAlt > 0) signals.push(`${imagesMissingAlt} image(s) appear to be missing alt text.`);
    if (!/<h1[\s>]/i.test(rawHtml)) signals.push('No H1 heading tag was detected.');
    if (!/<h2[\s>]/i.test(rawHtml)) signals.push('No H2 heading tags were detected.');
    if (/<input/i.test(rawHtml) && !/<label[\s>]/i.test(rawHtml)) signals.push('Form inputs may be missing visible labels.');

    return { content, accessible: Boolean(content), signals };
  } catch (error) {
    return {
      content: '',
      accessible: false,
      signals: [`The website could not be fetched during this first pass: ${error.message || 'unknown fetch error'}.`],
    };
  }
}

function buildClientEmail({ businessName, contactName, report }) {
  const recipient = firstName(contactName);
  const issues = [
    [report.gap_1, report.gap_1_why],
    [report.gap_2, report.gap_2_why],
    [report.gap_3, report.gap_3_why],
  ].filter(([title]) => title);

  const lines = [
    `Hi ${recipient},`,
    '',
    `Thanks for requesting a free Business Gap Audit for ${businessName}.`,
    '',
    'I completed an AI-assisted first-pass review of your public website. Here is the short version of what stood out:',
    '',
    'SUMMARY',
    asText(report.quick_summary || report.summary),
    '',
    'TOP GAPS TO ADDRESS',
    ...issues.flatMap(([title, why], index) => [
      `${index + 1}. ${title}`,
      why ? `   ${why}` : '',
    ]).filter(Boolean),
    '',
    'WHAT TO PRIORITIZE NEXT',
    ...asList(report.recommended_fixes || report.recommendations).slice(0, 5).map((item, index) => `${index + 1}. ${item}`),
    '',
    'QUICK WINS',
    ...asList(report.quick_wins).slice(0, 4).map(item => `• ${item}`),
    '',
    asText(report.costing_them),
    '',
    'This is an AI-assisted first-pass review based on publicly available website information. It is intended to help you see where to look first; it is not a full technical investigation or a promise of specific results.',
    '',
    'If you would like to talk through the findings, reply to this email or schedule a free 20-minute call:',
    'https://calendar.app.google/p6ieYanvwhixXxZ67',
    '',
    'Rick Hesse',
    'New Tech Advertising',
    '641-420-8816',
  ];

  return lines.filter((line, index, all) => line || (all[index - 1] && all[index + 1])).join('\n');
}

async function createRetryTask(base44, { lead, submissionId, errorMessage }) {
  if (!lead?.id) return;

  try {
    await base44.asServiceRole.entities.NTATask.create({
      title: `Retry AI Gap Audit delivery: ${lead.business_name || lead.email || 'lead'}`,
      description: `The automatic first-pass audit could not be generated or delivered. Error: ${errorMessage}`,
      task_type: 'system',
      status: 'todo',
      priority: 'urgent',
      due_date: new Date().toISOString().split('T')[0],
      submission_id: submissionId || null,
      source_system: 'website',
    });
  } catch (taskError) {
    console.warn('[autoGenerateGapAudit] Retry task creation failed:', taskError.message);
  }
}

Deno.serve(async (req) => {
  let base44;
  let auditId = null;
  let audit = null;
  let lead = null;
  let submissionId = null;

  try {
    base44 = createClientFromRequest(req);
    const payload = await req.json();
    auditId = payload?.audit_id || null;
    submissionId = payload?.submission_id || null;

    if (!auditId) {
      return Response.json({ success: false, error: 'audit_id required', status: 'invalid' });
    }

    const audits = await base44.asServiceRole.entities.GapAudit.filter({ id: auditId });
    audit = audits[0] || null;
    if (!audit) {
      return Response.json({ success: false, error: 'Gap audit not found', status: 'not_found' });
    }

    if (audit.status === 'delivered') {
      return Response.json({ success: true, skipped: true, audit_id: auditId, status: 'delivered' });
    }

    const leadId = payload?.lead_id || audit.lead_id || null;
    if (leadId) {
      const leads = await base44.asServiceRole.entities.SalesLead.filter({ id: leadId });
      lead = leads[0] || null;
    }

    const businessName = asText(lead?.business_name || audit.business_name || 'your business');
    const contactName = asText(lead?.contact_name || audit.contact_name || '');
    const recipientEmail = asText(lead?.email || '');
    const websiteUrl = normalizeWebsite(audit.website_url || lead?.website);

    if (!isPlausibleEmail(recipientEmail)) {
      const message = 'No valid client email was available for automatic delivery.';
      await base44.asServiceRole.entities.GapAudit.update(auditId, {
        internal_notes: appendNote(audit.internal_notes, message),
      });
      await createRetryTask(base44, { lead, submissionId, errorMessage: message });
      return Response.json({ success: false, audit_id: auditId, status: 'waiting_for_email' });
    }

    if (!websiteUrl) {
      const message = 'A website URL is required before the AI first-pass audit can run.';
      await base44.asServiceRole.entities.GapAudit.update(auditId, {
        internal_notes: appendNote(audit.internal_notes, message),
      });
      await createRetryTask(base44, { lead, submissionId, errorMessage: message });
      return Response.json({ success: false, audit_id: auditId, status: 'waiting_for_website' });
    }

    if (lead?.id) {
      await base44.asServiceRole.entities.SalesLead.update(lead.id, {
        audit_status: 'in_progress',
      });
    }

    await base44.asServiceRole.entities.GapAudit.update(auditId, {
      lead_id: lead?.id || audit.lead_id || '',
      business_name: businessName,
      contact_name: contactName,
      industry: asText(lead?.industry || audit.industry),
      city: asText(lead?.city || audit.city),
      website_url: websiteUrl,
      scan_source: 'public_form',
      status: 'draft',
      internal_notes: appendNote(audit.internal_notes, `generation started ${new Date().toISOString()}`),
    });

    const website = await inspectWebsite(websiteUrl);
    const context = [
      `Business: ${businessName}`,
      `Industry: ${asText(lead?.industry || audit.industry || 'local business')}`,
      `Market: ${asText(lead?.city || audit.city || 'the local market')}`,
      `Website: ${websiteUrl}`,
      website.content
        ? `Website text extracted:\n${website.content}`
        : 'The website could not be read during this first pass. Use only cautious, clearly qualified observations based on the business and URL.',
      website.signals.length ? `Technical signals:\n${website.signals.join('\n')}` : '',
    ].filter(Boolean).join('\n\n');

    const prompt = `You are an expert local-business marketing analyst for New Tech Advertising in North Iowa.

Create an honest, useful, client-ready first-pass Business Gap Audit from the information below.

${context}

Return valid JSON matching this structure:
{
  "quick_summary": "2-3 plain-language sentences about the current lead-generation situation",
  "doing_well": ["2-4 positive observations that are supported by the evidence"],
  "gap_1": "short title of the most important gap",
  "gap_1_why": "why this gap matters in plain language",
  "gap_2": "short title of the second gap",
  "gap_2_why": "why this gap matters",
  "gap_3": "short title of the third gap",
  "gap_3_why": "why this gap matters",
  "costing_them": "2-3 sentences explaining the practical opportunity without inventing traffic, lead, revenue, or ranking numbers",
  "issues_found": ["3-5 specific issues supported by the evidence"],
  "missed_opportunities": ["3-5 practical opportunities the business may be missing"],
  "recommended_fixes": ["3-5 prioritized fixes"],
  "quick_wins": ["2-4 practical quick wins"],
  "internal_notes": "brief private notes for Rick about what to discuss next",
  "score": {
    "overall": 62,
    "local_visibility": 60,
    "conversion": 55,
    "mobile_experience": 65,
    "content": 58,
    "speed": 60,
    "trust": 62
  }
}

Rules:
- Write for a busy local business owner, not an SEO specialist.
- Be specific and encouraging, never insulting or fear-based.
- Never claim an element was observed when the evidence does not support it.
- If the website could not be read, say what could not be confirmed and keep recommendations appropriately general.
- Do not invent traffic, rankings, revenue losses, customer counts, or guaranteed results.
- Treat scores as directional first-pass indicators, not test results. Use realistic values between 40 and 85 when evidence supports a score.
- Do not use language such as "ADA violation", "non-compliant", or "you could get sued".
- Keep internal notes useful for Rick but do not include them in the client email.`;

    const rawResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          quick_summary: { type: 'string' },
          doing_well: { type: 'array', items: { type: 'string' } },
          gap_1: { type: 'string' },
          gap_1_why: { type: 'string' },
          gap_2: { type: 'string' },
          gap_2_why: { type: 'string' },
          gap_3: { type: 'string' },
          gap_3_why: { type: 'string' },
          costing_them: { type: 'string' },
          issues_found: { type: 'array', items: { type: 'string' } },
          missed_opportunities: { type: 'array', items: { type: 'string' } },
          recommended_fixes: { type: 'array', items: { type: 'string' } },
          quick_wins: { type: 'array', items: { type: 'string' } },
          internal_notes: { type: 'string' },
          score: { type: 'object' },
        },
      },
      model: 'gpt_5_4',
      add_context_from_internet: false,
    });

    const report = rawResult?.data || rawResult || {};
    const recommendedFixes = asList(report.recommended_fixes || report.recommendations);
    const quickWins = asList(report.quick_wins);
    const issues = asList(report.issues_found);
    const fallbackIssues = [
      report.gap_1 && `${asText(report.gap_1)}${report.gap_1_why ? ` — ${asText(report.gap_1_why)}` : ''}`,
      report.gap_2 && `${asText(report.gap_2)}${report.gap_2_why ? ` — ${asText(report.gap_2_why)}` : ''}`,
      report.gap_3 && `${asText(report.gap_3)}${report.gap_3_why ? ` — ${asText(report.gap_3_why)}` : ''}`,
    ].filter(Boolean);

    const missedOpportunities = asList(report.missed_opportunities);
    const score = report.score || {};
    const quickSummary = asText(report.quick_summary || report.summary);
    const internalNotes = appendNote(
      audit.internal_notes,
      `generation completed ${new Date().toISOString()} | website_accessible=${website.accessible}${report.internal_notes ? ` | ${asText(report.internal_notes)}` : ''}`,
    );

    const completedAudit = {
      lead_id: lead?.id || audit.lead_id || '',
      business_name: businessName,
      contact_name: contactName,
      industry: asText(lead?.industry || audit.industry),
      city: asText(lead?.city || audit.city),
      website_url: websiteUrl,
      quick_summary: quickSummary,
      summary: quickSummary,
      gap_1: asText(report.gap_1),
      gap_1_why: asText(report.gap_1_why),
      gap_2: asText(report.gap_2),
      gap_2_why: asText(report.gap_2_why),
      gap_3: asText(report.gap_3),
      gap_3_why: asText(report.gap_3_why),
      costing_them: asText(report.costing_them),
      issues_found: issues.length ? issues : fallbackIssues,
      missed_opportunities: missedOpportunities,
      recommendations: recommendedFixes,
      quick_wins: quickWins,
      overall_score: scoreValue(score.overall),
      seo_score: scoreValue(score.local_visibility),
      conversion_score: scoreValue(score.conversion),
      mobile_score: scoreValue(score.mobile_experience, score.mobile),
      content_score: scoreValue(score.content),
      speed_score: scoreValue(score.speed),
      trust_score: scoreValue(score.trust),
      status: 'completed',
      internal_notes: internalNotes,
    };

    await base44.asServiceRole.entities.GapAudit.update(auditId, completedAudit);

    if (lead?.id) {
      await base44.asServiceRole.entities.SalesLead.update(lead.id, {
        status: ['closed_won', 'closed_lost'].includes(lead.status) ? lead.status : 'audit_sent',
        audit_status: 'sent',
        audit_gap1: completedAudit.gap_1,
        audit_gap2: completedAudit.gap_2,
        audit_gap3: completedAudit.gap_3,
        audit_cost_to_them: completedAudit.costing_them,
        audit_recommended_fix: recommendedFixes.join('\n'),
        audit_sent_date: new Date().toISOString().split('T')[0],
        audit_url: `/agency/gap-audits/${auditId}`,
        audit_notes: quickSummary,
      });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Rick Hesse — New Tech Advertising',
      to: recipientEmail,
      subject: `Your Free Business Gap Audit for ${businessName}`,
      body: buildClientEmail({
        businessName,
        contactName,
        report: {
          ...report,
          quick_summary: completedAudit.quick_summary,
          recommendations: recommendedFixes,
          issues_found: completedAudit.issues_found,
        },
      }),
    });

    const deliveredNote = appendNote(internalNotes, `client email sent to ${recipientEmail} ${new Date().toISOString()}`);
    await base44.asServiceRole.entities.GapAudit.update(auditId, {
      status: 'delivered',
      internal_notes: deliveredNote,
    });

    try {
      await base44.asServiceRole.entities.NTAActivity.create({
        activity_type: 'email_sent',
        title: `AI Gap Audit delivered: ${businessName}`,
        details: `First-pass audit generated and emailed to ${recipientEmail}.`,
        submission_id: submissionId || null,
        source_system: 'website',
      });
    } catch (activityError) {
      console.warn('[autoGenerateGapAudit] Activity log failed:', activityError.message);
    }

    return Response.json({
      success: true,
      audit_id: auditId,
      status: 'delivered',
      website_accessible: website.accessible,
    });
  } catch (error) {
    const errorMessage = error?.message || String(error);
    console.error('[autoGenerateGapAudit] Error:', errorMessage);

    if (base44 && auditId) {
      try {
        const currentAudits = await base44.asServiceRole.entities.GapAudit.filter({ id: auditId });
        const currentAudit = currentAudits[0];
        if (currentAudit && currentAudit.status !== 'delivered') {
          await base44.asServiceRole.entities.GapAudit.update(auditId, {
            status: currentAudit.status === 'completed' ? 'completed' : 'draft',
            internal_notes: appendNote(currentAudit.internal_notes, `automatic generation/delivery failed: ${errorMessage}`),
          });
        }
        await createRetryTask(base44, { lead, submissionId, errorMessage });
      } catch (cleanupError) {
        console.warn('[autoGenerateGapAudit] Failure cleanup failed:', cleanupError.message);
      }
    }

    return Response.json({
      success: false,
      audit_id: auditId,
      status: 'failed',
      error: errorMessage,
    });
  }
});
