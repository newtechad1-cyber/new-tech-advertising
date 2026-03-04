/**
 * runAiStep — Orchestrator function
 * Acquires a lock, runs the agent, validates output, logs cost, releases lock.
 * POST { task_id }
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OpenAI from 'npm:openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

// Token cost estimates (cents per 1k tokens)
const MODEL_COSTS = {
  'gpt-4o':       { input: 0.5,  output: 1.5 },
  'gpt-4o-mini':  { input: 0.015, output: 0.06 },
  'gpt-4-turbo':  { input: 1.0,  output: 3.0 },
};

function estimateCostCents(model, inputTokens, outputTokens) {
  const rates = MODEL_COSTS[model] || MODEL_COSTS['gpt-4o-mini'];
  return Math.ceil((inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output);
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function generateLockId() {
  return `lock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function validateAgainstSchema(data, schema) {
  if (!schema || !schema.properties) return { valid: true };
  for (const [key, def] of Object.entries(schema.properties || {})) {
    if ((schema.required || []).includes(key) && data[key] === undefined) {
      return { valid: false, error: `Missing required field: ${key}` };
    }
    if (data[key] !== undefined && def.type) {
      const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
      if (actualType !== def.type && !(def.type === 'object' && actualType === 'object')) {
        return { valid: false, error: `Field ${key} expected ${def.type}, got ${actualType}` };
      }
    }
  }
  return { valid: true };
}

async function checkBudget(base44, accountId) {
  const month = currentMonth();
  const budgets = await base44.asServiceRole.entities.AiBudget.filter({ account_id: accountId, month });
  if (!budgets.length) return { ok: true, warning: false };
  const budget = budgets[0];
  if (budget.spent_cents >= budget.hard_limit_cents) {
    return { ok: false, warning: false, error: 'AI budget exceeded for this month. Hard limit reached.' };
  }
  if (budget.spent_cents >= budget.soft_limit_cents) {
    return { ok: true, warning: true, message: 'AI soft budget limit reached — running with caution.' };
  }
  return { ok: true, warning: false };
}

async function logCost(base44, { accountId, taskId, agentKey, model, inputTokens, outputTokens }) {
  const costCents = estimateCostCents(model, inputTokens, outputTokens);
  await base44.asServiceRole.entities.AiCostLedger.create({
    account_id: accountId,
    task_id: taskId,
    agent_key: agentKey,
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
  const [artifacts, task] = await Promise.all([
    base44.asServiceRole.entities.AiArtifact.filter({ account_id: accountId }, '-created_date', 10),
    base44.asServiceRole.entities.AiTask.filter({ id: taskId }, '-created_date', 1),
  ]);

  const latestIntake     = artifacts.find(a => a.artifact_type === 'intake');
  const latestProposal   = artifacts.find(a => a.artifact_type === 'proposal');
  const latestBrandVoice = artifacts.find(a => ['brand_voice', 'brand_profile'].includes(a.artifact_type));
  const prevOutput       = task[0]?.outputs?.repaired || task[0]?.outputs?.raw || null;

  const memories = await base44.asServiceRole.entities.AiMemory.filter({ account_id: accountId }, '-updated_date', 50);

  return {
    intake:      latestIntake?.content    || null,
    proposal:    latestProposal?.content  || null,
    brand_voice: latestBrandVoice?.content || null,
    prev_output: prevOutput,
    memory:      memories.reduce((acc, m) => { acc[`${m.scope}.${m.key}`] = m.value; return acc; }, {}),
  };
}

function buildSystemPromptWithContext(basePrompt, context) {
  let ctx = '\n\n--- ACCOUNT CONTEXT ---\n';
  if (context.brand_voice)  ctx += `Brand Voice: ${JSON.stringify(context.brand_voice)}\n`;
  if (context.intake)       ctx += `Intake Data: ${JSON.stringify(context.intake)}\n`;
  if (context.proposal)     ctx += `Latest Proposal: ${JSON.stringify(context.proposal)}\n`;
  if (context.prev_output)  ctx += `Previous Step Output: ${JSON.stringify(context.prev_output)}\n`;
  if (Object.keys(context.memory || {}).length) ctx += `Memory: ${JSON.stringify(context.memory)}\n`;
  ctx += '--- END CONTEXT ---';
  return basePrompt + ctx;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { task_id } = await req.json();
  if (!task_id) return Response.json({ error: 'task_id required' }, { status: 400 });

  // Load task
  const tasks = await base44.asServiceRole.entities.AiTask.filter({ id: task_id });
  if (!tasks.length) return Response.json({ error: 'Task not found' }, { status: 404 });
  const task = tasks[0];

  // Check lock
  if (task.locked_by && task.step_status === 'running') {
    return Response.json({ error: 'Task is already running. Wait for it to finish.' }, { status: 409 });
  }

  // Check budget
  const budgetCheck = await checkBudget(base44, task.account_id);
  if (!budgetCheck.ok) return Response.json({ error: budgetCheck.error }, { status: 402 });

  // Load agent
  const agents = await base44.asServiceRole.entities.AiAgent.filter({ key: task.agent_key });
  if (!agents.length) return Response.json({ error: `Agent '${task.agent_key}' not found` }, { status: 404 });
  const agent = agents[0];

  const lockId = generateLockId();
  const now = new Date().toISOString();

  // Acquire lock
  await base44.asServiceRole.entities.AiTask.update(task.id, {
    locked_by: lockId,
    locked_at: now,
    step_status: 'running',
    step_started_at: now,
  });

  let inputTokens = 0, outputTokens = 0, rawOutput = '', parsedOutput = null;

  const runPrompt = async (systemPrompt, userContent) => {
    const model = agent.default_model || 'gpt-4o-mini';
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent },
      ],
      response_format: agent.output_schema ? { type: 'json_object' } : undefined,
    });
    inputTokens  += response.usage?.prompt_tokens || 0;
    outputTokens += response.usage?.completion_tokens || 0;
    return { text: response.choices[0].message.content, model };
  };

  let model = agent.default_model || 'gpt-4o-mini';

  try {
    // Load cross-agent context
    const context = await loadContext(base44, task.account_id, task.id);
    const enrichedSystem = buildSystemPromptWithContext(agent.system_prompt || '', context);
    const userContent = JSON.stringify(task.inputs || {});

    // First attempt
    const result = await runPrompt(enrichedSystem, userContent);
    model = result.model;
    rawOutput = result.text;

    // Parse JSON if schema expected
    if (agent.output_schema) {
      try {
        parsedOutput = JSON.parse(rawOutput);
      } catch {
        parsedOutput = null;
      }

      // Validate
      let validation = parsedOutput ? validateAgainstSchema(parsedOutput, agent.output_schema) : { valid: false, error: 'Not valid JSON' };

      if (!validation.valid) {
        // Repair attempt
        const repairPrompt = `The previous output was invalid: ${validation.error}\nRaw output: ${rawOutput}\n\nPlease return corrected valid JSON matching this schema: ${JSON.stringify(agent.output_schema)}`;
        const repairResult = await runPrompt(enrichedSystem, repairPrompt);
        rawOutput = repairResult.text;
        try { parsedOutput = JSON.parse(rawOutput); } catch { parsedOutput = null; }
        validation = parsedOutput ? validateAgainstSchema(parsedOutput, agent.output_schema) : { valid: false, error: 'Repair failed: Not valid JSON' };

        if (!validation.valid) {
          // Hard fail — store raw for debugging
          const retryCount = (task.retry_count || 0) + 1;
          await base44.asServiceRole.entities.AiTask.update(task.id, {
            step_status: 'failed',
            status: 'failed',
            locked_by: null,
            step_finished_at: new Date().toISOString(),
            retry_count: retryCount,
            error: `Output validation failed after repair: ${validation.error}`,
            outputs: { raw: rawOutput, repaired: null, error: validation.error },
          });
          await logCost(base44, { accountId: task.account_id, taskId: task.id, agentKey: task.agent_key, model, inputTokens, outputTokens });
          return Response.json({ success: false, error: validation.error, raw: rawOutput }, { status: 422 });
        }
      }
    } else {
      parsedOutput = { text: rawOutput };
    }

    // Success — store artifact
    const artifact = await base44.asServiceRole.entities.AiArtifact.create({
      account_id: task.account_id,
      task_id: task.id,
      workflow_key: task.workflow_key || '',
      step_key: task.step_key || '',
      agent_key: task.agent_key,
      artifact_type: task.inputs?.artifact_type || 'other',
      label: agent.name + ' output',
      content: parsedOutput,
      raw_content: rawOutput,
    });

    // Update task — success
    await base44.asServiceRole.entities.AiTask.update(task.id, {
      step_status: 'succeeded',
      status: 'succeeded',
      locked_by: null,
      step_finished_at: new Date().toISOString(),
      last_artifact_id: artifact.id,
      outputs: { raw: rawOutput, repaired: parsedOutput },
    });

    await logCost(base44, { accountId: task.account_id, taskId: task.id, agentKey: task.agent_key, model, inputTokens, outputTokens });

    return Response.json({
      success: true,
      artifact_id: artifact.id,
      output: parsedOutput,
      budget_warning: budgetCheck.warning ? budgetCheck.message : null,
    });

  } catch (error) {
    await base44.asServiceRole.entities.AiTask.update(task.id, {
      step_status: 'failed',
      status: 'failed',
      locked_by: null,
      step_finished_at: new Date().toISOString(),
      retry_count: (task.retry_count || 0) + 1,
      error: error.message,
      outputs: { raw: rawOutput, repaired: null, error: error.message },
    });
    if (inputTokens > 0) {
      await logCost(base44, { accountId: task.account_id, taskId: task.id, agentKey: task.agent_key, model, inputTokens, outputTokens });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});