
import { base44 } from '@base44/sdk';

export default async function(req, res) {
  const now = new Date();
  
  const expiredSessions = await base44.asServiceRole.entities.DiscoverySession.filter({
    status: { $nin: ['completed', 'deleted', 'expired'] },
    expires_at: { $lt: now.toISOString() }
  });

  for (const session of expiredSessions) {
    await base44.asServiceRole.entities.DiscoverySession.update(session.id, { status: 'expired' });
    await base44.asServiceRole.entities.DiscoveryAuditEvent.create({
      session_id: session.id,
      event_type: 'status_changed',
      actor_type: 'system',
      occurred_at: now.toISOString(),
      reason: 'Session expired by retention sweep'
    });
  }

  const pendingDeletions = await base44.asServiceRole.entities.DiscoveryRetentionInstruction.filter({
    status: 'pending',
    action: 'delete'
  });

  for (const instr of pendingDeletions) {
    try {
      if (instr.target === 'working_discovery') {
        await base44.asServiceRole.entities.DiscoverySession.update(instr.session_id, { status: 'deleted', deleted_at: now.toISOString() });
      }

      await base44.asServiceRole.entities.DiscoveryRetentionInstruction.update(instr.id, {
        status: 'completed',
        completed_at: now.toISOString(),
        deletion_proof: 'system_deleted_' + Date.now()
      });
    } catch (e) {
      await base44.asServiceRole.entities.DiscoveryRetentionInstruction.update(instr.id, {
        status: 'failed',
        failure_reason: e.message
      });
      await base44.asServiceRole.entities.Task.create({
        title: 'Failed Discovery Deletion',
        description: 'Failed to delete target: ' + instr.target,
        status: 'todo',
        priority: 'high'
      });
    }
  }

  return res.json({ processed_expirations: expiredSessions.length, processed_deletions: pendingDeletions.length });
}
  