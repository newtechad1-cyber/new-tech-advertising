import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, target, action } = body;

    // 1. Inline Session Authentication
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

    // 2. Validate Retention Parameters
    const validTargets = ['raw_audio', 'working_transcript', 'working_discovery', 'confirmed_summary', 'relationship_record'];
    const validActions = ['delete', 'save'];
    
    if (!target || !action || !validTargets.includes(target) || !validActions.includes(action)) {
      return Response.json({ error: 'Invalid retention instruction' }, { status: 400 });
    }

    // Whole-session deletion must go through requestDiscoveryDeletion, which requires
    // explicit owner confirmation and creates the canonical deletion-request audit proof.
    if (action === 'delete') {
      return Response.json({ error: 'Use the confirmed deletion-request flow' }, { status: 400 });
    }

    const now = new Date();
    const nowIso = now.toISOString();

    let sessionUpdates: any = { last_activity_at: nowIso };
    let expiresAt = new Date(session.expires_at);

    // 3. Process Save vs Delete
    if (action === 'save') {
      // Require existing granted save_and_return consent
      const consents = await base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id, consent_type: 'save_and_return' });
      const saveConsent = consents[0];
      
      if (!saveConsent || saveConsent.state !== 'granted' || saveConsent.affirmative_action !== true) {
        return Response.json({ error: 'Missing or invalid save_and_return consent' }, { status: 403 });
      }
      
      sessionUpdates.saved_at = nowIso;
      sessionUpdates.status = 'saved';
      // Server-side timestamp: Extend expiration by 30 days
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      sessionUpdates.expires_at = expiresAt.toISOString();
    } else if (action === 'delete') {
      sessionUpdates.status = 'deletion_requested';
      expiresAt = now; // Expire immediately for the cleanup sweep
      sessionUpdates.expires_at = expiresAt.toISOString();
    }

    // 4. Create Canonical Retention Instruction
    const instruction = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.create({
      session_id,
      target,
      action,
      status: 'pending',
      requested_by: 'owner',
      requested_at: nowIso
    });

    // 5. Update Parent Session
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, sessionUpdates);

    // 6. Create Audit Event
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id,
      event_type: 'retention_changed',
      actor_type: 'owner',
      actor_id: session.anonymous_visitor_id || 'anonymous_owner',
      occurred_at: nowIso,
      target_record_type: 'DiscoveryRetentionInstruction',
      target_record_id: instruction.id,
      reason: `Owner requested to ${action} ${target}`,
      metadata: { target, action }
    });

    // 7. Return Safe Fields Only
    return Response.json({
      id: instruction.id,
      session_id: instruction.session_id,
      target: instruction.target,
      action: instruction.action,
      status: instruction.status,
      requested_by: instruction.requested_by,
      requested_at: instruction.requested_at,
      session_updates: {
        saved_at: sessionUpdates.saved_at,
        expires_at: sessionUpdates.expires_at,
        status: sessionUpdates.status,
        last_activity_at: sessionUpdates.last_activity_at
      }
    });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});