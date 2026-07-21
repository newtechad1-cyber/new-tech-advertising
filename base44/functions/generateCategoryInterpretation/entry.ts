import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const expectedToken = Deno.env.get('AGENT_WEBHOOK_KEY');
  const authHeader = req.headers.get('Authorization');
  
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return Response.json({ error: 'AUTHORIZATION_FAILED' }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);
  
  let payload;
  try {
    payload = await req.json();
  } catch (e) {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
  }

  // Handle both automation payload format and direct rebuilding
  let entryId = payload.entry_id;
  if (!entryId && payload.event && payload.event.entity_name === 'DiscoveryConversationEntry') {
    if (payload.event.type !== 'create') {
      return Response.json({ status: 'ignored', reason: 'NOT_CREATE_EVENT' }, { status: 200 });
    }
    entryId = payload.event.entity_id;
  }

  if (!entryId) {
    return Response.json({ error: 'ENTRY_NOT_FOUND' }, { status: 400 });
  }

  const targetVersion = payload.interpretation_version || 1;
  let jobId = null;

  try {
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(entryId);
    if (!entry) {
      return Response.json({ error: 'ENTRY_NOT_FOUND' }, { status: 404 });
    }

    if (entry.speaker !== 'owner') {
      return Response.json({ status: 'skipped', reason: 'NON_OWNER_ENTRY' }, { status: 200 });
    }

    const session = await base44.asServiceRole.entities.DiscoverySession.get(entry.session_id);
    if (!session) {
      return Response.json({ error: 'SESSION_NOT_FOUND' }, { status: 404 });
    }

    const ineligibleStates = ['deleted', 'deletion_requested', 'expired', 'completed', 'handoff_requested'];
    if (ineligibleStates.includes(session.status)) {
      return Response.json({ error: 'SESSION_INELIGIBLE' }, { status: 400 });
    }

    // Job idempotency check (query-before-create concurrency race acknowledged)
    const existingJobs = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
      session_id: session.id,
      entry_id: entryId,
      interpretation_version: targetVersion
    });

    if (existingJobs.length > 0) {
      const job = existingJobs[0];
      if (job.status === 'completed' || job.status === 'processing') {
        return Response.json({ status: 'skipped', reason: 'JOB_ALREADY_PROCESSED' }, { status: 200 });
      }
      await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
        status: 'processing',
        retry_count: (job.retry_count || 0) + 1,
        started_at: new Date().toISOString()
      });
      jobId = job.id;
    } else {
      const newJob = await base44.asServiceRole.entities.CategoryInterpretationJob.create({
        session_id: session.id,
        entry_id: entryId,
        interpretation_version: targetVersion,
        status: 'processing',
        started_at: new Date().toISOString()
      });
      jobId = newJob.id;
    }

    // Gather context (owner entries only)
    const recentEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
      { session_id: session.id, speaker: 'owner' },
      '-occurred_at',
      10
    );

    const allowlist = new Set(recentEntries.map((e: any) => String(e.id)));
    allowlist.add(String(entry.id));

    const prompt = `
Extract facts from this specific new entry based on the ongoing conversation.
Focus solely on statements representing the business owner's facts, pain points, or goals.

Context Entries:
${recentEntries.map((e: any) => `[Entry ID: ${e.id}]: ${e.text}`).join('\n')}

New Entry to Analyze (Entry ID: ${entry.id}):
${entry.text}

If there are no meaningful new facts in the New Entry, return empty arrays.
`;

    const schema = {
      "type": "object",
      "properties": {
        "interpretations": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "category_key": { "type": "string" },
              "facts": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "statement": { "type": "string" }
                  },
                  "required": ["statement"]
                }
              },
              "completion_state": {
                "type": "string",
                "enum": ["not_started", "in_progress", "complete", "not_yet_known"]
              }
            },
            "required": ["category_key", "facts", "completion_state"]
          }
        }
      },
      "required": ["interpretations"]
    };

    const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema
    });

    if (!aiResponse) {
      throw new Error('INVALID_AI_OUTPUT');
    }

    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    const interpretations = parsed?.output?.interpretations || parsed?.interpretations || [];

    if (interpretations.length === 0 && entry.text.length > 20) {
      throw new Error('INVALID_AI_OUTPUT');
    }

    const validCategoryKeys = [
      "reason_for_conversation", "owner_goals", "stated_pain", "present_process",
      "existing_tools_and_information", "what_works_and_must_be_protected",
      "missing_or_disconnected_pieces", "desired_improvement", "growth_readiness",
      "operational_capacity", "financial_considerations", "nta_fit",
      "potential_first_priority", "information_still_needed",
      "promises_and_representations", "agreed_next_step"
    ];

    const apiUrl = new URL(`/api/functions/updateDiscoveryCategory`, req.url).href;

    for (const interp of interpretations) {
      if (!validCategoryKeys.includes(interp.category_key)) continue;

      const validFacts = (interp.facts || []).map((f: any) => ({
        statement: f.statement,
        provenance_entry_id: String(entry.id),
        interpretation_version: targetVersion
      })).filter((f: any) => f.statement);

      if (validFacts.length > 0) {
        const updateRes = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${expectedToken}`
          },
          body: JSON.stringify({
            session_id: session.id,
            category_key: interp.category_key,
            completion_state: interp.completion_state,
            interpreted_facts: validFacts,
            provenance_entry_id: entry.id,
            interpretation_version: targetVersion
          })
        });

        if (!updateRes.ok) {
          throw new Error('CATEGORY_PROMOTION_FAILED');
        }
      }
    }

    await base44.asServiceRole.entities.CategoryInterpretationJob.update(jobId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return Response.json({ status: 'success' });

  } catch (error) {
    if (jobId) {
      let errorCode = 'LLM_INVOCATION_FAILED';
      if (error instanceof Error && ['INVALID_AI_OUTPUT', 'CATEGORY_PROMOTION_FAILED'].includes(error.message)) {
        errorCode = error.message;
      }
      await base44.asServiceRole.entities.CategoryInterpretationJob.update(jobId, {
        status: 'failed',
        last_error: errorCode
      });
    }
    return Response.json({ error: 'PROCESSING_FAILED' }, { status: 500 });
  }
});