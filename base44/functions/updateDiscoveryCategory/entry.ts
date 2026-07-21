import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const CATEGORY_KEYS = [
  'reason_for_conversation', 'owner_goals', 'stated_pain', 'present_process',
  'existing_tools_and_information', 'what_works_and_must_be_protected',
  'missing_or_disconnected_pieces', 'desired_improvement', 'growth_readiness',
  'operational_capacity', 'financial_considerations', 'nta_fit',
  'potential_first_priority', 'information_still_needed',
  'promises_and_representations', 'agreed_next_step'
];

function authorized(req: Request): boolean {
  const secret = Deno.env.get('AGENT_WEBHOOK_KEY');
  return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
  }
  if (!authorized(req)) {
    return Response.json({ error: 'AUTHORIZATION_FAILED' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
  }

  const {
    session_id: sessionId,
    run_id: runId,
    entry_id: entryId,
    category_key: categoryKey,
    completion_state: completionState,
    facts,
    uncertainty,
    conflicts
  } = payload;

  if (
    typeof sessionId !== 'string' ||
    typeof runId !== 'string' ||
    typeof entryId !== 'string' ||
    !CATEGORY_KEYS.includes(categoryKey) ||
    !['not_started', 'in_progress', 'complete', 'not_yet_known'].includes(completionState) ||
    !Array.isArray(facts) ||
    !Array.isArray(conflicts)
  ) {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  try {
    const [session, entry, run] = await Promise.all([
      base44.asServiceRole.entities.DiscoverySession.get(sessionId),
      base44.asServiceRole.entities.DiscoveryConversationEntry.get(entryId),
      base44.asServiceRole.entities.DiscoveryInterpretationRun.get(runId)
    ]);

    if (
      !session ||
      ['deleted', 'deletion_requested', 'expired', 'completed', 'handoff_requested'].includes(session.status)
    ) {
      return Response.json({ error: 'SESSION_INELIGIBLE' }, { status: 409 });
    }
    if (!entry || entry.session_id !== sessionId || entry.speaker !== 'owner') {
      return Response.json({ error: 'INVALID_PROVENANCE' }, { status: 400 });
    }
    if (!run || run.session_id !== sessionId || run.status !== 'staging') {
      return Response.json({ error: 'INVALID_INTERPRETATION_RUN' }, { status: 409 });
    }

    const ownerEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({
      session_id: sessionId,
      speaker: 'owner'
    });
    const allowedIds = new Set(ownerEntries.map((candidate: any) => String(candidate.id)));

    const validatedFacts = facts.map((fact: any) => {
      const evidenceIds = Array.isArray(fact.evidence_entry_ids)
        ? fact.evidence_entry_ids.map(String)
        : [];
      if (
        typeof fact.statement !== 'string' ||
        !fact.statement.trim() ||
        !evidenceIds.includes(entryId) ||
        evidenceIds.some((id: string) => !allowedIds.has(id))
      ) {
        throw new Error('INVALID_PROVENANCE');
      }
      return {
        statement: fact.statement.trim(),
        provenance_entry_id: entryId,
        evidence_entry_ids: [...new Set(evidenceIds)]
      };
    });

    const validatedConflicts = conflicts.map((conflict: any) => {
      const conflictingIds = Array.isArray(conflict.conflicting_entry_ids)
        ? conflict.conflicting_entry_ids.map(String)
        : [];
      if (
        typeof conflict.statement !== 'string' ||
        !conflict.statement.trim() ||
        conflictingIds.some((id: string) => !allowedIds.has(id))
      ) {
        throw new Error('INVALID_PROVENANCE');
      }
      return {
        statement: conflict.statement.trim(),
        provenance_entry_id: entryId,
        conflicting_entry_ids: [...new Set(conflictingIds)]
      };
    });

    const matches = await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
      session_id: sessionId,
      run_id: runId,
      interpretation_version: run.interpretation_version,
      category_key: categoryKey
    });
    const existing = matches[0];
    const now = new Date().toISOString();
    const data = {
      session_id: sessionId,
      run_id: runId,
      interpretation_version: run.interpretation_version,
      category_key: categoryKey,
      completion_state: completionState,
      interpreted_facts: [
        ...(existing?.interpreted_facts || []).filter(
          (fact: any) => fact.provenance_entry_id !== entryId
        ),
        ...validatedFacts
      ],
      uncertainties: [
        ...(existing?.uncertainties || []).filter(
          (item: any) => item.provenance_entry_id !== entryId
        ),
        ...(typeof uncertainty === 'string' && uncertainty.trim()
          ? [{ statement: uncertainty.trim(), provenance_entry_id: entryId }]
          : [])
      ],
      conflicts: [
        ...(existing?.conflicts || []).filter(
          (item: any) => item.provenance_entry_id !== entryId
        ),
        ...validatedConflicts
      ],
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

    return Response.json({
      status: 'staged',
      run_id: runId,
      interpretation_version: run.interpretation_version
    });
  } catch {
    return Response.json({ error: 'CATEGORY_STAGING_FAILED' }, { status: 500 });
  }
});
