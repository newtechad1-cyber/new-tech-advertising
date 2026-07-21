import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const CATEGORY_KEYS = [
  'reason_for_conversation', 'owner_goals', 'stated_pain', 'present_process',
  'existing_tools_and_information', 'what_works_and_must_be_protected',
  'missing_or_disconnected_pieces', 'desired_improvement', 'growth_readiness',
  'operational_capacity', 'financial_considerations', 'nta_fit',
  'potential_first_priority', 'information_still_needed',
  'promises_and_representations', 'agreed_next_step'
] as const;

const INELIGIBLE_SESSION_STATUSES = [
  'deleted', 'deletion_requested', 'expired', 'completed', 'handoff_requested'
];

const SAFE_RUN_ERRORS = [
  'INVALID_AI_OUTPUT', 'LLM_INVOCATION_FAILED', 'CATEGORY_STAGING_FAILED',
  'STALE_INTERPRETATION_RUN'
] as const;

function authorized(req: Request): boolean {
  const secret = Deno.env.get('AGENT_WEBHOOK_KEY');
  return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}

function json(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

function safeFailure(error: unknown): typeof SAFE_RUN_ERRORS[number] {
  if (error instanceof Error && SAFE_RUN_ERRORS.includes(error.message as any)) {
    return error.message as typeof SAFE_RUN_ERRORS[number];
  }
  return 'CATEGORY_STAGING_FAILED';
}

function validateEvent(payload: any): string | null {
  if (!payload?.event) return null;
  if (
    payload.event.type !== 'create' ||
    payload.event.entity_name !== 'DiscoveryConversationEntry' ||
    typeof payload.event.entity_id !== 'string' ||
    !payload.event.entity_id
  ) {
    throw new Error('INVALID_AUTOMATION_EVENT');
  }
  return payload.event.entity_id;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json('METHOD_NOT_ALLOWED', 405);
  if (!authorized(req)) return json('AUTHORIZATION_FAILED', 401);

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json('INVALID_PAYLOAD', 400);
  }

  let eventEntryId: string | null;
  try {
    eventEntryId = validateEvent(payload);
  } catch {
    return json('INVALID_AUTOMATION_EVENT', 400);
  }

  if (!eventEntryId && typeof payload.session_id !== 'string') {
    return json('INVALID_PAYLOAD', 400);
  }

  const base44 = createClientFromRequest(req);
  let run: any = null;

  try {
    let sessionId = payload.session_id as string | undefined;
    if (eventEntryId) {
      const triggeringEntry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(eventEntryId);
      if (!triggeringEntry) return json('ENTRY_NOT_FOUND', 404);
      if (triggeringEntry.speaker !== 'owner') return json('NON_OWNER_ENTRY', 409);
      sessionId = triggeringEntry.session_id;
    }

    const session = await base44.asServiceRole.entities.DiscoverySession.get(sessionId!);
    if (!session || INELIGIBLE_SESSION_STATUSES.includes(session.status)) {
      return json('SESSION_INELIGIBLE', 409);
    }

    const ownerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
      { session_id: session.id, speaker: 'owner' },
      'occurred_at',
      500
    );
    if (ownerEntries.length === 0) return json('NO_OWNER_EVIDENCE', 409);
    if (eventEntryId && !ownerEntries.some((entry: any) => String(entry.id) === eventEntryId)) {
      return json('ENTRY_NOT_FOUND', 404);
    }

    const entryIds = ownerEntries.map((entry: any) => String(entry.id));
    const allowedEvidenceIds = new Set(entryIds);
    const states = await base44.asServiceRole.entities.DiscoveryInterpretationState.filter({
      session_id: session.id
    });
    const priorRuns = await base44.asServiceRole.entities.DiscoveryInterpretationRun.filter({
      session_id: session.id
    });
    const highestKnownVersion = Math.max(
      states[0]?.active_interpretation_version || 0,
      ...priorRuns.map((candidate: any) => candidate.interpretation_version || 0)
    );
    const now = new Date().toISOString();

    // Base44 has no confirmed compound uniqueness constraint. Concurrent coordinator
    // requests can both pass this query and create separate versions. Each remains
    // isolated; only a fully staged run can move the single active pointer.
    run = await base44.asServiceRole.entities.DiscoveryInterpretationRun.create({
      session_id: session.id,
      interpretation_version: highestKnownVersion + 1,
      status: 'staging',
      expected_entry_count: entryIds.length,
      completed_entry_count: 0,
      entry_ids: entryIds,
      triggering_entry_id: eventEntryId || undefined,
      started_at: now
    });

    const evidence = ownerEntries
      .map((entry: any) => `[Entry ID: ${entry.id}] ${entry.text}`)
      .join('\n');

    const schema = {
      type: 'object',
      properties: {
        interpretations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category_key: { type: 'string', enum: CATEGORY_KEYS },
              facts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    statement: { type: 'string' },
                    evidence_entry_ids: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['statement', 'evidence_entry_ids']
                }
              },
              completion_state: {
                type: 'string',
                enum: ['not_started', 'in_progress', 'complete', 'not_yet_known']
              },
              uncertainty: { type: 'string' },
              conflicts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    statement: { type: 'string' },
                    conflicting_entry_ids: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['statement', 'conflicting_entry_ids']
                }
              }
            },
            required: ['category_key', 'facts', 'completion_state', 'uncertainty', 'conflicts']
          }
        }
      },
      required: ['interpretations']
    };

    let completedCount = 0;
    for (const entry of ownerEntries) {
      const priorAttempts = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
        session_id: session.id,
        entry_id: entry.id,
        run_id: run.id
      });
      const job = await base44.asServiceRole.entities.CategoryInterpretationJob.create({
        session_id: session.id,
        entry_id: entry.id,
        run_id: run.id,
        attempt_number: priorAttempts.length + 1,
        interpretation_version: run.interpretation_version,
        status: 'processing',
        started_at: new Date().toISOString()
      });

      try {
        let aiResponse: any;
        try {
          aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: `Interpret only explicit owner evidence. Analyze Entry ID ${entry.id}.
Every fact extracted from the target entry must cite that entry. Use only the supplied IDs.
Do not treat an inference as owner-confirmed. Return at least one meaningful fact when the
target entry contains substantive owner content.\n\nOwner evidence:\n${evidence}`,
            response_json_schema: schema
          });
        } catch {
          throw new Error('LLM_INVOCATION_FAILED');
        }

        let parsed: any;
        try {
          parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
        } catch {
          throw new Error('INVALID_AI_OUTPUT');
        }
        const interpretations = parsed?.output?.interpretations ?? parsed?.interpretations;
        if (!Array.isArray(interpretations) || interpretations.length === 0) {
          throw new Error('INVALID_AI_OUTPUT');
        }

        let factCount = 0;
        const returnedCategoryKeys = new Set<string>();
        const validated = interpretations.map((interpretation: any) => {
          if (
            !CATEGORY_KEYS.includes(interpretation?.category_key) ||
            returnedCategoryKeys.has(interpretation.category_key) ||
            !['not_started', 'in_progress', 'complete', 'not_yet_known'].includes(
              interpretation.completion_state
            )
          ) {
            throw new Error('INVALID_AI_OUTPUT');
          }
          returnedCategoryKeys.add(interpretation.category_key);
          if (!Array.isArray(interpretation.facts) || !Array.isArray(interpretation.conflicts)) {
            throw new Error('INVALID_AI_OUTPUT');
          }
          const facts = interpretation.facts.map((fact: any) => {
            const ids = Array.isArray(fact.evidence_entry_ids)
              ? fact.evidence_entry_ids.map(String)
              : [];
            if (
              typeof fact.statement !== 'string' || !fact.statement.trim() ||
              !ids.includes(String(entry.id)) ||
              ids.some((id: string) => !allowedEvidenceIds.has(id))
            ) throw new Error('INVALID_AI_OUTPUT');
            factCount += 1;
            return {
              statement: fact.statement.trim(),
              provenance_entry_id: String(entry.id),
              evidence_entry_ids: [...new Set(ids)]
            };
          });
          const conflicts = interpretation.conflicts.map((conflict: any) => {
            const ids = Array.isArray(conflict.conflicting_entry_ids)
              ? conflict.conflicting_entry_ids.map(String)
              : [];
            if (
              typeof conflict.statement !== 'string' || !conflict.statement.trim() ||
              ids.some((id: string) => !allowedEvidenceIds.has(id))
            ) throw new Error('INVALID_AI_OUTPUT');
            return {
              statement: conflict.statement.trim(),
              provenance_entry_id: String(entry.id),
              conflicting_entry_ids: [...new Set(ids)]
            };
          });
          return {
            category_key: interpretation.category_key,
            completion_state: interpretation.completion_state,
            facts,
            uncertainty: String(interpretation.uncertainty || '').trim(),
            conflicts
          };
        });
        if (String(entry.text || '').trim().length >= 20 && factCount === 0) {
          throw new Error('INVALID_AI_OUTPUT');
        }

        for (const interpretation of validated) {
          const matches = await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
            session_id: session.id,
            run_id: run.id,
            interpretation_version: run.interpretation_version,
            category_key: interpretation.category_key
          });
          const existing = matches[0];
          const updatedAt = new Date().toISOString();
          const data = {
            session_id: session.id,
            run_id: run.id,
            interpretation_version: run.interpretation_version,
            category_key: interpretation.category_key,
            completion_state: interpretation.completion_state,
            interpreted_facts: [
              ...(existing?.interpreted_facts || []).filter(
                (fact: any) => fact.provenance_entry_id !== String(entry.id)
              ),
              ...interpretation.facts
            ],
            uncertainties: [
              ...(existing?.uncertainties || []).filter(
                (item: any) => item.provenance_entry_id !== String(entry.id)
              ),
              ...(interpretation.uncertainty
                ? [{ statement: interpretation.uncertainty, provenance_entry_id: String(entry.id) }]
                : [])
            ],
            conflicts: [
              ...(existing?.conflicts || []).filter(
                (item: any) => item.provenance_entry_id !== String(entry.id)
              ),
              ...interpretation.conflicts
            ],
            updated_at: updatedAt
          };
          if (existing) {
            await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.update(existing.id, data);
          } else {
            await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.create({
              ...data,
              created_at: updatedAt
            });
          }
        }

        await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
          status: 'completed',
          completed_at: new Date().toISOString()
        });
        completedCount += 1;
        await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
          completed_entry_count: completedCount
        });
      } catch (entryError) {
        const errorCode = safeFailure(entryError);
        await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
          status: 'failed',
          last_error: errorCode,
          completed_at: new Date().toISOString()
        });
        throw new Error(errorCode);
      }
    }

    const stagedCategories = await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
      session_id: session.id,
      run_id: run.id,
      interpretation_version: run.interpretation_version
    });
    if (completedCount !== entryIds.length || stagedCategories.length === 0) {
      throw new Error('CATEGORY_STAGING_FAILED');
    }

    const completedAt = new Date().toISOString();
    await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
      status: 'ready',
      completed_entry_count: completedCount,
      completed_at: completedAt
    });

    const currentStates = await base44.asServiceRole.entities.DiscoveryInterpretationState.filter({
      session_id: session.id
    });
    const currentState = currentStates[0];
    if (
      currentState &&
      currentState.active_run_id !== run.id &&
      currentState.active_interpretation_version >= run.interpretation_version
    ) {
      throw new Error('STALE_INTERPRETATION_RUN');
    }

    if (currentState) {
      await base44.asServiceRole.entities.DiscoveryInterpretationState.update(currentState.id, {
        active_interpretation_version: run.interpretation_version,
        active_run_id: run.id,
        updated_at: completedAt
      });
    } else {
      await base44.asServiceRole.entities.DiscoveryInterpretationState.create({
        session_id: session.id,
        active_interpretation_version: run.interpretation_version,
        active_run_id: run.id,
        updated_at: completedAt
      });
    }

    await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
      status: 'promoted',
      promoted_at: completedAt
    });

    return Response.json({
      status: 'promoted',
      run_id: run.id,
      interpretation_version: run.interpretation_version,
      processed_entry_count: completedCount
    });
  } catch (error) {
    const errorCode = safeFailure(error);
    if (run) {
      try {
        await base44.asServiceRole.entities.DiscoveryInterpretationRun.update(run.id, {
          status: 'failed',
          safe_error: errorCode,
          completed_at: new Date().toISOString()
        });
      } catch {
        // Never replace the controlled client response with a raw provider error.
      }
    }
    return json(errorCode, 500);
  }
});
