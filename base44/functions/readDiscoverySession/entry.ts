import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const TRUSTED_PUBLIC_ORIGINS = new Set([
  'https://newtechadvertising.com',
  'https://www.newtechadvertising.com',
  'https://app.newtechadvertising.com',
  'https://new-tech-advertising.base44.app',
]);
const REQUEST_WINDOW_MS = 15 * 60 * 1000;
const REQUEST_LIMIT = 24;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isTrustedPublicOrigin(req: Request) {
  const rawOrigin = req.headers.get('origin') || req.headers.get('referer');
  if (!rawOrigin) return false;

  try {
    return TRUSTED_PUBLIC_ORIGINS.has(new URL(rawOrigin).origin);
  } catch {
    return false;
  }
}

function requestClientIdentity(req: Request) {
  return String(
    req.headers.get('cf-connecting-ip')
    || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown',
  ).slice(0, 128);
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const key = requestClientIdentity(req);
  let bucket = requestBuckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + REQUEST_WINDOW_MS };
    requestBuckets.set(key, bucket);
  }

  if (bucket.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
  return 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const publicBoundaryUser = await base44.auth.me().catch(() => null);
    const trustedPublicService = publicBoundaryUser?.role === 'admin' || publicBoundaryUser?.is_service === true;

    if (!trustedPublicService && !isTrustedPublicOrigin(req)) {
      return Response.json({ error: 'Untrusted request origin' }, { status: 403 });
    }

    if (!trustedPublicService) {
      const retryAfterSeconds = isRateLimited(req);
      if (retryAfterSeconds) {
        return Response.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
    }
    const body = await req.json();
    const { session_id, public_session_key } = body;

    if (!session_id || !public_session_key || typeof session_id !== 'string' || typeof public_session_key !== 'string') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let session;
    try {
      session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    } catch (e) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
      last_activity_at: now
    });

    const [entries, categories, consents, summaries, contactPreferences, handoffs, interpretationStates] = await Promise.all([
      base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryContactPreference.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryHandoff.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryInterpretationState.filter({ session_id })
    ]);

    const activeInterpretationVersion = interpretationStates[0]?.active_interpretation_version || 0;
    const activeInterpretations = activeInterpretationVersion > 0
      ? await base44.asServiceRole.entities.DiscoveryCategoryInterpretation.filter({
          session_id,
          interpretation_version: activeInterpretationVersion
        })
      : [];

    const safeInterpretations = activeInterpretations.map((interpretation: any) => ({
      category_key: interpretation.category_key,
      completion_state: interpretation.completion_state,
      interpreted_facts: (interpretation.interpreted_facts || []).map((fact: any) => ({
        statement: fact.statement,
        evidence_entry_ids: fact.evidence_entry_ids || []
      })),
      uncertainties: (interpretation.uncertainties || []).map((item: any) => ({ statement: item.statement })),
      conflicts: (interpretation.conflicts || []).map((item: any) => ({ statement: item.statement }))
    }));

    const safeSession = {
      id: session.id,
      model_version: session.model_version,
      mode: session.mode,
      stage: session.stage,
      status: session.status,
      created_at: session.created_at,
      last_activity_at: now,
      expires_at: session.expires_at,
      saved_at: session.saved_at,
      confirmed_at: session.confirmed_at
    };

    const safeEntries = entries.map((e: any) => ({
      id: e.id,
      session_id: e.session_id,
      speaker: e.speaker,
      text: e.text,
      source_mode: e.source_mode,
      occurred_at: e.occurred_at,
      confidence: e.confidence,
      uncertainty: e.uncertainty,
      corrects_entry_id: e.corrects_entry_id,
      correction_reason: e.correction_reason,
      superseded_at: e.superseded_at
    }));

    const safeCategories = categories.map((c: any) => ({
      id: c.id,
      session_id: c.session_id,
      category_key: c.category_key,
      owner_supported_facts: c.owner_supported_facts,
      supporting_entry_ids: c.supporting_entry_ids,
      completion_state: c.completion_state,
      updated_at: c.updated_at
    }));

    const safeConsents = consents.map((c: any) => ({
      id: c.id,
      session_id: c.session_id,
      consent_type: c.consent_type,
      state: c.state,
      affirmative_action: c.affirmative_action,
      notice_version: c.notice_version,
      captured_at: c.captured_at,
      withdrawn_at: c.withdrawn_at,
      source: c.source
    }));

    const safeSummaries = summaries.map((s: any) => ({
      id: s.id,
      session_id: s.session_id,
      version: s.version,
      why_owner_came: s.why_owner_came,
      owner_goal: s.owner_goal,
      greatest_difficulty: s.greatest_difficulty,
      present_process: s.present_process,
      what_is_working: s.what_is_working,
      possibly_missing_or_disconnected: s.possibly_missing_or_disconnected,
      desired_improvement: s.desired_improvement,
      readiness: s.readiness,
      information_still_needed: s.information_still_needed,
      owner_corrections: s.owner_corrections,
      confirmation_state: s.confirmation_state,
      created_at: s.created_at,
      confirmed_at: s.confirmed_at
    }));

    const safeContactPreferences = contactPreferences.map((c: any) => ({
      id: c.id,
      session_id: c.session_id,
      preferred_channel: c.preferred_channel,
      name: c.name,
      email: c.email,
      phone: c.phone,
      best_time: c.best_time,
      follow_up_consent_id: c.follow_up_consent_id
    }));

    const safeHandoffs = handoffs.map((h: any) => ({
      id: h.id,
      session_id: h.session_id,
      handoff_type: h.handoff_type,
      requested_at: h.requested_at,
      rick_review_state: h.rick_review_state,
      confirmed_summary_id: h.confirmed_summary_id,
      contact_preference_id: h.contact_preference_id,
      suggested_follow_up_questions: h.suggested_follow_up_questions
    }));

    return Response.json({
      session: safeSession,
      entries: safeEntries,
      categories: safeCategories,
      consents: safeConsents,
      summaries: safeSummaries,
      contactPreferences: safeContactPreferences,
      handoffs: safeHandoffs,
      interpretation: {
        active_version: activeInterpretationVersion,
        categories: safeInterpretations
      }
    });

  } catch (e) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});
