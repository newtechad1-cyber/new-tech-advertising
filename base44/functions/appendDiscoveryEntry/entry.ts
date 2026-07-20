
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, text, speaker = 'owner', source_mode = 'text' } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });
  
  if (['rick', 'ai_service', 'system'].includes(speaker)) {
    return res.status(403).json({ error: 'Cannot impersonate restricted speakers' });
  }

  const now = new Date().toISOString();
  
  const entry = await base44.asServiceRole.entities.DiscoveryConversationEntry.create({
    session_id,
    speaker,
    text,
    source_mode,
    occurred_at: now
  });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { last_activity_at: now });
  return res.json(entry);
}
  