import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { session_id, public_session_key, text, speaker = 'owner', source_mode = 'text' } = body;

    if (!session_id || !public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
    if (!session || session.public_session_key !== public_session_key) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (['deleted', 'expired', 'deletion_requested'].includes(session.status)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
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

    const now = new Date().toISOString();
    
    const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
      session_id,
      speaker: 'owner',
      text: text.trim(),
      source_mode: 'text',
      occurred_at: now
    });

    const updateData: any = { last_activity_at: now };
    if (session.status === 'started') {
      updateData.status = 'in_progress';
    }
    await base44.asServiceRole.entities.DiscoverySession.update(session_id, updateData);

    const safeEntry = {
      id: entry.id,
      session_id: entry.session_id,
      speaker: entry.speaker,
      text: entry.text,
      source_mode: entry.source_mode,
      occurred_at: entry.occurred_at
    };

    return Response.json(safeEntry);
  } catch (e) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
});