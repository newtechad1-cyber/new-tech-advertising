import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);
  let jobId = null;

  try {
    const { session_id, entry_id } = await req.json();

    if (!session_id || !entry_id) {
      return Response.json({ error: 'Missing session_id or entry_id' }, { status: 400 });
    }

    // 1. Idempotency Check
    // Note: Base44 lacks a confirmed database-level uniqueness constraint. 
    // Query-before-create alone is not fully atomic.
    const existingJobs = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
      session_id,
      entry_id
    });

    let job;
    if (existingJobs.length > 0) {
      job = existingJobs[0];
      if (job.status === 'completed' || job.status === 'processing') {
        return Response.json({ status: 'skipped', reason: 'already processed or processing' });
      }
      // If failed, we retry
      await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
        status: 'processing',
        retry_count: (job.retry_count || 0) + 1,
        started_at: new Date().toISOString()
      });
      jobId = job.id;
    } else {
      const newJob = await base44.asServiceRole.entities.CategoryInterpretationJob.create({
        session_id,
        entry_id,
        status: 'processing',
        started_at: new Date().toISOString()
      });
      jobId = newJob.id;
    }

    // 2. Load the referenced entry and verify it belongs to the session
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(entry_id);
    if (!entry || entry.session_id !== session_id) {
      throw new Error("Invalid or mismatched entry");
    }

    // 3. Load session context
    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session) {
      throw new Error("Session not found");
    }

    const categories = await base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id });
    
    // Load recent entries (bounded context) to help AI understand
    const recentEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.list(
      '-occurred_at', 
      10, 
      0, 
      { session_id }
    );
    // Sort chronological
    const contextEntries = recentEntries.sort((a: any, b: any) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime());

    // 4. Construct AI Prompt
    const prompt = `
You are extracting structured facts from a business discovery conversation.
Review the new conversation entry and the recent context, and extract any new facts or updates for the Discovery Categories.

Context Entries:
${contextEntries.map((e: any) => `[Entry ID: ${e.id}] ${e.speaker}: ${e.text}`).join('\n')}

New Entry to Analyze (Entry ID: ${entry.id}):
${entry.speaker}: ${entry.text}

Existing Categories:
${categories.map((c: any) => `- ${c.category_key} (${c.completion_state})`).join('\n')}

Based on the New Entry, update the categories. For any new fact identified, provide the statement and the exact Evidence Entry ID(s) that support it. If there are conflicts, list them.
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
                    "statement": { "type": "string" },
                    "evidence_entry_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["statement", "evidence_entry_ids"]
                }
              },
              "completion_state": {
                "type": "string",
                "enum": ["in_progress", "complete"]
              },
              "uncertainty": { "type": "string" },
              "conflicts": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "statement": { "type": "string" },
                    "conflicting_entry_ids": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["statement", "conflicting_entry_ids"]
                }
              }
            },
            "required": [
              "category_key",
              "facts",
              "completion_state",
              "uncertainty",
              "conflicts"
            ]
          }
        }
      },
      "required": ["interpretations"]
    };

    // 5. Invoke LLM
    const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema
    });

    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    const interpretations = parsed?.output?.interpretations || parsed?.interpretations || [];

    // 6. Update Categories via invoke
    const validCategoryKeys = [
      "reason_for_conversation", "owner_goals", "stated_pain", "present_process",
      "existing_tools_and_information", "what_works_and_must_be_protected",
      "missing_or_disconnected_pieces", "desired_improvement", "growth_readiness",
      "operational_capacity", "financial_considerations", "nta_fit",
      "potential_first_priority", "information_still_needed",
      "promises_and_representations", "agreed_next_step"
    ];

    for (const interp of interpretations) {
      if (!validCategoryKeys.includes(interp.category_key)) continue;

      // Ensure evidence contains the new entry id if missing, though we trust the AI
      await base44.asServiceRole.functions.invoke('updateDiscoveryCategory', {
        session_id,
        public_session_key: session.public_session_key,
        category_key: interp.category_key,
        completion_state: interp.completion_state,
        interpreted_facts: interp.facts,
        uncertainty: interp.uncertainty,
        conflicts: interp.conflicts
      });
    }

    // 7. Mark Job Completed
    await base44.asServiceRole.entities.CategoryInterpretationJob.update(jobId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return Response.json({ status: 'success' });

  } catch (error) {
    if (jobId) {
      await base44.asServiceRole.entities.CategoryInterpretationJob.update(jobId, {
        status: 'failed',
        last_error: String(error.message).substring(0, 500)
      });
    }
    // Record safe failure status without exposing private internal errors to visitors
    return Response.json({ status: 'failed', error: 'Interpretation failed to process.' }, { status: 500 });
  }
});