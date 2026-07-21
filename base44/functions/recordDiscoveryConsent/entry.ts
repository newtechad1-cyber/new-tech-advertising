import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, consent_type, state, notice_version, source, affirmative_action } = body;

    // 1. Inline Session Authentication
    if (!session_id || !public_session_key || !consent_type || !state || !source) {
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

    // 2. Consent Specific Validations
    const validTypes = ['microphone', 'transcription', 'raw_audio_retention', 'save_and_return', 'personal_follow_up', 'journal'];
    if (!validTypes.includes(consent_type)) {
      return Response.json({ error: 'Invalid consent type' }, { status: 400 });
    }

    // "not_asked" is an internal/default state, not an owner decision. Allowing a
    // public caller to submit it would erase a recorded choice without an audit event.
    const validOwnerStates = ['granted', 'declined', 'withdrawn'];
    if (!validOwnerStates.includes(state)) {
      return Response.json({ error: 'Invalid owner consent state' }, { status: 400 });
    }

    // Public callers can only use owner-controlled sources
    const validSources = ['website_text', 'website_voice'];
    if (!validSources.includes(source)) {
      return Response.json({ error: 'Invalid or restricted consent source' }, { status: 403 });
    }

    if (state === 'granted' && affirmative_action !== true) {
      return Response.json({ error: 'Granted consent requires affirmative action' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // 3. Find existing consent for this type
    const existingConsents = await base44.asServiceRole.entities.DiscoveryConsent.filter({
      session_id,
      consent_type
    });
    const existing = existingConsents.length > 0 ? existingConsents[0] : null;

    if (state === 'withdrawn' && (!existing || existing.state !== 'granted')) {
      return Response.json({ error: 'Only granted consent can be withdrawn' }, { status: 400 });
    }

    const isStateChange = !existing || existing.state !== state;

    let captured_at = existing?.captured_at || undefined;
    let withdrawn_at = existing?.withdrawn_at || undefined;

    if (state === 'granted' && isStateChange) {
      captured_at = now;
      withdrawn_at = undefined; // reset withdrawal
    } else if (state === 'withdrawn' && isStateChange) {
      withdrawn_at = now;
    }

    const finalNoticeVersion = notice_version || existing?.notice_version || '1.0';

    const consentData = {
      session_id,
      consent_type,
      state,
      affirmative_action: state === 'granted' ? true : false,
      notice_version: finalNoticeVersion,
      source,
      captured_at,
      withdrawn_at
    };

    let consentRecord;
    if (existing) {
      await base44.asServiceRole.entities.DiscoveryConsent.update(existing.id, consentData);
      consentRecord = { id: existing.id, ...consentData };
    } else {
      consentRecord = await base44.asServiceRole.entities.DiscoveryConsent.create(consentData);
    }

    // 4. Audit Trail
    if (['granted', 'declined', 'withdrawn'].includes(state) && isStateChange) {
      await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
        session_id,
        event_type: 'consent_changed',
        actor_type: 'owner',
        actor_id: session.anonymous_visitor_id || 'anonymous_owner',
        occurred_at: now,
        target_record_type: 'DiscoveryConsent',
        target_record_id: consentRecord.id,
        reason: `Consent ${state} for ${consent_type} via ${source}`,
        metadata: { previous_state: existing?.state || 'not_asked', new_state: state }
      });
    }

    // 5. Update Parent Session
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });

    // 6. Return Safe Fields Only
    return Response.json({
      id: consentRecord.id,
      session_id: consentRecord.session_id,
      consent_type: consentRecord.consent_type,
      state: consentRecord.state,
      affirmative_action: consentRecord.affirmative_action,
      notice_version: consentRecord.notice_version,
      captured_at: consentRecord.captured_at,
      withdrawn_at: consentRecord.withdrawn_at,
      source: consentRecord.source
    });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});