/**
 * Automation: Lead → Created
 * Trigger:    EntityAutomation on Lead (create)
 * Action:     sales_agent.qualify_lead
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function isTrustedInternalUser(user) {
  const adminEmails = String('' || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(
    user &&
    (user.is_service === true ||
      user.role === 'admin' ||
      adminEmails.includes(String(user.email || '').toLowerCase()))
  );
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });
  const payload = await req.json();

  const leadId = payload?.event?.entity_id;
  const lead = payload?.data || (leadId
    ? (await base44.asServiceRole.entities.Lead.filter({ id: leadId }))[0]
    : null);

  if (!lead) {
    return Response.json({ error: 'Lead not found in payload' }, { status: 400 });
  }

  // ntaUnifiedIntake creates a compatibility Lead record for the existing
  // direct notification. Do not feed that record back into intake or AI.
  if (lead.unified_intake_processed) {
    return Response.json({ success: true, skipped: 'already_processed' });
  }

  // ── NTA Unified Intake (authoritative and credit-free) ─────────────────
  const intakeResult = await base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
    submission_type: lead.form_type || 'lead',
    source_system: lead.source || 'website',
    source_page: lead.source_page || lead.lead_source_page || lead.page_url || '',
    source_url: lead.source_url || lead.page_url || '',
    source_campaign: lead.source_campaign || '',
    detected_route: lead.source_page || lead.lead_source_page || lead.page_url || '',
    detected_component: 'onLeadCreated',
    name: lead.name,
    business_name: lead.business_name,
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    city: lead.city,
    state: lead.state,
    notes: lead.message || lead.notes || '',
    priority: 'medium',
    raw_payload: lead,
    skip_webhook: true,
  });
  // ─────────────────────────────────────────────────────────────────────

  // AI scoring is optional. Basic capture, CRM preservation, follow-up tasks,
  // and notification must never depend on AI or Victor credits.
  if (Deno.env.get('AI_LEAD_SCORING_ENABLED') !== 'true') {
    return Response.json({
      success: true,
      intake_submission_id: intakeResult?.data?.submission_id || intakeResult?.submission_id || null,
      ai_scoring: 'disabled',
    });
  }

  // Build an AiTask for sales_agent.qualify_lead
  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: 'sales_agent',
    step_key: 'qualify_lead',
    status: 'pending',
    step_status: 'pending',
    inputs: {
      lead_id: lead.id,
      business_name: lead.business_name,
      email: lead.email,
      phone: lead.phone,
      service_interest: lead.service_interest,
      message: lead.message,
      source: lead.source,
      industry: lead.industry,
      city: lead.city,
      state: lead.state,
    },
  });

  // Create the AgentJob record and chain to runAiStep
  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'lead_scoring',
    trigger: 'entity_event',
    company_id: lead.company_id || null,
    input_params: { lead_id: lead.id, task_id: task.id },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  // Mark lead as contacted
  await base44.asServiceRole.entities.Lead.update(lead.id, { status: 'contacted' });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: lead.company_id || null,
    event_type: 'lead_created',
    summary: `New lead "${lead.business_name}" routed to sales_agent.qualify_lead`,
    entity_type: 'Lead',
    entity_id: lead.id,
  });

  return Response.json({ success: true, task_id: task.id });
});
