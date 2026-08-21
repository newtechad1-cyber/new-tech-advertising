/**
 * agentJobHelper — Shared utility: create an AgentJob record and invoke the
 * appropriate downstream function.  Called by all automation handlers.
 *
 * Exported as a standalone Deno HTTP handler so other functions can invoke it
 * via base44.functions.invoke('agentJobHelper', payload).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function isAdminUser(user) {
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

const ALLOWED_CHAIN_TARGETS = new Set(['runAiStep', 'processScheduledPosts']);

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(() => null);

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdminUser(user)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const job_type = String(body?.job_type || '').trim();
  const trigger = String(body?.trigger || 'entity_event').trim();
  const company_id = body?.company_id ? String(body.company_id).trim() : null;
  const input_params = body?.input_params;
  const function_to_invoke = body?.function_to_invoke ? String(body.function_to_invoke).trim() : '';
  const function_payload = body?.function_payload;

  if (!/^[A-Za-z0-9_-]{1,128}$/.test(job_type)) {
    return Response.json({ error: 'Invalid job_type' }, { status: 400 });
  }
  if (company_id && !/^[A-Za-z0-9_-]{1,128}$/.test(company_id)) {
    return Response.json({ error: 'Invalid company_id' }, { status: 400 });
  }
  if (function_to_invoke && !ALLOWED_CHAIN_TARGETS.has(function_to_invoke)) {
    return Response.json({ error: 'Unsupported chained function' }, { status: 400 });
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