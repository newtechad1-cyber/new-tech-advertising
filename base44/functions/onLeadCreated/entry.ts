/**
 * Automation: Lead → Created
 * Trigger:    EntityAutomation on Lead (create)
 * Action:     sales_agent.qualify_lead
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const leadId = payload?.event?.entity_id;
  const lead = payload?.data || (leadId
    ? (await base44.asServiceRole.entities.Lead.filter({ id: leadId }))[0]
    : null);

  if (!lead) {
    return Response.json({ error: 'Lead not found in payload' }, { status: 400 });
  }

  // ── NTA Unified Intake Mirror (non-blocking) ──────────────────────────
  base44.asServiceRole.functions.invoke('ntaUnifiedIntake', {
    submission_type: 'lead',
    source_system: lead.source || 'website',
    source_page: lead.page_url || '',
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
    skip_webhook: false,
  }).catch(err => console.warn('[onLeadCreated] NTA mirror failed (non-critical):', err.message));
  // ─────────────────────────────────────────────────────────────────────

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