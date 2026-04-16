import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { entity_name, entity_id, event_type } = body?.event || {};
    const data = body?.data;

    if (!entity_id || !data) return Response.json({ skipped: true });

    // Determine if this is a Submission or Opportunity
    let workflowPayload = {
      current_stage: 'new_lead',
      audit_status: 'not_started',
      outreach_status: 'not_started',
      followup_status: 'not_started',
      close_status: 'open',
      priority: 'medium',
    };

    if (entity_name === 'Submission') {
      const sub = data;
      workflowPayload.title = sub.business_name || sub.name || `Lead from ${sub.source_system || 'website'}`;
      workflowPayload.company_name = sub.business_name || sub.name;
      workflowPayload.submission_id = entity_id;
      workflowPayload.lead_source = sub.source_page || sub.source_system || 'website';

      // Try to find matched company
      if (sub.matched_company_id) {
        workflowPayload.company_id = sub.matched_company_id;
      } else if (sub.business_name) {
        const cos = await base44.asServiceRole.entities.NTACompany.filter({ company_name: sub.business_name });
        if (cos?.length > 0) workflowPayload.company_id = cos[0].id;
      }

    } else if (entity_name === 'NTAOpportunity') {
      const opp = data;
      workflowPayload.title = opp.opportunity_name || 'New Opportunity';
      workflowPayload.opportunity_id = entity_id;
      workflowPayload.company_id = opp.company_id;
      workflowPayload.lead_source = opp.source || 'crm';

      // Get company name
      if (opp.company_id) {
        const cos = await base44.asServiceRole.entities.NTACompany.filter({ id: opp.company_id });
        if (cos?.length > 0) workflowPayload.company_name = cos[0].company_name;
      }
    } else {
      return Response.json({ skipped: true, reason: 'unsupported entity' });
    }

    // Avoid duplicate workflows for same submission/opportunity
    const existing = workflowPayload.submission_id
      ? await base44.asServiceRole.entities.LeadWorkflow.filter({ submission_id: workflowPayload.submission_id })
      : workflowPayload.opportunity_id
        ? await base44.asServiceRole.entities.LeadWorkflow.filter({ opportunity_id: workflowPayload.opportunity_id })
        : [];

    if (existing?.length > 0) {
      return Response.json({ skipped: true, reason: 'workflow already exists', existing_id: existing[0].id });
    }

    const created = await base44.asServiceRole.entities.LeadWorkflow.create(workflowPayload);

    await base44.asServiceRole.entities.SystemLog.create({
      event_type: 'lead_workflow_created',
      source_system: 'agency',
      source_component: 'onLeadWorkflowCreate',
      entity_type: 'LeadWorkflow',
      entity_id: created.id,
      related_entity_type: entity_name,
      related_entity_id: entity_id,
      workflow_type: 'crm',
      workflow_stage: 'new_lead',
      status: 'success',
      message: `Lead workflow created: ${workflowPayload.title}`,
    });

    return Response.json({ created, status: 'ok' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});