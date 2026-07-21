import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, text, speaker = 'owner', source_mode = 'text' } = body;

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
    if (!text || typeof text !== 'string' || text.trim() === '' || text.length > 5000) {
      return Response.json({ error: 'Invalid text payload' }, { status: 400 });
    }

    if (speaker !== 'owner') {
      return Response.json({ error: 'Cannot impersonate restricted speakers' }, { status: 403 });
    }
    
    if (source_mode !== 'text') {
      return Response.json({ error: 'Invalid source mode' }, { status: 403 });
    }

    const now = new Date().toISOString();
    
    // 3. Create Entry
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
      session_id, // Authenticated ownership
      speaker: 'owner', // Strictly enforced
      text: text.trim(),
      source_mode: 'text', // Strictly enforced
      occurred_at: now // Server-side timestamp
    });

    // 4. Update Parent Session
    const updateData: any = { last_activity_at: now };
    if (session.status === 'started') {
      updateData.status = 'in_progress';
    }
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, updateData);

    // 5. Return Safe Fields Only
    const safeEntry = {
      id: entry.id,
      session_id: entry.session_id,
      speaker: entry.speaker,
      text: entry.text,
      source_mode: entry.source_mode,
      occurred_at: entry.occurred_at
    };

    return Response.json(safeEntry);

  } catch (error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});