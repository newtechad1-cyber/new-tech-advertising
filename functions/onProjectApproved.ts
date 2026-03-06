/**
 * Automation: NtaProject → status set to "in_progress" (approved to begin)
 * Trigger:    EntityAutomation on NtaProject (update)
 * Action:     Route to project-specific agent workflow based on project_type
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PROJECT_AGENT_MAP = {
  ada_rebuild:      { agent_key: 'ada_agent',       step_key: 'start_ada_audit',       job_type: 'onboarding_setup' },
  website_rebuild:  { agent_key: 'rebuild_agent',   step_key: 'start_website_rebuild', job_type: 'onboarding_setup' },
  streaming_tv:     { agent_key: 'streaming_agent', step_key: 'setup_tv_campaign',     job_type: 'content_generation' },
  video_production: { agent_key: 'video_agent',     step_key: 'plan_video_shoot',      job_type: 'video_generation' },
  other:            { agent_key: 'project_agent',   step_key: 'start_project',         job_type: 'other' },
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const payload = await req.json();

  const project    = payload?.data;
  const oldProject = payload?.old_data;

  if (!project || project.status !== 'in_progress') {
    return Response.json({ skipped: true, reason: 'Not an in_progress transition' });
  }
  if (oldProject?.status === 'in_progress') {
    return Response.json({ skipped: true, reason: 'Already in progress' });
  }

  const companyId = project.company_id;
  const agentConfig = PROJECT_AGENT_MAP[project.project_type] || PROJECT_AGENT_MAP.other;

  // Fetch proposal if linked
  const proposals = project.proposal_id
    ? await base44.asServiceRole.entities.NtaProposal.filter({ id: project.proposal_id })
    : [];
  const proposal = proposals[0] || {};

  // Fetch company for context
  const companies = companyId
    ? await base44.asServiceRole.entities.Company.filter({ id: companyId })
    : [];
  const company = companies[0] || {};

  const task = await base44.asServiceRole.entities.AiTask.create({
    agent_key: agentConfig.agent_key,
    step_key: agentConfig.step_key,
    status: 'pending',
    step_status: 'pending',
    inputs: {
      project_id: project.id,
      company_id: companyId,
      project_name: project.name,
      project_type: project.project_type,
      business_name: company.business_name,
      due_date: project.due_date,
      scope_summary: proposal.scope_summary,
      milestones: project.milestones,
      assigned_to: project.assigned_to,
      artifact_type: 'other',
    },
  });

  await base44.asServiceRole.functions.invoke('agentJobHelper', {
    job_type: agentConfig.job_type,
    trigger: 'entity_event',
    company_id: companyId,
    input_params: { task_id: task.id, project_id: project.id, project_type: project.project_type },
    function_to_invoke: 'runAiStep',
    function_payload: { task_id: task.id },
  });

  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: companyId || null,
    event_type: 'project_milestone',
    summary: `Project "${project.name}" approved → ${agentConfig.agent_key}.${agentConfig.step_key} triggered`,
    entity_type: 'NtaProject',
    entity_id: project.id,
    metadata: JSON.stringify({ agent_key: agentConfig.agent_key, step_key: agentConfig.step_key }),
  });

  return Response.json({ success: true, task_id: task.id, agent: agentConfig.agent_key, step: agentConfig.step_key });
});