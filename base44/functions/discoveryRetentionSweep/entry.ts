import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  // Internal Authorization
  const authHeader = req.headers.get('authorization');
  const cronSecret = Deno.env.get('AGENT_WEBHOOK_KEY');

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body = {};
  try {
    const rawBody = await req.text();
    if (rawBody) {
      body = JSON.parse(rawBody);
    }
  } catch (e) {
    // Ignore invalid JSON body, proceed with defaults
  }

  const isDryRun = body.dry_run === true;
  const batchLimit = Math.min(Math.max(parseInt(body.batch_limit, 10) || 10, 1), 50);

  const base44 = createClientFromRequest(req);
  const now = new Date();

  // Find eligible sessions
  const results = {
    processed: 0,
    deleted: 0,
    failed: 0,
    dry_run: isDryRun,
    details: []
  };

  // 1. Owner-requested deletions
  const requestedSessions = await base44.asServiceRole.entities.DiscoverySession.filter(
    { status: 'deletion_requested' },
    null,
    batchLimit
  );

  // 2. Expiration-based deletions (only started, in_progress, paused)
  const expiringSessions = await base44.asServiceRole.entities.DiscoverySession.filter(
    { status: { $in: ['started', 'in_progress', 'paused'] } },
    null,
    batchLimit
  );

  // Combine and enforce batch limit across both streams
  const candidates = [...requestedSessions, ...expiringSessions].slice(0, batchLimit);

  for (const s of candidates) {
    let eligible = false;
    let deletionReason = '';

    if (s.status === 'deletion_requested') {
      const audits = await base44.asServiceRole.entities.DiscoveryAuditEvent.filter({
        session_id: s.id,
        event_type: 'deletion_requested',
        target_record_type: 'DiscoverySession'
      });
      if (audits.length > 0) {
        eligible = true;
        deletionReason = 'owner_requested';
      }
    } else if (['started', 'in_progress', 'paused'].includes(s.status)) {
      if (s.expires_at && new Date(s.expires_at) < now && !s.saved_at) {
        // Confirm no active save_and_return retention instruction protects it
        const protectConsents = await base44.asServiceRole.entities.DiscoveryConsent.filter({
          session_id: s.id,
          consent_type: 'save_and_return',
          state: 'granted',
          affirmative_action: true
        });
        if (protectConsents.length === 0) {
          eligible = true;
          deletionReason = 'expired_unsaved';
        }
      }
    }

    if (!eligible) continue;

    results.processed++;

    if (isDryRun) {
      results.deleted++;
      results.details.push({ session_id: s.id, reason: deletionReason, status: 'dry_run_eligible' });
      continue;
    }

    try {
      const sid = s.id;
      if (!sid || typeof sid !== 'string') {
        throw new Error('Invalid session ID');
      }

      // Re-verify session hasn't changed right before deletion
      const currentSession = await base44.asServiceRole.entities.DiscoverySession.get(sid);
      if (currentSession.status !== s.status) {
        throw new Error('Session state changed prior to deletion');
      }

      // Safe, scoped sequential deletion. 
      // If partial failure occurs, retrying is idempotent because deleteMany ignores empty matches.
      const toDelete = [
        'DiscoveryConversationEntry',
        'DiscoveryCategory',
        'DiscoveryConsent',
        'DiscoveryConfirmedSummary',
        'DiscoveryContactPreference',
        'DiscoveryHandoff',
        'DiscoveryRetentionInstruction',
        'DiscoveryAIObservation',
        'DiscoveryUsageCost'
      ];

      for (const entityName of toDelete) {
        await base44.asServiceRole.entities[entityName].deleteMany({ session_id: sid });
      }

      // Clean up non-essential AuditEvents, preserving proof of deletion
      await base44.asServiceRole.entities.DiscoveryAuditEvent.deleteMany({
        session_id: sid,
        event_type: { $nin: ['deletion_requested', 'deletion_completed', 'deletion_failed'] }
      });

      // Neutralize public session key & set tombstone on parent session
      await base44.asServiceRole.entities.DiscoverySession.update(sid, {
        public_session_key: '[DELETED]',
        status: 'deleted',
        deleted_at: now.toISOString(),
        anonymous_visitor_id: null,
        sales_lead_id: null // Unlink independent business records without deleting them
      });

      // Log successful deletion proof safely
      await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
        session_id: sid,
        event_type: 'deletion_completed',
        actor_type: 'system',
        actor_id: 'retention_sweep',
        occurred_at: new Date().toISOString(),
        target_record_type: 'DiscoverySession',
        target_record_id: sid,
        reason: `Processed deletion for reason: ${deletionReason}`
      });

      results.deleted++;
      results.details.push({ session_id: sid, status: 'deleted' });

    } catch (err) {
      results.failed++;
      results.details.push({ session_id: s.id, status: 'failed' });

      // Record safe internal failure state
      try {
        await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
          session_id: s.id,
          event_type: 'deletion_failed',
          actor_type: 'system',
          actor_id: 'retention_sweep',
          occurred_at: new Date().toISOString(),
          target_record_type: 'DiscoverySession',
          target_record_id: s.id,
          reason: 'Internal deletion sweep failed to complete all stages'
        });
      } catch (logErr) {
        // Do not expose database error internally
      }
    }
  }

  return Response.json({
    processed: results.processed,
    deleted: results.deleted,
    failed: results.failed,
    dry_run: results.dry_run
  });
});