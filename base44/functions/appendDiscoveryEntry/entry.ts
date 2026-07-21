import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const {
      session_id,
      public_session_key,
      client_request_id,
      text,
      speaker = 'owner',
      source_mode = 'text'
    } = body;

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

    const answerableStatuses = ['started', 'in_progress', 'paused'];
    if (!answerableStatuses.includes(session.status)) {
      return Response.json({ error: 'Session is not accepting answers' }, { status: 409 });
    }

    // 2. Input Validation
    if (
      !client_request_id ||
      typeof client_request_id !== 'string' ||
      client_request_id.length > 128
    ) {
      return Response.json({ error: 'Invalid client request ID' }, { status: 400 });
    }

    if (!text || typeof text !== 'string' || text.trim() === '' || text.length > 5000) {
      return Response.json({ error: 'Invalid text payload' }, { status: 400 });
    }

    if (speaker !== 'owner') {
      return Response.json({ error: 'Cannot impersonate restricted speakers' }, { status: 403 });
    }
    
    if (source_mode !== 'text') {
      return Response.json({ error: 'Invalid source mode' }, { status: 403 });
    }

    const safeFields = (entry: any) => ({
      id: entry.id,
      session_id: entry.session_id,
      client_request_id: entry.client_request_id,
      speaker: entry.speaker,
      text: entry.text,
      source_mode: entry.source_mode,
      occurred_at: entry.occurred_at
    });

    // 3. Return the original entry when the browser retries one logical submission.
    // Base44 does not provide a compound unique constraint here, so this check is
    // intentionally idempotent for normal retries but is not fully atomic against
    // malicious or extreme concurrent requests.
    const existingEntries = await base44.asServiceRole.entities.DiscoveryConversationEntry.filter({
      session_id,
      client_request_id
    });
    if (existingEntries.length > 0) {
      return Response.json({ ...safeFields(existingEntries[0]), replayed: true });
    }

    const now = new Date().toISOString();

    // 4. Create Entry
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
      session_id,
      client_request_id,
      speaker: 'owner',
      text: text.trim(),
      source_mode: 'text',
      occurred_at: now
    });

    // 5. Update Parent Session
    const updateData: any = { last_activity_at: now };
    if (session.status === 'started') {
      updateData.status = 'in_progress';
    }
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, updateData);

    // 6. Return Safe Fields Only
    return Response.json({ ...safeFields(entry), replayed: false });

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});