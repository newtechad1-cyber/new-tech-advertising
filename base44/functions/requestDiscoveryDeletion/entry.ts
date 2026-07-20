
import { base44 } from '@base44/sdk';
import { authenticateSession } from '../discoveryAuthHelper/entry.ts';

export default async function(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id, public_session_key } = req.body;
  
  const auth = await authenticateSession(session_id, public_session_key, true);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });
  const { session } = auth;
  
  if (session.status === 'deleted' || session.status === 'deletion_requested') {
    return res.status(400).json({ error: 'Deletion already requested or completed' });
  }

  const now = new Date().toISOString();

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, {
    status: 'deletion_requested',
    last_activity_at: now
  });

  const instruction = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.create({
    session_id,
    target: 'working_discovery',
    action: 'delete',
    requested_by: 'owner',
    requested_at: now,
    status: 'pending'
  });

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'deletion_requested',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryRetentionInstruction',
    target_record_id: instruction.id,
    reason: 'Owner requested deletion'
  });

  return res.json({ status: 'deletion_requested', message: 'Your data has been queued for secure deletion.' });
}
