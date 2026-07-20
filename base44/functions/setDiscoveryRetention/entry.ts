
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const { session_id, public_session_key, target, action } = req.body;
  
  const session = await base44.asServiceRole.entities.DiscoverySession.get(session_id);
  if (!session || session.public_session_key !== public_session_key) return res.status(401).json({ error: 'Unauthorized' });

  const now = new Date().toISOString();

  const instruction = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.create({
    session_id,
    target,
    action,
    requested_by: 'owner',
    requested_at: now,
    status: 'pending'
  });

  await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
    session_id,
    event_type: 'retention_changed',
    actor_type: 'owner',
    occurred_at: now,
    target_record_type: 'DiscoveryRetentionInstruction',
    target_record_id: instruction.id
  });

  return res.json(instruction);
}
  