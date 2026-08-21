/**
 * Automation: Lead → Qualified (status updated to "qualified")
 * Trigger:    EntityAutomation on Lead (update)
 * Action:     Route lead → trial signup, strategy call, or project intake
 *             based on service_interest.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function isTrustedInternalUser(user) {
  const adminEmails = String(Deno.env.get('ADMIN_EMAILS') || '')
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

const ROUTING_RULES = {
  diy_saas:        'trial',
  dfy_managed:     'strategy_call',
  ada_rebuild:     'project_intake',
  streaming_tv:    'project_intake',
  video_production:'project_intake',
  not_sure:        'strategy_call',
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isTrustedInternalUser(user)) return Response.json({ error: 'Admin access required' }, { status: 403 });

  const payload = await req.json();

  const leadId   = payload?.event?.entity_id;
  const lead     = payload?.data;
  const oldLead  = payload?.old_data;

  // Only fire when status transitions TO "qualified"
  if (!lead || lead.status !== 'qualified') {
    return Response.json({ skipped: true, reason: 'Not a qualification transition' });
  }
  if (oldLead?.status === 'qualified') {
    return Response.json({ skipped: true, reason: 'Already was qualified' });
  }

  const route = ROUTING_RULES[lead.service_interest] || 'strategy_call';

  // Create an Opportunity to represent the routed deal
  const opportunity = await base44.asServiceRole.entities.Opportunity.create({
    company_id: lead.company_id || null,
    lead_id: lead.id,
    name: `${lead.business_name} — ${lead.service_interest || 'inquiry'}`,
    service_type: lead.service_interest || 'other',
    stage: 'qualification',
    close_probability: 30,
    assigned_to: lead.assigned_to || null,
    notes: `Auto-created from qualified lead. Route: ${route}`,
  });

  // Create an AgentJob to handle routing action
  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: 'other',
    trigger: 'entity_event',
    company_id: lead.company_id || null,
    input_params: {
      lead_id: lead.id,
      opportunity_id: opportunity.id,
      route,
      service_interest: lead.service_interest,
      business_name: lead.business_name,
      email: lead.email,
    },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: lead.company_id || null,
    event_type: 'lead_updated',
    summary: `Lead "${lead.business_name}" qualified → routed to: ${route}`,
    entity_type: 'Lead',
    entity_id: lead.id,
    metadata: JSON.stringify({ route, opportunity_id: opportunity.id }),
  });

  return Response.json({ success: true, route, opportunity_id: opportunity.id });
});