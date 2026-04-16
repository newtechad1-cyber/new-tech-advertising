import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function syslog(base44, event_type, message, extra = {}) {
  try {
    await base44.asServiceRole.entities.SystemLog.create({
      event_type, source_system: 'agency', source_component: 'createSalesContentWorkflow',
      entity_type: 'ContentWorkflow', workflow_type: 'content', status: 'success', message, ...extra,
    });
  } catch (_) {}
}

async function syslogErr(base44, event_type, message, error_details) {
  try {
    await base44.asServiceRole.entities.SystemLog.create({
      event_type, source_system: 'agency', source_component: 'createSalesContentWorkflow',
      workflow_type: 'content', status: 'failed', log_level: 'error', message, error_details,
    });
  } catch (_) {}
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { lead_workflow_id } = await req.json();
    if (!lead_workflow_id) return Response.json({ error: 'lead_workflow_id required' }, { status: 400 });

    // Fetch lead workflow
    const leads = await base44.asServiceRole.entities.LeadWorkflow.filter({ id: lead_workflow_id });
    const lead = Array.isArray(leads) ? leads[0] : leads;
    if (!lead) return Response.json({ error: 'Lead workflow not found' }, { status: 404 });

    // Avoid duplicates
    if (lead.content_workflow_id) {
      return Response.json({ already_exists: true, content_workflow_id: lead.content_workflow_id });
    }

    const companyName = lead.company_name || lead.title;

    // Fetch company for context
    let company = null;
    if (lead.company_id) {
      const cos = await base44.asServiceRole.entities.NTACompany.filter({ id: lead.company_id });
      company = Array.isArray(cos) ? cos[0] : cos;
    }

    // 1. Create ContentTopic
    const topic = await base44.asServiceRole.entities.ContentTopics.create({
      title: `Audit Video for ${companyName}`,
      company_id: lead.company_id || null,
      opportunity_id: lead.opportunity_id || null,
      lead_workflow_id: lead_workflow_id,
      purpose: 'sales_video',
      notes: lead.audit_summary ? `Audit: ${lead.audit_summary.slice(0, 300)}` : '',
      priority: 'high',
      status: 'idea',
    });

    await syslog(base44, 'sales_content_topic_created', `Sales content topic created for ${companyName}`, { entity_id: topic.id });

    // 2. Generate sales video script using audit
    let scriptLong = '';
    let scriptShort = '';
    let hook = '';
    let cta = '';
    let scriptGenerated = false;

    try {
      const co = company || {};
      const prompt = `You are a sales video scriptwriter for a local marketing agency. Write a personalized 60-second audit-style sales video script for a prospect.

Business: ${companyName}
Website: ${co.website || 'their website'}
Location: ${co.city || ''} ${co.state || ''}
Industry: ${co.industry || 'local business'}

Audit findings:
${lead.audit_summary || 'Standard local business website with common digital marketing gaps'}

Script purpose:
- Short personalized video the salesperson will record/generate in HeyGen
- Reference 2-3 specific issues found in the audit
- Explain why each issue costs them customers
- Present the agency as the solution
- End with a clear, low-pressure CTA (free strategy call or audit review)

Format as JSON with these fields:
- script_long: full 60-second script (conversational, direct address "I looked at your website...")
- script_short: 30-second version
- hook: opening 5-8 seconds only
- cta: closing 10 seconds only`;

      const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            script_long: { type: 'string' },
            script_short: { type: 'string' },
            hook: { type: 'string' },
            cta: { type: 'string' },
          }
        }
      });

      scriptLong  = res?.script_long  || '';
      scriptShort = res?.script_short || '';
      hook        = res?.hook         || '';
      cta         = res?.cta          || '';
      scriptGenerated = !!(scriptLong);

      await syslog(base44, 'sales_video_script_generated', `Sales video script generated for ${companyName}`);
    } catch (scriptErr) {
      await syslogErr(base44, 'sales_video_script_failed', `Script generation failed for ${companyName} — workflow created without script`, scriptErr.message);
    }

    // 3. Create ContentWorkflow
    const contentWf = await base44.asServiceRole.entities.ContentWorkflow.create({
      title: `Sales Outreach Video — ${companyName}`,
      client_id: 'prospect',
      client: companyName,
      lead_workflow_id: lead_workflow_id,
      opportunity_id: lead.opportunity_id || null,
      content_topic_id: topic.id,
      workflow_purpose: 'sales_outreach',
      current_stage: scriptGenerated ? 'script_ready' : 'topic_created',
      script_status: scriptGenerated ? 'generated' : 'not_started',
      script_long: scriptLong,
      script_short: scriptShort,
      script_text: scriptLong,
      hook,
      cta,
      heygen_script: scriptLong,
      heygen_status: 'not_sent',
      caption_status: 'not_created',
      publishing_status: 'not_started',
      priority: 'high',
      notes: `Auto-generated from lead workflow: ${lead_workflow_id}`,
    });

    await syslog(base44, 'sales_content_workflow_created', `Sales content workflow created for ${companyName}`, { entity_id: contentWf.id });

    // 4. Update LeadWorkflow
    await base44.asServiceRole.entities.LeadWorkflow.update(lead_workflow_id, {
      content_topic_id: topic.id,
      content_workflow_id: contentWf.id,
      sales_video_status: scriptGenerated ? 'script_ready' : 'topic_created',
    });

    await syslog(base44, 'lead_content_link_created', `Lead workflow linked to content workflow for ${companyName}`, {
      entity_id: lead_workflow_id,
      related_entity_type: 'ContentWorkflow',
      related_entity_id: contentWf.id,
    });

    return Response.json({
      ok: true,
      topic_id: topic.id,
      content_workflow_id: contentWf.id,
      script_generated: scriptGenerated,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});