
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  const now = new Date().toISOString();
  await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
    last_activity_at: now
  });

  const [entries, categories, consents, summaries] = await Promise.all([
    base44.asServiceRole.entities.DiscoveryConversationEntry.filter({ session_id }),
    base44.asServiceRole.entities.DiscoveryCategory.filter({ session_id }),
    base44.asServiceRole.entities.DiscoveryConsent.filter({ session_id }),
    base44.asServiceRole.entities.DiscoveryConfirmedSummary.filter({ session_id }),
  ]);

  // Strip sensitive internal fields before returning
  const safeSession = {
    id: session.id,
    mode: session.mode,
    stage: session.stage,
    status: session.status,
    created_at: session.created_at,
    last_activity_at: session.last_activity_at,
    expires_at: session.expires_at,
  };

  return res.json({ session: safeSession, entries, categories, consents, summaries });
}
