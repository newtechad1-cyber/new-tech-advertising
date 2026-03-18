/**
 * runAiStep — Orchestrator (hardened)
 * - Atomic stale-lock check (TTL 10 min)
 * - Budget hard-block / soft-warning
 * - Cost logged per attempt (first + repair)
 * - Exactly one repair retry; store raw/repair/final/validationErrors
 * - Bounded context injection (max 3 artifacts, truncated fields)
 * - Returns { softLimitWarning: bool }
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

const LOCK_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FIELD_CHARS = 1200; // truncate large context fields
const MAX_CONTEXT_ARTIFACTS = 3;

const MODEL_COSTS = {
  'gpt-4o':      { input: 0.5,   output: 1.5  },
  'gpt-4o-mini': { input: 0.015, output: 0.06 },
  'gpt-4-turbo': { input: 1.0,   output: 3.0  },
};

function estimateCostCents(model, inputTokens, outputTokens) {
  const rates = MODEL_COSTS[model] || MODEL_COSTS['gpt-4o-mini'];
  return Math.ceil((inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output);
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function truncate(val, maxChars = MAX_FIELD_CHARS) {
  const s = typeof val === 'string' ? val : JSON.stringify(val);
  return s.length > maxChars ? s.slice(0, maxChars) + '…[truncated]' : s;
}

function validateAgainstSchema(data, schema) {
  const errors = [];
  if (!schema || !schema.properties) return { valid: true, errors };
  for (const [key, def] of Object.entries(schema.properties || {})) {
    if ((schema.required || []).includes(key) && data[key] === undefined) {
      errors.push(`Missing required field: ${key}`);
    } else if (data[key] !== undefined && def.type) {
      const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
      if (actualType !== def.type) {
        errors.push(`Field "${key}" expected ${def.type}, got ${actualType}`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

async function checkBudget(base44, accountId) {
  const month = currentMonth();
  const budgets = await base44.asServiceRole.entities.AiBudget.filter({ account_id: accountId, month });
  if (!budgets.length) return { ok: true, softLimitWarning: false };
  const b = budgets[0];
  if (b.spent_cents >= b.hard_limit_cents) {
    return { ok: false, softLimitWarning: false, error: `AI budget hard limit reached for ${month}. Spent: $${(b.spent_cents/100).toFixed(2)} / $${(b.hard_limit_cents/100).toFixed(2)}` };
  }
  if (b.spent_cents >= b.soft_limit_cents) {
    return { ok: true, softLimitWarning: true, message: `Soft limit reached: $${(b.spent_cents/100).toFixed(2)} of $${(b.soft_limit_cents/100).toFixed(2)}` };
  }
  return { ok: true, softLimitWarning: false };
}

async function logCostEntry(base44, { accountId, taskId, agentKey, model, inputTokens, outputTokens, attemptLabel }) {
  const costCents = estimateCostCents(model, inputTokens, outputTokens);
  await base44.asServiceRole.entities.AiCostLedger.create({
    account_id: accountId,
    task_id: taskId,
    agent_key: agentKey + (attemptLabel ? `:${attemptLabel}` : ''),
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cost_cents: costCents,
  });
  // Update budget spent
  const month = currentMonth();
  const budgets = await base44.asServiceRole.entities.AiBudget.filter({ account_id: accountId, month });
  if (budgets.length) {
    const b = budgets[0];
    await base44.asServiceRole.entities.AiBudget.update(b.id, { spent_cents: (b.spent_cents || 0) + costCents });
  }
  return costCents;
}

async function loadContext(base44, accountId, taskId) {
  const [artifacts, memories] = await Promise.all([
    base44.asServiceRole.entities.AiArtifact.filter({ account_id: accountId }, '-created_date', MAX_CONTEXT_ARTIFACTS + 5),
    base44.asServiceRole.entities.AiMemory.filter({ account_id: accountId }, '-updated_date', 30),
  ]);

  // Bounded: pick most relevant, max 3
  const latestIntake     = artifacts.find(a => a.artifact_type === 'intake');
  const latestProposal   = artifacts.find(a => a.artifact_type === 'proposal');
  const latestBrandVoice = artifacts.find(a => ['brand_voice','brand_profile'].includes(a.artifact_type));
  // Previous output from THIS task only
  const tasks = await base44.asServiceRole.entities.AiTask.filter({ id: taskId });
  const prevOutput = tasks[0]?.outputs?.finalOutput || tasks[0]?.outputs?.rawModelOutput || null;

  return {
    intake:      latestIntake     ? truncate(latestIntake.content)     : null,
    proposal:    latestProposal   ? truncate(latestProposal.content)   : null,
    brand_voice: latestBrandVoice ? truncate(latestBrandVoice.content) : null,
    prev_output: prevOutput       ? truncate(prevOutput)               : null,
    memory: memories.slice(0, 20).reduce((acc, m) => {
      acc[`${m.scope}.${m.key}`] = truncate(m.value, 300);
      return acc;
    }, {}),
  };
}

function buildContextPrompt(basePrompt, context) {
  const parts = ['\n\n--- ACCOUNT CONTEXT ---'];
  if (context.brand_voice)  parts.push(`Brand Voice: ${context.brand_voice}`);
  if (context.intake)       parts.push(`Intake Data: ${context.intake}`);
  if (context.proposal)     parts.push(`Latest Proposal: ${context.proposal}`);
  if (context.prev_output)  parts.push(`Previous Step Output: ${context.prev_output}`);
  const memKeys = Object.keys(context.memory || {});
  if (memKeys.length) parts.push(`Memory:\n${memKeys.map(k => `  ${k}: ${context.memory[k]}`).join('\n')}`);
  parts.push('--- END CONTEXT ---');
  return basePrompt + parts.join('\n');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });

  const { task_id } = await req.json();
  if (!task_id) return Response.json({ error: 'task_id required' }, { status: 400 });

  // Load task
  const tasks = await base44.asServiceRole.entities.AiTask.filter({ id: task_id });
  if (!tasks.length) return Response.json({ error: 'Task not found' }, { status: 404 });
  const task = tasks[0];

  // --- Atomic stale-lock check ---
  const isLocked = !!task.locked_by && task.step_status === 'running';
  if (isLocked) {
    const lockedAt = task.locked_at ? new Date(task.locked_at).getTime() : 0;
    const isStale = Date.now() - lockedAt > LOCK_TTL_MS;
    if (!isStale) {
      return Response.json({
        error: 'TaskLocked',
        message: 'Task is currently running. Wait or try again after 10 minutes.',
        locked_by: task.locked_by,
        locked_at: task.locked_at,
      }, { status: 409 });
    }
    // Stale lock — take over
  }

  // Check budget BEFORE locking
  const budgetCheck = await checkBudget(base44, task.account_id);
  if (!budgetCheck.ok) return Response.json({ error: budgetCheck.error }, { status: 402 });

  // Load agent
  const agents = await base44.asServiceRole.entities.AiAgent.filter({ key: task.agent_key });
  if (!agents.length) return Response.json({ error: `Agent '${task.agent_key}' not found` }, { status: 404 });
  const agent = agents[0];

  const lockId = `${user.email}|${Date.now()}`;
  const now = new Date().toISOString();
  const model = agent.default_model || 'gpt-4o-mini';

  // Acquire lock
  await base44.asServiceRole.entities.AiTask.update(task.id, {
    locked_by: lockId,
    locked_at: now,
    step_status: 'running',
    step_started_at: now,
  });

  // Audit storage
  const auditOutputs = {
    rawModelOutput: null,
    parsedJson: null,
    repairAttemptOutput: null,
    finalOutput: null,
    validationErrors: [],
  };

  const callOpenAI = async (systemPrompt, userContent) => {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent },
      ],
      response_format: agent.output_schema ? { type: 'json_object' } : undefined,
    });
    return {
      text: response.choices[0].message.content,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
    };
  };

  const releaseWithFailure = async (errorMsg) => {
    await base44.asServiceRole.entities.AiTask.update(task.id, {
      step_status: 'failed',
      status: 'failed',
      locked_by: null,
      step_finished_at: new Date().toISOString(),
      retry_count: (task.retry_count || 0) + 1,
      error: errorMsg,
      outputs: auditOutputs,
    });
  };

  try {
    const context = await loadContext(base44, task.account_id, task.id);
    const enrichedSystem = buildContextPrompt(agent.system_prompt || '', context);
    const userContent = JSON.stringify(task.inputs || {});

    // --- Attempt 1 ---
    const attempt1 = await callOpenAI(enrichedSystem, userContent);
    auditOutputs.rawModelOutput = attempt1.text;

    // Log cost for attempt 1 immediately
    await logCostEntry(base44, { accountId: task.account_id, taskId: task.id, agentKey: task.agent_key, model, inputTokens: attempt1.inputTokens, outputTokens: attempt1.outputTokens, attemptLabel: 'attempt1' });

    let finalParsed = null;

    if (agent.output_schema) {
      // Try parse
      try { auditOutputs.parsedJson = JSON.parse(attempt1.text); } catch { /* leave null */ }

      let validation = auditOutputs.parsedJson
        ? validateAgainstSchema(auditOutputs.parsedJson, agent.output_schema)
        : { valid: false, errors: ['Output is not valid JSON'] };

      auditOutputs.validationErrors = validation.errors;

      if (!validation.valid) {
        // --- Repair attempt (exactly once) ---
        const repairUserContent = `Your previous output was invalid.\nErrors: ${validation.errors.join('; ')}\nRaw output:\n${attempt1.text}\n\nReturn ONLY valid JSON matching this schema:\n${JSON.stringify(agent.output_schema)}`;
        const attempt2 = await callOpenAI(enrichedSystem, repairUserContent);
        auditOutputs.repairAttemptOutput = attempt2.text;

        // Log cost for repair attempt
        await logCostEntry(base44, { accountId: task.account_id, taskId: task.id, agentKey: task.agent_key, model, inputTokens: attempt2.inputTokens, outputTokens: attempt2.outputTokens, attemptLabel: 'repair' });

        try { finalParsed = JSON.parse(attempt2.text); } catch { finalParsed = null; }
        const validation2 = finalParsed
          ? validateAgainstSchema(finalParsed, agent.output_schema)
          : { valid: false, errors: ['Repair output is not valid JSON'] };

        auditOutputs.validationErrors = [...auditOutputs.validationErrors, ...(validation2.errors || [])];

        if (!validation2.valid) {
          auditOutputs.finalOutput = null;
          await releaseWithFailure(`Schema validation failed after repair: ${validation2.errors.join('; ')}`);
          return Response.json({
            success: false,
            error: `Validation failed after repair`,
            validation_errors: auditOutputs.validationErrors,
            raw: auditOutputs.rawModelOutput,
            repair: auditOutputs.repairAttemptOutput,
          }, { status: 422 });
        }
      } else {
        finalParsed = auditOutputs.parsedJson;
      }
    } else {
      finalParsed = { text: attempt1.text };
    }

    auditOutputs.finalOutput = finalParsed;

    // Determine artifact type — honor explicit override; fallback to content_pack for content agents
    const resolvedArtifactType = task.inputs?.artifact_type ||
      (task.agent_key?.toLowerCase().includes('content') ? 'content_pack' : 'other');

    // Store artifact
    const artifact = await base44.asServiceRole.entities.AiArtifact.create({
      account_id: task.account_id,
      task_id: task.id,
      workflow_key: task.workflow_key || '',
      step_key: task.step_key || '',
      agent_key: task.agent_key,
      artifact_type: resolvedArtifactType,
      label: agent.name + ' output',
      content: finalParsed,
      raw_content: attempt1.text,
    });

    // Success
    const successUpdate = {
      step_status: 'succeeded',
      status: 'succeeded',
      locked_by: null,
      step_finished_at: new Date().toISOString(),
      last_artifact_id: artifact.id,
      outputs: auditOutputs,
    };
    if (budgetCheck.softLimitWarning) {
      successUpdate.last_soft_limit_warning = true;
      successUpdate.last_soft_limit_message = budgetCheck.message;
      successUpdate.last_soft_limit_at = new Date().toISOString();
    }
    await base44.asServiceRole.entities.AiTask.update(task.id, successUpdate);

    return Response.json({
      success: true,
      artifact_id: artifact.id,
      output: finalParsed,
      softLimitWarning: budgetCheck.softLimitWarning || false,
      softLimitMessage: budgetCheck.message || null,
    });

  } catch (error) {
    await releaseWithFailure(error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});