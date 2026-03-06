/**
 * agentJobHelper — Shared utility: create an AgentJob record and invoke the
 * appropriate downstream function.  Called by all automation handlers.
 *
 * Exported as a standalone Deno HTTP handler so other functions can invoke it
 * via base44.functions.invoke('agentJobHelper', payload).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const {
    job_type,
    trigger = 'entity_event',
    company_id,
    input_params,        // object — will be JSON.stringify'd
    function_to_invoke,  // optional: if set, invoke another function after logging
    function_payload,    // optional: payload to pass to that function
  } = await req.json();

  if (!job_type) {
    return Response.json({ error: 'job_type required' }, { status: 400 });
  }

  // 1. Create the AgentJob record
  const job = await base44.asServiceRole.entities.AgentJob.create({
    company_id: company_id || null,
    job_type,
    trigger,
    status: 'queued',
    input_params: typeof input_params === 'string' ? input_params : JSON.stringify(input_params || {}),
    started_at: new Date().toISOString(),
  });

  // 2. Log to ActivityLog
  await base44.asServiceRole.entities.ActivityLog.create({
    company_id: company_id || null,
    event_type: 'agent_job_completed',
    summary: `AgentJob queued: ${job_type} (trigger: ${trigger})`,
    entity_type: 'AgentJob',
    entity_id: job.id,
  });

  // 3. Optionally chain to another function
  if (function_to_invoke) {
    base44.asServiceRole.functions.invoke(function_to_invoke, {
      ...(function_payload || {}),
      agent_job_id: job.id,
    }).catch((err) => {
      console.error(`[agentJobHelper] Chained invoke of ${function_to_invoke} failed:`, err.message);
    });
  }

  return Response.json({ success: true, agent_job_id: job.id });
});