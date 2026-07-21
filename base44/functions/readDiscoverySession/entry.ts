import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
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

    const [entries, categories, consents, summaries, contactPreferences, handoffs] = await Promise.all([
      base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryContactPreference.filter({ session_id }),
      base44.asServiceRole.entities.DiscoveryHandoff.filter({ session_id })
    ]);

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
      handoffs: safeHandoffs
    });

  } catch (e) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});