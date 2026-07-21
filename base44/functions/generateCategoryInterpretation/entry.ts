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

function authorized(req: Request): boolean {
  const secret = Deno.env.get('AGENT_WEBHOOK_KEY');
  return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}

function json(error: string, status: number): Response {
  return Response.json({ error }, { status });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json('METHOD_NOT_ALLOWED', 405);
  if (!authorized(req)) return json('AUTHORIZATION_FAILED', 401);

  let payload: Record<string, any>;
  try {
    payload = await req.json();
  } catch {
    return json('INVALID_PAYLOAD', 400);
  }

  // A raw entity-create event has no safe interpretation version or rebuild run.
  // It must eventually be routed through an approved coordinator.
  if (payload.event) {
    if (
      payload.event.type !== 'create' ||
      payload.event.entity_name !== 'DiscoveryConversationEntry' ||
      !payload.event.entity_id
    ) {
      return json('INVALID_AUTOMATION_EVENT', 400);
    }
    return json('INTERPRETATION_COORDINATOR_REQUIRED', 409);
  }

  const entryId = payload.entry_id;
  const runId = payload.run_id;
  if (typeof entryId !== 'string' || typeof runId !== 'string') {
    return json('INVALID_PAYLOAD', 400);
  }

  const base44 = createClientFromRequest(req);
  let job: any = null;

  try {
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.get(entryId);
    if (!entry || entry.speaker !== 'owner') return json('ENTRY_NOT_FOUND', 404);

    const session = await base44.asServiceRole.entities.DiscoverySession.get(entry.session_id);
    if (!session || INELIGIBLE_SESSION_STATUSES.includes(session.status)) {
      return json('SESSION_INELIGIBLE', 409);
    }

    const run = await base44.asServiceRole.entities.DiscoveryInterpretationRun.get(runId);
    if (
      !run ||
      run.session_id !== session.id ||
      run.status !== 'staging' ||
      !Number.isInteger(run.interpretation_version)
    ) {
      return json('INVALID_INTERPRETATION_RUN', 409);
    }

    const priorAttempts = await base44.asServiceRole.entities.CategoryInterpretationJob.filter({
      session_id: session.id,
      entry_id: entry.id,
      run_id: run.id
    });

    job = await base44.asServiceRole.entities.CategoryInterpretationJob.create({
      session_id: session.id,
      entry_id: entry.id,
      run_id: run.id,
      attempt_number: priorAttempts.length + 1,
      interpretation_version: run.interpretation_version,
      status: 'processing',
      started_at: new Date().toISOString()
    });

    const ownerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter(
      { session_id: session.id, speaker: 'owner' },
      '-occurred_at',
      50
    );
    if (!ownerEntries.some((candidate: any) => candidate.id === entry.id)) {
      ownerEntries.push(entry);
    }

    const allowedEvidenceIds = new Set(ownerEntries.map((candidate: any) => String(candidate.id)));
    const evidence = ownerEntries
      .map((candidate: any) => `[Entry ID: ${candidate.id}] ${candidate.text}`)
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

    let aiResponse: any;
    try {
      aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Interpret only explicit owner evidence. Analyze Entry ID ${entry.id}.
Do not treat an inference as owner-confirmed. Every fact extracted from the target
entry must cite that entry. Use only the supplied IDs.

Owner evidence:
${evidence}`,
        response_json_schema: schema
      });
    } catch {
      throw new Error('LLM_INVOCATION_FAILED');
    }

    const parsed = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
    const interpretations = parsed?.output?.interpretations ?? parsed?.interpretations;
    if (!Array.isArray(interpretations) || interpretations.length === 0) {
      throw new Error('INVALID_AI_OUTPUT');
    }

    const validated = interpretations.map((interpretation: any) => {
      if (!CATEGORY_KEYS.includes(interpretation.category_key)) {
        throw new Error('INVALID_AI_OUTPUT');
      }

      const facts = interpretation.facts.map((fact: any) => {
        const ids = fact.evidence_entry_ids.map(String);
        if (
          typeof fact.statement !== 'string' ||
          !fact.statement.trim() ||
          !ids.includes(String(entry.id)) ||
          ids.some((id: string) => !allowedEvidenceIds.has(id))
        ) {
          throw new Error('INVALID_AI_OUTPUT');
        }
        return {
          statement: fact.statement.trim(),
          provenance_entry_id: String(entry.id),
          evidence_entry_ids: [...new Set(ids)]
        };
      });

      const conflicts = interpretation.conflicts.map((conflict: any) => {
        const ids = conflict.conflicting_entry_ids.map(String);
        if (
          typeof conflict.statement !== 'string' ||
          !conflict.statement.trim() ||
          ids.some((id: string) => !allowedEvidenceIds.has(id))
        ) {
          throw new Error('INVALID_AI_OUTPUT');
        }
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

    for (const interpretation of validated) {
      const matches = await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
        session_id: session.id,
        run_id: run.id,
        interpretation_version: run.interpretation_version,
        category_key: interpretation.category_key
      });

      const existing = matches[0];
      const priorFacts = (existing?.interpreted_facts || []).filter(
        (fact: any) => fact.provenance_entry_id !== String(entry.id)
      );
      const priorUncertainties = (existing?.uncertainties || []).filter(
        (item: any) => item.provenance_entry_id !== String(entry.id)
      );
      const priorConflicts = (existing?.conflicts || []).filter(
        (item: any) => item.provenance_entry_id !== String(entry.id)
      );
      const now = new Date().toISOString();
      const data = {
        session_id: session.id,
        run_id: run.id,
        interpretation_version: run.interpretation_version,
        category_key: interpretation.category_key,
        completion_state: interpretation.completion_state,
        interpreted_facts: [...priorFacts, ...interpretation.facts],
        uncertainties: interpretation.uncertainty
          ? [...priorUncertainties, {
              statement: interpretation.uncertainty,
              provenance_entry_id: String(entry.id)
            }]
          : priorUncertainties,
        conflicts: [...priorConflicts, ...interpretation.conflicts],
        updated_at: now
      };

      if (existing) {
        await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.update(existing.id, data);
      } else {
        await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.create({
          ...data,
          created_at: now
        });
      }
    }

    await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return Response.json({
      status: 'completed',
      run_id: run.id,
      entry_id: entry.id,
      interpretation_version: run.interpretation_version
    });
  } catch (error) {
    const safeError =
      error instanceof Error &&
      ['INVALID_AI_OUTPUT', 'LLM_INVOCATION_FAILED', 'CATEGORY_STAGING_FAILED'].includes(error.message)
        ? error.message
        : 'CATEGORY_STAGING_FAILED';

    if (job) {
      await base44.asServiceRole.entities.CategoryInterpretationJob.update(job.id, {
        status: 'failed',
        last_error: safeError,
        completed_at: new Date().toISOString()
      });
    }
    return json('PROCESSING_FAILED', 500);
  }
});
