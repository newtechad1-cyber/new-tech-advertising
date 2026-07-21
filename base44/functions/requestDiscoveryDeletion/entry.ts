import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, confirm_deletion } = body;

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

    // Reject already physically deleted or naturally expired
    if (session.status === 'deleted' || (session.expires_at && new Date(session.expires_at) < new Date())) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Require explicit confirmation only after authentication succeeds.
    // This keeps malformed or mismatched credentials behind the same generic 401 boundary.
    if (confirm_deletion !== true) {
      return Response.json({ error: 'Explicit owner confirmation required to process deletion' }, { status: 400 });
    }

    // 3. Idempotent Return for Already Requested
    if (session.status === 'deletion_requested') {
      // Find original audit event for accurate timestamp
      const auditEvents = await base44.asServiceRole.entities.DiscoveryAuditEvent.filter({
        session_id,
        event_type: 'deletion_requested',
        actor_type: 'owner',
        target_record_type: 'DiscoverySession'
      });
      const originalEvent = auditEvents
        .filter((event: any) => event.occurred_at)
        .sort((left: any, right: any) => new Date(left.occurred_at).getTime() - new Date(right.occurred_at).getTime())[0];
      const originalTime = originalEvent?.occurred_at || session.last_activity_at;
      
      return Response.json({
        session_id: session.id,
        status: 'deletion_requested',
        deletion_requested_at: originalTime,
        request_accepted: true
      });
    }

    const now = new Date().toISOString();

    // 4. Mark Session for Protected Deletion
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
      status: 'deletion_requested',
      last_activity_at: now
    });

    // 5. Neutralize Pending Retention Saves (if applicable to policy)
    const pendingSaves = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.filter({ 
      session_id, 
      action: 'save', 
      status: 'pending' 
    });
    for (const inst of pendingSaves) {
      await base44.asServiceRole.entities.DiscoveryRetentionInstruction.update(inst.id, { status: 'cancelled' });
    }

    // 6. Create Auditable Proof
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id,
      event_type: 'deletion_requested',
      actor_type: 'owner',
      actor_id: session.anonymous_visitor_id || 'anonymous_owner',
      occurred_at: now,
      target_record_type: 'DiscoverySession',
      target_record_id: session_id,
      reason: 'Owner explicitly requested complete session deletion'
    });

    // 7. Safe Response
    return Response.json({
      session_id: session.id,
      status: 'deletion_requested',
      deletion_requested_at: now,
      request_accepted: true
    });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});