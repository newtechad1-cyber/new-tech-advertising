
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const now = new Date().toISOString();

  await base44.asServiceRole.entities.DiscoverySession.update(session_id, { status: 'deletion_requested' });
  
  await base44.asServiceRole.entities.DiscoveryRetentionInstruction.create({
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
    target_record_type: 'DiscoverySession',
    target_record_id: session_id
  });

  return res.json({ status: 'deletion_requested' });
}
  