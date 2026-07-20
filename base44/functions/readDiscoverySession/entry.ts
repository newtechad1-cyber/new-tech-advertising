
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key } = req.body;
  if (!session_id || !public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });
  if (['deleted', 'expired'].includes(session.status)) return res.status(403).json({ error: 'Session no longer active' });
  if (new Date(session.expires_at) < new Date()) return res.status(403).json({ error: 'Session expired' });

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
    last_activity_at: new Date().toISOString()
  });

  const [entries, categories, consents] = await Promise.all([
    base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id }),
    base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id }),
    base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id }),
  ]);

  return res.json({ session, entries, categories, consents });
}
  