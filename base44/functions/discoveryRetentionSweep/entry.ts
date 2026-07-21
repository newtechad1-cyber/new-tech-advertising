import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  // Internal Authorization: Constant-time comparison
  const authHeader = req.headers.get('authorization');
  const cronSecret = Deno.env.get('AGENT_WEBHOOK_KEY');

  if (!cronSecret || typeof cronSecret !== 'string' || cronSecret.trim() === '') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expectedHeader = `Bearer ${cronSecret}`;
  if (!authHeader || typeof authHeader !== 'string') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let mismatch = 0;
  if (expectedHeader.length !== authHeader.length) {
    mismatch = 1;
  }
  
  const len = Math.min(expectedHeader.length, authHeader.length);
  for (let i = 0; i < len; i++) {
    mismatch |= expectedHeader.charCodeAt(i) ^ authHeader.charCodeAt(i);
  }

  if (mismatch !== 0 || expectedHeader.length !== authHeader.length) {
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

  // EMERGENCY SAFETY LOCK: Require dry_run explicitly.
  if (body.dry_run !== true) {
    return Response.json({ error: 'Forbidden. Dry-run mode required.' }, { status: 403 });
  }

  const batchLimit = Math.min(Math.max(parseInt(body.batch_limit, 10) || 10, 1), 50);

  const base44 = createClientFromRequest(req);
  const now = new Date();

  const results = {
    eligible: 0,
    processed: 0,
    skipped: 0,
    failed: 0,
    reasons: {
      owner_requested: 0,
      expired_unsaved: 0
    }
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
        actor_type: 'owner',
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

        const protectInstructions = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.filter({
          session_id: s.id,
          action: 'save',
          status: { $in: ['pending', 'scheduled', 'completed'] }
        });

        if (protectConsents.length === 0 && protectInstructions.length === 0) {
          eligible = true;
          deletionReason = 'expired_unsaved';
        }
      }
    }

    if (!eligible) {
      results.skipped++;
      continue;
    }

    // Since this is strictly dry_run, we just count them and do no processing.
    results.eligible++;
    results.reasons[deletionReason]++;
  }

  return Response.json(results);
});